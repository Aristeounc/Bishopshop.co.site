import {
  InfluenceScenario,
  DialogueLine,
  InfluenceTactic,
  INFLUENCE_SCENARIOS,
} from './scenarios';

export interface SpotInfluenceState {
  scenario: InfluenceScenario;
  currentLineIndex: number;
  revealedLines: number[];
  playerSelections: Record<string, PlayerTacticSelection[]>;
  score: SpotInfluenceScore;
  isComplete: boolean;
}

export interface PlayerTacticSelection {
  lineId: string;
  selectedText: string;
  tacticGuess: string;
  isCorrect: boolean;
  matchedTactic?: InfluenceTactic;
}

export interface SpotInfluenceScore {
  totalTactics: number;
  tacticsIdentified: number;
  falsePositives: number;
  accuracy: number;
  missedTactics: InfluenceTactic[];
  categoryBreakdown: Record<string, { found: number; total: number }>;
}

export function startSpotInfluence(scenarioId?: string): SpotInfluenceState {
  const scenario = scenarioId
    ? INFLUENCE_SCENARIOS.find((s) => s.id === scenarioId) ?? INFLUENCE_SCENARIOS[0]
    : INFLUENCE_SCENARIOS[Math.floor(Math.random() * INFLUENCE_SCENARIOS.length)];

  return {
    scenario,
    currentLineIndex: 0,
    revealedLines: [0],
    playerSelections: {},
    score: {
      totalTactics: countTotalTactics(scenario),
      tacticsIdentified: 0,
      falsePositives: 0,
      accuracy: 0,
      missedTactics: [],
      categoryBreakdown: {},
    },
    isComplete: false,
  };
}

export function advanceLine(state: SpotInfluenceState): SpotInfluenceState {
  const nextIndex = state.currentLineIndex + 1;
  if (nextIndex >= state.scenario.dialogue.length) {
    return { ...state, isComplete: true, score: calculateFinalScore(state) };
  }
  return {
    ...state,
    currentLineIndex: nextIndex,
    revealedLines: [...state.revealedLines, nextIndex],
  };
}

export function submitTacticGuess(
  state: SpotInfluenceState,
  lineId: string,
  selectedText: string,
  tacticGuess: string,
): { state: SpotInfluenceState; result: PlayerTacticSelection } {
  const line = state.scenario.dialogue.find((l) => l.id === lineId);
  if (!line) throw new Error(`Unknown line: ${lineId}`);

  const matchedTactic = line.tactics.find((t) => {
    const tacticText = line.text.substring(t.startIndex, t.endIndex);
    const overlap = calculateOverlap(selectedText, tacticText);
    const categoryMatch =
      t.category.toLowerCase().includes(tacticGuess.toLowerCase()) ||
      t.name.toLowerCase().includes(tacticGuess.toLowerCase());
    return overlap > 0.3 && categoryMatch;
  });

  const selection: PlayerTacticSelection = {
    lineId,
    selectedText,
    tacticGuess,
    isCorrect: !!matchedTactic,
    matchedTactic,
  };

  const lineSelections = state.playerSelections[lineId] ?? [];
  const updatedSelections = {
    ...state.playerSelections,
    [lineId]: [...lineSelections, selection],
  };

  return {
    state: { ...state, playerSelections: updatedSelections },
    result: selection,
  };
}

export function markLineClean(
  state: SpotInfluenceState,
  lineId: string,
): { state: SpotInfluenceState; isCorrect: boolean } {
  const line = state.scenario.dialogue.find((l) => l.id === lineId);
  if (!line) throw new Error(`Unknown line: ${lineId}`);
  return { state, isCorrect: line.isClean };
}

export function calculateFinalScore(state: SpotInfluenceState): SpotInfluenceScore {
  const allTactics: InfluenceTactic[] = [];
  const foundTacticIds = new Set<string>();
  let falsePositives = 0;

  for (const line of state.scenario.dialogue) {
    allTactics.push(...line.tactics);
  }

  for (const selections of Object.values(state.playerSelections)) {
    for (const selection of selections) {
      if (selection.isCorrect && selection.matchedTactic) {
        foundTacticIds.add(selection.matchedTactic.id);
      } else if (!selection.isCorrect) {
        falsePositives++;
      }
    }
  }

  const missedTactics = allTactics.filter((t) => !foundTacticIds.has(t.id));

  const categoryBreakdown: Record<string, { found: number; total: number }> = {};
  for (const tactic of allTactics) {
    if (!categoryBreakdown[tactic.category]) {
      categoryBreakdown[tactic.category] = { found: 0, total: 0 };
    }
    categoryBreakdown[tactic.category].total++;
    if (foundTacticIds.has(tactic.id)) {
      categoryBreakdown[tactic.category].found++;
    }
  }

  const totalAttempts = foundTacticIds.size + falsePositives;
  const accuracy = totalAttempts > 0 ? foundTacticIds.size / totalAttempts : 0;

  return {
    totalTactics: allTactics.length,
    tacticsIdentified: foundTacticIds.size,
    falsePositives,
    accuracy: Math.round(accuracy * 100),
    missedTactics,
    categoryBreakdown,
  };
}

function countTotalTactics(scenario: InfluenceScenario): number {
  return scenario.dialogue.reduce((sum, line) => sum + line.tactics.length, 0);
}

function calculateOverlap(selected: string, actual: string): number {
  const selectedLower = selected.toLowerCase();
  const actualLower = actual.toLowerCase();

  if (actualLower.includes(selectedLower) || selectedLower.includes(actualLower)) {
    return 1;
  }

  const selectedWords = new Set(selectedLower.split(/\s+/));
  const actualWords = new Set(actualLower.split(/\s+/));
  let overlap = 0;
  for (const word of selectedWords) {
    if (actualWords.has(word)) overlap++;
  }
  return overlap / Math.max(selectedWords.size, actualWords.size);
}
