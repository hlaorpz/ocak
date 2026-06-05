// /api/form — Ücretsiz lead formları endpoint'i (brief-appscript-olum).
//
// Apps Script doPost'un TS portu. 3 canlı formType ile dallanır:
//   - ates-mektuplari: ML-only (KARAR 126 — yeni davranış, Notion YAZMA)
//   - anadolu-basvuru: ML + Notion Tip:Anadolu (Code.gs handleAnadoluBasvuru
//     property eşlemesi birebir, "Niyet mektubu" + "Şu an" concat dahil)
//   - iletisim: Notion Tip:İletişim (mesaj → Notlar), ML yok
//
// Honeypot: body.website doluysa silent success (bot fail-open) — KARAR 152.
// Akış paritesi: handler hatasında 500 değil, kullanıcıya generic error;
// detay stdout'a (Apps Script Logger.log eşdeğeri). Ücretli kayıt akışı
// için /api/kayit kullanılır — bu endpoint dokunmaz.
//
// Frontend kontratı (KARAR 116): body { formType, ...fields } AYNEN korunur;
// component'ler sadece data-endpoint URL'ini ve Content-Type'ı değiştirir.
import type { APIRoute } from 'astro';
import {
  EMAIL_RE,
  json,
  mailerLiteEkle,
  notionBasvuruYaz,
} from '../../lib/forms-backend.ts';

export const prerender = false;

type FormBody = {
  formType?: string;
  email?: string;
  website?: string; // honeypot
  // ates-mektuplari
  ilk_dokunus_kanali?: string;
  // anadolu-basvuru
  ad?: string;
  telefon?: string;
  sehir?: string;
  yas?: string;
  niyet_mektubu?: string;
  su_an_nerede?: string;
  gecis_notu?: string;
  saglik_notu?: string;
  cember_deneyimi?: string;
  ekonomik_katilim?: string;
  // iletisim
  isim?: string;
  mesaj?: string;
};

const ATES_MEKTUPLARI_GROUP_ID = '187372384318130052';
const ANADOLU_GROUP_ID = '188446841699829225';

// Code.gs handleAnadoluBasvuru ekoMap birebir (Brief A teyitli option adları).
const EKONOMIK_KATILIM_MAP: Record<string, string> = {
  'Tam katılım — kendi yolculuğum için ödüyorum': 'Tam',
  'Burs/indirim talep ediyorum — uygun bir paylaşımla konuşmak isterim': 'Burs Talep',
  'Askıda yer almak istiyorum — başka bir kadına yer açmak için ek katkı': 'Askıda Yer',
};

function honeypotYakalandi(body: FormBody): boolean {
  return !!(body.website && body.website.trim());
}

async function handleAtesMektuplari(body: FormBody): Promise<Response> {
  if (honeypotYakalandi(body)) return json({ status: 'success', honeypot: true });
  if (!body.email || !EMAIL_RE.test(body.email)) {
    return json({ status: 'error', message: 'Email geçersiz' }, 400);
  }
  // Notion YAZMA (KARAR 126 — yeni davranış, Apps Script eski yazıyordu).
  const ml = await mailerLiteEkle({
    email: body.email,
    groupId: ATES_MEKTUPLARI_GROUP_ID,
  });
  if (!ml.ok) {
    console.error('[ates-mektuplari] ML fail:', ml.status, ml.error);
    return json({ status: 'error', message: 'MailerLite hatası' }, 500);
  }
  return json({ status: 'success' });
}

async function handleAnadoluBasvuru(body: FormBody): Promise<Response> {
  if (honeypotYakalandi(body)) return json({ status: 'success', honeypot: true });
  if (!body.email || !EMAIL_RE.test(body.email)) {
    return json({ status: 'error', message: 'Email geçersiz' }, 400);
  }
  if (!body.ad || !body.niyet_mektubu) {
    return json({ status: 'error', message: 'Zorunlu alanlar eksik' }, 400);
  }

  // Notion Başvurular DB — Tip:Anadolu (Code.gs property eşlemesi birebir).
  const ad = body.ad;
  const properties: Record<string, unknown> = {
    Ad: { title: [{ text: { content: ad } }] },
    Email: { email: body.email },
    Tip: { select: { name: 'Anadolu' } },
    Durum: { select: { name: 'Yeni' } },
    Kaynak: { rich_text: [{ text: { content: 'Anadolu' } }] },
  };
  if (body.telefon) properties.Telefon = { phone_number: body.telefon };
  if (body.ilk_dokunus_kanali) {
    properties['İlk dokunuş kanalı'] = { select: { name: body.ilk_dokunus_kanali } };
  }
  if (body.yas) {
    const yasNum = parseInt(body.yas, 10);
    if (Number.isFinite(yasNum)) properties['Yaş'] = { number: yasNum };
  }
  if (body.sehir) properties['Şehir'] = { rich_text: [{ text: { content: body.sehir } }] };

  // Niyet bloğu concat — Code.gs sıralaması verbatim (niyet önce, şu an sonra).
  const niyetParcalar: string[] = [];
  if (body.niyet_mektubu) {
    niyetParcalar.push('[Niyet mektubu]\n' + body.niyet_mektubu);
  }
  if (body.su_an_nerede) {
    niyetParcalar.push('[Şu an hayatında nerede]\n' + body.su_an_nerede);
  }
  if (niyetParcalar.length) {
    properties['Niyet mektubu'] = {
      rich_text: [{ text: { content: niyetParcalar.join('\n\n') } }],
    };
  }
  if (body.gecis_notu) {
    properties['Geçiş notu'] = { rich_text: [{ text: { content: body.gecis_notu } }] };
  }
  if (body.saglik_notu) {
    properties['Sağlık notu'] = { rich_text: [{ text: { content: body.saglik_notu } }] };
  }
  if (body.cember_deneyimi) {
    properties['Çember deneyimi'] = {
      rich_text: [{ text: { content: body.cember_deneyimi } }],
    };
  }
  if (body.ekonomik_katilim) {
    properties['Ekonomik katılım'] = {
      select: { name: EKONOMIK_KATILIM_MAP[body.ekonomik_katilim] ?? 'Tam' },
    };
  }

  // Apps Script paritesi KARAR 123: Notion fail → ML başarılıysa user yine
  // success görür. Burada try/catch ile yutulur, ML denenir.
  try {
    await notionBasvuruYaz(properties);
  } catch (err) {
    console.error('[anadolu-basvuru] Notion fail:', String(err).slice(0, 200));
  }

  const ml = await mailerLiteEkle({
    email: body.email,
    groupId: ANADOLU_GROUP_ID,
    fields: { name: ad, phone: body.telefon },
  });
  if (!ml.ok) {
    console.error('[anadolu-basvuru] ML fail:', ml.status, ml.error);
  }

  return json({ status: 'success' });
}

async function handleIletisim(body: FormBody): Promise<Response> {
  if (honeypotYakalandi(body)) return json({ status: 'success', honeypot: true });
  if (!body.email || !EMAIL_RE.test(body.email)) {
    return json({ status: 'error', message: 'Email geçersiz' }, 400);
  }
  if (!body.isim || !body.mesaj) {
    return json({ status: 'error', message: 'Zorunlu alanlar eksik' }, 400);
  }

  // Code.gs handleIletisim eşlemesi: Ad title (isim), mesaj → Notlar.
  const properties: Record<string, unknown> = {
    Ad: { title: [{ text: { content: body.isim } }] },
    Email: { email: body.email },
    Tip: { select: { name: 'İletişim' } },
    Durum: { select: { name: 'Yeni' } },
    Kaynak: { rich_text: [{ text: { content: 'İletişim' } }] },
    Notlar: { rich_text: [{ text: { content: body.mesaj } }] },
  };

  try {
    await notionBasvuruYaz(properties);
  } catch (err) {
    console.error('[iletisim] Notion fail:', String(err).slice(0, 200));
    return json({ status: 'error', message: 'Notion hatası' }, 500);
  }

  return json({ status: 'success' });
}

export const POST: APIRoute = async ({ request }) => {
  let body: FormBody;
  try {
    body = (await request.json()) as FormBody;
  } catch {
    return json({ status: 'error', message: 'JSON parse hatası' }, 400);
  }

  switch (body.formType) {
    case 'ates-mektuplari':
      return handleAtesMektuplari(body);
    case 'anadolu-basvuru':
      return handleAnadoluBasvuru(body);
    case 'iletisim':
      return handleIletisim(body);
    default:
      return json(
        { status: 'error', message: `Bilinmeyen formType: ${body.formType ?? '(boş)'}` },
        400,
      );
  }
};
