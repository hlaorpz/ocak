import { describe, it, expect } from 'vitest';
import { sehirYaz } from './sehir';

/**
 * B118 İŞ C — şehir yazımı. Brief §9.7'nin ölçütü: `izmir` → `İzmir`,
 * `tr` yereliyle.
 *
 * ⚠ Türkçe büyük/küçük harf dönüşümü yerel-duyarlı: varsayılan yerelde
 * `'izmir'.toUpperCase()` → `IZMIR` (noktasız I) ve bu YANLIŞ. Aşağıdaki
 * testler yerelin gerçekten `tr` olduğunu da ölçüyor — `vitest.config.ts`
 * yalnız `TZ`yi sabitliyor, `LANG`ı değil, yani kural açıkça `'tr'`
 * geçirmeye bağlı.
 */

describe('sehirYaz — brief ölçütü', () => {
  it('`izmir` → `İzmir` (noktalı İ — varsayılan yerel yanlış yapardı)', () => {
    expect(sehirYaz('izmir')).toBe('İzmir');
  });

  it('`İSTANBUL` → `İstanbul`', () => {
    expect(sehirYaz('İSTANBUL')).toBe('İstanbul');
  });

  it('`tr` yereli gerçekten uygulanıyor — kontrol karşılaştırması', () => {
    // Varsayılan yerel `i` → `I` verir; kural `İ` vermek zorunda.
    expect('izmir'.slice(0, 1).toUpperCase()).toBe('I');
    expect(sehirYaz('izmir').slice(0, 1)).toBe('İ');
    // Ters yön: varsayılan `I` → `i`, `tr` ise `ı`.
    expect(sehirYaz('ISPARTA')).toBe('Isparta');
    expect(sehirYaz('ısparta')).toBe('Isparta');
  });
});

describe('sehirYaz — boşluk hijyeni', () => {
  it('baş-son boşluk kırpılır', () => {
    expect(sehirYaz('  ankara  ')).toBe('Ankara');
  });

  it('iç boşluk dizileri TEK boşluğa iner', () => {
    expect(sehirYaz('afyon    karahisar')).toBe('Afyon Karahisar');
    expect(sehirYaz('a\t\tb')).toBe('A B');
  });

  it('her kelimenin ilk harfi büyür', () => {
    expect(sehirYaz('kahramanmaraş')).toBe('Kahramanmaraş');
    expect(sehirYaz('afyonkarahisar merkez')).toBe('Afyonkarahisar Merkez');
  });
});

describe('sehirYaz — ayıraçlar KORUNUR', () => {
  it('tire kelime ayıracı ve kendisi kalır', () => {
    expect(sehirYaz('izmir-bornova')).toBe('İzmir-Bornova');
  });

  it('eğik çizgi de ayıraç', () => {
    expect(sehirYaz('kahramanmaraş/elbistan')).toBe('Kahramanmaraş/Elbistan');
  });

  it('ayıraç çevresindeki boşluklar atılır, işaret kalır', () => {
    expect(sehirYaz('izmir - bornova')).toBe('İzmir-Bornova');
  });
});

describe('sehirYaz — boş ve bozuk girdi', () => {
  it('boş / yalnız boşluk → boş dize (çağıran property yazmıyor)', () => {
    expect(sehirYaz('')).toBe('');
    expect(sehirYaz('   ')).toBe('');
  });

  it('tanımsız / null / dize-olmayan → boş dize', () => {
    expect(sehirYaz(null)).toBe('');
    expect(sehirYaz(undefined)).toBe('');
    expect(sehirYaz(42 as unknown as string)).toBe('');
  });

  it('zaten doğru yazılmış değer DEĞİŞMEZ (idempotent)', () => {
    for (const sehir of ['İzmir', 'İstanbul', 'Ankara', 'Kahramanmaraş/Elbistan']) {
      expect(sehirYaz(sehir)).toBe(sehir);
      expect(sehirYaz(sehirYaz(sehir))).toBe(sehir);
    }
  });

  it('Türkçe harfler korunur — ğ ü ş ö ç ı', () => {
    expect(sehirYaz('muğla')).toBe('Muğla');
    expect(sehirYaz('ŞANLIURFA')).toBe('Şanlıurfa');
    expect(sehirYaz('çorum')).toBe('Çorum');
    expect(sehirYaz('ÜSKÜDAR')).toBe('Üsküdar');
  });
});
