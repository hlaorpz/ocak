// /api/odeme-callback — Ödeme sağlayıcısı callback'i (Brief: brief-odeme-
// asama3b-provider-mock.md ADIM 3c). Sağlayıcıdan bağımsız: imza doğrulaması
// sağlayıcı arayüzünde yaşar (`dogrulaCallback`, KARAR 395), bu dosya yalnız
// "geçerli mi" diye sorar.
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
// GET (URL query → /odeme/tamam yönlendirme) ve POST (form submit) ikisi de
// desteklenir: mock GET kullanır, N-Kolay dönüşü POST eder.
import type { APIRoute } from 'astro';
import { notion, NOTION_KAYITLAR_DB } from '../../lib/notion.ts';
// Tutar + replay muhafızı kaydı imza kapsamındaki referanstan çözer (11 Eyl).
import { kayitOku } from '../../lib/odeme-kayit-oku.ts';
import { kodKullanimArtir } from '../../lib/kodlar.ts';
import { publicOrigin } from '../../lib/public-origin.ts';
// KARAR 488 — kart akışı env anahtarıyla kapalı; callback 410 döner.
import { KART_AKISI_ACIK } from '../../lib/kart-akisi.ts';
// İŞ 2 — callback doğrulaması sağlayıcı arayüzünde yaşar (KARAR 395).
import { getPaymentProvider, type CallbackDogrulama } from '../../lib/payment-provider.ts';

export const prerender = false;

function redirect(url: string): Response {
  return new Response(null, { status: 302, headers: { Location: url } });
}

async function odemeyiOnayla(args: {
  basvuruId: string;
  tutar: number;
  mockMu: boolean;
  kodId?: string;
  /** Replay kilidi — `İşlem No` alanına yazılır, ikinci dönüş burada takılır. */
  islemNo?: string;
}): Promise<{ ok: boolean; error?: string; kodArtimi?: number; kodAdi?: string }> {
  const { basvuruId, tutar, mockMu, kodId, islemNo } = args;

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
  // Replay kilidi BURADA kapanır: bir sonraki dönüş bu alanı dolu bulur ve
  // `handle()` 401 döner. Yazım ödeme onayıyla AYNI `pages.update` çağrısında
  // — ayrı çağrı olsaydı ikisinin arasında ikinci bir dönüş geçebilirdi.
  if (islemNo) {
    properties['İşlem No'] = { rich_text: [{ text: { content: islemNo } }] };
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
  // ⚠ **`basvuruId`, `refSuccess` ve `tutarRaw` ARTIK TÜKETİLMİYOR** (11 Eyl,
  // tutar+replay turu). Kayıt ve tutar imza kapsamındaki `dogrulama`dan
  // geliyor; query'den okumak, imzanın koruduğu şeyi imzasız alana
  // devretmek olurdu. Alanlar SİLİNMEDİ (KARAR 61) ama okunmuyor —
  // **yeniden kullanmadan önce durup düşün:** bu üçü çağıranın serbestçe
  // yazabildiği değerlerdir. Hâlâ tüketilenler: `sonuc` · `mockMu` · `kodId`.
  //
  // Aşama 3b-fix tasarım: ref=OCAK-XXXX (kullanıcıya görünür, success'e),
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
  // İŞ 2 (10 Eyl 2026) — KİMLİK DOĞRULAMASI. Buraya kadar gövde yalnız
  // AYRIŞTIRILDI; hiçbir Notion çağrısı yapılmadı, `kodKullanimArtir`
  // çağrılmadı. Doğrulama geçmezse 401 ile burada biter.
  //
  // KARAR 395 — route sağlayıcı ADI sormaz, `if (provider === 'nkolay')`
  // yazmaz. Yalnız "geçerli mi" diye sorar; cevabı sağlayıcı bilir.
  // N-Kolay onayı gelince bu blok DEĞİŞMEZ.
  let dogrulama: CallbackDogrulama;
  try {
    dogrulama = getPaymentProvider().dogrulaCallback(request, bodyParams);
  } catch (err) {
    // `getPaymentProvider()` bilinmeyen/yazılmamış sağlayıcıda throw eder.
    // Yanlış yapılandırılmış bir ödeme yüzeyi 500 değil 401 vermeli:
    // doğrulanamayan istek geçemez. 500 hem gürültü hem yarı-açık bir hâl.
    console.error('[odeme-callback] sağlayıcı çözülemedi:', String(err).slice(0, 200));
    dogrulama = { gecerli: false, sebep: 'saglayici-cozulemedi' };
  }
  if (!dogrulama.gecerli) {
    // `sebep` YALNIZ log'a. 401 gövdesine yazmak, deneyen birine hangi
    // yönde ilerleyeceğini söylemek olurdu.
    console.warn(`[odeme-callback] callback doğrulanamadı (401) — sebep=${dogrulama.sebep}`);
    return new Response('Callback doğrulanamadı.', { status: 401 });
  }

  const girdi = parseGirdi(url, bodyParams);
  // Aşama 3b eyeball Bulgu 4 — redirect base URL Vercel x-forwarded-*
  // header'larından (request.url Vercel'de internal/localhost). Bulgu 1
  // ile aynı kök; ortak helper.
  const baseUrl = publicOrigin(request);

  // ────────────────────────────────────────────────────────────────────────
  // TUTAR + REPLAY MUHAFIZI (11 Eyl 2026, ikinci tur)
  //
  // Buraya kadar yalnız İMZA doğrulandı: "bu dönüş gerçekten sağlayıcıdan
  // geldi." Bu üç kapı ayrı bir soruya bakar: "geldiği yer doğru olsa bile,
  // DOĞRU KAYDA, DOĞRU TUTARDA ve İLK KEZ mi geliyor?"
  //
  // ⚠ Kayıt `dogrulama.referansKodu`'ndan çözülür — query `pageId` YOK
  // SAYILIR. Query imza kapsamında değil; dönüş POST'unu kullanıcının
  // tarayıcısı gönderdiği için oradan kayıt çözmek, imzanın koruduğu şeyi
  // imzasız alana devretmek olurdu.
  //
  // KARAR 395 korunuyor: route sağlayıcı ADINA dallanmaz. Üç alanı da
  // arayüz veriyor (`CallbackDogrulama`), sağlayıcı kendi imza kapsamından
  // dolduruyor.
  if (!dogrulama.referansKodu) {
    console.warn('[odeme-callback] doğrulama referans taşımıyor (401) — kayıt çözülemez');
    return new Response('Callback doğrulanamadı.', { status: 401 });
  }
  const kayit = await kayitOku(notion, NOTION_KAYITLAR_DB, dogrulama.referansKodu);
  if (kayit.durum !== 'bulundu' || !kayit.pageId) {
    console.warn(
      `[odeme-callback] kayıt çözülemedi (401) — ref=${dogrulama.referansKodu} durum=${kayit.durum}`,
    );
    return new Response('Callback doğrulanamadı.', { status: 401 });
  }
  // ⚠ REPLAY: alan doluysa bu kayıt zaten bir ödemeyle kapanmış. İkinci
  // dönüş — aynı gövdenin tekrarı ya da ikinci bir çekim — kabul edilmez.
  if (kayit.islemNo) {
    console.warn(
      `[odeme-callback] replay reddedildi (401) — ref=${dogrulama.referansKodu} ` +
        `mevcut İşlem No dolu, gelen=${dogrulama.islemNo ?? '(yok)'}`,
    );
    return new Response('Callback doğrulanamadı.', { status: 401 });
  }
  // ⚠ FAIL-CLOSED ve SESSİZ DEĞİL (Kaan, 11 Eyl): `Beklenen Tutar` yazımı
  // `54599ea` ile geldi; ondan önce açılmış pending satırlarda alan BOŞ.
  // Kıyas yapılamıyorsa ödeme onaylanmaz — ama sessiz red "para alındı,
  // kayıt Beklemede, iz yok" demek olurdu. Log referansı taşır.
  if (!(kayit.tutar > 0)) {
    console.error(
      `[odeme-callback] Beklenen Tutar boş, kıyas yapılamadı (401) — ` +
        `ref=${dogrulama.referansKodu} pageId=${kayit.pageId} gelen tutar=${dogrulama.tutar ?? '(yok)'}`,
    );
    return new Response('Callback doğrulanamadı.', { status: 401 });
  }
  // Yetkilendirilen tutar beklenenin ALTINDAysa reddet. Üstü kabul edilir:
  // taksit/komisyon farkı sağlayıcı tarafında tutarı yukarı çekebilir ve
  // fazla tahsilatı reddetmek kadını ödemiş ama kaydı kapanmamış bırakırdı.
  if (!(typeof dogrulama.tutar === 'number') || dogrulama.tutar < kayit.tutar) {
    console.warn(
      `[odeme-callback] tutar düşük (401) — ref=${dogrulama.referansKodu} ` +
        `beklenen=${kayit.tutar} gelen=${dogrulama.tutar ?? '(yok)'}`,
    );
    return new Response('Callback doğrulanamadı.', { status: 401 });
  }

  if (girdi.sonuc !== 'basari') {
    return redirect(`${baseUrl}/odeme/iptal?ref=${encodeURIComponent(dogrulama.referansKodu)}`);
  }

  const sonuc = await odemeyiOnayla({
    // ⚠ Notion UUID artık query'den DEĞİL, imza kapsamındaki referansla
    // çözülen kayıttan geliyor.
    basvuruId: kayit.pageId,
    // Kaydedilen tutar da imza kapsamından — query `tutar` artık okunmuyor.
    tutar: dogrulama.tutar,
    mockMu: girdi.mockMu,
    kodId: girdi.kodId,
    islemNo: dogrulama.islemNo,
  });
  if (!sonuc.ok) {
    // Notion update başarısız → kullanıcıya iptal göster, Kaan Notlar'dan
    // tespit eder (mock damgası yok ama Beklemede kalır).
    return redirect(
      `${baseUrl}/odeme/iptal?ref=${encodeURIComponent(dogrulama.referansKodu)}&hata=notion`,
    );
  }
  // Aşama 3b-fix tasarım — başarı: success sayfasına refSuccess (OCAK-XXXX)
  // taşınır. Notion UUID (basvuruId) sadece pages.update için kullanıldı;
  // success'te göstermiyoruz (ham UUID kullanıcıya anlamsız).
  const basariUrl = new URL(`${baseUrl}/odeme/tamam`);
  // Referans imza kapsamından; `/odeme/tamam` onu `equals` ile arıyor.
  basariUrl.searchParams.set('ref', dogrulama.referansKodu);
  if (girdi.mockMu) basariUrl.searchParams.set('mock', '1');
  return redirect(basariUrl.toString());
}

export const GET: APIRoute = ({ request }) => handle(request);
export const POST: APIRoute = ({ request }) => handle(request);
