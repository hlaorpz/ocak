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
 */

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

export interface PaymentProvider {
  ad: string;
  checkoutBaslat(p: CheckoutBaslatGirdi): Promise<CheckoutBaslatSonuc>;
  odemeLinkiUret(p: OdemeLinkiGirdi): Promise<OdemeLinkiSonuc>;
}

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
