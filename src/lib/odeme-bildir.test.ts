import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  odemeBildir,
  bildirimDegiskenleri,
  type OdemeBildirGirdi,
} from './odeme-bildir.ts';
import { SABLON, SABLON_DEGISKENLERI, type PostaTasima } from './posta.ts';

/**
 * `lib/odeme-bildir.ts` — ödeme onayından sonra "yerin hazır" maili.
 *
 * ── Bu suite neyi ölçüyor ──
 * Doğru şablona doğru değişkenlerle gidiliyor mu, ve gitmemesi gereken
 * durumlarda hiç gitmiyor mu. Route seviyesindeki soru — "reddedilen callback
 * bildirime ULAŞMIYOR mu" — `odeme-callback-muhafiz.test.ts`'te gerçek `POST`
 * çağrısıyla ölçülüyor.
 *
 * ⚠ Önceki hâli MailerLite'a on iki alan yazıyordu ve ` · ödeme alındı` ekiyle
 * otomasyonu uyandırıyordu. O mekanizma kalktı (Resend'e geçiş); bu dosyanın
 * eski "ek idempotent" ve "payload anahtar kümesi" ölçütleri de onunla birlikte
 * anlamını yitirdi. Yerine gelen ölçüt: şablon seçimi + değişken kümesi.
 *
 * Dosya `src/lib/` altında (KARAR 574).
 */

/** Online Açık Kapı. */
const ONLINE: OdemeBildirGirdi = {
  kayitId: 'OCAK-7K2M',
  pageId: 'page-uuid-1',
  email: 'test@ornek.invalid',
  ad: 'Deniz',
  etkinlikSayisi: 1,
  formatHam: 'Açık Kapı',
  basligHam: 'Elin Neyle Dolu?',
  slugHam: 'elin-neyle-dolu',
  tarihISOHam: '2026-10-12',
  tarihBitisHam: '',
  saatHam: '21:00',
  mekanHam: 'Online',
  katilimLinkiHam: 'https://zoom.us/j/123',
  zoomSifresiHam: 'sifre42',
  konumDetayHam: '',
};

/** Yüz yüze Çember. */
const YUZYUZE: OdemeBildirGirdi = {
  ...ONLINE,
  kayitId: 'OCAK-9ZQ1',
  pageId: 'page-uuid-2',
  formatHam: 'Çember',
  basligHam: 'Ekmeden Önce',
  slugHam: 'ekmeden-once',
  tarihISOHam: '2026-11-28',
  saatHam: '19:30',
  mekanHam: 'İstanbul',
  katilimLinkiHam: '',
  zoomSifresiHam: '',
  konumDetayHam: 'Kadıköy, sokak 5',
};

function deps(opts: { ok?: boolean; hata?: string; firlat?: boolean; mailGittiFirlat?: boolean } = {}) {
  const gonderimler: Parameters<PostaTasima>[0][] = [];
  const isaretlenen: string[] = [];
  return {
    gonderimler,
    isaretlenen,
    deps: {
      tasima: vi.fn(async (istek: Parameters<PostaTasima>[0]) => {
        if (opts.firlat) throw new Error('ağ düştü');
        gonderimler.push(istek);
        return opts.ok === false ? { ok: false, hata: opts.hata ?? 'HTTP 500' } : { ok: true };
      }) as PostaTasima,
      mailGittiIsaretle: vi.fn(async (pageId: string) => {
        if (opts.mailGittiFirlat) throw new Error('Notion düştü');
        isaretlenen.push(pageId);
      }),
    },
  };
}

beforeEach(() => {
  vi.spyOn(console, 'warn').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.spyOn(console, 'log').mockImplementation(() => {});
});
afterEach(() => vi.restoreAllMocks());

describe('bildirimDegiskenleri — şablon seçimi mekâna bağlı, dal KODDA', () => {
  it('online → `yerin-hazir-online`, kümesi tam', () => {
    const { sablon, degiskenler } = bildirimDegiskenleri(ONLINE);
    expect(sablon).toBe(SABLON.yerinHazirOnline);
    expect(Object.keys(degiskenler).sort()).toEqual([...SABLON_DEGISKENLERI[sablon]].sort());
    expect(degiskenler).toEqual({
      AD: 'Deniz',
      ETKINLIK_BASLIGI: 'Elin Neyle Dolu?',
      ETKINLIK_TARIHI: '12 Ekim 2026 · 21:00',
      KATILIM_LINKI: 'https://zoom.us/j/123',
      ZOOM_SIFRESI: 'sifre42',
      ETKINLIK_URL: 'https://www.ocak.biz/etkinlik/elin-neyle-dolu',
    });
  });

  it('yüz yüze → `yerin-hazir-yuzyuze`, YOL_TARIFI_LINKI dahil', () => {
    const { sablon, degiskenler } = bildirimDegiskenleri(YUZYUZE);
    expect(sablon).toBe(SABLON.yerinHazirYuzyuze);
    expect(Object.keys(degiskenler).sort()).toEqual([...SABLON_DEGISKENLERI[sablon]].sort());
    expect(degiskenler).toEqual({
      AD: 'Deniz',
      ETKINLIK_BASLIGI: 'Ekmeden Önce',
      ETKINLIK_TARIHI: '28 Kasım 2026 · 19:30',
      MEKAN: 'İstanbul',
      ADRES: 'Kadıköy, sokak 5',
      ETKINLIK_URL: 'https://www.ocak.biz/etkinlik/ekmeden-once',
      YOL_TARIFI_LINKI: 'https://www.google.com/maps/search/?api=1&query=Kad%C4%B1k%C3%B6y%2C%20sokak%205',
    });
  });

  it('online kümesinde Zoom alanları VAR, mekân/adres YOK (ve tersi)', () => {
    const o = bildirimDegiskenleri(ONLINE).degiskenler;
    expect(o).not.toHaveProperty('MEKAN');
    expect(o).not.toHaveProperty('ADRES');
    expect(o).not.toHaveProperty('YOL_TARIFI_LINKI');
    const y = bildirimDegiskenleri(YUZYUZE).degiskenler;
    expect(y).not.toHaveProperty('KATILIM_LINKI');
    expect(y).not.toHaveProperty('ZOOM_SIFRESI');
  });

  it('çok günlü buluşmada ETKINLIK_TARIHI ARALIK gösterir', () => {
    // Yalnız başlangıcı yazmak iki günlük bir Mini Retreat'i tek güne indirirdi.
    const { degiskenler } = bildirimDegiskenleri({
      ...YUZYUZE, tarihISOHam: '2026-11-28', tarihBitisHam: '2026-11-29',
    });
    expect(degiskenler.ETKINLIK_TARIHI).toBe('28 Kasım – 29 Kasım 2026');
  });

  it('⚠ ETKINLIK_TARIHI `saatHam`dan beslenir — cross-fallback saati SIZMAZ', () => {
    // `kayitOku.etkinlikTarihi` düz OR'lu saati taşıyor (`api/kayit.ts:191-198`
    // o eşlemeyi canlı veriyle çürüttü). Burada mekâna bağlı saat kullanılıyor.
    const { degiskenler } = bildirimDegiskenleri({ ...YUZYUZE, saatHam: '20:00' });
    expect(degiskenler.ETKINLIK_TARIHI).toBe('28 Kasım 2026 · 20:00');
  });

  it('Tarih boşsa ETKINLIK_TARIHI boş — tarih UYDURULMAZ', () => {
    const { degiskenler } = bildirimDegiskenleri({ ...ONLINE, tarihISOHam: '' });
    expect(degiskenler.ETKINLIK_TARIHI).toBe('');
  });

  it('Slug boşsa ETKINLIK_URL boş, YOL_TARIFI adrese düşer', () => {
    const { degiskenler } = bildirimDegiskenleri({ ...YUZYUZE, slugHam: '' });
    expect(degiskenler.ETKINLIK_URL).toBe('');
    expect(degiskenler.YOL_TARIFI_LINKI).toContain('google.com/maps');
  });
});

describe('odemeBildir — gönderim · Mail Gitti · hata yalıtımı', () => {
  it('başarılıysa mail gider ve `Mail Gitti` YAZILIR', async () => {
    const { deps: d, gonderimler, isaretlenen } = deps();
    const sonuc = await odemeBildir(ONLINE, d);
    expect(sonuc).toEqual({ durum: 'yazildi', mailGitti: true });
    expect(gonderimler).toHaveLength(1);
    expect(gonderimler[0].template.id).toBe('yerin-hazir-online');
    expect(gonderimler[0].to).toBe('test@ornek.invalid');
    // Konu kodda yazılmıyor (Kaan kararı 5).
    expect(gonderimler[0]).not.toHaveProperty('subject');
    expect(isaretlenen).toEqual(['page-uuid-1']);
  });

  it('yüz yüze kayıt yüz yüze şablonuna gider', async () => {
    const { deps: d, gonderimler } = deps();
    await odemeBildir(YUZYUZE, d);
    expect(gonderimler[0].template.id).toBe('yerin-hazir-yuzyuze');
  });

  it('mail hata verirse `Mail Gitti` YAZILMAZ ve throw EDİLMEZ', async () => {
    // Tarama (a) dalı sonraki turda yeniden deneyecek — işaret yazılmadığı için.
    const { deps: d, isaretlenen } = deps({ ok: false, hata: 'HTTP 422 template not published' });
    const sonuc = await odemeBildir(ONLINE, d);
    expect(sonuc.durum).toBe('hata');
    expect(sonuc.mailGitti).toBe(false);
    expect(sonuc.sebep).toContain('not published');
    expect(isaretlenen).toEqual([]);
  });

  it('taşıma THROW ederse de yalıtılır', async () => {
    const { deps: d, isaretlenen } = deps({ firlat: true });
    const sonuc = await odemeBildir(ONLINE, d);
    expect(sonuc.durum).toBe('hata');
    expect(isaretlenen).toEqual([]);
  });

  it('`Mail Gitti` yazımı patlarsa durum `yazildi` KALIR — mail gitti', async () => {
    // Başarıyı hataya çevirmek sonraki taramada ikinci bir mail gönderirdi.
    const { deps: d, gonderimler } = deps({ mailGittiFirlat: true });
    const sonuc = await odemeBildir(ONLINE, d);
    expect(sonuc.durum).toBe('yazildi');
    expect(sonuc.mailGitti).toBe(false);
    expect(gonderimler).toHaveLength(1);
  });

  it('KAPI 1 · relation SIFIR öğeli → mail gönderilmez', async () => {
    const { deps: d } = deps();
    const sonuc = await odemeBildir({ ...ONLINE, etkinlikSayisi: 0 }, d);
    expect(sonuc.durum).toBe('atlandi');
    expect(d.tasima).not.toHaveBeenCalled();
    expect(d.mailGittiIsaretle).not.toHaveBeenCalled();
  });

  it('KAPI 1 · relation ÇOK öğeli → mail gönderilmez (OCAK-3HX6 vakası)', async () => {
    const { deps: d } = deps();
    const sonuc = await odemeBildir({ ...ONLINE, etkinlikSayisi: 2 }, d);
    expect(sonuc.durum).toBe('atlandi');
    expect(sonuc.sebep).toContain('öğe=2');
    expect(d.tasima).not.toHaveBeenCalled();
  });

  it('KAPI 2 · Email boşsa gönderilmez', async () => {
    const { deps: d } = deps();
    const sonuc = await odemeBildir({ ...ONLINE, email: '  ' }, d);
    expect(sonuc.durum).toBe('atlandi');
    expect(d.tasima).not.toHaveBeenCalled();
  });

  it('KAPI 3 · format kayıt formatı değil → gönderilmez (brief: aynen kalır)', async () => {
    // ⚠ Bu kapı artık hiçbir değişkeni beslemiyor — `etkinlik_adi` kalktığı
    // için formata ihtiyaç yok. Brief'in açık talimatıyla korunuyor; sonucu
    // raporlandı: `Anadolu Yolculuğu` formatlı bir satırda ödemesi alınmış
    // kadına mail GİTMEZ ve tarama (a) aynı kapıya takılır.
    const { deps: d } = deps();
    const sonuc = await odemeBildir({ ...ONLINE, formatHam: 'Anadolu Yolculuğu' }, d);
    expect(sonuc.durum).toBe('atlandi');
    expect(sonuc.sebep).toContain('format kayıt formatı değil');
    expect(d.tasima).not.toHaveBeenCalled();
  });

  it('log e-posta ve ad TAŞIMAZ — yalnız Kayıt ID (CLAUDE.md §8)', async () => {
    const satirlar: string[] = [];
    for (const m of ['log', 'warn', 'error'] as const) {
      vi.spyOn(console, m).mockImplementation((...a: unknown[]) => void satirlar.push(a.join(' ')));
    }
    const { deps: d } = deps();
    await odemeBildir(ONLINE, d);
    await odemeBildir({ ...ONLINE, etkinlikSayisi: 3 }, d);
    const { deps: d2 } = deps({ ok: false });
    await odemeBildir(ONLINE, d2);
    expect(satirlar.length).toBeGreaterThan(0);
    for (const s of satirlar) {
      expect(s).not.toContain('test@ornek.invalid');
      expect(s).not.toContain('@');
      expect(s).not.toContain('Deniz');
      expect(s).toContain('OCAK-7K2M');
    }
  });
});

/**
 * B118 İŞ D — ölçüm adımının `odemeBildir` içindeki yeri ve yalıtımı.
 *
 * Kaan'ın koşulu 1: *"Mailden ve Mail Gitti yazımından sonra, kendi
 * try/catch'inde; dönüş değerini etkilemez (fail-open)."* Aşağıdaki testler
 * o cümlenin dört ayağını ayrı ayrı kilitliyor. Olayın İÇERİĞİ burada
 * ölçülmüyor — o `meta-olcum.test.ts`'te (31 test).
 */
describe('İŞ D — ölçüm adımı: yer, sıra, yalıtım', () => {
  /** Mail/işaret adımlarını izleyen, ölçüm adımını da sıraya yazan kurulum. */
  function izlemeliDeps(opts: {
    mailOk?: boolean;
    mailGittiFirlat?: boolean;
    olcumFirlat?: boolean;
    olcumVerme?: boolean;
  } = {}) {
    const sira: string[] = [];
    const olcumGirdileri: OdemeBildirGirdi[] = [];
    const d = {
      tasima: (async () => {
        sira.push('mail');
        return opts.mailOk === false ? { ok: false, hata: 'HTTP 500' } : { ok: true };
      }) as unknown as PostaTasima,
      mailGittiIsaretle: async () => {
        sira.push('mailGitti');
        if (opts.mailGittiFirlat) throw new Error('Notion düştü');
      },
      ...(opts.olcumVerme
        ? {}
        : {
            olcumGonder: async (g: OdemeBildirGirdi) => {
              sira.push('olcum');
              olcumGirdileri.push(g);
              if (opts.olcumFirlat) throw new Error('Meta düştü');
              return { durum: 'gonderildi' as const };
            },
          }),
    };
    return { sira, olcumGirdileri, deps: d };
  }

  it('SIRA: mail → Mail Gitti → ölçüm', async () => {
    const { sira, deps: d } = izlemeliDeps();
    await odemeBildir(ONLINE, d);
    expect(sira).toEqual(['mail', 'mailGitti', 'olcum']);
  });

  it('dönüş değeri DEĞİŞMİYOR — ölçüm adımı varken de `{yazildi, true}`', async () => {
    const { deps: d } = izlemeliDeps();
    expect(await odemeBildir(ONLINE, d)).toEqual({ durum: 'yazildi', mailGitti: true });
  });

  it('ölçüm adımı THROW ederse dönüş AYNI kalır ve hata dışarı sızmaz (fail-open)', async () => {
    const { sira, deps: d } = izlemeliDeps({ olcumFirlat: true });
    const sonuc = await odemeBildir(ONLINE, d);
    expect(sonuc).toEqual({ durum: 'yazildi', mailGitti: true });
    expect(sira).toEqual(['mail', 'mailGitti', 'olcum']);
  });

  it('MAİL BAŞARISIZSA ölçüm adımı HİÇ koşmaz', async () => {
    const { sira, deps: d } = izlemeliDeps({ mailOk: false });
    const sonuc = await odemeBildir(ONLINE, d);
    expect(sonuc.durum).toBe('hata');
    expect(sira).toEqual(['mail']);
  });

  it('ÖN KOŞUL tutmazsa (relation ≠ 1) ölçüm adımı HİÇ koşmaz', async () => {
    const { sira, deps: d } = izlemeliDeps();
    await odemeBildir({ ...ONLINE, etkinlikSayisi: 0 }, d);
    expect(sira).toEqual([]);
  });

  it('`Mail Gitti` YAZILAMASA BİLE ölçüm koşar — ödeme gerçekleşti, eksik olan iz', async () => {
    const { sira, deps: d } = izlemeliDeps({ mailGittiFirlat: true });
    const sonuc = await odemeBildir(ONLINE, d);
    expect(sira).toEqual(['mail', 'mailGitti', 'olcum']);
    // Dönüş eski davranışla BİREBİR: kısmi başarı, gerekçesiyle.
    expect(sonuc.durum).toBe('yazildi');
    expect(sonuc.mailGitti).toBe(false);
    expect(sonuc.sebep).toContain('Mail Gitti yazılamadı');
  });

  it('`olcumGonder` VERİLMEZSE İŞ D öncesiyle birebir aynı davranış', async () => {
    const { sira, deps: d } = izlemeliDeps({ olcumVerme: true });
    expect(await odemeBildir(ONLINE, d)).toEqual({ durum: 'yazildi', mailGitti: true });
    expect(sira).toEqual(['mail', 'mailGitti']);
  });

  it('ölçüm adımına GİRDİNİN TAMAMI geçiyor — dört İŞ D alanı dahil', async () => {
    const { olcumGirdileri, deps: d } = izlemeliDeps();
    const girdi: OdemeBildirGirdi = {
      ...ONLINE,
      tutar: 937.5,
      paraBirimiHam: 'TRY',
      olcumRizasi: true,
      olcumGitti: false,
    };
    await odemeBildir(girdi, d);
    expect(olcumGirdileri).toHaveLength(1);
    expect(olcumGirdileri[0]).toMatchObject({
      kayitId: 'OCAK-7K2M',
      pageId: 'page-uuid-1',
      tutar: 937.5,
      paraBirimiHam: 'TRY',
      olcumRizasi: true,
      olcumGitti: false,
    });
  });

  it('ölçüm hatası log\'a Kayıt ID ile düşüyor, e-posta/ad TAŞIMIYOR', async () => {
    const satirlar: string[] = [];
    for (const m of ['log', 'warn', 'error'] as const) {
      vi.spyOn(console, m).mockImplementation((...a: unknown[]) => void satirlar.push(a.join(' ')));
    }
    const { deps: d } = izlemeliDeps({ olcumFirlat: true });
    await odemeBildir(ONLINE, d);
    const olcumSatiri = satirlar.find((s) => s.includes('ölçüm adımı düştü'));
    expect(olcumSatiri).toBeDefined();
    expect(olcumSatiri).toContain('OCAK-7K2M');
    expect(olcumSatiri).not.toContain('@');
    expect(olcumSatiri).not.toContain('Deniz');
  });
});
