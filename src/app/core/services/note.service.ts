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

    // Find scale note frets for each string
    const scaleFretsPerString: number[][] = openStringMidis.map((openMidi) => {
      const frets: number[] = [];
      for (let f = 0; f <= totalFrets; f++) {
        const interval = (((openMidi + f) % 12) - rootIndex + 12) % 12;
        if (scaleIntervals.includes(interval)) {
          frets.push(f);
        }
      }
      return frets;
    });

    // Find starting fret on lowest string for the given degree
    const startInterval = scaleIntervals[startDegree];
    const lowestFrets = scaleFretsPerString[0];
    const startFret = lowestFrets.find((f) => {
      const interval = (((openStringMidis[0] + f) % 12) - rootIndex + 12) % 12;
      return interval === startInterval;
    });

    if (startFret === undefined) return box;

    let refFret = startFret;

    for (let s = 0; s < openStringMidis.length; s++) {
      const frets = scaleFretsPerString[s];

      // Find first scale fret >= refFret
      let bestIdx = frets.length - 3;
      for (let i = 0; i < frets.length; i++) {
        if (frets[i] >= refFret) {
          bestIdx = i;
          break;
        }
      }

      // Ensure room for 3 notes
      bestIdx = Math.min(bestIdx, frets.length - 3);
      bestIdx = Math.max(bestIdx, 0);

      for (let n = 0; n < 3 && bestIdx + n < frets.length; n++) {
        box.add(`${s}-${frets[bestIdx + n]}`);
      }

      refFret = frets[bestIdx];
    }

    return box;
  }

  /**
   * Dim scale notes that fall outside the selected box.
   */
  applyBoxFilter(fretboard: FretNote[][], boxNotes: Set<string>): FretNote[][] {
    return fretboard.map((string, si) =>
      string.map((note, fi) => {
        if (note.role === 'nonScale') return note;
        if (boxNotes.has(`${si}-${fi}`)) return note;
        return { ...note, role: 'outOfBox' as NoteRole };
      }),
    );
  }
}
