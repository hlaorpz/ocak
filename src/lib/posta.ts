/**
 * posta.ts — B211 posta katmanı. Kayıt ve ödeme mailleri artık MailerLite
 * otomasyonundan değil buradan çıkıyor.
 *
 * ── Neden taşındı ──
 * MailerLite otomasyonu `field_updated → etkinlik_adi` ile tetikleniyordu ve
 * tetiğin koşması **değerin değişmesine** bağlıydı (ölçüm 7 Eki 2026). Yani
 * mailin gidip gitmesi bir alan yazımının yan etkisiydi; hangi mailin gittiğini
 * de otomasyonun dal seçimi belirliyordu. İki sonuç: kod "mail gitti mi" diye
 * soramıyordu, ve abone tek olduğu için ikinci bir kayıt birinci kaydın
 * alanlarını eziyordu (`c3f5ec6`'nın kapattığı kusur). Resend'de gönderim bir
 * çağrıdır, yan etki değil.
 *
 * ── METİN KODDA YAŞAMAZ ──
 * Bu modül şablon **takma adını** ve **değişkenleri** bilir; konu, gövde ve
 * görünüm Resend şablonundadır. Payload'a `subject` KONULMAZ (Kaan kararı 5) —
 * konuyu koda yazmak, metni iki yerde yaşatmanın ilk adımı olurdu.
 *
 * Resend sözleşmesi (SDK 6.14.0 + resmî doküman, 7 Eki):
 *   `template.id` **hem UUID hem takma ad** kabul ediyor
 *   ("the id *or* the alias of the published template")
 *   `template` varsa `html`/`text`/`react` gönderilemez (API doğrulama hatası)
 *   `from`/`subject` o dalda opsiyonel; şablon kendi varsayılanını taşır
 *   Şablon **yayınlanmış** olmalı (`status: 'published'`)
 *
 * ── ASLA THROW ETMEZ ──
 * Çağıranların hiçbiri mail yüzünden düşmemeli: kayıt akışı kaydı yazdı, ödeme
 * callback'i parayı aldı, tarama sıradaki satıra geçmeli. Her başarısızlık
 * `{ ok: false, hata }` olarak döner ve log'lanır.
 *
 * ⚠ Log'a e-posta adresi, ad, telefon ve anahtar GİRMEZ — `Kayıt ID` yeter
 * (CLAUDE.md §8, brief §0).
 */
import { Resend } from 'resend';

/** Gönderen ve yanıt adresi (Kaan kararı 4). `api/davet.ts` kendi adresini korur. */
export const POSTA_FROM = 'OCAK <selam@mail.ocak.biz>';
export const POSTA_REPLY_TO = 'selam@ocak.biz';

/**
 * Şablon takma adları. Resend'de bu adlarla **yayınlanmış** olmaları şart;
 * yayınlanmamış şablona gönderim API hatası döner ve `{ ok: false }` olur.
 */
export const SABLON = {
  yeriniTutuyoruz: 'yerini-tutuyoruz',
  yerinHazirOnline: 'yerin-hazir-online',
  yerinHazirYuzyuze: 'yerin-hazir-yuzyuze',
} as const;

export type SablonAdi = (typeof SABLON)[keyof typeof SABLON];

/**
 * Şablon başına değişken kümesi — **tek tablo, tek otorite** (brief §2).
 * Her gönderim yalnız kendi şablonunun kümesini taşır; fazlası da eksiği de
 * `postaGonder` tarafından reddedilir.
 *
 * Neden katı: Resend şablonunda tanımsız bir değişken sessizce boş basılır.
 * "Fazla gönder, şablon kullanmazsa kullanmaz" demek, bir şablonun yanlış
 * değişkenle doldurulduğunu ancak canlı mailde görmek demekti.
 */
export const SABLON_DEGISKENLERI: Record<SablonAdi, readonly string[]> = {
  [SABLON.yeriniTutuyoruz]: [
    'AD', 'ETKINLIK_BASLIGI', 'ETKINLIK_TARIHI', 'TUTAR', 'REFERANS_NO',
    'ODEME_LINKI', 'ODEME_SON_AN',
  ],
  [SABLON.yerinHazirOnline]: [
    'AD', 'ETKINLIK_BASLIGI', 'ETKINLIK_TARIHI', 'KATILIM_LINKI', 'ZOOM_SIFRESI',
    'ETKINLIK_URL',
  ],
  [SABLON.yerinHazirYuzyuze]: [
    'AD', 'ETKINLIK_BASLIGI', 'ETKINLIK_TARIHI', 'MEKAN', 'ADRES', 'ETKINLIK_URL',
    // Şablon kurulumundan gelen ek (Claude.ai, 7 Eki) — yalnız yüz yüze
    // şablonunda var; online'da yol tarifi anlamsız.
    'YOL_TARIFI_LINKI',
  ],
};

export type PostaSonuc = { ok: boolean; hata?: string };

/**
 * Taşıma katmanı — enjekte edilebilir olması testin tek şartı. Üretimde
 * `resendTasima()` kullanılır; testler sahte geçer.
 */
export type PostaTasima = (istek: {
  from: string;
  to: string;
  replyTo: string;
  template: { id: string; variables: Record<string, string> };
}) => Promise<PostaSonuc>;

/**
 * Üretim taşıması. Anahtar `RESEND_API_KEY` — `api/davet.ts:83`'ün kullandığı
 * env'in aynısı, yeni bir ad uydurulmadı.
 *
 * Anahtar boşken ağa çıkılmaz. Yerel geliştirmede ve testte anahtar yok; o
 * hâlde `no-api-key` dönmek, sahte bir başarı döndürmekten iyidir — `Mail
 * Gitti` yazılmaz ve sonraki tarama yeniden dener.
 */
export function resendTasima(): PostaTasima {
  const anahtar = (import.meta.env.RESEND_API_KEY ?? '').trim();
  return async (istek) => {
    if (!anahtar) return { ok: false, hata: 'no-api-key' };
    try {
      const resend = new Resend(anahtar);
      // ⚠ `subject` YOK ve `html`/`text` YOK: ikisi de bilinçli. Konu şablonda
      // yaşıyor; `template` ile birlikte gövde alanı göndermek API doğrulama
      // hatası verir.
      const sonuc = await resend.emails.send({
        from: istek.from,
        to: istek.to,
        replyTo: istek.replyTo,
        template: istek.template,
      });
      if (sonuc.error) {
        return { ok: false, hata: `${sonuc.error.name}: ${String(sonuc.error.message).slice(0, 200)}` };
      }
      return { ok: true };
    } catch (err) {
      return { ok: false, hata: String(err).slice(0, 200) };
    }
  };
}

/**
 * Tek gönderim ucu. Şablon adını, alıcıyı ve değişkenleri alır.
 *
 * Değişken kümesi `SABLON_DEGISKENLERI` ile **tam** eşleşmeli. Eksik ya da
 * fazla anahtar gönderim yapılmadan `{ ok: false }` döner — mail yanlış
 * dolu gitmesin diye kapı ağ çağrısından ÖNCE kapanıyor.
 *
 * `kayitId` yalnız log içindir; Resend'e gitmez.
 */
export async function postaGonder(
  args: {
    sablon: SablonAdi;
    alici: string;
    degiskenler: Record<string, string>;
    kayitId: string;
  },
  tasima: PostaTasima,
): Promise<PostaSonuc> {
  const { sablon, alici, degiskenler, kayitId } = args;

  const basarisiz = (hata: string): PostaSonuc => {
    console.error(`[posta] gönderilemedi — kayitId=${kayitId} sablon=${sablon} sebep=${hata}`);
    return { ok: false, hata };
  };

  if (!alici.trim()) return basarisiz('alıcı adresi boş');

  const beklenen = SABLON_DEGISKENLERI[sablon];
  if (!beklenen) return basarisiz('şablon tanımsız');
  const gelen = Object.keys(degiskenler);
  const eksik = beklenen.filter((k) => !gelen.includes(k));
  const fazla = gelen.filter((k) => !beklenen.includes(k));
  if (eksik.length || fazla.length) {
    return basarisiz(`değişken kümesi tutmadı eksik=[${eksik.join(',')}] fazla=[${fazla.join(',')}]`);
  }

  let sonuc: PostaSonuc;
  try {
    sonuc = await tasima({
      from: POSTA_FROM,
      to: alici,
      replyTo: POSTA_REPLY_TO,
      template: { id: sablon, variables: degiskenler },
    });
  } catch (err) {
    // Taşıma throw etmemeli; "etmemeli" bir gözlem, sözleşme değil.
    return basarisiz(`taşıma düştü: ${String(err).slice(0, 200)}`);
  }
  if (!sonuc.ok) return basarisiz(sonuc.hata ?? '(gerekçe yok)');

  console.log(`[posta] OK — kayitId=${kayitId} sablon=${sablon}`);
  return { ok: true };
}

/**
 * `TUTAR` — kaydın `Beklenen Tutar`'ı + etkinliğin `Para Birimi`'si,
 * **tam sayı + birim**: `"225 TL"` · `"30 USD"` · `"30 EUR"`.
 *
 * ⚠ Birim ŞABLONDA YAZMIYOR (şablon kurulumu, Claude.ai 7 Eki): şablonda
 * yalnız `{{{TUTAR}}}` var. Brief'in ilk hâli "para birimi şablonda" diyordu;
 * şablonlar kurulunca tersine döndü, çünkü etkinliğin para birimi değişken ve
 * şablona sabit "TL" yazmak USD'li bir etkinlikte yanlış tutar söylerdi.
 *
 * `TRY` ve **boş** → `TL`. Boşun TL'ye düşmesi `api/kayit.ts:185`'in
 * varsayılanıyla aynı (`?? 'TRY'`); iki yerde iki farklı varsayılan olması
 * aynı kaydın iki yüzeyinde iki farklı birim demekti.
 *
 * Kuruş yuvarlanır: "1234.56 TL" bir fatura dili; OCAK'ın mailinde katılım
 * payı yuvarlak konuşulur. `Math.round` — aşağı kesmek kadına eksik tutar
 * söylerdi.
 */
export function tutarMetni(tutar: number, paraBirimi?: string | null): string {
  if (!Number.isFinite(tutar) || tutar <= 0) return '';
  const ham = (paraBirimi ?? '').trim().toUpperCase();
  const birim = !ham || ham === 'TRY' ? 'TL' : ham;
  return `${Math.round(tutar)} ${birim}`;
}

/**
 * `YOL_TARIFI_LINKI` — yüz yüze şablonunun yeni değişkeni (şablon kurulumu,
 * Claude.ai 7 Eki). Adresi Google Maps aramasına çevirir.
 *
 * `Konum Detay` boşsa etkinliğin kendi sayfasına düşer: boş bir Maps aramasına
 * götürmek, kadını "sonuç bulunamadı" ekranında bırakmak olurdu. Etkinlik URL'i
 * de boşsa boş dize döner — `postaGonder`'in değişken kümesi kontrolü anahtarı
 * yine görür (boş değer meşru), ama şablon kırık bir bağlantı basmaz.
 */
export function yolTarifiLinki(konumDetay: string, etkinlikUrl: string): string {
  const adres = (konumDetay ?? '').trim();
  if (!adres) return (etkinlikUrl ?? '').trim();
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(adres)}`;
}

/**
 * `yerin-hazir-*` şablonunun mekâna göre seçimi. Dal artık KODDA — eskiden
 * otomasyon `zoom_link` boş mu diye bakıp seçiyordu.
 */
export function yerinHazirSablonu(mekan: string): SablonAdi {
  const online = mekan === 'Online' || mekan === 'Zoom';
  return online ? SABLON.yerinHazirOnline : SABLON.yerinHazirYuzyuze;
}
