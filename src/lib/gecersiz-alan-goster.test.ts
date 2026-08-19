import { describe, it, expect } from 'vitest';
import { gecersizAlaniGoster, type GosterilebilirOge } from './gecersiz-alan-goster';
import type { KaydirmaOrtami } from './nav-kaydir';

// Ek brief §1 + Not 2 bekçisi.
//
// Bu testin işi bugünü korumak DEĞİL — bugün hata patlamıyor, çünkü kapalı
// doğan iki bölümde (Niyet · Ödeme) zorunlu alan yok. İşi yarını korumak:
// Notion'a zorunlu bir kayıt sorusu eklendiği gün, o alan kapalı bir
// <details> içinde doğar ve submit SESSİZCE durur. Tarayıcı "An invalid form
// control is not focusable" deyip susar; kadın butona basar, hiçbir şey olmaz.
//
// İKİNCİ TUR: kaydırma `scrollIntoView`dan `window.scrollTo`ya geçti çünkü
// ilk uygulama (`66fa842`) CANLIDA KAPANMADI. Assert'ler de o mekanizmayı
// izliyor — `scrollIntoView` bekçisi yerine artık MUTLAK KONUM bekçisi var.

/** Test için asgari DOM taklidi. Gerçek DOM (jsdom) yeni bir bağımlılık olurdu. */
type Sahte = GosterilebilirOge;

/** Gerçek globallerin hiçbirine dokunmayan sahte kaydırma ortamı. */
function ortamKur(
  gunluk: string[],
  ayar: { nav?: number; ekran?: number; kayma?: number; azaltilmis?: boolean } = {},
): KaydirmaOrtami & { sonKaydirma: () => number | null } {
  let sonKaydirma: number | null = null;
  return {
    navYuksekligi: () => ayar.nav ?? 60,
    sayfaKaymasi: () => ayar.kayma ?? 0,
    ekranYuksekligi: () => ayar.ekran ?? 800,
    azaltilmisHareket: () => ayar.azaltilmis ?? false,
    kaydir: (hedefUst, yumusak) => {
      sonKaydirma = hedefUst;
      gunluk.push(`kaydir:${hedefUst}:${yumusak ? 'smooth' : 'auto'}`);
    },
    // rAF testte SENKRON koşar — sıra sınanabilsin diye.
    sonrakiKare: (is) => {
      gunluk.push('rAF');
      is();
    },
    sonKaydirma: () => sonKaydirma,
  };
}

function alanKur(atalar: string[], kutu = { top: 1000, height: 48 }) {
  const gunluk: string[] = [];
  const tagler = ['INPUT', ...atalar];
  const ogeler: Sahte[] = tagler.map((t) => ({
    tagName: t,
    parentElement: null,
    getBoundingClientRect: () => kutu,
  }));
  ogeler.forEach((o, i) => {
    o.parentElement = ogeler[i + 1] ?? null;
  });

  const alan = ogeler[0];
  alan.focus = (s) => {
    gunluk.push(`focus:${JSON.stringify(s)}`);
  };

  const detaylar = ogeler.filter((p) => p.tagName === 'DETAILS');
  detaylar.forEach((d, i) => {
    let deger = false;
    Object.defineProperty(d, 'open', {
      get: () => deger,
      set: (v) => {
        deger = v;
        if (v) gunluk.push(`open:${i}`);
      },
      configurable: true,
    });
  });

  return { alan, detaylar, gunluk };
}

describe('gecersizAlaniGoster — kapalı <details> (Ek brief Not 2)', () => {
  it('KAPALI ata bölümü AÇAR — sessiz submit hatasının bekçisi', () => {
    const { alan, detaylar, gunluk } = alanKur(['DETAILS', 'FORM']);
    expect(detaylar[0].open).toBe(false);

    const sonuc = gecersizAlaniGoster(alan, ortamKur(gunluk));

    expect(detaylar[0].open).toBe(true);
    expect(sonuc.acilanBolum).toBe(1);
  });

  it('İÇ İÇE bölümlerin hepsini açar — tek ata yetmez', () => {
    const { alan, detaylar, gunluk } = alanKur(['DETAILS', 'DIV', 'DETAILS', 'FORM']);
    const sonuc = gecersizAlaniGoster(alan, ortamKur(gunluk));
    expect(detaylar.every((d) => d.open === true)).toBe(true);
    expect(sonuc.acilanBolum).toBe(2);
  });

  it('ZATEN AÇIK bölümü saymaz ve dokunmaz (Sen · Buluşma hâli)', () => {
    const { alan, detaylar, gunluk } = alanKur(['DETAILS', 'FORM']);
    detaylar[0].open = true;
    const sonuc = gecersizAlaniGoster(alan, ortamKur(gunluk));
    expect(detaylar[0].open).toBe(true);
    expect(sonuc.acilanBolum).toBe(0);
  });

  it('ata zincirinde <details> yoksa kimseyi açmaz — yanlış yere müdahale etmez', () => {
    // Canlı gözlem: ilk geçersiz alan görünür konumdaki onay kutusuydu,
    // açılacak ata yoktu. Düzeltme o durumda sessiz kalmalı.
    const { alan, gunluk } = alanKur(['DIV', 'FORM']);
    const sonuc = gecersizAlaniGoster(alan, ortamKur(gunluk));
    expect(sonuc.acilanBolum).toBe(0);
    expect(sonuc.kaydirildi).toBe(true);
    expect(sonuc.odaklandi).toBe(true);
  });
});

describe('gecersizAlaniGoster — kaydırma ve odaklama (Ek brief §1, ikinci tur)', () => {
  it('scrollIntoView DEĞİL, MUTLAK konuma window.scrollTo — canlıda kapanmayan yol', () => {
    // İlk uygulama `scrollIntoView({block:'center'})` kullandı ve hatalı alan
    // canlıda hâlâ nav'ın altında kalıyordu. KARAR 156 bu sitede tarayıcının
    // hizalama sözleşmesine güvenilemeyeceğini zaten ölçmüştü.
    const { alan, gunluk } = alanKur(['FORM']);
    gecersizAlaniGoster(alan, ortamKur(gunluk));
    expect(gunluk.some((g) => g.startsWith('kaydir:'))).toBe(true);
    // Öğede scrollIntoView TANIMLI DEĞİL; çağrılsaydı test taklitte patlardı.
    expect('scrollIntoView' in alan).toBe(false);
  });

  it('hedef konum RUNTIME nav ölçümünden hesaplanır — token 64 değil, ölçülen 60', () => {
    // top=1000, height=48, kayma=0, ekran=800.
    // nav=60 → şerit 740 → hedef = 1000 - 60 - (740-48)/2 = 1000 - 60 - 346 = 594
    const g1: string[] = [];
    gecersizAlaniGoster(alanKur(['FORM']).alan, ortamKur(g1, { nav: 60 }));
    expect(g1).toContain('kaydir:594:smooth');

    // nav=64 (token değeri) OLSAYDI hedef başka çıkardı → 1000-64-(736-48)/2 = 592
    const g2: string[] = [];
    gecersizAlaniGoster(alanKur(['FORM']).alan, ortamKur(g2, { nav: 64 }));
    expect(g2).toContain('kaydir:592:smooth');
    // İki değerin FARKLI olması, nav'ın gerçekten hesaba girdiğinin kanıtı.
    expect(g1[1]).not.toBe(g2[1]);
  });

  it('sayfa kayması hesaba katılır — mutlak konum, viewport konumu değil', () => {
    const g: string[] = [];
    // kayma=500 → mutlakUst = 1000+500 = 1500 → 1500-60-346 = 1094
    gecersizAlaniGoster(alanKur(['FORM']).alan, ortamKur(g, { kayma: 500 }));
    expect(g).toContain('kaydir:1094:smooth');
  });

  it('negatif hedef 0\'a kırpılır — sayfa başından yukarı kaydırılmaz', () => {
    const g: string[] = [];
    // top=10 → 10-60-346 = -396 → 0
    gecersizAlaniGoster(alanKur(['FORM'], { top: 10, height: 48 }).alan, ortamKur(g));
    expect(g).toContain('kaydir:0:smooth');
  });

  it('prefers-reduced-motion saygı görür — smooth yerine auto', () => {
    const g: string[] = [];
    gecersizAlaniGoster(alanKur(['FORM']).alan, ortamKur(g, { azaltilmis: true }));
    expect(g.some((x) => x.endsWith(':auto'))).toBe(true);
  });

  it('focus preventScroll:true ile çağrılır — YOKSA kaydırma boşa çıkar', () => {
    // Bu testin çivilediği şey ince: `focus()` varsayılan olarak KENDİ
    // kaydırmasını yapar ve alanı viewport'un TEPESİNE, yani sticky nav'ın
    // altına götürür. preventScroll düşerse §1 sessizce geri gelir.
    const { alan, gunluk } = alanKur(['FORM']);
    gecersizAlaniGoster(alan, ortamKur(gunluk));
    const cagri = gunluk.find((g) => g.startsWith('focus:'))!;
    expect(cagri).toContain('"preventScroll":true');
  });

  it('SIRA bağlayıcı: bölüm aç → rAF → kaydır → odakla', () => {
    // Kapalı <details> içindeki alanın layout kutusu yoktur; rAF olmadan
    // konum ESKİ layout'tan hesaplanır (KARAR 156 üçüncü revizesi).
    // Odaklama da kaydırmadan sonra gelmeli.
    const { alan, gunluk } = alanKur(['DETAILS', 'FORM']);
    gecersizAlaniGoster(alan, ortamKur(gunluk));
    expect(gunluk.map((g) => g.split(':')[0])).toEqual(['open', 'rAF', 'kaydir', 'focus']);
  });

  it('null/undefined alanda kırılmaz — hiçbir şey yapmaz', () => {
    expect(gecersizAlaniGoster(null)).toEqual({
      acilanBolum: 0,
      kaydirildi: false,
      odaklandi: false,
    });
    expect(gecersizAlaniGoster(undefined).odaklandi).toBe(false);
  });

  it('focus taşımayan öğede kırılmaz (defansif)', () => {
    const { alan, detaylar, gunluk } = alanKur(['DETAILS', 'FORM']);
    delete alan.focus;
    const sonuc = gecersizAlaniGoster(alan, ortamKur(gunluk));
    // Bölüm yine açılır, kaydırma yine yapılır — asıl iş onlar.
    expect(detaylar[0].open).toBe(true);
    expect(sonuc.kaydirildi).toBe(true);
    expect(sonuc.odaklandi).toBe(false);
  });
});
