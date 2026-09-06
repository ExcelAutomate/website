---
section: modern-excel
order: 1
title: "Power Query vs VBA"
excerpt: "Both have their place. Choosing the wrong one is how automations end up unmaintainable."
status: placeholder
---

Placeholder - this article has not been written yet. This is a sketch of the comparison.

Power Query is for getting data in and shaping it. It is declarative, it refreshes on demand, it survives being handed to somebody else, and it does not require macros to be enabled.

VBA is for making Excel itself do things: moving files about, driving other applications, building an interface, or any job that has to happen in a particular order at a particular moment. It can do almost anything, which is both its strength and its risk.

The rule of thumb we use is simple. If the job is a transformation of data, it goes in Power Query. If the job is an action, it goes in VBA. Plenty of tools use both, with the query doing the loading and a small amount of code doing the orchestration.

What we try to avoid is VBA that laboriously reproduces what a query would do in three clicks, because that is the code that nobody can maintain in two years.
