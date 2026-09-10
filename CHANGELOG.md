# Changelog

Plain-language, dated. What changed, and what to look at in a browser to confirm it
worked — see `CHECKS.md` for the full per-page checklist.

## 2026-09-06 — Full rebuild from the design pack

Replaced the earlier plain-HTML placeholder site with a proper Astro build against the
design pack (5 pages, 15 Our-approach articles, Brand Brief, contact form). Everything
on the site changed. See `DECISIONS.md` for the choices made along the way, and this
repo's `design-pack/` folder for the original design files, content and reasoning docs
this build was made from.

**What to look at:** every page, since it's all new — start with the items in
`CHECKS.md`. Known-deliberate gaps that aren't bugs:

- 12 of the 15 Our-approach articles are placeholder text (their own first paragraph
  says so). The other 3 ("What's Modern Excel?", "Why Power Query?", "What about
  formulas?") are real.
- The contact form doesn't send anywhere yet — GitHub Pages has no backend. It's
  wired for Netlify Forms and will work once the site moves there (see README.md).
- The whole site is marked `noindex` and blocked in `robots.txt` — deliberate while
  placeholder content remains.

## 2026-09-06 — Five fixes from first-look feedback

- Landing page: hero heading and the animated mark no longer drift apart/collide at
  various window widths.
- Header: "Get in touch" button is properly rounded everywhere, and no longer
  stretches full-width in the mobile menu.
- Our approach: opening an article and clicking its back link now returns you to
  where you were on the hub page, not the top. Jumping from "What's Modern Excel?"
  to "Why Power Query?" via its button, then going back, correctly lands on the Key
  ideas heading instead.
- About page: the photo no longer has the top of the head cropped off.
- Contact page: the "Thanks, that's on its way" message now only appears after an
  actual successful send, not immediately under the form.

See `DECISIONS.md` for what caused each of these.

## 2026-09-06 — Second round of fixes

- Landing page: the animated mark is now the exact snippet from the design pack
  (fixes the cell-flash animations that weren't firing, and the mark rendering
  smaller than intended); the hero heading no longer sits further left than the
  design's spacing.
- Header: hamburger menu no longer shows the Our-approach section links —
  Chris decided they weren't needed there. The desktop hover menu is unchanged.
- Contact page: the Phone field now genuinely hides/shows with the reply
  preference (it was visible the whole time before), the Email/Phone buttons
  show a pointer cursor on hover, and a missing space in the pull-quote text
  is fixed (also fixed on the About page).
- About page: photo now uses the design pack's own pre-cropped image instead
  of a guessed re-crop, so the framing is correct.

See `DECISIONS.md` for what caused each of these.

## 2026-09-06 — Third round of fixes

- For non-profits page: the "Learn more" CTA line now scales up to match the other
  CTA bands instead of sitting at the small browser-default size.
- About page: "Chris" in the hero intro is now green like the other highlighted
  words, not just bold.
- Header: the logo lockup's curved lines are no longer pixellated in Chrome.

See `DECISIONS.md` for what caused each of these.

## 2026-09-10 — Landing page reveals now repeat on scroll-back-up

The landing page's fade-in-on-scroll sections (hero, carousel, services, both
"Get in touch"/"Learn more" bands) now re-play every time they come back into view,
including on scrolling back up. Every other page keeps the original once-only
behaviour. See `DECISIONS.md`.

## 2026-09-10 — 18 changes from Opus5's design review

Every page changed. See `DECISIONS.md` for the reasoning behind the less obvious
ones (the carousel rewrite especially). Summary:

- Every "Get in touch"/"Learn more" band lost its title and promoted its line to
  the heading - no more two lines of near-duplicate text.
- Nav: "Our approach" is now labelled "Learn more" (same page, same destination),
  and moved to third position - order is now Home, For non-profits, Learn more,
  About.
- Header: spacing tightens smoothly as the window narrows instead of jumping
  straight to the burger menu; that jump now happens at 1040px wide instead of
  1180px. The logo's wordmark and tagline now disappear together at 380px
  instead of 220px apart.
- The header button and the CTA band buttons now get a hover lift and shadow;
  the burger menu's button stays flatter (colour change only). The green CTA
  band's button no longer shows a faint ring around it on hover.
- Picking "Key ideas" from the "Learn more" menu, or the side menu on that page,
  now takes you to the top of the page instead of straight to the Key ideas
  panel - it reads better with the page title in view.
- Our approach: the twelve not-yet-written articles now say "Coming soon"
  instead of showing draft placeholder text, and their tiles are all a
  consistent height. The "What's Modern Excel?" article's first heading is
  removed - it starts straight into the text now.
- About page: one line of copy updated (non-profit organisations paragraph).
- Landing page: the carousel cards have shorter, tightened-up text and a lower
  minimum height to match; the arrows now always move exactly one card in the
  direction you click, wrapping round at either end instead of occasionally
  rewinding backwards through the whole deck to get there.
- Our approach: the three section intros under Modern Excel, Excel tips and
  Beyond Excel are rewritten (were AI-generated placeholders).

**What to look at:** every CTA band on every page; the header at a few window
widths between about 1000px and 1250px; the "Learn more" dropdown's Key ideas
link both from another page and while already on Our approach; the landing
carousel's arrows clicked repeatedly past the last card and back past the first;
any of the twelve "Coming soon" article tiles on Our approach.

## 2026-09-10 — Every button is about 5px shorter

Every button on the site (header, burger menu, both CTA band buttons, the
Contact page chips, "Send message", article "Learn more" buttons) is a touch
shorter than before - the text sits a little tighter inside them. This brings
the build in line with how the reference designs actually render; nothing else
about the buttons (size, colour, padding, hover behaviour) changed. A handful of
other labels and small headings across the site (nav links, form field labels,
tile prompts) got the same small tightening for the same reason. See
`DECISIONS.md` for the full list and the reasoning.

## 2026-09-10 — "Our approach" page URL is now /learn-more/

Matches the nav rename from earlier - the page itself (title, heading, content)
is unchanged, only its address. Every link to it and to its articles (nav,
header dropdown, hub-page tiles, article back links and side nav) now points at
the new address. The old `/our-approach/` address no longer works - nothing
currently links to it from outside the site, and it isn't indexed yet (the
whole site is still `noindex`).

**What to look at:** click through from the nav, the header dropdown, a hub-page
tile, and an article's back link/side nav/end-of-article button - all should
land on a `/learn-more/...` URL.

## 2026-09-10 — Contact form fields are shorter too

Follow-up to the button height fix above: the contact form's text fields (Your
name, Organisation, Email, message box, Phone) were affected by the same
underlying issue and were rendering about 6-7px taller than designed - now
fixed. The lockup tagline under the logo also got a small tightening. Nothing
about field sizes, spacing or behaviour changed otherwise.

## 2026-09-10 — Landing page: small wording tweak on the "Excel" carousel card

"...a bridge that can bring your systems together" → "...a bridge that brings
your systems together." No other change to that card or any other.
