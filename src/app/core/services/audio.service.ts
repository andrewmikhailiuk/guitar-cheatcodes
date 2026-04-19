import { Injectable } from '@angular/core';
import { EqSettings } from '../models/eq.model';
import { Riff } from '../data/riffs.data';
import { FREQUENCY_BANDS } from '../data/eq-presets.data';
import { midiToFrequency } from '../utils/music.utils';

const GAIN_FLOOR = 0.001;
const MASTER_GAIN = 0.4;
const DISTORTION_CURVE_SAMPLES = 256;
const DISTORTION_MULTIPLIER = 50;

@Injectable({ providedIn: 'root' })
export class AudioService {
  private ctx: AudioContext | null = null;
  private riffTimeout: ReturnType<typeof setTimeout> | null = null;
  private activeNodes: AudioNode[] = [];

  private getContext(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  playNote(frequency: number, durationMs = 300): void {
    const ctx = this.getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.value = frequency;

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(
      GAIN_FLOOR,
      ctx.currentTime + durationMs / 1000,
    );

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.onended = () => { osc.disconnect(); gain.disconnect(); };
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + durationMs / 1000);
  }

  playTestRiff(eq: EqSettings, riff: Riff, onEnd?: () => void): void {
    this.stopTestRiff();

    const ctx = this.getContext();

    // Build EQ + distortion chain
    const distortion = ctx.createWaveShaper();
    distortion.curve = this.makeDistortionCurve(eq.gain);

    const filters = FREQUENCY_BANDS.map((band, i) =>
      this.makePeakingFilter(ctx, band.frequency, eq.bands[i]),
    );

    const master = ctx.createGain();
    master.gain.value = MASTER_GAIN;

    // Chain: distortion → filter[0] → ... → filter[n] → master → destination
    distortion.connect(filters[0]);
    for (let i = 0; i < filters.length - 1; i++) {
      filters[i].connect(filters[i + 1]);
    }
    filters[filters.length - 1].connect(master);
    master.connect(ctx.destination);

    this.activeNodes = [distortion, ...filters, master];

    const playAt = (index: number) => {
      if (index >= riff.notes.length) {
        this.stopTestRiff();
        onEnd?.();
        return;
      }

      const note = riff.notes[index];

      if (note >= 0) {
        const osc = ctx.createOscillator();
        const env = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.value = midiToFrequency(note);

        const duration = riff.noteDurationMs / 1000;
        env.gain.setValueAtTime(0, ctx.currentTime);
        env.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.005);
        env.gain.exponentialRampToValueAtTime(GAIN_FLOOR, ctx.currentTime + duration * 0.8);

        osc.connect(env);
        env.connect(distortion);
        this.activeNodes.push(osc, env);
        osc.onended = () => { osc.disconnect(); env.disconnect(); };

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + duration);
      }

      this.riffTimeout = setTimeout(() => playAt(index + 1), riff.intervalMs);
    };

    playAt(0);
  }

  stopTestRiff(): void {
    if (this.riffTimeout !== null) {
      clearTimeout(this.riffTimeout);
      this.riffTimeout = null;
    }
    for (const node of this.activeNodes) {
      node.disconnect();
    }
    this.activeNodes = [];
  }

  getAudioContext(): AudioContext {
    return this.getContext();
  }

  private makePeakingFilter(
    ctx: AudioContext,
    frequency: number,
    gainDb: number,
  ): BiquadFilterNode {
    const filter = ctx.createBiquadFilter();
    filter.type = 'peaking';
    filter.frequency.value = frequency;
    filter.Q.value = 1;
    filter.gain.value = gainDb;
    return filter;
  }

  private makeDistortionCurve(amount: number): Float32Array<ArrayBuffer> {
    const curve = new Float32Array(DISTORTION_CURVE_SAMPLES) as Float32Array<ArrayBuffer>;
    const k = amount * DISTORTION_MULTIPLIER;

    for (let i = 0; i < DISTORTION_CURVE_SAMPLES; i++) {
      const x = (i * 2) / DISTORTION_CURVE_SAMPLES - 1;
      curve[i] = Math.tanh(k * x);
    }

    return curve;
  }
}
