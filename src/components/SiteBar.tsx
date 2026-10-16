import { Menu } from 'lucide-react';
import { SiteSwitch } from './SiteSwitch';
import { LanguageToggle } from './LanguageToggle';
import { useT } from '../i18n/LanguageContext';

interface SiteBarProps {
  onMenu: () => void;
  /** Show "JEIGHTEEN ATELIER | JEIGHTEEN MUSIC" (wide screens). Off on the landing page. */
  sites?: boolean;
}

/** Minimal top banner for the landing page and the music page: sites, NL/EN and Menu on the right. */
export function SiteBar({ onMenu, sites = false }: SiteBarProps) {
  const t = useT();
  return (
    <header className="sitebar">
      {sites && <SiteSwitch className="siteswitch--bar" />}
      <LanguageToggle />
      <button type="button" className="menu-btn" onClick={onMenu} aria-label={t('Open menu', 'Menu openen')}>
        <span>Menu</span>
        <Menu size={22} strokeWidth={1.25} />
      </button>
    </header>
  );
}
