import { describe, it, expect } from 'vitest';
import { havaleVadeMetni } from './havale-vade.ts';

/**
 * B23 / KARAR 385 — havale vade metni TZ sınırı.
 *
 * Bug: eski `new Date(bugun)` + `setHours(0,0,0,0)` server-yerel çalışıyordu.
 * Vercel UTC koştuğu için TR gecesi 00:00-03:00 penceresinde "bugün" bir gün
 * geride kalıyor, eşik günlerinde vade metni yanlış dala düşüyordu. Bu metin
 * müşteriye giden ödeme talimatı — sessiz kayma kabul edilemez.
 *
 * Sınır: 23:30 TR = 20:30 UTC (aynı gün) ve 00:30 TR = 21:30 UTC (önceki gün).
 * İkincisinde naïve UTC hesabı bir gün geriye düşer; TR sabitlemesi düşmez.
 */

const UZUN = 'Katılım payını en geç 3 gün içinde aşağıdaki hesaba iletebilirsin.';
const KISA = 'Katılım payını ilettiğinde biz kontrol edip sana döneceğiz.';

describe('havaleVadeMetni — TR gün sabitlemesi (B23)', () => {
  it('23:30 TR (20:30Z) · etkinlik +3 gün → 3+ dalı', () => {
    // 2026-07-15T20:30Z = 15 Temmuz 23:30 TR. Etkinlik 18 Temmuz → tam 3 gün.
    const bugun = new Date('2026-07-15T20:30:00Z');
    expect(havaleVadeMetni('2026-07-18', bugun)).toBe(UZUN);
  });

  it('00:30 TR (21:30Z, ÖNCEKİ UTC günü) · etkinlik +3 gün → 3+ dalı', () => {
    // 2026-07-15T21:30Z = 16 Temmuz 00:30 TR. TR günü 16, UTC günü 15.
    // Naïve UTC hesabı "bugün 15" der → fark 3 çıkar (yanlışlıkla UZUN).
    // TR sabitlemesiyle "bugün 16" → 19 Temmuz tam 3 gün → UZUN.
    const bugun = new Date('2026-07-15T21:30:00Z');
    expect(havaleVadeMetni('2026-07-19', bugun)).toBe(UZUN);
  });

  it('00:30 TR (21:30Z) · etkinlik +2 gün → kısa dal (naïve UTC UZUN derdi)', () => {
    // TR günü 16 Temmuz. Etkinlik 18 Temmuz → 2 gün → KISA.
    // Naïve UTC "bugün 15" deseydi fark 3 olur, yanlışlıkla UZUN dönerdi.
    // Bu test bug'ı doğrudan kilitler.
    const bugun = new Date('2026-07-15T21:30:00Z');
    expect(havaleVadeMetni('2026-07-18', bugun)).toBe(KISA);
  });

  it('DST dışı kış tarihi · 00:30 TR (21:30Z) aynı davranış', () => {
    // TR yıl boyu UTC+3 (DST yok) — kış tarihinde de sınır aynı yerde.
    const bugun = new Date('2026-01-15T21:30:00Z'); // 16 Ocak 00:30 TR
    expect(havaleVadeMetni('2026-01-18', bugun)).toBe(KISA);
    expect(havaleVadeMetni('2026-01-19', bugun)).toBe(UZUN);
  });

  it('parse edilemeyen tarih → defansif UZUN dal', () => {
    const bugun = new Date('2026-07-15T21:30:00Z');
    expect(havaleVadeMetni(null, bugun)).toBe(UZUN);
    expect(havaleVadeMetni('bozuk-tarih', bugun)).toBe(UZUN);
  });
});
