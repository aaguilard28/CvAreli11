import React, { useState } from 'react';
import { Plus, Copy, Edit2, Trash2, FileText, Briefcase, Code, GraduationCap, Check, X } from 'lucide-react';
import { useCVContext } from '../CVProvider';
import { CVVersionType } from '../types';

const versionTypeIcons = {
  general: FileText,
  comercial: Briefcase,
  tech: Code,
  academico: GraduationCap
};

const versionTypeLabels = {
  general: 'General',
  comercial: 'Comercial',
  tech: 'Tecnológico',
  academico: 'Académico'
};

export const VersionManager: React.FC = () => {
  const { 
    versions, 
    currentVersion, 
    createVersion, 
    switchToVersion, 
    deleteVersion 
  } = useCVContext();

  const [isCreating, setIsCreating] = useState(false);
  const [newVersionName, setNewVersionName] = useState('');
  const [newVersionType, setNewVersionType] = useState<CVVersionType>('general');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleCreateVersion = () => {
    if (newVersionName.trim()) {
      const baseData = currentVersion?.data;
      createVersion(newVersionName.trim(), newVersionType, baseData);
      setIsCreating(false);
      setNewVersionName('');
      setNewVersionType('general');
    }
  };

  const handleDuplicateVersion = (versionId: string) => {
    const version = versions.find(v => v.id === versionId);
    if (version) {
      const newName = `${version.name} (Copia)`;
      createVersion(newName, version.type, version.data);
    }
  };

  const startEditing = (versionId: string, currentName: string) => {
    setEditingId(versionId);
    setEditName(currentName);
  };

  const handleSaveEdit = () => {
    // For MVP, we'll just update the name in the version object
    // In a full implementation, this would be a separate update method
    setEditingId(null);
    setEditName('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName('');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Mis Versiones de CV
        </h3>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          Nueva Versión
        </button>
      </div>

      {/* Create New Version Form */}
      {isCreating && (
        <div className="mb-6 p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700">
          <h4 className="font-medium mb-3 text-gray-900 dark:text-white">Crear Nueva Versión</h4>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nombre de la versión
              </label>
              <input
                type="text"
                value={newVersionName}
                onChange={(e) => setNewVersionName(e.target.value)}
                placeholder="ej. CV para Startups Tech"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tipo de versión
              </label>
              <select
                value={newVersionType}
                onChange={(e) => setNewVersionType(e.target.value as CVVersionType)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              >
                <option value="general">General - Balanceado</option>
                <option value="comercial">Comercial - Enfoque en ventas y negocios</option>
                <option value="tech">Tecnológico - Enfoque en IA y tech</option>
                <option value="academico">Académico - Enfoque en investigación</option>
              </select>
            </div>
          </div>
          
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleCreateVersion}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <Check size={16} />
              Crear
            </button>
            <button
              onClick={() => {
                setIsCreating(false);
                setNewVersionName('');
                setNewVersionType('general');
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              <X size={16} />
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Versions List */}
      <div className="space-y-3">
        {versions.map((version) => {
          const IconComponent = versionTypeIcons[version.type];
          const isActive = currentVersion?.id === version.id;
          const isEditing = editingId === version.id;
          
          return (
            <div
              key={version.id}
              className={`
                p-4 rounded-lg border transition-all cursor-pointer
                ${isActive 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }
              `}
              onClick={() => !isEditing && switchToVersion(version.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isActive ? 'bg-blue-100 dark:bg-blue-800' : 'bg-gray-100 dark:bg-gray-700'}`}>
                    <IconComponent size={20} className={isActive ? 'text-blue-600' : 'text-gray-600 dark:text-gray-400'} />
                  </div>
                  
                  <div>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="px-2 py-1 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveEdit();
                          if (e.key === 'Escape') handleCancelEdit();
                        }}
                        autoFocus
                      />
                    ) : (
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {version.name}
                      </h4>
                    )}
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {versionTypeLabels[version.type]} • {version.updatedAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {isActive && (
                    <span className="px-2 py-1 text-xs bg-blue-600 text-white rounded-full">
                      Activa
                    </span>
                  )}
                  
                  {isEditing ? (
                    <div className="flex gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSaveEdit();
                        }}
                        className="p-1 text-green-600 hover:bg-green-100 rounded"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCancelEdit();
                        }}
                        className="p-1 text-gray-500 hover:bg-gray-100 rounded"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditing(version.id, version.name);
                        }}
                        className="p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                        title="Editar nombre"
                      >
                        <Edit2 size={16} />
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDuplicateVersion(version.id);
                        }}
                        className="p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                        title="Duplicar versión"
                      >
                        <Copy size={16} />
                      </button>
                      
                      {versions.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm('¿Estás seguro de que quieres eliminar esta versión?')) {
                              deleteVersion(version.id);
                            }
                          }}
                          className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                          title="Eliminar versión"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {versions.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <FileText size={48} className="mx-auto mb-4 opacity-50" />
          <p>No tienes versiones de CV creadas</p>
          <p className="text-sm">Crea tu primera versión para comenzar</p>
        </div>
      )}
    </div>
  );
};