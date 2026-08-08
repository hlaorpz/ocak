# B32 — DÜZELTME 04 · dağıtılmamış iki dosya

**8 Ağustos 2026.** Kapanış sonrası bulgu. **Tek commit**, yedincisi.
Kod dokunuşu yok. Yeni borç açar, kuyruğu günceller, kronolojiye kaydeder.

---

## BULGU

ADIM 4'ün açılış paketi hazırlanırken project files envanteri çıkarıldı. **İki dosya
hiçbir turda dağıtılmadı ve hiçbir hedefi tanımlı değil:**

| dosya | satır | içerik |
|---|---|---|
| `ocak-kaynak-kanonu.md` | 172 | "Dört Yön, Bir Ocak" kanonu · anlatı yayı · yönlerin derin dosyası · yayılma haritası · Yolculuk eşleşmesi · tema havuzu · **ad kökü / etimoloji (`/adimiz` sayfası)** |
| `Ocak-Mufredat.md` | 275 | Advaita'nın beş yön müfredatı — her yön için kaynak derinliği · OCAK köprüleri · format önerileri · çalışma sırası + etik pusula |

**Ölçüm (8 Ağustos):** iki dosyanın 232 anlamlı satırından (60+ karakter) **231'i**
dağıtılmış hiçbir kaynakta yok — `ocak-referans.md` v46, `10-marka.md`, beş kronoloji
dilimi ve `00-devir.md` birlikte tarandı, 7-kelimelik shingle örtüşmesi.

`2026-08-06-ocak-gecis-plani.md` ikisini **ölçüm bloğunda sayıyor** ama **HEDEF YAPI'da
hedefleri yok.** ADIM 3 Pilot'u, B32 Referans'ı dağıttı; bu ikisi hiçbir adımın kapsamına
girmedi. Sessiz atlama — kimse kırpmadı, kimse de sahiplenmedi.

**Kilit:** KARAR 455 "ADIM 4 sonrası project files'ta yalnız `10-marka.md` kalır" diyor.
O temizlik bu iki dosya dağıtılmadan yapılırsa **447 satır silinir** — KIRPMA YASAĞI
ihlali (KARAR 61/88). **B39, ADIM 4'ün project-files temizliği adımını kilitler.**

---

## A · `02-borclar.md` → yeni blok: B39

`## B38`'den **sonra**:

```markdown
## B39 — `ocak-kaynak-kanonu.md` + `Ocak-Mufredat.md` dağıtımı

- **Sahip:** Claude.ai · **Tetikleyici:** ADIM 4'ün project-files temizliğinden **önce.**
- **Sorun:** İki project file hiçbir turda dağıtılmadı. ADIM 3 Pilot'u, B32 Referans'ı
  dağıttı; bu ikisi hiçbir adımın kapsamına girmedi. Geçiş planı ikisini ölçüm bloğunda
  sayıyor ama HEDEF YAPI'da hedefleri yok.
- **Ölçüm (8 Ağustos 2026):** `ocak-kaynak-kanonu.md` 172 satır · `Ocak-Mufredat.md`
  275 satır. 232 anlamlı satırın **231'i** dağıtılmış hiçbir kaynakta yok
  (`ocak-referans.md` v46 + `10-marka.md` + beş kronoloji dilimi + `00-devir.md`
  birlikte tarandı). Mükerrer değil — gerçekten evsiz.
- **Neden kilitleyici:** KARAR 455 gereği ADIM 4 project files'ı `10-marka.md` dışında
  temizleyecek. Dağıtım önce gelmezse 447 satır silinir (KIRPMA YASAĞI, KARAR 61/88).
- **Muhtemel hedefler** (kesim anında kararlaşır, şimdi bağlayıcı değil):
  müfredat → `20-ref-program.md` · kanon anlatısı ve ad kökü → `20-ref-marka.md` ·
  `/adimiz` sayfa tarifi → `20-ref-site.md` · tema havuzu → içerik motoru olduğu için
  `20-ref-icerik-dili.md` adayı.
- **Yöntem:** B32 deseni — envanter, çakışma listesi, bölme haritası, `sed` ile
  satır-aralığı kopyalama, `_arsiv/`'e taşıma. Ledger dönüşümü aynı turda (KARAR 467);
  `kaynak` sütununda bu iki dosyayı gösteren satır olup olmadığı **sayılmadı**, B39'un
  ADIM 0'ında sayılır.
- **Kaynak:** ADIM 4 açılış paketi hazırlığı, 8 Ağustos 2026.
```

Dosya başındaki sahiplik tablosuna: `| **Claude.ai** | B35 · B36 · B38 · B39 |`

---

## B · `03-sira.md` → kuyruk yeniden sıralanır

**B.1** — Doküman kuyruğu tablosunda **ADIM 4 satırının hemen üstüne** yeni satır;
sonraki numaralar birer kayar:

```markdown
| 1 | **B39** — `ocak-kaynak-kanonu.md` + `Ocak-Mufredat.md` dağıtımı (447 satır, evsiz) | Claude.ai | ayrı sohbet | yok | `02-borclar.md` B39 — B32 deseni |
```

**B.2** — ADIM 4 satırının "ön koşul" hücresi:

```
ESKİ: | ... **ADIM 4** — repoya tam taşıma + `CLAUDE.md` + `baglam.sh` | CC | repo | yok | ... |
YENİ: | ... **ADIM 4** — repoya tam taşıma + `CLAUDE.md` + `baglam.sh` | CC | repo | **project-files temizliği B39'a kilitli** | ... |
```

**B.3** — Tablonun altındaki cümle güncellenir:

```
ESKİ: **Hiçbiri ADIM 4'ü kilitlemiyor.** ADIM 4 kuyruğun başındadır; B35 · B36 · 251 sırası tercih meselesidir. B38 tanımı gereği sonuncudur.
YENİ: **B39 ADIM 4'ün yalnız project-files temizliği adımını kilitler** — `CLAUDE.md`, `baglam.sh` ve ölçüm dosyası B39'suz yazılabilir. B35 · B36 · 251 sırası tercih meselesidir. B38 tanımı gereği sonuncudur.
```

**B.4** — "SIRADAKİ İŞ" bloğuna, mevcut metnin **altına** tek satır:

```markdown
⚠ **B39 açıldı** — iki project file (447 satır) hiç dağıtılmamış. ADIM 4'ün brief'i
yazılabilir, ama **project-files temizliği B39'dan önce çalıştırılmaz** (KARAR 455 +
KIRPMA YASAĞI).
```

---

## C · `2026-08-06-ocak-gecis-plani.md` → sapma kaydına altıncı satır

SAPMA KAYDI tablosunun sonuna:

```markdown
| 6 | ölçüm bloğu `ocak-kaynak-kanonu.md` (172) ve `Ocak-Mufredat.md` (275) sayıyor | **HEDEF YAPI'da ikisinin de hedefi yok** — hiçbir ADIM kapsamına almadı. 447 satır evsiz; B39 açıldı | 8 Ağustos ölçümü |
```

Ve tablonun altındaki paragrafın sonuna:

```markdown
**Altıncısı planın kendi kör noktası:** ölçüm bloğu yedi dosya sayıyor, HEDEF YAPI beşine
ev veriyor. `ocak-site-icerik.md` `_uretilen/`'e gidiyor (türetilmiş), `ocak-marka.md`
`10-marka.md` oluyor — ama kaynak kanonu ve müfredat hiçbir kutuya düşmüyor. Planı yazan
sohbet bunu fark etmedi; üç tur sonra ADIM 4 hazırlığında görüldü.
```

---

## D · `90-kronoloji/2026-08.md` → append

B32 bloğunun **sonuna**, ayrı paragraf:

```markdown
**Kapanış sonrası bulgu — iki dosya hiç dağıtılmamış (8 Ağustos).** ADIM 4'ün açılış
paketi hazırlanırken project files envanteri çıkarıldı ve `ocak-kaynak-kanonu.md` (172
satır) ile `Ocak-Mufredat.md` (275 satır) hiçbir turun kapsamına girmediği görüldü.
Ölçüm: 232 anlamlı satırın **231'i** dağıtılmış hiçbir kaynakta yok. Geçiş planı ikisini
ölçüm bloğunda sayıyor ama HEDEF YAPI'da hedefleri yok — planın kendi kör noktası.

**B39 açıldı ve ADIM 4'ü kısmen kilitliyor:** KARAR 455 gereği project files
`10-marka.md` dışında temizlenecek; dağıtım önce gelmezse 447 satır silinir.
`CLAUDE.md`, `baglam.sh` ve ölçüm dosyası B39'suz yazılabilir, temizlik yazılamaz.

**Ders — dağıtım işleri kaynak envanteriyle açılmalı, hedef envanteriyle değil.** ADIM 3
Pilot'u, B32 Referans'ı dağıttı; ikisi de "bu dosyayı nereye böleyim" sorusuyla açıldı.
Hiçbiri "dağıtılmamış ne kaldı" sorusunu sormadı. Sorulsaydı bu iki dosya üç tur önce
görülürdü.
```

---

## E · COMMIT

```
docs(b32): kapanış sonrası bulgu — B39, dağıtılmamış 447 satır

ocak-kaynak-kanonu.md (172) + Ocak-Mufredat.md (275) hiçbir turun
kapsamına girmemiş. Ölçüm: 232 anlamlı satırın 231'i dağıtılmış hiçbir
kaynakta yok. Geçiş planının HEDEF YAPI'sında hedefleri tanımsız.

B39 açıldı, kuyruğun başına alındı. ADIM 4'ün project-files temizliği
adımı B39'a kilitlendi (KARAR 455 + KIRPMA YASAĞI) — CLAUDE.md, baglam.sh
ve ölçüm dosyası kilitli değil.

Sapma kaydına altıncı satır, kronolojiye ders paragrafı.

KARAR 61/88 · 455 · 465
```

Sonra:

```bash
wc -l docs/00-durum.md    # ≤200
git push
```

Rapor: commit hash + `03-sira.md`'nin doküman kuyruğu tablosunun son hali.
