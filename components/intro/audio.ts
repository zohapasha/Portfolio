/**
 * Synthesised typewriter audio. No asset files: each keystroke is a short
 * band-passed noise burst, so there is nothing to download and nothing to fail.
 *
 * The AudioContext is created lazily inside the user's click on the sound
 * toggle — browsers block audio that starts without a gesture, and the intro
 * autoplays, so sound is opt-in by construction rather than by preference.
 */

let seed = 0;
function jitter() {
  seed += 1;
  const v = Math.sin(seed * 91.7) * 43758.5453;
  return v - Math.floor(v);
}

export type TypeAudio = {
  resume: () => void;
  key: () => void;
  ret: () => void;
  stop: () => void;
};

export function createTypeAudio(): TypeAudio {
  let ctx: AudioContext | null = null;
  let noise: AudioBuffer | null = null;
  let bed: GainNode | null = null;

  const ensure = () => {
    if (ctx) return ctx;
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();

    const length = Math.floor(ctx.sampleRate * 0.06);
    noise = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = noise.getChannelData(0);
    for (let i = 0; i < length; i++) {
      // Decaying noise: the sharp attack is what reads as a key strike.
      data[i] = (jitter() * 2 - 1) * Math.pow(1 - i / length, 2.5);
    }

    // A barely-there room tone under the whole sequence.
    const drone = ctx.createOscillator();
    drone.type = "sine";
    drone.frequency.value = 54;
    bed = ctx.createGain();
    bed.gain.value = 0.022;
    drone.connect(bed);
    bed.connect(ctx.destination);
    drone.start();

    return ctx;
  };

  const burst = (freq: number, level: number, decay: number) => {
    const c = ensure();
    if (!c || !noise) return;
    const src = c.createBufferSource();
    src.buffer = noise;

    const band = c.createBiquadFilter();
    band.type = "bandpass";
    band.frequency.value = freq;
    band.Q.value = 1.2;

    const gain = c.createGain();
    const t = c.currentTime;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(level, t + 0.003);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + decay);

    src.connect(band);
    band.connect(gain);
    gain.connect(c.destination);
    src.start(t);
    src.stop(t + decay + 0.02);
  };

  return {
    resume() {
      const c = ensure();
      if (c && c.state === "suspended") void c.resume();
    },
    key() {
      burst(1250 + jitter() * 1100, 0.075, 0.055);
    },
    ret() {
      // Lower and longer — the carriage coming back at the end of a line.
      burst(320 + jitter() * 120, 0.1, 0.16);
    },
    stop() {
      if (bed) bed.gain.value = 0;
      void ctx?.close();
      ctx = null;
      noise = null;
      bed = null;
    },
  };
}
