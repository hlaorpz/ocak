/**
 * riza.ts — Çerez rızasının TEK otoritesi (B118 · B119, brief K-1).
 *
 * ── Kapı sert ──
 * Kabul edilene kadar GTM betiği DOM'a hiç girmez; dolayısıyla Pixel ve GA4 da
 * çalışmaz. Reddeden kadından hiçbir üçüncü taraf isteği çıkmaz — Consent
 * Mode'un "rızasız modelleme pingi" KULLANILMIYOR. Kapı KODDA, GTM arayüzünde
 * değil (brief K-1; B16'nın Consent Mode v2 ayağı bu kararla daralır).
 *
 * ── Neden saf fonksiyonlar ──
 * `vitest.config.ts` `environment: 'node'` — DOM yok. Kuralın kendisi
 * (çözümleme · tazelik · hangi çerez silinir) buraya konuyor ki ölçülebilsin;
 * `RizaBandi.astro`'nun hoisted script'i yalnız bu fonksiyonları ÇAĞIRIR,
 * kuralı yeniden yazmaz. İnline bir `<script is:inline>` bu modülü import
 * edemezdi — o yüzden GTM kapısı da hoisted (defer) script'te yaşıyor.
 * Bedeli: GTM, HTML ayrıştırıldıktan sonra yükleniyor. Kabul edilebilir —
 * `gtm.js` zaten `async`, ve kuralın iki yerde yaşamamasının değeri daha büyük.
 *
 * ── `window.dataLayer` rızadan BAĞIMSIZ tanımlıdır ──
 * `Layout.astro` her durumda `window.dataLayer = window.dataLayer || []` basar.
 * Olaylar rızadan bağımsız `push` edilir; GTM yoksa kimse okumaz. Böylece
 * `olcum.ts` rızayı bilmek zorunda kalmıyor (brief §4 "Davranış").
 */

/** `localStorage` anahtarı. Değer `RizaKaydi`'nin JSON hâli. */
export const RIZA_ANAHTARI = 'ocak-riza';

/** Kayıt bu kadar günden eskiyse bant yeniden gösterilir. */
export const RIZA_SURE_GUN = 180;

const GUN_MS = 24 * 60 * 60 * 1000;

export type RizaDeger = 'kabul' | 'ret';

export type RizaKaydi = {
  /** Şema sürümü. Artarsa eski kayıt geçersiz sayılır ve bant yeniden sorar. */
  v: 1;
  deger: RizaDeger;
  /** ISO damgası — tazelik buradan ölçülür. */
  t: string;
};

/**
 * Ham `localStorage` değerini karara çevirir.
 *
 * `null` dönen her hâl "rıza yok" demektir ve bant gösterilir:
 * anahtar yok · bozuk JSON · bilinmeyen `v` · tanınmayan `deger` ·
 * geçersiz/ileri tarihli damga · `RIZA_SURE_GUN`'den eski damga.
 *
 * ⚠ `t` GELECEKTE ise kayıt geçersiz sayılır. Saati ileri alınmış bir cihaz
 * aksi hâlde rızayı sonsuza kadar taze tutardı.
 */
export function rizaCoz(ham: string | null | undefined, simdi: Date): RizaKaydi | null {
  if (!ham) return null;
  let obj: unknown;
  try {
    obj = JSON.parse(ham);
  } catch {
    return null;
  }
  if (!obj || typeof obj !== 'object') return null;
  const k = obj as Record<string, unknown>;
  if (k.v !== 1) return null;
  if (k.deger !== 'kabul' && k.deger !== 'ret') return null;
  if (typeof k.t !== 'string') return null;
  const damga = Date.parse(k.t);
  if (Number.isNaN(damga)) return null;
  const gecen = simdi.getTime() - damga;
  if (gecen < 0) return null;
  if (gecen > RIZA_SURE_GUN * GUN_MS) return null;
  return { v: 1, deger: k.deger, t: k.t };
}

/** Yeni kayıt üretir — yazım tarafının tek kurucusu. */
export function rizaKaydiUret(deger: RizaDeger, simdi: Date): RizaKaydi {
  return { v: 1, deger, t: simdi.toISOString() };
}

/** Bant gösterilsin mi: geçerli kayıt YOKSA evet. `ret` de bir karardır, sorulmaz. */
export function bantGosterilsinMi(ham: string | null | undefined, simdi: Date): boolean {
  return rizaCoz(ham, simdi) === null;
}

/** GTM yüklensin mi: yalnız geçerli ve `kabul` olan kayıtta. */
export function gtmYuklensinMi(ham: string | null | undefined, simdi: Date): boolean {
  return rizaCoz(ham, simdi)?.deger === 'kabul';
}

/**
 * Rıza geri alındığında silinecek çerez adları.
 *
 * `_ga*` bir KALIP: GA4 ölçüm kimliği başına ayrı bir `_ga_G-XXXX` çerezi
 * açıyor, adı önceden bilinemez. O yüzden fonksiyon mevcut adları alır ve
 * eleyerek döner — sabit bir liste `_ga_`'ları kaçırırdı.
 *
 * Meta tarafı sabit: `_fbp` (tarayıcı kimliği) · `_fbc` (reklam tıklaması).
 */
export function silinecekCerezAdlari(mevcutAdlar: readonly string[]): string[] {
  return mevcutAdlar.filter(
    (ad) => ad === '_ga' || ad.startsWith('_ga_') || ad === '_gid' || ad === '_fbp' || ad === '_fbc',
  );
}

/** `document.cookie` dizesinden ad listesi çıkarır. Boş/bozuk parçalar atlanır. */
export function cerezAdlariniAyikla(cookie: string | null | undefined): string[] {
  if (!cookie) return [];
  return cookie
    .split(';')
    .map((p) => p.split('=')[0]?.trim() ?? '')
    .filter((ad) => ad.length > 0);
}

/**
 * Bir çerezi silmek için `document.cookie`'ye yazılacak dizeleri üretir.
 *
 * ⚠ **En iyi çaba.** Bir çerezi silmek, onu yazan `domain`/`path` ikilisiyle
 * birebir eşleşmeyi gerektirir; JavaScript hangi ikiliyle yazıldığını OKUYAMAZ.
 * O yüzden olası ikililerin hepsine ayrı bir süresi geçmiş yazım gönderilir:
 * alan adı belirtmeyen hâl (host-only) + verilen her alan adı. GA ve Meta
 * kendi çerezlerini kök alana (`.ocak.biz`) yazıyor; ikisi de listede.
 */
export function cerezSilmeDizeleri(ad: string, alanAdlari: readonly string[]): string[] {
  const gecmis = 'Thu, 01 Jan 1970 00:00:00 GMT';
  const dizeler = [`${ad}=; expires=${gecmis}; path=/`];
  for (const alan of alanAdlari) {
    dizeler.push(`${ad}=; expires=${gecmis}; path=/; domain=${alan}`);
  }
  return dizeler;
}

/** Silme denemesinin yapılacağı alan adları — `www` ve kök. */
export const RIZA_CEREZ_ALANLARI = ['www.ocak.biz', '.ocak.biz'] as const;
