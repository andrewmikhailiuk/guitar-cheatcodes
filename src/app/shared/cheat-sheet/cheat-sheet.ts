import { Component, computed, input } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { NoteName } from '../../core/models/note.model';
import { getIntervalFormula, getScaleNotes } from '../../core/utils/music.utils';

const INTERVAL_LABELS: Record<string, string> = {
  '1': 'тоника', 'b2': 'м.2', '2': 'б.2',
  'b3': 'м.3', '3': 'б.3', '4': 'ч.4',
  'b5': 'тритон', '5': 'ч.5', 'b6': 'м.6',
  '6': 'б.6', 'b7': 'м.7', '7': 'б.7',
};

@Component({
  selector: 'app-cheat-sheet',
  imports: [TranslocoModule],
  template: `
    <div class="mt-4 p-4 bg-bg-fretboard rounded-lg border border-fret-line space-y-3">
      <!-- Notes -->
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

      <!-- Formula -->
      <div class="flex items-start gap-3">
        <span class="text-xs text-gray-500 uppercase tracking-wider w-20 shrink-0 pt-1">
          {{ 'cheat.formula' | transloco }}
        </span>
        <div class="flex flex-wrap gap-1.5">
          @for (int of intervalInfos(); track int.symbol) {
            <span class="inline-flex items-baseline gap-1 px-2 py-0.5 rounded bg-fret-line/30 border border-fret-line/50">
              <span class="font-mono text-sm text-text-primary font-bold">{{ int.symbol }}</span>
              <span class="text-xs text-gray-500">{{ int.name }}</span>
            </span>
          }
        </div>
      </div>

      <!-- Character -->
      @if (characterKey()) {
        <div class="flex items-start gap-3">
          <span class="text-xs text-gray-500 uppercase tracking-wider w-20 shrink-0 pt-0.5">
            {{ 'cheat.character' | transloco }}
          </span>
          <span class="text-sm text-gray-400 italic">{{ characterKey()! | transloco }}</span>
        </div>
      }
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

  readonly intervalInfos = computed(() => {
    const parts = getIntervalFormula(this.intervals()).split(' ');
    return parts.map((p) => ({
      symbol: p,
      name: INTERVAL_LABELS[p] ?? p,
    }));
  });
}
