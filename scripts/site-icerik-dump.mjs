/**
 * site-icerik-dump.mjs — Sayfalar DB ham içerik snapshot'ı.
 *
 * Tüm sayfaları (Durum filtresi YOK — Taslak dahil) tek dosyaya döker:
 *   - Her property dinamik okunur (whitelist yok, "Notlar"/"Tasarım Notları" dahil her şey).
 *   - Body notion-to-md ham çıktısı (remark-ocak-sections geçmez; ## section: etiketleri,
 *     ham *  /  _ delim'ler Notion'daki haliyle kalır).
 *   - Sıra: URL alfabetik (deterministik).
 *
 *   node --env-file=.env scripts/site-icerik-dump.mjs
 *
 * Çıktı: repo kökünde ocak-site-icerik.md (Claude.ai tarafında içerik tartışması için).
 * Bağımsız okuma script'i — loader/build/plugin'e dokunmaz.
 */

import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_PATH = join(__dirname, '..', 'ocak-site-icerik.md');

const { NOTION_TOKEN, NOTION_PAGES_DB_ID } = process.env;
if (!NOTION_TOKEN || !NOTION_PAGES_DB_ID) {
  console.error('HATA: NOTION_TOKEN / NOTION_PAGES_DB_ID yok. --env-file=.env ile koş.');
  process.exit(1);
}

const notion = new Client({ auth: NOTION_TOKEN });
const n2m = new NotionToMarkdown({ notionClient: notion });

const EMPTY = '—';

/** Bir property'yi tipine göre düz metne çevirir. Bilinmeyen/boş — döndürür. */
function propToText(prop) {
  if (!prop) return EMPTY;
  switch (prop.type) {
    case 'title': {
      const s = prop.title.map((t) => t.plain_text).join('');
      return s || EMPTY;
    }
    case 'rich_text': {
      const s = prop.rich_text.map((t) => t.plain_text).join('');
      return s || EMPTY;
    }
    case 'select':
      return prop.select?.name ?? EMPTY;
    case 'multi_select': {
      const arr = prop.multi_select.map((s) => s.name);
      return arr.length ? arr.join(', ') : EMPTY;
    }
    case 'status':
      return prop.status?.name ?? EMPTY;
    case 'url':
      return prop.url || EMPTY;
    case 'email':
      return prop.email || EMPTY;
    case 'phone_number':
      return prop.phone_number || EMPTY;
    case 'number':
      return prop.number == null ? EMPTY : String(prop.number);
    case 'checkbox':
      return prop.checkbox ? 'true' : 'false';
    case 'date': {
      if (!prop.date) return EMPTY;
      const { start, end, time_zone } = prop.date;
      const parts = [start];
      if (end) parts.push(`→ ${end}`);
      if (time_zone) parts.push(`(${time_zone})`);
      return parts.join(' ');
    }
    case 'files': {
      if (!prop.files.length) return EMPTY;
      const urls = prop.files.map((f) => {
        if (f.type === 'external') return f.external.url;
        if (f.type === 'file') return f.file.url;
        return f.name ?? '(dosya)';
      });
      return urls.join(', ');
    }
    case 'people': {
      const names = prop.people.map((p) => p.name || p.id);
      return names.length ? names.join(', ') : EMPTY;
    }
    case 'relation': {
      const ids = prop.relation.map((r) => r.id);
      return ids.length ? ids.join(', ') : EMPTY;
    }
    case 'rollup':
      return JSON.stringify(prop.rollup);
    case 'formula': {
      const f = prop.formula;
      if (f.type === 'string') return f.string ?? EMPTY;
      if (f.type === 'number') return f.number == null ? EMPTY : String(f.number);
      if (f.type === 'boolean') return String(f.boolean);
      if (f.type === 'date') return f.date ? f.date.start : EMPTY;
      return JSON.stringify(f);
    }
    case 'created_time':
      return prop.created_time;
    case 'last_edited_time':
      return prop.last_edited_time;
    case 'created_by':
      return prop.created_by?.id ?? EMPTY;
    case 'last_edited_by':
      return prop.last_edited_by?.id ?? EMPTY;
    case 'unique_id': {
      const u = prop.unique_id;
      if (!u) return EMPTY;
      return u.prefix ? `${u.prefix}-${u.number}` : String(u.number);
    }
    default:
      return `(işlenmemiş tip: ${prop.type})`;
  }
}

/** Markdown tablo hücresi için: pipe escape + newline → <br>. */
function cell(s) {
  return String(s).replace(/\\/g, '\\\\').replace(/\|/g, '\\|').replace(/\r?\n/g, '<br>');
}

/** Title tip property'sinin değerini çıkarır (sayfa başlığı için fallback). */
function titleOf(page) {
  for (const prop of Object.values(page.properties)) {
    if (prop.type === 'title') {
      const s = prop.title.map((t) => t.plain_text).join('');
      if (s) return s;
    }
  }
  return '(başlıksız)';
}

/** URL property'sini (rich_text tipinde) çıkarır. */
function urlOf(page) {
  const p = page.properties['URL'];
  if (!p) return '';
  if (p.type === 'rich_text') return p.rich_text.map((t) => t.plain_text).join('').trim();
  if (p.type === 'url') return (p.url ?? '').trim();
  return '';
}

async function main() {
  // Tüm sayfaları çek (pagination).
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

  // Deterministik sıra: URL alfabetik (boş URL'liler sona).
  all.sort((a, b) => {
    const ua = urlOf(a);
    const ub = urlOf(b);
    if (!ua && !ub) return titleOf(a).localeCompare(titleOf(b), 'tr');
    if (!ua) return 1;
    if (!ub) return -1;
    return ua.localeCompare(ub, 'tr');
  });

  const out = [];
  out.push('# Ocak Site — İçerik Snapshot');
  out.push('');
  out.push(`_Üretim: scripts/site-icerik-dump.mjs — ${new Date().toISOString()}_  `);
  out.push(`_Toplam sayfa: ${all.length}  ·  Durum filtresi: YOK (Taslak dahil)_`);
  out.push('');
  out.push('---');
  out.push('');

  for (const page of all) {
    const title = titleOf(page);
    const url = urlOf(page) || '(URL yok)';

    out.push(`## ${title} (URL: ${url})`);
    out.push('');
    out.push('### Property\'ler');
    out.push('');
    out.push('| Kolon | Değer |');
    out.push('|---|---|');

    // Notion'daki property sırası — Object.entries deterministik.
    for (const [name, prop] of Object.entries(page.properties)) {
      out.push(`| ${cell(name)} | ${cell(propToText(prop))} |`);
    }
    out.push('');

    // Body — ham notion-to-md çıktısı.
    out.push('### Body (ham markdown)');
    out.push('');
    try {
      const mdblocks = await n2m.pageToMarkdown(page.id);
      const mdString = n2m.toMarkdownString(mdblocks);
      const body = (mdString.parent ?? '').trimEnd();
      out.push(body || '_(body boş)_');
    } catch (err) {
      out.push(`_(body çekme hatası: ${err.message || err})_`);
    }
    out.push('');
    out.push('---');
    out.push('');
  }

  writeFileSync(OUT_PATH, out.join('\n'), 'utf-8');
  console.error(`→ Yazıldı: ${OUT_PATH}  (${all.length} sayfa)`);
}

main().catch((err) => {
  console.error('Dump hatası:', err.body ?? err.message ?? err);
  process.exit(1);
});
