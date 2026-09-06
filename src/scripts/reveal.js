// Shared scroll-reveal utility — fade + 26px rise, 0.7s, fires at ~92% of the
// viewport (Brand Brief > Motion & states). Once-only everywhere on this site
// (Chris's call — see DECISIONS.md): an element is only ever added to the
// revealed set, never removed, so there is no way to reproduce the render
// loop the design tool's replay-on-scroll-back version hit.
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
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-revealed');
        io.unobserve(entry.target);
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
