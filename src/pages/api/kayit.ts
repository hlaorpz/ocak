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
import { notion, NOTION_BASVURULAR_DB } from '../../lib/notion.ts';
import {
  FORMAT_TIP,
  FORMAT_MAILERLITE_GROUP,
  isKayitFormat,
  katilimTipiCoz,
  mailerLiteCustomFields,
  etkinlikAdiFormatla,
  tarihTrFormat,
  uretReferansNo,
  type KayitFormat,
} from '../../lib/kayit.ts';

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
};

const HAVALE_IBAN = import.meta.env.PUBLIC_HAVALE_IBAN ?? '';
const HAVALE_AD = import.meta.env.PUBLIC_HAVALE_AD ?? '';
const MAILERLITE_API_KEY = import.meta.env.MAILERLITE_API_KEY ?? '';

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
  return { tutar: ucret, paraBirimi, katilimLinki, mekan, zoomSifresi, tarihISO, saat, konumDetay };
}

function formatKayitCevaplari(ekSorular: Record<string, string> | undefined): string {
  if (!ekSorular) return '';
  return Object.entries(ekSorular)
    .filter(([, v]) => v && v.trim())
    .map(([soru, cevap]) => `${soru}: ${cevap}`)
    .join('\n\n');
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

  // Validation
  if (!body.format || !isKayitFormat(body.format)) {
    return json({ status: 'error', message: 'format geçersiz' }, 400);
  }
  if (!body.ad || !body.ad.trim()) {
    return json({ status: 'error', message: 'ad zorunlu' }, 400);
  }
  if (!body.email || !EMAIL_RE.test(body.email)) {
    return json({ status: 'error', message: 'email geçersiz' }, 400);
  }
  if (!body.kvkk) {
    return json({ status: 'error', message: 'KVKK onayı zorunlu' }, 400);
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
  const odemeGerekli = etk.tutar !== null && etk.tutar > 0;
  const odemeDurumu: 'Bekliyor' | 'Muaf' = odemeGerekli ? 'Bekliyor' : 'Muaf';

  // Brief 6 (KARAR 210): referans no Notion yazımından önce üret — yazıma
  // input + response'a çıkış aynı değer olsun.
  const referansNo = uretReferansNo();

  // Notion Başvurular satır yaz
  let basvuruId: string;
  try {
    basvuruId = await notionBasvuruYaz({ format, body, odemeDurumu, referansNo });
  } catch (err) {
    return json(
      { status: 'error', message: 'Notion yazımı başarısız', detay: String(err).slice(0, 200) },
      500,
    );
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
  const groupId = FORMAT_MAILERLITE_GROUP[format];
  let mailerlite: { ok: boolean; status: number; error?: string } | null = null;
  if (groupId) {
    mailerlite = await mailerLiteEkle({
      email: body.email,
      ad: body.ad,
      groupId,
      ekFields,
    });
  }

  // Brief 6 (KARAR 210): havale açıklama formatı "{referansNo} — {ad}" —
  // etkinlik adı/tarih çıkarıldı; referans no zaten kaydı işaret eder.
  const aciklamaSablonu = `${referansNo} — ${body.ad}`;

  return json({
    status: 'success',
    basvuruId,
    referansNo,
    mailerlite,
    odeme: {
      gerekli: odemeGerekli,
      tutar: etk.tutar,
      paraBirimi: etk.paraBirimi,
      iban: odemeGerekli ? HAVALE_IBAN : '',
      ad: odemeGerekli ? HAVALE_AD : '',
      aciklama: odemeGerekli ? aciklamaSablonu : '',
    },
    katilim: {
      var: linkVar,
      tipi: katilimTipi,
      deger: linkVar ? etk.katilimLinki : '',
    },
  });
};
