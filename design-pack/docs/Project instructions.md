# Project instructions - Excel Automate website

> This is the design project's `CLAUDE.md`, included for reference. The standing
> copy, spelling and tone rules in it apply to the production site too.

## What this project is

Design work for the Excel Automate website (Chris Duff, Hobart). Five page
designs exist as Design Components at the project root. They are **design
artefacts, not production code** - the site itself will be built in Claude Code
(Astro, static, Netlify) against these designs plus the documentation in `docs/`.

### Files

| Path | What it is |
| --- | --- |
| `Excel Automate Landing.dc.html` | Landing page design |
| `Excel Automate Our Approach.dc.html` | Our approach page (content hub, 4 sections, 15 article tiles) |
| `Excel Automate For Non-profits.dc.html` | For non-profits page |
| `Excel Automate About.dc.html` | About page |
| `Excel Automate Contact.dc.html` | Contact page |
| `assets/` | Logo mark, lockup, favicons, animated-mark snippet, og image |
| `docs/Build Notes.md` | How to build the production site. Part 1 site-wide, Part 2 per page |
| `docs/Brand Brief.html` | Colours, type, logo rules, motion, and a Patterns section with exact values |
| `docs/Content - <page>.md` | Every word on that page. Edit copy here as well as in the design |
| `docs/Design Decisions - <page>.md` | Why things are as they are. **Read before "fixing" anything that looks odd** |
| `docs/business-context.md` | Business, services, pricing, target clients |
| `docs/README.txt` | Original handover note from the previous project |

### Before changing a page

1. Read `docs/Design Decisions - <page>.md` for that page.
2. Read `docs/Content - <page>.md` if the change touches copy.
3. `docs/Build Notes.md` Part 1 for anything site-wide (header, footer, reveals,
   cards, buttons, layout widths).

The header and footer markup is repeated in all five files because each design
file is standalone. That is a tool constraint, not a design decision - **a change
to either must be applied to all five files.**

## Copy style

**Never use em dashes (—) or en dashes (–) in site copy.** Chris uses a spaced
hyphen ( - ) instead, everywhere: body copy, headings, page titles, meta
descriptions and `og:` tags. This is a standing preference.

This applies to copy that ships. Notes, documentation and chat are not
constrained.

## Spelling

**Australian English.** organisation, colour, licence, prioritise, centre.

**"non-profits", hyphenated - never "nonprofits".** Applies everywhere: nav
labels, body copy, meta descriptions, headings. If you find "nonprofits" in
anything that ships, it is a mistake; correct it. Flag it if the user writes it
that way too.

## Tone

Professional but approachable. **Avoid:** overly salesy language, too much IT
jargon, excessive bullet points. Prose over lists where either would do.

## Presenting content options

**When Chris asks for options - headings, wording, alternatives - list them and
stop. Do not apply one.** He decides, then asks for the change. This holds even
when one option is obviously stronger.

## Contact CTA band

The green "Get in touch" band appears on every page. **Heading and button are
both "Get in touch" as standard, site-wide.** The line between them should be
different on every page, written to suit that page. Not a site default - review
each one as the pages develop.

## Nav labels

Sentence case, with capitals only for proper nouns - "Get in touch", "About",
"For non-profits", "Our approach". Capitals only for product names, e.g. "Modern
Excel" and "Excel tips" as sub-menu items.

Current nav, in order: Home · Our approach · For non-profits · About.

"Our approach" has a hover sub-menu: Key ideas · Modern Excel · Excel tips ·
Beyond Excel.

## Article excerpts

Every article tile has an excerpt. The unwritten ones hold AI placeholder text
based on their titles - **leave those alone** until the article itself is
written; a rewrite from the same title adds nothing.

**When Chris supplies copy for an article, suggest a new excerpt for it in the
same turn** - written from the finished article, in the article's own voice,
roughly two short sentences. The "What's Modern Excel?" excerpt is the reference
for length and register. Suggest it; per the options rule, wait for his call
before applying.

## Open decisions (from Build Notes)

- **Value proposition copy - partly placed, worth revisiting.** The two threads
  already have partial homes:
  - *Not locked in* - parallels the Continuity section on For non-profits ("no
    black box", logic visible, no proprietary system). Stated most explicitly in
    "Why Power Query?" under Easy to maintain.
  - *Less development time* - in the Accelerate carousel card on Landing, but
    without the "and less cost to you" that "Why Power Query?" adds under How we
    work.

  So neither is missing, but the cost consequence appears only in a long article.
  Chris raised whether to surface it more prominently, then parked it.

- The Our approach page standfirst (under "Our approach to Excel") is AI
  placeholder and names the three Key ideas articles. **Remind Chris to update it
  once copy exists for "Why Power Query?" and "What about formulas?"** Open
  question: whether it stays at that length, shortens to one sentence without
  article names, or goes entirely.

- All 15 article bodies on the Our approach page are placeholder text and say so
  in their first paragraph. **Do not tidy those warnings away.** Chris replaces
  them before launch.
- Whether the Our approach scroll reveals should replay on scroll-back. They
  replay in the designs, which suits previewing. **Chris decides, not you.**
- Real email address, whether a phone number is shown, privacy wording, and
  analytics are all still open.
