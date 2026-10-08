import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { gecisKalanMs, GECIS_EN_AZ_MS } from './gecis.ts';

/**
 * İŞ 17 — kart geçişi okunur olsun.
 *
 * Eşik bir TABAN, gecikme değil: yönlendirme `max(API, 1500 ms)` anında olur.
 *
 * Dosya `src/lib/` altında (KARAR 574).
 */

describe('gecisKalanMs — hızlı yanıtta taban, yavaşta ek gecikme yok', () => {
  it('eşik 1500 ms', () => {
    expect(GECIS_EN_AZ_MS).toBe(1500);
  });

  it('HIZLI yanıt (120 ms) → 1380 ms beklenir, yönlendirme 1500\'den ÖNCE olmaz', () => {
    // Geçiş bir kare görünüp kaybolmuyor artık.
    expect(gecisKalanMs(120)).toBe(1380);
    // Toplam = geçen + kalan = eşik.
    expect(120 + gecisKalanMs(120)).toBe(GECIS_EN_AZ_MS);
  });

  it('⚠ YAVAŞ yanıt (4200 ms) → 0; EK GECİKME YOK', () => {
    // Yavaş ağ cezalandırılmıyor.
    expect(gecisKalanMs(4200)).toBe(0);
  });

  it('TAM eşikte (1500 ms) → 0, ek bekleme yok', () => {
    expect(gecisKalanMs(1500)).toBe(0);
    expect(gecisKalanMs(1501)).toBe(0);
  });

  it('eşiğin bir milisaniye altında → 1 ms', () => {
    expect(gecisKalanMs(1499)).toBe(1);
  });

  it('sıfır geçen süre → tam eşik', () => {
    expect(gecisKalanMs(0)).toBe(GECIS_EN_AZ_MS);
  });

  it('bozuk girdi → 0; bekleme UYDURULMAZ', () => {
    expect(gecisKalanMs(Number.NaN)).toBe(0);
    expect(gecisKalanMs(-50)).toBe(0);
    expect(gecisKalanMs(Number.POSITIVE_INFINITY)).toBe(0);
  });

  it('eşik dışarıdan verilebilir — fonksiyon sabite kilitli değil', () => {
    expect(gecisKalanMs(100, 500)).toBe(400);
    expect(gecisKalanMs(900, 500)).toBe(0);
  });
});

describe('KayitFormu — yönlendirme hesabı lib\'den, kart yoluna bağlı', () => {
  const KOD = readFileSync(join(__dirname, '..', 'components', 'KayitFormu.astro'), 'utf-8')
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1');

  it('hesap lib\'den geliyor — bileşende ikinci bir aritmetik yok', () => {
    expect(KOD).toMatch(/import \{ gecisKalanMs, GECIS_EN_AZ_MS \} from '\.\.\/lib\/gecis';/);
    expect(KOD).toMatch(/const kalan = gecisKalanMs\(gecen\);/);
    // Eski satır içi `Math.max(0, 1500 - …)` kalmadı.
    expect(KOD).not.toMatch(/Math\.max\(0, GECIS_EN_AZ_MS/);
    expect(KOD).not.toMatch(/1500/);
  });

  it('geçiş başlangıcı YALNIZ kart yolunda damgalanıyor', () => {
    expect(KOD).toMatch(/let gecisBaslangici = 0;/);
    expect(KOD).toMatch(/gecisBaslangici = Date\.now\(\);/);
    // Damga `if (kartYolu)` bloğunun içinde.
    const blok = KOD.match(/if \(kartYolu\) \{[\s\S]*?\n      \}/)?.[0] ?? '';
    expect(blok).toMatch(/gecisBaslangici = Date\.now\(\);/);
  });

  it('kalan 0 ise ANINDA gidiliyor — gereksiz timer kurulmuyor', () => {
    expect(KOD).toMatch(/if \(kalan > 0\) window\.setTimeout\(git, kalan\);\s*\n?\s*else git\(\);/);
  });

  it('⚠ bekleme YALNIZ checkout yönlendirmesinde — başarı ekranı gecikmez', () => {
    // Havale/ücretsiz yolda bekleme yok: o ekranlar anında açılıyor.
    //
    // ⚠ Ölçüt `window.setTimeout`u sayıyor, ham `setTimeout`u DEĞİL: dosyada
    // promo doğrulamasının debounce timer'ı (`promoTimer = setTimeout(...)`)
    // zaten vardı ve o ayrı bir işe ait. İlk yazımda hepsini saydım ve doğru
    // kodu kırmızı yaktım — bu turda yedinci kez aynı ders (CLAUDE.md §3).
    const timerlar = KOD.match(/window\.setTimeout\(/g) ?? [];
    expect(timerlar).toHaveLength(1);
    expect(KOD).toMatch(/window\.setTimeout\(git, kalan\)/);
    // Başarı ekranını açan dalda bekleme yok.
    expect(KOD).toMatch(/form\.hidden = true;/);
    const basariDali = KOD.slice(KOD.indexOf('const isBasvuru ='));
    expect(basariDali).not.toMatch(/window\.setTimeout\(/);
  });
});
