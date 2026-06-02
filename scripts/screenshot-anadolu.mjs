import { chromium } from 'playwright';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
await page.goto('http://localhost:4321/anadolu', { waitUntil: 'networkidle' });

// Bug 1 teyit: noktanın SVG cx/cy + bbox boyut hover öncesi/sonrası SABIT olmalı.
// (v1: CSS transform translate(0,0)+scale(1.15) noktayı (0,0)'a fırlatıyordu.)
const noktaInfo = await page.evaluate(() => {
  const nokta = document.querySelector('[data-evre="durus"]');
  const dot = nokta.querySelector('.anadolu-harita__nokta-dot');
  const before = { transform: nokta.getAttribute('transform'), bbox: dot.getBBox() };
  // simulate hover
  nokta.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
  nokta.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
  const after = { transform: nokta.getAttribute('transform'), bbox: dot.getBBox() };
  return { before, after };
});
console.log('Bug 1 hover titreme teyit (DURUŞ):');
console.log('  before:', noktaInfo.before);
console.log('  after :', noktaInfo.after);
const sameTransform = noktaInfo.before.transform === noktaInfo.after.transform;
const sameBBox = JSON.stringify(noktaInfo.before.bbox) === JSON.stringify(noktaInfo.after.bbox);
console.log(' ', sameTransform && sameBBox ? '✓ SABIT (titreme yok)' : '⚠ KAYDI');

await page.screenshot({ path: '/tmp/anadolu-hover.png', clip: { x: 200, y: 150, width: 700, height: 500 } });

// Bug 2 teyit: noktayı program ile activate et (SVG sınır path'i mouse click'i kapıyor),
// kart nav'ın hemen altına hizalanmalı.
await page.evaluate(() => {
  const nokta = document.querySelector('[data-evre="inis"]');
  nokta.dispatchEvent(new MouseEvent('click', { bubbles: true }));
});
await page.waitForTimeout(1500);
const hizalama = await page.evaluate(() => {
  const nav = document.querySelector('header.nav, header');
  const kart = document.getElementById('evre-inis');
  return {
    navBottom: nav.getBoundingClientRect().bottom,
    kartTop: kart.getBoundingClientRect().top,
  };
});
console.log('Bug 2 scroll hizalama teyit (İNİŞ tıkla):');
console.log('  nav bottom y =', hizalama.navBottom.toFixed(2));
console.log('  kart top y   =', hizalama.kartTop.toFixed(2));
console.log('  fark         =', (hizalama.kartTop - hizalama.navBottom).toFixed(2), '(≈0 ideal)');
await page.screenshot({ path: '/tmp/anadolu-scroll-hizalama.png', clip: { x: 0, y: 0, width: 1280, height: 700 } });

// Kart hover yükselme R1
const acilisKart = await page.$('#evre-acilis');
await acilisKart.scrollIntoViewIfNeeded();
await page.waitForTimeout(300);
const kartBefore = await acilisKart.boundingBox();
await acilisKart.hover();
await page.waitForTimeout(500);
const kartAfter = await acilisKart.boundingBox();
console.log('R1 kart hover yükselme (AÇILIŞ):');
console.log('  before y=', kartBefore.y.toFixed(2), 'after y=', kartAfter.y.toFixed(2),
            'Δy=', (kartAfter.y - kartBefore.y).toFixed(2), '(−2px beklenir)');
await page.screenshot({ path: '/tmp/anadolu-kart-hover.png', clip: { x: 200, y: kartAfter.y - 30, width: 900, height: 320 } });

// Sol şerit R2 — gradient teyidi DOM'da computed style
const seritStyle = await page.evaluate(() => {
  const serit = document.querySelector('#evre-acilis .ocak-evre__serit');
  return getComputedStyle(serit).background;
});
console.log('R2 sol şerit gradient:', seritStyle.slice(0, 80) + (seritStyle.length > 80 ? '...' : ''));

// Mobil overflow
await ctx.close();
const mctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const mpage = await mctx.newPage();
await mpage.goto('http://localhost:4321/anadolu', { waitUntil: 'networkidle' });
const mInfo = await mpage.evaluate(() => ({
  cw: document.documentElement.clientWidth,
  htmlScrollW: document.documentElement.scrollWidth,
  bodyScrollW: document.body.scrollWidth,
}));
console.log('mobil overflow:', mInfo);
await browser.close();
console.log('done');
