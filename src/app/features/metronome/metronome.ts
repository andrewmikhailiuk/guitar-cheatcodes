import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
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

@Component({
  selector: 'app-metronome',
  imports: [TranslocoModule],
  template: `
    <div class="p-4 max-w-md mx-auto">
      <!-- BPM display -->
      <div class="text-center mb-6">
        <div class="text-6xl font-mono font-bold text-text-primary tabular-nums">
          {{ bpm() }}
        </div>
        <div class="text-sm text-gray-400 mt-1">{{ 'metronome.bpm' | transloco }}</div>
      </div>

      <!-- BPM slider -->
      <div class="mb-6">
        <input
          type="range"
          min="40"
          max="240"
          step="1"
          [value]="bpm()"
          (input)="onBpmInput($event)"
          class="w-full accent-note-root"
        />
        <div class="flex justify-between text-xs text-gray-500 mt-1">
          <span>40</span>
          <span>240</span>
        </div>
      </div>

      <!-- Beat dots -->
      <div class="flex justify-center gap-3 mb-6">
        @for (beat of beatDots(); track beat) {
          <div
            class="w-5 h-5 rounded-full transition-all duration-75"
            [style.background-color]="beatColor(beat)"
          ></div>
        }
      </div>

      <!-- Controls -->
      <div class="flex flex-wrap gap-3 items-center justify-center mb-6">
        <!-- Time signature -->
        <div>
          <label class="block text-xs text-gray-400 mb-1">{{ 'metronome.timeSignature' | transloco }}</label>
          <select
            class="bg-bg-fretboard text-text-primary border border-fret-line rounded px-3 py-2 text-sm"
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
        </div>

        <!-- Start/Stop -->
        <button
          class="px-6 py-2 text-sm rounded border transition-colors"
          [class]="isPlaying()
            ? 'border-note-root bg-note-root/20 text-note-root'
            : 'border-fret-line hover:bg-fret-line'"
          (click)="toggle()"
        >
          {{ isPlaying() ? ('metronome.stop' | transloco) : ('metronome.start' | transloco) }}
        </button>

        <!-- Tap tempo -->
        <button
          class="px-6 py-2 text-sm rounded border border-fret-line hover:bg-fret-line transition-colors"
          (click)="tapTempo()"
        >
          {{ 'metronome.tap' | transloco }}
        </button>
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

  constructor() {
    this.destroyRef.onDestroy(() => this.stop());
  }

  toggle(): void {
    if (this.isPlaying()) {
      this.stop();
    } else {
      this.start();
    }
  }

  onBpmInput(event: Event): void {
    const value = parseInt((event.target as HTMLInputElement).value, 10);
    this.bpm.set(value);
    this.storage.set('metronomeBpm', value);
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
