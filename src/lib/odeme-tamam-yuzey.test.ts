import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * `/odeme/tamam` — yüzeyin bugünün gerçeğini söylemesi.
 *
 * Sayfanın Notion okuması `lib/odeme-kayit-oku.ts`'te davranış testiyle
 * ölçülüyor. Burada ölçülen şey farklı ve `.astro` üzerinde ancak
 * kaynak-grep'iyle ölçülebilir (frontmatter çağrılamıyor — `KayitFormu.test.ts`
 * deseni): **başlığın hangi koşula bağlandığı.**
 *
 * Kusur: h1 sabitti — "Ödemen alındı, yerin ayrıldı." Sayfa `ref` olmadan
 * doğrudan URL ile açılabiliyor, dolayısıyla hiç ödeme yapmamış birine
 * ödeme yapmış olduğu söyleniyordu. Gövde metni zaten `kayitBulundu`'ya
 * bağlıydı; başlık onu yalanlıyordu.
 *
 * ⚠ Ölçütler yorumları ELEYEREK çalışır. Bu dosyanın ilk sürümünde aynı
 * tuzağa iki kez düşüldü (bkz. `payment-provider.test.ts`): route'un
 * açıklama yorumu yasaklanan deseni taşıdığı için kriter kendi prozasına
 * takılmıştı. Kriter kodu ölçer, anlatıyı değil.
 */

/**
 * ⚠ Bu dosya `src/lib/` altında, ölçtüğü sayfanın yanında DEĞİL.
 * Sebep build'den öğrenildi: `src/pages/` altındaki HER dosya Astro için
 * bir route'tur. `src/pages/odeme/tamam.test.ts` sessizce bir route'a
 * derlendi (`tamam.test.astro.mjs`) ve `__dirname is not defined in ES
 * module scope` ile build'i düşürdü — vitest 322/322 YEŞİLKEN.
 * Repoda `src/pages/` altında hiç test olmamasının sebebi buymuş
 * (`components/` ve `lib/` route dizini değil, orada sorun yok).
 */
const KAYNAK = readFileSync(
  join(__dirname, '..', 'pages', 'odeme', 'tamam.astro'),
  'utf-8',
);

function kodu(s: string): string {
  return s
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1');
}

const KOD = kodu(KAYNAK);

describe('tamam.astro — başlık duruma bağlı (commit 6)', () => {
  it('h1 SABİT DEĞİL — `kayitBulundu` koşuluna bağlı', () => {
    const h1 = KOD.match(/<h1>[\s\S]*?<\/h1>/);
    expect(h1).toBeTruthy();
    expect(h1![0]).toMatch(/kayitBulundu/);
  });

  it('h1 iki durumda İKİ FARKLI metin gösterir', () => {
    const h1 = KOD.match(/<h1>[\s\S]*?<\/h1>/)![0];
    expect(h1).toMatch(/Ödemen alındı/);
    expect(h1).toMatch(/Kaydını bulamadık/);
    // Aynı dizeyi iki dala koymak testi geçerdi ama kusuru düzeltmezdi.
    const dallar = h1.match(/'([^']+)'/g) ?? [];
    expect(dallar).toHaveLength(2);
    expect(dallar[0]).not.toBe(dallar[1]);
  });

  it('KARAR 395 — h1, gövde ve sayfa başlığı TEK koşulu paylaşır', () => {
    // ⚠ KOŞUL DÜZEYİ ÖLÇÜM (KARAR adayı: muhafızın varlığı değil koşulu
    // ölçülür). `durum` dosyada TAM BİR KEZ karşılaştırılır —
    // `kayitBulundu`nun tanımında. Dördüncü bir yüzey eklenip kendi
    // `durum === …`ini yazarsa bu sayı 2 olur ve burası kırmızı yanar.
    // Sayı kilidi, "her yüzey ayrı koşul yazsın" sızmasının tek kapısı.
    const karsilastirma = KOD.match(/durum\s*===/g) ?? [];
    expect(karsilastirma).toHaveLength(1);
    expect(KOD).toMatch(/const kayitBulundu = durum === 'bulundu';/);
    // Dört tüketicinin dördü de aynı değişkeni okur.
    expect(KOD).toMatch(/\{kayitBulundu && \(/);
    expect(KOD).toMatch(/\{!kayitBulundu && \(/);
    expect(KOD).toMatch(/<h1>\{kayitBulundu \?/);
    expect(KOD).toMatch(/const sayfaBasligi = kayitBulundu \?/);
    expect(KOD).toMatch(/const sayfaAciklamasi = kayitBulundu \?/);
  });

  it('sayfa başlığı ve açıklaması SABİT DEĞİL — duruma bağlı', () => {
    // Kusur: h1 duruma bağlanmıştı ama `<Layout title="…">` koşulsuzdu.
    // Sekme başlığı, tarayıcı geçmişi ve paylaşım kartı hâlâ "Ödemen
    // alındı" diyordu; `noindex` bu üç yüzeyin hiçbirini kapatmıyor.
    const layout = KOD.match(/<Layout[^>]*>/)![0];
    expect(layout).toMatch(/title=\{sayfaBasligi\}/);
    expect(layout).toMatch(/description=\{sayfaAciklamasi\}/);
    // Sabit dizeye geri dönüş regresyon kilidi.
    expect(layout).not.toMatch(/title="/);
    expect(layout).not.toMatch(/description="/);
  });

  it('başlık ve açıklama iki durumda İKİ FARKLI değer alır', () => {
    for (const ad of ['sayfaBasligi', 'sayfaAciklamasi']) {
      const satir = KOD.match(new RegExp(`const ${ad} = kayitBulundu \\?[^;]+;`))![0];
      const dallar = satir.match(/'([^']*)'/g) ?? [];
      expect(dallar).toHaveLength(2);
      // Aynı dizeyi iki dala koymak testi geçerdi ama kusuru düzeltmezdi.
      expect(dallar[0]).not.toBe(dallar[1]);
    }
  });

  it('gövde h1\'i TEKRARLAMAZ — "Kaydını bulamadık" tek yerde', () => {
    // Commit 6'da h1 duruma bağlanınca aynı cümle üst üste iki kez çıktı:
    // başlıkta ve gövdenin ilk cümlesinde. Metin bir yerde söylenir.
    //
    // ⚠ İlk yazımda ölçüt "toplam 1 geçiş" idi ve YANLIŞTI: cümle artık
    // MEŞRU olarak iki yerde geçiyor — sekme başlığı (`sayfaBasligi`) ve
    // h1. Sayı kilidi doğru şeyi değil, kolay ölçüleni ölçüyordu. Kural
    // "bir kez geçsin" değil, "GÖVDEDE geçmesin".
    expect(KOD).toMatch(/<h1>[^<]*Kaydını bulamadık/);
    const govdeler = KOD.match(
      /<p class="ocak-odeme-tamam__gövde">[\s\S]*?<\/p>/g,
    ) ?? [];
    expect(govdeler.length).toBeGreaterThan(0);
    for (const g of govdeler) expect(g).not.toMatch(/Kaydını bulamadık/);
    // Bulunamadı gövdesi doğru cümleyle başlar.
    expect(govdeler.some((g) => /Ödemen alındıysa birkaç dakika/.test(g))).toBe(true);
  });

  it('ödeme yapılmamış hâlde "Ödemen alındı" KOŞULSUZ geçmez', () => {
    // Regresyon kilidi: h1 sabit bir dizeye geri dönerse burası kırmızı yanar.
    expect(KOD).not.toMatch(/<h1>\s*Ödemen alındı[^<{]*<\/h1>/);
  });

  it('B211 — "Mail kutuna da düştü." KALKTI, İKİ dalda birden', () => {
    // Cümle yanlıştı: sayfa yalnız callback'in 302'si üzerinden açılıyor,
    // yani ödeme onayından milisaniyeler sonra. Otomasyon maili yazımdan
    // 5 sn sonra kuruyor (7 Eki ölçümü) — kadın bu ekranı gördüğü anda mail
    // kutusunda DEĞİL. "düştü" varmış olmayı iddia ediyordu.
    //
    // ⚠ Ölçüt yorumları ELEYEN `KOD` üzerinde: kaldırmanın gerekçesi
    // sayfada bir `{/* */}` bloğu olarak YAŞIYOR ve cümleyi alıntılıyor.
    // Ham `KAYNAK` üzerinde ölçmek kendi anlatısına takılırdı — bu dosyanın
    // başındaki uyarının tam vakası.
    expect(KOD).not.toMatch(/Mail kutuna/);
    // Gerekçe gerçekten yorumda duruyor (kaldırma sessiz değil).
    expect(KAYNAK).toMatch(/Mail kutuna da düştü\." KALKTI/);
    // Cümlenin DOĞRU yarısı iki dalda da DURUYOR — altındaki değere giriş
    // yapıyor ve zamana bağlı bir iddia taşımıyor.
    const notlar = KOD.match(
      /<p class="ocak-odeme-tamam__katilim-not">[\s\S]*?<\/p>/g,
    ) ?? [];
    expect(notlar).toHaveLength(2);
    expect(notlar.some((n) => /Buluşma linkin burada\./.test(n))).toBe(true);
    expect(notlar.some((n) => /Buluşacağımız yer burada\./.test(n))).toBe(true);
    for (const n of notlar) expect(n).not.toMatch(/düştü/);
  });

  it('B211 — sayfa `Mail Gitti`\'yi OKUMAZ, yerine yeni cümle de yazılmadı', () => {
    // Bayrağa bağlanmadı: anlamı "MailerLite yazımı başarılı", teslim
    // garantisi değil — ayrıca `databases.query` okuma-sonrası-yazma tutarlı
    // olmadığı için 200 ms önce basılmış checkbox bayat gelip cümleyi
    // rastgele kaybettirirdi. Alan havale/n8n ağının sorusuna cevap verir.
    expect(KOD).not.toMatch(/Mail Gitti/);
    expect(KOD).not.toMatch(/mailGitti/);
    // Yerine yeni kamu metni yazılmadı: `__katilim-not` iki paragraf, tek
    // cümle. Üçüncü bir cümle sızarsa burası kırmızı yanar.
    const notlar = KOD.match(
      /<p class="ocak-odeme-tamam__katilim-not">([\s\S]*?)<\/p>/g,
    ) ?? [];
    for (const n of notlar) {
      const metin = n.replace(/<[^>]+>/g, '').trim();
      expect(metin.split('.').filter((s) => s.trim()).length).toBe(1);
    }
  });

  it('mock uyarısında iç yol haritası jargonu yok', () => {
    // "Aşama 6" bizim iç fazlandırmamız; sayfayı N-Kolay denetçisi görecek.
    expect(KOD).not.toMatch(/Aşama \d/);
    // Uyarının kendisi DURUYOR — silinen yalnız jargon cümlesiydi.
    expect(KOD).toMatch(/Bu ödeme simülasyondu/);
  });
});
