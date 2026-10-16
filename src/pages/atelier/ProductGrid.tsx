import { Heart } from 'lucide-react';
import { formatPrice, isSoldOut, type Product } from '../../data/products';
import { useShop } from './ShopContext';
import { useT } from '../../i18n/LanguageContext';

function ProductTile({ product }: { product: Product }) {
  const { add, wishlist, toggleWish } = useShop();
  const t = useT();
  const wished = wishlist.has(product.id);

  return (
    <article className="tile">
      <div className="tile__media">
        {product.image && <img src={product.image} alt={product.name} loading="lazy" />}
        <button
          type="button"
          className="tile__heart"
          aria-pressed={wished}
          aria-label={wished ? t(`Remove ${product.name} from wishlist`, `${product.name} van verlanglijst halen`) : t(`Add ${product.name} to wishlist`, `${product.name} op verlanglijst zetten`)}
          onClick={() => toggleWish(product.id)}
        >
          <Heart size={20} strokeWidth={1.25} fill={wished ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="tile__meta">
        <div>
          <h3 className="tile__name">{product.name}</h3>
          <p className="tile__kind">{product.kind}</p>
        </div>
        <p className="tile__price">{formatPrice(product.price)}</p>
      </div>
      {isSoldOut(product) ? (
        <p className="tile__soldout">{t('Sold out', 'Uitverkocht')}</p>
      ) : (
        <button type="button" className="text-link" onClick={() => add(product.id)}>
          {t('Add to bag', 'In je tas')}
        </button>
      )}
    </article>
  );
}

export function ProductGrid() {
  const { query, products, loaded } = useShop();
  const t = useT();
  const q = query.trim().toLowerCase();
  const shown = q ? products.filter((p) => `${p.name} ${p.kind}`.toLowerCase().includes(q)) : products;

  if (!loaded) return <p className="grid__empty">{t('Loading the collection…', 'De collectie wordt geladen…')}</p>;
  if (products.length === 0) return <p className="grid__empty">{t('The collection is being prepared. Check back soon.', 'De collectie wordt klaargezet. Kom snel terug.')}</p>;
  if (shown.length === 0) return <p className="grid__empty">{t('Nothing found for', 'Niets gevonden voor')} “{query.trim()}”.</p>;
  return (
    <div className="grid">
      {shown.map((p) => (
        <ProductTile key={p.id} product={p} />
      ))}
    </div>
  );
}
