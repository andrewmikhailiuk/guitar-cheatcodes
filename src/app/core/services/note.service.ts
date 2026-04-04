import { Injectable } from '@angular/core';
import { FretNote, NoteName, NoteRole } from '../models/note.model';
import {
  E_STANDARD_MIDI,
  E_STANDARD_7_MIDI,
  TOTAL_FRETS,
} from '../data/notes.data';
import {
  midiToFrequency,
  midiToNoteName,
  getNoteRole,
  noteNameToIndex,
} from '../utils/music.utils';

@Injectable({ providedIn: 'root' })
export class NoteService {
  buildFretboard(
    stringCount: number,
    offsets: number[],
    rootNote: NoteName | null = null,
    scaleIntervals: number[] | null = null,
  ): FretNote[][] {
    const baseMidi = stringCount === 7 ? E_STANDARD_7_MIDI : E_STANDARD_MIDI;
    const rootIndex = rootNote !== null ? noteNameToIndex(rootNote) : 0;
    const fretboard: FretNote[][] = [];

    for (let s = 0; s < stringCount; s++) {
      const stringNotes: FretNote[] = [];
      const openMidi = baseMidi[s] + offsets[s];

      for (let f = 0; f <= TOTAL_FRETS; f++) {
        const midi = openMidi + f;
        const name = midiToNoteName(midi);
        const noteIndex = ((midi % 12) + 12) % 12;
        const interval = ((noteIndex - rootIndex) % 12 + 12) % 12;

        const degreeIdx = scaleIntervals !== null
          ? scaleIntervals.indexOf(interval)
          : -1;

        stringNotes.push({
          name,
          midi,
          frequency: midiToFrequency(midi),
          interval,
          role: getNoteRole(interval, scaleIntervals),
          degree: degreeIdx >= 0 ? degreeIdx + 1 : null,
        });
      }

      fretboard.push(stringNotes);
    }

    return fretboard;
  }

  /**
   * Compute a positional box pattern.
   *
   * Algorithm:
   * - Box N starts from scale degree N on the lowest string
   * - Each string takes 2-3 ascending scale notes within 4 fret positions
   *   (index-middle-ring-pinky, max span = 3 frets)
   * - The next string continues from the next degree in sequence
   * - This keeps the hand in one position on the neck
   */
  computeBox(
    scaleIntervals: number[],
    rootIndex: number,
    boxNumber: number,
    openStringMidis: number[],
    totalFrets: number,
  ): Set<string> {
    const box = new Set<string>();

    // Build scale notes per string: { fret, degreeIndex }
    const strings = openStringMidis.map((openMidi) => {
      const notes: { fret: number; deg: number }[] = [];
      for (let f = 0; f <= totalFrets; f++) {
        const interval = (((openMidi + f) % 12) - rootIndex + 12) % 12;
        const deg = scaleIntervals.indexOf(interval);
        if (deg >= 0) {
          notes.push({ fret: f, deg });
        }
      }
      return notes;
    });

    // Find anchor: first occurrence of starting degree on lowest string
    let nextDeg = boxNumber - 1;
    const anchor = strings[0].find((n) => n.deg === nextDeg);
    if (!anchor) return box;

    let handPos = anchor.fret;

    for (let s = 0; s < strings.length; s++) {
      const notes = strings[s];

      // Find starting note: degree nextDeg, closest to handPos
      let startFret = -1;
      let bestDist = Infinity;
      for (const n of notes) {
        if (n.deg === nextDeg && Math.abs(n.fret - handPos) < bestDist) {
          bestDist = Math.abs(n.fret - handPos);
          startFret = n.fret;
        }
      }
      if (startFret < 0) continue;

      // Take ascending scale notes within 3-fret span from startFret
      for (const n of notes) {
        if (n.fret < startFret) continue;
        if (n.fret - startFret > 3) break;
        box.add(`${s}-${n.fret}`);
        nextDeg = (n.deg + 1) % scaleIntervals.length;
      }

      handPos = startFret;
    }

    return box;
  }

  /**
   * Dim notes outside the box. In-box notes keep their original scale degree.
   */
  applyBoxFilter(fretboard: FretNote[][], boxNotes: Set<string>): FretNote[][] {
    return fretboard.map((string, si) =>
      string.map((note, fi) => {
        if (boxNotes.has(`${si}-${fi}`)) return note;
        if (note.role === 'nonScale') return note;
        return { ...note, role: 'outOfBox' as NoteRole, degree: null };
      }),
    );
  }
}
