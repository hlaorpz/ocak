/**
 * kart-akisi.ts — Kart ödeme akışının tek anahtarı (KARAR 488).
 *
 * ── Ne olduğu ──
 * Kart akışı **silinmedi, kapatıldı.** Sağlayıcı anlaşması (KARAR 363 —
 * sanal POS hattı) gelene kadar yüzey de backend dalı da kapalı durur;
 * anlaşma gelince geri açmak bir env değişikliği + entegrasyon olsun,
 * arkeoloji olmasın. Bugünkü tek ödeme ucu havale/EFT (KARAR 217).
 *
 * ── Anahtar ──
 * `KART_AKISI` — `PUBLIC_` öneki YOK. Client'ın bilmesine gerek yok, bundle'a
 * düşmesin. Yüzey zaten SSR'da hiç render edilmiyor; flag'i tarayıcıya taşımak
 * kapatılan şeyin adını sızdırmak olurdu.
 *
 * ── Varsayılan KAPALI — bilinçli ──
 * Açık olması için `KART_AKISI=acik` yazılması gerekir. Tanımsız, boş, `kapali`
 * ya da yazım hatası → hepsi kapalı. Ödeme yüzeyi fail-open olamaz: bir
 * ortamda anahtarı koymayı unutmak, sağlayıcı anlaşması olmayan bir kart
 * akışını sessizce geri açardı. Brief'in yazdığı `KART_AKISI=kapali` değeri de
 * aynen çalışır (kapatır); yalnız *açma* yönü açık irade ister.
 *
 * ── ⚠ DEĞER BUILD ZAMANINDA SABİTLENİR — env'i değiştirmek YETMEZ ──
 * `import.meta.env.KART_AKISI` Vite tarafından build sırasında sabitle
 * değiştirilir; çalışma zamanında okunmaz. Ölçüm (19 Ağu, `dist/` çıktısı,
 * `chunks/kart-akisi_*.mjs`): anahtar tanımsızken chunk
 * `kartAkisiAcikMi()` çağrısına ve sabit `false`'a katlanmıştı.
 * **Vercel'de anahtarı değiştirdikten sonra REDEPLOY şart.**
 *
 * Bu bilinçli: altı tüketicinin üçü zaten doğası gereği build zamanlı —
 * sitemap build'de üretiliyor, kayıt sayfaları `prerender: true` (yöntem
 * radyosu statik HTML'e basılıyor), `oda-map` Notion loader'ında tükeniyor.
 * Çalışma zamanı okuması bu üçünü çeviremez, yalnız yarı-açık bir durum
 * üretirdi: backend kapalı, yüzey açık. Tek zaman ekseni daha az yalan söyler.
 *
 * ── `PAYMENT_PROVIDER` neden bu işi yapamaz ──
 * `getPaymentProvider()` (`payment-provider.ts`) `mock`/`nkolay` dışındaki her
 * değerde throw eder. `none` yazmak yüzeyi gizlemez, `/api/kayit`'i 500'e
 * düşürür — kadın hata ekranı görür. Ayrı anahtar şart.
 *
 * ── `PAYMENT_PROVIDER`'ın yapabildiği: mock yüzeyini DARALTMAK (B193, 7 Eki) ──
 * Yukarıdaki paragraf hâlâ doğru — `PAYMENT_PROVIDER` kart akışını kapatamaz.
 * Ama bir şeyi yapabilir: sağlayıcı `nkolay` iken `/odeme/mock` ekranının
 * açık durması için hiçbir sebep yoktur. Kadın oraya `checkoutBaslat` ile
 * yalnız mock sağlayıcı seçiliyken iner (`mockPaymentProvider.checkoutBaslat`
 * → `url.pathname = '/odeme/mock'`); `nkolay` seçiliyken o sayfa ulaşılabilir
 * kalırsa **tahsilat olmadan "ödendi"** üreten bir yüzey açıkta durur.
 * Bu yüzden mock sayfasının İKİ kapısı var: `KART_AKISI_ACIK` (akışın tamamı)
 * ve `MOCK_SAGLAYICI_ACIK` (yalnız mock yüzeyi). İkisi ayrı satır, `&&` ile
 * birleştirilmez — KARAR 573: koşul ölçülebilir kalmalı.
 *
 * ── Altı tüketici ──
 *  1. `api/kayit.ts`         — `odemeYontemi === 'kart'` → 400
 *  2. `api/odeme-callback.ts`— 410, hiçbir Notion yazımı yok
 *  3. `KayitFormu.astro`     — yöntem radio grubu SSR'da render edilmez
 *  4. `/odeme/{mock,nkolay,tamam,iptal}` — 404
 *     ⚠ `/odeme/mock`'un İKİNCİ kapısı da var: `MOCK_SAGLAYICI_ACIK` (B193).
 *  5. `oda-map.ts`           — dört entry listeden düşer; `/odeme/mock` ayrıca
 *     `MOCK_SAGLAYICI_ACIK` kapalıyken tek başına düşer (`MOCK_ROUTELARI`)
 *  6. `astro.config.mjs`     — sitemap filtresi dört route'u eler
 *     ⚠ 01 Eki 2026'dan beri bu tüketici artık anahtara BAĞLI DEĞİL: filtre
 *     `/odeme/` önekini koşulsuz eliyor (`astro.config.mjs`, gerekçe orada).
 *     KARAR 488 koşulu silinmedi, ikinci kapı olarak duruyor — yani bu satır
 *     "anahtar kapalıyken eler" diye okunur, "yalnız o zaman eler" diye değil.
 *
 * Sıra önemli: 1 ve 2 (backend) önce, sonra 3 (yüzey). Yüzeyi önce kaldırmak
 * backend dalını açıkta bırakır.
 */

/**
 * Ham env değerini karara çevirir — saf, test edilebilir.
 *
 * Ayrı fonksiyon olmasının sebebi iki okuma bağlamı: `src/` tarafı
 * `import.meta.env`'den okur, `astro.config.mjs` ise config yüklenirken
 * Vite'ın `loadEnv`'iyle okur (config bağlamında `import.meta.env` custom
 * değişkenleri taşımaz). İki okuyucu, tek kural.
 */
export function kartAkisiAcikMi(ham: string | undefined | null): boolean {
  return (ham ?? '').trim().toLowerCase() === 'acik';
}

/** `src/` tarafının okuduğu tek değer. Config tarafı `kartAkisiAcikMi`'yi kendi okur. */
export const KART_AKISI_ACIK = kartAkisiAcikMi(import.meta.env.KART_AKISI);

/**
 * Kapalıyken elenen ödeme route'ları — sitemap filtresi ve `oda-map` ortak
 * kaynağı. **BEŞ üye** (7 Eki 2026: `/odeme/devam` katıldı, B211 İŞ 5).
 *
 * Yeni bir `/odeme/*` sayfası eklerken buraya katmak ŞART: listede olmayan bir
 * route kart akışı kapalıyken `ODA_MAP`'te kalır ve odası çözülebildiği için
 * 404 yerine boş bir sayfa olarak yayında durur.
 */
export const KART_ROUTELARI = [
  '/odeme/mock',
  '/odeme/nkolay',
  '/odeme/tamam',
  '/odeme/iptal',
  '/odeme/devam',
] as const;

/**
 * `PAYMENT_PROVIDER` ham değerini "mock sağlayıcı mı" kararına çevirir — saf,
 * test edilebilir. `kartAkisiAcikMi` ile aynı desen, aynı sebep: kural tek
 * yerde yaşasın ve iki okuyucu (sayfa kapısı + `getPaymentProvider` factory)
 * aynı cümleyi söylesin.
 *
 * ── ⚠ VARSAYILAN FAIL-CLOSED DEĞİL — bilinçli, gerekçesi ──
 * **Tanımsız** değer (`undefined`/`null`) mock sayar (true döner).
 * `kartAkisiAcikMi`'nin tam tersi, ve bu bir tutarsızlık değil:
 * **yönlendirme açıkken kapı kapalı
 * olamaz.** `getPaymentProvider()` tanımsız env'de `mockPaymentProvider`
 * döndürüyor (bu dosyanın altındaki factory), o da kadını `/odeme/mock`'a
 * yönlendiriyor. Kapıyı burada fail-closed yapmak factory'yi yalanlardı:
 * kadın yönlendirilir, indiği sayfa 404 verir — yani kayıt akışı sessizce
 * kırılır ve teşhis "ödeme çalışmıyor" diye gelir.
 *
 * `KART_AKISI`'nda fail-closed DOĞRU, çünkü orada karşılığında yönlendirmenin
 * kendisi de kapanıyor (`api/kayit.ts` → 400). Tek zaman ekseni gibi, tek
 * irade ekseni de daha az yalan söyler: kapı, kendisine yönlendiren kararla
 * aynı kaynaktan beslenir.
 *
 * Production'da anahtar `nkolay` yazılı (11 Eyl) — yani canlıda kapı KAPALI.
 * Varsayılanın gevşekliği yalnız anahtarın hiç yazılmadığı ortamlarda (yerel
 * dev, test) etkili, ve orada mock akışı zaten istenen davranış.
 *
 * ── ⚠ BOŞ DİZE mock SAYILMAZ — `??` boş dizeyi yakalamaz, ölçüldü ──
 * `'' ?? 'mock'` → `''`, yani boş ve yalnız-boşluk değerler false döner.
 * Bu bir kaza değil, factory'nin ÖNCEKİ davranışının aynısı: eski kod
 * `(env ?? 'mock').toLowerCase()` yazıyordu ve `''` için `mock` dalına değil
 * `throw`a gidiyordu. Yani boş anahtarda iki taraf da KAPALI yanda —
 * kapı 404, factory 500; yarı-açık hâl yok, değişmez korunuyor.
 * (Eski docstring *"boş/undefined → mock default"* diyordu; 7 Eki'de
 * koşulduğunda yanlış çıktı ve düzeltildi — gerçeklik spec'i ezer.)
 */
export function mockSaglayiciMi(ham: string | undefined | null): boolean {
  return (ham ?? 'mock').trim().toLowerCase() === 'mock';
}

/**
 * Yürürlükteki sağlayıcı mock mu. **Tek okuma noktası** — `/odeme/mock`
 * sayfası, `oda-map` elemesi ve `getPaymentProvider()` factory'si ÜÇÜ de bu
 * sabiti okur, kendi `import.meta.env` okumasını yapmaz. Üç ayrı okuma, üç
 * ayrı yazım hatası ihtimali demekti.
 *
 * ⚠ Değer BUILD ZAMANINDA sabitlenir (`KART_AKISI` ile aynı mekanizma) —
 * Vercel'de anahtarı değiştirmek yetmez, REDEPLOY şart.
 */
export const MOCK_SAGLAYICI_ACIK = mockSaglayiciMi(import.meta.env.PAYMENT_PROVIDER);

/**
 * Yalnız mock sağlayıcıya ait route'lar — sağlayıcı `nkolay` iken bunlar
 * düşer, kart akışı açık olsa bile. `/odeme/{tamam,iptal}` buraya GİRMEZ:
 * ikisi sağlayıcı-ortak dönüş ekranları, N-Kolay da onlara dönüyor.
 */
export const MOCK_ROUTELARI = ['/odeme/mock'] as const;
