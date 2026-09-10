/**
 * odeme-kayit-oku.ts — `/odeme/tamam` sayfasının Notion okuması.
 *
 * ── Neden ayrı dosya ──
 * Mantık 10 Eylül 2026'da `src/pages/odeme/tamam.astro` frontmatter'ından
 * buraya TAŞINDI (kırpılmadı — CLAUDE.md §5). Sebep tek: `.astro`
 * frontmatter'ı test edilemiyor. `vitest.config.ts` yalnız
 * `src/**\/*.test.ts` topluyor ve bir `.astro` dosyasının frontmatter'ını
 * çağırmanın yolu yok; sayfa üstünde yapılabilen tek test kaynak-grep'i
 * (`KayitFormu.test.ts` deseni), o da "referans bulunamadı" ile "Notion
 * patladı" senaryolarını AYIRT EDEMEZ. Ayırt edememek bu dosyanın
 * düzelttiği hatanın ta kendisiydi.
 *
 * Notion istemcisi parametre olarak geçilir (`NotionOkuyucu`) — testin
 * sahte istemci verebilmesi için. Sayfa gerçek `notion`'ı geçer.
 *
 * ── Düzeltilen iki hata ──
 *
 * **(1) Yanlış property — sorgu iki aydır boş dönüyordu.**
 * Eski sorgu `Referans No` rich_text alanını filtreliyordu. Kayıtlar
 * DB'sinde böyle bir property YOK; referans `Kayıt ID` **title** alanında
 * yaşıyor. Üç bağımsız kanıt:
 *   - `api/kayit.ts:253` ve `:331` — Kayıtlar'a yazan iki fonksiyon da
 *     `'Kayıt ID': { title: [...] }` basıyor.
 *   - `api/kayit.ts:128-133` — `refQuery` DB'ye göre dallanıyor: Kayıtlar
 *     → `Kayıt ID`/title, Başvurular → `Referans No`/rich_text. Yorumu
 *     da açık: "yoksa 'Could not find property' 400 alınır."
 *   - `docs/20-ref-notion.md:174-186` — Kayıtlar şeması, 1. Kayıt ID
 *     (Title). `Referans No` listede yok.
 * `Referans No` gerçekten var, ama **Başvurular** DB'sinde
 * (`api/kayit.ts:375`). İki DB, iki ad, tek karışıklık.
 *
 * **(2) Hatayı yutan catch — hatanın iki ay görünmemesinin sebebi.**
 * Eski kod üç ayrı durumu TEK bir boş nesneye katlıyordu: kayıt
 * bulunamadı · Notion 400/500 verdi · kayıt bulundu ama etkinlik detayı
 * yok. Üçü de aynı ekranı üretiyordu, dolayısıyla (1)'deki 400 hatası
 * "detay henüz hazır değil" gibi görünüyordu. Artık `durum` ayırt ediyor:
 *
 *   'bulundu'     — Kayıtlar satırı bulundu (detay dolu ya da boş olabilir)
 *   'bulunamadi'  — sorgu çalıştı, eşleşen satır yok (ya da ref boş)
 *   'hata'        — Notion çağrısı patladı ya da DB tanımsız
 *
 * try/catch DURUYOR — kaldırmak sayfayı 500'e düşürürdü ve ödemesi
 * alınmış bir kadına hata ekranı göstermek boş ekrandan kötüdür. Kalkan
 * şey catch'in *sessizliği*: hata artık çağırana taşınıyor.
 *
 * ⚠ Bu dosya `durum`u ÜRETİR, yüzeye BAĞLAMAZ. `bulunamadi`/`hata`
 * hâllerinde kadına ne yazılacağı ayrı bir commit'in işi (metin Kaan'ın).
 */
import { katilimTipiCoz } from './kayit.ts';
import { ilkAd } from './davet-baglam.ts';
import { FORMAT_KATEGORI } from './etkinlik-kategori.ts';
import { formatEtkinlikTarihi } from './format-etkinlik.ts';

export type Katilim = {
  tipi: 'link' | 'adres';
  deger: string;
  zoomSifresi?: string;
};

/** Sorgunun üç ayrı sonucu — eski kodda üçü de aynı boş nesneydi. */
export type KayitDurumu = 'bulundu' | 'bulunamadi' | 'hata';

export type KayitOkumaSonuc = {
  durum: KayitDurumu;
  katilim: Katilim | null;
  etkinlikId: string;
  /** Eyeball #4 Fix 2c: davet metni + link için etkinlik meta. */
  etkinlikAdi: string;
  etkinlikTarihi: string;
  landingPath: string;
  /**
   * brief-davet-mail İŞ 1: davet edenin adı. Kayıtlar `Kadın` alanından
   * ilk kelime — o alan ad+soyad birleşik tutar (`kadinAdiBirlestir`).
   * Ek sorgu YOK: Kayıtlar sayfası zaten çekiliyor.
   */
  davetEdenAd: string;
};

/**
 * Notion istemcisinin bu dosyanın kullandığı kadarı. Gerçek SDK istemcisi
 * bu şekle uyar; test sahte nesne geçebilir. SDK tipini import etmemek
 * bilinçli — test sahtesi tüm `Client` yüzeyini taklit etmek zorunda kalmasın.
 */
export type NotionOkuyucu = {
  databases: { query(args: any): Promise<{ results: any[] }> };
  pages: { retrieve(args: any): Promise<any> };
};

function bosSonuc(durum: KayitDurumu): KayitOkumaSonuc {
  return {
    durum,
    katilim: null,
    etkinlikId: '',
    etkinlikAdi: '',
    etkinlikTarihi: '',
    landingPath: '',
    davetEdenAd: '',
  };
}

/**
 * ref → Kayıtlar query → Etkinlikler relation → katilim + etkinlikId +
 * davet meta (ad/tarih/landingPath).
 *
 * Etkinlik çözülemese bile `durum: 'bulundu'` döner ve taşınabilen alanlar
 * (örn. `davetEdenAd`) taşınır: kayıt GERÇEKTEN bulundu, eksik olan yalnız
 * detay. Bu ayrım 'bulunamadi'dan farklıdır ve yüzeyde farklı metin gerektirir.
 */
export async function kayitOku(
  client: NotionOkuyucu,
  kayitlarDbId: string,
  referansNo: string,
): Promise<KayitOkumaSonuc> {
  // Ref boşsa sorgu bile atılmaz — bu bir hata değil, eşleşme yokluğu.
  if (!referansNo) return bosSonuc('bulunamadi');
  // DB id tanımsızsa bu bir KONFİGÜRASYON hatası, "kayıt yok" değil.
  // İkisini karıştırmak env eksiğini kullanıcı hatası gibi gösterirdi.
  if (!kayitlarDbId) {
    console.error('[odeme/tamam] NOTION_KAYITLAR_DB tanımsız — sorgu atlanmadı, hata sayıldı');
    return bosSonuc('hata');
  }
  try {
    const sorgu = await client.databases.query({
      database_id: kayitlarDbId,
      // Kayıtlar'da referans `Kayıt ID` TITLE alanında yaşar; `Referans No`
      // bu DB'de yok (bkz. dosya başı, üç kanıt). Filtre tipi de bu yüzden
      // `title`, `rich_text` değil.
      filter: {
        property: 'Kayıt ID',
        title: { equals: referansNo },
      },
      page_size: 1,
    });
    const kayit = sorgu.results[0];
    if (!kayit || !('properties' in kayit)) return bosSonuc('bulunamadi');
    const props = kayit.properties as Record<string, any>;

    // brief-davet-mail İŞ 1: davet edenin adı — Kayıtlar `Kadın` rich_text
    // (`api/kayit.ts:259-263`). Etkinlik çözülemese bile ad taşınır: adsız
    // mail, yanlış etkinlikli mailden daha kötü değil ve zincirin bu
    // parçasının çalıştığını görmek teşhisi kolaylaştırır.
    const davetEdenAd = ilkAd(
      (props['Kadın']?.rich_text ?? [])
        .map((t: any) => t.plain_text ?? '')
        .join(''),
    );

    const bulundu = { ...bosSonuc('bulundu'), davetEdenAd };

    const etkRel: string = props['Etkinlikler']?.relation?.[0]?.id ?? '';
    if (!etkRel) return bulundu;

    const etk = await client.pages.retrieve({ page_id: etkRel });
    if (!('properties' in etk)) return { ...bulundu, etkinlikId: etkRel };
    const etkProps = etk.properties as Record<string, any>;

    const rich = (name: string): string =>
      (etkProps[name]?.rich_text ?? [])
        .map((t: any) => t.plain_text ?? '')
        .join('')
        .trim();
    const title = (name: string): string =>
      (etkProps[name]?.title ?? [])
        .map((t: any) => t.plain_text ?? '')
        .join('')
        .trim();
    const katilimLinki = rich('Katılım Linki');
    const mekan = etkProps['Mekân/Platform']?.select?.name ?? '';
    const zoomSifresi = rich('Zoom Şifresi');
    const konumDetay = rich('Konum Detay');

    // Eyeball #4 Fix 2c: davet metni için etkinlik başlığı + TR tarih; link
    // için Format select → landingPath (FORMAT_KATEGORI map). "Çember" →
    // "cember" → "/cember".
    const etkinlikAdi = title('Başlık');
    const tarihBaslangic: string = etkProps['Tarih']?.date?.start ?? '';
    const tarihBitis: string = etkProps['Tarih']?.date?.end ?? '';
    const saat: string = rich('Saat') || rich('Zoom Başlangıç Saati');
    const etkinlikTarihi = tarihBaslangic
      ? formatEtkinlikTarihi(tarihBaslangic, tarihBitis, saat)
      : '';
    const formatSelect: string = etkProps['Format']?.select?.name ?? '';
    const kategori = FORMAT_KATEGORI[formatSelect];
    const landingPath = kategori ? `/${kategori}` : '';

    const meta = { etkinlikId: etkRel, etkinlikAdi, etkinlikTarihi, landingPath, davetEdenAd };

    const tipi = katilimTipiCoz(mekan);
    if (tipi === 'link') {
      if (!katilimLinki) return { ...bulundu, ...meta };
      return {
        ...bulundu,
        katilim: {
          tipi: 'link',
          deger: katilimLinki,
          ...(zoomSifresi ? { zoomSifresi } : {}),
        },
        ...meta,
      };
    }
    // Fiziksel — adres metnini katilim linki yerine Konum Detay'dan al
    // (lib/notion-etkinlikler mekanDetay = Konum Detay). Boşsa null.
    const adres = konumDetay || katilimLinki;
    if (!adres) return { ...bulundu, ...meta };
    return { ...bulundu, katilim: { tipi: 'adres', deger: adres }, ...meta };
  } catch (err) {
    // Log DURUYOR (teşhis için), ama artık tek bilgi kaynağı değil:
    // `durum: 'hata'` çağırana taşınıyor. Eskiden burası sessizce `bos`
    // döndürüyordu ve hata Vercel log'una gömülüyordu.
    console.error('[odeme/tamam] kayıt okuma hatası:', String(err).slice(0, 200));
    return bosSonuc('hata');
  }
}
