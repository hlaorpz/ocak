# CC BRIEF — B37 · PİLOT REFERANSLARININ DÖNÜŞÜMÜ + KARAR 467

**Sahip:** CC
**Ön koşul:** B33 commit'i (`34ff46c`) main'de — **KARŞILANDI**
**Disiplin:** KARAR 355 (ADIM 0) · KARAR 465 (sayı dosyadan) · **KARAR 466** (biçim kuralı) · **KARAR 467** (bu brief'te mühürleniyor)

Yanında: `ek-c-karar-467.tsv`

---

## 0. NEDEN — VE NEDEN İKİ TUR SÜRDÜ

B33 `ocak-kronoloji.md:NNNN` referanslarını çözdü. Ama `01-kararlar.tsv`'de aynı sınıf
kırıklığın ikinci ayağı duruyor: **`ocak-pilot.md:NN`**. Pilot ADIM 3'te dağıtıldı,
`_arsiv/ocak-pilot-v52.md`'ye çekildi; o satır numaraları hiçbir yaşayan dosyada
hiçbir şeye denk gelmiyor.

Senin çıkardığın ders doğruydu: *"kırılan referansları dosya bazında değil, yaşayan
yol bazında aramak gerekir."* Taramayı yaptım, tablo şu:

| kaynak dosyası | satır | durum |
|---|---|---|
| `ocak-kronoloji.md` | 386 | B33'te çözüldü ✅ |
| `ocak-pilot.md` | ~23 | **bu brief** |
| `ocak-referans.md` | ~30 | **bugün canlı** — ama B32 onu dağıtacak |

Yani üçüncü dalga görünürde. Aynı hatanın üçüncü tekrarı olmasın diye kural şimdi
mühürleniyor (§1), ve B32 kendi dönüşümünü kendi kapsamına alıyor (§5b).

---

## 1. KARAR 467 — ÖNCE BU

Ledger'a ekle: **`ek-c-karar-467.tsv`** (dosya sonu, `466`'dan sonra).
Satırları bu markdown'dan kopyalama — `ek-c`'den al, sekmeler orada.

Sonuç: ledger **467 → 468 satır**.

Kararın metni §6'daki kronoloji append'inde tam hâliyle var.

---

## 2. ADIM 0 — SAY, İNCELE, DUR

Brief hiçbir sayıyı sabitlemiyor (KARAR 465). Üçüncü tatbik.

```bash
cd ~/Desktop/ocak-site-clone

# 1. Dönüştürülecek satır sayısı — GERÇEK
awk -F'\t' 'NR>1 && $6 ~ /^ocak-pilot\.md:[0-9]+$/' docs/01-kararlar.tsv | wc -l

# 2. Desene uymayan pilot referansı var mı (ocak-pilot geçip :NNNN olmayan)
awk -F'\t' 'NR>1 && $6 ~ /ocak-pilot/ && $6 !~ /^ocak-pilot\.md:[0-9]+$/ {print $1"\t"$6}' \
  docs/01-kararlar.tsv

# 3. Ledger bütünlüğü
wc -l docs/01-kararlar.tsv                          # beklenen: 467
awk -F'\t' 'NF!=6' docs/01-kararlar.tsv | wc -l     # 0

# 4. Bölme haritası — SÜTUN YAPISINI RAPORLA
wc -l docs/_bolme-haritasi.tsv
head -3 docs/_bolme-haritasi.tsv
awk -F'\t' 'NR==1{print "sütun sayısı: "NF}' docs/_bolme-haritasi.tsv
awk -F'\t' '{print NF}' docs/_bolme-haritasi.tsv | sort -u    # tek değer olmalı

# 5. Kısa kod → dosya çözümü: haritada kaç ayrı kod var
awk -F'\t' '{print $NF}' docs/_bolme-haritasi.tsv | sort | uniq -c | sort -rn
```

**Raporla ve dur:** gerçek satır sayısı · harita sütun yapısı · kod dağılımı ·
kapsama testi (23 eski satır numarasının hepsi haritada var mı).

---

## 3. ÇIKTI BİÇİMİ — KARAR AĞACI

B33'ten farklı bir problem bu. Kronoloji **bayt aralığıyla** dilimlendi; harita
`eski_satir → yeni_dosya:yeni_satir` veriyordu, dönüşüm birebirdi.

Pilot ise **anlamsal olarak** bölündü — her satır bir hedefe atandı, ama hedef dosyadaki
satır numarası haritada olmayabilir. Bu yüzden çıktı biçimi haritanın gerçek içeriğine
bağlı. Önceden karar veremem; ağacı veriyorum, sen ADIM 0'da hangi dala düştüğünü
raporla.

**Dal A — harita hedef satır numarası taşıyorsa**
→ `20-ref-site.md:412` biçimi. B33'ün birebir aynısı, en kolay dal.

**Dal B — harita yalnız hedef kodu + satır içeriği taşıyorsa** *(en olası)*
→ **İçerik eşleştirmesiyle** satır numarası türet. ADIM 3 kaydı şunu diyor:
*"referans dosyalarına giden her şey **birebir** taşındı."* Yani Pilot satırının metni
hedef dosyada aynen bulunmalı.

Yöntem: satır metnini hedef dosyada ara.
- **Tek eşleşme** → `dosya:NNNN`, kabul.
- **Sıfır ya da çoklu eşleşme** → **kabul etme.** O satırı artık listesine al, raporla.

**Dal C — harita yalnız hedef kodu taşıyorsa (içerik yok)**
→ Satır numarası türetilemez. **Uydurma.** O satırlar artık listesine gider.

> **Artık satırlar tahmin edilmez** (KARAR 456). Bana raporla; `#kNNN` çapasını elle
> doğrulayıp veririm. ADIM 3b'de 251 için yapılan buydu — bulunamayan "bulunamadı"
> olarak kaydedildi, doldurulmadı.

**Beklenen artık:** ADIM 3'ün kendi kaydına göre yeniden yazım yalnız iki yerde yapıldı —
`00-durum.md` ve `20-ref-site.md`'nin "GÜNCEL GERÇEK" bölümü. Oraya düşen Pilot satırları
birebir taşınmadığı için içerik eşleşmesi tutmayacaktır. Bunlar meşru artıktır, hata değil.

**Kısa kod → dosya adı çözüm tablosu** betiğin içine gömülmesin.
`docs/_uretilen/bolme-kod-cozumu.tsv` olarak ayrı dursun ve commit'lensin —
B32'de aynı desen tekrar lazım olacak.

---

## 4. DÖNÜŞÜM

Yalnız `kaynak` sütunu (6. alan). **Diğer beş sütuna dokunulmaz.**

- Betik `docs/_uretilen/b37-pilot-referans-donusumu.py`, commit'lensin.
- `python3` + `csv`, `delimiter='\t'`, `QUOTE_NONE`. **sed yok.**
- **KARAR 466 gereği:** mevcut `#k` biçimindeki hücrelere dokunma. Dönüşüm yalnız
  `^ocak-pilot\.md:[0-9]+$` desenine uyar.
- Önek yazılmaz — `20-ref-site.md`, `20-ref-protokoller.md` gibi. Dizin yolu değil,
  dosya adı (B33'te de böyleydi).
- Kaynak veriye dokunulmaz: `_arsiv/` ve `_bolme-haritasi.tsv` değişmez.

**Doğrulama:**
```bash
# kırık pilot referansı sıfırlanmalı (artıklar hariç — onlar raporda)
awk -F'\t' '$6 ~ /^ocak-pilot\.md:/' docs/01-kararlar.tsv | wc -l

# satır ve sütun korunmalı
wc -l docs/01-kararlar.tsv                          # 468
awk -F'\t' 'NF!=6' docs/01-kararlar.tsv | wc -l     # 0
awk -F'\t' 'NR>1{print $1}' docs/01-kararlar.tsv | sort | uniq -d   # mükerrer: boş

# #k EZİLMEMİŞ olmalı — B33 sonrası 23, +467 = 24
grep -c '#k' docs/01-kararlar.tsv

# önek sızmamış olmalı
grep -c '90-kronoloji/\|20-ref/' docs/01-kararlar.tsv    # 0

# üretilen her hedef dosya gerçekten var mı
awk -F'\t' 'NR>1{split($6,a,":"); if(a[2] ~ /^[0-9]+$/) print a[1]}' docs/01-kararlar.tsv \
  | sort -u
```

**Nokta örnekleme zorunlu — 5/5.** Beş dönüştürülmüş satır seç; hedef dosyanın o
satırını oku; içerik ilgili KARAR'la ilgili mi? Tutmuyorsa **DUR**, commit yok.

Dal B'ye düştüysen örnekleme daha da kritik: içerik eşleştirmesi doğru satırı bulmuş
olabilir ama **yanlış bağlamda** — aynı cümle iki yerde geçiyorsa. Çoklu eşleşmeyi
zaten reddediyorsun; örnekleme bunun ikinci ağıdır.

---

## 5. `02-borclar.md`

### 5a — B37 kapanışı

Çapa: B37 başlık satırı (kendi yazdığın hâli).
Sonuna ` ✅ KAPANDI (7 Ağu, mekanik dönüşüm)` ekle.

Maddenin sonuna (gerçek sayıları **sen doldur**):
```
- **Sonuç (7 Ağu):** N satır dönüştürüldü. Kapsama M/M · nokta örnekleme 5/5 ·
  `#k` biçimi ezilmedi. Artık: P satır (içerik eşleşmesi tutmadı — `00-durum.md` ve
  `20-ref-site.md` "GÜNCEL GERÇEK" bölümüne giden satırlar birebir taşınmamıştı).
  Artıklar tahmin edilmedi (KARAR 456), Claude.ai'ye raporlandı. Kod çözüm tablosu
  `_uretilen/bolme-kod-cozumu.tsv`. **KARAR 467** bu sınıf kırıklığın üçüncü tekrarını
  önlemek için mühürlendi.
```

### 5b — B32'ye ön koşul (KARAR 467)

`## B32` maddesinin sonuna ekle:
```
- **ÖN KOŞUL (KARAR 467, 7 Ağu):** `ocak-referans.md` dağıtımı, ledger'da o dosyaya
  işaret eden **~30** `kaynak` hücresinin dönüşümünü **kendi kapsamına dahil eder**.
  Eşleme tablosu kesim anında üretilir — sonradan üretilemez. Ayrı tura bırakılmaz.
  *Gerekçe: kronoloji dilimlemesi B33'ü doğurdu (367 satır, ayrı tur), Pilot bölünmesi
  B37'yi doğurdu (23 satır, iki tur sonra fark edildi). Bu üçüncüsü olurdu.*
- **Sayım:** ~30 rakamı ADIM 3b öncesi ölçümdür; B32 kendi ADIM 0'ında yeniden saysın.
```

### 5c — Başlık aritmetiği

**Yazmadan önce dosyadan doğrula.** Beklenen: 37 madde sabit, B37 kapanır →
**37 madde · 21 açık · 16 kapalı.** Tutmuyorsa DUR ve raporla.

Sahiplik tablosunda B37 satırını kaldır ya da kapandı olarak işaretle.

---

## 6. `docs/90-kronoloji/2026-08.md` — APPEND

Dosya sonuna. **N · M · P'yi gerçek sayımdan doldur.**

```markdown

---

## B37 — PİLOT REFERANSLARI (7 Ağustos 2026)

B33'ün ikinci ayağı. `01-kararlar.tsv`'de **N** satır `ocak-pilot.md:NN` gösteriyordu;
Pilot ADIM 3'te dağıtılıp `_arsiv/ocak-pilot-v52.md`'ye çekilmişti. Aynı sınıf kırıklık,
farklı dosya. `_bolme-haritasi.tsv` (403 satır, bölme anında üretildi) üzerinden
dönüştürüldü.

**B33'ten farkı:** kronoloji **bayt aralığıyla** dilimlenmişti, harita birebir satır
eşlemesi veriyordu. Pilot **anlamsal olarak** bölündü — her satır bir hedefe atandı.
Bu yüzden hedef satır numarası [içerik eşleştirmesiyle türetildi / haritadan okundu].
Kod çözüm tablosu `_uretilen/bolme-kod-cozumu.tsv`'de ayrı durur — B32'de aynı desen
gerekecek.

**Artık P satır.** İçerik eşleşmesi tutmadı, çünkü ADIM 3'te yeniden yazım iki yerde
yapılmıştı: `00-durum.md` ve `20-ref-site.md` "GÜNCEL GERÇEK". Oraya giden satırlar
birebir taşınmadı. **Tahmin edilmedi** (KARAR 456), Claude.ai'ye raporlandı.

**Doğrulama:** kapsama M/M · nokta örnekleme 5/5 · `#k` biçimi ezilmedi ·
satır/sütun korundu · mükerrer numara 0.

- **KARAR 467 — DOSYA DAĞITIMI LEDGER DÖNÜŞÜMÜNÜ İÇERİR (KALICI):** Bir master dosya
  dağıtıldığında (bölme, dilimleme, birleştirme), aynı işin parçası olarak üç şey
  birlikte üretilir: **(a)** eşleme tablosu — kesim anında, **sonradan üretilemez**;
  **(b)** `01-kararlar.tsv`'nin o dosyaya işaret eden `kaynak` hücrelerinin dönüşümü;
  **(c)** kapsama + nokta örnekleme doğrulaması. Dönüşüm ayrı commit'te gidebilir
  (KARAR 465 sıra şartı) ama **ayrı tura ertelenemez**. Ertelenirse ledger ölü yol
  gösteren satırlarla yaşamaya devam eder ve her dağıtım kendi takip turunu doğurur.
  *Vaka: kronoloji dilimlemesi B33'ü doğurdu (367 satır, ayrı tur); Pilot bölünmesi
  B37'yi doğurdu (23 satır, **iki tur sonra** fark edildi — dönüşüm dosya bazında
  arandığı için ikinci ayak görülmedi). `ocak-referans.md` dağıtımı üçüncüsünü doğurmak
  üzereydi; bu karar onu B32'nin kendi kapsamına aldı.* İlişki: `←456 · ↔465`.

**Ders (CC, B33 turundan):** taşımadan sonra kırık referans **dosya bazında değil,
yaşayan yol bazında** aranır. `kaynak` sütununun tamamı dosya adına göre gruplanıp her
grubun hedefi yaşıyor mu diye sorulur — tek grep, iki tur değil. KARAR 467 bu dersin
kurallaşmış hâlidir.

**Sıfır kod commit'i. Marka çekirdeği DEĞİŞMEDİ.**
```

---

## 7. `docs/00-durum.md`

B32 zaten sıradaki iş olarak yazılı; **dokunma** — ancak KARAR 467 ön koşulu tek satırla
anılacaksa o satıra `(KARAR 467: kaynak dönüşümü kapsam içi)` eklenebilir. Tavan kontrolü:
`wc -l docs/00-durum.md` ≤ 200.

---

## 8. COMMIT

```
chore(kararlar): B37 — pilot referansları dilim/ref dosyalarına dönüştürüldü

N satır ocak-pilot.md:NN → <hedef dosya>:<satır>.
_bolme-haritasi.tsv üzerinden; kod çözüm tablosu _uretilen/ altında.
P satır artık kaldı (yeniden yazılan bloklar) — tahmin edilmedi, raporlandı.

KARAR 467: dosya dağıtımı ledger dönüşümünü içerir — eşleme, dönüşüm ve
doğrulama aynı işin parçasıdır, ayrı tura ertelenemez.
B32'ye ön koşul olarak işlendi (~30 ocak-referans.md hücresi).
```

---

## 9. DUR NOKTALARI

1. Bölme haritası satır/sütun yapısı bozuksa
2. Kapsama testinde eşleşmeyen eski satır varsa (artık ≠ eşleşmeyen — artık meşru,
   eşleşmeyen değil)
3. İçerik eşleştirmesinde **çoklu eşleşme** kabul edilirse — etme, artığa at
4. Nokta örnekleme 5/5 tutmazsa
5. `#k` sayısı 24'ün altına düşerse
6. Ledger satır sayısı 468'den saparsa, ya da mükerrer numara çıkarsa
7. `02-borclar.md` aritmetiği dosyadan doğrulanmazsa

---

## 10. SONRASI

1. **B34** — 143 + 350 kod teyidi. İki grep, ucuz. Brief'i B37 commit'i düşünce yazılır.
2. **B32** — `ocak-referans.md` → `20-ref-*`. Claude.ai, ayrı sohbet. Artık KARAR 467
   ön koşuluyla.
3. **B36** — 25 satırın `#k` terfisi. Claude.ai.
4. **ADIM 4** — repoya tam taşıma + `baglam.sh`. B01 buna bağlı.
