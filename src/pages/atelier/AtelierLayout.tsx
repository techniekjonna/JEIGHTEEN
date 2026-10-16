import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { MenuDrawer } from '../../components/MenuDrawer';
import { AtelierHeader } from './AtelierHeader';
import { BagDrawer } from './BagDrawer';
import { AtelierFooter } from './AtelierFooter';
import { AccountDrawer } from './AccountDrawer';

/**
 * Frame shared by every ATELIER page: header, menu (right), sign-in (left), bag and footer.
 * `overHero` = the page starts with a full-bleed film, so the header floats over it.
 */
export function AtelierLayout({ children, overHero = false, title, description }: { children: ReactNode; overHero?: boolean; title?: string; description?: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const closeAccount = useCallback(() => setAccountOpen(false), []);

  useEffect(() => {
    document.title = title ? `${title} | JEIGHTEEN ATELIER` : 'JEIGHTEEN ATELIER';
    const meta = document.querySelector('meta[name="description"]');
    if (meta && description) meta.setAttribute('content', description);
  }, [title, description]);

  return (
    <div className="atelier">
      <AtelierHeader onMenu={() => setMenuOpen(true)} onAccount={() => setAccountOpen(true)} />
      <main className={overHero ? undefined : 'atelier__page'}>{children}</main>
      <AtelierFooter />
      <MenuDrawer open={menuOpen} onClose={closeMenu} site="/atelier" />
      <AccountDrawer open={accountOpen} onClose={closeAccount} />
      <BagDrawer />
    </div>
  );
}
