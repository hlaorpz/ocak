/**
 * fatura.ts — e-Arşiv fatura akışının SAF çekirdeği (Kaan, 30 Eki 2026).
 *
 * Bu modül ağa çıkmaz, Notion'u bilmez, env okumaz. Üç işi var:
 *   1. Bir kaydın faturaya aday olup olmadığına karar vermek (`faturaKarari`)
 *   2. Tutarı KDV'ye bölmek (`kdvBol`)
 *   3. Uyumsoft `SendInvoice` gövdesini kurmak (`faturaGovdesi`)
 * Uç (`api/fatura-tara.ts`) okur, buradan karar alır, uygular.
 *
 * ── KURAL: fatura yalnız TAHSİL EDİLMİŞ paraya kesilir (Kaan, 30 Eki) ──
 *   Kart   → `İşlem No` (N-Kolay) + `Ödeme Tarihi` dolu
 *   Havale → `Banka İşlem No` (VakıfBank hareketi) + `Ödeme Tarihi` dolu
 * Başka hiçbir şeye kesilmez. `Ödeme Durumu = Ödendi` tek başına KANIT DEĞİL:
 * havalede o değeri bugün Kaan elle yazıyor. Kanıtı eksik kayıt sessizce
 * düşmez — sebebiyle rapora girer.
 *
 * ── ZAMAN: etkinliğin ERTESİ GÜNÜ (Kaan, 30 Eki) ──
 * Etkinlik tarihi (TR günü) bugünden (TR günü) KÜÇÜK olmalı. Etkinlikten önce
 * iade edilen kayıt `Ödendi` değildir → fatura kesilmez, iptal gerekmez.
 * Kod alıp sonraki buluşmaya geçen kadın: kayıt KENDİ etkinliğine bakar;
 * ayrı mantık yok (Kaan, 30 Eki).
 *
 * ⚠ Gün karşılaştırması `trGun` ile (KARAR 385/464): Vercel UTC'de koşar,
 * TR 00:00–03:00 arasında naïve Date bir gün kaydırırdı.
 */
import { trGun } from './format-etkinlik.ts';

/** e-Arşiv'de TCKN'si alınmamış bireysel alıcı (Uyumsoft cevabı, Kaan kararı). */
export const NIHAI_TUKETICI_TCKN = '11111111111';

/** KDV oranı — fiyatlar KDV DAHİL (Kaan, 30 Eki; muhasebeci teyidi bekleniyor). */
export const KDV_ORANI = 20;

export const ODEME_ARACISI_KART = 'N-Kolay';
export const SITE_ADRESI = 'https://www.ocak.biz';

/*
 * Satır adı = "<Etkinlik Formatı> - <gün ay> - Katılım Bedeli" (Kaan, 31 Eki):
 * Format Notion'daki hâliyle, Açık Kapı DAHİL eşleme tablosu yok
 * ("Açık Kapı - 19 Ekim - Katılım Bedeli", "Çember - 11 Kasım - Katılım Bedeli").
 * 30 Eki'deki "Açık Kapı Buluşması" örneğinin yerine geçti.
 */

const AYLAR = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık',
];

/** Notion'dan okunan, karar için gereken her şey. Kişi verisi burada yaşar ama log'a girmez. */
export type FaturaSatiri = {
  pageId: string;
  kayitId: string;
  tip: string;
  odemeDurumu: string;
  odemeYontemi: string;
  islemNo: string;
  bankaIslemNo: string;
  /** `Ödeme Tarihi` ham değeri (YYYY-MM-DD ya da ISO). */
  odemeTarihi: string;
  odenenTutar: number | null;
  beklenenTutar: number | null;
  faturaNo: string;
  faturaHatasi: string;
  faturaMailiGitti: boolean;
  /** `Etkinlikler` relation öğe sayısı. 1 değilse fatura kurulmaz. */
  etkinlikSayisi: number;
  /** Etkinliğin `Tarih` başlangıcı (ISO). Satır adındaki gün budur. */
  etkinlikTarihi: string;
  /** Etkinliğin `Tarih` bitişi (çok günlü buluşma). Boşsa başlangıç. "Ertesi gün" buna göre. */
  etkinlikBitis: string;
  formatHam: string;
  kadin: string;
  sehir: string;
  email: string;
};

export type KararSebebi =
  | 'tip-kayit-degil'
  | 'odendi-degil'
  | 'zaten-faturali'
  | 'onceki-hata'
  | 'etkinlik-belirsiz'
  | 'etkinlik-tarihi-yok'
  | 'etkinlik-bitmedi'
  | 'anadolu'
  | 'tutar-yok'
  | 'yontem-bilinmiyor'
  | 'kanit-yok-kart'
  | 'kanit-yok-havale'
  | 'odeme-tarihi-yok'
  | 'ad-yok';

export type FaturaKarari =
  | { tip: 'kes'; yontem: 'kart' | 'havale'; toplam: number }
  /** Fatura kesilmiş ama maili gitmemiş — yalnız mail yeniden denenir. */
  | { tip: 'mail-tekrar' }
  | { tip: 'atla'; sebep: KararSebebi };

/**
 * Tutar: `Ödenen Tutar`, yoksa `Beklenen Tutar` (B241 — havalede `Ödenen`
 * boş kalıyor). İkisi de yoksa/0 ise null.
 */
export function faturaTutari(s: Pick<FaturaSatiri, 'odenenTutar' | 'beklenenTutar'>): number | null {
  const aday = [s.odenenTutar, s.beklenenTutar].find(
    (t) => typeof t === 'number' && Number.isFinite(t) && t > 0,
  );
  return aday ?? null;
}

/**
 * Tek kayıt için karar. SIRA önemli: önce "zaten işlenmiş mi", sonra
 * "zamanı geldi mi", en son "kanıt var mı". Böylece rapordaki sebep, Kaan'ın
 * düzeltmesi gereken ŞEYİ söyler (ör. kanıtı eksik ama etkinliği daha
 * gelmemiş kayıt "kanıt yok" diye gürültü yapmaz).
 */
export function faturaKarari(s: FaturaSatiri, simdi: Date): FaturaKarari {
  if (s.tip !== 'Kayıt') return { tip: 'atla', sebep: 'tip-kayit-degil' };
  if (s.faturaNo.trim()) {
    return s.faturaMailiGitti ? { tip: 'atla', sebep: 'zaten-faturali' } : { tip: 'mail-tekrar' };
  }
  if (s.faturaHatasi.trim()) return { tip: 'atla', sebep: 'onceki-hata' };
  if (s.odemeDurumu !== 'Ödendi') return { tip: 'atla', sebep: 'odendi-degil' };
  if (s.etkinlikSayisi !== 1) return { tip: 'atla', sebep: 'etkinlik-belirsiz' };
  if (!/^\d{4}-\d{2}-\d{2}/.test(s.etkinlikTarihi)) return { tip: 'atla', sebep: 'etkinlik-tarihi-yok' };
  // Etkinliğin TR günü < bugünün TR günü → ertesi gün ya da sonrası.
  const son = /^\d{4}-\d{2}-\d{2}/.test(s.etkinlikBitis) ? s.etkinlikBitis : s.etkinlikTarihi;
  const etkinlikGunu = son.length === 10 ? son : trGun(new Date(son));
  if (!(etkinlikGunu < trGun(simdi))) return { tip: 'atla', sebep: 'etkinlik-bitmedi' };
  if (s.formatHam === 'Anadolu Yolculuğu') return { tip: 'atla', sebep: 'anadolu' };
  const toplam = faturaTutari(s);
  if (toplam === null) return { tip: 'atla', sebep: 'tutar-yok' };

  let yontem: 'kart' | 'havale';
  if (s.odemeYontemi === 'Kredi Kartı') {
    if (!s.islemNo.trim()) return { tip: 'atla', sebep: 'kanit-yok-kart' };
    yontem = 'kart';
  } else if (s.odemeYontemi === 'Havale') {
    if (!s.bankaIslemNo.trim()) return { tip: 'atla', sebep: 'kanit-yok-havale' };
    yontem = 'havale';
  } else {
    return { tip: 'atla', sebep: 'yontem-bilinmiyor' };
  }
  if (!/^\d{4}-\d{2}-\d{2}/.test(s.odemeTarihi)) return { tip: 'atla', sebep: 'odeme-tarihi-yok' };
  if (!s.kadin.trim()) return { tip: 'atla', sebep: 'ad-yok' };
  return { tip: 'kes', yontem, toplam };
}

/** İki ondalığa yuvarlama — kayan nokta artığı (0.1+0.2) faturaya girmesin. */
export function yuvarla2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

/**
 * KDV dahil toplam → matrah + KDV. `matrah + kdv === toplam` DAİMA (kuruşta):
 * KDV toplamdan çıkarılarak bulunur, ayrı yuvarlanmaz; yoksa 1 kuruşluk fark
 * Uyumsoft'ta toplam doğrulamasına takılırdı.
 */
export function kdvBol(toplam: number, oran = KDV_ORANI): { matrah: number; kdv: number; toplam: number } {
  const t = yuvarla2(toplam);
  const matrah = yuvarla2(t / (1 + oran / 100));
  const kdv = yuvarla2(t - matrah);
  return { matrah, kdv, toplam: t };
}

/**
 * `Kadın` alanı "Ad Soyad" birleşik tutuluyor (`kadinAdiBirlestir`,
 * `lib/kayit.ts`). Faturada `Person{FirstName, FamilyName}` ister:
 * son kelime soyad, gerisi ad. Tek kelimelik isimde soyad boş kalır.
 */
export function adSoyadBol(kadin: string): { ad: string; soyad: string } {
  const parcalar = kadin.trim().split(/\s+/).filter(Boolean);
  if (parcalar.length <= 1) return { ad: parcalar[0] ?? '', soyad: '' };
  return { ad: parcalar.slice(0, -1).join(' '), soyad: parcalar[parcalar.length - 1] };
}

/** "Açık Kapı - 19 Ekim - Katılım Bedeli" — Format olduğu gibi. */
export function satirAdi(formatHam: string, etkinlikTarihi: string): string {
  const ad = formatHam.trim();
  const gun = etkinlikTarihi.length > 10 ? trGun(new Date(etkinlikTarihi)) : etkinlikTarihi;
  const [, ay, g] = gun.split('-').map(Number);
  const tarih = ay && g ? `${g} ${AYLAR[ay - 1]}` : '';
  return [ad, tarih, 'Katılım Bedeli'].filter(Boolean).join(' - ');
}

/** Satıcı (AccountingSupplierParty). Ortama göre seçilir; uç `UYUMSOFT_ORTAM`'dan karar verir. */
export type Satici = {
  vkn: string;
  unvan: string;
  sokak: string;
  ilce: string;
  il: string;
  vergiDairesi: string;
};

/** Kaynak: YAP'ın canlı e-Faturası YEF2026000000008 (25.09.2026). */
export const SATICI_CANLI: Satici = {
  vkn: '9370693717',
  unvan: 'YAP EĞİTİM DANIŞMANLIK GIDA VE DIŞ TİCARET ANONİM ŞİRKETİ',
  sokak: 'Limanreis Mah. Hasan Ali Yücel Sok. 3',
  ilce: 'Narlıdere',
  il: 'İzmir',
  vergiDairesi: 'Balçova',
};

/** Uyumsoft'un ortak test firması — test ortamı satıcı olarak yalnız bunu kabul eder. */
export const SATICI_TEST: Satici = {
  vkn: '9000068418',
  unvan: 'Uyumsoft Bilgi Sistemleri ve Teknolojileri A.Ş.',
  sokak: 'YTÜ Davutpaşa Kampüsü',
  ilce: 'Esenler',
  il: 'İstanbul',
  vergiDairesi: 'Esenler',
};

export type FaturaGirdisi = {
  kayitId: string;
  kadin: string;
  sehir: string;
  email: string;
  formatHam: string;
  etkinlikTarihi: string;
  odemeTarihi: string;
  yontem: 'kart' | 'havale';
  toplam: number;
};

const v = <T>(value: T) => ({ value });
const para = (value: number) => ({ currencyId: 'TRY', value });

/**
 * Uyumsoft REST `SendInvoice` için `invoices[0]` öğesi.
 *
 * Biçim 30 Eki 2026'da test ortamında GEÇTİ (BOX2026000002408): `ProfileId
 * EARSIVFATURA` · `Scenario 0` (Automated — alıcı e-Fatura mükellefi değilse
 * e-Arşiv'e düşer) · fatura no YOK (OCK, e-Arşiv İnternet Satış'ın varsayılan
 * sayacı; yalnız önek göndermek seriyi SEÇMİYOR — ölçüldü) · alan yazımı
 * Uyumsoft örneğindeki `{ value }` / `currencyId` / `schemeId`.
 *
 * `LocalDocumentId` = Kayıt ID → Uyumsoft portalında "LocalDocumentId aktif"
 * işaretli; aynı kayda ikinci fatura reddedilir (mükerrer koruması).
 *
 * `Notification` YOK — fatura maili Resend'den gider (Kaan, 30 Eki).
 */
export function faturaGovdesi(g: FaturaGirdisi, satici: Satici, simdi: Date): Record<string, unknown> {
  const { matrah, kdv, toplam } = kdvBol(g.toplam);
  const { ad, soyad } = adSoyadBol(g.kadin);
  const tamAd = g.kadin.trim();
  const bugun = trGun(simdi);
  const saat = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Istanbul', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
  }).format(simdi);
  const kdvKategori = { TaxScheme: { Name: v('KDV'), TaxTypeCode: v('0015') } };

  const internetSatis: Record<string, unknown> = {
    WebAddress: SITE_ADRESI,
    PaymentType: g.yontem === 'kart' ? 'KREDIKARTI/BANKAKARTI' : 'EFT/HAVALE',
    PaymentDate: g.odemeTarihi.slice(0, 10),
  };
  if (g.yontem === 'kart') internetSatis.PaymentMidierName = ODEME_ARACISI_KART;

  return {
    LocalDocumentId: g.kayitId,
    Scenario: 0,
    TargetCustomer: { VknTckn: NIHAI_TUKETICI_TCKN, Title: tamAd },
    EArchiveInvoiceInfo: { DeliveryType: 'Electronic', InternetSalesInfo: internetSatis },
    Invoice: {
      UblVersionId: v('2.1'),
      CustomizationId: v('TR1.2'),
      ProfileId: v('EARSIVFATURA'),
      CopyIndicator: v(false),
      IssueDate: v(bugun),
      IssueTime: v(saat),
      InvoiceTypeCode: v('SATIS'),
      Note: [v(`Referans: ${g.kayitId}`)],
      DocumentCurrencyCode: v('TRY'),
      LineCountNumeric: v(1),
      // Referans kodu faturada (Kaan, 30 Eki) — sipariş numarası olarak.
      OrderReference: { Id: v(g.kayitId), IssueDate: v(g.odemeTarihi.slice(0, 10)) },
      AccountingSupplierParty: {
        Party: {
          PartyIdentification: [{ Id: { schemeId: 'VKN', value: satici.vkn } }],
          PartyName: { Name: v(satici.unvan) },
          PostalAddress: {
            StreetName: v(satici.sokak),
            CitySubdivisionName: v(satici.ilce),
            CityName: v(satici.il),
            Country: { Name: v('Türkiye') },
          },
          PartyTaxScheme: { TaxScheme: { Name: v(satici.vergiDairesi) } },
        },
      },
      AccountingCustomerParty: {
        Party: {
          PartyIdentification: [{ Id: { schemeId: 'TCKN', value: NIHAI_TUKETICI_TCKN } }],
          Person: { FirstName: v(ad), FamilyName: v(soyad) },
          PostalAddress: {
            CityName: v(g.sehir.trim()),
            Country: { Name: v('Türkiye') },
          },
          Contact: { ElectronicMail: v(g.email.trim()) },
        },
      },
      TaxTotal: [{
        TaxAmount: para(kdv),
        TaxSubtotal: [{
          TaxableAmount: para(matrah),
          TaxAmount: para(kdv),
          Percent: v(KDV_ORANI),
          TaxCategory: kdvKategori,
        }],
      }],
      LegalMonetaryTotal: {
        LineExtensionAmount: para(matrah),
        TaxExclusiveAmount: para(matrah),
        TaxInclusiveAmount: para(toplam),
        PayableAmount: para(toplam),
      },
      InvoiceLine: [{
        Id: v('1'),
        InvoicedQuantity: { unitCode: 'NIU', value: 1 },
        LineExtensionAmount: para(matrah),
        TaxTotal: {
          TaxAmount: para(kdv),
          TaxSubtotal: [{
            TaxableAmount: para(matrah),
            TaxAmount: para(kdv),
            Percent: v(KDV_ORANI),
            TaxCategory: kdvKategori,
          }],
        },
        Item: { Name: v(satirAdi(g.formatHam, g.etkinlikTarihi)) },
        Price: { PriceAmount: para(matrah) },
      }],
    },
  };
}
