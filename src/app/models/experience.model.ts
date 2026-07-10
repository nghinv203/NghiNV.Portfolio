import { LocalizedString } from './api.model';

export interface Experience {
  id: string;
  company: string;
  role: LocalizedString;
  /** ISO date (YYYY-MM). */
  startDate: string;
  /** ISO date, or null when this is the current role. */
  endDate: string | null;
  location?: string;
  summary: LocalizedString;
  highlights: LocalizedString[];
  techStack: string[];
  companyUrl?: string;
}
