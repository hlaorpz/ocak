// /api/promo-dogrula — Notion Kodlar DB indirim kodu canlı doğrulama
// (Brief: brief-odeme-asama3a-promo-aski-backend.md ADIM 1).
//
// Neden ayrı endpoint: client'tan Notion token geçemez. Form `KayitFormu` promo
// input'una blur/debounce'ta buraya POST atar; indirim slot DOM'da hazır
// (Aşama 2 yapısı) — yanıt geldiğinde anında doldurur.
//
// İŞ DİSİPLİNİ — `kodKullanimArtir` BURADA ÇAĞRILMAZ:
//   Kişi kodu deneyip vazgeçerse limit yanmasın. Sayaç artırımı ödeme
//   ONAYLANINCA çağrılır (Aşama 3b mock callback / havale eşleştirme anı).
//   Bu kritik — değişirse kodlar limit dolu görünür, kullanıcı kapı dışı kalır.
import type { APIRoute } from 'astro';
import { notion } from '../../lib/notion.ts';
import { kodDogrula } from '../../lib/kodlar.ts';

export const prerender = false;

const NOTION_KODLAR_DB = import.meta.env.NOTION_KODLAR_DB_ID ?? '';

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

type PromoBody = {
  kod?: string;
  format?: string;
  tutar?: number;
};

export const POST: APIRoute = async ({ request }) => {
  let body: PromoBody;
  try {
    body = (await request.json()) as PromoBody;
  } catch {
    return json({ status: 'error', message: 'JSON parse hatası' }, 400);
  }

  if (!body.kod || typeof body.kod !== 'string' || !body.kod.trim()) {
    return json({ status: 'error', message: 'kod zorunlu' }, 400);
  }
  if (!body.format || typeof body.format !== 'string') {
    return json({ status: 'error', message: 'format zorunlu' }, 400);
  }
  const tutar = Number(body.tutar);
  if (!Number.isFinite(tutar) || tutar < 0) {
    return json({ status: 'error', message: 'tutar geçersiz' }, 400);
  }

  if (!NOTION_KODLAR_DB) {
    return json(
      { status: 'error', message: 'NOTION_KODLAR_DB_ID env tanımlı değil' },
      500,
    );
  }

  try {
    const sonuc = await kodDogrula(notion, NOTION_KODLAR_DB, body.kod, body.format, tutar);
    return json(sonuc);
  } catch (err) {
    return json(
      { status: 'error', message: 'doğrulama hatası', detay: String(err).slice(0, 200) },
      500,
    );
  }
};
