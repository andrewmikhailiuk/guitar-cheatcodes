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
   * Compute a 3NPS box. Box N starts on scale degree N (1=root) on the
   * lowest string. Each string continues the scale from where the previous
   * string left off, always 3 notes per string.
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
    const startDegreeIdx = boxNumber - 1; // box 1 → degree 0 (root)

    // For each string, build fret → degreeIdx mapping
    const stringNotes: { fret: number; degreeIdx: number }[][] =
      openStringMidis.map((openMidi) => {
        const notes: { fret: number; degreeIdx: number }[] = [];
        for (let f = 0; f <= totalFrets; f++) {
          const interval = (((openMidi + f) % 12) - rootIndex + 12) % 12;
          const idx = scaleIntervals.indexOf(interval);
          if (idx >= 0) {
            notes.push({ fret: f, degreeIdx: idx });
          }
        }
        return notes;
      });

    // Find starting fret on lowest string
    const firstHit = stringNotes[0].find((n) => n.degreeIdx === startDegreeIdx);
    if (!firstHit) return box;

    let currentDegreeIdx = startDegreeIdx;
    let refFret = firstHit.fret;

    for (let s = 0; s < openStringMidis.length; s++) {
      const notes = stringNotes[s];

      // Find the note with currentDegreeIdx closest to refFret
      let bestIdx = -1;
      let bestDist = Infinity;
      for (let i = 0; i < notes.length; i++) {
        if (notes[i].degreeIdx === currentDegreeIdx) {
          const dist = Math.abs(notes[i].fret - refFret);
          if (dist < bestDist) {
            bestDist = dist;
            bestIdx = i;
          }
        }
      }

      if (bestIdx < 0 || bestIdx + 2 >= notes.length) continue;

      for (let n = 0; n < 3; n++) {
        box.add(`${s}-${notes[bestIdx + n].fret}`);
      }

      refFret = notes[bestIdx].fret;
      currentDegreeIdx = (currentDegreeIdx + 3) % numDegrees;
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
