import { CoachFeedback, SkillTrackId, SparringMessage } from '@/models/types';
import { ELO_CONFIG } from '@/utils/constants';

export function calculateEloChange(
  currentElo: number,
  personaDifficulty: number,
  sessionScore: number,
): number {
  const opponentRating = personaDifficulty * 200;
  const expectedScore = 1 / (1 + Math.pow(10, (opponentRating - currentElo) / 400));
  const normalizedScore = sessionScore / 100;
  return Math.round(ELO_CONFIG.K_FACTOR * (normalizedScore - expectedScore));
}

export function computeSessionScore(feedbacks: CoachFeedback[]): number {
  if (feedbacks.length === 0) return 50;

  const weights = {
    score: 0.4,
    faithfulness: 0.2,
    techniqueUsage: 0.25,
    emotionalRegulation: 0.15,
  };

  const avgScore =
    feedbacks.reduce((sum, f) => sum + f.score, 0) / feedbacks.length;
  const avgFaithfulness =
    feedbacks.reduce((sum, f) => sum + f.faithfulness, 0) / feedbacks.length;
  const avgTechnique =
    feedbacks.reduce((sum, f) => sum + f.techniqueUsage, 0) / feedbacks.length;
  const avgEmotional =
    feedbacks.reduce((sum, f) => sum + f.emotionalRegulation, 0) / feedbacks.length;

  return Math.round(
    avgScore * weights.score +
      avgFaithfulness * weights.faithfulness +
      avgTechnique * weights.techniqueUsage +
      avgEmotional * weights.emotionalRegulation,
  );
}

export function calculateMultiTrackEloChanges(
  skillElos: Record<SkillTrackId, number>,
  targetSkills: SkillTrackId[],
  personaDifficulty: number,
  sessionScore: number,
): Record<SkillTrackId, number> {
  const changes: Record<string, number> = {};

  for (const trackId of targetSkills) {
    const currentElo = skillElos[trackId] ?? ELO_CONFIG.DEFAULT_ELO;
    changes[trackId] = calculateEloChange(currentElo, personaDifficulty, sessionScore);
  }

  return changes as Record<SkillTrackId, number>;
}

export function evaluateResponse(
  userMessage: string,
  _personaTactics: string[],
  _conversationHistory: SparringMessage[],
): CoachFeedback {
  const wordCount = userMessage.split(/\s+/).length;
  const hasQuestion = userMessage.includes('?');
  const hasIStatement = /\bI feel\b|\bI think\b|\bI need\b|\bI understand\b/i.test(userMessage);
  const hasBoundary = /\bno\b|\bboundary\b|\bnot comfortable\b|\bI can't\b/i.test(userMessage);
  const hasEmpathy = /\byou feel\b|\byou're saying\b|\bI hear you\b|\bunderstood\b/i.test(userMessage);
  const hasLabel = /\bit sounds like\b|\bit seems like\b|\byou seem\b/i.test(userMessage);

  let techniqueScore = 30;
  if (hasIStatement) techniqueScore += 15;
  if (hasBoundary) techniqueScore += 15;
  if (hasEmpathy) techniqueScore += 15;
  if (hasLabel) techniqueScore += 10;
  if (hasQuestion) techniqueScore += 10;

  const lengthScore = Math.min(100, Math.max(20, wordCount * 3));
  const emotionalScore = hasIStatement || hasEmpathy ? 75 : 50;

  const score = Math.min(100, Math.round(
    techniqueScore * 0.4 + lengthScore * 0.2 + emotionalScore * 0.4,
  ));

  const suggestions: string[] = [];
  const conceptsApplied: string[] = [];

  if (!hasIStatement) suggestions.push('Try using "I" statements to express your perspective.');
  if (!hasEmpathy) suggestions.push('Acknowledge their feelings before responding.');
  if (!hasQuestion) suggestions.push('Ask a calibrated question to redirect the conversation.');
  if (!hasBoundary) suggestions.push('Practice setting a clear boundary.');

  if (hasIStatement) conceptsApplied.push('I-Statements');
  if (hasEmpathy) conceptsApplied.push('Empathic Reflection');
  if (hasLabel) conceptsApplied.push('Tactical Labeling');
  if (hasBoundary) conceptsApplied.push('Boundary Setting');
  if (hasQuestion) conceptsApplied.push('Calibrated Questions');

  return {
    score,
    faithfulness: Math.min(100, score + 10),
    techniqueUsage: Math.min(100, techniqueScore),
    emotionalRegulation: emotionalScore,
    summary: generateFeedbackSummary(score, conceptsApplied),
    suggestions: suggestions.slice(0, 3),
    conceptsApplied,
  };
}

function generateFeedbackSummary(score: number, concepts: string[]): string {
  if (score >= 80) {
    return `Excellent response. You applied ${concepts.join(', ') || 'solid technique'} effectively. Your composure is strong.`;
  }
  if (score >= 60) {
    return `Good effort. ${concepts.length > 0 ? `Nice use of ${concepts[0]}.` : ''} There's room to deepen your technique.`;
  }
  if (score >= 40) {
    return 'Decent attempt, but consider slowing down and applying specific frameworks before responding.';
  }
  return 'Take a breath. Remember your training — start with acknowledgment, then set boundaries with clarity.';
}
