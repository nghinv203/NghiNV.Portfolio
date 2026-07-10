import { HttpRequest } from '@angular/common/http';

import {
  ApiListResponse,
  ApiResponse,
  ContactResult,
  Project,
  ProjectDetail,
} from '@models/index';

import { CERTIFICATES, EDUCATION } from './data/credentials.data';
import { EXPERIENCE } from './data/experience.data';
import { PROFILE } from './data/profile.data';
import { PROJECTS } from './data/projects.data';
import { SKILLS } from './data/skills.data';

/** A resolved mock outcome. `null` from the router means "not a mock route — pass through". */
export interface MockResult {
  status: number;
  body: unknown;
}

const list = <T>(data: T[]): ApiListResponse<T> => ({ data, total: data.length });
const single = <T>(data: T): ApiResponse<T> => ({ data });

/** Project list is a projection of the detail records (no separate source of truth). */
function toProjectSummary(p: ProjectDetail): Project {
  const { description, gallery, role, problem, solution, ...summary } = p;
  return summary;
}

/**
 * Maps an intercepted `/api/*` request to a mock response.
 * Returns `null` for unknown routes so the interceptor can fall through.
 */
export function resolveMockRequest(req: HttpRequest<unknown>): MockResult | null {
  // Normalise: drop origin + query, then the leading `/api`.
  const path = req.url.replace(/^https?:\/\/[^/]+/, '').split('?')[0].replace(/^\/api/, '');
  const method = req.method.toUpperCase();

  if (method === 'GET') {
    switch (true) {
      case path === '/profile':
        return { status: 200, body: single(PROFILE) };
      case path === '/skills':
        return { status: 200, body: list(SKILLS) };
      case path === '/experience':
        return { status: 200, body: list(EXPERIENCE) };
      case path === '/projects':
        return { status: 200, body: list(PROJECTS.map(toProjectSummary)) };
      case path === '/certificates':
        return { status: 200, body: list(CERTIFICATES) };
      case path === '/education':
        return { status: 200, body: list(EDUCATION) };
      case path.startsWith('/projects/'): {
        const slug = decodeURIComponent(path.slice('/projects/'.length));
        const detail = PROJECTS.find((p) => p.slug === slug);
        return detail
          ? { status: 200, body: single(detail) }
          : { status: 404, body: { message: `Project "${slug}" not found` } };
      }
    }
  }

  if (method === 'POST' && path === '/contact') {
    const result: ContactResult = { ok: true };
    return { status: 200, body: single(result) };
  }

  return null;
}
