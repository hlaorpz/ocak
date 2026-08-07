# CC BRIEF — B34 · KARAR 143 VE 350'NİN KOD TEYİDİ

**Sahip:** CC
**Ön koşul:** B37 commit'i main'de
**Disiplin:** **KARAR 355 / 408** (durum `dist/`ten okunur, component dosyasından değil) · KARAR 465 (sayı dosyadan)

Yanında: `ek-d-b34-kosullu-satirlar.tsv` — **koşulludur, körlemesine uygulanmaz.** §4'e bak.

---

## 0. NEDEN

ADIM 3b iki kararın **metnini** doğruladı ama **durumunu** doğrulayamadı. Kalan
belirsizlik arkeolojide değil kodda — bu yüzden Claude.ai'de çözülemez, `dist/` gerekir.

Ledger'da TEYITSIZ 3 satır kaldı: **251** (kaynak metin yok, bu brief'in konusu değil) ·
**143** · **350**. Bu brief ikincisini ve üçüncüsünü hedefler. Başarılıysa TEYITSIZ 3 → 1.

**Bu bir teşhis brief'idir.** İki işten biri "düzeltme" olabilir ama olmayabilir de —
bulgu ne çıkarsa o. Kod değişikliği bu brief'in **hedefi değil**; §5'te dallanıyor.

---

## 1. KARAR 143 — `/test` SAYFASI VE `ODA_MAP`

**Karar ne diyor** (`2026-05.md:2612`, 27 Mayıs, ayrı commit `chore(oda-map)`):
`/test` sayfası `ODA_MAP`'e eklendi. Gerekçe: `ODA_MAP` **kapalı settir**; Notion'da
`Yayınla ✓` olan ama `ODA_MAP`'te karşılığı olmayan sayfa **404 verir** — bu bir kez
fiilen yaşandı (`2026-05.md:1456`, `getOda("/test")` throw, build çatladı).

**Şüphe:** ledger notu "`ODA_MAP` 29 slug, `/test` yok" diyordu. **Çıkarılma hiçbir
kronoloji diliminde kayıtlı değil** — Haziran, Temmuz, Ağustos dilimlerinde tek geçiş yok.
Yani ya belgesiz bir kod değişikliği oldu, ya gözlem yanlıştı.

### Ne ölçülecek

```bash
cd ~/Desktop/ocak-site-clone

# 1. ODA_MAP'in GERÇEK slug seti ve sayısı
grep -n "ODA_MAP" src/lib/oda-map.ts | head
# slug sayısını say — 29 rakamını doğrulama, ÖLÇ

# 2. /test var mı
grep -n "test" src/lib/oda-map.ts

# 3. Yoksa: ne zaman, hangi commit'te, hangi mesajla çıktı
git log --oneline -- src/lib/oda-map.ts
git log -p --follow -S 'test' -- src/lib/oda-map.ts | head -60
#    -S ile "bu dizeyi ekleyen/çıkaran commit" aranır

# 4. dist gerçeği (KARAR 355) — /test route üretiliyor mu
ls dist/test* 2>/dev/null; ls -d dist/test 2>/dev/null
grep -rl "test" dist/*.html 2>/dev/null | head

# 5. Notion tarafı hâlâ yayınlıyor mu — dump'tan bak, tahmin etme
grep -n "^/test\|/test" docs/_uretilen/site-icerik.md 2>/dev/null | head
#    dosya yoksa: en güncel site dump'ı neredeyse oradan
```

### Rapor et

- `ODA_MAP` gerçek slug sayısı (29 mu, başka mı)
- `/test` var mı yok mu
- Yoksa: çıkaran commit hash + tarih + **mesaj metni**. Mesaj gerekçe içeriyor mu,
  yoksa sessiz temizlik mi?
- `dist/`te `/test` route'u var mı
- Notion'da `/test` hâlâ `Yayınla` mı

### Neden lansman meselesi

`2026-05.md:1568` şunu kayda geçmişti: *"Brief I robots.txt `Allow: /` değiştirilince
`/test` public görünür — 'OCAK'ın test sayfası' UX kötü."* Site şu an
`Disallow: /` ile stealth. **Lansman = robots Allow + duyuru** (KARAR 149).

Yani: `/test` hâlâ yayındaysa ve `ODA_MAP`'te de varsa, **robots açıldığı gün public
olur.** Bu, ledger meselesi değil lansman riskidir. Çıkarsa §5c.

---

## 2. KARAR 350 — VİTRİN EMBER ŞERİDİ

**Karar ne diyor** (`2026-07.md:499`): Vitrin sol şeridi `--ash` (silik) → `--ember`,
**3px, STATİK**. Hover/tap efekti **kaldırıldı**. Gerekçe: tıklanmayan blokta dokunma
efekti anlamsız + yanıltıcı — mobilde tap'te yanıp sönüyor, tıklanacakmış gibi duruyordu.

**Şüphe:** ledger notu "`vitrin` selektörü yok" diyordu. Ama bu gözlem **hangi ada
bakıldığını** söylemiyor. Vitrin, KARAR 346'nın beş desen mimarisinden biri
(raf-accordion / **vitrin** / iki-sütun liste / seri kart / yön-kartı) — sınıf adı
`vitrin` olmak zorunda değil.

### Ne ölçülecek

**Sıra önemli: önce gerçek adı bul, sonra ara.** "Yok" demeden önce ne aradığını bil.

```bash
# 1. Vitrin deseninin GERÇEK section kind / sınıf adı nedir
grep -rn "vitrin" src/ | head -20
grep -rn "vitrin" src/lib/remark-ocak-sections.ts src/lib/config.ts 2>/dev/null

# 2. Bulunan ada göre CSS kuralını ara — önce kaynakta
grep -rn "<gerçek-ad>" src/styles/atmosfer.css | head

# 3. ASIL SORU — dist'te var mı (KARAR 408: kod var ≠ output var)
grep -rn "<gerçek-ad>" dist/_astro/*.css | head
#    3px + ember token birlikte geçiyor mu

# 4. Hover/tap kalıntısı — kaldırıldı mı GERÇEKTEN
grep -rn "<gerçek-ad>" dist/_astro/*.css | grep -i "hover\|active\|focus"
#    boş çıkmalı; çıkmıyorsa karar yarım uygulanmış

# 5. KARAR 375 tuzağı — prefix-match
#    [class^="ocak-"] baseline'ı yakalasın diye 'ocak-' İLK class olmalı
grep -rn 'class="[^"]*vitrin' dist/*.html | head -5
#    'ocak-' ilk sırada mı, yoksa baseline sessizce düşüyor mu

# 6. Karar main'e ulaştı mı — Faz 5 desen turu bir dönem astro-iskelet'te bekledi
git log --oneline main --grep="vitrin\|350\|ember şerit" | head
```

### Rapor et

- Vitrin deseninin gerçek sınıf/kind adı
- `dist/`te 3px + ember kuralı var mı
- Hover/tap/active kalıntısı var mı
- `ocak-` prefix ilk sırada mı (KARAR 375)
- İlgili commit main'de mi

---

## 3. DUR VE RAPORLA

**§1 ve §2'nin ölçümlerini yap, raporla, dur.** Ledger'a §4'teki koşullar **birebir**
tutmadan yazma.

Bu brief teşhis odaklıdır; yazma yetkisi dar ve koşulludur.

---

## 4. LEDGER — KOŞULLU YAZMA

`ek-d-b34-kosullu-satirlar.tsv` iki satır taşır. **Her biri yalnız kendi koşulu
birebir tuttuğunda yazılır.** Koşul tutmuyorsa o satırı yazma, dala göre raporla.

### 143 satırı — yazma koşulu

> `/test` **`ODA_MAP`'te MEVCUT** ve `dist/`te route üretiliyor.

Bu durumda ledger notu ("29 slug, /test yok") yanlıştı; karar hâlâ geçerli → `AKTIF`.

**Koşul tutmuyorsa yazma.** Dallar:
- **(a) Açıklayıcı mesajlı commit'le çıkarılmış** → `SUPERSEDE`, `iliski` o commit'i
  taşımalı. Hash'i bilmiyorum, satırı önceden yazamam → **bana raporla**, satırı veririm.
- **(b) Sessizce çıkarılmış** (mesaj gerekçe içermiyor) → aynı şekilde raporla.
  Bu bir bulgudur, kronolojiye yazılır: karar belgesiz geri alınmış.

### 350 satırı — yazma koşulu

> `dist/`te ilgili sınıf için **3px + ember** kuralı var **VE** hover/tap/active
> kalıntısı **yok**.

İkisi birden tutarsa → `AKTIF`.

**Koşul tutmuyorsa yazma.** Dallar:
- **(c) Kural var ama hover/tap duruyor** → karar **yarım uygulanmış**. `ACIK-BORC`,
  ve yeni borç açılır (§5b). Satırı bana raporla.
- **(d) `dist`te kural hiç yok** → karar hiç uygulanmamış ya da geri alınmış.
  Raporla; `IPTAL` mi `ACIK-BORC` mu, bulguya bakarım.

> **Not:** `AKTIF` satırlarının `kaynak` alanı `#k` biçimindedir (KARAR 466) —
> ADIM 3b'de elle doğrulanmıştı, bu brief onu korur, değiştirmez.

---

## 5. `02-borclar.md` — DALA GÖRE

### 5a — B34 kapanışı (her hâlükârda)

Başlık satırının sonuna: ` ✅ KAPANDI (7 Ağu, kod teyidi)`

Maddenin sonuna, **gerçek bulgularla**:
```
- **Sonuç (7 Ağu):** `ODA_MAP` gerçek slug sayısı N; `/test` [var / yok, commit X ile
  çıkarılmış]. Vitrin deseninin gerçek adı `<ad>`; `dist` kuralı [var/yok],
  hover kalıntısı [var/yok]. Ledger: 143 → [durum], 350 → [durum].
  TEYITSIZ 3 → [gerçek sayı].
```

### 5b — Koşullu yeni borçlar

**Yalnız ilgili dal gerçekleşirse aç.** Gerçekleşmeyeni açma — borç enflasyonu
ledger'ın güvenini aşındırır.

**Dal (c) gerçekleşirse — B38:**
```markdown
## B38 — KARAR 350 yarım uygulanmış: hover/tap kalıntısı
- [ ] **Sahip:** CC
- **Sorun:** KARAR 350 hover/tap efektinin kaldırılmasını şart koşuyordu; `dist`te
  `<ad>` için hover/active kuralı hâlâ var. Karar metni ile canlı çıktı çelişiyor.
- **Neden önemli:** tıklanmayan blokta dokunma efekti — kararın kendi gerekçesi.
  Mobilde tap'te yanıp sönüyor, tıklanacakmış gibi duruyor.
- **Eylem:** kuralı kaldır, `dist` teyidi + iPhone Safari eyeball. Küçük CSS işi.
```

**`/test` lansmanda public olacaksa — B39:**
```markdown
## B39 — `/test` sayfası lansmanda public olur
- [ ] **Sahip:** Kaan (Notion) + CC (robots/noindex)
- **Sorun:** `/test` hem `ODA_MAP`'te hem Notion'da `Yayınla ✓`. Site şu an
  `Disallow: /` ile stealth; **lansman = robots Allow** (KARAR 149). Robots açıldığı
  gün "OCAK'ın test sayfası" public görünür.
- **Kaynak:** `2026-05.md:1568` bu riski zaten kayda geçmişti, karar Brief I'ya
  ertelenmiş ve orada kapanmamış.
- **Seçenekler:** Notion `Yayınla` kapat (KARAR 127 deseni) · `Disallow: /test`
  satırı · `noindex` meta. Üçü de ucuz; hangisi Kaan'ın kararı.
- **Tetikleyici:** robots `Allow` commit'inden ÖNCE. Lansman kilit zincirine girer.
```

### 5c — Başlık aritmetiği

**Yazmadan önce dosyadan doğrula.** B34 kapanır (−1 açık). Açılan borç sayısı dala bağlı:
0, 1 veya 2. Sayımı dosyadan yap, brief'ten değil. Tutmuyorsa **DUR**.

---

## 6. `docs/90-kronoloji/2026-08.md` — APPEND

```markdown

---

## B34 — KARAR 143 VE 350 KOD TEYİDİ (7 Ağustos 2026)

ADIM 3b iki kararın metnini doğrulamış ama durumunu doğrulayamamıştı; kalan belirsizlik
kodda olduğu için `dist/` gerekiyordu (KARAR 355/408).

**KARAR 143 (`/test` `ODA_MAP`):** `ODA_MAP` gerçek slug sayısı **N**. `/test` [bulgu].
[Çıkarılmışsa: commit `X`, tarih, mesaj gerekçe içeriyor mu.] Kronolojide çıkarılma
kaydı yoktu — [belgesiz geri alma / gözlem hatası] olduğu böylece belirlendi.

**KARAR 350 (vitrin ember şeridi):** Deseninin gerçek adı `<ad>` — ledger'ın "vitrin
selektörü yok" notu **yanlış ada bakıyordu.** `dist` kuralı [bulgu], hover kalıntısı
[bulgu]. KARAR 375 prefix kontrolü: `ocak-` [ilk sırada / değil].

**Ders:** "selektör yok" beyanı, hangi ada bakıldığı yazılmadan anlamsızdır. KARAR 346'nın
beş deseni koddaki adlarıyla ledger'da yaşamıyor; teşhis her seferinde adı yeniden
bulmak zorunda kalıyor. KARAR 465'in kardeşi: **arama kriteri de dosyanın gerçeğinden
alınır, kavramdan değil.**

**Ledger:** 143 → [durum] · 350 → [durum]. **TEYITSIZ [3 → gerçek sayı]** —
kalan 251, kaynak metni bulunamadığı için (KARAR 456).

**Sıfır kod commit'i.** *(Dal (c) gerçekleşirse: fix ayrı commit, B38.)*
```

---

## 7. COMMIT

```
docs(kararlar): B34 — 143 ve 350 kod teyidi

ODA_MAP gerçek slug seti ölçüldü; /test [bulgu].
Vitrin deseninin gerçek adı <ad> — "selektör yok" notu yanlış ada bakıyordu.
Ledger: 143 → [durum], 350 → [durum]. TEYITSIZ 3 → [N].
```

Kod değişikliği varsa **ayrı commit** — teşhis ile düzeltme karışmaz.

---

## 8. DUR NOKTALARI

1. `ek-d`'deki bir satırı, koşulu birebir tutmadan yazarsan
2. `ODA_MAP` slug sayısını saymadan "29" kabul edersen
3. Vitrin adını bulmadan "selektör yok" dersen — **bu tam olarak düzeltmeye
   çalıştığımız hata**
4. Durumu `dist/` yerine component dosyasından okursan (KARAR 408)
5. Gerçekleşmemiş dal için borç açarsan
6. `02-borclar.md` aritmetiği dosyadan doğrulanmazsa
7. Kod düzeltmesini teşhis commit'ine karıştırırsan
