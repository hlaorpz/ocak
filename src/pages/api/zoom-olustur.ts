// /api/zoom-olustur — Notion automation webhook → Zoom oda yaratıcı
// Brief: brief-zoom-otomasyon-v3.md
//
// Akış: x-ocak-secret doğrula → payload'dan page ID yakala → Notion pages.retrieve →
// guard'lar (Statü="Kayıt Açık", Mekân/Platform="Online", Katılım Linki boş) →
// zoomMeetingOlustur → pages.update Katılım Linki rich_text → 200+created.
//
// İdempotanslık: Katılım Linki dolu guard → ikinci tetik ikinci oda yaratmaz (KARAR 104).
// Guard skip'leri 200+{status:'skipped'} döner — Notion automation HATA görmesin diye.
import type { APIRoute } from 'astro';
import { notion } from '../../lib/notion.ts';
import { zoomMeetingOlustur, ZoomError } from '../../lib/zoom.ts';

export const prerender = false;

const WEBHOOK_SECRET = import.meta.env.ZOOM_WEBHOOK_SECRET;

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

/**
 * Notion automation webhook gövdesi formatı belirsiz (0c) — page ID birkaç olası
 * alanda gelebilir. Tek karakter sapması = sessiz fail, defansif yakalama.
 */
function pageIdYakala(payload: unknown): string | null {
  if (!payload || typeof payload !== 'object') return null;
  const p = payload as Record<string, any>;
  const candidates: unknown[] = [
    p.data?.id,
    p.data?.page_id,
    p.entity?.id,
    p.source?.id,
    p.page?.id,
    p.page_id,
    p.id,
  ];
  for (const c of candidates) {
    if (typeof c === 'string' && c.length > 0) return c;
  }
  return null;
}

type Properties = Record<string, any>;

function selectName(props: Properties, name: string): string {
  return props[name]?.select?.name ?? '';
}

function richTextPlain(props: Properties, name: string): string {
  return (props[name]?.rich_text ?? [])
    .map((t: any) => t.plain_text ?? '')
    .join('')
    .trim();
}

function titlePlain(props: Properties, name: string): string {
  return (props[name]?.title ?? [])
    .map((t: any) => t.plain_text ?? '')
    .join('')
    .trim();
}

function dateStart(props: Properties, name: string): string {
  return props[name]?.date?.start ?? '';
}

/**
 * Tarih (YYYY-MM-DD) + Saat (HH:MM, opsiyonel) → ISO "YYYY-MM-DDTHH:MM:SS"
 * (timezone Zoom payload'unda ayrı). Saat boşsa 00:00 default — Zoom scheduled
 * meeting bir başlangıç bekler; saat eksikse kullanıcı Notion'da düzeltir.
 *
 * Notion date "2026-06-21T18:00:00.000+03:00" gibi de gelebilir; sadece YYYY-MM-DD
 * almak için ilk 10 karakter kesilir.
 */
function startTimeBirlestir(tarih: string, saat: string): string {
  const gun = tarih.slice(0, 10); // YYYY-MM-DD
  const s = saat.trim();
  // HH:MM eşle (HH veya H:MM kabul); değilse 00:00
  const m = s.match(/^(\d{1,2}):(\d{2})/);
  if (!m) return `${gun}T00:00:00`;
  const hh = m[1].padStart(2, '0');
  const mm = m[2];
  return `${gun}T${hh}:${mm}:00`;
}

export const POST: APIRoute = async ({ request }) => {
  // 1. Secret
  const secret = request.headers.get('x-ocak-secret');
  if (!WEBHOOK_SECRET || secret !== WEBHOOK_SECRET) {
    return json({ status: 'unauthorized' }, 401);
  }

  // 2. Payload + page ID
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return json({ status: 'error', message: 'JSON parse hatası' }, 400);
  }
  const pageId = pageIdYakala(payload);
  if (!pageId) {
    return json({ status: 'error', message: 'page ID payload\'da bulunamadı' }, 400);
  }

  // 3. Notion etkinliği oku
  let page: any;
  try {
    page = await notion.pages.retrieve({ page_id: pageId });
  } catch (err) {
    return json(
      { status: 'error', message: 'Notion pages.retrieve başarısız', detay: String(err).slice(0, 200) },
      500,
    );
  }
  const props: Properties = ('properties' in page ? page.properties : {}) as Properties;

  // 4. Guard'lar — Notion'a hata DÖNDÜRME, 200+skipped (idempotanslık)
  const statu = selectName(props, 'Statü');
  if (statu !== 'Kayıt Açık') {
    return json({ status: 'skipped', reason: `Statü="${statu}" (Kayıt Açık değil)` });
  }
  const mekan = selectName(props, 'Mekân/Platform');
  if (mekan !== 'Online') {
    return json({ status: 'skipped', reason: `Mekân/Platform="${mekan}" (Online değil)` });
  }
  const mevcutLink = richTextPlain(props, 'Katılım Linki');
  if (mevcutLink.length > 0) {
    return json({ status: 'skipped', reason: 'Katılım Linki dolu (idempotanslık)' });
  }

  // 5. Meeting yarat
  const topic = titlePlain(props, 'Başlık');
  const tarih = dateStart(props, 'Tarih');
  // Brief Katman 1: saat kaynağı artık "Zoom Başlangıç Saati" (Kaan elle "20:00"
  // girer). Boşsa fallback 00:00 ama console.warn — sessizce düşme.
  const zoomSaat = richTextPlain(props, 'Zoom Başlangıç Saati');
  if (!zoomSaat) {
    // eslint-disable-next-line no-console
    console.warn(`[zoom-olustur] Zoom Başlangıç Saati boş: "${topic}" — 00:00 fallback`);
  }
  if (!topic || !tarih) {
    return json(
      { status: 'error', message: 'Başlık veya Tarih boş — meeting yaratılamaz', topic, tarih },
      400,
    );
  }
  const startTime = startTimeBirlestir(tarih, zoomSaat);

  let meeting: { join_url: string; meeting_id: number; password: string };
  try {
    meeting = await zoomMeetingOlustur({ topic, startTime });
  } catch (err) {
    if (err instanceof ZoomError) {
      return json(
        { status: 'error', message: 'Zoom meeting yaratılamadı', kind: err.kind, zoomStatus: err.status, body: err.body.slice(0, 300) },
        500,
      );
    }
    return json({ status: 'error', message: 'Zoom helper hatası', detay: String(err).slice(0, 200) }, 500);
  }

  // 6. Notion Katılım Linki + Zoom Şifresi yaz (Brief Katman 1).
  // İkisi tek update'te — idempotanslık guard'ı Katılım Linki üzerinde,
  // şifre o sebeple ayrı yarıya düşmez.
  try {
    await notion.pages.update({
      page_id: pageId,
      properties: {
        'Katılım Linki': {
          rich_text: [{ text: { content: meeting.join_url } }],
        },
        'Zoom Şifresi': {
          rich_text: [{ text: { content: meeting.password } }],
        },
      },
    });
  } catch (err) {
    return json(
      { status: 'error', message: 'Notion pages.update başarısız', detay: String(err).slice(0, 200), join_url: meeting.join_url },
      500,
    );
  }

  return json({
    status: 'created',
    join_url: meeting.join_url,
    meeting_id: meeting.meeting_id,
    password_set: meeting.password.length > 0,
  });
};
