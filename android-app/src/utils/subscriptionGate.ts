import { SubscriptionTier } from '@/models/types';

export const FREE_TRIAL_LIMITS = {
  sparringSessions: 1,
  drills: 1,
};

const CORE_GYM_FEATURES = new Set([
  'sparring',
  'drills',
  'daily_program',
  'progress_tracking',
  'mini_games',
  'spot_influence',
  'conversation_autopsy',
  'subtext_translator',
  'escalation_gauntlet',
  'tactic_forecast',
  'flash_judgment',
  'red_flag_rally',
  'emotional_decoder',
  'first_response',
]);

const FREE_TRIAL_FEATURES = new Set([
  'home',
  'skills_overview',
  'sparring_limited',
  'drills_limited',
]);

/**
 * Determines whether a given subscription tier has access to a specific feature.
 */
export function canAccessFeature(tier: SubscriptionTier, feature: string): boolean {
  if (tier === 'full_bundle') {
    return true;
  }

  if (tier === 'core_gym') {
    return CORE_GYM_FEATURES.has(feature) || FREE_TRIAL_FEATURES.has(feature);
  }

  // free_trial
  return FREE_TRIAL_FEATURES.has(feature);
}

/**
 * Returns a user-friendly upsell message for a given gated feature.
 */
export function getUpgradeMessage(feature: string): string {
  switch (feature) {
    case 'sparring':
    case 'sparring_limited':
      return "You've used your free sparring session for today. Upgrade to Core Gym for unlimited sparring sessions and sharpen your skills every day.";
    case 'drills':
    case 'drills_limited':
      return "You've completed your free drill for today. Upgrade to Core Gym for unlimited drills and accelerate your progress.";
    case 'daily_program':
      return 'The Daily Program is a Core Gym feature. Upgrade to get a personalized training plan every day with warmups, drills, and sparring.';
    case 'mini_games':
    case 'spot_influence':
    case 'conversation_autopsy':
    case 'subtext_translator':
    case 'escalation_gauntlet':
    case 'tactic_forecast':
    case 'flash_judgment':
    case 'red_flag_rally':
    case 'emotional_decoder':
    case 'first_response':
      return 'Mini-games are a Core Gym feature. Upgrade to access all training games and build your persuasion skills faster.';
    case 'progress_tracking':
      return 'Detailed progress tracking is a Core Gym feature. Upgrade to see your full skill breakdown and growth over time.';
    default:
      return 'This feature requires a Core Gym subscription. Upgrade to unlock the full Peitho training experience.';
  }
}
