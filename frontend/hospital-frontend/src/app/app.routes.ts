import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/auth/auth-module').then(m => m.AuthModule)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./pages/dashboard/dashboard-module').then(m => m.DashboardModule)
  },
  {
    path: 'patients',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./pages/patients/patients-module').then(m => m.PatientsModule)
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];