import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { map, switchMap } from 'rxjs';

import { LanguageService } from '@core/services/language.service';
import { PortfolioApiService } from '@core/services/portfolio-api.service';
import { SeoService } from '@core/services/seo.service';
import { toRequestState } from '@core/utils/request-state';
import { IconComponent } from '@shared/components/icon/icon.component';
import { SkeletonComponent } from '@shared/components/skeleton/skeleton.component';
import { LocalizePipe } from '@shared/pipes/localize.pipe';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [RouterLink, TranslocoModule, LocalizePipe, IconComponent, SkeletonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.scss',
})
export class ProjectDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(PortfolioApiService);
  private readonly seo = inject(SeoService);
  protected readonly language = inject(LanguageService);

  protected readonly lang = this.language.lang;

  private readonly slug$ = this.route.paramMap.pipe(map((params) => params.get('slug') ?? ''));
  protected readonly state = toRequestState(
    this.slug$.pipe(switchMap((slug) => this.api.getProject(slug))),
  );

  constructor() {
    // Keep document title/meta in sync with the loaded project.
    effect(() => {
      const project = this.state().data;
      if (project) {
        this.seo.update({
          title: project.title,
          description: project.summary[this.lang()],
          image: project.thumbnailUrl,
          type: 'article',
        });
      }
    });
  }
}
