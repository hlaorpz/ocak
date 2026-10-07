/**
 * odeme-link.ts — kart devam linkinin imzası ve "ödeme başlatılabilir mi" kapısı.
 *
 * ── İmza neden var ──
 * `/odeme/devam?k=<Kayıt ID>` tek başına tahmin edilebilir: referanslar
 * `OCAK-XXXX` biçiminde ve dört karakterlik bir gövde deneyerek bulunabilir.
 * Birinin başkasının kaydını görmesi (tutar, başlık, tarih) ve onun adına
 * ödeme başlatması istenmiyor. İmza o yüzden var.
 *
 * ── İmza bir SIR DEĞİL ──
 * `ODEME_LINK_SIR` sırdır ve URL'e **girmez**; URL'e giren şey onun ürettiği
 * HMAC'tir. Bu ayrım brief §0'ın "sırlar yalnız istek başlığında taşınır"
 * kuralını bozmaz: imza bir doğrulama etiketi, taşınan bir kimlik bilgisi değil.
 * Tersi kurgu — sırrı query'ye koymak — mail sağlayıcısının, tarayıcı
 * geçmişinin ve Referer'ın sırrı görmesi demekti.
 *
 * ── Geçerlilik imzadan DEĞİL satırdan okunur ──
 * İmzaya süre gömülmedi. Gömülseydi iki gerçek olurdu: linkteki süre ve
 * Notion'daki `Yer Tutma Bitişi`. Havale uzatması bitişi değiştirdiğinde eski
 * link ölür, kadın elindeki mailden giremezdi. İmza "bu link bu kayıt için
 * üretildi" der, başka bir şey demez; süreyi satır söyler.
 */
import { createHmac } from 'node:crypto';
import { sabitZamanliEsit } from './sabit-zamanli.ts';

/** `ODEME_LINK_SIR` — production'da yazılı. Boşsa imza üretilemez/doğrulanamaz. */
export function odemeLinkSirri(): string {
  return (import.meta.env.ODEME_LINK_SIR ?? '').trim();
}

/** Kayıt ID → HMAC-SHA256 hex. Sır boşsa boş dize (çağıran fail-closed davranır). */
export function odemeLinkImzasi(kayitId: string, sir: string): string {
  if (!kayitId.trim() || !sir) return '';
  return createHmac('sha256', sir).update(kayitId.trim(), 'utf8').digest('hex');
}

/**
 * Tam link. Taban `publicOrigin` DEĞİL, kanonik adres: link maile giriyor ve
 * mail kalıcı bir yüzey. Preview deploy'dan üretilen bir link o deploy ölünce
 * ölürdü — `etkinlikUrlFormatla`'nın (kayit.ts) aynı gerekçesi.
 */
export const ODEME_LINK_TABAN = 'https://www.ocak.biz/odeme/devam';

export function odemeLinki(kayitId: string, sir: string): string {
  const imza = odemeLinkImzasi(kayitId, sir);
  if (!imza) return '';
  const u = new URL(ODEME_LINK_TABAN);
  u.searchParams.set('k', kayitId.trim());
  u.searchParams.set('i', imza);
  return u.toString();
}

/**
 * İmza doğrulaması — fail-closed.
 *
 * ⚠ Boşluklar AYRI AYRI denetleniyor, `sabitZamanliEsit`'e bırakılmıyor: o
 * fonksiyon `('','')` için `true` döner (kendi başlığındaki uyarı). Sır
 * yazılmamış bir sunucuda imzasız bir isteğin geçmesi demekti.
 */
export function odemeLinkiGecerli(kayitId: string, imza: string, sir: string): boolean {
  if (!sir) return false;
  if (!kayitId.trim() || !imza.trim()) return false;
  const beklenen = odemeLinkImzasi(kayitId, sir);
  if (!beklenen) return false;
  return sabitZamanliEsit(imza.trim(), beklenen);
}

// ──────────────────────────────────────────────────────────────────────────
// ÖDEME BAŞLATMA KAPISI
//
// Kaan kararı 2: kapı TEK fonksiyon olur ve İKİ yerde çağrılır —
// `/odeme/devam` VE `/odeme/nkolay`. Gerekçe ölçülmüş bir açık: referans
// maillerde yazılı ve `/odeme/nkolay` bugün `?ref=` ile bağımsız girilebiliyor,
// `Ödeme Durumu`'na da `Yer Tutma Bitişi`'ne de bakmadan. Kapı yalnız devam
// sayfasında olsaydı iptal edilmiş bir satır için `/odeme/nkolay?ref=` ile
// ödeme başlatılabilirdi.
//
// ⚠ Bu kapı CALLBACK'İ İLGİLENDİRMEZ. Başlamış bir ödemenin callback'i geç
// gelirse kabul edilir — para kazanır (brief §1). Callback kapıları
// değişmiyor (KARAR 593 · 594 · 595 · 601 · 602).
// ──────────────────────────────────────────────────────────────────────────

export type OdemeKapiGirdi = {
  /** Kayıtlar `Ödeme Durumu` select adı — `Beklemede` · `Ödendi` · `İptal` · … */
  odemeDurumu: string;
  /** Kayıtlar `Yer Tutma Bitişi` — `null` = alan boş (bu brief öncesi kayıt). */
  yerTutmaBitisi: Date | null;
  simdi: Date;
};

export type OdemeKapiSonuc =
  | { baslatilabilir: true }
  | { baslatilabilir: false; sebep: 'odendi' | 'iptal' | 'sure-doldu' | 'durum-uygun-degil' };

/**
 * Kural (Kaan kararı 2): `Ödendi` ya da `İptal` ya da `Yer Tutma Bitişi`
 * geçmiş → başlatma.
 *
 * `Yer Tutma Bitişi` **BOŞ** satırlar bugünkü gibi başlatılabilir: bu brief
 * öncesi açılmış kayıtlarda alan yok ve onları kapsama almak, ödemesini
 * yapmak isteyen bir kadının kapısını geçmişe dönük kapatmak olurdu.
 *
 * `Bedava` ve `İade` neden `durum-uygun-degil`: ikisinde de ödenecek bir şey
 * yok. `Bedava` ücretsiz kayıt, `İade` para geri verilmiş bir kayıt — ikisi
 * için de yeni bir çekim başlatmak yanlış olurdu.
 */
export function odemeBaslatilabilir(g: OdemeKapiGirdi): OdemeKapiSonuc {
  if (g.odemeDurumu === 'Ödendi') return { baslatilabilir: false, sebep: 'odendi' };
  if (g.odemeDurumu === 'İptal') return { baslatilabilir: false, sebep: 'iptal' };
  if (g.odemeDurumu !== 'Beklemede') return { baslatilabilir: false, sebep: 'durum-uygun-degil' };
  if (g.yerTutmaBitisi && g.yerTutmaBitisi.getTime() <= g.simdi.getTime()) {
    return { baslatilabilir: false, sebep: 'sure-doldu' };
  }
  return { baslatilabilir: true };
}
