import { NoteName } from './note.model';

export interface ChordQuality {
  id: string;
  labelKey: string;
  symbol: string;
  intervals: number[];
}

export interface ChordVoicing {
  frets: (number | null)[];
  barreAt?: number;
  startFret: number;
}

export interface ChordShape {
  root: NoteName;
  qualityId: string;
  tuningId: string;
  voicings: ChordVoicing[];
}
