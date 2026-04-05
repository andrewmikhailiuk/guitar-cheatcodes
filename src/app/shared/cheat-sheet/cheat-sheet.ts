import { Component, computed, DestroyRef, inject, input, signal } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { NoteName } from '../../core/models/note.model';
import { getIntervalFormula, getScaleNotes } from '../../core/utils/music.utils';

@Component({
  selector: 'app-cheat-sheet',
  imports: [TranslocoModule],
  template: `
    <div class="mt-3 space-y-2 px-4">
      <!-- Compact info line -->
      <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
        <span class="text-gray-400">{{ 'cheat.notes' | transloco }}:</span>
        <span class="font-mono text-sm">
          @for (note of noteList(); track note; let i = $index) {
            <span [class]="i === 0 ? 'text-note-root font-bold' : 'text-text-primary'">{{ note }}</span>
            @if (i < noteList().length - 1) {
              <span class="text-fret-line mx-0.5">·</span>
            }
          }
        </span>

        <span class="text-fret-line">|</span>

        <span class="text-gray-400">{{ 'cheat.formula' | transloco }}:</span>
        <span class="font-mono text-sm">
          @for (sym of formulaSymbols(); track sym) {
            <button
              type="button"
              class="cursor-pointer hover:text-note-root transition-colors bg-transparent border-none p-0 font-[inherit] text-[length:inherit] text-[inherit]"
              (click)="flashInterval(sym)"
            >{{ sym }}</button>
            @if (!$last) {
              <span class="text-fret-line mx-0.5">·</span>
            }
          }
        </span>

        @if (characterKey()) {
          <span class="text-fret-line">|</span>
          <span class="text-gray-300 italic">{{ characterKey()! | transloco }}</span>
        }
      </div>

      <!-- Collapsible interval reference -->
      <div>
        <button
          class="text-xs text-gray-400 hover:text-gray-300 transition-colors"
          (click)="showRef.set(!showRef())"
        >
          {{ 'cheat.intervalRef' | transloco }}
          {{ showRef() ? '▾' : '▸' }}
        </button>

        @if (showRef()) {
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5 mt-2">
            @for (item of intervalRef; track item.symbol) {
              <div
                class="flex items-center gap-2 px-2 py-1 rounded text-xs transition-all duration-200"
                [class]="flashedInterval() === item.symbol
                  ? 'bg-note-root/20 text-note-root'
                  : 'bg-fret-line/10 text-gray-400'"
              >
                <span class="font-mono font-bold text-text-primary w-5">{{ item.symbol }}</span>
                <span>{{ item.nameKey | transloco }}</span>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
})
export class CheatSheetComponent {
  private readonly destroyRef = inject(DestroyRef);
  private flashTimeout: ReturnType<typeof setTimeout> | null = null;

  readonly rootName = input.required<NoteName>();
  readonly intervals = input.required<number[]>();
  readonly characterKey = input<string | undefined>();

  readonly showRef = signal(true);
  readonly flashedInterval = signal<string | null>(null);

  readonly noteList = computed(() =>
    getScaleNotes(this.rootName(), this.intervals()).split(' '),
  );

  readonly formulaSymbols = computed(() =>
    getIntervalFormula(this.intervals()).split(' '),
  );

  constructor() {
    this.destroyRef.onDestroy(() => {
      if (this.flashTimeout) clearTimeout(this.flashTimeout);
    });
  }

  flashInterval(symbol: string): void {
    if (this.flashTimeout) clearTimeout(this.flashTimeout);
    this.showRef.set(true);
    this.flashedInterval.set(symbol);
    this.flashTimeout = setTimeout(() => this.flashedInterval.set(null), 1500);
  }

  readonly intervalRef = [
    { symbol: '1',  nameKey: 'intRef.1' },
    { symbol: 'b2', nameKey: 'intRef.b2' },
    { symbol: '2',  nameKey: 'intRef.2' },
    { symbol: 'b3', nameKey: 'intRef.b3' },
    { symbol: '3',  nameKey: 'intRef.3' },
    { symbol: '4',  nameKey: 'intRef.4' },
    { symbol: 'b5', nameKey: 'intRef.b5' },
    { symbol: '5',  nameKey: 'intRef.5' },
    { symbol: 'b6', nameKey: 'intRef.b6' },
    { symbol: '6',  nameKey: 'intRef.6' },
    { symbol: 'b7', nameKey: 'intRef.b7' },
    { symbol: '7',  nameKey: 'intRef.7' },
  ];
}
