/**
 * origin-kural.ts — origin/host karşılaştırma kuralının TEK nüshası.
 *
 * ── Neden ayrı dosya ──
 * Kural 8 Eyl 2026'da `davet-kapi.ts`'de doğdu, çünkü ilk tüketicisi
 * `/api/davet`'in sessiz-ret kapısıydı. 11 Eyl'de ikinci tüketici geldi:
 * `origin-muhafiz.ts` (Astro `checkOrigin`'inin kendi kodumuzdaki karşılığı,
 * `ef09c47`). O tur kuralı ikinci kez YAZMAMAK için `davet-kapi.ts`'ye import
 * attı ve bağımlılık yönünü tersine çevirdi: genel modül özel modüle bakıyordu.
 * Bu dosya o borcu kapatır — kural artık iki tüketicinin de üstünde, hiçbirine
 * ait değil.
 *
 * Alternatif (kuralı iki yerde tutmak) bir güvenlik kuralının iki kopyasını
 * elle eşit tutma borcu demekti; o borç sessizce ödenmez, sessizce bozulur.
 *
 * ── Taşıma ──
 * `originSebebi`'nin gövdesi ve dokümantasyonu `davet-kapi.ts:96-127`'den
 * **BİREBİR** taşındı (CLAUDE.md §5 — kırpma değil taşıma). Değişen tek şey
 * dönüş tipinin ADI: `SessizRetSebebi` davet'in dokuz değerli sessiz-ret
 * birliğiydi ve genel bir kuralın o birliğe bakması bağımlılığı ters yönde
 * diri tutardı. Tip burada iki değere daraltıldı; `SessizRetSebebi` o ikisini
 * kapsadığı için davet tarafı tip olarak aynen çalışır.
 *
 * Kuralın DAVRANIŞI değişmedi — `davet-kapi.test.ts:91-140` (yedi iddia) ve
 * `origin-muhafiz.test.ts` (28 test) taşımadan sonra aynen geçer.
 */

/**
 * Origin karşılaştırmasının iki ret sebebi. Çağıranlar bunu kendi cevap
 * biçimlerine çevirir: `/api/davet` sessiz 200'e (`SessizRetSebebi`'nin alt
 * kümesi), `origin-muhafiz.ts` 403'e. Sebep hiçbir yüzeyde gövdeye yazılmaz.
 */
export type OriginRetSebebi = 'origin-yok' | 'origin-uyusmuyor';

/**
 * Origin kapısı. Geçerliyse `null`, değilse ret sebebi.
 *
 * ── Neden host karşılaştırması, neden tam origin değil ──
 * `beklenenOrigin` `publicOrigin()`ten gelir; o helper `x-forwarded-proto`
 * yokken şemayı `https`e sabitler (`public-origin.ts:21`). Lokal dev'de
 * tarayıcı `Origin: http://localhost:4321` yollar, `publicOrigin` ise
 * `https://localhost:4321` üretir — tam dize karşılaştırması dev'i kırardı ve
 * kapı "her yerde reddediyor" diye yanlış yeşil verirdi. Şema düşürme bu
 * yüzeyde anlamlı bir vektör değil (site Vercel'de https-only), host yeter.
 *
 * `Origin` header'ı GET/HEAD dışındaki her istekte tarayıcı tarafından
 * yollanır — same-origin POST dahil. Yani header'ın YOKLUĞU "tarayıcıdan
 * gelmedi" demektir; opaque `null` origin de (sandbox iframe, yönlendirme
 * zinciri) burada reddedilir.
 */
export function originSebebi(
  gelenOrigin: string | null | undefined,
  beklenenOrigin: string,
): OriginRetSebebi | null {
  if (!gelenOrigin) return 'origin-yok';
  let gelenHost: string;
  let beklenenHost: string;
  try {
    gelenHost = new URL(gelenOrigin).host;
    beklenenHost = new URL(beklenenOrigin).host;
  } catch {
    return 'origin-uyusmuyor';
  }
  if (!gelenHost || !beklenenHost) return 'origin-uyusmuyor';
  return gelenHost === beklenenHost ? null : 'origin-uyusmuyor';
}
