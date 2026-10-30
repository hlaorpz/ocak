import { describe, it, expect } from 'vitest';
import { vbAyari, tokenAl, hareketleriOku, type VbGetir, type VbAyar } from './vakifbank.ts';

const yanit = (govde: unknown, status = 200): ReturnType<VbGetir> =>
  Promise.resolve({ ok: status < 400, status, text: () => Promise.resolve(typeof govde === 'string' ? govde : JSON.stringify(govde)) });

const ENV = { VAKIFBANK_CLIENT_ID: 'id', VAKIFBANK_CLIENT_SECRET: 'sir', VAKIFBANK_RIZA_NO: 'riza' };

describe('vbAyari', () => {
  it('boş ortam → sandbox, varsayılan adresler', () => {
    const r = vbAyari(ENV);
    expect(r.ok && r.deger).toMatchObject({
      ortam: 'sandbox',
      taban: 'https://apigw.vakifbank.com.tr:8443',
      tokenUrl: 'https://apigw.vakifbank.com.tr:8443/auth/oauth/v2/token',
    });
  });
  it('eksik env adlarıyla raporlanır, değerle değil', () => {
    const r = vbAyari({});
    expect(r).toEqual({ ok: false, hata: 'env eksik: VAKIFBANK_CLIENT_ID, VAKIFBANK_CLIENT_SECRET, VAKIFBANK_RIZA_NO' });
  });
  it('production hesap no ister', () => {
    expect(vbAyari({ ...ENV, VAKIFBANK_ORTAM: 'production' }).ok).toBe(false);
  });
  it('yazım hatası reddedilir', () => {
    expect(vbAyari({ ...ENV, VAKIFBANK_ORTAM: 'canli' }).ok).toBe(false);
  });
  it('token adresi ezilebilir', () => {
    const r = vbAyari({ ...ENV, VAKIFBANK_TOKEN_URL: 'https://x/oauth2/token' });
    expect(r.ok && r.deger.tokenUrl).toBe('https://x/oauth2/token');
  });
});

const AYAR: VbAyar = {
  ortam: 'sandbox', clientId: 'id', clientSecret: 'sir', rizaNo: 'riza', hesapNo: '',
  taban: 'https://apigw.vakifbank.com.tr:8443', tokenUrl: 'https://apigw.vakifbank.com.tr:8443/auth/oauth/v2/token',
};

describe('tokenAl', () => {
  it('koleksiyondaki form alanları gider', async () => {
    let body = '';
    const r = await tokenAl(AYAR, (_u, i) => { body = i.body; return yanit({ access_token: 'T', expires_in: 3600 }); });
    expect(r).toEqual({ ok: true, deger: 'T' });
    const f = new URLSearchParams(body);
    expect(Object.fromEntries(f)).toEqual({
      client_id: 'id', client_secret: 'sir', grant_type: 'b2b_credentials', scope: 'account', consentId: 'riza', resource: 'sandbox',
    });
  });
  it('token yoksa yalnız anahtar adları döner (sır sızmaz)', async () => {
    const r = await tokenAl(AYAR, () => yanit({ token: 'GIZLI-DEGER' }));
    expect(r.ok).toBe(false);
    expect(JSON.stringify(r)).not.toContain('GIZLI-DEGER');
  });
  it('HTTP 401 → hata, throw yok', async () => {
    expect((await tokenAl(AYAR, () => yanit({ error: 'invalid_client' }, 401))).ok).toBe(false);
    expect((await tokenAl(AYAR, () => Promise.reject(new Error('ECONNREFUSED')))).ok).toBe(false);
  });
});

// Koleksiyondaki örnek yanıttan (sandbox).
const ORNEK = {
  Header: { StatusCode: 'APIGW000000', StatusDescription: 'Tamamlandı' },
  Data: {
    AccountTransactions: [
      { CurrencyCode: 'TL', TransactionType: '1', Description: 'deneme / PARA Yatirma', Amount: 97979, TransactionDate: '2023-08-08T13:56:51', TransactionId: '2014000007740171' },
      { CurrencyCode: 'TL', TransactionType: '2', Description: 'Ek Hesap gecikmeli kredi tahsilatı', Amount: -1.74, TransactionDate: '2023-08-08T13:58:41', TransactionId: '2023000012500913' },
    ],
  },
};

describe('hareketleriOku', () => {
  it('gün gün sorar, Bearer + koleksiyon gövdesi', async () => {
    const istekler: { url: string; auth: string; body: unknown }[] = [];
    const r = await hareketleriOku(AYAR, 'T', '2026-10-30', '2026-10-31', (url, i) => {
      istekler.push({ url, auth: i.headers.Authorization, body: JSON.parse(i.body) });
      return yanit(ORNEK);
    });
    expect(istekler).toHaveLength(2);
    expect(istekler[0]).toEqual({
      url: 'https://apigw.vakifbank.com.tr:8443/accountTransactions',
      auth: 'Bearer T',
      body: { AccountNumber: '', StartDate: '2026-10-30T00:00:00+03:00', EndDate: '2026-10-31T00:00:00+03:00' },
    });
    expect(istekler[1].body).toMatchObject({ StartDate: '2026-10-31T00:00:00+03:00', EndDate: '2026-11-01T00:00:00+03:00' });
    // İki gün aynı iki hareketi döndü → bir kez sayıldı.
    expect(r.ok && r.deger.hareketler).toEqual([
      { islemNo: '2014000007740171', tarih: '2023-08-08T13:56:51', tutar: 97979, tip: '1', aciklama: 'deneme / PARA Yatirma' },
      { islemNo: '2023000012500913', tarih: '2023-08-08T13:58:41', tutar: -1.74, tip: '2', aciklama: 'Ek Hesap gecikmeli kredi tahsilatı' },
    ]);
  });
  it('banka hata kodu → hata', async () => {
    const r = await hareketleriOku(AYAR, 'T', '2026-10-31', '2026-10-31', () => yanit({ Header: { StatusCode: 'APIGW400', StatusDescription: 'Rıza geçersiz' } }));
    expect(r).toEqual({ ok: false, hata: 'hareket 2026-10-31: APIGW400 Rıza geçersiz' });
  });
  it('100 kayıtlık gün işaretlenir', async () => {
    const yuz = { Header: { StatusCode: 'APIGW000000' }, Data: { AccountTransactions: Array.from({ length: 100 }, (_, i) => ({ TransactionId: String(i), TransactionDate: 't', Amount: 1, TransactionType: '1' })) } };
    const r = await hareketleriOku(AYAR, 'T', '2026-10-31', '2026-10-31', () => yanit(yuz));
    expect(r.ok && r.deger.gunler).toEqual([{ gun: '2026-10-31', adet: 100, tavanaDegdi: true }]);
  });
});

describe('hesapListesi', () => {
  it('Bearer ile /accountList, Data döner', async () => {
    const { hesapListesi } = await import('./vakifbank.ts');
    let url = '';
    const r = await hesapListesi(AYAR, 'T', (u) => { url = u; return yanit({ Header: { StatusCode: 'APIGW000000' }, Data: { Accounts: [{ AccountNumber: '1' }] } }); });
    expect(url).toBe('https://apigw.vakifbank.com.tr:8443/accountList');
    expect(r).toEqual({ ok: true, deger: { Accounts: [{ AccountNumber: '1' }] } });
  });
});

describe('hareketsiz gün', () => {
  it('HTTP 400 + ACBH000202 → sıfır hareket, hata değil (31 Eki sandbox ölçümü)', async () => {
    const bos = { Header: { StatusCode: 'ACBH000202', StatusDescription: 'Seçilen tarih aralığında hesap hareketi bulunmamaktadır.' } };
    const r = await hareketleriOku(AYAR, 'T', '2026-10-27', '2026-10-28', (_u, i) =>
      JSON.parse(i.body).StartDate.startsWith('2026-10-27') ? yanit(bos, 400) : yanit(ORNEK));
    expect(r.ok).toBe(true);
    expect(r.ok && r.deger.gunler).toEqual([
      { gun: '2026-10-27', adet: 0, tavanaDegdi: false },
      { gun: '2026-10-28', adet: 2, tavanaDegdi: false },
    ]);
  });
  it('başka 400 kodu hâlâ hata', async () => {
    const r = await hareketleriOku(AYAR, 'T', '2026-10-27', '2026-10-27', () => yanit({ Header: { StatusCode: 'ACBH000034' } }, 400));
    expect(r.ok).toBe(false);
  });
});
