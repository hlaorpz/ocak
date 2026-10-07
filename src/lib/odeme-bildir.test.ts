import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  odemeBildir,
  odemeBildirAlanlari,
  odemeAlindiEkle,
  ODEME_ALINDI_EKI,
  ODEME_BILDIR_ALANLARI,
  type OdemeBildirGirdi,
} from './odeme-bildir.ts';
import { MAILERLITE_ALANLAR } from './kayit.ts';

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
  basligHam: 'Elin Neyle Dolu?',
  slugHam: 'elin-neyle-dolu',
  tarihISOHam: '2026-10-12',
  saatHam: '20:00',
  konumDetayHam: '',
};

/**
 * İKİNCİ etkinlik — hiçbir alanı birinciyle çakışmaz. "Abonede birinciden
 * kalan değer var mı" sorusunu ölçebilmek için her alan ayırt edici.
 */
const IKINCI: OdemeBildirGirdi = {
  kayitId: 'OCAK-9ZQ1',
  pageId: 'page-uuid-2',
  email: 'test@ornek.invalid',
  etkinlikSayisi: 1,
  formatHam: 'Çember',
  seciliTarih: '28 Kasım 2026',
  mekanHam: 'İstanbul',
  katilimLinkiHam: '',
  zoomSifresiHam: '',
  basligHam: 'Ekmeden Önce',
  slugHam: 'ekmeden-once',
  tarihISOHam: '2026-11-28',
  saatHam: '19:30',
  konumDetayHam: 'Kadıköy, sokak 5',
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

const alanlariniAl = (g: OdemeBildirGirdi) =>
  (odemeBildirAlanlari(g) as { alanlar: Record<string, string> }).alanlar;

describe('odemeBildirAlanlari — on iki alan, `muaf` yolunun eşlemesi', () => {
  it('anahtar kümesi TAM OLARAK `MAILERLITE_ALANLAR` — fazlası yok, eksiği yok', () => {
    const anahtarlar = Object.keys(alanlariniAl(GIRDI)).sort();
    expect(anahtarlar).toEqual([...ODEME_BILDIR_ALANLARI].sort());
    expect(anahtarlar).toEqual([...MAILERLITE_ALANLAR].sort());
    expect(anahtarlar).toHaveLength(12);
    // Kayıt anının HİÇBİR etkinlik alanı dışarıda bırakılmadı — beş alanlık
    // ilk hâlin kusuru buydu (dosya başı: abone tek, alanlar ikinci kayıtta
    // ezilmiş olabilir).
    for (const alan of ['etkinlik_basligi', 'etkinlik_url', 'etkinlik_tarihi', 'etkinlik_saati', 'etkinlik_mekan', 'etkinlik_adres', 'referans_no']) {
      expect(anahtarlar).toContain(alan);
    }
    // `name`/`last_name` custom field DEĞİL — payload'a girmez.
    expect(anahtarlar).not.toContain('name');
    expect(anahtarlar).not.toContain('last_name');
  });

  it('online: on iki alanın hepsi kaydın KENDİ etkinliğinden', () => {
    const a = alanlariniAl(GIRDI);
    expect(a.odeme_durumu).toBe('alindi');
    expect(a.zoom_link).toBe('https://zoom.us/j/123');
    // C-1 geriye uyum: `katilim_linki` AYNI değeri taşır (kayit.ts:500-502).
    expect(a.katilim_linki).toBe('https://zoom.us/j/123');
    expect(a.zoom_sifresi).toBe('sifre42');
    expect(a.etkinlik_adi).toBe('Açık Kapı — 12 Ekim 2026 · ödeme alındı');
    expect(a.etkinlik_basligi).toBe('Elin Neyle Dolu?');
    expect(a.etkinlik_url).toBe('https://www.ocak.biz/etkinlik/elin-neyle-dolu');
    expect(a.etkinlik_tarihi).toBe('12 Ekim 2026');
    expect(a.etkinlik_saati).toBe('20:00');
    expect(a.referans_no).toBe('OCAK-7K2M');
    // Online'da mekân ve adres BOŞ — `mailerLiteCustomFields`'in kuralı.
    expect(a.etkinlik_mekan).toBe('');
    expect(a.etkinlik_adres).toBe('');
  });

  it('yüz yüze: üç Zoom alanı BOŞ, mekân + adres DOLU', () => {
    // Otomasyon `zoom_link` boş mu diye bakıp Mail 2 ile Mail 3 arasında
    // seçiyor. Kod dal seçmez; `muaf` yolunda ne ise o yazılır.
    const a = alanlariniAl(IKINCI);
    expect(a.zoom_link).toBe('');
    expect(a.katilim_linki).toBe('');
    expect(a.zoom_sifresi).toBe('');
    expect(a.etkinlik_mekan).toBe('İstanbul');
    expect(a.etkinlik_adres).toBe('Kadıköy, sokak 5');
    expect(a.etkinlik_saati).toBe('19:30');
    // Ek ve durum yine gider — tetik yüz yüzede de koşmalı.
    expect(a.odeme_durumu).toBe('alindi');
    expect(a.etkinlik_adi).toBe('Çember — 28 Kasım 2026 · ödeme alındı');
  });

  it('`Seçilen Tarih` boşsa `etkinlik_tarihi` Notion ISO\'sundan Türkçe\'ye çevrilir', () => {
    // `api/kayit.ts:746` ile birebir aynı yedek. Uydurma YOK: ISO da boşsa
    // alan boş gider.
    const a = alanlariniAl({ ...GIRDI, seciliTarih: '   ' });
    expect(a.etkinlik_tarihi).toBe('12 Ekim 2026');
    // `etkinlik_adi` ise tarihsiz kalır — kurucunun kuralı (sadece TIP).
    expect(a.etkinlik_adi).toBe('Açık Kapı · ödeme alındı');
    const bos = alanlariniAl({ ...GIRDI, seciliTarih: '', tarihISOHam: '' });
    expect(bos.etkinlik_tarihi).toBe('');
  });

  it('Slug boşsa `etkinlik_url` BOŞ — kırık taban URL üretilmez', () => {
    const a = alanlariniAl({ ...GIRDI, slugHam: '' });
    expect(a.etkinlik_url).toBe('');
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
  it('4 · başarılıysa MailerLite on iki alanı alır ve `Mail Gitti` YAZILIR', async () => {
    const { deps: d, yazimlar, isaretlenen } = deps();
    const sonuc = await odemeBildir(GIRDI, d);
    expect(sonuc).toEqual({ durum: 'yazildi', mailGitti: true });
    expect(yazimlar).toHaveLength(1);
    expect(yazimlar[0].email).toBe('test@ornek.invalid');
    expect(Object.keys(yazimlar[0].alanlar).sort()).toEqual([...ODEME_BILDIR_ALANLARI].sort());
    expect(isaretlenen).toEqual(['page-uuid-1']);
  });

  it('⚠ İKİNCİ etkinlik: payload YALNIZ kendi etkinliğini taşır, birinciden kalan YOK', async () => {
    // Kusurun tam şekli (7 Eki düzeltmesi): MailerLite'ta kişi başına TEK
    // abone var. Kadın ilk etkinliğe kayıt olup ödemeden, ikinci etkinliğe
    // kayıt olursa `/api/kayit` etkinlik alanlarını İKİNCİ'ye göre ezer.
    // Beş alanlık yazım o hâlde ikinci etkinliğin başlığı/tarihi altında
    // BİRİNCİnin Zoom linkini gönderirdi.
    //
    // Burada ardışık iki çağrı aynı aboneye gidiyor; ölçülen şey ikinci
    // payload'ın birinciden HİÇBİR değer taşımaması.
    const { deps: d, yazimlar } = deps();
    await odemeBildir(GIRDI, d);
    await odemeBildir(IKINCI, d);
    expect(yazimlar).toHaveLength(2);
    const ikinci = yazimlar[1].alanlar;

    // İkinci etkinliğin KENDİ değerleri — on iki alanın hepsi.
    expect(ikinci).toEqual({
      odeme_durumu: 'alindi',
      etkinlik_adi: 'Çember — 28 Kasım 2026 · ödeme alındı',
      etkinlik_basligi: 'Ekmeden Önce',
      etkinlik_url: 'https://www.ocak.biz/etkinlik/ekmeden-once',
      etkinlik_tarihi: '28 Kasım 2026',
      etkinlik_saati: '19:30',
      etkinlik_mekan: 'İstanbul',
      etkinlik_adres: 'Kadıköy, sokak 5',
      katilim_linki: '',
      zoom_link: '',
      zoom_sifresi: '',
      referans_no: 'OCAK-9ZQ1',
    });

    // Birincinin HİÇBİR ayırt edici değeri ikinci payload'da geçmiyor.
    // ⚠ Boş string ARANMAZ: ikinci payload'da meşru boş alanlar var ve
    // `''` her yerde "bulunur". Yalnız dolu, ayırt edici değerler.
    const birinciDegerleri = Object.values(yazimlar[0].alanlar).filter(
      (v) => v && v !== 'alindi',
    );
    expect(birinciDegerleri.length).toBeGreaterThan(5);
    for (const v of birinciDegerleri) {
      expect(Object.values(ikinci)).not.toContain(v);
    }
    // Özellikle: birincinin Zoom linki ikinci payload'da BOŞLANIYOR —
    // "yazılmadı" değil, aboneden SİLİNİYOR (alan hijyeni, kayit.ts).
    expect(ikinci.zoom_link).toBe('');
    expect(ikinci.katilim_linki).toBe('');
    expect(ikinci.zoom_sifresi).toBe('');
    expect('zoom_link' in ikinci).toBe(true);
  });

  it('ters sıra da tutar — yüz yüze sonra online, adres aboneden silinir', async () => {
    // Simetri: fiziksel etkinliğin adresi online bir ödemede yerinde kalmaz.
    const { deps: d, yazimlar } = deps();
    await odemeBildir(IKINCI, d);
    await odemeBildir(GIRDI, d);
    const ikinci = yazimlar[1].alanlar;
    expect(ikinci.etkinlik_adres).toBe('');
    expect(ikinci.etkinlik_mekan).toBe('');
    expect(ikinci.etkinlik_basligi).toBe('Elin Neyle Dolu?');
    expect(ikinci.zoom_link).toBe('https://zoom.us/j/123');
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
