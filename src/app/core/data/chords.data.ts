import { ChordQuality, ChordShape } from '../models/chord.model';

export const CHORD_QUALITIES: ChordQuality[] = [
  { id: 'major',  labelKey: 'chords.major',  symbol: '',     intervals: [0, 4, 7] },
  { id: 'minor',  labelKey: 'chords.minor',  symbol: 'm',    intervals: [0, 3, 7] },
  { id: 'dom7',   labelKey: 'chords.dom7',   symbol: '7',    intervals: [0, 4, 7, 10] },
  { id: 'min7',   labelKey: 'chords.min7',   symbol: 'm7',   intervals: [0, 3, 7, 10] },
  { id: 'maj7',   labelKey: 'chords.maj7',   symbol: 'maj7', intervals: [0, 4, 7, 11] },
  { id: 'dim',    labelKey: 'chords.dim',     symbol: 'dim',  intervals: [0, 3, 6] },
  { id: 'aug',    labelKey: 'chords.aug',     symbol: 'aug',  intervals: [0, 4, 8] },
  { id: 'sus2',   labelKey: 'chords.sus2',    symbol: 'sus2', intervals: [0, 2, 7] },
  { id: 'sus4',   labelKey: 'chords.sus4',    symbol: 'sus4', intervals: [0, 5, 7] },
  { id: 'power',  labelKey: 'chords.power',   symbol: '5',    intervals: [0, 7] },
];

// All shapes for E Standard tuning (6 strings: E A D G B E low→high)
// frets array order: [6th, 5th, 4th, 3rd, 2nd, 1st] (low E to high E)
export const CHORD_SHAPES: ChordShape[] = [
  // ── C ──
  { root: 'C', qualityId: 'major', tuningId: 'e-standard', voicings: [
    { frets: [null, 3, 2, 0, 1, 0], startFret: 0 },
    { frets: [8, 10, 10, 9, 8, 8], barreAt: 8, startFret: 8 },
  ]},
  { root: 'C', qualityId: 'minor', tuningId: 'e-standard', voicings: [
    { frets: [null, 3, 5, 5, 4, 3], barreAt: 3, startFret: 3 },
    { frets: [8, 10, 10, 8, 8, 8], barreAt: 8, startFret: 8 },
  ]},
  { root: 'C', qualityId: 'dom7', tuningId: 'e-standard', voicings: [
    { frets: [null, 3, 2, 3, 1, 0], startFret: 0 },
  ]},
  { root: 'C', qualityId: 'maj7', tuningId: 'e-standard', voicings: [
    { frets: [null, 3, 2, 0, 0, 0], startFret: 0 },
  ]},
  { root: 'C', qualityId: 'min7', tuningId: 'e-standard', voicings: [
    { frets: [null, 3, 5, 3, 4, 3], barreAt: 3, startFret: 3 },
  ]},
  { root: 'C', qualityId: 'dim', tuningId: 'e-standard', voicings: [
    { frets: [null, 3, 4, 5, 4, null], startFret: 3 },
  ]},
  { root: 'C', qualityId: 'aug', tuningId: 'e-standard', voicings: [
    { frets: [null, 3, 2, 1, 1, 0], startFret: 0 },
  ]},
  { root: 'C', qualityId: 'sus2', tuningId: 'e-standard', voicings: [
    { frets: [null, 3, 3, 0, 1, 3], startFret: 0 },
  ]},
  { root: 'C', qualityId: 'sus4', tuningId: 'e-standard', voicings: [
    { frets: [null, 3, 3, 0, 1, 1], startFret: 0 },
  ]},

  // ── C# / Db ──
  { root: 'C#', qualityId: 'major', tuningId: 'e-standard', voicings: [
    { frets: [null, 4, 3, 1, 2, 1], barreAt: 1, startFret: 1 },
    { frets: [9, 11, 11, 10, 9, 9], barreAt: 9, startFret: 9 },
  ]},
  { root: 'C#', qualityId: 'minor', tuningId: 'e-standard', voicings: [
    { frets: [null, 4, 6, 6, 5, 4], barreAt: 4, startFret: 4 },
    { frets: [9, 11, 11, 9, 9, 9], barreAt: 9, startFret: 9 },
  ]},

  // ── D ──
  { root: 'D', qualityId: 'major', tuningId: 'e-standard', voicings: [
    { frets: [null, null, 0, 2, 3, 2], startFret: 0 },
    { frets: [null, 5, 4, 2, 3, 2], startFret: 2 },
  ]},
  { root: 'D', qualityId: 'minor', tuningId: 'e-standard', voicings: [
    { frets: [null, null, 0, 2, 3, 1], startFret: 0 },
    { frets: [null, 5, 7, 7, 6, 5], barreAt: 5, startFret: 5 },
  ]},
  { root: 'D', qualityId: 'dom7', tuningId: 'e-standard', voicings: [
    { frets: [null, null, 0, 2, 1, 2], startFret: 0 },
  ]},
  { root: 'D', qualityId: 'maj7', tuningId: 'e-standard', voicings: [
    { frets: [null, null, 0, 2, 2, 2], startFret: 0 },
  ]},
  { root: 'D', qualityId: 'min7', tuningId: 'e-standard', voicings: [
    { frets: [null, null, 0, 2, 1, 1], startFret: 0 },
  ]},
  { root: 'D', qualityId: 'dim', tuningId: 'e-standard', voicings: [
    { frets: [null, null, 0, 1, 3, 1], startFret: 0 },
  ]},
  { root: 'D', qualityId: 'aug', tuningId: 'e-standard', voicings: [
    { frets: [null, null, 0, 3, 3, 2], startFret: 0 },
  ]},
  { root: 'D', qualityId: 'sus2', tuningId: 'e-standard', voicings: [
    { frets: [null, null, 0, 2, 3, 0], startFret: 0 },
  ]},
  { root: 'D', qualityId: 'sus4', tuningId: 'e-standard', voicings: [
    { frets: [null, null, 0, 2, 3, 3], startFret: 0 },
  ]},
  { root: 'D', qualityId: 'power', tuningId: 'e-standard', voicings: [
    { frets: [null, null, 0, 2, 3, null], startFret: 0 },
    { frets: [null, 5, 7, 7, null, null], startFret: 5 },
  ]},

  // ── D# / Eb ──
  { root: 'D#', qualityId: 'major', tuningId: 'e-standard', voicings: [
    { frets: [null, null, 1, 3, 4, 3], startFret: 1 },
    { frets: [null, 6, 5, 3, 4, 3], barreAt: 3, startFret: 3 },
  ]},
  { root: 'D#', qualityId: 'minor', tuningId: 'e-standard', voicings: [
    { frets: [null, null, 1, 3, 4, 2], startFret: 1 },
    { frets: [null, 6, 8, 8, 7, 6], barreAt: 6, startFret: 6 },
  ]},

  // ── E ──
  { root: 'E', qualityId: 'major', tuningId: 'e-standard', voicings: [
    { frets: [0, 2, 2, 1, 0, 0], startFret: 0 },
  ]},
  { root: 'E', qualityId: 'minor', tuningId: 'e-standard', voicings: [
    { frets: [0, 2, 2, 0, 0, 0], startFret: 0 },
  ]},
  { root: 'E', qualityId: 'dom7', tuningId: 'e-standard', voicings: [
    { frets: [0, 2, 0, 1, 0, 0], startFret: 0 },
  ]},
  { root: 'E', qualityId: 'maj7', tuningId: 'e-standard', voicings: [
    { frets: [0, 2, 1, 1, 0, 0], startFret: 0 },
  ]},
  { root: 'E', qualityId: 'min7', tuningId: 'e-standard', voicings: [
    { frets: [0, 2, 0, 0, 0, 0], startFret: 0 },
  ]},
  { root: 'E', qualityId: 'dim', tuningId: 'e-standard', voicings: [
    { frets: [0, 1, 2, 0, null, null], startFret: 0 },
  ]},
  { root: 'E', qualityId: 'aug', tuningId: 'e-standard', voicings: [
    { frets: [0, 3, 2, 1, 1, 0], startFret: 0 },
  ]},
  { root: 'E', qualityId: 'sus2', tuningId: 'e-standard', voicings: [
    { frets: [0, 2, 4, 4, 0, 0], startFret: 0 },
  ]},
  { root: 'E', qualityId: 'sus4', tuningId: 'e-standard', voicings: [
    { frets: [0, 2, 2, 2, 0, 0], startFret: 0 },
  ]},
  { root: 'E', qualityId: 'power', tuningId: 'e-standard', voicings: [
    { frets: [0, 2, 2, null, null, null], startFret: 0 },
  ]},

  // ── F ──
  { root: 'F', qualityId: 'major', tuningId: 'e-standard', voicings: [
    { frets: [1, 3, 3, 2, 1, 1], barreAt: 1, startFret: 1 },
  ]},
  { root: 'F', qualityId: 'minor', tuningId: 'e-standard', voicings: [
    { frets: [1, 3, 3, 1, 1, 1], barreAt: 1, startFret: 1 },
  ]},
  { root: 'F', qualityId: 'dom7', tuningId: 'e-standard', voicings: [
    { frets: [1, 3, 1, 2, 1, 1], barreAt: 1, startFret: 1 },
  ]},
  { root: 'F', qualityId: 'maj7', tuningId: 'e-standard', voicings: [
    { frets: [1, 3, 2, 2, 1, 1], barreAt: 1, startFret: 1 },
  ]},
  { root: 'F', qualityId: 'min7', tuningId: 'e-standard', voicings: [
    { frets: [1, 3, 1, 1, 1, 1], barreAt: 1, startFret: 1 },
  ]},
  { root: 'F', qualityId: 'dim', tuningId: 'e-standard', voicings: [
    { frets: [1, 2, 3, 1, null, null], startFret: 1 },
  ]},
  { root: 'F', qualityId: 'aug', tuningId: 'e-standard', voicings: [
    { frets: [1, 4, 3, 2, 2, 1], barreAt: 1, startFret: 1 },
  ]},
  { root: 'F', qualityId: 'sus2', tuningId: 'e-standard', voicings: [
    { frets: [1, 3, 3, 0, 1, 1], barreAt: 1, startFret: 0 },
  ]},
  { root: 'F', qualityId: 'sus4', tuningId: 'e-standard', voicings: [
    { frets: [1, 3, 3, 3, 1, 1], barreAt: 1, startFret: 1 },
  ]},

  // ── F# / Gb ──
  { root: 'F#', qualityId: 'major', tuningId: 'e-standard', voicings: [
    { frets: [2, 4, 4, 3, 2, 2], barreAt: 2, startFret: 2 },
  ]},
  { root: 'F#', qualityId: 'minor', tuningId: 'e-standard', voicings: [
    { frets: [2, 4, 4, 2, 2, 2], barreAt: 2, startFret: 2 },
  ]},

  // ── G ──
  { root: 'G', qualityId: 'major', tuningId: 'e-standard', voicings: [
    { frets: [3, 2, 0, 0, 0, 3], startFret: 0 },
    { frets: [3, 5, 5, 4, 3, 3], barreAt: 3, startFret: 3 },
  ]},
  { root: 'G', qualityId: 'minor', tuningId: 'e-standard', voicings: [
    { frets: [3, 5, 5, 3, 3, 3], barreAt: 3, startFret: 3 },
  ]},
  { root: 'G', qualityId: 'dom7', tuningId: 'e-standard', voicings: [
    { frets: [3, 2, 0, 0, 0, 1], startFret: 0 },
  ]},
  { root: 'G', qualityId: 'maj7', tuningId: 'e-standard', voicings: [
    { frets: [3, 2, 0, 0, 0, 2], startFret: 0 },
  ]},
  { root: 'G', qualityId: 'min7', tuningId: 'e-standard', voicings: [
    { frets: [3, 5, 3, 3, 3, 3], barreAt: 3, startFret: 3 },
  ]},
  { root: 'G', qualityId: 'dim', tuningId: 'e-standard', voicings: [
    { frets: [3, 4, 5, 3, null, null], startFret: 3 },
  ]},
  { root: 'G', qualityId: 'aug', tuningId: 'e-standard', voicings: [
    { frets: [3, 2, 1, 0, 0, 3], startFret: 0 },
  ]},
  { root: 'G', qualityId: 'sus2', tuningId: 'e-standard', voicings: [
    { frets: [3, 0, 0, 0, 3, 3], startFret: 0 },
  ]},
  { root: 'G', qualityId: 'sus4', tuningId: 'e-standard', voicings: [
    { frets: [3, 5, 5, 5, 3, 3], barreAt: 3, startFret: 3 },
  ]},

  // ── G# / Ab ──
  { root: 'G#', qualityId: 'major', tuningId: 'e-standard', voicings: [
    { frets: [4, 6, 6, 5, 4, 4], barreAt: 4, startFret: 4 },
  ]},
  { root: 'G#', qualityId: 'minor', tuningId: 'e-standard', voicings: [
    { frets: [4, 6, 6, 4, 4, 4], barreAt: 4, startFret: 4 },
  ]},

  // ── A ──
  { root: 'A', qualityId: 'major', tuningId: 'e-standard', voicings: [
    { frets: [null, 0, 2, 2, 2, 0], startFret: 0 },
    { frets: [5, 7, 7, 6, 5, 5], barreAt: 5, startFret: 5 },
  ]},
  { root: 'A', qualityId: 'minor', tuningId: 'e-standard', voicings: [
    { frets: [null, 0, 2, 2, 1, 0], startFret: 0 },
    { frets: [5, 7, 7, 5, 5, 5], barreAt: 5, startFret: 5 },
  ]},
  { root: 'A', qualityId: 'dom7', tuningId: 'e-standard', voicings: [
    { frets: [null, 0, 2, 0, 2, 0], startFret: 0 },
  ]},
  { root: 'A', qualityId: 'maj7', tuningId: 'e-standard', voicings: [
    { frets: [null, 0, 2, 1, 2, 0], startFret: 0 },
  ]},
  { root: 'A', qualityId: 'min7', tuningId: 'e-standard', voicings: [
    { frets: [null, 0, 2, 0, 1, 0], startFret: 0 },
  ]},
  { root: 'A', qualityId: 'dim', tuningId: 'e-standard', voicings: [
    { frets: [null, 0, 1, 2, 1, null], startFret: 0 },
  ]},
  { root: 'A', qualityId: 'aug', tuningId: 'e-standard', voicings: [
    { frets: [null, 0, 3, 2, 2, 1], startFret: 0 },
  ]},
  { root: 'A', qualityId: 'sus2', tuningId: 'e-standard', voicings: [
    { frets: [null, 0, 2, 2, 0, 0], startFret: 0 },
  ]},
  { root: 'A', qualityId: 'sus4', tuningId: 'e-standard', voicings: [
    { frets: [null, 0, 2, 2, 3, 0], startFret: 0 },
  ]},
  { root: 'A', qualityId: 'power', tuningId: 'e-standard', voicings: [
    { frets: [null, 0, 2, 2, null, null], startFret: 0 },
    { frets: [5, 7, 7, null, null, null], startFret: 5 },
  ]},

  // ── A# / Bb ──
  { root: 'A#', qualityId: 'major', tuningId: 'e-standard', voicings: [
    { frets: [null, 1, 3, 3, 3, 1], barreAt: 1, startFret: 1 },
    { frets: [6, 8, 8, 7, 6, 6], barreAt: 6, startFret: 6 },
  ]},
  { root: 'A#', qualityId: 'minor', tuningId: 'e-standard', voicings: [
    { frets: [null, 1, 3, 3, 2, 1], barreAt: 1, startFret: 1 },
    { frets: [6, 8, 8, 6, 6, 6], barreAt: 6, startFret: 6 },
  ]},

  // ── B ──
  { root: 'B', qualityId: 'major', tuningId: 'e-standard', voicings: [
    { frets: [null, 2, 4, 4, 4, 2], barreAt: 2, startFret: 2 },
    { frets: [7, 9, 9, 8, 7, 7], barreAt: 7, startFret: 7 },
  ]},
  { root: 'B', qualityId: 'minor', tuningId: 'e-standard', voicings: [
    { frets: [null, 2, 4, 4, 3, 2], barreAt: 2, startFret: 2 },
    { frets: [7, 9, 9, 7, 7, 7], barreAt: 7, startFret: 7 },
  ]},
  { root: 'B', qualityId: 'dom7', tuningId: 'e-standard', voicings: [
    { frets: [null, 2, 1, 2, 0, 2], startFret: 0 },
  ]},
  { root: 'B', qualityId: 'maj7', tuningId: 'e-standard', voicings: [
    { frets: [null, 2, 4, 3, 4, 2], barreAt: 2, startFret: 2 },
  ]},
  { root: 'B', qualityId: 'min7', tuningId: 'e-standard', voicings: [
    { frets: [null, 2, 0, 2, 0, 2], startFret: 0 },
  ]},
  { root: 'B', qualityId: 'dim', tuningId: 'e-standard', voicings: [
    { frets: [null, 2, 3, 4, 3, null], startFret: 2 },
  ]},
  { root: 'B', qualityId: 'aug', tuningId: 'e-standard', voicings: [
    { frets: [null, 2, 1, 0, 0, 3], startFret: 0 },
  ]},
  { root: 'B', qualityId: 'sus2', tuningId: 'e-standard', voicings: [
    { frets: [null, 2, 4, 4, 2, 2], barreAt: 2, startFret: 2 },
  ]},
  { root: 'B', qualityId: 'sus4', tuningId: 'e-standard', voicings: [
    { frets: [null, 2, 4, 4, 5, 2], startFret: 2 },
  ]},
];
