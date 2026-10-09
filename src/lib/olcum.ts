/**
 * olcum.ts — `dataLayer` olaylarının TEK otoritesi (B118 İŞ B).
 *
 * ── Dört olay ──
 * `view_content` · `form_submit` · `begin_checkout` · `purchase`.
 * Adlar İngilizce KOD TANIMLAYICISIDIR; kamu metnine girmez (brief §5).
 *
 * ── Kod yalnız GTM'i bilir (KARAR 146) ──
 * Pixel ve GA4 kimliği buraya girmez, `fbq`/`gtag` çağrısı yapılmaz. Bu modül
 * `window.dataLayer`a push eder, orada durur. ViewContent / InitiateCheckout /
 * Purchase eşlemesi GTM arayüzünde yaşıyor.
 *
 * ── Rıza bilinmez (brief §4) ──
 * `window.dataLayer` rızadan bağımsız tanımlı (`Layout.astro`). Olaylar her
 * durumda push edilir; GTM yüklü değilse kimse okumaz. Bu modülün rızayı
 * sorgulaması gerekmiyor ve sorgulamaması bilinçli: iki kapı iki yerde
 * bozulur.
 *
 * ── Kişisel veri GİRMEZ (brief K-4) ──
 * Ad, soyad, e-posta, telefon, şehir hiçbir olayda taşınmaz. Olaylar yalnız
 * Kayıt ID, tutar, para birimi, etkinlik slug'ı ve yöntem taşır. `olayGonder`
 * bunu ÇALIŞMA ZAMANINDA da denetliyor — yasak bir anahtar gelirse o anahtar
 * düşürülür ve log'a bir satır basılır; olay yine gider (K-5).
 *
 * ── Ölçüm kaydı asla düşürmez (brief K-5) ──
 * `olayGonder` hiçbir koşulda throw etmez. `window` yok, `dataLayer` yok,
 * `push` patladı — hepsi sessiz/log'lu geçilir. Çağıranlar ayrıca `try/catch`
 * kullanmak zorunda kalmasın diye koruma BURADA.
 */

export type OlcumOlayi = 'view_content' | 'form_submit' | 'begin_checkout' | 'purchase';

/** Olayın taşıyabileceği değer tipleri. Nesne/dizi taşınmaz — düz alan. */
export type OlayDegeri = string | number | boolean;

export type OlayYuku = Record<string, OlayDegeri>;

/**
 * Hiçbir olayda görünmeyecek anahtarlar (brief K-4).
 *
 * Liste `KayitPayload`'ın kişisel alanlarından türetildi. Yeni bir kişisel
 * alan eklenirse buraya da katılır — `olcum.test.ts` listeyi payload'a karşı
 * değil, DAVRANIŞA karşı ölçüyor (yasak anahtar düşürülüyor mu).
 */
export const YASAK_ANAHTARLAR = [
  'ad',
  'soyad',
  'email',
  'e_posta',
  'eposta',
  'telefon',
  'sehir',
  'kadin',
  'name',
  'phone',
  'city',
] as const;

/** Para birimi yoksa düşülecek değer. Etkinliklerin ezici çoğunluğu TRY. */
export const PARA_BIRIMI_VARSAYILAN = 'TRY';

/**
 * Para birimini normalleştirir.
 *
 * ⚠ Brief §5 dört olayın hepsine sabit `"TRY"` yazıyordu. Gerçek şu: tutar
 * `Etkinlikler.Para Birimi` select'inden geliyor (`api/kayit.ts` →
 * `etkinlikOku`) ve TRY dışı bir değer taşıyabilir. Sabit yazmak, TRY olmayan
 * bir buluşmanın cirosunu Meta'ya TRY olarak bildirmek olurdu. O yüzden
 * gerçek değer kullanılıyor, `TRY` yalnız FALLBACK.
 */
export function paraBirimiNormalle(ham: string | null | undefined): string {
  const t = (ham ?? '').trim().toUpperCase();
  return /^[A-Z]{3}$/.test(t) ? t : PARA_BIRIMI_VARSAYILAN;
}

/** Tutarı olaya girecek sayıya çevirir. Geçersiz/negatif → 0. Kuruş korunur. */
export function degerNormalle(ham: unknown): number {
  const n = typeof ham === 'number' ? ham : Number(ham);
  if (!Number.isFinite(n) || n < 0) return 0;
  return n;
}

/**
 * Yasak anahtarları yükten ayıklar. Dönen ikili: temiz yük + düşürülen adlar.
 *
 * Karşılaştırma küçük harfe indirilerek yapılıyor: `Email`, `EMAIL`, `email`
 * aynı anahtar. Tanımsız/`null` değerler de düşer — olayda boş alan taşımanın
 * anlamı yok ve GTM'de boş değişken "undefined" dizesine dönüşüyor.
 */
export function yukuTemizle(ham: Record<string, unknown>): {
  yuk: OlayYuku;
  dusurulen: string[];
} {
  const yasak = new Set<string>(YASAK_ANAHTARLAR.map((a) => a.toLowerCase()));
  const yuk: OlayYuku = {};
  const dusurulen: string[] = [];
  for (const [anahtar, deger] of Object.entries(ham)) {
    if (yasak.has(anahtar.toLowerCase())) {
      dusurulen.push(anahtar);
      continue;
    }
    if (deger === undefined || deger === null || deger === '') continue;
    if (typeof deger === 'string' || typeof deger === 'number' || typeof deger === 'boolean') {
      yuk[anahtar] = deger;
      continue;
    }
    // Nesne/dizi/fonksiyon: taşınmaz. Sessizce atmak yerine düşürülen sayılır
    // ki log'da görünsün — bir çağıran kazara nesne geçiriyorsa fark edilsin.
    dusurulen.push(anahtar);
  }
  return { yuk, dusurulen };
}

/** `dataLayer` benzeri hedef — test bunu yerine geçirir, tarayıcı `window.dataLayer` verir. */
export type OlayHedefi = { push: (o: Record<string, unknown>) => unknown };

function varsayilanHedef(): OlayHedefi | null {
  if (typeof window === 'undefined') return null;
  const dl = (window as unknown as { dataLayer?: unknown }).dataLayer;
  if (!dl || typeof (dl as OlayHedefi).push !== 'function') return null;
  return dl as OlayHedefi;
}

/**
 * Olayı `dataLayer`a basar. **Asla throw etmez** (brief K-5).
 *
 * Dönen değer gerçekten gönderilip gönderilmediği — testler ve `purchase`
 * işaretleme mantığı buna bakıyor. `false` dönmesi bir hata değil, bir
 * durumdur (sunucuda koşuyoruz, `dataLayer` henüz yok, vb.).
 */
export function olayGonder(
  olay: OlcumOlayi,
  parametreler: Record<string, unknown> = {},
  hedef?: OlayHedefi | null,
): boolean {
  try {
    const { yuk, dusurulen } = yukuTemizle(parametreler);
    if (dusurulen.length > 0) {
      // Gürültülü ama akışı kırmayan uyarı: K-4 ihlali koda girdiyse görünsün.
      console.error(
        `[olcum] "${olay}" olayından taşınmayan alan(lar) düşürüldü: ${dusurulen.join(', ')}`,
      );
    }
    const h = hedef === undefined ? varsayilanHedef() : hedef;
    if (!h) return false;
    h.push({ event: olay, ...yuk });
    return true;
  } catch (err) {
    console.error(`[olcum] "${olay}" gönderilemedi: ${String(err).slice(0, 200)}`);
    return false;
  }
}

/* ────────────────────────── olay yükü kurucuları ────────────────────────── */

export type IcerikTipi = 'acik-kapi' | 'etkinlik';

/** `view_content` — `/acik-kapi` ve `/etkinlik/[slug]` yüklenince. */
export function viewContentYuku(
  icerikTipi: IcerikTipi,
  etkinlikSlug?: string | null,
): OlayYuku {
  const yuk: OlayYuku = { icerik_tipi: icerikTipi };
  const slug = (etkinlikSlug ?? '').trim();
  if (slug) yuk.etkinlik_slug = slug;
  return yuk;
}

/**
 * `form_submit` — MEVCUT olay, adı ve `form_type` alanı DEĞİŞMEZ.
 * GTM'deki Lead tetikleyicisi ona bağlı (brief §5).
 *
 * Yeni alanlar yanına ekleniyor. `kayit_id` yoksa (kayıt dışı formlar: iletişim,
 * bülten, Anadolu başvurusu) yalnız `form_type` taşınır — o üç bileşen bu
 * kurucuyu kullanmıyor, kendi tek alanlı push'unda kalıyor.
 */
export function formSubmitYuku(args: {
  formType: string;
  kayitId?: string | null;
  deger?: number | null;
  paraBirimi?: string | null;
  odemeYontemi?: string | null;
}): OlayYuku {
  const yuk: OlayYuku = { form_type: args.formType };
  const id = (args.kayitId ?? '').trim();
  if (id) yuk.kayit_id = id;
  if (args.deger !== undefined && args.deger !== null) {
    yuk.deger = degerNormalle(args.deger);
    yuk.para_birimi = paraBirimiNormalle(args.paraBirimi);
  }
  const yontem = (args.odemeYontemi ?? '').trim();
  if (yontem) yuk.odeme_yontemi = yontem;
  return yuk;
}

/** `begin_checkout` — kayıt yazıldı, kart seçildi, ödeme sayfasına gidilmek üzere. */
export function beginCheckoutYuku(args: {
  kayitId: string;
  deger: number;
  paraBirimi?: string | null;
}): OlayYuku {
  return {
    kayit_id: args.kayitId.trim(),
    deger: degerNormalle(args.deger),
    para_birimi: paraBirimiNormalle(args.paraBirimi),
  };
}

/** `purchase` — `/odeme/tamam`, koşullar sağlandıysa. */
export function purchaseYuku(args: {
  kayitId: string;
  deger: number;
  paraBirimi?: string | null;
}): OlayYuku {
  return {
    kayit_id: args.kayitId.trim(),
    deger: degerNormalle(args.deger),
    para_birimi: paraBirimiNormalle(args.paraBirimi),
  };
}

/* ─────────────────────────── purchase'ın kapısı ─────────────────────────── */

/**
 * `purchase` işareti — `localStorage` anahtarı.
 *
 * ⚠ `/odeme/tamam` REFERANS KODUYLA açılıyor (KARAR 613) ve o kod maillerde,
 * banka açıklamasında, WhatsApp'ta dolaşıyor. İşaret olmasa sayfanın her
 * açılışı yeni bir ödeme sayılırdı — aynı kadının cirosu Meta'ya beş kez
 * giderdi.
 */
export function purchaseIsaretAnahtari(kayitId: string): string {
  return `ocak-olay-purchase-${kayitId.trim()}`;
}

/** Notion `Ödeme Durumu` select'inin "ödendi" değeri — `api/odeme-callback.ts` bunu yazıyor. */
export const ODENDI = 'Ödendi';

/** Notion `Ödeme Yöntemi` select'inin kart değeri — `api/kayit.ts` ve callback bunu yazıyor. */
export const KART_YONTEMI = 'Kredi Kartı';

/**
 * Tarayıcıdan `purchase` atılsın mı?
 *
 * Beş koşulun HEPSİ (brief §5 + K-2):
 *  1. kayıt bulundu (`durum === 'bulundu'`)
 *  2. `Ödeme Durumu` = Ödendi
 *  3. `Ödeme Yöntemi` = Kredi Kartı — **havale tarayıcıdan ATILMAZ**, o yol
 *     sunucudan gidecek (İŞ D, henüz açılmadı)
 *  4. Kayıt ID var
 *  5. bu Kayıt ID için işaret YOK
 *
 * Tutar koşula GİRMİYOR ve bu bilinçli: tam burslu bir kayıt `Ödendi`
 * olmuyor (`Bedava` yazılıyor), yani 2. koşul onu zaten eliyor. Tutarı da
 * koşula koymak, kuruş hatası yüzünden gerçek bir ödemeyi sessizce
 * düşürebilirdi. Tutar olayın YÜKÜNE giriyor, kapısına değil.
 */
export function purchaseAtilsinMi(args: {
  kayitDurumu: string;
  odemeDurumu: string;
  odemeYontemi: string;
  kayitId: string;
  isaretliMi: boolean;
}): boolean {
  if (args.kayitDurumu !== 'bulundu') return false;
  if ((args.odemeDurumu ?? '').trim() !== ODENDI) return false;
  if ((args.odemeYontemi ?? '').trim() !== KART_YONTEMI) return false;
  if (!(args.kayitId ?? '').trim()) return false;
  if (args.isaretliMi) return false;
  return true;
}
