# CC BRIEF — KAPANIŞ · ARŞİV TEMİZLİĞİ + KARAR 456 VAKASI

**Sahip:** CC
**Ön koşul:** B34 commit'i (`f0b48da`) main'de — KARŞILANDI
**Kapsam:** Tek commit. Kod yok, ledger yok, borç yok.

Bu, 6-7 Ağustos doküman turunun **kapanış işidir.** İki gün içinde beş commit
(`6fb214c` · `34ff46c` · `4ddb6e1` · `f0b48da` + bu) atıldı; geride iki artık kaldı:
mükerrer arşiv dosyaları ve kayıtsız bir vaka.

---

## 1. ARŞİV ADLANDIRMA KONVANSİYONU

Şu ana kadar sözlüydü, iki kez uygulandı, bir kez çakıştı. Yazıya geçiyor.

`docs/_arsiv/` **iki ayrı tür** dosya taşır ve **ikisi farklı adlandırılır:**

**(a) Yapısal arşiv — adı tanımlayıcıdır, tarih öneki ALMAZ.**
Kesim anında üretilen, yeniden üretilemeyen, kalıcı başvuru dosyaları:
```
kronoloji-satir-esleme.tsv
_bolme-haritasi.tsv
ocak-kronoloji-v1.md
ocak-pilot-v52.md
```
**Bunlar yeniden ADLANDIRILMAZ.** Ledger ve betikler bu adlara referans veriyor;
ad değişimi sessiz kırılma üretir (KARAR 467'nin tam olarak önlediği şey).

**(b) Tur artefaktı — `YYYY-AA-GG-` önekli.**
Tek bir oturumun çıktısı; brief, `ek-*`, patch:
```
2026-08-07-brief-b33-kaynak-donusumu.md
2026-08-07-ek-b-karar-466.tsv
```
Tarih öneki bunları kronolojik sıraya dizer ve hangi turun ürünü olduğunu ad
düzeyinde belli eder.

**Neyin arşive gireceği:** kesim anında üretilen ve yeniden üretilemeyen şey girer.
Türetilebilir veri girmez — `ek-a`'nın içeriği ledger'da ve `6fb214c` diff'inde
zaten üç yerden kayıtlı.

---

## 2. TEMİZLİK

### 2a — ADIM 0

```bash
cd ~/Desktop/ocak-site-clone
ls -la docs/_arsiv/
git status --short
```

Çalışma ağacı temiz olmalı. Aşağıdaki dosyalar **beklenen**; başkası varsa raporla.

### 2b — Mükerrerleri kaldır

Öneksiz kopyalar gider, tarihli olanlar kalır. **İçerik aynılığını önce doğrula:**

```bash
cd docs/_arsiv
diff ek-b-karar-466.tsv 2026-08-07-ek-b-karar-466.tsv && echo "b: aynı"
diff ek-c-karar-467.tsv 2026-08-07-ek-c-karar-467.tsv && echo "c: aynı"
```

**İkisi de "aynı" demiyorsa DUR ve raporla.** Farklıysa hangisinin doğru olduğu
karar meselesidir, silme işi değil.

Aynıysa:
```bash
git rm docs/_arsiv/ek-b-karar-466.tsv
git rm docs/_arsiv/ek-c-karar-467.tsv
git rm docs/_arsiv/ek-d-b34-kosullu-satirlar.tsv
```

`ek-d` iptal edildi (yerine `ek-e`). Koşullu-yazma tasarımının gerekçesi B34 brief'inde
duruyor ve o arşivde — ikinci kopya gürültüdür.

`ek-e`'nin arşivde tarihli adla durduğunu teyit et; yoksa `2026-08-07-ek-e-b34-nihai-satirlar.tsv`
olarak koy.

### 2c — Eksik brief

`2026-08-07-brief-b37-pilot-referanslari.md` masaüstünde kayboldu, yeniden üretildi ve
Kaan tarafından verilecek. Arşive `docs/_arsiv/` altına, tarihli adla koy.

Sonuç: dört brief de arşivde olmalı — B33 · B37 · B34 · bu. Doğrula:
```bash
ls docs/_arsiv/2026-08-07-brief-*
```

### 2d — B36 kapsam genişlemesi — UYGULANDI MI

B37 onayında istenmişti, B37 raporunda teyidi yok. **Önce dosyaya bak:**

```bash
grep -n "B36" docs/02-borclar.md
sed -n '/^## B36/,/^## /p' docs/02-borclar.md
```

Madde şu ikisini taşıyor mu:

1. Başlık **`Kaynağı sığ satırlar`** olarak genişletilmiş mi? (Eski hâli "kapak/sürüm
   listesi" diyordu — artık tek sebep o değil.)
2. Şu kapsam notu var mı:
```
- **Kapsam genişlemesi (7 Ağu, B37):** +12 satır (366-371 · 376-379 · 381-382).
  Pilot'un yoğun paragraflarında birden çok karar tek satırda anılıyordu; dönüşüm
  hepsini aynı hedef satıra çözdü — doğru dönüşüm, sığ kaynak. Toplam ~37 satır.
```

**Varsa** — dokunma, raporla "zaten uygulanmış".
**Yoksa** — bu commit'te ekle. Ama önce **12 rakamını dosyadan doğrula** (KARAR 465):

```bash
# 366-371 ve 376-382 arası, kaynağı aynı hedefe düşen satırlar
awk -F'\t' '$1+0>=366 && $1+0<=382 {print $1"\t"$6}' docs/01-kararlar.tsv
```

380 hariçtir — ADIM 3b onu `2026-07.md#k380` yapmıştı. Gerçek sayı 12 değilse
**gerçek sayıyı yaz**, 12'yi değil.

### 2e — Adlandırma denetimi

```bash
ls docs/_arsiv/
```
Her dosya (a) ya da (b) sınıfına uymalı. Uymayan varsa **yeniden adlandırma —
raporla.** Yapısal dosyaları tarihlemeye kalkma.

---

## 3. `docs/90-kronoloji/2026-08.md` — APPEND

Dosya sonuna:

```markdown

---

## KAPANIŞ — ARŞİV KONVANSİYONU + BİR VAKA (7 Ağustos 2026)

**Arşiv adlandırması yazıya geçti.** `_arsiv/` iki tür dosya taşır: **yapısal arşiv**
(eşleme tabloları, dağıtılan master dosyaların son hâli) tanımlayıcı adını korur ve
**yeniden adlandırılmaz** — ledger ve betikler o adlara referans verir, ad değişimi
sessiz kırılma üretir. **Tur artefaktı** (brief, `ek-*`, patch) `YYYY-AA-GG-` önekli olur.
Arşive giren şey: kesim anında üretilen ve **yeniden üretilemeyen**. Türetilebilir veri
girmez — `ek-a`'nın içeriği ledger'da, kronolojide ve `6fb214c` diff'inde zaten üç
yerden kayıtlıydı; arşivde dördüncü kopya olarak durmasına gerek yoktu.

Mükerrerler temizlendi: `ek-b` ve `ek-c`'nin öneksiz kopyaları, ve iptal edilen `ek-d`
(yerine `ek-e`; koşullu-yazma tasarımının gerekçesi B34 brief'inde yaşıyor).

**KARAR 456 vakası.** B37 uygulanırken `ek-c-karar-467.tsv` iş ortasında diskten
kayboldu — arşive taşınmıştı, CC eski yola bakıyordu. CC satırı bağlamdan yeniden
kurup ledger'a yazdı, **sonra** orijinali bulup karşılaştırdı; birebir tuttu.

Sonuç doğruydu ama **sıra yanlıştı.** Doğrulama yazmadan sonra geldi; tutmasaydı hiçbir
mekanizma yakalamayacaktı, çünkü tek kontrol noktası yazmanın arkasındaydı. Otorite
dosyası bulunamıyorsa yazılmaz — durulur ve sorulur. **Hafızadan kurulmuş veri, veri
değil hatırlamadır.** KARAR 456'nın "doğrulanamayan satır yazılmaz" kuralı burada da
geçerlidir: doğrulanabilirlik **yazma anında** aranır, sonradan değil.

Riskin **bildirilmesi** doğru davranıştı; alınması değil. Yeni karar açılmadı — kural
zaten 456'nın kapsamındaydı, ve iki günde üç karar (465·466·467) mühürlendikten sonra
barın yükselmesi gerekiyordu, düşmesi değil.

---

## 6-7 AĞUSTOS DOKÜMAN TURU — KAPANIŞ TABLOSU

Beş commit: `6fb214c` (ADIM 3b) · `34ff46c` (B33) · `4ddb6e1` (B37) · `f0b48da` (B34) ·
bu (arşiv).

| | |
|---|---|
| TEYITSIZ | 27 → **1** (kalan 251) |
| Kırık `kaynak` referansı | 409 → **0** (367 kronoloji + 23 pilot + 1 önek + 18 ADIM 3b) |
| Kapanan borç | B05 · B06 · B13 · B20 · B33 · B34 · B37 — **7** |
| Açılan borç | B34 · B35 · B36 · B37 — **4** (ikisi aynı turda kapandı) |
| Yeni karar | 465 (çapa tekilliği) · 466 (kaynak biçimi) · 467 (dağıtım = dönüşüm) |
| Düzeltilen sahte satır | 454 (REZERVE'e döndü) |
| Kod commit'i | **0** |

**Açık kalan doküman kuyruğu:** B32 (`ocak-referans.md` → `20-ref-*`, 28 hücre, KARAR 467
ön koşuluyla) · B35 (KARAR 87 üç atıf) · B36 (sürüm listesi 25 + pilot yoğun paragraf 12
≈ 37 sığ kaynak satırı) · 251'in kaynak metni. Hiçbiri ADIM 4'ü kilitlemiyor.

**Sıfır kod commit'i. Marka çekirdeği DEĞİŞMEDİ.**
```

---

## 4. `docs/00-durum.md`

**Dokunma.** B32 zaten sıradaki iş olarak yazılı, sayılar güncel, tavan altında.
Tek kontrol:
```bash
wc -l docs/00-durum.md    # ≤200
```

---

## 5. COMMIT

```
chore(arsiv): mükerrer ek dosyaları temizlendi, adlandırma konvansiyonu yazıya geçti

- ek-b/ek-c öneksiz kopyaları kaldırıldı (içerik aynılığı diff ile doğrulandı)
- ek-d kaldırıldı — iptal edilmişti, yerine ek-e
- B37 brief'i arşive alındı; dört brief de yerinde
- Konvansiyon: yapısal arşiv tanımlayıcı adını korur, tur artefaktı YYYY-AA-GG- önekli

KARAR 456 vakası kronolojiye yazıldı: otorite dosyası bulunamıyorsa yazılmaz,
durulur ve sorulur. Doğrulanabilirlik yazma anında aranır, sonradan değil.

6-7 Ağustos doküman turu kapanış tablosu kronolojide.
```

---

## 6. DUR NOKTALARI

1. `diff` mükerrerlerin aynı olduğunu göstermezse — silme, raporla
2. Yapısal arşiv dosyalarından birini yeniden adlandırmaya kalkarsan
3. Dört brief'ten biri arşivde eksikse — commit'le, ama raporla
4. `git status` beklenmeyen bir değişiklik gösterirse
5. `00-durum.md` 200 satırı aşarsa

---

## 7. BUNDAN SONRA

**Doküman turu kapandı.** Sıradaki iş **B32** — Claude.ai tarafında, ayrı sohbet
(`ocak-referans.md` 3574 satır, bu turun bağlamına sığmaz). Ön koşulu KARAR 467:
eşleme tablosu kesim anında üretilir, 28 `kaynak` hücresinin dönüşümü aynı işin
parçasıdır, ayrı tura ertelenmez.

CC tarafında bekleyen doküman işi yok.
