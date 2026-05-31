// Notion Etkinlikler DB `Format` property'sinden gelen Türkçe değerleri site
// kategori slug'larına map eder (#26 Brief G — kategori filter). Helper'ın test
// edilebilir olması için inline component-içi map ve filter Brief I.3'te buraya
// taşındı (lib refactor sapması — KARAR 102 ruhu, KARAR 109 paterninin devamı).
// Component davranışı 1:1 korundu; bilinmeyen/eksik kategori graceful degrade eder.

export type EtkinlikKategori =
  | 'cember'
  | 'acik-kapi'
  | 'seremoni'
  | 'workshop'
  | 'istanbul'
  | 'mini-retreat'
  | 'yolculuk';

export const FORMAT_KATEGORI: Record<string, EtkinlikKategori> = {
  'Çember': 'cember',
  'Açık Kapı': 'acik-kapi',
  'Mevsim Seremonisi': 'seremoni',
  Workshop: 'workshop',
  'İstanbul Akşamı': 'istanbul',
  'Mini Retreat': 'mini-retreat',
  Yolculuk: 'yolculuk',
};

/**
 * Etkinlik listesini kategoriye göre filtreler.
 *
 * - `kategori` falsy (undefined / null / '') → liste değişmez (mevcut davranış).
 * - `kategori` bilinmeyen string → boş liste (graceful degrade, component
 *   bos=true düşer ve "yakında" fallback metnini gösterir).
 * - `kategori` geçerli → FORMAT_KATEGORI ile eşleşen etkinlikler.
 */
export function filterEtkinliklerByKategori<T extends { tip: string }>(
  liste: T[],
  kategori: string | null | undefined,
): T[] {
  if (!kategori) return liste;
  return liste.filter((e) => FORMAT_KATEGORI[e.tip] === kategori);
}

/**
 * Slug → kategori map. Fragment-split `sonraki-bulusma` marker'ı tetiklendiğinde
 * PageContent slug'u SonrakiBulusma'ya geçirir; component bu map ile kategori
 * türetir (KARAR 127 fragment-split genişletme).
 *
 * - `null` değer = kategori yok → tüm yaklaşan etkinlikler (Home davranışı).
 * - Map miss = warn + null disiplini (KARAR 113-114 oda-map paterni paralel).
 *
 * Marker eklenmeyen sayfalar (hikaye, biz, takvim, vb.) burada yer almaz — çağrılırsa
 * null fallback. /cember, /acik-kapi, /anadolu defansif olarak eklendi (mevcut
 * brief'te marker yok, ama gelecek brief ekleyebilir; map hazır beklesin).
 */
export const SLUG_KATEGORI: Record<string, EtkinlikKategori | null> = {
  '/': null,
  '/mini-retreat': 'mini-retreat',
  '/seremoni': 'seremoni',
  '/workshop': 'workshop',
  '/istanbul': 'istanbul',
  '/cember': 'cember',
  '/acik-kapi': 'acik-kapi',
  '/anadolu': 'yolculuk',
};

/**
 * Kategori → heading map. SonrakiBulusma fallback davranışı (brief karar):
 *   - kategori null → DEFAULT_HEADING (Home + fallback)
 *   - kategori var + o kategoride etkinlik var → KATEGORI_HEADING
 *   - kategori var + o kategoride etkinlik yok → DEFAULT_HEADING (tüm yaklaşan listelenir)
 */
export const DEFAULT_HEADING = 'Sıradaki Buluşmalar';

export const KATEGORI_HEADING: Record<EtkinlikKategori, string> = {
  cember: 'Yaklaşan Çemberler',
  'acik-kapi': 'Yaklaşan Açık Kapılar',
  seremoni: 'Yaklaşan Seremoniler',
  workshop: "Yaklaşan Workshop'lar",
  istanbul: 'Yaklaşan İstanbul Akşamları',
  'mini-retreat': "Yaklaşan Mini Retreat'ler",
  yolculuk: 'Yaklaşan Yolculuklar',
};

/**
 * Slug'tan kategori türetir. Map miss → warn + null.
 * Notion'da `## section: sonraki-bulusma` marker'ı olan her sayfa burada olmalı.
 */
export function getKategori(slug: string): EtkinlikKategori | null {
  if (slug in SLUG_KATEGORI) return SLUG_KATEGORI[slug];
  // eslint-disable-next-line no-console
  console.warn(
    `[getKategori] bilinmeyen slug "${slug}" — SLUG_KATEGORI map'inde yok, null fallback. ` +
      `Notion'da sonraki-bulusma marker'ı bu sayfaya eklendiyse SLUG_KATEGORI'yi güncelle.`,
  );
  return null;
}

/**
 * Slug + kategoride etkinlik var/yok flag'inden heading üretir.
 * Fallback davranışı: kategori yoksa veya kategoride etkinlik yoksa DEFAULT_HEADING;
 * her ikisi de varsa KATEGORI_HEADING[kategori].
 */
export function getHeading(slug: string, hasKategoriEtkinlik: boolean): string {
  const k = getKategori(slug);
  if (!k) return DEFAULT_HEADING;
  if (!hasKategoriEtkinlik) return DEFAULT_HEADING;
  return KATEGORI_HEADING[k];
}
