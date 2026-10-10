# 1025-A-istek-mi-ihtiyac-mi · İstek mi, İhtiyaç mı? (26 Ekim Açık Kapı daveti)

- **Hat:** A · Açık Kapı daveti
- **Amaç:** İkinci Açık Kapı'yı doldurmak; temayı dört günlük anket dizisiyle açmak. Bu dosya sonraki Açık Kapı davetlerinin de kalıbıdır.
- **Tarih ve saat:** Anketler Çar 21 – Cmt 24 Ekim; feed Pazar 25 Ekim 09:30; buluşma Pazartesi 26 Ekim 21:00
- **Kanal:** @ocak.biz feed, story; Advaita'nın hesabı; reklam
- **Işık:** İnsan (gündüz çekimi)
- **Durum:** Metin taslak; etkinlik gövdesini bu oturumda okumadım. Metin gövdeyle karşılaştırılmadan yayınlanmaz. Çekim 10 Ekim listesinde (iki avuç karesi).
- **Yapılmazsa:** Çekim yoksa alternatifle çıkar; gönderi düşmez. Anket günlerinden biri atlanırsa dizi kalan günlerle sürer; telafi edilmez.

## Görsel

Gerçek çekim, gündüz, pencere ışığı. İki avuç yan yana: biri boş, birinde tek bir nesne (ceviz ya da taş).

**Midjourney istemi**

Alternatif zemin D1 (çekim yoksa):

```
sunlit limewashed wall in the early morning, raking light from the left with the source out of frame, a soft patch of window light in the lower third, warm cream plaster with fine trowel texture, upper two thirds calm and almost empty, muted earth tones, quiet, coarse film grain --ar 4:5 --style raw --v 8.1 --stylize 60 --chaos 5 --no pure white, blown highlights, blue tones, teal, grey light, pink, lilac, neon, flowers, lotus, mandala, crystals, people, faces, text, watermark, furniture
```

## Tercih ve alternatif

- **Tercih (yüzlü):** Advaita kadrajda, yüzü yumuşak odakta, avuçları önde ve net.
- **Alternatif:** yalnız avuçlar. Çekim hiç yoksa kireç zemin üstünde yalnız metin.

## Ekran metni

> İstek mi,
> ihtiyaç mı?

Alt bant: `Açık Kapı · 26 Ekim Pazartesi · 21:00 · online`

## Caption

```
İkisi çoğu zaman aynı kelimeyle söylenir: "istiyorum."

Pazartesi akşamı bir saat bu ikisine birlikte bakıyoruz. Advaita bir mum yakar, temayı açar, bir pratikle bedene indirir. Yazarsın ya da sadece durursun.

Bir saat, online. Evinden, kendi mumunla.

Açık Kapı: İstek mi, İhtiyaç mı? · 26 Ekim Pazartesi · 21:00

#açıkkapı #kadınçemberi
```

## İlk yorum

`ocak.biz/acik-kapi`

## Story

Her gün tek anket, iki seçenek: İstek / İhtiyaç.

| Gün | Anket | Cevap kartı (akşam, sonuçla) |
|---|---|---|
| Çar 21 | Uyku | "Çoğumuz 'ihtiyaç' dedik. Peki neden en son sıraya koyuyoruz?" |
| Per 22 | Yalnız kalmak | "İkiye bölündük. Pazartesi'nin sorusu tam burada." |
| Cum 23 | Birinin "nasılsın" diye sorması | Sonuç + "Ateşin yanında yer var." |
| Cmt 24 | Bir saat | "Pazartesi akşamı bir saat var." + link |

Cevap kartlarının cümleleri sonuca göre yeniden yazılır. Paz 25 akşam: "Yarın akşam 21:00." + link. Pzt 26 sabah: "Bu akşam 21:00. Kapı aralık."

Saat kartı (yurt dışı): `Türkiye 21:00 · Berlin 19:00 · Londra 18:00` (Avrupa 25 Ekim'de kış saatine geçti).

## Etkileşim

Anket dizisi tek başına çalışır: beş saniyede cevap, cevap kadını açıkta bırakmaz, dördüncü gün doğrudan davete bağlanır.

## Diğer kanallar

- **Reklam:** Türkiye seti 20 Ekim'den itibaren bu akşama döner; `utm_campaign=ak-26ekim`. Kreatifler `reklam-detay.md` bölüm 7.
- **Mail:** 19 Ekim'e kaydolup gelemeyenlere 24 Ekim'de tek satırlık hatırlatma.
- **Facebook, WhatsApp Durum:** aynı kart.

## Üretim ve skill

1. **Çekim:** Advaita'nın brief'i, kare F-4.
2. **Kart:** `ocak_kart.py --zemin <foto.jpg>`; foto yoksa `--zemin kirec`.
3. **Story cevap kartları:** `ocak_kart.py --oran 9:16`.
4. **Yayın paketi:** `ocak-gonderi` (öneri).

## Notlar ve kaynak

- Başlık ve saat 8 Ekim korpus ölçümünden. Kapasite ve gövde okunmadı.
- "Her akşamın bir sorusu" çerçevesi site için kullanılmıyor (KARAR 623). Bu dizi yalnız bu akşamın story'lerini ilgilendirir; başlığın kendisi zaten soru.
