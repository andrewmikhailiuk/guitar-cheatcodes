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
   * Compute a 3-notes-per-string box position.
   * Each string continues the scale sequence from where the previous left off.
   * Returns a Set of "stringIndex-fretIndex" keys for notes in the box.
   */
  compute3NPSBox(
    scaleIntervals: number[],
    rootIndex: number,
    startDegree: number,
    openStringMidis: number[],
    totalFrets: number,
  ): Set<string> {
    const box = new Set<string>();
    const numDegrees = scaleIntervals.length;

    // For each string, build fret → degreeIdx mapping (sorted by fret)
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

    let currentDegreeIdx = startDegree;
    let refFret = -1;

    // Find initial refFret on lowest string
    const firstHit = stringNotes[0].find((n) => n.degreeIdx === startDegree);
    if (!firstHit) return box;
    refFret = firstHit.fret;

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
