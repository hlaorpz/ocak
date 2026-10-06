import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * N-Kolay sağlayıcısı — form POST akışı + dönüş doğrulaması.
 *
 * ── Neden "altın vektör" yok ──
 * N-Kolay'ın yayınladığı örnek yanıtların secret'ı yayınlanmamış; yani
 * "bilinen girdi → bilinen imza" çifti ÜRETİLEMİYOR. İmzanın sağlayıcıyla
 * uyuştuğu ancak test ortamında gerçek bir işlem koşularak kanıtlanır.
 * Bu suite'in ölçtüğü şey o değil: **formül dizisinin kurulumu** (alan sırası,
 * ayıraç, boş alanın yerinde durması) ve **kapıların koşulu**.
 *
 * ⚠ `import.meta.env` Vite tarafından BUILD ZAMANINDA sabitlenir; testte
 * `vi.stubEnv` ile değiştirilemez. Modül her senaryoda `vi.resetModules()` ile
 * TAZE import ediliyor — env sahtesi import'tan ÖNCE kurulmalı
 * (`payment-provider.test.ts`'in kurduğu desen).
 */

const SX = 'TEST-SX-273';
const SX_LIST = 'TEST-SX-LIST-273';
const SECRET = 'm3rch4nt-s3cr3t-K3y';
const BASE = 'https://paynkolaytest.nkolayislem.com.tr/Vpos';
/**
 * Dönüşte gelen `REFERENCE_CODE` — **N-Kolay'ın kendi numarası**, bizim
 * kodumuz DEĞİL. Ölçüldü 6 Eki 2026 (panel + canlı dönüş + PaymentList);
 * eski fixture burada `OCAK-7K2M-12345` taşıyordu ve o bir VARSAYIMDI (B201).
 */
const SAGLAYICI_REF = 'IKSIRPF341481127';

async function modulYukle(
  env: Partial<
    Record<
      'NKOLAY_SX' | 'NKOLAY_SX_LIST' | 'NKOLAY_MERCHANT_SECRET' | 'NKOLAY_BASE_URL',
      string
    >
  > = {},
) {
  vi.resetModules();
  vi.stubEnv('NKOLAY_SX', (env.NKOLAY_SX ?? SX) as any);
  // Listeleme ucunun AYRI kimliği — mutabakat köprüsünün ilk okuyucusu (B200).
  vi.stubEnv('NKOLAY_SX_LIST', (env.NKOLAY_SX_LIST ?? SX_LIST) as any);
  vi.stubEnv('NKOLAY_MERCHANT_SECRET', (env.NKOLAY_MERCHANT_SECRET ?? SECRET) as any);
  vi.stubEnv('NKOLAY_BASE_URL', (env.NKOLAY_BASE_URL ?? BASE) as any);
  return import('./payment-provider.ts');
}

const sha512b64 = (s: string) => createHash('sha512').update(s, 'utf8').digest('base64');

/** Sabit an — `rnd` ve sonek bundan türer, test belirlenimci kalsın. */
const AN = new Date('2026-09-11T12:34:56.789Z');

const FORM_GIRDI = {
  referansNo: 'OCAK-7K2M',
  tutar: 1234.56,
  basariUrl: 'https://www.ocak.biz/api/odeme-callback?pageId=abc&ref=OCAK-7K2M&sonuc=basari',
  hataUrl: 'https://www.ocak.biz/api/odeme-callback?pageId=abc&ref=OCAK-7K2M&sonuc=hata',
  istemciIp: '85.105.1.2',
  simdi: AN,
};

describe('nkolay — giden form alanları', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
    vi.resetModules();
  });

  it('on alan eksiksiz, adları birebir', async () => {
    const { nkolayPaymentProvider: p } = await modulYukle();
    const f = p.odemeFormu!(FORM_GIRDI);
    expect('alanlar' in f).toBe(true);
    if (!('alanlar' in f)) return;
    expect(Object.keys(f.alanlar).sort()).toEqual(
      [
        'amount',
        'cardHolderIP',
        'clientRefCode',
        'failUrl',
        'hashDataV2',
        'rnd',
        'successUrl',
        'sx',
        'transactionType',
        'use3D',
      ].sort(),
    );
    expect(f.alanlar.use3D).toBe('true');
    expect(f.alanlar.transactionType).toBe('SALES');
    expect(f.alanlar.cardHolderIP).toBe('85.105.1.2');
    expect(f.actionUrl).toBe(BASE);
  });

  it('amount NOKTA ayıraç, iki hane — kuruş korunur', async () => {
    const { nkolayPaymentProvider: p, nkolayTutar } = await modulYukle();
    const f = p.odemeFormu!({ ...FORM_GIRDI, tutar: 937.5 });
    if (!('alanlar' in f)) throw new Error('form üretilmedi');
    expect(f.alanlar.amount).toBe('937.50');
    // KARAR 240 kuruş koruması: virgül ayıraç imzayı sessizce bozardı.
    expect(nkolayTutar(1234.56)).toBe('1234.56');
    expect(nkolayTutar(1234.56)).not.toMatch(/,/);
    expect(nkolayTutar(0.01)).toBe('0.01');
  });

  it('rnd formatı DD-MM-YYYY HH:mm:ss', async () => {
    const { uretRnd } = await modulYukle();
    expect(uretRnd(AN)).toMatch(/^\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2}$/);
    // Europe/Istanbul (UTC+3): 12:34:56Z → 15:34:56
    expect(uretRnd(AN)).toBe('11-09-2026 15:34:56');
  });

  it('⚠ hash\'e giren rnd ile gövdedeki rnd BİREBİR aynı', async () => {
    // Bu turun en sessiz hata kaynağı: `rnd`yi iki kez üretmek. Saniye
    // sınırına denk gelirse imza "bazen" tutmaz ve teşhis edilemez.
    const { nkolayPaymentProvider: p, nkolayIstekHashDizesi } = await modulYukle();
    const f = p.odemeFormu!(FORM_GIRDI);
    if (!('alanlar' in f)) throw new Error('form üretilmedi');
    const beklenen = sha512b64(
      nkolayIstekHashDizesi({
        sx: SX,
        clientRefCode: f.alanlar.clientRefCode,
        amount: f.alanlar.amount,
        successUrl: f.alanlar.successUrl,
        failUrl: f.alanlar.failUrl,
        rnd: f.alanlar.rnd, // gövdedeki dizenin ta kendisi
        customerKey: '',
        merchantSecretKey: SECRET,
      }),
    );
    expect(f.alanlar.hashDataV2).toBe(beklenen);
  });

  it('istek formülü: sekiz alan, customerKey BOŞ ama ayıracı yerinde', async () => {
    const { nkolayIstekHashDizesi } = await modulYukle();
    const dize = nkolayIstekHashDizesi({
      sx: 'S',
      clientRefCode: 'R',
      amount: 'A',
      successUrl: 'SU',
      failUrl: 'FU',
      rnd: 'N',
      customerKey: '',
      merchantSecretKey: 'K',
    });
    expect(dize).toBe('S|R|A|SU|FU|N||K');
    // Boş alanı ATLAMAK diziyi kaydırır ve imzayı sessizce bozar.
    expect(dize.split('|')).toHaveLength(8);
    expect(dize).toContain('||');
  });

  // Başlığın önceki hâli "sonek ref'e/Notion'a SIZMAZ" idi — Kayıtlar'da
  // `Gönderilen Ref` alanı yokken doğruydu. Alan 15 Eyl'de açıldı (B202):
  // sonek `Kayıt ID`'ye ve `ref=`'e sızmaz, `Gönderilen Ref`'te bilerek yaşar.
  it('clientRefCode sonekli — sonek ref\'e SIZMAZ, `Gönderilen Ref`\'te yaşar', async () => {
    const { nkolayPaymentProvider: p, uretClientRefCode } = await modulYukle();
    const f = p.odemeFormu!(FORM_GIRDI);
    if (!('alanlar' in f)) throw new Error('form üretilmedi');
    expect(f.alanlar.clientRefCode).toBe(uretClientRefCode('OCAK-7K2M', AN));
    expect(f.alanlar.clientRefCode).toMatch(/^OCAK-7K2M-\d{5}$/);
    // ⚠ Kritik: dönüş URL'lerindeki `ref` SONEKSİZ. `equals` ile aranıyor
    // (`odeme-kayit-oku.ts`, `api/kayit.ts` refQuery) — sonek sızarsa
    // ödemesi alınmış kadın "bulunamadı" ekranı görür.
    expect(new URL(f.alanlar.successUrl).searchParams.get('ref')).toBe('OCAK-7K2M');
    expect(new URL(f.alanlar.failUrl).searchParams.get('ref')).toBe('OCAK-7K2M');
  });

  it('sonek zamanla DEĞİŞİR — aynı ref iki denemede ayırt edilir', async () => {
    const { uretClientRefCode } = await modulYukle();
    const a = uretClientRefCode('OCAK-7K2M', new Date(1_757_000_000_000));
    const b = uretClientRefCode('OCAK-7K2M', new Date(1_757_000_060_000));
    expect(a).not.toBe(b);
  });

  it('FAIL-CLOSED: env eksikse form ÜRETİLMEZ', async () => {
    for (const eksik of ['NKOLAY_SX', 'NKOLAY_MERCHANT_SECRET', 'NKOLAY_BASE_URL'] as const) {
      const { nkolayPaymentProvider: p } = await modulYukle({ [eksik]: '' });
      const f = p.odemeFormu!(FORM_GIRDI);
      expect(f, eksik).toHaveProperty('hata');
    }
  });

  it('FAIL-CLOSED: tutar 0/negatifse form ÜRETİLMEZ', async () => {
    const { nkolayPaymentProvider: p } = await modulYukle();
    expect(p.odemeFormu!({ ...FORM_GIRDI, tutar: 0 })).toHaveProperty('hata');
    expect(p.odemeFormu!({ ...FORM_GIRDI, tutar: -5 })).toHaveProperty('hata');
  });

  it('checkoutBaslat SÖZLEŞMEYİ korur — { redirectUrl }, kodId taşınır', async () => {
    const { nkolayPaymentProvider: p } = await modulYukle();
    const s = await p.checkoutBaslat({
      kayitId: 'uuid-1', referansNo: 'OCAK-7K2M', tutar: 100, paraBirimi: 'TRY',
      ad: 'A', email: 'a@b.c', basariUrl: 'https://x/ok', hataUrl: 'https://x/no',
      kodId: 'kod-uuid',
    });
    expect(s).toHaveProperty('redirectUrl');
    if (!('redirectUrl' in s)) return;
    const u = new URL(s.redirectUrl, 'https://www.ocak.biz');
    expect(u.pathname).toBe('/odeme/nkolay');
    expect(u.searchParams.get('ref')).toBe('OCAK-7K2M');
    // kodId taşınmazsa `kodKullanimArtir` hiç çağrılmaz — promo sayacı ölür.
    expect(u.searchParams.get('kodId')).toBe('kod-uuid');
    // Tutar URL'e GİRMEZ: sayfa onu Notion'dan okur.
    expect(s.redirectUrl).not.toMatch(/tutar/);
  });

  it('factory PAYMENT_PROVIDER=nkolay → nkolay sağlayıcısı', async () => {
    vi.resetModules();
    vi.stubEnv('PAYMENT_PROVIDER', 'nkolay');
    const { getPaymentProvider } = await import('./payment-provider.ts');
    expect(getPaymentProvider().ad).toBe('nkolay');
  });
});

describe('nkolay.dogrulaCallback — üç kapı, KOŞUL ölçülür (KARAR 573)', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
    vi.resetModules();
  });

  /** Geçerli bir dönüş gövdesi — istenen alan ezilebilir. */
  function yanit(ezme: Record<string, string | null> = {}): URLSearchParams {
    const temel: Record<string, string> = {
      MERCHANT_NO: '273',
      REFERENCE_CODE: SAGLAYICI_REF,
      AUTH_CODE: 'A1B2C3',
      RESPONSE_CODE: '2',
      USE_3D: 'true',
      // ⚠ Dönüşün RND'si istekte gönderdiğimizden FARKLIDIR.
      RND: '11-09-2026 15:35:10',
      INSTALLMENT: '0',
      AUTHORIZATION_AMOUNT: '1234.56',
      CURRENCY_CODE: '949',
    };
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries({ ...temel, ...ezme })) {
      if (v !== null) p.set(k, v);
    }
    const ham = [
      p.get('MERCHANT_NO') ?? '', p.get('REFERENCE_CODE') ?? '', p.get('AUTH_CODE') ?? '',
      p.get('RESPONSE_CODE') ?? '', p.get('USE_3D') ?? '', p.get('RND') ?? '',
      p.get('INSTALLMENT') ?? '', p.get('AUTHORIZATION_AMOUNT') ?? '',
      p.get('CURRENCY_CODE') ?? '', SECRET,
    ].join('|');
    p.set('hashDataV2', sha512b64(ham));
    return p;
  }

  const istek = () => new Request('https://www.ocak.biz/api/odeme-callback', { method: 'POST' });

  it('1 · imza + RESPONSE_CODE 2 + AUTH_CODE dolu → geçerli', async () => {
    const { nkolayPaymentProvider: p } = await modulYukle();
    expect(p.dogrulaCallback(istek(), yanit()).gecerli).toBe(true);
  });

  it('2 · imza tutmazsa reddeder', async () => {
    const { nkolayPaymentProvider: p } = await modulYukle();
    const g = yanit();
    g.set('hashDataV2', sha512b64('baska-bir-dize'));
    const s = p.dogrulaCallback(istek(), g);
    expect(s.gecerli).toBe(false);
    expect(s.sebep).toBe('hash-yanlis');
  });

  it('2b · imza tutmadığında ham dize log\'a basılır, SIR MASKELİ', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { nkolayPaymentProvider: p } = await modulYukle();
    const g = yanit();
    g.set('hashDataV2', 'yanlis');
    p.dogrulaCallback(istek(), g);
    const satir = String(warn.mock.calls.at(-1)?.[0] ?? '');
    expect(satir).toContain(SAGLAYICI_REF); // teşhis için ham alanlar görünür
    expect(satir).toContain('[SECRET]');
    expect(satir).not.toContain(SECRET); // ⚠ sır log'a DÜŞMEZ (CLAUDE.md §8)
  });

  it('2c · gövdedeki alan değişirse imza tutmaz (alan sırası/ayıraç kanıtı)', async () => {
    const { nkolayPaymentProvider: p } = await modulYukle();
    const g = yanit();
    g.set('AUTHORIZATION_AMOUNT', '1.00'); // imza eski tutara göre hesaplandı
    expect(p.dogrulaCallback(istek(), g).gecerli).toBe(false);
  });

  it('3 · RESPONSE_CODE ≠ "2" → reddeder (imza TUTSA BİLE)', async () => {
    const { nkolayPaymentProvider: p } = await modulYukle();
    for (const kod of ['0', '1', '00', '3', '']) {
      const s = p.dogrulaCallback(istek(), yanit({ RESPONSE_CODE: kod }));
      expect(s.gecerli, `RESPONSE_CODE=${kod}`).toBe(false);
      expect(s.sebep, `RESPONSE_CODE=${kod}`).toBe('response-code-basarisiz');
    }
  });

  it('4 · AUTH_CODE ∈ {"", "0", "00"} → reddeder (imza TUTSA BİLE)', async () => {
    const { nkolayPaymentProvider: p } = await modulYukle();
    for (const kod of ['', '0', '00']) {
      const s = p.dogrulaCallback(istek(), yanit({ AUTH_CODE: kod }));
      expect(s.gecerli, `AUTH_CODE="${kod}"`).toBe(false);
      expect(s.sebep, `AUTH_CODE="${kod}"`).toBe('auth-code-gecersiz');
    }
    // Kontrol grubu: "000" geçerli bir koddur, listede yok.
    expect(p.dogrulaCallback(istek(), yanit({ AUTH_CODE: '000' })).gecerli).toBe(true);
  });

  it('5 · CURRENCY_CODE HİÇ gelmezse boş dize sayılır, imza yine tutar', async () => {
    // Ölçülen sınır: sağlayıcı bazı dönüşlerde bu alanı göndermiyor.
    // Kural: POST'ta ne geldiyse o; gelmediyse boş — ayıraç yerinde durur.
    const { nkolayPaymentProvider: p } = await modulYukle();
    expect(p.dogrulaCallback(istek(), yanit({ CURRENCY_CODE: null })).gecerli).toBe(true);
  });

  it('6 · FAIL-CLOSED: secret tanımsızsa reddeder', async () => {
    const { nkolayPaymentProvider: p } = await modulYukle({ NKOLAY_MERCHANT_SECRET: '' });
    const s = p.dogrulaCallback(istek(), yanit());
    expect(s.gecerli).toBe(false);
    expect(s.sebep).toBe('nkolay-secret-tanimsiz');
  });

  it('7 · gövde yoksa / imza alanı boşsa reddeder', async () => {
    const { nkolayPaymentProvider: p } = await modulYukle();
    expect(p.dogrulaCallback(istek(), null).sebep).toBe('govde-yok');
    const g = yanit();
    g.delete('hashDataV2');
    expect(p.dogrulaCallback(istek(), g).sebep).toBe('hash-istekte-yok');
  });

  it('⚠ successUrl\'e düşmüş olmak BAŞARI DEĞİL — üç kapı da bağımsız', async () => {
    // Aynı gövde: imza doğru, ama iki kapıdan biri düşüyor.
    const { nkolayPaymentProvider: p } = await modulYukle();
    expect(p.dogrulaCallback(istek(), yanit({ RESPONSE_CODE: '2', AUTH_CODE: '00' })).gecerli).toBe(false);
    expect(p.dogrulaCallback(istek(), yanit({ RESPONSE_CODE: '0', AUTH_CODE: 'A1' })).gecerli).toBe(false);
  });
});

describe('nkolay — kimlik: biçim kapısı ve mutabakat köprüsü (6 Eki 2026)', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
    vi.resetModules();
  });

  const istek2 = () => new Request('https://www.ocak.biz/api/odeme-callback', { method: 'POST' });

  function yanit2(ezme: Record<string, string | null> = {}): URLSearchParams {
    const temel: Record<string, string> = {
      MERCHANT_NO: '273',
      REFERENCE_CODE: SAGLAYICI_REF,
      AUTH_CODE: 'A1B2C3',
      RESPONSE_CODE: '2',
      USE_3D: 'true',
      RND: '11-09-2026 15:35:10',
      INSTALLMENT: '0',
      AUTHORIZATION_AMOUNT: '1234.56',
      CURRENCY_CODE: '949',
    };
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries({ ...temel, ...ezme })) if (v !== null) p.set(k, v);
    const ham = [
      'MERCHANT_NO', 'REFERENCE_CODE', 'AUTH_CODE', 'RESPONSE_CODE', 'USE_3D',
      'RND', 'INSTALLMENT', 'AUTHORIZATION_AMOUNT', 'CURRENCY_CODE',
    ].map((a) => p.get(a) ?? '').concat(SECRET).join('|');
    p.set('hashDataV2', sha512b64(ham));
    return p;
  }

  it('dönüş BİZİM kodumuzu taşımıyor — `referansKodu` BOŞ, `saglayiciReferansi` DOLU', async () => {
    // Zincirin kalbi: sağlayıcı kaydı çözemiyor, yalnız kendi numarasını
    // veriyor. Buraya bir `referansKodu` yazmak KARAR 593'ü çiğnemek olurdu.
    const { nkolayPaymentProvider: p } = await modulYukle();
    const s = p.dogrulaCallback(istek2(), yanit2());
    expect(s.gecerli).toBe(true);
    expect(s.saglayiciReferansi).toBe(SAGLAYICI_REF);
    expect(s.referansKodu).toBeUndefined();
    // Replay kilidi N-Kolay'ın numarasını taşır (B202'nin öngördüğü kullanım).
    expect(s.islemNo).toBe(SAGLAYICI_REF);
  });

  it('biçim kapısı ÖNEK ÇİVİLEMEZ — `IKSIRPF` dışı referanslar da geçer', async () => {
    // ⚠ Bu testin işi bir regresyonu önlemek: tek örnekten `^IKSIRPF\d+$`
    // çıkarmak B201'in hatasını tekrar etmek olurdu. Önek terminale/üye
    // işyerine bağlı olabilir; doküman repoda yok.
    const { nkolayPaymentProvider: p } = await modulYukle();
    for (const ref of ['ABCDEFG123456789', 'XYZ-99-001', 'nkolay_ref.42', '123456']) {
      const s = p.dogrulaCallback(istek2(), yanit2({ REFERENCE_CODE: ref }));
      expect(s.gecerli, ref).toBe(true);
      expect(s.saglayiciReferansi, ref).toBe(ref);
    }
  });

  it('biçim kapısı boş/kısa/yasak-karakter referansı REDDEDER', async () => {
    const { nkolayPaymentProvider: p } = await modulYukle();
    for (const ref of ['', 'abcde', 'IKSIRPF 341481127', 'a'.repeat(65), 'ref;drop']) {
      const s = p.dogrulaCallback(istek2(), yanit2({ REFERENCE_CODE: ref }));
      expect(s.gecerli, JSON.stringify(ref)).toBe(false);
      expect(s.sebep, JSON.stringify(ref)).toBe('referans-bicimi-tutmadi');
    }
  });

  it('red satırı DEĞER basmaz, alan adlarını basar', async () => {
    const uyari = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { nkolayPaymentProvider: p } = await modulYukle();
    p.dogrulaCallback(istek2(), yanit2({ REFERENCE_CODE: '' }));
    const satir = String(uyari.mock.calls.at(-1)?.[0] ?? '');
    expect(satir).toContain('ALAN ADLARI');
    expect(satir).toContain('hashDataV2');     // ad listesi
    expect(satir).not.toContain(SECRET);        // sır log'a DÜŞMEZ
  });

  // ── Mutabakat köprüsü ──

  function paymentListYanit(
    satirlar: Array<{ ref?: string; client?: string; status?: string; tip?: string }> = [{}],
  ): string {
    const LIST = satirlar.map((s) => ({
      REFERENCE_CODE: s.ref ?? SAGLAYICI_REF,
      CLIENT_REFERENCE_CODE: s.client ?? 'OCAK-7K2M-12345',
      STATUS: s.status ?? 'SUCCESS',
      TRANSACTION_TYPE: s.tip ?? 'SALES',
    }));
    return JSON.stringify({ result: JSON.stringify({ RESPONSE_CODE: 1, LIST }) });
  }

  it('köprü eşleşen SALES+SUCCESS satırından clientRefCode döndürür', async () => {
    const f = vi.fn(async () => new Response(paymentListYanit(), { status: 200 }));
    vi.stubGlobal('fetch', f);
    const { nkolayPaymentProvider: p } = await modulYukle();
    const s = await p.mutabakatSorgula!({ saglayiciReferansi: SAGLAYICI_REF, simdi: AN });
    expect(s).toEqual({ clientRefCode: 'OCAK-7K2M-12345' });
  });

  it('köprü hash dizesini sx LIST + DD.MM.YYYY ile kurar (ölçülen sözleşme)', async () => {
    const f = vi.fn(async () => new Response(paymentListYanit(), { status: 200 }));
    vi.stubGlobal('fetch', f);
    const mod = await modulYukle();
    await mod.nkolayPaymentProvider.mutabakatSorgula!({
      saglayiciReferansi: SAGLAYICI_REF,
      simdi: AN,
    });
    const g = (f.mock.calls[0] as any)[1].body as URLSearchParams;
    // Pencere: dün + bugün, Europe/Istanbul. AN = 11 Eyl 2026 15:34 TR.
    expect(g.get('startDate')).toBe('10.09.2026');
    expect(g.get('endDate')).toBe('11.09.2026');
    // Hash: SX_LIST ile — satış `sx`'i DEĞİL. Ayıraç boş alanda da yerinde.
    const beklenen = sha512b64(`${SX_LIST}|10.09.2026|11.09.2026||${SECRET}`);
    expect(g.get('hashDataV2')).toBe(beklenen);
    expect(g.get('sx')).toBe(SX_LIST);
    expect(g.get('sx')).not.toBe(SX);
  });

  it('köprü CANCEL ve STATUS≠SUCCESS satırını ödeme SAYMAZ', async () => {
    for (const ezme of [{ tip: 'CANCEL' }, { status: 'ERROR' }, { tip: 'REFUND' }]) {
      vi.stubGlobal('fetch', vi.fn(async () => new Response(paymentListYanit([ezme]), { status: 200 })));
      const { nkolayPaymentProvider: p } = await modulYukle();
      const s = await p.mutabakatSorgula!({ saglayiciReferansi: SAGLAYICI_REF, simdi: AN });
      expect(s, JSON.stringify(ezme)).toHaveProperty('hata');
    }
  });

  it('köprü FAIL-CLOSED: env eksik · HTTP hatası · ağ hatası · bozuk gövde', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(paymentListYanit(), { status: 200 })));
    const bosList = await modulYukle({ NKOLAY_SX_LIST: '' });
    expect(
      await bosList.nkolayPaymentProvider.mutabakatSorgula!({
        saglayiciReferansi: SAGLAYICI_REF, simdi: AN,
      }),
    ).toEqual({ hata: 'NKOLAY_SX_LIST tanımsız' });

    vi.stubGlobal('fetch', vi.fn(async () => new Response('', { status: 503 })));
    const m1 = await modulYukle();
    expect(
      await m1.nkolayPaymentProvider.mutabakatSorgula!({ saglayiciReferansi: SAGLAYICI_REF, simdi: AN }),
    ).toHaveProperty('hata');

    vi.stubGlobal('fetch', vi.fn(async () => { throw new Error('ağ'); }));
    const m2 = await modulYukle();
    expect(
      await m2.nkolayPaymentProvider.mutabakatSorgula!({ saglayiciReferansi: SAGLAYICI_REF, simdi: AN }),
    ).toHaveProperty('hata');

    vi.stubGlobal('fetch', vi.fn(async () => new Response('json değil', { status: 200 })));
    const m3 = await modulYukle();
    expect(
      await m3.nkolayPaymentProvider.mutabakatSorgula!({ saglayiciReferansi: SAGLAYICI_REF, simdi: AN }),
    ).toHaveProperty('hata');
  });

  it('köprü boş sağlayıcı referansıyla ağa HİÇ çıkmaz', async () => {
    const f = vi.fn(async () => new Response(paymentListYanit(), { status: 200 }));
    vi.stubGlobal('fetch', f);
    const { nkolayPaymentProvider: p } = await modulYukle();
    const s = await p.mutabakatSorgula!({ saglayiciReferansi: '   ', simdi: AN });
    expect(s).toHaveProperty('hata');
    expect(f).not.toHaveBeenCalled();
  });

  it('`mock` sağlayıcıda köprü YOK — ihtiyacı da yok', async () => {
    const mod = await modulYukle();
    expect(mod.mockPaymentProvider.mutabakatSorgula).toBeUndefined();
  });
});

describe('kaynak disiplini — route ve sözleşme korundu', () => {
  const kok = join(__dirname, '..', '..');
  const oku = (...p: string[]) => readFileSync(join(kok, ...p), 'utf-8');
  const kodu = (k: string) =>
    k.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');

  it('/api/odeme-callback DEĞİŞMEDİ — sağlayıcı adına dallanmıyor (KARAR 395)', () => {
    const K = kodu(oku('src', 'pages', 'api', 'odeme-callback.ts'));
    expect(K).toMatch(/getPaymentProvider\(\)\.dogrulaCallback\(/);
    for (const ad of ['nkolay', 'iyzico', 'paytr', 'mock']) {
      expect(K.toLowerCase()).not.toMatch(new RegExp(`===\\s*['"\`]${ad}['"\`]`));
    }
  });

  it('checkoutUrl sözleşmesi korundu — api.ts ve KayitFormu dokunulmadı', () => {
    expect(oku('src', 'lib', 'api.ts')).toMatch(/checkoutUrl\?: string;/);
    expect(oku('src', 'components', 'KayitFormu.astro')).toMatch(
      /window\.location\.href = result\.checkoutUrl;/,
    );
  });

  it('/odeme/nkolay: prerender false + KART_AKISI muhafızının KOŞULU', () => {
    const S = kodu(oku('src', 'pages', 'odeme', 'nkolay.astro'));
    expect(S).toMatch(/export const prerender = false;/);
    // Koşul ölçülür, varlık değil: `{false && …}` ya da `&&`li bir gate
    // suite'i yeşil bırakırdı (KARAR 567 vakası).
    expect(S).toMatch(/if \(!KART_AKISI_ACIK\) return new Response\(null, \{ status: 404 \}\);/);
    expect(S).not.toMatch(/if \([^)]*&&\s*!KART_AKISI_ACIK\)/);
  });

  it('/odeme/nkolay tutarı QUERY\'den okumaz', () => {
    const S = kodu(oku('src', 'pages', 'odeme', 'nkolay.astro'));
    // Query'den okunan tek şey ref ve kodId.
    const okunanlar = [...S.matchAll(/searchParams\.get\('([^']+)'\)/g)].map((m) => m[1]);
    expect(okunanlar.sort()).toEqual(['kodId', 'ref']);
    expect(S).toMatch(/kayit\.tutar/);
  });

  it('sır dokümanda yaşamıyor — .env.example beş anahtarı DEĞERSİZ taşır', () => {
    const E = oku('.env.example');
    for (const a of [
      'NKOLAY_SX', 'NKOLAY_SX_LIST', 'NKOLAY_SX_IPTAL',
      'NKOLAY_MERCHANT_SECRET', 'NKOLAY_BASE_URL',
    ]) {
      expect(E, a).toMatch(new RegExp(`^${a}=\\s*$`, 'm'));
    }
  });
});
