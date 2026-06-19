import {
  startSubtextSession,
  submitTranslation,
  advancePrompt,
  calculateSubtextScore,
} from '../../src/services/subtextTranslator/engine';
import {
  SUBTEXT_SETS,
  SUBTEXT_PROMPTS,
  getSetById,
  getPromptsByDifficulty,
} from '../../src/services/subtextTranslator/prompts';

describe('Subtext Translator Engine', () => {
  describe('startSubtextSession', () => {
    it('initializes with first prompt at index 0', () => {
      const state = startSubtextSession('everyday_deflections');
      expect(state.set.id).toBe('everyday_deflections');
      expect(state.currentIndex).toBe(0);
      expect(state.responses).toEqual([]);
      expect(state.isComplete).toBe(false);
    });

    it('picks random set when no id provided', () => {
      const state = startSubtextSession();
      expect(state.set).toBeTruthy();
      expect(SUBTEXT_SETS.map((s) => s.id)).toContain(state.set.id);
    });

    it('falls back to first set when invalid id given', () => {
      const state = startSubtextSession('nonexistent_set');
      expect(state.set.id).toBe(SUBTEXT_SETS[0].id);
    });

    it('initializes score correctly', () => {
      const state = startSubtextSession('everyday_deflections');
      expect(state.score.totalPrompts).toBe(state.set.prompts.length);
      expect(state.score.completed).toBe(0);
      expect(state.score.averageAccuracy).toBe(0);
      expect(state.score.emotionsCorrect).toBe(0);
      expect(state.score.overallRating).toBe('novice');
    });
  });

  describe('submitTranslation', () => {
    it('scores a good translation higher than a bad one', () => {
      const state = startSubtextSession('everyday_deflections');
      const prompt = state.set.prompts[0];

      const { response: good } = submitTranslation(
        state,
        prompt.actualSubtext,
        prompt.underlyingEmotion,
      );

      const { response: bad } = submitTranslation(
        state,
        'I have no idea what they mean',
        'exhaustion',
      );

      expect(good.accuracyScore).toBeGreaterThan(bad.accuracyScore);
    });

    it('matches emotion correctly', () => {
      const state = startSubtextSession('everyday_deflections');
      const prompt = state.set.prompts[0];

      const { response } = submitTranslation(
        state,
        'some translation',
        prompt.underlyingEmotion,
      );

      expect(response.emotionMatch).toBe(true);
    });

    it('rejects wrong emotion guess', () => {
      const state = startSubtextSession('everyday_deflections');
      const prompt = state.set.prompts[0];

      // Pick an emotion that doesn't match
      const wrongEmotion = prompt.underlyingEmotion === 'hurt' ? 'anger' : 'hurt';
      const { response } = submitTranslation(
        state,
        'some translation',
        wrongEmotion,
      );

      expect(response.emotionMatch).toBe(false);
    });

    it('accumulates responses in state', () => {
      let state = startSubtextSession('everyday_deflections');

      const r1 = submitTranslation(state, 'first attempt', 'hurt');
      state = r1.state;
      expect(state.responses.length).toBe(1);

      state = advancePrompt(state);

      const r2 = submitTranslation(state, 'second attempt', 'anger');
      state = r2.state;
      expect(state.responses.length).toBe(2);
    });

    it('updates running score after each submission', () => {
      let state = startSubtextSession('everyday_deflections');
      expect(state.score.completed).toBe(0);

      const { state: updated } = submitTranslation(
        state,
        'any translation',
        'hurt',
      );
      expect(updated.score.completed).toBe(1);
    });

    it('gives a perfect answer high accuracy', () => {
      const state = startSubtextSession('everyday_deflections');
      const prompt = state.set.prompts[0];

      const { response } = submitTranslation(
        state,
        prompt.actualSubtext,
        prompt.underlyingEmotion,
      );

      expect(response.accuracyScore).toBeGreaterThanOrEqual(80);
      expect(response.emotionMatch).toBe(true);
    });
  });

  describe('advancePrompt', () => {
    it('increments the current index', () => {
      let state = startSubtextSession('everyday_deflections');
      state = advancePrompt(state);
      expect(state.currentIndex).toBe(1);
    });

    it('marks complete when all prompts done', () => {
      let state = startSubtextSession('everyday_deflections');
      const totalPrompts = state.set.prompts.length;
      for (let i = 0; i < totalPrompts; i++) {
        state = advancePrompt(state);
      }
      expect(state.isComplete).toBe(true);
    });

    it('does not mark complete before last prompt', () => {
      let state = startSubtextSession('everyday_deflections');
      state = advancePrompt(state);
      expect(state.isComplete).toBe(false);
    });
  });

  describe('calculateSubtextScore', () => {
    it('returns novice for no responses', () => {
      const state = startSubtextSession('everyday_deflections');
      const score = calculateSubtextScore(state);
      expect(score.overallRating).toBe('novice');
      expect(score.averageAccuracy).toBe(0);
    });

    it('calculates average accuracy', () => {
      let state = startSubtextSession('everyday_deflections');
      const prompt = state.set.prompts[0];

      const { state: updated } = submitTranslation(
        state,
        prompt.actualSubtext,
        prompt.underlyingEmotion,
      );

      const score = calculateSubtextScore(updated);
      expect(score.averageAccuracy).toBeGreaterThan(0);
      expect(score.completed).toBe(1);
    });

    it('counts emotion matches', () => {
      let state = startSubtextSession('everyday_deflections');
      const prompt = state.set.prompts[0];

      const { state: updated } = submitTranslation(
        state,
        prompt.actualSubtext,
        prompt.underlyingEmotion,
      );

      const score = calculateSubtextScore(updated);
      expect(score.emotionsCorrect).toBe(1);
    });

    it('assigns high rating for strong performance', () => {
      let state = startSubtextSession('everyday_deflections');

      for (let i = 0; i < state.set.prompts.length; i++) {
        const prompt = state.set.prompts[i];
        const { state: updated } = submitTranslation(
          state,
          prompt.actualSubtext,
          prompt.underlyingEmotion,
        );
        state = updated;
        if (i < state.set.prompts.length - 1) {
          state = advancePrompt(state);
        }
      }

      const score = calculateSubtextScore(state);
      expect(['empath', 'mind_reader']).toContain(score.overallRating);
    });
  });
});

describe('Subtext Prompts', () => {
  it('has at least 20 prompts', () => {
    expect(SUBTEXT_PROMPTS.length).toBeGreaterThanOrEqual(20);
  });

  it('has at least 4 sets', () => {
    expect(SUBTEXT_SETS.length).toBeGreaterThanOrEqual(4);
  });

  it('each set has 5 prompts', () => {
    for (const set of SUBTEXT_SETS) {
      expect(set.prompts.length).toBe(5);
    }
  });

  it('each prompt has all required fields', () => {
    for (const prompt of SUBTEXT_PROMPTS) {
      expect(prompt.id).toBeTruthy();
      expect(prompt.statement).toBeTruthy();
      expect(prompt.speaker).toBeTruthy();
      expect(prompt.context).toBeTruthy();
      expect(prompt.actualSubtext).toBeTruthy();
      expect(prompt.underlyingEmotion).toBeTruthy();
      expect(prompt.difficulty).toBeGreaterThanOrEqual(1);
      expect(prompt.difficulty).toBeLessThanOrEqual(5);
      expect(prompt.skillTrack).toBeTruthy();
    }
  });

  it('each set has valid structure', () => {
    for (const set of SUBTEXT_SETS) {
      expect(set.id).toBeTruthy();
      expect(set.title).toBeTruthy();
      expect(set.description).toBeTruthy();
      expect(set.difficulty).toBeGreaterThanOrEqual(1);
      expect(set.difficulty).toBeLessThanOrEqual(5);
    }
  });

  it('all prompt ids are unique', () => {
    const ids = SUBTEXT_PROMPTS.map((p) => p.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('getSetById finds sets', () => {
    expect(getSetById('everyday_deflections')).toBeTruthy();
    expect(getSetById('nonexistent')).toBeUndefined();
  });

  it('getPromptsByDifficulty filters correctly', () => {
    const easy = getPromptsByDifficulty(2);
    for (const p of easy) {
      expect(p.difficulty).toBeLessThanOrEqual(2);
    }
    expect(easy.length).toBeGreaterThan(0);
  });

  it('prompts span diverse skill tracks', () => {
    const tracks = new Set(SUBTEXT_PROMPTS.map((p) => p.skillTrack));
    expect(tracks.size).toBeGreaterThanOrEqual(3);
  });

  it('prompts span diverse emotions', () => {
    const emotions = new Set(SUBTEXT_PROMPTS.map((p) => p.underlyingEmotion));
    expect(emotions.size).toBeGreaterThanOrEqual(5);
  });
});
