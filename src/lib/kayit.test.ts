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
  mailerLiteFieldsPayload,
  MAILERLITE_ALANLAR,
  etkinlikUrlFormatla,
  etkinlikAdiFormatla,
  tarihTrFormat,
  uretReferansNo,
  uretBenzersizReferansNo,
  paraBirimiGoster,
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

describe('mailerLiteCustomFields (ödeme kapısı + alan hijyeni)', () => {
  // Alan hijyeni: HER çağrı on iki alanın hepsini döndürür. Geçersiz olan boş
  // string ile yazılır — gönderilmemesi MailerLite'ta eski değeri bırakıyordu.
  const TEMEL = {
    etkinlikAdi: 'Çember — 21 Haziran 2026',
    katilimTipi: 'link' as const,
    katilimLinki: 'https://zoom.us/j/123456789',
    zoomSifresi: 'gizli42',
    odemeGerekli: false,
    referansNo: 'OCAK-12345',
    etkinlikBasligi: 'Elin Neyle Dolu?',
    etkinlikUrl: 'https://www.ocak.biz/etkinlik/elin-neyle-dolu',
  };

  it('on iki alanın hepsi HER çağrıda döner — hiçbiri atlanmaz', () => {
    const f = mailerLiteCustomFields({ ...TEMEL });
    expect(Object.keys(f).sort()).toEqual([...MAILERLITE_ALANLAR].sort());
    const bos = mailerLiteCustomFields({
      etkinlikAdi: 'X',
      katilimTipi: 'adres',
      odemeGerekli: true,
      referansNo: '',
    });
    expect(Object.keys(bos).sort()).toEqual([...MAILERLITE_ALANLAR].sort());
  });

  it('online + ödeme YOK → katılım alanları dolu, mekân/adres boş', () => {
    const f = mailerLiteCustomFields({ ...TEMEL });
    expect(f.katilim_linki).toBe('https://zoom.us/j/123456789');
    expect(f.zoom_link).toBe('https://zoom.us/j/123456789');
    expect(f.zoom_sifresi).toBe('gizli42');
    expect(f.etkinlik_mekan).toBe('');
    expect(f.etkinlik_adres).toBe('');
    expect(f.odeme_durumu).toBe('muaf');
  });

  it('ÖDEME KAPISI — online + ödeme gerekli → zoom alanları BOŞ', () => {
    const f = mailerLiteCustomFields({ ...TEMEL, odemeGerekli: true });
    expect(f.katilim_linki).toBe('');
    expect(f.zoom_link).toBe('');
    expect(f.zoom_sifresi).toBe('');
    // Kapı kapalı olsa da kimlik alanları gider — kadın kaydının ulaştığını bilmeli.
    expect(f.etkinlik_adi).toBe('Çember — 21 Haziran 2026');
    expect(f.referans_no).toBe('OCAK-12345');
    expect(f.odeme_durumu).toBe('bekliyor');
    // Buluşmanın kendi adı kapıya tabi değil — ödeme beklerken de gider.
    expect(f.etkinlik_basligi).toBe('Elin Neyle Dolu?');
  });

  it('ÖDEME KAPISI — fiziksel + ödeme gerekli → adres BOŞ ama mekân GİDER', () => {
    const f = mailerLiteCustomFields({
      etkinlikAdi: 'İstanbul — 18 Haziran 2026',
      katilimTipi: 'adres',
      mekan: 'İstanbul',
      mekanAdres: 'Kadıköy, Moda',
      odemeGerekli: true,
      referansNo: 'OCAK-77777',
    });
    expect(f.etkinlik_adres).toBe('');
    expect(f.etkinlik_mekan).toBe('İstanbul');
    expect(f.odeme_durumu).toBe('bekliyor');
  });

  it('fiziksel + ödeme YOK → mekân + adres dolu, zoom alanları boş', () => {
    const f = mailerLiteCustomFields({
      etkinlikAdi: 'İstanbul — 18 Haziran 2026',
      katilimTipi: 'adres',
      mekan: 'İstanbul',
      mekanAdres: 'Kadıköy, Moda',
      odemeGerekli: false,
      referansNo: 'OCAK-77777',
    });
    expect(f.etkinlik_mekan).toBe('İstanbul');
    expect(f.etkinlik_adres).toBe('Kadıköy, Moda');
    expect(f.katilim_linki).toBe('');
    expect(f.zoom_link).toBe('');
    expect(f.zoom_sifresi).toBe('');
  });

  it('format bazlı varsayım YOK — ayırıcı yalnız odemeGerekli', () => {
    const ucretsizCember = mailerLiteCustomFields({ ...TEMEL, odemeGerekli: false });
    const ucretliAcikKapi = mailerLiteCustomFields({
      ...TEMEL,
      etkinlikAdi: 'Açık Kapı — 4 Kasım 2026',
      odemeGerekli: true,
    });
    expect(ucretsizCember.zoom_link).not.toBe('');
    expect(ucretliAcikKapi.zoom_link).toBe('');
  });

  it('tarih + saat her iki katılım tipinde de yazılır', () => {
    const onl = mailerLiteCustomFields({
      ...TEMEL, etkinlikTarihi: '21 Haziran 2026', etkinlikSaati: '20:00',
    });
    expect(onl.etkinlik_tarihi).toBe('21 Haziran 2026');
    expect(onl.etkinlik_saati).toBe('20:00');

    const fiz = mailerLiteCustomFields({
      etkinlikAdi: 'İstanbul',
      etkinlikTarihi: '18 Haziran 2026',
      etkinlikSaati: '19:30-22:00',
      katilimTipi: 'adres',
      mekan: 'İstanbul',
      odemeGerekli: false,
      referansNo: 'OCAK-1',
    });
    expect(fiz.etkinlik_tarihi).toBe('18 Haziran 2026');
    // Fiziksel saat ARALIK kalır — normalize edilmez (madde 2-ii).
    expect(fiz.etkinlik_saati).toBe('19:30-22:00');
  });

  it('whitespace trim edilir; null/undefined boş stringe düşer', () => {
    const f = mailerLiteCustomFields({
      etkinlikAdi: 'X',
      etkinlikTarihi: '   ',
      etkinlikSaati: null,
      katilimTipi: 'link',
      katilimLinki: '  https://zoom.us/j/abc  ',
      zoomSifresi: '  pw  ',
      odemeGerekli: false,
      referansNo: '  OCAK-9  ',
    });
    expect(f.etkinlik_tarihi).toBe('');
    expect(f.etkinlik_saati).toBe('');
    expect(f.katilim_linki).toBe('https://zoom.us/j/abc');
    expect(f.zoom_sifresi).toBe('pw');
    expect(f.referans_no).toBe('OCAK-9');
  });

  it('referans_no ve odeme_durumu DAİMA yazılır (muaf dahil)', () => {
    const f = mailerLiteCustomFields({
      etkinlikAdi: 'X', katilimTipi: 'adres', odemeGerekli: false, referansNo: 'OCAK-55555',
    });
    expect(f.referans_no).toBe('OCAK-55555');
    expect(f.odeme_durumu).toBe('muaf');
  });

  it('etkinlik_basligi ayrı yaşar — etkinlik_adi ile karışmaz', () => {
    const f = mailerLiteCustomFields({
      ...TEMEL,
      etkinlikAdi: 'Çember — 10 Eylül 2026 · 20:00',
      etkinlikBasligi: 'Elin Neyle Dolu?',
    });
    expect(f.etkinlik_adi).toBe('Çember — 10 Eylül 2026 · 20:00');
    expect(f.etkinlik_basligi).toBe('Elin Neyle Dolu?');
  });

  it('etkinlikUrlFormatla — slug varsa tam URL, yoksa BOŞ (kırık taban üretmez)', () => {
    expect(etkinlikUrlFormatla('elin-neyle-dolu')).toBe('https://www.ocak.biz/etkinlik/elin-neyle-dolu');
    expect(etkinlikUrlFormatla('  bu-ses-kimin  ')).toBe('https://www.ocak.biz/etkinlik/bu-ses-kimin');
    // Slug'sız etkinliğin detay sayfası YOK — taban URL basmak kırık link olurdu.
    expect(etkinlikUrlFormatla('')).toBe('');
    expect(etkinlikUrlFormatla(null)).toBe('');
    expect(etkinlikUrlFormatla(undefined)).toBe('');
  });

  it('etkinlik_url kapıya TABİ DEĞİL — ödeme beklerken de gider', () => {
    const f = mailerLiteCustomFields({ ...TEMEL, odemeGerekli: true });
    expect(f.etkinlik_url).toBe('https://www.ocak.biz/etkinlik/elin-neyle-dolu');
    expect(f.zoom_link).toBe('');
  });

  it('etkinlik_basligi boşsa boş string — alan yine yazılır (hijyen)', () => {
    const f = mailerLiteCustomFields({
      etkinlikAdi: 'X', katilimTipi: 'link', odemeGerekli: false, referansNo: 'OCAK-1',
    });
    expect(f).toHaveProperty('etkinlik_basligi');
    expect(f.etkinlik_basligi).toBe('');
    expect(f).toHaveProperty('etkinlik_url');
    expect(f.etkinlik_url).toBe('');
  });
});

// ── Taşıma katmanı (Y1) ────────────────────────────────────────────────────
// `mailerLiteEkle` route dosyasında yaşadığı için test edilemiyordu ve boş-alan
// filtresi commit'ten commit'e sağ kaldı: helper boş string üretiyor, filtre
// alanı düşürüyor, MailerLite önceki kayıttan kalan değeri koruyordu. Canlı
// vaka 19 Ağustos 2026 — Slug'sız "Konuk Ateşi" kaydında `etkinlik_url` iki
// kayıt önceki "Ekmeden Önce" adresinde kaldı. Payload kurulumu artık lib'de,
// test burada.
describe('mailerLiteFieldsPayload (taşıma katmanı — boş alan GİDER)', () => {
  it('boş string alan payload\'a GİRER — düşürülmez', () => {
    const p = mailerLiteFieldsPayload('Kaan', {
      etkinlik_adi: 'Açık Kapı — 4 Ocak 2027',
      etkinlik_url: '',
      zoom_link: '',
    });
    expect(p).toHaveProperty('etkinlik_url');
    expect(p.etkinlik_url).toBe('');
    expect(p).toHaveProperty('zoom_link');
    expect(p.zoom_link).toBe('');
    expect(p.etkinlik_adi).toBe('Açık Kapı — 4 Ocak 2027');
  });

  it('canlı vaka — Slug boş etkinlikte etkinlik_url boş GÖNDERİLİR (eski değer silinsin)', () => {
    const ml = mailerLiteCustomFields({
      etkinlikAdi: 'Açık Kapı — 4 Ocak 2027',
      etkinlikBasligi: 'Konuk Ateşi',
      etkinlikUrl: '', // Notion Slug boş → etkinlikUrlFormatla('') === ''
      katilimTipi: 'link',
      katilimLinki: 'https://zoom.us/j/1',
      odemeGerekli: false,
      referansNo: 'OCAK-532897',
    });
    const p = mailerLiteFieldsPayload('Kaan', ml);
    expect(p.etkinlik_url).toBe('');
  });

  it('ödeme kapısı tele çıkar — ücretli kayıtta zoom alanları BOŞ gönderilir', () => {
    const ml = mailerLiteCustomFields({
      etkinlikAdi: 'Çember — 10 Eylül 2026',
      katilimTipi: 'link',
      katilimLinki: 'https://zoom.us/j/gizli',
      zoomSifresi: 'gizli42',
      odemeGerekli: true,
      referansNo: 'OCAK-532896',
    });
    const p = mailerLiteFieldsPayload('Kaan', ml);
    for (const alan of ['katilim_linki', 'zoom_link', 'zoom_sifresi'] as const) {
      expect(p).toHaveProperty(alan);
      expect(p[alan]).toBe('');
    }
    expect(p.odeme_durumu).toBe('bekliyor');
  });

  it('on iki alanın hepsi tele çıkar — dört senaryoda da eksiksiz', () => {
    const TABAN = {
      etkinlikAdi: 'X', referansNo: 'OCAK-1',
      etkinlikBasligi: 'B', etkinlikUrl: 'https://www.ocak.biz/etkinlik/s',
    };
    const senaryolar = [
      { ...TABAN, katilimTipi: 'link' as const, katilimLinki: 'z', odemeGerekli: false },
      { ...TABAN, katilimTipi: 'link' as const, katilimLinki: 'z', odemeGerekli: true },
      { ...TABAN, katilimTipi: 'adres' as const, mekan: 'İzmir', odemeGerekli: false },
      { ...TABAN, katilimTipi: 'adres' as const, mekan: 'İzmir', odemeGerekli: true },
    ];
    for (const s of senaryolar) {
      const p = mailerLiteFieldsPayload('Kaan', mailerLiteCustomFields(s));
      const customKeys = Object.keys(p).filter((k) => k !== 'name');
      expect(customKeys.sort()).toEqual([...MAILERLITE_ALANLAR].sort());
    }
  });

  it('`name` MUAF — boşken de yazılır, kural ona işlemez', () => {
    const p = mailerLiteFieldsPayload('Kaan', { etkinlik_adi: '' });
    expect(p.name).toBe('Kaan');
    // Mevcut davranış korunuyor: name daima payload'da.
    expect(mailerLiteFieldsPayload('', {})).toHaveProperty('name');
  });

  it('`name` ekFields\'ten EZİLEMEZ', () => {
    const p = mailerLiteFieldsPayload('Kaan', { name: '', etkinlik_adi: 'X' } as Record<string, string>);
    expect(p.name).toBe('Kaan');
  });

  it('ekFields yoksa yalnız name döner', () => {
    expect(mailerLiteFieldsPayload('Kaan')).toEqual({ name: 'Kaan' });
  });
});

// Faz 1 §4.2 — içerik/sunum sınırı (KARAR 354). Veri `TRY` kalır, ekran "TL"
// gösterir. Testin işi sınırın tek yönlü olduğunu çivilemek: çeviri gösterimde
// yapılır, veriye geri yazılmaz.
describe('paraBirimiGoster (Faz 1 §4.2 — veri TRY, sunum TL)', () => {
  it('TRY → TL', () => {
    expect(paraBirimiGoster('TRY')).toBe('TL');
  });

  it('küçük harf ve boşluk toleranslı', () => {
    expect(paraBirimiGoster('try')).toBe('TL');
    expect(paraBirimiGoster('  Try  ')).toBe('TL');
  });

  it('tanınmayan kod AYNEN geçer — uydurma etiket yok', () => {
    expect(paraBirimiGoster('EUR')).toBe('EUR');
    expect(paraBirimiGoster('USD')).toBe('USD');
  });

  it('boş / null / undefined → ""', () => {
    expect(paraBirimiGoster('')).toBe('');
    expect(paraBirimiGoster(null)).toBe('');
    expect(paraBirimiGoster(undefined)).toBe('');
  });

  it('"TL" girdisi TL kalır — idempotent, çift çeviri bozmaz', () => {
    expect(paraBirimiGoster('TL')).toBe('TL');
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
