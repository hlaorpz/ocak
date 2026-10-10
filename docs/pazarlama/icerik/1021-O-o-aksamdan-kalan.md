# 1021-O-o-aksamdan-kalan · O Akşamdan Kalan

- **Hat:** O · OCAK genel
- **Amaç:** Tanıklık yasağına uyan sosyal kanıt: sayı ve tek kelimeler. "Orada gerçekten kadınlar vardı."
- **Tarih ve saat:** Çarşamba 21 Ekim, 09:30
- **Kanal:** @ocak.biz karusel (3–5 kart) ya da tek kart
- **Işık:** Gündüz
- **Durum:** Taslak; sayılar ve kelimeler 20 Ekim'de gelir. Kart 20 Ekim akşamı basılır.
- **Yapılmazsa:** Düşer. Yedek: havuzdan söz kartı 5 ("Bilmiyorum demek de bir yer."). Kelimeler haftalık mektuba taşınır.

## Görsel

Zeytin gölgesi zemini (kodla ya da D2). K1 sayı kartı; sonraki kartlarda birer kelime, büyük, ortada, toprak renginde.

**Midjourney istemi**

D2 zemin (isteğe bağlı; kodla çizilmiş zemin hazır):

```
shadow of an olive branch falling across a sunlit limewashed wall, late morning, warm cream plaster, soft-edged leaf shadows in the lower third, upper two thirds calm and empty, muted olive and clay tones, quiet, coarse film grain --ar 4:5 --style raw --v 8.1 --stylize 70 --chaos 5 --sref https://cdn.midjourney.com/f683971a-a55b-41f1-94ce-3d73a9d7646a/0_2.png --sw 60 --no pure white, blown highlights, blue tones, teal, grey light, pink, lilac, neon, flowers, lotus, mandala, crystals, people, faces, text, watermark
```

## Ekran metni

| Kart | Metin |
|---|---|
| K1 | [SAYI] kadın. [SAYI] mum. Bir saat. |
| K2–K4 | Ertesi sabah kalan kelimeler, kart başına bir kelime |
| K5 | Sıradaki akşam: 26 Ekim Pazartesi. / Ateşin yanında yer var. |

Sayılar yazıyla yazılır ("on yedi kadın"). Kelime gelmediyse yalnız K1 ve K5 basılır.

## Caption

```
Pazartesi akşamı bir saat aynı yerdeydik: herkes kendi evinde, kendi mumuyla.

Açık Kapı kaydedilmez. O akşam orada kaldı; buraya yalnız ertesi sabahın kelimeleri geldi, yazanların izniyle.

Sıradaki Açık Kapı 26 Ekim Pazartesi akşamı: İstek mi, İhtiyaç mı?

#açıkkapı #kadınçemberi
```

## İlk yorum

`ocak.biz/acik-kapi`

## Story

1. Kartın kapağı paylaşılır.
2. İlk "İstek mi, ihtiyaç mı?" anketi: Uyku · İstek / İhtiyaç (dizi `1025-A-istek-mi-ihtiyac-mi` dosyasında).
3. "Neredesin?" anketi: Türkiye / Avrupa / Daha uzak (22 Ekim akşamı için).

## Etkileşim

Yorum sorusu yok; kelimeler zaten kadınlardan geldi.

## Diğer kanallar

- **Facebook:** aynı gün, aynı görsel ve caption.
- **TikTok ve YouTube Shorts:** yalnız videolar; filigransız özgün dosya, müziksiz.
- **Pinterest:** yalnız söz kartları ve Bir Kadın Vardı kapakları; link `ocak.biz`.
- **WhatsApp Durum:** Advaita ve Kaan kartı kendi durumlarında paylaşır.

## Üretim ve skill

1. **Kart:** `python3 araclar/ocak_kart.py --zemin zeytin-golgesi --metin "on yedi kadın.|on yedi mum.|*Bir saat.*" --cikti k1.jpg` (sayı değişir).
2. **Metin:** `ocak-lint`.
3. **Yayın paketi:** `ocak-gonderi` (öneri).

## Notlar ve kaynak

- Sayı kişisel veri değildir; isim, yüz, alıntı cümle yok. `30-sosyal.md` kural 4 (tanıklık yok) ile uyum için kelime tek kelimeyle sınırlı.
- Katılım on kadının altındaysa sayı kartı basılmaz; yalnız kelimeler ve davet çıkar.
- 26 Ekim başlığı 8 Ekim korpus ölçümünden; paylaşmadan önce takvimden teyit.
