import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'modes',
    loadComponent: () =>
      import('./features/scales/scales').then((m) => m.ScalesComponent),
  },
  {
    path: 'gammas',
    loadComponent: () =>
      import('./features/gammas/gammas').then((m) => m.GammasComponent),
  },
  {
    path: 'pentatonics',
    loadComponent: () =>
      import('./features/pentatonics/pentatonics').then(
        (m) => m.PentatonicsComponent,
      ),
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
  { path: '', redirectTo: 'modes', pathMatch: 'full' },
  { path: 'scales', redirectTo: 'modes' },
  { path: '**', redirectTo: 'modes' },
];
