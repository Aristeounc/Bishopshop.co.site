import create from 'zustand';
import { User, SkillProgress, SparringSession, BadgeTier } from '@models/index';
import { authService, userService, skillService, sessionService } from '@services/firebase';

interface AppStore {
  // Auth state
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Skill state
  skills: SkillProgress[];
  currentSkill: SkillProgress | null;

  // Session state
  sessions: SparringSession[];
  currentSession: SparringSession | null;

  // Auth actions
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loadUserProfile: (userId: string) => Promise<void>;

  // Skill actions
  loadSkills: (userId: string) => Promise<void>;
  loadSkill: (userId: string, trackId: string) => Promise<void>;
  updateSkillScore: (userId: string, trackId: string, newScore: number) => Promise<void>;
  getCurrentBadgeTier: (score: number) => BadgeTier;
  getNextBadgeTier: (currentScore: number) => { tier: BadgeTier; nextScore: number } | null;

  // Session actions
  loadSessions: (userId: string, limit?: number) => Promise<void>;
  saveSession: (userId: string, session: SparringSession) => Promise<void>;
  loadSessionsByTrack: (userId: string, trackId: string) => Promise<void>;

  // UI actions
  setError: (error: string | null) => void;
  clearError: () => void;
}

const BADGE_THRESHOLDS = {
  emerging: 0,
  competent: 25,
  proficient: 50,
  expert: 75,
  master: 90,
};

export const useAppStore = create<AppStore>((set, get) => ({
  // Initial state
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  skills: [],
  currentSkill: null,
  sessions: [],
  currentSession: null,

  // Auth actions
  signUp: async (email: string, password: string, displayName: string) => {
    set({ isLoading: true, error: null });
    try {
      const firebaseUser = await authService.signUp(email, password, displayName);
      if (firebaseUser) {
        const profile = await userService.createUserProfile(
          firebaseUser.uid,
          email,
          displayName
        );
        set({ user: profile, isAuthenticated: true });
      }
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  signIn: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const firebaseUser = await authService.signIn(email, password);
      if (firebaseUser) {
        const profile = await userService.getUserProfile(firebaseUser.uid);
        if (profile) {
          set({ user: profile, isAuthenticated: true });
        }
      }
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  signOut: async () => {
    set({ isLoading: true });
    try {
      await authService.signOut();
      set({ user: null, isAuthenticated: false, skills: [], sessions: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  loadUserProfile: async (userId: string) => {
    set({ isLoading: true });
    try {
      const profile = await userService.getUserProfile(userId);
      if (profile) {
        set({ user: profile });
      }
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  // Skill actions
  loadSkills: async (userId: string) => {
    set({ isLoading: true });
    try {
      const skills = await skillService.getAllSkillsProgress(userId);
      set({ skills });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  loadSkill: async (userId: string, trackId: string) => {
    set({ isLoading: true });
    try {
      const skill = await skillService.getSkillProgress(userId, trackId);
      if (skill) {
        set({ currentSkill: skill });
      }
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  updateSkillScore: async (userId: string, trackId: string, newScore: number) => {
    try {
      const currentSkill = get().currentSkill;
      if (!currentSkill) return;

      const clampedScore = Math.min(100, Math.max(0, newScore));
      const currentBadgeTier = get().getCurrentBadgeTier(currentSkill.currentScore);
      const newBadgeTier = get().getCurrentBadgeTier(clampedScore);

      const updated: SkillProgress = {
        ...currentSkill,
        currentScore: clampedScore,
        currentTier: newBadgeTier,
        bestScore: Math.max(currentSkill.bestScore, clampedScore),
        progressToNextTier: get().getProgressToNextTier(clampedScore),
      };

      await skillService.updateSkillProgress(userId, trackId, updated);
      set({ currentSkill: updated });

      // Update in skills array
      const skills = get().skills.map((s) => (s.trackId === trackId ? updated : s));
      set({ skills });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  getCurrentBadgeTier: (score: number): BadgeTier => {
    if (score >= BADGE_THRESHOLDS.master) return 'master';
    if (score >= BADGE_THRESHOLDS.expert) return 'expert';
    if (score >= BADGE_THRESHOLDS.proficient) return 'proficient';
    if (score >= BADGE_THRESHOLDS.competent) return 'competent';
    return 'emerging';
  },

  getNextBadgeTier: (currentScore: number) => {
    const tiers: BadgeTier[] = ['emerging', 'competent', 'proficient', 'expert', 'master'];
    const currentTier = get().getCurrentBadgeTier(currentScore);
    const currentIndex = tiers.indexOf(currentTier);

    if (currentIndex < tiers.length - 1) {
      const nextTier = tiers[currentIndex + 1];
      return {
        tier: nextTier,
        nextScore: BADGE_THRESHOLDS[nextTier],
      };
    }

    return null;
  },

  getProgressToNextTier: (score: number): number => {
    const currentTier = get().getCurrentBadgeTier(score);
    const currentIndex = Object.keys(BADGE_THRESHOLDS).indexOf(currentTier);
    const tiers = Object.keys(BADGE_THRESHOLDS) as BadgeTier[];

    if (currentIndex < tiers.length - 1) {
      const nextTier = tiers[currentIndex + 1];
      const currentMin = BADGE_THRESHOLDS[currentTier];
      const nextMin = BADGE_THRESHOLDS[nextTier];
      const progress = ((score - currentMin) / (nextMin - currentMin)) * 100;
      return Math.min(100, Math.max(0, progress));
    }

    return 100; // Master tier - fully complete
  },

  // Session actions
  loadSessions: async (userId: string, limit = 10) => {
    set({ isLoading: true });
    try {
      const sessions = await sessionService.getSessions(userId, limit);
      set({ sessions });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  saveSession: async (userId: string, session: SparringSession) => {
    try {
      const sessionId = await sessionService.saveSparringSession(userId, session);
      const newSession = { ...session, id: sessionId };
      set({ currentSession: newSession });

      // Add to sessions list
      const sessions = [newSession, ...get().sessions];
      set({ sessions });

      // Update skill progress based on score
      const currentSkill = get().skills.find((s) => s.trackId === session.trackId);
      if (currentSkill) {
        const newScore = currentSkill.currentScore + session.scoreGained;
        await get().updateSkillScore(userId, session.trackId, newScore);
      }
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  loadSessionsByTrack: async (userId: string, trackId: string) => {
    set({ isLoading: true });
    try {
      const sessions = await sessionService.getSessionsByTrack(userId, trackId);
      set({ sessions });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  // UI actions
  setError: (error: string | null) => set({ error }),
  clearError: () => set({ error: null }),
}));

// Helper function to calculate progress to next tier
const getProgressToNextTier = (score: number): number => {
  if (score >= 90) return 100;
  if (score >= 75) return ((score - 75) / 15) * 100;
  if (score >= 50) return ((score - 50) / 25) * 100;
  if (score >= 25) return ((score - 25) / 25) * 100;
  return (score / 25) * 100;
};
