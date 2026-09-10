# Decisions

One entry per significant choice: what was chosen, and why. Append, don't rewrite —
this is the memory a future AI session won't otherwise have (see Build Notes > Part 1
in the design pack, kept in `design-pack/docs/` — read that before making further
changes to this site).

## 2026-09-06 — Rebuilt the site in Astro from the design pack

Replaced the plain-HTML placeholder site with a proper build against the design pack
Chris supplied (5 `.dc.html` design references, Brand Brief, per-page Content and
Design Decisions docs, 3 written articles). Chose **Astro, static output, plain CSS**
(no Tailwind, no UI framework) — matches the design pack README's own recommendation.
The vaguer "Tailwind optional but expected" line in the pack's Build Notes was not
followed; plain CSS with custom properties keeps the dependency count lower, which
matters more than usual here (see "no human developer" below).

## 2026-09-06 — Scroll reveals: once-only everywhere, not replay-on-scroll-back

The design files replay reveals on scroll-back on the landing and Our-approach pages
(good for previewing in the design tool), but Build Notes flagged this as an open
question for the live site. **Chris chose once-only, site-wide**, matching what the
Contact and About pages already did in the design. This also means the once-only
implementation (an IntersectionObserver that only ever adds to a "revealed" set) is
used everywhere — simpler, and avoids the render-loop risk the design docs describe
for any implementation that can un-reveal an element.

**Reversed for the landing page only, 2026-09-10** — see the entry below.

## 2026-09-10 — Landing page reveals now repeat on scroll-back-up

Chris asked for the landing page's reveal animations to re-fire when scrolling back
up past them, reversing the once-only default above for this one page. Rather than
forking the whole reveal system, `src/scripts/reveal.js` now supports per-element
opt-in: an element with `data-reveal-repeat` alongside its `data-reveal`/
`data-reveal-tiles` attribute has its `is-revealed` class removed when it leaves the
viewport (instead of being unobserved), so it re-triggers on next entry. Applied to
every reveal target on `src/pages/index.astro` (hero, carousel, services head/tiles,
both CTA bands). Every other page is untouched and stays once-only — the render-loop
risk noted above only applies to an implementation that can un-reveal, and this one
still can't do that anywhere it isn't explicitly opted in.

## 2026-09-06 — No phone number

Nothing in the business context docs supplied one. Contact page shows email only.
Revisit if Chris wants to add one — it would go in the Contact page's detail rows.

## 2026-09-06 — Nav active-state and mobile/desktop switch moved to build time

The design reference computes "is this nav item active" and "are we below 1180px" at
runtime via JS state, because its component runtime needs to re-render the whole nav
on every resize. A static Astro page doesn't need any of that: each page passes its
own `current` prop to `<Header>` server-side, and the 1180px burger breakpoint is a
plain CSS media query. Behaviourally identical to the design; substantially less JS.

## 2026-09-06 — Our-approach section highlight uses `IntersectionObserver`

The design's scroll-position/module-scope workaround exists only because its runtime
replaces DOM nodes on re-render (see the design pack's Design Decisions - Our approach
page.md). Static Astro output has stable nodes, so a plain `IntersectionObserver` does
the same job — this is also what Build Notes explicitly asks for in production.

## 2026-09-06 — Menu-jump scrolling uses native `scrollIntoView({behavior:'smooth'})`

The design's hand-rolled scroll tween exists because native smooth scrolling stalled
inside its own custom overflow-scroll container. This site scrolls the real document,
which doesn't have that container, so native smooth scroll was tried first (per Build
Notes' instruction to test it) and it behaves correctly. If a future browser regresses
here, a small `requestAnimationFrame` tween is the fallback — see
`src/scripts/section-nav.js`.

## 2026-09-06 — Articles are real routed pages from day one

`src/pages/our-approach/[slug].astro`, generated from the `articles` content
collection (`src/content/articles/*.md`, one file per article, Markdown body).
Deep links, hash navigation and back-button scroll position all come free from the
browser this way — Build Notes explicitly says this is "a template change, not a
rewrite" once real pages exist, so there was no reason to build the in-place-swap
version the design file needed for single-file review.

Frontmatter per article: `section`, `order`, `title`, `excerpt`, `status`
(`written`/`placeholder`), `readThis` (true only for the 3 Key-ideas tiles), optional
`cta: {label, target}`. In-body headings are marked as `##` (rendered `<h2>`) with the
article title as the page's only `<h1>` — a semantic correction from the design source
(which nested a visual "h3" style under what would have been a second h2 on the page),
not a visual change; sizing still matches the design's h3 treatment.

## 2026-09-06 — "Get in touch" CTA line sizing: fitted JS confirmed correct (resolved)

`docs/Design Decisions - Landing page.md` had a note dated 6 September 2026 saying the
green CTA band's line was changed to plain `clamp(16px,1.8vw,20px)`, matching Our
approach/For non-profits/About. The actual `.dc.html` source for all four pages
disagreed, still using the canvas-measured `_fitFontSize` sizer. Went with what the
design files actually execute (this repo's `src/scripts/cta-fit.js`, used on Landing's
Get-in-touch line and both Learn-more lines, plus Our-approach/For non-profits/About's
Get-in-touch lines) and flagged the discrepancy for Chris to confirm.

**Confirmed via Opus 5** (which made the original edit): the plain-`clamp()` change was
real but short-lived — made on 6 September, then reversed about twenty minutes later
after Chris compared it against the Learn-more panel and preferred the larger measured
size, pushing the fitted sizer out to all four pages instead. The decisions note was
never updated after the reversal, making it describe a superseded state. **The fitted
sizer (14px floor, 20px cap, wrapping below the floor rather than shrinking further) is
correct on all four pages, including the Landing Learn-more band** — matching
`design-pack/docs/Build Notes.md` Part 1 (Contact CTA band section), which had the
current version. No further action needed; this build already matches it.

## 2026-09-06 — Contact form: real validation now, Netlify wiring inert until the move

`data-netlify="true"`, `name="contact"`, `netlify-honeypot="bot-field"` and a hidden
`form-name` input are all in the markup now. On GitHub Pages (no backend) the form's
`fetch` POST will simply fail — the JS treats that the same as success and shows the
in-card confirmation anyway, so what's reviewable on this test build is the
required-field/validation behaviour, not real delivery (per Build Notes' explicit
permission to do this on the GitHub Pages build). **The `novalidate` attribute is on
the `<form>` deliberately** — without it, the browser's native validation UI intercepts
the submit event before the custom green-family inline error spans ever get a chance to
show; `checkValidity()` is still used per-field in JS, `novalidate` just stops the
browser from short-circuiting to its own unstyled tooltip first.

**Before the Netlify move:** turn on an email notification to
`hello@excelautomate.com.au` in the Netlify UI (the dashboard alone is not a
workflow — Chris will never see a submission otherwise) and set `reply-to` to the
sender's address.

## 2026-09-06 — Footer year is dynamic, not hard-coded

`new Date().getFullYear()`, resolved once at Astro build time. Build Notes lists the
design's hard-coded 2026 as a known, low-priority gap; making it dynamic is strictly
better here since it's build-time-only, not runtime logic that could misbehave.

## 2026-09-06 — robots.txt disallows everything; every page carries `noindex`

Build Notes' generic "add robots.txt/sitemap" guidance reads as written for the
eventual Netlify launch. This interim GitHub Pages build still has 12 of the 15
Our-approach articles whose own visible first paragraph says "this article has not
been written yet" — those shouldn't be indexable in the meantime. **Remove both**
(the `noindex` meta in `src/layouts/BaseLayout.astro` and `public/robots.txt`) as part
of the pre-Netlify-launch checklist in README.md, alongside replacing the placeholder
article content.

## 2026-09-06 — About page hero photo: `loading="eager"`, not Astro's default lazy

Astro's `<Image>` component defaults to `loading="lazy"`. The About page's hero photo
is above the fold and part of the page's initial paint, so lazy-loading it is the wrong
default here regardless — overridden to `loading="eager" fetchpriority="high"`.

## 2026-09-06 — GitHub Actions pinned by major-version tag, not commit SHA

`actions/checkout@v4`, `withastro/action@v3`, `actions/deploy-pages@v4`. Full SHA
pinning is more tamper-resistant but needs manual upkeep from someone who can read a
diff; major-version tags from these specific publishers (GitHub's own actions, and the
Astro team's own action) are the standard, low-maintenance convention and were judged
the better trade-off given nobody will be maintaining this by hand.

## 2026-09-06 — Post-launch bug fixes (Chris's first-look feedback)

Five issues reported after seeing the live rebuild, all fixed:

- **Hero/mark misalignment at most widths.** Two separate bugs. First: `alignHero()`
  measured the carousel card's position via `getBoundingClientRect()` immediately
  after setting the properties that move it — but those properties (`track`
  transform, `viewport` width) are CSS-transitioned, and a rect read immediately
  after a transitioned property changes still reflects the *pre-transition* frame,
  not the settled target. This meant every layout recompute (initial load, every
  resize) measured a stale position and computed a wildly wrong shift. Fixed by
  giving `render()` an `instant` mode that suspends the transition, applies the
  styles, forces a reflow, then restores it — used for layout recomputes; the
  transition stays for interactive prev/next/dot clicks. Second: even after that
  fix, the shift could still push the text into the mark at some widths, because
  the hero copy's line breaks are forced (not fluid), so its width barely responds
  to viewport width while the required shift does. Capped the shift so the two
  always keep a little clearance, and added `z-index` so text stays legible over
  the mark as a last-resort safety net.
- **Header CTA button had no rounded corners, and stretched full-width in the
  burger menu.** The button was combining `.nav-cta` with the color-only
  `.btn-solid` class, but never got the shared `.btn` base class that actually
  carries padding/radius — so `.nav-cta` needed its own complete geometry, added
  directly. The mobile version's full-width stretch was confirmed as a genuine
  oversight in the original design file: the nav links opt out of the mobile
  menu's flex `align-items: stretch` with `align-self: flex-start`, but the
  original CTA link never did. Added the same opt-out.
- **Our-approach article back-links didn't remember scroll position.** Articles
  are real pages now (a deliberate difference from the design reference, which
  swaps content within one page instance — see the "Articles are real routed
  pages" entry above), so the design's in-memory `_returnScroll` variable doesn't
  carry across a real navigation. Reimplemented with `sessionStorage`: a tile
  click saves the hub's scroll position before navigating away; the hub's own
  load restores it if present. An article-to-article link (the end-of-article CTA,
  or an inline link) clears it, matching the exception Chris described (chaining
  from "What's Modern Excel?" to "Why Power Query?" and then going back should
  land on the Key ideas heading, not a scroll position from two hops back) — see
  `src/scripts/section-nav.js` and the new `src/scripts/article-nav.js`.
- **About page photo had the top of the head cut off.** The `<Image>` component
  was given both `width={620}` and `height={775}`, so Astro pre-cropped it to
  exactly that box using its own default centred crop *before* the page's CSS
  `object-position: 50% 30%` ever ran — leaving that CSS nothing to reposition
  within, since the served image already matched the display box exactly. Fixed
  by requesting only `width={620}` (Astro infers a proportional height from the
  source), so the CSS crop has genuine room to favour the top of the frame.
- **Contact page showed the "Thanks, that's on its way" confirmation immediately,
  under the form.** `#contact-form` and `#contact-thanks` each had their own
  `display: flex` rule, and an `#id` selector outranks the browser's built-in
  `[hidden] { display: none }` rule — so toggling the `hidden` property from JS
  silently did nothing, and both were visible at once from the start. Fixed by
  scoping both rules to `:not([hidden])`.

## 2026-09-06 — Second round of fixes (more first-look feedback)

- **Hero/mark misalignment, still not right after the first fix.** Two more
  problems on top of the transition-timing bug fixed earlier. First: the
  previous fix had also unified the hero section's container to
  `var(--w-carousel)` (1000px, matching the carousel) on a theory that the
  container-width mismatch was causing the huge shift values — disproved by
  direct measurement at the time (changing the container didn't change the
  computed shift at all; the transition-timing bug was the whole cause), but
  the container change was left in anyway and pushed the hero content further
  right than intended. Reverted — the hero section uses the ordinary 1240px
  `.container` again. Second: the animated mark was reimplemented by hand from
  the full Landing page source, using CSS `@keyframes` for the cog
  rotation/header-pulse/cell-flash — and the cell-flash rects' inline
  `style="animation: cellFlash ..."` referenced a keyframe name that was never
  actually defined (only a differently-named `heroCellFlash` was, on a
  separate, incomplete rule with no duration/delay), so those four animations
  silently did nothing. **Replaced the whole component with
  `design-pack/design/assets/animated-mark-snippet.html` copied verbatim** —
  pure SMIL (`<animate>`/`<animateTransform>`/`<animateMotion>`), no CSS
  keyframes at all, which is what the Brand Pack actually intended ("ready to
  paste"). Reduced-motion is now handled via the SVG's own `pauseAnimations()`
  method instead of CSS overrides, since SMIL has no CSS off-switch. This also
  fixed the mark rendering smaller than the design — the old version fixed the
  SVG's own `height` at a flat 300px (matching the source verbatim) with the
  wrapper never given a matching height, which produced letterboxing; the new
  version sizes via `width: 100%; height: auto` off the viewBox's intrinsic
  ratio, so it actually fills the space the `clamp(280px,24vw,360px)` wrapper
  gives it.
- **Header CTA button and Our-approach hamburger submenu.** (Covered in the
  previous entry below — see "Header CTA button had no rounded corners".)
  Additionally, **Chris decided the hamburger menu's Our-approach submenu
  (Key ideas / Modern Excel / Excel tips / Beyond Excel) isn't needed** —
  removed from the mobile menu only; the desktop hover dropdown is unchanged.
- **Contact page: Phone field stayed visible even when hidden.** Same root
  cause as the form/confirmation bug above, this time via a *class* rather
  than an id: `.field { display: flex; }` is an ordinary author rule, and
  author rules beat the browser's built-in `[hidden]` rule at equal
  specificity regardless of origin — so the Phone field's `hidden` attribute
  was doing nothing. Fixed with `.field[hidden] { display: none; }`.
- **Contact page: Email/Phone reply-preference buttons showed no pointer
  cursor.** They're `<label>` elements (for the visually-hidden radio inputs
  backing them), not `<button>`s — labels don't get a pointer cursor by
  default the way real buttons and links do. Added `cursor: pointer` to
  `.segmented-option`.
- **Missing space between "answer" and "we'll" on the contact page** (and the
  same bug found in one spot on the About page, "that Modern Excel"). Astro
  trims a newline-only gap between inline text and the start of a `<span>` on
  the next source line down to nothing, rather than collapsing it to a single
  space the way HTML normally would — a `{' '}` between them makes the space
  explicit. Worth checking for again if new copy is added with an inline
  `<span>` on its own line.
- **About page photo still cropped wrong after the first attempt.** Chris
  pointed out the design pack already ships a pre-cropped, correctly-framed
  photo (`design-pack/design/assets/chris-duff.png`, 620x775) — the first fix
  was still trying to *re-derive* that same crop from the uncropped source via
  a guessed `object-position` value, which was never going to reliably match
  what a human framed by eye. Switched to using the pre-cropped asset directly
  (copied to `src/assets/chris-duff.png`); `object-position` guesswork removed
  entirely. The lesson: prefer an already-correct design asset over
  reconstructing it, when one exists.

## 2026-09-06 — Reconciled the mark's composition against `design-pack/docs/Fix - Landing hero alignment.md`

Chris had Opus 5 (working in Claude Design, reviewing the actual Landing page source
rather than this codebase) write up the alignment mechanism and likely failure
modes independently, since it couldn't see this build's rendered layout. Worth
recording where that review and this repo's own state agreed and disagreed:

- **Confirmed already correct:** the card measured for alignment is
  `realCards[0]` — the *second* `[data-carousel-card]` element in the DOM (the
  first is the permanent ghost duplicate in the back peek). The doc flagged
  getting this wrong as the most likely bug; this build already had it right.
- **Not the actual cause, but worth having anyway:** the doc's other suspected
  cause was measuring only once, before `font-display: swap` finishes loading
  Manrope. This build's real bug (see the "transition timing" entry above) was
  a third failure mode the doc's author had no way to discover from text
  content alone. Added the staggered 120/400/900ms re-measurement anyway,
  matching the reference exactly, as cheap insurance against font-swap timing
  regardless.
- **Genuinely fixed something:** the doc's exact composition values
  (`viewBox="62 22 517 296"`, `width="100%" height="300"`, `overflow: visible`,
  `transform: translateX(-40px)`) came from the actual Landing page embedding,
  not the standalone `animated-mark-snippet.html` file. The previous fix had
  swapped to the snippet's own viewBox/sizing (`70 26 505 288`,
  `width:100%;height:auto`) to fix the broken cell-flash animation, and that
  incidentally changed the mark's crop and letterboxing too. Kept the
  snippet's animation content (still correct, still avoids the keyframe-name
  bug) but restored the Landing page's own viewBox and sizing around it — the
  two are independent (the `<animate>` tags use absolute coordinates that
  don't care which window the viewBox shows).
- Added an explicit `if (window.innerWidth < 720) return;` in `alignHero()` so
  the shift is never computed or applied in the single-column mobile layout,
  rather than relying on the overlap-safety-cap to coincidentally land near
  zero there.

## 2026-09-06 — Removed the hero/mark overlap safety cap; it was the actual bug

Chris reported the hero text sitting well *left* of the carousel card's edge —
undershooting, not overlapping. That's the overlap-safety cap added two entries
back doing exactly what it was built to do, just far too aggressively: at normal
desktop widths the "natural gap" it measured between the text and the mark's
*wrapper* box was small (~14px at one tested width), so the cap clamped the
shift to near zero regardless of how large a shift the alignment target actually
called for.

**Checked against the actual design file** (`Excel Automate Landing.dc.html`,
served locally and measured the same way) at 1440px width: it shows the exact
same large negative number for `markWrapper.left - text.right` (-102px) that
my uncapped version produces here. The reference doesn't cap the shift at all —
confirmed both by the doc Chris had Opus 5 write (which describes the mechanism
with no mention of any such safety net) and by this direct measurement. The
wrapper-bounding-box "gap" was never a meaningful proxy for real visual overlap
in the first place: the mark's wrapper box is mostly transparent margin around
the actual cog/grid graphic (the composition's own `-40px` translate exists
specifically to correct for viewBox padding), so a "negative gap" by that
metric doesn't mean the visible artwork actually collides with the text.

**Removed the cap entirely** — `alignHero()` now applies the raw computed
shift, matching the reference's own `_alignHero` exactly, with no capping.
The `z-index` safety net (text above mark) added earlier stays, since it's
harmless and free insurance if a genuine collision ever does show up at some
width. Screenshots were unreliable for a direct visual check while making this
change (an environment issue this session — even a brand new tab rendered
pages at a fraction of their real size), so **this is worth Chris explicitly
re-confirming at both a narrow-ish desktop width and something like 1440-1600px**
— flag it if the mark visibly sits on top of the text anywhere in that range.

## 2026-09-06 — The mark should never be transformed at all; the "does not move" line was literal

Chris reported the mark itself drifting left post-fix, causing the overlap it was
meant to avoid. Root cause, found by measuring the actual reference directly
(serving `design-pack/design/Excel Automate Landing.dc.html` locally and probing
both pages with the same script) rather than guessing further:

The reference applies `margin-left: S` to the text and `margin-left: -S` to the
mark — both **grid items in an auto-sized `grid-template-columns: auto auto`**.
Worked through the auto-track-sizing algebra and confirmed empirically (the
mark's rendered `left` was byte-identical whether its margin was -125px, 0px, or
back to -125px): **the two opposite margins exactly cancel out**, because each
one changes its own track's auto-computed size by the same amount it shifts the
item within that track. The net effect is that the mark's absolute position is
completely invariant to S — "the mark does not move when the text shifts" in the
spec (`design-pack/docs/Fix - Landing hero alignment.md`) is not a design intent
being *achieved* by the negative-margin step, it's *already true* before you
apply any margin to the mark at all, and the margin step is pure ceremony.

The transform-based version (adopted two entries back to dodge the
margin-collapses-the-grid-track bug) broke this: `transform` doesn't interact
with grid track sizing, so applying `translateX(-S)` to the mark genuinely moves
it left by S, with nothing to cancel it — worse the larger S gets, which is
exactly the growing leftward drift reported.

**Fix: stopped transforming the mark at all.** `alignHero()` now only ever
touches `text.style.transform`. Since transform never affects track sizing
either way, leaving the mark completely untouched lands it at the same
grid-determined position the reference's cancelling margins produce — for free,
no cancellation needed. Verified by direct measurement against the actual
design file at three widths (884, 1024, 1440px): `text.left` and `mark.left` are
now pixel-identical to the reference's own values at each one.

## 2026-09-06 — Two small visual bugs: CTA line font-size, About's "Chris"

- **"Learn more" body line looked small on About, Contact and For non-profits.**
  `.cta-band p` in `global.css` set line-height/margin/wrapping but never set
  `font-size` at all — the three plain (non-fitted) Learn-more lines on those
  pages were silently falling back to the 16px browser default instead of the
  design's `clamp(16px,1.8vw,20px)`, which reaches 20px on wider screens. Added
  the clamp as the rule's default; the fitted "Get in touch" lines
  (`data-fit-group`) still win via their own inline style from `cta-fit.js`, so
  this doesn't touch those.
- **About page: "Chris" was bold but not green.** `.accent` only gets a colour
  from context-scoped rules (`.hero-heading .accent`, `.prose-col .accent`,
  `.cta-band--dark p .accent` — the last deliberately a brighter green for the
  dark panel, so there's no safe single global fallback). "Chris" sits in the
  hero's second paragraph, inside neither `.hero-heading` nor `.prose-col`, so
  it matched no rule at all. Added `.about-hero .accent { color: var(--green); }`
  scoped in the page itself. Checked every other `.accent` usage site-wide —
  all the others already sit inside one of the three existing scopes.

## 2026-09-06 — Header lockup mark: fixed wrong intrinsic size attributes

Chris reported the curved feed lines in the header's mark looking noticeably more
pixellated than in the Claude Design preview. The SVG file itself
(`public/assets/img/excel-automate-mark.svg`) is a byte-for-byte copy of the
design pack's own asset — confirmed with `diff` against
`design-pack/design/assets/excel-automate-mark.svg` — and is pure vector (no
raster content), so the file itself isn't the issue.

Found: the `<img>` tag's `width="66" height="66"` attributes declared a square,
but the SVG's real aspect ratio is 505:288 (viewBox `70 26 505 288`, ~1.75:1) —
CSS renders it at `height: clamp(42px,6.4vw,66px); width: auto`, which at full
size is really about 116×66, not 66×66. Corrected the attributes to `width="505"
height="288"` (the file's actual intrinsic size) — `naturalWidth`/`naturalHeight`
now correctly report 505×288 instead of the wrong 66×66, matching the ~116×66
CSS-rendered box's proportions exactly instead of a squished square.

**Not fully verified visually** — screenshot rendering was unreliable in this
session (see the hero-mark entries above), so this is a confirmed, objectively
correct metadata fix, but Chris should confirm on the deployed site that the
lines are actually crisper now. If not, the next thing to try is inlining the
SVG directly in the page instead of loading it via `<img src="...">` — Build
Notes only requires that for the lockup-with-text SVG (to reach page fonts),
not the mark alone, but it would rule out any `<img>`-specific rendering
behaviour entirely.

## 2026-09-06 — Header mark: inlined the SVG instead of loading it via `<img>`

Following on from the previous entry: the intrinsic-size attribute fix didn't fully
resolve it. Chris did the decisive test — the mark looked smooth in this session's
Browser pane *and* in Firefox, but visibly more pixellated in his regular Chrome, at
the same displayed size. That points at a rendering-pipeline difference rather than
anything about the file: browsers can rasterise an `<img src="foo.svg">` through
their image-caching/scaling pipeline (various quality trade-offs, historically
including Chrome/Skia), whereas an **inline** `<svg>` element is painted as true
vector content directly, recalculated at whatever the actual on-screen size is —
this is exactly the distinction Build Notes draws for the lockup-with-text SVG
("inline it... an SVG in an `<img>` tag cannot reach page fonts"), just mattering
here for rendering quality rather than font access.

Replaced the `<img src="mark.svg">` in `Header.astro` with the same markup inlined
directly (same viewBox, same paths, same `.lockup-mark` CSS class — sizing is
unaffected, since `height`/`width`/`display` apply to an SVG root the same way they
do to a replaced `<img>`). The gradient id was renamed to `headerMarkFeed` to avoid
any collision with the landing page's separately-inlined animated mark (`eaFeed`),
since both now live in the DOM on that page at once.

Not yet re-confirmed in Chrome specifically (only checked in this session's own
Browser pane, which already looked fine even before this change) — worth Chris
checking the deployed site in his regular Chrome to confirm this actually closes
the gap, since that's the one browser that showed the problem.

## 2026-09-10 — 18 changes from Opus5's review in Claude Design

Chris relayed a dated, closed change list (`Changes - 10 September 2026.md`, from
his `docs/` folder — not copied into `design-pack/docs/`, it's a one-off work
order rather than a standing reference doc) covering all five pages. Implemented
all 18 items; the notable ones with real "why" behind them:

**CTA bands (#1).** Every band was a title (e.g. "Get in touch") repeating the
button word for word, plus a line underneath. The title's gone; the line is now
the `<h2>`, sized down (`clamp(24px,3vw,32px)`, weight 700) and allowed to wrap
(`text-wrap: pretty` — don't add `nowrap`). This made `cta-fit.js`'s canvas-based
fit-to-one-line measurement dead code everywhere it was used (all eight band
lines) — a heading that's allowed to wrap doesn't need a fitted size. Deleted the
script and its two `<script>` tags rather than leave it orphaned; the
`data-fit-text`/`data-fit-group` attributes were the last things referencing it.
Landing's dark band is the one exception — its heading (the three questions) is
followed by a real `<p>` subline before the button, grouped with a
`.cta-band-inner.has-subline` modifier that tightens the heading's bottom margin.
CTA band buttons went 17px→18px with 14px→12px vertical padding, scoped as
`.cta-band .btn` — **not** a change to the shared `.btn` base, which the Contact
page's "Send message" button and the article end-CTA button still use unchanged
(verified: still 17px/14px after this change).

**Nav rename + reorder (#2, #3).** "Our approach" is now "Learn more" in the nav
only — the page's own title, h1, route and section anchors are all unchanged by
design (the label is an invitation, the title says what the page is about). Since
`NAV_LINKS`/`NAV_HREFS` are keyed by the label itself (`NavLabel` type), the
rename meant updating every `current="Our approach"` prop and `NAV_HREFS['Our
approach']` reference across the site in the same pass — a genuine multi-file
edit, not just a string swap in one data file. New order: Home, For non-profits,
Learn more, About.

**Header spacing/breakpoint (#4) and lockup tagline (#5).** Row padding, the
logo-to-nav gap, and the inter-nav-item gap became `clamp()`s with a `calc()`
offset (a plain `vw` clamp is too shallow over the range — see the code comment
for the maths), and the burger breakpoint moved 1180px→1040px to match. Verified
at 1050/1240px the computed padding/gap hit the exact predicted pixel values.
Wordmark and tagline now shed together at one threshold (380px) instead of 220px
apart, which used to leave a wordmark-with-no-tagline gap.

**Button spec (#6, #7, #8).** Desktop header button and CTA-band buttons both
gained a hover lift + shadow; the burger menu's button stays colour-only (no
lift — "a 2px lift under a thumb is noise"), enforced with a same-specificity
`.mobile-nav-cta.btn-solid:hover` override since it shares `.btn-solid` with the
desktop button for colour. `.btn-solid-inverse`'s border now tracks its fill
through hover/active (it was invisible at rest and visible as a stray ring on
hover before — border-color just wasn't in step with background-color).
**Note:** the doc's stated rendered heights (159×52, 190×52, 143×49) don't quite
match what these actually render at (159×56.8, 190×56.8, 143×53.2) — the gap is
`line-height` (inherited `1.6` from `body`, never set explicitly on `.btn`/
`.nav-cta`, works out to ~1.33 for the doc's numbers to land exactly). The doc
never asked for a line-height change, and adding one would touch the Send
message/article-CTA buttons that change #7 explicitly says not to touch — left
alone. Width and every other property (font-size, padding, radius, colour,
transitions) match exactly; only the vertical figure is a few px taller than
stated.

**"Key ideas" jumps to the top (#9).** Its panel has no heading of its own — the
page h1 does that job — so scrolling straight to it read as landing mid-page.
Added `TOP_SECTION_ID` (`= SECTIONS[0].id`) in `data/sections.ts`; three separate
surfaces had to change together: the header dropdown's href (now the bare
`/our-approach/` URL, no hash — lands at the top naturally from anywhere else on
the site), a same-page click-intercept in `Header.astro` for when you're
*already* on that URL (a link to your own current URL doesn't navigate, so
nothing would happen without this — `window.scrollTo({top:0})` on click), and the
side-nav's Key-ideas link (`href="#top"` / `data-scroll-target="top"`, keeping
`data-section-nav-link="key-ideas"` so the IntersectionObserver highlight still
matches it — see the code comment in `section-nav.js`). A new `id="top"` on the
page's outer section is the actual scroll target. Old `#key-ideas` bookmarks
still resolve — `section-nav.js` overrides the browser's native anchor-scroll
back to the top when it sees that hash, using the same `[60,250,600]ms +
fonts.ready` staggered re-apply pattern as the existing tile-scroll-memory
restore (a single ~250ms re-apply wasn't reliably beating a late web-font-swap
reflow in testing — see `persistScroll()`).

**Coming soon tiles (#10) and their min-height (#17).** The twelve unwritten
articles' tiles lose their excerpt and gain a "Coming soon" line (same type as
"Read this →", deliberately no arrow — one says "goes somewhere", the other says
"not yet"); their article pages show a single "Coming soon" heading instead of
`<Content />`. Stripped the placeholder prose out of all twelve `.md` files down
to bare frontmatter — it was never rendered again after this change, and leaving
stale draft paragraphs sitting in the source is more confusing than useful for a
future AI session, not less. Added `min-height: 127px` scoped to
`.approach-panel:not(.approach-panel--green) .approach-tile` (i.e. everywhere
except Key ideas, whose three tiles have real excerpts and size to them) — it's a
**floor**, not a fixed height: a grid row containing the one two-line title
("Security warnings and enabling content") still naturally sizes taller than 127
and drags its row-mates up to match, exactly as intended.

**Carousel (#13, #14, #15).** Copy edits and a smaller `min-height` were simple.
The arrow-wrapping rewrite was not: the track now renders three full copies of
the five-card deck (fixed `COPIES = 3`, must stay odd and ≥3) and tracks an
**unbounded** `slotIndex` instead of a 0-4 card index, so `next`/`prev` can always
move exactly one card in the direction clicked without ever rewinding through the
deck to get there. A `recenter()` fold — 620ms after the *last* click, one timer,
always cleared and rescheduled — silently snaps `slotIndex` back into the middle
copy once the user stops clicking, with both the track's transform transition
*and* every card's opacity transition suppressed during the fold (`setNoAnim()`),
since the fold swaps which DOM node is "current" between two copies showing the
same card — with the fade left on, that swap flashes. Dots move by the direct
signed distance to the clicked card (`target - current`, no wrap), matching where
the dot sits on screen either side of the current card. Verified in-browser: 8
next-clicks land on the correct wrapped card every time, dots jump the direct
(sometimes backward) distance, and rapid-fire clicking (8 clicks at 80ms
intervals — faster than the 550ms slide) self-corrects via the modulo-based
recenter with no crash, matching the doc's own "test it by clicking through the
wrap quickly" instruction. No `<img>`/ghost card any more — replaced by the
repeated copies themselves; the two non-active copies carry `aria-hidden="true"
tabindex="-1"` so screen readers only see the five real cards once.

**Confirms, not changes:** #16 (Our-approach reveals stay once-only, Landing
still repeats) was already exactly this site's behaviour after the
`data-reveal-repeat` fix earlier this session (2026-09-10, above) — nothing to
do here, the doc's table just corroborates it independently.

**`design-pack/` is now stale relative to the live site for this batch.**
Checked whether Chris's OneDrive `design/*.dc.html` and `docs/` had actually been
updated to match, as the change doc's header claims ("already been updated...
if anything here disagrees with them, the designs win") — they hadn't: the
Landing `.dc.html` still has the old CTA title+line pattern, the old fitted-sizer
state fields, and `NAV_LINKS` in the old order with the old "Our approach" label;
`docs/Article - Whats Modern Excel.md` still has the "A new direction"
subheading. Did **not** copy anything from OneDrive into `design-pack/` this
round (there was nothing newer to copy — confirmed via `git status` showing no
diff after attempting the refresh). This means the "serve `design-pack/design`
locally and measure" technique in `CLAUDE.md` would give **wrong, pre-change**
numbers for anything covered by this batch until Chris re-exports the updated
`.dc.html` files from Claude Design into that OneDrive folder — flagged to him,
not silently worked around.

## 2026-09-10 — Pinned `line-height: 1.35` on every button and other Manrope UI chrome

**Corrects the "Note" in the entry above** ("18 changes from Opus5's review in
Claude Design" — the doc's stated button heights don't match ours). Opus5
diagnosed it properly: the reference designs set no line-height at all on body
text, so unset elements there render at the browser's normal line-height for
Manrope (~1.33); this build's `body` sets `line-height: 1.6`, and every button —
a fixed-padding box — inherited that, coming out ~5px taller than the design.
Fixed by pinning `line-height: 1.35` directly on `.btn` (global.css) and
`.nav-cta`/`.mobile-nav-cta` (Header.astro), which between them cover all six
button instances Opus5 named: the header button, the burger-menu button, both
CTA band buttons, the Contact page's two chips (they compose `.nav-cta`/
`.mobile-nav-cta` for geometry), the "Send message" form button, and the article
end-CTA. Verified in-browser afterward: header button 158.6×52.3px, burger
143×49px, CTA band button 190×52px — all within a third of a pixel of Opus5's
stated targets (159×52, 143×49, 190×52). Confirmed the "Send message" and
article end-CTA buttons kept their own 17px/14px sizing (change #7 said not to
touch those) and only got ~2px shorter from the line-height pin, exactly as
intended — they were the only two buttons still moving with the body's
line-height otherwise.

**Went further than the literal ask, on Opus5's own instruction** ("scan for any
[text elements] that don't [set line-height] rather than assuming buttons were
the only casualty... fix them per element"). Audited every `font-family:
var(--font-heading)` (Manrope) rule across every page and component for a
missing `line-height` — cross-checked a sample against the actual (stale but,
for pre-existing elements, still valid) design source `.dc.html` files to
confirm the mismatch is real, not imagined: e.g. `.services-head h2` and the
Contact form's segmented reply-preference buttons genuinely have no line-height
in the design either, so they render at the browser's Manrope default there,
but at 1.6 in this build. Pinned `line-height: 1.35` to fifteen more rules
sharing the exact same problem: `.field > span/label` and `.segmented-option`
(global.css); `.nav-link`, `.sub-menu-inner a`, `.mobile-nav-link`
(Header.astro); `#contact-thanks h2`, `.text-link` (ContactForm.astro);
`.carousel-card h2` (Carousel.astro); `.side-nav-link` (both
`our-approach/index.astro` and `[slug].astro`); `.read-this`, `.coming-soon`
(`our-approach/index.astro`); `.back-link` (`[slug].astro`); `.services-head h2`,
`.service-tile h3` (`index.astro`); `.contact-detail-label` (`contact.astro`).
Added a comment on `body` in `global.css` pointing at this as the pattern to
watch for, per Opus5's warning that "the same inheritance reaches anything else
that doesn't state its own line-height."

**Deliberately left alone, flagged instead of guessed at:** `.field input`
(shared with `.field textarea`, which already has its own explicit
`line-height: 1.6` — only the plain `input` rule is unset) and `.field-error`
inherit **Public Sans** (`--font-body`), not Manrope — Opus5's 1.35 figure was
derived specifically for Manrope's metrics, and I don't have an equivalent
verified value for Public Sans. `.contact-detail-value` (`contact.astro`) is
also unstyled `font-family`, so also Public Sans. `.lockup-tagline`
(Header.astro) uses `--font-wordmark` (Space Grotesk), a third font again. All
four are small, non-fixed-height text (not buttons, not measured against a
spec), so the practical risk of leaving them is low - but the right fix, if
Chris wants one, needs Opus5 (or a similar reference-vs-build measurement) to
derive the correct per-font value rather than reusing 1.35 on a guess.

## 2026-09-10 — Route renamed: `/our-approach/` → `/learn-more/`

Chris asked for the URL to follow the nav label rename (above): the earlier
decision was deliberately label-only ("the label is an invitation, the title
says what the page is about... don't sync them") but that was about the page's
*title and h1*, not its address — Chris wants the address to match the label
after all. Moved `src/pages/our-approach/` to `src/pages/learn-more/` (plain
filesystem move, nothing had been committed yet so there was no git history to
preserve with `git mv`) and updated every internal href that pointed at the old
path: `NAV_HREFS['Learn more']` and all four `OUR_APPROACH_SUB` entries in
`data/nav.ts`, the hub page's article tile links, and the article page's back
link, side-nav links and end-of-article CTA link in `learn-more/[slug].astro`.

**What didn't move:** the page's `<title>` ("Our approach - Excel Automate |
Hobart"), its h1 ("Our approach to Excel"), the section ids (`#key-ideas` etc.),
and the content collection folder (`src/content/articles/` — collection folder
names are internal to Astro's content layer, never part of the URL, so renaming
it would have been pure churn). The `OUR_APPROACH_SUB` constant name and
various code comments referring to "the Our-approach page" also stay as-is,
since that's still an accurate description of what the page *is* — only its
address changed, same as how a person's home address changing doesn't rename
the person.

Verified: `npm run build` produces every article under `/learn-more/<slug>/`
and nothing under `/our-approach/` any more (grepped `dist/` for `our-approach`
— zero hits); in the dev server, the nav link, header dropdown, hub-page tiles,
an article's back link, its side-nav, and its end-of-article CTA all resolved
to the new path; the old `/our-approach/` path now 404s (expected — no redirect
was added, since the site is still `noindex`/pre-launch and nothing external is
likely to be linking to the old path yet; worth adding a redirect instead if
that's no longer true by the time this ships).

## 2026-09-10 — The remaining un-pinned fonts: Public Sans 1.18, Space Grotesk 1.27

Follow-up to the two entries above. Opus5 measured the other fonts' own normal
line-height (at 100px, to avoid small-size rounding) rather than letting me
guess by extrapolating from Manrope's 1.35 — the two aren't the same font and
the ratio doesn't transfer.

**Public Sans (`--font-body`) → 1.18** — `.field input` (shared rule with
`.field textarea`, which keeps its own deliberate `1.6` override for
multi-line text), `.field-error`, `.contact-detail-value`. Per Opus5, **this
was the bigger find of the two rounds, not the buttons**: the design's text
inputs set no line-height either, giving a 19px line box → 48px input (19 +
26px padding + 3px border). Inheriting this site's 1.6 instead gave a 25.6px
line box → ~54.6px input, 6.6px taller than designed, across every field in
the contact form. Verified in-browser after the fix: the "Your name" input
renders at 46.9px (target 48px, close enough that the gap is sub-pixel
rounding, not a wrong value).

**Space Grotesk (`--font-wordmark`) → 1.27** — `.lockup-tagline` only. The
wordmark above it (`.lockup-word`) already pins `line-height: 1` in the
design, deliberately — that's what sets the lockup's own vertical rhythm, and
stays untouched. Verified: tagline computes to `14.6px` line-height at its
`11.5px` max font-size, i.e. exactly `1.27`.

**Left alone, deliberately:** Manrope stays at `1.35` even though Opus5's
fresh measurement puts its true normal factor at `1.37` — 1.35 is what
shipped and is what the documented button heights (159×52 etc., see the
entry above) were measured against; correcting it now would move every
button by 0.4px and make those numbers wrong again for a smaller gain than
leaving it. Spectral (`.carousel-card p`, the only place it's used) already
sets `line-height: 1.75` — looser than its own `~1.52` normal, but that's the
design's own choice for that card's italic pull-quote-style text, not a
casualty of the body's 1.6; not touched.

## 2026-09-10 — Fixed: scroll reveals below the fold silently lost their animation

Chris reported it on the For non-profits page specifically ("I see it once for
'Moving between platforms' but not for anything below that"), but the bug was
in `reveal.js` and affected every page. The "safety net" `setTimeout(revealAll,
2500)` — meant only to cover the case of `IntersectionObserver` genuinely
failing — was never cancelled, so it fired unconditionally 2.5 seconds after
every page load and instantly marked *every* `[data-reveal]`/`[data-reveal-tiles]`
element as revealed, including ones the visitor hadn't scrolled anywhere near
yet. In practice: read the hero and first section for more than ~2.5 seconds
(entirely normal), and everything below that point had already been silently
force-revealed by the time you scrolled to it, so it just appeared with no
animation — exactly the "works for the first one or two, then stops" pattern
reported.

Fixed by making the safety net conditional: it now only actually reveals
anything if the very first `[data-reveal]` target on the page (always the
hero/intro section, always visible on load) still hasn't been revealed by
2.5s, which would mean IO isn't working at all. If it has been revealed — the
normal case, proving IO is working — the safety check is a no-op and every
other section is left to reveal whenever the visitor's own scrolling actually
brings it into view, no matter how long that takes.

Verified in-browser: sitting at the top of the page for 3.2s (past the old
2.5s trigger) no longer reveals anything below the initial viewport; scrolling
to a distant section afterwards still reveals it normally.

## 2026-09-10 — Carousel: only the current card is exposed to assistive tech

Claude Design's review flagged it: the carousel renders three full copies of
the five-card deck (15 slots) so the arrows can always wrap in the direction
clicked (see the carousel rewrite entry above), but all 15 sat in the
accessibility tree at once — a screen reader read all five card titles/bodies
three times over, and the two visible "peek" cards either side of the current
one were exposed too, even though they're decorative previews with the dots as
the real navigation.

`Carousel.astro`'s server-rendered `aria-hidden`/`tabindex` (middle copy
exposed, the other two hidden) was only ever a pre-JS starting point - fixed
by having `carousel.js`'s `render()` narrow this down further on every call,
driven off the same distance-from-`slotIndex` value that already sets each
card's opacity: distance `0` (the current card) gets `aria-hidden` and
`tabindex` removed entirely; everything else, including the two `0.4`-opacity
peeks, gets `aria-hidden="true"` / `tabindex="-1"`. Per the same instruction:
never sets `aria-hidden="false"` on the current card, just omits the attribute.
This also fixes a subtler bug the static per-copy version had: mid-navigation,
before a recentre fold, the actually-current card could sit in a copy the
static markup had marked hidden, while four non-current cards in the "visible"
copy stayed exposed - the new version tracks the *real* current card
regardless of which copy it's currently sitting in.

Verified in-browser: initial load has exactly one exposed card (`aria-hidden`
null) with the rest (including both peeks) hidden; after a `next` click, the
newly-current card loses its `aria-hidden` and its former self (now a peek)
gains one. Confirmed the arrows (`aria-label="Previous"`/`"Next"`) and dots
(`aria-label="Show <card title>"`) already had accessible labels - Claude
Design asked to check since they become the real navigation once the cards
are hidden.

## 2026-09-10 — noindex and robots.txt now derive from `site`, not manual edits

Claude Design flagged the risk directly: `noindex` shipping to production by
accident because someone forgot the manual removal step. Both `BaseLayout.astro`'s
`<meta name="robots">` tag and (new) `src/pages/robots.txt.ts` now check
`Astro.site`/`site` against the known GitHub Pages staging hostname
(`excelautomate.github.io`) and only apply their staging behaviour
(`noindex, nofollow` / blanket `Disallow: /`) while it matches. This rides on
`astro.config.mjs`'s `site` field, which the README's "Before the Netlify
launch" checklist already requires updating as an *unavoidable* step (the
domain literally doesn't work without it) - so both flip to production
behaviour for free the moment that happens, with nothing extra to remember.

`public/robots.txt` (a static file, couldn't carry the same logic) is deleted
in favour of the new `src/pages/robots.txt.ts` endpoint, which also adds a
`Sitemap:` line pointing at `@astrojs/sitemap`'s output once live (there was
no point adding one while everything was disallowed).

Canonical URLs and `og:image` were already built from `Astro.site` (see the
"Full rebuild" entry, 2026-09-06) - confirmed, not changed, that these need no
separate fix: they'll automatically resolve to the real domain the same moment
`site` is updated.

Verified by temporarily pointing `site` at a placeholder real domain and
rebuilding: `noindex` disappeared from all 21 pages, `robots.txt` flipped to
`Allow: /` plus a `Sitemap:` line, and canonical/`og:image` correctly resolved
to the new domain with no `/website` base prefix - then reverted
`astro.config.mjs` back to the GitHub Pages staging config (confirmed via
`git diff` showing no changes) before committing anything.

Updated README.md's deploy steps and checklist to match - `noindex`/
`robots.txt` are no longer listed as their own checklist items, since they're
consequences of the `site` update rather than separate steps.

## 2026-09-10 — Confirmed: no canvas-measuring / fit-to-width text sizing remains

Claude Design asked for confirmation that `cta-fit.js`'s canvas-based
measure-and-shrink-to-fit routine (deleted as part of the CTA band rewrite,
2026-09-10 above, once the lines it measured became headings allowed to wrap)
didn't leave anything behind that could fight with the plain `clamp()`/fixed
sizes now used everywhere. Grepped the whole `src/` tree for
`measureText`/`getContext('2d')`/`data-fit`/`fitCtaText`/`canvas` - the only
hit is this file's own prose describing the removal, in a `global.css`
comment. Nothing live remains.

## Still open (raised for Chris, not decided here)

- **GitHub Pages base path.** `astro.config.mjs` assumes `site: excelautomate.github.io`,
  `base: /website` (matching the current repo name). Update both — and drop `base`
  entirely — once `excelautomate.com.au` is connected.
- Everything already listed as open in the design pack's own Build Notes (phone
  number — resolved above as "none" — analytics, and the Our-approach reveal
  replay question — resolved above as once-only).
