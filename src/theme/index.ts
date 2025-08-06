export const theme = {
  colors: {
    primary: '#4A90E2',
    secondary: '#FFD700',
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#D0021B',
    info: '#2196F3',
    
    // Light mode colors
    light: {
      background: '#F8F9FA',
      surface: '#FFFFFF',
      text: '#333333',
      textSecondary: '#666666',
      textMuted: '#9B9B9B',
      border: '#E5E5E5',
      card: '#FFFFFF',
      input: '#F8F9FA',
      shadow: 'rgba(0, 0, 0, 0.1)',
    },
    
    // Dark mode colors
    dark: {
      background: '#1A1B2E',
      surface: '#2A2B3E',
      text: '#FFFFFF',
      textSecondary: '#E0E0E0',
      textMuted: '#B0B0B0',
      border: '#3A3B4E',
      card: '#2A2B3E',
      input: '#3A3B4E',
      shadow: 'rgba(0, 0, 0, 0.3)',
    },
  },
  
  fonts: {
    ketchum: 'Ketchum',
    ketchumItalic: 'Ketchum-Italic',
    pokemonClassic: 'Pokemon-Classic',
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
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 24,
  },
  
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 8,
    },
  },
};

export type Theme = typeof theme;

export const getThemeColors = (isDarkMode: boolean) => {
  return isDarkMode ? theme.colors.dark : theme.colors.light;
}; 