import { ScaleDefinition } from '../models/scale.model';

export const GAMMAS: ScaleDefinition[] = [
  { name: 'major',         labelKey: 'gammas.major',         intervals: [0, 2, 4, 5, 7, 9, 11], defaultRoot: 'C', characterKey: 'character.major' },
  { name: 'naturalMinor',  labelKey: 'gammas.naturalMinor',  intervals: [0, 2, 3, 5, 7, 8, 10], defaultRoot: 'A', characterKey: 'character.naturalMinor' },
  { name: 'harmonicMinor', labelKey: 'gammas.harmonicMinor', intervals: [0, 2, 3, 5, 7, 8, 11], defaultRoot: 'A', characterKey: 'character.harmonicMinor' },
  { name: 'melodicMinor',  labelKey: 'gammas.melodicMinor',  intervals: [0, 2, 3, 5, 7, 9, 11], defaultRoot: 'A', characterKey: 'character.melodicMinor' },
];
