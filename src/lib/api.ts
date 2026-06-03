/**
 * api.ts — OCAK form gönderimleri için tek sabit endpoint kaynağı (#23 Brief 3).
 *
 * Tüm formlar (Ateş Mektupları, ileride basvuru/acik-kapi Astro'ya geçince) bu
 * unified Apps Script doPost endpoint'ine POST eder. formType ile ayrışırlar.
 *
 * Bu URL bir secret DEĞİL — public web-app URL'i. MailerLite/Sheets token'ları
 * Apps Script PropertiesService'te server-side yaşar, client'a hiç gitmez
 * (KARAR: token client'ta tutulmaz). Gövde: { formType, ...alanlar }.
 * Content-Type 'text/plain;charset=utf-8' — Apps Script CORS bypass pattern'i (legacy verbatim).
 */
export const APPS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycby0zKMg14Bwdc-0tHmgq6UGoY0Iczrep-WWxOj9HxobS2MNtk-aI920sXCWhsnW6-KKiw/exec';

/**
 * WhatsApp asistanı tek kaynak. wa.me uluslararası format (+1). Boş chat (text param yok).
 * Site geneli yüzen buton (WhatsappYuzen.astro), /iletisim Kanallar kartı ve Footer
 * link'i bu sabitten okur — numara değişirse tek yer dokunulur.
 */
export const WHATSAPP_URL = 'https://wa.me/15551911472';

/**
 * Ödemeli kayıt formları (KayitFormu component) için TEK hedef adres
 * (Brief 2B Adım 3 — backend-agnostik). İleride başka bir endpoint'e
 * göçerse sadece bu sabit değişir, form component'i dokunulmaz.
 */
export const KAYIT_API_URL = '/api/kayit';

/** /api/kayit success response shape (Brief 2A + Brief 5 + Brief 6). */
export type KayitResponse = {
  status: 'success' | 'error' | 'skip';
  basvuruId?: string;
  honeypot?: boolean;
  message?: string;
  mailerlite?: { ok: boolean; status: number; error?: string } | null;
  /**
   * Brief 6 (KARAR 210): "OCAK-XXXXX" — havale eşleştirmesi için.
   * Notion'a daima yazılır; success ekranında sadece ödemeli dalda
   * gösterilir (ödemesizde gereksiz).
   */
  referansNo?: string;
  odeme?: {
    gerekli: boolean;
    tutar: number | null;
    paraBirimi: string;
    iban: string;
    ad: string;
    /** Brief 6 (KARAR 210): "{referansNo} — {ad}" (havale açıklaması). */
    aciklama: string;
  };
  /**
   * Brief 5 (KARAR 208) Yol C: Etkinliğin Notion `Katılım Linki`'nden gelen
   * buluşma değeri — online'da Zoom URL, yüz-yüzde adres metni.
   *  - `var: false` → Notion'da boş, success ekranı fallback metnine düşer.
   *  - `tipi: 'link'` (Mekân/Platform=Online) / 'adres' (yüz-yüze) → success
   *    cümlesi seçimi.
   *  - `deger`: link veya adres string'i; var=false ise boş.
   */
  katilim?: {
    var: boolean;
    tipi: 'link' | 'adres';
    deger: string;
  };
};

export type KayitPayload = {
  format: string;
  ad: string;
  email: string;
  telefon?: string;
  sehir?: string;
  kanal?: string;
  ekSorular?: Record<string, string>;
  etkinlikId: string;
  seciliTarih?: string;
  ekonomikKatilim?: string;
  kvkk: boolean;
  /** Honeypot — gerçek kullanıcıda boş; bot doldurursa endpoint sessiz success döner. */
  website?: string;
};

/**
 * Ödemeli kayıt formları submit helper'ı. JSON POST → /api/kayit.
 * Hata: throw eder (caller try/catch). Success: response objesini döner.
 */
export async function submitKayit(payload: KayitPayload): Promise<KayitResponse> {
  const res = await fetch(KAYIT_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = (await res.json()) as KayitResponse;
  if (data.status === 'error') {
    throw new Error(data.message ?? 'Bilinmeyen API hatası');
  }
  return data;
}
