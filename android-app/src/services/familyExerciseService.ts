import { firestore, COLLECTIONS } from '@/config/firebase';
import { FAMILY_MODULES } from '@/utils/familyExercises';
import {
  FamilyModule,
  FamilyExercise,
  FamilyExerciseSession,
  FamilyModuleId,
  ExerciseRole,
  ChildAgeGroup,
  SafeSpaceMessage,
} from '@/models/types';

export function getModule(moduleId: FamilyModuleId): FamilyModule | undefined {
  return FAMILY_MODULES.find((m) => m.id === moduleId);
}

export function getExercisesForRole(
  moduleId: FamilyModuleId,
  role: ExerciseRole,
  ageGroup?: ChildAgeGroup,
): FamilyExercise[] {
  const mod = getModule(moduleId);
  if (!mod) return [];

  return mod.exercises.filter((ex) => {
    const roleMatch = ex.role === role || ex.role === 'both';
    const ageMatch = !ageGroup || ex.ageGroup === 'all' || ex.ageGroup === ageGroup;
    return roleMatch && ageMatch;
  });
}

export function getExercise(exerciseId: string): FamilyExercise | undefined {
  for (const mod of FAMILY_MODULES) {
    const exercise = mod.exercises.find((e) => e.id === exerciseId);
    if (exercise) return exercise;
  }
  return undefined;
}

export async function startExerciseSession(
  userId: string,
  exerciseId: string,
  moduleId: FamilyModuleId,
  role: ExerciseRole,
  childProfileId?: string,
): Promise<FamilyExerciseSession> {
  const docRef = firestore().collection(COLLECTIONS.FAMILY_EXERCISE_SESSIONS).doc();

  const session: FamilyExerciseSession = {
    id: docRef.id,
    userId,
    childProfileId,
    exerciseId,
    moduleId,
    role,
    startedAt: new Date().toISOString(),
    messages: [],
  };

  await docRef.set(session);
  return session;
}

export async function addExerciseMessage(
  sessionId: string,
  message: SafeSpaceMessage,
): Promise<void> {
  await firestore()
    .collection(COLLECTIONS.FAMILY_EXERCISE_SESSIONS)
    .doc(sessionId)
    .update({
      messages: firestore.FieldValue.arrayUnion(message),
    });
}

export async function completeExerciseSession(
  sessionId: string,
  score?: number,
  feedback?: FamilyExerciseSession['feedback'],
): Promise<void> {
  await firestore()
    .collection(COLLECTIONS.FAMILY_EXERCISE_SESSIONS)
    .doc(sessionId)
    .update({
      completedAt: new Date().toISOString(),
      score,
      feedback,
    });
}

export async function getExerciseHistory(
  userId: string,
  moduleId?: FamilyModuleId,
  limit = 20,
): Promise<FamilyExerciseSession[]> {
  let query = firestore()
    .collection(COLLECTIONS.FAMILY_EXERCISE_SESSIONS)
    .where('userId', '==', userId)
    .orderBy('startedAt', 'desc')
    .limit(limit);

  if (moduleId) {
    query = query.where('moduleId', '==', moduleId);
  }

  const snapshot = await query.get();
  return snapshot.docs.map((doc) => doc.data() as FamilyExerciseSession);
}

export function getModuleProgress(
  completedSessions: FamilyExerciseSession[],
  moduleId: FamilyModuleId,
): { completed: number; total: number; averageScore: number } {
  const mod = getModule(moduleId);
  if (!mod) return { completed: 0, total: 0, averageScore: 0 };

  const moduleSessions = completedSessions.filter(
    (s) => s.moduleId === moduleId && s.completedAt,
  );

  const uniqueExercises = new Set(moduleSessions.map((s) => s.exerciseId));
  const scores = moduleSessions
    .filter((s) => s.score != null)
    .map((s) => s.score!);

  return {
    completed: uniqueExercises.size,
    total: mod.exercises.length,
    averageScore: scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0,
  };
}
