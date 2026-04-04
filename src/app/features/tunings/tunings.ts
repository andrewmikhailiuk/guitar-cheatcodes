import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { FretboardComponent } from '../../shared/fretboard/fretboard';
import { NoteService } from '../../core/services/note.service';
import { AudioService } from '../../core/services/audio.service';
import { StorageService } from '../../core/services/storage.service';
import { TUNINGS } from '../../core/data/tunings.data';
import { FretNote } from '../../core/models/note.model';

@Component({
  selector: 'app-tunings',
  imports: [FretboardComponent, TranslocoModule],
  templateUrl: './tunings.html',
})
export class TuningsComponent implements OnInit {
  private readonly noteService = inject(NoteService);
  private readonly audioService = inject(AudioService);
  private readonly storage = inject(StorageService);

  readonly tunings = TUNINGS;
  readonly selectedTuningId = signal('e-standard');

  ngOnInit(): void {
    this.selectedTuningId.set(this.storage.get('selectedTuning', 'e-standard'));
  }

  readonly currentTuning = computed(() =>
    TUNINGS.find((t) => t.id === this.selectedTuningId())!,
  );

  readonly fretboard = computed(() => {
    const tuning = this.currentTuning();
    return this.noteService.buildFretboard(
      tuning.stringCount,
      tuning.offsets,
    );
  });

  readonly stringLabels = computed(() =>
    this.currentTuning().openStrings as string[],
  );

  onTuningChange(event: Event): void {
    const id = (event.target as HTMLSelectElement).value;
    this.selectedTuningId.set(id);
    this.storage.set('selectedTuning', id);
  }

  onNoteClick(note: FretNote): void {
    this.audioService.playNote(note.frequency);
  }
}
