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

const INTERVAL_NAMES: Record<number, string> = {
  0: '1', 1: 'b2', 2: '2', 3: 'b3', 4: '3', 5: '4',
  6: 'b5', 7: '5', 8: 'b6', 9: '6', 10: 'b7', 11: '7',
};

export function getIntervalFormula(intervals: number[]): string {
  return intervals.map((i) => INTERVAL_NAMES[i] ?? String(i)).join(' ');
}

export function getScaleNotes(rootName: NoteName, intervals: number[]): string {
  const rootIdx = noteNameToIndex(rootName);
  return intervals
    .map((i) => CHROMATIC_NOTES[(rootIdx + i) % 12])
    .join(' ');
}
