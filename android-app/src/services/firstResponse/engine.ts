import {
  FirstResponseSet,
  FirstResponseRound,
  FIRST_RESPONSE_SETS,
  getFirstResponseSetById,
} from './scenarios';

export interface FirstResponseState {
  set: FirstResponseSet;
  currentRoundIndex: number;
  answers: FirstResponseAnswer[];
  phase: 'reading' | 'choosing' | 'reveal' | 'results';
  isComplete: boolean;
  score: FirstResponseScore;
}

export interface FirstResponseAnswer {
  roundId: string;
  selectedStrategyId: string;
  isCorrect: boolean;
  timeMs: number;
  pointsEarned: number;
}

export interface FirstResponseScore {
  totalRounds: number;
  correctCount: number;
  accuracy: number;
  averageTimeMs: number;
  totalPoints: number;
  bestStreak: number;
  rating: 'reactive' | 'composed' | 'strategic' | 'instinctive';
  fastestCorrectMs: number;
}

const BASE_POINTS = 100;
const SPEED_BONUS_THRESHOLD_MS = 8000;
const MAX_SPEED_BONUS = 100;

export function startFirstResponse(setId?: string): FirstResponseState {
  const set = setId
    ? getFirstResponseSetById(setId) ?? FIRST_RESPONSE_SETS[0]
    : FIRST_RESPONSE_SETS[Math.floor(Math.random() * FIRST_RESPONSE_SETS.length)];

  return {
    set,
    currentRoundIndex: 0,
    answers: [],
    phase: 'reading',
    isComplete: false,
    score: emptyScore(set.rounds.length),
  };
}

export function beginChoosing(state: FirstResponseState): FirstResponseState {
  return { ...state, phase: 'choosing' };
}

export function submitFirstResponse(
  state: FirstResponseState,
  strategyId: string,
  timeMs: number,
): { state: FirstResponseState; answer: FirstResponseAnswer } {
  const round = state.set.rounds[state.currentRoundIndex];
  if (!round) throw new Error('No round at current index');

  const isCorrect = strategyId === round.correctStrategyId;

  let pointsEarned = 0;
  if (isCorrect) {
    pointsEarned = BASE_POINTS;

    // Speed bonus — faster = more points
    if (timeMs < SPEED_BONUS_THRESHOLD_MS) {
      const speedRatio = 1 - (timeMs / SPEED_BONUS_THRESHOLD_MS);
      pointsEarned += Math.round(speedRatio * MAX_SPEED_BONUS);
    }

    // Streak bonus
    const currentStreak = countCurrentStreak(state.answers) + 1;
    if (currentStreak >= 5) pointsEarned = Math.round(pointsEarned * 2);
    else if (currentStreak >= 3) pointsEarned = Math.round(pointsEarned * 1.5);
  }

  const answer: FirstResponseAnswer = {
    roundId: round.id,
    selectedStrategyId: strategyId,
    isCorrect,
    timeMs,
    pointsEarned,
  };

  const updatedAnswers = [...state.answers, answer];

  return {
    state: {
      ...state,
      answers: updatedAnswers,
      phase: 'reveal',
      score: calculateRunningScore(state.set, updatedAnswers),
    },
    answer,
  };
}

export function advanceFirstResponseRound(state: FirstResponseState): FirstResponseState {
  const nextIndex = state.currentRoundIndex + 1;

  if (nextIndex >= state.set.rounds.length) {
    return {
      ...state,
      phase: 'results',
      isComplete: true,
      score: calculateRunningScore(state.set, state.answers),
    };
  }

  return {
    ...state,
    currentRoundIndex: nextIndex,
    phase: 'reading',
  };
}

function countCurrentStreak(answers: FirstResponseAnswer[]): number {
  let streak = 0;
  for (let i = answers.length - 1; i >= 0; i--) {
    if (answers[i].isCorrect) streak++;
    else break;
  }
  return streak;
}

function emptyScore(totalRounds: number): FirstResponseScore {
  return {
    totalRounds,
    correctCount: 0,
    accuracy: 0,
    averageTimeMs: 0,
    totalPoints: 0,
    bestStreak: 0,
    rating: 'reactive',
    fastestCorrectMs: 0,
  };
}

function calculateRunningScore(
  set: FirstResponseSet,
  answers: FirstResponseAnswer[],
): FirstResponseScore {
  const totalRounds = set.rounds.length;

  if (answers.length === 0) return emptyScore(totalRounds);

  const correctCount = answers.filter((a) => a.isCorrect).length;
  const accuracy = Math.round((correctCount / answers.length) * 100);

  const totalTime = answers.reduce((sum, a) => sum + a.timeMs, 0);
  const averageTimeMs = Math.round(totalTime / answers.length);

  const totalPoints = answers.reduce((sum, a) => sum + a.pointsEarned, 0);

  const correctAnswers = answers.filter((a) => a.isCorrect);
  const fastestCorrectMs = correctAnswers.length > 0
    ? Math.min(...correctAnswers.map((a) => a.timeMs))
    : 0;

  let bestStreak = 0;
  let currentStreak = 0;
  for (const answer of answers) {
    if (answer.isCorrect) {
      currentStreak++;
      if (currentStreak > bestStreak) bestStreak = currentStreak;
    } else {
      currentStreak = 0;
    }
  }

  let rating: FirstResponseScore['rating'];
  if (accuracy >= 90 && averageTimeMs < 8000) {
    rating = 'instinctive';
  } else if (accuracy >= 75) {
    rating = 'strategic';
  } else if (accuracy >= 50) {
    rating = 'composed';
  } else {
    rating = 'reactive';
  }

  return {
    totalRounds,
    correctCount,
    accuracy,
    averageTimeMs,
    totalPoints,
    bestStreak,
    rating,
    fastestCorrectMs,
  };
}
