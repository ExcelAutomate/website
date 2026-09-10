// Our-approach section metadata. Panel markup itself stays hand-written in
// src/pages/learn-more/index.astro (route renamed 2026-09-10, see
// DECISIONS.md) (Design Decisions: "sections are written out
// explicitly... this is deliberate duplication, don't refactor into a loop")
// — this file only holds the bits every other page needs to reference a
// section by id (nav, article back-links).

export type SectionId = 'key-ideas' | 'modern-excel' | 'excel-tips' | 'beyond-excel';

export const SECTIONS: { id: SectionId; label: string }[] = [
  { id: 'key-ideas', label: 'Key ideas' },
  { id: 'modern-excel', label: 'Modern Excel' },
  { id: 'excel-tips', label: 'Excel tips' },
  { id: 'beyond-excel', label: 'Beyond Excel' },
];

export function sectionLabel(id: SectionId): string {
  return SECTIONS.find((s) => s.id === id)?.label ?? id;
}

// Key ideas carries no heading of its own (the page h1 does that job), so
// jumping straight to its panel reads as landing mid-page — every menu that
// can target it (header dropdown, side nav) sends visitors to the top of the
// page instead. Kept as one constant rather than three hardcoded exceptions
// (Changes - 10 September 2026.md, #9). section-nav.js can't import this
// (plain script, no module graph) so it keeps its own copy of the literal —
// keep the two in sync if this ever changes.
export const TOP_SECTION_ID: SectionId = SECTIONS[0].id;
