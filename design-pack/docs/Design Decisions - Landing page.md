# Landing Page — Design Decisions

Non-standard choices on the landing page that came from an explicit instruction
or preference from the owner. They look like mistakes or oversights if you don't
know the reasoning — **don't "correct" them**.

Assets (mark, lockup, favicons, animation) are fixed and out of scope here.

---

## Carousel

**The forward peek is 1.3× the back peek.** Asymmetric on purpose — the deeper
right edge draws the eye onward. This was asked for twice: an earlier attempt at
50% larger was reverted for layout reasons, and the request was reinstated at
30%. Do not "fix" the asymmetry back to equal peeks.

**The carousel extends further right rather than shrinking the active card.**
When the forward peek was deepened, the choice was explicitly to widen the whole
carousel, not to give back width from the main card.

**A duplicate of the last card sits permanently in the left peek.** So the first
card's layout is identical to every other card's — nothing shifts when the back
button appears. The back button is the only thing that changes.

**Both edges carry the same white gradient at all times.** Only the `<` chevron
is conditional. An earlier version showed no gradient on the left until the
button appeared, which made the left peek look flat and unfinished.

**Once the deck wraps past the last card, back stays available permanently** and
wraps backwards too. It does not revert to hidden on the first card.

---

## Hero

**Hero copy aligns to the carousel card's left edge plus half a card padding.**
Not to the page's content edge. It lands between the card's outer edge and its
text, which was the specific preference after trying both.

**This alignment is local to the landing page.** It was balanced against the
carousel specifically, so it does not apply to any other page and should not be
implemented as a shared layout value. Other pages use the standard 1240px
centred container.

**The headline highlights "time".** Deliberate: less direct, more in keeping
with the intended tone.

**The headline reads "Make Excel / work for you"** (changed 6 September 2026 from
"Less time / more value" - "Make" rather than "Let" because it puts the reader in
charge, and the green highlight lands on "work"). The note below records the
reasoning behind the version it replaced, which still applies to the register we
are aiming for.

**Previous headline, "Less time / more value".** Changed deliberately from "Save
time and money" as the less on-the-nose version. **No comma** - the forced line
break after "time" carries the pause on its own, and the earlier "Save time, add
value" wording needed the comma's extra weight where this one does not.

**The mark sits left of where the grid would naturally place it**, and is sized
from a tighter clamp so it stays roughly constant rather than growing with the
viewport. Both were tuned by eye at a specific window size.

**The mark hides below 720px** rather than stacking above or below the copy.

---

## Section rhythm

**The gap between the hero and the carousel is deliberately tight** — reduced
30% from the default rhythm, taken off both sides of the boundary. The hero and
carousel are meant to read as one opening block, which is also why they share a
background colour.

**The services section's top padding matches the CTA sections below it**, while
its bottom padding stays larger. Asymmetric on purpose.

---

## Content order

**"Learn more" comes after "Get in touch", at the very bottom.** It's an exit
ramp for people who aren't ready to make contact, and it belongs after the ask,
not before it. Don't move it up the page.

**No testimonials, case studies or client logos.** The business is new; there
aren't any yet. Leaving that space empty is intentional, not an oversight.

---

## Copy treatment

**The service tiles have no hover state, deliberately.** They originally lifted
on hover like a clickable card, which promised interactivity they don't have —
and taught visitors to distrust the same signal on the Our approach page, where
the tiles are real links. Removed for that reason. **Don't add it back** unless
the tiles are given destinations; see the Cards and tiles rule in the Build
Notes.

**Emphasis colour is used sparingly** — two phrases in the hero, three terms in
the "Learn more" panel. That's the whole page. Adding more dilutes it.

**Spaced hyphens ( - ), never em or en dashes.** A standing preference across the
whole site, including page titles and `og:` tags. See `CLAUDE.md`.

**"Modern Excel", "Power Query" and "Formulas" are colour-emphasised, not
quoted.** An earlier version had quote marks around Modern Excel; they were
removed in favour of colour.

**The footer says "Hobart, Tasmania" without "Australia"** — the business
operates locally. Hobart still appears in the page title for search purposes.

**The meta description omits Hobart to fit "non-profits" within 160 characters.**
A considered trade-off, not an oversight.

---

## Nav

**"For non-profits" sits third, between Our approach and About.** Position was
specified — it was previously second, and was moved deliberately.

**Nav labels are sentence case, capitalised only for product names** — hence "Get
in touch", "About", "Our approach" and "For non-profits". "About" dropped its
"us" because that page is written in the first person. See `CLAUDE.md`.

**"Our approach" is one nav item, not two.** That page carries the
classic-versus-modern argument, practical tips and guides for clients, and the
adjacent-tools material. It was deliberately not split — the nav is full at four
items. The label went through "About Excel" and "Modern Excel" before landing
here; both were rejected as too narrow.

**Nav destinations live in a `NAV_HREFS` map.** Items in it navigate; items not
in it stay inert and just take the active underline. Adding a page is one line.

**The burger breakpoint is 1180px**, raised from 1020px when the fourth nav item
was added. It's driven by the nav's content width — if items are added or
renamed, re-check it rather than trusting the number.

---

## Destinations

**All three "Get in touch" buttons — header, burger menu and the green CTA band —
go to the contact page.** They previously scrolled to a contact section on this
page; that section no longer exists.

**"Learn more" goes to the Our approach page.**

## Contact CTA band (6 September 2026)

**The contact line is now plain `clamp(16px,1.8vw,20px)` and may wrap**, matching
the bands on Our approach, For non-profits and About. It previously used the
canvas-measured `_fitFontSize` sizer with `white-space: nowrap`, which let a long
line stay on one line by shrinking to as little as 14px - narrower than the other
three pages at the same viewport. The sizer is still used for the hero's second
line and the Learn more lines.
