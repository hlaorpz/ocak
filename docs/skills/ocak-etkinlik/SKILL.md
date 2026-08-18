---
name: ocak-etkinlik
description: OCAK Etkinlikler DB kaydının Detay gövdesini üretir — /etkinlik/[slug] sayfası için gövde, üç kayıt sorusu ve yapıştırma biçimi. Bir Açık Kapı ya da başka bir etkinlik yazılacağında açılır. Sayfalar DB'sinin sabit sayfaları (/cember, /hikaye, home) ocak-metin'e aittir. Yalnız taslak üretir; Notion'a yazmaz.
---

# ocak-etkinlik

`/etkinlik/[slug]` sayfasının gövdesini üretir. Bir tema verildiğinde **üç şeyi
birden** çıkarır:

1. **Gövde** — Notion `Detay` alanına yapıştırılacak metin
2. **Üç kayıt sorusu** — her birinin altında bir rahatlatıcı satır
3. **Yapıştırma biçimi** — sohbet içinde kod bloğu, kopyalanmaya hazır

Ses ve yasak dizeler bu skill'in işi değil: ses `ocak-metin`'e, dize denetimi
`ocak-lint`'e aittir. Bu skill **sayfanın şeklini** taşır.

---

## ÖNCE OKU

`ornekler.md` — altı Açık Kapı sayfasının değişen parçaları. Yeni sayfa yazılmadan
önce en az ikisi okunur; kalıp oradan alınır, buradan değil.

---

## KABUK NE BASIYOR

`/etkinlik/[slug]` dört blok basar. **Gövdeye tekrar yazılmaz:**

| kabuk basıyor | gövdeye yazma |
|---|---|
| Hero (overline = Format, başlık, tarih · mekân) | başlık, tarih, saat, mekân |
| Yaklaşan buluşma kartı | — |
| Kayıt butonu | CTA, "kaydol", buton |
| — | süre, kapasite, ücret (DB alanları gösterir) |

---

## SAYFA İSKELETİ — dokuz bölüm, çerçeve kuralı

```
giris → buyuk-vurgu → kim-tutuyor → ne-olur → kimin-icin
      → yaninda-getir → pratik-bilgi → kapanis → buyuk-vurgu
```

**Çerçeve kuralı:** sayfa bir altın vuruşla açılır, bir altın vuruşla kapanır.
Kapanış vuruşu kayıt butonunun hemen üstünde durur. **Sayfada ikiden fazla
`buyuk-vurgu` olmaz** — üçüncüsü vuruşu harcar.

Marker biçimi: `## section: ad` — iki noktadan sonra **boşluk şart**, ad
**TR karaktersiz** (`yaninda-getir`, `kimin-icin`).

Görünen başlık **H2** (`##`), Büyük Harfli. Dört bölüm başlık alır:

| bölüm | başlık |
|---|---|
| `ne-olur` | O Akşam Ne Olur |
| `kimin-icin` | Kimin İçin |
| `yaninda-getir` | Yanına Al |
| `pratik-bilgi` | Pratik Bilgi |

`giris` · `kim-tutuyor` · `kapanis` **başlıksız** — şiirsel bölüm başlık kaldırmaz.

⚠ Gövdede iki tür `##` bulunur ve karıştırılmaz:
`## section: ne-olur` marker'dır, görünmez. `## O Akşam Ne Olur` başlıktır, basılır.
İkisi arka arkaya yazılır.

---

## DÖRT SABİT BLOK — dört sayfada birebir aynı

Yeni sayfada **değiştirilmez**, olduğu gibi kopyalanır. Biri değişirse hepsi değişir.

```
## section: kim-tutuyor

Bu akşamı Advaita açıyor.

Yılların pratiği var — nefes ve beden, kakao ve ateş, ritüel ve sessizlik. Nerede öğrenildiyse oraya gitti, hâlâ da gidiyor: Hindistan, Peru, Anadolu.

Hepsini önce kendi üzerinde denedi, sonra kadınlarla yan yana oturdu. Sana ne yapacağını söylemez; yanına oturur, aynı yere bakar.

Yerine yürümez, yanında yürür.

## section: yaninda-getir

## Yanına Al

- Kapıyı kapatabileceğin bir oda
- Bir mum ve çakmak
- Bir defter, bir kalem
- Kulaklık — sesin kendi odanda kalması için
- Bir bardak su

## section: pratik-bilgi

## Pratik Bilgi

- Buluşma Zoom üzerinden; kayıt olduğunda bağlantı e-postana gelir
- Kayıt alınır, hemen ardından e-postana düşer — gelemezsen sonradan izlersin
- Geç kalırsan da gel, kapı kapanmıyor
```

`ne-olur` bloğunun da yalnız **ikinci paragrafı** temaya göre değişir; kalan yedi
paragraf sabittir (`ornekler.md`'de tam hâli). Blok sekiz paragraftır — dördüncüsü
(*"Ortak olan şu: pratik biterken…"*) üçüncünün devamıdır, ayrılmaz.

---

## DÖRT HEDEF — her Açık Kapı sayfası taşır

| # | hedef | nerede karşılanır |
|---|---|---|
| 1 | Kadın eşik kadını olduğunu fark etsin | `giris` — çift yol (kriz + çağrı), tanım vermeden |
| 2 | Advaita'yla tanışsın, sesini duysun | `kim-tutuyor` |
| 3 | "Bu eşikten OCAK'la geçebilirim" desin | `kapanis` — pencere, taahhütsüz |
| 4 | Güven duysun, hassas şeyini paylaşabilir | `ne-olur` — kimse düzeltilmiyor · kamera zorunlu değil |

Kadının çıkış hâli: *"Hayatımdaki boşluğu fark ettim, burada somutlaştı. Güven verdi."*
Metin bu cümleyi **söylemez** — kadının kurması için alan bırakır.

---

## GÖVDEDE GEÇMEYECEKLER

| ne | neden |
|---|---|
| **"çember"** | ayrı format, ayrı sayfa — kadın hangi ürüne baktığını karıştırır |
| süre · kapasite · ücret · "sembolik" | DB alanı gösterir; süre iddiası format başına tek yerde |
| sıklık ("ayda bir", "her ay") | takvim değişince metin yalan söyler |
| emoji · hashtag · birinci tekil | site OCAK'ın "biz" sesiyle konuşur |
| Kaan adı | dışarıya konuşan yüz Advaita |
| beyaz `#FFFFFF` | paletde yok |

---

## ÜÇ KAYIT SORUSU

Notion `Kayıt Soruları` alanına girer. Formda tarih seçilince açılır; alt satırlar
cevap kutusunun içinde silik metin olarak görünür.

**Kalıp:** üç soru, üçü de açık uçlu, her birinin altında bir rahatlatıcı satır.

- **1 · şimdi** — kadın şu an nerede duruyor
- **2 · arkada** — ne çatırdıyor, ne bırakıldı
- **3 · önde** — *"Bu akşamdan ne ile çıkmak isterdin?"* → **dizinin ortak kapanışı,
  her temada aynı kalır**, alt satırı *"Bilmiyorsan 'bilmiyorum' da bir cevap."*

Alt satırlar süs değil: kadın kutuyu görünce "doğru cevap vermeliyim" diye kilitlenir,
o satır kilidi açar. Boş bırakılma oranını düşüren şey odur.

Denge kuralı: iki soru birden kayıp sormaz. Biri kaybı sorarsa diğeri tutanı sorar.

---

## ÜRETİM ADIMLARI

1. `ornekler.md`'den en az iki sayfa oku
2. Temayı üç sorulu yayda konumla: **tanı → adlandır → sına → ayıkla**
3. `giris` yaz — kısa nefes satırları, sonra bir uzun paragraf
4. İki `buyuk-vurgu` cümlesini seç: açılış ve kapanış, birbirini yankılasın
5. `ne-olur`un ikinci paragrafını temaya göre yaz, kalanı kopyala
6. `kimin-icin` — dört beş "…kadın için" satırı, somut ve tanınabilir
7. `kapanis` — iki paragraf, üç ret ile açılır ("kurs değil, terapi değil,
   dönüştürülmeyeceksin")
8. Sabit blokları yerleştir
9. `ocak-lint` yasak dize taraması
10. Üç kayıt sorusunu yaz
11. **Sohbet içinde kod bloğu olarak ver** — dosya değil

---

## YAPIŞTIRMA BİÇİMİ

Gövde sohbete **tek bir kod bloğu** içinde yazılır, kopyalanmaya hazır. Dosya
verilmez — dosyadan Notion'a taşırken satır sonları ve markerlar kayboluyor.

Kurallar:

- **Yıldız (`*`) yazma.** `buyuk-vurgu` zaten italik basar; yıldız düz metin olarak
  görünür ya da çakışır.
- Uzun paragrafları satır ortasından bölme — kopukluk oradan gelir.
- Gövde **2.974–3.202** karakter (Açık Kapı altı gövde, 18 Ağu 2026 ölçümü; üçüncü uç
  geçirilince 3.019–3.247 — `ornekler.md` künyesi). Çember daha uzun: 3.824–4.113.
  Notion rich text tek parçada 2.000 taşır; yapıştırdıktan sonra **son satırın yerinde
  olduğu kontrol edilir**, yoksa sessizce kırpılmıştır.

**Yapıştırma sonrası ölçüm** (`dist/` çıktısında, kaynak dosyada değil):
dokuz `data-section` · dört `h2` · iki `ul` · iki `buyuk-vurgu` · sıfır düz metin
`section:` dizesi.

---

## SAPMA İZNİ

Bekçi mutlak değil. `ornekler.md`'de bir sapma kayıtlı: Kök sayfasının
`pratik-bilgi` bloğu dokuz madde taşır (saat dilimi maddesi eklendi), çünkü o
sayfanın kadını başka bir saat diliminde. Sapma yapılırsa **gerekçesi yazılır**.

---

## BAŞKA FORMATLAR

Bu iskelet **Açık Kapı** için ölçüldü. Çember farklı mekanik taşır — söz değneği,
sekiz on altı kadın, **kayıt alınmaz**, iki mekân (online + yüz yüze). `ne-olur`,
`pratik-bilgi` ve `kimin-icin` baştan yazılır; `kayıt alınır` satırı tersine döner.
Çember bekçisi yazılana kadar bu skill Açık Kapı dışında **kalıp dayatmaz**.
