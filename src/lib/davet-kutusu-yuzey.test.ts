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

  it('SIRA: pano → görsel → canShare → share (İŞ 13)', () => {
    const dal = instagramDali();
    expect(dal).toBeTruthy();
    const iPano = dal.indexOf('await kopyala(');
    const iDosya = dal.indexOf('await hikayeDosyasi()');
    const iCanShare = dal.indexOf('nav.canShare({ files: [dosya] })');
    const iShare = dal.indexOf('await nav.share!({ files: [dosya!] })');
    expect(iPano).toBeGreaterThan(-1);
    expect(iDosya).toBeGreaterThan(iPano);
    expect(iCanShare).toBeGreaterThan(iDosya);
    expect(iShare).toBeGreaterThan(iCanShare);
  });

  it('⚠ `share` YALNIZ `files` ile çağrılıyor — text/url EKLENMİYOR', () => {
    // Instagram dosya varken metni düşürüyor, bazı hedefler dosyayı atlıyor;
    // ikisini birlikte vermek "ya biri ya öteki" kumarı olurdu.
    const dal = instagramDali();
    expect(dal).toMatch(/nav\.share!\(\{ files: \[dosya!\] \}\)/);
    expect(dal).not.toMatch(/share!\(\{ files[^)]*text/);
    expect(dal).not.toMatch(/share!\(\{ files[^)]*url/);
  });

  it('⚠ GÖRSEL İLK YÜKLEMEDE İSTENMEZ — yalnız tıklamayla', () => {
    // 2,3 MB'lık bir PNG'yi hiç paylaşmayacak her kadına indirtmek olurdu.
    //
    // ⚠ Kriter dosyanın GERÇEK hâlinden: `fetch` `hikayeDosyasi()` içinde ve
    // o fonksiyon seçiciden ÖNCE tanımlı, yani handler diliminde görünmüyor.
    // İlk yazımda `dal` içinde fetch aradım ve boş döndü (CLAUDE.md §3 —
    // bu turda beşinci kez; ders not edildi).
    //
    // Doğru ölçüt: fetch TEK yerde (o fonksiyonda) ve o fonksiyon YALNIZ
    // handler'dan çağrılıyor.
    expect(KOD).toMatch(/async function hikayeDosyasi\(\): Promise<File \| null> \{[\s\S]*?await fetch\(HIKAYE_YOLU\)/);
    const cagrilar = KOD.match(/hikayeDosyasi\(\)/g) ?? [];
    // Bir tanım + bir çağrı.
    expect(cagrilar).toHaveLength(2);
    expect(instagramDali()).toMatch(/const dosya = await hikayeDosyasi\(\);/);
    // Görsel yolu başka hiçbir yerde istenmiyor; ön-yükleme yok.
    const yollar = KOD.match(/ocak-hikaye-karti/g) ?? [];
    expect(yollar).toHaveLength(2); // HIKAYE_YOLU + HIKAYE_ADI
    expect(KOD).not.toMatch(/new Image\(/);
    expect(KOD).not.toMatch(/rel="preload"/);
  });

  it('canShare YOKSA → DM gelen kutusu (İŞ 11 yolu korunuyor)', () => {
    const dal = instagramDali();
    expect(dal).toMatch(/if \(!dosyaPaylasilir\) \{/);
    expect(dal).toMatch(/dmYolu\(panoOk\);/);
    expect(KOD).toMatch(/https:\/\/www\.instagram\.com\/direct\/inbox\//);
  });

  it('⚠ AbortError SESSİZ — vazgeçme hata değil', () => {
    const dal = instagramDali();
    expect(dal).toMatch(/if \(ad !== 'AbortError'\)/);
    // Kadına hiçbir hata metni gösterilmiyor.
    const yakala = dal.match(/\} catch \(err\) \{[\s\S]*?\n          \}/)?.[0] ?? '';
    expect(yakala).toBeTruthy();
    expect(yakala).not.toMatch(/notGoster\(/);
    expect(yakala).not.toMatch(/teyitGoster\(/);
  });

  it('⚠ pano REDDEDİLİRSE paylaşım SÜRER, bilgi satırı GÖSTERİLMEZ', () => {
    const dal = instagramDali();
    // Pano sonucu akışı durdurmuyor — `return` yok.
    expect(dal).toMatch(/const panoOk = await kopyala\(metin, url\);/);
    expect(dal).not.toMatch(/if \(!panoOk\) return/);
    // Bilgi satırı iki dalda da panoOk'a bağlı.
    expect(dal).toMatch(/if \(panoOk\) notGoster\(NOT_HIKAYE\);/);
    expect(KOD).toMatch(/if \(panoOk\) notGoster\(NOT_DM\);/);
  });

  it('iki bilgi satırı birebir ve YALNIZ dokunulunca görünür', () => {
    expect(KOD).toMatch(/Bağlantı kopyalandı; hikâyede bağlantı çıkartmasına yapıştır\./);
    expect(KOD).toMatch(/Metin kopyalandı; mesaja yapıştırman yeter\./);
    expect(KOD).toMatch(/data-davet-instagram-not hidden/);
    expect(KOD).toMatch(/instagramNot\.hidden = false;/);
  });

  it('görsel dosya adı ve tipi birebir', () => {
    expect(KOD).toMatch(/const HIKAYE_YOLU = '\/paylas\/ocak-hikaye-karti\.png';/);
    expect(KOD).toMatch(/const HIKAYE_ADI = 'ocak-hikaye-karti\.png';/);
    expect(KOD).toMatch(/new File\(\[blob\], HIKAYE_ADI, \{ type: 'image\/png' \}\)/);
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
