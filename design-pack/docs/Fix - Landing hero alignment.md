# Fix: landing page hero alignment

For the production build. The hero text and the animated mark are **not** a plain
two-column layout with static offsets - the horizontal position is measured at
runtime against the carousel below. Any attempt to reproduce it with fixed
padding, `justify-content`, or a hardcoded pixel value will look close and be
wrong at most viewport widths.

Reference: `Excel Automate Landing.dc.html`, `_alignHero` in the logic class.

## What the alignment is

**The hero copy's left edge lines up with the left edge of the carousel's active
card, plus half that card's internal padding.** Not the page's 1240px content
edge, and not the card's text edge - a point between the two. This was chosen
deliberately after trying both alternatives (see
`Design Decisions - Landing page.md`, "Hero").

**The mark does not move when the text shifts.** It takes the exact negative of
the text's shift as its own left margin, so the text slides right to meet the
card edge while the mark's left edge stays where the grid put it.

## Container

```
max-width: 1240px; margin: 0 auto;
display: grid;
grid-template-columns: auto auto;   /* 1fr below 720px */
gap: clamp(12px, 1.6vw, 28px);
align-items: center;
justify-content: center;
```

Section padding: `clamp(56px,10vw,120px) 24px clamp(32px,4.4vw,54px)`.

**Below 720px:** single column, and the mark is `display: none` - not scaled down,
not stacked. The measured shift is not applied in this state.

## The measurement

Runs after mount and on every resize:

1. Get the hero text wrapper (`[data-hero-text]`) and **the second element**
   matching `[data-carousel-card]`.
2. `inset = parseFloat(getComputedStyle(card).paddingLeft) / 2`
3. `shift = currentShift + (card.getBoundingClientRect().left + inset - text.getBoundingClientRect().left)`
4. `next = Math.max(0, Math.round(shift))`
5. Apply as `margin-left: {next}px` on the text wrapper, and
   `margin-left: {-next}px` on the mark wrapper.
6. Only write it back if it differs from the current value by more than 1px, or
   it will loop.

**Step 1 is the most likely thing to have gone wrong: it must be the SECOND card
in the DOM, index `[1]`, not the first.** A duplicate of the last card sits
permanently in the carousel's left peek so the track's geometry never changes -
so the *active* card is the second node, and measuring the first one aligns the
hero to the off-screen peek card instead. That is worth roughly a full card width
plus a gap of error, which is what "not quite right" usually looks like here.

**Re-run it after layout settles.** The reference schedules `_alignHero` at 120ms,
400ms and 900ms after mount, plus on resize. Web font loading changes the text
box width, and a single measurement on `DOMContentLoaded` lands before Manrope
has swapped in. If the build uses `font-display: swap` (it should), measuring
once is not enough - either keep the staggered re-runs or hook
`document.fonts.ready`.

Guard for both elements existing before measuring, and bail quietly if either is
missing.

## The mark itself

The SVG carries its own offsets, which are part of the composition and not
alignment slack:

```
wrapper:  width: clamp(280px, 24vw, 360px);
          margin-top: -72px;          /* lifts it against the h1, deliberate */
          display: flex; align-items: center; justify-content: center;

svg:      viewBox="62 22 517 296"
          width="100%" height="300"
          preserveAspectRatio="xMidYMid meet"
          overflow: visible
          transform: translateX(-40px)
          transform-origin: left center
```

`overflow: visible` matters - the cog teeth and the feed lines extend past the
viewBox and get clipped without it. The `-72px` top margin and the `-40px`
translate are both intentional; don't normalise them away to make the box look
tidy in devtools.

## How to check it

At a desktop width, the first character of "Make" should sit slightly to the
right of the active carousel card's left edge - about half the card's padding in.
Resize slowly from 1600px down to 720px: the text should track the card edge
continuously, and the mark's left edge should not move. At 719px the mark
disappears and the text returns to the container's normal left edge.

## Unrelated cleanup while you are in here

`_heroLine2` and the `heroFontSize` state it feeds are **dead code**. The hero
paragraph now uses `font-size: clamp(17px,2vw,21px)` directly, and the measured
string in `_heroLine2` still reads "Taking tedious manual processes" from an
older draft of the copy. Don't port either. The same `_fitFontSize` helper is
still live and needed for the two CTA bands - keep that.
