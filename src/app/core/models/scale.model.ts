export type ModeName =
  | 'dorian'
  | 'phrygian'
  | 'locrian'
  | 'ionian'
  | 'aeolian'
  | 'mixolydian'
  | 'lydian';

export interface ScaleDefinition {
  name: ModeName;
  labelKey: string;
  intervals: number[];
  defaultRoot: string;
}
