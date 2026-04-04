import { ScaleDefinition } from '../models/scale.model';

export const SCALES: ScaleDefinition[] = [
  { name: 'dorian',      labelKey: 'scales.dorian',      intervals: [0, 2, 3, 5, 7, 9, 10] },
  { name: 'phrygian',    labelKey: 'scales.phrygian',    intervals: [0, 1, 3, 5, 7, 8, 10] },
  { name: 'locrian',     labelKey: 'scales.locrian',     intervals: [0, 1, 3, 5, 6, 8, 10] },
  { name: 'ionian',      labelKey: 'scales.ionian',      intervals: [0, 2, 4, 5, 7, 9, 11] },
  { name: 'aeolian',     labelKey: 'scales.aeolian',     intervals: [0, 2, 3, 5, 7, 8, 10] },
  { name: 'mixolydian',  labelKey: 'scales.mixolydian',  intervals: [0, 2, 4, 5, 7, 9, 10] },
];
