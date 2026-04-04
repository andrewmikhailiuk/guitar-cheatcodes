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
   * Compute a positional box using sequential degree assignment.
   * Box N starts on degree N (1=root) on the lowest string.
   * Each string continues the scale sequence, taking 2-3 notes
   * within a 3-fret span from the first note on that string.
   */
  computeBox(
    scaleIntervals: number[],
    rootIndex: number,
    boxNumber: number,
    openStringMidis: number[],
    totalFrets: number,
  ): Set<string> {
    const box = new Set<string>();
    const numDegrees = scaleIntervals.length;

    let currentDegreeIdx = boxNumber - 1;

    // Find starting fret on lowest string
    const targetInterval = scaleIntervals[currentDegreeIdx];
    let refFret = -1;
    for (let f = 0; f <= totalFrets; f++) {
      const interval =
        (((openStringMidis[0] + f) % 12) - rootIndex + 12) % 12;
      if (interval === targetInterval) {
        refFret = f;
        break;
      }
    }
    if (refFret < 0) return box;

    for (let s = 0; s < openStringMidis.length; s++) {
      const openMidi = openStringMidis[s];

      // Find fret of currentDegree on this string, closest to refFret
      const degreeInterval = scaleIntervals[currentDegreeIdx];
      let startFret = -1;
      let bestDist = Infinity;
      for (let f = 0; f <= totalFrets; f++) {
        const interval = (((openMidi + f) % 12) - rootIndex + 12) % 12;
        if (interval === degreeInterval) {
          const dist = Math.abs(f - refFret);
          if (dist < bestDist) {
            bestDist = dist;
            startFret = f;
          }
        }
      }
      if (startFret < 0) continue;

      // Take consecutive scale notes within 3-fret span from startFret
      box.add(`${s}-${startFret}`);
      let lastDegIdx = currentDegreeIdx;

      let nextDegIdx = (currentDegreeIdx + 1) % numDegrees;
      while (true) {
        const nextInterval = scaleIntervals[nextDegIdx];
        let nextFret = -1;
        for (let f = startFret + 1; f <= totalFrets; f++) {
          const interval = (((openMidi + f) % 12) - rootIndex + 12) % 12;
          if (interval === nextInterval) {
            nextFret = f;
            break;
          }
        }
        if (nextFret < 0 || nextFret - startFret > 3) break;

        box.add(`${s}-${nextFret}`);
        lastDegIdx = nextDegIdx;
        nextDegIdx = (nextDegIdx + 1) % numDegrees;
      }

      currentDegreeIdx = (lastDegIdx + 1) % numDegrees;
      refFret = startFret;
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
