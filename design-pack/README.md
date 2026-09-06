# Handoff: Excel Automate website

## Overview

Excel Automate is a new one-person business in Hobart, Tasmania (Chris Duff),
building Power Query and VBA automations for businesses and non-profits. This
package contains the finished designs for its five-page marketing site, plus the
documentation needed to build it.

**The immediate job is a test build hosted on GitHub Pages**, for review before
launch. Netlify is the eventual production target - see "Hosting" below.

## About the design files

`design/*.dc.html` are **design references**, not production code. They are
self-contained HTML prototypes with inline styles and a small runtime
(`support.js`), created in a design tool. They show the intended look, copy and
behaviour precisely.

**Do not port them file-for-file.** Build the site properly in the target stack
and use these as the specification. Open them in a browser to see the real thing
- every interaction works, including the carousel, the nav sub-menu, the scroll
reveals, the article view and the form's local validation.

**Read `docs/Build Notes.md` first.** It is the primary instruction set: Part 1 is
site-wide (header, footer, reveals, cards, buttons, layout widths, heading
scale), Part 2 is per page. It also records which decisions are load-bearing and
which are open.

## Fidelity

**High fidelity.** Colours, typography, spacing and interactions are final.
Recreate them faithfully. `docs/Brand Brief.html` carries the exact values
(palette, type scale, logo rules, motion, and a Patterns section with the button,
card and carousel specs). Where the designs and the brief disagree, the brief
wins - but flag it.

## Stack

Nothing is built yet, so this is a greenfield choice. The recommendation, from
`docs/Build Notes.md`:

- **Astro**, static output. Five content pages plus article pages; no client
  framework needed. Islands only where interactivity exists (carousel, nav
  sub-menu, article routing, form).
- **Plain CSS** with custom properties for the palette and type scale. The
  designs use inline styles because of the tool that made them - do not carry
  that pattern into production.
- **No CSS framework, no component library, no state manager.** The site does not
  warrant them.
- **Pin every dependency and commit the lockfile.** Build Notes Part 1 explains
  why this matters more than usual here: no human developer maintains this site.

If you have a strong reason to differ, say so before starting.

## Hosting

**Now - test build on GitHub Pages.** Static Astro output deployed by GitHub
Actions on push to `main`. Set `site` and `base` in `astro.config.mjs` correctly
for a project-pages URL, or the assets and internal links will 404. This build is
for review and **will contain placeholder article content, which is expected**.

**Later - production on Netlify.** Static, with Netlify Forms handling the
contact form (see below). `excelautomate.com.au` is held but not yet pointed
anywhere, so `og:image` and canonical URLs can't be finalised until it is.

**Do not deploy to Netlify while placeholder content remains.** Chris removes it
himself before the port. See the "Content" section of Build Notes.

## Pages

Five pages. Nav order: Home · Our approach · For non-profits · About, plus a
"Get in touch" button. "Our approach" has a hover sub-menu of its four sections.

| Page | Design file | Content | Decisions |
| --- | --- | --- | --- |
| Landing | `Excel Automate Landing.dc.html` | `docs/Content - Landing page.md` | `docs/Design Decisions - Landing page.md` |
| Our approach | `Excel Automate Our Approach.dc.html` | `docs/Content - Our approach page.md` | `docs/Design Decisions - Our approach page.md` |
| For non-profits | `Excel Automate For Non-profits.dc.html` | `docs/Content - For non-profits page.md` | `docs/Design Decisions - For non-profits page.md` |
| About | `Excel Automate About.dc.html` | `docs/Content - About page.md` | `docs/Design Decisions - About page.md` |
| Contact | `Excel Automate Contact.dc.html` | `docs/Content - Contact page.md` | `docs/Design Decisions - Contact page.md` |

The `Content - <page>.md` files hold **every word on that page**, in order, with
notes on which line breaks are forced. Treat them as the copy source of truth;
the designs and these files agree as of 6 September 2026.

The `Design Decisions - <page>.md` files explain **why** things are as they are.
**Read the relevant one before "fixing" anything that looks odd** - several
oddities are deliberate and were arrived at after failed alternatives.

### Our approach is the complex one

A content hub: four coloured panels on one scroll, a sticky section nav beside
them, and 15 article tiles across the four sections.

- **In production each article is its own URL.** The reference renders articles
  in place of the index so all 15 can be reviewed in a single file; every tile is
  already a real link with a real href.
- **3 of the 15 articles are written.** The other 12 are placeholder text that
  says so in its first paragraph. **Leave those warnings in place.**
- Written article copy lives one file per article: `docs/Article - <title>.md`.
- **Pre-launch, the three panels after Key ideas are dimmed to 45%** and stay
  that way. This is a deliberate soft-launch state, not a bug - the tiles stay
  visible and clickable. Build Notes and the page's decisions file both carry the
  steps to reinstate the original hover-to-clear behaviour later.

## Contact form

The only conversion point on the site, and the only thing in the designs that
does not work. **Full spec is in `docs/Build Notes.md` under "Contact form"** -
read it rather than the summary here. In short:

- Submissions **email Chris** at `hello@excelautomate.com.au`. Netlify Forms with
  an email notification configured; the notification is not optional.
- **Name, email and message are mandatory.** Organisation is optional; phone is
  required only when "Phone" is the chosen reply preference. The email field
  stays visible and required either way.
- **Light spam protection, no CAPTCHA:** a silently-dropped honeypot field, a
  minimum time-on-form check of about three seconds, and Netlify's built-in
  filtering. Rate limiting only if abuse actually appears.
- On success, swap the form for the designed in-card confirmation. On failure,
  show the error in place and **keep everything they typed**.

On GitHub Pages there is no form backend, so for the test build either wire it to
a temporary endpoint or leave it in its current local-validation state - but make
the required-field behaviour real either way, since that is what needs reviewing.

## Copy rules (non-negotiable)

These are Chris's standing preferences. `docs/Project instructions.md` has the
full set.

- **No em dashes or en dashes in site copy, ever.** A spaced hyphen ( - ) is used
  instead, everywhere: body copy, headings, page titles, meta descriptions, `og:`
  tags. The design files follow this; keep it.
- **Australian English:** organisation, colour, licence, prioritise, centre.
- **"non-profits", hyphenated - never "nonprofits".** Nav labels, body copy,
  headings, meta descriptions.
- **Sentence case** for nav labels, headings and service tile titles. Capitals
  only for proper nouns and product names - "Modern Excel", "Power Query",
  "Excel tips".
- Tone: professional but approachable. Prose over bullet lists where either would
  do. No salesy language.

**Do not rewrite, tighten or improve any copy.** If something reads wrong, raise
it. Chris writes and approves all of it.

## Assets

Everything needed is in `design/assets/`:

- `excel-automate-mark.svg` - the cogs mark
- `excel-automate-lockup.svg` - mark plus wordmark
- `excel-automate-favicon.svg` + PNGs at 16/32/64/256 - the simplified
  single-cog favicon. Use it; don't downscale the full mark.
- `excel-automate-og.png` - 1200x630 link preview image
- `animated-mark-snippet.html` - the hero animation, extracted and standalone
- `chris-duff.png` - the About page photo, cropped to the 4/5 slot.
  **Export a JPEG or WebP at ~620px wide for production** - this is a PNG and
  heavier than a photo needs to be. `chris-duff-source.jpg` is the original,
  kept so the crop can be redone.

Fonts are Manrope, Public Sans, Space Grotesk and Spectral, all on Google Fonts.
Self-host if straightforward; `display=swap` either way.

## Known open items

None of these block the test build:

- Phone number - whether one is shown at all.
- `og:` tags exist on the Landing page only. The other four need them.
- Proof of work (testimonials, case studies) - genuinely unavailable; the
  business is new. **Don't invent placeholder proof.**
- Footer year is hard-coded 2026 on all pages.
- Whether the Our approach scroll reveals replay on scroll-back. They do in the
  designs. **Chris decides.**
- Analytics - none. If added, prefer something that needs no cookie banner, and
  revisit the privacy question.

## Files in this package

```
design/
  Excel Automate Landing.dc.html
  Excel Automate Our Approach.dc.html
  Excel Automate For Non-profits.dc.html
  Excel Automate About.dc.html
  Excel Automate Contact.dc.html
  support.js            runtime the design files need to render
  assets/               logos, favicons, og image, photo, animation snippet
docs/
  Build Notes.md        primary build instructions - read first
  Brand Brief.html      exact colours, type, logo rules, motion, patterns
  Content - <page>.md   every word on each page
  Design Decisions - <page>.md   why things are as they are
  Article - <title>.md  copy for the three written articles
  business-context.md   services, pricing, target clients
  Project instructions.md  standing copy, spelling and tone rules
  README.txt            original handover note
```

To view a design file, open it directly in a browser from the `design/` folder -
`support.js` and `assets/` need to sit alongside it.
