# Sayfa Yazım Rehberi

Notion'da **Sayfalar** database'inde yeni sayfa eklerken veya mevcut sayfayı
güncellerken bu kalıbı koru. Sayfa gövdesi `notion-to-md` ile markdown'a çevrilir,
sonra `remark-ocak-sections` plugin'i section'ları HTML'e dönüştürür. Kalıbın dışına
çıkılırsa build log'una uyarı düşer (plugin fallback) — site çökmez ama o bölüm
beklenen biçimde render edilmez.

## Section Etiketleri

Her section bir H2 paragrafıyla başlar:

```
## section: ad
```

- `ad` snake-case / kebab-case, **TR karakter yok** (`cember-nedir`, `yillik-dongu`).
- Kanonik section'lar özel render alır: `hero`, `bir-sonraki`, `sonraki-bulusma`,
  `siradaki-kapi`, `sss`.
- Geri kalan section'lar serbest isimli — `<section data-section="ad" class="ocak-ad">`
  içine prose olarak sarılır, içerik olduğu gibi kalır.

## Hero Section

İlk satır metadata olabilir:

```
## section: hero

overline: ÇEMBER

# Sayfa Başlığı
```

- `overline: AD` (ALL CAPS önerilir, TR karakter serbest). Plugin bunu yakalar, hero
  bloğundan çıkarır ve `<section data-section="hero" data-overline="AD">` attribute'una
  taşır. Düz metin olarak görünmez.
- Overline yoksa satırı yazma — attribute da yazılmaz.

## Sonraki Buluşma Section

```
## section: sonraki-bulusma

source: etkinlikler:next-3
```

- `source: etkinlikler:next-N` — sitede gösterilecek yaklaşan etkinlik sayısı (N).
- İçerik **Etkinlikler** database'inden canlı gelir; bu section'a elle etkinlik yazma.
- Yalnız `durum` ∈ {Kayıt Açık, Dolu} VE `Sitede Göster` = true olan etkinlikler yayınlanır.

## SSS Section

Her soru **bold-italik tek-satır bullet**:

```
## section: sss

## Sorulanlar

- ***Soru metni burada?***

Cevap paragrafı. Düz metin.

İkinci cevap paragrafı (varsa) — desteklenir, hepsi tek cevaba sığar.

- ***İkinci soru?***

Onun cevabı.
```

- Soru = `- ***...***` (üç yıldız: bold + italik), satır sonundaki noktalama yıldızların
  **içinde**. Plugin yıldızları arındırıp `<summary>` üretir.
- Cevap = sorudan sonraki paragraf(lar), bir sonraki soruya kadar. Birden fazla
  paragraph `<div class="sss-cevap">` içinde toplanır.
- İsteğe bağlı alt başlık (`## Sorulanlar`) accordion'ların üstünde korunur.
- **H3 (`### Soru`) kullanma** — plugin H3'ü tanımaz, fallback'e düşer + uyarı verir.

## Markdown Delim Karakterleri — `*` ve `_` Yazma Disiplini

Notion içinde **`*` ve `_` karakterlerini metne hiç yazma.** Format için sadece
Notion'un kendi UI'sini kullan (Cmd+B / Cmd+I). Notion export sırasında bu
karakterleri kendisi ekliyor — sen literal yazarsan **asimetri** çıkar:

```text
Notion'da yazdığın:    **Bir geçişin içindesin**     ← literal ** + Cmd+B üstüne
Notion export ediyor:  ****Bir geçişin içindesin***  ← 4 açılış + 3 kapanış asimetri
Tarayıcıda görünen:    *Bir geçişin içindesin        ← solda ham * sızıyor
```

**Notion-to-md davranışı (#25 Brief A item 10 test sayfası dump'ından):**

| Annotation | Notion'da | notion-to-md output |
|---|---|---|
| İtalik | Cmd+I | `_xxx_` (underscore) |
| Bold | Cmd+B | `**xxx**` (double-star) |
| Bold + İtalik | Cmd+B + Cmd+I | `_**xxx**_` veya `**_xxx_**` (kombinasyon, simetrik) |
| Altı çizili | Cmd+U | `<u>xxx</u>` (raw HTML inject — markdown'da yok) |

**Kurallar:**

- **Bold:** Cmd+B. `**` karakter yazma.
- **İtalik:** Cmd+I. `_` veya `*` karakter yazma.
- **Bold + İtalik:** İkisini birden uygula (Cmd+B + Cmd+I).
- **Altı çizili (Cmd+U):** Tasarımda yer almıyor — kullanma. Vurgu için bold veya
  italik tercih et. `<u>` tag'i atmosfer.css'te stillenmemiş; kullanılırsa
  browser default `text-decoration: underline` (yabancı görünüm).
- **Plugin defansif:** Geçmiş içerikteki `* ****xxx***` artıklarını
  `remark-ocak-sections` listItem text node'unda strip eder (KARAR 108 7. kural).
  Ama yeni içerikte de bu yazımı kullanma — defans yeni edge case'leri
  yakalayamayabilir.

## Blockquote (`>` Notation) Disiplini

Blockquote = **anlamlı vurgu**. Tek-satır CTA ("Sonraki adım: …"), kısa alıntı
(şiir, manifesto kapanışı), kapanış cümlesi. Çoklu paragraf altında dipnot
olarak kullanma — okuma kolonu üstüne ember dik çizgi yığılmasına yol açar.

İki özel kural:

- **`bir-sonraki` section'ı içinde `>` notation kullanma.** Plugin section'ın
  tüm gövdesini zaten dış bir `<blockquote>` ile sarıyor (kanonik tasarım).
  Notion'da `>` ile bir blok daha açarsan **nested blockquote** oluşur — atmosfer
  baseline bu nested'i görsel olarak sıfırlasa da niyetsiz yapı kalır. Düz
  paragraf, başlık, link yaz; plugin sarımı kapanış vurgusunu zaten taşır.
- **Ardışık `>` blokları arası boş satır bırakma** (özellikle `iki-yolculuk`,
  `bir-sonraki` gibi `>`-yoğun section'larda). Notion `>` notation iki bloğu
  ayırmak için `>` arasına boş satır bekler; ama plugin `cleanWhitespaceNodes`
  whitespace-only paragraf/blockquote'ları kaldırsa da yazım niyetin
  okunaklı kalsın — peş peşe ilgili satırları aynı blok olarak ardışık yaz.

## Shift+Enter Kullanma

Notion'da satır içi line break için **Shift+Enter kullanma** — notion-to-md çoğu
zaman bunu HTML `<br>`'a dönüştürmüyor, satırlar tek paragraf gibi akıyor +
arada whitespace artığı bırakıyor. Sonuçta atmosfer kalibreli paragraf ritmi
bozulur (özellikle `bir-sonraki`, `cekirdek-vaat` gibi kısa satırlı kapanış
section'larında).

**Yanlış (Shift+Enter ile yazılmış):**

```
Yaz Gündönümü Çemberi[Shift+Enter]
21 Haziran 2026[Shift+Enter]
Online
```

**Doğru (her satır için Enter — ayrı paragraf):**

```
Yaz Gündönümü Çemberi

21 Haziran 2026

Online
```

Her satır için **yeni paragraf (Enter)**, satır içi break (Shift+Enter) değil.
Tarih + saat gibi ardışık kısa satırlar bile ayrı paragraf — plugin baseline
ritmi (`margin-bottom: var(--space-6)`) bunu görsel olarak topluyor.
