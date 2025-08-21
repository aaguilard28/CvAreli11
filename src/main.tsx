import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Importa Tailwind global
import './index.css';

/* ====== Asegurar que el tema se aplique antes del render ====== */
const storedTheme = localStorage.getItem('theme');
if (storedTheme === 'dark') {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
