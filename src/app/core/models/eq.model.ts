export interface EqSettings {
  low: number;
  lowMid: number;
  highMid: number;
  high: number;
  gain: number;
}

export interface EqPreset {
  id: string;
  labelKey: string;
  settings: EqSettings;
}

export interface FrequencyBand {
  range: string;
  descriptionKey: string;
  deathDb: number;
  blackDb: number;
}
