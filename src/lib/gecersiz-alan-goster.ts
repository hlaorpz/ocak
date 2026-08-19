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
// Çözüm kaydırma ile odaklamayı AYIRIR:
//   1. ata <details> öğelerini aç   → alan layout'a girsin
//   2. scrollIntoView block:'center' → nav'ın altında kalmasın
//   3. focus preventScroll:true      → tarayıcı kendi kaydırmasını ÜSTÜNE BİNMESİN
//
// `preventScroll` şart: yoksa `focus()` kendi kaydırmasını yapar ve alan yine
// tepeye, nav'ın altına gider — 2. adım boşa çıkar.
//
// `block: 'center'` seçildi, `'start'` değil: nav yüksekliğini bilmeye gerek
// kalmıyor ve nav yüksekliği değişirse düzeltme bozulmuyor. Sabit piksel
// ofsetine bağlanmıyoruz. (Form alanlarında `scroll-margin-top` YOK — ölçüldü,
// `0px`. Yedek savunma olarak eklenebilir ama tek başına yeterli sayılmadı:
// KARAR 156 native kaydırmanın `scroll-margin-top`'u tam respect etmediğini
// ölçmüştü — Çember 38.87, Açık Kapı 44.17, beklenen 60.)
//
// ── Sıra bağlayıcı ──
// Bölümler kaydırmadan ÖNCE açılır. Kapalı bir <details> içindeki alanın
// layout kutusu yoktur; önce kaydırılırsa hedef yanlış yere oturur.

/**
 * Fonksiyonun DOM'dan istediği asgari yüzey.
 *
 * `HTMLElement` bunu yapısal olarak karşılar; test tarafı düz nesnelerle
 * çağırabilsin diye arayüz dar tutuldu. `instanceof HTMLDetailsElement` yerine
 * `tagName` karşılaştırması kullanılmasının sebebi de bu — `instanceof` gerçek
 * bir DOM ortamı (jsdom) zorunlu kılardı, bu da yeni bir bağımlılık demekti.
 */
export interface GosterilebilirOge {
  tagName: string;
  parentElement: GosterilebilirOge | null;
  /** Yalnız `<details>` öğelerinde anlamlı. */
  open?: boolean;
  scrollIntoView?(secenekler?: unknown): void;
  focus?(secenekler?: unknown): void;
}

/** Ne yapıldığının raporu — testin çivilendiği yüzey. */
export type GosterSonuc = {
  /** Bu çağrıda AÇILAN bölüm sayısı (zaten açık olanlar sayılmaz). */
  acilanBolum: number;
  kaydirildi: boolean;
  odaklandi: boolean;
};

export function gecersizAlaniGoster(el: GosterilebilirOge | null | undefined): GosterSonuc {
  const sonuc: GosterSonuc = { acilanBolum: 0, kaydirildi: false, odaklandi: false };
  if (!el) return sonuc;

  // 1) Ata <details> zincirini aç — kaydırmadan ÖNCE, layout doğsun diye.
  for (let p = el.parentElement; p; p = p.parentElement) {
    if (p.tagName === 'DETAILS' && p.open !== true) {
      p.open = true;
      sonuc.acilanBolum++;
    }
  }

  // 2) Ekranın ortasına getir — nav yüksekliğine bağlanmadan.
  if (typeof el.scrollIntoView === 'function') {
    el.scrollIntoView({ block: 'center', behavior: 'smooth' });
    sonuc.kaydirildi = true;
  }

  // 3) Odakla ama KAYDIRMA — 2. adımın işini bozmasın.
  if (typeof el.focus === 'function') {
    el.focus({ preventScroll: true });
    sonuc.odaklandi = true;
  }

  return sonuc;
}
