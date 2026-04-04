import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { FretboardComponent } from '../../shared/fretboard/fretboard';
import { NoteService } from '../../core/services/note.service';
import { AudioService } from '../../core/services/audio.service';
import { StorageService } from '../../core/services/storage.service';
import { SCALES } from '../../core/data/scales.data';
import { TUNINGS } from '../../core/data/tunings.data';
import {
  CHROMATIC_NOTES,
  E_STANDARD_MIDI,
  E_STANDARD_7_MIDI,
  TOTAL_FRETS,
} from '../../core/data/notes.data';
import { ModeName } from '../../core/models/scale.model';
import { FretNote, NoteName } from '../../core/models/note.model';
import { noteNameToIndex } from '../../core/utils/music.utils';

@Component({
  selector: 'app-scales',
  imports: [FretboardComponent, TranslocoModule],
  templateUrl: './scales.html',
})
export class ScalesComponent implements OnInit {
  private readonly noteService = inject(NoteService);
  private readonly audioService = inject(AudioService);
  private readonly storage = inject(StorageService);

  readonly scales = SCALES;
  readonly roots = CHROMATIC_NOTES;
  readonly tunings = TUNINGS;
  readonly boxOptions = [0, 1, 2, 3, 4, 5];

  readonly selectedMode = signal<ModeName>('phrygian');
  readonly selectedRoot = signal<NoteName>('E');
  readonly selectedBox = signal(0);
  readonly selectedTuningId = signal('e-standard');

  ngOnInit(): void {
    this.selectedMode.set(this.storage.get<ModeName>('selectedMode', 'phrygian'));
    this.selectedRoot.set(this.storage.get<NoteName>('selectedRoot', 'E'));
    this.selectedBox.set(this.storage.get<number>('selectedBox', 0));
    this.selectedTuningId.set(this.storage.get('scaleTuning', 'e-standard'));
  }

  readonly currentScale = computed(() =>
    SCALES.find((s) => s.name === this.selectedMode())!,
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
      this.currentScale().intervals,
    );
  });

  readonly fretboard = computed(() => {
    const box = this.selectedBox();
    const fb = this.baseFretboard();
    if (box === 0) return fb;

    const tuning = this.currentTuning();
    const baseMidi = tuning.stringCount === 7
      ? E_STANDARD_7_MIDI
      : E_STANDARD_MIDI;
    const openMidis = baseMidi.map((m, i) => m + tuning.offsets[i]);

    const boxNotes = this.noteService.computeBox(
      this.currentScale().intervals,
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

  onModeChange(event: Event): void {
    const mode = (event.target as HTMLSelectElement).value as ModeName;
    this.selectedMode.set(mode);
    this.storage.set('selectedMode', mode);

    const scale = SCALES.find((s) => s.name === mode)!;
    this.selectedRoot.set(scale.defaultRoot as NoteName);
    this.storage.set('selectedRoot', scale.defaultRoot);
  }

  onRootChange(event: Event): void {
    const root = (event.target as HTMLSelectElement).value as NoteName;
    this.selectedRoot.set(root);
    this.storage.set('selectedRoot', root);
  }

  onBoxChange(event: Event): void {
    const box = parseInt((event.target as HTMLSelectElement).value, 10);
    this.selectedBox.set(box);
    this.storage.set('selectedBox', box);
  }

  onTuningChange(event: Event): void {
    const id = (event.target as HTMLSelectElement).value;
    this.selectedTuningId.set(id);
    this.storage.set('scaleTuning', id);
  }

  resetFilters(): void {
    const scale = this.currentScale();
    this.selectedRoot.set(scale.defaultRoot as NoteName);
    this.selectedBox.set(0);
    this.selectedTuningId.set('e-standard');
    this.storage.set('selectedRoot', scale.defaultRoot);
    this.storage.set('selectedBox', 0);
    this.storage.set('scaleTuning', 'e-standard');
  }

  onNoteClick(note: FretNote): void {
    this.audioService.playNote(note.frequency);
  }
}
