import { useCallback, useState } from 'react';
import { Logo } from '../components/Logo';
import { MenuDrawer } from '../components/MenuDrawer';
import { SiteBar } from '../components/SiteBar';

/** Placeholder until the music side gets its own design. */
export function MusicPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <div className="stage">
      <SiteBar onMenu={() => setMenuOpen(true)} sites />
      <main className="stage__main">
        <h1 className="stage__logo">
          <Logo />
        </h1>
        <p className="stage__note">
          <span>JEIGHTEEN MUSIC</span>
          <span className="stage__soon">Coming soon</span>
        </p>
      </main>
      <MenuDrawer open={menuOpen} onClose={closeMenu} site="/music" />
    </div>
  );
}
