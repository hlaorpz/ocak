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
  katilimTipiCoz,
  isKayitFormat,
} from './kayit.ts';
import { FORMAT_KATEGORI } from './etkinlik-kategori.ts';

/**
 * Otomasyonu uyandıran ek. **Tek yerde sabit** — ikinci bir yere kopyalanırsa
 * biri güncellenip öteki unutulur ve tetik sessizce ölür.
 */
export const ODEME_ALINDI_EKI = ' · ödeme alındı';

/**
 * MailerLite'a giden alanların TAM kümesi — beş alan, fazlası değil.
 * `MAILERLITE_ALANLAR` (on iki) kayıt anındaki envanter; ödeme bildirimi
 * onun bir alt kümesini yazar. Kalan yedi alana dokunmamak bilinçli: kayıt
 * anında doğru yazıldılar, yeniden üretmek bayat veri yazma riskidir.
 */
export const ODEME_BILDIR_ALANLARI = [
  'odeme_durumu',
  'zoom_link',
  'zoom_sifresi',
  'katilim_linki',
  'etkinlik_adi',
] as const;

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
 * Beş alanı kurar. Dönen `alanlar`ın anahtar kümesi **tam olarak**
 * `ODEME_BILDIR_ALANLARI`.
 *
 * Üç Zoom alanı `mailerLiteCustomFields`'ten geliyor, `odemeGerekli: false`
 * ile — yani `muaf` kaydın yürüdüğü dalın ta kendisi (`kayit.ts:501-503`).
 * Yeni eşleme YAZILMADI: online/fiziksel ayrımı, `zoom_link` ile
 * `katilim_linki`'nin aynı değeri taşıması (C-1 geriye uyum) ve boşaltma
 * kuralı orada tek yerde yaşıyor. İkinci bir kopya, iki eşlemenin zamanla
 * ayrışması demekti.
 *
 * `odeme_durumu` ezilir: o fonksiyon iki değer üretiyor (`bekliyor`/`muaf`),
 * üçüncüsünü (`alindi`) bilmiyor. İmzasını değiştirmek yerine burada
 * yazılıyor — `mailerLiteCustomFields` kayıt anının otoritesi, ödeme anının
 * değil.
 */
export function odemeBildirAlanlari(
  g: Pick<OdemeBildirGirdi, 'kayitId' | 'formatHam' | 'seciliTarih' | 'mekanHam' | 'katilimLinkiHam' | 'zoomSifresiHam'>,
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
    katilimTipi: katilimTipiCoz(g.mekanHam),
    katilimLinki: g.katilimLinkiHam,
    zoomSifresi: g.zoomSifresiHam,
    // `muaf` yolu — kapı AÇIK, üç Zoom alanı bu dalda dolar.
    odemeGerekli: false,
    // Zorunlu alan; ürettiği `referans_no` payload'a GİRMEZ (beş alan kuralı).
    referansNo: g.kayitId,
  });

  return {
    alanlar: {
      odeme_durumu: 'alindi',
      zoom_link: ham.zoom_link,
      zoom_sifresi: ham.zoom_sifresi,
      katilim_linki: ham.katilim_linki,
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
