# CC BRIEF — `03-sira.md` KURULUMU + KARAR 468

**Sahip:** CC
**Ön koşul:** son temizlik commit'i main'de
**Kapsam:** Tek commit. Kod yok, borç yok.

Yanında: **`03-sira.md`** (yeni dosya, olduğu gibi konur) · **`ek-f-karar-468.tsv`**

---

## 0. NEDEN

`00-durum.md` durumu, `01-kararlar.tsv` kararları, `02-borclar.md` borçları tutuyor.
**Sıra hiçbir dosyada durmuyordu.** Her sohbet kapanınca "devamı nerede, nasıl açılır"
sorusu cevapsız kalıyor ve sözlü olarak yeniden anlatılıyordu — yani en kırılgan yerde
saklanıyordu.

`03-sira.md` bunu kapatır: sıradaki iş, kim yapar, nerede yapılır, **hangi dosyayla
açılır.**

---

## 1. ADIM 0

```bash
cd ~/Desktop/ocak-site-clone || { echo "DİZİN YOK — dur, raporla"; exit 1; }

git status --short                                  # boş olmalı
git log --oneline -1

test -f docs/03-sira.md && echo "ZATEN VAR — DUR, raporla"
grep -c -P '^468\t' docs/01-kararlar.tsv            # 0 olmalı
wc -l docs/01-kararlar.tsv                          # 468 olmalı
wc -l docs/00-durum.md                              # ≤200
```

`03-sira.md` zaten varsa ya da ledger'da 468 varsa **DUR.**

---

## 2. DOSYAYI KOY

`03-sira.md` **olduğu gibi** `docs/03-sira.md` olarak konur. İçeriğini değiştirme,
yeniden biçimlendirme, satır ekleme/çıkarma.

```bash
cd ~/Desktop/ocak-site-clone
wc -l docs/03-sira.md      # 94 olmalı — sapıyorsa dosya bozulmuş, DUR
```

---

## 3. LEDGER

`ek-f-karar-468.tsv`'den satırı ekle — dosya sonu, `467`'den sonra.
Satırı bu markdown'dan kopyalama, `ek-f`'den al (sekmeler orada).

Sonuç: ledger **468 → 469 satır**.

---

## 4. `docs/00-durum.md` — İNDEKS SATIRI

Dosya indeksi tablosuna satır eklenir. Çapa (mevcut tek satır):

```
| açık borç, sahip, tetikleyici | `02-borclar.md` |
```

**Bu satırın hemen ardına** ekle:

```
| sıradaki iş, kim, nasıl açılır | `03-sira.md` |
```

Sonra tavanı doğrula:
```bash
cd ~/Desktop/ocak-site-clone
wc -l docs/00-durum.md      # ≤200
```

---

## 5. `docs/90-kronoloji/2026-08.md` — APPEND

Dosya sonuna:

```markdown

---

## SIRA DOSYASI (7 Ağustos 2026)

`docs/03-sira.md` açıldı. Gerekçe: `00-durum.md` durumu, `01-kararlar.tsv` kararları,
`02-borclar.md` borçları tutuyordu — **sıra hiçbir dosyada durmuyordu.** Her sohbet
kapanışında "devamı nerede, nasıl açılır" sözlü olarak yeniden anlatılıyor, yani
projenin en kırılgan yerinde saklanıyordu: Claude.ai'nin sohbetler arası hafızası yok,
dokümanlar hafızasıdır (KARAR 460).

Dosya **kuyruğu** tutar, tarihçeyi değil: sıradaki iş · kim yapar · nerede yapılır ·
ön koşul · **hangi dosyayla açılır**. Son sütun kritik — bir işi açmak için gereken
paketin yolu satırın içinde durur, aranmaz.

- **KARAR 468 — SIRA DOSYASI VE BEŞ BÖLÜMLÜ PATCH (KALICI):** `docs/03-sira.md` kuyruğu
  tutar; durum, karar ve borç dosyalarını **tekrar etmez, işaret eder**. Sohbet sonu
  patch'i artık **beş** bölümlüdür — KARAR 462'nin dördüne (`00-durum` · `01-kararlar` ·
  `02-borclar` · kronoloji) `03-sira.md` eklendi. Biten satır **silinmez**, `✅` damgası
  alır ve bir sonraki bakımda "BİTENLER" bölümüne iner (KIRPMA YASAĞI, KARAR 61/88).
  Dosya kısa kalır: gerekçe yazılmaz, durum tekrar edilmez, tarih anlatılmaz — üçü de
  kendi dosyasında yaşar. Şişmesi yanlış kullanıldığının işaretidir. İlişki: `←462`.

**Sıfır kod commit'i.**
```

---

## 6. COMMIT

```
docs(sira): 03-sira.md açıldı — kuyruk artık dosyada durur

Sıra tek dosyada değildi; her sohbet kapanışında sözlü aktarılıyordu.
03-sira.md: sıradaki iş, kim, nerede, ön koşul, hangi dosyayla açılır.

KARAR 468: sohbet sonu patch'i beş bölümlü olur (462'nin dördüne sıra eklendi).
Biten satır silinmez, ✅ alır ve BİTENLER'e iner.

00-durum.md indeksine satır eklendi.
```

---

## 7. DOĞRULAMA

```bash
cd ~/Desktop/ocak-site-clone

wc -l docs/03-sira.md                               # 94
wc -l docs/01-kararlar.tsv                          # 469
grep -c -P '^468\t' docs/01-kararlar.tsv            # 1
awk -F'\t' 'NF!=6' docs/01-kararlar.tsv | wc -l     # 0
awk -F'\t' 'NR>1{print $1}' docs/01-kararlar.tsv | sort | uniq -d    # boş
grep -c '03-sira.md' docs/00-durum.md               # ≥1
wc -l docs/00-durum.md                              # ≤200
git status --short
```

Sapan varsa commit'leme, raporla.

---

## 8. DUR NOKTALARI

1. `docs/03-sira.md` zaten varsa
2. Ledger'da 468 zaten varsa, ya da satır sayısı 468 değilse
3. `03-sira.md` 94 satır değilse (dosya bozulmuş)
4. `00-durum.md` çapası bulunamazsa ya da birden çok kez geçerse
5. `00-durum.md` 200 satırı aşarsa
6. Mükerrer karar numarası çıkarsa

---

## 9. BUNDAN SONRA

Sıradaki iş `docs/03-sira.md`'nin en üstünde yazıyor: **B32**, Claude.ai, ayrı sohbet.
Açılış paketi `_arsiv/2026-08-07-b32-acilis-paketi.md`.

CC tarafında bekleyen doküman işi yok.
