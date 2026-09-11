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
const SECRET = 'm3rch4nt-s3cr3t-K3y';
const BASE = 'https://paynkolaytest.nkolayislem.com.tr/Vpos';

async function modulYukle(
  env: Partial<Record<'NKOLAY_SX' | 'NKOLAY_MERCHANT_SECRET' | 'NKOLAY_BASE_URL', string>> = {},
) {
  vi.resetModules();
  vi.stubEnv('NKOLAY_SX', (env.NKOLAY_SX ?? SX) as any);
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

  it('clientRefCode sonekli — ama sonek ref\'e/Notion\'a SIZMAZ', async () => {
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
      REFERENCE_CODE: 'OCAK-7K2M-12345',
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
    expect(satir).toContain('OCAK-7K2M-12345'); // teşhis için ham alanlar görünür
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
