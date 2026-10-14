// etkinlik-onsecim.ts — bir etkinliği bilen kayıt düğmesinden kayıt formuna
// ön seçim taşıma mantığı. Saf fonksiyonlar; DOM yok, Astro yok, test edilebilir.
//
// Problem (ölçüm, 14 Eki 2026): Instagram'dan gelen kadın etkinliğin kendi
// sayfasını görüyor, tarihi hero'da okuyor, "Yerini ayır"a basıyor — ve kayıt
// formunda tarih seçicisi BOŞ açılıyor. Tarihi ikinci kez, bu kez listeden
// bulması gerekiyor. Ölçülen hâl: `/acik-kapi/kayit` 7 `<option>` basıyor,
// `selected` 0, `data-slug` 0; sayfa hiçbir query parametresi okumuyor.
//
// Çözüm iki parçalı: linki üreten yüzey `?etkinlik=` taşır (kayitLinkiParamEkle),
// kayıt formu onu okuyup seçer (onSecimIndexi). Bu dosya ikisinin de ortak dili.
//
// TİP-DUYARLI TEK KAPI (Kaan kararı, 14 Eki). `?etkinlik=` adı ZATEN kullanımda
// ve anlamı farklıydı: yedi format sayfası onu **Notion sayfa ID'si** olarak
// okuyor (`acik-kapi.astro` → `etkinlikGecmisMi`), davet sistemi de o biçimde
// link üretiyor (`DavetKutusu.astro` → `?etkinlik=<id>&ref=<kod>`). Yeni bir ad
// açmak yerine tek kapı tip-duyarlı yapıldı: değer UUID biçimindeyse ID, değilse
// slug. Böylece davet linkleri aynen çalışır ve kayıt route'u ikisini de kabul
// eder — ID `<option value>`'ya, slug `data-slug`'a eşlenir.

/** `?etkinlik=` parametresinin kanonik adı — tek yerde yaşar. */
export const ETKINLIK_PARAM = 'etkinlik';

/**
 * Notion sayfa ID'si biçimi: 32 hex, tireli ya da tiresiz. Davet linkleri
 * tireli üretiyor (`notion.pages.retrieve` ikisini de kabul eder), ama tiresiz
 * hâli de dolaşımda — ikisi de ID sayılır.
 */
const UUID_DESENI =
  /^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i;

export type EtkinlikParamTipi = 'id' | 'slug' | 'bos';

/**
 * Parametre değerinin tipini söyler. Boş/yalnız-boşluk → 'bos'.
 * UUID biçimi (tireli ya da tiresiz) → 'id'. Geri kalan her şey → 'slug';
 * slug'ın listede olup olmadığına burada bakılmaz, o `onSecimIndexi`'nin işi.
 */
export function etkinlikParamTipi(raw: string | null | undefined): EtkinlikParamTipi {
  const deger = (raw ?? '').trim();
  if (!deger) return 'bos';
  return UUID_DESENI.test(deger) ? 'id' : 'slug';
}

/** ID karşılaştırması için tireleri atar ve küçük harfe indirir. */
function idNormal(deger: string): string {
  return deger.replace(/-/g, '').toLowerCase();
}

/** Kayıt formundaki bir `<option>`'ın karşılaştırmaya giren iki çapası. */
export type OnSecimSecenegi = {
  /** `<option value>` — Notion sayfa ID'si. Yer tutucu seçenekte boş. */
  value: string;
  /** `<option data-slug>` — etkinliğin kendi sluğu. Notion'da boşsa boş. */
  slug?: string;
};

/**
 * Parametreye karşılık gelen seçeneğin indeksi; yoksa `null`.
 *
 * Eşleşme yoksa SESSİZ boş seçim döner — hata yok, uyarı yok (brief kuralı).
 * "Geçmiş tarih" ayağı bedava gelir: seçenek listesi `filterDropdownEtkinlikleri`
 * çıktısıdır ve geçmiş ya da kaydı kapalı etkinliği listeye hiç almaz, yani
 * geçmiş bir slug burada doğal olarak eşleşmez.
 *
 * Yer tutucu seçenek (`value === ''`) hiçbir zaman eşleşmez — boş parametre
 * onu seçmeye çalışırsa zaten `'bos'` tipiyle elenmiş olur.
 */
export function onSecimIndexi(
  raw: string | null | undefined,
  secenekler: readonly OnSecimSecenegi[],
): number | null {
  const tip = etkinlikParamTipi(raw);
  if (tip === 'bos') return null;
  const deger = (raw ?? '').trim();

  if (tip === 'id') {
    const hedef = idNormal(deger);
    for (let i = 0; i < secenekler.length; i++) {
      const v = (secenekler[i].value ?? '').trim();
      if (v && idNormal(v) === hedef) return i;
    }
    return null;
  }

  for (let i = 0; i < secenekler.length; i++) {
    const s = (secenekler[i].slug ?? '').trim();
    if (s && s === deger) return i;
  }
  return null;
}

/**
 * Bir kayıt linkine `?etkinlik=<slug>` ekler. Linki üreten dört yüzeyin ortak
 * kapısı (KayitBtn · EtkinlikKart · resolveMiniCtaBtn · hero düğmesi).
 *
 * Dokunmama kuralları — hepsi Kaan'ın 14 Eki eki:
 *   - href boş ya da yalnız boşluk → olduğu gibi döner.
 *   - site dışı adres → olduğu gibi döner. "Site içi" = `/` ile başlayan
 *     göreli yol, ya da host'u `ocak.biz`'de biten mutlak adres. Notion
 *     "Kayıt Linki" alanı elle yazılıyor; oraya dış bir form adresi
 *     konulduğunda parametre eklemek anlamsız (ve gürültülü) olur.
 *   - slug boş → olduğu gibi döner (slug'ı olmayan etkinlik; loader zaten
 *     WARN basmış oluyor).
 *   - href ZATEN `etkinlik` parametresi taşıyor → EZİLMEZ, olduğu gibi döner.
 *     Elle yazılmış bir hedefleme bizim türetmemizden üstündür.
 *   - başka parametreler ya da `#fragment` varsa BİRLEŞTİRİLİR: parametre
 *     query'nin sonuna katılır, fragment en sonda kalır.
 */
export function kayitLinkiParamEkle(
  href: string | null | undefined,
  slug: string | null | undefined,
): string {
  const adres = (href ?? '').trim();
  const deger = (slug ?? '').trim();
  if (!adres || !deger) return adres;
  if (!siteIci(adres)) return adres;

  // Fragment'ı ayır — parametre ondan ÖNCE girer, yoksa `#form?etkinlik=…`
  // gibi hiçbir şey ifade etmeyen bir adres doğar.
  const diyez = adres.indexOf('#');
  const fragment = diyez === -1 ? '' : adres.slice(diyez);
  const govde = diyez === -1 ? adres : adres.slice(0, diyez);

  const soru = govde.indexOf('?');
  if (soru !== -1) {
    const sorgu = govde.slice(soru + 1);
    // Mevcut `etkinlik` parametresi ezilmez. `&` ve `;` ayraçlarının ikisine de
    // bak; ad eşleşmesi tam olmalı (`etkinlik_id` yanlışlıkla yakalanmasın).
    const varMi = sorgu
      .split(/[&;]/)
      .some((parca) => parca.split('=')[0] === ETKINLIK_PARAM);
    if (varMi) return adres;
    const ayrac = sorgu ? '&' : '';
    return `${govde}${ayrac}${ETKINLIK_PARAM}=${encodeURIComponent(deger)}${fragment}`;
  }

  return `${govde}?${ETKINLIK_PARAM}=${encodeURIComponent(deger)}${fragment}`;
}

/**
 * Adres site içi mi. Protokol-göreli (`//baska.com/x`) ve şemalı mutlak
 * adresler host'una bakılarak elenir; `mailto:`/`tel:` gibi şemalar da dış.
 */
function siteIci(adres: string): boolean {
  if (adres.startsWith('//')) return false;
  if (adres.startsWith('/')) return true;
  const sema = /^([a-z][a-z0-9+.-]*):/i.exec(adres);
  if (!sema) return false; // `kayit` gibi şemasız göreli yol — hedefi belirsiz, dokunma
  if (!/^https?$/i.test(sema[1])) return false;
  try {
    const host = new URL(adres).hostname.toLowerCase();
    return host === 'ocak.biz' || host.endsWith('.ocak.biz');
  } catch {
    return false;
  }
}
