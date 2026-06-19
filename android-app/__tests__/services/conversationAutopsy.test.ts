import {
  startAutopsy,
  revealNextLine,
  selectDerailmentLine,
  submitDiagnosis,
  submitRewrite,
  calculateAutopsyScore,
} from '../../src/services/conversationAutopsy/engine';
import {
  AUTOPSY_SCENARIOS,
  getAutopsyById,
  getAutopsyByDifficulty,
} from '../../src/services/conversationAutopsy/scenarios';

describe('Conversation Autopsy Engine', () => {
  describe('startAutopsy', () => {
    it('initializes with first line revealed and reading phase', () => {
      const state = startAutopsy('chores_blowup');
      expect(state.scenario.id).toBe('chores_blowup');
      expect(state.currentLineIndex).toBe(0);
      expect(state.revealedLines).toEqual([0]);
      expect(state.phase).toBe('reading');
      expect(state.isComplete).toBe(false);
    });

    it('picks random scenario when no id provided', () => {
      const state = startAutopsy();
      expect(state.scenario).toBeTruthy();
      expect(AUTOPSY_SCENARIOS.map((s) => s.id)).toContain(state.scenario.id);
    });

    it('falls back to first scenario for unknown id', () => {
      const state = startAutopsy('nonexistent_scenario');
      expect(state.scenario.id).toBe(AUTOPSY_SCENARIOS[0].id);
    });

    it('initializes score to zero', () => {
      const state = startAutopsy('chores_blowup');
      expect(state.score.correctDerailment).toBe(false);
      expect(state.score.totalScore).toBe(0);
      expect(state.score.diagnosisScore).toBe(0);
      expect(state.score.rewriteSubmitted).toBe(false);
    });

    it('starts with null selections', () => {
      const state = startAutopsy('chores_blowup');
      expect(state.playerSelection).toBeNull();
      expect(state.playerDiagnosis).toBeNull();
      expect(state.playerRewrite).toBeNull();
    });
  });

  describe('revealNextLine', () => {
    it('reveals next line and increments index', () => {
      let state = startAutopsy('chores_blowup');
      state = revealNextLine(state);
      expect(state.currentLineIndex).toBe(1);
      expect(state.revealedLines).toEqual([0, 1]);
      expect(state.phase).toBe('reading');
    });

    it('transitions to selecting phase when all lines revealed', () => {
      let state = startAutopsy('chores_blowup');
      const totalLines = state.scenario.dialogue.length;
      for (let i = 0; i < totalLines; i++) {
        state = revealNextLine(state);
      }
      expect(state.phase).toBe('selecting');
    });

    it('reveals lines incrementally', () => {
      let state = startAutopsy('feedback_shutdown');
      state = revealNextLine(state);
      state = revealNextLine(state);
      state = revealNextLine(state);
      expect(state.currentLineIndex).toBe(3);
      expect(state.revealedLines).toEqual([0, 1, 2, 3]);
    });
  });

  describe('selectDerailmentLine', () => {
    it('correctly identifies the derailment line', () => {
      let state = startAutopsy('chores_blowup');
      // Reveal all lines first
      const totalLines = state.scenario.dialogue.length;
      for (let i = 0; i < totalLines; i++) {
        state = revealNextLine(state);
      }

      const derailmentLine = state.scenario.dialogue.find((l) => l.isDerailment)!;
      const { state: newState, isCorrect } = selectDerailmentLine(state, derailmentLine.id);
      expect(isCorrect).toBe(true);
      expect(newState.score.correctDerailment).toBe(true);
      expect(newState.playerSelection).toBe(derailmentLine.id);
      expect(newState.phase).toBe('diagnosing');
    });

    it('marks incorrect when wrong line selected', () => {
      let state = startAutopsy('chores_blowup');
      const totalLines = state.scenario.dialogue.length;
      for (let i = 0; i < totalLines; i++) {
        state = revealNextLine(state);
      }

      const nonDerailmentLine = state.scenario.dialogue.find((l) => !l.isDerailment)!;
      const { state: newState, isCorrect } = selectDerailmentLine(state, nonDerailmentLine.id);
      expect(isCorrect).toBe(false);
      expect(newState.score.correctDerailment).toBe(false);
      expect(newState.phase).toBe('diagnosing');
    });

    it('throws for unknown line id', () => {
      const state = startAutopsy('chores_blowup');
      expect(() => selectDerailmentLine(state, 'fake_line_id')).toThrow('Unknown line: fake_line_id');
    });

    it('transitions to diagnosing phase regardless of correctness', () => {
      let state = startAutopsy('feedback_shutdown');
      const totalLines = state.scenario.dialogue.length;
      for (let i = 0; i < totalLines; i++) {
        state = revealNextLine(state);
      }

      const firstLine = state.scenario.dialogue[0];
      const { state: newState } = selectDerailmentLine(state, firstLine.id);
      expect(newState.phase).toBe('diagnosing');
    });
  });

  describe('submitDiagnosis', () => {
    it('scores correctly for matching category', () => {
      let state = startAutopsy('chores_blowup');
      state = { ...state, phase: 'diagnosing' };
      const updated = submitDiagnosis(state, 'criticism');
      expect(updated.playerDiagnosis).toBe('criticism');
      expect(updated.score.diagnosisScore).toBe(40);
      expect(updated.phase).toBe('rewriting');
    });

    it('scores zero for wrong category', () => {
      let state = startAutopsy('chores_blowup');
      state = { ...state, phase: 'diagnosing' };
      const updated = submitDiagnosis(state, 'contempt');
      expect(updated.playerDiagnosis).toBe('contempt');
      expect(updated.score.diagnosisScore).toBe(0);
      expect(updated.phase).toBe('rewriting');
    });

    it('transitions to rewriting phase', () => {
      let state = startAutopsy('feedback_shutdown');
      state = { ...state, phase: 'diagnosing' };
      const updated = submitDiagnosis(state, 'defensiveness');
      expect(updated.phase).toBe('rewriting');
    });
  });

  describe('submitRewrite', () => {
    it('stores rewrite text and marks as submitted', () => {
      let state = startAutopsy('chores_blowup');
      state = { ...state, phase: 'rewriting' };
      const updated = submitRewrite(state, 'I feel frustrated when the dishes pile up. Can we make a plan?');
      expect(updated.playerRewrite).toBe('I feel frustrated when the dishes pile up. Can we make a plan?');
      expect(updated.score.rewriteSubmitted).toBe(true);
    });

    it('does not mark as submitted for empty rewrite', () => {
      let state = startAutopsy('chores_blowup');
      state = { ...state, phase: 'rewriting' };
      const updated = submitRewrite(state, '   ');
      expect(updated.score.rewriteSubmitted).toBe(false);
    });
  });

  describe('calculateAutopsyScore', () => {
    it('gives full score for perfect performance', () => {
      let state = startAutopsy('chores_blowup');
      const derailmentLine = state.scenario.dialogue.find((l) => l.isDerailment)!;

      // Simulate full correct play
      state = {
        ...state,
        playerSelection: derailmentLine.id,
        playerDiagnosis: state.scenario.mistakeCategory,
        playerRewrite: 'A better version',
        score: {
          correctDerailment: true,
          diagnosisScore: 40,
          rewriteSubmitted: true,
          totalScore: 0,
        },
      };

      const scored = calculateAutopsyScore(state);
      expect(scored.score.totalScore).toBe(100);
      expect(scored.phase).toBe('results');
      expect(scored.isComplete).toBe(true);
    });

    it('gives 40 points for correct derailment only', () => {
      let state = startAutopsy('chores_blowup');
      state = {
        ...state,
        score: {
          correctDerailment: true,
          diagnosisScore: 0,
          rewriteSubmitted: false,
          totalScore: 0,
        },
      };

      const scored = calculateAutopsyScore(state);
      expect(scored.score.totalScore).toBe(40);
    });

    it('gives 40 points for correct diagnosis only', () => {
      let state = startAutopsy('chores_blowup');
      state = {
        ...state,
        score: {
          correctDerailment: false,
          diagnosisScore: 40,
          rewriteSubmitted: false,
          totalScore: 0,
        },
      };

      const scored = calculateAutopsyScore(state);
      expect(scored.score.totalScore).toBe(40);
    });

    it('gives 20 points for rewrite only', () => {
      let state = startAutopsy('chores_blowup');
      state = {
        ...state,
        score: {
          correctDerailment: false,
          diagnosisScore: 0,
          rewriteSubmitted: true,
          totalScore: 0,
        },
      };

      const scored = calculateAutopsyScore(state);
      expect(scored.score.totalScore).toBe(20);
    });

    it('gives 0 for no correct actions', () => {
      let state = startAutopsy('chores_blowup');
      state = {
        ...state,
        score: {
          correctDerailment: false,
          diagnosisScore: 0,
          rewriteSubmitted: false,
          totalScore: 0,
        },
      };

      const scored = calculateAutopsyScore(state);
      expect(scored.score.totalScore).toBe(0);
    });

    it('marks state as complete', () => {
      const state = startAutopsy('chores_blowup');
      const scored = calculateAutopsyScore(state);
      expect(scored.isComplete).toBe(true);
      expect(scored.phase).toBe('results');
    });
  });
});

describe('Autopsy Scenarios', () => {
  it('has at least 5 scenarios', () => {
    expect(AUTOPSY_SCENARIOS.length).toBeGreaterThanOrEqual(5);
  });

  it('each scenario has valid structure', () => {
    for (const scenario of AUTOPSY_SCENARIOS) {
      expect(scenario.id).toBeTruthy();
      expect(scenario.title).toBeTruthy();
      expect(scenario.context).toBeTruthy();
      expect(scenario.derailmentDiagnosis).toBeTruthy();
      expect(scenario.betterAlternative).toBeTruthy();
      expect(scenario.mistakeCategory).toBeTruthy();
      expect(scenario.skillsInvolved.length).toBeGreaterThanOrEqual(1);
      expect(scenario.dialogue.length).toBeGreaterThanOrEqual(6);
      expect(scenario.difficulty).toBeGreaterThanOrEqual(1);
      expect(scenario.difficulty).toBeLessThanOrEqual(5);
    }
  });

  it('each scenario has exactly one derailment line', () => {
    for (const scenario of AUTOPSY_SCENARIOS) {
      const derailmentLines = scenario.dialogue.filter((l) => l.isDerailment);
      expect(derailmentLines.length).toBe(1);
    }
  });

  it('derailment line is never the first line', () => {
    for (const scenario of AUTOPSY_SCENARIOS) {
      const firstLine = scenario.dialogue[0];
      expect(firstLine.isDerailment).toBe(false);
    }
  });

  it('each scenario has a valid mistake category', () => {
    const validCategories = [
      'criticism', 'contempt', 'defensiveness', 'stonewalling',
      'boundary_violation', 'manipulation', 'escalation', 'invalidation',
    ];
    for (const scenario of AUTOPSY_SCENARIOS) {
      expect(validCategories).toContain(scenario.mistakeCategory);
    }
  });

  it('each scenario has valid SkillTrackIds', () => {
    const validSkills = ['regulate', 'connect', 'close', 'defend', 'listen', 'assert', 'negotiate', 'empathize'];
    for (const scenario of AUTOPSY_SCENARIOS) {
      for (const skill of scenario.skillsInvolved) {
        expect(validSkills).toContain(skill);
      }
    }
  });

  it('getAutopsyById finds scenarios', () => {
    expect(getAutopsyById('chores_blowup')).toBeTruthy();
    expect(getAutopsyById('feedback_shutdown')).toBeTruthy();
    expect(getAutopsyById('nonexistent')).toBeUndefined();
  });

  it('getAutopsyByDifficulty filters correctly', () => {
    const easy = getAutopsyByDifficulty(2);
    expect(easy.length).toBeGreaterThanOrEqual(1);
    for (const s of easy) {
      expect(s.difficulty).toBeLessThanOrEqual(2);
    }
  });

  it('getAutopsyByDifficulty returns all for max difficulty', () => {
    const all = getAutopsyByDifficulty(5);
    expect(all.length).toBe(AUTOPSY_SCENARIOS.length);
  });
});
