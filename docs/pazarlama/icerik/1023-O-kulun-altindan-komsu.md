# 1023-O-kulun-altindan-komsu · Külün Altından: "Komşu komşunun külüne muhtaçtır"

- **Hat:** O · OCAK genel
- **Amaç:** Söz serisinin ikinci kartı. İstemenin ayıp olmadığını bu dilin kendi sözüyle söylemek; Çember'e (28 Ekim) zemin.
- **Tarih ve saat:** Cuma 23 Ekim, 09:30
- **Kanal:** @ocak.biz tek kart; story
- **Işık:** Gündüz
- **Durum:** Metin hazır. Kart basıldı (`hazir-kartlar/`); komut aşağıda.
- **Yapılmazsa:** Sıraya döner; herhangi bir Cuma çıkar.

## Görsel

Kireç duvar zemini (kodla ya da D1). Söz kömür, büyük; "külüne" toprak. Alt satır küçük, zeytin: `bu dilin sözü`.

**Midjourney istemi**

D1 zemin (isteğe bağlı):

```
sunlit limewashed wall in the early morning, raking light from the left with the source out of frame, a soft patch of window light in the lower third, warm cream plaster with fine trowel texture, upper two thirds calm and almost empty, muted earth tones, quiet, coarse film grain --ar 4:5 --style raw --v 8.1 --stylize 60 --chaos 5 --no pure white, blown highlights, blue tones, teal, grey light, pink, lilac, neon, flowers, lotus, mandala, crystals, people, faces, text, watermark, furniture
```

## Ekran metni

> Komşu komşunun
> *külüne* muhtaçtır.

Alt satır: `bu dilin sözü`

## Caption

```
Bu sözü biz bulmadık; dilin içinde bekliyordu.

Kül bile lazım olur. İstemek ayıp değil.

Çemberde kimse kimseye tavsiye vermez. Ama herkes bir şey alır, bir şey bırakır.

#külünaltından #kadınçemberi
```

## İlk yorum

`Külüne muhtaç olduğun kadın kim? İlk harfi yeter.`

## Story

1. Kart + "Aklına biri geldiyse ona gönder."
2. Anket (İstek mi, ihtiyaç mı dizisi, üçüncü gün): Birinin "nasılsın" diye sorması · İstek / İhtiyaç.

## Etkileşim

İlk harf yazmak beş saniye sürer ve kimseyi açıkta bırakmaz. Her yoruma beğeni ve kısa cevap; kural `STRATEJI/yorum-ve-topluluk.md`.

## Diğer kanallar

- **Facebook:** aynı gün, aynı görsel ve caption.
- **TikTok ve YouTube Shorts:** yalnız videolar; filigransız özgün dosya, müziksiz.
- **Pinterest:** yalnız söz kartları ve Bir Kadın Vardı kapakları; link `ocak.biz`.
- **WhatsApp Durum:** Advaita ve Kaan kartı kendi durumlarında paylaşır.

## Üretim ve skill

1. **Kart:** `python3 araclar/ocak_kart.py --zemin kirec --metin "Komşu komşunun|*külüne* muhtaçtır." --not "bu dilin sözü" --cikti 1023-O-kulun-altindan-komsu-4x5.jpg`
2. **Metin:** `ocak-lint`.
3. **Yayın paketi:** `ocak-gonderi` (öneri).

## Notlar ve kaynak

- Atasözünün bilinen anlamı: insan en küçük şey için bile yakınındakine ihtiyaç duyar. Genel bilgimden yazdım; yayından önce TDK Atasözleri Sözlüğü'nden kontrol.
- "Kül" kelimesi serbest; yasak olan "köz"ün kamu metninde kullanımı. Bu kartta geçmiyor.
- Serinin diğer sözleri `havuz/kulun-altindan-seri.md`.
