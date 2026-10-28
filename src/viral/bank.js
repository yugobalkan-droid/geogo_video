// Viral soru bankası. Her soru tek bir "tur" olarak çizilir.
// type: flag | plate | emoji | vs | tf | text
//   options + answer (doğru şıkkın indeksi), level 1–5 (zorluk), fact (cevaptan sonra çıkan "Biliyor muydun?" cümlesi)
//   game: soruyla ilgili geogames.site oyunu (çağrıda ve açıklamada linklenir)
// Bayraklar koddan çizilir (src/viral/flags.js), görsel dosya gerekmez.
// Rakamlar: yüzölçümleri km² (yuvarlatılmış), il verileri TÜİK.

export const BANK = [
  // ---------- bayrak ----------
  { id: 'bayrak-japonya', type: 'flag', flag: 'jp', level: 1, q: 'Bu bayrak hangi ülkenin?', options: ['Japonya', 'Çin', 'Güney Kore', 'Vietnam'], answer: 0, fact: 'Ortadaki kırmızı daire güneşi temsil eder.', game: 'bayrak' },
  { id: 'bayrak-italya', type: 'flag', flag: 'it', level: 1, q: 'Bu bayrak hangi ülkenin?', options: ['İrlanda', 'İtalya', 'Meksika', 'Macaristan'], answer: 1, fact: 'İrlanda bayrağında kırmızı yerine turuncu var!', game: 'bayrak' },
  { id: 'bayrak-almanya', type: 'flag', flag: 'de', level: 1, q: 'Bu bayrak hangi ülkenin?', options: ['Belçika', 'Almanya', 'Avusturya', 'Polonya'], answer: 1, fact: 'Belçika bayrağı aynı renklerde ama dikey.', game: 'bayrak' },
  { id: 'bayrak-isvec', type: 'flag', flag: 'se', level: 2, q: 'Bu bayrak hangi ülkenin?', options: ['Norveç', 'Finlandiya', 'İsveç', 'Danimarka'], answer: 2, fact: 'İskandinav haçı ilk olarak Danimarka bayrağında kullanıldı.', game: 'bayrak' },
  { id: 'bayrak-irlanda', type: 'flag', flag: 'ie', level: 2, q: 'Bu bayrak hangi ülkenin?', options: ['İtalya', 'Fildişi Sahili', 'İrlanda', 'Hindistan'], answer: 2, fact: 'Fildişi Sahili bayrağı bunun ayna görüntüsü!', game: 'bayrak' },
  { id: 'bayrak-macaristan', type: 'flag', flag: 'hu', level: 2, q: 'Bu bayrak hangi ülkenin?', options: ['Bulgaristan', 'Macaristan', 'İran', 'İtalya'], answer: 1, fact: 'Bulgaristan bayrağında kırmızı en altta, beyaz en üstte.', game: 'bayrak' },
  { id: 'bayrak-izlanda', type: 'flag', flag: 'is', level: 3, q: 'Bu bayrak hangi ülkenin?', options: ['Norveç', 'İzlanda', 'Faroe Adaları', 'Finlandiya'], answer: 1, fact: 'Norveç bayrağı aynı desen ama kırmızı zeminli.', game: 'bayrak' },
  { id: 'bayrak-banglades', type: 'flag', flag: 'bd', level: 3, q: 'Bu bayrak hangi ülkenin?', options: ['Japonya', 'Palau', 'Bangladeş', 'Pakistan'], answer: 2, fact: 'Daire tam ortada değil, direğe doğru kaydırılmış.', game: 'bayrak' },
  { id: 'bayrak-luksemburg', type: 'flag', flag: 'lu', level: 4, q: 'Hollanda mı, Lüksemburg mu?', options: ['Hollanda', 'Lüksemburg'], answer: 1, fact: 'Lüksemburg’un mavisi daha açık — tek fark bu!', game: 'bayrak' },
  { id: 'bayrak-mali', type: 'flag', flag: 'ml', level: 4, q: 'Bu bayrak hangi ülkenin?', options: ['Gine', 'Senegal', 'Mali', 'Kamerun'], answer: 2, fact: 'Gine bayrağı aynı renklerin ters dizilişi.', game: 'bayrak' },
  { id: 'bayrak-romanya', type: 'flag', flag: 'ro', level: 5, q: 'Romanya mı, Çad mı?', options: ['Romanya', 'Çad'], answer: 0, fact: 'İkisi neredeyse aynı; Çad’ın mavisi biraz daha koyu.', game: 'bayrak' },
  { id: 'bayrak-endonezya', type: 'flag', flag: 'id', level: 5, q: 'Endonezya mı, Monako mu?', options: ['Endonezya', 'Monako'], answer: 0, fact: 'Renkler aynı, sadece bayrağın en-boy oranı farklı!', game: 'bayrak' },

  // ---------- plaka ----------
  { id: 'plaka-34', type: 'plate', plate: '34', level: 1, q: 'Bu plaka hangi ilin?', options: ['Ankara', 'İstanbul', 'İzmir', 'Bursa'], answer: 1, fact: 'İstanbul, Türkiye nüfusunun yaklaşık beşte birine ev sahipliği yapar.', game: 'turkiye-il-bulma' },
  { id: 'plaka-06', type: 'plate', plate: '06', level: 1, q: 'Bu plaka hangi ilin?', options: ['Ankara', 'Antalya', 'Adana', 'Aydın'], answer: 0, fact: 'Plaka kodları illerin eski alfabetik sırasından gelir.', game: 'turkiye-il-bulma' },
  { id: 'plaka-61', type: 'plate', plate: '61', level: 2, q: 'Bu plaka hangi ilin?', options: ['Rize', 'Ordu', 'Trabzon', 'Giresun'], answer: 2, fact: 'Trabzon’un komşuları: Rize, Giresun, Gümüşhane ve Bayburt.', game: 'turkiye-il-bulma' },
  { id: 'plaka-42', type: 'plate', plate: '42', level: 2, q: 'Bu plaka hangi ilin?', options: ['Kayseri', 'Konya', 'Sivas', 'Karaman'], answer: 1, fact: 'Konya, yüzölçümü en büyük ilimiz.', game: 'turkiye-il-bulma' },
  { id: 'plaka-27', type: 'plate', plate: '27', level: 3, q: 'Bu plaka hangi ilin?', options: ['Gaziantep', 'Diyarbakır', 'Şanlıurfa', 'Kahramanmaraş'], answer: 0, fact: 'Antep baklavası AB’de tescilli coğrafi işarete sahip.', game: 'turkiye-il-bulma' },
  { id: 'plaka-53', type: 'plate', plate: '53', level: 3, q: 'Bu plaka hangi ilin?', options: ['Ordu', 'Samsun', 'Artvin', 'Rize'], answer: 3, fact: 'Türkiye’nin çayının büyük kısmı Rize’den çıkar.', game: 'uretim-kartlari' },
  { id: 'plaka-44', type: 'plate', plate: '44', level: 4, q: 'Bu plaka hangi ilin?', options: ['Elazığ', 'Malatya', 'Adıyaman', 'Tunceli'], answer: 1, fact: 'Malatya, kayısısıyla dünyaca ünlüdür.', game: 'turkiye-il-bulma' },
  { id: 'plaka-78', type: 'plate', plate: '78', level: 4, q: 'Bu plaka hangi ilin?', options: ['Bartın', 'Karabük', 'Yalova', 'Kırıkkale'], answer: 1, fact: 'Karabük’ün Safranbolu evleri UNESCO listesinde.', game: 'turkiye-il-bulma' },
  { id: 'plaka-79', type: 'plate', plate: '79', level: 5, q: 'Bu plaka hangi ilin?', options: ['Osmaniye', 'Kilis', 'Düzce', 'Iğdır'], answer: 1, fact: 'Kilis, Suriye sınırında yer alır.', game: 'turkiye-il-bulma' },
  { id: 'plaka-68', type: 'plate', plate: '68', level: 5, q: 'Bu plaka hangi ilin?', options: ['Aksaray', 'Niğde', 'Karaman', 'Kırşehir'], answer: 0, fact: 'Ihlara Vadisi Aksaray sınırları içinde.', game: 'turkiye-il-bulma' },

  // ---------- emoji ----------
  { id: 'emoji-italya', type: 'emoji', emoji: '🍕🍝🛵', level: 1, q: 'Emojilerden ülkeyi bul!', options: ['İspanya', 'İtalya', 'Yunanistan', 'Fransa'], answer: 1, fact: 'Pizza Napoli’de doğdu.', game: 'geogo-nerede' },
  { id: 'emoji-japonya', type: 'emoji', emoji: '🍣🗻🎎', level: 1, q: 'Emojilerden ülkeyi bul!', options: ['Çin', 'Tayland', 'Japonya', 'Kore'], answer: 2, fact: 'Fuji Dağı aslında aktif bir yanardağ.', game: 'geogo-nerede' },
  { id: 'emoji-avustralya', type: 'emoji', emoji: '🦘🐨🏄', level: 2, q: 'Emojilerden ülkeyi bul!', options: ['Yeni Zelanda', 'Avustralya', 'Güney Afrika', 'Brezilya'], answer: 1, fact: 'Avustralya’da insandan çok kanguru yaşıyor.', game: 'seyahat-acentesi' },
  { id: 'emoji-meksika', type: 'emoji', emoji: '🌮🌵🪅', level: 2, q: 'Emojilerden ülkeyi bul!', options: ['Meksika', 'Peru', 'İspanya', 'Arjantin'], answer: 0, fact: 'Dünyada en çok İspanyolca konuşan ülke Meksika.', game: 'seyahat-acentesi' },
  { id: 'emoji-nevsehir', type: 'emoji', emoji: '🎈🏜️🍷', level: 3, q: 'Emojilerden ili bul!', options: ['Konya', 'Nevşehir', 'Eskişehir', 'Denizli'], answer: 1, fact: 'Kapadokya balonları her sabah gün doğumunda havalanır.', game: 'turkiye-il-bulma' },
  { id: 'emoji-bursa', type: 'emoji', emoji: '🍑🌰🚡', level: 4, q: 'Emojilerden ili bul!', options: ['Bursa', 'Kocaeli', 'Bolu', 'Sakarya'], answer: 0, fact: 'Bursa şeftalisi, kestane şekeri ve Uludağ teleferiği!', game: 'turkiye-il-bulma' },
  { id: 'emoji-diyarbakir', type: 'emoji', emoji: '🍉🏰🌶️', level: 4, q: 'Emojilerden ili bul!', options: ['Adana', 'Mardin', 'Diyarbakır', 'Hatay'], answer: 2, fact: 'Diyarbakır surları dünyanın en uzun surlarından.', game: 'turkiye-il-bulma' },
  { id: 'emoji-kanada', type: 'emoji', emoji: '🍁🏒🫎', level: 2, q: 'Emojilerden ülkeyi bul!', options: ['ABD', 'Norveç', 'Kanada', 'Rusya'], answer: 2, fact: 'Kanada’da dünyadaki göllerin yarısından fazlası var.', game: 'seyahat-acentesi' },

  // ---------- hangisi daha büyük ----------
  { id: 'vs-turkiye-teksas', type: 'vs', level: 2, q: 'Hangisi daha büyük?', options: ['Türkiye', 'Teksas'], values: [783562, 695662], answer: 0, fact: 'Türkiye, Teksas’tan yaklaşık %13 daha büyük.', game: 'gercek-boyut' },
  { id: 'vs-cezayir-gronland', type: 'vs', level: 3, q: 'Hangisi daha büyük?', options: ['Grönland', 'Cezayir'], values: [2166086, 2381741], answer: 1, fact: 'Haritalar Grönland’ı olduğundan kat kat büyük gösterir!', game: 'gercek-boyut' },
  { id: 'vs-konya-belcika', type: 'vs', level: 3, q: 'Hangisi daha büyük?', options: ['Belçika', 'Konya'], values: [30689, 38873], answer: 1, fact: 'Konya tek başına bir Avrupa ülkesinden büyük.', game: 'gercek-boyut' },
  { id: 'vs-japonya-almanya', type: 'vs', level: 4, q: 'Hangisi daha büyük?', options: ['Almanya', 'Japonya'], values: [357022, 377975], answer: 1, fact: 'Mercator haritası kuzeydeki ülkeleri büyütür.', game: 'gercek-boyut' },
  { id: 'vs-brezilya-abd', type: 'vs', level: 4, q: 'Hangisi daha büyük?', options: ['Brezilya', 'ABD (48 eyalet)'], values: [8515767, 8080464], answer: 0, fact: 'Alaska ve Hawaii hariç ABD, Brezilya’dan küçük.', game: 'gercek-boyut' },
  { id: 'vs-madagaskar-fransa', type: 'vs', level: 4, q: 'Hangisi daha büyük?', options: ['Fransa', 'Madagaskar'], values: [551695, 587041], answer: 1, fact: 'Madagaskar, dünyanın 4. büyük adası.', game: 'gercek-boyut' },
  { id: 'vs-rusya-pluton', type: 'vs', level: 5, q: 'Hangisi daha büyük?', options: ['Rusya', 'Plüton (yüzey)'], values: [17098246, 16650000], answer: 0, fact: 'Rusya’nın yüzölçümü Plüton’un tüm yüzeyinden fazla!', game: 'gercek-boyut' },
  { id: 'vs-van-luksemburg', type: 'vs', level: 5, q: 'Hangisi daha büyük?', options: ['Van Gölü', 'Lüksemburg'], values: [3713, 2586], answer: 0, fact: 'Van Gölü bir Avrupa ülkesinden daha büyük.', game: 'gercek-boyut' },

  // ---------- doğru mu yanlış mı ----------
  { id: 'tf-gronland', type: 'tf', level: 2, q: 'Grönland, Afrika kadar büyüktür.', options: ['DOĞRU', 'YANLIŞ'], answer: 1, fact: 'Afrika, Grönland’dan yaklaşık 14 kat büyük.', game: 'gercek-boyut' },
  { id: 'tf-avustralya-ay', type: 'tf', level: 3, q: 'Avustralya, Ay’dan daha geniştir.', options: ['DOĞRU', 'YANLIŞ'], answer: 0, fact: 'Avustralya ~4.000 km, Ay’ın çapı ~3.474 km.', game: 'gercek-boyut' },
  { id: 'tf-sudan', type: 'tf', level: 4, q: 'Sudan’da Mısır’dan daha fazla piramit var.', options: ['DOĞRU', 'YANLIŞ'], answer: 0, fact: 'Sudan’da 200’den fazla piramit bulunur.', game: 'kervan-yolu' },
  { id: 'tf-ankara', type: 'tf', level: 1, q: 'Türkiye’nin en kalabalık ili Ankara’dır.', options: ['DOĞRU', 'YANLIŞ'], answer: 1, fact: 'En kalabalık il İstanbul; Ankara ikinci.', game: 'sirala' },
  { id: 'tf-afrika-54', type: 'tf', level: 3, q: 'Afrika’da 54 ülke vardır.', options: ['DOĞRU', 'YANLIŞ'], answer: 0, fact: 'Afrika, en çok ülkeye sahip kıta.', game: 'harita-royale' },

  // ---------- klasik soru ----------
  { id: 'baskent-avustralya', type: 'text', level: 2, q: 'Avustralya’nın başkenti neresi?', options: ['Sidney', 'Melbourne', 'Canberra', 'Perth'], answer: 2, fact: 'Canberra, Sidney ile Melbourne arasında uzlaşma olarak kuruldu.', game: 'seyahat-acentesi' },
  { id: 'baskent-kanada', type: 'text', level: 2, q: 'Kanada’nın başkenti neresi?', options: ['Toronto', 'Ottawa', 'Vancouver', 'Montreal'], answer: 1, fact: 'Toronto en büyük şehir ama başkent Ottawa.', game: 'seyahat-acentesi' },
  { id: 'baskent-brezilya', type: 'text', level: 3, q: 'Brezilya’nın başkenti neresi?', options: ['Rio de Janeiro', 'São Paulo', 'Brasília', 'Salvador'], answer: 2, fact: 'Brasília 1960’ta sıfırdan inşa edildi.', game: 'seyahat-acentesi' },
  { id: 'il-buyuk', type: 'text', level: 2, q: 'Yüzölçümü en büyük ilimiz hangisi?', options: ['Sivas', 'Erzurum', 'Konya', 'Ankara'], answer: 2, fact: 'Konya, Belçika’dan bile büyük!', game: 'sirala' },
  { id: 'il-kucuk', type: 'text', level: 3, q: 'Yüzölçümü en küçük ilimiz hangisi?', options: ['Kilis', 'Yalova', 'Bartın', 'Düzce'], answer: 1, fact: 'Yalova yaklaşık 800 km² ile en küçük il.', game: 'sirala' },
  { id: 'komsu-sayisi', type: 'text', level: 3, q: 'Türkiye’nin kaç kara komşusu var?', options: ['6', '7', '8', '9'], answer: 2, fact: 'Nahçıvan sınırıyla Azerbaycan da komşumuz.', game: 'rota-kur' },
  { id: 'karadeniz', type: 'text', level: 3, q: 'Hangisinin Karadeniz’e kıyısı YOK?', options: ['Romanya', 'Gürcistan', 'Yunanistan', 'Bulgaristan'], answer: 2, fact: 'Karadeniz’e kıyısı olan 6 ülke var.', game: 'harita-royale' },
  { id: 'denizsiz-il', type: 'text', level: 4, q: 'Hangi ilin denize kıyısı YOK?', options: ['Bartın', 'Zonguldak', 'Karabük', 'Sinop'], answer: 2, fact: 'Karabük, Karadeniz’e çok yakın ama kıyısı yok.', game: 'turkiye-il-bulma' },
  { id: 'iki-kita', type: 'text', level: 4, q: 'Hangisi iki kıtada toprağı olan bir ülke DEĞİL?', options: ['Mısır', 'Kazakistan', 'İran', 'Rusya'], answer: 2, fact: 'Mısır’ın Sina Yarımadası Asya’da kalır.', game: 'harita-royale' },
  { id: 'saat-dilimi', type: 'text', level: 5, q: 'En çok saat dilimi olan ülke hangisi?', options: ['Rusya', 'ABD', 'Fransa', 'Çin'], answer: 2, fact: 'Denizaşırı topraklarıyla Fransa 12 saat dilimine yayılır.', game: 'harita-royale' },
  { id: 'findik', type: 'text', level: 1, q: 'Dünyada en çok fındığı hangi ülke üretir?', options: ['İtalya', 'Türkiye', 'ABD', 'Gürcistan'], answer: 1, fact: 'Dünya fındığının yarısından fazlası Türkiye’den.', game: 'uretim-kartlari' },
  { id: 'en-yuksek-dag', type: 'text', level: 1, q: 'Türkiye’nin en yüksek dağı hangisi?', options: ['Erciyes', 'Ağrı Dağı', 'Uludağ', 'Süphan'], answer: 1, fact: 'Ağrı Dağı 5.137 metre.', game: 'harita-royale' },
];

// Videonun başındaki "kanca" cümleleri (ilk 2 saniye izleyiciyi tutar)
export const HOOKS = [
  { top: 'Sadece %1’i', big: '5/5 yapabiliyor', sub: 'Seviye seviye zorlaşıyor 🔥' },
  { top: '3 saniyen var', big: 'Bilebilecek misin?', sub: 'Son soru çok zor 😳' },
  { top: 'Öğretmenim bile', big: 'Hepsini bilemedi', sub: 'Sen kaç tane bileceksin?' },
  { top: 'Coğrafya dâhisi', big: 'misin, değil misin?', sub: '5 soru • 3 saniye' },
  { top: 'Bunu bilen', big: 'gerçek dâhi 🧠', sub: 'Sonuna kadar izle!' },
];

// Bir tema verilirse sadece o türlerden seçer
export const THEMES = {
  karisik: { label: 'Karışık', types: null },
  bayrak: { label: 'Bayraklar', types: ['flag'] },
  plaka: { label: 'Plakadan il', types: ['plate'] },
  emoji: { label: 'Emojiden bul', types: ['emoji'] },
  boyut: { label: 'Hangisi büyük?', types: ['vs', 'tf'] },
  bilgi: { label: 'Genel kültür', types: ['text', 'tf'] },
};

export const questionById = (id) => BANK.find((q) => q.id === id);
