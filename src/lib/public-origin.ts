/**
 * public-origin.ts — Vercel proxy uyumlu public origin türetme (Aşama 3b
 * eyeball Bulgu 1 + 4). Vercel Serverless Functions ortamında
 * `request.url` host bilgisini internal runtime host'tan (localhost)
 * çözer; gerçek public origin için `x-forwarded-*` header'ları
 * gereklidir.
 *
 * Sıra:
 *  1. `x-forwarded-proto` + `x-forwarded-host` — Vercel proxy doldurur
 *     (preview: ocak-site-...vercel.app, prod: www.ocak.biz).
 *  2. `host` header — lokal dev (Astro `localhost:4321`).
 *  3. `request.url` origin — son çare (lokal'de internal de buraya düşer,
 *     fallback olarak güvenli).
 *
 * `/api/kayit` (checkout başlat) ve `/api/odeme-callback` (success/iptal
 * redirect) ikisi de bu helper'ı kullanır — TEK yer.
 */
export function publicOrigin(request: Request): string {
  const proto = request.headers.get('x-forwarded-proto');
  const host =
    request.headers.get('x-forwarded-host') ?? request.headers.get('host');
  if (host) return `${proto ?? 'https'}://${host}`;
  return new URL(request.url).origin;
}
