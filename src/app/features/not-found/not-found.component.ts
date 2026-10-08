import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';

import { SeoService } from '@core/services/seo.service';
import { MascotComponent } from '@shared/components/mascot/mascot.component';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink, TranslocoModule, MascotComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
})
export class NotFoundComponent implements OnInit {
  private readonly seo = inject(SeoService);
  private readonly transloco = inject(TranslocoService);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    // selectTranslate waits for the active language file to load (avoids an
    // empty title / missing-translation warning during SSR).
    this.transloco
      .selectTranslate('notFound.title')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((title) => this.seo.update({ title }));
  }
}
