import { defineCollection, z } from 'astro:content';
import { notion, NOTION_PAGES_DB, NOTION_EVENTS_DB } from '../lib/notion';
import {
  fetchSayfalar,
  transformPage,
  splitBodyByMarkers,
  resolveNotionPageLinks,
} from '../lib/notion-pages';
import { fetchEtkinlikler, transformEtkinlik } from '../lib/notion-etkinlikler';
import { resolveKayitCtaHref, FORMAT_NOTION_FORMAT, type KayitFormat } from '../lib/kayit';

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
                html: resolveKayitCtaHref(
                  resolveNotionPageLinks(r.html, pageIdToSlug, slug),
                  slug,
                ),
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
          rendered: {
            ...rendered,
            html: resolveKayitCtaHref(
              resolveNotionPageLinks(rendered.html, pageIdToSlug, slug),
              slug,
            ),
          },
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
    // Brief brief-fotolu-onizleme.md İş 2 + ek-brief-foto-oranlari.md Değişiklik 1.
    // Fotolu önizleme alanları (optional). Master sayfa bu alanları okumaz; sadece
    // /onizleme/* iskeleti tüketir → master davranışı sıfır değişir (alanlar boşken
    // HTML byte-identik kalır). Atmosfer: 3 ayrı konumlu property, her biri ana
    // sayfada belirli bir banda denk gelir.
    heroImage: z.string().optional(),
    portreImage: z.string().optional(),
    atmosfer1: z.string().optional(),
    atmosfer2: z.string().optional(),
    atmosfer3: z.string().optional(),
    // Body fragment'ları (#29 Brief F.5 + KARAR 127 genişletme).
    // PageContent helper bu diziyi iterate eder:
    //   - markdown → set:html
    //   - form-anchor → registry component (slug × index)
    //   - al-ol-ver → AlOlVer component
    //   - sonraki-bulusma → SonrakiBulusma slug prop'lu (otomatik kategori/heading)
    //   - etkinlik-takvimi → EtkinlikTakvimi (tüm gelecek etkinlikler, /takvim — KARAR 153)
    //   - yolculuk-eksen → YolculukEksen (Beş Evre + Bir AÇILIŞ ısı şeridi, brief Yolculuk Ekseni v2)
    //   - kanallar → Kanallar (üç kart vitrini, brief brief-kanallar-yerlesim-zemin.md)
    //   - harita-anadolu → AnadoluHarita (sabit Türkiye SVG + 6 evre noktası, brief brief-anadolu-yolculuk.md)
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
        z.object({ kind: z.literal('yolculuk-eksen') }),
        z.object({ kind: z.literal('kanallar') }),
        z.object({ kind: z.literal('harita-anadolu') }),
      ]),
    ),
  }),
});

/**
 * Etkinlikler — `data` collection (body yok, sadece property'ler).
 * SonrakiBulusma section'ı Brief 5'te bu collection'a bağlanacak (KARAR 93).
 * Şema Brief 1 keşfindeki Notion gerçeğine eşli; relative kayitUrl için .url() YOK.
 */
// brief-etkinlik-detay-route.md FAZ 1 — Notion Format select → KayitFormat
// slug'ı. FORMAT_NOTION_FORMAT (slug→Format) tersinin türetilmişi. `Anadolu
// Yolculuğu` KayitFormat dışı → undefined döner (kayıt route'u ayrı:
// /anadolu/basvuru). Detay içindeki `## section: kayit-cta` resolveKayitCtaHref
// tarafından slug-format eşleşmediği için kaldırılır + warn.
const NOTION_FORMAT_KAYIT_SLUG = Object.fromEntries(
  Object.entries(FORMAT_NOTION_FORMAT).map(([slug, notionFmt]) => [notionFmt, slug as KayitFormat]),
) as Record<string, KayitFormat | undefined>;

const etkinlikler = defineCollection({
  loader: {
    name: 'notion-etkinlikler',
    load: async ({ store, logger, parseData, generateDigest, renderMarkdown }) => {
      store.clear();

      const rows = await fetchEtkinlikler(notion, NOTION_EVENTS_DB);
      logger.info(`Notion Etkinlikler DB: ${rows.length} satır çekildi`);

      // Publish filtresi (brief-etkinlik-detay-route.md FAZ 1 — Yol A):
      // Eskiden: siteGoster && durum ∈ {Kayıt Açık, Dolu} — collection zaten
      // Taslak/Geçti/İptal'i eliyordu. Detay sayfası için "geçmiş dahil"
      // gerekiyor (arşiv/okuma değeri kaybolmasın), o yüzden gevşetildi:
      // siteGoster && durum !== 'İptal'. Liste bileşenleri (SonrakiBulusma,
      // EtkinlikTakvimi) durum + bugundenSonra süzgeçlerini artık kendileri
      // uyguluyor — bu commit'te birlikte atomik yerleştirildi.
      let ok = 0;
      let gizli = 0;
      let slugsizYayinAcik = 0;
      for (const row of rows) {
        const fm = transformEtkinlik(row);

        if (!fm.siteGoster || fm.durum === 'İptal') {
          gizli++;
          continue;
        }

        // brief FAZ 1 — Slug guard: yayına açık ama slug yok → görünür WARN.
        // Detay sayfası üretilmeyecek, kart tıklanabilir link olmayacak.
        // Yayına kapalıysa (siteGoster=false) yukarıda zaten sessizce atlandı.
        if (!fm.slug) {
          slugsizYayinAcik++;
          logger.warn(
            `[etkinlikler] "${fm.baslik}" (${fm.notion_id}): siteGoster=true ama Slug boş — detay sayfası üretilmeyecek. Notion "Slug" alanına URL parçası ekle.`,
          );
        }

        // brief FAZ 1 — Detay markdown zinciri (Sayfalar collection'ıyla
        // hizalı): renderMarkdown → resolveNotionPageLinks → resolveKayitCtaHref.
        // pageIdToSlug boş map (Etkinlikler loader'ı Sayfalar DB'sine gitmez;
        // detay içinde Notion @page mention'ı beklenmiyor — çıkarsa warn ile
        // href olduğu gibi kalır, build kırılmaz). resolveKayitCtaHref
        // etkinliğin Format'ından türetilen kayıt slug'ıyla çağrılır: Notion
        // Detay içindeki `## section: kayit-cta` etiketi doğru `/{format}/kayit`
        // hedefine yönlenir; format KayitFormat dışıysa (Anadolu Yolculuğu)
        // block kaldırılır + warn (KARAR 207).
        let detayHtml: string | undefined;
        if (fm.detay) {
          const rendered = await renderMarkdown(fm.detay);
          const kayitSlug = NOTION_FORMAT_KAYIT_SLUG[fm.tip] ?? '';
          detayHtml = resolveKayitCtaHref(
            resolveNotionPageLinks(rendered.html, {}, `etkinlik/${fm.slug ?? fm.notion_id}`),
            kayitSlug,
          );
        }

        const data = await parseData({
          id: fm.notion_id,
          data: { ...fm, ...(detayHtml ? { detayHtml } : {}) },
        });
        store.set({ id: fm.notion_id, data, digest: generateDigest(JSON.stringify(fm) + (detayHtml ?? '')) });
        ok++;
      }

      logger.info(
        `Notion Etkinlikler: ${ok} yüklendi, ${gizli} atlandı (siteGoster=false veya İptal), ${slugsizYayinAcik} slug'sız-yayın-açık uyarı`,
      );
    },
  },
  schema: z.object({
    baslik: z.string(),
    tip: z.enum([
      'Yolculuk',
      'Anadolu Yolculuğu',
      'Mini Retreat',
      'Şehir Akşamı',
      'Atölye',
      'Seremoni',
      'Açık Kapı',
      'Çember',
    ]),
    tarihBaslangic: z.string(),
    tarihBitis: z.string().optional(),
    // Çift-uçlu görünürlük penceresi (brief-kayit-penceresi-v2):
    // kayitAcilis boşsa hemen görünür, doluysa bugün >= kayitAcilis (o gün dahil).
    // kayitKapanis ?? tarihBaslangic > bugün (strict, başlangıç günü sabahı düşer).
    kayitAcilis: z.string().optional(),
    kayitKapanis: z.string().optional(),
    saat: z.string().optional(),
    // brief-takvim-toparlama-uygula.md ADIM 1 — display fallback için loader'a
    // taşındı; Zoom otomasyonu bu alandan bağımsız (`zoom-olustur.ts` Notion'dan
    // direkt okur). Display: `saat ?? zoomBaslangicSaati`.
    zoomBaslangicSaati: z.string().optional(),
    // Mekân/Platform serbest string (brief-takvim-rozet-schema.md): yeni il/platform
    // eklenmesi build'i patlatmasın. Rozet türetme (`mekanTipi`) bilmediği değeri
    // warn + null ile karşılar (rozet basılmaz, kart görünür). `Format` (tip) enum kalır.
    mekan: z.string(),
    mekanDetay: z.string().optional(),
    kayitUrl: z.string().optional(), // relative URL'ler valid olmalı — .url() YOK
    durum: z.enum(['Taslak', 'Kayıt Açık', 'Dolu', 'Geçti', 'İptal']),
    aciklama: z.string().optional(),
    siteGoster: z.boolean(),
    oneCikar: z.boolean(),
    notion_id: z.string(),
    // Brief 2A — ödemeli kayıt: Notion Etkinlikler DB'den ücret/para birimi/kayıt soruları.
    ucret: z.number().optional(),
    paraBirimi: z.string().optional(),
    kayitSorulari: z.string().optional(),
    // Brief brief-fotolu-onizleme.md İş 4 — kart köşe görseli (Notion files & media).
    // Boşken SonrakiBulusma kartı master görünümünde basılır.
    kartGorsel: z.string().optional(),
    // Aşama 3b-fix — Notion "Kayıt Tipi" select. Direkt = mevcut Kapı 1 akışı
    // (kademe + askı + promo + checkout + Kayıtlar). Başvuru = sade form +
    // Başvurular DB (ödeme yok, Zoom yok, mail yok). Format whitelist
    // (KAPI1_FORMATLAR) deprecated — otorite etkinlik bazlı.
    kayitTipi: z.enum(['Direkt', 'Başvuru']),
    // brief-etkinlik-detay-route.md FAZ 1 — /etkinlik/[slug] route.
    // slug boşsa detay sayfası üretilmez (getStaticPaths filtresi FAZ 2).
    // detay Notion ham metni + detayHtml loader-rendered pipeline çıktısı.
    // yoneten select (Advaita, Çekirdek Ekip).
    slug: z.string().optional(),
    detay: z.string().optional(),
    detayHtml: z.string().optional(),
    yoneten: z.string().optional(),
  }),
});

export const collections = { sayfalar, etkinlikler };
