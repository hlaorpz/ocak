import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { kayitPostaPlani, type KayitPostaGirdi } from './kayit-posta.ts';
import { SABLON, SABLON_DEGISKENLERI } from './posta.ts';

/**
 * `lib/kayit-posta.ts` — kayıt anında hangi mail, hangi değişken.
 *
 * Kaan tablosu (7 Eki):
 *   ücretsiz → `yerin-hazir-*` · havale → `yerini-tutuyoruz` · kart → MAIL YOK
 *
 * Dosya `src/lib/` altında (KARAR 574).
 */

const BITIS = new Date('2026-10-02T12:00:00+03:00');

/** Online Açık Kapı, havale, ücretli. */
const TEMEL: KayitPostaGirdi = {
  referansNo: 'OCAK-7K2M',
  ad: 'Deniz Yıldırım',
  ucretliMi: true,
  yontem: 'havale',
  tutar: 225,
  paraBirimi: 'TRY',
  baslik: 'Elin Neyle Dolu?',
  slug: 'elin-neyle-dolu',
  tarihISO: '2026-10-12',
  tarihBitis: '',
  saat: '21:00',
  mekan: 'Online',
  katilimLinki: 'https://zoom.us/j/123',
  zoomSifresi: 'sifre42',
  konumDetay: '',
  yerTutmaBitisi: BITIS,
  odemeLinki: 'https://www.ocak.biz/odeme/devam?k=OCAK-7K2M&i=abc',
};

describe('kart — kayıt anında MAIL YOK', () => {
  it('kart + ücretli → plan null', () => {
    // Kadın formdan doğrudan N-Kolay ekranına düşüyor; o anda "yerini
    // tutuyoruz" demek henüz denemediği bir şeyin başarısızlığını varsaymak
    // olurdu. Ödemezse 30 dk sonra tarama hatırlatır, öderse callback gönderir.
    expect(kayitPostaPlani({ ...TEMEL, yontem: 'kart' })).toBeNull();
  });

  it('kart + ÜCRETSİZ → mail VAR (yöntem anlamsız, kapı açık)', () => {
    const p = kayitPostaPlani({ ...TEMEL, yontem: 'kart', ucretliMi: false, yerTutmaBitisi: null });
    expect(p?.sablon).toBe(SABLON.yerinHazirOnline);
  });
});

describe('havale — `yerini-tutuyoruz`', () => {
  it('kümesi tam ve değerler doğru', () => {
    const p = kayitPostaPlani(TEMEL)!;
    expect(p.sablon).toBe(SABLON.yeriniTutuyoruz);
    expect(Object.keys(p.degiskenler).sort()).toEqual(
      [...SABLON_DEGISKENLERI[SABLON.yeriniTutuyoruz]].sort(),
    );
    expect(p.degiskenler).toEqual({
      AD: 'Deniz',
      ETKINLIK_BASLIGI: 'Elin Neyle Dolu?',
      ETKINLIK_TARIHI: '12 Ekim 2026 · 21:00',
      TUTAR: '225 TL',
      REFERANS_NO: 'OCAK-7K2M',
      ODEME_LINKI: 'https://www.ocak.biz/odeme/devam?k=OCAK-7K2M&i=abc',
      ODEME_SON_AN: '2 Ekim Cuma, 12:00 (Türkiye saati)',
    });
  });

  it('`AD` yalnız İLK kelime — soyad maile girmez', () => {
    expect(kayitPostaPlani(TEMEL)!.degiskenler.AD).toBe('Deniz');
  });

  it('TUTAR etkinliğin para birimini taşır', () => {
    expect(kayitPostaPlani({ ...TEMEL, tutar: 30, paraBirimi: 'USD' })!.degiskenler.TUTAR)
      .toBe('30 USD');
  });

  it('⚠ `Yer Tutma Bitişi` YOKSA mail GİTMEZ — son an uydurulmaz', () => {
    // `ODEME_SON_AN` uydurmak kadına yanlış bir son an vermek olurdu.
    expect(kayitPostaPlani({ ...TEMEL, yerTutmaBitisi: null })).toBeNull();
  });

  it('kart devam linki boş gelse de mail gider (IBAN şablonda duruyor)', () => {
    // Sır yazılmamışsa link boş döner. Mailin öteki ödeme yolu — IBAN —
    // şablonda sabit, yani mail hâlâ işini yapıyor.
    const p = kayitPostaPlani({ ...TEMEL, odemeLinki: '' })!;
    expect(p.sablon).toBe(SABLON.yeriniTutuyoruz);
    expect(p.degiskenler.ODEME_LINKI).toBe('');
  });
});

describe('ücretsiz — `yerin-hazir-*`, mekâna göre', () => {
  const UCRETSIZ = { ...TEMEL, ucretliMi: false, yerTutmaBitisi: null };

  it('online kümesi tam', () => {
    const p = kayitPostaPlani(UCRETSIZ)!;
    expect(p.sablon).toBe(SABLON.yerinHazirOnline);
    expect(p.degiskenler).toEqual({
      AD: 'Deniz',
      ETKINLIK_BASLIGI: 'Elin Neyle Dolu?',
      ETKINLIK_TARIHI: '12 Ekim 2026 · 21:00',
      KATILIM_LINKI: 'https://zoom.us/j/123',
      ZOOM_SIFRESI: 'sifre42',
      ETKINLIK_URL: 'https://www.ocak.biz/etkinlik/elin-neyle-dolu',
    });
  });

  it('yüz yüze kümesi tam, YOL_TARIFI_LINKI dahil', () => {
    const p = kayitPostaPlani({
      ...UCRETSIZ,
      mekan: 'İstanbul',
      katilimLinki: '',
      zoomSifresi: '',
      konumDetay: 'Kadıköy, sokak 5',
      saat: '19:30',
    })!;
    expect(p.sablon).toBe(SABLON.yerinHazirYuzyuze);
    expect(Object.keys(p.degiskenler).sort()).toEqual(
      [...SABLON_DEGISKENLERI[SABLON.yerinHazirYuzyuze]].sort(),
    );
    expect(p.degiskenler.MEKAN).toBe('İstanbul');
    expect(p.degiskenler.ADRES).toBe('Kadıköy, sokak 5');
    expect(p.degiskenler.YOL_TARIFI_LINKI).toContain('google.com/maps');
    expect(p.degiskenler.ETKINLIK_TARIHI).toBe('12 Ekim 2026 · 19:30');
  });

  it('ücretsizde `yerTutmaBitisi` zaten yok — mail yine gider', () => {
    expect(kayitPostaPlani(UCRETSIZ)).not.toBeNull();
  });

  it('çok günlü buluşmada ETKINLIK_TARIHI aralık', () => {
    const p = kayitPostaPlani({ ...UCRETSIZ, tarihBitis: '2026-10-14' })!;
    expect(p.degiskenler.ETKINLIK_TARIHI).toBe('12 Ekim – 14 Ekim 2026');
  });

  it('Tarih boşsa ETKINLIK_TARIHI boş, Slug boşsa URL boş — uydurma yok', () => {
    const p = kayitPostaPlani({ ...UCRETSIZ, tarihISO: '', slug: '' })!;
    expect(p.degiskenler.ETKINLIK_TARIHI).toBe('');
    expect(p.degiskenler.ETKINLIK_URL).toBe('');
  });
});

/**
 * `api/kayit.ts` kaynak disiplini — route dosyası test edilemiyor
 * (`src/pages/` altı route), ölçüm kaynak-grep'iyle yapılıyor.
 *
 * ⚠ Ölçütler yorumları ELEYEREK çalışır. Bu turda MailerLite'ın NEDEN çıktığı
 * route'ta uzun bir yorum bloğu olarak duruyor ve o blok yasaklanan dizeleri
 * alıntılıyor; ham kaynak üzerinde ölçmek kendi anlatısına takılırdı
 * (`payment-provider.test.ts`'in iki kez düştüğü tuzak).
 */
describe('kaynak disiplini — MailerLite kayıt akışından ÇIKTI (B211 İŞ 2)', () => {
  const KAYNAK = readFileSync(join(__dirname, '..', 'pages', 'api', 'kayit.ts'), 'utf-8');
  const KOD = KAYNAK
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1');

  it('`mailerLiteEkle` ÇAĞRILMIYOR — yalnız tanımı duruyor (KIRPMA YASAĞI)', () => {
    // Fonksiyon silinmedi (CLAUDE.md §5); çağrılmıyor olması yeter.
    expect(KOD).toMatch(/async function mailerLiteEkle\(/);
    const cagrilar = KOD.match(/(?<!function )mailerLiteEkle\(\{/g) ?? [];
    expect(cagrilar).toHaveLength(0);
    expect(KOD).not.toMatch(/await mailerLiteEkle/);
  });

  it('`connect.mailerlite.com` yalnız ölü taşıma katmanında — akışta değil', () => {
    // Uç dizesi hâlâ dosyada (tanım içinde) ama onu çağıran yol yok.
    const fetchler = KOD.match(/connect\.mailerlite\.com/g) ?? [];
    expect(fetchler).toHaveLength(1);
  });

  it('kayıt maili Resend\'den gidiyor — plan + gönderim bağlı', () => {
    expect(KOD).toMatch(/kayitPostaPlani\(\{/);
    expect(KOD).toMatch(/await postaGonder\(/);
    expect(KOD).toMatch(/resendTasima\(\)/);
  });

  it('`Yer Tutma Bitişi` SAATLİ yazılıyor — gün damgasına kırpılmıyor', () => {
    // Üç saatlik kart süresi gün damgasına sığmaz; `slice(0,10)` kullanılırsa
    // tarama kart kayıtlarını hiç hatırlatamaz.
    expect(KOD).toMatch(/'Yer Tutma Bitişi'\]\s*=\s*\{ date: \{ start: yerTutmaBitisi\.toISOString\(\) \} \}/);
  });

  it('yanıt `postaGitti` taşıyor — İŞ 6 bu alana bakacak', () => {
    expect(KOD).toMatch(/postaGitti: postaOk/);
    // Eski `mailerlite` alanı yanıttan kalktı: abone yazımı değil gönderim
    // ölçülüyor artık.
    expect(KOD).not.toMatch(/\bmailerlite,/);
  });

  it('`Mail Gitti` yalnız ÜCRETSİZ kayıtta işaretlenir', () => {
    // Havale maili yerin tutulduğunu söylüyor, katılım bilgisini taşımıyor.
    // İşaretlenirse tarama (a) ödeme geldiğinde "maili zaten gitmiş" sanardı.
    expect(KOD).toMatch(/if \(sonuc\.ok && !odemeGerekli\)/);
  });
});
