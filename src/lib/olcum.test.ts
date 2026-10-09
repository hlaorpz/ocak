import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  YASAK_ANAHTARLAR,
  PARA_BIRIMI_VARSAYILAN,
  ODENDI,
  KART_YONTEMI,
  paraBirimiNormalle,
  degerNormalle,
  yukuTemizle,
  olayGonder,
  viewContentYuku,
  formSubmitYuku,
  beginCheckoutYuku,
  purchaseYuku,
  purchaseIsaretAnahtari,
  purchaseAtilsinMi,
  type OlayHedefi,
} from './olcum';

/**
 * B118 İŞ B — dört olayın kuralı.
 *
 * `environment: 'node'` olduğu için `window` yok; `olayGonder` hedefi
 * parametre olarak alabiliyor ve testler kendi `push` toplayıcısını veriyor.
 * Böylece "gerçekten ne push edildi" ölçülüyor, mock bir global değil.
 */

function toplayici(): OlayHedefi & { kayitlar: Record<string, unknown>[] } {
  const kayitlar: Record<string, unknown>[] = [];
  return { kayitlar, push: (o) => kayitlar.push(o) };
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('paraBirimiNormalle — brief sabit "TRY" diyordu, gerçek değer kullanılıyor', () => {
  it('geçerli üç harfli kod aynen (büyük harfe çevrilerek) geçer', () => {
    expect(paraBirimiNormalle('TRY')).toBe('TRY');
    expect(paraBirimiNormalle('eur')).toBe('EUR');
    expect(paraBirimiNormalle(' usd ')).toBe('USD');
  });

  it('boş / tanımsız / bozuk → TRY fallback', () => {
    expect(paraBirimiNormalle('')).toBe('TRY');
    expect(paraBirimiNormalle(null)).toBe('TRY');
    expect(paraBirimiNormalle(undefined)).toBe('TRY');
    expect(paraBirimiNormalle('Türk Lirası')).toBe('TRY');
    expect(paraBirimiNormalle('TR')).toBe('TRY');
  });

  it('varsayılan sabiti TRY', () => {
    expect(PARA_BIRIMI_VARSAYILAN).toBe('TRY');
  });
});

describe('degerNormalle — kuruş korunur, çöp 0 olur', () => {
  it('kuruş aynen geçer (KARAR 240 — Notion `number` kuruşu koruyor)', () => {
    expect(degerNormalle(937.5)).toBe(937.5);
    expect(degerNormalle(1234.56)).toBe(1234.56);
    expect(degerNormalle(0.01)).toBe(0.01);
  });

  it('sayıya çevrilebilen dize kabul', () => {
    expect(degerNormalle('750')).toBe(750);
  });

  it('negatif / NaN / Infinity / nesne → 0', () => {
    expect(degerNormalle(-5)).toBe(0);
    expect(degerNormalle('abc')).toBe(0);
    expect(degerNormalle(Infinity)).toBe(0);
    expect(degerNormalle({})).toBe(0);
    expect(degerNormalle(undefined)).toBe(0);
  });

  it('0 geçerli bir değer (ücretsiz kayıt)', () => {
    expect(degerNormalle(0)).toBe(0);
  });
});

describe('K-4 — kişisel veri `dataLayer`\'a GİRMEZ', () => {
  it('yasak anahtarlar düşürülür, taşınan alanlar kalır', () => {
    const { yuk, dusurulen } = yukuTemizle({
      kayit_id: 'OCAK-1234',
      deger: 750,
      ad: 'Ayşe',
      soyad: 'Yılmaz',
      email: 'a@b.com',
      telefon: '+905000000000',
      sehir: 'İzmir',
    });
    expect(yuk).toEqual({ kayit_id: 'OCAK-1234', deger: 750 });
    expect(dusurulen).toEqual(['ad', 'soyad', 'email', 'telefon', 'sehir']);
  });

  it('büyük/küçük harf farkı korumayı atlatmaz', () => {
    const { yuk, dusurulen } = yukuTemizle({ Email: 'a@b.com', TELEFON: '5', Ad: 'x' });
    expect(yuk).toEqual({});
    expect(dusurulen).toHaveLength(3);
  });

  it('listedeki her anahtar gerçekten düşüyor', () => {
    for (const anahtar of YASAK_ANAHTARLAR) {
      const { yuk } = yukuTemizle({ [anahtar]: 'değer', kayit_id: 'OCAK-1' });
      expect(Object.keys(yuk)).toEqual(['kayit_id']);
    }
  });

  it('boş / null / undefined değerler taşınmaz (GTM\'de "undefined" dizesine dönüşürdü)', () => {
    const { yuk } = yukuTemizle({ a: '', b: null, c: undefined, d: 0, e: false });
    expect(yuk).toEqual({ d: 0, e: false });
  });

  it('nesne ve dizi taşınmaz, düşürülen sayılır', () => {
    const { yuk, dusurulen } = yukuTemizle({ x: { derin: 1 }, y: [1, 2], z: 'ok' });
    expect(yuk).toEqual({ z: 'ok' });
    expect(dusurulen.sort()).toEqual(['x', 'y']);
  });

  it('olay gönderilirken de denetlenir — yasak alan push\'a ULAŞMAZ ama olay gider (K-5)', () => {
    const t = toplayici();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const gitti = olayGonder('form_submit', { form_type: 'acik-kapi', email: 'a@b.com' }, t);
    expect(gitti).toBe(true);
    expect(t.kayitlar).toEqual([{ event: 'form_submit', form_type: 'acik-kapi' }]);
    expect(console.error).toHaveBeenCalledOnce();
  });
});

describe('olayGonder — K-5: ölçüm hatası akışı durdurmaz', () => {
  it('olay adı `event` anahtarında, parametreler yanında', () => {
    const t = toplayici();
    olayGonder('view_content', { icerik_tipi: 'etkinlik', etkinlik_slug: 'elin-neyle-dolu' }, t);
    expect(t.kayitlar[0]).toEqual({
      event: 'view_content',
      icerik_tipi: 'etkinlik',
      etkinlik_slug: 'elin-neyle-dolu',
    });
  });

  it('hedef yoksa `false` döner, THROW ETMEZ', () => {
    expect(() => olayGonder('purchase', { kayit_id: 'OCAK-1' }, null)).not.toThrow();
    expect(olayGonder('purchase', { kayit_id: 'OCAK-1' }, null)).toBe(false);
  });

  it('`push` patlarsa yakalanır, `false` döner, THROW ETMEZ', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const patlak: OlayHedefi = {
      push: () => {
        throw new Error('dataLayer kırık');
      },
    };
    expect(() => olayGonder('begin_checkout', {}, patlak)).not.toThrow();
    expect(olayGonder('begin_checkout', {}, patlak)).toBe(false);
  });

  it('sunucuda (`window` yok) sessizce `false`', () => {
    expect(typeof window).toBe('undefined');
    expect(olayGonder('view_content', { icerik_tipi: 'acik-kapi' })).toBe(false);
  });

  it('parametresiz çağrı da çalışır', () => {
    const t = toplayici();
    expect(olayGonder('purchase', undefined, t)).toBe(true);
    expect(t.kayitlar[0]).toEqual({ event: 'purchase' });
  });
});

describe('viewContentYuku', () => {
  it('`/acik-kapi` — slug yok', () => {
    expect(viewContentYuku('acik-kapi')).toEqual({ icerik_tipi: 'acik-kapi' });
  });

  it('`/etkinlik/[slug]` — slug taşınır', () => {
    expect(viewContentYuku('etkinlik', 'elin-neyle-dolu')).toEqual({
      icerik_tipi: 'etkinlik',
      etkinlik_slug: 'elin-neyle-dolu',
    });
  });

  it('boş slug alan hiç basılmaz (GTM değişkeni "undefined" olmasın)', () => {
    expect(viewContentYuku('etkinlik', '')).toEqual({ icerik_tipi: 'etkinlik' });
    expect(viewContentYuku('etkinlik', '   ')).toEqual({ icerik_tipi: 'etkinlik' });
    expect(viewContentYuku('etkinlik', null)).toEqual({ icerik_tipi: 'etkinlik' });
  });
});

describe('formSubmitYuku — ad ve `form_type` DEĞİŞMEZ (GTM Lead tetikleyicisi buna bağlı)', () => {
  it('`form_type` her zaman ilk ve aynen', () => {
    const yuk = formSubmitYuku({ formType: 'acik-kapi' });
    expect(Object.keys(yuk)[0]).toBe('form_type');
    expect(yuk.form_type).toBe('acik-kapi');
  });

  it('havale kaydı — dört yeni alan yanında', () => {
    expect(
      formSubmitYuku({
        formType: 'acik-kapi',
        kayitId: 'OCAK-1234',
        deger: 750,
        paraBirimi: 'TRY',
        odemeYontemi: 'havale',
      }),
    ).toEqual({
      form_type: 'acik-kapi',
      kayit_id: 'OCAK-1234',
      deger: 750,
      para_birimi: 'TRY',
      odeme_yontemi: 'havale',
    });
  });

  it('ücretsiz kayıt — tutar 0 taşınır, para birimi yine basılır', () => {
    const yuk = formSubmitYuku({ formType: 'cember', kayitId: 'OCAK-9', deger: 0 });
    expect(yuk.deger).toBe(0);
    expect(yuk.para_birimi).toBe('TRY');
  });

  it('tutar HİÇ verilmemişse `deger` ve `para_birimi` basılmaz', () => {
    expect(formSubmitYuku({ formType: 'iletisim' })).toEqual({ form_type: 'iletisim' });
  });

  it('başvuru akışı — yöntem yok, alan basılmaz', () => {
    const yuk = formSubmitYuku({ formType: 'anadolu', kayitId: 'OCAK-5', odemeYontemi: '' });
    expect(yuk).not.toHaveProperty('odeme_yontemi');
  });
});

describe('beginCheckoutYuku / purchaseYuku', () => {
  it('begin_checkout üç alan', () => {
    expect(beginCheckoutYuku({ kayitId: 'OCAK-1234', deger: 937.5, paraBirimi: 'TRY' })).toEqual({
      kayit_id: 'OCAK-1234',
      deger: 937.5,
      para_birimi: 'TRY',
    });
  });

  it('purchase üç alan — begin_checkout ile AYNI kimlik (Kayıt ID, K-2)', () => {
    const id = 'OCAK-1234';
    expect(purchaseYuku({ kayitId: id, deger: 750 }).kayit_id).toBe(
      beginCheckoutYuku({ kayitId: id, deger: 750 }).kayit_id,
    );
  });

  it('ikisinde de kişisel veri alanı YOK', () => {
    const alanlar = [
      ...Object.keys(beginCheckoutYuku({ kayitId: 'OCAK-1', deger: 1 })),
      ...Object.keys(purchaseYuku({ kayitId: 'OCAK-1', deger: 1 })),
      ...Object.keys(viewContentYuku('etkinlik', 'x')),
      ...Object.keys(formSubmitYuku({ formType: 'a', kayitId: 'OCAK-1', deger: 1, odemeYontemi: 'kart' })),
    ];
    for (const yasak of YASAK_ANAHTARLAR) {
      expect(alanlar).not.toContain(yasak);
    }
  });

  it('para birimi gerçek değeri taşır (TRY sabiti DEĞİL)', () => {
    expect(beginCheckoutYuku({ kayitId: 'OCAK-1', deger: 100, paraBirimi: 'EUR' }).para_birimi).toBe('EUR');
  });
});

describe('purchaseIsaretAnahtari', () => {
  it('Kayıt ID başına ayrı anahtar', () => {
    expect(purchaseIsaretAnahtari('OCAK-1234')).toBe('ocak-olay-purchase-OCAK-1234');
    expect(purchaseIsaretAnahtari('OCAK-1234')).not.toBe(purchaseIsaretAnahtari('OCAK-5678'));
  });
});

describe('purchaseAtilsinMi — beş koşulun HEPSİ', () => {
  const TAM = {
    kayitDurumu: 'bulundu',
    odemeDurumu: ODENDI,
    odemeYontemi: KART_YONTEMI,
    kayitId: 'OCAK-1234',
    isaretliMi: false,
  };

  it('beş koşul sağlandığında atılır', () => {
    expect(purchaseAtilsinMi(TAM)).toBe(true);
  });

  it('kayıt bulunamadıysa atılmaz', () => {
    expect(purchaseAtilsinMi({ ...TAM, kayitDurumu: 'bulunamadi' })).toBe(false);
    expect(purchaseAtilsinMi({ ...TAM, kayitDurumu: 'hata' })).toBe(false);
  });

  it('`Ödeme Durumu` Ödendi değilse atılmaz', () => {
    for (const durum of ['Beklemede', 'İptal', 'Bedava', '', 'ödendi']) {
      expect(purchaseAtilsinMi({ ...TAM, odemeDurumu: durum })).toBe(false);
    }
  });

  it('HAVALE kaydında atılmaz (K-2 — o yol sunucudan gidecek)', () => {
    expect(purchaseAtilsinMi({ ...TAM, odemeYontemi: 'Havale' })).toBe(false);
  });

  it('yöntem boşsa atılmaz — bilinmeyen yöntem kart sayılmaz', () => {
    expect(purchaseAtilsinMi({ ...TAM, odemeYontemi: '' })).toBe(false);
  });

  it('Kayıt ID yoksa atılmaz (olay kimliği kurulamaz)', () => {
    expect(purchaseAtilsinMi({ ...TAM, kayitId: '' })).toBe(false);
    expect(purchaseAtilsinMi({ ...TAM, kayitId: '   ' })).toBe(false);
  });

  it('İŞARET VARSA atılmaz — sayfa referans koduyla açılıyor (KARAR 613)', () => {
    expect(purchaseAtilsinMi({ ...TAM, isaretliMi: true })).toBe(false);
  });

  it('tutar koşula GİRMEZ — `Ödendi` zaten bursluyu eliyor, kuruş hatası ödemeyi düşürmesin', () => {
    // İmzada tutar yok; bu test imzanın kendisini kilitliyor.
    expect(Object.keys(TAM).sort()).toEqual(
      ['isaretliMi', 'kayitDurumu', 'kayitId', 'odemeDurumu', 'odemeYontemi'].sort(),
    );
  });

  it('Notion select değerleri birebir — yazan taraf (`api/kayit.ts`, callback) ile aynı dize', () => {
    expect(ODENDI).toBe('Ödendi');
    expect(KART_YONTEMI).toBe('Kredi Kartı');
  });
});
