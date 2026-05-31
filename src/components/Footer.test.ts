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
const VERBATIM_SENTENCE =
  'Seni bize bağımlı yapmak için değil, seni sana geri vermek için buradayız.';

describe('Footer.astro — sabit manifesto imzası', () => {
  const source = readFileSync(FOOTER_PATH, 'utf-8');

  it('verbatim cümle hard-coded olarak mevcut (marka KARAR\'ı, değişmez)', () => {
    expect(source).toContain(VERBATIM_SENTENCE);
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

  it('orta basamak punto (clamp 1.2-1.45rem, ic-ses 1.25-1.5 altında ama fark edilir)', () => {
    const manifestoBlock = source.match(
      /\.footer__manifesto\s*\{[\s\S]*?\}/,
    )?.[0];
    // clamp(1.2rem, 2vw, 1.45rem) — alt sınır ic-ses (1.25) altında, üst sınır
    // ic-ses (1.5) altında. Hâlâ en sessiz basamak, sadece artık eyeball'da kayboluyor değil.
    expect(manifestoBlock).toMatch(
      /font-size:\s*clamp\(1\.2rem,\s*[^,]+,\s*1\.45rem\)/,
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
