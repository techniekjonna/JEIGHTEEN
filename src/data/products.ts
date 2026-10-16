import type { Entry } from '../lib/store';

/** Kinds for the atelier. Shown under the name in the shop. */
export const productKinds = ['Artwork', 'Print', 'Poster', 'Apparel', 'Merch', 'Object'] as const;

export interface Product extends Entry {
  name: string;
  kind: string;
  /** Euros, cents allowed. */
  price: number;
  description?: string;
  /** Main photo: shown in the grid and first on the product page. */
  image?: string;
  /** Extra photos for the product page gallery (and the second photo on hover in the grid). */
  images?: string[];
  /** Pieces left. Empty = no limit, 0 = sold out. */
  stock?: number;
}

// Demo catalogue, only used while Firebase is not connected (and only until something is edited in the dashboard).
export const demoProducts: Product[] = [
  { name: 'Untitled 01', kind: 'Print', price: 85 },
  { name: 'Untitled 02', kind: 'Print', price: 85 },
  { name: 'Untitled 03', kind: 'Poster', price: 45 },
  { name: 'Untitled 04', kind: 'Artwork', price: 320 },
  { name: 'Untitled 05', kind: 'Object', price: 180 },
  { name: 'Untitled 06', kind: 'Apparel', price: 65 },
  { name: 'Untitled 07', kind: 'Merch', price: 25 },
  { name: 'Untitled 08', kind: 'Artwork', price: 260 },
].map((p, i) => ({ ...p, id: `demo-${i + 1}`, published: true, createdAt: 100 - i }));

const whole = new Intl.NumberFormat('en-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
const cents = new Intl.NumberFormat('en-NL', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 });
export const formatPrice = (amount: number) => (Number.isInteger(amount) ? whole : cents).format(amount);

export const isSoldOut = (p: Product) => p.stock === 0;

/** All photos of a product, main photo first. */
export const productPhotos = (p: Product): string[] => [p.image, ...(p.images ?? [])].filter((u): u is string => Boolean(u));

/** Short reference shown on the product page, like a style number. */
export const productRef = (p: Product) => `J18-${p.id.replace(/[^a-z0-9]/gi, '').slice(-6).toUpperCase()}`;
