#!/usr/bin/env node
/**
 * baslik-denetim.mjs — canlı dosyaların başlık bölgesini denetler.
 *
 * KARAR 581 uygulamasıdır: `00-durum.md` · `02-borclar.md` · `03-sira.md`
 * başlık bölgesi **replace-only**'dir ve yalnız şunu taşır:
 * tarih · tur adı · (varsa) dönem HEAD. Başka hiçbir şey.
 *
 * Başlıkta yaşayamaz: `önceki:` zinciri · ölçüm paragrafları · sayaç ·
 * tarihçe anlatısı. Hepsi kronolojiye aittir. Başlığın işi "şu an ne doğru",
 * "her ne doğru olduysa" değil.
 *
 * Kullanım:  node scripts/baslik-denetim.mjs
 * Çıkış:     0 → temiz (sessiz) · 1 → bulgu var (dosya + satır + sebep basar)
 *
 * ⚠ Bu YAPISAL bir denetimdir, marka dili denetimi değil. `ocak-lint`'e
 * eklenmez — o skill'in kapsamını bulandırır.
 *
 * ⚠ `90-kronoloji/` ve `20-ref-*.md` KAPSAM DIŞIDIR: orada tarihçe meşrudur.
 */

import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const KOK = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const DOSYALAR = ['docs/00-durum.md', 'docs/02-borclar.md', 'docs/03-sira.md'];

/** Başlık bölgesinde durabilecek en fazla dolu satır (KARAR 581). */
const TAVAN = 4;

/**
 * Ölçüm paragrafı deseni: **tek** `*` ile açılan italik blok (isteğe bağlı `⚠ `
 * önekiyle), içinde "ölçüm" geçiyor — `*19 Ağustos, yedinci ölçüm (...)` gibi.
 * Böyle bir blok kronolojiye aittir.
 *
 * ⚠ `(?!\*)` bilerek: `**kalın**` ile açılan satır ölçüm paragrafı DEĞİLDİR.
 * Tur adının kendisi "ölçüm" kelimesini taşıyabilir — bu denetçi ilk koşumunda
 * `00-durum.md`'nin *"ölçüm / yargı ayrımı turu"* başlığını yanlış yakaladı.
 * Desen, korunması gereken metinde de geçip geçmediği sınanarak daraltıldı
 * (CLAUDE.md §3).
 */
const OLCUM_DESENI = /^(⚠\s*)?\*(?!\*).*ölçüm/i;

/** `önceki:` zinciri — tur adı zinciri başlıkta yaşamaz. */
const ONCEKI_DESENI = /önceki:/i;

const bulgular = [];

for (const gorel of DOSYALAR) {
  const tam = join(KOK, gorel);
  if (!existsSync(tam)) {
    bulgular.push({ dosya: gorel, satir: 0, sebep: 'dosya bulunamadı' });
    continue;
  }

  const satirlar = readFileSync(tam, 'utf8').split('\n');

  // Başlık bölgesi: dosya başından ilk `---` satırına kadar (o satır hariç).
  let son = satirlar.findIndex((s) => s.trim() === '---');
  if (son === -1) {
    bulgular.push({ dosya: gorel, satir: 0, sebep: 'ilk `---` yok — başlık bölgesi sınırsız' });
    son = satirlar.length;
  }
  const baslik = satirlar.slice(0, son);

  // Satır satır desen taraması.
  baslik.forEach((satir, i) => {
    const no = i + 1;
    if (ONCEKI_DESENI.test(satir)) {
      bulgular.push({ dosya: gorel, satir: no, sebep: '`önceki:` zinciri başlıkta — kronolojiye ait' });
    }
    if (OLCUM_DESENI.test(satir)) {
      bulgular.push({ dosya: gorel, satir: no, sebep: 'ölçüm paragrafı başlıkta — kronolojiye ait' });
    }
  });

  // Tavan: boş satırlar sayılmaz, dolu satırlar sayılır.
  const dolu = baslik.map((s, i) => [i + 1, s]).filter(([, s]) => s.trim() !== '');
  if (dolu.length > TAVAN) {
    const [ilkFazla] = dolu[TAVAN];
    bulgular.push({
      dosya: gorel,
      satir: ilkFazla,
      sebep: `başlık bölgesi ${dolu.length} dolu satır — tavan ${TAVAN} (KARAR 581)`,
    });
  }
}

if (bulgular.length === 0) process.exit(0);

for (const b of bulgular) console.error(`${b.dosya}:${b.satir} — ${b.sebep}`);
console.error(`\n${bulgular.length} bulgu. Başlık bölgesi yalnız tarih · tur adı · (varsa) dönem HEAD taşır.`);
process.exit(1);
