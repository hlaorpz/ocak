# marka/ — logo kaynak dosyaları

KARAR 522 marka işaretinin üretim kaynağı. Künye: `00-isaret-kunyesi.md`
(kanonik hâli `docs/20-ref-marka.md` A.16b'de — çelişkide **site gerçeği kazanır**, KARAR 102).

Klasör **düz**; alt dizin yok. Ayrım dosya adı önekiyle yapılır.

## Kullanım haritası

site → `public/` · Instagram ve WhatsApp → `ocak-kare-*` · antet ve banner → `ocak-antet-*` + `ocak-banner-*` · baskı ve damga → tek renk SVG (**bu klasörde yok**, aşağıya bak)

| Yüzey | Dosya |
|---|---|
| Site | `public/` altındaki beş varlık — `favicon.ico` · `favicon.svg` · `apple-touch-180.png` · `ocak-isaret.svg` · `ocak-logo-yatay.svg`. Buradaki eşlerine **birebir aynı** (sha256 teyitli); `marka/` kaynak, `public/` yayın yüzeyidir. **`public/` bu klasörden otomatik beslenmez** — elle kopyalanır. |
| Instagram · WhatsApp | `ocak-kare-isaret-{256,512,1024}.png` (yalnız işaret) · `ocak-kare-dikey-{256,512,1024}.png` (işaret + ad). 512 ve 1024 için `.jpg` eşleri de var. |
| Antet · banner | `ocak-antet-1200x300.png` · `ocak-banner-1600x400.png` |
| Paylaşım önizlemesi | `ocak-og-1200x630.png` |
| iOS ana ekran | `ocak-appicon.svg` (kare tuval, opak kömür zemin, %15 marj) |
| Baskı · damga · kaşe · gravür | Tek renk (`mono`) SVG — **bu klasörde yok.** Bkz. aşağıdaki eksik listesi. |
| Künye sunumu | `isaret.html` — bağımsız tek dosya sayfa (dış bağımlılık: Google Fonts) |

## Künye ile disk arasındaki fark (20 Ağu 2026 ölçümü)

Künye `svg/` ve `png/` **alt klasörleri** tarif ediyor; bu klasör düz. Ayrıca künyede adı geçen dört dosya burada yok:

| Künyede yazan | Nerede |
|---|---|
| `ocak-isaret-mono-krem.svg` | `Desktop/Ocak/xLogOcak/` |
| `ocak-isaret-mono-koz.svg` | `Desktop/Ocak/xLogOcak/` |
| `isaret-512.png` | `Desktop/Ocak/xLogOcak/` |
| `logo-dikey-800.png` | hiçbir yerde bulunamadı |

Tersi de var: `ocak-kare-*` (10 dosya), `ocak-antet-*`, `ocak-banner-*`, `ocak-og-*` ve `isaret.html` künyelerin hiçbirinde listelenmiyor. Mutabakat Kaan'ın kararını bekliyor.
