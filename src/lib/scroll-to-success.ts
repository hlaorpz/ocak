// KARAR 156 — sticky nav + DOM reflow (form.hidden=true → section shrink) +
// scrollIntoView race condition; browser scroll-margin-top'u tam respect
// etmiyor (Console kanıt: Çember 38.87, Açık Kapı 44.17 — beklenen 60).
// Runtime nav height ölçümü + manuel window.scrollTo deterministik. Token
// drift (--nav-height: 64px ≠ runtime ≈ 60px) bypass edilir.
//
// rAF (üçüncü revize): hidden=false sonrası reflow tamamlanmadan
// getBoundingClientRect eski layout konumu döndürüyordu (P3-helper
// Console: 34.87/40.17 — beklenen 60). requestAnimationFrame next-paint
// öncesi çalışır → reflow tamamlanmış olur → doğru konum.
//
// ── Ek brief §1, ikinci tur (19 Ağustos 2026) ──
// Yukarıdaki mekanizma `nav-kaydir.ts`e TAŞINDI, silinmedi. Sebep: geçersiz
// form alanına kaydırma da tam bu mekanizmayı gerektiriyordu ve ilk denemesi
// (`66fa842`) `scrollIntoView` kullanıp canlıda kapanmadı — bu dosyanın
// başlığındaki ders görmezden gelinmişti. İki yerde iki kaydırma mantığı
// yaşamasın diye tek yardımcıya indirildi.
//
// Bu dosya artık yalnız KENDİ hedef seçimini taşıyor: section mi, successEl mi.
// Davranış birebir aynı — hizalama 'ust', yani section üstü nav'ın altına.

import { navAltinaKaydir } from './nav-kaydir';

export function scrollToSuccess(successEl: HTMLElement): void {
  // Section (form dış çerçevesi) hedef — successEl (iç div/p) değil.
  // Niyet: section bg nav-bottom'a yapışsın, success içerikleri onun
  // içinde üstte konumlansın. successEl hedef alınınca section nav
  // arkasında kalıyordu (Console: 34.87/40.17 — beklenen 60).
  const sectionEl = successEl.closest('section') ?? successEl;
  navAltinaKaydir(sectionEl, 'ust');
}
