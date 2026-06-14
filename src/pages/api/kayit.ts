// /api/kayit — Ödemeli kayıt formları backend endpoint (Brief 2A iskelet,
// Brief 2B form ucu, Brief 3 6 format, Brief 5 KARAR 208 Yol C otomatik link).
//
// Akış: honeypot → validation → Notion etkinlik oku (ücret + Katılım Linki +
// Mekân/Platform) → Notion Başvurular yazımı → MailerLite grup ekleme +
// custom field (etkinlik_adi + katilim_linki, sadece link doluysa) →
// Response (ödeme bilgisi + katilim bilgisi).
//
// Hata politikası:
// - 400: validation hatası (format, ad, email, kvkk eksik/yanlış)
// - 200 + { status:'skip' }: honeypot tetiklendi (sessiz success)
// - 500: Notion/MailerLite hatası
// - 200 + { status:'success', odeme:{...}, katilim:{...} }: normal akış
//
// C-1 güvenlik ağı (Brief 5): Notion'da Katılım Linki boşsa MailerLite
// custom field'a YAZMA + response.katilim.var=false → success ekranı
// fallback metnine düşer. Otomasyon (Kaan kuracak) boş-link kontrolüyle
// farklı mail atar veya elle yönetir.
import type { APIRoute } from 'astro';
import { notion, NOTION_BASVURULAR_DB, NOTION_KAYITLAR_DB } from '../../lib/notion.ts';
import { kodDogrula, kodKullanimArtir, type KodSonuc } from '../../lib/kodlar.ts';
import { getPaymentProvider } from '../../lib/payment-provider.ts';
import { publicOrigin } from '../../lib/public-origin.ts';
import {
  FORMAT_TIP,
  FORMAT_MAILERLITE_GROUP,
  isDirekt,
  isKayitFormat,
  kademeTutari,
  katilimTipiCoz,
  mailerLiteCustomFields,
  etkinlikAdiFormatla,
  uretBenzersizReferansNo,
  type RefUniqueQuery,
  tarihTrFormat,
  uygulaIndirim,
  type KayitFormat,
  type KayitTipi,
  type Kademe,
} from '../../lib/kayit.ts';

const NOTION_KODLAR_DB = import.meta.env.NOTION_KODLAR_DB_ID ?? '';

/**
 * Havale açıklama metni — kullanıcı bankada görür. Tasarım turu 3 (ADIM 3):
 * "Ad — OCAK-XXXXX" formatı. Önceden uzun format+tarih+saat vardı; bankada
 * Kaan'ın eşleştirmesi referans no'yu görmekle anlık. Kısa ve net.
 */
function havaleAciklamasi(args: { ad: string; referansNo: string }): string {
  return `${args.ad} — ${args.referansNo}`;
}

/**
 * Tasarım turu 3 (ADIM 1) — havale success metninde ödeme süresi dinamik:
 *  - Etkinlik tarihine 3+ gün varsa: "Katılım payını en geç 3 gün içinde
 *    aşağıdaki hesaba iletebilirsin."
 *  - 3 günden yakınsa: "Katılım payını ilettiğinde biz kontrol edip sana
 *    döneceğiz."
 * tarihISO YYYY-MM-DD veya ISO timestamp. Parse edilemezse defansif olarak
 * 3+ gün dalına düşer (rahat metin).
 */
function havaleVadeMetni(tarihISO: string | undefined | null, bugun: Date = new Date()): string {
  const m = tarihISO?.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return 'Katılım payını en geç 3 gün içinde aşağıdaki hesaba iletebilirsin.';
  const etk = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  const sinir = new Date(bugun);
  sinir.setHours(0, 0, 0, 0);
  const gunFarki = Math.round((etk.getTime() - sinir.getTime()) / 86_400_000);
  return gunFarki >= 3
    ? 'Katılım payını en geç 3 gün içinde aşağıdaki hesaba iletebilirsin.'
    : 'Katılım payını ilettiğinde biz kontrol edip sana döneceğiz.';
}

export const prerender = false;

type KayitBody = {
  format?: string;
  ad?: string;
  email?: string;
  telefon?: string;
  sehir?: string;
  kanal?: string;
  ekSorular?: Record<string, string>;
  etkinlikId?: string;
  seciliTarih?: string;
  ekonomikKatilim?: string;
  kvkk?: boolean;
  website?: string; // honeypot
  // Aşama 3a — promo + askı + sadece-askı
  promoKod?: string;
  kodId?: string;
  askiTutar?: number;
  askiNiyet?: string;
  sadeceAski?: boolean;
  // Aşama 2.5 — Kapı 1 kademeli dayanışma fiyatı. Aşama 3b — Kayıtlar
  // `Kademe` alanına yazılır (Kaan ekledi). Geçersiz/eksik → 'orta'.
  kademe?: Kademe;
  // Aşama 3b — ödeme yöntemi (kart | havale). Kart → checkoutBaslat → redirect.
  odemeYontemi?: 'kart' | 'havale';
};

const HAVALE_IBAN = import.meta.env.PUBLIC_HAVALE_IBAN ?? '';
const HAVALE_AD = import.meta.env.PUBLIC_HAVALE_AD ?? '';
const MAILERLITE_API_KEY = import.meta.env.MAILERLITE_API_KEY ?? '';

/**
 * Son tur (2026-06-14) — ref çakışma kontrolü: aday ref ile eşleşen kayıt
 * var mı? uretBenzersizReferansNo helper'ı bu fonksiyonu Kayıtlar +
 * Başvurular DB'leri için ardışık çağırır.
 *
 * DB başına property farkı: Kayıtlar'da referans `Kayıt ID` title alanında
 * (notionKayitlaraYaz title olarak yazıyor). Başvurular'da ayrı `Referans No`
 * rich_text property'si (notionBasvuruYaz onu yazıyor). DB ID'sine göre
 * filter tipi/adı dallandırılır — yoksa "Could not find property" 400 alınır.
 */
const refQuery: RefUniqueQuery = async (dbId, ref) => {
  const filter =
    dbId === NOTION_KAYITLAR_DB
      ? { property: 'Kayıt ID', title: { equals: ref } }
      : { property: 'Referans No', rich_text: { equals: ref } };
  const res = await notion.databases.query({
    database_id: dbId,
    filter,
    page_size: 1,
  });
  return res.results.length > 0;
};

const EMAIL_RE = /^[\x20-\x7E]+@[\x20-\x7E]+\.[\x20-\x7E]+$/;

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

type EtkinlikOkuma = {
  tutar: number | null;
  paraBirimi: string;
  /** Notion "Katılım Linki" rich_text — boş string olabilir (C-1 fallback). */
  katilimLinki: string;
  /** Notion "Mekân/Platform" select — Online | İzmir | İstanbul | Ege | Anadolu. */
  mekan: string;
  /** Notion "Zoom Şifresi" rich_text — zoom-olustur endpoint yazar, online'da dolu. */
  zoomSifresi: string;
  /** Notion "Tarih" date.start — ISO. tarihTrFormat ile Türkçe'ye çevrilir. */
  tarihISO: string;
  /** Notion "Zoom Başlangıç Saati" varsa o, yoksa "Saat" rich_text — "20:00" gibi. */
  saat: string;
  /** Notion "Konum Detay" rich_text — fiziksel etkinliklerde adres. */
  konumDetay: string;
  /** Aşama 3b-fix — etkinlik bazlı Kayıt Tipi. Boş → 'Direkt' (eski etkinlikler için güvenli default). */
  kayitTipi: KayitTipi;
};

function richTextStr(props: Record<string, any>, name: string): string {
  return (props[name]?.rich_text ?? [])
    .map((t: any) => t.plain_text ?? '')
    .join('')
    .trim();
}

async function etkinlikOku(etkinlikId: string): Promise<EtkinlikOkuma> {
  const page = await notion.pages.retrieve({ page_id: etkinlikId });
  const props = ('properties' in page ? page.properties : {}) as Record<string, any>;
  const ucret = props['Ücret']?.number ?? null;
  const paraBirimi = props['Para Birimi']?.select?.name ?? 'TRY';
  const katilimLinki = richTextStr(props, 'Katılım Linki');
  const mekan = props['Mekân/Platform']?.select?.name ?? '';
  const zoomSifresi = richTextStr(props, 'Zoom Şifresi');
  const tarihISO = props['Tarih']?.date?.start ?? '';
  // Online'da "Zoom Başlangıç Saati" (Katman 1'in yeni kolonu), fiziksel
  // etkinliklerde mevcut "Saat" rich_text. İkisinden hangisi doluysa onu al.
  const zoomSaat = richTextStr(props, 'Zoom Başlangıç Saati');
  const klasikSaat = richTextStr(props, 'Saat');
  const saat = zoomSaat || klasikSaat;
  const konumDetay = richTextStr(props, 'Konum Detay');
  // Aşama 3b-fix — Kayıt Tipi okuma; default 'Direkt' (eski etkinlikler).
  const kayitTipiRaw = props['Kayıt Tipi']?.select?.name;
  const kayitTipi: KayitTipi = kayitTipiRaw === 'Başvuru' ? 'Başvuru' : 'Direkt';
  return { tutar: ucret, paraBirimi, katilimLinki, mekan, zoomSifresi, tarihISO, saat, konumDetay, kayitTipi };
}

function formatKayitCevaplari(ekSorular: Record<string, string> | undefined): string {
  if (!ekSorular) return '';
  return Object.entries(ekSorular)
    .filter(([, v]) => v && v.trim())
    .map(([soru, cevap]) => `${soru}: ${cevap}`)
    .join('\n\n');
}

/**
 * Kapı 1 formatları (acik-kapi/workshop/mini-retreat/istanbul/seremoni) için
 * Kayıtlar DB'ye satır açar (Aşama 1.5, KARAR 76). Pending — gerçek tahsilat
 * henüz olmadı; `Ödenen Tutar` + `Ödeme Tarihi` ödeme onaylanınca yazılır
 * (Aşama 3).
 *
 * Enum tuzağı: Başvurular `Bekliyor/Muaf` ≠ Kayıtlar `Beklemede/Bedava`.
 * Kayıtlar enum'unu kullanıyoruz — yanlış option Notion API "option does
 * not exist" döner.
 *
 * Kullanıcıya dönen response değişmez; satırın hangi DB'ye düştüğü
 * kullanıcıdan saklı (havale yönergesi + OCAK-XXXXX aynı görünür).
 */
async function notionKayitlaraYaz(args: {
  body: KayitBody;
  ucretliMi: boolean;
  referansNo: string;
  /** Aşama 3b — Kademe Kayıtlar `Kademe` select alanına yazılır. */
  kademe: Kademe;
  /** Aşama 3b — yöntem 'kart' → "Kredi Kartı"; 'havale' → "Havale". Ücretsiz null. */
  yontem: 'kart' | 'havale';
  /** Aşama 3a — askı geldiyse Kayıtlar satırına eklenir (kendi+askı tek satır). */
  askiTutar?: number;
  askiNiyet?: string;
  /**
   * Aşama 3b-fix tam burs — kod adı (örn. "TESTBURS"). Sadece tam burs
   * akışında geçirilir; ödemeli kayıtlarda callback `Kullanılan Kod` yazımını
   * yapar (notion update ile). Çift yazımı önler.
   */
  kullanilanKod?: string;
}): Promise<string> {
  const { body, ucretliMi, referansNo, kademe, yontem, askiTutar, askiNiyet, kullanilanKod } = args;
  const KADEME_AD: Record<Kademe, string> = { ust: 'Üst', orta: 'Orta', alt: 'Alt' };
  const properties: Record<string, any> = {
    'Kayıt ID': { title: [{ text: { content: referansNo } }] },
    'Tip': { select: { name: 'Kayıt' } },
    'Kademe': { select: { name: KADEME_AD[kademe] } },
    'Kayıt Kaynağı': { select: { name: 'Site' } },
    'Ödeme Durumu': { select: { name: ucretliMi ? 'Beklemede' : 'Bedava' } },
  };
  if (body.ad) {
    properties['Kadın'] = { rich_text: [{ text: { content: body.ad } }] };
  }
  if (body.email) properties.Email = { email: body.email };
  if (body.telefon) properties.Telefon = { phone_number: body.telefon };
  // Aşama 3b-fix eyeball — Şehir opsiyonel rich_text. Boşsa atlanır.
  // Kayıtlar.Şehir property bu turda eklendi (Kaan + CC paralel).
  if (body.sehir) {
    properties['Şehir'] = { rich_text: [{ text: { content: body.sehir } }] };
  }
  if (body.seciliTarih) {
    properties['Seçilen Tarih'] = { rich_text: [{ text: { content: body.seciliTarih } }] };
  }
  if (body.etkinlikId) {
    properties['Etkinlikler'] = { relation: [{ id: body.etkinlikId }] };
  }
  const cevaplar = formatKayitCevaplari(body.ekSorular);
  if (cevaplar) {
    properties['Kayıt cevapları'] = { rich_text: [{ text: { content: cevaplar } }] };
  }
  // Aşama 3b — Ödeme Yöntemi yönteme göre. Ücretsizde anlamsız (boş).
  // Kart → "Kredi Kartı" jenerik (gerçek provider Aşama 6 — iyzico onayı sonrası
  // callback override edebilir).
  if (ucretliMi) {
    properties['Ödeme Yöntemi'] = { select: { name: yontem === 'kart' ? 'Kredi Kartı' : 'Havale' } };
  }
  // Askı katmanı (Aşama 3a) — kendi+askı tek satır. Tutar > 0 ise yazılır;
  // niyet opsiyonel. Bu, kayıt + askı verdi anlamına gelir.
  if (askiTutar && askiTutar > 0) {
    properties['Askı Tutarı'] = { number: askiTutar };
  }
  if (askiNiyet) {
    properties['Askı Katkısı'] = { rich_text: [{ text: { content: askiNiyet } }] };
  }
  // Aşama 3b-fix tam burs — Kullanılan Kod kayıt anında yazılır (tam burs
  // sayacı +1 ile birlikte). Ödemeli kayıtlarda callback yazar.
  if (kullanilanKod) {
    properties['Kullanılan Kod'] = { rich_text: [{ text: { content: kullanilanKod } }] };
  }
  // `Ödenen Tutar`, `Ödeme Tarihi` → ödeme ONAYLANINCA (Aşama 3b callback).
  // `Katıldı mı?`, `Geri Bildirim Verdi`, `Notlar` → kayıt anında dokunulmaz.

  const result = await notion.pages.create({
    parent: { database_id: NOTION_KAYITLAR_DB },
    properties,
  });
  return result.id;
}

/**
 * Aşama 3a — sadece-askı dalı. Kayıtlar'a AYRI satır: Tip="Askı Katkısı",
 * Etkinlikler relation BOŞ (genel havuz, formattan bağımsız), tarih/cevap
 * yok. Kişi katılımcı DEĞİL, sadece havuza katkı verdi.
 *
 * Ödeme havale (Beklemede + Havale); Aşama 3b'de provider/mock geldiğinde
 * yöntem ödeme-onay handler'ında override edilir.
 */
async function notionSadeceAskiYaz(args: {
  body: KayitBody;
  referansNo: string;
  /** Aşama 3b — yöntem kart/havale (sadece-askı da kart desteği). */
  yontem: 'kart' | 'havale';
}): Promise<string> {
  const { body, referansNo, yontem } = args;
  const properties: Record<string, any> = {
    'Kayıt ID': { title: [{ text: { content: referansNo } }] },
    'Tip': { select: { name: 'Askı Katkısı' } },
    'Kayıt Kaynağı': { select: { name: 'Site' } },
    'Ödeme Durumu': { select: { name: 'Beklemede' } },
    'Ödeme Yöntemi': { select: { name: yontem === 'kart' ? 'Kredi Kartı' : 'Havale' } },
    'Askı Tutarı': { number: body.askiTutar ?? 0 },
  };
  if (body.ad) properties['Kadın'] = { rich_text: [{ text: { content: body.ad } }] };
  if (body.email) properties.Email = { email: body.email };
  if (body.telefon) properties.Telefon = { phone_number: body.telefon };
  if (body.askiNiyet) {
    properties['Askı Katkısı'] = { rich_text: [{ text: { content: body.askiNiyet } }] };
  }
  const result = await notion.pages.create({
    parent: { database_id: NOTION_KAYITLAR_DB },
    properties,
  });
  return result.id;
}

async function notionBasvuruYaz(args: {
  format: KayitFormat;
  body: KayitBody;
  odemeDurumu: 'Bekliyor' | 'Muaf';
  referansNo: string;
}): Promise<string> {
  const { format, body, odemeDurumu, referansNo } = args;
  const tip = FORMAT_TIP[format];
  const properties: Record<string, any> = {
    Ad: { title: [{ text: { content: body.ad ?? '' } }] },
    Tip: { select: { name: tip } },
    'Ödeme Durumu': { select: { name: odemeDurumu } },
    // Brief 6 (KARAR 210): Referans No daima yazılır (Muaf dahil) —
    // izleme/audit faydası; success ekranı ödemesizde gizler.
    'Referans No': { rich_text: [{ text: { content: referansNo } }] },
  };
  if (body.email) properties.Email = { email: body.email };
  if (body.telefon) properties.Telefon = { phone_number: body.telefon };
  if (body.sehir) properties.Şehir = { rich_text: [{ text: { content: body.sehir } }] };
  if (body.kanal) properties['İlk dokunuş kanalı'] = { select: { name: body.kanal } };
  if (body.ekonomikKatilim) {
    properties['Ekonomik katılım'] = { select: { name: body.ekonomikKatilim } };
  }
  if (body.etkinlikId) properties.Etkinlik = { relation: [{ id: body.etkinlikId }] };
  if (body.seciliTarih) {
    properties['Seçilen Tarih'] = { rich_text: [{ text: { content: body.seciliTarih } }] };
  }
  const cevaplar = formatKayitCevaplari(body.ekSorular);
  if (cevaplar) {
    properties['Kayıt cevapları'] = { rich_text: [{ text: { content: cevaplar } }] };
  }

  const result = await notion.pages.create({
    parent: { database_id: NOTION_BASVURULAR_DB },
    properties,
  });
  return result.id;
}

async function mailerLiteEkle(args: {
  email: string;
  ad: string;
  groupId: string;
  /**
   * Brief 5 Yol C: opsiyonel MailerLite custom field'lar. Sadece doluysa
   * payload'a eklenir — Notion `Katılım Linki` boş etkinliklerde
   * `katilim_linki` hiç gönderilmez (C-1 güvenlik ağı).
   * Alanlar: etkinlik_adi (örn "Çember — 21 Haziran 2026"), katilim_linki
   * (Zoom URL veya adres). İkisi de global TEXT custom field; Kaan
   * MailerLite panelinde önceden açtı.
   */
  ekFields?: Record<string, string>;
}): Promise<{ ok: boolean; status: number; error?: string }> {
  if (!MAILERLITE_API_KEY) return { ok: false, status: 0, error: 'no-api-key' };
  try {
    const fields: Record<string, string> = { name: args.ad };
    if (args.ekFields) {
      for (const [k, v] of Object.entries(args.ekFields)) {
        if (v && v.trim()) fields[k] = v;
      }
    }
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

export const POST: APIRoute = async ({ request }) => {
  let body: KayitBody;
  try {
    body = (await request.json()) as KayitBody;
  } catch {
    return json({ status: 'error', message: 'JSON parse hatası' }, 400);
  }

  // Honeypot — bot doldurursa sessiz success, hiçbir şey yazma.
  if (body.website && body.website.trim()) {
    return json({ status: 'success', honeypot: true });
  }

  // Ortak validation (her iki dal için)
  if (!body.ad || !body.ad.trim()) {
    return json({ status: 'error', message: 'ad zorunlu' }, 400);
  }
  if (!body.email || !EMAIL_RE.test(body.email)) {
    return json({ status: 'error', message: 'email geçersiz' }, 400);
  }
  if (!body.kvkk) {
    return json({ status: 'error', message: 'KVKK onayı zorunlu' }, 400);
  }

  // ───────────────────────────────────────────────────────────────────────
  // SADECE-ASKI DALI (Aşama 3a) — etkinlik/format/ekonomik katılım atlanır.
  // Genel havuza katkı; havale yöntemi; ayrı Tip="Askı Katkısı" Kayıtlar
  // satırı. MailerLite çağrılmaz (format-bazlı grup yok, sadece-askı için
  // ayrı grup tanımlı değil).
  // ───────────────────────────────────────────────────────────────────────
  if (body.sadeceAski) {
    const askiTutar = Number(body.askiTutar);
    if (!Number.isFinite(askiTutar) || askiTutar <= 0) {
      return json({ status: 'error', message: 'askıTutar > 0 olmalı' }, 400);
    }
    const yontem: 'kart' | 'havale' = body.odemeYontemi === 'kart' ? 'kart' : 'havale';
    // Son tur — çakışma garantili ref: 6 hane + Notion unique check + retry.
    const referansNo = await uretBenzersizReferansNo(refQuery, [
      NOTION_KAYITLAR_DB,
      NOTION_BASVURULAR_DB,
    ]);
    let basvuruId: string;
    try {
      basvuruId = await notionSadeceAskiYaz({ body, referansNo, yontem });
    } catch (err) {
      return json(
        { status: 'error', message: 'Notion yazımı başarısız', detay: String(err).slice(0, 200) },
        500,
      );
    }
    // Tasarım turu 3 (ADIM 3) — havale açıklama: "Ad — OCAK-XXXXX". Kaan
    // bankada eşleştirmeyi referans no üzerinden yapar (kısa, net).
    const aciklamaSablonu = havaleAciklamasi({ ad: body.ad, referansNo });

    // Aşama 3b — kart yöntemi seçilirse checkoutBaslat (mock şimdi, iyzico
    // Aşama 6). Sayfa origin Vercel `x-forwarded-*` header'larından
    // (Bulgu 1 fix); basariUrl /odeme/tamam, hataUrl /odeme/iptal.
    let checkoutUrl: string | undefined;
    if (yontem === 'kart') {
      const provider = getPaymentProvider();
      const baseUrl = publicOrigin(request);
      const sonuc = await provider.checkoutBaslat({
        kayitId: basvuruId,
        referansNo,
        tutar: askiTutar,
        paraBirimi: 'TRY',
        ad: body.ad,
        email: body.email,
        basariUrl: `${baseUrl}/odeme/tamam?ref=${encodeURIComponent(referansNo)}`,
        hataUrl: `${baseUrl}/odeme/iptal?ref=${encodeURIComponent(referansNo)}`,
      });
      if ('redirectUrl' in sonuc) checkoutUrl = sonuc.redirectUrl;
    }

    return json({
      status: 'success',
      basvuruId,
      referansNo,
      mailerlite: null,
      mode: 'sadece-aski',
      aski: { tutar: askiTutar, ...(body.askiNiyet ? { niyet: body.askiNiyet } : {}) },
      odeme: {
        gerekli: true,
        tutar: askiTutar,
        paraBirimi: 'TRY',
        iban: yontem === 'havale' ? HAVALE_IBAN : '',
        ad: yontem === 'havale' ? HAVALE_AD : '',
        aciklama: yontem === 'havale' ? aciklamaSablonu : '',
        yontem,
      },
      katilim: { var: false, tipi: 'link', deger: '' },
      ...(checkoutUrl ? { checkoutUrl } : {}),
    });
  }

  // ───────────────────────────────────────────────────────────────────────
  // KAYIT DALI — Kapı 1 (Kayıtlar) / Kapı 2 (Başvurular)
  // ───────────────────────────────────────────────────────────────────────
  if (!body.format || !isKayitFormat(body.format)) {
    return json({ status: 'error', message: 'format geçersiz' }, 400);
  }
  if (!body.etkinlikId) {
    return json({ status: 'error', message: 'etkinlikId zorunlu' }, 400);
  }

  const format = body.format as KayitFormat;

  // Etkinliği oku — Notion Etkinlikler DB (Brief 5: ücret + Katılım Linki + Mekân)
  let etk: EtkinlikOkuma;
  try {
    etk = await etkinlikOku(body.etkinlikId);
  } catch (err) {
    return json(
      { status: 'error', message: 'etkinlik bulunamadı', detay: String(err).slice(0, 200) },
      500,
    );
  }
  // Aşama 2.5 — Kapı 1'de katmanA seçili kademe oranıyla türetilir
  // (frontend canlı tutar bloğuyla TEK kaynak — uyumsuzluk olmasın).
  // Aşama 3b-fix — Kayıt Tipi etkinlik bazlı dallanma. `Direkt` (mevcut Kapı 1
  // akışı): kademe × ücret + askı + promo + checkout + Kayıtlar. `Başvuru`:
  // sade Başvurular yazımı, kademe yok, askı yok, promo yok, ödeme yok.
  const direktAkis = isDirekt(etk.kayitTipi);
  const baseUcret = etk.tutar ?? 0;
  const kademe: Kademe =
    body.kademe === 'ust' || body.kademe === 'orta' || body.kademe === 'alt'
      ? body.kademe
      : 'orta';
  const katmanA = direktAkis ? kademeTutari(baseUcret, kademe) : baseUcret;
  const katmanB = direktAkis ? Math.max(0, Number(body.askiTutar) || 0) : 0;

  // Aşama 3a — promo SERVER-SIDE re-validate (client'a güvenme).
  // kodKullanimArtir BURADA ÇAĞRILMAZ — sayaç ödeme onayında artar (Aşama 3b).
  // Geçersiz promo → sessiz promo'suz devam (kullanıcı client'ta zaten gördü).
  let promoSonuc: KodSonuc | null = null;
  if (direktAkis && body.promoKod && body.promoKod.trim() && NOTION_KODLAR_DB) {
    try {
      // Aşama 3b-fix tasarım: indirim sadece Katman A (katılım payı) üzerine
      // uygulanır → kodDogrula'a SADECE A geçer. Kor (B) tam kalır.
      promoSonuc = await kodDogrula(
        notion,
        NOTION_KODLAR_DB,
        body.promoKod,
        format,
        katmanA,
      );
    } catch {
      promoSonuc = null;
    }
  }
  const hesap = uygulaIndirim(katmanA, katmanB, promoSonuc);

  const odemeGerekli = hesap.toplam > 0;
  const odemeDurumu: 'Bekliyor' | 'Muaf' = katmanA > 0 ? 'Bekliyor' : 'Muaf';

  // Brief 6 (KARAR 210) + Son tur: çakışma garantili ref (6 hane + Notion
  // unique check + retry). Notion yazımından önce üret — yazıma input +
  // response'a çıkış aynı değer.
  const referansNo = await uretBenzersizReferansNo(refQuery, [
    NOTION_KAYITLAR_DB,
    NOTION_BASVURULAR_DB,
  ]);

  // Aşama 3b — yöntem. Kart/havale; tam-burs + askısız → ödeme yok (gereksiz);
  // tutar > 0 ise yöntem anlamlı. Default havale (bugünkü akış).
  const yontem: 'kart' | 'havale' = body.odemeYontemi === 'kart' ? 'kart' : 'havale';

  // Aşama 3b-fix — etkinlik bazlı Kayıt Tipi dallanması.
  // `Direkt` → Kayıtlar (Kapı 1 mevcut akış: kademe + askı + promo + Ödeme Yöntemi).
  // `Başvuru` → Başvurular (sade: ad/email/telefon/etkinlik soruları/tarih; ödeme/askı/promo YOK).
  //   Format-bazlı whitelist (isKapi1) deprecated — etkinlik bazlı otorite.
  //   Başvuru'da Tip Notion enum'undan (cember → 'Çember', vb.) yazılır;
  //   `Kayda Dönüştür` automation (Aşama 1.6) Kayıtlar'a düşürür.
  //
  // Aşama 3b-fix tam burs sayacı: tam-burs ise Kayıtlar satırına
  // `Kullanılan Kod` da yazılır (kayıt anında, çünkü checkout/callback
  // hiç olmayacak). Sayaç +1 aşağıda.
  const tamBurs = !!(promoSonuc?.gecerli && promoSonuc.tip === 'tam-burs');
  const kullanilanKodAdi =
    tamBurs && body.promoKod ? body.promoKod.trim().toUpperCase() : undefined;
  let basvuruId: string;
  try {
    basvuruId = direktAkis
      ? await notionKayitlaraYaz({
          body,
          ucretliMi: odemeGerekli,
          referansNo,
          kademe,
          yontem,
          askiTutar: katmanB > 0 ? katmanB : undefined,
          askiNiyet: body.askiNiyet,
          kullanilanKod: kullanilanKodAdi,
        })
      : await notionBasvuruYaz({ format, body, odemeDurumu, referansNo });
  } catch (err) {
    return json(
      { status: 'error', message: 'Notion yazımı başarısız', detay: String(err).slice(0, 200) },
      500,
    );
  }

  // ────────────────────────────────────────────────────────────────────────
  // Aşama 3b-fix — kodKullanimArtir İKİNCİ çağrı noktası (tam burs).
  //
  // Çift sayım KORUMASI — net ayrım, dikkat:
  //   • ÖDEMELİ kayıt (Direkt + tutar > 0): /api/kayit pending açar (Bekle-
  //     mede). Ödeme onayı checkout → /api/odeme-callback.ts'te yapılır;
  //     `kodKullanimArtir` ORADA çağrılır. BURADA çağrılmaz.
  //   • TAM BURS (Direkt + promo tam-burs + tutar = 0): Bedava kayıt yazılır,
  //     checkout/callback hiç olmaz. `kodKullanimArtir` BURADA çağrılır
  //     (kontenjan için brief kararı 2026-06-09).
  //   • HAVALE (Direkt + tutar > 0 + yöntem havale): pending Beklemede; sayaç
  //     henüz artmaz. Kaan elle Ödendi'ye çekerken manuel düzeltir veya
  //     ileride Notion automation tetiklenir (henüz brief'lenmedi).
  //
  // Net: aynı kayıt için kodKullanimArtir TEK kez çağrılır — tam burs ise
  // burada, ödemeli/kart ise callback'te. İkisi birden mümkün değil çünkü
  // tam burs ödeme yapmaz (checkout yok).
  if (tamBurs && promoSonuc?.gecerli && promoSonuc.kodId) {
    try {
      const yeniSayac = await kodKullanimArtir(notion, promoSonuc.kodId);
      console.log(
        `[api/kayit] tam-burs kodKullanimArtir OK — kodId=${promoSonuc.kodId} ` +
          `kod="${kullanilanKodAdi ?? '?'}" yeniSayac=${yeniSayac}`,
      );
    } catch (err) {
      // Defansif: sayaç artırılamadıysa kayıt yine başarılı sayılır
      // (Kaan manuel düzeltir, kor verilen yer iptal edilmez).
      console.error('[api/kayit] tam-burs kodKullanimArtir hatası:', String(err).slice(0, 200));
    }
  }

  // Brief Katman 2 — katilim + MailerLite custom field (pure helper'lara delege).
  // Online vs fiziksel ayrımı helper içinde; boş alanlar payload'a girmez.
  const katilimTipi = katilimTipiCoz(etk.mekan);
  const linkVar = etk.katilimLinki.length > 0;
  const etkinlikAdi = etkinlikAdiFormatla(format, body.seciliTarih);
  // etkinlik_tarihi: form'daki seçili tarih (zaten Türkçe) varsa onu, yoksa
  // Notion Tarih ISO'yu Türkçe'ye çevir.
  const etkinlikTarihi = body.seciliTarih?.trim() || tarihTrFormat(etk.tarihISO);
  const ekFields = mailerLiteCustomFields({
    etkinlikAdi,
    etkinlikTarihi,
    etkinlikSaati: etk.saat,
    katilimTipi,
    katilimLinki: etk.katilimLinki,
    zoomSifresi: etk.zoomSifresi,
    mekan: etk.mekan,
    mekanAdres: etk.konumDetay,
  });

  // MailerLite — Brief 3 (KARAR 206) 6 format grup map'i tam.
  // Aşama 3b-fix: Başvuru tipinde MailerLite çağrılmaz (mail tetiklenmez;
  // Zoom linki / katılım bilgisi henüz yok, davet eden Notlar/Kaan elle yazar).
  const groupId = FORMAT_MAILERLITE_GROUP[format];
  let mailerlite: { ok: boolean; status: number; error?: string } | null = null;
  if (direktAkis && groupId) {
    mailerlite = await mailerLiteEkle({
      email: body.email,
      ad: body.ad,
      groupId,
      ekFields,
    });
  }

  // Aşama 3b eyeball Bulgu 2 + 3b-fix tasarım: havale açıklama insan-okur
  // sade. "Kaan — Mini Retreat · 21 Haziran 2026 · 20:00".
  // Tasarım turu 3 (ADIM 3) — havale açıklama "Ad — OCAK-XXXXX". Format+tarih
  // gerekmez (referans no banka açıklamasında eşleştirme için yeterli).
  const aciklamaSablonu = havaleAciklamasi({ ad: body.ad, referansNo });
  // ADIM 1 — havale vade metni (Direkt+havale success'inde gösterilecek):
  // 3+ gün varsa "3 gün içinde", yakınsa "ilettiğinde döneceğiz".
  const vadeMetni = havaleVadeMetni(etk.tarihISO);

  // Promo bilgisini response'a koy — frontend kullanıcıya teyit gösterebilir.
  const promoResp = promoSonuc
    ? promoSonuc.gecerli
      ? {
          gecerli: true as const,
          tip: promoSonuc.tip,
          indirimTutari: promoSonuc.indirimTutari,
        }
      : { gecerli: false as const, sebep: promoSonuc.sebep }
    : undefined;

  // Askı bilgisi response'a (kendi+askı dalı) — frontend success copy eki için.
  const askiResp =
    katmanB > 0
      ? { tutar: katmanB, ...(body.askiNiyet ? { niyet: body.askiNiyet } : {}) }
      : undefined;

  // Aşama 3b — kart yöntemi + Direkt + ödeme gerekli → checkoutBaslat
  // (mock; iyzico Aşama 6). promoSonuc.kodId callback'e taşınır
  // (kodKullanimArtir orada — ödeme onayında TEK çağrı noktası).
  let checkoutUrl: string | undefined;
  if (direktAkis && yontem === 'kart' && odemeGerekli) {
    try {
      const provider = getPaymentProvider();
      // Aşama 3b eyeball Bulgu 1 — origin Vercel x-forwarded-* header'larından.
      const baseUrl = publicOrigin(request);
      const promoKodId = promoSonuc?.gecerli ? promoSonuc.kodId : undefined;
      const sonuc = await provider.checkoutBaslat({
        kayitId: basvuruId,
        referansNo,
        tutar: hesap.toplam,
        paraBirimi: etk.paraBirimi,
        ad: body.ad,
        email: body.email,
        basariUrl: `${baseUrl}/odeme/tamam?ref=${encodeURIComponent(referansNo)}`,
        hataUrl: `${baseUrl}/odeme/iptal?ref=${encodeURIComponent(referansNo)}`,
        ...(promoKodId ? { kodId: promoKodId } : {}),
      });
      if ('redirectUrl' in sonuc) checkoutUrl = sonuc.redirectUrl;
    } catch (err) {
      // Provider hatası → checkout açılamadı, kullanıcıya hata dönelim
      // (Kayıtlar satırı zaten pending açıldı; Kaan elle temizler veya
      // tekrar dener).
      return json(
        { status: 'error', message: 'Ödeme sağlayıcı hatası', detay: String(err).slice(0, 200) },
        500,
      );
    }
  }

  // Aşama 3b-fix tasarım: Başvuru'da ödeme YOK (sade success — tutar/IBAN
  // gizli, sadece "başvurun ulaştı" mesajı). Direkt + havale → iban + aciklama.
  const havaleyiKullan = direktAkis && yontem === 'havale' && odemeGerekli;
  const odemeGerekliResp = direktAkis && odemeGerekli;

  return json({
    status: 'success',
    basvuruId,
    referansNo,
    mailerlite,
    mode: 'kayit',
    kayitTipi: direktAkis ? 'Direkt' : 'Başvuru',
    ...(promoResp ? { promo: promoResp } : {}),
    ...(askiResp ? { aski: askiResp } : {}),
    odeme: {
      gerekli: odemeGerekliResp,
      // Aşama 3a + 3b-fix tasarım: havale için TEK tutar = uygulaIndirim
      // sonucu (indirim sadece A'ya, sonra +B). Başvuru'da tutar=0.
      tutar: odemeGerekliResp ? hesap.toplam : 0,
      paraBirimi: etk.paraBirimi,
      iban: havaleyiKullan ? HAVALE_IBAN : '',
      ad: havaleyiKullan ? HAVALE_AD : '',
      aciklama: havaleyiKullan ? aciklamaSablonu : '',
      ...(direktAkis && odemeGerekli ? { yontem } : {}),
      // ADIM 1 — vade metni Direkt+havale success'inde gösterilir.
      ...(havaleyiKullan ? { vadeMetni } : {}),
    },
    // Aşama 3b-fix tasarım — Başvuru'da katilim gönderilmez (Zoom/adres
    // henüz yok). Direkt'te: link + (Online + dolu Notion alanı ise) Zoom
    // Şifresi success-katilim bloğuna.
    katilim: direktAkis
      ? {
          var: linkVar,
          tipi: katilimTipi,
          deger: linkVar ? etk.katilimLinki : '',
          ...(katilimTipi === 'link' && etk.zoomSifresi
            ? { zoomSifresi: etk.zoomSifresi }
            : {}),
        }
      : { var: false, tipi: 'link' as const, deger: '' },
    ...(checkoutUrl ? { checkoutUrl } : {}),
  });
};
