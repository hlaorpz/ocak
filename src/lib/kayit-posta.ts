/**
 * kayit-posta.ts — kayıt anında hangi mailin gideceği ve değişkenleri.
 *
 * ── Neden ayrı lib ──
 * Karar `src/pages/api/kayit.ts`'te yaşasa test edilemezdi (`src/pages/`
 * altındaki her dosya bir Astro route'u, oraya test konamaz — KARAR 574).
 * Route artık yalnız "planı uygula" diyor; "hangi mail, hangi değişken"
 * sorusu burada ve ölçülebilir.
 *
 * ── Üç yol, üç sonuç (Kaan tablosu, 7 Eki) ──
 *
 *   ücretsiz (`kapiAcik`) → `yerin-hazir-*`  · kayıt anında yerin hazır
 *   havale                → `yerini-tutuyoruz` · süre + iki ödeme yolu
 *   kart                  → MAIL YOK
 *
 * **Kart neden sessiz:** kadın kayıt formundan doğrudan N-Kolay ekranına
 * düşüyor; o anda "yerini tutuyoruz" demek, henüz denemediği bir şeyin
 * başarısızlığını varsaymak olurdu. Ödemezse 30 dakika sonra tarama ucu
 * hatırlatır (brief §4), öderse callback "yerin hazır" gönderir. Yani kartta
 * mailin olmaması bir eksik değil, zamanlama kararı.
 *
 * ── Başvuru akışı kapsam DIŞI ──
 * `Kayıt Tipi = Başvuru` olan etkinliklerde katılım bilgisi henüz yok ve
 * kabul kararı Kaan'ın. O akış bugün de mail göndermiyordu (MailerLite
 * çağrısı `direktAkis` koşuluna bağlıydı); davranış korunuyor.
 */
import { ilkAd } from './davet-baglam.ts';
import { etkinlikUrlFormatla } from './kayit.ts';
import { formatEtkinlikTarihi } from './format-etkinlik.ts';
import {
  SABLON,
  yerinHazirSablonu,
  yolTarifiLinki,
  tutarMetni,
  type SablonAdi,
} from './posta.ts';
import { sonAnMetni } from './yer-tutma.ts';

export type KayitPostaGirdi = {
  /** `OCAK-XXXX`. Mailin `REFERANS_NO`'su ve log kimliği. */
  referansNo: string;
  /** Formdan gelen ad — `AD` değişkeni ilk kelimesini alır. */
  ad: string;
  /** Ödeme bekleniyor mu (`hesap.toplam > 0`). `false` → ücretsiz/tam burs. */
  ucretliMi: boolean;
  /** Seçilen ödeme yöntemi. Ücretsizde anlamsız. */
  yontem: 'kart' | 'havale';
  /** Ödenecek toplam ve etkinliğin para birimi — `TUTAR` ikisinden kurulur. */
  tutar: number;
  paraBirimi: string;
  /** Etkinlik alanları (Notion Etkinlikler sayfası, ham). */
  baslik: string;
  slug: string;
  tarihISO: string;
  tarihBitis: string;
  /** Mekâna bağlı eşlemeyle çözülmüş saat (cross-fallback yok). */
  saat: string;
  mekan: string;
  katilimLinki: string;
  zoomSifresi: string;
  konumDetay: string;
  /** `Yer Tutma Bitişi` — `ODEME_SON_AN` buradan. Ücretsizde `null`. */
  yerTutmaBitisi: Date | null;
  /** İmzalı kart devam linki. Sır boşsa boş dize gelir. */
  odemeLinki: string;
};

export type KayitPostaPlani = {
  sablon: SablonAdi;
  degiskenler: Record<string, string>;
} | null;

/**
 * Kayıt anında gönderilecek maili ve değişkenlerini üretir. `null` = mail yok.
 *
 * `null` dönen iki hâl ayrı sebeplerle:
 *   • kart → zamanlama kararı (yukarıdaki not)
 *   • `Yer Tutma Bitişi` yok ama ücretli → süre söylenemez, mail de
 *     söylenemez. `ODEME_SON_AN` uydurmak kadına yanlış bir son an verirdi.
 */
export function kayitPostaPlani(g: KayitPostaGirdi): KayitPostaPlani {
  const AD = ilkAd(g.ad);
  const ETKINLIK_BASLIGI = (g.baslik ?? '').trim();
  const ETKINLIK_TARIHI = g.tarihISO
    ? formatEtkinlikTarihi(g.tarihISO, g.tarihBitis, g.saat)
    : '';
  const ETKINLIK_URL = etkinlikUrlFormatla(g.slug);

  // ── Ücretsiz: yerin hazır, hemen ──
  if (!g.ucretliMi) {
    const sablon = yerinHazirSablonu(g.mekan);
    const ortak = { AD, ETKINLIK_BASLIGI, ETKINLIK_TARIHI, ETKINLIK_URL };
    if (sablon === SABLON.yerinHazirOnline) {
      return {
        sablon,
        degiskenler: {
          ...ortak,
          KATILIM_LINKI: (g.katilimLinki ?? '').trim(),
          ZOOM_SIFRESI: (g.zoomSifresi ?? '').trim(),
        },
      };
    }
    return {
      sablon,
      degiskenler: {
        ...ortak,
        MEKAN: (g.mekan ?? '').trim(),
        ADRES: (g.konumDetay ?? '').trim(),
        YOL_TARIFI_LINKI: yolTarifiLinki(g.konumDetay, ETKINLIK_URL),
      },
    };
  }

  // ── Kart: kayıt anında mail yok ──
  if (g.yontem === 'kart') return null;

  // ── Havale: yerini tutuyoruz ──
  // Süre söylenemiyorsa mail de söylenemez.
  if (!g.yerTutmaBitisi) return null;
  return {
    sablon: SABLON.yeriniTutuyoruz,
    degiskenler: {
      AD,
      ETKINLIK_BASLIGI,
      ETKINLIK_TARIHI,
      TUTAR: tutarMetni(g.tutar, g.paraBirimi),
      REFERANS_NO: g.referansNo,
      // ⚠ Mailde İKİ ödeme yolu birlikte durur (brief §1): IBAN şablonda sabit,
      // kart devam linki bu değişkende. Kadın seçtiği yöntemle bağlı değil —
      // havale seçip kartla ödeyebilir.
      ODEME_LINKI: g.odemeLinki,
      ODEME_SON_AN: sonAnMetni(g.yerTutmaBitisi),
    },
  };
}
