import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import remarkOcakSections from './src/lib/remark-ocak-sections.ts';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.ocak.biz',
  output: 'static',
  adapter: vercel({
    webAnalytics: { enabled: false }, // Lansman sonrası açılabilir
  }),
  integrations: [
    sitemap({
      // /test KARAR 143 — Kaan görsel referansı, Google görmemeli.
      // /onizleme/* (Brief brief-fotolu-onizleme.md) — fotolu önizleme oyun alanı,
      // master ile yan yana canlı ama Google indekslemesin (robots.txt'te de disallow).
      filter: (page) => !page.includes('/test') && !page.includes('/onizleme'),
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
