import { Component, computed, inject, signal } from '@angular/core';
import { FretboardComponent } from '../../shared/fretboard/fretboard';
import { NoteService } from '../../core/services/note.service';
import { AudioService } from '../../core/services/audio.service';
import { SCALES } from '../../core/data/scales.data';
import { CHROMATIC_NOTES } from '../../core/data/notes.data';
import { ModeName } from '../../core/models/scale.model';
import { FretNote, NoteName } from '../../core/models/note.model';

@Component({
  selector: 'app-scales',
  imports: [FretboardComponent],
  templateUrl: './scales.html',
})
export class ScalesComponent {
  private readonly noteService = inject(NoteService);
  private readonly audioService = inject(AudioService);

  readonly scales = SCALES;
  readonly roots = CHROMATIC_NOTES;

  readonly selectedMode = signal<ModeName>('phrygian');
  readonly selectedRoot = signal<NoteName>('E');

  readonly currentScale = computed(() =>
    SCALES.find((s) => s.name === this.selectedMode())!,
  );

  readonly fretboard = computed(() =>
    this.noteService.buildFretboard(
      6,
      [0, 0, 0, 0, 0, 0],
      this.selectedRoot(),
      this.currentScale().intervals,
    ),
  );

  readonly stringLabels = ['E', 'A', 'D', 'G', 'B', 'E'];

  onModeChange(event: Event): void {
    this.selectedMode.set((event.target as HTMLSelectElement).value as ModeName);
  }

  onRootChange(event: Event): void {
    this.selectedRoot.set((event.target as HTMLSelectElement).value as NoteName);
  }

  onNoteClick(note: FretNote): void {
    this.audioService.playNote(note.frequency);
  }
}
