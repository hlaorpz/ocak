/**
 * iletisim-dump.mjs — #27 Brief C Notion gerçek dump (kalıcı yardımcı).
 * biz-odasi-dump.mjs kardeşi, tek slug: iletisim.
 *
 *   node --experimental-strip-types --env-file=.env scripts/iletisim-dump.mjs
 */

import { Client } from '@notionhq/client';
import { transformPage } from '../src/lib/notion-pages.ts';

const { NOTION_TOKEN, NOTION_PAGES_DB_ID } = process.env;
if (!NOTION_TOKEN || !NOTION_PAGES_DB_ID) {
  console.error('HATA: NOTION_TOKEN / NOTION_PAGES_DB_ID yok. --env-file=.env ile koş.');
  process.exit(1);
}
const notion = new Client({ auth: NOTION_TOKEN });

const SLUG = '/iletisim';

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
  console.log(`Durum: ${fm.durum}`);
  console.log(`Description: ${(fm.description ?? '∅').slice(0, 140)}`);
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
    const preview = sectionBody.slice(0, 120).replace(/\n/g, ' ⏎ ');
    const overlineMatch = sectionBody.match(/^overline:[ \t]*(.+)$/m);
    const ov = overlineMatch ? ` [overline: ${overlineMatch[1].trim()}]` : '';
    console.log(`  - ${s}${ov} → ${preview}${sectionBody.length > 120 ? '…' : ''}`);
  }
  console.log('');

  // KARAR'A KARAR — Senaryo A/B tespiti
  const mektupSection = sections.find((s) => /mektup|bulten|ates-mektuplari/i.test(s));
  if (mektupSection) {
    console.log(`Ateş Mektupları section etiketi: "${mektupSection}"`);
    if (mektupSection === 'ates-mektuplari') {
      console.log('  → SENARYO A: plugin OMIT_SECTIONS yakalar, page override AtesMektuplariCTA ekler.');
    } else {
      console.log(`  → SENARYO B: plugin generic prose emit eder, B3 önerisi (Notion rename → 'ates-mektuplari').`);
    }
  } else {
    console.log('Ateş Mektupları section etiketi: YOK (ne ates-mektuplari ne benzeri)');
  }
  console.log('');

  // Hero?
  const heroSection = sections.find((s) => s === 'hero');
  console.log(`Hero section: ${heroSection ? 'VAR' : 'YOK'}`);

  // ocak.life
  const ocakLifeHits = countMatches(body, /ocak\.life/g);
  if (ocakLifeHits > 0) {
    console.log(`⚠ ocak.life kaldı: ${ocakLifeHits} yer (Notion-side find-replace gerek)`);
    const matches = [...body.matchAll(/.{0,40}ocak\.life.{0,40}/g)];
    for (const m of matches.slice(0, 5)) console.log(`    ${m[0]}`);
  } else {
    console.log('ocak.life: 0 hit ✓ (Kaan find-replace uygulanmış)');
  }
  console.log('');

  // Alt-yapı
  const tables = countMatches(body, /^\|.+\|/gm);
  const blockquotes = countMatches(body, /^>[ \t]/gm);
  const images = countMatches(body, /!\[[^\]]*\]\(/g);
  console.log(`Tables (satır): ${tables} | Blockquotes: ${blockquotes} | Images: ${images}`);

  // Link envanteri
  const links = [...body.matchAll(/\[([^\]]*)\]\(([^)]+)\)/g)].map((m) => ({ text: m[1], url: m[2] }));
  const internal = links.filter((l) => l.url.startsWith('/'));
  const notionDirect = links.filter((l) => /^https:\/\/www\.notion\.so\/[a-z0-9-]+$/.test(l.url));
  const notionHash = links.filter((l) => l.url.includes('notion.so/#'));
  const notionNested = links.filter((l) => /notion\.so\/[a-z0-9-]+\/[a-z0-9-]+/.test(l.url));
  const wa = links.filter((l) => l.url.includes('wa.me'));
  const ig = links.filter((l) => l.url.includes('instagram.com'));
  const mail = links.filter((l) => l.url.startsWith('mailto:'));
  const external = links.filter((l) => !l.url.startsWith('/') && !l.url.includes('notion.so') && !l.url.includes('wa.me') && !l.url.includes('instagram.com') && !l.url.startsWith('mailto:'));
  const broken = links.filter((l) => /^[_*]|[_*]$/.test(l.url) || l.url.includes('placeholder'));
  console.log(`Links: ${links.length}`);
  console.log(`  internal /<slug>: ${internal.length}`);
  console.log(`  notion-direct: ${notionDirect.length} (KARAR 120 normalize)`);
  console.log(`  notion-hash: ${notionHash.length}`);
  console.log(`  notion-nested: ${notionNested.length}`);
  console.log(`  WhatsApp: ${wa.length}`);
  console.log(`  Instagram: ${ig.length}`);
  console.log(`  mailto: ${mail.length}`);
  console.log(`  external: ${external.length}`);
  console.log(`  BOZUK: ${broken.length}`);
  if (wa.length) for (const l of wa) console.log(`    wa: "${l.text}" → ${l.url}`);
  if (ig.length) for (const l of ig) console.log(`    ig: "${l.text}" → ${l.url}`);
  if (mail.length) for (const l of mail) console.log(`    mail: "${l.text}" → ${l.url}`);
  if (notionHash.length) for (const l of notionHash) console.log(`    hash: "${l.text}" → ${l.url}`);
  if (notionNested.length) for (const l of notionNested) console.log(`    nested: "${l.text}" → ${l.url}`);
  if (broken.length) for (const l of broken) console.log(`    BOZUK: "${l.text}" → ${l.url}`);
}

await dump(SLUG);
