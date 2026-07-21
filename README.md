# Excel Automate - website

Work-in-progress demo of the Excel Automate marketing site. Plain static HTML/CSS/JS,
no build step, so it runs the same on GitHub Pages now and on Netlify later.

**Status:** demo/preview only. Page copy for Why Modern Excel?, Working With You and
Get In Touch is an AI-generated first draft and will be rewritten before launch. The
contact form has no working backend yet (see below). `robots.txt` and per-page
`noindex` meta tags keep it out of search engines while it's a work in progress.

## Structure

```
index.html      Landing page (/)
excel.html      Why Modern Excel? (/excel)
services.html   Working With You (/services)
contact.html    Get In Touch (/contact)
assets/css/     Shared stylesheet
assets/js/      Mobile nav toggle + demo contact form handler
assets/img/     Logo lockup and favicon (brand assets)
```

## Running locally

No build step - open `index.html` directly in a browser, or serve the folder with
any static file server, e.g.:

```
npx serve .
```

## Deploying

**GitHub Pages (current):** Settings -> Pages -> Deploy from branch -> `main` / `/ (root)`.

**Netlify (planned, once content is finalised):** point Netlify at this repo with no
build command and publish directory `/`. Before going live, replace the placeholder
contact form in `contact.html` with a real handler (Netlify Forms is the simplest
option - add `data-netlify="true"` and a hidden `form-name` field to the existing
`<form>`, or swap in a Formspree endpoint).

## Brand assets

Colours and fonts are sampled from `assets/img/logo.svg` (the horizontal lockup) and
defined as CSS variables in `assets/css/style.css`. Headings use Space Grotesk to
match the wordmark; body copy uses Inter.
