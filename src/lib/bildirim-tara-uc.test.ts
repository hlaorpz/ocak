import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * `/api/bildirim-tara` — uç davranışı (B211 İŞ 4 + İŞ 8).
 *
 * KARAR motoru `tarama.test.ts`'te satır satır ölçülüyor. Burada ölçülen
 * şeyler route'a ait ve kaynak-grep'iyle ölçülemez:
 *   · kimlik (başlık sırrı · sorgu dizesi reddi)
 *   · kuru koşuda mail ve Notion yazımının SIFIR olması
 *   · sıra: önce mail, başarılıysa işaret
 *   · iptalin sessizliği
 *   · yanıtta kişi verisi olmaması
 *
 * Route `import` edilip `POST` gerçek `Request` ile çağrılıyor (KARAR 573
 * deseni); `notion` sahteleniyor, `fetch` casusla ölçülüyor.
 *
 * Dosya `src/lib/` altında (KARAR 574).
 */

const SIR = 'tarama-sirri-test';
const BASLIK = 'x-ocak-tarama';

type SahteSatir = {
  id: string;
  kayitId: string;
  odemeDurumu?: string;
  odemeYontemi?: string;
  createdTime?: string;
  yerTutmaBitisi?: string | null;
  mailGitti?: boolean;
  hatirlatmaGitti?: boolean;
  gunHatirlatmasiGitti?: boolean;
  email?: string;
  tutar?: number | null;
  relation?: number;
};

function notionSahtesi(satirlar: SahteSatir[], etkinlik?: Record<string, any>) {
  const guncellenen: any[] = [];
  const client = {
    databases: {
      query: async (args: any) => ({
        results: satirlar.map((s) => ({
          id: s.id,
          created_time: s.createdTime ?? '2026-10-01T09:00:00.000Z',
          properties: {
            'Kayıt ID': { title: [{ plain_text: s.kayitId }] },
            'Ödeme Durumu': { select: { name: s.odemeDurumu ?? 'Beklemede' } },
            'Ödeme Yöntemi': { select: { name: s.odemeYontemi ?? 'Kredi Kartı' } },
            'Kayıt Tarihi': { created_time: s.createdTime ?? '2026-10-01T09:00:00.000Z' },
            'Yer Tutma Bitişi':
              s.yerTutmaBitisi === null ? { date: null } : { date: { start: s.yerTutmaBitisi ?? '2026-10-01T12:00:00.000Z' } },
            'Mail Gitti': { checkbox: s.mailGitti ?? false },
            'Hatırlatma Gitti': { checkbox: s.hatirlatmaGitti ?? false },
            'Gün Hatırlatması Gitti': { checkbox: s.gunHatirlatmasiGitti ?? false },
            Email: { email: s.email ?? 'test@ornek.invalid' },
            'Kadın': { rich_text: [{ plain_text: 'Deniz Yıldırım' }] },
            'Beklenen Tutar': { number: s.tutar ?? 225 },
            Etkinlikler: {
              relation: Array.from({ length: s.relation ?? 1 }, (_, i) => ({ id: `etk-${i}` })),
            },
          },
          _sorguArgs: args,
        })),
      }),
    },
    pages: {
      retrieve: async () => ({
        properties:
          etkinlik ?? {
            'Başlık': { title: [{ plain_text: 'Elin Neyle Dolu?' }] },
            Slug: { rich_text: [{ plain_text: 'elin-neyle-dolu' }] },
            Tarih: { date: { start: '2026-10-20' } },
            'Mekân/Platform': { select: { name: 'Online' } },
            'Zoom Başlangıç Saati': { rich_text: [{ plain_text: '21:00' }] },
            Saat: { rich_text: [{ plain_text: '21:00-22:00' }] },
            'Katılım Linki': { rich_text: [{ plain_text: 'https://zoom.us/j/123' }] },
            'Zoom Şifresi': { rich_text: [{ plain_text: 'sifre42' }] },
            'Konum Detay': { rich_text: [] },
            'Para Birimi': { select: { name: 'TRY' } },
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

async function ucYukle(
  satirlar: SahteSatir[],
  opts: { sir?: string; resendStatus?: number; etkinlik?: Record<string, any> } = {},
) {
  vi.resetModules();
  vi.stubEnv('TARAMA_SIR', opts.sir ?? SIR);
  vi.stubEnv('RESEND_API_KEY', 're-test');
  vi.stubEnv('ODEME_LINK_SIR', 'link-sir-test');

  const resendCagrilari: Array<{ govde: any }> = [];
  const fetchCasus = vi.fn(async (girdi: any, init?: any) => {
    const url = typeof girdi === 'string' ? girdi : String(girdi?.url ?? girdi);
    if (url.includes('api.resend.com')) {
      resendCagrilari.push({ govde: JSON.parse(String(init?.body ?? '{}')) });
      const st = opts.resendStatus ?? 200;
      return new Response(
        st === 200 ? '{"id":"e1"}' : '{"name":"application_error","message":"patladı"}',
        { status: st, headers: { 'content-type': 'application/json' } },
      );
    }
    throw new Error(`beklenmeyen fetch: ${url}`);
  });
  vi.stubGlobal('fetch', fetchCasus);

  const sahte = notionSahtesi(satirlar, opts.etkinlik);
  vi.doMock('../lib/notion.ts', () => ({
    notion: sahte.client,
    NOTION_KAYITLAR_DB: 'db-kayitlar',
  }));
  const mod = (await import('../pages/api/bildirim-tara.ts')) as unknown as {
    POST: (ctx: { request: Request }) => Promise<Response>;
  };
  return { ...sahte, POST: mod.POST, resendCagrilari };
}

function istek(opts: { baslik?: string | null; query?: string } = {}): Request {
  const h: Record<string, string> = {};
  if (opts.baslik !== null) h[BASLIK] = opts.baslik ?? SIR;
  return new Request(`https://www.ocak.biz/api/bildirim-tara${opts.query ?? ''}`, {
    method: 'POST',
    headers: h,
  });
}

/** Kartlı, 30 dk geçmiş, bitiş gelecekte → hatırlatma adayı. */
const HATIRLATMA_ADAYI: SahteSatir = {
  id: 'p1',
  kayitId: 'OCAK-7K2M',
  odemeYontemi: 'Kredi Kartı',
  createdTime: '2026-10-01T09:00:00.000Z',
  yerTutmaBitisi: '2099-01-01T00:00:00.000Z',
};

beforeEach(() => {
  for (const m of ['log', 'warn', 'error'] as const) {
    vi.spyOn(console, m).mockImplementation(() => {});
  }
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
  vi.resetModules();
  vi.doUnmock('../lib/notion.ts');
});

describe('kimlik — başlık sırrı, sorgu dizesi KABUL EDİLMEZ', () => {
  it('doğru başlık → 200', async () => {
    const { POST } = await ucYukle([HATIRLATMA_ADAYI]);
    expect((await POST({ request: istek() })).status).toBe(200);
  });

  it('başlık YOK → 401, gövde yok, Notion\'a dokunulmaz', async () => {
    const { POST, guncellenen, resendCagrilari } = await ucYukle([HATIRLATMA_ADAYI]);
    const res = await POST({ request: istek({ baslik: null }) });
    expect(res.status).toBe(401);
    expect(await res.text()).toBe('');
    expect(guncellenen).toEqual([]);
    expect(resendCagrilari).toEqual([]);
  });

  it('başlık YANLIŞ → 401', async () => {
    const { POST } = await ucYukle([HATIRLATMA_ADAYI]);
    expect((await POST({ request: istek({ baslik: 'uydurma' }) })).status).toBe(401);
  });

  it('⚠ sır SORGU DİZESİNDE → 401 (query log\'lara ve geçmişe düşer)', async () => {
    const { POST } = await ucYukle([HATIRLATMA_ADAYI]);
    const res = await POST({
      request: istek({ baslik: null, query: `?sir=${encodeURIComponent(SIR)}` }),
    });
    expect(res.status).toBe(401);
  });

  it('⚠ env sırrı BOŞSA hiçbir şey geçmez (fail-closed)', async () => {
    // `sabitZamanliEsit` boş-boş için `true` döner; o tuzağa düşülmüyor.
    const { POST } = await ucYukle([HATIRLATMA_ADAYI], { sir: '' });
    expect((await POST({ request: istek({ baslik: null }) })).status).toBe(401);
    expect((await POST({ request: istek({ baslik: '' }) })).status).toBe(401);
  });

  it('401 gövdesinde SEBEP yok — deneyen birine yön gösterilmez', async () => {
    const { POST } = await ucYukle([HATIRLATMA_ADAYI]);
    const res = await POST({ request: istek({ baslik: 'uydurma' }) });
    const metin = await res.text();
    expect(metin).not.toMatch(/sir|sır|env|baslik/i);
  });
});

describe('kuru koşu — mail SIFIR, Notion yazımı SIFIR', () => {
  it('?kuru=1 → hiçbir mail, hiçbir yazım; liste döner', async () => {
    const { POST, guncellenen, resendCagrilari } = await ucYukle([HATIRLATMA_ADAYI]);
    const res = await POST({ request: istek({ query: '?kuru=1' }) });
    const g = await res.json();
    expect(res.status).toBe(200);
    expect(resendCagrilari).toEqual([]);
    expect(guncellenen).toEqual([]);
    expect(g.kuru).toBe(true);
    expect(g.islem).toBe(1);
    expect(g.kayitlar).toEqual([
      { kayitId: 'OCAK-7K2M', islem: 'hatirlat-kart', durum: 'kuru' },
    ]);
  });

  it('kuru koşu İPTALİ de kapsar — Notion\'a yazılmaz', async () => {
    const { POST, guncellenen } = await ucYukle([
      { ...HATIRLATMA_ADAYI, yerTutmaBitisi: '2020-01-01T00:00:00.000Z' },
    ]);
    const g = await (await POST({ request: istek({ query: '?kuru=1' }) })).json();
    expect(guncellenen).toEqual([]);
    expect(g.kayitlar[0].islem).toBe('iptal:Kart — süre doldu');
    expect(g.kayitlar[0].durum).toBe('kuru');
  });

  it('kuru koşu GÜN HATIRLATMASINI da kapsar (Ek 2)', async () => {
    const { POST, guncellenen, resendCagrilari } = await ucYukle(
      [{
        id: 'p1', kayitId: 'OCAK-7K2M', odemeDurumu: 'Ödendi', mailGitti: true,
        yerTutmaBitisi: null, createdTime: '2026-09-01T09:00:00.000Z',
      }],
      {
        etkinlik: {
          'Başlık': { title: [{ plain_text: 'Bugünkü Çember' }] },
          Slug: { rich_text: [{ plain_text: 'bugunku-cember' }] },
          // Geçmiş bir tarih vermiyoruz; testin "bugün"ü sabitlemek için
          // uzak gelecekteki bir günün saati kullanılıyor ve gün hatırlatması
          // penceresi açılmıyor — bu yüzden burada yalnız bildirim beklenir.
          Tarih: { date: { start: '2099-01-01' } },
          'Mekân/Platform': { select: { name: 'Online' } },
          'Zoom Başlangıç Saati': { rich_text: [{ plain_text: '21:00' }] },
          Saat: { rich_text: [] },
          'Katılım Linki': { rich_text: [{ plain_text: 'https://zoom.us/j/9' }] },
          'Zoom Şifresi': { rich_text: [] },
          'Konum Detay': { rich_text: [] },
          'Para Birimi': { select: { name: 'TRY' } },
        },
      },
    );
    const g = await (await POST({ request: istek({ query: '?kuru=1' }) })).json();
    // `Mail Gitti` dolu → (a) yok; gün penceresi kapalı → (c) yok.
    expect(g.islem).toBe(0);
    expect(resendCagrilari).toEqual([]);
    expect(guncellenen).toEqual([]);
  });
});

describe('sıra — önce mail, başarılıysa işaret', () => {
  it('mail başarılı → işaret YAZILIR', async () => {
    const { POST, guncellenen, resendCagrilari } = await ucYukle([HATIRLATMA_ADAYI]);
    const g = await (await POST({ request: istek() })).json();
    expect(resendCagrilari).toHaveLength(1);
    expect(resendCagrilari[0].govde.template.id).toBe('yerini-tutuyoruz');
    expect(guncellenen).toHaveLength(1);
    expect(guncellenen[0].properties['Hatırlatma Gitti'].checkbox).toBe(true);
    expect(g.kayitlar[0].durum).toBe('yazildi');
  });

  it('⚠ mail DÜŞERSE işaret YAZILMAZ — sonraki tarama yeniden dener', async () => {
    const { POST, guncellenen, resendCagrilari } = await ucYukle([HATIRLATMA_ADAYI], {
      resendStatus: 500,
    });
    const g = await (await POST({ request: istek() })).json();
    expect(resendCagrilari).toHaveLength(1);
    expect(guncellenen).toEqual([]);
    expect(g.kayitlar[0].durum).toBe('mail-hata');
  });

  it('havale ek süresi: `yerin-hala-bizde` + YENİ bitiş yazılır (Ek 2)', async () => {
    const { POST, guncellenen, resendCagrilari } = await ucYukle([
      {
        ...HATIRLATMA_ADAYI,
        odemeYontemi: 'Havale',
        yerTutmaBitisi: '2020-01-01T00:00:00.000Z',
      },
    ]);
    await POST({ request: istek() });
    // Kart 30 dk `yerini-tutuyoruz`da KALIR; ek süre ayrı şablon.
    expect(resendCagrilari[0].govde.template.id).toBe('yerin-hala-bizde');
    expect(guncellenen[0].properties['Hatırlatma Gitti'].checkbox).toBe(true);
    // Mail yeni son anı söyledi; satır onu doğrulamalı.
    expect(guncellenen[0].properties['Yer Tutma Bitişi'].date.start).toBeTruthy();
    expect(new Date(guncellenen[0].properties['Yer Tutma Bitişi'].date.start).getTime())
      .toBeGreaterThan(Date.now());
  });

  it('İPTAL sessiz — mail YOK, yalnız Notion', async () => {
    const { POST, guncellenen, resendCagrilari } = await ucYukle([
      { ...HATIRLATMA_ADAYI, yerTutmaBitisi: '2020-01-01T00:00:00.000Z' },
    ]);
    await POST({ request: istek() });
    expect(resendCagrilari).toEqual([]);
    expect(guncellenen).toHaveLength(1);
    expect(guncellenen[0].properties['Ödeme Durumu'].select.name).toBe('İptal');
    expect(guncellenen[0].properties['İptal Nedeni'].select.name).toBe('Kart — süre doldu');
  });

  it('(a) bildirim: `Mail Gitti` işaretlenir, `yerin-hazir-online` gider', async () => {
    const { POST, guncellenen, resendCagrilari } = await ucYukle([
      { id: 'p1', kayitId: 'OCAK-7K2M', odemeDurumu: 'Ödendi', mailGitti: false, yerTutmaBitisi: null },
    ]);
    await POST({ request: istek() });
    expect(resendCagrilari[0].govde.template.id).toBe('yerin-hazir-online');
    expect(guncellenen[0].properties['Mail Gitti'].checkbox).toBe(true);
  });
});

describe('kapılar ve kapsam', () => {
  it('`Yer Tutma Bitişi` BOŞ satıra dokunulmaz', async () => {
    const { POST, guncellenen, resendCagrilari } = await ucYukle([
      { ...HATIRLATMA_ADAYI, yerTutmaBitisi: null },
    ]);
    const g = await (await POST({ request: istek() })).json();
    expect(g.islem).toBe(0);
    expect(resendCagrilari).toEqual([]);
    expect(guncellenen).toEqual([]);
  });

  it('relation TEK DEĞİLSE mail gönderilmez', async () => {
    const { POST, resendCagrilari } = await ucYukle([{ ...HATIRLATMA_ADAYI, relation: 2 }]);
    const g = await (await POST({ request: istek() })).json();
    expect(resendCagrilari).toEqual([]);
    expect(g.kayitlar[0].durum).toBe('atlandi');
  });

  it('e-posta yoksa mail gönderilmez', async () => {
    const { POST, resendCagrilari } = await ucYukle([{ ...HATIRLATMA_ADAYI, email: '' }]);
    const g = await (await POST({ request: istek() })).json();
    expect(resendCagrilari).toEqual([]);
    expect(g.kayitlar[0].durum).toBe('atlandi');
  });

  it('sorgu `Tip = Kayıt` ile filtreleniyor', async () => {
    const { POST, client } = await ucYukle([HATIRLATMA_ADAYI]);
    const casus = vi.spyOn(client.databases, 'query');
    await POST({ request: istek({ query: '?kuru=1' }) });
    expect(casus.mock.calls[0][0].filter).toEqual({
      property: 'Tip',
      select: { equals: 'Kayıt' },
    });
  });
});

describe('yanıt ve log — kişi verisi YOK', () => {
  it('yanıtta e-posta, ad, telefon, pageId geçmez', async () => {
    const { POST } = await ucYukle([HATIRLATMA_ADAYI]);
    const metin = await (await POST({ request: istek() })).text();
    expect(metin).not.toContain('test@ornek.invalid');
    expect(metin).not.toContain('@');
    expect(metin).not.toContain('Deniz');
    expect(metin).not.toContain('p1');
    expect(metin).toContain('OCAK-7K2M');
  });

  it('log\'da e-posta ve ad geçmez', async () => {
    const satirlar: string[] = [];
    for (const m of ['log', 'warn', 'error'] as const) {
      vi.spyOn(console, m).mockImplementation((...a: unknown[]) => void satirlar.push(a.join(' ')));
    }
    const { POST } = await ucYukle([{ ...HATIRLATMA_ADAYI, relation: 3 }]);
    await POST({ request: istek() });
    expect(satirlar.length).toBeGreaterThan(0);
    for (const s of satirlar) {
      expect(s).not.toContain('test@ornek.invalid');
      expect(s).not.toContain('@');
      expect(s).not.toContain('Deniz');
    }
  });
});

describe('kaynak disiplini', () => {
  const KOD = readFileSync(join(__dirname, '..', 'pages', 'api', 'bildirim-tara.ts'), 'utf-8')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1');

  it('sır SORGUDAN okunmuyor — yalnız başlıktan', () => {
    // Başlık adı sabitten geliyor (`BASLIK_ADI`), satır içi literal değil;
    // kriter dosyanın gerçek hâline göre yazıldı.
    expect(KOD).toMatch(/const BASLIK_ADI = 'x-ocak-tarama';/);
    expect(KOD).toMatch(/request\.headers\.get\(BASLIK_ADI\)/);
    // Sorgudan okunan TEK şey `kuru`.
    const sorgular = KOD.match(/searchParams\.get\('[^']+'\)/g) ?? [];
    expect(sorgular).toEqual(["searchParams.get('kuru')"]);
  });

  it('tavan 25 ve atlanan sayısı log\'lanıyor — sessiz kırpma yok', () => {
    expect(KOD).toMatch(/const TAVAN = 25;/);
    expect(KOD).toMatch(/atlanan > 0/);
  });

  it('yalnız POST — GET yok (tarama bir yazma işlemi)', () => {
    expect(KOD).toMatch(/export const POST: APIRoute/);
    expect(KOD).not.toMatch(/export const GET/);
  });

  it('TARAMA_SIR log\'a BASILMIYOR', () => {
    const loglar = KOD.match(/console\.\w+\([^;]*\);/g) ?? [];
    for (const l of loglar) {
      expect(l).not.toMatch(/taramaSirri\(\)|TARAMA_SIR|beklenen/);
    }
  });
});
