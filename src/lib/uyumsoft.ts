/**
 * uyumsoft.ts — Uyumsoft BasicIntegrationApi REST istemcisi (e-Arşiv).
 *
 * Uç: POST https://efatura[-test].uyumsoft.com.tr/api/BasicIntegrationApi
 * Gövde: { Action, parameters: { ...,  userInfo: { Username, Password } } }
 * Ölçüldü (30 Eki 2026, test hesabı): SendInvoice → Data.Value[0].{Id,Number};
 * GetOutboxInvoicePdf → Data.Data (base64); CancelEArchiveInvoice → Value:true.
 *
 * Env (Vercel, Kaan girer — KARAR 469: dokümanda değer yok):
 *   UYUMSOFT_ORTAM      test | canli   (boş → test; canlıya geçiş bilinçli olur)
 *   UYUMSOFT_KULLANICI  canlıda zorunlu
 *   UYUMSOFT_SIFRE      canlıda zorunlu
 * Testte boşsa Uyumsoft'un herkese açık test hesabı kullanılır.
 *
 * Asla throw etmez — her çağrı { ok } döner; uç Notion'a hatayı yazar.
 * Hata metnine kişi verisi girmez: Uyumsoft mesajı kırpılıp döner.
 */
import { SATICI_CANLI, SATICI_TEST, type Satici } from './fatura.ts';

export type UyumsoftOrtam = 'test' | 'canli';

export type UyumsoftAyar = {
  ortam: UyumsoftOrtam;
  kullanici: string;
  sifre: string;
};

const ADRES: Record<UyumsoftOrtam, string> = {
  test: 'https://efatura-test.uyumsoft.com.tr/api/BasicIntegrationApi',
  canli: 'https://efatura.uyumsoft.com.tr/api/BasicIntegrationApi',
};

/** Uyumsoft'un yayımladığı ortak test hesabı — sır değil. */
const TEST_HESABI = { kullanici: 'Uyumsoft', sifre: 'Uyumsoft' };

export type Getir = (url: string, init: { method: 'POST'; headers: Record<string, string>; body: string }) =>
  Promise<{ ok: boolean; status: number; text(): Promise<string> }>;

export function uyumsoftAyari(env: Record<string, string | undefined>):
  { ok: true; ayar: UyumsoftAyar } | { ok: false; hata: string } {
  const ham = (env.UYUMSOFT_ORTAM ?? '').trim().toLowerCase();
  const ortam: UyumsoftOrtam = ham === 'canli' ? 'canli' : 'test';
  if (ham && ham !== 'canli' && ham !== 'test') return { ok: false, hata: `UYUMSOFT_ORTAM geçersiz: ${ham}` };
  const kullanici = (env.UYUMSOFT_KULLANICI ?? '').trim();
  const sifre = env.UYUMSOFT_SIFRE ?? '';
  if (ortam === 'canli') {
    if (!kullanici || !sifre) return { ok: false, hata: 'canlı ortamda UYUMSOFT_KULLANICI/UYUMSOFT_SIFRE boş' };
    return { ok: true, ayar: { ortam, kullanici, sifre } };
  }
  return {
    ok: true,
    ayar: { ortam, kullanici: kullanici || TEST_HESABI.kullanici, sifre: sifre || TEST_HESABI.sifre },
  };
}

/** Ortama göre satıcı: test hesabı yalnız kendi VKN'siyle fatura kabul eder. */
export function saticiSec(ortam: UyumsoftOrtam): Satici {
  return ortam === 'canli' ? SATICI_CANLI : SATICI_TEST;
}

type Sonuc<T> = { ok: true; deger: T } | { ok: false; hata: string };

const kirp = (s: string, n = 300) => (s.length > n ? `${s.slice(0, n)}…` : s);

async function cagir(
  ayar: UyumsoftAyar,
  action: string,
  parametreler: Record<string, unknown>,
  getir: Getir,
): Promise<Sonuc<Record<string, unknown>>> {
  let metin: string;
  let status: number;
  try {
    const yanit = await getir(ADRES[ayar.ortam], {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        Action: action,
        parameters: { ...parametreler, userInfo: { Username: ayar.kullanici, Password: ayar.sifre } },
      }),
    });
    status = yanit.status;
    metin = await yanit.text();
  } catch (e) {
    return { ok: false, hata: `${action}: ağ hatası: ${kirp(String((e as Error)?.message ?? e))}` };
  }
  let govde: Record<string, unknown>;
  try {
    govde = JSON.parse(metin);
  } catch {
    return { ok: false, hata: `${action}: HTTP ${status}, JSON değil: ${kirp(metin)}` };
  }
  const data = (govde?.Data ?? govde?.data) as Record<string, unknown> | undefined;
  if (!data || data.IsSucceded !== true) {
    const mesaj = String(data?.Message ?? govde?.Message ?? `HTTP ${status}`);
    return { ok: false, hata: `${action}: ${kirp(mesaj)}` };
  }
  return { ok: true, deger: data };
}

export type GidenFatura = { ettn: string; numara: string };

/** Tek fatura gönderir. `fatura` = `faturaGovdesi()` çıktısı. */
export async function faturaGonder(
  ayar: UyumsoftAyar,
  fatura: Record<string, unknown>,
  getir: Getir = fetch as unknown as Getir,
): Promise<Sonuc<GidenFatura>> {
  const r = await cagir(ayar, 'SendInvoice', { invoices: [fatura] }, getir);
  if (!r.ok) return r;
  const ilk = Array.isArray(r.deger.Value) ? (r.deger.Value[0] as Record<string, unknown>) : undefined;
  const ettn = String(ilk?.Id ?? '');
  const numara = String(ilk?.Number ?? '');
  if (!ettn || !numara) return { ok: false, hata: 'SendInvoice: başarılı ama Id/Number yok' };
  return { ok: true, deger: { ettn, numara } };
}

/** Kesilmiş faturanın PDF'i (base64). */
export async function faturaPdf(
  ayar: UyumsoftAyar,
  ettn: string,
  getir: Getir = fetch as unknown as Getir,
): Promise<Sonuc<string>> {
  const r = await cagir(ayar, 'GetOutboxInvoicePdf', { invoiceId: ettn }, getir);
  if (!r.ok) return r;
  // Ölçüm "base64 Data" dedi; zarfın hangi katmanı olduğu yazılmadı → üçü de denenir.
  const deger = r.deger.Value;
  const veri = r.deger.Data ?? (typeof deger === 'string' ? deger : (deger as Record<string, unknown> | undefined)?.Data);
  if (typeof veri !== 'string' || veri.length < 100) return { ok: false, hata: 'GetOutboxInvoicePdf: PDF verisi yok' };
  return { ok: true, deger: veri };
}
