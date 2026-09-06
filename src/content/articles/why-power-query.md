---
section: key-ideas
order: 2
title: "Why Power Query?"
excerpt: "The tool we build most solutions around. Here's what it does, and how it could work for you."
status: written
readThis: true
---

Excel is used for a lot of repetitive tasks. There have always been ways to speed these up - filling sheets with formulas, recording macros, writing VBA. They all still have a place, but for most data handling problems these days the solution starts with Power Query.

Power Query is built into Excel, and it's designed specifically for this kind of work. You build a process once, a series of steps that bring in your data and shape it exactly how you need. Then next time, you just refresh it.

## Data in

A big advantage of Power Query is just how easy it is to bring in data from different sources. Some examples:

- A folder of CSVs or PDFs - Power Query can open and combine them all at once, even if they have some different columns or formatting
- Data from the web - this can range from simple HTML tables that contain some useful data, to connecting with cloud-based CRMs
- Database queries - if you have access to the database that sits behind a system, you can query the data directly and efficiently
- Excel tables - you can just copy/paste in the data you want it to use

A single Power Query process can bring in data from all of these sources at once, then combine them in whichever way you need to get the result.

## Data transformed

A lot of the work you do in Excel - lookups, conditionals, totals and other formulas, moving data around, filtering and sorting - can be turned into a step-by-step, repeatable process in Power Query.

It's designed to work with whole tables rather than individual cells, which makes each of those steps cleaner and safer. There are no cell references to get mixed up, and no ranges that miss some of the data.

Working with tables also means that it can behave more like a database when it comes to combining those tables - not just combining columns but changing the number of rows. Joining tables where you only keep the rows that match in both, or ones where you might have multiple matches that produce extra rows. Things that traditional formulas just don't do.

The data transformations in Power Query are great for things like:

- Cleaning data that comes in from online platforms
- Creating a single import file from multiple, varying files
- Finding and fixing problems in your data
- Creating a perfectly formatted output file from messy data
- Identifying and handling duplicate records
- Reconciling transactions from different systems

## Data out

When we're talking process automation, the output from a Power Query process will always be to a table in Excel.

If you're wanting to use the data to build a report from, it's in the perfect place already.

Often though, the next step might be to turn it into a CSV for import, or its own XLSX to forward on. It's something you can always do yourself with a few clicks, but it's something we can automate too.

Adding a button that runs a little bit of VBA (the classic programming language in Excel) we can turn your table into a file, in the right folder and with the right filename.

## Control when you need it

It's one thing to automate a process exactly as it is now, but often you'll want to allow for future changes and give it room to grow. Instead of just hard-coding values, we can make the process highly dynamic instead.

What this looks like is a Settings sheet, with fields and tables containing key values that you can change and add to. These might be lookup tables with codes and categories, or numbers to use in calculations - anything you might want to have easy control of without needing someone to delve back into the code.

Another way we can give you control is by adding interim steps for processes that need human review. Say some records get flagged for review, based on rules you've worked out with us. We can push them out to a table, where you make any necessary changes. Then it all gets folded back into the next stage of processing.

Excel provides the ideal interface for letting you pass settings and data back and forth within a process. It's easy for you to use, and easy for us to build, saving time all round.

## Hidden but accessible

Power Query lives inside an individual Excel file, the same as any simple spreadsheet. It's kept in the background though, so the person running the process never even has to see it. They could have as little as a single sheet with a single table to deal with - just click a button to refresh it and see the data appear, however much processing goes on behind the scenes.

The other side of this is that you can always view the Power Query process with just a couple of clicks if you want to. You don't have to go looking for extra files, you don't have to open it in another program, nothing gets in the way.

## Easy to maintain

When you look at a Power Query process you won't see blocks of code. You'll see a number of 'Queries' that each contain a list of steps. Those steps will all be named - either automatically or by us - to describe their actions: 'Replaced Value', 'Removed Columns', 'Filtered Rows' etc.

Not all of it will make sense to a casual observer, but it can help provide an entry point to anyone needing to make small tweaks. Additionally, a lot of actions can be done entirely via the GUI without needing to type any code at all. Realistically, for a full solution we might spend half the time working from the GUI and half the time in the code editor, but for most simple tasks the GUI can be enough.

While we look forward to building relationships with organisations and businesses and continuing to support the tools we develop, we want to make it clear that you'll never be locked into anything. If you're comfortable making tweaks yourself, we can show you how it works a little during handover.

## How we work

At Excel Automate we've done a lot of this work before. We have patterns and approaches that work, and a ready-made toolkit of handy functions that speed the work along. We don't have to start from scratch each time, which means less development time, and less cost to you.

The same basic value proposition is why we try to centre solutions around Power Query to begin with. When it fits the shape of the process you need, it's simply the quickest way to build something powerful, robust, easy to use and maintainable.
