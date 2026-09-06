// Our-approach page: sticky section nav highlight + menu-jump scrolling.
//
// The design reference needed a scroll-position/module-scope workaround here
// because its runtime replaces DOM nodes on re-render (see docs/Design
// Decisions - Our approach page.md). A static Astro page has stable nodes,
// so a plain IntersectionObserver is the right tool — per Build Notes'
// explicit instruction to use one in production.

function initSectionNav() {
  const navLinks = Array.from(document.querySelectorAll('[data-section-nav-link]'));
  const sections = Array.from(document.querySelectorAll('[data-approach-section]'));
  if (navLinks.length === 0 || sections.length === 0) return;

  function setActive(id) {
    navLinks.forEach((link) => {
      const on = link.getAttribute('data-section-nav-link') === id;
      link.classList.toggle('active', on);
    });
  }

  // The header is sticky and ~110px tall with breathing room, so a section
  // only counts as "current" once it's past that line, not merely visible.
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      });
    },
    { rootMargin: '-110px 0px -70% 0px', threshold: 0 }
  );
  sections.forEach((s) => io.observe(s));

  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('data-section-nav-link');
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', '#' + id);
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSectionNav);
} else {
  initSectionNav();
}
