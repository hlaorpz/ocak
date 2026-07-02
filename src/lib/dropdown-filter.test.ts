/**
 * dropdown-filter — Brief F.6: /cember + /acik-kapi tarih dropdown helper'ı.
 * filterDropdownEtkinlikleri: tip eşleşen + durum∈{Kayıt Açık, Dolu} entry'leri
 * tarihBaslangic'e göre artan sıralı döner. Pure logic — Astro context'inden bağımsız.
 *
 * Vitest config `src` altındaki `.test.ts` taraması — brief'teki `tests/` dizini convention'a
 * uymadığı için co-located. Mock entry shape collection entry minimumu (id + data.{tip,durum,tarihBaslangic}).
 */
import { describe, it, expect } from 'vitest';
import { filterDropdownEtkinlikleri } from './format-etkinlik';

type MockEntry = {
  id: string;
  data: { tip: string; durum: string; tarihBaslangic: string };
};

const mk = (id: string, tip: string, durum: string, tarih: string): MockEntry => ({
  id,
  data: { tip, durum, tarihBaslangic: tarih },
});

// Tasarım turu 3 ADIM 5 sonrası filterDropdownEtkinlikleri tarih-bağımlı;
// testler tip/durum/sort iddialarını değişmez `bugun` ile deterministik tutar.
const BUGUN = new Date('2026-01-01');

describe('filterDropdownEtkinlikleri — tip filter', () => {
  it('Çember: sadece tip="Çember" entry\'leri döner, diğer tipler elenir', () => {
    const input: MockEntry[] = [
      mk('a', 'Çember', 'Kayıt Açık', '2026-06-21'),
      mk('b', 'Açık Kapı', 'Kayıt Açık', '2026-06-19'),
      mk('c', 'Atölye', 'Kayıt Açık', '2026-09-15'),
      mk('d', 'Çember', 'Dolu', '2026-07-15'),
    ];
    const result = filterDropdownEtkinlikleri(input, 'Çember', BUGUN);
    expect(result.map((e) => e.id)).toEqual(['a', 'd']);
  });

  it('Açık Kapı: sadece tip="Açık Kapı" entry\'leri döner, Çember/Atölye elenir', () => {
    const input: MockEntry[] = [
      mk('a', 'Çember', 'Kayıt Açık', '2026-06-21'),
      mk('b', 'Açık Kapı', 'Kayıt Açık', '2026-06-19'),
      mk('c', 'Atölye', 'Kayıt Açık', '2026-09-15'),
      mk('d', 'Açık Kapı', 'Dolu', '2026-07-03'),
    ];
    const result = filterDropdownEtkinlikleri(input, 'Açık Kapı', BUGUN);
    expect(result.map((e) => e.id)).toEqual(['b', 'd']);
  });
});

describe('filterDropdownEtkinlikleri — durum filter', () => {
  it('Kayıt Açık + Dolu geçer, Taslak/Geçti/İptal elenir (loader değişimine karşı defansif)', () => {
    const input: MockEntry[] = [
      mk('acik', 'Çember', 'Kayıt Açık', '2026-06-21'),
      mk('dolu', 'Çember', 'Dolu', '2026-07-15'),
      mk('taslak', 'Çember', 'Taslak', '2026-08-01'),
      mk('gecti', 'Çember', 'Geçti', '2026-05-01'),
      mk('iptal', 'Çember', 'İptal', '2026-06-01'),
    ];
    const result = filterDropdownEtkinlikleri(input, 'Çember', BUGUN);
    expect(result.map((e) => e.id)).toEqual(['acik', 'dolu']);
  });
});

describe('filterDropdownEtkinlikleri — sort', () => {
  it('tarihBaslangic\'e göre artan sıralı döner (karışık input)', () => {
    const input: MockEntry[] = [
      mk('eyl', 'Çember', 'Kayıt Açık', '2026-09-15'),
      mk('haz', 'Çember', 'Kayıt Açık', '2026-06-21'),
      mk('tem', 'Çember', 'Dolu', '2026-07-15'),
    ];
    const result = filterDropdownEtkinlikleri(input, 'Çember', BUGUN);
    expect(result.map((e) => e.id)).toEqual(['haz', 'tem', 'eyl']);
  });
});

describe('filterDropdownEtkinlikleri — boş durum', () => {
  it('boş array → boş array (hicYok branch trigger)', () => {
    const result = filterDropdownEtkinlikleri([], 'Çember');
    expect(result).toEqual([]);
    expect(result.length === 0).toBe(true);
  });

  it('eşleşen tip yok → boş array', () => {
    const input: MockEntry[] = [
      mk('a', 'Açık Kapı', 'Kayıt Açık', '2026-06-19'),
      mk('b', 'Atölye', 'Kayıt Açık', '2026-09-15'),
    ];
    const result = filterDropdownEtkinlikleri(input, 'Çember', BUGUN);
    expect(result).toEqual([]);
  });

  it('tip eşleşse de tüm durumlar elenirse → boş array', () => {
    const input: MockEntry[] = [
      mk('a', 'Çember', 'Taslak', '2026-06-21'),
      mk('b', 'Çember', 'Geçti', '2026-05-15'),
    ];
    const result = filterDropdownEtkinlikleri(input, 'Çember', BUGUN);
    expect(result).toEqual([]);
  });
});
