import {
  SessionDebrief,
  SparringSession,
  CoachFeedback,
  SkillTrackId,
} from '@/models/types';
import { computeSessionScore, calculateMultiTrackEloChanges } from './scoring';

export function generateDebrief(
  session: SparringSession,
  skillElos: Record<SkillTrackId, number>,
  personaDifficulty: number,
): SessionDebrief {
  const feedbacks = session.messages
    .filter((m) => m.feedback)
    .map((m) => m.feedback!);

  const sessionScore = computeSessionScore(feedbacks);
  const eloChanges = calculateMultiTrackEloChanges(
    skillElos,
    session.skillTracks,
    personaDifficulty,
    sessionScore,
  );

  const allConcepts = feedbacks.flatMap((f) => f.conceptsApplied);
  const conceptCounts = countOccurrences(allConcepts);
  const allSuggestions = feedbacks.flatMap((f) => f.suggestions);
  const uniqueSuggestions = [...new Set(allSuggestions)];

  const strengths = identifyStrengths(feedbacks, conceptCounts);
  const areasForGrowth = identifyGrowthAreas(feedbacks, uniqueSuggestions);
  const patterns = identifyPatterns(feedbacks);

  const eloSummary: SessionDebrief['eloSummary'] = {} as any;
  for (const trackId of session.skillTracks) {
    const before = skillElos[trackId] ?? 100;
    const change = eloChanges[trackId] ?? 0;
    eloSummary[trackId] = { before, after: before + change, change };
  }

  return {
    strengths,
    areasForGrowth,
    patternsNoticed: patterns,
    eloSummary,
    nextRecommendation: generateNextRecommendation(sessionScore, areasForGrowth),
  };
}

function identifyStrengths(feedbacks: CoachFeedback[], conceptCounts: Record<string, number>): string[] {
  const strengths: string[] = [];

  const avgScore = feedbacks.reduce((s, f) => s + f.score, 0) / feedbacks.length;
  if (avgScore >= 70) strengths.push('Consistently strong responses throughout the session.');

  const highEmotional = feedbacks.filter((f) => f.emotionalRegulation >= 70);
  if (highEmotional.length > feedbacks.length * 0.6) {
    strengths.push('Maintained emotional composure under pressure.');
  }

  const topConcepts = Object.entries(conceptCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 2);
  for (const [concept, count] of topConcepts) {
    if (count >= 2) strengths.push(`Reliable use of ${concept} (applied ${count} times).`);
  }

  if (strengths.length === 0) strengths.push('Showed up and engaged — consistency builds skill.');

  return strengths;
}

function identifyGrowthAreas(feedbacks: CoachFeedback[], suggestions: string[]): string[] {
  const areas: string[] = [];

  const lowTechnique = feedbacks.filter((f) => f.techniqueUsage < 50);
  if (lowTechnique.length > feedbacks.length * 0.4) {
    areas.push('Apply specific frameworks more deliberately in your responses.');
  }

  const lowEmotional = feedbacks.filter((f) => f.emotionalRegulation < 50);
  if (lowEmotional.length > feedbacks.length * 0.3) {
    areas.push('Work on emotional regulation — pause before responding under pressure.');
  }

  if (suggestions.length > 0) {
    areas.push(suggestions[0]);
  }

  if (areas.length === 0) areas.push('Continue building depth in your current techniques.');

  return areas;
}

function identifyPatterns(feedbacks: CoachFeedback[]): string[] {
  const patterns: string[] = [];

  if (feedbacks.length >= 3) {
    const scores = feedbacks.map((f) => f.score);
    const firstHalf = scores.slice(0, Math.floor(scores.length / 2));
    const secondHalf = scores.slice(Math.floor(scores.length / 2));
    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

    if (secondAvg > firstAvg + 10) {
      patterns.push('Performance improved as the session progressed — you warmed up well.');
    } else if (firstAvg > secondAvg + 10) {
      patterns.push('Performance dipped later in the session — watch for fatigue or frustration.');
    }
  }

  const conceptProgression = feedbacks.map((f) => f.conceptsApplied.length);
  const avgConcepts = conceptProgression.reduce((a, b) => a + b, 0) / conceptProgression.length;
  if (avgConcepts >= 2) {
    patterns.push('You layered multiple techniques in your responses — great integration.');
  }

  return patterns;
}

function generateNextRecommendation(score: number, areas: string[]): string {
  if (score >= 80) return 'You\'re ready for a higher-difficulty persona. Try stepping up.';
  if (score >= 60) return `Focus on: ${areas[0] ?? 'deepening your technique repertoire.'}`;
  return 'Consider revisiting the concept library before your next sparring session.';
}

function countOccurrences(items: string[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const item of items) {
    counts[item] = (counts[item] ?? 0) + 1;
  }
  return counts;
}
