import React, { useState } from 'react';
import { 
  Eye, EyeOff, GripVertical, Plus, Settings as SettingsIcon, 
  User, Briefcase, GraduationCap, Globe, Gem, Lightbulb, Handshake 
} from 'lucide-react';
import { useCVContext } from '../CVProvider';
import { SectionConfig } from '../types';

const sectionIcons = {
  perfil: User,
  habilidades: Gem,
  experiencia: Briefcase,
  proyectos: Lightbulb,
  educacion: GraduationCap,
  idiomas: Globe,
  contacto: Handshake
};

export const SectionManager: React.FC = () => {
  const { sections, updateSectionsConfig } = useCVContext();
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState('');

  const handleToggleSection = (sectionId: string) => {
    const updatedSections = sections.map(section =>
      section.id === sectionId 
        ? { ...section, enabled: !section.enabled }
        : section
    );
    updateSectionsConfig(updatedSections);
  };

  const handleAddCustomSection = () => {
    if (newSectionTitle.trim()) {
      const newSection: SectionConfig = {
        id: `custom_${Date.now()}`,
        title: newSectionTitle.trim(),
        enabled: true,
        order: sections.length + 1
      };
      
      updateSectionsConfig([...sections, newSection]);
      setNewSectionTitle('');
      setIsAddingSection(false);
    }
  };

  const handleReorder = (fromIndex: number, toIndex: number) => {
    const reorderedSections = [...sections];
    const [movedSection] = reorderedSections.splice(fromIndex, 1);
    reorderedSections.splice(toIndex, 0, movedSection);
    
    // Update order property
    const updatedSections = reorderedSections.map((section, index) => ({
      ...section,
      order: index + 1
    }));
    
    updateSectionsConfig(updatedSections);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <SettingsIcon size={24} className="text-gray-600 dark:text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Configurar Secciones
          </h3>
        </div>
        
        <button
          onClick={() => setIsAddingSection(true)}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          Sección Personalizada
        </button>
      </div>

      {/* Add Custom Section Form */}
      {isAddingSection && (
        <div className="mb-6 p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700">
          <h4 className="font-medium mb-3 text-gray-900 dark:text-white">
            Agregar Sección Personalizada
          </h4>
          
          <div className="flex gap-3">
            <input
              type="text"
              value={newSectionTitle}
              onChange={(e) => setNewSectionTitle(e.target.value)}
              placeholder="Título de la nueva sección"
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              onKeyDown={(e) => e.key === 'Enter' && handleAddCustomSection()}
            />
            
            <button
              onClick={handleAddCustomSection}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Agregar
            </button>
            
            <button
              onClick={() => {
                setIsAddingSection(false);
                setNewSectionTitle('');
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              Cancelar
            </button>
          </div>
          
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Las secciones personalizadas aparecerán como campos de texto editables en el CV
          </p>
        </div>
      )}

      {/* Sections List */}
      <div className="space-y-3">
        {sections
          .sort((a, b) => a.order - b.order)
          .map((section, index) => {
            const IconComponent = sectionIcons[section.id as keyof typeof sectionIcons] || SettingsIcon;
            const isCustomSection = section.id.startsWith('custom_');
            
            return (
              <div
                key={section.id}
                className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {/* Drag Handle */}
                <div className="cursor-move text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <GripVertical size={20} />
                </div>
                
                {/* Section Icon */}
                <div className={`p-2 rounded-lg ${section.enabled ? 'bg-blue-100 dark:bg-blue-800' : 'bg-gray-100 dark:bg-gray-700'}`}>
                  <IconComponent 
                    size={20} 
                    className={section.enabled ? 'text-blue-600' : 'text-gray-400'} 
                  />
                </div>
                
                {/* Section Info */}
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {section.title}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {isCustomSection ? 'Sección personalizada' : 'Sección del sistema'}
                  </p>
                </div>
                
                {/* Status Badge */}
                <div className="flex items-center gap-3">
                  <span className={`
                    px-2 py-1 text-xs rounded-full
                    ${section.enabled 
                      ? 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-300' 
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                    }
                  `}>
                    {section.enabled ? 'Visible' : 'Oculta'}
                  </span>
                  
                  {/* Toggle Button */}
                  <button
                    onClick={() => handleToggleSection(section.id)}
                    className={`
                      p-2 rounded-lg transition-colors
                      ${section.enabled 
                        ? 'text-green-600 hover:bg-green-100 dark:hover:bg-green-800' 
                        : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }
                    `}
                    title={section.enabled ? 'Ocultar sección' : 'Mostrar sección'}
                  >
                    {section.enabled ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
              </div>
            );
          })}
      </div>
      
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
              Gestión de Secciones
            </p>
            <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <p>• Arrastra las secciones para cambiar el orden</p>
              <p>• Usa el botón de ojo para mostrar/ocultar secciones</p>
              <p>• Las secciones ocultas no aparecerán en el CV ni en el PDF</p>
              <p>• Puedes agregar secciones personalizadas para información adicional</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};