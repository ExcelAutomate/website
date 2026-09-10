# Excel Automate - website

Astro site for excelautomate.com.au, built against the design pack in `design-pack/`
(originally handed over from Claude Design). **No human developer maintains this
site** — it's built and changed by AI, directed by Chris, who isn't a developer and
can't read or debug the code. See `design-pack/docs/Build Notes.md` Part 1 for what
that means for how this is built, and read `DECISIONS.md` before making non-trivial
changes — it records the reasoning behind choices that might otherwise look like
mistakes.

**Status:** test build on GitHub Pages, for review. 12 of the 15 Our-approach articles
are placeholder text (their own first paragraph says so). **Do not port to Netlify
while any placeholder content remains** — see "Before the Netlify launch" below.

## Structure

```
src/
  content/articles/*.md   The 15 Our-approach articles - edit copy here
  data/nav.ts             Nav items, hrefs, the Our-approach sub-menu - single source
  data/sections.ts        Our-approach section ids/labels
  layouts/BaseLayout.astro  <head>, meta/og tags, Header, Footer
  components/             Header, Footer, Carousel, HeroMark, ContactForm
  scripts/                Plain JS: reveal, carousel, section-nav, article-nav, contact-form
  styles/global.css       Design tokens (colours, type, spacing) + shared component styles
  pages/                  index.astro, learn-more/ (hub + [slug] articles - route renamed
                          from our-approach/ 2026-09-10, see DECISIONS.md),
                          for-non-profits.astro, about.astro, contact.astro, 404.astro
public/assets/img/        Logo mark, favicons, og image (static, not build-processed)
design-pack/               The original design files, content and reasoning docs this
                          site was built from - docs/Build Notes.md is the primary
                          reference; read it before making structural changes.
```

## Running locally

```bash
npm install
npm run dev
```

Opens at `http://localhost:4321/website/` (the `/website` matches the GitHub Pages
project-pages path — see `astro.config.mjs`).

```bash
npm run build    # outputs to dist/
npm run preview  # serves the built dist/ locally
```

## Editing content

- **Article copy:** edit the relevant file in `src/content/articles/`. Frontmatter
  controls which section it appears in, its order, its tile excerpt, and whether it
  carries the "Read this →" prompt or an end-of-article button. The body below the
  `---` is plain Markdown.
- **Everything else** (Landing, For non-profits, About, Contact copy): each page's
  words live directly in its `.astro` file under `src/pages/`, close to where they
  render.
- **Never use em dashes (—) or en dashes (–)** in anything that ships — a spaced
  hyphen ( - ) instead, everywhere. See `design-pack/docs/Project instructions.md`.

## Deploying

**Now — GitHub Pages, via GitHub Actions** (`.github/workflows/deploy.yml`): builds
and deploys on every push to `main`. **One-time setup step**: in the repo's Settings →
Pages, set Source to "GitHub Actions" (not "Deploy from a branch" — a plain branch
deploy can't run the Astro build step).

**Later — Netlify**, once `excelautomate.com.au` is ready to connect and the
placeholder content is gone:

1. Update `astro.config.mjs`: change `site` to the real domain and remove `base`
   entirely (it only exists for the GitHub Pages project-pages path). This one
   change is also what turns off staging mode everywhere else — see below.
2. Point Netlify at this repo — build command `npm run build`, publish directory
   `dist`. No other config needed; Netlify auto-detects Astro.
3. **Turn on the contact form's email notification** in the Netlify dashboard, to
   `hello@excelautomate.com.au`, with `reply-to` set to the sender's address. The
   form markup (`data-netlify`, honeypot, hidden `form-name`) is already in place —
   this is the one manual step Netlify itself requires.
4. Replace the 12 placeholder article bodies in `src/content/articles/`.

The `noindex` meta tag (`src/layouts/BaseLayout.astro`) and `robots.txt`
(`src/pages/robots.txt.ts`) both derive from whether `site` is still the GitHub
Pages staging domain (`excelautomate.github.io`) — nothing to remember to edit
separately, they come off automatically as soon as step 1 above is done.

## Before the Netlify launch — checklist

- [ ] All placeholder article content replaced (`status: placeholder` in frontmatter
      marks which ones)
- [ ] `astro.config.mjs` `site`/`base` updated to the real domain — this alone also
      turns off `noindex` and the `robots.txt` block, and fixes `og:image`/canonical
      URLs (all built from `Astro.site`)
- [ ] Netlify Forms email notification turned on and tested

## More detail

- `DECISIONS.md` — what was chosen and why, one entry per significant call.
- `CHANGELOG.md` — what changed, dated, plain language.
- `CHECKS.md` — a visual checklist to run through in a browser after any change.
- `design-pack/docs/Build Notes.md` — the original build spec this site follows.
- `design-pack/docs/Brand Brief.html` — exact colours, type, spacing and component
  states (open it in a browser).
