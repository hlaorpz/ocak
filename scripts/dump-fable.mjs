#!/usr/bin/env node
/**
 * dump-fable.mjs — Fable (Copywriter) launch öncesi bütünlük dump'ı.
 * Tek seferlik, brief-cc-fable-dump.md için üretildi (12 Tem 2026).
 * KARAR 355 ruhu: canlı prod build gerçeği = https://www.ocak.biz
 *
 *   node scripts/dump-fable.mjs
 *
 * Çıktı: repo kökünde ocak-site-dump-fable-YYYY-MM-DD.md (.gitignore ile korunur, tarih dinamik).
 */

import * as parse5 from 'parse5';
import { writeFile } from 'node:fs/promises';
import { execSync } from 'node:child_process';

const BASE_URL = 'https://www.ocak.biz';
const TODAY = new Date().toISOString().slice(0, 10);
const SHA = (() => {
  try {
    return execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
  } catch {
    return 'unknown';
  }
})();
const OUT_FULL = `ocak-site-dump-fable-${TODAY}.md`;
const OUT_EK = `ocak-site-dump-fable-ek-${TODAY}.md`;

// Ek mod: /sen-neredesin (esik-*), /anadolu (evre-*), /araclar (raf-*), /advaita (tasidigi-*).
// Kök neden ortak — script fix'i sonrası 4 sayfanın tam gövdeleri.
const EK_ROUTES = ['/sen-neredesin', '/anadolu', '/araclar', '/advaita'];

// Route sırası — nav mantığı (brief madde 6).
// Teknik hariç: /onizleme/*, /odeme/*, /api/*.
const ROUTES = [
  '/',
  '/hikaye',
  '/felsefe',
  '/biz',
  '/yolculuk',
  '/bulusmalar',
  // format sayfaları (yolculuk + seremoni hariç 5)
  '/sehir-aksami',
  '/mini-retreat',
  '/acik-kapi',
  '/atolye',
  '/cember',
  '/anadolu',
  '/seremoni',
  '/takvim',
  '/iletisim',
  // diğerleri
  '/sen-neredesin',
  '/advaita',
  '/adimiz',
  '/araclar',
  '/ekip',
  '/hakkimizda',
  '/site-rehber',
  '/iletisim/bize-yaz',
  '/anadolu/basvuru',
  '/etkinlik/ankara-aksami-08072026',
  '/etkinlik/bir-nefes-2026-07',
  '/etkinlik/istanbul-aksami-07072026',
  // kayıt sayfaları (form + içerik)
  '/yolculuk/kayit',
  '/seremoni/kayit',
  '/sehir-aksami/kayit',
  '/mini-retreat/kayit',
  '/acik-kapi/kayit',
  '/atolye/kayit',
  '/cember/kayit',
  // yasal
  '/gizlilik',
  '/mesafeli-satis',
  '/teslimat-iade',
];

const VURGU_LABEL = {
  'buyuk-vurgu': ' (ALTIN VURGU)',
  'manifesto-vurgu': ' (KÖZ GLYPH + KREM MANIFESTO)',
  'ic-ses': ' (KREM NEFES)',
};

// Top-level <details data-section> — grup adına göre etiket.
// KARAR 154/293/346: esikler/raflar/tasiyici accordion aileleri.
const DETAILS_GROUP_LABEL = {
  esikler: ' (EŞIK ▸)',
  raflar: ' (RAF ▸)',
  tasiyici: ' (TAŞIYICI ▸)',
  sss: ' (SSS ▸)',
};

// Top-level <article class="ocak-evre ocak-evre-*"> — Anadolu evre timeline (KARAR 200/291).
const EVRE_LABEL = ' (EVRE KARTI)';

// ---------- parse5 helpers ----------
function attr(node, name) {
  return node.attrs?.find((a) => a.name === name)?.value;
}
function tag(node) {
  return node.tagName;
}
function isText(node) {
  return node.nodeName === '#text';
}
function kids(node) {
  return node.childNodes ?? [];
}
function findAll(root, pred, out = []) {
  if (!root) return out;
  if (pred(root)) out.push(root);
  for (const c of kids(root)) findAll(c, pred, out);
  return out;
}
function findOne(root, pred) {
  if (!root) return null;
  if (pred(root)) return root;
  for (const c of kids(root)) {
    const r = findOne(c, pred);
    if (r) return r;
  }
  return null;
}

// ---------- text helpers ----------
function normalizeWs(s) {
  return s.replace(/[ \t\r\n]+/g, ' ').replace(/ /g, ' ').trim();
}
function wordCount(s) {
  return s.split(/\s+/).filter(Boolean).length;
}

// Inline text: <strong>→**, <em>→*, <br>→\n, <a>→ metin (link ayrı satır olarak block-level basılır)
function inlineText(node) {
  if (!node) return '';
  if (isText(node)) return node.value;
  const t = tag(node);
  if (!t) return kids(node).map(inlineText).join('');
  if (['script', 'style', 'svg', 'noscript'].includes(t)) return '';
  if (t === 'br') return '\n';
  if (t === 'strong' || t === 'b') {
    const inner = kids(node).map(inlineText).join('');
    const trimmed = inner.replace(/^\s+|\s+$/g, '');
    return trimmed ? `**${trimmed}**` : '';
  }
  if (t === 'em' || t === 'i') {
    const inner = kids(node).map(inlineText).join('');
    const trimmed = inner.replace(/^\s+|\s+$/g, '');
    return trimmed ? `*${trimmed}*` : '';
  }
  return kids(node).map(inlineText).join('');
}

function isCta(anchor, text) {
  if (text.includes('→') || text.includes('→')) return true;
  const cls = attr(anchor, 'class') || '';
  if (/\b(cta|buton|btn)\b/i.test(cls)) return true;
  return false;
}

// ---------- section/block extraction ----------
function extractBlocks(container) {
  const lines = [];
  let words = 0;

  const push = (s) => {
    if (s === '') {
      if (lines.length && lines[lines.length - 1] !== '') lines.push('');
    } else {
      lines.push(s);
    }
  };

  function processNode(node) {
    if (isText(node)) {
      const s = normalizeWs(node.value);
      if (s) {
        push(s);
        words += wordCount(s);
      }
      return;
    }
    const t = tag(node);
    if (!t) return;
    if (['script', 'style', 'noscript', 'svg', 'link', 'meta'].includes(t)) return;

    // Overline / eyebrow: class contains overline
    const cls = attr(node, 'class') || '';
    if (cls.split(/\s+/).some((c) => c.endsWith('__overline') || c === 'overline' || c.endsWith('-overline'))) {
      const s = normalizeWs(inlineText(node));
      if (s) {
        push(`[OVERLINE] ${s}`);
        words += wordCount(s);
      }
      return;
    }

    const m = t.match(/^h([1-5])$/);
    if (m) {
      const s = normalizeWs(inlineText(node));
      if (s) {
        push(`[H${m[1]}] ${s}`);
        words += wordCount(s);
      }
      return;
    }

    if (t === 'p') {
      const s = normalizeWs(inlineText(node));
      if (s) {
        push(s);
        words += wordCount(s);
      }
      // İç link/buton'ları paragraf sonrası block olarak da yaz
      const anchors = findAll(node, (n) => n.tagName === 'a');
      for (const a of anchors) {
        const text = normalizeWs(inlineText(a));
        const href = attr(a, 'href') || '';
        if (text && href && !href.startsWith('#')) {
          push(`  [${isCta(a, text) ? 'BUTON' : 'LINK'}] "${text}" → ${href}`);
        }
      }
      return;
    }

    if (t === 'ul' || t === 'ol') {
      for (const li of kids(node)) {
        if (tag(li) !== 'li') continue;
        const s = normalizeWs(inlineText(li));
        if (s) {
          push(`- ${s}`);
          words += wordCount(s);
        }
        const anchors = findAll(li, (n) => n.tagName === 'a');
        for (const a of anchors) {
          const text = normalizeWs(inlineText(a));
          const href = attr(a, 'href') || '';
          if (text && href && !href.startsWith('#')) {
            push(`  [${isCta(a, text) ? 'BUTON' : 'LINK'}] "${text}" → ${href}`);
          }
        }
      }
      return;
    }

    if (t === 'blockquote') {
      const s = normalizeWs(inlineText(node));
      if (s) {
        push(`> ${s}`);
        words += wordCount(s);
      }
      return;
    }

    if (t === 'button') {
      const s = normalizeWs(inlineText(node));
      if (s) push(`[BUTON] "${s}"`);
      return;
    }

    if (t === 'a') {
      // block-level bağımsız anchor
      const parentTag = node.parentNode?.tagName;
      if (parentTag === 'p' || parentTag === 'li') {
        // paragrafta ele alındı, atla
        return;
      }
      const text = normalizeWs(inlineText(node));
      const href = attr(node, 'href') || '';
      if (text && href && !href.startsWith('#')) {
        push(`[${isCta(node, text) ? 'BUTON' : 'LINK'}] "${text}" → ${href}`);
        words += wordCount(text);
      }
      return;
    }

    if (t === 'img') {
      const alt = attr(node, 'alt') || '';
      push(`[GÖRSEL: ${alt}]`);
      return;
    }

    if (t === 'details') {
      const summary = findOne(node, (n) => n.tagName === 'summary');
      if (summary) {
        const s = normalizeWs(inlineText(summary));
        if (s) {
          push(`[EŞIK ▸] ${s}`);
          words += wordCount(s);
        }
      }
      for (const c of kids(node)) {
        if (c.tagName === 'summary') continue;
        processNode(c);
      }
      return;
    }

    if (t === 'label') {
      const s = normalizeWs(inlineText(node));
      if (s) push(`[LABEL] ${s}`);
      return;
    }

    if (t === 'form') {
      push('[FORM ▸ başlangıç]');
      for (const c of kids(node)) processNode(c);
      push('[FORM ◂ son]');
      return;
    }

    if (t === 'figcaption') {
      const s = normalizeWs(inlineText(node));
      if (s) {
        push(`[FIGCAPTION] ${s}`);
        words += wordCount(s);
      }
      return;
    }

    // fallback: konteyner elementler (section, div, article, aside vb.) → recurse
    for (const c of kids(node)) processNode(c);
  }

  for (const c of kids(container)) processNode(c);
  return { lines: dedupBlanks(lines), words };
}

function dedupBlanks(lines) {
  const out = [];
  for (const l of lines) {
    if (l === '' && (out.length === 0 || out[out.length - 1] === '')) continue;
    out.push(l);
  }
  while (out.length && out[out.length - 1] === '') out.pop();
  return out;
}

// ---------- page extraction ----------
function firstText(node) {
  if (!node) return '';
  if (isText(node)) return node.value;
  for (const c of kids(node)) {
    const t = firstText(c);
    if (t) return t;
  }
  return '';
}

function extractPage(route, html) {
  const doc = parse5.parse(html);

  const titleEl = findOne(doc, (n) => n.tagName === 'title');
  const title = titleEl ? normalizeWs(firstText(titleEl)) : '';

  const metaEl = findOne(
    doc,
    (n) => n.tagName === 'meta' && attr(n, 'name') === 'description',
  );
  const desc = metaEl ? attr(metaEl, 'content') || '' : '';

  const main =
    findOne(doc, (n) => n.tagName === 'main') ||
    findOne(doc, (n) => n.tagName === 'body');

  const blocks = walkTopLevelBlocks(main);

  const parts = [];
  parts.push('=====================================================');
  parts.push(`ROUTE: ${route}`);
  parts.push(`TITLE: ${title}`);
  if (desc) parts.push(`META: ${desc}`);
  parts.push('=====================================================');
  parts.push('');

  let totalWords = 0;
  const vurgu = { 'buyuk-vurgu': 0, 'manifesto-vurgu': 0, 'ic-ses': 0 };
  const extra = { details: 0, evre: 0 };

  if (blocks.length === 0) {
    const { lines, words } = extractBlocks(main);
    parts.push('--- section: (sayfa gövdesi) ---');
    parts.push('');
    for (const l of lines) parts.push(l);
    parts.push('');
    parts.push(`(≈${words} kelime)`);
    parts.push('');
    totalWords = words;
  } else {
    for (const b of blocks) {
      parts.push(`--- section: ${b.name}${b.label} ---`);
      parts.push('');

      let bodyLines = [];
      let bodyWords = 0;

      if (b.type === 'details') {
        const summary = findOne(b.node, (n) => n.tagName === 'summary');
        const summaryText = summary ? normalizeWs(inlineText(summary)) : '';
        if (summaryText) {
          bodyLines.push(`[H3] ${summaryText}`);
          bodyWords += wordCount(summaryText);
        }
        const bodyContainer = { childNodes: kids(b.node).filter((c) => c.tagName !== 'summary') };
        const r = extractBlocks(bodyContainer);
        bodyLines = bodyLines.concat(r.lines);
        bodyWords += r.words;
        extra.details++;
      } else {
        const r = extractBlocks(b.node);
        bodyLines = r.lines;
        bodyWords = r.words;
        if (b.type === 'evre') extra.evre++;
      }

      for (const l of bodyLines) parts.push(l);
      parts.push('');
      parts.push(`(≈${bodyWords} kelime)`);
      parts.push('');
      totalWords += bodyWords;

      if (VURGU_LABEL[b.name]) vurgu[b.name]++;
    }
  }

  const vurguToplam = vurgu['buyuk-vurgu'] + vurgu['manifesto-vurgu'] + vurgu['ic-ses'];
  parts.push(
    `TOPLAM: ≈${totalWords} kelime · ${blocks.length || 1} blok · ${vurguToplam} vurgu bloğu` +
      (extra.details ? ` · ${extra.details} accordion` : '') +
      (extra.evre ? ` · ${extra.evre} evre kartı` : ''),
  );
  parts.push('');

  return {
    text: parts.join('\n'),
    stats: { route, title, words: totalWords, sections: blocks.length || 1, vurgu, extra },
  };
}

// main'in DIRECT children'ı: section[data-section] + details[data-section] + article.ocak-evre-*
function walkTopLevelBlocks(main) {
  const out = [];
  for (const c of kids(main)) {
    if (!c.tagName) continue;
    const dataSection = attr(c, 'data-section');
    if (c.tagName === 'section' && dataSection) {
      out.push({
        type: 'section',
        name: dataSection,
        label: VURGU_LABEL[dataSection] || '',
        node: c,
      });
    } else if (c.tagName === 'details' && dataSection) {
      const groupName = attr(c, 'name') || '';
      const label = DETAILS_GROUP_LABEL[groupName] || ' (▸)';
      out.push({ type: 'details', name: dataSection, label, node: c });
    } else if (c.tagName === 'article' && /\bocak-evre-([a-z-]+)/.test(attr(c, 'class') || '')) {
      const cls = attr(c, 'class') || '';
      const m = cls.match(/\bocak-evre-([a-z-]+)/);
      const evreAd = attr(c, 'data-evre') || (m ? m[1] : 'evre');
      out.push({ type: 'evre', name: `evre-${evreAd}`, label: EVRE_LABEL, node: c });
    }
  }
  return out;
}

function extractNav(html) {
  const doc = parse5.parse(html);
  const header =
    findOne(doc, (n) => n.tagName === 'header' && (attr(n, 'class') || '').split(/\s+/).includes('nav')) ||
    findOne(doc, (n) => n.tagName === 'nav');
  if (!header) return '';
  const { lines } = extractBlocks(header);
  return lines.join('\n');
}

function extractFooter(html) {
  const doc = parse5.parse(html);
  const footer = findOne(doc, (n) => n.tagName === 'footer');
  if (!footer) return '';
  const { lines } = extractBlocks(footer);
  return lines.join('\n');
}

async function fetchPage(route) {
  const url = BASE_URL + (route === '/' ? '' : route);
  const res = await fetch(url, {
    redirect: 'follow',
    headers: { 'User-Agent': 'Mozilla/5.0 (OCAK Fable-Dump/1.0)' },
  });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return { url, html: await res.text() };
}

// ---------- main ----------
async function main() {
  const isEk = process.argv.includes('--ek');
  const routes = isEk ? EK_ROUTES : ROUTES;
  const outFile = isEk ? OUT_EK : OUT_FULL;

  const out = [];
  if (isEk) {
    out.push('# OCAK Site İçerik Dump — Fable (EK) · Kayıp Gövdeler');
    out.push('');
    out.push(`**Tarih:** ${TODAY}`);
    out.push(`**Kaynak:** https://www.ocak.biz (canlı prod, sha=${SHA})`);
    out.push(`**Kapsam:** Ana dump'ta (${OUT_FULL}) gövdesi eksik çıkan 4 sayfa. Extractor jenerik fix'i sonrası tam gövdeleriyle.`);
    out.push('');
    out.push('**Fix özeti:** `main` altındaki top-level `<details data-section>` (esikler/raflar/tasiyici grupları) ve `<article class="ocak-evre-*">` düğümleri artık section muamelesi görüyor. Ana dump section wrapper altındaki `<details>`\'ler zaten geziliyordu; top-level olanlar sessizce kaybolmuştu.');
    out.push('');
  } else {
    out.push('# OCAK Site İçerik Dump — Fable (Copywriter) İncelemesi');
    out.push('');
    out.push(`**Tarih:** ${TODAY}`);
    out.push(`**Kaynak:** https://www.ocak.biz (canlı prod, sha=${SHA})`);
    out.push(
      '**Not:** Render edilmiş HTML\'den otomatik çıkarıldı. Section marker\'lar `data-section` attribute\'undan; vurgu blokları özel etiketle işaretli.',
    );
    out.push('');
  }
  out.push('**Etiket sözlüğü:**');
  out.push('- `[H1]`–`[H5]` başlık hiyerarşisi');
  out.push('- `[OVERLINE]` hero eyebrow');
  out.push('- `**...**` bold · `*...*` italik');
  out.push('- `[BUTON]` CTA · `[LINK]` metin içi link (href ile)');
  out.push('- `[GÖRSEL: alt]` görsel · `[EŞIK ▸]` accordion başlığı (section-içi)');
  out.push('- `[FORM ▸ başlangıç] / [FORM ◂ son]` form sınırı · `[LABEL]` form etiketi');
  out.push('- Section adı yanında:');
  out.push('  - `(ALTIN VURGU)` → buyuk-vurgu, `(KÖZ GLYPH + KREM MANIFESTO)` → manifesto-vurgu, `(KREM NEFES)` → ic-ses');
  out.push('  - `(EŞIK ▸)` → top-level esikler accordion · `(RAF ▸)` → raflar accordion · `(TAŞIYICI ▸)` → tasiyici accordion · `(SSS ▸)` → sss accordion');
  out.push('  - `(EVRE KARTI)` → Anadolu evre timeline article\'ı');
  out.push('');
  out.push('---');
  out.push('');

  const home = await fetchPage('/');

  if (!isEk) {
    const navText = extractNav(home.html);
    const footerText = extractFooter(home.html);
    out.push('=====================================================');
    out.push('SITE NAV (tek blok)');
    out.push('=====================================================');
    out.push('');
    out.push(navText);
    out.push('');
    out.push('=====================================================');
    out.push('SITE FOOTER (tek blok)');
    out.push('=====================================================');
    out.push('');
    out.push(footerText);
    out.push('');
    out.push('---');
    out.push('');
  }

  const allStats = [];
  for (const route of routes) {
    process.stderr.write(`  → ${route}\n`);
    try {
      const { html } = route === '/' ? home : await fetchPage(route);
      const { text, stats } = extractPage(route, html);
      out.push(text);
      allStats.push(stats);
    } catch (e) {
      out.push(`--- ROUTE HATA: ${route} — ${e.message} ---`);
      out.push('');
      allStats.push({ route, error: e.message });
    }
  }

  const okStats = allStats.filter((s) => !s.error);
  const totalWords = okStats.reduce((a, b) => a + (b.words || 0), 0);
  const totalVurgu = okStats.reduce(
    (acc, s) => ({
      'buyuk-vurgu': acc['buyuk-vurgu'] + (s.vurgu?.['buyuk-vurgu'] || 0),
      'manifesto-vurgu': acc['manifesto-vurgu'] + (s.vurgu?.['manifesto-vurgu'] || 0),
      'ic-ses': acc['ic-ses'] + (s.vurgu?.['ic-ses'] || 0),
    }),
    { 'buyuk-vurgu': 0, 'manifesto-vurgu': 0, 'ic-ses': 0 },
  );
  const totalExtra = okStats.reduce(
    (acc, s) => ({
      details: acc.details + (s.extra?.details || 0),
      evre: acc.evre + (s.extra?.evre || 0),
    }),
    { details: 0, evre: 0 },
  );
  const enUzun = [...okStats].sort((a, b) => b.words - a.words).slice(0, 5);

  out.push('=====================================================');
  out.push('KAPANIŞ ÖZETİ');
  out.push('=====================================================');
  out.push('');
  out.push(`Route sayısı: ${allStats.length} (başarılı: ${okStats.length}, hata: ${allStats.length - okStats.length})`);
  out.push(`Toplam kelime: ≈${totalWords}`);
  out.push(`Vurgu blokları: ALTIN=${totalVurgu['buyuk-vurgu']} · MANIFESTO=${totalVurgu['manifesto-vurgu']} · KREM NEFES=${totalVurgu['ic-ses']}`);
  out.push(`Ek yakalanan bloklar: ${totalExtra.details} accordion · ${totalExtra.evre} evre kartı`);
  out.push('');
  out.push('En uzun 5 sayfa:');
  for (const s of enUzun) {
    out.push(`  - ${s.route} → ≈${s.words} kelime`);
  }
  out.push('');
  if (allStats.length - okStats.length > 0) {
    out.push('Hatalı route\'lar:');
    for (const s of allStats.filter((x) => x.error)) {
      out.push(`  - ${s.route} → ${s.error}`);
    }
    out.push('');
  }

  await writeFile(outFile, out.join('\n'), 'utf8');
  process.stderr.write(
    `\n✔ Yazıldı: ${outFile} (${allStats.length} route, ≈${totalWords} kelime)\n`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
