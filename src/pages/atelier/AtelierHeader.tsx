import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Menu, Search, ShoppingBag, User } from 'lucide-react';
import { Logo } from '../../components/Logo';
import { SiteSwitch } from '../../components/SiteSwitch';
import { atelierContent } from './content';
import { useShop } from './ShopContext';
import { scrollToCollection } from './scroll';

const ICON = { size: 22, strokeWidth: 1.25 } as const;

/** Desktop: "Search" label that expands into an input. */
function SearchToggle() {
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
        <span>Search</span>
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
        placeholder={atelierContent.searchPlaceholder}
        aria-label="Search the atelier"
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

export function AtelierHeader({ onMenu }: { onMenu: () => void }) {
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
        <div className="ahdr__side">
          <button type="button" className="ahdr__btn" onClick={onMenu} aria-label="Open menu">
            <Menu {...ICON} />
            <span className="ahdr__label">Menu</span>
          </button>
          <SiteSwitch className="siteswitch--bar" />
          <div className="ahdr__desktop">
            <SearchToggle />
          </div>
        </div>

        <Link to="/atelier" className="ahdr__brand" aria-label="JEIGHTEEN atelier">
          <Logo />
          <span className="ahdr__sub">atelier</span>
        </Link>

        <div className="ahdr__side ahdr__side--end">
          <button type="button" className="ahdr__btn ahdr__desktop">
            <span>Contact us</span>
          </button>
          <button type="button" className="ahdr__btn ahdr__desktop" aria-label="Wishlist">
            <Heart {...ICON} />
          </button>
          <button type="button" className="ahdr__btn" aria-label="Account">
            <User {...ICON} />
          </button>
          <button type="button" className="ahdr__btn ahdr__bag" onClick={() => setBagOpen(true)} aria-label={`Bag, ${count} items`}>
            <ShoppingBag {...ICON} />
            <span className="ahdr__badge" aria-hidden="true">
              {count}
            </span>
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
            placeholder={atelierContent.searchPlaceholder}
            aria-label="Search the atelier"
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>
      </div>
    </header>
  );
}
