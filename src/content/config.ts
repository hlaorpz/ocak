import { defineCollection, z } from 'astro:content';
import { notion, NOTION_PAGES_DB, NOTION_EVENTS_DB } from '../lib/notion';
import {
  fetchSayfalar,
  transformPage,
  splitBodyByMarkers,
  resolveNotionPageLinks,
} from '../lib/notion-pages';
import { fetchEtkinlikler, transformEtkinlik } from '../lib/notion-etkinlikler';

/**
 * Sayfalar — 19 site sayfasının içerikleri.
 * Astro 5 Content Layer API: custom loader Notion Sayfalar DB'sini build-time çeker.
 * (Eski file-based `type: 'content'` yaklaşımı Brief 2'de loader'a dönüştürüldü.)
 *
 * Şema Brief 1 keşif raporundaki Notion gerçeğine eşli. `oda` Notion'da YOK —
 * kod-içi ODA_MAP'ten türetilir (transformPage içinde, mimari karar A).
 */
const sayfalar = defineCollection({
  loader: {
    name: 'notion-sayfalar',
    load: async ({ store, logger, parseData, generateDigest, renderMarkdown }) => {
      store.clear();

      const pages = await fetchSayfalar(notion, NOTION_PAGES_DB);
      logger.info(`Notion Sayfalar DB: ${pages.length} satır çekildi`);

      // FIXME: Lansman öncesi Durum filtresi (sadece Onaylandı + Yayında publish) —
      // Brief 5/6'da eklenecek. Şu an 19 sayfa "Onay Bekliyor"da; filtre eklenirse
      // loader boş döner, o yüzden şimdilik tüm durumlar publish edilir.

      // İki-pass: önce tüm sayfaları transform et, page-id → slug map'i derle, sonra
      // her sayfanın fragment'larını render et + page-mention link'leri çöz
      // (resolveNotionPageLinks, KARAR 116 link normalize ailesi cross-page genişletmesi,
      // Brief Araçlar İŞ 2). Page-id formatı: Notion API UUID `xxxxxxxx-xxxx-...`,
      // dash'leri strip → 32-hex (notion-to-md page-mention href'iyle aynı format).
      const transformedPages: Array<NonNullable<Awaited<ReturnType<typeof transformPage>>>> = [];
      for (const page of pages) {
        const transformed = await transformPage(notion, page);
        if (transformed) transformedPages.push(transformed);
      }

      const pageIdToSlug: Record<string, string> = {};
      for (const t of transformedPages) {
        pageIdToSlug[t.id.replace(/-/g, '')] = t.frontmatter.slug;
      }

      let ok = 0;
      for (const transformed of transformedPages) {
        const slug = transformed.frontmatter.slug;

        // Fragment split (#29 Brief F.5 Adım 3; KARAR 127 genişletme): body'i tanınan
        // marker satırlarında parçala, her markdown chunk'ı renderMarkdown ile HTML'e
        // indir. PageContent helper bu diziyi iterate edip marker kind'larına göre
        // component basar (form-anchor → registry; al-ol-ver → AlOlVer; sonraki-bulusma
        // → SonrakiBulusma slug prop'uyla otomatik kategori).
        const rawFragments = splitBodyByMarkers(transformed.body);
        const fragments = await Promise.all(
          rawFragments.map(async (frag) => {
            if (frag.kind === 'markdown') {
              const r = await renderMarkdown(frag.content);
              return {
                kind: 'markdown' as const,
                html: resolveNotionPageLinks(r.html, pageIdToSlug, slug),
              };
            }
            // KARAR 151: form-anchor intro varsa markdown→HTML render et (markdown
            // chunk'larıyla aynı pipeline'dan geçer — remark-ocak-sections plugin
            // section etiketi görmediği için sadece normalizer/link kurallarını uygular).
            if (frag.kind === 'form-anchor' && frag.intro) {
              const r = await renderMarkdown(frag.intro);
              return {
                kind: 'form-anchor' as const,
                index: frag.index,
                introHtml: resolveNotionPageLinks(r.html, pageIdToSlug, slug),
              };
            }
            return frag;
          }),
        );

        const data = await parseData({
          id: slug,
          data: { ...transformed.frontmatter, fragments },
        });

        // body (markdown) + rendered HTML saklanır (#23 Brief 1). renderMarkdown astro.config
        // markdown pipeline'ından geçer → remarkOcakSections section transform'u uygulanır.
        // render(sayfa) çıktıyı entry.rendered.html'den okur. PageContent helper data.fragments
        // kullandığı için rendered Brief F.5 sonrası vestigial (override migration sonunda).
        const rendered = await renderMarkdown(transformed.body);
        store.set({
          id: slug,
          data,
          body: transformed.body,
          rendered: { ...rendered, html: resolveNotionPageLinks(rendered.html, pageIdToSlug, slug) },
          digest: generateDigest(transformed.body),
        });
        ok++;
      }

      logger.info(`Notion Sayfalar: ${ok} sayfa store'a yazıldı`);
    },
  },
  schema: z.object({
    slug: z.string(),
    title: z.string(),
    description: z.string().optional(),
    oda: z.enum(['OCAK', 'Yol', 'Buluşmalar', 'Yolculuk', 'Biz', 'İletişim']),
    durum: z.enum(['Taslak', 'Onay Bekliyor', 'Onaylandı', 'Yayında']),
    ogImage: z.string().optional(),
    notion_id: z.string(),
    // Body fragment'ları (#29 Brief F.5 + KARAR 127 genişletme).
    // PageContent helper bu diziyi iterate eder:
    //   - markdown → set:html
    //   - form-anchor → registry component (slug × index)
    //   - al-ol-ver → AlOlVer component
    //   - sonraki-bulusma → SonrakiBulusma slug prop'lu (otomatik kategori/heading)
    //   - etkinlik-takvimi → EtkinlikTakvimi (tüm gelecek etkinlikler, /takvim — KARAR 153)
    fragments: z.array(
      z.union([
        z.object({ kind: z.literal('markdown'), html: z.string() }),
        // KARAR 151: introHtml — form-anchor markerından hemen önceki section
        // etiketinin içeriği (etiket kendisi çıkarılmış olarak) render edilmiş HTML.
        z.object({
          kind: z.literal('form-anchor'),
          index: z.number(),
          introHtml: z.string().optional(),
        }),
        z.object({ kind: z.literal('al-ol-ver') }),
        z.object({ kind: z.literal('sonraki-bulusma') }),
        z.object({ kind: z.literal('etkinlik-takvimi') }),
      ]),
    ),
  }),
});

/**
 * Etkinlikler — `data` collection (body yok, sadece property'ler).
 * SonrakiBulusma section'ı Brief 5'te bu collection'a bağlanacak (KARAR 93).
 * Şema Brief 1 keşfindeki Notion gerçeğine eşli; relative kayitUrl için .url() YOK.
 */
const etkinlikler = defineCollection({
  loader: {
    name: 'notion-etkinlikler',
    load: async ({ store, logger, parseData, generateDigest }) => {
      store.clear();

      const rows = await fetchEtkinlikler(notion, NOTION_EVENTS_DB);
      logger.info(`Notion Etkinlikler DB: ${rows.length} satır çekildi`);

      // Publish filtresi (Brief 5): siteGoster=true VE durum aktif.
      // Durum yaşam döngüsü: Taslak → (kayıt açılınca) Kayıt Açık → (dolunca) Dolu →
      // (bitince) Geçti. Aktif = {Kayıt Açık, Dolu}; Taslak/Geçti/İptal sessizce gizli.
      const AKTIF_DURUM = new Set(['Kayıt Açık', 'Dolu']);

      let ok = 0;
      let gizli = 0;
      for (const row of rows) {
        const fm = transformEtkinlik(row);

        // siteGoster=false veya durum aktif değil → sessizce atla (bilinçli karar).
        if (!fm.siteGoster || !AKTIF_DURUM.has(fm.durum)) {
          gizli++;
          continue;
        }

        const data = await parseData({ id: fm.notion_id, data: fm });
        store.set({ id: fm.notion_id, data, digest: generateDigest(JSON.stringify(fm)) });
        ok++;
      }

      logger.info(`Notion Etkinlikler: ${ok} yüklendi, ${gizli} atlandı (gizli/pasif durum)`);
    },
  },
  schema: z.object({
    baslik: z.string(),
    tip: z.enum([
      'Yolculuk',
      'Mini Retreat',
      'İstanbul Akşamı',
      'Workshop',
      'Mevsim Seremonisi',
      'Açık Kapı',
      'Çember',
    ]),
    tarihBaslangic: z.string(),
    tarihBitis: z.string().optional(),
    saat: z.string().optional(),
    mekan: z.enum(['Online', 'İzmir', 'İstanbul', 'Ege', 'Anadolu']),
    mekanDetay: z.string().optional(),
    kayitUrl: z.string().optional(), // relative URL'ler valid olmalı — .url() YOK
    durum: z.enum(['Taslak', 'Kayıt Açık', 'Dolu', 'Geçti', 'İptal']),
    aciklama: z.string().optional(),
    siteGoster: z.boolean(),
    oneCikar: z.boolean(),
    notion_id: z.string(),
  }),
});

export const collections = { sayfalar, etkinlikler };
