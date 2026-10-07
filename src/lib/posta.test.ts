import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  postaGonder,
  tutarMetni,
  yolTarifiLinki,
  yerinHazirSablonu,
  SABLON,
  SABLON_DEGISKENLERI,
  POSTA_FROM,
  POSTA_REPLY_TO,
  type PostaTasima,
} from './posta.ts';

/**
 * `lib/posta.ts` — Resend posta katmanı.
 *
 * Taşıma enjekte ediliyor; gerçek `fetch`/Resend çağrısı burada koşmaz.
 * Ölçülen şey: hangi şablona hangi değişken kümesiyle gidiliyor, konu
 * gönderiliyor mu, hata nasıl yalıtılıyor, log ne taşıyor.
 *
 * Dosya `src/lib/` altında (KARAR 574).
 */

function tasimaSahtesi(opts: { ok?: boolean; hata?: string; firlat?: boolean } = {}) {
  const cagrilar: Parameters<PostaTasima>[0][] = [];
  const tasima: PostaTasima = vi.fn(async (istek) => {
    if (opts.firlat) throw new Error('ağ düştü');
    cagrilar.push(istek);
    return opts.ok === false ? { ok: false, hata: opts.hata ?? 'HTTP 500' } : { ok: true };
  });
  return { tasima, cagrilar };
}

const TAM = {
  [SABLON.yeriniTutuyoruz]: {
    AD: 'Deniz', ETKINLIK_BASLIGI: 'Elin Neyle Dolu?', ETKINLIK_TARIHI: '12 Ekim 2026 · 21:00',
    TUTAR: '750', REFERANS_NO: 'OCAK-7K2M',
    ODEME_LINKI: 'https://www.ocak.biz/odeme/devam?k=OCAK-7K2M&i=abc',
    ODEME_SON_AN: '8 Ekim Perşembe, 14:30 (Türkiye saati)',
  },
  [SABLON.yerinHazirOnline]: {
    AD: 'Deniz', ETKINLIK_BASLIGI: 'Elin Neyle Dolu?', ETKINLIK_TARIHI: '12 Ekim 2026 · 21:00',
    KATILIM_LINKI: 'https://zoom.us/j/123', ZOOM_SIFRESI: 'sifre42',
    ETKINLIK_URL: 'https://www.ocak.biz/etkinlik/elin-neyle-dolu',
  },
  [SABLON.yerinHazirYuzyuze]: {
    AD: 'Deniz', ETKINLIK_BASLIGI: 'Ekmeden Önce', ETKINLIK_TARIHI: '28 Kasım 2026 · 19:30',
    MEKAN: 'İstanbul', ADRES: 'Kadıköy, sokak 5',
    ETKINLIK_URL: 'https://www.ocak.biz/etkinlik/ekmeden-once',
    YOL_TARIFI_LINKI: 'https://www.google.com/maps/search/?api=1&query=Kad%C4%B1k%C3%B6y',
  },
} as const;

beforeEach(() => {
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => vi.restoreAllMocks());

describe('postaGonder — şablon takma adı + değişkenler', () => {
  it('takma ad `template.id`\'ye yazılır, `subject` GÖNDERİLMEZ', () => {
    // Kaan kararı 5: konu şablonda yaşar. Ayrıca Resend `template` ile birlikte
    // `html`/`text`/`react` göndermeyi doğrulama hatasıyla reddediyor.
    const { tasima, cagrilar } = tasimaSahtesi();
    return postaGonder(
      { sablon: SABLON.yeriniTutuyoruz, alici: 'a@b.invalid', degiskenler: { ...TAM[SABLON.yeriniTutuyoruz] }, kayitId: 'OCAK-7K2M' },
      tasima,
    ).then((r) => {
      expect(r.ok).toBe(true);
      expect(cagrilar).toHaveLength(1);
      expect(cagrilar[0].template.id).toBe('yerini-tutuyoruz');
      expect(cagrilar[0]).not.toHaveProperty('subject');
      expect(cagrilar[0]).not.toHaveProperty('html');
      expect(cagrilar[0]).not.toHaveProperty('text');
      expect(cagrilar[0].from).toBe(POSTA_FROM);
      expect(cagrilar[0].replyTo).toBe(POSTA_REPLY_TO);
      expect(cagrilar[0].to).toBe('a@b.invalid');
    });
  });

  it('gönderen ve yanıt adresi Kaan kararı 4 ile birebir', () => {
    expect(POSTA_FROM).toBe('OCAK <selam@mail.ocak.biz>');
    expect(POSTA_REPLY_TO).toBe('selam@ocak.biz');
  });

  it('üç şablonun üçü de kendi TAM kümesiyle geçer', async () => {
    for (const sablon of [SABLON.yeriniTutuyoruz, SABLON.yerinHazirOnline, SABLON.yerinHazirYuzyuze]) {
      const { tasima, cagrilar } = tasimaSahtesi();
      const r = await postaGonder(
        { sablon, alici: 'a@b.invalid', degiskenler: { ...TAM[sablon] }, kayitId: 'OCAK-7K2M' },
        tasima,
      );
      expect(r.ok).toBe(true);
      expect(Object.keys(cagrilar[0].template.variables).sort()).toEqual(
        [...SABLON_DEGISKENLERI[sablon]].sort(),
      );
    }
  });

  it('EKSİK değişken → gönderim YAPILMAZ, ağa çıkılmaz', async () => {
    // Resend tanımsız değişkeni sessizce boş basıyor; kapı ağ çağrısından
    // ÖNCE kapanmalı ki eksik dolu bir mail hiç doğmasın.
    const { tasima } = tasimaSahtesi();
    const { ODEME_SON_AN, ...eksik } = TAM[SABLON.yeriniTutuyoruz];
    const r = await postaGonder(
      { sablon: SABLON.yeriniTutuyoruz, alici: 'a@b.invalid', degiskenler: eksik, kayitId: 'OCAK-7K2M' },
      tasima,
    );
    expect(r.ok).toBe(false);
    expect(r.hata).toContain('eksik=[ODEME_SON_AN]');
    expect(tasima).not.toHaveBeenCalled();
  });

  it('FAZLA değişken → gönderim YAPILMAZ', async () => {
    const { tasima } = tasimaSahtesi();
    const r = await postaGonder(
      {
        sablon: SABLON.yerinHazirOnline,
        alici: 'a@b.invalid',
        degiskenler: { ...TAM[SABLON.yerinHazirOnline], TUTAR: '750' },
        kayitId: 'OCAK-7K2M',
      },
      tasima,
    );
    expect(r.ok).toBe(false);
    expect(r.hata).toContain('fazla=[TUTAR]');
    expect(tasima).not.toHaveBeenCalled();
  });

  it('alıcı boşsa gönderim YAPILMAZ', async () => {
    const { tasima } = tasimaSahtesi();
    const r = await postaGonder(
      { sablon: SABLON.yeriniTutuyoruz, alici: '  ', degiskenler: { ...TAM[SABLON.yeriniTutuyoruz] }, kayitId: 'OCAK-7K2M' },
      tasima,
    );
    expect(r.ok).toBe(false);
    expect(tasima).not.toHaveBeenCalled();
  });

  it('taşıma hata dönerse `{ ok: false }` — THROW ETMEZ', async () => {
    const { tasima } = tasimaSahtesi({ ok: false, hata: 'HTTP 422 template not published' });
    const r = await postaGonder(
      { sablon: SABLON.yeriniTutuyoruz, alici: 'a@b.invalid', degiskenler: { ...TAM[SABLON.yeriniTutuyoruz] }, kayitId: 'OCAK-7K2M' },
      tasima,
    );
    expect(r.ok).toBe(false);
    expect(r.hata).toContain('not published');
  });

  it('taşıma THROW ederse de yalıtılır', async () => {
    const { tasima } = tasimaSahtesi({ firlat: true });
    const r = await postaGonder(
      { sablon: SABLON.yeriniTutuyoruz, alici: 'a@b.invalid', degiskenler: { ...TAM[SABLON.yeriniTutuyoruz] }, kayitId: 'OCAK-7K2M' },
      tasima,
    );
    expect(r.ok).toBe(false);
    expect(r.hata).toContain('taşıma düştü');
  });

  it('log\'da e-posta, ad ve telefon GEÇMEZ — yalnız Kayıt ID', async () => {
    const satirlar: string[] = [];
    vi.spyOn(console, 'log').mockImplementation((...a: unknown[]) => void satirlar.push(a.join(' ')));
    vi.spyOn(console, 'error').mockImplementation((...a: unknown[]) => void satirlar.push(a.join(' ')));
    const { tasima } = tasimaSahtesi();
    await postaGonder(
      { sablon: SABLON.yeriniTutuyoruz, alici: 'deniz@ornek.invalid', degiskenler: { ...TAM[SABLON.yeriniTutuyoruz] }, kayitId: 'OCAK-7K2M' },
      tasima,
    );
    const { tasima: t2 } = tasimaSahtesi({ ok: false });
    await postaGonder(
      { sablon: SABLON.yerinHazirOnline, alici: 'deniz@ornek.invalid', degiskenler: { ...TAM[SABLON.yerinHazirOnline] }, kayitId: 'OCAK-7K2M' },
      t2,
    );
    expect(satirlar.length).toBeGreaterThan(0);
    for (const s of satirlar) {
      expect(s).not.toContain('deniz@ornek.invalid');
      expect(s).not.toContain('@');
      expect(s).not.toContain('Deniz');
      expect(s).toContain('OCAK-7K2M');
    }
  });
});

describe('tutarMetni — tam sayı + BİRİM (şablon kurulumu, 7 Eki)', () => {
  it('TRY ve BOŞ → "TL"', () => {
    // Boşun TL'ye düşmesi `api/kayit.ts:185`'in `?? 'TRY'` varsayılanıyla aynı;
    // iki yerde iki farklı varsayılan aynı kaydın iki yüzeyinde iki farklı
    // birim demekti.
    expect(tutarMetni(225, 'TRY')).toBe('225 TL');
    expect(tutarMetni(225, '')).toBe('225 TL');
    expect(tutarMetni(225, null)).toBe('225 TL');
    expect(tutarMetni(225)).toBe('225 TL');
  });

  it('USD ve EUR kendi kodlarıyla', () => {
    expect(tutarMetni(30, 'USD')).toBe('30 USD');
    expect(tutarMetni(30, 'EUR')).toBe('30 EUR');
  });

  it('küçük harf birim normalize edilir', () => {
    expect(tutarMetni(30, 'usd')).toBe('30 USD');
    expect(tutarMetni(225, 'try')).toBe('225 TL');
  });

  it('kuruş yuvarlanır — aşağı kesmek eksik tutar söylerdi', () => {
    expect(tutarMetni(1234.56, 'TRY')).toBe('1235 TL');
    expect(tutarMetni(1234.4, 'TRY')).toBe('1234 TL');
  });

  it('sıfır/negatif/NaN → boş', () => {
    expect(tutarMetni(0, 'TRY')).toBe('');
    expect(tutarMetni(-5, 'TRY')).toBe('');
    expect(tutarMetni(Number.NaN, 'TRY')).toBe('');
  });
});

describe('yolTarifiLinki — yüz yüze şablonunun yeni değişkeni', () => {
  it('adres Maps aramasına çevrilir, URL-kodlanır', () => {
    expect(yolTarifiLinki('Kadıköy, sokak 5', 'https://www.ocak.biz/etkinlik/x')).toBe(
      'https://www.google.com/maps/search/?api=1&query=Kad%C4%B1k%C3%B6y%2C%20sokak%205',
    );
  });

  it('Konum Detay boşsa ETKINLIK_URL\'e düşer', () => {
    // Boş bir Maps aramasına götürmek kadını "sonuç bulunamadı" ekranında
    // bırakmak olurdu.
    expect(yolTarifiLinki('', 'https://www.ocak.biz/etkinlik/x')).toBe(
      'https://www.ocak.biz/etkinlik/x',
    );
    expect(yolTarifiLinki('   ', 'https://www.ocak.biz/etkinlik/x')).toBe(
      'https://www.ocak.biz/etkinlik/x',
    );
  });

  it('ikisi de boşsa boş — kırık bağlantı basılmaz', () => {
    expect(yolTarifiLinki('', '')).toBe('');
  });

  it('yalnız yüz yüze şablonunda var, online\'da YOK', () => {
    expect(SABLON_DEGISKENLERI[SABLON.yerinHazirYuzyuze]).toContain('YOL_TARIFI_LINKI');
    expect(SABLON_DEGISKENLERI[SABLON.yerinHazirOnline]).not.toContain('YOL_TARIFI_LINKI');
    expect(SABLON_DEGISKENLERI[SABLON.yeriniTutuyoruz]).not.toContain('YOL_TARIFI_LINKI');
  });
});

describe('yerinHazirSablonu — dal artık KODDA, otomasyonda değil', () => {
  it('Online ve Zoom → online şablonu', () => {
    expect(yerinHazirSablonu('Online')).toBe('yerin-hazir-online');
    expect(yerinHazirSablonu('Zoom')).toBe('yerin-hazir-online');
  });

  it('şehirler → yüz yüze şablonu', () => {
    for (const m of ['İstanbul', 'İzmir', 'Ankara', 'Ege', 'Anadolu']) {
      expect(yerinHazirSablonu(m)).toBe('yerin-hazir-yuzyuze');
    }
  });

  it('boş/bilinmeyen mekân → yüz yüze (online varsayılmaz)', () => {
    // Online varsayılsaydı mekânı boş bir kayıtta kadına Zoom linki olmayan
    // bir "online" mail giderdi; yüz yüze şablonu en az adresi soruyor.
    expect(yerinHazirSablonu('')).toBe('yerin-hazir-yuzyuze');
    expect(yerinHazirSablonu('Kapadokya')).toBe('yerin-hazir-yuzyuze');
  });
});
