// Types for CV Builder MVP
export interface ContactInfo {
  email: string;
  phone: string;
  linkedin: string;
  cvUrl?: string;
}

export interface ExperienceItem {
  date: string;
  title: string;
  company: string;
  location?: string;
  description: string[];
  icon?: any;
}

export interface ProjectItem {
  title: string;
  date: string;
  description: string[];
  icon?: any;
}

export interface EducationItem {
  icon: any;
  iconColor?: string;
  title: string;
  period: string;
  description: string | string[];
}

export interface LanguageItem {
  language: string;
  proficiency: string;
}

export interface SkillsData {
  tooltips: Record<string, string>;
  management: string[];
}

export interface ProfileItem {
  icon: any;
  text: string;
}

export interface CVData {
  profile: ProfileItem[];
  skills: SkillsData;
  experience: ExperienceItem[];
  projects: ProjectItem[];
  education: EducationItem[];
  otherStudies: string[];
  languages: LanguageItem[];
  contact: ContactInfo;
}

// CV Version Types
export type CVVersionType = 'general' | 'comercial' | 'tech' | 'academico';

export interface CVVersion {
  id: string;
  name: string;
  type: CVVersionType;
  data: CVData;
  createdAt: Date;
  updatedAt: Date;
}

// Section Management
export interface SectionConfig {
  id: string;
  title: string;
  enabled: boolean;
  order: number;
}

// Color Theme
export type ColorTheme = 'default' | 'corporate' | 'tech' | 'creative';

export interface ThemeConfig {
  id: ColorTheme;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
  };
}

// AI Service Types
export interface AIRewriteRequest {
  text: string;
  versionType: CVVersionType;
  fieldType: 'profile' | 'experience' | 'projects' | 'skills';
}

export interface AIRewriteResponse {
  originalText: string;
  rewrittenText: string;
  improvements: string[];
}

// App State
export interface CVBuilderState {
  currentVersion: CVVersion | null;
  versions: CVVersion[];
  sections: SectionConfig[];
  currentTheme: ColorTheme;
  isEditMode: boolean;
  isPreviewMode: boolean;
}