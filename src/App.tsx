import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './theme/ThemeContext';
import { ShopProvider } from './pages/atelier/ShopContext';
import { ScrollToTop } from './components/ScrollToTop';
import { LandingPage } from './pages/LandingPage';
import { MusicPage } from './pages/MusicPage';
import { AtelierPage } from './pages/atelier/AtelierPage';

function App() {
  return (
    <ThemeProvider>
      <ShopProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/atelier" element={<AtelierPage />} />
            <Route path="/music" element={<MusicPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ShopProvider>
    </ThemeProvider>
  );
}

export default App;
