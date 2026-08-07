# DOCS PATCH — 2026-08-07 · ADIM 3b (KARAR ARKEOLOJİSİ)

**Uygulayan:** CC / `ocak-arsivci`
**Yetki:** KARAR 462 (sohbet sonu = tek patch, CC uygular)
**Disiplin:** KARAR 355 (ADIM 0 salt-read) + **KARAR 465** (bu patch'te mühürleniyor —
çapa tekilliği; aşağıdaki her çapa dosyanın gerçek hâlinden alındı, çıkarımdan değil)

**Bu patch B33'ü İÇERMEZ.** Sıra yük taşıyor — gerekçe § 6'da.

---

## ADIM 0 — YAZMADAN ÖNCE DOĞRULA

Aşağıdakiler tutmuyorsa **DUR ve raporla**, hiçbir dosyaya yazma.

```bash
cd ~/Desktop/ocak-site-clone   # tek klon disiplini, KARAR 463

wc -l docs/01-kararlar.tsv     # beklenen: 465
wc -l docs/02-borclar.md       # beklenen: 269
wc -l docs/00-durum.md         # beklenen: 134
wc -l docs/90-kronoloji/2026-08.md   # beklenen: 186

# ledger'da KARAR 465 HENÜZ OLMAMALI
grep -c $'^465\t' docs/01-kararlar.tsv          # beklenen: 0

# değişecek 30 satırın hepsi mevcut olmalı
for n in 62 64 66 67 68 114 143 146 154 159 160 164 170 171 172 179 \
         196 223 237 238 247 248 251 350 380 400 407 447 454 458; do
  c=$(grep -c -P "^$n\t" docs/01-kararlar.tsv)
  [ "$c" = "1" ] || echo "SAPMA: $n → $c satır"
done
# beklenen çıktı: hiçbir şey
```

Satır sayıları sapıyorsa dosya bu patch yazıldıktan sonra değişmiş demektir — **DUR**.

---

## 1. `docs/01-kararlar.tsv`

> **YENİ SATIRLARIN OTORİTESİ `ek-a-tsv-satirlari.tsv` DOSYASIDIR.**
> Yanına konuldu; **31 satır, gerçek sekme karakterli, 6 sütun doğrulandı.**
> Bu bölümdeki metin **gerekçedir, kaynak değil.** Satırları bu markdown'dan
> kopyalama — markdown sekmeyi boşluğa çevirebilir. `ek-a` dosyasından al.
>
> Uygulama: `no` alanı (satır başı + sekme) dosyada benzersizdir; her satır için
> `^NNN\t` ile eşleşen mevcut satır **tamamen** `ek-a`'daki karşılığıyla değiştirilir.
> **465 mevcut değildir — eklenir** (dosya sonu, `464` satırından sonra).
>
> 30 değişim + 1 ekleme = 31. Sonuç: 465 satır → 466 satır.

### 1a — Gerçek dizi boşlukları → `KULLANILMADI` (62 · 64 · 66 · 67 · 68 · 179)

ADIM 1 anomali raporu (`2026-08.md:144`, "dizi boşluğu 16") bu numaraları zaten
`KULLANILMADI` işaretlemeyi önermişti; ADIM 2 uygulamamıştı. Bağımsız doğrulama: altı
master dosyanın tamamında **0 geçiş**.

`KULLANILMADI` KARAR 456'nın kanonik enum'unda vardır — geçiş planı enum'u **yedi**
değerle yazmıştı, kanon (`2026-08.md:128`) **dokuz** diyor. Kanon kronolojide, plan
özettir (KARAR 102).

> ⚠ **Çapa uyarısı (KARAR 465).** Bu altı satırın eski hâli baştaki numara dışında
> **birebir aynıdır**. `hiçbir dosyada geçmiyor` dizesini çapa yapma — altı yerde geçer.
> Çapa daima `^NNN\t` ile başlayan **tam satır** olmalı.

### 1b — Tanımı bulunan altı satır (154 · 196 · 223 · 400 · 407 · 458)

Kanıt izi (dosyaya yazılmaz, denetim içindir):

| no | kanıt |
|---|---|
| 154 | `2026-05.md:3174` — kendi section başlığı |
| 196 | `2026-06.md:50-60`, kapanışta `(Arşiv: KARAR 196)` |
| 223 | `2026-06.md:267` — `[KARAR 223]` tekil etiket |
| 400 | `ocak-referans.md:134` |
| 407 | `ocak-referans.md:1903` |
| 458 | `2026-08.md:132` — tam tanım |

400 ve 407'nin TEYITSIZ olma sebebi doküman hatası değildi: ADIM 1'in **ilk geçişi
bölüm başlığıydı** (`### … (KARAR 400-404)`), tanım 1–8 satır altındaydı. Envanter
aracının siniri, kaydın eksikliği değil.

**458 atlanmamıştı.** Geçiş planında kadro tablosu numarasızdır; numarayı kronoloji verir.

### 1c — 251: tanım hâlâ yok

Aday ledger'a not olarak düşülüyor ama **tahmin edilmiyor** (KARAR 456). Bir sonraki tur
sıfırdan aramasın diye kaydediliyor, doğrulanmış gibi gösterilmiyor.

### 1d — Blok üyeleri → yeni `⊂N` konvansiyonu (10 satır)

**Kural (bu patch'le giriyor):** `iliski` sütununda `⊂N` = "bu numara N'in tanımladığı
kararın bloğunda yaşar; blok kaynakta tek parçadır, tekil ayrım yoktur."
`baslik` bloğun başlığını taşır. `durum` **blok çapasının durumundan devralınır** —
blok tek commit'te uygulandığı için meşru, ve devralma burada açıkça beyan edildiği
için denetlenebilir.

Gerekçe: üyelik **doğrulanabilir bir gerçektir**; TEYITSIZ tutmak onu saklar ve kuyruğu
suni olarak uzun gösterir. Ama tekil başlık uydurmak KARAR 456'yı çiğner. `⊂` ikisinin
arasındaki dürüst yerdir.

247 ve 248 en çok daralanlar: "245-250 zinciri" belirsizliğinden **tek commit'e** indiler
(`2026-06.md:362-363`, numaralı iş listesinin 5. ve 6. maddeleri).

### 1e — Dört TEYITSIZ satır

**380 — kapanıyor.** Kanıt `2026-07.md:749` (numaralı KARAR listesi) + `:738` (gerekçe).
Kritik nokta: **dist ölçümü çift çizginin gerçekte olmadığını gösterdi**; illüzyonu `li`
margin'i doğuruyordu, kart hizasının kök nedeni de `li padding-left`'ti. `3c2b865`
production. Eski `kaynak` değeri `ocak-pilot.md:35` idi — Pilot dağıldı, referans zaten ölüydü.

**447 — başlık yanlıştı.** Eski başlık (*"Ayrım gerekliliği — fiilen açılıp açılmadığı
teyit edilmedi"*) kararın **son cümlesindeki parantez içi çekinceden** alınmıştı. Gerçek
tanım `ocak-referans.md:3493`: duyuru→WhatsApp Kanalı (pull), hatırlatma→utility template
(push meşru), genel pazarlama push'u→yapılmaz, grup→broadcast için asla. Blokta zaten
mühürlü bir düzeltme var (`2026-07.md:1237`): 447'nin *"Ocak Kadın Çemberi onaylandı"*
beyanı KARAR 410 ile geçersiz — `iliski` artık bunu taşıyor.

**350 ve 143 — metin teyitli, kalan soru KOD sorusu → B34.** İkisinde de arkeoloji bitti.
Kalan belirsizlik "kod bugün ne yapıyor" sorusudur — KARAR 355/408 hattı, `dist` grep'i
ister. TEYITSIZ kalıyorlar ama artık **eriticileri var**.

### 1f — B05 ve B06 kapanışı

**146 — çakışma bayrağı kalkıyor.** Çakışma yoktu. B05'in ikinci kaynak olarak gösterdiği
`ocak-kronoloji.md:3558` (= `2026-05.md:3468`) şunu diyor: *"TS Window dataLayer global
type (KARAR 146 **kapandı**, `f6fee7b`)"* — bu bir **geri-referans**, 146'nın kendi tanımı
içinde doğan borcun (`00-devir.md:321`: *"Window dataLayer TS sapması `(window as any)`
cast"*) 31 Mayıs'ta kapanışıdır. ADIM 1'in regex'i "KARAR 188-192 bloğu içindeki KARAR
146"yı rakip tanım sandı. 188'in kendi section başlığı ayrıca var: `2026-05.md:3276`.
**188 satırına dokunulmuyor.**

**114 — halef tek numaraya indi.** Kanıt `2026-07.md:852`, dönemin kendi supersede satırı:
*"Kısmen süperselenen: KARAR 114 (stop verbatim, geometri değişti → 366)."* Destek `:629`.
114 ölmedi — `2026-07.md:206`, `/etkinlik/[slug]` hero'sunda hâlâ "KARAR 114 parity"
uygulanıyor. Supersede bu yüzden **kısmi** kalıyor.

### 1g — 454: sahte satır → `REZERVE`

`2026-08.md:144` açıkça diyor: *"KARAR 454 hiçbir dosyada yok … **454 `REZERVE`, yeni
kararlar 455'ten başlar.**"* Ama ledger'da 454 bir karar taşıyordu: *"Hesap adı oynak,
ID kanonik — GitHub numeric `261375117`"*, kaynak `90-kronoloji/2026-08.md`.

`261375117` dizesini tüm master dosyalarda taradım. **İki yerde geçiyor:** ledger'ın o
satırı, ve `ocak-referans.md:2050` — orada da karar değil, `git config` noreply email'inin
parçası. Gösterilen kaynak içeriği **taşımıyor**.

İlkenin kendisi gerçek ama **zaten numaralı**: KARAR 389 = *"Hesap adı uçucu, ID kanonik —
Vercel slug kso2025→hlaorpz"*, `KALICI`. 454 onun neredeyse birebir kopyasıydı; kendi
`iliski` sütunu bile `↔389` diyordu. İkinci numara vermek aynı hatayı tekrarlar.
**389'a dokunulmuyor, yeni numara açılmıyor.**

GitHub numeric ID altyapı bilgisidir, karar değil — yeri `20-ref-protokoller.md`.
Bu patch onu yazmıyor.

### 1h — Yeni satır: KARAR 465

`464` satırından sonra eklenir (dosya sonu). Çapa: `464` + sekme ile başlayan tam satır.

---

## 2. `docs/02-borclar.md`

### 2a — Başlık satırları

**Çapa:** `**Son güncelleme:** 6 Ağustos 2026 · ADIM 3 (Pilot bölünmesi) — sayım düzeltmesi + B31`
**Yeni:** `**Son güncelleme:** 7 Ağustos 2026 · ADIM 3b (KARAR arkeolojisi) — B05·B06·B13·B20 kapandı, B34·B35 açıldı`

**Çapa:** `**Durum:** 33 madde · **23 açık** · 10 kapandı/çözüldü/geri çekildi`
**Yeni:** `**Durum:** 35 madde · **21 açık** · 14 kapandı/çözüldü/geri çekildi`

> Sayım: 33 + B34 + B35 = 35 madde. Kapanan 10 + B05·B06·B13·B20 = 14. Açık 35−14 = 21.
> **CC: bu aritmetiği yazmadan önce dosyadan doğrula** (D6 vakası — başlık sayımı bir kez
> zaten yanlıştı). Tutmuyorsa DUR.

### 2b — Sahiplik tablosu

**Çapa:** `| **Claude.ai (ADIM 3b)** | B05 · B06 · B13 · B20 |`
**Yeni:**
```
| **Claude.ai** | B35 |
```

**Çapa:** `| **CC (dilimleme sonrası)** | B33 |`
**Yeni:**
```
| **CC (dilimleme sonrası)** | B33 |
| **CC (kod teyidi)** | B34 |
```

### 2c — Dört borcun kapanışı

Bloklar **silinmiyor** — nasıl kapandığı bilgisi işe yarar (KARAR 61/88 ruhu).
Başlık satırına damga, `Eylem` satırından sonra `Sonuç` eklenir.

| çapa (başlık) | yeni başlık |
|---|---|
| `## B05 — KARAR 146 / 188 numara çakışması` | `## B05 — KARAR 146 / 188 numara çakışması ✅ KAPANDI (7 Ağu, ADIM 3b)` |
| `## B06 — KARAR 114 halefi belirsiz` | `## B06 — KARAR 114 halefi belirsiz ✅ KAPANDI (7 Ağu, ADIM 3b)` |
| `## B13 — Tanımsız üç numara: 154 · 196 · 251` | `## B13 — Tanımsız üç numara: 154 · 196 · 251 ✅ KAPANDI (7 Ağu, ADIM 3b — 251 hariç, artığı B-yok)` |
| `## B20 — Tanım envanterde olmayan 17 numara` | `## B20 — Tanım envanterde olmayan 17 numara ✅ KAPANDI (7 Ağu, ADIM 3b)` |

**Sonuç satırları** — her biri, işaret edilen `Eylem` satırının **hemen ardına**:

Çapa (B05): `- **Eylem:** ADIM 3'te kronoloji dilimlenirken düzeltilir; kaynak satıra dokunulmaz (KIRPMA YASAĞI), düzeltme tsv tarafında yaşar.`
Ardına ekle:
```
- **Sonuç (7 Ağu):** Çakışma YOKTU. İkinci geçiş (`ocak-kronoloji.md:3558`) 146'nın kendi doğurduğu TS `(window as any)` borcunun 31 Mayıs kapanış **geri-referansı**. 188'in kendi section başlığı ayrıca var (`2026-05.md:3276`). Ledger'dan `⚠188 çakışma` bayrağı kaldırıldı; 188'e dokunulmadı.
```

Çapa (B06): `- **Eylem:** ADIM 3'te kronolojinin ilgili bloğu okunup `→N` kesinleştirilir.`
Ardına ekle:
```
- **Sonuç (7 Ağu):** Halef **366**. Kanıt `2026-07.md:852` — dönemin kendi supersede satırı. Supersede **kısmi** kalıyor: 114 parity `/etkinlik/[slug]` hero'sunda hâlâ uygulanıyor (`2026-07.md:206`).
```

Çapa (B13): `- **Eylem:** ADIM 3'te kronolojinin ilgili dönem bloğu okunup tanım çıkarılır. Aynı şey 400 ve 407 için de geçerli (ikisi bölüm başlığında sınır).`
Ardına ekle:
```
- **Sonuç (7 Ağu):** 154 · 196 · 223 · 400 · 407 tanımlandı. **251 tanımsız kaldı** — #38 dönem bloğunun ilk numarası, blok içi tekil etiket yok; aday ledger'a not düşüldü, tahmin edilmedi (KARAR 456). Kalan artık yeni borç açmıyor: TEYITSIZ satır kendi kuyruğunda erir.
- **Kök sebep:** 400/407 doküman hatası değildi — ADIM 1'in ilk geçişi bölüm başlığıydı, tanım 1-8 satır altındaydı. Envanter aracının siniri, kaydın eksikliği değil.
```

Çapa (B20): `- **Eylem:** ADIM 3'te ilgili dönem blokları okunur. B13 (154·196·223·251·400·407) ile aynı iş.`
Ardına ekle:
```
- **Sonuç (7 Ağu):** İki grup ayrıştı. **Gerçek boşluk 6** (62·64·66·67·68·179) — altı master dosyada 0 geçiş, bağımsız doğrulandı → `KULLANILMADI`. **Blok üyesi 10** (159·160·164·170·171·172·237·238·247·248) — tanımları blok içinde yaşıyor, tekil ayrım kaynakta YOK → yeni `⊂N` konvansiyonu, durum blok çapasından devralındı. 247/248 tek commit'e kadar daraldı (`934afbf` / `7d8486c`).
- **D9:** bu maddenin kendi metni "Grup atfı içinde eriyenler (**11**)" diyor, listede **10** numara var. Sayım hatası — başlıktaki "17" de bu yüzden şişik. Kapanışta düzeltildi.
```

### 2d — B33'e sıra şartı

Çapa: `- **Ön koşul KARŞILANDI:** `docs/_arsiv/kronoloji-satir-esleme.tsv` üretildi —`
**Bu satırdan önceki** `- **Çözüm:**` bloğunu bozmadan, bölümün sonuna ekle
(çapa: `  (5675/5675, sapma 0). Bu borç artık kapatılabilir.`, ardına):

```
- **SIRA ŞARTI (KARAR 465, 7 Ağu):** ADIM 3b patch'i **ÖNCE**, B33 dönüşümü **SONRA**,
  ayrı commit. Gerekçe: 3b patch'inin çapaları bugünkü tsv'ye karşı yazıldı ve
  dokunduğu satırların çoğunda `kaynak` sütunu hâlâ `ocak-kronoloji.md:NNNN` biçiminde.
  B33 önce koşarsa o çapaların tamamı kırılır — mühürlenen kararın birebir ihlali.
  Ayrıca 386 satırlık mekanik diff, ~35 satırlık anlamsal diff'i gömer ve bisect'i öldürür.
- **SAYIM ŞARTI:** brief 386'yı sabitlemesin. ADIM 3b patch'i o satırların bir kısmını
  zaten yeni formata çevirdi. CC ADIM 0'da **yeniden saysın** ve raporlasın (KARAR 465).
```

### 2e — İki yeni borç

`## B33 —` bölümünün sonuna, `---` ayracından **önce** ekle:

```markdown
## B34 — KARAR 143 ve 350: kod teyidi
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
```

### 2f — Kuyruk dipnotu

Çapa: `Ek: KARAR 380, 350, 143 satırları ledger'da `TEYITSIZ`. Sebep doküman hatası değil,`
Bu üç satırlık bloğun tamamını değiştir. Yeni:

```
Ek ✅ (7 Ağu, ADIM 3b): KARAR 380 çözüldü → `AKTIF`. KARAR 350 ve 143'ün **karar metinleri
doğrulandı**; kalan belirsizlik doküman değil kod sorusu → **B34**. Teşhis doğruydu:
sebep kaydın eksikliği değil, brief'te beklenen kanıtın çıkarımdan üretilmiş olmasıydı.
Bu gözlem KARAR 465'in doğrudan kaynağıdır.
```

---

## 3. `docs/90-kronoloji/2026-08.md` — APPEND

Append-only, çakışma yok. Dosya sonuna ekle:

```markdown

---

## ADIM 3b — KARAR ARKEOLOJİSİ (7 Ağustos 2026)

Ledger'daki 27 TEYITSIZ satırın büyük kısmı kaynak metinden çözüldü. Girdi: kronoloji
dilimleri (`00-devir` · `2026-05` · `2026-06` · `2026-07` · `2026-08`) + `ocak-referans.md`
+ geçiş planı. **Yöntem:** KARAR 456 — doğrulanamayan satır yazılmaz, emin olunmayan
numara TEYITSIZ kalır, bulunamayan tanım "bulunamadı" olarak kaydedilir.

**Sonuç:** TEYITSIZ **27 → 3** (251 · 143 · 350) — kalan üçü de kendi eriticisine bağlı:
251 kayıtsız, 143 ve 350 B34'e. `KULLANILMADI` 6, `REZERVE` 1 satır ilk kez kullanıldı.

**Enum düzeltmesi.** Geçiş planı `durum` enum'unu **yedi** değerle yazmıştı; KARAR 456'nın
kanonik metni (`2026-08.md:128`) **dokuz** diyor — `KULLANILMADI` ve `REZERVE` düşmüştü.
Kanon kronolojide, plan özettir (KARAR 102). ADIM 2 bu iki değeri hiç kullanmamıştı;
ADIM 3b ikisini de kullandı.

**B05 — çakışma yoktu.** KARAR 146 = Brief I.1 GTM container iskeleti. İkinci sanılan
tanım (`ocak-kronoloji.md:3558`) 146'nın kendi doğurduğu TS `(window as any)` borcunun
kapanış **geri-referansıdır** (`f6fee7b`, 31 Mayıs). KARAR 188'in kendi section başlığı
ayrıca vardır. ADIM 1 envanteri "KARAR 188-192 bloğu içinde geçen KARAR 146"yı rakip
tanım saydı. **Ders: geri-referans ile tanım aynı regex'e düşer; blok başlığı bağlam
değil, sadece komşuluktur.**

**B06 — halef 366.** `2026-07.md:852` dönemin kendi supersede satırı tek numaraya
iniyordu; okunmamıştı. Supersede kısmi kalır — 114 parity `/etkinlik/[slug]` hero'sunda
hâlâ canlı.

**B13/B20 — dört sınıf çıktı, tek liste değildi.** (a) Gerçek dizi boşluğu 6: 62·64·66·67·68·179,
altı master dosyada 0 geçiş → `KULLANILMADI`. ADIM 1 bunu zaten önermişti, ADIM 2
uygulamamıştı. (b) Tanımı bulunan 5: 154·196·223·400·407 — TEYITSIZ olma sebepleri
doküman hatası değil, ADIM 1'in ilk geçişinin bölüm başlığı olmasıydı. (c) Tanımsız
kalan 1: 251. (d) Blok üyesi 10 — tanımları blok içinde yaşıyor, tekil ayrım kaynakta yok.

**`⊂N` konvansiyonu (yeni).** `iliski` sütununda blok üyeliği işaretlenir; `baslik` bloğun
başlığını taşır; `durum` blok çapasından devralınır ve bu devralma açıkça beyan edilir.
Gerekçe: üyelik **doğrulanabilir bir gerçektir** — TEYITSIZ tutmak onu saklar ve kuyruğu
suni olarak uzun gösterir; ama tekil başlık uydurmak KARAR 456'yı çiğner. `⊂` ikisinin
arasındaki dürüst yerdir.

**447 başlığı yanlıştı.** Ledger'daki başlık kararın son cümlesindeki **parantez içi
çekinceden** alınmıştı. Gerçek karar: *"Push'u hizmete, pull'u pazarlamaya ver"* —
duyuru WhatsApp Kanalı, hatırlatma utility template, genel pazarlama push'u yapılmaz,
grup broadcast için asla. Maliyet gerçeği kayda değer: **1 Ekim 2026'dan itibaren
açık-pencere utility mesajları da ücretlenecek** (B19 hattını ilgilendirir).

**458 atlanmamıştı.** Geçiş planında kadro tablosu numarasızdı; numara kronolojide
veriliyordu (`2026-08.md:132` — agent/skill kadrosu + iki-yüzey mimarisi). "Boşluğun
kendisi bulgu" hipotezi yanlış çıktı: boşluk yalnız planda, kanonda değil.

**454 sahte satırdı — `REZERVE`'e döndü.** ADIM 1 454'ü açıkça REZERVE ilan etmişti
(429-453 mühürlü, çakışma riski alınmadı). Ledger'da yine de bir karar taşıyordu:
"Hesap adı oynak, ID kanonik — GitHub numeric `261375117`", kaynak
`90-kronoloji/2026-08.md`. **Gösterilen kaynak o içeriği taşımıyor** — dize tüm master
dosyalarda yalnız `ocak-referans.md:2050`'de, orada da karar değil `git config` noreply
email'inin parçası. İlke ayrıca **zaten numaralı**: KARAR 389, neredeyse birebir aynı
cümle. Satırın kendi `iliski` sütunu bile `↔389` diyordu.

> Bu, geçiş planının risk tablosundaki *"tsv'de yanlış durum otoriter görünür, kimse
> arkasına bakmaz"* maddesinin ilk gerçek vakasıdır. `kaynak` sütunu zorunluydu ve
> dolduruldu — ama **doldurulmak doğrulanmak değildir.** Zorunlu alan, doğrulanmamış
> içeriği meşru gösteren bir kılıf hâline gelebiliyor. KARAR 456'nın "doğrulanamayan
> satır yazılmaz" kuralı bir alan kontrolü değil, bir okuma yükümlülüğüdür.

**Yeni borçlar:** B34 (143 + 350 kod teyidi, CC) · B35 (KARAR 87 üç ayrı şeye atfediliyor;
`00-durum.md`'nin ODA_MAP işaretçisi kırık). B35 bu turda kapsama alınmadı — kapsam
genişletmesi KARAR 52 ihlali olurdu.

**B33 sırası karara bağlandı:** ADIM 3b patch'i önce, dönüşüm sonra, ayrı commit.
Gerekçe kararın kendisinde (KARAR 465).

- **KARAR 465 — ÇAPA TEKİLLİĞİ VE DOĞRULAMA DİSİPLİNİ (KALICI):** Patch çapası **tek
  satırdan** alınır ve dosyada **benzersiz** olmalıdır; blok-sonu dizeleri, girintili
  satırlar ve birden çok yerde geçen ifadeler çapa olamaz. Doğrulama kriteri ve sayı
  beyanı **dosyanın gerçek hâline karşı** yazılır, beklentiden değil — "N → 0" biçimindeki
  grep kriterleri, aranan dizenin korunması gereken tarihsel anlatımda da geçip geçmediği
  kontrol edilmeden yazılmaz. KARAR 355 ailesinin **patch katmanındaki** karşılığı:
  355 kod teşhisini `dist/`e bağlar, 465 doküman patch'ini dosyanın kendisine bağlar.
  *Vaka (6 Ağustos, üç kez): (a) B32 çapası blok-sonu dizesiydi ve girintiliydi, betik
  durdu; (b) D2 grep kriteri "176/176 → 0" diyordu ama satır iki yerde geçiyordu, biri
  korunması gereken tarihsel anlatımdı; (c) B33 brief'i "~200 kırık referans" tahmin
  etti, gerçek **386** çıktı. Üçünde de CC durdu, dosyaya yazılmadı — disiplin işledi,
  bu yüzden mühürleniyor.* İlişki: `←355 · ↔462`.

**Sıfır kod commit'i. Marka çekirdeği DEĞİŞMEDİ. Referans DEĞİŞMEDİ.**
```

---

## 4. `docs/00-durum.md` — HEDEFLİ

Dört tekil değişim. Dosya 134 satır, tavan 200 (KARAR 457) — net etki ≈ +1 satır.

**4a.** Çapa: `**Son güncelleme:** 6 Ağustos 2026 · ADIM 3 (Pilot bölündü) + ADIM 0 teyidi · **KARAR 464 mühürlendi**`
Yeni: `**Son güncelleme:** 7 Ağustos 2026 · ADIM 3b (KARAR arkeolojisi) · **KARAR 465 mühürlendi**`

**4b.** Çapa (iki satır, birlikte):
```
- **ADIM 3b ⏭** — KARAR arkeolojisi: B05 · B06 · B13 · B20 (20+ tanımsız/çakışan numara).
  Kronolojinin ilgili dönem bloklarını okumayı gerektirir. **Sıradaki iş.**
```
Yeni:
```
- **ADIM 3b ✅** — KARAR arkeolojisi. TEYITSIZ 27 → 3. B05·B06·B13·B20 kapandı;
  454 sahte satırı `REZERVE`'e döndü. Kalan: **B33** (ledger `kaynak` dönüşümü, CC,
  ayrı commit — 3b'den SONRA, KARAR 465) → sonra **B32**. **Sıradaki iş B33.**
```

**4c.** Çapa: `| KARAR arkeolojisi (ADIM 3b) | Claude.ai |`
Yeni: `| Ledger kaynak dönüşümü (B33) + kod teyidi (B34) | CC |`

**4d.** Çapa: `- **`ODA_MAP` kapalı settir** — kod tarafı girdi yoksa yeni Notion sayfası 404. → KARAR 87`
Yeni: `- **`ODA_MAP` kapalı settir** — kod tarafı girdi yoksa yeni Notion sayfası 404. → **numara teyitsiz, B35** (KARAR 87 üç ayrı şeye atfediliyor)`

---

## 5. COMMIT

Tek commit, `--no-ff` gerekmez (dal içi).

```
docs(kararlar): ADIM 3b — KARAR arkeolojisi, KARAR 465 mühürlendi

TEYITSIZ 27 → 3. B05/B06/B13/B20 kapandı.
- 146/188 çakışması yanlış alarmdı (geri-referans, tanım değil)
- KARAR 114 halefi → 366 (kısmi)
- 6 dizi boşluğu → KULLANILMADI, 10 blok üyesi → yeni ⊂N konvansiyonu
- 154/196/223/400/407/458 tanımlandı; 251 tanımsız kaldı (tahmin edilmedi)
- 447 başlığı düzeltildi (parantez içi çekinceden alınmıştı)
- 454 sahte satırı REZERVE'e döndü — kaynak içeriği taşımıyordu
- yeni: B34 (kod teyidi), B35 (KARAR 87 atıf karışıklığı), D9

B33 bu commit'e DAHİL DEĞİL — sıra şartı KARAR 465'te.
```

---

## 6. UYGULAMA SONRASI DOĞRULAMA

```bash
# enum dağılımı — KULLANILMADI 6, REZERVE 1 ilk kez görünmeli
awk -F'\t' 'NR>1{print $4}' docs/01-kararlar.tsv | sort | uniq -c | sort -rn

# TEYITSIZ 27 → 3 olmalı (kalan: 251 · 143 · 350)
grep -c $'\tTEYITSIZ\t' docs/01-kararlar.tsv     # 3

# 465 tek satır
grep -c -P '^465\t' docs/01-kararlar.tsv     # 1

# satır sayısı 465 → 466
wc -l docs/01-kararlar.tsv

# ⊂ tam 10 satırda
grep -c '⊂' docs/01-kararlar.tsv             # 10

# 00-durum tavan kontrolü
wc -l docs/00-durum.md                       # ≤200
```

**Herhangi biri sapıyorsa commit'leme — raporla.** Beklenen sayı ile gerçek sayı
çelişirse gerçek kazanır (KARAR 102), ve beyan eden bu dosyadır — düzeltilecek olan da
bu dosyadır, `docs/` değil (KARAR 465).

---

## 7. SONRAKİ

1. **B33** — ledger `kaynak` dönüşümü. Ayrı brief, ayrı commit, **bu patch'ten sonra**.
   Sayımı ADIM 0'da yeniden yapsın (386 artık geçerli değil).
2. **B34** — 143 + 350 kod teyidi. Ucuz, iki grep.
3. **B32** — `ocak-referans.md` (3574 satır) → `20-ref-*` birleştirme. Claude.ai, ayrı sohbet.
4. **ADIM 4** — repoya tam taşıma + `baglam.sh`. B01 buna bağlı.
