import { chromium } from 'playwright';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
await page.goto('http://localhost:4321/anadolu', { waitUntil: 'networkidle' });
await page.screenshot({ path: '/tmp/anadolu-full.png', fullPage: true });
// Harita kırpık
const harita = await page.$('.anadolu-harita');
if (harita) await harita.screenshot({ path: '/tmp/anadolu-harita-only.png' });
await ctx.close();
const mctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const mpage = await mctx.newPage();
await mpage.goto('http://localhost:4321/anadolu', { waitUntil: 'networkidle' });
const mInfo = await mpage.evaluate(() => ({
  cw: document.documentElement.clientWidth,
  htmlScrollW: document.documentElement.scrollWidth,
  bodyScrollW: document.body.scrollWidth,
}));
console.log('mobile overflow:', mInfo);
const mharita = await mpage.$('.anadolu-harita');
if (mharita) await mharita.screenshot({ path: '/tmp/anadolu-harita-mobile.png' });
await browser.close();
console.log('done');
