import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * B118 İŞ C — kaynak etiketinin YÜZEY bağlantısı.
 *
 * Kural `kaynak.test.ts` · `sehir.test.ts` · `kayit-yazim.test.ts`'te ölçülü
 * (47 + 13 test). Burada ölçülen şey bağlantı: yakalama Layout'ta mı, gövdeye
 * katılıyor mu, sunucu süzgeci iki Kayıtlar yazıcısına da bağlı mı, ve İŞ C'nin
 * ödeme yoluna DOKUNMADIĞI (brief DUR koşulu 4).
 */

const KOK = join(__dirname, '..');
const LAYOUT = readFileSync(join(KOK, 'layouts/Layout.astro'), 'utf-8');
const YAKALA = readFileSync(join(KOK, 'components/KaynakYakala.astro'), 'utf-8');
const FORM = readFileSync(join(KOK, 'components/KayitFormu.astro'), 'utf-8');
const API = readFileSync(join(KOK, 'pages/api/kayit.ts'), 'utf-8');
const APILIB = readFileSync(join(KOK, 'lib/api.ts'), 'utf-8');

function yuzey(kaynak: string): string {
  return kaynak
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, ' ')
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .split('\n')
    .filter((satir) => !/^\s*\/\//.test(satir))
    .join('\n');
}

const API_YUZEY = yuzey(API);

describe('yakalama — her sayfada, inişte', () => {
  it('Layout mount ediyor', () => {
    expect(LAYOUT).toContain("import KaynakYakala from '../components/KaynakYakala.astro';");
    expect(LAYOUT).toContain('<KaynakYakala />');
  });

  it('kural lib\'den geliyor — bileşen kendi doğrulamasını yazmıyor', () => {
    expect(YAKALA).toContain("import { KAYNAK_ANAHTARI, kaynakYazilacakMi } from '../lib/kaynak';");
    // Yokluk ölçütü YÜZEYE karşı: bileşenin yorumu örnek bir URL
    // (`?utm_source=meta`) ve eşik anlatımı taşıyor — korunması gereken
    // gerekçe metni (CLAUDE.md §3).
    const y = yuzey(YAKALA);
    expect(y).not.toContain('utm_source');
    expect(y).not.toContain('100');
  });

  it('`sessionStorage` kullanıyor — `localStorage` DEĞİL (oturumla ölmeli)', () => {
    expect(YAKALA).toContain('sessionStorage.getItem');
    expect(YAKALA).toContain('sessionStorage.setItem');
    expect(yuzey(YAKALA)).not.toContain('localStorage');
  });

  it('okuma patlarsa sessiz geçiliyor — kayıt yolu kırılmıyor (K-5)', () => {
    expect(YAKALA).toContain('} catch {');
  });
});

describe('taşıma — gövdeye katılıyor', () => {
  it('`KayitPayload` beş UTM alanı ve rıza bayrağını tanıyor', () => {
    for (const alan of [
      'utm_source?: string;',
      'utm_medium?: string;',
      'utm_campaign?: string;',
      'utm_content?: string;',
      'utm_term?: string;',
      'olcum_rizasi?: boolean;',
    ]) {
      expect(APILIB).toContain(alan);
    }
  });

  it('form gövdeye `kaynakYukuOku()` yayıyor', () => {
    expect(FORM).toContain("import { KAYNAK_ANAHTARI, kayitKaynakYuku } from '../lib/kaynak';");
    expect(FORM).toContain("import { RIZA_ANAHTARI, gtmYuklensinMi } from '../lib/riza';");
    expect(FORM).toContain('...kaynakYukuOku(),');
  });

  it('okuma `try/catch` içinde — K-5, ölçüm kaydı düşürmez', () => {
    const fn = FORM.slice(
      FORM.indexOf('function kaynakYukuOku()'),
      FORM.indexOf('const form = document.querySelector'),
    );
    expect(fn).toContain('try {');
    expect(fn).toContain('} catch {');
    expect(fn).toContain('return {};');
  });

  it('rıza kararı `riza.ts`in kuralından okunuyor, elle karşılaştırılmıyor', () => {
    expect(FORM).toContain('gtmYuklensinMi(localStorage.getItem(RIZA_ANAHTARI), new Date())');
    expect(FORM).not.toContain("=== 'kabul'");
  });
});

describe('sunucu — süzgeç iki Kayıtlar yazıcısında da', () => {
  it('import\'lar yerinde', () => {
    expect(API).toContain('kaynakGovdeSuz,');
    expect(API).toContain('kaynakNotionProperties,');
    expect(API).toContain('olcumRizasiProperty,');
    expect(API).toContain("import { sehirYaz } from '../../lib/sehir.ts';");
    expect(API).toContain("import { notionKayitYaz } from '../../lib/kayit-yazim.ts';");
  });

  it('`KayitBody` alanları tanıyor', () => {
    expect(API).toContain('olcum_rizasi?: boolean;');
    expect(API).toContain('utm_campaign?: string;');
  });

  it('iki Kayıtlar yazıcısı da süzgeci çağırıyor (kayıt + sadece-askı)', () => {
    const cagri = 'Object.assign(properties, kaynakNotionProperties(kaynakGovdeSuz(body)));';
    expect((API_YUZEY.match(new RegExp(cagri.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) ?? []))
      .toHaveLength(2);
    expect((API_YUZEY.match(/olcumRizasiProperty\(body\.olcum_rizasi === true\)/g) ?? []))
      .toHaveLength(2);
  });

  it('yedek yazım yolu iki yazıcıda da kullanılıyor — düz `pages.create` kalmadı', () => {
    expect((API_YUZEY.match(/await notionKayitYaz\(\{/g) ?? [])).toHaveLength(2);
  });

  it('Başvurular DB\'sine UTM GİRMİYOR — beş alan orada açılmadı', () => {
    const basvuru = API_YUZEY.slice(
      API_YUZEY.indexOf('async function notionBasvuruYaz'),
      API_YUZEY.indexOf('async function', API_YUZEY.indexOf('async function notionBasvuruYaz') + 10),
    );
    expect(basvuru).not.toContain('kaynakNotionProperties');
    expect(basvuru).not.toContain('olcumRizasiProperty');
  });

  it('şehir NORMALLEŞTİRİLEREK yazılıyor — ham `body.sehir` yüzeyde kalmadı', () => {
    expect(API_YUZEY).toContain('const sehirDeger = sehirYaz(body.sehir);');
    expect(API_YUZEY).toContain('const basvuruSehir = sehirYaz(body.sehir);');
    expect(API_YUZEY).not.toContain('content: body.sehir }');
  });
});

describe('DUR koşulu 4 — İŞ C ödeme yoluna DOKUNMUYOR', () => {
  it('ödeme hash\'i / imzası / callback dizeleri İŞ C eklerinde geçmiyor', () => {
    // Eklenen üç lib dosyası ödeme yüzeyinden tamamen ayrı.
    for (const dosya of ['lib/kaynak.ts', 'lib/sehir.ts', 'lib/kayit-yazim.ts']) {
      const s = readFileSync(join(KOK, dosya), 'utf-8');
      for (const yasak of ['odemeBildir', 'odemeLinkImzasi', 'checkoutBaslat', 'odeme-callback', 'hash']) {
        expect(s, `${dosya} → ${yasak}`).not.toContain(yasak);
      }
    }
  });

  it('`odemeBildir` çağrı sayısı değişmedi (iki uç: callback + tarama)', () => {
    // İŞ C bu fonksiyona hiç dokunmadı; `api/kayit.ts` onu zaten çağırmıyor.
    expect(API).not.toContain('odemeBildir');
  });
});
