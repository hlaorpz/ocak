import { describe, it, expect } from 'vitest';
import { gecersizAlaniGoster, type GosterilebilirOge } from './gecersiz-alan-goster';

// Ek brief §1 + Not 2 bekçisi.
//
// Bu testin işi bugünü korumak DEĞİL — bugün hata patlamıyor, çünkü kapalı
// doğan iki bölümde (Niyet · Ödeme) zorunlu alan yok. İşi yarını korumak:
// Notion'a zorunlu bir kayıt sorusu eklendiği gün, o alan kapalı bir
// <details> içinde doğar ve submit SESSİZCE durur. Tarayıcı "An invalid form
// control is not focusable" deyip susar; kadın butona basar, hiçbir şey olmaz.

/** Test için asgari DOM taklidi. Gerçek DOM (jsdom) yeni bir bağımlılık olurdu. */
type Sahte = GosterilebilirOge & { ad?: string };

function oge(tagName: string, ekler: Partial<Sahte> = {}): Sahte {
  return { tagName, parentElement: null, ...ekler };
}

/**
 * Zincir kurar: son eleman en dıştaki ata olacak şekilde bağlar.
 * `zincir('INPUT', 'DETAILS', 'FORM')` → input'un atası details, onun atası form.
 */
function zincir(...tagler: string[]): Sahte[] {
  const ogeler = tagler.map((t) => oge(t, t === 'DETAILS' ? { open: false } : {}));
  ogeler.forEach((o, i) => {
    o.parentElement = ogeler[i + 1] ?? null;
  });
  return ogeler;
}

/** Çağrı sırasını kaydeden alan taklidi — sıra bağlayıcı olduğu için gerekli. */
function alanKur(atalar: string[]) {
  const gunluk: string[] = [];
  const parcalar = zincir('INPUT', ...atalar);
  const alan = parcalar[0];
  alan.scrollIntoView = (s) => {
    gunluk.push(`scrollIntoView:${JSON.stringify(s)}`);
  };
  alan.focus = (s) => {
    gunluk.push(`focus:${JSON.stringify(s)}`);
  };
  const detaylar = parcalar.filter((p) => p.tagName === 'DETAILS');
  // <details> açılışını da günlüğe geçir ki sıra sınanabilsin
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
    const { alan, detaylar } = alanKur(['DETAILS', 'FORM']);
    expect(detaylar[0].open).toBe(false);

    const sonuc = gecersizAlaniGoster(alan);

    expect(detaylar[0].open).toBe(true);
    expect(sonuc.acilanBolum).toBe(1);
  });

  it('İÇ İÇE bölümlerin hepsini açar — tek ata yetmez', () => {
    const { alan, detaylar } = alanKur(['DETAILS', 'DIV', 'DETAILS', 'FORM']);
    const sonuc = gecersizAlaniGoster(alan);
    expect(detaylar.every((d) => d.open === true)).toBe(true);
    expect(sonuc.acilanBolum).toBe(2);
  });

  it('ZATEN AÇIK bölümü saymaz ve dokunmaz (Sen · Buluşma hâli)', () => {
    const { alan, detaylar } = alanKur(['DETAILS', 'FORM']);
    detaylar[0].open = true;
    const sonuc = gecersizAlaniGoster(alan);
    expect(detaylar[0].open).toBe(true);
    expect(sonuc.acilanBolum).toBe(0);
  });

  it('ata zincirinde <details> yoksa kimseyi açmaz — yanlış yere müdahale etmez', () => {
    // Canlı gözlem: ilk geçersiz alan görünür konumdaki onay kutusuydu,
    // açılacak ata yoktu. Düzeltme o durumda sessiz kalmalı.
    const { alan } = alanKur(['DIV', 'FORM']);
    const sonuc = gecersizAlaniGoster(alan);
    expect(sonuc.acilanBolum).toBe(0);
    expect(sonuc.kaydirildi).toBe(true);
    expect(sonuc.odaklandi).toBe(true);
  });
});

describe('gecersizAlaniGoster — kaydırma ve odaklama (Ek brief §1)', () => {
  it('scrollIntoView block:"center" ile çağrılır — nav yüksekliğine bağlanmaz', () => {
    const { alan, gunluk } = alanKur(['FORM']);
    gecersizAlaniGoster(alan);
    const cagri = gunluk.find((g) => g.startsWith('scrollIntoView:'))!;
    expect(cagri).toContain('"block":"center"');
    // 'start' sabit piksel ofseti gerektirirdi; nav yüksekliği değişince bozulurdu.
    expect(cagri).not.toContain('"block":"start"');
  });

  it('focus preventScroll:true ile çağrılır — YOKSA kaydırma boşa çıkar', () => {
    // Bu testin çivilediği şey ince: `focus()` varsayılan olarak KENDİ
    // kaydırmasını yapar ve alanı viewport'un TEPESİNE, yani sticky nav'ın
    // altına götürür. preventScroll düşerse §1 sessizce geri gelir.
    const { alan, gunluk } = alanKur(['FORM']);
    gecersizAlaniGoster(alan);
    const cagri = gunluk.find((g) => g.startsWith('focus:'))!;
    expect(cagri).toContain('"preventScroll":true');
  });

  it('SIRA bağlayıcı: önce bölüm açılır, sonra kaydırılır, en son odaklanılır', () => {
    // Kapalı <details> içindeki alanın layout kutusu yoktur; önce kaydırılırsa
    // hedef yanlış yere oturur. Odaklama da kaydırmadan sonra gelmeli.
    const { alan, gunluk } = alanKur(['DETAILS', 'FORM']);
    gecersizAlaniGoster(alan);
    const sadeleşmiş = gunluk.map((g) => g.split(':')[0]);
    expect(sadeleşmiş).toEqual(['open', 'scrollIntoView', 'focus']);
  });

  it('null/undefined alanda kırılmaz — hiçbir şey yapmaz', () => {
    expect(gecersizAlaniGoster(null)).toEqual({
      acilanBolum: 0,
      kaydirildi: false,
      odaklandi: false,
    });
    expect(gecersizAlaniGoster(undefined).odaklandi).toBe(false);
  });

  it('scrollIntoView/focus taşımayan öğede kırılmaz (defansif)', () => {
    const { alan, detaylar } = alanKur(['DETAILS', 'FORM']);
    delete alan.scrollIntoView;
    delete alan.focus;
    const sonuc = gecersizAlaniGoster(alan);
    // Bölüm yine de açılır — asıl iş o.
    expect(detaylar[0].open).toBe(true);
    expect(sonuc.kaydirildi).toBe(false);
    expect(sonuc.odaklandi).toBe(false);
  });
});
