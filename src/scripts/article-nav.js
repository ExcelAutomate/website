// Our-approach article pages: following a link to ANOTHER article — the
// end-of-article CTA button, or an inline article-to-article link in the
// body — deliberately forgets any scroll position remembered from the hub
// page. Without this, going "What's Modern Excel?" → (CTA) → "Why Power
// Query?" → (back link) would wrongly restore the scroll position from
// where the reader was two hops ago, on the hub page, instead of landing on
// the Key ideas section heading — see src/scripts/section-nav.js, which
// writes and normally consumes this same key.
const RETURN_SCROLL_KEY = 'oa-return-scroll';

function initArticleNav() {
  document.querySelectorAll('.article-cta a, .article-body a').forEach((link) => {
    link.addEventListener('click', () => {
      sessionStorage.removeItem(RETURN_SCROLL_KEY);
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initArticleNav);
} else {
  initArticleNav();
}
