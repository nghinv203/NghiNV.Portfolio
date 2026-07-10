import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';

import { LanguageService } from '@core/services/language.service';
import { PortfolioApiService } from '@core/services/portfolio-api.service';
import { SECTION_IDS } from '@core/constants/routes';
import { isEmptyArray, toRequestState } from '@core/utils/request-state';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '@shared/components/error-state/error-state.component';
import { ProjectCardComponent } from '@shared/components/project-card/project-card.component';
import { SectionHeaderComponent } from '@shared/components/section-header/section-header.component';
import { SkeletonComponent } from '@shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    TranslocoModule,
    SectionHeaderComponent,
    ProjectCardComponent,
    SkeletonComponent,
    EmptyStateComponent,
    ErrorStateComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent {
  private readonly api = inject(PortfolioApiService);
  protected readonly language = inject(LanguageService);

  protected readonly state = toRequestState(this.api.getProjects(), { isEmpty: isEmptyArray });
  protected readonly lang = this.language.lang;
  protected readonly sectionIds = SECTION_IDS;
  protected readonly skeletonCards = Array.from({ length: 3 });

  /** Featured projects first, then by most recent year. */
  protected readonly ordered = computed(() =>
    [...(this.state().data ?? [])].sort((a, b) => {
      if (a.featured !== b.featured) {
        return a.featured ? -1 : 1;
      }
      return b.year - a.year;
    }),
  );
}
