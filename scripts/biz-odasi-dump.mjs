/**
 * biz-odasi-dump.mjs — #27 Brief B Notion gerçek dump (kalıcı yardımcı).
 * yolculuk-anadolu-dump.mjs kardeşi, üç slug için: biz, advaita, ekip.
 *
 *   node --experimental-strip-types --env-file=.env scripts/biz-odasi-dump.mjs
 */

import { Client } from '@notionhq/client';
import { transformPage } from '../src/lib/notion-pages.ts';

const { NOTION_TOKEN, NOTION_PAGES_DB_ID } = process.env;
if (!NOTION_TOKEN || !NOTION_PAGES_DB_ID) {
  console.error('HATA: NOTION_TOKEN / NOTION_PAGES_DB_ID yok. --env-file=.env ile koş.');
  process.exit(1);
}
const notion = new Client({ auth: NOTION_TOKEN });

const SLUGS = ['/biz', '/advaita', '/ekip'];

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
  console.log(`Durum: ${fm.durum} | (Yayınla loader filtresi: durum === 'Yayınla' OR diğer)`);
  console.log(`Description: ${(fm.description ?? '∅').slice(0, 120)}`);
  console.log(`Body length: ${body.length} chars`);
  console.log('');

  // Section etiketleri + preview
  const sectionRe = /^##[ \t]+section:[ \t]*(.+?)[ \t]*$/gm;
  const sections = [...body.matchAll(sectionRe)].map((m) => m[1]);
  console.log(`Sections (${sections.length}):`);
  for (const s of sections) {
    const startIdx = body.indexOf(`## section: ${s}`);
    const afterHeader = body.slice(startIdx).replace(/^.*\n/, '');
    const nextSection = afterHeader.search(/^##[ \t]+section:/m);
    const sectionBody = (nextSection === -1 ? afterHeader : afterHeader.slice(0, nextSection)).trim();
    const preview = sectionBody.slice(0, 110).replace(/\n/g, ' ⏎ ');
    const overlineMatch = sectionBody.match(/^overline:[ \t]*(.+)$/m);
    const ov = overlineMatch ? ` [overline: ${overlineMatch[1].trim()}]` : '';
    console.log(`  - ${s}${ov} → ${preview}${sectionBody.length > 110 ? '…' : ''}`);
  }
  console.log('');

  // Alt-yapı işaretleri
  const tables = countMatches(body, /^\|.+\|/gm);
  const blockquotes = countMatches(body, /^>[ \t]/gm);
  const images = countMatches(body, /!\[[^\]]*\]\(/g);
  const horizontalRules = countMatches(body, /^---$/gm);
  console.log(`Tables (satır): ${tables} | Blockquotes: ${blockquotes} | Images: ${images} | HR: ${horizontalRules}`);

  // Simya sembolleri (#27 Brief B özel)
  const alchSyms = ['🜂', '🜄', '🜁', '🜃', '🜔'];
  const symCount = alchSyms.map((s) => `${s}:${countMatches(body, new RegExp(s, 'g'))}`).join(' ');
  console.log(`Simya semboller: ${symCount}`);

  // Bullet-italik-dash deseni (#27 Brief B Sapma 2)
  const bulletItalikDash = countMatches(body, /-\s+\*[^*\n]+\*\s*\n\s*-\s*--/g);
  if (bulletItalikDash > 0) console.log(`⚠ Bullet-italik-dash deseni: ${bulletItalikDash} yer (Notion-side fix Kaan turu)`);

  // 4-yıldız literal artığı (#27 Brief B Sapma 4)
  const fourStar = countMatches(body, /\*\*\*\*[^*]+\*\*\*\*/g);
  if (fourStar > 0) console.log(`⚠ 4-yıldız literal artığı: ${fourStar} yer (KARAR 108 normalizer yakalamalı)`);

  // KARAR 91 cümlesi (#27 Brief B özel /advaita)
  const k91 = countMatches(body, /Ateşi ilk yakan/g);
  if (k91 > 0) console.log(`KARAR 91 cümlesi ("Ateşi ilk yakan"): ${k91} yer`);

  // Link envanteri (Brief A pattern)
  const links = [...body.matchAll(/\[([^\]]*)\]\(([^)]+)\)/g)].map((m) => ({ text: m[1], url: m[2] }));
  const internal = links.filter((l) => l.url.startsWith('/'));
  const notionDirect = links.filter((l) => /^https:\/\/www\.notion\.so\/[a-z0-9-]+$/.test(l.url));
  const notionHash = links.filter((l) => l.url.includes('notion.so/#'));
  const notionNested = links.filter((l) => /notion\.so\/[a-z0-9-]+\/[a-z0-9-]+/.test(l.url));
  const external = links.filter((l) => !l.url.startsWith('/') && !l.url.includes('notion.so'));
  const broken = links.filter((l) => /^[_*]|[_*]$/.test(l.url) || l.url.includes('placeholder'));
  console.log(`Links: ${links.length} (internal: ${internal.length}, notion-direct: ${notionDirect.length}, notion-hash: ${notionHash.length}, notion-nested: ${notionNested.length}, external: ${external.length}, bozuk: ${broken.length})`);
  if (notionDirect.length > 0) {
    console.log('  notion-direct (KARAR 120 normalize):');
    for (const l of notionDirect) console.log(`    "${l.text}" → ${l.url}`);
  }
  if (notionHash.length > 0) {
    console.log('  notion-hash (kapsam dışı, korunur):');
    for (const l of notionHash) console.log(`    "${l.text}" → ${l.url}`);
  }
  if (notionNested.length > 0) {
    console.log('  notion-nested (kapsam dışı, korunur):');
    for (const l of notionNested) console.log(`    "${l.text}" → ${l.url}`);
  }
  if (broken.length > 0) {
    console.log('  BOZUK:');
    for (const l of broken) console.log(`    "${l.text}" → ${l.url}`);
  }

  // Form section?
  const formIsareti = sections.find((s) => /basvuru|kayit|form/i.test(s));
  if (formIsareti) console.log(`Form sapması: section "${formIsareti}" var.`);
}

for (const slug of SLUGS) {
  await dump(slug);
}
