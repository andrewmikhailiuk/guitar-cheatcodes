import { ScaleDefinition } from '../models/scale.model';

export const PENTATONICS: ScaleDefinition[] = [
  { name: 'minorPentatonic', labelKey: 'pentatonics.minor', intervals: [0, 3, 5, 7, 10], defaultRoot: 'A', characterKey: 'character.minorPenta' },
  { name: 'majorPentatonic', labelKey: 'pentatonics.major', intervals: [0, 2, 4, 7, 9],  defaultRoot: 'C', characterKey: 'character.majorPenta' },
];
