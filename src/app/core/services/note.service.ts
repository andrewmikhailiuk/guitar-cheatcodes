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
   * Compute a positional box. Box N starts on scale degree N (1=root) on
   * the lowest string. Window: [anchorFret-1, anchorFret+3] — 5 frets
   * with index finger stretch. Gives 2-3 notes per string.
   */
  computeBox(
    scaleIntervals: number[],
    rootIndex: number,
    boxNumber: number,
    openStringMidis: number[],
    totalFrets: number,
  ): Set<string> {
    const box = new Set<string>();
    const startDegreeIdx = boxNumber - 1;

    // Find anchor fret: where startDegree falls on the lowest string
    let anchorFret = -1;
    const targetInterval = scaleIntervals[startDegreeIdx];
    for (let f = 0; f <= totalFrets; f++) {
      const interval =
        (((openStringMidis[0] + f) % 12) - rootIndex + 12) % 12;
      if (interval === targetInterval) {
        anchorFret = f;
        break;
      }
    }
    if (anchorFret < 0) return box;

    // 5-fret window: index finger stretch back + 4 frets forward
    const windowStart = Math.max(0, anchorFret - 1);
    const windowEnd = anchorFret + 3;

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
