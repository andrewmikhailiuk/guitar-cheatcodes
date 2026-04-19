export interface Riff {
  id: string;
  labelKey: string;
  descriptionKey: string;
  notes: number[];
  intervalMs: number;
  noteDurationMs: number;
}

export const RIFFS: Riff[] = [
  {
    id: 'chug',
    labelKey: 'eq.riffChug',
    descriptionKey: 'eq.descChug',
    notes: [40, 40, 47, 40, 40, 40, 47, 52],
    intervalMs: 107,
    noteDurationMs: 100,
  },
  {
    id: 'gallop',
    labelKey: 'eq.riffGallop',
    descriptionKey: 'eq.descGallop',
    notes: [40, 40, 40, 43, 43, 43, 45, 45, 45, 47, 47, 47],
    intervalMs: 75,
    noteDurationMs: 60,
  },
  {
    id: 'chromatic',
    labelKey: 'eq.riffChromatic',
    descriptionKey: 'eq.descChromatic',
    notes: [40, 40, 39, 39, 38, 38, 37, 37, 36, 36, 40],
    intervalMs: 120,
    noteDurationMs: 100,
  },
  {
    id: 'tritone',
    labelKey: 'eq.riffTritone',
    descriptionKey: 'eq.descTritone',
    notes: [40, -1, 46, -1, 40, 40, 46, 45, 44, 43, 40],
    intervalMs: 250,
    noteDurationMs: 200,
  },
  {
    id: 'syncopated',
    labelKey: 'eq.riffSyncopated',
    descriptionKey: 'eq.descSyncopated',
    notes: [40, -1, 40, -1, -1, 40, 40, -1, 47, -1, 40, -1],
    intervalMs: 100,
    noteDurationMs: 50,
  },
];
