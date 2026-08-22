// /api/davet — Davet Sistemi v1 endpoint (brief-davet-sistemi).
//
// ⚠ 22 Ağustos 2026 — AÇIK RÖLE OLARAK KÖTÜYE KULLANILDI, MUSLUK KAPATILDI.
// Aşağıdaki "honeypot YOK / bot riski düşük" gerekçesi YANLIŞ ÇIKTI; tarihsel
// kayıt olarak duruyor, geçerli değil. Ölçüm: 20 Ağustos 09:13 UTC'den beri
// saat başı, toplanmış bir spam listesine, OCAK'ın gerçek şablonuyla mail.
// Bugünkü kapı: `DAVET_AKISI` musluğu + Origin + zaman damgası + honeypot.
// Ayrıntı `davet-akisi.ts` ve `davet-kapi.ts` başlıklarında.
//
// Akış (POST): body {refKodu, davetEdilenEmail, kanal, etkinlikId, website, ts,
//   davetEdenAd, etkinlikAd, etkinlikTarih, landingPath}
//   0. musluk: `DAVET_AKISI` kapalıysa sessiz dönüş, Resend ÇAĞRILMAZ
//   0b. sessiz ret kapısı: Origin → honeypot → zaman damgası (`davet-kapi.ts`)
//   1. validation (kanal=mail bekleniyor; whatsapp/copy backend'siz)
//   2. [TARİHSEL — artık geçersiz] honeypot YOK (form değil, JSON; bot riski
//      düşük; rate-limit idempotans üzerinden yapılır)
//   3. idempotans: Davetler DB'de aynı `davetEdilenEmail` + son 24 saat
//      içinde varsa → sessiz skip (status: 'skip'), Resend ÇAĞRILMAZ,
//      ikinci satır AÇILMAZ (KARAR 242 çift-sayım koruması ruhu)
//   3b. mail bağlamı normalize (`davet-baglam.ts`): ad ilk kelimeye,
//      metinler sınıra, `landingPath` beyaz listeye. Eksik → yedek + warn.
//   4. Resend transactional → from `davet@mail.ocak.biz`, B'ye TEK mail
//      (Resend API key env'den). HTML template inline; Kaan dilerse Resend
//      dashboard'da template oluşturup template_id ile genişletir.
//   5. Notion Davetler DB satır: Davet Eden Ref / Davet Edilen / Kanal /
//      Tarih / Sonuç=Beklemede. n8n sonuç eşleştirmesi için n8n tarafı.
//
// KVKK:
//   - davet edilen email URL/query'ye ASLA girmez (sadece POST body)
//   - linkteki ?ref= davet EDEN'in kodu, davet edilenin verisi değil
//   - B'ye TEK mail, ikinci dokunuş A'nın elinden (n8n A→B hatırlatma)
//
// Brief: WhatsApp/kopyala kanalı backend'siz (client-side paylaşım, davet
// edilenin kim olduğunu bilmiyoruz). Davetler DB'ye sadece mail kanalı
// satır açar; WhatsApp davetinin "geldi" izi davet edilenin ?ref= linkiyle
// kayıt olunca Kayıtlar DB üzerinden yakalanır.
import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { notion, NOTION_DAVETLER_DB } from '../../lib/notion.ts';
import { EMAIL_RE, json } from '../../lib/forms-backend.ts';
import { publicOrigin } from '../../lib/public-origin.ts';
import { DAVET_AKISI_ACIK } from '../../lib/davet-akisi.ts';
import {
  gecerliLandingYolu,
  htmlKacir,
  ilkAd,
  metinKirp,
  AZAMI_ETKINLIK_UZUNLUGU,
} from '../../lib/davet-baglam.ts';
import {
  honeypotYakalandi,
  originSebebi,
  zamanDamgasiSebebi,
  type SessizRetSebebi,
} from '../../lib/davet-kapi.ts';

export const prerender = false;

type DavetBody = {
  refKodu?: string;
  davetEdilenEmail?: string;
  kanal?: string;
  etkinlikId?: string;
  /**
   * brief-davet-mail İŞ 1 — mail bağlamı. Üçü de kayıt akışında zaten var,
   * kullanıcıdan yeni girdi istenmez; DavetKutusu prop zincirinden geçirir.
   * Hepsi GÖVDEDE taşınır, query'de değil (KARAR 270 disiplini).
   *
   * ⚠ Dördü de client kaynaklı → `davet-baglam.ts`ten geçmeden ne maile ne
   * Notion'a yazılır. HTML kaçırma ve yol beyaz listesi orada.
   */
  davetEdenAd?: string;
  etkinlikAd?: string;
  etkinlikTarih?: string;
  landingPath?: string;
  /** Honeypot — gizli alan; doluysa bot (KARAR 152/194 deseni). */
  website?: string;
  /** Form GÖRÜNÜR olduğu andaki `Date.now()` — DavetKutusu doldurur. */
  ts?: number | string;
};

const RESEND_API_KEY = import.meta.env.RESEND_API_KEY ?? '';
const DAVET_FROM = 'OCAK <davet@mail.ocak.biz>';
const IDEMPOTANS_PENCERESI_MS = 24 * 60 * 60 * 1000;

/**
 * Sessiz ret — bot başarılı olduğunu sansın, varyasyon denemesin.
 *
 * ⚠ Gövde gerçek başarının AYNISI: `{status:'success'}`, ayırt edici hiçbir
 * alan yok. `api/form.ts` ve `api/kayit.ts` bu noktada `honeypot: true`
 * markerı döner; burada BİLİNÇLİ olarak sapıyoruz. Orada marker'ın bedeli
 * yok (lead formu), burada var: bu uç aktif olarak taranıyor ve marker
 * saldırgana "hangi varyasyon geçiyor" sinyalini bedavaya verir.
 *
 * Sebep yalnız sunucu log'una düşer — sayaç için, içerik için değil (KVKK:
 * e-posta, origin değeri, gövde ASLA loglanmaz).
 */
function sessizRet(sebep: SessizRetSebebi): Response {
  console.warn(`[davet] sessiz ret: ${sebep}`);
  return json({ status: 'success' });
}

/**
 * Davetler DB'de aynı email için son 24s içinde satır var mı?
 * Hata olursa false dön (mail gitmesi engellenmesin — fail-open için
 * idempotans only Notion'a güvenir; KARAR 123 ML başarılı → kullanıcı
 * success patterni ruhu).
 */
async function dahaOnceDavetEdildi(email: string): Promise<boolean> {
  if (!NOTION_DAVETLER_DB) return false;
  try {
    const esik = new Date(Date.now() - IDEMPOTANS_PENCERESI_MS).toISOString();
    const sorgu = await notion.databases.query({
      database_id: NOTION_DAVETLER_DB,
      filter: {
        and: [
          { property: 'Davet Edilen', email: { equals: email } },
          { property: 'Tarih', date: { on_or_after: esik } },
        ],
      },
      page_size: 1,
    });
    return sorgu.results.length > 0;
  } catch (err) {
    console.error('[davet] idempotans sorgu hatası:', String(err).slice(0, 200));
    return false;
  }
}

/**
 * Davetler DB'ye yeni satır. Property adları brief birebir:
 *   Davet Eden Ref (title) / Davet Edilen (email) / Kanal (select) /
 *   Tarih (date) / Sonuç (select=Beklemede) / Hatırlatma Atıldı (checkbox=false)
 * Property tipi yanlışsa Notion sessizce yutar — exact-match şart
 * (Inventory > spec, brief uyarısı).
 */
async function davetlerDbYaz(args: {
  refKodu: string;
  davetEdilenEmail: string;
  kanal: 'Mail' | 'WhatsApp';
}): Promise<void> {
  if (!NOTION_DAVETLER_DB) return;
  await notion.pages.create({
    parent: { database_id: NOTION_DAVETLER_DB },
    properties: {
      'Davet Eden Ref': {
        title: [{ text: { content: args.refKodu || '(boş)' } }],
      },
      'Davet Edilen': { email: args.davetEdilenEmail },
      Kanal: { select: { name: args.kanal } },
      Tarih: { date: { start: new Date().toISOString() } },
      Sonuç: { select: { name: 'Beklemede' } },
      'Hatırlatma Atıldı': { checkbox: false },
    } as never,
  });
}

/**
 * Davet linkini server'da üret — origin Vercel proxy header'larından
 * (x-forwarded-host). publicOrigin helper'ı zaten tek yer (KARAR Aşama 3b).
 *
 * ── 22 Ağustos 2026: yol artık sabit değil ──
 * Önceki hâli `/acik-kapi`yi SABİT yazıyordu. `landingPath` prop'u vardı,
 * DavetKutusu'nda tanımlıydı, WhatsApp paylaşımında kullanılıyordu — ama
 * gövdeye hiç konmadığı için mail dalına ulaşmıyordu. Sonuç: çemberden davet
 * edilen kadın da Açık Kapı sayfasına düşüyordu. Kırık olan şey buradaki
 * fallback değil, zincirin bir halkasının hiç takılmamış olmasıydı.
 *
 * Yol `gecerliLandingYolu` beyaz listesinden geçer. Liste dışı ya da eksik
 * değer ana sayfaya düşer — `/acik-kapi`ye DEĞİL: yanlış bir formatın
 * sayfasına götürmek, ana sayfaya götürmekten daha çok yanıltır.
 *
 * ⚠ Ana sayfada geçmiş-etkinlik güvenlik ağı YOK (o ağ format sayfalarında
 * yaşar). Fallback'in bedeli bu; çağıran taraf bu yüzden warn basar.
 */
function davetLinki(
  origin: string,
  landingYolu: string | null,
  etkinlikId: string,
  refKodu: string,
): string {
  const u = new URL(landingYolu ?? '/', origin);
  if (etkinlikId) u.searchParams.set('etkinlik', etkinlikId);
  if (refKodu) u.searchParams.set('ref', refKodu);
  return u.toString();
}

// ── OCAK paleti, mail kopyası ──
// Site token'ları (`tokens.css`) build'e giriyor, mail HTML'i girmiyor —
// değerler burada elle durur. ⚠ `ALT_NOT` bilinçli olarak `--smoke`
// (#5C5350) DEĞİL: marka paletinin "Sıcak Gri"si (10-marka.md). Koyu zeminde
// 12px'lik bir satır için #5C5350 mail istemcilerinde okunmuyor.
const RENK = {
  ZEMIN: '#1A1210', // kömür
  YAZI: '#F2EAE2', // krem
  KOZ: '#C44B2F', // köz — buton zemini, vurgu
  ALT_NOT: '#8A7E78', // sıcak gri
} as const;

// Başlık serif, gövde sans. Web font GÖMÜLMEZ (brief): Cormorant Garamond
// adı önce yazılır, yüklemeyen istemci sistem serif'ine düşer — mail
// istemcilerinin çoğu zaten @font-face'i sıyırır, gömmek boşuna ağırlık.
const YAZI_BASLIK = "'Cormorant Garamond', Georgia, 'Times New Roman', serif";
const YAZI_GOVDE =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";

/**
 * Mail gövdesinin metni — bağlam varsa dolu, yoksa yedek.
 *
 * ⚠ YEDEKLERİN ÇALIŞMAMASI BEKLENİR (brief İŞ 2). Üç alan da kayıt akışında
 * mevcut; yedek devreye giriyorsa prop zinciri kırıktır. Çağıran taraf bunu
 * `console.warn` ile işaretler — burası sessizce güzel bir cümle üretip
 * arızayı gizlemez, yalnızca maili boş göndermez.
 *
 * ── Neden tarih cümlenin İÇİNDE değil ──
 * `formatEtkinlikTarihi` "31 Ağustos 2026 · 20:00" üretir. Bu dize cümleye
 * gömüldüğünde ek çekimi kırılır ("20:00'te"? "· 20:00'de"?). Tarih kendi
 * satırına alınınca sorun tamamen ortadan kalkar — KARAR 272'nin iki-nokta
 * çözümüyle aynı mantık: değişkeni cümlenin gramerinden çıkar.
 *
 * ⚠ "kız kardeşin" YAZILMAZ. Davet edilen kadın henüz dışarıda; içeriden bir
 * kelimeyle karşılanmaz (brief).
 */
function mailMetni(baglam: {
  davetEdenAd: string;
  etkinlikAd: string;
  etkinlikTarih: string;
}): { konu: string; acilis: string } {
  const { davetEdenAd } = baglam;
  return {
    konu: davetEdenAd ? `${davetEdenAd} seni de istedi` : 'Seni de istediler',
    acilis: davetEdenAd
      ? `${davetEdenAd} bir çembere oturuyor.`
      : 'Biri bir çembere oturuyor.',
  };
}

/**
 * Resend HTML.
 *
 * ── Neden tablo sarmalayıcı, neden `<body>` stili yetmiyor ──
 * Gmail (ve Outlook.com) gelen HTML'i sanitize ederken `<body>` etiketini
 * kendi kabıyla değiştirir; üzerindeki inline `background` ile birlikte.
 * Şablon kömür zemini `<body style="background:#1A1210">` üzerinde
 * taşıyordu — koda bakınca doğru, istemcide krem. Brief'in "marka tersine
 * dönmüş" gözlemi buydu: değer yanlış değildi, YERİ yanlıştı.
 *
 * Doğru yer, sıyrılmayan bir eleman: `bgcolor` attribute'u + inline
 * `background-color` taşıyan tam genişlikte bir `<table>`. `<body>` stili de
 * KORUNUR — biri sıyrılırsa diğeri tutar, ikisi birden zarar vermez.
 *
 * ── Kaçırma ──
 * `davetEdenAd` ve `etkinlikAd` client gövdesinden gelir. `htmlKacir`
 * olmadan `davetEdenAd` alanına etiket yazan biri, OCAK'ın doğrulanmış alan
 * adından kimlik avı linki yollardı.
 *
 * `link` de kaçırılır — güvenlik için değil (onu sunucu `publicOrigin` +
 * beyaz listeden geçmiş yoldan kendisi üretir), doğruluk için: `URL`
 * `?etkinlik=…&ref=…` üretir ve HTML attribute'unda çıplak `&` entity
 * olmalıdır. Tarayıcılar affeder, katı sanitize eden istemciler etmez.
 */
function resendHtml(args: {
  link: string;
  davetEdenAd: string;
  etkinlikAd: string;
  etkinlikTarih: string;
}): string {
  const { konu, acilis } = mailMetni(args);
  // Ad ayrıca kaçırılmaz: `acilis` onu zaten içeriyor ve bütün olarak
  // kaçırılıyor. İki kez kaçırmak `&amp;amp;` üretirdi.
  const etkAd = htmlKacir(args.etkinlikAd);
  const etkTarih = htmlKacir(args.etkinlikTarih);

  // Etkinlik adı + tarih: cümlenin dışında, kendi bloğunda. Alan boşsa satır
  // tamamen düşer — boş bir ayraç ya da sarkan nokta bırakmaz.
  const detaySatirlari = [
    etkAd
      ? `<div style="font-family:${YAZI_BASLIK};font-size:19px;font-style:italic;color:${RENK.KOZ};line-height:1.35;">${etkAd}</div>`
      : '',
    etkTarih
      ? `<div style="font-family:${YAZI_GOVDE};font-size:14px;color:${RENK.ALT_NOT};line-height:1.5;padding-top:4px;">${etkTarih}</div>`
      : '',
  ]
    .filter(Boolean)
    .join('\n            ');
  const detayBlogu = detaySatirlari
    ? `<tr><td style="padding:0 0 28px;">
            ${detaySatirlari}
          </td></tr>`
    : '';

  const govdeStil = `font-family:${YAZI_GOVDE};font-size:15px;line-height:1.65;color:${RENK.YAZI};`;

  return `<!doctype html>
<html lang="tr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="dark" />
    <title>${htmlKacir(konu)}</title>
  </head>
  <body style="margin:0;padding:0;background:${RENK.ZEMIN};background-color:${RENK.ZEMIN};color:${RENK.YAZI};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${RENK.ZEMIN}" style="background-color:${RENK.ZEMIN};margin:0;padding:0;width:100%;">
      <tr>
        <td align="center" style="padding:40px 16px;">
          <table role="presentation" width="520" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:520px;">
            <tr>
              <td style="font-family:${YAZI_BASLIK};font-size:24px;font-style:italic;line-height:1.35;color:${RENK.YAZI};padding:0 0 16px;">
                ${htmlKacir(acilis)}
              </td>
            </tr>
            ${detayBlogu}
            <tr>
              <td style="${govdeStil}padding:0 0 28px;">
                Seni de yanında istedi.
              </td>
            </tr>
            <tr>
              <td style="${govdeStil}padding:0 0 24px;">
                Çember, OCAK'ın en sade buluşması. Bir ateş yanıyor, kadınlar
                bir araya geliyor, herkes kendi sözünü söylüyor. Öğretilen bir
                şey yok, konuşmak zorunda da değilsin.
              </td>
            </tr>
            <tr>
              <td style="${govdeStil}padding:0 0 32px;">
                Kadınlar binlerce yıl böyle oturdu — guru yoktu, reçete yoktu.
                Sadece birbirlerinin tanıklığı. Biz o çemberi yeniden kuruyoruz.
              </td>
            </tr>
            <tr>
              <td style="padding:0 0 36px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td bgcolor="${RENK.KOZ}" style="background-color:${RENK.KOZ};border-radius:3px;">
                      <a href="${htmlKacir(args.link)}" style="display:inline-block;font-family:${YAZI_GOVDE};font-size:15px;line-height:1.2;color:${RENK.YAZI};text-decoration:none;padding:15px 26px;">Neye çağrıldığına bak →</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="font-family:${YAZI_GOVDE};font-size:12px;line-height:1.6;color:${RENK.ALT_NOT};">
                Bu tek bir davet. Listeye eklenmedin, seni aramayacağız.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

async function resendIle(args: {
  to: string;
  link: string;
  davetEdenAd: string;
  etkinlikAd: string;
  etkinlikTarih: string;
}): Promise<{ ok: boolean; error?: string }> {
  if (!RESEND_API_KEY) return { ok: false, error: 'no-api-key' };
  try {
    const resend = new Resend(RESEND_API_KEY);
    const result = await resend.emails.send({
      from: DAVET_FROM,
      to: args.to,
      // Konu ve gövde aynı yerden — ad boşsa ikisi birden yedeğe düşer,
      // "Ayşe seni de istedi" konusuyla adsız gövde eşleşmezliği olmaz.
      subject: mailMetni(args).konu,
      html: resendHtml(args),
    });
    if ((result as { error?: unknown }).error) {
      return {
        ok: false,
        error: String((result as { error?: unknown }).error).slice(0, 200),
      };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: String(err).slice(0, 200) };
  }
}

export const POST: APIRoute = async ({ request }) => {
  // ── 0. MUSLUK ── En ucuz kapı, en başta: gövde bile okunmaz, Notion'a ve
  // Resend'e hiç dokunulmaz. Kapalıyken yüzey de render edilmiyor, yani buraya
  // ulaşan her istek tanım gereği bizim arayüzümüzden gelmiyor.
  if (!DAVET_AKISI_ACIK) return sessizRet('akis-kapali');

  let body: DavetBody;
  try {
    body = (await request.json()) as DavetBody;
  } catch {
    return json({ status: 'error', message: 'Geçersiz body' }, 400);
  }

  // ── 0b. SESSİZ RET KAPISI ── Origin → honeypot → zaman damgası.
  // Sıra ucuzdan pahalıya değil, ayırt ediciden ayırt edici olmayana: Origin
  // doğrudan POST'u eler, honeypot form-dolduran botu, damga ikisinin de
  // kaçırdığı "hızlı" denemeyi. Üçü de saf fonksiyon (`davet-kapi.ts`), I/O yok.
  const originRet = originSebebi(
    request.headers.get('origin'),
    publicOrigin(request),
  );
  if (originRet) return sessizRet(originRet);

  if (honeypotYakalandi(body.website)) return sessizRet('honeypot');

  const tsRet = zamanDamgasiSebebi(body.ts, Date.now());
  if (tsRet) return sessizRet(tsRet);

  const refKodu = (body.refKodu ?? '').trim();
  const davetEdilenEmail = (body.davetEdilenEmail ?? '').trim().toLowerCase();
  const etkinlikId = (body.etkinlikId ?? '').trim();
  const kanal = (body.kanal ?? '').trim().toLowerCase();

  // ── MAIL BAĞLAMI ── Client gövdesinden gelir, `davet-baglam.ts` normalize
  // eder. Eksik alan HATA DEĞİL: mail yedeğe düşer, gönderim sürer — davet
  // bir jest, eksik bir alan yüzünden iptal edilmez. Ama sessiz de kalmaz.
  const davetEdenAd = ilkAd(body.davetEdenAd);
  const etkinlikAd = metinKirp(body.etkinlikAd, AZAMI_ETKINLIK_UZUNLUGU);
  const etkinlikTarih = metinKirp(body.etkinlikTarih, AZAMI_ETKINLIK_UZUNLUGU);
  const landingYolu = gecerliLandingYolu(body.landingPath);

  const eksikAlanlar: string[] = [];
  if (!davetEdenAd) eksikAlanlar.push('davetEdenAd');
  if (!etkinlikAd) eksikAlanlar.push('etkinlikAd');
  if (!etkinlikTarih) eksikAlanlar.push('etkinlikTarih');
  if (!landingYolu) eksikAlanlar.push('landingPath');
  if (eksikAlanlar.length) {
    // KVKK: yalnız ALAN ADLARI loglanır, değerleri asla. `landingPath`
    // listede yoksa da buraya düşer — eksik ile reddedilmiş aynı sepette,
    // ikisinin de sonucu yedek davranış.
    console.warn(`[davet] bağlam eksik → yedek: ${eksikAlanlar.join(', ')}`);
  }

  // v1: WhatsApp/kopyala backend'siz; sadece mail kanalı endpoint'e vurur.
  // Defansif: kanal verilmemişse mail kabul (eski client uyumu).
  if (kanal && kanal !== 'mail') {
    return json(
      { status: 'error', message: `Bu kanal v1'de backend'siz: ${kanal}` },
      400,
    );
  }
  if (!davetEdilenEmail || !EMAIL_RE.test(davetEdilenEmail)) {
    return json({ status: 'error', message: 'Geçerli bir e-posta gir.' }, 400);
  }

  // İdempotans — aynı email + son 24s.
  if (await dahaOnceDavetEdildi(davetEdilenEmail)) {
    return json({ status: 'skip', message: 'Bu davetin yola çıkmıştı.' });
  }

  const origin = publicOrigin(request);
  const link = davetLinki(origin, landingYolu, etkinlikId, refKodu);

  const mail = await resendIle({
    to: davetEdilenEmail,
    link,
    davetEdenAd,
    etkinlikAd,
    etkinlikTarih,
  });
  if (!mail.ok) {
    console.error('[davet] Resend fail:', mail.error);
    return json(
      { status: 'error', message: 'Mail gönderilemedi, biraz sonra dene.' },
      500,
    );
  }

  // Davetler DB satır — yazma başarısız olursa kullanıcı yine success
  // görür (B'ye mail zaten gitti), n8n eşleştirmesi etkilenir ama mail
  // niyeti yerine geldi. Hata stdout'a düşer.
  try {
    await davetlerDbYaz({ refKodu, davetEdilenEmail, kanal: 'Mail' });
  } catch (err) {
    console.error(
      '[davet] Davetler DB yazma hatası (mail gönderildi):',
      String(err).slice(0, 200),
    );
  }

  return json({ status: 'success' });
};
