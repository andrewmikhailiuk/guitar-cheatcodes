export type ModeName =
  | 'dorian'
  | 'phrygian'
  | 'locrian'
  | 'ionian'
  | 'aeolian'
  | 'mixolydian'
  | 'lydian';

export interface ScaleDefinition {
  name: string;
  labelKey: string;
  intervals: number[];
  defaultRoot: string;
  characterKey?: string;
}
