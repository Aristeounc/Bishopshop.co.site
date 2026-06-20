import {
  GauntletScenario,
  GauntletRound,
  GAUNTLET_SCENARIOS,
} from './scenarios';

export interface GauntletState {
  scenario: GauntletScenario;
  currentRound: number;
  responses: PlayerGauntletResponse[];
  phase: 'intro' | 'responding' | 'feedback' | 'results';
  isComplete: boolean;
  score: GauntletScore;
}

export interface PlayerGauntletResponse {
  roundId: string;
  playerResponse: string;
  composureScore: number;
  techniqueScore: number;
  overallScore: number;
}

export interface GauntletScore {
  roundScores: PlayerGauntletResponse[];
  averageComposure: number;
  averageTechnique: number;
  overallRating: 'crumbled' | 'bent' | 'stood_firm' | 'unshakeable';
  composureTrend: 'declining' | 'steady' | 'improving';
}

// --- Composure analysis ---

const REACTIVE_PATTERNS = [
  /\byou always\b/i,
  /\byou never\b/i,
  /\bwhatever\b/i,
  /\bfine\b(?:\s*[!.])/i,
  /\bscrew\b/i,
  /\bshut up\b/i,
  /\bstupid\b/i,
  /\bidiot\b/i,
  /\bjerk\b/i,
  /\bget lost\b/i,
  /\bgo to hell\b/i,
  /\bfuck\b/i,
  /\bshit\b/i,
  /\bdamn\b/i,
  /\bforget it\b/i,
  /\bhow dare you\b/i,
  /\byou don't care\b/i,
  /\bi don't care\b/i,
  /\bunbelievable\b/i,
  /\bridiculous\b/i,
];

const COMPOSED_PATTERNS = [
  /\bI feel\b/i,
  /\bI understand\b/i,
  /\bI hear you\b/i,
  /\bI appreciate\b/i,
  /\bhelp me understand\b/i,
  /\blet me think\b/i,
  /\bthat makes sense\b/i,
  /\bI'd like to\b/i,
  /\bI want to\b/i,
  /\bcan we\b/i,
  /\bcould we\b/i,
  /\bI respect\b/i,
  /\bI value\b/i,
  /\bthank you\b/i,
  /\bthanks for\b/i,
];

function scoreComposure(response: string): number {
  let score = 60;

  // Penalize ALL CAPS words (3+ char words that are fully capitalized)
  const words = response.split(/\s+/);
  const capsWords = words.filter((w) => w.length >= 3 && w === w.toUpperCase() && /[A-Z]/.test(w));
  score -= capsWords.length * 8;

  // Penalize excessive exclamation marks
  const exclamationCount = (response.match(/!/g) ?? []).length;
  score -= Math.min(exclamationCount * 5, 25);

  // Penalize excessive question marks (aggressive questioning)
  const questionCount = (response.match(/\?{2,}/g) ?? []).length;
  score -= questionCount * 5;

  // Penalize reactive language
  for (const pattern of REACTIVE_PATTERNS) {
    if (pattern.test(response)) {
      score -= 10;
    }
  }

  // Reward composed language
  for (const pattern of COMPOSED_PATTERNS) {
    if (pattern.test(response)) {
      score += 6;
    }
  }

  // Reward moderate length (not too short/dismissive, not too long/ranting)
  const wordCount = words.length;
  if (wordCount >= 15 && wordCount <= 80) {
    score += 10;
  } else if (wordCount < 5) {
    score -= 15;
  } else if (wordCount > 120) {
    score -= 10;
  }

  return Math.max(0, Math.min(100, score));
}

// --- Technique analysis ---

const TECHNIQUE_PATTERNS: { pattern: RegExp; points: number; label: string }[] = [
  { pattern: /\bI feel\b/i, points: 8, label: 'i_statement' },
  { pattern: /\bI hear you\b/i, points: 8, label: 'empathy_label' },
  { pattern: /\bI understand\b/i, points: 7, label: 'empathy_label' },
  { pattern: /\bI can see\b/i, points: 6, label: 'empathy_label' },
  { pattern: /\bhelp me understand\b/i, points: 8, label: 'calibrated_question' },
  { pattern: /\bhow can we\b/i, points: 7, label: 'calibrated_question' },
  { pattern: /\bwhat if we\b/i, points: 7, label: 'calibrated_question' },
  { pattern: /\bcould we\b/i, points: 6, label: 'calibrated_question' },
  { pattern: /\bcan we\b/i, points: 5, label: 'calibrated_question' },
  { pattern: /\bboundary\b|\bboundaries\b/i, points: 6, label: 'boundary_language' },
  { pattern: /\bI need\b/i, points: 5, label: 'clear_need' },
  { pattern: /\bI appreciate\b/i, points: 6, label: 'de_escalation' },
  { pattern: /\bI respect\b/i, points: 6, label: 'de_escalation' },
  { pattern: /\bI value\b/i, points: 5, label: 'de_escalation' },
  { pattern: /\bthat's fair\b/i, points: 5, label: 'de_escalation' },
  { pattern: /\bthat makes sense\b/i, points: 5, label: 'de_escalation' },
  { pattern: /\blet's\b/i, points: 4, label: 'collaborative' },
  { pattern: /\btogether\b/i, points: 4, label: 'collaborative' },
  { pattern: /\bboth of us\b|\bboth\b/i, points: 3, label: 'collaborative' },
  { pattern: /\bI want to work\b/i, points: 5, label: 'collaborative' },
  { pattern: /\bfind a solution\b/i, points: 5, label: 'collaborative' },
];

function scoreTechnique(response: string): number {
  let score = 30;
  const usedLabels = new Set<string>();

  for (const { pattern, points, label } of TECHNIQUE_PATTERNS) {
    if (pattern.test(response)) {
      // Only count each label category once to prevent gaming
      if (!usedLabels.has(label)) {
        score += points;
        usedLabels.add(label);
      }
    }
  }

  // Bonus for using multiple technique categories
  if (usedLabels.size >= 3) {
    score += 10;
  }
  if (usedLabels.size >= 5) {
    score += 5;
  }

  return Math.max(0, Math.min(100, score));
}

// --- Public API ---

export function startGauntlet(scenarioId?: string): GauntletState {
  const scenario = scenarioId
    ? GAUNTLET_SCENARIOS.find((s) => s.id === scenarioId) ?? GAUNTLET_SCENARIOS[0]
    : GAUNTLET_SCENARIOS[Math.floor(Math.random() * GAUNTLET_SCENARIOS.length)];

  return {
    scenario,
    currentRound: 0,
    responses: [],
    phase: 'intro',
    isComplete: false,
    score: {
      roundScores: [],
      averageComposure: 0,
      averageTechnique: 0,
      overallRating: 'crumbled',
      composureTrend: 'steady',
    },
  };
}

export function submitGauntletResponse(
  state: GauntletState,
  response: string,
): { state: GauntletState; roundResult: PlayerGauntletResponse } {
  const round = state.scenario.rounds[state.currentRound];
  if (!round) throw new Error(`No round at index ${state.currentRound}`);

  const composureScore = scoreComposure(response);
  const techniqueScore = scoreTechnique(response);
  const overallScore = Math.round(composureScore * 0.5 + techniqueScore * 0.5);

  const roundResult: PlayerGauntletResponse = {
    roundId: round.id,
    playerResponse: response,
    composureScore,
    techniqueScore,
    overallScore,
  };

  const updatedResponses = [...state.responses, roundResult];

  return {
    state: {
      ...state,
      responses: updatedResponses,
      phase: 'feedback',
    },
    roundResult,
  };
}

export function advanceGauntletRound(state: GauntletState): GauntletState {
  const nextRound = state.currentRound + 1;

  if (nextRound >= state.scenario.rounds.length) {
    const finalScore = calculateGauntletScore({
      ...state,
      currentRound: nextRound,
    });
    return {
      ...state,
      currentRound: nextRound,
      phase: 'results',
      isComplete: true,
      score: finalScore,
    };
  }

  return {
    ...state,
    currentRound: nextRound,
    phase: 'responding',
  };
}

export function calculateGauntletScore(state: GauntletState): GauntletScore {
  const roundScores = [...state.responses];

  if (roundScores.length === 0) {
    return {
      roundScores: [],
      averageComposure: 0,
      averageTechnique: 0,
      overallRating: 'crumbled',
      composureTrend: 'steady',
    };
  }

  const averageComposure = Math.round(
    roundScores.reduce((sum, r) => sum + r.composureScore, 0) / roundScores.length,
  );
  const averageTechnique = Math.round(
    roundScores.reduce((sum, r) => sum + r.techniqueScore, 0) / roundScores.length,
  );

  const overallAvg = Math.round((averageComposure + averageTechnique) / 2);

  let overallRating: GauntletScore['overallRating'];
  if (overallAvg >= 80) {
    overallRating = 'unshakeable';
  } else if (overallAvg >= 60) {
    overallRating = 'stood_firm';
  } else if (overallAvg >= 40) {
    overallRating = 'bent';
  } else {
    overallRating = 'crumbled';
  }

  // Calculate composure trend (compare first half vs second half)
  let composureTrend: GauntletScore['composureTrend'] = 'steady';
  if (roundScores.length >= 2) {
    const midpoint = Math.floor(roundScores.length / 2);
    const firstHalf = roundScores.slice(0, midpoint);
    const secondHalf = roundScores.slice(midpoint);

    const firstAvg = firstHalf.reduce((s, r) => s + r.composureScore, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((s, r) => s + r.composureScore, 0) / secondHalf.length;

    const diff = secondAvg - firstAvg;
    if (diff > 5) {
      composureTrend = 'improving';
    } else if (diff < -5) {
      composureTrend = 'declining';
    }
  }

  return {
    roundScores,
    averageComposure,
    averageTechnique,
    overallRating,
    composureTrend,
  };
}
