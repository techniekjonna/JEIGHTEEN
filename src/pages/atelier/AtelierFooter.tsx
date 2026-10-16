import { Link } from 'react-router-dom';
import { Logo } from '../../components/Logo';
import { useT } from '../../i18n/LanguageContext';
import { useShop } from './ShopContext';
import { scrollToCollection } from './scroll';

/** Footer in columns, like the reference, with the logo large at the bottom. */
export function AtelierFooter() {
  const t = useT();
  const { setBagOpen } = useShop();

  return (
    <footer className="afoot">
      <div className="afoot__cols">
        <nav className="afoot__col" aria-label={t('Shop', 'Shop')}>
          <h2 className="afoot__head">{t('Shop', 'Shop')}</h2>
          <button type="button" onClick={scrollToCollection}>
            {t('The Collection', 'De collectie')}
          </button>
          <button type="button" onClick={() => setBagOpen(true)}>
            {t('Your Bag', 'Je tas')}
          </button>
        </nav>
        <nav className="afoot__col" aria-label="JEIGHTEEN">
          <h2 className="afoot__head">JEIGHTEEN</h2>
          <Link to="/atelier">JEIGHTEEN ATELIER</Link>
          <Link to="/music">JEIGHTEEN MUSIC</Link>
          <Link to="/">{t('Home', 'Start')}</Link>
        </nav>
        <div className="afoot__col">
          <h2 className="afoot__head">{t('The Atelier', 'Het atelier')}</h2>
          <p>{t('Art and clothing from the world of JEIGHTEEN, made in small editions.', 'Kunst en kleding uit de wereld van JEIGHTEEN, gemaakt in kleine oplage.')}</p>
        </div>
      </div>
      <div className="afoot__brand" aria-hidden="true">
        <Logo />
      </div>
      <p className="afoot__legal">© {new Date().getFullYear()} JEIGHTEEN ATELIER</p>
    </footer>
  );
}
