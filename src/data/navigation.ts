import { categories as shopCategories, categoryPath } from './categories';

export interface NavItem {
  to: string;
  label: string;
  /** Dutch label, when it differs. */
  nl?: string;
}

/** The two sides of JEIGHTEEN. Shown in the banner (wide screens) or at the top of the menu (narrow screens). */
export const sites: readonly NavItem[] = [
  { to: '/atelier', label: 'JEIGHTEEN ATELIER' },
  { to: '/music', label: 'JEIGHTEEN MUSIC' },
];

export type SitePath = '/atelier' | '/music';

/**
 * Category pages per site, listed in that site's menu under "Home".
 * ATELIER: one page per product kind (see data/categories.ts).
 */
export const categories: Record<SitePath, readonly NavItem[]> = {
  '/atelier': shopCategories.map((c) => ({ to: categoryPath(c), label: c.en, nl: c.nl })),
  '/music': [],
};
