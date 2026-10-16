import { Link } from 'react-router-dom';
import { categoryPath, inCategory, useShopCategories } from '../../data/categories';
import { productPhotos } from '../../data/products';
import { useT } from '../../i18n/LanguageContext';
import { useShop } from './ShopContext';

/** "Explore a selection": a grid of four tiles per row (two on phones), one per category with its newest photo and the name centred under it, like the reference homepage. */
export function CategoryTiles() {
  const t = useT();
  const { products } = useShop();
  const tiles = useShopCategories()
    .map((c) => {
      const items = products.filter((p) => inCategory(c, p));
      const photo = items.map((p) => productPhotos(p)[0]).find(Boolean);
      return { c, count: items.length, photo };
    })
    .filter((x) => x.count > 0);

  if (tiles.length === 0) return null;
  return (
    <div className="ctiles">
      {tiles.map(({ c, photo }) => (
        <Link key={c.slug} to={categoryPath(c)} className="ctile">
          <div className="ctile__media">{photo && <img src={photo} alt={t(c.en, c.nl)} loading="lazy" />}</div>
          <span className="ctile__label">{t(c.en, c.nl)}</span>
        </Link>
      ))}
    </div>
  );
}
