import {
  startGauntlet,
  submitGauntletResponse,
  advanceGauntletRound,
  calculateGauntletScore,
} from '../../src/services/escalationGauntlet/engine';
import {
  GAUNTLET_SCENARIOS,
  getGauntletById,
  getGauntletByDifficulty,
} from '../../src/services/escalationGauntlet/scenarios';

describe('Escalation Gauntlet Engine', () => {
  describe('startGauntlet', () => {
    it('initializes at round 0 with intro phase', () => {
      const state = startGauntlet('raise_request');
      expect(state.scenario.id).toBe('raise_request');
      expect(state.currentRound).toBe(0);
      expect(state.phase).toBe('intro');
      expect(state.isComplete).toBe(false);
      expect(state.responses).toEqual([]);
    });

    it('picks random scenario when no id provided', () => {
      const state = startGauntlet();
      expect(state.scenario).toBeTruthy();
      expect(GAUNTLET_SCENARIOS.map((s) => s.id)).toContain(state.scenario.id);
    });

    it('falls back to first scenario for invalid id', () => {
      const state = startGauntlet('nonexistent');
      expect(state.scenario.id).toBe(GAUNTLET_SCENARIOS[0].id);
    });

    it('initializes score with zeroes', () => {
      const state = startGauntlet('raise_request');
      expect(state.score.averageComposure).toBe(0);
      expect(state.score.averageTechnique).toBe(0);
      expect(state.score.roundScores).toEqual([]);
    });
  });

  describe('submitGauntletResponse', () => {
    it('scores a calm, technique-rich response higher than a reactive one', () => {
      const state = startGauntlet('raise_request');

      const calmResponse = "I understand budget constraints are real. Could we look at what milestones would make this possible? I want to work toward a plan together.";
      const { roundResult: calmResult } = submitGauntletResponse(state, calmResponse);

      const reactiveResponse = "YOU NEVER appreciate what I do!! This is RIDICULOUS! You always take advantage of me and I'm SICK of it!!!";
      const { roundResult: reactiveResult } = submitGauntletResponse(state, reactiveResponse);

      expect(calmResult.composureScore).toBeGreaterThan(reactiveResult.composureScore);
      expect(calmResult.techniqueScore).toBeGreaterThan(reactiveResult.techniqueScore);
      expect(calmResult.overallScore).toBeGreaterThan(reactiveResult.overallScore);
    });

    it('transitions to feedback phase after submission', () => {
      const state = startGauntlet('raise_request');
      const { state: updated } = submitGauntletResponse(state, "I appreciate you hearing me out.");
      expect(updated.phase).toBe('feedback');
    });

    it('adds response to responses array', () => {
      const state = startGauntlet('raise_request');
      const { state: updated } = submitGauntletResponse(state, "Thank you for your time.");
      expect(updated.responses.length).toBe(1);
      expect(updated.responses[0].playerResponse).toBe("Thank you for your time.");
    });

    it('stores the correct roundId', () => {
      const state = startGauntlet('raise_request');
      const { roundResult } = submitGauntletResponse(state, "I hear you.");
      expect(roundResult.roundId).toBe(state.scenario.rounds[0].id);
    });

    it('scores all values between 0 and 100', () => {
      const state = startGauntlet('raise_request');
      const { roundResult } = submitGauntletResponse(state, "Test response here.");
      expect(roundResult.composureScore).toBeGreaterThanOrEqual(0);
      expect(roundResult.composureScore).toBeLessThanOrEqual(100);
      expect(roundResult.techniqueScore).toBeGreaterThanOrEqual(0);
      expect(roundResult.techniqueScore).toBeLessThanOrEqual(100);
      expect(roundResult.overallScore).toBeGreaterThanOrEqual(0);
      expect(roundResult.overallScore).toBeLessThanOrEqual(100);
    });

    it('penalizes ALL CAPS responses', () => {
      const state = startGauntlet('raise_request');
      const { roundResult: normalResult } = submitGauntletResponse(state, "I understand your concern and I appreciate you sharing that with me.");
      const { roundResult: capsResult } = submitGauntletResponse(state, "I UNDERSTAND YOUR CONCERN AND I APPRECIATE YOU SHARING THAT WITH ME.");
      expect(normalResult.composureScore).toBeGreaterThan(capsResult.composureScore);
    });

    it('penalizes excessive exclamation marks', () => {
      const state = startGauntlet('raise_request');
      const { roundResult: calmResult } = submitGauntletResponse(state, "I hear you and I want to find a solution together.");
      const { roundResult: excitedResult } = submitGauntletResponse(state, "I hear you! And I want to find a solution! Together! Let's do this! Right now!");
      expect(calmResult.composureScore).toBeGreaterThan(excitedResult.composureScore);
    });

    it('rewards empathy and de-escalation techniques', () => {
      const state = startGauntlet('raise_request');
      const { roundResult: noTechniqueResult } = submitGauntletResponse(state, "Okay fine we can talk about this later I guess that works for me.");
      const { roundResult: techniqueResult } = submitGauntletResponse(state, "I understand how you feel. Help me understand your concerns. I appreciate your honesty and I want to find a solution together.");
      expect(techniqueResult.techniqueScore).toBeGreaterThan(noTechniqueResult.techniqueScore);
    });

    it('throws for invalid round index', () => {
      let state = startGauntlet('raise_request');
      // Advance past all rounds
      for (let i = 0; i < 4; i++) {
        const { state: afterSubmit } = submitGauntletResponse(state, "Response " + i);
        state = advanceGauntletRound(afterSubmit);
      }
      expect(() => submitGauntletResponse(state, "Too late")).toThrow();
    });
  });

  describe('advanceGauntletRound', () => {
    it('increments round and sets responding phase', () => {
      let state = startGauntlet('raise_request');
      const { state: afterSubmit } = submitGauntletResponse(state, "Test.");
      state = advanceGauntletRound(afterSubmit);
      expect(state.currentRound).toBe(1);
      expect(state.phase).toBe('responding');
    });

    it('marks complete after all 4 rounds', () => {
      let state = startGauntlet('raise_request');
      for (let i = 0; i < 4; i++) {
        const { state: afterSubmit } = submitGauntletResponse(state, "Measured response for round " + i);
        state = advanceGauntletRound(afterSubmit);
      }
      expect(state.isComplete).toBe(true);
      expect(state.phase).toBe('results');
    });

    it('calculates final score when complete', () => {
      let state = startGauntlet('raise_request');
      for (let i = 0; i < 4; i++) {
        const { state: afterSubmit } = submitGauntletResponse(state, "I understand and I appreciate your perspective.");
        state = advanceGauntletRound(afterSubmit);
      }
      expect(state.score.roundScores.length).toBe(4);
      expect(state.score.averageComposure).toBeGreaterThan(0);
      expect(state.score.averageTechnique).toBeGreaterThan(0);
    });
  });

  describe('calculateGauntletScore', () => {
    it('returns crumbled for empty responses', () => {
      const state = startGauntlet('raise_request');
      const score = calculateGauntletScore(state);
      expect(score.overallRating).toBe('crumbled');
      expect(score.averageComposure).toBe(0);
    });

    it('assigns correct rating tiers', () => {
      let state = startGauntlet('raise_request');

      // Build up high-scoring responses
      for (let i = 0; i < 4; i++) {
        const { state: afterSubmit } = submitGauntletResponse(
          state,
          "I understand how you feel and I appreciate your honesty. Help me understand your perspective. Could we find a solution that works for both of us together?",
        );
        state = afterSubmit;
        if (i < 3) {
          state = advanceGauntletRound(state);
        }
      }

      const score = calculateGauntletScore(state);
      expect(['stood_firm', 'unshakeable']).toContain(score.overallRating);
    });

    it('detects declining composure trend', () => {
      let state = startGauntlet('raise_request');

      // Good first two rounds
      for (let i = 0; i < 2; i++) {
        const { state: afterSubmit } = submitGauntletResponse(
          state,
          "I understand and I appreciate your perspective. Let's find a solution together.",
        );
        state = advanceGauntletRound(afterSubmit);
      }
      // Reactive last two rounds
      for (let i = 0; i < 2; i++) {
        const { state: afterSubmit } = submitGauntletResponse(
          state,
          "WHATEVER! You NEVER listen! This is RIDICULOUS and UNFAIR!!! I can't believe this!",
        );
        if (i < 1) {
          state = advanceGauntletRound(afterSubmit);
        } else {
          state = afterSubmit;
        }
      }

      const score = calculateGauntletScore(state);
      expect(score.composureTrend).toBe('declining');
    });

    it('detects improving composure trend', () => {
      let state = startGauntlet('raise_request');

      // Reactive first two rounds
      for (let i = 0; i < 2; i++) {
        const { state: afterSubmit } = submitGauntletResponse(
          state,
          "SERIOUSLY?? You ALWAYS do this! This is RIDICULOUS! I can't even deal right now!!",
        );
        state = advanceGauntletRound(afterSubmit);
      }
      // Calm last two rounds
      for (let i = 0; i < 2; i++) {
        const { state: afterSubmit } = submitGauntletResponse(
          state,
          "I understand and I appreciate your perspective. Let's work together to find a solution.",
        );
        if (i < 1) {
          state = advanceGauntletRound(afterSubmit);
        } else {
          state = afterSubmit;
        }
      }

      const score = calculateGauntletScore(state);
      expect(score.composureTrend).toBe('improving');
    });

    it('averages composure and technique correctly', () => {
      let state = startGauntlet('raise_request');
      const { state: afterSubmit } = submitGauntletResponse(state, "I hear you and I appreciate that.");
      const score = calculateGauntletScore(afterSubmit);
      expect(score.roundScores.length).toBe(1);
      expect(score.averageComposure).toBe(score.roundScores[0].composureScore);
      expect(score.averageTechnique).toBe(score.roundScores[0].techniqueScore);
    });
  });
});

describe('Gauntlet Scenarios', () => {
  it('has at least 5 scenarios', () => {
    expect(GAUNTLET_SCENARIOS.length).toBeGreaterThanOrEqual(5);
  });

  it('each scenario has exactly 4 rounds', () => {
    for (const scenario of GAUNTLET_SCENARIOS) {
      expect(scenario.rounds.length).toBe(4);
    }
  });

  it('each scenario has valid structure', () => {
    for (const scenario of GAUNTLET_SCENARIOS) {
      expect(scenario.id).toBeTruthy();
      expect(scenario.title).toBeTruthy();
      expect(scenario.context).toBeTruthy();
      expect(scenario.opponent).toBeTruthy();
      expect(scenario.yourGoal).toBeTruthy();
      expect(scenario.skillsInvolved.length).toBeGreaterThan(0);
      expect(scenario.difficulty).toBeGreaterThanOrEqual(1);
      expect(scenario.difficulty).toBeLessThanOrEqual(5);
    }
  });

  it('each round has correct escalation progression', () => {
    const expectedLevels: Array<'civil' | 'emotional' | 'manipulative' | 'threatening'> = [
      'civil', 'emotional', 'manipulative', 'threatening',
    ];
    for (const scenario of GAUNTLET_SCENARIOS) {
      for (let i = 0; i < 4; i++) {
        expect(scenario.rounds[i].escalationLevel).toBe(expectedLevels[i]);
        expect(scenario.rounds[i].roundNumber).toBe(i + 1);
      }
    }
  });

  it('each round has required content fields', () => {
    for (const scenario of GAUNTLET_SCENARIOS) {
      for (const round of scenario.rounds) {
        expect(round.id).toBeTruthy();
        expect(round.opponentLine).toBeTruthy();
        expect(round.escalationTactic).toBeTruthy();
        expect(round.coachHint).toBeTruthy();
        expect(round.idealResponse).toBeTruthy();
      }
    }
  });

  it('getGauntletById finds scenarios', () => {
    expect(getGauntletById('raise_request')).toBeTruthy();
    expect(getGauntletById('boundary_parent')).toBeTruthy();
    expect(getGauntletById('nonexistent')).toBeUndefined();
  });

  it('getGauntletByDifficulty filters correctly', () => {
    const easy = getGauntletByDifficulty(2);
    for (const s of easy) {
      expect(s.difficulty).toBeLessThanOrEqual(2);
    }

    const all = getGauntletByDifficulty(5);
    expect(all.length).toBe(GAUNTLET_SCENARIOS.length);
  });

  it('all scenario ids are unique', () => {
    const ids = GAUNTLET_SCENARIOS.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('all round ids are unique across all scenarios', () => {
    const allIds: string[] = [];
    for (const scenario of GAUNTLET_SCENARIOS) {
      for (const round of scenario.rounds) {
        allIds.push(round.id);
      }
    }
    expect(new Set(allIds).size).toBe(allIds.length);
  });
});
