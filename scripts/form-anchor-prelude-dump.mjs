/**
 * form-anchor-prelude-dump.mjs — KARAR 151 diagnostic
 * Çember + Açık Kapı + İletişim sayfalarında `## section: form-anchor` markerından
 * ÖNCEKİ markdown içeriğini dump'lar. Tanı için.
 *
 *   node --experimental-strip-types --env-file=.env scripts/form-anchor-prelude-dump.mjs
 */

import { Client } from '@notionhq/client';
import { transformPage } from '../src/lib/notion-pages.ts';

const { NOTION_TOKEN, NOTION_PAGES_DB_ID } = process.env;
if (!NOTION_TOKEN || !NOTION_PAGES_DB_ID) {
  console.error('HATA: NOTION_TOKEN / NOTION_PAGES_DB_ID yok');
  process.exit(1);
}
const notion = new Client({ auth: NOTION_TOKEN });

const SLUGS = ['/cember', '/acik-kapi', '/iletisim'];

async function dumpFor(slug) {
  console.log('\n' + '='.repeat(72));
  console.log('### ' + slug);
  console.log('='.repeat(72));

  const res = await notion.databases.query({
    database_id: NOTION_PAGES_DB_ID,
    filter: { property: 'URL', rich_text: { equals: slug } },
  });
  const page = res.results.find((r) => 'properties' in r);
  if (!page) { console.log('YOK'); return; }
  const t = await transformPage(notion, page);
  if (!t) { console.log('transformPage null'); return; }

  const body = t.body;
  const lines = body.split('\n');

  // 1) Full section list with line numbers
  console.log('\n--- Section etiketleri (line# + name) ---');
  const sectionRe = /^##\s+section:\s*(.+?)\s*$/;
  const sectionIndices = [];
  lines.forEach((l, i) => {
    const m = l.match(sectionRe);
    if (m) sectionIndices.push({ line: i, name: m[1].trim() });
  });
  for (const s of sectionIndices) console.log(`  L${s.line.toString().padStart(4)}: ${s.name}`);

  // 2) For every form-anchor marker, dump preceding ~40 lines + 5 lines after
  const formAnchorLines = sectionIndices.filter((s) => s.name === 'form-anchor');
  console.log(`\nform-anchor marker sayısı: ${formAnchorLines.length}`);

  for (const fa of formAnchorLines) {
    console.log(`\n--- form-anchor @ L${fa.line} — preceding 40 lines + 5 after ---`);
    const start = Math.max(0, fa.line - 40);
    const end = Math.min(lines.length, fa.line + 6);
    for (let i = start; i < end; i++) {
      const prefix = i === fa.line ? '>>>>>' : '     ';
      console.log(`${prefix} L${i.toString().padStart(4)}: ${lines[i]}`);
    }
  }

  // 3) Notion blocks raw — check for divider blocks
  const blocks = [];
  let cursor;
  do {
    const r = await notion.blocks.children.list({ block_id: page.id, start_cursor: cursor });
    blocks.push(...r.results);
    cursor = r.has_more ? r.next_cursor : undefined;
  } while (cursor);

  console.log(`\n--- Notion block tip histogramı ---`);
  const hist = {};
  for (const b of blocks) hist[b.type] = (hist[b.type] ?? 0) + 1;
  for (const [t, c] of Object.entries(hist).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${t}: ${c}`);
  }

  console.log(`\n--- divider block'ları (varsa) ve form-anchor heading_2 etrafı ---`);
  // Find form-anchor heading_2 block(s); show ±5 neighbors
  function headingText(b) {
    if (b.type !== 'heading_2') return null;
    return b.heading_2?.rich_text?.map((t) => t.plain_text).join('') ?? '';
  }
  const blockIdxs = [];
  blocks.forEach((b, i) => {
    if (b.type === 'heading_2') {
      const t = headingText(b);
      if (t && /^section:\s*form-anchor\s*$/.test(t.trim())) blockIdxs.push(i);
    }
  });
  for (const idx of blockIdxs) {
    console.log(`\nform-anchor heading_2 @ block#${idx}; neighbors:`);
    const s = Math.max(0, idx - 8);
    const e = Math.min(blocks.length, idx + 3);
    for (let i = s; i < e; i++) {
      const b = blocks[i];
      const mark = i === idx ? '>>>>>' : '     ';
      let preview = '';
      const ttype = b.type;
      const rt = b[ttype]?.rich_text;
      if (Array.isArray(rt)) preview = rt.map((x) => x.plain_text).join('').slice(0, 120);
      else if (ttype === 'divider') preview = '─── (divider) ───';
      else if (ttype === 'table') preview = '(table)';
      else if (ttype === 'image') preview = '(image)';
      console.log(`${mark} #${i.toString().padStart(3)} [${ttype.padEnd(14)}] ${preview}`);
    }
  }
}

for (const slug of SLUGS) {
  await dumpFor(slug);
}
