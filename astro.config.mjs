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
  // (aynı kural: `origin-kural.ts:originSebebi`); callback bilinçli muaf.
  // ⚠ Bu bayrağı geri `true` yapmak callback'i kırar.
  security: { checkOrigin: false },
  adapter: vercel({
    // AÇILDI 17 Eki 2026 (B240, `03-sira.md` R-5, Kaan onayı).
    //
    // ⚠ Vercel TARAFI ZATEN AÇIKTI: proje kaydında `webAnalytics.enabledAt` =
    // 2026-07-01T21:54:11Z, `disabledAt` yok. Eksik olan tek şey bu bayraktı —
    // yani istemci betiği. API'nin `404: Web Analytics not found` yanıtı
    // "kapalı" DEĞİL "hiç veri gelmemiş" demek; teşhiste ilk okuyuşta bu
    // karıştırıldı ve "özellik kapalı" diye yazıldı (kronolojide düzeltildi).
    //
    // ── Neden gerekti ──
    // Rıza kapısı sert (KARAR 627): kabul edilmeden GTM hiç yüklenmiyor, yani
    // Pixel ve GA4 **rızalı alt kümeyi** sayıyor. 11–14 Eki reklam turunda
    // ~304 link tıklamasına karşı Meta 53 sayfa görüntülemesi gördü ve farkın
    // ne kadarı rıza kaybı olduğu ÖLÇÜLEMEDİ — ziyaretçi düzeyinde payda yoktu.
    // Bu, rızadan bağımsız ve kimliksiz bir payda veriyor.
    //
    // ── Neden rıza kapısının ARKASINA konmadı ──
    // Konsa amacını yitirirdi: ölçülmesi gereken şey tam olarak **kabul etmeyen**
    // ziyaretçi. Dayanak, rıza değil meşru menfaat — ve bu ancak araç kimlik
    // taşımadığı sürece savunulabilir, o yüzden kapsam genişletilmemeli:
    // `beforeSend`/custom event YOK, yalnız otomatik sayfa görüntülemesi.
    //
    // ── Ölçülen sözleşme (KARAR 603) ──
    // Enjekte edilen betik PRODUCTION'da birinci taraf yolda:
    // `/_vercel/insights/script.js` (`node_modules/@astrojs/vercel/dist/lib/
    // web-analytics.js` okundu) — üçüncü taraf host YOK, CDN yok. Vercel beyanı
    // (`vercel.com/docs/analytics/privacy-policy`, 2026-06-26): üçüncü taraf
    // çerez kullanılmaz, ziyaretçi "a hash created from the incoming request"
    // ile tanınır, kayıt anonim, oturum ömrü 24 saatte atılır. Toplanan alanlar:
    // zaman damgası · URL · dinamik yol · referrer · filtrelenmiş query ·
    // coğrafya (ülke/bölge/şehir) · OS · tarayıcı · cihaz tipi.
    // ⚠ "üçüncü taraf çerez yok" ≠ "hiç çerez yok" — beyan bu ikisini
    // ayırmıyor. **Deploy sonrası ölçülecek** (`03-sira.md` R-5): canlıda
    // `document.cookie` ve çağrılan host listesi.
    //
    // ⚠ Aydınlatma metni BU COMMIT'TE güncellendi (`src/pages/gizlilik.astro`):
    // eski "analitik çerezler yalnızca onay vermeniz hâlinde çalışır" cümlesi
    // bu araçla GERÇEĞE AYKIRI hâle geliyordu. Hukuki lafzın teyidi Kaan'da.
    webAnalytics: { enabled: true },
  }),
  integrations: [
    sitemap({
      // /test KARAR 143 — Kaan görsel referansı, Google görmemeli.
      //
      // KARAR 488 — kart akışı kapalıyken dört /odeme/* route'u elenir. Bunlar
      // ⚠ "üç" yazıyordu (7 Eki düzeltildi): yorum `/odeme/nkolay` listeye
      // katılmadan önce yazılmıştı, `KART_ROUTELARI` o günden beri dört üyeli.
      // Aşağıdaki 19 Ağu ölçümü üç route'luk hâle ait, olduğu gibi duruyor.
      // `prerender = false` OLMASINA RAĞMEN sitemap'e giriyordu; dist/ ölçümüyle
      // doğrulandı (19 Ağu: sitemap-0.xml içinde üçü de <loc> olarak vardı).
      // "SSR route sitemap'e girmez" varsayımı bu kurulumda tutmuyor.
      //
      // 01 Eki 2026 — `/odeme/` öneki KOŞULSUZ elenir. Ölçüm: canlı
      // sitemap-0.xml 49 <loc>, dördü /odeme/{iptal,mock,nkolay,tamam} —
      // çünkü production'da `KART_AKISI=acik` ve yukarıdaki KARAR 488 kapısı
      // açık akışta dördünü GEÇİRİYOR. Ödeme route'ları hiçbir hâlde arama
      // sonucu olmamalı: checkout ve dönüş ekranları, kadın oraya sitemap'ten
      // değil kayıt formundan gelir. KARAR 488 koşulu silinmedi — kart akışı
      // kapalıyken `oda-map` ile tek kaynaktan konuşmayı sürdürüyor; bu satır
      // ondan bağımsız, akış açıkken de kapatan ikinci kapıdır.
      filter: (page) =>
        !page.includes('/test') &&
        !page.includes('/odeme/') &&
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
