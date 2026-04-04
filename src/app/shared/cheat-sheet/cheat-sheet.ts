import { Component, computed, input } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { NoteName } from '../../core/models/note.model';
import { getIntervalFormula, getScaleNotes } from '../../core/utils/music.utils';

const SOLFEGE: Record<string, string> = {
  'C': 'До', 'C#': 'До#', 'D': 'Ре', 'D#': 'Ре#',
  'E': 'Ми', 'F': 'Фа', 'F#': 'Фа#', 'G': 'Соль',
  'G#': 'Соль#', 'A': 'Ля', 'A#': 'Ля#', 'B': 'Си',
};

const INTERVAL_LABELS: Record<string, string> = {
  '1': 'тоника', 'b2': 'мал. секунда', '2': 'бол. секунда',
  'b3': 'мал. терция', '3': 'бол. терция', '4': 'кварта',
  'b5': 'тритон', '5': 'квинта', 'b6': 'мал. секста',
  '6': 'бол. секста', 'b7': 'мал. септима', '7': 'бол. септима',
};

interface NoteInfo {
  letter: string;
  solfege: string;
}

interface IntervalInfo {
  symbol: string;
  name: string;
}

@Component({
  selector: 'app-cheat-sheet',
  imports: [TranslocoModule],
  template: `
    <div class="mt-4 space-y-3">
      <!-- Scale info -->
      <div class="p-3 bg-bg-fretboard rounded border border-fret-line text-sm space-y-1">
        <div class="flex flex-wrap gap-x-6 gap-y-1">
          <span class="text-gray-400">{{ 'cheat.formula' | transloco }}:</span>
          <span class="font-mono tracking-wide">{{ formula() }}</span>
        </div>
        @if (characterKey()) {
          <div class="text-gray-500 italic text-xs">{{ characterKey()! | transloco }}</div>
        }
      </div>

      <!-- Notes reference -->
      <div class="p-3 bg-bg-fretboard rounded border border-fret-line">
        <div class="text-xs text-gray-400 mb-2">{{ 'cheat.notes' | transloco }}</div>
        <div class="flex flex-wrap gap-2">
          @for (note of noteInfos(); track note.letter) {
            <div class="flex flex-col items-center px-2 py-1 rounded bg-bg-primary min-w-[40px]">
              <span class="font-mono font-bold text-sm">{{ note.letter }}</span>
              <span class="text-xs text-gray-500">{{ note.solfege }}</span>
            </div>
          }
        </div>
      </div>

      <!-- Intervals reference -->
      <div class="p-3 bg-bg-fretboard rounded border border-fret-line">
        <div class="text-xs text-gray-400 mb-2">{{ 'cheat.intervals' | transloco }}</div>
        <div class="flex flex-wrap gap-2">
          @for (int of intervalInfos(); track int.symbol) {
            <div class="flex flex-col items-center px-2 py-1 rounded bg-bg-primary min-w-[60px]">
              <span class="font-mono font-bold text-sm">{{ int.symbol }}</span>
              <span class="text-xs text-gray-500">{{ int.name }}</span>
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

  readonly formula = computed(() =>
    getIntervalFormula(this.intervals()),
  );

  readonly noteInfos = computed((): NoteInfo[] => {
    const noteNames = getScaleNotes(this.rootName(), this.intervals()).split(' ');
    return noteNames.map((n) => ({
      letter: n,
      solfege: SOLFEGE[n] ?? n,
    }));
  });

  readonly intervalInfos = computed((): IntervalInfo[] => {
    const parts = getIntervalFormula(this.intervals()).split(' ');
    return parts.map((p) => ({
      symbol: p,
      name: INTERVAL_LABELS[p] ?? p,
    }));
  });
}
