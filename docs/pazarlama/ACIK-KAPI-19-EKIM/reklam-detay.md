# Reklam Detayı · Set Set, Reklam Reklam

Uygulama Planı'ndaki reklam bölümünün (üç set, bütçe fazları, eşikler) kopyalanır hâli ve bu planın ekledikleri: gündüz kolu, 22 Ekim yurt dışı akşamı, 26 Ekim, çember, Kasım düzeni.

## 0 · Açılmadan önce

Reklam, ölçüm Events Manager'da doğrulanmadan açılmaz (Uygulama Planı). 9 Ekim itibarıyla açılmadı; bekleyenler:

| Kapı | Durum | Kimde |
|---|---|---|
| Çerez rızası ve ölçüm etiketleri (B118) | CC brief'i verildi; sonucu ölçmedim | Kaan, CC |
| Events Manager'da kayıt ve ödeme olaylarının görünmesi | Ölçülmedi | Kaan (inişten sonra) |
| Yurt dışı kartıyla ödeme denemesi | Ölçülmedi | Kaan |
| Reklam hesabının günlük harcama sınırı | Ölçülmedi; ölçek günde yaklaşık 1.650 TL ister | Kaan |

Organik ve Advaita'nın işleri bu kapıyı beklemez.

## 1 · Kampanya ayarları

| Alan | Değer |
|---|---|
| Kampanya adı | `ak-19ekim` |
| Amaç | Potansiyel müşteri (web sitesi); optimizasyon olayı kayıt formu gönderimi. Ödeme ayrıca sayılır |
| Bütçe | Set düzeyinde, günlük |
| Bitiş | 19 Ekim 19:00 |
| Yerleşim | Otomatik; her kreatifin 4:5 ve 9:16 sürümü ayrı yüklenir |
| Advantage+ kreatif iyileştirmeleri | Kapalı (müzik ekleme, metin üretme, kırpma, hepsi) |
| Yorumlar | Açık; günde iki kez okunur |
| Varış | `https://ocak.biz/acik-kapi` + aşağıdaki etiketler |

**Etiket kalıbı:**

```
?utm_source=meta&utm_medium=paid&utm_campaign=ak-19ekim&utm_content=<reklam-adı>
```

**Ortak alanlar (her reklamda):**

| Alan | Metin |
|---|---|
| Başlık | `Bir Akşamlığına Gel` |
| Açıklama | `Bir saat, online. Evinden, kendi mumunla.` |
| Düğme | `Daha Fazla Bilgi` |

## 2 · Bütçe fazları

| Faz | Tarih | Bütçe (TL) | Kural |
|---|---|---|---|
| Test | 10–12 Ekim | ~3.000 | Dokunulmaz |
| Okuma | 13 Ekim sabah | | Eşik tablosu, bölge ve kreatif dökümü |
| Ölçek | 13–18 Ekim | ~10.000 | Kazanan büyür; günlük artış en çok yüzde elli |
| Son gün | 19 Ekim | ~1.000 | 19:00'da hepsi kapanır |
| Yedek | 15 Ekim'den sonra | 5.000 | Yalnız ödenmiş kayıt başı 600 TL'nin altındaysa |

Eşik (ödenmiş kayıt başına harcama, Notion'dan hesaplanır): 600 TL altı yedeği açar · 600–1.000 sürdürür · 1.000 üstü keser. Bir reklam 1.000 TL harcayıp ödenmiş kayıt getirmediyse kapanır. 13 Ekim sabahından önce karar verilmez.

Açılış 10 Ekim 10:00'dan geç kalırsa okuma da o kadar kayar.

## 3 · Set 1 · Türkiye

| Alan | Değer |
|---|---|
| Kitle | Kadın, 30–52, tüm Türkiye, tek set. Şehir ayrımı bölge dökümünden okunur |
| Günlük (test) | ~600 TL |
| Dil | Türkçe |

### Reklamlar

**T1 · `reels-mum`** · gece

- **Görsel:** bugün profilde duran "Bir Akşamlığına Gel" reels'i (yanan mum, 12 saniye). Mevcut gönderi olarak seçilir; etkileşimi taşır.
- **Birincil metin (M1):**

```
Bazı şeylere gün içinde bakılmaz. Yer ister, sessizlik ister, bir akşam ister.

Pazartesi akşamı o akşam. Advaita bir mum yakar, temayı açar, bir pratikle bedene indirir. Sen yazarsın, o okur ve konuşur. Hiçbir şey yazmadan sadece durmak da olur.

Açık Kapı · 19 Ekim Pazartesi · 21:00 · online

Bir akşamlığına gel.
```

- **Varış:** `https://ocak.biz/acik-kapi?utm_source=meta&utm_medium=paid&utm_campaign=ak-19ekim&utm_content=reels-mum`

**T2 · `eller-mum`** · insan

- **Görsel:** `1010-A-eller-ve-mum` reels'i (çekim 10 Ekim). Müziksiz; kibrit sesi.
- **Birincil metin:** M1.
- **Varış:** `…&utm_content=eller-mum`
- **Ne zaman:** çekim biter bitmez; test fazına girer.

**T3 · `gunduz-bir-saat`** · gündüz

- **Görsel:** `hazir-kartlar/1011-A-bir-saat-4x5.jpg` ve `-9x16.jpg` (basıldı).
- **Birincil metin:** M1.
- **Varış:** `…&utm_content=gunduz-bir-saat`
- **Ne zaman:** baştan. Karar (9 Ekim): gündüz kartı erken başlar; reklamda da üçüncü kol olarak ilk günden koşar.

**T4 · `soru-1`** · gece

- **Görsel:** soru reels'i 1 ("Kendine en son ne zaman bir saat ayırdın?"), 8–10 saniye.
- **Birincil metin:**

```
Kendine en son ne zaman bir saat ayırdın?

Açık Kapı · 19 Ekim Pazartesi · 21:00 · online
```

- **Varış:** `…&utm_content=soru-1`
- **Risk:** ikinci tekil hitap. Geri çevrilirse yerine M1-Y'li T1 açılır.

**T5 · `uc-kadin`** · gece

- **Görsel:** `1013-A-uc-kadin` kartı (boş sandalye ve mum; Z-C zemini).
- **Midjourney istemi (Z-C):**

```
an empty wooden chair beside a low table with one lit candle, dark room, warm glow on the chair back, film grain, still --ar 4:5 --style raw --v 8.1 --stylize 110 --chaos 5 --sref https://cdn.midjourney.com/b6457637-7065-4c39-b551-268b156c9408/0_2.png --sw 60 --no lava, volcano, bright white, blown highlights, daylight, grey light, blue tones, teal, people, faces, hands, text, watermark
```

- **Birincil metin (M2):**

```
Herkese yetişen, kendine sıra gelmeyen kadın.
Hayatı yolunda görünen ama içeriden "dahası var" diyen bir ses duyan kadın.
Bir geçişin ortasında duran kadın.

Pazartesi akşamı bir saatliğine aynı yerdeler. Herkes kendi evinde, kendi mumuyla.

Açık Kapı · 19 Ekim Pazartesi · 21:00 · online

Kapı aralık. İçeride ateş yanıyor.
```

- **Varış:** `…&utm_content=uc-kadin`
- **Ne zaman:** 13 Ekim okumasından sonra, ölçek fazında.

**T6 · `advaita-davet`** · insan

- **Görsel:** `1016-A-advaita-davet` reels'i (çekim listesi V-B). Advaita'yla ortak reklam olarak Türkiye setine girer; ayrı set açılmaz.
- **Birincil metin:** M1.
- **Varış:** `…&utm_content=advaita-davet`
- **Ne zaman:** 16 Ekim; son üç günün reklamı.

**Yedek metin (M1-Y)**, ikinci tekil hitapsız; geri çevrilen her reklamın yerine:

```
Bazı şeylere gün içinde bakılmaz. Yer ister, sessizlik ister, bir akşam ister.

Pazartesi akşamı Advaita bir mum yakar, temayı açar, bir pratikle bedene indirir. Kadınlar yazar, o okur ve konuşur. Hiçbir şey yazmadan sadece durmak da olur.

Açık Kapı · 19 Ekim Pazartesi · 21:00 · online
```

**Kullanılmayan metin (M3, "Eşik"):** en riskli metin; ikinci tekil hitapla kişisel durum ima ediyor. Organikte kalır (`1019-O-bir-esikte-duruyorsun`), reklama girmez.

### Test düzeni

Üç ışık aynı sette, aynı metinle (M1) koşar: T1 gece, T2 insan, T3 gündüz. Fark görselden okunur. Sayı küçük olacak; sonuç kesin hüküm değil, yön gösterir. Kalıcı karar 20 Ekim retrosunda, organik veriyle birlikte.

## 4 · Set 2 · Yurt dışı (Avrupa)

| Alan | Değer |
|---|---|
| Kitle | Kadın, 30–52; Almanya, Hollanda, Avusturya, Belçika, Fransa, İsviçre, Birleşik Krallık; dil Türkçe |
| Günlük (test) | ~250 TL |

**Y1 · `saat-karti`** · gece

- **Görsel:** saat kartı (G5). Zemin Z-A.
- **Midjourney istemi (Z-A):**

```
a single lit candle on a dark wooden windowsill at night, deep charcoal-brown darkness, warm ember glow, faint reflection on the glass, film grain, wide empty space above --ar 4:5 --style raw --v 8.1 --stylize 110 --chaos 5 --sref https://cdn.midjourney.com/b6457637-7065-4c39-b551-268b156c9408/0_2.png --sw 60 --no lava, volcano, bright white, blown highlights, daylight, grey light, blue tones, teal, people, faces, hands, text, watermark
```

- **Kart metni:** `Türkiye'de 21:00 · Berlin'de 20:00 · Londra'da 19:00` / alt bant: `Açık Kapı · 19 Ekim Pazartesi · online · Türkçe`
- **Zemin gelmeden basmak için:** `python3 araclar/ocak_kart.py --zemin gece --metin "Türkiye’de 21:00|Berlin’de 20:00|*Londra’da 19:00*" --bant "Açık Kapı · 19 Ekim Pazartesi · online · Türkçe" --cikti saat-karti-4x5.jpg`
- **Birincil metin (M4):**

```
Türkiye'de 21:00. Berlin'de 20:00. Londra'da 19:00.

Aynı akşam, aynı saat; herkes kendi evinde, kendi mumuyla. Advaita temayı açar, bir pratikle bedene indirir. Sen yazarsın ya da sadece durursun.

Açık Kapı · 19 Ekim Pazartesi · online · Türkçe

Bir akşamlığına gel.
```

- **Varış:** `…&utm_campaign=ak-19ekim&utm_content=saat-karti`

**Y2 · `reels-mum-yd`** · gece

- Aynı reels (T1), birincil metin M4. `utm_content=reels-mum-yd`.

Saatler 19 Ekim için doğru (Türkiye UTC+3, Almanya UTC+2, Birleşik Krallık UTC+1). 25 Ekim'den sonra Berlin 19:00, Londra 18:00.

## 5 · Set 2b · Yurt dışı, 22 Ekim akşamı ("Ateş Seninle Geldi")

Eski planda "bu turda yok" denen Amerika seti burada açılır: 22 Ekim akşamı 23:00'e bilerek kondu ve uzakta yaşayan kadına yazıldı.

| Alan | Değer |
|---|---|
| Kampanya | `ak-22ekim` |
| Kitle A (Avrupa) | Set 2 ile aynı ülkeler |
| Kitle B (uzak) | Amerika Birleşik Devletleri, Kanada; kadın, 30–52; dil Türkçe |
| Tarih | 19 Ekim 21:00 – 22 Ekim 21:00 |
| Günlük | A ~250 TL, B ~200 TL (üç gün; toplam yaklaşık 1.350 TL, yedekten) |
| Koşul | Yurt dışı kartıyla ödeme denenmiş olmalı; denenmediyse açılmaz |

**Y3 · `ates-seninle-geldi`**

- **Görsel:** `1022-A-ates-seninle-geldi` kartı (pencerede mum, uzakta şehir ışıkları; V06).
- **Midjourney istemi (V06):**

```
single candle burning on a windowsill at night, distant city lights blurred beyond the glass, warm flame against cool darkness, intimate domestic ritual, no figure, shallow focus, charcoal and ember palette --ar 4:5 --style raw --v 8.1 --stylize 120 --chaos 5 --sref https://cdn.midjourney.com/b6457637-7065-4c39-b551-268b156c9408/0_2.png --sw 60 --no flames, wildfire, lava, volcano, bonfire, neon, daylight, bright white, blown highlights, grey light, blue tones, teal, people, faces, hands, text, watermark
```

- **Kart metni:** `Uzaktaysan: / ateş seninle geldi.` Saat bandı, kitle A: `İstanbul 23:00 · Berlin 22:00 · Londra 21:00`; kitle B: `İstanbul 23:00 · New York 16:00 · Toronto 16:00 · Los Angeles 13:00`
- **Başlık:** `Ateş Seninle Geldi`
- **Açıklama:** `Bir saat, online, Türkçe.`
- **Birincil metin (M6, yeni):**

```
Bu akşamın saati bilerek geç. Uzakta yaşayan kadına göre kuruldu.

Bir saat, online, Türkçe. Advaita bir mum yakar, temayı açar; kadınlar yazar ya da sadece durur.

Açık Kapı: Ateş Seninle Geldi · 22 Ekim Perşembe · Türkiye saatiyle 23:00
```

- **Varış:** 22 Ekim etkinlik sayfası (adresi takvimden alınır; sayfanın adresi hâlâ eski tarihi taşıyor, kronoloji 8 Ekim) + `?utm_source=meta&utm_medium=paid&utm_campaign=ak-22ekim&utm_content=ates-seninle-geldi`

Los Angeles ve Toronto saatleri: 22 Ekim'de Kuzey Amerika yaz saatinde (New York ve Toronto UTC−4, Los Angeles UTC−7). M6'nın gövdesini etkinlik sayfasıyla karşılaştırmadım; yayından önce karşılaştırılır.

## 6 · Set 3 · Geri dönüş

| Alan | Değer |
|---|---|
| Kitle | Siteye gelip ödemeyenler + Instagram'da etkileşenler + videonun yarısını izleyenler; ödeyenler hariç |
| Günlük | ~150 TL (kitle doldukça harcar) |

**G1 · `pencere`** · gece

- **Görsel:** G1 kartı (Z-A zemini): `Bir Akşamlığına Gel / Bir saat, online. Evinden, kendi mumunla.`
- **Birincil metin:** M2.
- `utm_content=pencere`

**G2 · `aksamin-doluysa`** · gece

- **Görsel:** G6 kartı (mum ve açık dizüstü; Z-D).
- **Midjourney istemi (Z-D):**

```
a lit candle beside an open laptop on a wooden table in a dark room, dim screen glow, evening, warm and cool light meeting, film grain --ar 4:5 --style raw --v 8.1 --stylize 110 --chaos 5 --sref https://cdn.midjourney.com/b6457637-7065-4c39-b551-268b156c9408/0_2.png --sw 60 --no lava, volcano, bright white, blown highlights, daylight, grey light, blue tones, teal, people, faces, hands, text, watermark
```

- **Kart metni:** `Akşamın doluysa / Sıradaki akşamlar takvimde.`
- **Birincil metin (M5):**

```
Pazartesi akşamın dolu mu?

Açık Kapı kaydedilmez; o akşam orada olanlarla yaşanır. Sıradaki akşamlar takvimde.

Açık Kapı · ocak.biz/acik-kapi

Sana uyan akşama gel.
```

- `utm_content=aksamin-doluysa`

**G3 · `o-aksam-ne-olur`** · gündüz (yeni)

- **Görsel:** `hazir-kartlar/1014-A-o-aksam-ne-olur-k1…k6.jpg` karuseli (basıldı).
- **Birincil metin:** M1-Y.
- `utm_content=o-aksam-ne-olur`
- **Neden burada:** sayfaya gelip ödemeyen kadının sorusu çoğu zaman "tam olarak ne olacak"; karusel onu cevaplar.

**G4 · `kameran-kapali`** · insan ya da gece (yeni)

- **Görsel:** `1017-A-kameran-kapali`.
- **Birincil metin:**

```
Kameran kapalı kalabilir. Hiçbir şey yazmadan sadece durmak da olur.

Açık Kapı · 19 Ekim Pazartesi · 21:00 · online
```

- `utm_content=kameran-kapali`

## 7 · 26 Ekim ("İstek mi, İhtiyaç mı?")

20 Ekim sabahı `ak-19ekim` kapanmış olur. Aynı üç set `ak-26ekim` adıyla yeniden açılır; öğrenilen kitle taşınır.

| Reklam | Görsel | Birincil metin |
|---|---|---|
| `istek-ihtiyac` | `1025-A-istek-mi-ihtiyac-mi` (iki avuç) | Aşağıdaki M7 |
| `reels-mum` | Aynı reels | M1'in tarihi değişmiş hâli |
| 19 Ekim'in kazanan kreatifi | | Tarihi değişmiş hâli |

**M7 (yeni):**

```
İkisi çoğu zaman aynı kelimeyle söylenir: "istiyorum."

Pazartesi akşamı bir saat bu ikisine birlikte bakıyoruz. Advaita bir mum yakar, temayı açar, bir pratikle bedene indirir.

Açık Kapı: İstek mi, İhtiyaç mı? · 26 Ekim Pazartesi · 21:00 · online
```

- **Başlık:** `İstek mi, İhtiyaç mı?`
- **Varış 20–22 Ekim arası:** doğrudan 26 Ekim etkinlik sayfası (çünkü `/acik-kapi` o üç gün en yakın akşam olarak 22 Ekim 23:00'ü gösterir). 23 Ekim'den itibaren `/acik-kapi`.
- **Bütçe:** 19 Ekim'in ödenmiş kayıt başı maliyeti eşiğin altındaysa günde 600 TL; üstündeyse günde 250 TL ve ağırlık organikte.
- **19 Ekim 100 kişiyle dolarsa:** reklam varışı ve paylaşımlar 19 Ekim'den önce bu akşama çevrilir (Uygulama Planı).

## 8 · Çember (28 Ekim ve sonrası)

Karar (Kaan, 9 Ekim): "çember reklamla doldurulmaz" kuralı yok. Çember reklamla da duyurulur.

Öneri: önce sıcak kitle, sonra soğuk.

**Ç1 · Geri dönüş (27–28 Ekim)**

| Alan | Değer |
|---|---|
| Kampanya | `cember-28ekim` |
| Kitle | Açık Kapı sayfasını ve `/cember`'i ziyaret edenler; Instagram'da etkileşenler; videoların yarısını izleyenler |
| Günlük | ~200 TL, iki gün |
| Görsel | `hazir-kartlar/1027-A-cember-daveti-4x5.jpg` (basıldı): `Açık Kapı'da yazarsın. / Çemberde konuşursun.` |
| Başlık | `Çember: On Altı Kadın, Doksan Dakika` |
| Açıklama | `Online. Kayıt yok, tavsiye yok.` |
| Varış | `https://ocak.biz/cember?utm_source=meta&utm_medium=paid&utm_campaign=cember-28ekim&utm_content=yazarsin-konusursun` |

**Birincil metin (M8, yeni):**

```
Çemberde bir söz değneği dolaşır. Kimdeyse o konuşur; kalanlar dinler.

Tavsiye verilmez, yargılanmaz, dışarı taşınmaz. Kayıt yoktur. Söz geldiğinde geçmek de bir sözdür.

On altı kadın, doksan dakika.

Çember · 28 Ekim Çarşamba · 21:00 · online
```

**Ç2 · Soğuk kitle (Kasım çemberleri: 4, 11, 18 Kasım)**

- Türkiye seti kitlesi; günde ~300 TL; her çemberden önceki dört gün.
- Kreatif: Advaita'nın "Çemberde ne olur?" videosu (10 Ekim çekim listesi, V-H) ya da D7 boş minder kartı.
- **Midjourney istemi (D7):**

```
an empty round floor cushion on a worn kilim in a sunlit room, morning light from the left, long soft shadow, warm cream plaster wall behind, generous empty space above, muted earth tones, coarse film grain --ar 4:5 --style raw --v 8.1 --stylize 80 --chaos 5 --sref https://cdn.midjourney.com/f683971a-a55b-41f1-94ce-3d73a9d7646a/0_2.png --sw 60 --no pure white, blown highlights, blue tones, teal, grey light, pink, lilac, neon, flowers, lotus, mandala, crystals, people, faces, text, watermark
```

- Kart metni: `On altı minder. / Biri boş.`
- Uyarı: çember Açık Kapı'dan pahalı ve daha büyük bir adım. Soğuk kitleden doğrudan çembere kayıt beklentisi düşük tutulur; Ç2'nin ödenmiş kayıt başı maliyeti iki çember sonunda eşiğin iki katını aşıyorsa kapanır ve yol "önce Açık Kapı, sonra çember" olarak kalır.
- Kontenjan yalnız bilgi cümlesidir: "On altı kadın." "Son yerler" yazılmaz.

## 9 · Kasım düzeni

- Her Açık Kapı kendi kampanya adıyla: `ak-2kasim`, `ak-9kasim`, `ak-16kasim`.
- Kreatif haftanın ışığıyla döner (gece, gündüz, insan); metin kalıbı `1101-A-acik-kapi-kalibi`.
- Tarih bandı ve saat kartı her Perşembe yenilenir.
- 10 Kasım günü bütün reklamlar durur.
- Haftalık tavan: ilk iki haftanın ödenmiş kayıt başı maliyetine göre 20 Ekim retrosunda belirlenir.

## 10 · Google arama (küçük deneme, Kasım)

Eski planda "bu turda yok" denmişti. Öneri: 19 Ekim'den sonra, günde 150 TL ile iki haftalık deneme.

| Alan | Değer |
|---|---|
| Anahtar kelimeler (tam ve öbek eşleşme) | `kadın çemberi`, `online kadın çemberi`, `kadın çemberi izmir`, `kadın buluşması online`, `mum meditasyonu` |
| Negatif | `eğitmenlik`, `sertifika`, `ücretsiz pdf`, `ne demek` |
| Başlıklar | `Kadın Çemberi · Online` · `Bir Akşamlığına Gel` · `Açık Kapı: Pazartesi 21:00` |
| Açıklama | `Bir saat, online. Advaita bir mum yakar, temayı açar. Yazarsın ya da sadece durursun.` |
| Varış | `https://ocak.biz/acik-kapi?utm_source=google&utm_medium=paid&utm_campaign=arama-kadin-cemberi` |

Arama hacmini ölçmedim; ilk iş Google Ads'in anahtar kelime aracında bu beş kelimeye bakmak. Hacim yoksa deneme açılmaz.

## 11 · Kullanılmayanlar

Mesaj reklamı (özel mesaja bağlı otomatik cevap yok), yapay zekâ sesi, yapay zekâ insanı, stok kadın fotoğrafı, Meta'nın otomatik metin ve görsel varyasyonları, geri sayım, "son yerler", mektup listesinin rızasız kitleye yüklenmesi.

**Kayıtlıları özel kitle olarak yüklemek** (eski plandaki fikir): yalnız "hariç tut" amacıyla ve yalnız gizlilik metni buna izin veriyorsa. Bu oturumda gizlilik metnini okumadım; okunmadan yapılmaz.

## 12 · Günlük okuma (her sabah 10:00)

| Satır | Kaynak |
|---|---|
| Harcama (toplam, set, reklam) | Ads Manager |
| Kayıt, ödenmiş kayıt, havale bekleyen | Notion Kayıtlar |
| Ödenmiş kayıt başı harcama | Harcama ÷ ödenmiş kayıt (havale Meta'da görünmez) |
| Kaynak (`utm_content`) ve şehir | Notion |
| Işık dökümü: gece, gündüz, insan | `utm_content` üzerinden |

Ads Manager ekran görüntüsü bu sohbete atılırsa günlük kapat-büyüt önerisi çıkar.
