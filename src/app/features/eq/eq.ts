import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { AudioService } from '../../core/services/audio.service';
import { StorageService } from '../../core/services/storage.service';
import { EqPreset, EqSettings } from '../../core/models/eq.model';
import { EQ_PRESETS, FREQUENCY_BANDS } from '../../core/data/eq-presets.data';

const BAND_COUNT = FREQUENCY_BANDS.length;
const DEFAULT_EQ: EqSettings = { bands: new Array(BAND_COUNT).fill(0), gain: 0.5 };

@Component({
  selector: 'app-eq',
  imports: [TranslocoModule],
  templateUrl: './eq.html',
})
export class EqComponent implements OnInit {
  private readonly audioService = inject(AudioService);
  private readonly storage = inject(StorageService);
  private readonly destroyRef = inject(DestroyRef);

  readonly presets = EQ_PRESETS;
  readonly bands = FREQUENCY_BANDS;

  readonly eq = signal<EqSettings>(DEFAULT_EQ);
  readonly isPlaying = signal(false);
  readonly activePreset = signal<EqPreset | null>(null);

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.audioService.stopTestRiff();
      this.isPlaying.set(false);
    });
  }

  ngOnInit(): void {
    const saved = this.storage.get<EqSettings>('eqSettings', DEFAULT_EQ);
    if (!Array.isArray(saved.bands) || saved.bands.length !== BAND_COUNT) {
      this.eq.set(DEFAULT_EQ);
    } else {
      this.eq.set(saved);
    }
  }

  applyPreset(id: string): void {
    const preset = this.presets.find((p) => p.id === id);
    if (preset) {
      this.eq.set({ ...preset.settings, bands: [...preset.settings.bands] });
      this.storage.set('eqSettings', preset.settings);
      this.activePreset.set(preset.descriptionKey ? preset : null);
    }
  }

  updateBand(index: number, event: Event): void {
    const value = parseFloat((event.target as HTMLInputElement).value);
    this.eq.update((s) => {
      const bands = [...s.bands];
      bands[index] = value;
      const next = { ...s, bands };
      this.storage.set('eqSettings', next);
      return next;
    });
  }

  updateGain(event: Event): void {
    const value = parseFloat((event.target as HTMLInputElement).value);
    this.eq.update((s) => {
      const next = { ...s, gain: value };
      this.storage.set('eqSettings', next);
      return next;
    });
  }

  togglePlay(): void {
    if (this.isPlaying()) {
      this.audioService.stopTestRiff();
      this.isPlaying.set(false);
    } else {
      this.audioService.playTestRiff(this.eq(), () => this.isPlaying.set(false));
      this.isPlaying.set(true);
    }
  }
}
