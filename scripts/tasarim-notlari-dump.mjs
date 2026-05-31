/**
 * tasarim-notlari-dump.mjs — Sayfalar DB'sinden "Tasarım Notları" property'sini
 * her sayfa için stdout'a + scripts/tasarim-notlari-dump.txt'e basar. Tek seferlik
 * keşif aracı; build pipeline'ı kullanmaz. (#31 ara, Brief G.3 sonrası)
 *
 *   node --env-file=.env scripts/tasarim-notlari-dump.mjs
 */

import { Client } from '@notionhq/client';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_PATH = join(__dirname, 'tasarim-notlari-dump.txt');

const { NOTION_TOKEN, NOTION_PAGES_DB_ID } = process.env;
if (!NOTION_TOKEN || !NOTION_PAGES_DB_ID) {
  console.error('HATA: NOTION_TOKEN / NOTION_PAGES_DB_ID yok. --env-file=.env ile koş.');
  process.exit(1);
}

const notion = new Client({ auth: NOTION_TOKEN });

function richText(page, name) {
  const p = page.properties[name];
  if (p?.type === 'rich_text') return p.rich_text.map((t) => t.plain_text).join('');
  if (p?.type === 'title') return p.title.map((t) => t.plain_text).join('');
  return '';
}

const all = [];
let cursor;
do {
  const res = await notion.databases.query({
    database_id: NOTION_PAGES_DB_ID,
    start_cursor: cursor,
    page_size: 100,
  });
  for (const r of res.results) if ('properties' in r) all.push(r);
  cursor = res.has_more ? res.next_cursor : undefined;
} while (cursor);

const rows = all
  .map((p) => ({
    url: richText(p, 'URL').trim(),
    title: richText(p, 'Sayfa Başlığı').trim() || richText(p, 'Name').trim(),
    name: richText(p, 'Name').trim(),
    notlar: richText(p, 'Tasarım Notları').trim(),
  }))
  .filter((r) => r.url) // boş URL'lileri çıkar
  .sort((a, b) => a.url.localeCompare(b.url));

const lines = [];
for (const r of rows) {
  const title = r.title || r.name || '(başlıksız)';
  lines.push(`=== ${r.url} — ${title} ===`);
  lines.push('Tasarım Notları:');
  lines.push(r.notlar || '(boş)');
  lines.push('');
}

const out = lines.join('\n');
writeFileSync(OUT_PATH, out + '\n', 'utf-8');
console.log(out);
console.error(`\n→ Dosya: ${OUT_PATH}  (${rows.length} sayfa)`);
