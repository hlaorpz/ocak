# Gündüz Paleti Siteye Nasıl Uyarlanır

Fikir düzeyinde. Sitenin kaynak kodu korpusta değil (`src/` servis edilmiyor); aşağıdaki teknik notlar kronoloji kayıtlarına dayanıyor, kodu bu oturumda ölçmedim. Uygulama kararı ve brief'i ayrı iştir.

## Bugünkü zemin (kronolojiden)

- Renkler tek dosyada: `src/styles/tokens.css` (`--coal #1A1210`, `--cream #F2EAE2`, `--ember #C44B2F`, `--gold #D4A855`, `--ash`, `--smoke`, `--warm-gray`). Kaynak: `90-kronoloji/2026-05.md:3865`.
- Gövde zemini `var(--bg)` = `var(--coal)`. Kaynak: `90-kronoloji/2026-05.md:1727`.
- `<main data-page=…>` her sayfada var. Kaynak: `90-kronoloji/2026-06.md:105`.
- Kural: beyaz (`#FFFFFF`) yasak (`yasak-dizeler.tsv:24`). Gündüz paleti bunu bozmaz; zemin krem.

Bu üçü birlikte iyi haber: renkler token'a bağlıysa gündüz teması yeni bir token kümesi demektir, sayfa sayfa boyama değil.

## Yedi fikir, küçükten büyüğe

### 1. Mailler krem zemine geçer

En az riskli, en çok kazandıran. Kayıt onayı, hatırlatma ve Ateş Mektupları krem zeminde kömür metinle: uzun metin koyu zeminde yorar, bazı posta istemcileri koyu şablonu kendi kafasına göre çevirir. Başlıkta köz renkli işaret, tek ince toprak çizgi. Site değişmeden bile yapılabilir.

### 2. "Okuma odaları" gündüz olur

Karar veren, form dolduran, ödeme yapan kadın aydınlık sayfada daha rahat eder. Gündüz olacaklar: kayıt formu ve kayıt sonrası ekran, `/takvim`, SSS blokları, yasal metinler. Gece kalacaklar: ana sayfa girişi, `/hikaye`, `/adimiz`, etkinlik sayfalarının üst bölümü.

Yapılışı: `data-page` üzerinden tema seçimi ya da bölüm bazında `data-tema="gunduz"`.

### 3. Sayfa içinde gece → gündüz → gece

Izgaradaki ritmin (gece · gündüz · insan) sayfa hâli. `/acik-kapi` örneği:

| Bölüm | Işık | Neden |
|---|---|---|
| Giriş: "Bir Akşamlığına Gel" | Gece | Akşamın duygusu |
| "O Akşam Ne Olur" + SSS | Gündüz | Bilgi; okunur, taranır |
| Advaita'nın fotoğrafı ve cümlesi | İnsan | Güven |
| Kapanış ve kayıt düğmesi | Gece | Mum yeniden yanar |

Geçişler keskin çizgiyle değil, kısa bir alacakaranlık bandıyla (kömürden kreme yumuşak geçiş, toprak tonundan geçerek).

### 4. Site güneşle açılır

Sitenin ışığı ziyaretçinin saatine uyar: 06:00–18:00 arası gündüz, 18:00–06:00 arası gece. "Ocak akşam küllenir, sabah üflenir" cümlesinin arayüz hâli.

- Küçük bir betik sayfa açılırken yerel saate bakar, `<html data-tema>` değerini koyar.
- Köşede küçük bir anahtar: mum (gece) ve pencere (gündüz). Kadın isterse elle değiştirir; seçim hatırlanır.
- Reklamdan gelen kadın gece kreatifinden geldiyse gece açılır (`utm_content` gece ise), gündüz kreatifinden geldiyse gündüz: reklam ile sayfa arasında ışık kopmaz.
- Risk: iki temanın her sayfada denenmesi gerekir; test yükü iki katına çıkar. Bu yüzden 2 ve 3'ten sonra.

### 5. Yeni arşiv sayfaları gündüz doğar

`/bir-kadin-vardi` (her kadın bir sayfa) ve `/sozler` (her söz bir sayfa). Sosyalde bir gün yaşayan içerik sitede kalıcı olur, aramadan ziyaret getirir. İkisi de baştan gündüz paletiyle kurulur; mevcut sayfalara dokunmadan paleti sitede denemenin yolu.

### 6. Paylaşım görselleri iki ışıkta

Link paylaşıldığında çıkan önizleme görseli (Open Graph): hediye içerik sayfalarında gündüz, davet sayfalarında gece. WhatsApp'ta gönderilen link de ızgara ritmini taşır.

### 7. İşaret

Açık zeminde işaretin yalnız tek renk köz sürümü kullanılır; koyu zeminde krem (`marka-isaret-kunyesi.md`). Site başlığındaki işaret tema ile birlikte değişir. Favicon değişmez.

## Gündüz token önerisi

| Token | Gece (bugün) | Gündüz |
|---|---|---|
| `--bg` | `#1A1210` kömür | `#F2EAE2` krem |
| `--metin` | `#F2EAE2` krem | `#1A1210` kömür |
| `--vurgu` | `#C44B2F` köz | `#B4654A` toprak (büyük metin), `#C44B2F` köz (işaret, düğme) |
| `--ikincil` | `#D4A855` altın | `#6E7453` zeytin |
| `--yuzey` | `#3D3532` kül | `#D9CBB6` keten |

## Okunabilirlik (hesaplandı)

WCAG kontrast oranları; bu oturumda formülle hesapladım (göreli parlaklık, `(L1+0,05)/(L2+0,05)`).

| Metin | Zemin | Oran | Sonuç |
|---|---|---|---|
| Kömür `#1A1210` | Krem `#F2EAE2` | 15,5 | Her boyutta uygun |
| Kömür | Keten `#D9CBB6` | 11,6 | Her boyutta uygun |
| Zeytin `#6E7453` | Krem | 4,1 | Yalnız büyük metin (4,5'in altında) |
| Köz `#C44B2F` | Krem | 4,0 | Yalnız büyük metin ve düğme |
| Toprak `#B4654A` | Krem | 3,6 | Yalnız büyük metin (başlık, vurgu) |
| Altın `#D4A855` | Krem | 1,9 | Kullanılmaz |

Sonuç: gündüzde gövde metni her zaman kömür. Toprak ve zeytin yalnız başlık ve vurguda. Altın gündüzde metin rengi olamaz; gece paletine aittir.

## Sıra önerisi

1. Mailler (bu ay).
2. `/bir-kadin-vardi` ve `/sozler` gündüz doğar (Kasım).
3. `/acik-kapi` içinde gece → gündüz → gece (Kasım sonu; 19 ve 26 Ekim'in verisiyle).
4. Kayıt formu ve `/takvim` gündüz (Aralık).
5. Güneşle açılan site (21 Aralık, kış gündönümü: "en uzun gece" günü açılışı).

Hepsi karar ister: palet `10-marka.md`'de sabit çekirdek. Karar satırı CC brief'inde aday olarak duruyor (`CC-BRIEF-3-kararlar.md`).

## Skill

`ocak-teshis` (mevcut) ile önce bugünkü durum ölçülür: token dosyası, tema bağlı olmayan sabit renkler, koyu zemine göre yazılmış gölge ve parlama katmanları. Ölçmeden brief yazılmaz.
