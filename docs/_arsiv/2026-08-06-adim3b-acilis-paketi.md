# ADIM 3b — KARAR ARKEOLOJİSİ · SOHBET AÇILIŞ PAKETİ

**Bu bir CC brief'i DEĞİL.** Claude.ai tarafında, **yeni ve temiz bir sohbette** yapılır.
Aşağıdaki dosyaları o sohbete **ekler**, en alttaki metni **kopyala-yapıştır** yaparsın.

> ⚠ **Bu paketin kendisini yeni sohbete ekleme.** Bu senin talimatın; girdisi değil.

---

## HANGİ DOSYALARI VERECEKSİN — TAM YOL

Hepsi repoda. Çalışma dizini: **`~/Desktop/ocak-site-clone/`**

### Zorunlu (8 dosya)

```
docs/90-kronoloji/2026-05.md              3580 satır  ← asıl av alanı
docs/90-kronoloji/2026-07.md              1237 satır  ← TEYITSIZ dörtlüsünün üçü
docs/90-kronoloji/00-devir.md              503 satır  ← Pilot'tan taşınan TAM kayıtlar
docs/90-kronoloji/2026-06.md               477 satır
docs/2026-08-06-ocak-gecis-plani.md        246 satır  ← KARAR 455-462'nin tanımı
docs/01-kararlar.tsv                       465 satır
docs/02-borclar.md                        ~260 satır
docs/00-durum.md                           134 satır
```

**Neden bunlar:**

- Aranan numaraların çoğu 62–251 aralığında → **Mayıs–Haziran**.
- `00-devir.md` Bölüm B'de öz olarak geçen kararların **uzun hâlini** taşıyor —
  B06 (KARAR 114 halefi) muhtemelen orada çözülür.
- `2026-07.md` → TEYITSIZ 380, 350, 447 Temmuz kararı.
- **Geçiş planı zorunlu:** ledger'da 456·457·459·460·461·462'nin `kaynak` sütunu bu
  dosyayı gösteriyor. Ayrıca **458'in tanımı planda yok** — plan 456, 457, 459, 460,
  461, 462'yi tanımlıyor, 458'i atlıyor. Boşluğun kendisi bulgu; plan görülmeden
  anlaşılmaz. Madde 7'nin (B33 zamanlaması) kararı da ADIM 4'ün takvimine bağlı,
  o da planda.

### İsteğe bağlı (ucuz)

```
docs/90-kronoloji/2026-02.md                73 satır
docs/90-kronoloji/2026-08.md               150 satır
```

### VERME

```
docs/ocak-referans.md                     3574 satır — B32'nin konusu, bu turun işi değil
docs/ocak-site-icerik.md                  4821 satır — site dump'ı, ilgisiz
docs/_arsiv/ocak-kronoloji-v1.md                     — dilimlerin kaynağı, mükerrer bağlam
docs/_arsiv/kronoloji-satir-esleme.tsv               — B33 CC'nin işi, bende gereksiz
```

---

## YAPIŞTIRACAĞIN METİN

```
ADIM 3b — KARAR arkeolojisi.

⚠ Project files BAYAT. Otorite repoda (docs/). Ekli dosyalar esastır.
Ekli: kronoloji dilimleri (2026-05, 2026-06, 2026-07, 00-devir) ·
01-kararlar.tsv (464 karar) · 02-borclar.md · 00-durum.md ·
2026-08-06-ocak-gecis-plani.md (yol haritası, KARAR 455-462'nin tanımı)

İş — ledger'daki belirsizlikleri kaynak metinden çöz:

1. B05 — KARAR 146/188 numara çakışması. İki farklı konu aynı numarayı
   taşıyor (GTM container iskeleti vs TS Window dataLayer global type).
   Hangisi gerçek 146, hangisi 188'in tanımı? Kronolojiden kesinleştir.

2. B06 — KARAR 114'ün halefi belirsiz. "glow stop verbatim, kısmi supersede,
   365-371 aralığı" yazıyor ama tek numaraya inmiyor. İlgili bloğu oku,
   →N kesinleştir. (00-devir.md'de uzun hâli olabilir.)

3. B13 + B20 — tanımı envanterde olmayan 20+ numara:
   · hiç geçmeyenler (6): 62, 64, 66, 67, 68, 179
   · yalnız sınır olarak geçenler: 154, 196, 223, 251, 400, 407
   · yalnız grup atfında eriyenler (10): 159, 160, 164, 170, 171, 172,
     237, 238, 247, 248
   Her biri için: tanım var mı, yok mu, numara atlanmış mı?

4. TEYITSIZ işaretli, başlığı olan dört satır — kaynak metni oku, netleştir:
   380 (baseline li reset) · 350 (statik ember şerit) · 143 (/test ODA_MAP)
   · 447 (WhatsApp push/pull ayrımı)

5. 458 — ADIM 3 girdilerinde tanımı yoktu, TEYITSIZ girdi. Geçiş planı
   456, 457, 459, 460, 461, 462'yi tanımlıyor ama 458'i atlıyor. Numara
   atlanmış mı, yoksa tanım başka yerde mi? Kronolojiyi de tara.

6. KARAR 465'i mühürle — patch çapası ve doğrulama disiplini. 6 Ağustos'ta
   üç kez çıkarımdan yazılmış beklenti dosyanın gerçeğiyle çelişti:
   (a) B32 çapası blok-sonu dizesi girintiliydi, betik durdu;
   (b) D2 grep kriteri "176/176 → 0" diyordu ama satır iki yerde geçiyordu,
       biri korunması gereken tarihsel anlatımdı;
   (c) B33 brief'i "~200 kırık referans" tahmin etti, gerçek 386 çıktı.
   Üçünde de CC durdu, dosyaya yazılmadı. İlke: çapa tek satırdan alınır ve
   benzersiz olmalıdır; doğrulama kriteri ve sayı beyanı dosyanın gerçek
   hâline karşı yazılır, beklentiden değil. KARAR 355 ailesinin patch
   katmanındaki karşılığı.

7. B33 — ledger kaynak sütunu kırık. 386 satır "ocak-kronoloji.md:NNNN"
   biçiminde referans taşıyor; dosya dilimlendiği için numaralar hiçbir şeye
   denk gelmiyor. Eşleme tablosu docs/_arsiv/kronoloji-satir-esleme.tsv
   üretildi ve birebirliği kanıtlandı (5675/5675, bayt düzeyinde).
   Dönüşüm mekaniktir, CC yapar — ben yapmam.
   KARAR: dönüşüm bu turun patch'iyle AYNI commit'te mi gitsin, AYRI mı?
   Öneri bekliyorum, gerekçesiyle. (ADIM 4 takvimi geçiş planında.)

Yöntem: KARAR 456 geçerli — doğrulanamayan satır yazılmaz. Emin olamadığın
numara TEYITSIZ kalır, tahmin edilmez. Bulunamayan tanım "bulunamadı" olarak
kaydedilir, uydurulmaz. Numara aralıklarını grep'le tara, tek tek doğrula.

Önce oku, bulguları KONU KONU raporla (madde 1'den 7'ye), onay bekle.
Patch'i sonra yaz.
```

---

## BEKLENEN ÇIKTI

Tek `docs-patch-YYYY-AA-GG.md`, CC'ye "oku ve uygula":

1. `01-kararlar.tsv` — durumu/ilişkisi/başlığı değişen satırların yeni hâli (~25-35 satır)
2. `02-borclar.md` — B05·B06·B13·B20 kapanışı; kapanmayan artık varsa yeniden tanımı
3. `90-kronoloji/2026-08.md` — ADIM 3b kaydı + KARAR 465 tam metni
4. `00-durum.md` — yalnız gerekiyorsa, hedefli tek satır
5. B33 kararına göre: ayrı CC brief'i ya da aynı patch içinde dönüşüm talimatı

---

## NEDEN AYRI SOHBET

20+ karar bloğunu kaynaktan okumayı gerektiriyor — bağlam ağır. ADIM 3'ün bölme
mantığıyla karışırsa ikisi de bulanır (KARAR 52). Ayrıca `2026-05.md` tek başına
3580 satır; temiz bağlam gerek.

---

## ÖNCELİK GEREKÇESİ

Ledger'da **27 TEYITSIZ satır** var — 464 kararın %6'sı. KARAR 456 gereği TEYITSIZ
satırlar "kendi kuyruğunu oluşturur, zamanla erir." ADIM 3b o kuyruğun büyük kısmını
eritir. Erimezse ledger'ın güveni aşınır: **yanlış bir tsv satırı prose'daki
bulanıklıktan tehlikelidir, çünkü otoriter görünür ve kimse arkasına bakmaz.**

---

## ADIM 3b'DEN SONRA

- **B33** — ledger kaynak dönüşümü (CC, mekanik, 3b'nin kararına bağlı)
- **B32** — `ocak-referans.md` (3574 satır) → `20-ref-*` birleştirme (Claude.ai)
- **ADIM 4** — repoya tam taşıma + `CLAUDE.md` + `baglam.sh` (CC). B01 buna bağlı.

Hiçbiri ADIM 3b kapanmadan açılmaz.
