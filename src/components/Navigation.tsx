import { User, Sun, Moon, Download } from 'lucide-react';

type Props = {
  activeSection: string;
  onNavigate: (id: string) => void;
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  isDark: boolean;
  toggleDark: () => void;
  onDownloadPDF: () => void; // usaremos window.print()
};

const Navigation = ({
  activeSection,
  onNavigate,
  isMobileMenuOpen,
  toggleMobileMenu,
  isDark,
  toggleDark,
  onDownloadPDF,
}: Props) => {
  const sections = [
    { id: 'perfil', title: 'Perfil Profesional' },
    { id: 'habilidades', title: 'Habilidades Destacadas' },
    { id: 'experiencia', title: 'Experiencia Profesional' },
    { id: 'proyectos', title: 'Proyectos de Innovación y Transformación Digital' },
    { id: 'educacion', title: 'Educación Académica' },
    { id: 'idiomas', title: 'Idiomas' },
    { id: 'contacto', title: 'Contacto' },
  ];

  return (
    <nav className="app-nav fixed lg:left-0 top-0 w-full lg:w-80 h-16 lg:h-screen bg-[#1e2a38] text-gray-200 shadow-2xl z-50 no-print">
      <div className="container mx-auto px-4 lg:px-0 h-full flex items-center justify-between lg:block">
        <div className="relative w-full flex items-center lg:block lg:py-8">
          <div className="flex items-center lg:flex-col lg:items-center lg:text-center pr-32 lg:pr-0">
            <User size={32} className="text-amber-600 mr-3 lg:mb-4" />
            <div className="flex flex-col">
              <div className="hidden lg:block w-[240px] overflow-hidden">
                <h2 className="text-sm font-semibold tracking-widest text-blue-100">CURRICULUM VITAE</h2>
              </div>
              <h1 className="static-name font-bold font-sans text-gray-50 text-xs sm:text-xl lg:text-2xl leading-tight">
                <span className="block">ARELI</span>
                <span className="block">AGUILAR</span>
                <span className="block">DELGADO</span>
              </h1>

              {/* Desktop */}
              <div className="mt-3 hidden lg:flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={toggleDark}
                  className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition focus:outline-none"
                  aria-label="Alternar modo"
                  title={isDark ? 'Modo claro' : 'Modo oscuro'}
                >
                  {isDark ? <Sun size={18} /> : <Moon size={18} />}
                </button>
                <div className="relative group">
                  <button
                    type="button"
                    onClick={onDownloadPDF}
                    className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition focus:outline-none"
                    aria-label="Descargar / Imprimir"
                    title="Descargar / Imprimir"
                  >
                    <Download size={18} />
                  </button>
                  <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-1 opacity-0 group-hover:opacity-100 transition bg-white/90 text-[#1e2a38] dark:bg-slate-700 dark:text-white text-xs font-medium px-2 py-1 rounded shadow">
                    Descargar / Imprimir
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Móvil a la derecha */}
          <div className="lg:hidden absolute right-4 top-1/2 -translate-y-1/2 z-10 flex items-center gap-2">
            <button
              type="button"
              onClick={toggleDark}
              className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition focus:outline-none"
              aria-label="Alternar modo"
              title={isDark ? 'Modo claro' : 'Modo oscuro'}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              type="button"
              onClick={onDownloadPDF}
              className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition focus:outline-none"
              aria-label="Descargar / Imprimir"
              title="Descargar / Imprimir"
            >
              <Download size={18} />
            </button>
            <button
              type="button"
              onClick={toggleMobileMenu}
              className="text-gray-200 hover:text-gray-400 focus:outline-none"
              aria-label="Abrir menú"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        <div className="hidden lg:block w-3/4 mx-auto my-4 border-t border-gray-700" />

        <div className={`fixed inset-x-0 top-16 bg-[#1e2a38] lg:static lg:block lg:h-auto lg:mt-8 ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
          <ul className="flex flex-col lg:space-y-2 p-4 lg:p-0">
            {sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  onClick={(e) => { e.preventDefault(); onNavigate(section.id); }}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${activeSection === section.id ? 'bg-[#4a688b] text-white shadow-lg' : 'hover:bg-gray-800'}`}
                >
                  <span className="font-semibold">{section.title}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
