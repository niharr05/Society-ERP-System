import { MD3LightTheme, configureFonts } from 'react-native-paper';
import { Platform } from 'react-native';

const fontFamily = Platform.select({
  ios: 'SF Pro Display',
  android: 'sans-serif-medium',
  default: 'System',
});

// Vibrant, Multi-Tone Harmonious Color Palette
export const AppColors = {
  primary: '#2563EB', // Royal Blue
  primaryDark: '#1D4ED8',
  primaryContainer: '#EFF6FF',
  
  secondary: '#10B981', // Vibrant Emerald Green
  secondaryContainer: '#ECFDF5',

  accentIndigo: '#6366F1', // Indigo Accent
  accentPurple: '#8B5CF6', // Purple Accent
  accentAmber: '#F59E0B',  // Warm Amber Accent

  background: '#F8FAFC',
  surface: '#FFFFFF',
  
  text: '#0F172A', // Deep Charcoal
  textSecondary: '#475569',
  
  border: '#E2E8F0',
  error: '#EF4444',
  errorContainer: '#FEF2F2',
  warning: '#F59E0B',
  warningContainer: '#FFFBEB',
  info: '#2563EB',
  infoContainer: '#EFF6FF',

  glassCardBg: '#FFFFFF',
  glassCardBorder: '#E2E8F0',
};

const fontConfig = {
  fontFamily,
};

export const theme = {
  ...MD3LightTheme,
  fonts: configureFonts({ config: fontConfig }),
  colors: {
    ...MD3LightTheme.colors,
    primary: AppColors.primary,
    primaryContainer: AppColors.primaryContainer,
    secondary: AppColors.secondary,
    secondaryContainer: AppColors.secondaryContainer,
    background: AppColors.background,
    surface: AppColors.surface,
    onSurface: AppColors.text,
    onSurfaceVariant: AppColors.textSecondary,
    text: AppColors.text,
    error: AppColors.error,
    errorContainer: AppColors.errorContainer,
    outline: AppColors.border,
  },
  roundness: 16,
};
