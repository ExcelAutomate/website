// Single source for navigation — items, destinations and the Our-approach
// sub-menu. Adding a page means editing this file only (Build Notes: "do not
// hardcode hrefs in two places").

/** Prefix a root-relative path with the configured Astro `base`, so links
 * keep working on the GitHub Pages project-pages URL (e.g. /website/about/)
 * and need no change when `base` is removed for the custom domain later. */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL; // e.g. '/website/' or '/'
  const trimmedBase = base.endsWith('/') ? base.slice(0, -1) : base;
  const trimmedPath = path.startsWith('/') ? path : `/${path}`;
  return `${trimmedBase}${trimmedPath}`;
}

export type NavLabel = 'Home' | 'Our approach' | 'For non-profits' | 'About';

export const NAV_LINKS: NavLabel[] = ['Home', 'Our approach', 'For non-profits', 'About'];

export const NAV_HREFS: Record<NavLabel, string> = {
  Home: withBase('/'),
  'Our approach': withBase('/our-approach/'),
  'For non-profits': withBase('/for-non-profits/'),
  About: withBase('/about/'),
};

export const CONTACT_HREF = withBase('/contact/');

export const OUR_APPROACH_SUB = [
  { label: 'Key ideas', href: withBase('/our-approach/#key-ideas') },
  { label: 'Modern Excel', href: withBase('/our-approach/#modern-excel') },
  { label: 'Excel tips', href: withBase('/our-approach/#excel-tips') },
  { label: 'Beyond Excel', href: withBase('/our-approach/#beyond-excel') },
];
