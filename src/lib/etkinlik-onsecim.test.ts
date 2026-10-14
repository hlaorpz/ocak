// etkinlik-onsecim.test.ts — etkinlikten kayda ön seçim mantığının bekçisi.
//
// Bu testler `KayitFormu.astro` script'inin yerine duruyor: .astro script'ine
// test konamıyor (KARAR 574 komşusu), bu yüzden karar verme mantığı saf
// fonksiyonlara taşındı ve bekçi buraya yazıldı. Test `src/lib/` altında —
// `src/pages/` altına konursa Astro onu route sayar ve build düşer.

import { describe, it, expect } from 'vitest';
import {
  ETKINLIK_PARAM,
  etkinlikParamTipi,
  onSecimIndexi,
  kayitLinkiParamEkle,
  type OnSecimSecenegi,
} from './etkinlik-onsecim';

// `/acik-kapi/kayit`ın canlı option listesinin ölçülmüş iskeleti (14 Eki):
// index 0 yer tutucu, sonrası Notion ID'li etkinlikler. ID'ler gerçek canlı
// değerler — tireli biçim, `dist/` grep'inden alındı.
const SECENEKLER: OnSecimSecenegi[] = [
  { value: '' },
  { value: '3bfb61eb-fa87-8038-a479-e3c9b0c09a66', slug: 'bir-esikte-duruyorsun' },
  { value: '3bfb61eb-fa87-80e8-a71a-c411de86182c', slug: 'ates-seninle-geldi-2026-10-15' },
  { value: '3bfb61eb-fa87-80bf-a5ca-c9ebe401f72f', slug: 'istek-mi-ihtiyac-mi' },
];

describe('etkinlikParamTipi', () => {
  it('tireli Notion ID → id', () => {
    expect(etkinlikParamTipi('3bfb61eb-fa87-8038-a479-e3c9b0c09a66')).toBe('id');
  });

  it('tiresiz 32 hex → id', () => {
    expect(etkinlikParamTipi('3bfb61ebfa878038a479e3c9b0c09a66')).toBe('id');
  });

  it('büyük harfli ID → id (Notion ID büyük/küçük harf duyarsız)', () => {
    expect(etkinlikParamTipi('3BFB61EB-FA87-8038-A479-E3C9B0C09A66')).toBe('id');
  });

  it('slug → slug', () => {
    expect(etkinlikParamTipi('bir-esikte-duruyorsun')).toBe('slug');
  });

  it('tarihli slug 32 hex sanılmaz', () => {
    expect(etkinlikParamTipi('ates-seninle-geldi-2026-10-15')).toBe('slug');
  });

  it('boş, boşluk, null, undefined → bos', () => {
    expect(etkinlikParamTipi('')).toBe('bos');
    expect(etkinlikParamTipi('   ')).toBe('bos');
    expect(etkinlikParamTipi(null)).toBe('bos');
    expect(etkinlikParamTipi(undefined)).toBe('bos');
  });
});

describe('onSecimIndexi — ön seçim', () => {
  it('sluğu listede olan etkinliği seçer', () => {
    expect(onSecimIndexi('bir-esikte-duruyorsun', SECENEKLER)).toBe(1);
  });

  it('tireli ID ile seçer (davet linki biçimi)', () => {
    expect(onSecimIndexi('3bfb61eb-fa87-80e8-a71a-c411de86182c', SECENEKLER)).toBe(2);
  });

  it('tiresiz ID ile de aynı seçeneği bulur', () => {
    expect(onSecimIndexi('3bfb61ebfa8780e8a71ac411de86182c', SECENEKLER)).toBe(2);
  });

  it('büyük harfli ID ile de bulur', () => {
    expect(onSecimIndexi('3BFB61EBFA8780E8A71AC411DE86182C', SECENEKLER)).toBe(2);
  });

  it('geçersiz slug → null (sessiz boş seçim, hata yok)', () => {
    expect(onSecimIndexi('boyle-bir-etkinlik-yok', SECENEKLER)).toBeNull();
  });

  it('geçmiş tarihli etkinliğin sluğu → null (listeye hiç girmiyor)', () => {
    // `filterDropdownEtkinlikleri` geçmişi ve kaydı kapalıyı option listesine
    // almıyor; yani geçmiş bir slug burada doğal olarak eşleşmez.
    expect(onSecimIndexi('kulun-altindan-derman-2026-09-20', SECENEKLER)).toBeNull();
  });

  it('başka formatın sluğu → null (Çember sluğu Açık Kapı formunda)', () => {
    expect(onSecimIndexi('ellerin-dolu-2026-10-21', SECENEKLER)).toBeNull();
  });

  it('listede olmayan bir ID → null', () => {
    expect(onSecimIndexi('ffffffff-ffff-ffff-ffff-ffffffffffff', SECENEKLER)).toBeNull();
  });

  it('boş parametre → null', () => {
    expect(onSecimIndexi('', SECENEKLER)).toBeNull();
    expect(onSecimIndexi(null, SECENEKLER)).toBeNull();
  });

  it('yer tutucu seçenek hiçbir zaman seçilmez', () => {
    expect(onSecimIndexi('', SECENEKLER)).not.toBe(0);
    // Sluğu olmayan bir etkinlik de boş slug üzerinden eşleşmemeli.
    const slugsuz: OnSecimSecenegi[] = [{ value: '' }, { value: 'abc-id', slug: '' }];
    expect(onSecimIndexi('', slugsuz)).toBeNull();
  });

  it('boş seçenek listesi → null', () => {
    expect(onSecimIndexi('bir-esikte-duruyorsun', [])).toBeNull();
  });
});

describe('kayitLinkiParamEkle — link üretimi', () => {
  it('göreli kayıt yoluna parametre ekler', () => {
    expect(kayitLinkiParamEkle('/acik-kapi/kayit', 'bir-esikte-duruyorsun')).toBe(
      '/acik-kapi/kayit?etkinlik=bir-esikte-duruyorsun',
    );
  });

  it('parametre adı tek kaynaktan gelir', () => {
    expect(kayitLinkiParamEkle('/cember/kayit', 'x')).toContain(`${ETKINLIK_PARAM}=`);
  });

  it('mevcut query ile BİRLEŞTİRİR, ezmez', () => {
    expect(kayitLinkiParamEkle('/acik-kapi/kayit?ref=OCAK-9CL9', 'bir-esikte-duruyorsun')).toBe(
      '/acik-kapi/kayit?ref=OCAK-9CL9&etkinlik=bir-esikte-duruyorsun',
    );
  });

  it('zaten etkinlik parametresi varsa dokunmaz', () => {
    const href = '/acik-kapi/kayit?etkinlik=elle-yazilmis';
    expect(kayitLinkiParamEkle(href, 'bir-esikte-duruyorsun')).toBe(href);
  });

  it('etkinlik_id gibi benzer adı etkinlik sanmaz', () => {
    expect(kayitLinkiParamEkle('/acik-kapi/kayit?etkinlik_id=123', 'bes')).toBe(
      '/acik-kapi/kayit?etkinlik_id=123&etkinlik=bes',
    );
  });

  it('fragment korunur, parametre ondan önce girer', () => {
    expect(kayitLinkiParamEkle('/acik-kapi/kayit#form', 'bir-esikte-duruyorsun')).toBe(
      '/acik-kapi/kayit?etkinlik=bir-esikte-duruyorsun#form',
    );
    expect(kayitLinkiParamEkle('/acik-kapi/kayit?ref=A#form', 'bes')).toBe(
      '/acik-kapi/kayit?ref=A&etkinlik=bes#form',
    );
  });

  it('kendi host`umuzun mutlak adresine ekler', () => {
    expect(
      kayitLinkiParamEkle('https://www.ocak.biz/acik-kapi/kayit', 'bir-esikte-duruyorsun'),
    ).toBe('https://www.ocak.biz/acik-kapi/kayit?etkinlik=bir-esikte-duruyorsun');
    expect(kayitLinkiParamEkle('https://ocak.biz/cember/kayit', 'bes')).toBe(
      'https://ocak.biz/cember/kayit?etkinlik=bes',
    );
  });

  it('site DIŞI adrese eklemez', () => {
    const dis = 'https://www.notion.so/kayit/yaz-acik-kapi-2026';
    expect(kayitLinkiParamEkle(dis, 'bes')).toBe(dis);
    const form = 'https://docs.google.com/forms/d/e/abc/viewform';
    expect(kayitLinkiParamEkle(form, 'bes')).toBe(form);
    expect(kayitLinkiParamEkle('//baska.com/kayit', 'bes')).toBe('//baska.com/kayit');
    expect(kayitLinkiParamEkle('mailto:selam@ocak.biz', 'bes')).toBe('mailto:selam@ocak.biz');
  });

  it('ocak.biz benzeri aldatıcı host dış sayılır', () => {
    const tuzak = 'https://ocak.biz.kotu.com/kayit';
    expect(kayitLinkiParamEkle(tuzak, 'bes')).toBe(tuzak);
  });

  it('boş href ya da boş slug → dokunmaz', () => {
    expect(kayitLinkiParamEkle('', 'bes')).toBe('');
    expect(kayitLinkiParamEkle('   ', 'bes')).toBe('');
    expect(kayitLinkiParamEkle('/acik-kapi/kayit', '')).toBe('/acik-kapi/kayit');
    expect(kayitLinkiParamEkle('/acik-kapi/kayit', null)).toBe('/acik-kapi/kayit');
    expect(kayitLinkiParamEkle(null, 'bes')).toBe('');
  });

  it('slug URL-kodlanır', () => {
    expect(kayitLinkiParamEkle('/acik-kapi/kayit', 'bir esik&x')).toBe(
      '/acik-kapi/kayit?etkinlik=bir%20esik%26x',
    );
  });
});

describe('davet linki — ref ile birlikte uçtan uca', () => {
  it('davet linkinin ID`si kayıt formunda seçimi bulur', () => {
    // `DavetKutusu` `?etkinlik=<id>&ref=<kod>` üretiyor. Kayıt route'u aynı
    // parametreyi okuduğunda ID dalından seçmeli; `ref` ayrı okunur, karışmaz.
    const sorgu = new URLSearchParams('etkinlik=3bfb61eb-fa87-8038-a479-e3c9b0c09a66&ref=OCAK-9CL9');
    expect(onSecimIndexi(sorgu.get(ETKINLIK_PARAM), SECENEKLER)).toBe(1);
    expect(sorgu.get('ref')).toBe('OCAK-9CL9');
  });

  it('slug + ref birlikte de çalışır', () => {
    const sorgu = new URLSearchParams('etkinlik=istek-mi-ihtiyac-mi&ref=OCAK-9CL9');
    expect(onSecimIndexi(sorgu.get(ETKINLIK_PARAM), SECENEKLER)).toBe(3);
  });

  it('ref`li linke parametre eklerken ref korunur', () => {
    expect(kayitLinkiParamEkle('/acik-kapi/kayit?ref=OCAK-9CL9', 'istek-mi-ihtiyac-mi')).toBe(
      '/acik-kapi/kayit?ref=OCAK-9CL9&etkinlik=istek-mi-ihtiyac-mi',
    );
  });
});
