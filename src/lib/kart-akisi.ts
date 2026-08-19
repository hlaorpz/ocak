/**
 * kart-akisi.ts — Kart ödeme akışının tek anahtarı (KARAR 488).
 *
 * ── Ne olduğu ──
 * Kart akışı **silinmedi, kapatıldı.** Sağlayıcı anlaşması (KARAR 363 —
 * PayTR/sanal POS hattı) gelene kadar yüzey de backend dalı da kapalı durur;
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
 * `getPaymentProvider()` (`payment-provider.ts`) `mock`/`iyzico` dışındaki her
 * değerde throw eder. `none` yazmak yüzeyi gizlemez, `/api/kayit`'i 500'e
 * düşürür — kadın hata ekranı görür. Ayrı anahtar şart.
 *
 * ── Altı tüketici ──
 *  1. `api/kayit.ts`         — `odemeYontemi === 'kart'` → 400
 *  2. `api/odeme-callback.ts`— 410, hiçbir Notion yazımı yok
 *  3. `KayitFormu.astro`     — yöntem radio grubu SSR'da render edilmez
 *  4. `/odeme/{mock,tamam,iptal}` — 404
 *  5. `oda-map.ts`           — üç entry listeden düşer
 *  6. `astro.config.mjs`     — sitemap filtresi üç route'u eler
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

/** Kapalıyken elenen üç ödeme route'u — sitemap filtresi ve `oda-map` ortak kaynağı. */
export const KART_ROUTELARI = ['/odeme/mock', '/odeme/tamam', '/odeme/iptal'] as const;
