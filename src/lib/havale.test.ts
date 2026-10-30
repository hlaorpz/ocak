import { describe, it, expect } from 'vitest';
import { referansBul, havaleKarari, havalePlani, type BankaHareketi, type HavaleKaydi } from './havale.ts';

// Açıklamalar 31 Eki 2026 VakıfBank dökümünden; gönderen adları çıkarıldı.
const H = (ek: Partial<BankaHareketi>): BankaHareketi => ({
  islemNo: '2026013802696516',
  tarih: '2026-10-02T16:13:00',
  tutar: 225,
  tip: '1',
  aciklama: "OCAK-H2RW (02.10.2026 tarihli 9901000339 sorgu no'lu Türkiye Garanti Bankası A.Ş. X hesabından YAP hesabına gelen FAST ödemesi)",
  ...ek,
});

const K = (kayitId: string, ek: Partial<HavaleKaydi> = {}): HavaleKaydi => ({
  pageId: `p-${kayitId}`,
  kayitId,
  tip: 'Kayıt',
  odemeDurumu: 'Beklemede',
  beklenenTutar: 225,
  bankaIslemNo: '',
  kartIslemNo: '',
  ...ek,
});

const harita = (...k: HavaleKaydi[]) => new Map(k.map((x) => [x.kayitId, x]));
const BOS = new Set<string>();

describe('referansBul — dökümde görülen dört yazım', () => {
  it.each([
    ['OCAK-57V4 (02.10.2026 tarihli …', 'OCAK-57V4'],
    ['OCAK PULX (05.10.2026 tarihli …', 'OCAK-PULX'],
    ['OCAK-7M4Q. (02.10.2026 tarihli …', 'OCAK-7M4Q'],
    ['OCAK3HX6/DENİZBANK A.Ş.-0134 …', 'OCAK-3HX6'],
    ['ocak_ab2c ödemesi', 'OCAK-AB2C'],
  ])('%s → %s', (aciklama, kod) => {
    expect(referansBul(aciklama)).toBe(kod);
  });
  it('kodsuz açıklama → null', () => {
    expect(referansBul('HSBC BANK A.Ş.-0123-90001-4289 sorgu numaralı  tarafından  tarafına gelen EFT ')).toBeNull();
  });
  it('"OCAK.BIZ" kod sayılmaz', () => {
    expect(referansBul('RUMUZ OCAK.BIZ')).toBeNull();
  });
});

describe('havaleKarari — yalnız kesin eşleşme yazılır', () => {
  it('Beklemede + tutar tutuyor → yaz, Ödendi yap', () => {
    const r = havaleKarari(H({}), harita(K('OCAK-H2RW')), BOS);
    expect(r).toMatchObject({ tip: 'yaz', odendiYap: true, odemeTarihi: '2026-10-02' });
  });
  it('Ödendi (elle işaretlenmiş) → yaz, durum değişmez', () => {
    const r = havaleKarari(H({}), harita(K('OCAK-H2RW', { odemeDurumu: 'Ödendi' })), BOS);
    expect(r).toMatchObject({ tip: 'yaz', odendiYap: false });
  });
  it('giden para → atla', () => {
    expect(havaleKarari(H({ tip: '2', tutar: -975 }), harita(K('OCAK-H2RW')), BOS)).toEqual({ tip: 'atla', sebep: 'giden' });
  });
  it('N-Kolay POS aktarımı → atla', () => {
    const pos = H({ aciklama: '400026580 - YAP EGITIM DAN GIDA VE DIS TIC A S - POS Tutarı HAVALE/EFT BEDELI/AKTİF YATIRIM BANKASI A.Ş.' });
    expect(havaleKarari(pos, harita(K('OCAK-H2RW')), BOS)).toEqual({ tip: 'atla', sebep: 'pos-aktarimi' });
  });
  it('işlem no daha önce yazılmış → atla (tarama tekrar koşunca)', () => {
    expect(havaleKarari(H({}), harita(K('OCAK-H2RW')), new Set(['2026013802696516']))).toEqual({ tip: 'atla', sebep: 'zaten-yazili' });
  });
  it('açıklamasız EFT → kod-yok (HSBC vakası)', () => {
    expect(havaleKarari(H({ aciklama: 'HSBC BANK A.Ş. gelen EFT' }), harita(), BOS)).toEqual({ tip: 'atla', sebep: 'kod-yok' });
  });
  it('yanlış yazılmış kod → yazılmaz, tek aday ÖNERİLİR (VLE9 ↔ VL39)', () => {
    const r = havaleKarari(H({ tutar: 300, aciklama: 'OCAK-VLE9 (15.10.2026 …' }), harita(K('OCAK-VL39', { beklenenTutar: 300 })), BOS);
    expect(r).toEqual({ tip: 'atla', sebep: 'kayit-yok', kod: 'OCAK-VLE9', oneri: 'OCAK-VL39' });
  });
  it('öneri tutar tutmazsa verilmez', () => {
    const r = havaleKarari(H({ tutar: 450, aciklama: 'OCAK-VLE9' }), harita(K('OCAK-VL39', { beklenenTutar: 300 })), BOS);
    expect(r).toEqual({ tip: 'atla', sebep: 'kayit-yok', kod: 'OCAK-VLE9' });
  });
  it('tutar tutmuyor → atla (3HX6: 225 yerine 225.000)', () => {
    const r = havaleKarari(H({ tutar: 225000, aciklama: 'OCAK3HX6/DENİZBANK' }), harita(K('OCAK-3HX6')), BOS);
    expect(r).toEqual({ tip: 'atla', sebep: 'tutar-tutmuyor', kod: 'OCAK-3HX6' });
  });
  it('iptal kayda para → yazılmaz, Kaan bakar (9TWG vakası)', () => {
    expect(havaleKarari(H({}), harita(K('OCAK-H2RW', { odemeDurumu: 'İptal' })), BOS))
      .toEqual({ tip: 'atla', sebep: 'iptal-kayda-para', kod: 'OCAK-H2RW' });
  });
  it('Bedava / İade → yazılmaz', () => {
    expect(havaleKarari(H({}), harita(K('OCAK-H2RW', { odemeDurumu: 'Bedava' })), BOS))
      .toMatchObject({ tip: 'atla', sebep: 'durum-uygun-degil' });
  });
  it('kartla ödenmiş kayda havale → çift ödeme, yazılmaz', () => {
    expect(havaleKarari(H({}), harita(K('OCAK-H2RW', { odemeDurumu: 'Ödendi', kartIslemNo: 'IKSIRPF1' })), BOS))
      .toMatchObject({ tip: 'atla', sebep: 'kartla-odenmis' });
  });
  it('kayıtta başka banka işlem no → dokunulmaz', () => {
    expect(havaleKarari(H({}), harita(K('OCAK-H2RW', { bankaIslemNo: '999' })), BOS))
      .toMatchObject({ tip: 'atla', sebep: 'kayitta-baska-islem-no' });
  });
  it('tutar kuruşla karşılaştırılır', () => {
    expect(havaleKarari(H({ tutar: 225.0000001 }), harita(K('OCAK-H2RW')), BOS).tip).toBe('yaz');
    expect(havaleKarari(H({ tutar: 225.01 }), harita(K('OCAK-H2RW')), BOS).tip).toBe('atla');
  });
});

describe('havalePlani', () => {
  it('aynı kayda iki kesin eşleşme → ikisi de yazılmaz', () => {
    const plan = havalePlani(
      [H({ islemNo: 'a' }), H({ islemNo: 'b' })],
      harita(K('OCAK-H2RW')),
      BOS,
    );
    expect(plan.map((p) => p.karar)).toEqual([
      { tip: 'atla', sebep: 'cift-odeme', kod: 'OCAK-H2RW' },
      { tip: 'atla', sebep: 'cift-odeme', kod: 'OCAK-H2RW' },
    ]);
  });
});
