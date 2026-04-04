import { Component, computed, inject, signal } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { FretboardComponent } from '../../shared/fretboard/fretboard';
import { NoteService } from '../../core/services/note.service';
import { AudioService } from '../../core/services/audio.service';
import { TUNINGS } from '../../core/data/tunings.data';
import { FretNote } from '../../core/models/note.model';

@Component({
  selector: 'app-tunings',
  imports: [FretboardComponent, TranslocoModule],
  templateUrl: './tunings.html',
})
export class TuningsComponent {
  private readonly noteService = inject(NoteService);
  private readonly audioService = inject(AudioService);

  readonly tunings = TUNINGS;
  readonly selectedTuningId = signal('e-standard');

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
    this.selectedTuningId.set((event.target as HTMLSelectElement).value);
  }

  onNoteClick(note: FretNote): void {
    this.audioService.playNote(note.frequency);
  }
}
