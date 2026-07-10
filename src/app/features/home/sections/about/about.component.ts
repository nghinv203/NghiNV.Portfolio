import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';

import { LanguageService } from '@core/services/language.service';
import { PortfolioApiService } from '@core/services/portfolio-api.service';
import { ProfileStore } from '@core/services/profile.store';
import { SECTION_IDS } from '@core/constants/routes';
import { isEmptyArray, toRequestState } from '@core/utils/request-state';
import { SectionHeaderComponent } from '@shared/components/section-header/section-header.component';
import { SkeletonComponent } from '@shared/components/skeleton/skeleton.component';
import { LocalizePipe } from '@shared/pipes/localize.pipe';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [TranslocoModule, LocalizePipe, SectionHeaderComponent, SkeletonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent {
  private readonly api = inject(PortfolioApiService);
  private readonly profileStore = inject(ProfileStore);
  protected readonly language = inject(LanguageService);

  protected readonly profile = this.profileStore.state;
  protected readonly education = toRequestState(this.api.getEducation(), { isEmpty: isEmptyArray });
  protected readonly certificates = toRequestState(this.api.getCertificates(), {
    isEmpty: isEmptyArray,
  });

  protected readonly lang = this.language.lang;
  protected readonly sectionIds = SECTION_IDS;
}
