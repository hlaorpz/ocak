// Mobil horizontal overflow — İKİ MODLU regresyon scan (iPhone 13, 390×844).
// KARAR 150 (DOM rect + screenshot) + KARAR 187 (docOverflow=0) + KARAR ADAYI 363
// (overflow:hidden layout extent'i silmez, clip siler; sahte güvenlik ağı yasağı).
//
// Mod A — assert: fix açık → docOverflow === 0 tüm rotalarda.
//         Baseline test; body/html { overflow-x: clip } clip'liyor mu?
//
// Mod B — snapshot: html + body overflow'unu inline+!important sıfırla,
//         "ham layout extent"i ölç. Bu, clip'in altında ne kadar taşma
//         maskeleniyor gösterir. İzinli tek suçlu: hero glow (1100px
//         dekoratif — brief-hero-v2 bilinçli genişletme). Listeye yeni
//         isim girerse REGRESSION.
//         Neden gerek: Mod A tek başına yalan yeşilin kapısıdır — clip
//         yeni bir taşmayı sessizce yutabilir, gelecekte 2dea189 pattern'i
//         tekrarlanır.

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
  '/sehir-aksami',
  '/mini-retreat',
  '/sen-neredesin',
  '/seremoni',
  '/site-rehber',
  '/takvim',
  '/atolye',
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
    // === Ortak — element taşma toplayıcı (mod-agnostik) ===
    // heroOnly=true: sadece [data-section="hero"] descendant'ı (+ honeypot)
    //   suspect'leri raporla. Mod B için — clip kaldırıldığında body doğal
    //   genişler, position:fixed / width:100% elementler (nav, grain-overlay,
    //   wa-yuzen) body-relative doğal olarak "genişleyen" body'ye eşleşir.
    //   Suçlu değildirler; body'yi ITEN element hero glow'dur. Bu yüzden
    //   Mod B'de sadece hero descendant + honeypot izleniyor.
    // eps ARGÜMAN olarak alınıyor — closure üzerinden değil (Playwright
    // page.evaluate serialization edge case'i).
    function collect(cw, eps, { heroOnly = false } = {}) {
      const all = document.querySelectorAll('*');
      const overflows = [];
      for (const el of all) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) continue;
        const overR = r.right - cw;
        const overL = -r.left;
        if (overR > eps || overL > eps) {
          if (heroOnly) {
            const inHero = !!el.closest('[data-section="hero"]');
            const isHoneypot = el.classList && el.classList.contains('hp-field');
            if (!inHero && !isHoneypot) continue;
          }
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
      return overflows;
    }

    const html = document.documentElement;
    const body = document.body;
    const meta = document.querySelector('meta[name="viewport"]');
    const viewportMeta = meta ? meta.getAttribute('content') : null;

    // === Mod A — assert: mevcut CSS aynen (clip aktif) ===
    // Kriter: documentElement.scrollWidth === clientWidth (iOS Safari
    // zoom-out'un dayandığı ölçüt, KARAR 187 disiplini).
    const cwA = html.clientWidth;
    const scrollWA = html.scrollWidth;
    const bodyScrollWA = body.scrollWidth;
    const docOverflowA = scrollWA - cwA;
    const overflowsA = collect(cwA, EPS);

    // === Mod B — snapshot: overflow'u sıfırla, ham layout extent ölç ===
    const style = document.createElement('style');
    style.id = 'overflow-scan-mode-b';
    style.textContent = `
      html { overflow-x: visible !important; overflow-y: visible !important; }
      body { overflow-x: visible !important; overflow-y: visible !important; }
    `;
    document.head.appendChild(style);
    html.style.setProperty('overflow-x', 'visible', 'important');
    html.style.setProperty('overflow-y', 'visible', 'important');
    body.style.setProperty('overflow-x', 'visible', 'important');
    body.style.setProperty('overflow-y', 'visible', 'important');
    void html.offsetWidth; // reflow

    const cwB = html.clientWidth;
    const scrollWB = html.scrollWidth;
    const bodyScrollWB = body.scrollWidth;
    const docOverflowB = scrollWB - cwB;
    // Mod B: hero descendant + honeypot ile sınırlı — asıl body'yi iten
    // katmanları izle, body-relative doğal genişlemeyi false-positive'e alma.
    const overflowsB = collect(cwB, EPS, { heroOnly: true });

    // Pseudo tarama — ::before/::after `getBoundingClientRect` DÖNMEZ,
    // sadece DOM taraması yaparsak plugin emit hero sayfalarındaki
    // (`[data-section="hero"]::after` — 1100px glow) kaçar. KARAR 150
    // dersi verbatim: DOM ölçümü ≠ render gerçeği. Kural: hero descendant
    // section'lar üzerinde ::before/::after computed width > cwB ise
    // suspect. Sadece px-sabit width'ler (%, calc, min() değil).
    const pseudos = [];
    const sections = [...document.querySelectorAll('[data-section="hero"], [data-section="hero"] *')];
    for (const el of sections) {
      for (const pseudo of ['::before', '::after']) {
        const cs = getComputedStyle(el, pseudo);
        if (!cs.content || cs.content === 'none' || cs.content === 'normal') continue;
        const wStr = cs.width;
        const mPx = wStr.match(/^(\d+(?:\.\d+)?)px$/);
        if (!mPx) continue;
        const wPx = parseFloat(mPx[1]);
        if (wPx > cwB + EPS) {
          const tag = el.tagName.toLowerCase();
          const ds = el.getAttribute('data-section');
          const cls = (el.className && typeof el.className === 'string')
            ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.')
            : '';
          pseudos.push({
            sel: `${tag}${ds ? '[data-section="' + ds + '"]' : ''}${cls}${pseudo}`,
            width: wPx,
            over: Math.round((wPx - cwB) * 10) / 10,
          });
        }
      }
    }

    // cleanup
    style.remove();
    html.style.removeProperty('overflow-x');
    html.style.removeProperty('overflow-y');
    body.style.removeProperty('overflow-x');
    body.style.removeProperty('overflow-y');

    return {
      viewportMeta,
      modeA: { cw: cwA, scrollW: scrollWA, bodyScrollW: bodyScrollWA, docOverflow: docOverflowA, overflows: overflowsA.slice(0, 15), totalOver: overflowsA.length },
      modeB: { cw: cwB, scrollW: scrollWB, bodyScrollW: bodyScrollWB, docOverflow: docOverflowB, overflows: overflowsB.slice(0, 15), totalOver: overflowsB.length, pseudos },
    };
  }, EPS);

  // Screenshot — pixel teyit (viewport, full değil)
  const shotPath = `${SHOTS}${route.replace(/\//g, '_') || '_root'}.png`;
  await page.screenshot({ path: shotPath, fullPage: false });

  allResults.push({ route, ...data, shot: shotPath });
}

await browser.close();

// İzinli Mod B suspect'leri — brief-hero-v2 bilinçli dekoratif taşma.
// Bu whitelist DAR tutulmalı; yeni eklemeler ancak KARAR ile yapılır.
// Kural: sel içinde şu token'lardan biri geçmeli.
const MODE_B_ALLOWED = [
  'hero__glow',      // Hero.astro component (1100px dekoratif — brief-hero-v2)
  'hp-field',        // KARAR 152 honeypot — position:absolute; left:-9999px
];
// Pseudo taşması için ayrı whitelist (getComputedStyle tarama, DOM'da rect yok).
// Her giriş bir "token dizisi" — selector'da tüm token'lar geçmeli match için.
// Bu, `.hero` class'ı arada olan ("section[data-section=..].hero::after") ile
// pluginin direkt "[data-section=..]::after"in ikisini de kabul eder.
const MODE_B_ALLOWED_PSEUDOS = [
  ['[data-section="hero"]', '::after'],  // Hero.astro + plugin remark glow (1100px)
];

console.log('\n=== HORIZONTAL OVERFLOW SCAN (iPhone 13, 390×844, İKİ MODLU) ===');
console.log(`BASE: ${BASE}`);
console.log(`Mod A (assert):   docOverflow === 0 tüm rotalarda (clip aktif).`);
console.log(`Mod B (snapshot): overflow sıfır → ham extent + izinli suspect kontrolü.`);
console.log(`Mod B whitelist:  ${MODE_B_ALLOWED.join(', ')}\n`);

let modeAFail = 0;
let modeBFail = 0;

for (const r of allResults) {
  console.log(`--- ${r.route} ---`);
  if (r.err) {
    console.log(`  ERROR: ${r.err}`);
    continue;
  }
  console.log(`  viewportMeta="${r.viewportMeta}"`);
  console.log(`  shot=${r.shot}`);

  // --- Mod A ---
  // Assert kriteri: documentElement.scrollWidth === clientWidth. iOS Safari
  // pinch-zoom-out kararını buna göre veriyor. Body/element level
  // getBoundingClientRect Mod B'de değerlendirilir.
  const A = r.modeA;
  const aOK = A.docOverflow === 0;
  console.log(`  [Mod A / assert]  cw=${A.cw}  scrollW=${A.scrollW}  bodyScrollW=${A.bodyScrollW}  docOverflow=${A.docOverflow}px  ${aOK ? '✓ PASS' : '✗ FAIL'}`);
  if (!aOK) {
    modeAFail++;
    for (const o of A.overflows.slice(0, 5)) {
      const dir = o.overR > o.overL ? `+${o.overR}px R` : `${-o.overL}px L`;
      console.log(`    [${dir}] ${o.sel}  (parent: ${o.parent})  rect L${o.rect.left}→R${o.rect.right} w${o.rect.width}`);
    }
  }

  // --- Mod B ---
  const B = r.modeB;
  const unauthorized = B.overflows.filter(o => {
    const s = o.sel.toLowerCase();
    return !MODE_B_ALLOWED.some(a => s.includes(a.toLowerCase()));
  });
  const unauthorizedPseudos = (B.pseudos || []).filter(p => {
    const s = p.sel.toLowerCase();
    return !MODE_B_ALLOWED_PSEUDOS.some(tokens => tokens.every(t => s.includes(t.toLowerCase())));
  });
  const bOK = unauthorized.length === 0 && unauthorizedPseudos.length === 0;
  const pseudoCount = (B.pseudos || []).length;
  console.log(`  [Mod B / snapshot] cw=${B.cw}  scrollW=${B.scrollW}  docOverflow=${B.docOverflow}px  DOM=${B.totalOver}  pseudo=${pseudoCount}  unauthorized=${unauthorized.length + unauthorizedPseudos.length}  ${bOK ? '✓ PASS (sadece whitelist)' : '✗ REGRESSION'}`);
  if (!bOK) {
    modeBFail++;
    console.log(`    ⚠ İzinsiz suspect(ler) — whitelist'te değil:`);
    for (const o of unauthorized.slice(0, 8)) {
      const dir = o.overR > o.overL ? `+${o.overR}px R` : `${-o.overL}px L`;
      console.log(`      [DOM ${dir}] ${o.sel}  (parent: ${o.parent})  rect L${o.rect.left}→R${o.rect.right} w${o.rect.width}`);
    }
    for (const p of unauthorizedPseudos.slice(0, 8)) {
      console.log(`      [PSEUDO +${p.over}px] ${p.sel}  width=${p.width}px`);
    }
  }
  console.log('');
}

const totalRoutes = allResults.filter(r => !r.err).length;
console.log(`=== SONUÇ ===`);
console.log(`Toplam rota: ${totalRoutes}  |  Mod A fail: ${modeAFail}  |  Mod B fail: ${modeBFail}`);
if (modeAFail > 0 || modeBFail > 0) {
  process.exit(1);
}
