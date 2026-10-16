import { useSyncExternalStore } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { firebase, firebaseReady } from '../lib/firebase';
import type { Product } from './products';

/**
 * Shop categories. Managed in the dashboard (Categorieën) and stored in Firestore atelier_settings/categories.
 * `kind` is the key saved on each product; it never changes, so renaming a category keeps its products.
 * The slug is the web address: /atelier/<slug>.
 */
export interface Category {
  slug: string;
  /** Product kind it shows; undefined = everything. */
  kind?: string;
  en: string;
  nl: string;
}

/** A real category (not "all"). */
export type ShopCategory = Category & { kind: string };

export const allCategory: Category = { slug: 'all', en: 'All Creations', nl: 'Alle creaties' };

/** Used until the dashboard has saved its own list. */
export const defaultCategories: ShopCategory[] = [
  { kind: 'Artwork', slug: 'artworks', en: 'Artworks', nl: 'Kunstwerken' },
  { kind: 'Print', slug: 'prints', en: 'Prints', nl: 'Prints' },
  { kind: 'Poster', slug: 'posters', en: 'Posters', nl: 'Posters' },
  { kind: 'Apparel', slug: 'apparel', en: 'Clothing', nl: 'Kleding' },
  { kind: 'Merch', slug: 'merch', en: 'Merch', nl: 'Merch' },
  { kind: 'Object', slug: 'objects', en: 'Objects', nl: 'Objecten' },
];

/** Addresses the shop already uses, so a category can never take them. */
const RESERVED = new Set(['all', 'dashboard', 'product']);

export function slugify(text: string): string {
  return (
    text
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 40) || 'categorie'
  );
}

/** A free slug for a category, not used by another one and not reserved. */
export function freeSlug(wanted: string, others: ShopCategory[]): string {
  const base = slugify(wanted);
  let slug = base;
  for (let i = 2; RESERVED.has(slug) || others.some((c) => c.slug === slug); i++) slug = `${base}-${i}`;
  return slug;
}

// ---- live list (one listener for the whole site) ----

const DEMO_KEY = 'jeighteen-demo:atelier_categories';
let current: ShopCategory[] = defaultCategories;
let started = false;
let ready = false;
const subscribers = new Set<() => void>();
const emit = (list: ShopCategory[]) => {
  ready = true;
  current = list.length ? list : defaultCategories;
  subscribers.forEach((fn) => fn());
};

function clean(raw: unknown): ShopCategory[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((c): c is ShopCategory => Boolean(c && typeof c.kind === 'string' && typeof c.slug === 'string'))
    .map((c) => ({ kind: c.kind, slug: c.slug, en: c.en || c.nl || c.kind, nl: c.nl || c.en || c.kind }));
}

function start() {
  if (started) return;
  started = true;
  if (!firebaseReady) {
    const read = () => {
      try {
        emit(clean(JSON.parse(localStorage.getItem(DEMO_KEY) || '[]')));
      } catch {
        emit([]);
      }
    };
    read();
    window.addEventListener('storage', (e) => e.key === DEMO_KEY && read());
    return;
  }
  onSnapshot(
    doc(firebase().db, 'atelier_settings', 'categories'),
    (snap) => emit(clean(snap.data()?.list)),
    () => emit([])
  );
}

function subscribe(fn: () => void) {
  start();
  subscribers.add(fn);
  return () => subscribers.delete(fn);
}

/** The shop categories (without "all"), live. */
export function useShopCategories(): ShopCategory[] {
  return useSyncExternalStore(subscribe, () => current);
}

/** True once the saved list has arrived (before that, the defaults are shown). */
export function useCategoriesReady(): boolean {
  return useSyncExternalStore(subscribe, () => ready);
}

/** "All" plus every shop category, live. */
export function useCategories(): Category[] {
  const list = useShopCategories();
  return [allCategory, ...list];
}

export async function saveCategories(list: ShopCategory[]): Promise<void> {
  const data = list.map(({ kind, slug, en, nl }) => ({ kind, slug, en: en.trim(), nl: nl.trim() }));
  if (!firebaseReady) {
    localStorage.setItem(DEMO_KEY, JSON.stringify(data));
    emit(data);
    return;
  }
  await setDoc(doc(firebase().db, 'atelier_settings', 'categories'), { list: data, updatedAt: Date.now() });
}

// ---- helpers ----

export const categoryBySlug = (list: Category[], slug: string | undefined) => list.find((c) => c.slug === slug);
export const categoryOfKind = (list: Category[], kind: string) => list.find((c) => c.kind === kind);
export const inCategory = (c: Category, p: Product) => !c.kind || p.kind === c.kind;
export const categoryPath = (c: Category) => `/atelier/${c.slug}`;
export const productPath = (p: Product) => `/atelier/product/${p.id}`;
