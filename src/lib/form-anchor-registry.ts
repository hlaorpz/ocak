/**
 * form-anchor-registry.ts — Slug × form-anchor sırası → component eşleştirme (#29 Brief F.5).
 *
 * Plugin Notion'daki `## section: form-anchor` markerlarını `data-form-anchor` boş
 * `<section>` olarak emit eder (sıra korunur). Loader markdown body'i bu marker'larda
 * kesip fragments dizisi üretir. PageContent helper fragments'i iterate ederken her
 * form-anchor'da `formAnchorRegistry[slug][index]` component'ini basar — sıra ve prop
 * default'ları tek otorite burada (KARAR 126 ruhu, KARAR 125 sıra niyeti).
 *
 * KARAR 206 (Brief 3): 5 format sayfasında AtesMektuplariCTA/AcikKapiKayit →
 * KayitCTA (ayrı /[format]/kayit route'una link). Kayıt aksiyonu sade — Ateş
 * Mektupları aboneliği bu sayfalardan kalktı (ana sayfa + footer'da kalır).
 * /takvim + /yolculuk hâlâ AtesMektuplariCTA (kayıt sayfaları yok).
 *
 * /iletisim — eski çoklu anchor (sıra 2 IletisimForm + sıra 7 CTA), form göçü
 * (brief-iletisim-form-tasima.md) sonrası SIFIR anchor.
 *
 * brief-appscript-olum: CemberBasvuru + AcikKapiKayit component'leri silindi
 * (Apps Script paritesi ile birlikte). Pipeline B (/api/kayit) tek kayıt akışı.
 *
 * Defansif: slug yoksa registry'de → boş array → fragment null basar, sayfa çökmez.
 */

import AtesMektuplari from '../components/AtesMektuplari.astro';
import AtesMektuplariCTA from '../components/AtesMektuplariCTA.astro';
import KayitCTA from '../components/KayitCTA.astro';

// Astro component factory — Astro'nun runtime tip exportları internal API'de yaşıyor.
// Registry consumer (PageContent.astro) bu değerleri `<Component />` olarak render eder;
// JSX side burada `any` üzerinden geçer, fonksiyon imzası tip-güvenliği vermez (gerek de yok).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AstroComponent = any;

export const formAnchorRegistry: Record<string, AstroComponent[]> = {
  '/': [AtesMektuplari],
  // 6 format sayfası → KayitCTA (ayrı /[format]/kayit route'una link).
  '/cember': [KayitCTA],
  '/acik-kapi': [KayitCTA],
  '/mini-retreat': [KayitCTA],
  '/seremoni': [KayitCTA],
  '/sehir-aksami': [KayitCTA],
  '/atolye': [KayitCTA],
  // /takvim + /yolculuk: kayıt sayfası yok, AtesMektuplariCTA kalır.
  '/takvim': [AtesMektuplariCTA],
  '/yolculuk': [AtesMektuplariCTA],
};

/**
 * Slug → anchor index → default prop'lar.
 *
 * KayitCTA prop'ları: { href, kategoriAdi } — cümle "Sıradaki <kategoriAdi> için
 * tarih seç...". kategoriAdi nominative; cümle akışı için isim sırasına dikkat
 * edilmeli (örn. 'çembere' YANLIŞ — "Sıradaki çembere için" kırılır).
 *
 * AtesMektuplariCTA prop'u: kategoriAdi (insan-okur format adı, küçük harf).
 */
export const formAnchorProps: Record<string, Array<Record<string, unknown>>> = {
  // 6 format sayfası — KayitCTA
  '/cember': [{ href: '/cember/kayit', kategoriAdi: 'Çember' }],
  '/acik-kapi': [{ href: '/acik-kapi/kayit', kategoriAdi: 'Açık Kapı' }],
  '/mini-retreat': [{ href: '/mini-retreat/kayit', kategoriAdi: 'mini retreat' }],
  '/seremoni': [{ href: '/seremoni/kayit', kategoriAdi: 'mevsim seremonisi' }],
  '/sehir-aksami': [{ href: '/sehir-aksami/kayit', kategoriAdi: 'şehir akşamı' }],
  '/atolye': [{ href: '/atolye/kayit', kategoriAdi: 'atölye' }],
  // Kayıt sayfası olmayanlar — AtesMektuplariCTA
  '/takvim': [{ kategoriAdi: 'OCAK buluşması' }],
  '/yolculuk': [{ kategoriAdi: 'Anadolu Yolculuğu' }],
};
