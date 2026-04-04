import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TabNavComponent } from './layout/tab-nav/tab-nav';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TabNavComponent],
  template: `
    <header class="px-4 py-3 border-b border-fret-line">
      <h1 class="text-lg font-bold tracking-wide">Guitar Codes</h1>
    </header>
    <app-tab-nav />
    <main>
      <router-outlet />
    </main>
  `,
})
export class App {}
