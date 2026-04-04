import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { FretboardComponent } from '../../shared/fretboard/fretboard';
import { NoteService } from '../../core/services/note.service';
import { AudioService } from '../../core/services/audio.service';
import { StorageService } from '../../core/services/storage.service';
import { SCALES } from '../../core/data/scales.data';
import { CHROMATIC_NOTES, E_STANDARD_MIDI, TOTAL_FRETS } from '../../core/data/notes.data';
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
  readonly boxOptions = [0, 1, 2, 3, 4, 5, 6, 7];

  readonly selectedMode = signal<ModeName>('phrygian');
  readonly selectedRoot = signal<NoteName>('E');
  readonly selectedBox = signal(0);

  ngOnInit(): void {
    this.selectedMode.set(this.storage.get<ModeName>('selectedMode', 'phrygian'));
    this.selectedRoot.set(this.storage.get<NoteName>('selectedRoot', 'E'));
    this.selectedBox.set(this.storage.get<number>('selectedBox', 0));
  }

  readonly currentScale = computed(() =>
    SCALES.find((s) => s.name === this.selectedMode())!,
  );

  private readonly baseFretboard = computed(() =>
    this.noteService.buildFretboard(
      6,
      [0, 0, 0, 0, 0, 0],
      this.selectedRoot(),
      this.currentScale().intervals,
    ),
  );

  readonly fretboard = computed(() => {
    const box = this.selectedBox();
    const fb = this.baseFretboard();
    if (box === 0) return fb;

    const boxNotes = this.noteService.computeBox(
      this.currentScale().intervals,
      noteNameToIndex(this.selectedRoot()),
      box - 1,
      E_STANDARD_MIDI,
      TOTAL_FRETS,
    );
    return this.noteService.applyBoxFilter(fb, boxNotes);
  });

  readonly stringLabels = ['E', 'A', 'D', 'G', 'B', 'E'];

  onModeChange(event: Event): void {
    const mode = (event.target as HTMLSelectElement).value as ModeName;
    this.selectedMode.set(mode);
    this.storage.set('selectedMode', mode);
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

  onNoteClick(note: FretNote): void {
    this.audioService.playNote(note.frequency);
  }
}
