// Sticky nav'ın altına kaydırmanın TEK mekanizması.
//
// ── Nereden geldi ──
// Gövde `scroll-to-success.ts`ten (KARAR 156) birebir alındı, yeniden icat
// edilmedi. O dosyanın üç turluk kazanımı burada yaşıyor ve iki çağıranı da
// (success bloğu · geçersiz form alanı) aynı mekanizmayı paylaşıyor —
// iki yerde iki kaydırma mantığı yaşamasın.
//
// ── Neden `scrollIntoView` DEĞİL ──
// KARAR 156 bunu zaten ölçmüştü: bu sitede tarayıcı `scroll-margin-top`'u tam
// respect etmiyor (Console kanıtı: Çember 38.87, Açık Kapı 44.17 — beklenen 60).
// Ek brief §1'in ilk uygulaması (`66fa842`) bu dersi görmezden gelip
// `scrollIntoView({block:'center'})` kullandı ve **canlıda kapanmadı** —
// hatalı alan hâlâ nav'ın altında kalıyordu. İkinci tur bu dosyayı doğurdu.
//
// Kural: bu sitede kaydırma **mutlak konuma** yapılır, tarayıcının hizalama
// sözleşmesine güvenilmez.
//
// ── Neden token'a değil RUNTIME ölçüme güveniliyor ──
// `--nav-height` token'ı **64px** diyor, canlı computed yükseklik **60px**
// (19 Ağustos ölçümü, gerçek Chrome). Token drift'i sabit ofsete bağlanan her
// düzeltmeyi sessizce 4px kaydırır. Nav yüksekliği her çağrıda ölçülür.
//
// ── Neden rAF ──
// KARAR 156'nın üçüncü revizesi: `hidden=false` / `<details>.open=true`
// sonrası reflow tamamlanmadan `getBoundingClientRect()` ESKİ layout konumunu
// döndürüyor (Console: 34.87/40.17 — beklenen 60). `requestAnimationFrame`
// next-paint öncesi çalışır → reflow tamamlanmıştır → konum doğrudur.

/** Kaydırmanın dokunduğu her global — test enjekte edebilsin diye tek yerde. */
export type KaydirmaOrtami = {
  /** Sticky nav'ın RUNTIME yüksekliği. Token'a güvenilmez. */
  navYuksekligi(): number;
  /** `window.scrollY` */
  sayfaKaymasi(): number;
  /** `window.innerHeight` */
  ekranYuksekligi(): number;
  /** `prefers-reduced-motion: reduce` */
  azaltilmisHareket(): boolean;
  /** `window.scrollTo` */
  kaydir(hedefUst: number, yumusak: boolean): void;
  /** `requestAnimationFrame` */
  sonrakiKare(is: () => void): void;
};

/** Kaydırılacak öğeden istenen asgari yüzey — `HTMLElement` bunu karşılar. */
export type KaydirilabilirOge = {
  getBoundingClientRect(): { top: number; height: number };
};

export type Hizalama =
  /** Öğenin ÜSTÜ nav'ın hemen altına gelir. Blok/bölüm hedefleri için. */
  | 'ust'
  /** Öğe, nav'ın ALTINDA kalan görünür alanın ORTASINA oturur. Tek alan için. */
  | 'orta';

export function varsayilanOrtam(): KaydirmaOrtami {
  return {
    navYuksekligi: () =>
      document.querySelector<HTMLElement>('header')?.getBoundingClientRect().height ?? 64,
    sayfaKaymasi: () => window.scrollY,
    ekranYuksekligi: () => window.innerHeight,
    azaltilmisHareket: () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    kaydir: (hedefUst, yumusak) =>
      window.scrollTo({ top: hedefUst, behavior: yumusak ? 'smooth' : 'auto' }),
    sonrakiKare: (is) => requestAnimationFrame(is),
  };
}

/**
 * Hedefi sticky nav'ın altına kaydırır ve konumu MUTLAK hesaplar.
 *
 * `sonra` geri çağrısı kaydırmadan **hemen sonra, aynı kare içinde** koşar.
 * Odaklama bunun için var: `focus({preventScroll:true})` kaydırmadan sonra
 * gelmeli, yoksa hesaplanan konum bir işe yaramaz.
 */
export function navAltinaKaydir(
  hedef: KaydirilabilirOge,
  hizala: Hizalama,
  ortam: KaydirmaOrtami = varsayilanOrtam(),
  sonra?: () => void,
): void {
  ortam.sonrakiKare(() => {
    const nav = ortam.navYuksekligi();
    const kutu = hedef.getBoundingClientRect();
    const mutlakUst = kutu.top + ortam.sayfaKaymasi();

    let hedefUst: number;
    if (hizala === 'ust') {
      hedefUst = mutlakUst - nav;
    } else {
      // Nav'ın altında kalan görünür şerit; öğe onun ortasına oturur.
      // Nav yüksekliği hesaba KATILIR — 'orta' bu yüzden nav'a bağımsız
      // görünse de aslında ölçülmüş nav'ı kullanır.
      const gorunurSerit = ortam.ekranYuksekligi() - nav;
      hedefUst = mutlakUst - nav - (gorunurSerit - kutu.height) / 2;
    }

    // Sayfanın başından yukarı kaydırılamaz; negatif hedef 0'a kırpılır.
    ortam.kaydir(Math.max(0, Math.round(hedefUst)), !ortam.azaltilmisHareket());
    sonra?.();
  });
}
