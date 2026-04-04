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
   * Compute a positional box: all scale notes within a 5-fret window.
   * The window is anchored at the fret of startDegree on the lowest string.
   * Returns a Set of "stringIndex-fretIndex" keys for notes in the box.
   */
  computeBox(
    scaleIntervals: number[],
    rootIndex: number,
    startDegree: number,
    openStringMidis: number[],
    totalFrets: number,
  ): Set<string> {
    const box = new Set<string>();

    // Find anchor fret: where startDegree falls on the lowest string
    const targetInterval = scaleIntervals[startDegree];
    let anchorFret = -1;
    for (let f = 0; f <= totalFrets; f++) {
      const interval =
        (((openStringMidis[0] + f) % 12) - rootIndex + 12) % 12;
      if (interval === targetInterval) {
        anchorFret = f;
        break;
      }
    }
    if (anchorFret < 0) return box;

    // 5-fret window centered on anchor
    const windowStart = Math.max(0, anchorFret - 2);
    const windowEnd = windowStart + 4;

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
   * Dim notes outside the box and assign sequential playing order (1-7 cycling).
   * Order goes from lowest string (index 0) ascending frets, to highest string.
   */
  applyBoxFilter(fretboard: FretNote[][], boxNotes: Set<string>): FretNote[][] {
    // Collect box notes in playing order: lowest string first, ascending fret
    const ordered: { si: number; fi: number }[] = [];
    for (let si = 0; si < fretboard.length; si++) {
      for (let fi = 0; fi < fretboard[si].length; fi++) {
        if (boxNotes.has(`${si}-${fi}`)) {
          ordered.push({ si, fi });
        }
      }
    }

    // Build a map of (si,fi) → playing order number (1-7 cycling)
    const orderMap = new Map<string, number>();
    for (let i = 0; i < ordered.length; i++) {
      const { si, fi } = ordered[i];
      orderMap.set(`${si}-${fi}`, (i % 7) + 1);
    }

    return fretboard.map((string, si) =>
      string.map((note, fi) => {
        const key = `${si}-${fi}`;
        if (boxNotes.has(key)) {
          return { ...note, degree: orderMap.get(key)! };
        }
        if (note.role === 'nonScale') return note;
        return { ...note, role: 'outOfBox' as NoteRole, degree: null };
      }),
    );
  }
}
