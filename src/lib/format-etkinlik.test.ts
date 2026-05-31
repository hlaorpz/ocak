import { describe, it, expect } from 'vitest';
import {
  bugundenSonra,
  groupByMonth,
  formatAyEtiketi,
} from './format-etkinlik';

interface MockEtkinlik {
  tarihBaslangic: string;
  tarihBitis?: string;
  baslik?: string;
}

describe('etkinlik helpers (Brief H)', () => {
  it('bugundenSonra — tek günlük etkinlikleri bugünden sonrasına filtreler', () => {
    const bugun = new Date(2026, 5, 15); // 15 Haziran 2026 — JS month 0-indexed
    const liste: MockEtkinlik[] = [
      { tarihBaslangic: '2026-06-01', baslik: 'geçmiş' },
      { tarihBaslangic: '2026-06-15', baslik: 'bugün' },
      { tarihBaslangic: '2026-07-01', baslik: 'gelecek' },
    ];
    const sonuc = bugundenSonra(liste, bugun);
    expect(sonuc.map((e) => e.baslik)).toEqual(['bugün', 'gelecek']);
  });

  it('bugundenSonra — range etkinlikte tarihBitis öncelikli (devam edenler kalır)', () => {
    const bugun = new Date(2026, 8, 25); // 25 Eylül 2026
    const liste: MockEtkinlik[] = [
      // Devam eden (15 Eylül - 6 Ekim): bugün ortasında → kalır
      { tarihBaslangic: '2026-09-15', tarihBitis: '2026-10-06', baslik: 'devam' },
      // Bitmiş (1-10 Eylül): bitiş bugünden eski → gizlenir
      { tarihBaslangic: '2026-09-01', tarihBitis: '2026-09-10', baslik: 'bitti' },
      // Gelecek (Ekim): başlangıç bugünden sonra → kalır
      { tarihBaslangic: '2026-10-15', baslik: 'gelecek' },
    ];
    expect(bugundenSonra(liste, bugun).map((e) => e.baslik)).toEqual(['devam', 'gelecek']);
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
