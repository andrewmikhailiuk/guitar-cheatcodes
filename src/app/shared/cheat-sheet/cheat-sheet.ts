import { Component, computed, input } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { NoteName } from '../../core/models/note.model';
import { getIntervalFormula, getScaleNotes } from '../../core/utils/music.utils';

@Component({
  selector: 'app-cheat-sheet',
  imports: [TranslocoModule],
  template: `
    <div class="mt-4 space-y-3">
      <!-- Scale info -->
      <div class="p-4 bg-bg-fretboard rounded-lg border border-fret-line space-y-3">
        <div class="flex items-start gap-3">
          <span class="text-xs text-gray-500 uppercase tracking-wider w-20 shrink-0 pt-1">
            {{ 'cheat.notes' | transloco }}
          </span>
          <div class="flex flex-wrap gap-1.5">
            @for (note of noteList(); track note; let i = $index) {
              <span
                class="px-2 py-0.5 rounded font-mono text-sm"
                [class]="i === 0
                  ? 'bg-note-root/20 text-note-root border border-note-root/30'
                  : 'bg-fret-line/30 text-text-primary border border-fret-line/50'"
              >
                {{ note }}
              </span>
            }
          </div>
        </div>

        <div class="flex items-start gap-3">
          <span class="text-xs text-gray-500 uppercase tracking-wider w-20 shrink-0 pt-1">
            {{ 'cheat.formula' | transloco }}
          </span>
          <div class="flex flex-wrap gap-1.5">
            @for (sym of formulaSymbols(); track sym) {
              <span class="px-2 py-0.5 rounded bg-fret-line/30 border border-fret-line/50 font-mono text-sm">
                {{ sym }}
              </span>
            }
          </div>
        </div>

        @if (characterKey()) {
          <div class="flex items-start gap-3">
            <span class="text-xs text-gray-500 uppercase tracking-wider w-20 shrink-0 pt-0.5">
              {{ 'cheat.character' | transloco }}
            </span>
            <span class="text-sm text-gray-400 italic">{{ characterKey()! | transloco }}</span>
          </div>
        }
      </div>

      <!-- Interval reference -->
      <div class="p-4 bg-bg-fretboard rounded-lg border border-fret-line">
        <span class="text-xs text-gray-500 uppercase tracking-wider">{{ 'cheat.intervalRef' | transloco }}</span>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-1 mt-2 text-xs">
          @for (item of intervalRef; track item.symbol) {
            <div class="flex items-center gap-2">
              <span class="font-mono font-bold text-text-primary w-5">{{ item.symbol }}</span>
              <span class="text-gray-500">{{ item.nameKey | transloco }}</span>
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class CheatSheetComponent {
  readonly rootName = input.required<NoteName>();
  readonly intervals = input.required<number[]>();
  readonly characterKey = input<string | undefined>();

  readonly noteList = computed(() =>
    getScaleNotes(this.rootName(), this.intervals()).split(' '),
  );

  readonly formulaSymbols = computed(() =>
    getIntervalFormula(this.intervals()).split(' '),
  );

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
