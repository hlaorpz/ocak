---
name: ocak-kararci
description: OCAK karar ledger'ına girecek satırı üretir ve yazımdan önce doğrular. Yeni bir karar mühürlenirken, bir kararın durumu değişirken, supersede zinciri kurulurken ya da "bu kaçıncı KARAR" sorulduğunda açılır. Satırı üretir; dosyaya yazmaz — yazan ocak-arsivci'dir.
---

# ocak-kararci

Karar satırını **üretir ve doğrular.** Dosyaya yazmaz, commit'lemez.

## Sınır — kararcı / arşivci (KARAR 475)

| | `ocak-kararci` | `ocak-arsivci` |
|---|---|---|
| Ne yapar | satırın içeriğini üretir ve doğrular | satırı dosyaya işler, commit'ler |
| Dosyaya yazar mı | **hayır** | evet |
| Ledger sorgusu | **yazımdan önce** — numara boşta mı, halef var mı, zincir tutarlı mı | **yazımdan sonra** — `NF`, mükerrer, enum, boş `kaynak` |
| Yüzey | Claude.ai (yargı) + CC (ön sorgular) | CC |

Aynı komut iki dosyaya yazılmaz. Yazım sonrası bütünlük denetimi **arşivcinindir**;
buradan çağrılmaz, tekrar edilmez.

## Sıfırıncı soru: bu gerçekten yeni bir karar mı?

Yeni numara **son çare**, ilk refleks değil. Sırayla sor:

1. **Mevcut bir kararın revizesi mi?** Öyleyse eski satır `SUPERSEDE` olur, `iliski`
   sütununa `→N` girer, yeni satıra `←N` girer. Kısmi supersede meşrudur ve
   `iliski`'de yazılır: `→366 (kısmi: stop verbatim korundu, geometri değişti)`.
2. **Zincir mi?** Sağlayıcı/ad değişimi kararları **süperselenmez, zincirlenir**
   (KARAR 364: iyzico → PayTR → nötr banka). Her yeni halka öncekinin üstüne eklenir.
3. **Bir kararın uygulaması mı?** Uygulama ayrı numara alabilir ama `iliski` ile
   bağlanır (`309 → 311` deseni).
4. **Blok üyesi mi?** Tek kaynakta tekil ayrımı olmayan karar `⊂N` alır — tanımı
   blok içinde yaşar, ayrı gövde uydurulmaz.

Hiçbiri değilse yeni numara verilir.

## Numara tahsisi

```bash
cd ~/Desktop/hlaorpz/ocak
awk -F'\t' 'NR>1{print $1}' docs/01-kararlar.tsv | sort -n | tail -1
```

Yeni numara = ölçülen en büyük + 1. **Bellekteki numara kullanılmaz** (KARAR 470).

**Boşluklar doldurulmaz.** `62 · 64 · 66 · 67 · 68 · 179` → `KULLANILMADI`,
`454` → `REZERVE`. Bunlar boş kutu değil, kayıtlı anomalidir; yeniden kullanılırsa
geçmiş atıflar sessizce yanlış karara gider.

## `durum` — dokuz değer (KARAR 456)

`AKTIF · KALICI · SUPERSEDE · ONERI · IPTAL · ACIK-BORC · TEYITSIZ · KULLANILMADI · REZERVE`

Geçiş planının gövdesi **yedi** sayar — plan bayattır, ledger esastır.

| değer | ne zaman |
|---|---|
| `AKTIF` | yürürlükte, uygulanmış ya da uygulanmakta |
| `KALICI` | ilke; süresi yok, tekrar tartışılmaz |
| `SUPERSEDE` | halefi var; `iliski`'de `→N` zorunlu |
| `ONERI` | önerildi, Kaan vetosu açık — uygulanmış sayılmaz |
| `IPTAL` | geri alındı; halef yok, geri alan bir commit var |
| `ACIK-BORC` | karar duruyor, uygulaması açık; `iliski`'de `BNN` |
| `TEYITSIZ` | durum bilinmiyor. **Meşrudur, tahmin edilmez.** |
| `KULLANILMADI` | numara atlandı, tanım hiç yazılmadı |
| `REZERVE` | numara bilinçli boş bırakıldı |

**`TEYITSIZ` yazmak yanlış `AKTIF` yazmaktan iyidir.** Yanlış satır otoriter görünür ve
kimse arkasına bakmaz.

Listenin ledger'la tuttuğu sınanır — üretilen değerler bu dokuzun alt kümesi olmalı:

```bash
cd ~/Desktop/hlaorpz/ocak
awk -F'\t' 'NR>1{print $4}' docs/01-kararlar.tsv | sort -u
```

## `iliski` sütunu

Sözlük: `→N` halef · `←N` selef · `↔N` kardeş/gerilim · `⊂N` blok üyesi ·
`BNN` borç bağı. Birden çok bağ ` · ` ile ayrılır.

⚠ **Bu sütun not defteri değildir.** Ledger'da bugün `dist teyitli (ember dot render
oluyor)` gibi not taşıyan satırlar var (B36 bulgusu) — bunlar miras, örnek değil.
Yeni satırda `iliski` yalnız ilişki taşır; gerekçe kronolojide yaşar.

## `kaynak` sütunu — iki meşru biçim (KARAR 466)

- `#kNNN` → **elle doğrulanmış çapa.** `2026-08.md#k465`
- `dosya.md:NNNN` → **mekanik işaretçi.** `2026-07.md:705`

**Mekanik dönüşüm `#k` üretemez** — `#k` tanımı gereği elle doğrulanmıştır.
`:NNNN` zamanla `#k`'ye terfi eder, tersi olmaz.

`#kNNN` çapası **madde başlığına** çözülür (KARAR 472):
`- **KARAR NNN — BAŞLIK:**` — literal dizeye değil. Kronolojiye `#kNNN` yazan her
satır için o başlık satırının da eklenmesi gerekir; yoksa çapa boşa düşer.

**`kaynak` boş bırakılamaz** (KARAR 456). Doğrulanamayan satır yazılmaz.

⚠ **Sığ çapa yazma.** Karar-listesi indeksine, dönem özeti bültenine ya da komşu kararın
satırına işaret eden çapa "çalışır" ama derine inilemez. Ledger'ın bugünkü sığlık oranı
ölçülü (B36); yenisi eklenmez. Kararın **kendi kaydına** işaret edemiyorsan, önce o kaydı
yaz — çapa kayıttan sonra gelir.

## Yazımdan önce — dört sorgu

```bash
cd ~/Desktop/hlaorpz/ocak
N=475   # üretilen numara

awk -F'\t' -v n="$N" 'NR>1 && $1==n' docs/01-kararlar.tsv            # boş olmalı
awk -F'\t' -v n="$N" 'NR>1 && $5 ~ n' docs/01-kararlar.tsv           # ona atıf var mı
awk -F'\t' -v h=366 'NR>1 && $1==h' docs/01-kararlar.tsv             # halef gerçekten var mı
awk -F'\t' 'NR>1 && $4=="SUPERSEDE" && $5 !~ /→/' docs/01-kararlar.tsv  # halefsiz SUPERSEDE
```

Dördüncüsü **tüm ledger'ı** denetler ve boş dönmelidir: halefi yazılmamış bir
`SUPERSEDE` satırı, okuyanı hiçbir yere götürmeyen bir tabeladır.

## Satır biçimi

Altı sütun, sekmeyle ayrılır: `no · tarih · baslik · durum · iliski · kaynak`.

**Sekme markdown'dan kopyalanmaz.** Satır ya `printf '%s\t...'` ile üretilir ya yanında
gelen `.tsv` dosyasından alınır. Görsel olarak boşluk sekmeden ayırt edilemez ve
`awk -F'\t' 'NF!=6'` bunu yazımdan sonra yakalar — yani hasar zaten olmuştur.

`baslik` tek satıra sığar ve **ne olduğunu** söyler, ne zaman olduğunu değil.
Gerekçe kronolojidedir; ledger indekstir, referans değil (KARAR 456).

## Ne yazılmaz

**Durum etiketi prose'a tekrar edilmez.** `20-ref-*` ailesinde bugün dokuz satır
ledger'a ait durum değerini prose'da tekrarlıyor ve ikisi zaten ayrışmış
(`KALICI` vs `KALICI/yardımcı`, KARAR 427 iki dosyada). Referans dosyası kuralı taşır,
durumu değil. Yeni tekrar üretilmez.

## DUR koşulları

1. Ölçülen en büyük numara ile üretilen numara arasında boşluk ya da çakışma var
2. `SUPERSEDE` yazılıyor ama halef numarası ledger'da yok
3. `kaynak` boş, ya da çapa dosyada bulunamıyor
4. `#k` çapası mekanik bir dönüşümle üretilmiş
5. `durum` dokuz değerin dışında
6. İki ölçüm çelişiyor — önce **tanımlar** karşılaştırılır, sonra rakamlar (KARAR 470)
