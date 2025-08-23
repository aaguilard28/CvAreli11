import { ColorTheme, ThemeConfig } from '../types';

export const themes: Record<ColorTheme, ThemeConfig> = {
  default: {
    id: 'default',
    name: 'Profesional Clásico',
    colors: {
      primary: '#1e2a38',
      secondary: '#4a688b',
      accent: '#ffd700',
      text: '#1f2937',
      background: '#ffffff'
    }
  },
  corporate: {
    id: 'corporate',
    name: 'Corporativo Sobrio',
    colors: {
      primary: '#1f2937',
      secondary: '#374151',
      accent: '#3b82f6',
      text: '#111827',
      background: '#f9fafb'
    }
  },
  tech: {
    id: 'tech',
    name: 'Tech Elegante',
    colors: {
      primary: '#0f172a',
      secondary: '#1e293b',
      accent: '#06d6a0',
      text: '#0f172a',
      background: '#f8fafc'
    }
  },
  creative: {
    id: 'creative',
    name: 'Creativo Profesional',
    colors: {
      primary: '#581c87',
      secondary: '#7c3aed',
      accent: '#f59e0b',
      text: '#1f2937',
      background: '#fefefe'
    }
  }
};

export const applyTheme = (themeId: ColorTheme, isDark: boolean = false): void => {
  const theme = themes[themeId];
  const root = document.documentElement;
  
  // Apply CSS custom properties
  root.style.setProperty('--theme-primary', theme.colors.primary);
  root.style.setProperty('--theme-secondary', theme.colors.secondary);
  root.style.setProperty('--theme-accent', theme.colors.accent);
  root.style.setProperty('--theme-text', theme.colors.text);
  root.style.setProperty('--theme-background', theme.colors.background);
  
  // Add theme class to body for specific styling
  document.body.className = document.body.className.replace(/theme-\w+/g, '');
  document.body.classList.add(`theme-${themeId}`);
  
  // Preserve dark mode class
  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

export const getThemeConfig = (themeId: ColorTheme): ThemeConfig => {
  return themes[themeId];
};

export const getAllThemes = (): ThemeConfig[] => {
  return Object.values(themes);
};