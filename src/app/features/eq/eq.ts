import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { AudioService } from '../../core/services/audio.service';
import { StorageService } from '../../core/services/storage.service';
import { EqSettings } from '../../core/models/eq.model';
import { EQ_PRESETS, FREQUENCY_BANDS } from '../../core/data/eq-presets.data';

const DEFAULT_EQ: EqSettings = { low: 0, lowMid: 0, highMid: 0, high: 0, gain: 0.5 };

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

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.audioService.stopTestRiff();
      this.isPlaying.set(false);
    });
  }

  ngOnInit(): void {
    this.eq.set(this.storage.get<EqSettings>('eqSettings', DEFAULT_EQ));
  }

  applyPreset(id: string): void {
    const preset = this.presets.find((p) => p.id === id);
    if (preset) {
      this.eq.set({ ...preset.settings });
      this.storage.set('eqSettings', preset.settings);
    }
  }

  updateBand(band: keyof EqSettings, event: Event): void {
    const value = parseFloat((event.target as HTMLInputElement).value);
    this.eq.update((s) => {
      const next = { ...s, [band]: value };
      this.storage.set('eqSettings', next);
      return next;
    });
  }

  togglePlay(): void {
    if (this.isPlaying()) {
      this.audioService.stopTestRiff();
      this.isPlaying.set(false);
    } else {
      this.audioService.playTestRiff(this.eq());
      this.isPlaying.set(true);
    }
  }
}
