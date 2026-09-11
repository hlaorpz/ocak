/**
 * istemci-ip.ts — istemcinin public IP'si. `public-origin.ts`'nin kardeşi:
 * aynı ders, aynı yer (`src/lib`, sayfa frontmatter'ı değil — orası test
 * edilemez, CLAUDE.md §1).
 *
 * ── Neden gerekli ──
 * N-Kolay Ortak Ödeme Sayfası `cardHolderIP`'yi **zorunlu** alan sayar; boş
 * geçilemez. Değer bize Vercel proxy'sinin arkasından geliyor, yani soket
 * adresi bizim işimize yaramaz — `x-forwarded-for` okunur.
 *
 * ── Neden ilk değer ──
 * `x-forwarded-for` bir ZİNCİRDİR: `istemci, proxy1, proxy2`. İlk değer
 * istemciye en yakın olandır; sondakiler aradaki proxy'lerdir. Vercel zinciri
 * kendi ucundan doldurur.
 *
 * ⚠ Bu değer **güvenilmez**: header'ı istemci de yazabilir. Burada bir
 * güvenlik kararı için değil, sağlayıcının zorunlu alanını doldurmak için
 * kullanılıyor. Kimlik doğrulaması bu dosyanın işi DEĞİL — o `hashDataV2`de.
 */

/**
 * Yedek IP. Alan zorunlu olduğu için boş dize gönderilemez; sağlayıcı isteği
 * reddeder ve kadın ödeme yapamaz. Header hiç yokken (lokal dev, curl,
 * proxy'siz çağrı) loopback göndermek, ödemeyi hiç başlatmamaktan iyidir —
 * ve `0.0.0.0` gibi bir dolgu değil, gerçekten "yerel" anlamına gelir.
 */
export const YEDEK_IP = '127.0.0.1';

/**
 * `x-forwarded-for` zincirinin ilk değeri. Header yok/boşsa `YEDEK_IP`.
 *
 * `x-real-ip` ikinci sıradan denenir: bazı proxy kurulumlarında zincir yok
 * ama tek IP bu header'da durur. Üçüncü bir kaynak YOK — soket adresi
 * Astro'nun `clientAddress`'i Vercel'de proxy IP'sini verir, yani yanlış
 * cevabı kendinden emin biçimde döndürür.
 */
export function istemciIp(request: Request): string {
  const zincir = request.headers.get('x-forwarded-for') ?? '';
  const ilk = zincir.split(',')[0]?.trim() ?? '';
  if (ilk) return ilk;
  const tek = (request.headers.get('x-real-ip') ?? '').trim();
  if (tek) return tek;
  return YEDEK_IP;
}
