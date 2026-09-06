---
section: key-ideas
order: 3
title: "What about formulas?"
excerpt: "Where formulas are still the right choice, and where something else works better."
status: written
readThis: true
---

Formulas have always been at the heart of Excel, and that hasn't changed. But they're not always the right tool for every job. They're great for people who know Excel already, but not as well suited to building a repeatable process that you can hand off to anyone.

## Where they have a place

Here's where they might still be the first choice:

- Ad-hoc data interrogation or analysis
- One-off solutions that don't need automating
- Small tools for personal use, or to share with people who also understand how they work
- Calculation templates - locked down sheets with data that gets entered into individual fields or selected from dropdowns
- Lower complexity reports, where the amount of data is manageable

## Why they're not for everything

These are some of the issues with using formulas when things get more complicated:

- Formulas based on ranges are fragile - inserting or deleting rows and columns can break them
- Small inconsistencies in the data - numbers stored as text, extra spaces, inconsistent date formats - can quietly break a lookup or calculation without any obvious error
- Sheets involving a lot of nested formulas or helper columns can quickly become unwieldy - easy to set up, but hard to update or debug
- There isn't always a clear flow of logic - it's fine for something you create and use yourself, but difficult for anyone else to maintain

## What works instead

The right solution depends on the problem you're trying to solve.

For smaller-scale problems such as simple reports, some of the downsides that come with classic formulas can be alleviated by using the new dynamic array formulas instead. When used carefully they can make the flow of complex logic more comprehensible, and work better with dynamic data ranges.

For complex reporting and analysis, a better option is Power Pivot and DAX. This works well with data that sits in more than one table, where you can define relationships and use those to filter it dynamically via slicers. It's also the most practical option for large amounts of data, where unlike regular worksheets it can handle millions of rows.

For automating regular processes, the right tool is usually Power Query. It's built from the ground up to extract, combine, and transform tables of data. You can hand a process over to an Excel novice to run, and there'll be very little that can go wrong. The way the steps are structured make it a lot easier to understand and maintain. This allows your processes to truly belong to the organisation, not to the individuals that built them.
