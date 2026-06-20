import {
  AutopsyScenario,
  AutopsyLine,
  MistakeCategory,
  AUTOPSY_SCENARIOS,
} from './scenarios';

export interface AutopsyState {
  scenario: AutopsyScenario;
  phase: 'reading' | 'selecting' | 'diagnosing' | 'rewriting' | 'results';
  revealedLines: number[];
  currentLineIndex: number;
  playerSelection: string | null;
  playerDiagnosis: string | null;
  playerRewrite: string | null;
  score: {
    correctDerailment: boolean;
    diagnosisScore: number;
    rewriteSubmitted: boolean;
    totalScore: number;
  };
  isComplete: boolean;
}

export function startAutopsy(scenarioId?: string): AutopsyState {
  const scenario = scenarioId
    ? AUTOPSY_SCENARIOS.find((s) => s.id === scenarioId) ?? AUTOPSY_SCENARIOS[0]
    : AUTOPSY_SCENARIOS[Math.floor(Math.random() * AUTOPSY_SCENARIOS.length)];

  return {
    scenario,
    phase: 'reading',
    revealedLines: [0],
    currentLineIndex: 0,
    playerSelection: null,
    playerDiagnosis: null,
    playerRewrite: null,
    score: {
      correctDerailment: false,
      diagnosisScore: 0,
      rewriteSubmitted: false,
      totalScore: 0,
    },
    isComplete: false,
  };
}

export function revealNextLine(state: AutopsyState): AutopsyState {
  const nextIndex = state.currentLineIndex + 1;

  if (nextIndex >= state.scenario.dialogue.length) {
    return {
      ...state,
      phase: 'selecting',
    };
  }

  return {
    ...state,
    currentLineIndex: nextIndex,
    revealedLines: [...state.revealedLines, nextIndex],
  };
}

export function selectDerailmentLine(
  state: AutopsyState,
  lineId: string,
): { state: AutopsyState; isCorrect: boolean } {
  const line = state.scenario.dialogue.find((l) => l.id === lineId);
  if (!line) throw new Error(`Unknown line: ${lineId}`);

  const isCorrect = line.isDerailment;

  return {
    state: {
      ...state,
      playerSelection: lineId,
      phase: 'diagnosing',
      score: {
        ...state.score,
        correctDerailment: isCorrect,
      },
    },
    isCorrect,
  };
}

export function submitDiagnosis(
  state: AutopsyState,
  diagnosis: string,
): AutopsyState {
  const isCorrectCategory = diagnosis === state.scenario.mistakeCategory;
  const diagnosisScore = isCorrectCategory ? 40 : 0;

  return {
    ...state,
    playerDiagnosis: diagnosis,
    phase: 'rewriting',
    score: {
      ...state.score,
      diagnosisScore,
    },
  };
}

export function submitRewrite(
  state: AutopsyState,
  rewrite: string,
): AutopsyState {
  return {
    ...state,
    playerRewrite: rewrite,
    score: {
      ...state.score,
      rewriteSubmitted: rewrite.trim().length > 0,
    },
  };
}

export function calculateAutopsyScore(state: AutopsyState): AutopsyState {
  let totalScore = 0;

  // 40 points for identifying the correct derailment line
  if (state.score.correctDerailment) {
    totalScore += 40;
  }

  // 40 points for correct diagnosis category
  totalScore += state.score.diagnosisScore;

  // 20 points for submitting a rewrite (any non-empty rewrite gets credit)
  if (state.score.rewriteSubmitted) {
    totalScore += 20;
  }

  return {
    ...state,
    phase: 'results',
    isComplete: true,
    score: {
      ...state.score,
      totalScore,
    },
  };
}
