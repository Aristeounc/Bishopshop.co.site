export type SubscriptionTier = 'free_trial' | 'core_gym' | 'full_bundle';

export type ChildAgeGroup = 'ages_8_12' | 'ages_13_17';

export interface ChildProfile {
  id: string;
  parentUserId: string;
  displayName: string;
  ageGroup: ChildAgeGroup;
  avatarEmoji: string;
  beltLevel: BeltLevel;
  totalSessions: number;
  currentStreak: number;
  longestStreak: number;
  createdAt: string;
  lastSessionAt?: string;
  contentFilter: ChildContentFilter;
}

export interface ChildContentFilter {
  allowSparring: boolean;
  allowEscalationGauntlet: boolean;
  maxDifficultyLevel: number;
  allowedPersonas: PersonaId[];
}

export interface ChildProgressSummary {
  childId: string;
  displayName: string;
  ageGroup: ChildAgeGroup;
  beltLevel: BeltLevel;
  totalSessions: number;
  currentStreak: number;
  weeklySessionCount: number;
  topSkill: SkillTrackId;
  topSkillElo: number;
  recentActivity: ChildActivityEntry[];
}

export interface ChildActivityEntry {
  date: string;
  mode: string;
  skillsWorked: SkillTrackId[];
  duration: number;
  score?: number;
}

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

export type ParentKidAddonStatus = 'inactive' | 'active';

export interface ParentKidAddon {
  status: ParentKidAddonStatus;
  maxChildren: number;
  childProfiles: ChildProfile[];
}

// --- Family Message Board ---

export interface FamilyBoardPost {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: 'parent' | 'teen';
  title: string;
  body: string;
  category: BoardCategory;
  tags: string[];
  likeCount: number;
  replyCount: number;
  createdAt: string;
  updatedAt?: string;
  isPinned: boolean;
}

export type BoardCategory =
  | 'what_worked'
  | 'ask_families'
  | 'wins'
  | 'exercise_share'
  | 'teen_corner';

export interface FamilyBoardReply {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorRole: 'parent' | 'teen';
  body: string;
  likeCount: number;
  createdAt: string;
}

// --- Safe Space Messaging ---

export interface SafeSpaceThread {
  id: string;
  parentUserId: string;
  childProfileId: string;
  childDisplayName: string;
  lastMessageAt: string;
  lastMessagePreview: string;
  unreadParent: number;
  unreadChild: number;
  safeSpaceRules: SafeSpaceRules;
}

export interface SafeSpaceRules {
  noConsequencesMode: boolean;
  cooldownMinutes: number;
  promptReflectionBeforeSend: boolean;
  aiMediationEnabled: boolean;
}

export interface SafeSpaceMessage {
  id: string;
  threadId: string;
  senderId: string;
  senderRole: 'parent' | 'child';
  content: string;
  timestamp: string;
  emotionTag?: string;
  reflectionPrompt?: string;
  aiSuggestion?: string;
}

// --- Family Exercise Modules ---

export type FamilyModuleId = 'emotion_coaching' | 'say_it_different' | 'solve_together';

export type ExerciseRole = 'parent' | 'child' | 'both';

export interface FamilyModule {
  id: FamilyModuleId;
  name: string;
  subtitle: string;
  icon: string;
  color: string;
  description: string;
  framework: string;
  expert: string;
  principles: string[];
  exercises: FamilyExercise[];
}

export interface FamilyExercise {
  id: string;
  moduleId: FamilyModuleId;
  title: string;
  description: string;
  role: ExerciseRole;
  ageGroup: ChildAgeGroup | 'all';
  type: ExerciseType;
  difficulty: number;
  estimatedMinutes: number;
  instructions: string[];
  scenarios: ExerciseScenario[];
  systemPrompt: string;
}

export type ExerciseType =
  | 'ai_roleplay'
  | 'reflection'
  | 'sorting'
  | 'rewrite'
  | 'assessment'
  | 'conversation_practice';

export interface ExerciseScenario {
  id: string;
  title: string;
  setup: string;
  ageGroup: ChildAgeGroup | 'all';
  openingLine: string;
}

export interface FamilyExerciseSession {
  id: string;
  userId: string;
  childProfileId?: string;
  exerciseId: string;
  moduleId: FamilyModuleId;
  role: ExerciseRole;
  startedAt: string;
  completedAt?: string;
  messages: SafeSpaceMessage[];
  score?: number;
  feedback?: FamilyExerciseFeedback;
}

export interface FamilyExerciseFeedback {
  techniqueScore: number;
  empathyScore: number;
  validationScore: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  frameworkTips: string[];
}
