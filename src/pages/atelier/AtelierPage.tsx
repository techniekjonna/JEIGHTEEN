import { Banner, Hero } from './Hero';
import { Services } from './Services';
import { CategoryTiles } from './CategoryTiles';
import { HomeSelection } from './HomeSelection';
import { AtelierLayout } from './AtelierLayout';
import { atelierContent } from './content';
import { useShop } from './ShopContext';
import { useT } from '../../i18n/LanguageContext';
import { allCategory, categoryPath, inCategory, useShopCategories } from '../../data/categories';

/**
 * ATELIER homepage, laid out like the reference homepage:
 * full-bleed film with two links, "Explore a selection" as a grid of category tiles, a wide image (Second),
 * a curated row (newest pieces) with an outline button, a wide film with pause and sound (Third),
 * a second row (the biggest category), then services, the closing image and the footer.
 */
export function AtelierPage() {
  const t = useT();
  const { products, loaded } = useShop();
  const categories = useShopCategories();

  const newest = products.slice(0, 4);
  const shown = new Set(newest.map((p) => p.id));

  // Second row: the category with the most pieces, without repeating the first row.
  const ranked = categories
    .map((c) => ({ c, items: products.filter((p) => inCategory(c, p) && !shown.has(p.id)) }))
    .sort((a, b) => b.items.length - a.items.length);
  const top = ranked[0]?.items.length ? ranked[0] : undefined;
  const second = top ? top.items : products.slice(4, 8);
  const secondCat = top?.c ?? allCategory;

  return (
    <AtelierLayout overHero description={t('Art and clothing by JEIGHTEEN, made in small editions.', 'Kunst en kleding van JEIGHTEEN, gemaakt in kleine oplage.')}>
      <Hero />

      <section className="hsection hsection--explore" id="collection" aria-labelledby="explore-title">
        <h2 id="explore-title" className="hsection__title hsection__title--soft">
          {t(atelierContent.exploreTitle.en, atelierContent.exploreTitle.nl)}
        </h2>
        {loaded && products.length === 0 ? (
          <p className="grid__empty">{t('The collection is being prepared. Check back soon.', 'De collectie wordt klaargezet. Kom snel terug.')}</p>
        ) : (
          <CategoryTiles />
        )}
      </section>

      <Banner slot="second" layout="full" />

      <HomeSelection
        id="new-title"
        eyebrow={t('Atelier', 'Atelier')}
        title={t('New Arrivals', 'Nieuw binnen')}
        products={newest}
        cta={t('Discover the New Pieces', 'Ontdek de nieuwe stukken')}
        to={categoryPath(allCategory)}
      />

      <Banner slot="third" layout="full" />

      <HomeSelection
        id="second-title"
        eyebrow={t('Collection', 'Collectie')}
        title={t(secondCat.en, secondCat.nl)}
        products={second}
        cta={t('Discover the Collection', 'Ontdek de collectie')}
        to={categoryPath(secondCat)}
      />

      <Services />
      <Banner slot="closing" layout="closing" />
    </AtelierLayout>
  );
}
