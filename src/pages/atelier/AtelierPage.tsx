import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { MenuDrawer } from '../../components/MenuDrawer';
import { AtelierHeader } from './AtelierHeader';
import { BagDrawer } from './BagDrawer';
import { Hero } from './Hero';
import { ProductGrid } from './ProductGrid';
import { atelierContent } from './content';

/** Demo webshop for JEIGHTEEN ATELIER. Layout follows the reference: transparent header over a full-bleed film, then the selection. */
export function AtelierPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <div className="atelier">
      <AtelierHeader onMenu={() => setMenuOpen(true)} />
      <main>
        <Hero />
        <section className="explore" id="collection">
          <h2 className="explore__title">{atelierContent.exploreTitle}</h2>
          <ProductGrid />
        </section>
      </main>
      <footer className="afoot">
        <span>© JEIGHTEEN ATELIER</span>
        <Link to="/" className="link-line">
          JEIGHTEEN
        </Link>
      </footer>
      <MenuDrawer open={menuOpen} onClose={closeMenu} />
      <BagDrawer />
    </div>
  );
}
