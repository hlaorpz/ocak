/**
 * oda-map.ts — Slug → Oda sabit eşlemesi (KARAR 87, Çekirdek SİTE MİMARİSİ tablosu)
 *
 * 19 sayfa kapalı set. Notion Sayfalar DB'sinde "oda" property'si YOK (Brief 1 sapma
 * raporu) — oda kaynağı kod-içi bu map (Brief 2 mimari karar A). Notion'a oda property
 * eklenmedi; tek doğruluk kaynağı burası.
 */

export type Oda = 'OCAK' | 'Yol' | 'Buluşmalar' | 'Yolculuk' | 'Biz' | 'İletişim';

export const ODA_MAP: Record<string, Oda> = {
  // OCAK — çekirdek/kimlik
  '/': 'OCAK',
  '/hikaye': 'OCAK',
  '/felsefe': 'OCAK',
  '/araclar': 'OCAK',
  '/site-rehber': 'OCAK',
  '/test': 'OCAK',                    // Kaan format referansı (lansman öncesi dev sayfa)
  // Yol
  '/sen-neredesin': 'Yol',
  // Buluşmalar
  '/bulusmalar': 'Buluşmalar',
  '/cember': 'Buluşmalar',
  '/acik-kapi': 'Buluşmalar',
  '/seremoni': 'Buluşmalar',
  '/workshop': 'Buluşmalar',
  '/istanbul': 'Buluşmalar',
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
};

/**
 * Slug'tan oda döner. Slug kapalı sette yoksa fırlatır — Notion'a beklenmedik bir
 * sayfa eklendiğinde build'i sessizce yanlış oda ile geçirmek yerine erken kır.
 */
export function getOda(slug: string): Oda {
  const oda = ODA_MAP[slug];
  if (!oda) {
    throw new Error(
      `getOda: bilinmeyen slug "${slug}" — ODA_MAP'te yok (19 sayfa kapalı set, KARAR 87). ` +
        `Notion'a yeni sayfa eklendiyse önce ODA_MAP'e ekle.`,
    );
  }
  return oda;
}
