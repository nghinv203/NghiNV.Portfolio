/** Central route paths, so links and router config never drift out of sync. */
export const ROUTES = {
  home: '',
  projectDetail: 'projects',
} as const;

/** In-page section anchors used by the header nav (home page is a single scroll page). */
export const SECTION_IDS = {
  hero: 'hero',
  about: 'about',
  skills: 'skills',
  experience: 'experience',
  projects: 'projects',
  contact: 'contact',
} as const;

export type SectionId = (typeof SECTION_IDS)[keyof typeof SECTION_IDS];
