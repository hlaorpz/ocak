/**
 * gecis.ts — kart geçiş ekranının en az görünme süresi (İŞ 17, 8 Eki).
 *
 * ── Neden lib'de ──
 * Karar iki satır aritmetik ama iki ayrı senaryoyu doğru ayırması gerekiyor
 * ("hızlı yanıtta erken yönlendirme yok", "yavaş yanıtta ek gecikme yok") ve
 * `KayitFormu.astro`'nun inline script'i test edilemiyor (`src/pages/` ve
 * `.astro` kuralı — `gecersiz-alan-goster.ts` ile aynı gerekçe). Hesap burada,
 * bileşen uyguluyor.
 */

/**
 * Geçiş ekranının en az görünme süresi (ms).
 *
 * Hızlı yanıtta (yerel, iyi ağ) geçiş bir kare görünüp kayboluyordu: kadın köz
 * noktasını fark etmeden N-Kolay ekranında buluyordu kendini ve ekran değişimi
 * ani bir kesinti gibi okunuyordu.
 */
export const GECIS_EN_AZ_MS = 1500;

/**
 * Yönlendirmeden önce beklenecek süre (ms).
 *
 * ⚠ Bu bir TABAN, gecikme DEĞİL. Yönlendirme `max(API, enAz)` anında olur:
 * API zaten eşikten uzun sürdüyse dönüş `0`dır ve yönlendirme ANINDA yapılır.
 * Yavaş ağ cezalandırılmıyor — eşik yalnız hızlı yanıtta devreye giriyor.
 *
 * `gecen` ölçülemediyse (geçiş hiç başlamadı, örn. havale yolu) çağıran bu
 * fonksiyonu zaten çağırmıyor; yine de negatif/NaN girdi `0` döner — bekleme
 * uydurmaktansa anında gitmek doğru.
 */
export function gecisKalanMs(gecen: number, enAz: number = GECIS_EN_AZ_MS): number {
  if (!Number.isFinite(gecen) || gecen < 0) return 0;
  return Math.max(0, enAz - gecen);
}
