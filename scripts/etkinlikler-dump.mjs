/**
 * etkinlikler-dump.mjs — Etkinlikler loader smoke test (Sohbet #22, Brief 3)
 *
 * notion-etkinlikler.ts (.ts) import edildiği için type-stripping flag'i gerekir:
 *   node --experimental-strip-types --env-file=.env scripts/etkinlikler-dump.mjs
 *
 * Kalıcı araç — transform + next-3 veri akışını + enum tutarlılığını Notion'a karşı doğrular.
 */

import { Client } from '@notionhq/client';
import { fetchEtkinlikler, transformEtkinlik } from '../src/lib/notion-etkinlikler.ts';

const { NOTION_TOKEN, NOTION_EVENTS_DB_ID } = process.env;
if (!NOTION_TOKEN || !NOTION_EVENTS_DB_ID) {
  console.error('HATA: NOTION_TOKEN / NOTION_EVENTS_DB_ID yok. --env-file=.env ile koş.');
  process.exit(1);
}

const notion = new Client({ auth: NOTION_TOKEN });
const log = (s = '') => console.log(s);

// Schema'daki enum beklentileri (config.ts ile aynı) — sapma testi için.
const EXPECTED = {
  Format: ['Yolculuk', 'Mini Retreat', 'Şehir Akşamı', 'Atölye', 'Seremoni', 'Açık Kapı', 'Çember'],
  'Mekân/Platform': ['Online', 'İzmir', 'İstanbul', 'Ege', 'Anadolu', 'Ankara', 'Zoom'],
  Statü: ['Taslak', 'Kayıt Açık', 'Dolu', 'Geçti', 'İptal'],
};

/** Bir etkinliği kompakt frontmatter bloğu olarak basar. */
function dumpEtkinlik(fm, idx) {
  log(`### #${idx} — ${fm.baslik}`);
  log('| Alan | Değer |');
  log('| --- | --- |');
  log(`| tip | ${fm.tip} |`);
  log(`| tarihBaslangic | ${fm.tarihBaslangic || '∅'} |`);
  log(`| tarihBitis | ${fm.tarihBitis ?? '∅ (tek gün)'} |`);
  log(`| saat | ${fm.saat ?? '∅'} |`);
  log(`| mekan | ${fm.mekan || '∅'} |`);
  log(`| mekanDetay | ${fm.mekanDetay ?? '∅'} |`);
  log(`| kayitUrl | ${fm.kayitUrl ?? '∅'} |`);
  log(`| durum | ${fm.durum || '∅'} |`);
  log(`| siteGoster | ${fm.siteGoster} |`);
  log(`| oneCikar | ${fm.oneCikar} |`);
  log(`| aciklama | ${(fm.aciklama ?? '∅').replace(/\n/g, ' ').slice(0, 80)} |`);
  log(`| slug | ${fm.slug ?? '∅'} |`);
  log(`| yoneten | ${fm.yoneten ?? '∅'} |`);
  log(`| detay (ilk 120 kar) | ${(fm.detay ?? '∅').replace(/\n/g, ' ').slice(0, 120)} |`);
  log(`| notion_id | ${fm.notion_id} |`);
  log('');
}

async function main() {
  const rows = await fetchEtkinlikler(notion, NOTION_EVENTS_DB_ID);
  const all = rows.map(transformEtkinlik);

  // Loader publish filtresiyle BİREBİR aynı (config.ts Brief 5).
  const AKTIF_DURUM = new Set(['Kayıt Açık', 'Dolu']);
  const publishAday = all
    .filter((e) => e.siteGoster && AKTIF_DURUM.has(e.durum))
    // Component (SonrakiBulusma) sıralaması: oneCikar, tarihBaslangic, baslik(TR).
    .sort((a, b) => {
      if (a.oneCikar !== b.oneCikar) return a.oneCikar ? -1 : 1;
      if (a.tarihBaslangic !== b.tarihBaslangic) return a.tarihBaslangic.localeCompare(b.tarihBaslangic);
      return a.baslik.localeCompare(b.baslik, 'tr');
    });

  log('## Etkinlikler — sayım');
  log('');
  log(`- Raw (tüm satır): ${all.length}`);
  log(`- Publish-aday (siteGoster=true VE durum∈{Kayıt Açık,Dolu}): ${publishAday.length}`);
  log('');

  // ── Tüm etkinlikler (filtre öncesi, ilk 3 tam frontmatter) ──
  log('## Tüm etkinlikler — ilk 3 (filtre öncesi, raw)');
  log('');
  all.slice(0, 3).forEach((fm, i) => dumpEtkinlik(fm, i + 1));

  // ── Publish-aday tablosu (filtre sonrası, sıralı = sitede görünecek sıra) ──
  log('## Publish-aday (loader filtresi + component sıralaması — sitede görünecek sıra)');
  log('');
  if (publishAday.length === 0) {
    log('(0 yayınlanacak etkinlik — şu an hepsi Taslak. Kaan lansman öncesi Kayıt Açık\'a çevirecek.)');
  } else {
    log('| # | tarihBaslangic | tarihBitis | baslik | tip | durum | oneCikar |');
    log('| --- | --- | --- | --- | --- | --- | --- |');
    publishAday.forEach((e, i) => {
      log(`| ${i + 1} | ${e.tarihBaslangic} | ${e.tarihBitis ?? '—'} | ${e.baslik} | ${e.tip} | ${e.durum} | ${e.oneCikar} |`);
    });
  }
  log('');

  // ── Sapma raporu (enum tutarlılık testi) ──
  log('## Sapma raporu (Notion enum option\'ları vs schema beklentisi)');
  log('');
  const db = await notion.databases.retrieve({ database_id: NOTION_EVENTS_DB_ID });
  let sapmaVar = false;
  for (const [prop, expected] of Object.entries(EXPECTED)) {
    const def = db.properties[prop];
    const actual = def?.type === 'select' ? def.select.options.map((o) => o.name) : [];
    const eklenen = actual.filter((o) => !expected.includes(o));
    const silinen = expected.filter((o) => !actual.includes(o));
    if (eklenen.length || silinen.length) {
      sapmaVar = true;
      log(`- ⚠ **${prop}**: ${eklenen.length ? `Notion'da YENİ: [${eklenen.join(', ')}] ` : ''}${silinen.length ? `schema'da var ama Notion'da YOK: [${silinen.join(', ')}]` : ''}`);
    } else {
      log(`- ✓ ${prop}: ${actual.length} option, schema ile birebir`);
    }
  }
  if (!sapmaVar) log('\nSonuç: enum sapması YOK — schema Notion ile senkron.');
  log('');
}

main().catch((err) => {
  console.error('Smoke test hatası:', err.body ?? err.message ?? err);
  process.exit(1);
});
