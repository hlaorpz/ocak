import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * KayitFormu — KVKK + Mesafeli Satış onayı validasyon state disiplini
 * (KARAR 254 aday, Aşama 5 düzeltme).
 *
 * Tekrar eden tuzak (Pilot devri #41): KVKK checkbox işaretsiz submit →
 * `oninvalid` `setCustomValidity('KVKK onayı gerekiyor')` set ediyor;
 * kullanıcı checkbox'ı işaretliyor → `onchange` customValidity'yi
 * temizlemiyor → tekrar submit'te browser bubble TEKRAR çıkıyor, kayıt
 * geçemiyor.
 *
 * KÖK NEDEN: `Array.from(this.form.elements[this.name]).forEach(...)`
 * pattern'i radio GROUP için yazılmış (`form.elements[radioName]`
 * RadioNodeList döner — iterable). Tekli checkbox için
 * `form.elements.kvkk` doğrudan HTMLInputElement döner — iterable DEĞİL,
 * `length` property'si YOK → `Array.from(...)` boş `[]` döner → forEach
 * skip → `setCustomValidity('')` HİÇ çağrılmaz → customError stale.
 *
 * DOĞRU PATTERN (tekli checkbox): `onchange="this.setCustomValidity('')"`.
 * Source-level grep ile bug pattern'inin geri sızmasını koruyoruz.
 */

const SOURCE_PATH = join(__dirname, 'KayitFormu.astro');

describe('KayitFormu.astro — KVKK/Mesafeli onay validasyon state (KARAR 254 aday)', () => {
  const source = readFileSync(SOURCE_PATH, 'utf-8');

  it('KVKK checkbox onchange direkt setCustomValidity temizler (tekli checkbox doğru pattern)', () => {
    // <input ... name="kvkk" ... onchange="this.setCustomValidity('')">
    const kvkkInputMatch = source.match(
      /<input[^>]*\bname=["']kvkk["'][^>]*>/,
    );
    expect(kvkkInputMatch).toBeTruthy();
    const kvkkInput = kvkkInputMatch![0];
    expect(kvkkInput).toMatch(/onchange=["']this\.setCustomValidity\(''\)["']/);
  });

  it('KVKK checkbox `Array.from(this.form.elements[this.name])` bug pattern YOK', () => {
    // Tekli checkbox için boş array döner → forEach skip → customError stale.
    // Kademe radio'da (RadioNodeList iterable) çalışır; KVKK'da çalışmaz.
    const kvkkInputMatch = source.match(
      /<input[^>]*\bname=["']kvkk["'][^>]*>/,
    );
    expect(kvkkInputMatch).toBeTruthy();
    expect(kvkkInputMatch![0]).not.toContain('Array.from(this.form.elements');
  });

  it('KVKK checkbox oninvalid metni TR ("KVKK onayı gerekiyor")', () => {
    const kvkkInputMatch = source.match(
      /<input[^>]*\bname=["']kvkk["'][^>]*>/,
    );
    expect(kvkkInputMatch).toBeTruthy();
    expect(kvkkInputMatch![0]).toContain(
      "setCustomValidity('KVKK onayı gerekiyor')",
    );
  });

  it('Mesafeli checkbox onchange direkt setCustomValidity temizler', () => {
    const mesafeliInputMatch = source.match(
      /<input[^>]*\bname=["']mesafeli_onay["'][^>]*>/,
    );
    expect(mesafeliInputMatch).toBeTruthy();
    expect(mesafeliInputMatch![0]).toMatch(
      /onchange=["']this\.setCustomValidity\(''\)["']/,
    );
  });

  it('Mesafeli checkbox bug pattern YOK', () => {
    const mesafeliInputMatch = source.match(
      /<input[^>]*\bname=["']mesafeli_onay["'][^>]*>/,
    );
    expect(mesafeliInputMatch).toBeTruthy();
    expect(mesafeliInputMatch![0]).not.toContain(
      'Array.from(this.form.elements',
    );
  });

  it('Mesafeli checkbox oninvalid TR metni ("Devam etmek için onaylamanız gerekiyor")', () => {
    const mesafeliInputMatch = source.match(
      /<input[^>]*\bname=["']mesafeli_onay["'][^>]*>/,
    );
    expect(mesafeliInputMatch).toBeTruthy();
    expect(mesafeliInputMatch![0]).toContain(
      "setCustomValidity('Devam etmek için onaylamanız gerekiyor')",
    );
  });
});
