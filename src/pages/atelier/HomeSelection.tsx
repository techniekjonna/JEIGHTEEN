import { Link } from 'react-router-dom';
import type { Product } from '../../data/products';
import { ProductCard } from './ProductGrid';

/**
 * A curated row on the homepage, like the reference: small eyebrow, centred title,
 * four product tiles with name and price under them, and a rounded outline button.
 */
export function HomeSelection({
  id,
  eyebrow,
  title,
  products,
  cta,
  to,
}: {
  id: string;
  eyebrow: string;
  title: string;
  products: Product[];
  cta: string;
  to: string;
}) {
  if (products.length === 0) return null;
  return (
    <section className="hsel" aria-labelledby={id}>
      <p className="hsel__eyebrow">{eyebrow}</p>
      <h2 id={id} className="hsel__title">
        {title}
      </h2>
      <div className="hsel__grid">
        {products.slice(0, 4).map((p, i) => (
          <ProductCard key={p.id} product={p} plain eager={i < 2} />
        ))}
      </div>
      <div className="hsel__more">
        <Link to={to} className="btn-outline hsel__btn">
          {cta}
        </Link>
      </div>
    </section>
  );
}
