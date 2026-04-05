import { GammaDefinition } from '../models/gamma.model';

export const GAMMAS: GammaDefinition[] = [
  // Modes
  { name: 'ionian',        labelKey: 'gammas.ionian',        intervals: [0, 2, 4, 5, 7, 9, 11], defaultRoot: 'C',  characterKey: 'character.ionian' },
  { name: 'dorian',        labelKey: 'gammas.dorian',        intervals: [0, 2, 3, 5, 7, 9, 10], defaultRoot: 'D',  characterKey: 'character.dorian' },
  { name: 'phrygian',      labelKey: 'gammas.phrygian',      intervals: [0, 1, 3, 5, 7, 8, 10], defaultRoot: 'E',  characterKey: 'character.phrygian' },
  { name: 'lydian',        labelKey: 'gammas.lydian',        intervals: [0, 2, 4, 6, 7, 9, 11], defaultRoot: 'F',  characterKey: 'character.lydian' },
  { name: 'mixolydian',    labelKey: 'gammas.mixolydian',    intervals: [0, 2, 4, 5, 7, 9, 10], defaultRoot: 'G',  characterKey: 'character.mixolydian' },
  { name: 'aeolian',       labelKey: 'gammas.aeolian',       intervals: [0, 2, 3, 5, 7, 8, 10], defaultRoot: 'A',  characterKey: 'character.aeolian' },
  { name: 'locrian',       labelKey: 'gammas.locrian',       intervals: [0, 1, 3, 5, 6, 8, 10], defaultRoot: 'B',  characterKey: 'character.locrian' },
  // Scales
  { name: 'harmonicMinor', labelKey: 'gammas.harmonicMinor', intervals: [0, 2, 3, 5, 7, 8, 11], defaultRoot: 'A',  characterKey: 'character.harmonicMinor' },
  { name: 'melodicMinor',  labelKey: 'gammas.melodicMinor',  intervals: [0, 2, 3, 5, 7, 9, 11], defaultRoot: 'A',  characterKey: 'character.melodicMinor' },
  // Pentatonics
  { name: 'minorPentatonic', labelKey: 'gammas.minorPenta',  intervals: [0, 3, 5, 7, 10],       defaultRoot: 'A',  characterKey: 'character.minorPenta' },
  { name: 'majorPentatonic', labelKey: 'gammas.majorPenta',  intervals: [0, 2, 4, 7, 9],        defaultRoot: 'C',  characterKey: 'character.majorPenta' },
];
