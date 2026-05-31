/**
 * form-anchor-registry.ts — Slug × form-anchor sırası → component eşleştirme (#29 Brief F.5).
 *
 * Plugin Notion'daki `## section: form-anchor` markerlarını `data-form-anchor` boş
 * `<section>` olarak emit eder (sıra korunur). Loader markdown body'i bu marker'larda
 * kesip fragments dizisi üretir. PageContent helper fragments'i iterate ederken her
 * form-anchor'da `formAnchorRegistry[slug][index]` component'ini basar — sıra ve prop
 * default'ları tek otorite burada (KARAR 126 ruhu, KARAR 125 sıra niyeti).
 *
 * Çoklu anchor: /iletisim → sıra 2'de IletisimForm, sıra 7'de AtesMektuplariCTA
 * (envanter `4b5af7c` ground-truth). Diğer 9 sayfa tek anchor.
 *
 * Defansif: slug yoksa registry'de → boş array → fragment null basar, sayfa çökmez.
 */

import AtesMektuplari from '../components/AtesMektuplari.astro';
import CemberBasvuru from '../components/CemberBasvuru.astro';
import AcikKapiKayit from '../components/AcikKapiKayit.astro';
import IletisimForm from '../components/IletisimForm.astro';
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
  '/iletisim': [IletisimForm, AtesMektuplariCTA], // sıra 2 → form, sıra 7 → CTA
  '/mini-retreat': [AtesMektuplariCTA],
  '/seremoni': [AtesMektuplariCTA],
  '/istanbul': [AtesMektuplariCTA],
  '/workshop': [AtesMektuplariCTA],
  '/takvim': [AtesMektuplariCTA],
  '/yolculuk': [AtesMektuplariCTA],
};

/**
 * Slug → anchor index → default prop. AtesMektuplariCTA `kategoriAdi` zorunlu;
 * IletisimForm prop almıyor, yer tutucu boş obje (`{}`).
 */
export const formAnchorProps: Record<string, Array<Record<string, unknown>>> = {
  '/mini-retreat': [{ kategoriAdi: 'mini retreat' }],
  '/seremoni': [{ kategoriAdi: 'mevsim seremonisi' }],
  '/istanbul': [{ kategoriAdi: 'İstanbul akşamı' }],
  '/workshop': [{ kategoriAdi: 'workshop' }],
  '/takvim': [{ kategoriAdi: 'OCAK buluşması' }],
  '/yolculuk': [{ kategoriAdi: 'Anadolu Yolculuğu' }],
  '/iletisim': [{}, { kategoriAdi: 'Ateş Mektupları' }],
};
