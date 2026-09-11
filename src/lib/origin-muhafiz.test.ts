import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  istekOrigini,
  originMuhafizSebebi,
  originMuhafizi,
} from './origin-muhafiz.ts';

/**
 * `origin-muhafiz.ts` — Astro'nun `checkOrigin` muhafızının kendi kodumuzdaki
 * karşılığı.
 *
 * ── Bu suite'in KARAR 573 duruşu ──
 * Muhafızın VARLIĞI ölçülmez, KOŞULU ölçülür. Ölçüm iki katmanlı ve birinci
 * katman **davranışsal**: dört route `import` edilip `POST` gerçek bir
 * `Request` ile ÇAĞRILIR. Yani `if (false && originRet)` gibi bir devre dışı
 * bırakma testi KIRMIZI yakar — payment-provider turunda (KARAR 567) sıra
 * ölçümünü yeşil bırakan tuzak burada kapalı.
 *
 * İkinci katman kaynak-grep'i; davranışın yakalayamadığı tek şeyi ölçer:
 * `checkOrigin: false` bayrağı ile üç route'un muhafızı arasındaki BAĞ.
 * Bayrak açık kalıp muhafız silinirse endpoint'ler çıplak kalır, davranışsal
 * test bunu (config'i okumadığı için) fark etmez.
 *
 * ⚠ Route'lar Notion/MailerLite/Resend istemcisi import ediyor ama testlerin
 * hiçbiri ağa çıkmıyor: muhafız 403'ü gövde okunmadan döner, geçerli origin
 * hâlinde de istek gövde VALİDASYONUNDA (400) durur — I/O'ya varmadan.
 */

const BIZ = 'https://www.ocak.biz';
const YABANCI = 'https://evil.example';

/** Muhafızın ölçtüğü tek şey header'lar; gövde hep aynı olabilir. */
function istek(
  headers: Record<string, string>,
  url = `${BIZ}/api/promo-dogrula`,
): Request {
  return new Request(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...headers },
    body: '{}',
  });
}

describe('originMuhafizi — üç temel hâl (KARAR 573: koşul ölçülür)', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('1 · yabancı origin → 403', () => {
    const r = originMuhafizi(istek({ origin: YABANCI }));
    expect(r).not.toBeNull();
    expect(r!.status).toBe(403);
  });

  it('2 · kendi origin → geçer (null döner, route devam eder)', () => {
    expect(originMuhafizi(istek({ origin: BIZ }))).toBeNull();
  });

  it('3 · Origin header YOK (ve Referer yok) → 403', () => {
    const r = originMuhafizi(istek({}));
    expect(r).not.toBeNull();
    expect(r!.status).toBe(403);
    expect(originMuhafizSebebi(istek({}))).toBe('origin-yok');
  });

  it('403 gövdesi sebep SIZDIRMAZ', async () => {
    // `odeme-callback.ts:170-173`'ün 401 disiplininin aynısı: çağırana
    // "origin mi yanlış, hiç mi yok" demek yön göstermek olur.
    const r = originMuhafizi(istek({ origin: YABANCI }))!;
    const govde = await r.text();
    expect(govde).not.toMatch(/origin-yok|origin-uyusmuyor/);
  });

  it('sebep yalnız log\'a düşer', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    originMuhafizi(istek({ origin: YABANCI }));
    expect(warn).toHaveBeenCalledTimes(1);
    expect(String(warn.mock.calls[0][0])).toMatch(/origin-uyusmuyor/);
  });
});

describe('originMuhafizi — Origin otoriter, Referer yalnız yedek', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('Origin yok + Referer kendi sitemiz → geçer', () => {
    expect(originMuhafizi(istek({ referer: `${BIZ}/cember/kayit` }))).toBeNull();
  });

  it('Origin yok + Referer yabancı → 403', () => {
    expect(originMuhafizi(istek({ referer: `${YABANCI}/tuzak` }))!.status).toBe(403);
  });

  it('⚠ Origin YABANCI + Referer kendi sitemiz → 403 (Referer kurtarmaz)', () => {
    // İki header'ı "biri tutarsa geçer" diye OR'lamak saldırgana iki
    // denemeden ucuz olanı seçme hakkı verirdi. Origin varsa karar onun.
    const r = originMuhafizi(istek({ origin: YABANCI, referer: `${BIZ}/cember/kayit` }));
    expect(r).not.toBeNull();
    expect(r!.status).toBe(403);
  });

  it('bozuk Referer "header yok"a katlanmaz — ayrı sebep, yine 403', () => {
    expect(istekOrigini(istek({ referer: 'bu-bir-url-degil' }))).toBe('bu-bir-url-degil');
    expect(originMuhafizSebebi(istek({ referer: 'bu-bir-url-degil' }))).toBe(
      'origin-uyusmuyor',
    );
  });

  it('opaque `null` origin (sandbox iframe) → 403', () => {
    expect(originMuhafizi(istek({ origin: 'null' }))!.status).toBe(403);
  });
});

describe('originMuhafizi — Vercel proxy (publicOrigin Bulgu 1 regresyonu)', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  /**
   * Vercel'de `request.url` internal runtime host'u gösterir; gerçek origin
   * `x-forwarded-*`ta yaşar (`public-origin.ts`). Muhafız `request.url`'e
   * bakarsa production'da HER isteği reddeder — kayıt formu tamamen ölür.
   */
  it('internal request.url + x-forwarded-host → kendi origin geçer', () => {
    const req = new Request('http://127.0.0.1:3000/api/kayit', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        origin: BIZ,
        'x-forwarded-proto': 'https',
        'x-forwarded-host': 'www.ocak.biz',
      },
      body: '{}',
    });
    expect(originMuhafizi(req)).toBeNull();
  });

  it('internal request.url + x-forwarded-host → yabancı origin 403', () => {
    const req = new Request('http://127.0.0.1:3000/api/kayit', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        origin: YABANCI,
        'x-forwarded-proto': 'https',
        'x-forwarded-host': 'www.ocak.biz',
      },
      body: '{}',
    });
    expect(originMuhafizi(req)!.status).toBe(403);
  });

  it('lokal dev: http Origin, publicOrigin https üretir → host eşleşir, geçer', () => {
    // `origin-kural.ts:originSebebi` gerekçesi — tam dize karşılaştırması dev'i
    // kırar ve kapı "her yerde reddediyor" diye yanlış yeşil verir.
    const req = new Request('http://localhost:4321/api/form', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        origin: 'http://localhost:4321',
        host: 'localhost:4321',
      },
      body: '{}',
    });
    expect(originMuhafizi(req)).toBeNull();
  });
});

describe('route bağlantısı — DAVRANIŞSAL (muhafız gerçekten koşuyor mu)', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  const ROUTELAR = [
    { yol: '/api/kayit', modul: '../pages/api/kayit.ts' },
    { yol: '/api/form', modul: '../pages/api/form.ts' },
    { yol: '/api/promo-dogrula', modul: '../pages/api/promo-dogrula.ts' },
  ] as const;

  async function postAt(modul: string, yol: string, headers: Record<string, string>) {
    const mod = (await import(modul)) as unknown as {
      POST: (ctx: { request: Request }) => Promise<Response>;
    };
    return mod.POST({ request: istek(headers, `${BIZ}${yol}`) });
  }

  for (const { yol, modul } of ROUTELAR) {
    it(`${yol} — yabancı origin → 403`, async () => {
      const res = await postAt(modul, yol, { origin: YABANCI });
      expect(res.status).toBe(403);
    });

    it(`${yol} — Origin/Referer YOK → 403`, async () => {
      const res = await postAt(modul, yol, {});
      expect(res.status).toBe(403);
    });

    it(`${yol} — kendi origin → muhafızı GEÇER (403 değil, validasyona düşer)`, async () => {
      // Boş gövde `{}` → muhafız geçtikten sonra zorunlu alan validasyonu
      // 400 döner. Kanıt: 403 DEĞİL. Ağa çıkılmaz.
      const res = await postAt(modul, yol, { origin: BIZ });
      expect(res.status).not.toBe(403);
      expect(res.status).toBe(400);
    });
  }

  it('/api/davet — 403 DÖNMEZ: kendi sessiz-ret kapısı korunuyor', async () => {
    // Bilinçli istisna (`api/davet.ts` 0b yorumu): origin kapısı orada zaten
    // var ve 403 değil sessiz 200 dönüyor — bot başarılı sandığını sansın.
    // `as unknown as` — `APIRoute` bağlamı 19 alan ister (cookies, site,
    // clientAddress…); muhafız yalnız `request` okuyor. Daraltma bilinçli,
    // `astro check` doğrudan dönüşüme izin vermiyor.
    const mod = (await import('../pages/api/davet.ts')) as unknown as {
      POST: (ctx: { request: Request }) => Promise<Response>;
    };
    const res = await mod.POST({
      request: istek({ origin: YABANCI }, `${BIZ}/api/davet`),
    });
    expect(res.status).not.toBe(403);
  });
});

describe('config bağı — checkOrigin: false ile muhafız birlikte yaşar', () => {
  const kok = join(__dirname, '..', '..');
  const CONFIG = readFileSync(join(kok, 'astro.config.mjs'), 'utf-8');

  /** Yorumlar elenir — CLAUDE.md §3: kriter kodu ölçer, prozayı değil. */
  function kodu(kaynak: string): string {
    return kaynak
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/(^|[^:])\/\/.*$/gm, '$1');
  }

  const ROUTE_DOSYALARI = ['kayit.ts', 'form.ts', 'promo-dogrula.ts'] as const;

  it('Astro muhafızı kapalı — yoksa N-Kolay callback\'i 403 yer', () => {
    expect(kodu(CONFIG)).toMatch(/security:\s*\{\s*checkOrigin:\s*false\s*\}/);
  });

  it('kapalıysa üç route muhafızı KOŞULUYLA çağırır', () => {
    // Davranışsal testler muhafızın çalıştığını kanıtlıyor; bu kriter
    // bayrak ile muhafız arasındaki BAĞI kurar: biri gidince diğeri
    // kırmızı yansın.
    for (const dosya of ROUTE_DOSYALARI) {
      const K = kodu(readFileSync(join(kok, 'src', 'pages', 'api', dosya), 'utf-8'));
      expect(K, dosya).toMatch(/const originRet = originMuhafizi\(request\);/);
      expect(K, dosya).toMatch(/if \(originRet\) return originRet;/);
      // KARAR 567'nin tuzağı: koşulu `&&` ile etkisizleştirmek.
      expect(K, dosya).not.toMatch(/if \([^)]*&&\s*originRet\)/);
    }
  });

  it('muhafız gövde OKUNMADAN önce çağrılır (her üç route)', () => {
    for (const dosya of ROUTE_DOSYALARI) {
      const K = kodu(readFileSync(join(kok, 'src', 'pages', 'api', dosya), 'utf-8'));
      const muhafizIdx = K.indexOf('originMuhafizi(request)');
      const govdeIdx = K.indexOf('await request.json()');
      expect(muhafizIdx, dosya).toBeGreaterThan(-1);
      expect(govdeIdx, dosya).toBeGreaterThan(muhafizIdx);
    }
  });

  it('/api/odeme-callback muhafıza GİRMEZ — dış origin POST alması işin kendisi', () => {
    const CB = readFileSync(
      join(kok, 'src', 'pages', 'api', 'odeme-callback.ts'),
      'utf-8',
    );
    expect(kodu(CB)).not.toMatch(/originMuhafizi/);
  });

  it('/api/davet 403 muhafızını çağırmaz, kendi sessiz kapısını çağırır', () => {
    const D = kodu(readFileSync(join(kok, 'src', 'pages', 'api', 'davet.ts'), 'utf-8'));
    expect(D).not.toMatch(/originMuhafizi/);
    expect(D).toMatch(/const originRet = originSebebi\(/);
    expect(D).toMatch(/if \(originRet\) return sessizRet\(originRet\);/);
    expect(D).not.toMatch(/if \([^)]*&&\s*originRet\)/);
  });
});
