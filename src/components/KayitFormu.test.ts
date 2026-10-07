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

/**
 * B211 İŞ 6 — success ekranındaki "Mail kutuna da düştü." cümlesi.
 *
 * Cümle iki aydır KOŞULSUZDU ve mail MailerLite otomasyonundan gidiyordu;
 * kod gidip gitmediğini bilmiyordu. Artık `/api/kayit` `postaGitti` döndürüyor
 * (o istekte Resend kabul etti mi) ve cümlenin ikinci yarısı yalnız o doğruysa
 * basılıyor. Kart seçende kayıt anında mail yok → yarım cümle.
 *
 * Aynı yanlış `/odeme/tamam`'da da vardı ve orada KALDIRILDI (`fc32dc7`);
 * burada kaldırmak yerine koşula bağlanıyor, çünkü ücretsiz kayıtta mail
 * gerçekten o anda gidiyor ve cümle doğru oluyor.
 */
describe('KayitFormu.astro — "Mail kutuna da düştü." koşula bağlı (B211 İŞ 6)', () => {
  const KAYNAK = readFileSync(SOURCE_PATH, 'utf-8');
  // Ölçütler yorumları ELEYEREK çalışır: yukarıdaki gerekçe bloğu yasaklanan
  // dizeyi alıntılıyor ve ham kaynakta ölçmek kendi anlatısına takılırdı.
  const KOD = KAYNAK
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1');

  it('cümle KOŞULSUZ basılmıyor — `postaGitti`ye bağlı', () => {
    // Regresyon kilidi: tek parça dize geri gelirse burası kırmızı yanar.
    expect(KOD).not.toMatch(/'Buluşma linkin burada\. Mail kutuna da düştü\.'/);
    expect(KOD).not.toMatch(/'Buluşacağımız yer burada\. Mail kutuna da düştü\.'/);
    expect(KOD).toMatch(/result\.postaGitti/);
  });

  it('iki yarı ayrı: yer cümlesi KOŞULSUZ, mail cümlesi KOŞULLU', () => {
    expect(KOD).toMatch(/'Buluşma linkin burada\.'/);
    expect(KOD).toMatch(/'Buluşacağımız yer burada\.'/);
    // Mail yarısı yalnız doğru dalda.
    const dogruDal = KOD.match(/result\.postaGitti\s*\n?\s*\?\s*`[^`]*`/)?.[0] ?? '';
    expect(dogruDal).toContain('Mail kutuna da düştü.');
  });

  it('METİN DEĞİŞMEDİ — yeni kamu metni yazılmadı', () => {
    // Brief §0: yalnız mevcut bir cümle koşula bağlanır ya da kaldırılır.
    const maili = KOD.match(/Mail kutuna da düştü\./g) ?? [];
    expect(maili).toHaveLength(1);
  });

  it('`mailerlite` alanına ARTIK bakılmıyor', () => {
    // Endpoint o alanı döndürmüyor; okumak sessizce `undefined` görmek olurdu.
    expect(KOD).not.toMatch(/result\.mailerlite/);
  });
});
