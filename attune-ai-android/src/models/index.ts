export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: number;
  subscriptionTier: 'free' | 'premium' | 'max';
  subscriptionStatus: 'active' | 'expired' | 'pending' | 'paused';
  preferences: {
    notifications: boolean;
    darkMode: boolean;
    reduceMotion: boolean;
  };
}

export type SkillTrack =
  | 'negotiation'
  | 'conflict-resolution'
  | 'influence'
  | 'high-stakes'
  | 'nvc'
  | 'emotional-awareness'
  | 'defensiveness'
  | 'advanced';

export type BadgeTier = 'emerging' | 'competent' | 'proficient' | 'expert' | 'master';

export interface BadgeDefinition {
  tier: BadgeTier;
  name: string;
  icon: string;
  color: string;
  minScore: number;
  motto: string;
  ornaments: string;
  description: string;
}

export interface SkillProgress {
  trackId: SkillTrack;
  trackName: string;
  currentScore: number;
  currentTier: BadgeTier;
  progressToNextTier: number;
  sessionsCompleted: number;
  lastSessionDate?: number;
  bestScore: number;
}

export interface SparringSession {
  id: string;
  userId: string;
  trackId: SkillTrack;
  startTime: number;
  endTime: number;
  duration: number;
  scenario: string;
  userResponses: string[];
  aiResponses: string[];
  feedback: SessionFeedback;
  scoreGained: number;
  recordingUrl?: string;
  transactionId?: string;
}

export interface SessionFeedback {
  score: number;
  clarity: number;
  empathy: number;
  confidence: number;
  overall: number;
  strengths: string[];
  areasForImprovement: string[];
  suggestions: string[];
}

export interface Scenario {
  id: string;
  trackId: SkillTrack;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  context: string;
  objectives: string[];
  timeLimit: number;
  aiPersonality: {
    name: string;
    background: string;
    emotionalState: string;
    objectives: string[];
  };
}

export interface PurchaseItem {
  id: string;
  type: 'subscription' | 'bundle' | 'one-time';
  productId: string;
  displayName: string;
  description: string;
  price: {
    amount: number;
    currency: string;
    formatted: string;
  };
  subscriptionPeriod?: string;
  trialPeriod?: string;
}

export interface Achievement {
  id: string;
  userId: string;
  type: 'badge_unlock' | 'milestone' | 'streak' | 'first_session';
  title: string;
  description: string;
  unlockedAt: number;
  badgeTier?: BadgeTier;
  trackId?: SkillTrack;
}

export interface NotificationData {
  id: string;
  userId: string;
  type: 'achievement' | 'reminder' | 'news' | 'update';
  title: string;
  body: string;
  createdAt: number;
  read: boolean;
  actionUrl?: string;
  data?: Record<string, any>;
}

export interface AudioSession {
  recordingPath: string;
  duration: number;
  format: string;
  sampleRate: number;
  channels: number;
}
