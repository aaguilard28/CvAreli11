import React from 'react';
import { Palette, Check } from 'lucide-react';
import { useCVContext } from '../CVProvider';
import { getAllThemes } from '../services/themes';
import { ColorTheme } from '../types';

interface ThemeSwitcherProps {
  isDark: boolean;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ isDark }) => {
  const { currentTheme, changeTheme } = useCVContext();
  const themes = getAllThemes();

  const handleThemeChange = (themeId: ColorTheme) => {
    changeTheme(themeId, isDark);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <Palette size={24} className="text-gray-600 dark:text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Paletas Profesionales
        </h3>
      </div>
      
      <div className="space-y-4">
        {themes.map((theme) => {
          const isActive = currentTheme === theme.id;
          
          return (
            <div
              key={theme.id}
              onClick={() => handleThemeChange(theme.id)}
              className={`
                relative p-4 rounded-lg border-2 cursor-pointer transition-all
                ${isActive 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }
              `}
            >
              {/* Theme Preview */}
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <div className="flex rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
                    <div 
                      className="w-6 h-6" 
                      style={{ backgroundColor: theme.colors.primary }}
                    />
                    <div 
                      className="w-6 h-6" 
                      style={{ backgroundColor: theme.colors.secondary }}
                    />
                    <div 
                      className="w-6 h-6" 
                      style={{ backgroundColor: theme.colors.accent }}
                    />
                  </div>
                </div>
                
                <div className="flex-grow">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {theme.name}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {getThemeDescription(theme.id)}
                  </p>
                </div>
                
                {isActive && (
                  <Check size={20} className="text-blue-600 flex-shrink-0" />
                )}
              </div>
              
              {/* Color Details */}
              <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <div 
                    className="w-full h-8 rounded border border-gray-300 dark:border-gray-600 mb-1"
                    style={{ backgroundColor: theme.colors.primary }}
                  />
                  <span className="text-gray-600 dark:text-gray-400">Principal</span>
                </div>
                <div className="text-center">
                  <div 
                    className="w-full h-8 rounded border border-gray-300 dark:border-gray-600 mb-1"
                    style={{ backgroundColor: theme.colors.secondary }}
                  />
                  <span className="text-gray-600 dark:text-gray-400">Secundario</span>
                </div>
                <div className="text-center">
                  <div 
                    className="w-full h-8 rounded border border-gray-300 dark:border-gray-600 mb-1"
                    style={{ backgroundColor: theme.colors.accent }}
                  />
                  <span className="text-gray-600 dark:text-gray-400">Acento</span>
                </div>
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
              Compatibilidad con modo oscuro
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Todas las paletas se adaptan automáticamente al modo claro/oscuro manteniendo 
              la accesibilidad y legibilidad en PDF.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

function getThemeDescription(themeId: ColorTheme): string {
  const descriptions = {
    default: 'Azul profesional con toques dorados, ideal para perfiles ejecutivos',
    corporate: 'Grises corporativos con azul institucional, sobrio y confiable',
    tech: 'Negro elegante con verde tecnológico, moderno y innovador',
    creative: 'Púrpura creativo con amarillo vibrante, dinámico y profesional'
  };
  
  return descriptions[themeId] || '';
}