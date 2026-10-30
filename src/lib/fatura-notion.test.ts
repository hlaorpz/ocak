import { describe, it, expect } from 'vitest';
import { faturaSatiriOku, etkinlikOzetiOku, faturaKesildiYazimi, faturaHatasiYazimi, ALAN } from './fatura-notion.ts';
import { faturaKarari } from './fatura.ts';

const yazi = (s: string) => ({ rich_text: [{ plain_text: s }] });

// Notion API'nin döndürdüğü biçim (alan adları Kayıtlar DB'sinden, 30 Eki).
const KAYIT = {
  'Kayıt ID': { title: [{ plain_text: 'OCAK-7K2M' }] },
  Tip: { select: { name: 'Kayıt' } },
  'Ödeme Durumu': { select: { name: 'Ödendi' } },
  'Ödeme Yöntemi': { select: { name: 'Havale' } },
  'İşlem No': yazi(''),
  'Banka İşlem No': yazi('VB-2026-001'),
  'Ödeme Tarihi': { date: { start: '2026-10-15' } },
  'Ödenen Tutar': { number: null },
  'Beklenen Tutar': { number: 750 },
  'Fatura No': yazi(''),
  'Fatura Hatası': yazi(''),
  'Fatura Maili Gitti': { checkbox: false },
  Etkinlikler: { relation: [{ id: 'etk-1' }] },
  Kadın: yazi('Deniz Ak'),
  Şehir: yazi('İzmir'),
  Email: { email: ' deniz@ornek.invalid ' },
};
const ETKINLIK = { Tarih: { date: { start: '2026-10-19T19:00:00.000+03:00', end: null } }, Format: { select: { name: 'Açık Kapı' } } };

describe('faturaSatiriOku', () => {
  const s = faturaSatiriOku('page-1', KAYIT, etkinlikOzetiOku(ETKINLIK));

  it('alanlar doğru okunur', () => {
    expect(s).toMatchObject({
      kayitId: 'OCAK-7K2M', odemeYontemi: 'Havale', bankaIslemNo: 'VB-2026-001',
      odenenTutar: null, beklenenTutar: 750, etkinlikSayisi: 1, etkinlikBitis: '',
      formatHam: 'Açık Kapı', email: 'deniz@ornek.invalid', faturaMailiGitti: false,
    });
  });

  it('uçtan uca: okunan satır karara girer', () => {
    expect(faturaKarari(s, new Date('2026-10-20T07:00:00Z'))).toEqual({ tip: 'kes', yontem: 'havale', toplam: 750 });
  });

  it('etkinlik okunamadıysa tarih boş → kesilmez', () => {
    const bos = faturaSatiriOku('page-1', KAYIT, null);
    expect(faturaKarari(bos, new Date('2026-10-20T07:00:00Z'))).toEqual({ tip: 'atla', sebep: 'etkinlik-tarihi-yok' });
  });

  it('eksik alanlar çökertmez', () => {
    expect(() => faturaSatiriOku('p', {}, null)).not.toThrow();
  });
});

describe('yazımlar', () => {
  it('kesildi: no + ETTN + tarih', () => {
    const y = faturaKesildiYazimi('OCK2026000000001', 'ettn-1', '2026-10-20');
    expect(y[ALAN.faturaNo].rich_text[0].text.content).toBe('OCK2026000000001');
    expect(y[ALAN.faturaEttn].rich_text[0].text.content).toBe('ettn-1');
    expect(y[ALAN.faturaTarihi]).toEqual({ date: { start: '2026-10-20' } });
  });
  it('hata: günlü ve 2000 karakterle sınırlı', () => {
    const y = faturaHatasiYazimi('x'.repeat(3000), '2026-10-20');
    expect(y[ALAN.faturaHatasi].rich_text[0].text.content.startsWith('2026-10-20 · ')).toBe(true);
    expect(y[ALAN.faturaHatasi].rich_text[0].text.content.length).toBe(2000);
  });
});

describe('kilit', () => {
  it('kesimden önce Fatura Hatası dolar → kayıt bir daha aday olmaz', async () => {
    const { faturaKilidiYazimi } = await import('./fatura-notion.ts');
    const y = faturaKilidiYazimi('2026-10-31');
    const metin = y[ALAN.faturaHatasi].rich_text[0].text.content;
    const s = faturaSatiriOku('p', { ...KAYIT, 'Fatura Hatası': yazi(metin) }, etkinlikOzetiOku(ETKINLIK));
    expect(faturaKarari(s, new Date('2026-10-31T07:00:00Z'))).toEqual({ tip: 'atla', sebep: 'onceki-hata' });
  });
  it('kesildi yazımı kilidi kaldırır', () => {
    expect(faturaKesildiYazimi('N', 'E', '2026-10-31')[ALAN.faturaHatasi]).toEqual({ rich_text: [] });
  });
});
