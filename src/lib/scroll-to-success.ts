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

export function scrollToSuccess(successEl: HTMLElement): void {
  requestAnimationFrame(() => {
    const navEl = document.querySelector<HTMLElement>('header');
    const navHeight = navEl?.getBoundingClientRect().height ?? 64;
    // Section (form dış çerçevesi) hedef — successEl (iç div/p) değil.
    // Niyet: section bg nav-bottom'a yapışsın, success içerikleri onun
    // içinde üstte konumlansın. successEl hedef alınınca section nav
    // arkasında kalıyordu (Console: 34.87/40.17 — beklenen 60).
    const sectionEl = successEl.closest('section') ?? successEl;
    const sectionTop = sectionEl.getBoundingClientRect().top + window.scrollY;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({
      top: sectionTop - navHeight,
      behavior: reduce ? 'auto' : 'smooth',
    });
  });
}
