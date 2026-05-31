/**
 * notion-section-envanter.mjs — Brief F.5 Adım 0 (Sohbet #29)
 *
 * 20 Notion sayfasından raw section envanteri:
 *   (a) form-anchor — sayı + sıra + kontekst → registry array vs scalar kararı
 *   (b) mini-cta    — slug × ✓/✗ matrisi
 *   (c) buyuk-vurgu — defansif tarama (lansmanda yok beklentisi)
 *   + Tam section haritası (debug)
 *
 * KARAR 102 ruhu 5. tatbik — kalıcı, her Notion içerik turundan sonra koşulur.
 *
 * Çalıştır:
 *   node --env-file=.env scripts/notion-section-envanter.mjs
 *   node --env-file=.env scripts/notion-section-envanter.mjs --json
 *
 * Gerekli env: NOTION_TOKEN, NOTION_PAGES_DB_ID (a.k.a. NOTION_SAYFALAR_DB_ID).
 */

import { Client } from '@notionhq/client';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const JSON_OUT = join(__dirname, 'notion-section-envanter.json');

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const NOTION_PAGES_DB_ID = process.env.NOTION_PAGES_DB_ID ?? process.env.NOTION_SAYFALAR_DB_ID;

if (!NOTION_TOKEN || !NOTION_PAGES_DB_ID) {
  console.error('HATA: NOTION_TOKEN / NOTION_PAGES_DB_ID yok. node --env-file=.env ... ile koş.');
  process.exit(1);
}

const wantJson = process.argv.includes('--json');
const notion = new Client({ auth: NOTION_TOKEN });

const SECTION_RE = /^##\s+section:\s+(.+?)\s*$/;
const LOOSE_SECTION_RE = /^(#{1,6})\s+section:\s+(.+?)\s*$/;

/** Notion call'u 429 retry ile sar (exponential backoff: 1s, 2s, 4s). */
async function withRetry(label, fn) {
  const delays = [1000, 2000, 4000];
  let lastErr;
  for (let attempt = 0; attempt <= delays.length; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      const status = err?.status ?? err?.code;
      const retriable = status === 429 || status === 'rate_limited' || status === 'conflict_error';
      if (!retriable || attempt === delays.length) throw err;
      const wait = delays[attempt];
      console.warn(`⚠️  ${label}: ${status} — ${wait}ms sonra retry`);
      await new Promise((r) => setTimeout(r, wait));
    }
  }
  throw lastErr;
}

/** Tüm sayfaları paginated çek — FILTER YOK (taslak dahil ground-truth). */
async function fetchAllPages() {
  const pages = [];
  let cursor;
  do {
    const res = await withRetry('databases.query', () =>
      notion.databases.query({ database_id: NOTION_PAGES_DB_ID, start_cursor: cursor, page_size: 100 }),
    );
    pages.push(...res.results.filter((r) => 'properties' in r));
    cursor = res.has_more ? res.next_cursor : undefined;
  } while (cursor);
  return pages;
}

/** Bir sayfanın tüm top-level bloklarını sırasıyla döndürür. */
async function fetchBlocks(pageId) {
  const blocks = [];
  let cursor;
  do {
    const res = await withRetry(`blocks.children.list(${pageId.slice(0, 8)})`, () =>
      notion.blocks.children.list({ block_id: pageId, start_cursor: cursor, page_size: 100 }),
    );
    blocks.push(...res.results);
    cursor = res.has_more ? res.next_cursor : undefined;
  } while (cursor);
  return blocks;
}

function richTextProp(page, name) {
  const p = page.properties[name];
  if (!p) return '';
  if (p.type === 'rich_text') return p.rich_text.map((t) => t.plain_text).join('').trim();
  if (p.type === 'title') return p.title.map((t) => t.plain_text).join('').trim();
  return '';
}
function selectProp(page, name) {
  const p = page.properties[name];
  return p?.type === 'select' ? p.select?.name ?? null : null;
}
function checkboxProp(page, name) {
  const p = page.properties[name];
  return p?.type === 'checkbox' ? !!p.checkbox : false;
}

/** Bir blok'tan section adı çıkarır (heading_2 + paragraph kapsamlı). */
function sectionNameFromBlock(block, warnings) {
  let text;
  if (block.type === 'heading_2') {
    text = block.heading_2.rich_text.map((t) => t.plain_text).join('').trim();
  } else if (block.type === 'paragraph') {
    text = block.paragraph.rich_text.map((t) => t.plain_text).join('').trim();
  } else {
    return null;
  }
  if (!text) return null;
  const m = text.match(SECTION_RE);
  if (m) return m[1].trim();
  // Defansif: # section: veya ### section: (heading sapması)
  const loose = text.match(LOOSE_SECTION_RE);
  if (loose && loose[1] !== '##') {
    warnings.push(`heading sapması: "${text}" (depth ${loose[1].length})`);
  }
  return null;
}

async function buildPageEnvanter(page) {
  const slug = richTextProp(page, 'URL') || '(slug yok)';
  const title = richTextProp(page, 'Sayfa Başlığı') || '(başlıksız)';
  const durum = selectProp(page, 'Durum');
  const yayinla = checkboxProp(page, 'Yayınla');

  const warnings = [];
  let blocks = [];
  try {
    blocks = await fetchBlocks(page.id);
  } catch (err) {
    console.warn(`⚠️  ${slug}: blok çekilemedi — ${err.body?.message ?? err.message ?? err}`);
    return { slug, title, durum, yayinla, sections: [], warnings: ['blok fetch hatası'] };
  }

  const sections = [];
  for (const b of blocks) {
    const name = sectionNameFromBlock(b, warnings);
    if (name) sections.push({ index: sections.length + 1, name });
  }
  return { slug, title, durum, yayinla, sections, warnings };
}

function pad(s, n) {
  const str = String(s ?? '');
  return str.length >= n ? str : str + ' '.repeat(n - str.length);
}

function sortPages(pages) {
  return [...pages].sort((a, b) => a.slug.localeCompare(b.slug, 'tr'));
}

function printFormAnchor(pages) {
  console.log('=== (a) Form-Anchor Envanteri ===');
  const rows = pages.map((p) => {
    const anchors = p.sections.filter((s) => s.name === 'form-anchor');
    return { p, anchors };
  });
  const totalPages = rows.filter((r) => r.anchors.length > 0).length;
  const totalAnchors = rows.reduce((sum, r) => sum + r.anchors.length, 0);
  console.log(`Toplam: ${totalPages} sayfada ${totalAnchors} anchor`);
  console.log('');

  for (const { p, anchors } of rows) {
    if (anchors.length === 0) continue;
    const parts = anchors.map((a) => {
      const prev = p.sections[a.index - 2]?.name ?? '∅';
      const next = p.sections[a.index]?.name ?? '∅';
      return `sıra ${a.index} — ${prev} sonrası, ${next} öncesi`;
    });
    console.log(`${pad(p.slug, 24)} : ${anchors.length} anchor [${parts.join(' | ')}]`);
  }
  console.log('');

  const multi = rows.filter((r) => r.anchors.length > 1);
  if (multi.length > 0) {
    const list = multi.map((r) => `${r.p.slug} (${r.anchors.length})`).join(', ');
    console.log(`**Çoklu anchor:** ${list} — registry array desteği gerekli.`);
  } else {
    console.log('**Çoklu anchor:** yok — scalar registry yeterli (KARAR 125 ilk plan).');
  }
  const orphan = pages.filter((p) => p.sections.every((s) => s.name !== 'form-anchor'));
  if (orphan.length > 0) {
    console.log(`**Anchor'sız sayfa:** ${orphan.map((p) => p.slug).join(', ')}`);
  }
  console.log('');
}

function printMiniCta(pages) {
  console.log('=== (b) Mini-CTA Envanteri ===');
  let count = 0;
  for (const p of pages) {
    const has = p.sections.some((s) => s.name === 'mini-cta');
    if (has) count++;
    console.log(`${pad(p.slug, 24)} : ${has ? '✓' : '✗'}`);
  }
  console.log(`Toplam: ${count} sayfada mini-cta var.`);
  console.log('');
}

function printBuyukVurgu(pages) {
  console.log('=== (c) Buyuk-Vurgu Envanteri ===');
  const rows = pages
    .map((p) => ({ p, n: p.sections.filter((s) => s.name === 'buyuk-vurgu').length }))
    .filter((r) => r.n > 0);
  if (rows.length === 0) {
    console.log('(boş — lansmanda yok beklentisi karşılandı)');
  } else {
    for (const { p, n } of rows) {
      console.log(`${pad(p.slug, 24)} : ${n}`);
    }
  }
  console.log('');
}

function printSectionMap(pages) {
  console.log('=== Tam Section Haritası (debug) ===');
  for (const p of pages) {
    const yayMark = p.yayinla ? '✓' : '✗';
    console.log(`${p.slug}  (${p.title} · ${p.durum ?? '∅'} · Yayınla ${yayMark})`);
    if (p.sections.length === 0) {
      console.log('   (section yok)');
    } else {
      for (const s of p.sections) console.log(`   ${s.index}. ${s.name}`);
    }
    if (p.warnings.length > 0) {
      for (const w of p.warnings) console.log(`   ⚠ ${w}`);
    }
    console.log('');
  }
}

async function main() {
  const generatedAt = new Date().toISOString();
  console.log('=== Sohbet #29 Adım 0: Notion Section Envanteri ===');

  const rawPages = await fetchAllPages();
  const envanter = [];
  for (const p of rawPages) {
    envanter.push(await buildPageEnvanter(p));
  }
  const pages = sortPages(envanter);
  const totalSections = pages.reduce((sum, p) => sum + p.sections.length, 0);
  console.log(`Sayfa: ${pages.length} · Toplam section: ${totalSections} · Üretildi: ${generatedAt}`);
  console.log('');

  printFormAnchor(pages);
  printMiniCta(pages);
  printBuyukVurgu(pages);
  printSectionMap(pages);

  if (wantJson) {
    const payload = {
      generatedAt,
      pages: pages.map((p) => ({
        slug: p.slug,
        title: p.title,
        status: p.durum,
        yayinla: p.yayinla,
        sections: p.sections,
      })),
    };
    writeFileSync(JSON_OUT, JSON.stringify(payload, null, 2));
    console.log(`→ JSON dump yazıldı: ${JSON_OUT}`);
  }
}

main().catch((err) => {
  console.error('Envanter hatası:', err.body ?? err.message ?? err);
  process.exit(1);
});
