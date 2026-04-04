import { Component, computed, input } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { NoteName } from '../../core/models/note.model';
import { getIntervalFormula, getScaleNotes } from '../../core/utils/music.utils';

@Component({
  selector: 'app-cheat-sheet',
  imports: [TranslocoModule],
  template: `
    <div class="mt-4 p-3 bg-bg-fretboard rounded border border-fret-line text-sm space-y-1">
      <div class="flex flex-wrap gap-x-6 gap-y-1">
        <span class="text-gray-400">{{ 'cheat.notes' | transloco }}:</span>
        <span class="font-mono tracking-wide">{{ notes() }}</span>
      </div>
      <div class="flex flex-wrap gap-x-6 gap-y-1">
        <span class="text-gray-400">{{ 'cheat.formula' | transloco }}:</span>
        <span class="font-mono tracking-wide">{{ formula() }}</span>
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

  readonly formula = computed(() =>
    getIntervalFormula(this.intervals()),
  );
}
