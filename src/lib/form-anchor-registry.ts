/**
 * form-anchor-registry.ts — Slug × form-anchor sırası → component eşleştirme (#29 Brief F.5).
 *
 * Plugin Notion'daki `## section: form-anchor` markerlarını `data-form-anchor` boş
 * `<section>` olarak emit eder (sıra korunur). Loader markdown body'i bu marker'larda
 * kesip fragments dizisi üretir. PageContent helper fragments'i iterate ederken her
 * form-anchor'da `formAnchorRegistry[slug][index]` component'ini basar — sıra ve prop
 * default'ları tek otorite burada (KARAR 126 ruhu, KARAR 125 sıra niyeti).
 *
 * /iletisim — eski çoklu anchor (sıra 2 IletisimForm + sıra 7 CTA), form göçü
 * (brief-iletisim-form-tasima.md) sonrası SIFIR anchor: form /iletisim/bize-yaz'a
 * taşındı, Ateş Mektupları CTA da kaldırıldı. Registry'de entry yok.
 *
 * Defansif: slug yoksa registry'de → boş array → fragment null basar, sayfa çökmez.
 */

import AtesMektuplari from '../components/AtesMektuplari.astro';
import CemberBasvuru from '../components/CemberBasvuru.astro';
import AcikKapiKayit from '../components/AcikKapiKayit.astro';
import AtesMektuplariCTA from '../components/AtesMektuplariCTA.astro';

// Astro component factory — Astro'nun runtime tip exportları internal API'de yaşıyor.
// Registry consumer (PageContent.astro) bu değerleri `<Component />` olarak render eder;
// JSX side burada `any` üzerinden geçer, fonksiyon imzası tip-güvenliği vermez (gerek de yok).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AstroComponent = any;

export const formAnchorRegistry: Record<string, AstroComponent[]> = {
  '/': [AtesMektuplari],
  '/cember': [CemberBasvuru],
  '/acik-kapi': [AcikKapiKayit],
  // /iletisim — form göçü (brief-iletisim-form-tasima.md) sonrası Ateş Mektupları
  // CTA da kaldırıldı (kullanıcı kararı): /iletisim orientasyon sayfasında hiç
  // form-anchor olmamalı. Notion'da iki `## section: form-anchor` marker'ı da
  // silinmeli — sayfa form-anchor'sız. Registry'de entry yok → defansif `?? []`.
  '/mini-retreat': [AtesMektuplariCTA],
  '/seremoni': [AtesMektuplariCTA],
  '/istanbul': [AtesMektuplariCTA],
  '/workshop': [AtesMektuplariCTA],
  '/takvim': [AtesMektuplariCTA],
  '/yolculuk': [AtesMektuplariCTA],
};

/**
 * Slug → anchor index → default prop. AtesMektuplariCTA `kategoriAdi` zorunlu.
 */
export const formAnchorProps: Record<string, Array<Record<string, unknown>>> = {
  '/mini-retreat': [{ kategoriAdi: 'mini retreat' }],
  '/seremoni': [{ kategoriAdi: 'mevsim seremonisi' }],
  '/istanbul': [{ kategoriAdi: 'İstanbul akşamı' }],
  '/workshop': [{ kategoriAdi: 'workshop' }],
  '/takvim': [{ kategoriAdi: 'OCAK buluşması' }],
  '/yolculuk': [{ kategoriAdi: 'Anadolu Yolculuğu' }],
};
