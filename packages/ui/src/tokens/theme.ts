// packages/ui/src/tokens/theme.ts
// ARC Design System — Typed Token Constants
// Dark-mode first (mobile default: dark background)

export const Colors = {
  // Brand
  brand: '#8F6FFF',
  brandDark: '#7C5CFC',
  brandDeeper: '#4C2FD4',
  brandLight: 'rgba(124, 92, 252, 0.18)',
  brandTint: 'rgba(143, 111, 255, 0.12)',
  brandForeground: '#FFFFFF',

  // Health / Completion
  health: '#00EDD0',
  healthDark: '#00D9B8',
  healthLight: 'rgba(0, 217, 184, 0.18)',
  healthTint: 'rgba(0, 237, 208, 0.10)',

  // Energy / Effort
  energy: '#FF8585',
  energyDark: '#FF6B6B',
  energyLight: 'rgba(255, 107, 107, 0.18)',

  // Amber / Warning
  amber: '#FFC333',
  amberDark: '#FFB300',
  amberLight: 'rgba(255, 179, 0, 0.18)',

  // Status
  success: '#00EDD0',
  warning: '#FFC333',
  destructive: '#FF6B6B',
  destructiveForeground: '#FFFFFF',

  // Dark Mode Surfaces
  background: '#0A0912',
  backgroundSunken: '#060510',
  card: '#12102A',
  cardRaised: '#1B1840',
  cardForeground: '#EAE8FF',

  // Dark Mode Semantic
  foreground: '#EAE8FF',
  primary: '#8F6FFF',
  primaryForeground: '#FFFFFF',
  secondary: 'rgba(124, 92, 252, 0.15)',
  secondaryForeground: '#C4BAFF',
  muted: 'rgba(255, 255, 255, 0.06)',
  mutedForeground: '#6A6285',
  accent: 'rgba(124, 92, 252, 0.12)',
  accentForeground: '#8F6FFF',
  popover: '#1B1840',
  popoverForeground: '#EAE8FF',
  border: 'rgba(143, 111, 255, 0.12)',
  input: 'rgba(255, 255, 255, 0.08)',
  inputBackground: 'rgba(255, 255, 255, 0.06)',
  switchBackground: '#3A3560',
  ring: 'rgba(143, 111, 255, 0.35)',

  // Text
  textPrimary: '#EAE8FF',
  textSecondary: '#9890BC',
  textTertiary: '#5E5880',

  // Chart
  chart1: '#8F6FFF',
  chart2: '#00EDD0',
  chart3: '#FF8585',
  chart4: '#FFC333',
  chart5: '#C4BAFF',
} as const;

export const Radius = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 44,
  full: 9999,
} as const;

export const Shadows = {
  brand: {
    shadowColor: '#8F6FFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.40,
    shadowRadius: 24,
    elevation: 8,
  },
  health: {
    shadowColor: '#00EDD0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 20,
    elevation: 6,
  },
  energy: {
    shadowColor: '#FF8585',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 20,
    elevation: 6,
  },
  card: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.50,
    shadowRadius: 24,
    elevation: 8,
  },
} as const;

export const Typography = {
  h1: { fontSize: 28, fontWeight: '700' as const, letterSpacing: -0.84, lineHeight: 33 },
  h2: { fontSize: 22, fontWeight: '600' as const, letterSpacing: -0.44, lineHeight: 28 },
  h3: { fontSize: 17, fontWeight: '600' as const, letterSpacing: -0.17, lineHeight: 23 },
  h4: { fontSize: 14, fontWeight: '600' as const, lineHeight: 20 },
  body: { fontSize: 15, fontWeight: '400' as const, lineHeight: 23 },
  bodySmall: { fontSize: 13, fontWeight: '400' as const, lineHeight: 20 },
  label: { fontSize: 14, fontWeight: '500' as const, lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: '500' as const, lineHeight: 18 },
  overline: { fontSize: 11, fontWeight: '700' as const, letterSpacing: 1.1, lineHeight: 16 },
  button: { fontSize: 16, fontWeight: '700' as const, letterSpacing: -0.16, lineHeight: 22 },
  buttonSm: { fontSize: 14, fontWeight: '600' as const, lineHeight: 20 },
} as const;

export type ArcColor = keyof typeof Colors;
export type ArcRadius = keyof typeof Radius;
