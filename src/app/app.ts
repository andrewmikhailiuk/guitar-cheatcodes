import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { filter } from 'rxjs';
import { TabNavComponent } from './layout/tab-nav/tab-nav';
import { LanguageSwitcherComponent } from './shared/language-switcher/language-switcher';
import { StorageService } from './core/services/storage.service';

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
export class App implements OnInit {
  private readonly router = inject(Router);
  private readonly storage = inject(StorageService);

  ngOnInit(): void {
    const lastTab = this.storage.get<string>('lastTab', '');
    if (lastTab && this.router.url === '/scales') {
      this.router.navigateByUrl(lastTab);
    }

    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((e) => {
        this.storage.set('lastTab', (e as NavigationEnd).urlAfterRedirects);
      });
  }
}
