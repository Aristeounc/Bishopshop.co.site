import { firestore, COLLECTIONS } from '@/config/firebase';
import { PARENT_KID_CONFIG } from '@/utils/constants';
import {
  ChildProfile,
  ChildAgeGroup,
  ChildContentFilter,
  ChildProgressSummary,
  ChildActivityEntry,
  SkillTrackId,
  PersonaId,
} from '@/models/types';

export async function createChildProfile(
  parentUserId: string,
  displayName: string,
  ageGroup: ChildAgeGroup,
  avatarEmoji: string,
): Promise<ChildProfile> {
  const existing = await getChildProfiles(parentUserId);
  if (existing.length >= PARENT_KID_CONFIG.MAX_CHILDREN) {
    throw new Error(`Maximum of ${PARENT_KID_CONFIG.MAX_CHILDREN} child profiles allowed`);
  }

  const contentFilter: ChildContentFilter =
    ageGroup === 'ages_8_12'
      ? { ...PARENT_KID_CONFIG.DEFAULT_CONTENT_FILTER_YOUNG }
      : { ...PARENT_KID_CONFIG.DEFAULT_CONTENT_FILTER_TEEN };

  const docRef = firestore().collection(COLLECTIONS.CHILD_PROFILES).doc();

  const profile: ChildProfile = {
    id: docRef.id,
    parentUserId,
    displayName,
    ageGroup,
    avatarEmoji,
    beltLevel: 'white',
    totalSessions: 0,
    currentStreak: 0,
    longestStreak: 0,
    createdAt: new Date().toISOString(),
    contentFilter,
  };

  await docRef.set(profile);
  return profile;
}

export async function getChildProfiles(parentUserId: string): Promise<ChildProfile[]> {
  const snapshot = await firestore()
    .collection(COLLECTIONS.CHILD_PROFILES)
    .where('parentUserId', '==', parentUserId)
    .orderBy('createdAt', 'asc')
    .get();

  return snapshot.docs.map((doc) => doc.data() as ChildProfile);
}

export async function updateChildProfile(
  childId: string,
  updates: Partial<Pick<ChildProfile, 'displayName' | 'avatarEmoji' | 'contentFilter'>>,
): Promise<void> {
  await firestore().collection(COLLECTIONS.CHILD_PROFILES).doc(childId).update(updates);
}

export async function deleteChildProfile(childId: string): Promise<void> {
  await firestore().collection(COLLECTIONS.CHILD_PROFILES).doc(childId).delete();
}

export async function updateContentFilter(
  childId: string,
  filter: ChildContentFilter,
): Promise<void> {
  await firestore().collection(COLLECTIONS.CHILD_PROFILES).doc(childId).update({
    contentFilter: filter,
  });
}

export async function getChildProgressSummary(
  childId: string,
): Promise<ChildProgressSummary | null> {
  const profileDoc = await firestore()
    .collection(COLLECTIONS.CHILD_PROFILES)
    .doc(childId)
    .get();

  if (!profileDoc.exists) return null;

  const profile = profileDoc.data() as ChildProfile;

  const sessionsSnapshot = await firestore()
    .collection(COLLECTIONS.SESSIONS)
    .where('userId', '==', childId)
    .orderBy('startedAt', 'desc')
    .limit(20)
    .get();

  const sessions = sessionsSnapshot.docs.map((doc) => doc.data());

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const weeklySessionCount = sessions.filter(
    (s) => new Date(s.startedAt) > oneWeekAgo,
  ).length;

  const skillProgressSnapshot = await firestore()
    .collection(COLLECTIONS.SKILL_PROGRESS)
    .where('userId', '==', childId)
    .get();

  let topSkill: SkillTrackId = 'regulate';
  let topSkillElo = 0;
  skillProgressSnapshot.docs.forEach((doc) => {
    const data = doc.data();
    if (data.elo > topSkillElo) {
      topSkillElo = data.elo;
      topSkill = data.trackId;
    }
  });

  const recentActivity: ChildActivityEntry[] = sessions.slice(0, 10).map((s) => ({
    date: s.startedAt,
    mode: s.phase ?? 'sparring',
    skillsWorked: s.skillTracks ?? [],
    duration: s.completedAt
      ? Math.round((new Date(s.completedAt).getTime() - new Date(s.startedAt).getTime()) / 60000)
      : 0,
    score: s.overallScore,
  }));

  return {
    childId,
    displayName: profile.displayName,
    ageGroup: profile.ageGroup,
    beltLevel: profile.beltLevel,
    totalSessions: profile.totalSessions,
    currentStreak: profile.currentStreak,
    weeklySessionCount,
    topSkill,
    topSkillElo,
    recentActivity,
  };
}

export function getAgeGroupLabel(ageGroup: ChildAgeGroup): string {
  return ageGroup === 'ages_8_12' ? 'Ages 8–12' : 'Ages 13–17';
}

export function getDefaultPersonasForAge(ageGroup: ChildAgeGroup): PersonaId[] {
  if (ageGroup === 'ages_8_12') {
    return [...PARENT_KID_CONFIG.DEFAULT_CONTENT_FILTER_YOUNG.allowedPersonas] as PersonaId[];
  }
  return [...PARENT_KID_CONFIG.DEFAULT_CONTENT_FILTER_TEEN.allowedPersonas] as PersonaId[];
}
