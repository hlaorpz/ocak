import { describe, it, expect } from 'vitest';
import {
  bugundenSonra,
  pencereIcinde,
  groupByMonth,
  formatAyEtiketi,
} from './format-etkinlik';

interface MockEtkinlik {
  tarihBaslangic: string;
  tarihBitis?: string;
  kayitAcilis?: string;
  kayitKapanis?: string;
  baslik?: string;
}

describe('etkinlik helpers — brief v2 çift-uçlu pencere', () => {
  // Brief v2 senaryosu 1: açılış boş + kapanış boş + başlangıç 14 Ekim.
  // 13 Ekim'e kadar görünür, 14 Ekim 00:00 build'inde düşer (strict > başlangıç).
  it('cutoff boş — başlangıç günü sabahı düşer (strict >)', () => {
    const liste: MockEtkinlik[] = [
      { tarihBaslangic: '2026-10-14', baslik: 'etkinlik' },
    ];
    // 13 Ekim: hâlâ görünür (14 > 13 = true).
    expect(bugundenSonra(liste, new Date(2026, 9, 13)).map((e) => e.baslik)).toEqual(['etkinlik']);
    // 14 Ekim (etkinlik günü): düşer (14 > 14 = false).
    expect(bugundenSonra(liste, new Date(2026, 9, 14))).toEqual([]);
  });

  // Brief v2 + asimetri düzeltmesi: kayitKapanis günü DAHİL (>=), ertesi gün düşer.
  // Kaan niyeti: son dakika kayıt için kapanışa yazdığı gün tam açık kalsın.
  it('kayitKapanis dolu — kapanış günü tam açık, ertesi gün düşer (>=)', () => {
    const liste: MockEtkinlik[] = [
      { tarihBaslangic: '2026-10-14', kayitKapanis: '2026-10-12', baslik: 'etkinlik' },
    ];
    // 11 Ekim: pencere içi (12 >= 11 = true).
    expect(bugundenSonra(liste, new Date(2026, 9, 11)).map((e) => e.baslik)).toEqual(['etkinlik']);
    // 12 Ekim (kapanış günü): DAHİL (12 >= 12 = true), tam gün açık.
    expect(bugundenSonra(liste, new Date(2026, 9, 12)).map((e) => e.baslik)).toEqual(['etkinlik']);
    // 13 Ekim: düşer (12 >= 13 = false).
    expect(bugundenSonra(liste, new Date(2026, 9, 13))).toEqual([]);
  });

  // Brief v2 senaryosu 3: uzun range (Yolculuk) başlayınca düşer.
  // tarihBitis ARTIK cutoff referansı DEĞİL — sadece tarihBaslangic.
  it('uzun range — başlangıç gününde düşer (tarihBitis referans değil)', () => {
    const liste: MockEtkinlik[] = [
      { tarihBaslangic: '2026-10-14', tarihBitis: '2026-11-06', baslik: 'yolculuk' },
    ];
    // 13 Ekim: görünür (14 > 13 = true).
    expect(bugundenSonra(liste, new Date(2026, 9, 13)).map((e) => e.baslik)).toEqual(['yolculuk']);
    // 14 Ekim (başlangıç): düşer (14 > 14 = false), tarihBitis 6 Kasım'a bakmaz.
    expect(bugundenSonra(liste, new Date(2026, 9, 14))).toEqual([]);
    // 20 Ekim (range ortası): hâlâ düşük.
    expect(bugundenSonra(liste, new Date(2026, 9, 20))).toEqual([]);
  });

  // Brief v2 açılış senaryosu: kayitAcilis 10 Ekim → 9 Ekim görünmez, 10 Ekim görünür.
  it('kayitAcilis dolu — açılış günü dahil (>=), önceki gün görünmez', () => {
    const liste: MockEtkinlik[] = [
      { tarihBaslangic: '2026-10-14', kayitAcilis: '2026-10-10', baslik: 'etkinlik' },
    ];
    // 9 Ekim: 9 >= 10 = false → görünmez.
    expect(bugundenSonra(liste, new Date(2026, 9, 9))).toEqual([]);
    // 10 Ekim (açılış günü): 10 >= 10 = true → görünür.
    expect(bugundenSonra(liste, new Date(2026, 9, 10)).map((e) => e.baslik)).toEqual(['etkinlik']);
    // 13 Ekim (arifel): görünür (üst uç 14 > 13 = true).
    expect(bugundenSonra(liste, new Date(2026, 9, 13)).map((e) => e.baslik)).toEqual(['etkinlik']);
  });

  // Brief v2 + asimetri: açılış 10 + kapanış 12 → pencere 10-12 Ekim DAHİL.
  it('çift-uç — açılış 10 + kapanış 12, pencere 10-12 dahil, 13 düşer', () => {
    const liste: MockEtkinlik[] = [
      { tarihBaslangic: '2026-10-14', kayitAcilis: '2026-10-10', kayitKapanis: '2026-10-12', baslik: 'etkinlik' },
    ];
    expect(bugundenSonra(liste, new Date(2026, 9, 9))).toEqual([]);           // alt uçtan önce
    expect(bugundenSonra(liste, new Date(2026, 9, 10)).length).toBe(1);       // alt uç dahil (>=)
    expect(bugundenSonra(liste, new Date(2026, 9, 11)).length).toBe(1);       // pencere içi
    expect(bugundenSonra(liste, new Date(2026, 9, 12)).length).toBe(1);       // üst uç dahil (12 >= 12)
    expect(bugundenSonra(liste, new Date(2026, 9, 13))).toEqual([]);          // pencere sonrası (12 >= 13 false)
  });

  // pencereIcinde helper doğrudan test (public API).
  it('pencereIcinde — parse-fail defansif göster (bozuk tarih)', () => {
    // Bozuk üst uç → defansif, üst uçtan eleme yapma; sonuç true.
    expect(pencereIcinde({ tarihBaslangic: 'bozuk-tarih' }, new Date(2026, 9, 14))).toBe(true);
    // Bozuk alt uç + geçerli üst uç ileride → true.
    expect(
      pencereIcinde(
        { tarihBaslangic: '2026-12-01', kayitAcilis: 'bozuk' },
        new Date(2026, 9, 14),
      ),
    ).toBe(true);
  });

  it('groupByMonth — ay-ay grup, insertion order korunur', () => {
    const liste: MockEtkinlik[] = [
      { tarihBaslangic: '2026-06-21', baslik: 'a' },
      { tarihBaslangic: '2026-06-30', baslik: 'b' },
      { tarihBaslangic: '2026-07-05', baslik: 'c' },
      { tarihBaslangic: '2026-09-15', baslik: 'd' },
    ];
    const gruplar = groupByMonth(liste);
    expect([...gruplar.keys()]).toEqual(['2026-06', '2026-07', '2026-09']);
    expect(gruplar.get('2026-06')?.map((e) => e.baslik)).toEqual(['a', 'b']);
    expect(gruplar.get('2026-07')?.map((e) => e.baslik)).toEqual(['c']);
    expect(gruplar.get('2026-09')?.map((e) => e.baslik)).toEqual(['d']);
  });

  it('formatAyEtiketi — TR ay ismi + yıl, geçersiz key olduğu gibi döner', () => {
    expect(formatAyEtiketi('2026-06')).toBe('Haziran 2026');
    expect(formatAyEtiketi('2026-12')).toBe('Aralık 2026');
    expect(formatAyEtiketi('2027-01')).toBe('Ocak 2027');
    expect(formatAyEtiketi('bilinmeyen')).toBe('bilinmeyen');
    expect(formatAyEtiketi('2026-13')).toBe('2026-13'); // out-of-range
  });
});
