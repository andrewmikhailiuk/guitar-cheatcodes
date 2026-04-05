import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'gammas',
    loadComponent: () =>
      import('./features/gammas/gammas').then((m) => m.GammasComponent),
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
  {
    path: 'metronome',
    loadComponent: () =>
      import('./features/metronome/metronome').then((m) => m.MetronomeComponent),
  },
  { path: '', redirectTo: 'gammas', pathMatch: 'full' },
  { path: '**', redirectTo: 'gammas' },
];
