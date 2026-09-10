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

  // Safety net: if observation fails for any reason, content must still
  // appear rather than stay hidden forever.
  const safety = setTimeout(revealAll, 2500);

  const targets = document.querySelectorAll('[data-reveal], [data-reveal-tiles]');
  if (targets.length === 0) {
    clearTimeout(safety);
    return;
  }

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
