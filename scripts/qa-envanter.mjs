// scripts/qa-envanter.mjs — 19 sayfa × 10 kategori dist analizi (#24 Brief 3a)
//                          + mobil breakpoint envanteri (#25 Brief A item 8)
// Kullanım: node scripts/qa-envanter.mjs                   → matris özeti (stderr) + JSON (stdout)
//          node scripts/qa-envanter.mjs > qa-out.json      → JSON dosyaya
// Lansman öncesi son QA pass + her büyük plugin/CSS değişikliği sonrası tekrar kullanılır.

import { readFile, readdir } from 'node:fs/promises';

const slugs = [
  '',
  'hikaye',
  'felsefe',
  'araclar',
  'sen-neredesin',
  'bulusmalar',
  'cember',
  'acik-kapi',
  'seremoni',
  'workshop',
  'istanbul',
  'mini-retreat',
  'takvim',
  'yolculuk',
  'anadolu',
  'biz',
  'advaita',
  'ekip',
  'iletisim',
];

const KNOWN_GOOD = new Set(
  slugs.map((s) => (s === '' ? '/' : `/${s}`)),
);

async function loadHtml(slug) {
  const path = slug === '' ? 'dist/index.html' : `dist/${slug}/index.html`;
  try {
    return await readFile(path, 'utf-8');
  } catch {
    return null;
  }
}

function analyze(html, slug) {
  if (!html) return { slug: slug || '/', missing: true };

  // 1. Markdown normalize gap — ham ** _ * çiftleri <p> içinde
  const rawMarkdownMatches = [
    ...html.matchAll(
      /<p[^>]*>[^<]*?(\*\*[^*<]+\*\*|__[^_<]+__|_[^_<\s][^_<]*_|\*[^*<\s][^*<]*\*)[^<]*?<\/p>/g,
    ),
  ];

  // 2. Data-section selectors dist'te
  const sections = [
    ...new Set([...html.matchAll(/data-section="([^"]+)"/g)].map((m) => m[1])),
  ];

  // 2b. Section pair envanteri (#31 Brief G ara — Item 11 zemin)
  // DOM sırasıyla ardışık <section data-section="X"> çiftleri.
  const sectionOrder = [...html.matchAll(/<section[^>]*data-section="([^"]+)"/g)].map((m) => m[1]);
  const sectionPairs = [];
  for (let i = 0; i < sectionOrder.length - 1; i++) {
    sectionPairs.push(`${sectionOrder[i]} → ${sectionOrder[i + 1]}`);
  }

  // 3. Overline ham text
  const rawOverlines = (html.match(/<p[^>]*>overline:/g) || []).length;

  // 4. Hero h1 (plugin output veya component) text
  const heroH1 = html.match(
    /<section[^>]*data-section="hero"[^>]*>[\s\S]*?<h1[^>]*>([\s\S]*?)<\/h1>/,
  );

  // 6. Bozuk linkler — Notion artığı, ham markdown char ile sarılı URL'ler
  // (build artifact'leri /favicon, /_ocak/, /_astro/ false positive sayma)
  const allHrefs = [...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
  const brokenLinks = allHrefs.filter((href) => {
    if (href.startsWith('#')) return false;
    if (href.startsWith('mailto:') || href.startsWith('tel:')) return false;
    if (href === '/') return false;
    // build artifact'ler
    if (href.startsWith('/favicon')) return false;
    if (href.startsWith('/_ocak/') || href.startsWith('/_astro/')) return false;
    // ham markdown char ile sarılı URL (Notion italik link artığı)
    if (/^[_*]/.test(href) || /[_*]$/.test(href)) return true;
    if (href.startsWith('http://') || href.startsWith('https://')) return false;
    // internal path — KNOWN_GOOD'da değilse şüpheli
    if (href.startsWith('/')) {
      const cleaned = href.split('#')[0].split('?')[0];
      return !KNOWN_GOOD.has(cleaned);
    }
    return true; // relative href
  });

  // 7. Form audit
  const forms = (html.match(/<form/g) || []).length;

  // 8. Component instance vs plugin emit
  const componentMarkers = {
    sonrakiBulusmaComponent: (html.match(/class="sonraki-bulusma"/g) || []).length,
    sonrakiBulusmaPlugin: (
      html.match(/<section[^>]*data-section="sonraki-bulusma"(?![^>]*"al-ol-ver-component")[^>]*>(?!<\/)/g) || []
    ).length,
    alOlVerComponent: (html.match(/class="al-ol-ver"/g) || []).length,
    sssInstance: (html.match(/class="sss"/g) || []).length,
    siradakiKapi: (html.match(/data-section="siradaki-kapi"/g) || []).length,
    heroCount: (html.match(/data-section="hero"/g) || []).length,
  };

  // 9. KARAR 87 sayfa-özel — alkimi sembolleri (/hikaye), em/strong yoğunluğu
  const alchemy = (html.match(/[☉☽⚹⚯☿♀♂⚸♁]/gu) || []).length;
  const emCount = (html.match(/<em>/g) || []).length;
  const strongCount = (html.match(/<strong>/g) || []).length;

  // 10. Atmosfer
  const atmosfer = {
    grain: html.includes('grain') || html.includes('feTurbulence'),
    mainElement: html.includes('id="main"') || html.includes('id=main'),
    oda: (html.match(/data-oda="([^"]+)"/g) || [])[0] || null,
  };

  return {
    slug: slug || '/',
    rawMarkdownGapCount: rawMarkdownMatches.length,
    rawMarkdownSamples: rawMarkdownMatches.slice(0, 3).map((m) =>
      m[0].slice(0, 100).replace(/\s+/g, ' '),
    ),
    sections: sections.sort(),
    sectionOrder,
    sectionPairs,
    rawOverlines,
    heroH1Text: heroH1 ? heroH1[1].slice(0, 60).replace(/\s+/g, ' ') : null,
    brokenLinkCount: brokenLinks.length,
    brokenLinkSamples: [...new Set(brokenLinks)].slice(0, 5),
    forms,
    components: componentMarkers,
    alchemy,
    emCount,
    strongCount,
    atmosfer,
  };
}

const results = [];
for (const slug of slugs) {
  const html = await loadHtml(slug);
  results.push(analyze(html, slug));
}

// Matris özeti stderr'e (tail ile rahat görüntü için)
console.error('\n=== MATRİS ÖZETİ ===');
console.error(
  'Slug                | RawMd | Ovr | Brk | Frm | EM  | Str | Alch | Sections',
);
console.error(
  '--------------------|-------|-----|-----|-----|-----|-----|------|---------',
);
for (const r of results) {
  if (r.missing) {
    console.error(`${(r.slug || '/').padEnd(20)}| MISSING`);
    continue;
  }
  const slug = (r.slug || '/').padEnd(20);
  const rawMd = String(r.rawMarkdownGapCount || 0).padStart(5);
  const ovl = String(r.rawOverlines || 0).padStart(3);
  const brk = String(r.brokenLinkCount || 0).padStart(3);
  const frm = String(r.forms || 0).padStart(3);
  const em = String(r.emCount || 0).padStart(3);
  const str = String(r.strongCount || 0).padStart(3);
  const alch = String(r.alchemy || 0).padStart(4);
  const sec = r.sections.length;
  console.error(`${slug}| ${rawMd} | ${ovl} | ${brk} | ${frm} | ${em} | ${str} | ${alch} | ${sec} unique`);
}

// ============================================================================
// MOBİL ENVANTERİ (#25 Brief A item 8) — CSS @media + clamp + sayfa kritik selectors
// ============================================================================

/** Bir CSS metnindeki @media kurallarını parse eder: { query, body, selectors } */
function parseMediaRules(css) {
  const rules = [];
  // @media QUERY { ... } — basit brace counting ile body'i çıkar
  const re = /@media\s+([^{]+)\{/g;
  let m;
  while ((m = re.exec(css)) !== null) {
    const query = m[1].trim();
    let depth = 1;
    const bodyStart = m.index + m[0].length;
    let i = bodyStart;
    while (i < css.length && depth > 0) {
      if (css[i] === '{') depth++;
      else if (css[i] === '}') depth--;
      i++;
    }
    const body = css.slice(bodyStart, i - 1);
    // İlk seviye selector'leri çıkar (nested @ veya nested rule'lara dalmadan)
    const selectors = [];
    const selRe = /([^{}@][^{}]*?)\{/g;
    let sm;
    while ((sm = selRe.exec(body)) !== null) {
      const sel = sm[1].trim().split(',').map((s) => s.trim()).filter(Boolean);
      selectors.push(...sel);
    }
    rules.push({ query, selectors: [...new Set(selectors)] });
  }
  return rules;
}

/** Bir CSS metnindeki clamp(min, pref, max) ifadelerini değerleriyle çıkarır. */
function parseClamps(css) {
  // clamp(...) — basit, ilk parantezi eşleştir
  const out = [];
  const re = /clamp\(\s*([^,]+),\s*([^,]+),\s*([^)]+)\)/g;
  let m;
  while ((m = re.exec(css)) !== null) {
    out.push({ min: m[1].trim(), pref: m[2].trim(), max: m[3].trim() });
  }
  return out;
}

/** Tüm CSS kaynaklarını (styles + components scoped <style>) topla. */
async function collectCssSources() {
  const sources = [];
  const styleFiles = ['atmosfer.css', 'global.css', 'tokens.css', 'reset.css'];
  for (const f of styleFiles) {
    try {
      sources.push({ file: `src/styles/${f}`, css: await readFile(`src/styles/${f}`, 'utf-8') });
    } catch {}
  }
  // Component scoped styles — .astro içindeki <style>...</style> blokları
  try {
    const comps = await readdir('src/components');
    for (const f of comps) {
      if (!f.endsWith('.astro')) continue;
      const text = await readFile(`src/components/${f}`, 'utf-8');
      const m = text.match(/<style[^>]*>([\s\S]*?)<\/style>/);
      if (m) sources.push({ file: `src/components/${f}`, css: m[1] });
    }
  } catch {}
  return sources;
}

const cssSources = await collectCssSources();
const mediaInventory = cssSources.map((src) => ({
  file: src.file,
  rules: parseMediaRules(src.css),
  clamps: parseClamps(src.css),
}));

// Per-sayfa kritik responsive markers (dist HTML'den çıkarılabilenler)
function pageResponsiveMarkers(html) {
  if (!html) return null;
  return {
    viewportMeta: /name="viewport"[^>]*content="[^"]*width=device-width/.test(html),
    navToggle: /class="nav__toggle"/.test(html),
    navMenu: /class="nav__menu"/.test(html),
    formCount: (html.match(/<form/g) || []).length,
    siradakiKapiGrid: (html.match(/data-section="siradaki-kapi"/g) || []).length,
    heroCount: (html.match(/data-section="hero"/g) || []).length,
  };
}

const mobileResults = [];
for (const slug of slugs) {
  const html = await loadHtml(slug);
  mobileResults.push({ slug: slug || '/', markers: pageResponsiveMarkers(html) });
}

// Sapma özeti
console.error('\n=== SİSTEMATİK SAPMA SAYIMLARI ===');
const totalRawMd = results.reduce((sum, r) => sum + (r.rawMarkdownGapCount || 0), 0);
const totalOvr = results.reduce((sum, r) => sum + (r.rawOverlines || 0), 0);
const totalBrk = results.reduce((sum, r) => sum + (r.brokenLinkCount || 0), 0);
const pagesWithRawMd = results.filter((r) => r.rawMarkdownGapCount > 0).length;
const pagesWithOvr = results.filter((r) => r.rawOverlines > 0).length;
const pagesWithBrk = results.filter((r) => r.brokenLinkCount > 0).length;
console.error(`Raw markdown gap: ${totalRawMd} hit / ${pagesWithRawMd} sayfa`);
console.error(`Ham overline: ${totalOvr} hit / ${pagesWithOvr} sayfa`);
console.error(`Bozuk link: ${totalBrk} hit / ${pagesWithBrk} sayfa`);

// ============================================================================
// SECTION PAIR ENVANTERİ (#31 Brief G ara — Brief G.2 commit 1 zemini)
// Eyeball "iki section arası çok boş" hissini sayısal kanıta dönüştürmek için
// her sayfada ardışık <section data-section="X" → Y> pair'leri toplanır.
// CSS computed margin/gap build-time'da yok — bu rapor pair frekansını verir,
// eyeball hangi pair'in spesifik gap kuralına ihtiyaç duyduğunu söyler.
// ============================================================================

console.error('\n=== SECTION PAIR ENVANTERİ ===');
const pairFreq = {};
const pairPages = {};
for (const r of results) {
  if (r.missing || !r.sectionPairs) continue;
  for (const pair of r.sectionPairs) {
    pairFreq[pair] = (pairFreq[pair] ?? 0) + 1;
    (pairPages[pair] ||= new Set()).add(r.slug);
  }
}
const sortedPairs = Object.entries(pairFreq).sort((a, b) => b[1] - a[1]);
console.error(`Toplam unique pair: ${sortedPairs.length}`);
console.error(`\nEn sık 10 pair (sayfa sayısı):`);
for (const [pair, count] of sortedPairs.slice(0, 10)) {
  console.error(`  ${pair.padEnd(50)} ${count} sayfa`);
}

console.error('\n=== SAYFA BAŞI SECTION ZİNCİRİ ===');
for (const r of results) {
  if (r.missing || !r.sectionOrder) continue;
  const slug = (r.slug || '/').padEnd(18);
  const chain = r.sectionOrder.join(' → ');
  console.error(`${slug} ${chain}`);
}

// ============================================================================
// MOBİL ENVANTERİ ÖZETİ — stderr (Brief 3a pattern: matris referans, eyeball'a girdi)
// ============================================================================

console.error('\n=== MOBİL @MEDIA ENVANTERİ ===');
console.error('Dosya                              | @media | clamp() | Breakpoint dağılımı');
console.error('-----------------------------------|--------|---------|-----------------------');
const bpAggregate = {};
let totalClamps = 0;
for (const inv of mediaInventory) {
  const file = inv.file.padEnd(35);
  const mediaCount = String(inv.rules.length).padStart(6);
  const clampCount = String(inv.clamps.length).padStart(7);
  // Breakpoint distribution: max-width / min-width / prefers-reduced-motion / diğer
  const bpDist = { mw: 0, miw: 0, prm: 0, other: 0 };
  for (const r of inv.rules) {
    if (/max-width/.test(r.query)) bpDist.mw++;
    else if (/min-width/.test(r.query)) bpDist.miw++;
    else if (/prefers-reduced-motion/.test(r.query)) bpDist.prm++;
    else bpDist.other++;
    // Aggregate exact breakpoint
    const px = r.query.match(/(?:max|min)-width\s*:\s*(\d+px)/);
    if (px) bpAggregate[px[1]] = (bpAggregate[px[1]] ?? 0) + 1;
  }
  totalClamps += inv.clamps.length;
  const distStr = `mw:${bpDist.mw} miw:${bpDist.miw} prm:${bpDist.prm} oth:${bpDist.other}`;
  console.error(`${file}| ${mediaCount} | ${clampCount} | ${distStr}`);
}
console.error(`\nToplam clamp(): ${totalClamps} (responsive font-size + spacing)`);
console.error(`Breakpoint kullanımı: ${Object.entries(bpAggregate).map(([k, v]) => `${k}=${v}`).join(', ')}`);

console.error('\n=== SAYFA-ÖZEL MOBİL MARKERS (dist) ===');
console.error('Slug                | viewport | navTgl | hero | siradakiKapi | form');
console.error('--------------------|----------|--------|------|--------------|-----');
for (const r of mobileResults) {
  if (!r.markers) {
    console.error(`${(r.slug || '/').padEnd(20)}| MISSING`);
    continue;
  }
  const slug = (r.slug || '/').padEnd(20);
  const vp = r.markers.viewportMeta ? '   ✓    ' : '   ✗    ';
  const nt = r.markers.navToggle ? '   ✓   ' : '   ✗   ';
  const hero = String(r.markers.heroCount).padStart(4);
  const sk = String(r.markers.siradakiKapiGrid).padStart(12);
  const frm = String(r.markers.formCount).padStart(4);
  console.error(`${slug}| ${vp} | ${nt} | ${hero} | ${sk} | ${frm}`);
}

// Sapma uyarıları
const missingViewport = mobileResults.filter((r) => r.markers && !r.markers.viewportMeta).map((r) => r.slug);
const missingNavToggle = mobileResults.filter((r) => r.markers && !r.markers.navToggle).map((r) => r.slug);
if (missingViewport.length) {
  console.error(`\n⚠️  viewport meta eksik: ${missingViewport.join(', ')}`);
}
if (missingNavToggle.length) {
  console.error(`⚠️  nav drawer toggle eksik (mobile menüsü çalışmaz): ${missingNavToggle.join(', ')}`);
}
if (!missingViewport.length && !missingNavToggle.length) {
  console.error(`\nMobil temel markers: tüm 19 sayfada viewport + navToggle ✓`);
}

// JSON tam çıktı stdout'a (envanter + mobil) — en sonda, tüm define'lar hazır
console.log(JSON.stringify({ pages: results, mobile: { mediaInventory, pages: mobileResults } }, null, 2));
