/**
 * Refutation Brand Color System
 * All colors defined here to ensure consistency across the site
 */

export const COLORS = {
  // Primary brand colors
  primary: '#4F46E5', // Deep Indigo
  accent: '#A78BFA', // Violet Electric
  energy: '#FF6B4A', // Coral Flame
  surface: '#0F172A', // Midnight Navy
  light: '#F8FAFC', // Off-white
  neutral: '#64748B', // Slate

  // Extended palette
  slate: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  },

  // Semantic colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // Transparency variants
  primaryLight: 'rgba(79, 70, 229, 0.1)',
  accentLight: 'rgba(167, 139, 250, 0.1)',
  energyLight: 'rgba(255, 107, 74, 0.1)',
};

/**
 * Tailwind class mappings for easier usage
 */
export const COLOR_CLASSES = {
  bg: {
    primary: 'bg-[#4F46E5]',
    accent: 'bg-[#A78BFA]',
    energy: 'bg-[#FF6B4A]',
    surface: 'bg-[#0F172A]',
    light: 'bg-[#F8FAFC]',
    neutral: 'bg-[#64748B]',
  },
  text: {
    primary: 'text-[#4F46E5]',
    accent: 'text-[#A78BFA]',
    energy: 'text-[#FF6B4A]',
    surface: 'text-[#0F172A]',
    light: 'text-[#F8FAFC]',
    neutral: 'text-[#64748B]',
  },
  border: {
    primary: 'border-[#4F46E5]',
    accent: 'border-[#A78BFA]',
    energy: 'border-[#FF6B4A]',
  },
};
