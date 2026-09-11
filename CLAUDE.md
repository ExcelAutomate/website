# Excel Automate website — orientation for AI sessions

**No human developer maintains this site.** Chris (the owner) directs the work but
doesn't read or debug code. Every session starts with no memory of previous ones —
what's written down in this repo is the only continuity there is. Read before
making non-trivial changes:

1. `DECISIONS.md` — what was chosen and why, one entry per significant call.
   Several things that look like bugs or oversights are deliberate; this is where
   the reasoning lives.
2. `CHANGELOG.md` — what changed, dated, plain language.
3. `design-pack/docs/Build Notes.md` — the original build spec (Part 1 site-wide,
   Part 2 per page). `design-pack/docs/Brand Brief.html` has exact colours, type,
   spacing and component states (open it in a browser).
4. `design-pack/docs/Design Decisions - <page>.md` — before touching a specific
   page, check whether something odd about it is already explained here.
5. `CHECKS.md` — a visual checklist to run through in a browser after any change.
6. `README.md` — how to run, build and deploy this project.

## Standing copy rules (non-negotiable)

- **Dashes in running copy are thin-spaced en dashes, not spaced hyphens.**
  Reversed 2026-09-11 (see DECISIONS.md) — the original rule here was the
  opposite. Chris's own shorthand when he supplies copy is still a spaced
  hyphen ( - ); **convert it on the way in, every time**, to:
  `&nbsp;&thinsp;&ndash;&thinsp;<space>` — non-breaking space, thin space
  (U+2009), en dash (U+2013), thin space, then an ordinary space. The
  asymmetry is deliberate (nbsp holds the dash to the word before it; the
  plain space on the right is the only break opportunity, so a wrap never
  strands the dash at the start of a line) — don't make the two sides match.
  **Two exceptions**: the page `<title>`/`og:title` keep a plain spaced
  hyphen (it's a delimiter between page and site name, not punctuation), and
  meta descriptions use a single plain spaced en dash with no thin spaces
  (nothing renders them, and thin spaces would just be normalised away).
  **Where you write the dash matters**: written directly as template/markdown
  text, the entities above work fine (the compiler/renderer decodes them,
  same as the `&rarr;`/`&larr;` already used elsewhere in this codebase). But
  inside a **JS string that gets interpolated** (`{someVar}}`,  a `.map()`
  callback, a `description="..."` prop) — entities get HTML-escaped instead
  of decoded, rendering as literal visible text. Use the actual Unicode
  characters directly in the string there instead (copy-paste from a
  rendered page's DOM, or generate them with a short Node script using
  `  – ` — don't retype invisible whitespace by hand
  repeatedly and assume it stayed consistent; verify with
  `codePointAt(0).toString(16)` on the actual file content before trusting
  it).
- **Australian English**: organisation, colour, licence, prioritise, centre.
- **"non-profits", hyphenated** — never "nonprofits".
- **Sentence case** for nav labels and headings, capitals only for proper nouns/
  product names ("Modern Excel", "Power Query", "Excel tips").
- Chris writes and approves all copy. Don't rewrite or tighten it while fixing
  something unrelated.

## Astro whitespace gotcha

Astro trims a newline-only gap between inline text and an inline element (e.g. a
`<span>`) starting on the next source line, instead of collapsing it to a single
space the way HTML normally would. This has caused missing spaces more than once
(see `DECISIONS.md`). Where prose text is immediately followed by a `<span>` on
its own line, add an explicit `{' '}` between them.

## Comparing against the actual design files — do this instead of guessing

`design-pack/design/*.dc.html` are runnable, not just reference reading — they're
self-contained pages (need `support.js` and `assets/` alongside them, both already
in that folder) that render and behave exactly like the live design in a browser.
For anything about exact layout, spacing, or positioning — not just "what does
the spec say" but "what does this actually measure as" — **serve that folder
locally and query it with the same script you're checking your own build with**,
rather than reasoning about CSS/JS behaviour from first principles or guessing.
This is how the hero-mark alignment bugs got solved (see `DECISIONS.md`,
2026-09-06 entries): reasoning abstractly about the grid/margin math got it
wrong twice in a row; measuring the actual reference page with
`getBoundingClientRect()` and comparing the numbers directly settled it in one
step.

To do this in Claude Code: add a second entry to `.claude/launch.json` serving
`design-pack/design` on the same port as the dev server (they can't run
simultaneously, so swap between them), e.g. a `serve -l 5050 design-pack/design`
config alongside the `astro dev` one. Open the relevant `.dc.html` file in the
Browser pane, then use the JS execution tool to measure elements directly —
screenshots of these bundled pages have been unreliable in this environment, but
direct DOM measurement (`getBoundingClientRect`, `getComputedStyle`) works fine
and is what actually resolved things. This needs a real, fresh page load per
comparison; don't try to run both servers at once.

## Stack

Astro, static output, plain CSS (no Tailwind, no UI framework). `npm run dev` /
`npm run build` / `npx astro check`. See `README.md` for the rest.
