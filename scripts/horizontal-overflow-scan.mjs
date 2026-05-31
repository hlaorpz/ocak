// Brief M tanı scripti — mobil viewport horizontal overflow taraması.
// Sayfa listesi: src/pages altındaki rotalar. Her sayfayı 390×844 iPhone
// viewport ile aç, document.documentElement.clientWidth'ten taşan elementleri
// (rect.right > clientWidth + EPS veya rect.left < -EPS) listele.
// KARAR 150 disiplini: DOM rect + screenshot (pixel ölçüm).

import { chromium, devices } from 'playwright';
import { mkdirSync } from 'node:fs';

const BASE = process.env.BASE_URL || 'http://localhost:4321';
const SHOTS = process.env.SHOTS_DIR || '/tmp/ocak-overflow-shots';
mkdirSync(SHOTS, { recursive: true });

const ROUTES = [
  '/',
  '/acik-kapi',
  '/advaita',
  '/anadolu',
  '/anadolu/basvuru',
  '/araclar',
  '/biz',
  '/bulusmalar',
  '/cember',
  '/ekip',
  '/felsefe',
  '/hikaye',
  '/iletisim',
  '/istanbul',
  '/mini-retreat',
  '/sen-neredesin',
  '/seremoni',
  '/site-rehber',
  '/takvim',
  '/workshop',
  '/yolculuk',
];
const EPS = 0.5;

const browser = await chromium.launch();
const ctx = await browser.newContext({
  ...devices['iPhone 13'],
});
const page = await ctx.newPage();

const allResults = [];

for (const route of ROUTES) {
  const url = BASE + route;
  try {
    const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    if (!resp || !resp.ok()) {
      allResults.push({ route, status: resp ? resp.status() : 'no response', overflows: [], err: 'bad-status' });
      continue;
    }
  } catch (e) {
    allResults.push({ route, overflows: [], err: String(e.message) });
    continue;
  }

  const data = await page.evaluate((EPS) => {
    const html = document.documentElement;
    const body = document.body;
    const cw = html.clientWidth;
    const scrollW = html.scrollWidth;
    const bodyScrollW = body.scrollWidth;
    const docOverflow = scrollW - cw;
    const all = document.querySelectorAll('*');
    const overflows = [];
    for (const el of all) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) continue;
      const overR = r.right - cw;
      const overL = -r.left;
      if (overR > EPS || overL > EPS) {
        const tag = el.tagName.toLowerCase();
        const id = el.id ? `#${el.id}` : '';
        const cls = (el.className && typeof el.className === 'string')
          ? '.' + el.className.trim().split(/\s+/).slice(0, 3).join('.')
          : '';
        const p = el.parentElement;
        const parentSel = p ? `${p.tagName.toLowerCase()}${p.id ? '#' + p.id : ''}${(p.className && typeof p.className === 'string') ? '.' + p.className.trim().split(/\s+/).slice(0, 2).join('.') : ''}` : '';
        overflows.push({
          sel: `${tag}${id}${cls}`,
          parent: parentSel,
          rect: { left: Math.round(r.left), right: Math.round(r.right), width: Math.round(r.width) },
          overR: Math.round(overR * 10) / 10,
          overL: Math.round(overL * 10) / 10,
        });
      }
    }
    overflows.sort((a, b) => Math.max(b.overR, b.overL) - Math.max(a.overR, a.overL));
    const meta = document.querySelector('meta[name="viewport"]');
    const viewportMeta = meta ? meta.getAttribute('content') : null;
    return { cw, scrollW, bodyScrollW, docOverflow, overflows: overflows.slice(0, 15), totalOver: overflows.length, viewportMeta };
  }, EPS);

  // Screenshot — pixel teyit (viewport, full değil)
  const shotPath = `${SHOTS}${route.replace(/\//g, '_') || '_root'}.png`;
  await page.screenshot({ path: shotPath, fullPage: false });

  allResults.push({ route, ...data, shot: shotPath });
}

await browser.close();

console.log('\n=== HORIZONTAL OVERFLOW SCAN (iPhone 13, 390×844) ===');
console.log(`BASE: ${BASE}\n`);
for (const r of allResults) {
  console.log(`--- ${r.route} ---`);
  if (r.err) {
    console.log(`  ERROR: ${r.err}`);
    continue;
  }
  const hasDocOver = r.docOverflow > 0 || r.bodyScrollW > r.cw;
  console.log(`  clientWidth=${r.cw}  htmlScrollW=${r.scrollW}  bodyScrollW=${r.bodyScrollW}  docOverflow=${r.docOverflow}px  ${hasDocOver ? '⚠ DOC OVERFLOW' : '✓ no doc overflow'}`);
  console.log(`  viewportMeta="${r.viewportMeta}"`);
  console.log(`  shot=${r.shot}`);
  if (r.totalOver === 0) {
    console.log('  ✓ Hiçbir element viewport\'tan taşmıyor.');
  } else {
    console.log(`  ⚠ ${r.totalOver} element taşıyor. Top ${r.overflows.length}:`);
    for (const o of r.overflows) {
      const dir = o.overR > o.overL ? `+${o.overR}px R` : `${-o.overL}px L`;
      console.log(`    [${dir}] ${o.sel}  (parent: ${o.parent})  rect L${o.rect.left}→R${o.rect.right} w${o.rect.width}`);
    }
  }
  console.log('');
}
