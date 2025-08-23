import { useState, useEffect, useCallback } from 'react';
import { CVVersion, CVBuilderState, SectionConfig, ColorTheme, CVVersionType, CVData } from '../types';
import { 
  loadVersions, 
  saveVersions, 
  loadCurrentVersionId, 
  saveCurrentVersionId,
  loadSectionsConfig,
  saveSectionsConfig,
  loadCurrentTheme,
  saveCurrentTheme,
  exportData,
  importData
} from '../services/localStorage';
import { applyTheme } from '../services/themes';
import { generateDefaultCVData } from '../services/defaultData';

export const useCV = () => {
  const [state, setState] = useState<CVBuilderState>({
    currentVersion: null,
    versions: [],
    sections: [],
    currentTheme: 'default',
    isEditMode: false,
    isPreviewMode: false
  });

  const [isLoading, setIsLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        const versions = loadVersions();
        const currentVersionId = loadCurrentVersionId();
        const sections = loadSectionsConfig();
        const currentTheme = loadCurrentTheme();
        
        let currentVersion = null;
        if (currentVersionId) {
          currentVersion = versions.find(v => v.id === currentVersionId) || null;
        }
        
        // If no versions exist, create a default one
        if (versions.length === 0) {
          const defaultVersion = createDefaultVersion();
          versions.push(defaultVersion);
          currentVersion = defaultVersion;
          saveVersions(versions);
          saveCurrentVersionId(defaultVersion.id);
        }
        
        setState({
          currentVersion,
          versions,
          sections,
          currentTheme,
          isEditMode: false,
          isPreviewMode: false
        });
        
        // Apply theme
        applyTheme(currentTheme);
        
      } catch (error) {
        console.error('Error loading CV data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Create a new version
  const createVersion = useCallback((name: string, type: CVVersionType, baseData?: CVData): CVVersion => {
    const newVersion: CVVersion = {
      id: `version_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      type,
      data: baseData || generateDefaultCVData(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const updatedVersions = [...state.versions, newVersion];
    
    setState(prev => ({
      ...prev,
      versions: updatedVersions,
      currentVersion: newVersion
    }));
    
    saveVersions(updatedVersions);
    saveCurrentVersionId(newVersion.id);
    
    return newVersion;
  }, [state.versions]);

  // Update current version
  const updateCurrentVersion = useCallback((data: Partial<CVData>) => {
    if (!state.currentVersion) return;
    
    const updatedVersion: CVVersion = {
      ...state.currentVersion,
      data: { ...state.currentVersion.data, ...data },
      updatedAt: new Date()
    };
    
    const updatedVersions = state.versions.map(v => 
      v.id === updatedVersion.id ? updatedVersion : v
    );
    
    setState(prev => ({
      ...prev,
      currentVersion: updatedVersion,
      versions: updatedVersions
    }));
    
    saveVersions(updatedVersions);
  }, [state.currentVersion, state.versions]);

  // Switch version
  const switchToVersion = useCallback((versionId: string) => {
    const version = state.versions.find(v => v.id === versionId);
    if (version) {
      setState(prev => ({ ...prev, currentVersion: version }));
      saveCurrentVersionId(versionId);
    }
  }, [state.versions]);

  // Delete version
  const deleteVersion = useCallback((versionId: string) => {
    const updatedVersions = state.versions.filter(v => v.id !== versionId);
    let newCurrentVersion = state.currentVersion;
    
    if (state.currentVersion?.id === versionId) {
      newCurrentVersion = updatedVersions[0] || null;
    }
    
    setState(prev => ({
      ...prev,
      versions: updatedVersions,
      currentVersion: newCurrentVersion
    }));
    
    saveVersions(updatedVersions);
    if (newCurrentVersion) {
      saveCurrentVersionId(newCurrentVersion.id);
    }
  }, [state.versions, state.currentVersion]);

  // Update sections configuration
  const updateSectionsConfig = useCallback((sections: SectionConfig[]) => {
    setState(prev => ({ ...prev, sections }));
    saveSectionsConfig(sections);
  }, []);

  // Change theme
  const changeTheme = useCallback((theme: ColorTheme, isDark: boolean = false) => {
    setState(prev => ({ ...prev, currentTheme: theme }));
    saveCurrentTheme(theme);
    applyTheme(theme, isDark);
  }, []);

  // Toggle edit mode
  const toggleEditMode = useCallback(() => {
    setState(prev => ({ ...prev, isEditMode: !prev.isEditMode }));
  }, []);

  // Toggle preview mode
  const togglePreviewMode = useCallback(() => {
    setState(prev => ({ ...prev, isPreviewMode: !prev.isPreviewMode }));
  }, []);

  // Export data
  const exportCVData = useCallback(() => {
    return exportData();
  }, []);

  // Import data
  const importCVData = useCallback((jsonData: string): boolean => {
    const success = importData(jsonData);
    if (success) {
      // Reload data
      window.location.reload();
    }
    return success;
  }, []);

  return {
    // State
    ...state,
    isLoading,
    
    // Actions
    createVersion,
    updateCurrentVersion,
    switchToVersion,
    deleteVersion,
    updateSectionsConfig,
    changeTheme,
    toggleEditMode,
    togglePreviewMode,
    exportCVData,
    importCVData
  };
};

// Helper function to create default version
const createDefaultVersion = (): CVVersion => ({
  id: `version_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  name: 'Versión General',
  type: 'general',
  data: generateDefaultCVData(),
  createdAt: new Date(),
  updatedAt: new Date()
});