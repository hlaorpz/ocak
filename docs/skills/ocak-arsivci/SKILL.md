---
name: ocak-arsivci
description: OCAK doküman patch'ini uygular ve commit'ler. docs-patch-YYYY-AA-GG.md geldiğinde, sohbet sonu patch'i uygulanacağında, ya da docs/ altındaki 00-durum · 01-kararlar · 02-borclar · 03-sira · 90-kronoloji dosyalarına yazım yapılacağında açılır. Kod dosyalarına dokunmaz.
---

# ocak-arsivci

Sohbet sonu patch'ini uygular. Yalnız `docs/` altında çalışır; `src/`, `scripts/`,
`public/` bu skill'in kapsamı dışındadır.

## Beş bölüm, bağlayıcı sıra (KARAR 468)

1. `00-durum.md` — hedefli blok değişimi, tam yeniden yazım değil
2. `01-kararlar.tsv` — append + durumu değişen satırların yeni hali
3. `02-borclar.md` — kapanan / açılan
4. `90-kronoloji/YYYY-AA.md` — append
5. `03-sira.md` — kuyruk, biten `✅`, yeni iş

**Sıra bağlayıcıdır ve gerekçesi rakamlardır.** Rakam taşıyan her satır — dönem HEAD,
satır sayısı, commit sayısı, dosya boyutu — **en son ölçülür** (KARAR 470). Ortada
yazılan rakamı sonraki bölümlerin commit'leri geçer; satır doğduğu anda bayatlar.

*Vaka: ADIM 4 patch'i `00-durum.md`'ye `f42911f` yazdı, tur `76e8bee` ile kapandı.
Kural o gün yazılmıştı, mekanizma yoktu.*

## ADIM 0 — önce oku (KARAR 355)

`00-durum.md`'ye yazmadan önce dosyanın beklenen hâlde olduğunu doğrula: çapa var mı,
tek mi, satır sayısı patch'in varsaydığı gibi mi. Kronoloji append-only olduğu için
orada çakışma yoktur — ADIM 0 oraya uygulanmaz.

## Çapa disiplini (KARAR 465, 472)

- Çapa **tek satırdan** alınır ve dosyada **benzersiz** olmalıdır.
- Blok-sonu dizeleri, girintili satırlar, birden çok yerde geçen ifadeler çapa olamaz.
- Çapa tutmuyorsa **durmak doğru reflekstir**, hata değil.
- `#kNNN` çapası madde başlığına çözülür (`- **KARAR NNN — BAŞLIK (DURUM):**`),
  literal dizeye değil. Kronolojiye eklenen her `#kNNN` için o başlık satırı da eklenir.

## Ledger bütünlüğü — her yazımdan sonra

```bash
cd ~/Desktop/hlaorpz/ocak-site-clone
awk -F'\t' 'NF!=6' docs/01-kararlar.tsv | wc -l                      # 0
awk -F'\t' 'NR>1{print $1}' docs/01-kararlar.tsv | sort | uniq -d    # boş
awk -F'\t' 'NR>1{print $4}' docs/01-kararlar.tsv | sort -u           # 9 değerin alt kümesi
awk -F'\t' 'NR>1 && $6==""' docs/01-kararlar.tsv | wc -l             # 0
```

`durum` enum **dokuz** değerdir (KARAR 456):
`AKTIF · KALICI · SUPERSEDE · ONERI · IPTAL · ACIK-BORC · TEYITSIZ · KULLANILMADI · REZERVE`.
Geçiş planının gövdesi yedi sayar — **plan bayattır, ledger esastır.**

`kaynak` sütunu zorunludur ve iki meşru biçimi vardır (KARAR 466):
`#kNNN` elle doğrulanmış çapa · `dosya.md:NNNN` mekanik işaretçi.
**Mekanik dönüşüm `#k` üretemez** — `#k` tanımı gereği elle doğrulanmıştır.

## Kapanış doğrulaması — atlanamaz

```bash
cd ~/Desktop/hlaorpz/ocak-site-clone
wc -l docs/00-durum.md                                    # ≤200 (KARAR 457)
git log -1 --format='%h'                                  # HEAD
grep -n 'dönem HEAD' docs/00-durum.md                     # satırdaki hash ile karşılaştır
```

**HEAD satırı tutmuyorsa commit'leme, raporla.** Bu skill'in var olma sebebi budur.

## KIRPMA YASAĞI (KARAR 61)

İçerik silinmez, kırpılmaz, sadeleştirilmez — yalnız **taşınır** ya da **dönüştürülür**.
Patch modu ekleme ve değiştirme yapar; çıkarma yapmaz. `00-durum.md` tavanı aşarsa en
eski dönem bloğu kronolojiye **iner**, silinmez. Birleştirme yeniden yazımdır, ayrı
karar ister.

## Commit

Ayrı konu = ayrı commit. Mekanik dönüşüm ile semantik iş asla aynı commit'te olmaz.
Patch tek konuysa tek commit meşrudur. `--no-ff` merge kararı Kaan'ındır.

Uygulama bitince `.claude/notes.md`'ye brief adı + madde durumları + commit hash'leri
yazılır.

## DUR koşulları

1. Çapa bulunamıyor ya da birden çok kez geçiyor
2. Patch'in beyan ettiği satır sayısı dosyanın gerçeğiyle tutmuyor
3. `00-durum.md` 200 satırı aşacak
4. Mükerrer karar numarası
5. `durum` dokuz değerin dışında
6. `kaynak` boş
7. Kapanışta HEAD satırı `git log -1` ile tutmuyor
