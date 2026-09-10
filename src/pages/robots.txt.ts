import type { APIRoute } from 'astro';

// Same "environment check, not a manual edit" reasoning as the noindex meta
// tag in BaseLayout.astro (see DECISIONS.md) — this used to be a static
// public/robots.txt with a blanket Disallow that someone had to remember to
// change at launch. Generated from `site` instead, so blocking crawlers and
// noindex flip off together, from the one place, the moment `site` in
// astro.config.mjs is updated to the real domain.
const STAGING_HOSTNAME = 'excelautomate.github.io';

export const GET: APIRoute = ({ site }) => {
  const isStaging = site?.hostname === STAGING_HOSTNAME;

  const body = isStaging
    ? 'User-agent: *\nDisallow: /\n'
    : `User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap-index.xml', site).toString()}\n`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
