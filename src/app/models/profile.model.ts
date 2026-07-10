import { LocalizedString } from './api.model';

export interface SocialLink {
  platform: 'github' | 'linkedin' | 'x' | 'email' | (string & {});
  url: string;
  /** Icon identifier consumed by the shared icon component. */
  icon: string;
}

export interface ContactInfo {
  email: string;
  phone?: string;
  location?: string;
  availableForWork: boolean;
}

/** Drives the Hero + About sections. */
export interface Profile {
  fullName: string;
  title: LocalizedString;
  avatarUrl: string;
  bio: LocalizedString;
  location: string;
  yearsOfExperience: number;
  resumeUrl?: string;
  socials: SocialLink[];
  contact: ContactInfo;
}
