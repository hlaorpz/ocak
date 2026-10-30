/**
 * vakifbank.ts — VakıfBank Hesap Bilgi Servisleri istemcisi (hesap hareketleri).
 *
 * Kaynak: bankanın Postman koleksiyonu "Genel Test Dosyası - Hesap Bilgi"
 * + `Hesap_API.docx` (VakıfBank, 13 Eki 2026; Kaan iletti 30 Eki).
 *   Token:   POST {taban}/auth/oauth/v2/token   (form)
 *            client_id · client_secret · grant_type=b2b_credentials ·
 *            scope=account · consentId · resource=sandbox|production
 *   Hareket: POST {taban}/accountTransactions   (JSON, Bearer)
 *            { AccountNumber, StartDate, EndDate }  — tarih "…T00:00:00+03:00"
 *            → Data.AccountTransactions[] {TransactionId, TransactionDate,
 *              Amount, TransactionType ("1" gelen / "2" giden), Description, …}
 *            Sorgu başına ≤100 kayıt → GÜN GÜN sorulur.
 *
 * ⚠ ÖLÇÜLMEDİ (31 Eki): token yanıtının alan adı (`access_token` varsayıldı,
 * OAuth standardı) ve canlı token adresi (portal dokümanı başka bir host
 * gösteriyor: `inbound.apigateway…/oauth2/token`). İkisi de env'den ezilebilir;
 * sandbox koşusu kesinleştirecek. Container'dan 8443'e ağ yok.
 *
 * Env (Vercel — değerler dokümana yazılmaz, KARAR 469):
 *   VAKIFBANK_ORTAM          sandbox | production   (boş → sandbox)
 *   VAKIFBANK_CLIENT_ID      API Portal uygulamasının API Key'i
 *   VAKIFBANK_CLIENT_SECRET  API Secret
 *   VAKIFBANK_RIZA_NO        consentId (canlıda bankadan gelir)
 *   VAKIFBANK_HESAP_NO       OCAK hesabı (sandbox'ta boş olabilir)
 *   VAKIFBANK_TABAN          (ops.) varsayılan https://apigw.vakifbank.com.tr:8443
 *   VAKIFBANK_TOKEN_URL      (ops.) varsayılan {taban}/auth/oauth/v2/token
 *
 * Asla throw etmez; hata metnine sır girmez.
 */
import type { BankaHareketi } from './havale.ts';

export type VbOrtam = 'sandbox' | 'production';
export type VbAyar = {
  ortam: VbOrtam;
  clientId: string;
  clientSecret: string;
  rizaNo: string;
  hesapNo: string;
  taban: string;
  tokenUrl: string;
};

export type VbGetir = (
  url: string,
  init: { method: 'POST'; headers: Record<string, string>; body: string },
) => Promise<{ ok: boolean; status: number; text(): Promise<string> }>;

type Sonuc<T> = { ok: true; deger: T } | { ok: false; hata: string };

const VARSAYILAN_TABAN = 'https://apigw.vakifbank.com.tr:8443';
const kirp = (s: string, n = 300) => (s.length > n ? `${s.slice(0, n)}…` : s);

export function vbAyari(env: Record<string, string | undefined>): Sonuc<VbAyar> {
  const ham = (env.VAKIFBANK_ORTAM ?? '').trim().toLowerCase();
  if (ham && ham !== 'sandbox' && ham !== 'production') return { ok: false, hata: `VAKIFBANK_ORTAM geçersiz: ${ham}` };
  const ortam: VbOrtam = ham === 'production' ? 'production' : 'sandbox';
  const clientId = (env.VAKIFBANK_CLIENT_ID ?? '').trim();
  const clientSecret = (env.VAKIFBANK_CLIENT_SECRET ?? '').trim();
  const rizaNo = (env.VAKIFBANK_RIZA_NO ?? '').trim();
  const hesapNo = (env.VAKIFBANK_HESAP_NO ?? '').trim();
  const eksik = [
    !clientId && 'VAKIFBANK_CLIENT_ID',
    !clientSecret && 'VAKIFBANK_CLIENT_SECRET',
    !rizaNo && 'VAKIFBANK_RIZA_NO',
    ortam === 'production' && !hesapNo && 'VAKIFBANK_HESAP_NO',
  ].filter(Boolean);
  if (eksik.length) return { ok: false, hata: `env eksik: ${eksik.join(', ')}` };
  const taban = ((env.VAKIFBANK_TABAN ?? '').trim() || VARSAYILAN_TABAN).replace(/\/+$/, '');
  const tokenUrl = (env.VAKIFBANK_TOKEN_URL ?? '').trim() || `${taban}/auth/oauth/v2/token`;
  return { ok: true, deger: { ortam, clientId, clientSecret, rizaNo, hesapNo, taban, tokenUrl } };
}

async function istek(getir: VbGetir, url: string, headers: Record<string, string>, body: string, ad: string): Promise<Sonuc<unknown>> {
  let status = 0;
  let metin = '';
  try {
    const y = await getir(url, { method: 'POST', headers, body });
    status = y.status;
    metin = await y.text();
  } catch (e) {
    return { ok: false, hata: `${ad}: ağ hatası: ${kirp(String((e as Error)?.message ?? e))}` };
  }
  let govde: unknown;
  try {
    govde = JSON.parse(metin);
  } catch {
    return { ok: false, hata: `${ad}: HTTP ${status}, JSON değil: ${kirp(metin)}` };
  }
  if (status >= 400) return { ok: false, hata: `${ad}: HTTP ${status}: ${kirp(JSON.stringify(govde))}` };
  return { ok: true, deger: govde };
}

export async function tokenAl(a: VbAyar, getir: VbGetir = fetch as unknown as VbGetir): Promise<Sonuc<string>> {
  const form = new URLSearchParams({
    client_id: a.clientId,
    client_secret: a.clientSecret,
    grant_type: 'b2b_credentials',
    scope: 'account',
    consentId: a.rizaNo,
    resource: a.ortam,
  });
  const r = await istek(getir, a.tokenUrl, { 'Content-Type': 'application/x-www-form-urlencoded' }, form.toString(), 'token');
  if (!r.ok) return r;
  const g = r.deger as Record<string, unknown>;
  const token = g.access_token ?? g.accessToken ?? (g.Data as Record<string, unknown> | undefined)?.access_token;
  if (typeof token !== 'string' || !token) {
    // Yanıtın ANAHTARLARINI yaz, değerlerini değil — sır sızmasın.
    return { ok: false, hata: `token: access_token yok; yanıt anahtarları: ${Object.keys(g).join(',')}` };
  }
  return { ok: true, deger: token };
}

/** "2026-10-31" → "2026-10-31T00:00:00+03:00" */
const trGunBasi = (gun: string) => `${gun}T00:00:00+03:00`;

function gunEkle(gun: string, n: number): string {
  const d = new Date(`${gun}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

export type GunSonucu = { gun: string; adet: number; tavanaDegdi: boolean };

/**
 * [baslangic, bitis] arası (TR günleri, ikisi dahil) gelen/giden hareketler,
 * GÜN GÜN sorularak (sorgu başına ≤100 kayıt). Bir gün 100'e değerse
 * `tavanaDegdi` işaretlenir — o gün eksik okunmuş olabilir, uç bunu raporlar.
 */
export async function hareketleriOku(
  a: VbAyar,
  token: string,
  baslangic: string,
  bitis: string,
  getir: VbGetir = fetch as unknown as VbGetir,
): Promise<Sonuc<{ hareketler: BankaHareketi[]; gunler: GunSonucu[] }>> {
  const hareketler: BankaHareketi[] = [];
  const gunler: GunSonucu[] = [];
  const gorulen = new Set<string>();
  for (let gun = baslangic; gun <= bitis; gun = gunEkle(gun, 1)) {
    const r = await istek(
      getir,
      `${a.taban}/accountTransactions`,
      { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      JSON.stringify({ AccountNumber: a.hesapNo, StartDate: trGunBasi(gun), EndDate: trGunBasi(gunEkle(gun, 1)) }),
      `hareket ${gun}`,
    );
    if (!r.ok) return r;
    const g = r.deger as { Header?: { StatusCode?: string; StatusDescription?: string }; Data?: { AccountTransactions?: unknown[] } };
    const kod = g.Header?.StatusCode ?? '';
    if (kod && kod !== 'APIGW000000') {
      return { ok: false, hata: `hareket ${gun}: ${kod} ${kirp(String(g.Header?.StatusDescription ?? ''))}` };
    }
    const liste = Array.isArray(g.Data?.AccountTransactions) ? g.Data!.AccountTransactions! : [];
    for (const x of liste as Record<string, unknown>[]) {
      // Gün sınırı kapsayıcı olabilir (EndDate ertesi günün 00:00'ı) → aynı
      // hareket iki günde dönerse bir kez say. Anahtar no+zaman+tutar: sandbox
      // örneğinde TransactionId TEK BAŞINA tekrar ediyor.
      const anahtar = `${x.TransactionId}|${x.TransactionDate}|${x.Amount}`;
      if (gorulen.has(anahtar)) continue;
      gorulen.add(anahtar);
      hareketler.push({
        islemNo: String(x.TransactionId ?? ''),
        tarih: String(x.TransactionDate ?? ''),
        tutar: Number(x.Amount),
        tip: String(x.TransactionType ?? ''),
        aciklama: String(x.Description ?? ''),
      });
    }
    gunler.push({ gun, adet: liste.length, tavanaDegdi: liste.length >= 100 });
  }
  return { ok: true, deger: { hareketler, gunler } };
}

/**
 * Hesap listesi — rızanın gösterdiği hesaplar. Yanıt biçimi ÖLÇÜLMEDİ
 * (koleksiyonda örnek yok); `Data` olduğu gibi döner. Tanı içindir:
 * sandbox'ın hesap numarasını ve canlıda OCAK hesabının API'deki yazımını
 * görmek için (31 Eki: hareket sorgusu "Hesap numarası boş olamaz" dedi).
 */
export async function hesapListesi(a: VbAyar, token: string, getir: VbGetir = fetch as unknown as VbGetir): Promise<Sonuc<unknown>> {
  const r = await istek(
    getir,
    `${a.taban}/accountList`,
    { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    '{}',
    'hesap listesi',
  );
  if (!r.ok) return r;
  return { ok: true, deger: (r.deger as { Data?: unknown }).Data ?? r.deger };
}
