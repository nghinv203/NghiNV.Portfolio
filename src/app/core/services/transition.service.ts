import { Injectable, signal } from '@angular/core';

export type TransitionKind = 'theme-to-dark' | 'theme-to-light' | 'language';

export interface TransitionConfig {
  kind: TransitionKind;
  /** Applied at the midpoint, while the overlay hides the swap. */
  apply: () => void;
  /** Language-only: flag image URL + autonym shown during the reveal. */
  flag?: string;
  label?: string;
}

const DURATION = 2000;
const APPLY_AT = 900;

/**
 * Drives the full-screen scene transitions used when switching theme or
 * language. The overlay covers the page for ~3s; the actual change is applied
 * at the midpoint so it happens unseen and is revealed as the overlay clears.
 *
 * Under prefers-reduced-motion (or on the server) the change is applied
 * immediately with no overlay.
 */
@Injectable({ providedIn: 'root' })
export class TransitionService {
  private readonly _active = signal(false);
  private readonly _kind = signal<TransitionKind>('theme-to-dark');
  private readonly _flag = signal<string | null>(null);
  private readonly _label = signal('');

  readonly active = this._active.asReadonly();
  readonly kind = this._kind.asReadonly();
  readonly flag = this._flag.asReadonly();
  readonly label = this._label.asReadonly();

  private applyTimer?: ReturnType<typeof setTimeout>;
  private endTimer?: ReturnType<typeof setTimeout>;
  private pendingApply?: () => void;

  play(config: TransitionConfig): void {
    const canAnimate =
      typeof window !== 'undefined' &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!canAnimate) {
      config.apply();
      return;
    }

    // Flush any in-flight transition so a rapid re-trigger never loses a change.
    clearTimeout(this.applyTimer);
    clearTimeout(this.endTimer);
    this.flushPending();

    this._kind.set(config.kind);
    this._flag.set(config.flag ?? null);
    this._label.set(config.label ?? '');
    this.pendingApply = config.apply;
    this._active.set(true);

    this.applyTimer = setTimeout(() => this.flushPending(), APPLY_AT);
    this.endTimer = setTimeout(() => this._active.set(false), DURATION);
  }

  private flushPending(): void {
    const fn = this.pendingApply;
    this.pendingApply = undefined;
    fn?.();
  }
}
