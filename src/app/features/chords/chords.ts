import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { StorageService } from '../../core/services/storage.service';
import { CHROMATIC_NOTES } from '../../core/data/notes.data';
import { CHORD_QUALITIES, CHORD_SHAPES } from '../../core/data/chords.data';
import { NoteName } from '../../core/models/note.model';
import { getScaleNotes, getIntervalFormula } from '../../core/utils/music.utils';
import { ChordDiagramComponent } from '../../shared/chord-diagram/chord-diagram';

@Component({
  selector: 'app-chords',
  imports: [TranslocoModule, ChordDiagramComponent],
  template: `
    <div class="p-4">
      <div class="flex flex-wrap gap-4 mb-4 items-center">
        <div>
          <label class="block text-xs text-gray-400 mb-1">{{ 'chords.root' | transloco }}</label>
          <select
            class="bg-bg-fretboard text-text-primary border border-fret-line rounded px-3 py-2 text-sm"
            (change)="onRootChange($event)"
          >
            @for (root of roots; track root) {
              <option [value]="root" [selected]="root === selectedRoot()">{{ root }}</option>
            }
          </select>
        </div>

        <div>
          <label class="block text-xs text-gray-400 mb-1">{{ 'chords.quality' | transloco }}</label>
          <select
            class="bg-bg-fretboard text-text-primary border border-fret-line rounded px-3 py-2 text-sm"
            (change)="onQualityChange($event)"
          >
            @for (q of qualities; track q.id) {
              <option [value]="q.id" [selected]="q.id === selectedQualityId()">
                {{ q.labelKey | transloco }}
              </option>
            }
          </select>
        </div>

      </div>

      @if (currentVoicing(); as voicing) {
        <div class="flex justify-center">
          <app-chord-diagram
            [voicing]="voicing"
            [chordName]="chordName()"
            [stringCount]="6"
            [rootNote]="selectedRoot()"
            [openStrings]="openStrings"
          />
        </div>

        @if (availableVoicings().length > 1) {
          <div class="flex gap-2 mt-3 justify-center">
            @for (v of availableVoicings(); track $index) {
              <button
                class="px-3 py-1 text-sm border rounded transition-colors"
                [class]="$index === selectedVoicingIndex()
                  ? 'border-note-root text-note-root'
                  : 'border-fret-line text-gray-400 hover:text-white'"
                (click)="selectedVoicingIndex.set($index)"
              >
                {{ $index + 1 }}
              </button>
            }
          </div>
        }
      } @else {
        <p class="text-gray-400 text-sm text-center mt-8">{{ 'chords.noVoicing' | transloco }}</p>
      }

      <!-- Cheat sheet -->
      <div class="mt-6 space-y-4 px-0">
        <!-- How to read the diagram -->
        <div>
          <div class="text-xs font-bold text-text-primary mb-2">{{ 'chords.howToRead' | transloco }}</div>
          <p class="text-xs text-gray-400 leading-relaxed mb-3">{{ 'chords.howToReadDesc' | transloco }}</p>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            @for (item of diagramLegend; track item.symbolKey) {
              <div class="flex items-start gap-2.5 px-2 py-1.5 rounded text-xs bg-fret-line/10">
                <span class="font-mono font-bold text-text-primary w-5 shrink-0 mt-0.5">{{ item.symbolKey | transloco }}</span>
                <span class="text-gray-400">{{ item.descKey | transloco }}</span>
              </div>
            }
          </div>
        </div>

        <!-- Notes & formula breakdown -->
        <div class="space-y-2">
          <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
            <span class="text-gray-400">{{ 'chords.notes' | transloco }}:</span>
            <span class="font-mono text-sm">
              @for (note of chordNoteList(); track note; let i = $index) {
                <span [class]="i === 0 ? 'text-note-root font-bold' : 'text-text-primary'">{{ note }}</span>
                @if (i < chordNoteList().length - 1) {
                  <span class="text-fret-line mx-0.5">·</span>
                }
              }
            </span>
            <span class="text-fret-line">|</span>
            <span class="text-gray-400">{{ 'chords.formula' | transloco }}:</span>
            <span class="font-mono text-sm text-text-primary">{{ chordFormula() }}</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            @for (item of formulaBreakdown(); track item.symbol) {
              <div class="flex items-center gap-2 px-2 py-1 rounded text-xs bg-fret-line/10">
                <span class="font-mono font-bold w-5 shrink-0"
                  [class]="item.symbol === '1' ? 'text-note-root' : 'text-text-primary'"
                >{{ item.symbol }}</span>
                <span class="text-gray-400">{{ item.note }}</span>
                <span class="text-fret-line">—</span>
                <span class="text-gray-400">{{ item.descKey | transloco }}</span>
              </div>
            }
          </div>
        </div>

        <!-- Chord types reference -->
        <div>
          <div class="text-xs font-bold text-text-primary mb-2">{{ 'chords.typesRef' | transloco }}</div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            @for (q of qualities; track q.id) {
              <div
                class="flex items-start gap-2.5 px-2 py-1.5 rounded text-xs transition-all duration-200"
                [class]="q.id === selectedQualityId()
                  ? 'bg-note-root/20 text-note-root'
                  : 'bg-fret-line/10 text-gray-400'"
              >
                <span class="font-mono font-bold text-text-primary w-10 shrink-0">@if (q.symbol) { {{ q.symbol }} } @else { {{ q.labelKey | transloco }} }</span>
                <span>{{ 'chordDesc.' + q.id | transloco }}</span>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ChordsComponent {
  private readonly storage = inject(StorageService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly roots = CHROMATIC_NOTES;
  readonly qualities = CHORD_QUALITIES;
  readonly openStrings: NoteName[] = ['E', 'A', 'D', 'G', 'B', 'E'];

  readonly selectedRoot = signal<NoteName>(this.resolveInitRoot());
  readonly selectedQualityId = signal(this.resolveInitQuality());
  readonly selectedVoicingIndex = signal(0);

  private resolveInitRoot(): NoteName {
    const q = this.route.snapshot.queryParamMap.get('r');
    if (q && (CHROMATIC_NOTES as readonly string[]).includes(q)) return q as NoteName;
    return this.storage.get<NoteName>('chordRoot', 'C');
  }

  private resolveInitQuality(): string {
    const q = this.route.snapshot.queryParamMap.get('q');
    if (q && CHORD_QUALITIES.some((cq) => cq.id === q)) return q;
    return this.storage.get('chordQuality', 'major');
  }

  readonly currentQuality = computed(() =>
    CHORD_QUALITIES.find((q) => q.id === this.selectedQualityId()) ?? CHORD_QUALITIES[0],
  );

  readonly chordName = computed(() =>
    this.selectedRoot() + this.currentQuality().symbol,
  );

  readonly availableVoicings = computed(() => {
    const shape = CHORD_SHAPES.find(
      (s) =>
        s.root === this.selectedRoot() &&
        s.qualityId === this.selectedQualityId() &&
        s.tuningId === 'e-standard',
    );
    return shape?.voicings ?? [];
  });

  readonly currentVoicing = computed(() =>
    this.availableVoicings()[this.selectedVoicingIndex()] ?? null,
  );

  readonly chordNoteList = computed(() =>
    getScaleNotes(this.selectedRoot(), this.currentQuality().intervals).split(' '),
  );

  readonly chordFormula = computed(() =>
    getIntervalFormula(this.currentQuality().intervals),
  );

  readonly formulaBreakdown = computed(() => {
    const quality = this.currentQuality();
    const notes = this.chordNoteList();
    const symbols = this.chordFormula().split(' ');
    return symbols.map((symbol, i) => ({
      symbol,
      note: notes[i],
      descKey: 'intRef.' + symbol,
    }));
  });

  readonly diagramLegend = [
    { symbolKey: 'chords.symX',     descKey: 'chords.descX' },
    { symbolKey: 'chords.symO',     descKey: 'chords.descO' },
    { symbolKey: 'chords.symR',     descKey: 'chords.descR' },
    { symbolKey: 'chords.symDot',   descKey: 'chords.descDot' },
    { symbolKey: 'chords.symBarre', descKey: 'chords.descBarre' },
  ];

  onRootChange(event: Event): void {
    const root = (event.target as HTMLSelectElement).value as NoteName;
    this.selectedRoot.set(root);
    this.storage.set('chordRoot', root);
    this.selectedVoicingIndex.set(0);
    this.syncUrl();
  }

  onQualityChange(event: Event): void {
    const id = (event.target as HTMLSelectElement).value;
    this.selectedQualityId.set(id);
    this.storage.set('chordQuality', id);
    this.selectedVoicingIndex.set(0);
    this.syncUrl();
  }

  private syncUrl(): void {
    const params: Record<string, string> = {};
    const root = this.selectedRoot();
    const quality = this.selectedQualityId();

    if (root !== 'C') params['r'] = root;
    if (quality !== 'major') params['q'] = quality;

    this.router.navigate([], { queryParams: params, replaceUrl: true });
  }
}
