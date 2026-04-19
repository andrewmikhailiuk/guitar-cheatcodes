import { Component, computed, input, output } from '@angular/core';
import { FretNote, NoteRole } from '../../core/models/note.model';
import { FRET_MARKERS, DOUBLE_DOT_FRETS } from '../../core/data/notes.data';

@Component({
  selector: 'app-fretboard',
  templateUrl: './fretboard.html',
  styleUrl: './fretboard.css',
})
export class FretboardComponent {
  readonly fretboard = input.required<FretNote[][]>();
  readonly stringLabels = input.required<string[]>();
  readonly totalFrets = input(24);
  readonly showDegrees = input(false);

  readonly noteClicked = output<FretNote>();

  readonly displayFretboard = computed(() =>
    [...this.fretboard()].reverse(),
  );

  readonly displayStringLabels = computed(() =>
    [...this.stringLabels()].reverse(),
  );

  readonly fretRange = computed(() =>
    Array.from({ length: this.totalFrets() + 1 }, (_, i) => i),
  );

  readonly gridColumns = computed(
    () => `40px repeat(${this.totalFrets() + 1}, minmax(28px, 1fr))`,
  );

  isMarkerFret(fret: number): boolean {
    return FRET_MARKERS.includes(fret);
  }

  isDoubleDot(fret: number): boolean {
    return DOUBLE_DOT_FRETS.includes(fret);
  }

  noteColor(role: NoteRole): string {
    switch (role) {
      case 'root':
        return 'var(--color-note-root)';
      case 'scale':
        return 'var(--color-note-scale)';
      case 'neutral':
        return 'var(--color-note-neutral)';
      case 'outOfBox':
        return 'var(--color-note-out-of-box)';
      case 'nonScale':
      default:
        return 'var(--color-note-non-scale)';
    }
  }

  noteTextColor(role: NoteRole): string {
    switch (role) {
      case 'root':
        return '#fff';
      case 'scale':
      case 'neutral':
        return '#ddd';
      case 'outOfBox':
        return '#444';
      case 'nonScale':
      default:
        return '#555';
    }
  }

  onNoteClick(note: FretNote): void {
    this.noteClicked.emit(note);
  }
}
