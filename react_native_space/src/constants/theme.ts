import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    // Primárias - Verde Excel
    primary: '#217346',
    primaryMid: '#2E9E5B',
    primaryLight: '#E8F5E9',
    primaryVivid: '#27AE60',
    
    // Neutros
    background: '#F7F9F7',
    surface: '#FFFFFF',
    text: '#1A1A2E',
    textSecondary: '#4A4A6A',
    border: '#E0E5E0',
    gray: '#B0BEC5',
    grayBg: '#F0F2F0',
    
    // Semânticas
    amber: '#F59E0B',
    amberLight: '#FEF3C7',
    error: '#E74C3C',
    errorLight: '#FEE2E2',
    success: '#27AE60',
    warning: '#F59E0B',
    
    // Legado (manter compatibilidade)
    secondary: '#2E9E5B',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: '700' as const,
    },
    h2: {
      fontSize: 24,
      fontWeight: '700' as const,
    },
    h3: {
      fontSize: 20,
      fontWeight: '600' as const,
    },
    body: {
      fontSize: 16,
      fontWeight: '400' as const,
    },
    bodySmall: {
      fontSize: 14,
      fontWeight: '400' as const,
    },
    caption: {
      fontSize: 12,
      fontWeight: '400' as const,
    },
  },
};

export const getLevelName = (level: number): string => {
  switch (level) {
    case 1:
      return 'Iniciante';
    case 2:
      return 'Bronze';
    case 3:
      return 'Prata';
    case 4:
      return 'Ouro';
    case 5:
      return 'Diamante';
    default:
      return 'Iniciante';
  }
};

export const getXpForNextLevel = (level: number): number => {
  switch (level) {
    case 1:
      return 100;
    case 2:
      return 300;
    case 3:
      return 600;
    case 4:
      return 1000;
    default:
      return 1000;
  }
};
