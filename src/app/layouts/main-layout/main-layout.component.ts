import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';

import { LanguageService } from '@core/services/language.service';
import { ProfileStore } from '@core/services/profile.store';
import { SECTION_IDS } from '@core/constants/routes';
import { IconComponent } from '@shared/components/icon/icon.component';
import { LanguageSwitcherComponent } from '@shared/components/language-switcher/language-switcher.component';
import { ThemeToggleComponent } from '@shared/components/theme-toggle/theme-toggle.component';

interface NavItem {
  id: string;
  key: string;
}

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    TranslocoModule,
    IconComponent,
    ThemeToggleComponent,
    LanguageSwitcherComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {
  private readonly profileStore = inject(ProfileStore);
  protected readonly language = inject(LanguageService);

  protected readonly menuOpen = signal(false);
  protected readonly year = new Date().getFullYear();
  protected readonly profile = this.profileStore.profile;

  protected readonly navItems: NavItem[] = [
    { id: SECTION_IDS.about, key: 'nav.about' },
    { id: SECTION_IDS.skills, key: 'nav.skills' },
    { id: SECTION_IDS.experience, key: 'nav.experience' },
    { id: SECTION_IDS.projects, key: 'nav.projects' },
    { id: SECTION_IDS.contact, key: 'nav.contact' },
  ];

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }
}
