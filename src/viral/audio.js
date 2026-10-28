// Viral videolar için koddan üretilen ses: 120 BPM ritim, geri sayımda saat tıkırtısı,
// cevapta zil + "whoosh". Önizlemede AudioContext, MP4'te OfflineAudioContext kullanılır.
import { mulberry32 } from '../presets.js';
import { T } from './script.js';
import { encodeWav } from '../music.js';

const BEAT = 0.5;
const midi = (n) => 440 * Math.pow(2, (n - 69) / 12);
// Am – F – C – G (gerilimli ama neşeli)
const CHORDS = [[45, 48, 52], [41, 45, 48], [48, 52, 55], [43, 47, 50]];

export function scheduleViral(ac, dest, script, when0 = 0, offset = 0) {
  const D = script.duration;
  const master = ac.createGain();
  master.gain.value = 0.7;
  const comp = ac.createDynamicsCompressor();
  comp.threshold.value = -12;
  comp.ratio.value = 6;
  master.connect(comp).connect(dest);
  const len = ac.sampleRate;
  const noise = ac.createBuffer(1, len, ac.sampleRate);
  const r = mulberry32(7);
  const nd = noise.getChannelData(0);
  for (let i = 0; i < len; i++) nd[i] = r() * 2 - 1;
  const at = (x) => when0 + x - offset;
  const ok = (x) => x >= offset - 0.001 && x < D;
  const env = (g, x, a, peak, d) => {
    g.gain.setValueAtTime(0.0001, at(x));
    g.gain.exponentialRampToValueAtTime(peak, at(x) + a);
    g.gain.exponentialRampToValueAtTime(0.0001, at(x) + a + d);
  };
  const tone = (x, f, type, peak, d, cutoff = 3000) => {
    if (!ok(x)) return;
    const o = ac.createOscillator(), fl = ac.createBiquadFilter(), g = ac.createGain();
    o.type = type;
    o.frequency.value = f;
    fl.type = 'lowpass';
    fl.frequency.value = cutoff;
    env(g, x, 0.005, peak, d);
    o.connect(fl).connect(g).connect(master);
    o.start(at(x));
    o.stop(at(x) + d + 0.05);
  };
  const hit = (x, type, f, peak, d, q = 1) => {
    if (!ok(x)) return;
    const s = ac.createBufferSource(), fl = ac.createBiquadFilter(), g = ac.createGain();
    s.buffer = noise;
    fl.type = type;
    fl.frequency.value = f;
    fl.Q.value = q;
    env(g, x, 0.002, peak, d);
    s.connect(fl).connect(g).connect(master);
    s.start(at(x), (x * 3.7) % 0.5);
    s.stop(at(x) + d + 0.05);
  };
  const kick = (x, v = 1) => {
    if (!ok(x)) return;
    const o = ac.createOscillator(), g = ac.createGain();
    o.frequency.setValueAtTime(150, at(x));
    o.frequency.exponentialRampToValueAtTime(42, at(x) + 0.14);
    env(g, x, 0.004, 0.85 * v, 0.28);
    o.connect(g).connect(master);
    o.start(at(x));
    o.stop(at(x) + 0.35);
  };
  const whoosh = (x) => {
    if (!ok(x)) return;
    const s = ac.createBufferSource(), fl = ac.createBiquadFilter(), g = ac.createGain();
    s.buffer = noise;
    fl.type = 'bandpass';
    fl.Q.value = 2;
    fl.frequency.setValueAtTime(300, at(x));
    fl.frequency.exponentialRampToValueAtTime(5000, at(x) + 0.4);
    g.gain.setValueAtTime(0.0001, at(x));
    g.gain.exponentialRampToValueAtTime(0.3, at(x) + 0.25);
    g.gain.exponentialRampToValueAtTime(0.0001, at(x) + 0.5);
    s.connect(fl).connect(g).connect(master);
    s.start(at(x));
    s.stop(at(x) + 0.55);
  };
  const tick = (x, hi) => {
    tone(x, hi ? 1800 : 1400, 'square', hi ? 0.12 : 0.07, 0.04, 6000);
    hit(x, 'highpass', 4000, 0.08, 0.03);
  };
  const ding = (x) => [1046.5, 1318.5, 1568, 2093].forEach((f, i) => tone(x + i * 0.07, f, 'triangle', 0.16, 0.6, 9000));
  const pop = (x, f0 = 600) => {
    if (!ok(x)) return;
    const o = ac.createOscillator(), g = ac.createGain();
    o.frequency.setValueAtTime(f0, at(x));
    o.frequency.exponentialRampToValueAtTime(f0 * 2.2, at(x) + 0.08);
    env(g, x, 0.003, 0.3, 0.12);
    o.connect(g).connect(master);
    o.start(at(x));
    o.stop(at(x) + 0.2);
  };

  // geri sayım aralıkları: bu sürelerde bas ve davul susar, sadece tıkırtı kalır
  const quiet = [];
  const starts = [];
  if (script.format === 'quiz') {
    script.rounds.forEach((_, i) => {
      const r0 = T.intro + i * T.round;
      starts.push(r0);
      quiet.push([r0 + T.timerStart, r0 + T.revealAt]);
      for (let k = 0; k < T.timerLen * 2; k++) tick(r0 + T.timerStart + k * 0.5, k % 2 === 0);
      ding(r0 + T.revealAt);
      kick(r0 + T.revealAt, 1.2);
      [0.75, 0.85, 0.95, 1.05].forEach((d, k) => pop(r0 + d, 520 + k * 90)); // şıklar beliriyor
    });
    starts.push(T.intro + script.rounds.length * T.round);
    starts.forEach((x) => whoosh(x - 0.35));
    kick(0.45, 1.3); // kanca vuruşu
    hit(0.45, 'lowpass', 900, 0.4, 0.3);
  } else if (script.format === 'story') {
    pop(0.5, 700);
    pop(1.1, 900);
  } else {
    kick(0.35, 1.3);
    hit(0.35, 'lowpass', 900, 0.4, 0.3);
    ding(1.0);
    pop(2.4, 800);
  }
  const isQuiet = (x) => quiet.some(([a, b]) => x >= a && x < b);

  const bars = Math.ceil(D / (BEAT * 4));
  for (let b = 0; b < bars; b++) {
    const ch = CHORDS[b % 4];
    for (let st = 0; st < 8; st++) {
      const x = b * BEAT * 4 + (st * BEAT) / 2;
      if (x >= D) break;
      const q = isQuiet(x);
      const n = st % 4 === 3 ? ch[0] + 36 : ch[st % 3] + 24;
      tone(x, midi(n), 'square', q ? 0.02 : 0.04, 0.16, 2400);
      if (script.format === 'story') continue; // story: sakin arka plan
      if (st % 2 === 1) hit(x, 'highpass', 7500, q ? 0.04 : 0.09, 0.05);
      if (q) continue;
      tone(x, midi((st === 3 || st === 7 ? ch[0] + 12 : ch[0]) - 12), 'triangle', 0.28, 0.2, 900);
      if (st % 2 === 0) kick(x);
      if (st === 2 || st === 6) hit(x, 'bandpass', 1800, 0.3, 0.15, 0.8);
    }
  }
  master.gain.setValueAtTime(0.7, Math.max(at(D - 0.5), when0));
  master.gain.linearRampToValueAtTime(0.0001, Math.max(at(D), when0 + 0.01));
  return master;
}

export async function renderViralWav(script, sampleRate = 48000) {
  const ac = new OfflineAudioContext(2, Math.ceil(sampleRate * script.duration), sampleRate);
  scheduleViral(ac, ac.destination, script, 0, 0);
  return encodeWav(await ac.startRendering());
}
