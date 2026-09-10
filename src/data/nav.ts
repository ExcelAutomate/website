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

// "Learn more" is the nav label; the page it points to keeps its own
// identity otherwise (title "Our approach - Excel Automate | Hobart", h1
// "Our approach to Excel") - the label is an invitation, the title says what
// the page is about. Don't sync those (Changes - 10 September 2026.md, #2).
// The route itself *did* move, 2026-09-10: /our-approach/ -> /learn-more/,
// to match the nav label - see DECISIONS.md. The page folder is
// src/pages/learn-more/; content still lives in src/content/articles/
// (collection folder names aren't part of the URL, so that didn't need to
// move) and OUR_APPROACH_SUB below keeps its name since it's still the
// Our-approach page's submenu, just reached at a new address.
export type NavLabel = 'Home' | 'For non-profits' | 'Learn more' | 'About';

export const NAV_LINKS: NavLabel[] = ['Home', 'For non-profits', 'Learn more', 'About'];

export const NAV_HREFS: Record<NavLabel, string> = {
  Home: withBase('/'),
  'For non-profits': withBase('/for-non-profits/'),
  'Learn more': withBase('/learn-more/'),
  About: withBase('/about/'),
};

export const CONTACT_HREF = withBase('/contact/');

// Key ideas has no hash: its panel carries no heading of its own, so jumping
// straight to it reads as landing mid-page - every route in here sends
// visitors to the top of the Our-approach page instead (Header.astro
// intercepts the click when already on that page and scrolls smoothly;
// arriving from elsewhere just lands at the top naturally, see
// data/sections.ts TOP_SECTION_ID and Changes - 10 September 2026.md, #9).
export const OUR_APPROACH_SUB = [
  { label: 'Key ideas', href: withBase('/learn-more/') },
  { label: 'Modern Excel', href: withBase('/learn-more/#modern-excel') },
  { label: 'Excel tips', href: withBase('/learn-more/#excel-tips') },
  { label: 'Beyond Excel', href: withBase('/learn-more/#beyond-excel') },
];
