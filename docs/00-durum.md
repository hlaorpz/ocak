# OCAK — DURUM

**Son güncelleme:** 8 Ağustos 2026 · **ADIM 5 ✅** · KARAR 473 · 474 mühürlendi

> **200 SATIR HARD CAP (KARAR 457).** Aşarsa en eski dönem bloğu `90-kronoloji/`'ye iner.
> İçerik **silinmez, taşınır** (KIRPMA YASAĞI, KARAR 61/88). Bu dosya karar durumlarını ve
> borçları **tekrar etmez, işaret eder** — ikisi de kendi dosyasında yaşar.
>
> *Şu an: 153 satır (`wc -l`, 8 Ağustos). Kalan pay bir sonraki dönemin durumu içindir.*

| Ne arıyorsan | Nereye bak |
|---|---|
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

---

## ŞU AN NEREDEYİZ

**Doküman mimarisi geçişi — ADIM 4 bitti.** Tesisat kuruldu: `CLAUDE.md` repo kökünde,
`baglam.sh` beş profille çalışıyor, project files boşaltıldı.
Yol haritası: `2026-08-06-ocak-gecis-plani.md` — **sonundaki SAPMA KAYDI'nı ve EK'ini okumadan brief yazma** (gövde dokuz yerinden bayat; ilk altısı 7 Ağu kaydında, üçü 8 Ağu ekinde).

- **ADIM 1–2 ✅** — KARAR envanteri + ledger durum sütunu (453 satır).
- **ADIM 3 ✅** — Pilot bölünmesi + bu dosya + `20-ref-*` beşlisi + kronoloji dilimleri.
- **ADIM 3b ✅** — KARAR arkeolojisi. TEYITSIZ 27 → 3. B05·B06·B13·B20 kapandı;
  454 sahte satırı `REZERVE`'e döndü. Kalan: **B33** (ledger `kaynak` dönüşümü, CC,
  KARAR 465) ✅ kapandı. **B32 ✅** — `ocak-referans.md` dağıtıldı; beşli yedili oldu (`20-ref-program.md` + `20-ref-marka.md`). Kaynak dönüşümü aynı turda kapandı (KARAR 467).
- **ADIM 4 ✅** — `CLAUDE.md` (kök, dokuz bölüm) + `scripts/baglam.sh` (beş profil:
  `kod · icerik · marka · bot · dokuman`, manifest satırı + eksik-dosya guard'ı) +
  project files silme izni (14/14 ledger hedefi yaşıyor, sıfır `ÖLÜ`).
  Yedi `20-ref-*` dosyasının hepsi en az bir profilde. B01 (klon yeniden adlandırma) açık.
- **ADIM 5 ✅** — `ocak-arsivci` · `ocak-teshis` · `ocak-lint` doğdu; `skill-sync.sh`
  symlink+zip (KARAR 473). B42 kapandı. `ocak-notion` sapması çözülmedi.
- **ADIM 6 ⏭** — `ocak-kararci` · `ocak-metin`. Kadro tanımı KARAR 458;
  `ocak-metin` taslak-only, en az üç ay (KARAR 459).
- **ADIM 7** — docs MCP sunucusu, endgame. 4–6 oturmadan açılmaz.
  Çapa çözümlemesi KARAR 472'ye tabidir — `docs_karar(no)` kendi kuralını icat edemez.

**Otorite:** master dosyaların gerçek kopyası **repodadır** (`docs/`). Project files
kopyaları 6 Ağustos'tan sonra bayattır ve güncellenmez — `10-marka.md` tek istisna
(KARAR 455). O kopya **otorite değil aynadır**; repo değişince elle tazelenir, çelişkide
repo kazanır (KARAR 471). Her sohbet açılışında bağlam yapıştırılır — `baglam.sh` ile.

**Sohbet sonu artık patch'tir (KARAR 462):** tam yenileme yok. Tek `docs-patch-YYYY-AA-GG.md`
üretilir → CC uygular. `00-durum.md`'ye **hedefli** yazım, kronolojiye append.

---

## KOD / DEPLOY GERÇEĞİ

| | |
|---|---|
| `main` dönem HEAD | **`265d75c`** (8 Ağu, ADIM 5 skill turu sonu) — canlı HEAD değil, dönemin son commit'i · kapanış commit'inden bir önceki (KARAR 474); sıfır site kodu commit'i, `dist/` değişmedi |
| Dal modeli | `main` = production (push otomatik canlı) · `astro-iskelet` = preview tamponu |
| Test | **181/181** yeşil — 10 dosya. 176→181 farkı KARAR 464'ün 5 TZ sınır testi |
| Build | **32 prerender + 10 SSR + 6 API route.** Tek sayıya inmez; Pilot'un "33"ü hiçbirine denk gelmiyordu (D7 kapandı) |
| robots.txt | `Disallow: /` — **stealth sürüyor** |
| Deploy hook | `tZR9LcwJq9` → dal **`astro-iskelet`**; Notion webhook + gece cron aynı hook'u paylaşır |
| Vercel | Team `team_EVx2zHhI9iYscmqsuHckk599` · Project `prj_CxW3Nm85TGzdrZdePCk74WLAv23f` |
| Ödeme | banka sanal POS'a geçiliyor; entegratör belirsiz, `payment-provider.ts` stub |

---

## YAYINI KİLİTLEYENLER

Detay ve sahipler `02-borclar.md`'de. Burada yalnız kilit zinciri:

1. **B19 — WhatsApp display name** (Kaan). Meta iki adayı da reddetti; itiraz açık.
   Site WhatsApp numarasının yayını buna kilitli (KARAR 396).
2. **Sosyal v2 `[KAAN]` önkoşulları** — kurucu görsel + `KURUCU-URL` ara-değiştir.
   Gün 1 yayını bunsuz başlamaz (KARAR 450).
3. **Yolculuk fiyat bandı → ilk Yolculuk etkinliği.** Eylül kohortu duyurusunun önkoşulu.

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

---

## BU DÖNEM NE OLDU

- **12–20 Temmuz (14 sohbet, KARAR 363–453):** hero geçişi, etkinlik liste tek-kabuk,
  kayıt penceresi + TZ fix, banka POS geçişi, liste ailesi tek gramer, kayıt butonu
  birleştirme (`kayit-cta` emekli), Yolculuk 7. kapı ürün+metin, Fable editoryal turu,
  sosyal medya ajans v2. Dönemin HEAD'i `e8a16dd`. → `90-kronoloji/2026-07.md`
- **4 Ağustos:** bakım turu — dört borç kapandı, iki içerik kalıntısı Notion'da düzeltildi.
- **6 Ağustos:** doküman mimarisi geçişi (KARAR 455–463) + kod teyidi 3 tur (7 commit,
  altı borç kapandı) + ADIM 2 ledger + **ADIM 3 bölme**. → `90-kronoloji/2026-08.md`
- **7–8 Ağustos:** B32 (referans dağıtımı, beşli → yedili) · B33 · B37 · B34 ·
  **ADIM 4** (CLAUDE.md + baglam.sh + tam taşıma) · **B36 açılış ölçümü**
  (mekanik çapaların %43'ü komşusunu gösteriyor, kuyruk ~179±, üçte ikisi tek desen) ·
  KARAR 465–472. Sıfır kod commit'i. → `90-kronoloji/2026-08.md`

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
| Sığ çapa onarımı **B36-a** (karar-listesi deseni, mekanik) | CC |
| Sığ çapa onarımı **B36-b** (desen dışı) + KARAR 87 ayrıştırma (B35) | Claude.ai |
| `10-marka.md` aynasının tazelenmesi (KARAR 471, ilk tatbik) | Kaan |
| Doküman geçişi ADIM 5-6 | CC |

---

## DEĞİŞMEYEN ÜÇ ŞEY

1. **Her sayfa/konu ayrı sohbet** (KARAR 52) — bağlam kirliliği hâlâ gerçek.
2. **ADIM 0 salt-read** (KARAR 355) — agentlara da uygulanır, `ocak-arsivci` dahil.
   Teşhis `dist/`ten konuşur, dump'tan değil.
3. **iPhone Safari eyeball** — merge öncesi, otomatikleşmez. Test yeşili ≠ göz temiz.

---

**Lansman tanımı (KARAR 149):** lansman = robots Allow + duyuru. Sitenin canlı olması değil.
Site zaten stealth-canlı. **İlk kohort hedefi: Eylül 2026 — Anadolu Yolculuğu açılışı.**
**Fiyatlandırma:** bu dokümanda rakam tahmini yapılmaz. **Kaan** site sayfalarında görünmez
(KARAR 89).
