/**
 * esik-dump.mjs — /sen-neredesin eşik accordion brief'i Paket 1 tanı.
 *
 * Notion'dan /sen-neredesin sayfasını çeker, `## section: NAME` blok pattern'ini
 * dump eder, eşik accordion brief'i için iki kritik soruyu cevaplar:
 *
 *   (1) 10 eşik (esik-0-uyku → esik-9-spiral) + son-soz section'ı tam mı?
 *       Sapma varsa → DURDUR ve raporla (brief revize edilmeli).
 *
 *   (2) Eşik başlık kaynağı hangisi?
 *       Pattern A → Her esik section'ın ilk node'u ## h2 ("## 0 · UYKU") →
 *         plugin h2'yi strip + summary'ye taşır.
 *       Pattern B → Section-name dışında başlık yok → plugin section-name'den
 *         türetir ("esik-0-uyku" → "0 · UYKU" veya benzeri).
 *
 *   node --experimental-strip-types --env-file=.env scripts/esik-dump.mjs
 *
 * Sapma raporu: /sen-neredesin dışında esik-* pattern'i olan başka sayfa var mı?
 * (Plugin tek-sayfa varsayımıyla `name="esikler"` attribute basacak — başka
 * sayfaya yayılırsa exclusive accordion namespace çakışır.)
 */

import { Client } from '@notionhq/client';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkFrontmatter from 'remark-frontmatter';
import { transformPage } from '../src/lib/notion-pages.ts';

const { NOTION_TOKEN, NOTION_PAGES_DB_ID } = process.env;
if (!NOTION_TOKEN || !NOTION_PAGES_DB_ID) {
  console.error('HATA: NOTION_TOKEN / NOTION_PAGES_DB_ID yok. --env-file=.env ile koş.');
  process.exit(1);
}

const notion = new Client({ auth: NOTION_TOKEN });
const log = (s = '') => console.log(s);

// Brief varsayımı: `esik-0-uyku` … `esik-9-spiral` (numaralı).
// İlk dump gerçeği: numarasız, semantik isimler. Pattern A/B sorusunu cevaplayabilmek
// için gerçek isim setine geçiyoruz; bulgular kullanıcıya raporlanacak (brief revize için).
const EXPECTED_ESIKLER = [
  'esik-uyku',
  'esik-merak',
  'esik-ilk-dokunus',
  'esik-aidiyet',
  'esik-derinlesme',
  'esik-taahhut',
  'esik-yolculuk',
  'esik-eve-donus',
  'esik-tasiyici',
  'esik-spiral',
];

/** mdast text/inlineCode node ağacını düz metne indirger. */
function getText(node) {
  if (node.type === 'text' || node.type === 'inlineCode') return node.value ?? '';
  if (Array.isArray(node.children)) return node.children.map(getText).join('');
  return '';
}

/** Markdown body'sini mdast'e parse eder (plugin transform UYGULAMAZ — ham yapıyı görmek istiyoruz). */
function parseMd(md) {
  return unified()
    .use(remarkParse)
    .use(remarkFrontmatter, ['yaml'])
    .parse(md);
}

/**
 * Body'yi `## section: NAME` markerlarına göre fragmentlere böler.
 * { name, headingNode, content: RootContent[] }[] döner. content kısmında
 * `## section: NAME` heading'i YOKtur — sadece o section'a ait sonraki node'lar.
 */
function splitSections(tree) {
  const out = [];
  let current = null;
  for (const node of tree.children) {
    if (node.type === 'heading' && node.depth === 2) {
      const m = getText(node).match(/^section:\s*(.+)$/);
      if (m) {
        if (current) out.push(current);
        current = { name: m[1].trim(), headingNode: node, content: [] };
        continue;
      }
    }
    if (current) current.content.push(node);
  }
  if (current) out.push(current);
  return out;
}

/**
 * Bir section'ın ilk içerik node'u ## h2 mi?
 * (heading depth=2, ama "section:" prefix'i değil — gerçek başlık.)
 */
function findFirstH2(content) {
  for (const node of content) {
    if (node.type === 'heading' && node.depth === 2) {
      const text = getText(node).trim();
      // "section:" prefix'iyle başlıyorsa o bir bölüm markerı, başlık değil
      if (!/^section:/i.test(text)) return { node, text };
    }
    // İlk gerçek içerik geldiyse (paragraph vs.), h2 yok demektir
    if (node.type === 'paragraph' || node.type === 'list' || node.type === 'blockquote') {
      return null;
    }
  }
  return null;
}

/** İçerik özetini ilk paragraph'ın ilk ~80 karakterinden çıkarır. */
function previewSnippet(content) {
  for (const node of content) {
    if (node.type === 'paragraph') {
      const t = getText(node).trim().replace(/\s+/g, ' ');
      return t.length > 80 ? t.slice(0, 77) + '…' : t;
    }
  }
  return '(içerik yok)';
}

async function fetchPageBody(slug) {
  const res = await notion.databases.query({
    database_id: NOTION_PAGES_DB_ID,
    filter: { property: 'URL', rich_text: { equals: slug } },
  });
  const page = res.results.find((r) => 'properties' in r);
  if (!page) return null;
  const transformed = await transformPage(notion, page);
  return transformed.body;
}

async function checkOtherPagesForEsikPattern() {
  // Tüm sayfaları çek, body'lerinde `## section: esik-` pattern'i ara
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

  const hits = [];
  for (const page of all) {
    const urlProp = page.properties.URL;
    const url = urlProp?.type === 'rich_text'
      ? urlProp.rich_text.map((t) => t.plain_text).join('').trim()
      : '';
    if (!url) continue;
    if (url === '/sen-neredesin') continue; // beklenen sayfa, atla
    try {
      const body = await transformPage(notion, page).then((t) => t.body);
      if (/^##\s+section:\s*esik-/m.test(body)) {
        const matches = [...body.matchAll(/^##\s+section:\s*(esik-[^\n]+)$/gm)].map((m) => m[1]);
        hits.push({ url, sections: matches });
      }
    } catch {
      // Bazı sayfalar body çekemez (örn. kategori), sessiz geç
    }
  }
  return hits;
}

async function main() {
  const slug = '/sen-neredesin';
  log(`# Eşik dump — ${slug}`);
  log('');

  const body = await fetchPageBody(slug);
  if (!body) {
    console.error(`HATA: ${slug} bulunamadı.`);
    process.exit(1);
  }

  // Ham section listesi
  const sectionNames = [...body.matchAll(/^##\s+section:\s*(.+)$/gm)].map((m) => m[1].trim());
  log('## Bulunan section listesi (sırayla)');
  for (const n of sectionNames) log(`  - ${n}`);
  log('');

  // mdast parse + split
  const tree = parseMd(body);
  const sections = splitSections(tree);
  // Not: brief regex `^esik-\d+-` numaralı varsayımına dayanıyordu; gerçek isimler
  // numarasız (esik-uyku, esik-merak, …). Burada whitelist-bazlı match ediyoruz ki
  // /hikaye, /, /site-rehber'deki `esik-kadini` prose section'ı ile karışmasın.
  const esikSections = sections.filter((s) => EXPECTED_ESIKLER.includes(s.name));
  const sonSozSection = sections.find((s) => s.name === 'son-soz');

  // ---- (1) Beklenen 10 eşik + son-soz ----
  log('## Beklenen vs gerçek');
  const found = new Set(esikSections.map((s) => s.name));
  const missing = EXPECTED_ESIKLER.filter((e) => !found.has(e));
  const extra = esikSections.filter((s) => !EXPECTED_ESIKLER.includes(s.name)).map((s) => s.name);
  log(`  - Beklenen eşik: ${EXPECTED_ESIKLER.length}, bulunan eşik: ${esikSections.length}`);
  if (missing.length) log(`  - EKSİK: ${missing.join(', ')}`);
  if (extra.length) log(`  - BEKLENMEYEN: ${extra.join(', ')}`);
  if (!missing.length && !extra.length) log('  - Eşik kümesi tam ✓');
  log(`  - son-soz section: ${sonSozSection ? 'var ✓' : 'YOK ✗'}`);
  log('');

  // ---- (2) Pattern A vs Pattern B (her esik section için) ----
  log('## Başlık kaynağı tanısı (Pattern A: section içinde ## h2 / Pattern B: yok)');
  log('');
  const patternHits = { A: 0, B: 0 };
  for (const sec of esikSections) {
    const h2 = findFirstH2(sec.content);
    const preview = previewSnippet(sec.content);
    if (h2) {
      patternHits.A++;
      log(`  [A] ${sec.name}`);
      log(`      h2: "${h2.text}"`);
      log(`      ilk paragraf: ${preview}`);
    } else {
      patternHits.B++;
      log(`  [B] ${sec.name}`);
      log(`      h2: (yok)`);
      log(`      ilk paragraf: ${preview}`);
    }
  }
  log('');
  log(`  Pattern A (h2 var): ${patternHits.A}/${esikSections.length}`);
  log(`  Pattern B (h2 yok): ${patternHits.B}/${esikSections.length}`);
  log('');

  // ---- (3) son-soz pattern'ı: dokunulmamalı ----
  if (sonSozSection) {
    log('## son-soz section ön bakış (dokunulmayacak, baseline prose kalacak)');
    log(`  ilk paragraf: ${previewSnippet(sonSozSection.content)}`);
    const sonSozH2 = findFirstH2(sonSozSection.content);
    log(`  h2 var mı: ${sonSozH2 ? `evet ("${sonSozH2.text}")` : 'yok'}`);
    log('');
  }

  // ---- (4) Diğer 5 kanonik section sayfada var mı? Plugin etkilemediğinden ----
  const canonicalInPage = sections
    .map((s) => s.name)
    .filter((n) =>
      ['hero', 'bir-sonraki', 'sonraki-bulusma', 'siradaki-kapi', 'sss'].includes(n),
    );
  log("## /sen-neredesin'deki kanonik section'lar (plugin etkilemeyecek)");
  log(`  ${canonicalInPage.length ? canonicalInPage.join(', ') : '(yok)'}`);
  log('');

  // ---- (5) esik-* pattern'i başka sayfada var mı? (name="esikler" güvenlik) ----
  log('## Çoklu sayfa güvenlik taraması (esik-* başka sayfada var mı?)');
  const otherHits = await checkOtherPagesForEsikPattern();
  if (otherHits.length === 0) {
    log('  Diğer sayfalarda esik-* pattern yok ✓');
    log('  → Plugin `name="esikler"` attribute sabit basabilir, çakışma yok.');
  } else {
    log('  UYARI: Başka sayfalarda da esik-* var:');
    for (const h of otherHits) log(`    - ${h.url}: ${h.sections.join(', ')}`);
    log('  → Plugin name attribute sayfa-bazlı türetilmeli (brief revize).');
  }
  log('');

  // ---- Sonuç ----
  log('## Yargı');
  const ok = missing.length === 0 && extra.length === 0 && sonSozSection;
  if (!ok) {
    log('  ✗ Brief varsayımı sapıyor — Paket 2\'ye geçmeden brief revize edilmeli.');
    process.exit(2);
  }
  if (patternHits.A === esikSections.length) {
    log('  ✓ Pattern A (her esik\'te ## h2 var) — plugin h2 strip + summary\'ye taşır.');
  } else if (patternHits.B === esikSections.length) {
    log('  ✓ Pattern B (hiç ## h2 yok) — plugin section-name\'den türetir.');
    log('    Türetme önerisi: "esik-0-uyku" → "0 · UYKU" (split + UPPERCASE + " · " join).');
  } else {
    log(`  ⚠ Karışık pattern — ${patternHits.A} eşik h2'li, ${patternHits.B} eşik h2'siz.`);
    log('    Brief revize edilmeli: ya Notion düzeltilir ya plugin her iki durumu da handle eder.');
  }
}

main().catch((err) => {
  console.error('esik dump hatası:', err.body ?? err.message ?? err);
  process.exit(1);
});
