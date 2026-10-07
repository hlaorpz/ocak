import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { kayitOku, type NotionOkuyucu } from './odeme-kayit-oku.ts';

/**
 * `/odeme/tamam` Notion okuması — İŞ 1 mekanik ayak.
 *
 * Sayfa iki aydır her kadına aynı jenerik ekranı gösteriyordu. Sebep iki
 * katmanlıydı ve ikisi de burada test ediliyor:
 *
 *  1. Sorgu `Referans No` rich_text alanını filtreliyordu — Kayıtlar DB'sinde
 *     böyle bir property YOK. Notion "Could not find property" 400 döndürür.
 *  2. catch bu 400'ü yutuyor, "kayıt yok" ile aynı boş nesneyi döndürüyordu.
 *     Yani (1)'in ürettiği hata (2) tarafından görünmez kılınıyordu — bir
 *     hata ötekini saklıyordu, hatanın iki ay yaşamasının sebebi bu.
 *
 * ⚠ İlk test bilinçli olarak filtrenin ŞEKLİNİ ölçüyor, yalnız sonucu değil.
 * Sonuç ölçümü tek başına yetmez: sahte istemci her filtreye aynı satırı
 * döndürseydi yanlış property ile de yeşil yanardı. Gerçek Notion property
 * adına 400 ile cevap verir; test o davranışı taklit eder.
 */

const KAYITLAR_DB = 'kayitlar-db-id';
const REF = 'OCAK-7K2M';

/** Kayıtlar satırı — `Kadın` + `Etkinlikler` relation. */
function kayitSatiri(etkinlikId = 'etk-1') {
  return {
    properties: {
      'Kayıt ID': { title: [{ plain_text: REF }] },
      'Kadın': { rich_text: [{ plain_text: 'Deniz Yıldırım' }] },
      Etkinlikler: { relation: [{ id: etkinlikId }] },
    },
  };
}

/** Online etkinlik — Zoom linki + şifre. */
function etkinlikSayfasi() {
  return {
    properties: {
      'Başlık': { title: [{ plain_text: 'Perşembe Çemberi' }] },
      'Mekân/Platform': { select: { name: 'Online' } },
      'Katılım Linki': { rich_text: [{ plain_text: 'https://zoom.us/j/123' }] },
      'Zoom Şifresi': { rich_text: [{ plain_text: 'ocak2026' }] },
      Tarih: { date: { start: '2026-10-01' } },
      Format: { select: { name: 'Çember' } },
    },
  };
}

/**
 * Gerçek Notion davranışını taklit eden sahte istemci: `Kayıt ID`/title
 * filtresine satır döner, BAŞKA her property'ye 400 fırlatır — canlı API
 * "Could not find property" derken tam olarak bunu yapıyor.
 */
function notionSahte(opts: {
  satirlar?: any[];
  sorguPatlat?: boolean;
  retrievePatlat?: boolean;
  /** Etkinlik sayfası — verilmezse varsayılan online Çember. */
  etkinlik?: any;
}): { client: NotionOkuyucu; sorguArgs: any[] } {
  const sorguArgs: any[] = [];
  const client: NotionOkuyucu = {
    databases: {
      async query(args: any) {
        sorguArgs.push(args);
        if (opts.sorguPatlat) {
          throw new Error('Notion 502 — upstream unavailable');
        }
        const p = args?.filter?.property;
        if (p !== 'Kayıt ID' || !args?.filter?.title) {
          throw new Error(
            `Could not find property with name or id: ${p} (validation_error, 400)`,
          );
        }
        return { results: opts.satirlar ?? [] };
      },
    },
    pages: {
      async retrieve() {
        if (opts.retrievePatlat) throw new Error('Notion 500 — retrieve failed');
        return opts.etkinlik ?? etkinlikSayfasi();
      },
    },
  };
  return { client, sorguArgs };
}

describe('kayitOku — üç senaryo (İŞ 1)', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('1 · referans bulundu', () => {
    it('`Kayıt ID` TITLE alanını filtreler — `Referans No`/rich_text DEĞİL', async () => {
      const { client, sorguArgs } = notionSahte({ satirlar: [kayitSatiri()] });
      await kayitOku(client, KAYITLAR_DB, REF);

      expect(sorguArgs).toHaveLength(1);
      // Property ADI ve filtre TİPİ birlikte ölçülür. Kayıtlar'da referans
      // title alanında yaşar; `rich_text: {equals}` doğru ada uygulansa bile
      // Notion tip uyuşmazlığı verir.
      expect(sorguArgs[0].filter).toEqual({
        property: 'Kayıt ID',
        title: { equals: REF },
      });
      expect(sorguArgs[0].filter.property).not.toBe('Referans No');
      expect(sorguArgs[0].filter).not.toHaveProperty('rich_text');
    });

    it('durum "bulundu", Zoom linki + şifre + davet meta taşınır', async () => {
      const { client } = notionSahte({ satirlar: [kayitSatiri()] });
      const s = await kayitOku(client, KAYITLAR_DB, REF);

      expect(s.durum).toBe('bulundu');
      expect(s.katilim).toEqual({
        tipi: 'link',
        deger: 'https://zoom.us/j/123',
        zoomSifresi: 'ocak2026',
      });
      expect(s.davetEdenAd).toBe('Deniz');
      expect(s.etkinlikAdi).toBe('Perşembe Çemberi');
      expect(s.landingPath).toBe('/cember');
      expect(s.etkinlikId).toBe('etk-1');
    });

    it('kayıt var ama etkinlik relation yok → yine "bulundu", ad taşınır', async () => {
      // Bu hâl 'bulunamadi' DEĞİL: satır gerçekten var, eksik olan detay.
      // Eski kod ikisini ayıramıyordu.
      const satir = kayitSatiri();
      satir.properties.Etkinlikler = { relation: [] };
      const { client } = notionSahte({ satirlar: [satir] });
      const s = await kayitOku(client, KAYITLAR_DB, REF);

      expect(s.durum).toBe('bulundu');
      expect(s.katilim).toBeNull();
      expect(s.davetEdenAd).toBe('Deniz');
    });
  });

  describe('2 · referans bulunamadı', () => {
    it('sorgu boş döndü → durum "bulunamadi", "hata" değil', async () => {
      const { client } = notionSahte({ satirlar: [] });
      const s = await kayitOku(client, KAYITLAR_DB, 'OCAK-YOK1');

      expect(s.durum).toBe('bulunamadi');
      expect(s.katilim).toBeNull();
      expect(s.davetEdenAd).toBe('');
    });

    it('ref boş → sorgu HİÇ atılmaz, durum "bulunamadi"', async () => {
      const { client, sorguArgs } = notionSahte({ satirlar: [kayitSatiri()] });
      const s = await kayitOku(client, KAYITLAR_DB, '');

      expect(s.durum).toBe('bulunamadi');
      expect(sorguArgs).toHaveLength(0);
    });
  });

  describe('3 · Notion hata verdi', () => {
    it('sorgu patladı → durum "hata", sessizce boş dönmez', async () => {
      const { client } = notionSahte({ sorguPatlat: true });
      const s = await kayitOku(client, KAYITLAR_DB, REF);

      expect(s.durum).toBe('hata');
      // Hatanın kaybolmadığının kanıtı: 'bulunamadi' ile karışmıyor.
      expect(s.durum).not.toBe('bulunamadi');
      expect(console.error).toHaveBeenCalled();
    });

    it('etkinlik retrieve patladı → durum "hata"', async () => {
      const { client } = notionSahte({
        satirlar: [kayitSatiri()],
        retrievePatlat: true,
      });
      const s = await kayitOku(client, KAYITLAR_DB, REF);

      expect(s.durum).toBe('hata');
    });

    it('DB id tanımsız → durum "hata", "bulunamadi" değil (konfigürasyon hatası)', async () => {
      const { client, sorguArgs } = notionSahte({ satirlar: [kayitSatiri()] });
      const s = await kayitOku(client, '', REF);

      expect(s.durum).toBe('hata');
      expect(sorguArgs).toHaveLength(0);
    });
  });

  describe('B211 — bildirim girdileri: relation SAYISI, ham alanlar', () => {
    /** Kayıtlar satırı, N öğeli relation + Email + Seçilen Tarih. */
    function cokluSatir(ogeSayisi: number) {
      const s = kayitSatiri();
      s.properties.Etkinlikler = {
        relation: Array.from({ length: ogeSayisi }, (_, i) => ({ id: `etk-${i + 1}` })),
      };
      (s.properties as any).Email = { email: 'deniz@ornek.invalid' };
      (s.properties as any)['Seçilen Tarih'] = { rich_text: [{ plain_text: '12 Ekim 2026' }] };
      return s;
    }

    it('tek öğeli relation → etkinlikSayisi 1, ham alanlar dolu', async () => {
      const { client } = notionSahte({ satirlar: [cokluSatir(1)] });
      const s = await kayitOku(client, KAYITLAR_DB, REF);
      expect(s.etkinlikSayisi).toBe(1);
      expect(s.email).toBe('deniz@ornek.invalid');
      expect(s.seciliTarih).toBe('12 Ekim 2026');
      expect(s.formatHam).toBe('Çember');
      expect(s.mekanHam).toBe('Online');
      expect(s.katilimLinkiHam).toBe('https://zoom.us/j/123');
      expect(s.zoomSifresiHam).toBe('ocak2026');
    });

    it('⚠ İKİ öğeli relation → etkinlikSayisi 2, `[0]` tekliği GİZLEMEZ', async () => {
      // Canlı vaka `OCAK-3HX6` (7 Eki 2026): iki Açık Kapı taşıyor,
      // `Seçilen Tarih` yalnız birini anlatıyor. `etkinlikId` eskisi gibi
      // ilk öğeyi veriyor — ama artık sayı da taşınıyor ve `odemeBildir`
      // onu okuyor. Bu ayrım olmasa bildirim yanlış linki gönderebilirdi.
      const { client } = notionSahte({ satirlar: [cokluSatir(2)] });
      const s = await kayitOku(client, KAYITLAR_DB, REF);
      expect(s.etkinlikSayisi).toBe(2);
      // Mevcut davranış KORUNDU — `/odeme/tamam` hâlâ ilk öğeyi gösteriyor.
      expect(s.etkinlikId).toBe('etk-1');
      expect(s.durum).toBe('bulundu');
    });

    it('relation BOŞ → etkinlikSayisi 0, ham alanlar boş, durum "bulundu"', async () => {
      const { client } = notionSahte({ satirlar: [cokluSatir(0)] });
      const s = await kayitOku(client, KAYITLAR_DB, REF);
      expect(s.etkinlikSayisi).toBe(0);
      expect(s.formatHam).toBe('');
      expect(s.katilimLinkiHam).toBe('');
      // Kayıt GERÇEKTEN bulundu; eksik olan yalnız etkinlik.
      expect(s.durum).toBe('bulundu');
      expect(s.email).toBe('deniz@ornek.invalid');
    });

    it('ham alanlar `katilim`in KATLAMASINDAN bağımsız — fiziksel dal', async () => {
      // `katilim` fiziksel dalda `Konum Detay`ı değer yapıyor (:242). Ham
      // alanlar o katlamayı GÖRMEZ: `mailerLiteCustomFields` kendi
      // boşaltmasını kendi yapıyor. İkisi karışsa adres `zoom_link`
      // alanına yazılırdı.
      const { client } = notionSahte({
        satirlar: [cokluSatir(1)],
        etkinlik: {
          properties: {
            'Başlık': { title: [{ plain_text: 'Kadıköy Açık Kapı' }] },
            'Mekân/Platform': { select: { name: 'İstanbul' } },
            'Katılım Linki': { rich_text: [] },
            'Konum Detay': { rich_text: [{ plain_text: 'Kadıköy, sokak 5' }] },
            Tarih: { date: { start: '2026-10-12' } },
            Format: { select: { name: 'Açık Kapı' } },
          },
        },
      });
      const s = await kayitOku(client, KAYITLAR_DB, REF);
      expect(s.katilim).toEqual({ tipi: 'adres', deger: 'Kadıköy, sokak 5' });
      // Ham: link BOŞ, mekân şehir adı. Adres ham alanlara SIZMADI.
      expect(s.katilimLinkiHam).toBe('');
      expect(s.mekanHam).toBe('İstanbul');
      expect(s.formatHam).toBe('Açık Kapı');
    });
  });

  describe('regresyon — eski kusurun geri sızmaması', () => {
    it('YANLIŞ property Notion 400 alır ve "bulunamadi" olarak maskelenmez', async () => {
      // Sahte istemci `Kayıt ID`/title dışındaki her filtreye 400 atar.
      // Kod `Referans No`ya geri dönerse bu test 'hata' görür; asıl kusur
      // ise 'hata'nın 'bulunamadi'dan ayrılamamasıydı — ikisi birlikte
      // ölçülüyor.
      const { client } = notionSahte({ satirlar: [kayitSatiri()] });
      const s = await kayitOku(client, KAYITLAR_DB, REF);
      expect(s.durum).toBe('bulundu');
      expect(s.durum).not.toBe('hata');
    });
  });
});
