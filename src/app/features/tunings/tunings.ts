import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { FretboardComponent } from '../../shared/fretboard/fretboard';
import { NoteService } from '../../core/services/note.service';
import { AudioService } from '../../core/services/audio.service';
import { StorageService } from '../../core/services/storage.service';
import { TUNINGS } from '../../core/data/tunings.data';
import { FretNote } from '../../core/models/note.model';
import { TuningCategory } from '../../core/models/tuning.model';

const CATEGORIES: { id: TuningCategory; labelKey: string }[] = [
  { id: 'standard', labelKey: 'tunings.standard' },
  { id: 'drop', labelKey: 'tunings.drop' },
  { id: 'open', labelKey: 'tunings.open' },
];

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

  readonly categories = CATEGORIES;
  readonly allTunings = TUNINGS;

  readonly selectedCategory = signal<TuningCategory>(this.resolveInitCategory());
  readonly selectedTuningId = signal(this.resolveInitTuning());

  private resolveInitCategory(): TuningCategory {
    const q = this.route.snapshot.queryParamMap.get('c');
    if (q && CATEGORIES.some((c) => c.id === q)) return q as TuningCategory;
    return this.storage.get<TuningCategory>('tuningCategory', 'standard');
  }

  private resolveInitTuning(): string {
    const q = this.route.snapshot.queryParamMap.get('t');
    if (q && TUNINGS.some((t) => t.id === q)) return q;
    return this.storage.get('selectedTuning', 'e-standard');
  }

  readonly filteredTunings = computed(() =>
    TUNINGS.filter((t) => t.category === this.selectedCategory()),
  );

  readonly currentTuning = computed(() => {
    const id = this.selectedTuningId();
    return TUNINGS.find((t) => t.id === id) ?? this.filteredTunings()[0] ?? TUNINGS[0];
  });

  readonly maxSemitonesDown = computed(() =>
    Math.abs(Math.min(...this.currentTuning().offsets)),
  );

  readonly isReference = computed(() =>
    this.maxSemitonesDown() === 0,
  );

  readonly fretboard = computed(() => {
    const tuning = this.currentTuning();
    return this.noteService.buildFretboard(tuning.stringCount, tuning.offsets);
  });

  readonly stringLabels = computed(() =>
    this.currentTuning().openStrings as string[],
  );

  selectCategory(cat: TuningCategory): void {
    this.selectedCategory.set(cat);
    this.storage.set('tuningCategory', cat);
    // Auto-select first tuning in new category if current is not in it
    const current = this.currentTuning();
    if (current.category !== cat) {
      const first = TUNINGS.find((t) => t.category === cat);
      if (first) {
        this.selectedTuningId.set(first.id);
        this.storage.set('selectedTuning', first.id);
      }
    }
    this.syncUrl();
  }

  onTuningChange(event: Event): void {
    const id = (event.target as HTMLSelectElement).value;
    this.selectedTuningId.set(id);
    this.storage.set('selectedTuning', id);
    this.syncUrl();
  }

  private syncUrl(): void {
    const params: Record<string, string> = {};
    const cat = this.selectedCategory();
    const tuning = this.selectedTuningId();
    if (cat !== 'standard') params['c'] = cat;
    if (tuning !== 'e-standard') params['t'] = tuning;
    this.router.navigate([], { queryParams: params, replaceUrl: true });
  }

  onNoteClick(note: FretNote): void {
    this.audioService.playNote(note.frequency);
  }
}
