# OCAK — DURUM

**Son güncelleme:** 19 Ağustos 2026 · **Marka işareti mühürlendi ve yerleşti** — KARAR 522 · 523; yeni borçlar B105 · B107 (B106 aynı gün kapandı)

> **200 SATIR HARD CAP (KARAR 457).** Aşarsa en eski dönem bloğu `90-kronoloji/`'ye iner.
> İçerik **silinmez, taşınır** (KIRPMA YASAĞI, KARAR 61). Bu dosya karar durumlarını ve
> borçları **tekrar etmez, işaret eder** — ikisi de kendi dosyasında yaşar.
>
> *Şu an: 200 satır (`wc -l`, 19 Ağustos üç-format turu) — **pay 0, tavan doldu**. Önceki turda üç dönem
> bloğu daha tahliye edildi (7–8 Ağu · 10 Ağu · 11 Ağu ikinci tur, 11 satır); özetleri
> `90-kronoloji/2026-08.md` sonuna **taşındı**, silinmedi ve inmeden önce kalem kalem
> kronolojiye karşı doğrulandı. Sonraki tahliye adayı: `11 Ağustos` (B47 · B58).
> **`ŞU AN NEREDEYİZ` bloğu aday DEĞİL** — kapanmış tur gibi görünür ama içinde canlı
> iş var (B36-b · B53/B51 · `baglam.sh` emekli edilmedi).*

| Ne arıyorsan | Nereye bak |
|---|---|
| **hangi dosya neyi taşır, çelişkide kim kazanır** | **`05-harita.md`** |
| bir kararın durumu / halefi | `01-kararlar.tsv` |
| bir kararın **gerekçesi** | `90-kronoloji/YYYY-AA.md` — aylık dilim, tam tarihçe (tsv'nin `kaynak` sütunu işaret eder) |
| açık borç, sahip, tetikleyici | `02-borclar.md` |
| sıradaki iş, kim, nasıl açılır | `03-sira.md` |
| marka çekirdeği | `10-marka.md` |
| marka tam metni, kurucu, ekip, görsel kimlik, yayılım | `20-ref-marka.md` |
| ekosistem katmanları, format kanonları, araç kutusu, ürün takvimi | `20-ref-program.md` |
| sayfa mimarisi, stack, CTA, tracking | `20-ref-site.md` |
| kod/teşhis/merge/brief disiplinleri | `20-ref-protokoller.md` |
| metin, vurgu, dil, teslim standartları | `20-ref-icerik-dili.md` |
| Notion DB, schema, yazım sözleşmesi | `20-ref-notion.md` |
| bot, n8n, WhatsApp, Meta | `20-ref-bot.md` |
| sosyal medya ilk 30 gün — kart kart uygulama | `30-sosyal.md` |

---

## ŞU AN NEREDEYİZ

**Doküman mimarisi geçişi — ADIM 7 birinci dalgası bitti.** Tesisat kuruldu: `CLAUDE.md`
repo kökünde, `baglam.sh` beş profille çalışıyor, project files boşaltıldı, `mcp/` sunucusu
Railway'de canlı. **Faz kapanmadı** — `docs_karar(no)` ve bağlantının kalıcı ucu ikinci dalgada.
Yol haritası: `2026-08-06-ocak-gecis-plani.md` — **sonundaki SAPMA KAYDI'nı ve EK'ini okumadan brief yazma** (gövde dokuz yerinden bayat; ilk altısı 7 Ağu kaydında, üçü 8 Ağu ekinde).

- **ADIM 1–6 ✅ (6–8 Ağu)** — ledger · Pilot bölünmesi · KARAR arkeolojisi · `CLAUDE.md`
  + `baglam.sh` · altı skill kadrosu. Tam kayıt **11 Ağustos tahliyesiyle**
  `90-kronoloji/2026-08.md`'ye indi (KARAR 457). Açık kalan tek ayak: **B36-b** (Claude.ai).
- **ADIM 7 birinci dalga ✅** — `mcp/` doğdu, Railway'de canlı, claude.ai'ye bağlı.
  Korpus **git deposundan** servis edilir (KARAR 479) — 105 dosya · 63 canlı · 42 arşiv
  (`docs_envanter`, `1d6726d`). Auth zorunlu; token URL yolunda — **ödün, B53'te görünür**.
- **ADIM 7 ikinci dalga — A+B ✅** — `docs_karar(no)` doğdu, dört araç oldu.
  Çapa sözleşmesi iki eksenli (KARAR 480); sığ çapa kendini bayrakla ilan ediyor
  (KARAR 481). `docs_envanter` artık kapsamını ve dağıtım ödününü söylüyor — **B54 ✅**.
  ⏸ **Kalan:** C parçası (B53, bağlantının başlığa geçmesi) claude.ai'de `Request headers`
  bölümü olmadığı için **düşürüldü**; D parçası (B51) ona bağlı olduğu için koşulmadı.
  İkisi de kendi hatlarında bekler. `baglam.sh` **emekli edilmedi**.
- **B01 ✅ (10 Ağu)** — klon · remote · Vercel proje adı üçü de `ocak`. Repo içi canlı yol
  referansları 13 → 3 satır (kalan üçü bilerek korundu). Tek commit `50294e6`, sıfır site
  kodu. Vercel git bağlantısı `githubRepoId` üzerinden **kırılmadı**, MCP damgası ilerledi
  — ikisi de ölçüldü. Yeni borç: **B58 · B59 · B60**.
- **B47 ✅ (11 Ağu)** — `05-harita.md` doğdu. Liste değil **otorite sırası**: ham gerçeklik →
  kronoloji → gövde → indeks → ayna. **KARAR 482** mühürlendi (indeks, indekslediği gövdeyi
  asla yenmez). B40 · B55 · B56 karar borcu olmaktan çıktı, mekanik yazıma indi. **B58 ✅.**
- **B40 · B55 · B56 ✅ (11 Ağu)** — KARAR 482'nin ilk uygulaması, tek commit `b72c539`.
  `61/88` → `61` (88 KIRPMA'nın kardeşi değil, patch modunun halefi). Sahip tablosu
  gövdelerden yeniden türetildi, beş bayat kalem çıktı. Ledger düzeltildi, kronoloji
  **şerh** aldı — iki dosya bilerek aynı işlemi görmedi. **KARAR 483** mühürlendi.
- **Marka işareti ✅ (18–19 Ağu)** — OCAK'ın ilk logosu doğdu, mühürlendi (**KARAR 522**)
  ve siteye yerleşti. Cormorant Garamond Light "O", iç boşlukta radyal kor; harfler
  outline (font bağımlılığı yok), dosyalarda **SVG filtresi yok**, dolgu kuralı
  `nonzero`. Kor yarıçapı iç boşluğun %70'i. `public/` beş varlık, `Layout.astro`
  üç icon link, `Nav.astro` düz wordmark → `<img>`; nav yüksekliği değişmedi.
  Aynı turda **başlık kanonu** düzeldi (**KARAR 523**): sekiz rotada çift "OCAK"
  vardı, marka tek sahibe indi. Instagram · WhatsApp · e-posta anteti hâlâ eski →
  **B105**.

**Otorite:** master dosyaların gerçek kopyası **repodadır** (`docs/`). Project files
kopyaları 6 Ağustos'tan sonra bayattır ve güncellenmez — `10-marka.md` tek istisna
(KARAR 455). O kopya **otorite değil aynadır**; repo değişince elle tazelenir, çelişkide
repo kazanır (KARAR 471). Bağlam iki kanaldan gelir: soğuk başlangıçta `baglam.sh`
yapıştırması, tur içinde MCP çekmesi. MCP **git deposunu** okur, yerel diski değil
(KARAR 479) — `.gitignore`'lu dosyalar oradan görünmez.

**Sohbet sonu artık patch'tir (KARAR 462):** tam yenileme yok. Tek `docs-patch-YYYY-AA-GG.md`
üretilir → CC uygular. `00-durum.md`'ye **hedefli** yazım, kronolojiye append.

---

## KOD / DEPLOY GERÇEĞİ

| | |
|---|---|
| `main` dönem HEAD | **`c45332e`** (19 Ağu, Sayfalar loader Durum filtresi) — canlı HEAD değil, dönemin son commit'i · kapanış commit'inden bir önceki (KARAR 474). Bu tur **dört kod commit'i** ekledi: `fd5c44a` işaret yerleşimi · `f7e4d73` kare varlık düzeltmesi · `cbac605` başlık markası · `c45332e` Durum filtresi. Dönem zinciri `7fffd92 → … → a758994 → c035011 → 9821d3d → 70e1492 → 392ad33 → fd5c44a → f7e4d73 → 7d8d301 → b926294 → 354fb14 → ae321a3 → 3676628 → cbac605 → c45332e` |
| Dal modeli | `main` = production (push otomatik canlı) · `astro-iskelet` = **ölü dal**, main'in ata'sı, 85 commit geride (KARAR 485) |
| Çalışma dizini | **`~/Desktop/hlaorpz/ocak`** · remote `hlaorpz/ocak` (B01, 10 Ağu) — tek klon (KARAR 463) |
| Test | **246/246** yeşil — 13 dosya. 193→246 farkı: Faz 1 (referans kodu + kara liste, havale açıklaması, soyad/`last_name`, `kadinAdiBirlestir`) + `nav-kaydir` · `gecersiz-alan-goster` |
| Build | **32 prerender + 10 SSR + 6 API route.** Tek sayıya inmez; Pilot'un "33"ü hiçbirine denk gelmiyordu (D7 kapandı) |
| robots.txt | `Disallow: /` — **stealth sürüyor.** Yeni bağ: ilk sosyal post duyurudur → **Gün 1 aynı zamanda robots kararıdır** (KARAR 149) |
| Kanonik adres | **`www.ocak.biz`** (`688bee5`) — köksüz `ocak.biz` 307 ile www'ye döner |
| Deploy hook | ⚠ `tZR9LcwJq9` → **`astro-iskelet`** (ölü dal). Yenisi `notion-content-update-main` → `main` **oluşturuldu ama çağıran yok** — **B64**. Notion webhook + gece cron hâlâ eskisini paylaşır |
| Vercel | Team `team_EVx2zHhI9iYscmqsuHckk599` · Project `prj_CxW3Nm85TGzdrZdePCk74WLAv23f` · proje adı **`ocak`** · dört domain ayağının dördü de `ocak-*` (**B58 ✅**, 11 Ağu) |
| Ödeme | **Kart akışı `KART_AKISI` env anahtarıyla KAPALI** (KARAR 488) — kod silinmedi, altı tüketici anahtarın arkasında. Tek yol **banka havalesi/EFT**, takip elle. Varsayılan kapalı: açmak için `KART_AKISI=acik` gerekir |
| Referans kodu | **`OCAK-` + 4 karakter**, 29'luk alfabe (`Z` yok — yanlış okunursa geçerli kod üretir; `L` var — `1` alfabede yok, hata gürültülü çıkar). Uzay 29⁴ = 707.281. Notion'da 5 ve 6 haneli eski rakamsal kodlar da yaşıyor, **migration yok** |
| ⚠ Ödeme onayı | **Kapı doğru, açan mekanizma YOK.** `odeme_durumu` üçüncü değeri `alindi` hiçbir kod tarafından yazılmıyor → ödemesi gelen kadına Zoom/adres bilgisi **elle** gidiyor. n8n akışı kurulana kadar böyle (`03-sira.md` madde 2, sıranın en kritik maddesi) |
| MailerLite | **On iki custom field** (envanter `20-ref-bot.md`). Ödeme kapısı canlı (KARAR 486) · alan hijyeni canlı (`92e580e`). Otomasyon `OCAK — kayıt onayı (tüm formatlar)` kurulu — tetik `Updates field: etkinlik_adi`, koşul `odeme_durumu`; **aktif mi pause mu Kaan'da doğrulanacak** |

---

## YAYINI KİLİTLEYENLER

Detay ve sahipler `02-borclar.md`'de. Burada yalnız kilit zinciri:

1. **B19 — WhatsApp display name** (Kaan). `…5226` hattında **"Ocak Kadın Çemberi" ONAYLI** (19 Ağu). Kalan iş yalnız `…0888` hattı: ad başvurusu (KARAR 521) + bot bağlama — **B104**.
   Numara yayını buna kilitli **değil** — KARAR 396 kapandı, bot hattı `905325555226` canlı (`354fb14`). Bot hattı ≠ yasal sayfa telefonu (`+90 532 208 0888`, beş yasal sayfa) — kasıtlı iki yüzey, eşitlenmez (KARAR 518).
2. **Sosyal v2 `[KAAN]` önkoşulları** — kurucu görsel + `KURUCU-URL` ara-değiştir.
   Gün 1 yayını bunsuz başlamaz (KARAR 450).
3. **Yolculuk fiyat bandı → ilk Yolculuk etkinliği.** Eylül kohortu duyurusunun önkoşulu.

**Kapanan halka — etkinlik tarihleri.** 15 yayında etkinlik (6 Açık Kapı · 4 Çember ·
3 Seremoni · 1 Yolculuk · 1 Atölye), tarihli/saatli/gövdeli, ilki **31 Ağustos**; yedi
format kayıt route'u + `/anadolu/basvuru` + `/iletisim/bize-yaz` **canlı** (dumptan).

---

## SESSİZ KIRILMA NOKTALARI

Hepsi "site bozulmaz, özellik sessizce düşer" sınıfı. Metinleri işaret edilen dosyada.

- **`atmosfer.css:1538-1552` genişlik kolonu** — yeni CTA/kart section buraya eklenmezse
  baseline prose alır, geniş çıkar. Dört selektör. → `20-ref-site.md`
- **`ODA_MAP` kapalı settir** — kod tarafı girdi yoksa yeni Notion sayfası 404. → **numara teyitsiz, B35** (KARAR 87 üç ayrı şeye atfediliyor)
- **Notion marker adı = kod sözleşmesi** — ad değişimi component'i haftalarca render
  dışı bırakabilir. → `20-ref-protokoller.md` (KARAR 409)
- **`[class^="ocak-"]` prefix-match** — `ocak-` ilk class değilse baseline sessizce düşer.
  → `20-ref-protokoller.md` (KARAR 375)
- **`.env` yükleme sırası** — `.env.local` `.env`'i ezer. Kalan ayak: `.env.preview`
  (27 Mayıs) hâlâ bir `NOTION_TOKEN` tanımlıyor. → `02-borclar.md` B28
- **Build-time tarih TZ'ye sabitlenmeli** — `new Date()+setHours` TR 00:00–03:00'te gün
  kaydırır. Test tarafı artık `TZ:'UTC'` ile korunuyor. → KARAR 385 + **464** (`vitest.config.ts:12` teyitli)
- **"Kod var" ≠ "output var"** — durum component dosyasından değil `dist/` grep'inden
  okunur. → `20-ref-protokoller.md` (KARAR 355 / 408)

⚠ **`02-borclar.md` bir yapılacaklar listesi değildir** — fark edilmiş ama kapatılmamış
tutarsızlıkların defteridir. Ürün işi (ödeme, WhatsApp, Instagram, mail akışları) oraya
girmez; o kuyruk başka yerde yaşar.

---

## BU DÖNEM NE OLDU

- **19 Ağustos (B turu — sosyal medya + AÇILIŞ):** Sosyal v2 planı taze site dumpına karşı
  ölçüldü — **27 aynen · 3 cümle düzeltmesi · 0 yeniden yazım · 5 yeni malzeme**; baştan yazım
  düştü, v2.1 patch'lendi ve `30-sosyal.md` olarak repoya alındı. **AÇILIŞ 24–27 Eylül 2026**
  kesinleşti (KARAR 492). Dump 2. turda kabul testinden geçti; 1. tur etkinlik gövdelerinin
  dörtte üçünü sessizce kaybetmişti — KARAR 495 bu vakadan doğdu. → `90-kronoloji/2026-08.md`
- **19 Ağustos (Faz 1 — ödeme yüzeyi):** Kart akışı **silinmeden** kapatıldı
  (`KART_AKISI`, KARAR 488). Referans kodu `OCAK-XXXX`'e indi — 29'luk alfabe,
  15 maddelik kara liste (KARAR 489 · 490). Havale açıklamasından **isim çıktı**,
  satır saf ASCII oldu. Forma **Soyad** eklendi, **Şehir** ve **Telefon** sunucuda
  zorunlulaştı; `last_name` MailerLite'a canlı aboneden teyitli (**B76 ✅**).
  `A.Ş.` satır kırılması CSS'ti, düzeldi. Geçersiz alan kaydırması bir kez kör
  uygulanıp canlıda kapanmadı, `nav-kaydir.ts` ortak yardımcısıyla düzeldi
  (KARAR 491 bu hatadan doğdu). → `90-kronoloji/2026-08.md`
- **Daha eski dönemler** (11 Ağu · 17–19 Ağu üç format · 18–19 Ağu içerik+altyapı) → `90-kronoloji/2026-08.md` (19 Ağu tahliyesi, KARAR 457/61)

---

## AÇIK CEPHELER

Sayı ve detay `02-borclar.md`'de; burada yalnız cephe adı + sahip.

| Cephe | Sahip |
|---|---|
| WhatsApp/Meta onay hattı | Kaan |
| Yolculuk fiyatlandırma → ilk etkinlik | Kaan + Advaita |
| Sosyal medya Gün 0/Gün 1 önkoşulları | Kaan |
| CC kod kuyruğu (hash listener, Turnstile, Safari banding, ilk hafta paketi) | CC |
| İçerik tarama turları (Uluslararası sweep, "sembolik ücret") | Claude.ai → Notion |
| Sığ çapa onarımı **B36-a ✅** — iş B36-b'ye devretti | — |
| Sığ çapa onarımı **B36-b** (desen dışı) + KARAR 87 ayrıştırma (B35) | Claude.ai |
| `10-marka.md` aynasının tazelenmesi (KARAR 471, ilk tatbik) | Kaan |
| B53 bağlantı ucu (beta bekliyor) + B51 (B53'e bağlı) | Kaan + CC |

---

## DEĞİŞMEYEN ÜÇ ŞEY

1. **Her sayfa/konu ayrı sohbet** (KARAR 52) — bağlam kirliliği hâlâ gerçek.
2. **ADIM 0 salt-read** (KARAR 355) — agentlara da uygulanır, `ocak-arsivci` dahil.
   Teşhis `dist/`ten konuşur, dump'tan değil.
3. **iPhone Safari eyeball** — merge öncesi, otomatikleşmez. Test yeşili ≠ göz temiz.

---

**Lansman tanımı (KARAR 149):** lansman = robots Allow + duyuru. Sitenin canlı olması değil.
Site zaten stealth-canlı. **İlk kohort hedefi: 24–27 Eylül 2026 — Anadolu Yolculuğu AÇILIŞ.**
**Fiyatlandırma:** bu dokümanda rakam tahmini yapılmaz. **Kaan** site sayfalarında görünmez
(KARAR 89).
