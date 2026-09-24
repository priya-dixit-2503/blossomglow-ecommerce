// Web Audio API procedural sound synthesizer for BlossomGlow
// Generates warm, organic candle sounds: match strike, wood wick crackles, ambient resonance

class AmbientAudioManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isAtmospherePlaying: boolean = false;
  private crackleInterval: number | null = null;
  private rainNode: AudioNode | null = null;
  private windNode: AudioNode | null = null;
  private bowlOsc: OscillatorNode | null = null;
  private gainMaster: GainNode | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.gainMaster = this.ctx.createGain();
      this.gainMaster.gain.value = 0.6;
      this.gainMaster.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play subtle match strike & light effect
  playMatchStrike() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx || !this.gainMaster) return;

      const now = this.ctx.currentTime;
      // White noise burst for the match friction
      const bufferSize = this.ctx.sampleRate * 0.15;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, now);
      filter.Q.setValueAtTime(3, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.gainMaster);

      whiteNoise.start(now);

      // Followed by a gentle warm whoosh of flame ignition
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(160, now + 0.05);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.25);
      oscGain.gain.setValueAtTime(0.2, now + 0.05);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(oscGain);
      oscGain.connect(this.gainMaster);
      osc.start(now + 0.05);
      osc.stop(now + 0.3);
    } catch {
      // Audio autoplay policies or unsupported browser
    }
  }

  // Gentle crackle of an authentic FSC wooden wick
  playSingleCrackle() {
    if (this.isMuted || !this.ctx || !this.gainMaster) return;
    const now = this.ctx.currentTime;
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.03);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.15));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(2200 + Math.random() * 1200, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.08 + Math.random() * 0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.gainMaster);
    noise.start(now);
  }

  // Soft tactile click for add-to-cart or button actions
  playSoftClick() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx || !this.gainMaster) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(260, now + 0.06);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(this.gainMaster);
      osc.start(now);
      osc.stop(now + 0.06);
    } catch {
      // Ignore
    }
  }

  // Tibetan Singing Bowl chime
  playSingingBowl() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx || !this.gainMaster) return;
      const now = this.ctx.currentTime;
      const fundamental = 392.0; // G4 warm resonance

      [1, 2.76, 5.4].forEach((ratio, idx) => {
        if (!this.ctx || !this.gainMaster) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(fundamental * ratio, now);

        const volume = (0.15 / (idx + 1));
        gain.gain.setValueAtTime(volume, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.5);

        osc.connect(gain);
        gain.connect(this.gainMaster);
        osc.start(now);
        osc.stop(now + 3.5);
      });
    } catch {
      // Ignore
    }
  }

  // Start continuous crackling wood wick atmosphere
  startAtmosphere(type: 'crackle' | 'rain' | 'hearth' | 'breeze') {
    this.initContext();
    this.stopAtmosphere();
    this.isAtmospherePlaying = true;

    if (type === 'crackle' || type === 'hearth') {
      const scheduleCrackle = () => {
        if (!this.isAtmospherePlaying) return;
        this.playSingleCrackle();
        const delay = Math.random() * (type === 'hearth' ? 180 : 350) + 60;
        this.crackleInterval = window.setTimeout(scheduleCrackle, delay);
      };
      scheduleCrackle();
    } else if (type === 'breeze') {
      // Gentle soft wind noise
      try {
        if (!this.ctx || !this.gainMaster) return;
        const bufferSize = this.ctx.sampleRate * 2;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          data[i] = (lastOut + 0.02 * white) / 1.02;
          lastOut = data[i];
          data[i] *= 1.5;
        }

        const source = this.ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(280, this.ctx.currentTime);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.12, this.ctx.currentTime);

        source.connect(filter);
        filter.connect(gain);
        gain.connect(this.gainMaster);
        source.start();

        this.windNode = source;
      } catch {
        // Ignore
      }
    }
  }

  stopAtmosphere() {
    this.isAtmospherePlaying = false;
    if (this.crackleInterval) {
      clearTimeout(this.crackleInterval);
      this.crackleInterval = null;
    }
    if (this.windNode) {
      try {
        (this.windNode as AudioScheduledSourceNode).stop();
      } catch {
        // Ignore
      }
      this.windNode = null;
    }
  }

  setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.gainMaster && this.ctx) {
      this.gainMaster.gain.setValueAtTime(muted ? 0 : 0.6, this.ctx.currentTime);
    }
    if (muted) {
      this.stopAtmosphere();
    }
  }

  getIsAtmospherePlaying() {
    return this.isAtmospherePlaying;
  }
}

export const ambientAudio = new AmbientAudioManager();
