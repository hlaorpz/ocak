import { describe, it, expect } from 'vitest';
import {
  RIZA_ANAHTARI,
  RIZA_SURE_GUN,
  rizaCoz,
  rizaKaydiUret,
  bantGosterilsinMi,
  gtmYuklensinMi,
  silinecekCerezAdlari,
  cerezAdlariniAyikla,
  cerezSilmeDizeleri,
  RIZA_CEREZ_ALANLARI,
} from './riza';

/**
 * B118 — rıza kapısının kuralı. Kapı KODDA (brief K-1), o yüzden kuralın
 * kendisi burada ölçülüyor: hangi ham değer "rıza var" sayılır, hangisi
 * saymaz, ve geri alma hangi çerezlere dokunur.
 */

const SIMDI = new Date('2026-10-09T12:00:00.000Z');
const GUN_MS = 24 * 60 * 60 * 1000;

function kayit(deger: 'kabul' | 'ret', t: string) {
  return JSON.stringify({ v: 1, deger, t });
}

describe('rizaCoz — hangi ham değer geçerli kayıt sayılır', () => {
  it('anahtar adı ve süre sabitleri brief ile birebir', () => {
    expect(RIZA_ANAHTARI).toBe('ocak-riza');
    expect(RIZA_SURE_GUN).toBe(180);
  });

  it('taze kabul kaydı çözülür', () => {
    const ham = kayit('kabul', '2026-10-01T09:00:00.000Z');
    expect(rizaCoz(ham, SIMDI)).toEqual({
      v: 1,
      deger: 'kabul',
      t: '2026-10-01T09:00:00.000Z',
    });
  });

  it('taze ret kaydı da çözülür — `ret` bir karardır, eksiklik değil', () => {
    const ham = kayit('ret', '2026-10-01T09:00:00.000Z');
    expect(rizaCoz(ham, SIMDI)?.deger).toBe('ret');
  });

  it('anahtar yok → null', () => {
    expect(rizaCoz(null, SIMDI)).toBeNull();
    expect(rizaCoz(undefined, SIMDI)).toBeNull();
    expect(rizaCoz('', SIMDI)).toBeNull();
  });

  it('bozuk JSON → null (exception sızmaz)', () => {
    expect(rizaCoz('{bu json değil', SIMDI)).toBeNull();
    expect(rizaCoz('kabul', SIMDI)).toBeNull();
  });

  it('JSON ama nesne değil → null', () => {
    expect(rizaCoz('"kabul"', SIMDI)).toBeNull();
    expect(rizaCoz('42', SIMDI)).toBeNull();
    expect(rizaCoz('null', SIMDI)).toBeNull();
  });

  it('bilinmeyen şema sürümü → null (ileride v:2 gelirse eski kayıt yeniden sorulur)', () => {
    expect(rizaCoz(JSON.stringify({ v: 2, deger: 'kabul', t: SIMDI.toISOString() }), SIMDI)).toBeNull();
    expect(rizaCoz(JSON.stringify({ deger: 'kabul', t: SIMDI.toISOString() }), SIMDI)).toBeNull();
  });

  it('tanınmayan `deger` → null', () => {
    expect(rizaCoz(JSON.stringify({ v: 1, deger: 'belki', t: SIMDI.toISOString() }), SIMDI)).toBeNull();
    expect(rizaCoz(JSON.stringify({ v: 1, deger: true, t: SIMDI.toISOString() }), SIMDI)).toBeNull();
  });

  it('damga yok ya da ayrıştırılamaz → null', () => {
    expect(rizaCoz(JSON.stringify({ v: 1, deger: 'kabul' }), SIMDI)).toBeNull();
    expect(rizaCoz(JSON.stringify({ v: 1, deger: 'kabul', t: 'dün' }), SIMDI)).toBeNull();
    expect(rizaCoz(JSON.stringify({ v: 1, deger: 'kabul', t: 123 }), SIMDI)).toBeNull();
  });

  it(`${RIZA_SURE_GUN} günden eski kayıt → null`, () => {
    const eski = new Date(SIMDI.getTime() - (RIZA_SURE_GUN + 1) * GUN_MS).toISOString();
    expect(rizaCoz(kayit('kabul', eski), SIMDI)).toBeNull();
  });

  it('tam sınırda (gün farkı eşiğe eşit) kayıt HÂLÂ geçerli', () => {
    const sinir = new Date(SIMDI.getTime() - RIZA_SURE_GUN * GUN_MS).toISOString();
    expect(rizaCoz(kayit('kabul', sinir), SIMDI)?.deger).toBe('kabul');
  });

  it('ileri tarihli damga → null (saati ileri alınmış cihaz rızayı dondurmasın)', () => {
    const ileri = new Date(SIMDI.getTime() + 60_000).toISOString();
    expect(rizaCoz(kayit('kabul', ileri), SIMDI)).toBeNull();
  });
});

describe('rizaKaydiUret — yazım tarafının tek kurucusu', () => {
  it('v:1 + değer + ISO damga', () => {
    expect(rizaKaydiUret('ret', SIMDI)).toEqual({
      v: 1,
      deger: 'ret',
      t: '2026-10-09T12:00:00.000Z',
    });
  });

  it('ürettiğini kendi çözebiliyor (gidiş-dönüş)', () => {
    const uretilen = JSON.stringify(rizaKaydiUret('kabul', SIMDI));
    expect(rizaCoz(uretilen, SIMDI)?.deger).toBe('kabul');
  });
});

describe('bantGosterilsinMi / gtmYuklensinMi — iki ayrı soru', () => {
  it('rıza yokken bant gösterilir, GTM yüklenmez', () => {
    expect(bantGosterilsinMi(null, SIMDI)).toBe(true);
    expect(gtmYuklensinMi(null, SIMDI)).toBe(false);
  });

  it('`ret` durumunda bant gösterilmez AMA GTM de yüklenmez', () => {
    const ham = kayit('ret', SIMDI.toISOString());
    expect(bantGosterilsinMi(ham, SIMDI)).toBe(false);
    expect(gtmYuklensinMi(ham, SIMDI)).toBe(false);
  });

  it('`kabul` durumunda bant gösterilmez, GTM yüklenir', () => {
    const ham = kayit('kabul', SIMDI.toISOString());
    expect(bantGosterilsinMi(ham, SIMDI)).toBe(false);
    expect(gtmYuklensinMi(ham, SIMDI)).toBe(true);
  });

  it('süresi geçmiş `kabul` GTM yüklemez — bant yeniden sorar', () => {
    const eski = new Date(SIMDI.getTime() - (RIZA_SURE_GUN + 1) * GUN_MS).toISOString();
    expect(gtmYuklensinMi(kayit('kabul', eski), SIMDI)).toBe(false);
    expect(bantGosterilsinMi(kayit('kabul', eski), SIMDI)).toBe(true);
  });
});

describe('cerezAdlariniAyikla', () => {
  it('document.cookie dizesinden adları çıkarır', () => {
    expect(cerezAdlariniAyikla('_ga=GA1.1.x; _gid=GA1.2.y; ocak-x=1')).toEqual([
      '_ga',
      '_gid',
      'ocak-x',
    ]);
  });

  it('boş / null / bozuk girdide boş dizi', () => {
    expect(cerezAdlariniAyikla('')).toEqual([]);
    expect(cerezAdlariniAyikla(null)).toEqual([]);
    expect(cerezAdlariniAyikla(';;  ;')).toEqual([]);
  });
});

describe('silinecekCerezAdlari — `_ga*` KALIP, sabit liste yetmez', () => {
  it('GA ve Meta çerezleri seçilir, site çerezleri DOKUNULMAZ', () => {
    const mevcut = [
      '_ga',
      '_ga_7NQ73Q2WSL',
      '_gid',
      '_fbp',
      '_fbc',
      'ocak-riza',
      'ocak-kaynak',
      'astro-session',
    ];
    expect(silinecekCerezAdlari(mevcut)).toEqual([
      '_ga',
      '_ga_7NQ73Q2WSL',
      '_gid',
      '_fbp',
      '_fbc',
    ]);
  });

  it('`ocak-riza` ASLA silinmez — silinirse bant kararı kaybolur ve yeniden sorulur', () => {
    expect(silinecekCerezAdlari(['ocak-riza'])).toEqual([]);
  });

  it('ölçüm kimliği başına açılan her `_ga_` yakalanır (ad önceden bilinemez)', () => {
    expect(silinecekCerezAdlari(['_ga_ABC123', '_ga_DEF456'])).toEqual([
      '_ga_ABC123',
      '_ga_DEF456',
    ]);
  });

  it('`_gat` gibi benzer adlar KAPSAM DIŞI — yalnız listelenen adlar', () => {
    expect(silinecekCerezAdlari(['_gat', '_gac_x', '_fb'])).toEqual([]);
  });
});

describe('cerezSilmeDizeleri — en iyi çaba, üç yazım', () => {
  it('host-only + her alan adı için ayrı süresi-geçmiş yazım', () => {
    const dizeler = cerezSilmeDizeleri('_fbp', RIZA_CEREZ_ALANLARI);
    expect(dizeler).toHaveLength(3);
    expect(dizeler[0]).toBe('_fbp=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/');
    expect(dizeler[1]).toContain('domain=www.ocak.biz');
    expect(dizeler[2]).toContain('domain=.ocak.biz');
  });

  it('her dize geçmiş bir tarih taşır (silme yazımı)', () => {
    for (const d of cerezSilmeDizeleri('_ga', RIZA_CEREZ_ALANLARI)) {
      expect(d).toContain('expires=Thu, 01 Jan 1970');
      expect(d).toContain('path=/');
    }
  });

  it('alan adı listesi boşsa yalnız host-only yazım', () => {
    expect(cerezSilmeDizeleri('_gid', [])).toEqual([
      '_gid=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/',
    ]);
  });
});
