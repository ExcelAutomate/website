// Our-approach page: sticky section nav highlight + menu-jump scrolling.
//
// The design reference needed a scroll-position/module-scope workaround here
// because its runtime replaces DOM nodes on re-render (see docs/Design
// Decisions - Our approach page.md). A static Astro page has stable nodes,
// so a plain IntersectionObserver is the right tool — per Build Notes'
// explicit instruction to use one in production.

// Remembers where on this page a tile was clicked from, so the article's
// back link can return to the same scroll position instead of the top of
// the page — matching the design reference's `_returnScroll` behaviour.
// This key is also read (and cleared) by src/scripts/article-nav.js, which
// runs on the article page itself: clicking an article-to-article link
// there (the end-of-article CTA, or an inline link) deliberately clears it,
// so a chained "What's Modern Excel?" → "Why Power Query?" visit falls back
// to the section heading on the way back, rather than a stale position from
// two hops ago. Keep the key literal in sync between both files.
const RETURN_SCROLL_KEY = 'oa-return-scroll';

// Key ideas carries no heading of its own (the page h1 does that job), so a
// #key-ideas deep link should land at the top of the page, not the panel —
// same rule as the header dropdown and side nav (see data/sections.ts'
// TOP_SECTION_ID and Header.astro's matching same-page click-intercept).
// This is a plain script with no module graph, so it can't import the
// constant from sections.ts — keep this literal in sync with SECTIONS[0].id
// if that ever changes (Changes - 10 September 2026.md, #9).
const TOP_SECTION_ID = 'key-ideas';

// Re-applies `fn` at a staggered spread of delays, plus once more after web
// fonts finish loading. A single re-apply around 250ms isn't always enough —
// Manrope loads with font-display: swap, and some browsers re-correct a
// fragment scroll after a late font swap reflows the page, which can win the
// race against an early restore (same class of problem as carousel.js's
// alignHero() re-measurement, see its comment for the fuller explanation).
function persistScroll(fn) {
  fn();
  [60, 250, 600].forEach((t) => setTimeout(fn, t));
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(fn);
  }
}

function initTileScrollMemory() {
  document.querySelectorAll('.approach-tile').forEach((tile) => {
    tile.addEventListener('click', () => {
      sessionStorage.setItem(RETURN_SCROLL_KEY, String(window.scrollY));
    });
  });

  // On arriving here (via a tile's back link, or any other route back to
  // this page), restore a remembered position if one was left.
  const remembered = sessionStorage.getItem(RETURN_SCROLL_KEY);
  if (remembered !== null) {
    sessionStorage.removeItem(RETURN_SCROLL_KEY);
    const top = Number(remembered);
    persistScroll(() => window.scrollTo({ top, behavior: 'auto' }));
    return;
  }

  // Nothing remembered — cleared by an inter-article link, or this is a
  // fresh/direct visit. The browser's own scroll to the #section-id anchor
  // in the URL (already run before this script executes) stands as the
  // fallback landing spot, except for #key-ideas: override that one back to
  // the top, same staggered re-apply to beat the native anchor scroll.
  if (location.hash === '#' + TOP_SECTION_ID) {
    persistScroll(() => window.scrollTo({ top: 0, behavior: 'auto' }));
  }
}

function initSectionNav() {
  const navLinks = Array.from(document.querySelectorAll('[data-section-nav-link]'));
  const sections = Array.from(document.querySelectorAll('[data-approach-section]'));
  if (navLinks.length === 0 || sections.length === 0) return;

  function setActive(id) {
    navLinks.forEach((link) => {
      const on = link.getAttribute('data-section-nav-link') === id;
      link.classList.toggle('active', on);
    });
  }

  // The header is sticky and ~110px tall with breathing room, so a section
  // only counts as "current" once it's past that line, not merely visible.
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      });
    },
    { rootMargin: '-110px 0px -70% 0px', threshold: 0 }
  );
  sections.forEach((s) => io.observe(s));

  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('data-section-nav-link');
      // Key ideas' side-nav link keeps data-section-nav-link="key-ideas" (so
      // the IntersectionObserver above still matches it and highlights it
      // correctly) but scrolls to a different element — data-scroll-target
      // overrides where the click actually lands, defaulting to the
      // section's own id everywhere else.
      const targetId = link.getAttribute('data-scroll-target') || id;
      const target = document.getElementById(targetId);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', '#' + targetId);
    });
  });
}

function init() {
  initSectionNav();
  initTileScrollMemory();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
