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
  /** Gövde satırları — sırayla basılır. Boş satır yazılmaz. */
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
  const govde = [
    g.baslik.trim(),
    tarihSatiri,
    tutar ? `Katılım payı: ${tutar}` : '',
    // 7 Eki düzeltmesi — cümle EKSİZ kuruldu (dosya başı).
    g.yerTutmaBitisi ? `Yerini şu ana kadar tutuyoruz: ${sonAnMetni(g.yerTutmaBitisi)}` : '',
  ].filter((s) => s.length > 0);

  return {
    durum: 'yerin-duruyor',
    baslik: 'Yerin duruyor.',
    govde,
    // ⚠ Mevcut N-Kolay başlatma yolu — yeni bir ödeme yolu YAZILMADI.
    // `/odeme/nkolay` `?ref=` ile bağımsız girilebiliyor ve kaydı Notion'dan
    // kendisi okuyor; her giriş yeni bir `clientRefCode` üretiyor.
    odemeUrl: `/odeme/nkolay?ref=${encodeURIComponent(g.kayitId)}`,
    etkinlikUrl: '',
    yardimEposta: '',
  };
}
