import { computed, inject, Injectable } from '@angular/core';

import { toRequestState } from '@core/utils/request-state';
import { PortfolioApiService } from './portfolio-api.service';

/**
 * Shared profile state. The profile is used by several sections (hero, about,
 * contact, footer); this keeps it to a single request whose `RequestState`
 * signal is read by every consumer.
 */
@Injectable({ providedIn: 'root' })
export class ProfileStore {
  private readonly api = inject(PortfolioApiService);

  /** Full request state (status + data) for skeleton/error handling. */
  readonly state = toRequestState(this.api.getProfile());

  /** Convenience accessor for the loaded profile (null until loaded). */
  readonly profile = computed(() => this.state().data);
}
