/**
 * payment-provider.ts — Ödeme sağlayıcı arayüzü (Brief: brief-odeme-asama3b-
 * provider-mock.md). İki metot:
 *
 *  1. `checkoutBaslat` — Kapı 1 site-içi Sanal POS checkout. Pending Kayıtlar
 *     satırı açıldıktan sonra çağrılır; sağlayıcının redirect URL'i döner,
 *     kullanıcı oraya yönlendirilir. Başarı sonrası sağlayıcı callback'imize
 *     döner ve satırı Ödendi'ye çekeriz.
 *
 *  2. `odemeLinkiUret` — Kapı 2 iyziLink (Aşama 1.6'da kullanılacak). Cember
 *     başvurusu onaylanınca Kayıtlar'a düşer, link kişiye ayrı kanaldan
 *     gönderilir. Bu briefte mock hazır dursun, çağrı 1.6'da.
 *
 * Sağlayıcı seçimi `PAYMENT_PROVIDER` env (`mock` | `iyzico`). `getPaymentProvider`
 * factory env'e göre döner. `iyzico` Aşama 6 — şu an `mock` default.
 *
 * MOCK güvenliği: mockPaymentProvider checkout URL'ine `?mock=1` query
 * koyar, callback handler bunu görürse Kayıtlar Notlar alanına "MOCK ödeme"
 * damgası ekler (yanlışlıkla canlıda mock kalırsa Notion'da görülür).
 *
 * ── Üçüncü metot: `dogrulaCallback` (10 Eyl 2026, İŞ 2) ──
 * `/api/odeme-callback` bugüne kadar KİMLİK DOĞRULAMASIZDI: gövdeyi kim
 * gönderirse göndersin kabul ediliyor, bir Kayıtlar satırı Ödendi'ye
 * çekilebiliyordu. Yan etki daha da genişti — `kodKullanimArtir` da o
 * route'tan çağrılıyor, yani doğrulamasız bir istek promo sayacını da
 * şişirebiliyordu.
 *
 * ⚠ **Doğrulama route'a değil buraya girdi (KARAR 395).** Route'a
 * `if (provider === 'nkolay')` yazmak iki kod yolunu elle eşit tutmak
 * demektir — sonsuz döngü. Sağlayıcı-özel bilgi sağlayıcı-özel yerde durur;
 * route yalnız "geçerli mi" diye sorar. N-Kolay onayı geldiğinde YALNIZ yeni
 * bir sağlayıcı nesnesi eklenir, route'a dokunulmaz.
 */

import { createHash, timingSafeEqual } from 'node:crypto';

export type CheckoutBaslatGirdi = {
  /** Notion Kayıtlar page id — callback bu satırı Ödendi'ye çeker. */
  kayitId: string;
  /**
   * Aşama 3b-fix tasarım — kullanıcıya görünen referans (OCAK-XXXX).
   * Mock checkout sayfası + success ekranı bunu gösterir. `kayitId`
   * (Notion UUID) Notion update için, `referansNo` (OCAK-XXXX)
   * kullanıcı görüntüleme için — ikisi ayrı.
   */
  referansNo: string;
  /** Toplam tutar TL (uygulaIndirim sonrası). */
  tutar: number;
  paraBirimi: string;
  ad: string;
  email: string;
  /** Kullanıcı ödedikten sonra dönecek site URL'i (success). */
  basariUrl: string;
  /** İptal/hata dönüş URL'i. */
  hataUrl: string;
  /** Promo kodu kullanıldıysa Notion page id — callback kodKullanimArtir çağırır. */
  kodId?: string;
};

export type CheckoutBaslatSonuc =
  | { redirectUrl: string }
  | { hata: string };

export type OdemeLinkiGirdi = {
  kayitId: string;
  tutar: number;
  paraBirimi: string;
  /** Kişiye gönderilecek havale/link açıklaması. */
  aciklama: string;
};

export type OdemeLinkiSonuc = { linkUrl: string } | { hata: string };

/**
 * Callback doğrulama sonucu. `sebep` YALNIZ log/teşhis içindir — 401
 * gövdesine yazılmaz. Çağırana "sır yanlış mı, hiç yok mu" demek, deneyen
 * birine hangi yönde ilerleyeceğini söylemek olurdu.
 */
export type CallbackDogrulama = { gecerli: boolean; sebep?: string };

export interface PaymentProvider {
  ad: string;
  checkoutBaslat(p: CheckoutBaslatGirdi): Promise<CheckoutBaslatSonuc>;
  odemeLinkiUret(p: OdemeLinkiGirdi): Promise<OdemeLinkiSonuc>;
  /**
   * Gelen callback gerçekten bu sağlayıcıdan mı geldi?
   *
   * Senkron — I/O yapmaz. Doğrulama ağ çağrısı gerektirmemeli: gerektirseydi
   * doğrulanmamış bir istek bize iş yaptırabilirdi (kendisi bir DoS yüzeyi).
   *
   * `govde` route'un ayrıştırdığı gövde; tipi `unknown` çünkü her sağlayıcı
   * farklı şey bekler (form-urlencoded, JSON, imzalı header). Sağlayıcı kendi
   * beklediği şekle kendisi daraltır.
   */
  dogrulaCallback(req: Request, govde: unknown): CallbackDogrulama;
}

/**
 * Paylaşılan sır — `ODEME_CALLBACK_SIR`. `PUBLIC_` öneki YOK: tarayıcıya
 * düşerse sır olmaktan çıkar. Tek okuyucu burası; `/odeme/mock` sayfası da
 * bu fonksiyonu çağırır (iki ayrı `import.meta.env` okuması, iki ayrı
 * yazım hatası ihtimali demekti).
 *
 * ⚠ Değer BUILD ZAMANINDA sabitlenir (`KART_AKISI` ile aynı mekanizma) —
 * Vercel'de anahtarı eklemek yetmez, REDEPLOY şart.
 */
export function callbackSirri(): string {
  return (import.meta.env.ODEME_CALLBACK_SIR ?? '').trim();
}

/**
 * Sabit-zamanlı dize karşılaştırması. Uzunluk farkının bile sızmaması için
 * ham dizeler değil SHA-256 özetleri karşılaştırılır — özetler daima aynı
 * uzunlukta olduğundan `timingSafeEqual` atmadan çalışır.
 *
 * Mock için fazla titiz görünebilir; bilinçli. Bu metot N-Kolay sağlayıcısına
 * DEVRALINACAK ve orada gerçek para var. Doğru deseni mock'ta kurmak, gerçek
 * sağlayıcı yazılırken "sonra düzeltiriz" borcu bırakmaktan ucuz.
 */
function sabitZamanliEsit(a: string, b: string): boolean {
  const ozetA = createHash('sha256').update(a, 'utf8').digest();
  const ozetB = createHash('sha256').update(b, 'utf8').digest();
  return timingSafeEqual(ozetA, ozetB);
}

/**
 * Sırrı istekten çıkarır: önce ayrıştırılmış gövde, sonra URL query.
 * Mock akışı form GET kullanıyor (Astro CSRF notu — `mock.astro`), o yüzden
 * query yolu gerçekten gerekli; POST webhook'ta gövde yolu kullanılır.
 */
function sirriCikar(req: Request, govde: unknown): string {
  if (govde instanceof URLSearchParams) {
    const g = govde.get(CALLBACK_SIR_ALANI);
    if (g) return g.trim();
  }
  try {
    return (new URL(req.url).searchParams.get(CALLBACK_SIR_ALANI) ?? '').trim();
  } catch {
    return '';
  }
}

/** Sırrın taşındığı alan adı — `mock.astro` formu da bunu kullanır. */
export const CALLBACK_SIR_ALANI = 'sir';

/**
 * Mock — gerçek para YOK. Test ve dev için. checkoutBaslat site-içi
 * `/odeme/mock` sayfasına redirect eder; sayfa "Ödemeyi Simüle Et" butonu
 * verir; başarıda /api/odeme-callback'e POST eder. Mock damgası callback'te
 * Notlar'a yazılır (KARAR — yanlışlıkla prod'da mock kalırsa görünür olsun).
 */
export const mockPaymentProvider: PaymentProvider = {
  ad: 'mock',
  async checkoutBaslat({ kayitId, referansNo, tutar, paraBirimi, ad, email, basariUrl, hataUrl, kodId }) {
    const url = new URL(basariUrl);
    url.pathname = '/odeme/mock';
    // Aşama 3b-fix tasarım: ref=OCAK-XXXX (kullanıcı görür), pageId=Notion
    // UUID (callback Notion update için). İkisi ayrı taşınır.
    url.searchParams.set('ref', referansNo);
    url.searchParams.set('pageId', kayitId);
    url.searchParams.set('tutar', String(tutar));
    url.searchParams.set('para', paraBirimi);
    url.searchParams.set('ad', ad);
    url.searchParams.set('email', email);
    url.searchParams.set('basari', basariUrl);
    url.searchParams.set('hata', hataUrl);
    if (kodId) url.searchParams.set('kodId', kodId);
    return { redirectUrl: url.toString() };
  },
  async odemeLinkiUret({ kayitId, tutar, paraBirimi }) {
    // 1.6'da kullanılacak; şu an stub.
    return {
      linkUrl: `https://example.invalid/mock-odeme-link?ref=${encodeURIComponent(kayitId)}&tutar=${tutar}&para=${paraBirimi}`,
    };
  },
  /**
   * Mock doğrulaması: paylaşılan sır. `/odeme/mock` formu aynı sırrı
   * `sir` alanında geri gönderir.
   *
   * ⚠ **FAIL-CLOSED — sır tanımsızsa GEÇERSİZ.** Ters kurgu (sır yoksa
   * doğrulamayı atla) bir ortamda anahtarı koymayı unutmayı sessizce
   * "doğrulama kapalı"ya çevirirdi; ödeme yüzeyi fail-open olamaz
   * (`kart-akisi.ts`'nin varsayılan-kapalı gerekçesiyle aynı ders).
   * Sır yokken callback'in 401 vermesi DOĞRU davranıştır, arıza değil.
   */
  dogrulaCallback(req, govde) {
    const beklenen = callbackSirri();
    if (!beklenen) return { gecerli: false, sebep: 'sir-env-tanimsiz' };
    const gelen = sirriCikar(req, govde);
    if (!gelen) return { gecerli: false, sebep: 'sir-istekte-yok' };
    if (!sabitZamanliEsit(gelen, beklenen)) return { gecerli: false, sebep: 'sir-yanlis' };
    return { gecerli: true };
  },
};

/**
 * Sağlayıcı seçimi env'den. `PAYMENT_PROVIDER` boş/undefined → mock default.
 * `iyzico` Aşama 6'da yazılacak — şu an çağrılırsa hata fırlatır (sessiz
 * yanlış-sağlayıcı yerine erken patlar).
 */
export function getPaymentProvider(): PaymentProvider {
  const which = (import.meta.env.PAYMENT_PROVIDER ?? 'mock').toLowerCase();
  if (which === 'mock') return mockPaymentProvider;
  if (which === 'iyzico') {
    throw new Error(
      'PAYMENT_PROVIDER=iyzico — Aşama 6\'da yazılacak (iyzicoPaymentProvider). Şimdilik PAYMENT_PROVIDER=mock kullan.',
    );
  }
  throw new Error(`PAYMENT_PROVIDER bilinmiyor: "${which}". Geçerli: mock | iyzico.`);
}
