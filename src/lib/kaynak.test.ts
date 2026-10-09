import { describe, it, expect } from 'vitest';
import {
  UTM_ANAHTARLARI,
  KAYNAK_ANAHTARI,
  UTM_AZAMI_UZUNLUK,
  UTM_NOTION_ALANLARI,
  OLCUM_RIZASI_ALANI,
  utmTemizle,
  utmOku,
  kaynakCoz,
  kaynakYazilacakMi,
  kaynakGovdeSuz,
  kaynakNotionProperties,
  kayitKaynakYuku,
  olcumRizasiProperty,
} from './kaynak';

/** B118 İŞ C — kaynak etiketinin kuralı. */

describe('sabitler brief ile birebir', () => {
  it('beş UTM anahtarı okunuyor', () => {
    expect([...UTM_ANAHTARLARI]).toEqual([
      'utm_source',
      'utm_medium',
      'utm_campaign',
      'utm_content',
      'utm_term',
    ]);
  });

  it('`sessionStorage` anahtarı ve uzunluk sınırı', () => {
    expect(KAYNAK_ANAHTARI).toBe('ocak-kaynak');
    expect(UTM_AZAMI_UZUNLUK).toBe(100);
  });

  it('Notion alan adları birebir — DÖRT alan, `utm_term` YOK', () => {
    expect(UTM_NOTION_ALANLARI).toEqual({
      utm_source: 'UTM Kaynak',
      utm_medium: 'UTM Ortam',
      utm_campaign: 'UTM Kampanya',
      utm_content: 'UTM İçerik',
    });
    expect(UTM_NOTION_ALANLARI).not.toHaveProperty('utm_term');
    expect(OLCUM_RIZASI_ALANI).toBe('Ölçüm Rızası');
  });
});

describe('utmTemizle — en çok 100 karakter, yalnız [A-Za-z0-9._~-]', () => {
  it('izinli değerler geçer', () => {
    expect(utmTemizle('meta')).toBe('meta');
    expect(utmTemizle('ak-19ekim')).toBe('ak-19ekim');
    expect(utmTemizle('a.b_c~d-e9')).toBe('a.b_c~d-e9');
  });

  it('baş-son boşluk kırpılır (reklam panoları sona boşluk koyabiliyor)', () => {
    expect(utmTemizle('  meta  ')).toBe('meta');
  });

  it('boş / tanımsız / dize-olmayan → null', () => {
    expect(utmTemizle('')).toBeNull();
    expect(utmTemizle('   ')).toBeNull();
    expect(utmTemizle(null)).toBeNull();
    expect(utmTemizle(undefined)).toBeNull();
    expect(utmTemizle(42)).toBeNull();
    expect(utmTemizle({})).toBeNull();
  });

  it('izinli olmayan karakter → null, DÜZELTİLMEZ', () => {
    expect(utmTemizle('ak 19ekim')).toBeNull();
    expect(utmTemizle('kampanya!')).toBeNull();
    expect(utmTemizle('<script>')).toBeNull();
    expect(utmTemizle('a/b')).toBeNull();
    expect(utmTemizle('meta%20x')).toBeNull();
    expect(utmTemizle('kış')).toBeNull();
  });

  it('100 karakter geçer, 101 geçmez', () => {
    expect(utmTemizle('a'.repeat(100))).toHaveLength(100);
    expect(utmTemizle('a'.repeat(101))).toBeNull();
  });
});

describe('utmOku — URL\'den okuma', () => {
  it('beş parametre okunur', () => {
    expect(
      utmOku(
        '?utm_source=meta&utm_medium=paid&utm_campaign=ak-19ekim&utm_content=test&utm_term=kadin',
      ),
    ).toEqual({
      utm_source: 'meta',
      utm_medium: 'paid',
      utm_campaign: 'ak-19ekim',
      utm_content: 'test',
      utm_term: 'kadin',
    });
  });

  it('ilgisiz parametreler görmezden gelinir', () => {
    expect(utmOku('?ref=OCAK-1234&etkinlik=abc&utm_source=meta')).toEqual({
      utm_source: 'meta',
    });
  });

  it('GEÇERSİZ değer atılır, geçerli olanlar kalır (kayıt reddedilmez)', () => {
    expect(utmOku('?utm_source=meta&utm_campaign=ak%2019ekim')).toEqual({
      utm_source: 'meta',
    });
  });

  it('UTM yok / boş arama → boş nesne', () => {
    expect(utmOku('')).toEqual({});
    expect(utmOku(null)).toEqual({});
    expect(utmOku('?ref=OCAK-1')).toEqual({});
  });
});

describe('kaynakCoz — saklanmış değer de DOĞRULANIR (kullanıcı düzenleyebiliyor)', () => {
  it('geçerli JSON çözülür', () => {
    expect(kaynakCoz('{"utm_source":"meta","utm_medium":"paid"}')).toEqual({
      utm_source: 'meta',
      utm_medium: 'paid',
    });
  });

  it('bozuk JSON / dizi / ilkel → boş nesne', () => {
    expect(kaynakCoz('{bozuk')).toEqual({});
    expect(kaynakCoz('[1,2]')).toEqual({});
    expect(kaynakCoz('"meta"')).toEqual({});
    expect(kaynakCoz('null')).toEqual({});
    expect(kaynakCoz(null)).toEqual({});
  });

  it('elle kurcalanmış geçersiz değer atılır', () => {
    expect(kaynakCoz('{"utm_source":"<script>","utm_medium":"paid"}')).toEqual({
      utm_medium: 'paid',
    });
  });

  it('bilinmeyen anahtarlar taşınmaz', () => {
    expect(kaynakCoz('{"utm_source":"meta","gizli":"x"}')).toEqual({ utm_source: 'meta' });
  });
});

describe('kaynakYazilacakMi — İLK DOKUNUŞ KAZANIR', () => {
  it('anahtar boşken URL\'deki UTM yazılır', () => {
    expect(kaynakYazilacakMi(null, '?utm_source=meta')).toEqual({ utm_source: 'meta' });
  });

  it('anahtar DOLUYKEN üzerine YAZILMAZ — ikinci sayfanın boş URL\'i kaynağı silmesin', () => {
    expect(kaynakYazilacakMi('{"utm_source":"meta"}', '?utm_source=google')).toBeNull();
    expect(kaynakYazilacakMi('{"utm_source":"meta"}', '')).toBeNull();
  });

  it('URL\'de yazmaya değer UTM yoksa null (boş nesne yazılmaz)', () => {
    expect(kaynakYazilacakMi(null, '?ref=OCAK-1')).toBeNull();
    expect(kaynakYazilacakMi(null, '')).toBeNull();
  });

  it('saklanan değer BOZUKSA ilk dokunuş sayılmaz — yeniden yazılır', () => {
    expect(kaynakYazilacakMi('{bozuk', '?utm_source=meta')).toEqual({ utm_source: 'meta' });
    expect(kaynakYazilacakMi('{}', '?utm_source=meta')).toEqual({ utm_source: 'meta' });
  });
});

describe('kaynakGovdeSuz — SUNUCU kapısı, istemciye güvenilmez', () => {
  it('gövdenin kökündeki düz UTM alanları süzülür', () => {
    expect(
      kaynakGovdeSuz({
        ad: 'Ayşe',
        utm_source: 'meta',
        utm_medium: 'paid',
        utm_campaign: 'ak-19ekim',
      }),
    ).toEqual({ utm_source: 'meta', utm_medium: 'paid', utm_campaign: 'ak-19ekim' });
  });

  it('GEÇERSİZ değer atılır, kayıt reddedilmez (§9.6)', () => {
    expect(
      kaynakGovdeSuz({ utm_source: 'a'.repeat(200), utm_medium: 'paid', utm_content: '<img>' }),
    ).toEqual({ utm_medium: 'paid' });
  });

  it('gövde nesne değilse boş', () => {
    expect(kaynakGovdeSuz(null)).toEqual({});
    expect(kaynakGovdeSuz('meta')).toEqual({});
    expect(kaynakGovdeSuz([])).toEqual({});
  });

  it('sayı/nesne değerler atılır (tip zorlaması yok)', () => {
    expect(kaynakGovdeSuz({ utm_source: 5, utm_medium: { a: 1 }, utm_campaign: 'x' })).toEqual({
      utm_campaign: 'x',
    });
  });
});

describe('kaynakNotionProperties — dört alan', () => {
  it('dolu değerler rich_text property\'si olur', () => {
    expect(
      kaynakNotionProperties({ utm_source: 'meta', utm_campaign: 'ak-19ekim' }),
    ).toEqual({
      'UTM Kaynak': { rich_text: [{ text: { content: 'meta' } }] },
      'UTM Kampanya': { rich_text: [{ text: { content: 'ak-19ekim' } }] },
    });
  });

  it('boş yükte HİÇ property üretilmez — UTM\'siz kayıt eskisi gibi yazılır (§9.5)', () => {
    expect(kaynakNotionProperties({})).toEqual({});
  });

  it('`utm_term` taşınsa bile property üretilmez (alan Notion\'da yok)', () => {
    expect(kaynakNotionProperties({ utm_term: 'kadin' })).toEqual({});
  });

  it('dört alanın hepsi eşlenebiliyor', () => {
    const hepsi = kaynakNotionProperties({
      utm_source: 'a',
      utm_medium: 'b',
      utm_campaign: 'c',
      utm_content: 'd',
      utm_term: 'e',
    });
    expect(Object.keys(hepsi).sort()).toEqual(
      ['UTM Kaynak', 'UTM Ortam', 'UTM Kampanya', 'UTM İçerik'].sort(),
    );
  });
});

describe('olcumRizasiProperty', () => {
  it('true ve false ikisi de yazılır — İŞ D\'nin süzgeci alanın dolduğunu varsayıyor', () => {
    expect(olcumRizasiProperty(true)).toEqual({ 'Ölçüm Rızası': { checkbox: true } });
    expect(olcumRizasiProperty(false)).toEqual({ 'Ölçüm Rızası': { checkbox: false } });
  });
});

describe('kayitKaynakYuku — istemcinin gövdeye kattığı parça', () => {
  it('kaynak + `kabul` → UTM alanları ve `olcum_rizasi: true`', () => {
    expect(
      kayitKaynakYuku({ kaynakHam: '{"utm_source":"meta"}', rizaKabul: true }),
    ).toEqual({ utm_source: 'meta', olcum_rizasi: true });
  });

  it('rıza YOKSA `olcum_rizasi` gövdeye HİÇ girmez (brief §6)', () => {
    const yuk = kayitKaynakYuku({ kaynakHam: '{"utm_source":"meta"}', rizaKabul: false });
    expect(yuk).toEqual({ utm_source: 'meta' });
    expect(yuk).not.toHaveProperty('olcum_rizasi');
  });

  it('kaynak yok + rıza yok → BOŞ: gövde eskisiyle birebir aynı kalır', () => {
    expect(kayitKaynakYuku({ kaynakHam: null, rizaKabul: false })).toEqual({});
  });

  it('kaynak yok ama rıza var → yalnız bayrak', () => {
    expect(kayitKaynakYuku({ kaynakHam: null, rizaKabul: true })).toEqual({
      olcum_rizasi: true,
    });
  });

  it('kişisel veri taşımıyor — yalnız UTM ve bayrak', () => {
    const yuk = kayitKaynakYuku({
      kaynakHam: '{"utm_source":"meta","email":"a@b.com","ad":"Ayşe"}',
      rizaKabul: true,
    });
    expect(Object.keys(yuk).sort()).toEqual(['olcum_rizasi', 'utm_source']);
  });
});
