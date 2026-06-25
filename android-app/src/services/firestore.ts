import { firestore, COLLECTIONS } from '@/config/firebase';
import {
  SparringSession,
  Badge,
  DailyProgram,
  SkillTrackId,
  SkillProgress,
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

  return firestore().runTransaction(async (transaction) => {
    const userDoc = await transaction.get(userRef);
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

    transaction.update(userRef, {
      currentStreak,
      longestStreak,
      lastSessionAt: now.toISOString(),
      totalSessions: (userData.totalSessions || 0) + 1,
    });

    return { current: currentStreak, longest: longestStreak };
  });
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

export async function saveDrillResult(
  userId: string,
  drillType: string,
  score: number,
  skillTrack: SkillTrackId,
): Promise<void> {
  await firestore()
    .collection(COLLECTIONS.USERS)
    .doc(userId)
    .collection('drillResults')
    .add({
      drillType,
      score,
      skillTrack,
      completedAt: new Date().toISOString(),
    });
}

const DEFAULT_BADGES: Badge[] = [
  { id: 'first_session', name: 'First Step', description: 'Complete your first sparring session', icon: '🎯', tier: 'emerging', requirement: { type: 'sessions_completed', target: 1 } },
  { id: 'ten_sessions', name: 'Getting Warm', description: 'Complete 10 sparring sessions', icon: '🔥', tier: 'developing', requirement: { type: 'sessions_completed', target: 10 } },
  { id: 'fifty_sessions', name: 'Iron Sharpens Iron', description: 'Complete 50 sparring sessions', icon: '⚔️', tier: 'proficient', requirement: { type: 'sessions_completed', target: 50 } },
  { id: 'elo_300', name: 'Rising Star', description: 'Reach 300 average ELO', icon: '⭐', tier: 'developing', requirement: { type: 'elo_reached', target: 300 } },
  { id: 'elo_500', name: 'Contender', description: 'Reach 500 average ELO', icon: '💎', tier: 'proficient', requirement: { type: 'elo_reached', target: 500 } },
  { id: 'elo_1000', name: 'Elite', description: 'Reach 1000 average ELO', icon: '👑', tier: 'advanced', requirement: { type: 'elo_reached', target: 1000 } },
  { id: 'streak_7', name: 'Week Warrior', description: 'Maintain a 7-day training streak', icon: '📅', tier: 'developing', requirement: { type: 'streak_days', target: 7 } },
  { id: 'streak_30', name: 'Monthly Master', description: 'Maintain a 30-day training streak', icon: '🏆', tier: 'advanced', requirement: { type: 'streak_days', target: 30 } },
  { id: 'all_personas', name: 'Full Roster', description: 'Spar with all 6 personas', icon: '🎭', tier: 'proficient', requirement: { type: 'persona_defeated', target: 6 } },
  { id: 'concepts_10', name: 'Scholar', description: 'Master 10 concepts', icon: '📚', tier: 'developing', requirement: { type: 'concepts_mastered', target: 10 } },
  { id: 'concepts_25', name: 'Philosopher', description: 'Master 25 concepts', icon: '🧠', tier: 'advanced', requirement: { type: 'concepts_mastered', target: 25 } },
  { id: 'concepts_33', name: 'Grandmaster', description: 'Master all 33 concepts', icon: '🌟', tier: 'master', requirement: { type: 'concepts_mastered', target: 33 } },
];

export async function checkAndAwardBadges(
  userId: string,
  progress: Record<SkillTrackId, SkillProgress>,
  totalSessions: number,
  currentStreak: number,
): Promise<Badge[]> {
  const existingBadges = await fetchBadges(userId);
  const earnedIds = new Set(existingBadges.map((b) => b.id));

  const avgElo =
    Object.values(progress).reduce((sum, sp) => sum + sp.elo, 0) /
    Object.values(progress).length;

  const totalConcepts = Object.values(progress).reduce(
    (sum, sp) => sum + sp.conceptsMastered.length,
    0,
  );

  const newBadges: Badge[] = [];

  for (const badge of DEFAULT_BADGES) {
    if (earnedIds.has(badge.id)) continue;

    let earned = false;
    const req = badge.requirement;

    switch (req.type) {
      case 'sessions_completed':
        earned = totalSessions >= req.target;
        break;
      case 'elo_reached':
        earned = avgElo >= req.target;
        break;
      case 'streak_days':
        earned = currentStreak >= req.target;
        break;
      case 'concepts_mastered':
        earned = totalConcepts >= req.target;
        break;
    }

    if (earned) {
      await awardBadge(userId, badge);
      newBadges.push({ ...badge, earnedAt: new Date().toISOString() });
    }
  }

  return newBadges;
}
