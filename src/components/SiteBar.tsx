import { Menu } from 'lucide-react';
import { SiteSwitch } from './SiteSwitch';

interface SiteBarProps {
  onMenu: () => void;
  /** Show "| JEIGHTEEN ATELIER | JEIGHTEEN MUSIC" next to Menu (wide screens). Off on the landing page. */
  sites?: boolean;
}

/** Minimal top banner for the landing page and the music page. The menu inside holds the day/night switch. */
export function SiteBar({ onMenu, sites = false }: SiteBarProps) {
  return (
    <header className="sitebar">
      <button type="button" className="menu-btn" onClick={onMenu} aria-label="Open menu">
        <Menu size={22} strokeWidth={1.25} />
        <span>Menu</span>
      </button>
      {sites && <SiteSwitch className="siteswitch--bar" />}
    </header>
  );
}
