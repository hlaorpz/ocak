/**
 * kaynak.ts — UTM kaynak etiketinin TEK otoritesi (B118 İŞ C).
 *
 * ── İlk dokunuş kazanır ──
 * Herhangi bir sayfaya inişte URL'den beş UTM parametresi okunur ve
 * `sessionStorage` `ocak-kaynak` anahtarına yazılır. Anahtar DOLUYSA üzerine
 * yazılmaz: kadın reklamdan `/acik-kapi?utm_source=meta`ya iniyor, oradan
 * `/acik-kapi/kayit`a geçiyor — ikinci sayfada UTM yok. Son dokunuş kazanırsa
 * her kayıt "kaynaksız" yazılırdı.
 *
 * ── Rızadan bağımsız ──
 * Değer üçüncü tarafa gitmiyor, yalnız kendi sunucumuza ve Notion'a; oturum
 * kapanınca ölüyor (`sessionStorage`, `localStorage` değil). Bu yüzden rıza
 * kapısının arkasına konmadı — bir kaydın nereden geldiğini bilmek, kaydın
 * kendisi kadar birinci taraf bir bilgi.
 *
 * ── Doğrulama SUNUCUDA tekrarlanır ──
 * İstemci hijyeni kolaylık; kapı sunucuda. `utmTemizle` iki tarafın da
 * çağırdığı tek kural: en çok 100 karakter, yalnız `[A-Za-z0-9._~-]`.
 * Uymayan değer ATILIR, kayıt reddedilmez (K-5).
 */

/** Okunan URL parametreleri. `utm_term` şimdilik Notion'a YAZILMIYOR (brief §6). */
export const UTM_ANAHTARLARI = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
] as const;

export type UtmAnahtari = (typeof UTM_ANAHTARLARI)[number];

/** `sessionStorage` anahtarı. */
export const KAYNAK_ANAHTARI = 'ocak-kaynak';

/** Bir UTM değerinin azami uzunluğu. Notion rich_text sınırından çok önce keser. */
export const UTM_AZAMI_UZUNLUK = 100;

/**
 * İzin verilen karakterler — URL-güvenli "unreserved" küme (RFC 3986).
 *
 * ⚠ Türkçe harf ve boşluk YOK ve bu bilinçli: kampanya adları reklam
 * panosunda ASCII yazılıyor, ve küme daraldıkça Notion'a enjeksiyon benzeri
 * bir değer düşme ihtimali de daralıyor. Uymayan değer atılıyor, düzeltilmeye
 * çalışılmıyor — "düzeltilmiş" bir kampanya adı yanlış kampanyayı işaret eder.
 */
const IZINLI = /^[A-Za-z0-9._~-]+$/;

/**
 * Tek bir UTM değerini doğrular. Geçerse kırpılmış hâli, geçmezse `null`.
 *
 * Boş/tanımsız → `null` (yokluk, hata değil). Baş-son boşluk kırpılır:
 * reklam panoları değerin sonuna boşluk koyabiliyor ve o boşluk `IZINLI`'ye
 * uymadığı için sağlam bir değeri düşürürdü.
 */
export function utmTemizle(ham: unknown): string | null {
  if (typeof ham !== 'string') return null;
  const t = ham.trim();
  if (!t) return null;
  if (t.length > UTM_AZAMI_UZUNLUK) return null;
  if (!IZINLI.test(t)) return null;
  return t;
}

/** URL arama dizesinden geçerli UTM değerlerini çıkarır. Geçersizler atılır. */
export function utmOku(arama: string | null | undefined): Partial<Record<UtmAnahtari, string>> {
  const sonuc: Partial<Record<UtmAnahtari, string>> = {};
  if (!arama) return sonuc;
  let params: URLSearchParams;
  try {
    params = new URLSearchParams(arama);
  } catch {
    return sonuc;
  }
  for (const anahtar of UTM_ANAHTARLARI) {
    const deger = utmTemizle(params.get(anahtar));
    if (deger) sonuc[anahtar] = deger;
  }
  return sonuc;
}

/**
 * Saklanmış ham değeri çözer. Bozuk/boş → boş nesne.
 *
 * Çözümleme de doğrulamadan geçiyor: `sessionStorage` kullanıcının
 * düzenleyebildiği bir yüzey, oradan gelen değere güvenilmez.
 */
export function kaynakCoz(ham: string | null | undefined): Partial<Record<UtmAnahtari, string>> {
  if (!ham) return {};
  let obj: unknown;
  try {
    obj = JSON.parse(ham);
  } catch {
    return {};
  }
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return {};
  const kaynak = obj as Record<string, unknown>;
  const sonuc: Partial<Record<UtmAnahtari, string>> = {};
  for (const anahtar of UTM_ANAHTARLARI) {
    const deger = utmTemizle(kaynak[anahtar]);
    if (deger) sonuc[anahtar] = deger;
  }
  return sonuc;
}

/**
 * Yazılacak yeni değeri belirler — **ilk dokunuş kazanır.**
 *
 * `null` dönerse yazma YAPILMAZ. İki hâlde null döner:
 *  - saklanmış geçerli bir kaynak var (üzerine yazılmaz)
 *  - URL'de yazmaya değer bir UTM yok
 */
export function kaynakYazilacakMi(
  mevcutHam: string | null | undefined,
  arama: string | null | undefined,
): Partial<Record<UtmAnahtari, string>> | null {
  if (Object.keys(kaynakCoz(mevcutHam)).length > 0) return null;
  const yeni = utmOku(arama);
  if (Object.keys(yeni).length === 0) return null;
  return yeni;
}

/**
 * UTM → Notion property eşlemesi (brief §6).
 *
 * `utm_term` listede YOK: alan Notion'da açılmadı. Okunuyor ve
 * `sessionStorage`'da duruyor ama yazılmıyor — ileride alan açılırsa tek
 * satırla katılır.
 */
export const UTM_NOTION_ALANLARI = {
  utm_source: 'UTM Kaynak',
  utm_medium: 'UTM Ortam',
  utm_campaign: 'UTM Kampanya',
  utm_content: 'UTM İçerik',
} as const satisfies Partial<Record<UtmAnahtari, string>>;

/** Kayıt gövdesinde taşınan UTM alanları — `KayitPayload` ve `KayitBody` ortak şekli. */
export type KaynakYuku = Partial<Record<UtmAnahtari, string>>;

/**
 * Gövdeden gelen UTM değerlerini SUNUCU tarafında süzer.
 *
 * Her değer `utmTemizle`'den geçer; uymayan ATILIR ve kayıt reddedilmez.
 * Dönen nesne doğrudan Notion property kurucusuna besleniyor.
 */
export function kaynakGovdeSuz(ham: unknown): KaynakYuku {
  if (!ham || typeof ham !== 'object' || Array.isArray(ham)) return {};
  const g = ham as Record<string, unknown>;
  const sonuc: KaynakYuku = {};
  for (const anahtar of UTM_ANAHTARLARI) {
    const deger = utmTemizle(g[anahtar]);
    if (deger) sonuc[anahtar] = deger;
  }
  return sonuc;
}

/**
 * Süzülmüş UTM yükünü Notion `rich_text` property'lerine çevirir.
 *
 * Boş değer için property HİÇ üretilmez — Notion'da boş bir rich_text ile
 * hiç olmayan alan arasında fark yok, ama gönderilen her alan K-5'in yedek
 * yolunda atılması gereken bir alan daha demek.
 */
export function kaynakNotionProperties(yuk: KaynakYuku): Record<string, unknown> {
  const properties: Record<string, unknown> = {};
  for (const [utm, alan] of Object.entries(UTM_NOTION_ALANLARI) as [UtmAnahtari, string][]) {
    const deger = yuk[utm];
    if (deger) properties[alan] = { rich_text: [{ text: { content: deger } }] };
  }
  return properties;
}

/**
 * Kayıt gövdesine eklenecek B118 alanlarını kurar — saf, test edilebilir.
 *
 * İstemci `sessionStorage` ham değerini ve rıza kararını veriyor; bu fonksiyon
 * gövde parçasını döndürüyor. `olcum_rizasi` YALNIZ `kabul` hâlinde giriyor
 * (brief §6): rıza yoksa alan gönderilmiyor ve sunucu kutuyu boş bırakıyor.
 *
 * Boş dönerse gövdeye hiçbir şey eklenmiyor — UTM'siz kayıt eskisi gibi
 * yazılıyor.
 */
export function kayitKaynakYuku(args: {
  kaynakHam: string | null | undefined;
  rizaKabul: boolean;
}): KaynakYuku & { olcum_rizasi?: true } {
  const yuk: KaynakYuku & { olcum_rizasi?: true } = { ...kaynakCoz(args.kaynakHam) };
  if (args.rizaKabul) yuk.olcum_rizasi = true;
  return yuk;
}

/** Notion `Ölçüm Rızası` (Checkbox) alanının adı. */
export const OLCUM_RIZASI_ALANI = 'Ölçüm Rızası';

/** Rıza bayrağı property'si. `false` da yazılır — "sorulmadı" ile "reddetti" ayrı bilgi değil, kutu boş kalır. */
export function olcumRizasiProperty(rizaVar: boolean): Record<string, unknown> {
  return { [OLCUM_RIZASI_ALANI]: { checkbox: rizaVar } };
}
