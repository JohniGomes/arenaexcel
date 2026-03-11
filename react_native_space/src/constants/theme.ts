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

// XP acumulado necessário para ATINGIR cada nível (índice = nível - 1)
export const XP_THRESHOLDS = [
  0,     // Nível 1
  100,   // Nível 2
  250,   // Nível 3
  450,   // Nível 4
  700,   // Nível 5
  1000,  // Nível 6
  1350,  // Nível 7
  1750,  // Nível 8
  2200,  // Nível 9
  2700,  // Nível 10
  3250,  // Nível 11
  3850,  // Nível 12
  4500,  // Nível 13
  5200,  // Nível 14
  5950,  // Nível 15
  6750,  // Nível 16
  7600,  // Nível 17
  8500,  // Nível 18
  9500,  // Nível 19
  10500, // Nível 20
];

const LEVEL_NAMES = [
  'Iniciante',     // 1
  'Aprendiz',      // 2
  'Explorador',    // 3
  'Praticante',    // 4
  'Analista Jr.',  // 5
  'Analista',      // 6
  'Analista Sr.',  // 7
  'Especialista',  // 8
  'Consultor Jr.', // 9
  'Consultor',     // 10
  'Consultor Sr.', // 11
  'Expert',        // 12
  'Mestre Jr.',    // 13
  'Mestre',        // 14
  'Mestre Sr.',    // 15
  'Guru',          // 16
  'Lenda Jr.',     // 17
  'Lenda',         // 18
  'Lenda Sr.',     // 19
  'Campeão Excel', // 20
];

export const getLevelName = (level: number): string =>
  LEVEL_NAMES[Math.max(0, Math.min(level - 1, 19))];

export const getXpForNextLevel = (level: number): number => {
  const idx = Math.min(level, 19); // índice do próximo nível
  return XP_THRESHOLDS[idx] ?? 10500;
};
