/**
 * N-Kolay `PaymentList` yanıtının ayrıştırılması — MUTABAKAT KÖPRÜSÜ.
 *
 * ── Bu dosya neden ayrı yaşıyor ──
 * `odeme-callback-muhafiz.test.ts` `CLIENT_REFERENCE_CODE` dizesinin
 * `payment-provider.ts` ve `api/odeme-callback.ts` kaynaklarında GEÇMEMESİNİ
 * şart koşuyor (KARAR 593'ün uygulanması). O muhafız **dönüş POST'undan**
 * kimlik okumayı yasaklıyor ve haklı: callback'i kullanıcının tarayıcısı
 * gönderir, hash dışı her alan saldırgan kontrolündedir.
 *
 * Burada okunan `CLIENT_REFERENCE_CODE` **o alan değil.** Bu, sırrımızla
 * imzalanmış bir `PaymentList` çağrısına N-Kolay'ın KENDİ SUNUCUSUNUN verdiği
 * cevaptır — tarayıcı o kanala giremez. Muhafızın yasakladığı şey yapılmıyor;
 * yasağın grep mekanizması bu dosyaya uzanmasın diye kod ayrıldı, ve yerine
 * daha güçlü bir güvence kondu: **bu modül callback gövdesini GÖRMEZ.**
 * `secKaydi()` imzası yalnız `string` alır — `URLSearchParams` ya da `Request`
 * buraya tip düzeyinde giremez. Grep atlanabilir, imza atlanamaz.
 *
 * Muhafız testi bu ayrımı ayrıca çiviliyor (`mutabakat köprüsü` bloğu):
 * route'un bu modüle **hash kapsamındaki** alanı geçtiği greple doğrulanıyor.
 *
 * ── Ölçülmüş yanıt şekli (6 Eki 2026, Kaan — canlı PaymentList) ──
 * ⚠ **`result` İKİ BİÇİMDE DE GELİYOR** ve bu ölçüldü, savunma amaçlı değil:
 *
 *   (a) BAŞARILI sorgu — `result` bir NESNE, yanında `id` ve `error`:
 *       { id, result: { RESPONSE_CODE, CORE_TRX_ID_RESERVED, RESPONSE_DATA,
 *         sessionId, LIST: [ … ], ERROR_CODE, ERROR_MESSAGE, TimeStamp }, error }
 *       Başarılı turda `error: null` — sorgu reddedilmemiş.
 *
 *   (b) ERKEN DOĞRULAMA hatası — dış gövdede tek anahtar (`result`) ve değeri
 *       bir JSON DİZESİ: {"result":"{\"RESPONSE_CODE\":0,…}"}
 *       (prob turunda *"Hash Data boş geçilemez"* böyle geldi)
 *
 *   satır: { REFERENCE_CODE, CLIENT_REFERENCE_CODE, STATUS, TRANSACTION_TYPE,
 *            TRX_DATE, … }
 *
 * İlk sürüm yalnız (b)'yi karşılıyordu — `result`'ı koşulsuz dize sanıyordu ve
 * (a) geldiğinde dış gövdeyi iç gövde sayıp `LIST` bulamıyordu. Canlı 6 Eki
 * işlemi (22:55) tam buradan düştü. Teşhisi yanıltan şey log'du: düştüğü
 * kademeyi söylemiyor, sadece DIŞ anahtarları basıyordu — "şekil kaydı" gibi
 * okundu, oysa ayrıştırıcı en baştan yanlış kademeye bakıyordu.
 *
 *   `REFERENCE_CODE`        = N-KOLAY'ın işlem numarası (örn. `IKSIRPF341481127`)
 *   `CLIENT_REFERENCE_CODE` = BİZİM `clientRefCode` (örn. `OCAK-57V4-08513`)
 *   `STATUS`                ∈ SUCCESS · ERROR (· NEW — doküman diyor, henüz görülmedi)
 *   `TRANSACTION_TYPE`      ⚠ CANCEL satırları da listede
 *
 * ── Neden liste taraması, neden REFERENCE_CODE ile filtre değil ──
 * `PaymentList` `clientRefCode` ile filtreliyor; dönüşte elimizde olan ise
 * N-Kolay'ın `REFERENCE_CODE`'u. Yani sorgu tarih aralığıyla açılır ve eşleşme
 * `LIST` içinde aranır. `REFERENCE_CODE`'un filtre olarak kabul edilip
 * edilmediği **ÖLÇÜLMEDİ** (anahtarlar CC'ye kapalı) — kabul ediliyorsa bu bir
 * optimizasyon olur, doğruluk farkı değil. Borç: B206.
 */

/** `LIST` satırından okuduğumuz dört alan. Fazlası taşınmaz. */
export type MutabakatKaydi = {
  /** N-Kolay'ın işlem numarası — hash kapsamındaki `REFERENCE_CODE` ile eşleşecek olan. */
  referansNo: string;
  /** Bizim gönderdiğimiz `clientRefCode` — `OCAK-XXXX-NNNNN`. */
  clientRefCode: string;
  status: string;
  islemTipi: string;
  /**
   * Satırın işlem zamanı — `DD.MM.YYYY HH:mm:ss` (ölçüldü: `06.10.2026 22:54:38`).
   * Kimlik çözümünde KULLANILMIYOR; yalnız teşhis içindir. `SALES+SUCCESS`
   * bulunamadığında "hangi satır ne zaman" sorusunu log'da cevaplıyor.
   */
  trxTarihi: string;
};

/** Köprünün kabul ettiği tek işlem tipi. İade/iptal satırları ödeme değildir. */
export const MUTABAKAT_ISLEM_TIPI = 'SALES';
/** Köprünün kabul ettiği tek durum. */
export const MUTABAKAT_BASARILI_STATUS = 'SUCCESS';

/**
 * İç içe yanıtı açar ve `LIST` satırlarını döndürür.
 *
 * `null` dönüşü "liste boş" DEĞİL, "yanıt beklenen şekilde değil" demektir —
 * çağıran ikisini ayırt edip fail-closed davranır. Boş liste `[]` döner.
 *
 * ⚠ `LIST` yoksa sessizce başka bir diziye geçilmez. Şekil kaydığında gürültü
 * çıkmalı: sessiz uyum, bugünkü arızanın (ölçülmemiş biçime fail-closed kapı)
 * hata sınıfının aynısını üretir.
 */
export function paymentListAyristir(hamYanit: string): MutabakatKaydi[] | null {
  // ⚠ Her red KADEMESİNİ söyler. Önceki sürüm düştüğü kademeyi söylemiyordu
  // ve teşhis bir tur kaybettirdi: dış anahtarlar basılınca "sağlayıcı şekli
  // değiştirdi" sanıldı, oysa ayrıştırıcı yanlış kademeye bakıyordu.
  const anahtarlar = (o: unknown) =>
    o && typeof o === 'object' ? Object.keys(o as Record<string, unknown>).join(', ') : `(${typeof o})`;

  let dis: unknown;
  try {
    dis = JSON.parse(hamYanit);
  } catch {
    console.warn(
      `[nkolay-mutabakat] kademe=dış · gövde JSON değil (${hamYanit.length} karakter)`,
    );
    return null;
  }
  if (!dis || typeof dis !== 'object') {
    console.warn(`[nkolay-mutabakat] kademe=dış · nesne değil → ${typeof dis}`);
    return null;
  }

  const disObj = dis as Record<string, unknown>;

  // Sağlayıcı taşıyıcı hatasını `error` ile bildiriyor. Doluysa sorgu
  // REDDEDİLMİŞTİR — `LIST` yokluğunu "kayıt bulunamadı" sanmak teşhisi
  // tamamen yanlış yere götürürdü (zarf değil yetki/parametre sorunu).
  if (disObj.error != null && disObj.error !== '') {
    console.warn(
      `[nkolay-mutabakat] kademe=dış · sorgu reddedildi — error=${String(
        typeof disObj.error === 'object' ? JSON.stringify(disObj.error) : disObj.error,
      ).slice(0, 200)}`,
    );
    return null;
  }

  // ── kademe `result` — NESNE ya da JSON DİZESİ olabilir, ikisi de ölçüldü ──
  let ic: unknown;
  if (!('result' in disObj)) {
    console.warn(`[nkolay-mutabakat] kademe=result · anahtar yok · dış anahtarlar: ${anahtarlar(disObj)}`);
    return null;
  }
  const result = disObj.result;
  if (typeof result === 'string') {
    try {
      ic = JSON.parse(result);
    } catch {
      console.warn(
        `[nkolay-mutabakat] kademe=result · dize ama JSON değil (${result.length} karakter)`,
      );
      return null;
    }
  } else if (result && typeof result === 'object') {
    ic = result;
  } else {
    console.warn(`[nkolay-mutabakat] kademe=result · skaler → ${typeof result}`);
    return null;
  }
  if (!ic || typeof ic !== 'object') {
    console.warn(`[nkolay-mutabakat] kademe=result · açıldı ama nesne değil → ${typeof ic}`);
    return null;
  }

  const icObj = ic as Record<string, unknown>;
  const liste = icObj.LIST;
  if (!Array.isArray(liste)) {
    // Kademe artık açık: basılan anahtarlar `result`'ın İÇİ, dışı değil.
    console.warn(
      `[nkolay-mutabakat] kademe=LIST · dizi değil (${typeof liste}) · ` +
        `result anahtarları: ${anahtarlar(icObj)} · ` +
        `RESPONSE_CODE=${String(icObj.RESPONSE_CODE ?? '(yok)')} ` +
        `RESPONSE_DATA=${String(icObj.RESPONSE_DATA ?? '(yok)').slice(0, 120)}`,
    );
    return null;
  }

  const metin = (v: unknown) => (typeof v === 'string' ? v.trim() : v == null ? '' : String(v));
  return liste
    .filter((s): s is Record<string, unknown> => !!s && typeof s === 'object')
    .map((s) => ({
      referansNo: metin(s.REFERENCE_CODE),
      clientRefCode: metin(s.CLIENT_REFERENCE_CODE),
      status: metin(s.STATUS),
      islemTipi: metin(s.TRANSACTION_TYPE),
      trxTarihi: metin(s.TRX_DATE),
    }));
}

/**
 * Listede, hash kapsamından gelen sağlayıcı referansına karşılık gelen
 * **SALES + SUCCESS** satırını bulur.
 *
 * ⚠ Üç kapı birlikte: referans eşleşmesi · `TRANSACTION_TYPE === SALES` ·
 * `STATUS === SUCCESS`. `CANCEL` satırları aynı `REFERENCE_CODE`'u
 * taşıyabilir (iptal, iptal ettiği işlemi işaret eder) — tipi sormadan ilk
 * eşleşmeyi almak, iptal edilmiş bir işlemi ödeme sayardı.
 *
 * ⚠ Parametre **`string`**: bu modül callback gövdesini göremez. Değer
 * route'ta `dogrulama.saglayiciReferansi`'ndan gelir ve o alan YALNIZ hash
 * kapsamından doldurulur (`payment-provider.ts`, KARAR 593).
 */
export function secKaydi(
  kayitlar: MutabakatKaydi[],
  saglayiciReferansi: string,
): MutabakatKaydi | null {
  const hedef = saglayiciReferansi.trim();
  if (!hedef) return null;
  const eslesen = kayitlar.filter((k) => k.referansNo === hedef);
  if (!eslesen.length) return null;
  const satir = eslesen.find(
    (k) => k.islemTipi === MUTABAKAT_ISLEM_TIPI && k.status === MUTABAKAT_BASARILI_STATUS,
  );
  if (!satir) {
    // Eşleşme var ama SALES+SUCCESS yok: iptal edilmiş ya da başarısız işlem.
    // Sessiz `null` "işlem bulunamadı" gibi okunurdu; ayrımı log taşır.
    // ⚠ Bu satır bir vakayı okumayı sağladı (6 Eki): iade yapıldıktan sonra
    // orijinal SALES satırı listede GÖRÜNMÜYOR, satır CANCEL/SUCCESS oluyor.
    // Tarih de basılıyor ki "ödeme mi, sonradan iade mi" ayırt edilebilsin.
    console.warn(
      `[nkolay-mutabakat] referans eşleşti ama SALES+SUCCESS satırı yok — ` +
        `ref=${hedef} bulunan=${eslesen
          .map((k) => `${k.islemTipi}/${k.status}@${k.trxTarihi || '?'}`)
          .join(' · ')}`,
    );
    return null;
  }
  return satir;
}
