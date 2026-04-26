import {
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { LANGUAGES, LanguageOption } from './languages';

@Component({
  selector: 'app-language-switcher',
  imports: [TranslocoModule],
  template: `
    <div class="relative" #root>
      <button
        type="button"
        (click)="toggle()"
        [attr.aria-expanded]="open()"
        aria-haspopup="listbox"
        class="text-sm px-2 py-1 border border-fret-line rounded hover:bg-fret-line transition-colors uppercase inline-flex items-center gap-1"
      >
        <span>{{ activeCode() }}</span>
        <svg
          class="size-3 transition-transform"
          [class.rotate-180]="open()"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <polyline points="3,4.5 6,7.5 9,4.5" />
        </svg>
      </button>

      @if (open()) {
        <div
          class="absolute right-0 top-full mt-1 z-50 w-52 bg-bg-fretboard border border-fret-line rounded shadow-lg"
        >
          <input
            #search
            type="text"
            [value]="filter()"
            (input)="onFilter($event)"
            (keydown)="onKeydown($event)"
            placeholder="Search…"
            class="w-full bg-bg-primary text-text-primary border-b border-fret-line px-3 py-2 text-sm outline-none focus:border-note-root/50"
          />
          <ul role="listbox" class="max-h-64 overflow-y-auto py-1">
            @for (lang of filtered(); track lang.code) {
              <li>
                <button
                  type="button"
                  role="option"
                  [attr.aria-selected]="lang.code === activeCode()"
                  (click)="select(lang.code)"
                  class="w-full text-left px-3 py-2 text-sm flex items-center justify-between gap-2 hover:bg-fret-line transition-colors"
                  [class.text-note-root]="lang.code === activeCode()"
                >
                  <span>{{ lang.nativeName }}</span>
                  <span class="text-xs uppercase text-text-muted">{{ lang.code }}</span>
                </button>
              </li>
            } @empty {
              <li class="px-3 py-2 text-sm text-text-muted">No matches</li>
            }
          </ul>
        </div>
      }
    </div>
  `,
})
export class LanguageSwitcherComponent {
  private readonly transloco = inject(TranslocoService);
  private readonly host = inject(ElementRef<HTMLElement>);

  @ViewChild('search') searchInput?: ElementRef<HTMLInputElement>;

  readonly languages = LANGUAGES;
  readonly open = signal(false);
  readonly filter = signal('');
  readonly activeCode = signal(this.transloco.getActiveLang());

  readonly filtered = computed<LanguageOption[]>(() => {
    const q = this.filter().trim().toLowerCase();
    if (!q) return [...this.languages];
    return this.languages.filter(
      (l) =>
        l.code.toLowerCase().includes(q) ||
        l.nativeName.toLowerCase().includes(q) ||
        l.englishName.toLowerCase().includes(q),
    );
  });

  toggle(): void {
    this.open.update((v) => !v);
    if (this.open()) {
      this.filter.set('');
      setTimeout(() => this.searchInput?.nativeElement.focus(), 0);
    }
  }

  close(): void {
    this.open.set(false);
  }

  onFilter(e: Event): void {
    this.filter.set((e.target as HTMLInputElement).value);
  }

  onKeydown(e: KeyboardEvent): void {
    if (e.key === 'Escape') {
      this.close();
      return;
    }
    if (e.key === 'Enter') {
      const first = this.filtered()[0];
      if (first) this.select(first.code);
    }
  }

  select(code: string): void {
    this.transloco.setActiveLang(code);
    this.activeCode.set(code);
    try {
      localStorage.setItem('gc_language', code);
    } catch {
      // localStorage unavailable
    }
    this.close();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(e: MouseEvent): void {
    if (!this.open()) return;
    if (!this.host.nativeElement.contains(e.target as Node)) {
      this.close();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close();
  }
}
