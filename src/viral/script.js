// Viral video senaryoları: seed + format → somut zaman çizelgesi ve paylaşım metinleri.
//   quiz   : 9:16 Shorts/Reels/TikTok — kanca + 5 tur (seviye 1→5) + "kaç tane bildin?" çağrısı
//   story  : 9:16 anketli story — soru + ipucu, alt kısımda anket çıkartması için boş alan
//   reveal : 9:16 cevap story'si — bir sonraki hikâyede cevabı açıklar + bağlantı çıkartması alanı
import { BANK, HOOKS, THEMES, questionById } from './bank.js';
import { mulberry32 } from '../presets.js';
import { gameById, SITE_URL } from '../games.js';

export const VIRAL_FORMATS = {
  quiz: { label: 'Quiz Short (Shorts • Reels • TikTok)' },
  story: { label: 'Anketli Story (1. hikâye: soru)' },
  reveal: { label: 'Cevap Story (2. hikâye: cevap)' },
};

export const T = {
  intro: 2.5,
  round: 6,
  outro: 4.5,
  story: 10,
  reveal: 7,
  // tur içi zamanlar
  timerStart: 1.4,
  timerLen: 3,
  get revealAt() { return this.timerStart + this.timerLen; },
};
export const ROUNDS = 5;

function shuffle(arr, rnd) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickRounds(rnd, theme) {
  const types = THEMES[theme]?.types;
  const pool = BANK.filter((q) => !types || types.includes(q.type));
  const used = new Set();
  const out = [];
  for (let level = 1; level <= ROUNDS; level++) {
    // önce tam seviye, yoksa en yakın seviye; art arda aynı tür gelmesin
    const prevType = out[out.length - 1]?.type;
    const free = pool.filter((q) => !used.has(q.id));
    const byDist = (d) => free.filter((q) => Math.abs(q.level - level) === d);
    let cand = [];
    for (let d = 0; d <= 4 && !cand.length; d++) cand = byDist(d);
    const varied = cand.filter((q) => q.type !== prevType);
    const list = shuffle(varied.length ? varied : cand, rnd);
    if (!list.length) break;
    used.add(list[0].id);
    out.push(list[0]);
  }
  return out;
}

export function buildViral({ format = 'quiz', seed = 1, theme = 'karisik', question = null } = {}) {
  const rnd = mulberry32(seed * 7919 + 3);
  const palette = Math.floor(rnd() * 3);
  if (format === 'story' || format === 'reveal') {
    const types = THEMES[theme]?.types;
    const pool = BANK.filter((q) => !types || types.includes(q.type));
    // story ve reveal aynı seed ile aynı soruyu seçer → çift olarak paylaşılır
    const q = (question && questionById(question)) || pool[Math.floor(rnd() * pool.length)];
    const duration = format === 'story' ? T.story : T.reveal;
    return { kind: 'viral', format, seed, theme, palette, rounds: [q], duration, thumbAt: format === 'story' ? 2.5 : 3.5 };
  }
  const rounds = pickRounds(rnd, theme);
  const hook = HOOKS[Math.floor(rnd() * HOOKS.length)];
  const duration = T.intro + rounds.length * T.round + T.outro;
  return { kind: 'viral', format: 'quiz', seed, theme, palette, hook, rounds, duration, thumbAt: T.intro + T.timerStart + 0.6 };
}

const TYPE_TAGS = {
  flag: ['bayrak', 'bayraklar', 'flagquiz'],
  plate: ['plaka', 'plakakodu', 'türkiye'],
  emoji: ['emoji', 'emojiquiz', 'tahminet'],
  vs: ['hangisidahabüyük', 'harita', 'mercator'],
  tf: ['doğrumuyanlışmı', 'bilgi'],
  text: ['genelkültür', 'bilgiyarışması'],
};
const letter = (i) => 'ABCD'[i];

// Paylaşım paketi: başlık, açıklama, etiketler, anket/quiz çıkartması metinleri
export function buildCaptions(script) {
  const qs = script.rounds;
  const game = gameById(qs[qs.length - 1].game) || gameById(qs[0].game);
  const utm = (src) => `https://${SITE_URL}/oyun/${game.id}?utm_source=${src}&utm_medium=social&utm_campaign=viral_${script.format}_s${script.seed}`;
  const tags = [...new Set(['coğrafya', 'quiz', 'geogames', ...qs.flatMap((q) => TYPE_TAGS[q.type])])];
  const hashtags = (extra = []) => [...extra, ...tags].map((t) => '#' + t).join(' ');

  if (script.format === 'quiz') {
    const title = `${script.hook.top} ${script.hook.big}! 🤯 Coğrafya Quiz`.replace(/\s+/g, ' ');
    const answers = qs.map((q, i) => `${i + 1}) ${q.options[q.answer]}`).join('\n');
    return {
      youtube: {
        title: (title.length > 90 ? title.slice(0, 89) + '…' : title) + ' #shorts',
        description: `Kaç tanesini bildin? Yorumlara yaz! 👇\n\nDaha zor sorular ve ücretsiz coğrafya oyunları: ${utm('youtube')}\n\n${hashtags(['shorts'])}`,
        pinnedComment: `Cevaplar 👇 (önce kendin dene!)\n${answers}\n\nSkorunu yaz: __/5 🏆`,
      },
      tiktok: { caption: `${script.hook.top} ${script.hook.big} 😳 Kaç tane bildin? ${hashtags(['keşfet', 'fyp', 'öğren'])}` },
      instagram: { caption: `${script.hook.top} ${script.hook.big} 🧠\nSkorunu yorumlara yaz, arkadaşını etiketle ve meydan oku! 👇\n\nBiyografideki linkten 17 ücretsiz oyun: ${SITE_URL}\n\n${hashtags(['reels', 'keşfet'])}` },
      story: {
        tip: 'Short’u story’de paylaş ve üzerine anket çıkartması ekle:',
        poll: { question: 'Kaç tane bildin?', options: ['5/5 dâhiyim 🧠', 'Birkaçını 😅'] },
      },
      answers,
      link: utm('bio'),
    };
  }

  const q = qs[0];
  const two = q.options.length === 2;
  return {
    story: {
      tip: two
        ? 'Videonun altındaki boş alana ANKET çıkartması ekle (2 seçenek).'
        : 'Videonun altındaki boş alana QUIZ çıkartması ekle ve doğru şıkkı işaretle (çıkartma sorun çıkarırsa 4 seçenekli ANKET kullan).',
      poll: { question: q.q, options: q.options },
      quiz: two ? null : { question: q.q, options: q.options, correct: letter(q.answer) + ') ' + q.options[q.answer] },
      reveal: `Cevap: ${q.options[q.answer]} — ${q.fact}`,
      schedule: '1. hikâye (soru) 19:00 → 2. hikâye (cevap) 21:00. Arada anket sonuçlarını “Sonuçları paylaş” ile göster.',
      link: { sticker: `${SITE_URL}/oyun/${game.id}`, url: utm('instagram_story') },
    },
    instagram: { caption: `${q.q} 🤔 Cevap bir sonraki hikâyede! ${hashtags(['keşfet'])}` },
    answer: q.options[q.answer],
    link: utm('instagram_story'),
  };
}

export function captionsMarkdown(script, c = buildCaptions(script)) {
  const L = [`# GeoGames viral paket — ${script.format} • seed ${script.seed}`, ''];
  if (c.youtube) {
    L.push('## YouTube Shorts', `**Başlık:** ${c.youtube.title}`, '', '**Açıklama:**', '```', c.youtube.description, '```', '**Sabit yorum:**', '```', c.youtube.pinnedComment, '```', '');
    L.push('## TikTok', '```', c.tiktok.caption, '```', '', '## Instagram Reels', '```', c.instagram.caption, '```', '');
  }
  if (c.story) {
    L.push('## Instagram / Facebook Story', c.story.tip, '');
    if (c.story.poll) L.push(`- **Anket sorusu:** ${c.story.poll.question}`, ...c.story.poll.options.map((o, i) => `  - Seçenek ${i + 1}: ${o}`));
    if (c.story.quiz) L.push(`- **Quiz çıkartması doğru cevap:** ${c.story.quiz.correct}`);
    if (c.story.reveal) L.push(`- **Cevap story metni:** ${c.story.reveal}`);
    if (c.story.link) L.push(`- **Bağlantı çıkartması:** ${c.story.link.url}`);
    if (c.story.schedule) L.push(`- **Zamanlama:** ${c.story.schedule}`);
    L.push('');
  }
  if (!c.youtube && c.instagram) L.push('## Story metni', '```', c.instagram.caption, '```', '');
  if (c.answers) L.push('## Cevaplar', '```', c.answers, '```');
  return L.join('\n');
}
