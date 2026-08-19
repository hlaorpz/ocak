// /api/odeme-callback — Ödeme sağlayıcısı callback'i (Brief: brief-odeme-
// asama3b-provider-mock.md ADIM 3c). Mock şu an; PayTR Aşama 6'da bu
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
// submit) ikisi de desteklenir; PayTR genelde POST webhook + GET dönüş
// kullanır, ikisini de hazırlayalım.
import type { APIRoute } from 'astro';
import { notion } from '../../lib/notion.ts';
import { kodKullanimArtir } from '../../lib/kodlar.ts';
import { publicOrigin } from '../../lib/public-origin.ts';
// KARAR 488 — kart akışı env anahtarıyla kapalı; callback 410 döner.
import { KART_AKISI_ACIK } from '../../lib/kart-akisi.ts';

export const prerender = false;

function redirect(url: string): Response {
  return new Response(null, { status: 302, headers: { Location: url } });
}

async function odemeyiOnayla(args: {
  basvuruId: string;
  tutar: number;
  mockMu: boolean;
  kodId?: string;
}): Promise<{ ok: boolean; error?: string; kodArtimi?: number; kodAdi?: string }> {
  const { basvuruId, tutar, mockMu, kodId } = args;

  // Aşama 3b-fix ADIM 2 — kodId varsa Kodlar'dan kod adını al (Kayıtlar.
  // Kullanılan Kod rich_text alanına yazılacak). Tek Notion update'te dahil
  // edelim ki ekstra round-trip olmasın. Retrieve hata defansif (sayaç +
  // ödeme onayı yine başarılı).
  let kodAdi: string | undefined;
  if (kodId) {
    try {
      const kodPage = await notion.pages.retrieve({ page_id: kodId });
      const props = ('properties' in kodPage ? kodPage.properties : {}) as Record<string, any>;
      const title = props['Kod']?.title ?? [];
      const txt = title.map((t: any) => t.plain_text ?? '').join('').trim();
      if (txt) kodAdi = txt;
    } catch (err) {
      console.error('[odeme-callback] kod retrieve hatası:', String(err).slice(0, 200));
    }
  }

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
  if (kodAdi) {
    properties['Kullanılan Kod'] = {
      rich_text: [{ text: { content: kodAdi } }],
    };
  }
  try {
    await notion.pages.update({ page_id: basvuruId, properties });
  } catch (err) {
    return { ok: false, error: String(err).slice(0, 200) };
  }

  // Aşama 3b-fix ADIM 2 — promo sayaç artırımı; İLK ve TEK çağrı noktası.
  // Defansif log: kodId yoksa promo'suz kayıt, kodId varsa çağrı sonucu
  // (kodArtimi yeni değer veya hata mesajı). Eyeball'da "sayaç artmadı"
  // raporu için Vercel runtime log'unda izlenebilir.
  let kodArtimi: number | undefined;
  if (kodId) {
    try {
      kodArtimi = await kodKullanimArtir(notion, kodId);
      console.log(`[odeme-callback] kodKullanimArtir OK — kodId=${kodId} kod="${kodAdi ?? '?'}" yeniSayac=${kodArtimi}`);
    } catch (err) {
      console.error('[odeme-callback] kodKullanimArtir hatası:', String(err).slice(0, 200));
    }
  } else {
    console.log(`[odeme-callback] kodId YOK — promo'suz kayıt, sayaç artırılmadı`);
  }
  return { ok: true, kodArtimi, kodAdi };
}

function parseGirdi(url: URL, bodyParams: URLSearchParams | null) {
  const get = (k: string) =>
    bodyParams?.get(k) ?? url.searchParams.get(k) ?? '';
  // Aşama 3b-fix tasarım: ref=OCAK-XXXXX (kullanıcıya görünür, success'e),
  // pageId=Notion UUID (pages.update için). Eski mock URL'sinde pageId yok
  // → ref'i basvuruId saymıştık; backward-compat fallback.
  const refSuccess = get('ref');
  const pageId = get('pageId') || refSuccess;
  return {
    basvuruId: pageId,
    refSuccess,
    tutarRaw: get('tutar'),
    sonuc: (get('sonuc') || 'basari').toLowerCase(),
    mockMu: get('mock') === '1' || url.searchParams.get('mock') === '1',
    kodId: get('kodId') || undefined,
  };
}

async function handle(request: Request): Promise<Response> {
  // KARAR 488 — kart akışı kapalı. 410 Gone: endpoint vardı, artık yok; 404
  // "hiç olmadı" der ve bir sağlayıcı webhook'unu yanlış yönlendirir.
  // Gövde HİÇ okunmaz, Notion'a TEK yazım yapılmaz, `kodKullanimArtir`
  // çağrılmaz — kapalı akıştan gelen bir callback sayaç artıramaz.
  if (!KART_AKISI_ACIK) {
    console.warn('[odeme-callback] KARAR 488 — kart akışı kapalı, callback reddedildi (410)');
    return new Response('Kart ödeme akışı kapalı.', { status: 410 });
  }

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
  // Aşama 3b eyeball Bulgu 4 — redirect base URL Vercel x-forwarded-*
  // header'larından (request.url Vercel'de internal/localhost). Bulgu 1
  // ile aynı kök; ortak helper.
  const baseUrl = publicOrigin(request);

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
  // Aşama 3b-fix tasarım — başarı: success sayfasına refSuccess (OCAK-XXXXX)
  // taşınır. Notion UUID (basvuruId) sadece pages.update için kullanıldı;
  // success'te göstermiyoruz (ham UUID kullanıcıya anlamsız).
  const basariUrl = new URL(`${baseUrl}/odeme/tamam`);
  basariUrl.searchParams.set('ref', girdi.refSuccess || girdi.basvuruId);
  if (girdi.mockMu) basariUrl.searchParams.set('mock', '1');
  return redirect(basariUrl.toString());
}

export const GET: APIRoute = ({ request }) => handle(request);
export const POST: APIRoute = ({ request }) => handle(request);
