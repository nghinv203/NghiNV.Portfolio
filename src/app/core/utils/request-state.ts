import { Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, Observable, of, startWith } from 'rxjs';

import { LoadStatus } from '@models/index';

/** View-model for an async request — drives skeleton / empty / error / content UI. */
export interface RequestState<T> {
  status: LoadStatus;
  data: T | null;
  error: unknown;
}

const LOADING: RequestState<never> = { status: 'loading', data: null, error: null };

/**
 * Converts a data Observable into a `RequestState` signal:
 * emits `loading` immediately, then `success` (or `empty`) / `error`.
 * Must be called in an injection context (e.g. a component field initializer).
 */
export function toRequestState<T>(
  source$: Observable<T>,
  options?: { isEmpty?: (value: T) => boolean },
): Signal<RequestState<T>> {
  const state$ = source$.pipe(
    map((data) => ({
      status: (options?.isEmpty?.(data) ? 'empty' : 'success') as LoadStatus,
      data,
      error: null,
    })),
    startWith(LOADING as RequestState<T>),
    catchError((error) => of({ status: 'error' as LoadStatus, data: null, error })),
  );

  return toSignal(state$, { initialValue: LOADING as RequestState<T> });
}

/** Convenience: treat an empty array as the `empty` state. */
export const isEmptyArray = (value: unknown[]): boolean => value.length === 0;
