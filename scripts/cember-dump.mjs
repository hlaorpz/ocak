/**
 * cember-dump.mjs — Sayfalar loader smoke test (Sohbet #22, Brief 2)
 *
 * Notion'dan SADECE /cember sayfasını çeker, transformPage'den geçirir, raporu basar.
 * notion-pages.ts (.ts) import edildiği için type-stripping flag'i gerekir:
 *
 *   node --experimental-strip-types --env-file=.env scripts/cember-dump.mjs
 *
 * (Plain `node` .ts import edemez — ERR_UNKNOWN_FILE_EXTENSION. notion.ts
 *  import.meta.env okuduğu için Node'da kullanılamaz; bu yüzden client'ı burada
 *  process.env'den kurup transformPage'e inject ediyoruz — DI deseni.)
 *
 * Kalıcı araç — loader transform'unu Notion gerçeğine karşı doğrulamak için.
 */

import { Client } from '@notionhq/client';
import { transformPage } from '../src/lib/notion-pages.ts';

const { NOTION_TOKEN, NOTION_PAGES_DB_ID } = process.env;
if (!NOTION_TOKEN || !NOTION_PAGES_DB_ID) {
  console.error('HATA: NOTION_TOKEN / NOTION_PAGES_DB_ID yok. --env-file=.env ile koş.');
  process.exit(1);
}

const notion = new Client({ auth: NOTION_TOKEN });

function line(s = '') {
  console.log(s);
}

async function main() {
  // /cember sayfasını URL property filtresiyle bul.
  const res = await notion.databases.query({
    database_id: NOTION_PAGES_DB_ID,
    filter: { property: 'URL', rich_text: { equals: '/cember' } },
  });
  const page = res.results.find((r) => 'properties' in r);
  if (!page) {
    console.error('HATA: /cember sayfası bulunamadı (URL = /cember filtresi boş döndü).');
    process.exit(1);
  }

  const transformed = await transformPage(notion, page);
  if (!transformed) {
    console.error('HATA: transformPage null döndü (slug boş?).');
    process.exit(1);
  }

  const fm = transformed.frontmatter;

  // ── Frontmatter tablosu ──
  line('## /cember — Frontmatter');
  line('');
  line('| Alan | Değer |');
  line('| --- | --- |');
  line(`| slug | ${fm.slug} |`);
  line(`| title | ${fm.title} |`);
  line(`| oda | ${fm.oda} |`);
  line(`| durum | ${fm.durum} |`);
  line(`| description | ${(fm.description ?? '∅').slice(0, 80)} |`);
  line(`| ogImage | ${fm.ogImage ? 'VAR ✓' : 'YOK (undefined)'} |`);
  line(`| notion_id | ${fm.notion_id} |`);
  line('');

  // ── Body markdown ilk 100 satır ──
  const bodyLines = transformed.body.split('\n');
  line(`## Body markdown (${bodyLines.length} satır — ilk 100)`);
  line('```markdown');
  line(bodyLines.slice(0, 100).join('\n'));
  line('```');
  line('');

  // ── Section özeti ──
  const sectionRe = /^##[ \t]+section:[ \t]*(.+?)[ \t]*$/gm;
  const sections = [...transformed.body.matchAll(sectionRe)].map((m) => m[1]);
  line('## Section özeti');
  line(`${sections.length} section: ${sections.join(', ')}`);
  line('');

  // ── Plugin uyumu kontrol ──
  line('## Plugin uyumu kontrol');
  // 1. Section başlıkları tam depth-2 (## ) mı? (### veya #### olmamalı)
  const looseSectionRe = /^#{1,6}[ \t]+section:/gm;
  const allSectionHeadings = [...transformed.body.matchAll(looseSectionRe)];
  const depth2 = allSectionHeadings.filter((m) => /^##[ \t]/.test(m[0])).length;
  line(
    `- Section etiketi depth-2 (## ): ${depth2}/${allSectionHeadings.length} ` +
      `${depth2 === allSectionHeadings.length ? '✓ hepsi H2' : '⚠ bazıları H2 değil'}`,
  );
  // 2. Hero section'da overline: AD pattern'i var mı?
  // (Regex yerine programatik slice — JS'te \Z yok, m-flag $ satır sonu demek.)
  const heroStart = transformed.body.search(/^##[ \t]+section:[ \t]*hero[ \t]*$/m);
  let heroBody = '';
  if (heroStart !== -1) {
    const after = transformed.body.slice(heroStart).replace(/^.*\n/, ''); // hero başlığını at
    const nextSection = after.search(/^##[ \t]+section:/m);
    heroBody = nextSection === -1 ? after : after.slice(0, nextSection);
  }
  const overlineMatch = heroBody.match(/^[ \t]*overline:[ \t]*(.+)$/m);
  line(
    `- Hero overline: pattern: ${overlineMatch ? `VAR → "overline: ${overlineMatch[1].trim()}"` : 'YOK'}`,
  );
  line('  (NOT: plugin hero transform overline: satırını PARSE ETMEZ — düz metin render edilir. Brief 4 görevi.)');
  line('');
}

main().catch((err) => {
  console.error('Smoke test hatası:', err.body ?? err.message ?? err);
  process.exit(1);
});
