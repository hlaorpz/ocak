# OCAK — SIRA

**Son güncelleme:** 19 Ağustos 2026 (B turu) · sosyal/lansman hattı açıldı; KARAR 492–495 · B80–B87

> Bu dosya **ne yapıldığını** değil **sırada ne olduğunu** tutar. Durum `00-durum.md`'de,
> borçlar `02-borclar.md`'de, gerekçe kronolojide yaşar. Burada yalnız: **sıradaki iş,
> kim yapar, nerede yapılır, nasıl açılır.**
>
> **Her sohbet sonu patch'i bu dosyayı da günceller** (KARAR 468). Biten satır silinmez,
> `✅` damgası alır ve bir sonraki bakımda alt bölüme iner.

---

## SIRADAKİ İŞ

### ⛔ LANSMAN ÖN KOŞULU — ertelenemez

**İade cümlesi.** `teslimat-iade.astro:57-58` + `mesafeli-satis.astro:123-124` hâlâ
*"ödemenin yapıldığı kart üzerinden iade"* diyor. Kart akışı KARAR 488 ile kapandı →
cümle **yanıltıcı** ve tüketicinin itirazda fiilen dayanacağı madde. Faz 1'de taslak
yorumda bırakıldı, muhasebeci/hukuk onayı bekliyor.

⚠ **`robots` `Allow` bu cümle düzelmeden açılmaz.** Lansman tanımı (KARAR 149) =
robots Allow + duyuru; bu satır o tanımın önünde duruyor.

### Faz 1'i tamamlayan sıra

1. **Notion `Kayıtlar` alanları** (Kaan, elle) — `Beklenen Tutar` (number) +
   `Mail Gitti` (checkbox). 2. maddenin ön koşulu.
2. **n8n ödeme onayı akışı** (Kaan) — `Ödendi` + `Mail Gitti` boş → MailerLite
   `odeme_durumu=alindi` → detay maili → `Mail Gitti` ✓. **Sıranın en kritik
   maddesi:** bu kurulana kadar detay mailleri **elle** gidiyor. `odeme_durumu`'nun
   üçüncü değerini hiçbir kod yazmıyor — kapı doğru çalışıyor, açan mekanizma yok.
   **İdempotency işareti şart**, yoksa her gece aynı mail gider.
   *Borç kaydı yok — ürün işi (`02-borclar.md` ürün kuyruğu taşımaz).*
3. **Success ekranına kopyalama tuşları** (CC) — IBAN · tutar · kod, **üçü ayrı**.
4. **Kayıt sonrası WhatsApp** (Kaan + CC) — `wa.me` butonu → 24 saatlik pencere →
   ödeme bilgileri ücretsiz serbest metin olarak. B19 display name hattına bağlı.

### Faz 2 — dışarıdan bekleniyor, başlayamaz

5. **VakıfBank portal uygulaması onayı**; `accountList` + `accountTransactions`
   API Management'tan eklenecek.
6. **`Description` alanı testi** — servis çıktısı gönderenin açıklamasını kırpıyor
   mu. KARAR 489'un "elle yazılabilir kod" gerekçesi buna dayanıyor.
7. **Uyumsoft `SendInvoice`** + mükellef sorgusu (e-Fatura / e-Arşiv ayrımı).
8. **Muhasebeci cevabı** — fatura zamanı · e-ticaret serisi · KDV oranı · **adres
   zorunlu mu** · KVKK-saklama çakışması. Adres cevabı gelirse kayıt formundaki
   konum bloğu baştan tasarlanır (İl + İlçe + açık adres) ve `Şehir` alanının
   serbest-metin yapısı o turda değişir.

⚠ **Faz 2 hesabı: `TR63 0001 5001 5800 7391 5595 37`.** İlk API testinde kullanılan
`TR62 … 7312 3179 27` **farklı hesaptır** — karıştırılırsa eşleştirme boş döner.

⚠ **B79** — Faz 2'nin eşleştirme regex'i **üç** referans formatını tanımak zorunda
(`OCAK-XXXXX` · `OCAK-XXXXXX` · `OCAK-XXXX`), uzunluğa göre ayrıştırma yapılamaz.

---

**Sıra kararı — 19 Ağustos 2026 (docs-patch-2026-08-19).** Doküman hattı; yukarıdaki
ürün sırasıyla **paralel** yürür, biri ötekini beklemez. Öncelik sırasıyla:

1. **B64 — deploy hook URL geçişi** (Kaan). **Kuyruğun başı.** Bu kapanmadan Notion
   içerik güncellemeleri siteye düşmüyor; her yayın için elle boş commit gerekiyor.
   Bir işi değil, **bütün içerik hattını** bloke ediyor.
2. **B69 — MailerLite şablon değişkenleri** (Kaan). Sonrası: otomasyon durumu netleşir
   (aktif mi pause mu) ve gerekirse aktive edilir.
3. **B68 — `pratik-bilgi` altı satır** (Claude.ai → Notion). Havale gerçeğiyle hizalama;
   bekçi dosyalarına ücretli/ücretsiz varyant ayrımı girer.
4. **n8n ödeme onayı akışı** (Kaan). `odeme_durumu = alindi` yazımı. **Bu olmadan Mail
   2/3 hiç tetiklenmiyor** — ödeme gelince link elle yollanıyor. Brief hazır, verilmedi.
   Notion `Ödeme Durumu` değişimi → MailerLite alan güncellemesi; **idempotency işareti
   şart**, yoksa her gece aynı mail gider. *Borç kaydı yok — ürün işi (bkz. `00-durum.md`
   uyarısı: ürün kuyruğu `02-borclar.md`'ye girmez).*
5. **B65 — zip yüklemesi** · **B72 — test verisi temizliği** (ikisi de Kaan).
   B72 sırası önemli: erken temizlik Y1/kapı doğrulamalarının zeminini siler.
6. **B74 — iPhone Safari eyeball** (Kaan). **KISMİ:** kayıt sayfası ayağı 19 Ağu'da
   görüldü ✅; **`/etkinlik/[slug]` mobil ritim ayağı hâlâ açık** — borcun doğuş
   sebebi oydu. Kapanış şartı bilerek daraltılmadı.
7. Üçüncü seremoni sayfası → **B66 seremoni bekçisi** (Claude.ai).
8. **Atölye formatı** — başka sohbette başladı, bekçisi ayrı.

*Tek turluk temizlik, sıra dışı: **B67** (`ornekler-cember.md` tek dosya) · **B70** ·
**B71** (ikisi de Notion nokta patch'i). Kendi turlarını beklemezler, önlerine gelen
Notion turuna binerler.*

---

**Sıra kararı — 19 Ağustos 2026, B turu (`docs-patch-2026-08-19b`).** Sosyal medya /
lansman hattı. Yukarıdaki iki sırayla **paralel** yürür. **37 gün** (AÇILIŞ 24–27 Eylül,
KARAR 492) bu hattın tamamını süreye bağlıyor.

1. **Gün 0 kurucu görsel** *(Kaan)* — **tek gerçek üretim darboğazı.** Çıkmadan Gün 1
   yok (KARAR 450). `KURUCU-URL` ara-değiştir buna bağlı.
2. **Fiyat bandı** *(Kaan + Advaita)* — mekân (**B84**), dar hat ve İ5 metni buna bakıyor.
3. **`/etkinlik/yolculuk-acilis` gövdesi** *(Kaan · Notion)* — **B81.** Bugün karara
   bağlanan AÇILIŞ sayfası sitede içeriksiz duruyor.
4. **K2 — sosyal ana sahne kararı** *(Kaan)* — **B83.** Eylül duyurusu hangi hesaptan
   çıkacak; v2 kararı vermeden (a)'yı uyguladı.
5. **CC turu — extractor düzeltmesi** *(CC, tek commit)* — **B82.** Çalışan diff hazır;
   ikinci CC oturumu kapandıktan sonra, ROUTES hunk'ı hariç.
6. **robots Allow + Gün 1** — 1–4 kapanınca. ⚠ Yukarıdaki **iade cümlesi ön koşulu**
   bu maddenin de önünde durur; ilk sosyal post duyurudur, yani Gün 1 aynı zamanda
   robots kararıdır (KARAR 149).
7. **Kart derleyici sınaması** *(Kaan + Claude, gözle)* — **B86.** İlk gerçek görselle;
   fotoğrafsız zemin kararı.

*Sözlü kapı bekleyen tek kalem: **B85** (İ5 · İ11 · İ20 kayıt cümleleri, ~1 dk).
Sıraya girmez, önüne gelen konuşmaya biner.*

✅ **`Social_Media_v2.1.md` repoya alındı** — `docs/30-sosyal.md`. Desktop kopyası
artık ayna; çelişkide repo kazanır (KARAR 471).

---

**Sıra kararı verildi (8 Ağustos akşamı, 9 Ağustos'ta yazıldı):**
**ADIM 7 ikinci dalga A+B ✅ → B01 ✅ → B47 ✅ → B40 · B55 · B56 ✅ → hold.**

⚠ **Kapı kapandı, kuyruk boşaldı.** Yazılı ölçüt: **kapı → yayını kilitleyen → tek
turluk → kendi planını isteyen**. Kapı bitti; yayını kilitleyen üç halkanın üçü de
doküman dışı cephelerde ve sahibi Kaan. Doküman hattında sırada **tek turluk** işler
var. **B47 ✅ → B40 · B55 · B56 ✅ (11 Ağu).** KARAR 482 üçünü tek turda kapattırdı;
bir kuralın işe yaradığının ölçüsü açık borçları ucuzlatmasıdır. Sırada **B44**
(bayat `@ocak.life` taraması, tek turluk) ve **B45** (tek satır, gövdesi öyle diyor).
Bekletmenin maliyeti olan tek borç **B36-b** — 71 kararın kronoloji kaydı hiç yazılmadı
ve hatırlanarak yazılacak; diğerleri bugün ne kadar pahalıysa altı ay sonra da o kadar.
Seçim Kaan'ın; bu satır sırayı önerir, dayatmaz.

✅ **`00-durum.md` cap'i tahliye edildi (11 Ağu, 184/200).** ADIM 1–6 blokları
`90-kronoloji/2026-08.md`'ye **taşındı**, silinmedi (KARAR 61 · 457). "Kendi turu
gerekir" denmişti; gerekmedi — kapanış patch'i cap'e dayandığı için tahliye zorunlu
oldu ve aynı turda yapıldı. **Bakım kendi turunu bekleyemez, işi bloke ederse öne geçer.**

⚠ **"Fırsat buldukça" bir kuyruk değildir.** İkinci dalga bittiğinde geriye yalnız
borçlar kalıyor — **açık iş sayısı `02-borclar.md` başlık sayacında yaşar, burada
tekrar edilmez** (KARAR 484). *(11 Ağustos'ta bu satır "31 açık iş" diyordu ve
yöntemini de taşıyordu: `^## B` başlıkları 60, damgalı 27, iş-değil 2. Rakam
19 Ağustos'ta bayatladı — 74 madde · 45 açık. Sayı iki yüzeyde yaşadığı için
bayatladı; tarihsel kayıt olarak duruyor, otorite artık tek yüzeyde.)* Sıra
ölçütü: **kapı → yayını kilitleyen → tek turluk → kendi planını
isteyen**, sahibe göre üç paralel hat. Aşağıdaki tablo o sırayı taşır.
B44 ve B47 borç kuyruğunda bekler; kapanmaları için ayrı tur açılır.

**ADIM 6** ✅ — `ocak-kararci` · `ocak-metin` · `ocak-notion` doğdu (9 Ağustos).
Kadro altıya tamamlandı. Sınırlar mühürlendi: KARAR 475 · 476 · 477.
`ocak-notion` sahipsizliği çözüldü — sapma kaydı EK 11. satırı kapandı.

**B44** — bayat `@ocak.life` taraması, **canlı `docs/` dosyalarında**. İlk deneme bayat
dosyada koşuldu, bulguları taşınamaz. Sınıflandırma tablosu + ESKİ→YENİ patch tek turda.

**B47** — "ne nerede yaşar" haritası. En küçük iş, en geniş etki: bağlamı olmayan her
sohbet bugün dosyaların birbirine göre rolünü bilmeden başlıyor.

**B36-b beklemede.** Cinsi değişti (kayıt yazma, çapa düzeltme değil) ve büyüdü
(71 kayıtsız karar). Tek turluk iş değil; kendi planı yapılmadan açılmaz.

---

## DOKÜMAN KUYRUĞU

| # | iş | kim | nerede | ön koşul | nasıl açılır |
|---|---|---|---|---|---|
| 1 | **ADIM 5** ✅ — `ocak-arsivci` · `ocak-teshis` · `ocak-lint` + `skill-sync.sh` + B42 | CC | repo | — | kapandı 8 Ağu |
| 2 | **B39** — `ocak-kaynak-kanonu.md` + `Ocak-Mufredat.md` dağıtımı (447 satır, evsiz) | Claude.ai | ayrı sohbet | yok | `02-borclar.md` B39 — B32 deseni |
| 3 | **B35** — KARAR 87 üç ayrı şeye atfediliyor; `00-durum.md` ODA_MAP işaretçisi kırık | Claude.ai | ayrı sohbet | yok | kronoloji dilimleri + ledger |
| 4a | **B36-a** ✅ — mekanik desen ölçüldü; `#k` terfisi KARAR 466 gereği mümkün değil, yöntem yetersiz çıktı (2/5) | CC | repo | — | kapandı 8 Ağu |
| 4b | **B36-b** — 71 sığ kararın kronolojide kaydı hiç yazılmamış; iş çapa düzeltme değil **kayıt yazma**. Tek turluk değil, kendi planı gerekir | Claude.ai | ayrı sohbet | B36-a ✅ | beklemede — `02-borclar.md` B36 + `_uretilen/b36a-rapor.md` |
| 5 | **251** — ledger'ın son `TEYITSIZ` satırı, kaynak metni bulunamadı | Claude.ai | B36 ile birlikte | yok | `2026-06.md` #38 bloğu |
| 6 | **ADIM 6** ✅ — `ocak-kararci` · `ocak-metin` · `ocak-notion` | CC + Claude.ai | repo | ADIM 5 | kapandı 9 Ağu |
| 7 | **ADIM 7 birinci dalga** ✅ — `mcp/` + üç araç, Railway'de canlı, claude.ai'ye bağlı | CC | Railway | — | kapandı 9 Ağu |
| 7b | **ADIM 7 ikinci dalga A+B** ✅ — `docs_karar(no)` + B54; KARAR 480 · 481 | CC | repo + Railway | 7 ✅ | kapandı 9 Ağu |
| 7c | **ADIM 7 kalan iki parça** — B53 (bağlantı ucu, beta bekliyor) + B51 (B53'e bağlı) | Kaan + CC | Railway + repo | **B53 beta** | `02-borclar.md` B51 · B53 — kendi hatlarında |
| 8 | **B38** — ledger çapa denetimi (terminal kontrol) | Claude.ai | ayrı sohbet | ADIM 7 **+ B36-a** | `02-borclar.md` B38. Ön ölçüm ADIM 4'te yapıldı (isabet %57); B38 onu tekrarlamaz, mekanik onarımın oranı ne kadar oynattığını ölçer |

**Kapı işi: B01 ✅ (10 Ağu)** — klon/remote/Vercel adı üçü de `ocak` oldu. Tek tur,
tek commit `50294e6`, canlı yol referansları 13 → 3.

⚠ **Bu satır "ucuz, tek turluk" diyordu; `02-borclar.md` "maliyet küçük değil" diyordu.**
İki dosya çelişiyordu ve borçlar dosyası haklıydı: iş tek tura sığdı ama içinde dört
sapma, iki yanlış brief iddiası ve üç ayrı dış sistem teyidi vardı. **Aynı işin iki
dosyada iki farklı maliyet tahmini taşıması B47'nin (harita) gerekçesidir** — hangi
dosyanın hangi konuda otorite olduğu yazılı değil.

**Üç hat paralel yürür** — sahip dağılımı `02-borclar.md`'nin **gövdelerinde** yaşar,
`03-sira.md` tekrar etmez. ⚠ O dosyanın sahip tablosu bir **indekstir**, otorite gövdelerdir
(KARAR 482 kural 1a). Tablo gövdelerden türetilir; çelişkide gövdedeki
`**Sahip:**` satırı geçerlidir.

⚠ **B48 ikinci dalgadan önce kapatılmaz** — `baglam.sh` küçülecek, manifestin şekli
değişecek; erken kapatılırsa iş iki kez yapılır. B51 ile birlikte kapanır.
⚠ **B51 MCP bağlanana kadar koşulmaz** — bağlantı ucu geçici olduğu sürece `baglam.sh`
tek güvenilir kanal.
**B36-b · B39 kendi planını ister.** **B38 tanımı gereği sonuncudur** (ön koşul: ADIM 7 + B36-a ✅).
**B30 🔒 dokunulmaz** — `EtkinlikKart.astro:80-82` silinmez.
**B36-a ADIM 5 ile birleştirilebilir** — ikisi de CC, ikisi de repo, ikisi de betik işi.
B38 tanımı gereği sonuncudur ve artık B36-a'ya da bağlıdır.

---

## KOD KUYRUĞU

Sahip: CC. Detay `02-borclar.md`'de.

- Takvim `hashchange`/`pageshow` eki (B03 · KARAR 391 — `ACIK-BORC`)
- Turnstile
- Safari banding
- İlk hafta paketi

---

## DOKÜMAN DIŞI CEPHELER

Bunlar doküman turuyla ilerlemez; kendi hatlarında yürür.

| cephe | sahip | durum |
|---|---|---|
| **B19** — WhatsApp display name | Kaan | Meta iki adayı da reddetti; itiraz açık. Site WhatsApp numarası yayını buna kilitli (KARAR 396) |
| **Sosyal v2 `[KAAN]` önkoşulları** — kurucu görsel + `KURUCU-URL` | Kaan | Gün 1 yayını bunsuz başlamaz (KARAR 450) |
| **Yolculuk fiyat bandı → ilk Yolculuk etkinliği** | Kaan + Advaita | Eylül kohortu duyurusunun önkoşulu |
| **Ödeme** — banka sanal POS | Kaan | entegratör belirsiz, `payment-provider.ts` stub |
| **B50** ✅ — claude.ai skill yüzeyi (altı zip yüklendi) | Kaan | kapandı 9 Ağu — bakım: skill dokunuşundan sonra `sync` + yeniden yükleme. ⚠ Bayatlığın bedeli dosyanın taşıdığına göre değişir: **yol** bayatlığı gürültülüdür (CC `cd` yapamaz, durur), **kural** bayatlığı sessizdir (`yasak-dizeler.tsv` yanlış listeyle geçer). Sessiz sınıf önce yüklenir. `--check` yüklemeyi **ölçemez**, yalnız zip'i denetler (10 Ağu) |
| **B53** — MCP yol-token ödünü: token URL yolunda taşınıyor, çünkü claude.ai connector diyaloğu başlık kabul etmiyor (Request headers beta, bu hesapta kapalı) | Kaan (beta erişimi) + CC (kaldırma) | ⚠ **açık ve kendiliğinden kapanmaz** — beta açıldığı gün başlığa geçilir, yol ucu koddan kaldırılır |
| **B57** — connector araç listesi bayatlıyor: sunucu ilerler, claude.ai şemayı tazelemez, hata vermez | Kaan | bakım kuralı: yeni araç eklenen turun son adımı connector'ı kapat-aç |
| İçerik tarama turları (Uluslararası sweep, "sembolik ücret") | Claude.ai → Notion | sırasız |

---

## LANSMAN

**Tanım (KARAR 149):** lansman = `robots` Allow + duyuru. Sitenin canlı olması değil —
site zaten stealth-canlı.

**Hedef:** Eylül 2026, Anadolu Yolculuğu açılış kohortu.

**Kilit zinciri:** `00-durum.md` "YAYINI KİLİTLEYENLER" · sahipler `02-borclar.md`'de.
Üç halkanın üçü de doküman dışı cephelerde.

---

## BAKIM KURALI (KARAR 468)

Sohbet sonu patch'i **beş** bölümlüdür — KARAR 462'nin dördüne bu dosya eklendi:

1. `00-durum.md` — hedefli blok değişimi
2. `01-kararlar.tsv` — append + durumu değişen satırlar
3. `02-borclar.md` — kapanan / açılan
4. `90-kronoloji/YYYY-AA.md` — append
5. **`03-sira.md` — kuyruk sırası, biten `✅`, yeni iş eklenir**

**Bölüm sırası bağlayıcıdır.** `00-durum.md`'nin *dönem HEAD* satırı patch'in **son**
bölümünde güncellenir — ortada yazılırsa sonraki bölümlerin commit'leri onu geçer ve
satır doğduğu anda bayatlar. Aynı kural rakam taşıyan her satır için geçerli: satır
sayısı, commit sayısı, dosya boyutu **en son ölçülür** (KARAR 470).

⚠ **Sıfır sapma hedeflenmez (KARAR 474).** Satır kapanış commit'inden bir önceki
commit'i taşır; fark tam olarak bir commit'tir ve sabit nokta gereği sıfıra inemez.
Doğrulama `git log -2 --format='%h' | tail -1`.

Bu dosya **kısa kalır.** Gerekçe yazılmaz, durum tekrar edilmez, tarih anlatılmaz —
üçü de kendi dosyasında yaşar. Şişerse yanlış kullanılıyordur.

---

## BİTENLER

- **19 Ağustos — FAZ 1 ✅** (8 commit: 6 kod, 2 doküman)
  Kart akışı `KART_AKISI` ile kapatıldı, kod silinmedi (**KARAR 488**). Referans kodu
  `OCAK-XXXX`'e indi — 29'luk alfabe + 15 maddelik kara liste (**489** · **490**).
  Havale açıklamasından isim çıktı, satır saf ASCII. Forma **Soyad**, sunucuya
  **Şehir** ve **Telefon** kapıları; `last_name` canlı aboneden teyitli (**B76 ✅**).
  `A.Ş.` kırılması CSS'ti, düzeldi. Geçersiz alan kaydırması bir kez kör uygulanıp
  canlıda kapanmadı → `nav-kaydir.ts` ortak yardımcısı (**KARAR 491** bu hatadan doğdu;
  mekanizma **KARAR 395**'in uygulaması, yeni karar değil).
  Test 193 → **246**. Yeni borç: **B77** · **B78** · **B79**. **B74 kısmi.**
  → `90-kronoloji/2026-08.md`
- **11 Ağustos (ikinci tur) — B40 · B55 · B56 ✅** (1 commit, sıfır site kodu)
  KARAR 482'nin ilk uygulaması: üç borç da "önce karar" şartını düşürdü ve tek turda
  kapandı. `61/88` → `61` (88 KIRPMA'nın halefi, kardeşi değil). Sahip tablosu
  gövdelerden türetildi, beş bayat kalem çıktı. Ledger düzeltildi, kronoloji şerh aldı.
  **KARAR 483** mühürlendi — düzyazı rakamı kendi gövdesiyle sınanır, dört ölçülmüş vaka.
  Dört satır bilerek bırakıldı (iddia satırdan görünmüyordu). `00-durum.md` cap'i
  aynı turda tahliye edildi. → `90-kronoloji/2026-08.md`
- **11 Ağustos — B47 ✅ harita + B58 ✅** (1 commit, sıfır site kodu)
  `05-harita.md` doğdu — liste değil **otorite sırası** (ham gerçeklik → kronoloji →
  gövde → indeks → ayna) + dosya sözleşmeleri. **KARAR 482** mühürlendi: indeks,
  indekslediği gövdeyi asla yenmez. B40 · B55 · B56 mekanik yazıma indi.
  B47'nin "harita hiçbir dosyada yok" başlığı ölçümle yanlışlandı — iki kısmi harita
  vardı; üçüncü vaka. B58 kapandı: `branchAlias` proje adından yeniden türedi, teşhis
  yanlıştı. → `90-kronoloji/2026-08.md`
- **10 Ağustos — B01 ✅ kapı** (1 commit, sıfır site kodu)
  Klon · remote · Vercel proje adı üçü de `ocak`. Canlı yol referansları 13 → 3
  (kalan üçü bilerek korundu, sıfır kriteri yazılamazdı — KARAR 465'in ikinci vakası).
  Vercel bağlantısı `githubRepoId` üzerinden kırılmadı, Railway/MCP sağlam, ikisi de
  ölçüldü. CC dört sapma bildirdi, dördü de haklı. Yeni borç: **B58** (`.vercel.app`
  domainleri proje adıyla yenilenmiyor — KARAR 389'un ikinci teyidi) · **B59**
  (`20-ref-site.md:78` tarihli blokta iki bayat) · **B60** (skill kaydı dizin adı
  değişince kırılıyor). Ledger'a satır eklenmedi.
  → `90-kronoloji/2026-08.md`
- **9 Ağustos (ikinci tur) — ADIM 7 ikinci dalga A+B ✅** (3 commit, sıfır site kodu)
  `docs_karar(no)` doğdu, dört araç oldu. **B54 kapandı** — envanter kapsamını ve dağıtım
  ödününü söylüyor. KARAR 480 (çapa sözleşmesi iki eksenli) · 481 (ölçüm aracı kusuru
  bayrakla döndürür) mühürlendi. B56 · B57 açıldı.
  Ledger sığlığı **126/418** ölçüldü (b36a'nın 119'u doğrulandı, +7 komşu-satır yeni).
  C parçası (B53) beta yokluğundan düştü; D (B51) ona bağlı olduğu için koşulmadı.
  → `90-kronoloji/2026-08.md`
- **9 Ağustos — ADIM 7 birinci dalga ✅** (7 commit, sıfır site kodu commit'i)
  `mcp/` doğdu: `docs_envanter` · `docs_oku` · `docs_ara`, Streamable HTTP, zorunlu Bearer.
  Railway'de canlı, claude.ai'ye bağlı, bu turda gerçekten kullanıldı.
  KARAR 478 (sohbet sonu ikinci teslim) · 479 (MCP git deposunu servis eder) mühürlendi.
  B51 · B52 · B53 · B54 · B55 açıldı. `scripts/dump-fable.mjs` izlemeye alındı.
  ⏸ İkinci dalga: `docs_karar` + B53 bağlantı ucu + B54. → `90-kronoloji/2026-08.md`
- **9 Ağustos — ADIM 6 ✅** (4 commit, sıfır site kodu commit'i)
  `ocak-kararci` · `ocak-metin` · `ocak-notion` doğdu; kadro altıya tamamlandı.
  KARAR 475 (kararci↔arsivci sınırı) · 476 (metin↔lint sınırı) · 477 (notion dar
  kapsam) mühürlendi. B48 · B49 açıldı. Sıra kararı yazıldı: ADIM 7 sonra, hold.
  → `90-kronoloji/2026-08.md`
- **8 Ağustos (öğleden sonra) — üç iş**
  **B44-a ✅** `062f03b` — lint kapsam çelişkisi, tarihsel kayıt muafiyeti (KARAR 465).
  **Arşiv ✅** `7fc2ac1` — 17 brief `_arsiv/2026-08-dokuman` + `2026-08-site`.
  **B36-a ✅** `c6a969b` — desen ölçüldü, yöntem yetersiz (2/5), B36-b'ye devretti ve
  büyüdü (71 kayıtsız karar). Ledger'a yazılmadı.
  Yeni borç: **B46** (ölçüm aracı tuzakları) · **B47** (harita yok).
  → `90-kronoloji/2026-08.md`
- **6-7 Ağustos — doküman mimarisi turu ✅** (6 commit, sıfır kod commit'i)
  ADIM 1 · ADIM 2 · ADIM 3 · ADIM 3b · B33 · B37 · B34 · arşiv kapanışı.
  TEYITSIZ 27 → 1 · kırık `kaynak` referansı 409 → 0 · 7 borç kapandı ·
  KARAR 465 · 466 · 467 mühürlendi. → `90-kronoloji/2026-08.md`
- **8 Ağustos — ADIM 5 ✅** (4 commit, sıfır site kodu commit'i)
  `docs/skills/` doğdu — üç skill, kanonik kaynak tek · `skill-sync.sh` symlink+zip,
  `--check` zip yüzeyini denetler · **B42 kapandı** · KARAR 473 mühürlendi ·
  B43 · B44 · B45 açıldı. → `90-kronoloji/2026-08.md`
  Kapanış sonrası: KARAR 474 (dönem HEAD anlık görüntüdür) — `ocak-arsivci`'nin
  DUR-7'si düzeltildi, 6 commit.
- **8 Ağustos — ADIM 4 ✅** (4 commit + 3 kapanış + bu patch, sıfır kod commit'i)
  `CLAUDE.md` kökte · `baglam.sh` beş profil · project files boşaldı (`10-marka.md` hariç) ·
  **B36 açılış ölçümü**: isabet %57, `HİÇ` sıfır, kuyruk ~179± ve üçte ikisi mekanik ·
  KARAR 469 · 470 · 471 · 472 mühürlendi · B40 · B41 · B42 açıldı.
  → `90-kronoloji/2026-08.md`
- **7 Ağustos — B32 ✅** `ocak-referans.md` dağıtımı (4 commit).
  3574 satır → 63 segment → 7 hedef. `20-ref-*` beşli → **yedili**.
  33 kaynak hücresi dönüştü · 1715 satır kronolojiye indi · `_arsiv/ocak-referans-v1.md`.
  → `90-kronoloji/2026-08.md`
