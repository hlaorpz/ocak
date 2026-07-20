import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * KayitBtn source disiplini (brief-kayit-buton-FINAL Faz 1).
 * Metin sözlüğü SABİT — brief kararı; değişmez.
 * Görsel gramer (.ocak-kayit-cta__buton) sonraki-bulusma + mini-cta
 * emit'iyle tek noktada birleştirilir; class silinirse global CSS
 * (atmosfer.css:1752) hedefsiz kalır.
 */

const PATH = join(__dirname, 'KayitBtn.astro');
const source = readFileSync(PATH, 'utf-8');

describe('KayitBtn.astro — metin sözlüğü + görsel gramer', () => {
  it('Başvuru → "Başvur" metni source\'da mevcut', () => {
    expect(source).toContain("kayitTipi === 'Başvuru' ? 'Başvur' : 'Yerini ayır'");
  });

  it('nötr fallback "Yerini ayır" source\'da mevcut', () => {
    expect(source).toMatch(/let metin = 'Yerini ayır'/);
  });

  it('görsel gramer class .ocak-kayit-cta__buton kullanılır', () => {
    expect(source).toContain('class="ocak-kayit-cta__buton"');
  });

  it('section wrapper data-section="kayit-btn" (Faz 4 rebrand — kayit-cta emekli)', () => {
    expect(source).toContain('data-section="kayit-btn"');
    // Faz 4: eski attr sıfır — dist grep testinin karşılığı source seviyesinde.
    expect(source).not.toContain('data-section="kayit-cta"');
  });

  it('slug-otomatik hedef: FORMAT_KATEGORI[tip] + /[slug]/kayit', () => {
    expect(source).toContain('FORMAT_KATEGORI[etkinlik.tip]');
    expect(source).toContain('`/${slug}/kayit`');
  });

  it('digerTarihler opt-in: /takvim#[slug] linki', () => {
    expect(source).toContain('`/takvim#${slug}`');
    expect(source).toContain('Diğer tarihler');
  });
});
