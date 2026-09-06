// Landing-page carousel. Reimplements the design reference's exact spec
// (docs/Brand Brief.html > Patterns > Carousel, and Design Decisions -
// Landing page.md) as plain JS driving a transform on the track — no
// framework needed for one interactive widget.
//
// Fixed rules carried over from the design (do not "fix" these, they're
// deliberate):
//  - A duplicate of the last card sits permanently in the back peek, so the
//    layout never shifts when the back button appears.
//  - Both edges show the same gradient at all times; only the "<" chevron
//    itself is conditional (hidden/inert on the first card, until wrapped).
//  - The forward peek is 1.3x the back peek, and the extra width is added to
//    the whole carousel rather than taken from the active card.
//  - Once the deck has wrapped past the end, back stays available for good
//    (and wraps backwards too).

const CARD_COUNT = 5;
const GAP = 28;

function initCarousel() {
  const viewport = document.getElementById('carousel-viewport');
  const track = document.getElementById('carousel-track');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  const dots = Array.from(document.querySelectorAll('[data-dot-index]'));
  if (!viewport || !track || !prevBtn || !nextBtn) return;

  const cards = Array.from(track.querySelectorAll('[data-carousel-card]'));
  // cards[0] is the ghost (duplicate of the last real card); the rest are
  // the five real cards in order.
  const realCards = cards.slice(1);

  let index = 0;
  let wrapped = false;
  let cardWidth = 0;
  let prevPeek = 0;
  let nextPeek = 0;

  function measure() {
    const vw = window.innerWidth;
    cardWidth = Math.round(Math.min(640, Math.max(260, vw * 0.68)));
    const basePeek = Math.round(Math.min(90, Math.max(28, vw * 0.09)));
    prevPeek = basePeek;
    nextPeek = Math.round(basePeek * 1.3); // 30% deeper, deliberately — draws the eye onward
  }

  // `instant` skips the viewport-width and track-transform CSS transitions —
  // used for layout recomputation (initial load, resize, fonts loading),
  // where an animated catch-up would look laggy and, worse, would leave
  // alignHero() measuring a mid-transition position instead of the settled
  // one (getBoundingClientRect() always reflects the current animated
  // frame, not the transition's target — measuring immediately after
  // setting a transitioned property reads the OLD position). Interactive
  // prev/next/dot navigation calls render() without `instant`, so those
  // keep their slide animation.
  function render(instant) {
    const viewportWidth = prevPeek + cardWidth + nextPeek;
    const trackOffset = -((index + 1) * (cardWidth + GAP)) + prevPeek;

    if (instant) {
      viewport.style.transition = 'none';
      track.style.transition = 'none';
    }

    viewport.style.width = viewportWidth + 'px';
    track.style.gap = GAP + 'px';

    cards.forEach((card) => {
      card.style.flex = `0 0 ${cardWidth}px`;
      card.style.width = cardWidth + 'px';
    });

    track.style.transform = `translateX(${trackOffset}px)`;

    if (instant) {
      // Force layout to actually apply the above with no transition before
      // handing back control — alignHero() measures synchronously right
      // after this returns, and needs the settled geometry.
      void track.offsetWidth;
      viewport.style.transition = '';
      track.style.transition = '';
    }

    realCards.forEach((card, i) => {
      const opacity = i === index ? 1 : Math.abs(i - index) === 1 ? 0.4 : 0;
      card.style.opacity = String(opacity);
    });
    cards[0].style.opacity = index === 0 ? '0.4' : '0'; // ghost

    const canPrev = index > 0 || wrapped;
    prevBtn.style.opacity = canPrev ? '1' : '0';
    prevBtn.style.pointerEvents = canPrev ? 'auto' : 'none';
    prevBtn.tabIndex = canPrev ? 0 : -1;

    dots.forEach((dot) => {
      const i = Number(dot.getAttribute('data-dot-index'));
      const on = i === index;
      dot.setAttribute('aria-current', on ? 'true' : 'false');
      const swatch = dot.querySelector('span');
      if (swatch) {
        swatch.style.background = on ? 'var(--green)' : 'var(--on-dark-muted)';
        swatch.style.width = on ? '10px' : '8px';
        swatch.style.height = on ? '10px' : '8px';
      }
    });
  }

  function goTo(next) {
    index = next;
    render();
  }

  nextBtn.addEventListener('click', () => {
    if (index >= CARD_COUNT - 1) {
      wrapped = true;
      goTo(0);
    } else {
      goTo(index + 1);
    }
  });

  prevBtn.addEventListener('click', () => {
    goTo(index === 0 ? CARD_COUNT - 1 : index - 1);
  });

  dots.forEach((dot) => {
    dot.addEventListener('click', () => goTo(Number(dot.getAttribute('data-dot-index'))));
  });

  // Cheap touch/swipe support — absent from the design reference, added per
  // Build Notes ("add touch/swipe if it's cheap to do").
  let touchStartX = null;
  viewport.addEventListener(
    'touchstart',
    (e) => {
      touchStartX = e.touches[0].clientX;
    },
    { passive: true }
  );
  viewport.addEventListener(
    'touchend',
    (e) => {
      if (touchStartX === null) return;
      const dx = e.changedTouches[0].clientX - touchStartX;
      touchStartX = null;
      if (Math.abs(dx) < 40) return;
      if (dx < 0) nextBtn.click();
      else prevBtn.click();
    },
    { passive: true }
  );

  // Reduced motion is handled declaratively in Carousel.astro's CSS
  // (`@media (prefers-reduced-motion: reduce) { .carousel-track { transition:
  // none; } }`), not here — doing it in CSS means it also covers `render()`'s
  // non-instant (interactive) path without this module needing to touch
  // `track.style.transition` itself and risk fighting the `instant` cleanup
  // above.

  function onResize() {
    measure();
    render(true);
    alignHero();
  }

  // Hero copy aligns to the first real card's left edge, plus half that
  // card's padding — balanced against the carousel specifically, and only
  // measured on load/resize, not on every carousel navigation (Design
  // Decisions - Landing page.md).
  //
  // Applied as a `transform`, not `margin-left`: these two elements are
  // direct CSS Grid items (grid-template-columns: auto auto), and a large
  // margin shift on a grid item feeds into the auto track-sizing algorithm —
  // at some viewport widths that collapsed the mark's column to 0 width,
  // pulling it on top of the heading. `transform` is purely a paint-time
  // offset and never affects layout/track sizing, so it can't do that.
  function alignHero() {
    const text = document.querySelector('[data-hero-text]');
    const mark = document.querySelector('[data-hero-mark]');
    const card = realCards[0];
    if (!text || !card) return;
    text.style.transform = 'none';
    if (mark) mark.style.transform = 'none';
    const inset = parseFloat(getComputedStyle(card).paddingLeft || '0') / 2;
    const textRect = text.getBoundingClientRect();
    const desiredShift = Math.max(0, Math.round(card.getBoundingClientRect().left + inset - textRect.left));

    // The hero copy's line breaks are forced (<br>), not fluid, so its
    // rendered width barely changes with viewport width — but the natural
    // gap between it and the mark does. Chasing the carousel's card edge
    // regardless of that gap can push the two into each other at some
    // widths. Cap the shift so they always keep at least a little daylight
    // between them; landing short of the "ideal" aligned position is a far
    // better failure mode than the mark overlapping the heading.
    let shift = desiredShift;
    if (mark) {
      const markRect = mark.getBoundingClientRect();
      const naturalGap = markRect.left - textRect.right;
      const maxShift = Math.max(0, Math.floor(naturalGap / 2) - 8);
      shift = Math.min(desiredShift, maxShift);
    }

    text.style.transform = `translateX(${shift}px)`;
    if (mark) mark.style.transform = `translateX(${-shift}px)`;
  }

  measure();
  render(true);
  alignHero();
  window.addEventListener('resize', onResize);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      measure();
      render(true);
      alignHero();
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCarousel);
} else {
  initCarousel();
}
