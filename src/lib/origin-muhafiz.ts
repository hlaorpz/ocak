/**
 * origin-muhafiz.ts — cross-site POST muhafızı, KENDİ kodumuzda.
 *
 * ── Neden taşındı ──
 * Astro'nun `security.checkOrigin` muhafızı (varsayılan `true`) prerender
 * olmayan her route'a bir internal middleware takar
 * (`astro/dist/core/base-pipeline.js:50-52`). Kuralı
 * (`astro/dist/core/app/middlewares.js:8-34`) iki kusur taşıyor:
 *
 *  1. **Kapsamı bizim ihtiyacımızın tersi.** Yalnız `content-type`'ı
 *     form-benzeri (`x-www-form-urlencoded` · `multipart/form-data` ·
 *     `text/plain`) olan ya da HİÇ `content-type` taşımayan isteği ölçer.
 *     Bizim dört form endpoint'i `application/json` POST alıyor — yani
 *     Astro'nun muhafızı onlara **hiç bakmıyordu.** Koruma sandığımız şey
 *     tam da korunmasını istediğimiz yerde yoktu.
 *  2. **Kapatması global.** N-Kolay Ortak Ödeme Sayfası sonucu
 *     `/api/odeme-callback`'e DIŞ origin'den `x-www-form-urlencoded` POST
 *     edecek; Astro'nun muhafızı onu handler'a girmeden 403'e düşürür. Tek
 *     çare `checkOrigin: false` ve o bayrak route başına ayarlanamaz.
 *
 * Yani muhafız hem yanlış yerde duruyordu hem de gerekli istisna için
 * kapatılması şart. `checkOrigin: false` + bu dosya = kapsam bizim
 * seçimimiz: JSON POST'lar da ölçülür, callback muaf tutulur.
 *
 * ── Muafiyet ──
 * `/api/odeme-callback` bu muhafıza GİRMEZ — dış origin'den POST alması
 * işin ta kendisi. Oradaki kimlik doğrulaması origin değil `hashDataV2`
 * (sağlayıcı sırrıyla imzalı) ve `dogrulaCallback` arayüzünde yaşıyor
 * (KARAR 395). Origin header'ı zaten sağlayıcıya yazdıramayacağımız bir
 * şey; imza yazdırabildiğimiz tek şey.
 *
 * `/api/davet` de girmez — **zaten kendi origin kapısı var**
 * (aynı kural: `origin-kural.ts:originSebebi`) ve orası bilinçli
 * olarak 403 değil **sessiz 200** döner (bot başarılı sandığını sansın,
 * varyasyon denemesin). Üstüne 403 koymak o kararı sessizce geri alırdı.
 *
 * ── Karşılaştırma kuralı ikinci kez YAZILMADI ──
 * Host karşılaştırması `origin-kural.ts:originSebebi`'ye devredilir. O
 * fonksiyon tam origin değil **host** karşılaştırır ve gerekçesi ölçülmüş:
 * `publicOrigin()` şemayı `https`e sabitliyor (`public-origin.ts:21`),
 * lokal dev'de tarayıcı `http://localhost:4321` yollar — tam dize
 * karşılaştırması dev'i kırar ve kapı "her yerde reddediyor" diye yanlış
 * yeşil verir. Bir güvenlik kuralının iki kopyası, ikisini elle eşit tutma
 * borcudur; tek kopya kalsın.
 *
 * Kural ilk yazımda `davet-kapi.ts`'de yaşıyordu ve bu dosya oraya import
 * atıyordu — genel modül özel modüle bakıyor demekti. `origin-kural.ts`
 * o borcu kapattı; kural artık iki tüketicinin de üstünde.
 */
import { originSebebi } from './origin-kural.ts';
import { publicOrigin } from './public-origin.ts';

/**
 * Ret sebebi — YALNIZ log'a. 403 gövdesine asla girmez.
 * Tanım `origin-kural.ts`'de; buradan da görünsün diye re-export ediliyor.
 */
export type { OriginRetSebebi } from './origin-kural.ts';
import type { OriginRetSebebi } from './origin-kural.ts';

/**
 * İsteğin beyan ettiği origin. `Origin` OTORİTERDİR; yalnız o header hiç
 * yokken `Referer`'a düşülür.
 *
 * Sıra tersine çevrilemez: `Origin` yabancıyken `Referer`'ın kendi
 * sitemizi göstermesi muhafızı kurtarmamalı. İki header'ı "biri tutarsa
 * geçer" diye OR'lamak, saldırgana iki denemeden ucuz olanı seçme hakkı
 * vermek olurdu.
 *
 * `Referer` tam URL'dir (yol + query taşır); origin'e indirilir. Ayrıştırma
 * başarısızsa `null` DEĞİL, ham değer döner — karşılaştırmayı
 * `originSebebi` yapar ve bozuk dizeyi `origin-uyusmuyor`a düşürür.
 * `null` döndürmek bozuk Referer'ı "header hiç yok"a çevirirdi; iki ayrı
 * hâl, iki ayrı log satırı.
 */
export function istekOrigini(request: Request): string | null {
  const origin = request.headers.get('origin');
  if (origin) return origin;
  const referer = request.headers.get('referer');
  if (!referer) return null;
  try {
    return new URL(referer).origin;
  } catch {
    return referer;
  }
}

/**
 * Muhafızın KARARI, saf hâli — geçerliyse `null`, değilse sebep.
 * `Response` üretmez, böylece testte ve çağırma yerinde ayrı ayrı ölçülür.
 */
export function originMuhafizSebebi(request: Request): OriginRetSebebi | null {
  const sebep = originSebebi(istekOrigini(request), publicOrigin(request));
  if (!sebep) return null;
  // Daraltma açık yazılıyor ve bilinmeyen bir değer `origin-uyusmuyor`a
  // düşüyor — fail-closed: tanımadığımız bir sebep isteği GEÇİRMEZ, reddeder.
  // (Kural `davet-kapi.ts`'deyken dönüş tipi dokuz değerli sessiz-ret
  // birliğiydi; `origin-kural.ts` taşımasından sonra iki değer. Daraltma
  // gereksizleşmedi: kural genişlerse bu satır yine kapıyı kapalı tutar.)
  return sebep === 'origin-yok' ? 'origin-yok' : 'origin-uyusmuyor';
}

/**
 * Çağırma yeri için hazır cevap: geçerliyse `null` (route devam eder),
 * değilse **403**.
 *
 * Gövde sebep SIZDIRMAZ — `/api/odeme-callback`'in 401 disiplininin aynısı
 * (`odeme-callback.ts:170-173`): çağırana "origin mi yanlış, hiç mi yok"
 * demek, deneyen birine hangi yönde ilerleyeceğini söylemek olur. Sebep
 * yalnız sunucu log'una düşer.
 *
 * Neden davet gibi sessiz 200 değil: bu üç endpoint'in cevabı kullanıcı
 * arayüzünü sürüyor (kayıt/form sonucu). Sahte bir 200 başarı gövdesi
 * uydurmak, gerçek bir kadın bir tarayıcı eklentisi yüzünden reddedildiğinde
 * "kaydoldum" sanıp gelmemesi demektir. 403 teşhis edilebilir; sessiz
 * başarı edilemez.
 */
export function originMuhafizi(request: Request): Response | null {
  const sebep = originMuhafizSebebi(request);
  if (!sebep) return null;
  console.warn(
    `[origin-muhafiz] cross-site POST reddedildi (403) — sebep=${sebep} yol=${new URL(request.url).pathname}`,
  );
  return new Response('Cross-site POST reddedildi.', { status: 403 });
}
