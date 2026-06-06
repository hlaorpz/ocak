/**
 * kodlar-test.mjs — Kodlar DB indirim doğrulama helper smoke test
 * (Brief brief-odeme-asama1-kodlar.md — Aşama 1 B.3, kalıcı araç).
 *
 * Notion'a karşı round-trip — Kaan DB'ye şu test kodlarını girer:
 *
 *   TEST50      Yüzde, Değer=50, Aktif=✓
 *   TESTSABIT   Sabit Tutar, Değer=250, Aktif=✓
 *   TESTBURS    Tam Burs, Aktif=✓
 *   TESTPASIF   (her şey), Aktif=✗
 *   TESTGECMIS  Yüzde, Aktif=✓, Son Geçerlilik=geçmiş tarih
 *   TESTLIMIT   Yüzde, Aktif=✓, Kullanım Limiti=1, Kullanım Sayısı=1
 *   TESTFORMAT  Yüzde, Aktif=✓, Geçerli Formatlar=[workshop]   (cember ile çağrılır → format-disi)
 *   TESTHARIC   Yüzde, Aktif=✓, Hariç Formatlar=[istanbul]    (istanbul ile çağrılır → format-disi)  [opsiyonel]
 *
 * Kod eksikse o senaryo SKIP olur (PASS/FAIL etkilenmez).
 *
 * Round-trip: TEST50 üzerinde Kullanım Sayısı +1 → oku → -1 (geri alır).
 * Test DB'yi temiz bırakır.
 *
 * Çalıştır:
 *   node --experimental-strip-types --env-file=.env scripts/kodlar-test.mjs
 *
 * (kodlar.ts .ts import edildiği için strip-types şart — cember-dump.mjs paterni.)
 */

import { Client } from '@notionhq/client';
import { kodDogrula, kodKullanimArtir } from '../src/lib/kodlar.ts';

const { NOTION_TOKEN, NOTION_KODLAR_DB_ID } = process.env;
if (!NOTION_TOKEN || !NOTION_KODLAR_DB_ID) {
  console.error('HATA: NOTION_TOKEN / NOTION_KODLAR_DB_ID yok. --env-file=.env ile koş.');
  process.exit(1);
}

const notion = new Client({ auth: NOTION_TOKEN });
const DB = NOTION_KODLAR_DB_ID;

const sonuc = { pass: 0, fail: 0, skip: 0 };

/** Bir senaryoyu koş + raporla. expected.gecerli=true ise tip+tutar kontrolü. */
async function senaryo(label, kod, format, tutar, expected) {
  const sonucObj = await kodDogrula(notion, DB, kod, format, tutar);

  // Bulunamadı + beklenen ≠ bulunamadi → SKIP (kod DB'de yok, Kaan girmemiş).
  if (!sonucObj.gecerli && sonucObj.sebep === 'bulunamadi' && expected.sebep !== 'bulunamadi') {
    console.log(`SKIP   ${label}   (kod "${kod}" DB'de yok — Kaan girmemiş)`);
    sonuc.skip++;
    return;
  }

  let ok = false;
  let detay = '';
  if (expected.gecerli && sonucObj.gecerli) {
    // expected.tip undefined ise sadece "geçerli mi?" kontrolü (bypass testi gibi).
    if (expected.tip === undefined) {
      ok = true;
      detay = `tip=${sonucObj.tip} indirim=${sonucObj.indirimTutari} yeni=${sonucObj.yeniTutar}`;
    } else {
      ok =
        sonucObj.tip === expected.tip &&
        sonucObj.indirimTutari === expected.indirimTutari &&
        sonucObj.yeniTutar === expected.yeniTutar;
      detay = `tip=${sonucObj.tip} indirim=${sonucObj.indirimTutari} yeni=${sonucObj.yeniTutar}`;
    }
  } else if (!expected.gecerli && !sonucObj.gecerli) {
    ok = sonucObj.sebep === expected.sebep;
    detay = `sebep=${sonucObj.sebep}`;
  } else {
    detay = `beklenen.gecerli=${expected.gecerli} oldu.gecerli=${sonucObj.gecerli}`;
  }

  if (ok) {
    console.log(`PASS   ${label}   ${detay}`);
    sonuc.pass++;
  } else {
    const beklendi = expected.gecerli
      ? `gecerli tip=${expected.tip} indirim=${expected.indirimTutari} yeni=${expected.yeniTutar}`
      : `gecersiz sebep=${expected.sebep}`;
    console.log(`FAIL   ${label}   beklenen: ${beklendi} | oldu: ${detay}`);
    sonuc.fail++;
  }
}

async function roundTrip() {
  console.log('\n— Round-trip (TEST50 sayaç +1 → -1) —');
  const oncesi = await kodDogrula(notion, DB, 'TEST50', 'cember', 1000);
  if (!oncesi.gecerli) {
    console.log(`SKIP   round-trip   (TEST50 geçerli değil: ${oncesi.sebep})`);
    sonuc.skip++;
    return;
  }
  const kodId = oncesi.kodId;
  const sayacOnce = await sayacOku(kodId);
  const sayacArti = await kodKullanimArtir(notion, kodId);
  const sayacSonra = await sayacOku(kodId);
  // Geri al — sayacı önceki değere set et (DB'yi temiz bırak).
  await notion.pages.update({
    page_id: kodId,
    properties: { 'Kullanım Sayısı': { number: sayacOnce } },
  });
  const sayacGeri = await sayacOku(kodId);
  const ok = sayacArti === sayacOnce + 1 && sayacSonra === sayacOnce + 1 && sayacGeri === sayacOnce;
  if (ok) {
    console.log(`PASS   round-trip   önce=${sayacOnce} → +1=${sayacArti} → geri=${sayacGeri}`);
    sonuc.pass++;
  } else {
    console.log(
      `FAIL   round-trip   önce=${sayacOnce} return=${sayacArti} okumA=${sayacSonra} geri=${sayacGeri}`,
    );
    sonuc.fail++;
  }
}

async function sayacOku(kodId) {
  const p = await notion.pages.retrieve({ page_id: kodId });
  const prop = p.properties['Kullanım Sayısı'];
  return prop?.type === 'number' ? (prop.number ?? 0) : 0;
}

async function main() {
  console.log('== Kodlar DB doğrulama smoke test ==');
  console.log(`DB: ${DB}\n`);

  await senaryo('TEST50 (Yüzde 50, tutar 1000)', 'TEST50', 'cember', 1000, {
    gecerli: true,
    tip: 'yuzde',
    indirimTutari: 500,
    yeniTutar: 500,
  });
  await senaryo('TESTSABIT (Sabit 250, tutar 1000)', 'TESTSABIT', 'cember', 1000, {
    gecerli: true,
    tip: 'sabit',
    indirimTutari: 250,
    yeniTutar: 750,
  });
  await senaryo('TESTBURS (Tam Burs, tutar 1000)', 'TESTBURS', 'cember', 1000, {
    gecerli: true,
    tip: 'tam-burs',
    indirimTutari: 1000,
    yeniTutar: 0,
  });
  await senaryo('TESTPASIF (Aktif=✗)', 'TESTPASIF', 'cember', 1000, {
    gecerli: false,
    sebep: 'pasif',
  });
  await senaryo('TESTGECMIS (Son Geçerlilik geçmiş)', 'TESTGECMIS', 'cember', 1000, {
    gecerli: false,
    sebep: 'suresi-gecmis',
  });
  await senaryo('TESTLIMIT (sayı=limit)', 'TESTLIMIT', 'cember', 1000, {
    gecerli: false,
    sebep: 'limit-doldu',
  });
  await senaryo('TESTFORMAT (whitelist=workshop, çağrı=cember)', 'TESTFORMAT', 'cember', 1000, {
    gecerli: false,
    sebep: 'format-disi',
  });
  await senaryo('TESTHARIC (blacklist=istanbul, çağrı=istanbul)', 'TESTHARIC', 'istanbul', 1000, {
    gecerli: false,
    sebep: 'format-disi',
  });
  // Bypass: TESTHARIC istanbul'da format-disi ama cember'de geçerli olmalı
  // (tip/tutar Kaan'a göre değişir — sadece "geçerli mi?" kontrolü).
  await senaryo('TESTHARIC (blacklist=istanbul, çağrı=cember) — bypass', 'TESTHARIC', 'cember', 1000, {
    gecerli: true,
  });
  await senaryo('YOKBOYLEKOD', 'YOKBOYLEKOD' + Math.random().toString(36).slice(2), 'cember', 1000, {
    gecerli: false,
    sebep: 'bulunamadi',
  });

  await roundTrip();

  console.log(`\n== Özet: PASS ${sonuc.pass} · FAIL ${sonuc.fail} · SKIP ${sonuc.skip} ==`);
  if (sonuc.fail > 0) process.exit(1);
}

main().catch((err) => {
  console.error('Smoke test hatası:', err.body ?? err.message ?? err);
  process.exit(1);
});
