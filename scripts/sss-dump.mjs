/**
 * sss-dump.mjs — SSS plugin transform doğrulaması (Sohbet #22, Brief 5, Görev 3)
 *
 * /cember body'sini çeker, remark-ocak-sections plugin'inden geçirir, çıkan HTML'de
 * ## section: sss bloğunun ne ürettiğini raporlar:
 *   Senaryo B → <details>/<summary> üretiyor (component CSS uyumlu, görev 4 atlanır)
 *   Senaryo A → düz <h3>/<p> (görev 4: plugin SSS transform yazılır)
 *
 *   node --experimental-strip-types --env-file=.env scripts/sss-dump.mjs [slug]
 *   (slug opsiyonel, default /cember — örn. ... scripts/sss-dump.mjs /anadolu)
 */

import { Client } from '@notionhq/client';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkFrontmatter from 'remark-frontmatter';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import remarkOcakSections from '../src/lib/remark-ocak-sections.ts';
import { transformPage } from '../src/lib/notion-pages.ts';

const { NOTION_TOKEN, NOTION_PAGES_DB_ID } = process.env;
if (!NOTION_TOKEN || !NOTION_PAGES_DB_ID) {
  console.error('HATA: NOTION_TOKEN / NOTION_PAGES_DB_ID yok. --env-file=.env ile koş.');
  process.exit(1);
}

const notion = new Client({ auth: NOTION_TOKEN });
const log = (s = '') => console.log(s);

function renderMarkdown(md) {
  return String(
    unified()
      .use(remarkParse)
      .use(remarkFrontmatter, ['yaml'])
      .use(remarkOcakSections)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeStringify, { allowDangerousHtml: true })
      .processSync(md),
  );
}

async function main() {
  const slug = process.argv[2] || '/cember';
  log(`# SSS dump — ${slug}`);
  log('');
  const res = await notion.databases.query({
    database_id: NOTION_PAGES_DB_ID,
    filter: { property: 'URL', rich_text: { equals: slug } },
  });
  const page = res.results.find((r) => 'properties' in r);
  if (!page) {
    console.error(`HATA: ${slug} bulunamadı.`);
    process.exit(1);
  }

  const transformed = await transformPage(notion, page);
  const body = transformed.body;

  // ## section: sss bloğunu markdown'da bul (kaynak gösterimi için).
  const sssStart = body.search(/^##[ \t]+section:[ \t]*sss[ \t]*$/m);
  if (sssStart === -1) {
    log('## SSS bölümü: /cember body\'sinde "## section: sss" YOK.');
    log('Diğer section\'lar:');
    for (const m of body.matchAll(/^##[ \t]+section:[ \t]*(.+)$/gm)) log(`  - ${m[1]}`);
    return;
  }
  const afterStart = body.slice(sssStart).replace(/^.*\n/, '');
  const nextSection = afterStart.search(/^##[ \t]+section:/m);
  const sssMd = nextSection === -1 ? afterStart : afterStart.slice(0, nextSection);

  log('## SSS markdown kaynağı (## section: sss bloğu, plugin öncesi)');
  log('```markdown');
  log(sssMd.trim());
  log('```');
  log('');

  // Plugin'den geçir, sss section HTML'ini ayıkla.
  const html = renderMarkdown(body);
  const sssHtmlMatch = html.match(/<section data-section="sss">([\s\S]*?)<\/section>/);
  const sssHtml = sssHtmlMatch ? sssHtmlMatch[0] : '(sss section HTML bulunamadı)';

  log('## Plugin çıktısı — sss section HTML');
  log('```html');
  log(sssHtml);
  log('```');
  log('');

  // Yargı: details/summary üretiliyor mu?
  const detailsCount = (sssHtml.match(/<details>/g) ?? []).length;
  const summaryCount = (sssHtml.match(/<summary>/g) ?? []).length;
  const h3Count = (sssHtml.match(/<h3>/g) ?? []).length;

  log('## Yargı');
  log(`- <details>: ${detailsCount}`);
  log(`- <summary>: ${summaryCount}`);
  log(`- ham <h3>: ${h3Count}`);
  if (detailsCount > 0 && summaryCount > 0) {
    log('→ SENARYO B: Plugin zaten <details>/<summary> üretiyor. SSS.astro CSS\'i (KARAR 105)');
    log('  :global(.sss details > p) / .sss__cevap ile uyumlu. GÖREV 4 ATLANIR (plugin\'e dokunma).');
  } else if (h3Count > 0) {
    log('→ SENARYO A: Plugin ham <h3>/<p> bırakıyor. GÖREV 4 gerekli (plugin SSS transform).');
  } else {
    log('→ Belirsiz — sss içeriği beklenenden farklı, manuel incele.');
  }
}

main().catch((err) => {
  console.error('SSS dump hatası:', err.body ?? err.message ?? err);
  process.exit(1);
});
