import { Component, computed, DestroyRef, HostListener, inject, signal } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { AudioService } from '../../core/services/audio.service';
import { StorageService } from '../../core/services/storage.service';

type TimeSignature = [number, number];

const TIME_SIGNATURES: TimeSignature[] = [
  [4, 4],
  [3, 4],
  [6, 8],
];

const MS_PER_MINUTE = 60_000;
const TAP_WINDOW_MS = 2000;
const ACCENT_FREQ = 800;
const NORMAL_FREQ = 600;
const CLICK_DURATION = 0.03;
const CLICK_GAIN = 0.5;
const GAIN_FLOOR = 0.001;
const SECONDS_PER_MINUTE = 60;
const SECONDS_PER_MINUTE_EIGHTH = 30;
const ACCEL_INTERVAL_MS = 80;
const ACCEL_THRESHOLD_MS = 400;

@Component({
  selector: 'app-metronome',
  imports: [TranslocoModule],
  template: `
    <div class="p-4 py-8 max-w-lg mx-auto flex flex-col gap-8">
      <!-- BPM display with editable input -->
      <div class="text-center">
        <input
          type="number"
          min="40"
          max="240"
          [value]="bpm()"
          (change)="onBpmDirectInput($event)"
          class="w-full text-9xl font-mono font-bold text-text-primary tabular-nums leading-none
                 text-center bg-transparent border-b border-fret-line focus:border-note-root
                 focus:outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none
                 [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
        />
        <div class="text-xs text-text-muted mt-1 uppercase tracking-wider">
          {{ 'metronome.bpm' | transloco }}
        </div>
      </div>

      <!-- Beat indicators -->
      <div class="flex justify-center gap-2.5">
        @for (beat of beatDots(); track beat) {
          <div
            class="w-4 h-4 rounded-full transition-all duration-75"
            [class.scale-150]="currentBeat() === beat"
            [style.background-color]="beatColor(beat)"
          ></div>
        }
      </div>

      <!-- Slider with -/+ -->
      <div>
        <div class="flex items-center gap-2">
          <button
            class="w-9 h-9 shrink-0 rounded-full border border-fret-line text-text-secondary text-lg
                   hover:bg-fret-line/30 active:bg-fret-line/50 transition-colors"
            (click)="adjustBpm(-5)"
          >&minus;</button>
          <input
            type="range"
            min="40"
            max="240"
            step="1"
            [value]="bpm()"
            (input)="onBpmInput($event)"
            class="flex-1 accent-note-root"
          />
          <button
            class="w-9 h-9 shrink-0 rounded-full border border-fret-line text-text-secondary text-lg
                   hover:bg-fret-line/30 active:bg-fret-line/50 transition-colors"
            (click)="adjustBpm(5)"
          >+</button>
        </div>
        <div class="flex justify-between text-xs text-text-muted mt-1 px-11">
          <span>40</span>
          <span>240</span>
        </div>
      </div>

      <!-- Controls row: tap, play, time signature -->
      <div class="flex items-center justify-center gap-5">
        <!-- Time signature -->
        <select
          class="bg-bg-fretboard text-text-primary border border-fret-line rounded-full px-3 py-1.5 text-sm text-center"
          (change)="onTimeSignatureChange($event)"
        >
          @for (ts of timeSignatures; track ts) {
            <option
              [value]="ts[0] + '/' + ts[1]"
              [selected]="ts[0] === timeSignature()[0] && ts[1] === timeSignature()[1]"
            >
              {{ ts[0] }}/{{ ts[1] }}
            </option>
          }
        </select>

        <!-- Play / Stop -->
        <button
          class="relative w-14 h-14 rounded-full border-2 transition-colors flex items-center justify-center shrink-0"
          [class]="isPlaying()
            ? 'border-note-root text-note-root'
            : 'border-fret-line text-text-secondary hover:border-text-muted'"
          (click)="toggle()"
        >
          @if (isPlaying()) {
            <span class="absolute inset-0 rounded-full border-2 border-note-root animate-ping opacity-20"></span>
            <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>
          } @else {
            <svg class="w-5 h-5 fill-current ml-0.5" viewBox="0 0 24 24"><polygon points="6,4 20,12 6,20"/></svg>
          }
        </button>

        <!-- Tap tempo -->
        <button
          class="px-4 py-1.5 text-sm rounded-full border border-fret-line
                 hover:bg-fret-line/30 active:bg-fret-line/50 transition-colors"
          (click)="tapTempo()"
        >
          {{ 'metronome.tap' | transloco }}*
        </button>
      </div>

      <!-- Tap hint footnote -->
      <div class="text-[10px] text-text-muted text-center">
        *{{ 'metronome.tapHint' | transloco }}
      </div>
    </div>
  `,
})
export class MetronomeComponent {
  private readonly audioService = inject(AudioService);
  private readonly storage = inject(StorageService);
  private readonly destroyRef = inject(DestroyRef);

  readonly timeSignatures = TIME_SIGNATURES;

  readonly bpm = signal(this.storage.get<number>('metronomeBpm', 120));
  readonly timeSignature = signal<TimeSignature>(
    this.storage.get<TimeSignature>('metronomeTs', [4, 4]),
  );
  readonly isPlaying = signal(false);
  readonly currentBeat = signal(-1);

  readonly beatDots = computed(() =>
    Array.from({ length: this.timeSignature()[0] }, (_, i) => i),
  );

  private scheduleTimer: ReturnType<typeof setInterval> | null = null;
  private nextNoteTime = 0;
  private currentBeatIndex = 0;
  private readonly LOOKAHEAD = 0.1;
  private readonly SCHEDULE_FREQ = 25;
  private tapTimes: number[] = [];
  private arrowHoldStart = 0;
  private arrowRepeatTimer: ReturnType<typeof setInterval> | null = null;
  private activeArrowDir: number = 0;

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.stop();
      this.clearArrowRepeat();
    });
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(e: KeyboardEvent): void {
    if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'SELECT') return;

    if (e.code === 'Space') {
      e.preventDefault();
      this.toggle();
      return;
    }

    const dir = (e.code === 'ArrowUp' || e.code === 'ArrowRight') ? 1
              : (e.code === 'ArrowDown' || e.code === 'ArrowLeft') ? -1
              : 0;
    if (!dir || e.repeat) return;
    e.preventDefault();

    this.activeArrowDir = dir;
    this.arrowHoldStart = Date.now();
    this.adjustBpm(dir);

    this.arrowRepeatTimer = setInterval(() => {
      const held = Date.now() - this.arrowHoldStart;
      const step = held > ACCEL_THRESHOLD_MS * 3 ? 10
                 : held > ACCEL_THRESHOLD_MS ? 5
                 : 1;
      this.adjustBpm(this.activeArrowDir * step);
    }, ACCEL_INTERVAL_MS);
  }

  @HostListener('window:keyup', ['$event'])
  onKeyUp(e: KeyboardEvent): void {
    const dir = (e.code === 'ArrowUp' || e.code === 'ArrowRight') ? 1
              : (e.code === 'ArrowDown' || e.code === 'ArrowLeft') ? -1
              : 0;
    if (dir && dir === this.activeArrowDir) {
      this.clearArrowRepeat();
    }
  }

  toggle(): void {
    if (this.isPlaying()) {
      this.stop();
    } else {
      this.start();
    }
  }

  adjustBpm(delta: number): void {
    const value = Math.max(40, Math.min(240, this.bpm() + delta));
    this.bpm.set(value);
    this.storage.set('metronomeBpm', value);
  }

  onBpmInput(event: Event): void {
    const value = parseInt((event.target as HTMLInputElement).value, 10);
    this.bpm.set(value);
    this.storage.set('metronomeBpm', value);
  }

  onBpmDirectInput(event: Event): void {
    const raw = parseInt((event.target as HTMLInputElement).value, 10);
    if (isNaN(raw)) return;
    const value = Math.max(40, Math.min(240, raw));
    this.bpm.set(value);
    this.storage.set('metronomeBpm', value);
    (event.target as HTMLInputElement).value = String(value);
  }

  onTimeSignatureChange(event: Event): void {
    const [beats, noteValue] = (event.target as HTMLSelectElement).value.split('/').map(Number);
    const ts: TimeSignature = [beats, noteValue];
    this.timeSignature.set(ts);
    this.storage.set('metronomeTs', ts);
    if (this.isPlaying()) {
      this.stop();
      this.start();
    }
  }

  tapTempo(): void {
    const now = Date.now();
    this.tapTimes.push(now);
    // Keep only taps within last 2 seconds
    this.tapTimes = this.tapTimes.filter((t) => now - t < TAP_WINDOW_MS);
    if (this.tapTimes.length >= 2) {
      const intervals: number[] = [];
      for (let i = 1; i < this.tapTimes.length; i++) {
        intervals.push(this.tapTimes[i] - this.tapTimes[i - 1]);
      }
      const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const bpm = Math.round(MS_PER_MINUTE / avg);
      const clamped = Math.max(40, Math.min(240, bpm));
      this.bpm.set(clamped);
      this.storage.set('metronomeBpm', clamped);
    }
  }

  beatColor(beat: number): string {
    const active = this.currentBeat() === beat;
    if (active && beat === 0) return 'var(--color-note-root)';
    if (active) return 'var(--color-text-primary)';
    if (beat === 0) return 'var(--color-note-root-dim, rgba(255, 68, 68, 0.3))';
    return 'var(--color-fret-line)';
  }

  private clearArrowRepeat(): void {
    if (this.arrowRepeatTimer !== null) {
      clearInterval(this.arrowRepeatTimer);
      this.arrowRepeatTimer = null;
    }
    this.activeArrowDir = 0;
  }

  private start(): void {
    const ctx = this.audioService.getAudioContext();
    this.currentBeatIndex = 0;
    this.nextNoteTime = ctx.currentTime;
    this.isPlaying.set(true);

    this.scheduleTimer = setInterval(() => this.scheduleNotes(), this.SCHEDULE_FREQ);
  }

  private stop(): void {
    if (this.scheduleTimer !== null) {
      clearInterval(this.scheduleTimer);
      this.scheduleTimer = null;
    }
    this.isPlaying.set(false);
    this.currentBeat.set(-1);
  }

  private scheduleNotes(): void {
    const ctx = this.audioService.getAudioContext();
    while (this.nextNoteTime < ctx.currentTime + this.LOOKAHEAD) {
      const isAccent = this.currentBeatIndex === 0;
      this.scheduleClick(this.nextNoteTime, isAccent);

      const beatIndex = this.currentBeatIndex;
      const delayMs = Math.max(0, (this.nextNoteTime - ctx.currentTime) * 1000);
      setTimeout(() => this.currentBeat.set(beatIndex), delayMs);

      this.advanceBeat();
    }
  }

  private scheduleClick(time: number, isAccent: boolean): void {
    const ctx = this.audioService.getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.value = isAccent ? ACCENT_FREQ : NORMAL_FREQ;

    gain.gain.setValueAtTime(CLICK_GAIN, time);
    gain.gain.exponentialRampToValueAtTime(GAIN_FLOOR, time + CLICK_DURATION);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.onended = () => { osc.disconnect(); gain.disconnect(); };

    osc.start(time);
    osc.stop(time + CLICK_DURATION);
  }

  private advanceBeat(): void {
    const beatsPerMeasure = this.timeSignature()[0];
    const noteValue = this.timeSignature()[1];
    // For x/8 time signatures, each beat is an eighth note
    const secondsPerBeat = noteValue === 8
      ? SECONDS_PER_MINUTE_EIGHTH / this.bpm()
      : SECONDS_PER_MINUTE / this.bpm();

    this.nextNoteTime += secondsPerBeat;
    this.currentBeatIndex = (this.currentBeatIndex + 1) % beatsPerMeasure;
  }
}
