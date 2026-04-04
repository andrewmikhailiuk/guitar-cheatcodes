import { ScaleDefinition } from '../models/scale.model';

export type GammaName = 'major' | 'naturalMinor' | 'harmonicMinor' | 'melodicMinor';

export const GAMMAS: ScaleDefinition[] = [
  { name: 'major' as any,         labelKey: 'gammas.major',         intervals: [0, 2, 4, 5, 7, 9, 11], defaultRoot: 'C' },
  { name: 'naturalMinor' as any,  labelKey: 'gammas.naturalMinor',  intervals: [0, 2, 3, 5, 7, 8, 10], defaultRoot: 'A' },
  { name: 'harmonicMinor' as any, labelKey: 'gammas.harmonicMinor', intervals: [0, 2, 3, 5, 7, 8, 11], defaultRoot: 'A' },
  { name: 'melodicMinor' as any,  labelKey: 'gammas.melodicMinor',  intervals: [0, 2, 3, 5, 7, 9, 11], defaultRoot: 'A' },
];
