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

// Test literalleri — hepsi TR öğle saatiyle +03:00 offset. Öğle seçimi:
// gün sınırından uzak, hiçbir CI TZ'inde (UTC/PST/JST) kaymaz. TR günü sabit kalır.
const trOgle = (iso: string) => new Date(`${iso}T12:00:00+03:00`);

describe('etkinlik helpers — brief v2 çift-uçlu pencere + TR-yerel string-gün', () => {
  // Cutoff boş + başlangıç 14 Ekim → 13 Ekim görünür, 14 Ekim düşer (strict >).
  it('cutoff boş — başlangıç günü sabahı düşer (strict >)', () => {
    const liste: MockEtkinlik[] = [
      { tarihBaslangic: '2026-10-14', baslik: 'etkinlik' },
    ];
    // 13 Ekim: hâlâ görünür ("2026-10-14" > "2026-10-13" = true).
    expect(bugundenSonra(liste, trOgle('2026-10-13')).map((e) => e.baslik)).toEqual(['etkinlik']);
    // 14 Ekim: düşer ("2026-10-14" > "2026-10-14" = false).
    expect(bugundenSonra(liste, trOgle('2026-10-14'))).toEqual([]);
  });

  // kayitKapanis günü DAHİL (>=), ertesi gün düşer.
  it('kayitKapanis dolu — kapanış günü tam açık, ertesi gün düşer (>=)', () => {
    const liste: MockEtkinlik[] = [
      { tarihBaslangic: '2026-10-14', kayitKapanis: '2026-10-12', baslik: 'etkinlik' },
    ];
    // 11 Ekim: pencere içi ("2026-10-12" >= "2026-10-11" = true).
    expect(bugundenSonra(liste, trOgle('2026-10-11')).map((e) => e.baslik)).toEqual(['etkinlik']);
    // 12 Ekim (kapanış günü): DAHİL, tam gün açık.
    expect(bugundenSonra(liste, trOgle('2026-10-12')).map((e) => e.baslik)).toEqual(['etkinlik']);
    // 13 Ekim: düşer ("2026-10-12" >= "2026-10-13" = false).
    expect(bugundenSonra(liste, trOgle('2026-10-13'))).toEqual([]);
  });

  // Uzun range başlayınca düşer — tarihBitis referans DEĞİL.
  it('uzun range — başlangıç gününde düşer (tarihBitis referans değil)', () => {
    const liste: MockEtkinlik[] = [
      { tarihBaslangic: '2026-10-14', tarihBitis: '2026-11-06', baslik: 'yolculuk' },
    ];
    expect(bugundenSonra(liste, trOgle('2026-10-13')).map((e) => e.baslik)).toEqual(['yolculuk']);
    expect(bugundenSonra(liste, trOgle('2026-10-14'))).toEqual([]);
    expect(bugundenSonra(liste, trOgle('2026-10-20'))).toEqual([]);
  });

  // kayitAcilis 10 Ekim → 9 Ekim görünmez, 10 Ekim görünür.
  it('kayitAcilis dolu — açılış günü dahil (>=), önceki gün görünmez', () => {
    const liste: MockEtkinlik[] = [
      { tarihBaslangic: '2026-10-14', kayitAcilis: '2026-10-10', baslik: 'etkinlik' },
    ];
    expect(bugundenSonra(liste, trOgle('2026-10-09'))).toEqual([]);
    expect(bugundenSonra(liste, trOgle('2026-10-10')).map((e) => e.baslik)).toEqual(['etkinlik']);
    expect(bugundenSonra(liste, trOgle('2026-10-13')).map((e) => e.baslik)).toEqual(['etkinlik']);
  });

  // Çift-uç: açılış 10 + kapanış 12 → pencere 10-12 Ekim DAHİL.
  it('çift-uç — açılış 10 + kapanış 12, pencere 10-12 dahil, 13 düşer', () => {
    const liste: MockEtkinlik[] = [
      { tarihBaslangic: '2026-10-14', kayitAcilis: '2026-10-10', kayitKapanis: '2026-10-12', baslik: 'etkinlik' },
    ];
    expect(bugundenSonra(liste, trOgle('2026-10-09'))).toEqual([]);
    expect(bugundenSonra(liste, trOgle('2026-10-10')).length).toBe(1);
    expect(bugundenSonra(liste, trOgle('2026-10-11')).length).toBe(1);
    expect(bugundenSonra(liste, trOgle('2026-10-12')).length).toBe(1);
    expect(bugundenSonra(liste, trOgle('2026-10-13'))).toEqual([]);
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // KRİTİK — UTC/TR sınır (Vercel bug'ının birebir senaryosu)
  // ═══════════════════════════════════════════════════════════════════════════
  // Vercel server UTC 15 Tem 21:29 = TR 16 Tem 00:29. Naïve `new Date()` +
  // `setHours(0,0,0,0)` server-yerel (UTC) çalışıyordu → sinir = 15 Tem 00:00Z,
  // kayitKapanis 15 Tem >= 15 Tem = true → düşmeliyken KALIYORDU. TR-yerel
  // string-gün karşılaştırması bunu düzeltir: bugunTR = "2026-07-16", kayitKapanis
  // = "2026-07-15" → "2026-07-15" >= "2026-07-16" = false → DÜŞER.
  it('UTC/TR sınır — Vercel UTC hâlâ 15 Tem, TR 16 Tem → kapanış 15 Tem DÜŞMELİ', () => {
    const liste: MockEtkinlik[] = [
      { tarihBaslangic: '2026-07-26', kayitKapanis: '2026-07-15', baslik: 'seremoni' },
    ];
    // TR 16 Tem 00:29 = UTC 15 Tem 21:29 (Kaan bug'ının deployment timestamp'i).
    const bugun = new Date('2026-07-15T21:29:00Z');
    expect(bugundenSonra(liste, bugun)).toEqual([]);
  });

  it('UTC/TR sınır — aynı bugun, kapanış 16 Tem → KALIR', () => {
    const liste: MockEtkinlik[] = [
      { tarihBaslangic: '2026-07-26', kayitKapanis: '2026-07-16', baslik: 'seremoni' },
    ];
    const bugun = new Date('2026-07-15T21:29:00Z');
    // bugunTR = "2026-07-16", kayitKapanis = "2026-07-16" → dahil, kalır.
    expect(bugundenSonra(liste, bugun).map((e) => e.baslik)).toEqual(['seremoni']);
  });

  it('UTC/TR sınır — TR 23:59 hâlâ aynı gün (UTC ertesi gün 20:59)', () => {
    const liste: MockEtkinlik[] = [
      { tarihBaslangic: '2026-07-16', kayitKapanis: '2026-07-15', baslik: 'seremoni' },
    ];
    // TR 15 Tem 23:59 = UTC 15 Tem 20:59. Naïve kod TR gün "16 Tem" sayardı,
    // TR-yerel doğru "15 Tem" der → kayitKapanis 15 >= 15 = true → kalır.
    const bugun = new Date('2026-07-15T20:59:00Z');
    expect(bugundenSonra(liste, bugun).map((e) => e.baslik)).toEqual(['seremoni']);
  });

  // pencereIcinde defansif — bozuk tarih formatı gösterilmeli (eleme yok).
  it('pencereIcinde — format-fail defansif göster (bozuk tarih)', () => {
    // Bozuk üst uç (kayitKapanis) → defansif, eleme yok; sonuç true.
    expect(
      pencereIcinde(
        { tarihBaslangic: '2026-12-01', kayitKapanis: 'bozuk' },
        trOgle('2026-10-14'),
      ),
    ).toBe(true);
    // Bozuk tarihBaslangic (kayitKapanis boş, fallback bozuk) → defansif göster.
    expect(pencereIcinde({ tarihBaslangic: 'bozuk-tarih' }, trOgle('2026-10-14'))).toBe(true);
    // Bozuk alt uç (kayitAcilis) → defansif, alt uçtan eleme yok.
    expect(
      pencereIcinde(
        { tarihBaslangic: '2026-12-01', kayitAcilis: 'bozuk' },
        trOgle('2026-10-14'),
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
