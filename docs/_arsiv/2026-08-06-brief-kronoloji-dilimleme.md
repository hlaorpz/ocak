# BRIEF — KRONOLOJİ DİLİMLEME

**Sahip:** CC · **Süre:** ADIM 0 ~15 dk · uygulama ~30 dk
**Girdi:** `docs/ocak-kronoloji.md` (5675 satır / ~904 KB, git'te izleniyor)
**Çıktı:** `docs/90-kronoloji/YYYY-AA.md` dilimleri
**Sınır:** `src/` altına dokunulmaz. Tek commit.

---

## ANA KURAL — BAĞLAMDAN GEÇİRME

Bu dosya **hiçbir koşulda** okunup yeniden yazılmaz. Dilimleme **bayt düzeyinde** yapılır:

```bash
sed -n 'A,Bp' kaynak >> hedef     # ✅
cat parca >> hedef                # ✅
cp + append + md5 karşılaştırma   # ✅
```

```
❌ dosyayı okuyup "özetleyerek" yazmak
❌ satırları elle yeniden yazmak
❌ "temizlemek", "düzeltmek", "biçimlendirmek"
```

**KIRPMA YASAĞI (KARAR 61/88) bu dosyanın evidir.** Tek bir karakter değişirse iş
başarısızdır. Bayat, çelişkili, yanlış içerik **olduğu gibi taşınır** — düzeltme
kronolojide değil, türetilmiş katmanda (`00-durum.md`, `01-kararlar.tsv`) yaşar.

---

## ADIM 0 — SALT-READ (yazma yok, raporla ve DUR)

### 0.1 — Başlık envanteri

Dosyanın kesim noktaları hangileri? Şunları çıkar:

```bash
grep -n "^# \|^## " docs/ocak-kronoloji.md | head -120
grep -c "^## Sohbet" docs/ocak-kronoloji.md
grep -n "^# " docs/ocak-kronoloji.md        # üst düzey bölüm sınırları
```

**Rapor et:** kaç üst düzey bölüm var, `## Sohbet #N` kaç tane, başlıkların **tarih
formatı ne** (örn. `## Sohbet #54 (6 Temmuz 2026 — başlık)`).

### 0.2 — Tarih çıkarılabilir mi

Her `## Sohbet` başlığından ay güvenilir şekilde okunabiliyor mu? Okunamayan / tarihsiz
başlıkları **tek tek listele.** Bu kritik: tarihsiz başlık = kesim yapılamaz.

⚠ **Pilot'un uyarısı burada da geçerli:** dump dosya adlarındaki tarihler yazım günüdür.
Ama `## Sohbet` başlıklarındaki tarihler iş penceresidir — bunları kullan. Şüpheli
olanları işaretle, **tahmin etme.**

### 0.3 — Özel bloklar

Dosyada sohbet kaydı olmayan bloklar var:

- `PİLOT'TAN DEVREDİLEN DÖNEM KAYITLARI` (KARAR 397 taşıması)
- `Bölüm B` başlangıcı / eski `ocak-arsiv.md` seam'i
- Varsa başka üst düzey bölümler

**Rapor et:** bunların satır aralıkları ne, hangi aya ait sayılmalılar. Ait olmayanlar
için ayrı bir `90-kronoloji/00-devir.md` önerebilirsin — karar bende.

### 0.4 — Mevcut dilimler

```bash
wc -l docs/90-kronoloji/*.md
head -20 docs/90-kronoloji/2026-07.md
```

Bu üç dosyada **zaten Pilot'tan inen içerik var.** Üzerine yazılmayacak, **altına
append** edilecek. Rapor et: her birinin mevcut satır sayısı ve son satırı.

### 0.5 — Kesim planı taslağı

Yukarıdakilerden şu tabloyu üret ve **DUR**:

| hedef dosya | satır aralığı(ları) | kaç sohbet | ilk başlık | son başlık |
|---|---|---|---|---|
| 2026-0X.md | 1–412 | 8 | ... | ... |

**Aralıkların birleşimi 1–5675 olmalı, boşluk ve örtüşme olmamalı.** Betikle doğrula,
sonucu rapora yaz. Tutmuyorsa **kesme, raporla.**

---

## ADIM 1 — KESİM (onay sonrası)

### 1.1 — Yedek

```bash
cp docs/ocak-kronoloji.md /tmp/kronoloji-yedek.md
md5 /tmp/kronoloji-yedek.md    # (linux: md5sum) — çıktıyı sakla
```

### 1.2 — Her dilim için

Mevcut üç dosyaya (`2026-06/07/08`) **append**, yenilerine **yeni dosya**:

```bash
# yeni dosya örneği
{
  echo "# KRONOLOJİ — 2026-0X"
  echo
  echo "**Kaynak:** \`ocak-kronoloji.md\` satır A–B, dilimleme 6 Ağustos 2026."
  echo "**Append-only.** KIRPMA YASAĞI (KARAR 61/88) — bu dosya düzenlenmez."
  echo
  echo "---"
  echo
} > docs/90-kronoloji/2026-0X.md
sed -n 'A,Bp' /tmp/kronoloji-yedek.md >> docs/90-kronoloji/2026-0X.md

# mevcut dosyaya append örneği
{
  echo
  echo "---"
  echo
  echo "# ocak-kronoloji.md'DEN İNEN BLOK (satır A–B)"
  echo
  echo "*Aşağısı birebir taşımadır. Yukarıdaki Pilot kaynaklı bloklarla aynı dönemi"
  echo "anlatır; çelişki varsa \`01-kararlar.tsv\` ve \`00-durum.md\` üstündür.*"
  echo
} >> docs/90-kronoloji/2026-07.md
sed -n 'A,Bp' /tmp/kronoloji-yedek.md >> docs/90-kronoloji/2026-07.md
```

### 1.3 — Orijinali arşive

```bash
git mv docs/ocak-kronoloji.md docs/_arsiv/ocak-kronoloji-v1.md
```

**SİLİNMEZ.** Denetim izinin diğer ucu — dilimlerin doğruluğu ona karşı ölçülür.

---

## ADIM 2 — DOĞRULAMA (zorunlu, ham çıktıyı raporla)

```bash
# 1. YENİDEN İNŞA — dilimlerden orijinali kur, birebir mi
python3 - <<'EOF'
import re, glob, hashlib
orig = open('docs/_arsiv/ocak-kronoloji-v1.md', encoding='utf-8').read().split('\n')
tasinan = []
for p in sorted(glob.glob('docs/90-kronoloji/*.md')):
    for l in open(p, encoding='utf-8').read().split('\n'):
        tasinan.append(l)
tasinan = set(tasinan)
kayip = [i+1 for i, l in enumerate(orig) if l.strip() and l not in tasinan]
print('KAYIP SATIR:', len(kayip), kayip[:20])
EOF

# 2. SAYIM — dilimlerin toplam veri satırı ≥ orijinal
wc -l docs/_arsiv/ocak-kronoloji-v1.md docs/90-kronoloji/*.md

# 3. ÖRTÜŞME — aynı sohbet başlığı iki dilimde var mı
grep -h "^## Sohbet" docs/90-kronoloji/*.md | sort | uniq -d

# 4. Orijinal dokunulmamış mı
md5 docs/_arsiv/ocak-kronoloji-v1.md    # ADIM 1.1'deki değerle AYNI olmalı

# 5. Ağaç
find docs -type f | sort
```

**Beklenen:** KAYIP 0 · mükerrer başlık yok · md5 değişmemiş.
**Herhangi biri tutmazsa: DUR, raporla, commit etme.**

---

## ADIM 3 — `00-durum.md` TEK SATIR

`| Ne arıyorsan | Nereye bak |` tablosunda:

```
ESKİ: | bir kararın **gerekçesi** | `90-kronoloji/YYYY-AA.md` (tsv'nin `kaynak` sütunu işaret eder) |
YENİ: | bir kararın **gerekçesi** | `90-kronoloji/YYYY-AA.md` — aylık dilim, tam tarihçe (tsv'nin `kaynak` sütunu işaret eder) |
```

⚠ **`01-kararlar.tsv`'nin `kaynak` sütunundaki ~200 satır hâlâ `ocak-kronoloji.md:NNNN`
diyor.** Bu referanslar dilimlemeden sonra **kırılır.** Bu turda **düzeltme** —
ayrı iş, `02-borclar.md`'ye borç olarak açılır:

```markdown
## B33 — Ledger `kaynak` sütunu dilimlemeden sonra kırık
- [ ] **Sahip:** CC (mekanik dönüşüm)
- **Sorun:** `01-kararlar.tsv`'nin `kaynak` sütununda ~200 satır `ocak-kronoloji.md:NNNN`
  biçiminde satır numarası taşıyor. Dosya dilimlendi; numaralar artık hiçbir şeye
  denk gelmiyor.
- **Çözüm:** dilimleme sırasında üretilen satır-eşleme tablosundan (`eski satır → yeni
  dosya:satır`) mekanik dönüşüm. Elle düzeltilmez.
- **Ön koşul:** dilimleme betiği eşleme tablosunu `docs/_arsiv/kronoloji-satir-esleme.tsv`
  olarak yazmalı — **yazmadıysa bu borç kapanamaz.**
```

> **Bu yüzden ADIM 1'de eşleme tablosunu üret:** her kesimde `eski_satir · yeni_dosya ·
> yeni_satir` üçlüsünü `docs/_arsiv/kronoloji-satir-esleme.tsv`'ye yaz. Sonradan
> üretilemez.

---

## ADIM 4 — COMMIT

```
docs: kronoloji aylık dilimlere ayrıldı

ocak-kronoloji.md (5675 satır / 904 KB) bayt düzeyinde bölündü.
Yeniden yazım yok — sed aralık kesimi + append.

- 90-kronoloji/YYYY-AA.md dilimleri (N dosya)
- mevcut 2026-{06,07,08} dosyalarına append (Pilot blokları korundu)
- orijinal: _arsiv/ocak-kronoloji-v1.md (md5 değişmedi)
- satır eşleme: _arsiv/kronoloji-satir-esleme.tsv
- B33 açıldı: ledger kaynak sütunu dönüşümü

Doğrulama: kayıp satır 0 · mükerrer başlık 0 · orijinal md5 sabit
```

Sonra `git push`.

---

## KARAR ÜRETİRSEN

Dilimleme sırasında karar gerektiren bir şey çıkarsa (tarihsiz blok, çift-ay sohbet,
seam belirsizliği) **numara verme** — raporla, numarayı ben veririm. Sıradaki boş
numara **465**'tir ve ADIM 3b'de kullanılacak; çakışma riski var.
