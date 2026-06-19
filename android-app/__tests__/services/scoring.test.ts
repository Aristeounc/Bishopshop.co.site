import {
  calculateEloChange,
  computeSessionScore,
  calculateMultiTrackEloChanges,
  evaluateResponse,
} from '../../src/services/sparring/scoring';
import { CoachFeedback, SkillTrackId } from '../../src/models/types';

describe('ELO Scoring', () => {
  describe('calculateEloChange', () => {
    it('awards positive ELO for high scores against tough opponents', () => {
      const change = calculateEloChange(500, 4, 85);
      expect(change).toBeGreaterThan(0);
    });

    it('deducts ELO for low scores', () => {
      const change = calculateEloChange(500, 2, 20);
      expect(change).toBeLessThan(0);
    });

    it('awards more for beating higher difficulty', () => {
      const easyWin = calculateEloChange(500, 1, 80);
      const hardWin = calculateEloChange(500, 5, 80);
      expect(hardWin).toBeGreaterThan(easyWin);
    });

    it('returns integer values', () => {
      const change = calculateEloChange(333, 3, 66);
      expect(Number.isInteger(change)).toBe(true);
    });
  });

  describe('computeSessionScore', () => {
    it('returns 50 for empty feedbacks', () => {
      expect(computeSessionScore([])).toBe(50);
    });

    it('computes weighted average of feedback components', () => {
      const feedbacks: CoachFeedback[] = [
        {
          score: 80,
          faithfulness: 90,
          techniqueUsage: 70,
          emotionalRegulation: 85,
          summary: '',
          suggestions: [],
          conceptsApplied: [],
        },
      ];
      const result = computeSessionScore(feedbacks);
      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThanOrEqual(100);
    });

    it('averages across multiple feedbacks', () => {
      const feedbacks: CoachFeedback[] = [
        { score: 100, faithfulness: 100, techniqueUsage: 100, emotionalRegulation: 100, summary: '', suggestions: [], conceptsApplied: [] },
        { score: 0, faithfulness: 0, techniqueUsage: 0, emotionalRegulation: 0, summary: '', suggestions: [], conceptsApplied: [] },
      ];
      const result = computeSessionScore(feedbacks);
      expect(result).toBe(50);
    });
  });

  describe('calculateMultiTrackEloChanges', () => {
    it('calculates changes for all target skills', () => {
      const elos: Record<SkillTrackId, number> = {
        regulate: 500, connect: 300, close: 400, defend: 200,
        listen: 350, assert: 450, negotiate: 600, empathize: 250,
      };
      const changes = calculateMultiTrackEloChanges(elos, ['regulate', 'connect'], 3, 75);

      expect(changes).toHaveProperty('regulate');
      expect(changes).toHaveProperty('connect');
      expect(Object.keys(changes)).toHaveLength(2);
    });
  });

  describe('evaluateResponse', () => {
    it('rewards I-statements', () => {
      const withI = evaluateResponse('I feel that this is important to discuss.', [], []);
      const without = evaluateResponse('This is important.', [], []);
      expect(withI.score).toBeGreaterThan(without.score);
    });

    it('rewards empathic language', () => {
      const result = evaluateResponse(
        "I hear you, and it sounds like you're feeling frustrated about this.",
        [],
        [],
      );
      expect(result.conceptsApplied).toContain('Empathic Reflection');
      expect(result.conceptsApplied).toContain('Tactical Labeling');
    });

    it('rewards boundary setting', () => {
      const result = evaluateResponse(
        "I understand your perspective, but I'm not comfortable with that approach.",
        [],
        [],
      );
      expect(result.conceptsApplied).toContain('Boundary Setting');
    });

    it('suggests missing techniques', () => {
      const result = evaluateResponse('Ok sure.', [], []);
      expect(result.suggestions.length).toBeGreaterThan(0);
    });

    it('scores between 0 and 100', () => {
      const responses = [
        'Ok.',
        'I feel strongly that we should reconsider this approach.',
        "I hear you, and it sounds like you're saying this matters a lot. I understand, but I can't agree to that.",
      ];
      for (const r of responses) {
        const feedback = evaluateResponse(r, [], []);
        expect(feedback.score).toBeGreaterThanOrEqual(0);
        expect(feedback.score).toBeLessThanOrEqual(100);
      }
    });
  });
});
