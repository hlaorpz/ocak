import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Footer source disiplini — manifesto cümlesi sabit alt-zemin imzası
 * (KARAR 162 sayfa-içi manifesto-vurgu göçünün TERSİ değil; iki ayrı
 * katman — bu test imzanın yanlışlıkla glyph/glow/altın tarafına
 * kaymadığını koruyor).
 *
 * Source-level test (dist build'e bağımlı değil): Footer.astro literal
 * grep ile spec eşleşmesi doğrulanır.
 */

const FOOTER_PATH = join(__dirname, 'Footer.astro');
// Marka KARAR'ı: cümle iki parçaya bölündü (mobil kırılma için iki <span>),
// AMA okunduğunda birleşik cümle aynen kalır. Test iki parçayı ayrı arar.
const VERBATIM_PART_1 = 'Seni bize bağımlı yapmak için değil,';
const VERBATIM_PART_2 = 'seni sana geri vermek için buradayız.';

describe('Footer.astro — sabit manifesto imzası', () => {
  const source = readFileSync(FOOTER_PATH, 'utf-8');

  it('verbatim cümle iki parça olarak mevcut (marka KARAR\'ı, değişmez)', () => {
    expect(source).toContain(VERBATIM_PART_1);
    expect(source).toContain(VERBATIM_PART_2);
    // Parça 1, parça 2'den önce gelmeli (okuma sırası korunur).
    expect(source.indexOf(VERBATIM_PART_1)).toBeLessThan(
      source.indexOf(VERBATIM_PART_2),
    );
  });

  it('iki span yapısı + ikincisi mobil kırılma için --break modifier taşır', () => {
    expect(source).toMatch(/class="footer__manifesto-line"/);
    expect(source).toMatch(
      /class="footer__manifesto-line footer__manifesto-line--break"/,
    );
  });

  it('footer__manifesto class ile sarılı (CSS hedef noktası)', () => {
    expect(source).toMatch(/class="footer__manifesto"/);
  });

  it('--cream-soft kullanılıyor (parlak --cream değil)', () => {
    // .footer__manifesto bloğunda color: var(--cream-soft)
    const manifestoBlock = source.match(
      /\.footer__manifesto\s*\{[\s\S]*?\}/,
    )?.[0];
    expect(manifestoBlock).toBeDefined();
    expect(manifestoBlock).toContain('var(--cream-soft)');
  });

  it('--gold / --ember kullanılmıyor (vurgu paleti karışmasın)', () => {
    const manifestoBlock = source.match(
      /\.footer__manifesto\s*\{[\s\S]*?\}/,
    )?.[0];
    expect(manifestoBlock).toBeDefined();
    expect(manifestoBlock).not.toContain('var(--gold)');
    expect(manifestoBlock).not.toContain('var(--ember)');
  });

  it('font-display italic Cormorant (marka serifi)', () => {
    const manifestoBlock = source.match(
      /\.footer__manifesto\s*\{[\s\S]*?\}/,
    )?.[0];
    expect(manifestoBlock).toContain('font-family: var(--font-display)');
    expect(manifestoBlock).toContain('font-style: italic');
  });

  it('final punto (clamp 1.3-1.55rem, ic-ses üst sınırına yakın ama altında)', () => {
    const manifestoBlock = source.match(
      /\.footer__manifesto\s*\{[\s\S]*?\}/,
    )?.[0];
    // clamp(1.3rem, 2.2vw, 1.55rem) — üst sınır ic-ses (1.5) üstünde kalmıyor
    // değil ama kasıtlı: footer artık glyphsiz/glowsuz/cream-soft tonuyla
    // hâlâ ayrışıyor. Eyeball sonrası final orta-üst basamak.
    expect(manifestoBlock).toMatch(
      /font-size:\s*clamp\(1\.3rem,\s*[^,]+,\s*1\.55rem\)/,
    );
  });

  it('mobil kırılma: @media max-width 600px + parça-2 display: block', () => {
    // ≤600px'te ikinci parça block olur — konteyner text-align center miras
    // ettiği için her iki satır ortalı kalır.
    expect(source).toMatch(
      /@media\s*\(max-width:\s*600px\)\s*\{[\s\S]*?\.footer__manifesto-line--break\s*\{[\s\S]*?display:\s*block/,
    );
  });

  it('≤360px güvenlik: nowrap kaldırılır (yatay scroll yok)', () => {
    expect(source).toMatch(
      /@media\s*\(max-width:\s*360px\)\s*\{[\s\S]*?\.footer__manifesto-line\s*\{[\s\S]*?white-space:\s*normal/,
    );
  });

  it('GLYPH YOK — manifesto-vurgu__ember veya benzer dekoratif span emit etmez', () => {
    // Sayfa-içi manifesto-vurgu glyph'i (köz nokta) footer'a sızmamalı.
    // ic-ses paterni: cümle paragraph içinde, aria-hidden span yok.
    expect(source).not.toContain('manifesto-vurgu__ember');
    expect(source).not.toContain('footer__ember');
    expect(source).not.toMatch(/aria-hidden=["']true["'][^>]*><\/span>/);
  });

  it('GLOW YOK — box-shadow/text-shadow yok (cream-soft ton korunur)', () => {
    const manifestoBlock = source.match(
      /\.footer__manifesto\s*\{[\s\S]*?\}/,
    )?.[0];
    expect(manifestoBlock).not.toContain('box-shadow');
    expect(manifestoBlock).not.toContain('text-shadow');
  });

  it('konum: telif/link satırının (.footer__bottom) ÜSTÜNDE', () => {
    // Source sırasında footer__manifesto, footer__bottom'dan önce gelmeli
    const manifestoIdx = source.indexOf('class="footer__manifesto"');
    const bottomIdx = source.indexOf('class="footer__bottom"');
    expect(manifestoIdx).toBeGreaterThan(-1);
    expect(bottomIdx).toBeGreaterThan(-1);
    expect(manifestoIdx).toBeLessThan(bottomIdx);
  });
});
