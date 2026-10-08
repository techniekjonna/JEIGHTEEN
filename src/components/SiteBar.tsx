import { Menu } from 'lucide-react';

/** Minimal top banner for the landing page and the music page. The menu inside holds the day/night switch. */
export function SiteBar({ onMenu }: { onMenu: () => void }) {
  return (
    <header className="sitebar">
      <button type="button" className="menu-btn" onClick={onMenu} aria-label="Open menu">
        <Menu size={22} strokeWidth={1.25} />
        <span>Menu</span>
      </button>
    </header>
  );
}
