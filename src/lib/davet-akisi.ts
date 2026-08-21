/**
 * davet-akisi.ts — Davet gönderiminin tek anahtarı (musluk).
 *
 * ── Ne olduğu ──
 * Davet akışı **silinmedi, kapatıldı.** 20 Ağustos 2026 09:13 UTC'den itibaren
 * `/api/davet` açık röle gibi kullanıldı: saat başı, toplanmış bir spam
 * listesine, OCAK'ın gerçek davet şablonuyla mail gitti. Ölçüm Resend
 * log'undan (`User-Agent: resend-node:6.14.0` → çağrı Vercel'deki uygulamadan;
 * kabuktan atılsa `curl` görünürdü). API anahtarı sızmadı.
 *
 * Bu anahtar kanamayı durdurur. Origin kontrolü + zaman damgası + honeypot
 * (`davet-kapi.ts`) musluk yeniden açıldığında altta duracak tabandır —
 * anahtarın yerine geçmez, çünkü hiçbiri imzalı bir kimlik değil.
 *
 * ── Anahtar ──
 * `DAVET_AKISI` — `PUBLIC_` öneki YOK (`KART_AKISI` deseni, KARAR 488).
 * Client'ın bilmesine gerek yok, bundle'a düşmesin. Kapalıyken yüzey zaten
 * SSR'da hiç render edilmiyor; flag'i tarayıcıya taşımak kapatılan şeyin adını
 * sızdırmak olurdu.
 *
 * ── Varsayılan KAPALI — bilinçli ──
 * Açık olması için `DAVET_AKISI=acik` yazılması gerekir. Tanımsız, boş,
 * `kapali` ya da yazım hatası → hepsi kapalı. Mail gönderen bir uç fail-open
 * olamaz: bir ortamda anahtarı koymayı unutmak, aktif kötüye kullanılan bir
 * röleyi sessizce geri açardı. Pratik sonucu şu — bu commit merge edildiği an
 * davet kapanır, Vercel'de hiçbir env işlemi gerekmez.
 *
 * ── ⚠ DEĞER BUILD ZAMANINDA SABİTLENİR — env'i değiştirmek YETMEZ ──
 * `import.meta.env.DAVET_AKISI` Vite tarafından build sırasında sabitle
 * değiştirilir; çalışma zamanında okunmaz. `KART_AKISI`'nda ölçülen davranışın
 * aynısı (`kart-akisi.ts:22-27`). **Vercel'de anahtarı değiştirdikten sonra
 * REDEPLOY şart.**
 *
 * Bu bilinçli: iki tüketiciden biri (`DavetKutusu.astro`) yedi kayıt
 * sayfasında `prerender: true` altında yaşıyor — kutu statik HTML'e basılıyor.
 * Çalışma zamanı okuması onu çeviremez, yalnız yarı-açık bir durum üretirdi:
 * backend kapalı, yüzey açık. Tek zaman ekseni daha az yalan söyler.
 *
 * ── İki tüketici ──
 *  1. `api/davet.ts`       — kapalıyken erken dönüş, Resend ÇAĞRILMAZ
 *  2. `DavetKutusu.astro`  — kapalıyken kutu hiç render edilmez; bu tek gate
 *     her iki mount noktasını da kapatır (`KayitFormu.astro` success div'i +
 *     `odeme/tamam.astro`), üçüncü bir mount eklense onu da kapatır.
 *
 * Sıra önemli: 1 (backend) önce, sonra 2 (yüzey). Yüzeyi önce kaldırmak
 * backend dalını açıkta bırakır — kaldı ki bugünkü saldırgan yüzeyi zaten
 * kullanmıyor, doğrudan endpoint'e POST atıyor.
 */

/**
 * Ham env değerini karara çevirir — saf, test edilebilir.
 *
 * `kartAkisiAcikMi` ile aynı kural, bilerek ayrı fonksiyon: iki akışın
 * anahtarı birbirine bağlanmasın. Kart akışı bir gün açılırken davet akışının
 * da açılması gerekmiyor.
 */
export function davetAkisiAcikMi(ham: string | undefined | null): boolean {
  return (ham ?? '').trim().toLowerCase() === 'acik';
}

/** `src/` tarafının okuduğu tek değer. */
export const DAVET_AKISI_ACIK = davetAkisiAcikMi(import.meta.env.DAVET_AKISI);
