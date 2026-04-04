import { ScaleDefinition } from '../models/scale.model';

export type PentatonicName = 'minorPentatonic' | 'majorPentatonic';

export const PENTATONICS: ScaleDefinition[] = [
  { name: 'minorPentatonic' as any, labelKey: 'pentatonics.minor', intervals: [0, 3, 5, 7, 10], defaultRoot: 'A' },
  { name: 'majorPentatonic' as any, labelKey: 'pentatonics.major', intervals: [0, 2, 4, 7, 9],  defaultRoot: 'C' },
];
