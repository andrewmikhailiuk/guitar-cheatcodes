import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
export class TuningsComponent {
  private readonly noteService = inject(NoteService);
  private readonly audioService = inject(AudioService);
  private readonly storage = inject(StorageService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly tunings = TUNINGS;
  readonly selectedTuningId = signal(this.resolveInitTuning());

  private resolveInitTuning(): string {
    const q = this.route.snapshot.queryParamMap.get('t');
    if (q && TUNINGS.some((t) => t.id === q)) return q;
    return this.storage.get('selectedTuning', 'e-standard');
  }

  readonly currentTuning = computed(() =>
    TUNINGS.find((t) => t.id === this.selectedTuningId()) ?? TUNINGS[0],
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
    this.syncUrl();
  }

  private syncUrl(): void {
    const params: Record<string, string> = {};
    const tuning = this.selectedTuningId();
    if (tuning !== 'e-standard') params['t'] = tuning;
    this.router.navigate([], { queryParams: params, replaceUrl: true });
  }

  onNoteClick(note: FretNote): void {
    this.audioService.playNote(note.frequency);
  }
}
