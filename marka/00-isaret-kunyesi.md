# OCAK — MARKA İŞARETİ (Künye)

**Mühürlendi:** 18 Ağustos 2026 · **Yapı:** Cormorant Garamond Light "O", iç boşlukta kor · perdesiz varyant

---

## HİKÂYE

Bir sembol aramadık. Ad zaten işaretti.

OCAK'ın ilk harfi bir çemberdir — ve o çember tek anda dört şeydir: **harfin kendisi**, **ocağın ağzı**, **üstten görülen ateş çukuru**, **kadınların etrafında oturduğu halka**. Dördü de aynı biçim. Hiçbiri diğerini dışlamaz, hiçbiri açıklama istemez.

İçine ateş koymadık; zaten yanıyordu. Yaptığımız tek şey harfin içindeki karanlığa bakmak ve orada bir kor olduğunu görmekti.

Kadın çizilmedi. Hilal yok, sarmal yok, yumuşatılmış hat yok, çiçek yok — bunların hepsi OCAK'ın kendini ayırdığı kategoriye ait. Çember zaten kadının biçimidir; binlerce yıl o çemberde oturuldu. Tarif edersen ucuzlar, ima edersen taşır.

**Çağrıştırmasın. Çağırsın.**

---

## YAPI

| | |
|---|---|
| Harf | Cormorant Garamond Light (300), outline'lanmış — font bağımlılığı yok |
| Dolgu kuralı | `nonzero`. TrueType glifleri çakışan konturlarla çizilir (A'nın kolu, K'nin birleşimi); `evenodd` o çakışmaları iptal edip harfin içinde boşluk açar |
| Işık | Radyal kor, iç boşlukta. Yarıçap iç boşluğun %70'i — kenarda karanlık pay kalır, kor harfi doldurmaz |
| Filtre | **Yok.** Yalnız gradyan. Her ortamda birebir aynı görünür |
| Beyaz | Hiçbir yerde kullanılmaz |

**Kor durakları:** `#F4AE7C` (çekirdek) → `#DA6C42` → `#C44B2F` → şeffaf
**Zemin:** `#1A1210` (Kömür — tek kanon, KARAR 485) · **Harf:** `#F2EAE2` (Krem)

Favicon kesiminde **harf ağırlığı aynıdır** — kalınlaştırma yok. Tek fark korun yoğunluğu: yumuşak şeffaf gradyan otuz iki pikselin altında kaybolduğu için orada opak bir dizi kullanılır (`#D97F51` → `#BE5130` → `#8E321E` → `#361711` → `#1A1210`), yarıçap iç boşluğun %66'sı.

---

## KULLANIM

**Asgari boyut:** işaret 24 px · yatay kilit 90 px genişlik · dikey kilit 70 px genişlik.

**Temiz alan:** işaretin her yanında en az kendi yüksekliğinin yarısı kadar boşluk. İçine metin, çizgi, kenarlık girmez.

**Zemin:** koyu. Krem kâğıt üstünde yalnız tek renk köz versiyonu kullanılır — gradyanlı hâl açık zeminde kullanılmaz.

**Yapılmaz:** dolgu kuralını `evenodd`'a çevirmek · döndürmek · gölge veya dış parlama eklemek · korun rengini değiştirmek · harfi başka bir fontla kurmak · işareti kontur (outline) hâline getirmek · iç boşluğu düz turuncuya boyamak · beyaz zemin.

---

## DOSYALAR

**`svg/`**
- `ocak-isaret.svg` — ana işaret
- `ocak-logo-yatay.svg` — OCAK, ilk O korlu · nav, imza, antet
- `ocak-logo-dikey.svg` — işaret üstte, ad altta · profil, kapak
- `ocak-favicon.svg` — aynı harf, yoğun kor · 32 px ve altı
- `ocak-isaret-mono-krem.svg` · `ocak-isaret-mono-koz.svg` — tek renk; damga, kaşe, gravür, tek renk serigrafi

**`png/`** (şeffaf zemin)
- `favicon-16` · `favicon-32` · `favicon-48` · `favicon.ico`
- `apple-touch-180`
- `isaret-512` · `logo-yatay-1200` · `logo-dikey-800`

---

## SİTE ENTEGRASYONU

```html
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" href="/ocak-favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-180.png">
```

Nav'da `ocak-logo-yatay.svg`, yüksekliği 26–32 px arası. Bu ölçekte kor tek sıcak noktaya iner — beklenen davranıştır, logo nav'da kendini anlatmaz, orada olduğunu bildirir.

---

## GÖRSEL ÜRETİMLE İLİŞKİSİ

Midjourney kurucu görseli ve tüm kart zeminleri bu ışık aralığına kilitlenir: çekirdek `#F4AE7C`, gövde `#C44B2F`, zemin `#1A1210`. Böylece üretilen her görsel logonun koruyla aynı ateşten çıkmış olur.
