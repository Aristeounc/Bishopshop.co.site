import { auth, firestore, COLLECTIONS } from '@/config/firebase';
import { User, SkillProgress, SkillTrackId } from '@/models/types';
import { ELO_CONFIG, SKILL_TRACKS } from '@/utils/constants';

export async function signIn(email: string, password: string): Promise<User> {
  const credential = await auth().signInWithEmailAndPassword(email, password);
  return fetchUserProfile(credential.user.uid);
}

export async function signUp(
  email: string,
  password: string,
  displayName: string,
): Promise<User> {
  const credential = await auth().createUserWithEmailAndPassword(email, password);
  await credential.user.updateProfile({ displayName });

  const user: User = {
    id: credential.user.uid,
    email,
    displayName,
    subscription: 'free_trial',
    beltLevel: 'white',
    totalSessions: 0,
    currentStreak: 0,
    longestStreak: 0,
    freezeSlotsRemaining: 2,
    joinedAt: new Date().toISOString(),
    preferences: {
      notificationsEnabled: true,
      dailyReminderTime: '09:00',
      hapticFeedback: true,
      darkMode: true,
      articulationIntensity: 'standard',
    },
  };

  await firestore().collection(COLLECTIONS.USERS).doc(user.id).set(user);

  const batch = firestore().batch();
  for (const track of SKILL_TRACKS) {
    const progress: SkillProgress = {
      trackId: track.id,
      elo: ELO_CONFIG.DEFAULT_ELO,
      sessionsCompleted: 0,
      conceptsMastered: [],
    };
    const ref = firestore()
      .collection(COLLECTIONS.USERS)
      .doc(user.id)
      .collection(COLLECTIONS.SKILL_PROGRESS)
      .doc(track.id);
    batch.set(ref, progress);
  }
  await batch.commit();

  return user;
}

export async function resetPassword(email: string): Promise<void> {
  await auth().sendPasswordResetEmail(email);
}

export async function signOut(): Promise<void> {
  await auth().signOut();
}

export async function fetchUserProfile(uid: string): Promise<User> {
  const doc = await firestore().collection(COLLECTIONS.USERS).doc(uid).get();
  if (!doc.exists) {
    throw new Error('User profile not found');
  }
  return doc.data() as User;
}

export async function updateUserProfile(uid: string, updates: Partial<User>): Promise<void> {
  await firestore().collection(COLLECTIONS.USERS).doc(uid).update(updates);
}

export async function fetchSkillProgress(uid: string): Promise<Record<SkillTrackId, SkillProgress>> {
  const snapshot = await firestore()
    .collection(COLLECTIONS.USERS)
    .doc(uid)
    .collection(COLLECTIONS.SKILL_PROGRESS)
    .get();

  const progress: Record<string, SkillProgress> = {};
  snapshot.forEach((doc) => {
    const data = doc.data() as SkillProgress;
    progress[data.trackId] = data;
  });
  return progress as Record<SkillTrackId, SkillProgress>;
}

export async function updateSkillProgress(
  uid: string,
  trackId: SkillTrackId,
  updates: Partial<SkillProgress>,
): Promise<void> {
  await firestore()
    .collection(COLLECTIONS.USERS)
    .doc(uid)
    .collection(COLLECTIONS.SKILL_PROGRESS)
    .doc(trackId)
    .update(updates);
}

export function onAuthStateChanged(callback: (uid: string | null) => void) {
  return auth().onAuthStateChanged((user) => {
    callback(user?.uid ?? null);
  });
}
