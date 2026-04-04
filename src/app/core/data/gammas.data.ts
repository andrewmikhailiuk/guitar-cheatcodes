import { ScaleDefinition } from '../models/scale.model';

export const GAMMAS: ScaleDefinition[] = [
  { name: 'harmonicMinor', labelKey: 'gammas.harmonicMinor', intervals: [0, 2, 3, 5, 7, 8, 11], defaultRoot: 'A', characterKey: 'character.harmonicMinor' },
  { name: 'melodicMinor',  labelKey: 'gammas.melodicMinor',  intervals: [0, 2, 3, 5, 7, 9, 11], defaultRoot: 'A', characterKey: 'character.melodicMinor' },
];
