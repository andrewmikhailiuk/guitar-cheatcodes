import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'scales',
    loadComponent: () =>
      import('./features/scales/scales').then((m) => m.ScalesComponent),
  },
  {
    path: 'tunings',
    loadComponent: () =>
      import('./features/tunings/tunings').then((m) => m.TuningsComponent),
  },
  {
    path: 'eq',
    loadComponent: () =>
      import('./features/eq/eq').then((m) => m.EqComponent),
  },
  { path: '', redirectTo: 'scales', pathMatch: 'full' },
  { path: '**', redirectTo: 'scales' },
];
