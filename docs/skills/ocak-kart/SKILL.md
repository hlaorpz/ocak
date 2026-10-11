---
name: ocak-kart
description: OCAK söz, davet ve karusel kartlarını basar (gündüz ya da gece). Kart basılacakken, bir metin karta dönüştürülecekken ya da 4:5 ve 9:16 sürümleri gerektiğinde açılır.
---

# ocak-kart

Kartı **kart derleyici** basar: `tools/ocak-kart-derleyici.html` (tek ve kanonik araç, KARAR 652). Tarayıcıda açılan tek dosyadır; basan Kaan'dır. Bu skill kartın **reçetesini** hazırlar, basılan kartı **denetler**. `ocak_kart.py` kanonik değildir (KARAR 654); onunla kart basılmaz.

Güncel gündüz kuralları ledger'da KARAR 653'ün halefindedir (`docs_karar(653)` → `iliski` sütunundaki `→`). Bu dosyadaki değerler 11 Ekim 2026 derleyicisinden (v4) okundu; çelişkide derleyici dosyası kazanır (KARAR 102).

## Önce denetle

- **Kelime sayısı:** ekran metni en çok on dört on altı kelime. Aşıyorsa kısaltma öner; kendin kısaltıp reçeteye yazma.
- **Vurgu:** en çok bir kelime ya da bir satır `*yıldız*` arasında.
- **Metin** `ocak-lint`'ten geçmiş olmalı. Emoji yok.
- **Zemin:** beyaz (`#FFFFFF`) yok. Yapay zekâ ile üretilmiş insan, el ya da yüz içeren görsel zemin olmaz.

## Reçete

Kaan'a şu sırayla, kopyalanır biçimde ver:

1. **Işık:** Gece ya da Gündüz.
2. **Kart:** Söz kartı · 4:5, Karusel ya da Story · 9:16.
3. **Zemin:** Görsel (dosya adıyla) · gecede Glow · gündüzde Krem, Keten, Toprak, Zeytin.
4. **Metin:** kod bloğu içinde, satır satır. Satır sonu satırı böler. **Boş satır yeni blok açar ve alt blok küçük basılır.** Vurgu `*yıldız*` arasında.
5. **Alt bant** (varsa): `Açık Kapı · 19 Ekim Pazartesi · 21:00 · online`
6. **Kart adı:** gönderi adıyla aynı, uzantısız: `AAGG-Hat-ad` (zemin eki eklenebilir: `-kirec`, `-kalem`).
7. **İndir:** tek kartta "4:5 + 9:16 birlikte indir" → `<ad>-4x5.png` ve `<ad>-9x16.png`. Karuselde "Karuselin tümünü indir" → `<ad>-k1.png`, `-k2`…
8. **İnce ayar** yalnız gerekiyorsa, kaydırıcının adı ve değeriyle (örnek: Metni kaydır 0.04 · Yatay kaydır −0.34).

Her feed kartının 9:16 sürümü de basılır. Söz kartı ile story'nin ince ayarları ayrı saklanır (biçim hafızası); ışık, zemin ya da görsel değişince sıfırlanır.

## Derleyicinin kendiliğinden yaptıkları

Reçeteye yazılmaz; bilinir, sonuçta aranır.

| | Gece | Gündüz, açık zemin | Gündüz, toprak · zeytin |
|---|---|---|---|
| Metin | Krem | Kömür, bir kademe kalın (500) | Krem |
| Vurgu | Köz `#C44B2F` | `#B4401F` | yok |
| İşaret | korlu halka | tek renk köz, yarım kademe kalın | tek renk krem |
| Alt bant | krem | kömür | krem, tam opak |

- Dizgi iki ışıkta aynıdır: konum, punto, aralık, işaretin yeri ve boyu. Gece ↔ gündüz geçişinde yazı kaymaz.
- 9:16'da blok kartın ortasında değil yukarısında durur.
- Gündüz fotoğrafında metnin arkasına krem perde gelir. Sert dokulu görsel kendiliğinden yumuşatılır (panelde sertlik değeri yazar, eşik 17).
- Altın yalnız gece zirve kartında metin rengidir (`F1 zirve kartı · altın` ön ayarı).
- Korlu işaret yalnız gece zemininde kullanılır.

## Zeminler

Envanter ve ölçümler `docs/31-zemin.md`. Gündüz dosyaları depoda `pazarlama-ekler/araclar/zemin/`.

| Zemin | Ne | Karta gider mi |
|---|---|---|
| z01–z11 | Gece: kül, kor, kıvılcım, kapı | Evet; hangisi hangi karta, `31-zemin.md` |
| z12 | Kireç duvar, sabah | **Hayır.** Gündüz `--sref` çapasıdır, üstünde gölge kaması var |
| z13 | Kalem ve kâğıt, kireç | Tek nesne kartı (Bir Kadın Vardı K1) |
| z14 · z15 | Düz kireç | Evet; söz ve davet kartları |
| Krem · Keten · Toprak · Zeytin | Düz renk, mala dokulu; derleyicide çizilir | Evet; kalıcıdır, yedek değil |

**Hangi ışık:** akşamı ve Açık Kapı gecesini anlatan kart gece; sabahı, gündeliği, hediye içeriği anlatan kart gündüz. Izgarada arka arkaya iki gece kartı gelmez; arka arkaya üç aynı gündüz zemini de gelmez. Karuselde bütün kartlar aynı zemin ailesinden olur; kapak farklı bir düz zemin olabilir.

Palet: Krem `#F2EAE2`, Keten `#D9CBB6`, Toprak `#B4654A`, Zeytin `#6E7453`, Kömür `#1A1210`, Altın `#D4A855`, Köz `#C44B2F`. Altın krem zeminde metin rengi olmaz (kontrast 1,9).

## Bilinen tuzaklar

- Derleyici yazı tiplerini Google Fonts'tan çeker. Bağlantısız basılan kartta yazı tipi yanlış çıkar.
- Kullanıcının kaydettiği ön ayarlar tarayıcının `localStorage`'ında yaşar, dosyada değil: başka tarayıcıda ve başka makinede görünmez. Taşımak için İnce ayar'daki JSON kutusu. Herkes için kalıcı olacak ayar gömülü ön ayara eklenir (kod işi, CC).
- Gündüz zeminleri 960×1200'dür; derleyici büyütür ve "BÜYÜTÜYOR" uyarısı verir (B236). Uyarı kartı durdurmaz.
- `pazarlama-ekler/kartlar-2026-10-10/` içindeki 44 kart eski basıcının biçimindedir (B235); "hazır" sayılmaz, derleyiciyle yeniden basılır.

## Sonra bak

Kaan basılan kartı gönderince aç ve gözle kontrol et: metin taşmıyor, Türkçe harfler doğru (ş, ğ, ı, İ), vurgu okunuyor, işaret yerinde ve doğru hâlde (gecede korlu, gündüzde tek renk), alt bant kesilmiyor, 9:16'da üstte ve altta Instagram arayüzünün kapatacağı yere yazı düşmüyor. Görmeden "basıldı, iyi" deme.

## DUR koşulları

1. Metin on altı kelimeyi aşıyor ve kısaltma anlamı değiştiriyor.
2. Beyaz zemin ya da palet dışı renk isteniyor.
3. Zemin olarak yapay zekâ ile üretilmiş insan görseli verilmiş.
4. Kart Advaita'nın sözünü taşıyor ve söz ondan gelmemiş.
5. Kartın `ocak_kart.py` ile basılması isteniyor.
6. Açık zemine korlu işaret ya da z12 zemini isteniyor.
