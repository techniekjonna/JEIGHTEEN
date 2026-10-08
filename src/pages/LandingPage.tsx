import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { MenuDrawer } from '../components/MenuDrawer';
import { SiteBar } from '../components/SiteBar';

export function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <div className="stage">
      <SiteBar onMenu={() => setMenuOpen(true)} />
      <main className="stage__main">
        <h1 className="stage__logo">
          <Logo />
        </h1>
        <nav className="stage__links" aria-label="Sections">
          <Link to="/music" className="link-line">
            JEIGHTEEN MUSIC
          </Link>
          <Link to="/atelier" className="link-line">
            JEIGHTEEN ATELIER
          </Link>
        </nav>
      </main>
      <MenuDrawer open={menuOpen} onClose={closeMenu} />
    </div>
  );
}
