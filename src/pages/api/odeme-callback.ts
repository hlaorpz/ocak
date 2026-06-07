// /api/odeme-callback — Ödeme sağlayıcısı callback'i (Brief: brief-odeme-
// asama3b-provider-mock.md ADIM 3c). Mock şu an; iyzico Aşama 6'da bu
// endpoint'in imzasını + body shape'ini paylaşacak (sadece imza doğrulama
// + provider-specific field eşleme eklenir).
//
// İŞ DİSİPLİNİ:
//  - Kayıtlar pending satırını Ödendi'ye çeker (`Ödenen Tutar` + `Ödeme
//    Tarihi` + `Ödeme Durumu`=Ödendi).
//  - Mock checkout'tan geldiyse `mock=1` query → Notlar'a "MOCK ödeme"
//    damgası (Brief MOCK güvenliği — yanlışlıkla prod'da mock kalırsa
//    Notion'da görünür).
//  - **`kodKullanimArtir(client, kodId)` BURADA çağrılır — sayaç artırımının
//    İLK ve TEK noktası.** kodId pending satırla birlikte URL'den geldi.
//    Kullanılan promo varsa sayaç +1. Hata olursa kayıt yine başarılı sayılır
//    (sayaç defansif — gerçek tahsilat öncelikli).
//  - Başarı → /odeme/tamam, iptal/hata → /odeme/iptal redirect.
//
// Mock akış: GET (URL query → /odeme/tamam yönlendirme) ve POST (form
// submit) ikisi de desteklenir; iyzico genelde POST webhook + GET dönüş
// kullanır, ikisini de hazırlayalım.
import type { APIRoute } from 'astro';
import { notion } from '../../lib/notion.ts';
import { kodKullanimArtir } from '../../lib/kodlar.ts';

export const prerender = false;

function redirect(url: string): Response {
  return new Response(null, { status: 302, headers: { Location: url } });
}

async function odemeyiOnayla(args: {
  basvuruId: string;
  tutar: number;
  mockMu: boolean;
  kodId?: string;
}): Promise<{ ok: boolean; error?: string; kodArtimi?: number }> {
  const { basvuruId, tutar, mockMu, kodId } = args;
  const properties: Record<string, any> = {
    'Ödeme Durumu': { select: { name: 'Ödendi' } },
    'Ödenen Tutar': { number: tutar },
    'Ödeme Tarihi': { date: { start: new Date().toISOString().slice(0, 10) } },
  };
  if (mockMu) {
    properties['Notlar'] = {
      rich_text: [
        {
          text: { content: `MOCK ödeme — ${new Date().toISOString()} (Brief Aşama 3b)` },
        },
      ],
    };
  }
  try {
    await notion.pages.update({ page_id: basvuruId, properties });
  } catch (err) {
    return { ok: false, error: String(err).slice(0, 200) };
  }

  // Promo sayaç artırımı — İLK ve TEK çağrı noktası. Hata defansif: ödeme
  // başarılı sayılır, sayaç kaymış olur (Kaan manuel düzeltir).
  let kodArtimi: number | undefined;
  if (kodId) {
    try {
      kodArtimi = await kodKullanimArtir(notion, kodId);
    } catch {
      kodArtimi = undefined;
    }
  }
  return { ok: true, kodArtimi };
}

function parseGirdi(url: URL, bodyParams: URLSearchParams | null) {
  const get = (k: string) =>
    bodyParams?.get(k) ?? url.searchParams.get(k) ?? '';
  return {
    basvuruId: get('ref'),
    tutarRaw: get('tutar'),
    sonuc: (get('sonuc') || 'basari').toLowerCase(),
    mockMu: get('mock') === '1' || url.searchParams.get('mock') === '1',
    kodId: get('kodId') || undefined,
  };
}

async function handle(request: Request): Promise<Response> {
  const url = new URL(request.url);
  let bodyParams: URLSearchParams | null = null;
  if (request.method === 'POST') {
    const ct = request.headers.get('content-type') ?? '';
    if (ct.includes('application/x-www-form-urlencoded')) {
      const text = await request.text();
      bodyParams = new URLSearchParams(text);
    } else if (ct.includes('application/json')) {
      try {
        const json = await request.json();
        bodyParams = new URLSearchParams(
          Object.entries(json as Record<string, unknown>)
            .filter(([, v]) => v !== undefined && v !== null)
            .map(([k, v]) => [k, String(v)]),
        );
      } catch {
        bodyParams = null;
      }
    }
  }
  const girdi = parseGirdi(url, bodyParams);
  const baseUrl = url.origin;

  if (!girdi.basvuruId) {
    return redirect(`${baseUrl}/odeme/iptal?hata=ref-yok`);
  }
  if (girdi.sonuc !== 'basari') {
    return redirect(`${baseUrl}/odeme/iptal?ref=${encodeURIComponent(girdi.basvuruId)}`);
  }
  const tutar = Number(girdi.tutarRaw);
  if (!Number.isFinite(tutar) || tutar < 0) {
    return redirect(`${baseUrl}/odeme/iptal?ref=${encodeURIComponent(girdi.basvuruId)}&hata=tutar`);
  }

  const sonuc = await odemeyiOnayla({
    basvuruId: girdi.basvuruId,
    tutar,
    mockMu: girdi.mockMu,
    kodId: girdi.kodId,
  });
  if (!sonuc.ok) {
    // Notion update başarısız → kullanıcıya iptal göster, Kaan Notlar'dan
    // tespit eder (mock damgası yok ama Beklemede kalır).
    return redirect(
      `${baseUrl}/odeme/iptal?ref=${encodeURIComponent(girdi.basvuruId)}&hata=notion`,
    );
  }
  // Başarı — success sayfasına yönlendir. ref'i + (varsa) mock işaretini taşı.
  const basariUrl = new URL(`${baseUrl}/odeme/tamam`);
  basariUrl.searchParams.set('ref', girdi.basvuruId);
  if (girdi.mockMu) basariUrl.searchParams.set('mock', '1');
  return redirect(basariUrl.toString());
}

export const GET: APIRoute = ({ request }) => handle(request);
export const POST: APIRoute = ({ request }) => handle(request);
