import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  kartAkisiAcikMi,
  KART_AKISI_ACIK,
  KART_ROUTELARI,
  mockSaglayiciMi,
  MOCK_SAGLAYICI_ACIK,
  MOCK_ROUTELARI,
} from './kart-akisi.ts';
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

  it('kapatılan BEŞ route eksiksiz', () => {
    // Bu liste iki tüketicinin ortak kaynağı: `oda-map` eleme + sitemap filtresi.
    // Biri eklenip öteki unutulursa kapalı akışın sayfası Google'a düşer.
    //
    // 7 Eki 2026 — `/odeme/devam` katıldı (B211 İŞ 5). Sayı kilidi bilinçli:
    // yeni bir `/odeme/*` sayfası eklenip buraya katılmazsa burası kırmızı
    // yanar. Sayfanın kendi `KART_AKISI_ACIK` kapısı 404 veriyor olsa da
    // `ODA_MAP`'te kalması onu kapalı akışta çözülebilir kılardı.
    expect([...KART_ROUTELARI].sort()).toEqual([
      '/odeme/devam',
      '/odeme/iptal',
      '/odeme/mock',
      '/odeme/nkolay',
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

  it('dört ödeme route\'u eşlemeden DÜŞER', () => {
    for (const r of KART_ROUTELARI) {
      expect(ODA_MAP).not.toHaveProperty(r);
    }
  });

  it('kontrol grubu — yasal sayfalar eşlemede DURUYOR (kart akışı kapalı)', () => {
    // Eleme yalnız dört route'u almalı; geniş bir filtre yazılırsa burası kırılır.
    expect(ODA_MAP['/gizlilik']).toBe('OCAK');
    expect(ODA_MAP['/mesafeli-satis']).toBe('OCAK');
    expect(ODA_MAP['/teslimat-iade']).toBe('OCAK');
    expect(ODA_MAP['/hakkimizda']).toBe('OCAK');
  });
});

// ── B193 (7 Eki) — `PAYMENT_PROVIDER` ikinci anahtar ───────────────────────
//
// Kapatılan açık: `/odeme/mock` yalnız `KART_AKISI` ile korunuyordu, yani
// production'ın gerçek hâlinde (`KART_AKISI=acik` + `PAYMENT_PROVIDER=nkolay`)
// sahte "ödendi" üreten bir ekran açıktı. Artık ikinci kapı var.
describe('mockSaglayiciMi (B193)', () => {
  it('"mock" açar, büyük/küçük harf ve boşluk toleranslı', () => {
    expect(mockSaglayiciMi('mock')).toBe(true);
    expect(mockSaglayiciMi('MOCK')).toBe(true);
    expect(mockSaglayiciMi('  Mock  ')).toBe(true);
    expect(mockSaglayiciMi('\tmock\n')).toBe(true);
  });

  it('"nkolay" KAPATIR — production\'ın yürürlükteki değeri', () => {
    expect(mockSaglayiciMi('nkolay')).toBe(false);
    expect(mockSaglayiciMi('NKOLAY')).toBe(false);
  });

  it('⚠ VARSAYILAN MOCK — `kartAkisiAcikMi`nin TERSİ, bilinçli', () => {
    // Bu satır bir tutarsızlık GİBİ görünür ve değildir: gerekçe
    // `kart-akisi.ts`'te adıyla yazılı — **yönlendirme açıkken kapı kapalı
    // olamaz.** `getPaymentProvider()` tanımsız env'de `mockPaymentProvider`
    // döndürüp kadını `/odeme/mock`'a yönlendiriyor; kapıyı fail-closed
    // yapmak kayıt akışını sessizce kırardı (yönlendir → 404).
    //
    // Biri bir gün "fail-closed olsun" diye bunu çevirmek isterse: aynı turda
    // `getPaymentProvider()`ın varsayılanı da çevrilmek zorunda. Bu test o
    // eşleşmenin kilidi, iki tarafı birlikte düşünmeye zorlar.
    expect(mockSaglayiciMi(undefined)).toBe(true);
    expect(mockSaglayiciMi(null)).toBe(true);
  });

  it('⚠ BOŞ DİZE mock SAYILMAZ — `??` boş dizeyi yakalamaz', () => {
    // İlk yazımda bu beklenti `true` yazılmış ve KIRILMIŞTI. Ölçüm düzeltti:
    // `'' ?? 'mock'` → `''`. Kaza değil, factory'nin ÖNCEKİ davranışının
    // aynısı — eski kod da `''` için mock dalına değil `throw`a gidiyordu.
    // Yani boş anahtarda iki taraf da kapalı yanda: kapı 404, factory 500.
    // "Yönlendirme açıkken kapı kapalı olamaz" değişmezi korunuyor, çünkü
    // boş anahtarda yönlendirme de olmuyor.
    expect(mockSaglayiciMi('')).toBe(false);
    expect(mockSaglayiciMi('   ')).toBe(false);
    expect(mockSaglayiciMi('\t\n')).toBe(false);
  });

  it('tanınmayan değer mock SAYILMAZ — sayfa kapanır', () => {
    // Bu değerlerde `getPaymentProvider()` throw ediyor. İki davranış da
    // "kapalı" tarafta: kapı 404, factory 500. Yarı-açık bir hâl yok.
    expect(mockSaglayiciMi('iyzico')).toBe(false);
    expect(mockSaglayiciMi('mockk')).toBe(false);
    expect(mockSaglayiciMi('none')).toBe(false);
    expect(mockSaglayiciMi('true')).toBe(false);
  });
});

describe('MOCK_ROUTELARI × ODA_MAP (B193, tüketici 5)', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  /**
   * ⚠ `import.meta.env` BUILD ZAMANINDA sabitlenir — modül bir kez
   * yüklendikten sonra `vi.stubEnv` onu değiştirmez. Bu yüzden her bileşim
   * `resetModules` + TAZE import ile ölçülüyor (`payment-provider.test.ts`
   * `modulYukle` deseni). Sahteler import'tan ÖNCE kurulmalı.
   */
  async function odaMapYukle(
    kartAkisi: string | undefined,
    saglayici: string | undefined,
  ) {
    vi.resetModules();
    vi.stubEnv('KART_AKISI', kartAkisi as any);
    vi.stubEnv('PAYMENT_PROVIDER', saglayici as any);
    const { ODA_MAP: M } = await import('./oda-map.ts');
    return M;
  }

  it('vitest ortamında PAYMENT_PROVIDER tanımsız → mock AÇIK', () => {
    // Ölçüldü (7 Eki, probe): `vitest.config.ts` sade `vitest/config` kullanıyor,
    // Astro'nun envPrefix'i yok — `.env`'deki `PAYMENT_PROVIDER=mock` test
    // bağlamına GİRMİYOR, değer `undefined`. Varsayılan onu mock sayıyor.
    // Bu satır aşağıdaki modül-içi beklentilerin ön şartı; anahtar bir gün
    // test ortamına girerse önce burası kırılır ve yanlış yeşil vermez.
    expect(MOCK_SAGLAYICI_ACIK).toBe(true);
  });

  it('MOCK_ROUTELARI tek üyeli — tamam/iptal sağlayıcı-ORTAK', () => {
    // `/odeme/{tamam,iptal}` buraya girerse N-Kolay'ın dönüş ekranları 404
    // olur ve gerçek ödeme yapan kadın boş sayfaya iner. Bu sayı kilidi
    // o sızmanın tek kapısı.
    expect([...MOCK_ROUTELARI]).toEqual(['/odeme/mock']);
  });

  it('PRODUCTION BİLEŞİMİ — acik + nkolay → yalnız /odeme/mock düşer', async () => {
    // B193'ün kapattığı tam hâl. Üç kardeş route AÇIK kalmalı: N-Kolay
    // checkout'u ve iki dönüş ekranı gerçek tahsilatın yolu.
    const M = await odaMapYukle('acik', 'nkolay');
    expect(M).not.toHaveProperty('/odeme/mock');
    expect(M['/odeme/nkolay']).toBe('OCAK');
    expect(M['/odeme/tamam']).toBe('OCAK');
    expect(M['/odeme/iptal']).toBe('OCAK');
    // Kontrol grubu — eleme geniş yazılırsa burası kırılır.
    expect(M['/gizlilik']).toBe('OCAK');
    expect(M['/takvim']).toBe('Buluşmalar');
  });

  it('acik + mock → dört route da eşlemede DURUR', async () => {
    const M = await odaMapYukle('acik', 'mock');
    for (const r of KART_ROUTELARI) expect(M[r]).toBe('OCAK');
  });

  it('acik + anahtar tanımsız → mock DURUR (varsayılan mock)', async () => {
    // `mockSaglayiciMi`nin varsayılanıyla aynı cümle, modül düzeyinde.
    const M = await odaMapYukle('acik', undefined);
    expect(M['/odeme/mock']).toBe('OCAK');
  });

  it('kapali + mock → KART_AKISI dördünü birden eler, sağlayıcıya bakmaz', async () => {
    // İki anahtar birbirini KAPSAMAZ: kart akışı kapalıyken mock sağlayıcı
    // seçili olsa bile dördü düşer (KARAR 488 önce gelir).
    const M = await odaMapYukle('kapali', 'mock');
    for (const r of KART_ROUTELARI) expect(M).not.toHaveProperty(r);
  });
});
