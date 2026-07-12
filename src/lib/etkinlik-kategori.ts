// Notion Etkinlikler DB `Format` property'sinden gelen Türkçe değerleri site
// kategori slug'larına map eder (#26 Brief G — kategori filter). Helper'ın test
// edilebilir olması için inline component-içi map ve filter Brief I.3'te buraya
// taşındı (lib refactor sapması — KARAR 102 ruhu, KARAR 109 paterninin devamı).
// Component davranışı 1:1 korundu; bilinmeyen/eksik kategori graceful degrade eder.

export type EtkinlikKategori =
  | 'cember'
  | 'acik-kapi'
  | 'seremoni'
  | 'atolye'
  | 'sehir-aksami'
  | 'mini-retreat'
  | 'yolculuk'
  | 'anadolu';

export const FORMAT_KATEGORI: Record<string, EtkinlikKategori> = {
  'Çember': 'cember',
  'Açık Kapı': 'acik-kapi',
  Seremoni: 'seremoni',
  Atölye: 'atolye',
  'Şehir Akşamı': 'sehir-aksami',
  'Mini Retreat': 'mini-retreat',
  Yolculuk: 'yolculuk',
  'Anadolu Yolculuğu': 'anadolu',
};

/**
 * Format ham Notion değeri → görünür etiket (brief-takvim-toparlama-uygula.md ADIM 2).
 * Slug rename brief (2026-07-03) sonrası Notion Format enum'u zaten "Seremoni"
 * kısasına geçtiği için map artık boş — helper kimlik fonksiyonuna düşer.
 */
export const FORMAT_LABEL: Record<string, string> = {};

export const formatEtiket = (tip: string): string => FORMAT_LABEL[tip] ?? tip;

/**
 * /takvim tepe tab için deterministik format sırası
 * (brief-takvim-toparlama-uygula.md ADIM 3 + brief-faz3-h4-h5 İş 4).
 * String'ler HAM Notion Format value'ları — sort ham `e.tip` üzerinde çalışır.
 * `FORMAT_KATEGORI` key'leriyle BİREBİR eşleşmeli; bir harf/boşluk farkı tabı
 * sona atar + warn basar. SADECE tepe tab; gövdedeki ay-ay timeline tarih-
 * öncelikli kalır. Kanonik bulusmalar sırası: Açık Kapı → Çember → Seremoni →
 * Atölye → Şehir Akşamı → Mini Retreat (H5). Yolculuk 7. kapı; Anadolu Yolculuğu
 * kapı değil ama takvimde en ağır — ikisi de sona.
 */
export const KATEGORI_SIRA: string[] = [
  'Açık Kapı',
  'Çember',
  'Seremoni',
  'Atölye',
  'Şehir Akşamı',
  'Mini Retreat',
  'Yolculuk',
  'Anadolu Yolculuğu',
];

/**
 * `Mekân/Platform` (Notion select) → rozet tipi
 * (brief-takvim-toparlama-uygula.md ADIM 4).
 * Notion 7 değerli: `Online | Zoom | İzmir | İstanbul | Ankara | Ege | Anadolu`.
 * Rozet jenerik: Online / Yüz Yüze — şehir/platform rozete yazılmaz (meta
 * satırı zaten Mekân/Platform'u gösterir). Mekân/Platform schema `z.string()`
 * (serbest), bilinmeyen yeni değer → null + warn (rozet basılmaz).
 */
export const mekanTipi = (mekan?: string): 'online' | 'fiziksel' | null => {
  if (!mekan) return null;
  if (mekan === 'Online' || mekan === 'Zoom') return 'online';
  if (['İzmir', 'İstanbul', 'Ankara', 'Ege', 'Anadolu'].includes(mekan)) return 'fiziksel';
  console.warn('[takvim] bilinmeyen Mekân/Platform:', mekan);
  return null;
};

/**
 * Kart ücret metni (brief-takvim-toparlama-uygula.md ADIM 4).
 * `undefined` veya `0` → "sembolik"; `>0` → "{rakam} {paraBirimi ?? 'TRY'}".
 */
export const ucretMetni = (ucret?: number, paraBirimi?: string): string => {
  if (ucret == null || ucret === 0) return 'sembolik';
  return `${ucret} ${paraBirimi ?? 'TRY'}`;
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
  '/atolye': 'atolye',
  '/sehir-aksami': 'sehir-aksami',
  '/cember': 'cember',
  '/acik-kapi': 'acik-kapi',
  '/yolculuk': 'yolculuk',
  '/anadolu': 'anadolu',
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
  atolye: 'Yaklaşan Atölyeler',
  'sehir-aksami': 'Yaklaşan Şehir Akşamları',
  'mini-retreat': "Yaklaşan Mini Retreat'ler",
  yolculuk: 'Yaklaşan Yolculuk',
  anadolu: 'Yaklaşan Anadolu Yolculuğu',
};

/**
 * brief-faz3-h4-h5 İş 2 — format sayfalarında sonraki-bulusma TEK KART
 * varyantının heading'i. "En Yakın [Format Adı]" tekil form (KATEGORI_HEADING
 * çoğul, home/anadolu için). anadolu burada yok — mevcut Anadolu Yolculuğu
 * davranışı korunur (LIMIT=3, KATEGORI_HEADING).
 */
export const KATEGORI_EN_YAKIN: Partial<Record<EtkinlikKategori, string>> = {
  cember: 'En Yakın Çember',
  'acik-kapi': 'En Yakın Açık Kapı',
  seremoni: 'En Yakın Seremoni',
  atolye: 'En Yakın Atölye',
  'sehir-aksami': 'En Yakın Şehir Akşamı',
  'mini-retreat': 'En Yakın Mini Retreat',
  yolculuk: 'En Yakın Yolculuk',
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
