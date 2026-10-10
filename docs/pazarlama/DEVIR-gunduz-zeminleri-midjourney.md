# Devir · Gündüz zeminleri için Midjourney sohbeti

> **Kurucu seçildi (10 Ekim 2026, Kaan).** Gündüz çapası: `https://cdn.midjourney.com/f683971a-a55b-41f1-94ce-3d73a9d7646a/0_2.png` · Bu dosyadaki bütün istemlerde `--sref` bu adresle yazılıdır; `GUNDUZ-URL` geçen yerler bu adres demektir. Karenin kopyası depoda: `pazarlama-ekler/araclar/zemin/gunduz-kurucu.png` (960×1200). Kaan seçti; **mühürlenmedi** — mühür ve gündüz zeminleri Midjourney sohbetinin işi (`03-sira.md`, KARAR ADAYLARI).

Bu dosyayı yeni sohbetin ilk mesajına ekle. Tek başına yeter; başka dosya gerekmez.

## İş

OCAK Instagram'ına gündüz paleti girdi (10 Ekim 2026). İlk kartlar kodla çizilmiş zeminlerle basıldı (`araclar/ocak_kart.py`); sakin ve tutarlılar ama fotoğraf dokusu yok. Bu sohbetin işi Midjourney'de gündüz zeminlerini üretmek, seçmek ve aynı metinlerle kartları yeniden basmak.

## Ne zaman Midjourney, ne zaman kod

| Kart türü | Öneri | Neden |
|---|---|---|
| Söz kartları, Külün Altından, story zeminleri | İkisi de olur; dönüşümlü | Düz zemin metni öne çıkarır; hepsi Midjourney olursa ızgara kalabalıklaşır |
| Bir Kadın Vardı kapakları (K1: kalem, çanak, taş, mala) | **Midjourney** | Nesne kodla çizilemez |
| Çember daveti (aralık kapı), sabah masası, boş minder | **Midjourney** ya da gerçek fotoğraf | Sahne gerekiyor |
| Karusel iç kartları | Tek Midjourney üretiminin crop'ları ya da kod | Kart kart ayrı üretim seriyi dağıtır |
| Özel gün kartları (29 Ekim, 10 Kasım) | Kod (düz zemin) | Sade kalmalı |
| İnsan, el, yüz | **Hiçbiri**; yalnız gerçek çekim | Kural |

## Sıra

1. **Kurucu (D1).** `--sref` olmadan dört beş tur; ölçütlerle ele; kazananı upscale et. Adresi `GUNDUZ-URL`.
2. Bütün istemlerde `GUNDUZ-URL` yerine o adresi koy (tek ara-değiştir).
3. D5 kalem ve çanak (12 ve 17 Ekim kapakları) → D2 → D3 (27 Ekim) → D4, D7.
4. Seçilen her görseli sohbete yükle; kart `ocak_kart.py --zemin dosya.png` ile aynı metinle yeniden basılır.
5. Seçilen zeminler için `31-zemin.md`'ye satır: CC brief'i.

## Kurallar

- Kilitli kuyruk: `--style raw --v 8.1 --chaos 5`. Gece çapası (z01) gündüz istemlerine **bağlanmaz**; kare kararır.
- `--no` kelimeyi keser, kavramı kesmez: istem gövdesinde insan ya da el anan kelime kullanma ("hand", "held", "figure", "invitation").
- Karusel zemini yüzey olur, nesne olmaz. Kumaş sürekli yüzey olarak tutmaz; duvar tutar.
- Üst üçte iki sakin kalmalı; metin oraya oturur. Metin kömür `#1A1210`, vurgu toprak `#B4654A`, işaret köz `#C44B2F`.
- Yapay zekâ ile üretilmiş insan, el, yüz yok. Beyaz yok; pastel, çiçek, kristal, mandala yok.
- Bu istemlerin hiçbiri henüz çalıştırılmadı; ilk tur kanaryadır. Ne çıktığını ölçmeden "tuttu" deme.

## Yeniden basılacak kartlar (metinler hazır)

| Kart | Zemin | Metin |
|---|---|---|
| `1010-O-soz-kullenen` | D1 | Küllenen şey / *sönmüş* değildir. |
| `1011-A-bir-saat` | D1 | Kimseye bir şey borçlu olmadığın / *bir saat.* + alt bant |
| `1012-O-fatma-aliye` K1 | D5 kalem | Bir kadın vardı: … |
| `1015-O-soz-dayanmak` | D2 ya da düz zeytin | Dayanmak bir beceri. / Tek beceri olmak zorunda değil. |
| `1014-O-kulun-altindan-derman` | D2 | Derdini söylemeyen / derman bulamaz. |
| `1017-O-fureya-koral` K1 | D5 çanak | Bir kadın vardı: … |
| `1018-O-yanina-al` | D4 | Yanına al: … |
| `1027-A-cember-daveti` | D3 | Açık Kapı'da yazarsın. / *Çemberde konuşursun.* |
| `1028-O-sabah-ocagi` | D4 ya da fotoğraf | İlk yudumu / *oturarak* iç. |
| `1030-O-atesi-kim-yakti` | D2 | Sana ateşi kim yaktı? / *Adını yaz.* |

Tam metinler ve alt bantlar pazarlama paketindeki aynı adlı dosyalarda (`icerik/`); toplu basım örneği `araclar/kartlari_bas.py`.

## 2 · Palet

| Renk | Kod | Kullanım | Durum |
|---|---|---|---|
| Krem | `#F2EAE2` | Gündüz zemini; en açık renk | Mevcut |
| Keten | `#D9CBB6` | İkinci zemin, alt bant, kutu | Yeni |
| Toprak | `#B4654A` | Kil, kiremit; tek kelimelik vurgu | Yeni |
| Zeytin | `#6E7453` | Yaprak, gölge, ince çizgi, küçük alt satır | Yeni |
| Kömür | `#1A1210` | Gündüz kartında metin | Mevcut |
| Altın | `#D4A855` | Yalnız koyu ve toprak zeminde; krem zeminde okunmaz (kontrast 1,9) | Mevcut |
| Köz rengi | `#C44B2F` | Gündüz kartında yalnız OCAK işaretinde; metin vurgusu Toprak | Mevcut |

- Beyaz `#FFFFFF` yok.
- Pembe, lila, nane, bebek mavisi yok ("wellness-pastel" anti-listesi, `30-sosyal.md` 0b).
- Ten bir renk kodu değildir; yalnız gerçek fotoğraftan gelir.

## 4 · Gündüz kurucusu (Gün 0-G)

Gece sisteminde her şey z01'e `--sref` ile bağlı. Gündüzün kendi çapası olmalı; z01'e bağlanırsa kare kararır.

1. Aşağıdaki D1 istemini `--sref` olmadan dört beş tur koş (16–20 aday).
2. Ölçütlerle ele (bölüm 6).
3. Kazananı upscale et; adresini kopyala.
4. Aşağıdaki bütün istemlerde `GUNDUZ-URL` yazan yere o adresi koy (tek ara-değiştir; KARAR 450).
5. Dosya adı: `ocak-zNN-kirec-duvar-sabah-YYYY-AA-GG.png`; `31-zemin.md`'ye yeni satır (CC).

## 5 · İstemler

Kilitli kuyruk: `--style raw --v 8.1 --chaos 5`. Karusel iç kartları tek üretimin crop'larıdır.

İki ilke (korpustan): `--no` listesi kelimeyi keser, kavramı kesmez; istem gövdesinde insan ya da el anan kelime kullanılmaz. Karusel zemini yüzey olur, nesne olmaz; kumaş sürekli yüzey olarak tutmaz, duvar tutar.

**D1 · Kireç duvar (kurucu; söz kartları ve karuseller)**

```
sunlit limewashed wall in the early morning, raking light from the left with the source out of frame, one long soft diagonal shadow in the lower third, warm cream plaster with fine trowel texture, upper two thirds calm and almost empty, muted earth tones, quiet, coarse film grain --ar 4:5 --style raw --v 8.1 --stylize 60 --chaos 5 --no pure white, blown highlights, blue tones, teal, grey light, pink, lilac, neon, flowers, lotus, mandala, crystals, furniture, people, faces, text, watermark
```

Kurucu seçildikten sonra aynı istem `--sref https://cdn.midjourney.com/f683971a-a55b-41f1-94ce-3d73a9d7646a/0_2.png --sw 60` ile.

**D2 · Zeytin dalı gölgesi (söz kartları, story zeminleri)**

```
shadow of an olive branch falling across a sunlit limewashed wall, late morning, warm cream plaster, soft-edged leaf shadows in the lower third, upper two thirds calm and empty, muted olive and clay tones, quiet, coarse film grain --ar 4:5 --style raw --v 8.1 --stylize 70 --chaos 5 --sref https://cdn.midjourney.com/f683971a-a55b-41f1-94ce-3d73a9d7646a/0_2.png --sw 60 --no pure white, blown highlights, blue tones, teal, grey light, pink, lilac, flowers, people, faces, text, watermark
```

Story için aynı istem `--ar 9:16`.

**D3 · Eşiğin sabahı (Çember daveti; C03 kapısının gündüzü)**

```
old wooden door of an Anatolian village house slightly ajar in the morning, seen from inside a dim plastered room, a blade of warm daylight falling through the gap onto a worn stone threshold, empty threshold, door small in the lower third, calm warm plaster wall filling the upper two thirds, soft shadows, coarse film grain --ar 4:5 --style raw --v 8.1 --stylize 90 --chaos 5 --sref https://cdn.midjourney.com/f683971a-a55b-41f1-94ce-3d73a9d7646a/0_2.png --sw 50 --no pure white, blown highlights, blue tones, teal, grey light, night, flames, people, faces, text, watermark
```

Gece V03 gövdesi figür üretmişti (B183: "invitation without a figure" kavramı çağırıyor). Bu istemde o ifade yok; yine de her karede kapı aralığı gözle kontrol edilir.

**D4 · Sabah masası (Yanına Al, pratik kartları)**

```
still life on unbleached linen in soft morning light from the left: an unlit cream candle with a blackened wick, a closed notebook with a pencil, a small tulip-shaped glass of amber tea with faint steam, a sprig of olive, long soft shadows, warm cream and clay tones, calm empty space above, coarse film grain --ar 4:5 --style raw --v 8.1 --stylize 90 --chaos 5 --sref https://cdn.midjourney.com/f683971a-a55b-41f1-94ce-3d73a9d7646a/0_2.png --sw 60 --no pure white, blown highlights, blue tones, teal, grey light, flowers, people, faces, text, watermark
```

Tek kart için; karusel zemini olarak kullanılmaz (nesne zemin). Tercih edilen kaynak telefonla gerçek çekimdir.

**D5 · Tek nesne (Bir Kadın Vardı, K1)**

```
[NESNE] resting on a sunlit limewashed ledge, single object, morning light from the left, one long soft shadow, warm cream plaster background, generous empty space above, muted earth tones, coarse film grain --ar 4:5 --style raw --v 8.1 --stylize 80 --chaos 5 --sref https://cdn.midjourney.com/f683971a-a55b-41f1-94ce-3d73a9d7646a/0_2.png --sw 60 --no pure white, blown highlights, blue tones, teal, grey light, flowers, people, faces, text, watermark
```

| Kadın | `[NESNE]` |
|---|---|
| Fatma Aliye | `an old dip pen beside a blank sheet of handmade paper` |
| Füreya Koral | `a small rough unglazed clay bowl` |
| Halet Çambel | `a single weathered basalt stone with faint carved lines` |
| Mualla Eyüboğlu | `a mason's trowel with dried lime on its blade` |
| Sıradaki | `a young olive sapling in a small terracotta pot` |

Nesne tarifinde "hand", "finger", "held" gibi kelimeler kullanılmaz; kavramı çağırır.

**D6 · Eller: yalnız gerçek çekim.** Midjourney'de üretilmez.

## 6 · Seçim ölçütleri

Gece ölçütlerinin (üstKaranlık, ton, luma; `31-zemin.md`) gündüz eşleri. Eşikler öneridir; ilk üretimde kalibre edilir ve hepsi orandır (KARAR 572: ölçek-bağımsız).

| Ölçüt | Tanım | Önerilen eşik |
|---|---|---|
| üstSakin | Karenin üst %60'ında luma standart sapması | Düşük; metin bölgesinde doku var, desen yok |
| üstAçık | Üst %60'ta ortalama luma | 170–225; kömür metin rahat okunur |
| patlama | Luma 245 üstü piksel oranı | %1'in altı |
| ton | Doygunluğu 0,10 üstü piksellerin medyan hue'su | 25°–45° (sıcak sarı-turuncu) |
| gölge | Luma 90 altı piksel oranı | %3–%20; gölge var ama kareyi yutmuyor |

**Göz anti-listesi (biri varsa ele):** her yeri eşit aydınlık kare · beyaz patlaması · mavi ya da gri ışık · pastel renk · çiçek, kristal, mandala · stok fotoğraf parlaklığı · herhangi bir insan izi · yazı ya da filigran · üst bölümde metne yer bırakmayan desen.


## D7 · Boş minder (çember)

```
an empty round floor cushion on a worn kilim in a sunlit room, morning light from the left, long soft shadow, warm cream plaster wall behind, generous empty space above, muted earth tones, coarse film grain --ar 4:5 --style raw --v 8.1 --stylize 80 --chaos 5 --sref https://cdn.midjourney.com/f683971a-a55b-41f1-94ce-3d73a9d7646a/0_2.png --sw 60 --no pure white, blown highlights, blue tones, teal, grey light, pink, lilac, neon, flowers, lotus, mandala, crystals, people, faces, text, watermark
```

## Kart basıcı

```
python3 araclar/ocak_kart.py --zemin d1-secilen.png --metin "Küllenen şey|*sönmüş* değildir." --cikti 1010-O-soz-kullenen-4x5.jpg
python3 araclar/ocak_kart.py --zemin d1-secilen-9x16.png --oran 9:16 --metin "Küllenen şey|*sönmüş* değildir." --cikti 1010-O-soz-kullenen-9x16.jpg
```

Satırlar `|` ile ayrılır; `*yıldız*` vurgu. `--bant` alt bilgi, `--not` küçük alt satır. Görsel kadraja oturtulur; metin rengi üst bölgenin aydınlığına göre seçilir. Basıcı ve fontlar pazarlama zip'inde `araclar/` altında; yeni sohbete o klasörü de ekle.
