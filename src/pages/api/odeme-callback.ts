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
// B211 — ödeme bildirimi. Saf mantık lib'de (testlenebilir); Notion yazımı
// burada, Resend taşıması `lib/posta.ts`'te (anahtar orada okunuyor).
import { odemeBildir } from '../../lib/odeme-bildir.ts';
import { resendTasima } from '../../lib/posta.ts';
import { publicOrigin } from '../../lib/public-origin.ts';
// KARAR 488 — kart akışı env anahtarıyla kapalı; callback 410 döner.
import { KART_AKISI_ACIK } from '../../lib/kart-akisi.ts';
// İŞ 2 — callback doğrulaması sağlayıcı arayüzünde yaşar (KARAR 395).
import {
  getPaymentProvider,
  soyEpochSoneki,
  type CallbackDogrulama,
} from '../../lib/payment-provider.ts';

export const prerender = false;

function redirect(url: string): Response {
  return new Response(null, { status: 302, headers: { Location: url } });
}

/** Notion Kayıtlar `Mail Gitti` (checkbox) — 10 Eyl'de açıldı, ilk yazıcısı bu. */
async function mailGittiIsaretle(pageId: string): Promise<void> {
  await notion.pages.update({
    page_id: pageId,
    properties: { 'Mail Gitti': { checkbox: true } },
  });
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
    // B211 (Kaan kararı 3) — ödeme ONAYLANDIKTAN sonra yöntem kart olarak
    // yazılır. Alan kayıt anında seçime göre yazılıyor (`api/kayit.ts:293`) ve
    // o ana kadar doğru; ama havale seçip devam linkinden kartla ödeyen kadının
    // satırı `Havale` kalırsa ileride otomatik havale eşleştirmesi gelmeyecek
    // bir havaleyi bekler görünür.
    //
    // ⚠ Yalnız BAŞARIDA. Ödenmemiş satırın yöntemine dokunulmuyor: `Yer Tutma
    // Bitişi` kayıt anında o yönteme göre hesaplandı (kart 3 sa · havale 24 sa)
    // ve yöntemi sonradan değiştirmek bitişi yalanlardı — tarama da yanlış dala
    // düşerdi.
    'Ödeme Yöntemi': { select: { name: 'Kredi Kartı' } },
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
  // ⚠ Kayıt imza kapsamından çözülür — query `pageId` YOK SAYILIR. Query imza
  // kapsamında değil; dönüş POST'unu kullanıcının tarayıcısı gönderdiği için
  // oradan kayıt çözmek, imzanın koruduğu şeyi imzasız alana devretmek olurdu.
  // *(Bu paragrafın önceki hâli "`dogrulama.referansKodu`'ndan çözülür"
  // diyordu; 6 Eki'de kimlik çözümü iki yola ayrıldı — hemen aşağıda.)*
  //
  // KARAR 395 korunuyor: route sağlayıcı ADINA dallanmaz. Üç alanı da
  // arayüz veriyor (`CallbackDogrulama`), sağlayıcı kendi imza kapsamından
  // dolduruyor.
  // ── KİMLİK ÇÖZÜMÜ — iki yol, ikisi de imza kapsamından (6 Eki 2026) ──
  //
  // Bazı sağlayıcılar dönüşte BİZİM referansımızı yankılar (`mock`); o zaman
  // `referansKodu` doludur ve iş burada biter. N-Kolay yankılamıyor — ölçüldü:
  // dönüşün hash kapsamındaki tek kimliği sağlayıcının KENDİ numarası
  // (`REFERENCE_CODE` = `IKSIRPF…`), bizim kodumuzu taşıyan alan hash DIŞINDA.
  //
  // O hâlde köprü: sağlayıcının referansı → `mutabakatSorgula()` → bizim
  // `clientRefCode` → soneki soyulur → `kayitOku()`. Sorgu sağlayıcının kendi
  // sunucusuna, kendi sırrımızla imzalı gidiyor; tarayıcı o kanala giremez.
  // Yani kimlik hâlâ YALNIZ güvenilir yüzeyden çözülüyor — KARAR 593 yerinde.
  //
  // ⚠ Çağrı **hash kapısından SONRA**: doğrulanmamış istek bize ağ çağrısı
  // yaptıramaz (`dogrulaCallback` bu yüzden senkron kalıyor, arayüz notu).
  //
  // KARAR 395 korunuyor: route sağlayıcı ADINA dallanmaz. "Köprü var mı" diye
  // sorar (`mutabakatSorgula?`), "nkolay mı" diye sormaz.
  let referansKodu = dogrulama.referansKodu;
  if (!referansKodu) {
    if (!dogrulama.saglayiciReferansi) {
      console.warn('[odeme-callback] doğrulama referans taşımıyor (401) — kayıt çözülemez');
      return new Response('Callback doğrulanamadı.', { status: 401 });
    }
    const koprusu = getPaymentProvider().mutabakatSorgula;
    if (!koprusu) {
      console.error(
        '[odeme-callback] sağlayıcı kendi referansını verdi ama mutabakat köprüsü yok (401)',
      );
      return new Response('Callback doğrulanamadı.', { status: 401 });
    }
    let mutabakat;
    try {
      mutabakat = await koprusu({
        saglayiciReferansi: dogrulama.saglayiciReferansi,
        simdi: new Date(),
      });
    } catch (err) {
      console.error(`[odeme-callback] mutabakat çağrısı düştü (401): ${String(err).slice(0, 200)}`);
      return new Response('Callback doğrulanamadı.', { status: 401 });
    }
    if ('hata' in mutabakat) {
      // ⚠ FAIL-CLOSED ve SESSİZ DEĞİL: buraya gelen istek imzasını geçmiş,
      // yani para muhtemelen ÇEKİLMİŞ. Kayıt kapanmıyorsa iz log'da durmalı —
      // sessiz red "para alındı, kayıt Beklemede, iz yok" demek olurdu.
      console.error(
        `[odeme-callback] mutabakat kaydı çözemedi (401) — ` +
          `saglayiciRef=${dogrulama.saglayiciReferansi} sebep=${mutabakat.hata}`,
      );
      return new Response('Callback doğrulanamadı.', { status: 401 });
    }
    referansKodu = soyEpochSoneki(mutabakat.clientRefCode) ?? undefined;
    if (!referansKodu) {
      console.error(
        `[odeme-callback] mutabakattan gelen kod bizim biçimde değil (401) — ` +
          `saglayiciRef=${dogrulama.saglayiciReferansi}`,
      );
      return new Response('Callback doğrulanamadı.', { status: 401 });
    }
  }

  const kayit = await kayitOku(notion, NOTION_KAYITLAR_DB, referansKodu);
  if (kayit.durum !== 'bulundu' || !kayit.pageId) {
    console.warn(
      `[odeme-callback] kayıt çözülemedi (401) — ref=${referansKodu} durum=${kayit.durum}`,
    );
    return new Response('Callback doğrulanamadı.', { status: 401 });
  }
  // ⚠ REPLAY: alan doluysa bu kayıt zaten bir ödemeyle kapanmış. İkinci
  // dönüş — aynı gövdenin tekrarı ya da ikinci bir çekim — kabul edilmez.
  if (kayit.islemNo) {
    console.warn(
      `[odeme-callback] replay reddedildi (401) — ref=${referansKodu} ` +
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
        `ref=${referansKodu} pageId=${kayit.pageId} gelen tutar=${dogrulama.tutar ?? '(yok)'}`,
    );
    return new Response('Callback doğrulanamadı.', { status: 401 });
  }
  // Yetkilendirilen tutar beklenenin ALTINDAysa reddet. Üstü kabul edilir:
  // taksit/komisyon farkı sağlayıcı tarafında tutarı yukarı çekebilir ve
  // fazla tahsilatı reddetmek kadını ödemiş ama kaydı kapanmamış bırakırdı.
  if (!(typeof dogrulama.tutar === 'number') || dogrulama.tutar < kayit.tutar) {
    console.warn(
      `[odeme-callback] tutar düşük (401) — ref=${referansKodu} ` +
        `beklenen=${kayit.tutar} gelen=${dogrulama.tutar ?? '(yok)'}`,
    );
    return new Response('Callback doğrulanamadı.', { status: 401 });
  }

  if (girdi.sonuc !== 'basari') {
    return redirect(`${baseUrl}/odeme/iptal?ref=${encodeURIComponent(referansKodu)}`);
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
      `${baseUrl}/odeme/iptal?ref=${encodeURIComponent(referansKodu)}&hata=notion`,
    );
  }
  // ────────────────────────────────────────────────────────────────────────
  // B211 — ÖDEME BİLDİRİMİ. Bütün kapıların (hash · mutabakat · kayıt · replay
  // · tutar) ve Notion yazımının **ARDINDAN** gelir. Reddedilen hiçbir callback
  // buraya ulaşmaz: yukarıdaki her kapı `return` ediyor, bu satır yalnız
  // `odemeyiOnayla` başarıyla döndükten sonra çalışıyor. Kapıların sırası ve
  // davranışı DEĞİŞMEDİ (KARAR 593 · 594 · 595 · 601 · 602).
  //
  // `await` ŞART: yanıt döndükten sonra süreç yaşamayabilir (Fluid Compute'ta
  // bile garanti yok). Fire-and-forget bırakmak, bildirimin rastgele kaybolması
  // demekti.
  //
  // Dönüş DEĞERLENDİRİLMEZ, yalnız log'lanır: bu çağrının hiçbir sonucu
  // callback'in yanıt kodunu ya da Notion'a yazılmış ödemeyi değiştirmez.
  // `odemeBildir` kendi içinde throw etmiyor; yine de dışarıda bir kere daha
  // sarılı, çünkü "etmiyor" bir sözleşme değil bir gözlem.
  try {
    await odemeBildir(
      {
        kayitId: referansKodu,
        pageId: kayit.pageId,
        email: kayit.email,
        etkinlikSayisi: kayit.etkinlikSayisi,
        formatHam: kayit.formatHam,
        // `seciliTarih` ARTIK GEÇİLMİYOR: `etkinlik_adi`'yı yeniden üretmek
        // için gerekiyordu, o alan Resend'e geçişle kalktı. `ETKINLIK_TARIHI`
        // etkinliğin kendi `Tarih`inden kuruluyor.
        mekanHam: kayit.mekanHam,
        katilimLinkiHam: kayit.katilimLinkiHam,
        zoomSifresiHam: kayit.zoomSifresiHam,
        basligHam: kayit.basligHam,
        slugHam: kayit.slugHam,
        tarihISOHam: kayit.tarihISOHam,
        tarihBitisHam: kayit.tarihBitisHam,
        saatHam: kayit.saatHam,
        konumDetayHam: kayit.konumDetayHam,
        // Mailin `AD` değişkeni — Kayıtlar `Kadın` alanından ilk ad.
        ad: kayit.davetEdenAd,
      },
      { tasima: resendTasima(), mailGittiIsaretle },
    );
  } catch (err) {
    console.error(
      `[odeme-callback] bildirim beklenmeyen hata (ödeme GEÇERLİ) — ` +
        `ref=${referansKodu} ${String(err).slice(0, 200)}`,
    );
  }

  // Aşama 3b-fix tasarım — başarı: success sayfasına refSuccess (OCAK-XXXX)
  // taşınır. Notion UUID (basvuruId) sadece pages.update için kullanıldı;
  // success'te göstermiyoruz (ham UUID kullanıcıya anlamsız).
  const basariUrl = new URL(`${baseUrl}/odeme/tamam`);
  // Referans imza kapsamından; `/odeme/tamam` onu `equals` ile arıyor.
  basariUrl.searchParams.set('ref', referansKodu);
  if (girdi.mockMu) basariUrl.searchParams.set('mock', '1');
  return redirect(basariUrl.toString());
}

export const GET: APIRoute = ({ request }) => handle(request);
export const POST: APIRoute = ({ request }) => handle(request);
