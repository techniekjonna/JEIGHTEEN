import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, NavLink, useParams } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import { Drawer } from '../../components/Drawer';
import { categories, categoryBySlug, categoryPath, inCategory } from '../../data/categories';
import { isSoldOut } from '../../data/products';
import { useT } from '../../i18n/LanguageContext';
import { AtelierLayout } from './AtelierLayout';
import { ProductGrid } from './ProductGrid';
import { useShop } from './ShopContext';

type Sort = 'new' | 'price-asc' | 'price-desc';
const PAGE = 24;

/** Category page, laid out like the reference: title and count, a row of categories, a sticky bar with filter and sort, the grid and "load more". */
export function CategoryPage() {
  const { slug } = useParams();
  const category = categoryBySlug(slug);
  const t = useT();
  const { products, loaded, query, setQuery } = useShop();
  const [sort, setSort] = useState<Sort>('new');
  const [available, setAvailable] = useState(false);
  const [shown, setShown] = useState(PAGE);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => setShown(PAGE), [slug, sort, available, query]);

  const q = query.trim().toLowerCase();
  const list = useMemo(() => {
    if (!category) return [];
    const items = products.filter((p) => inCategory(category, p) && (!available || !isSoldOut(p)) && (!q || `${p.name} ${p.kind} ${p.description ?? ''}`.toLowerCase().includes(q)));
    if (sort === 'price-asc') return [...items].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') return [...items].sort((a, b) => b.price - a.price);
    return items;
  }, [products, category, available, q, sort]);

  if (!category) return <Navigate to="/atelier" replace />;

  const name = t(category.en, category.nl);
  const activeFilters = (available ? 1 : 0) + (sort !== 'new' ? 1 : 0) + (q ? 1 : 0);
  const chips = categories.filter((c) => !c.kind || products.some((p) => inCategory(c, p)));

  return (
    <AtelierLayout title={name} description={t(`${category.en} by JEIGHTEEN ATELIER, made in small editions.`, `${category.nl} van JEIGHTEEN ATELIER, gemaakt in kleine oplage.`)}>
      <h1 className="sr-only">{name}</h1>
      <nav className="plp__tabs" aria-label={t('Categories', 'Categorieën')}>
        {chips.map((c) => (
          <NavLink key={c.slug} to={categoryPath(c)} className="plp__tab" end>
            {t(c.en, c.nl)}
          </NavLink>
        ))}
      </nav>

      <section className="plp__grid" aria-label={name}>
        {!loaded ? (
          <p className="grid__empty">{t('Loading the collection…', 'De collectie wordt geladen…')}</p>
        ) : list.length === 0 ? (
          <div className="plp__empty">
            <p className="grid__empty">{q ? `${t('Nothing found for', 'Niets gevonden voor')} “${query.trim()}”.` : t('Nothing here yet. Check back soon.', 'Hier staat nog niets. Kom snel terug.')}</p>
            <Link to="/atelier/all" className="ulink" onClick={() => setQuery('')}>
              {t('View all creations', 'Bekijk alle creaties')}
            </Link>
          </div>
        ) : (
          <>
            <ProductGrid products={list.slice(0, shown)} />
            {shown < list.length && (
              <div className="plp__more">
                <p>
                  {t(`${Math.min(shown, list.length)} of ${list.length} items`, `${Math.min(shown, list.length)} van ${list.length} items`)}
                </p>
                <button type="button" className="btn-outline" onClick={() => setShown((n) => n + PAGE)}>
                  {t('Load more', 'Meer laden')}
                </button>
              </div>
            )}
          </>
        )}
      </section>

      <button type="button" className="plp__fab" onClick={() => setFiltersOpen(true)} aria-haspopup="dialog">
        <SlidersHorizontal size={15} strokeWidth={1.5} aria-hidden="true" />
        {t('Filters', 'Filters')}
        {activeFilters > 0 && ` (${activeFilters})`}
      </button>

      <Drawer open={filtersOpen} onClose={() => setFiltersOpen(false)} side="right" label={t('Filters', 'Filters')} closeLabel={t('Close filters', 'Filters sluiten')}
        footer={
          <div className="plp__drawerfoot">
            <button type="button" className="ulink" onClick={() => { setAvailable(false); setSort('new'); setQuery(''); }}>
              {t('Clear all', 'Alles wissen')}
            </button>
            <button type="button" className="plp__apply" onClick={() => setFiltersOpen(false)}>
              {t(`Show ${list.length} items`, `Toon ${list.length} items`)}
            </button>
          </div>
        }
      >
        <div className="plp__filters">
          {q && (
            <button type="button" className="plp__query" onClick={() => setQuery('')} aria-label={t('Clear search', 'Zoekopdracht wissen')}>
              “{query.trim()}” <X size={14} />
            </button>
          )}
          <fieldset className="plp__group">
            <legend>{t('Sort by', 'Sorteer op')}</legend>
            {([
              ['new', t('Newest', 'Nieuwste')],
              ['price-asc', t('Price: low to high', 'Prijs: laag naar hoog')],
              ['price-desc', t('Price: high to low', 'Prijs: hoog naar laag')],
            ] as [Sort, string][]).map(([value, text]) => (
              <label key={value} className="plp__opt">
                <input type="radio" name="sort" checked={sort === value} onChange={() => setSort(value)} />
                <span>{text}</span>
              </label>
            ))}
          </fieldset>
          <fieldset className="plp__group">
            <legend>{t('Availability', 'Beschikbaarheid')}</legend>
            <label className="plp__opt">
              <input type="checkbox" checked={available} onChange={(e) => setAvailable(e.target.checked)} />
              <span>{t('Available only', 'Alleen beschikbaar')}</span>
            </label>
          </fieldset>
        </div>
      </Drawer>
    </AtelierLayout>
  );
}
