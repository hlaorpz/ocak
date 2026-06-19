/**
 * api.ts — OCAK form gönderimleri için tek sabit endpoint kaynağı (#23 Brief 3,
 * brief-appscript-olum). Apps Script emekli; tüm formlar Astro server route'una
 * POST eder.
 *
 * Endpoint'ler:
 *  - /api/form  — ücretsiz lead formları (ates-mektuplari, anadolu-basvuru,
 *                 iletisim). Body: { formType, ...alanlar }, JSON.
 *  - /api/kayit — ücretli kayıt formları (KayitFormu, 6 format). KAYIT_API_URL
 *                 sabiti aşağıda.
 *
 * Token'lar (NOTION_TOKEN, MAILERLITE_API_KEY, NOTION_BASVURULAR_DB_ID) Vercel
 * env'inde server-side yaşar; client'a gitmez.
 */

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

/** /api/kayit success response shape (Brief 2A + Brief 5 + Brief 6 + Aşama 3a). */
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
  /**
   * Aşama 3a — kayıt vs sadece-askı dal ayrımı. Frontend success copy
   * bu alana göre seçilir: 'sadece-aski' = etkinlik/katılım bloğu yok,
   * "Bıraktığın kor..." metni.
   */
  mode?: 'kayit' | 'sadece-aski';
  /**
   * Aşama 3b-fix tasarım — etkinliğin Kayıt Tipi (Notion). Frontend success
   * ekranını ona göre seçer: 'Başvuru' → sade "Başvurun ulaştı" + tutar/IBAN
   * YOK; 'Direkt' → mevcut akış (ödendi / havale). mode='sadece-aski' iken
   * bu alan undefined.
   */
  kayitTipi?: 'Direkt' | 'Başvuru';
  /**
   * Aşama 3a — askı verisi (kendi+askı veya sadece-askı). Frontend
   * success'te "Bir kor daha bıraktın — teşekkürler" eki için.
   */
  aski?: { tutar: number; niyet?: string };
  /**
   * Aşama 3a — server-side promo doğrulama sonucu. Geçersiz/uygulanmadıysa
   * undefined. Frontend buradan kullanıcıya teyit gösterebilir.
   */
  promo?: {
    gecerli: boolean;
    tip?: 'yuzde' | 'sabit' | 'tam-burs';
    indirimTutari?: number;
    sebep?: string;
  };
  odeme?: {
    gerekli: boolean;
    /**
     * Aşama 3a: havale için TEK tutar = (A − indirim, tam-burs A=0) + askı.
     * Sadece-askı: tutar = askı. Tam burs + askı yok: tutar=0, gerekli=false.
     */
    tutar: number | null;
    paraBirimi: string;
    iban: string;
    ad: string;
    /** Tasarım turu 3 ADIM 3: "{ad} — {referansNo}" (kısa banka açıklaması). */
    aciklama: string;
    /** Aşama 3b — frontend success'te göstermek için (havale/kart). */
    yontem?: 'kart' | 'havale';
    /**
     * Tasarım turu 3 ADIM 1 — Direkt+havale success'inde gösterilen vade
     * metni; etkinlik tarihine göre dinamik:
     *  - 3+ gün: "Katılım payını en geç 3 gün içinde aşağıdaki hesaba iletebilirsin."
     *  - <3 gün: "Katılım payını ilettiğinde biz kontrol edip sana döneceğiz."
     */
    vadeMetni?: string;
  };
  /**
   * Aşama 3b — kart yöntemi seçilirse backend sağlayıcının checkout URL'ini
   * döndürür; frontend bu URL'e redirect eder. Havale akışında undefined.
   */
  checkoutUrl?: string;
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
    /**
     * Aşama 3b-fix tasarım — Zoom Şifresi (online link'le birlikte). Notion
     * "Zoom Şifresi" rich_text dolu ise frontend success-katilim bloğunda
     * link altında gösterilir. Mail'de de var (MailerLite `zoom_sifresi`
     * custom field). Boş/yoksa frontend gizler.
     */
    zoomSifresi?: string;
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
  /**
   * Aşama 3a (Brief brief-odeme-asama3a-promo-aski-backend.md):
   * - promoKod: kullanıcının girdiği kod (server-side re-validate edilir,
   *   client'a güvenilmez). Boş/undefined → indirim 0.
   * - kodId: client-side promo-dogrula çağrısının döndüğü Notion page id.
   *   Aşama 3b'de ödeme onaylanınca kodKullanimArtir bu id ile çağrılır.
   *   Şu an /api/kayit yine de server-side kodDogrula yapıyor; kodId
   *   ileride race-condition yumuşatma + audit izi.
   * - askiTutar / askiNiyet: "Bir kor daha taşı" (Kapı 1) — Kayıtlar.Askı
   *   Tutarı + Askı Katkısı alanlarına yazılır.
   * - sadeceAski: true ise etkinlikId/ekonomikKatilim opsiyonel; askıTutar
   *   zorunlu. Backend ayrı satır açar (Tip=Askı Katkısı, Etkinlikler boş).
   */
  promoKod?: string;
  kodId?: string;
  askiTutar?: number;
  askiNiyet?: string;
  sadeceAski?: boolean;
  /**
   * Aşama 2.5 — kademeli dayanışma fiyatı (Kapı 1). Seçilen kademe
   * (üst/orta/alt) katmanA'yı belirler (etkinlik.Ücret × oran).
   * Aşama 3b — Kayıtlar `Kademe` select alanına yazılır (Kaan ekledi).
   */
  kademe?: 'ust' | 'orta' | 'alt';
  /**
   * Aşama 3b — ödeme yöntemi (kart | havale). Default `havale` (bugünkü
   * akış). Kart seçilirse backend pending Kayıtlar satırı açar, sonra
   * `getPaymentProvider().checkoutBaslat(...)` → response.checkoutUrl,
   * frontend redirect. Tam burs (tutar=0) seçimden bağımsız ödeme yok.
   */
  odemeYontemi?: 'kart' | 'havale';
  /**
   * brief-davet-sistemi: davet eden ref izi (OCAK-XXXXX). Davet edileninin
   * tıkladığı linkte ?ref= var → /[format]/kayit hidden input → submit
   * payload → /api/kayit Kayıtlar DB `Davet Eden Ref` property'sine yazar.
   * n8n sonuç eşleştirmesi bu kolondan Davetler DB satırını "Geldi" yapar.
   */
  ref?: string;
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
