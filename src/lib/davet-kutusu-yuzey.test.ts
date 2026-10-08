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

/**
 * Instagram düğmesinin click handler'ı.
 *
 * ⚠ Çapa dosyanın GERÇEK hâlinden alındı (CLAUDE.md §3): seçici
 * `'[data-davet-instagram]'` — köşeli parantez dahil. İlk yazımda
 * `data-davet-instagram')` aradım, parantezi atladım ve eşleşme boş döndü.
 * Üç turda dördüncü kez: kriteri yazmadan önce deseni dosyada gör.
 */
function instagramDali(): string {
  const bas = KOD.indexOf("'[data-davet-instagram]'");
  if (bas < 0) return '';
  const son = KOD.indexOf('mailForm?.addEventListener', bas);
  return KOD.slice(bas, son > bas ? son : undefined);
}

describe('blok — başlık · alt satır · ÜÇ düğme (İŞ 15)', () => {
  it('başlık ve alt satır brief metniyle birebir', () => {
    expect(KOD).toMatch(/<h3 class="davet-kutusu__baslik">Bir kız kardeşini de çağır<\/h3>/);
    expect(KOD).toMatch(/Ateşin yanında onun da yeri var\./);
    expect(KOD).not.toMatch(/Üç yol/);
  });

  it('ÜÇ EŞİT düğme, üçü de `.ocak-dugme`', () => {
    // Kanal seçimi kadının; biri "birincil" olsaydı ötekiler ikinci sınıf bir
    // yoldan geçmiş olurdu.
    expect(KOD).toMatch(/class="ocak-dugme" data-davet-whatsapp>WhatsApp'ta paylaş<\/button>/);
    expect(KOD).toMatch(/class="ocak-dugme" data-davet-instagram>Instagram'da paylaş<\/button>/);
    expect(KOD).toMatch(/class="ocak-dugme" data-davet-eposta>E-postayla paylaş<\/button>/);
    const dugmeler = KOD.match(/class="ocak-dugme" data-davet-/g) ?? [];
    expect(dugmeler).toHaveLength(3);
  });

  it('mobilde alt alta, 480 px\'ten sonra yan yana ve EŞİT', () => {
    const kural = KAYNAK.match(/\.davet-kutusu__ucluk \{[\s\S]*?\n  \}/)?.[0] ?? '';
    expect(kural).toMatch(/display: grid;/);
    const medya = KAYNAK.match(/@media \(min-width: 480px\) \{[\s\S]*?\n  \}/)?.[0] ?? '';
    expect(medya).toMatch(/grid-template-columns: repeat\(3, 1fr\);/);
  });

  it('eski düğmeler ve DİNAMİK bilgi satırları KALKTI', () => {
    expect(KOD).not.toMatch(/data-davet-paylas/);
    expect(KOD).not.toMatch(/data-davet-kopyala/);
    expect(KOD).not.toMatch(/Bağlantıyı kopyala/);
    expect(KOD).not.toMatch(/data-davet-instagram-not/);
    expect(KOD).not.toMatch(/Bağlantı kopyalandı; hikâyede/);
    expect(KOD).not.toMatch(/Metin kopyalandı; mesaja yapıştırman yeter/);
  });

  it('SABİT talimat — her zaman görünür, koşulsuz', () => {
    // Eski hâlde bilgi yalnız dokunulduktan SONRA çıkıyordu; kadın akışı
    // öğrendiğinde zaten içindeydi.
    const talimat = KOD.match(/<p class="davet-kutusu__talimat">([\s\S]*?)<\/p>/)?.[1] ?? '';
    expect(talimat.replace(/\s+/g, ' ').trim()).toBe(
      "Instagram'ı seçince kartımız açılır, bağlantı da kopyalanır. Hikâyende çıkartmalardan «Bağlantı»ya dokunup yapıştırman yeter.",
    );
    // `hidden` YOK ve JS onu göstermiyor/gizlemiyor.
    //
    // ⚠ Ölçüt AÇILIŞ ETİKETİNİ izole ediyor. İlk yazımda
    // `/davet-kutusu__talimat[^>]*hidden/` kullandım; `[^>]*` satır atlayıp
    // stil bloğundaki `[hidden]` kuralına kadar uzandı ve doğru kodu kırmızı
    // yaktı. Bu turda altıncı kez aynı ders — kriter deseni dosyada
    // görülmeden yazılmaz (CLAUDE.md §3).
    const etiket = KOD.match(/<p class="davet-kutusu__talimat"[^>]*>/)?.[0] ?? '';
    expect(etiket).toBeTruthy();
    expect(etiket).not.toMatch(/hidden/);
    expect(KOD).not.toMatch(/talimat\.hidden/);
  });

  it('yerel düğme ailesi ölü CSS bırakmadı', () => {
    expect(KOD).not.toMatch(/\.davet-kutusu__btn/);
    expect(KOD).not.toMatch(/\.davet-kutusu__ikili/);
  });
});

describe('WhatsApp — her cihazda wa.me, navigator.share YOK (İŞ 15)', () => {
  it('`wa.me` doğrudan, yeni sekmede', () => {
    const fn = KOD.match(/function whatsappPaylas[\s\S]*?\n  \}/)?.[0] ?? '';
    expect(fn).toBeTruthy();
    expect(fn).toMatch(/https:\/\/wa\.me\/\?text=\$\{encodeURIComponent\(`\$\{text\} \$\{url\}`\)\}/);
    expect(fn).toMatch(/'noopener,noreferrer'/);
  });

  it('⚠ `navigator.share` WhatsApp yolunda KULLANILMIYOR', () => {
    // O menü hedefi kadına seçtirir; düğmede "WhatsApp" yazarken Mesajlar
    // açılması sözü tutmamak olurdu.
    const fn = KOD.match(/function whatsappPaylas[\s\S]*?\n  \}/)?.[0] ?? '';
    expect(fn).not.toMatch(/share/);
    // Eski birleşik `paylas()` tamamen kalktı.
    expect(KOD).not.toMatch(/function paylas\(/);
  });

  it('`navigator.share` YALNIZ hikâye kartı dosyası için', () => {
    const paylasimlar = KOD.match(/nav\.share/g) ?? [];
    // Bir tip kontrolü + bir çağrı.
    expect(paylasimlar.length).toBeLessThanOrEqual(2);
    expect(KOD).toMatch(/nav\.share!\(\{ files: \[dosya!\] \}\)/);
  });
});

describe('E-posta — mailto, konu ve gövde dolu (İŞ 15)', () => {
  it('konu ve gövde birebir', () => {
    const fn = KOD.match(/function epostaPaylas[\s\S]*?\n  \}/)?.[0] ?? '';
    expect(fn).toMatch(/encodeURIComponent\('Ateşin başında olacağım'\)/);
    expect(fn).toMatch(/encodeURIComponent\(`\$\{text\}\\n\\n\$\{url\}`\)/);
    expect(fn).toMatch(/mailto:\?subject=\$\{konu\}&body=\$\{govde\}/);
  });

  it('`location.href` — `window.open` DEĞİL', () => {
    // `mailto:` yeni sekmede açıldığında bazı tarayıcılar boş sekme bırakıyor.
    const fn = KOD.match(/function epostaPaylas[\s\S]*?\n  \}/)?.[0] ?? '';
    expect(fn).toMatch(/window\.location\.href = `mailto:/);
    expect(fn).not.toMatch(/window\.open/);
  });
});

describe('Instagram — pano YALNIZ url, sonra İŞ 13 akışı (İŞ 15)', () => {
  it('⚠ panoya YALNIZ `url` gidiyor', () => {
    // Hikâyedeki "Bağlantı" çıkartması bir URL bekliyor; metinle birlikte
    // kopyalamak onu bozardı.
    const dal = instagramDali();
    expect(dal).toMatch(/const \{ url \} = getDavet\(\);/);
    expect(dal).toMatch(/await kopyalaMetin\(url\);/);
    expect(dal).not.toMatch(/kopyalaMetin\(`\$\{metin\}/);
  });

  it('SIRA: pano → görsel → canShare → share', () => {
    const dal = instagramDali();
    const iPano = dal.indexOf('await kopyalaMetin(url)');
    const iDosya = dal.indexOf('await hikayeDosyasi()');
    const iCanShare = dal.indexOf('nav.canShare({ files: [dosya] })');
    const iShare = dal.indexOf('await nav.share!({ files: [dosya!] })');
    expect(iPano).toBeGreaterThan(-1);
    expect(iDosya).toBeGreaterThan(iPano);
    expect(iCanShare).toBeGreaterThan(iDosya);
    expect(iShare).toBeGreaterThan(iCanShare);
  });

  it('⚠ `share` YALNIZ `files` ile — text/url EKLENMİYOR', () => {
    const dal = instagramDali();
    expect(dal).toMatch(/nav\.share!\(\{ files: \[dosya!\] \}\)/);
    expect(dal).not.toMatch(/share!\(\{ files[^)]*text/);
    expect(dal).not.toMatch(/share!\(\{ files[^)]*url/);
  });

  it('⚠ GÖRSEL İLK YÜKLEMEDE İSTENMEZ — yalnız tıklamayla', () => {
    expect(KOD).toMatch(/async function hikayeDosyasi\(\): Promise<File \| null> \{[\s\S]*?await fetch\(HIKAYE_YOLU\)/);
    const cagrilar = KOD.match(/hikayeDosyasi\(\)/g) ?? [];
    expect(cagrilar).toHaveLength(2);
    expect(instagramDali()).toMatch(/const dosya = await hikayeDosyasi\(\);/);
    const yollar = KOD.match(/ocak-hikaye-karti/g) ?? [];
    expect(yollar).toHaveLength(2);
    expect(KOD).not.toMatch(/new Image\(/);
    expect(KOD).not.toMatch(/rel="preload"/);
  });

  it('canShare YOKSA → DM gelen kutusu', () => {
    const dal = instagramDali();
    expect(dal).toMatch(/if \(!dosyaPaylasilir\) \{/);
    expect(dal).toMatch(/dmYolu\(\);/);
    expect(KOD).toMatch(/https:\/\/www\.instagram\.com\/direct\/inbox\//);
  });

  it('⚠ AbortError SESSİZ — vazgeçme hata değil', () => {
    const dal = instagramDali();
    expect(dal).toMatch(/if \(ad !== 'AbortError'\)/);
    const yakala = dal.match(/\} catch \(err\) \{[\s\S]*?\n          \}/)?.[0] ?? '';
    expect(yakala).toBeTruthy();
    expect(yakala).not.toMatch(/teyitGoster\(/);
  });

  it('⚠ pano REDDEDİLİRSE paylaşım SÜRER', () => {
    const dal = instagramDali();
    // Pano sonucu akışı durdurmuyor: dönüş değeri okunmuyor bile.
    expect(dal).toMatch(/await kopyalaMetin\(url\);/);
    expect(dal).not.toMatch(/if \(!.*kopyalaMetin/);
    expect(dal).not.toMatch(/const panoOk/);
  });

  it('paylaş metni brief\'ten birebir', () => {
    expect(KOD).toMatch(
      /return 'Ateşin başında olacağım\. Sen de gelmek istersen yanımda yer var:';/,
    );
  });

  it('görsel dosya adı ve tipi birebir', () => {
    expect(KOD).toMatch(/const HIKAYE_YOLU = '\/paylas\/ocak-hikaye-karti\.png';/);
    expect(KOD).toMatch(/const HIKAYE_ADI = 'ocak-hikaye-karti\.png';/);
    expect(KOD).toMatch(/new File\(\[blob\], HIKAYE_ADI, \{ type: 'image\/png' \}\)/);
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
