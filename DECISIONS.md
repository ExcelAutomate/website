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

## 2026-09-06 — "Get in touch" CTA line sizing: went with the fitted JS, not plain clamp()

`docs/Design Decisions - Landing page.md` has a note dated 6 September 2026 saying the
green CTA band's line "is now plain `clamp(16px,1.8vw,20px)`... matching the bands on
Our approach, For non-profits and About." But the actual `.dc.html` source for **all
four** of those pages still uses the canvas-measured `_fitFontSize` sizer for that
exact line, as of the files handed over. Build Notes says design files are the
executable reference ("open them in a browser to see the real thing"), so I went with
what the design files actually do — a shared `src/scripts/cta-fit.js` used on Landing
(both its Get-in-touch line and its two Learn-more lines), Our-approach, For
non-profits and About's Get-in-touch line. **Flagging this discrepancy for Chris** —
if the decisions note is the one that's current and the design files are stale, this
should switch to plain `clamp()` everywhere instead.

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

## Still open (raised for Chris, not decided here)

- **GitHub Pages base path.** `astro.config.mjs` assumes `site: excelautomate.github.io`,
  `base: /website` (matching the current repo name). Update both — and drop `base`
  entirely — once `excelautomate.com.au` is connected.
- **The CTA-line-sizing discrepancy above** between the Landing page's Design
  Decisions note and its actual `.dc.html` source.
- Everything already listed as open in the design pack's own Build Notes (phone
  number — resolved above as "none" — analytics, and the Our-approach reveal
  replay question — resolved above as once-only).
