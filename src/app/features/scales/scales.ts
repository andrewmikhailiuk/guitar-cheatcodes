import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { FretboardComponent } from '../../shared/fretboard/fretboard';
import { NoteService } from '../../core/services/note.service';
import { AudioService } from '../../core/services/audio.service';
import { StorageService } from '../../core/services/storage.service';
import { SCALES } from '../../core/data/scales.data';
import { CHROMATIC_NOTES } from '../../core/data/notes.data';
import { ModeName } from '../../core/models/scale.model';
import { FretNote, NoteName } from '../../core/models/note.model';

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

  readonly selectedMode = signal<ModeName>('phrygian');
  readonly selectedRoot = signal<NoteName>('E');

  ngOnInit(): void {
    this.selectedMode.set(this.storage.get<ModeName>('selectedMode', 'phrygian'));
    this.selectedRoot.set(this.storage.get<NoteName>('selectedRoot', 'E'));
  }

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
    const mode = (event.target as HTMLSelectElement).value as ModeName;
    this.selectedMode.set(mode);
    this.storage.set('selectedMode', mode);
  }

  onRootChange(event: Event): void {
    const root = (event.target as HTMLSelectElement).value as NoteName;
    this.selectedRoot.set(root);
    this.storage.set('selectedRoot', root);
  }

  onNoteClick(note: FretNote): void {
    this.audioService.playNote(note.frequency);
  }
}
