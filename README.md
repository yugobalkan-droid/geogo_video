# GeoGo Video

[geogames.site](https://geogames.site) için **60 saniyelik reklam videolarını** otomatik üreten sistem.
Videolar oyunların **eğitici**, **akıllı tahta uyumlu** ve **eğlenceli** olduğunu sıkmadan anlatır.

- **Stüdyo (canlı):** Vercel'deki `geogo_video` projesi — tarayıcıda önizle, kurgu/format seç, tek tıkla kaydet.
- **Otomasyon:** GitHub Actions her pazartesi tüm kurguları 1080p MP4 olarak üretir ve **Releases**'a yükler.

## Video kurgusu (60 sn)

| Zaman | Sahne | İçerik |
|---|---|---|
| 0–6 sn | Kanca | Soru → kırmızı damga → cevap, maskot Geogo zıplar |
| 6–10 sn | Marka | GeoGames logosu, "17 ücretsiz eğitici oyun" |
| 10–42 sn | Oyunlar | 8 oyun × 4 sn: afiş, ad, tek cümle, rozetler, bağlantı |
| 42–51 sn | 3 vaat | Eğitici • Akıllı tahta uyumlu (dokunmatik demo) • Eğlenceli |
| 51–54 sn | Özellikler | Ücretsiz, indirme yok, her ekranda, 17 oyun |
| 54–60 sn | Çağrı | geogames.site + QR kod (UTM'li) |

Müzik ve efektler koddan üretilir (120 BPM, telifsiz); sahne geçişleriyle senkrondur.

## Kurgular ve formatlar

| Kurgu | Hedef |
|---|---|
| `genel` | Genel tanıtım |
| `ogretmen` | Öğretmenler, akıllı tahta / sınıf yarışmaları |
| `sinav` | KPSS • YKS • LGS öğrencileri |
| `kesif` | Çocuklar ve aileler |
| `rastgele` | Seed'e göre rastgele 8 oyun + kanca |

Formatlar: `16x9` (YouTube, akıllı tahta), `9x16` (Reels/Shorts/TikTok), `1x1` (Instagram gönderi).
Kısa, etkileşimli içerik için aşağıdaki **viral sisteme** bakın.

## Komutlar

```bash
npm install            # Puppeteer (headless Chrome) kurar
npm run dev            # Stüdyo: http://127.0.0.1:5173
npm run render         # out/geogo_genel_16x9_s1.mp4
npm run render:all     # tüm kurgular, 16:9 + 9:16
node scripts/render.mjs --preset ogretmen,sinav --format 9x16 --seed 42
```

`ffmpeg` PATH'te olmalıdır (veya `FFMPEG` ortam değişkeniyle yolu verin). Kurulu bir Chrome kullanmak için `PUPPETEER_EXECUTABLE_PATH` verin.

## Otomasyon

`.github/workflows/render.yml`

- **Zamanlı:** her pazartesi 06:00 UTC; seed = ISO hafta numarası, renk ve rastgele kurgu her hafta değişir.
- **Elle:** Actions → *Render videos* → *Run workflow* (kurgu, format, seed seçilebilir).
- Her kurgu × format ayrı bir işte paralel üretilir, sonra tek bir Release'te toplanır. Stüdyo sayfası son Release'teki videoları listeler.

## 🔥 Viral sistem: quiz Short'ları + anketli story'ler

`viral.html` (**Viral Stüdyo**) ve `npm run viral:week`, 9:16 kısa videolar ve paylaşım metinleri üretir.
Formatlar YouTube Shorts ve Reddit'te (r/MapPorn, r/geography) en çok paylaşılan coğrafya içeriklerinden derlendi:

| Format | Süre | Ne yapar? |
|---|---|---|
| `quiz` | 37 sn | Kanca ("Sadece %1'i 5/5 yapabiliyor") → 5 tur, seviye 1→5, her turda 3 sn geri sayım + cevap + "Biliyor muydun?" → "Kaç tane bildin? Yorumlara yaz" |
| `story` | 10 sn | Anketli story (1. hikâye): soru + ipucu, altta **anket/quiz çıkartması** için kesik çizgili boş alan, "Cevap bir sonraki hikâyede!" |
| `reveal` | 7 sn | Cevap story'si (2. hikâye): CEVAP damgası, doğru şık, ilginç bilgi, **bağlantı çıkartması** alanı |

Soru türleri (`src/viral/bank.js`, 55 soru): koddan çizilen **bayraklar**, **plakadan il**, **emojiden ülke/il**,
**hangisi daha büyük?** (gerçek km² ile sayaç), **doğru mu yanlış mı?**, klasik tuzak sorular (Avustralya'nın başkenti…).
Temalar: `karisik`, `bayrak`, `plaka`, `emoji`, `boyut`, `bilgi`.

Viral olmasını sağlayan kurallar:
- **İlk 2 sn kanca** ve meydan okuma; **3 sn geri sayım** izleyiciyi oynamaya zorlar (izlenme süresi ↑).
- **Seviye seviye zorlaşma**: son soru merakı videoyu sonuna kadar izletir.
- **Yorum tetikleyici**: "Kaç tane bildin?" + sabit yorumda cevaplar.
- **Anket → cevap story çifti**: tek dokunuşla oy, cevabı görmek için takipçi bir sonraki hikâyeye geri gelir.
- **Güvenli alanlar**: içerik üstte 250 px, altta 360 px boş bırakılır (story profil çubuğu, Shorts/Reels arayüzü).

```bash
npm run viral                     # seed 1: quiz + story + reveal
npm run viral:week                # 7 günlük paket (seed 1–7)
node scripts/render.mjs --viral quiz --theme bayrak --seed 12 --count 3
node scripts/render.mjs --viral story,reveal --seed 4   # aynı seed = aynı soru (çift olarak paylaş)
```

Her video için `out/` içinde `.mp4`, kapak `.jpg` ve **paylaşım paketi `.md`** oluşur: YouTube başlığı/açıklaması,
sabit yorum (cevaplar), TikTok ve Reels metinleri, etiketler, anket/quiz çıkartması seçenekleri, UTM'li bağlantı.
Instagram anket/quiz çıkartmaları API ile eklenemediği için paylaşırken uygulamada eklenir; video bu çıkartmanın yerini boş bırakır.

Yeni soru eklemek: `src/viral/bank.js` içine bir satır ekleyin (`type`, `q`, `options`, `answer`, `level`, `fact`, `game`).
Yeni bayrak: `src/viral/flags.js` içine şerit/haç/daire tanımı.

## Yeni oyun eklemek

1. Afişi `assets/posters/<oyun-id>.webp` olarak ekleyin.
2. `src/games.js` içine oyunu ekleyin (başlık, tek cümlelik kanca, renk, 3 rozet).
3. İsterseniz `src/presets.js` içindeki kurguların oyun listelerine ekleyin.

## Yapı

```
index.html          Stüdyo arayüzü (önizleme + MediaRecorder kaydı)
viral.html          Viral Stüdyo (quiz Short + anketli story önizleme, kayıt, paylaşım metinleri)
render.html         Headless üretim sayfası (reklam ve viral)
src/engine.js       Kare kare çizim motoru (draw(t) saf fonksiyon)
src/music.js        WebAudio müzik/efekt + WAV dışa aktarma
src/presets.js      Kurgular, formatlar, seed
src/games.js        Oyun kataloğu
src/viral/          Viral motor, soru bankası, bayraklar, ses, senaryo + paylaşım paketi
scripts/render.mjs  Puppeteer + ffmpeg → MP4
scripts/serve.mjs   Bağımlılıksız statik sunucu
```
