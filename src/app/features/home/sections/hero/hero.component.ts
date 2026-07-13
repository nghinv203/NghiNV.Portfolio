import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';

import { LanguageService } from '@core/services/language.service';
import { ProfileStore } from '@core/services/profile.store';
import { SECTION_IDS } from '@core/constants/routes';
import { HeroSceneComponent } from '@shared/components/hero-scene/hero-scene.component';
import { IconComponent } from '@shared/components/icon/icon.component';
import { SkeletonComponent } from '@shared/components/skeleton/skeleton.component';
import { LocalizePipe } from '@shared/pipes/localize.pipe';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [RouterLink, TranslocoModule, LocalizePipe, IconComponent, SkeletonComponent, HeroSceneComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroComponent {
  private readonly profileStore = inject(ProfileStore);
  protected readonly language = inject(LanguageService);

  protected readonly state = this.profileStore.state;
  protected readonly lang = this.language.lang;
  protected readonly sectionIds = SECTION_IDS;
}
