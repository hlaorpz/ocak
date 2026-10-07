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
 * ✅ **VEKTÖR ÖLÇÜLDÜ (6 Eki 2026) — fixture artık varsayım taşımıyor.**
 * *(Bu paragrafın önceki hâli "DOĞRULANMAMIŞ VEKTÖR" diyordu ve haklıydı:
 * `REFERENCE_CODE`'un bizim `clientRefCode`'umuzun yankısı olduğu bir
 * VARSAYIMDI. Varsayım ÇÜRÜDÜ, B201 kapandı.)*
 *
 * Ölçülen gerçek — dönüş gövdesinde İKİ AYRI kimlik var:
 *   `REFERENCE_CODE`        = N-KOLAY'ın işlem numarası (`IKSIRPF341481127`)
 *                             → **hash kapsamında**, imzalı
 *   `CLIENT_REFERENCE_CODE` = bizim `clientRefCode` (`OCAK-7K2M-12345`)
 *                             → **hash DIŞINDA**, tarayıcıdan yazılabilir
 *
 * Kanıt zinciri: 1 Eki canlı dönüşünde hash kapısı geçti, red biçim kapısında
 * oldu (9 alanlı dize doğru) · N-Kolay paneli iki ayrı sütun gösteriyor ·
 * canlı `PaymentList` yanıtı aynı ayrımı taşıyor.
 *
 * Sonuç: bizim kodumuz dönüşten OKUNAMAZ. Kayıt **mutabakat köprüsüyle**
 * çözülür — `REFERENCE_CODE` → `PaymentList` (sırla imzalı, N-Kolay'ın kendi
 * sunucusu) → `clientRefCode` → sonek soyulur → `kayitOku`. Aşağıdaki
 * fixture bu zinciri taklit eder; `fetch` stub'lanır.
 *
 * `CLIENT_REFERENCE_CODE` **dönüş gövdesinden** hâlâ bilinçli olarak
 * OKUNMUYOR: hash kapsamında değil. Köprünün okuduğu aynı adlı alan farklı
 * bir yüzeydir (imzalı `PaymentList` yanıtı) ve ayrı modülde yaşar —
 * gerekçesi `nkolay-mutabakat.ts` başında.
 *
 * KARAR 573 — muhafızların KOŞULU ölçülür: route `import` edilip `POST`
 * gerçek `Request` ile çağrılır, dönen status okunur. Bir kapıyı
 * `if (false && …)` yapmak bu testleri KIRMIZI yakar.
 */

const SECRET = 'm3rch4nt-s3cr3t-K3y';
const REF = 'OCAK-7K2M';
/** Bizim gönderdiğimiz tam kod — artık dönüşte DEĞİL, `PaymentList`'te yaşıyor. */
const GONDERILEN_REF = `${REF}-12345`;
/** Dönüşte gelen = N-Kolay'ın kendi numarası. Biçimi ölçülen örnekle aynı sınıf. */
const HAM_REF = 'IKSIRPF341481127';
const BEKLENEN_TUTAR = 1234.56;

/**
 * `PaymentList` yanıtı — ölçülen İÇ İÇE şekil: `{"result":"<JSON dizesi>"}`.
 * Satır alanları 6 Eki canlı ölçümünden.
 */
function paymentListYanit(
  satirlar: Array<{ ref?: string; client?: string; status?: string; tip?: string }> = [{}],
): string {
  const LIST = satirlar.map((s) => ({
    REFERENCE_CODE: s.ref ?? HAM_REF,
    CLIENT_REFERENCE_CODE: s.client ?? GONDERILEN_REF,
    STATUS: s.status ?? 'SUCCESS',
    TRANSACTION_TYPE: s.tip ?? 'SALES',
  }));
  return JSON.stringify({ result: JSON.stringify({ RESPONSE_CODE: 1, LIST }) });
}

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
function notionSahtesi(
  satir: {
    tutar?: number | null;
    islemNo?: string;
    /**
     * B211 — bildirim girdileri. `undefined` ise satır Email'siz ve
     * `Etkinlikler` relation'ı BOŞ olur; `odemeBildir` o hâlde atlar ve
     * eski testlerin `guncellenen` sayımı değişmez.
     */
    bildirim?: { email?: string; etkinlikSayisi?: number };
  } | null,
) {
  const guncellenen: any[] = [];
  const b = satir?.bildirim;
  const relation = Array.from({ length: b?.etkinlikSayisi ?? 0 }, (_, i) => ({
    id: `etk-uuid-${i + 1}`,
  }));
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
                    Email: { email: b?.email ?? '' },
                    'Seçilen Tarih': { rich_text: [{ plain_text: '12 Ekim 2026' }] },
                    Etkinlikler: { relation },
                  },
                },
              ],
            },
    },
    pages: {
      // Online Açık Kapı — bildirimin beş alanını doldurmaya yeten şekil.
      retrieve: async () => ({
        properties: {
          Format: { select: { name: 'Açık Kapı' } },
          'Mekân/Platform': { select: { name: 'Online' } },
          'Katılım Linki': { rich_text: [{ plain_text: 'https://zoom.us/j/123' }] },
          'Zoom Şifresi': { rich_text: [{ plain_text: 'sifre42' }] },
        },
      }),
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
async function routeYukle(
  satir: Parameters<typeof notionSahtesi>[0],
  opts: {
    /** `PaymentList` yanıt gövdesi. `null` → ağ hatası. `undefined` → varsayılan eşleşen satır. */
    paymentList?: string | null;
    /** `PaymentList` HTTP durumu. */
    paymentListStatus?: number;
    /**
     * B211 — MailerLite anahtarı. Verilmezse transport `no-api-key` ile
     * başarısız olur ve ağa HİÇ çıkmaz; eski testler bu yüzden değişmedi.
     */
    mailerLiteKey?: string;
    /** MailerLite HTTP durumu. `undefined` → 200. */
    mailerLiteStatus?: number;
  } = {},
) {
  vi.resetModules();
  vi.stubEnv('KART_AKISI', 'acik');
  vi.stubEnv('PAYMENT_PROVIDER', 'nkolay');
  vi.stubEnv('NKOLAY_MERCHANT_SECRET', SECRET);
  // Mutabakat köprüsünün env yüzeyi. `NKOLAY_SX_LIST` listeleme ucunun AYRI
  // kimliği — satış `sx`'i ile sorgulamak hash'i bozardı.
  vi.stubEnv('NKOLAY_SX_LIST', 'sx-list-test');
  vi.stubEnv('NKOLAY_BASE_URL', 'https://paynkolaytest.ornek.invalid/Vpos');

  if (opts.mailerLiteKey) vi.stubEnv('MAILERLITE_API_KEY', opts.mailerLiteKey);

  // ⚠ `fetch` STUB — testler gerçek ağa çıkmaz. Köprünün çağrıldığını ve NE
  // gönderdiğini de bu casus ölçer (hash alan adı, kodlama, tarih biçimi).
  //
  // B211: artık İKİ ayrı uç çağrılabiliyor (mutabakat `PaymentList` ve
  // MailerLite). Casus URL'e bakıp ayırıyor — tek yanıt döndürmek MailerLite
  // yazımını "başarılı" göstermez, çağrılıp çağrılmadığını da ölçemezdi.
  const mailerLiteCagrilari: Array<{ url: string; govde: any }> = [];
  const fetchCasus = vi.fn(async (girdi: any, init?: any) => {
    const url = typeof girdi === 'string' ? girdi : String(girdi?.url ?? girdi);
    if (url.includes('connect.mailerlite.com')) {
      mailerLiteCagrilari.push({ url, govde: JSON.parse(String(init?.body ?? '{}')) });
      const st = opts.mailerLiteStatus ?? 200;
      return new Response(st === 200 ? '{"data":{}}' : '{"message":"sunucu hatası"}', {
        status: st,
        headers: { 'content-type': 'application/json' },
      });
    }
    if (opts.paymentList === null) throw new Error('ağ düştü');
    return new Response(opts.paymentList ?? paymentListYanit(), {
      status: opts.paymentListStatus ?? 200,
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    });
  });
  vi.stubGlobal('fetch', fetchCasus);

  const sahte = notionSahtesi(satir);
  vi.doMock('../lib/notion.ts', () => ({
    notion: sahte.client,
    NOTION_KAYITLAR_DB: 'db-kayitlar',
  }));
  const mod = (await import('../pages/api/odeme-callback.ts')) as unknown as {
    POST: (ctx: { request: Request }) => Promise<Response>;
  };
  return { ...sahte, POST: mod.POST, fetchCasus, mailerLiteCagrilari };
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

  it('7b · REFERENCE_CODE boş/taşınamaz → 401, köprü ÇAĞRILMAZ', async () => {
    // Kapı artık ŞEKİL sormuyor (`IKSIRPF` çivilenmedi, B201'in hatası
    // tekrar edilmedi) — "dolu ve taşınabilir mi" soruyor. Bu üç değer
    // taşınamaz: boş · çok kısa · yasak karakter.
    for (const bozuk of ['', 'abc', 'IKSIRPF 341481127']) {
      const { POST, client, fetchCasus } = await routeYukle({ tutar: BEKLENEN_TUTAR });
      const casus = vi.spyOn(client.databases, 'query');
      const res = await POST({ request: istek(imzaliGovde({ REFERENCE_CODE: bozuk })) });
      expect(res.status, bozuk).toBe(401);
      expect(fetchCasus, bozuk).not.toHaveBeenCalled();
      expect(casus, bozuk).not.toHaveBeenCalled();
    }
  });

  it('7c · biçimi geçen ama PaymentList\'te eşleşmeyen referans → 401', async () => {
    // Kapıyı geçmek yetmez: kimliğin KANITI mutabakattır. Eşleşme yoksa
    // Notion'a hiç gidilmez.
    const { POST, client } = await routeYukle({ tutar: BEKLENEN_TUTAR });
    const casus = vi.spyOn(client.databases, 'query');
    const res = await POST({ request: istek(imzaliGovde({ REFERENCE_CODE: 'IKSIRPF999999999' })) });
    expect(res.status).toBe(401);
    expect(casus).not.toHaveBeenCalled();
  });

  it('7d · CANCEL satırı ödeme SAYILMAZ → 401', async () => {
    // ⚠ İptal satırı iptal ettiği işlemin `REFERENCE_CODE`'unu taşır. Tipi
    // sormadan ilk eşleşmeyi almak, iptal edilmiş işlemi ödeme sayardı.
    const { POST, client } = await routeYukle(
      { tutar: BEKLENEN_TUTAR },
      { paymentList: paymentListYanit([{ tip: 'CANCEL' }]) },
    );
    const casus = vi.spyOn(client.databases, 'query');
    expect((await POST({ request: istek(imzaliGovde()) })).status).toBe(401);
    expect(casus).not.toHaveBeenCalled();
  });

  it('7e · STATUS=ERROR satırı → 401', async () => {
    const { POST } = await routeYukle(
      { tutar: BEKLENEN_TUTAR },
      { paymentList: paymentListYanit([{ status: 'ERROR' }]) },
    );
    expect((await POST({ request: istek(imzaliGovde()) })).status).toBe(401);
  });

  it('7f · CANCEL + SALES aynı referansta → SALES seçilir, 302', async () => {
    // Gerçekçi hâl: işlem başarılı, sonra iptal denemesi başarısız olmuş.
    // Liste iki satır taşır; köprü doğru olanı bulmalı.
    const { POST, guncellenen } = await routeYukle(
      { tutar: BEKLENEN_TUTAR },
      { paymentList: paymentListYanit([{ tip: 'CANCEL', status: 'ERROR' }, {}]) },
    );
    expect((await POST({ request: istek(imzaliGovde()) })).status).toBe(302);
    expect(guncellenen).toHaveLength(1);
  });

  it('7g · PaymentList ağ hatası / HTTP hatası / bozuk gövde → 401, SESSİZ DEĞİL', async () => {
    // ⚠ Buraya gelen istek imzasını GEÇMİŞ: para muhtemelen çekilmiş. Kayıt
    // kapanmıyorsa iz log'da durmalı.
    const haller: Array<[string, Parameters<typeof routeYukle>[1]]> = [
      ['ağ', { paymentList: null }],
      ['http', { paymentListStatus: 500 }],
      ['bozuk-json', { paymentList: 'bu json değil' }],
      ['LIST-yok', { paymentList: JSON.stringify({ result: JSON.stringify({ RESPONSE_CODE: 0 }) }) }],
    ];
    for (const [ad, opts] of haller) {
      const hata = vi.spyOn(console, 'error').mockImplementation(() => {});
      const { POST, guncellenen } = await routeYukle({ tutar: BEKLENEN_TUTAR }, opts);
      expect((await POST({ request: istek(imzaliGovde()) })).status, ad).toBe(401);
      expect(guncellenen, ad).toHaveLength(0);
      const satir = hata.mock.calls.map((c) => String(c[0])).join('\n');
      expect(satir, ad).toContain(HAM_REF); // sağlayıcı referansı iz olarak düşüyor
      hata.mockRestore();
    }
  });

  it('7h · köprü ÖLÇÜLEN sözleşmeyle çağrılıyor — ad · kodlama · tarih biçimi', async () => {
    // Üç prob turunun kazanımı burada çivili. Biri değişirse N-Kolay sessizce
    // "Hash Data boş geçilemez" demeye döner ve hat yine kapanır.
    const { POST, fetchCasus } = await routeYukle({ tutar: BEKLENEN_TUTAR });
    await POST({ request: istek(imzaliGovde()) });
    expect(fetchCasus).toHaveBeenCalledTimes(1);
    const [adres, init] = fetchCasus.mock.calls[0] as unknown as [string, RequestInit];
    expect(adres).toContain('/Payment/PaymentList');
    expect(init.method).toBe('POST');
    // `URLSearchParams` gövdesi → fetch `x-www-form-urlencoded` basar.
    expect(init.body).toBeInstanceOf(URLSearchParams);
    const g = init.body as URLSearchParams;
    expect(g.get('hashDataV2')).toBeTruthy();      // ad: hashData DEĞİL
    expect(g.get('hash')).toBeNull();
    expect(g.get('clientRefCode')).toBe('');        // boş geçilebilir, ayıraç yerinde
    // Tarih: DD.MM.YYYY — nokta ayıraç, ISO DEĞİL.
    expect(g.get('startDate')).toMatch(/^\d{2}\.\d{2}\.\d{4}$/);
    expect(g.get('endDate')).toMatch(/^\d{2}\.\d{2}\.\d{4}$/);
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

/**
 * B211 — bildirim halkası, ROUTE seviyesinde.
 *
 * Alanların doğruluğu `odeme-bildir.test.ts`'te davranış testiyle ölçülüyor.
 * Burada ölçülen tek şey **erişim**: reddedilen bir callback MailerLite'a
 * ulaşabiliyor mu. Kaynak-grep'i bunu ölçemez — "çağrı `odemeyiOnayla`'dan
 * sonra yazılmış" görünür ama bir kapının `return`'ü kaldırılsa da öyle
 * görünmeye devam ederdi. Bu yüzden gerçek `POST`, gerçek `fetch` casusu.
 *
 * `BILDIRIMLI` satır: Email dolu + relation TEK öğeli — yani bildirimin
 * koşulları sağlanmış. Böylece aşağıdaki redlerin "zaten atlıyordu" değil
 * gerçekten RED olduğu kontrol grubuyla kanıtlanıyor.
 */
describe('odeme-callback — bildirim halkası kapıların ARDINDA (B211)', () => {
  const BILDIRIMLI = {
    tutar: BEKLENEN_TUTAR,
    bildirim: { email: 'test@ornek.invalid', etkinlikSayisi: 1 },
  };
  const KEY = { mailerLiteKey: 'ml-test-key' };

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

  it('KONTROL — başarılı callback MailerLite\'a beş alan yazar, `Mail Gitti` işaretlenir', async () => {
    const { POST, guncellenen, mailerLiteCagrilari } = await routeYukle(BILDIRIMLI, KEY);
    const res = await POST({ request: istek(imzaliGovde()) });
    expect(res.status).toBe(302);
    expect(mailerLiteCagrilari).toHaveLength(1);
    // `groups` GÖNDERİLMEZ — mevcut üyeliklere dokunulmaz (7 Eki ölçümü).
    expect(mailerLiteCagrilari[0].govde).not.toHaveProperty('groups');
    expect(mailerLiteCagrilari[0].govde.email).toBe('test@ornek.invalid');
    expect(Object.keys(mailerLiteCagrilari[0].govde.fields).sort()).toEqual(
      ['etkinlik_adi', 'katilim_linki', 'odeme_durumu', 'zoom_link', 'zoom_sifresi'],
    );
    expect(mailerLiteCagrilari[0].govde.fields.odeme_durumu).toBe('alindi');
    expect(mailerLiteCagrilari[0].govde.fields.etkinlik_adi).toBe(
      'Açık Kapı — 12 Ekim 2026 · ödeme alındı',
    );
    // İKİ Notion yazımı: ödeme onayı + `Mail Gitti`. Sıra önemli — bildirim
    // ödemeden SONRA gelir.
    expect(guncellenen).toHaveLength(2);
    expect(guncellenen[0].properties['Ödeme Durumu'].select.name).toBe('Ödendi');
    expect(guncellenen[1].properties['Mail Gitti'].checkbox).toBe(true);
  });

  it('6 · hash tutmazsa bildirim ÇAĞRILMAZ', async () => {
    const { POST, guncellenen, mailerLiteCagrilari } = await routeYukle(BILDIRIMLI, KEY);
    const g = imzaliGovde();
    g.set('hashDataV2', sha512b64('uydurma'));
    expect((await POST({ request: istek(g) })).status).toBe(401);
    expect(mailerLiteCagrilari).toEqual([]);
    expect(guncellenen).toHaveLength(0);
  });

  it('6b · REPLAY reddinde bildirim ÇAĞRILMAZ', async () => {
    const { POST, mailerLiteCagrilari } = await routeYukle(
      { ...BILDIRIMLI, islemNo: 'ONCEKI-ISLEM' },
      KEY,
    );
    expect((await POST({ request: istek(imzaliGovde()) })).status).toBe(401);
    expect(mailerLiteCagrilari).toEqual([]);
  });

  it('6c · DÜŞÜK TUTAR reddinde bildirim ÇAĞRILMAZ', async () => {
    const { POST, mailerLiteCagrilari } = await routeYukle(
      { ...BILDIRIMLI, tutar: BEKLENEN_TUTAR * 2 },
      KEY,
    );
    expect((await POST({ request: istek(imzaliGovde()) })).status).toBe(401);
    expect(mailerLiteCagrilari).toEqual([]);
  });

  it('6d · MUTABAKAT reddinde bildirim ÇAĞRILMAZ', async () => {
    const { POST, mailerLiteCagrilari } = await routeYukle(BILDIRIMLI, {
      ...KEY,
      paymentList: paymentListYanit([{ client: 'BASKA-KOD-999' }]),
    });
    expect((await POST({ request: istek(imzaliGovde()) })).status).toBe(401);
    expect(mailerLiteCagrilari).toEqual([]);
  });

  it('6e · kayıt bulunamazsa bildirim ÇAĞRILMAZ', async () => {
    const { POST, mailerLiteCagrilari } = await routeYukle(null, KEY);
    expect((await POST({ request: istek(imzaliGovde()) })).status).toBe(401);
    expect(mailerLiteCagrilari).toEqual([]);
  });

  it('6f · `sonuc=iptal` → /odeme/iptal ve bildirim ÇAĞRILMAZ', async () => {
    const { POST, guncellenen, mailerLiteCagrilari } = await routeYukle(BILDIRIMLI, KEY);
    const req = new Request('https://www.ocak.biz/api/odeme-callback?sonuc=iptal', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: imzaliGovde().toString(),
    });
    const res = await POST({ request: req });
    expect(res.headers.get('location')).toContain('/odeme/iptal');
    expect(guncellenen).toHaveLength(0);
    expect(mailerLiteCagrilari).toEqual([]);
  });

  it('relation ÇOK öğeliyse MailerLite ÇAĞRILMAZ ama ödeme onayı DURUR', async () => {
    // Bildirimin atlanması tahsilatı geri almaz: `Ödendi` yazılmış kalır,
    // yalnız mail halkası sessizce atlanır ve log gerekçeyi taşır.
    const { POST, guncellenen, mailerLiteCagrilari } = await routeYukle(
      { ...BILDIRIMLI, bildirim: { email: 'test@ornek.invalid', etkinlikSayisi: 2 } },
      KEY,
    );
    expect((await POST({ request: istek(imzaliGovde()) })).status).toBe(302);
    expect(mailerLiteCagrilari).toEqual([]);
    expect(guncellenen).toHaveLength(1);
    expect(guncellenen[0].properties['Ödeme Durumu'].select.name).toBe('Ödendi');
  });

  it('3 · MailerLite 500 verirse callback DÜŞMEZ — 302, `Mail Gitti` YAZILMAZ', async () => {
    const { POST, guncellenen, mailerLiteCagrilari } = await routeYukle(BILDIRIMLI, {
      ...KEY,
      mailerLiteStatus: 500,
    });
    const res = await POST({ request: istek(imzaliGovde()) });
    // Ödeme onayı ve yanıt kodu DEĞİŞMEZ — para çekildi, MailerLite'ın 500'ü
    // o gerçeği geri alamaz.
    expect(res.status).toBe(302);
    expect(res.headers.get('location')).toContain('/odeme/tamam');
    expect(mailerLiteCagrilari).toHaveLength(1);
    // TEK Notion yazımı: ödeme onayı. `Mail Gitti` yok.
    expect(guncellenen).toHaveLength(1);
    expect(guncellenen[0].properties['Ödeme Durumu'].select.name).toBe('Ödendi');
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

  it('CLIENT_REFERENCE_CODE callback yüzeyinde okunmaz (route + sağlayıcı)', () => {
    // Hash kapsamı dışında; DÖNÜŞ GÖVDESİNDEN kayıt çözmek imzayı imzasız
    // alana devretmek olurdu.
    const LIB = readFileSync(join(__dirname, 'payment-provider.ts'), 'utf-8');
    expect(kodu(ROUTE)).not.toMatch(/CLIENT_REFERENCE_CODE/);
    expect(kodu(LIB)).not.toMatch(/CLIENT_REFERENCE_CODE/);
  });

  it('⚠ yasak DARALMADI — dizenin yaşadığı tek yer köprü modülü, o da gövdeyi görmez', () => {
    // 6 Eki'de köprü geldi ve `CLIENT_REFERENCE_CODE`'u OKUMAK zorunda:
    // `PaymentList` yanıtında bizim kodumuzun adı o. Ama o yanıt dönüş POST'u
    // DEĞİL — sırla imzalı bir çağrıya N-Kolay'ın kendi sunucusunun cevabı.
    //
    // Dize bu yüzden ayrı modüle taşındı. ⚠ Taşıma yasağı daraltmasın diye
    // iki şey birlikte çivili: (a) dize YALNIZ o modülde yaşıyor,
    // (b) o modül callback gövdesine tip düzeyinde erişemez.
    const KOPRU = kodu(readFileSync(join(__dirname, 'nkolay-mutabakat.ts'), 'utf-8'));
    expect(KOPRU).toMatch(/CLIENT_REFERENCE_CODE/);          // (a) burada yaşıyor
    expect(KOPRU).not.toMatch(/URLSearchParams|\bRequest\b/); // (b) gövdeyi göremez

    // Ve route kimliği köprüye HASH KAPSAMINDAN veriyor.
    expect(kodu(ROUTE)).toMatch(/saglayiciReferansi:\s*dogrulama\.saglayiciReferansi/);
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
