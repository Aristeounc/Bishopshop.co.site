import { firestore, COLLECTIONS } from '@/config/firebase';
import {
  SparringSession,
  Badge,
  DailyProgram,
  SkillTrackId,
} from '@/models/types';

export async function saveSession(session: SparringSession): Promise<void> {
  await firestore()
    .collection(COLLECTIONS.USERS)
    .doc(session.userId)
    .collection(COLLECTIONS.SESSIONS)
    .doc(session.id)
    .set(session);
}

export async function fetchSessionHistory(
  userId: string,
  limit = 20,
): Promise<SparringSession[]> {
  const snapshot = await firestore()
    .collection(COLLECTIONS.USERS)
    .doc(userId)
    .collection(COLLECTIONS.SESSIONS)
    .orderBy('startedAt', 'desc')
    .limit(limit)
    .get();

  return snapshot.docs.map((doc) => doc.data() as SparringSession);
}

export async function fetchBadges(userId: string): Promise<Badge[]> {
  const snapshot = await firestore()
    .collection(COLLECTIONS.USERS)
    .doc(userId)
    .collection(COLLECTIONS.BADGES)
    .get();

  return snapshot.docs.map((doc) => doc.data() as Badge);
}

export async function awardBadge(userId: string, badge: Badge): Promise<void> {
  await firestore()
    .collection(COLLECTIONS.USERS)
    .doc(userId)
    .collection(COLLECTIONS.BADGES)
    .doc(badge.id)
    .set({ ...badge, earnedAt: new Date().toISOString() });
}

export async function fetchDailyProgram(
  userId: string,
  date: string,
): Promise<DailyProgram | null> {
  const doc = await firestore()
    .collection(COLLECTIONS.USERS)
    .doc(userId)
    .collection(COLLECTIONS.DAILY_PROGRAMS)
    .doc(date)
    .get();

  return doc.exists ? (doc.data() as DailyProgram) : null;
}

export async function saveDailyProgram(
  userId: string,
  program: DailyProgram,
): Promise<void> {
  await firestore()
    .collection(COLLECTIONS.USERS)
    .doc(userId)
    .collection(COLLECTIONS.DAILY_PROGRAMS)
    .doc(program.date)
    .set(program);
}

export async function updateStreak(userId: string): Promise<{ current: number; longest: number }> {
  const userRef = firestore().collection(COLLECTIONS.USERS).doc(userId);
  const userDoc = await userRef.get();
  const userData = userDoc.data();

  if (!userData) throw new Error('User not found');

  const lastSession = userData.lastSessionAt;
  const now = new Date();
  const today = now.toISOString().split('T')[0];

  let currentStreak = userData.currentStreak || 0;
  let longestStreak = userData.longestStreak || 0;

  if (lastSession) {
    const lastDate = new Date(lastSession).toISOString().split('T')[0];
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (lastDate === today) {
      // Already trained today
    } else if (lastDate === yesterdayStr) {
      currentStreak += 1;
    } else {
      currentStreak = 1;
    }
  } else {
    currentStreak = 1;
  }

  longestStreak = Math.max(longestStreak, currentStreak);

  await userRef.update({
    currentStreak,
    longestStreak,
    lastSessionAt: now.toISOString(),
    totalSessions: (userData.totalSessions || 0) + 1,
  });

  return { current: currentStreak, longest: longestStreak };
}

export async function getLeaderboardPosition(
  trackId: SkillTrackId,
  elo: number,
): Promise<number> {
  const snapshot = await firestore()
    .collectionGroup('skillProgress')
    .where('trackId', '==', trackId)
    .where('elo', '>', elo)
    .get();

  return snapshot.size + 1;
}
