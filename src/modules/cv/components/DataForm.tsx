import React, { useState, useEffect } from 'react';
import { 
  Save, User, Briefcase, GraduationCap, Globe, Phone, Mail, 
  Linkedin, Plus, Trash2, Edit3, Wand2 
} from 'lucide-react';
import { useCVContext } from '../CVProvider';
import { CVData, ExperienceItem, ProjectItem, EducationItem, LanguageItem } from '../types';
import { rewriteService } from '../ai/RewriteService';

export const DataForm: React.FC = () => {
  const { currentVersion, updateCurrentVersion } = useCVContext();
  const [formData, setFormData] = useState<CVData | null>(null);
  const [activeTab, setActiveTab] = useState('perfil');
  const [isAIProcessing, setIsAIProcessing] = useState(false);

  useEffect(() => {
    if (currentVersion) {
      setFormData({ ...currentVersion.data });
    }
  }, [currentVersion]);

  const handleSave = () => {
    if (formData) {
      updateCurrentVersion(formData);
    }
  };

  const handleAIRewrite = async (text: string, fieldType: 'profile' | 'experience' | 'projects' | 'skills') => {
    if (!currentVersion || !text.trim()) return text;

    setIsAIProcessing(true);
    try {
      const response = await rewriteService.rewriteText({
        text,
        versionType: currentVersion.type,
        fieldType
      });
      return response.rewrittenText;
    } catch (error) {
      console.error('AI rewrite error:', error);
      return text;
    } finally {
      setIsAIProcessing(false);
    }
  };

  if (!formData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <User size={48} className="mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500">Cargando formulario...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'perfil', label: 'Perfil', icon: User },
    { id: 'experiencia', label: 'Experiencia', icon: Briefcase },
    { id: 'proyectos', label: 'Proyectos', icon: Edit3 },
    { id: 'educacion', label: 'Educación', icon: GraduationCap },
    { id: 'habilidades', label: 'Habilidades', icon: Edit3 },
    { id: 'idiomas', label: 'Idiomas', icon: Globe },
    { id: 'contacto', label: 'Contacto', icon: Phone }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Editar Información del CV
          </h3>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Save size={16} />
            Guardar Cambios
          </button>
        </div>
        
        {currentVersion && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Editando: {currentVersion.name} ({currentVersion.type})
          </p>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8 px-6">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 py-4 text-sm font-medium border-b-2 transition-colors
                  ${isActive
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }
                `}
              >
                <IconComponent size={16} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Form Content */}
      <div className="p-6">
        {/* Perfil Tab */}
        {activeTab === 'perfil' && (
          <div className="space-y-6">
            <h4 className="font-medium text-gray-900 dark:text-white">Perfil Profesional</h4>
            {formData.profile.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Párrafo {index + 1}
                  </label>
                  <button
                    onClick={async () => {
                      const improved = await handleAIRewrite(item.text, 'profile');
                      const updatedProfile = [...formData.profile];
                      updatedProfile[index] = { ...item, text: improved };
                      setFormData({ ...formData, profile: updatedProfile });
                    }}
                    disabled={isAIProcessing}
                    className="flex items-center gap-1 px-3 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
                  >
                    <Wand2 size={12} />
                    {isAIProcessing ? 'Procesando...' : 'Mejorar con IA'}
                  </button>
                </div>
                <textarea
                  value={item.text}
                  onChange={(e) => {
                    const updatedProfile = [...formData.profile];
                    updatedProfile[index] = { ...item, text: e.target.value };
                    setFormData({ ...formData, profile: updatedProfile });
                  }}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
                />
              </div>
            ))}
          </div>
        )}

        {/* Experiencia Tab */}
        {activeTab === 'experiencia' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900 dark:text-white">Experiencia Profesional</h4>
              <button
                onClick={() => {
                  const newExperience: ExperienceItem = {
                    date: '',
                    title: '',
                    company: '',
                    location: '',
                    description: [''],
                    icon: undefined
                  };
                  setFormData({
                    ...formData,
                    experience: [...formData.experience, newExperience]
                  });
                }}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus size={16} />
                Agregar Experiencia
              </button>
            </div>
            
            {formData.experience.map((exp, index) => (
              <div key={index} className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Período
                    </label>
                    <input
                      type="text"
                      value={exp.date}
                      onChange={(e) => {
                        const updatedExp = [...formData.experience];
                        updatedExp[index] = { ...exp, date: e.target.value };
                        setFormData({ ...formData, experience: updatedExp });
                      }}
                      placeholder="ej. Enero 2020 - Presente"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Cargo
                    </label>
                    <input
                      type="text"
                      value={exp.title}
                      onChange={(e) => {
                        const updatedExp = [...formData.experience];
                        updatedExp[index] = { ...exp, title: e.target.value };
                        setFormData({ ...formData, experience: updatedExp });
                      }}
                      placeholder="ej. Gerente de Proyectos"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Empresa
                    </label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => {
                        const updatedExp = [...formData.experience];
                        updatedExp[index] = { ...exp, company: e.target.value };
                        setFormData({ ...formData, experience: updatedExp });
                      }}
                      placeholder="ej. Empresa ABC"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Ubicación (opcional)
                    </label>
                    <input
                      type="text"
                      value={exp.location || ''}
                      onChange={(e) => {
                        const updatedExp = [...formData.experience];
                        updatedExp[index] = { ...exp, location: e.target.value };
                        setFormData({ ...formData, experience: updatedExp });
                      }}
                      placeholder="ej. Ciudad de México, México"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Descripción y logros
                    </label>
                    <button
                      onClick={async () => {
                        const descriptionText = exp.description.join('\n');
                        const improved = await handleAIRewrite(descriptionText, 'experience');
                        const updatedExp = [...formData.experience];
                        updatedExp[index] = { ...exp, description: improved.split('\n').filter(line => line.trim()) };
                        setFormData({ ...formData, experience: updatedExp });
                      }}
                      disabled={isAIProcessing}
                      className="flex items-center gap-1 px-3 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
                    >
                      <Wand2 size={12} />
                      {isAIProcessing ? 'Procesando...' : 'Mejorar con IA'}
                    </button>
                  </div>
                  
                  {exp.description.map((desc, descIndex) => (
                    <div key={descIndex} className="flex gap-2 mb-2">
                      <textarea
                        value={desc}
                        onChange={(e) => {
                          const updatedExp = [...formData.experience];
                          const updatedDesc = [...exp.description];
                          updatedDesc[descIndex] = e.target.value;
                          updatedExp[index] = { ...exp, description: updatedDesc };
                          setFormData({ ...formData, experience: updatedExp });
                        }}
                        rows={2}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
                        placeholder="Describe tus responsabilidades y logros..."
                      />
                      {exp.description.length > 1 && (
                        <button
                          onClick={() => {
                            const updatedExp = [...formData.experience];
                            const updatedDesc = exp.description.filter((_, i) => i !== descIndex);
                            updatedExp[index] = { ...exp, description: updatedDesc };
                            setFormData({ ...formData, experience: updatedExp });
                          }}
                          className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                  
                  <button
                    onClick={() => {
                      const updatedExp = [...formData.experience];
                      updatedExp[index] = { 
                        ...exp, 
                        description: [...exp.description, ''] 
                      };
                      setFormData({ ...formData, experience: updatedExp });
                    }}
                    className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                  >
                    + Agregar punto adicional
                  </button>
                </div>
                
                {formData.experience.length > 1 && (
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={() => {
                        const updatedExp = formData.experience.filter((_, i) => i !== index);
                        setFormData({ ...formData, experience: updatedExp });
                      }}
                      className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                    >
                      <Trash2 size={16} />
                      Eliminar experiencia
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Contacto Tab */}
        {activeTab === 'contacto' && (
          <div className="space-y-6">
            <h4 className="font-medium text-gray-900 dark:text-white">Información de Contacto</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <Mail size={16} className="inline mr-2" />
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  value={formData.contact.email}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      contact: { ...formData.contact, email: e.target.value }
                    });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <Phone size={16} className="inline mr-2" />
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={formData.contact.phone}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      contact: { ...formData.contact, phone: e.target.value }
                    });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <Linkedin size={16} className="inline mr-2" />
                LinkedIn
              </label>
              <input
                type="url"
                value={formData.contact.linkedin}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    contact: { ...formData.contact, linkedin: e.target.value }
                  });
                }}
                placeholder="https://www.linkedin.com/in/tu-perfil/"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            <Save size={18} />
            Guardar Todos los Cambios
          </button>
        </div>
      </div>
    </div>
  );
};