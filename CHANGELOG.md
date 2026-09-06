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
