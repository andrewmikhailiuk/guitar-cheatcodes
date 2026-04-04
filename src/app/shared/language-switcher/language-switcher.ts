import { Component, inject } from '@angular/core';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-language-switcher',
  imports: [TranslocoModule],
  template: `
    <button
      (click)="toggle()"
      class="text-sm px-2 py-1 border border-fret-line rounded hover:bg-fret-line transition-colors"
    >
      {{ 'language.switch' | transloco }}
    </button>
  `,
})
export class LanguageSwitcherComponent {
  private readonly transloco = inject(TranslocoService);

  toggle(): void {
    const current = this.transloco.getActiveLang();
    const next = current === 'en' ? 'ru' : 'en';
    this.transloco.setActiveLang(next);
    try {
      localStorage.setItem('gc_language', next);
    } catch {
      // localStorage unavailable
    }
  }
}
