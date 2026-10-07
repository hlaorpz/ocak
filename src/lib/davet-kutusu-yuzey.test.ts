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

  it('İKİ EŞİT düğme, ikisi de `.ocak-dugme` (İŞ 11)', () => {
    // Instagram OCAK'ın gerçek trafiğinde WhatsApp kadar ağır; "ikincil"
    // saymak kadını kendi kanalına ikinci sınıf bir yoldan geçirmek olurdu.
    expect(KOD).toMatch(/<button type="button" class="ocak-dugme" data-davet-paylas>Paylaş<\/button>/);
    expect(KOD).toMatch(/<button type="button" class="ocak-dugme" data-davet-instagram>Instagram'da gönder<\/button>/);
    // "Bağlantıyı kopyala" ve eski Instagram etiketi KALKTI.
    expect(KOD).not.toMatch(/Bağlantıyı kopyala/);
    expect(KOD).not.toMatch(/Instagram'dan göndereceksen kopyala/);
    expect(KOD).not.toMatch(/data-davet-kopyala/);
  });

  it('yerel düğme ailesi ölü CSS bırakmadı', () => {
    // `.davet-kutusu__btn*` `.ocak-dugme`'den üç yerde ayrışmıştı: metin
    // `--cream` (kardeşler `--coal`), `border-radius: 3px` (sitenin hiçbir
    // düğmesinde yok), `--duration-fast` (ötekiler `--duration-base`).
    expect(KOD).not.toMatch(/\.davet-kutusu__btn/);
  });

  it('Instagram akışı: kopyala → DM gelen kutusu, SIRA önemli', () => {
    // `window.open` KOPYALAMADAN SONRA: tersi olsaydı sekme açılır, odak
    // kaybolur ve `clipboard.writeText` "document is not focused" ile düşerdi.
    const dal = instagramDali();
    expect(dal).toBeTruthy();
    expect(dal.indexOf('await kopyala(')).toBeGreaterThan(-1);
    expect(dal.indexOf('window.open(')).toBeGreaterThan(dal.indexOf('await kopyala('));
    expect(dal).toMatch(/https:\/\/www\.instagram\.com\/direct\/inbox\//);
  });

  it('⚠ kopyalama BAŞARISIZSA sekme AÇILMAZ', () => {
    // Yapıştıracak bir şeyi olmayan kadını Instagram'a göndermek, onu eli boş
    // bırakmak olurdu.
    const dal = instagramDali();
    const iRed = dal.indexOf('if (!ok)');
    const iOpen = dal.indexOf('window.open(');
    expect(iRed).toBeGreaterThan(-1);
    expect(iOpen).toBeGreaterThan(iRed);
    expect(dal).toMatch(/return;/);
  });

  it('bilgi satırı birebir ve YALNIZ dokunulunca görünür', () => {
    expect(KOD).toMatch(/Metin kopyalandı; mesaja yapıştırman yeter\./);
    expect(KOD).toMatch(/data-davet-instagram-not hidden/);
    expect(KOD).toMatch(/instagramNot\.hidden = false;/);
  });
});

describe('paylaşım — navigator.share({ text, url }) / wa.me yeni sekmede', () => {
  it('`text` ve `url` AYRI geçiyor', () => {
    // Ayrı geçmek platformun işini kolaylaştırıyor: iOS paylaş sayfası URL'i
    // tanıyıp önizleme çıkarıyor, WhatsApp link kartı basıyor.
    expect(KOD).toMatch(/nav\.share\(\{ text, url \}\)/);
  });

  it('paylaş metni brief\'ten birebir (İŞ 11)', () => {
    expect(KOD).toMatch(
      /return 'Ateşin başında olacağım\. Sen de gelmek istersen yanımda yer var:';/,
    );
    // İŞ 4'ün metni kalktı.
    expect(KOD).not.toMatch(/Ateşin yanında bir yer daha var/);
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
