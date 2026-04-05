import { NoteName } from './note.model';

export type TuningCategory = 'standard' | 'drop' | 'open';

export interface TuningDefinition {
  id: string;
  labelKey: string;
  stringCount: number;
  offsets: number[];
  openStrings: NoteName[];
  category: TuningCategory;
  descriptionKey: string;
}
