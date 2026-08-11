# OCAK — DURUM

**Son güncelleme:** 11 Ağustos 2026 · **B40 · B55 · B56 ✅** — KARAR 482'nin ilk uygulaması; KARAR 483

> **200 SATIR HARD CAP (KARAR 457).** Aşarsa en eski dönem bloğu `90-kronoloji/`'ye iner.
> İçerik **silinmez, taşınır** (KIRPMA YASAĞI, KARAR 61). Bu dosya karar durumlarını ve
> borçları **tekrar etmez, işaret eder** — ikisi de kendi dosyasında yaşar.
>
> *Şu an: 184 satır (`python3`, 11 Ağustos). ADIM 1–6 blokları kronolojiye indi
> (11 Ağu tahliyesi); pay yeniden açıldı.*

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
| `main` dönem HEAD | **`b72c539`** (11 Ağu, B40 · B55 · B56 — KARAR 482'nin ilk uygulaması) — canlı HEAD değil, dönemin son commit'i · kapanış commit'inden bir önceki (KARAR 474); sıfır site kodu commit'i, `dist/` değişmedi |
| Dal modeli | `main` = production (push otomatik canlı) · `astro-iskelet` = preview tamponu |
| Çalışma dizini | **`~/Desktop/hlaorpz/ocak`** · remote `hlaorpz/ocak` (B01, 10 Ağu) — tek klon (KARAR 463) |
| Test | **181/181** yeşil — 10 dosya. 176→181 farkı KARAR 464'ün 5 TZ sınır testi |
| Build | **32 prerender + 10 SSR + 6 API route.** Tek sayıya inmez; Pilot'un "33"ü hiçbirine denk gelmiyordu (D7 kapandı) |
| robots.txt | `Disallow: /` — **stealth sürüyor** |
| Deploy hook | `tZR9LcwJq9` → dal **`astro-iskelet`**; Notion webhook + gece cron aynı hook'u paylaşır |
| Vercel | Team `team_EVx2zHhI9iYscmqsuHckk599` · Project `prj_CxW3Nm85TGzdrZdePCk74WLAv23f` · proje adı **`ocak`** · dört domain ayağının dördü de `ocak-*` (**B58 ✅**, 11 Ağu) |
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

⚠ **`02-borclar.md` bir yapılacaklar listesi değildir** — fark edilmiş ama kapatılmamış
tutarsızlıkların defteridir. Ürün işi (ödeme, WhatsApp, Instagram, mail akışları) oraya
girmez; o kuyruk başka yerde yaşar.

---

## BU DÖNEM NE OLDU

- **12–20 Temmuz (14 sohbet, KARAR 363–453):** hero geçişi, etkinlik liste tek-kabuk,
  kayıt penceresi + TZ fix, banka POS geçişi, liste ailesi tek gramer, kayıt butonu
  birleştirme (`kayit-cta` emekli), Yolculuk 7. kapı ürün+metin, Fable editoryal turu,
  sosyal medya ajans v2. Dönemin HEAD'i `e8a16dd`. → `90-kronoloji/2026-07.md`
- **11 Ağustos (ikinci tur):** **B40 · B55 · B56 ✅** — KARAR 482'nin ilk uygulaması.
  Üçü de "önce karar" şartını 482 sayesinde düşürdü. **KARAR 483** mühürlendi: brief'in
  düzyazı rakamı kendi gövdesiyle sınanmadan yazılmaz — üç günde dört ölçülmüş vaka.
- **11 Ağustos:** **B47 ✅ + B58 ✅** — doküman haritası (`05-harita.md`) yazıldı,
  KARAR 482 mühürlendi. B47 gövdesinin "harita hiçbir dosyada yok" iddiası ölçümle
  yanlışlandı: iki kısmi harita vardı, eksik olan **otorite kuralıydı**.
- **10 Ağustos:** **B01 ✅** — kapı işi. GitHub remote · yerel klasör · Vercel proje adı
  üçü de `ocak`. Bir commit, sıfır site kodu. CC dört sapma bildirdi, dördü de haklıydı;
  biri brief'in `N → 0` kriterinin kendi kaydını sayması (KARAR 465'in ikinci vakası).
  → `90-kronoloji/2026-08.md`
- **9 Ağustos (ikinci tur):** ADIM 7 ikinci dalga A+B — `docs_karar` + B54, üç commit,
  sıfır site kodu. Ledger'ın ölçülmüş sığlığı **126/418**'e genişledi (119 indeks + 7
  komşu; b36a'nın 119'u bağımsız doğrulandı). KARAR 480 · 481. → `90-kronoloji/2026-08.md`
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
Site zaten stealth-canlı. **İlk kohort hedefi: Eylül 2026 — Anadolu Yolculuğu açılışı.**
**Fiyatlandırma:** bu dokümanda rakam tahmini yapılmaz. **Kaan** site sayfalarında görünmez
(KARAR 89).
