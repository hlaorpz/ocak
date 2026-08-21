// /api/davet — Davet Sistemi v1 endpoint (brief-davet-sistemi).
//
// ⚠ 22 Ağustos 2026 — AÇIK RÖLE OLARAK KÖTÜYE KULLANILDI, MUSLUK KAPATILDI.
// Aşağıdaki "honeypot YOK / bot riski düşük" gerekçesi YANLIŞ ÇIKTI; tarihsel
// kayıt olarak duruyor, geçerli değil. Ölçüm: 20 Ağustos 09:13 UTC'den beri
// saat başı, toplanmış bir spam listesine, OCAK'ın gerçek şablonuyla mail.
// Bugünkü kapı: `DAVET_AKISI` musluğu + Origin + zaman damgası + honeypot.
// Ayrıntı `davet-akisi.ts` ve `davet-kapi.ts` başlıklarında.
//
// Akış (POST): body {refKodu, davetEdilenEmail, kanal, etkinlikId, website, ts}
//   0. musluk: `DAVET_AKISI` kapalıysa sessiz dönüş, Resend ÇAĞRILMAZ
//   0b. sessiz ret kapısı: Origin → honeypot → zaman damgası (`davet-kapi.ts`)
//   1. validation (kanal=mail bekleniyor; whatsapp/copy backend'siz)
//   2. [TARİHSEL — artık geçersiz] honeypot YOK (form değil, JSON; bot riski
//      düşük; rate-limit idempotans üzerinden yapılır)
//   3. idempotans: Davetler DB'de aynı `davetEdilenEmail` + son 24 saat
//      içinde varsa → sessiz skip (status: 'skip'), Resend ÇAĞRILMAZ,
//      ikinci satır AÇILMAZ (KARAR 242 çift-sayım koruması ruhu)
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
 * Etkinlik geçmiş/dolu ise /acik-kapi sayfası nazikçe yönlendirir
 * (geçmiş-etkinlik güvenlik ağı, KARAR 219 deseni — ayrı tasarım).
 */
function davetLinki(origin: string, etkinlikId: string, refKodu: string): string {
  const u = new URL('/acik-kapi', origin);
  if (etkinlikId) u.searchParams.set('etkinlik', etkinlikId);
  if (refKodu) u.searchParams.set('ref', refKodu);
  return u.toString();
}

/**
 * Resend HTML — minimal inline template. OCAK paleti hint'leri (köz/krem)
 * mail client uyumluluğu için inline. Kaan dilerse Resend dashboard'da
 * zengin template oluşturup `template_id` ile genişletir; o sürümde bu
 * `html` parametresi kaldırılır.
 */
function resendHtml(link: string): string {
  return `<!doctype html>
<html lang="tr">
  <body style="margin:0;padding:0;background:#1A1210;font-family:Georgia,serif;color:#F2EAE2;">
    <div style="max-width:520px;margin:0 auto;padding:40px 24px;">
      <p style="font-size:18px;font-style:italic;color:#F2EAE2;line-height:1.4;margin:0 0 24px;">
        <strong style="font-weight:normal;color:#C44B2F;">Bir arkadaşın seni OCAK'ın yanına çağırdı.</strong>
      </p>
      <p style="font-size:15px;line-height:1.6;color:#F2EAE2;margin:0 0 28px;">
        Şimdi gelmek istersen kapı açık:
      </p>
      <p style="margin:0 0 32px;">
        <a href="${link}" style="display:inline-block;background:#C44B2F;color:#F2EAE2;padding:14px 24px;text-decoration:none;border-radius:3px;font-size:15px;">
          Ateşin yanına gel →
        </a>
      </p>
      <p style="font-size:15px;line-height:1.6;color:#F2EAE2;margin:0 0 32px;">
        Hazır değilsen, ateş sönmüyor — istediğin an buradayız.
      </p>
      <p style="font-size:12px;line-height:1.55;color:#5C5350;margin:0;font-style:italic;">
        Bu tek bir davet. Seni bir listeye eklemedik, seni biz aramayacağız.
        Gelmek sana kalmış.
      </p>
    </div>
  </body>
</html>`;
}

async function resendIle(args: {
  to: string;
  link: string;
}): Promise<{ ok: boolean; error?: string }> {
  if (!RESEND_API_KEY) return { ok: false, error: 'no-api-key' };
  try {
    const resend = new Resend(RESEND_API_KEY);
    const result = await resend.emails.send({
      from: DAVET_FROM,
      to: args.to,
      subject: 'Seni OCAK\'a çağırdılar',
      html: resendHtml(args.link),
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
  const link = davetLinki(origin, etkinlikId, refKodu);

  const mail = await resendIle({ to: davetEdilenEmail, link });
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
