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

import { createHash } from 'node:crypto';
// Sır karşılaştırması paylaşılan lib'de (aşağıdaki taşıma notu).
import { sabitZamanliEsit } from './sabit-zamanli';
// ⚠ `PaymentList` yanıtının AYRIŞTIRILMASI bilerek ayrı modülde yaşıyor —
// gerekçesi o dosyanın başında (muhafız grep'i + "callback gövdesini görmez"
// tip güvencesi). Buradan yalnız iki saf fonksiyon çağrılıyor.
import { paymentListAyristir, secKaydi } from './nkolay-mutabakat';
// B193 — mock kararının TEK kaynağı. Bu modül kendi `PAYMENT_PROVIDER`
// okumasını mock dalı için YAPMAZ; gerekçesi `getPaymentProvider()` başında.
import { MOCK_SAGLAYICI_ACIK } from './kart-akisi.ts';

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
   *
   * ⚠ **Sağlayıcı bunu doldurmak ZORUNDA DEĞİL** (6 Eki 2026). N-Kolay'ın
   * dönüşünde bizim kodumuzun yankısı YOK — hash kapsamındaki tek kimlik
   * sağlayıcının kendi numarası. O sağlayıcı bu alanı BOŞ bırakır ve
   * `saglayiciReferansi`'nı doldurur; route kaydı mutabakat köprüsüyle çözer.
   * `mock` doğrudan doldurmaya devam eder — köprüye ihtiyacı yok.
   */
  referansKodu?: string;
  /**
   * Sağlayıcının KENDİ işlem referansı — imza kapsamından, ham.
   *
   * N-Kolay'da `REFERENCE_CODE` (örn. `IKSIRPF341481127`). Bizim kodumuzla
   * ilgisi yoktur ve ondan türetilemez; kayda ancak `mutabakatSorgula()` ile
   * bağlanır.
   *
   * ⚠ Neden `referansKodu`'ndan AYRI bir alan: ikisini tek alanda taşımak
   * "bazen OCAK-XXXX, bazen sağlayıcı numarası" demek olurdu ve `kayitOku()`
   * sessizce yanlış şeyi arardı. Ayrı alan, hangi kimliğin elde olduğunu
   * TİP düzeyinde söylüyor.
   *
   * Ölçüm: 1 Eki canlı dönüşünde hash kapısı GEÇTİ, `REFERENCE_CODE` hash
   * kapsamında — yani bu alan imzalıdır. `CLIENT_REFERENCE_CODE` ve
   * `MERCHANT_OID` kapsamda DEĞİL (9 alanlı dize + ayıraç kanıtı).
   */
  saglayiciReferansi?: string;
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
  /**
   * **Mutabakat köprüsü** — sağlayıcının kendi referansından bizim
   * `clientRefCode`'umuzu bulur. **Opsiyonel**: yalnız dönüşünde bizim
   * kodumuzun yankısı OLMAYAN sağlayıcılar yazar (`nkolay`). `mock`
   * yazmaz — o `referansKodu`'nu doğrudan doldurur.
   *
   * ⚠ **Bu metot I/O YAPAR** ve bu, `dogrulaCallback`'in senkron-kalma
   * kuralını çiğnemez: o kural doğrulanmamış isteğin bize iş yaptırmasını
   * engellemek için var. Bu çağrı route'ta, **hash kapısı geçtikten sonra**
   * yapılır — yani yalnız imzası doğrulanmış istek için. Doğrulamanın
   * KENDİSİ hâlâ ağ çağrısı gerektirmiyor; DoS yüzeyi açılmıyor.
   *
   * `saglayiciReferansi` YALNIZ imza kapsamından gelir (KARAR 593).
   */
  mutabakatSorgula?(p: MutabakatGirdi): Promise<MutabakatSonuc>;
}

export type MutabakatGirdi = {
  /** Sağlayıcının kendi işlem referansı — imza kapsamından. */
  saglayiciReferansi: string;
  /** Sorgu penceresini kuran an. Test edilebilirlik için dışarıdan verilir. */
  simdi: Date;
};

export type MutabakatSonuc =
  | {
      /** Bizim gönderdiğimiz tam kod — `OCAK-XXXX-NNNNN`. */
      clientRefCode: string;
    }
  | { hata: string };

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

// `sabitZamanliEsit` 7 Eki 2026'da `lib/sabit-zamanli.ts`'ye TAŞINDI
// (kırpılmadı — CLAUDE.md §5; gövde birebir, davranış aynı). Sebep: B211'in
// tarama ucu ve kart devam linki aynı karşılaştırmayı istiyor ve o iki yüzeyin
// ödeme modülünü import etmesi için hiçbir sebep yok. Gerekçenin tamamı ve
// boş-dize tuzağının uyarısı yeni dosyanın başında.

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
    // Listeleme ucunun AYRI üye işyeri kimliği. 11 Eyl'den beri env yüzeyinde
    // duruyordu ve hiçbir kod okumuyordu (B200); ilk okuyucusu mutabakat köprüsü.
    sxList: (import.meta.env.NKOLAY_SX_LIST ?? '').trim(),
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
 * Sağlayıcının KENDİ referansının kabul kapısı — `REFERENCE_CODE`.
 *
 * ── Neden önek çivilenmedi ──
 * Ölçülen tek örnek `IKSIRPF341481127` (6 Eki, N-Kolay paneli + canlı dönüş).
 * **Bir örnekten `^IKSIRPF\d+$` çıkarmak B201'in hatasını tekrar etmek olur:**
 * ölçülmemiş bir biçime fail-closed kapı kurmak, hattı sessizce kapatır.
 * `IKSIRPF`'in terminale mi, üye işyerine mi, işlem tipine mi bağlı olduğu
 * BİLİNMİYOR; doküman repoda yok (B201).
 *
 * ── Kapının gerçek işi ──
 * Bu değerden kimlik TÜRETİLMİYOR artık — kaydı mutabakat köprüsü çözüyor.
 * Yani kapı "şekli doğru mu" diye sormaz, **"dolu ve taşınabilir mi"** diye
 * sorar. İki şeyi korur: (a) boş/eksik referansla köprüye gitmeyi engeller,
 * (b) değer Notion `İşlem No`'ya ve replay kilidine gittiği için sınırsız/
 * kontrolsüz dizeyi içeri almaz.
 *
 * Sınırlar gerekçeli, keyfi değil: ölçülen örnek 16 karakter; 6 alt sınırı
 * kısa-çöp dizeleri eler, 64 üst sınırı log ve Notion alanını korur, karakter
 * kümesi sağlayıcı referanslarının gerçekçi evreni (harf · rakam · `-` `_` `.`).
 */
export const NKOLAY_REF_BICIMI = /^[A-Za-z0-9._-]{6,64}$/;

/**
 * Mutabakat sorgusunun tarih penceresi — **`DD.MM.YYYY`, nokta ayıraç.**
 *
 * Ölçüldü (6 Eki, canlı PaymentList): gövdede `DD.MM.YYYY` zorunlu
 * (*"startDate DD.MM.YYYY formatında olmalı"*) ve **hash dizesinde de aynısı** —
 * ISO varyantı `hashData error` aldı. İki yer aynı biçimi kullanır.
 *
 * ── Pencere neden iki gün ──
 * Callback işlemden saniyeler sonra gelir, yani işlem "bugün"dür. Tek istisna
 * gün dönümü: 23:59:58'de çekim, 00:00:01'de callback → tarih kayar. Dün+bugün
 * penceresi bunu kapatır ve maliyeti yok (aynı tek sorgu).
 *
 * Saat dilimi **Europe/Istanbul**: sağlayıcının günü TR günüdür, sunucunun
 * UTC'si gece yarısı civarında yanlış günü sorardı. `uretRnd` ile aynı gerekçe.
 */
export function uretMutabakatPenceresi(simdi: Date): { start: string; end: string } {
  const gun = (d: Date) => {
    const p = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/Istanbul',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(d);
    const al = (t: string) => p.find((x) => x.type === t)?.value ?? '';
    return `${al('day')}.${al('month')}.${al('year')}`;
  };
  const dun = new Date(simdi.getTime() - 24 * 60 * 60 * 1000);
  return { start: gun(dun), end: gun(simdi) };
}

/**
 * **Hash 3 — mutabakat.**
 * `sx|startDate|endDate|clientRefCode|merchantSecretKey`
 *
 * Alan sırası B200'den (`02-borclar.md`). `clientRefCode` BOŞ geçilebilir
 * (ölçüldü, 6 Eki: boş varyant iki kayıt döndürdü) ama **ayıracı yerinde
 * durur** — boş alanı atlamak diziyi kaydırır ve imzayı sessizce bozar;
 * istek hash'indeki `customerKey` ile aynı kural.
 *
 * ⚠ `sx` burada `NKOLAY_SX` DEĞİL, **`NKOLAY_SX_LIST`**. Listeleme ucunun
 * kendi üye işyeri kimliği var; satış `sx`'i ile sorgulamak hash'i bozar.
 */
export function nkolayMutabakatHashDizesi(a: {
  sxList: string;
  startDate: string;
  endDate: string;
  clientRefCode: string;
  merchantSecretKey: string;
}): string {
  return [a.sxList, a.startDate, a.endDate, a.clientRefCode, a.merchantSecretKey].join('|');
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
    // Hash kapsamındaki tek kimlik budur. Dönüşte bizim kodumuzu taşıyan alan
    // hash DIŞINDA (ölçüldü) ve oradan kayıt çözmek, imzanın koruduğu şeyi
    // imzasız bir alana devretmek olurdu — KARAR 593.
    //
    // ✅ ÖLÇÜLDÜ (6 Eki 2026) — eski VARSAYIM ÇÜRÜDÜ, B201 kapandı:
    // `REFERENCE_CODE` bizim `clientRefCode`'umuzun yankısı DEĞİL, N-Kolay'ın
    // kendi işlem numarası (`IKSIRPF341481127`). Kanıt zinciri:
    //   · 1 Eki canlı dönüşünde hash kapısı GEÇTİ, red `REFERENCE_CODE`
    //     biçiminde oldu → 9 alanlı dize doğru, kapsam doğrulandı
    //   · N-Kolay paneli (POS İşlem Raporu) iki AYRI sütun gösteriyor:
    //     "Referans Numarası" = bizim kod · "N Kolay Referans Numarası" = onların
    //   · canlı `PaymentList` yanıtı aynı ayrımı taşıyor (`LIST[]`)
    //
    // Bu yüzden burada artık `OCAK-XXXX` TÜRETİLMİYOR — türetilemez. Kapı
    // yalnız "dolu ve taşınabilir mi" diye sorar (`NKOLAY_REF_BICIMI`,
    // gerekçesi tanımının yanında), kaydı route'taki mutabakat köprüsü çözer.
    const hamRef = oku('REFERENCE_CODE');
    if (!NKOLAY_REF_BICIMI.test(hamRef)) {
      // Alan adlarını basmaya devam: bir sonraki şekil kayması da aynı satırda
      // teşhis edilsin. Değer basılmıyor — `hashData*` bu listede duruyor.
      console.warn(
        `[nkolay] REFERENCE_CODE yok ya da taşınamaz (fail-closed) — ` +
          `uzunluk=${hamRef.length} · gövdedeki ALAN ADLARI: ${[...p.keys()].join(', ')}`,
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
      // ⚠ `referansKodu` BİLEREK BOŞ: bu sağlayıcının dönüşü bizim kodumuzu
      // taşımıyor. Route köprüyle çözer. Buraya bir şey yazmak — örneğin
      // hash dışı alandan okumak — KARAR 593'ü çiğnemek olurdu.
      saglayiciReferansi: hamRef,
      // İşlem kimliği = HAM `REFERENCE_CODE`. İşlem başına benzersiz olan tek
      // imza-kapsamlı değer bu; `AUTH_CODE` işlemler arasında tekrar edebilir,
      // replay kilidi olamaz. Notion `İşlem No` artık N-Kolay'ın numarasını
      // taşır — B202'nin öngördüğü kullanım ("o, dönüşte gelen N-Kolay işlem
      // numarası için") birebir gerçekleşti.
      islemNo: hamRef,
    };
  },

  /**
   * Mutabakat köprüsü — `REFERENCE_CODE` → `clientRefCode`.
   *
   * `PaymentList` **`clientRefCode` ile filtreliyor**, elimizdeki ise
   * N-Kolay'ın `REFERENCE_CODE`'u. Bu yüzden sorgu tarih penceresiyle açılır
   * ve eşleşme dönen `LIST` içinde aranır (`nkolay-mutabakat.ts`).
   *
   * Ölçülmüş istek sözleşmesi (6 Eki, üç prob turu):
   *   uç      `{NKOLAY_BASE_URL}/Payment/PaymentList`
   *   kodlama `application/x-www-form-urlencoded`   ← multipart DEĞİL
   *   hash    alan adı **`hashDataV2`**              ← `hashData` değil
   *   tarih   `DD.MM.YYYY` — gövdede VE hash dizesinde aynı
   */
  async mutabakatSorgula({ saglayiciReferansi, simdi }) {
    const { sxList, merchantSecret, baseUrl } = nkolayEnv();
    if (!sxList) return { hata: 'NKOLAY_SX_LIST tanımsız' };
    if (!merchantSecret) return { hata: 'NKOLAY_MERCHANT_SECRET tanımsız' };
    if (!baseUrl) return { hata: 'NKOLAY_BASE_URL tanımsız' };
    if (!saglayiciReferansi.trim()) return { hata: 'sağlayıcı referansı boş' };

    const { start, end } = uretMutabakatPenceresi(simdi);
    // `clientRefCode` BOŞ — aradığımız şey o değil, ayıracı yerinde duruyor.
    const hash = sha512Base64(
      nkolayMutabakatHashDizesi({
        sxList,
        startDate: start,
        endDate: end,
        clientRefCode: '',
        merchantSecretKey: merchantSecret,
      }),
    );

    const govde = new URLSearchParams();
    govde.append('sx', sxList);
    govde.append('startDate', start);
    govde.append('endDate', end);
    govde.append('clientRefCode', '');
    govde.append('hashDataV2', hash);

    let yanit: Response;
    try {
      yanit = await fetch(`${baseUrl}/Payment/PaymentList`, {
        method: 'POST',
        body: govde,
      });
    } catch (err) {
      // Ağ hatası fail-closed: kayıt çözülemez. Sessiz "bulunamadı" demek,
      // tahsil edilmiş bir ödemeyi ağ gürültüsüyle karıştırmak olurdu.
      return { hata: `PaymentList ağ hatası: ${String(err).slice(0, 150)}` };
    }
    if (!yanit.ok) return { hata: `PaymentList HTTP ${yanit.status}` };

    const kayitlar = paymentListAyristir(await yanit.text());
    if (kayitlar === null) return { hata: 'PaymentList yanıtı ayrıştırılamadı' };

    const satir = secKaydi(kayitlar, saglayiciReferansi);
    if (!satir) {
      return {
        hata:
          `PaymentList'te SALES+SUCCESS eşleşmesi yok — ` +
          `ref=${saglayiciReferansi} pencere=${start}→${end} satır=${kayitlar.length}`,
      };
    }
    if (!satir.clientRefCode) return { hata: 'eşleşen satırda clientRefCode boş' };
    return { clientRefCode: satir.clientRefCode };
  },
};

/**
 * Sağlayıcı seçimi env'den. `PAYMENT_PROVIDER` **tanımsız** → mock default.
 * Tanınmayan her değer hata fırlatır — sessiz yanlış-sağlayıcı yerine erken
 * patlar. Bir sağlayıcı yazılmadan adı buraya girmez.
 *
 * ⚠ Bu satır *"boş/undefined → mock default"* diyordu ve BOŞ kısmı YANLIŞTI
 * (7 Eki ölçümü): `'' ?? 'mock'` → `''`, yani boş dize eskiden de mock dalına
 * değil `throw`a gidiyordu. Davranış değişmedi, yalnız anlatı düzeltildi.
 *
 * ⚠ Mock kararı buradan OKUNMUYOR, `kart-akisi.ts`ten geliyor (B193, 7 Eki).
 * Sebep bir değişmez: **bu factory mock'a yönlendiriyorsa `/odeme/mock` sayfası
 * açık olmak ZORUNDA.** İki yer ayrı ayrı env okursa o değişmez iki yazımın
 * eşitliğine bağlı kalır; tek sabiti paylaşınca yapısal olarak garanti olur.
 * `nkolay` dalının env okuması kalıyor — o dal sayfa kapısını ilgilendirmiyor
 * ve yalnız mock elendikten sonra sorulur.
 */
export function getPaymentProvider(): PaymentProvider {
  if (MOCK_SAGLAYICI_ACIK) return mockPaymentProvider;
  const which = (import.meta.env.PAYMENT_PROVIDER ?? '').trim().toLowerCase();
  if (which === 'nkolay') return nkolayPaymentProvider;
  throw new Error(`PAYMENT_PROVIDER bilinmiyor: "${which}". Geçerli: mock | nkolay.`);
}
