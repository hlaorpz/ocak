import { describe, it, expect } from 'vitest';
import {
  honeypotYakalandi,
  originSebebi,
  zamanDamgasiSebebi,
  ASGARI_DOLDURMA_MS,
  AZAMI_FORM_YASI_MS,
  SAAT_KAYMASI_TOLERANSI_MS,
} from './davet-kapi.ts';

// `/api/davet` sessiz ret kapısı. Üç katmanın da tek işi var: geçerliyse
// `null`, değilse sebep. Sebep response'a girmez, yalnız log sayacına.
const SIMDI = 1_755_000_000_000; // sabit — Date.now() testte kullanılmaz

describe('honeypotYakalandi', () => {
  it('dolu alan bottur', () => {
    expect(honeypotYakalandi('http://spam.example')).toBe(true);
  });

  it('yalnız boşluk da dolu sayılmaz', () => {
    // `.trim()` — bazı botlar alanı boşlukla doldurur; bu bot değil, gürültü.
    expect(honeypotYakalandi('   ')).toBe(false);
  });

  it('boş / eksik alan geçer', () => {
    expect(honeypotYakalandi('')).toBe(false);
    expect(honeypotYakalandi(undefined)).toBe(false);
    expect(honeypotYakalandi(null)).toBe(false);
  });

  it('dize olmayan tip yakalamaz — tip zorlaması yok', () => {
    // Amaç: `{website: 0}` ya da `{website: {}}` gibi gövdeler validation'a
    // düşsün, honeypot sayacını kirletmesin.
    expect(honeypotYakalandi(0)).toBe(false);
    expect(honeypotYakalandi({})).toBe(false);
  });
});

describe('zamanDamgasiSebebi', () => {
  it('EKSİK damga rettir — kapının tamamı bu satırda', () => {
    // KARAR 1 (Kaan): yalnız "<3sn ise reddet" kâğıt üstünde koruma olurdu;
    // alanı hiç göndermeyen doğrudan-POST botu geçerdi. Bu üç satır kalkarsa
    // koruma da kalkar.
    expect(zamanDamgasiSebebi(undefined, SIMDI)).toBe('ts-yok');
    expect(zamanDamgasiSebebi(null, SIMDI)).toBe('ts-yok');
    expect(zamanDamgasiSebebi('', SIMDI)).toBe('ts-yok');
  });

  it('bozuk damga rettir', () => {
    expect(zamanDamgasiSebebi('dun', SIMDI)).toBe('ts-gecersiz');
    expect(zamanDamgasiSebebi(0, SIMDI)).toBe('ts-gecersiz');
    expect(zamanDamgasiSebebi(-1, SIMDI)).toBe('ts-gecersiz');
    expect(zamanDamgasiSebebi(Number.NaN, SIMDI)).toBe('ts-gecersiz');
    expect(zamanDamgasiSebebi(Number.POSITIVE_INFINITY, SIMDI)).toBe('ts-gecersiz');
  });

  it('3 saniyeden hızlı gönderim rettir', () => {
    expect(zamanDamgasiSebebi(SIMDI, SIMDI)).toBe('ts-hizli');
    expect(zamanDamgasiSebebi(SIMDI - 2_999, SIMDI)).toBe('ts-hizli');
  });

  it('tam eşikte geçer — sınır dahil', () => {
    expect(zamanDamgasiSebebi(SIMDI - ASGARI_DOLDURMA_MS, SIMDI)).toBeNull();
  });

  it('dize damga da kabul — hidden input dize yollar', () => {
    // DavetKutusu `input.value` okur; sunucuya her zaman dize gelir. Bu satır
    // kırılırsa gerçek kullanıcı sessizce reddedilir.
    expect(zamanDamgasiSebebi(String(SIMDI - 10_000), SIMDI)).toBeNull();
    expect(zamanDamgasiSebebi(`  ${SIMDI - 10_000}  `, SIMDI)).toBeNull();
  });

  it('gelecekteki damga rettir — ama saat kayması toleranslı', () => {
    expect(zamanDamgasiSebebi(SIMDI + 10 * 60_000, SIMDI)).toBe('ts-gelecek');
    // Kullanıcı saati birkaç saniye ileri olabilir; bu bot değil.
    expect(zamanDamgasiSebebi(SIMDI + SAAT_KAYMASI_TOLERANSI_MS - 1, SIMDI)).toBe(
      'ts-hizli',
    );
  });

  it('bayat damga rettir', () => {
    expect(zamanDamgasiSebebi(SIMDI - AZAMI_FORM_YASI_MS - 1, SIMDI)).toBe('ts-eski');
  });

  it('normal insan gönderimi geçer', () => {
    expect(zamanDamgasiSebebi(SIMDI - 12_000, SIMDI)).toBeNull();
    expect(zamanDamgasiSebebi(SIMDI - 60 * 60_000, SIMDI)).toBeNull();
  });
});

describe('originSebebi', () => {
  it('eşleşen origin geçer', () => {
    expect(originSebebi('https://www.ocak.biz', 'https://www.ocak.biz')).toBeNull();
  });

  it('EKSİK Origin rettir — tarayıcı POST\'ta her zaman yollar', () => {
    // Origin header\'ı GET/HEAD dışındaki her istekte set edilir (same-origin
    // dahil). Yokluğu "tarayıcıdan gelmedi" demektir — bugünkü saldırının imzası.
    expect(originSebebi(null, 'https://www.ocak.biz')).toBe('origin-yok');
    expect(originSebebi(undefined, 'https://www.ocak.biz')).toBe('origin-yok');
    expect(originSebebi('', 'https://www.ocak.biz')).toBe('origin-yok');
  });

  it('yabancı origin rettir', () => {
    expect(originSebebi('https://evil.example', 'https://www.ocak.biz')).toBe(
      'origin-uyusmuyor',
    );
    // Alt alan adı da yabancıdır — `ocak.biz.evil.example` tuzağı buraya düşer.
    expect(originSebebi('https://www.ocak.biz.evil.example', 'https://www.ocak.biz')).toBe(
      'origin-uyusmuyor',
    );
  });

  it('opaque / bozuk origin rettir', () => {
    // Sandbox iframe ve bazı yönlendirme zincirleri literal "null" yollar.
    expect(originSebebi('null', 'https://www.ocak.biz')).toBe('origin-uyusmuyor');
    expect(originSebebi('][', 'https://www.ocak.biz')).toBe('origin-uyusmuyor');
  });

  it('LOKAL DEV — şema farkı reddetmez', () => {
    // `publicOrigin()` x-forwarded-proto yokken şemayı `https`e sabitler
    // (public-origin.ts:21); tarayıcı ise `http://localhost:4321` yollar. Tam
    // dize karşılaştırması dev\'i kırar ve "kapı her yerde reddediyor" diye
    // yanlış yeşil verirdi. Karşılaştırma host üzerinden.
    expect(originSebebi('http://localhost:4321', 'https://localhost:4321')).toBeNull();
  });

  it('preview deployment host\'u geçer', () => {
    expect(
      originSebebi(
        'https://ocak-site-abc123.vercel.app',
        'https://ocak-site-abc123.vercel.app',
      ),
    ).toBeNull();
  });

  it('port farkı yabancıdır', () => {
    expect(originSebebi('http://localhost:5173', 'https://localhost:4321')).toBe(
      'origin-uyusmuyor',
    );
  });
});
