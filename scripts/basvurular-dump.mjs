/**
 * basvurular-dump.mjs — #28 Brief A Notion Başvurular DB dump + sapma haritası (kalıcı yardımcı).
 * iletisim-dump.mjs / notion-discover.mjs kardeşi.
 *
 *   node --env-file=.env scripts/basvurular-dump.mjs
 *
 * KARAR 97 token disiplini: değerler stdout'a basılır ama property ŞEMA odaklıdır.
 * Brief 0'da Kaan'ın kurduğu 18 property beklentisi ile gerçek DB karşılaştırılır,
 * sapma varsa rapor edilir (Brief B'ye geçmeden Kaan düzeltir).
 */

import { Client } from '@notionhq/client';

const { NOTION_TOKEN, NOTION_BASVURULAR_DB_ID } = process.env;
if (!NOTION_TOKEN || !NOTION_BASVURULAR_DB_ID) {
  console.error('HATA: NOTION_TOKEN / NOTION_BASVURULAR_DB_ID yok. --env-file=.env ile koş.');
  process.exit(1);
}
const notion = new Client({ auth: NOTION_TOKEN });

// Brief 0 beklentisi (18 property). Tip = Notion API tip adı.
// "text" Notion UI'da, API'da "rich_text" geliyor — eşleme aşağıda.
const EXPECTED = [
  { name: 'Ad', type: 'title' },
  { name: 'Email', type: 'email' },
  { name: 'Telefon', type: 'phone_number' },
  {
    name: 'Tip',
    type: 'select',
    options: ['Anadolu', 'Çember', 'Açık Kapı', 'Ateş Mektupları'],
  },
  {
    name: 'İlk dokunuş kanalı',
    type: 'select',
    options: ['Instagram', 'Arkadaş', 'Google', 'Etkinlik', 'Diğer'],
  },
  { name: 'Tarih', type: 'created_time' },
  {
    name: 'Durum',
    type: 'select',
    options: ['Yeni', 'Tanışma Bekliyor', 'Görüşüldü', 'Kabul', 'Red', 'Yedek'],
  },
  { name: 'Kaynak', type: 'rich_text' },
  { name: 'Niyet mektubu', type: 'rich_text' },
  { name: 'Geçiş notu', type: 'rich_text' },
  { name: 'Sağlık notu', type: 'rich_text' },
  { name: 'Çember deneyimi', type: 'rich_text' },
  { name: 'Yaş', type: 'number' },
  { name: 'Şehir', type: 'rich_text' },
  {
    name: 'Ekonomik katılım',
    type: 'select',
    options: ['Tam', 'Burs Talep', 'Askıda Yer'],
  },
  { name: 'Atanan', type: 'people' },
  { name: 'Görüşme tarihi', type: 'date' },
  { name: 'Notlar', type: 'rich_text' },
];

function optionsOf(prop) {
  if (prop.type === 'select') return prop.select.options.map((o) => o.name);
  if (prop.type === 'multi_select') return prop.multi_select.options.map((o) => o.name);
  if (prop.type === 'status') return prop.status.options.map((o) => o.name);
  return null;
}

async function dump() {
  console.log('='.repeat(72));
  console.log('## Başvurular DB');
  console.log('='.repeat(72));
  console.log('');

  // 1. Şema
  const db = await notion.databases.retrieve({ database_id: NOTION_BASVURULAR_DB_ID });
  const title = db.title?.map((t) => t.plain_text).join('') || '(boş)';
  console.log(`DB başlığı: ${title}`);
  console.log(`DB ID: ${NOTION_BASVURULAR_DB_ID.slice(0, 4)}...${NOTION_BASVURULAR_DB_ID.slice(-4)}`);
  console.log('');

  const actualProps = db.properties;
  const actualEntries = Object.entries(actualProps);
  console.log(`Property sayısı: ${actualEntries.length} (beklenen: ${EXPECTED.length})`);
  console.log('');

  // 2. Tablo halinde gerçek property'ler
  console.log('| # | Ad | Tip | Options (varsa) |');
  console.log('| --- | --- | --- | --- |');
  const sortedActual = actualEntries.slice().sort((a, b) => a[0].localeCompare(b[0], 'tr'));
  sortedActual.forEach(([name, prop], idx) => {
    const opts = optionsOf(prop);
    console.log(`| ${idx + 1} | ${name} | ${prop.type} | ${opts ? opts.join(', ') : ''} |`);
  });
  console.log('');

  // 3. SAPMA HARİTASI
  console.log('## Sapma haritası');
  console.log('');
  const sapmalar = [];
  const expectedNames = new Set(EXPECTED.map((e) => e.name));

  for (const exp of EXPECTED) {
    const actual = actualProps[exp.name];
    if (!actual) {
      sapmalar.push(`PROPERTY EKSİK: ${exp.name} (${exp.type})`);
      continue;
    }
    if (actual.type !== exp.type) {
      sapmalar.push(`PROPERTY TİP YANLIŞ: ${exp.name} beklenen ${exp.type}, gerçek ${actual.type}`);
      continue;
    }
    if (exp.options) {
      const actualOpts = optionsOf(actual) ?? [];
      for (const o of exp.options) {
        if (!actualOpts.includes(o)) {
          sapmalar.push(`SELECT OPTION EKSİK: ${exp.name} → "${o}"`);
        }
      }
    }
  }
  // Beklenmeyen ekstra property'ler (uyarı, hata değil)
  const ekstralar = [];
  for (const [name] of actualEntries) {
    if (!expectedNames.has(name)) ekstralar.push(name);
  }

  if (sapmalar.length === 0) {
    console.log('✓ Sapma yok. 18/18 property beklentiye uygun.');
  } else {
    console.log(`✗ ${sapmalar.length} sapma:`);
    for (const s of sapmalar) console.log(`  - ${s}`);
  }
  if (ekstralar.length) {
    console.log('');
    console.log(`⚠ Ekstra property (uyarı, hata değil): ${ekstralar.length}`);
    for (const e of ekstralar) console.log(`  - EKSTRA PROPERTY: ${e}`);
  }
  console.log('');

  // 4. Smoke satır(lar)
  console.log('## Smoke satır(lar)');
  console.log('');
  const queryRes = await notion.databases.query({
    database_id: NOTION_BASVURULAR_DB_ID,
    page_size: 10,
  });
  const rows = queryRes.results.filter((r) => 'properties' in r);
  console.log(`DB satır sayısı: ${rows.length}`);
  for (const row of rows) {
    const props = row.properties;
    const ad = props['Ad']?.title?.map((t) => t.plain_text).join('') ?? '(ad yok)';
    const email = props['Email']?.email ?? '∅';
    const tip = props['Tip']?.select?.name ?? '∅';
    const durum = props['Durum']?.select?.name ?? '∅';
    console.log(`  - ${ad} (${email}) Tip:${tip} Durum:${durum}`);
  }
  console.log('');

  // 5. Sonuç
  console.log('='.repeat(72));
  if (sapmalar.length === 0) {
    console.log('SONUÇ: Sapma yok → Brief B başlayabilir.');
  } else {
    console.log('SONUÇ: SAPMA VAR → Brief B BAŞLAMAZ. Kaan Notion\'da düzeltir, Brief A tekrar koşulur.');
  }
  console.log('='.repeat(72));

  return sapmalar.length;
}

const sapmaCount = await dump();
process.exit(sapmaCount === 0 ? 0 : 2);
