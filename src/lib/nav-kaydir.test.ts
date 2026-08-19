import { describe, it, expect } from 'vitest';
import { navAltinaKaydir, type KaydirmaOrtami } from './nav-kaydir';

// `nav-kaydir.ts` iki çağıranı besliyor:
//   'ust'  → scrollToSuccess (KARAR 156) — bölüm üstü nav'ın altına
//   'orta' → gecersizAlaniGoster (Ek brief §1) — alan görünür şeridin ortasına
//
// Buradaki testlerin işi 'ust' sözleşmesini çivilemek: mekanizma ortak
// yardımcıya taşındığında KARAR 156'nın davranışı SESSİZCE değişmesin.

function ortamKur(ayar: { nav?: number; ekran?: number; kayma?: number; azaltilmis?: boolean } = {}) {
  const gunluk: string[] = [];
  const ortam: KaydirmaOrtami = {
    navYuksekligi: () => ayar.nav ?? 60,
    sayfaKaymasi: () => ayar.kayma ?? 0,
    ekranYuksekligi: () => ayar.ekran ?? 800,
    azaltilmisHareket: () => ayar.azaltilmis ?? false,
    kaydir: (t, y) => gunluk.push(`kaydir:${t}:${y ? 'smooth' : 'auto'}`),
    sonrakiKare: (is) => {
      gunluk.push('rAF');
      is();
    },
  };
  return { ortam, gunluk };
}

const hedef = (top: number, height = 400) => ({ getBoundingClientRect: () => ({ top, height }) });

describe("navAltinaKaydir 'ust' — scrollToSuccess sözleşmesi (KARAR 156)", () => {
  it('bölümün ÜSTÜ nav\'ın hemen altına gelir: mutlakUst − navYuksekligi', () => {
    const { ortam, gunluk } = ortamKur({ nav: 60, kayma: 200 });
    navAltinaKaydir(hedef(500), 'ust', ortam);
    // (500 + 200) − 60 = 640
    expect(gunluk).toContain('kaydir:640:smooth');
  });

  it("'ust' hedefin YÜKSEKLİĞİNİ kullanmaz — bölüm ne kadar uzun olursa olsun", () => {
    // KARAR 156'nın niyeti: section bg nav-bottom'a yapışsın. Yükseklik girerse
    // uzun bölümlerde üst kenar kayardı.
    const a = ortamKur({ nav: 60 });
    navAltinaKaydir(hedef(500, 100), 'ust', a.ortam);
    const b = ortamKur({ nav: 60 });
    navAltinaKaydir(hedef(500, 5000), 'ust', b.ortam);
    expect(a.gunluk).toEqual(b.gunluk);
  });

  it('nav yüksekliği RUNTIME ölçülür — token drift (64 ≠ 60) buraya sızmaz', () => {
    const a = ortamKur({ nav: 60 });
    navAltinaKaydir(hedef(500), 'ust', a.ortam);
    const b = ortamKur({ nav: 64 });
    navAltinaKaydir(hedef(500), 'ust', b.ortam);
    expect(a.gunluk).toContain('kaydir:440:smooth');
    expect(b.gunluk).toContain('kaydir:436:smooth');
  });

  it('rAF içinde koşar — reflow oturmadan konum ölçülmesin (üçüncü revize)', () => {
    const { ortam, gunluk } = ortamKur();
    navAltinaKaydir(hedef(500), 'ust', ortam);
    expect(gunluk[0]).toBe('rAF');
  });

  it('azaltılmış hareket: smooth yerine auto', () => {
    const { ortam, gunluk } = ortamKur({ azaltilmis: true });
    navAltinaKaydir(hedef(500), 'ust', ortam);
    expect(gunluk.some((g) => g.endsWith(':auto'))).toBe(true);
  });

  it('`sonra` geri çağrısı kaydırmadan SONRA, aynı kare içinde koşar', () => {
    const { ortam, gunluk } = ortamKur();
    navAltinaKaydir(hedef(500), 'ust', ortam, () => gunluk.push('sonra'));
    expect(gunluk.map((g) => g.split(':')[0])).toEqual(['rAF', 'kaydir', 'sonra']);
  });
});

describe("navAltinaKaydir 'orta' — iki hizalama gerçekten farklı", () => {
  it("aynı hedefte 'ust' ve 'orta' FARKLI konum üretir", () => {
    const a = ortamKur();
    navAltinaKaydir(hedef(1000, 48), 'ust', a.ortam);
    const b = ortamKur();
    navAltinaKaydir(hedef(1000, 48), 'orta', b.ortam);
    expect(a.gunluk[1]).not.toBe(b.gunluk[1]);
    expect(a.gunluk).toContain('kaydir:940:smooth'); // 1000 − 60
    expect(b.gunluk).toContain('kaydir:594:smooth'); // 1000 − 60 − (740−48)/2
  });
});
