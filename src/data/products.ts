export interface Product {
  id: string;
  name: string;
  kind: string;
  /** Whole euros. */
  price: number;
  /** Optional photo. Without it the tile shows a neutral placeholder. */
  image?: string;
}

// PLACEHOLDER CATALOGUE — swap for real work. Drop photos in public/products/ and set `image: '/products/xxx.jpg'`.
export const products: Product[] = [
  { id: 'a01', name: 'Untitled 01', kind: 'Print', price: 85 },
  { id: 'a02', name: 'Untitled 02', kind: 'Print', price: 85 },
  { id: 'a03', name: 'Untitled 03', kind: 'Poster', price: 45 },
  { id: 'a04', name: 'Untitled 04', kind: 'Edition', price: 320 },
  { id: 'a05', name: 'Untitled 05', kind: 'Object', price: 180 },
  { id: 'a06', name: 'Untitled 06', kind: 'Print', price: 120 },
  { id: 'a07', name: 'Untitled 07', kind: 'Poster', price: 45 },
  { id: 'a08', name: 'Untitled 08', kind: 'Edition', price: 260 },
];

const euro = new Intl.NumberFormat('en-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
export const formatPrice = (amount: number) => euro.format(amount);
