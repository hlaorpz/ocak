import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * `dogrulaCallback` — İŞ 2, callback kimlik doğrulaması.
 *
 * Düzeltilen açık: `/api/odeme-callback` kimlik doğrulamasızdı. Gövdeyi kim
 * gönderirse göndersin kabul ediliyordu; adresi ve bir Notion sayfa UUID'sini
 * bilen herkes bir kaydı Ödendi'ye çekebilirdi. Yan etki daha genişti —
 * `kodKullanimArtir` da o route'tan çağrılıyor, yani doğrulamasız bir istek
 * promo sayacını da şişirebiliyordu.
 *
 * ⚠ `import.meta.env` Vite tarafından BUILD ZAMANINDA sabitlenir; testte
 * `vi.stubEnv` ile değiştirilemez. Bu yüzden modül her senaryoda
 * `vi.resetModules()` + `vi.doMock` ile TAZE import ediliyor —
 * `import.meta.env` sahtesi import'tan ÖNCE kurulmalı.
 */

const SIR = 'r7Qx2vLm9pKd4TzB8nYwSc3JhF6aUeG1';

/** `ODEME_CALLBACK_SIR` verilmiş taze modül. `undefined` → anahtar hiç yok. */
async function modulYukle(sirDegeri: string | undefined) {
  vi.resetModules();
  vi.stubEnv('ODEME_CALLBACK_SIR', sirDegeri as any);
  return import('./payment-provider.ts');
}

/** Mock akışı form GET kullanıyor — sır query'de gelir. */
function istek(sir?: string): Request {
  const u = new URL('https://www.ocak.biz/api/odeme-callback');
  u.searchParams.set('ref', 'OCAK-7K2M');
  u.searchParams.set('sonuc', 'basari');
  if (sir !== undefined) u.searchParams.set('sir', sir);
  return new Request(u.toString());
}

/** POST webhook yolu — sır ayrıştırılmış gövdede gelir. */
function govdeIle(sir?: string): URLSearchParams {
  const p = new URLSearchParams({ ref: 'OCAK-7K2M', sonuc: 'basari' });
  if (sir !== undefined) p.set('sir', sir);
  return p;
}

describe('mockPaymentProvider.dogrulaCallback — dört senaryo (İŞ 2)', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
    vi.resetModules();
  });

  it('1 · geçerli sır → gecerli:true', async () => {
    const { mockPaymentProvider } = await modulYukle(SIR);
    const s = mockPaymentProvider.dogrulaCallback(istek(SIR), null);
    expect(s.gecerli).toBe(true);
    expect(s.sebep).toBeUndefined();
  });

  it('1b · geçerli sır GÖVDEDE (POST webhook yolu) → gecerli:true', async () => {
    const { mockPaymentProvider } = await modulYukle(SIR);
    // İstek URL'inde sır YOK; yalnız gövdede. İki taşıma yolu da desteklenmeli.
    const s = mockPaymentProvider.dogrulaCallback(istek(), govdeIle(SIR));
    expect(s.gecerli).toBe(true);
  });

  it('2 · yanlış sır → gecerli:false', async () => {
    const { mockPaymentProvider } = await modulYukle(SIR);
    const s = mockPaymentProvider.dogrulaCallback(istek('yanlis-sir-ama-ayni-uzunlukta'), null);
    expect(s.gecerli).toBe(false);
    expect(s.sebep).toBe('sir-yanlis');
  });

  it('2b · doğru sırrın ÖNEKİ kabul edilmez (kısmi eşleşme yok)', async () => {
    const { mockPaymentProvider } = await modulYukle(SIR);
    const s = mockPaymentProvider.dogrulaCallback(istek(SIR.slice(0, 20)), null);
    expect(s.gecerli).toBe(false);
  });

  it('3 · istekte sır yok → gecerli:false', async () => {
    const { mockPaymentProvider } = await modulYukle(SIR);
    const s = mockPaymentProvider.dogrulaCallback(istek(), null);
    expect(s.gecerli).toBe(false);
    expect(s.sebep).toBe('sir-istekte-yok');
  });

  it('3b · sır BOŞ DİZE olarak gönderildi → gecerli:false ("boş == boş" geçmez)', async () => {
    const { mockPaymentProvider } = await modulYukle(SIR);
    const s = mockPaymentProvider.dogrulaCallback(istek(''), null);
    expect(s.gecerli).toBe(false);
  });

  it('4 · sır env\'de TANIMSIZ → gecerli:false (FAIL-CLOSED)', async () => {
    const { mockPaymentProvider } = await modulYukle(undefined);
    // Kritik hâl: anahtar konmayı unutulmuş. Doğru davranış doğrulamayı
    // ATLAMAK değil, REDDETMEK. Ödeme yüzeyi fail-open olamaz.
    const s = mockPaymentProvider.dogrulaCallback(istek(SIR), null);
    expect(s.gecerli).toBe(false);
    expect(s.sebep).toBe('sir-env-tanimsiz');
  });

  it('4b · sır env\'de tanımsızken istekte de sır yoksa → yine false', async () => {
    const { mockPaymentProvider } = await modulYukle(undefined);
    const s = mockPaymentProvider.dogrulaCallback(istek(), null);
    expect(s.gecerli).toBe(false);
  });

  it('4c · sır env\'de yalnız boşluk → tanımsız sayılır, false', async () => {
    const { mockPaymentProvider } = await modulYukle('   ');
    const s = mockPaymentProvider.dogrulaCallback(istek('   '), null);
    expect(s.gecerli).toBe(false);
    expect(s.sebep).toBe('sir-env-tanimsiz');
  });
});

describe('PaymentProvider arayüzü — KARAR 395 disiplini', () => {
  const ROUTE = readFileSync(
    join(__dirname, '..', 'pages', 'api', 'odeme-callback.ts'),
    'utf-8',
  );
  const MOCK_SAYFA = readFileSync(
    join(__dirname, '..', 'pages', 'odeme', 'mock.astro'),
    'utf-8',
  );

  /**
   * ⚠ Yorumlar ELENİR (CLAUDE.md §3). İlk yazımda bu testler kendi
   * yorumlarına takıldı: route'un KARAR 395 notu açıklama amacıyla
   * `if (provider === 'nkolay')` dizesini TAŞIYOR — yasaklanan desen
   * anlatının içinde geçiyordu. Kriter kodu ölçmeli, prozayı değil.
   */
  function kodu(kaynak: string): string {
    return kaynak
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/(^|[^:])\/\/.*$/gm, '$1');
  }

  /**
   * ⚠ Dosya konumu çağrı SIRASI değildir. İlk yazımda `kodKullanimArtir`ın
   * dosyadaki indeksi doğrulamadan küçüktü ve test düştü — çünkü çağrı
   * `odemeyiOnayla()` içinde ve o fonksiyon dosyada `handle()`'dan ÖNCE
   * TANIMLANIYOR. Sıra ölçümü tek bir fonksiyonun gövdesinde yapılır.
   */
  function handleGovdesi(): string {
    const k = kodu(ROUTE);
    const bas = k.indexOf('async function handle(');
    expect(bas).toBeGreaterThan(-1);
    return k.slice(bas);
  }

  it('route sağlayıcı ADINA göre dallanmaz — doğrulama arayüzden sorulur', async () => {
    // KARAR 395: iki kod yolunu elle eşit tutmak sonsuz döngü. Route
    // "hangi sağlayıcı" diye sormaz, "geçerli mi" diye sorar.
    const K = kodu(ROUTE);
    expect(K).toMatch(/getPaymentProvider\(\)\.dogrulaCallback\(/);
    expect(K).not.toMatch(/provider\s*===\s*['"]/);
    expect(K).not.toMatch(/PAYMENT_PROVIDER\s*===/);
    for (const ad of ['nkolay', 'iyzico', 'paytr']) {
      expect(K.toLowerCase()).not.toMatch(
        new RegExp(`===\\s*['"\`]${ad}['"\`]`),
      );
    }
  });

  it('doğrulama Notion çağrılarından ÖNCE gelir (handle() gövdesinde)', async () => {
    // Sıra kritik: 401 dönen bir istek Kayıtlar'a dokunmamalı ve
    // `kodKullanimArtir` sayacını artırmamalı.
    const H = handleGovdesi();
    const dogrulamaIdx = H.indexOf('dogrulaCallback(');
    const dortYuzBirIdx = H.indexOf('status: 401');
    const onaylaIdx = H.indexOf('await odemeyiOnayla(');
    expect(dogrulamaIdx).toBeGreaterThan(-1);
    expect(dortYuzBirIdx).toBeGreaterThan(dogrulamaIdx);
    expect(onaylaIdx).toBeGreaterThan(dortYuzBirIdx);
    // ⚠ Sıra ölçümü tek başına YETMEZ. KARAR 567 turunda muhafız
    // `if (false && !dogrulama.gecerli)` yapılarak devre dışı bırakıldı ve
    // yukarıdaki üç iddia YİNE YEŞİL YANDI — `status: 401` ölü blokta da
    // duruyordu. Koşulun kendisi ölçülmeli, varlığı değil.
    expect(H).toMatch(/if \(!dogrulama\.gecerli\) \{/);
    expect(H).not.toMatch(/if \([^)]*&&\s*!dogrulama\.gecerli\)/);
    // `kodKullanimArtir` handle() içinde HİÇ çağrılmıyor — yalnız
    // `odemeyiOnayla()` içinden, o da doğrulamadan sonra çağrılıyor.
    expect(H).not.toMatch(/kodKullanimArtir\(/);
    expect(kodu(ROUTE)).toMatch(/kodKullanimArtir\(notion/);
  });

  it('401 gövdesi `sebep` sızdırmaz', async () => {
    // `sebep` yalnız log'a gider; 401 gövdesine yazmak deneyen birine
    // hangi yönde ilerleyeceğini söylemek olurdu.
    const yanit = ROUTE.match(/new Response\([^)]*status: 401[^)]*\)/s);
    expect(yanit).toBeTruthy();
    expect(yanit![0]).not.toMatch(/sebep/);
  });

  it('mock sayfası sırrı tek kaynaktan okur ve boşken alanı hiç koymaz', async () => {
    expect(MOCK_SAYFA).toMatch(/import \{ callbackSirri, CALLBACK_SIR_ALANI \}/);
    // Sayfa kendi env okumasını yapmamalı — tek okuyucu payment-provider.
    expect(MOCK_SAYFA).not.toMatch(/import\.meta\.env\.ODEME_CALLBACK_SIR/);
    // `{sir && <input …>}` — boş sır alanı hiç basmaz.
    expect(MOCK_SAYFA).toMatch(/\{sir && <input[^>]*name=\{CALLBACK_SIR_ALANI\}/);
  });

  it('sır `PUBLIC_` önekli DEĞİL — tarayıcı bundle\'ına düşmez', async () => {
    const LIB = readFileSync(join(__dirname, 'payment-provider.ts'), 'utf-8');
    expect(LIB).toMatch(/import\.meta\.env\.ODEME_CALLBACK_SIR/);
    expect(LIB).not.toMatch(/PUBLIC_ODEME_CALLBACK_SIR/);
  });
});
