import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { TranslocoModule } from '@jsverse/transloco';
import { filter } from 'rxjs';
import { TabNavComponent } from './layout/tab-nav/tab-nav';
import { LanguageSwitcherComponent } from './shared/language-switcher/language-switcher';
import { SeoService } from './core/services/seo.service';
import { StorageService } from './core/services/storage.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TranslocoModule, TabNavComponent, LanguageSwitcherComponent],
  template: `
    <header class="flex items-center justify-between px-4 py-3 border-b border-fret-line">
      <h1 class="text-lg font-bold tracking-wide flex items-center gap-2">
        <svg class="size-6" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="17.6,15.9 16.1,14.4 24.1,6.5 25.5,7.9"/>
          <polygon points="26.2,8.7 23.3,5.8 27.7,2.9 29.1,4.3"/>
          <polyline points="17.7,11.4 3.1,15.9 12.5,19.5 16.1,28.9 20.6,14.3"/>
          <line x1="13.2" y1="15.9" x2="16.1" y2="18.8"/>
        </svg>
        {{ 'app.title' | transloco }}
      </h1>
      <app-language-switcher />
    </header>
    <app-tab-nav />
    <main>
      <router-outlet />
    </main>
    <footer class="mt-12 border-t border-fret-line px-4 py-6 flex flex-col items-center gap-3 text-text-muted">
      <a
        href="https://github.com/andrewmikhailiuk/guitarcodes"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-note-root transition-colors"
      >
        <svg class="size-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
        </svg>
        {{ 'app.rateOnGithub' | transloco }}
      </a>
      <span class="text-xs">&copy; {{ currentYear }} Guitar Codes</span>
    </footer>
  `,
})
export class App implements OnInit {
  readonly currentYear = new Date().getFullYear();
  private readonly router = inject(Router);
  private readonly seo = inject(SeoService);
  private readonly storage = inject(StorageService);
  private readonly swUpdate = inject(SwUpdate);

  ngOnInit(): void {
    this.seo.init();

    const lastTab = this.storage.get<string>('lastTab', '');
    if (lastTab && this.router.url === '/scales') {
      this.router.navigateByUrl(lastTab);
    }

    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((e) => {
        this.storage.set('lastTab', (e as NavigationEnd).urlAfterRedirects);
      });

    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates
        .pipe(filter((e): e is VersionReadyEvent => e.type === 'VERSION_READY'))
        .subscribe(() => document.location.reload());
    }
  }
}
