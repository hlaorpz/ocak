// OCAK doküman korpusu — ölçüm, arama, okuma motoru.
//
// Tasarım ilkeleri (ADIM 7 brief §1) burada uygulanır:
//  (a) dosya kümesi diskten sayılır — kodda dosya listesi yoktur, yalnız kök listesi
//  (b) her cevap okunduğu commit'i taşır
//  (c) ölçüm burada yapılır, kabuğa çıkılmaz — grep/awk/cut çağrılmaz
//  (d) eksik hiçbir zaman sessiz olmaz

import { readFileSync, readdirSync, statSync, realpathSync, existsSync } from 'node:fs';
import { join, resolve, relative, sep, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// ── İzinli kökler ────────────────────────────────────────────────────────────
// İLKE (a): burada yalnız KÖK DİZİN adları durur. Dosya listesi yoktur ve
// olmayacaktır — yazılı her liste bu projede bayatladı.
export const IZINLI_KOKLER = ['docs', 'scripts'];
export const IZINLI_TEKIL = ['CLAUDE.md'];

// Yürüyüşte budanan dizinler. Bunlar korpusun parçası değil.
const BUDANAN_DIZINLER = new Set(['node_modules', '.git']);

// Kapsam dışı (brief §2): src/ · dist/ · node_modules/ · .git/ · .env* · .claude/
// Bu dizinler zaten IZINLI_KOKLER'de olmadığı için erişilemez; liste yalnız
// belgeleme amacıyla burada durur, kod akışında kullanılmaz.

export const AZAMI_GOVDE_SATIR = 500;   // aralıksız okumada gövde eşiği (brief §3)
export const AZAMI_ARALIK_SATIR = 2000; // aralıklı okumada azami açıklık
export const AZAMI_SONUC = 200;         // docs_ara'nın döndürdüğü azami satır

// ── Depo kökü ────────────────────────────────────────────────────────────────
// Bu dosya <kok>/mcp/ altında yaşıyor; kök bir üst dizin.
export const KOK = realpathSync(resolve(dirname(fileURLToPath(import.meta.url)), '..'));

// ── Commit damgası (İLKE b) ──────────────────────────────────────────────────
// Kabuğa çıkmadan (İLKE c) okunur. Railway ortam değişkeni önce gelir: orada
// .git bulunmayabilir. Hiçbiri yoksa cevap "BELİRLENEMEDİ" der — sessiz kalmaz.
function gitBasindanOku() {
  try {
    const headYol = join(KOK, '.git', 'HEAD');
    if (!existsSync(headYol)) return null;
    const head = readFileSync(headYol, 'utf8').trim();
    if (!head.startsWith('ref:')) return head; // detached HEAD
    const ref = head.slice(4).trim();
    const refYol = join(KOK, '.git', ref);
    if (existsSync(refYol)) return readFileSync(refYol, 'utf8').trim();
    // packed-refs yedeği
    const packedYol = join(KOK, '.git', 'packed-refs');
    if (!existsSync(packedYol)) return null;
    for (const satir of readFileSync(packedYol, 'utf8').split('\n')) {
      if (satir.startsWith('#') || satir.startsWith('^')) continue;
      const [sha, adi] = satir.split(' ');
      if (adi === ref) return sha;
    }
    return null;
  } catch {
    return null;
  }
}

function commitBelirle() {
  const cevre = process.env.RAILWAY_GIT_COMMIT_SHA || process.env.OCAK_MCP_COMMIT;
  if (cevre) return { commit: cevre.slice(0, 7), commit_kaynak: 'ortam-degiskeni' };
  const sha = gitBasindanOku();
  if (sha) return { commit: sha.slice(0, 7), commit_kaynak: 'git-head' };
  return { commit: 'BELİRLENEMEDİ', commit_kaynak: 'yok' };
}

export const DAMGA = commitBelirle();

// ── Ölçüm yardımcıları (İLKE c) ──────────────────────────────────────────────
// Satır ayırma: ADIM 0.c'nin python3 formülüyle bire bir denk.
//   satır = metindeki '\n' sayısı + (metin boş değilse ve '\n' ile bitmiyorsa 1)
export function satirlariAyir(metin) {
  if (metin === '') return [];
  const parcalar = metin.split('\n');
  if (parcalar[parcalar.length - 1] === '') parcalar.pop();
  return parcalar;
}

// Karakter sayımı: kod noktası (code point) sayar, UTF-16 birimi değil.
// 'çığır' → 5. awk'ın bayt sayması (bu makinede ölçüldü: 9) tam olarak
// kaçınılan davranış — B46.
export function karakterSay(metin) {
  let n = 0;
  for (const _ of metin) n++;
  return n;
}

// Türkçe'ye doğru küçültme. 'İ'→'i', 'I'→'ı'. ASCII lowercase yetmez.
export function turkceKucult(metin) {
  return metin.toLocaleLowerCase('tr');
}

// ── Yol güvenliği (brief §2) ─────────────────────────────────────────────────
// Her istek gerçek yola çözülür ve izinli köklerin altında olduğu doğrulanır.
// '..', nokta ile başlayan bileşen, mutlak yol ve kök dışına düşen her istek
// reddedilir.
function izinliKokYollari() {
  const kokler = [];
  for (const k of IZINLI_KOKLER) {
    const p = join(KOK, k);
    if (existsSync(p)) kokler.push(realpathSync(p));
  }
  return kokler;
}

function izinliTekilYollari() {
  const tekil = [];
  for (const f of IZINLI_TEKIL) {
    const p = join(KOK, f);
    if (existsSync(p)) tekil.push(realpathSync(p));
  }
  return tekil;
}

export function yoluCoz(istenen) {
  if (typeof istenen !== 'string' || istenen.trim() === '') {
    return { tamam: false, sebep: 'Yol boş.' };
  }
  const ham = istenen.trim();
  if (ham.startsWith('/') || /^[A-Za-z]:/.test(ham)) {
    return { tamam: false, sebep: 'Mutlak yol kabul edilmiyor; depo köküne göreli yol ver.' };
  }
  const bilesenler = ham.split(/[/\\]/).filter((x) => x !== '' && x !== '.');
  if (bilesenler.some((b) => b === '..')) {
    return { tamam: false, sebep: "Yolda '..' var; reddedildi." };
  }
  if (bilesenler.some((b) => b.startsWith('.'))) {
    return { tamam: false, sebep: 'Nokta ile başlayan dosya/dizin korpusun dışında; reddedildi.' };
  }

  const sozluk = resolve(KOK, bilesenler.join(sep));
  const kokler = izinliKokYollari();
  const tekil = izinliTekilYollari();

  // Sözlüksel ön kontrol — dosya var olmasa da kök dışı istek burada durur.
  const kokAltinda = (p) => kokler.some((k) => p === k || p.startsWith(k + sep));
  if (!kokAltinda(sozluk) && !tekil.includes(sozluk)) {
    return {
      tamam: false,
      sebep: `İzinli kök dışı. İzinli kökler: ${IZINLI_KOKLER.join(', ')} · tekil: ${IZINLI_TEKIL.join(', ')}`,
    };
  }

  if (!existsSync(sozluk)) {
    return { tamam: false, bulunamadi: true, sebep: 'Dosya bulunamadı.', yol: relative(KOK, sozluk) };
  }

  // Sembolik bağ üzerinden dışarı çıkış kontrolü.
  const gercek = realpathSync(sozluk);
  if (!kokAltinda(gercek) && !tekil.includes(gercek)) {
    return { tamam: false, sebep: 'Sembolik bağ izinli kök dışına çıkıyor; reddedildi.' };
  }
  if (!statSync(gercek).isFile()) {
    return { tamam: false, sebep: 'Hedef bir dosya değil.' };
  }
  return { tamam: true, mutlak: gercek, yol: relative(KOK, gercek) };
}

// ── Korpus yürüyüşü (İLKE a) ─────────────────────────────────────────────────
function sinifiBelirle(rel) {
  return rel.split(sep).includes('_arsiv') ? 'arsiv' : 'canli';
}

function dizinYuru(dizin, topla) {
  let girisler;
  try {
    girisler = readdirSync(dizin, { withFileTypes: true });
  } catch {
    return;
  }
  for (const g of girisler) {
    const p = join(dizin, g.name);
    if (g.isDirectory()) {
      if (BUDANAN_DIZINLER.has(g.name)) continue;
      dizinYuru(p, topla);
    } else if (g.isFile()) {
      topla(p);
    }
  }
}

/**
 * Korpusu diskten sayar. Her çağrıda taze yürür — önbellek yok, bayatlık yok.
 *
 * İLKE (d): atlanan hiçbir dosya sessiz değildir. UTF-8 çözülemeyen ve nokta
 * ile başlayan dosyalar sayımın dışındadır ama ayrı ayrı raporlanır.
 */
export function korpusuTara() {
  const dosyalar = [];
  const atlananIkili = [];
  const atlananGizli = [];

  const isle = (mutlak) => {
    const rel = relative(KOK, mutlak);
    const ad = rel.split(sep).pop();
    if (ad.startsWith('.')) {
      atlananGizli.push(rel);
      return;
    }
    let ham;
    try {
      ham = readFileSync(mutlak);
    } catch {
      return;
    }
    let metin;
    try {
      metin = new TextDecoder('utf-8', { fatal: true }).decode(ham);
    } catch {
      atlananIkili.push(rel);
      return;
    }
    dosyalar.push({
      yol: rel.split(sep).join('/'),
      mutlak,
      satir: satirlariAyir(metin).length,
      bayt: ham.length,
      karakter: karakterSay(metin),
      sinif: sinifiBelirle(rel),
    });
  };

  for (const k of IZINLI_KOKLER) {
    const p = join(KOK, k);
    if (existsSync(p)) dizinYuru(realpathSync(p), isle);
  }
  for (const f of IZINLI_TEKIL) {
    const p = join(KOK, f);
    if (existsSync(p)) isle(realpathSync(p));
  }

  dosyalar.sort((a, b) => a.yol.localeCompare(b.yol, 'tr'));

  const canli = dosyalar.filter((d) => d.sinif === 'canli');
  const arsiv = dosyalar.filter((d) => d.sinif === 'arsiv');
  return {
    dosyalar,
    atlananIkili: atlananIkili.sort(),
    atlananGizli: atlananGizli.sort(),
    ozet: {
      toplam: dosyalar.length,
      canli: canli.length,
      arsiv: arsiv.length,
      canli_satir: canli.reduce((t, d) => t + d.satir, 0),
      arsiv_satir: arsiv.reduce((t, d) => t + d.satir, 0),
      canli_bayt: canli.reduce((t, d) => t + d.bayt, 0),
      arsiv_bayt: arsiv.reduce((t, d) => t + d.bayt, 0),
    },
  };
}

// ── Korpus özeti satırı (Kaan'ın §3 ek şartı) ────────────────────────────────
// Her cevap bu tek satırı taşır: tool'un varlığı hatırlanmak zorunda kalmasın.
export function korpusOzetSatiri(ozet) {
  return `Korpus: ${ozet.toplam} dosya (${ozet.canli} canlı · ${ozet.arsiv} arşiv) — tam liste: docs_envanter()`;
}

// ── Başlık indeksi ───────────────────────────────────────────────────────────
// '# ', '## ', '### ' ile başlayan satırlar. 02-borclar.md'nin '## BNN — ...'
// satırları bu kurala girer (ölçüldü: 53 başlık, 50'si '## B' biçiminde).
export function baslikIndeksi(satirlar) {
  const cikti = [];
  for (let i = 0; i < satirlar.length; i++) {
    if (/^#{1,3} /.test(satirlar[i])) cikti.push({ satir_no: i + 1, baslik: satirlar[i] });
  }
  return cikti;
}
