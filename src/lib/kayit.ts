// kayit.ts — Ödemeli kayıt formları için yardımcı tipler + map'ler (Brief 2A).
//
// Frontend slug ↔ Notion Başvurular DB "Tip" enum + MailerLite grup ID
// köprüleri burada tek-kaynak. Brief 2B'de form component bu map'leri
// import edip slug→format çözümünde kullanır. Brief 2A'da sadece endpoint
// kullanır (form henüz yok).
//
// Notion enum sapmaları:
// - Etkinlikler DB "Format" select: "Mevsim Seremonisi", "İstanbul Akşamı" (uzun)
// - Başvurular DB "Tip" select: "Seremoni", "İstanbul" (kısa) — bu map kısa olan
//   Tip enum'unu hedefler.

export type KayitFormat =
  | 'cember'
  | 'acik-kapi'
  | 'mini-retreat'
  | 'istanbul'
  | 'seremoni'
  | 'workshop';

// Slug → Notion Başvurular DB "Tip" select option name (kısa varyant).
export const FORMAT_TIP: Record<KayitFormat, string> = {
  cember: 'Çember',
  'acik-kapi': 'Açık Kapı',
  'mini-retreat': 'Mini Retreat',
  istanbul: 'İstanbul',
  seremoni: 'Seremoni',
  workshop: 'Workshop',
};

// Slug → Notion Etkinlikler DB "Format" select option name (UZUN varyant).
// İstanbul + Seremoni'de Başvurular Tip'inden farklı: orada "İstanbul/Seremoni"
// kısaltma, burada "İstanbul Akşamı/Mevsim Seremonisi" uzun. Etkinlikler
// dropdown filtresi bu uzun ismi kullanır.
export const FORMAT_NOTION_FORMAT: Record<KayitFormat, string> = {
  cember: 'Çember',
  'acik-kapi': 'Açık Kapı',
  'mini-retreat': 'Mini Retreat',
  istanbul: 'İstanbul Akşamı',
  seremoni: 'Mevsim Seremonisi',
  workshop: 'Workshop',
};

// Slug → MailerLite grup ID. Brief 3 (KARAR 206): 6 formatın hepsi map'lendi.
// null fallback artık yok — eksik grup compile-time kırar.
export const FORMAT_MAILERLITE_GROUP: Record<KayitFormat, string> = {
  cember: '187798293576681151',
  'acik-kapi': '187372390149261252',
  'mini-retreat': '189209166869431831',
  istanbul: '189209188425008761',
  seremoni: '189209224470857710',
  workshop: '189209178380699119',
};

export function isKayitFormat(s: unknown): s is KayitFormat {
  return typeof s === 'string' && s in FORMAT_TIP;
}

/**
 * Notion "Kayıt Soruları" rich_text plain_text'ini soru dizisine çevirir.
 * Sorular Notion'da Shift+Enter ile yazılır → tek rich_text içinde \n ayraçlı.
 * Boş satırları atar. Boş input → [].
 */
export function parseKayitSorulari(raw: string | undefined | null): string[] {
  if (!raw) return [];
  return raw
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Brief 6 (KARAR 210): Kayıt için benzersiz referans no üretir.
 * Format: `OCAK-XXXXX` (5 haneli rakam, 10000–99999, 90.000 ihtimal).
 * Çakışma kontrolü YOK — düşük hacim, pratik kabul (Kaan kararı).
 *
 * Üretim anında /api/kayit Notion Başvurular DB'ye yazar; success ekranı
 * havale açıklamasında "{referansNo} — {ad}" formatında gösterir.
 * Ödemesiz/Muaf kayıtlarda da Notion'a yazılır (zararsız, izleme için
 * faydalı) ama success ekranında gizlenir (ödeme bloğu yoksa gereksiz).
 */
export function uretReferansNo(): string {
  // 10000–99999 inclusive — Math.random() [0,1) * 90000 → [0, 89999] + 10000.
  const sayi = Math.floor(Math.random() * 90000) + 10000;
  return `OCAK-${sayi}`;
}

/**
 * Brief 5 Yol C: Notion Etkinlikler DB "Mekân/Platform" select değerini
 * katılım tipine eşler. 'Online' → 'link' (Zoom URL); diğer (İzmir/İstanbul/
 * Ege/Anadolu) → 'adres'. Boş / bilinmeyen → 'link' default (lansman
 * etkinlikleri 6/6 Online, defansif fallback online tarafa düşsün).
 */
export function katilimTipiCoz(mekan: string | undefined | null): 'link' | 'adres' {
  if (!mekan || mekan === 'Online') return 'link';
  return 'adres';
}

/**
 * Brief 5 Yol C: MailerLite custom field payload'u oluşturur. C-1 güvenlik
 * ağı — `etkinlik_adi` daima yazılır, `katilim_linki` sadece dolu+trimmed
 * ise eklenir. Boş link payload'a hiç girmez (otomasyon tarafında
 * `{$katilim_linki}` boş basmasın diye field'ı hiç göndermeyiz).
 *
 * Çağıran taraf bu Record'u MailerLite subscribers payload'unun
 * `fields` objesine merge eder (name + bu).
 */
export function mailerLiteCustomFields(
  etkinlikAdi: string,
  katilimLinki: string | undefined | null,
): Record<string, string> {
  const fields: Record<string, string> = { etkinlik_adi: etkinlikAdi };
  if (katilimLinki && katilimLinki.trim()) {
    fields.katilim_linki = katilimLinki.trim();
  }
  return fields;
}

/**
 * Brief 5 Yol C: MailerLite custom field `etkinlik_adi` için insan-okur
 * formatlanmış etkinlik adı. Format Tip (kısa) + seçilen tarih birleşimi
 * (örn. "Çember — 21 Haziran 2026"). seciliTarih boşsa sadece Tip.
 *
 * Plan örneği birebir: KayitFormat slug'ından FORMAT_TIP[format] alınır;
 * uzun varyant FORMAT_NOTION_FORMAT (Etkinlikler DB "Format") değil —
 * MailerLite şablonunda kısa daha doğal.
 */
export function etkinlikAdiFormatla(
  format: KayitFormat,
  seciliTarih: string | undefined | null,
): string {
  const tip = FORMAT_TIP[format];
  const tarih = seciliTarih?.trim();
  return tarih ? `${tip} — ${tarih}` : tip;
}

/**
 * kayit-cta section'ı için post-render href çözümü (Brief 4 KARAR 207).
 *
 * Plugin (remark-ocak-sections.ts transformKayitCta) buton href'ini
 * `__KAYIT_CTA_HREF__` placeholder olarak emit eder; plugin global instance
 * sayfa slug'ını bilmediği için. Bu helper loader (notion-pages.ts) içinde
 * her sayfanın HTML'i render edildikten sonra çağrılır.
 *
 * Davranış (Adım 0 karar A — sessiz atla + warn):
 *  - Slug 6 KayitFormat'tan biri → placeholder `/${slug}/kayit` ile değiştirilir.
 *  - Slug 6 format dışı (örn. '/hikaye', '/biz', '/') →
 *    `<section data-section="kayit-cta">...</section>` tüm bloğu (üst metin
 *    dahil) regex ile kaldırılır + tek console.warn yazılır (build log'da
 *    görünür kalır, sayfa boş render edilir).
 *
 * Slug input formatları: '/cember', 'cember', '/cember/' hepsi tolere
 * edilir; defansif normalize.
 */
export function resolveKayitCtaHref(html: string, rawSlug: string): string {
  if (!html.includes('data-section="kayit-cta"')) return html;
  const slug = rawSlug.replace(/^\/+|\/+$/g, '');
  if (isKayitFormat(slug)) {
    return html.replaceAll('__KAYIT_CTA_HREF__', `/${slug}/kayit`);
  }
  // 6 format dışı → tüm kayit-cta bloğunu kaldır (üst metin dahil) + warn.
  // eslint-disable-next-line no-console
  console.warn(
    `[kayit-cta] /${slug || ''}: 6 format dışı sayfa — section render edilmedi (Brief 4 / KARAR 207).`,
  );
  return html.replace(
    /<section\s+data-section="kayit-cta"[\s\S]*?<\/section>/g,
    '',
  );
}
