import { NavLink } from 'react-router-dom';
import { Drawer } from './Drawer';
import { ThemeSwitch } from './ThemeSwitch';

interface MenuDrawerProps {
  open: boolean;
  onClose: () => void;
}

/** The site-wide menu. Same drawer on the landing page, the atelier and the music page. */
export function MenuDrawer({ open, onClose }: MenuDrawerProps) {
  return (
    <Drawer open={open} onClose={onClose} side="left" label="Menu" footer={<ThemeSwitch />}>
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
    </Drawer>
  );
}
