import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';

import { PortfolioApiService } from '@core/services/portfolio-api.service';
import { SECTION_IDS } from '@core/constants/routes';
import { isEmptyArray, toRequestState } from '@core/utils/request-state';
import { Skill, SkillCategory } from '@models/index';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '@shared/components/error-state/error-state.component';
import { SectionHeaderComponent } from '@shared/components/section-header/section-header.component';
import { SkeletonComponent } from '@shared/components/skeleton/skeleton.component';

import { SKILL_ICONS, SkillIcon } from './skill-icons';

interface SkillGroup {
  category: SkillCategory;
  labelKey: string;
  items: Skill[];
}

const CATEGORY_ORDER: { category: SkillCategory; labelKey: string }[] = [
  { category: 'language', labelKey: 'skills.categories.language' },
  { category: 'framework', labelKey: 'skills.categories.framework' },
  { category: 'platform', labelKey: 'skills.categories.platform' },
  { category: 'tooling', labelKey: 'skills.categories.tooling' },
  { category: 'soft', labelKey: 'skills.categories.soft' },
];

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [
    TranslocoModule,
    SectionHeaderComponent,
    SkeletonComponent,
    EmptyStateComponent,
    ErrorStateComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss',
})
export class SkillsComponent {
  private readonly api = inject(PortfolioApiService);

  protected readonly state = toRequestState(this.api.getSkills(), { isEmpty: isEmptyArray });
  protected readonly sectionIds = SECTION_IDS;
  protected readonly skeletonRows = Array.from({ length: 4 });

  protected readonly groups = computed<SkillGroup[]>(() => {
    const skills = this.state().data ?? [];
    return CATEGORY_ORDER.map(({ category, labelKey }) => ({
      category,
      labelKey,
      items: skills.filter((s) => s.category === category),
    })).filter((group) => group.items.length > 0);
  });

  /** Brand logo for a skill, or null to fall back to a generic glyph. */
  protected iconFor(id: string): SkillIcon | null {
    return SKILL_ICONS[id] ?? null;
  }
}
