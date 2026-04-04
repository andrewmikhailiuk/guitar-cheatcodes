import { EqPreset, FrequencyBand } from '../models/eq.model';

export const EQ_PRESETS: EqPreset[] = [
  {
    id: 'death',
    labelKey: 'eq.presetDeath',
    settings: { low: 3, lowMid: -2, highMid: 2, high: -1, gain: 0.8 },
  },
  {
    id: 'black',
    labelKey: 'eq.presetBlack',
    settings: { low: 0, lowMid: -3, highMid: 4, high: 2, gain: 0.9 },
  },
  {
    id: 'default',
    labelKey: 'eq.presetDefault',
    settings: { low: 0, lowMid: 0, highMid: 0, high: 0, gain: 0.5 },
  },
];

export const FREQUENCY_BANDS: FrequencyBand[] = [
  { range: '80–120 Hz',  descriptionKey: 'eq.meat',       deathDb: 3,  blackDb: 0 },
  { range: '150–250 Hz', descriptionKey: 'eq.mud',        deathDb: -2, blackDb: -3 },
  { range: '2–4 kHz',    descriptionKey: 'eq.aggression', deathDb: 2,  blackDb: 4 },
  { range: '5–8 kHz',    descriptionKey: 'eq.zing',       deathDb: -1, blackDb: 2 },
];
