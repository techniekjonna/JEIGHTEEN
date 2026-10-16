import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Menu, Search, ShoppingBag, User } from 'lucide-react';
import { Logo } from '../../components/Logo';
import { SiteSwitch } from '../../components/SiteSwitch';
import { LanguageToggle } from '../../components/LanguageToggle';
import { useT } from '../../i18n/LanguageContext';
import { atelierContent } from './content';
import { useShop } from './ShopContext';
import { scrollToCollection } from './scroll';

const ICON = { size: 22, strokeWidth: 1.25 } as const;

/** Desktop: "Search" label that expands into an input. */
function SearchToggle() {
  const t = useT();
  const { query, setQuery } = useShop();
  const [open, setOpen] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) input.current?.focus();
  }, [open]);

  if (!open) {
    return (
      <button type="button" className="ahdr__btn ahdr__btn--search" onClick={() => setOpen(true)}>
        <Search {...ICON} />
        <span>{t('Search', 'Zoeken')}</span>
      </button>
    );
  }
  return (
    <form
      className="ahdr__search"
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        scrollToCollection();
      }}
    >
      <Search {...ICON} />
      <input
        ref={input}
        type="search"
        value={query}
        placeholder={t(atelierContent.searchPlaceholder.en, atelierContent.searchPlaceholder.nl)}
        aria-label={t('Search the atelier', 'Zoek in het atelier')}
        onChange={(e) => setQuery(e.target.value)}
        onBlur={() => !query && setOpen(false)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            setQuery('');
            setOpen(false);
          }
        }}
      />
    </form>
  );
}

export function AtelierHeader({ onMenu, onAccount }: { onMenu: () => void; onAccount: () => void }) {
  const t = useT();
  const { count, setBagOpen, query, setQuery } = useShop();
  const header = useRef<HTMLElement>(null);
  const [solid, setSolid] = useState(false);

  // Transparent over the hero (logo inverts against the film); solid once the hero has scrolled away.
  useEffect(() => {
    const update = () => {
      const hero = document.querySelector('[data-hero]');
      const height = header.current?.offsetHeight ?? 0;
      setSolid(hero ? hero.getBoundingClientRect().bottom <= height : true);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <header ref={header} className={`ahdr${solid ? ' is-solid' : ''}`}>
      <div className="ahdr__row">
        {/* Left: account (opens the sign-in panel from the left), wishlist, contact and search. */}
        <div className="ahdr__side">
          <button type="button" className="ahdr__btn" onClick={onAccount} aria-label={t('Sign in', 'Inloggen')} title={t('Sign in', 'Inloggen')}>
            <User {...ICON} />
          </button>
          <button type="button" className="ahdr__btn ahdr__desktop" aria-label={t('Wishlist', 'Verlanglijst')}>
            <Heart {...ICON} />
          </button>
          <button type="button" className="ahdr__btn ahdr__desktop">
            <span>{t('Contact us', 'Contact')}</span>
          </button>
          <div className="ahdr__desktop">
            <SearchToggle />
          </div>
        </div>

        <Link to="/atelier" className="ahdr__brand" aria-label="JEIGHTEEN atelier">
          <Logo />
        </Link>

        {/* Right: the two sites (wide screens), bag, NL/EN and the menu (opens from the right). */}
        <div className="ahdr__side ahdr__side--end">
          <SiteSwitch className="siteswitch--bar" />
          <button type="button" className="ahdr__btn ahdr__bag" onClick={() => setBagOpen(true)} aria-label={t(`Bag, ${count} items`, `Tas, ${count} items`)}>
            <ShoppingBag {...ICON} />
            <span className="ahdr__badge" aria-hidden="true">
              {count}
            </span>
          </button>
          <LanguageToggle className="ahdr__btn" />
          <button type="button" className="ahdr__btn" onClick={onMenu} aria-label={t('Open menu', 'Menu openen')}>
            <span className="ahdr__label">Menu</span>
            <Menu {...ICON} />
          </button>
        </div>
      </div>

      <div className="ahdr__mobile">
        <form
          className="ahdr__pill"
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            scrollToCollection();
          }}
        >
          <input
            type="search"
            value={query}
            placeholder={t(atelierContent.searchPlaceholder.en, atelierContent.searchPlaceholder.nl)}
            aria-label={t('Search the atelier', 'Zoek in het atelier')}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>
      </div>
    </header>
  );
}
