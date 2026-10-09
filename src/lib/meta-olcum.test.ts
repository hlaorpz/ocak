import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  META_OLAY_ADI,
  META_GRAPH_SURUMU,
  OLCUM_GITTI_ALANI,
  OLCUM_RIZASI_ALANI,
  metaAyarlariniOku,
  metaUcAdresi,
  kayitIdOzeti,
  purchaseOlayi,
  purchaseGovdesi,
  olcumKapisi,
  purchaseBildir,
  olcumGittiIsaretleyici,
  metaOlcumAdimi,
  type MetaTasima,
} from './meta-olcum';

/**
 * B118 İŞ D — sunucudan Meta Purchase olayı.
 *
 * Kaan'ın altı koşulu burada tek tek kilitleniyor. Ağ çağrısı YOK: taşıma
 * enjekte ediliyor, testler gerçekten ne gönderildiğini okuyor.
 */

const AYAR_ENV = {
  META_PIXEL_ID: '861407993595884',
  META_CAPI_TOKEN: 'sahte-token',
  META_TEST_EVENT_CODE: 'TEST12345',
};

const AN = 1791550000; // sabit UNIX saniye — `Date.now()` kullanılmıyor

function tasimaTopla(sonuc: { ok: boolean; hata?: string } = { ok: true }) {
  const cagrilar: { url: string; govde: Record<string, unknown> }[] = [];
  const tasima: MetaTasima = async (url, govde) => {
    cagrilar.push({ url, govde });
    return sonuc;
  };
  return { cagrilar, tasima };
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Koşul 4 — üç ortam değişkeninin ÜÇÜ de zorunlu', () => {
  it('üçü de doluyken ayarlar okunur', () => {
    expect(metaAyarlariniOku(AYAR_ENV)).toEqual({
      pixelId: '861407993595884',
      token: 'sahte-token',
      testKodu: 'TEST12345',
    });
  });

  it('`process.env`den okunuyor — `import.meta.env` DEĞİL (build zamanında sabitlenmesin)', async () => {
    const kaynak = await import('node:fs').then((fs) =>
      fs.readFileSync(new URL('./meta-olcum.ts', import.meta.url), 'utf-8'),
    );
    const yuzey = kaynak
      .replace(/\/\*[\s\S]*?\*\//g, ' ')
      .split('\n')
      .filter((s) => !/^\s*\/\//.test(s))
      .join('\n');
    expect(yuzey).toContain('process.env');
    expect(yuzey).not.toContain('import.meta.env');
  });

  it('herhangi biri tanımsız → null (hiçbir istek atılmaz)', () => {
    for (const eksik of ['META_PIXEL_ID', 'META_CAPI_TOKEN', 'META_TEST_EVENT_CODE']) {
      const env = { ...AYAR_ENV, [eksik]: undefined };
      expect(metaAyarlariniOku(env), eksik).toBeNull();
    }
  });

  it('boş ya da yalnız-boşluk değer de tanımsız sayılır', () => {
    expect(metaAyarlariniOku({ ...AYAR_ENV, META_CAPI_TOKEN: '' })).toBeNull();
    expect(metaAyarlariniOku({ ...AYAR_ENV, META_PIXEL_ID: '   ' })).toBeNull();
  });

  it('tamamen boş ortam → null', () => {
    expect(metaAyarlariniOku({})).toBeNull();
  });

  it('ayarlar eksikken `purchaseBildir` HİÇBİR istek atmaz ve atlanır', async () => {
    const { cagrilar, tasima } = tasimaTopla();
    const isaretle = vi.fn();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    const sonuc = await purchaseBildir(
      { kayitId: 'OCAK-1234', pageId: 'p1', tutar: 750, paraBirimi: 'TRY', olcumRizasi: true, olcumGitti: false },
      { tasima, olcumGittiIsaretle: isaretle, env: {}, anSaniye: AN },
    );
    expect(cagrilar).toHaveLength(0);
    expect(isaretle).not.toHaveBeenCalled();
    expect(sonuc.durum).toBe('atlandi');
    expect(sonuc.sebep).toContain('META_PIXEL_ID');
  });
});

describe('Koşul 2 ve 3 — rıza kapısı ve tekillik', () => {
  const TAM = { kayitId: 'OCAK-1234', tutar: 750, olcumRizasi: true, olcumGitti: false };

  it('dört koşul sağlandığında gönderilir', () => {
    expect(olcumKapisi(TAM)).toEqual({ gonder: true });
  });

  it('`Ölçüm Rızası` işaretli DEĞİLSE gönderilmez (koşul 2)', () => {
    const s = olcumKapisi({ ...TAM, olcumRizasi: false });
    expect(s.gonder).toBe(false);
    expect(s.gonder === false && s.sebep).toContain('Ölçüm Rızası');
  });

  it('`Ölçüm Gitti` DOLUYSA gönderilmez (koşul 3 — tekillik)', () => {
    const s = olcumKapisi({ ...TAM, olcumGitti: true });
    expect(s.gonder).toBe(false);
    expect(s.gonder === false && s.sebep).toContain('Ölçüm Gitti');
  });

  it('Kayıt ID boşsa gönderilmez — olay kimliği kurulamaz', () => {
    expect(olcumKapisi({ ...TAM, kayitId: '   ' }).gonder).toBe(false);
  });

  it('tutar pozitif değilse gönderilmez', () => {
    expect(olcumKapisi({ ...TAM, tutar: 0 }).gonder).toBe(false);
    expect(olcumKapisi({ ...TAM, tutar: -5 }).gonder).toBe(false);
    expect(olcumKapisi({ ...TAM, tutar: NaN }).gonder).toBe(false);
  });

  it('rızasız kayıtta `purchaseBildir` ağa HİÇ çıkmaz', async () => {
    const { cagrilar, tasima } = tasimaTopla();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    const sonuc = await purchaseBildir(
      { kayitId: 'OCAK-1', pageId: 'p1', tutar: 750, paraBirimi: 'TRY', olcumRizasi: false, olcumGitti: false },
      { tasima, olcumGittiIsaretle: vi.fn(), env: AYAR_ENV, anSaniye: AN },
    );
    expect(cagrilar).toHaveLength(0);
    expect(sonuc.durum).toBe('atlandi');
  });

  it('`Ölçüm Gitti` dolu kayıtta ağa HİÇ çıkmaz', async () => {
    const { cagrilar, tasima } = tasimaTopla();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    await purchaseBildir(
      { kayitId: 'OCAK-1', pageId: 'p1', tutar: 750, paraBirimi: 'TRY', olcumRizasi: true, olcumGitti: true },
      { tasima, olcumGittiIsaretle: vi.fn(), env: AYAR_ENV, anSaniye: AN },
    );
    expect(cagrilar).toHaveLength(0);
  });
});

describe('Koşul 5 — yükte yalnız Kayıt ID, tutar, para birimi, zaman', () => {
  const G = { kayitId: 'OCAK-1234', tutar: 937.5, paraBirimi: 'TRY', anSaniye: AN };

  it('olay nesnesinin şekli', () => {
    expect(purchaseOlayi(G)).toEqual({
      event_name: 'Purchase',
      event_time: AN,
      event_id: 'OCAK-1234',
      action_source: 'other',
      user_data: { external_id: kayitIdOzeti('OCAK-1234') },
      custom_data: { value: 937.5, currency: 'try' },
    });
  });

  it('E-POSTA ve TELEFON özeti YOK — `user_data` yalnız `external_id` taşıyor', () => {
    const olay = purchaseOlayi(G) as { user_data: Record<string, unknown> };
    expect(Object.keys(olay.user_data)).toEqual(['external_id']);
    for (const yasak of ['em', 'ph', 'fn', 'ln', 'ct', 'st', 'zp', 'client_ip_address', 'client_user_agent']) {
      expect(olay.user_data).not.toHaveProperty(yasak);
    }
  });

  it('yükün TAMAMINDA kişisel veri dizesi geçmiyor', () => {
    const metin = JSON.stringify(purchaseGovdesi(G, metaAyarlariniOku(AYAR_ENV)!));
    for (const yasak of ['@', 'Ayşe', '+90', 'İzmir', 'email', 'phone']) {
      expect(metin, yasak).not.toContain(yasak);
    }
  });

  it('`external_id` Kayıt ID\'nin SHA-256\'sı — düz Kayıt ID yükte görünmez', () => {
    const ozet = kayitIdOzeti('OCAK-1234');
    expect(ozet).toMatch(/^[0-9a-f]{64}$/);
    expect(ozet).not.toContain('OCAK');
    // Aynı girdi aynı özet; baş-son boşluk kırpılıyor.
    expect(kayitIdOzeti('  OCAK-1234  ')).toBe(ozet);
    expect(kayitIdOzeti('OCAK-5678')).not.toBe(ozet);
  });

  it('DEDUPE: `event_id` DÜZ Kayıt ID — tarayıcıdaki GTM `eventID` ile aynı', () => {
    expect((purchaseOlayi(G) as { event_id: string }).event_id).toBe('OCAK-1234');
  });

  it('kuruş korunuyor (KARAR 240)', () => {
    expect((purchaseOlayi({ ...G, tutar: 0.01 }) as any).custom_data.value).toBe(0.01);
    expect((purchaseOlayi({ ...G, tutar: 1234.56 }) as any).custom_data.value).toBe(1234.56);
  });

  it('para birimi küçük harfe iniyor, TRY dışı değer korunuyor', () => {
    expect((purchaseOlayi({ ...G, paraBirimi: 'EUR' }) as any).custom_data.currency).toBe('eur');
    expect((purchaseOlayi({ ...G, paraBirimi: ' try ' }) as any).custom_data.currency).toBe('try');
  });

  it('gövde: olay + test kodu + token', () => {
    const govde = purchaseGovdesi(G, metaAyarlariniOku(AYAR_ENV)!);
    expect(govde.data).toHaveLength(1);
    expect(govde.test_event_code).toBe('TEST12345');
    expect(govde.access_token).toBe('sahte-token');
  });

  it('TOKEN URL\'de DEĞİL (CLAUDE.md §8 — sır log\'a/adrese sızmaz)', () => {
    const url = metaUcAdresi('861407993595884');
    expect(url).not.toContain('sahte-token');
    expect(url).not.toContain('access_token');
    expect(url).toBe(`https://graph.facebook.com/${META_GRAPH_SURUMU}/861407993595884/events`);
  });

  it('olay adı Purchase, GTM etiketiyle aynı', () => {
    expect(META_OLAY_ADI).toBe('Purchase');
  });
});

describe('gönderim — mutlu yol', () => {
  it('istek atılır ve `Ölçüm Gitti` işaretlenir', async () => {
    const { cagrilar, tasima } = tasimaTopla({ ok: true });
    const isaretle = vi.fn().mockResolvedValue(undefined);
    vi.spyOn(console, 'log').mockImplementation(() => {});

    const sonuc = await purchaseBildir(
      { kayitId: 'OCAK-1234', pageId: 'sayfa-1', tutar: 750, paraBirimi: 'TRY', olcumRizasi: true, olcumGitti: false },
      { tasima, olcumGittiIsaretle: isaretle, env: AYAR_ENV, anSaniye: AN },
    );

    expect(sonuc).toEqual({ durum: 'gonderildi', isaretlendi: true });
    expect(cagrilar).toHaveLength(1);
    expect(cagrilar[0].url).toContain('861407993595884/events');
    expect(isaretle).toHaveBeenCalledWith('sayfa-1');
  });

  it('işaret olay GİTTİKTEN SONRA konuyor', async () => {
    const sira: string[] = [];
    const tasima: MetaTasima = async () => {
      sira.push('gonder');
      return { ok: true };
    };
    vi.spyOn(console, 'log').mockImplementation(() => {});
    await purchaseBildir(
      { kayitId: 'OCAK-1', pageId: 'p', tutar: 1, paraBirimi: 'TRY', olcumRizasi: true, olcumGitti: false },
      {
        tasima,
        olcumGittiIsaretle: async () => {
          sira.push('isaretle');
        },
        env: AYAR_ENV,
        anSaniye: AN,
      },
    );
    expect(sira).toEqual(['gonder', 'isaretle']);
  });
});

describe('Koşul 3 — alan yoksa/yazılamazsa akış ETKİLENMEZ', () => {
  it('`Ölçüm Gitti` yazılamazsa olay GİTMİŞ sayılır, throw YOK', async () => {
    const { tasima } = tasimaTopla({ ok: true });
    const hata = vi.spyOn(console, 'error').mockImplementation(() => {});
    const sonuc = await purchaseBildir(
      { kayitId: 'OCAK-1', pageId: 'p', tutar: 1, paraBirimi: 'TRY', olcumRizasi: true, olcumGitti: false },
      {
        tasima,
        olcumGittiIsaretle: async () => {
          throw new Error('property does not exist');
        },
        env: AYAR_ENV,
        anSaniye: AN,
      },
    );
    expect(sonuc.durum).toBe('gonderildi');
    expect(sonuc.isaretlendi).toBe(false);
    // Log alanı adıyla birlikte, Kaan tanısın diye.
    expect(hata.mock.calls[0][0]).toContain(OLCUM_GITTI_ALANI);
  });

  it('Meta REDDEDERSE `Ölçüm Gitti` YAZILMAZ — reddedilen olay işaretlenmez', async () => {
    const { tasima } = tasimaTopla({ ok: false, hata: 'HTTP 400 user_data eksik' });
    const isaretle = vi.fn();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const sonuc = await purchaseBildir(
      { kayitId: 'OCAK-1', pageId: 'p', tutar: 1, paraBirimi: 'TRY', olcumRizasi: true, olcumGitti: false },
      { tasima, olcumGittiIsaretle: isaretle, env: AYAR_ENV, anSaniye: AN },
    );
    expect(sonuc.durum).toBe('hata');
    expect(isaretle).not.toHaveBeenCalled();
    expect(sonuc.sebep).toContain('user_data eksik');
  });

  it('taşıma THROW ederse yakalanır — `purchaseBildir` asla throw etmez', async () => {
    const tasima: MetaTasima = async () => {
      throw new Error('ağ koptu');
    };
    vi.spyOn(console, 'error').mockImplementation(() => {});
    await expect(
      purchaseBildir(
        { kayitId: 'OCAK-1', pageId: 'p', tutar: 1, paraBirimi: 'TRY', olcumRizasi: true, olcumGitti: false },
        { tasima, olcumGittiIsaretle: vi.fn(), env: AYAR_ENV, anSaniye: AN },
      ),
    ).resolves.toMatchObject({ durum: 'hata' });
  });
});

describe('bağlama — iki çağrı yerinin TEK kurulumu', () => {
  it('`olcumGittiIsaretleyici` doğru property\'yi yazıyor', async () => {
    const guncellenen: Record<string, unknown>[] = [];
    const notion = { pages: { update: async (a: any) => void guncellenen.push(a) } };
    await olcumGittiIsaretleyici(notion)('sayfa-9');
    expect(guncellenen[0]).toEqual({
      page_id: 'sayfa-9',
      properties: { [OLCUM_GITTI_ALANI]: { checkbox: true } },
    });
  });

  it('alan adları Notion\'daki adlarla birebir', () => {
    expect(OLCUM_RIZASI_ALANI).toBe('Ölçüm Rızası');
    expect(OLCUM_GITTI_ALANI).toBe('Ölçüm Gitti');
  });

  it('`metaOlcumAdimi` eksik alanları güvenli yana düşürüyor (env yokken ağa çıkmaz)', async () => {
    const notion = { pages: { update: vi.fn() } };
    vi.spyOn(console, 'log').mockImplementation(() => {});
    // `process.env`de anahtarlar yok → atlandı, Notion'a dokunulmadı.
    const sonuc = await metaOlcumAdimi(notion)({ kayitId: 'OCAK-1', pageId: 'p' });
    expect(sonuc.durum).toBe('atlandi');
    expect(notion.pages.update).not.toHaveBeenCalled();
  });
});
