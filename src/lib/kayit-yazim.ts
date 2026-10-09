/**
 * kayit-yazim.ts — K-5'in uygulaması: **ölçüm kaydı asla düşürmez.**
 *
 * ── Sorun ──
 * B118 İŞ C beş yeni Notion alanı kullanıyor (`UTM Kaynak` · `UTM Ortam` ·
 * `UTM Kampanya` · `UTM İçerik` · `Ölçüm Rızası`). Notion API, var olmayan
 * bir property'ye yazmayı **tüm sayfa oluşturmayı reddederek** cevaplıyor
 * ("property does not exist"). Yani alanlar açılmamışsa ya da biri yeniden
 * adlandırılmışsa, ölçüm için eklenen bir alan KAYDIN KENDİSİNİ düşürürdü.
 * Kadın hata ekranı görür, parası ödenmemiş, yeri tutulmamış olur.
 *
 * ── Çözüm ──
 * Yazım iki denemeli: önce yeni alanlarla, reddedilirse **aynı kaydı yeni
 * alanlar olmadan** yeniden yaz ve sunucu log'una gürültülü bir satır bas.
 * Alanlar Notion'da açık olduğu sürece ikinci deneme hiç koşmaz.
 *
 * ── Neden ikinci deneme "her hata"da, yalnız alan hatasında değil ──
 * Notion'un hata gövdesi sürümle değişiyor ve bir `code` dizesine bağlanmak
 * sessiz bir kırılganlık olurdu: mesaj değişir, dal ölür, kayıt düşer. Hata
 * ayrımı yapmamak en kötü hâlde bir ağ hatasında ikinci bir istek demek —
 * `pages.create` çağrısı yeni satır açtığı için ÇİFT KAYIT riski var ve bu
 * yüzden ikinci deneme YALNIZ yeni alan gönderilmişken yapılıyor. Yeni alan
 * yoksa tek deneme, eski davranış birebir.
 *
 * ── `olustur` enjekte ediliyor ──
 * `src/pages/` altına test konamıyor (Astro route sayar). Mantık burada
 * yaşıyor ve Notion çağrısı parametre; `kayit-yazim.test.ts` sahte bir
 * oluşturucuyla iki denemenin ikisini de ölçüyor.
 */

/**
 * B118 İŞ C'nin eklediği Notion alanları — yedek yolda ATILACAK küme.
 *
 * ⚠ Bu liste `kaynak.ts`'in eşlemesinden türetilmiyor, ELLE yazılı ve
 * bilinçli: yedek yolun neyi attığı tek bir yerde okunabilir kalmalı. İki
 * listenin uyumu `kayit-yazim.test.ts`'te ölçülüyor.
 */
export const B118_ALANLARI = [
  'UTM Kaynak',
  'UTM Ortam',
  'UTM Kampanya',
  'UTM İçerik',
  'Ölçüm Rızası',
] as const;

/** Properties nesnesinde B118 alanlarından biri var mı? */
export function b118AlaniVarMi(properties: Record<string, unknown>): boolean {
  return B118_ALANLARI.some((alan) => alan in properties);
}

/** B118 alanlarını ayıklamış YENİ bir nesne döner — girdiye dokunmaz. */
export function b118AlanlariniAt(properties: Record<string, unknown>): Record<string, unknown> {
  const atilacak = new Set<string>(B118_ALANLARI);
  const temiz: Record<string, unknown> = {};
  for (const [anahtar, deger] of Object.entries(properties)) {
    if (atilacak.has(anahtar)) continue;
    temiz[anahtar] = deger;
  }
  return temiz;
}

export type NotionOlusturucu = (properties: Record<string, unknown>) => Promise<string>;

/**
 * Kaydı yazar; B118 alanları reddedilirse onlar olmadan yeniden yazar.
 *
 * Dönen `pageId` her iki yolda da gerçek satırın id'si. İkinci deneme de
 * patlarsa hata ÇAĞIRANA fırlatılır — o noktada sorun ölçüm alanlarında
 * değil, kaydın kendisinde; sessizce yutmak kadına "kaydın alındı" demek
 * olurdu.
 */
export async function notionKayitYaz(args: {
  olustur: NotionOlusturucu;
  properties: Record<string, unknown>;
  referansNo: string;
  /** Test bunu yerine geçiriyor; üretimde `console.error`. */
  log?: (mesaj: string) => void;
}): Promise<string> {
  const { olustur, properties, referansNo } = args;
  const log = args.log ?? ((m: string) => console.error(m));
  try {
    return await olustur(properties);
  } catch (err) {
    if (!b118AlaniVarMi(properties)) throw err;
    log(
      `[kayit] B118 ölçüm alanlarıyla yazım REDDEDİLDİ — ref=${referansNo} ` +
        `alanlar=${B118_ALANLARI.join(' · ')} ` +
        `hata=${String(err).slice(0, 200)} — kayıt ölçüm alanları OLMADAN yeniden yazılıyor. ` +
        `Notion Kayıtlar DB'sinde beş alan açık mı, adları birebir mi?`,
    );
    return await olustur(b118AlanlariniAt(properties));
  }
}
