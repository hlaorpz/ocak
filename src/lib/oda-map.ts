/**
 * oda-map.ts — Slug → Oda sabit eşlemesi (KARAR 87, Çekirdek SİTE MİMARİSİ tablosu)
 *
 * Kapalı set. Notion Sayfalar DB'sinde "oda" property'si YOK (Brief 1 sapma
 * raporu) — oda kaynağı kod-içi bu map (Brief 2 mimari karar A). Notion'a oda property
 * eklenmedi; tek doğruluk kaynağı burası.
 */

import {
  KART_AKISI_ACIK,
  KART_ROUTELARI,
  MOCK_SAGLAYICI_ACIK,
  MOCK_ROUTELARI,
} from './kart-akisi.ts';

export type Oda = 'OCAK' | 'Yol' | 'Buluşmalar' | 'Yolculuk' | 'Biz' | 'İletişim';

/**
 * Ham eşleme — kart akışı dahil, tam liste. `ODA_MAP` bunun anahtar
 * durumuna göre süzülmüş hâlidir (KARAR 488).
 */
const ODA_MAP_HAM: Record<string, Oda> = {
  // OCAK — çekirdek/kimlik
  '/': 'OCAK',
  '/hikaye': 'OCAK',
  '/felsefe': 'OCAK',
  '/adimiz': 'OCAK',
  '/araclar': 'OCAK',
  '/site-rehber': 'OCAK',
  // Yasal (statik .astro, Notion DIŞI — sanal POS onay sayfaları, brief-yasal-sayfalar-adim1.md)
  '/hakkimizda': 'OCAK',
  '/gizlilik': 'OCAK',
  '/mesafeli-satis': 'OCAK',
  '/teslimat-iade': 'OCAK',
  // Ödeme akışı (statik .astro, Notion DIŞI — Aşama 3b mock; N-Kolay 11 Eyl)
  // KARAR 488 — kart akışı kapalıyken beş entry aşağıda listeden DÜŞER.
  // B193 — `/odeme/mock` ayrıca sağlayıcı `nkolay` iken tek başına düşer.
  // Girdiler burada duruyor (silinmedi); eleme `ODA_MAP`'in kurulumunda.
  '/odeme/mock': 'OCAK',
  '/odeme/nkolay': 'OCAK',
  '/odeme/tamam': 'OCAK',
  '/odeme/iptal': 'OCAK',
  // B211 İŞ 5 — kart devam linkinin indiği sayfa (7 Eki).
  '/odeme/devam': 'OCAK',
  // Yol
  '/sen-neredesin': 'Yol',
  // Buluşmalar
  '/bulusmalar': 'Buluşmalar',
  '/cember': 'Buluşmalar',
  '/acik-kapi': 'Buluşmalar',
  '/seremoni': 'Buluşmalar',
  '/atolye': 'Buluşmalar',
  '/sehir-aksami': 'Buluşmalar',
  '/mini-retreat': 'Buluşmalar',
  '/takvim': 'Buluşmalar',
  // Yolculuk
  '/yolculuk': 'Yolculuk',
  '/anadolu': 'Yolculuk',
  // Biz
  '/biz': 'Biz',
  '/advaita': 'Biz',
  '/ekip': 'Biz',
  // İletişim
  '/iletisim': 'İletişim',
  '/iletisim/bize-yaz': 'İletişim',   // brief-iletisim-form-tasima.md (form ayrı route)
};

/**
 * Yürürlükte DÜŞEN route'lar — iki anahtarın birleşimi, tek küme.
 *
 * İki eleme ayrı sebeplerden gelir ve birbirini kapsamaz:
 *  · `KART_AKISI` kapalı  → dördü de düşer (KARAR 488)
 *  · `PAYMENT_PROVIDER=nkolay` → `/odeme/mock` tek başına düşer (B193, 7 Eki),
 *    kart akışı AÇIK olsa bile. Production'ın bugünkü hâli tam olarak bu:
 *    `KART_AKISI=acik` + `PAYMENT_PROVIDER=nkolay`.
 *
 * Birleşim kümesi olarak yazılmasının sebebi: iki iç içe üçlü koşul yazmak
 * "hangi anahtar neyi eledi" sorusunu okunmaz hâle getirirdi.
 */
const DUSEN_ROUTELAR: readonly string[] = [
  ...(KART_AKISI_ACIK ? [] : KART_ROUTELARI),
  ...(MOCK_SAGLAYICI_ACIK ? [] : MOCK_ROUTELARI),
];

/**
 * Slug → Oda, yürürlükteki hâl. KARAR 488 — kart akışı kapalıyken dört ödeme
 * route'u listeden düşer; `getOda()` onlar için fırlatır, ki kapalı bir akışın
 * sayfası sessizce oda kazanmasın. Anahtar açılınca dördü kendiliğinden döner.
 *
 * B193 (7 Eki) — ikinci anahtar: sağlayıcı `nkolay` iken `/odeme/mock` kart
 * akışı açık olsa bile düşer. Sağlayıcı `mock`'a çevrilirse o da kendiliğinden
 * döner; iki yönde de elle liste bakımı yok.
 *
 * ⚠ Bu eleme bir 404 ÜRETMEZ — `/odeme/mock` statik bir `.astro` ve odasını
 * `mock.astro`'daki `oda="OCAK"` ile kendi taşıyor; `getOda()` yalnız
 * `notion-pages.ts`ten, yalnız Notion kaynaklı slug'lar için çağrılıyor.
 * 404'ü sayfanın kendi kapısı üretir. Burada olan şey tutarlılık: kapalı bir
 * yüzey eşlemede durup sessizce oda kazanmaz.
 */
export const ODA_MAP: Record<string, Oda> =
  DUSEN_ROUTELAR.length === 0
    ? ODA_MAP_HAM
    : Object.fromEntries(
        Object.entries(ODA_MAP_HAM).filter(
          ([slug]) => !DUSEN_ROUTELAR.includes(slug),
        ),
      );

/**
 * Slug'tan oda döner. Slug kapalı sette yoksa fırlatır — Notion'a beklenmedik bir
 * sayfa eklendiğinde build'i sessizce yanlış oda ile geçirmek yerine erken kır.
 */
export function getOda(slug: string): Oda {
  const oda = ODA_MAP[slug];
  if (!oda) {
    throw new Error(
      `getOda: bilinmeyen slug "${slug}" — ODA_MAP'te yok (kapalı set, KARAR 87). ` +
        `Notion'a yeni sayfa eklendiyse önce ODA_MAP'e ekle.`,
    );
  }
  return oda;
}
