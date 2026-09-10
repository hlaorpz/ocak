# OCAK — DURUM

**Son güncelleme:** 10 Eylül 2026 · **N-Kolay turu — kart yüzeyi mock'la geri açıldı** — KARAR 573–577; on commit, dokuzu kod; B180 koruma ayağı ✅; B185–B193 açıldı. Önceki: 24 Ağustos (MJ görsel turu — V03 kapanışı, KARAR 568–572).

> **200 SATIR HARD CAP (KARAR 457).** Aşarsa en eski dönem bloğu `90-kronoloji/`'ye iner.
> İçerik **silinmez, taşınır** (KIRPMA YASAĞI, KARAR 61). Bu dosya karar durumlarını ve
> borçları **tekrar etmez, işaret eder** — ikisi de kendi dosyasında yaşar.
>
> *Şu an: 10 Eylül ölçümü — **B131 açık.** Bu turda iki blok indi: `ŞU AN NEREDEYİZ`in
> ADIM 7 dalgaları (canlı ayaklar B36-b · B53/B51 · `baglam.sh` satırda adıyla korundu) ve
> `Kapanan halka` etkinlik bloğu (B81 adıyla korundu). Tahliye tavanı açar, **kapağı
> kaldırmaz.***

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

- **ADIM 1–7 (6–8 Ağu)** — doküman mimarisi geçişi, MCP dört araçlı. Tam kayıt
  `90-kronoloji/2026-08.md`'de (10 Eylül tahliyesi, KARAR 457/61). **Açık kalan
  canlı ayaklar:** B36-b (Claude.ai) · B53 bağlantı ucu düşürüldü, B51 ona bağlı ·
  `baglam.sh` **emekli edilmedi.**
- **B01 ✅ (10 Ağu)** — klon · remote · proje adı üçü de `ocak`; tek commit `50294e6`. Blok 24 Ağustos'ta kronolojiye **indi** (B58 · B59 · B60 orada).
- **11 Ağustos ✅ (B47 · B40/B55/B56 · B58)** — `05-harita.md` + KARAR 482 · 483. Blok 24 Ağustos'ta kronolojiye **indi** (KARAR 457/61).
- **Marka işareti ✅ (18–19 Ağu)** — logo + başlık kanonu (**KARAR 522 · 523**). Blok 24 Ağustos'ta kronolojiye **indi**; canlı ayağı **B105** (Instagram · WhatsApp · e-posta anteti hâlâ eski).

- **Sayfalar metin turu ✅ (24 Ağu)** — on dört yüzeyde yirmi bir yazım, C listesinin beşi
  kapandı, **deploy aynı gün alındı.** Doktrin **558** (Seremoni + Çember'de kayıt yoktur,
  istisnasız — söz ile mekanizma çeliştiğinde **söz kazanır**) · **561** · **562** · **563**
  (mühürle birlikte denetim satırı; KARAR 86 üç ay denetimsiz yaşadı, **B80**) ·
  ölçüm doktrini **565** · **566** · **567**. Gerekçeler kronolojide.

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
| `main` dönem HEAD | **`b1ee821`** (10 Eyl, N-Kolay turu patch'i; bir önceki dönem `7062846`) — canlı HEAD değil, dönemin son commit'i · kapanış commit'inden bir önceki (KARAR 474). ⚠ **Bu dönem on commit içerdi ve dokuzu KOD** — 19 Ağu'dan bu yana ilk kod turu. Zincir: `7062846 → bcc0196 → e03364d → 20fff25 → dd59c5d → 5a4c5bc → 0b173ac → 213ea0b → 4eb549b → fd946f3 → b1ee821`. ⚠ **Production 26 Ağu'dan 10 Eyl'e kadar `7062846` üstündeydi** — 15 gün, `9acbabb` değil; önceki dönem satırı dönem HEAD'ini deploy sanıyordu (KARAR 577'nin doğuş vakalarından). 10 Eyl'de beş production deploy'u alındı: `e03364d · 213ea0b · 4eb549b · b1ee821 · b1ee821` (sonuncusu redeploy) |
| Dal modeli | `main` = production (push otomatik canlı) · `astro-iskelet` = **ölü dal**, main'in ata'sı, 85 commit geride (KARAR 485) |
| Çalışma dizini | **`~/Desktop/hlaorpz/ocak`** · remote `hlaorpz/ocak` (B01, 10 Ağu) — tek klon (KARAR 463) |
| Test | **325/325** yeşil — **19 dosya** (`npx vitest run`, 10 Eyl). 294→325 farkı bu turun beş ayağı: `/odeme/tamam` yüzeyi · callback doğrulaması · sayfa başlığı · gövde tekrarı · e-posta. ⚠ Test dosyası **`src/lib/` ya da `src/components/` altında yaşar** — `src/pages/` altına konursa Astro onu route olarak derler, **build düşer, vitest yeşil kalır** (KARAR 574) |
| Build | **32 prerender + 10 SSR + 6 API route.** Tek sayıya inmez; Pilot'un "33"ü hiçbirine denk gelmiyordu (D7 kapandı) |
| robots.txt | `Disallow: /` — **stealth sürüyor.** Yeni bağ: ilk sosyal post duyurudur → **Gün 1 aynı zamanda robots kararıdır** (KARAR 149) |
| Kanonik adres | **`www.ocak.biz`** (`688bee5`) — köksüz `ocak.biz` 307 ile www'ye döner |
| Deploy hook | ⚠ `tZR9LcwJq9` → **`astro-iskelet`** (ölü dal). Yenisi `notion-content-update-main` → `main` **oluşturuldu ama çağıran yok** — **B64**. Notion webhook + gece cron hâlâ eskisini paylaşır. ⚠ **24 Ağu deploy'u git push'la alındı** — hook'a dokunulmadı; yani **otomatik içerik deploy'u çalışmıyor ve çalışmadığı fark edilmiyor** |
| Vercel | Team `team_EVx2zHhI9iYscmqsuHckk599` · Project `prj_CxW3Nm85TGzdrZdePCk74WLAv23f` · proje adı **`ocak`** — 24 Ağu canlı teyit (`project.name`) · dört domain ayağının dördü de `ocak-*` (**B58 ✅**, 11 Ağu). ⚠ `.vercel/project.json` **yok**; elde kalan `.vercel/repo.json` 27 Mayıs'tan ve projeye *"ocak-site"* diyor → **B179**. Bu yüzden `vercel --prod` yolu kullanılmıyor |
| Ödeme | **İki yöntem yan yana — karar alındı, anahtar henüz çevrilmedi.** N-Kolay sanal POS ile anlaşıldı (10 Eyl): kart geri geliyor, havale/EFT kalıyor. **KARAR 575** — denetim **Production'da** mock sağlayıcıyla koşar (`KART_AKISI=acik` · `PAYMENT_PROVIDER=mock`); Preview (`nkolay-test`) aynı yapılandırmada, **iki ortamın `ODEME_CALLBACK_SIR`'ı ayrıdır.** ⚠ **Ölçüm (11 Eyl): Production hâlâ KAPALI** — `www.ocak.biz/cember/kayit` HTTP 200, yöntem grubu markup'ı yok; env yazılmadı ya da redeploy alınmadı. **Karar ≠ uygulama** (KARAR 577). Canlı mock ekranın kapatma borcu **B193**. Sağlayıcı implementasyonu onay bekliyor: `payment-provider.ts`'te `mock` çalışıyor, `iyzico` throw ediyor. ⚠ Anahtar kapalıyken yöntem radio grubu SSR'da **hiç basılmaz** — tek yöntem varken seçenek sunulmaz, KARAR 488'in tasarımıdır, arıza değil |
| Referans kodu | **`OCAK-` + 4 karakter**, 29'luk alfabe (`Z` yok — yanlış okunursa geçerli kod üretir; `L` var — `1` alfabede yok, hata gürültülü çıkar). Uzay 29⁴ = 707.281. Notion'da 5 ve 6 haneli eski rakamsal kodlar da yaşıyor, **migration yok** |
| ⚠ Ödeme onayı | **Kapı doğru, açan mekanizma YOK.** `odeme_durumu` üçüncü değeri `alindi` hiçbir kod tarafından yazılmıyor → ödemesi gelen kadına Zoom/adres bilgisi **elle** gidiyor. n8n akışı kurulana kadar böyle (`03-sira.md` madde 2, sıranın en kritik maddesi) ✅ **Notion iki alan açıldı** (10 Eyl, Kaan): `Beklenen Tutar` (number) · `Mail Gitti` (checkbox). n8n akışının ön koşulu doldu; **akış hâlâ kurulmadı.** Tetikleyici Notion `Ödeme Durumu = Ödendi` — değeri kart callback'i mi Kaan mı yazdı, önemsiz |
| MailerLite | **On iki custom field** (envanter `20-ref-bot.md`). Ödeme kapısı canlı (KARAR 486) · alan hijyeni canlı (`92e580e`). Otomasyon `OCAK — kayıt onayı (tüm formatlar)` kurulu — tetik `Updates field: etkinlik_adi`, koşul `odeme_durumu`; **aktif mi pause mu Kaan'da doğrulanacak** |
| Callback güvenliği | `odeme-callback` 19 Ağu'dan 10 Eyl'e kadar **kimlik doğrulamasızdı**; adresi ve bir Notion sayfa UUID'sini bilen herkes bir kaydı Ödendi yapabilir, promo sayacını şişirebilirdi. `KART_AKISI` kapalı olduğu için sömürülemedi. Artık `dogrulaCallback()` **provider arayüzünde** (KARAR 395 uygulaması, `5a4c5bc`), **fail-closed** — sır tanımsızsa `401`, gövde Notion'a hiç taşınmadan |

---

## YAYINI KİLİTLEYENLER

Detay ve sahipler `02-borclar.md`'de. Burada yalnız kilit zinciri:

1. **B19 — WhatsApp display name** (Kaan). `…5226` hattında **"Ocak Kadın Çemberi" ONAYLI** (19 Ağu). Kalan iş yalnız `…0888` hattı: ad başvurusu (KARAR 521) + bot bağlama — **B104**.
   Numara yayını buna kilitli **değil** — KARAR 396 kapandı, bot hattı `905325555226` canlı (`354fb14`). Bot hattı ≠ yasal sayfa telefonu (`+90 532 208 0888`, beş yasal sayfa) — kasıtlı iki yüzey, eşitlenmez (KARAR 518).
2. **İade cümlesi ✅ ÇÖZÜLDÜ (10 Eyl, KARAR 576, `0b173ac`).** `teslimat-iade.astro` ve
   `mesafeli-satis.astro` canlı cümleleri iki yöntemi de kapsıyor, beş yorum bloğu kapandı.
   ⚠ **`robots Allow` hâlâ açılmadı** — engel kalktı, **karar verilmedi**; `Allow` = duyuru (KARAR 149), kararı Gün 1 verir.
   Hukukçuya kalan iki soru metne **girmedi**: cayma hakkı istisnası (6502 md.15) · e-ticaret fatura serisi.
3. **Sosyal v2 `[KAAN]` önkoşulları** — kurucu görsel **✅ mühürlendi** (23 Ağu, KARAR 542);
   `KURUCU-URL` ara-değiştir **✅ KAPANDI** (24 Ağu, **B139** · **B184**) — dokuz promptun dokuzunda gerçek `--sref`, `--v 8.1`, `--chaos 5`; `--sref KURUCU-URL` → **0**. ⚠ **Bu madde artık Gün 1'i kilitlemiyor**; kalan kilit V05–V09'un üretimde hiç sınanmamış olması (ilk parti kanarya).
4. **Yolculuk fiyat bandı → ilk Yolculuk etkinliği.** Eylül kohortu duyurusunun önkoşulu.

**Kapanan halka — etkinlik tarihleri.** Tam kayıt `90-kronoloji/2026-09.md`'de (10 Eylül tahliyesi, KARAR 457/61): 15 yayında etkinlik, yedi format kayıt route'u canlı; on dördü gövdeli, `yolculuk-acilis` `Detay` **NULL** — **B81** açık.

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
- **Türetilmiş yüzey kaynağın yerine geçmez** — üç vaka, aynı sınıf: hoisted script `dist/`
  grep'ini yanıltır (`odeme_yontemi` çıktıda var ama markup değil, render ölçümü `data-*` ile) ·
  Türkçe metin bundle'da Unicode kaçışlı yaşar (`"\xD6demen alındı"`, kaçış çözülmeden grep
  **yokluk raporlar**) · `PUBLIC_HAVALE_IBAN` yerelde tanımsız, yerel `dist/`ten IBAN teşhisi
  kurulmaz. → KARAR 577 (10 Eyl)
- **`prerender = false` ≠ taze içerik** — yedi SSR sayfası (`/cember` · `/acik-kapi` ·
  `/seremoni` · `/atolye` · `/mini-retreat` · `/sehir-aksami` · `/yolculuk`) içeriği build-time
  collection'dan okur, ISR yok → her metin değişikliği deploy ister, **doğrulama canlıda.**
- **Statik çıktı `dist/client/`'ta** — `dist/` grep'i boş dizinde **her zaman 0** döner;
  "temiz" sahte olabilir. → KARAR 566 · 567

⚠ **`02-borclar.md` bir yapılacaklar listesi değildir** — fark edilmiş ama kapatılmamış
tutarsızlıkların defteridir. Ürün işi (ödeme, WhatsApp, Instagram, mail akışları) oraya
girmez; o kuyruk başka yerde yaşar.

---

## BU DÖNEM NE OLDU

- **24 Ağustos (MJ görsel turu — V03 kapanışı):** V03 gövdesi uzaklaştırıldı — `ustKaranlik`
  medyanı **%52.0 → %94.8**, geçen kare 1/18 → 13/18; dört zemin mühürlendi (**z08–z11**).
  V10 kilim üç turda **terk edildi** (568–572; ders: *kumaş yüzey değildir, düşer*). → `90-kronoloji/2026-08.md`
- **24 Ağustos (Sayfalar metin turu + DEPLOY):** "Çember Lideri"nin Notion ayağı kapandı
  (on yer). **Deploy git push'la alındı** — `tZR9LcwJq9` hook'una dokunulmadı (ölü dal, **B64**).
  Üç bekçi bandı kaydı: Seremoni `3.571–3.686` · Açık Kapı `3.044–3.330` · Çember `3.472–3.771`.
  Slug konvansiyonu (**559**) + dört ad (**560**); Kayıtlar DB'de iki test satırı olduğu
  için **slug değişimi bedelsizdi.** → `90-kronoloji/2026-08.md`
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
| Advaita görüşmesi — beş C kalemi + Ritüel ön görev (B178) + K4 Wild Woman (B158) | Kaan + Advaita |
| WhatsApp/Meta onay hattı | Kaan |
| Yolculuk fiyatlandırma → ilk etkinlik | Kaan + Advaita |
| Sosyal medya **Gün 1** önkoşulları (Gün 0 ✅ 23 Ağu, KARAR 542) | Kaan |
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
