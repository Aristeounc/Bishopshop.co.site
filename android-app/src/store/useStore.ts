import { create } from 'zustand';
import {
  User,
  SkillProgress,
  SparringSession,
  SparringMessage,
  Badge,
  DailyProgram,
  GymPhase,
  PersonaId,
  SkillTrackId,
} from '@/models/types';
import { ELO_CONFIG } from '@/utils/constants';

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  skillProgress: Record<SkillTrackId, SkillProgress>;
  currentSession: SparringSession | null;
  sessionHistory: SparringSession[];
  badges: Badge[];
  dailyProgram: DailyProgram | null;
  notificationToken: string | null;

  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setSkillProgress: (progress: Record<SkillTrackId, SkillProgress>) => void;
  updateSkillElo: (trackId: SkillTrackId, change: number) => void;
  startSession: (session: SparringSession) => void;
  addMessage: (message: SparringMessage) => void;
  updateSessionPhase: (phase: GymPhase) => void;
  completeSession: (eloChanges: Record<SkillTrackId, number>) => void;
  clearSession: () => void;
  addSessionToHistory: (session: SparringSession) => void;
  setBadges: (badges: Badge[]) => void;
  earnBadge: (badge: Badge) => void;
  setDailyProgram: (program: DailyProgram) => void;
  setNotificationToken: (token: string | null) => void;
  logout: () => void;
}

const defaultSkillProgress: Record<SkillTrackId, SkillProgress> = {
  regulate: { trackId: 'regulate', elo: ELO_CONFIG.DEFAULT_ELO, sessionsCompleted: 0, conceptsMastered: [] },
  connect: { trackId: 'connect', elo: ELO_CONFIG.DEFAULT_ELO, sessionsCompleted: 0, conceptsMastered: [] },
  close: { trackId: 'close', elo: ELO_CONFIG.DEFAULT_ELO, sessionsCompleted: 0, conceptsMastered: [] },
  defend: { trackId: 'defend', elo: ELO_CONFIG.DEFAULT_ELO, sessionsCompleted: 0, conceptsMastered: [] },
  listen: { trackId: 'listen', elo: ELO_CONFIG.DEFAULT_ELO, sessionsCompleted: 0, conceptsMastered: [] },
  assert: { trackId: 'assert', elo: ELO_CONFIG.DEFAULT_ELO, sessionsCompleted: 0, conceptsMastered: [] },
  negotiate: { trackId: 'negotiate', elo: ELO_CONFIG.DEFAULT_ELO, sessionsCompleted: 0, conceptsMastered: [] },
  empathize: { trackId: 'empathize', elo: ELO_CONFIG.DEFAULT_ELO, sessionsCompleted: 0, conceptsMastered: [] },
};

export const useStore = create<AppState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  skillProgress: { ...defaultSkillProgress },
  currentSession: null,
  sessionHistory: [],
  badges: [],
  dailyProgram: null,
  notificationToken: null,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setLoading: (isLoading) => set({ isLoading }),
  setSkillProgress: (skillProgress) => set({ skillProgress }),

  updateSkillElo: (trackId, change) => {
    const { skillProgress } = get();
    const current = skillProgress[trackId];
    const newElo = Math.max(ELO_CONFIG.MIN_ELO, Math.min(ELO_CONFIG.MAX_ELO, current.elo + change));
    set({
      skillProgress: {
        ...skillProgress,
        [trackId]: { ...current, elo: newElo },
      },
    });
  },

  startSession: (session) => set({ currentSession: session }),

  addMessage: (message) => {
    const { currentSession } = get();
    if (!currentSession) return;
    set({
      currentSession: {
        ...currentSession,
        messages: [...currentSession.messages, message],
      },
    });
  },

  updateSessionPhase: (phase) => {
    const { currentSession } = get();
    if (!currentSession) return;
    set({ currentSession: { ...currentSession, phase } });
  },

  completeSession: (eloChanges) => {
    const { currentSession, sessionHistory, skillProgress } = get();
    if (!currentSession) return;

    const completed: SparringSession = {
      ...currentSession,
      completedAt: new Date().toISOString(),
      eloChanges,
    };

    const updatedProgress = { ...skillProgress };
    for (const [trackId, change] of Object.entries(eloChanges)) {
      const track = updatedProgress[trackId as SkillTrackId];
      updatedProgress[trackId as SkillTrackId] = {
        ...track,
        elo: Math.max(ELO_CONFIG.MIN_ELO, Math.min(ELO_CONFIG.MAX_ELO, track.elo + change)),
        sessionsCompleted: track.sessionsCompleted + 1,
        lastPracticedAt: new Date().toISOString(),
      };
    }

    set({
      currentSession: null,
      sessionHistory: [completed, ...sessionHistory],
      skillProgress: updatedProgress,
    });
  },

  clearSession: () => set({ currentSession: null }),
  addSessionToHistory: (session) => set((s) => ({ sessionHistory: [session, ...s.sessionHistory] })),
  setBadges: (badges) => set({ badges }),
  earnBadge: (badge) => set((s) => ({ badges: [...s.badges, badge] })),
  setDailyProgram: (program) => set({ dailyProgram: program }),
  setNotificationToken: (token) => set({ notificationToken: token }),

  logout: () =>
    set({
      user: null,
      isAuthenticated: false,
      skillProgress: { ...defaultSkillProgress },
      currentSession: null,
      sessionHistory: [],
      badges: [],
      dailyProgram: null,
    }),
}));
