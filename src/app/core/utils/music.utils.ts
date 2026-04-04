import { NoteName, NoteRole } from '../models/note.model';
import { CHROMATIC_NOTES } from '../data/notes.data';

export function midiToFrequency(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

export function midiToNoteName(midi: number): NoteName {
  const index = ((midi % 12) + 12) % 12;
  return CHROMATIC_NOTES[index];
}

export function noteNameToIndex(name: NoteName): number {
  return CHROMATIC_NOTES.indexOf(name);
}

export function getNoteRole(
  interval: number,
  scaleIntervals: number[] | null,
): NoteRole {
  if (scaleIntervals === null) {
    return 'neutral';
  }

  if (interval === 0) {
    return 'root';
  }

  if (interval === 1) {
    return scaleIntervals.includes(1) ? 'minorSecond' : 'nonScale';
  }

  if (interval === 6) {
    return scaleIntervals.includes(6) ? 'tritone' : 'nonScale';
  }

  return scaleIntervals.includes(interval) ? 'scale' : 'nonScale';
}
