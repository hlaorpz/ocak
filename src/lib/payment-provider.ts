/**
 * payment-provider.ts — Ödeme sağlayıcı arayüzü (Brief: brief-odeme-asama3b-
 * provider-mock.md). İki metot:
 *
 *  1. `checkoutBaslat` — Kapı 1 site-içi Sanal POS checkout. Pending Kayıtlar
 *     satırı açıldıktan sonra çağrılır; sağlayıcının redirect URL'i döner,
 *     kullanıcı oraya yönlendirilir. Başarı sonrası sağlayıcı callback'imize
 *     döner ve satırı Ödendi'ye çekeriz.
 *
 *  2. `odemeLinkiUret` — Kapı 2 link ile ödeme (Aşama 1.6'da kullanılacak). Cember
 *     başvurusu onaylanınca Kayıtlar'a düşer, link kişiye ayrı kanaldan
 *     gönderilir. Bu briefte mock hazır dursun, çağrı 1.6'da.
 *
 * Sağlayıcı seçimi `PAYMENT_PROVIDER` env (`mock` | `nkolay`). `getPaymentProvider`
 * factory env'e göre döner. `nkolay` gerçek tahsilat (11 Eyl 2026); `mock` default.
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
 * Ortak Ödeme Sayfası form girdisi (N-Kolay, 11 Eyl 2026).
 *
 * ── Neden ayrı bir metot, neden `checkoutBaslat` yetmedi ──
 * `CheckoutBaslatSonuc` bir **redirect URL** taşır; N-Kolay ise on alanlı bir
 * **form POST** bekler. İmzayı (`hashDataV2`) URL'e yazmak onu tarayıcı
 * geçmişine, Referer'a ve log'lara düşürürdü. Sözleşme korundu: `checkoutBaslat`
 * yine `{ redirectUrl }` döner — ama site-içi bir ara sayfaya (`/odeme/nkolay`)
 * ve formu o sayfa `odemeFormu()`'ndan alıp basar.
 *
 * `tutar` bu yapıya **Notion'dan** gelir, query'den değil: query'den okumak
 * kadının adres çubuğunda tutarı değiştirebilmesi demekti.
 */
export type OdemeFormuGirdi = {
  /** Kullanıcıya görünen referans (OCAK-XXXX). Sonek BURADA yok. */
  referansNo: string;
  /** Ödenecek toplam — Notion `Beklenen Tutar`. Kuruş korunur. */
  tutar: number;
  /** Sağlayıcının başarı dönüşünü POST edeceği URL (callback'in beklediği query ile). */
  basariUrl: string;
  /** Hata/iptal dönüşü. */
  hataUrl: string;
  /** `cardHolderIP` — zorunlu alan, boş geçilemez (`istemci-ip.ts`). */
  istemciIp: string;
  /**
   * `rnd` ve deneme soneki bu andan türetilir. Parametre olarak geçilir ki
   * (a) testte sabitlenebilsin, (b) **build zamanında donmasın** — modül
   * seviyesinde `new Date()` çağırmak KARAR 385/464'ün vakasıdır: değer
   * derleme anında sabitlenir ve her ödeme aynı `rnd`'yi taşır.
   */
  simdi: Date;
};

export type OdemeFormu =
  | {
      /** Formun POST edileceği sağlayıcı adresi. */
      actionUrl: string;
      /** Gönderilecek alanlar — sırası önemsiz, adları birebir. */
      alanlar: Record<string, string>;
    }
  | { hata: string };

/**
 * Callback doğrulama sonucu. `sebep` YALNIZ log/teşhis içindir — 401
 * gövdesine yazılmaz. Çağırana "sır yanlış mı, hiç yok mu" demek, deneyen
 * birine hangi yönde ilerleyeceğini söylemek olurdu.
 */
export type CallbackDogrulama = {
  gecerli: boolean;
  sebep?: string;
  /**
   * Sağlayıcının yetkilendirdiği tutar. Route bunu Notion `Beklenen Tutar` ile
   * kıyaslar; küçükse reddeder.
   *
   * ⚠ **YALNIZ imza kapsamındaki gövdeden doldurulur.** Dönüş POST'u
   * server-to-server DEĞİL — N-Kolay'ın sayfasından kullanıcının tarayıcısı
   * gönderiyor. Yani hash dışındaki her alan tamamen çağıranın kontrolünde;
   * oradan okunan bir tutar "kadının kendi yazdığı tutar" demek olurdu.
   */
  tutar?: number;
  /**
   * Kaydı çözecek referans — **soneksiz** `OCAK-XXXX`.
   *
   * ⚠ Bu da yalnız imza kapsamından gelir. Hash dışı bir alandan kayıt çözmek,
   * imzanın koruduğu şeyi imzasız alana devretmektir: geçerli imzalı tek bir
   * dönüşü yakalayan biri, referansı başkasının kaydına çevirip o kaydı
   * Ödendi'ye çekebilirdi.
   */
  referansKodu?: string;
  /**
   * İşlemin kimliği — Notion `İşlem No` alanına yazılır ve **replay muhafızı**
   * odur: alan doluysa aynı kayıt ikinci kez Ödendi'ye çekilemez.
   */
  islemNo?: string;
};

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
  /**
   * Ortak Ödeme Sayfası'na POST edilecek formu üretir. **Opsiyonel**: yalnız
   * form-POST akışı olan sağlayıcılar yazar (`nkolay`). `mock` yazmaz —
   * yazması gerekmiyor diye arayüze zorunlu koymak, mock'a anlamsız bir
   * gövde uydurtmak olurdu.
   *
   * Senkron ve I/O'suz, `dogrulaCallback` ile aynı gerekçe: tutar çağırana
   * (sayfaya) Notion'dan gelir, sağlayıcı yalnız imzalar.
   */
  odemeFormu?(p: OdemeFormuGirdi): OdemeFormu;
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

    // ── Üç alan (11 Eyl, ikinci tur) ──
    // Doğrulama semantiği DEĞİŞMEDİ: karar yine yalnız paylaşılan sırra bağlı,
    // dört senaryonun dördü de aynı sonucu veriyor. Alanlar route'un iki yeni
    // kapısı (tutar kıyası + replay kilidi) mock akışında da koşsun diye
    // dolduruluyor — yoksa route sağlayıcı ADINA dallanmak zorunda kalırdı
    // (KARAR 395) ya da alan yokluğunu "muhafızı atla"ya çevirirdi.
    //
    // ⚠ Mock'ta tutar query'den gelir ve bu bir zayıflık DEĞİL: route onu
    // Notion `Beklenen Tutar` ile kıyaslıyor, düşürülmüş bir değer reddedilir.
    const alan = (ad: string): string => {
      if (govde instanceof URLSearchParams) {
        const g = govde.get(ad);
        if (g) return g.trim();
      }
      try {
        return (new URL(req.url).searchParams.get(ad) ?? '').trim();
      } catch {
        return '';
      }
    };
    const referansKodu = alan('ref');
    const tutar = Number(alan('tutar'));
    return {
      gecerli: true,
      ...(referansKodu ? { referansKodu } : {}),
      ...(Number.isFinite(tutar) && tutar > 0 ? { tutar } : {}),
      // Mock'un işlem kimliği referanstan türer: aynı kayda ikinci mock
      // ödemesi replay kilidine takılır — gerçek akışla aynı davranış.
      ...(referansKodu ? { islemNo: `MOCK-${referansKodu}` } : {}),
    };
  },
};

// ───────────────────────────── N-KOLAY ─────────────────────────────────────
//
// Ortak Ödeme Sayfası. Biz form POST ederiz → N-Kolay kart sayfasını gösterir
// → sonuç bizim successUrl/failUrl'imize POST edilir. Server-to-server webhook
// YOK; yani ödemenin tek kanıtı dönüş POST'unun imzasıdır.

/** Sağlayıcı env yüzeyi. Hepsi `PUBLIC_` ÖNEKSİZ — sır ve kimlik tarayıcıya düşmez. */
function nkolayEnv() {
  return {
    sx: (import.meta.env.NKOLAY_SX ?? '').trim(),
    merchantSecret: (import.meta.env.NKOLAY_MERCHANT_SECRET ?? '').trim(),
    baseUrl: (import.meta.env.NKOLAY_BASE_URL ?? '').trim().replace(/\/+$/, ''),
  };
}

/**
 * `rnd` — `DD-MM-YYYY HH:mm:ss`.
 *
 * ⚠ **Hash'e giren dize ile gövdede giden dize BİREBİR aynı olmalı.** Bu yüzden
 * tek kaynaktan üretilip iki yere verilir; ikinci kez `uretRnd()` çağırmak
 * saniye sınırına denk geldiğinde imzayı sessizce bozar ve hata "bazen" görünür.
 *
 * Saat dilimi **Europe/Istanbul**: değer sağlayıcının panelinde insan gözüyle
 * okunuyor, sunucunun UTC'si orada yanlış saat gibi durur. `rnd`'nin işlevi
 * nonce olmak — dilim kozmetiktir, ama tutarlı olsun diye sabitlendi.
 * `Intl` ile üretilir; `toLocaleString` biçim sırası platforma göre değişir.
 */
export function uretRnd(simdi: Date): string {
  const p = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Istanbul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(simdi);
  const al = (t: string) => p.find((x) => x.type === t)?.value ?? '';
  // `en-GB` 24 saatte gece yarısını '24' verebilir; '00'a çevrilir.
  const saat = al('hour') === '24' ? '00' : al('hour');
  return `${al('day')}-${al('month')}-${al('year')} ${saat}:${al('minute')}:${al('second')}`;
}

/**
 * `clientRefCode` — `OCAK-XXXX-<epoch son 5>`.
 *
 * ── Sonek neden var ──
 * Aynı referans ikinci kez ödemeye girerse (ilk deneme başarısız, kadın tekrar
 * dener) sağlayıcının doğrulama/mutabakat servisi iki işlemi ayırt edemez.
 * Sonek her denemede değişir ve işlemleri ayırır.
 *
 * ── Sonek NEREYE SIZMAZ, NEREDE BİLEREK YAŞAR ──
 * Notion başlığına (`Kayıt ID`) ve `/odeme/tamam?ref=` değerine **girmez** —
 * ikisi de ref'i `equals` ile arıyor (`api/kayit.ts` refQuery ·
 * `odeme-kayit-oku.ts` sorgusu), sonek sızarsa eşleşme kırılır ve ödemesi
 * alınmış kadın "bulunamadı" ekranı görür.
 *
 * Buna karşılık Kayıtlar DB'sinin `Gönderilen Ref` (rich_text) alanında
 * **bilerek yaşar** (B202, 15 Eyl): mutabakat servisi işlemi bu tam kodla
 * sorgular, yazan yüzey `/odeme/nkolay` — form basılmadan hemen önce.
 * Alan son denemeyi taşır.
 * *(Bu paragrafın önceki hâli "yalnız giden `clientRefCode` alanında yaşar"
 * diyordu; alan açılmadan önce doğruydu, 15 Eyl'de dönüştürüldü.)*
 *
 * Kaynak zaman damgası (KARAR — Kaan, 11 Eyl): Notion'a sayaç kolonu açılmadı.
 * "Kaçıncı deneme" bilgisi bugün gerekmiyor; gerekirse N-Kolay PaymentList'ten
 * okunur. Epoch'un son 5 hanesi ~27 saatte bir tekrar eder — aynı referansın
 * aynı saniyesine denk gelme ihtimali pratikte yok.
 */
export function uretClientRefCode(referansNo: string, simdi: Date): string {
  const sonek = String(simdi.getTime()).slice(-5);
  return `${referansNo}-${sonek}`;
}

/**
 * `uretClientRefCode`'un tersi: `OCAK-XXXX-12345` → `OCAK-XXXX`.
 *
 * Biçim kapısı burada: dönüş gövdesinden gelen dize tam olarak bizim
 * ürettiğimiz şekle uymuyorsa `null` döner ve çağıran **fail-closed**
 * reddeder. Gevşek bir "son tireden böl" yaklaşımı, uydurma bir referansı
 * sessizce geçerli bir OCAK koduna çevirebilirdi.
 */
export const CLIENT_REF_BICIMI = /^(OCAK-[A-Z0-9]{4})-\d{5}$/;

export function soyEpochSoneki(kod: string): string | null {
  const m = CLIENT_REF_BICIMI.exec(kod.trim());
  return m ? m[1] : null;
}

/**
 * Tutarı sağlayıcının beklediği biçime çevirir: **nokta ayıraç, iki hane**.
 *
 * Ölçüldü (11 Eyl, Notion gidiş-dönüş): `number` property kuruşu KORUYOR —
 * 937.5 · 1234.56 · 0.01 üçü de birebir döndü. Yani KARAR 240'ın kuruş
 * koruması Notion'da hayatta kalıyor ve buraya bozulmadan geliyor.
 * `toFixed(2)` yerel ayraç kullanmaz (her zaman nokta), `toLocaleString`
 * kullansaydık `tr-TR` virgül basardı ve imza tutmazdı.
 */
export function nkolayTutar(tutar: number): string {
  return tutar.toFixed(2);
}

/** SHA-512 → base64. İki hash de aynı ilkel. */
function sha512Base64(veri: string): string {
  return createHash('sha512').update(veri, 'utf8').digest('base64');
}

/**
 * **Hash 1 — istek.**
 * `sx|clientRefCode|amount|successUrl|failUrl|rnd|customerKey|merchantSecretKey`
 *
 * `customerKey` bu turda gönderilmiyor ama **ayıracı yerinde durur** — boş
 * alanı atlamak diziyi kaydırır ve imza sessizce tutmaz.
 */
export function nkolayIstekHashDizesi(a: {
  sx: string;
  clientRefCode: string;
  amount: string;
  successUrl: string;
  failUrl: string;
  rnd: string;
  customerKey: string;
  merchantSecretKey: string;
}): string {
  return [
    a.sx,
    a.clientRefCode,
    a.amount,
    a.successUrl,
    a.failUrl,
    a.rnd,
    a.customerKey,
    a.merchantSecretKey,
  ].join('|');
}

/**
 * **Hash 2 — yanıt.**
 * `MERCHANT_NO|REFERENCE_CODE|AUTH_CODE|RESPONSE_CODE|USE_3D|RND|INSTALLMENT|
 *  AUTHORIZATION_AMOUNT|CURRENCY_CODE|merchantSecretKey`
 *
 * ⚠ `RND` **gövdeden** alınır; istekte gönderdiğimizden FARKLIDIR.
 * ⚠ `CURRENCY_CODE` bazı dönüşlerde hiç gelmiyor → kural: POST'ta ne geldiyse
 * o, gelmediyse **boş dize** (ayıraç yine yerinde durur).
 */
export const NKOLAY_YANIT_ALANLARI = [
  'MERCHANT_NO',
  'REFERENCE_CODE',
  'AUTH_CODE',
  'RESPONSE_CODE',
  'USE_3D',
  'RND',
  'INSTALLMENT',
  'AUTHORIZATION_AMOUNT',
  'CURRENCY_CODE',
] as const;

export function nkolayYanitHashDizesi(
  oku: (alan: string) => string,
  merchantSecretKey: string,
): string {
  return [...NKOLAY_YANIT_ALANLARI.map((a) => oku(a)), merchantSecretKey].join('|');
}

/**
 * Sırrı log'dan maskeler. Hash tutmadığında ham dizeyi görmek teşhisin
 * tamamıdır (hangi alan farklı, hangi ayıraç kaymış) — ama sır asla log'a
 * düşmez (CLAUDE.md §8).
 */
export function sirriMaskele(dize: string, sir: string): string {
  if (!sir) return dize;
  return dize.split(sir).join('[SECRET]');
}

/** `AUTH_CODE` bu üç değerden biriyse işlem yetkilendirilmemiştir. */
const GECERSIZ_AUTH_KODLARI = new Set(['', '0', '00']);

/** Başarılı işlemin `RESPONSE_CODE`'u. */
const BASARILI_RESPONSE_CODE = '2';

/**
 * N-Kolay sağlayıcısı.
 *
 * `checkoutBaslat` **sözleşmeyi korur** — `{ redirectUrl }` döner, `api/kayit.ts`
 * ve `KayitFormu.astro` hiç değişmez (`api.ts:116` `checkoutUrl` aynı). Redirect
 * site-içi ara sayfaya gider; on alanlı formu o sayfa `odemeFormu()`'ndan alır.
 */
export const nkolayPaymentProvider: PaymentProvider = {
  ad: 'nkolay',

  async checkoutBaslat({ referansNo, kodId }) {
    // ⚠ `kodId` redirect URL'ine taşınır. Taşınmazsa `/api/odeme-callback`
    // onu hiç görmez ve `kodKullanimArtir` — promo sayacının İLK ve TEK çağrı
    // noktası — hiç çalışmaz. Mock akışında da aynı sebeple taşınıyordu.
    const q = new URLSearchParams({ ref: referansNo });
    if (kodId) q.set('kodId', kodId);
    return { redirectUrl: `/odeme/nkolay?${q.toString()}` };
  },

  async odemeLinkiUret({ kayitId }) {
    // Kapı 2 (link ile ödeme) N-Kolay tarafında ayrı bir ürün; bu turda YOK.
    // Sessiz bir stub yerine açık hata: yanlış kapıdan geçen çağrı erken patlasın.
    return { hata: `N-Kolay link akışı yazılmadı (kayitId=${kayitId}).` };
  },

  odemeFormu({ referansNo, tutar, basariUrl, hataUrl, istemciIp, simdi }) {
    const { sx, merchantSecret, baseUrl } = nkolayEnv();
    // FAIL-CLOSED: eksik yapılandırmayla imzasız/yanlış bir form basmaktansa
    // hiç basmamak doğrudur. Sayfa bu hatayı gösterir, ödeme başlamaz.
    if (!sx) return { hata: 'NKOLAY_SX tanımsız' };
    if (!merchantSecret) return { hata: 'NKOLAY_MERCHANT_SECRET tanımsız' };
    if (!baseUrl) return { hata: 'NKOLAY_BASE_URL tanımsız' };
    if (!(tutar > 0)) return { hata: 'tutar geçersiz' };

    // ⚠ Üçü de TEK kaynaktan üretilir ve hem imzaya hem gövdeye AYNI dize
    // olarak verilir. İkinci kez üretmek imzayı sessizce bozar.
    const rnd = uretRnd(simdi);
    const clientRefCode = uretClientRefCode(referansNo, simdi);
    const amount = nkolayTutar(tutar);

    const hashDataV2 = sha512Base64(
      nkolayIstekHashDizesi({
        sx,
        clientRefCode,
        amount,
        successUrl: basariUrl,
        failUrl: hataUrl,
        rnd,
        // Gönderilmiyor ama ayıracı yerinde: boş alanı atlamak diziyi kaydırır.
        customerKey: '',
        merchantSecretKey: merchantSecret,
      }),
    );

    return {
      actionUrl: baseUrl,
      alanlar: {
        sx,
        amount,
        clientRefCode,
        successUrl: basariUrl,
        failUrl: hataUrl,
        rnd,
        use3D: 'true',
        transactionType: 'SALES',
        cardHolderIP: istemciIp,
        hashDataV2,
      },
    };
  },

  /**
   * Dönüş POST'unun doğrulaması. Server-to-server webhook olmadığı için
   * ödemenin tek kanıtı budur.
   *
   * Üç kapı, hepsi geçilmeli:
   *   1. `hashDataV2` tutar (sabit zamanlı karşılaştırma)
   *   2. `RESPONSE_CODE` === "2"
   *   3. `AUTH_CODE` ∉ { "", "0", "00" }
   *
   * ── Tutar ve replay muhafızı: SINIR KAPANDI (11 Eyl, ikinci tur) ──
   * Önceki tur bu metodu üç kapıyla bırakmıştı ve "imzalı ama düşük tutarlı
   * bir dönüş geçer" sınırı açıkta duruyordu. Kapandı: metot artık `tutar` ·
   * `referansKodu` · `islemNo` da döndürüyor ve route bunlarla iki kapı daha
   * kuruyor — Notion `Beklenen Tutar` kıyası ve `İşlem No` replay kilidi.
   * Kıyasın kendisi burada DEĞİL çünkü Notion okuması I/O; bu metot senkron
   * kalmalı (doğrulanmamış istek bize iş yaptıramaz).
   *
   * ⚠ Üç alan da **yalnız imza kapsamından** okunur. Dönüş POST'unu
   * kullanıcının tarayıcısı gönderiyor; hash dışı alan = saldırgan girdisi.
   *
   * successUrl'e düşmüş olmak başarı DEĞİLDİR; karar bu metodundur.
   */
  // `_req` kullanılmıyor: N-Kolay'ın kararı TAMAMEN imza kapsamındaki gövdeden
  // çıkar. İsteğin kendisine (URL, query, header) bakmak, imzasız yüzeyden
  // bilgi almak olurdu — arayüz imzası korunuyor, parametre bilinçli atıl.
  dogrulaCallback(_req, govde) {
    const { merchantSecret } = nkolayEnv();
    if (!merchantSecret) return { gecerli: false, sebep: 'nkolay-secret-tanimsiz' };

    // Gövde route'un ayrıştırdığı hâliyle gelir (`URLSearchParams`). Dönüş
    // POST'u form-urlencoded; JSON yolu da aynı yapıya çevriliyor.
    // ⚠ `CURRENCY_CODE` gelmeyebilir → okunamayan alan BOŞ DİZE olur, ayıraç
    // yerinde durur.
    const p = govde instanceof URLSearchParams ? govde : null;
    if (!p) return { gecerli: false, sebep: 'govde-yok' };
    const oku = (alan: string) => (p.get(alan) ?? '').trim();

    const gelenHash = oku('hashDataV2');
    if (!gelenHash) return { gecerli: false, sebep: 'hash-istekte-yok' };

    const hamDize = nkolayYanitHashDizesi(oku, merchantSecret);
    const beklenen = sha512Base64(hamDize);
    if (!sabitZamanliEsit(gelenHash, beklenen)) {
      // ⚠ İlk test işleminde farkı tek bakışta görebilmek için ham dize
      // log'a basılır — SIR MASKELİ (CLAUDE.md §8). Bu satır teşhisin
      // tamamıdır: hangi alan farklı, hangi ayıraç kaymış.
      console.warn(
        `[nkolay] hashDataV2 tutmadı — hesaplanan ham dize: ${sirriMaskele(hamDize, merchantSecret)}`,
      );
      return { gecerli: false, sebep: 'hash-yanlis' };
    }

    if (oku('RESPONSE_CODE') !== BASARILI_RESPONSE_CODE) {
      return { gecerli: false, sebep: 'response-code-basarisiz' };
    }
    if (GECERSIZ_AUTH_KODLARI.has(oku('AUTH_CODE'))) {
      return { gecerli: false, sebep: 'auth-code-gecersiz' };
    }

    // ── Kaydı çözecek referans: YALNIZ `REFERENCE_CODE` ──
    // `CLIENT_REFERENCE_CODE` KULLANILMIYOR ve bu bilinçli: o alan hash
    // kapsamında değil, yani tarayıcıdan serbestçe yazılabilir. Kaydı oradan
    // çözmek, imzanın koruduğu şeyi imzasız bir alana devretmek olurdu.
    //
    // ⚠ ÖLÇÜLMEDİ: `REFERENCE_CODE`'un bizim `clientRefCode`'umuzun yankısı
    // olduğu VARSAYIM. Altın vektör yok, canlı işlem koşulmadı. Biçim
    // tutmazsa fail-closed reddediyoruz ve gövdenin ALAN ADLARINI log'a
    // basıyoruz — ilk test işlemi gerçek alan adını söyleyecek.
    const hamRef = oku('REFERENCE_CODE');
    const referansKodu = soyEpochSoneki(hamRef);
    if (!referansKodu) {
      console.warn(
        `[nkolay] REFERENCE_CODE biçimi tutmadı (fail-closed) — gövdedeki ALAN ADLARI: ` +
          `${[...p.keys()].join(', ')}`,
      );
      return { gecerli: false, sebep: 'referans-bicimi-tutmadi' };
    }

    // Tutar imza kapsamından; ayrıştırılamıyorsa geçersiz sayılır (0 döndürüp
    // kıyası sessizce kazandırmak yerine).
    const tutar = Number(oku('AUTHORIZATION_AMOUNT'));
    if (!Number.isFinite(tutar) || tutar <= 0) {
      return { gecerli: false, sebep: 'tutar-ayristirilamadi' };
    }

    return {
      gecerli: true,
      tutar,
      referansKodu,
      // İşlem kimliği = HAM `REFERENCE_CODE` (sonekli). Deneme başına
      // benzersiz olan tek imza-kapsamlı değer bu; `AUTH_CODE` işlemler
      // arasında tekrar edebilir, replay kilidi olamaz.
      islemNo: hamRef,
    };
  },
};

/**
 * Sağlayıcı seçimi env'den. `PAYMENT_PROVIDER` boş/undefined → mock default.
 * Tanınmayan her değer hata fırlatır — sessiz yanlış-sağlayıcı yerine erken
 * patlar. Bir sağlayıcı yazılmadan adı buraya girmez.
 */
export function getPaymentProvider(): PaymentProvider {
  const which = (import.meta.env.PAYMENT_PROVIDER ?? 'mock').toLowerCase();
  if (which === 'mock') return mockPaymentProvider;
  if (which === 'nkolay') return nkolayPaymentProvider;
  throw new Error(`PAYMENT_PROVIDER bilinmiyor: "${which}". Geçerli: mock | nkolay.`);
}
