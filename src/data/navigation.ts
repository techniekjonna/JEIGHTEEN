export interface NavItem {
  to: string;
  label: string;
}

/** The two sides of JEIGHTEEN. Shown in the banner (wide screens) or at the top of the menu (narrow screens). */
export const sites: readonly NavItem[] = [
  { to: '/atelier', label: 'JEIGHTEEN ATELIER' },
  { to: '/music', label: 'JEIGHTEEN MUSIC' },
];

export type SitePath = '/atelier' | '/music';

/**
 * Category pages per site, listed in that site's menu under "Home".
 * Empty until the category pages exist — add `{ to: '/atelier/prints', label: 'Prints' }` etc. here.
 */
export const categories: Record<SitePath, readonly NavItem[]> = {
  '/atelier': [],
  '/music': [],
};
