import React, { useState } from 'react';
import { 
  Settings, Edit3, Eye, Download, FileText, Upload, 
  Palette, Layout, Bot, Save, X 
} from 'lucide-react';
import { useCVContext } from '../CVProvider';
import { VersionManager } from './VersionManager';
import { DataForm } from './DataForm';
import { ThemeSwitcher } from './ThemeSwitcher';
import { SectionManager } from './SectionManager';
import { pdfExportService } from '../export/pdfExport';

interface CVBuilderProps {
  onClose: () => void;
  isDark: boolean;
}

export const CVBuilder: React.FC<CVBuilderProps> = ({ onClose, isDark }) => {
  const { 
    currentVersion, 
    isEditMode, 
    toggleEditMode, 
    exportCVData, 
    importCVData 
  } = useCVContext();

  const [activePanel, setActivePanel] = useState<string>('versions');
  const [showImportModal, setShowImportModal] = useState(false);
  const [importText, setImportText] = useState('');

  const panels = [
    { id: 'versions', label: 'Versiones', icon: FileText },
    { id: 'edit', label: 'Editar Datos', icon: Edit3 },
    { id: 'sections', label: 'Secciones', icon: Layout },
    { id: 'themes', label: 'Temas', icon: Palette },
  ];

  const handleExportData = () => {
    const data = exportCVData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cv_data_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportData = () => {
    try {
      const success = importCVData(importText);
      if (success) {
        setShowImportModal(false);
        setImportText('');
        alert('Datos importados exitosamente');
      } else {
        alert('Error al importar los datos. Verifica el formato JSON.');
      }
    } catch (error) {
      alert('Error al procesar el archivo JSON');
    }
  };

  const handleDownloadPDF = async () => {
    try {
      await pdfExportService.exportPDF();
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Error al generar el PDF. Por favor, intenta nuevamente.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex">
      {/* Sidebar Panel */}
      <div className="w-80 bg-white dark:bg-gray-800 shadow-xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Settings size={24} className="text-blue-600" />
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  CV Builder
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {currentVersion?.name || 'Sin versión activa'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          {panels.map((panel) => {
            const IconComponent = panel.icon;
            const isActive = activePanel === panel.id;
            
            return (
              <button
                key={panel.id}
                onClick={() => setActivePanel(panel.id)}
                className={`
                  flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors
                  ${isActive
                    ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }
                `}
              >
                <IconComponent size={16} />
                <span>{panel.label}</span>
              </button>
            );
          })}
        </div>

        {/* Panel Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activePanel === 'versions' && <VersionManager />}
          {activePanel === 'edit' && <DataForm />}
          {activePanel === 'sections' && <SectionManager />}
          {activePanel === 'themes' && <ThemeSwitcher isDark={isDark} />}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
          {/* PDF Download */}
          <button
            onClick={handleDownloadPDF}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            <Download size={18} />
            Descargar PDF
          </button>
          
          {/* Data Management */}
          <div className="flex gap-2">
            <button
              onClick={handleExportData}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-sm"
            >
              <Save size={14} />
              Exportar
            </button>
            <button
              onClick={() => setShowImportModal(true)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-sm"
            >
              <Upload size={14} />
              Importar
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area - Transparent overlay */}
      <div 
        className="flex-1 p-8 overflow-y-auto"
        onClick={onClose}
      >
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
            <div className="text-center">
              <Eye size={48} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Vista Previa del CV
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Tu CV se muestra en el fondo. Cierra este panel para ver los cambios aplicados.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Ver CV Actualizado
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-96">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Importar Datos de CV
              </h3>
            </div>
            
            <div className="p-6">
              <textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder="Pega aquí el JSON exportado de tu CV..."
                rows={10}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none font-mono text-sm"
              />
            </div>
            
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => {
                  setShowImportModal(false);
                  setImportText('');
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleImportData}
                disabled={!importText.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Importar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};