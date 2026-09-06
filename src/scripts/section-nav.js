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

function initTileScrollMemory() {
  document.querySelectorAll('.approach-tile').forEach((tile) => {
    tile.addEventListener('click', () => {
      sessionStorage.setItem(RETURN_SCROLL_KEY, String(window.scrollY));
    });
  });

  // On arriving here (via a tile's back link, or any other route back to
  // this page), restore a remembered position if one was left. If there is
  // none — cleared by an inter-article link, or this is a fresh/direct visit
  // — do nothing, and the browser's own scroll to the #section-id anchor in
  // the URL (already run before this script executes) stands as the
  // fallback landing spot.
  const remembered = sessionStorage.getItem(RETURN_SCROLL_KEY);
  if (remembered === null) return;
  sessionStorage.removeItem(RETURN_SCROLL_KEY);
  const top = Number(remembered);
  // Re-applied a couple of times: the browser's own hash-scroll can land
  // fractionally after this first runs, and would otherwise win the race.
  const restore = () => window.scrollTo({ top, behavior: 'auto' });
  restore();
  setTimeout(restore, 60);
  setTimeout(restore, 250);
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
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', '#' + id);
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
