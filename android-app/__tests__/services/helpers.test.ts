import {
  getBeltForElo,
  getAverageElo,
  calculateEloChange,
  clampElo,
  formatEloChange,
  getGreeting,
  getStreakEmoji,
  generateSessionId,
  truncateText,
} from '../../src/utils/helpers';

describe('Helpers', () => {
  describe('getBeltForElo', () => {
    it('returns white for low ELO', () => {
      expect(getBeltForElo(0)).toBe('white');
      expect(getBeltForElo(100)).toBe('white');
      expect(getBeltForElo(199)).toBe('white');
    });

    it('returns yellow for 200+', () => {
      expect(getBeltForElo(200)).toBe('yellow');
    });

    it('returns green for 500+', () => {
      expect(getBeltForElo(500)).toBe('green');
    });

    it('returns blue for 800+', () => {
      expect(getBeltForElo(800)).toBe('blue');
    });

    it('returns brown for 1200+', () => {
      expect(getBeltForElo(1200)).toBe('brown');
    });

    it('returns black for 1600+', () => {
      expect(getBeltForElo(1600)).toBe('black');
    });
  });

  describe('getAverageElo', () => {
    it('returns default for empty scores', () => {
      expect(getAverageElo({})).toBe(100);
    });

    it('calculates average correctly', () => {
      expect(getAverageElo({ a: 200, b: 400 })).toBe(300);
    });

    it('rounds to nearest integer', () => {
      expect(getAverageElo({ a: 100, b: 200, c: 300 })).toBe(200);
    });
  });

  describe('clampElo', () => {
    it('clamps to min', () => {
      expect(clampElo(-50)).toBe(0);
    });

    it('clamps to max', () => {
      expect(clampElo(3000)).toBe(2000);
    });

    it('passes through valid values', () => {
      expect(clampElo(500)).toBe(500);
    });
  });

  describe('formatEloChange', () => {
    it('adds + for positive', () => {
      expect(formatEloChange(15)).toBe('+15');
    });

    it('includes - for negative', () => {
      expect(formatEloChange(-10)).toBe('-10');
    });

    it('handles zero', () => {
      expect(formatEloChange(0)).toBe('+0');
    });
  });

  describe('generateSessionId', () => {
    it('generates unique IDs', () => {
      const ids = new Set(Array.from({ length: 100 }, () => generateSessionId()));
      expect(ids.size).toBe(100);
    });

    it('starts with session_', () => {
      expect(generateSessionId()).toMatch(/^session_/);
    });
  });

  describe('truncateText', () => {
    it('returns short text unchanged', () => {
      expect(truncateText('hello', 10)).toBe('hello');
    });

    it('truncates long text with ellipsis', () => {
      const result = truncateText('This is a long piece of text', 15);
      expect(result.length).toBe(15);
      expect(result).toMatch(/\.\.\.$/);
    });
  });

  describe('getStreakEmoji', () => {
    it('returns plant for low streaks', () => {
      expect(getStreakEmoji(1)).toBe('🌱');
    });

    it('returns fire for high streaks', () => {
      expect(getStreakEmoji(30)).toBe('🔥');
    });
  });

  describe('getGreeting', () => {
    it('returns a string', () => {
      expect(typeof getGreeting()).toBe('string');
    });
  });
});
