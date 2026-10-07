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
  /**
   * Kayıtlar satırının Notion page id'si (UUID). `/odeme/nkolay` bunu
   * successUrl'e `pageId` olarak koyar — callback `pages.update`'i onunla
   * yapıyor; OCAK-XXXX ile güncelleme denemesi Notion'da hata verir.
   */
  pageId: string;
  /**
   * Ödenecek toplam — Kayıtlar `Beklenen Tutar` (number, kuruş korunur).
   * Kayıt bulunamadıysa / alan boşsa `0`.
   *
   * ⚠ Ödeme öncesi tutarın TEK doğru kaynağı budur. `/odeme/nkolay` tutarı
   * buradan alır, query'den ASLA: query adres çubuğunda değiştirilebilir ve
   * kadın kendi ödeyeceği tutarı yazabilirdi. `Ödenen Tutar` ise ödeme
   * SONRASI callback'in yazdığı ayrı alandır — ikisi karıştırılmamalı.
   */
  tutar: number;
  /**
   * Kayıtlar `İşlem No` (rich_text). **Replay muhafızının okuduğu alan:**
   * doluysa bu kayıt zaten bir ödemeyle kapanmıştır ve ikinci bir dönüş
   * kabul edilmez. Boş dize = henüz ödenmemiş.
   */
  islemNo: string;
  /**
   * `Etkinlikler` relation'ındaki öğe SAYISI. `etkinlikId` ilk öğeyi alır
   * (aşağıdaki `relation?.[0]`), ama **"bir tane var" demek değildir** —
   * canlı veride iki sayfa taşıyan satır ölçüldü (`OCAK-3HX6`, 7 Eki 2026:
   * 12 Ekim + 15 Ekim Açık Kapı; `Seçilen Tarih` ve MailerLite alanları
   * yalnız 12 Ekim'i anlatıyor). Site kodu relation'a daima TEK eleman
   * yazıyor (`api/kayit.ts:283`), yani çokluluk Notion tarafından gelmiş.
   *
   * `odemeBildir` bu sayıyı okur: 1 değilse MailerLite'a yazmaz — hangi
   * etkinliğin linkinin gideceğini kod tahmin etmez.
   */
  etkinlikSayisi: number;
  /**
   * Kayıtlar `Email`. `odemeBildir`'in MailerLite upsert'i bu adrese gider;
   * başka hiçbir yerde tüketilmez ve **log'a yazılmaz.**
   */
  email: string;
  /**
   * Kayıtlar `Seçilen Tarih` (rich_text) — kayıt anında formun gönderdiği
   * değer, zaten Türkçe. `etkinlik_adi`'nın yeniden üretilmesi bunu ister:
   * MailerLite'tan okunmaz, kayıt anındaki kurucuyla aynı girdiyle kurulur.
   */
  seciliTarih: string;
  /**
   * Etkinlikler `Format` select'in HAM Notion değeri ("Çember").
   * `FORMAT_KATEGORI` ile slug'a çözülür; `odemeBildir` orada
   * `isKayitFormat` ile doğrular. `Anadolu Yolculuğu` bir `KayitFormat`
   * değil — o etkinlikte `etkinlik_adi` yeniden üretilemez ve yazım atlanır.
   */
  formatHam: string;
  /**
   * Etkinlikler `Mekân/Platform` · `Katılım Linki` · `Zoom Şifresi` —
   * **ham hâlleriyle.** `katilim` alanı bu üçünü yüzey için katlıyor
   * (fiziksel dalda `Konum Detay` linkin yerine geçiyor, `:242`); MailerLite
   * eşlemesi ham değeri ister, çünkü `mailerLiteCustomFields` kendi
   * katlamasını kendi yapar (`kayit.ts:501-503`). İkisini karıştırmak
   * fiziksel etkinlikte adresi `zoom_link` alanına yazardı.
   */
  mekanHam: string;
  katilimLinkiHam: string;
  zoomSifresiHam: string;
  /**
   * Etkinlikler `Başlık` (title) — buluşmanın KENDİ adı ("Elin Neyle Dolu?").
   * `etkinlikAdi` alanı da aynı değeri taşıyor; bu ikinci ad bilinçli, çünkü
   * MailerLite tarafında alanın karşılığı `etkinlik_basligi` ve o alan
   * `etkinlik_adi`'dan (format+tarih) AYRI yaşıyor. İki adı tek alana
   * bağlamak, `mailerLiteCustomFields`'in ayırdığı iki şeyi geri karıştırmak
   * olurdu (bkz. `MailerLiteFieldGirdi.etkinlikBasligi` başlığı).
   */
  basligHam: string;
  /** Etkinlikler `Slug` — `etkinlikUrlFormatla` ile `etkinlik_url`'e döner. */
  slugHam: string;
  /** Etkinlikler `Tarih` date.start (ISO) — `Seçilen Tarih` boşsa yedek. */
  tarihISOHam: string;
  /**
   * Etkinlik saati, **mekâna bağlı eşlemeyle**: online → `Zoom Başlangıç
   * Saati`, fiziksel → `Saat`.
   *
   * ⚠ Aşağıdaki `saat` değişkeniyle AYNI DEĞİL ve olmamalı. O satır
   * (`rich('Saat') || rich('Zoom Başlangıç Saati')`) düz bir OR ve
   * cross-fallback yapıyor — `api/kayit.ts:191-198`'in canlı veriyle
   * ÇÜRÜTTÜĞÜ eşlemenin ta kendisi: iki alan da doluyken Zoom saati her
   * zaman kazanıyor, fiziksel buluşmanın saati yanlış yazılıyor. O satır bu
   * turda DEĞİŞTİRİLMEDİ (kapsam dışı, `DavetKutusu` metnini besliyor ve
   * davranışı sabit kalmalı) — ama MailerLite alanı onu TÜKETMEZ. Kusurlu
   * eşlemeyi maile taşımak, düzeltilmiş bir hatayı geri getirmek olurdu.
   */
  saatHam: string;
  /** Etkinlikler `Konum Detay` — fiziksel adres, `etkinlik_adres`'e döner. */
  konumDetayHam: string;
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
    pageId: '',
    // Bulunamayan/hatalı kayıtta tutar `0` — `/odeme/nkolay` sıfır tutarda
    // form basmaz (sağlayıcı FAIL-CLOSED `tutar geçersiz` döner). Boş yerine
    // `0` seçildi ki tip sayı kalsın ve karşılaştırma dallanması gerekmesin.
    tutar: 0,
    islemNo: '',
    // Relation okunamadıysa sayı `0` — `odemeBildir` bunu "tam bir etkinlik
    // taşımıyor" sayar ve yazmaz. `1` varsayılan olsaydı eksik veri, geçerli
    // veri gibi davranırdı.
    etkinlikSayisi: 0,
    email: '',
    seciliTarih: '',
    formatHam: '',
    mekanHam: '',
    katilimLinkiHam: '',
    zoomSifresiHam: '',
    basligHam: '',
    slugHam: '',
    tarihISOHam: '',
    saatHam: '',
    konumDetayHam: '',
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

    // `/odeme/nkolay` bu ikisini ister: UUID (callback'in `pages.update`'i
    // için) ve ödeme öncesi tutar. İkinci bir Notion sorgusu açmamak için
    // aynı sayfadan okunur — satır zaten elimizde.
    const pageId: string = (kayit as { id?: string }).id ?? '';
    const tutar: number = props['Beklenen Tutar']?.number ?? 0;
    const islemNo: string = (props['İşlem No']?.rich_text ?? [])
      .map((t: any) => t.plain_text ?? '')
      .join('')
      .trim();

    // `odemeBildir` girdileri — Kayıtlar tarafı. Email MailerLite upsert'i
    // için, `Seçilen Tarih` `etkinlik_adi`'nın yeniden kurulması için.
    const email: string = props['Email']?.email ?? '';
    const seciliTarih: string = (props['Seçilen Tarih']?.rich_text ?? [])
      .map((t: any) => t.plain_text ?? '')
      .join('')
      .trim();

    const bulundu = {
      ...bosSonuc('bulundu'),
      davetEdenAd,
      pageId,
      tutar,
      islemNo,
      email,
      seciliTarih,
    };

    // ⚠ Relation ÖĞE SAYISI ayrıca taşınır — `[0]` "tek öğe var" demek değil.
    // Canlı vakası `etkinlikSayisi` alanının başlığında.
    const etkRelListe: unknown[] = props['Etkinlikler']?.relation ?? [];
    const etkinlikSayisi = etkRelListe.length;
    const etkRel: string = (etkRelListe[0] as { id?: string } | undefined)?.id ?? '';
    if (!etkRel) return { ...bulundu, etkinlikSayisi };

    const etk = await client.pages.retrieve({ page_id: etkRel });
    if (!('properties' in etk)) return { ...bulundu, etkinlikSayisi, etkinlikId: etkRel };
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

    // `odemeBildir` girdileri — Etkinlikler tarafı, HAM. `katilim` katlamadan
    // önceki değerler; gerekçe `mekanHam` alanının başlığında.
    const meta = {
      etkinlikId: etkRel,
      etkinlikAdi,
      etkinlikTarihi,
      landingPath,
      davetEdenAd,
      etkinlikSayisi,
      formatHam: formatSelect,
      mekanHam: mekan,
      katilimLinkiHam: katilimLinki,
      zoomSifresiHam: zoomSifresi,
      basligHam: etkinlikAdi,
      slugHam: rich('Slug'),
      tarihISOHam: tarihBaslangic,
      // ⚠ Yukarıdaki `saat` DEĞİL — o cross-fallback yapıyor. Eşleme mekâna
      // bağlı, `api/kayit.ts:198` ile birebir. Gerekçe `saatHam` başlığında.
      saatHam: katilimTipiCoz(mekan) === 'link' ? rich('Zoom Başlangıç Saati') : rich('Saat'),
      konumDetayHam: konumDetay,
    };

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
