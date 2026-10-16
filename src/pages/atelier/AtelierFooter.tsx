import { Link } from 'react-router-dom';
import { Logo } from '../../components/Logo';
import { LanguageToggle } from '../../components/LanguageToggle';
import { categories, categoryPath } from '../../data/categories';
import { useT } from '../../i18n/LanguageContext';
import { useShop } from './ShopContext';

/** Footer like the reference: four columns, a bottom bar with country and language, and the logo large at the bottom. */
export function AtelierFooter() {
  const t = useT();
  const { setBagOpen, products } = useShop();
  const shop = categories.filter((c) => !c.kind || products.some((p) => p.kind === c.kind));

  return (
    <footer className="afoot" id="contact">
      <div className="afoot__cols">
        <nav className="afoot__col" aria-labelledby="f-shop">
          <h2 id="f-shop" className="afoot__head">{t('Shop', 'Shop')}</h2>
          {shop.map((c) => (
            <Link key={c.slug} to={categoryPath(c)}>
              {t(c.en, c.nl)}
            </Link>
          ))}
          <button type="button" onClick={() => setBagOpen(true)}>
            {t('Your Bag', 'Je tas')}
          </button>
        </nav>
        <div className="afoot__col">
          <h2 className="afoot__head">{t('Services', 'Services')}</h2>
          <p>{t('Small editions', 'Kleine oplage')}</p>
          <p>{t('Packed by hand', 'Met de hand ingepakt')}</p>
          <p>{t('Commissions', 'Werk op aanvraag')}</p>
        </div>
        <nav className="afoot__col" aria-labelledby="f-j18">
          <h2 id="f-j18" className="afoot__head">JEIGHTEEN</h2>
          <Link to="/atelier">JEIGHTEEN ATELIER</Link>
          <Link to="/music">JEIGHTEEN MUSIC</Link>
          <Link to="/">{t('Home', 'Start')}</Link>
        </nav>
        <div className="afoot__col">
          <h2 className="afoot__head">{t('The Atelier', 'Het atelier')}</h2>
          <p>{t('Art and clothing from the world of JEIGHTEEN, made in small editions.', 'Kunst en kleding uit de wereld van JEIGHTEEN, gemaakt in kleine oplage.')}</p>
        </div>
      </div>

      <div className="afoot__bar">
        <p className="afoot__country">
          {t('Netherlands', 'Nederland')} <LanguageToggle className="afoot__lang" />
        </p>
        <p className="afoot__legal">© {new Date().getFullYear()} JEIGHTEEN ATELIER</p>
      </div>

      <div className="afoot__brand" aria-hidden="true">
        <Logo />
      </div>
    </footer>
  );
}
