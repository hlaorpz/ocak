#!/usr/bin/env node
/**
 * durum-uret.mjs — `docs/04-olcum.md`'yi sıfırdan üretir.
 *
 * KARAR 578 (üretilen / yazılan ayrımı) uygulamasıdır. Buradan çıkan her satır
 * bir komutun çıktısıdır; yargı, gerekçe ve teşhis bu dosyaya girmez.
 *
 * Kullanım:
 *   node scripts/durum-uret.mjs              # ucuz koşum — ağ yok, test yok, build yok
 *   node scripts/durum-uret.mjs --test       # + `npx vitest run`
 *   node scripts/durum-uret.mjs --build      # + `npm run build`
 *   node scripts/durum-uret.mjs --test --build
 *
 * KARAR 470: koşulmayan ayak "bu koşumda ölçülmedi" yazar. Son bilinen değeri
 * TAŞIMAZ. Devralınan rakam yasaktır.
 *
 * KARAR 469 / 05-harita §3: Vercel paneli bu betiğe kapalıdır. `vercel` CLI
 * çağrılmaz, ağa çıkılmaz; yalnız `.vercel/` altındaki yerel dosyalar okunur.
 */

import { execSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const KOK = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const HEDEF = join(KOK, 'docs', '04-olcum.md');
const OLCULMEDI = '*bu koşumda ölçülmedi*';

const bayraklar = new Set(process.argv.slice(2));
const TEST_ISTENDI = bayraklar.has('--test');
const BUILD_ISTENDI = bayraklar.has('--build');

/** Komutu koşar, `stdout`u döner. Düşerse `null` — asla uydurma değer dönmez. */
function kabuk(komut, { uzunSurer = false } = {}) {
  try {
    return execSync(komut, {
      cwd: KOK,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      maxBuffer: 64 * 1024 * 1024,
      timeout: uzunSurer ? 10 * 60 * 1000 : 60 * 1000,
    });
  } catch (hata) {
    // Koşum düştüyse çıktısı yine de bilgidir (vitest kırmızıda 1 döner).
    if (hata && typeof hata.stdout === 'string') return hata.stdout + (hata.stderr || '');
    return null;
  }
}

/** Tek satırlık komut çıktısı — `null` ise ölçülemedi. */
function tekSatir(komut) {
  const c = kabuk(komut);
  return c === null ? null : c.trim();
}

function satirSayisi(gorelYol) {
  const tam = join(KOK, gorelYol);
  if (!existsSync(tam)) return null;
  const icerik = readFileSync(tam, 'utf8');
  if (icerik === '') return 0;
  // `wc -l` ile aynı tanım: satır sonu karakteri sayısı.
  return icerik.split('\n').length - (icerik.endsWith('\n') ? 1 : 0);
}

function yok(deger) {
  return deger === null || deger === undefined || deger === '' ? OLCULMEDI : deger;
}

// ── 1 · Canlı HEAD ───────────────────────────────────────────────────────────
const headHam = tekSatir("git log -1 --format='%H%x09%h%x09%ad%x09%s' --date=short");
const [, headKisa, headTarih, headKonu] = (headHam || '\t\t\t').split('\t');

// ── 2 · Çalışma ağacı ────────────────────────────────────────────────────────
const porcelain = kabuk('git status --porcelain');
const agacTemiz = porcelain === null ? null : porcelain.trim() === '';
const kirliSayi = porcelain === null ? null : porcelain.trim() === '' ? 0 : porcelain.trim().split('\n').length;

// ── 3 · Dal farkı: main ↔ astro-iskelet ──────────────────────────────────────
const dalVar = (kabuk('git rev-parse --verify --quiet astro-iskelet') || '').trim() !== '';
const mainOnde = dalVar ? tekSatir('git rev-list --count astro-iskelet..main') : null;
const mainGeride = dalVar ? tekSatir('git rev-list --count main..astro-iskelet') : null;

// ── 4 · Test — yalnız --test ile ─────────────────────────────────────────────
let testSatiri = OLCULMEDI;
if (TEST_ISTENDI) {
  const cikti = kabuk('npx vitest run 2>&1', { uzunSurer: true });
  if (cikti === null) {
    testSatiri = '⚠ koşum düştü, çıktı alınamadı';
  } else {
    const dosya = cikti.match(/Test Files\s+(.+)/);
    const vaka = cikti.match(/\bTests\s+(.+)/);
    const d = dosya ? dosya[1].trim() : null;
    const v = vaka ? vaka[1].trim() : null;
    testSatiri = v && d ? `${v} · dosya: ${d}` : '⚠ çıktı ayrıştırılamadı';
  }
}

// ── 5 · Build sayımı — yalnız --build ile ────────────────────────────────────
let buildSatirlari = null;
if (BUILD_ISTENDI) {
  const cikti = kabuk('npm run build 2>&1', { uzunSurer: true });
  const dustu = cikti === null || !/\[build\] Complete!/.test(cikti);
  if (dustu) {
    buildSatirlari = { hata: '⚠ build düştü ya da tamamlanmadı — sayım yapılmadı' };
  } else {
    // Prerender: `dist/client` altında üretilen `index.html` sayısı.
    const prerender = sayHtml(join(KOK, 'dist', 'client'));
    // SSR + API: Vercel adaptörünün ürettiği route tablosu.
    let ssrToplam = null, api = null;
    const cfg = join(KOK, '.vercel', 'output', 'config.json');
    if (existsSync(cfg)) {
      try {
        const routes = JSON.parse(readFileSync(cfg, 'utf8')).routes || [];
        const render = routes
          .filter((r) => r.dest === '_render' && typeof r.src === 'string')
          .map((r) => r.src)
          .filter((s) => !s.includes('_image') && !s.includes('_server-islands'));
        ssrToplam = render.length;
        api = render.filter((s) => s.startsWith('^/api/')).length;
      } catch { /* ayrıştırılamadı → null kalır */ }
    }
    buildSatirlari = { prerender, ssrToplam, api, ssrSayfa: ssrToplam === null || api === null ? null : ssrToplam - api };
  }
}

function sayHtml(dizin) {
  if (!existsSync(dizin)) return null;
  let n = 0;
  const yigin = [dizin];
  while (yigin.length) {
    const d = yigin.pop();
    for (const ad of readdirSync(d)) {
      const tam = join(d, ad);
      if (statSync(tam).isDirectory()) yigin.push(tam);
      else if (ad === 'index.html') n += 1;
    }
  }
  return n;
}

// ── 6 · docs/ canlı dosya satır sayıları ─────────────────────────────────────
const canliDosyalar = [
  'docs/00-durum.md',
  'docs/02-borclar.md',
  'docs/03-sira.md',
  'docs/05-harita.md',
  'docs/01-kararlar.tsv',
];
const satirlar = canliDosyalar.map((y) => [y, satirSayisi(y)]);
const durumSatir = satirSayisi('docs/00-durum.md');

// ── 7 · Borç sayımı ──────────────────────────────────────────────────────────
const borcYolu = join(KOK, 'docs', '02-borclar.md');
let borc = { toplam: null, damgali: null, isDegil: null, acik: null, mukerrer: null };
if (existsSync(borcYolu)) {
  const basliklar = readFileSync(borcYolu, 'utf8').split('\n').filter((s) => /^## B/.test(s));
  const toplam = basliklar.length;
  const damgali = basliklar.filter((s) => /[✅❌]/u.test(s)).length;
  const isDegil = basliklar.filter((s) => /[⏸🔵]/u.test(s)).length;
  const numaralar = basliklar.map((s) => (s.match(/^## (B[0-9]+)/) || [])[1]).filter(Boolean);
  const gorulen = new Set();
  const mukerrer = new Set();
  for (const n of numaralar) (gorulen.has(n) ? mukerrer : gorulen).add(n);
  borc = { toplam, damgali, isDegil, acik: toplam - damgali - isDegil, mukerrer: mukerrer.size };
}

// ── 8 · Ledger: son numara · satır · dört bütünlük kontrolü ──────────────────
const tsvYolu = join(KOK, 'docs', '01-kararlar.tsv');
let ledger = null;
if (existsSync(tsvYolu)) {
  const ham = readFileSync(tsvYolu, 'utf8').split('\n').filter((s) => s !== '');
  const govde = ham.slice(1).map((s) => s.split('\t'));
  const ENUM = ['AKTIF', 'KALICI', 'SUPERSEDE', 'ONERI', 'IPTAL', 'ACIK-BORC', 'TEYITSIZ', 'KULLANILMADI', 'REZERVE'];
  const numaralar = govde.map((h) => Number(h[0])).filter((n) => Number.isFinite(n));
  const gorulen = new Set();
  const mukerrer = new Set();
  for (const n of numaralar) (gorulen.has(n) ? mukerrer : gorulen).add(n);
  const durumlar = [...new Set(govde.map((h) => h[3]).filter(Boolean))];
  ledger = {
    sonNumara: numaralar.length ? Math.max(...numaralar) : null,
    satir: ham.length,
    altiSutunDisi: govde.filter((h) => h.length !== 6).length,
    mukerrer: mukerrer.size,
    enumDisi: durumlar.filter((d) => !ENUM.includes(d)),
    kaynakBos: govde.filter((h) => (h[5] || '').trim() === '').length,
  };
}

// ── 9 · Vercel kimliği — yalnız yerel dosyadan ───────────────────────────────
// project.json birincil kaynaktır. Yoksa repo.json'un projects[0] kaydına düşülür
// (id · name · orgId). İkisi de yoksa alan atlanır — uydurulmaz.
let vercel = null;
const projectJson = join(KOK, '.vercel', 'project.json');
const repoJson = join(KOK, '.vercel', 'repo.json');
if (existsSync(projectJson)) {
  try {
    const j = JSON.parse(readFileSync(projectJson, 'utf8'));
    vercel = { kaynak: '.vercel/project.json', id: j.projectId, ad: j.projectName, org: j.orgId };
  } catch { /* bozuk dosya → null */ }
}
if (!vercel && existsSync(repoJson)) {
  try {
    const p = (JSON.parse(readFileSync(repoJson, 'utf8')).projects || [])[0];
    if (p) vercel = { kaynak: '.vercel/repo.json', id: p.id, ad: p.name, org: p.orgId };
  } catch { /* bozuk dosya → null */ }
}

// ── Yazım ────────────────────────────────────────────────────────────────────
const simdi = new Date().toLocaleString('tr-TR', {
  timeZone: 'Europe/Istanbul',
  day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
});

const s = [];
s.push('<!-- ÜRETİLEN DOSYA — ELLE DÜZENLENMEZ. Kaynak: scripts/durum-uret.mjs -->');
s.push('');
s.push('# OCAK — ÖLÇÜM');
s.push('');
s.push(`**Koşum:** ${simdi} (Europe/Istanbul) · bayraklar: \`${[...bayraklar].join(' ') || '(yok)'}\``);
s.push('');
s.push('> Bu dosyadaki her satır bir komutun çıktısıdır (**KARAR 578**). Yanlışsa dosya');
s.push('> düzeltilmez — `scripts/durum-uret.mjs` düzeltilir ve yeniden koşulur');
s.push('> (`05-harita.md` kural 1-b). Yargı, gerekçe ve teşhis burada **yaşamaz**;');
s.push('> onlar `00-durum.md`\'de ve kronolojide yaşar.');
s.push('>');
s.push('> Koşulmayan ayak **"bu koşumda ölçülmedi"** yazar ve son bilinen değeri **taşımaz**');
s.push('> (**KARAR 470**). Devralınan rakam yasaktır.');
s.push('');
s.push('---');
s.push('');
s.push('## GIT');
s.push('');
s.push('| alan | değer | kaynak |');
s.push('|---|---|---|');
s.push(`| canlı HEAD | \`${yok(headKisa)}\` | \`git log -1\` |`);
s.push(`| HEAD tarihi | ${yok(headTarih)} | \`git log -1 --date=short\` |`);
s.push(`| HEAD konusu | ${yok(headKonu)} | \`git log -1 --format=%s\` |`);
s.push(
  `| çalışma ağacı | ${agacTemiz === null ? OLCULMEDI : agacTemiz ? '**temiz**' : `**kirli** — ${kirliSayi} kayıt`} | \`git status --porcelain\` |`
);
s.push(
  `| \`main\` ↔ \`astro-iskelet\` | ${
    dalVar ? `main **${yok(mainOnde)}** commit önde · **${yok(mainGeride)}** commit geride` : OLCULMEDI + ' (dal yok)'
  } | \`git rev-list --count\` |`
);
s.push('');
s.push('## TEST');
s.push('');
s.push('| alan | değer | kaynak |');
s.push('|---|---|---|');
s.push(`| vitest sonucu | ${testSatiri} | \`npx vitest run\` |`);
if (!TEST_ISTENDI) {
  s.push('');
  s.push('*`--test` bayrağıyla koşulur.*');
}
s.push('');
s.push('## BUILD');
s.push('');
if (!BUILD_ISTENDI) {
  s.push(`${OLCULMEDI} — \`--build\` bayrağıyla koşulur.`);
} else if (buildSatirlari.hata) {
  s.push(buildSatirlari.hata);
} else {
  s.push('| alan | değer | kaynak |');
  s.push('|---|---|---|');
  s.push(`| prerender edilen sayfa | ${yok(buildSatirlari.prerender)} | \`dist/client\` altındaki \`index.html\` sayısı |`);
  s.push(`| SSR route (toplam) | ${yok(buildSatirlari.ssrToplam)} | \`.vercel/output/config.json\` · \`dest:"_render"\` (\`_image\`/\`_server-islands\` hariç) |`);
  s.push(`| — bunun API route'u | ${yok(buildSatirlari.api)} | aynı küme · \`^/api/\` ile başlayan |`);
  s.push(`| — bunun sayfa route'u | ${yok(buildSatirlari.ssrSayfa)} | toplam − API |`);
  s.push('');
  s.push('⚠ **Yöntem beyanı (KARAR 470-b):** prerender sayımı yönlendirme takma adlarını da');
  s.push('sayar (`/istanbul/*` · `/workshop/*`); SSR sayımı aynı takma adları route tablosunda');
  s.push('ayrı satır olarak görür. Elle tutulmuş eski sayımlar bunları dışarıda bırakıyordu —');
  s.push('rakamlar bu yüzden birebir denk gelmez. Tanım burada yazılıdır, rakam ondan doğar.');
}
s.push('');
s.push('## DOKÜMAN SATIRLARI');
s.push('');
s.push('| dosya | satır |');
s.push('|---|---|');
for (const [yol, n] of satirlar) s.push(`| \`${yol}\` | ${yok(n)} |`);
s.push('');
s.push(
  durumSatir === null
    ? `\`00-durum.md\` tavanı (**≤200**, KARAR 457): ${OLCULMEDI}`
    : `\`00-durum.md\` tavanı (**≤200**, KARAR 457): **${durumSatir}** — ${durumSatir <= 200 ? '✅ altında' : '❌ AŞILDI'}`
);
s.push('');
s.push('## BORÇ SAYIMI');
s.push('');
s.push('| alan | değer | kaynak |');
s.push('|---|---|---|');
s.push(`| toplam madde | ${yok(borc.toplam)} | \`grep -cE '^## B'\` |`);
s.push(`| damgalı (kapandı/çözüldü/geri çekildi) | ${yok(borc.damgali)} | \`^## B\` başlıklarında \`[✅❌]\` |`);
s.push(`| iş değil (ertelendi/planlı) | ${yok(borc.isDegil)} | \`^## B\` başlıklarında \`[⏸🔵]\` |`);
s.push(`| **açık** | **${yok(borc.acik)}** | toplam − damgalı − iş değil |`);
s.push(`| mükerrer başlık | ${yok(borc.mukerrer)} | \`^## B[0-9]+\` → \`uniq -d\` |`);
s.push('');
s.push('*Ölçüt başlıktaki **damga**dır, kelimenin kendisi değil (10 Ağu B01 kaydı).*');
s.push('');
s.push('## LEDGER BÜTÜNLÜĞÜ');
s.push('');
if (!ledger) {
  s.push(`${OLCULMEDI} — \`docs/01-kararlar.tsv\` okunamadı.`);
} else {
  s.push('| alan | değer | beklenen |');
  s.push('|---|---|---|');
  s.push(`| son KARAR numarası | **${yok(ledger.sonNumara)}** | — |`);
  s.push(`| satır sayısı (başlık dahil) | ${yok(ledger.satir)} | — |`);
  s.push(`| altı sütun dışı satır | ${ledger.altiSutunDisi} | 0 ${ledger.altiSutunDisi === 0 ? '✅' : '❌'} |`);
  s.push(`| mükerrer numara | ${ledger.mukerrer} | 0 ${ledger.mukerrer === 0 ? '✅' : '❌'} |`);
  s.push(
    `| enum dışı \`durum\` | ${ledger.enumDisi.length ? ledger.enumDisi.join(' · ') : '0'} | 0 ${ledger.enumDisi.length === 0 ? '✅' : '❌'} |`
  );
  s.push(`| boş \`kaynak\` hücresi | ${ledger.kaynakBos} | 0 ${ledger.kaynakBos === 0 ? '✅' : '❌'} |`);
}
s.push('');
s.push('## VERCEL KİMLİĞİ');
s.push('');
if (!vercel) {
  s.push('*Alan atlandı* — ne `.vercel/project.json` ne `.vercel/repo.json` okunabildi.');
  s.push('Uydurulmaz (**KARAR 470**).');
} else {
  s.push('| alan | değer |');
  s.push('|---|---|');
  s.push(`| kaynak dosya | \`${vercel.kaynak}\` |`);
  s.push(`| proje adı | ${yok(vercel.ad)} |`);
  s.push(`| proje ID | \`${yok(vercel.id)}\` |`);
  s.push(`| team / org ID | \`${yok(vercel.org)}\` |`);
  if (vercel.kaynak === '.vercel/repo.json') {
    s.push('');
    s.push('⚠ `project.json` **yok** — değerler `repo.json`\'un `projects[0]` kaydından okundu.');
    s.push('`vercel --prod` yolu bu dosyayla kurulmaz (**B179**).');
  }
}
s.push('');
s.push('---');
s.push('');
s.push('⚠ **Vercel paneli bu betiğe kapalıdır** (`05-harita.md` §3). Yukarıdaki kimlik');
s.push('yerel dosyadan okundu, panelden değil — panel gerçeğiyle ayrışmış olabilir.');
s.push('Ayrışma teşhisi yargıdır, `00-durum.md`\'de yaşar.');
s.push('');

writeFileSync(HEDEF, s.join('\n'), 'utf8');
console.log(`docs/04-olcum.md yazıldı — ${s.length} satır.`);
console.log(`  HEAD ${headKisa ?? '?'} · ağaç ${agacTemiz === null ? '?' : agacTemiz ? 'temiz' : 'KİRLİ'} · borç açık ${borc.acik ?? '?'} · son KARAR ${ledger?.sonNumara ?? '?'}`);
if (!TEST_ISTENDI) console.log('  (test ölçülmedi — --test)');
if (!BUILD_ISTENDI) console.log('  (build ölçülmedi — --build)');
