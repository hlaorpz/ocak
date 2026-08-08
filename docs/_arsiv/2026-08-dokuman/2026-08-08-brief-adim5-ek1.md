# EK-1 — `2026-08-08-brief-adim5-skills.md` DÜZELTMESİ

**Tetikleyici:** ADIM 5 ADIM 0 raporu, Ç1 · Ç2 · Ç3 + tasarım sorusu.
**Kapsam:** Yalnız Bölüm 5 (Commit 4). Bölüm 2, 3, 4 **değişmedi** — onaylı, olduğu gibi koşulur.

Ana brief'i açık tut; bu dosya onun üç bloğunu değiştirir ve bir bölüm ekler.

---

## D1 — Bölüm 5.2: B43 bloğunu DEĞİŞTİR

Ana brief'teki `## B43 — ...` ile başlayan blok, bir sonraki `## B44` başlığına kadar,
**tamamen** aşağıdakiyle değişir:

```markdown
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
```

---

## D2 — Bölüm 5.2: B44 bloğunu DEĞİŞTİR

Ana brief'teki `## B44 — ...` ile başlayan blok, bir sonraki `## B45` başlığına kadar,
**tamamen** aşağıdakiyle değişir:

```markdown
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
```

---

## D3 — Bölüm 5.2: B45 bloğunu DEĞİŞTİR

Ana brief'teki `## B45 — ...` ile başlayan blok, kod bloğunun sonuna kadar,
**tamamen** aşağıdakiyle değişir:

```markdown
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
```

---

## D4 — Bölüm 5.4: kronoloji append'inde TEK CÜMLE DEĞİŞİMİ

Çapa (ana brief'in kronoloji bloğunda, tek geçer):

```
**Yan bulgular:** B43 (`10-marka.md`'de iki ölü Pilot işaretçisi), B44
```

Bu satırla başlayan **iki cümlelik paragrafın tamamı** şununla değişir:

```markdown
**Yan bulgular, üçü de ADIM 0'da genişledi.** B43 — `10-marka.md:174` ve `:235` ölü
Pilot işaretçisi; ikincisinin hedefi tam karşılığı yok ("tampon", "lansman sonrası
roadmap" evsiz kavramlar). B44 — bayat `@ocak.life` **beş canlı dosyada**, brief yalnız
birini saymıştı; ama eşleşmelerin bir kısmı tarihsel kayıttır ve korunur
(`10-marka.md:3` sürüm notu değişikliğin kendisini anlatıyor). **Kapanış kriteri
`grep -c` sıfır değil, sınıflandırma tablosu** — KARAR 465'in "korunması gereken
tarihsel anlatım" uyarısının ilk somut vakası, ve `ocak-lint`'in `istisna` sütununun
ilk tatbiki. B45 — `baglam.sh` bayt/karakter etiketi iki satırda (`:65` hesap,
`:67` etiket).
```

---

## D5 — YENİ BÖLÜM 5.6: geçiş planı sapma kaydına satır

Bölüm 5.5'ten **sonra**, Commit 4'ten **önce** yapılır.

`docs/2026-08-06-ocak-gecis-plani.md` içinde çapa (tek geçer, satırın başı):

```
| 10 | 6-ek maddesindeki `2026-02.md` + `00-devir.md` endişesi
```

Bu satırın **hemen ardına** ekle:

```markdown
| 11 | HEDEF YAPI ağacı `docs/skills/` altında **beş** skill sayıyor | **üçü doğdu** (`ocak-arsivci` · `ocak-teshis` · `ocak-lint`, ADIM 5, 8 Ağu). `ocak-kararci` + `ocak-metin` eksik değil, **ADIM 6'ya ait** (KARAR 458) — ağaca bakıp "iki dizin kayıp" diye okumak yanlıştır. Ayrıca `ocak-notion` skill **tablosunda var, ağaçta yok** ve hiçbir ADIM kapsamına girmiş değil: sahipsiz, çözülmemiş |
```

Gerekçe: sapma kaydının kendi kuralı *"Plandan brief yazan, önce bu listeyi okur."*
ADIM 6 brief'ini yazan, iki dizinin yokluğunu eksiklik sanmamalı. `ocak-notion`'un
sahipsizliği de bugüne kadar hiçbir dosyada yazılı değildi.

```bash
cd ~/Desktop/hlaorpz/ocak-site-clone
grep -c '^| 11 |' docs/2026-08-06-ocak-gecis-plani.md   # 1
```

---

## D6 — Commit 4 mesajını DEĞİŞTİR

Ana brief'teki Commit 4 mesajı şununla değişir:

```
docs(adim5): ledger 473 + B42 kapanışı + B43/B44/B45 + sıra + kronoloji + sapma kaydı

KARAR 473 — skill senkron sözleşmesi. Kanonik docs/skills, CC yüzeyi symlink,
--check zip yüzeyini denetler.

B42 ✅ kapandı. B43 · B44 · B45 açıldı; üçü de ADIM 0 raporunda genişledi.
B44 beş canlı dosyada geçiyor ama sweep yasak — eşleşmelerin bir kısmı tarihsel
kayıt (10-marka.md:3 sürüm notu değişikliğin kendisini anlatıyor). Kapanış
kriteri grep sıfır değil, sınıflandırma tablosu (KARAR 465).

Geçiş planı sapma kaydına 11. satır: HEDEF YAPI beş skill sayıyor, üçü doğdu,
ikisi ADIM 6'ya ait — eksiklik değil. ocak-notion sahipsizliği ilk kez yazılı.

00-durum.md dönem HEAD satırı bu commit'ten önce ölçüldü — KARAR 468'in bölüm
sırası ilk kez tatbik edildi. Önceki tur f42911f yazmış, tur 76e8bee ile
kapanmıştı.
```

---

## D7 — Bölüm 6 doğrulamasına EK

Ana brief'in doğrulama bloğuna üç satır eklenir:

```bash
cd ~/Desktop/hlaorpz/ocak-site-clone
grep -c '^| 11 |' docs/2026-08-06-ocak-gecis-plani.md          # 1
grep -c '^## B4[345] ' docs/02-borclar.md                       # 3
grep -c 'sınıflandırma tablosu' docs/02-borclar.md              # ≥1
```

---

## DEĞİŞMEYEN

Bölüm 0 · 1 · 2 · 3 · 4 · 5.1 · 5.3 · 5.5 · 7 · 8 ana brief'teki hâliyle kalır.
Ledger yine **473 → 474** satır; `ek-karar-473.tsv` aynı.
Commit sayısı yine **dört** — sapma kaydı Commit 4'e girer, ayrı commit açılmaz.

## ONAY

Ç1 · Ç2 · Ç3 ve tasarım sorusu bu dosyayla kapandı. Bölüm 2'den devam et.
