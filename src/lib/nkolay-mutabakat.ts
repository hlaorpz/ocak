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
 *   dış  : {"result":"<JSON dizesi>"}          ← İÇ İÇE, parse edilmeden alan görünmez
 *   iç   : { RESPONSE_CODE, RESPONSE_DATA, LIST: [ … ] }
 *   satır: { REFERENCE_CODE, CLIENT_REFERENCE_CODE, STATUS, TRANSACTION_TYPE, … }
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
  let dis: unknown;
  try {
    dis = JSON.parse(hamYanit);
  } catch {
    return null;
  }
  if (!dis || typeof dis !== 'object') return null;

  // Dış katman `result`'ı JSON DİZESİ olarak taşıyor.
  const result = (dis as Record<string, unknown>).result;
  let ic: unknown = dis;
  if (typeof result === 'string') {
    try {
      ic = JSON.parse(result);
    } catch {
      return null;
    }
  }
  if (!ic || typeof ic !== 'object') return null;

  const liste = (ic as Record<string, unknown>).LIST;
  if (!Array.isArray(liste)) {
    console.warn(
      '[nkolay-mutabakat] yanıtta `LIST` yok — şekil kaymış olabilir; iç anahtarlar: ' +
        Object.keys(ic as Record<string, unknown>).join(', '),
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
    console.warn(
      `[nkolay-mutabakat] referans eşleşti ama SALES+SUCCESS satırı yok — ` +
        `ref=${hedef} bulunan=${eslesen.map((k) => `${k.islemTipi}/${k.status}`).join(' · ')}`,
    );
    return null;
  }
  return satir;
}
