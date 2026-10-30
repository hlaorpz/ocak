import { describe, it, expect } from 'vitest';
import {
  faturaKarari,
  faturaTutari,
  kdvBol,
  adSoyadBol,
  satirAdi,
  faturaGovdesi,
  SATICI_TEST,
  NIHAI_TUKETICI_TCKN,
  type FaturaSatiri,
} from './fatura.ts';

// 2026-10-20 10:00 TR. Etkinlik 19 Ekim → ertesi gün → kesilir.
const SIMDI = new Date('2026-10-20T07:00:00Z');

const kartSatiri = (ek: Partial<FaturaSatiri> = {}): FaturaSatiri => ({
  pageId: 'p1',
  kayitId: 'OCAK-1234',
  tip: 'Kayıt',
  odemeDurumu: 'Ödendi',
  odemeYontemi: 'Kredi Kartı',
  islemNo: 'NK-998877',
  bankaIslemNo: '',
  odemeTarihi: '2026-10-12',
  odenenTutar: 750,
  beklenenTutar: 750,
  faturaNo: '',
  faturaHatasi: '',
  faturaMailiGitti: false,
  etkinlikSayisi: 1,
  etkinlikTarihi: '2026-10-19T19:00:00.000+03:00',
  etkinlikBitis: '',
  formatHam: 'Açık Kapı',
  kadin: 'Ayşe Nur Yılmaz',
  sehir: 'İzmir',
  email: 'ayse@example.com',
  ...ek,
});

describe('faturaKarari — yalnız tahsil edilmiş paraya', () => {
  it('kart: İşlem No + Ödeme Tarihi dolu, etkinlik dün → kes', () => {
    expect(faturaKarari(kartSatiri(), SIMDI)).toEqual({ tip: 'kes', yontem: 'kart', toplam: 750 });
  });

  it('havale: Banka İşlem No dolu → kes', () => {
    const s = kartSatiri({ odemeYontemi: 'Havale', islemNo: '', bankaIslemNo: 'VB-555', odenenTutar: null });
    expect(faturaKarari(s, SIMDI)).toEqual({ tip: 'kes', yontem: 'havale', toplam: 750 });
  });

  it('havale: Ödendi ama Banka İşlem No yok → kanıt yok (elle yazılmış Ödendi kanıt değil)', () => {
    const s = kartSatiri({ odemeYontemi: 'Havale', islemNo: '', bankaIslemNo: '' });
    expect(faturaKarari(s, SIMDI)).toEqual({ tip: 'atla', sebep: 'kanit-yok-havale' });
  });

  it('kart: İşlem No yok → kanıt yok', () => {
    expect(faturaKarari(kartSatiri({ islemNo: '  ' }), SIMDI)).toEqual({ tip: 'atla', sebep: 'kanit-yok-kart' });
  });

  it('kart: İşlem No var ama Ödeme Tarihi yok → kesilmez', () => {
    expect(faturaKarari(kartSatiri({ odemeTarihi: '' }), SIMDI)).toEqual({ tip: 'atla', sebep: 'odeme-tarihi-yok' });
  });

  it('bilinmeyen ödeme yöntemi → kesilmez', () => {
    expect(faturaKarari(kartSatiri({ odemeYontemi: '' }), SIMDI)).toEqual({ tip: 'atla', sebep: 'yontem-bilinmiyor' });
  });

  it.each(['Beklemede', 'Bedava', 'İade', 'İptal'])('Ödeme Durumu %s → kesilmez', (d) => {
    expect(faturaKarari(kartSatiri({ odemeDurumu: d }), SIMDI)).toEqual({ tip: 'atla', sebep: 'odendi-degil' });
  });

  it('Tip Kayıt değil → kesilmez', () => {
    expect(faturaKarari(kartSatiri({ tip: 'Bekleme' }), SIMDI)).toEqual({ tip: 'atla', sebep: 'tip-kayit-degil' });
  });

  it('tutar 0 / boş → kesilmez', () => {
    expect(faturaKarari(kartSatiri({ odenenTutar: 0, beklenenTutar: null }), SIMDI)).toEqual({ tip: 'atla', sebep: 'tutar-yok' });
  });

  it('Anadolu Yolculuğu → kesilmez', () => {
    expect(faturaKarari(kartSatiri({ formatHam: 'Anadolu Yolculuğu' }), SIMDI)).toEqual({ tip: 'atla', sebep: 'anadolu' });
  });

  it('ad boş → kesilmez', () => {
    expect(faturaKarari(kartSatiri({ kadin: ' ' }), SIMDI)).toEqual({ tip: 'atla', sebep: 'ad-yok' });
  });

  it('etkinlik sayısı 1 değil → belirsiz', () => {
    expect(faturaKarari(kartSatiri({ etkinlikSayisi: 0 }), SIMDI)).toEqual({ tip: 'atla', sebep: 'etkinlik-belirsiz' });
    expect(faturaKarari(kartSatiri({ etkinlikSayisi: 2 }), SIMDI)).toEqual({ tip: 'atla', sebep: 'etkinlik-belirsiz' });
  });

  it('kanıtı eksik ama etkinliği bitmemiş kayıt "kanıt yok" diye gürültü yapmaz', () => {
    const s = kartSatiri({ islemNo: '', etkinlikTarihi: '2026-10-25T19:00:00.000+03:00' });
    expect(faturaKarari(s, SIMDI)).toEqual({ tip: 'atla', sebep: 'etkinlik-bitmedi' });
  });
});

describe('faturaKarari — zaman: etkinliğin ertesi günü (TR)', () => {
  it('etkinlik günü → kesilmez', () => {
    const gun = new Date('2026-10-19T20:30:00Z'); // 19 Eki 23:30 TR
    expect(faturaKarari(kartSatiri(), gun)).toEqual({ tip: 'atla', sebep: 'etkinlik-bitmedi' });
  });

  it('TR gece yarısını geçti, UTC hâlâ önceki gün → kesilir (KARAR 385)', () => {
    const gece = new Date('2026-10-19T21:30:00Z'); // 20 Eki 00:30 TR
    expect(faturaKarari(kartSatiri(), gece).tip).toBe('kes');
  });

  it('çok günlü buluşma: bitiş gününe bakılır', () => {
    const s = kartSatiri({ etkinlikTarihi: '2026-10-18', etkinlikBitis: '2026-10-20' });
    expect(faturaKarari(s, SIMDI)).toEqual({ tip: 'atla', sebep: 'etkinlik-bitmedi' });
    expect(faturaKarari(s, new Date('2026-10-21T07:00:00Z')).tip).toBe('kes');
  });

  it('tarih yok → kesilmez', () => {
    expect(faturaKarari(kartSatiri({ etkinlikTarihi: '' }), SIMDI)).toEqual({ tip: 'atla', sebep: 'etkinlik-tarihi-yok' });
  });
});

describe('faturaKarari — tekrar koruması', () => {
  it('Fatura No dolu + mail gitti → bir daha dokunulmaz', () => {
    expect(faturaKarari(kartSatiri({ faturaNo: 'OCK2026000000001', faturaMailiGitti: true }), SIMDI))
      .toEqual({ tip: 'atla', sebep: 'zaten-faturali' });
  });

  it('Fatura No dolu + mail gitmedi → yalnız mail yeniden', () => {
    expect(faturaKarari(kartSatiri({ faturaNo: 'OCK2026000000001' }), SIMDI)).toEqual({ tip: 'mail-tekrar' });
  });

  it('önceki hata yazılı → Kaan temizleyene kadar denenmez', () => {
    expect(faturaKarari(kartSatiri({ faturaHatasi: 'x' }), SIMDI)).toEqual({ tip: 'atla', sebep: 'onceki-hata' });
  });
});

describe('faturaTutari', () => {
  it('Ödenen öncelikli, yoksa Beklenen (B241)', () => {
    expect(faturaTutari({ odenenTutar: 600, beklenenTutar: 750 })).toBe(600);
    expect(faturaTutari({ odenenTutar: null, beklenenTutar: 750 })).toBe(750);
    expect(faturaTutari({ odenenTutar: 0, beklenenTutar: 750 })).toBe(750);
    expect(faturaTutari({ odenenTutar: null, beklenenTutar: null })).toBeNull();
  });
});

describe('kdvBol — matrah + KDV = toplam, kuruşu kuruşuna', () => {
  it('750 → 625 + 125', () => {
    expect(kdvBol(750)).toEqual({ matrah: 625, kdv: 125, toplam: 750 });
  });

  it('1000 → 833.33 + 166.67', () => {
    expect(kdvBol(1000)).toEqual({ matrah: 833.33, kdv: 166.67, toplam: 1000 });
  });

  it('1..5000 arası her tam TL için toplam tutar', () => {
    for (let t = 1; t <= 5000; t++) {
      const { matrah, kdv } = kdvBol(t);
      expect(Math.round((matrah + kdv) * 100)).toBe(t * 100);
    }
  });
});

describe('adSoyadBol', () => {
  it('son kelime soyad', () => {
    expect(adSoyadBol('Ayşe Nur Yılmaz')).toEqual({ ad: 'Ayşe Nur', soyad: 'Yılmaz' });
    expect(adSoyadBol('  Zeynep   Kaya ')).toEqual({ ad: 'Zeynep', soyad: 'Kaya' });
  });
  it('tek kelime → soyad boş', () => {
    expect(adSoyadBol('Deniz')).toEqual({ ad: 'Deniz', soyad: '' });
  });
});

describe('satirAdi', () => {
  it("Kaan'ın örneği", () => {
    expect(satirAdi('Açık Kapı', '2026-10-19T19:00:00.000+03:00')).toBe('Açık Kapı Buluşması - 19 Ekim - Katılım Bedeli');
  });
  it('tabloda olmayan Format kendi adıyla', () => {
    expect(satirAdi('Çember', '2026-11-02')).toBe('Çember - 2 Kasım - Katılım Bedeli');
  });
  it('UTC damgalı tarih TR gününe çevrilir', () => {
    expect(satirAdi('Açık Kapı', '2026-10-19T21:30:00.000Z')).toBe('Açık Kapı Buluşması - 20 Ekim - Katılım Bedeli');
  });
});

describe('faturaGovdesi', () => {
  const girdi = {
    kayitId: 'OCAK-1234',
    kadin: 'Ayşe Nur Yılmaz',
    sehir: 'İzmir',
    email: 'ayse@example.com',
    formatHam: 'Açık Kapı',
    etkinlikTarihi: '2026-10-19T19:00:00.000+03:00',
    odemeTarihi: '2026-10-12',
    yontem: 'kart' as const,
    toplam: 750,
  };
  // biome-ignore lint: test erişimi
  const g = faturaGovdesi(girdi, SATICI_TEST, SIMDI) as any;

  it('referans kodu: LocalDocumentId + OrderReference + Note', () => {
    expect(g.LocalDocumentId).toBe('OCAK-1234');
    expect(g.Invoice.OrderReference.Id.value).toBe('OCAK-1234');
    expect(g.Invoice.Note[0].value).toBe('Referans: OCAK-1234');
  });

  it('fatura no gönderilmez (OCK varsayılan sayaç)', () => {
    expect(g.Invoice.Id).toBeUndefined();
  });

  it('e-Arşiv, nihai tüketici TCKN, Notification yok', () => {
    expect(g.Invoice.ProfileId.value).toBe('EARSIVFATURA');
    expect(g.TargetCustomer.VknTckn).toBe(NIHAI_TUKETICI_TCKN);
    expect(g.Invoice.AccountingCustomerParty.Party.PartyIdentification[0].Id).toEqual({ schemeId: 'TCKN', value: NIHAI_TUKETICI_TCKN });
    expect(g.Notification).toBeUndefined();
  });

  it('tutarlar tutarlı', () => {
    const t = g.Invoice.LegalMonetaryTotal;
    expect(t.TaxExclusiveAmount.value).toBe(625);
    expect(t.PayableAmount.value).toBe(750);
    expect(g.Invoice.TaxTotal[0].TaxAmount.value).toBe(125);
    expect(g.Invoice.InvoiceLine[0].Item.Name.value).toBe('Açık Kapı Buluşması - 19 Ekim - Katılım Bedeli');
  });

  it('kart: aracı N-Kolay; havale: aracı yok, EFT/HAVALE', () => {
    expect(g.EArchiveInvoiceInfo.InternetSalesInfo).toMatchObject({
      PaymentType: 'KREDIKARTI/BANKAKARTI', PaymentMidierName: 'N-Kolay', PaymentDate: '2026-10-12',
    });
    // biome-ignore lint: test erişimi
    const h = faturaGovdesi({ ...girdi, yontem: 'havale' }, SATICI_TEST, SIMDI) as any;
    expect(h.EArchiveInvoiceInfo.InternetSalesInfo.PaymentType).toBe('EFT/HAVALE');
    expect(h.EArchiveInvoiceInfo.InternetSalesInfo.PaymentMidierName).toBeUndefined();
  });

  it('düzenleme tarihi TR günü', () => {
    expect(g.Invoice.IssueDate.value).toBe('2026-10-20');
  });
});
