import { LocalizedString } from './api.model';

export interface Project {
  id: string;
  slug: string;
  title: string;
  summary: LocalizedString;
  thumbnailUrl: string;
  techStack: string[];
  featured: boolean;
  links: { demo?: string; repo?: string };
  year: number;
}

/** Full project record used on the detail page (fetched by slug). */
export interface ProjectDetail extends Project {
  description: LocalizedString;
  gallery: string[];
  role?: LocalizedString;
  problem?: LocalizedString;
  solution?: LocalizedString;
}
