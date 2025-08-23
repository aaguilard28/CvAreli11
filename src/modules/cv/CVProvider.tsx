import React, { createContext, useContext, ReactNode } from 'react';
import { useCV } from './hooks/useCV';
import type { CVBuilderState, CVVersion, SectionConfig, ColorTheme, CVVersionType, CVData } from './types';

interface CVContextType extends CVBuilderState {
  isLoading: boolean;
  
  // Actions
  createVersion: (name: string, type: CVVersionType, baseData?: CVData) => CVVersion;
  updateCurrentVersion: (data: Partial<CVData>) => void;
  switchToVersion: (versionId: string) => void;
  deleteVersion: (versionId: string) => void;
  updateSectionsConfig: (sections: SectionConfig[]) => void;
  changeTheme: (theme: ColorTheme, isDark?: boolean) => void;
  toggleEditMode: () => void;
  togglePreviewMode: () => void;
  exportCVData: () => string;
  importCVData: (jsonData: string) => boolean;
}

const CVContext = createContext<CVContextType | undefined>(undefined);

interface CVProviderProps {
  children: ReactNode;
}

export const CVProvider: React.FC<CVProviderProps> = ({ children }) => {
  const cvData = useCV();
  
  return (
    <CVContext.Provider value={cvData}>
      {children}
    </CVContext.Provider>
  );
};

export const useCVContext = (): CVContextType => {
  const context = useContext(CVContext);
  if (context === undefined) {
    throw new Error('useCVContext must be used within a CVProvider');
  }
  return context;
};

// HOC to wrap components with CV context
export const withCVProvider = <P extends object>(Component: React.ComponentType<P>) => {
  return (props: P) => (
    <CVProvider>
      <Component {...props} />
    </CVProvider>
  );
};