import type { Root, RootContent, Html } from 'mdast';
import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';

/**
 * remark-ocak-sections
 *
 * Markdown içindeki `## section: NAME` başlıklarını yakalar ve sonraki
 * içerikleri o NAME section'a sarar. 5 kanonik section özel transformasyon
 * görür: hero, bir-sonraki, sonraki-bulusma, siradaki-kapi, sss.
 * Diğer section'lar serbest prose olarak <section class="ocak-{name}">
 * div'ine sarılır.
 *
 * KARAR 92, 93 referansı.
 */

export type SectionName =
  | 'hero'
  | 'bir-sonraki'
  | 'sonraki-bulusma'
  | 'al-ol-ver'
  | 'siradaki-kapi'
  | 'sss'
  | 'mini-cta'
  | 'buyuk-vurgu'
  | 'manifesto-vurgu'
  | 'ic-ses'
  | 'kayit-cta';

/**
 * Kanonik 11 — plugin tarafında özel transform alan section'lar (#23/F.5/KARAR
 * 127/153/207 + ic-ses göçü + kayit-cta Brief 4). Component-render kanonik 5
 * (Hero/BirSonraki/SonrakiBulusma/SiradakiKapi/SSS, README #21) ile karıştırma:
 * o sayım Astro component instance'larını tanımlar, bu sayım markdown→HTML
 * transform setini tanımlar. Vurgu paleti (3 isim) listenin orta üçlüsü:
 *   - buyuk-vurgu  → altın, glyphsiz, yüksek-enerji ilan (clamp 2-3rem)
 *   - manifesto-vurgu → krem italik + köz glyph, sayfa-sonu marka beyanı
 *   - ic-ses → krem italik, glyphsiz, prose ortası düşük-enerji "nefes"
 * Glyph farkı manifesto-vurgu ile ic-ses arasındaki imza ayrımıdır
 * (manifesto ağırlık taşır, ic-ses hafiflik). kayit-cta (KARAR 207): köz
 * dolu vurgu butonu, sayfa slug'ından otomatik /[format]/kayit hedefi
 * türetir (notion-pages.ts resolveKayitCtaHref post-render adımı).
 */
export const CANONICAL_SECTIONS: SectionName[] = [
  'hero',
  'bir-sonraki',
  'sonraki-bulusma',
  'al-ol-ver',
  'siradaki-kapi',
  'sss',
  'mini-cta',
  'buyuk-vurgu',
  'manifesto-vurgu',
  'ic-ses',
  'kayit-cta',
];

/**
 * ESIK_SECTIONS — /sen-neredesin sayfasındaki 10 eşik (numarasız semantik isim).
 * Plugin bu set'teki section'ları `<details name="esikler">` exclusive accordion'a
 * sarar; ilk `## ` h2'yi summary'ye taşır (Pattern A, esik-dump.mjs ile doğrulandı).
 *
 * Whitelist neden regex değil:
 *   - `esik-kadini` ana sayfa + /hikaye + /site-rehber'de prose section olarak var;
 *     `^esik-` regex'i onu da yakalardı → accordion'a düşerdi (silent bug). Whitelist
 *     ile çakışma sıfır.
 *   - Yeni eşik eklenirse set'e elle ekleme gerekir → eyeball'da hemen görünür
 *     ("eşik 11 nerede" — gürültülü, doğru hata). Eşik haritası kanonik (KARAR 25).
 *
 * Yeni eşik eklenmesi felsefi karar; bu sırayı bozma, sonuna ekle.
 */
export const ESIK_SECTIONS = new Set([
  'esik-uyku',
  'esik-merak',
  'esik-ilk-dokunus',
  'esik-aidiyet',
  'esik-derinlesme',
  'esik-taahhut',
  'esik-yolculuk',
  'esik-eve-donus',
  'esik-tasiyici',
  'esik-spiral',
]);

/**
 * EVRE_SECTIONS — /anadolu Anadolu Yolculuğu altı evre kartı (brief-anadolu-yolculuk.md).
 * Plugin bu set'teki section'ları `<article class="ocak-evre ocak-evre-NAME">` Varyant C
 * dolu kart markup'ına çevirir (ESIK paterni KARAR 154 paralel — whitelist + parse +
 * emit, ama accordion DEĞİL: hepsi açık, görünür, SEO için düz metin HTML'de).
 *
 * Sıra YOLCULUK kronolojisi (AÇILIŞ→İNİŞ→UYANIŞ→DURUŞ→GEÇİŞ→DÖNÜŞ) — coğrafi
 * yakınlık değil. tokens.css --isi-* rampası bu sırayla eşli (DURUŞ tepe ısı = --ember).
 *
 * Whitelist neden regex değil: ESIK paterniyle aynı gerekçe — gelecekteki "evre-*"
 * ön ekli prose section'ları (örn. bir başka sayfada "evre-rehber") yanlışlıkla
 * kart wrap'ına düşmesin. Yeni evre eklenmesi felsefi karar; bu altılı kanonik.
 */
export const EVRE_SECTIONS = new Set([
  'evre-acilis',
  'evre-inis',
  'evre-uyanis',
  'evre-durus',
  'evre-gecis',
  'evre-donus',
]);

/**
 * Evre adı → ısı token eşleşmesi (tokens.css `--isi-*`).
 * Yolculuk-eksen ile akraba rampa (KARAR 198 ailesi). DURUŞ = --ember (tepe ısı).
 */
const EVRE_ISI_TOKEN: Record<string, string> = {
  'evre-acilis': '--isi-acilis',
  'evre-inis': '--isi-inis',
  'evre-uyanis': '--isi-uyanis',
  'evre-durus': '--isi-durus',
  'evre-gecis': '--isi-gecis',
  'evre-donus': '--isi-donus',
};

/**
 * OMIT_SECTIONS — plugin bu section'ları HİÇ emit ETMEZ.
 * Sayfa override'ında veya fragment-split registry'sinde component instance ile
 * render edilirler:
 *   - hero-anasayfa → <Hero> (#23 Brief 3: CTA + scroll indicator, plugin hero'da yok)
 *   - ates-mektuplari → <AtesMektuplari> (#23 Brief 3: Apps Script POST)
 *
 * Not: sonraki-bulusma ve al-ol-ver fragment-split mekanizmasıyla loader tarafında
 * markdown'dan kesilir (splitBodyByMarkers, KARAR 127 form-anchor pattern paralel).
 * Plugin bu marker'ları görmez; case'leri savunma fallback'i olarak duruyor —
 * marker bir şekilde loader'dan kaçarsa empty wrapper basılır (CSS prose section
 * empty-section'ı görünmez bırakır). etkinlik-takvimi (KARAR 153) de loader'da
 * kesilir; CANONICAL olmadığı için savunma OMIT ile yapılır (kaçarsa plugin hiç
 * emit etmez, serbest prose'a düşüp yanlışlıkla görünmez).
 */
export const OMIT_SECTIONS = [
  'hero-anasayfa',
  'ates-mektuplari',
  'etkinlik-takvimi',
  // brief-iletisim-form-tasima.md — form /iletisim/bize-yaz Hero'suna taşındı.
  'iletisim-form-davet',
  // 'kanallar' artık fragment-split marker'ı (brief-kanallar-yerlesim-zemin.md);
  // loader keser, PageContent <Kanallar /> basar. Plugin defansif fallback case
  // empty wrapper emit eder (marker bir şekilde loader'dan kaçarsa görünmez).
];

/**
 * INTERNAL_SLUGS — Site'in 18 sayfasının slug whitelist'i (#26 Brief F).
 * Notion content yazılırken page mention veya inline link `https://www.notion.so/<slug>`
 * formatında çıkar; tıklanırsa kullanıcı ocak.biz'den Notion'a kayar (404/login wall).
 * Link visitor bu pattern'i tanır → slug whitelist'te ise `/<slug>`'a normalize, değilse
 * korur + warn (external Notion link'ler veya nested path'ler dokunulmaz).
 * Ana sayfa (`/`) Notion'da page mention olarak nadiren geçer — gerektiğinde 'home'
 * eklenir + özel case (`'/' + slug` yerine `'/'`).
 */
export const INTERNAL_SLUGS = new Set([
  'hikaye',
  'felsefe',
  'araclar',
  'sen-neredesin',
  'bulusmalar',
  'cember',
  'acik-kapi',
  'seremoni',
  'atolye',
  'sehir-aksami',
  'mini-retreat',
  'takvim',
  'yolculuk',
  'anadolu',
  'biz',
  'advaita',
  'ekip',
  'iletisim',
]);

/**
 * Notion URL pattern — iki form:
 *   - Direct: `https://www.notion.so/<slug>`
 *   - Workspace prefix + opsiyonel 32-hex hash: `https://www.notion.so/<ws>/<slug>-<hash>`
 * Match: capture group 1 = slug. Hash + workspace defansif (dist envanterinde direct
 * pattern hâkim, ama notion-to-md geçmişte hash format çıkarmış olabilir).
 */
const NOTION_URL_RE =
  /^https:\/\/www\.notion\.so\/(?:[^/]+\/)?([a-z0-9-]+?)(?:-[a-f0-9]{32})?$/;

/**
 * ocak.biz absolute URL pattern (#29 Brief F.5, KARAR 120 visitor genişletme).
 * Kaan Notion içeriklerine canonical link olarak `https://ocak.biz/<slug>` yazıyor;
 * preview build veya dev'de absolute prefix kullanıcıyı prod'a sıçratır. Visitor
 * whitelist slug match'inde `/<slug>` relative'e normalize eder. Match capture
 * group 2 = slug (group 1 opsiyonel `www.`).
 */
const OCAK_BIZ_URL_RE = /^https?:\/\/(?:www\.)?ocak\.biz\/([^?#/]+)\/?$/;

/**
 * Nested başvuru path — `basvuru/<slug>-<yıl>` formu (#29 Brief F sonu Item 1).
 * Notion canonical bazı sayfalarda (örn. /anadolu siradaki-kapi) başvuru linkini
 * `https://www.ocak.biz/basvuru/anadolu-2026` veya `https://www.notion.so/basvuru/anadolu-2026`
 * formunda yazmış. Tek-segment whitelist normalize (NOTION_URL_RE / OCAK_BIZ_URL_RE)
 * bunu yakalayamıyor (regex `[^?#/]+` slash yasaklıyor). Yıl zorunlu — `kayit/...`
 * gibi diğer nested yapılarla karışmaması için pattern dar tutuluyor.
 * Match capture group 1 = slug, INTERNAL_SLUGS whitelist match'inde `/<slug>/basvuru`.
 */
const NOTION_BASVURU_RE =
  /^https:\/\/www\.notion\.so\/(?:[^/]+\/)?basvuru\/([a-z-]+?)-\d{4}(?:-[a-f0-9]{32})?$/;
const OCAK_BIZ_BASVURU_RE =
  /^https?:\/\/(?:www\.)?ocak\.biz\/basvuru\/([a-z-]+?)-\d{4}\/?$/;

interface OcakSectionsOptions {
  /**
   * Render edilen sayfanın oda adı (Hero glow yoğunluğunu belirler).
   * 'OCAK' → strong glow, diğerleri → soft glow.
   */
  oda?: 'OCAK' | 'Yol' | 'Buluşmalar' | 'Yolculuk' | 'Biz' | 'İletişim';
  /** console.warn mesajlarında kaynak dosyayı göstermek için. */
  filename?: string;
}

/** Bir node ağacındaki tüm text/inlineCode değerlerini düz metne indirger. */
function getText(node: unknown): string {
  const n = node as { type?: string; value?: string; children?: unknown[] };
  if (n.type === 'text' || n.type === 'inlineCode') return n.value ?? '';
  if (Array.isArray(n.children)) return n.children.map(getText).join('');
  return '';
}

/**
 * Bir mdast node'unun yalnızca whitespace içerip içermediğini söyler (post-order
 * mantığı: child'lar zaten cleanWhitespaceNodes tarafından temizlendikten sonra
 * çağrılır, bu yüzden artakalan child'lar gerçek içerik kabul edilir).
 * - text/inlineCode: value sadece \s* mı?
 * - container: hiç child yok ya da tüm child'lar whitespace-only mı?
 */
function isWhitespaceOnly(node: unknown): boolean {
  const n = node as { type?: string; value?: string; children?: unknown[] };
  if (n.type === 'text' || n.type === 'inlineCode') {
    return /^\s*$/.test(n.value ?? '');
  }
  if (Array.isArray(n.children)) {
    if (n.children.length === 0) return true;
    return n.children.every(isWhitespaceOnly);
  }
  return false;
}

/**
 * Post-order recursive: önce her child'ı temizle, sonra parent'ın children'ı
 * arasından whitespace-only paragraph + blockquote'ları filtrele. Yalnızca bu iki
 * tip silinir — listItem/tableCell gibi struktur tipleri whitespace olsa bile
 * korunur (anlam ifade ediyor olabilir).
 */
function cleanWhitespaceNodes(node: unknown): void {
  const n = node as { children?: unknown[] };
  if (!Array.isArray(n.children)) return;
  // Önce derinlemesine (child'ları temizle — post-order)
  for (const child of n.children) cleanWhitespaceNodes(child);
  // Sonra bu seviyede whitespace-only paragraph/blockquote'ları çıkar
  n.children = n.children.filter((c) => {
    const ct = (c as { type?: string }).type;
    if (ct !== 'paragraph' && ct !== 'blockquote') return true;
    return !isWhitespaceOnly(c);
  });
}

/** `## section: NAME` başlığıysa NAME döner, değilse null. */
function getSectionName(node: RootContent): string | null {
  if (node.type === 'heading' && node.depth === 2) {
    const match = getText(node).match(/^section:\s*(.+)$/);
    if (match) return match[1].trim();
  }
  return null;
}

function html(value: string): Html {
  return { type: 'html', value };
}

/** sonraki-bulusma gövdesindeki `source: VALUE` satırını ayıklar. */
function extractSource(content: RootContent[]): string {
  for (const node of content) {
    const match = getText(node).match(/^source:\s*(.+)$/);
    if (match) return match[1].trim();
  }
  return '';
}

/**
 * Section content'inin ilk paragrafı `overline: VALUE` formatındaysa ayıklar;
 * overline string + kalan content döner. Yoksa { overline: null, rest: content }.
 * Hero + prose section'larda (manifesto/al-ol-ver/cekirdek-vaat/esik-kadini) ortak.
 */
function extractOverline(
  content: RootContent[],
): { overline: string | null; rest: RootContent[] } {
  const first = content[0];
  if (first?.type === 'paragraph') {
    const match = getText(first).match(/^overline:\s*(.+)$/);
    if (match) {
      return { overline: match[1].trim(), rest: content.slice(1) };
    }
  }
  return { overline: null, rest: content };
}

/** siradaki-kapi: H3 ile başlayan kartlara böler, her kartı <article>'a sarar. */
function transformKapi(content: RootContent[], options: OcakSectionsOptions): RootContent[] {
  const cards: RootContent[][] = [];
  for (const node of content) {
    if (node.type === 'heading' && node.depth === 3) {
      cards.push([node]);
    } else if (cards.length > 0) {
      cards[cards.length - 1].push(node);
    }
  }

  const count = cards.length;
  if (count === 1 || count >= 5) {
    const where = options.filename ?? 'unknown';
    // eslint-disable-next-line no-console
    console.warn(
      `[remark-ocak-sections] siradaki-kapi (${where}): ${count} kart bulundu (3 beklenir, 2-4 tolere edilir).`,
    );
  }

  const out: RootContent[] = [html('<section data-section="siradaki-kapi">')];
  for (const card of cards) {
    out.push(html('<article class="ocak-kapi-kart">'), ...card, html('</article>'));
  }
  out.push(html('</section>'));
  return out;
}

/**
 * Bir listItem bold-italik tek-paragraf (`- ***Soru?***`) mı?
 * getText `***` markerlarını sıyırdığı için tespit YAPISAL: listItem > paragraph >
 * (emphasis>strong | strong>emphasis), tek çocuk zinciri.
 */
function isSoruItem(item: RootContent): boolean {
  const li = item as { type?: string; children?: RootContent[] };
  if (li.type !== 'listItem' || li.children?.length !== 1) return false;
  const para = li.children[0] as { type?: string; children?: RootContent[] };
  if (para.type !== 'paragraph' || para.children?.length !== 1) return false;
  const w = para.children[0] as { type?: string; children?: RootContent[] };
  const innerType = (w.children?.[0] as { type?: string } | undefined)?.type;
  return (
    (w.type === 'emphasis' && innerType === 'strong') ||
    (w.type === 'strong' && innerType === 'emphasis')
  );
}

/** Bir list node'unun TÜM item'ları soru mu? */
function isSoruListesi(node: RootContent): boolean {
  if (node.type !== 'list') return false;
  const items = (node as { children?: RootContent[] }).children ?? [];
  return items.length > 0 && items.every(isSoruItem);
}

/**
 * sss: bullet-soru pattern'ini <details>/<summary>'ye çevirir (KARAR 105 ev stili).
 * Soru = bold-italik tek-satır bullet (- ***Soru?***); cevap = sonraki node'lar
 * (bir sonraki soruya / alt-başlığa kadar) <div class="sss-cevap"> içine sarılır.
 * Alt başlık (## ...) details'lerden önce korunur.
 *
 * Fallback: H3 ya da hiç soru bullet'ı yoksa içerik olduğu gibi sarılır + warn
 * (yazım rehberi dışı içeriği build log'unda görünür kılar).
 */
function transformSss(content: RootContent[], options: OcakSectionsOptions): RootContent[] {
  const hasH3 = content.some((n) => n.type === 'heading' && n.depth === 3);
  const hasSoru = content.some(isSoruListesi);

  if (hasH3 || !hasSoru) {
    const where = options.filename ?? 'unknown';
    // eslint-disable-next-line no-console
    console.warn(
      `[remark-ocak-sections] sss (${where}): bullet-soru pattern'i bulunamadı ` +
        `(hasH3=${hasH3}, hasSoru=${hasSoru}). İçerik olduğu gibi sarıldı — yazım rehberine bak.`,
    );
    return [html('<section data-section="sss">'), ...content, html('</section>')];
  }

  const out: RootContent[] = [html('<section data-section="sss">')];
  let openDetails = false;
  const kapat = () => {
    if (openDetails) {
      out.push(html('</div></details>'));
      openDetails = false;
    }
  };

  for (const node of content) {
    // Alt başlık (## Sorulanlar gibi) — açık details'i kapat, başlığı koru.
    if (node.type === 'heading' && node.depth <= 2) {
      kapat();
      out.push(node);
      continue;
    }

    // Soru listesi → her item yeni bir <details> açar.
    if (isSoruListesi(node)) {
      for (const item of (node as { children: RootContent[] }).children) {
        kapat();
        out.push(html(`<details><summary>${getText(item).trim()}</summary><div class="sss-cevap">`));
        openDetails = true;
      }
      continue;
    }

    // Cevap içeriği (paragraph / cevap-içi liste) → açık details'in içine.
    out.push(node);
  }

  kapat();
  out.push(html('</section>'));
  return out;
}

/**
 * mini-cta (#29 Brief F.5): 1-2 paragraph + son child link.
 * - Son node "tek-link paragraph" (paragraph > link) ise paragraph wrapper sıyrılıp link
 *   doğrudan block-level basılır (CSS `a` selector'ünü hedeflemek için).
 * - Son child sade link değilse warn + içerik olduğu gibi sarılır (defansif).
 * - Hiç link yoksa warn + içerik yine sarılır (görsel ayırt edici kalır).
 */
function transformMiniCta(content: RootContent[], options: OcakSectionsOptions): RootContent[] {
  const filename = options.filename ?? 'unknown';
  const lastIdx = content.length - 1;
  const last = content[lastIdx] as { type?: string; children?: RootContent[] } | undefined;
  const lastChildren = last?.children;
  const onlyChild =
    last?.type === 'paragraph' && lastChildren?.length === 1 ? lastChildren[0] : null;
  const isOnlyLink = (onlyChild as { type?: string } | null)?.type === 'link';

  let hasAnyLink = false;
  for (const node of content) {
    if (node.type === 'paragraph') {
      const kids = (node as { children?: RootContent[] }).children ?? [];
      if (kids.some((k) => (k as { type?: string }).type === 'link')) {
        hasAnyLink = true;
        break;
      }
    }
  }

  if (!hasAnyLink) {
    // eslint-disable-next-line no-console
    console.warn(
      `[remark-ocak-sections] mini-cta (${filename}): link bulunamadı — yazım sapması.`,
    );
  } else if (!isOnlyLink) {
    // eslint-disable-next-line no-console
    console.warn(
      `[remark-ocak-sections] mini-cta (${filename}): son child sade link değil — yazım sapması.`,
    );
  }

  if (isOnlyLink && onlyChild) {
    return [
      html('<section data-section="mini-cta" class="ocak-mini-cta">'),
      ...content.slice(0, lastIdx),
      onlyChild as RootContent,
      html('</section>'),
    ];
  }
  return [
    html('<section data-section="mini-cta" class="ocak-mini-cta">'),
    ...content,
    html('</section>'),
  ];
}

/**
 * buyuk-vurgu (#29 Brief F.5): tek italik paragraph beklenir.
 * İtalik annotation Notion'dan (`*..*` veya Cmd+I) gelir — plugin dokunmaz.
 * Birden fazla paragraph → warn ama hepsi render edilir.
 */
function transformBuyukVurgu(content: RootContent[], options: OcakSectionsOptions): RootContent[] {
  const filename = options.filename ?? 'unknown';
  const paraCount = content.filter((n) => n.type === 'paragraph').length;
  if (paraCount > 1) {
    // eslint-disable-next-line no-console
    console.warn(
      `[remark-ocak-sections] buyuk-vurgu (${filename}): ${paraCount} paragraph (tek beklenir).`,
    );
  }
  return [
    html('<section data-section="buyuk-vurgu" class="ocak-buyuk-vurgu">'),
    ...content,
    html('</section>'),
  ];
}

/**
 * manifesto-vurgu (KARAR 153): tek köz nokta glyph + krem italik prose.
 * buyuk-vurgu kardeşi — aynı "tek-paragraph vurgu" yapısı, farklı görsel ton
 * (krem + köz glyph vs altın + glyph yok). Footer'dan section'a göç ettirilen
 * manifesto cümlesi için kanonik kap; Notion'da `## section: manifesto-vurgu`
 * etiketiyle istenilen sayfanın istenilen yerine konabilir (section arası /
 * sayfa sonu).
 *
 * Çıktı: <section><span class="manifesto-vurgu__ember" aria-hidden="true">
 * </span>{prose}</section>. Köz glyph CSS ile çizilir (atmosfer.css), markup
 * dekoratif boş span — aria-hidden semantik gürültüyü engeller.
 *
 * Birden fazla paragraph → warn (tek beklenir), hepsi yine render edilir.
 */
function transformManifestoVurgu(
  content: RootContent[],
  options: OcakSectionsOptions,
): RootContent[] {
  const filename = options.filename ?? 'unknown';
  const paraCount = content.filter((n) => n.type === 'paragraph').length;
  if (paraCount > 1) {
    // eslint-disable-next-line no-console
    console.warn(
      `[remark-ocak-sections] manifesto-vurgu (${filename}): ${paraCount} paragraph (tek beklenir).`,
    );
  }
  return [
    html('<section data-section="manifesto-vurgu" class="ocak-manifesto-vurgu">'),
    html('<span class="manifesto-vurgu__ember" aria-hidden="true"></span>'),
    ...content,
    html('</section>'),
  ];
}

/**
 * ic-ses (10. kanonik): glyphsiz krem italik prose, akan metin ortasında
 * "nefes/kontrast" duraklaması. manifesto-vurgu'nun kardeşi yapısal olarak
 * (tek-paragraph vurgu, ortalı dar kolon, krem italik) — fark IMZA:
 * manifesto-vurgu köz glyph taşır (ağırlık), ic-ses glyph EMIT ETMEZ
 * (hafiflik). buyuk-vurgu altın/clamp 2-3rem yüksek-enerji ilan; ic-ses
 * H3 civarı punto, düşük-enerji. Üç vurgu kardeş, görsel imzaları kasıtlı
 * ayrı (paletin karışmaması için).
 *
 * Çıktı: <section data-section="ic-ses" class="ocak-ic-ses"><p>{prose}</p>
 * </section>. Glyph span YOK — atmosfer.css ic-ses selector'ünde de glow
 * yok. Birden fazla paragraph → warn (tek/kısa beklenir), hepsi yine
 * render edilir (manifesto-vurgu/buyuk-vurgu paterni).
 */
function transformIcSes(
  content: RootContent[],
  options: OcakSectionsOptions,
): RootContent[] {
  const filename = options.filename ?? 'unknown';
  const paraCount = content.filter((n) => n.type === 'paragraph').length;
  if (paraCount > 1) {
    // eslint-disable-next-line no-console
    console.warn(
      `[remark-ocak-sections] ic-ses (${filename}): ${paraCount} paragraph (tek beklenir — çoklu paragraf esik-kadini işidir).`,
    );
  }
  return [
    html('<section data-section="ic-ses" class="ocak-ic-ses">'),
    ...content,
    html('</section>'),
  ];
}

/**
 * kayit-cta (KARAR 207 / Brief 4): köz dolu vurgu butonu + opsiyonel üst metin.
 *
 * Plugin sayfa slug'ını bilmez (global instance, options'sız wiring). href'i
 * placeholder olarak yazar; notion-pages.ts'deki resolveKayitCtaHref
 * post-render adımı 6 format slug'u ise placeholder'ı `/${slug}/kayit` ile
 * değiştirir; değilse `<section data-section="kayit-cta">...</section>`
 * regex'iyle tüm section'ı kaldırır + console.warn yazar (6-format-dışı
 * sayfada sessiz atla davranışı, Adım 0 karar A).
 *
 * Üst metin opsiyonel: `## section: kayit-cta` altına prose yazılırsa buton
 * üstünde çağrı cümlesi; yazılmazsa çıplak buton.
 *
 * Buton metni brief-faz3-h4-h5 İş 3 sonrası slug'a göre değişir ("Kayıt Ol"
 * veya "Başvur") — placeholder olarak emit edilir, loader resolveKayitCtaHref
 * KAYIT_CTA_LABEL map'inden doldurur.
 */
function transformKayitCta(content: RootContent[]): RootContent[] {
  // data-kayit-cta-button attribute test'lerde + CSS scope'ta marker görevi görür.
  // href __KAYIT_CTA_HREF__, label __KAYIT_CTA_LABEL__ placeholder — loader
  // resolveKayitCtaHref ikisini de slug bazlı doldurur (İş 3 iki-şablon).
  const buton = html(
    '<a class="ocak-kayit-cta__buton" href="__KAYIT_CTA_HREF__" data-kayit-cta-button>__KAYIT_CTA_LABEL__ →</a>',
  );
  return [
    html('<section data-section="kayit-cta" class="ocak-kayit-cta">'),
    ...content,
    buton,
    html('</section>'),
  ];
}

/**
 * esik-* (/sen-neredesin): exclusive accordion.
 * - Section'ın ilk h2'sini (depth=2) bulur, metnini summary'ye taşır, node'u content'ten çıkarır.
 * - `<details name="esikler" data-section="NAME">` ile wrap; `name` attribute exclusive
 *   davranışı sağlar (Chrome 120+, Safari 17.4+, FF 123+; eski tarayıcı: çoklu açık olur,
 *   graceful degradation).
 * - h2 bulunmazsa fallback: summary section-name'den türetilir + warn. Brief Pattern A
 *   varsayıyor (esik-dump teyit etti); B durumu defansif fallback olarak yaşıyor.
 */
/**
 * evreler-intro (brief-anadolu-yolculuk.md): "Altı Evre" başlığı + opsiyonel
 * giriş cümlesi. Default case'den ayrı çünkü kart bloğunun açılış başlığı —
 * kendine has class hierarchy gerekir (atmosfer.css ölçek + boşluk).
 */
function transformEvrelerIntro(content: RootContent[]): RootContent[] {
  return [
    html('<section data-section="evreler-intro" class="ocak-evreler-intro">'),
    ...content,
    html('</section>'),
  ];
}

/**
 * Minimal HTML attribute escape — Notion düz metin için pratikte gereksiz ama
 * `&`/`"`/`<`/`>` sızarsa kart markup'ı bozulmasın diye savunma. ESIK summary'de
 * yapılmıyor (KARAR 154); burada arketip/soru/meta inline metni kart içine "attr
 * benzeri" pozisyonlarda akıyor, çakışma bedeli düşük.
 */
function escapeHtmlText(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * evre-* (brief-anadolu-yolculuk.md): Anadolu Yolculuğu altı evre kartı (Varyant C).
 *
 * Parse:
 *   - İlk H3 "NAME — LOKASYON" → evre adı + lokasyon. " — " (em-dash etrafı space)
 *     üzerinde split; bulunmazsa H3 metni adı, lokasyon boş (defansif).
 *   - Lokasyon ayraç normalize: " + " → " · " (brief: Notion "·" yazar, plugin "+"
 *     gördüyse defansif çevirir; tek-fail-noktası Notion-side temizlik).
 *   - İlk paragraph → meta satırı ("tarih · süre · yer").
 *   - Sonraki paragraph'lar → açıklama (description prose); description'a düşmeden
 *     ÖNCE `Arketip:` / `Soru:` prefix'li paragraph + bullet item'ları ayıklanır.
 *   - Arketip + Soru: bullet list (`- Arketip: X`, `- Soru: Y`) VEYA standalone
 *     `Soru: X` paragraph (AÇILIŞ'ta arketip YOK).
 *
 * Output Varyant C dolu kart:
 *   <article class="ocak-evre ocak-evre-acilis" id="evre-acilis" data-evre="acilis"
 *            style="--isi-aktif: var(--isi-acilis);">
 *     <span class="ocak-evre__serit"></span>
 *     <div class="ocak-evre__icerik">
 *       <h3 class="ocak-evre__baslik">
 *         <span class="ocak-evre__ad">AÇILIŞ</span>
 *         <span class="ocak-evre__dash"> — </span>
 *         <span class="ocak-evre__lokasyon">Ege</span>
 *       </h3>
 *       <p class="ocak-evre__meta">…</p>
 *       <div class="ocak-evre__aciklama">…</div>
 *       <div class="ocak-evre__alt">
 *         <span class="ocak-evre__arketip">Kök Kadın</span>
 *         <span class="ocak-evre__ayrac">·</span>
 *         <span class="ocak-evre__soru">…</span>
 *       </div>
 *     </div>
 *   </article>
 *
 * AÇILIŞ'ta arketip yoksa alt şeritte sadece soru basılır (ayraç ve span da yok).
 * H3 yoksa fallback: section-name'den evre adı türetilir + warn.
 */
function transformEvre(
  content: RootContent[],
  name: string,
  options: OcakSectionsOptions,
): RootContent[] {
  const filename = options.filename ?? 'unknown';
  const slug = name.replace(/^evre-/, '');
  const isiToken = EVRE_ISI_TOKEN[name] ?? '--isi-acilis';

  // H3 başlığı (depth=3)
  let h3Index = -1;
  let h3Text = '';
  for (let i = 0; i < content.length; i++) {
    const node = content[i];
    if (node.type === 'heading' && node.depth === 3) {
      h3Index = i;
      h3Text = getText(node).trim();
      break;
    }
  }

  let evreAdi = slug.toUpperCase();
  let lokasyon = '';
  if (h3Text) {
    const parts = h3Text.split(/\s+—\s+/);
    if (parts.length >= 2) {
      evreAdi = parts[0].trim();
      lokasyon = parts.slice(1).join(' — ').trim();
    } else {
      evreAdi = h3Text;
    }
  } else {
    // eslint-disable-next-line no-console
    console.warn(
      `[remark-ocak-sections] evre (${filename}) ${name}: H3 bulunamadı, evre adı section-name'den türetildi.`,
    );
  }
  // Lokasyon ayraç normalize: " + " → " · "
  lokasyon = lokasyon.replace(/\s*\+\s*/g, ' · ');

  // H3 sonrası içerik — meta, açıklama, arketip+soru ayıkla
  const rest = h3Index === -1 ? content : content.slice(h3Index + 1);
  let meta = '';
  let metaConsumed = false;
  let arketip = '';
  let soru = '';
  const descriptionNodes: RootContent[] = [];

  for (const node of rest) {
    if (node.type === 'list') {
      const items = (node as { children?: RootContent[] }).children ?? [];
      let consumedAny = false;
      for (const item of items) {
        const txt = getText(item).trim();
        const arkM = txt.match(/^Arketip:\s*(.+)$/);
        const soruM = txt.match(/^Soru:\s*(.+)$/);
        if (arkM && !arketip) {
          arketip = arkM[1].trim();
          consumedAny = true;
        } else if (soruM && !soru) {
          soru = soruM[1].trim();
          consumedAny = true;
        }
      }
      // Tüm item'lar arketip/soru ise list'i description'a düşürme; aksi halde aynen geçir
      if (!consumedAny) descriptionNodes.push(node);
      continue;
    }
    if (node.type === 'paragraph') {
      const txt = getText(node).trim();
      const arkM = txt.match(/^Arketip:\s*(.+)$/);
      const soruM = txt.match(/^Soru:\s*(.+)$/);
      if (arkM && !arketip) {
        arketip = arkM[1].trim();
        continue;
      }
      if (soruM && !soru) {
        soru = soruM[1].trim();
        continue;
      }
      if (!metaConsumed) {
        meta = txt;
        metaConsumed = true;
        continue;
      }
      descriptionNodes.push(node);
      continue;
    }
    descriptionNodes.push(node);
  }

  if (!soru) {
    // eslint-disable-next-line no-console
    console.warn(
      `[remark-ocak-sections] evre (${filename}) ${name}: Soru bulunamadı — alt şerit boş kalacak.`,
    );
  }

  const headingHtml = lokasyon
    ? `<h3 class="ocak-evre__baslik"><span class="ocak-evre__ad">${escapeHtmlText(evreAdi)}</span><span class="ocak-evre__dash" aria-hidden="true"> — </span><span class="ocak-evre__lokasyon">${escapeHtmlText(lokasyon)}</span></h3>`
    : `<h3 class="ocak-evre__baslik"><span class="ocak-evre__ad">${escapeHtmlText(evreAdi)}</span></h3>`;

  const metaHtml = meta
    ? `<p class="ocak-evre__meta">${escapeHtmlText(meta)}</p>`
    : '';

  let altHtml = '';
  if (arketip && soru) {
    altHtml = `<div class="ocak-evre__alt"><span class="ocak-evre__arketip">${escapeHtmlText(arketip)}</span><span class="ocak-evre__ayrac" aria-hidden="true">·</span><span class="ocak-evre__soru">${escapeHtmlText(soru)}</span></div>`;
  } else if (soru) {
    altHtml = `<div class="ocak-evre__alt ocak-evre__alt--soru-only"><span class="ocak-evre__soru">${escapeHtmlText(soru)}</span></div>`;
  } else if (arketip) {
    altHtml = `<div class="ocak-evre__alt ocak-evre__alt--arketip-only"><span class="ocak-evre__arketip">${escapeHtmlText(arketip)}</span></div>`;
  }

  return [
    html(
      `<article class="ocak-evre ocak-evre-${slug}" id="evre-${slug}" data-evre="${slug}" style="--isi-aktif: var(${isiToken});">`,
    ),
    html('<span class="ocak-evre__serit" aria-hidden="true"></span>'),
    html('<div class="ocak-evre__icerik">'),
    html(headingHtml),
    ...(metaHtml ? [html(metaHtml)] : []),
    html('<div class="ocak-evre__aciklama">'),
    ...descriptionNodes,
    html('</div>'),
    ...(altHtml ? [html(altHtml)] : []),
    html('</div></article>'),
  ];
}

function transformEsik(
  content: RootContent[],
  name: string,
  options: OcakSectionsOptions,
): RootContent[] {
  const filename = options.filename ?? 'unknown';
  // İlk h2'yi bul (section: prefix değil — getSectionName zaten dışarıda harcadı).
  let h2Index = -1;
  let h2Text = '';
  for (let i = 0; i < content.length; i++) {
    const node = content[i];
    if (node.type === 'heading' && node.depth === 2) {
      h2Index = i;
      h2Text = getText(node).trim();
      break;
    }
  }

  if (h2Index === -1) {
    // eslint-disable-next-line no-console
    console.warn(
      `[remark-ocak-sections] esik (${filename}) ${name}: ilk h2 bulunamadı, summary section-name'den türetildi.`,
    );
    h2Text = name; // ham fallback — CSS hâlâ italik serif basar, içerik bozulmaz
  }

  const rest = h2Index === -1 ? content : [...content.slice(0, h2Index), ...content.slice(h2Index + 1)];

  return [
    html(`<details name="esikler" data-section="${name}"><summary>${h2Text}</summary>`),
    ...rest,
    html('</details>'),
  ];
}

/** Bir section'ı NAME'e göre sarmalanmış node dizisine dönüştürür. */
function transformSection(
  name: string,
  content: RootContent[],
  options: OcakSectionsOptions,
): RootContent[] {
  switch (name) {
    case 'hero': {
      // İlk paragraph "overline: AD" ise: node'u ayıkla, değeri data-overline'a taşı.
      // AD verbatim taşınır (ALL CAPS dahil) — plugin transform etmez.
      // hero-fade-out katmanı: glow alt kenarı + Hero altı coal section'a yumuşak geçiş
      // (#30 Brief F sonu Item 6b, Hero B kararı). atmosfer.css `.hero-fade-out` global.
      const { overline, rest } = extractOverline(content);
      const overlineAttr = overline ? ` data-overline="${overline}"` : '';
      return [
        html(`<section data-section="hero"${overlineAttr}>`),
        html('<div class="hero-fade-out" aria-hidden="true"></div>'),
        ...rest,
        html('</section>'),
      ];
    }

    case 'bir-sonraki':
      // class="ocak-bir-sonraki" eklendi (#25 Brief A item 4): generic prose baseline
      // `section[data-section][class^="ocak-"]` selector ailesi nested blockquote
      // sıfırlama kuralını bu kanonik section'a da uygulayabilsin (Notion content'inde
      // `>` notation kullanılırsa nested blockquote gürültüsü baseline'da otomatik
      // collapse edilir). Mevcut `[data-section="bir-sonraki"] > blockquote` spesifik
      // stili korunur (daha yüksek specificity gerekirse).
      return [
        html('<section data-section="bir-sonraki" class="ocak-bir-sonraki"><blockquote>'),
        ...content,
        html('</blockquote></section>'),
      ];

    case 'sonraki-bulusma':
      // Empty wrapper savunma fallback'i (KARAR 127 fragment-split paralel).
      // Loader splitBodyByMarkers marker'ı keserse plugin buraya hiç gelmez;
      // marker bir şekilde body'de kalırsa empty section emit edilir, CSS
      // prose section ailesi görsel olarak suppress eder.
      return [
        html(
          `<section data-section="sonraki-bulusma" class="ocak-sonraki-bulusma" data-source="${extractSource(content)}"></section>`,
        ),
      ];

    case 'al-ol-ver':
      // Empty wrapper savunma fallback'i (sonraki-bulusma paralel, KARAR 127).
      // Asıl render fragment-split tarafında AlOlVer component'iyle olur.
      return [
        html(
          '<section data-section="al-ol-ver" class="ocak-al-ol-ver"></section>',
        ),
      ];

    case 'yolculuk-eksen':
      // Empty wrapper savunma fallback'i (al-ol-ver paralel, brief Yolculuk Ekseni v2).
      // Asıl render fragment-split tarafında YolculukEksen component'iyle olur.
      return [
        html(
          '<section data-section="yolculuk-eksen" class="ocak-yolculuk-eksen"></section>',
        ),
      ];

    case 'kanallar':
      // Empty wrapper savunma fallback'i (al-ol-ver/yolculuk-eksen paralel,
      // brief brief-kanallar-yerlesim-zemin.md). Asıl render fragment-split
      // tarafında Kanallar component'iyle olur.
      return [
        html('<section data-section="kanallar" class="ocak-kanallar"></section>'),
      ];

    case 'harita-anadolu':
      // Empty wrapper savunma fallback'i (kanallar/yolculuk-eksen paralel, brief
      // brief-anadolu-yolculuk.md). Asıl render fragment-split tarafında
      // AnadoluHarita component'iyle olur.
      return [
        html('<section data-section="harita-anadolu" class="ocak-harita-anadolu"></section>'),
      ];

    case 'siradaki-kapi':
      return transformKapi(content, options);

    case 'sss':
      return transformSss(content, options);

    case 'mini-cta':
      return transformMiniCta(content, options);

    case 'buyuk-vurgu':
      return transformBuyukVurgu(content, options);

    case 'manifesto-vurgu':
      return transformManifestoVurgu(content, options);

    case 'ic-ses':
      return transformIcSes(content, options);

    case 'kayit-cta':
      return transformKayitCta(content);

    case 'evreler-intro':
      // /anadolu: "Altı Evre" başlığı + opsiyonel giriş, kart bloğunun
      // açılış başlığı. Default prose'tan ayrı çünkü kendine has class.
      return transformEvrelerIntro(content);

    default: {
      // /anadolu evre kartları: 6-isimlik EVRE_SECTIONS whitelist (set match).
      // Default'tan önce check; brief brief-anadolu-yolculuk.md Varyant C.
      if (EVRE_SECTIONS.has(name)) {
        return transformEvre(content, name, options);
      }

      // /sen-neredesin eşik accordion: 10-isimlik ESIK_SECTIONS whitelist (set match).
      // `esik-kadini` whitelist dışında → bu dalı atlar, baseline prose'a düşer (mevcut
      // davranış korunur — /, /hikaye, /site-rehber sayfaları etkilenmez).
      if (ESIK_SECTIONS.has(name)) {
        return transformEsik(content, name, options);
      }

      // Kanonik dışı: serbest prose (manifesto, al-ol-ver, cekirdek-vaat, esik-kadini …).
      // İlk paragraf "overline: X" ise data-overline attr olarak taşı, ::before ile basılır
      // (atmosfer.css prose section retarget — #24 Brief 2).
      const { overline, rest } = extractOverline(content);
      const overlineAttr = overline ? ` data-overline="${overline}"` : '';
      return [
        html(`<section data-section="${name}" class="ocak-${name}"${overlineAttr}>`),
        ...rest,
        html('</section>'),
      ];
    }
  }
}

const remarkOcakSections: Plugin<[OcakSectionsOptions?], Root> = (options = {}) => {
  return (tree) => {
    // Link href normalize — iki defansif kural (#24 Brief 3b S3, #26 Brief F):
    //   (1) Notion italik link text artığı strip: baş+son `_`/`*` karakterleri sıyır.
    //       notion-to-md `[Takvim](_https://...notion.so/takvim_)` üretebilir.
    //   (2) Notion internal link normalize: `https://www.notion.so/<slug>` →
    //       INTERNAL_SLUGS whitelist match → `/<slug>`. Whitelist dışı match warn'la
    //       görünür kalır (nested path `kayit/...`, hash fragment, external page).
    const filename = options.filename ?? 'unknown';
    visit(tree, 'link', (node) => {
      if (typeof node.url !== 'string') return;
      // (1) baş/son italik artığı strip
      node.url = node.url.replace(/^[_*]+|[_*]+$/g, '');
      // (2) Notion nested basvuru/<slug>-<yıl> → `/<slug>/basvuru` (Brief F sonu Item 1)
      const nb = node.url.match(NOTION_BASVURU_RE);
      if (nb) {
        const slug = nb[1];
        if (INTERNAL_SLUGS.has(slug)) {
          node.url = '/' + slug + '/basvuru';
        } else {
          // eslint-disable-next-line no-console
          console.warn(
            `[remark-ocak-sections] Notion basvuru/ whitelist dışı (${filename}): ${node.url}`,
          );
        }
      } else {
        // (3) Notion internal link normalize (tek segment slug)
        const m = node.url.match(NOTION_URL_RE);
        if (m) {
          const slug = m[1];
          if (INTERNAL_SLUGS.has(slug)) {
            node.url = '/' + slug;
          } else {
            // eslint-disable-next-line no-console
            console.warn(
              `[remark-ocak-sections] Notion link whitelist dışı (${filename}): ${node.url}`,
            );
          }
        }
      }
      // (4) ocak.biz nested basvuru/<slug>-<yıl> → `/<slug>/basvuru`
      const obb = node.url.match(OCAK_BIZ_BASVURU_RE);
      if (obb) {
        const slug = obb[1];
        if (INTERNAL_SLUGS.has(slug)) {
          node.url = '/' + slug + '/basvuru';
        } else {
          // eslint-disable-next-line no-console
          console.warn(
            `[remark-ocak-sections] ocak.biz basvuru/ whitelist dışı (${filename}): ${node.url}`,
          );
        }
      } else {
        // (5) ocak.biz absolute URL normalize — Notion canonical link yazımı (#29 Brief F.5)
        const ob = node.url.match(OCAK_BIZ_URL_RE);
        if (ob) {
          const slug = ob[1];
          if (INTERNAL_SLUGS.has(slug)) {
            node.url = '/' + slug;
          } else {
            // eslint-disable-next-line no-console
            console.warn(
              `[remark-ocak-sections] ocak.biz link whitelist dışı (${filename}): ${node.url}`,
            );
          }
        }
      }
    });

    // Paragraph italik artığı strip — Notion'da `_xxx_word` veya `_xxx yyy_` yazımları
    // markdown spec'inde italik olarak parse EDİLMEZ (intraword closing yasak, içerikte
    // boşluk + closing kuralı edge case). notion-to-md literal `_`/`*` karakterlerini
    // text node'unda bırakır → ekrana sızar (#25 Brief A item 7, KARAR 108 5./6. kural).
    //
    // İki kural — sıralı uygulanır:
    //   (5) Açılış sınırda + içerik + kapanış sonrası letter → intraword closing,
    //       italik geçersiz, iki marker strip. Örn: `_Kim için:_Tükendiğini` → strip.
    //   (6) Açılış sınırda + içerik (whitespace içerir) + kapanış → text node'unda
    //       kaldıysa parse engine italik render etmemiş, iki marker strip.
    //       Örn: `_"Bunu..."_diyen` → strip.
    // Lookbehind `(?<![\p{L}\p{N}])` snake_case (`foo_bar_baz`) gibi intraword open'ı
    // korur — sadece kelime sınırına bitişik açılış strip edilir.
    visit(tree, 'text', (node) => {
      if (typeof node.value !== 'string') return;
      let v = node.value;
      // Rule 5 — intraword close (kapanış sonrası letter): `_xxx_W` → strip
      v = v.replace(/(?<![\p{L}\p{N}])_([^_\n]+)_(?=[\p{L}])/gu, '$1');
      v = v.replace(/(?<![\p{L}\p{N}])\*([^*\n]+)\*(?=[\p{L}])/gu, '$1');
      // Rule 6 — içerikte whitespace, intraword olmasa bile italik invalid: `_x y_` → strip
      v = v.replace(/(?<![\p{L}\p{N}])_([^_\n]*\s[^_\n]*)_/gu, '$1');
      v = v.replace(/(?<![\p{L}\p{N}])\*([^*\n]*\s[^*\n]*)\*/gu, '$1');
      node.value = v;
    });

    // listItem text başında yapışık `*` artığı strip — KARAR 108 7. kural (#25 Brief A item 10).
    // Notion content'inde Cmd+B uygulanmış metnin SAĞ ve SOL'una literal `**` ve `*`
    // karakterleri YAZILMIŞ (yazım hatası: Notion zaten kendi `**` delim'ini koyuyor).
    // notion-to-md output: `* ****Bir geçişin içindesin*** — yyy` (asimetrik 4 açılış / 3 kapanış).
    // remark-parse CommonMark Rule 9-10: 3 close + 3 open eşleşir → <em><strong>xxx</strong></em>;
    // kalan 1 açılış `*` literal text node'unda kalır → bullet item başında "*" sızar.
    // Fix: listItem > paragraph > ilk text child value `*` ile başlıyorsa + sonraki node
    // emphasis veya strong ise → baştaki `*` ve onu izleyen whitespace strip.
    visit(tree, 'listItem', (li) => {
      const liChildren = (li as { children?: RootContent[] }).children;
      const para = liChildren?.[0] as { type?: string; children?: RootContent[] } | undefined;
      if (para?.type !== 'paragraph') return;
      const paraChildren = para.children;
      const first = paraChildren?.[0] as { type?: string; value?: string } | undefined;
      const next = paraChildren?.[1] as { type?: string } | undefined;
      if (first?.type !== 'text' || typeof first.value !== 'string') return;
      // Sonraki node emphasis/strong olmalı — yoksa `*` belki gerçek içerik
      if (next?.type !== 'emphasis' && next?.type !== 'strong') return;
      // Baştaki `*` (1+ kez) ve onu izleyen whitespace strip
      const stripped = first.value.replace(/^\*+\s*/, '');
      first.value = stripped;
      // Tamamen boşalan text node'u kaldır
      if (stripped === '' && paraChildren) paraChildren.shift();
    });

    // Whitespace-only paragraph + blockquote temizliği (#25 Brief A item 4).
    // Notion `>` notation arası boş satırlar `<blockquote>\n</blockquote>`,
    // `<p>\n</p>` formunda HTML'e iniyordu → CSS `:empty` whitespace yakalamaz
    // (spec: text node varsa empty değil) → border-left dik çizgi devamı + dikey
    // boşluk artığı. Çözüm mdast üzerinde post-order recursive temizlik: child'lar
    // önce işlenir (içerik kalmıyorsa parent da boşalır), parent boş paragraph/
    // blockquote ise dışarıdan filtre edilir. visit yerine doğrudan traversal —
    // SKIP karmaşıklığı + index drift riski yok.
    cleanWhitespaceNodes(tree);

    const children = tree.children;
    const next: RootContent[] = [];
    let i = 0;
    // form-anchor sıra index'i — sayfa içinde sadece form-anchor section'larında artar
    // (#29 Brief F.5 Adım 2.1). PageContent helper bu index'i registry[slug][index]
    // ile eşleyip component basar; loader fragment-split'i de aynı sayımı kullanır.
    let formAnchorIndex = 0;

    while (i < children.length) {
      const name = getSectionName(children[i]);
      if (name === null) {
        // Section dışı node (ör. frontmatter) — olduğu gibi geçir.
        next.push(children[i]);
        i++;
        continue;
      }

      // Section başlığını atla, bir sonraki section'a kadar içeriği topla.
      i++;
      const content: RootContent[] = [];
      while (i < children.length && getSectionName(children[i]) === null) {
        content.push(children[i]);
        i++;
      }

      // OMIT: ana sayfada component instance ile render edilen section'lar — hiç emit etme.
      if (OMIT_SECTIONS.includes(name)) continue;

      // form-anchor: boş yer tutucu (data-form-anchor + data-form-index).
      // Loader fragment-split bu marker'lara dayanır; içerik yoksa da emit edilir.
      if (name === 'form-anchor') {
        next.push(
          html(
            `<section data-section="form-anchor" data-form-anchor data-form-index="${formAnchorIndex}"></section>`,
          ),
        );
        formAnchorIndex++;
        continue;
      }

      next.push(...transformSection(name, content, options));
    }

    tree.children = next;
    return tree;
  };
};

export default remarkOcakSections;
