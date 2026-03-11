import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'login',
    renderMode: RenderMode.Client
  },
  {
    path: 'dashboard',
    renderMode: RenderMode.Client
  },
  {
    path: 'patients',
    renderMode: RenderMode.Client
  },
  {
    path: 'patients/add',
    renderMode: RenderMode.Client
  },
  {
    path: 'patients/edit/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'appointments',
    renderMode: RenderMode.Client
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];