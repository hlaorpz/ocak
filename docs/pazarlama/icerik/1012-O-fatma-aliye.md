# 1012-O-fatma-aliye · Bir Kadın Vardı: Fatma Aliye

- **Hat:** O · OCAK genel
- **Amaç:** Serinin ilk kartı. Özellik: kendi adı. Kaydedilen ve paylaşılan içerik.
- **Tarih ve saat:** Pazartesi 12 Ekim, 09:30
- **Kanal:** @ocak.biz karusel (5 kart)
- **Işık:** Gündüz
- **Durum:** Hazır. Kart bu pakette basıldı (`hazir-kartlar/`); kodla çizilmiş zemin. Midjourney zemini gelince aynı metinle yeniden basılabilir. Olgular iki kaynaktan doğrulandı. Fotoğrafsız.
- **Yapılmazsa:** Sıraya döner; herhangi bir Cumartesi ya da boş sabah çıkar.

## Görsel

K1 keten zemin; K2–K4 krem; K5 kireç duvar ve pencere ışığı. Metin kömür; "kendi adı", "Fatma Aliye" ve "Ateş devralınır" toprak. İşaret yalnız K1 ve K5'te.

Hazır dosyalar: `1012-O-fatma-aliye-k1.jpg` … `k5.jpg`.

Midjourney nesnesi gelirse K1'in alt yarısına oturur: divit kalem ve boş bir kâğıt.

**Midjourney istemi**

D5 nesne (K1 için; kurucu 10 Ekim’de seçildi; adres istemde yazılı):

```
an old dip pen beside a blank sheet of handmade paper resting on a sunlit limewashed ledge, single object, morning light from the left, one long soft shadow, warm cream plaster background, generous empty space above, muted earth tones, coarse film grain --ar 4:5 --style raw --v 8.1 --stylize 80 --chaos 5 --sref https://cdn.midjourney.com/f683971a-a55b-41f1-94ce-3d73a9d7646a/0_2.png --sw 60 --no pure white, blown highlights, blue tones, teal, grey light, pink, lilac, neon, flowers, lotus, mandala, crystals, people, faces, text, watermark
```

## Ekran metni

| Kart | Metin |
|---|---|
| K1 | Bir kadın vardı: ilk kitabına adını yazamadı. |
| K2 | 1889. Fransızcadan bir roman çevirdi. Kapakta adı yoktu; imza yerinde iki kelime vardı: "Bir Hanım." |
| K3 | Yazmayı bırakmadı. 1892'de bir roman yayımladı. Bu kez kapakta kendi adı vardı: Fatma Aliye. |
| K4 | Ondan devraldığımız: *kendi adı.* Bir işi yapmak bazen yetmez; altına adını koymak gerekir. |
| K5 | Altına adını koymadığın ne var? / Ateş devralınır. |

## Caption

```
Fatma Aliye 1862'de İstanbul'da doğdu. İlk çevirisi Meram 1889'da "Bir Hanım" imzasıyla yayımlandı; o günlerde bir kadının edebiyatla uğraşması hoş karşılanmıyordu. 1892'de Muhadarat kendi adıyla çıktı.

Bu seride gerçek kadınları ve onlardan devraldığımız birer şeyi anlatıyoruz. Çünkü ateş sıfırdan başlamaz; devralınır.

#birkadınvardı #ocak
```

## İlk yorum

`Bugün altına adını koyduğun bir şey yaz. Küçük olsun.` (link yok)

## Story

Kapak kartı paylaşılır; ardından `story-kime-gonderirdin-9x16.jpg`.

## Etkileşim

Yorum sorusu hafif: bir iş, bir yemek, bir karar. K5'teki soru karta aittir, cevabı istenmez.

## Diğer kanallar

- **Facebook:** aynı gün, aynı görsel ve caption.
- **TikTok ve YouTube Shorts:** yalnız videolar; filigransız özgün dosya, müziksiz.
- **Pinterest:** yalnız söz kartları ve Bir Kadın Vardı kapakları; link `ocak.biz`.
- **WhatsApp Durum:** Advaita ve Kaan kartı kendi durumlarında paylaşır.
- **Site:** seri sayfası fikri (`/devraldiklarimiz`) planın Site bölümünde.

## Üretim ve skill

1. **Metin:** bu dosyada hazır; değişirse `ocak-metin` ile taslak, `ocak-lint` ile denetim.
2. **Kart:** `ocak-kart` (öneri) ya da `araclar/ocak_kart.py`. Gece kartı için mevcut kart derleyici.
3. **Yayın paketi:** `ocak-gonderi` (öneri): takvim teyidi, lint, caption ve story'nin kopyalanır hâli.
4. **Yorumlar:** `ocak-yorum` (öneri) ve `STRATEJI/yorum-ve-topluluk.md`.
5. **Araştırma:** sıradaki kadınlar için `ocak-kadin` (öneri; henüz yok): iki kaynak, hak kontrolü, tek özellik.

## Notlar ve kaynak

- Kaynak: [Fatma Aliye Topuz, Wikipedia](https://en.wikipedia.org/wiki/Fatma_Aliye_Topuz) · [Bianet](https://bianet.org/haber/tl-de-ilk-kez-bir-kadin-portresi-fatma-aliye-110046).
- Bazı kaynaklar imzayı "Bir Kadın" diye verir; çoğunluk "Bir Hanım".
- **Fotoğraf:** hakkına bakılır; temizse (kamu malı olduğu belgeli ya da izinli) K1'e girer, değilse fotoğrafsız kalır (Kaan, 9 Ekim). Kontrol listesi `icerik/havuz/bir-kadin-vardi-seri.md`.
