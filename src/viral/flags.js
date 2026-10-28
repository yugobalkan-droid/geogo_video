// Koddan çizilen bayraklar (görsel dosya yok, her çözünürlükte keskin).
// h: yatay şeritler, v: dikey şeritler, w: şerit ağırlıkları
// cross: İskandinav haçı, disc: daire, crescent: ay-yıldız
export const FLAGS = {
  jp: { bg: '#ffffff', disc: { c: '#bc002d', x: 0.5, r: 0.3 } },
  bd: { bg: '#006a4e', disc: { c: '#f42a41', x: 0.45, r: 0.33 } },
  tr: { bg: '#e30a17', crescent: true },
  it: { v: ['#009246', '#ffffff', '#ce2b37'] },
  ie: { v: ['#169b62', '#ffffff', '#ff883e'] },
  fr: { v: ['#0055a4', '#ffffff', '#ef4135'] },
  be: { v: ['#000000', '#fdda24', '#ef3340'] },
  ro: { v: ['#002b7f', '#fcd116', '#ce1126'] },
  td: { v: ['#002664', '#fecb00', '#c60c30'] },
  ml: { v: ['#14b53a', '#fcd116', '#ce1126'] },
  gn: { v: ['#ce1126', '#fcd116', '#009460'] },
  ng: { v: ['#008751', '#ffffff', '#008751'] },
  de: { h: ['#000000', '#dd0000', '#ffce00'] },
  nl: { h: ['#ae1c28', '#ffffff', '#21468b'] },
  lu: { h: ['#ea141d', '#ffffff', '#51adda'] },
  ru: { h: ['#ffffff', '#0039a6', '#d52b1e'] },
  hu: { h: ['#cd2a3e', '#ffffff', '#436f4d'] },
  bg: { h: ['#ffffff', '#00966e', '#d62612'] },
  at: { h: ['#c8102e', '#ffffff', '#c8102e'] },
  ua: { h: ['#0057b7', '#ffd700'] },
  id: { h: ['#ce1126', '#ffffff'] },
  pl: { h: ['#ffffff', '#dc143c'] },
  co: { h: ['#fcd116', '#003893', '#ce1126'], w: [2, 1, 1] },
  th: { h: ['#a51931', '#f4f5f8', '#2d2a4a', '#f4f5f8', '#a51931'], w: [1, 1, 2, 1, 1] },
  se: { bg: '#006aa7', cross: { c: '#fecc00' } },
  dk: { bg: '#c8102e', cross: { c: '#ffffff' } },
  fi: { bg: '#ffffff', cross: { c: '#002f6c' } },
  no: { bg: '#ba0c2f', cross: { c: '#00205b', border: '#ffffff' } },
  is: { bg: '#02529c', cross: { c: '#dc1e35', border: '#ffffff' } },
};

export function drawFlag(ctx, code, x, y, w, h) {
  const f = FLAGS[code];
  if (!f) return;
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  ctx.fillStyle = f.bg || '#fff';
  ctx.fillRect(x, y, w, h);
  const stripes = f.h || f.v;
  if (stripes) {
    const wt = f.w || stripes.map(() => 1);
    const sum = wt.reduce((a, b) => a + b, 0);
    let p = 0;
    stripes.forEach((c, i) => {
      const a = p / sum, b = (p + wt[i]) / sum;
      ctx.fillStyle = c;
      // 1px bindirme: şeritler arasında ince çizgi kalmasın
      if (f.h) ctx.fillRect(x, y + a * h, w, (b - a) * h + 1);
      else ctx.fillRect(x + a * w, y, (b - a) * w + 1, h);
      p += wt[i];
    });
  }
  if (f.cross) {
    const cx = x + w * 0.375, t = h * 0.2;
    const bar = (c, k) => {
      ctx.fillStyle = c;
      ctx.fillRect(cx - (t * k) / 2, y, t * k, h);
      ctx.fillRect(x, y + h / 2 - (t * k) / 2, w, t * k);
    };
    if (f.cross.border) bar(f.cross.border, 1.5);
    bar(f.cross.c, f.cross.border ? 0.8 : 1);
  }
  if (f.disc) {
    ctx.fillStyle = f.disc.c;
    ctx.beginPath();
    ctx.arc(x + w * f.disc.x, y + h / 2, h * f.disc.r, 0, Math.PI * 2);
    ctx.fill();
  }
  if (f.crescent) {
    const r = h * 0.25, cx = x + w * 0.38, cy = y + h / 2;
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = f.bg;
    ctx.beginPath();
    ctx.arc(cx + r * 0.25, cy, r * 0.8, 0, Math.PI * 2);
    ctx.fill();
    star(ctx, cx + r * 1.15, cy, r * 0.42, '#fff');
  }
  ctx.restore();
}

function star(ctx, cx, cy, R, c) {
  ctx.fillStyle = c;
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = Math.PI + (i * Math.PI) / 5;
    const r = i % 2 ? R * 0.382 : R;
    ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
  }
  ctx.closePath();
  ctx.fill();
}

// Bayrağın en/boy oranı (genişlik / yükseklik)
export const flagRatio = (code) => ({ bd: 5 / 3, ng: 2, de: 5 / 3, be: 15 / 13 }[code] || 1.5);
