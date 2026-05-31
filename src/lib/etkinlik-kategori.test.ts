import { describe, it, expect, vi } from 'vitest';
import {
  filterEtkinliklerByKategori,
  FORMAT_KATEGORI,
  getKategori,
  getHeading,
  DEFAULT_HEADING,
  KATEGORI_HEADING,
  type EtkinlikKategori,
} from './etkinlik-kategori';

interface MockEtkinlik {
  tip: string;
  baslik: string;
}

const liste: MockEtkinlik[] = [
  { tip: 'Çember', baslik: 'cember-1' },
  { tip: 'Çember', baslik: 'cember-2' },
  { tip: 'Açık Kapı', baslik: 'acik-kapi-1' },
  { tip: 'Workshop', baslik: 'workshop-1' },
  { tip: 'Mevsim Seremonisi', baslik: 'seremoni-1' },
];

describe('filterEtkinliklerByKategori — kategori defansı (#26 / Brief I.3)', () => {
  it('undefined kategori → liste değişmez (ana sayfa davranışı)', () => {
    const sonuc = filterEtkinliklerByKategori(liste, undefined);
    expect(sonuc).toHaveLength(liste.length);
    expect(sonuc.map((e) => e.baslik)).toEqual(liste.map((e) => e.baslik));
  });

  it("boş string kategori → liste değişmez (falsy kontrolü)", () => {
    const sonuc = filterEtkinliklerByKategori(liste, '');
    expect(sonuc).toHaveLength(liste.length);
  });

  it('bilinmeyen kategori string → boş liste (graceful degrade, component "yakında" fallback gösterir)', () => {
    const sonuc = filterEtkinliklerByKategori(liste, 'bilinmeyen-kategori');
    expect(sonuc).toEqual([]);
  });

  it('geçerli kategori "cember" → FORMAT_KATEGORI map ile eşleşen etkinlikler', () => {
    const sonuc = filterEtkinliklerByKategori(liste, 'cember' satisfies EtkinlikKategori);
    expect(sonuc.map((e) => e.baslik)).toEqual(['cember-1', 'cember-2']);
    // Map tutarlılığı: tüm değerler tipli kategoriye dönmeli.
    expect(FORMAT_KATEGORI['Çember']).toBe('cember');
  });
});

describe('getKategori — slug → kategori türetme (KARAR 127 genişletme)', () => {
  it('Home ("/") → null (kategori yok, tüm yaklaşan etkinlikler)', () => {
    expect(getKategori('/')).toBe(null);
  });

  it('oda sayfaları (4 hard-coded markerlı + 3 defansif) → ilgili kategori', () => {
    expect(getKategori('/mini-retreat')).toBe('mini-retreat');
    expect(getKategori('/seremoni')).toBe('seremoni');
    expect(getKategori('/workshop')).toBe('workshop');
    expect(getKategori('/istanbul')).toBe('istanbul');
    expect(getKategori('/cember')).toBe('cember');
    expect(getKategori('/acik-kapi')).toBe('acik-kapi');
    expect(getKategori('/anadolu')).toBe('yolculuk');
  });

  it('bilinmeyen slug → null fallback + warn', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(getKategori('/bilinmeyen')).toBe(null);
    expect(warn).toHaveBeenCalled();
    expect(warn.mock.calls[0][0]).toContain('bilinmeyen');
    warn.mockRestore();
  });
});

describe('getHeading — fallback davranışı (brief karar)', () => {
  it('kategori null (Home) → DEFAULT_HEADING', () => {
    expect(getHeading('/', true)).toBe(DEFAULT_HEADING);
    expect(getHeading('/', false)).toBe(DEFAULT_HEADING);
  });

  it('kategori var + o kategoride etkinlik var → KATEGORI_HEADING', () => {
    expect(getHeading('/seremoni', true)).toBe(KATEGORI_HEADING['seremoni']);
    expect(getHeading('/workshop', true)).toBe(KATEGORI_HEADING['workshop']);
  });

  it('kategori var + o kategoride etkinlik yok → DEFAULT_HEADING (fallback davranışı)', () => {
    expect(getHeading('/seremoni', false)).toBe(DEFAULT_HEADING);
    expect(getHeading('/mini-retreat', false)).toBe(DEFAULT_HEADING);
  });

  it('bilinmeyen slug → DEFAULT_HEADING (warn + null kategori türevi)', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(getHeading('/bilinmeyen', true)).toBe(DEFAULT_HEADING);
    warn.mockRestore();
  });
});
