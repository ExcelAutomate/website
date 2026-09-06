# Build Notes — Excel Automate website

Implementation guidance for whoever builds the production site. This file covers
**how to build**. What it looks like and what it says live elsewhere.

This is v3. It replaces the original single-page version of this file. It was written when
the landing page was the only page; it is now structured so that site-wide rules
and page-specific rules are separated, and so adding a page means adding one
section rather than rewriting anything.

| Document | Covers |
| --- | --- |
| `Brand Brief` | Colours, typography, logo rules, motion character, and a **Patterns** section with exact spacing, component states, timings and breakpoints |
| `Content - <page>.md` | Every word on that page, with its constraints |
| `Design Decisions - <page>.md` | Non-standard choices on that page and why — read before "fixing" anything |
| `assets/` | The logo mark, favicons and the animated-mark snippet the site needs |
| This file | How to build it |

**The design files are design artefacts, not production code.** They demonstrate
precisely how each page should look and behave and they run in a browser, but
they are written for a design tool's component runtime with inline styles. Treat
them as the specification to build against — match them visually and
behaviourally, don't try to lift them.

---

# Part 1 — Site-wide

## Who maintains this

**No human developer will be involved at any stage.** The site is built and
maintained by AI, directed by the owner, who is not a developer and cannot read
or debug the code.

This is the most important constraint in this document. It means:

- **The owner is the only safety net, and cannot inspect the work.** Optimise
  for not needing rescue, not for elegance.
- **Every AI session starts with no memory.** Only what is written down in the
  repository carries forward. Undocumented decisions are lost decisions.
- **Prefer boring and mainstream over clever.** Well-established tools that any
  model knows thoroughly. An obscure or very new library is a liability when the
  only person who can debug it is an AI working from training data.
- **Fail loudly.** A broken build with a clear error the owner can paste to an
  AI is far better than a silent misrender they won't notice.

### Required, because of the above

1. **Pin dependency versions and commit the lockfile.** An unpinned dependency
   that updates six months from now produces a broken site and no explanation.
2. **Keep a `DECISIONS.md` in the repo.** One short entry per significant
   choice: what was chosen, and why. Append, don't rewrite. This is the memory
   the next session won't otherwise have.
3. **Keep a `CHANGELOG.md`.** Plain language, dated, owner-readable — what
   changed and what to look at to confirm it worked.
4. **Write a `CHECKS.md`:** a short visual checklist the owner can run in a
   browser after any change. Five to ten items, phrased as what to look at and
   what "correct" looks like. No terminal, no devtools. Add a line per page as
   pages are added; see each page's section below for what to check.
5. **Comment the non-obvious.** Not what the code does — why it does it that
   way. Future AI sessions read these comments as their only context.
6. **Use Netlify deploy previews.** The owner should see a change before it is
   live, on a URL they can open on their phone.
7. **Keep the dependency count low.** Every package is something that can break
   unattended.

## Target

- **Hosting:** Netlify, static.
- **Stack:** Astro is the intended choice; Tailwind optional but expected.
- **Browsers:** current versions of Chrome, Edge, Firefox and Safari, desktop
  and mobile. No IE, no legacy Safari.
- **Site shape:** a small marketing site. All five pages now exist as designs:
  Landing, Our approach, For non-profits, About and Contact. Build so adding a
  page is still cheap.

## Non-negotiables

These are the things that will be wrong if left to default behaviour.

1. **Ship as little JavaScript as possible.** The whole site's interactivity is
   one carousel, a burger menu, a contact form and some scroll reveals. That does
   not warrant a client-side framework runtime. Prefer plain JS over a hydrated
   island.

2. **Honour `prefers-reduced-motion`.** When set, stop the cog rotation and the
   travelling dots, and disable the scroll reveals (show content in its final
   state immediately). The carousel should still change cards, just without the
   slide transition. This is not optional.

3. **Use `IntersectionObserver` for scroll reveals.** The landing page reference
   measures scroll positions because of constraints in the design tool. That is
   not the right approach in production. The contact page reference already uses
   `IntersectionObserver` — follow that one.

4. **Keyboard and screen reader access.** Carousel arrows and dots must be real
   buttons, reachable by tab, with visible focus. The nav must be operable
   without a mouse, including the burger menu. Form fields need real labels.
   Decorative SVG gets `aria-hidden`.

5. **Absolute URLs for `og:image`.** The reference pages use a relative path
   because they have no domain. Social platforms require the full `https://` URL
   — fix this at build time or hardcode it once the domain is known.

6. **Site basics that have no design to prompt them.** A styled 404 page (Netlify
   serves `404.html` automatically), canonical URLs, `sitemap.xml` and
   `robots.txt`. None of these appear in any reference file, so they will be
   missed unless listed. The 404 page should use the shared header and footer.

## Shared components

These appear on every page and should be built once.

### Header

Identical across pages, and built **once** — the reference pages each carry their
own copy because they are standalone files, which is a constraint of the design
tool, not a design decision. In production the header (lockup, nav, dropdown,
burger menu and CTA) is one component, and the nav's items and destinations come
from a single config.

The mark is `assets/excel-automate-mark.svg`, loaded as an image. The wordmark
beside it is real text, not part of the image: it needs Space Grotesk, and the
tagline below it drops out at 640px.

**"Our approach" carries a dropdown** listing its four sections — Key ideas,
Modern Excel, Excel tips, Beyond Excel — which link to anchors on that page. The parent link
opens the page itself. In the reference it opens on hover only; **it must also be
keyboard operable in production** (focus opens it, Escape closes it, arrow keys
or tab move through the items), and the sub-items need to stay reachable when the
nav collapses to the burger menu — there they render as an indented list.

Collapses to a burger menu below 1180px — driven by the nav's content width, so
if nav items are added or renamed, re-check the threshold rather than trusting
the number. The lockup sheds its tagline at 640px and its wordmark at 420px. The
lockup links to the landing page.

The nav's four items are Home, Our approach, For non-profits, About, in that
order. The active page's nav item carries the underline; on pages not in the nav,
no item is active. Labels are sentence case — see `CLAUDE.md`.

In the reference pages, destinations live in a small map keyed by label, so items
without a page yet render as inert links. Build the production nav the same way
or from a single config; do not hardcode hrefs in two places.

**The header CTA differs by page.** On every page except Contact it is a solid
green button. On the Contact page itself it is a flat, non-interactive chip — you
are already there. Build it as one component with a "current" state.

### Contact CTA band

Appears on four of the five pages - not the contact page, which would be pointing
at itself. **Heading and button are both "Get in touch" everywhere.** The line
between them is written for the page it sits on and is not a site default:

| Page | Line |
| --- | --- |
| Landing | Have a problem that might be looking for an Excel-shaped solution? |
| Our approach | Have some ideas about how this could work for you? |
| For non-profits | Could your organisation use some help with its processes? |
| About | Think we might be able to help with something? |

All four are questions with no closing sign-off - the button is the call to
action, so a "let's chat!" before it says the same thing twice. Keep that shape
for any new page.

**The line's font size is measured, not clamped.** A canvas measurement picks the
largest size between 14px and 20px that fits the band width on one line; wrapping
is allowed, so a long line wraps rather than shrinking past the floor. All four
pages use this. The landing page's "Learn more" band uses the same mechanism.

### Footer

Identical across pages. Single centred line, tint background.

### Scroll reveals

Fade plus a 26px rise, 0.7s, firing at 92% of the viewport. Grids of cards
stagger 90ms apart; single blocks come in as one unit.

Build this once, as an `IntersectionObserver` utility applied by attribute.
Two rules learned the hard way in the contact page reference:

- **Only ever add to the revealed set.** An implementation that could un-reveal
  an element caused a render loop that left the whole page invisible.
- **Include a timeout safety net** (about 2.5s) that reveals everything
  regardless. If observation fails for any reason, content must appear rather
  than stay hidden.

Whether reveals replay on scroll-back is a per-page detail; see below.

### Layout widths

- Page content: max 1240px, centred, 24px side gutters.
- CTA copy: max 720px, centred.

**There is no site-wide content spine.** The landing page's hero alignment is
derived from the carousel card's left edge and was balanced against the carousel
specifically. It does not apply to other pages, and it should not be implemented
as a shared layout value — an earlier version of this file asked for exactly
that, which was wrong. Other pages use the standard centred container.

### Page heading scale

Aligned 6 September 2026. **Our approach, For non-profits, About and Contact all
use the same hero scale:** h1 `clamp(38px,5.2vw,58px)`, standfirst
`clamp(17px,2vw,21px)`, section top padding `clamp(56px,9vw,100px)`. Our approach
was previously 50px/19.5px/64px and For non-profits 54px, which left the two
content pages with visibly smaller, higher titles than the rest.

**The landing page keeps a larger top padding** (`clamp(56px,10vw,120px)`) because
its hero carries the animated mark beside the text and needs the room. Its h1
matches the others at 38 → 58px.

### Cards and tiles

**The hover lift is reserved for clickable cards.** A card that rises and deepens
its shadow under the cursor is making a promise — it reads as an affordance, and
a visitor who clicks and gets nothing learns to distrust the signal everywhere
else on the site.

The rule:

- **Clickable card** — white surface, 18px radius, `0 2px 10px rgba(20,40,30,0.06)`
  at rest, lifting 4px to `0 16px 34px rgba(20,107,61,0.16)` on hover over 0.3s.
  The whole card is the link target, not just its title.
- **Static card** — identical surface and shadow, no transition, no hover state.

The landing page's six service tiles originally had the lift and were not
clickable. It was removed for exactly this reason; **don't add it back** unless
they are given destinations. The Our approach article tiles keep it, because they
are links.

### Buttons

Two variants only, identical geometry — see the brief's Patterns section for
exact values. Solid on the green band, ghost on the near-black band, never both
in one section. **Don't invent a third variant.** Where a third level of emphasis
is needed, use a text link; the contact page's "Back to the form" does this.

## Adding a new page

1. Read that page's `Content - <page>.md` and `Design Decisions - <page>.md`
   first. The decisions file exists to stop you "fixing" deliberate choices.
2. Reuse the shared header, footer and reveal utility. Don't re-implement them.
3. Follow the brief's band sequence rule: no two adjacent bands share a
   background, unless two bands are deliberately meant to read as one block —
   the landing page's hero and carousel share off-white for exactly that reason,
   with a deliberately tightened gap between them. The sequence itself is
   per-page.
4. Add the page to the nav if it belongs there, then **re-check the 1180px burger
   breakpoint** — it is driven by the nav's content width.
5. Add og: tags, including an absolute `og:image` URL.
6. Add a line to `CHECKS.md` and an entry to `CHANGELOG.md`.
7. Add a `## <page>` section to Part 2 of this file with anything page-specific.

---

# Part 2 — Per page

## Landing page

Reference: `Excel Automate Landing.dc.html`.

### Carousel

Full behavioural spec is in the brief's Patterns section. The parts that are
easy to miss:

- A **duplicate of the last card** sits permanently in the left peek, so the
  layout never shifts when the back button appears.
- **Both edges carry the same white gradient.** Only the `<` chevron is
  conditional — hidden and inert on the first card.
- Once the deck has **wrapped past the end**, back stays available permanently
  and wraps backwards too.
- The **forward peek is 1.3× the back peek**, deliberately, to draw the eye on.
- The deeper forward peek **widens the whole carousel** rather than shrinking the
  active card. That was an explicit choice; don't reclaim the width from the card.

Rebuild this as plain JS driving a transform on the track. Add touch/swipe if
it's cheap to do — the reference has no swipe handling and it should.

### Hero

**The headline reads "Make Excel / work for you"** (changed 6 September 2026 from
"Less time / more value"), breaking after "Excel", with "work" in green.

The copy aligns to the carousel card's left edge plus half a card padding. In the
reference this is measured at runtime. Implement it as a value local to this
page — it is balanced against the carousel and is not shared with other pages.

The animated mark is inline SVG (see `assets/animated-mark-snippet.html`) and
hides below 720px. Only one animated instance per page.

### Reveals

The landing page's reveals replay when scrolled back to. Worth keeping, but not
worth fighting for.

### Hero and carousel spacing

The gap between the hero and the carousel is deliberately tight — reduced 30%
from the standard rhythm, taken off both sides of the boundary. Together with the
shared off-white background this makes them read as one opening block. Don't
normalise it to the standard band spacing.

### Carousel card lengths

**The five cards share a fixed height**, so length differences show. Card 5
("Transform") is currently one short sentence against Card 3's four lines, which
leaves the peek edge light on that card. Chris is aware; **don't rewrite it to
even things up** without asking.

### Service tiles

Titles are **sentence case** - "Power Query automation", "VBA automation", "Data
cleansing", "Data migration", "Reports and dashboards", "System design". Only
"Power Query" keeps its capitals, as a product name. Changed 6 September 2026
from Title Case.

### Destinations

The three "Get in touch" buttons — header, burger menu, and the green CTA band —
all go to the contact page. "Learn more" goes to the Our approach page.

### Check

Carousel pages and wraps, back button appears after the first card, cogs turn,
burger appears when narrow, hero copy lines up with the card edge, "time" is the
green word in the headline, footer reads correctly with the current year.

## Contact page

Reference: `Excel Automate Contact.dc.html`.

Two-column layout: intro copy and contact details left, form card right. The
column ratio is uneven (1fr / 1.44fr) and the intro block's `max-width: 468px`
is load-bearing for two line breaks. Read the decisions file before touching
either number.

### Reveals

Once-only on this page — they do not replay on scroll-back. This is deliberate
(see the shared component note above about un-revealing).

### Contact form

Not connected to anything in the reference. It validates and shows its
confirmation state locally, and nothing is sent.

**Delivery - a submission emails Chris.** Netlify Forms is the path of least
resistance on this stack: add `data-netlify="true"` and a `name` to the form, then
set an email notification to `hello@excelautomate.com.au` in the Netlify UI.
**Set the notification up, or he will never see a submission** - the dashboard
copy is a backstop, not a workflow. Set `reply-to` to the sender's address so
replying from the mail client just works. If more control over the email is
wanted, the alternative is a Netlify Function posting to a transactional sender
(Resend, Postmark).

**Required fields: name, email, and message.** All three must be filled, and the
email syntactically valid, before the form can be sent - either keep the button
disabled or block the submit with inline messages. Organisation is optional and
says so in its placeholder. Phone is required only when "Phone" is the chosen
reply preference. **The Email field stays visible and required either way** - a
written address is wanted regardless of how they'd like to be contacted.

**Fields.** Name, Organisation, Email, Message, a reply preference, and Phone.
Exact labels are in `Content - Contact page.md`.

- The reply preference is Email (default) or Phone, built as two buttons rather
  than a radio group, with the selected state using the icon-tile green fill and
  a brand green border. **Back it with a real radio group or hidden input** so
  the value actually submits and the control is keyboard-operable - the reference
  is visual only.
- The Phone field appears only when Phone is selected.

**Validation.** Native HTML validation is enough: `required`, `type="email"`,
`type="tel"`. Don't add a validation library. Show errors inline, next to the
field, in the brand green family rather than a new red - or if red is needed for
clarity, agree it with the owner first, since the brief says not to introduce new
accent colours.

**Spam protection - keep it light. No CAPTCHA.** The volume does not warrant
making a real enquirer prove themselves, and this form is the one action the page
exists for. Two shape checks plus Netlify's own filtering:

1. **Honeypot.** Netlify Forms supports this directly:
   `netlify-honeypot="bot-field"` plus a visually hidden input of that name.
   Anything that fills it is dropped **silently** - never tell the sender it
   failed.
2. **Minimum time on form.** Record the mount time and reject submissions made in
   under about three seconds. Bots post instantly; people don't.
3. **Netlify's built-in spam filtering** (Akismet) is on by default with Forms.
   Leave it on - it is the main reason to use Forms over a hand-rolled endpoint.

A `sessionStorage` cap is worth adding against accidental double-sends, but it
stops nothing malicious - a bot doesn't run our JavaScript.

**If abuse ever happens**, escalate in this order: rate limit server-side (a
Netlify Function rejecting more than ~3 submissions per IP per 10 minutes), then
Netlify's reCAPTCHA or Turnstile, which can be switched on without touching the
markup. Don't do either pre-emptively.

**Success state.** The reference swaps the form for a confirmation inside the same
card, so the page doesn't jump. Netlify Forms redirects to a thank-you page by
default; either point it at a page that matches this design, or intercept the
submit with a small fetch and keep the in-card confirmation. The second is closer
to the design and is a few lines of plain JS. **On failure, show the error in
place and keep everything they typed** - never clear the form.

**Reply time.** The confirmation and the left pane both say "within a day or two"
(changed 6 September 2026 from "within one business day" - a firm promise to a
stranger is the one line on the site that can fail by itself). If that wording
changes, change both.

**Email addresses.** `hello@excelautomate.com.au` is the address shown on the site
and the destination for form submissions. `chris@excelautomate.com.au` exists for
mail Chris sends himself, and is not published on the site. Both point at the
same inbox.

**Privacy wording.** Deliberately absent. A business under the $3M turnover
threshold is generally exempt from the Australian Privacy Principles, and the
form collects work contact details from prospective clients only. **Revisit if
analytics, a mailing list, or any tracking is added.**

### Check

Form submits and a confirmation appears in place of the form, a test submission
arrives by email, Phone field appears when Phone is chosen, Email field is still
there when it does, first paragraph breaks after "simplify," at a wide window,
burger appears when narrow.

## About page

Reference: `Excel Automate About.dc.html`.

Prose page, no interactive components beyond the shared header and reveals.
Every block sits in one 820px centred column, hero included, so all left edges
align. The hero is two columns within that: copy, then a fixed 310px photo
track, top-aligned, stacking below 900px.

**The photo is real** as of 6 September 2026: `assets/chris-duff.png`, cropped to
the slot's 4/5 shape with `object-position: 50% 30%` so the framing favours the
face. Give the `<img>` width and height attributes in production, and **export a
JPEG or WebP at around 620px wide** - the file in the design folder is a PNG and
heavier than a photo needs to be. `assets/chris-duff-source.jpg` is the original,
kept so the crop can be redone.

**The page ends with two CTA bands**, not one: the green "Get in touch" band, then
the dark "Learn more" band going to Our approach (added 6 September 2026, matching
For non-profits and the landing page).

Reveals are once-only here, same as the contact page.

### Check

The photo sits right of the copy and stacks below it when narrow, the h1 and both
h2s all start at the same left edge, "About" is underlined in the nav, the green
CTA band button goes to the contact page and the dark one to Our approach, footer
reads correctly.

## Our approach page

Reference: `Excel Automate Our Approach.dc.html`.

The content hub: four sections (Key ideas, Modern Excel, Excel tips, Beyond
Excel) on a single scroll, with a sticky section nav beside them and a grid of
article tiles in each. Read
`Design Decisions - Our approach page.md` before changing the layout or the
section highlight — several approaches were tried and rejected there.

### Sections and panels

Each section is a rounded panel with its own background (green, tint,
near-black, tint) on the page's off-white band, not a full-width band. The
section nav is a white card so it stays legible against all of them.

The hero shares the content column with the panels, with the section nav beside
it — don't give the hero its own full-width section, the left edges must align.

The first panel ("Key ideas") has a larger gap beneath it than the other three,
separating the featured pieces from the browsable material.

**Pre-launch, the three panels after Key ideas are permanently dimmed to 45%** -
Modern Excel, Excel tips and Beyond Excel. Their articles are all placeholder and
the site is going out as a soft launch with Key ideas as the only real content.
The tiles stay in place and stay clickable, so the sections read as "not yet"
rather than absent, and the page standfirst carries the signal once at the top
("We'll be adding to the other sections over time") instead of a badge per tile.

Previously only the Modern Excel panel dimmed, at the same 45%, and any hover or
keyboard focus cleared it permanently for the session. **Reinstate that behaviour
once the later articles have content** - the logic class carries the exact steps
in a comment above `undim`, and the page's decisions file repeats them. Note that
Excel tips is the near-black panel, so the dim costs more contrast there than in
the two light ones.

Sections are written out explicitly in the template rather than looped, so each
one's colours and copy are directly editable. Keep it that way.

### Articles

**Article bodies are structured, not just paragraphs.** Four element types are
supported and in use: paragraphs, section headings (h3, Manrope 700,
`clamp(20px,2.3vw,25px)`), bulleted lists with green bullets and a hanging
indent, and an end-of-article CTA button. A paragraph can also carry a trailing
inline link to another article. Copy for the written articles lives one file per
article in `docs/Article - <title>.md`.

**Not every article ends with a CTA, and that is deliberate.** "What's Modern
Excel?" ends with a green button to "Why Power Query?" because that is the
natural next read and the tool the business is built around; the other two end at
the back link. Don't normalise this.

**The contact band does not appear in article view** - only on the section index.

**In production each article is its own URL.** The reference renders the article
in place of the section list so all 15 can be reviewed in one file, but every
tile is already a real link with a real href — converting to routed pages is a
template change, not a rewrite. Once they are real pages:

- Give each one its own title and meta description, and og: tags.
- Keep the two back links (top and foot of the article).
- The reference restores the reader's exact scroll position on going back. With
  real pages the browser does this for free, so that code goes away.
- Some articles may embed video. Lazy-load embeds; don't let a YouTube iframe
  load on a page where nobody plays it.

### Scroll reveals

Same timings as the rest of the site: text and section panels fade and rise 26px
over 0.7s; tiles use 0.65s and stagger 90ms apart.

**Stop and ask Chris whether the reveals should re-arm on this page.** This is a
question for whoever builds the site to put to him before writing the code, not
a note to be read and interpreted. In the reference they replay: a section that
scrolls back off the bottom of the viewport is re-armed and animates again on the
way down. That is deliberate for previewing, so the effect can be watched
repeatedly without reloading, but it may not be what is wanted on the live site -
on a long page a reader who scrolls up to re-read something sees it animate at
them again. Once-only is the safer default for production. **Do not pick one
yourself.**

If re-arming is kept, it must only ever re-arm **downward** — an element above
the viewport stays revealed. Re-arming in both directions caused a render loop
that left a whole page invisible during the design phase.

### Section highlight

Driven by scroll-position maths on a **document capture-phase** scroll listener,
with the sections looked up fresh each measurement. This is not incidental: the
design tool's runtime replaces DOM nodes on re-render, so an IntersectionObserver
or a listener bound to the scroll container both fail silently. In production,
where nodes are stable, an IntersectionObserver is the better implementation —
but test that the highlight actually tracks before assuming it works.

### Menu jumps

Animated by hand over 380ms, not with `behavior: 'smooth'` — native smooth
scrolling on this container takes over a second to start and then teleports.
Targets allow 110px for the sticky header and are measured with the reveal
transform removed (an unrevealed section sits 26px low). In production, test
whether native smooth scrolling behaves before keeping the hand-rolled version.

### Deep links

Section anchors (`#key-ideas`, `#modern-excel`, `#excel-tips`, `#beyond-excel`)
are linked from
the header dropdown on every page. In the reference the targets don't exist at
parse time, so the page reads the hash on mount and scrolls itself; with real
server-rendered pages, native anchors handle it.

### Check

Four sections each visibly a different colour from the band behind them, the side
nav highlight follows as you scroll, clicking a tile opens the article and going
back returns you to the same spot on the page, the header dropdown jumps to the
right section from another page.

## For non-profits page

Reference: `Excel Automate For Non-profits.dc.html`.

Plain prose page: five banded sections in a centred 820px column, then two CTA
panels (green for Get in touch, near-black for Our approach). No tiles, no side
nav — it is read top to bottom. Reveals are one per section, no stagger.

**The copy is the most matter-of-fact on the site, by explicit instruction.**
Don't warm it up.

**The copy went through a full editorial pass and is settled.** A sixth section,
"Direct mail", was folded into "Filling the gaps". Section order is deliberate —
see that page's decisions file before reordering.

### Check

Sections alternate light and tint down the page, both CTA buttons go to the right
places, "For non-profits" is underlined in the nav, reveals fire as you scroll.

Nav labels are sentence case, with capitals only for product names — see
`CLAUDE.md`. "About" dropped its "us" because that page is written in the first
person. "Our approach" deliberately covers the classic-versus-modern argument,
practical tips and the adjacent-tools material under one nav item rather than
three.

---

# Still to be decided

Not blockers, but they'll come up:

- **Phone number.** Whether one is shown publicly at all.
- **Scroll reveals re-arming on the Our approach page.** They replay in the
  reference, which suits previewing. **Ask Chris** whether to keep that on the
  live site or make them once-only - he decides, not you. See that page's
  section above.
- **Analytics.** None currently. If added, prefer something privacy-respecting
  that doesn't require a cookie banner.- **Domain.** `excelautomate.com.au` is held but the site isn't deployed;
  required before `og:image` and canonical URLs can be finalised.
- **Privacy wording.** Settled for now: none. A business under the $3M turnover
  threshold is generally exempt from the Australian Privacy Principles, and the
  form collects only work contact details from prospective clients. **Revisit if
  analytics, a mailing list, or any tracking is added.** See the contact form
  section for the full note.
- **Fonts.** Manrope, Public Sans, Space Grotesk and Spectral, all on Google
  Fonts. Self-host them if it's straightforward; it's faster and avoids a
  third-party request. Load with `display=swap` either way.

# Assets

Everything needed is in `assets/`. Notes:

- The **lockup SVG references Space Grotesk by name** rather than embedding it.
  Inline it in the page so it can reach the loaded fonts; an SVG in an `<img>`
  tag cannot. Use the PNG where the font isn't guaranteed.
- Favicons: SVG preferred, PNG fallbacks at 16/32/64/256. The 16px version is a
  simplified single cog — use it, don't downscale the full mark.

# Content

**Placeholder content must not reach the live site.** Several pages ship with
deliberately fake copy — most of it on the Our approach page, where 12 of the 15
article bodies are placeholders that say so in their first paragraph. The three
written ones are the Key ideas articles: "What's Modern Excel?", "Why Power
Query?" and "What about formulas?". The Our approach standfirst is also final
copy now, not placeholder. A staging
build on GitHub Pages with that content still in place is fine and expected;
it is how the site gets reviewed. **Chris removes the placeholder content
himself before the site is ported to Netlify.** Do not treat placeholder text as
approved copy, do not tidy the warnings away, and do not deploy to Netlify while
any remain.

**Never use em dashes or en dashes in site copy.** The owner uses a spaced
hyphen ( - ) throughout — carousel cards, service tiles, About page prose — and
this is a standing preference, not a per-page choice. It applies to page titles
and `og:` tags too. If you find an em dash anywhere in user-facing text, it is a
mistake; replace it.

Take the copy from the `Content - <page>.md` files. Structure the site so copy
changes don't require touching layout code — a content collection, frontmatter,
or a data file is all fine; pick what suits Astro best. The owner is not a
developer and should be able to change wording without editing components.

Deliberate line breaks are marked in those files. Note the distinction: the
landing page's hero and CTA copy use **forced** breaks, and its two CTA sections
use a no-wrap treatment where text shrinks to fit rather than wrapping. The
contact page's breaks are **not** forced — they fall out of a measured width, and
the content file says so per block. Don't convert one kind into the other.

If the landing page's shrink-to-fit treatment proves fragile on small screens,
wrapping is an acceptable substitute; a tiny font size is not.

# Where to use your own judgement

The above is deliberately specific about intent and quiet about technique. For
anything not covered — file structure, component boundaries, Tailwind config
shape, image optimisation, deployment configuration — choose what best serves a
small, fast, static, maintainable site, and leave it in a state where a
non-developer can make content changes safely.

When judging a trade-off, weight it toward the site still working in a year with
nobody having touched it, over the most capable or most current approach.
