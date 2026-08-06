/**
 * === PLACEHOLDER TEST HELPER — ek-brief-oran-placeholder.md ===
 *
 * GEÇİCİ. Doğrulama sonrası Kaan onayıyla bu dosya + tüm import'lar + tüm usage
 * yorumlanmış `// PLACEHOLDER` bloklarıyla SİLİNECEK. Kalıcı kod değil.
 *
 * Amaç: /onizleme/* foto yuvalarının oranlarının doğru render olduğunu mühendislik
 * düzeyinde doğrulamak. Her placeholder, container'ın aspect-ratio CSS'ine güvenir
 * (SVG `preserveAspectRatio="xMidYMid meet"` viewBox oranıyla eşli) — kutu doğru
 * oranda değilse SVG metni ezilir, sapma gözle yakalanır.
 *
 * Master sayfa bu modülü import ETMEZ → master HTML byte-eşit kalır. Yalnız
 * src/pages/onizleme/* dosyalarından kullanılır.
 */

const BG = '#3a2a25'; // koyu ember-ash, kontrast etiket için
// FG, tokens.css `--gold` (#D4A855) ile birebir aynı değerdir (B21/KARAR 204).
// Burada token OKUNAMAZ: bu modül SVG data-URI üretir, CSS custom property
// çözümlenmeden string'e gömülür. Token değişirse bu satır ELLE güncellenir.
const FG = '#d4a855'; // gold — tokens.css:12 --gold ile eşit tutulacak

/**
 * Inline SVG döner — `<Fragment set:html={...}>` ile basılır. w/h aspect oranını
 * tanımlar; container CSS aspect-ratio aynı oranda olmalı → SVG container'ı tam
 * doldurur ve metin distorsiyonsuz görünür.
 */
export function placeholderSvg(label: string, ratio: string, w: number, h: number): string {
  const fs = Math.min(w, h) / 7;
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" ` +
    `preserveAspectRatio="xMidYMid meet" ` +
    `style="display:block;width:100%;height:100%;background:${BG};">` +
    `<rect x="0.5" y="0.5" width="${w - 1}" height="${h - 1}" fill="none" stroke="${FG}" stroke-width="0.3" stroke-dasharray="2 1"/>` +
    `<text x="${w / 2}" y="${h / 2}" text-anchor="middle" dominant-baseline="middle" ` +
    `font-family="sans-serif" font-size="${fs}" font-weight="600" fill="${FG}" letter-spacing="0.05em">` +
    `${label} ${ratio}</text>` +
    `</svg>`
  );
}

/**
 * Data URL döner — `background-image: url(...)` veya `<Hero bgImage={...} />` gibi
 * URL bekleyen yerler için.
 */
export function placeholderDataUrl(label: string, ratio: string, w: number, h: number): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(placeholderSvg(label, ratio, w, h))}`;
}
