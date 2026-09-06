# About Page — Design Decisions

Non-standard choices on the About page that came from an explicit instruction or
preference from the owner, or from a constraint that isn't visible in the markup.
They look like mistakes if you don't know the reasoning — **don't "correct"
them**.

The page reuses the shared header, footer, palette and component geometry. Only
the departures are listed here.

---

## Voice

**The page is written in the first person — "I", not "we".** This is a
one-person business and the page says so plainly. It is why the nav item is
"About" rather than "About us".

**The hero introduces Chris by name in body copy, not as a heading.** "Hi, I'm
Chris" reads as an introduction; a name heading would make the page feel like a
CV.

---

## Layout

**Every block on the page shares one 820px centred column** — hero, both prose
sections, the header and footer aside. This is the whole layout rule. It means
the h1 and both h2s start at exactly the same left edge.

**The hero was originally wider than the prose below it** (the 1240px container,
with the copy capped at 620px inside it) and this was rejected. Two centred
blocks of different widths can never share a left edge, so the hero copy started
about 210px further left than the headings below it, and the gap between the
capped copy and the photo left a hole on the right. **Don't reintroduce a wider
hero container.**

**The hero is two columns: copy left, photo right.** The photo takes a fixed
310px track rather than a fraction, so the copy column absorbs the narrowing as
the page shrinks instead of both columns scaling down together.

**The hero is top-aligned, not centre-aligned.** Centring left roughly 70px of
dead space above the headline, because the photo column is taller than the copy.

**Prose at 820px is a deliberate ceiling.** Long-form prose in the full 1240px
container is unreadable.

**The photo is a placeholder** — a blank portrait shape with a dashed brand-green
border at 35% opacity, 310px wide at a 4:5 crop. It is deliberately empty rather
than an illustration or an icon. Replace it with the real photo; the dashed
border goes with it. Below 900px it stacks beneath the copy.

**The landing page's content spine is not used here.** See the landing page's
decisions file — that alignment was balanced against the carousel and is local
to that page. Nor is the contact page's two-pane split a rule; that page's widths
were tuned around its form, and this page's around its prose.

---

## Section rhythm

**Bands run light, tint, light, green, then the tint footer.** No two adjacent
bands repeat.

**This page uses the green CTA band**, which the contact page does not. The
contact page's form is its own primary call to action, so a green band there
would ask twice. Here there is nothing competing, so the primary CTA band is
correct.

**There is no near-black "Learn more" band.** The page ends on the ask. Adding a
second CTA would dilute it.

---

## Copy treatment

**The closing line, "And that's a pretty good outcome.", is pulled out of its
paragraph** and set in Spectral italic with a green rule, matching the contact
page's pull quote. Inline, it read as an afterthought; set apart, it lands as the
closing beat.

**Three green terms: "meet", "Chris" and "people", plus "Modern Excel".** More
than the other pages carry, and reviewed on screen before being kept. Don't add a
fifth.

**"modern Excel" is capitalised to "Modern Excel" and emphasised**, matching the
nav label and the term the other pages use. It is the page's only inline
emphasis outside the personal ones above.

**Spaced hyphens ( - ), never em or en dashes.** Site-wide standing preference;
see `CLAUDE.md`.

---

## Header

**"About" carries the active underline** on this page, in both the desktop nav
and the burger menu.

**The header CTA is a solid green button here**, unlike on the contact page where
it is an inert chip. You are not on the contact page, so it is a real link.

---

## Reveals

**Once-only, `IntersectionObserver`, with a 2.5-second safety net** — same
implementation as the contact page, and for the same reasons. See that page's
decisions file before changing it.

## Photo (6 September 2026)

**The hero photo slot now holds a real photo of Chris** - `assets/chris-duff.png`,
a 620x775 crop prepared from `assets/chris-duff-source.jpg` (2343x3728). The slot
keeps its 310px cap and 4/5 aspect; the image is `object-fit: cover` with
`object-position: 50% 30%` so the crop favours the face rather than the centre of
the frame.

The source file is kept so the crop can be redone. **For production, export a
JPEG or WebP at around 620px wide** rather than shipping either of these - the
PNG is larger than a photo needs to be.
