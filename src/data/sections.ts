// Our-approach section metadata. Panel markup itself stays hand-written in
// our-approach/index.astro (Design Decisions: "sections are written out
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
