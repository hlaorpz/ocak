// /api/mektup-katil — Ateş Mektupları tek dokunuş (İŞ 5, 7 Eki).
//
// ── İSTEMCİ E-POSTA GÖNDERMEZ ──
// Gövde yalnız `{ kayitId, imza }` taşır. Adresi SUNUCU Notion'dan okur. Tersi
// kurgu (istemciden e-posta almak) bu bloğu `/api/form`'un ikizi yapardı ve
// kadının zaten verdiği adresi ikinci kez istemek anlamsızdı.
//
// ── İMZA ──
// `Kayıt ID` dört karakterlik bir gövde taşıyor ve tahmin edilebilir. İmzasız
// bir uç, kayıtlı adreslerin bültene RIZASI OLMADAN eklenmesine açık olurdu.
// Kapı `/odeme/devam`'ın HMAC'i — aynı sır, aynı doğrulayıcı. Sayfa imzayı
// sunucuda üretip bloğa veriyor; istemci sırrı görmüyor.
//
// ── YALNIZ TIKLAMAYLA ──
// Bu uç kendiliğinden hiçbir şey yapmaz; kayıt akışı onu ÇAĞIRMAZ. Tek
// tetikleyici kadının düğmeye dokunması.
//
// ⚠ Log'da e-posta GEÇMEZ — `Kayıt ID` yeter (CLAUDE.md §8).
import type { APIRoute } from 'astro';
import { notion, NOTION_KAYITLAR_DB } from '../../lib/notion.ts';
import { originMuhafizi } from '../../lib/origin-muhafiz.ts';
import { odemeLinkiGecerli, odemeLinkSirri } from '../../lib/odeme-link.ts';
import { ATES_MEKTUPLARI_GROUP_ID, type MektupSonuc } from '../../lib/mektup.ts';

export const prerender = false;

const MAILERLITE_API_KEY = import.meta.env.MAILERLITE_API_KEY ?? '';

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

/**
 * MailerLite grup ekleme. Yalnız `email` + `groups` — custom field YAZILMAZ:
 * bu bir bülten katılımı, etkinlik verisi değil ve abonenin mevcut alanlarına
 * dokunmak o kaydın başka bir yüzeyde söylediğini bozardı (B211'in öğrendiği
 * ders: abone tek, alanlar paylaşımlı).
 */
async function mailerLiteGrubaEkle(email: string): Promise<boolean> {
  if (!MAILERLITE_API_KEY) {
    console.error('[mektup-katil] MAILERLITE_API_KEY boş');
    return false;
  }
  try {
    const res = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${MAILERLITE_API_KEY}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ email, groups: [ATES_MEKTUPLARI_GROUP_ID] }),
    });
    if (!res.ok) {
      const metin = await res.text();
      console.error(`[mektup-katil] MailerLite HTTP ${res.status} ${metin.slice(0, 200)}`);
      return false;
    }
    return true;
  } catch (err) {
    console.error(`[mektup-katil] MailerLite çağrısı düştü: ${String(err).slice(0, 200)}`);
    return false;
  }
}

/** Kayıtlar satırından e-posta. Sorgu `Kayıt ID` TITLE alanı üzerinden. */
async function emailOku(kayitId: string): Promise<string> {
  const sorgu = await notion.databases.query({
    database_id: NOTION_KAYITLAR_DB,
    filter: { property: 'Kayıt ID', title: { equals: kayitId } },
    page_size: 1,
  });
  const satir = sorgu.results[0];
  if (!satir || !('properties' in satir)) return '';
  const p = satir.properties as Record<string, any>;
  return (p['Email']?.email ?? '').trim();
}

export const POST: APIRoute = async ({ request }) => {
  // Origin muhafızı en başta — gövde bile okunmaz (`/api/kayit` deseni).
  const originRet = originMuhafizi(request);
  if (originRet) return originRet;

  let govde: { kayitId?: string; imza?: string };
  try {
    govde = (await request.json()) as { kayitId?: string; imza?: string };
  } catch {
    return json({ ok: false, sebep: 'imza' } satisfies MektupSonuc, 400);
  }

  const kayitId = (govde.kayitId ?? '').trim();
  const imza = (govde.imza ?? '').trim();

  // ⚠ İMZA EN BAŞTA, Notion'a dokunmadan. Doğrulanmamış bir isteğe bizim
  // adımıza sorgu yaptırmak, `/odeme/devam`'ın da kaçındığı şey.
  if (!odemeLinkiGecerli(kayitId, imza, odemeLinkSirri())) {
    // Sebep YALNIZ log'a; gövde tek cümleye düşüyor.
    console.warn(`[mektup-katil] imza tutmadı — kayitId="${kayitId}"`);
    return json({ ok: false, sebep: 'imza' } satisfies MektupSonuc, 401);
  }

  if (!NOTION_KAYITLAR_DB) {
    console.error('[mektup-katil] NOTION_KAYITLAR_DB tanımsız');
    return json({ ok: false, sebep: 'yapilandirma' } satisfies MektupSonuc, 500);
  }

  let email: string;
  try {
    email = await emailOku(kayitId);
  } catch (err) {
    console.error(`[mektup-katil] Notion okunamadı — kayitId=${kayitId} ${String(err).slice(0, 200)}`);
    return json({ ok: false, sebep: 'kayit-yok' } satisfies MektupSonuc, 502);
  }
  if (!email) {
    console.warn(`[mektup-katil] kayıtta e-posta yok — kayitId=${kayitId}`);
    return json({ ok: false, sebep: 'email-yok' } satisfies MektupSonuc, 404);
  }

  const eklendi = await mailerLiteGrubaEkle(email);
  if (!eklendi) {
    return json({ ok: false, sebep: 'mailerlite' } satisfies MektupSonuc, 502);
  }

  console.log(`[mektup-katil] OK — kayitId=${kayitId}`);
  return json({ ok: true } satisfies MektupSonuc);
};
