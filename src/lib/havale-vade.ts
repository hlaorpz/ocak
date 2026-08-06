// Havale vade metni — kayıt success e-postasında ödeme süresi cümlesi.
//
// `src/pages/api/kayit.ts` içindeydi; test edilebilir olması için lib'e alındı.
// Gerekçe: `src/pages/` altındaki HER dosya Astro için bir ROUTE'tur — oraya
// konan `*.test.ts` prerender sırasında route gibi çalıştırılmaya kalkar ve
// build'i düşürür. Saf mantık lib'de yaşar, test lib'de koşar (repo deseni).
import { bugunTR } from './format-etkinlik.ts';

const UZUN = 'Katılım payını en geç 3 gün içinde aşağıdaki hesaba iletebilirsin.';
const KISA = 'Katılım payını ilettiğinde biz kontrol edip sana döneceğiz.';

/**
 * Tasarım turu 3 (ADIM 1) — havale success metninde ödeme süresi dinamik:
 *  - Etkinlik tarihine 3+ gün varsa: UZUN metin
 *  - 3 günden yakınsa: KISA metin
 * tarihISO YYYY-MM-DD veya ISO timestamp. Parse edilemezse defansif olarak
 * 3+ gün dalına düşer (rahat metin).
 *
 * TZ (KARAR 385, B23): "bugün" TR gününden alınır. Eski `setHours(0,0,0,0)`
 * server-yerel (Vercel UTC) çalıştığı için TR 00:00-03:00 penceresinde sınırı
 * bir gün geriye kaydırıyor, vade metnini yanlış dala düşürebiliyordu — bu
 * metin müşteriye giden ödeme talimatı. Gün farkı Date.UTC ile hesaplanır:
 * iki uç da UTC gün başlangıcı, DST kayması giremez.
 */
export function havaleVadeMetni(
  tarihISO: string | undefined | null,
  bugun: Date = new Date(),
): string {
  const m = tarihISO?.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return UZUN;
  const [by, bm, bd] = bugunTR(bugun).split('-').map(Number);
  const sinirUTC = Date.UTC(by, bm - 1, bd);
  const etkUTC = Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  const gunFarki = Math.round((etkUTC - sinirUTC) / 86_400_000);
  return gunFarki >= 3 ? UZUN : KISA;
}
