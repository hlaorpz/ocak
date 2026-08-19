// Zorunlu alan doğrulaması patladığında kadını o alana GÖTÜREN adım.
// Ek brief (19 Ağustos 2026) §1 + Not 2 — iki ayrı bulgu, tek mekanizma.
//
// ── Neden lib'de ──
// Mantık `KayitFormu.astro`nun inline script'indeydi; `src/pages/` ve `.astro`
// script'lerine test konamıyor (repo deseni: `havale-vade.ts`,
// `scroll-to-success.ts`, `mailerLiteFieldsPayload` hepsi aynı sebeple taşındı).
// Buradaki asıl neden test değil, TESTİN KORUDUĞU ŞEY: hata bugün patlamıyor
// ama Notion'a zorunlu bir niyet sorusu eklendiği gün canlıya çıkar (aşağıya bak).
//
// ── Bulgu 1: kapalı <details> = sessiz submit ──
// Form DÖRT native <details> bölümden oluşuyor ve ikisi KAPALI doğuyor:
//   Sen ✓ açık · Buluşma ✓ açık · Niyet ✗ kapalı · Ödeme ✗ kapalı
// Kapalı bir bölümdeki geçersiz zorunlu alan FOCUSABLE olmaz: tarayıcı submit'i
// blokluyor, uyarı balonunu gösteremiyor, konsola "An invalid form control is
// not focusable" yazıp susuyor. Ekranda hiçbir şey olmuyor — kadın butona
// basıyor, form duruyor, sebep görünmüyor.
//
// ⚠ Bugün patlamıyor çünkü Niyet ve Ödeme'de zorunlu alan yok. Notion'a
// zorunlu bir kayıt sorusu eklendiği anda canlıya çıkar. `gecersiz-alan-goster.test.ts`
// tam bu senaryonun bekçisi.
//
// ── Bulgu 2: alan sabit nav'ın altında kalıyor ──
// Nav `position: sticky; top: 0` ve viewport'un üstünü kaplıyor (canlı ölçüm:
// computed yükseklik 60px, `--nav-height` token'ı 64px — 4px sapma KARAR 156'da
// da kayıtlı). Tarayıcı odaklanan alanı viewport'un TEPESİNE hizalıyor; nav o
// tepeyi zaten örtüyor. Hata var, hata görünmüyor.
//
// ── ⚠ İLK DENEME KAPANMADI — ikinci tur (19 Ağustos, ikinci yarı) ──
// `66fa842` bu işi `scrollIntoView({block:'center'})` ile çözmeye çalıştı ve
// CANLIDA KAPANMADI; hatalı alan hâlâ nav'ın altında kalıyordu. Sebep zaten
// yazılıydı: KARAR 156 bu sitede tarayıcının hizalama sözleşmesine
// güvenilemeyeceğini ÖLÇMÜŞTÜ (scroll-margin-top respect edilmiyor —
// 38.87/44.17, beklenen 60). O ders görmezden gelindi.
//
// Artık kaydırma `nav-kaydir.ts` üzerinden yapılıyor: rAF içinde nav yüksekliği
// RUNTIME ölçülüp `window.scrollTo` ile MUTLAK konuma gidiliyor —
// `scrollToSuccess` ile birebir aynı mekanizma, tek yardımcı.
//
// ── Sıra bağlayıcı ──
//   1. ata <details> aç          → alan layout'a girsin
//   2. requestAnimationFrame     → açılma sonrası reflow otursun; konum eski
//                                  layout'tan hesaplanmasın
//   3. nav'ı ölç, mutlak konumu hesapla, window.scrollTo
//   4. focus({ preventScroll: true })
//
// `preventScroll` şart: yoksa `focus()` KENDİ kaydırmasını yapar, alanı
// viewport'un tepesine — yani nav'ın altına — götürür ve 3. adım boşa çıkar.
// 2, 3 ve 4 aynı kare içinde, bu sırayla koşar.

import {
  navAltinaKaydir,
  varsayilanOrtam,
  type KaydirmaOrtami,
  type KaydirilabilirOge,
} from './nav-kaydir';

/**
 * Fonksiyonun DOM'dan istediği asgari yüzey.
 *
 * `HTMLElement` bunu yapısal olarak karşılar; test tarafı düz nesnelerle
 * çağırabilsin diye arayüz dar tutuldu. `instanceof HTMLDetailsElement` yerine
 * `tagName` karşılaştırması kullanılmasının sebebi de bu — `instanceof` gerçek
 * bir DOM ortamı (jsdom) zorunlu kılardı, bu da yeni bir bağımlılık demekti.
 */
export interface GosterilebilirOge extends KaydirilabilirOge {
  tagName: string;
  parentElement: GosterilebilirOge | null;
  /** Yalnız `<details>` öğelerinde anlamlı. */
  open?: boolean;
  focus?(secenekler?: unknown): void;
}

/** Ne yapıldığının raporu — testin çivilendiği yüzey. */
export type GosterSonuc = {
  /** Bu çağrıda AÇILAN bölüm sayısı (zaten açık olanlar sayılmaz). */
  acilanBolum: number;
  kaydirildi: boolean;
  odaklandi: boolean;
};

export function gecersizAlaniGoster(
  el: GosterilebilirOge | null | undefined,
  ortam: KaydirmaOrtami = varsayilanOrtam(),
): GosterSonuc {
  const sonuc: GosterSonuc = { acilanBolum: 0, kaydirildi: false, odaklandi: false };
  if (!el) return sonuc;

  // 1) Ata <details> zincirini aç — kaydırmadan ÖNCE, layout doğsun diye.
  for (let p = el.parentElement; p; p = p.parentElement) {
    if (p.tagName === 'DETAILS' && p.open !== true) {
      p.open = true;
      sonuc.acilanBolum++;
    }
  }

  // 2-3-4) rAF içinde: nav'ı ölç → mutlak konuma kaydır → preventScroll ile odakla.
  if (typeof el.getBoundingClientRect === 'function') {
    navAltinaKaydir(el, 'orta', ortam, () => {
      if (typeof el.focus === 'function') el.focus({ preventScroll: true });
    });
    sonuc.kaydirildi = true;
  }

  // Odaklama rAF içinde gerçekleşiyor; rapor alanı "odaklanacak mı"yı söyler.
  sonuc.odaklandi = typeof el.focus === 'function';
  return sonuc;
}
