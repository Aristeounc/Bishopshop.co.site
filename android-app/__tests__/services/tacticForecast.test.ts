import {
  startForecast,
  submitPrediction,
  advanceForecastRound,
  calculateForecastScore,
} from '../../src/services/tacticForecast/engine';
import {
  FORECAST_SETS,
  getAllForecastRounds,
  getForecastSetById,
  getForecastSetsByDifficulty,
  ForecastRound,
} from '../../src/services/tacticForecast/scenarios';

describe('Tactic Forecast Engine', () => {
  describe('startForecast', () => {
    it('initializes with first round in reading phase', () => {
      const state = startForecast('workplace_politics');
      expect(state.set.id).toBe('workplace_politics');
      expect(state.currentRoundIndex).toBe(0);
      expect(state.predictions).toEqual([]);
      expect(state.phase).toBe('reading');
      expect(state.isComplete).toBe(false);
    });

    it('picks random set when no id provided', () => {
      const state = startForecast();
      expect(state.set).toBeTruthy();
      expect(FORECAST_SETS.map((s) => s.id)).toContain(state.set.id);
    });

    it('falls back to first set when id is invalid', () => {
      const state = startForecast('nonexistent_set');
      expect(state.set.id).toBe(FORECAST_SETS[0].id);
    });

    it('initializes score with correct totalRounds', () => {
      const state = startForecast('workplace_politics');
      const expectedRounds = FORECAST_SETS.find((s) => s.id === 'workplace_politics')!.rounds.length;
      expect(state.score.totalRounds).toBe(expectedRounds);
      expect(state.score.correctPredictions).toBe(0);
      expect(state.score.accuracy).toBe(0);
    });
  });

  describe('submitPrediction', () => {
    it('correctly identifies a correct prediction', () => {
      const state = startForecast('workplace_politics');
      const round = state.set.rounds[0];
      const { state: updated, isCorrect } = submitPrediction(
        state,
        round.correctTactic,
        5000,
      );
      expect(isCorrect).toBe(true);
      expect(updated.predictions.length).toBe(1);
      expect(updated.predictions[0].isCorrect).toBe(true);
      expect(updated.predictions[0].predictedTactic).toBe(round.correctTactic);
      expect(updated.phase).toBe('reveal');
    });

    it('correctly identifies an incorrect prediction', () => {
      const state = startForecast('workplace_politics');
      const round = state.set.rounds[0];
      const wrongTactic = round.decoyTactics[0].tactic;
      const { state: updated, isCorrect } = submitPrediction(
        state,
        wrongTactic,
        3000,
      );
      expect(isCorrect).toBe(false);
      expect(updated.predictions[0].isCorrect).toBe(false);
      expect(updated.predictions[0].predictedTactic).toBe(wrongTactic);
    });

    it('records time to answer', () => {
      const state = startForecast('workplace_politics');
      const round = state.set.rounds[0];
      const { state: updated } = submitPrediction(state, round.correctTactic, 7500);
      expect(updated.predictions[0].timeToAnswer).toBe(7500);
    });

    it('transitions phase to reveal', () => {
      const state = startForecast('workplace_politics');
      const round = state.set.rounds[0];
      const { state: updated } = submitPrediction(state, round.correctTactic, 5000);
      expect(updated.phase).toBe('reveal');
    });
  });

  describe('advanceForecastRound', () => {
    it('advances to next round in reading phase', () => {
      let state = startForecast('workplace_politics');
      const round = state.set.rounds[0];
      const { state: afterPrediction } = submitPrediction(state, round.correctTactic, 5000);
      const advanced = advanceForecastRound(afterPrediction);
      expect(advanced.currentRoundIndex).toBe(1);
      expect(advanced.phase).toBe('reading');
      expect(advanced.isComplete).toBe(false);
    });

    it('marks complete when all rounds are done', () => {
      let state = startForecast('workplace_politics');
      const totalRounds = state.set.rounds.length;

      for (let i = 0; i < totalRounds; i++) {
        const round = state.set.rounds[state.currentRoundIndex];
        const { state: afterPrediction } = submitPrediction(state, round.correctTactic, 5000);
        state = advanceForecastRound(afterPrediction);
      }

      expect(state.isComplete).toBe(true);
      expect(state.phase).toBe('results');
    });

    it('calculates final score when complete', () => {
      let state = startForecast('workplace_politics');
      const totalRounds = state.set.rounds.length;

      for (let i = 0; i < totalRounds; i++) {
        const round = state.set.rounds[state.currentRoundIndex];
        const { state: afterPrediction } = submitPrediction(state, round.correctTactic, 5000);
        state = advanceForecastRound(afterPrediction);
      }

      expect(state.score.correctPredictions).toBe(totalRounds);
      expect(state.score.accuracy).toBe(1);
      expect(state.score.overallRating).toBe('oracle');
    });
  });

  describe('calculateForecastScore', () => {
    it('calculates accuracy correctly for mixed results', () => {
      let state = startForecast('workplace_politics');

      // Get first correct
      const round0 = state.set.rounds[0];
      const { state: s1 } = submitPrediction(state, round0.correctTactic, 4000);
      state = advanceForecastRound(s1);

      // Get second wrong
      const round1 = state.set.rounds[state.currentRoundIndex];
      const { state: s2 } = submitPrediction(state, round1.decoyTactics[0].tactic, 6000);
      state = advanceForecastRound(s2);

      // Get third correct
      const round2 = state.set.rounds[state.currentRoundIndex];
      const { state: s3 } = submitPrediction(state, round2.correctTactic, 3000);
      state = advanceForecastRound(s3);

      const score = calculateForecastScore(state);
      expect(score.correctPredictions).toBe(2);
      expect(score.accuracy).toBeCloseTo(2 / 3, 5);
    });

    it('calculates average time', () => {
      let state = startForecast('workplace_politics');

      const round0 = state.set.rounds[0];
      const { state: s1 } = submitPrediction(state, round0.correctTactic, 4000);
      state = advanceForecastRound(s1);

      const round1 = state.set.rounds[state.currentRoundIndex];
      const { state: s2 } = submitPrediction(state, round1.correctTactic, 6000);
      state = advanceForecastRound(s2);

      const score = calculateForecastScore(state);
      expect(score.averageTime).toBe(5000);
    });

    it('calculates longest correct streak', () => {
      let state = startForecast('workplace_politics');

      // Correct, Correct, Wrong, Correct, Correct — streak should be 2
      const rounds = state.set.rounds;
      const tactics = [
        rounds[0].correctTactic,       // correct
        rounds[1].correctTactic,       // correct
        rounds[2].decoyTactics[0].tactic, // wrong
        rounds[3].correctTactic,       // correct
        rounds[4].correctTactic,       // correct
      ];

      for (let i = 0; i < rounds.length; i++) {
        const { state: afterPrediction } = submitPrediction(state, tactics[i], 5000);
        state = advanceForecastRound(afterPrediction);
      }

      expect(state.score.streakBest).toBe(2);
    });

    it('assigns blind_spot rating for low accuracy', () => {
      let state = startForecast('workplace_politics');

      // Get all wrong
      for (let i = 0; i < state.set.rounds.length; i++) {
        const round = state.set.rounds[state.currentRoundIndex];
        const { state: afterPrediction } = submitPrediction(
          state,
          round.decoyTactics[0].tactic,
          5000,
        );
        state = advanceForecastRound(afterPrediction);
      }

      expect(state.score.overallRating).toBe('blind_spot');
    });

    it('assigns oracle rating for perfect accuracy', () => {
      let state = startForecast('workplace_politics');

      for (let i = 0; i < state.set.rounds.length; i++) {
        const round = state.set.rounds[state.currentRoundIndex];
        const { state: afterPrediction } = submitPrediction(
          state,
          round.correctTactic,
          5000,
        );
        state = advanceForecastRound(afterPrediction);
      }

      expect(state.score.overallRating).toBe('oracle');
    });

    it('returns empty score when no predictions made', () => {
      const state = startForecast('workplace_politics');
      const score = calculateForecastScore(state);
      expect(score.correctPredictions).toBe(0);
      expect(score.accuracy).toBe(0);
      expect(score.averageTime).toBe(0);
      expect(score.streakBest).toBe(0);
      expect(score.overallRating).toBe('blind_spot');
    });
  });
});

describe('Forecast Scenarios', () => {
  it('has at least 5 forecast sets', () => {
    expect(FORECAST_SETS.length).toBeGreaterThanOrEqual(5);
  });

  it('each set has 4-5 rounds', () => {
    for (const set of FORECAST_SETS) {
      expect(set.rounds.length).toBeGreaterThanOrEqual(4);
      expect(set.rounds.length).toBeLessThanOrEqual(5);
    }
  });

  it('each set has valid structure', () => {
    for (const set of FORECAST_SETS) {
      expect(set.id).toBeTruthy();
      expect(set.title).toBeTruthy();
      expect(set.description).toBeTruthy();
      expect(set.theme).toBeTruthy();
      expect(set.difficulty).toBeGreaterThanOrEqual(1);
      expect(set.difficulty).toBeLessThanOrEqual(5);
    }
  });

  it('each round has correct tactic and 2-3 decoys', () => {
    for (const set of FORECAST_SETS) {
      for (const round of set.rounds) {
        expect(round.correctTactic).toBeTruthy();
        expect(round.correctTacticLabel).toBeTruthy();
        expect(round.decoyTactics.length).toBeGreaterThanOrEqual(2);
        expect(round.decoyTactics.length).toBeLessThanOrEqual(3);
      }
    }
  });

  it('each round has 2-3 setup lines', () => {
    for (const set of FORECAST_SETS) {
      for (const round of set.rounds) {
        expect(round.setupLines.length).toBeGreaterThanOrEqual(2);
        expect(round.setupLines.length).toBeLessThanOrEqual(3);
      }
    }
  });

  it('each round has a reveal line', () => {
    for (const set of FORECAST_SETS) {
      for (const round of set.rounds) {
        expect(round.revealLine.speaker).toBeTruthy();
        expect(round.revealLine.text).toBeTruthy();
      }
    }
  });

  it('each round has an explanation', () => {
    for (const set of FORECAST_SETS) {
      for (const round of set.rounds) {
        expect(round.explanation).toBeTruthy();
        expect(round.explanation.length).toBeGreaterThan(50);
      }
    }
  });

  it('each round has valid difficulty and skillTrack', () => {
    const validSkillTracks = [
      'regulate', 'connect', 'close', 'defend',
      'listen', 'assert', 'negotiate', 'empathize',
    ];
    for (const set of FORECAST_SETS) {
      for (const round of set.rounds) {
        expect(round.difficulty).toBeGreaterThanOrEqual(1);
        expect(round.difficulty).toBeLessThanOrEqual(5);
        expect(validSkillTracks).toContain(round.skillTrack);
      }
    }
  });

  it('decoy tactics do not include the correct tactic', () => {
    for (const set of FORECAST_SETS) {
      for (const round of set.rounds) {
        const decoyTacticIds = round.decoyTactics.map((d) => d.tactic);
        expect(decoyTacticIds).not.toContain(round.correctTactic);
      }
    }
  });

  it('round ids are unique across all sets', () => {
    const allRounds = getAllForecastRounds();
    const ids = allRounds.map((r) => r.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('getAllForecastRounds returns all rounds flattened', () => {
    const allRounds = getAllForecastRounds();
    const expectedCount = FORECAST_SETS.reduce((sum, s) => sum + s.rounds.length, 0);
    expect(allRounds.length).toBe(expectedCount);
  });

  it('getForecastSetById finds sets', () => {
    expect(getForecastSetById('workplace_politics')).toBeTruthy();
    expect(getForecastSetById('nonexistent')).toBeUndefined();
  });

  it('getForecastSetsByDifficulty filters correctly', () => {
    const easy = getForecastSetsByDifficulty(2);
    for (const s of easy) {
      expect(s.difficulty).toBeLessThanOrEqual(2);
    }
    expect(easy.length).toBeGreaterThan(0);
  });
});
