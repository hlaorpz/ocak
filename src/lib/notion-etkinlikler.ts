/**
 * notion-etkinlikler.ts — Etkinlikler collection için pure transformation logic.
 *
 * Brief 2 (notion-pages.ts) deseninin tekrarı:
 *  - Notion client dependency-injection ile dışarıdan verilir (notion.ts import.meta.env
 *    okuyor → plain Node'da undefined; bu modül notion.ts import ETMEZ).
 *  - queryDatabase pagination'ı inline.
 *  - Property okuyucular notion-pages.ts'tekiyle paralel ama lokal (o dosyaya dokunmuyoruz).
 *
 * Etkinlikler `data` collection: body yok, sadece property'ler. Property eşleme
 * Brief 1 keşif raporundaki Notion gerçeğine dayanır.
 */

import type { Client } from '@notionhq/client';
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

export type EtkinlikFrontmatter = {
  baslik: string;
  tip: string;
  /** Notion date.start — ISO YYYY-MM-DD. */
  tarihBaslangic: string;
  /** Notion date.end — range etkinlikler için; tek günlükte undefined. */
  tarihBitis?: string;
  saat?: string;
  mekan: string;
  mekanDetay?: string;
  /** Relative olabilir (örn. /kayit/...) — bu yüzden Zod tarafında .url() YOK. */
  kayitUrl?: string;
  durum: string;
  aciklama?: string;
  siteGoster: boolean;
  oneCikar: boolean;
  notion_id: string;
  /** Notion "Ücret" number property — null/0 = ücretsiz; >0 = ödemeli (Brief 2A). */
  ucret?: number;
  /** Notion "Para Birimi" select — TRY/USD/EUR. Default 'TRY' Brief 2A endpoint'inde. */
  paraBirimi?: string;
  /** Notion "Kayıt Soruları" rich_text — Shift+Enter ile \n ayraçlı. Parse: split('\n').filter(Boolean). */
  kayitSorulari?: string;
  /**
   * Notion "Kart Görsel" files & media — buluşma kartı köşe görseli (Brief
   * brief-fotolu-onizleme.md İş 4). Boşsa undefined → SonrakiBulusma kartı master
   * görünümünde basılır (sıfır farklılık).
   */
  kartGorsel?: string;
};

// ── Property okuyucular (Node-safe, bağımsız) ──

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

function checkboxVal(page: PageObjectResponse, name: string): boolean {
  const p = page.properties[name];
  return p?.type === 'checkbox' ? p.checkbox : false;
}

function numberVal(page: PageObjectResponse, name: string): number | undefined {
  const p = page.properties[name];
  return p?.type === 'number' ? (p.number ?? undefined) : undefined;
}

function urlVal(page: PageObjectResponse, name: string): string {
  const p = page.properties[name];
  return p?.type === 'url' ? (p.url ?? '') : '';
}

/** files & media property → ilk dosyanın URL'i, yoksa undefined (notion-pages.ts paraleli). */
function filesUrl(page: PageObjectResponse, name: string): string | undefined {
  const p = page.properties[name];
  if (p?.type !== 'files' || p.files.length === 0) return undefined;
  const f = p.files[0];
  if (f.type === 'file') return f.file.url;
  if (f.type === 'external') return f.external.url;
  return undefined;
}

/** Notion date property → { start, end? }; boşsa null. */
function dateRange(page: PageObjectResponse, name: string): { start: string; end?: string } | null {
  const p = page.properties[name];
  if (p?.type !== 'date' || !p.date) return null;
  return p.date.end ? { start: p.date.start, end: p.date.end } : { start: p.date.start };
}

/**
 * Etkinlikler DB'sindeki tüm satırları paginated çeker.
 * (Body block'ları çekilmez — Etkinlikler için sadece property'ler kullanılıyor.)
 */
export async function fetchEtkinlikler(
  notion: Client,
  databaseId: string,
): Promise<PageObjectResponse[]> {
  const results: PageObjectResponse[] = [];
  let cursor: string | undefined;
  do {
    const res = await notion.databases.query({ database_id: databaseId, start_cursor: cursor });
    for (const row of res.results) {
      if ('properties' in row) results.push(row as PageObjectResponse);
    }
    cursor = res.has_more && res.next_cursor ? res.next_cursor : undefined;
  } while (cursor);
  return results;
}

/** Bir Notion etkinlik satırını frontmatter objesine dönüştürür (body yok). */
export function transformEtkinlik(page: PageObjectResponse): EtkinlikFrontmatter {
  const tarih = dateRange(page, 'Tarih');
  const saat = richText(page, 'Saat').trim();
  const mekanDetay = richText(page, 'Konum Detay').trim();
  const kayitUrl = urlVal(page, 'Kayıt Linki').trim();
  const aciklama = richText(page, 'Kısa Açıklama').trim();
  const ucret = numberVal(page, 'Ücret');
  const paraBirimi = selectVal(page, 'Para Birimi');
  const kayitSorulari = richText(page, 'Kayıt Soruları');
  const kartGorsel = filesUrl(page, 'Kart Görsel');

  return {
    baslik: richText(page, 'Başlık').trim(),
    tip: selectVal(page, 'Format'),
    tarihBaslangic: tarih?.start ?? '',
    mekan: selectVal(page, 'Mekân/Platform'),
    durum: selectVal(page, 'Statü'),
    siteGoster: checkboxVal(page, 'Sitede Göster'),
    oneCikar: checkboxVal(page, 'Öne Çıkar'),
    notion_id: page.id,
    ...(tarih?.end ? { tarihBitis: tarih.end } : {}),
    ...(saat ? { saat } : {}),
    ...(mekanDetay ? { mekanDetay } : {}),
    ...(kayitUrl ? { kayitUrl } : {}),
    ...(aciklama ? { aciklama } : {}),
    ...(ucret !== undefined ? { ucret } : {}),
    ...(paraBirimi ? { paraBirimi } : {}),
    ...(kayitSorulari ? { kayitSorulari } : {}),
    ...(kartGorsel ? { kartGorsel } : {}),
  };
}
