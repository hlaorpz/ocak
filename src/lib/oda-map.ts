/**
 * oda-map.ts — Slug → Oda sabit eşlemesi (KARAR 87, Çekirdek SİTE MİMARİSİ tablosu)
 *
 * Kapalı set. Notion Sayfalar DB'sinde "oda" property'si YOK (Brief 1 sapma
 * raporu) — oda kaynağı kod-içi bu map (Brief 2 mimari karar A). Notion'a oda property
 * eklenmedi; tek doğruluk kaynağı burası.
 */

import { KART_AKISI_ACIK, KART_ROUTELARI } from './kart-akisi.ts';

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
  // Yasal (statik .astro, Notion DIŞI — PayTR onay sayfaları, brief-yasal-sayfalar-adim1.md)
  '/hakkimizda': 'OCAK',
  '/gizlilik': 'OCAK',
  '/mesafeli-satis': 'OCAK',
  '/teslimat-iade': 'OCAK',
  // Ödeme akışı (statik .astro, Notion DIŞI — Aşama 3b mock; PayTR Aşama 6)
  // KARAR 488 — kart akışı kapalıyken üç entry aşağıda listeden DÜŞER.
  // Girdiler burada duruyor (silinmedi); eleme `ODA_MAP`'in kurulumunda.
  '/odeme/mock': 'OCAK',
  '/odeme/tamam': 'OCAK',
  '/odeme/iptal': 'OCAK',
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
 * Slug → Oda, yürürlükteki hâl. KARAR 488 — kart akışı kapalıyken üç ödeme
 * route'u listeden düşer; `getOda()` onlar için fırlatır, ki kapalı bir akışın
 * sayfası sessizce oda kazanmasın. Anahtar açılınca üçü kendiliğinden döner.
 */
export const ODA_MAP: Record<string, Oda> = KART_AKISI_ACIK
  ? ODA_MAP_HAM
  : Object.fromEntries(
      Object.entries(ODA_MAP_HAM).filter(
        ([slug]) => !(KART_ROUTELARI as readonly string[]).includes(slug),
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
