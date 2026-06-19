export const Colors = {
  // Primary brand colors
  primary: '#1F5BA8',
  secondary: '#F2C744',
  accent: '#51cf66',

  // Neutral palette
  dark: '#1a1a1a',
  ink: '#0D0D0D',
  inkSoft: '#1F1F1F',
  surface: '#2A2A2A',
  border: 'rgba(255,255,255,0.1)',
  text: '#FFFFFF',
  textSecondary: 'rgba(255,255,255,0.7)',

  // Semantic colors
  success: '#51cf66',
  error: '#FF6B6B',
  warning: '#FFD93D',
  info: '#4ECDC4',

  // Badge tiers
  badges: {
    emerging: '#6ba8d4',
    competent: '#1F5BA8',
    proficient: '#F2C744',
    expert: '#51cf66',
    master: '#FFD700',
  },

  // Gradients
  gradients: {
    primary: ['#1F5BA8', '#2E7BC8'],
    accent: ['#51cf66', '#40C057'],
    warning: ['#FFD93D', '#FFC107'],
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const Typography = {
  display: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
  },
  subheading: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 26,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  },
};

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};
