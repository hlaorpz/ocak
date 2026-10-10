---
name: ocak-kart
description: OCAK söz, davet ve karusel kartlarını basar (gündüz ya da gece). Kart basılacakken, bir metin karta dönüştürülecekken ya da 4:5 ve 9:16 sürümleri gerektiğinde açılır.
---

# ocak-kart

`ocak_kart.py` kart basıcısını doğru komutla çalıştırır ve çıktıyı denetler. Betik depoda `scripts/ocak_kart.py` yolundadır; depoya girmediyse pazarlama paketinde `araclar/ocak_kart.py` (Python 3, Pillow ve numpy; fontlar yanındaki `fonts/` klasöründe).

## Önce denetle

- **Kelime sayısı:** ekran metni en çok on dört on altı kelime. Aşıyorsa kısaltma öner; kendin kısaltıp basma.
- **Vurgu:** en çok bir kelime ya da bir satır `*yıldız*` arasında.
- **Metin** `ocak-lint`'ten geçmiş olmalı. Emoji yok.
- **Zemin:** beyaz (`#FFFFFF`) yok. Yapay zekâ ile üretilmiş insan, el ya da yüz içeren görsel zemin olmaz.

## Zeminler

| Ad | Ne | Metin |
|---|---|---|
| `kirec` | Sıvalı duvara düşen pencere ışığı | Kömür, vurgu toprak |
| `zeytin-golgesi` | Güneşli duvarda dal gölgesi | Kömür, vurgu toprak |
| `keten`, `krem` | Düz açık zemin | Kömür, vurgu toprak |
| `toprak`, `zeytin` | Düz koyu zemin | Krem |
| `gece` | Kömür zemin, alttan sıcak ışık | Krem, vurgu altın |
| dosya yolu | Midjourney zemini ya da gerçek fotoğraf | Üst bölgenin aydınlığına göre otomatik |

Palet: Krem `#F2EAE2`, Keten `#D9CBB6`, Toprak `#B4654A`, Zeytin `#6E7453`, Kömür `#1A1210`, Altın `#D4A855`. Altın krem zeminde metin rengi olmaz (kontrast 1,9).

**İşaret:** açık zeminde yalnız tek renk köz (`#C44B2F`), koyu zeminde krem.

**Hangi zemin:** akşamı ve Açık Kapı gecesini anlatan kart gece; sabahı, gündeliği, hediye içeriği anlatan kart gündüz. Izgarada arka arkaya iki gece kartı gelmez; arka arkaya üç aynı gündüz zemini de gelmez (kireç, zeytin gölgesi, keten, toprak dönüşümlü).

## Komut

```
python3 scripts/ocak_kart.py --zemin kirec --metin "Küllenen şey|*sönmüş* değildir." --cikti 1010-O-soz-kullenen-4x5.jpg
python3 scripts/ocak_kart.py --zemin kirec --oran 9:16 --metin "Küllenen şey|*sönmüş* değildir." --cikti 1010-O-soz-kullenen-9x16.jpg
```

- Satırlar `|` ile ayrılır; `||` yarım satır boşluk bırakır.
- `--bant "Açık Kapı · 19 Ekim Pazartesi · 21:00 · online"` alt bilgi satırı.
- `--not "bu dilin sözü"` küçük alt satır.
- `--oran` `4:5` (1080×1350, varsayılan), `9:16` (1080×1920), `1:1`.
- Diğer ayarlar: `--tema`, `--vurgu`, `--isaretsiz`, `--metin-ust`, `--punto`, `--tohum`.
- Dosya adı gönderi adıyla aynı olur: `AAGG-Hat-ad-4x5.jpg`; karuselde `-k1`, `-k2`…

Her feed kartının 9:16 story sürümünü de bas. Karuselde bütün kartlar aynı zemin ailesinden olur; kapak farklı bir düz zemin olabilir.

## Sonra bak

Basılan dosyayı aç ve gözle kontrol et: metin taşmıyor, Türkçe harfler doğru (ş, ğ, ı, İ), vurgu okunuyor, işaret yerinde, alt bant kesilmiyor. Görmeden "basıldı, iyi" deme.

## DUR koşulları

1. Metin on altı kelimeyi aşıyor ve kısaltma anlamı değiştiriyor.
2. Beyaz zemin ya da palet dışı renk isteniyor.
3. Zemin olarak yapay zekâ ile üretilmiş insan görseli verilmiş.
4. Kart Advaita'nın sözünü taşıyor ve söz ondan gelmemiş.
5. Pillow ya da numpy kurulu değil ve kurulum onay gerektiriyor.