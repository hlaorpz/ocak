# CC BRIEF — B33 · LEDGER `kaynak` SÜTUNU DÖNÜŞÜMÜ

**Sahip:** CC (mekanik)
**Ön koşul:** ADIM 3b commit'i (`6fb214c`) main'de — **KARŞILANDI**
**Disiplin:** KARAR 355 (ADIM 0 salt-read) · **KARAR 465** (sayı beyanı dosyadan, beklentiden değil)

Bu iş **tek başına bir commit**tir. ADIM 3b ile aynı commit'e girmemesinin gerekçesi
`02-borclar.md` B33 maddesinde yazılı; sıra şartı yerine getirildi, artık koşabilir.

---

## 0. NEDEN — SORUNUN TAM HÂLİ

`01-kararlar.tsv`'nin `kaynak` sütunundaki satırların bir kısmı
`ocak-kronoloji.md:NNNN` biçiminde satır numarası taşıyor. O dosya 6 Ağustos'ta aylık
dilimlere ayrıldı ve `docs/_arsiv/ocak-kronoloji-v1.md` altına çekildi. Numaralar
**hiçbir yaşayan dosyada hiçbir şeye denk gelmiyor.**

Eşleme tablosu kesim anında üretildi ve birebirliği kanıtlandı:
`docs/_arsiv/kronoloji-satir-esleme.tsv` — `eski_satir · yeni_dosya · yeni_satir`,
5675/5675, bayt düzeyinde. **Sonradan üretilemez.** Dönüşüm bu yüzden mekaniktir.

---

## 1. ADIM 0 — SAYMADAN YAZMA

**386 rakamı artık geçerli değildir.** ADIM 3b o satırların bir kısmını zaten yeni
formata çevirdi. Bu brief'e sayı yazmıyorum bilerek — sen say, sen raporla (KARAR 465).

```bash
cd ~/Desktop/ocak-site-clone

# 1. Dönüştürülecek satır sayısı — GERÇEK sayım
awk -F'\t' 'NR>1 && $6 ~ /^ocak-kronoloji\.md:[0-9]+$/' docs/01-kararlar.tsv | wc -l

# 2. Eşleme tablosu yerinde ve bütün mü
wc -l docs/_arsiv/kronoloji-satir-esleme.tsv        # beklenen: 5675
awk -F'\t' 'NF!=3{print "SAPMA satır "NR": "NF" sütun"}' docs/_arsiv/kronoloji-satir-esleme.tsv

# 3. Ledger bütünlüğü (ADIM 3b sonrası)
wc -l docs/01-kararlar.tsv                          # beklenen: 466
awk -F'\t' 'NF!=6{print "SAPMA satır "NR": "NF" sütun"}' docs/01-kararlar.tsv

# 4. Her kırık referansın eşleme tablosunda karşılığı VAR MI — kapsama testi
#    (eşleşmeyen tek satır varsa DUR; kayıp eşleme dönüşümü geçersiz kılar)
```

**Kapsama testi zorunludur.** Eşleşmeyen bir eski satır numarası varsa dönüşüm
başlamaz — o satırın nereye gittiğini bilmiyoruz demektir, ve tahminle doldurmak
`kaynak` sütununun tüm anlamını yok eder (KARAR 456).

Raporla: gerçek sayı · kapsama sonucu · varsa eşleşmeyenlerin listesi. **Sonra dur, onay bekle.**

---

## 2. KARAR 466 — `kaynak` SÜTUNUNUN İKİ MEŞRU BİÇİMİ

ADIM 3b elle doğrulanmış 19 satırı çapa biçiminde yazdı (`2026-05.md#k146`).
Mekanik dönüşüm satır biçimi üretecek (`2026-05.md:2790`). İkisi bir arada yaşayacak;
kural yazılmazsa bir sonraki tur hangisinin doğru olduğunu tartışır.

**Kural:**

| biçim | anlamı | nasıl üretilir |
|---|---|---|
| `YYYY-AA.md#kNNN` | karar metnine **elle doğrulanmış** çapa | insan okur, teyit eder |
| `YYYY-AA.md:NNNN` | satır işaretçisi, **mekanik** | eşleme tablosundan türetilir |

- **`#kNNN` daha güçlüdür.** Mekanik dönüşüm mevcut bir `#k` biçimini **asla ezmez**.
  Dönüşüm yalnız `^ocak-kronoloji\.md:[0-9]+$` desenine uyan hücreleri işler.
- **`:NNNN` meşrudur ama zayıftır.** Kırık referanstan iyidir; doğrulanmış çapadan kötüdür.
  Zamanla `#k`'ye terfi eder, tersi olmaz.
- **Satır numarası append'te bozulmaz** — kronoloji append-only, ekleme dosya sonuna
  gider, önceki satırlar kaymaz. Bu yüzden `:NNNN` kapalı aylarda kalıcı olarak geçerli.

Ledger'a eklenecek satır (dosya sonu, `465`'ten sonra) — **sekmeli, `ek-b` dosyasından al:**

`ek-b-karar-466.tsv` yanında.

---

## 3. DÖNÜŞÜM

Yalnız `kaynak` sütunu (6. alan) değişir. **Diğer beş sütuna dokunulmaz.**

**Kural:**
```
ocak-kronoloji.md:E   →   <yeni_dosya>:<yeni_satir>
```
`<yeni_dosya>` eşleme tablosundan gelir. Kronoloji dilimleri için `90-kronoloji/`
öneki **yazılmaz** — ledger'daki mevcut kanon dosya adıdır (`2026-07.md#k380` gibi),
dizin yolu değil. `00-devir.md` de öneksiz yazılır.

**Yazma:**
- Betikle yap, elle değil. Betik `docs/_uretilen/`'e düşsün, commit'lensin
  (denetim izi — dönüşümün nasıl yapıldığı sonradan sorulacaktır).
- Türetilmiş dosyadır (KARAR 456): tsv yanlışsa yeniden üretilir. **Kaynak veriye
  dokunulmaz** — `_arsiv/` altındaki hiçbir dosya değişmez.
- `python3` + `csv` modülü `QUOTE_NONE`, `delimiter='\t'` ile; sed ile yapma,
  başlıklarda iki nokta üst üste ve backtick var.

**Doğrulama (yazdıktan sonra):**
```bash
# kırık referans sıfırlanmalı
awk -F'\t' '$6 ~ /^ocak-kronoloji\.md:/' docs/01-kararlar.tsv | wc -l    # 0

# satır ve sütun sayısı korunmalı
wc -l docs/01-kararlar.tsv                          # 466, değişmemeli
awk -F'\t' 'NF!=6' docs/01-kararlar.tsv | wc -l     # 0

# #k biçimleri EZİLMEMİŞ olmalı — ADIM 3b'nin 19 satırı
grep -c '#k' docs/01-kararlar.tsv

# üretilen her hedef dosya gerçekten var mı
awk -F'\t' 'NR>1{split($6,a,":"); if(a[2] ~ /^[0-9]+$/) print a[1]}' docs/01-kararlar.tsv \
  | sort -u
# çıktıdaki her ad docs/90-kronoloji/ altında (ya da 00-devir.md) mevcut olmalı

# nokta örnekleme: 5 satır seç, hedef dosyanın o satırında karar numarası geçiyor mu
```

**Nokta örnekleme zorunlu.** Beş satır rastgele seç; `<yeni_dosya>`'nın `<yeni_satir>`
satırını oku; o satır (veya ±3 komşusu) ilgili KARAR numarasını içeriyor mu? İçermiyorsa
eşleme kaymış demektir — **DUR**. Beşi de tutmadan commit yok.

---

## 4. DÖNÜŞÜM SONRASI RAPOR — YENİ İŞ DEĞİL, ÖLÇÜM

Dönüşüm bitince tek sayım daha çıkar ve raporlanır (dosyaya yazılmaz):

```bash
# kaynağı 00-devir.md'nin KAPAK bloğuna (satır 1-34) düşen satırlar
awk -F'\t' '$6 ~ /^00-devir\.md:[0-9]+$/ {split($6,a,":"); if(a[2]+0<=34) n++} END{print n+0}' \
  docs/01-kararlar.tsv
```

Bu satırların kaynağı monolitin **sürüm listesidir** — kararın tanımı değil, kararın
hangi sürüm aralığında mühürlendiğinin kaydı. Teknik olarak geçerli bir işaretçi,
kaynak olarak zayıf. B13'ü doğuran hastalığın aynısı: ADIM 1'in ilk geçişi kapaktı,
tanım başka yerdeydi.

**Dönüşüm bunu düzeltmez, sadece taşır.** Düzeltmesi de gerekmez — mekanik iş
semantik iş yapmaz. Sayıyı raporla, `02-borclar.md`'ye **B36** olarak açılacak
(sahip: Claude.ai). Bu turda çözülmez.

---

## 5. `02-borclar.md`

### 5a — B33 kapanışı

Çapa: `## B33 — Ledger `kaynak` sütunu dilimlemeden sonra kırık`
Yeni: `## B33 — Ledger `kaynak` sütunu dilimlemeden sonra kırık ✅ KAPANDI (7 Ağu, mekanik dönüşüm)`

`- **SAYIM ŞARTI:**` ile başlayan maddenin ardına ekle (gerçek sayıları **sen doldur**):

```
- **Sonuç (7 Ağu):** N satır dönüştürüldü (ADIM 3b sonrası gerçek sayım; brief'in
  386'sı geçersizdi). Kapsama testi M/M. Nokta örnekleme 5/5. `#k` biçimindeki 19 satır
  ezilmedi. Dönüşüm betiği `docs/_uretilen/` altında. **KARAR 466** biçim kuralını
  mühürledi: `#kNNN` elle doğrulanmış çapa, `:NNNN` mekanik işaretçi; mekanik dönüşüm
  `#k`'yi asla ezmez.
```

### 5b — B36 açılışı

`## B35` bölümünün sonuna, sonraki `---` ayracından önce:

```markdown
## B36 — Kaynağı kapak/sürüm listesi olan satırlar
- [ ] **Sahip:** Claude.ai
- **Sorun:** B33 dönüşümü sonrası **N satırın** `kaynak` değeri `00-devir.md:1-34`
  aralığına düşüyor — monolitin kapağı, yani **sürüm listesi**. Bir kararın hangi
  sürümde mühürlendiğini söyler; **ne olduğunu söylemez.**
- **Neden borç:** B13'ü doğuran hastalığın aynısı. ADIM 1'in ilk geçişi kapaktı, gerçek
  tanım dönem bloğundaydı. 154·196·223·400·407 tam bu yüzden TEYITSIZ kalmıştı ve ADIM 3b'de
  tanımları bulundu. Kalan N satır için de aynı iş yapılabilir.
- **Neden acil değil:** satırların durumu doğru, yalnız kaynağı zayıf. Kırık değil, sığ.
  TEYITSIZ değiller — okuyan yanlış yere gitmez, sadece derine inemez.
- **Eylem:** blok blok tara, `#kNNN` çapasına terfi ettir. ADIM 3b'nin yöntemi birebir
  uygulanır. B32'den sonra, ADIM 4'ten önce ya da sonra — sıra serbest.
```

### 5c — Başlık sayımı

**Yazmadan önce dosyadan doğrula** (D6 vakası). Beklenen: 35 → 36 madde,
14 → 15 kapalı, açık 21 sabit (B33 kapanır, B36 açılır).

Çapa: `**Durum:** 35 madde · **21 açık** · 14 kapandı/çözüldü/geri çekildi`
Sayım tutuyorsa: `**Durum:** 36 madde · **21 açık** · 15 kapandı/çözüldü/geri çekildi`
**Tutmuyorsa DUR ve raporla.**

Çapa: `| **CC (dilimleme sonrası)** | B33 |`
Yeni: `| **Claude.ai** | B35 · B36 |` *(mevcut `| **Claude.ai** | B35 |` satırıyla
birleştir — iki ayrı Claude.ai satırı olmasın; hangisi kalacaksa tek satır)*

---

## 6. `docs/90-kronoloji/2026-08.md` — APPEND

Dosya sonuna. **N ve M'yi gerçek sayımdan doldur.**

```markdown

---

## B33 — LEDGER `kaynak` DÖNÜŞÜMÜ (7 Ağustos 2026)

`01-kararlar.tsv`'nin `kaynak` sütunundaki **N** kırık `ocak-kronoloji.md:NNNN`
referansı, kesim anında üretilen `_arsiv/kronoloji-satir-esleme.tsv` üzerinden dilim
referansına dönüştürüldü. Mekanik, betikle; betik `_uretilen/` altında commit'li.
Kaynak veriye dokunulmadı (KARAR 456 — tsv türetilmiş dosyadır).

**Brief'in 386'sı geçersizdi.** ADIM 3b o satırların 19'unu zaten elle doğrulanmış
çapaya çevirmişti. Gerçek sayı ADIM 0'da ölçüldü: **N**. Brief sayıyı bilerek yazmadı
(KARAR 465) — bu, kararın ikinci tatbikidir.

**Doğrulama:** kapsama M/M · nokta örnekleme 5/5 · `#k` biçimindeki 19 satır ezilmedi ·
satır ve sütun sayısı korundu.

- **KARAR 466 — `kaynak` SÜTUNUNUN İKİ BİÇİMİ (KALICI):** `YYYY-AA.md#kNNN` = karar
  metnine **elle doğrulanmış** çapa. `YYYY-AA.md:NNNN` = **mekanik** satır işaretçisi,
  eşleme tablosundan türetilir. `#k` daha güçlüdür; mekanik dönüşüm mevcut bir `#k`
  biçimini **asla ezmez**. `:NNNN` meşrudur ama sığdır — zamanla `#k`'ye terfi eder,
  tersi olmaz. Kronoloji append-only olduğu için satır numaraları kapalı aylarda kalıcı
  olarak geçerlidir; ekleme dosya sonuna gider, önceki satırlar kaymaz. İlişki: `←456`.

**Yan bulgu → B36.** Dönüşüm sonrası **P** satırın kaynağı `00-devir.md:1-34` aralığına,
yani monolitin **sürüm listesine** düşüyor. Bu satırlar kırık değil ama sığ: kararın
hangi sürümde mühürlendiğini söyler, ne olduğunu söylemez. B13'ü doğuran hastalığın
aynısı — ADIM 1'in ilk geçişi kapaktı. Mekanik dönüşüm semantik iş yapmaz; taşır,
düzeltmez. Kuyruk B36'da.

**Sıfır kod commit'i. Marka çekirdeği DEĞİŞMEDİ.**
```

---

## 7. `docs/00-durum.md` — TEK SATIR

Çapa (ADIM 3b'de yazılan satır):
```
  ayrı commit — 3b'den SONRA, KARAR 465) → sonra **B32**. **Sıradaki iş B33.**
```
Yeni:
```
  KARAR 465) ✅ kapandı. **Sıradaki iş B32** (`ocak-referans.md` → `20-ref-*`).
```

Tavanı kontrol et: `wc -l docs/00-durum.md` ≤ 200.

---

## 8. COMMIT

```
chore(kararlar): B33 — kaynak sütunu dilim referansına dönüştürüldü

N satır ocak-kronoloji.md:NNNN → <dilim>:<satır>.
Eşleme _arsiv/kronoloji-satir-esleme.tsv üzerinden, mekanik.
ADIM 3b'nin elle doğrulanmış 19 #k satırı ezilmedi.

KARAR 466: kaynak sütunu iki biçim taşır — #kNNN (elle doğrulanmış çapa)
ve :NNNN (mekanik işaretçi). Mekanik dönüşüm #k'yi asla ezmez.

Yan bulgu: P satırın kaynağı sürüm listesine düşüyor (sığ, kırık değil) → B36.
```

---

## 9. DUR NOKTALARI — ÖZET

Aşağıdakilerden biri olursa yazma, raporla:

1. Eşleme tablosu 5675 satır değilse ya da 3 sütun ihlali varsa
2. Kapsama testinde eşleşmeyen tek bir eski satır numarası varsa
3. Nokta örneklemede 5/5 tutmuyorsa
4. Dönüşüm sonrası `#k` sayısı 19'un altına düşerse (ezme olmuş demektir)
5. Ledger satır sayısı 466'dan saparsa
6. `02-borclar.md` başlık aritmetiği dosyadan doğrulanmazsa
