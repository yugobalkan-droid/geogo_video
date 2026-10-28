// Viral video motoru: 60 sn reklam motorunun (GeoGoVideo) çizim temellerini kullanır,
// 9:16 kısa quiz videoları ve anketli story'ler çizer. draw(t) yine saf fonksiyondur.
// Güvenli alanlar: üstte ~250 px (story profil çubuğu), altta ~360 px (yanıt çubuğu / Shorts arayüzü).
import { GeoGoVideo, clamp, lerp, prog, outCubic, inCubic, inOut, outBack, outElastic, mix, shade, rr, DISPLAY, BODY, NAVY, YELLOW } from '../engine.js';
import { gameById, SITE_URL } from '../games.js';
import { mulberry32 } from '../presets.js';
import { buildViral, T } from './script.js';
import { drawFlag, flagRatio } from './flags.js';

const EMOJI = "'Noto Color Emoji', 'Apple Color Emoji', 'Segoe UI Emoji'";
const VD = `${DISPLAY.replace(', system-ui, sans-serif', '')}, ${EMOJI}, system-ui, sans-serif`;
const VB = `'Nunito', ${EMOJI}, system-ui, sans-serif`;
const GREEN = '#22c55e';
const RED = '#ef4444';
const TYPE_COLOR = { flag: '#dc2626', plate: '#2563eb', emoji: '#db2777', vs: '#0d9488', tf: '#7c3aed', text: '#ea580c' };
const PALETTES = [
  ['#1e1b4b', '#6d28d9', '#db2777'],
  ['#0c1e4a', '#1d4ed8', '#0891b2'],
  ['#2e1065', '#7c3aed', '#f97316'],
];
const LEVEL_NAMES = ['KOLAY', 'ORTA', 'ZOR', 'ÇOK ZOR', 'DÂHİ'];
const LEVEL_COLORS = ['#22c55e', '#84cc16', '#f59e0b', '#f97316', '#ef4444'];

export class ViralVideo extends GeoGoVideo {
  async load(opts = {}) {
    this.canvas.width = this.W = 1080;
    this.canvas.height = this.H = 1920;
    this.u = 1;
    this.mode = 'port';
    this.format = '9x16';
    this.script = buildViral(opts);
    this.duration = this.script.duration;
    this.pal = PALETTES[this.script.palette];
    const base = opts.assetBase || new URL('../../assets/', import.meta.url).href;
    const load = (key, src) =>
      this.images[key]
        ? null
        : new Promise((res) => {
            const im = new Image();
            im.onload = () => res((this.images[key] = im));
            im.onerror = () => res(null);
            im.src = src;
          });
    const jobs = [1, 2, 3, 4].map((i) => load('geogo' + i, `${base}mascot/geogo${i}.webp`));
    const games = new Set(this.script.rounds.map((q) => q.game));
    for (const id of games) jobs.push(load(id, `${base}posters/${id}.webp`));
    if (document.fonts) {
      const sample = 'ĞÜŞİÖÇğüşıöç' + this.script.rounds.map((q) => q.emoji || '').join('') + '🔥🧠😳👇👆🔗👑🤔✓';
      jobs.push(
        Promise.all([
          document.fonts.load(`800 100px 'Baloo 2'`, 'ĞÜŞİÖÇğüşıöç'),
          document.fonts.load(`800 100px 'Nunito'`, 'ĞÜŞİÖÇğüşıöç'),
          document.fonts.load(`400 100px 'Noto Color Emoji'`, sample),
        ]).catch(() => {})
      );
    }
    await Promise.all(jobs);
    this.particles = this.makeParticles();
    this.confetti = this.makeConfetti();
    this.qr = null;
    return this;
  }

  // ---------- ana çizim ----------
  draw(t) {
    const D = this.duration;
    t = clamp(t, 0, D - 1e-6);
    const { ctx, W, H } = this;
    ctx.save();
    ctx.clearRect(0, 0, W, H);
    const f = this.script.format;
    if (f === 'story') this.story(t);
    else if (f === 'reveal') this.revealStory(t);
    else this.quiz(t);
    const fade = Math.max(1 - t / 0.2, prog(t, D - 0.3, D));
    if (fade > 0) {
      ctx.fillStyle = `rgba(0,0,0,${fade})`;
      ctx.fillRect(0, 0, W, H);
    }
    ctx.restore();
  }

  quiz(t) {
    const n = this.script.rounds.length;
    const end = T.intro + n * T.round;
    if (t < T.intro) this.intro(t);
    else if (t < end) {
      const i = Math.floor((t - T.intro) / T.round);
      this.round(i, t - T.intro - i * T.round, t);
    } else this.outro(t - end, t);
    this.brandTag(t);
    // geçişler: her tur başında çapraz şerit silmesi
    for (let i = 0; i <= n; i++) this.wipe(t, T.intro + i * T.round);
  }

  brandTag(t) {
    const size = 30;
    this.pill(SITE_URL, this.W / 2, 200, { size, bg: 'rgba(255,255,255,0.92)' });
  }

  wipe(t, B) {
    const { ctx, W, H } = this;
    if (t < B - 0.4 || t > B + 0.4) return;
    const s = H * 0.3, bw = W + 3 * s;
    [YELLOW, '#f472b6', NAVY].forEach((c, i) => {
      const off = (i - 1) * 0.05;
      const p = inOut(prog(t, B - 0.3 + off, B + 0.3 + off));
      if (p <= 0 || p >= 1) return;
      const y0 = lerp(-bw - s, H + s, p);
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.moveTo(0, y0 + s);
      ctx.lineTo(W, y0);
      ctx.lineTo(W, y0 + bw);
      ctx.lineTo(0, y0 + bw + s);
      ctx.closePath();
      ctx.fill();
    });
  }

  // ---------- kanca: ilk 2.5 sn ----------
  intro(s) {
    const { W, H, ctx } = this;
    const [c1, c2, c3] = this.pal;
    this.background(s, NAVY, c1, c2, { cy: H * 0.4, spin: 0.4 });
    const hk = this.script.hook;
    const p1 = outBack(prog(s, 0.1, 0.45));
    const p2 = outElastic(prog(s, 0.4, 1.1));
    const shake = s > 0.4 && s < 0.7 ? Math.sin(s * 80) * 10 * (1 - prog(s, 0.4, 0.7)) : 0;
    ctx.save();
    ctx.translate(W / 2 + shake, 470);
    ctx.scale(p1, p1);
    this.text(hk.top, 0, 0, { size: this.fit(hk.top, W * 0.86, 110, 800, VD), font: VD, fill: '#fff', stroke: NAVY });
    ctx.restore();
    ctx.save();
    ctx.translate(W / 2, 640);
    ctx.scale(p2, p2);
    ctx.rotate(-0.04);
    this.text(hk.big, 0, 0, { size: this.fit(hk.big, W * 0.9, 130, 800, VD), font: VD, fill: YELLOW, stroke: NAVY });
    ctx.restore();
    const p3 = outBack(prog(s, 0.9, 1.3));
    if (p3 > 0) {
      ctx.save();
      ctx.translate(W / 2, 800);
      ctx.scale(p3, p3);
      this.pill(hk.sub, 0, 0, { size: 46, font: VB, bg: '#fff' });
      ctx.restore();
    }
    // seviye merdiveni
    LEVEL_NAMES.forEach((name, k) => {
      const p = outBack(prog(s, 1.1 + k * 0.12, 1.4 + k * 0.12));
      if (p <= 0) return;
      const y = 930 + k * 92;
      ctx.save();
      ctx.translate(W * 0.33, y);
      ctx.scale(p, p);
      this.pill(`${k + 1}. ${name}`, 0, 0, { size: 36, bg: LEVEL_COLORS[k], fg: '#fff' });
      ctx.restore();
    });
    const mp = prog(s, 0.2, 0.7);
    this.mascot('geogo3', W * 0.72, lerp(H + 600, 1500, outBack(mp)), 560, s, { amp: 0.06 });
  }

  // ---------- tek tur ----------
  round(i, ls, t) {
    const { W, ctx } = this;
    const q = this.script.rounds[i];
    const col = TYPE_COLOR[q.type];
    this.background(t, shade(col, -0.65), shade(col, -0.3), col, { cy: 820, spin: 0.15, rayAlpha: 0.08 });
    const rv = prog(ls, T.revealAt, T.revealAt + 0.35); // cevap açılışı
    const out = prog(ls, T.round - 0.35, T.round);

    // seviye rozeti + ilerleme
    const bp = outBack(prog(ls, 0.05, 0.35));
    ctx.save();
    ctx.translate(W / 2, 290);
    ctx.scale(bp, bp);
    this.pill(`SEVİYE ${i + 1}/${this.script.rounds.length} • ${LEVEL_NAMES[Math.min(4, q.level - 1)]}`, 0, 0, { size: 36, bg: LEVEL_COLORS[Math.min(4, q.level - 1)], fg: '#fff' });
    ctx.restore();

    // soru
    const header = q.type === 'tf' ? 'Doğru mu, yanlış mı?' : q.q;
    const qp = outCubic(prog(ls, 0.15, 0.5));
    ctx.save();
    ctx.globalAlpha = qp * (1 - out);
    const qsize = 76;
    const lines = this.wrap(header, W * 0.86, qsize, 800, VD);
    lines.forEach((line, k) => this.text(line, W / 2, 420 + k * qsize * 1.05 + (1 - qp) * 40, { size: qsize, font: VD, fill: '#fff', stroke: NAVY }));
    ctx.restore();

    // ipucu görseli
    const cp = outBack(prog(ls, 0.3, 0.8));
    ctx.save();
    ctx.globalAlpha = 1 - out;
    this.clue(q, W / 2, 800, cp, ls, rv);
    ctx.restore();

    // şıklar
    ctx.save();
    ctx.globalAlpha = 1 - out;
    if (q.type !== 'vs') this.options(q, 1120, ls, rv);
    ctx.restore();

    // geri sayım → cevap
    if (rv <= 0) this.countdown(W / 2, 1510, ls);
    else {
      if (rv > 0) this.confettiAt(W / 2, 1100, ls - T.revealAt);
      const fp = outBack(prog(ls, T.revealAt + 0.25, T.revealAt + 0.6));
      ctx.save();
      ctx.globalAlpha = 1 - out;
      this.factCard(q.fact, W / 2, 1520, fp);
      ctx.restore();
    }
  }

  // ---------- ipuçları ----------
  clue(q, cx, cy, p, ls, rv) {
    const { ctx } = this;
    if (p <= 0) return;
    const bob = Math.sin(ls * 2.2) * 8;
    ctx.save();
    ctx.translate(cx, cy + bob);
    ctx.scale(p, p);
    if (q.type === 'flag') this.flagClue(q.flag, 0, 0, 620);
    else if (q.type === 'plate') this.plateClue(q.plate, 0, 0, 880);
    else if (q.type === 'emoji') {
      const size = this.fit(q.emoji, 900, 230, 400, EMOJI);
      this.text(q.emoji, 0, 0, { size, font: EMOJI, weight: 400, shadow: false });
    } else if (q.type === 'tf') this.statementCard(q.q, 0, 0, 900);
    else if (q.type === 'vs') this.vsClue(q, 0, 0, rv, ls);
    else {
      this.mascot('geogo2', 0, 230, 470, ls, { amp: 0.02 });
      ['?', '?', '?'].forEach((m, k) => {
        const a = ls * 1.5 + k * 2.1;
        this.text(m, Math.cos(a) * 300, -120 + Math.sin(a * 1.3) * 60 - k * 40, { size: 110 - k * 15, fill: YELLOW, stroke: NAVY });
      });
    }
    ctx.restore();
  }

  flagClue(code, x, y, w) {
    const { ctx } = this;
    const h = w / flagRatio(code);
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.45)';
    ctx.shadowBlur = 50;
    ctx.shadowOffsetY = 20;
    ctx.fillStyle = '#fff';
    rr(ctx, x - w / 2 - 14, y - h / 2 - 14, w + 28, h + 28, 26);
    ctx.fill();
    ctx.restore();
    ctx.save();
    rr(ctx, x - w / 2, y - h / 2, w, h, 14);
    ctx.clip();
    drawFlag(ctx, code, x - w / 2, y - h / 2, w, h);
    ctx.restore();
  }

  plateClue(code, x, y, w) {
    const { ctx } = this;
    const h = w * 0.22;
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.45)';
    ctx.shadowBlur = 40;
    ctx.shadowOffsetY = 18;
    ctx.fillStyle = '#fff';
    rr(ctx, x - w / 2, y - h / 2, w, h, 20);
    ctx.fill();
    ctx.restore();
    ctx.lineWidth = 8;
    ctx.strokeStyle = '#111';
    rr(ctx, x - w / 2 + 8, y - h / 2 + 8, w - 16, h - 16, 14);
    ctx.stroke();
    const sw = w * 0.12;
    ctx.fillStyle = '#003399';
    rr(ctx, x - w / 2 + 12, y - h / 2 + 12, sw, h - 24, 10);
    ctx.fill();
    // AB tarzı yıldız halkası yerine sade TR şeridi
    this.text('TR', x - w / 2 + 12 + sw / 2, y + h * 0.18, { size: h * 0.3, font: BODY, fill: '#fff', shadow: false });
    const num = String(100 + (this.script.seed * 37) % 900);
    this.text(`${code} GEO ${num}`, x + sw / 2, y + h * 0.04, { size: this.fit(`${code} GEO ${num}`, w - sw - 80, h * 0.72), fill: '#111', shadow: false });
  }

  statementCard(s, x, y, w) {
    const { ctx } = this;
    const size = 70;
    const lines = this.wrap(s, w - 100, size, 800, VD);
    const h = lines.length * size * 1.2 + 110;
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.4)';
    ctx.shadowBlur = 40;
    ctx.shadowOffsetY = 16;
    ctx.fillStyle = '#fff';
    rr(ctx, x - w / 2, y - h / 2, w, h, 36);
    ctx.fill();
    ctx.restore();
    ctx.fillStyle = YELLOW;
    rr(ctx, x - w / 2, y - h / 2, w, 22, 11);
    ctx.fill();
    lines.forEach((line, k) => this.text(line, x, y - ((lines.length - 1) * size * 1.2) / 2 + k * size * 1.2, { size, font: VD, fill: NAVY, shadow: false }));
  }

  vsClue(q, x, y, rv, ls) {
    const { ctx } = this;
    const cols = ['#f97316', '#0ea5e9'];
    q.options.forEach((name, k) => {
      const win = k === q.answer;
      const cx = x + (k ? 260 : -260);
      const sc = 1 + (win ? 0.1 : -0.1) * outBack(rv);
      ctx.save();
      ctx.translate(cx, y);
      ctx.scale(sc, sc);
      ctx.globalAlpha *= win ? 1 : 1 - 0.45 * rv;
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.4)';
      ctx.shadowBlur = 40;
      ctx.shadowOffsetY = 16;
      ctx.fillStyle = cols[k];
      ctx.beginPath();
      ctx.arc(0, 0, 215, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      ctx.lineWidth = 12;
      ctx.strokeStyle = rv > 0 && win ? GREEN : '#fff';
      ctx.beginPath();
      ctx.arc(0, 0, 215, 0, Math.PI * 2);
      ctx.stroke();
      const words = this.wrap(name, 340, 72, 800, VD);
      const ns = words.length > 1 ? 60 : this.fit(name, 350, 76, 800, VD);
      words.forEach((wd, j) => this.text(wd, 0, (j - (words.length - 1) / 2) * ns * 1.05 - (rv > 0 ? 30 : 0), { size: ns, font: VD, fill: '#fff', stroke: NAVY }));
      if (rv > 0) {
        const v = Math.round(q.values[k] * outCubic(rv));
        const label = `${v.toLocaleString('tr-TR')} km²`;
        this.text(label, 0, 95, { size: this.fit(label, 360, 46, 800, VB), font: VB, fill: YELLOW, stroke: NAVY });
        if (win) this.text('👑', 0, -270, { size: 110 * outBack(rv), font: EMOJI, weight: 400, shadow: false });
      }
      ctx.restore();
      // seçenek harfi
      this.pill('AB'[k], cx, y + 260, { size: 40, bg: '#fff' });
    });
    const vp = 1 + Math.sin(ls * 6) * 0.05;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(vp, vp);
    ctx.rotate(-0.1);
    this.text('VS', 0, 0, { size: 120, fill: YELLOW, stroke: NAVY });
    ctx.restore();
  }

  // ---------- şıklar ----------
  options(q, top, ls, rv) {
    const { W, ctx } = this;
    const two = q.options.length === 2;
    const bw = two ? 440 : 450, bh = two ? 150 : 130, gx = 30, gy = 28;
    q.options.forEach((opt, k) => {
      const col = two ? k : k % 2, row = two ? 0 : Math.floor(k / 2);
      const x = W / 2 + (col ? gx / 2 : -gx / 2 - bw);
      const y = top + row * (bh + gy);
      const p = outBack(prog(ls, 0.7 + k * 0.1, 1.05 + k * 0.1));
      if (p <= 0) return;
      const right = k === q.answer;
      const tfCol = q.type === 'tf' ? (k === 0 ? '#16a34a' : '#dc2626') : null;
      ctx.save();
      ctx.translate(x + bw / 2, y + bh / 2);
      const pulse = rv > 0 && right ? 1 + Math.sin(prog(ls, T.revealAt, T.revealAt + 0.5) * Math.PI) * 0.08 : 1;
      ctx.scale(p * pulse, p * pulse);
      ctx.globalAlpha *= rv > 0 && !right ? 1 - 0.6 * rv : 1;
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.35)';
      ctx.shadowBlur = 24;
      ctx.shadowOffsetY = 10;
      ctx.fillStyle = rv > 0 && right ? mix('#ffffff', GREEN, rv) : tfCol || '#fff';
      rr(ctx, -bw / 2, -bh / 2, bw, bh, 30);
      ctx.fill();
      ctx.restore();
      const fg = (rv > 0.5 && right) || tfCol ? '#fff' : NAVY;
      if (q.type === 'tf') {
        this.text(opt, 0, 4, { size: 66, fill: '#fff', stroke: NAVY, strokeW: 8 });
      } else {
        ctx.fillStyle = rv > 0.5 && right ? '#fff' : TYPE_COLOR[q.type];
        ctx.beginPath();
        ctx.arc(-bw / 2 + 58, 0, 36, 0, Math.PI * 2);
        ctx.fill();
        this.text(rv > 0.5 && right ? '✓' : 'ABCD'[k], -bw / 2 + 58, 3, { size: 44, font: VB, fill: rv > 0.5 && right ? GREEN : '#fff', shadow: false });
        const size = this.fit(opt, bw - 170, two ? 56 : 48, 800, VB);
        this.text(opt, 40, 3, { size, font: VB, fill: fg, shadow: false });
      }
      ctx.restore();
    });
  }

  countdown(cx, cy, ls) {
    const { ctx } = this;
    const p = prog(ls, T.timerStart, T.revealAt);
    if (ls < T.timerStart - 0.2) return;
    const appear = outBack(prog(ls, T.timerStart - 0.2, T.timerStart + 0.1));
    const n = Math.max(1, Math.ceil(T.timerLen * (1 - p)));
    const frac = (T.timerLen * (1 - p)) % 1;
    const pulse = 1 + Math.pow(frac, 6) * 0.25;
    const R = 80;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(appear * pulse, appear * pulse);
    ctx.fillStyle = NAVY;
    ctx.beginPath();
    ctx.arc(0, 0, R, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 16;
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.beginPath();
    ctx.arc(0, 0, R - 8, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = n === 1 ? RED : YELLOW;
    ctx.beginPath();
    ctx.arc(0, 0, R - 8, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (1 - p));
    ctx.stroke();
    this.text(String(n), 0, 6, { size: 100, fill: '#fff', shadow: false });
    ctx.restore();
  }

  factCard(fact, cx, cy, p) {
    if (p <= 0) return;
    const { ctx } = this;
    const w = 920, size = 44;
    const lines = this.wrap('💡 ' + fact, w - 80, size, 800, VB);
    const h = lines.length * size * 1.25 + 60;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(p, p);
    ctx.fillStyle = 'rgba(15,27,61,0.92)';
    rr(ctx, -w / 2, -h / 2, w, h, 28);
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = YELLOW;
    rr(ctx, -w / 2, -h / 2, w, h, 28);
    ctx.stroke();
    lines.forEach((l, k) => this.text(l, 0, -((lines.length - 1) * size * 1.25) / 2 + k * size * 1.25, { size, font: VB, fill: '#fff', shadow: false }));
    ctx.restore();
  }

  confettiAt(cx, cy, dt) {
    if (dt < 0 || dt > 1.6) return;
    this.confettiBurst(cx, cy, dt + 0.2);
  }

  // ---------- kapanış: "kaç tane bildin?" ----------
  outro(s, t) {
    const { W, H, ctx } = this;
    const [c1, c2, c3] = this.pal;
    this.background(t, c1, c2, c3, { spin: 0.4, rayAlpha: 0.1, cy: 700 });
    const p1 = outElastic(prog(s, 0.05, 0.8));
    ctx.save();
    ctx.translate(W / 2, 420);
    ctx.scale(p1, p1);
    this.text('Kaç tane bildin?', 0, 0, { size: this.fit('Kaç tane bildin?', W * 0.9, 120), fill: YELLOW, stroke: NAVY });
    ctx.restore();
    const p2 = outBack(prog(s, 0.4, 0.8));
    if (p2 > 0) {
      ctx.save();
      ctx.translate(W / 2, 570);
      ctx.scale(p2, p2);
      this.pill('Yorumlara yaz 👇', 0, 0, { size: 52, font: VB, bg: '#fff' });
      ctx.restore();
    }
    const tiers = [['0–2', 'Çaylak', '😅'], ['3–4', 'Gezgin', '👏'], ['5', 'Dâhi', '🧠']];
    tiers.forEach(([sc, name, em], k) => {
      const p = outBack(prog(s, 0.7 + k * 0.15, 1.0 + k * 0.15));
      if (p <= 0) return;
      ctx.save();
      ctx.translate(W / 2, 720 + k * 115);
      ctx.scale(p, p);
      this.pill(`${sc} → ${name} ${em}`, 0, 0, { size: 44, font: VB, bg: LEVEL_COLORS[k * 2], fg: '#fff' });
      ctx.restore();
    });
    const last = this.script.rounds[this.script.rounds.length - 1];
    const game = gameById(last.game);
    const up = outElastic(prog(s, 1.3, 2.1));
    if (up > 0) {
      ctx.save();
      ctx.translate(W / 2, 1140);
      ctx.scale(up, up);
      this.text('Daha zoru:', 0, -70, { size: 48, font: VB, fill: '#fff', stroke: NAVY, strokeW: 6 });
      ctx.font = `800 96px ${DISPLAY}`;
      const uw = ctx.measureText(SITE_URL).width + 110;
      ctx.fillStyle = '#fff';
      rr(ctx, -uw / 2, -10, uw, 150, 75);
      ctx.fill();
      ctx.lineWidth = 10;
      ctx.strokeStyle = YELLOW;
      rr(ctx, -uw / 2, -10, uw, 150, 75);
      ctx.stroke();
      this.text(SITE_URL, 0, 68, { size: 96, fill: NAVY, shadow: false });
      if (game) this.pill(`▶ ${game.title}`, 0, 200, { size: 40, bg: YELLOW });
      ctx.restore();
    }
    const mp = prog(s, 0.2, 0.7);
    this.mascot('geogo4', W * 0.5, lerp(H + 500, 1720, outBack(mp)), 380, s, { amp: 0.08 });
    this.confettiAt(W / 2, 500, s - 0.1);
  }

  // ---------- anketli story (1. hikâye) ----------
  story(t) {
    const { W, ctx } = this;
    const q = this.script.rounds[0];
    const col = TYPE_COLOR[q.type];
    this.background(t, shade(col, -0.65), shade(col, -0.3), col, { cy: 760, spin: 0.12 });
    const bp = outBack(prog(t, 0.1, 0.45));
    ctx.save();
    ctx.translate(W / 2, 300);
    ctx.scale(bp, bp);
    this.pill('🤔 GÜNÜN SORUSU', 0, 0, { size: 44, font: VB, bg: YELLOW });
    ctx.restore();
    const header = q.type === 'tf' ? 'Doğru mu, yanlış mı?' : q.q;
    const qp = outCubic(prog(t, 0.3, 0.7));
    ctx.save();
    ctx.globalAlpha = qp;
    const lines = this.wrap(header, W * 0.86, 80, 800, VD);
    lines.forEach((l, k) => this.text(l, W / 2, 430 + k * 84, { size: 80, font: VD, fill: '#fff', stroke: NAVY }));
    ctx.restore();
    this.clue(q, W / 2, 780, outBack(prog(t, 0.5, 1.0)), t, 0);
    // anket çıkartması için boş alan (çıkartma bunun üstüne konur)
    const zp = outCubic(prog(t, 1.0, 1.4));
    if (zp > 0) {
      ctx.save();
      ctx.globalAlpha = zp;
      const zy = 1130, zh = 300, zw = 820;
      ctx.setLineDash([22, 16]);
      ctx.lineDashOffset = -t * 40;
      ctx.lineWidth = 6;
      ctx.strokeStyle = 'rgba(255,255,255,0.8)';
      rr(ctx, W / 2 - zw / 2, zy, zw, zh, 40);
      ctx.stroke();
      ctx.setLineDash([]);
      const hand = Math.sin(t * 5) * 14;
      this.text('👆', W / 2, zy + zh / 2 - 20 + hand, { size: 110, font: EMOJI, weight: 400, shadow: false });
      this.text('Ankete oy ver!', W / 2, zy + zh / 2 + 85, { size: 46, font: VB, fill: '#fff' });
      ctx.restore();
    }
    const cp = outBack(prog(t, 1.6, 2.0));
    if (cp > 0) {
      ctx.save();
      ctx.translate(W / 2, 1520);
      ctx.scale(cp, cp);
      this.pill('Cevap bir sonraki hikâyede! 👉', 0, 0, { size: 40, font: VB, bg: '#fff' });
      ctx.restore();
    }
  }

  // ---------- cevap story (2. hikâye) ----------
  revealStory(t) {
    const { W, H, ctx } = this;
    const q = this.script.rounds[0];
    const col = TYPE_COLOR[q.type];
    this.background(t, shade(col, -0.6), col, GREEN, { cy: 760, spin: 0.3, rayAlpha: 0.1 });
    // damga
    const sp = prog(t, 0.2, 0.5);
    if (sp > 0) {
      const k = lerp(2.4, 1, outCubic(sp));
      ctx.save();
      ctx.translate(W / 2, 320);
      ctx.rotate(-0.06);
      ctx.scale(k, k);
      ctx.globalAlpha = clamp(sp * 3);
      ctx.fillStyle = GREEN;
      rr(ctx, -250, -75, 500, 150, 26);
      ctx.fill();
      ctx.lineWidth = 8;
      ctx.strokeStyle = '#fff';
      rr(ctx, -238, -63, 476, 126, 20);
      ctx.stroke();
      this.text('CEVAP', 0, 6, { size: 104, fill: '#fff', shadow: false });
      ctx.restore();
    }
    const rv = prog(t, 0.9, 1.4);
    if (q.type === 'tf') this.statementCard(q.q, W / 2, 700, 900);
    else this.clue(q, W / 2, 720, outBack(prog(t, 0.4, 0.8)), t, rv);
    const ap = outElastic(prog(t, 1.0, 1.8));
    if (ap > 0) {
      ctx.save();
      ctx.translate(W / 2, 1070);
      ctx.scale(ap, ap);
      const ans = '✓ ' + q.options[q.answer];
      this.pill(ans, 0, 0, { size: this.fit(ans, W * 0.7, 72, 800, VB), font: VB, bg: GREEN, fg: '#fff', border: '#fff' });
      ctx.restore();
      this.confettiAt(W / 2, 1050, t - 1.0);
    }
    this.factCard(q.fact, W / 2, 1260, outBack(prog(t, 1.8, 2.2)));
    // bağlantı çıkartması alanı
    const lp = outCubic(prog(t, 2.4, 2.8));
    if (lp > 0) {
      ctx.save();
      ctx.globalAlpha = lp;
      ctx.setLineDash([20, 14]);
      ctx.lineDashOffset = -t * 40;
      ctx.lineWidth = 5;
      ctx.strokeStyle = 'rgba(255,255,255,0.85)';
      rr(ctx, W / 2 - 330, 1410, 660, 130, 65);
      ctx.stroke();
      ctx.setLineDash([]);
      const lt = '🔗 Kendini dene: ' + SITE_URL;
      this.text(lt, W / 2, 1475, { size: this.fit(lt, 600, 42, 800, VB), font: VB, fill: '#fff' });
      ctx.restore();
    }
    this.mascot('geogo4', W * 0.12, lerp(H + 300, 500, outBack(prog(t, 0.3, 0.8))), 200, t, { amp: 0.08 });
  }
}
