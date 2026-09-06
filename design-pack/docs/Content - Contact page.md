# Excel Automate — Contact Page Content

All the words on the contact page, in the order they appear. Edit here, then ask Claude to apply the changes to the page — or hand this file to whoever builds the full site.

**Conventions**

- `**bold**` marks words that render in green (the emphasis colour).
- Line breaks noted in the copy are deliberate — see the notes under each block for whether the break is forced or comes from the pane width.
- Character limits are noted where they matter (search results, link previews).

---

## Browser tab & search results

| Field | Value | Limit |
| --- | --- | --- |
| Page title | Get in touch - Excel Automate \| Hobart | ~60 chars before Google truncates |
| Meta description | Tell us about the process you'd like to simplify. Excel Automate builds Power Query and VBA tools for businesses and non-profits. | 160 chars (currently 126) |

> No link preview (og:) tags on this page yet. Worth adding before the site goes live, or shared links will fall back to whatever the platform scrapes.

---

## Header

Identical to the landing page: same lockup, same four nav links, same 1180px burger breakpoint.

**Navigation** (in order, left to right):

1. Home
2. Our approach
3. For non-profits
4. About

**Header button:** Get in touch — shown as a flat green-tinted chip rather than a solid button, because you are already on this page. It is not a link.

> All four nav links now have destinations. The logo lockup goes to the landing page.

---

## Intro (left pane)

**Headline** (one line):

> Let's **chat**

**Body:**

> Tell us about the process you'd like to simplify, or anything else we can help you with.

> Breaks after "simplify," at the design width. This is not a forced break — it comes from the pane being capped at 468px. On narrower screens it wraps to three balanced lines, which is intended. Rewording this sentence will move the break, so check it afterwards.

### Contact details

Three rows, each with an icon tile:

| Icon | Label | Value |
| --- | --- | --- |
| Envelope | EMAIL | hello@excelautomate.com.au |
| Map pin | BASED IN | Hobart, Tasmania |
| Clock | REPLY TIME | Within a day or two |

> **The email address is confirmed** (6 September 2026): `hello@` is the address shown on the site and the destination for form submissions. `chris@excelautomate.com.au` is for mail Chris sends himself and is not published here. The reply time was changed from "Within one business day" to "Within a day or two" on 6 September 2026: a firm promise to a stranger is the one line on the site that can fail by itself. Labels are uppercase with wide letter-spacing, matching the lockup tagline.

### Pull quote

*Italic, with a green rule down the left edge.*

> There's no cost and no obligation for a first conversation, and if Excel isn't the right answer we'll let you know.

> Breaks to three lines, with "we'll let you know." on the last one. That final phrase is held together deliberately — without it the line breaks after "let" instead. If you reword the sentence, the protected phrase needs revisiting.

---

## Form (right pane)

*White card.*

| Field | Label | Notes |
| --- | --- | --- |
| Name | Your name | Half width |
| Organisation | Organisation | Half width, placeholder reads "Optional" |
| Email | Email | Full width, always shown |
| Message | What you'd like help with | Five rows, resizable |
| Preferred reply | Preferred reply | Two buttons: Email (default) and Phone |
| Phone | Phone | Only appears when Phone is selected |

**Button:** Send message

> No guide text in the fields except "Optional" on Organisation — the labels do the work. The email field stays visible whichever reply preference is chosen, so there's always a written record. The form isn't connected to anything. It needs a form handler and spam protection before launch.

### After sending

> **Thanks, that's on its way** You'll get a reply within a day or two.

**Link:** Back to the form

> This confirmation replaces the form inside the same card, so the page doesn't jump. The reply time here repeats the left pane — change both together.

---

## Call to action — Learn more

*Near-black panel.*

**Heading:** Learn more

**Body:**

> Still weighing it up? See how we use **Modern Excel**, and how it can transform your processes.

**Button:** Learn more → the Our approach page

> "Modern Excel" is the only inline emphasis on the page. The button goes to the Our approach page. Unlike the landing page's CTA copy, this line wraps normally rather than shrinking to fit.

---

## Footer

> © 2026 Excel Automate · ABN 51 680 585 107 · Hobart, Tasmania

Identical to the landing page. Year is fixed in the page.

---

## Removed

A **"What happens next"** section sat between the form and the Learn more panel: three numbered cards describing the engagement process. Removed because the process isn't standardised yet and the section implied more structure than exists. Full copy and layout notes were in `Contact page - What happens next (removed).md`, **which is not in this project** - it was left out of the handover pack. Ask Chris for it if the section is ever revived.

---

## Not yet written

- A phone number, if you want one shown
- Link preview (og:) tags for this page

**Settled:** the email address (`hello@`), the reply time wording, and privacy
wording (none for now - see Build Notes).
