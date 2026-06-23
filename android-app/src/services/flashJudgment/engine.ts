import {
  FlashJudgmentSet,
  FlashQuestion,
  FlashOption,
  FLASH_JUDGMENT_SETS,
  getFlashSetById,
} from './scenarios';

export interface FlashJudgmentState {
  set: FlashJudgmentSet;
  currentIndex: number;
  hearts: number;
  streak: number;
  bestStreak: number;
  score: number;
  answers: FlashAnswer[];
  phase: 'answering' | 'feedback' | 'results';
  isComplete: boolean;
  timePerQuestion: number;
}

export interface FlashAnswer {
  questionId: string;
  selectedOptionId: string;
  isCorrect: boolean;
  isBest: boolean;
  timeMs: number;
  pointsEarned: number;
  streakAtTime: number;
}

export interface FlashResults {
  totalQuestions: number;
  correctCount: number;
  bestCount: number;
  accuracy: number;
  totalScore: number;
  bestStreak: number;
  averageTimeMs: number;
  heartsRemaining: number;
  rating: 'novice' | 'sharp' | 'expert' | 'master';
  perfectRound: boolean;
}

const MAX_HEARTS = 3;
const BASE_POINTS = 100;
const SPEED_BONUS_THRESHOLD_MS = 5000;
const MAX_SPEED_BONUS = 50;

export function startFlashJudgment(setId?: string): FlashJudgmentState {
  const set = setId
    ? getFlashSetById(setId) ?? FLASH_JUDGMENT_SETS[0]
    : FLASH_JUDGMENT_SETS[Math.floor(Math.random() * FLASH_JUDGMENT_SETS.length)];

  return {
    set,
    currentIndex: 0,
    hearts: MAX_HEARTS,
    streak: 0,
    bestStreak: 0,
    score: 0,
    answers: [],
    phase: 'answering',
    isComplete: false,
    timePerQuestion: 15000,
  };
}

export function submitFlashAnswer(
  state: FlashJudgmentState,
  optionId: string,
  timeMs: number,
): { state: FlashJudgmentState; answer: FlashAnswer } {
  const question = state.set.questions[state.currentIndex];
  if (!question) throw new Error('No question at current index');

  const selectedOption = question.options.find((o) => o.id === optionId);
  if (!selectedOption) throw new Error('Invalid option');

  const isBest = optionId === question.correctOptionId;
  const isAcceptable = selectedOption.quality === 'best' || selectedOption.quality === 'okay';

  let pointsEarned = 0;
  let newStreak = state.streak;
  let newHearts = state.hearts;

  if (isBest) {
    pointsEarned = BASE_POINTS;
    newStreak = state.streak + 1;

    // Streak multiplier: 2x at 3, 3x at 5, 4x at 8
    let multiplier = 1;
    if (newStreak >= 8) multiplier = 4;
    else if (newStreak >= 5) multiplier = 3;
    else if (newStreak >= 3) multiplier = 2;
    pointsEarned *= multiplier;

    // Speed bonus
    if (timeMs < SPEED_BONUS_THRESHOLD_MS) {
      const speedRatio = 1 - (timeMs / SPEED_BONUS_THRESHOLD_MS);
      pointsEarned += Math.round(speedRatio * MAX_SPEED_BONUS);
    }
  } else if (isAcceptable) {
    pointsEarned = Math.round(BASE_POINTS * 0.5);
    newStreak = 0;
  } else {
    newStreak = 0;
    newHearts = Math.max(0, state.hearts - 1);
  }

  const answer: FlashAnswer = {
    questionId: question.id,
    selectedOptionId: optionId,
    isCorrect: isAcceptable,
    isBest,
    timeMs,
    pointsEarned,
    streakAtTime: newStreak,
  };

  const newBestStreak = Math.max(state.bestStreak, newStreak);

  return {
    state: {
      ...state,
      streak: newStreak,
      bestStreak: newBestStreak,
      hearts: newHearts,
      score: state.score + pointsEarned,
      answers: [...state.answers, answer],
      phase: 'feedback',
    },
    answer,
  };
}

export function advanceFlashQuestion(state: FlashJudgmentState): FlashJudgmentState {
  const nextIndex = state.currentIndex + 1;
  const outOfHearts = state.hearts <= 0;
  const outOfQuestions = nextIndex >= state.set.questions.length;

  if (outOfHearts || outOfQuestions) {
    return {
      ...state,
      phase: 'results',
      isComplete: true,
    };
  }

  return {
    ...state,
    currentIndex: nextIndex,
    phase: 'answering',
  };
}

export function calculateFlashResults(state: FlashJudgmentState): FlashResults {
  const { answers, bestStreak, score, hearts, set } = state;

  const correctCount = answers.filter((a) => a.isCorrect).length;
  const bestCount = answers.filter((a) => a.isBest).length;
  const totalQuestions = set.questions.length;
  const accuracy = answers.length > 0 ? Math.round((correctCount / answers.length) * 100) : 0;

  const totalTime = answers.reduce((sum, a) => sum + a.timeMs, 0);
  const averageTimeMs = answers.length > 0 ? Math.round(totalTime / answers.length) : 0;

  const perfectRound = bestCount === totalQuestions && hearts === MAX_HEARTS;

  let rating: FlashResults['rating'];
  const bestRatio = answers.length > 0 ? bestCount / answers.length : 0;
  if (bestRatio >= 0.9 && hearts === MAX_HEARTS) {
    rating = 'master';
  } else if (bestRatio >= 0.7) {
    rating = 'expert';
  } else if (bestRatio >= 0.5) {
    rating = 'sharp';
  } else {
    rating = 'novice';
  }

  return {
    totalQuestions,
    correctCount,
    bestCount,
    accuracy,
    totalScore: score,
    bestStreak,
    averageTimeMs,
    heartsRemaining: hearts,
    rating,
    perfectRound,
  };
}
