// Landing-page carousel. Reimplements the design reference's exact spec
// (docs/Brand Brief.html > Patterns > Carousel, Design Decisions - Landing
// page.md, and Changes - 10 September 2026.md #15) as plain JS driving a
// transform on the track — no framework needed for one interactive widget.
//
// Fixed rules carried over from the design (do not "fix" these, they're
// deliberate):
//  - Both edges show the same gradient at all times; only the "<" chevron
//    itself is conditional (hidden/inert until the deck has been moved off
//    the first card, and then stays available for good).
//  - The forward peek is 1.3x the back peek, and the extra width is added to
//    the whole carousel rather than taken from the active card.
//  - Both arrows move the deck exactly one card in the direction they
//    point, wrapping at either end - they never rewind through the deck to
//    get there (see "unbounded position" below). Dots move directly to the
//    clicked card, by the shortest real distance, and don't wrap.

const CARD_COUNT = 5;
const COPIES = 3; // must stay odd and at least 3 - see Carousel.astro
const MIDDLE_COPY = Math.floor(COPIES / 2);
const GAP = 28;
// How long after the *last* click to silently snap the deck back into the
// middle copy - just past the 550ms slide. Only one of these is ever
// pending (each click clears the previous one); without that, a timer from
// an earlier click could fire mid-slide from a later one and kill the
// transition part way through, snapping the track visibly.
const RECENTER_DELAY = 620;

function initCarousel() {
  const viewport = document.getElementById('carousel-viewport');
  const track = document.getElementById('carousel-track');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  const dots = Array.from(document.querySelectorAll('[data-dot-index]'));
  if (!viewport || !track || !prevBtn || !nextBtn) return;

  // Flat list of every rendered card across all three copies of the deck
  // (15 slots), in DOM/visual order.
  const cards = Array.from(track.querySelectorAll('[data-carousel-card]'));
  // The middle copy's first card is where the carousel starts, and is also
  // the fixed reference alignHero() measures against below.
  const heroRefCard = cards[MIDDLE_COPY * CARD_COUNT];

  // `slotIndex` is an unbounded position into the flat `cards` array, not a
  // 0-4 card index - it's free to run past either end of the middle copy as
  // the user clicks, which is what lets each click move exactly one card in
  // the direction requested instead of wrapping the short way round.
  // `recenter()` periodically folds it back into the middle copy once the
  // user stops clicking; the pixels are identical either side of that fold,
  // so it's invisible.
  let slotIndex = MIDDLE_COPY * CARD_COUNT;
  // Sticky once true: sets on the first navigation of any kind, and never
  // resets even if the user later navigates back to card 0 - "back stays
  // available for good" once it's been shown at all.
  let wrapped = false;
  let recenterTimer = null;
  let cardWidth = 0;
  let prevPeek = 0;
  let nextPeek = 0;

  function currentRealIndex() {
    return ((slotIndex % CARD_COUNT) + CARD_COUNT) % CARD_COUNT;
  }

  // Suppresses the track's transform transition and every card's opacity
  // transition at once - needed for both the layout-recompute path (instant
  // reflow on load/resize) and the recentre fold (an instant swap between
  // two DOM nodes showing the same card, which must not cross-fade or it
  // flashes).
  function setNoAnim(on) {
    viewport.style.transition = on ? 'none' : '';
    track.style.transition = on ? 'none' : '';
    cards.forEach((card) => {
      card.style.transition = on ? 'none' : '';
    });
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
    const trackOffset = -(slotIndex * (cardWidth + GAP)) + prevPeek;

    if (instant) setNoAnim(true);

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
      setNoAnim(false);
    }

    cards.forEach((card, i) => {
      const opacity = i === slotIndex ? 1 : Math.abs(i - slotIndex) === 1 ? 0.4 : 0;
      card.style.opacity = String(opacity);
    });

    const canPrev = wrapped;
    prevBtn.style.opacity = canPrev ? '1' : '0';
    prevBtn.style.pointerEvents = canPrev ? 'auto' : 'none';
    prevBtn.tabIndex = canPrev ? 0 : -1;

    const activeReal = currentRealIndex();
    dots.forEach((dot) => {
      const i = Number(dot.getAttribute('data-dot-index'));
      const on = i === activeReal;
      dot.setAttribute('aria-current', on ? 'true' : 'false');
      const swatch = dot.querySelector('span');
      if (swatch) {
        swatch.style.background = on ? 'var(--green)' : 'var(--on-dark-muted)';
        swatch.style.width = on ? '10px' : '8px';
        swatch.style.height = on ? '10px' : '8px';
      }
    });
  }

  function scheduleRecenter() {
    if (recenterTimer) clearTimeout(recenterTimer);
    recenterTimer = setTimeout(recenter, RECENTER_DELAY);
  }

  function recenter() {
    recenterTimer = null;
    const target = MIDDLE_COPY * CARD_COUNT + currentRealIndex();
    if (target === slotIndex) return;
    slotIndex = target;
    setNoAnim(true);
    render();
    void track.offsetWidth;
    // Two frames, not one - matches the design's own timing for handing the
    // transition back after a no-transition write, giving the browser a
    // full frame to have actually painted the jump before re-enabling it.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setNoAnim(false));
    });
  }

  function goTo(newSlot) {
    if (newSlot !== slotIndex) wrapped = true;
    slotIndex = newSlot;
    render();
    scheduleRecenter();
  }

  nextBtn.addEventListener('click', () => goTo(slotIndex + 1));
  prevBtn.addEventListener('click', () => goTo(slotIndex - 1));

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const targetReal = Number(dot.getAttribute('data-dot-index'));
      const delta = targetReal - currentRealIndex();
      if (delta === 0) return;
      goTo(slotIndex + delta);
    });
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
  // `track.style.transition` itself and risk fighting the `instant`/recentre
  // cleanup above.

  function measure() {
    const vw = window.innerWidth;
    cardWidth = Math.round(Math.min(640, Math.max(260, vw * 0.68)));
    const basePeek = Math.round(Math.min(90, Math.max(28, vw * 0.09)));
    prevPeek = basePeek;
    nextPeek = Math.round(basePeek * 1.3); // 30% deeper, deliberately — draws the eye onward
  }

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
  // The reference applies this as `margin-left: S` on the text and
  // `margin-left: -S` on the mark — two CSS Grid items in an auto-sized
  // `grid-template-columns: auto auto`. Measured directly against the
  // reference: those two opposite margins exactly cancel out in the grid's
  // auto-track-sizing maths, making the mark's absolute rendered position
  // completely invariant to S — it's not a design intent to reproduce by
  // separately un-shifting the mark, it's an emergent property of applying
  // margin to both sides of an auto-sized grid. Only the text gets moved
  // here, via `transform` rather than margin (a margin shift on a grid item
  // collapsed the mark's column to 0 width at some viewport widths — see
  // git history); the mark is left completely untouched, which — since
  // transform never affects track auto-sizing either — lands it at exactly
  // that same invariant position for free, with no cancellation dance
  // needed.
  function alignHero() {
    const text = document.querySelector('[data-hero-text]');
    if (!text || !heroRefCard) return;
    text.style.transform = 'none';

    // Below 720px the mark is hidden (display: none) and the grid drops to a
    // single column — the measured shift isn't meaningful in that layout, so
    // don't apply one (Fix - Landing hero alignment.md).
    if (window.innerWidth < 720) return;

    const inset = parseFloat(getComputedStyle(heroRefCard).paddingLeft || '0') / 2;
    const shift = Math.max(
      0,
      Math.round(heroRefCard.getBoundingClientRect().left + inset - text.getBoundingClientRect().left)
    );

    text.style.transform = `translateX(${shift}px)`;
  }

  measure();
  render(true);
  alignHero();
  window.addEventListener('resize', onResize);

  // Manrope loads with font-display: swap, which changes the hero text's box
  // width after first paint — a single measurement at mount can land before
  // the swap happens. Re-run a few times as layout settles, in addition to
  // (not instead of) the fonts.ready hook, since font-load timing has proven
  // inconsistent to rely on alone (Fix - Landing hero alignment.md).
  [120, 400, 900].forEach((t) => setTimeout(alignHero, t));
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
