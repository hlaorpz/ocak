import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  odemeBildir,
  odemeBildirAlanlari,
  odemeAlindiEkle,
  ODEME_ALINDI_EKI,
  ODEME_BILDIR_ALANLARI,
  type OdemeBildirGirdi,
} from './odeme-bildir.ts';

/**
 * `lib/odeme-bildir.ts` — B211 kart ayağı.
 *
 * ── Bu suite'in ölçtüğü soru ──
 * Ödeme onaylandığında MailerLite'a **doğru beş alan** gidiyor mu, ve
 * gitmemesi gereken durumlarda **hiç gitmiyor** mu.
 *
 * Bağımlılıklar enjekte ediliyor (`mailerLiteYaz` · `mailGittiIsaretle`):
 * `fetch` ve Notion route'ta yaşıyor (`api/odeme-callback.ts`), burada
 * sahteleri ölçülüyor. Route seviyesindeki soru — "reddedilen callback
 * bildirime ULAŞMIYOR mu" — `odeme-callback-muhafiz.test.ts`'te, gerçek
 * `POST` çağrısıyla ölçülüyor; iki yüzey ayrı, ikisi de gerekli.
 *
 * ⚠ Dosya `src/lib/` altında (KARAR 574). `src/pages/` altındaki her dosya
 * Astro için bir route'tur ve test oraya konursa build düşer — vitest
 * yeşilken.
 */

/** Online Açık Kapı — ölçülen canlı vakanın şekli (12 Ekim 2026). */
const GIRDI: OdemeBildirGirdi = {
  kayitId: 'OCAK-7K2M',
  pageId: 'page-uuid-1',
  email: 'test@ornek.invalid',
  etkinlikSayisi: 1,
  formatHam: 'Açık Kapı',
  seciliTarih: '12 Ekim 2026',
  mekanHam: 'Online',
  katilimLinkiHam: 'https://zoom.us/j/123',
  zoomSifresiHam: 'sifre42',
};

function deps(opts: { yazimOk?: boolean; yazimHata?: string; yazimThrow?: boolean; mailGittiThrow?: boolean } = {}) {
  const yazimlar: Array<{ email: string; alanlar: Record<string, string> }> = [];
  const isaretlenen: string[] = [];
  return {
    yazimlar,
    isaretlenen,
    deps: {
      mailerLiteYaz: vi.fn(async (email: string, alanlar: Record<string, string>) => {
        if (opts.yazimThrow) throw new Error('ağ düştü');
        yazimlar.push({ email, alanlar });
        return opts.yazimOk === false
          ? { ok: false, hata: opts.yazimHata ?? 'HTTP 500' }
          : { ok: true };
      }),
      mailGittiIsaretle: vi.fn(async (pageId: string) => {
        if (opts.mailGittiThrow) throw new Error('Notion düştü');
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

describe('odemeAlindiEkle — tetiği uyandıran ek, çift eklenmez', () => {
  // Ölçüm (7 Eki 2026): otomasyon `field_updated → etkinlik_adi` ile
  // tetikleniyor ve DEĞERİN DEĞİŞMESİ şart. Aynı değeri yeniden yazmak —
  // yanına `odeme_durumu=alindi` ve üç Zoom alanı konsa bile — koşturmadı.
  it('1 · ek değeri DEĞİŞTİRİR ve ekle biter', () => {
    const ozgun = 'Açık Kapı — 12 Ekim 2026';
    const ekli = odemeAlindiEkle(ozgun);
    expect(ekli).not.toBe(ozgun);
    expect(ekli.endsWith(ODEME_ALINDI_EKI.trim())).toBe(true);
    expect(ekli).toBe('Açık Kapı — 12 Ekim 2026 · ödeme alındı');
  });

  it('2 · zaten ekli değer İKİNCİ kez eklenmez', () => {
    const ekli = 'Açık Kapı — 12 Ekim 2026 · ödeme alındı';
    expect(odemeAlindiEkle(ekli)).toBe(ekli);
    // Üçüncü tur da aynı kalır — idempotent, "bir kez daha" değil.
    expect(odemeAlindiEkle(odemeAlindiEkle(ekli))).toBe(ekli);
  });

  it('boş değer boş kalır — ek tek başına anlamsız', () => {
    expect(odemeAlindiEkle('')).toBe('');
    expect(odemeAlindiEkle('   ')).toBe('');
  });
});

describe('odemeBildirAlanlari — beş alan, `muaf` yolunun eşlemesi', () => {
  it('anahtar kümesi TAM OLARAK beş alan — fazlası yok, eksiği yok', () => {
    const r = odemeBildirAlanlari(GIRDI);
    expect('alanlar' in r).toBe(true);
    const anahtarlar = Object.keys((r as { alanlar: Record<string, string> }).alanlar).sort();
    expect(anahtarlar).toEqual([...ODEME_BILDIR_ALANLARI].sort());
    // Kayıt anının on iki alanından yedisi BİLEREK dışarıda: kayıt anında
    // doğru yazıldılar, yeniden üretmek bayat veri yazma riskidir.
    expect(anahtarlar).toHaveLength(5);
    for (const yasak of ['etkinlik_basligi', 'etkinlik_url', 'etkinlik_tarihi', 'etkinlik_saati', 'etkinlik_mekan', 'etkinlik_adres', 'referans_no']) {
      expect(anahtarlar).not.toContain(yasak);
    }
  });

  it('online: üç Zoom alanı `muaf` yolunun değerleriyle dolu', () => {
    const { alanlar } = odemeBildirAlanlari(GIRDI) as { alanlar: Record<string, string> };
    expect(alanlar.odeme_durumu).toBe('alindi');
    expect(alanlar.zoom_link).toBe('https://zoom.us/j/123');
    // C-1 geriye uyum: `katilim_linki` AYNI değeri taşır (kayit.ts:500-502).
    expect(alanlar.katilim_linki).toBe('https://zoom.us/j/123');
    expect(alanlar.zoom_sifresi).toBe('sifre42');
    expect(alanlar.etkinlik_adi).toBe('Açık Kapı — 12 Ekim 2026 · ödeme alındı');
  });

  it('yüz yüze: üç Zoom alanı BOŞ — dal seçimi otomasyonun işi', () => {
    // Otomasyon `zoom_link` boş mu diye bakıp Mail 2 ile Mail 3 arasında
    // seçiyor. Kod dal seçmez; `muaf` yolunda ne ise o yazılır.
    const { alanlar } = odemeBildirAlanlari({
      ...GIRDI,
      mekanHam: 'İstanbul',
      katilimLinkiHam: 'Kadıköy, sokak 5',
      zoomSifresiHam: '',
    }) as { alanlar: Record<string, string> };
    expect(alanlar.zoom_link).toBe('');
    expect(alanlar.katilim_linki).toBe('');
    expect(alanlar.zoom_sifresi).toBe('');
    // Ama ek ve durum yine gider — tetik yüz yüzede de koşmalı.
    expect(alanlar.odeme_durumu).toBe('alindi');
    expect(alanlar.etkinlik_adi).toBe('Açık Kapı — 12 Ekim 2026 · ödeme alındı');
  });

  it('`etkinlik_adi` kayıt anındaki kurucuyla üretilir — yedi format', () => {
    const beklenen: Array<[string, string]> = [
      ['Çember', 'Çember — 12 Ekim 2026 · ödeme alındı'],
      ['Açık Kapı', 'Açık Kapı — 12 Ekim 2026 · ödeme alındı'],
      ['Mini Retreat', 'Mini Retreat — 12 Ekim 2026 · ödeme alındı'],
      ['Şehir Akşamı', 'Şehir Akşamı — 12 Ekim 2026 · ödeme alındı'],
      ['Seremoni', 'Seremoni — 12 Ekim 2026 · ödeme alındı'],
      ['Atölye', 'Atölye — 12 Ekim 2026 · ödeme alındı'],
      ['Yolculuk', 'Yolculuk — 12 Ekim 2026 · ödeme alındı'],
    ];
    for (const [formatHam, bekle] of beklenen) {
      const r = odemeBildirAlanlari({ ...GIRDI, formatHam }) as { alanlar: Record<string, string> };
      expect(r.alanlar.etkinlik_adi).toBe(bekle);
    }
  });

  it('`Anadolu Yolculuğu` bir KayitFormat değil → hata döner, tahmin edilmez', () => {
    // `FORMAT_KATEGORI` onu `anadolu`ya çözüyor ama `FORMAT_TIP`'te o anahtar
    // YOK. Uydurmak yerine durulur (Kaan onayı, 7 Eki).
    const r = odemeBildirAlanlari({ ...GIRDI, formatHam: 'Anadolu Yolculuğu' });
    expect('hata' in r).toBe(true);
    expect((r as { hata: string }).hata).toContain('format cozulemedi');
  });

  it('bilinmeyen/boş Format → hata', () => {
    expect('hata' in odemeBildirAlanlari({ ...GIRDI, formatHam: '' })).toBe(true);
    expect('hata' in odemeBildirAlanlari({ ...GIRDI, formatHam: 'Kahve Sohbeti' })).toBe(true);
  });
});

describe('odemeBildir — yazım · Mail Gitti · hata yalıtımı', () => {
  it('4 · başarılıysa MailerLite beş alanı alır ve `Mail Gitti` YAZILIR', async () => {
    const { deps: d, yazimlar, isaretlenen } = deps();
    const sonuc = await odemeBildir(GIRDI, d);
    expect(sonuc).toEqual({ durum: 'yazildi', mailGitti: true });
    expect(yazimlar).toHaveLength(1);
    expect(yazimlar[0].email).toBe('test@ornek.invalid');
    expect(Object.keys(yazimlar[0].alanlar).sort()).toEqual([...ODEME_BILDIR_ALANLARI].sort());
    expect(isaretlenen).toEqual(['page-uuid-1']);
  });

  it('3 · MailerLite hata verirse `Mail Gitti` YAZILMAZ ve throw EDİLMEZ', async () => {
    const { deps: d, isaretlenen } = deps({ yazimOk: false, yazimHata: 'HTTP 422 alan yok' });
    const sonuc = await odemeBildir(GIRDI, d);
    expect(sonuc.durum).toBe('hata');
    expect(sonuc.mailGitti).toBe(false);
    expect(sonuc.sebep).toContain('HTTP 422');
    // Callback'in gördüğü tek şey bu nesne — ödeme onayı etkilenmez.
    expect(isaretlenen).toEqual([]);
  });

  it('3b · transport THROW ederse de yalıtılır — çağrı reject ETMEZ', async () => {
    const { deps: d, isaretlenen } = deps({ yazimThrow: true });
    const sonuc = await odemeBildir(GIRDI, d);
    expect(sonuc.durum).toBe('hata');
    expect(isaretlenen).toEqual([]);
  });

  it('`Mail Gitti` yazımı patlarsa durum `yazildi` KALIR — MailerLite aldı', async () => {
    // Başarıyı hataya çevirmek, sonraki turda "mail gitmedi" sanılıp ikinci
    // kez yazılmasına yol açardı.
    const { deps: d, yazimlar } = deps({ mailGittiThrow: true });
    const sonuc = await odemeBildir(GIRDI, d);
    expect(sonuc.durum).toBe('yazildi');
    expect(sonuc.mailGitti).toBe(false);
    expect(yazimlar).toHaveLength(1);
  });

  it('5 · relation SIFIR öğeli → MailerLite ÇAĞRILMAZ', async () => {
    const { deps: d, yazimlar, isaretlenen } = deps();
    const sonuc = await odemeBildir({ ...GIRDI, etkinlikSayisi: 0 }, d);
    expect(sonuc.durum).toBe('atlandi');
    expect(d.mailerLiteYaz).not.toHaveBeenCalled();
    expect(yazimlar).toEqual([]);
    expect(isaretlenen).toEqual([]);
  });

  it('5b · relation ÇOK öğeli → MailerLite ÇAĞRILMAZ (OCAK-3HX6 vakası)', async () => {
    // İki Açık Kapı taşıyan satır; ikisinin Zoom linki ayrı. Hangisinin
    // gideceğini kod tahmin etmez.
    const { deps: d } = deps();
    const sonuc = await odemeBildir({ ...GIRDI, etkinlikSayisi: 2 }, d);
    expect(sonuc.durum).toBe('atlandi');
    expect(sonuc.sebep).toContain('öğe=2');
    expect(d.mailerLiteYaz).not.toHaveBeenCalled();
    expect(d.mailGittiIsaretle).not.toHaveBeenCalled();
  });

  it('format çözülemezse MailerLite ÇAĞRILMAZ, `Mail Gitti` yazılmaz', async () => {
    const { deps: d } = deps();
    const sonuc = await odemeBildir({ ...GIRDI, formatHam: 'Anadolu Yolculuğu' }, d);
    expect(sonuc.durum).toBe('atlandi');
    expect(d.mailerLiteYaz).not.toHaveBeenCalled();
    expect(d.mailGittiIsaretle).not.toHaveBeenCalled();
  });

  it('Email boşsa ÇAĞRILMAZ — upsert\'in kimliği yok', async () => {
    const { deps: d } = deps();
    const sonuc = await odemeBildir({ ...GIRDI, email: '  ' }, d);
    expect(sonuc.durum).toBe('atlandi');
    expect(d.mailerLiteYaz).not.toHaveBeenCalled();
  });

  it('log e-posta adresi TAŞIMAZ — yalnız Kayıt ID (CLAUDE.md §8)', async () => {
    const satirlar: string[] = [];
    vi.spyOn(console, 'log').mockImplementation((...a: unknown[]) => void satirlar.push(a.join(' ')));
    vi.spyOn(console, 'warn').mockImplementation((...a: unknown[]) => void satirlar.push(a.join(' ')));
    vi.spyOn(console, 'error').mockImplementation((...a: unknown[]) => void satirlar.push(a.join(' ')));
    const { deps: d } = deps();
    await odemeBildir(GIRDI, d);
    await odemeBildir({ ...GIRDI, etkinlikSayisi: 3 }, d);
    const { deps: d2 } = deps({ yazimOk: false });
    await odemeBildir(GIRDI, d2);
    expect(satirlar.length).toBeGreaterThan(0);
    for (const s of satirlar) {
      expect(s).not.toContain('test@ornek.invalid');
      expect(s).not.toContain('@');
      expect(s).toContain('OCAK-7K2M');
    }
  });
});
