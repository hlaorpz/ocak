import { describe, it, expect, vi } from 'vitest';
import {
  B118_ALANLARI,
  b118AlaniVarMi,
  b118AlanlariniAt,
  notionKayitYaz,
} from './kayit-yazim';
import { UTM_NOTION_ALANLARI, OLCUM_RIZASI_ALANI } from './kaynak';

/**
 * B118 K-5 — **ölçüm kaydı asla düşürmez.**
 *
 * Brief §9.5'in son kilidi: "alanlar Notion'da yokken DE kayıt yazılıyor."
 * Notion API var olmayan bir property'ye yazmayı tüm sayfa oluşturmayı
 * REDDEDEREK cevaplıyor — yani ölçüm için eklenen bir alan, kaydın kendisini
 * düşürebilirdi. Kadın hata ekranı görür, yeri tutulmaz.
 */

const TEMEL = {
  'Kayıt ID': { title: [{ text: { content: 'OCAK-1234' } }] },
  Tip: { select: { name: 'Kayıt' } },
  Email: { email: 'a@b.com' },
};

const B118 = {
  'UTM Kaynak': { rich_text: [{ text: { content: 'meta' } }] },
  'UTM Ortam': { rich_text: [{ text: { content: 'paid' } }] },
  'Ölçüm Rızası': { checkbox: true },
};

describe('B118_ALANLARI — yedek yolun attığı küme', () => {
  it('beş alan, brief §8a ile birebir', () => {
    expect([...B118_ALANLARI]).toEqual([
      'UTM Kaynak',
      'UTM Ortam',
      'UTM Kampanya',
      'UTM İçerik',
      'Ölçüm Rızası',
    ]);
  });

  it('`kaynak.ts`in eşlemesiyle uyumlu — iki liste ayrışmasın', () => {
    for (const alan of Object.values(UTM_NOTION_ALANLARI)) {
      expect(B118_ALANLARI).toContain(alan);
    }
    expect(B118_ALANLARI).toContain(OLCUM_RIZASI_ALANI);
    // Dört UTM + bir checkbox = beş; fazlası yok.
    expect(B118_ALANLARI).toHaveLength(Object.keys(UTM_NOTION_ALANLARI).length + 1);
  });
});

describe('b118AlaniVarMi / b118AlanlariniAt', () => {
  it('B118 alanı yokken false', () => {
    expect(b118AlaniVarMi(TEMEL)).toBe(false);
  });

  it('tek bir B118 alanı bile varken true', () => {
    for (const alan of B118_ALANLARI) {
      expect(b118AlaniVarMi({ ...TEMEL, [alan]: {} })).toBe(true);
    }
  });

  it('ayıklama B118 alanlarını atar, diğerlerini AYNEN bırakır', () => {
    expect(b118AlanlariniAt({ ...TEMEL, ...B118 })).toEqual(TEMEL);
  });

  it('girdiye DOKUNMAZ (yeni nesne döner)', () => {
    const girdi = { ...TEMEL, ...B118 };
    const kopya = { ...girdi };
    b118AlanlariniAt(girdi);
    expect(girdi).toEqual(kopya);
  });

  it('B118 alanı olmayan nesne birebir döner', () => {
    expect(b118AlanlariniAt(TEMEL)).toEqual(TEMEL);
  });
});

describe('notionKayitYaz — ilk deneme geçerse ikinci hiç koşmaz', () => {
  it('başarıda tek çağrı, properties AYNEN gider', async () => {
    const olustur = vi.fn().mockResolvedValue('page-1');
    const id = await notionKayitYaz({
      olustur,
      properties: { ...TEMEL, ...B118 },
      referansNo: 'OCAK-1234',
    });
    expect(id).toBe('page-1');
    expect(olustur).toHaveBeenCalledOnce();
    expect(olustur).toHaveBeenCalledWith({ ...TEMEL, ...B118 });
  });
});

describe('notionKayitYaz — alanlar Notion\'da YOKKEN kayıt YİNE yazılıyor (§9.5)', () => {
  it('ilk deneme reddedilirse B118 alanları olmadan yeniden yazılır', async () => {
    const olustur = vi
      .fn()
      .mockRejectedValueOnce(
        new Error('body.properties.UTM Kaynak should be not present, instead was ...'),
      )
      .mockResolvedValueOnce('page-2');
    const log = vi.fn();

    const id = await notionKayitYaz({
      olustur,
      properties: { ...TEMEL, ...B118 },
      referansNo: 'OCAK-1234',
      log,
    });

    expect(id).toBe('page-2');
    expect(olustur).toHaveBeenCalledTimes(2);
    // İkinci deneme ölçüm alanları OLMADAN, kaydın kendisi EKSİKSİZ.
    expect(olustur.mock.calls[1][0]).toEqual(TEMEL);
  });

  it('log GÜRÜLTÜLÜ: ref, beş alan adı ve hata özeti geçiyor', async () => {
    const olustur = vi
      .fn()
      .mockRejectedValueOnce(new Error('property does not exist'))
      .mockResolvedValueOnce('page-3');
    const log = vi.fn();

    await notionKayitYaz({
      olustur,
      properties: { ...TEMEL, ...B118 },
      referansNo: 'OCAK-9999',
      log,
    });

    expect(log).toHaveBeenCalledOnce();
    const mesaj = log.mock.calls[0][0] as string;
    expect(mesaj).toContain('OCAK-9999');
    expect(mesaj).toContain('property does not exist');
    for (const alan of B118_ALANLARI) {
      expect(mesaj).toContain(alan);
    }
  });

  it('log verilmezse `console.error`a düşer — sessiz kalmaz', async () => {
    const hata = vi.spyOn(console, 'error').mockImplementation(() => {});
    const olustur = vi
      .fn()
      .mockRejectedValueOnce(new Error('x'))
      .mockResolvedValueOnce('page-4');
    await notionKayitYaz({ olustur, properties: { ...TEMEL, ...B118 }, referansNo: 'OCAK-1' });
    expect(hata).toHaveBeenCalledOnce();
    hata.mockRestore();
  });
});

describe('notionKayitYaz — ÇİFT KAYIT koruması', () => {
  it('B118 alanı GÖNDERİLMEMİŞSE ikinci deneme YAPILMAZ, hata fırlatılır', async () => {
    const olustur = vi.fn().mockRejectedValue(new Error('ağ hatası'));
    const log = vi.fn();

    await expect(
      notionKayitYaz({ olustur, properties: TEMEL, referansNo: 'OCAK-1', log }),
    ).rejects.toThrow('ağ hatası');

    // Tek deneme: `pages.create` yeni satır açıyor, ikinci istek çift kayıt riski.
    expect(olustur).toHaveBeenCalledOnce();
    expect(log).not.toHaveBeenCalled();
  });

  it('ikinci deneme de patlarsa hata ÇAĞIRANA gider — sessizce yutulmaz', async () => {
    const olustur = vi.fn().mockRejectedValue(new Error('Notion 500'));
    const log = vi.fn();

    await expect(
      notionKayitYaz({ olustur, properties: { ...TEMEL, ...B118 }, referansNo: 'OCAK-1', log }),
    ).rejects.toThrow('Notion 500');

    expect(olustur).toHaveBeenCalledTimes(2);
    // O noktada sorun ölçüm alanlarında değil, kaydın kendisinde: kadına
    // "kaydın alındı" demek yalan olurdu.
  });
});
