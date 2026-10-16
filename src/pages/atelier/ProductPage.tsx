import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Heart, ChevronRight, PenTool } from 'lucide-react';
import { formatPrice, isSoldOut, productPhotos, productRef, type Product } from '../../data/products';
import { categoryOfKind, categoryPath, useCategories } from '../../data/categories';
import { useT } from '../../i18n/LanguageContext';
import { AtelierLayout } from './AtelierLayout';
import { Carousel } from './Carousel';
import { ProductCard } from './ProductGrid';
import { useShop } from './ShopContext';

const RECENT_KEY = 'jeighteen-recent';

function readRecent(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]') as string[];
  } catch {
    return [];
  }
}

/** Photos: stacked under each other on wide screens (the panel stays next to them), a swipe row with a counter on phones. */
function Gallery({ product }: { product: Product }) {
  const t = useT();
  const photos = productPhotos(product);
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const update = () => setIndex(Math.round(el.scrollLeft / Math.max(el.clientWidth, 1)));
    el.addEventListener('scroll', update, { passive: true });
    return () => el.removeEventListener('scroll', update);
  }, []);

  if (photos.length === 0) return <div className="pdp__gallery"><div className="pdp__photo" /></div>;
  return (
    <div className="pdp__gallery">
      <div ref={track} className="pdp__track">
        {photos.map((src, i) => (
          <div key={src + i} className="pdp__photo">
            <img src={src} alt={i === 0 ? product.name : t(`${product.name}, photo ${i + 1}`, `${product.name}, foto ${i + 1}`)} loading={i === 0 ? 'eager' : 'lazy'} />
          </div>
        ))}
      </div>
      {photos.length > 1 && (
        <p className="pdp__counter" aria-hidden="true">
          {index + 1} / {photos.length}
        </p>
      )}
    </div>
  );
}

/** Description cut off after a few lines with a fade, like the reference, and a "See more" link. */
function Description({ text }: { text: string }) {
  const t = useT();
  const [open, setOpen] = useState(false);
  const long = text.length > 180;
  return (
    <div className="pdp__descwrap">
      <p className={`pdp__desc${long && !open ? ' is-clamped' : ''}`}>{text}</p>
      {long && (
        <button type="button" className="pdp__seemore" aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? t('See less', 'Minder tonen') : t('See more', 'Meer lezen')}
        </button>
      )}
    </div>
  );
}

/** Product page, laid out like the reference: large photos on the left, a sticky panel with reference, name, price, button and details on the right. */
export function ProductPage() {
  const { id } = useParams();
  const t = useT();
  const { products, loaded, add, wishlist, toggleWish } = useShop();
  const product = products.find((p) => p.id === id);
  const categories = useCategories();
  const [recent, setRecent] = useState<string[]>(readRecent);

  useEffect(() => {
    if (!product) return;
    const next = [product.id, ...readRecent().filter((x) => x !== product.id)].slice(0, 12);
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    } catch {
      // not kept, no problem
    }
    setRecent(next);
  }, [product]);

  if (!product) {
    return (
      <AtelierLayout title={t('Not found', 'Niet gevonden')}>
        <div className="pdp__missing">
          <p className="grid__empty">{loaded ? t('This piece is no longer available.', 'Dit stuk is niet meer beschikbaar.') : t('Loading…', 'Laden…')}</p>
          {loaded && (
            <Link to="/atelier/all" className="ulink">
              {t('View all creations', 'Bekijk alle creaties')}
            </Link>
          )}
        </div>
      </AtelierLayout>
    );
  }

  const category = categoryOfKind(categories, product.kind);
  const wished = wishlist.has(product.id);
  const soldOut = isSoldOut(product);
  const fewLeft = product.stock !== undefined && product.stock > 0 && product.stock <= 3;
  const related = products.filter((p) => p.id !== product.id && p.kind === product.kind);
  const others = related.length >= 4 ? related : [...related, ...products.filter((p) => p.id !== product.id && p.kind !== product.kind)];
  const viewed = recent.filter((x) => x !== product.id).map((x) => products.find((p) => p.id === x)).filter((p): p is Product => Boolean(p));

  return (
    <AtelierLayout title={product.name} description={product.description?.slice(0, 155) || `${product.name}, ${product.kind}. JEIGHTEEN ATELIER.`}>
      <div className="pdp">
        <Gallery product={product} />

        <aside className="pdp__panel">
          <div className="pdp__sticky">
            <div className="pdp__top">
              <p className="pdp__ref">{productRef(product)}</p>
              <button
                type="button"
                className="pdp__heart"
                aria-pressed={wished}
                aria-label={wished ? t('Remove from wishlist', 'Van verlanglijst halen') : t('Add to wishlist', 'Op verlanglijst zetten')}
                onClick={() => toggleWish(product.id)}
              >
                <Heart size={22} strokeWidth={1.25} fill={wished ? 'currentColor' : 'none'} />
              </button>
            </div>

            {category && <p className="pdp__line">{t(category.en, category.nl)}</p>}
            <h1 className="pdp__name">{product.name}</h1>
            <p className="pdp__price">{formatPrice(product.price)}</p>

            <div className="pdp__rows">
              {category && (
                <Link to={categoryPath(category)} className="pdp__row">
                  <span className="pdp__rowlabel">{t('Category', 'Categorie')}</span>
                  <span className="pdp__rowvalue">{t(category.en, category.nl)}</span>
                  <ChevronRight size={16} strokeWidth={1.25} aria-hidden="true" />
                </Link>
              )}
              <div className="pdp__row">
                <span className="pdp__rowlabel">{t('Availability', 'Beschikbaarheid')}</span>
                <span className={`pdp__rowvalue${soldOut ? ' is-out' : ''}`}>
                  {soldOut ? t('Sold out', 'Uitverkocht') : fewLeft ? t(`Only ${product.stock} left`, `Nog maar ${product.stock} over`) : t('Available', 'Beschikbaar')}
                  <span className={`pdp__dot${soldOut ? ' is-out' : ''}`} aria-hidden="true" />
                </span>
              </div>
            </div>

            <button type="button" className="pdp__add" disabled={soldOut} onClick={() => add(product.id)}>
              {soldOut ? t('Sold out', 'Uitverkocht') : t('Add to shopping bag', 'In je tas')}
            </button>
            <a href="#contact" className="pdp__advisor">
              {t('Contact the atelier', 'Contact opnemen met het atelier')}
            </a>

            <p className="pdp__note">{t('Checked and packed by hand in the atelier.', 'Met de hand gecontroleerd en ingepakt in het atelier.')}</p>

            {product.description && <Description text={product.description} />}

            <div className="pdp__more">
              <details>
                <summary>{t('Product details', 'Productdetails')}</summary>
                <dl className="pdp__specs">
                  <dt>{t('Reference', 'Referentie')}</dt>
                  <dd>{productRef(product)}</dd>
                  <dt>{t('Category', 'Categorie')}</dt>
                  <dd>{category ? t(category.en, category.nl) : product.kind}</dd>
                  {product.stock !== undefined && (
                    <>
                      <dt>{t('In stock', 'Op voorraad')}</dt>
                      <dd>{product.stock}</dd>
                    </>
                  )}
                </dl>
              </details>
              <details>
                <summary>{t('Delivery & returns', 'Levering en retour')}</summary>
                <p>
                  {t(
                    'Every order is checked and packed by hand in the atelier before it leaves. Questions about delivery or returns? Get in touch and we will help you.',
                    'Elke bestelling wordt in het atelier met de hand gecontroleerd en ingepakt voordat hij vertrekt. Vragen over levering of retour? Neem contact op, dan helpen we je.'
                  )}
                </p>
              </details>
              <details>
                <summary>
                  <PenTool size={16} strokeWidth={1.1} aria-hidden="true" /> {t('Commissions', 'Werk op aanvraag')}
                </summary>
                <p>
                  {t(
                    'Looking for a piece made for you or your space? Get in touch and we will talk it through.',
                    'Op zoek naar een stuk speciaal voor jou of je ruimte? Neem contact op, dan bespreken we het.'
                  )}
                </p>
              </details>
            </div>
          </div>
        </aside>
      </div>

      {others.length > 0 && (
        <section className="hsection" aria-labelledby="like-title">
          <Carousel labelledBy="like-title" title={<h2 id="like-title" className="hsection__title hsection__title--left">{t('You May Also Like', 'Misschien ook mooi')}</h2>}>
            {others.slice(0, 12).map((p) => (
              <div key={p.id} className="carousel__item">
                <ProductCard product={p} />
              </div>
            ))}
          </Carousel>
        </section>
      )}

      {viewed.length > 0 && (
        <section className="hsection hsection--line" aria-labelledby="recent-title">
          <Carousel labelledBy="recent-title" title={<h2 id="recent-title" className="hsection__title hsection__title--left">{t('Recently Viewed', 'Onlangs bekeken')}</h2>}>
            {viewed.map((p) => (
              <div key={p.id} className="carousel__item">
                <ProductCard product={p} />
              </div>
            ))}
          </Carousel>
        </section>
      )}
    </AtelierLayout>
  );
}
