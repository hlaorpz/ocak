/**
 * mektup.ts — Ateş Mektupları tek-dokunuş katılımının saf tarafı (İŞ 5).
 *
 * ── Neden yeni bir uç ──
 * Mevcut Ateş Mektupları formu `/api/form` → `handleAtesMektuplari`
 * (`src/pages/api/form.ts:63`) ve e-postayı **istemciden** alıyor. İŞ 5 bunun
 * tersini istiyor: istemci e-posta GÖNDERMEZ, yalnız `Kayıt ID` yollar; sunucu
 * adresi Notion'dan okur. O yüzden ayrı uç (`/api/mektup-katil`); `/api/form`'a
 * dokunulmadı (Kaan).
 *
 * ── Neden imza ──
 * `Kayıt ID` dört karakterlik bir gövde taşıyor (`OCAK-XXXX`) ve tahmin
 * edilebilir. İmzasız bir uç, kayıtlı adreslerin bültene **rızası olmadan**
 * eklenmesine açık olurdu — küçük ama gerçek bir zarar ve bir rıza ihlali.
 * Kapı `/odeme/devam`'ın HMAC'i: aynı sır, aynı doğrulayıcı
 * (`odemeLinkiGecerli`). Sayfa imzayı sunucuda üretip bloğa veriyor; istemci
 * sırrı görmüyor.
 */

/**
 * Ateş Mektupları MailerLite grup kimliği.
 *
 * ⚠ **İKİNCİ KOPYA.** Aynı değer `src/pages/api/form.ts:49`'da
 * `ATES_MEKTUPLARI_GROUP_ID` olarak duruyor. O dosyaya dokunmamam istendi
 * (Kaan, 7 Eki), dolayısıyla değer burada tekrar ediyor. Sürüklenmeyi
 * `mektup.test.ts` yakalıyor: test iki dosyadaki literali karşılaştırıyor ve
 * ayrışırsa kırmızı yanıyor. İki yer tek sayı söylemek zorunda.
 */
export const ATES_MEKTUPLARI_GROUP_ID = '187372384318130052';

/**
 * Blok metinleri — Kaan verdi, kod yeni kamu metni yazmaz.
 *
 * ── İŞ 12 (7 Eki) güncellemesi ──
 * Başlık "Ritmi dinle." → "Ateş Mektupları": blok artık ana sayfadaki
 * `AtesMektuplari` bileşeninin görsel diliyle basılıyor ve o bileşenin başlığı
 * da bültenin ADI. İki yüzeyde iki farklı ad, aynı şeyi iki şey gibi
 * gösteriyordu.
 *
 * Başarı metni "İlk mektubun yolda." → "Bir sonraki mektup sana da gelecek.":
 * eski cümle bir söz veriyordu ki tutulamaz — bülten ayda bir çıkıyor
 * (`AtesMektuplari`: "Ayda bir, doğrudan kutuna"), yani "ilk mektup" haftalar
 * sonra gelebilir. Yeni cümle doğru olanı söylüyor.
 */
export const MEKTUP_METIN = {
  baslik: 'Ateş Mektupları',
  govde:
    "OCAK'ın ritmi, ara ara posta kutunda. Bu e-postayla katılmak için bir dokunuş yeter.",
  dugme: 'KATIL',
  basari: 'Hoş geldin. Bir sonraki mektup sana da gelecek.',
  hata: 'Şu an olmadı; birazdan yeniden dene.',
} as const;

export type MektupSonuc =
  | { ok: true }
  | { ok: false; sebep: 'imza' | 'kayit-yok' | 'email-yok' | 'mailerlite' | 'yapilandirma' };

/**
 * Uç yanıtı → kadının göreceği metin. Tek yerde: uç `sebep` taşıyor ama
 * kadına tek cümle gidiyor.
 *
 * ⚠ Sebep GÖVDEYE YAZILMAZ. "kayit-yok" ile "imza" arasındaki farkı dışarıya
 * söylemek, deneyen birine hangi yönde ilerleyeceğini söylemek olurdu.
 */
export function mektupMesaji(sonuc: MektupSonuc): string {
  return sonuc.ok ? MEKTUP_METIN.basari : MEKTUP_METIN.hata;
}
