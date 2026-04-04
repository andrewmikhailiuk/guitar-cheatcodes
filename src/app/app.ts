import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { TabNavComponent } from './layout/tab-nav/tab-nav';
import { LanguageSwitcherComponent } from './shared/language-switcher/language-switcher';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TranslocoModule, TabNavComponent, LanguageSwitcherComponent],
  template: `
    <header class="flex items-center justify-between px-4 py-3 border-b border-fret-line">
      <h1 class="text-lg font-bold tracking-wide">{{ 'app.title' | transloco }}</h1>
      <app-language-switcher />
    </header>
    <app-tab-nav />
    <main>
      <router-outlet />
    </main>
  `,
})
export class App {}
