---
name: ocak-teshis
description: OCAK sitesinde kod/layout/CSS teşhisi yapar. Bir şeyin "çalışmadığı", "görünmediği", "tutmadığı" söylendiğinde, bir fix uygulanmadan önce, ya da layout/dikey-ritim/genişlik şikayetlerinde açılır. Teşhisi dist/ çıktısından ve computed CSS'ten kurar, kaynak dosyadan değil.
---

# ocak-teshis

Teşhis eder, düzeltmez. Çıktısı bir rapordur; fix ayrı karardır.

## Birinci kural: "kod var" ≠ "output var"

Teşhis dosyadaki koda **dayanmaz**. `npm run build` sonrası gerçek `dist/` çıktısına
dayanır (KARAR 355). `ocak-site-icerik.md` dump'ı insan referansıdır; Kaan Notion'da
değişiklik yapınca geride kalır ve iki kez yanlış teşhise yol açtı.

**Sessiz fakirleşme en tehlikeli hata tipidir** — site "bozulmaz", özellik sessizce
düşer ve haftalarca fark edilmez.

```bash
cd ~/Desktop/hlaorpz/ocak-site-clone
npm run build
grep -rn "ARANAN" dist/ | head
```

## İkinci kural: statik CSS analizi yetmez (KARAR 419)

`.liste` / layout / dikey ritim / genişlik dokunuşlarında Chrome bağlanır ve
**computed CSS'ten** konuşulur. Statik analiz bu projede tekrar tekrar yanıldı:
merdiven px'i, başlık ortalama, kapalı öğe yüksekliği, section-arası boşluk — her
seferinde DevTools computed değeri kaynağı kesinleştirdi.

Bir CSS fix "tutmuyorsa" ve semptom tuhafsa: **önce DOM geçerliliğini sorgula.**
`<summary>` içindeki geçersiz `<h3>` üç tur CSS'e direndi çünkü sorun stil değildi.

## Üç katmanlı keşif (KARAR 137/138/140)

`grep` ile dosya okumak yetmez:

1. `dist` HTML'den gerçek DOM markup — element tipi (`p` mi `h2` mi), class ne taşıyor
2. Hangi CSS kuralları match ediyor + specificity hesabı
3. Hangisi yutuyor / hangisi hiç match etmiyor

DOM ölçümü ≠ render pixel. Görsel/tonal şikayette DOM rect tek başına yetmez.

## Bilinen sessiz kırılma yüzeyleri

- **`atmosfer.css:1538-1552` genişlik kolonu** (KARAR 427) — yeni CTA/kart section
  buraya eklenmezse baseline prose (38rem) alır, geniş çıkar. Dört selektör.
- **`[class^="ocak-"]` prefix-match** (KARAR 375) — `ocak-` ilk class değilse baseline
  sessizce düşer. Class attribute VALUE'sunun baştan eşleşmesi gerekir, word-match değil.
- **Notion marker sözleşmesi** (KARAR 409) — marker adı `splitBodyByMarkers` listesi
  veya plugin switch case'iyle eşleşir. Ad değişimi component'i render dışı bırakır.
  Yeni ad icat edilmeden önce hangi kapıya düştüğü teyit edilir.
- **`overflow: hidden` vs `clip`** (KARAR 372) — `hidden` görsel kırpar, layout
  extent'i korur; `clip` extent'i siler. `body { overflow-x: hidden }` zoom-out
  koruması **değildir**. Yatay taşma metriği:
  `documentElement.scrollWidth − documentElement.clientWidth`
  (`− innerWidth` mobil emülasyonda yalancı 0 verir).
- **Build-time tarih TZ'si** (KARAR 385) — SSG build UTC'dir. `new Date()` + `setHours`
  TR 00:00–03:00'te gün kaydırır. `Intl.DateTimeFormat('en-CA', {timeZone:'Europe/Istanbul'})`
  + leksikografik string-gün.
- **Client-safe ↔ server-only sınırı** (KARAR 394) — client `<script>`'in import ettiği
  modül `astro:content` çekerse Vite onu client bundle'a çeker.

## Rapor biçimi

**ölçüm → envanter → çakışma listesi → DUR.**

Ölçülemeyen rakam yazılmaz (KARAR 470). Her rakamın yanına üretim yöntemi: eşik, araç,
kaynak kümesi. Türkçe metinde `awk length` **bayt** sayar — uzunluk ölçümü `python3` ile.

Emüle mobil metrik gerçek cihazı temsil etmez. **Test-yeşili ≠ göz-temiz.**
Nihai teyit gerçek iPhone Safari'dedir ve otomatikleşmez.
