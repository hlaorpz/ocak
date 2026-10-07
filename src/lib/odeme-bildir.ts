/**
 * odeme-bildir.ts — B211: ödeme onaylandığında "yerin hazır" maili.
 *
 * ── Hangi boşluğu kapatıyor ──
 * `odeme_durumu` iki aydır tek yerde yazılıyordu: `kayit.ts:509`, kayıt anında,
 * `bekliyor` ya da `muaf`. Üçüncü değeri — `alindi` — **hiçbir kod
 * yazmıyordu**, dolayısıyla ödemesi alınan kadına Zoom linki elle gidiyordu.
 * Kart hattı açıldı, bildirim halkası yoktu (`00-durum.md`, 6 Eki ölçümü).
 *
 * ── MailerLite'tan Resend'e (7 Eki, bu brief) ──
 * İlk hâli MailerLite abonesine on iki alan yazıyordu ve maili otomasyonun
 * `field_updated → etkinlik_adi` tetiği gönderiyordu. İki kusur vardı:
 *
 *   (a) **Mail bir yan etkiydi.** Alan yazımı başarılı olabilir, otomasyon
 *       koşmayabilirdi; kod "mail gitti mi" diye soramıyordu. `Mail Gitti`
 *       işareti bu yüzden yalnız "yazım başarılı" demek zorundaydı.
 *   (b) **Abone tek, alanlar paylaşımlı.** Kadın ödemeden önce başka bir
 *       etkinliğe kayıt olursa alanlar o ikinci kaydı gösteriyordu; `c3f5ec6`
 *       bunu on iki alanı birlikte yazarak kapattı ama kök sorun — etkinlik
 *       verisinin aboneye, kayda değil, bağlı olması — duruyordu.
 *
 * Artık mail doğrudan gönderiliyor (`lib/posta.ts` → Resend şablonu) ve
 * değişkenler **o kaydın** verisinden geliyor; abonede hiçbir şey yaşamıyor.
 * `MAILERLITE_ALANLAR`, `mailerLiteCustomFields` ve ` · ödeme alındı` eki
 * bu modülden çıktı — tetiği uyandırmak gereken bir şey kalmadı.
 *
 * Fonksiyonlar `lib/kayit.ts`'te DURUYOR (kırpılmadı — CLAUDE.md §5);
 * yalnız çağrılmıyorlar.
 *
 * ── Hata felsefesi: callback DÜŞMEZ ──
 * Buraya gelindiğinde para çekilmiş ve Notion'a `Ödendi` yazılmış olur.
 * Resend'in bir 500'ü o gerçeği geri alamaz. Hiçbir yol throw etmez; her
 * başarısızlık `durum` + log olarak çağırana taşınır.
 *
 * ⚠ Log'a e-posta adresi, ad ve anahtar GİRMEZ — `Kayıt ID` yeter (CLAUDE.md §8).
 */
import { isKayitFormat, etkinlikUrlFormatla } from './kayit.ts';
import { FORMAT_KATEGORI } from './etkinlik-kategori.ts';
import { formatEtkinlikTarihi } from './format-etkinlik.ts';
import {
  postaGonder,
  yerinHazirSablonu,
  yolTarifiLinki,
  SABLON,
  type PostaTasima,
} from './posta.ts';

export type OdemeBildirGirdi = {
  /** `OCAK-XXXX` — log'daki TEK kimlik. */
  kayitId: string;
  /** Notion Kayıtlar satırının UUID'si — `Mail Gitti` yazımı buraya gider. */
  pageId: string;
  /** Kayıtlar `Email`. Resend'e gider, log'a GİRMEZ. */
  email: string;
  /** Kayıtlar `Kadın` alanından ilk ad — mailin `AD` değişkeni. */
  ad: string;
  /** `Etkinlikler` relation öğe sayısı. 1 değilse yazım atlanır. */
  etkinlikSayisi: number;
  /** Etkinlikler `Format` select ham değeri ("Açık Kapı"). */
  formatHam: string;
  /** Etkinlikler `Başlık` — `ETKINLIK_BASLIGI`. */
  basligHam: string;
  /** Etkinlikler `Slug` — `ETKINLIK_URL`. */
  slugHam: string;
  /** Etkinlikler `Tarih` date.start / date.end. */
  tarihISOHam: string;
  tarihBitisHam: string;
  /** Etkinlik saati, MEKÂNA BAĞLI eşlemeyle çözülmüş (cross-fallback yok). */
  saatHam: string;
  /** Etkinlikler `Mekân/Platform` · `Katılım Linki` · `Zoom Şifresi` · `Konum Detay`. */
  mekanHam: string;
  katilimLinkiHam: string;
  zoomSifresiHam: string;
  konumDetayHam: string;
};

export type OdemeBildirSonuc = {
  /**
   * 'yazildi'  — Resend maili kabul etti (teslim garantisi değil)
   * 'atlandi'  — ön koşul tutmadı; Resend hiç çağrılmadı
   * 'hata'     — Resend çağrıldı ve başarısız oldu
   */
  durum: 'yazildi' | 'atlandi' | 'hata';
  /** Notion `Mail Gitti` checkbox'ı işaretlendi mi. */
  mailGitti: boolean;
  /** 'yazildi' dışındaki hâllerde gerekçe — log'a basılan metinle aynı. */
  sebep?: string;
};

/**
 * Mail değişkenlerini kurar. Dönen kümenin anahtarları, seçilen şablonun
 * `SABLON_DEGISKENLERI` kümesiyle **tam** eşleşir; eşleşmezse `postaGonder`
 * gönderimi ağ çağrısından önce durdurur.
 *
 * ⚠ `ETKINLIK_TARIHI` `saatHam`dan beslenir, `kayitOku`'nun `etkinlikTarihi`
 * alanından DEĞİL. O alan `rich('Saat') || rich('Zoom Başlangıç Saati')` düz
 * OR'uyla kurulmuş saati taşıyor — `api/kayit.ts:191-198`'in canlı veriyle
 * çürüttüğü cross-fallback. Kusurlu eşlemeyi maile taşımak, düzeltilmiş bir
 * hatayı geri getirmek olurdu. (O satır `DavetKutusu`'nu besliyor ve bu turda
 * değişmedi — borç olarak raporlandı.)
 */
export function bildirimDegiskenleri(
  g: Omit<OdemeBildirGirdi, 'pageId' | 'email' | 'etkinlikSayisi'>,
): { sablon: ReturnType<typeof yerinHazirSablonu>; degiskenler: Record<string, string> } {
  const sablon = yerinHazirSablonu(g.mekanHam);
  const etkinlikUrl = etkinlikUrlFormatla(g.slugHam);
  const ortak = {
    AD: g.ad.trim(),
    ETKINLIK_BASLIGI: g.basligHam.trim(),
    ETKINLIK_TARIHI: g.tarihISOHam
      ? formatEtkinlikTarihi(g.tarihISOHam, g.tarihBitisHam, g.saatHam)
      : '',
    ETKINLIK_URL: etkinlikUrl,
  };
  if (sablon === SABLON.yerinHazirOnline) {
    return {
      sablon,
      degiskenler: {
        ...ortak,
        KATILIM_LINKI: g.katilimLinkiHam.trim(),
        ZOOM_SIFRESI: g.zoomSifresiHam.trim(),
      },
    };
  }
  return {
    sablon,
    degiskenler: {
      ...ortak,
      MEKAN: g.mekanHam.trim(),
      ADRES: g.konumDetayHam.trim(),
      YOL_TARIFI_LINKI: yolTarifiLinki(g.konumDetayHam, etkinlikUrl),
    },
  };
}

export type OdemeBildirBagimliliklari = {
  /** Resend taşıması — üretimde `resendTasima()`. */
  tasima: PostaTasima;
  /** Notion Kayıtlar `Mail Gitti` checkbox'ını işaretler. */
  mailGittiIsaretle(pageId: string): Promise<void>;
};

/**
 * Sıra: ön koşullar → mail → `Mail Gitti`.
 *
 * `Mail Gitti` mailden SONRA yazılır ve anlamı dar: *"Resend maili kabul
 * etti."* Teslim garantisi değil. Mail başarısızsa işaret YAZILMAZ ve tarama
 * ucunun (a) dalı sonraki turda yeniden dener — brief §4'ün "mail başarısızsa
 * işaret yazılmaz" kuralı bu modülde de aynı.
 *
 * Checkbox yazımı patlarsa `durum` 'yazildi' kalır: mail gerçekten gitti,
 * eksik olan yalnız iz. Tersini yapmak sonraki taramada ikinci bir mail
 * göndermeye yol açardı.
 */
export async function odemeBildir(
  g: OdemeBildirGirdi,
  deps: OdemeBildirBagimliliklari,
): Promise<OdemeBildirSonuc> {
  const atla = (sebep: string): OdemeBildirSonuc => {
    console.warn(`[odeme-bildir] atlandı — kayitId=${g.kayitId} sebep=${sebep}`);
    return { durum: 'atlandi', mailGitti: false, sebep };
  };

  // ⚠ Relation tam bir etkinlik taşımıyorsa YAZILMAZ. Hangi etkinliğin
  // linkinin gideceğini kod tahmin etmez — `OCAK-3HX6` vakası iki Açık Kapı
  // taşıyor ve ikisinin Zoom linki ayrı.
  if (g.etkinlikSayisi !== 1) {
    return atla(`relation tam bir etkinlik taşımıyor (öğe=${g.etkinlikSayisi})`);
  }
  // Adres yoksa gönderilecek yer yok.
  if (!g.email.trim()) return atla('Kayıtlar Email boş');

  // ⚠ FORMAT KAPISI — artık hiçbir değişkeni beslemiyor.
  //
  // İlk hâlinde gerekliydi: `etkinlik_adi` `etkinlikAdiFormatla(format, …)` ile
  // yeniden üretiliyordu ve `Anadolu Yolculuğu` bir `KayitFormat` değil, yani
  // ad uydurulmadan kurulamıyordu. Resend'e geçişle o alan kalktı; mailin altı
  // değişkeninin hiçbiri formatı istemiyor (`Başlık`, `Tarih`, `Slug`, mekân
  // alanları — hepsi doğrudan okunuyor).
  //
  // Kapı brief'in açık talimatıyla KORUNUYOR ("mevcut üç kapı aynen kalır").
  // Ama artık bir şeyi korumuyor, bir şeyi engelliyor: Etkinlikler satırının
  // `Format`ı `Anadolu Yolculuğu` ise ödemesi alınmış kadına "yerin hazır"
  // maili GİTMEZ ve tarama (a) dalı da aynı kapıya takılıp sonsuza kadar
  // yeniden dener. Kaldırılması Kaan'ın kararı — raporlandı.
  const slug = FORMAT_KATEGORI[g.formatHam];
  if (!slug || !isKayitFormat(slug)) {
    return atla(`format kayıt formatı değil formatHam="${g.formatHam}" slug="${slug ?? '(yok)'}"`);
  }

  const { sablon, degiskenler } = bildirimDegiskenleri(g);

  let sonuc: { ok: boolean; hata?: string };
  try {
    sonuc = await postaGonder(
      { sablon, alici: g.email, degiskenler, kayitId: g.kayitId },
      deps.tasima,
    );
  } catch (err) {
    // `postaGonder` throw etmiyor; "etmiyor" bir gözlem, sözleşme değil.
    const sebep = `posta çağrısı düştü: ${String(err).slice(0, 200)}`;
    console.error(`[odeme-bildir] HATA — kayitId=${g.kayitId} sebep=${sebep}`);
    return { durum: 'hata', mailGitti: false, sebep };
  }
  if (!sonuc.ok) {
    const sebep = `mail gönderilemedi: ${sonuc.hata ?? '(gerekçe yok)'}`;
    console.error(`[odeme-bildir] HATA — kayitId=${g.kayitId} sebep=${sebep}`);
    return { durum: 'hata', mailGitti: false, sebep };
  }

  try {
    await deps.mailGittiIsaretle(g.pageId);
  } catch (err) {
    const sebep = `Mail Gitti yazılamadı: ${String(err).slice(0, 200)}`;
    console.error(`[odeme-bildir] kısmi — kayitId=${g.kayitId} sebep=${sebep}`);
    return { durum: 'yazildi', mailGitti: false, sebep };
  }

  console.log(`[odeme-bildir] OK — kayitId=${g.kayitId} sablon=${sablon} MailGitti=✓`);
  return { durum: 'yazildi', mailGitti: true };
}
