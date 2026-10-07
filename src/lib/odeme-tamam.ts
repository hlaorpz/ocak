/**
 * odeme-tamam.ts — `/odeme/tamam` sayfasının gövdesi.
 *
 * ── Neden lib'de ──
 * `.astro` frontmatter'ı test edilemiyor (`odeme-kayit-oku.ts` dosya başı) ve
 * bu sayfanın NE GÖSTERMEDİĞİ bir karar: katılım bilgisi (Zoom bağlantısı,
 * şifre, mekân, adres) sayfadan KALKTI. Sayfa `?ref=OCAK-XXXX` ile açılıyor ve
 * referans maillerde, banka açıklamasında, WhatsApp'ta dolaşıyor — yani
 * tahmin edilebilir bir adres. Katılım bilgisini oraya basmak, bağlantıyı
 * referansı bilen herkese açmak demekti. Bilgi e-postada duruyor; e-posta
 * kadının kendi kutusu.
 *
 * ── Metinler brief'te verildi ──
 * Hepsi Kaan'ın (7 Eki paketi İŞ 7). Kod yeni kamu metni yazmaz.
 */
import { formatEtkinlikTarihi } from './format-etkinlik.ts';
import { mekanOnlineMi } from './posta.ts';

export type TamamGorunum = {
  /** Kayıt bulundu mu — bulunamadı dalının metinleri DEĞİŞMEDİ. */
  bulundu: boolean;
  baslik: string;
  /** Başlığın altındaki tek cümle. */
  giris: string;
  /** Durum kartı: buluşmanın adı + tarih-saat. Boş satır basılmaz. */
  kart: string[];
  /** Katılım bilgisinin NEREDE olduğunu söyleyen satır. */
  nerede: string;
  /** Mail gecikirse ne yapılacağı. */
  gecikme: string;
  /** Kapanış — mekâna göre iki ayrı cümle. */
  kapanis: string;
  /** Bulunamadı dalının yardım adresi; bulundu dalında boş. */
  yardimEposta: string;
};

export type TamamGirdi = {
  kayitDurumu: 'bulundu' | 'bulunamadi' | 'hata';
  /** Etkinlikler `Başlık`. */
  baslik: string;
  /** Etkinlikler `Tarih` date.start / date.end. */
  tarihISO: string;
  tarihBitis: string;
  /**
   * Etkinlik saati — **mekâna bağlı eşlemeyle çözülmüş** (`saatHam`).
   *
   * ⚠ `kayitOku`'nun `etkinlikTarihi` alanı KULLANILMAZ: o alan
   * `rich('Saat') || rich('Zoom Başlangıç Saati')` düz OR'uyla kurulmuş saati
   * taşıyor — `api/kayit.ts:191-198`'in canlı veriyle çürüttüğü cross-fallback.
   * Sayfa ve mail AYNI kurucuyu kullanmalı, yoksa iki yüzey farklı saat söyler.
   */
  saat: string;
  /** Etkinlikler `Mekân/Platform` — online/yüz yüze dalını bu seçer. */
  mekan: string;
};

export function tamamGorunumu(g: TamamGirdi): TamamGorunum {
  if (g.kayitDurumu !== 'bulundu') {
    // Bu dal DEĞİŞMEDİ. Sayfa `ref` olmadan doğrudan açılabiliyor; sabit bir
    // "Ödemen alındı" başlığı hiç ödeme yapmamış birine ödeme yaptığını
    // söylerdi (commit 6'nın dersi).
    return {
      bulundu: false,
      baslik: 'Kaydını bulamadık.',
      giris: 'Ödemen alındıysa birkaç dakika içinde görünecektir. Görünmezse bize yaz — birlikte bakarız.',
      kart: [],
      nerede: '',
      gecikme: '',
      kapanis: '',
      yardimEposta: 'selam@ocak.biz',
    };
  }

  const online = mekanOnlineMi(g.mekan);
  const tarihSatiri = g.tarihISO
    ? formatEtkinlikTarihi(g.tarihISO, g.tarihBitis, g.saat)
    : '';

  return {
    bulundu: true,
    baslik: 'Yerin hazır.',
    giris: 'Ödemen bize ulaştı.',
    kart: [g.baslik.trim(), tarihSatiri].filter((s) => s.length > 0),
    // Katılım bilgisinin KENDİSİ değil, yeri söyleniyor.
    nerede: online ? 'Bağlantı ve şifre e-postanda.' : 'Mekân ve adres e-postanda.',
    gecikme:
      'Birkaç dakika içinde görmezsen gereksiz klasörüne bak ya da WhatsApp\'tan yaz, hemen iletelim.',
    kapanis: online
      ? 'Ateşi biz yakıyoruz. Sen kendi mumunu yakarsın, yeter.'
      : 'Ateşi biz yakıyoruz. Sen kendini getir, yeter.',
    yardimEposta: '',
  };
}
