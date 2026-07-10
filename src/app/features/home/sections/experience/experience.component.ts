import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';

import { LanguageService } from '@core/services/language.service';
import { PortfolioApiService } from '@core/services/portfolio-api.service';
import { SECTION_IDS } from '@core/constants/routes';
import { isEmptyArray, toRequestState } from '@core/utils/request-state';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '@shared/components/error-state/error-state.component';
import { SectionHeaderComponent } from '@shared/components/section-header/section-header.component';
import { SkeletonComponent } from '@shared/components/skeleton/skeleton.component';
import { LocalizePipe } from '@shared/pipes/localize.pipe';
import { MonthYearPipe } from '@shared/pipes/month-year.pipe';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [
    TranslocoModule,
    LocalizePipe,
    MonthYearPipe,
    SectionHeaderComponent,
    SkeletonComponent,
    EmptyStateComponent,
    ErrorStateComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.scss',
})
export class ExperienceComponent {
  private readonly api = inject(PortfolioApiService);
  protected readonly language = inject(LanguageService);

  protected readonly state = toRequestState(this.api.getExperience(), { isEmpty: isEmptyArray });
  protected readonly lang = this.language.lang;
  protected readonly sectionIds = SECTION_IDS;
  protected readonly skeletonRows = Array.from({ length: 2 });
}
