import { NoteName } from './note.model';

export interface TuningDefinition {
  id: string;
  labelKey: string;
  stringCount: number;
  offsets: number[];
  openStrings: NoteName[];
}
