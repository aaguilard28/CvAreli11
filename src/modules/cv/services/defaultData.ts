import { CVData } from '../types';
import {
  User, Briefcase, GraduationCap, Globe, Zap, Brain, Landmark, FileText, HardHat, Users,
  BarChart, Gem, Lightbulb, Settings, Bot, Handshake, BookOpen
} from 'lucide-react';
import { createElement } from 'react';

// Generate default CV data (empty template for user input)
export const generateDefaultCVData = (): CVData => ({
  profile: [
    { 
      icon: createElement(Briefcase, { size: 24 }), 
      text: 'Describe tu experiencia profesional principal aquí...' 
    },
    { 
      icon: createElement(Settings, { size: 24 }), 
      text: 'Menciona tus habilidades técnicas y de gestión...' 
    },
    { 
      icon: createElement(Bot, { size: 24 }), 
      text: 'Incluye información sobre tecnologías emergentes o IA si aplica...' 
    },
    { 
      icon: createElement(Handshake, { size: 24 }), 
      text: 'Destaca tu experiencia en relaciones comerciales o liderazgo...' 
    }
  ],
  skills: {
    tooltips: {
      'Herramientas Office': 'Nivel de dominio de herramientas de productividad',
      'Comunicación': 'Habilidades de comunicación escrita y verbal',
      'Liderazgo': 'Capacidad de liderar equipos y proyectos',
      'Análisis de datos': 'Competencia en análisis e interpretación de información',
      'Gestión de proyectos': 'Experiencia en planificación y ejecución de proyectos',
      'Tecnologías emergentes': 'Adaptación a nuevas tecnologías y herramientas digitales'
    },
    management: [
      'Organización y autonomía',
      'Manejo confidencial de información',
      'Adaptabilidad a cambios',
      'Habilidades de negociación',
      'Resolución de problemas',
      'Atención al detalle',
      'Gestión de equipos',
      'Aprendizaje continuo',
      'Comunicación efectiva',
      'Trabajo en equipo'
    ]
  },
  experience: [
    {
      date: 'Fecha de inicio - Fecha fin',
      title: 'Título del puesto',
      company: 'Nombre de la empresa',
      location: 'Ciudad, País (opcional)',
      description: [
        'Descripción de responsabilidades principales...',
        'Logros específicos con métricas si es posible...',
        'Impacto en la organización...',
        'Tecnologías o metodologías utilizadas...'
      ],
      icon: createElement(Briefcase, { size: 24 })
    }
  ],
  projects: [
    {
      title: 'Nombre del Proyecto',
      date: 'Fecha del proyecto',
      description: [
        'Descripción del proyecto y objetivos...',
        'Tu rol y responsabilidades...',
        'Tecnologías utilizadas...',
        'Resultados obtenidos...'
      ],
      icon: createElement(Brain, { size: 24 })
    }
  ],
  education: [
    { 
      icon: createElement(GraduationCap, { size: 24 }), 
      iconColor: '#3B82F6', 
      title: 'Título académico', 
      period: 'Año de graduación', 
      description: 'Institución educativa' 
    }
  ],
  otherStudies: [
    'Curso, certificación o diplomado; Institución; Año',
    'Añade más estudios complementarios según necesites'
  ],
  languages: [
    { language: 'Español', proficiency: 'Lengua nativa' },
    { language: 'Inglés', proficiency: 'Nivel (básico/intermedio/avanzado/fluido)' }
  ],
  contact: {
    email: 'tu.email@ejemplo.com',
    phone: '+XX XXX XXX XXXX',
    linkedin: 'https://www.linkedin.com/in/tu-perfil/',
    cvUrl: '#'
  }
});

// Sample data for different version types (for AI guidance)
export const getVersionTemplatePrompts = (versionType: string) => {
  const prompts = {
    general: {
      profile: "Enfoque balanceado, destacando versatilidad profesional y capacidad de adaptación",
      experience: "Describe responsabilidades de manera equilibrada, mostrando progreso profesional",
      skills: "Combina habilidades técnicas y blandas de forma proporcional"
    },
    comercial: {
      profile: "Enfatiza logros cuantificables, KPIs, negociación y desarrollo de negocios",
      experience: "Destaca números, ventas, crecimiento, relaciones comerciales y resultados de negocio",
      skills: "Prioriza habilidades comerciales: negociación, ventas, análisis de mercado, CRM"
    },
    tech: {
      profile: "Resalta competencias técnicas, innovación, automatización y tecnologías emergentes",
      experience: "Enfoca en proyectos tecnológicos, implementaciones, optimizaciones y stack técnico",
      skills: "Destaca herramientas técnicas, lenguajes de programación, metodologías ágiles, IA"
    },
    academico: {
      profile: "Emphasiza investigación, docencia, publicaciones y contribuciones académicas",
      experience: "Resalta experiencia docente, investigaciones, publicaciones y métricas académicas",
      skills: "Prioriza habilidades de investigación, análisis, redacción académica y presentaciones"
    }
  };
  
  return prompts[versionType as keyof typeof prompts] || prompts.general;
};