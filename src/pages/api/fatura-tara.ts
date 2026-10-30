// /api/fatura-tara — e-Arşiv faturalarını Uyumsoft'tan keser, PDF'i Resend'le
// gönderir (Kaan, 30 Eki 2026).
//
// n8n günde bir (09:00) çağırır. KARAR `lib/fatura.ts`'te (saf, testli); bu
// dosya Notion'u okur, kararı uygular, sayar. Kalıp `bildirim-tara.ts`.
//
// ── KURAL ──
// Yalnız TAHSİL EDİLMİŞ paraya: kartta `İşlem No`, havalede `Banka İşlem No`
// + `Ödeme Tarihi`. Etkinliğin ertesi günü. Gerisi `lib/fatura.ts` başlığında.
//
// ── KİMLİK ── `x-ocak-tarama` = `TARAMA_SIR` (bildirim-tara ile aynı sır;
// n8n'de credential zaten var). `?sir=` KABUL EDİLMEZ.
//
// ── KİP ──
//   `?kuru=1`        hiçbir şey kesilmez/yazılmaz/gönderilmez; kayıt başına
//                    karar listesi döner. İlk canlı çalıştırma BÖYLE (Kaan
//                    listeyi görüp onaylar, kesim ondan sonra).
//   `?kayit=OCAK-X`  yalnız o kayıt — canlı tek kayıt testi için.
//   env `FATURA_AKISI=acik` değilse yalnız kuru koşu çalışır (409).
//   Test ortamında (`UYUMSOFT_ORTAM` boş/test) gerçek koşu `?kayit=` ister.
//
// ── SIRA ── fatura kesilir → Notion'a No/ETTN/Tarih yazılır → PDF alınır →
// mail gider → `Fatura Maili Gitti`. Mail düşerse fatura yeniden KESİLMEZ;
// sonraki tarama yalnız maili dener (`mail-tekrar`). Aynı kayda ikinci fatura:
// Uyumsoft'un `LocalDocumentId` korumasına YASLANILMAZ (31 Eki: test hesabında
// ikinci fatura kesildi). Kendi kilidimiz: kesimden önce `Fatura Hatası`'na
// "kesim başladı" yazılır, başarıda silinir; yarıda kalırsa kayıt bir daha
// denenmez, Kaan bakar.
//
// ── YANIT ── yalnız Kayıt ID, sebep, tutar, satır adı. Ad/e-posta YOK (§8).
import type { APIRoute } from 'astro';
import { notion, queryDatabase, NOTION_KAYITLAR_DB } from '../../lib/notion.ts';
import { sabitZamanliEsit } from '../../lib/sabit-zamanli.ts';
import { trGun } from '../../lib/format-etkinlik.ts';
import { ilkAd } from '../../lib/davet-baglam.ts';
import { postaGonder, resendTasima, tutarMetni, SABLON } from '../../lib/posta.ts';
import {
  faturaKarari,
  faturaGovdesi,
  faturaTutari,
  satirAdi,
  type FaturaSatiri,
} from '../../lib/fatura.ts';
import {
  ALAN,
  etkinlikIdleri,
  etkinlikOzetiOku,
  faturaSatiriOku,
  faturaEttnOku,
  faturaKesildiYazimi,
  faturaKilidiYazimi,
  faturaHatasiYazimi,
  faturaMailiGittiYazimi,
  type EtkinlikOzeti,
} from '../../lib/fatura-notion.ts';
import { uyumsoftAyari, saticiSec, faturaGonder, faturaPdf, type UyumsoftAyar } from '../../lib/uyumsoft.ts';

export const prerender = false;

/** Çağrı başına en çok bu kadar fatura — Vercel fonksiyon süresi. Kalan yarına. */
const TAVAN = 10;

const BASLIK_ADI = 'x-ocak-tarama';

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

function kimlikGecerli(request: Request): { ok: boolean; sebep?: string } {
  const beklenen = (import.meta.env.TARAMA_SIR ?? '').trim();
  if (!beklenen) return { ok: false, sebep: 'sir-env-tanimsiz' };
  const gelen = (request.headers.get(BASLIK_ADI) ?? '').trim();
  if (!gelen) return { ok: false, sebep: 'sir-baslikta-yok' };
  if (!sabitZamanliEsit(gelen, beklenen)) return { ok: false, sebep: 'sir-yanlis' };
  return { ok: true };
}

async function guncelle(pageId: string, properties: Record<string, unknown>): Promise<boolean> {
  try {
    // biome-ignore lint: Notion SDK property birleşim tipi
    await notion.pages.update({ page_id: pageId, properties: properties as any });
    return true;
  } catch (err) {
    console.error(`[fatura-tara] Notion yazılamadı — ${String(err).slice(0, 200)}`);
    return false;
  }
}

type Aday = { satir: FaturaSatiri; ettn: string };

/**
 * Ödendi + mail gitmemiş kayıtlar. Filtre Notion'da: "faturası kesilmiş ve
 * maili gitmiş" satırlar hiç okunmaz. Sayfalama `queryDatabase`'te.
 * Etkinlikler önbellekli — aynı buluşmanın 20 kaydı tek okuma.
 */
async function adaylariOku(kayitFiltresi: string): Promise<Aday[]> {
  const ve: unknown[] = [
    { property: 'Tip', select: { equals: 'Kayıt' } },
    { property: 'Ödeme Durumu', select: { equals: 'Ödendi' } },
    { property: ALAN.faturaMailiGitti, checkbox: { equals: false } },
  ];
  if (kayitFiltresi) ve.push({ property: 'Kayıt ID', title: { equals: kayitFiltresi } });
  // biome-ignore lint: Notion filtre birleşim tipi
  const satirlar = await queryDatabase(NOTION_KAYITLAR_DB, { filter: { and: ve } as any });

  const onbellek = new Map<string, EtkinlikOzeti | null>();
  const etkinlik = async (id: string): Promise<EtkinlikOzeti | null> => {
    if (onbellek.has(id)) return onbellek.get(id) ?? null;
    let ozet: EtkinlikOzeti | null = null;
    try {
      const s = await notion.pages.retrieve({ page_id: id });
      if ('properties' in s) ozet = etkinlikOzetiOku(s.properties);
    } catch (err) {
      console.error(`[fatura-tara] etkinlik okunamadı — ${String(err).slice(0, 200)}`);
    }
    onbellek.set(id, ozet);
    return ozet;
  };

  const adaylar: Aday[] = [];
  for (const s of satirlar) {
    const p = s.properties;
    const idler = etkinlikIdleri(p);
    const ozet = idler.length === 1 ? await etkinlik(idler[0]) : null;
    adaylar.push({ satir: faturaSatiriOku(s.id, p, ozet), ettn: faturaEttnOku(p) });
  }
  return adaylar;
}

type Satir = {
  kayitId: string;
  karar: string;
  yontem?: string;
  tutar?: number;
  satirAdi?: string;
  faturaNo?: string;
  sonuc?: string;
};

async function mailGonder(ayar: UyumsoftAyar, s: FaturaSatiri, faturaNo: string, ettn: string): Promise<string> {
  if (!s.email) return 'mail-adres-yok';
  const pdf = await faturaPdf(ayar, ettn);
  if (!pdf.ok) {
    console.error(`[fatura-tara] PDF alınamadı — kayitId=${s.kayitId} ${pdf.hata}`);
    return 'pdf-hata';
  }
  const posta = await postaGonder(
    {
      sablon: SABLON.fatura,
      alici: s.email,
      kayitId: s.kayitId,
      degiskenler: {
        AD: ilkAd(s.kadin),
        FATURA_NO: faturaNo,
        SATIR: satirAdi(s.formatHam, s.etkinlikTarihi),
        TUTAR: tutarMetni(faturaTutari(s) ?? 0, 'TRY'),
        REFERANS_NO: s.kayitId,
      },
      ekler: [{ dosyaAdi: `${faturaNo}.pdf`, icerikBase64: pdf.deger, tur: 'application/pdf' }],
    },
    resendTasima(),
  );
  if (!posta.ok) return 'mail-hata';
  return (await guncelle(s.pageId, faturaMailiGittiYazimi())) ? 'mail-gitti' : 'mail-gitti-isaret-yok';
}

async function handle(request: Request): Promise<Response> {
  const kimlik = kimlikGecerli(request);
  if (!kimlik.ok) {
    console.warn(`[fatura-tara] 401 — ${kimlik.sebep}`);
    return new Response(null, { status: 401 });
  }

  const url = new URL(request.url);
  const kuru = url.searchParams.get('kuru') === '1';
  const kayitFiltresi = (url.searchParams.get('kayit') ?? '').trim();
  const acik = (import.meta.env.FATURA_AKISI ?? '').trim() === 'acik';
  if (!kuru && !acik) return json({ hata: 'FATURA_AKISI kapalı — yalnız ?kuru=1 çalışır' }, 409);

  const ayarSonucu = uyumsoftAyari({
    UYUMSOFT_ORTAM: import.meta.env.UYUMSOFT_ORTAM,
    UYUMSOFT_KULLANICI: import.meta.env.UYUMSOFT_KULLANICI,
    UYUMSOFT_SIFRE: import.meta.env.UYUMSOFT_SIFRE,
  });
  if (!ayarSonucu.ok) return json({ hata: ayarSonucu.hata }, 500);
  const ayar = ayarSonucu.ayar;
  // ⚠ Test ortamı Notion'un CANLI Kayıtlar'ını okur. Toplu gerçek koşu,
  // gerçek kadınlara test faturası maili + Notion'a test numarası demekti.
  // Testte gerçek koşu yalnız tek kayıtla (?kayit=, Kaan'ın test kaydı).
  if (ayar.ortam === 'test' && !kuru && !kayitFiltresi) {
    return json({ hata: 'test ortamında gerçek koşu yalnız ?kayit= ile' }, 409);
  }

  const simdi = new Date();
  const bugun = trGun(simdi);
  let adaylar: Aday[];
  try {
    adaylar = await adaylariOku(kayitFiltresi);
  } catch (err) {
    console.error(`[fatura-tara] Kayıtlar okunamadı — ${String(err).slice(0, 200)}`);
    return json({ hata: 'notion-okunamadi' }, 502);
  }

  const satirlar: Satir[] = [];
  const sayac: Record<string, number> = {};
  const say = (k: string) => { sayac[k] = (sayac[k] ?? 0) + 1; };
  let islenen = 0;

  for (const { satir: s, ettn } of adaylar) {
    const karar = faturaKarari(s, simdi);

    if (karar.tip === 'atla') {
      say(karar.sebep);
      // Etkinliği gelmemiş kayıt listeyi doldurmasın — sayıda kalır.
      if (karar.sebep !== 'etkinlik-bitmedi') satirlar.push({ kayitId: s.kayitId, karar: karar.sebep });
      continue;
    }

    if (karar.tip === 'mail-tekrar') {
      say('mail-tekrar');
      const kayit: Satir = { kayitId: s.kayitId, karar: 'mail-tekrar', faturaNo: s.faturaNo };
      if (!kuru && islenen < TAVAN) {
        islenen++;
        kayit.sonuc = ettn ? await mailGonder(ayar, s, s.faturaNo, ettn) : 'ettn-yok';
      }
      satirlar.push(kayit);
      continue;
    }

    say('kesilecek');
    const kayit: Satir = {
      kayitId: s.kayitId,
      karar: 'kes',
      yontem: karar.yontem,
      tutar: karar.toplam,
      satirAdi: satirAdi(s.formatHam, s.etkinlikTarihi),
    };
    satirlar.push(kayit);
    if (kuru) continue;
    if (islenen >= TAVAN) { kayit.sonuc = 'tavan-yarina'; continue; }
    islenen++;

    const govde = faturaGovdesi(
      {
        kayitId: s.kayitId, kadin: s.kadin, sehir: s.sehir, email: s.email,
        formatHam: s.formatHam, etkinlikTarihi: s.etkinlikTarihi, odemeTarihi: s.odemeTarihi,
        yontem: karar.yontem, toplam: karar.toplam,
      },
      saticiSec(ayar.ortam),
      simdi,
    );
    // Kilit yazılamıyorsa KESME: sonucu Notion'a yazamayacağımız bir faturayı
    // hiç kesmemek, iki kez kesmekten iyidir.
    if (!(await guncelle(s.pageId, faturaKilidiYazimi(bugun)))) {
      kayit.sonuc = 'kilit-yazilamadi';
      say('kilit-yazilamadi');
      continue;
    }
    const gonder = await faturaGonder(ayar, govde);
    if (!gonder.ok) {
      console.error(`[fatura-tara] fatura kesilemedi — kayitId=${s.kayitId} ${gonder.hata}`);
      await guncelle(s.pageId, faturaHatasiYazimi(gonder.hata, bugun));
      kayit.sonuc = 'fatura-hata';
      say('fatura-hata');
      continue;
    }
    const { numara, ettn: yeniEttn } = gonder.deger;
    kayit.faturaNo = numara;
    console.log(`[fatura-tara] kesildi — kayitId=${s.kayitId} no=${numara} ortam=${ayar.ortam}`);
    say('kesildi');
    if (!(await guncelle(s.pageId, faturaKesildiYazimi(numara, yeniEttn, bugun)))) {
      // Fatura VAR ama Notion bilmiyor. Mükerrer kesim LocalDocumentId'ye takılır;
      // yine de elle kapatılmalı → yanıtta ayrı sayılır.
      kayit.sonuc = 'kesildi-notion-yazilamadi';
      say('kesildi-notion-yazilamadi');
      continue;
    }
    kayit.sonuc = await mailGonder(ayar, s, numara, yeniEttn);
  }

  return json({
    kip: kuru ? 'kuru' : 'gercek',
    ortam: ayar.ortam,
    bugun,
    okunan: adaylar.length,
    islenen,
    sayac,
    satirlar,
  });
}

export const POST: APIRoute = ({ request }) => handle(request);
