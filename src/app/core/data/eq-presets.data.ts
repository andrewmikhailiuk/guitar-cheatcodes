import { EqPreset, FrequencyBand } from '../models/eq.model';

export const FREQUENCY_BANDS: FrequencyBand[] = [
  { frequency: 31,    label: '31 Hz',  descriptionKey: 'eq.subRumble',  deathDb: 0,  blackDb: 0 },
  { frequency: 62,    label: '62 Hz',  descriptionKey: 'eq.bassThump',  deathDb: 2,  blackDb: 0 },
  { frequency: 125,   label: '125 Hz', descriptionKey: 'eq.meat',       deathDb: 3,  blackDb: 0 },
  { frequency: 250,   label: '250 Hz', descriptionKey: 'eq.mud',        deathDb: -1, blackDb: -2 },
  { frequency: 500,   label: '500 Hz', descriptionKey: 'eq.body',       deathDb: -3, blackDb: -1 },
  { frequency: 1000,  label: '1 kHz',  descriptionKey: 'eq.punch',      deathDb: -2, blackDb: 2 },
  { frequency: 2000,  label: '2 kHz',  descriptionKey: 'eq.bite',       deathDb: 1,  blackDb: 3 },
  { frequency: 4000,  label: '4 kHz',  descriptionKey: 'eq.aggression', deathDb: 3,  blackDb: 4 },
  { frequency: 8000,  label: '8 kHz',  descriptionKey: 'eq.zing',       deathDb: 1,  blackDb: 2 },
  { frequency: 16000, label: '16 kHz', descriptionKey: 'eq.air',        deathDb: 0,  blackDb: 1 },
];

export const EQ_PRESETS: EqPreset[] = [
  {
    id: 'death',
    labelKey: 'eq.presetDeath',
    descriptionKey: 'eq.descDeath',
    settings: { bands: [0, 2, 3, -1, -3, -2, 1, 3, 1, 0], gain: 0.8 },
  },
  {
    id: 'black',
    labelKey: 'eq.presetBlack',
    descriptionKey: 'eq.descBlack',
    settings: { bands: [0, 0, 0, -2, -1, 2, 3, 4, 2, 1], gain: 0.9 },
  },
  {
    id: 'thrash',
    labelKey: 'eq.presetThrash',
    descriptionKey: 'eq.descThrash',
    settings: { bands: [0, 1, 2, 0, -2, -1, 1, 2, 2, 0], gain: 0.7 },
  },
  {
    id: 'doom',
    labelKey: 'eq.presetDoom',
    descriptionKey: 'eq.descDoom',
    settings: { bands: [2, 3, 3, 1, 0, -1, -1, 0, -2, -3], gain: 0.9 },
  },
  {
    id: 'djent',
    labelKey: 'eq.presetDjent',
    descriptionKey: 'eq.descDjent',
    settings: { bands: [-3, 0, 2, -1, -2, 1, 3, 3, 1, 0], gain: 0.85 },
  },
  {
    id: 'rock',
    labelKey: 'eq.presetRock',
    descriptionKey: 'eq.descRock',
    settings: { bands: [0, 1, 1, 0, 1, 2, 1, 0, 0, 0], gain: 0.55 },
  },
  {
    id: 'default',
    labelKey: 'eq.presetDefault',
    descriptionKey: '',
    settings: { bands: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], gain: 0.5 },
  },
];
