import { NoteName } from '../models/note.model';

export const CHROMATIC_NOTES: NoteName[] = [
  'C', 'C#', 'D', 'D#', 'E', 'F',
  'F#', 'G', 'G#', 'A', 'A#', 'B',
];

/** E Standard open string MIDI numbers (low to high) */
export const E_STANDARD_MIDI: number[] = [40, 45, 50, 55, 59, 64];

/** 7-string B Standard open string MIDI numbers (low to high) */
export const E_STANDARD_7_MIDI: number[] = [35, 40, 45, 50, 55, 59, 64];

export const TOTAL_FRETS = 24;

export const FRET_MARKERS: number[] = [3, 5, 7, 9, 12, 15, 17, 19, 21, 24];
export const DOUBLE_DOT_FRETS: number[] = [12, 24];
