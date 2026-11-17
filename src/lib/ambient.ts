/**
 * Música ambiente generativa con sonido 3D (Web Audio API).
 * ─────────────────────────────────────────────────────────────
 * No usa archivos ni canciones con derechos: se sintetiza en el navegador.
 *  · Un colchón de acordes muy suaves (Re mayor soñador) que tarda 10 s por acorde.
 *  · Dos fuentes del colchón giran alrededor tuyo (HRTF = sonido 3D, ideal con auriculares).
 *  · Notas sueltas tipo "campanita" que aparecen en puntos distintos del espacio.
 *  · El mouse corre un poco el sonido de izquierda a derecha.
 * ✏️  Volumen general: MASTER_VOLUME (0.05 = muy bajito).
 */
import { pointer } from "./motion";

const MASTER_VOLUME = 0.055;

const CHORDS = [
  [146.83, 220.0, 277.18, 329.63, 369.99], // Dmaj9
  [123.47, 185.0, 220.0, 277.18, 293.66], // Bm9
  [98.0, 146.83, 185.0, 246.94, 277.18], // Gmaj7(#11)
  [110.0, 164.81, 185.0, 246.94, 277.18], // A6(add9)
];
const SPARKLES = [587.33, 659.26, 739.99, 880.0, 987.77, 1174.66];
const CHORD_SECONDS = 10;

function impulse(ctx: AudioContext, seconds: number, decay: number) {
  const length = Math.floor(ctx.sampleRate * seconds);
  const buffer = ctx.createBuffer(2, length, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const data = buffer.getChannelData(ch);
    for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
  }
  return buffer;
}

export interface Ambient {
  start: () => Promise<void>;
  stop: () => void;
  dispose: () => void;
}

export function createAmbient(): Ambient {
  const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  const ctx = new Ctx({ latencyHint: "playback" });

  const master = ctx.createGain();
  master.gain.value = 0;
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -24;
  comp.ratio.value = 3;
  master.connect(comp).connect(ctx.destination);

  const reverb = ctx.createConvolver();
  reverb.buffer = impulse(ctx, 5, 2.6);
  const wet = ctx.createGain();
  wet.gain.value = 0.7;
  reverb.connect(wet).connect(master);

  const dry = ctx.createGain();
  dry.gain.value = 0.45;
  dry.connect(master);

  const makePanner = () => {
    const p = new PannerNode(ctx, {
      panningModel: "HRTF",
      distanceModel: "inverse",
      refDistance: 1.5,
      rolloffFactor: 0.6,
    });
    p.connect(dry);
    p.connect(reverb);
    return p;
  };

  // Colchón: dos fuentes que orbitan alrededor del oyente.
  const padPanners = [makePanner(), makePanner()];
  const padFilter = ctx.createBiquadFilter();
  padFilter.type = "lowpass";
  padFilter.frequency.value = 900;
  padFilter.Q.value = 0.4;
  const padSplit = [ctx.createGain(), ctx.createGain()];
  padSplit.forEach((g, i) => {
    g.gain.value = 0.5;
    padFilter.connect(g).connect(padPanners[i]);
  });
  // LFO lento sobre el filtro: el sonido "respira".
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.frequency.value = 0.05;
  lfoGain.gain.value = 350;
  lfo.connect(lfoGain).connect(padFilter.frequency);
  lfo.start();

  let chordIndex = 0;
  let chordTimer = 0;
  let sparkleTimer = 0;
  let moveFrame = 0;
  let running = false;

  const playChord = () => {
    const now = ctx.currentTime;
    const notes = CHORDS[chordIndex % CHORDS.length];
    chordIndex++;
    for (const freq of notes) {
      const env = ctx.createGain();
      env.gain.setValueAtTime(0, now);
      env.gain.linearRampToValueAtTime(0.11, now + 4);
      env.gain.setValueAtTime(0.11, now + CHORD_SECONDS - 1);
      env.gain.linearRampToValueAtTime(0, now + CHORD_SECONDS + 4);
      env.connect(padFilter);
      for (const [type, detune] of [
        ["sine", 0],
        ["triangle", 6],
      ] as const) {
        const osc = ctx.createOscillator();
        osc.type = type;
        osc.frequency.value = freq;
        osc.detune.value = detune + (Math.random() - 0.5) * 4;
        osc.connect(env);
        osc.start(now);
        osc.stop(now + CHORD_SECONDS + 4.2);
      }
    }
  };

  const playSparkle = () => {
    const now = ctx.currentTime;
    const panner = new PannerNode(ctx, { panningModel: "HRTF", distanceModel: "inverse", refDistance: 1.5, rolloffFactor: 0.5 });
    // Posición al azar en una esfera alrededor del oyente.
    const a = Math.random() * Math.PI * 2;
    const e = (Math.random() - 0.3) * 1.2;
    panner.positionX.value = Math.cos(a) * 3;
    panner.positionY.value = Math.sin(e) * 2;
    panner.positionZ.value = Math.sin(a) * 3;
    panner.connect(dry);
    panner.connect(reverb);
    const env = ctx.createGain();
    env.gain.setValueAtTime(0, now);
    env.gain.linearRampToValueAtTime(0.06, now + 0.02);
    env.gain.exponentialRampToValueAtTime(0.0001, now + 3.5);
    env.connect(panner);
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = SPARKLES[Math.floor(Math.random() * SPARKLES.length)];
    osc.connect(env);
    osc.start(now);
    osc.stop(now + 3.6);
    osc.onended = () => panner.disconnect();
  };

  const scheduleSparkle = () => {
    sparkleTimer = window.setTimeout(() => {
      if (!running) return;
      playSparkle();
      scheduleSparkle();
    }, 2500 + Math.random() * 4500);
  };

  // Las fuentes del colchón giran despacio; el mouse las corre un poco.
  const move = () => {
    const t = ctx.currentTime;
    const shift = pointer.active ? pointer.nx * 1.2 : 0;
    padPanners.forEach((p, i) => {
      const a = t * 0.12 + i * Math.PI;
      p.positionX.setTargetAtTime(Math.cos(a) * 2.5 + shift, t, 0.3);
      p.positionZ.setTargetAtTime(Math.sin(a) * 2.5, t, 0.3);
      p.positionY.setTargetAtTime(Math.sin(a * 0.5) * 0.6, t, 0.3);
    });
    moveFrame = requestAnimationFrame(move);
  };

  const onVisibility = () => {
    if (!running) return;
    if (document.hidden) void ctx.suspend();
    else void ctx.resume();
  };
  document.addEventListener("visibilitychange", onVisibility);

  return {
    async start() {
      if (running) return;
      running = true;
      await ctx.resume();
      const now = ctx.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(master.gain.value, now);
      master.gain.linearRampToValueAtTime(MASTER_VOLUME, now + 4);
      playChord();
      chordTimer = window.setInterval(playChord, CHORD_SECONDS * 1000);
      scheduleSparkle();
      move();
    },
    stop() {
      if (!running) return;
      running = false;
      const now = ctx.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(master.gain.value, now);
      master.gain.linearRampToValueAtTime(0, now + 0.8);
      window.clearInterval(chordTimer);
      window.clearTimeout(sparkleTimer);
      cancelAnimationFrame(moveFrame);
      window.setTimeout(() => !running && void ctx.suspend(), 900);
    },
    dispose() {
      running = false;
      window.clearInterval(chordTimer);
      window.clearTimeout(sparkleTimer);
      cancelAnimationFrame(moveFrame);
      document.removeEventListener("visibilitychange", onVisibility);
      void ctx.close();
    },
  };
}
