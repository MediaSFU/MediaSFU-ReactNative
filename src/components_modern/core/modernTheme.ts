import { Platform, ViewStyle } from 'react-native';

export const modernLightColors = {
  roomBackground: '#eef5ff',
  roomSurface: '#f8fbff',
  surface: 'rgba(248, 251, 255, 0.96)',
  surfaceStrong: '#ffffff',
  surfaceMuted: '#e6eef8',
  border: 'rgba(71, 85, 105, 0.22)',
  borderStrong: 'rgba(37, 99, 235, 0.28)',
  text: '#0f172a',
  textMuted: '#475569',
  invertedText: '#ffffff',
  accent: '#2563eb',
  accentSoft: 'rgba(37, 99, 235, 0.12)',
  accentAlt: '#0f766e',
  danger: '#dc2626',
  success: '#16a34a',
  warning: '#d97706',
  mediaTile: '#102033',
  mediaTileAlt: '#17314b',
};

export const modernDarkColors = {
  roomBackground: '#0f172a',
  roomSurface: '#111827',
  surface: 'rgba(15, 23, 42, 0.96)',
  surfaceStrong: '#1e293b',
  surfaceMuted: '#334155',
  border: 'rgba(226, 232, 240, 0.18)',
  borderStrong: 'rgba(96, 165, 250, 0.38)',
  text: '#f8fafc',
  textMuted: '#cbd5e1',
  invertedText: '#ffffff',
  accent: '#60a5fa',
  accentSoft: 'rgba(96, 165, 250, 0.18)',
  accentAlt: '#2dd4bf',
  danger: '#f87171',
  success: '#4ade80',
  warning: '#fbbf24',
  mediaTile: '#020617',
  mediaTileAlt: '#0f172a',
};

export const modernColors = modernLightColors;

export const resolveIsDarkMode = (props?: { isDarkMode?: boolean; parameters?: any }): boolean => (
  props?.isDarkMode ?? props?.parameters?.isDarkModeValue ?? (
    typeof (props as any)?.backgroundColor === 'string' &&
    (((props as any).backgroundColor.includes('248, 250, 252')) ||
      ((props as any).backgroundColor.includes('217, 227, 234')))
      ? false
      : true
  )
);

export const getModernColors = (isDarkMode = true) => (
  isDarkMode ? modernDarkColors : modernLightColors
);

export const getModernModalCardStyle = (isDarkMode = true): ViewStyle => ({
  borderRadius: 22,
  borderWidth: 1,
  borderColor: getModernColors(isDarkMode).border,
  backgroundColor: getModernColors(isDarkMode).surface,
  overflow: 'hidden',
  ...modernShadow,
});

export const getModernSidePanelStyle = (isDarkMode = true): ViewStyle => ({
  height: '100%' as any,
  maxHeight: '100%' as any,
  width: 400,
  maxWidth: 420,
  borderRadius: 0,
  borderLeftWidth: 1,
  borderLeftColor: getModernColors(isDarkMode).border,
  borderTopWidth: 0,
  borderBottomWidth: 0,
  borderRightWidth: 0,
  backgroundColor: getModernColors(isDarkMode).surface,
});

export const modernShadow: ViewStyle = Platform.select<ViewStyle>({
  web: {
    boxShadow: '0 18px 48px rgba(15, 23, 42, 0.18)',
  } as ViewStyle,
  ios: {
    shadowColor: '#0f172a',
    shadowOpacity: 0.16,
    shadowOffset: { width: 0, height: 16 },
    shadowRadius: 24,
  },
  default: {
    elevation: 10,
  },
}) as ViewStyle;

export const modernModalCardStyle: ViewStyle = {
  borderRadius: 22,
  borderWidth: 1,
  borderColor: modernColors.border,
  backgroundColor: modernColors.surface,
  overflow: 'hidden',
  ...modernShadow,
};

export const modernPanelStyle: ViewStyle = {
  borderRadius: 18,
  borderWidth: 1,
  borderColor: modernColors.border,
  backgroundColor: modernColors.surfaceStrong,
  ...modernShadow,
};