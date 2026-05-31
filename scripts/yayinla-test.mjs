/**
 * yayinla-test.mjs — "Yayınla" checkbox → Vercel deploy akışı manuel test aracı
 * (Sohbet #22, Brief 6)
 *
 * Notion Sayfalar DB'sinde bir sayfanın "Yayınla" checkbox'ını değiştirir. Notion
 * Automation (trigger: Yayınla checked) Vercel Deploy Hook'u tetikler → build başlar.
 * Deploy'un başladığı Vercel deployments listesinden manuel doğrulanır.
 *
 *   node --experimental-strip-types --env-file=.env scripts/yayinla-test.mjs --slug=/cember --action=toggle
 *
 * --slug=<slug>            Sayfalar DB URL property eşleşmesi (default /cember)
 * --action=<toggle|check|uncheck>   (default toggle)
 *
 * NOT: Notion sadece false→true geçişini trigger görür. Tekrar test için: uncheck → check.
 */

import { Client } from '@notionhq/client';

const { NOTION_TOKEN, NOTION_PAGES_DB_ID } = process.env;
if (!NOTION_TOKEN || !NOTION_PAGES_DB_ID) {
  console.error('HATA: NOTION_TOKEN / NOTION_PAGES_DB_ID yok. --env-file=.env ile koş.');
  process.exit(1);
}

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const m = a.match(/^--([^=]+)=(.*)$/);
    return m ? [m[1], m[2]] : [a.replace(/^--/, ''), 'true'];
  }),
);
const slug = args.slug || '/cember';
const action = args.action || 'toggle';

if (!['toggle', 'check', 'uncheck'].includes(action)) {
  console.error(`HATA: geçersiz --action="${action}" (toggle|check|uncheck).`);
  process.exit(1);
}

const notion = new Client({ auth: NOTION_TOKEN });
const now = () => new Date().toISOString();

async function main() {
  console.log(`[${now()}] Hedef: slug=${slug}, action=${action}`);

  const res = await notion.databases.query({
    database_id: NOTION_PAGES_DB_ID,
    filter: { property: 'URL', rich_text: { equals: slug } },
  });
  const page = res.results.find((r) => 'properties' in r);
  if (!page) {
    console.error(`HATA: ${slug} bulunamadı (Sayfalar DB, URL=${slug}).`);
    process.exit(1);
  }

  const prop = page.properties['Yayınla'];
  if (prop?.type !== 'checkbox') {
    console.error('HATA: "Yayınla" checkbox property bulunamadı.');
    process.exit(1);
  }
  const before = prop.checkbox;
  const next = action === 'check' ? true : action === 'uncheck' ? false : !before;

  console.log(`Yayınla (önce): ${before}  →  (sonra): ${next}`);

  if (before === next) {
    console.log(`⚠ Değer zaten ${next} — Notion trigger için değişiklik yok (false→true gerekir).`);
  }

  const updated = await notion.pages.update({
    page_id: page.id,
    properties: { Yayınla: { checkbox: next } },
  });
  const after = updated.properties['Yayınla']?.type === 'checkbox' ? updated.properties['Yayınla'].checkbox : '?';

  console.log(`[${now()}] Notion update OK — Yayınla = ${after} (page ${page.id})`);
  if (next === true && before === false) {
    console.log('→ false→true geçişi yapıldı: Notion Automation tetiklenmeli, Vercel deploy başlamalı.');
    console.log('  Doğrula: Vercel deployments listesi (yeni BUILDING → READY ~40-90s).');
  }
}

main().catch((err) => {
  console.error('yayinla-test hatası:', err.body ?? err.message ?? err);
  process.exit(1);
});
