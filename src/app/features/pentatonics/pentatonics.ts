import { Component, computed, inject, signal } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { FretboardComponent } from '../../shared/fretboard/fretboard';
import { CheatSheetComponent } from '../../shared/cheat-sheet/cheat-sheet';
import { NoteService } from '../../core/services/note.service';
import { AudioService } from '../../core/services/audio.service';
import { StorageService } from '../../core/services/storage.service';
import { PENTATONICS } from '../../core/data/pentatonics.data';
import { TUNINGS } from '../../core/data/tunings.data';
import {
  CHROMATIC_NOTES,
  E_STANDARD_MIDI,
  E_STANDARD_7_MIDI,
  TOTAL_FRETS,
} from '../../core/data/notes.data';
import { FretNote, NoteName } from '../../core/models/note.model';
import { noteNameToIndex } from '../../core/utils/music.utils';

@Component({
  selector: 'app-pentatonics',
  imports: [FretboardComponent, CheatSheetComponent, TranslocoModule],
  templateUrl: './pentatonics.html',
})
export class PentatonicsComponent {
  private readonly noteService = inject(NoteService);
  private readonly audioService = inject(AudioService);
  private readonly storage = inject(StorageService);

  readonly pentatonics = PENTATONICS;
  readonly roots = CHROMATIC_NOTES;
  readonly tunings = TUNINGS;
  readonly boxOptions = [0, 1, 2, 3, 4, 5];

  private readonly initPenta = this.storage.get<string>('selectedPenta', 'minorPentatonic');

  readonly selectedPenta = signal(this.initPenta);
  readonly selectedRoot = signal<NoteName>(
    (PENTATONICS.find((p) => p.name === this.initPenta)?.defaultRoot ?? 'A') as NoteName,
  );
  readonly selectedBox = signal(this.storage.get<number>('pentaBox', 0));
  readonly selectedTuningId = signal(this.storage.get('pentaTuning', 'e-standard'));
  readonly showTritones = signal(true);

  readonly currentPenta = computed(() =>
    PENTATONICS.find((p) => p.name === this.selectedPenta())!,
  );

  readonly currentTuning = computed(() =>
    TUNINGS.find((t) => t.id === this.selectedTuningId())!,
  );

  private readonly baseFretboard = computed(() => {
    const tuning = this.currentTuning();
    return this.noteService.buildFretboard(
      tuning.stringCount,
      tuning.offsets,
      this.selectedRoot(),
      this.currentPenta().intervals,
    );
  });

  readonly fretboard = computed(() => {
    const box = this.selectedBox();
    const fb = this.baseFretboard();
    if (box === 0) return fb;

    const tuning = this.currentTuning();
    const baseMidi = tuning.stringCount === 7 ? E_STANDARD_7_MIDI : E_STANDARD_MIDI;
    const openMidis = baseMidi.map((m, i) => m + tuning.offsets[i]);

    const boxNotes = this.noteService.computeBox(
      this.currentPenta().intervals,
      noteNameToIndex(this.selectedRoot()),
      box,
      openMidis,
      TOTAL_FRETS,
    );
    return this.noteService.applyBoxFilter(fb, boxNotes);
  });

  readonly stringLabels = computed(() =>
    this.currentTuning().openStrings as string[],
  );

  onPentaChange(event: Event): void {
    const name = (event.target as HTMLSelectElement).value;
    this.selectedPenta.set(name);
    this.storage.set('selectedPenta', name);

    const penta = PENTATONICS.find((p) => p.name === name)!;
    this.selectedRoot.set(penta.defaultRoot as NoteName);
  }

  onRootChange(event: Event): void {
    this.selectedRoot.set((event.target as HTMLSelectElement).value as NoteName);
  }

  onBoxChange(event: Event): void {
    const box = parseInt((event.target as HTMLSelectElement).value, 10);
    this.selectedBox.set(box);
    this.storage.set('pentaBox', box);
  }

  onTuningChange(event: Event): void {
    const id = (event.target as HTMLSelectElement).value;
    this.selectedTuningId.set(id);
    this.storage.set('pentaTuning', id);
  }

  resetFilters(): void {
    const penta = this.currentPenta();
    this.selectedRoot.set(penta.defaultRoot as NoteName);
    this.selectedBox.set(0);
    this.selectedTuningId.set('e-standard');
    this.storage.set('pentaBox', 0);
    this.storage.set('pentaTuning', 'e-standard');
  }

  onNoteClick(note: FretNote): void {
    this.audioService.playNote(note.frequency);
  }
}
