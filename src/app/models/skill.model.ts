export type SkillCategory = 'language' | 'framework' | 'tooling' | 'platform' | 'soft';

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  /** Proficiency, 1–5. */
  level: 1 | 2 | 3 | 4 | 5;
  icon?: string;
  featured: boolean;
}
