/**
 * yolculuk-anadolu-dump.mjs — #27 Brief A Notion gerçek dump (kalıcı yardımcı).
 * cember-dump.mjs pattern'i, iki slug için section + body + link envanteri.
 *
 *   node --experimental-strip-types --env-file=.env scripts/yolculuk-anadolu-dump.mjs
 */

import { Client } from '@notionhq/client';
import { transformPage } from '../src/lib/notion-pages.ts';

const { NOTION_TOKEN, NOTION_PAGES_DB_ID } = process.env;
if (!NOTION_TOKEN || !NOTION_PAGES_DB_ID) {
  console.error('HATA: NOTION_TOKEN / NOTION_PAGES_DB_ID yok. --env-file=.env ile koş.');
  process.exit(1);
}
const notion = new Client({ auth: NOTION_TOKEN });

const SLUGS = ['/yolculuk', '/anadolu'];

function countMatches(s, re) {
  return (s.match(re) ?? []).length;
}

async function dump(slug) {
  console.log(`\n${'='.repeat(72)}\n## ${slug}\n${'='.repeat(72)}\n`);
  const res = await notion.databases.query({
    database_id: NOTION_PAGES_DB_ID,
    filter: { property: 'URL', rich_text: { equals: slug } },
  });
  const page = res.results.find((r) => 'properties' in r);
  if (!page) {
    console.error(`  ⚠ ${slug} bulunamadı`);
    return;
  }
  const transformed = await transformPage(notion, page);
  if (!transformed) {
    console.error(`  ⚠ transformPage null`);
    return;
  }
  const fm = transformed.frontmatter;
  const body = transformed.body;

  console.log(`Title: ${fm.title}`);
  console.log(`URL: ${fm.slug}`);
  console.log(`Oda: ${fm.oda}`);
  console.log(`Durum: ${fm.durum} | Yayınla: (sayfada gözükmesi 'Yayınla' filtresi loader'da)`);
  console.log(`Description: ${(fm.description ?? '∅').slice(0, 120)}`);
  console.log(`Body length: ${body.length} chars`);
  console.log('');

  // Section etiketleri
  const sectionRe = /^##[ \t]+section:[ \t]*(.+?)[ \t]*$/gm;
  const sections = [...body.matchAll(sectionRe)].map((m) => m[1]);
  console.log(`Sections (${sections.length}):`);
  for (const s of sections) {
    // Section gövdesinin ilk 100 char preview
    const startIdx = body.indexOf(`## section: ${s}`);
    const afterHeader = body.slice(startIdx).replace(/^.*\n/, '');
    const nextSection = afterHeader.search(/^##[ \t]+section:/m);
    const sectionBody = (nextSection === -1 ? afterHeader : afterHeader.slice(0, nextSection)).trim();
    const preview = sectionBody.slice(0, 100).replace(/\n/g, ' ⏎ ');
    // overline tespiti
    const overlineMatch = sectionBody.match(/^overline:[ \t]*(.+)$/m);
    const ov = overlineMatch ? ` [overline: ${overlineMatch[1].trim()}]` : '';
    console.log(`  - ${s}${ov} → ${preview}${sectionBody.length > 100 ? '…' : ''}`);
  }
  console.log('');

  // Alt-yapı işaretleri
  const tables = countMatches(body, /^\|.+\|/gm);
  const blockquotes = countMatches(body, /^>[ \t]/gm);
  const images = countMatches(body, /!\[[^\]]*\]\(/g);
  const horizontalRules = countMatches(body, /^---$/gm);
  console.log(`Tables (satır): ${tables} | Blockquotes: ${blockquotes} | Images: ${images} | HR: ${horizontalRules}`);

  // Link envanteri
  const links = [...body.matchAll(/\[([^\]]*)\]\(([^)]+)\)/g)].map((m) => ({ text: m[1], url: m[2] }));
  const internal = links.filter((l) => l.url.startsWith('/'));
  const notionLinks = links.filter((l) => l.url.includes('notion.so'));
  const external = links.filter((l) => !l.url.startsWith('/') && !l.url.includes('notion.so'));
  const broken = links.filter((l) => /^[_*]|[_*]$/.test(l.url) || l.url.includes('placeholder'));
  console.log(`Links: ${links.length} (internal: ${internal.length}, notion.so: ${notionLinks.length}, external: ${external.length}, bozuk: ${broken.length})`);
  if (notionLinks.length > 0) {
    console.log('  notion.so:');
    for (const l of notionLinks) console.log(`    "${l.text}" → ${l.url}`);
  }
  if (broken.length > 0) {
    console.log('  BOZUK:');
    for (const l of broken) console.log(`    "${l.text}" → ${l.url}`);
  }

  // Form / başvuru / kayıt section'ı var mı?
  const formIsareti = sections.find((s) => /basvuru|kayit|form/i.test(s));
  if (formIsareti) console.log(`Form sapması: section "${formIsareti}" var.`);
}

for (const slug of SLUGS) {
  await dump(slug);
}
