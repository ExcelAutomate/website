// "Get in touch" CTA band copy (and the landing page's "Learn more" band) is
// sized to the largest font between 14px and 20px that fits the band width
// on one line; wrapping is allowed below the floor rather than shrinking
// further (Brand Brief > Patterns > Section rhythm note; Design Decisions -
// Landing/Our approach/For non-profits/About pages — the fitted approach is
// what every current design file actually does for this line, even though
// one decisions note reads as if it had been simplified to a plain clamp().
// Flagged in DECISIONS.md; going with the executable design source.)
//
// Elements needing the same size (Landing's two "Learn more" lines) share a
// `data-fit-group`; only the line actually measured needs `data-fit-text`.

function fitCtaText() {
  const ctx = document.createElement('canvas').getContext('2d');
  if (!ctx) return;
  const ref = 100;
  const sizes = {};

  document.querySelectorAll('[data-fit-text]').forEach((el) => {
    const text = el.getAttribute('data-fit-text') || '';
    const group = el.getAttribute('data-fit-group');
    if (!group) return;
    const containerWidth = Math.min(720, window.innerWidth - 48);
    ctx.font = `500 ${ref}px 'Public Sans', system-ui, sans-serif`;
    const w = ctx.measureText(text).width;
    // 1.5% headroom so canvas/layout rounding can't tip a fitted line into a wrap.
    sizes[group] = Math.max(14, Math.min(20, (containerWidth / w) * ref * 0.985));
  });

  document.querySelectorAll('[data-fit-group]').forEach((el) => {
    const group = el.getAttribute('data-fit-group');
    if (group && sizes[group] != null) {
      el.style.fontSize = sizes[group] + 'px';
    }
  });
}

function init() {
  fitCtaText();
  window.addEventListener('resize', fitCtaText);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(fitCtaText);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
