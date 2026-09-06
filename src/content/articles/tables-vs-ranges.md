---
section: modern-excel
order: 2
title: "Tables vs Ranges"
excerpt: "Turning a range into a table is the cheapest structural improvement available in Excel."
status: placeholder
---

Placeholder - this article has not been written yet. Outline below.

A table is just a named range that knows where it ends. That sounds trivial, and it changes the behaviour of nearly everything that touches it.

Formulas can refer to columns by name instead of by letter, which makes them readable. New rows are picked up automatically, so charts and queries do not need their ranges adjusted. Sorting and filtering stop breaking neighbouring cells.

The one habit worth building is naming tables as you create them. A workbook with Table1 through Table14 in it is barely better than no tables at all.
