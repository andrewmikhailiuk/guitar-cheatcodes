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
    <div class="mt-3 px-1 text-xs text-gray-400 flex flex-wrap gap-x-4 gap-y-1">
      <span>
        <span class="text-gray-500">{{ 'cheat.notes' | transloco }}:</span>
        <span class="font-mono text-text-primary ml-1">{{ notes() }}</span>
      </span>
      <span>
        <span class="text-gray-500">{{ 'cheat.formula' | transloco }}:</span>
        <span class="font-mono text-text-primary ml-1">{{ formulaWithNames() }}</span>
      </span>
      @if (characterKey()) {
        <span class="italic">{{ characterKey()! | transloco }}</span>
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

  readonly formulaWithNames = computed(() => {
    const parts = getIntervalFormula(this.intervals()).split(' ');
    return parts.map((p) => `${p}(${INTERVAL_LABELS[p] ?? p})`).join('  ');
  });
}
