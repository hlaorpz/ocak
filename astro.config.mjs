import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import remarkOcakSections from './src/lib/remark-ocak-sections.ts';
import { kartAkisiAcikMi, KART_ROUTELARI } from './src/lib/kart-akisi.ts';

// KARAR 488 — kart akışı anahtarı. Config bağlamında `import.meta.env` custom
// değişkenleri TAŞIMAZ (Vite env enjeksiyonu src/ için yapılır, config yüklenirken
// değil) — bu yüzden `loadEnv` ile okunuyor. Prefix '' → hem .env dosyaları hem
// Vercel'in process.env'i kapsanır. Kural tek yerde: `kartAkisiAcikMi`.
const KART_ACIK = kartAkisiAcikMi(
  loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '').KART_AKISI,
);

// https://astro.build/config
export default defineConfig({
  site: 'https://www.ocak.biz',
  output: 'static',
  // Cross-site POST muhafızı Astro'dan ALINDI, `src/lib/origin-muhafiz.ts`'ye
  // TAŞINDI — kapatılmadı. İki sebep, ikisi de ölçülmüş:
  //  1. Astro'nun kuralı (`astro/dist/core/app/middlewares.js:8-34`) yalnız
  //     form-benzeri content-type'ı ya da content-type'ı HİÇ olmayan isteği
  //     ölçüyor. Dört form endpoint'imiz `application/json` POST alıyor —
  //     yani muhafız onlara zaten BAKMIYORDU.
  //  2. `/api/odeme-callback` N-Kolay'dan DIŞ origin'li `x-www-form-urlencoded`
  //     POST alacak; Astro'nun muhafızı onu handler'a girmeden 403 eder ve
  //     bayrak route başına ayarlanamaz.
  // Karşılığı: `originMuhafizi(request)` → `/api/{kayit,form,promo-dogrula}`
  // başında 403; `/api/davet` kendi sessiz-ret kapısını korur
  // (`davet-kapi.ts:originSebebi`); callback bilinçli muaf.
  // ⚠ Bu bayrağı geri `true` yapmak callback'i kırar.
  security: { checkOrigin: false },
  adapter: vercel({
    webAnalytics: { enabled: false }, // Lansman sonrası açılabilir
  }),
  integrations: [
    sitemap({
      // /test KARAR 143 — Kaan görsel referansı, Google görmemeli.
      //
      // KARAR 488 — kart akışı kapalıyken üç /odeme/* route'u elenir. Bunlar
      // `prerender = false` OLMASINA RAĞMEN sitemap'e giriyordu; dist/ ölçümüyle
      // doğrulandı (19 Ağu: sitemap-0.xml içinde üçü de <loc> olarak vardı).
      // "SSR route sitemap'e girmez" varsayımı bu kurulumda tutmuyor.
      filter: (page) =>
        !page.includes('/test') &&
        (KART_ACIK || !KART_ROUTELARI.some((r) => page.includes(r))),
    }),
  ],
  // remark-ocak-sections: `## section: NAME` → kanonik <section> transform (#23 Brief 1
  // wiring). Loader renderMarkdown() bu markdown config'ini kullanır (createMarkdownProcessor),
  // böylece store'a yazılan rendered.html plugin'den geçer. oda/filename opsiyonları
  // transform'da kullanılmadığı için global wiring yeterli (per-sayfa opsiyon gerekmez).
  markdown: {
    remarkPlugins: [remarkOcakSections],
  },
  // Slug rename 2026-07-03: /workshop→/atolye, /istanbul→/sehir-aksami. Site
  // stealth (robots Disallow, dış link yok) → dış referans neredeyse yok, ama
  // Kaan bookmark + davet linklerine sigorta. ~6 ay sonra silinebilir.
  redirects: {
    '/workshop': { status: 301, destination: '/atolye' },
    '/istanbul': { status: 301, destination: '/sehir-aksami' },
    '/workshop/kayit': { status: 301, destination: '/atolye/kayit' },
    '/istanbul/kayit': { status: 301, destination: '/sehir-aksami/kayit' },
  },
  build: {
    inlineStylesheets: 'auto',
    assets: '_ocak',
  },
  trailingSlash: 'never',
  compressHTML: true,
});
