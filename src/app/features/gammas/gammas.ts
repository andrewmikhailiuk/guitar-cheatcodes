import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { FretboardComponent } from '../../shared/fretboard/fretboard';
import { CheatSheetComponent } from '../../shared/cheat-sheet/cheat-sheet';
import { NoteService } from '../../core/services/note.service';
import { AudioService } from '../../core/services/audio.service';
import { StorageService } from '../../core/services/storage.service';
import { GAMMAS } from '../../core/data/gammas.data';
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
  selector: 'app-gammas',
  imports: [FretboardComponent, CheatSheetComponent, TranslocoModule],
  templateUrl: './gammas.html',
})
export class GammasComponent {
  private readonly noteService = inject(NoteService);
  private readonly audioService = inject(AudioService);
  private readonly storage = inject(StorageService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly gammas = GAMMAS;
  readonly roots = CHROMATIC_NOTES;
  readonly tunings = TUNINGS;
  readonly boxOptions = [0, 1, 2, 3, 4, 5];

  private readonly initGamma = this.resolveInitGamma();
  readonly selectedGamma = signal(this.initGamma);
  readonly selectedRoot = signal<NoteName>(this.resolveInitRoot());
  readonly selectedBox = signal(this.resolveInitBox());
  readonly selectedTuningId = signal(this.resolveInitTuning());

  private resolveInitGamma(): string {
    const q = this.route.snapshot.queryParamMap.get('g');
    if (q && GAMMAS.some((g) => g.name === q)) return q;
    return this.storage.get<string>('selectedGamma', 'phrygian');
  }

  private resolveInitRoot(): NoteName {
    const q = this.route.snapshot.queryParamMap.get('r');
    if (q && (CHROMATIC_NOTES as readonly string[]).includes(q)) return q as NoteName;
    return (GAMMAS.find((g) => g.name === this.initGamma)?.defaultRoot ?? 'E') as NoteName;
  }

  private resolveInitBox(): number {
    const q = this.route.snapshot.queryParamMap.get('b');
    if (q !== null) {
      const n = parseInt(q, 10);
      if (n >= 0 && n <= 5) return n;
    }
    return this.storage.get<number>('gammaBox', 0);
  }

  private resolveInitTuning(): string {
    const q = this.route.snapshot.queryParamMap.get('t');
    if (q && TUNINGS.some((t) => t.id === q)) return q;
    return this.storage.get('gammaTuning', 'e-standard');
  }

  readonly currentGamma = computed(() =>
    GAMMAS.find((g) => g.name === this.selectedGamma()) ?? GAMMAS[0],
  );

  readonly currentTuning = computed(() =>
    TUNINGS.find((t) => t.id === this.selectedTuningId()) ?? TUNINGS[0],
  );

  private readonly baseFretboard = computed(() => {
    const tuning = this.currentTuning();
    return this.noteService.buildFretboard(
      tuning.stringCount,
      tuning.offsets,
      this.selectedRoot(),
      this.currentGamma().intervals,
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
      this.currentGamma().intervals,
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

  onGammaChange(event: Event): void {
    const name = (event.target as HTMLSelectElement).value;
    this.selectedGamma.set(name);
    this.storage.set('selectedGamma', name);

    const gamma = GAMMAS.find((g) => g.name === name) ?? GAMMAS[0];
    this.selectedRoot.set(gamma.defaultRoot as NoteName);
    this.syncUrl();
  }

  onRootChange(event: Event): void {
    const root = (event.target as HTMLSelectElement).value as NoteName;
    this.selectedRoot.set(root);
    this.syncUrl();
  }

  onBoxChange(event: Event): void {
    const box = parseInt((event.target as HTMLSelectElement).value, 10);
    this.selectedBox.set(box);
    this.storage.set('gammaBox', box);
    this.syncUrl();
  }

  onTuningChange(event: Event): void {
    const id = (event.target as HTMLSelectElement).value;
    this.selectedTuningId.set(id);
    this.storage.set('gammaTuning', id);
    this.syncUrl();
  }

  resetFilters(): void {
    const gamma = this.currentGamma();
    this.selectedRoot.set(gamma.defaultRoot as NoteName);
    this.selectedBox.set(0);
    this.selectedTuningId.set('e-standard');
    this.storage.set('gammaBox', 0);
    this.storage.set('gammaTuning', 'e-standard');
    this.syncUrl();
  }

  private syncUrl(): void {
    const params: Record<string, string> = {};
    const gamma = this.selectedGamma();
    const root = this.selectedRoot();
    const box = this.selectedBox();
    const tuning = this.selectedTuningId();

    if (gamma !== 'phrygian') params['g'] = gamma;
    if (root !== (GAMMAS.find((g) => g.name === gamma)?.defaultRoot ?? 'E')) params['r'] = root;
    if (box !== 0) params['b'] = String(box);
    if (tuning !== 'e-standard') params['t'] = tuning;

    this.router.navigate([], { queryParams: params, replaceUrl: true });
  }

  onNoteClick(note: FretNote): void {
    this.audioService.playNote(note.frequency);
  }
}
