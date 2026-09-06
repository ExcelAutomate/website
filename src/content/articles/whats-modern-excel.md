---
section: key-ideas
order: 1
title: "What's Modern Excel?"
excerpt: "Open it up and it looks much the same. Underneath, there is a whole new side to Excel that most people have never met."
status: written
readThis: true
cta:
  label: "Why Power Query?"
  target: why-power-query
---

## A new direction

Excel has fundamentally changed in recent years, and it passed a lot of people by. Open it up and it looks much the same. You can still use it the same way everyone's been using it for the last 30 years, and in your day-to-day work that might be all you need. But there's a whole new side to Excel that can transform the way you get work done.

A big part of what makes Modern Excel different is that it's started to work a lot more like a database. But the real story for many organisations is the data processing tools that came along as part of this transformation.

## Built-in automation

Power Query and Power Pivot are the headline acts. Somewhat innocuously named, these are enterprise-grade data processing and analysis tools, built right into Excel for anyone to use. And for us, Power Query is the one that steals the show.

Power Query lets you pull in data from any number of sources, clean it, combine it, re-shape it, and deliver it straight into Excel. If you want to skip ahead to see how we can use it to automate your processes, you can read the next article here: [Why Power Query?](../why-power-query/)

You can create a whole Power Query process that sits behind a single table on a sheet. Simply refresh the table and it all spins up and goes to work, pulling in and processing the new data - usually within a few seconds. Excel has had automation in the past, but never as rapid or robust as with Power Query.

## A data warehouse

The other way to use Power Query is to push the cleaned and consolidated data into the 'Data Model'. This works like a relational database that lives inside Excel - something that can hold millions of rows and support complex analysis. That's where Power Pivot comes in.

Power Pivot sounds like it's just a more advanced pivot table, which is maybe something relatable for Excel users, but seriously undersells it. What it gives you is a highly efficient data warehouse, a data analysis engine and language (DAX), and the visualisations to go along with them. It delivers a full analysis and reporting experience inside Excel and shares a lot of its core DNA with Microsoft's Business Intelligence suite, Power BI.

## Structured sheets

Modern Excel also brings some database-like behaviours directly into the worksheet, first with tables and then with dynamic array formulas.

Tables bring more structure to your data, and are a key part of how Excel and Power Query work together. They allow data ranges and formulas to grow to fit the data, and allow you to use table and column names in formulas to make them more comprehensible.

Dynamic array formulas like FILTER() and UNIQUE() allow you to write formulas that work a lot like the SQL queries that drive most databases. Instead of having a whole range full of individual formulas, one for each cell, you can write a single formula that returns a whole range worth of data.

You'll get just the rows and columns you want, with transformations and calculations all defined within that formula. Helper functions like LET() and LAMBDA() allow you to make these formulas even more powerful without becoming incomprehensible.

## Future interest

Beyond what we think of as Modern Excel, but worth following into the future, are the inclusion of the Python programming language, and the inclusion of AI. Unlike the other functionality though, both of these have limitations depending on your subscription tier.

The PY() function already allows Excel to run Python code in the cloud and return it back into the sheet, giving access to functionality well beyond what Excel can natively offer.

Copilot is the AI tool that can help with writing formulas, creating charts, and doing some basic data analysis. Though limited currently, it's already impressive compared to what it was a year ago.

## Best of both

At Excel Automate we use the best features from both Modern and Classic Excel to create our solutions. And the key that unlocks a lot of that is Power Query. Read on to see how this can work for you.
