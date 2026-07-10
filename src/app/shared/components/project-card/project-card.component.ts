import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';

import { ROUTES } from '@core/constants/routes';
import { AppLang, Project } from '@models/index';
import { IconComponent } from '@shared/components/icon/icon.component';
import { LocalizePipe } from '@shared/pipes/localize.pipe';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [RouterLink, TranslocoModule, LocalizePipe, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.scss',
})
export class ProjectCardComponent {
  readonly project = input.required<Project>();
  readonly lang = input.required<AppLang>();

  protected readonly detailBase = `/${ROUTES.projectDetail}`;
}
