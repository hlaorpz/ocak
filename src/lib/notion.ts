/**
 * Notion API client (KARAR 97)
 *
 * Token: NOTION_TOKEN env değişkeni. Vercel'de Production + Preview için ayarlanır,
 * lokal'de .env dosyasına yazılır (.env .gitignore'da).
 *
 * Database'ler:
 *  - Sayfalar (19 site sayfası içeriği + metadata)
 *  - Etkinlikler (sonraki-bulusma section binding kaynağı)
 *
 * Tam içerik çekme akışı #22 sohbetinde implement edilecek
 * (queryDatabase → notion-to-md → remark plugin → Astro content).
 */

import { Client } from '@notionhq/client';
import type {
  PageObjectResponse,
  QueryDatabaseParameters,
} from '@notionhq/client/build/src/api-endpoints';

const NOTION_TOKEN = import.meta.env.NOTION_TOKEN;

if (!NOTION_TOKEN && import.meta.env.PROD) {
  throw new Error(
    'NOTION_TOKEN tanımlı değil. Vercel env veya .env dosyasına ekle (KARAR 97).'
  );
}

export const notion = new Client({ auth: NOTION_TOKEN });

export const NOTION_PAGES_DB = import.meta.env.NOTION_PAGES_DB_ID ?? '';
export const NOTION_EVENTS_DB = import.meta.env.NOTION_EVENTS_DB_ID ?? '';
export const NOTION_BASVURULAR_DB = import.meta.env.NOTION_BASVURULAR_DB_ID ?? '';
// Ödeme/kayıt otoritesi (KARAR 76). Kapı 1 formatları (acik-kapi/atolye/
// mini-retreat/sehir-aksami/seremoni) burada satır açar; cember (Kapı 2) Başvurular'a
// yazar, oradan onayla Kayıtlar'a düşer (Aşama 1.6 köprüsü).
export const NOTION_KAYITLAR_DB = import.meta.env.NOTION_KAYITLAR_DB_ID ?? '';
// brief-davet-sistemi: Davet Sistemi v1 — /api/davet endpoint Davetler DB'ye
// satır açar (Davet Eden Ref / Davet Edilen / Kanal / Tarih / Sonuç /
// Hatırlatma Atıldı). Sonuç eşleştirme ve A→B hatırlatma n8n tarafı.
export const NOTION_DAVETLER_DB = import.meta.env.NOTION_DAVETLER_DB_ID ?? '';

/**
 * Bir Notion database'ini sorgular ve pagination'ı handle ederek tüm sonuçları döner.
 */
export async function queryDatabase(
  databaseId: string,
  options: Omit<QueryDatabaseParameters, 'database_id' | 'start_cursor'> = {}
): Promise<PageObjectResponse[]> {
  const results: PageObjectResponse[] = [];
  let cursor: string | undefined = undefined;

  do {
    const response = await notion.databases.query({
      database_id: databaseId,
      start_cursor: cursor,
      ...options,
    });

    for (const row of response.results) {
      if ('properties' in row) {
        results.push(row as PageObjectResponse);
      }
    }

    cursor = response.has_more && response.next_cursor ? response.next_cursor : undefined;
  } while (cursor);

  return results;
}

/**
 * Notion property'lerinden TR karakteri olan plain text çıkarır.
 * title / rich_text / select / url / email / number / date / multi_select destekli.
 */
export function getProp(page: PageObjectResponse, name: string): string {
  const prop = page.properties[name];
  if (!prop) return '';

  switch (prop.type) {
    case 'title':
      return prop.title.map((t) => t.plain_text).join('');
    case 'rich_text':
      return prop.rich_text.map((t) => t.plain_text).join('');
    case 'select':
      return prop.select?.name ?? '';
    case 'multi_select':
      return prop.multi_select.map((s) => s.name).join(', ');
    case 'url':
      return prop.url ?? '';
    case 'email':
      return prop.email ?? '';
    case 'number':
      return prop.number?.toString() ?? '';
    case 'date':
      return prop.date?.start ?? '';
    case 'checkbox':
      return prop.checkbox ? 'true' : 'false';
    case 'status':
      return prop.status?.name ?? '';
    default:
      return '';
  }
}
