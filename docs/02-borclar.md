# AÇIK BORÇLAR

**Son güncelleme:** 7 Ağustos 2026 · B37 + B34 — pilot referansları dönüştü, 143/350 kod teyidi (TEYITSIZ 3→1)

**Durum:** 37 madde · **20 açık** · 17 kapandı/çözüldü/geri çekildi

*(Sayım düzeltmesi — D6: başlık "31 madde · 19 açık" diyordu, gerçek sayım B01–B30 üzerinden 30 madde · 20 açıktı. ADIM 3'te B31 açılınca 31 · 21 oldu.)*

Numaralar sabittir, yeniden kullanılmaz. Kapanan maddeler silinmez — nasıl kapandığı bilgisi
kendisi işe yarıyor (KARAR 61/88 ruhu).

| Kim | Açık maddeler |
|---|---|
| **Kaan** | B07 · B14 · B18 · **B19** (yayını kilitleyen) · B28-kalan ayak |
| **CC** | B09 · B10 · B11 · B12 · B15 · B16 · B17 · B26 · B36-a · B45 · B42 ✅ |
| **Claude.ai** | B35 · B36-b · B38 · B39 · B40 · B41 · B43 · B44 |
| **CC (mekanik)** | B37 ✅ |
| **CC (kod teyidi)** | B34 ✅ |
| **İçerik (Advaita/Kaan)** | B04 · B08 |
| **Planlı, tarih yok** | B30 (kilit — `EtkinlikKart.astro` silinmez) |
| **ADIM 4'e bağlı** | B01 |
| **İçerik (Notion girişi)** | B31 |

---

## B01 — klon ve remote adı `ocak` olur
- [ ] **Sahip:** Kaan + CC
- **Tetikleyici:** ADIM 4, `baglam.sh` yazılırken — birlikte yapılır
- **Gerekçe:** "clone" adı tek çalışma kopyası olduğunu değil, bir kopya olduğunu ima ediyor; yanıltıcı.
- **Neden şimdi değil:** CC'nin bildiği yol değişir. Yol değişimi ile `baglam.sh` yazımı aynı commit'te olmalı.
- **Not:** KARAR 98 zaten bir "Repo Adı Düzeltmesi" içeriyor — bu ikinci tur, aynı hattın devamı.
- **Hedef ad kararı (8 Ağu):** üç ad da **`ocak`** olur. Remote `hlaorpz/ocak`,
  yerel klasör `~/Desktop/hlaorpz/ocak`, Vercel proje adı `ocak`. Bugüne kadar B01
  yalnız "en az iki ad dolaşımda" diyordu, hedef yazılı değildi — artık yazılı.
- ⚠ **Maliyet küçük değil, iş tek turda ve sırayla yapılır:**
  1. GitHub'da repo yeniden adlandırılır (`ocak-site` → `ocak`). GitHub eski URL'yi
     yönlendirir, ama yönlendirmeye güvenilmez.
  2. `git remote set-url origin` güncellenir, `git remote -v` ile doğrulanır.
  3. Yerel klasör yeniden adlandırılır. **Bu adım en pahalısı** — aşağıya bak.
  4. Vercel proje bağlantısı denetlenir. `projectId` sabittir, ama repo adı değişince
     bağlantının kendiliğinden düzeldiği **ölçülmeden varsayılmaz**; `list_deployments`
     ile teyit edilir.
  5. `.claude/settings.local.json` içindeki eski mutlak yol düzeltilir. Dosya
     `.gitignore`'lu, commit'e girmez — elle yapılır ve raporlanır.
  6. `.claude/notes.md` aynı sınıfta, yerel kalır.
- ⚠ **`cd` öneki sözleşmesi kırılır.** Her brief'in her bash bloğu
  `cd ~/Desktop/hlaorpz/ocak-site-clone` ile açılıyor — bu bir konvansiyon
  (`CLAUDE.md`) ve `docs/_arsiv/` altındaki her brief dosyasında geçiyor.
  **Arşivdeki brief'ler DÜZELTİLMEZ** (KIRPMA YASAĞI, KARAR 61): onlar koşulduğu günün
  kaydıdır, yolun o gün ne olduğunu doğru söylüyorlar. Düzeltilecek olan `CLAUDE.md`
  konvansiyon satırı ve **bundan sonra yazılan** brief'lerdir.
- **Ölçüm gerekiyor, henüz yapılmadı:** `cd ~/Desktop/hlaorpz/ocak-site-clone` dizesinin
  `docs/` altında kaç dosyada, kaç kez geçtiği. B01 turunun ADIM 0'ında ölçülür ve
  arşiv/canlı diye ayrılır — sayı, işin arşive mi yoksa canlı dosyalara mı yığıldığını
  gösterir.
- **Sahip:** CC (adımlar 1-6) · Claude.ai (`CLAUDE.md` konvansiyon satırı)
- **Kaynak:** 8 Ağustos 2026, gün sonu — hedef ad kararı Kaan'dan.
- **Başlık düzeltmesi (8 Ağu):** blok önceden `ocak-site-clone → ocak-site` diyordu.
  Hedef `ocak` olarak karara bağlanınca başlık gövdeyle çelişti; başlık gövdeye
  uyduruldu. Ara hedef `ocak-site` hiçbir zaman uygulanmadı.

## B02 — Sabit-px pseudo audit yayılımı ✅ KAPANDI (6 Ağu, kod teyidi)
- [x] **Sahip:** CC
- **Kapanış:** `scripts/horizontal-overflow-scan.mjs` ve `qa-envanter.mjs` ikisi de git'te izleniyor. Ledger'daki "commit'lenmedi" iddiası yanlıştı.
- **Kaynak:** KARAR 187 (`ocak-kronoloji.md:4669`)
- **İçerik:** `::after` sabit-px taşma denetiminin tüm sayfalara yayılması. Kararın kendisi kapalı; yayılım açık.

## B03 — KARAR 372 `overflow-x: clip` ✅ ÇÖZÜLDÜ (6 Ağu, kod teyidi)
- [x] **Çözüm:** Kod doğru, **doküman bayat**. `global.css:21` ve `:142` → `overflow-x: clip`; `hidden` yalnız `@supports not` fallback'i (`:152-154`). Pilot'un "UYGULANMADI" satırı ADIM 3'te düzeltilir → **D1**.
- **Kaynak:** `ocak-pilot.md:33`
- **Çelişki:** Pilot "önerilen `clip` geçişi UYGULANMADI, gerçek cihaz eyeball'ı bug'ı doğrulamadı" diyor. Yaygın kabul ise `html, body { overflow-x: clip }`ın canlı olduğu yönünde.
- **Eylem:** `atmosfer.css` + `tokens.css` grep → hangisi doğruysa diğeri düzeltilir. İkisinden biri bayat.

## B04 — `/acik-kapi` "sembolik ücret" ifadesi
- [ ] **Sahip:** Claude.ai (metin) → Advaita/Kaan (Notion girişi)
- **Kaynak:** KARAR 240 notu (`20-ref-program.md:498`), KARAR 432
- **Çelişki:** 432 "sembolik" de "yatırım" da denmez diyor; `/acik-kapi` metninde "sembolik ücret" geçiyor olabilir.
- **Eylem:** taze Notion dump'ta site geneli tarama.

## B05 — KARAR 146 / 188 numara çakışması ✅ KAPANDI (7 Ağu, ADIM 3b)
- [ ] **Sahip:** Claude.ai
- **Kaynak:** `ocak-kronoloji.md:2790` (146 = GTM container iskeleti) vs `ocak-kronoloji.md:3558` (146 = TS Window dataLayer global type)
- **Sorun:** İkinci konu KARAR 188'in tanımı. Muhtemel numara hatası — KARAR 153→177 find-replace vakasının aynısı.
- **Eylem:** ADIM 3'te kronoloji dilimlenirken düzeltilir; kaynak satıra dokunulmaz (KIRPMA YASAĞI), düzeltme tsv tarafında yaşar.
- **Sonuç (7 Ağu):** Çakışma YOKTU. İkinci geçiş (`ocak-kronoloji.md:3558`) 146'nın kendi doğurduğu TS `(window as any)` borcunun 31 Mayıs kapanış **geri-referansı**. 188'in kendi section başlığı ayrıca var (`2026-05.md:3276`). Ledger'dan `⚠188 çakışma` bayrağı kaldırıldı; 188'e dokunulmadı.

## B06 — KARAR 114 halefi belirsiz ✅ KAPANDI (7 Ağu, ADIM 3b)
- [ ] **Sahip:** Claude.ai
- **Sorun:** "KARAR 114 stop verbatim, **kısmi supersede**" açık; süperseleyen numara 365-371 aralığında ama tek numaraya inmiyor.
- **Eylem:** ADIM 3'te kronolojinin ilgili bloğu okunup `→N` kesinleştirilir.
- **Sonuç (7 Ağu):** Halef **366**. Kanıt `2026-07.md:852` — dönemin kendi supersede satırı. Supersede **kısmi** kalıyor: 114 parity `/etkinlik/[slug]` hero'sunda hâlâ uygulanıyor (`2026-07.md:206`).

## B07 — Bot model ayrımı: OCAK → Sonnet
- [ ] **Sahip:** Kaan (n8n)
- **Kaynak:** KARAR 257 (`ocak-kronoloji.md:4019`)
- **İçerik:** `model: proje === 'OCAK' ? 'claude-sonnet-4-6' : 'claude-haiku-4-5-20251001'`. Disambiguation + ton + hatasızlık gerekçesi. ~$30-40/ay.
- **Durum:** "Henüz uygulanmadı (tek satır)" — iki ayrı yerde teyitli. Tek satırlık iş, aylardır açık.

## B08 — Site geneli "Uluslararası Yolculuk" sweep'i
- [ ] **Sahip:** Claude.ai (tarama) → Advaita/Kaan (Notion)
- **Kaynak:** KARAR 326 bakım tetikleyicisi (`20-ref-program.md:490`)
- **Durum:** "yapılmadı" — birebir. Marka dosyası K3 tanımı düzeltildi (v1.4), site metni taranmadı.

## B09 — `/takvim` hash listener'ları
- [ ] **Sahip:** CC
- **Kaynak:** KARAR 391 (`ocak-pilot.md:41`)
- **İçerik:** `hashchange` + `pageshow (e.persisted)` ekleri. Hash silinirse Tümü'ye zorlanmaz.
- **Durum:** "⚠ UYGULANMADI, gitlog'da commit yok, açık borç" — üç ayrı yerde teyitli. KARAR 390 (ön-seçili filtre) canlı, eki eksik.

## B10 — KARAR 176 AtesMektuplari ember glyph
- [ ] **Sahip:** CC (teşhis)
- **Kaynak:** `ocak-kronoloji.md:3422`
- **Durum:** **TEYITSIZ.** "Brief yazıldı, PUSH BEKLEMEDE, #36 ilk işi" — #36 gerçekleşti, sonrasında hiçbir dosyada tekrar geçmiyor. Kapandı mı bilinmiyor.
- **Eylem:** success state'te ember dot DOM'da var mı — tek eyeball/grep sorusu. Cevap `176` satırını `AKTIF`e çevirir.

## B11 — Safari hero glow banding
- [ ] **Sahip:** CC
- **Kaynak:** KARAR 131 (`ocak-kronoloji.md:1730`)
- **Durum:** "lansman sonrası" diye ertelendi, lansman oldu. Safari radial-gradient engine kısıtı. KARAR 366 (stop artırma) denendi, banding üretti, geri alındı — çözüm hâlâ yok.

## B12 — Turnstile geçişi
- [ ] **Sahip:** Kaan + CC
- **Kaynak:** KARAR 152 (`ocak-kronoloji.md:3022`)
- **İçerik:** "lansman öncesi honeypot, sonrası Turnstile". Honeypot canlı (KARAR 194), Turnstile ayağı hiç açılmadı.

## B13 — Tanımsız üç numara: 154 · 196 · 251 ✅ KAPANDI (7 Ağu, ADIM 3b — 251 hariç, artığı B-yok)
- [ ] **Sahip:** Claude.ai
- **Durum:** Üçü de yalnız sürüm listesi sınırı olarak geçiyor (`v37 · … KARAR 154-195` gibi). Gerçek tanım satırı bu envanterde yok.
- **Eylem:** ADIM 3'te kronolojinin ilgili dönem bloğu okunup tanım çıkarılır. Aynı şey 400 ve 407 için de geçerli (ikisi bölüm başlığında sınır).
- **Sonuç (7 Ağu):** 154 · 196 · 223 · 400 · 407 tanımlandı. **251 tanımsız kaldı** — #38 dönem bloğunun ilk numarası, blok içi tekil etiket yok; aday ledger'a not düşüldü, tahmin edilmedi (KARAR 456). Kalan artık yeni borç açmıyor: TEYITSIZ satır kendi kuyruğunda erir.
- **Kök sebep:** 400/407 doküman hatası değildi — ADIM 1'in ilk geçişi bölüm başlığıydı, tanım 1-8 satır altındaydı. Envanter aracının siniri, kaydın eksikliği değil.

## B14 — MailerLite panel otomasyonu
- [ ] **Sahip:** Kaan
- **Kaynak:** KARAR 225 (`ocak-kronoloji.md:3894`)
- **Durum:** "kod additive, sorun ML panel otomasyonu **(açık)**". Kod tarafı teyitli, panel tarafı hiç kapanmamış. Regex yakalamadı — "açık" tek başına anahtar kelime değil.

## B15 — CC auto update fail + npm permission ops
- [ ] **Sahip:** Kaan
- **Kaynak:** KARAR 132 (`ocak-kronoloji.md:1731`) — "lansman sonrası" ertelemesi, lansman oldu.

## B16 — Lansman sonrası ilk hafta paketi (3 madde)
- [ ] **Sahip:** CC
- **Kaynak:** KARAR 144 (`ocak-kronoloji.md:2436`)
- **İçerik:** /takvim kart küçültme + tipografi kalibrasyon (KARAR 138 CSS refactor turu) + /sen-neredesin maddesi.

## B17 — `autocomplete="email"` eksik
- [ ] **Sahip:** CC
- **Kaynak:** KARAR 183 (`ocak-kronoloji.md:3296`) — Ateş Mektupları input'unda eksik. Küçük UX borcu, tek attribute.

## B18 — Fix 4b (Aşama 5+)
- [ ] **Sahip:** Kaan
- **Kaynak:** KARAR 274 (`ocak-kronoloji.md:4043`) — PARK. Yeni Resend template + trigger gerektiriyor.

## B19 — WhatsApp display name
- [ ] **Sahip:** Kaan
- **Kaynak:** KARAR 410 (`ocak-kronoloji.md:5598`)
- **Durum:** "Ocak Kadın Çemberi" ve "Ocak.biz" adaylarının ikisi de Meta tarafından reddedildi. İtiraz süreci açık; yayın bu onaya kilitli (KARAR 396).

## B20 — Tanım envanterde olmayan 17 numara ✅ KAPANDI (7 Ağu, ADIM 3b)
- [ ] **Sahip:** Claude.ai
- **İki grup:**
  - **Grup atfı içinde eriyenler (11):** 159, 160, 164, 170, 171, 172, 237, 238, 247, 248 — yalnız `[KARAR 236, 237, 238]` gibi virgüllü listelerde geçiyorlar. Tanımları var ama grep kelime-sınırı ile elemiş.
  - **Hiç geçmeyenler (6):** 62, 64, 66, 67, 68, 179 — hiçbir dosyada yok. Numara atlanmış olabilir ya da kayıt hiç yazılmamış.
- **Eylem:** ADIM 3'te ilgili dönem blokları okunur. B13 (154·196·223·251·400·407) ile aynı iş.
- **Sonuç (7 Ağu):** İki grup ayrıştı. **Gerçek boşluk 6** (62·64·66·67·68·179) — altı master dosyada 0 geçiş, bağımsız doğrulandı → `KULLANILMADI`. **Blok üyesi 10** (159·160·164·170·171·172·237·238·247·248) — tanımları blok içinde yaşıyor, tekil ayrım kaynakta YOK → yeni `⊂N` konvansiyonu, durum blok çapasından devralındı. 247/248 tek commit'e kadar daraldı (`934afbf` / `7d8486c`).
- **D9:** bu maddenin kendi metni "Grup atfı içinde eriyenler (**11**)" diyor, listede **10** numara var. Sayım hatası — başlıktaki "17" de bu yüzden şişik. Kapanışta düzeltildi.


---

# KOD TEYİDİ SONRASI AÇILANLAR (6 Ağustos 2026)

## B21 — Altın hardcode temizliği ✅ KAPANDI (6 Ağu, commit 75e5274)
- [x] **Kapanış:** 4 satır `color-mix(in srgb, var(--gold) 2%, transparent)` oldu. `--gold` = `#D4A855` = `rgba(212,168,85)` birebir doğrulandı, sıfır görsel değişiklik. Token adı bilinçli olarak `--gold` kaldı → **D5**.
- **Kaynak:** KARAR 204 · `tokens.css:26`
- **Bulgu:** Token'ın adı `--gold`. Hardcode `rgba(212,168,85)` beş yerde: `tokens.css:26`, `atmosfer.css:93`, `:103`, `Hero.astro:114`, `:129`, ayrıca `#d4a855` → `_onizleme_placeholder.ts:17`.
- **Not:** Karar "tek-kaynak" diyordu; ne ad tutuyor ne hardcode temizlenmiş. Ledger'da `ACIK-BORC`.

## B22 — `variant='kart'` dalı ✅ TEŞHİSLE KAPANDI (6 Ağu)
- [x] **Sahip:** CC
- **Kaynak:** KARAR 374 · `EtkinlikKart.astro:26,49,80`
- **Bulgu:** Union tipi canlı, `:49` **default değeri `'kart'`**, `:80` dalı çalışıyor. KARAR 373 "tek kabuk" derken KARAR 374 "dal silindi" diyordu; ikisi de kısmen doğru — `EtkinlikListe` var, `EtkinlikKart` da duruyor.
- **Kapanış:** Drift yok. `EtkinlikKart` yalnız `EtkinlikListe.astro:33`'ten, her zaman `variant="satir"` ile çağrılıyor — paralel değil **sarmalama**. `:80` dalı ulaşılamaz ölü kod. Dalın kendisi sorun değil; içindeki `kartGorsel` render'ı sorun → **B30**.

## B23 — `setHours(0,0,0,0)` ✅ KAPANDI (6 Ağu, commit 9da42b0 + 84f939c)
- [x] **Kapanış:** Üçü de `bugunTR()`e çevrildi, `parcala()` silindi. `api/kayit.ts` ayrı commit + TZ sınır testi. Havale vade metni artık TR gününe sabit.
- **Kaynak:** KARAR 385 · `davet-guvenlik-agi.ts:29`, `api/kayit.ts:67`, `etkinlik/[slug].astro:85`
- **Bulgu:** Europe/Istanbul sabitlemesi var ama server-yerel `setHours` çağrıları duruyor.
- **Risk:** Kararın tarif ettiği bug'ın ta kendisi — TR gecesi 00:00-03:00 penceresinde gün kayması.

## B24 — `FORMAT_ORDER` tek kaynak ✅ KAPANDI (6 Ağu, commit 0b62473)
- [x] **Kapanış:** Brief'in ilk hâli regresyon üretecekti (takvim `KATEGORI_SIRA` kullanıyor, 8. eleman `Anadolu Yolculuğu` `FORMAT_ORDER`'da yok). Yeniden kapsamlandı: `bulusmalar.astro` `KATEGORI_SIRA`'dan türetiyor, `BULUSMALAR_DISI = {anadolu}` açık dışlama + eşleşmeyen etikette build warn. Takvime dokunulmadı, sekme sırası değişmedi.
- **Kaynak:** KARAR 284 · yalnız `bulusmalar.astro`
- **Bulgu:** `EtkinlikTakvimi.astro` bu diziyi hiç çağırmıyor. Explicit sıralama kararı tek yüzeyde uygulanmış.
- **Bağlantı:** KARAR 339 (yedi kapı `FORMAT_ORDER`) da bu yüzden takvimde geçerli değil.

## B25 — `atmosfer.css:1537` yorumu ✅ KAPANDI (6 Ağu, commit 696b462)
- [x] **Kapanış:** Yorum dört selektörü sayacak şekilde düzeltildi.
- **Bulgu:** KARAR 427 bloğunun yorumu iki section adı sayıyor, selektörler dört: `etkinlik-takvimi`, `sonraki-bulusma`, `kayit-btn`, `mini-cta`. KARAR 423 selektörü güncellemiş, yorumu unutmuş. Kural doğru çalışıyor; yorum yanlış yönlendiriyor.

## B26 — `.ocak-kayit-cta__buton` sınıf adı ⏸ ERTELENDİ (6 Ağu, koşul tutmadı)
- [ ] **Sahip:** CC
- **Bulgu:** `KayitCTA.astro` silindi, `CANONICAL_SECTIONS`'tan çıktı (KARAR 423), ama sınıf adı yaşıyor — `atmosfer.css:1586, 1598, 1602`, `mini-cta` içindeki Notion linklerini bu sınıfla ayırıyor. İşlevsel ama ad yalan söylüyor.

## B27 — Vitest çalışmıyor ❌ GERİ ÇEKİLDİ (6 Ağu, CC'nin kendi düzeltmesi)
- **Neden düştü:** `npx vitest run` → 9 dosya / **176 test, hepsi geçti** (318ms). Sürüm uyumsuzluğu yok: vitest 4.1.7, astro 5.18.1, vite 6.4.2.
- **İlk gözlemin sebebi:** o çalıştırma `npm run build` ile eşzamanlıydı; `_setServer` çökmesi çakışmadan.
- **Kayıt olarak duruyor** çünkü yanlış teşhisin nasıl üretildiği bilgisi kendisi işe yarıyor: eşzamanlı build + test çalıştırma yanlış negatif üretir.

## B28 — Bayat NOTION_TOKEN ✅ ÇÖZÜLDÜ (6 Ağu)
- [x] **Kapanış:** `.env.local`'daki bayat `NOTION_TOKEN` satırı silindi, build geçti (32 sayfa, 0 error). **Kalan ayak:** `.env.preview` (27 Mayıs) de bir `NOTION_TOKEN` tanımlıyor — preview mode'da aynı tuzak. Ayrıca BotZ integration'ının n8n credential'ı güncel mi, teyit edilmedi.
- **Gerçek kök neden (6 Ağu, 2. tur):** `.env` güncellendi (14:35) ama **`.env.local` (5 Haziran) onu eziyor**. Vite yükleme sırası: `.env` → `.env.local` → `.env.[mode]`. Sonraki önceki ezer.
- **Eylem:** `.env.local` içindeki `NOTION_TOKEN` satırı silinir (`.env` zaten sağlıyor) veya güncellenir. Dosyadaki diğer değişkenlere dokunulmaz.
- **Ayrıca:** `.env.preview` (27 Mayıs) de bir `NOTION_TOKEN` tanımlıyor — preview mode'da aynı tuzak.
- **İlk teşhis:** `npm run build` → `API token is invalid`, content sync aşamasında (`src/content/config.ts:19`). `astro check` geçiyor.
- **Etki:** `[dist]` işaretli tüm teyitler + G bölümünün tamamı bloklu. Ledger'ın en değerli kontrolü (`CANONICAL_SECTIONS`'ta olup `dist/`'te render olmayan section) yapılamadı.
- **İkinci bulgu:** CC parmak izi karşılaştırmış — sızan BotZ token'ı ile `.env`'deki site token'ı **farklı**. İki ayrı integration döndürülmüş. Her ikisinin rotasyonunun tamamlandığı ayrıca doğrulanmalı.


## B29 — `al-ol-ver` bileşeni ✅ KAPANDI (6 Ağu, içerik teyidi)
- **Kapanış:** Borç değil. `/araclar` sayfası üç ayrı marker kullanıyor (`## section: al` · `ol` · `ver`) ve sapasağlam yayında. `AlOlVer.astro` içeriğin seçmediği **birleşik alternatif uygulama**. KARAR 17'nin sitede karşılığı var.
- **Kalan (küçük):** kullanılmayan `AlOlVer.astro` + plugin dalı + `CANONICAL_SECTIONS`'taki `al-ol-ver` kaydı emekli edilir, liste 10→9. Aceleye gerek yok.
- **Ders:** "render olmuyor" ≠ "gerekmiyor". G.2 kontrolü doğru ama çıktısı tek başına yeterli değil; ayrım içerik bilgisi istiyor.
## B30 — `kartGorsel` render'ı ölü dalın içinde 🔵 PLANLI ÖZELLİK (karar verildi 6 Ağu)
- [ ] **Sahip:** ileride — tarih yok
- **KARAR:** Etkinlik kartlarında görsel **olacak**, ama ileride. Bu bir bug değil, henüz açılmamış özellik.
- **Kaynak:** `EtkinlikKart.astro:80-82` (ulaşılamaz `variant='kart'` dalının içinde)
- **Bulgu:** Etkinlik kart görselleri Notion'dan **çekiliyor** (`notion-etkinlikler.ts:174,206`), `onizleme/index.astro:89` "doluyken basılır" diyor, ama render kodu ölü dalın içinde. Hiçbir yüzeyde basılmıyor.
- **Ağırlık:** KARAR 406 deseninin üçüncü örneği — ve en somutu, çünkü bu sefer Notion tarafında veri de var.
- **🔒 KİLİT — kalıcı:** `EtkinlikKart.astro:80-82` **silinmez.** Dal ulaşılamaz olduğu için "ölü kod temizliği" turlarında silinmeye aday görünecek; silinirse `kartGorsel` render'ı da gider ve özellik sıfırdan yazılmak zorunda kalır. Notion alanı (`notion-etkinlikler.ts:174,206`) da korunur.
- **Açılınca yapılacak iş:** render `variant='satir'` yoluna taşınır; `variant='kart'` dalı o zaman emekli edilir.


## B31 — `/site-rehber` CANONICAL_SECTIONS sayımı yanlış (D4)
- [ ] **Sahip:** Claude.ai (metin) → Advaita/Kaan (Notion girişi)
- **Kaynak:** `02-borclar.md` D4 · `remark-ocak-sections.ts:43-53`
- **Yazan:** `/site-rehber` sayfası "CANONICAL_SECTIONS tam 11 kalem" diyor.
- **Gerçek:** kodda **10 kalem** — `kayit-cta` KARAR 423 ile çıktı.
- **Not:** B29 kapanışı listeyi 10→9'a indirmeyi öneriyor (`al-ol-ver` emekli edilirse).
  İkisi birlikte yapılırsa sayı **9** olur; ayrı ayrı yapılırsa iki tur Notion girişi gerekir.
- **Neden borç:** düzeltme kod tarafında değil **içerik tarafında** — ADIM 3'ün doküman
  düzeltme kuyruğuyla kapanamaz, Notion'a elle girilir (KARAR 459).

## B32 — `ocak-referans.md` → `20-ref-*` birleştirme ✅ KAPANDI
- [ ] **Sahip:** Claude.ai
- **Tetikleyici:** ADIM 3b'den sonra, ADIM 4'ten önce
- **Sorun:** `docs/ocak-referans.md` (3574 satır) **tema bazlıdır** — yeni `20-ref-*`
  beşlisiyle aynı temaları kapsıyor. `20-ref-*` ADIM 3'te **Pilot'tan** dolduruldu;
  referans dosyasının oraya nasıl akacağı hiç tanımlanmadı.
- **Sonuç:** aynı konu için iki kaynak. "Hangi dosyada?" sorusu — KARAR 397'nin
  A/B seam kesimini tercih etme gerekçesinin ta kendisi.
- **Boşluk plandaydı:** `2026-08-06-ocak-gecis-plani.md` `20-ref-*`'ı hedef olarak
  sayıyor ama `ocak-referans.md`'nin akıbetini yazmıyor.
- **Neden ADIM 3'te yapılmadı:** bölme işini bulandırırdı; ayrıca A.X başlıklarının
  hangisinin bayat olduğu ancak kaynak okunarak anlaşılır (KARAR 456 ruhu —
  doğrulanamayan satır yazılmaz).
- **Not:** `ocak-referans.md`'nin başındaki "DÖNEM GÜNCELLEMELERİ KRONOLOJİDE" haritası
  bu işin giriş kapısıdır — hangi A.X'in hangi dönem bloğunda güncellendiğini gösterir.
- **ÖN KOŞUL (KARAR 467, 7 Ağu):** `ocak-referans.md` dağıtımı, ledger'da o dosyaya
  işaret eden `kaynak` hücrelerinin dönüşümünü **kendi kapsamına dahil eder**.
  Eşleme tablosu kesim anında üretilir — sonradan üretilemez. Ayrı tura bırakılmaz.
  *Gerekçe: kronoloji dilimlemesi B33'ü doğurdu (367 satır, ayrı tur), Pilot bölünmesi
  B37'yi doğurdu (23 satır, iki tur sonra fark edildi). Bu üçüncüsü olurdu.*
- **Sayım:** B32 ADIM 0 ölçümü **31** satır — 28 mekanik `:NNNN` + 3 `#kNNN`
  (KARAR 400, 407, 447). Buradaki eski "28" rakamı **yanlıştı**: yalnız mekanik
  biçimi sayıyor, `#k` üçlüsünü atlıyordu. Ledger dışı 2 işaretçi daha çıktı
  (bu dosyanın 48 ve 73. satırları) — toplam dönüşüm **33 hücre**.
- **KAPANDI — 7 Ağustos 2026.** 3574 satır 63 segmentte yedi hedefe dağıtıldı; kapsama
  tam, boşluk yok. Beşli **yedili** oldu: `20-ref-program.md` (658) + `20-ref-marka.md` (466)
  açıldı. Gerekçe ölçümlüdür — KARAR 398 ve 436'nın kaynak çapası beşlide ev bulmuyordu.
  1715 satır `90-kronoloji/2026-05.md` sonuna indi (A.24 tarihçesi %97 oranında kronolojide
  YOKTU, ölçüldü). 119 satır iskele yalnız `_arsiv/ocak-referans-v1.md`'de kaldı.
  Kaynak dönüşümü aynı turda: 31 ledger + 2 borclar hücresi. Köken izi
  `_arsiv/_bolme-haritasi-referans.tsv`.
  ADIM 0 patch'in dört beklenti rakamını ve bir hayalet satırı yakaladı; kaynak dosya
  3574 satır, arşiv payı 119, gövde payı 3455 (düzeltme: `b32-duzeltme-01.md`).

## B33 — Ledger `kaynak` sütunu dilimlemeden sonra kırık ✅ KAPANDI (7 Ağu, mekanik dönüşüm)
- [ ] **Sahip:** CC (mekanik dönüşüm)
- **Sorun:** `01-kararlar.tsv`'nin `kaynak` sütununda **386 satır** `ocak-kronoloji.md:NNNN`
  biçiminde satır numarası taşıyor. Dosya dilimlendi; numaralar artık hiçbir şeye
  denk gelmiyor.
- **Çözüm:** dilimleme sırasında üretilen satır-eşleme tablosundan (`eski satır → yeni
  dosya:satır`) mekanik dönüşüm. Elle düzeltilmez.
- **Ön koşul KARŞILANDI:** `docs/_arsiv/kronoloji-satir-esleme.tsv` üretildi —
  5675 satır, `eski_satir · yeni_dosya · yeni_satir`, birebirliği doğrulandı
  (5675/5675, sapma 0). Bu borç artık kapatılabilir.
- **SIRA ŞARTI (KARAR 465, 7 Ağu):** ADIM 3b patch'i **ÖNCE**, B33 dönüşümü **SONRA**,
  ayrı commit. Gerekçe: 3b patch'inin çapaları bugünkü tsv'ye karşı yazıldı ve
  dokunduğu satırların çoğunda `kaynak` sütunu hâlâ `ocak-kronoloji.md:NNNN` biçiminde.
  B33 önce koşarsa o çapaların tamamı kırılır — mühürlenen kararın birebir ihlali.
  Ayrıca 386 satırlık mekanik diff, ~35 satırlık anlamsal diff'i gömer ve bisect'i öldürür.
- **SAYIM ŞARTI:** brief 386'yı sabitlemesin. ADIM 3b patch'i o satırların bir kısmını
  zaten yeni formata çevirdi. CC ADIM 0'da **yeniden saysın** ve raporlasın (KARAR 465).
- **Sonuç (7 Ağu):** **367** satır dönüştürüldü (ADIM 3b sonrası gerçek sayım; brief'in
  386'sı geçersizdi). Kapsama testi **367/367**. Nokta örnekleme **5/5**. `#k` biçimindeki
  **21** satır ezilmedi (brief 19 diyordu, dosya 21 dedi — KARAR 465). Ek olarak 455'in
  önekli `90-kronoloji/2026-08.md` değeri `2026-08.md#k455`'e normalize edildi — KARAR
  466'nın "`:NNNN` zamanla `#k`'ye terfi eder" kuralının ilk uygulaması. Dönüşüm betiği
  `docs/_uretilen/b33-kaynak-donusumu.py`. **KARAR 466** biçim kuralını mühürledi:
  `#kNNN` elle doğrulanmış çapa, `:NNNN` mekanik işaretçi; mekanik dönüşüm `#k`'yi asla ezmez.

## B34 — KARAR 143 ve 350: kod teyidi ✅ KAPANDI (7 Ağu, kod teyidi)
- [ ] **Sahip:** CC
- **Durum:** İki kararın da **metni ADIM 3b'de doğrulandı**; belirsizlik arkeolojide
  değil kodda.
- **143 (`/test` ODA_MAP):** karar /test'i ODA_MAP'e ekliyor (`2026-05.md:2612`).
  Bugün ODA_MAP'te /test yok. **Çıkarılma hiçbir kronoloji diliminde kayıtlı değil** —
  ya belgesiz bir kod değişikliği oldu, ya "29 slug" gözlemi yanlış.
- **350 (statik ember şerit):** karar vitrin sol şeridini `--ash`→`--ember` 3px statik
  yapıyor, hover/tap kaldırıyor (`2026-07.md:499`). "vitrin selektörü yok" gözlemi
  doğrulanmadı — sınıf adı KARAR 346 beş-desen ailesinde farklı olabilir.
- **Eylem:** `src/lib/oda-map.ts` gerçek slug seti + `dist/` grep. KARAR 355/408:
  durum component dosyasından değil `dist/`ten okunur. Sonuç iki ledger satırını
  TEYITSIZ'den çıkarır.
- **Sonuç (7 Ağu):** `ODA_MAP` gerçek slug sayısı **29** (ölçüldü, varsayılmadı); `/test`
  **YOK** — commit `82b5962` (6 Tem 2026) ile çıkarılmış, mesaj gerekçe **içeriyor**
  ("dev-only referans lansman öncesi ODA_MAP + [...slug] noindex branşından silindi").
  `dist/` route yok, Notion dump'ında da yok → lansmanda public olma riski yok, B39 açılmadı.
  Vitrin deseninin gerçek adı **`.liste__oge`** (`CARD_SECTIONS`: temalar/turler/formatlar/
  seri-atolyeler) — ledger'ın "vitrin selektörü yok" notu **yanlış ada bakıyordu**.
  `dist` kuralı: `border-left:2px solid var(--ray-notr)` + `[open]`/`article` → `--ember`;
  yani 3px değil 2px, statik değil durum-bağımlı. Hover/tap kalıntısı **yok** (tek
  `:focus-visible` outline — klavye erişilebilirliği), B38 açılmadı.
  Ledger: 143 → `IPTAL` (süperseleyen karar yok, geri alan bir commit) · 350 → `SUPERSEDE →411`
  (kısmi: hover/tap yasağı korundu, geometri + ray semantiği değişti). **TEYITSIZ 3 → 1** —
  kalan 251, kaynak metni bulunamadığı için (KARAR 456).

## B35 — KARAR 87 üç ayrı şeye atfediliyor
- [ ] **Sahip:** Claude.ai
- **Sorun:** Ledger'da `87 = "Bir Sonraki [X]" callout pattern'ı` (KALICI) ve
  kronoloji bunu doğruluyor (`2026-05.md:65`). Ama prose'da aynı numara iki şeye daha
  atfediliyor: **ODA_MAP kapalı set disiplini** (`2026-05.md:1456`, `:2688`) ve
  **"sayım yazıyla" disiplini** (`2026-05.md:284`, `:727`).
- **Neden önemli:** `00-durum.md` "sessiz kırılma noktaları" bölümünde
  `ODA_MAP kapalı settir → KARAR 87` işaretçisi var. İşaretçi kırık — okuyan yanlış
  karara gider. B05 ile aynı sınıf hata, daha sinsi hâli.
- **Eylem:** ODA_MAP kapalı set kuralının gerçek numarasını kronolojiden bul; yoksa
  yeni numara ver. `00-durum.md` işaretçisini düzelt. **ADIM 3b'de açıldı, kapsamına
  alınmadı** — kapsam genişletmesi KARAR 52 ihlali olurdu.

## B36 — Kaynağı sığ satırlar
- [ ] **Sahip:** Claude.ai
- **Sorun:** B33 dönüşümü sonrası **25 satırın** `kaynak` değeri `00-devir.md:1-34`
  aralığına düşüyor — monolitin kapağı, yani **sürüm listesi**. Bir kararın hangi
  sürümde mühürlendiğini söyler; **ne olduğunu söylemez.**
- **Neden borç:** B13'ü doğuran hastalığın aynısı. ADIM 1'in ilk geçişi kapaktı, gerçek
  tanım dönem bloğundaydı. 154·196·223·400·407 tam bu yüzden TEYITSIZ kalmıştı ve ADIM 3b'de
  tanımları bulundu. Kalan 25 satır için de aynı iş yapılabilir.
- **Neden acil değil:** satırların durumu doğru, yalnız kaynağı zayıf. Kırık değil, sığ.
  TEYITSIZ değiller — okuyan yanlış yere gitmez, sadece derine inemez.
- **Eylem:** blok blok tara, `#kNNN` çapasına terfi ettir. ADIM 3b'nin yöntemi birebir
  uygulanır. B32'den sonra, ADIM 4'ten önce ya da sonra — sıra serbest.
- **Kapsam genişlemesi (7 Ağu, B37):** +12 satır (366-371 · 376-379 · 381-382).
  Pilot'un yoğun paragraflarında birden çok karar tek satırda anılıyordu; dönüşüm
  hepsini aynı hedef satıra çözdü — doğru dönüşüm, sığ kaynak. Toplam ~37 satır.
  *Sayım dosyadan doğrulandı (KARAR 465): `2026-07.md:16` altı satır (366-371),
  `2026-07.md:20` altı satır (376-379, 381-382). 380 hariç — ADIM 3b onu `#k380` yapmıştı.*
- **B32 bulguları — beş sığ çapa vakası, ve kuyruk boyutu teyitsiz.**

  **Kesim ve dönüşüm sırasında (beş):**
  - **409** → halefi 433'ün satırına bakıyor; 409'un kendi metni `20-ref-protokoller.md`'de
    (`NOTION MARKER'I BİR SÖZLEŞMEDİR`), farklı dosyada.
  - **424** → halefi 445'in satırına bakıyor; kendi metni iki satır yukarıda.
  - **415 ve 417** aynı satıra bakıyor.
  - **218 · 307 · 335** üçü de 423'ün satırına bakıyor (halef metni — savunulabilir,
    ama `#k` terfisinde ayrıştırılmalı).
  - **336 ve 414** ikisi de `20-ref-site.md:156`'ya bakıyor (eskiden `:1179`). 414,
    336'nın revizesi olduğu için savunulabilir; yeni doğmadı, dönüşüm ölçünce göründü.

  **Örneklem denetiminde (7 Ağustos).** Kaan beş numara seçti — 19 · 176 · 295 · 376 ·
  461. Çapaları takip edildi. **Beşi de uydurma değil; beşinin de çapası zayıf:**
  - **19** → `2026-02.md:35` tek satırlık **indeks** girdisi, gerekçe değil. Üstelik
    "Bölüm A.7"ye işaret ediyor — o bölüm B32 ile `20-ref-program.md`'ye indi.
  - **295** → `2026-07.md:184` **KARAR 294'ün metni.** 295 aynı blokta, başka satırda.
  - **376** → `2026-07.md:20` dönem özeti bülteni; 376'nın kendi metni `:749`'da.
  - **176** → `dist / ates-mektuplari__success` — şemada tanımsız biçim (aşağı bak).
  - **461** → `2026-08-06-ocak-gecis-plani.md`, satır numarası yok; ve o dosya beş
    yerinden bayat (sapma kaydı dosyanın sonunda).

  **Kuyruk boyutu ölçüldü (ADIM 4, 8 Ağustos 2026).** Bu maddedeki eski "~37 sığ kaynak
  satırı" rakamının kaynağı belirsizdi ve **kendisi doğrulanmamış bir sayıydı**
  (KARAR 465/470). Açılış ölçümü koşuldu: `docs/_uretilen/olcum-2026-08.md`.

  **Popülasyon:** `kaynak` sütununda `^[0-9A-Za-z-]+\.md:\d+(,\d+)*$` eşleşen **418**
  satır (kod dosyaları ve `dist` artefaktları hariç). Aşağıdaki dört-biçim tablosuyla
  birebir tutuyor. **Örneklem:** sistematik, `no`'ya göre sıralı, adım 20 ofset 10 —
  21 satır. Seçen taraf yok; yöntem yeniden üretilebilir.

  | sınıf | 21 satır |
  |---|---|
  | KENDİ — kararın kendi metni orada | **12 (%57)** |
  | KOMŞU — başka kararın metni / dönem özeti / indeks girdisi | **9 (%43)** |
  | HİÇ — satır yok ya da ilgisiz | **0** |

  `TEYITSIZ` yok. **`HİÇ` sıfır olması kuyruğun karakterini belirliyor: ledger kırık
  değil, sığ.** Okuyan yanlış yere gitmiyor, yalnız derine inemiyor — maddenin en baştaki
  teşhisi doğruydu, boyutu yanlıştı.

  **Kuyruk boyutu:** nokta tahmin `418 × 9/21 ≈ 179` satır. **Tek rakam yazılmıyor** —
  21'lik örneklemin güven aralığı geniş (~90-270). Kesin olan: eski "~37" en az **dört
  kat** düşüktü.

  **Kuyruğun üçte ikisi mekaniktir.** KOMŞU'ların **6'sı tek desenden** geliyor: erken
  sohbetlerin `- **KARAR N:** Başlık (Bölüm A.X)` biçimli karar listeleri — çapa listenin
  satırını gösteriyor, kararın metnini değil. Desen mekanik tespit edilebilir, dolayısıyla
  mekanik onarılabilir (B33/B37 sınıfı bir dönüştürme betiği). Kalan üçü tekil ve elle
  bakılır: **162** (görev listesi) · **231** (komşu kararın metni) · **381** (dönem özeti).

  **ADIM 5-6'ya etkisi: `ocak-kararci`'ye onarım modu gerekmiyor.** Kadro tanımı
  (KARAR 458) değişmiyor. B36 iki ayağa bölünüyor:
  - **B36-a (mekanik, CC):** karar-listesi deseni → `#kNNN` terfisi. ADIM 5 ile aynı
    turda gidebilir.
  - **B36-b (elle, Claude.ai):** desen dışı kalanlar + aşağıdaki bilinen sığ çapalar.
    B36-a bittikten sonra, kalan kuyruk yeniden ölçülür.
- **Açılış ölçümü yapıldı:** ADIM 4, `docs/_uretilen/olcum-2026-08.md` (8 Ağustos 2026).

- **`kaynak` sütununda iki tanımsız biçim — şema eksiği.** KARAR 466 iki biçim
  tanımladı. Ledger fiilen **dört** biçim kullanıyor:

  | biçim | satır | örnek |
  |---|---|---|
  | mekanik `:NNNN` | 418 | `2026-07.md:705` |
  | elle konmuş `#` çapası | 35 | `2026-07.md#k366` (25) · `2026-08.md#adim1` (10) |
  | **kod/dist artefaktı** | **8** | `src/styles/global.css:21,142` · `dist / ates-mektuplari__success` |
  | **çıplak dosya adı** | **7** | `20-ref-protokoller.md` |

  Son ikisi yanlış değil — kod artefaktı KARAR 102/355 ruhuna uygun, hatta prose'dan
  **daha** doğrulanabilir. Sorun isimsiz olmaları: şema tanımadığı için hiçbir doğrulama
  onları kapsamıyor. B36'da ya KARAR 466 genişletilir ya ayrı KARAR açılır.

- **`iliski` sütunu bazı satırlarda not taşıyor, ilişki değil.** Örnek: KARAR 176 →
  `dist teyitli (ember dot render oluyor)`. Sütun `→ ← ↔` için tanımlıydı. Kaç satırda
  olduğu sayılmadı.

- **Prose'a gömülü durum etiketi — dokuz satır, altısı mükerrer.** `20-ref-*` ailesinde
  ledger'a ait durum değerleri prose'da tekrar ediliyor:

  | dosya:satır | etiket | ledger |
  |---|---|---|
  | `20-ref-icerik-dili.md:11` | KALICI | 354 = KALICI ✅ |
  | `20-ref-site.md:26` · `:178` | KALICI | 427 = KALICI ✅ |
  | `20-ref-site.md:196` | SUPERSEDE (←423) | 433 = SUPERSEDE ✅ |
  | `20-ref-site.md:198` | KISMEN SUPERSEDE (←424) | 445 = SUPERSEDE ✅ |
  | `20-ref-protokoller.md:13` | KALICI | 355 = KALICI ✅ |
  | `20-ref-protokoller.md:35` | KALICI/yardımcı | 427 = KALICI ⚠ |
  | `20-ref-protokoller.md:47` | KALICI | 460 = KALICI ✅ |
  | `20-ref-protokoller.md:49` | — | kuralın kendi tarifi, etiket değil |

  **Hiçbiri yanlış değil; hepsi mükerrer.** `20-ref-protokoller.md:49` "durum ledger'da
  yaşar, referans dosyasında tekrar edilmez" diyor — altı kardeş satır tam olarak bunu
  yapıyor. **İki ayrıntı:** (a) KARAR 427 **iki dosyada birden** etiketli ve metinler
  ayrışmış (`KALICI` vs `KALICI/yardımcı`) — ayrışma tam da tekrarın maliyeti;
  (b) SUPERSEDE taşıyan 433 ve 445, yukarıdaki sığ çapa listesindeki kararların ta
  kendisi. B32 hiçbirine dokunmadı.

- **Enum rename kuralı iki kayıtta** (`20-ref-protokoller.md`, yan yana). B32 taşıdı ama
  birleştirmedi — birleştirme yeniden yazımdır, KIRPMA YASAĞI kapsamı. B36'da tek kayda
  indirilir; ikisinin de benzersiz cümlesi korunur.
- **B36-a ✅ (8 Ağu, `c6a969b`):** Desen mekanik olarak ölçüldü, ledger'a yazılmadı.
  Betik: `_uretilen/b36a-desen-tespiti.py` · çıktı: `b36a-adaylar.tsv` (181 satır) +
  `b36a-rapor.md`.
  Ölçüm — popülasyon betikçe yeniden üretildi, `olcum-2026-08.md`'nin 418'i
  devralınmadı; ledger 468→474 veri satırına büyüdü ama altı yeni satırın hiçbiri
  `:NNNN` biçiminde değil, popülasyon sabit kaldı:
  **418 mekanik · 119 sığ (%28.5) · tek-aday 12 · çok-aday 36 · adaysız 71 · çözülemeyen 0.**
  Nokta örneklemesi **2/5** — DUR-3 tetiklendi, yöntem yetersiz.
  ⚠ **Kapsam düzeltmesi:** `olcum-2026-08.md` "mekanik `#kNNN` terfisi" diyordu;
  **KARAR 466 buna izin vermez** — `#k` tanımı gereği elle doğrulanmış çapadır.
  Puanlama neden yanıldı: `ETIKET`/`BASLIK`/`PARANTEZ` sinyalleri **numaranın geçtiği**
  satırı buluyor, **kararın kaydı olan** satırı değil. Üç vaka: `131` liste
  girdisinden liste girdisine · `91` ters atıf yönü (kararı uygulayan satır) ·
  `89` uzunluk bonusu tek parantez-içi atıfa en yüksek puanı verdi.
- ⚠ **B36-b'nin cinsi değişti ve büyüdü.** Önceki tanım üç kararı (162 · 231 · 381)
  sayıyordu ve iş "çapa düzeltme"ydi. Ölçüm gösterdi ki **119 sığ satırın 71'inin
  (%60) adayı yok** — o kararların kronolojide karar-listesi indeksinden başka kaydı
  **hiç yazılmamış.** Taşınacak hedef mevcut değil. B36-b'nin işi çapa düzeltme değil
  **kayıt yazma**; her satır okuma ve yargı gerektirir, mekanikleşmez.
  Tek-aday 12 satır mekanik taşımaya meşru ama tek başına tur açmaya değmez —
  B36-b içinde eritilir.

## B38 — Ledger çapa denetimi (terminal kontrol)

- **Sahip:** Claude.ai · **Tetikleyici:** ADIM 4-7 oturduktan sonra, doküman geçişinin
  **son** işi olarak.
- **Sorun:** Ledger 468 kararın *durumunu* güvenilir taşıyor ama *nereye işaret ettiğini*
  taşımıyor. Elle doğrulanmış çapa oranı **%7,5** (35/468). Kalan 418 mekanik satırın
  doğru satırı gösterdiği hiç ölçülmedi; bugüne kadar bakılan on vakanın **onu da**
  sığ ya da komşu-gösteren çıktı.
- **Neden en sona:** her doküman turu ledger'ı biraz daha oynatıyor (B32 tek turda 33
  hücre taşıdı). Denetimi ortada yapmak, sonrası kayınca boşa gider. ADIM 7 (MCP)
  oturduğunda ledger artık hareket etmiyor olacak — denetim orada anlam kazanır.
- **Yöntem — örneklem, tam tarama değil:** rastgele 15-20 mekanik `:NNN` satırı çekilir,
  çapası takip edilir, üç kategoriye ayrılır (kendi metnine · komşusuna · hiçbir yere).
  Oran çıkar, kuyruk boyutu **ondan sonra** yazılır. **Örneklemi Claude seçmez** —
  numaraları Kaan verir. Gerekçe: seçen taraf kendi kör noktasına göre seçer.
- **Ön ölçüm yapıldı (ADIM 4):** aynı yöntem 21 satırlık örneklemle koşuldu, isabet
  %57 çıktı. B38 bunu tekrarlamaz — B36-a bittikten **sonra** koşar ve mekanik onarımın
  oranı ne kadar oynattığını ölçer. Karşılaştırma tabanı: `_uretilen/olcum-2026-08.md`.
- **B36 ile ilişki:** B36 bilinen sığ çapaları terfi ettirir; B38 **bilinmeyenin oranını**
  ölçer. B36 önce, B38 en sonda — B36 bitince denetim onun ne kadarını kapattığını da
  gösterir.
- **Kaynak:** B32 örneklem denetimi (7 Ağustos 2026, Kaan'ın seçtiği beş numara:
  19 · 176 · 295 · 376 · 461).

## B39 — `ocak-kaynak-kanonu.md` + `Ocak-Mufredat.md` dağıtımı

- **Sahip:** Claude.ai · **Tetikleyici:** ADIM 4 sonrası; sırasız.
- **Sorun:** İki dosya hiçbir turda dağıtılmadı. ADIM 3 Pilot'u, B32 Referans'ı
  dağıttı; bu ikisi hiçbir adımın kapsamına girmedi. Geçiş planı ikisini ölçüm bloğunda
  sayıyor ama HEDEF YAPI'da hedefleri yok.
- **Ölçüm (8 Ağustos 2026):** `docs/ocak-kaynak-kanonu.md` 172 satır ·
  `docs/Ocak-Mufredat.md` 275 satır — toplam 447. Örtüşme testi
  (`_arsiv/ocak-referans-v1.md` + `10-marka.md` + beş kronoloji dilimi + `00-devir.md`,
  7-kelimelik shingle, 60+ karakterlik satırlar): **237 satırın 226'sı (%95,4)** hiçbir
  dağıtılmış kaynakta yok. *Düzeltme 04 bu ölçümü **231/232 (%99,6)** olarak yazmıştı;
  CC yeniden ürettiğinde 226/237 çıktı ve her eşikte (~40/50/60/70/80 karakter) oran
  %95 civarında kaldı. İki rakam da kayda geçti — hangisinin yönteminin doğru olduğu
  B39'un ADIM 0'ında belirlenir (KARAR 465).* Sonuç değişmiyor: içerik evsiz.
  - **Sapmanın olası kaynağı — karakter mi bayt mı.** "60+ karakter" eşiği
    `awk length` ile ölçülürse Türkçe harfler iki bayt sayılır ve eşik
    kayar: aynı kurulum 237 yerine 248 satır verir. B39'un ADIM 0'ında
    yöntem sabitlenir (karakter sayımı, hangi araçla) ve rakamla birlikte
    yazılır. Bu tuzak B36 ve B38'de de çıkacak.
- **Neden borç:** iki dosya repoda duruyor ve Advaita kopyalarıyla birebir
  aynı — silinme riski yok. Sorun erişilebilirlik: 447 satır `docs/`
  mimarisinin dışında, hiçbir `20-ref-*` dosyasına ait değil, `baglam.sh`
  hiçbir profilinde görünmeyecek. Kaybolmuyorlar, bulunamıyorlar.
- **Muhtemel hedefler** (kesim anında kararlaşır, şimdi bağlayıcı değil):
  müfredat → `20-ref-program.md` · kanon anlatısı ve ad kökü → `20-ref-marka.md` ·
  `/adimiz` sayfa tarifi → `20-ref-site.md` · tema havuzu → içerik motoru olduğu için
  `20-ref-icerik-dili.md` adayı.
- **Yöntem:** B32 deseni — envanter, çakışma listesi, bölme haritası, `sed` ile
  satır-aralığı kopyalama, `_arsiv/`'e taşıma. Ledger dönüşümü aynı turda (KARAR 467);
  `kaynak` sütununda bu iki dosyayı gösteren satır **yok** (8 Ağustos'ta sayıldı, 0).
- **İşaretlenen, kapsam dışı:** `docs/sayfa-yazim-rehberi.md` (219 satır) da
  HEDEF YAPI'da sayılmıyor. Ama aynı sınıf değil — KARAR 111 ile doğmuş canlı
  bir kod sözleşmesi, `docs/` içinde duruyor ve `20-ref-notion.md` ona işaret
  ediyor. Sorunu "dağıtılmamış" değil, "planda sayılmamış". Çözümü dağıtım
  olmayabilir: kendi başına duran bir dosya olarak kalması meşru, o zaman
  düzeltilecek olan HEDEF YAPI'dır. B39'un ADIM 0'ında karara bağlanır,
  kapsamı şimdiden genişletilmez.
- **Kaynak:** ADIM 4 açılış paketi hazırlığı, 8 Ağustos 2026.

## B40 — "KIRPMA YASAĞI 61/88" konvansiyonu yanlış

- [ ] **Sahip:** Claude.ai
- **Sorun:** Doküman genelinde KIRPMA YASAĞI `KARAR 61/88` diye anılıyor
  (`2026-08.md:130`, KARAR 457 metni dahil). Ledger:
  `61 = KIRPMA YASAĞI (KALICI)` · `88 = Çekirdek + arşiv ikili yapısı (SUPERSEDE)`.
  88 KIRPMA kararı değil, artık var olmayan bir dosya yapısının kararı, ve
  yürürlükten kalkmış. KARAR 462 zaten `88 → 145 → 397` zincirini kuruyor.
- **Neden borç:** kalıcı bir kural, SUPERSEDE bir karara bağlanmış görünüyor.
  Kırık değil — 61 doğru ve KALICI — ama konvansiyon yanlış yere işaret ediyor.
- **Eylem:** 88'in KIRPMA soyu var mı, tam metninden ölçülür (`2026-05.md:71`).
  Varsa "61/88" korunur ve 88'in ledger başlığı eksik demektir; yoksa doküman
  genelinde `KARAR 61` tekilleştirilir. CLAUDE.md bugün **61** yazıyor.
- **Kaynak:** ADIM 4 hazırlık ölçümü, 8 Ağustos 2026.

## B41 — Ledger'da tema sütunu yok, `marka` profili filtreleyemiyor

- [ ] **Sahip:** Claude.ai
- **Sorun:** Geçiş planı `baglam.sh marka` profilini "kararlar(marka filtreli)"
  olarak tanımlıyor. Ledger'da tema/alan sütunu yok; filtre `baslik` metnine
  dayanmak zorunda ve sessizce yanlış keser — bir marka kararı "marka" kelimesini
  içermeyebilir.
- **Karar (ADIM 4):** `marka` profiline ledger **hiç** girmiyor. Yarım filtre,
  filtresizden tehlikelidir (eksik olduğu görünmez).
- **Eylem:** ya yedinci sütun (`alan`) açılır — 470 satır elden geçer, pahalı —
  ya profil ledgersiz kalır. B38 ile aynı turda bakılabilir; ledger o zaman
  zaten satır satır denetlenecek.
- **Kaynak:** ADIM 4, `baglam.sh` profil tasarımı.

## B42 — `site-icerik` üretim yolu HEDEF YAPI ile hizasız ✅ KAPANDI (8 Ağu, ADIM 5)

- [ ] **Sahip:** CC · **Tetikleyici:** ADIM 5 (scripts/skills turu)
- **Sorun:** Üç ayrışma var, üçü de aynı dosyanın etrafında:
  (a) `scripts/site-icerik-dump.mjs` çıktıyı **repo köküne** yazıyor; HEDEF YAPI
      `_uretilen/site-icerik.md` diyor (KARAR 455).
  (b) Dosya **iki kopya** hâlinde duruyor — `./ocak-site-icerik.md` ve
      `./docs/ocak-site-icerik.md`, md5 eşit (`6859e845…`), 4.821 satır. İkincisi
      script çıktısı değil; artık kaynağı belirsiz bir kalıntı.
  (c) `.gitignore:42` deseni `ocak-site-icerik.md` — başında `/` yok, **her derinlikte**
      eşleşiyor. `_uretilen/` altına taşınsa da ignore kapsamında kalır.
- **Neden borç değil acil iş:** her iki kopya da aynı içerik, üretim yolu canlı,
  kimse yanlış dosyayı okumuyor. Ama iki kopya = ADIM 0'ın bayat-dump tuzağı
  (KARAR 355) için açık kapı.
- **Eylem (tek tur):** `OUT_PATH` → `docs/_uretilen/site-icerik.md` · `.gitignore`
  deseni kök-bağlı (`/ocak-site-icerik.md`) yapılıp yeni yol için satır eklenir ·
  `docs/ocak-site-icerik.md` kalıntısı kaldırılır · script'in çıktı yolunu okuyan
  tüketici var mı diye tek grep (`grep -rn "ocak-site-icerik" --exclude-dir=node_modules`).
- **Bu turda dokunulmadı:** ADIM 4 doküman turudur; çıktı yolu değişikliği tüketici
  taraması ister ve kod turuna aittir (KARAR 463 ruhu).
- **Kaynak:** ADIM 4 ADIM 0 raporu, Ç1 + Ç2 (8 Ağustos 2026).
- **Sonuç (8 Ağu, ADIM 5):** `OUT_PATH` → `docs/_uretilen/site-icerik.md` · yorum satırı
  da güncellendi · `docs/ocak-site-icerik.md` kalıntısı kaldırıldı · `.gitignore` deseni
  kök-bağlı (`/ocak-site-icerik.md`) + yeni yol için satır. Tüketici taraması: **kod
  tüketicisi yok**, yirmi eşleşmenin tamamı doküman/kronoloji/`.claude/` notu.
  ⚠ **Kök kopya `./ocak-site-icerik.md` yerinde bırakıldı** — script yeniden koşana kadar
  tek canlı dump; emekliye ayrılması ilk dump'tan sonra ayrı turdur.
  ⚠ **Eylem sırası bağlayıcı çıktı:** kalıntı önce silinir, desen sonra kök-bağlı yapılır.
  Ters sırada 146 KB türetilmiş artefakt izlenir hale gelir. Borç maddesi bu sırayı
  yazmıyordu.

## B37 — `ocak-pilot.md:NNNN` referansları da kırık ✅ KAPANDI (7 Ağu, mekanik dönüşüm)
- [ ] **Sahip:** CC (mekanik)
- **Sorun:** B33 dönüşümü sonrası ledger'da **23 satır** `ocak-pilot.md:NNNN` gösteriyor.
  O dosya ADIM 3'te `_arsiv/ocak-pilot-v52.md`'ye alındı — numaralar hiçbir yaşayan
  dosyada karşılık bulmuyor. B33 ile **aynı sınıf hata, farklı dosya**; B33 brief'i
  yalnız `ocak-kronoloji.md` desenini kapsıyordu.
- **Ön koşul KARŞILANDI:** `docs/_arsiv/_bolme-haritasi.tsv` (403 satır, `pilot_satir · hedef ·
  ilk_80_karakter`) ADIM 3'te bölme anında üretildi — B33'ün eşleme tablosuyla aynı rol.
- **Eylem:** B33 betiğinin ikizi. Hedef sütunu kısa kod taşıyor (`STRUCT`, `K7`, `RS`…),
  gerçek dosya adına çözülmesi gerekir — B33'teki gibi doğrudan dosya:satır değil.
  Nokta örnekleme zorunlu.
- **Not:** B32 ile taşındı — üç `#k` çapası artık `20-ref-icerik-dili.md#k400`,
  `20-ref-protokoller.md#k407`, `20-ref-bot.md#k447`. Çapa adları korundu.
- **Sonuç (7 Ağu):** **23** satır dönüştürüldü. Kapsama **23/23** · nokta örnekleme **5/5** ·
  `#k` biçimi ezilmedi (23 → 24, artan yalnız KARAR 467). **Artık: 0** — 23 satırın hiçbiri
  `STRUCT` koduna düşmedi; Dal B'nin tek riski oydu ve gerçekleşmedi. İçerik eşleştirmesi
  23/23 tek eşleşme verdi (sıfır/çoklu yok). Kod çözüm tablosu `_uretilen/bolme-kod-cozumu.tsv`,
  betik `_uretilen/b37-pilot-referans-donusumu.py`. **KARAR 467** bu sınıf kırıklığın üçüncü
  tekrarını önlemek için mühürlendi.


---

# ADIM 3 DOKÜMAN DÜZELTME KUYRUĞU

Kod teyidinin yan ürünü: master dosyaların **yanlış olduğu** kanıtlanan yerler.
Bunlar borç değil, doküman hatası — ADIM 3'te Pilot bölünürken düzeltilir.

| # | nerede | yazan | gerçek |
|---|---|---|---|
| D1 | `ocak-pilot.md:33` | KARAR 372 "önerilen `clip` geçişi UYGULANMADI" | `global.css:21,142` → `clip` canlı; `hidden` yalnız `@supports not` fallback'i |
| D2 ✅ | Pilot (test sayısı) | 146/146 test | **181/181** — 10 dosya (6 Ağu ADIM 0). Kapanış anında 176/176 yazılmıştı; KARAR 464'ün 5 TZ sınır testi aynı gün eklendi |
| D3 | `atmosfer.css:1537` (yorum) | iki section adı | dört selektör: `etkinlik-takvimi`, `sonraki-bulusma`, `kayit-btn`, `mini-cta` — bkz B25 |
| D5 | KARAR 204 metni | "`--altin` token tek-kaynak" | token adı **`--gold`** — ve öyle kalıyor (6 Ağu kararı). `--ember`, `--ash`, `--cream-soft` de İngilizce; sapan KARAR 204'ün metni |
| D4 | `/site-rehber` (Notion içeriği) | "CANONICAL_SECTIONS tam 11 kalem" | kodda 10 kalem (`remark-ocak-sections.ts:43-53`); `kayit-cta` KARAR 423 ile çıktı. **Düzeltme kod değil içerik tarafında** — Advaita/Kaan Notion'a girer |

**D1 · D2 · D3 · D5 KAPANDI (6 Ağustos, ADIM 3).** Düzeltmeler türetilmiş katmana yazıldı:
D1 → `20-ref-protokoller.md` (OVERFLOW bloğunun altına ek düzeltme notu) · D2 → `00-durum.md`
(181/181) · D3 + D5 → `20-ref-site.md` GÜNCEL GERÇEK bölümü. **D4 → B31 olarak açıldı**
(içerik tarafı, Notion girişi gerekir).

**ADIM 3'te açılan iki yeni doküman hatası:**

| # | nerede | yazan | gerçek |
|---|---|---|---|
| D6 | `02-borclar.md` başlığı | "31 madde · 19 açık" | B01–B30 = 30 madde · 20 açık — **düzeltildi** |
| D7 ✅ | Pilot (build) | 33 sayfa | **KAPANDI (6 Ağu, ADIM 0):** 32 prerender + 10 SSR + 6 API route. "33" hiçbir sayıma denk gelmiyor — rakam köksüzdü. Ders: tek-sayı beyanları çok-hedefli build'de anlamını yitirir |
| D8 | Pilot TECH STACK "Form/Backend" | Apps Script unified doPost = canlı form backend | Apps Script **EMEKLİ**, backend tamamen Vercel; blok aynı dosyanın #38 bölümüyle çelişiyordu — bloklar `90-kronoloji/2026-07.md`'ye indi, düzeltme `20-ref-site.md`'de |

Ek ✅ (7 Ağu, ADIM 3b): KARAR 380 çözüldü → `AKTIF`. KARAR 350 ve 143'ün **karar metinleri
doğrulandı**; kalan belirsizlik doküman değil kod sorusu → **B34**. Teşhis doğruydu:
sebep kaydın eksikliği değil, brief'te beklenen kanıtın çıkarımdan üretilmiş olmasıydı.
Bu gözlem KARAR 465'in doğrudan kaynağıdır.

## B43 — `10-marka.md` iki ölü Pilot işaretçisi

- [ ] **Sahip:** Claude.ai
- **Sorun:** `ocak-pilot.md` ADIM 3'te dağıtıldı. `10-marka.md:9` dağıtımı kabul
  ediyor, ama iki gövde satırı hâlâ Pilot'a işaret ediyor:
  - `:174` — "Tam sayfa listesi + URL + canlı durumlar için Pilot dosyasındaki
    'Site Mimarisi' tablosuna bak." → hedef bugün `20-ref-site.md`, karşılığı **tam**.
  - `:235` — "Detaylı tampon + sohbet sırası + lansman sonrası roadmap için Pilot
    dosyasındaki SIRADAKİ ADIMLAR bölümüne bak."
- ⚠ **İkinci işaretçinin hedefi tam karşılığı yok.** `03-sira.md` "sıradaki iş"i ve
  LANSMAN bölümünü taşır; **"tampon" ve "lansman sonrası roadmap" hiçbir canlı dosyada
  ev sahibi bulmuyor.** İki seçenek, karar B43 turunda: (a) işaretçi `03-sira.md` +
  `02-borclar.md`'ye bölünür ve kapsamı daraltılır, (b) kavramın evsizliği kabul edilip
  işaretçi düşürülür — **ölü işaretçi içerik değil adrestir**, düşürülmesi KIRPMA
  YASAĞI'nı ihlal etmez. Seçenek (b) seçilirse evsiz kavram B39 ailesine not düşülür.
- **Neden borç:** marka dosyası project files'ta ayna olarak duruyor (KARAR 471); ölü
  işaretçi en çok orada zarar verir — bağlamı olmayan bir sohbet var olmayan dosyayı arar.
- **Kaynak:** ADIM 5 brief hazırlığı + ADIM 5 ADIM 0 raporu Ç2, 8 Ağustos 2026.

## B44 — `@ocak.life` bayat handle'ı — beş canlı dosyada, bir kısmı tarihsel kayıt

- [ ] **Sahip:** Claude.ai
- **Sorun:** Marka v1.4 (28 Temmuz 2026) handle'ı `@ocak.biz` yaptı. `@ocak.life` hâlâ
  geçiyor. Ölçüm (ADIM 5 ADIM 0, `grep -rn`, canlı dosyalar):
  `docs/20-ref-site.md:128` (dosyada tek eşleşme) · `docs/10-marka.md` ·
  `docs/20-ref-marka.md` · `docs/01-kararlar.tsv`. Ayrıca `_uretilen/` altında 2 —
  **türetilmiş, dokunulmaz**, kaynağı düzelince yeniden üretilir.
- ⚠ **SWEEP YASAK — önce sınıflandırma.** Eşleşmelerin bir kısmı **tarihsel kayıttır ve
  korunur.** Teyitli vaka: `10-marka.md:3` sürüm notu `@ocak.life` → `@ocak.biz`
  değişikliğinin **kendisini anlatıyor**; oradaki dize "düzeltilirse" kayıt yalan söyler.
  Ledger satırı büyük olasılıkla aynı sınıfta (rename kararının başlığı). Bu tam olarak
  KARAR 465'in uyardığı vakadır: *"`N → 0` biçimindeki grep kriterleri, aranan dizenin
  korunması gereken tarihsel anlatımda da geçip geçmediği kontrol edilmeden yazılmaz."*
- **Eylem:** her eşleşme tek tek **canlı referans** / **tarihsel kayıt** diye
  sınıflandırılır; yalnız canlı referans düzeltilir. Sınıflandırma tablosu üretilir ve
  borç maddesine iliştirilir.
- **Kapanış kriteri:** `grep -c` sıfır **DEĞİLDİR.** Kriter sınıflandırma tablosunun
  tamamlanmasıdır; tarihsel kayıtlar sayımda kalır.
- **Neden borç:** `ocak-lint` yasak-dize listesinin ilk gerçek vakası ve `istisna`
  sütununun ilk tatbiki. Marka dosyalarında (`10-marka.md`, `20-ref-marka.md`) bayat
  handle en çok zarar veren yerdedir — brief bu ikisini saymıyordu, ADIM 0 buldu.
- **Kaynak:** ADIM 5 brief hazırlığı + ADIM 5 ADIM 0 raporu Ç1, 8 Ağustos 2026.
- ⚠ **Tarama bayat dosyada koşuldu (8 Ağu).** `ocak-lint`'in ilk sınamasında bulunan
  satır numaraları `ocak-referans.md` ve `ocak-marka.md`'ye ait — ikisi de ADIM 3 ve
  B32 ile dağıtıldı, artık otorite değil. Bulgular **taşınamaz**, satır numaraları
  tutmaz. Tarama `docs/` altındaki canlı dosyalarda yeniden koşulur.
- **Yan bulgu:** skill'in dağıtılmış dosyaları canlı sanması, project files aynasının
  hâlâ bayat olduğunu düşündürüyor (KARAR 471). B44 turunda ölçülür.
- **B44-a ✅ (8 Ağu, `062f03b`):** Veri dosyasının kendi çelişkisi kapandı —
  `kapsam="her yerde"` yazan altı satırın altısı da kendi tanımını yakalıyordu.
  `SKILL.md`'ye tarihsel kayıt muafiyeti eklendi, `istisna` → `ek_istisna`,
  `kapsam` sözlüğü dört değere indirildi. Dize sayısı korundu (24).

## B45 — `baglam.sh` bayt/karakter etiketi yanlış (`:65` + `:67`)

- [ ] **Sahip:** CC
- **Sorun:** İki satır, tek hata. `:65` → `BAYT=$((BAYT+${#l}+1))`; Bash `${#l}` UTF-8
  locale'de **karakter** sayar, bayt değil. `:67` → çıktıyı `~$BAYT bayt` diye
  etiketliyor. Türkçe metinde iki rakam ayrışır: ADIM 5 paketinde fark %5–8 ölçüldü
  (`02-borclar.md` 45.231 bayt / 41.889 karakter).
- **Eylem:** ikisinden **biri**, ikisi birden değil — ya `:67` etiketi `karakter`
  yapılır, ya `:65` gerçek bayta çevrilir. Tek satırlık iş.
- **Neden borç:** KARAR 470(b) vakası — ölçüm aracının kendi etiketi ölçtüğü şeyi
  yanlış adlandırıyor.
- **Kaynak:** ADIM 5 brief hazırlığı + ADIM 5 ADIM 0 raporu Ç3, 8 Ağustos 2026.

## B46 — ölçüm aracının kendisi hata kaynağı, dördüncü vaka

- [ ] **Sahip:** CC
- **Sorun:** Ölçüm araçları hata vermeden **yanlış rakam** veriyor. Dört vaka ölçüldü:
  - `awk length` bayt sayar, karakter değil ("çığır" = 5 karakter, 9 bayt)
  - `cut -c1-N` satırı kesince arkadaki kaydı gizler
  - `grep -o` deseni satır sonu beklediği için hiç eşleşmedi; boş dize karşılaştırıldı
    ve "tutmadı" raporlandı, oysa tutuyordu
  - `grep` (`-F` olmadan) `$'\t'` kalıbındaki `$`'ı desen karakteri saydı, `0` döndü
  - ayrıca `baglam.sh:65/:67` — B45, aynı ailenin beşincisi
- **Eylem:** `ocak-teshis`'in "Rapor biçimi" bölümüne bir **araç tuzakları** alt başlığı;
  her tuzağın yanına doğru aracı. B45 bu maddeye bağlanır ya da onunla birlikte kapanır.
- **Neden borç:** KARAR 470 rakamın yöntemiyle yazılmasını istiyor; yöntem yanlışsa
  rakam da yanlış ve **doğru rakam gibi görünüyor.**
- **Kaynak:** ADIM 5 · B44-a · B36-a turları, 8 Ağustos 2026.

## B47 — "ne nerede yaşar" haritası hiçbir dosyada yok

- [ ] **Sahip:** Claude.ai
- **Sorun:** `docs/` yapısının kendisi — hangi dosya neyi taşır, bir soruya cevap
  ararken nereye bakılır — yazılı değil. `CLAUDE.md` CC'ye bakıyor, `00-durum.md`
  döneme, `03-sira.md` kuyruğa. Haritanın tamamı yalnız sohbet bağlamında yaşıyor.
- **Neden borç:** Sistem tam olarak bunu önlemek için kuruldu. Bağlamı olmayan bir
  sohbet `baglam.sh` çıktısını alır ama dosyaların **birbirine göre rolünü** bilmez.
- **Eylem:** `docs/05-harita.md` (ya da `CLAUDE.md`'ye bölüm) — dosya tablosu +
  "şu soruyu sorarsan şuraya bak" eşlemesi. Kısa tutulur, bakım maliyeti düşük olmalı.
- **Kaynak:** 8 Ağustos 2026, gün sonu.

## B48 — `baglam.sh` manifesti `docs/` kökündeki dosyaları saymıyor

- [ ] **Sahip:** CC · **Tetikleyici:** profil bakımı turu; ADIM 7'den önce
- **Sorun:** `dokuman` profilinin manifest satırı `İÇERMEZ` listesinde
  `2026-08-06-ocak-gecis-plani.md`, `sayfa-yazim-rehberi.md`, `docs/skills/*` ve
  `scripts/*` **hiç geçmiyor.** Yani `docs/` kökünde yaşayan ama profil listesinde
  olmayan bir dosya **iki yönde birden görünmez**: ne gelir, ne "gelmedi" diye yazılır.
  Eksik-dosya guard'ı da tetiklenmez, çünkü guard listedeki dosyalara bakar.
- **Neden borç:** manifest satırının tek işi *"Claude ne göremediğini bilir"*. Bu tur
  geçiş planı pakette yoktu ve dosya adı yalnız açılış promptunun kendi listesinden
  çıkarıldı — manifest göstermedi. B45/B46 ailesinin kardeşi: **araç hata vermiyor,
  eksik olduğunu göstermeden eksik veriyor.**
- **Yan ayak — üç yetim `20-ref-*`:** `program` · `marka` · `notion` hiçbir profile
  girmiyor (sapma kaydı EK, 3-ek). `ocak-notion` doğdu ama Claude.ai yüzeyi
  `20-ref-notion.md`'yi hiçbir profilde göremiyor; skill'e "elle istenir" notu düşüldü.
  B41 yalnız `marka` profilinin ledger ayağını kapsıyor, bu ondan geniş.
- **Eylem:** manifest `İÇERMEZ` listesi profil listesinden değil `docs/` gerçeğinden
  türetilir (dizin taraması eksi `İÇERİR`). Üç yetim dosya profillere dağıtılır.
- **Kaynak:** ADIM 6 açılış ölçümü, 9 Ağustos 2026.

## B49 — kanonik section sayısı dört yüzeyde dört farklı (B31'in kardeşi)

- [ ] **Sahip:** Claude.ai (tespit) → Advaita/Kaan (Notion ayağı)
- **Ölçüm (9 Ağustos 2026, ekli dosyalardan):**

  | yüzey | sayı |
  |---|---|
  | `10-marka.md:184` | **8** — `al-ol-ver` ve `ic-ses` listede yok |
  | `docs/sayfa-yazim-rehberi.md` | **5 + 10** (5 component-render, 10 plugin-transform) |
  | kod — `remark-ocak-sections.ts` | **10** (`kayit-cta` KARAR 423 ile çıktı) |
  | `/site-rehber` Notion sayfası | **11** — bayat, B31 |

- **B31 ile ilişki:** B31 üç yüzeyi sayıyordu; **`10-marka.md`'nin 8'i dördüncü ve
  B31'de yok.** Aynı hastalığın marka dosyasındaki nüksü.
- **Neden borç:** `ocak-notion` doğdu ve doğrulamayı **koddan** yapıyor (KARAR 477) —
  yani kırılma artık yakalanabilir. Ama dört yazılı kaynağın üçü hâlâ yanlış sayı
  söylüyor ve okuyan onlara gidiyor.
- **Eylem:** kod ölçülür (tek gerçek), sonra `10-marka.md` ve rehber hizalanır;
  `/site-rehber` Notion ayağı B31 ile birlikte tek turda girilir. **Sweep yasak** —
  KARAR 423'ün tarihsel anlatımı korunur (KARAR 465).
- **Kod ayağı yerelde teyit edildi (CC, 9 Ağustos):** `CANONICAL_SECTIONS` = **10**
  (`src/lib/remark-ocak-sections.ts`; ölçüm yöntemi: `awk` ile dizi gövdesi kesildi,
  tırnaklı satır sayıldı) — `hero · bir-sonraki · sonraki-bulusma · al-ol-ver ·
  siradaki-kapi · sss · mini-cta · buyuk-vurgu` + kalan ikisi.
  `10-marka.md:184` = **8**, `al-ol-ver` ve `ic-ses` listede yok.
  `docs/sayfa-yazim-rehberi.md` = **219** satır. Tablodaki üç rakam de yerelde üretildi;
  brief'ten devralınmadı (KARAR 470).
- **Kaynak:** ADIM 6 açılış ölçümü, 9 Ağustos 2026.
