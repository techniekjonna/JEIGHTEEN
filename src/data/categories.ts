import { productKinds, type Product } from './products';

/** A shop category: one per product kind, plus "all". The slug is the web address: /atelier/<slug>. */
export interface Category {
  slug: string;
  /** Product kind it shows; undefined = everything. */
  kind?: string;
  en: string;
  nl: string;
}

const labels: Record<string, { slug: string; en: string; nl: string }> = {
  Artwork: { slug: 'artworks', en: 'Artworks', nl: 'Kunstwerken' },
  Print: { slug: 'prints', en: 'Prints', nl: 'Prints' },
  Poster: { slug: 'posters', en: 'Posters', nl: 'Posters' },
  Apparel: { slug: 'apparel', en: 'Clothing', nl: 'Kleding' },
  Merch: { slug: 'merch', en: 'Merch', nl: 'Merch' },
  Object: { slug: 'objects', en: 'Objects', nl: 'Objecten' },
};

export const allCategory: Category = { slug: 'all', en: 'All Creations', nl: 'Alle creaties' };

export const categories: Category[] = [
  allCategory,
  ...productKinds.map((kind) => ({ kind, ...(labels[kind] ?? { slug: kind.toLowerCase(), en: kind, nl: kind }) })),
];

export const categoryBySlug = (slug: string | undefined) => categories.find((c) => c.slug === slug);
export const categoryOfKind = (kind: string) => categories.find((c) => c.kind === kind);
export const inCategory = (c: Category, p: Product) => !c.kind || p.kind === c.kind;
export const categoryPath = (c: Category) => `/atelier/${c.slug}`;
export const productPath = (p: Product) => `/atelier/product/${p.id}`;
