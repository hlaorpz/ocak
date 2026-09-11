import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * `/api/odeme-callback` — tutar + replay muhafızı (11 Eyl 2026, ikinci tur).
 *
 * ── Bu suite'in ölçtüğü soru ──
 * İmza doğrulaması "bu dönüş sağlayıcıdan geldi" der. Bu kapılar ayrı bir
 * soruya bakar: **doğru kayda, doğru tutarda, ilk kez mi geliyor?**
 *
 * ⚠ **DOĞRULANMAMIŞ VEKTÖR — fixture bir VARSAYIM üstüne kurulu.**
 * `REFERENCE_CODE`'un bizim `clientRefCode`'umuzun yankısı olduğu
 * ÖLÇÜLMEDİ: altın vektör yok (örnek yanıtların secret'ı yayınlanmamış),
 * canlı işlem koşulmadı, entegrasyon dokümanı repoda yok. Aşağıdaki
 * gövdeler o varsayımı taklit eder. Varsayım yanlışsa kod **fail-closed**
 * reddeder ve gövdenin ALAN ADLARINI log'a basar — ilk test işlemi gerçek
 * alan adını söyleyecek ve bu fixture o gün düzeltilecek.
 *
 * `CLIENT_REFERENCE_CODE` bilinçli olarak KULLANILMIYOR: hash kapsamında
 * değil, yani dönüş POST'unu gönderen tarayıcıdan serbestçe yazılabilir.
 *
 * KARAR 573 — muhafızların KOŞULU ölçülür: route `import` edilip `POST`
 * gerçek `Request` ile çağrılır, dönen status okunur. Bir kapıyı
 * `if (false && …)` yapmak bu testleri KIRMIZI yakar.
 */

const SECRET = 'm3rch4nt-s3cr3t-K3y';
const REF = 'OCAK-7K2M';
const HAM_REF = `${REF}-12345`;
const BEKLENEN_TUTAR = 1234.56;

const sha512b64 = (s: string) => createHash('sha512').update(s, 'utf8').digest('base64');

/** İmzalı dönüş gövdesi. Alanlar ezilebilir; imza EZMEDEN SONRA hesaplanır. */
function imzaliGovde(ezme: Record<string, string | null> = {}): URLSearchParams {
  const temel: Record<string, string> = {
    MERCHANT_NO: '273',
    REFERENCE_CODE: HAM_REF,
    AUTH_CODE: 'A1B2C3',
    RESPONSE_CODE: '2',
    USE_3D: 'true',
    RND: '11-09-2026 15:35:10',
    INSTALLMENT: '0',
    AUTHORIZATION_AMOUNT: String(BEKLENEN_TUTAR),
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

/** Notion sahtesi — `kayitOku`'nun okuduğu şekle birebir uyar. */
function notionSahtesi(satir: { tutar?: number | null; islemNo?: string } | null) {
  const guncellenen: any[] = [];
  const client = {
    databases: {
      query: async () =>
        satir === null
          ? { results: [] }
          : {
              results: [
                {
                  id: 'page-uuid-1',
                  properties: {
                    'Kayıt ID': { title: [{ plain_text: REF }] },
                    'Beklenen Tutar': { number: satir.tutar ?? null },
                    'İşlem No': {
                      rich_text: satir.islemNo ? [{ plain_text: satir.islemNo }] : [],
                    },
                  },
                },
              ],
            },
    },
    pages: {
      retrieve: async () => ({ properties: {} }),
      update: async (args: any) => {
        guncellenen.push(args);
        return {};
      },
    },
  };
  return { client, guncellenen };
}

/**
 * Route'u taze import eder. `KART_AKISI=acik` (410 muhafızı bu suite'in
 * konusu değil) + `PAYMENT_PROVIDER=nkolay` + sahte Notion.
 */
async function routeYukle(satir: { tutar?: number | null; islemNo?: string } | null) {
  vi.resetModules();
  vi.stubEnv('KART_AKISI', 'acik');
  vi.stubEnv('PAYMENT_PROVIDER', 'nkolay');
  vi.stubEnv('NKOLAY_MERCHANT_SECRET', SECRET);
  const sahte = notionSahtesi(satir);
  vi.doMock('../lib/notion.ts', () => ({
    notion: sahte.client,
    NOTION_KAYITLAR_DB: 'db-kayitlar',
  }));
  const mod = (await import('../pages/api/odeme-callback.ts')) as unknown as {
    POST: (ctx: { request: Request }) => Promise<Response>;
  };
  return { ...sahte, POST: mod.POST };
}

function istek(govde: URLSearchParams): Request {
  return new Request('https://www.ocak.biz/api/odeme-callback?sonuc=basari', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: govde.toString(),
  });
}

describe('odeme-callback — beş kapı, KOŞUL ölçülür (KARAR 573)', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
    vi.resetModules();
    vi.doUnmock('../lib/notion.ts');
  });

  it('0 · referans hedef tutarla eşleşiyor → 302 ve Notion GÜNCELLENİR', async () => {
    const { POST, guncellenen } = await routeYukle({ tutar: BEKLENEN_TUTAR });
    const res = await POST({ request: istek(imzaliGovde()) });
    expect(res.status).toBe(302);
    expect(res.headers.get('location')).toContain('/odeme/tamam');
    // Kontrol grubu: aşağıdaki redler gerçekten RED, "zaten hiç yazmıyor" değil.
    expect(guncellenen).toHaveLength(1);
    expect(guncellenen[0].page_id).toBe('page-uuid-1');
    expect(guncellenen[0].properties['Ödeme Durumu'].select.name).toBe('Ödendi');
  });

  it('1 · hash tutmazsa → 401, Notion\'a HİÇ dokunulmaz', async () => {
    const { POST, guncellenen } = await routeYukle({ tutar: BEKLENEN_TUTAR });
    const g = imzaliGovde();
    g.set('hashDataV2', sha512b64('uydurma'));
    const res = await POST({ request: istek(g) });
    expect(res.status).toBe(401);
    expect(guncellenen).toHaveLength(0);
  });

  it('2 · RESPONSE_CODE ≠ "2" → 401 (imza tutsa bile)', async () => {
    const { POST, guncellenen } = await routeYukle({ tutar: BEKLENEN_TUTAR });
    const res = await POST({ request: istek(imzaliGovde({ RESPONSE_CODE: '0' })) });
    expect(res.status).toBe(401);
    expect(guncellenen).toHaveLength(0);
  });

  it('3 · AUTH_CODE "00" → 401 (imza tutsa bile)', async () => {
    const { POST, guncellenen } = await routeYukle({ tutar: BEKLENEN_TUTAR });
    const res = await POST({ request: istek(imzaliGovde({ AUTH_CODE: '00' })) });
    expect(res.status).toBe(401);
    expect(guncellenen).toHaveLength(0);
  });

  it('4 · DÜŞÜK TUTAR → 401 (imza tutsa bile)', async () => {
    // İmzalı ama beklenenin altında: sağlayıcı gerçekten 1 TL yetkilendirmiş
    // olabilir; kayıt 1234.56 bekliyor.
    const { POST, guncellenen } = await routeYukle({ tutar: BEKLENEN_TUTAR });
    const res = await POST({ request: istek(imzaliGovde({ AUTHORIZATION_AMOUNT: '1.00' })) });
    expect(res.status).toBe(401);
    expect(guncellenen).toHaveLength(0);
  });

  it('4b · FAZLA tutar KABUL edilir (taksit/komisyon farkı)', async () => {
    const { POST, guncellenen } = await routeYukle({ tutar: BEKLENEN_TUTAR });
    const res = await POST({ request: istek(imzaliGovde({ AUTHORIZATION_AMOUNT: '1300.00' })) });
    expect(res.status).toBe(302);
    // Kaydedilen tutar imza kapsamından gelen değer.
    expect(guncellenen[0].properties['Ödenen Tutar'].number).toBe(1300);
  });

  it('5 · REPLAY — İşlem No zaten dolu → 401', async () => {
    const { POST, guncellenen } = await routeYukle({
      tutar: BEKLENEN_TUTAR,
      islemNo: HAM_REF, // aynı işlem ikinci kez
    });
    const res = await POST({ request: istek(imzaliGovde()) });
    expect(res.status).toBe(401);
    expect(guncellenen).toHaveLength(0);
  });

  it('5b · replay kilidi BAŞKA bir işlem numarasına da kapalı', async () => {
    // Kayıt zaten kapanmış; ikinci bir çekim de kabul edilmez.
    const { POST } = await routeYukle({ tutar: BEKLENEN_TUTAR, islemNo: 'ONCEKI-ISLEM' });
    expect((await POST({ request: istek(imzaliGovde()) })).status).toBe(401);
  });

  it('5c · başarıda İşlem No YAZILIR — kilit kapanır', async () => {
    const { POST, guncellenen } = await routeYukle({ tutar: BEKLENEN_TUTAR });
    await POST({ request: istek(imzaliGovde()) });
    expect(guncellenen[0].properties['İşlem No'].rich_text[0].text.content).toBe(HAM_REF);
  });

  it('6 · Beklenen Tutar BOŞ → 401 ve red SESSİZ DEĞİL', async () => {
    // Kaan (11 Eyl): kod koşulsuz fail-closed, istisna taşımaz. Ama sessiz
    // red "para alındı, kayıt Beklemede, iz yok" demek olurdu.
    const hata = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { POST, guncellenen } = await routeYukle({ tutar: null });
    const res = await POST({ request: istek(imzaliGovde()) });
    expect(res.status).toBe(401);
    expect(guncellenen).toHaveLength(0);
    const satir = hata.mock.calls.map((c) => String(c[0])).join('\n');
    expect(satir).toContain('Beklenen Tutar boş');
    expect(satir).toContain(REF); // referans log'a düşüyor — iz var
  });

  it('7 · SONEK SOYMA — kayıt soneksiz referansla aranır', async () => {
    const { POST, client } = await routeYukle({ tutar: BEKLENEN_TUTAR });
    const casus = vi.spyOn(client.databases, 'query');
    await POST({ request: istek(imzaliGovde()) });
    expect(casus).toHaveBeenCalledTimes(1);
    // Sahte istemci tipsiz (`args: any`) — çağrı kaydı da öyle; daraltma açık.
    const filtre = (casus.mock.calls as any[])[0][0].filter;
    // Sonekli hâli aransaydı hiçbir kayıt bulunamazdı (`equals`).
    expect(filtre.title.equals).toBe(REF);
    expect(filtre.title.equals).not.toBe(HAM_REF);
  });

  it('7b · sonek biçimi tutmayan REFERENCE_CODE → 401, sorgu bile atılmaz', async () => {
    for (const bozuk of ['OCAK-7K2M', 'OCAK-7K2M-abc', 'BASKA-XXXX-12345', '']) {
      const { POST, client } = await routeYukle({ tutar: BEKLENEN_TUTAR });
      const casus = vi.spyOn(client.databases, 'query');
      const res = await POST({ request: istek(imzaliGovde({ REFERENCE_CODE: bozuk })) });
      expect(res.status, bozuk).toBe(401);
      expect(casus, bozuk).not.toHaveBeenCalled();
    }
  });

  it('8 · kayıt bulunamazsa → 401', async () => {
    const { POST, guncellenen } = await routeYukle(null);
    expect((await POST({ request: istek(imzaliGovde()) })).status).toBe(401);
    expect(guncellenen).toHaveLength(0);
  });

  it('⚠ 9 · query pageId/tutar YOK SAYILIR — imza kapsamı kazanır', async () => {
    // Saldırgan senaryosu: imzalı gövde gerçek, ama query'e başka bir kayıt
    // ve düşük tutar yazılmış. Query artık okunmuyor.
    const { POST, guncellenen } = await routeYukle({ tutar: BEKLENEN_TUTAR });
    const req = new Request(
      'https://www.ocak.biz/api/odeme-callback?sonuc=basari&pageId=BASKA-KAYIT&tutar=1&ref=BASKA',
      {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        body: imzaliGovde().toString(),
      },
    );
    const res = await POST({ request: req });
    expect(res.status).toBe(302);
    // Query'deki `pageId` ve `tutar` hiç kullanılmadı.
    expect(guncellenen[0].page_id).toBe('page-uuid-1');
    expect(guncellenen[0].properties['Ödenen Tutar'].number).toBe(BEKLENEN_TUTAR);
    expect(res.headers.get('location')).toContain(`ref=${REF}`);
  });
});

describe('kaynak disiplini — muhafızların koşulu ve KARAR 395', () => {
  const ROUTE = readFileSync(
    join(__dirname, '..', 'pages', 'api', 'odeme-callback.ts'),
    'utf-8',
  );
  const kodu = (k: string) =>
    k.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');

  function handleGovdesi(): string {
    const k = kodu(ROUTE);
    const bas = k.indexOf('async function handle(');
    expect(bas).toBeGreaterThan(-1);
    return k.slice(bas);
  }

  it('410 ve 401 muhafızlarının KOŞULU bozulmadı', () => {
    const H = handleGovdesi();
    expect(H).toMatch(/if \(!KART_AKISI_ACIK\) \{/);
    expect(H).not.toMatch(/if \([^)]*&&\s*!KART_AKISI_ACIK\)/);
    expect(H).toMatch(/if \(!dogrulama\.gecerli\) \{/);
    expect(H).not.toMatch(/if \([^)]*&&\s*!dogrulama\.gecerli\)/);
  });

  it('route sağlayıcı ADINA dallanmaz (KARAR 395) — üç alan arayüzden gelir', () => {
    const K = kodu(ROUTE);
    for (const ad of ['nkolay', 'iyzico', 'paytr', 'mock']) {
      expect(K.toLowerCase()).not.toMatch(new RegExp(`===\\s*['"\`]${ad}['"\`]`));
    }
    for (const alan of ['referansKodu', 'tutar', 'islemNo']) {
      expect(K).toMatch(new RegExp(`dogrulama\\.${alan}`));
    }
  });

  it('CLIENT_REFERENCE_CODE HİÇBİR yerde okunmaz', () => {
    // Hash kapsamı dışında; oradan kayıt çözmek imzayı imzasız alana
    // devretmek olurdu.
    const LIB = readFileSync(join(__dirname, 'payment-provider.ts'), 'utf-8');
    expect(kodu(ROUTE)).not.toMatch(/CLIENT_REFERENCE_CODE/);
    expect(kodu(LIB)).not.toMatch(/CLIENT_REFERENCE_CODE/);
  });

  it('query pageId/tutar ARTIK tüketilmiyor', () => {
    const H = handleGovdesi();
    expect(H).not.toMatch(/girdi\.basvuruId/);
    expect(H).not.toMatch(/girdi\.tutarRaw/);
    expect(H).toMatch(/kayit\.pageId/);
  });

  it('sağlayıcıdaki "BİLİNEN SINIR" notu artık geçersiz — kaldırıldı', () => {
    const LIB = readFileSync(join(__dirname, 'payment-provider.ts'), 'utf-8');
    expect(LIB).not.toMatch(/BİLİNEN SINIR/);
    expect(LIB).toMatch(/SINIR KAPANDI/);
  });
});
