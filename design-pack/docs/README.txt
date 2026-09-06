EXCEL AUTOMATE - WEBSITE PACK
Prepared 30 August 2026

WHAT'S HERE

  Five page designs, the documentation for each, and the assets.

  DESIGNS (open any one in a browser)
    Excel Automate Landing.dc.html
    Excel Automate Our Approach.dc.html
    Excel Automate For Non-profits.dc.html
    Excel Automate About.dc.html
    Excel Automate Contact.dc.html
    support.js                        <- required by all five, keep alongside them
    assets/                           <- logo mark, favicons, animated-mark snippet

  DOCUMENTATION
    Build Notes.md                    <- how to build it. Read this first.
    Content - <page>.md               <- every word on that page, edit here
    Design Decisions - <page>.md      <- why things are the way they are. Read
                                         before "fixing" anything that looks odd.
    Project instructions - save as CLAUDE.md.md
                                      <- standing copy and naming rules. Rename
                                         to CLAUDE.md in the new project.
    Contact page - What happens next - removed.md
                                      <- a section that was built and pulled;
                                         kept in case it goes back in.

READ IN THIS ORDER

  1. Build Notes.md - Part 1 is site-wide, Part 2 is per page.
  2. The Design Decisions file for whichever page you're touching.
  3. The Content file for that page.

TWO THINGS THAT NEED A DECISION

  1. All 15 article bodies on the Our approach page are placeholder text, and
     each says so in its first paragraph. They must be replaced before the site
     goes live. A staging build with them in place is fine.
  2. Whether the scroll reveals on the Our approach page should replay when you
     scroll back up. They replay in these designs, which suits previewing. Ask
     Chris before choosing for the live site.

A NOTE ON THE DESIGN FILES

  These are design artefacts, not production code. They run in a browser and
  they show exactly how each page should look and behave, but they are written
  for a design tool's component runtime with inline styles. Build against them;
  don't lift them.

  Each file is standalone, so the header and footer markup is repeated five
  times. That is a constraint of the design tool, not a design decision - in
  production they are one shared component. See Build Notes.md.
