import { useCallback, useState } from 'react';
import { MenuDrawer } from '../../components/MenuDrawer';
import { AtelierHeader } from './AtelierHeader';
import { BagDrawer } from './BagDrawer';
import { Banner, Hero } from './Hero';
import { Services } from './Services';
import { AtelierFooter } from './AtelierFooter';
import { ProductGrid } from './ProductGrid';
import { atelierContent } from './content';
import { AccountDrawer } from './AccountDrawer';
import { useT } from '../../i18n/LanguageContext';

/** Demo webshop for JEIGHTEEN ATELIER. Layout follows the reference: transparent header over a full-bleed film, then the selection, a wide image, a split image with text, services, a closing image and the footer. */
export function AtelierPage() {
  const t = useT();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const closeAccount = useCallback(() => setAccountOpen(false), []);

  return (
    <div className="atelier">
      <AtelierHeader onMenu={() => setMenuOpen(true)} onAccount={() => setAccountOpen(true)} />
      <main>
        <Hero />
        <section className="explore" id="collection">
          <h2 className="explore__title">{t(atelierContent.exploreTitle.en, atelierContent.exploreTitle.nl)}</h2>
          <ProductGrid />
        </section>
        <Banner slot="second" layout="full" />
        <Banner slot="third" layout="split" />
        <Services />
        <Banner slot="closing" layout="closing" />
      </main>
      <AtelierFooter />
      <MenuDrawer open={menuOpen} onClose={closeMenu} site="/atelier" />
      <AccountDrawer open={accountOpen} onClose={closeAccount} />
      <BagDrawer />
    </div>
  );
}
