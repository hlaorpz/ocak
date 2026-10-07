/**
 * odeme-devam.ts — `/odeme/devam` sayfasının dört durumu.
 *
 * ── Neden lib'de ──
 * `.astro` frontmatter'ı test edilemiyor (`odeme-kayit-oku.ts` dosya başı).
 * Sayfa dört ayrı metin basıyor ve hangisinin basıldığı güvenlik sonucu olan
 * bir karar: yanlış dal, ödemesi alınmış bir kadına "süresi doldu" ya da iptal
 * edilmiş bir kayda "Kartla öde" düğmesi gösterir. Karar burada, ölçülebilir.
 *
 * ── Metinler brief'te VERİLDİ, burada ÜRETİLMEDİ ──
 * Dördünün dördü de Kaan'ın yazdığı metin (brief §4 İŞ 5 tablosu + 7 Eki
 * düzeltmesi). Kod yeni kamu metni yazmaz (brief §0).
 *
 * 7 Eki düzeltmesi (Claude.ai) — Türkçe ek saate göre değişiyor ('a/'e):
 *   `"<ODEME_SON_AN>'a kadar yerini tutuyoruz."`
 *   → `"Yerini şu ana kadar tutuyoruz: <ODEME_SON_AN>"`
 * Cümle eksiz kuruldu; mailde de böyle.
 */
import { odemeBaslatilabilir } from './odeme-link.ts';
import { sonAnMetni } from './yer-tutma.ts';
import { tutarMetni } from './posta.ts';
import { formatEtkinlikTarihi } from './format-etkinlik.ts';

/** Dört durumun kimliği — yüzey bunlara göre dallanır. */
export type DevamDurumu = 'yerin-duruyor' | 'yerin-hazir' | 'suresi-doldu' | 'baglanti-acilmadi';

export type DevamGorunum = {
  durum: DevamDurumu;
  baslik: string;
  /**
   * DURUM KARTI satırları (İŞ 8) — buluşmanın adı · tarih-saat · katılım payı.
   * Amber çerçeveli kartta basılır; `/odeme/tamam` ile aynı yapı.
   */
  kart: string[];
  /**
   * `ODEME_SON_AN` — `8 Ekim Perşembe, 14:30 (Türkiye saati)`.
   *
   * Gövde cümlesinin İÇİNE gömülmüyor, AYRI taşınıyor (İŞ 8): yüzey onu
   * `white-space: nowrap` bir `<span>`'de basıyor, böylece satır ortasında
   * kırılmıyor. Cümlenin kendisi ("Yerini şu ana kadar tutuyoruz:") normal
   * sarılıyor — 360 px'te taşmamanın yolu bu, tümüne `nowrap` vermek değil.
   */
  sonAn: string;
  /** Kart ve son an dışındaki gövde satırları. Boş satır yazılmaz. */
  govde: string[];
  /** `Kartla öde` düğmesinin gideceği adres. Boşsa düğme basılmaz. */
  odemeUrl: string;
  /** `Buluşma sayfası` linki. Boşsa link basılmaz. */
  etkinlikUrl: string;
  /** Yardım adresi — yalnız `baglanti-acilmadi` durumunda. */
  yardimEposta: string;
};

export type DevamGirdi = {
  /** HMAC doğrulandı mı (`odemeLinkiGecerli`). */
  imzaGecerli: boolean;
  /** `kayitOku`'nun `durum`u — `bulundu` dışında her şey "açılmadı". */
  kayitDurumu: 'bulundu' | 'bulunamadi' | 'hata';
  kayitId: string;
  odemeDurumu: string;
  yerTutmaBitisi: Date | null;
  tutar: number;
  paraBirimi: string;
  /** Etkinlik meta — gövdenin ilk iki satırı ve "Buluşma sayfası" linki. */
  baslik: string;
  tarihISO: string;
  tarihBitis: string;
  saat: string;
  etkinlikUrl: string;
  simdi: Date;
};

/**
 * Durum sırası önemli: imza/kayıt → ödendi → iptal/süre → bekliyor.
 *
 * `Ödendi` **İptal'den ÖNCE** sorulur. Bir kayıt iptal edildikten sonra para
 * gelirse callback onu Ödendi'ye çeker (brief §1 "para kazanır") ve o kadına
 * "süresi doldu" göstermek yanlış olur. `odemeBaslatilabilir` da aynı sırayı
 * izliyor — iki yerde iki sıra olması, aynı kayda iki farklı gerçek demekti.
 */
export function devamGorunumu(g: DevamGirdi): DevamGorunum {
  const bos: DevamGorunum = {
    durum: 'baglanti-acilmadi',
    baslik: 'Bu bağlantı açılmadı.',
    kart: [],
    sonAn: '',
    govde: ['Maildeki bağlantıya yeniden dokun ya da bize yaz:'],
    odemeUrl: '',
    etkinlikUrl: '',
    yardimEposta: 'selam@ocak.biz',
  };

  // İmza tutmuyor ya da kayıt çözülemedi → tek metin. İki hâl kadın açısından
  // aynı (bağlantı çalışmadı); ayrım teşhis içindir ve log'da yaşar.
  if (!g.imzaGecerli || g.kayitDurumu !== 'bulundu') return bos;

  if (g.odemeDurumu === 'Ödendi') {
    return {
      durum: 'yerin-hazir',
      baslik: 'Yerin hazır.',
      kart: [],
      sonAn: '',
      govde: ['Katılım payın bize ulaştı. Detayları e-postayla yolladık.'],
      odemeUrl: '',
      etkinlikUrl: '',
      yardimEposta: '',
    };
  }

  const kapi = odemeBaslatilabilir({
    odemeDurumu: g.odemeDurumu,
    yerTutmaBitisi: g.yerTutmaBitisi,
    simdi: g.simdi,
  });

  if (!kapi.baslatilabilir) {
    // `Bedava`/`İade`/bilinmeyen durum da buraya düşer. "Süresi doldu" onlar
    // için tam doğru değil ama beşinci bir metin yazmak brief'in dışına
    // çıkmak olurdu; gövde cümlesi ("yer varsa yeniden kayıt olabilirsin")
    // o hâllerde de yanlış bir şey söylemiyor.
    return {
      durum: 'suresi-doldu',
      baslik: 'Bu yerin süresi doldu.',
      kart: [],
      sonAn: '',
      govde: ['Buluşmada yer varsa yeniden kayıt olabilirsin.'],
      odemeUrl: '',
      etkinlikUrl: g.etkinlikUrl,
      yardimEposta: '',
    };
  }

  // Beklemede ve süre var → yerin duruyor.
  const tarihSatiri = g.tarihISO
    ? formatEtkinlikTarihi(g.tarihISO, g.tarihBitis, g.saat)
    : '';
  const tutar = tutarMetni(g.tutar, g.paraBirimi);
  return {
    durum: 'yerin-duruyor',
    baslik: 'Yerin duruyor.',
    // İŞ 8 — durum kartı: `/odeme/tamam` ile aynı yapı (başlık · tarih-saat),
    // artı bu ekrana özgü katılım payı satırı.
    kart: [
      g.baslik.trim(),
      tarihSatiri,
      tutar ? `Katılım payı: ${tutar}` : '',
    ].filter((s) => s.length > 0),
    // 7 Eki düzeltmesi — cümle EKSİZ kuruldu (dosya başı). Değer AYRI taşınıyor
    // ki yüzey onu tek parça basabilsin.
    sonAn: g.yerTutmaBitisi ? sonAnMetni(g.yerTutmaBitisi) : '',
    govde: [],
    // ⚠ Mevcut N-Kolay başlatma yolu — yeni bir ödeme yolu YAZILMADI.
    // `/odeme/nkolay` `?ref=` ile bağımsız girilebiliyor ve kaydı Notion'dan
    // kendisi okuyor; her giriş yeni bir `clientRefCode` üretiyor.
    odemeUrl: `/odeme/nkolay?ref=${encodeURIComponent(g.kayitId)}`,
    etkinlikUrl: '',
    yardimEposta: '',
  };
}
