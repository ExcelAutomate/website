# Our approach Page — Design Decisions

Non-standard choices on the Our approach page that came from an explicit
instruction or preference from the owner, or from a constraint that isn't visible
in the markup. They look like mistakes if you don't know the reasoning —
**don't "correct" them**.

---

## What this page is

**One nav item covering three kinds of content.** Modern Excel (the argument),
Excel tips (practical guidance), and Beyond Excel (adjacent tools). It was
deliberately not split into separate nav items — the nav is full at four, and the
sections belong together.

**The label went through several rounds.** "About Excel" → "Modern Excel" → "Our
approach". Each earlier label was rejected as too narrow to cover tips and the
adjacent-tools material. Don't narrow it again.

**The first section is named "Key ideas" in the menus, and carries no heading of
its own.** It holds the three pieces any prospective client should read. The page
title above it already says what the section is, so a panel heading would repeat
it — but a menu label has no page title above it, so the menus need a name. It
was briefly called "Start here", then "Our approach", before settling on "Key
ideas". The section `id` and its anchor were renamed to match (`key-ideas`), so
the label, the id and the `#key-ideas` anchor all agree — keep them in step if
the label changes again.

**It IS listed in the header dropdown, as the first item.** Without it, the
dropdown began at "Modern Excel", which read as the place to start. A descriptive
name was chosen over a directive one like "Start here" — but note that any name
describing the section's *subject* will collide with the "Modern Excel" section
directly below it, since the first section is largely about Modern Excel. "Key
ideas" describes its status instead.

---

## Structure

**Every block sits in one 1240px container, and the hero shares the content
column with the sections below it.** The hero was originally its own full-width
section above the grid; that put its left edge ~210px left of the section panels,
which was rejected. The section nav now sits beside the hero, so the page's scope
is visible before any scrolling.

**The section nav column is 176px** — about 40px wider than the longest label
needs. The slack is deliberate, so the active pill reads as a pill rather than a
tight box. It was 208px, which took too much off the content.

**Single page, all sections on one scroll.** Scroll-swapped sections and
scroll-jacking were considered and rejected: they break the scrollbar, browser
find, deep links and the back button, and they can't be made accessible cheaply.
The sticky section nav does the "distinct sections" job instead.

**Sections are written out explicitly in the template, not generated from a
loop.** Each one has its own panel colour and its own copy, and writing them out
keeps both directly editable. This is deliberate duplication — don't refactor it
into a loop.

**Each section is a rounded panel with its own background**, rather than a
full-width band. Full-bleed bands can't coexist with a sticky nav column without
fragile negative-margin maths. The panels give the same separation and hold up at
every width.

**Panel order is green, tint, near-black, tint,** on the page's off-white
background. Excel tips was briefly white-on-off-white and was invisible; if you
change a panel colour, check it against the band behind it, not just against its
neighbours.

**The gap below the Key ideas panel is roughly triple the gap between the other
three** (up to 60px against their 32px). It separates the three featured pieces
from the browsable material below, so Key ideas reads as its own thing rather
than as the first of four.

**The Modern Excel panel starts at 45% opacity and comes to full on the first
scroll, hover or keyboard focus.** Deliberate: it signals there is more on the
page without competing with the three featured tiles. It is permanent once
cleared — it does not dim again. Keyboard focus is included so someone tabbing
through doesn't read dimmed tiles.

**The section nav is a white card.** It scrolls past panels of four different
colours, so it needs its own surface to stay legible.

---

## Articles

**Tiles are real links with real hrefs, and the article renders in place of the
section list.** In production each article is its own URL — the tile markup is
already shaped for that, so converting is a template change rather than a
rewrite. It renders in place here so all 15 can be reviewed in one file.

**Not a modal.** An expanding tile over the page was considered and rejected:
articles are multi-paragraph, they want to be indexed and linkable, and
"click anywhere outside to close" loses your place on a long read.

**Tiles do not expand on hover.** Growing one card reflows its whole grid row.
The excerpt is a fixed three lines instead, with the standard card lift on hover.

**Only the three "Start here" tiles carry a "Read this →" prompt.** Requested. On
every tile it was noise; on the three that matter it is a pointer.

**Closing an article restores the exact scroll position** the reader left from,
not the top of the section. The restore runs twice, immediately and after 60ms,
because the index is taller than the article and the container can still be
clamping `scrollTop` on the first attempt. If the article was opened from a deep
link rather than a tile, there's no remembered position and it falls back to the
section heading.

---

## Scroll reveals

**Reveal timings match the landing page exactly.** Text blocks and section
panels fade and rise 26px over 0.7s; tiles use 0.65s and stagger 90ms apart
across a grid, on `cubic-bezier(0.22,1,0.36,1)`. The section panel and its tiles
reveal independently, so a panel arrives and its tiles follow in sequence.

**Reveals replay on scroll-back, matching the landing page.** An element that
scrolls back off the **bottom** of the viewport is re-armed and plays again on
the way down. This only ever re-arms downward — anything above the viewport stays
revealed, which is what stops it oscillating. An earlier version on the contact
page re-armed in both directions and produced a render loop that left the whole
page invisible, so keep the one-directional rule.

**There is a bounded safety net, not a blanket one.** It catches up only what is
genuinely on screen. An unconditional reveal-everything fallback was tried and
silently defeated the whole effect: it revealed the page 2.5s after load, before
anyone could scroll, so the stagger was never seen.

**Two mechanisms drive the reveals: an `IntersectionObserver` and a scroll
sweep.** Deliberate redundancy. The observer misses elements when the runtime
swaps a node after it was observed, and the landing page's history shows
observers not firing at all in some preview contexts.

**Reveals use scalar style holes** (`opacity: {{ x.opacity }}`), never a whole
style object dropped into a partly-literal style string — an object hole inside a
mixed style string does not expand, and the animation silently never applies.
This bit the landing page; don't reintroduce it.

---

## Section highlight

**The current-section marker is written directly onto the nav anchors by the
scroll handler — NOT rendered from component state.** It took five attempts to
get this right, so read before changing it:

- The nav anchors are static markup carrying `data-section`. A module-scope
  function queries them fresh and sets `style.background` / `style.color`.
- Every state-driven version failed. The runtime keeps more than one component
  instance alive, and a stale instance's `setState` updates a tree that isn't
  mounted, so the highlight either froze or lagged exactly one scroll behind.
  An `IntersectionObserver`, a container-bound scroll listener, a module-scope
  instance pointer claimed on mount, and the same pointer claimed on every
  render were all tried and all failed this way.
- `componentDidUpdate` repaints the nav, because React re-rendering the anchors
  wipes the direct style writes.
- Hover is handled the same way, for the same reason.

**Scroll events are caught at `document` in the capture phase.** They don't
bubble, but they do pass through capture for whichever element scrolled, which
survives the runtime replacing the scroll container node.

**A 200ms interval drives both the nav repaint and the reveal sweep.** Neither
can depend on a scroll event arriving. Two failures made this necessary: the
staggered reveal renders recreate the nav anchors up to ~90ms after the last
scroll, wiping the direct style writes with no further event to correct them;
and on a cold start there was a window before the listener and the live pointer
had settled where scrolling fired nothing at all, leaving three of the four
sections blank for a visitor who landed and scrolled straight away. **Don't
remove the interval** on the grounds that the scroll listener covers it.

**The shared state lives on `window`, not in module scope** — the listener guard,
the interval guard, the scroll throttle and the live-instance pointer. Module
scope is not safe here: if the runtime evaluates a second copy of the module its
flags reset while the first copy's listener and interval are still registered,
and a stale copy with a null pointer then does nothing silently.

**`componentWillUnmount` does not clear the live pointer.** `renderVals()`
reclaims it on every render, so the mounted instance always owns it; clearing on
unmount blanks the pointer a just-mounted replacement is already using.

**Sections are looked up fresh on every measurement**, never cached.

**Menu jumps are animated by hand, not with `behavior: 'smooth'`.** Native smooth
scrolling on this container takes over a second to start and then teleports.
`scrollTween` writes `scrollTop` directly over 380ms on an ease-out curve. It
also suspends the reveal sweep while running — a long jump drags a dozen
elements through the trigger line at once, and the burst of renders starves the
animation frame badly enough to stall the tween.

**Jump targets are measured with the reveal transform removed.** An unrevealed
section sits 26px low, so measuring its rendered position overshoots and the
section then jumps as the reveal fires. `layoutTop()` subtracts the transform.

**Jumps allow 110px for the sticky header.** It was 24px, which left every
section heading partly hidden underneath it.

**The scroll is started synchronously in the click handler**, not from a
`setState` callback — a callback belonging to a non-committed instance can sit
unrun until something else forces a render.

**The throttle is a timestamp, not a boolean latch.** A boolean set before a
`requestAnimationFrame` and cleared inside it latches permanently if the callback
is ever dropped, which kills the highlight for good.

**Test the highlight with at least six consecutive scrolls in both directions.**
Every broken version passed a single-scroll test, and the lagging version passed
a static-position test too.

---

## Header dropdown

**Hover only, by explicit instruction** — clicking "Our approach" opens the page
rather than requiring the menu. It still needs keyboard support in production;
see the Build Notes.

**It opens on hover, not on `current`.** Gating it on the active-page state would
leave it permanently open on this page.

---

## Content

**Every article body is placeholder text, and every one says so in its first
paragraph.** This is deliberate so nothing ships by accident. The bodies are
written at realistic length so the layout can be judged.

**"Working with tables" appears twice** — as "Tables vs Ranges" under Modern
Excel and "Working with tables" under Excel tips. Intended: one argues the case,
the other is practical. Their ids differ (`tables-vs-ranges`, `tips-working-with-tables`).

**Spaced hyphens ( - ), never em or en dashes.** Site-wide standing preference;
see `CLAUDE.md`.

## Pre-launch state (6 September 2026)

**The three sections after Key ideas are permanently dimmed to 0.45.** All of
their articles are placeholder, and the site is going out as a soft launch with
Key ideas only as real content. The tiles stay in place and stay clickable, so
the sections read as "not yet" rather than absent.

Previously only Modern Excel dimmed, and it cleared permanently on any hover or
focus. **Reinstate that behaviour once the later articles have content** - the
logic class carries the exact steps in a comment above `undim`.

The standfirst was changed to "Start with three short articles that explore some
key ideas. We'll be adding to the other sections over time." - it no longer names
individual articles, so it does not need editing every time the line-up changes,
and it carries the soft-launch signal once at the top instead of per tile.
