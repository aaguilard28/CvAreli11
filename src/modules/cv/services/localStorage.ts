import { CVVersion, CVBuilderState, SectionConfig, ColorTheme } from '../types';

const STORAGE_KEYS = {
  CV_VERSIONS: 'cv_versions',
  CURRENT_VERSION: 'current_version_id',
  SECTIONS_CONFIG: 'sections_config',
  CURRENT_THEME: 'current_theme',
  APP_STATE: 'cv_builder_state'
};

// CV Versions Management
export const saveVersions = (versions: CVVersion[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.CV_VERSIONS, JSON.stringify(versions));
  } catch (error) {
    console.error('Error saving versions:', error);
  }
};

export const loadVersions = (): CVVersion[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CV_VERSIONS);
    if (!stored) return [];
    return JSON.parse(stored).map((v: any) => ({
      ...v,
      createdAt: new Date(v.createdAt),
      updatedAt: new Date(v.updatedAt)
    }));
  } catch (error) {
    console.error('Error loading versions:', error);
    return [];
  }
};

export const saveCurrentVersionId = (versionId: string): void => {
  localStorage.setItem(STORAGE_KEYS.CURRENT_VERSION, versionId);
};

export const loadCurrentVersionId = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.CURRENT_VERSION);
};

// Sections Configuration
export const saveSectionsConfig = (sections: SectionConfig[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.SECTIONS_CONFIG, JSON.stringify(sections));
  } catch (error) {
    console.error('Error saving sections config:', error);
  }
};

export const loadSectionsConfig = (): SectionConfig[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SECTIONS_CONFIG);
    if (!stored) return getDefaultSectionsConfig();
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error loading sections config:', error);
    return getDefaultSectionsConfig();
  }
};

// Theme Management
export const saveCurrentTheme = (theme: ColorTheme): void => {
  localStorage.setItem(STORAGE_KEYS.CURRENT_THEME, theme);
};

export const loadCurrentTheme = (): ColorTheme => {
  return (localStorage.getItem(STORAGE_KEYS.CURRENT_THEME) as ColorTheme) || 'default';
};

// Export/Import JSON
export const exportData = (): string => {
  const data = {
    versions: loadVersions(),
    currentVersionId: loadCurrentVersionId(),
    sectionsConfig: loadSectionsConfig(),
    currentTheme: loadCurrentTheme(),
    exportedAt: new Date().toISOString()
  };
  return JSON.stringify(data, null, 2);
};

export const importData = (jsonData: string): boolean => {
  try {
    const data = JSON.parse(jsonData);
    
    if (data.versions) {
      saveVersions(data.versions);
    }
    if (data.currentVersionId) {
      saveCurrentVersionId(data.currentVersionId);
    }
    if (data.sectionsConfig) {
      saveSectionsConfig(data.sectionsConfig);
    }
    if (data.currentTheme) {
      saveCurrentTheme(data.currentTheme);
    }
    
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
};

// Default sections configuration
export const getDefaultSectionsConfig = (): SectionConfig[] => [
  { id: 'perfil', title: 'Perfil Profesional', enabled: true, order: 1 },
  { id: 'habilidades', title: 'Habilidades Destacadas', enabled: true, order: 2 },
  { id: 'experiencia', title: 'Experiencia Profesional', enabled: true, order: 3 },
  { id: 'proyectos', title: 'Proyectos de Innovación y Transformación Digital', enabled: true, order: 4 },
  { id: 'educacion', title: 'Educación Académica', enabled: true, order: 5 },
  { id: 'idiomas', title: 'Idiomas', enabled: true, order: 6 },
  { id: 'contacto', title: 'Contacto', enabled: true, order: 7 }
];

// Clear all data (for development/testing)
export const clearAllData = (): void => {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
};