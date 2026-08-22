/**
 * davet-baglam.ts — Davet mailine giren bağlamın normalizasyonu.
 * Saf fonksiyonlar; `Request`/`Response` bilmez, test edilebilir.
 *
 * ── Neden ayrı bir kapı ──
 * `davet-kapi.ts` "bu istek bir bottan mı geliyor" sorusunu sorar. Burası
 * farklı bir soruyu sorar: istek MEŞRU olsa bile, gövdeden gelen dizeler
 * doğrudan bir e-postanın içine basılabilir mi?
 *
 * 22 Ağustos 2026 öncesinde cevap önemsizdi — mail şablonuna giren tek
 * değişken `link`'ti ve onu sunucu `publicOrigin()`ten kendisi üretiyordu.
 * Bu turda üç alan daha girdi (`davetEdenAd`, `etkinlikAd`, `landingPath`) ve
 * üçü de client gövdesinden geliyor. Yani ilk kez, kullanıcının yazdığı bir
 * dize OCAK imzalı bir maile basılıyor. Üç sonuç:
 *
 *   1. HTML kaçırma ŞART (`htmlKacir`). Kaçırılmazsa `davetEdenAd` alanına
 *      `<a href="...">` yazan biri, OCAK'ın kendi şablonu ve kendi doğrulanmış
 *      alan adı üzerinden bir kimlik avı linki yollar. Aynı uç zaten açık röle
 *      olarak kullanıldı (`davet-akisi.ts`); şablonun içine yazma yetkisi
 *      vermek aynı hatanın ikinci sürümü olurdu.
 *   2. Uzunluk sınırı — mailin gövdesi bir metin taşıma kanalı değil.
 *      Sınır dilim dilim değil, tek yerde (`AZAMI_*`).
 *   3. `landingPath` beyaz listeye tabi (`gecerliLandingYolu`). Serbest
 *      bırakılsaydı buton hedefi gövdeden yazılabilirdi: OCAK alan adıyla
 *      başlayan ama saldırganın seçtiği bir yola giden link. Beyaz liste
 *      `FORMAT_KATEGORI`'den TÜRETİLİR, paralel liste yazılmaz (KARAR 284).
 */
import { FORMAT_KATEGORI } from './etkinlik-kategori.ts';

/** Davet edenin adı — mailde tek satırda durur, cümle değil. */
export const AZAMI_AD_UZUNLUGU = 60;

/** Etkinlik adı — Notion `Başlık` alanı; uzun başlıklar var, cömert sınır. */
export const AZAMI_ETKINLIK_UZUNLUGU = 120;

/**
 * Beyaz liste — `FORMAT_KATEGORI`'nin değer kümesinden türetilir.
 * Yedi kayıt sayfası + `/anadolu` (kayıt sayfası yok ama `odeme/tamam`
 * `FORMAT_KATEGORI` üzerinden bu slug'ı üretebilir).
 */
const GECERLI_YOLLAR: ReadonlySet<string> = new Set(
  Object.values(FORMAT_KATEGORI).map((slug) => `/${slug}`),
);

/**
 * Görünür boşlukları tek boşluğa indirir, kırpar, sınırı aşarsa keser.
 *
 * ⚠ Bu KIRPMA YASAĞI'nın (KARAR 61) kapsamında değil: o kural doküman
 * içeriği için. Burada kesilen şey bir gövde alanı, kaynak değil — ve
 * kesilmezse mail şablonunun kendisi taşıyıcı hâline gelir.
 */
export function metinKirp(ham: unknown, azami: number): string {
  if (typeof ham !== 'string') return '';
  const sade = ham.replace(/\s+/g, ' ').trim();
  return sade.length > azami ? sade.slice(0, azami).trim() : sade;
}

/**
 * Tam addan ilk kelime — "Ayşe Yılmaz" → "Ayşe".
 *
 * Neden ilk kelime: `/odeme/tamam` dalında ad Kayıtlar DB'nin `Kadın`
 * alanından geliyor ve orada ad+soyad birleşik duruyor
 * (`kadinAdiBirlestir`). Kayıt formu dalında ise yalnız `ad` alanı var.
 * İki dal aynı maili üretmeli; tam ad ayrıca bir yabancıya fazla.
 */
export function ilkAd(ham: unknown): string {
  const tam = metinKirp(ham, AZAMI_AD_UZUNLUGU);
  if (!tam) return '';
  return tam.split(' ')[0] ?? '';
}

/**
 * Gövdeden gelen `landingPath` geçerli bir format sayfası mı?
 * Geçerliyse normalize yolu, değilse `null` döner — çağıran taraf `null`'ı
 * ana sayfaya düşürüp `console.warn` ile işaretler.
 *
 * Sorgu dizesi ya da fragment taşıyan bir değer REDDEDİLİR, temizlenmez:
 * `?ref=` linke sunucu tarafında ekleniyor, gövdeden gelen bir soru işareti
 * onu ezmeye çalışan bir denemedir.
 */
export function gecerliLandingYolu(ham: unknown): string | null {
  if (typeof ham !== 'string') return null;
  const yol = ham.trim();
  if (!yol) return null;
  return GECERLI_YOLLAR.has(yol) ? yol : null;
}

/**
 * HTML özel karakterlerini kaçırır — mail şablonuna basılan HER gövde
 * kaynaklı dize bundan geçer. Tırnaklar da dahil: değer bir gün attribute
 * içine girerse (bugün girmiyor) kaçış zaten yerinde olsun.
 */
export function htmlKacir(ham: string): string {
  return ham
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
