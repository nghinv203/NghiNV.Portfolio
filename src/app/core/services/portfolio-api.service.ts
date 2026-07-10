import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from '@env/environment';
import {
  ApiListResponse,
  ApiResponse,
  Certificate,
  ContactResult,
  Education,
  Experience,
  Profile,
  Project,
  ProjectDetail,
  Skill,
} from '@models/index';

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
}

/**
 * Single typed gateway to the portfolio data API. Uses a real HttpClient against
 * `environment.apiBaseUrl`; the mockBackendInterceptor answers while `useMock` is on.
 * Swapping to a real backend (Phase 7) requires no changes here — just flip the flag.
 */
@Injectable({ providedIn: 'root' })
export class PortfolioApiService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiBaseUrl;

  getProfile(): Observable<Profile> {
    return this.single<Profile>('/profile');
  }

  getSkills(): Observable<Skill[]> {
    return this.list<Skill>('/skills');
  }

  getExperience(): Observable<Experience[]> {
    return this.list<Experience>('/experience');
  }

  getProjects(): Observable<Project[]> {
    return this.list<Project>('/projects');
  }

  getProject(slug: string): Observable<ProjectDetail> {
    return this.single<ProjectDetail>(`/projects/${encodeURIComponent(slug)}`);
  }

  getCertificates(): Observable<Certificate[]> {
    return this.list<Certificate>('/certificates');
  }

  getEducation(): Observable<Education[]> {
    return this.list<Education>('/education');
  }

  sendContact(payload: ContactPayload): Observable<ContactResult> {
    return this.http
      .post<ApiResponse<ContactResult>>(`${this.base}/contact`, payload)
      .pipe(map((res) => res.data));
  }

  private single<T>(path: string): Observable<T> {
    return this.http.get<ApiResponse<T>>(`${this.base}${path}`).pipe(map((res) => res.data));
  }

  private list<T>(path: string): Observable<T[]> {
    return this.http.get<ApiListResponse<T>>(`${this.base}${path}`).pipe(map((res) => res.data));
  }
}
