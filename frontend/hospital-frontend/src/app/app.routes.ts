import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    loadChildren: () => import('./pages/auth/auth-module').then(m => m.AuthModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard-module').then(m => m.DashboardModule),
    canActivate: [authGuard]
  },
  {
    path: 'patients',
    loadChildren: () => import('./pages/patients/patients-module').then(m => m.PatientsModule),
    canActivate: [authGuard]
  },
  {
    path: 'appointments',
    loadComponent: () => import('./pages/appointments/appointments').then(m => m.AppointmentsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'access-logs',
    loadComponent: () => import('./pages/access-logs/access-logs').then(m => m.AccessLogsComponent),
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '/login' }
];