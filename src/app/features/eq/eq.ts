import { Component, inject, signal } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { AudioService } from '../../core/services/audio.service';
import { EqSettings } from '../../core/models/eq.model';
import { EQ_PRESETS, FREQUENCY_BANDS } from '../../core/data/eq-presets.data';

@Component({
  selector: 'app-eq',
  imports: [UpperCasePipe],
  templateUrl: './eq.html',
})
export class EqComponent {
  private readonly audioService = inject(AudioService);

  readonly presets = EQ_PRESETS;
  readonly bands = FREQUENCY_BANDS;

  readonly eq = signal<EqSettings>({
    low: 0,
    lowMid: 0,
    highMid: 0,
    high: 0,
    gain: 0.5,
  });

  readonly isPlaying = signal(false);

  applyPreset(id: string): void {
    const preset = this.presets.find((p) => p.id === id);
    if (preset) {
      this.eq.set({ ...preset.settings });
    }
  }

  updateBand(band: keyof EqSettings, event: Event): void {
    const value = parseFloat((event.target as HTMLInputElement).value);
    this.eq.update((s) => ({ ...s, [band]: value }));
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
