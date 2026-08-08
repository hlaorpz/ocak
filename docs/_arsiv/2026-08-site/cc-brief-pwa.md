# CC Brief — PWA (manifest, ikonlar, minimal service worker)

> Amaç: uygulamanın gerçek cihazda **ana ekrandan, standalone** açılabilmesi.
> Geliştirme bundan sonra mobilde, PWA olarak gezilerek yürüyecek; sekmede test
> etmek dokunma hedefini, klavye davranışını ve standalone çerez davranışını
> ölçmez.
>
> Kapsam `docs/deploy.md` §7 ile aynı. Bu brief onu uygulanabilir hâle getirir.
>
> **Çevrimdışı desteği YOK ve olmayacak.** Klinik uygulamasında bayat hasta
> verisi göstermek, hiç göstermemekten kötü (`docs/product.md`, "Bilinçli
> sınırlar"). Service worker'ın tek işi kurulabilirlik kriterini karşılamak.
>
> **Push bildirimi kapsam dışı.**

---

## 1. Manifest

`apps/web/src/app/manifest.ts` — Next App Router yerel desteği
(`MetadataRoute.Manifest`). Ayrı bir `public/manifest.json` YAZILMAZ; iki
kaynak olursa biri güncellenmeden kalır.

Alanlar:

| Alan | Değer |
|---|---|
| `name` | `Cabbar` |
| `short_name` | `Cabbar` |
| `start_url` | `/` |
| `scope` | `/` |
| `display` | `standalone` |
| `background_color` / `theme_color` | mevcut tema değerleriyle uyumlu |
| `lang` | `tr` |
| `orientation` | `portrait` |

**Ürün adı kararı açık** (`status.md`, "Açık işler"): isim `Cabbar` yazılıyor
ama bir sabitten okunsun, üç ayrı yere string gömülmesin. İsim değişirse tek
yer değişsin.

---

## 2. İkonlar

`apps/web/public/` altına:

- `icon-192.png`, `icon-512.png` — `purpose: "any"`
- `icon-192-maskable.png`, `icon-512-maskable.png` — `purpose: "maskable"`
  (Android'de güvenli alan dışı kırpılır; maskable sürüm olmazsa ikon kenardan
  kesilir)
- `apple-touch-icon.png` — **180×180**, kökte

**Gerçek logo YOK.** Yer tutucu üret: düz zemin + tek harf, tema rengiyle.
Yer tutucu olduğu PR açıklamasına yazılsın; "logo geldi" sanılmasın.

---

## 3. iOS meta'ları

Next metadata API üzerinden (`layout.tsx`):

- `appleWebApp: { capable: true, title: <isim>, statusBarStyle: 'default' }`
- `themeColor` — viewport export'unda
- `viewport: { viewportFit: 'cover' }`

`viewportFit: 'cover'` ile birlikte **safe-area** CSS'i gerekiyor: standalone
modda iOS'ta üstte durum çubuğu, altta home indicator alanı var. Bunlar
hesaba katılmazsa içerik çentiğin ve alt çubuğun altında kalır. Kök layout'ta
`env(safe-area-inset-*)` uygulansın.

---

## 4. Service worker — saf geçirgen

`apps/web/public/sw.js`. **Hiçbir şey cache'lemez.**

Android Chrome'da "Ana ekrana ekle" istemi için manifest tek başına yetmiyor;
`fetch` dinleyicisi olan bir SW gerekiyor. iOS'ta gerekmiyor ama zararı yok.

- `fetch` dinleyicisi var, isteği olduğu gibi ağa geçiriyor
- `install` → `self.skipWaiting()`
- `activate` → `self.clients.claim()` ve **var olan tüm cache'leri sil**
  (ileride yanlışlıkla cache eklenirse ya da bu SW'nin önceki bir sürümü
  cache bıraktıysa temizlensin)

`skipWaiting` + `claim` olmadan eski SW sürümü sekmeler kapanana kadar kalır;
cache yokken bile SW dosyasının kendisi güncellenemez hâle gelir.

Kayıt: küçük bir client component, kök layout'ta. Kayıt hatası sessizce
yutulmasın — konsola düşsün.

---

## 5. Doğrulama — cihazda

Bunlar tarayıcıyı daraltarak yapılamaz.

- [ ] **Android Chrome:** yükleme istemi çıkıyor, ana ekrandan standalone açılıyor
- [ ] **iOS Safari:** "Ana Ekrana Ekle" → standalone açılıyor, ikon doğru
- [ ] **iOS standalone'da oturum çerezi taşınıyor** — giriş yap, uygulamayı
      kapat, ana ekrandan tekrar aç, oturum duruyor mu. Standalone'da çerez
      kapsayıcısı sekmedekinden ayrı davranabiliyor; masaüstünde `Lax` +
      `.cabbar.ocak.life`'ın çalışması bu konuda hiçbir şey söylemez.
- [ ] Safe-area: çentikli cihazda üst/alt içerik kesilmiyor
- [ ] Klavye açıldığında form alanı görünür kalıyor (özellikle giriş ekranı)

Son iki madde çıktısı **`status.md`'ye ekran iyileştirme listesine** yazılsın —
üç başlıkta ayrılıyor: eksik veri / kötü sunum / eksik aksiyon.
