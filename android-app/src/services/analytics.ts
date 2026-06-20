import { analytics } from '@/config/firebase';
import { PersonaId, SkillTrackId, GymPhase } from '@/models/types';

export async function logScreenView(screenName: string): Promise<void> {
  await analytics().logScreenView({ screen_name: screenName, screen_class: screenName });
}

export async function logSessionStart(personaId: PersonaId, skills: SkillTrackId[]): Promise<void> {
  await analytics().logEvent('session_start', {
    persona_id: personaId,
    skills: skills.join(','),
  });
}

export async function logSessionComplete(
  personaId: PersonaId,
  durationMs: number,
  avgScore: number,
): Promise<void> {
  await analytics().logEvent('session_complete', {
    persona_id: personaId,
    duration_ms: durationMs,
    avg_score: avgScore,
  });
}

export async function logPhaseTransition(from: GymPhase, to: GymPhase): Promise<void> {
  await analytics().logEvent('phase_transition', { from_phase: from, to_phase: to });
}

export async function logEloChange(trackId: SkillTrackId, change: number, newElo: number): Promise<void> {
  await analytics().logEvent('elo_change', {
    track_id: trackId,
    change,
    new_elo: newElo,
  });
}

export async function logBadgeEarned(badgeId: string, badgeTier: string): Promise<void> {
  await analytics().logEvent('badge_earned', {
    badge_id: badgeId,
    badge_tier: badgeTier,
  });
}

export async function logSubscriptionEvent(
  action: 'view_plans' | 'start_purchase' | 'purchase_success' | 'purchase_fail' | 'cancel',
  productId?: string,
): Promise<void> {
  await analytics().logEvent('subscription_event', {
    action,
    product_id: productId ?? '',
  });
}

export async function logStreakUpdate(currentStreak: number, longestStreak: number): Promise<void> {
  await analytics().logEvent('streak_update', {
    current_streak: currentStreak,
    longest_streak: longestStreak,
  });
}

export async function setUserProperties(properties: Record<string, string>): Promise<void> {
  for (const [key, value] of Object.entries(properties)) {
    await analytics().setUserProperty(key, value);
  }
}
