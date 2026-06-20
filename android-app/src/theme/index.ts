export const colors = {
  primary: '#8E44AD',
  primaryDark: '#6C3483',
  primaryLight: '#A569BD',
  accent: '#D4AF37',
  accentDark: '#B8961E',

  background: '#0D1117',
  surface: '#161B22',
  surfaceElevated: '#1C2535',
  card: '#21262D',

  text: '#FAFAF8',
  textSecondary: '#8B949E',
  textMuted: '#6B7280',
  textOnPrimary: '#FFFFFF',
  textOnAccent: '#0D1117',

  tan: '#F5EFE3',
  tanDark: '#E8DEC8',

  success: '#2EA043',
  warning: '#D29922',
  error: '#F85149',
  info: '#58A6FF',

  belt: {
    white: '#E8E8E8',
    yellow: '#F2C744',
    green: '#2EA043',
    blue: '#1F5BA8',
    brown: '#8B6914',
    black: '#0D1117',
  },

  persona: {
    charmer: '#E6A817',
    closer: '#D93025',
    guilt_tripper: '#7B2D8E',
    stonewaller: '#4A5568',
    authority: '#1A365D',
    negotiator: '#0E7C42',
  },

  skill: {
    regulate: '#4ECDC4',
    connect: '#FF6B6B',
    close: '#F2C744',
    defend: '#7B68EE',
    listen: '#45B7D1',
    assert: '#FF8C42',
    negotiate: '#2EA043',
    empathize: '#FF69B4',
  },

  border: 'rgba(255, 255, 255, 0.08)',
  borderLight: 'rgba(255, 255, 255, 0.12)',
  overlay: 'rgba(0, 0, 0, 0.6)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

export const typography = {
  hero: {
    fontFamily: 'BebasNeue-Regular',
    fontSize: 48,
    lineHeight: 52,
  },
  h1: {
    fontFamily: 'DMSerifDisplay-Regular',
    fontSize: 32,
    lineHeight: 40,
  },
  h2: {
    fontFamily: 'DMSerifDisplay-Regular',
    fontSize: 24,
    lineHeight: 32,
  },
  h3: {
    fontFamily: 'DMSans-SemiBold',
    fontSize: 20,
    lineHeight: 28,
  },
  body: {
    fontFamily: 'DMSans-Regular',
    fontSize: 16,
    lineHeight: 24,
  },
  bodySmall: {
    fontFamily: 'DMSans-Regular',
    fontSize: 14,
    lineHeight: 20,
  },
  caption: {
    fontFamily: 'DMSans-Medium',
    fontSize: 12,
    lineHeight: 16,
  },
  button: {
    fontFamily: 'DMSans-SemiBold',
    fontSize: 16,
    lineHeight: 24,
  },
  label: {
    fontFamily: 'DMSans-Medium',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.5,
  },
} as const;

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;
