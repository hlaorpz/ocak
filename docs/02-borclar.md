# AÇIK BORÇLAR

**Son güncelleme:** 19 Ağustos 2026 · WA yüzen buton turu · **sayaç değişmedi — borç açılmadı, kapanmadı**

**Durum:** 102 madde · **70 açık iş** · 30 kapandı/çözüldü/geri çekildi · 2 iş değil (B26 ⏸ ertelendi · B30 🔵 planlı+kilit)

*Sayım yöntemi: gövdedeki `^## B` başlık satırları → **74**. Kapanış ölçütü başlıktaki
**damga**, kelimenin kendisi değil: `[✅❌]` geçen → **27** (`✅ KAPANDI` ×23 · `✅ ÇÖZÜLDÜ` ×2 ·
`✅ TEŞHİSLE KAPANDI` ×1 · `❌ GERİ ÇEKİLDİ` ×1). İş değil: `[⏸🔵]` geçen → **2**.
Açık = 76 − 28 − 2 = **46**. Ölçüm anı: **B76 kapandıktan sonra**, 19 Ağustos 2026.*

*19 Ağustos, ikinci ölçüm (Faz 1 kod turu): toplam 74 → **76**, açık 45 → **47**.
Kapanan yok, damgalı sayısı **27**'de sabit — B75 ve B76 ikisi de yeni kayıt.
Sayaç devralınmadı, üç grep yeniden koşuldu.*

*19 Ağustos, üçüncü ölçüm (aynı turun canlı teyidi): **B76 kapandı** — damgalı
27 → **28**, açık 47 → **46**. Toplam 76'da sabit. Aynı gün açılıp aynı gün
kapanan tek kayıt; ölçüm push sonrası canlı aboneden alındı, `dist/`ten değil.*

*19 Ağustos, dördüncü ölçüm (Faz 1 kapanış patch'i): toplam 76 → **79**, açık
46 → **49**. Damgalı **28**'de sabit — bu turda kapanan yok. **B74 KISMİ**:
kayıt sayfası ayağı görüldü, `/etkinlik/[slug]` ritim ayağı açık kaldı; madde
bilerek damgasız bırakıldı, yani açık sayılıyor. Kapanış şartı daraltılmadı —
daraltmak borcu kapatmaz, kaydını siler (Kaan kararı). Y1 bu sayaca girmez:
borç numarası değil, kod turu etiketi.*

*19 Ağustos, beşinci ölçüm (B turu patch'i): toplam 79 → **87**, açık 49 → **56**.
Damgalı 28 → **29** — tek kapanış **B04** (`/acik-kapi` "sembolik ücret" **kalıyor**,
KARAR 432 muafiyeti teyit). Sekiz yeni kayıt B80–B87. Sayaç devralınmadı, üç grep
yeniden koşuldu. Not: bu turun "kapananlar" listesindeki diğer iki kalem (İ22 ters
kararı · `/hikaye` közü) **B numaralı madde değildi** — doğrudan içerik kararı,
kayıtları `90-kronoloji/2026-08.md`'de. Sayaca girmezler.*

*19 Ağustos, altıncı ölçüm (üç-format turu): toplam 87 → **100**, açık 56 → **69**.
Damgalı **29**'da sabit — bu turda kapanan yok. On üç yeni kayıt **B88–B100**. Sayaç
devralınmadı, üç grep yeniden koşuldu. **B57 kapanmadı ama cins buldu:** KARAR 513
onu kapsıyor, doktrin borcu kapatmaz — kapatan tazelik kapısıdır ve kurulmadı; madde
damgasız kaldı, yani açık sayılıyor. Brief'in tablosu 15 satırdı: üçü **yanlış öncülle
düştü** (üç gövde Notion'a girdi · `/atolye` SSR, eksik değil · smoke kalıntısı gerçek
etkinlik çıktı), biri **kapanan madde diye gelip borca döndü** (B100, hız sözü) → 13.*

*19 Ağustos, yedinci ölçüm (gölge satır + B102 turu): toplam 100 → **102**, açık
69 → **70**. Damgalı 29 → **30** — tek kapanış **B102**, açıldığı turda kapandı
(`Kayıt Kapanış Tarihi` opsiyonel, fallback kabul; Kaan kararı). İki yeni kayıt
**B101–B102**. Sayaç devralınmadı, üç grep yeniden koşuldu; damga kırılımı
`✅ KAPANDI` ×26 · `✅ ÇÖZÜLDÜ` ×2 · `✅ TEŞHİSLE KAPANDI` ×1 · `❌ GERİ ÇEKİLDİ` ×1.
**Not:** aynı turda önerilen bir borç hiç açılmadı — v1 brief'in "Ritüel Tasarımı
superseded format" gövdesi ADIM 0 ölçümüyle çürüdü. Açılmayan madde sayaca girmez;
kaydı `90-kronoloji/2026-08.md`'de.*

*19 Ağustos, sekizinci ölçüm (WA yüzen buton turu): toplam **102**, damgalı **30**,
iş değil **2**, açık **70** — **üçü de değişmedi.** Bu tur borç açmadı, borç kapatmadı;
üç kod commit'i ve bir doküman commit'i ürettiyse de hiçbiri borç yüzeyine değmedi.
`20-ref-bot.md` çelişkisi (satır 15/20 iki farklı bayat numara) borca **çevrilmedi** —
aynı patch'te düzeltildi (KARAR 104: on beş dakikalık iş ertelenmez). Sayaç
devralınmadı, üç grep yeniden koşuldu.*

*Üretilen komutlar (KARAR 470-b): `grep -cE '^## B'` → 100 · `grep -E '^## B' | grep -cE '[✅❌]'`
→ 29 (`✅ KAPANDI` ×25 · `✅ ÇÖZÜLDÜ` ×2 · `✅ TEŞHİSLE KAPANDI` ×1 · `❌ GERİ ÇEKİLDİ` ×1) ·
`grep -E '^## B' | grep -cE '[⏸🔵]'` → 2. Açık = 100 − 29 − 2 = **69**.
Damga ölçütü başlıktaki `[✅❌]`, kelimenin kendisi değil (10 Ağu B01 kaydı).*

⚠ *19 Ağustos: tek turda **on iki** yeni kayıt açıldı (B63–B74) — açık sayısı 33'ten
45'e çıktı, kapanan yok. Bu bir gerileme değil, **görünürlük artışı**: kayıtların
çoğu daha önce fark edilmiş ama hiçbir deftere yazılmamış işlerdi.*

⚠ *18 Ağustos düzeltmesi: bu paragraf damgalı sayısını **24** yazıyordu, ama kendi
aritmetiği (`60 − 27 − 2 = 31`) zaten **27** kullanıyordu — satır kendi içinde çelişikti
ve 24 hiçbir ölçümle tutmuyordu. Ölçüldü: 27. Aritmetik doğruydu, ara rakam bayattı.
Bu tam olarak paragrafın kendi uyardığı hata tipi — rakam devralınmış, yeniden
ölçülmemişti.*
Alt maddeler (B36-a, B44-a) ayrı sayılmadı — kendi başlıkları yok. **Bu satır bir sonraki
eklemede yeniden ölçülür, devralınmaz** (KARAR 470).*

⚠ *Yöntem 11 Ağustos'ta düzeltildi. Önceki hâli "başlık satırları → 55" diyordu, gerçek
o gün de **57**'ydi — alt-rakam bayattı. Ayrıca B01 kapanış patch'i sayacı `✅ KAPANDI`
**kelimesini** arayan bir grep ile tarif etmişti; o yöntem 39 veriyordu, çünkü `✅ ÇÖZÜLDÜ`
(B03 · B28), `❌ GERİ ÇEKİLDİ` (B27) ve iş-değil ikilisini kaçırıyordu. Kelime değil
**damga** aranır; ayrım kronolojide, 10 Ağustos B01 kaydında.*

*(Sayım düzeltmesi — D6: başlık "31 madde · 19 açık" diyordu, gerçek sayım B01–B30 üzerinden 30 madde · 20 açıktı. ADIM 3'te B31 açılınca 31 · 21 oldu.)*

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

## B80 — `/adimiz` "közüyle taşınır" — kamu metnindeki tek "köz"
- [ ] **Sahip:** Kaan (Notion) · ~2 dk
- **Tetikleyici:** 19 Ağustos dumpı (49 route, `3683ca4`). Site geneli tarandı;
  **"köz" yalnız `/adimiz`'da geçiyor.** `/hikaye` temiz çıktı (aşağıda).
- **İhlal:** KARAR 86 (köz site dilinde yok) + KARAR 453 (yasağın sosyal yüzeye
  genişlemesi). Kart tarafı zaten temiz — İ10 "kor" diyor.
- **Tuzak:** düzeltme **cümle görülerek** yapılır, kör find-replace ile değil;
  "köz" bazı bağlamlarda renk adı olarak meşru (KARAR 453).
- **Kapanış şartı:** Notion'da cümle düzeltilir, sonraki dumpta `/adimiz` bloğunda
  "köz" 0 geçiş.

## B81 — `/etkinlik/yolculuk-acilis` gövdesi boş
- [ ] **Sahip:** Kaan (Notion)
- **Ölçüm:** dumpta **3 section · 47 kelime**; canlı `<main>` düz metni 156 karakter.
  Oran `C_dump/C_html = 1.85` — yani **araç kaybı değil**, sayfada içerik yok.
  Diğer 14 etkinlik sayfası 488–795 kelime taşıyor.
- **Ağırlık:** bugün karara bağlanan **AÇILIŞ 24–27 Eylül** (KARAR 492) sitede
  içeriksiz duruyor. Sosyal v2.1'in İ11/İ20 kartları bu sayfaya bakıyor.
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
- **Belirti:** İ5 · İ11 · İ20 caption'larına "başvuru/kayıt sayfası açık" cümlesi
  eklendi. Dump dayanağı net (yedi format kayıt route'u + `/anadolu/basvuru` canlı),
  ama **Bölüm 15 madde 4 sözlü kapı istiyor.**
- **Kapanış şartı:** Kaan onaylar ya da reddeder. İtiraz hâlinde silinecek üç cümle
  `30-sosyal.md` değişiklik günlüğünde tek tek yazılı.

## B86 — Kart derleyici: fotoğrafsız kart zemini
- [ ] **Sahip:** Kaan + Claude (gözle)
- **Belirti:** araç üretildi ve beklemede. Şu anki **radial zemin yedek, tasarım değil.**
- **Gerilim:** sitenin glow'u taşınırsa iki aileli sistem doğar; o hâlde **dokulu glow**
  olmalı — düz degrade + serif italik internetin en çok gördüğü alıntı kartıdır.
- **Kapanış şartı:** gerçek görselle yan yana konup gözle karar verilir.

## B87 — İ14: F2 karesi hatırlatması
- [ ] **Sahip:** Claude
- **Belirti:** söz değneği reels'i **MJ-zoom** kaldı. Gerçek değnek makrosu
  çekildiğinde değiştirilecek.

---

## B88 — `ornekler-seremoni.md` bekçisi yazılacak

- [ ] **Sahip:** Claude.ai · **Tetikleyici:** üçüncü Seremoni gövdesi yazılmadan önce
- **Malzeme:** iki gövde, iki mekân varyantı (online · yüz yüze). Bant **4.870–5.197 kr**
  (künye ölçümü, code point). İki nokta eğri vermiyor ama bant beyanı için yeterli —
  Çember bekçisi de dört sayfayla kuruldu.
- **Taşınacak sapmalar:** `yaninda-getir` mekân başına ayrı liste (Çember'in "beş sabit +
  bir temaya özel" kalıbı buraya **taşınmaz**) · `kimin-icin` kapanışı mekâna göre bölük ·
  "Geç kalırsan…" maddesi iki sayfadan da **çıkarıldı** · sağlık/kontrendikasyon katmanı yeni.
- **Bağ:** KARAR 504 · 505 · B66 (Seremoni bekçisi yokluğu, bu maddenin selefi)

## B89 — `ornekler-atolye.md` bekçisi yazılacak

- [ ] **Sahip:** Claude.ai · **Tetikleyici:** **ikinci** Atölye sayfası
- **Belirti:** tek sayfadan bant çıkmaz. Elde **4.895 kr** tek nokta var (Ritüel Tasarımı,
  künye ölçümü). Kalıp ikinci Atölye sayfasına kadar **aday**, kanon değil.
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
