# AÇIK BORÇLAR

**Son güncelleme:** 11 Eylül 2026 · **ölçüm / yargı ayrımı turu**

---

> **Sayaç burada yaşamaz** (KARAR 579). Toplam · damgalı · iş değil · açık sayıları
> `04-olcum.md`'dedir; `scripts/durum-uret.mjs` her koşumda yeniden üretir ve devralmaz.
> Ölçüt başlıktaki **damga**dır, kelimenin kendisi değil (10 Ağu B01 kaydı).
>
> On üç turluk ölçüm tarihçesi, `Üretilen komutlar` kayıtları ve yöntem düzeltmeleri
> 11 Eylül 2026'da `90-kronoloji/2026-08.md`'ye **indi** — silinmedi, taşındı (KARAR 61).

Numaralar sabittir, yeniden kullanılmaz. Kapanan maddeler silinmez — nasıl kapandığı bilgisi
kendisi işe yarıyor (KARAR 61 ruhu).

| Kim | Açık maddeler |
|---|---|
| **Kaan** | B07 · B12 · B14 · B15 · B18 · **B19** (yayını kilitleyen) · B53 · B57 · **B64** · B65 · B69 · B72 · B73 · B74 |
| **CC** | B09 · B10 · B11 · B16 · B17 · B45 · B46 · B48 · B51 · B60 · B61 · B62 · B63 |
| **Claude.ai** | B04 · B08 · B31 · B35 · B36 · B38 · B39 · B41 · B43 · B44 · B49 · B52 · B59 · B66 · B67 · B68 · B70 · B71 |

> **Bu tablo indekstir, otorite gövdelerdir** (KARAR 482 kural 1a). Çelişkide gövdedeki
> `**Sahip:**` satırı geçerlidir; tablo ondan türetilir, ters yön hiçbir zaman yapılmaz.
> Devir zincirinin **ilk halkası** yazılır — tam zincir gövdede. İş değil sayılanlar
> (B26 ⏸ · B30 🔵) ve alt maddeler (B36-a · B44-a) tabloda görünmez.
> Türetme: 11 Ağustos 2026 (ikinci tur), 31 açık madde.
| **CC (kod teyidi)** | B34 ✅ |
| **İçerik (Advaita/Kaan)** | B04 · B08 |
| **Planlı, tarih yok** | B30 (kilit — `EtkinlikKart.astro` silinmez) |
| **ADIM 4'e bağlı** | B01 |
| **İçerik (Notion girişi)** | B31 |

---

## B01 — klon ve remote adı `ocak` olur ✅ KAPANDI (10 Ağu, tek tur)
- [x] **Sahip:** Kaan + CC
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
- **Kapanış (10 Ağu, commit `50294e6`):** altı adımın altısı koşuldu. Remote
  `hlaorpz/ocak` · yerel klasör `~/Desktop/hlaorpz/ocak` · Vercel proje adı `ocak`.
  Repo içi canlı yol referansları **13 satır → 3 satır** (ölçüm: `git ls-files` kümesi,
  `docs/_arsiv/` hariç, `grep -F`, birim = eşleşen satır). Değişen: `docs/skills/` beş
  `SKILL.md` (10 satır) + `20-ref-site.md:14` (1 satır) = 6 dosya · 11 satır.
  `.gitignore`'lu iki dosya elle düzeltildi: `settings.local.json` 12 geçiş,
  `notes.md` 1 geçiş (`:782`).
- ⚠ **Maddenin iki iddiası ölçümle yanlışlandı — düzeltme burada, gövdede değil (KARAR 61):**
  1. Gövde "`cd` öneki bir konvansiyon (`CLAUDE.md`)" ve "düzeltilecek olan `CLAUDE.md`
     konvansiyon satırı" diyor. **`CLAUDE.md`'de o dize yok** — dosyanın 114 satırında
     hiçbir mutlak yol geçmiyor (ölçüm: `grep -Fc`, 10 Ağu, CC teyitli). Dolayısıyla
     `CLAUDE.md` bu turda **hiç değişmedi** ve "Sahip: … Claude.ai (`CLAUDE.md`
     konvansiyon satırı)" satırı da yanlıştı. Konvansiyon yazılı bir kural değil,
     brief'ten brief'e taşınan bir alışkanlıktı.
  2. Gövde adım 5'i "eski mutlak yol" diye tarif ediyor ve `hlaorpz/` öneki varsayıyor.
     Gerçekte `settings.local.json`'ın 12 geçişinin 12'si de **önek**siz eski yolu
     (`/Users/kaan/Desktop/ocak-site-clone`) taşıyordu; dosya `hlaorpz/` alt klasörüne
     taşınmayı hiç görmemişti.
- **Sıfır kriteri yazılamadı, yazılmamalıydı da:** 13 → **3**, sıfır değil. Korunan üç
  satır: `02-borclar.md:53` · `:58` (bu maddenin kendi gövdesi) ve
  `_uretilen/b36a-desen-tespiti.py:8` (betiğin koşum künyesi). `docs/_arsiv/` altındaki
  11 dosya · 56 satıra dokunulmadı. Bağımsız kanal doğruladı: beş skill dosyasının her
  biri satır sayısı × 11 bayt küçüldü, korunan iki dosya **bayt olarak değişmedi**.
- **Dış ayaklar ölçüldü, varsayılmadı:** Vercel git bağlantısı `githubRepoId
  1162985583` üzerinden kurulu, repo adı değişince **kendiliğinden düzeldi**
  (`list_deployments` → `githubRepo: ocak`, deploy READY). Railway/MCP sağlam: damga
  `2c29952` → `50294e6` ilerledi. Skill yüklemesi **makineyle ölçülemez** — Kaan
  gözle teyit etti, ölçüm değil beyandır.

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

## B04 — `/acik-kapi` "sembolik ücret" ifadesi ✅ KAPANDI (19 Ağu, Kaan kararı)
- [x] **Karar: ifade KALIYOR.** KARAR 432'nin ("sembolik" de "yatırım" da denmez)
  `/acik-kapi` muafiyeti teyit edildi — yasak diğer format sayfaları için geçerli,
  Açık Kapı'nın ücretsizliğe komşu konumu istisnayı taşıyor. Sosyal tarafta **İ19
  caption'ı olduğu gibi geçerli**, düzeltme gerekmiyor. Tarama turu düştü.
- [x] **Sahip:** Claude.ai (metin) → Advaita/Kaan (Notion girişi)
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
- **Durum (19 Ağu 2026):** `…5226` hattında **"Ocak Kadın Çemberi" ONAYLANDI** (Kaan teyidi;
  Manager rozeti ayrıca okunmadı). Ad tartışması bu hat için **kapandı** — KARAR 519 gereği
  onaylı ad bırakılmaz. **Kalan iş yalnız `…0888` hattı:** ad başvurusu KARAR 521 ile
  "Ocak Kadın Topluluğu" (Plan B "Ocak Türkiye"). Ön koşullar: `/hakkimizda`'da YAP Eğitim
  Danışmanlık anılıyor olmalı + Business Portfolio website `https://www.ocak.biz`.
  Yayın kilidi ayrıca kalktı — KARAR 396 kapandı (`354fb14`), numara yayını B19'a bağlı değil.
- **Uygulandı (19 Ağu):** `…5226` profil açıklaması — *"Ateşin etrafında buluşuyoruz —
  seremoniler, atölyeler, yolculuklar. Soruları yapay zekâ asistanı yanıtlar."* (Kaan yazdı).
- **Tarihçe:** "Ocak Kadın Çemberi" ve "Ocak.biz" adaylarının ikisi de bir kez reddedilmişti
  (KARAR 410, SUPERSEDE →519); itiraz metni hazırlandı, gönderildiği teyit edilmedi. Düz
  "OCAK" hakkındaki iki beyan hâlâ çelişiyor — **B103**.

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

## B40 — "KIRPMA YASAĞI 61/88" konvansiyonu yanlış ✅ KAPANDI (11 Ağu, commit `b72c539`)

- ⚠ **Yeniden sınıflandı (11 Ağu, B47):** karar borcu değil, **mekanik yazım**.
  KARAR 482 kural 1(c): *konvansiyon, işaret ettiği kararla birlikte doğrulanır.*
  88'in ledger başlığı ve durumu bilinen bir ölçüm; sonuç ne çıkarsa mekanik olarak
  yazılır. Ayrı karar turu gerekmez.
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
- **Kapanış (11 Ağu, commit `b72c539`):** konvansiyon `KARAR 61`'e tekilleştirildi.
  **Ölçüm (Claude.ai, `2026-05.md:3742`):** KARAR 88 bir **dosya yapısı** kararıdır —
  master prompt'u `ocak-cekirdek.md` + `ocak-arsiv.md` diye ayırır — ve ikinci yarısı
  *"Tam Dosya Değişim Modu"*, gövdesinde açıkça *"KARAR 61'in patch protokolü iki dosyalı
  yapı için yetersiz kalıyordu"* diyerek patch modunun **yerine geçer**. Yani 88 KIRPMA'nın
  kardeşi değil **halefi**, ve kendisi `→145` ile SUPERSEDE; patch modu sonradan KARAR 462
  ile geri geldi. KIRPMA metni 61'e ait: `20-ref-protokoller.md:107`.
- **Kriter 28 → 26, sıfır değil ve olamaz** (KARAR 465). Canlı düzeltme **2 satır**
  (`00-durum.md` · `02-borclar.md`). Kalan 26 üç dokunulmaz kümede: `90-kronoloji/` 16
  (6 dosya) · `_uretilen/` 7 (3 dosya) · bu maddenin kendi gövdesi 3.
- ⚠ **Kronoloji banner'ları bilerek bırakıldı.** `2026-02.md:4` ve `2026-05.md:4`
  *"Append-only. KIRPMA YASAĞI (KARAR 61/88) — bu dosya düzenlenmez"* diyor. Tarihsel
  kayıt değil, dosya hakkında **canlı beyan** — düzeltmek cazipti. Append-only dosyaya
  "sadece banner'a" dokunmak emsal açar; kozmetik kazanç emsal riskini karşılamıyor
  (KARAR 482 kural 1b).
- ⚠ **Brief'in sayısı yanlıştı:** düzyazı "24 satır" dedi, kendi tablosu 28'e topluyordu,
  ölçüm de 28 verdi. Alt küme dağılımı da uydurmaydı (kronoloji 20 dedi, 16). CC ADIM 0'da
  yakaladı ve DURDU. → **KARAR 483**.

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
  - `grep -cF '- **Kaynak:...'` — `-` ile başlayan çapa dizesini **seçenek** sandı ve
    hata verdi. Ekranda uyarı göründü, "sapma" sanılabilirdi; `python3` ile tekrar
    ölçüldüğünde altı çapanın altısı da temiz çıktı. **Altıncı vaka, 9 Ağustos 2026 —
    ve bu sefer ölçen tarafın kendi aracında.** Doğru kullanım: `grep -cF -- 'dize'`
    ya da ölçümü python3'e almak.
- **Eylem:** `ocak-teshis`'in "Rapor biçimi" bölümüne bir **araç tuzakları** alt başlığı;
  her tuzağın yanına doğru aracı. B45 bu maddeye bağlanır ya da onunla birlikte kapanır.
- **Neden borç:** KARAR 470 rakamın yöntemiyle yazılmasını istiyor; yöntem yanlışsa
  rakam da yanlış ve **doğru rakam gibi görünüyor.**
- **Kaynak:** ADIM 5 · B44-a · B36-a turları, 8 Ağustos 2026.

## B47 — "ne nerede yaşar" haritası hiçbir dosyada yok ✅ KAPANDI (11 Ağu, commit `7f0396a`)

- [x] **Sahip:** Claude.ai
- **Sorun:** `docs/` yapısının kendisi — hangi dosya neyi taşır, bir soruya cevap
  ararken nereye bakılır — yazılı değil. `CLAUDE.md` CC'ye bakıyor, `00-durum.md`
  döneme, `03-sira.md` kuyruğa. Haritanın tamamı yalnız sohbet bağlamında yaşıyor.
- **Neden borç:** Sistem tam olarak bunu önlemek için kuruldu. Bağlamı olmayan bir
  sohbet `baglam.sh` çıktısını alır ama dosyaların **birbirine göre rolünü** bilmez.
- **Eylem:** `docs/05-harita.md` (ya da `CLAUDE.md`'ye bölüm) — dosya tablosu +
  "şu soruyu sorarsan şuraya bak" eşlemesi. Kısa tutulur, bakım maliyeti düşük olmalı.
- **Kaynak:** 8 Ağustos 2026, gün sonu.
- **Kapanış (11 Ağu, commit `7f0396a`):** `docs/05-harita.md` doğdu, 147 satır.
- ⚠ **Bu maddenin başlığı ölçümle yanlışlandı — düzeltme burada, gövdede değil (KARAR 61):**
  harita **hiçbir dosyada yok değildi, iki tane vardı.** `CLAUDE.md` sonundaki *Doküman
  haritası* paragrafı ve `00-durum.md` başındaki *Ne arıyorsan / Nereye bak* tablosu;
  ikisi de kısmi, ikisi de geçerli. Eksik olan **liste değil, otorite kuralıydı** —
  çelişkide hangi yüzeyin kazandığı hiçbir yerde yazılı değildi. B55 gövdesi bunu zaten
  teşhis etmişti (*"Tablo indeks, gövde otorite — ama bunu hiçbir yer yazmıyor"*);
  madde okunmadan yazılmış bir başlık üçüncü kez yanılttı.
- **Çözüm liste değil kural:** üçüncü bir liste kurulsaydı üçü ayrışırdı — B55'in
  hastalığının üçüncü nüshası. `05-harita.md` iki şey taşır: **otorite sırası**
  (ham gerçeklik → kronoloji → gövde → indeks → ayna) ve **dosya sözleşmeleri**
  (ne taşır · ne taşımaz · kim yazar · nasıl bozulur). Mevcut iki listeye dokunmaz,
  onlara işaret eder.
- **Mühürlenen:** KARAR 482 — indeks, indekslediği gövdeyi asla yenmez.
- **CC doğrulaması (commit öncesi):** dosyanın kendi kuralı 1(c) kendisine uygulandı.
  Atıf yapılan on kararın (61 · 102 · 455 · 456 · 457 · 458 · 468 · 470 · 471 · 479)
  onu da ledger'da tek kayıt ve **KALICI**; supersede/iptal yok. Üç nicel iddia da tuttu:
  `20-ref-*` yedi, `docs/skills/` altı, `00-durum.md` cap 200.

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

- ⚠ **Kapsam notu (9 Ağu, ADIM 7 birinci dalga) — B48 KAPANMAZ, düzeltmenin şekli
  değişti.** Manifest boşluğu duruyor. Ama MCP tasarımıyla birlikte `baglam.sh`'ın rolü
  değişti: küçülüp **soğuk-başlangıç kanalı** olarak yaşayacak, `İÇERMEZ` listesi profil
  listesinden değil **MCP envanterinden** anlam kazanacak. **B48 ADIM 7 ikinci
  dalgasından önce kapatılmaz** — kapatılırsa iş iki kez yapılır. Kapanışı B51'e bağlı.

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

## B50 ✅ KAPANDI (9 Ağu) — claude.ai skill yüzeyi hiç kurulmadı; `ocak-metin` bugün çağrılamıyor

- [ ] **Sahip:** Kaan · **Tetikleyici:** yok, ilk fırsatta — `ocak-metin` gerektiren
  her tur buna kilitli
- **Sorun:** KARAR 473 iki yüzey tanımlıyor: CC yüzeyi symlink (kendiliğinden çalışır),
  claude.ai yüzeyi **elle yüklenen zip**. Symlink ayağı 9 Ağustos'ta kanıtlandı — üç yeni
  skill commit anında CC yüzeyinde göründü; ADIM 5'in "skill yükleme kanıtlanmadı"
  maddesi böylece kapandı. **Zip ayağı hiç kurulmadı.** `ocak-lint`'in zip'i 8 Ağustos'tan
  beri bekliyor; ADIM 6 ile sayı **altıya** çıktı (`docs/_uretilen/skill-zip/`).
- ⚠ **En sivri sonuç:** `ocak-metin` **yalnız Claude.ai yüzeyinde** çalışan tek skill'dir
  (KARAR 458 kadro tablosu). Zip yüklenmediği sürece doğmuş ama **çağrılamaz** durumda.
  `ocak-lint` ve `ocak-kararci` iki yüzeyli oldukları için CC tarafında yaşıyor,
  Claude.ai tarafında yok — yani yargı katmanları erişilemez.
- **Neden borç, "yapılacak iş" değil:** kadro altıya tamamlandı diye kaydedildi; gerçek
  şu ki yarısı tek bacaklı duruyor. Bağlamı olmayan bir sohbet `ocak-metin`'i var sanıp
  çağırır ve bulamaz. Fark edilmiş ama kapatılmamış tutarsızlık — bu defterin tanımı.
- **Eylem:** `docs/_uretilen/skill-zip/*.zip` altı dosya claude.ai Skills'e elle yüklenir.
- **Kapanış kriteri:** altı skill'in altısı da claude.ai tarafında listeleniyor **ve**
  `skill-sync.sh --check` "ayrışma yok" diyor. ⚠ `--check` tek başına yeterli değildir:
  zip'in **üretilmiş** olduğunu denetler, **yüklenmiş** olduğunu değil. Yükleme repodan
  görünmez.
- **Kaynak:** ADIM 6 kapanış raporu (CC), 9 Ağustos 2026.
- **Sonuç (9 Ağu) — iki ayak da yeşil:**
  **(a)** Claude.ai yüzeyinde altı skill de listeleniyor; bugün doğan üçünün açıklama
  metni commit'lenen frontmatter ile birebir — yüklenen zip'ler güncel sürüm.
  Kanıtın cinsi **yüzey envanteri**, çağrı testi değil; CC tarafından üretilemez.
  **(b)** `docs/skills` 6 dizin · `skill-zip` 6 `.zip` · `--check` ayrışma yok.
  `ocak-metin` — kadronun tek Claude.ai-only skill'i — doğduğu günün akşamında
  erişilebilir oldu. 8 Ağustos'tan beri bekleyen `ocak-lint` yüzeyi de aynı yüklemeyle
  kapandı.
- ⚠ **Kapanış kalıcı değil, tazeliğe bağlıdır.** `docs/skills/` altında bir dosya
  değiştiğinde zip bayatlar ve claude.ai yüzeyi **sessizce** eskir — symlink yüzeyinde
  ayrışma yapısal olarak imkânsız, zip yüzeyinde yalnız *yakalanabilir*. `--check`
  yakalar; yeniden yükleme elle yapılır. **Skill dokunuşu içeren her turun son adımı
  `skill-sync.sh sync` + yüklemedir.** Nüks ayrı borç açmaz, bu bakım kuralına bağlanır.

## B51 — `baglam.sh` küçültme + soğuk başlangıç profili

- [ ] **Sahip:** CC · **Tetikleyici:** MCP birinci dalga oturunca
- **Sorun:** `baglam.sh dokuman` bugün altı dosyayı ve 1940 satırı panoya basıyor.
  MCP ayaktayken bu iş `docs_envanter()` + `docs_oku()` ile yapılabiliyor; script'in
  tamamını taşımak bağlamı iki kez yakıyor.
- **Eylem:** `dokuman` profili `00-durum.md` + `03-sira.md` + manifest'e iner. Manifest
  "gerisi MCP'de, şu araçlarla" der — yani script kapanmaz, **soğuk-başlangıç kanalına**
  dönüşür. MCP kapalıyken ya da bağlantı kurulmadan önce tek giriş yolu bu kalır.
- **Bağ:** **B48 bu maddeyle birlikte kapanır.** `İÇERMEZ` listesi profil listesinden
  değil MCP envanterinden türetilince B48'in sorunu tanım olarak ortadan kalkıyor.
- **Kaynak:** ADIM 7 birinci dalga, 9 Ağustos 2026. Yedek yol ölçüldü, varsayılmadı:
  MCP kapalıyken `baglam.sh dokuman` 1940 satır / 6 bölüm üretti, çıkış 0.

## B52 — skill verisinin MCP'ye taşınması ve `--check` boşluğu

- [ ] **Sahip:** Claude.ai (tasarım) → CC (uygulama) · **Tetikleyici:** birinci dalga
  oturunca
- **Sorun:** `ocak-lint`'in `yasak-dizeler.tsv`'si (başlık + 24 dize) ve
  `ocak-kararci`'nin ledger sorguları bugün **yalnız CC yüzeyinde** koşuyor. Claude.ai
  yüzeyinde o katmanlar okunuyor ama **çalıştırılamıyor** — skill metni kuralı anlatıyor,
  veriyi sorgulayamıyor.
- **Eylem:** MCP ikisini de canlı yapabilir; iki yüzey aynı veriye aynı yerden bakar.
- ⚠ **Boşluk 9 Ağustos'ta genişledi.** `docs_karar` doğdu ve `ocak-kararci`'nin ikizi
  oldu — ama skill bunu **bilmiyor.** `SKILL.md` hâlâ yalnız kabuk sorgularını tarif
  ediyor (`awk -F'\t' ...`); claude.ai yüzeyinde artık canlı bir araç var ve skill ondan
  söz etmiyor. Skill'e dokunmamak bu turda **bilinçliydi** — B52 "tasarlanmadan yapılmaz"
  diyor ve o tasarım hâlâ yapılmadı. Ama boşluk artık iki katmanlı: veri (`yasak-dizeler.tsv`)
  **ve** araç farkındalığı.
- ⚠ **Ama tasarlanmadan yapılmaz:** veri MCP'ye taşınırsa `skill-sync.sh --check` o
  veriyi **artık denetlemez.** B50'nin kapanış notu zip yüzeyinin sessiz eskimesini
  zaten kayda geçirdi; bu üçüncü bir katman ekler — symlink (ayrışma imkânsız) · zip
  (ayrışma yakalanabilir) · MCP (ayrışma **denetimsiz**). Kapsama boşluğu keşfedilmez,
  önceden tasarlanır.
- **Kaynak:** ADIM 7 birinci dalga, 9 Ağustos 2026.

## B53 — MCP yol-token ödünü

- [ ] **Sahip:** Kaan (beta erişimi) + CC (kaldırma) · **Tetikleyici:** claude.ai'de
  **Request headers** bölümü göründüğü gün
- **Sorun:** Token bugün **URL yolunda** taşınıyor (`/mcp/<token>`), çünkü claude.ai
  custom connector diyaloğu başlık kabul etmiyor. Ölçüm 9 Ağustos, ekran teyidi:
  diyalogda dört alan var — `Name` · `Remote MCP server URL` ·
  `OAuth Client ID (optional)` · `OAuth Client Secret (optional)`. **Request headers
  bölümü yok**; özellik Anthropic tarafında beta ve bu hesapta açık değil.
- **Neden ödün:** yol-token başlıktakinden **zayıftır** — URL'ler Railway erişim
  loglarına, tarayıcı geçmişine ve connector ayarına düşer. Başlık hiçbirine düşmez.
- **Neden yine de yapıldı:** alternatif authless açmaktı ve reddedildi. Sunucu 113
  dosya servis ediyor — strateji, fiyat kararları, lansman planı, `_arsiv` dahil.
  **Tahmin edilmesi zor bir URL, gizli bir URL değildir**; ama korumasız bir uç hiç
  gizli değildir.
- **Kapanış:** başlık yüzeyine geçilir, **yol ucu koddan kaldırılır**, connector
  yeniden yapılandırılır. Kaan Anthropic'ten erken erişim isteyebilir.
- ⚠ **Bu borç kendiliğinden kapanmaz ve kapanmadığı görünmez.** Beta bir gün sessizce
  açılır, kimse fark etmez, ödün kalıcılaşır. Bu yüzden `03-sira.md`'nin
  **DOKÜMAN DIŞI CEPHELER** tablosunda da görünür durur — orası kendi hattında yürüyen
  işlerin yeri ve bu tam olarak öyle bir iş.
- **Kaynak:** ADIM 7 ek brief (yol-token auth yüzeyi), 10 Ağustos 2026.

## B54 — servis edilemeyen dosyalar için envanter sebep söylemiyor ✅ KAPANDI (9 Ağu, ADIM 7 ikinci dalga)

- [ ] **Sahip:** CC · **Tetikleyici:** ADIM 7 ikinci dalga
- **Sorun:** MCP korpusu git deposundan servis edilir (KARAR 479). `.gitignore`'lu
  dosyalar container'da hiç yok — `docs_oku` onlara `bulunamadi` diyor. Cevap **doğru**
  ama **niçin** bulunamadığını söylemiyor.
- **Ölçüm (10 Ağustos, CC):** dokuz dosya bu sınıftaydı; `scripts/dump-fable.mjs`
  izlemeye alındı (`306a15b`), geriye **sekiz** kaldı — altı `skill-zip/*.parmak` +
  `notion-section-envanter.json` + `tasarim-notlari-dump.txt`. Sekizi de türetilmiş,
  izlemeye alınmaları doğru **değil**; sorun erişim değil **açıklama**.
- ⚠ **Neden borç:** sekizine de izlenen dosyalardan atıf var — `docs/02-borclar.md`,
  `docs/20-ref-site.md`, `scripts/skill-sync.sh` dahil. Korpusta adı geçen ama
  getirilemeyen bir dosya, sebebi söylenmezse **eksik olduğunu göstermeden eksik verir** —
  B45/B46/B48 ailesinin tanımı, bu sefer MCP yüzeyinde. Tasarım ilkesi (d) boşluğu.
- **Eylem:** `docs_envanter` cevabına sabit bir satır — *"Korpus git deposundan servis
  edilir; `.gitignore`'lu dosyalar burada yoktur."* Yeni yetenek gerekmiyor, tek dize.
- **Neden ayrı tur değil:** tek dize için deploy turu açılmaz; ikinci dalgada
  `docs_karar` ile aynı brief'te gider.
- **Kaynak:** ADIM 7 birinci dalga kapanışı, 9 Ağustos 2026.
- **Sonuç (9 Ağu, `824a39e`) — tek dize değil, iki alan.** Borç metni *"Korpus git
  deposundan servis edilir"* dizesini öneriyordu. Ölçüm bunu düşürdü: `korpusuTara()`
  **git'i sormuyor**, diski yürüyor (`readdirSync`). Railway'de ikisi denk çünkü
  container bir checkout; **yerelde denk değil.** O dizeyi tek başına yazmak kodun
  arkasında duramadığı bir iddia olurdu — tasarım ilkesi (b)'yi kırardı.
  Yazılan iki alan gerçeği ikiye ayırıyor:
  `kapsam_kurali` (kodun yaptığı: izinli kökler `docs` · `scripts` + tekil `CLAUDE.md`;
  `src/` · `dist/` · **`mcp/`** · `node_modules` dışarıda) ve
  `dagitim_notu` (ortamın getirdiği: dağıtım bir git checkout'u, `.gitignore`'lu dosyalar
  burada yok — KARAR 479; yerel kopya daha fazla dosya görür).
  Aynı `kapsam_kurali` `docs_oku`'nun **bulunamadi/reddedildi** dalına da eklendi —
  borcun problem cümlesi tam olarak orayı gösteriyordu.
  ⚠ **Yan bulgu:** `mcp/` `git ls-files`'da var ama korpusta yok. Üçüncü bir sınıf —
  *izlenen ama servis edilmeyen*. Bu tur boyunca sözleşme sunucunun kendi kodu görülmeden
  yazıldı. `kapsam_kurali` bunu artık söylüyor.

## B55 — `02-borclar.md`'nin sahip tablosu ile gövdeler ayrışmış ✅ KAPANDI (11 Ağu, commit `b72c539`)

- ⚠ **Yeniden sınıflandı (11 Ağu, B47):** "önce sözlük kararı" şartı **düştü**.
  KARAR 482 kural 1(a) cevabı veriyor: *indeks, indekslediği gövdeyi asla yenmez.*
  Tablo gövdelerden **türetilir**, ters yön hiçbir zaman yapılmaz. Geriye tek soru
  kalıyor ve o da mekanik: devir zinciri (`Claude.ai (metin) → Advaita/Kaan (Notion)`)
  tabloda **ilk halka** yazılır, gövde tam zinciri taşır.
- [ ] **Sahip:** Claude.ai (sözlük kararı) → CC (yazım)
- **Sorun:** Dosyada iki sahip kaynağı var ve tutmuyorlar. Satır 14'teki tablo
  bayat: kapanmış **B42 ✅**'yi açık sayıyor, **B36-a**'yı hâlâ yazıyor,
  **B46 · B47 · B48 · B51 · B52 · B53** hiç geçmiyor. Gövdelerdeki
  `**Sahip:**` satırları taze ama tek biçimde değil.
- **Ölçüm (10 Ağustos, kapanış patch'i ADIM 0):** açık küme **31/31** iki yönde de
  tuttu — **sorun kümede değil, sahip atamasında.** Gövde sayımı: Kaan 4
  (B14·B15·B18·B19) + B07 ayrı biçimde (`Kaan (n8n)`), CC 8, Claude.ai 9,
  altı melez sahip.
- ⚠ **Önce sözlük kararı, sonra yazım.** Devir zinciri (`Claude.ai (metin) →
  Advaita/Kaan (Notion)`, B31 · B49) tabloda tek sahip olarak mı görünecek,
  ilk halka mı yazılacak, yoksa yeni bir gösterim mi? Bu karar verilmeden tablo
  tazelenirse aynı ayrışma yeni biçimde doğar.
- **Neden borç:** iki kaynak da kendi içinde tutarlı; birlikte okunduğunda
  çelişiyorlar. Tablo indeks, gövde otorite — ama bunu hiçbir yer yazmıyor.
  **B47'nin ("ne nerede yaşar" haritası yok) ikinci vakası.**
- **Kapanış kriteri:** sözlük kararı yazılı **ve** tablo gövdelerden türetilmiş
  **ve** hangisinin otorite olduğu dosyada beyan edilmiş. `grep` sıfırı kriter değildir.
- **Kaynak:** ADIM 7 kapanış patch'i ADIM 0 raporu, 10 Ağustos 2026.
- **Kapanış (11 Ağu, commit `b72c539`):** tablo gövdelerden **yeniden türetildi**.
  Yön tek: gövde → tablo; ters yön hiçbir koşulda (KARAR 482 kural 1a). Tablo artık
  indeks olduğunu kendi altında **beyan ediyor** — kapanış kriterinin üçüncü ayağı buydu.
- **Türetme kuralları:** yalnız açık maddeler · alt maddeler girmez · devir zincirinin
  **ilk halkası** yazılır (tam zincir gövdede) · parantezli nitelemeler düşer ·
  iş değil ikilisi tabloya girmez.
- **Çıkan beş bayat kalem:** `B42 ✅` · `B37 ✅` (kapanmış) · `B36-a` · `B36-b` ·
  `B28-kalan ayak` (alt madde / kapanmış madde ayağı). **B19** vurgusu korundu.
- **Küme eşitliği doğrulandı:** `diff` boş, tablo 34 = açık madde 34.
- ⚠ **Brief'in aracı eksikti, kriteri değil.** Türetme awk'ı yalnız `- [ ] **Sahip:**`
  kalıbını arıyordu; **B38 ve B39** checkbox'sız `- **Sahip:**` biçimi kullanıyor ve
  düşüyorlardı. CC ADIM 0'da yakaladı. Küme eşitliği kriteri bunu zaten tutacaktı —
  **kriterin doğru olması aracın doğru olmasını garanti etmiyor.**
- ⚠ **Kurallarda karşılığı olmayan bir durum:** üç maddede **ortak sahiplik** var
  (B12 · B53 `Kaan+CC` · B60 `CC+Kaan`). Kural yalnız devir zincirini (`→`) kapsıyordu.
  CC ilk adı aldı ve raporladı; doğru karar: "tablo toplamı = açık madde sayısı" kriteri
  bir maddenin iki satırda görünmesini zaten yasaklıyor, ve "indeks giriş noktasını verir"
  ilkesi aynı yere çıkıyor. **Kural metni bunu söylemeliydi; söylemiyordu.**

## B56 — KARAR 478/479'un tarihi bir gün ileri ✅ KAPANDI (11 Ağu, commit `b72c539`)

- ⚠ **Yeniden sınıflandı (11 Ağu, B47):** "önce kural" şartı **düştü**. KARAR 482
  kural 1(b) cevabı veriyor: *türetilmiş dosya düzeltilir, append-only dosya not alır.*
  Yani `01-kararlar.tsv`'nin `tarih` hücreleri **düzeltilir**, `90-kronoloji/2026-08.md`
  blok başlığı **düzeltilmez, altına not düşülür**. İki dosyaya aynı işlem uygulanmaz.
  Geriye yalnız yazım kaldı.
- ⚠ **11 Ağustos'ta çakışma görünür oldu:** B01 gerçekten 10 Ağustos'a düştü, yani
  `03-sira.md`'de "kapandı 10 Ağu" yazan ADIM 7 birinci dalgası ile B01 aynı tarihi
  taşıyor — oysa aralarında bir gün var.
- [ ] **Sahip:** Claude.ai (karar) → CC (yazım)
- **Ölçüm (9 Ağustos 2026):** `date +%F` → `2026-08-09`. `git log --format='%ci' -10` →
  son on commitin **onu da** `2026-08-09` (13:01 → 21:25). Ledger'ın 478 ve 479 satırları
  `2026-08-10` diyor; `90-kronoloji/2026-08.md`'nin son blok başlıkları da "10 Ağustos".
- **Sınıflandırma:** saat/TZ hatası **değil** — commit damgalarının onu da aynı günde.
  **Yazım hatası**; o turun patch'i 10 Ağustos yazdı, ADIM 0 sorgulamadı, CC devraldı.
- ⚠ **Düzeltme kuralı iki dosyada AYRIŞIR ve karar verilmedi:**
  (a) `01-kararlar.tsv` **türetilmiş** dosyadır — "yanlışsa yeniden üretilir"
      (KARAR 456). Buradaki `tarih` bir indeks alanı; düzeltilebilir.
  (b) `90-kronoloji/2026-08.md` **append-only**'dir (KARAR 61). Blok başlığı o günün
      kaydıdır; düzeltme değil **not** ister — KIRPMA YASAĞI kapsamı.
  İkisine aynı işlemi uygulamak yanlış olur. **Önce kural, sonra yazım.**
- **Neden borç:** iki dosya aynı olayı iki farklı günle anıyor. Kırık değil — okuyan
  yanlış yere gitmiyor — ama `#k478`/`#k479` çapalarının hedefi tarih taşıyan bir başlık
  ve bir gün sonra ölçen bunu sapma sanar. B40 ailesinin kardeşi: konvansiyon yanlış
  yere işaret ediyor.
- **Kapanış kriteri:** kural yazılı **ve** iki dosyaya ayrı ayrı uygulanmış **ve**
  hangisinin düzeltildiği hangisinin not aldığı dosyada beyan edilmiş.
- **Kaynak:** ADIM 7 ikinci dalga ADIM 0, DUR-8 (9 Ağustos 2026).
- **Kapanış (11 Ağu, commit `b72c539`):** iki dosya **bilerek aynı işlemi görmedi**
  (KARAR 482 kural 1b). `01-kararlar.tsv` türetilmiştir → 478/479'un `tarih` alanı
  `2026-08-10` → `2026-08-09` **düzeltildi** (`NF!=6` 0, kalan `2026-08-10` satırı 0).
  `90-kronoloji/2026-08.md` append-only'dir → başlık **değişmedi**, `:1109`'a **şerh**
  düşüldü.
- **Şerh dosya sonuna değil, yanlış başlığın hemen altına kondu.** KARAR 61 silmeyi ve
  yeniden yazmayı yasaklar, **şerh düşmeyi değil**; 400 satır ötede duran bir not o bloğu
  okuyana hiç görünmez ve varlık sebebi ortadan kalkar.
- ⚠ **Kronolojide `## 10 Ağustos 2026` başlığı iki kez geçiyor** — `:1107` yanlış
  (9 Ağustos işi, şerhli) · `:1381` doğru (B01). Şerh ayrımı yazıyor.
- **Çapalar etkilenmedi:** `#k478`/`#k479` **karar satırlarına** çözülüyor (`:1158` · `:1209`),
  tarih başlığına değil.
- ⚠ **KALINTI — bilerek bırakıldı, dört satır.** `02-borclar.md`'de dört `10 Ağustos`
  referansı muhtemelen 9 Ağustos işine ait ama **iddia satırın kendi metninden
  görünmüyor**: B53'ün `Kaynak` satırı ("ADIM 7 ek brief" diyor, dalga demiyor) ·
  B54'ün `Ölçüm` satırı (tur adı yok) · B55'in `Ölçüm` ve `Kaynak` satırları
  ("kapanış patch'i" hangisi belirsiz). Şart "iddia satırdan görünsün"dü; görünmeyeni
  düzeltmek tahmin olurdu. Canlı `10 Ağu` toplamı 29 → 23.
  ⚠ Satır numaraları `b72c539` sonrası geçerlidir; bir sonraki yazımda kayar —
  bu kalıntıya dönülürse **içerikten** aranır, numaradan değil.
- ⚠ **Ölçüm zemini tur ortasında kaydı.** ADIM 0'daki satır numaraları ADIM 1–2'nin
  +5 satırıyla geçersizleşti; numaraya göre düzeltilseydi sekiz satırın hepsi yanlış
  yere yazılacaktı. CC ilk denemede fark etti ve içerikten yeniden ölçtü. Bu, KARAR 465'in
  akrabası ama aynısı değil: 465 *ölçen metin ölçtüğü dizeyi içerir* der, buradaki
  *ölçen işlem ölçtüğü zemini kaydırır*.

## B57 — connector araç listesi sessizce bayatlıyor

- [ ] **Sahip:** Kaan (bakım kuralı) · **Tetikleyici:** `mcp/`'ye her araç eklendiğinde
- **Ölçüm (9 Ağustos 2026, canlı):** `1d6726d` deploy edildikten sonra `docs_envanter`
  **yeni** cevabı döndürdü (damga `1d6726d`, `kapsam_kurali` ve `dagitim_notu` alanları
  geldi) — yani sunucu güncel. Ama `docs_karar` claude.ai araç listesinde **yoktu**;
  liste hâlâ üç araçtı. Connector kapatılıp açılınca dördüncü araç göründü.
- **Mekanizma:** claude.ai araç listesini bağlantı kurulurken alıyor ve sunucu değişse de
  kendiliğinden tazelemiyor. Veri tazeydi, **şema bayattı.**
- ⚠ **Neden borç:** ayrışma **hata vermiyor.** Araç "yok" ile "henüz görünmüyor" ayırt
  edilemiyor; CC'nin yerel testi dört anahtar döndürdüğü hâlde canlı yüzey üçünü
  gösteriyordu. B45/B46/B48/B54 ailesinin tanımı — *eksik olduğunu göstermeden eksik
  verir* — bu sefer connector yüzeyinde.
- **19 Ağustos eki — kapanmadı, cins buldu.** KARAR 513 (türev yüzey doktrini) bu maddeyi
  kapsıyor: connector araç listesi bir **türev yüzey**, sunucu şeması kaynak. Ama doktrin
  borcu kapatmaz — kapatan **tazelik kapısıdır**, ve bu yüzey için kurulmadı. B96 (skill
  zip) ve B97 (Railway checkout) kardeşleri. Kapanış koşulu değişmedi: araç listesi
  kullanılmadan önce sunucu damgasına karşı ölçülür, tutmuyorsa üretim durur.
- **B52 ile ilişki:** B52 üç katmanı sayıyordu (symlink · zip · MCP) ve MCP'yi
  *"ayrışma denetimsiz"* diye işaretlemişti. Bu, o denetimsizliğin **ilk somut vakası** —
  ama tahmin edilen yerde değil: veri katmanında değil **araç kaydı** katmanında.
- **Eylem:** yeni araç eklenen her turun son adımı connector'ın kapatılıp açılmasıdır.
  B50'nin *"skill dokunuşu = sync + yeniden yükleme"* bakım kuralının kardeşi; aynı yere
  yazılır. Otomatikleşmez — istemci yüzeyi repodan görünmez.
- **Kapanış kriteri:** bakım kuralı yazılı **ve** bir sonraki araç eklemesinde tatbik
  edilmiş. `grep` sıfırı kriter değildir.
- **Kaynak:** ADIM 7 ikinci dalga canlı doğrulaması (9 Ağustos 2026).

## B58 — Vercel `.vercel.app` domainleri proje adıyla yenilenmiyor ✅ KAPANDI (11 Ağu)
- [x] **Sahip:** Kaan
- **Tetikleyici:** B01 (10 Ağu) — proje adı `ocak-site` → `ocak` yapıldı
- **Ölçüm:** `get_project` (10 Ağu, B01 sonrası). `name: "ocak"` ✔ ama `domains`
  dizisi üç `ocak-site-*` kaydını koruyor: `ocak-site.vercel.app` ·
  `ocak-site-hlaorpz.vercel.app` · `ocak-site-git-main-hlaorpz.vercel.app`.
  Son deployment'ın `branchAlias` alanı da hâlâ `ocak-site-git-main-hlaorpz.vercel.app`.
- **Teşhis:** Vercel bu domainleri projeye **eklenmiş kayıt** olarak tutuyor, proje
  adından her seferinde türetmiyor. B01 briefi tersini varsaymıştı; ölçüm yanlışladı.
  Bu, **KARAR 389**'un ("slug bayatlar, ID kalır") ikinci teyidi — ve gösteriyor ki
  bayatlama yalnız slug'da değil, addan türeyen **her** kayıtta olabiliyor.
- **Etki:** pratikte yok. `www.ocak.biz` çalışıyor · deploy hook `tZR9LcwJq9` ID'ye
  bağlı · canlı `docs/` altında bu üç domaine bağımlılık **0** (ölçüm: `docs_ara`,
  kapsam `canli`; yalnız `90-kronoloji/2026-05.md`'de iki **tarihsel** kayıt var,
  onlar dokunulmaz). Kozmetik kalıntı.
- **Kapanış şartı:** panelden domain kayıtlarının yeniden adlandırılması, VEYA bu
  bayatlığın kabul edildiğinin yazılması. İkisi de meşru — karar verilmedi.
- **Kapanış (11 Ağu):** ikisi birden oldu. Kaan panelden `ocak-site.vercel.app`'i sildi ve
  `ocak-hlaorpz.vercel.app`'i ekledi. Kalan iki kayıt **sistem alias'ıydı** — panelde hiç
  görünmüyorlardı çünkü silinebilir kayıt değiller, deploy anında proje adı + dal + scope'tan
  türetiliyorlar.
- ⚠ **Teşhis yanlıştı, ölçüm düzeltti.** Gövde "Vercel bu domainleri eklenmiş kayıt olarak
  tutuyor, addan türetmiyor" diyordu. `c164ddd` push'unun deploy'u tersini gösterdi
  (`list_deployments`, 11 Ağu): `branchAlias` **`ocak-site-git-main-hlaorpz` →
  `ocak-git-main-hlaorpz`** olarak yeniden türedi. Deployment `name` `ocak-site` → `ocak`,
  `inspectorUrl` `/hlaorpz/ocak-site/…` → `/hlaorpz/ocak/…`. Alias donmamış, türüyor.
- ⚠ **`get_project` önbellekli cevap döndürdü** — Kaan'ın domain düzenlemesinden sonra bile
  eski dört domaini ve **değişmemiş `updatedAt`** verdi. O okuma delil sayılmadı; delil
  bir sonraki deploy'un meta'sı oldu. **KARAR 470 vakası: aracın taze olduğu da ölçülür.**
- **KARAR 389 ile ilişki:** gövdenin "389'un ikinci teyidi" iddiası da düştü. Slug bayatladı
  ama **kendiliğinden tazelendi** — 389 hâlâ doğru (*ID'ye yaslan*), ama bu vaka onun
  teyidi değil.

## B59 — `20-ref-site.md:78` iki bayat taşıyor, tarihli blok olduğu için düzeltilmedi
- [ ] **Sahip:** Claude.ai
- **Tetikleyici:** B01 ADIM 0.g ölçümü (10 Ağu)
- **İçerik:** `20-ref-site.md` satır 78, `**Mevcut durum (31 Mayıs 2026, #35 dönemi
  sonu):**` bloğunun içinde. İki bayat dize taşıyor: eski yol
  `~/Desktop/ocak-site-clone` ve eski repo sahibi `kso2025/ocak-site`.
- **Neden B01'de düzeltilmedi:** blok **tarihli anlık görüntüdür** — 31 Mayıs 2026
  itibarıyla doğruydu. KIRPMA YASAĞI (KARAR 61) tarihli kaydı bugünkü gerçeğe göre
  düzeltmeyi yasaklar. Aynı dosyanın **satır 14**'ü tarihsiz canlı referanstı ve
  düzeltildi; ayrım bilinçlidir.
- **Asıl soru bu maddede:** bir referans dosyasının içinde tarihli anlık görüntü
  yaşamalı mı? `20-ref-*` ailesi "şu an nasıl" dosyasıdır; tarihli blok kronolojiye
  aittir. Çözüm muhtemelen düzeltme değil **taşıma** — ama bu B32 sınıfı bir iştir,
  tek satırlık değil.
- **Kapsam uyarısı:** aynı desen `20-ref-*` ailesinin başka dosyalarında da olabilir;
  ölçülmedi.

## B60 — skill kaydı oturum başındaki mutlak yola bağlanıyor, dizin adı değişince kırılıyor
- [ ] **Sahip:** CC + Kaan
- **Tetikleyici:** B01 ADIM 3 (10 Ağu) — klasör yeniden adlandırıldı
- **Belirti:** Skill aracı oturum boyunca altı skill'in hiçbirini açamadı; kayıt
  `ocak-site-clone` yoluna bağlıydı. CC `SKILL.md`'leri diskten okuyup protokolü
  elle izledi — iş yapıldı, ama denetim yüzeyi düştü.
- **Kendiliğinden düzelir:** yeni oturum yeni yolu bağlar. Kalıcı hasar yok.
- **Neden yine de borç:** `skill-sync.sh --check` bu kırılmayı **göremez** —
  symlink'i ve zip'i denetler, oturumun bağladığı yolu değil. B50'nin bilinen
  ölçülemezliğinin üçüncü yüzeyi (birincisi claude.ai yüklemesi, ikincisi
  bayatlık, üçüncüsü bu). Ayrıca dizin yeniden adlandırma bir daha olursa aynı
  şey tekrarlanır ve kimse beklemiyor olur.
- **Kapanış şartı:** ya CLAUDE.md'ye "dizin adı değişen turda CC yeniden başlatılır"
  satırı, ya da kırılmanın kabul edildiğinin yazılması.

## B61 — `Anadolu Yolculuğu` ölü dizeleri depoda duruyor, sapma sıfır
- [ ] **Sahip:** CC
- **Tetikleyici:** cc-brief-v2 KARAR 1 (18 Ağu) — Kaan Notion `Format` select'inden
  `Anadolu Yolculuğu` seçeneğini **sildi** (rename değil). Formatlar `/bulusmalar`
  adlarıyla aynı küme; orada zaten `Yolculuk` yazıyor.
- **Ölçüldü, acil değil:** Notion `Format` canlı option'ları **7**, dump script'inin
  `EXPECTED` listesiyle **birebir** — iki yönde de sapma yok. 28 kaydın hiçbirinde
  `Format` boş değil (select option'ı silinince sessiz boşalma olabilirdi, olmamış);
  kayıtta olup option'da olmayan yetim değer de yok. `Yolculuk` zaten `EXPECTED`'te.
  **Build sonrası sapma uyarısı sıfır** — ölçüt kod değişmeden karşılanıyor.
- **Kalan iş:** `Anadolu Yolculuğu` dizesi depoda **22 satır / 13 dosya**
  (`grep -rn` · `src/` + `scripts/` · `*.ts,*.astro,*.mjs,*.css,*.json`).
  `anadolu-yolculugu` → **0 satır**.
- **Neden tek satırlık değil — temizlik zincirli:** `FORMAT_KATEGORI` (`etkinlik-kategori.ts:25`)
  satırını düşürmek `EtkinlikKategori` tipindeki `'anadolu'` ayağını da düşürür;
  ona bağlı dört yüzey daha var — `SLUG_KATEGORI['/anadolu']` (`:135`),
  `KATEGORI_SIRA` (`:70`), `KATEGORI_HEADING.anadolu` (`:154`), `BULUSMALAR_DISI`
  (`bulusmalar.astro:51`) — artı bir test kırılır
  (`etkinlik-kategori.test.ts:108`, `slugToFormatHam('anadolu')`).
- **Dokunulmayacaklar (ayrım bilinçli):** sayfa metinleri kullanıcıya görünen başlıktır
  (`AnadoluHarita.astro:89` · `AnadoluBasvuru.astro:269` · `anadolu/basvuru.astro:10`);
  yorumlar tarihsel anlatımdır (`config.ts:220` · `remark-ocak-sections.ts:147,804` ·
  `etkinlik-kategori.ts:59,160` · `bulusmalar.astro:48` · `yolculuk/kayit.astro:4` ·
  `kayit.test.ts:24`). `notion-section-envanter.json:34` script çıktısı, ilgisiz.
- **Temiz olan:** `FORMAT_NOTION_FORMAT` / `KayitFormat` (`kayit.ts:35`) bu değeri
  **hiç içermedi** — kayıt route'ları baştan ayrıktı (`/anadolu/basvuru`).
- **Kapanış şartı:** beş yüzey + test tek commit'te birlikte taşınır.
- **BİLİNÇLİ OLARAK AÇIK BIRAKILDI** — Kaan kararı, 18 Ağustos 2026 (cc-brief-v2
  kapanışı). Unutulmuş borç değildir: sapma sıfır olduğu için bugün hiçbir şeyi
  bozmuyor, temizlik ise zincirli ve **ayrı commit hak ediyor**. Bu turda
  açılmadı çünkü ritim işiyle aynı commit'e girmesi mekanik dönüşüm ile semantik
  işi karıştırırdı (KARAR 61 / commit disiplini).

## B62 — `katilimTipiCoz` bilinmeyen mekânda online'a düşüyor, adres alanları sessizce boş gidiyor
- [ ] **Sahip:** CC
- **Tetikleyici:** brief-mailerlite-odeme-kapisi (18 Ağu), madde 2-iv —
  kapsam dışı bırakıldı, borç olarak açılması istendi.
- **Belirti:** `kayit.ts:215` — `if (!mekan || mekan === 'Online') return 'link';`
  Notion `Mekân/Platform` boşsa **ya da tanınmayan bir değerse** katılım tipi
  `link` olur. Fiziksel bir etkinlikte o alan boş kalırsa MailerLite'a
  `etkinlik_mekan` ve `etkinlik_adres` **boş** gider; kadın nereye geleceğini
  mailden öğrenemez. Hata sessizdir — log yok, uyarı yok.
- **Neden default böyle:** yorumda yazılı — lansman etkinlikleri 6/6 Online'dı,
  defansif fallback bilinçli olarak online tarafa kondu. O gün doğruydu;
  fiziksel etkinlik (Şehir Akşamı, yüz yüze kakao) sayısı arttıkça varsayım
  ters yöne çalışmaya başladı.
- **Bugün neden yakmıyor:** ölçüldü (18 Ağu) — canlı kayıtların hepsinde
  `Mekân/Platform` dolu. Risk gerçek ama tetiklenmemiş.
- **Kapanış şartı:** ya bilinmeyen değer için `console.warn` + fiziksel varsayım,
  ya da `Mekân/Platform` boş kaydın kayıt akışına hiç girmemesi (loader guard).
  Karar verilmeden dokunulmaz — `mekanTipi` (`etkinlik-kategori.ts:88`) zaten
  bilinmeyen değerde `warn` basıyor, iki yüzey aynı desene çekilebilir.

## B63 — `forms-backend.ts` boş-alan filtresi duruyor, `/api/kayit`'teki kaldırıldı
- [ ] **Sahip:** CC
- **Tetikleyici:** Y1 düzeltmesi (`92e580e`, 19 Ağu). Aynı filtre iki dosyadaydı;
  biri düzeltildi, öteki **ölçülüp bilinçli bırakıldı** — brief'in kendi kuralı
  ("ayrım gerekiyorsa yalnız `kayit.ts`'i değiştir, ötekini borç olarak bırak").
- **Kalan satır:** `src/lib/forms-backend.ts:43` — `if (v && v.trim()) fields[k] = v;`
- **Neden dokunulmadı — üç ölçülmüş fark:**
  (a) **`name` konumu.** `/api/kayit`'te `name` döngünün **dışında** atanıyordu
  (`{ name: args.ad }`), filtreye hiç girmiyordu. `forms-backend`'de `name`
  `args.fields`'in **içinden** geçiyor (`fields: { name: ad, phone: telefon }`) —
  filtreyi kaldırmak isim boşken `name: ""` göndermek olurdu, mail "Merhaba ,"
  diye açılır.
  (b) **Tip.** `Record<string, string | undefined>` (öteki `Record<string, string>`) —
  `phone` undefined gelebiliyor, boş-geçiş kararı ayrı düşünmeyi gerektirir.
  (c) **Amaç.** O yüzeyin akışları (`/api/form`: `ates-mektuplari` ·
  `anadolu-basvuru`) **etkinlik alanı taşımıyor**; bayatlama sorunu orada yok.
  `ates-mektuplari` zaten hiç `fields` göndermiyor.
- **Bugün neden yakmıyor:** taşınan alan `name` + `phone`; ikisi de kalıcı
  subscriber alanı ama kayıttan kayda değişmiyor. Y1'in canlı vakası (etkinlik
  alanının önceki kayıttan kalması) bu yüzeyde üretilemiyor.
- **Kapanış şartı:** `name` muafiyeti korunarak filtre kaldırılır — ya çağrı
  yerinde `name` `fields`'ten çıkarılıp ayrı parametreye alınır, ya
  `mailerLiteFieldsPayload` (`lib/kayit.ts`) bu yüzeyde de kullanılır. İkincisi
  tercih edilirse `string | undefined` tipi de tek yerde çözülür.
- **Gerekçenin tam hâli:** `20-ref-bot.md`, alan envanteri bölümü — Y1 notunun
  sonundaki "Aynı filtre `forms-backend.ts:43`'te DURUYOR — bilinçli" paragrafı.

## B64 — Deploy hook URL geçişi; yeni hook oluşturuldu ama kimse çağırmıyor
- [ ] **Sahip:** Kaan
- **Tetikleyici:** KARAR 485. Eski hook `tZR9LcwJq9` (`notion-content-update`)
  `astro-iskelet` dalına bakıyor — ölü dal, `main`'den 85 commit geride.
- **Belirti:** Her Notion güncellemesi ve gecelik cron (`0 0 0 * * *`) oradan build
  alıyor; üretilen build preview olarak doğuyor, içerik siteye düşmüyor. İçerik
  yayınlamak için her seferinde elle boş commit atmak gerekiyor (`cf38cc4` örneği).
- **Yapılan:** yeni hook `notion-content-update-main` (branch `main`) **oluşturuldu**.
  Çağıran yok — eski URL n8n'de ve/veya Notion webhook'unda duruyor.
- **Kapanış şartı:** yeni URL çağıran her yere yazılır · Notion'da bir düzenlemeyle
  tetiklenir · üretilen build'in `githubCommitRef: main` **ve** `target: production`
  olduğu doğrulanır · eski hook Revoke edilir.

## B65 — `ocak-etkinlik.zip` yeniden yüklemesi
- [ ] **Sahip:** Kaan
- **Tetikleyici:** B50'nin (✅ 9 Ağu) devamı — önceki yükleme `ornekler-cember.md`
  henüz yokken yapıldı, claude.ai yüzeyindeki skill tek bekçili kaldı.
- **Kapanış şartı:** zip'te üç dosya doğrulanır (`unzip -l` — `SKILL.md` ·
  `ornekler.md` · `ornekler-cember.md`), claude.ai skill yüzeyine yüklenir.

## B66 — Seremoni bekçisi yok; iki nokta eğri vermiyor
- [ ] **Sahip:** Claude.ai
- **Ölçüm:** iki seremoni sayfası yazıldı — kakao **5.197 kr** · `hasat-ve-sukran`
  **4.254 kr**. Bant **943 kr**; Açık Kapı (3.019–3.247, bant 228) ve Çember
  (3.824–4.113, bant 289) yanında dağınık.
- **Belirti:** `ne-olur` her seremonide baştan yazılıyor — sabit blok çıkmıyor.
  İki nokta bir eğri tanımlamaz; bekçi damıtmak için üçüncü sayfa gerekiyor.
- **Kapanış şartı:** üçüncü seremoni sayfası yazılınca `ornekler-seremoni.md` damıtılır.
- ✅ **Koşul doldu (23 Ağu) — borç kapanmadı, beklediği şey geldi.** Üçüncü Seremoni
  gövdesi var: `kakao-seremonisi-online` · `kakao-seremonisi-yuzyuze` · `hasat-ve-sukran`.
  ⚠ Bu maddedeki üç bant da bayat — Seremoni `3.605–3.686`, Açık Kapı `3.036–3.264`,
  Çember `3.480–3.771` (**B144** · **B145** · **B88**). Damıtma **B88**'de yürür.

## B67 — `ornekler-cember.md:41` ölçü birimi tutarsızlığı + KAYIT SORULARI mührü
- [ ] **Sahip:** Claude.ai
- **(a)** Satır "yedi paragraflı" diyor, doğrusu **"sekiz paragraflı"**. Kök sebep
  ölçü birimi karışması: Çember için **toplam** paragraf, Açık Kapı için **sabit**
  paragraf sayısı kullanılmıştı — iki bekçi aynı kelimeyi farklı şey için kullandı.
- **(b)** KAYIT SORULARI mühründeki `4/6` ifadesi ölçülen hâline çekilmişti —
  **teyit edilmedi**, edilecek.
- **Kapanış şartı:** tek commit, `ornekler-cember.md` dışına çıkmaz.

## B68 — `pratik-bilgi` ilk satırı ücretli formatlarda yalan söylüyor
- [ ] **Sahip:** Claude.ai → Notion
- **Belirti:** dört Çember + iki Seremoni sayfasında *"kaydını yaptığında bağlantı
  e-postana gelir"* yazıyor. Havale/EFT'ye dönüldüğü için **yanlış**: bağlantı ödeme
  ulaştığında gidiyor (KARAR 486, ödeme kapısı). Doğrusu *"katılım payın ulaştığında
  bağlantı e-postana gelir"*.
- **Kapsam dışı:** Açık Kapı ücretsiz — o altı sayfaya dokunulmaz.
- **Kapanış şartı:** altı Notion kaydı düzeltilir + bekçi dosyalarına **ücretli /
  ücretsiz varyant ayrımı** girer (yoksa sonraki sayfa aynı yalanı üretir).

## B69 — MailerLite şablon değişkenleri düz metin basıyor
- [ ] **Sahip:** Kaan
- **Belirti:** subject satırı `{$etkinlik_baslıgı}` diye **literal** basıyor — elle
  yazılmış, Insert personalization ile konmamış. (Ayrıca değişken adı da yanlış:
  gerçek alan `etkinlik_basligi`, Türkçe karakterli değil.) Gövde değişkenleri
  denetlenmedi. Footer İngilizce.
- **Kapanış şartı:** üç mailde subject + gövde + footer düzeltilir, test maili
  **Gmail koyu tema** ve **Outlook**'ta görülür.

## B70 — `/seremoni` SSS'inde kayıt çelişkisi
- [ ] **Sahip:** Claude.ai → Notion
- **Belirti:** soru *"Kayıt yapılıyor mu?"* → cevap *"Hayır"*. Cevap ses/video
  kaydını anlatıyor ama soru **katılım kaydı** gibi okunuyor; `/seremoni/kayit`
  rotası mevcut ve kayıt alıyor.
- **Kapanış şartı:** Notion nokta patch — soru *"Seremoni kaydediliyor mu?"* olur,
  cevaba *"(Katılım kaydı ayrı.)"* eklenir.

## B71 — `/cember` render kalıntıları (Notion işaretlemesi sızmış)
- [ ] **Sahip:** Claude.ai → Notion
- **Belirti:** üç dize yanlış etikete düşüyor —
  `"Bu ateş OCAK'ın ateşi."` → `<code>` ·
  `"Ateş sönmüyor, içimize taşınıyor."` ve
  `"ateşin en sıcak, en dayanıklı çekirdeği"` → `<del>`.
- **Kapanış şartı:** üçü de gövde metni olur (KARAR 118 yazım disiplini).

## B72 — Test verisi temizliği
- [ ] **Sahip:** Kaan
- **Ölçüm:** Notion Kayıtlar DB'sinde **on bir** test kaydı, MailerLite'ta **beş**
  test abonesi.
- **Kapanış şartı:** Eylül'de gerçek kayıt gelmeden temizlenir. Erken temizlik
  Y1/kapı doğrulamalarının zeminini siler — sıralama önemli.

## B73 — `pre-merge-kayit-penceresi` tag'i push edilmedi
- [ ] **Sahip:** Kaan
- **Belirti:** yerelde duruyor, remote'ta yok. `git push --tags` yerine tek tag
  push edildiği için kaldı (19 Ağu, `kurtarma-2026-08-19` gönderilirken bilinçli).
- **Kapanış şartı:** gönderilecek mi karar verilir; gönderilmeyecekse yerelden
  silinir ve sebebi buraya yazılır.

## B74 — iPhone Safari eyeball borcu (on bir commit birikti)
- [ ] **Sahip:** Kaan
- **Tetikleyici:** CLAUDE.md madde 9 / KARAR 388 — merge öncesi gerçek cihaz
  eyeball'ı otomatikleşmez. Ölçüldü: `02-borclar.md`'de böyle bir kayıt **yoktu**
  (B11 Safari **hero glow banding**, ayrı iş), bu yüzden açıldı.
- **Belirti:** `/etkinlik/[slug]` mobil ritmi (`≤768px` bloğu) **hiçbir gerçek
  cihazda görülmedi**. Ritim CSS'i "promote yok, eyeball Kaan'da" diye bekletilirken
  push production'a çıktı; adım atlandı.
- **Kapanış şartı:** gerçek iPhone Safari'de `/etkinlik/[slug]` + bir kayıt sayfası
  görülür. Test yeşili ≠ göz temiz.
- **19 Ağu, WA buton turu — B74'e KATKI YOK.** O turun telefon eyeball'ı
  (Kaan) yüzen buton fade'ini, `≤480px` yerleşimini ve iOS Safari'yi kapsadı;
  **`/etkinlik/[slug]` mobil ritmi bu turda da görülmedi.** B74'ün açık ayağı
  aynen duruyor — başka bir sayfada yapılan eyeball bu borcu kapatmaz.
- **KISMİ KAPANIŞ (19 Ağu, `9036791` üzerinde):** iki ayağın **biri** tamam.
  - ✅ **Kayıt sayfası ayağı** — hatalı zorunlu alan nav'ın altında kalmıyor
    (`Şehir` · `Telefon` · `E-posta`), success bloğu regresyonsuz, Alıcı
    unvanında `A.Ş.` bütün. Kaan gerçek cihazda gördü.
  - ⬜ **`/etkinlik/[slug]` mobil ritim ayağı — HÂLÂ AÇIK.** `≤768px` bloğu hiçbir
    gerçek cihazda görülmedi; borcun **doğuş sebebi** buydu.
- **⚠ Şart daraltılmadı, bilinçli (Kaan kararı).** Kapanış şartını kayıt
  sayfasına indirmek borcu kapatmaz, **kaydını siler** — ritim CSS'i yine
  görülmemiş olurdu. Madde bu yüzden damgasız duruyor ve **açık sayılmaya devam
  ediyor**; sayaçta kapanan olarak görünmez.

## B75 — Soyad + zorunlu Şehir öncesi kayıtlarda alanlar eksik
- [ ] **Sahip:** Kaan
- **Tetikleyici:** Faz 1 §2 + ek brief (`9fca383`, 19 Ağu) — `Soyad` alanı forma
  eklendi, `Şehir` opsiyonelden zorunluya geçti. **Migration yok** (bilinçli).
- **Belirti:** bu commit'ten önceki kayıtlarda Notion `Kadın` yalnız **ad** taşıyor,
  `Şehir` boş olabilir. MailerLite tarafında `last_name` hiç yazılmamış. Fatura
  kesilecek kadın eski bir kayıttaysa alıcı adı ve konum bilgisi eksik çıkar.
- **Neden migration yapılmadı:** fatura kesilecek kadınlar yeni kayıtlar olacak;
  eski satırlar için toplu doldurulacak veri yok — soyad kimsede kayıtlı değil.
- **Kapanış şartı:** eski bir kayda fatura kesilecekse o satırın `Kadın` ve `Şehir`
  alanları elle tamamlanır. `kadinAdiBirlestir` tek parçalı girdide de doğru
  çalışıyor (testli), elle düzeltme yolunda çağrılabilir.

## B76 — MailerLite `last_name` konumu canlı teyit edilmedi ✅ KAPANDI
- [x] **Sahip:** CC + Kaan · **Kapandı:** 19 Ağustos 2026, `62d4e80` canlıyken
- **Tetikleyici:** Faz 1 §2 (`9fca383`) — `last_name` `fields` içine, `name` ile
  aynı seviyeye yazıldı (KARAR D5). **Bu konum repodan ölçülemiyor.**
- **Belirti:** repo yalnız `name`'in `fields` içinde gittiğini kanıtlıyor
  (`api/kayit.ts` fetch gövdesi: `{ email, fields, groups }`). `last_name`'in
  kardeş ön-tanımlı alan olarak aynı yere düştüğü **MailerLite API bilgisi**,
  ölçüm değil. Yanlışsa alan sessizce yutulur — MailerLite tanımsız alanı hata
  vermeden düşürür, yani kayıt başarılı görünürken soyad hiç yazılmamış olur.
- **Sınıf:** Y1'in "MailerLite'a gerçek POST atılmadı" borcuyla aynı — `dist/`
  seviyesinde ölçüldü, canlı abonede görülmedi.
- **Kapanış şartı:** push sonrası test aboneyle kayıt olunur, MailerLite panelinde
  abonenin **Last name** alanı dolu görülür. Boşsa konum yanlış demektir ve
  payload düzeltilir.
- **Kapanış ölçümü (19 Ağu, `62d4e80` canlıyken):** `www.ocak.biz/acik-kapi/kayit`
  üzerinden gerçek kayıt atıldı (damgalı adres `kaan+b76-1787129984070@yap.com.tr`,
  abone id `196220217536283724`, referans `OCAK-CYUD`). MailerLite'tan okunan
  ham değerler:

  ```
  name      = 'B76Test'
  last_name = 'Soyadteyit1787129984070'
  ```

  **`last_name` DOLU** — konum doğru, `fields` içi. Aynı okuma D8'i de doğruladı:
  `city = None`, yani şehir MailerLite'a gitmiyor (envanter on ikide).
- **Yan kazanım — artık ölçülmüş bir gerçek:** MailerLite'ın ön-tanımlı alanlarının
  **hepsi** `fields` içinde yaşıyor. Abone yanıtında görülenler: `name` ·
  `last_name` · `city` · `company` · `country` · `phone` · `state` · `z_i_p`.
  Bu, D5 kararının dayandığı çıkarımı artık çıkarım olmaktan çıkarıyor —
  ileride ön-tanımlı bir alan daha eklenecekse yeri tartışmalı değil.

## B77 — Notion'da Slug'sız etkinlik yayına girebiliyor
- [ ] **Sahip:** Kaan (veri disiplini)
- **Tetikleyici:** Y1 canlı vakası (`92e580e`, 19 Ağu) — Slug'ı boş "Konuk Ateşi"
  kaydında `etkinlik_url` üretilemedi. `etkinlikUrlFormatla` boş slug'da **bilerek**
  boş string döner (kırık taban URL `.../etkinlik/` üretmemek için), yani kod doğru
  davranıyor; eksik olan **veri**.
- **Belirti:** yayına giren bir etkinliğin Slug'ı boşsa detay sayfası doğmaz
  (`getStaticPaths` onu atlar) ve maile giden `etkinlik_url` boş gider. Kadın
  buluşmanın adını görür, sayfasını göremez.
- **Bu bir kod işi DEĞİL.** Kapı koymak (Slug boşken kaydı reddetmek) kadını
  Notion'daki bir eksiklik yüzünden cezalandırmak olurdu.
- **Kapanış şartı:** `siteGoster=true` olan her etkinlikte `Slug` dolu — Notion
  tarafında alışkanlık ya da template zorunluluğu. Ölçüm: yayın açık etkinliklerde
  boş Slug sayısı 0.

## B78 — Vercel env değişkenlerinin hepsi Non-sensitive
- [ ] **Sahip:** Kaan
- **Belirti:** 17 değişkenin **17'si** Non-sensitive olarak tanımlı — aralarında
  `NOTION_TOKEN` · `MAILERLITE_API_KEY` · `ZOOM_CLIENT_SECRET` ·
  `ZOOM_WEBHOOK_SECRET` · `RESEND_API_KEY` var. Non-sensitive değerler Vercel
  arayüzünde ve API'de **okunabilir** kalır.
- **Neden şimdi görünür oldu:** Faz 1'de `MAILERLITE_API_KEY` canlı teyit için
  okundu (B76). Anahtar hiçbir dokümana yazılmadı (CLAUDE.md §8) ama okunabilir
  olması başlı başına bir yüzey.
- **Bu bir sızıntı kaydı DEĞİL** — sır dokümana girmedi, commit'e girmedi.
  Yapılandırma sıkılaştırması.
- **Kapanış şartı:** yukarıdaki beş anahtar (ve varsa öteki sırlar) Vercel'de
  **Sensitive** işaretlenir. ⚠ Sensitive'e çevirmek değeri **yeniden girmeyi**
  gerektirir ve üç ortamda da (Production · Preview · Development) yapılmalı;
  atlanan ortam sessizce boş kalır ve o ortamdaki akış çalışmayı durdurur.

## B79 — Faz 2 eşleştirme regex'i ÜÇ referans formatını tanımalı
- [ ] **Sahip:** CC (Faz 2 turunda)
- **Tetikleyici:** KARAR 489 — referans kodu `OCAK-XXXX`'e geçti, **migration yok**.
- **Belirti:** Notion `Kayıtlar`'da üç format yan yana yaşıyor:
  `OCAK-XXXXX` (5 hane rakam, Brief 6) · `OCAK-XXXXXX` (6 hane rakam, 2026-06-14) ·
  `OCAK-XXXX` (4 karakter alfanümerik, Faz 1). Banka açıklamasından kod ayıklayacak
  regex üçünü de tanımak zorunda.
- **Tuzak:** **uzunluğa göre ayrıştırma yapılmamalı.** `OCAK-` sonrası 4/5/6
  karakter olabilir ve son çare kodu **5 karakter alfanümerik** — yani uzunluk tek
  başına formatı belirlemiyor.
- **Bağ:** `KARAR 489`. Tip tarafı zaten hazır: `lib/api.ts` `referansNo` serbest
  `string`, uzunluk varsayımı taşımıyor (Faz 1'de not düşüldü).
- **Kapanış şartı:** Faz 2 eşleştirme regex'i üç formatı da yakalıyor, testte
  üçü de örneklenmiş.

## B80 — `/adimiz` "közüyle taşınır" — kamu metnindeki tek "köz" ✅ KAPANDI (24 Ağu, KARAR 86 uygulandı)
- [x] **Kapanış:** cümle *"kor alınır, taşınır"* oldu. Canlı ölçüm (24 Ağu, `www.ocak.biz/adimiz`):
  `közüyle` **0** · `kor alınır` **1**. Kapanış şartı birebir tuttu.
- ⚠ **Üç ay geride kalmıştı.** KARAR 86 Mayıs'ta mühürlenmişti; sosyal kart tarafı zaten
  temizdi (C10 "kor"), **site cümlesi denetim satırı almadığı için hayatta kaldı.**
  **KARAR 563 tam bu vakadan doğdu** — mühür ile denetim satırı aynı anda yazılır.
- [ ] ~~**Sahip:** Kaan (Notion) · ~2 dk~~
- **Tetikleyici:** 19 Ağustos dumpı (49 route, `3683ca4`). Site geneli tarandı;
  **"köz" yalnız `/adimiz`'da geçiyor.** `/hikaye` temiz çıktı (aşağıda).
- **İhlal:** KARAR 86 (köz site dilinde yok) + KARAR 453 (yasağın sosyal yüzeye
  genişlemesi). Kart tarafı zaten temiz — C10 "kor" diyor.
- **Tuzak:** düzeltme **cümle görülerek** yapılır, kör find-replace ile değil;
  "köz" bazı bağlamlarda renk adı olarak meşru (KARAR 453).
- **Kapanış şartı:** Notion'da cümle düzeltilir, sonraki dumpta `/adimiz` bloğunda
  "köz" 0 geçiş.

## B81 — `/etkinlik/yolculuk-acilis` gövdesi boş

- ⚠ **KÖK SEBEP BULUNDU (24 Ağu):** `Detay` property'si **NULL**, `Yayınla` **✓**.
  Yani sayfa bilerek yayında ve **gövdesiz render ediliyor.** Ölçüm eksikliği değil,
  veri eksikliği. ⚠ `00-durum.md`'nin *"15 yayında etkinlik — tarihli/saatli/**gövdeli**"*
  iddiası bu yüzden **yanlış**; on dördü gövdeli, biri değil.
- [ ] **Sahip:** Kaan (Notion)
- **Ölçüm:** dumpta **3 section · 47 kelime**; canlı `<main>` düz metni 156 karakter.
  Oran `C_dump/C_html = 1.85` — yani **araç kaybı değil**, sayfada içerik yok.
  Diğer 14 etkinlik sayfası 488–795 kelime taşıyor.
- **Ağırlık:** bugün karara bağlanan **AÇILIŞ 24–27 Eylül** (KARAR 492) sitede
  içeriksiz duruyor. Sosyal v2.1'in C11/C20 kartları bu sayfaya bakıyor.
- **Kapanış şartı:** Notion `detay` alanı section marker'larıyla yazılır, redeploy
  sonrası dumpta ≥400 kelime.

## B82 — `scripts/dump-fable.mjs` extractor düzeltmesi
- [ ] **Sahip:** CC (tek commit)
- **Belirti:** `walkTopLevelBlocks` yalnız `kids(main)`'e bakıyor — `main` altında
  derinlik 1'deki `[data-section]` düğümleri **sessizce düşüyor.** Etkinlik
  şablonunda dokuz section `div.ocak-container` içinde.
- **Kanıt:** 1. tur dumpı 15 etkinlik sayfası için ≈520 kelime verdi; düzeltilmiş
  kopya **8.554** verdi. Hata verilmedi, HTTP 200 alındı, dosya yazıldı.
- **Hazır:** çalışan diff CC'nin 2. tur teslim raporunda (`descend()` özyinelemesi +
  iç içe düğüm koruması). **ROUTES hunk'ı dahil edilmez** — o tarihe bağlı.
- **Not:** `walkTopLevelBlocks` adı düzeltmeden sonra yanlış; yeniden adlandırma
  isteğe bağlı, ayrı dokunuş.
- **Bağ:** KARAR 495.

## B83 — K2: sosyal ana sahne kararı verilmedi
- [ ] **Sahip:** Kaan
- **Belirti:** doktrin **(c) çift sahne** önermişti; v2 sessizce **(a)**'yı uyguladı
  (@ocak.biz ana sahne, Advaita ayda 2-3 story amplifikatör). Karar verilmedi,
  **mimariden türedi.**
- **Ağırlık:** @ocak.biz sıfırdan başlıyor, Advaita'da 2.600 sıcak kişi var.
  Eylül penceresi **37 gün** — bu borç takvimle yarışıyor.
- **Bağ:** KARAR 493 (kohort dönüşümü feed'den geçmez, motor Halka 1).

## B84 — Mekân: Ege, 24–27 Eylül, on iki–on altı kişi
- [ ] **Sahip:** Kaan
- **Belirti:** rezerve mi, opsiyonda mı, yok mu — bilinmiyor.
- **Bağ:** KARAR 492. Fiyat bandı (D3) buna bakıyor.

## B85 — v2.1'deki üç kayıt cümlesi için sözlü teyit
- [ ] **Sahip:** Kaan · ~1 dk
- **Belirti:** C05 · C11 · C20 caption'larına "başvuru/kayıt sayfası açık" cümlesi
  eklendi. Dump dayanağı net (yedi format kayıt route'u + `/anadolu/basvuru` canlı),
  ama **Bölüm 15 madde 4 sözlü kapı istiyor.**
- **Kapanış şartı:** Kaan onaylar ya da reddeder. İtiraz hâlinde silinecek üç cümle
  `30-sosyal.md` değişiklik günlüğünde tek tek yazılı.

## B86 — Kart derleyici: fotoğrafsız kart zemini ✅ KAPANDI (23 Ağu, glow zemin tasarım oldu)
- [x] **Kapanış:** **KARAR 546.** Radial artık yedek değil, **tasarım**: kömür zemin +
  metin bloğunun merkezine **kilitli** kor glow, şiddeti ve kaydırması ayarlı. Sitenin hero
  ilişkisinin kart karşılığı — metin ışığın içinde oturur.
- **Gerilim çözüldü:** "iki aileli sistem doğar" korkusu karşılanmadı; iki zemin tipi
  (fotoğraflı · glow) **ayrı ön ayar** taşıyor, karışmıyorlar. İmza konumu da zemin tipinden
  türüyor (KARAR 544).
- **Kapanış şartı karşılandı:** gerçek görselle yan yana kondu, gözle karar verildi —
  İ1 kartı basıldı (`03-sira.md` B-turu madde 7).
- [x] **Sahip:** Kaan + Claude (gözle)
- **Belirti:** araç üretildi ve beklemede. Şu anki **radial zemin yedek, tasarım değil.**
- **Gerilim:** sitenin glow'u taşınırsa iki aileli sistem doğar; o hâlde **dokulu glow**
  olmalı — düz degrade + serif italik internetin en çok gördüğü alıntı kartıdır.
- **Kapanış şartı:** gerçek görselle yan yana konup gözle karar verilir.

## B87 — C14: F2 karesi hatırlatması
- [ ] **Sahip:** Claude
- **Belirti:** söz değneği reels'i **MJ-zoom** kaldı. Gerçek değnek makrosu
  çekildiğinde değiştirilecek.

---

## B88 — `ornekler-seremoni.md` bekçisi yazılacak

- [ ] **Sahip:** Claude.ai · **Tetikleyici:** üçüncü Seremoni gövdesi yazılmadan önce
- **Malzeme:** iki gövde, iki mekân varyantı (online · yüz yüze). Bant **4.870–5.197 kr**
  (künye ölçümü, code point). İki nokta eğri vermiyor ama bant beyanı için yeterli —
  Çember bekçisi de dört sayfayla kuruldu.
- ⚠ **BANT BİR GÜN SONRA YİNE KAYDI (24 Ağu):** `kakao-seremonisi-online` 3605 → **3571**
  (KARAR 558 kayıt satırı), `hasat-ve-sukran` 3672 → **3638**. **Geçerli bant `3.571–3.686`.**
  *İki gün üst üste kayan bir bant, bekçinin gövdeden değil gövdenin bekçiden türediği
  anlamına gelir — damıtma doktrin durulmadan yapılmaz.*
- ⚠ **BANT GEÇERSİZ — 23 Ağustos tazelemesi.** Üç Seremoni gövdesi de yeniden yazıldı;
  o günkü bant **`3.605–3.686`** (`kakao-seremonisi-online` 3605 · `hasat-ve-sukran` 3672 ·
  `kakao-seremonisi-yuzyuze` 3686 — `python3 len()`, code point, canlı Notion `Detay`).
  Yukarıdaki `4.870–5.197` **bir buçuk kat şişik**; bu bantla bekçi yazılsaydı sonraki
  Seremoni gövdesi ~1.400 karakter fazla yazılacaktı. **B144'ün Çember'de yakaladığı
  kusurun aynısı.**
- ✅ **Üçüncü gövde geldi** — tetikleyici doldu, malzeme artık iki değil **üç** nokta.
  Bekçi yazılırken **KARAR 547 · 549 kesimleri** taşınır (kayıt cümlesi · "pas" satırı ·
  Pratik Bilgi'nin beslenme/ilaç/hamilelik satırları). Kesim tablosu
  `90-kronoloji/2026-08.md`, 23 Ağustos Advaita turu kaydında.
- **Taşınacak sapmalar:** `yaninda-getir` mekân başına ayrı liste (Çember'in "beş sabit +
  bir temaya özel" kalıbı buraya **taşınmaz**) · `kimin-icin` kapanışı mekâna göre bölük ·
  "Geç kalırsan…" maddesi iki sayfadan da **çıkarıldı** · sağlık/kontrendikasyon katmanı yeni.
- **Bağ:** KARAR 504 · 505 · B66 (Seremoni bekçisi yokluğu, bu maddenin selefi)

## B89 — `ornekler-atolye.md` bekçisi yazılacak

- [ ] **Sahip:** Claude.ai · **Tetikleyici:** **ikinci** Atölye sayfası
- **Belirti:** tek sayfadan bant çıkmaz. Elde **4.895 kr** tek nokta var (Ritüel Tasarımı,
  künye ölçümü). Kalıp ikinci Atölye sayfasına kadar **aday**, kanon değil.
- ⚠ **Tek nokta güncellendi (23 Ağu):** Ritüel Tasarımı yeniden yazıldı, **4.541 kr**
  (−354). Defterdeki `4.895` bayat. Hâlâ **tek noktadır — bant değildir**; bekçi
  yazılırken bu açıkça belirtilir, yoksa sonraki Atölye 4.541'e zorlanır.
- ⚠ **Gölge satır tuzağı (B154):** `Ritüel Tasarımı | Gölge 0210 o#2` Detay'ı **4.904**
  ve bayat. Ölçüm o satıra çarparsa yanlış nokta mühürlenir.
- **Sabitlenen:** on bölüm iskeleti (KARAR 510) · `elinde-ne-kalir` kanonik bölüm ·
  sabit `ne-olur` bloğu **yok** (KARAR 511) · vurgu ekseni söz→eylem.

## B90 — `/atolye` sayfasında Ritüel Tasarımı yanlış kutuda

- [ ] **Sahip:** Kaan (Notion) · **Tetikleyici:** KARAR 509 mühürlendi, doğrudan sonucu
- **Belirti:** `seri-atolyeler` bloğunda duruyor; **tek-seferlik listeye** taşınacak.
  İki oturumluk tek atölye, dört haftalık seri program değil.

## B91 — KARAR 79'un izleri iki referans dosyasında duruyor

- [ ] **Sahip:** Claude.ai · **Tetikleyici:** KARAR 509 supersede'i
- **Ölçüm (19 Ağu 2026, `grep`):** iki nokta, ikisi de yerinde —
  `20-ref-program.md:320` (*"Ritüel Tasarımı" — 4 hafta. Kişisel ritüel defteri.*) ·
  `20-ref-notion.md:104` (*Ritüel Tasarımı (Seri Program, 4 hafta, Advaita)*, Workshop
  Şablonları #1).
- ⚠ **Neden borç:** ledger 79'u SUPERSEDE işaretledi ama gövdeler eski hâli **beyan
  etmeye devam ediyor**. İndeks düzeldi, indekslenen düzelmedi (KARAR 482'nin tersi yönü).

## B92 — `10-marka.md` Maya/Aztek soy hattı iddiası yanlış

- [ ] **Sahip:** Kaan · **Tetikleyici:** KARAR 507
- **Belirti:** `10-marka.md:24` — *"Kakao seremonisi (Cacaoista, Maya/Aztek)"* →
  *"(Cacaoista)"*. Soy hattı iddiası **yanlış** (Kaan teyidi); kakaonun modern seremoni
  formatı 2003 sonrası.
- **Not:** proje dosyası aynası KARAR 471 gereği **elle** tazelenir — repo değişince
  ayna otomatik gelmez.
- **Kalan ayak:** site katmanında kalıntı var mı — `dist/` grep'i koşulmadı.

## B93 — "Kayıt" çift anlamı ayrıştırılmadı

- [ ] **Sahip:** Claude.ai → Notion · **Tetikleyici:** yedinci Açık Kapı sayfası
- **Çelişki:** `/seremoni` SSS *"Kayıt yapılıyor mu? Hayır"* (`90-kronoloji/2026-07.md:907`)
  = ses/video kaydı · Açık Kapı sabit satırı *"Kayıt alınır… sonradan izlersin"* = aynı
  kelime, oturuma katılım kaydı **değil**, oturumun kaydı. Aynı kelime iki anlamda.
- **Ölçüm (19 Ağu 2026, `dist/` grep `Kayıt alınır`):** **altı** canlı Açık Kapı sayfası —
  `bir-esikte-duruyorsun` · `bu-ses-kimin` · `dusundugum-hissettigim-yaptigim` ·
  `istek-mi-ihtiyac-mi` · `kokun-nerede-kaldi` · `nereye-kadar-senin`. Çember temiz.
  Diğer format sayfaları **ölçülmedi** — SSR oldukları için `dist/`te statik karşılıkları yok (B95 notu).

## B94 — Lint çelişkisi: site mi haklı, kanon mu

- [ ] **Sahip:** Kaan (karar) · **Tetikleyici:** `ocak-lint` bir sonraki taraması
- **Belirti:** `/acik-kapi` canlı gövdesinde "sembolik" **2**, sıklık sözü **4** geçiş;
  `yasak-dizeler.tsv` **ikisini de** yasaklıyor. `/cember` temiz.
- ⚠ **Neden borç:** karar yok. Ya site düzelecek ya yasak listesi muafiyet alacak —
  ikisi de yapılmadığı sürece lint her turda aynı iki bulguyu üretir ve gürültüye döner.
  (KARAR 432 muafiyetinin B04'te işlediği kalıbın ikinci vakası.)

## B95 — `20-ref-program.md` Açık Kapı format sayımı bayat

- [ ] **Sahip:** Claude.ai · **Tetikleyici:** bir sonraki `20-ref-*` turu
- **Belirti:** dosya **dört** Açık Kapı formatı yazıyor; canlı site **üç** diyor
  (Mevsim Buluşması yok).
- **Yanında duran cevaplanmış soru — borç değil, kayıt:** altı format sayfası
  (`acik-kapi` · `cember` · `seremoni` · `atolye` · `mini-retreat` · `sehir-aksami`)
  `dist/`te statik olarak **yok**; hepsinde `export const prerender = false` ve SSR ile
  `_render.func` üzerinden çıkıyorlar (davet linki `?etkinlik=` param'ı için, "Eyeball #4
  Fix 2d"). Tasarım, eksik değil. Bu yüzden `dist/` grep'i bu altı sayfayı **görmez** —
  ölçüm yaparken hatırla.

## B96 — Skill zip'i için tazelik kapısı yok

- [ ] **Sahip:** CC + Claude.ai · **Tetikleyici:** KARAR 513
- **Kural (kurulacak):** bir skill açılmadan önce `docs_oku` ile kanonik `SKILL.md`
  bayt/satır ölçüsü alınır, zip'inkiyle karşılaştırılır; **tutmuyorsa üretim durur.**
- **Doğduğu hasar (19 Ağu):** zip beş sayfalık sürümde donmuştu → ölçülebilir hasar
  (bandın altında gövde + eksik `ne-olur` paragrafı). Zip yeniden yüklendi, **konteynere
  yansımadı** — md5 aynı kaldı (`7127de37…`). Yani yükleme başarılı görünüp etkisizdi.

## B97 — MCP checkout tazeliği: düğme yanlış öğretiyor

- [ ] **Sahip:** CC · **Tetikleyici:** KARAR 513
- **Ölçüm (19 Ağu):** Railway `ocak-mcp` **ayarları temiz** — auto-deploy açık, watch path
  yok, branch `main`. Sorun ayarda değil **düğmede**: checkout `1546622`'de donmuştu,
  `49ea8e2` inmemişti.
- **Öğrenilen:** Railway'in **"Redeploy" düğmesi taze commit çekmez** — son başarılı
  deployment'ı tekrar koşar. Taze commit için **"Deploy latest commit"** (Cmd+K).
  `49ea8e2`'nin ilk build'i sürerken Redeploy'a basılması build'i **REMOVED**'a düşürdü.
- **Açık kalan:** kalıcı çözüm. Elle disiplin bir tazelik kapısı değildir.

## B98 — Ritüel Tasarımı gövdesi `ocak-lint`'ten geçmedi

- [ ] **Sahip:** Claude.ai · **Tetikleyici:** gövde Notion'a girdi, tarama borcu kaldı
- **Belirti:** `ocak-etkinlik` skill'inin **9. üretim adımı** (yasak dize taraması)
  koşulmadı. Gövde canlıda (`dist/etkinlik/rituel-tasarimi`, 4.768 kr `<main>` metni)
  ama taramasız.
- **Bağ:** KARAR 506 · 507 bu turda mühürlendi — yeni yasak dizeler henüz hiçbir gövdeye
  karşı koşulmadı.

## B99 — Altıncı Açık Kapı sayfasında +1 karakter ayrışması

- [ ] **Sahip:** Claude.ai · **Tetikleyici:** bir sonraki künye ölçümü
- **Belirti:** *6 · Sınır* gövdesi kanonik `ne-olur` bloğuyla **3.248 kr**; künye tavanı
  **3.247**. Bir karakter.
- **Ayrışmayan iki ihtimal:** (a) gerçek sapma — gövde bandın dışında · (b) tavanın
  altıncı sayfayı hiç görmemesi — bant beş sayfayla ölçülüp altıncı eklendiğinde
  yenilenmemiş. **Karar için canlı Notion gövdesiyle diff gerek.**
- **Not:** `awk length` bu makinede **bayt** sayıyor (`çığır` → 9). Ölçüm `python3 len()`
  ile yapılacak, yoksa +1 gürültüsü ölçüm aracından gelir (KARAR 470).

## B100 — Bekçi ayağı bayat: Açık Kapı hız sözü

- [ ] **Sahip:** Claude.ai · **Tetikleyici:** yedinci Açık Kapı sayfası yazılmadan önce
- **Belirti:** Açık Kapı `pratik-bilgi` hız sözü — *"Kayıt alınır, hemen ardından
  e-postana düşer"* — teslim hızı vaat ediyordu. Altı canlı sayfada **Notion'da
  düzeltildi** (Kaan, 19 Ağu). `docs/skills/ocak-etkinlik/SKILL.md:104` **hâlâ eski
  cümleyi taşıyor.**
- ⚠ **Neden borç:** sabit blok **kaynağı** türevinden geride. Yedinci sayfa bekçiden
  yazılacağı için hız sözü **geri gelir** — KARAR 513'ün tersten vakası: bu sefer bayat
  olan türev değil, kaynağın kendisi.
- **Kapanış koşulu:** yeni cümle **canlı gövdeden okunup** `SKILL.md`'ye taşınır.
  Cümle **uydurulmaz**; bir Açık Kapı sayfasının `pratik-bilgi` bloğundan birebir alınır.
- **Ölçüm notu (19 Ağu 13:39 build'i):** eski cümle o build'de **altı** sayfada
  görünüyordu — düzeltme build'den sonra. **Bir sonraki deploy'da altı sayfa yeniden
  ölçülecek:** hepsi temizse borç yalnız `SKILL.md`'ye daralır; **bir tanesi bile eskiyse
  Notion tarafı da açık kalır.**

## B101 — Çok oturumlu etkinlikte Zoom linki sayısı kararsız

- [ ] **Sahip:** Kaan · **Tetikleyici:** KARAR 514 mühürlendi
- **Belirti:** gölge satır `Durum: Taslak` olduğu için `zoom-olustur` tetiklenmez.
  İki oturum **tek tekrarlayan toplantı** mı, **iki ayrı link** mi — karar yok.
- **Sonucu:** iki ayrı linkse ikincisi elle üretilip `Detay > pratik-bilgi`'ye
  ve MailerLite akışına konmalı. Tek linkse ek iş yok.
- **Bağ:** KARAR 514 · KARAR 486 (katılım linki ödeme kapısının arkasında).
- **Kapanış şartı:** karar verilir ve KARAR 514'ün kalıp tarifine tek cümle
  olarak yazılır — yoksa sonraki çok oturumlu etkinlikte aynı soru yeniden sorulur.

## B102 — Ücretli formatlarda kayıt penceresi ödeme temposuna göre kapatılmıyor ✅ KAPANDI (19 Ağu, Kaan kararı)

- [x] **Kapanış:** `Kayıt Kapanış Tarihi` **opsiyonel alandır** ve boş bırakıldığında
  `pencereIcinde`'nin `tarihBaslangic`'e düşmesi **kabul edilen davranıştır** —
  kusur değil, tasarım. 25/25'lik ölçüm bir eksiklik değil, alanın fiilî
  kullanılmama hâlini gösteriyor. Kod değişmiyor, veri girişi kalıbı
  dayatılmıyor. ⚠ **Kapanışın taşıdığı risk açıkça kabul edildi:** kayıt
  etkinlik gününe kadar açık kaldığı için son gün gelen EFT/havale seansa
  yetişmeyebilir; o vakada katılım linki gitmez (KARAR 486). Bu, kapatılan
  borcun bedeli olarak **bilinerek** üstlenildi — sonraki turlarda "bulunmuş
  yeni hata" diye yeniden açılmaz.
- [x] **Sahip:** Kaan (Notion) · ~5 dk/kayıt
- **Ölçüm (19 Ağu, `etkinlikler-dump.mjs` + `fetchEtkinlikler`/`transformEtkinlik`
  üzerinden sayım; ölçüt `(ucret ?? 0) > 0 && !kayitKapanis`):** 26 ham satırın
  **25'i ücretli**, ve **25'inin tamamında** `Kayıt Kapanış Tarihi` = ∅.
  Dolu olan **sıfır** — istisna yok. Bunların **15'i canlı**
  (`siteGoster=true && durum ∈ {Kayıt Açık, Dolu}`). En yakını **31 Ağustos**
  (*Bir Eşikte Duruyorsun*, 300) — on iki gün.
- **Belirti:** `kayitKapanis` boşken `pencereIcinde` referansı `tarihBaslangic`'e
  düşer (KARAR 383–386) — yani kayıt **etkinlik gününe kadar** açık kalır.
  Ödeme EFT/havale ile geliyor: cuma akşamı gelen bir kayıtta para cumartesi
  seansına yetişmez. Kadın kaydolur, `odemeGerekli` kapısı açılmaz, katılım
  linki gitmez (KARAR 486). Kusur kodda değil — **veri eksikliği.**
- **Kapsam:** bu tek kayıt değil, **tek istisnasız bütün ücretli kayıtlar**.
  Ritüel Tasarımı yalnız ölçümü tetikleyen vaka; ölçüm alanın tamamına yayıldı.
- **Kapanış şartı:** ücretli her etkinlikte `Kayıt Kapanış Tarihi` dolu ve
  etkinlik gününden **en az iki iş günü** önce. Ölçüm: yukarıdaki ölçütle
  sayılan kayıt sayısı **25 → 0**. Ara hedef: **canlı 15 → 0**.
- **Bağ:** KARAR 486 · 383–386 · B101 (aynı satırın öteki açık ucu).

## B103 — İki canlı beyan "OCAK" adı hakkında çelişiyor

- [ ] **Sahip:** Claude.ai · **Tetikleyici:** bir sonraki `20-ref-bot.md` turu
- **Çelişki:** `_arsiv/20-ref-bot-2026-08-06.md:41` — *"Ocak Kadın Çemberi" ve **"OCAK"** denemeleri reddedildi*.
  *(Atıf 22 Ağustos 2026'da çevrildi: canlı `20-ref-bot.md` o gün baştan yazıldı, eski gövde
  arşive alındı. Eski satır numarası `20-ref-bot.md:13`; arşiv dosyasında şerh başlığı
  yüzünden 41. satıra kaydı. Canlı dosyanın 13. satırı artık başka bir şey söylüyor.)*
  KARAR 410'un kronoloji satırı (`2026-07.md:1194` zinciri) ise *"Ocak Kadın Çemberi" ve
  "Ocak.biz" elendi, **ana aday "OCAK"*** der. Yani düz "OCAK" bir yerde denenmiş-reddedilmiş,
  öbür yerde henüz-denenmemiş-aday.
- ⚠ **Neden borç:** hangisinin daha yeni olduğu bilinmiyor. Yanlış olanı doğru sanmak `…0888`
  hattında yanlış ada başvurmaya yol açar — KARAR 521'in gerekçesi bu belirsizliği **atlatmak**
  üzerine kuruldu, ortadan kaldırmak üzerine değil.
- **Kapanış şartı:** Meta Manager'daki ret geçmişi (ad + tarih + gerekçe metni) okunur, iki
  beyandan yanlış olan düzeltilir. **Gerekçe metni ayrıca değerlidir:** "doesn't match brand"
  ile "all-caps not permitted" farklı iki düzeltme demektir.
- **Bağ:** KARAR 410 · 519 · 521 · B19.

## B104 — İkinci hat (`…0888`) WABA değil; onaylı ad ve bot tek hatta sıkışık

- [ ] **Sahip:** Kaan · **Tetikleyici:** KARAR 396'nın kuyruğu, 19 Ağu'da görüldü
- **Durum (ölçüldü, 19 Ağu):** `src/lib/api.ts:26` → `WHATSAPP_URL = 'https://wa.me/905325555226'`.
  Yani yüzen buton · footer · Kanallar kartı üçü de **bota gidiyor** — kopukluk **yok**
  (`354fb14`, KARAR 396 bu yüzden SUPERSEDE oldu). ⚠ Bu borcu açan patch tersini varsaymıştı
  (`…0888` gösteriliyor sanılıyordu); ADIM 0 ölçümü çürüttü, belirti hedefe çevrildi.
- **Asıl eksik:** `…0888` hattı **WABA olarak açık değil** ve onaylı display name yok. Marka
  bugün tek hatta bağlı — onaylı ad, bot ve site aynı numarada. İkinci hat ne yedek ne ayrı
  yüzey; atıl duruyor. Yasal sayfalardaki telefon (`+90 532 208 0888`) bu hattır ve düz metin
  olarak yaşar (KARAR 518) — kadın oradan yazarsa **karşısında bot yok.**
- **Kaan'ın yönü (19 Ağu):** `…0888` için yeniden başvurulacak — hat WABA'ya açılır, ad onayı
  alınır (KARAR 521), bot oraya bağlanır. Site kodu **değişmez**; `api.ts` bot hattını
  göstermeye devam eder. Terk edilen alternatif: `…0888`'i rafa kaldırıp tek hatta kalmak.
- **Kapsam:** site tarafı **sıfır dokunuş** — iş tamamen Meta/n8n tarafında.
- **Kapanış şartı:** `…0888`'e yazılan bir mesajın bota düştüğü **canlı round-trip** ile teyit
  edilir. Kod grep'i yeterli değildir.
- **Bağ:** KARAR 396 · 518 · 519 · 521 · B19 · B103.

## B105 — işaret canlı yüzeylerin yarısına uygulanmadı

**Sahip:** Kaan · **Tetikleyici:** KARAR 522; site tarafı kapandı, dış yüzeyler açık.

**Kapandı (19 Ağu, `fd5c44a` + `f7e4d73`):** `public/` beş varlık · `Layout.astro`
üç icon link · `Nav.astro` logo. Nav yüksekliği 60px masaüstü / 62.5px iPhone 13,
değişmedi. vitest 246/246 sabit.

**Açık — hepsi Kaan'ın elinde, kod işi değil:**
1. Instagram @ocak.biz profil görseli
2. WhatsApp Kanalı görseli
3. Resend e-posta şablonlarının antedi
4. **OG kartı** — 1200×630. Geçici bir kart üretildi ama logodan ibaret; iyi bir OG
   kartı hero cümlesini de taşır (*İçindeki ateş sönmedi*). Ayrı tasarım işi.

Varlıklar hazır: `OCAK-logo/png-kare/` (avatar) · `OCAK-logo/dikdortgen/` (banner, antet).
Ayrıca `10-marka.md`'nin project-file aynası elle tazelenmeli (KARAR 455/471).

## B106 ✅ — Sayfalar loader görünürlük filtresi (aynı gün açıldı ve kapandı)

**Sahip:** CC · **Açıldı ve kapandı:** 19 Ağustos, commit `c45332e`.

KARAR 515 yayın tetikleyicisiyle görünürlük kaynağını ayırmıştı. Etkinlikler tarafında
uygulanmıştı — `config.ts:200` `if (!fm.siteGoster || fm.durum === 'İptal') continue`.
**Sayfalar tarafında yoktu:** `fetchSayfalar` sorgusu çıplaktı (`notion-pages.ts:282`),
`Durum` okunuyor (`:308`) ve frontmatter'a yazılıyordu (`:337`) ama hiçbir yerde
tüketilmiyordu. `"Yayınla"` dizesi kodda hiç geçmiyordu.

Sonuç: `Durum = Taslak` olan `/site-rehber` canlıdaydı ve sitemap'teydi. Kaan `Yayınla`
işaretini kaldırıp sayfanın kapandığını sanmıştı; kapanmamıştı. **Sahip olunduğu sanılan
bir kontrolün olmaması, hiç kontrol olmamasından tehlikelidir** — yarım kalmış bir sayfa
"yayınlamadım" diye bırakılır ve sonraki build onu canlıya alır.

`config.ts`'teki FIXME'nin gerekçesi bayatlamıştı: *"19 sayfa Onay Bekliyor'da, filtre
eklenirse loader boş döner."* Ölçüm günü Onay Bekliyor **sıfırdı**.

**Uygulama.** `fetchSayfalar` artık `Durum === 'Yayında'` süzüyor. Desen Etkinlikler'den
alındı, tek fark yerleşim: süzme **transform'dan önce**, çünkü `transformPage` her sayfa
için Notion'dan blok çekiyor — elenecek satırın bloklarını çekmenin anlamı yok.
`Yayınla` alanına dokunulmadı; o build tetikliyor, görünürlük sürmüyor (KARAR 515).

**Ölçüm:** 21 çekildi · 20 yayında · 1 atlandı · rota 45 → 44 · `/site-rehber` dist'ten
ve sitemap'ten düştü (49 → 48) · başlık regresyonu yok (44/44) · vitest 246/246.

**Boş-site kapısı.** CC brief'te olmayan bir koruma önerdi ve onaylandı: çekilen > 0 ama
yayında == 0 ise build durur. Gerekçe FIXME'nin doğduğu senaryonun kendisi — filtre
yazılır, Notion'daki değerler uyuşmaz, loader boşalır. Kapı olmasa bu sefer sessizce
canlıya giderdi. Maliyeti asimetrik: yanlış tetiklenirse build patlar ve fark edilir,
tetiklenmezse boş site yayınlanır. KARAR 516 uyumlu — yalnız felaket hâlinde ateşliyor,
rutin değil. Hata mesajı **teşhis taşıyor**: beklenen değer, çalışma anında görülen
gerçek değer kümesi, ve nereye bakılacağı (Notion Durum seçenek adı, `YAYIN_DURUMU`
sabiti). *Bir guard'ın değeri yakaladığı hatada değil, yakaladığında ne söylediğindedir.*

**Sıralama şartı korunuyor:** bu filtre `robots.txt` açılmadan önce gerekiyordu, artık
yerinde. Robots açıldığında Taslak sayfa sitemap üzerinden sızmaz.

## B107 — üç sapma, üçü de küçük

**Sahip:** Kaan · **Tetikleyici:** 19 Ağustos ölçümleri.

1. **`robots.txt` hâlâ `Disallow: /`.** Dosyadaki not "21 Haziran sabahı çevrilecek"
   diyor; bugün 19 Ağustos. Site iki aydır aramaya kapalı. Önkoşulu (B106 filtresi)
   artık kapandı — açma kararı Kaan'da.
   ⚠ **İkinci önkoşul var:** `03-sira.md:24-30` iade cümlesini (`teslimat-iade.astro:57-58`
   + `mesafeli-satis.astro:123-124`, hâlâ *"kart üzerinden iade"* diyor) `robots` Allow'un
   önüne koyuyor — lansman tanımı KARAR 149. B106 filtresi tek önkoşul değildi.
2. **İki sayfa aynı başlığı paylaşıyor** — kakao seremonisi online + yüzyüze, ikisi de
   `Kakao Seremonisi · OCAK`. Ayrı sayfalarsa başlıkları da ayrışmalı.
3. **`#1A1614` sapması.** Zemin kanonu `#1A1210` (`tokens.css` `--coal`, marka dosyaları).
   `#1A1614` yalnız `VisualZ.md` ve ilk 30 gün sosyal planında yaşıyor. O dosyalar korpusa
   girdiğinde çevrilecek. Kronolojideki tarihli mockup kaydına **dokunulmaz** (KARAR 61).

## B108 — Başvuru→kabul→ödeme köprüsünün mekaniği tasarlanmadı

- [ ] **Sahip:** Kaan (akış kararı) → CC (uygulama)
- **Kaynak:** claude.ai 19 Ağu sohbeti; Kaan'ın kendi vurgusu.
- **İçerik:** Başvuru ve ücretli kayıt **ayrı kapılar, birlikte kullanılmıyor**. Cevapsız üç soru:
  (a) başvuru **kabul** hangi aksiyonla, nerede işaretlenir; (b) **red** akışı nedir, başvurana ne gider;
  (c) kabul edilince **ödeme köprüsü** nasıl kurulur (havale bilgisi + referans kodu hangi tetikle çıkar).
- **Durum:** Faz 1 kart akışını kapattı (KARAR 488), ödeme havaleye indi — köprü tarifi bu yeni gerçeğe göre hiç yazılmadı.
- **Bağ:** `03-sira.md` "n8n ödeme onayı akışı" maddesi bu köprünün **ödeme ayağı**; kabul/red ayağı orada yok.

## B109 — Kayıt ekranı tarih listesinde program adı görünmüyor

- [ ] **Sahip:** CC
- **Kaynak:** claude.ai 19 Ağu sohbeti.
- **İçerik:** Kayıt formundaki tarih seçimi yalnız tarih basıyor. Aynı güne birden çok etkinlik düştüğünde
  kaydolan hangi programa yazıldığını göremiyor. Beklenen: `program adı — tarih`.
- **Ölçüm gerekli:** çok oturumlu etkinlik kalıbı (KARAR 514, kayıt satırı + gölge satır) sonrası
  listenin ne bastığı **yeniden ölçülmeli**; borç bu ölçümden sonra kesinleşir.

## B110 — "Sonraki buluşma" boş durumu tanımsız

- [ ] **Sahip:** Claude.ai (metin) → Notion/CC (yerleştirme)
- **Kaynak:** claude.ai 19 Ağu sohbeti.
- **İçerik:** İleri tarihli yayınlı etkinlik kalmadığında kartın/bölümün ne göstereceği yazılı değil.
- **Sınır:** metin davet dilinde olacak; **aciliyet dili ve "köz" yasak** (KARAR 86 · lint kanonu).
- **Bağ:** "En Yakın X" başlık kanonu KARAR 377; boş durum o kanonun tanımsız ucu.

## B111 — Success ekranlarının bütünü hiç denetlenmedi

- [ ] **Sahip:** Kaan (eyeball) + CC (düzeltme)
- **Kaynak:** claude.ai 19 Ağu sohbeti.
- **İçerik:** Formların gönderim sonrası ekranları tek tek doğrulanmadı: doğru mesaj · doğru görsel ·
  sonraki adım yönlendirmesi. Bugün yalnız **B10** var, o da tek bir öğeyi (ember glyph) soruyor.
- **Bağ:** B10 bu denetimin içinde cevaplanabilir; kapanışta ikisi birlikte değerlendirilir.
- **Not:** `03-sira.md` Faz 1 sırasındaki "Success ekranına kopyalama tuşları" maddesi bu denetimin
  **kapsamına girer**, onun yerine geçmez.

## B112 — Site geneli tutarlılık taraması yapılmadı

- [ ] **Sahip:** Claude.ai (tarama) → Kaan/Advaita (Notion)
- **Kaynak:** claude.ai 19 Ağu sohbeti.
- **İçerik:** Sayfalar arası çelişki iddiaları toplandı ama **hiçbiri ölçülmedi**: süre/sıklık
  (çember akış süresi ↔ "90 dakika online"), "fiziksel" → "yüz yüze" dönüşümünün tamamlanıp
  tamamlanmadığı, kakao geçişlerinin normalizasyonu, her kavramın tek sahip sayfası.
- ⚠ **Ön koşul:** taze `site-icerik` dump'ı. Bayat dump üstünde koşulan tarama taşınamaz bulgu üretir
  (KARAR 513 · B44'ün ilk denemesinin düştüğü yer).
- **Bağ:** B08 (Uluslararası sweep) · B94 (lint çelişkisi) · B95 (format sayımı bayat) bu taramanın alt kümeleri.

## B113 — Vurgu denetimi: kamu metinlerinde bold/italik dağılımı hiç bakılmadı

- [ ] **Sahip:** Claude.ai → Kaan
- **Kaynak:** claude.ai 19 Ağu sohbeti.
- **İçerik:** Vurgunun doğru cümlede olup olmadığı ölçülmedi. Ölçüt: yapıyı taşıyan cümle ile
  kırılganlık doruğu vurgulanır; süs vurgu ayıklanır.
- **Not:** `manifesto-vurgu` section'ı ayrı iştir (kanonik section), bu madde onun yerine geçmez.

## B114 — Görsel stil kodu kilitlenmedi; üretim tek tek yürüyor ✅ KAPANDI (23 Ağu, kurucu görsel + --v 8.1 kilidi)

- [x] **Kapanış:** **KARAR 542.** İstenen "sabit stil kodu + format seti" karşılandı:
  `--sref` çapası mühürlendi (kurucu görsel URL'i `_arsiv/2026-08-23-devir.md` §2'de),
  MJ motoru `--v 8.1`'e kilitlendi, format seti kart derleyicisinde **altı gömülü ön ayar**
  olarak yaşıyor — F1 fotoğraf · F1 glow · F1 altın · F2 kapak · F2 iç kart · F4 story 9:16.
  Araç `tools/ocak-kart-derleyici.html`.
- ⚠ **Kapanışın dışında kalan ayak: OG kartı (1200×630, B105'in dördüncü ayağı) açık kalır.**
  Derleyicide o oran yok. Bu borç kapandı, o ayak **B105'te yaşamaya devam ediyor.**
- [x] **Sahip:** Kaan
- **Kaynak:** claude.ai 19 Ağu sohbeti.
- **İçerik:** Atmosferik görsellerin stil kodu sabitlenmediği için her görsel kendi denemesiyle çıkıyor;
  yüzeyler arası tutarlılık üretim anına bırakılmış. İstenen: sabit stil kodu + format seti
  (hero · dikey post · story · kare).
- ⚠ **Sınır:** insan yüzü/figürü üretilmez — insan ve seremoni anları gerçek fotoğraftır (marka etiği).
- **Bağ:** `03-sira.md` B-turu 1. maddesi (Gün 0 kurucu görsel) bu kilidin **ilk müşterisi**;
  B86 (kart derleyici fotoğrafsız zemin) ikinci. ⚠ *Patch dışı ek (uygulama anında ölçüldü):*
  **B105**'in açık dördüncü ayağı (OG kartı 1200×630, hero cümlesini taşıyacak) üçüncü müşteridir —
  B105 aynı gün açıldı, patch onu görmeden yazılmıştı.

## B115 — Kişiye özel ödeme daveti üretilemiyor

- [ ] **Sahip:** Kaan
- **Kaynak:** claude.ai 19 Ağu sohbeti.
- **İçerik:** Standart kayıt akışı dışında, tekil kişiye özel tutarlı ödeme daveti (tutar + referans +
  bilgi maili) üretecek bir yol yok. Bugün elle yazılıyor.
- **Bağ:** B108'in kabul-sonrası ayağı bu mekanizmaya dayanabilir; referans kodu üretimi KARAR 489/490'a tabidir.

## B116 — WhatsApp'ın yayın/üyelik kanalı olarak tanımı yok

- [ ] **Sahip:** Kaan
- **Kaynak:** claude.ai 19 Ağu sohbeti.
- **İçerik:** Hat canlı (KARAR 396 **SUPERSEDE** →518; şart 19 Ağu'da sağlandı) ama kanalın
  **ne taşıyacağı** yazılı değil: mektup ritmi, üyelik kurgusu, hangi içerik hangi sıklıkta.
- ⚠ **Sınır:** rıza olmadan gönderim yok; "davet ≠ satış" (KORUNACAK İFADE #7). Ateş Mektupları'nın
  "ritim dinleme" kanal kimliği emsaldir, kopyası değil.
- **Bağ:** B19 (display name) hattı ayrı; bu madde ona bağlı değil.

## B117 — Bot muhtevası eğitilmedi: ne bildiği ve nereye kadar konuştuğu yazılı değil

- [ ] **Sahip:** Kaan
- **Kaynak:** claude.ai 19 Ağu sohbeti.
- **İçerik:** B07 **modeli** seçer; bu madde **muhtevayı** sorar: bilgi kapsamı, ton, sınırlar,
  insana devir eşiği, hangi soruya cevap vermeyeceği.
- **Sınır:** marka sesi kanonu (`10-marka.md` · `20-ref-icerik-dili.md`) bağlayıcıdır —
  reçete vermez, kürsü kurmaz.

## B118 — Çerez rızası: metin ile fiili davranış çelişiyor

- [ ] **Sahip:** Kaan (karar) + CC (uygulama)
- **Kaynak:** claude.ai reklam/KVKK sohbeti (özet, 19 Ağu).
- **İçerik:** Gizlilik metni analitik/pazarlama çerezlerini rızaya bağlıyor; rızayı toplayan banner yok,
  dolayısıyla ölçüm etiketleri onaydan önce çalışıyor.
- ⚠ **Atomik:** banner kurulmadan metin sıkılaştırılmaz; ikisi **aynı commit'te** gider.
  Metin önce düzeltilirse site yazdığını yapmıyor durumuna geçer.
- **Bağ:** B16 (ilk hafta paketi) içindeki Consent Mode v2 ayağı budur; bu madde onu daraltır ve sahiplendirir.

## B119 — Bülten bölümü e-posta ölçümünü söylemiyor

- [ ] **Sahip:** Kaan
- **Kaynak:** claude.ai reklam/KVKK sohbeti (özet, 19 Ağu).
- **İçerik:** Açılma/tıklama ölçümü açık; aydınlatma metninin bülten bölümü bunu belirtmiyor.
  Bir cümle yeterli: etkileşim verisinin işlendiği + amacı.
- **Bağ:** B118 ile aynı turda gider (tek metin dokunuşu, iki eksik).

## B120 — Seans arşivinin ilk dönem yolu kararsız

- [ ] **Sahip:** Kaan (karar) → CC (kurulum)
- **Kaynak:** claude.ai seans arşivi sohbeti (özet, 19 Ağu).
- **İçerik:** Tam mimari (barındırma + otomasyon + portal) hacim yokken kurulmayacak; ilk kayıtlar
  elle yürüyecek. Kurulmamış olan: şifreli `/arsiv` yüzeyi + Notion arşiv koleksiyonu.
- ⚠ **Açık karar (Kaan):** arşiv **tek şifre** mi, **dönem bazlı şifre** mi. Dönem bazlı kohort ayrımını
  kaba da olsa korur; tek şifre her şeyi herkese açar.
- ⚠ **Etik duvar — değişmez (KARAR 57):** fiziksel çember ve paylaşım turu **kaydedilmez**.
  Bu akış yalnız tam-kayıt kategorisindeki formatlar içindir; kayıt bildirimi zorunludur.
- **Sabit ayrım:** video hiçbir varyantta Notion'da veya sitede durmaz — barınakta durur, yüzey yalnız işaret tutar.

## B121 — 🔴 Davet akışı açılmalı — LANSMAN ENGELİ ✅ KAPANDI (22 Ağu, şartsız açıldı)

- [x] **Kapanış:** `DAVET_AKISI=acik`, **üç ortamda** (Production · Preview · Development),
  redeploy yapıldı. Preview'da da açık olması bilinçli: kapalı kalsaydı her test canlıya
  bakmayı gerektirirdi.
- **Zincir uçtan uca sınandı** — "build başarılı" ile yetinilmedi: (1) davet kutusu kayıt
  sayfasında render oldu ✓ · (2) Resend maili gitti ✓ · (3) Notion Davetler DB'ye satır
  düştü ✓ · (4) `Hatırlatma Atıldı` boş — **beklenen**, A→B zinciri n8n tarafında.
- ⚠ **Aşağıdaki üç açma şartının hiçbiri yapılmadı.** Akış şartsız açıldı; karar bilinçlidir
  (**KARAR 537**, KARAR 535'i gevşetir). Üç şart **kapanmadı, devredildi → B132.**
  KARAR 535 iptal değil, **ertelendi.**
- **Geri dönüş yordamı:** `DAVET_AKISI=kapali` + redeploy, iki dakika.

**Kapanıştan önceki gövde — olduğu gibi durur:**

- [ ] **Sahip:** CC (kod) → Kaan (env + redeploy)
- **Kaynak:** `brief-davet-honeypot` + merge turu (22 Ağu, `58ed14c` · `a5ade5a`), KARAR 535.
- **Durum:** `DAVET_AKISI` production env'de **tanımlı değil → varsayılan kapalı**. Davet kutusu
  yedi kayıt sayfasının hiçbirinde render edilmiyor; `/api/davet` erken dönüyor.
- ⚠ **Neden borç:** kapatma **bot saldırısı nedeniyle alınmış geçici bir önlemdir, kalıcı karar
  değildir.** Davet, kayıt akışının bir parçası — kadın kayıt olduktan sonra bir kız kardeşini
  çağırır. Kapalı kaldığı sürece o halka eksik ve **lansman tam değil.**
- **İki uç birden susuyor:** Resend maili **ve** Notion Davetler DB kaydı
  (`383b61ebfa87801db7b7d47493e41aca`, KARAR 271). Yani davet kapalıyken `Sonuç` eşleştirmesi ve
  A→B hatırlatma zincirinin girdisi de üretilmiyor.
- **Açma şartı — üçü de bitmeden açılmaz:**
  1. Cloudflare Turnstile (ya da eşdeğeri)
  2. IP başına hız sınırı
  3. Davet edenin kendi adresini doğrulaması
- **Açma yordamı:** `DAVET_AKISI=acik` **ve redeploy** — değer build zamanında sabitleniyor
  (`kart-akisi.ts` deseni, KARAR 488); env değiştirmek tek başına yetmez.
- ⚠ **Unutulmaya en açık borç.** Kapalı bir yüzey hata vermez, log'a düşmez, kimse şikâyet etmez —
  yalnız sessizce yok olur. Öncelik işareti (🔴) korunacak.

## B122 — Zoom kaydı süreci yok — LANSMAN ENGELİ · ⚠ SAHİP DEĞİŞTİ (22 Ağu → Advaita)

- ⚠ **Borç kapanmadı, sahip değişti.** Bot işi değil; Kaan'ın listesinden düştü,
  **Advaita'ya** geçti. Vaat duruyor, sorumluluk taşındı. Lansman engeli işareti durur.
- [ ] **Sahip:** ~~Kaan~~ → **Advaita** (22 Ağu)
- **Çelişki:** site *"Açık Kapı kaydedilir, kayıt katılımcılarla paylaşılır"* diye vaat ediyor;
  süreç kurulmadı (Vimeo yok).
- ⚠ **31 Ağustos'ta ilk Açık Kapı var.** Vaat edilip yerine getirilmeyen ilk şey olur.
- **Bağ:** KARAR 57 etik duvarı — kayıt bildirimi zorunlu, çember/ritüel kaydedilmez. Bu akış
  yalnız tam-kayıt kategorisindeki formatlar için. B120 (arşiv yolu) ile aynı aileden.

## B123 — Sohbet paneli yok — botun geçmişi denetlenemiyor ✅ KAPANDI (22 Ağu, `panel.ocak.biz` canlı)

- [x] **Kapanış:** **KARAR 536.** `OCAK · Panel` workflow'u kuruldu, `panel.ocak.biz` canlı.
  Sıfır commit — Vercel'e dokunulmadı, n8n'den servis ediliyor.
- **Üç sekme:** sohbetler (konuşma görünümü · kanal süzgeci · arama · WhatsApp'ta aç) ·
  maliyet (günlük/kanal/model kırılımı, konuşma ve çağrı başına, cache tasarrufu) ·
  kontrol (bot aç/kapa, fiyat ve kur düzenleme — KARAR 540).
- **DNS:** CNAME + `_railway-verify` TXT eklendi, `dig` ile doğrulandı. Railway'in kendi
  kontrolü gecikti ama webhook gövdesindeki `webhookUrl` alanı alan adının çalıştığını gösterdi.
- **Erişim:** tek `PANEL_TOKEN` (Railway env). Yoksa `throw`; yanlışsa "Bu sayfa yok" —
  404 değil, **200 + boş sayfa** (varlık sızdırmaz).
- ⚠ **Eksikler v2'ye devredildi → B133.** Parametrik `AYAR` bloğuyla başka markaya
  kopyalanabilir tasarlandı; **denenmedi.**
- **Mimari tam hâli:** `20-ref-bot.md` §5a.

**Kapanıştan önceki gövde — olduğu gibi durur:**

- [ ] **Sahip:** CC (n8n)
- **Ölçüm:** n8n execution budaması nedeniyle 61 turluk bir konuşma panelde **5** görünüyor.
- **Tek gerçek kayıt Postgres.** Denetim yapılamıyor, arıza sonrası ne konuşulduğu okunamıyor.
- **Çözüm:** n8n workflow, webhook → Postgres → HTML. **Sıfır commit** — site kodu değişmez.

## B124 — Postgres yedeği yok → ⚠ İLK YEDEK ALINDI (22 Ağu), OTOMATİK YEDEK YOK

- ⚠ **Borç kapanmadı, daraldı.** 22 Ağustos'ta `pg_dump` ile **ilk yedek alındı**: 16 MB,
  doğrulandı (`head -3` → `PostgreSQL database dump`), iCloud'da `OCAK-yedek/` klasöründe.
  **Bu tek seferlik bir fotoğraftır. Cron yok.**
- ⚠ **Yedek repoya konulmaz.** İçinde kadınların konuşma metinleri var; commit'lenen şey
  kalıcıdır ve KARAR 57 md. 4 ("veri kadının", "sil" derse silinir) ile çelişir.
- **Kalan iş:** otomatik yedek. Hedef Drive/S3 ya da eşdeğeri — **Kaan'ın seçimi.**
  Yordam: `pg_dump "$DATABASE_PUBLIC_URL" > ocak-YYYYMMDD.sql`.
- [ ] **Sahip:** CC (n8n cron) → Kaan (hedef seçimi)

**İlk yedekten önceki gövde — olduğu gibi durur:**

- [ ] ~~**Sahip:** Kaan (Railway)~~
- **Risk:** 122+ konuşma, `ocak_gizli` secret'ları, **tek volume**. Kaybı geri alınamaz.
- **Çözüm:** Railway'de günlük yedek açılabiliyor — açılmadı.

## B125 — Kriz WhatsApp şablonu onaylı değil → ⚠ ONAYLANDI AMA **MARKETING**'E DÜŞÜRÜLDÜ (22 Ağu)

- ⚠ **Borç kapanmadı, şekil değiştirdi.** `ocak_kriz_devri` şablonu gönderildi; Meta
  *"utility yönergelerine uymuyor"* diyerek kategoriyi **Utility değil Marketing** yaptı.
- ⚠ **Sonuç ciddi:** Marketing şablonları 24 saat penceresi dışında **ulaşmayabilir** —
  şablonun **varlık sebebi tam olarak buydu.** Kategori yanlışken borç fiilen açık sürüyor.
- **Request review gönderildi (22 Ağu).** Formda **metin alanı çıkmadı**, itiraz gerekçesiz gitti.
- **İtiraz penceresi: 22 Ekim 2026.** Reddedilirse: metni daha kuru yazıp yeniden gönder.
- [ ] **Sahip:** Kaan (Meta) — itiraz takibi
- **Sorun:** Meta 24 saat penceresi kapalıyken mesaj gitmiyor. Kriz devri tam da pencere kapalıyken
  gerekebilir.
- **Çözüm:** Utility kategorisinde onaylı şablon. **Onay birkaç gün sürüyor — erken başlat.**
- **Bağ:** KARAR 532 (kriz hattı) bu şablon olmadan yarım çalışıyor; mail ayağı duruyor, WA ayağı düşüyor.

## B126 — Kriz WA hatası sessiz → ⚠ KOD YAZILDI (22 Ağu), **GERÇEK BAŞARISIZLIKLA SINANMADI**

- ⚠ **Borç kapanmadı, test ayağına indi.** `Devir Mail` node'u yeniden yazıldı. Üç değişiklik:
  1. **Erken `return` kaldırıldı.** `RESEND_API_KEY` yoksa fonksiyon **en başta** duruyordu —
     yani mail anahtarının yokluğu **kriz WhatsApp'ını da öldürüyordu.** İki bacak bağımsız
     olmalıydı, değildi.
  2. **WA sonucu maile yazılıyor.** Hangi numaraya gitti, gitmediyse neden. `131047`
     (24 saat penceresi kapalı) okunur cümleye çevriliyor. Konu satırında `· WA GİTMEDİ` uyarısı.
  3. **Krizde mail de düşerse `throw`** → `OCAK · Hata` devreye girer. Kriz devrinde iki
     bacağın birden sessizce ölmesi artık imkânsız.
- ⚠ **Kalan iş — test.** Kod gerçek bir başarısızlıkla denenmedi. Yordam: `OCAK_KRIZ_WA`'ya
  **bota hiç yazmamış** bir numara ekle → kendine kriz mesajı at → mailde kırmızı satır ve
  konuda `· WA GİTMEDİ` görünmeli. İkinci düzeltme de sınanmadı: `RESEND_API_KEY` yokken
  kriz WhatsApp'ının yine de denenmesi.
- [ ] **Sahip:** ~~CC (n8n)~~ → **Kaan** (test)
- **Sorun:** kriz WhatsApp gönderimi patlarsa yalnız n8n log'una yazıyor. Kimse bakmıyor.
- **Bağ:** KARAR 525 (sessiz kırılma yasağı) bu noktada uygulanmamış — tam da o kararın yasakladığı şey.

## B127 — Token maliyeti ölçülmedi ✅ KAPANDI (22 Ağu, panelin maliyet sekmesi)

- [x] **Kapanış:** **KARAR 536.** Panelin maliyet sekmesi ölçümü **tek ekranda** veriyor —
  günlük/kanal/model kırılımı, konuşma ve çağrı başına bedel, cache tasarrufu.
- **Ölçüm (22 Ağu, 79 çağrı):** toplam **$1.58** · çağrı başına **$0.0171** ·
  **cache okuma oranı %71** · kanal kırılımı WhatsApp %93 / Instagram %7.
  Anthropic Console'un Sonnet 4.6 satırıyla aynı büyüklükte.
- **Cache disiplini (KARAR 527) işe yarıyor** — sorunun aslı buydu, cevaplandı.
- ⚠ **Hesabın iki girdisi artık `ocak_gizli`'de** (KARAR 540): model fiyatları + USD/TRY kuru.
  Panelin kontrol sekmesinden düzenlenir, deploy gerekmez.
- ⚠ Console'un toplam rakamı ($1.91, 30 gün) botun değil **tüm hesabın** — Opus 5 ve
  Haiku 4.5 kullanımı da içinde. İki rakam **karşılaştırılabilir değil.**
- ⚠ **Kapanışın dışında kalan ayak: günlük tavan alarmı yok.** Ölçüm var, eşik yok —
  o iş **B133**'e (panel v2) yazıldı.

**Kapanıştan önceki gövde — olduğu gibi durur:**

- [ ] ~~**Sahip:** CC~~
- **Ölçüm:** `ortak` blok ~20.500 karakter (~7-8 bin token). Yetenek Evreni'ndeki **3.740 token**
  ölçümü bayat — o ölçüm bugünkü bloğu görmedi.
- **Neden önemli:** `ortak` cache'li, `kisisel` cache'siz (KARAR 527). Maliyet ölçülmeden cache
  disiplininin işe yarayıp yaramadığı bilinemez.

## B128 — İdempotans yok — Meta retry'da çift cevap, çift ücret

- [ ] **Sahip:** CC (n8n)
- **Sorun:** Meta webhook'u retry ederse bot ikinci kez cevap veriyor; kadın iki mesaj alıyor, ücret iki kez çıkıyor.
- **Çözüm:** `wamid` bazlı idempotans.
- **Kardeş borç:** `/api/davet` idempotansı da işlevsiz (aynı e-posta tekrarında tetiklenmiyor,
  Notion hatasında `false` dönüyor) — **B130**.

## B129 — Bot dili: iç mekanizma sızıntısı

- [ ] **Sahip:** Kaan/Advaita (prompt sayfası) → CC (kod tarafı)
- **Sorun:** *"Sistem bana göstermiyor"* gibi cümleler kadına gidiyor. Bot kendi iç mekanizmasını anlatıyor.
- **Bağ:** KARAR 57 Bot Davranış Kuralları — bot kendini gizlemez ama iç mekanizmasını da anlatmaz;
  ikisi ayrı şey. Marka dili turu ile birlikte yürütülür.
- **Ders (KARAR 525 turundan):** modele "şunu yazma" demek yetmiyor — model başka bir şey uyduruyor.
  Kalıcı çözüm koda alınır, prompt'a bırakılmaz.

## B130 — `/api/davet` idempotansı işlevsiz

- [ ] **Sahip:** CC
- **Ölçüm (22 Ağu, `api/davet.ts:50-69`):** aynı e-posta + son 24 saat sorgusu **hiç tetiklenmiyor** —
  saldırı her turda farklı alıcıya gittiği için pencere hiç dolmadı. Ayrıca Notion sorgusu hata
  verirse fonksiyon `false` dönüyor (bilinçli fail-open) → idempotans o durumda hiç yok.
- **Neden bugün kapatılmadı:** `brief-davet-honeypot` kapsamı dışıydı, bilinçli ertelendi.
- **Bağ:** KARAR 242 (çift-sayım ruhu) bu uçta fiilen uygulanmıyor. B128'in kardeşi.

## B131 — `00-durum.md` tavanı dolu — bot bölümü yazılamadı

- [ ] **Sahip:** CC
- **Ölçüm (22 Ağu):** `00-durum.md` **195/200 satır** (tavan KARAR 457). Bu turun bot paragrafı
  ~10 satırdı; yazılsa tavan aşılacaktı.
- **Ek sorun:** dosyada **bot için ayrılmış blok yok** — bot bilgisi sekiz ayrı satıra dağılmış
  (30, 71, 95, 102, 110-111, 141, 171, 192), üçü farklı `##` başlığının altında. "Bot bölümünü
  güncelle" diye bir işlem tanımlı değil.
- **Karar (Kaan, 22 Ağu):** brief §4 **iptal**, yerine bu borç açıldı. Bot gerçeği
  `20-ref-bot.md`'de tam hâliyle duruyor; `00-durum.md` ona referansla bırakıldı.
- **Çözüm iki adımlı:** (a) tahliye — en eski dönem bloğu kronolojiye **iner**, silinmez
  (KARAR 61); (b) boşalan yerde bot için tek blok açılır.

## B132 — Davet akışı koruma katmanları (KARAR 535'ten devir)

- [ ] **Sahip:** CC (kod) → Kaan (doğrulama)
- **Kaynak:** KARAR 535 üç şart koşuyordu; **KARAR 537** ile ertelendi, iptal edilmedi.
- **Üç madde:** **Cloudflare Turnstile** · **IP başına hız sınırı** ·
  **davet edenin kendi adresini doğrulaması.**
- **Akış şu an şartsız açık** (B121 ✅). Mevcut korumalar: musluk + Origin + honeypot +
  zaman damgası (`a5ade5a`). Bunlar **rastgele bot trafiğini** keser; üç şart **hedefli**
  saldırıya karşıdır. Fark bilinerek üstlenildi.
- **Gerekçe (KARAR 537):** 31 Ağustos lansmanında davet halkası eksik kalamaz.
- ⚠ **Anormallik belirtisi:** Notion Davetler DB'de ani kayıt artışı, Resend kota uyarısı.
  Görülürse **`DAVET_AKISI=kapali` + redeploy** — iki dakika.

## B133 — Panel v2

- [ ] **Sahip:** CC (n8n)
- **Kaynak:** B123 ✅ kapanışının artığı (KARAR 536).
- **v1'de olan:** sohbet listesi · konuşma görünümü · kanal süzgeci · arama · WhatsApp'ta aç ·
  maliyet analizi · bot aç/kapa · fiyat/kur düzenleme · marka kimliği · `panel.ocak.biz` ·
  parametrik `AYAR` bloğu.
- **Eksikler:** kriz işareti (devredilen konuşmalar listede ayırt edilmiyor) · otomatik
  yenileme yok · 1000/5000 satır tavanı · tarih aralığı süzgeci yok ·
  ⚠ **günlük maliyet tavanı/alarmı yok** (B127 ✅ ölçümü verdi, eşiği vermedi).
- **Sıradakiler:** okunmamış/son bakılan işareti · ödeme durumu rozeti (`odeme_durumu`) ·
  Kayıtlar DB eşlemesi (telefon yerine isim) · not alanı · tek konuşmayı dışa aktarma ·
  Advaita için ikinci token (`PANEL_TOKEN_2`) · günlük özet · bot dili sızıntısı taraması ·
  mobil düzen · silinme yordamı (KARAR 57 md. 4) · lansman sıfırlaması sonrası boş durum kopyası.
- ⚠ **Çoğaltma denenmedi.** `AYAR` bloğunun yeterliliği **ikinci bir kurulum yapılmadan
  bilinemez.** Kurulum notu da yazılmadı.

## B134 — `IG Gönder` sessiz kalıyor

- [ ] **Sahip:** CC (n8n)
- **Sorun:** node'da **"Continue On Fail" açık** — Meta hatası yutuluyor, workflow **yeşil**
  yazıyor.
- ⚠ **22 Ağustos'ta tam da bu yüzden saatler kaybedildi.** Node hiç çalışmamış gibi
  görünüyordu; gerçekte **üç ayrı hata** veriyordu ve hiçbiri yüzeye çıkmıyordu.
  `IG Bot` "no items" diyordu; teşhis oradan başladı, hata mesajına ulaşmak saatler aldı.
- **Çözüm:** kriz WA'da yapılanın aynısı (B126) — hata `OCAK · Hata`ya bağlanmalı ya da
  en azından bir yere yazılmalı.
- **Bağ:** KARAR 525 (sessiz kırılma yasağı). B126'nın kardeşi, aynı sınıf.

## B135 — `Secrets` node'ları ölü

- [ ] **Sahip:** CC (n8n)
- **Ölçüm (22 Ağu):** `OCAK · Instagram`'daki `Secrets` node'u **üç alanı da boş** döndürüyordu.
  `ig_user_id` oradan bekleniyordu; boş gelince URL `//messages` oluyordu.
- **Yapılan:** `IG Gönder` ve `IG Bot` artık doğrudan `$env` okuyor (KARAR 538 turu).
  Node zincirde **duruyor ama hiçbir şey üretmiyor.**
- ⚠ **Silinmeden önce:** `Bağlam Üret` son çare olarak `$('Secrets')` referansı taşıyor
  (`20-ref-bot.md` §4). **Node silinirse o referans patlar.** Önce referans, sonra node.

## B136 — `Referans No` property'si Kayıtlar'da yok

- [ ] **Sahip:** CC
- ⚠ **Önceki brief yanlış yazmıştı, CC düzeltti.** `Kadın` property'si Kayıtlar'da **var**
  (`api/kayit.ts:259-263`, `rich_text` olarak yazılıyor). Kırık olan **`Referans No`** —
  o property Kayıtlar DB'de yok, referans `Kayıt ID` title'ının içinde yaşıyor.
- **İki ayrı property, iki ayrı iş.** Tek satır olarak yazılsaydı yanlış şey düzeltilirdi.
- **Ders:** brief'in iddiası dosyanın gerçeğiyle çelişince durup raporlamak doğru refleks
  (KARAR 102).

## B137 — `/odeme/tamam` davet dalı doğrulanamıyor

- [ ] **Sahip:** CC → Kaan
- **Sorun:** `KART_AKISI` kapalı (KARAR 488), sayfa 404. Davet kutusunun o daldaki davranışı
  **sınanamadı** — B121 uçtan uca testi bu dalı kapsamıyor.
- **Tetikleyici:** kart akışı açıldığında ayrıca test edilecek.

## B138 — Secret hijyeni

- [ ] **Sahip:** Kaan
- **Bu turda sohbete giren değerler:** `PANEL_TOKEN` (iki kez — biri rotate edildi) ·
  **Postgres bağlantı dizesi (şifre dahil)** · `OCAK_IG_TOKEN` (ekran görüntüsünde).
- ⚠ **Postgres şifresi rotate edilirse n8n credential'ı da güncellenmeli** — yoksa bot durur.
  Bilinçli karar olsun, unutulmasın.
- ⚠ `PANEL_TOKEN` bookmark'ta duruyor; Safari iCloud senkronu açıksa **tüm cihazlara gider.**
  Kabul edilebilir ama bilinsin.
- **Bağ:** KARAR 469 — sır dokümanda yaşamaz. Bu defterde yalnız **hangi değerin sızdığı**
  yazılıdır, değerin kendisi değil.

## B139 — V03–V09'un `--no` listeleri Gün 0 derslerini içermiyor ✅ KAPANDI (24 Ağu, brief `ocak-brief-b139`)

- [x] **Kapanış:** **Dokuz prompt gövdesi çalıştırılan hâliyle Bölüm 16'ya yazıldı** —
  `--sref` dolduruldu, `--v 8.1` ve `--chaos 5` eklendi, `--no` listeleri genişletildi,
  V03 gövdesi kadraj patch'iyle değiştirildi. **V05–V09 yazılı ama üretimde sınanmadı.**
  Ölçüm (9/9 satır, `python3` yapısal denetim): `--v 8.1` 9/9 · `--chaos 5` 9/9 ·
  gerçek `--sref` 9/9 · `--sw` 60×8 + **50×1 (V05)** · `--ar` 4:5×8 + **9:16×1 (V08)** ·
  `--stylize` 90/110/130/110/100/120/110/100/110 · `--no` öğe sayısı **12–22** (virgülle
  ayrılmış kuyruk sayımı). `--sref KURUCU-URL` → **0**.
- ⚠ **Borcun asıl büyüklüğü ancak kapanırken görüldü.** Kalem *"`--no` listeleri eksik"*
  diye açılmıştı; gerçekte **z01–z11'i üreten promptların hiçbiri korpusta yoktu.**
  On bir zeminin hiçbiri dosyadan yeniden üretilemiyordu. Düzeltilmiş set 23–24 Ağustos
  MJ oturumunda **sohbette verildi ve MJ'de çalıştırıldı, ama dosyaya hiç yazılmadı** —
  sonra da kapandığı varsayıldı (patch §3/§6(b), **B184**).
- **Ders:** *sohbette verilen şey uygulanmış sayılmaz.* Bir prompt "çalıştı" ile "korpusta"
  iki ayrı durumdur; ikincisi olmadan üretim **tek seferliktir.**
- **Yan kazanç — B141/B170'in bir ayağı kapandı:** kurucu `--sref` URL'i artık **repoda
  yazılı** (`z01` = `b6457637-7065-4c39-b551-268b156c9408/0_2`, `31-zemin.md` ile çapraz
  doğrulandı). ⚠ **Görsel yedeği hâlâ yok** — URL kayıtlı, dosya değil; CDN düşerse çapa
  yine ölür (B141'in kendi notu).
- **Açılışındaki hâli:** Sahip Claude.ai · **Tetikleyici:** o promptların ilk kullanımı
- **Belirti:** V01 ve V02 23 Ağustos seansında üç tur harcanarak düzeltildi; **V03–V09 aynı
  tuzakları taşıyor** — özellikle V04 *"fire bowl"*, V08 *"campfire"*, V09 *"low flame"*:
  üçü de modelden alev talep ediyor.
- **Malzeme:** altı elenen turun teşhisi `_arsiv/2026-08-23-devir.md` §4'te — "ember glow"
  + "charcoal" birlikte alev/lav/volkan üretir · "room" pencere çizdirir · "hairline cracks"
  çatlamış toprak verir · "underexposed" tek başına soğuk gri belgesel verir ·
  `--no sparks` karedeki tek sıcak öğeyi siler · **yasak liste kelimeyi engeller, kavramı
  engellemez** ("heat seeping out" yazıldığı sürece `--no fire` alevi durdurmaz).
- **Boyut:** tek tur işi — ama **kart basılmadan** yapılmalı, yoksa aynı üç tur her prompt
  için tekrarlanır.
- **Bağ:** KARAR 542 · `30-sosyal.md` Bölüm 16. ⚠ Bölüm 16'nın V01–V09 tam set değişimi
  (ADIM 3d) bu borçtan **ayrıdır** — o `KURUCU-URL` + `--v 8.1` + hex işidir, bu `--no` işidir.

## B140 — C01 kartının ikinci satırı dosyada italik, derleyicide değil

- [ ] **Sahip:** Claude.ai · **Küçük.**
- **Belirti:** `30-sosyal.md` C01 bindirmesi — *"İçindeki ateş sönmedi. / **Üstü küllendi
  sadece.**"* — ikinci satır italik işaretli, birincisi düz. Derleyici tek stil uyguluyor,
  ikisini de italik basıyor.
- **Neden acil değil:** iki kademe farkı **puntoyla** kuruluyor (KARAR 545, alt blok 0.62);
  kart bozulmuyor.
- **Kapanış şartı:** ayrım gerçekten gerekirse derleyiciye satır bazlı stil eklenir.

## B141 — Kurucu ve C01 zemini yalnız MJ CDN'inde + yerel diskte

- [ ] **Sahip:** Kaan · **Küçük ama kritik.**
- **Belirti:** iki çapa görsel — `--sref` kurucusu ve C01 kart zemini — kalıcı bir yerde
  yedekli değil. URL'ler `_arsiv/2026-08-23-devir.md` §2'de.
- ⚠ **Otuz günlük görsel sistemin tamamı kurucu URL'ine bağlıdır** (KARAR 542). CDN
  erişilemez olursa yeniden yükleyip yeni URL üretmek gerekir — ve `--sref` çapası değişince
  seri tutarlılığı kaybolur.
- **Kapanış şartı:** kalıcı bir yere kopya (Drive / repo `public/`).
- **Yedeklenecek URL'ler ve soy ağacı:** `docs/_arsiv/2026-08-23-mj-kayit.md`
- ⚠ **Yedek çapanın ölmesini çözmüyor.** Yerel yedek görseli kurtarır ama `--sref` **canlı
  URL** istiyor. Kurucu URL düşerse yeniden yükleyip yeni URL üretmek gerekir; o an seri
  tutarlılığı riske girer. **MJ'in CDN kalıcılık politikası araştırılmadı** — sonraki
  görsel turunun ilk sorusu.

## B142 — `02-borclar.md`'de kapanış konvansiyonu tek biçim değil

- [ ] **Sahip:** CC · **Tetikleyici:** bir sonraki arşivci turu · **tek tur işi**
- ⚠ **Bir sonraki arşivci turunun İLK maddesi** — on beş kapanmış borç açık kutu taşıyor,
  defter yanlış bilgi veriyor.
- **Belirti:** kapanmış bir borcun `Sahip:` satırı üç farklı biçimde yaşıyor —
  `- [x] **Sahip:**` · `~~üstü çizili~~` · **ve kutusu hâlâ açık** `- [ ] **Sahip:**`.
  Üçüncüsü sadece tutarsız değil, **yanlış bilgi**: kapanmış borç açık kutu taşıyor.
- **Ölçüm (23 Ağu, `02-borclar.md` 2379 satır):** `^## B.*KAPANDI` eşleşen **32 başlık**;
  her başlığın **ilk 8 satırlık** penceresinde `Sahip:` satırı aranınca → **8** `[x]` ·
  **15** açık kutu · **9** pencerede `Sahip:` satırı yok. Dosya genelinde üstü çizili
  `Sahip` satırı **4**. *Yöntem: `grep -n "^## B.*KAPANDI"` + satır ofseti, elle takip;
  8 satırdan uzun girdilerde `Sahip:` pencerenin dışına düşmüş olabilir — "9 yok"
  rakamı üst sınır değil, o pencerenin ölçümüdür.*
- **İş:** tek biçime indir. Öneri `- [x] **Sahip:**` — çoğunluk o ve kutu durumu
  borcun durumunu doğru söylüyor. **Mekanik dönüşüm**, semantik iş değil; KARAR 61
  gereği ayrı commit'te yürür.
- **Bağ:** 23 Ağustos arşivci turunda doğdu — o tur `[x]` kullandı, bir önceki tur
  `~~...~~` kullanmıştı. Karıştırmamak için o turda **dokunulmadı**, borç açıldı.

## B143 — Kart derleyici Google Fonts'a bağlı; fontlar gömülü değil

- [ ] **Sahip:** Kaan + Claude.ai
- **Belirti:** `tools/ocak-kart-derleyici.html` "tek başına çalışır" sayılıyor — build ve
  paket bağımlılığı gerçekten yok, `fetch`/XHR sıfır. Ama dosya **dört Google Fonts linki**
  taşıyor (`fonts.googleapis.com` · `fonts.gstatic.com`, aileler **Cormorant Garamond**
  ve **Jost**). Ölçüm 23 Ağu: dosyadaki toplam `http(s)://` geçişi 4, dördü de font.
- ⚠ **Sessiz kırılma:** çevrimdışı ya da fontlar yüklenmeden basılan kart, Cormorant
  yerine tarayıcının yedek fontuyla çıkar. Kart görsel olarak "çalışır" görünür —
  **fark edilmeden yayına gidebilir.** Marka tipografisi kartın kimliğidir.
- **Çözüm:** font dosyalarını **base64 gömme** (`@font-face` + `data:` URI). Dosya
  büyür ama araç gerçekten tek parça olur — Safari `file://` kısıtı zaten aynı yönü
  gösteriyordu (ön ayarlar da bu yüzden gömülü).
- **Bağ:** B86 ✅ / B114 ✅ kapanışlarının taşıyıcısı bu araç; KARAR 543 · 544 · 545
  kart standardını buraya yazıyor.

## B144 — Çember karakter bandı geçersiz; bekçi yanlış hedef gösteriyor

- [ ] **Sahip:** Claude.ai · **Tetikleyici:** bir sonraki Çember gövdesi yazımı · **acil**
- **Belirti:** bekçi bandı **`3.824–4.113`** diyor; 23 Ağustos yeniden yazımından sonra dört
  Çember gövdesinin gerçeği **`3.480–3.771`**. Bant **344 karakter yukarıda** — yeni gövde
  bu banda uydurulursa **yanlışlıkla şişirilir.**
- **Ölçüm (23 Ağu, kaynak seans, `python3 len()` code point, canlı Notion `Detay`):**
  `ekmeden-once` 3505 · `elin-neyle-dolu` 3771 · `hangi-tohumu-ekeceksin` 3480 ·
  `neyi-bekliyorsun` 3720.
- ⚠ **24 Ağu tazelemesi:** `hangi-tohumu-ekeceksin` 3480 → **3472** (−8, KARAR 562 kıtlık
  mantığı çıktı). **Geçerli Çember bandı `3.472–3.771`.** Slug'lar da değişti (KARAR 560):
  `ellerin-dolu-2026-09-09` 3771 · `yer-acmak-2026-09-23` 3505 ·
  `hangi-tohumu-ekeceksin-2026-09-30` 3472 · `neyi-bekliyorsun` 3720 (**tarih eki yok**, B175). *`awk length` kullanılmadı — bu makinede bayt sayıyor.*
- **Eski bandın geçtiği üç yer** (arşivci turu ölçümü, `grep -rn "3\.824"`):
  `SKILL.md:188` · `ornekler-cember.md:186` · `ornekler.md:201`. **Üçü birden** değişir.
- **Bağ:** KARAR 547 · 549 (kesimler bandı düşürdü) · **B147** · **B148**

## B145 — Açık Kapı karakter bandı bayat

- [ ] **Sahip:** Claude.ai · **Tetikleyici:** bir sonraki Açık Kapı gövdesi yazımı
- **Belirti:** bekçi bandı **`3.019–3.247`**; 23 Ağustos sonrası gerçek **`3.036–3.264`**.
  Sapma küçük (alt uç +17, üst uç +17) ama **ölçülmüş bir bandın yanına ölçülmemiş bir bant
  koymak** bandın otoritesini bitirir.
- **Ölçüm (23 Ağu, kaynak seans):** `bir-esikte-duruyorsun` 3226 · `bu-ses-kimin` 3212 ·
  `dusundugum-hissettigim-yaptigim` 3049 · `istek-mi-ihtiyac-mi` 3118 · `kokun-nerede-kaldi` 3036 ·
  `nereye-kadar-senin` 3264.
- ⚠ **24 Ağu tazelemesi — bandın İKİ UCU birden kaydı.** `kokun-nerede-kaldi` tam çerçeve
  yeniden yazımıyla `ates-seninle-geldi-2026-09-03` oldu: 3036 → **3330** (+294, tavanı kırdı) ·
  `dusundugum-hissettigim-yaptigim` 3049 → **3044** (−5, tabanı indirdi).
  **Geçerli Açık Kapı bandı `3.044–3.330`.**
  *Tek bir gövdenin yeniden yazımı bandı iki yönde birden bozabilir — bant altı gövdenin
  uçlarıdır, ortalaması değil.*
- **Yer:** `SKILL.md:187` · `ornekler.md:195`
- **Bağ:** **B144** ile aynı yazımda kapanır.

## B146 — Seremoni ve Atölye için karakter bandı yok

- [ ] **Sahip:** Claude.ai · **Tetikleyici:** Seremoni ya da Atölye bekçisi yazımı
- **Belirti:** `SKILL.md:214` *"Seremoni · Atölye · Mini Retreat · Şehir Akşamı bekçileri
  henüz yok"* diyor. Artık **ölçülmüş gövde var**, bant üretilebilir.
- **Ölçüm (23 Ağu):** Seremoni **`3.605–3.686`** (`kakao-seremonisi-online` 3605 ·
  `hasat-ve-sukran` 3672 · `kakao-seremonisi-yuzyuze` 3686) · Atölye **`4541`**
  (`rituel-tasarimi`, **tek gövde — bu bir bant değil, tek noktadır**).
- ⚠ **Atölye "bandı" yazılırken tek gövdeden türediği yazılmalı.** Tek nokta bant gibi
  sunulursa sonraki Atölye gövdesi 4541'e zorlanır.
- **Bağ:** **B144** · **B145** · gölge satır uyarısı **B154**

## B147 — `ocak-etkinlik` SABİT BLOKLAR bölümü bayat — dört blokta değişiklik var

- [ ] **Sahip:** Claude.ai · **Tetikleyici:** bir sonraki etkinlik gövdesi yazımı · **acil**
- **Belirti:** `SKILL.md:74` *"DÖRT SABİT BLOK — dört sayfada birebir aynı"* bölümü
  23 Ağustos kesimlerinden **önceki** hâli tarif ediyor. Skill bu hâliyle çağrılırsa
  **kaldırılan cümleleri geri yazar.**
- **Değişiklik listesi** (birebir kesim tablosu): `90-kronoloji/2026-08.md`, 23 Ağustos
  Advaita yorum turu kaydı, *"Sabit blok değişiklikleri"* bloğu. Dört blokta değişiklik:
  tüm Açık Kapı + Çember ortak cümlesi · Açık Kapı tavsiye cümlesi ve kayıt maddesi ·
  Çember pas turu ve kapı cümlesi · Seremoni kayıt ve Pratik Bilgi satırları.
- **Bağ:** KARAR 547 · 549 · **B148**

## B148 — `ornekler.md` ve `ornekler-cember.md` yeni gövdelerden yeniden üretilsin

- [ ] **Sahip:** Claude.ai · **Tetikleyici:** **B147** ile aynı tur
- **Belirti:** iki bekçi dosyası (`ornekler.md` 207 satır, Açık Kapı · `ornekler-cember.md`
  198 satır, Çember) 18 Ağustos gövdelerinden türetildi. O gövdelerin **on tanesi**
  23 Ağustos'ta yeniden yazıldı.
- ⚠ **Bekçi bayatlarsa sessizce zarar verir:** hata vermez, sadece yeni gövdeyi eski hâle
  çeker. Bant (**B144/B145**) yalnız uzunluğu koruyor; **cümleleri koruyan bu iki dosya.**
- **Kapanış şartı:** iki dosya canlı Notion gövdelerinden yeniden türetilir, künyeye
  ölçüm tarihi + yöntem yazılır.

## B149 — "Notion tek parçada 2.000 karakter taşır" notu yanlış ya da eksik

- [ ] **Sahip:** Claude.ai
- **Belirti:** `SKILL.md:190` *"Notion rich text tek parçada 2.000 taşır; yapıştırdıktan
  sonra son satırın yerinde olduğu kontrol edilir, yoksa sessizce kırpılmıştır"* ·
  `ornekler-cember.md:193` *"Gövde Notion'un tek parça 2.000 karakter sınırının iki katı"*.
- **Karşı ölçüm (23 Ağu, kaynak seans):** **API yazımıyla 5.203 karakter tek parçada gitti,
  kırpılmadı.** Sınır API yolunda geçerli değil.
- **İş:** not ya **kaldırılır** ya *"elle yapıştırma yolu"* diye **daraltılır**. İkinci
  seçenek tercih edilirse yol adı açıkça yazılır — hangi yolda geçerli olduğu söylenmeyen
  bir sınır, geçerli olmadığı yolda korkuya dönüşür.
- ⚠ **Daraltmadan önce elle yapıştırma yolunda gerçekten kırpıldığı ölçülmeli.** İki yolun
  ikisi de ölçülmeden not yeniden yazılırsa aynı sınıf hata tekrar eder.
- **Bağ:** KARAR 550

## B150 — KARAR 550 (property yazım protokolü) skill'e yazılsın

- [ ] **Sahip:** Claude.ai · **Tetikleyici:** **B147** ile aynı tur
- **Belirti:** protokol — **kabukta kur → `python3 len()` ile ölç → yaz → geri okunan
  uzunluğu karşılaştır** — 23 Ağustos'ta doğdu ve o gün bir hatayı yakaladı (`yerleşemmiş`,
  −2 sapma). `ocak-etkinlik` skill'inde **yok**.
- **Yazılırken korunacak iki gerekçe:** (a) `Detay` bir **text property**'dir,
  `update_properties` alanın **tamamını** değiştirir — `old_str` güvenliği yoktur ·
  (b) sayfa gövdesi (`update_content`) **cerrahiye izin verir**, orada bu risk yok.
  İki yüzeyin farkı yazılmazsa protokol gereksiz yere sayfa gövdesine de uygulanır.
- **Bağ:** KARAR 550 · KARAR 459

## B151 — Kaçış artığı taraması skill'e yazılsın

- [ ] **Sahip:** Claude.ai · **Tetikleyici:** **B147** ile aynı tur
- **Belirti:** 23 Ağustos'ta `uykudan mu0131` gövdeye girdi — `ı` yerine `u0131`
  yazılmıştı. Tarama yakaladı ama tarama **skill'de kayıtlı değil**, o gün elle kuruldu.
- **Desen:** `LIKE '%u0131%' OR '%u015%' OR '%u011%'`
- ⚠ **Desen gevşek yazılırsa yanlış alarm verir.** Aynı gün `%Pas%` deseni *"ku**pas**ını"*
  içine düştü — SQL `LIKE` büyük/küçük harf duyarsızdır. Desen skill'e yazılırken **bu vaka
  da yazılır**, yoksa bir sonraki yazan deseni gevşetir.
- **Bağ:** KARAR 550 · **B150** (aynı ağın iki farklı gözü)

## B152 — Sayfalar DB `Son Güncelleme` property'si elle bakılıyor ve yalan söylüyor

- [ ] **Sahip:** Kaan · **Notion şema işi**
- **Belirti:** Sayfalar DB'sinin `Son Güncelleme` alanı **elle** güncelleniyor ve
  güncellenmiyor: `/araclar` **üç ay geride**, `/advaita` **boş**. Alan bir tazelik sinyali
  olarak okunuyor — **yanlış sinyal veriyor.**
- **Çözüm:** Notion'un yerleşik **`Last edited time`** tipine çevrilsin. Elle bakım biter,
  alan yapısal olarak doğru olur.
- **Ölçüm** (23 Ağu, arşivci turu, `grep -rn "Son Güncelleme\|Son_Guncelleme" src/`): **`0` eşleşme.**
  Property **koda hiç girmiyor** — tip değişimi kod tarafını kırmaz. *(Not: `gizlilik.astro:343`
  küçük harfle "Son güncelleme: 19 Haziran 2026" taşıyor; bu sayfa metnidir, DB alanı değil.)*
- ⚠ **24 Ağu:** `Son Düzenleme` (`last_edited_time`) property'si **eklenemedi** — onay dönmedi.
  `Son Güncelleme` elle alanı **donduruldu** (artık elle de güncellenmiyor). Silme kararı
  tur sonrasına kaldı. ⚠ **Dondurulmuş alan hâlâ yanlış bilgi veriyor** — kaldırmak ya da
  otomatikleştirmek dışında üçüncü bir hâl yok.
- **Bağ:** **B153** aynı sınıf.

## B153 — Sayfalar DB `Versiyon` property'si aynı sınıf sorun

- [ ] **Sahip:** Kaan · **Notion şema işi**
- **Belirti:** `Versiyon` alanı da **elle bakım** istiyor; bakılmadığında sessizce bayatlıyor.
  `Son Güncelleme` ile aynı kusur — insan disiplinine bağlı meta veri.
- **Ölçüm** (23 Ağu, `grep -rn "Versiyon" src/`): **`0` eşleşme.** Kod tüketmiyor.
- **Karar gerekiyor:** alan **gerçekten kullanılıyor mu?** Kod okumuyor, elle de bakılmıyorsa
  seçenek ikidir — otomatikleştir ya da **kaldır**. Üçüncü seçenek (bakımsız bırakmak) şu
  anki hâldir ve **yanlış bilgi üretiyor.**
- ⚠ **24 Ağu:** `Versiyon` da **donduruldu**, B152 ile aynı gerekçe ve aynı bekleyiş.
- **Bağ:** **B152** ile aynı turda karara bağlanır.

## B154 — Gölge satır `Ritüel Tasarımı | Gölge 0210 o#2` Detay'ı bayat

- [ ] **Sahip:** Claude.ai · **Küçük · bilerek dokunulmadı**
- **Belirti:** Etkinlikler DB'de takvim amaçlı bir gölge satır var; `Detay` gövdesi
  **4.904 karakter**, asıl satır 23 Ağustos'ta **4.541**'e indi. Gölge **363 karakter bayat**
  — tam olarak Atölye formatının o günkü net değişimi.
- **Neden acil değil:** satır **yayında değil**, takvim amaçlı. Bilerek dokunulmadı.
- ⚠ **Neden yine de borç:** bayat gövde bir gün asıl sanılabilir; ayrıca **B146**'nın Atölye
  ölçümü bu satıra çarparsa yanlış bant üretir (4.904 vs 4.541).
- **Kapanış şartı:** ya senkronlanır ya `Detay` boşaltılıp *"gölge — gövde asıl satırdadır"*
  işaretçisi konur.

## B155 — `10-marka.md` "Yoga ve nefes (Rishikesh YTT)" — eğitim Sivananda kökenli

- [ ] **Sahip:** Claude.ai · **Tetikleyici:** `10-marka.md` bir sonraki dokunuşu
- **Belirti:** `10-marka.md:24` Modaliteler satırı *"Yoga ve nefes (Rishikesh YTT)"* diyor.
  **Advaita:** eğitim **Sivananda kökenli**, ve *"belirtmeye gerek yok"*.
- **Durum:** **sitede kaldırıldı** (`/araclar` zaten yapılmıştı, `/advaita` künyesinde
  "Rishikesh'te aldığı" 23 Ağu'da çıktı) — **korpusta duruyor.**
- ⚠ **`/hikaye`'deki "Rishikesh'in yoga bedeni" bu borca dahil değildir.** Orada
  Advaita'nın eğitiminden değil **coğrafi bir gelenekten** söz ediliyor; itiraz künyeye aitti,
  bilerek dokunulmadı (23 Ağu raporu).
- **Ölçüm (23 Ağu, arşivci turu):** `grep -n "Rishikesh" docs/10-marka.md` → **1 satır (24).**
- ⚠ **`10-marka.md` KARAR 471 kapsamındadır** — repo otorite, project files kopyası ayna.
  Dokunuş sonrası ayna elle tazelenir.

## B156 — `10-marka.md` "Beşli kültürel sentez" satırı KARAR 299 ile süperselendi ama duruyor

- [ ] **Sahip:** Claude.ai · **Tetikleyici:** **B155** ile aynı tur
- **Belirti:** `10-marka.md:52` — *"**Beşli kültürel sentez:** Güney Amerika + Doğu/Hint +
  Nordik + Mısır/Akdeniz + Türk/Anadolu kadim kökler."* **KARAR 299** (5 Tem, KALICI) kaynak
  kanonunu *"Dört Yön, Bir Ocak"*a çevirdi: **Anadolu kaynak değil, kaptır.** Satır beşinci
  kaynak olarak Anadolu'yu sayıyor — **süperselenmiş fikir marka çekirdeğinde yaşıyor.**
- **Ölçüm (23 Ağu):** `grep -n "Beşli"` → **1 satır (52).** Doğrulandı.
- **Bağ:** KARAR 299 · **B157** (aynı dosya, aynı fikir) · **B159** (aynı fikir, kod tarafı)
- ⚠ *Bu üçü tek bir kusurun üç yüzüdür: kanon değişti, taşıyıcıları değişmedi.*

## B157 — `10-marka.md` giriş notu kendi dosyasını yanlış tarif ediyor

- [ ] **Sahip:** Claude.ai · **Tetikleyici:** **B156** ile aynı tur
- **Belirti:** `10-marka.md:5` — *"Kaynak kanonu 'Dört Yön, Bir Ocak' (KARAR ADAYI 299) marka
  çekirdeğine dokunmadı — 'beş kadim kaynak'/'hepsini yaşadı' ifadeleri **bu dosyada YOK**,
  site içeriği katmanında yaşar."*
- **Ölçüm (23 Ağu, arşivci turu):** iddia **birebir doğru, kavramsal olarak yanlış.**
  `grep -n "beş kadim"` → yalnız satır 5'in kendisi; dize gerçekten yok. **Ama aynı fikir
  satır 52'de duruyor** (**B156**). Not "ifade yok" derken okuyucuya "fikir yok" dedirtiyor.
- ⚠ **İkinci bayatlık:** not 299'u *"KARAR ADAYI"* diye anıyor; ledger'da **KALICI**
  (satır 46). Aday değil, mühürlü.
- **İş:** not düzeltilsin — *birebir ifade yok, fikir satır 52'de duruyordu ve KARAR 299 ile
  düştü* denilsin. Ve "ADAYI" kaldırılsın.

## B158 — `10-marka.md` K4 "Wild Woman Project modelinin OCAK versiyonu" — batı sıfatı itirazıyla çelişiyor

- [ ] **Sahip:** Kaan + Advaita · **karar borcu, mekanik iş değil**
- **Belirti:** `10-marka.md:67` K4 — *"Çember Lideri + İleri Fasilitatör eğitimi.
  **Wild Woman Project modelinin OCAK versiyonu.**"* Advaita'nın 23 Ağustos notu batı
  sıfatlarına duruş istiyor: *"yaban kadın"* · *"womb yoga"* · *"şamanik yoga"* —
  *"Yoganın başına batı sıfatlar getiriyor… Burada bir duruşumuz olmalı."*
- **Ölçüm (23 Ağu, arşivci turu, `grep -rn "Wild Woman"`):** patch bir yer saydı,
  **canlı korpusta iki yer var** — `10-marka.md:67` (*"modelinin"*) ve
  **`20-ref-program.md:25`** (*"Wild Woman Project **büyüme motorunun** OCAK versiyonu"*).
  Ayrıca `_arsiv/ocak-referans-v1.md:289` (arşiv, dokunulmaz).
- ⚠ **Bu bir karar borcudur.** Referans **iç doküman** dilidir, site metni değil — silinmesi
  gerekip gerekmediği Advaita'nın duruş kararına bağlı. **Karar verilmeden mekanik silme
  yapılmaz.**
- ⚠ **24 Ağu: hâlâ açık, ve artık bir sayfa turu boyunca iki kez tespit edildi.**
  23 Ağustos raporunda yakalandı, bugün C-6 kaleminde yeniden çıktı; **iki turda da karar
  verilmedi.** Advaita görüşmesinin kalemi. Çember Rehberliği'nin **neye dayandığı**
  yeniden yazılmalı — KARAR 551 adı değiştirdi, dayanağı değiştirmedi.
- **Bağ:** `/mini-retreat` yaban kadın sorusu (Advaita kuyruğu, `03-sira.md`) aynı karara bakar.

## B159 — `/hikaye` section marker `bes-kadim-kaynak` → `dort-yon-bir-ocak`

- [ ] **Sahip:** CC · **KOD İŞİ — brief gerekir**
- **Belirti:** `/hikaye` sayfasının section marker'ı hâlâ `bes-kadim-kaynak`. Kanon
  **KARAR 299** ile *"Dört Yön, Bir Ocak"*a döndü; marker eski kanonu taşıyor.
- **Ölçüm** (23 Ağu, arşivci turu, `grep -rn 'bes-kadim-kaynak' src/`): **19 eşleşme, 6 dosya.**
  `src/lib/remark-ocak-sections.ts` **7** (yön kanonu yorumu · transform fonksiyonu ·
  iki uyarı mesajı · `data-section` emit'i · `case` dalı) · `remark-ocak-sections.test.ts` **6** ·
  `__snapshots__/remark-ocak-sections.test.ts.snap` **2** ·
  `__fixtures__/fixture-25-bes-kadim-kaynak.md` **1 (+ dosya adı)** ·
  `src/styles/atmosfer.css` **1** (`ocak-bes-kadim-kaynak` genişlik yorumu).
- ⚠ **Patch bunu "marker rename" diye listeledi — değil.** Parser dalı, CSS class'ı, üç test,
  bir snapshot ve **bir fixture dosya adı** aynı işin parçası. Tek satırlık bulup-değiştirme
  **testleri kırar.**
- ⚠ **Notion tarafı ile kod tarafı AYNI commit'te gitmeli** (KARAR 409, `00-durum.md` sessiz
  kırılma listesi): marker adı Notion'da değişip kod eşleşmezse **section haftalarca render
  dışı kalır** ve site bozulmuş görünmez.
- **Bağ:** KARAR 299 · KARAR 409 · **B156** · **B157**

## B160 — Çember Lideri → **Çember Rehberi** rename ✅ KAPANDI (23 Ağu, KARAR 551)

- [x] **Kapanış:** **KARAR 551** mühürlendi — rename yapılıyor, gerekçe **hiyerarşinin
  kaldırılması**; rolün içeriği ve K4 yapısı aynı. Karar Kaan'ın (23 Ağu). Bu bir **karar
  borcuydu**, karar verildi. Kalan mekanik/Notion işi `03-sira.md`'de yaşar.
- **Yapılan (23 Ağu, ayrı commit — mekanik dönüşüm):** canlı `docs/` altındaki **yedi geçiş**
  dönüştürüldü (`10-marka.md` 1 · `20-ref-program.md` 2 · `20-ref-marka.md` 1 ·
  `20-ref-icerik-dili.md` 1 · `Ocak-Mufredat.md` 2). **`_uretilen/site-icerik.md`'ye dokunulmadı** — script çıktısıdır, Notion
  hâlâ *"Lider"* diyor; dönüştürülseydi üretilen dosya **kaynağından ileri giderdi.**
  `_arsiv/` dokunulmadı.
- **Kalan (Sayfalar DB turu, Notion):** `/sen-neredesin` 8. Taşıyıcı · `/ekip`.
- ✅ **Durdurucu çözüldü.** Aşağıdaki `30-sosyal.md:101` uyarısı **doğruydu ama eksikti**:
  o satırın dayandığı **ledger kararı hiç yoktu** (`grep` → 0), ve kronoloji iddiayı
  Temmuz'da **iki kez zaten çürütmüştü** (`2026-07.md:1227` · `:54(b)` — *"karar açık kalır"*).
  Yani kapalı olmayan bir tartışma kapalı ilan edilmişti. Satır KARAR 551'e atıfla düzeltildi.
- [ ] ~~**Sahip:** Claude.ai (korpus) + Kaan (Notion) · **Advaita kararı, 21 Tem notu**~~
- **Belirti:** Advaita: *"Lider değil de… Rehber belki"* (`/sen-neredesin` 8. Taşıyıcı) ve
  21 Temmuz notu: *"Çember liderlik eğitimi → Çember rehberlik eğitimi"*.
- **Ölçüm** (23 Ağu, arşivci turu, `grep -rn "Çember Lideri" src/ docs/`): **29 eşleşme.**
  `src/` → **0** (site metni Notion'da yaşıyor, **kod ayağı yok**) ·
  **canlı `docs/` → 8**: `10-marka.md:67` · `20-ref-program.md:25,48` · `20-ref-marka.md:565` ·
  `20-ref-icerik-dili.md:37` · `30-sosyal.md:101` · `Ocak-Mufredat.md:38,249` ·
  `_uretilen/site-icerik.md` → **5** (script çıktısı, Notion değişince yeniden üretilir) ·
  `_arsiv/` → **5** (dokunulmaz) · `_arsiv/ocak-kronoloji-v1.md` → 1.
- ⚠ **`30-sosyal.md:101` bir kararı taşıyor:** *"'Çember Lideri Eğitimi' adı **kesinleşti** —
  alternatif ad tartışması kapalı."* Rename bu satırı **doğrudan çeliyor**. Ad tartışması
  kapalı sayılıyordu; Advaita yeniden açtı. **Önce bu çelişki karara bağlanır, sonra rename
  koşulur.** Mekanik bul-değiştir bu satırı sessizce yalancı çıkarır.
- ⚠ Aynı sınıf: `Ocak-Mufredat.md:249` *"Vasilisa, Çember Lideri'nin masalıdır"* — anlatı
  cümlesi, mekanik dönüşüm cümlenin ritmini bozabilir.
- **Bağ:** **B158** (aynı Advaita duruş turu) · KARAR 403 (tek ev + köprü — rename ev
  sahibinden başlar)

## B161 — Ana sayfa ve `/sen-neredesin` aşağı-kaydırma işareti yok

- [ ] **Sahip:** CC · **KOD İŞİ — brief gerekir**
- **Belirti:** Advaita iki sayfada aynı şeyi söyledi — ana sayfa *"Ateşin yanına gel"*:
  *"Aşağı kaydırma hissi gelmiyor"* · `/sen-neredesin` *"Bir kadının yolu"*:
  *"Burada da aşağı indirme hissi eksik"*.
- **Advaita'nın önerisi:** *"Aşağı işaret eden bir 'şey', ok gibi"* — ve **ortak bir
  komponent**: *"belki böyle sayfalara ortak bir işaret"*.
- **Boyut:** tek komponent + iki sayfaya bağlama. ⚠ `atmosfer.css` genişlik kolonu
  (`1538-1552`) yeni section eklenirse **dört selektöre** de bakılır (`00-durum.md` sessiz
  kırılma listesi).
- **Bağ:** **B162** aynı brief'e girer — ikisi de gezinme kusuru.

## B162 — "Hikâyeyi oku"ya tıklayan kullanıcı sayfalar arasında kayboluyor

- [ ] **Sahip:** CC · **KOD İŞİ — brief gerekir** · Advaita'nın 29 Temmuz notu
- **Belirti:** *"Hikayeyi oku'ya tıklayıp sonra kayboluyorlar sayfalar arasında."*
  Dönüş yolu yok.
- **Advaita'nın önerisi:** *"Hikayeyi oku linki, sen neredesin linkinin üzerine gelebilir"* —
  yani çözüm **navigasyon sırası** olabilir, geri butonu değil.
- ⚠ **Öneri bir teşhis değil.** Kaybolmanın nedeni ölçülmeden link sırası değiştirilirse
  semptom taşınır. Brief **ADIM 0 ile açılır**: gerçek gezinme yolu Chrome'dan izlenir
  (KARAR 419).
- **Bağ:** **B161** ile aynı brief.

## B163 — 14 etkinlik gövdesi Notion'da yeni, sitede eski — deploy yapılmadı

- [ ] **Sahip:** Kaan · **Tetikleyici:** Sayfalar DB dokuz sayfası bitince
- **Belirti:** 23 Ağustos'ta 14 etkinlik gövdesinin tamamı yeniden yazıldı. **Deploy
  yapılmadı.** Notion ile site arasında **14 gövdelik fark** var.
- ✅ **Bu bilinçli bir karardır, kusur değil.** Aynı gün üç transkripsiyon/sınıflandırma
  hatası yakalandı ve **hiçbiri siteye ulaşmadı, çünkü deploy sonda.** Deploy'un geç olması
  dördüncü ağdı.
- **Kapanış şartı:** Sayfalar DB'nin dokuz sayfası da bitince **tek seferde** deploy.
  Deploy hook uyarısı geçerli: **B64** — Notion webhook + gece cron hâlâ `astro-iskelet`
  (ölü dal) hook'unu paylaşıyor.
- ⚠ **Kayıt buraya, iş `03-sira.md`'ye.** `02-borclar.md` bir yapılacaklar listesi değil,
  **fark edilmiş tutarsızlıkların defteri** (`00-durum.md`). Notion ≠ site bir tutarsızlıktır
  ve kaydı burada durur; **sıradaki iş olarak `03-sira.md`'de yaşar.**

## B164 — `Kayıt Var` işaretleme durumu doğrulanmadı ✅ KAPANDI (24 Ağu, birebir uyuştu)

- [x] **Kapanış:** dokuz işaretli kayıt **beklentiyle birebir** uyuştu — altı Açık Kapı +
  `hasat-ve-sukran` + `kakao-seremonisi-online` + `rituel-tasarimi`.
- ⚠ **Aynı turda doğrulanan değer değişti:** **KARAR 558** üç seremoni işaretini kaldırdı,
  **altı** kaldı. Kapanış ölçümün **doğruluğunu** tescil eder, değerin kalıcılığını değil.
- [ ] ~~**Sahip:** Kaan · **Tetikleyici:** deploy öncesi (**B163**)~~
- **Belirti:** KARAR 547 kayıt varlığının otoritesini Etkinlikler DB'sindeki **`Kayıt Var`
  checkbox'ına** verdi (Kaan açtı). Gövdelerdeki kayıt cümleleri bu alanın **anlatımıdır**.
  Alanın gerçekten doğru işaretlendiği **doğrulanmadı.**
- **Beklenen durum:**
  **işaretli (9)** = 6 Açık Kapı + `hasat-ve-sukran` + `kakao-seremonisi-online` + `rituel-tasarimi` ·
  **işaretsiz (5)** = 4 Çember + `kakao-seremonisi-yuzyuze`
- ⚠ **Alan ile gövde çelişirse gövde yalan söyler.** Kadın sayfada *"kaydedilir"* okuyup
  kayıt gelmezse — ya da tersi — bu bir **vaat kusurudur**, tasarım kusuru değil.
  Doğrulama **deploy'dan önce** yapılır.
- **Bağ:** KARAR 547 · **B163**

## B165 — MailerLite ve Resend şablonları kayıt doktrinini taşımıyor

- [ ] **Sahip:** Kaan + Claude.ai · **Tetikleyici:** **ilk gerçek kayıt açılmadan önce**
- ⚠ **24 Ağu: DURDURUCU DEĞİL, ölçüldü.** Kayıtlar DB'sinde **iki satır var, ikisi de test** —
  bu şablonlar şu an **kimseye gitmiyor.** Deploy engeli kalktı; kapı **ilk gerçek kayda**
  taşındı. *(Aynı ölçüm dört slug değişiminin bedelsiz olduğunu da kanıtladı — B175.)*
- ⚠ **Kapsam KARAR 558 ile genişledi:** site artık Çember **ve Seremoni** için istisnasız
  "kayıt yok" diyor. Aranacak dizeler: `sonradan izlersin` · `kaydı` · `kayıt linki` ·
  `geç kalırsan`. Açık Kapı ve Atölye'de kalabilir.
- ⚠ **KARAR 565 uyarısı geçerli:** bu dizeler Türkçe çekimde kaçabilir; tarama okumanın
  yerine geçmez.
- **Belirti:** **KARAR 547** kayıt sınırını değiştirdi ama **transactional ve bülten
  şablonlarına bakılmadı.** Sayfada bir şey, e-postada başka bir şey okuyan kadında
  **güven kaybı sitedekinden büyük olur** — e-posta kişiye gelir, sayfa herkese.
- **Denetlenecek üç vaat:**
  1. *"kayıt alınır, gelemezsen sonradan izlersin"* → **Çember'de artık yanlış** (hiç kayıt yok)
  2. *"geç kalırsan da gel, kapı kapanmıyor"* → **Çember'de artık yanlış** (KARAR 549 —
     *"çember açıldıktan sonra kapı kapanır"*)
  3. Seremoni **hazırlık akışı** sayfadan kalktı ve **kayıt sonrası kanala taşındı** —
     ⚠ **o kanalın şablonu var mı?** Yoksa kadın hazırlığı **hiç öğrenmez.**
- **Kaynaklar:** MailerLite (abone e-postası) · Resend `davet@mail.ocak.biz` (transactional).
- ⚠ **Üçüncüsü bir kusur değil, bir boşluktur.** İlk ikisi yanlış bilgi verir; üçüncüsü
  **hiç bilgi vermez** ve sessizdir — kimse şikâyet etmez, kadın hazırlıksız gelir.
- **Bağ:** KARAR 547 · 549 · **B163** (deploy) · **B164** (`Kayıt Var` doğrulaması) ·
  B69 (şablon değişkenleri) aynı yüzey, farklı kusur.

## B166 — `ocak-lint`'e iki kural sınıfı eklenmeli: sertlik/erillik ve taahhüt

- [ ] **Sahip:** Claude.ai · **Tetikleyici:** `ocak-lint`'in bir sonraki bakımı
- **Belirti:** Advaita'nın süreç uyarısı bir üslup notu değil:
  > *"ben erkeğim ve bu kadın çemberi eril enerji ile ürün çıkarabiliyoruz uyanık olalım :)))"*
- **Ölçüm (23 Ağu, Advaita yorum turu):** *"çok eril" · "çok sert" · "davetkâr değil, itici" ·
  "şefkat, davet, anlayış yok"* itirazı **beş ayrı yerde** çıktı. **Göz kararıyla
  yakalanmıyor** — beşi de aynı turda, aynı okuyucu tarafından bulundu.
- **Eklenecek iki sınıf:**
  - **Sertlik / erillik tespiti** — buyurgan kip · kadını **eksik konumlayan** tanım
    (*"doymayan"* · *"açamayan"* · *"başlamayan"*) · yargı bildiren sıfat
  - **Taahhüt tespiti** — karşılanamayacak vaat: *"kapı kapanmıyor"* · *"tek yolu"* ·
    *"tamamlanmaz"* · *"istediğin kadar"* · *"hep / asla / her zaman"*
- ⚠ **Bu iki sınıf `yasak-dizeler.tsv` ile aynı şey değil.** O dosya **dize** yasaklar;
  bunlar **kalıp** arar. Dize listesine sıkıştırılırsa ya yakalamaz ya gürültü üretir —
  B94'ün *"lint her turda aynı bulguyu üretir ve gürültüye döner"* kusuru.
- **Bağ:** KARAR 549 (taahhüt sınıfının doktrin ayağı) · B94 · B98 · `30-sosyal.md` Bölüm 3
  madde 11 (taahhüt yasağı) ve 13 (nesneleştirme yasağı) — **kural zaten yazılı, denetimi yok.**

## B167 — `Kayıt Var` kabuğa taşınsın; bugünkü uygulama köprü

- [ ] **Sahip:** CC · **KOD İŞİ — brief gerekir** · **Tetikleyici:** Sayfalar DB turu sonrası
- **Belirti:** **KARAR 547** `Kayıt Var` alanını **otorite** yaptı. Ama bugünkü uygulama
  bir **köprüdür**: kayıt cümlesi `Detay` gövdesine **elle** yazılıyor, alan yalnız
  **denetlenebilirlik** sağlıyor. Alan değişse gövde değişmez.
- **Hedef:** `/etkinlik/[slug]` kabuğu property'den **okuyup bassın** — **süre · kapasite ·
  ücret** ile aynı sınıf (`ocak-etkinlik` skill'i, "KABUK NE BASIYOR" tablosu).
- ⚠ **Gövde bilgiye sahip olduğu sürece kayamaz.** Otorite alanın gövdede kopyası varsa
  otorite değil, ikinci kaynaktır — ve iki kaynak er geç ayrışır.
- ⚠ **Borç açılmazsa köprü kalıcı olur.** Çalışan bir köprü kimseyi rahatsız etmez;
  bu yüzden yazılmazsa hiç kapanmaz.
- **Bağ:** KARAR 547 · **B164** (alanın doğruluğu) · **B168** (aynı DB, kardeş alan)

## B168 — `Kayıt Yüklendi (Vimeo)` alanının anlamı belirsizleşti

- [ ] **Sahip:** Kaan (Notion şeması) · **Küçük ama anlam kusuru**
- **Belirti:** Kayıt artık **kısmi**: Çember'de hiç yok · Seremoni'de tema+seremoni var,
  paylaşım yok · Açık Kapı'da tema+pratik var, soru bölümü yok (KARAR 547).
  Alan *(`20-ref-notion.md:151`, Etkinlikler DB #27, Checkbox)* **"tamamı yüklendi"** mi diyor,
  **"kaydedilen bölüm yüklendi"** mi? **Belirsiz.**
- ⚠ **Bu, 23 Ağustos'ta dört kez yakalanan sınıfın beşincisidir: etiket içeriği takip
  etmiyor.** Diğer dördü: `/araclar` yedi→altı raf sayacı · `/hikaye` `bes-kadim-kaynak`
  marker'ı · `10-marka.md` "Beşli sentez" · aynı dosyanın giriş notu.
- **Çözüm adayları:** (a) alanın adı/tanımı daraltılır (*"kaydedilen bölüm yüklendi"*) ·
  (b) Checkbox → Select (`yok · kısmi · tam`). **Karar `Kayıt Var` ile birlikte verilir** —
  iki alan aynı soruyu iki farklı çözünürlükte soruyor.
- ⚠ **24 Ağu: belirsizlik daraldı, soru sertleşti.** KARAR 558 üç seremoninin kaydını
  tümden kaldırdı — alan o üç kayıtta artık **anlamsız**, "kısmi" bile değil.
  Soru ikiye indi: **alan kalkacak mı, format bazlı mı olacak?**
- **Bağ:** KARAR 547 · **KARAR 558** · **B167** · **B122** (Zoom kaydı süreci yok — *"Vimeo yok"*,
  **alan var ama arkasında süreç yok**)

## B169 — Kart derleyicisi dosya adı şemasıyla hizalı değil

- [ ] **Sahip:** Kaan + Claude.ai · **Küçük.** Koda dokunur, ayrı tur.
- **Belirti:** `tools/ocak-kart-derleyici.html` içindeki `kartAdi()` kendi şemasını
  üretiyor (`ad + "-k" + n`). KARAR 552'nin şeması `ocak-cNN-kM-YYYY-AA-GG.png` diyor.
- **Neden bu turda yapılmadı:** kısaltma turu yalnız `docs/` kapsamındaydı; kod dokunuşu
  ayrı commit ve ayrı doğrulama ister (CLAUDE.md §6).
- **Kapanış şartı:** `kartAdi()` KARAR 552 şemasını üretir; zemin adı karta bağlanmaz.
- **24 Ağu güncelleme — hâlâ açık.** Derleyici aynı gün **üç düzeltme aldı** (crop dağıtımı ·
  kapak istisnası · kaynak göstergesi, **B180**) ama `kartAdi()` **o üçün içinde değildi**;
  şema hizasızlığı olduğu gibi duruyor. MJ patch'i bunu ayrı bir aday olarak getirdi
  (*"[B-d] derleyici dosya adı şeması"*) — **yeni numara açılmadı**, kalem bu borçtur.
- **Bağ:** KARAR 552 · `docs/31-zemin.md` · **B180** (aynı dosya, aynı sıradaki commit)

## B170 — Zemin yedeği yok (B141'in genişlemesi)

- [ ] **Sahip:** Kaan · **Küçük ama kritik.**
- ⚠ **24 Ağu güncelleme — kalem büyüdü: yedi değil, ON BİR zemin.** V03 turu z08–z11'i
  ekledi (`31-zemin.md`). Yedeklenmemiş varlık sayısı bir günde **%57 arttı**; kapanış
  şartı değişmedi, **maliyeti arttı.**
- **Belirti:** yedi zemin (z01–z07) yalnız MJ CDN'inde + Kaan'ın yerel diskinde.
  Envanter ve URL şeması `docs/31-zemin.md`'de; görsellerin kendisi hiçbir kalıcı yerde
  değil.
- ⚠ **B141'in notu aynen duruyor:** yedek, **çapanın ölmesini çözmez** — `--sref` canlı
  URL ister. z01 düşerse yeniden yükleyip yeni URL üretmek gerekir ve seri tutarlılığı
  riske girer. **MJ CDN kalıcılık politikası hâlâ araştırılmadı.**
- **Kapanış şartı:** yedi zemin repo dışı kalıcı bir yere (Drive) kopyalanır + CDN
  kalıcılık politikası yazılı bir cevaba bağlanır.
- **Bağ:** **B141** (selefi, iki görsel) · KARAR 542 · KARAR 552

## B171 — `C` ve `V` kısaltmaları korpusta üç homografla çakışıyor ✅ KAPANDI (24 Ağu, KARAR 555)

- [x] **Kapanış:** **KARAR 555 — sıfır dolgu.** Kart `C01`–`C24`, prompt `V01`–`V09`,
  zemin `z01`–. Homograflar dolgusuz kaldığı için **biçim ayrıştırıyor:** `V08` prompt,
  `V8` motor sürümü · `C01` kart, `C1` VSCO preseti. Üç homograf metninin hiçbirine
  dokunulmadı ve niteleme (*"Midjourney **motor** V8.x"*) gereksizleşti.
  ⚠ Bu satırın gövdesi **dolgusuz eski biçimi taşır** — kapanmış kalem tarihsel kayıttır.
- **Belirti:** KARAR 553'ün açtığı `Cn` / `Vn` uzayı, önceden var olan üç jetona çarpıyor.
  Hiçbiri kart/prompt değildir ve **hiçbiri dönüştürülmedi:**

  | yer | jeton | gerçek anlamı |
  |---|---|---|
  | `20-ref-marka.md:391` | `C1` | VSCO fotoğraf preseti (`A6/C1, sıcak shift`) |
  | `03-sira.md:66` | `V6` `V7` `V8` | Midjourney **motor sürümü** (`Midjourney V8.x`) |
  | `01-kararlar.tsv:405` | `V2` | sayfa sürümü (`Gündönümü V2 sadeleştirme`) |

- ⚠ **İlk ikisi kart/prompt jetonlarıyla aynı dosyada yaşıyor** — `20-ref-marka.md`
  hem `C1` presetini (391) hem `C1–C24` kartlarını (538) taşıyor; `03-sira.md` hem
  `V6/V7/V8` motorunu (66) hem `V1–V9` promptlarını (350). **Grep ile ayrıştırılamazlar.**
- **Nasıl bulundu:** ADIM 0'ın çakışma taraması bunları **kaçırdı** — komut
  `git grep -P -nE '\bC[0-9]{1,2}\b'` yazılmıştı; `-E`, `-P`'yi eziyor ve `\b` ERE'de
  ölü olduğu için tarama sessizce **0** döndü. Yeniden adlandırmadan sonraki
  eski↔yeni jeton mutabakatı (`İ1`=14 ama `C1`=14, olması gereken 13) farkı yakaladı.
- **Bu turda ne yapıldı:** `30-sosyal.md` eşleme notuna üçünü de adıyla sayan bir
  disambiguasyon bloğu eklendi. **Metinlerin kendisine dokunulmadı** — anlam değiştirmek
  brief'in mandası değildi.
- **Kapanış şartı:** üç homografın metni bağlamı açacak şekilde nitelenir
  (örn. *"Midjourney **motor** V8.x"*), ya da çakışma kalıcı kabul edilip not yeterli
  sayılır. **Karar Kaan'ın.**
- **Bağ:** KARAR 553 · KARAR 219 (`C-n` tireli, dördüncü homograf — o zaten notta)

## B172 — C09: sekiz crop, tek odaklı zemin ✅ KAPANDI (24 Ağu, KARAR 571)

- [x] **Kapanış:** **KARAR 571 — C09 zemini V02 kül dokusudur.** İki yoldan (a) seçildi:
  zemin yüzeye çevrildi, kart sayısı sekizde kaldı. *Gerekçe: kartın kendi başlığı
  "Yedi kapı, **bir** ateş" — sekiz pencere, tek zemin.* V02 zaten üretildi (dört aday),
  kül düşmez, süreklilik sorunu **yapısal olarak yok.** V04 C14 ve C18'de kalır; orada
  tek kart, nesne doğru çalışır. `30-sosyal.md:309` V04 → V02 çevrildi.
  ⚠ **Kapanan şey prompt ailesi seçimi.** Somut zemin karesi (V02'nin dört adayından
  hangisi, HD var mı) **hâlâ seçilmedi** — o iş C06'nın 🟡'siyle aynı iştir ve
  `03-sira.md` görsel kuyruğunda yaşar.
  ⚠ **Ara çözüm V10 (kilim yüzeyi) denendi ve üç turda terk edildi** — kayıt kronolojide,
  ders: *kumaş yüzey değildir, kumaş düşer.* Prompt korpusa girmedi.
- **Açılışındaki hâli:** Sahip Kaan + Claude.ai · **Orta** · ⏱ **9. gün** — V04 üretilmeden
  karara bağlanmalı.
- **Belirti:** `30-sosyal.md` C09 (*Yedi kapı, bir ateş*) **V04 mum çemberi** zeminiyle
  **8 crop** istiyor. V04 nesne zeminidir: mum çemberi kareye bir kez girer, sekiz
  pencerenin bir kısmı onu gösterir, kalanı boş kalır. **KARAR 556'yı ihlal ediyor.**
- **İki yol, karar Kaan'da:** (a) zemin yüzeye çevrilir (kül/kor/kıvılcım ailesinden bir
  V prompt) · (b) kart sekizden üçe iner. Metne **bu turda dokunulmadı.**
- ⚠ **Sekiz crop, ihlalin en pahalı hâli** — C24 altı crop'la aynı kusuru taşıyordu ve
  düzeltildi; C09 karar beklediği için bırakıldı.
- **Bağ:** KARAR 556 · **B173** (aynı ihlal, dördüncü hafta) · B139 (V04'ün `--no` listesi)

## B173 — C20: altı crop, tek odaklı zemin

- [ ] **Sahip:** Kaan + Claude.ai · **Küçük** · 4. hafta.
- **Belirti:** `30-sosyal.md` C20 (*Yolculuk online — bir durağın anatomisi*) **V06
  pencere/mum** zeminiyle 6 crop istiyor. Aynı ihlal, aynı iki yol (**B172**).
- **Neden ayrı borç:** C09'dan **üç hafta sonra** yayına giriyor ve V06 ayrıca C19'da
  tek kart olarak kullanılıyor — zemin değişirse iki kart birden etkilenir.
- **24 Ağu güncelleme — emsal doğdu, karar doğmadı.** Kardeş kalem **B172 kapandı**
  (**KARAR 571**): C09'da (a) yolu seçildi — kart sayısı korundu, zemin yüzeye çevrildi.
  C20 için aynı yol **aday**, ama **otomatik değil**: C09'un gerekçesi kartın kendi
  başlığıydı (*"bir ateş"*), C20'nin başlığı (*"bir durağın anatomisi"*) aynı argümanı
  vermiyor. **V06 üretilmeden karara bağlanmalı** — üretilirse iki kart birden bağlanır.
- **Bağ:** KARAR 556 · **KARAR 571** (emsal) · **B172 ✅**

## B174 — `kakao-seremonisi-online` "kayıt sonrası küçük bir gruba alınırsın" — o grubun kanalı var mı

- [ ] **Sahip:** Kaan · **Tetikleyici:** `kakao-seremonisi-online` ilk gerçek kaydı
- **Belirti:** gövde kadına **kayıt sonrası bir gruba alınacağı sözünü** veriyor. O grubun
  kanalı, daveti ve **ilk mesajı** var mı — **taranmadı, bilinmiyor.**
- ⚠ **Bu bir metin kusuru değil, bir vaat kusuru adayı.** Grup yoksa kadın kayıt olur,
  bekler ve hiçbir şey gelmez. Sessiz: hata vermez, log'a düşmez.
- ⚠ **Aynı gövde KARAR 549 gereği hazırlığı da kayıt sonrasına taşıdı.** Yani bu grup
  yalnız bir "hoş geldin" kanalı değil, **hazırlığın taşıyıcısı.** Yoksa hazırlık hiç
  ulaşmaz — **B165**'in üçüncü kalemiyle aynı boşluk.
- **Kapanış şartı:** grup/kanal ve ilk mesaj gösterilir, ya da gövdedeki söz kaldırılır.
- **Bağ:** KARAR 549 · KARAR 558 · **B165** · **B177** (söz envanteri — bu vaka o sınıfın örneği)

## B175 — Slug turu devredildi: 26 kayıt, KARAR 559 uygulanmadı

- [ ] **Sahip:** Kaan (taslak slug'ları) + Claude.ai (yayındakiler) · **Tetikleyici:** sıradaki tur
- **Belirti:** **KARAR 559** slug konvansiyonunu (`{tema}-{YYYY-AA-GG}`) mühürledi; Etkinlikler
  DB'de **26 kayıt** var ve **yayındaki ~10'una tarih eki gerekiyor.**
- ⚠ **Adı geçen ilk kalem: `neyi-bekliyorsun`.** Dördüncü Çember'dir (16 Eylül) ve
  **tarih eki almadı** — KARAR 560'ın dört yeniden adlandırmasından biri **değildi**
  (o dördün biri Açık Kapı'ydı). *Yani konvansiyonun ilk uygulaması kendi örnek kümesini
  eksik bıraktı.*
- **İki yalan söyleyen slug:**
  1. `istanbul-aksami-07072026` — slug **07.07.2026** diyor, `Tarih` alanı **2027-01-30**.
     ⚠ Slug tarih taşıdığı anda **ikinci bir gerçek kaynağı** olur; KARAR 559'un
     *"slug ile Başlık ayrışmaz"* disiplini **tarih için de geçerli olmalı.**
  2. **Yolculuk duraklarının placeholder tarihleri** — beş durak **beş ardışık günde**
     (21–25 Şubat). Gerçek olamaz; yer tutucu olduğu hiçbir yerde yazılı değil.
- **Bedel ölçüldü (24 Ağu):** Kayıtlar DB'sinde **iki satır, ikisi de test** → slug değişimi
  **bedelsiz.** Bu pencere ilk gerçek kayıtla kapanır; ondan sonra slug değişimi
  `etkinlik_url` taşıyan e-postaları kırar.
- **Bağ:** KARAR 559 · KARAR 560 · **B165** (aynı ölçüme dayanıyor)

## B176 — `/yolculuk` `yolculuk-eksen` bölümü çıktıda hiç yok

- [ ] **Sahip:** Kaan (Notion) + CC (teşhis) · **Tetikleyici:** sıradaki `/yolculuk` dokunuşu
- **Ölçüm (24 Ağu, canlı `www.ocak.biz/yolculuk`, `data-section` sayımı):** sayfa **on iki**
  section basıyor — `hero` · `intro` · `yolculuk-nedir` · `yolculuk-kime` · `online-yolculuk` ·
  `buyuk-vurgu` · `son` · `mini-cta` · `iki-yolculuk` · `sonraki-bulusma` · `kayit-btn` ·
  `siradaki-kapi`. **`yolculuk-eksen` aralarında YOK.**
- ⚠ **Patch "section boş" diyordu — boş değil, hiç doğmamış.** Fark önemli: boş bir kap
  render edilir ve `mini-cta` gibi meşru olabilir; **doğmamış bir kap** ya marker Notion'da
  yok ya transform onu düşürüyor demektir. *"Kod var" ≠ "output var" (KARAR 355/408).*
- **Not:** `yolculuk-eksen` transform'u **kodda var** (`notion-pages.ts`, al-ol-ver/yolculuk-eksen
  paterni). Yani taşıyıcı hazır, içerik gelmiyor.
- **Teşhis sırası:** (1) Notion `/yolculuk` gövdesinde `## section: yolculuk-eksen` var mı ·
  (2) varsa `remark-ocak-sections` neden emit etmiyor · (3) yoksa içerik ne zaman düştü.
- ⚠ **Marker adı değişmişse KARAR 409 devrede** — Notion ve kod atomik gider.

## B177 — Söz envanteri yok: verilen söz ile arkasındaki mekanizma hiç eşleştirilmiyor

- [ ] **Sahip:** Kaan + Claude.ai · **yeni kavram, tek turda kapanmaz**
- **Belirti:** kamu metni kadına **söz veren** cümleler taşıyor — *"kaydedilmez"* ·
  *"adres paylaşılmaz"* · *"yargılanmaz"* · *"satış yapılmaz"* · *"sana yazıyoruz"* ·
  *"küçük bir gruba alınırsın"*. Her birinin arkasında bir mekanizma olmalı.
  **Bu eşleşme hiçbir yerde ölçülmüyor.**
- ⚠ **Bu turun en ciddi iki bulgusu bu sınıftandı ve hiçbir test yakalamazdı:**
  1. `/seremoni` + `/cember` mutlak *"kaydedilmez"* diyordu, `Kayıt Var` işaretliydi
     → **KARAR 558** (söz ile mekanizma çelişti)
  2. `kakao-seremonisi-online` *"küçük bir gruba alınırsın"* diyor, grup **bilinmiyor**
     → **B174**
- ⚠ **Neden test yakalamaz:** test kodun kendine tutarlılığını ölçer; buradaki çelişki
  **metin ile DB alanı** arasında, ikisi de testin dışında. `ocak-lint` de dize arar,
  **söz–mekanizma eşleşmesi aramaz.**
- **İlk adım (küçük):** kamu metnindeki söz cümlelerinin envanteri + her birine bir
  *"arkasındaki mekanizma nerede"* sütunu. Envanter olmadan denetim yazılamaz.
- **Bağ:** KARAR 558 · KARAR 563 (denetim satırı) · **B166** (`ocak-lint` kural sınıfları) ·
  **B174** · **B165**

## B178 — Ritüel Tasarımı ön görevi: Advaita onayı gelmedi

- [ ] **Sahip:** Advaita (karar) · **Tetikleyici:** Advaita görüşmesi
- **Belirti:** 23 Ağustos turunda Advaita *"bizim evde ne yapılırdı — silelim"* dedi.
  Cümle silindi ama **ön görev programda bırakıldı**; gerekçe ona yazıldı
  (`Pratik Bilgi`'de 5·6·7 işaretlenmiş, ön görevi tarif eden 2. satır bırakılmıştı),
  **cevabı gelmedi.**
- **İki sonuç, ikisi de meşru:** onaylarsa görev kalır · onaylamazsa **görev de kalkar.**
- ⚠ **Cevapsız kalırsa görev sessizce kalır** — yani varsayılan hâl "onaylandı" gibi
  davranıyor. Bu, açık bir karar değil.
- **Not:** `03-sira.md` *"Ritüel Tasarımı gövdesinin hiçbir bölümü Advaita'ya gösterilmedi"*
  diyor; bu borç o kalemin **tek somut sorusudur.**

## B179 — `.vercel/repo.json` bayat, `.vercel/project.json` hiç yok

- [ ] **Sahip:** Kaan · **küçük · tek komut**
- **Ölçüm (24 Ağu):** `.vercel/project.json` **yok**. Elde kalan `.vercel/repo.json`
  **27 Mayıs** tarihli ve projeye **`ocak-site`** diyor; Vercel'de gerçek ad **`ocak`**
  (canlı teyit: deployment yanıtında `project.name = "ocak"`). Proje ID eşleşiyor
  (`prj_CxW3Nm85TGzdrZdePCk74WLAv23f`).
- ⚠ **Somut sonuç:** bu turda `vercel --prod --force` yolu **kullanılmadı** — bayat bir
  dosyaya dayanarak production'a basılmaz (Kaan kararı). Deploy git push'la alındı.
- ⚠ **Ad eşleşmese de ID eşleştiği için CLI muhtemelen doğru projeye basardı** — ama
  "muhtemelen" bir deploy ölçütü değildir (KARAR 567).
- **Kapanış şartı:** `vercel link` ile tazelenir **ya da** dosya silinir. Üçüncü hâl —
  bayat bırakmak — CLI yolunu kalıcı olarak kullanılamaz kılar.
- **Bağ:** **B64** (deploy hook ölü dala bağlı) — ikisi birlikte *"elle deploy'un iki yolu
  da güvenilmez"* demektir; bu turda üçüncü yol (git push) kullanıldı.

## B180 — `tools/ocak-kart-derleyici.html` sahipsiz: commit'siz değişiklik + adsız kopya

- [ ] **Sahip:** Kaan (kimin yazdığı) · **Tetikleyici:** sıradaki commit
- **Ölçüm (24 Ağu, `git status`):**
  - `M tools/ocak-kart-derleyici.html` — **47 ekleme, 5 silme**, hiçbir commit'te değil
  - `?? tools/ocak-kart-derleyici 2.html` — **takipsiz kopya**, boşluklu ad (macOS "2" eki)
- **İçinde gerçek bir özellik var:** karusel **"Kart 1 kapak olsun"** istisnası —
  `kapakIstisna` anahtarı · `KAPAK_ALAN` bloğu · `kaynakOlcu` göstergesi. Değişiklik
  build sırasında (**02:45**) belirdi; **bu oturumun işi değil.**
- ⚠ **Sahipsiz kod en kolay kaybedilen koddur.** Commit'siz olduğu için `git` onu korumuyor;
  " 2.html" kopyası ise **hangisinin gerçek olduğu belirsiz** — iki dosya, tek isim uzayı.
- **Karar gerekiyor:** kim yazdı · commit'lenecek mi · kopya silinecek mi.

**24 Ağu · MJ turu — üç sorudan ikisi ölçümle kapandı:**

- ✅ **Kim yazdı: 23–24 Ağustos MJ görsel oturumu (claude.ai).** Patch §8 [B-c] üç düzeltmeyi
  adıyla sayıyor ve üçü de çalışma ağacındaki dosyada bulundu
  (`grep -c`, `tools/ocak-kart-derleyici.html`): `kapakIstisna` 5 · `KAPAK_ALAN` 2 ·
  `kaynakOlcu` 2 · zoom `1.62` 2 · `1.76` 1. HEAD kopyasında **beşi de 0.** Kaynak dosya
  o oturumun `/mnt/user-data/outputs/ocak-kart-derleyici.html` çıktısı; **02:45'te elle
  yapıştırıldı.** Üç düzeltme: (1) `dagit` crop dağıtımı — `oy` negatife inmiyor, zoom
  1.62/1.76, gezinme payı yatayda %18→%57 dikeyde %7→%23 · (2) **Kart 1 kapak olsun**
  onay kutusu, `ciz()` ince sarmalayıcıya döndü, çizim kodu değişmedi ·
  (3) ölçü şeridinde `KAYNAK en × boy` + büyütme uyarısı. `node --check` temiz,
  **tarayıcıda test edilmedi.**
- ✅ **Hangisi gerçek: `ocak-kart-derleyici.html`.** `ocak-kart-derleyici 2.html`
  **HEAD ile birebir aynıydı** (`diff -q git show HEAD:… ↔ kopya` → fark yok, 53.825 bayt).
  Yani kopya bilgi taşımıyordu — commit'li sürümün macOS indirme dubleti. **Silindi.**
  Geri gerekirse: `git show HEAD:tools/ocak-kart-derleyici.html > "tools/ocak-kart-derleyici 2.html"`.
- [x] ✅ **Commit'lendi (10 Eyl, `bcc0196`).** Koruma ayağı kapandı: `47 ekleme, 5 silme`
  artık git'in koruması altında. 24 Ağu ölçümü 16 gün sonra birebir tuttu — dosya o günden
  beri değişmemiş.
- [ ] ⏳ **BORÇ TAM KAPANMADI — kapsamı daraldı.** Kalan tek ayak **doğrulama**: üç düzeltme
  (`dagit` crop dağıtımı · "Kart 1 kapak olsun" · `kaynakOlcu` göstergesi) **tarayıcıda hâlâ
  test edilmedi**. `node --check` temiz, eyeball yok. Sahip: Kaan.
- **Bağ:** **B143** (aynı dosyanın font bağımlılığı) · **B169** (aynı dosya, şema hizası) ·
  **B181** (aynı gün paralel yüzeyler)

## B181 — Aynı gün dört paralel yüzey aynı klona yazdı; yazma yetkisi kuralı yok

- [ ] **Sahip:** Kaan (kural) · **Tetikleyici:** aynı gün ikinci oturum açılması
- **Ölçüm (24 Ağu):** dört yüzey aynı klonda çalıştı —
  (1) bu Sayfalar metin turu · (2) 23 Ağustos Advaita patch turu (B144–B168) ·
  (3) KARAR 552–557 karusel/zemin turu (B169–B173) · (4) `tools/…html` düzenleyicisi (**B180**).
- ✅ **KARAR 463 (tek klon) mekanik olarak korundu** — tek klon, tek aktif CC, çakışan
  yazım olmadı.
- ⚠ **Ama koordinasyon korunmadı:** iki oturum **aynı gün aynı kararı paralel verdi** —
  *"Çember Rehberliği"* ve *"Çember Rehberi"*. İkisi de doğru, **ikisi de habersizdi.**
- ⚠ **İkinci belirti aynı sınıftan:** bu oturum boyunca `ocak-docs` MCP bayat snapshot
  servis etti (`docs_karar(547)` → "yok"), çünkü diğer turun commit'leri **push'lanmamıştı**
  (KARAR 479). Patch bu yüzden **numara taşımadan** geldi.
- **Gereken kural:** aynı gün birden çok oturum açılacaksa **hangisinin `docs/`'a yazma
  yetkisi olduğu baştan belirlenir**; diğerleri patch üretir, yazmaz. Ve **yazan oturum
  push eder** — push edilmemiş commit claude.ai için yok hükmündedir.
- **Bağ:** KARAR 463 · KARAR 479 · KARAR 551 (paralel verilen karar) · **B180**

## B182 — z04 tek kart testi hiç yapılmadı; yorgunluk belgesi z03 ile z04'ü ters sıraladı

- [ ] **Sahip:** Kaan · **Küçük** · **Tetikleyici:** C05 basılmadan önce.
- **Belirti:** 23 Ağustos yorgunluk belgesi z03'e *"✓ orta"*, z04'e *"✗ söz kartı için değil,
  negatif alan kirli"* diyor. **Ölçüm tersini gösterdi.** Yedi zeminin **üst yarısında**
  parlak nokta sayımı (luma>110, bağlı bileşen ≥8px, tam çözünürlüklü kaynak dosya):

  ```
  z01: 0   z07: 0   z04: 18   z05: 22   z06: 23   z02: 108   z03: 299
  ```

  z03'ün metin bölgesinde z04'ün **on altı katı** parlak nokta var.
- ⚠ **Ama tek metrik iki farklı olguyu aynı sayıya indiriyor:** z03'ünkiler **doku beneği**
  (gözenekli kül), z04'ünkiler **serpilmiş kıvılcım**. Göz ikincisini *leke*, birincisini
  *yüzey* olarak okur — sayı bu ayrımı taşımıyor. **Sayının yöntemi sayının kendisinden
  önemli** (KARAR 470).
- **Ampirik hakem yalnız bir tarafa düştü:** C02'nin altı kartı z03 üstünde basıldı, en uzunu
  on iki kelimeydi, **altısında da metin temiz okundu** → **z03 doğrulandı.**
  **z04 hiç basılmadı** → doğrulanmadı, çürütülmedi.
- **Neden ertelenemez:** z04 şu an **C05**'e atanmış ve C05 **altı kartlık karusel**,
  metinleri uzun.
- **Kapanış şartı:** z04 üstüne **tek kart** basılır ve bakılır. Kirliyse **z04 ile z05
  yer değiştirir** (z05 = 22 parlak nokta, aynı aile, C10'da).
- **Bağ:** `docs/31-zemin.md` · KARAR 546 · KARAR 470

## B183 — V03 gövdesi hâlâ figür üretiyor: `invitation without a figure`

- [ ] **Sahip:** Claude.ai · **Küçük** · **Tetikleyici:** bir sonraki V03 turu.
- **Belirti:** *"figure"* kelimesi promptun **içinde** ve kavramı çağırıyor.
  `--no people, faces, hands` listedeydi, **tutmadı**: 24 Ağustos turunda bir karede kapı
  aralığında **oturan insan silueti** çıktı. Kare **beş ölçütü de geçmişti**; şekil
  taramasında elendi — yani sayısal kapılar bunu görmüyor.
- **B139'un dersinin ikinci vakası:** *yasak liste kelimeyi engeller, kavramı engellemez.*
  Orada *"heat seeping out"* yazıldığı sürece `--no fire` alevi durdurmuyordu; burada
  *"without a figure"* yazıldığı sürece `--no people` figürü durdurmuyor.
- **Düzeltme hazır:** `invitation without a figure` → `empty threshold, no one present`.
- **Kapanış şartı:** bir sonraki V03 turunda **tek değişken olarak** uygulanır ve ölçülür.
  Tek değişken şart — aksi hâlde etkisi gövde patch'inin etkisinden ayrışmaz.
- **Bağ:** **B139** (aynı ders, V03–V09) · KARAR 542 · `30-sosyal.md` Bölüm 16

## B184 — `30-sosyal.md` Bölüm 16 parametre kuyruğu ölçülen prompttan sapıyor; `KURUCU-URL` 12 yerde yer tutucu ✅ KAPANDI (24 Ağu, **B139** ile aynı yazımda)

- [x] **Kapanış:** kuyruk eşitlendi — **kaynak artık tek.** Dokuz prompt satırı üretimde
  çalıştırılan hâline getirildi (**B139**), Bölüm 16'daki `⚠ TEYITSIZ` notu **silinmedi,
  tarihsel kayda dönüştürüldü**: satırın bir gün boyunca *ne eski ne yeni* hâlde
  durduğunu ve neden bilerek öyle bırakıldığını anlatıyor.
- ⚠ **Kalem doğru teşhis koymuştu ama boyutu küçük tahmin etmişti.** Başlık *"kuyruk
  sapıyor"* diyordu; asıl mesele **kuyruk değil, kaynağın hiç yazılmamış olmasıydı**
  (B139). Bu yüzden ADIM 3d'ye havale edilmişti; kapanış ayrı bir brief'le geldi.
- **Değişmeyen sonuç:** iki kaynak çeliştiğinde **uzlaştırılmadı, işaretlendi** — ve
  işaret doğru yeri gösterdi. *CLAUDE.md §2'nin işe yaradığı vaka.*
- **Açılışındaki hâli:** Sahip Kaan + Claude.ai · **Küçük ama bloke edici** · **Tetikleyici:** Gün 1 yayını.
- **Nasıl doğdu:** MJ patch'i (24 Ağu) V03 gövde değişimini getirirken *"Parametreler
  değişmedi"* dedi ve şu kuyruğu yazdı:
  `--ar 4:5 --style raw --v 8.1 --stylize 130 --chaos 5 --sref <kurucu> --sw 60 --no flames, wildfire, lava, volcano, bonfire, bright white, blown highlights, daylight, grey light, blue tones, teal, people, faces, hands, text, watermark`
  **Dosyanın gerçeği (`30-sosyal.md:779`) bu değil:**
  `--ar 4:5 --style raw --stylize 130 --sref KURUCU-URL --sw 60 --no people, faces, hands, text, watermark`
- **Ölçüm (24 Ağu, `grep -c` · `docs/30-sosyal.md`):** `KURUCU-URL` **12** · `--v 8.1` **2** ·
  `--chaos` **3**. Yani V01–V09'un hiçbirinde `--sref` gerçek URL değil.
- ⚠ **Patch'in ikinci iddiası da tutmuyor:** §6(b) *"B139 ile dokuz promptun da URL'i
  dolduruldu"* diyor. **B139 açık**, ve B139'un kendi gövdesi tersini söylüyor:
  *"Bölüm 16'nın V01–V09 tam set değişimi (ADIM 3d) bu borçtan **ayrıdır** — o `KURUCU-URL`
  + `--v 8.1` + hex işidir, bu `--no` işidir."* `00-durum.md` YAYINI KİLİTLEYENLER 2. maddesi
  de *"kalan iş `KURUCU-URL` ara-değiştir"* diyor. **Üç yüzey aynı şeyi söylüyor, patch
  yanlış.**
- ⚠ **Somut sonuç:** dosyadaki V03 gövdesi 24 Ağustos ölçümüyle **güncellendi**, kuyruğu
  **güncellenmedi** — çünkü ölçülen kuyruk dosyada hiç yaşamadı. Yani Bölüm 16'daki V03
  şu an **ölçülen kombinasyon değil.** Bölüm 16'ya bunu söyleyen bir `⚠ TEYITSIZ` notu
  düşüldü; **uzlaştırma yapılmadı** (CLAUDE.md §2).
- **Kapanış şartı:** ADIM 3d koşulur — dokuz promptun `KURUCU-URL`'ü gerçek `--sref` ile
  değiştirilir, `--v 8.1` + `--chaos` + genişletilmiş `--no` listesi kararlaştırılır ve
  **ölçülen kuyrukla dosyadaki kuyruk eşitlenir.** Sonra Bölüm 16'daki `⚠ TEYITSIZ` notu
  kalkar.
- **Bağ:** **B139** (`--no` ayağı) · KARAR 542 · KARAR 470 · `00-durum.md` YAYINI KİLİTLEYENLER 2

## B185 — `IadeMetni` ortak bileşen yok
- [ ] **Sahip:** CC · **Küçük** · **Tetikleyici:** bir sonraki yasal metin turu
- İade cümlesi `teslimat-iade.astro` ve `mesafeli-satis.astro`'da **birebir aynı 350
  karakterlik dize** olarak iki yerde yaşıyor (`0b173ac`, 10 Eyl). Boşluk normalize
  edilerek karşılaştırıldı, eşit.
- KARAR 395'in tam uyardığı durum: iki kod yolunu elle eşit tutmak. Bu turda **bilerek**
  ertelendi, kapsamı büyütmemek için; her iki dosyaya da bunu söyleyen yorum kondu.
- **Çözüm:** `src/components/yasal/IadeMetni.astro`. **Bağ:** KARAR 395 · KARAR 576

## B186 — kalan PayTR/iyzico geçişleri
- [ ] **Sahip:** CC · **Küçük** · **Tetikleyici:** N-Kolay provider implementasyonu
- 19 satır: JSX/frontmatter yorumu, sunucu tarafı hata dizesi, `getPaymentProvider()`
  throw metinleri. **Kullanıcıya çıkmıyor** — `dist/` ve `.vercel/output/static/` temiz;
  `_functions/pages/api/kayit.astro.mjs` içinde dört `iyzico` throw dizesi var.
- Kaan kararı (10 Eyl): dursun, ayrı borç. N-Kolay implementasyonu gelince aynı turda temizlenir.
- **Bağ:** KARAR 576 · `e03364d` (kullanıcı-görünür olan zaten kaldırıldı)

## B187 — `20-ref-notion.md` Kayıtlar şeması bayat
- [ ] **Sahip:** Claude.ai → CC · **Tetikleyici:** Notion şemasına dayanan bir sonraki iş
- Dosya **12 alan** sayıyor; kodda `Kullanılan Kod` · `Askı Tutarı` · `Askı Katkısı` ·
  `Davet Eden Ref` · `Etkinlikler` var, listede **yok**. Bugün `Beklenen Tutar` ve
  `Mail Gitti` de eklendi (10 Eyl, Kaan).
- ⚠ Şema referansı **güvenilmez**: kod ile çeliştiğinde hangisinin doğru olduğu ölçülemiyor.
  Bu turda `/odeme/tamam` teşhisi şemayı **doğrulayıcı** olarak kullandı — o sefer tuttu,
  garanti değil. **Bağ:** KARAR 482 (çelişkide hangi yüzey kazanır)

## B188 — KARAR 488'in dört tüketicisi ölçüsüz
- [ ] **Sahip:** CC · **Tetikleyici:** muhafız turu — **birinci madde**
- Altı tüketiciden yalnız ikisi (`oda-map`, sabit route listesi) test altında.
  **Ölçüsüz dördü:** `KayitFormu.astro:448` · `api/kayit.ts:503` ·
  `odeme-callback.ts:125` · `astro.config.mjs` sitemap filtresi.
- ⚠ `KayitFormu:448`'i `{false && …}` yapmak suite'i **yeşil bırakır** — KARAR 573'ün
  canlı ödeme yüzeyindeki vakası. `kart-akisi.test.ts` bayrağın *değerini* ölçüyor,
  gate'in *koşulunu* değil. **Bağ:** KARAR 573 · KARAR 488 · B189

## B189 — muhafız envanteri
- [ ] **Sahip:** CC · **Tetikleyici:** B188'den sonra, kendi brief'iyle
- `.claude/notes.md`'de sekiz aday listelendi, **hiçbiri ölçülmedi.**
- **Sıra:** B188'in dördü **önce**; sonra KVKK/Mesafeli validasyonu (`KayitFormu.test.ts`
  — açıkça varlık ölçümü, KARAR 262'nin tekrar eden bug'ı) ve `odeme-callback` 410 gate'i
  (401 muhafızıyla **aynı dosya, aynı desen**). **Bağ:** KARAR 573 · B188

## B190 — `genuine-prosperity` projesi kırık
- [ ] **Sahip:** Kaan · **Tetikleyici:** N-Kolay denetimi öncesi
- `hlaorpz/ocak` reposuna bağlı **ikinci** bir Vercel projesi var; production deploy'u
  kırmızı ✗. `ocak/production` yeşil.
- **Ölçülmedi:** ne olduğu · neden bağlı olduğu · kırıklığın bir şeyi etkileyip etkilemediği.
- **Bağ:** B179 (`.vercel/repo.json` bayat, projeye "ocak-site" diyor)

## B191 — Vercel webhook dal push'unu kaçırdı
- [ ] **Sahip:** Kaan · **Tetikleyici:** bir sonraki dal açılışı
- `nkolay-test` GitHub'a push edildi (`b1ee821`), Preview ayarı **"All unassigned git
  branches"**, deploy yine tetiklenmedi. Boş commit (`f8409c4`) ile tetiklendi.
- **Ölçülmedi:** tek vaka mı, desen mi.
- ⚠ **B64'ün akrabası** — ikisi de deploy tetikleme hattında. **Bağ:** B64

## B192 — Notion'da mock test satırları
- [ ] **Sahip:** Kaan · **Tetikleyici:** **ilk gerçek kayıt penceresi açılmadan önce**
- **İki tur, iki kalıntı.** (a) İŞ 4 Preview'da koşuldu (10 Eyl, **Kaan'ın raporu** —
  CC bağımsız doğrulamadı). (b) Uçtan uca tur **Production'da** koşuldu (11 Eyl, CC),
  aşağıdaki satır **ölçülmüş ve adıyla kayıtlı**:

  - **`OCAK-5HNJ`** · Notion sayfa `3d8b61eb-fa87-81f5-a1de-e9bd069debcd`
  - Kayıtlar satırı: `Ödeme Durumu = Ödendi` · `Ödenen Tutar = 1000` ·
    `Notlar = "MOCK ödeme — <ISO>"`
  - Etkinlik **Neyi Bekliyorsun? · 16 Eylül** — sayaçları **bir arttı**
    (Toplam Kayıt Sayısı · Tahsil Edilen Gelir), **Kalan Kontenjan bir azaldı**.
    ⚠ **Satır silinince sayaç da düzeltilmeli** — rollup/formula otomatik döner ama
    kontrol edilmeden bırakılmaz.
  - **MailerLite'a `kaan@ocak.biz` kontağı yazıldı** (`ok: true · status 200`).
    Otomasyon aktifse o adrese kayıt onayı maili gitmiş olabilir.

- İlk gerçek kayıttan önce silinir ya da işaretlenir — **üç yüzey birden**:
  Notion satırı · etkinlik sayaçları · MailerLite kontağı.
- ⚠ **B72 ile sırası önemli** — erken temizlik kapı doğrulamalarının zeminini siler.

## B193 — Production'da mock ödeme ekranı canlı
- [ ] **Sahip:** Kaan · **BÜYÜK** · **Tetikleyici:** ilk gerçek kayıt penceresi açılmadan önce
- **Kaan kararı (10 Eyl):** N-Kolay denetimi `www.ocak.biz` üzerinden yapılacak, mock ekran
  gösterilecek → `KART_AKISI=acik` · `PAYMENT_PROVIDER=mock` **Production kapsamına** yazılır.
  `ODEME_CALLBACK_SIR` Preview'dakinden **farklı** olur.
- 🔴 **CANLI (11 Eyl, redeploy sonrası ölçüldü).** Anahtar Production'da açık: yöntem grubu
  iki seçenekle basılıyor (kart varsayılan `checked`) · `/odeme/{mock,tamam,iptal}` üçü de
  **200** · sitemap 48 → **51 `<loc>`**. Borç artık teorik değil, **yürürlükte**.
- ⚠ **İlk iki ölçüm sıfır döndü** — env yazılmıştı ama **redeploy alınmamıştı.** Vercel'de
  env yazmak mevcut build'i değiştirmez; değer build zamanında sabitlenir. Bu turda **iki
  kez** yaşandı ve iki kez de "env girmedi" sanıldı.
- ⚠ **Paylaşılan sır sayfa kaynağında görünür.** Mock tasarımı `ODEME_CALLBACK_SIR`'ı
  `/odeme/mock` formunda gizli input olarak geri gönderiyor — yani **değer HTML'de okunur.**
  Bu bir güvenlik sınırı değil: **kaza çağrılarını eler, kasıtlıyı elemez.** Mock için kabul
  edilebilir (gerçek para yok) ve bu yüzden Preview sırrı **rotate edilmiyor**. ⚠ Gerçek
  N-Kolay sağlayıcısında doğrulama **imza şemasıyla** yapılacak, paylaşılan sırla değil —
  `dogrulaCallback()` sağlayıcı başına ayrı olduğu için değişiklik yalnız yeni sınıfta olur,
  route'a dokunulmaz. Değer hiçbir dokümana yazılmadı (CLAUDE.md §8).
- **Risk:** anahtar açıldığında kadın "Kartla öde" derse **sahte ekran "ödendi" der.**
  Bugün zararsız — kayıt kadınlara açık değil, "parasız Ödendi" riski yok.
- **İki çıkış:** gerçek N-Kolay provider devreye girer · ya da `KART_AKISI` Production'da kapanır.
- ⚠ **AÇILIŞ'tan (24–27 Eylül) önce kapanmak zorunda.** **Bağ:** KARAR 575 · KARAR 488 · B192
