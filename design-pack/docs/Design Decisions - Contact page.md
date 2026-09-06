# Contact Page — Design Decisions

Non-standard choices on the contact page that came from an explicit instruction
or preference from the owner, or from a constraint that isn't visible in the
markup. They look like mistakes or oversights if you don't know the reasoning —
**don't "correct" them**.

The page reuses the landing page's system throughout: same header and footer,
same palette, same card and button geometry, same 1180px burger breakpoint. Only
the departures are listed here.

---

## Panes and widths

**The two panes are deliberately uneven — 1fr / 1.44fr, left to right.** The form
has more rows than the intro has copy, so an even split left the intro looking
stranded at the top of a tall column. The extra width also takes a line out of
the message box.

**The intro block is capped at `max-width: 468px`, and that cap is
load-bearing.** With `text-wrap: pretty`, a measured text width of 456–476px is
what breaks the opening paragraph after "simplify," and takes the italic pull
quote to three lines. Both were requested. The column ratio deliberately
resolves wider than the cap so the cap is what governs from 1240px up. If either
sentence is reworded, re-measure — don't assume the number still holds.

**Neither line break is forced with a `<br>`.** The paragraph's break comes from
the cap above; below it the paragraph wraps to three balanced lines, which is
intended. An earlier attempt held the second clause unbreakable to guarantee the
break at any width — it was removed because it stranded "simplify," alone on a
line across a wide band of laptop widths.

**The pull quote's final phrase, "we'll let you know.", IS held unbreakable.**
This one is load-bearing: with natural wrapping the line breaks after "let"
instead of after "answer". Keep the protected phrase.

**The content spine from the landing page is not applied here, and doesn't apply
to any other page.** The brief calls it the page's shared left margin, but it was
balanced against the carousel specifically — the value is derived from the
carousel card's left edge, and reproducing it on a page without a carousel puts
the content roughly 408px from the page edge. Confirmed by the owner: the spine
is a landing page decision, not a site-wide one. Every other page uses the
standard 1240px centred container.

---

## Header

**The header's "Get in touch" is a flat chip, not a button.** You're already on
the contact page, so a solid CTA pointing at itself is noise. It keeps the
button's geometry and the icon-tile green so the header still balances, but it
isn't a link.

**Nav items don't show an active underline on this page.** The contact page is
not in the nav — it is reached by the "Get in touch" button — so no nav item is
current. The underline still appears on hover.

---

## Form

**The email field stays visible even when "Phone" is chosen as the reply
preference.** Phone adds a field rather than swapping one out — a written address
is wanted either way.

**Email is the default reply preference.** Selected state uses the icon-tile
green fill with a brand green border, matching the brief's component states
rather than introducing a radio control.

**No guide text in any field except "Optional" on Organisation.** Requested
directly. The labels carry the meaning; example answers in the fields were
removed as clutter.

**The message box is five rows, not six.** It lost a row when the right pane was
widened, to keep the two panes balanced.

**The confirmation replaces the form inside the same card.** The card doesn't
change size abruptly and the page doesn't jump.

**"Back to the form" is a text link, not a button.** The brief allows two button
variants — solid and ghost — and ties each to a specific band background. A third
variant on a white card would have broken that rule, so it isn't a button at all.

---

## Section rhythm

**There is no green band on this page.** The brief's fixed sequence puts a green
primary CTA above the near-black secondary one. Here the form does the primary
CTA's job, so the green band would be asking twice. The rule that no two
adjacent bands repeat still holds: light, near-black, tint.

**"Learn more" is kept at the bottom, as on the landing page.** It's the exit
ramp for people who aren't ready to make contact, and it belongs after the ask.

**No "What happens next" section.** It was built and then removed — the process
isn't standardised yet, and a numbered three-step process reads as a promise
about how an engagement runs. See
`Contact page - What happens next (removed).md`.

---

## Scroll reveals

**This page uses `IntersectionObserver`, not the landing page's scroll-position
sweep.** The landing page measures scroll offsets because of a constraint in the
design tool; the Build Notes call that a workaround and specify
`IntersectionObserver` for production. This page follows the Build Notes.

**Reveals are once-only here — they don't replay on scroll-back.** The landing
page replays; this page doesn't, because the reveal map only ever gets added to.
An earlier version that could un-reveal elements caused a render loop that left
the whole page invisible. If replay is wanted, it needs to be added carefully.

**There's a 2.5-second safety net that reveals everything regardless.** If
observation fails for any reason, content appears rather than staying hidden.
Don't remove it.

**Reduced motion shows everything immediately**, per the Build Notes.

---

## Copy treatment

**"Modern Excel" in the Learn more panel is the page's only inline emphasis.**
The landing page uses three green terms in the same panel; this page has one.
Emphasis stays sparing.

**No "Prefer email? Write to..." line under the submit button.** It was there
briefly and removed — the address already sits in the left pane two columns away,
and saying it twice on one screen is noise.

**The reply-time promise appears twice** — in the left pane's details and in the
confirmation message. Deliberate repetition at two different moments, but they
must be changed together.
