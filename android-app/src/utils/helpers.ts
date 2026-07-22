import { BeltLevel, BadgeTier } from '@/models/types';
import { BELT_LEVELS, ELO_CONFIG } from './constants';

export function getBeltForElo(totalElo: number): BeltLevel {
  const sorted = [...BELT_LEVELS].sort((a, b) => b.minElo - a.minElo);
  for (const belt of sorted) {
    if (totalElo >= belt.minElo) return belt.level;
  }
  return 'white';
}

export function getAverageElo(eloScores: Record<string, number>): number {
  const values = Object.values(eloScores);
  if (values.length === 0) return ELO_CONFIG.DEFAULT_ELO;
  return Math.round(values.reduce((sum, v) => sum + v, 0) / values.length);
}

export function calculateEloChange(
  currentElo: number,
  opponentDifficulty: number,
  score: number,
): number {
  const opponentRating = opponentDifficulty * 200;
  const expected = 1 / (1 + Math.pow(10, (opponentRating - currentElo) / 400));
  const normalizedScore = score / 100;
  return Math.round(ELO_CONFIG.K_FACTOR * (normalizedScore - expected));
}

export function clampElo(elo: number): number {
  return Math.max(ELO_CONFIG.MIN_ELO, Math.min(ELO_CONFIG.MAX_ELO, elo));
}

export function formatEloChange(change: number): string {
  return change >= 0 ? `+${change}` : `${change}`;
}

export function getBadgeTierLabel(tier: BadgeTier): string {
  const labels: Record<BadgeTier, string> = {
    emerging: 'Emerging',
    developing: 'Developing',
    proficient: 'Proficient',
    advanced: 'Advanced',
    master: 'Master',
  };
  return labels[tier];
}

export function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function getStreakEmoji(streak: number): string {
  if (streak >= 30) return '🔥';
  if (streak >= 14) return '⚡';
  if (streak >= 7) return '💪';
  if (streak >= 3) return '✨';
  return '🌱';
}
