export type SubscriptionTier = 'free_trial' | 'core_gym' | 'full_bundle';

export type BeltLevel = 'white' | 'yellow' | 'green' | 'blue' | 'brown' | 'black';

export type SkillTrackId =
  | 'regulate'
  | 'connect'
  | 'close'
  | 'defend'
  | 'listen'
  | 'assert'
  | 'negotiate'
  | 'empathize';

export type PersonaId =
  | 'charmer'
  | 'closer'
  | 'guilt_tripper'
  | 'stonewaller'
  | 'authority'
  | 'negotiator';

export type GymPhase = 'warmup' | 'drill' | 'sparring' | 'recovery';

export type ArticulationIntensity = 'gentle' | 'standard' | 'intensive';

export interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  subscription: SubscriptionTier;
  subscriptionExpiresAt?: string;
  beltLevel: BeltLevel;
  totalSessions: number;
  currentStreak: number;
  longestStreak: number;
  freezeSlotsRemaining: number;
  joinedAt: string;
  lastSessionAt?: string;
  hasCompletedOnboarding: boolean;
  preferences: UserPreferences;
}

export interface UserPreferences {
  notificationsEnabled: boolean;
  dailyReminderTime: string;
  hapticFeedback: boolean;
  darkMode: boolean;
  articulationIntensity: ArticulationIntensity;
}

export interface SkillTrack {
  id: SkillTrackId;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface SkillProgress {
  trackId: SkillTrackId;
  elo: number;
  sessionsCompleted: number;
  lastPracticedAt?: string;
  conceptsMastered: string[];
  currentConcept?: string;
}

export interface SparringPersona {
  id: PersonaId;
  name: string;
  subtitle: string;
  description: string;
  avatar: string;
  color: string;
  trainsFocus: string;
  skillLabel: string;
  primarySkills: SkillTrackId[];
  difficulty: number;
  openingLines: string[];
  tactics: string[];
  systemPrompt: string;
}

export interface SparringMessage {
  id: string;
  role: 'user' | 'persona' | 'coach';
  content: string;
  timestamp: string;
  feedback?: CoachFeedback;
}

export interface CoachFeedback {
  score: number;
  faithfulness: number;
  techniqueUsage: number;
  emotionalRegulation: number;
  summary: string;
  suggestions: string[];
  conceptsApplied: string[];
}

export interface SparringSession {
  id: string;
  userId: string;
  personaId: PersonaId;
  phase: GymPhase;
  skillTracks: SkillTrackId[];
  messages: SparringMessage[];
  startedAt: string;
  completedAt?: string;
  eloChanges: Record<SkillTrackId, number>;
  overallScore?: number;
  debrief?: SessionDebrief;
}

export interface SessionDebrief {
  strengths: string[];
  areasForGrowth: string[];
  patternsNoticed: string[];
  eloSummary: Record<SkillTrackId, { before: number; after: number; change: number }>;
  nextRecommendation: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  tier: BadgeTier;
  earnedAt?: string;
  requirement: BadgeRequirement;
}

export type BadgeTier = 'emerging' | 'developing' | 'proficient' | 'advanced' | 'master';

export interface BadgeRequirement {
  type: 'sessions_completed' | 'elo_reached' | 'streak_days' | 'concepts_mastered' | 'persona_defeated';
  target: number;
  trackId?: SkillTrackId;
  personaId?: PersonaId;
}

export interface DailyProgram {
  date: string;
  warmup: WarmupContent;
  drills: DrillContent[];
  sparringConfig: SparringConfig;
  completed: boolean;
}

export interface WarmupContent {
  conceptId: string;
  conceptName: string;
  summary: string;
  keyTakeaways: string[];
  expertSource: string;
}

export interface DrillContent {
  id: string;
  type: 'listening' | 'boundary_setting' | 'reframing' | 'empathy' | 'assertion';
  prompt: string;
  skillTrack: SkillTrackId;
  completed: boolean;
}

export interface SparringConfig {
  personaId: PersonaId;
  scenario: string;
  targetSkills: SkillTrackId[];
  difficulty: number;
  roundCount: number;
}

export type BillingProduct = {
  productId: string;
  title: string;
  description: string;
  price: string;
  currency: string;
  type: 'subscription';
  subscriptionPeriod: string;
};

export type PurchaseResult = {
  success: boolean;
  transactionId?: string;
  productId?: string;
  error?: string;
};
