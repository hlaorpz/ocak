import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  FORMAT_TIP,
  FORMAT_NOTION_FORMAT,
  FORMAT_MAILERLITE_GROUP,
  isKayitFormat,
  parseKayitSorulari,
  resolveKayitCtaHref,
  katilimTipiCoz,
  mailerLiteCustomFields,
  etkinlikAdiFormatla,
  uretReferansNo,
  type KayitFormat,
} from './kayit';

afterEach(() => {
  vi.restoreAllMocks();
});

// Brief 3 KARAR 206 — 6 formatın hepsinin map'lerde tam olduğunu kapsar.
// Eksik bir format eklersek (Brief 4'te yeni format, Anadolu hariç),
// her dört map'in de güncellenmesini bu testler zorunlu kılar.

const TUM_FORMATLAR: KayitFormat[] = [
  'cember',
  'acik-kapi',
  'mini-retreat',
  'istanbul',
  'seremoni',
  'workshop',
];

describe('kayit map\'leri (Brief 2A + Brief 3)', () => {
  it('isKayitFormat 6 format için true', () => {
    for (const f of TUM_FORMATLAR) expect(isKayitFormat(f)).toBe(true);
  });

  it('isKayitFormat bilinmeyen için false', () => {
    expect(isKayitFormat('yolculuk')).toBe(false);
    expect(isKayitFormat('anadolu')).toBe(false);
    expect(isKayitFormat('')).toBe(false);
    expect(isKayitFormat(null)).toBe(false);
    expect(isKayitFormat(undefined)).toBe(false);
    expect(isKayitFormat(42)).toBe(false);
  });

  it('FORMAT_TIP — 6 format, Notion Başvurular DB Tip enum (kısa varyant)', () => {
    expect(FORMAT_TIP).toEqual({
      cember: 'Çember',
      'acik-kapi': 'Açık Kapı',
      'mini-retreat': 'Mini Retreat',
      istanbul: 'İstanbul',
      seremoni: 'Seremoni',
      workshop: 'Workshop',
    });
  });

  it('FORMAT_NOTION_FORMAT — 6 format, Notion Etkinlikler DB Format enum (uzun varyant)', () => {
    expect(FORMAT_NOTION_FORMAT).toEqual({
      cember: 'Çember',
      'acik-kapi': 'Açık Kapı',
      'mini-retreat': 'Mini Retreat',
      istanbul: 'İstanbul Akşamı',
      seremoni: 'Mevsim Seremonisi',
      workshop: 'Workshop',
    });
  });

  it('FORMAT_MAILERLITE_GROUP — 6 format, hepsi dolu sayısal string (Brief 3 KARAR 206)', () => {
    for (const f of TUM_FORMATLAR) {
      const id = FORMAT_MAILERLITE_GROUP[f];
      expect(typeof id).toBe('string');
      expect(id).toMatch(/^\d{15,18}$/);
    }
    // Pilot Çember (Brief 2A'da set edildi) — değer kayması varsa yakala.
    expect(FORMAT_MAILERLITE_GROUP.cember).toBe('187798293576681151');
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

// resolveKayitCtaHref — Brief 4 KARAR 207 post-render placeholder replace.
// Plugin (remark-ocak-sections transformKayitCta) buton href'ini
// __KAYIT_CTA_HREF__ placeholder ile emit eder; bu helper loader'da
// (content/config.ts) her sayfa için çağrılır ve slug'ı bilen yer olarak
// placeholder'ı çözüp 6-format-dışı sayfada section'ı temizler.

const SECTION_METINSIZ =
  '<section data-section="kayit-cta" class="ocak-kayit-cta"><a class="ocak-kayit-cta__buton" href="__KAYIT_CTA_HREF__" data-kayit-cta-button>Kayıt ol →</a></section>';
const SECTION_METINLI =
  '<section data-section="kayit-cta" class="ocak-kayit-cta"><p>Yerini ayır, çembere katıl.</p><a class="ocak-kayit-cta__buton" href="__KAYIT_CTA_HREF__" data-kayit-cta-button>Kayıt ol →</a></section>';

describe('resolveKayitCtaHref (Brief 4 KARAR 207)', () => {
  it('6 formattan biri (metinsiz) → href /[slug]/kayit ile doldurur', () => {
    const out = resolveKayitCtaHref(SECTION_METINSIZ, '/cember');
    expect(out).toContain('href="/cember/kayit"');
    expect(out).not.toContain('__KAYIT_CTA_HREF__');
    // Section korunur (buton hâlâ var).
    expect(out).toContain('Kayıt ol →');
  });

  it('6 formattan biri (metinli) → href doldurulur, üst metin de korunur', () => {
    const out = resolveKayitCtaHref(SECTION_METINLI, '/seremoni');
    expect(out).toContain('href="/seremoni/kayit"');
    expect(out).toContain('<p>Yerini ayır, çembere katıl.</p>');
  });

  it('slug normalize: cember / /cember / /cember/ hepsi /cember/kayit', () => {
    expect(resolveKayitCtaHref(SECTION_METINSIZ, 'cember')).toContain('/cember/kayit');
    expect(resolveKayitCtaHref(SECTION_METINSIZ, '/cember')).toContain('/cember/kayit');
    expect(resolveKayitCtaHref(SECTION_METINSIZ, '/cember/')).toContain('/cember/kayit');
  });

  it('6 format dışı slug (metinsiz) → section TAMAMEN kaldırılır + warn', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const out = resolveKayitCtaHref(SECTION_METINSIZ, '/hikaye');
    expect(out).not.toContain('data-section="kayit-cta"');
    expect(out).not.toContain('__KAYIT_CTA_HREF__');
    expect(out).not.toContain('Kayıt ol');
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy.mock.calls[0][0]).toMatch(/hikaye/);
    expect(warnSpy.mock.calls[0][0]).toMatch(/6 format dışı/);
  });

  it('6 format dışı slug (metinli) → ÜST METİN DAHİL tüm blok temiz kaldırılır', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const out = resolveKayitCtaHref(SECTION_METINLI, '/biz');
    expect(out).not.toContain('data-section="kayit-cta"');
    expect(out).not.toContain('Yerini ayır, çembere katıl.');
    expect(out).not.toContain('Kayıt ol');
    // Section bloğunun kalıntısı kalmadı.
    expect(out.trim()).toBe('');
  });

  it('ana sayfa (slug "/" veya boş) → 6 format dışı, section kaldırılır + warn', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(resolveKayitCtaHref(SECTION_METINSIZ, '/')).not.toContain('kayit-cta');
    expect(resolveKayitCtaHref(SECTION_METINSIZ, '')).not.toContain('kayit-cta');
    expect(warnSpy).toHaveBeenCalledTimes(2);
  });

  it('HTML\'de kayit-cta yoksa idempotent — placeholder/section yok, dokunma', () => {
    const inert = '<p>Sadece prose, kayit-cta YOK.</p>';
    expect(resolveKayitCtaHref(inert, '/hikaye')).toBe(inert);
    // Dış HTML'de __KAYIT_CTA_HREF__ koruyucu çek (replace yapılmamalı).
    const noSection = '<p>__KAYIT_CTA_HREF__ literal metin.</p>';
    expect(resolveKayitCtaHref(noSection, '/cember')).toBe(noSection);
  });

  it('aynı sayfada birden fazla kayit-cta → hepsi aynı slug ile doldurulur', () => {
    const ikili = SECTION_METINSIZ + '\n<p>Arada prose.</p>\n' + SECTION_METINLI;
    const out = resolveKayitCtaHref(ikili, '/workshop');
    const matches = out.match(/href="\/workshop\/kayit"/g);
    expect(matches?.length).toBe(2);
    expect(out).not.toContain('__KAYIT_CTA_HREF__');
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

describe('mailerLiteCustomFields (Brief 5 C-1 güvenlik ağı)', () => {
  it('katilim_linki dolu → fields\'a etkinlik_adi + katilim_linki ekler', () => {
    const f = mailerLiteCustomFields(
      'Çember — 21 Haziran 2026',
      'https://zoom.us/j/123456789',
    );
    expect(f).toEqual({
      etkinlik_adi: 'Çember — 21 Haziran 2026',
      katilim_linki: 'https://zoom.us/j/123456789',
    });
  });

  it('katilim_linki BOŞ → fields\'a SADECE etkinlik_adi (katilim_linki SKIP)', () => {
    const f = mailerLiteCustomFields('Seremoni — 21 Haziran 2026', '');
    expect(f).toEqual({ etkinlik_adi: 'Seremoni — 21 Haziran 2026' });
    expect(f).not.toHaveProperty('katilim_linki');
  });

  it('katilim_linki sadece whitespace → katilim_linki SKIP (trim kontrolü)', () => {
    const f = mailerLiteCustomFields('Workshop — Eylül 2026', '   \n  ');
    expect(f).not.toHaveProperty('katilim_linki');
  });

  it('katilim_linki null/undefined → katilim_linki SKIP', () => {
    expect(mailerLiteCustomFields('X', null)).not.toHaveProperty('katilim_linki');
    expect(mailerLiteCustomFields('X', undefined)).not.toHaveProperty('katilim_linki');
  });

  it('dolu link trimmed yazılır (baş/son whitespace temiz)', () => {
    const f = mailerLiteCustomFields('X', '  https://zoom.us/j/abc  ');
    expect(f.katilim_linki).toBe('https://zoom.us/j/abc');
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
    expect(etkinlikAdiFormatla('istanbul', '18 Haziran 2026')).toBe(
      'İstanbul — 18 Haziran 2026',
    );
  });

  it('seciliTarih boş/undefined/null → sadece TIP', () => {
    expect(etkinlikAdiFormatla('seremoni', '')).toBe('Seremoni');
    expect(etkinlikAdiFormatla('seremoni', undefined)).toBe('Seremoni');
    expect(etkinlikAdiFormatla('seremoni', null)).toBe('Seremoni');
  });

  it('seciliTarih sadece whitespace → sadece TIP', () => {
    expect(etkinlikAdiFormatla('workshop', '   ')).toBe('Workshop');
  });

  it('Başvurular Tip (kısa) kullanılır, Etkinlikler Format (uzun) DEĞİL', () => {
    // İstanbul / Seremoni'de kısa-uzun farkı var; helper Tip'i kullanır.
    expect(etkinlikAdiFormatla('istanbul', '1 Ocak 2027')).toContain('İstanbul');
    expect(etkinlikAdiFormatla('istanbul', '1 Ocak 2027')).not.toContain('Akşamı');
    expect(etkinlikAdiFormatla('seremoni', '1 Ocak 2027')).toContain('Seremoni');
    expect(etkinlikAdiFormatla('seremoni', '1 Ocak 2027')).not.toContain('Mevsim');
  });
});

// Brief 6 KARAR 210 — Referans no üretimi.
// OCAK-XXXXX, 5 haneli rakam (10000-99999); çakışma kontrolü yok (düşük
// hacim, Kaan kararı). Notion'a daima yazılır + success ödemeli dalında
// gösterilir (ödemesizde gizli, ödemeli havale eşleştirmesi için).

describe('uretReferansNo (Brief 6 KARAR 210)', () => {
  it('"OCAK-" prefix + tam 5 haneli rakam (10000-99999)', () => {
    const re = /^OCAK-\d{5}$/;
    for (let i = 0; i < 200; i++) {
      const ref = uretReferansNo();
      expect(ref).toMatch(re);
      const sayi = Number(ref.slice(5));
      expect(sayi).toBeGreaterThanOrEqual(10000);
      expect(sayi).toBeLessThanOrEqual(99999);
    }
  });

  it('arka arkaya iki çağrı genellikle farklı (rastgelelik kanıtı)', () => {
    // Math.random tek-thread içinde mutlaka farklı seed → kollizyon olasılığı
    // 1/90000. 50 çağrıda en az 49 farklı değer beklenir.
    const set = new Set<string>();
    for (let i = 0; i < 50; i++) set.add(uretReferansNo());
    expect(set.size).toBeGreaterThanOrEqual(49);
  });

  it('format havale açıklaması için doğrudan kullanılabilir (boşluk yok)', () => {
    const ref = uretReferansNo();
    expect(ref).not.toMatch(/\s/);
    expect(ref.length).toBe(10); // "OCAK-" (5) + 5 hane
  });
});
