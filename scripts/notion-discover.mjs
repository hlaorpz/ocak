/**
 * notion-discover.mjs — Notion şema + örnek veri keşif aracı (Sohbet #22, Brief 1)
 *
 * KARAR 97 token disiplini: değerleri stdout'a basmaz, sadece şema/yapı çıkarır.
 * Kalıcı araç — Notion şemasında sapma kontrolü için sonraki turlarda tekrar koşulur.
 *
 * Çalıştır:  node --env-file=.env scripts/notion-discover.mjs
 * Gerekli env: NOTION_TOKEN, NOTION_PAGES_DB_ID, NOTION_EVENTS_DB_ID
 *
 * Çıktı: stdout + .claude/notes.md'ye "## Notion Keşfi" bölümü append.
 */

import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';
import { appendFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const NOTES_PATH = join(__dirname, '..', '.claude', 'notes.md');

const { NOTION_TOKEN, NOTION_PAGES_DB_ID, NOTION_EVENTS_DB_ID } = process.env;

for (const [k, v] of Object.entries({ NOTION_TOKEN, NOTION_PAGES_DB_ID, NOTION_EVENTS_DB_ID })) {
  if (!v) {
    console.error(`HATA: ${k} env değişkeni tanımlı değil. node --env-file=.env ile koş.`);
    process.exit(1);
  }
}

const notion = new Client({ auth: NOTION_TOKEN });
const n2m = new NotionToMarkdown({ notionClient: notion });

/** Bir buffer'a hem stdout'a basar hem notes append'i için biriktirir. */
const buf = [];
function out(line = '') {
  console.log(line);
  buf.push(line);
}

/** Bir property tanımından option isimlerini (varsa) çıkarır. */
function optionsOf(prop) {
  if (prop.type === 'select') return prop.select.options.map((o) => o.name);
  if (prop.type === 'multi_select') return prop.multi_select.options.map((o) => o.name);
  if (prop.type === 'status') return prop.status.options.map((o) => o.name);
  return null;
}

/** Bir DB'nin property şemasını markdown tablosu olarak basar. */
async function dumpSchema(label, dbId) {
  out(`### ${label} DB — property şeması`);
  out('');
  const db = await notion.databases.retrieve({ database_id: dbId });
  out(`DB başlığı: ${db.title?.map((t) => t.plain_text).join('') || '(boş)'}`);
  out('');
  out('| Ad | Tip | Options (varsa) |');
  out('| --- | --- | --- |');
  const entries = Object.entries(db.properties).sort((a, b) => a[0].localeCompare(b[0], 'tr'));
  for (const [name, prop] of entries) {
    const opts = optionsOf(prop);
    out(`| ${name} | ${prop.type} | ${opts ? opts.join(', ') : ''} |`);
  }
  out('');
  return db;
}

/** Bir sayfanın tüm property değerlerini düz metne indirger (token-safe: yapı, değer içerik). */
function readableProps(page) {
  const lines = [];
  for (const [name, prop] of Object.entries(page.properties)) {
    let val;
    switch (prop.type) {
      case 'title': val = prop.title.map((t) => t.plain_text).join(''); break;
      case 'rich_text': val = prop.rich_text.map((t) => t.plain_text).join(''); break;
      case 'select': val = prop.select?.name ?? '∅'; break;
      case 'multi_select': val = prop.multi_select.map((s) => s.name).join(', ') || '∅'; break;
      case 'status': val = prop.status?.name ?? '∅'; break;
      case 'url': val = prop.url ?? '∅'; break;
      case 'email': val = prop.email ?? '∅'; break;
      case 'number': val = prop.number ?? '∅'; break;
      case 'checkbox': val = String(prop.checkbox); break;
      case 'date': val = prop.date ? JSON.stringify(prop.date) : '∅'; break;
      case 'files': val = `${prop.files.length} dosya`; break;
      case 'created_time': val = prop.created_time; break;
      case 'last_edited_time': val = prop.last_edited_time; break;
      case 'formula': val = JSON.stringify(prop.formula); break;
      case 'relation': val = `${prop.relation.length} ilişki`; break;
      default: val = `(tip: ${prop.type})`;
    }
    lines.push(`  - ${name} [${prop.type}]: ${val}`);
  }
  return lines;
}

/** Bir bloğun tüm alt bloklarını (pagination ile) toplar. */
async function listAllBlocks(blockId) {
  const blocks = [];
  let cursor;
  do {
    const res = await notion.blocks.children.list({ block_id: blockId, start_cursor: cursor });
    blocks.push(...res.results);
    cursor = res.has_more ? res.next_cursor : undefined;
  } while (cursor);
  return blocks;
}

/** heading bloğunun düz metnini çıkarır. */
function headingText(block) {
  const rt = block[block.type]?.rich_text ?? [];
  return rt.map((t) => t.plain_text).join('');
}

async function main() {
  out('## Notion Keşfi');
  out(`_Üretim: notion-discover.mjs — ${new Date().toISOString()}_`);
  out('');

  // --- 1 & 2: Şemalar ---
  const pagesDb = await dumpSchema('Sayfalar', NOTION_PAGES_DB_ID);
  const eventsDb = await dumpSchema('Etkinlikler', NOTION_EVENTS_DB_ID);

  // --- 3: Örnek sayfa /cember ---
  out('### Örnek sayfa: /cember');
  out('');

  // Title tip property adını bul (query filtresi için).
  const titlePropName = Object.entries(pagesDb.properties).find(([, p]) => p.type === 'title')?.[0];
  // Slug benzeri property adını bul.
  const slugPropName = Object.keys(pagesDb.properties).find((n) => /slug/i.test(n));
  out(`Title property adı: "${titlePropName}" | Slug property adı: ${slugPropName ? `"${slugPropName}"` : '(yok)'}`);
  out('');

  // Tüm sayfaları çek, /cember'i JS tarafında bul (property adından bağımsız, dayanıklı).
  const allPages = [];
  {
    let cursor;
    do {
      const res = await notion.databases.query({ database_id: NOTION_PAGES_DB_ID, start_cursor: cursor });
      allPages.push(...res.results.filter((r) => 'properties' in r));
      cursor = res.has_more ? res.next_cursor : undefined;
    } while (cursor);
  }
  out(`Sayfalar DB toplam satır: ${allPages.length}`);

  const cember = allPages.find((p) => {
    const slug = slugPropName ? p.properties[slugPropName] : null;
    const slugVal = slug?.type === 'rich_text' ? slug.rich_text.map((t) => t.plain_text).join('')
      : slug?.type === 'title' ? slug.title.map((t) => t.plain_text).join('')
      : slug?.type === 'url' ? slug.url : '';
    const title = titlePropName ? p.properties[titlePropName].title.map((t) => t.plain_text).join('') : '';
    return slugVal === '/cember' || /çember|cember/i.test(title);
  });

  if (!cember) {
    out('⚠️  /cember sayfası bulunamadı (slug=/cember veya title~Çember). Sayfa başlıkları:');
    for (const p of allPages) {
      const title = titlePropName ? p.properties[titlePropName].title.map((t) => t.plain_text).join('') : '(başlıksız)';
      out(`  - ${title}`);
    }
  } else {
    out('Property değerleri:');
    for (const l of readableProps(cember)) out(l);
    out('');

    // Body block histogramı + section etiketi tespiti.
    const blocks = await listAllBlocks(cember.id);
    const hist = {};
    for (const b of blocks) hist[b.type] = (hist[b.type] ?? 0) + 1;
    out(`Body blok sayısı: ${blocks.length}`);
    out('Blok tip histogramı:');
    for (const [t, c] of Object.entries(hist).sort((a, b) => b[1] - a[1])) out(`  - ${t}: ${c}`);
    out('');

    // Section etiketi nasıl? heading_2 metinleri.
    const h2s = blocks.filter((b) => b.type === 'heading_2');
    out(`heading_2 sayısı: ${h2s.length}. Metinleri:`);
    for (const h of h2s) out(`  - "${headingText(h)}"`);
    out('');

    // "section:" içeren ilk 2 heading_2 bloğunun raw JSON dump'ı.
    const sectionLike = h2s.filter((h) => /section\s*:/i.test(headingText(h)));
    const dumpTargets = (sectionLike.length ? sectionLike : h2s).slice(0, 2);
    out(`Section etiketi raw block JSON dump (${dumpTargets.length} örnek):`);
    out('```json');
    for (const b of dumpTargets) out(JSON.stringify(b, null, 2));
    out('```');
    out('');

    // notion-to-md çıktısı (ilk ~80 satır).
    const mdblocks = await n2m.pageToMarkdown(cember.id);
    const mdString = n2m.toMarkdownString(mdblocks);
    const md = (mdString.parent ?? '').split('\n').slice(0, 80).join('\n');
    out('notion-to-md markdown çıktısı (ilk 80 satır):');
    out('```markdown');
    out(md);
    out('```');
    out('');
  }

  // --- 4: Örnek etkinlik(ler) ---
  out('### Örnek etkinlik(ler)');
  out('');
  const eventsRes = await notion.databases.query({ database_id: NOTION_EVENTS_DB_ID, page_size: 2 });
  const events = eventsRes.results.filter((r) => 'properties' in r);
  out(`Çekilen etkinlik: ${events.length}`);
  events.forEach((ev, idx) => {
    out(`Etkinlik #${idx + 1}:`);
    for (const l of readableProps(ev)) out(l);
    out('');
  });
  // Tarih property adı + tipi netleştir.
  const dateProps = Object.entries(eventsDb.properties).filter(([, p]) => p.type === 'date');
  out(`Tarih (date) tipli property'ler: ${dateProps.map(([n]) => `"${n}"`).join(', ') || '(yok)'}`);
  out('');

  // notes.md'ye append.
  appendFileSync(NOTES_PATH, '\n\n' + buf.join('\n') + '\n');
  console.error(`\n→ Keşif .claude/notes.md'ye eklendi (${buf.length} satır).`);
}

main().catch((err) => {
  console.error('Keşif hatası:', err.body ?? err.message ?? err);
  process.exit(1);
});
