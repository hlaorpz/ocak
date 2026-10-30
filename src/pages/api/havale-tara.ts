// /api/havale-tara — VakıfBank hesap hareketlerini okur, açıklamadaki OCAK
// koduyla Kayıtlar'a bağlar (Kaan, 31 Eki 2026).
//
// n8n her sabah 09:00 çağırır; fatura taraması 10:00'da bu yazımlara bakar
// (`Banka İşlem No` = havalenin kanıtı). KARAR `lib/havale.ts`'te (saf, testli).
//
// ── YAZILAN (yalnız kesin eşleşmede) ──
//   Banka İşlem No · Ödeme Tarihi · Ödenen Tutar · Ödeme Yöntemi = Havale
//   + kayıt `Beklemede` ise `Ödeme Durumu = Ödendi` → bildirim taraması
//     saatlik koşusunda "yerin hazır" mailini atar (mevcut akış, değişmedi).
//
// ── KİMLİK ── `x-ocak-tarama` = `TARAMA_SIR` (fatura/bildirim taramasıyla aynı).
// ── KİP ──
//   `?kuru=1`  hiçbir şey yazılmaz; hareket başına karar listesi döner.
//   `?gun=N`   bugün dahil geriye N gün (varsayılan 3, en çok 31).
//   env `HAVALE_AKISI=acik` değilse yalnız kuru koşu (409).
//
// ── YANIT ── işlem no, tarih, tutar, kod, karar. Banka AÇIKLAMASI YOK:
// gönderen adını taşıyor (§8). Kaan işlem no ile bankada bakar.
import type { APIRoute } from 'astro';
import { notion, queryDatabase, NOTION_KAYITLAR_DB } from '../../lib/notion.ts';
import { sabitZamanliEsit } from '../../lib/sabit-zamanli.ts';
import { trGun } from '../../lib/format-etkinlik.ts';
import { ALAN } from '../../lib/fatura-notion.ts';
import { havalePlani, type HavaleKaydi } from '../../lib/havale.ts';
import { vbAyari, tokenAl, hareketleriOku } from '../../lib/vakifbank.ts';

export const prerender = false;

const BASLIK_ADI = 'x-ocak-tarama';
const VARSAYILAN_GUN = 3;
const AZAMI_GUN = 31;

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

// biome-ignore lint: Notion property ağacı tipsiz
const metin = (p: Record<string, any>, ad: string): string =>
  ((p[ad]?.rich_text ?? p[ad]?.title ?? []) as { plain_text?: string }[]).map((t) => t.plain_text ?? '').join('').trim();

function gunEkle(gun: string, n: number): string {
  const d = new Date(`${gun}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

/** Tüm `Tip = Kayıt` satırları + kullanılmış banka işlem no'ları. */
async function kayitlariOku(): Promise<{ kayitlar: Map<string, HavaleKaydi>; kullanilmis: Set<string> }> {
  const satirlar = await queryDatabase(NOTION_KAYITLAR_DB, {
    filter: { property: 'Tip', select: { equals: 'Kayıt' } },
  });
  const kayitlar = new Map<string, HavaleKaydi>();
  const kullanilmis = new Set<string>();
  for (const s of satirlar) {
    const p = s.properties as Record<string, any>; // biome-ignore lint: tipsiz
    const kayitId = metin(p, 'Kayıt ID');
    const bankaIslemNo = metin(p, ALAN.bankaIslemNo);
    if (bankaIslemNo) kullanilmis.add(bankaIslemNo);
    if (!kayitId) continue;
    kayitlar.set(kayitId, {
      pageId: s.id,
      kayitId,
      tip: p['Tip']?.select?.name ?? '',
      odemeDurumu: p['Ödeme Durumu']?.select?.name ?? '',
      beklenenTutar: typeof p['Beklenen Tutar']?.number === 'number' ? p['Beklenen Tutar'].number : null,
      bankaIslemNo,
      kartIslemNo: metin(p, 'İşlem No'),
    });
  }
  return { kayitlar, kullanilmis };
}

async function handle(request: Request): Promise<Response> {
  const kimlik = kimlikGecerli(request);
  if (!kimlik.ok) {
    console.warn(`[havale-tara] 401 — ${kimlik.sebep}`);
    return new Response(null, { status: 401 });
  }
  const url = new URL(request.url);
  const kuru = url.searchParams.get('kuru') === '1';
  const gunSayisi = Math.min(AZAMI_GUN, Math.max(1, Number(url.searchParams.get('gun')) || VARSAYILAN_GUN));
  const acik = (import.meta.env.HAVALE_AKISI ?? '').trim() === 'acik';
  if (!kuru && !acik) return json({ hata: 'HAVALE_AKISI kapalı — yalnız ?kuru=1 çalışır' }, 409);

  const ayar = vbAyari({
    VAKIFBANK_ORTAM: import.meta.env.VAKIFBANK_ORTAM,
    VAKIFBANK_CLIENT_ID: import.meta.env.VAKIFBANK_CLIENT_ID,
    VAKIFBANK_CLIENT_SECRET: import.meta.env.VAKIFBANK_CLIENT_SECRET,
    VAKIFBANK_RIZA_NO: import.meta.env.VAKIFBANK_RIZA_NO,
    VAKIFBANK_HESAP_NO: import.meta.env.VAKIFBANK_HESAP_NO,
    VAKIFBANK_TABAN: import.meta.env.VAKIFBANK_TABAN,
    VAKIFBANK_TOKEN_URL: import.meta.env.VAKIFBANK_TOKEN_URL,
  });
  if (!ayar.ok) return json({ hata: ayar.hata }, 500);
  // Sandbox'ın hareketleri bankanın uydurma verisi — canlı Notion'a ASLA yazılmaz.
  if (ayar.deger.ortam === 'sandbox' && !kuru) return json({ hata: 'sandbox ortamında yalnız ?kuru=1' }, 409);

  const bugun = trGun(new Date());
  const baslangic = gunEkle(bugun, -(gunSayisi - 1));

  const token = await tokenAl(ayar.deger);
  if (!token.ok) {
    console.error(`[havale-tara] ${token.hata}`);
    return json({ hata: token.hata }, 502);
  }
  const okuma = await hareketleriOku(ayar.deger, token.deger, baslangic, bugun);
  if (!okuma.ok) {
    console.error(`[havale-tara] ${okuma.hata}`);
    return json({ hata: okuma.hata }, 502);
  }

  let kayitlar: Map<string, HavaleKaydi>;
  let kullanilmis: Set<string>;
  try {
    ({ kayitlar, kullanilmis } = await kayitlariOku());
  } catch (err) {
    console.error(`[havale-tara] Kayıtlar okunamadı — ${String(err).slice(0, 200)}`);
    return json({ hata: 'notion-okunamadi' }, 502);
  }

  const plan = havalePlani(okuma.deger.hareketler, kayitlar, kullanilmis);
  const sayac: Record<string, number> = {};
  const say = (k: string) => { sayac[k] = (sayac[k] ?? 0) + 1; };
  const satirlar: Record<string, unknown>[] = [];

  for (const { hareket: h, karar } of plan) {
    if (karar.tip === 'atla') {
      say(karar.sebep);
      // Sessiz geçilenler: giden para, POS aktarımı, zaten yazılmış.
      if (karar.sebep === 'giden' || karar.sebep === 'pos-aktarimi' || karar.sebep === 'zaten-yazili') continue;
      satirlar.push({
        islemNo: h.islemNo, tarih: h.tarih, tutar: h.tutar, karar: karar.sebep,
        ...(karar.kod ? { kod: karar.kod } : {}), ...(karar.oneri ? { oneri: karar.oneri } : {}),
      });
      continue;
    }
    const kayit = { islemNo: h.islemNo, tarih: h.tarih, tutar: h.tutar, karar: 'eslesti', kod: karar.kayit.kayitId, odendiYap: karar.odendiYap } as Record<string, unknown>;
    satirlar.push(kayit);
    say('eslesti');
    if (kuru) continue;
    try {
      await notion.pages.update({
        page_id: karar.kayit.pageId,
        properties: {
          [ALAN.bankaIslemNo]: { rich_text: [{ type: 'text', text: { content: h.islemNo } }] },
          'Ödeme Tarihi': { date: { start: karar.odemeTarihi } },
          'Ödenen Tutar': { number: h.tutar },
          'Ödeme Yöntemi': { select: { name: 'Havale' } },
          ...(karar.odendiYap ? { 'Ödeme Durumu': { select: { name: 'Ödendi' } } } : {}),
        } as any, // biome-ignore lint: Notion SDK birleşim tipi
      });
      kayit.sonuc = 'yazildi';
      console.log(`[havale-tara] yazıldı — kayitId=${karar.kayit.kayitId} islemNo=${h.islemNo}`);
    } catch (err) {
      kayit.sonuc = 'notion-yazilamadi';
      say('notion-yazilamadi');
      console.error(`[havale-tara] Notion yazılamadı — kayitId=${karar.kayit.kayitId} ${String(err).slice(0, 200)}`);
    }
  }

  return json({
    kip: kuru ? 'kuru' : 'gercek',
    ortam: ayar.deger.ortam,
    aralik: [baslangic, bugun],
    okunanHareket: okuma.deger.hareketler.length,
    tavanaDegenGunler: okuma.deger.gunler.filter((g) => g.tavanaDegdi).map((g) => g.gun),
    sayac,
    satirlar,
  });
}

export const POST: APIRoute = ({ request }) => handle(request);
