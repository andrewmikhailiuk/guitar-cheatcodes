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
   * Compute a positional box: all scale notes within a 4-fret window.
   * Boxes are numbered by fret order on the lowest string (lowest first).
   * boxNumber is 1-based (1 = lowest position on the neck).
   */
  computeBox(
    scaleIntervals: number[],
    rootIndex: number,
    boxNumber: number,
    openStringMidis: number[],
    totalFrets: number,
  ): Set<string> {
    const box = new Set<string>();

    // Find all scale notes on the lowest string (first occurrence of each degree)
    const lowestStringNotes: { fret: number; degreeIdx: number }[] = [];
    const seen = new Set<number>();
    for (let f = 0; f <= totalFrets; f++) {
      const interval =
        (((openStringMidis[0] + f) % 12) - rootIndex + 12) % 12;
      const idx = scaleIntervals.indexOf(interval);
      if (idx >= 0 && !seen.has(idx)) {
        seen.add(idx);
        lowestStringNotes.push({ fret: f, degreeIdx: idx });
      }
      if (seen.size === scaleIntervals.length) break;
    }
    lowestStringNotes.sort((a, b) => a.fret - b.fret);

    const startNote = lowestStringNotes[boxNumber - 1];
    if (!startNote) return box;

    // 4-fret window: anchorFret to anchorFret + 3
    const windowStart = startNote.fret;
    const windowEnd = windowStart + 3;

    for (let s = 0; s < openStringMidis.length; s++) {
      const openMidi = openStringMidis[s];
      for (let f = windowStart; f <= windowEnd && f <= totalFrets; f++) {
        const interval = (((openMidi + f) % 12) - rootIndex + 12) % 12;
        if (scaleIntervals.includes(interval)) {
          box.add(`${s}-${f}`);
        }
      }
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
