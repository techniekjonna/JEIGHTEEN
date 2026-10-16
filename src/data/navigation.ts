import { categoryPath, useCategories } from './categories';

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
 * ATELIER: the categories managed in the dashboard (see data/categories.ts).
 */
export function useSiteCategories(site: SitePath): NavItem[] {
  const shop = useCategories();
  if (site !== '/atelier') return [];
  return shop.map((c) => ({ to: categoryPath(c), label: c.en, nl: c.nl }));
}
