import {
  startSpotInfluence,
  advanceLine,
  submitTacticGuess,
  markLineClean,
  calculateFinalScore,
} from '../../src/services/spotInfluence/engine';
import {
  INFLUENCE_SCENARIOS,
  getScenarioById,
  getScenariosByDifficulty,
} from '../../src/services/spotInfluence/scenarios';

describe('Spot the Influence Engine', () => {
  describe('startSpotInfluence', () => {
    it('initializes with first line revealed', () => {
      const state = startSpotInfluence('car_dealership');
      expect(state.scenario.id).toBe('car_dealership');
      expect(state.currentLineIndex).toBe(0);
      expect(state.revealedLines).toEqual([0]);
      expect(state.isComplete).toBe(false);
    });

    it('picks random scenario when no id provided', () => {
      const state = startSpotInfluence();
      expect(state.scenario).toBeTruthy();
      expect(INFLUENCE_SCENARIOS.map((s) => s.id)).toContain(state.scenario.id);
    });

    it('counts total tactics correctly', () => {
      const state = startSpotInfluence('car_dealership');
      const scenario = INFLUENCE_SCENARIOS.find((s) => s.id === 'car_dealership')!;
      const expected = scenario.dialogue.reduce((sum, l) => sum + l.tactics.length, 0);
      expect(state.score.totalTactics).toBe(expected);
    });
  });

  describe('advanceLine', () => {
    it('reveals next line and increments index', () => {
      let state = startSpotInfluence('car_dealership');
      state = advanceLine(state);
      expect(state.currentLineIndex).toBe(1);
      expect(state.revealedLines).toEqual([0, 1]);
    });

    it('marks complete when all lines revealed', () => {
      let state = startSpotInfluence('car_dealership');
      const totalLines = state.scenario.dialogue.length;
      for (let i = 0; i < totalLines; i++) {
        state = advanceLine(state);
      }
      expect(state.isComplete).toBe(true);
    });
  });

  describe('submitTacticGuess', () => {
    it('correctly identifies a matching tactic', () => {
      const state = startSpotInfluence('car_dealership');
      const firstLine = state.scenario.dialogue[0];
      const { result } = submitTacticGuess(
        state,
        firstLine.id,
        "you've got a really good eye",
        'flattery',
      );
      expect(result.isCorrect).toBe(true);
      expect(result.matchedTactic?.category).toBe('flattery');
    });

    it('rejects incorrect category guesses', () => {
      const state = startSpotInfluence('car_dealership');
      const firstLine = state.scenario.dialogue[0];
      const { result } = submitTacticGuess(
        state,
        firstLine.id,
        "you've got a really good eye",
        'scarcity',
      );
      expect(result.isCorrect).toBe(false);
    });

    it('stores selections per line', () => {
      let state = startSpotInfluence('car_dealership');
      const firstLine = state.scenario.dialogue[0];
      const r = submitTacticGuess(state, firstLine.id, 'good eye', 'flattery');
      state = r.state;
      expect(state.playerSelections[firstLine.id]?.length).toBe(1);
    });
  });

  describe('markLineClean', () => {
    it('returns true for clean lines', () => {
      const state = startSpotInfluence('car_dealership');
      const cleanLine = state.scenario.dialogue.find((l) => l.isClean);
      if (cleanLine) {
        const { isCorrect } = markLineClean(state, cleanLine.id);
        expect(isCorrect).toBe(true);
      }
    });

    it('returns false for lines with tactics', () => {
      const state = startSpotInfluence('car_dealership');
      const tacticLine = state.scenario.dialogue.find((l) => !l.isClean);
      if (tacticLine) {
        const { isCorrect } = markLineClean(state, tacticLine.id);
        expect(isCorrect).toBe(false);
      }
    });
  });

  describe('calculateFinalScore', () => {
    it('calculates accuracy correctly', () => {
      let state = startSpotInfluence('car_dealership');
      const firstLine = state.scenario.dialogue[0];
      const r = submitTacticGuess(state, firstLine.id, 'good eye', 'flattery');
      state = r.state;

      const score = calculateFinalScore(state);
      expect(score.tacticsIdentified).toBeGreaterThanOrEqual(1);
      expect(score.accuracy).toBeGreaterThan(0);
    });

    it('tracks false positives', () => {
      let state = startSpotInfluence('car_dealership');
      const cleanLine = state.scenario.dialogue.find((l) => l.isClean)!;
      const r = submitTacticGuess(state, cleanLine.id, 'still researching', 'scarcity');
      state = r.state;

      const score = calculateFinalScore(state);
      expect(score.falsePositives).toBe(1);
    });

    it('lists missed tactics', () => {
      const state = startSpotInfluence('car_dealership');
      const score = calculateFinalScore(state);
      expect(score.missedTactics.length).toBe(score.totalTactics);
    });
  });
});

describe('Scenarios', () => {
  it('has at least 5 scenarios', () => {
    expect(INFLUENCE_SCENARIOS.length).toBeGreaterThanOrEqual(5);
  });

  it('each scenario has valid structure', () => {
    for (const scenario of INFLUENCE_SCENARIOS) {
      expect(scenario.id).toBeTruthy();
      expect(scenario.title).toBeTruthy();
      expect(scenario.dialogue.length).toBeGreaterThanOrEqual(3);
      expect(scenario.difficulty).toBeGreaterThanOrEqual(1);
      expect(scenario.difficulty).toBeLessThanOrEqual(5);
    }
  });

  it('each scenario has at least one clean line', () => {
    for (const scenario of INFLUENCE_SCENARIOS) {
      const hasClean = scenario.dialogue.some((l) => l.isClean);
      expect(hasClean).toBe(true);
    }
  });

  it('getScenarioById finds scenarios', () => {
    expect(getScenarioById('car_dealership')).toBeTruthy();
    expect(getScenarioById('nonexistent')).toBeUndefined();
  });

  it('getScenariosByDifficulty filters correctly', () => {
    const easy = getScenariosByDifficulty(2);
    for (const s of easy) {
      expect(s.difficulty).toBeLessThanOrEqual(2);
    }
  });
});
