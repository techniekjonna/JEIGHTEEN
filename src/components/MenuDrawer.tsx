import { Link, NavLink } from 'react-router-dom';
import { categories, type SitePath } from '../data/navigation';
import { Drawer } from './Drawer';
import { Mark } from './Mark';
import { SiteSwitch } from './SiteSwitch';
import { ThemeSwitch } from './ThemeSwitch';

interface MenuDrawerProps {
  open: boolean;
  onClose: () => void;
  /**
   * Set on the atelier / music pages. There the two sites live in the banner next to "Menu"
   * (wide screens) and the menu lists that site's category pages. Without it (landing page)
   * the menu is the plain hub: Home plus both sites.
   */
  site?: SitePath;
}

/** The site-wide menu. The monogram in the header links home. */
export function MenuDrawer({ open, onClose, site }: MenuDrawerProps) {
  const heading = (
    <Link to="/" className="drawer__mark" onClick={onClose} aria-label="JEIGHTEEN, home">
      <Mark />
    </Link>
  );

  return (
    <Drawer open={open} onClose={onClose} side="left" label="Menu" heading={heading} footer={<ThemeSwitch />}>
      {site ? (
        <>
          {/* The banner shows these on wide screens; on narrow screens they sit here instead. */}
          <SiteSwitch className="siteswitch--drawer" onNavigate={onClose} />
          <nav className="menu-nav" aria-label="Main">
            <NavLink to="/" end onClick={onClose}>
              Home
            </NavLink>
            {categories[site].map((item) => (
              <NavLink key={item.to} to={item.to} onClick={onClose}>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </>
      ) : (
        <nav className="menu-nav" aria-label="Main">
          <NavLink to="/" end onClick={onClose}>
            Home
          </NavLink>
          <NavLink to="/atelier" onClick={onClose}>
            JEIGHTEEN ATELIER
          </NavLink>
          <NavLink to="/music" onClick={onClose}>
            JEIGHTEEN MUSIC
          </NavLink>
        </nav>
      )}
    </Drawer>
  );
}
