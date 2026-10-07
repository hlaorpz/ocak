/**
 * odeme-bildir.ts — B211 kart ayağı: kart ödemesi onaylandığında MailerLite'a
 * yazan halka.
 *
 * ── Hangi boşluğu kapatıyor ──
 * `odeme_durumu` iki aydır tek yerde yazılıyordu: `kayit.ts:509`, kayıt anında,
 * `bekliyor` ya da `muaf`. Üçüncü değeri — `alindi` — **hiçbir kod
 * yazmıyordu**, dolayısıyla ödemesi alınan kadına Zoom linki elle gidiyordu.
 * Kart hattı açıldı, bildirim halkası yoktu (`00-durum.md`, 6 Eki ölçümü).
 *
 * ── Tetik neden `etkinlik_adi`'ya ek ──
 * MailerLite otomasyonu (`OCAK — kayıt onayı (tüm formatlar)`) `field_updated
 * → etkinlik_adi` ile tetikleniyor ve **değerin DEĞİŞMESİ şart.** 7 Eki 2026
 * ölçümü (test abonesi, üç yazım, her birinden sonra otomasyon günlüğü):
 *   • `etkinlik_adi` aynı değerle yeniden yazıldı          → koşmadı
 *   • aynı değer + `odeme_durumu=alindi` + üç Zoom alanı   → koşmadı
 *   • değere ` · ödeme alındı` eklendi                     → 5 sn'de koştu
 * Yani `odeme_durumu`'nu tek başına yazmak hiçbir şey yapmaz. Ek, otomasyonu
 * uyandıran şeydir; mailin içinde görünmez (ölçüldü, Kaan ekran görüntüsü).
 *
 * ── Bu dosyanın yazmadığı şeyler ──
 * Hangi mailin gideceğini (yüz yüze mi online mı) **otomasyon** seçiyor,
 * `zoom_link`'in boş olup olmamasına bakarak. Kod dal seçmez: üç Zoom alanını
 * `muaf` yolunun eşlemesiyle yazar, gerisi otomasyonun işi.
 *
 * ── Hata felsefesi: callback DÜŞMEZ ──
 * Buraya gelindiğinde para çekilmiş ve Notion'a `Ödendi` yazılmış olur.
 * MailerLite'ın bir 500'ü o gerçeği geri alamaz. Bu yüzden hiçbir yol throw
 * etmez; her başarısızlık `durum` + log olarak çağırana taşınır ve callback
 * yanıt kodunu değiştirmez.
 *
 * ⚠ Log'a e-posta adresi ve API anahtarı GİRMEZ — `Kayıt ID` yeter
 * (CLAUDE.md §8). `email` alanı yalnız MailerLite gövdesine gider.
 */
import {
  mailerLiteCustomFields,
  etkinlikAdiFormatla,
  etkinlikUrlFormatla,
  tarihTrFormat,
  katilimTipiCoz,
  isKayitFormat,
  MAILERLITE_ALANLAR,
} from './kayit.ts';
import { FORMAT_KATEGORI } from './etkinlik-kategori.ts';

/**
 * Otomasyonu uyandıran ek. **Tek yerde sabit** — ikinci bir yere kopyalanırsa
 * biri güncellenip öteki unutulur ve tetik sessizce ölür.
 */
export const ODEME_ALINDI_EKI = ' · ödeme alındı';

/**
 * MailerLite'a giden alanların TAM kümesi = `MAILERLITE_ALANLAR`, on iki alan.
 *
 * ── Neden beş değil on iki (7 Eki 2026, Claude.ai düzeltmesi) ──
 * İlk hâli beş alanla sınırlıydı: `odeme_durumu` + üç Zoom alanı +
 * `etkinlik_adi`. Gerekçe "kalan yedi alan kayıt anında doğru yazıldı, yeniden
 * üretmek bayat veri riski" idi ve **tersi doğruydu.**
 *
 * MailerLite'ta kişi başına TEK abone var ve etkinlik alanları o abonenin
 * üstünde yaşıyor. Aynı kadın ödemeden önce başka bir etkinliğe kayıt olursa
 * `/api/kayit` o alanları İKİNCİ etkinliğe göre ezer. Beş alanlık yazım o
 * hâlde şunu üretirdi: ikinci etkinliğin başlığı, tarihi, saati ve adresi
 * altında **birincinin Zoom linki.** Yani "dokunmamak" bayat veriyi korumak,
 * yazmak ise onu düzeltmekti.
 *
 * Kural artık şu: ödenen kaydın KENDİ etkinliğinden yeniden üretilebilen her
 * alan yazılır. On ikisi de üretilebiliyor (ölçüm raporda) — yani küme tam
 * olarak kayıt anının kümesi. Üretilemeyen bir alan ÇIKARSA uydurulmaz;
 * `mailerLiteCustomFields`'in dönüşü otorite olduğu için böyle bir alan
 * payload'a kendiliğinden girmez.
 *
 * `name` · `last_name` · `groups` GÖNDERİLMEZ: ilk ikisi custom field değil
 * (`mailerLiteFieldsPayload` ekliyor, biz o helper'dan geçmiyoruz), üçüncüsü
 * abone zaten grubunda olduğu için gereksiz.
 */
export const ODEME_BILDIR_ALANLARI = MAILERLITE_ALANLAR;

/**
 * Ek'i idempotent ekler. Değer zaten ekle bitiyorsa **aynen döner** — iki kez
 * eklemek `"Açık Kapı — 12 Ekim 2026 · ödeme alındı · ödeme alındı"` üretirdi
 * ve o metin MailerLite şablonunda görünür bir yerde kullanılabilir.
 *
 * Replay muhafızı ikinci bir callback'i zaten 401'liyor, yani pratikte buraya
 * ikinci kez gelinmez. Kontrol yine de burada: muhafız bu fonksiyonun
 * sözleşmesi değil, ondan bağımsız bir kapı — ona yaslanmak iki kuralı
 * birbirine bağlamak olurdu.
 */
export function odemeAlindiEkle(deger: string): string {
  const d = deger.trim();
  if (!d) return d;
  return d.endsWith(ODEME_ALINDI_EKI.trim()) ? d : `${d}${ODEME_ALINDI_EKI}`;
}

export type OdemeBildirGirdi = {
  /** `OCAK-XXXX` — log'daki TEK kimlik. */
  kayitId: string;
  /** Notion Kayıtlar satırının UUID'si — `Mail Gitti` yazımı buraya gider. */
  pageId: string;
  /** Kayıtlar `Email`. MailerLite gövdesine gider, log'a GİRMEZ. */
  email: string;
  /** `Etkinlikler` relation öğe sayısı. 1 değilse yazım atlanır. */
  etkinlikSayisi: number;
  /** Etkinlikler `Format` select ham değeri ("Açık Kapı"). */
  formatHam: string;
  /** Kayıtlar `Seçilen Tarih` — kayıt anındaki girdinin aynısı. */
  seciliTarih: string;
  /** Etkinlikler `Mekân/Platform` · `Katılım Linki` · `Zoom Şifresi` — ham. */
  mekanHam: string;
  katilimLinkiHam: string;
  zoomSifresiHam: string;
  /** Etkinlikler `Başlık` — `etkinlik_basligi`. `etkinlik_adi`'dan AYRI alan. */
  basligHam: string;
  /** Etkinlikler `Slug` — `etkinlikUrlFormatla` ile `etkinlik_url`'e döner. */
  slugHam: string;
  /** Etkinlikler `Tarih` date.start — `Seçilen Tarih` boşsa yedek kaynak. */
  tarihISOHam: string;
  /** Etkinlik saati, MEKÂNA BAĞLI eşlemeyle çözülmüş (cross-fallback yok). */
  saatHam: string;
  /** Etkinlikler `Konum Detay` — `etkinlik_adres`. */
  konumDetayHam: string;
};

export type OdemeBildirSonuc = {
  /**
   * 'yazildi'  — MailerLite beş alanı aldı (mail GİTTİĞİ anlamına gelmez)
   * 'atlandi'  — ön koşul tutmadı; MailerLite hiç çağrılmadı
   * 'hata'     — MailerLite çağrıldı ve başarısız oldu
   */
  durum: 'yazildi' | 'atlandi' | 'hata';
  /** Notion `Mail Gitti` checkbox'ı işaretlendi mi. */
  mailGitti: boolean;
  /** 'yazildi' dışındaki hâllerde gerekçe — log'a basılan metinle aynı. */
  sebep?: string;
};

/**
 * Alanları kurar. Dönen `alanlar`ın anahtar kümesi **tam olarak**
 * `ODEME_BILDIR_ALANLARI` (= `MAILERLITE_ALANLAR`, on iki alan).
 *
 * Bütün eşleme `mailerLiteCustomFields`'ten geliyor, `odemeGerekli: false`
 * ile — yani `muaf` kaydın yürüdüğü dalın ta kendisi. Yeni eşleme YAZILMADI:
 * online/fiziksel ayrımı, `zoom_link` ile `katilim_linki`'nin aynı değeri
 * taşıması (C-1 geriye uyum), `etkinlik_mekan`'ın kapıya tabi OLMAMASI ve
 * boşaltma kuralı orada tek yerde yaşıyor. İkinci bir kopya, iki eşlemenin
 * zamanla ayrışması demekti. Çıktı o fonksiyonun dönüşü, iki ezmeyle:
 *
 *   `odeme_durumu` → 'alindi'. O fonksiyon iki değer üretiyor
 *   (`bekliyor`/`muaf`), üçüncüsünü bilmiyor; imzasını değiştirmek yerine
 *   burada yazılıyor — kayıt anının otoritesi ödeme anının otoritesi değil.
 *
 *   `etkinlik_adi` → ekli hâli. Tetiği uyandıran şey bu (dosya başı).
 *
 * ⚠ Dönüşü `{ ...ham }` ile kopyalamak ŞART: `ham`ı doğrudan döndürüp üstüne
 * yazmak aynı nesneyi paylaşan bir çağırana sızabilirdi.
 */
export function odemeBildirAlanlari(
  g: Omit<OdemeBildirGirdi, 'pageId' | 'email' | 'etkinlikSayisi'>,
): { alanlar: Record<string, string> } | { hata: string } {
  // Format, Etkinlikler sayfasının `Format` select'inden türetilir — Kayıtlar
  // satırında format alanı yok. `FORMAT_KATEGORI` `FORMAT_NOTION_FORMAT`'ın
  // tersi, yani eşleme tasarım gereği birebir.
  //
  // İSTİSNA: `Anadolu Yolculuğu` → `anadolu`, ve `anadolu` bir `KayitFormat`
  // DEĞİL (`FORMAT_TIP` yedi anahtar taşıyor, `anadolu` yok). O etkinlikte
  // `etkinlik_adi` kayıt anındaki kurucuyla yeniden üretilemez. Tahmin
  // etmemek doğru refleks: yazım atlanır (Kaan onayı, 7 Eki).
  const slug = FORMAT_KATEGORI[g.formatHam];
  if (!slug || !isKayitFormat(slug)) {
    return { hata: `format cozulemedi formatHam="${g.formatHam}" slug="${slug ?? '(yok)'}"` };
  }

  // ⚠ Özgün `etkinlik_adi` MailerLite'tan OKUNMAZ, yeniden ÜRETİLİR — kayıt
  // anındaki kurucunun aynısıyla (`api/kayit.ts:743` ile aynı çağrı).
  // Okumak, abonede o alanı kimin son yazdığına güvenmek olurdu.
  const etkinlikAdi = etkinlikAdiFormatla(slug, g.seciliTarih);

  const ham = mailerLiteCustomFields({
    etkinlikAdi,
    // `api/kayit.ts:746` ile birebir: form değeri varsa o (zaten Türkçe),
    // yoksa Notion ISO'su Türkçe'ye çevrilir.
    etkinlikTarihi: g.seciliTarih.trim() || tarihTrFormat(g.tarihISOHam),
    etkinlikSaati: g.saatHam,
    katilimTipi: katilimTipiCoz(g.mekanHam),
    katilimLinki: g.katilimLinkiHam,
    zoomSifresi: g.zoomSifresiHam,
    mekan: g.mekanHam,
    mekanAdres: g.konumDetayHam,
    // `muaf` yolu — kapı AÇIK, katılım alanları bu dalda dolar.
    odemeGerekli: false,
    // Ödeme anında `referansKodu` = kayıt anındaki `referansNo`: `Kayıt ID`
    // title'ı onunla sorgulandı, sonek `soyEpochSoneki` ile soyuldu.
    referansNo: g.kayitId,
    etkinlikBasligi: g.basligHam,
    etkinlikUrl: etkinlikUrlFormatla(g.slugHam),
  });

  return {
    alanlar: {
      ...ham,
      odeme_durumu: 'alindi',
      etkinlik_adi: odemeAlindiEkle(ham.etkinlik_adi),
    },
  };
}

export type OdemeBildirBagimliliklari = {
  /**
   * MailerLite abone upsert'i. `groups` GÖNDERİLMEZ: abone kayıt anında
   * grubuna eklendi ve kısmi alanlı POST mevcut üyeliklere dokunmuyor
   * (ölçüldü, 7 Eki 2026 — beş grup üyeliği ve diğer alanlar yerinde kaldı).
   */
  mailerLiteYaz(
    email: string,
    alanlar: Record<string, string>,
  ): Promise<{ ok: boolean; hata?: string }>;
  /** Notion Kayıtlar `Mail Gitti` checkbox'ını işaretler. */
  mailGittiIsaretle(pageId: string): Promise<void>;
};

/**
 * Sıra: ön koşullar → MailerLite → `Mail Gitti`.
 *
 * `Mail Gitti` MailerLite'tan SONRA yazılır ve anlamı dar: *"MailerLite yazımı
 * başarılı."* Teslim garantisi değil — otomasyon mailini 5 sn sonra kuruyor,
 * teslimi MailerLite yapıyor. Bu yüzden `/odeme/tamam` bu alanı OKUMAZ
 * (7 Eki kararı); alan havale/n8n ağının "bu kayda bildirim gitti mi"
 * sorusuna cevap verir.
 *
 * Checkbox yazımı patlarsa `durum` yine 'yazildi' kalır: MailerLite gerçekten
 * aldı, eksik olan yalnız iz. Tersini yapmak — başarıyı hataya çevirmek —
 * sonraki turda "mail gitmedi" sanılıp ikinci kez yazılmasına yol açardı.
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
  // Adres yoksa upsert'in kimliği yok; MailerLite 422 döndürürdü.
  if (!g.email.trim()) return atla('Kayıtlar Email boş');

  const kurulum = odemeBildirAlanlari(g);
  if ('hata' in kurulum) return atla(kurulum.hata);

  let yazim: { ok: boolean; hata?: string };
  try {
    yazim = await deps.mailerLiteYaz(g.email, kurulum.alanlar);
  } catch (err) {
    // Transport throw ederse de callback düşmez.
    const sebep = `mailerLite çağrısı düştü: ${String(err).slice(0, 200)}`;
    console.error(`[odeme-bildir] HATA — kayitId=${g.kayitId} sebep=${sebep}`);
    return { durum: 'hata', mailGitti: false, sebep };
  }
  if (!yazim.ok) {
    const sebep = `mailerLite yazımı başarısız: ${yazim.hata ?? '(gerekçe yok)'}`;
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

  console.log(`[odeme-bildir] OK — kayitId=${g.kayitId} alan=${ODEME_BILDIR_ALANLARI.length} MailGitti=✓`);
  return { durum: 'yazildi', mailGitti: true };
}
