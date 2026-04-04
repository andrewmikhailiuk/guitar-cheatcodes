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
   * CAGED box pattern — 5 positions covering one octave on the neck.
   *
   * Algorithm:
   * 1. Find 7 scale notes on low E (one octave starting from root)
   * 2. Remove upper note of each half-step pair → 5 anchors
   * 3. Box 1 = root anchor, Box 2-5 = ascending from there
   * 4. Each box = all scale notes within [anchor-1, anchor+3] on ALL strings
   */
  computeBox(
    scaleIntervals: number[],
    rootIndex: number,
    boxNumber: number,
    openStringMidis: number[],
    totalFrets: number,
  ): Set<string> {
    const box = new Set<string>();
    if (boxNumber < 1 || boxNumber > 5) return box;

    // Step 1: find root fret on lowest string
    let rootFret = -1;
    for (let f = 0; f <= totalFrets; f++) {
      const interval =
        (((openStringMidis[0] + f) % 12) - rootIndex + 12) % 12;
      if (interval === 0) {
        rootFret = f;
        break;
      }
    }
    if (rootFret < 0) return box;

    // Step 2: collect 7 scale notes ascending from root on low E
    const scaleFromRoot: number[] = [];
    for (let f = rootFret; scaleFromRoot.length < 7; f++) {
      if (f > totalFrets) break;
      const interval =
        (((openStringMidis[0] + f) % 12) - rootIndex + 12) % 12;
      if (scaleIntervals.includes(interval)) {
        scaleFromRoot.push(f);
      }
    }

    // Step 3: remove upper note of each half-step pair → 5 anchors
    const anchors: number[] = [];
    for (let i = 0; i < scaleFromRoot.length; i++) {
      const prevGap =
        i > 0 ? scaleFromRoot[i] - scaleFromRoot[i - 1] : 99;
      if (prevGap > 1) {
        anchors.push(scaleFromRoot[i]);
      }
    }

    if (boxNumber > anchors.length) return box;
    const anchorFret = anchors[boxNumber - 1];

    // Step 4: collect all scale notes within [anchor-1, anchor+3]
    const lo = Math.max(0, anchorFret - 1);
    const hi = anchorFret + 3;

    for (let s = 0; s < openStringMidis.length; s++) {
      const openMidi = openStringMidis[s];
      for (let f = lo; f <= hi && f <= totalFrets; f++) {
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
