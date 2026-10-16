import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './theme/ThemeContext';
import { LanguageProvider } from './i18n/LanguageContext';
import { ShopProvider } from './pages/atelier/ShopContext';
import { ScrollToTop } from './components/ScrollToTop';
import { LandingPage } from './pages/LandingPage';
import { MusicPage } from './pages/MusicPage';
import { AtelierPage } from './pages/atelier/AtelierPage';
import { AtelierDashboard } from './pages/dashboard/AtelierDashboard';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
      <ShopProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/atelier" element={<AtelierPage />} />
            <Route path="/music" element={<MusicPage />} />
            <Route path="/atelier/dashboard" element={<AtelierDashboard />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ShopProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
