import { Component, computed, input } from '@angular/core';
import { ChordVoicing } from '../../core/models/chord.model';
import { NoteName } from '../../core/models/note.model';
import { noteNameToIndex } from '../../core/utils/music.utils';

@Component({
  selector: 'app-chord-diagram',
  template: `
    <div class="inline-block">
      <svg
        [attr.width]="svgWidth"
        [attr.height]="svgHeight"
        [attr.viewBox]="'0 0 ' + svgWidth + ' ' + svgHeight"
        class="block"
      >
        <!-- Chord name -->
        <text
          [attr.x]="svgWidth / 2"
          [attr.y]="18"
          text-anchor="middle"
          class="fill-text-primary"
          font-size="16"
          font-weight="bold"
        >{{ chordName() }}</text>

        <!-- Open/Muted string markers -->
        @for (marker of stringMarkers(); track $index) {
          @if (marker === 'x') {
            <text
              [attr.x]="padLeft + $index * stringSpacing"
              [attr.y]="topMarkerY"
              text-anchor="middle"
              font-size="12"
              class="fill-gray-400"
            >✕</text>
          }
          @if (marker === 'o') {
            <circle
              [attr.cx]="padLeft + $index * stringSpacing"
              [attr.cy]="topMarkerY - 4"
              r="4"
              fill="none"
              stroke="var(--color-text-primary)"
              stroke-width="1.5"
            />
          }
        }

        <!-- Fret lines (horizontal) + fret numbers -->
        @for (f of fretLines(); track $index) {
          <line
            [attr.x1]="padLeft"
            [attr.y1]="gridTop + $index * fretSpacing"
            [attr.x2]="padLeft + (stringCount() - 1) * stringSpacing"
            [attr.y2]="gridTop + $index * fretSpacing"
            stroke="var(--color-fret-line)"
            stroke-width="1"
          />
          @if ($index < displayFrets) {
            <text
              [attr.x]="padLeft - 10"
              [attr.y]="gridTop + $index * fretSpacing + fretSpacing / 2 + 4"
              text-anchor="end"
              font-size="10"
              class="fill-gray-400"
            >{{ fretLabel($index) }}</text>
          }
        }

        <!-- String lines (vertical) -->
        @for (s of stringLines(); track $index) {
          <line
            [attr.x1]="padLeft + $index * stringSpacing"
            [attr.y1]="gridTop"
            [attr.x2]="padLeft + $index * stringSpacing"
            [attr.y2]="gridTop + displayFrets * fretSpacing"
            stroke="var(--color-fret-line)"
            stroke-width="1"
          />
        }

        <!-- Barre bar -->
        @if (barreInfo(); as barre) {
          <rect
            [attr.x]="barre.x"
            [attr.y]="barre.y - 6"
            [attr.width]="barre.width"
            [attr.height]="12"
            rx="6"
            fill="var(--color-note-scale)"
          />
        }

        <!-- String labels at bottom -->
        @for (label of openStrings(); track $index) {
          <text
            [attr.x]="padLeft + $index * stringSpacing"
            [attr.y]="gridTop + displayFrets * fretSpacing + 14"
            text-anchor="middle"
            font-size="10"
            class="fill-gray-400"
          >{{ label }}</text>
        }

        <!-- Finger dots -->
        @for (dot of dots(); track $index) {
          <circle
            [attr.cx]="dot.x"
            [attr.cy]="dot.y"
            r="8"
            [attr.fill]="dot.isRoot ? 'var(--color-note-root)' : 'var(--color-note-scale)'"
          />
          @if (dot.isRoot) {
            <text
              [attr.x]="dot.x"
              [attr.y]="dot.y + 4"
              text-anchor="middle"
              font-size="10"
              font-weight="bold"
              fill="white"
            >R</text>
          }
        }
      </svg>
    </div>
  `,
})
export class ChordDiagramComponent {
  readonly voicing = input.required<ChordVoicing>();
  readonly chordName = input.required<string>();
  readonly stringCount = input(6);
  readonly rootNote = input.required<NoteName>();
  readonly openStrings = input.required<NoteName[]>();

  readonly displayFrets = 5;
  readonly stringSpacing = 24;
  readonly fretSpacing = 28;
  readonly padLeft = 40;
  readonly padTop = 48;
  readonly topMarkerY = 40;

  readonly gridTop = this.padTop;
  readonly svgWidth = this.padLeft + 5 * this.stringSpacing + 16;
  readonly svgHeight = this.padTop + this.displayFrets * this.fretSpacing + 24;

  readonly fretLines = computed(() => Array.from({ length: this.displayFrets + 1 }, (_, i) => i));
  readonly stringLines = computed(() => Array.from({ length: this.stringCount() }, (_, i) => i));

  fretLabel(index: number): string {
    const start = this.voicing().startFret;
    const fretNum = start === 0 ? index + 1 : start + index;
    return fretNum + 'fr';
  }

  readonly stringMarkers = computed(() => {
    const v = this.voicing();
    return v.frets.map(f => {
      if (f === null) return 'x';
      if (f === 0 && v.startFret === 0) return 'o';
      return '';
    });
  });

  readonly dots = computed(() => {
    const v = this.voicing();
    const rootIdx = noteNameToIndex(this.rootNote());
    const open = this.openStrings();
    const result: { x: number; y: number; isRoot: boolean }[] = [];

    v.frets.forEach((fret, i) => {
      if (fret === null || (fret === 0 && v.startFret === 0)) return;

      const relFret = v.startFret === 0 ? fret : fret - v.startFret + 1;
      const x = this.padLeft + i * this.stringSpacing;
      const y = this.gridTop + (relFret - 0.5) * this.fretSpacing;

      const openNote = noteNameToIndex(open[i]);
      const noteIdx = (openNote + fret) % 12;
      const isRoot = noteIdx === rootIdx;

      result.push({ x, y, isRoot });
    });
    return result;
  });

  readonly barreInfo = computed(() => {
    const v = this.voicing();
    if (v.barreAt === undefined) return null;

    const barreFret = v.barreAt;
    const relFret = v.startFret === 0 ? barreFret : barreFret - v.startFret + 1;
    const y = this.gridTop + (relFret - 0.5) * this.fretSpacing;

    let firstStr = -1;
    let lastStr = -1;
    v.frets.forEach((f, i) => {
      if (f !== null && f >= barreFret) {
        if (firstStr === -1) firstStr = i;
        lastStr = i;
      }
    });

    // Find strings that are exactly at the barre fret
    const barreStrings = v.frets
      .map((f, i) => ({ f, i }))
      .filter(({ f }) => f === barreFret);

    if (barreStrings.length < 2) return null;

    const first = barreStrings[0].i;
    const last = barreStrings[barreStrings.length - 1].i;

    return {
      x: this.padLeft + first * this.stringSpacing,
      y,
      width: (last - first) * this.stringSpacing,
    };
  });
}
