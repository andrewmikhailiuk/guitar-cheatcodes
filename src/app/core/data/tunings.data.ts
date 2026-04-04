import { TuningDefinition } from '../models/tuning.model';

export const TUNINGS: TuningDefinition[] = [
  {
    id: 'e-standard',
    labelKey: 'tunings.eStandard',
    stringCount: 6,
    offsets: [0, 0, 0, 0, 0, 0],
    openStrings: ['E', 'A', 'D', 'G', 'B', 'E'],
  },
  {
    id: 'drop-d',
    labelKey: 'tunings.dropD',
    stringCount: 6,
    offsets: [-2, 0, 0, 0, 0, 0],
    openStrings: ['D', 'A', 'D', 'G', 'B', 'E'],
  },
  {
    id: 'd-standard',
    labelKey: 'tunings.dStandard',
    stringCount: 6,
    offsets: [-2, -2, -2, -2, -2, -2],
    openStrings: ['D', 'G', 'C', 'F', 'A', 'D'],
  },
  {
    id: 'drop-c',
    labelKey: 'tunings.dropC',
    stringCount: 6,
    offsets: [-4, -2, -2, -2, -2, -2],
    openStrings: ['C', 'G', 'C', 'F', 'A', 'D'],
  },
  {
    id: 'b-standard',
    labelKey: 'tunings.bStandard',
    stringCount: 6,
    offsets: [-5, -5, -5, -5, -5, -5],
    openStrings: ['B', 'E', 'A', 'D', 'F#', 'B'],
  },
  {
    id: 'drop-a',
    labelKey: 'tunings.dropA6',
    stringCount: 6,
    offsets: [-7, -5, -5, -5, -5, -5],
    openStrings: ['A', 'E', 'A', 'D', 'F#', 'B'],
  },
  {
    id: '7-b-standard',
    labelKey: 'tunings.7bStandard',
    stringCount: 7,
    offsets: [0, 0, 0, 0, 0, 0, 0],
    openStrings: ['B', 'E', 'A', 'D', 'G', 'B', 'E'],
  },
  {
    id: '7-drop-a',
    labelKey: 'tunings.7dropA',
    stringCount: 7,
    offsets: [-2, 0, 0, 0, 0, 0, 0],
    openStrings: ['A', 'E', 'A', 'D', 'G', 'B', 'E'],
  },
];
