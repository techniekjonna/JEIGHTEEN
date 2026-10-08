import { Heart } from 'lucide-react';
import { formatPrice, products, type Product } from '../../data/products';
import { useShop } from './ShopContext';

function ProductTile({ product }: { product: Product }) {
  const { add, wishlist, toggleWish } = useShop();
  const wished = wishlist.has(product.id);

  return (
    <article className="tile">
      <div className="tile__media">
        {product.image && <img src={product.image} alt={product.name} loading="lazy" />}
        <button
          type="button"
          className="tile__heart"
          aria-pressed={wished}
          aria-label={wished ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
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
      <button type="button" className="text-link" onClick={() => add(product.id)}>
        Add to bag
      </button>
    </article>
  );
}

export function ProductGrid() {
  const { query } = useShop();
  const q = query.trim().toLowerCase();
  const shown = q ? products.filter((p) => `${p.name} ${p.kind}`.toLowerCase().includes(q)) : products;

  if (shown.length === 0) return <p className="grid__empty">Nothing found for “{query.trim()}”.</p>;
  return (
    <div className="grid">
      {shown.map((p) => (
        <ProductTile key={p.id} product={p} />
      ))}
    </div>
  );
}
