import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

export interface SeoData {
  title: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
}

const SITE_NAME = 'Nguyen Van Nghi — Software Developer';
const DEFAULT_DESCRIPTION =
  'Portfolio of Nguyen Van Nghi, a software developer working with .NET, Angular and Vue.';

/** Sets document title + meta/Open Graph/Twitter tags per route. SSR-safe. */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly doc = inject(DOCUMENT);

  update(data: SeoData): void {
    const fullTitle = data.title ? `${data.title} · ${SITE_NAME}` : SITE_NAME;
    const description = data.description ?? DEFAULT_DESCRIPTION;

    this.title.setTitle(fullTitle);
    this.meta.updateTag({ name: 'description', content: description });

    this.setOpenGraph(fullTitle, description, data);
    this.setTwitter(fullTitle, description, data.image);
    this.setCanonical(data.url);
  }

  private setOpenGraph(title: string, description: string, data: SeoData): void {
    const tags: Record<string, string | undefined> = {
      'og:title': title,
      'og:description': description,
      'og:type': data.type ?? 'website',
      'og:site_name': SITE_NAME,
      'og:image': data.image,
      'og:url': data.url,
    };
    for (const [property, content] of Object.entries(tags)) {
      if (content) {
        this.meta.updateTag({ property, content });
      }
    }
  }

  private setTwitter(title: string, description: string, image?: string): void {
    this.meta.updateTag({ name: 'twitter:card', content: image ? 'summary_large_image' : 'summary' });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    if (image) {
      this.meta.updateTag({ name: 'twitter:image', content: image });
    }
  }

  private setCanonical(url?: string): void {
    if (!url) {
      return;
    }
    let link = this.doc.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }
}
