// Shared scroll-reveal utility — fade + 26px rise, 0.7s, fires at ~92% of the
// viewport (Brand Brief > Motion & states). Once-only by default everywhere on
// this site (Chris's original call — see DECISIONS.md): an element is only
// ever added to the revealed set, never removed, so there is no way to
// reproduce the render loop the design tool's replay-on-scroll-back version
// hit.
//
// The landing page is the one exception (2026-09-10, see DECISIONS.md):
// Chris wants its reveals to re-fire on scroll-back-up. Elements opt into
// that with `data-reveal-repeat` alongside their `data-reveal`/
// `data-reveal-tiles` attribute — everything else keeps the once-only
// behaviour above.
//
// Real pages give us stable DOM nodes, so a plain IntersectionObserver is
// enough — none of the module-scope/scroll-sweep workarounds the design
// tool's re-rendering runtime needed (see docs/Design Decisions - Our
// approach page.md) apply here.

function revealAll() {
  document.querySelectorAll('[data-reveal], [data-reveal-tiles]').forEach((el) => {
    el.classList.add('is-revealed');
  });
}

function initReveals() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || typeof IntersectionObserver === 'undefined') {
    revealAll();
    return;
  }

  const targets = document.querySelectorAll('[data-reveal], [data-reveal-tiles]');
  if (targets.length === 0) return;

  // Safety net: only actually reveals anything if IntersectionObserver
  // looks broken outright - checked by whether the very first target
  // (always the page's hero/intro section, always visible on load) got
  // revealed in time. If it did, IO is clearly working, so this check is a
  // no-op and every other section is left to reveal whenever the visitor
  // actually scrolls to it, however long that takes. This used to be an
  // unconditional "reveal everything after 2.5s" timer - it fired on a
  // fixed clock regardless of scroll position, so any section a visitor
  // hadn't reached yet by 2.5s after page load silently lost its animation
  // the instant it fired (reported 2026-09-10: "I see it once for 'Moving
  // between platforms' but not for anything below that" - see
  // DECISIONS.md).
  setTimeout(() => {
    if (!targets[0].classList.contains('is-revealed')) revealAll();
  }, 2500);

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const repeat = entry.target.hasAttribute('data-reveal-repeat');
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          if (!repeat) io.unobserve(entry.target);
        } else if (repeat) {
          entry.target.classList.remove('is-revealed');
        }
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0 }
  );

  targets.forEach((el) => io.observe(el));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initReveals);
} else {
  initReveals();
}
