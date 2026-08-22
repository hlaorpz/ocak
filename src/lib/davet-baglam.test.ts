import { describe, it, expect } from 'vitest';
import {
  gecerliLandingYolu,
  htmlKacir,
  ilkAd,
  metinKirp,
  AZAMI_AD_UZUNLUGU,
  AZAMI_ETKINLIK_UZUNLUGU,
} from './davet-baglam.ts';
import { FORMAT_KATEGORI } from './etkinlik-kategori.ts';

// Davet mailine giren bağlamın normalizasyonu. Üç alan da (`davetEdenAd`,
// `etkinlikAd`, `landingPath`) client gövdesinden gelir — yani buradaki her
// fonksiyon bir güven sınırında duruyor.

describe('metinKirp', () => {
  it('kırpar ve iç boşlukları tekler', () => {
    expect(metinKirp('  Ayşe   Nur  ', 60)).toBe('Ayşe Nur');
  });

  it('satır sonu ve sekmeyi de boşluk sayar', () => {
    // Mail gövdesine çok satırlı bir ad basılmasın.
    expect(metinKirp('Ayşe\n\tYılmaz', 60)).toBe('Ayşe Yılmaz');
  });

  it('sınırı aşanı keser', () => {
    expect(metinKirp('a'.repeat(80), 60)).toHaveLength(60);
  });

  it('kesimin ucunda boşluk bırakmaz', () => {
    // 'ab ' → slice sonrası sondaki boşluk temizlenir.
    expect(metinKirp('ab cdef', 3)).toBe('ab');
  });

  it('dize olmayan her şey boş dizedir', () => {
    expect(metinKirp(undefined, 60)).toBe('');
    expect(metinKirp(null, 60)).toBe('');
    expect(metinKirp(42, 60)).toBe('');
    expect(metinKirp({ ad: 'Ayşe' }, 60)).toBe('');
  });

  it('Türkçe karakter sayımı karakter bazlı — bayt değil', () => {
    // `çığır` = 5 karakter / 9 bayt. JS `.length` UTF-16 kod birimi sayar;
    // bu harflerde karakter = kod birimi, yani kesim beklendiği yerde olur.
    expect('çığır'.length).toBe(5);
    expect(metinKirp('çığır', 5)).toBe('çığır');
  });
});

describe('ilkAd', () => {
  it('tam addan ilk kelimeyi alır', () => {
    expect(ilkAd('Ayşe Yılmaz')).toBe('Ayşe');
  });

  it('tek parçalı ad olduğu gibi kalır', () => {
    // Kayıt formu dalı yalnız `ad` alanını geçirir — soyad hiç gelmez.
    expect(ilkAd('Ayşe')).toBe('Ayşe');
  });

  it('baştaki boşluk ilk kelimeyi kaydırmaz', () => {
    expect(ilkAd('   Ayşe Nur Yılmaz ')).toBe('Ayşe');
  });

  it('boş / eksik girdi boş dizedir', () => {
    expect(ilkAd('')).toBe('');
    expect(ilkAd('   ')).toBe('');
    expect(ilkAd(undefined)).toBe('');
  });

  it('ad sınırı ilk kelimeden ÖNCE uygulanır', () => {
    // Sınır tam ada uygulanır, sonra ilk kelime alınır: uzun bir gövde
    // yollansa bile ilk kelime sınırın içinde kalır.
    const uzun = 'a'.repeat(AZAMI_AD_UZUNLUGU + 40);
    expect(ilkAd(uzun)).toHaveLength(AZAMI_AD_UZUNLUGU);
  });
});

describe('gecerliLandingYolu', () => {
  it('yedi kayıt sayfasının slug\'ını da kabul eder', () => {
    for (const slug of ['cember', 'acik-kapi', 'mini-retreat', 'sehir-aksami', 'seremoni', 'atolye', 'yolculuk']) {
      expect(gecerliLandingYolu(`/${slug}`)).toBe(`/${slug}`);
    }
  });

  it('beyaz liste FORMAT_KATEGORI\'den türetilir — paralel liste yok', () => {
    // KARAR 284: tek gerçek. Haritaya yeni format girerse bu test onu
    // otomatik kapsar; elle güncellenecek ikinci bir liste yoktur.
    for (const slug of Object.values(FORMAT_KATEGORI)) {
      expect(gecerliLandingYolu(`/${slug}`)).toBe(`/${slug}`);
    }
  });

  it('listede olmayan yolu reddeder', () => {
    expect(gecerliLandingYolu('/gizli')).toBeNull();
    expect(gecerliLandingYolu('/odeme/tamam')).toBeNull();
  });

  it('mutlak URL reddedilir — açık yönlendirme kapısı', () => {
    expect(gecerliLandingYolu('https://kotu.example/cember')).toBeNull();
    expect(gecerliLandingYolu('//kotu.example')).toBeNull();
  });

  it('sorgu dizesi taşıyan yol temizlenmez, REDDEDİLİR', () => {
    // `?ref=` linke sunucu ekliyor; gövdeden gelen soru işareti onu ezme
    // denemesidir, kazara değil.
    expect(gecerliLandingYolu('/cember?ref=BASKASI')).toBeNull();
    expect(gecerliLandingYolu('/cember#x')).toBeNull();
  });

  it('baştaki eğik çizgi olmadan reddeder', () => {
    expect(gecerliLandingYolu('cember')).toBeNull();
  });

  it('boş / eksik / dize olmayan girdi null', () => {
    expect(gecerliLandingYolu('')).toBeNull();
    expect(gecerliLandingYolu('   ')).toBeNull();
    expect(gecerliLandingYolu(undefined)).toBeNull();
    expect(gecerliLandingYolu(null)).toBeNull();
    expect(gecerliLandingYolu(['/cember'])).toBeNull();
  });
});

describe('htmlKacir', () => {
  it('etiket açmaya çalışan adı zararsızlaştırır', () => {
    // Kaçırılmazsa OCAK\'ın doğrulanmış alan adından kimlik avı linki gider.
    expect(htmlKacir('<a href="http://kotu.example">tıkla</a>')).toBe(
      '&lt;a href=&quot;http://kotu.example&quot;&gt;tıkla&lt;/a&gt;',
    );
  });

  it('ampersandı ÖNCE kaçırır — çifte kaçış üretmez', () => {
    expect(htmlKacir('Ayşe & Zeynep')).toBe('Ayşe &amp; Zeynep');
    expect(htmlKacir('<')).toBe('&lt;');
  });

  it('tek tırnağı da kaçırır', () => {
    expect(htmlKacir("Ayşe'nin")).toBe('Ayşe&#39;nin');
  });

  it('sıradan Türkçe adı bozmaz', () => {
    expect(htmlKacir('Ayşe Çiğdem')).toBe('Ayşe Çiğdem');
  });
});

describe('sınır sabitleri', () => {
  it('etkinlik adı sınırı addan cömert — Notion Başlık uzun olabilir', () => {
    expect(AZAMI_ETKINLIK_UZUNLUGU).toBeGreaterThan(AZAMI_AD_UZUNLUGU);
  });
});
