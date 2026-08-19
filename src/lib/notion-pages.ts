/**
 * notion-pages.ts — Sayfalar collection için pure transformation logic.
 *
 * Loader (src/content/config.ts, Astro/Vite bağlamı) ve smoke test
 * (scripts/cember-dump.mjs, plain Node bağlamı) ortak kullanır. İki bağlamda da
 * çalışabilmesi için Notion client **dependency-injection** ile dışarıdan verilir:
 *
 *   - notion.ts `import.meta.env.NOTION_TOKEN` okur → plain Node'da undefined olur,
 *     bu yüzden bu modül notion.ts'i import ETMEZ (Node script'i çökerdi).
 *   - queryDatabase pagination'ı burada inline yeniden yazıldı (aynı sebeple).
 *
 * Property eşleme Brief 1 keşif raporundaki Notion gerçeğine dayanır.
 */

import { NotionToMarkdown } from 'notion-to-md';
import type { Client } from '@notionhq/client';
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { getOda, type Oda } from './oda-map.ts';

// type (interface değil) — parseData'nın Record<string, unknown> beklentisine
// atanabilir olması için (interface'lerde implicit index signature yok).
export type SayfaFrontmatter = {
  slug: string;
  title: string;
  description?: string;
  oda: Oda;
  durum: string;
  ogImage?: string;
  notion_id: string;
  // Brief brief-fotolu-onizleme.md İş 2 + ek-brief-foto-oranlari.md Değişiklik 1.
  // Notion files alanları, fotolu önizleme iskeleti tüketir. Master sayfa bu
  // alanları OKUMAZ → property boşken (undefined) master HTML byte-değişmez.
  // Whitelist: aşağıdaki adlar tanınır; başka files alanı eklenirse loader sessiz
  // ignore eder.
  // atmosfer1/2/3: ek-brief — tek property + galeri DEĞİL; 3 ayrı KONUMLU property
  // (her biri ana sayfada belirli bir banda denk gelir). Boş olan band fotolu
  // iskelette atlanır (master akışına düşer, kırık görsel kutusu olmaz).
  heroImage?: string;
  portreImage?: string;
  atmosfer1?: string;
  atmosfer2?: string;
  atmosfer3?: string;
};

export interface TransformedPage {
  /** Notion sayfa id'si (store digest/referans için). */
  id: string;
  frontmatter: SayfaFrontmatter;
  /** notion-to-md + normalizeMarkdown geçmiş gövde markdown'ı. */
  body: string;
}

/**
 * Body fragment — loader içinde body markdown'ı marker section'larında kesilir.
 * 'markdown' chunk: renderMarkdown'dan geçirilmiş HTML.
 * 'form-anchor' yer tutucu: PageContent helper registry'den component basar.
 *   intro/introHtml: KARAR 151 look-backward. form-anchor markerından hemen önceki
 *   `## section: xxx` etiketi varsa, o section'ın etiket-sonrası içeriği (markdown
 *   /HTML) intro olarak buraya yapışır; etiketin kendisi loader tarafından
 *   çıkarılır (intro form wrapper'ında render edilirken section transform
 *   tetiklenmesin). Yoksa undefined → eski davranış (form wrapper intro'suz).
 * 'al-ol-ver' yer tutucu: PageContent helper AlOlVer component'ini basar (Karar 1).
 * 'sonraki-bulusma' yer tutucu: PageContent helper SonrakiBulusma component'ini
 *   basar (slug prop'undan kategori/heading otomatik türetilir, Karar 3).
 * (#29 Brief F.5 Adım 3 — Option B sıralı render; KARAR 127 fragment-split genişletme;
 *  KARAR 151 form-anchor intro consume.)
 */
export type BodyFragmentRaw =
  | { kind: 'markdown'; content: string }
  | { kind: 'form-anchor'; index: number; intro?: string }
  | { kind: 'al-ol-ver' }
  | { kind: 'sonraki-bulusma' }
  | { kind: 'etkinlik-takvimi' }
  | { kind: 'yolculuk-eksen' }
  | { kind: 'kanallar' }
  | { kind: 'harita-anadolu' };

export type BodyFragment =
  | { kind: 'markdown'; html: string }
  | { kind: 'form-anchor'; index: number; introHtml?: string }
  | { kind: 'al-ol-ver' }
  | { kind: 'sonraki-bulusma' }
  | { kind: 'etkinlik-takvimi' }
  | { kind: 'yolculuk-eksen' }
  | { kind: 'kanallar' }
  | { kind: 'harita-anadolu' };

/**
 * Body markdown'ını `## section: <name>` marker satırlarında parçalar.
 * Tanınan marker'lar: form-anchor (indeksli, çoklu), al-ol-ver, sonraki-bulusma,
 * etkinlik-takvimi, yolculuk-eksen, kanallar, harita-anadolu.
 * Marker satırları çıkarılır; her marker uygun kind ile fragment olarak emit edilir.
 * Diğer `## section: NAME` markerları (manifesto, esik-kadini, vb.) markdown
 * chunk'ında kalır → plugin remarkOcakSections tarafından prose section'a sarılır.
 *
 * Cazip alternatif (HTML post-split) reddedildi: HTML split regex-fragile.
 * Markdown split deterministik: satır başında marker benzersiz.
 *
 * kayit-cta (Madde 2/4 fix — B çözümü): marker'dan sonraki + bir sonraki section
 * marker'ına kadar olan içerik `intro` alanına toplanır (section-içi üst metin).
 * Config loader `intro`'yu renderMarkdown edip fragment'ı `{kind:'kayit-cta',
 * introHtml}` olarak yayar; PageContent bunu `<KayitCTA introHtml={..} />`
 * component instance'ına verir. MADDE 2 gate + MADDE 4 dayanışma satırı böylece
 * canlıya bağlanır. Plugin `transformKayitCta` fallback olarak durur.
 */
export function splitBodyByMarkers(body: string): BodyFragmentRaw[] {
  const lines = body.split('\n');
  const fragments: BodyFragmentRaw[] = [];
  let chunk: string[] = [];
  let anchorIndex = 0;

  /** Bir satır `## section: NAME` (NAME boş değil) ise true. form-anchor look-backward
   *  kuralı her section etiketini stop noktası olarak kabul eder — özel marker'lar
   *  (form-anchor/al-ol-ver/sonraki-bulusma) buraya hiçbir zaman ulaşmaz, çünkü zaten
   *  ana loop'ta yakalanıp fragment'a dönüşürler. */
  const SECTION_RE = /^##\s+section:\s+\S+\s*$/;

  const flush = () => {
    const md = chunk.join('\n').trim();
    if (md) fragments.push({ kind: 'markdown', content: md + '\n' });
    chunk = [];
  };

  /** form-anchor look-backward (KARAR 151): chunk buffer'ında SONDAN başa doğru en
   *  yakın `## section: NAME` satırını arar. Bulursa buffer ikiye ayrılır:
   *   - before: etiketten ÖNCEKI satırlar → markdown fragment olarak flush
   *   - intro:  etiketten SONRAKİ satırlar → form-anchor fragment'ının intro alanı
   *  Section etiketinin KENDİSİ çıkarılır (form wrapper içinde intro render edilirken
   *  remark-ocak-sections section transform'u tetiklenmesin).
   *  Bulamazsa: tüm buffer flush, fragment intro'suz (eski davranış).
   */
  const flushWithIntroLookBackward = (): string | undefined => {
    let sectionIdx = -1;
    for (let i = chunk.length - 1; i >= 0; i--) {
      if (SECTION_RE.test(chunk[i])) {
        sectionIdx = i;
        break;
      }
    }
    if (sectionIdx === -1) {
      flush();
      return undefined;
    }
    const beforeLines = chunk.slice(0, sectionIdx);
    const introLines = chunk.slice(sectionIdx + 1);
    chunk = beforeLines;
    flush();
    const intro = introLines.join('\n').trim();
    return intro ? intro + '\n' : undefined;
  };

  for (const line of lines) {
    if (/^##\s+section:\s+form-anchor\s*$/.test(line)) {
      const intro = flushWithIntroLookBackward();
      fragments.push(
        intro
          ? { kind: 'form-anchor', index: anchorIndex, intro }
          : { kind: 'form-anchor', index: anchorIndex },
      );
      anchorIndex++;
    } else if (/^##\s+section:\s+al-ol-ver\s*$/.test(line)) {
      flush();
      fragments.push({ kind: 'al-ol-ver' });
    } else if (/^##\s+section:\s+sonraki-bulusma\s*$/.test(line)) {
      flush();
      fragments.push({ kind: 'sonraki-bulusma' });
    } else if (/^##\s+section:\s+etkinlik-takvimi\s*$/.test(line)) {
      flush();
      fragments.push({ kind: 'etkinlik-takvimi' });
    } else if (/^##\s+section:\s+yolculuk-eksen\s*$/.test(line)) {
      // Brief Yolculuk Ekseni v2: marker konum sinyali, içerik component'te sabit.
      // al-ol-ver paterni birebir — loader keser, PageContent <YolculukEksen /> basar.
      flush();
      fragments.push({ kind: 'yolculuk-eksen' });
    } else if (/^##\s+section:\s+kanallar\s*$/.test(line)) {
      // Brief brief-kanallar-yerlesim-zemin.md: marker konum sinyali, içerik
      // component'te sabit. al-ol-ver/yolculuk-eksen paterni birebir — loader
      // keser, PageContent <Kanallar /> basar. /iletisim: Bize Yaz ↔ Yanıt arası.
      flush();
      fragments.push({ kind: 'kanallar' });
    } else if (/^##\s+section:\s+harita-anadolu\s*$/.test(line)) {
      // Brief brief-anadolu-yolculuk.md: /anadolu sabit Türkiye haritası — altı
      // evre noktası kronolojik sırada bağlı (AÇILIŞ→…→DÖNÜŞ). al-ol-ver/yolculuk-
      // eksen paterni birebir — loader keser, PageContent <AnadoluHarita /> basar.
      flush();
      fragments.push({ kind: 'harita-anadolu' });
    } else {
      chunk.push(line);
    }
  }
  flush();

  return fragments;
}

/**
 * Geriye uyumluluk alias'ı — şimdilik bırakmıyorum (loader/tests tek tüketici,
 * doğrudan güncelleniyor). İleride dış tüketici eklenirse splitBodyByMarkers
 * primary; eski isim KARAR 127 paterninde nadiren referans alır.
 */

/**
 * Notion page-mention link normalize — page-id formatlı href'leri site slug'ına map'ler.
 *
 * Sorun: Notion sayfada "iletişim" gibi bir kelimeye page-mention koyduğunda
 * notion-to-md çıktısı `[iletişim](/367b61ebfa8781b7b19dcea2476f8674)` formatında
 * gelir — workspace URL prefix yok, çıplak 32-hex page-id `/...` ile. Plugin
 * link normalize ailesi (KARAR 116/118 NOTION_URL_RE / OCAK_BIZ_URL_RE) bunu
 * yakalamaz (regex `https://...` prefix bekler).
 *
 * Yaygınlık (2026-05-30 dist envanteri): 8 vaka, 3 sayfa (araclar / sen-neredesin
 * / test). Tek vaka değil → kod çözümü şart. Notion-side tek tek temizleme tehlikeli
 * (kelime üstüne yapışmış mention görünmez).
 *
 * Çözüm yeri: Plugin çağrıldığında tek-sayfa scope'unda; page-id ↔ slug map'i
 * tüm Sayfalar collection'ından gelir → loader'da derlenir (cross-page). Bu yüzden
 * helper plugin'de değil, loader-side post-process: renderMarkdown çıktısına regex
 * replace uygula.
 *
 * Map anahtarı: Notion API `page.id` UUID format dahildir (`xxxxxxxx-xxxx-...`),
 * `replace(/-/g, '')` ile 32-hex'e indirilir. Slug değeri `/foo` formatında
 * (URL property baştaki `/` ile saklanır), href'e bire bir basılır.
 *
 * Unmapped page-id (Notion'da silinmiş sayfaya mention, başka workspace, vb.) →
 * warn + href değişmez (build kırılmaz, eyeball'da görünür kalır).
 */
export function resolveNotionPageLinks(
  html: string,
  map: Record<string, string>,
  filename: string,
): string {
  return html.replace(/href="\/([a-f0-9]{32})"/g, (_full, id: string) => {
    const slug = map[id];
    if (slug) {
      return `href="${slug}"`;
    }
    // eslint-disable-next-line no-console
    console.warn(
      `[notion-pages] ${filename}: page-id link map dışı (silinmiş sayfa / başka workspace?): /${id}`,
    );
    return `href="/${id}"`;
  });
}

// ── Property okuyucular (notion.ts getProp'a paralel, ama Node-safe/bağımsız) ──

function richText(page: PageObjectResponse, name: string): string {
  const p = page.properties[name];
  if (p?.type === 'rich_text') return p.rich_text.map((t) => t.plain_text).join('');
  if (p?.type === 'title') return p.title.map((t) => t.plain_text).join('');
  return '';
}

function selectVal(page: PageObjectResponse, name: string): string {
  const p = page.properties[name];
  if (p?.type === 'select') return p.select?.name ?? '';
  if (p?.type === 'status') return p.status?.name ?? '';
  return '';
}

/** files & media property → ilk dosyanın URL'i (file veya external), yoksa undefined. */
function filesUrl(page: PageObjectResponse, name: string): string | undefined {
  const p = page.properties[name];
  if (p?.type !== 'files' || p.files.length === 0) return undefined;
  const f = p.files[0];
  if (f.type === 'file') return f.file.url;
  if (f.type === 'external') return f.external.url;
  return undefined;
}

/** Siteye çıkması için `Durum` alanının taşıması gereken tek değer. */
export const YAYIN_DURUMU = 'Yayında';

/**
 * Sayfalar DB'sindeki satırları paginated çeker ve **yayın durumuna göre süzer**.
 *
 * Filtre deseni Etkinlikler loader'ından alındı (`config.ts`: `siteGoster` /
 * `durum === 'İptal'` → `continue`). Fark: orada süzme transform'dan SONRA,
 * burada ÖNCE yapılıyor — `transformPage` her sayfa için blok çekiyor, atlanan
 * satırın bloklarını çekmenin anlamı yok.
 *
 * Tarih: `Durum` alanı `transformPage`'te okunup frontmatter'a yazılıyordu ama
 * hiçbir yerde tüketilmiyordu; `config.ts`'teki FIXME filtreyi "19 sayfa Onay
 * Bekliyor'da, filtre eklenirse loader boş döner" gerekçesiyle ertelemişti.
 * O gerekçe 19 Ağustos 2026 ölçümünde bayat çıktı: 21 satırın 20'si `Yayında`,
 * 1'i `Taslak` (`/site-rehber`) ve Taslak sayfa canlıya çıkmıştı.
 */
export async function fetchSayfalar(
  notion: Client,
  databaseId: string,
  logger?: { info: (msg: string) => void },
): Promise<PageObjectResponse[]> {
  const tumu: PageObjectResponse[] = [];
  let cursor: string | undefined;
  do {
    const res = await notion.databases.query({ database_id: databaseId, start_cursor: cursor });
    for (const row of res.results) {
      if ('properties' in row) tumu.push(row as PageObjectResponse);
    }
    cursor = res.has_more && res.next_cursor ? res.next_cursor : undefined;
  } while (cursor);

  const yayinda = tumu.filter((page) => selectVal(page, 'Durum') === YAYIN_DURUMU);
  const atlanan = tumu.length - yayinda.length;
  logger?.info(
    `Notion Sayfalar: ${yayinda.length} yayında, ${atlanan} atlandı (Durum !== '${YAYIN_DURUMU}')`,
  );

  // Sessiz fakirleşme kapısı: `Durum` Notion'da yeniden adlandırılır ya da
  // seçenek dizesi değişirse filtre HER satırı eler ve site sessizce boşalır.
  // FIXME'nin doğduğu döngü tam buydu — filtre yazıldı, değerler uyuşmadı,
  // loader boşaldı, filtre kapatıldı, iki ay öyle kaldı. Kapı döngüyü kırar.
  // KARAR 516 uyumlu: yalnız felaket hâlinde ateşler, rutin değil.
  if (tumu.length > 0 && yayinda.length === 0) {
    const gorulen = [...new Set(tumu.map((page) => selectVal(page, 'Durum')))]
      .map((v) => (v === '' ? "'' (alan yok ya da boş)" : `'${v}'`))
      .join(', ');
    throw new Error(
      `[notion-pages] Sayfalar DB'sinden ${tumu.length} satır çekildi, hiçbiri yayına ` +
        `alınmadı — boş site yayınlamamak için build durduruldu.\n` +
        `  beklenen  : Durum === '${YAYIN_DURUMU}'\n` +
        `  görülen   : ${gorulen}\n` +
        `  nereye bak: Notion Sayfalar DB → "Durum" alanı. Muhtemel sebep, ` +
        `seçenek adının değişmesi (ör. "Yayında" → "Yayınlandı") ya da alanın ` +
        `yeniden adlandırılması. Kod tarafındaki karşılığı: YAYIN_DURUMU sabiti, ` +
        `src/lib/notion-pages.ts.`,
    );
  }

  return yayinda;
}

/**
 * Bir Notion sayfasını frontmatter + body'ye dönüştürür.
 * slug (URL property) yoksa null döner + warn (loader/script atlar).
 */
export async function transformPage(
  notion: Client,
  page: PageObjectResponse,
): Promise<TransformedPage | null> {
  const slug = richText(page, 'URL').trim();
  if (!slug) {
    // eslint-disable-next-line no-console
    console.warn(`[notion-pages] URL (slug) boş — sayfa atlandı (notion_id: ${page.id})`);
    return null;
  }

  const title = richText(page, 'Sayfa Başlığı').trim();
  const description = richText(page, 'Meta Açıklama').trim();
  const durum = selectVal(page, 'Durum');
  const ogImage = filesUrl(page, 'OG Görsel');
  // Fotolu önizleme alanları (Brief brief-fotolu-onizleme.md İş 2 + ek-brief
  // Değişiklik 1). Notion'da boşsa undefined → SayfaFrontmatter'a eklenmez →
  // master HTML aynısı kalır. Atmosfer ek-brief sonrası 3 ayrı konumlu property.
  const heroImage = filesUrl(page, 'Hero Görsel');
  const portreImage = filesUrl(page, 'Portre Görsel');
  const atmosfer1 = filesUrl(page, 'Atmosfer Görsel 1');
  const atmosfer2 = filesUrl(page, 'Atmosfer Görsel 2');
  const atmosfer3 = filesUrl(page, 'Atmosfer Görsel 3');

  // ODA_MAP miss → warn + null (Notion'a taslak/test sayfası eklenirse build çökmez,
  // #29 Brief F.5 sırasında /test sayfası ile yakalandı). Gerçek bilinmeyen üretim
  // sayfası eklenirse warn'la görünür kalır — Kaan ODA_MAP'i güncelleyene kadar atlanır.
  let oda: Oda;
  try {
    oda = getOda(slug);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn(
      `[notion-pages] ${slug} ODA_MAP'te yok — sayfa atlandı (${(err as Error).message})`,
    );
    return null;
  }

  const frontmatter: SayfaFrontmatter = {
    slug,
    title,
    oda,
    durum,
    notion_id: page.id,
    ...(description ? { description } : {}),
    ...(ogImage ? { ogImage } : {}),
    ...(heroImage ? { heroImage } : {}),
    ...(portreImage ? { portreImage } : {}),
    ...(atmosfer1 ? { atmosfer1 } : {}),
    ...(atmosfer2 ? { atmosfer2 } : {}),
    ...(atmosfer3 ? { atmosfer3 } : {}),
  };

  const n2m = new NotionToMarkdown({ notionClient: notion });
  const mdblocks = await n2m.pageToMarkdown(page.id);
  const raw = n2m.toMarkdownString(mdblocks).parent ?? '';
  const body = normalizeMarkdown(raw);

  return { id: page.id, frontmatter, body };
}

/**
 * Dar gürültü temizliği (Brief 2 mimari karar: section tag kontratı = dokunma,
 * loader sadece içerik kirini temizler).
 *
 *  - Bozuk bulleted ayraç satırları ("- --", "- ---") silinir
 *  - Boş bullet satırları ("- ") silinir
 *  - İç içe emphasis sadeleştirilir: ****metin**** → **metin**, *_metin_* → *metin*
 *    (Notion'un nested bold/underline export'u kirli; underline standart md'de yok)
 *  - Tablo satırları arasındaki boş satırlar silinir (notion-to-md tabloyu böler)
 *  - 3+ ardışık boş satır 2'ye iner
 *  - `## section: xxx` etiketlerine DOKUNULMAZ (plugin işi)
 */
export function normalizeMarkdown(md: string): string {
  return (
    md
      .replace(/^[ \t]*-[ \t]*-{2,}[ \t]*$/gm, '') // "- --" bozuk ayraç
      .replace(/^[ \t]*-[ \t]*$/gm, '') // boş bullet "- "
      .replace(/\*{4}([^\n]+?)\*{4}/g, '**$1**') // ****metin**** → **metin**
      .replace(/\*_([^\n]+?)_\*?/g, '*$1*') // *_metin_* / *_metin_ → *metin* (kapanış * opsiyonel; Notion asimetrik export ediyor)
      .replace(/(\|[^\n]*\n)\n+(?=\|)/g, '$1') // tablo satırları arası boş satır sil
      .replace(/\n{3,}/g, '\n\n') // 3+ boş satır → 2
      .trim() + '\n'
  );
}
