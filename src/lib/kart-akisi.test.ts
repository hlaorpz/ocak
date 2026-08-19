import { describe, it, expect } from 'vitest';
import { kartAkisiAcikMi, KART_AKISI_ACIK, KART_ROUTELARI } from './kart-akisi.ts';
import { ODA_MAP } from './oda-map.ts';

// KARAR 488 — kart akışı anahtarı. `kartAkisiAcikMi` iki bağlamdan okunuyor
// (`src/` → import.meta.env · `astro.config.mjs` → Vite loadEnv), kural tek
// yerde yaşasın diye saf fonksiyon. Test o kuralı çiviler.
describe('kartAkisiAcikMi (KARAR 488)', () => {
  it('yalnız "acik" açar', () => {
    expect(kartAkisiAcikMi('acik')).toBe(true);
  });

  it('brief\'in yazdığı "kapali" değeri kapatır', () => {
    expect(kartAkisiAcikMi('kapali')).toBe(false);
  });

  it('FAIL-CLOSED — tanımsız/boş/whitespace kapalıdır', () => {
    // Bir ortamda anahtarı koymayı unutmak, sağlayıcı anlaşması olmayan bir
    // kart akışını sessizce geri AÇMAMALI. Ödeme yüzeyi fail-open olamaz.
    expect(kartAkisiAcikMi(undefined)).toBe(false);
    expect(kartAkisiAcikMi(null)).toBe(false);
    expect(kartAkisiAcikMi('')).toBe(false);
    expect(kartAkisiAcikMi('   ')).toBe(false);
  });

  it('FAIL-CLOSED — tanınmayan değer ve yazım hatası kapalıdır', () => {
    expect(kartAkisiAcikMi('açık')).toBe(false); // Türkçe karakterli — tanınmaz
    expect(kartAkisiAcikMi('open')).toBe(false);
    expect(kartAkisiAcikMi('true')).toBe(false);
    expect(kartAkisiAcikMi('1')).toBe(false);
    expect(kartAkisiAcikMi('acikk')).toBe(false);
  });

  it('büyük/küçük harf ve kenar boşluğu toleranslı', () => {
    expect(kartAkisiAcikMi('ACIK')).toBe(true);
    expect(kartAkisiAcikMi('  Acik  ')).toBe(true);
    expect(kartAkisiAcikMi('\tacik\n')).toBe(true);
  });

  it('kapatılan üç route eksiksiz', () => {
    // Bu liste iki tüketicinin ortak kaynağı: `oda-map` eleme + sitemap filtresi.
    // Biri eklenip öteki unutulursa kapalı akışın sayfası Google'a düşer.
    expect([...KART_ROUTELARI].sort()).toEqual([
      '/odeme/iptal',
      '/odeme/mock',
      '/odeme/tamam',
    ]);
  });
});

// `ODA_MAP` elemesi build zamanında tükeniyor — `getOda()` yalnız
// `notion-pages.ts`ten, yalnız Notion kaynaklı slug'lar için çağrılıyor ve
// map server bundle'a hiç düşmüyor. Yani dist/ grep'i bu tüketici için kanıt
// üretmiyor; ölçüm burada, koşulabilir hâlde duruyor.
describe('ODA_MAP × KART_AKISI (KARAR 488, tüketici 5)', () => {
  it('vitest ortamında anahtar tanımsız → akış kapalı', () => {
    // Aşağıdaki iki beklentinin ön şartı. Anahtar bir gün test ortamına
    // girerse bu satır önce kırılır ve yanlış yeşil vermez.
    expect(KART_AKISI_ACIK).toBe(false);
  });

  it('üç ödeme route\'u eşlemeden DÜŞER', () => {
    for (const r of KART_ROUTELARI) {
      expect(ODA_MAP).not.toHaveProperty(r);
    }
  });

  it('kontrol grubu — yasal sayfalar eşlemede DURUYOR', () => {
    // Eleme yalnız üç route'u almalı; geniş bir filtre yazılırsa burası kırılır.
    expect(ODA_MAP['/gizlilik']).toBe('OCAK');
    expect(ODA_MAP['/mesafeli-satis']).toBe('OCAK');
    expect(ODA_MAP['/teslimat-iade']).toBe('OCAK');
    expect(ODA_MAP['/hakkimizda']).toBe('OCAK');
  });
});
