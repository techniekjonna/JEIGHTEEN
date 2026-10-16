import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { formatPrice, isSoldOut, productPhotos, type Product } from '../../data/products';
import { productPath } from '../../data/categories';
import { useShop } from './ShopContext';
import { useT } from '../../i18n/LanguageContext';

const NEW_DAYS = 30;

/** Small line above the name, like "New" or "Icon" in the reference. */
function useLabel(product: Product): string | undefined {
  const t = useT();
  if (isSoldOut(product)) return t('Sold out', 'Uitverkocht');
  if (product.stock !== undefined && product.stock <= 3) return t('Last pieces', 'Laatste stuks');
  const created = product.createdAt ?? 0;
  if (created > 1e12 && Date.now() - created < NEW_DAYS * 864e5) return t('New', 'Nieuw');
  return undefined;
}

/** Product card like the reference: a light tile with the photo, arrows to browse the photos, heart top right, label, name and price inside the tile. */
export function ProductCard({ product, eager = false, plain = false }: { product: Product; eager?: boolean; /** Homepage look: grey photo tile, name and price under it, no label. */ plain?: boolean }) {
  const { wishlist, toggleWish } = useShop();
  const t = useT();
  const wished = wishlist.has(product.id);
  const photos = productPhotos(product);
  const [index, setIndex] = useState(0);
  const label = useLabel(product);
  const many = photos.length > 1;

  const step = (dir: number) => setIndex((i) => (i + dir + photos.length) % photos.length);

  return (
    <article className={`pcard${plain ? ' pcard--plain' : ''}`}>
      <Link to={productPath(product)} className="pcard__link">
        <div className="pcard__media">
          {photos.map((src, i) => (
            <img
              key={src + i}
              className={`pcard__img${i === index ? ' is-on' : ''}`}
              src={src}
              alt={i === 0 ? product.name : ''}
              aria-hidden={i === 0 ? undefined : true}
              loading={eager && i === 0 ? 'eager' : 'lazy'}
            />
          ))}
        </div>
        <div className="pcard__meta">
          {label && !plain && <p className="pcard__label">{label}</p>}
          <h3 className="pcard__name">{product.name}</h3>
          <p className="pcard__price">{formatPrice(product.price)}</p>
        </div>
      </Link>
      {many && (
        <>
          <button type="button" className="pcard__arrow pcard__arrow--prev" aria-label={t(`Previous photo of ${product.name}`, `Vorige foto van ${product.name}`)} onClick={() => step(-1)}>
            <ChevronLeft size={18} strokeWidth={1.25} />
          </button>
          <button type="button" className="pcard__arrow pcard__arrow--next" aria-label={t(`Next photo of ${product.name}`, `Volgende foto van ${product.name}`)} onClick={() => step(1)}>
            <ChevronRight size={18} strokeWidth={1.25} />
          </button>
        </>
      )}
      <button
        type="button"
        className="pcard__heart"
        aria-pressed={wished}
        aria-label={wished ? t(`Remove ${product.name} from wishlist`, `${product.name} van verlanglijst halen`) : t(`Add ${product.name} to wishlist`, `${product.name} op verlanglijst zetten`)}
        onClick={() => toggleWish(product.id)}
      >
        <Heart size={18} strokeWidth={1.25} fill={wished ? 'currentColor' : 'none'} />
      </button>
    </article>
  );
}

/** Grid of product cards: four tiles edge to edge on wide screens, two on phones. */
export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="pgrid">
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} eager={i < 4} />
      ))}
    </div>
  );
}
