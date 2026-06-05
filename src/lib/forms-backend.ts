// forms-backend.ts — Apps Script göçü helper'ları (brief-appscript-olum).
//
// `/api/form` endpoint'i ücretsiz lead formları (ates-mektuplari, anadolu-basvuru,
// iletisim) için bu modülden okur. Ücretli kayıt akışı (/api/kayit) kendi inline
// helper'larını sürdürür — etkinlik okuma + custom field + referansNo özel
// mantığı orada dursun (Kaan kararı: minimum risk, çalışan koda dokunma).
//
// Apps Script paritesi: Notion fail → MailerLite başarılıysa kullanıcı yine
// success görür (KARAR 123). Hatalar Logger benzeri stdout'a düşer.
import { notion, NOTION_BASVURULAR_DB } from './notion.ts';

export const EMAIL_RE = /^[\x20-\x7E]+@[\x20-\x7E]+\.[\x20-\x7E]+$/;

const MAILERLITE_API_KEY = import.meta.env.MAILERLITE_API_KEY ?? '';

export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

export type MailerLiteSonuc = {
  ok: boolean;
  status: number;
  error?: string;
};

/**
 * MailerLite subscribers endpoint'ine email + opsiyonel field'larla ekle.
 * Idempotent: zaten varsa MailerLite 200, yeniyse 201 döner — bu fonksiyon
 * ayrımı dışarı vermez (subscriberState taşıma ayrı KARAR'da, brief Bölüm 1).
 */
export async function mailerLiteEkle(args: {
  email: string;
  groupId: string;
  fields?: Record<string, string | undefined>;
}): Promise<MailerLiteSonuc> {
  if (!MAILERLITE_API_KEY) return { ok: false, status: 0, error: 'no-api-key' };
  const fields: Record<string, string> = {};
  if (args.fields) {
    for (const [k, v] of Object.entries(args.fields)) {
      if (v && v.trim()) fields[k] = v;
    }
  }
  try {
    const res = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${MAILERLITE_API_KEY}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        email: args.email,
        fields,
        groups: [args.groupId],
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      return { ok: false, status: res.status, error: text.slice(0, 200) };
    }
    return { ok: true, status: res.status };
  } catch (err) {
    return { ok: false, status: 0, error: String(err).slice(0, 200) };
  }
}

/**
 * Notion Başvurular DB'ye satır yaz. `properties` Notion API formatında
 * birebir geçer (caller property eşlemesini kontrol eder — Apps Script
 * handler'larında her form farklı property set'i kullanır).
 *
 * Hata yutulmaz: caller yakalar; brief Apps Script paritesi gereği iletişim
 * formunda Notion fail ML'siz akışta error response'a düşer (handleIletisim
 * uyumlu). Ateş Mektupları'nda Notion yazılmıyor (brief: yeni davranış,
 * ML-only).
 */
export async function notionBasvuruYaz(
  properties: Record<string, unknown>,
): Promise<string> {
  const result = await notion.pages.create({
    parent: { database_id: NOTION_BASVURULAR_DB },
    properties: properties as never,
  });
  return result.id;
}
