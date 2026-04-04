import { Injectable } from '@angular/core';
import { FretNote, NoteName } from '../models/note.model';
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

        stringNotes.push({
          name,
          midi,
          frequency: midiToFrequency(midi),
          interval,
          role: getNoteRole(interval, scaleIntervals),
        });
      }

      fretboard.push(stringNotes);
    }

    return fretboard;
  }
}
