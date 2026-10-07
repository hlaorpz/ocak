import { describe, it, expect } from 'vitest';
import {
  odemeLinkImzasi,
  odemeLinki,
  odemeLinkiGecerli,
  odemeBaslatilabilir,
  ODEME_LINK_TABAN,
} from './odeme-link.ts';

/**
 * `lib/odeme-link.ts` — kart devam linkinin imzası + ödeme başlatma kapısı.
 *
 * Sır parametre olarak geçiliyor (env değil) — test ortam değişkenine
 * bağlanmasın. Üretimde `odemeLinkSirri()` okur.
 *
 * Dosya `src/lib/` altında (KARAR 574).
 */

const SIR = 'tarama-sirri-degil-link-sirri';
const REF = 'OCAK-7K2M';

describe('odemeLinkImzasi / odemeLinki', () => {
  it('imza deterministik ve HMAC-SHA256 hex (64 karakter)', () => {
    const a = odemeLinkImzasi(REF, SIR);
    const b = odemeLinkImzasi(REF, SIR);
    expect(a).toBe(b);
    expect(a).toMatch(/^[0-9a-f]{64}$/);
  });

  it('farklı kayıt → farklı imza; farklı sır → farklı imza', () => {
    expect(odemeLinkImzasi('OCAK-9ZQ1', SIR)).not.toBe(odemeLinkImzasi(REF, SIR));
    expect(odemeLinkImzasi(REF, 'baska-sir')).not.toBe(odemeLinkImzasi(REF, SIR));
  });

  it('link kanonik tabana kurulur — publicOrigin DEĞİL', () => {
    // Link maile giriyor ve mail kalıcı bir yüzey; preview deploy'dan üretilen
    // bir link o deploy ölünce ölürdü (`etkinlikUrlFormatla` ile aynı gerekçe).
    const u = odemeLinki(REF, SIR);
    expect(u.startsWith(ODEME_LINK_TABAN)).toBe(true);
    expect(u).toContain('https://www.ocak.biz/odeme/devam');
    const p = new URL(u).searchParams;
    expect(p.get('k')).toBe(REF);
    expect(p.get('i')).toBe(odemeLinkImzasi(REF, SIR));
  });

  it('⚠ SIRRIN KENDİSİ URL\'e GİRMEZ', () => {
    const u = odemeLinki(REF, SIR);
    expect(u).not.toContain(SIR);
    expect(u).not.toContain('sir');
  });

  it('sır boşsa link ÜRETİLMEZ — boş dize', () => {
    expect(odemeLinki(REF, '')).toBe('');
    expect(odemeLinkImzasi(REF, '')).toBe('');
  });

  it('kayıt id boşsa imza üretilmez', () => {
    expect(odemeLinkImzasi('', SIR)).toBe('');
    expect(odemeLinkImzasi('   ', SIR)).toBe('');
  });
});

describe('odemeLinkiGecerli — fail-closed', () => {
  it('doğru imza geçer', () => {
    expect(odemeLinkiGecerli(REF, odemeLinkImzasi(REF, SIR), SIR)).toBe(true);
  });

  it('yanlış imza geçmez', () => {
    expect(odemeLinkiGecerli(REF, 'a'.repeat(64), SIR)).toBe(false);
  });

  it('BAŞKA kaydın imzası geçmez — kayıt ile imza bağlı', () => {
    expect(odemeLinkiGecerli(REF, odemeLinkImzasi('OCAK-9ZQ1', SIR), SIR)).toBe(false);
  });

  it('⚠ SIR YOKSA hiçbir şey geçmez (fail-closed, fail-open DEĞİL)', () => {
    // `sabitZamanliEsit` boş-boş için `true` döner; o tuzağa düşmüyoruz.
    // Sır yazılmamış bir sunucuda imzasız bir isteğin geçmesi demekti.
    expect(odemeLinkiGecerli(REF, '', '')).toBe(false);
    expect(odemeLinkiGecerli(REF, 'herhangi', '')).toBe(false);
    expect(odemeLinkiGecerli('', '', '')).toBe(false);
  });

  it('imza boşsa geçmez', () => {
    expect(odemeLinkiGecerli(REF, '', SIR)).toBe(false);
    expect(odemeLinkiGecerli(REF, '   ', SIR)).toBe(false);
  });

  it('imza çevresindeki boşluk kırpılır — maildeki satır kırılması affedilir', () => {
    expect(odemeLinkiGecerli(REF, ` ${odemeLinkImzasi(REF, SIR)} `, SIR)).toBe(true);
  });
});

describe('odemeBaslatilabilir — kapı, İKİ yerde çağrılacak', () => {
  const simdi = new Date('2026-10-02T12:00:00+03:00');
  const ileri = new Date('2026-10-02T18:00:00+03:00');
  const geride = new Date('2026-10-02T06:00:00+03:00');

  it('Beklemede + bitiş GELMEMİŞ → başlatılabilir', () => {
    expect(odemeBaslatilabilir({ odemeDurumu: 'Beklemede', yerTutmaBitisi: ileri, simdi }))
      .toEqual({ baslatilabilir: true });
  });

  it('Ödendi → başlatılmaz', () => {
    const r = odemeBaslatilabilir({ odemeDurumu: 'Ödendi', yerTutmaBitisi: ileri, simdi });
    expect(r).toEqual({ baslatilabilir: false, sebep: 'odendi' });
  });

  it('İptal → başlatılmaz', () => {
    const r = odemeBaslatilabilir({ odemeDurumu: 'İptal', yerTutmaBitisi: ileri, simdi });
    expect(r).toEqual({ baslatilabilir: false, sebep: 'iptal' });
  });

  it('Beklemede ama bitiş GEÇMİŞ → başlatılmaz', () => {
    const r = odemeBaslatilabilir({ odemeDurumu: 'Beklemede', yerTutmaBitisi: geride, simdi });
    expect(r).toEqual({ baslatilabilir: false, sebep: 'sure-doldu' });
  });

  it('bitiş TAM ŞİMDİ → başlatılmaz (eşitlik geçmiş sayılır)', () => {
    const r = odemeBaslatilabilir({ odemeDurumu: 'Beklemede', yerTutmaBitisi: new Date(simdi), simdi });
    expect(r.baslatilabilir).toBe(false);
  });

  it('⚠ `Yer Tutma Bitişi` BOŞ → başlatılabilir (brief öncesi kayıtlar)', () => {
    // Onları kapsama almak, ödemesini yapmak isteyen bir kadının kapısını
    // geçmişe dönük kapatmak olurdu.
    expect(odemeBaslatilabilir({ odemeDurumu: 'Beklemede', yerTutmaBitisi: null, simdi }))
      .toEqual({ baslatilabilir: true });
  });

  it('Bedava ve İade → başlatılmaz (ödenecek bir şey yok)', () => {
    for (const d of ['Bedava', 'İade']) {
      const r = odemeBaslatilabilir({ odemeDurumu: d, yerTutmaBitisi: null, simdi });
      expect(r).toEqual({ baslatilabilir: false, sebep: 'durum-uygun-degil' });
    }
  });

  it('bilinmeyen/boş durum → başlatılmaz (fail-closed)', () => {
    expect(odemeBaslatilabilir({ odemeDurumu: '', yerTutmaBitisi: null, simdi }).baslatilabilir)
      .toBe(false);
    expect(odemeBaslatilabilir({ odemeDurumu: 'Yeni Bir Değer', yerTutmaBitisi: null, simdi }).baslatilabilir)
      .toBe(false);
  });
});
