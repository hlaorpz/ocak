import { describe, it, expect } from 'vitest';
import { uyumsoftAyari, saticiSec, faturaGonder, faturaPdf, type Getir, type UyumsoftAyar } from './uyumsoft.ts';
import { SATICI_CANLI, SATICI_TEST } from './fatura.ts';

const yanit = (govde: unknown, status = 200): ReturnType<Getir> =>
  Promise.resolve({ ok: status < 400, status, text: () => Promise.resolve(typeof govde === 'string' ? govde : JSON.stringify(govde)) });

const TEST: UyumsoftAyar = { ortam: 'test', kullanici: 'Uyumsoft', sifre: 'Uyumsoft' };

describe('uyumsoftAyari', () => {
  it('boş env → test ortamı + ortak test hesabı', () => {
    expect(uyumsoftAyari({})).toEqual({ ok: true, ayar: TEST });
  });
  it('canlıda kimlik zorunlu', () => {
    expect(uyumsoftAyari({ UYUMSOFT_ORTAM: 'canli' }).ok).toBe(false);
    expect(uyumsoftAyari({ UYUMSOFT_ORTAM: 'canli', UYUMSOFT_KULLANICI: 'k', UYUMSOFT_SIFRE: 's' }))
      .toEqual({ ok: true, ayar: { ortam: 'canli', kullanici: 'k', sifre: 's' } });
  });
  it('yazım hatası canlıya düşmez, reddedilir', () => {
    expect(uyumsoftAyari({ UYUMSOFT_ORTAM: 'canlı' }).ok).toBe(false);
  });
  it('satıcı ortama göre', () => {
    expect(saticiSec('canli')).toBe(SATICI_CANLI);
    expect(saticiSec('test')).toBe(SATICI_TEST);
  });
});

describe('faturaGonder', () => {
  it('istek biçimi + başarılı yanıt', async () => {
    let gonderilen: { url: string; body: string } | null = null;
    const getir: Getir = (url, init) => {
      gonderilen = { url, body: init.body };
      return yanit({ Data: { Value: [{ Id: 'ettn-1', Number: 'OCK2026000000001', InvoiceScenario: 1 }], IsSucceded: true, Message: null } });
    };
    const r = await faturaGonder(TEST, { LocalDocumentId: 'OCAK-1' }, getir);
    expect(r).toEqual({ ok: true, deger: { ettn: 'ettn-1', numara: 'OCK2026000000001' } });
    expect(gonderilen!.url).toBe('https://efatura-test.uyumsoft.com.tr/api/BasicIntegrationApi');
    const govde = JSON.parse(gonderilen!.body);
    expect(govde.Action).toBe('SendInvoice');
    expect(govde.parameters.invoices).toEqual([{ LocalDocumentId: 'OCAK-1' }]);
    expect(govde.parameters.userInfo).toEqual({ Username: 'Uyumsoft', Password: 'Uyumsoft' });
  });

  it('IsSucceded false → mesaj döner', async () => {
    const r = await faturaGonder(TEST, {}, () => yanit({ Data: { IsSucceded: false, Message: 'Mükerrer belge' } }));
    expect(r).toEqual({ ok: false, hata: 'SendInvoice: Mükerrer belge' });
  });

  it('JSON olmayan yanıt / ağ hatası throw etmez', async () => {
    expect((await faturaGonder(TEST, {}, () => yanit('<html>', 502))).ok).toBe(false);
    expect((await faturaGonder(TEST, {}, () => Promise.reject(new Error('ECONNRESET')))).ok).toBe(false);
  });

  it('başarılı ama numara yok → hata', async () => {
    const r = await faturaGonder(TEST, {}, () => yanit({ Data: { Value: [], IsSucceded: true } }));
    expect(r.ok).toBe(false);
  });
});

describe('faturaPdf', () => {
  const b64 = 'JVBERi0'.padEnd(200, 'A');
  it.each([
    ['Data.Data', { Data: { Data: b64, IsSucceded: true } }],
    ['Data.Value (string)', { Data: { Value: b64, IsSucceded: true } }],
    ['Data.Value.Data', { Data: { Value: { Data: b64 }, IsSucceded: true } }],
  ])('%s zarfı okunur', async (_, govde) => {
    expect(await faturaPdf(TEST, 'ettn-1', () => yanit(govde))).toEqual({ ok: true, deger: b64 });
  });
  it('boş PDF → hata', async () => {
    expect((await faturaPdf(TEST, 'e', () => yanit({ Data: { IsSucceded: true } }))).ok).toBe(false);
  });
});
