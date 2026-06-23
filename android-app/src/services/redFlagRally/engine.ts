import {
  RedFlagSet,
  FlagStatement,
  RED_FLAG_SETS,
  getRedFlagSetById,
} from './scenarios';

export interface RedFlagState {
  set: RedFlagSet;
  currentIndex: number;
  combo: number;
  bestCombo: number;
  score: number;
  answers: FlagAnswer[];
  phase: 'judging' | 'feedback' | 'results';
  isComplete: boolean;
  startTimeMs: number;
}

export interface FlagAnswer {
  statementId: string;
  playerSaidRedFlag: boolean;
  isCorrect: boolean;
  timeMs: number;
  comboAtTime: number;
  pointsEarned: number;
}

export interface RedFlagResults {
  totalStatements: number;
  correctCount: number;
  accuracy: number;
  totalScore: number;
  bestCombo: number;
  averageTimeMs: number;
  redFlagAccuracy: number;
  greenFlagAccuracy: number;
  rating: 'naive' | 'cautious' | 'perceptive' | 'detector';
  missedRedFlags: FlagStatement[];
  falseAlarms: FlagStatement[];
}

const BASE_POINTS = 100;
const SPEED_THRESHOLD_MS = 3000;
const MAX_SPEED_BONUS = 75;

export function startRedFlagRally(setId?: string): RedFlagState {
  const set = setId
    ? getRedFlagSetById(setId) ?? RED_FLAG_SETS[0]
    : RED_FLAG_SETS[Math.floor(Math.random() * RED_FLAG_SETS.length)];

  return {
    set,
    currentIndex: 0,
    combo: 0,
    bestCombo: 0,
    score: 0,
    answers: [],
    phase: 'judging',
    isComplete: false,
    startTimeMs: Date.now(),
  };
}

export function submitFlagJudgment(
  state: RedFlagState,
  isRedFlag: boolean,
  timeMs: number,
): { state: RedFlagState; answer: FlagAnswer } {
  const statement = state.set.statements[state.currentIndex];
  if (!statement) throw new Error('No statement at current index');

  const isCorrect = isRedFlag === statement.isRedFlag;

  let pointsEarned = 0;
  let newCombo = state.combo;

  if (isCorrect) {
    pointsEarned = BASE_POINTS;
    newCombo = state.combo + 1;

    // Combo multiplier
    if (newCombo >= 10) pointsEarned *= 4;
    else if (newCombo >= 7) pointsEarned *= 3;
    else if (newCombo >= 4) pointsEarned *= 2;
    else if (newCombo >= 2) pointsEarned = Math.round(pointsEarned * 1.5);

    // Speed bonus
    if (timeMs < SPEED_THRESHOLD_MS) {
      const speedRatio = 1 - (timeMs / SPEED_THRESHOLD_MS);
      pointsEarned += Math.round(speedRatio * MAX_SPEED_BONUS);
    }
  } else {
    newCombo = 0;
  }

  const answer: FlagAnswer = {
    statementId: statement.id,
    playerSaidRedFlag: isRedFlag,
    isCorrect,
    timeMs,
    comboAtTime: newCombo,
    pointsEarned,
  };

  return {
    state: {
      ...state,
      combo: newCombo,
      bestCombo: Math.max(state.bestCombo, newCombo),
      score: state.score + pointsEarned,
      answers: [...state.answers, answer],
      phase: 'feedback',
    },
    answer,
  };
}

export function advanceFlagStatement(state: RedFlagState): RedFlagState {
  const nextIndex = state.currentIndex + 1;

  if (nextIndex >= state.set.statements.length) {
    return {
      ...state,
      phase: 'results',
      isComplete: true,
    };
  }

  return {
    ...state,
    currentIndex: nextIndex,
    phase: 'judging',
  };
}

export function calculateRedFlagResults(state: RedFlagState): RedFlagResults {
  const { answers, bestCombo, score, set } = state;

  const correctCount = answers.filter((a) => a.isCorrect).length;
  const totalStatements = set.statements.length;
  const accuracy = answers.length > 0 ? Math.round((correctCount / answers.length) * 100) : 0;

  const totalTime = answers.reduce((sum, a) => sum + a.timeMs, 0);
  const averageTimeMs = answers.length > 0 ? Math.round(totalTime / answers.length) : 0;

  const redFlags = set.statements.filter((s) => s.isRedFlag);
  const greenFlags = set.statements.filter((s) => !s.isRedFlag);

  const redFlagCorrect = answers.filter((a) => {
    const stmt = set.statements.find((s) => s.id === a.statementId);
    return stmt?.isRedFlag && a.isCorrect;
  }).length;

  const greenFlagCorrect = answers.filter((a) => {
    const stmt = set.statements.find((s) => s.id === a.statementId);
    return !stmt?.isRedFlag && a.isCorrect;
  }).length;

  const redFlagAccuracy = redFlags.length > 0 ? Math.round((redFlagCorrect / redFlags.length) * 100) : 0;
  const greenFlagAccuracy = greenFlags.length > 0 ? Math.round((greenFlagCorrect / greenFlags.length) * 100) : 0;

  const missedRedFlags = set.statements.filter((s) => {
    const answer = answers.find((a) => a.statementId === s.id);
    return s.isRedFlag && answer && !answer.isCorrect;
  });

  const falseAlarms = set.statements.filter((s) => {
    const answer = answers.find((a) => a.statementId === s.id);
    return !s.isRedFlag && answer && !answer.isCorrect;
  });

  let rating: RedFlagResults['rating'];
  if (accuracy >= 90) {
    rating = 'detector';
  } else if (accuracy >= 75) {
    rating = 'perceptive';
  } else if (accuracy >= 55) {
    rating = 'cautious';
  } else {
    rating = 'naive';
  }

  return {
    totalStatements,
    correctCount,
    accuracy,
    totalScore: score,
    bestCombo,
    averageTimeMs,
    redFlagAccuracy,
    greenFlagAccuracy,
    rating,
    missedRedFlags,
    falseAlarms,
  };
}
