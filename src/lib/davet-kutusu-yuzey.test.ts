import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * `DavetKutusu.astro` — "Bir kız kardeşini de çağır" bloğu (İŞ 4, 7 Eki).
 *
 * Blok iki ekranda AYNI bileşen: havale başarı ekranı (KayitFormu) ve
 * `/odeme/tamam`. Bileşen Astro; frontmatter ve inline script çağrılamıyor,
 * ölçüm kaynak-grep'iyle.
 *
 * ── Kaan kararı (7 Eki) ──
 * E-postayla davet formu ARAYÜZDEN kalkar ama `/api/davet`, Davetler DB,
 * Resend şablonu ve `davet-*.ts` SİLİNMEZ: `DAVET_AKISI` musluğu formu
 * göstermeme yönünde kullanılır, kod yolu kapalı, dosyalar duruyor.
 *
 * ÖLÇÜM: Davetler DB'de **0 satır** — hat bugüne kadar hiç satır üretmemiş.
 *
 * Dosya `src/lib/` altında (KARAR 574).
 */

const KAYNAK = readFileSync(join(__dirname, '..', 'components', 'DavetKutusu.astro'), 'utf-8');
const KOD = KAYNAK
  .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/(^|[^:])\/\/.*$/gm, '$1');

describe('blok — başlık · alt satır · iki düğme', () => {
  it('başlık ve alt satır brief metniyle birebir', () => {
    expect(KOD).toMatch(/<h3 class="davet-kutusu__baslik">Bir kız kardeşini de çağır<\/h3>/);
    expect(KOD).toMatch(/Ateşin yanında onun da yeri var\./);
    // Eski alt satır "Üç yol, hangi kanal kolaysa." KALKTI — üç yol kalmadı.
    expect(KOD).not.toMatch(/Üç yol/);
  });

  it('ANA düğme "Paylaş" ve paylaşılan birincil sınıfı kullanıyor', () => {
    expect(KOD).toMatch(/<button type="button" class="ocak-dugme" data-davet-paylas>Paylaş<\/button>/);
    // Eski etiket WhatsApp'ı tek kanal gibi gösteriyordu.
    expect(KOD).not.toMatch(/WhatsApp ile çağır/);
    expect(KOD).not.toMatch(/data-davet-whatsapp/);
  });

  it('İKİNCİL düğme "Bağlantıyı kopyala" — Instagram etiketi KALKTI', () => {
    expect(KOD).toMatch(/data-davet-kopyala>\s*\n?\s*Bağlantıyı kopyala/);
    expect(KOD).not.toMatch(/Instagram'dan göndereceksen kopyala/);
  });

  it('kopyalama teyidi tek kelime: "Kopyalandı"', () => {
    expect(KOD).toMatch(/teyitGoster\(ok \? 'Kopyalandı'/);
    expect(KOD).not.toMatch(/DM'ine yapıştır/);
  });
});

describe('paylaşım — navigator.share({ text, url }) / wa.me yeni sekmede', () => {
  it('`text` ve `url` AYRI geçiyor', () => {
    // Ayrı geçmek platformun işini kolaylaştırıyor: iOS paylaş sayfası URL'i
    // tanıyıp önizleme çıkarıyor, WhatsApp link kartı basıyor.
    expect(KOD).toMatch(/nav\.share\(\{ text, url \}\)/);
  });

  it('paylaş metni brief\'ten birebir', () => {
    expect(KOD).toMatch(
      /return 'Ateşin yanında bir yer daha var\. Ben geliyorum; sen de gelmek istersen:';/,
    );
  });

  it('Web Share yoksa wa.me — YENİ SEKMEDE', () => {
    // Eski hâl `window.location.href` ile aynı sekmede açıyordu: kadın başarı
    // ekranından (referans kodu, IBAN) çıkıp geri dönemiyordu.
    expect(KOD).toMatch(/window\.open\(\s*\n?\s*`https:\/\/wa\.me\/\?text=\$\{encodeURIComponent/);
    expect(KOD).toMatch(/'noopener,noreferrer'/);
    expect(KOD).not.toMatch(/window\.location\.href = `https:\/\/wa\.me/);
  });

  it('⚠ share iptalinde wa.me\'ye DÜŞMÜYOR', () => {
    // "Paylaşmaktan vazgeçtim" jestini WhatsApp'a yönlendirmeye çevirmek
    // kadının kararını yok saymaktı.
    const dal = KOD.match(/nav\.share\(\{ text, url \}\)\.catch\([\s\S]*?\}\);/)?.[0] ?? '';
    expect(dal).toBeTruthy();
    expect(dal).not.toMatch(/wa\.me/);
  });

  it('bağlantı ETKİNLİĞİN KENDİ SAYFASI; slug yoksa eskiye düşer', () => {
    expect(KOD).toMatch(/if \(etkinlikUrl\) return etkinlikUrl;/);
    expect(KOD).toMatch(/data-davet-url=\{etkinlikUrl\}/);
    // Yedek yol duruyor — kırık adres üretilmez.
    expect(KOD).toMatch(/\/acik-kapi/);
  });
});

describe('e-posta davet formu — arayüzden kalktı, DOSYALAR DURUYOR', () => {
  it('musluk artık BLOĞU değil YALNIZ formu sarıyor', () => {
    // Eski hâlde `{DAVET_AKISI_ACIK && (<aside` idi: musluk kapanınca paylaşım
    // da kayboluyordu.
    expect(KOD).not.toMatch(/\{DAVET_AKISI_ACIK && \(\s*\n?<aside/);
    expect(KOD).toMatch(/\{DAVET_AKISI_ACIK && \(\s*\n\s*<form class="davet-kutusu__mail"/);
  });

  it('form markup\'ı SİLİNMEDİ — muslukla kapalı', () => {
    expect(KOD).toMatch(/data-davet-mail\b/);
    expect(KOD).toMatch(/data-davet-mail-input/);
    expect(KOD).toMatch(/Adın ve hangi buluşmaya geldiğin görünecek\./);
  });

  it('"tek bir mesaj ulaşır" sözü de muslukla kapalı', () => {
    // O söz E-POSTA davetine ait; paylaş/kopyala yolunda biz kimseye mesaj
    // göndermiyoruz.
    const i = KOD.indexOf('davet-kutusu__temizlik');
    const once = KOD.slice(Math.max(0, i - 120), i);
    expect(once).toMatch(/DAVET_AKISI_ACIK && \(/);
  });

  it('`/api/davet` ve `davet-*.ts` dosyaları YERİNDE', () => {
    for (const yol of [
      ['pages', 'api', 'davet.ts'],
      ['lib', 'davet-akisi.ts'],
      ['lib', 'davet-kapi.ts'],
      ['lib', 'davet-baglam.ts'],
    ]) {
      expect(() => readFileSync(join(__dirname, '..', ...yol), 'utf-8')).not.toThrow();
    }
  });
});
