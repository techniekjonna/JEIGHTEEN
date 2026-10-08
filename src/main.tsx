import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/jost';
import App from './App.tsx';
import './index.css';
import './styles/base.css';
import './styles/drawer.css';
import './styles/landing.css';
import './styles/atelier.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
