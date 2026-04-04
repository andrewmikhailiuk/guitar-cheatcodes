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
  '1': 'тоника', 'b2': 'малая секунда', '2': 'большая секунда',
  'b3': 'малая терция', '3': 'большая терция', '4': 'кварта',
  'b5': 'тритон', '5': 'квинта', 'b6': 'малая секста',
  '6': 'большая секста', 'b7': 'малая септима', '7': 'большая септима',
};

@Component({
  selector: 'app-cheat-sheet',
  imports: [TranslocoModule],
  template: `
    <div class="mt-4 p-3 bg-bg-fretboard rounded border border-fret-line text-sm space-y-2">
      <div class="flex flex-wrap gap-x-6 gap-y-1">
        <span class="text-gray-400">{{ 'cheat.notes' | transloco }}:</span>
        <span class="font-mono tracking-wide">{{ notes() }}</span>
      </div>
      <div class="flex flex-wrap gap-x-6 gap-y-1">
        <span class="text-gray-400">{{ 'cheat.solfege' | transloco }}:</span>
        <span class="tracking-wide">{{ solfege() }}</span>
      </div>
      <div class="flex flex-wrap gap-x-6 gap-y-1">
        <span class="text-gray-400">{{ 'cheat.formula' | transloco }}:</span>
        <span class="font-mono tracking-wide">{{ formula() }}</span>
      </div>
      <div class="flex flex-wrap gap-x-6 gap-y-1 text-xs text-gray-500">
        <span class="text-gray-400">{{ 'cheat.intervals' | transloco }}:</span>
        <span>{{ intervalNames() }}</span>
      </div>
      @if (characterKey()) {
        <div class="flex flex-wrap gap-x-6 gap-y-1">
          <span class="text-gray-400">{{ 'cheat.character' | transloco }}:</span>
          <span class="italic">{{ characterKey()! | transloco }}</span>
        </div>
      }
    </div>
  `,
})
export class CheatSheetComponent {
  readonly rootName = input.required<NoteName>();
  readonly intervals = input.required<number[]>();
  readonly characterKey = input<string | undefined>();

  readonly notes = computed(() =>
    getScaleNotes(this.rootName(), this.intervals()),
  );

  readonly solfege = computed(() => {
    const noteNames = getScaleNotes(this.rootName(), this.intervals()).split(' ');
    return noteNames.map((n) => SOLFEGE[n] ?? n).join('  ');
  });

  readonly formula = computed(() =>
    getIntervalFormula(this.intervals()),
  );

  readonly intervalNames = computed(() => {
    const parts = getIntervalFormula(this.intervals()).split(' ');
    return parts.map((p) => `${p} = ${INTERVAL_LABELS[p] ?? p}`).join(', ');
  });
}
