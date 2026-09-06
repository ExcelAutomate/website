# For non-profits Page — Design Decisions

Non-standard choices on the For non-profits page that came from an explicit
instruction or preference from the owner, or from a constraint that isn't visible
in the markup. They look like mistakes if you don't know the reasoning —
**don't "correct" them**.

The page reuses the shared header, footer, palette and component geometry. Only
the departures are listed here.

---

## Tone

**This page is deliberately the most matter-of-fact on the site, with the least
marketing feel.** Requested explicitly. It describes problems the reader
recognises and says plainly what can be done about them. When editing, resist
adding enthusiasm, benefit statements or superlatives — two existing phrases are
already flagged in the content file as leaning too far that way.

**The copy was supplied whole and is in verbatim**, apart from the hero heading.
Editorial suggestions were raised separately rather than applied; they are listed
at the foot of `Content - For non-profits page.md` for Chris to decide on.

---

## Structure

**Plain banded sections, no tiles, no side nav.** This is a page to be read
top to bottom, not browsed. The Our approach page's tile grid would break that
reading, and its section nav would imply the sections are alternatives rather
than a sequence.

**All content sits in a centred 820px column**, matching the About page. Long
prose at the full 1240px container is unreadable.

**Bands alternate light and tint through the body, then green and near-black for
the two CTAs.** No two adjacent bands repeat. The body sections are unremarkable
by design — the alternation is there to separate them, not to rank them.

**Five body sections.** A sixth, "Direct mail", was folded into "Filling the
gaps" — it was a campaign type sitting among data movements, where the others are
all about data moving between systems. "Filling the gaps" generalises it to
functionality a CRM lacks, with direct mail as one example. If sections are added
back, this page is the one most likely to need a side nav like Our approach — but
it doesn't need one yet.

---

## The two CTAs

**Two CTA panels, not one**, matching the landing page's pairing: a green
primary band for Get in touch, then a near-black secondary band for Our approach.
Both were supplied in the copy.

**The order is deliberate.** The primary ask comes first; the secondary panel is
the exit ramp for someone not ready to make contact. Reversing them would end the
page on the softer action.

**The Our approach button is a ghost button on the near-black band**, per the
brief's rule tying each variant to a band background. Don't make it solid.

---

## Copy treatment

**Only two green terms on the page: "Alongside" in the hero heading and "Modern
Excel" in the hero body.** The page is long, so the emphasis is spread far
thinner than elsewhere by design. The second CTA previously emphasised "our
approach" in its body copy; that copy was rewritten and the emphasis went with
it.

**Continuity is deliberately last.** It was suggested as a candidate to move
higher, being the strongest argument; Chris kept it as the page's conclusion.
Don't reorder it.

**There are no inline links in the body copy.** An earlier version had a "reach
out" link in the first section; it was removed. The page has two CTA panels
already, and inline links compete with them.

**Named platforms — Raisely, Do Gooder, Mailchimp — are examples, not
partnerships.** Check they still read as current before launch.

**Spaced hyphens ( - ), never em or en dashes.** Site-wide standing preference;
see `CLAUDE.md`.

---

## Reveals

**Same implementation as the other pages: fade and rise 26px over 0.7s, firing at
92% of the viewport, replaying on scroll-back.** Every section is a single block,
so there is no stagger on this page.

**Re-arming is downward only** — an element above the viewport stays revealed.
Re-arming in both directions caused a render loop that blanked a page during the
design phase.

**An `IntersectionObserver` and a scroll sweep run together**, deliberately
redundant: the observer misses nodes the runtime swaps after they were observed,
and observers have failed to fire at all in some preview contexts.

**The scroll listener is at module scope, not on the instance**, for the reasons
recorded in the Our approach page's decisions file. Read that before changing it.
