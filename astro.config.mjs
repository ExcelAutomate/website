import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Project-pages URL for the GitHub Pages test build. `base` MUST match the repo
// name or every internal link and asset 404s once deployed — see
// src/data/nav.ts `withBase()`, which every href in the site goes through.
// Update both `site` and `base` (drop `base` entirely) once the custom domain
// excelautomate.com.au is connected — see DECISIONS.md.
export default defineConfig({
  site: 'https://excelautomate.github.io',
  base: '/website',
  trailingSlash: 'always',
  integrations: [sitemap()],
});
