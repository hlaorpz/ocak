import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  FORMAT_TIP,
  FORMAT_NOTION_FORMAT,
  FORMAT_MAILERLITE_GROUP,
  isKayitFormat,
  parseKayitSorulari,
  resolveMiniCtaBtn,
  katilimTipiCoz,
  mailerLiteCustomFields,
  etkinlikAdiFormatla,
  tarihTrFormat,
  uretReferansNo,
  uretBenzersizReferansNo,
  type KayitFormat,
} from './kayit';

afterEach(() => {
  vi.restoreAllMocks();
});

// Brief 3 KARAR 206 + brief-cc-yolculuk-format-v2 — 7 formatın hepsinin
// map'lerde tam olduğunu kapsar. Eksik bir format eklersek, her dört map'in
// de güncellenmesini bu testler zorunlu kılar. 'Anadolu Yolculuğu' KayitFormat
// DEĞİL — kayıt route'u ayrı (/anadolu/basvuru), Format enum'unda ama slug map'lerinde yok.

const TUM_FORMATLAR: KayitFormat[] = [
  'cember',
  'acik-kapi',
  'mini-retreat',
  'sehir-aksami',
  'seremoni',
  'atolye',
  'yolculuk',
];

describe('kayit map\'leri (Brief 2A + Brief 3 + Yolculuk v2)', () => {
  it('isKayitFormat 7 format için true', () => {
    for (const f of TUM_FORMATLAR) expect(isKayitFormat(f)).toBe(true);
  });

  it('isKayitFormat bilinmeyen için false', () => {
    expect(isKayitFormat('anadolu')).toBe(false);
    expect(isKayitFormat('')).toBe(false);
    expect(isKayitFormat(null)).toBe(false);
    expect(isKayitFormat(undefined)).toBe(false);
    expect(isKayitFormat(42)).toBe(false);
  });

  it('FORMAT_TIP — 7 format, Notion Başvurular DB Tip enum', () => {
    expect(FORMAT_TIP).toEqual({
      cember: 'Çember',
      'acik-kapi': 'Açık Kapı',
      'mini-retreat': 'Mini Retreat',
      'sehir-aksami': 'Şehir Akşamı',
      seremoni: 'Seremoni',
      atolye: 'Atölye',
      yolculuk: 'Yolculuk',
    });
  });

  it('FORMAT_NOTION_FORMAT — 7 format, Notion Etkinlikler DB Format enum', () => {
    expect(FORMAT_NOTION_FORMAT).toEqual({
      cember: 'Çember',
      'acik-kapi': 'Açık Kapı',
      'mini-retreat': 'Mini Retreat',
      'sehir-aksami': 'Şehir Akşamı',
      seremoni: 'Seremoni',
      atolye: 'Atölye',
      yolculuk: 'Yolculuk',
    });
  });

  it('FORMAT_MAILERLITE_GROUP — 7 format, hepsi dolu sayısal string (Brief 3 KARAR 206)', () => {
    for (const f of TUM_FORMATLAR) {
      const id = FORMAT_MAILERLITE_GROUP[f];
      expect(typeof id).toBe('string');
      expect(id).toMatch(/^\d{15,18}$/);
    }
    // Pilot Çember (Brief 2A'da set edildi) — değer kayması varsa yakala.
    expect(FORMAT_MAILERLITE_GROUP.cember).toBe('187798293576681151');
    // Yolculuk v2 — brief mühürlü grup ID (192780641731871836).
    expect(FORMAT_MAILERLITE_GROUP.yolculuk).toBe('192780641731871836');
  });

  it('FORMAT_MAILERLITE_GROUP — ID\'ler ayrık (karışmamış)', () => {
    const ids = Object.values(FORMAT_MAILERLITE_GROUP);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('parseKayitSorulari', () => {
  it('boş / null / undefined → []', () => {
    expect(parseKayitSorulari('')).toEqual([]);
    expect(parseKayitSorulari(null)).toEqual([]);
    expect(parseKayitSorulari(undefined)).toEqual([]);
  });

  it('tek satır → 1 soru', () => {
    expect(parseKayitSorulari('Niyetin ne?')).toEqual(['Niyetin ne?']);
  });

  it('\\n ile ayrılmış 2 soru → 2 madde (Çember canlı veri paterni)', () => {
    expect(
      parseKayitSorulari(
        'Bu çembere seni çağıran ne?\nŞu an hayatında neyin dönüşmesini istiyorsun?',
      ),
    ).toEqual([
      'Bu çembere seni çağıran ne?',
      'Şu an hayatında neyin dönüşmesini istiyorsun?',
    ]);
  });

  it('boş satırları + baş/son whitespace\'i atar', () => {
    expect(parseKayitSorulari('\n\nSoru 1\n  \n\nSoru 2\n\n')).toEqual(['Soru 1', 'Soru 2']);
  });
});

// resolveMiniCtaBtn — brief-kayit-buton-FINAL Faz 3 post-render placeholder.
// transformMiniCta section'ı prose + `__MINI_CTA_BUTON__` emit eder; loader
// (config.ts) bu helper'ı çağırıp bağlama göre butonu basar veya bloğu boş
// bırakır (site-rehber/anadolu bypass).

const MINI_CTA_PROSE =
  '<section data-section="mini-cta" class="ocak-mini-cta"><p>Bir çember hazır.</p>__MINI_CTA_BUTON__</section>';

describe('resolveMiniCtaBtn (brief-kayit-buton-FINAL Faz 3)', () => {
  it('KayitFormat + kayitTipi verilmez (format sayfası) → nötr "Yerini ayır" + slug hedef, tümü linki YOK', () => {
    const out = resolveMiniCtaBtn(MINI_CTA_PROSE, '/cember');
    expect(out).toContain('class="ocak-kayit-cta__buton"');
    expect(out).toContain('href="/cember/kayit"');
    expect(out).toContain('Yerini ayır');
    expect(out).not.toContain('Başvur');
    expect(out).not.toContain('ocak-kayit-cta__tumu');
    expect(out).not.toContain('__MINI_CTA_BUTON__');
  });

  it('KayitFormat + kayitTipi=Direkt (etkinlik detay) → "Yerini ayır" + Diğer tarihler linki', () => {
    const out = resolveMiniCtaBtn(MINI_CTA_PROSE, '/cember', { kayitTipi: 'Direkt' });
    expect(out).toContain('Yerini ayır');
    expect(out).toContain('ocak-kayit-cta__tumu');
    expect(out).toContain('href="/takvim#cember"');
    expect(out).toContain('Diğer tarihler');
  });

  it('KayitFormat + kayitTipi=Başvuru → "Başvur" metni', () => {
    const out = resolveMiniCtaBtn(MINI_CTA_PROSE, '/atolye', { kayitTipi: 'Başvuru' });
    expect(out).toContain('Başvur');
    expect(out).toContain('href="/atolye/kayit"');
    expect(out).toContain('href="/takvim#atolye"');
    expect(out).not.toContain('Yerini ayır');
  });

  it('KayitFormat dışı slug (/site-rehber, /anadolu) → placeholder boş silinir, prose kalır', () => {
    const rehber = resolveMiniCtaBtn(MINI_CTA_PROSE, '/site-rehber');
    expect(rehber).not.toContain('__MINI_CTA_BUTON__');
    expect(rehber).not.toContain('ocak-kayit-cta__buton');
    expect(rehber).toContain('<p>Bir çember hazır.</p>');
    expect(rehber).toContain('data-section="mini-cta"');
    const anadolu = resolveMiniCtaBtn(MINI_CTA_PROSE, '/anadolu');
    expect(anadolu).not.toContain('ocak-kayit-cta__buton');
  });

  it('slug normalize: /cember /cember/ cember hepsi /cember/kayit', () => {
    for (const s of ['cember', '/cember', '/cember/']) {
      const out = resolveMiniCtaBtn(MINI_CTA_PROSE, s);
      expect(out).toContain('href="/cember/kayit"');
    }
  });

  it('HTML\'de placeholder yoksa idempotent — dokunma', () => {
    const inert = '<p>Sadece prose, mini-cta yok.</p>';
    expect(resolveMiniCtaBtn(inert, '/cember')).toBe(inert);
  });
});

// Brief 5 KARAR 208 — Yol C otomatik katılım linki helper'ları.
// /api/kayit endpoint'in pure mantığı buraya çekildi (Notion client side-effect'siz);
// online/yüz-yüze ayrımı, C-1 güvenlik ağı (boş link → katilim_linki skip),
// MailerLite custom field şekli + etkinlik adı formatlama.

describe('katilimTipiCoz (Brief 5 KARAR 208)', () => {
  it('Mekân/Platform = "Online" → "link"', () => {
    expect(katilimTipiCoz('Online')).toBe('link');
  });

  it('Mekân/Platform = "İzmir"/"İstanbul"/"Ege"/"Anadolu" → "adres"', () => {
    expect(katilimTipiCoz('İzmir')).toBe('adres');
    expect(katilimTipiCoz('İstanbul')).toBe('adres');
    expect(katilimTipiCoz('Ege')).toBe('adres');
    expect(katilimTipiCoz('Anadolu')).toBe('adres');
  });

  it('boş / undefined / null → "link" defansif default', () => {
    expect(katilimTipiCoz('')).toBe('link');
    expect(katilimTipiCoz(undefined)).toBe('link');
    expect(katilimTipiCoz(null)).toBe('link');
  });
});

describe('mailerLiteCustomFields (Brief Katman 2 — online/fiziksel ayrımı)', () => {
  it('online + link + şifre dolu → etkinlik_adi + katilim_linki + zoom_link + zoom_sifresi', () => {
    const f = mailerLiteCustomFields({
      etkinlikAdi: 'Çember — 21 Haziran 2026',
      katilimTipi: 'link',
      katilimLinki: 'https://zoom.us/j/123456789',
      zoomSifresi: 'gizli42',
    });
    expect(f).toEqual({
      etkinlik_adi: 'Çember — 21 Haziran 2026',
      katilim_linki: 'https://zoom.us/j/123456789',
      zoom_link: 'https://zoom.us/j/123456789',
      zoom_sifresi: 'gizli42',
    });
  });

  it('online + link dolu + şifre BOŞ → zoom_sifresi SKIP', () => {
    const f = mailerLiteCustomFields({
      etkinlikAdi: 'Seremoni — 21 Haziran 2026',
      katilimTipi: 'link',
      katilimLinki: 'https://zoom.us/j/abc',
      zoomSifresi: '',
    });
    expect(f).toEqual({
      etkinlik_adi: 'Seremoni — 21 Haziran 2026',
      katilim_linki: 'https://zoom.us/j/abc',
      zoom_link: 'https://zoom.us/j/abc',
    });
    expect(f).not.toHaveProperty('zoom_sifresi');
  });

  it('online + link BOŞ → SADECE etkinlik_adi (C-1: katilim_linki + zoom_* SKIP)', () => {
    const f = mailerLiteCustomFields({
      etkinlikAdi: 'Seremoni — 21 Haziran 2026',
      katilimTipi: 'link',
      katilimLinki: '',
      zoomSifresi: '',
    });
    expect(f).toEqual({ etkinlik_adi: 'Seremoni — 21 Haziran 2026' });
  });

  it('fiziksel + mekan + adres dolu → etkinlik_mekan + etkinlik_adres (zoom_* YOK)', () => {
    const f = mailerLiteCustomFields({
      etkinlikAdi: 'İstanbul — 18 Haziran 2026',
      katilimTipi: 'adres',
      mekan: 'İstanbul',
      mekanAdres: 'Kadıköy, Moda',
    });
    expect(f).toEqual({
      etkinlik_adi: 'İstanbul — 18 Haziran 2026',
      etkinlik_mekan: 'İstanbul',
      etkinlik_adres: 'Kadıköy, Moda',
    });
    expect(f).not.toHaveProperty('zoom_link');
    expect(f).not.toHaveProperty('katilim_linki');
    expect(f).not.toHaveProperty('zoom_sifresi');
  });

  it('fiziksel + adres BOŞ → SADECE etkinlik_adi + etkinlik_mekan', () => {
    const f = mailerLiteCustomFields({
      etkinlikAdi: 'İstanbul — 18 Haziran 2026',
      katilimTipi: 'adres',
      mekan: 'İstanbul',
      mekanAdres: '',
    });
    expect(f).toEqual({
      etkinlik_adi: 'İstanbul — 18 Haziran 2026',
      etkinlik_mekan: 'İstanbul',
    });
  });

  it('etkinlik_tarihi + etkinlik_saati dolu → her iki katilim tipinde de eklenir', () => {
    const onl = mailerLiteCustomFields({
      etkinlikAdi: 'Çember',
      etkinlikTarihi: '21 Haziran 2026',
      etkinlikSaati: '20:00',
      katilimTipi: 'link',
      katilimLinki: 'https://zoom.us/j/x',
    });
    expect(onl.etkinlik_tarihi).toBe('21 Haziran 2026');
    expect(onl.etkinlik_saati).toBe('20:00');

    const fiz = mailerLiteCustomFields({
      etkinlikAdi: 'İstanbul',
      etkinlikTarihi: '18 Haziran 2026',
      etkinlikSaati: '19:30',
      katilimTipi: 'adres',
      mekan: 'İstanbul',
    });
    expect(fiz.etkinlik_tarihi).toBe('18 Haziran 2026');
    expect(fiz.etkinlik_saati).toBe('19:30');
  });

  it('whitespace değerler trim edilir + boş whitespace SKIP', () => {
    const f = mailerLiteCustomFields({
      etkinlikAdi: 'X',
      etkinlikTarihi: '   ',
      etkinlikSaati: undefined,
      katilimTipi: 'link',
      katilimLinki: '  https://zoom.us/j/abc  ',
      zoomSifresi: '  pw  ',
    });
    expect(f).not.toHaveProperty('etkinlik_tarihi');
    expect(f).not.toHaveProperty('etkinlik_saati');
    expect(f.katilim_linki).toBe('https://zoom.us/j/abc');
    expect(f.zoom_link).toBe('https://zoom.us/j/abc');
    expect(f.zoom_sifresi).toBe('pw');
  });

  it('null/undefined opsiyonel alanlar payload\'a girmez', () => {
    const f = mailerLiteCustomFields({
      etkinlikAdi: 'X',
      etkinlikTarihi: null,
      etkinlikSaati: null,
      katilimTipi: 'adres',
      mekan: null,
      mekanAdres: undefined,
    });
    expect(f).toEqual({ etkinlik_adi: 'X' });
  });
});

describe('tarihTrFormat (Brief Katman 2 — Notion ISO → Türkçe)', () => {
  it('"2026-06-21" → "21 Haziran 2026"', () => {
    expect(tarihTrFormat('2026-06-21')).toBe('21 Haziran 2026');
  });

  it('ISO datetime "2026-06-21T18:00:00.000+03:00" → "21 Haziran 2026"', () => {
    expect(tarihTrFormat('2026-06-21T18:00:00.000+03:00')).toBe('21 Haziran 2026');
  });

  it('12 ayın tamamı doğru çevrilir', () => {
    expect(tarihTrFormat('2026-01-01')).toBe('1 Ocak 2026');
    expect(tarihTrFormat('2026-02-14')).toBe('14 Şubat 2026');
    expect(tarihTrFormat('2026-03-30')).toBe('30 Mart 2026');
    expect(tarihTrFormat('2026-04-15')).toBe('15 Nisan 2026');
    expect(tarihTrFormat('2026-05-09')).toBe('9 Mayıs 2026');
    expect(tarihTrFormat('2026-06-21')).toBe('21 Haziran 2026');
    expect(tarihTrFormat('2026-07-04')).toBe('4 Temmuz 2026');
    expect(tarihTrFormat('2026-08-30')).toBe('30 Ağustos 2026');
    expect(tarihTrFormat('2026-09-22')).toBe('22 Eylül 2026');
    expect(tarihTrFormat('2026-10-29')).toBe('29 Ekim 2026');
    expect(tarihTrFormat('2026-11-10')).toBe('10 Kasım 2026');
    expect(tarihTrFormat('2026-12-31')).toBe('31 Aralık 2026');
  });

  it('gün başında baştaki 0 düşer (1-9 günler)', () => {
    expect(tarihTrFormat('2026-06-05')).toBe('5 Haziran 2026');
  });

  it('boş / null / undefined → ""', () => {
    expect(tarihTrFormat('')).toBe('');
    expect(tarihTrFormat(null)).toBe('');
    expect(tarihTrFormat(undefined)).toBe('');
  });

  it('parse edilemezse input aynen döner (defansif)', () => {
    expect(tarihTrFormat('garbage')).toBe('garbage');
    expect(tarihTrFormat('21-06-2026')).toBe('21-06-2026');
  });
});

describe('etkinlikAdiFormatla (Brief 5 — MailerLite etkinlik_adi şablonu)', () => {
  it('format + seciliTarih → "{TIP} — {tarih}" (plan örnek paterni)', () => {
    expect(etkinlikAdiFormatla('cember', '21 Haziran 2026')).toBe(
      'Çember — 21 Haziran 2026',
    );
    expect(etkinlikAdiFormatla('acik-kapi', '19 Haziran 2026')).toBe(
      'Açık Kapı — 19 Haziran 2026',
    );
    expect(etkinlikAdiFormatla('sehir-aksami', '18 Haziran 2026')).toBe(
      'Şehir Akşamı — 18 Haziran 2026',
    );
  });

  it('seciliTarih boş/undefined/null → sadece TIP', () => {
    expect(etkinlikAdiFormatla('seremoni', '')).toBe('Seremoni');
    expect(etkinlikAdiFormatla('seremoni', undefined)).toBe('Seremoni');
    expect(etkinlikAdiFormatla('seremoni', null)).toBe('Seremoni');
  });

  it('seciliTarih sadece whitespace → sadece TIP', () => {
    expect(etkinlikAdiFormatla('atolye', '   ')).toBe('Atölye');
  });

  it('S2 sonrası Tip == Format aynı değer (kısa/uzun ayrımı silindi)', () => {
    // Slug rename brief S2 (2026-07-03): FORMAT_TIP ile FORMAT_NOTION_FORMAT
    // aynı Notion enum değerini döndürür. Helper Tip'i kullanır.
    expect(etkinlikAdiFormatla('sehir-aksami', '1 Ocak 2027')).toContain('Şehir Akşamı');
    expect(etkinlikAdiFormatla('seremoni', '1 Ocak 2027')).toContain('Seremoni');
    expect(etkinlikAdiFormatla('atolye', '1 Ocak 2027')).toContain('Atölye');
  });
});

// Brief 6 KARAR 210 — Referans no üretimi.
// OCAK-XXXXX, 5 haneli rakam (10000-99999); çakışma kontrolü yok (düşük
// hacim, Kaan kararı). Notion'a daima yazılır + success ödemeli dalında
// gösterilir (ödemesizde gizli, ödemeli havale eşleştirmesi için).

describe('uretReferansNo (Brief 6 KARAR 210 + Son tur 2026-06-14)', () => {
  it('"OCAK-" prefix + tam 6 haneli rakam (100000-999999)', () => {
    const re = /^OCAK-\d{6}$/;
    for (let i = 0; i < 200; i++) {
      const ref = uretReferansNo();
      expect(ref).toMatch(re);
      const sayi = Number(ref.slice(5));
      expect(sayi).toBeGreaterThanOrEqual(100000);
      expect(sayi).toBeLessThanOrEqual(999999);
    }
  });

  it('arka arkaya iki çağrı genellikle farklı (rastgelelik kanıtı)', () => {
    // 6 hane → 900K uzay → 50 çağrıda kollizyon olasılığı ihmal edilebilir.
    const set = new Set<string>();
    for (let i = 0; i < 50; i++) set.add(uretReferansNo());
    expect(set.size).toBeGreaterThanOrEqual(49);
  });

  it('format havale açıklaması için doğrudan kullanılabilir (boşluk yok)', () => {
    const ref = uretReferansNo();
    expect(ref).not.toMatch(/\s/);
    expect(ref.length).toBe(11); // "OCAK-" (5) + 6 hane
  });
});

describe('uretBenzersizReferansNo (Son tur 2026-06-14 — çakışma garanti)', () => {
  it('hiç çakışma yoksa ilk üretilen ref döner', async () => {
    const ref = await uretBenzersizReferansNo(async () => false, ['db1', 'db2']);
    expect(ref).toMatch(/^OCAK-\d{6}$/);
  });

  it('aktif DB yoksa (boş liste) tek çağrıda ref döner — test/dev defansif', async () => {
    let calls = 0;
    const query = async () => {
      calls++;
      return false;
    };
    const ref = await uretBenzersizReferansNo(query, []);
    expect(ref).toMatch(/^OCAK-\d{6}$/);
    expect(calls).toBe(0);
  });

  it('ilk aday çakışırsa retry → ikinci adayı döner', async () => {
    let cagri = 0;
    const query = async (_dbId: string, _ref: string) => {
      cagri++;
      return cagri === 1; // sadece ilk çağrıda çakışma
    };
    const ref = await uretBenzersizReferansNo(query, ['db1'], 3);
    expect(ref).toMatch(/^OCAK-\d{6}$/);
    expect(cagri).toBeGreaterThanOrEqual(2);
  });

  it('tüm denemeler çakışırsa timestamp fallback (8 hane)', async () => {
    const query = async () => true; // her zaman çakışma
    const ref = await uretBenzersizReferansNo(query, ['db1'], 3);
    expect(ref).toMatch(/^OCAK-\d{8}$/);
  });

  it('Kayıtlar + Başvurular ortak uzay — biri çakışırsa retry', async () => {
    let cagri = 0;
    const query = async (dbId: string) => {
      cagri++;
      // db2'de ilk turda çakışma, sonra rahat
      return dbId === 'db2' && cagri <= 2;
    };
    const ref = await uretBenzersizReferansNo(query, ['db1', 'db2'], 5);
    expect(ref).toMatch(/^OCAK-\d{6}$/);
  });
});
