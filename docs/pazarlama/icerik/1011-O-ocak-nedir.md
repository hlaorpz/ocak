# 1011-O-ocak-nedir · OCAK Nedir

- **Hat:** O · OCAK genel
- **Amaç:** Reklamdan gelen kadına tek gönderide OCAK'ı anlatmak. İtiraz: "Bu nasıl bir yer?"
- **Tarih ve saat:** Pazar 11 Ekim, 09:30
- **Kanal:** @ocak.biz karusel (8 kart); sabitlenir
- **Işık:** Gece
- **Durum:** Metin hazır; sekiz zemin crop'u Kaan'da (1080×1350). Kartlar basılmadı, yayınlanmadı.
- **Yapılmazsa:** Sıraya döner; sabit gönderi olduğu için ilk boş sabah çıkar.

## Görsel

V02 kül dokusu, tek üretim, sekiz crop. Dosyalar: `ocak-nedir-k1-zemin-2026-10-09.png` … `k8`. K1 tam kare; K2'den K8'e pencere kora doğru iner.

- Metin her kartta üst %62'de; K6–K8'de kor topağının üstüne metin binmez.
- Kart derleyici: Biçim → Karusel → "Kart başına görsel yükle" → sekiz dosya birlikte. Grade ve grain şablonda.

**Midjourney istemi**

V02 (zemin kaybolduysa yeniden üretim; tek kare, Vary Subtle + HD, sonra sekiz crop):

```
fine grey ash surface with hairline cracks revealing faint orange ember light beneath, top-down macro, most of the frame in shadow, tactile mineral texture, quiet, dark negative space upper half --ar 4:5 --style raw --v 8.1 --stylize 110 --chaos 5 --sref https://cdn.midjourney.com/b6457637-7065-4c39-b551-268b156c9408/0_2.png --sw 60 --no flames, fire, wildfire, burning, lava, volcano, cracked earth, dry lake bed, drought, desert, sand, bright white, blown highlights, daylight, grey light, blue tones, teal, people, faces, hands, text, watermark
```

## Ekran metni

| Kart | Metin | Kaynak |
|---|---|---|
| K1 | OCAK nedir? | |
| K2 | Kadınların bir ateşin etrafında toplandığı bir alan. Kalbinde her zaman bir çember. | Bio |
| K3 | Bir retreat şirketi değil, bir wellness markası değil. Bir topluluk. | Ana Metin |
| K4 | Kadınlar burada kadim bilgeliği hatırlıyor, kendi araç kutusunu dolduruyor, birbirini güçlendiriyor. | Ana Metin |
| K5 | Her buluşmada ateş yanıyor. Açılışta yakılıyor, kapanışta içimize taşınıyor. | Korunacak ifade 4 |
| K6 | Çemberde herkes eşit. İlk kez gelen kadın da, yıllardır bu yollarda olan da aynı yerde oturuyor. | OCAK WAY 3 |
| K7 | Seni bize bağımlı yapmak için değil, seni sana geri vermek için buradayız. | Korunacak ifade 1 |
| K8 | Ateşin yanında yer var. | Bio kapanışı |

## Caption

```
OCAK'ın kapıları farklı ritimlerde açılır: bir saatlik online bir akşam da var, bir yıla yayılan bir yol da. Hepsinin iskeleti aynı: ateş, çember, paylaşım.

Bilgi araç, asıl olan deneyim. Bir kadın buradan eve giderken yanında kendi araçlarını taşıyor.

İçine sinen kapıdan başla.

#kadınçemberi #ocak
```

## İlk yorum

`İlk kapı: https://www.ocak.biz/acik-kapi`

## Story

Gönderi paylaşılır; üstüne krem metin: "Kalbinde her zaman bir çember." Ardından `story-kime-gonderirdin-9x16.jpg`.

## Etkileşim

Son karta soru eklenmez; gönderi sabit duracak.

## Diğer kanallar

- **Facebook:** aynı gün; ondan önce C01–C03 ve reels yüklenmiş olmalı.
- **Pinterest:** K1 ve K7.

## Üretim ve skill

1. **Metin:** bu dosyada hazır; değişirse `ocak-metin` ile taslak, `ocak-lint` ile denetim.
2. **Kart:** `ocak-kart` (öneri) ya da `araclar/ocak_kart.py`. Gece kartı için mevcut kart derleyici.
3. **Yayın paketi:** `ocak-gonderi` (öneri): takvim teyidi, lint, caption ve story'nin kopyalanır hâli.
4. **Yorumlar:** `ocak-yorum` (öneri) ve `STRATEJI/yorum-ve-topluluk.md`.

## Notlar ve kaynak

- Metin: "1910 Marketing" sohbeti, 9 Ekim.
- K3'teki iki "değil" Ana Metin'den; aynı kartta "Bir topluluk." ile çözülür.
