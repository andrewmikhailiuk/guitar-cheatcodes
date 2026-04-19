export interface EqSettings {
  bands: number[];
  gain: number;
}

export interface EqPreset {
  id: string;
  labelKey: string;
  descriptionKey: string;
  settings: EqSettings;
}

export interface FrequencyBand {
  frequency: number;
  label: string;
  descriptionKey: string;
  deathDb: number;
  blackDb: number;
}
