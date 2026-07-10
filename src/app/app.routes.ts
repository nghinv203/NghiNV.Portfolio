import { Routes } from '@angular/router';

import { MainLayoutComponent } from '@layouts/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('@features/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'projects/:slug',
        loadComponent: () =>
          import('@features/projects/project-detail.component').then((m) => m.ProjectDetailComponent),
      },
      {
        path: '**',
        loadComponent: () =>
          import('@features/not-found/not-found.component').then((m) => m.NotFoundComponent),
      },
    ],
  },
];
