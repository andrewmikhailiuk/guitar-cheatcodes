export type NoteName =
  | 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F'
  | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B';

export type NoteRole =
  | 'root'
  | 'tritone'
  | 'minorSecond'
  | 'scale'
  | 'nonScale'
  | 'neutral';

export interface FretNote {
  name: NoteName;
  midi: number;
  frequency: number;
  interval: number;
  role: NoteRole;
}
