/**
 * form-anchor-registry.ts — Slug × form-anchor sırası → component eşleştirme (#29 Brief F.5).
 *
 * Plugin Notion'daki `## section: form-anchor` markerlarını `data-form-anchor` boş
 * `<section>` olarak emit eder (sıra korunur). Loader markdown body'i bu marker'larda
 * kesip fragments dizisi üretir. PageContent helper fragments'i iterate ederken her
 * form-anchor'da `formAnchorRegistry[slug][index]` component'ini basar — sıra ve prop
 * default'ları tek otorite burada (KARAR 126 ruhu, KARAR 125 sıra niyeti).
 *
 * Faz 4 (brief-kayit-buton-FINAL): kayit-cta emekliye ayrıldı; 7 format sayfası
 * ve /takvim'in registry entry'leri düştü (Notion'da o sayfalarda form-anchor
 * marker'ı zaten yok — kayıt CTA'sı artık sonraki-bulusma primitive'i +
 * mini-cta post-render helper'ıyla basılır). / (home) AtesMektuplari sayfa
 * altında kalıyor.
 *
 * Defansif: slug yoksa registry'de → boş array → fragment null basar, sayfa çökmez.
 */

import AtesMektuplari from '../components/AtesMektuplari.astro';

// Astro component factory — Astro'nun runtime tip exportları internal API'de yaşıyor.
// Registry consumer (PageContent.astro) bu değerleri `<Component />` olarak render eder;
// JSX side burada `any` üzerinden geçer, fonksiyon imzası tip-güvenliği vermez (gerek de yok).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AstroComponent = any;

export const formAnchorRegistry: Record<string, AstroComponent[]> = {
  '/': [AtesMektuplari],
};

/**
 * Slug → anchor index → default prop'lar. Şu an sadece / (AtesMektuplari)
 * kullanıyor — component prop'suz, boş array.
 */
export const formAnchorProps: Record<string, Array<Record<string, unknown>>> = {};
