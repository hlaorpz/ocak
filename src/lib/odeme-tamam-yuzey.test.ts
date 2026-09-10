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

  it('KARAR 395 — h1 ve gövde TEK koşulu paylaşır, ikinci koşul yok', () => {
    // `durum` yalnız bir kez karşılaştırılır: `kayitBulundu`nun tanımında.
    // İkinci bir `durum === …` başlık için ayrı bir yol açardı ve iki yol
    // zamanla ayrışırdı.
    const karsilastirma = KOD.match(/durum\s*===/g) ?? [];
    expect(karsilastirma).toHaveLength(1);
    expect(KOD).toMatch(/const kayitBulundu = durum === 'bulundu';/);
    // Gövde de aynı değişkeni kullanıyor — başlıkla ortak kaynak.
    expect(KOD).toMatch(/\{kayitBulundu && \(/);
    expect(KOD).toMatch(/\{!kayitBulundu && \(/);
  });

  it('ödeme yapılmamış hâlde "Ödemen alındı" KOŞULSUZ geçmez', () => {
    // Regresyon kilidi: h1 sabit bir dizeye geri dönerse burası kırmızı yanar.
    expect(KOD).not.toMatch(/<h1>\s*Ödemen alındı[^<{]*<\/h1>/);
  });

  it('mock uyarısında iç yol haritası jargonu yok', () => {
    // "Aşama 6" bizim iç fazlandırmamız; sayfayı N-Kolay denetçisi görecek.
    expect(KOD).not.toMatch(/Aşama \d/);
    // Uyarının kendisi DURUYOR — silinen yalnız jargon cümlesiydi.
    expect(KOD).toMatch(/Bu ödeme simülasyondu/);
  });
});
