// kayit.ts — Ödemeli kayıt formları için yardımcı tipler + map'ler (Brief 2A).
//
// Frontend slug ↔ Notion Başvurular DB "Tip" enum + MailerLite grup ID
// köprüleri burada tek-kaynak. Brief 2B'de form component bu map'leri
// import edip slug→format çözümünde kullanır. Brief 2A'da sadece endpoint
// kullanır (form henüz yok).
//
// Notion enum: Başvurular DB "Tip" + Etkinlikler DB "Format" AYNI değeri taşır
// (slug rename brief S2 kararı — 2026-07-03: kısa/uzun ayrımı silindi). İki
// harita ayrı call-site'lar için tutulur ama değerler eşitlenmiştir.

export type KayitFormat =
  | 'cember'
  | 'acik-kapi'
  | 'mini-retreat'
  | 'sehir-aksami'
  | 'seremoni'
  | 'atolye'
  | 'yolculuk';

// Slug → Notion Başvurular DB "Tip" select option name.
export const FORMAT_TIP: Record<KayitFormat, string> = {
  cember: 'Çember',
  'acik-kapi': 'Açık Kapı',
  'mini-retreat': 'Mini Retreat',
  'sehir-aksami': 'Şehir Akşamı',
  seremoni: 'Seremoni',
  atolye: 'Atölye',
  yolculuk: 'Yolculuk',
};

// Slug → Notion Etkinlikler DB "Format" select option name.
// S2 sonrası FORMAT_TIP ile aynı değeri döndürür; iki harita ayrı call-site'lar
// için tutulur (etkinlikler dropdown filtresi + başvurular Tip yazımı).
export const FORMAT_NOTION_FORMAT: Record<KayitFormat, string> = {
  cember: 'Çember',
  'acik-kapi': 'Açık Kapı',
  'mini-retreat': 'Mini Retreat',
  'sehir-aksami': 'Şehir Akşamı',
  seremoni: 'Seremoni',
  atolye: 'Atölye',
  yolculuk: 'Yolculuk',
};

/**
 * Aşama 2.5 — Kademeli dayanışma fiyatı (sliding scale). Etkinlikler DB tek
 * `Ücret` taşır (orta/tam fiyat); 3 kademe koddan türetilir:
 *  - Üst (Ateşi büyüten) = Ücret × 1.5
 *  - Orta (Ateşin başındaki) = Ücret × 1.0   ← default seçili
 *  - Alt (Ateşe yaklaşan) = Ücret × 0.75
 *
 * Oranlar tek yerde — ileride ayarlanabilir. Yuvarlama en yakın tam TL.
 * Brief: brief-odeme-asama2.5-kademe-akis.md.
 */
export type Kademe = 'ust' | 'orta' | 'alt';

export const KADEME_ORANLARI: Record<Kademe, number> = {
  ust: 1.5,
  orta: 1.0,
  alt: 0.75,
};

export function kademeTutari(ucret: number, kademe: Kademe): number {
  const oran = KADEME_ORANLARI[kademe];
  // Aşama 3b-fix tasarım (KARAR 61/88 kırpma yasağı): kuruş korunur. Float
  // hatalarını engellemek için ×100/100. Önceki Math.round → 225×0.75=169
  // (kuruş kayboluyordu); yeni: 168.75. Gösterim `formatTutarTr` ile.
  return Math.round(Math.max(0, ucret) * oran * 100) / 100;
}

/**
 * Aşama 3b-fix tasarım — tutar gösterimi TR locale + iki ondalık:
 * 168.75 → "168,75". KARAR 61/88: kuruş ekranda görünür, gizli kırpma yok.
 * Tek otorite — frontend canlı tutar bloğu + backend response gösterimi
 * paylaşır.
 */
export function formatTutarTr(tutar: number): string {
  return tutar.toLocaleString('tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Para birimi kodu → ekranda görünen etiket (Faz 1 §4.2).
 *
 * KARAR 354 içerik-sunum sınırı: `paraBirimi` VERİ — Notion'da `TRY` yazar,
 * `/api/kayit` onu aynen taşır, MailerLite ve Notion o kodla konuşur.
 * Kadının ekranda gördüğü ise SUNUM: "1.000 TRY" bir muhasebe satırı gibi
 * okunuyor, "1.000 TL" para gibi. Çeviri yalnız burada yapılır; veriye
 * dokunulmaz, Notion'a "TL" yazılmaz.
 *
 * Tanınmayan kod aynen geçer — bir gün EUR gelirse "EUR" göstermek, sessizce
 * yanlış bir etiket uydurmaktan iyidir.
 */
export function paraBirimiGoster(kod: string | undefined | null): string {
  const ham = (kod ?? '').trim().toUpperCase();
  if (ham === 'TRY') return 'TL';
  return ham;
}

// Kapı 1 — direkt kayıt formatları (değerlendirme yok). /api/kayit bunların
// kaydını YALNIZ Kayıtlar DB'ye yazar (Aşama 1.5, brief-odeme-asama15).
// Kapı 2 — başvuru/onay (cember + ayrı pipeline'daki anadolu): mevcut akış,
// Başvurular'a yazılır, oradan Kaan onayı + automation ile Kayıtlar'a düşer
// (Aşama 1.6 köprüsü, bu pakette DEĞİL).
//
// DEPRECATED (Aşama 3b-fix): otorite artık etkinlik bazlı `Kayıt Tipi`
// (Notion Etkinlikler select). `isDirekt(kayitTipi)` kullan. `isKapi1` ve
// `KAPI1_FORMATLAR` legacy testler / fallback için tutuluyor; yeni kod
// `etk.kayitTipi === 'Direkt'` dallanmasına bakar.
export const KAPI1_FORMATLAR: readonly KayitFormat[] = [
  'acik-kapi',
  'atolye',
  'mini-retreat',
  'sehir-aksami',
  'seremoni',
] as const;

export function isKapi1(format: KayitFormat): boolean {
  return (KAPI1_FORMATLAR as readonly string[]).includes(format);
}

/**
 * Aşama 3b-fix — Kayıt Tipi dallanması. Notion Etkinlikler `Kayıt Tipi`
 * select [Başvuru | Direkt]. `Direkt` → mevcut Kapı 1 akışı (kademe +
 * askı + promo + kart/havale + checkout + Kayıtlar). `Başvuru` → sade
 * form + Başvurular DB (ödeme yok, Zoom + mail tetiklenmez).
 */
export type KayitTipi = 'Direkt' | 'Başvuru';

export function isDirekt(kayitTipi: KayitTipi | string | undefined): boolean {
  return kayitTipi === 'Direkt';
}

// Slug → MailerLite grup ID. Brief 3 (KARAR 206): 6 formatın hepsi map'lendi.
// null fallback artık yok — eksik grup compile-time kırar.
export const FORMAT_MAILERLITE_GROUP: Record<KayitFormat, string> = {
  cember: '187798293576681151',
  'acik-kapi': '187372390149261252',
  'mini-retreat': '189209166869431831',
  'sehir-aksami': '189209188425008761',
  seremoni: '189209224470857710',
  atolye: '189209178380699119',
  yolculuk: '192780641731871836',
};

export function isKayitFormat(s: unknown): s is KayitFormat {
  return typeof s === 'string' && s in FORMAT_TIP;
}

/**
 * Notion rich_text plain_text'ini satır dizisine çevirir.
 * Satırlar Notion'da Shift+Enter ile yazılır → tek rich_text içinde \n ayraçlı.
 * Boş satırları atar. Boş input → [].
 */
export function parseRichTextLines(raw: string | undefined | null): string[] {
  if (!raw) return [];
  return raw
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Kayıt niyet soruları. Geriye uyumlu isim — parseRichTextLines'a delege. */
export const parseKayitSorulari = parseRichTextLines;

/**
 * Referans kodu alfabesi — 29 karakter, karışan hiçbiri yok (Faz 1 §3,
 * [KAAN] kararıyla kesinleşti).
 *
 * DIŞARIDA: `0 O` · `1 I` · `B` (8'le karışır) · `S` (5) · `Z` (2) · Türkçe
 * karakterlerin tamamı (Ç Ğ İ Ö Ş Ü — banka açıklaması alanları çoğu kez
 * ASCII'ye düşürür, "Ç" gidip "C" gelir).
 *
 * ── `Z` çıktı, `L` KALDI — kural asimetrik, sebebi asimetri ──
 * Ölçüt "karışıyor mu" değil, **yanlış okuma GEÇERLİ bir kod üretiyor mu**:
 * - `Z` → `2` okunursa ortaya alfabeye ait, var olabilecek bir kod çıkar.
 *   Kadın yanlış kodu bankaya yazar, kayıt sessizce başka birine eşleşebilir.
 *   Bu SESSİZ bir hata — tehlikeli olan da bu.
 * - `L` → `1` okunursa `1` alfabede YOK. Kod geçersiz olur, eşleşme bulunamaz,
 *   hata gürültülü çıkar ve elle düzeltilir. Zararsız.
 * Aynı gerekçe `B`(→8) ve `S`(→5) için de geçerliydi; ikisi de zaten dışarıda.
 *
 * Faz 1 §3 brief'i kendi içinde çelişiyordu (dışlama listesi L ve Z'yi sayıyor,
 * verdiği alfabe dizesi ikisini de içeriyordu; "30 karakter"/"30^4" rakamları
 * dizeyi doğruluyordu). Çelişki Kaan'a raporlandı, karar yukarıdaki kuralla
 * geldi: Z düşer, L kalır, uzunluk 4'te kalır.
 *
 * Gerekçe iki katlı:
 * (a) Kadın bunu banka açıklamasına ELLE yazacak; karışan karakter
 *     eşleştirmeyi bozar ve parayı bulmak elde kalır.
 * (b) Banka açıklaması zaten rakamla dolu (tutar, tarih, telefon, IBAN
 *     parçası). Salt rakamsal bir kod metnin içinde ayırt edilemez —
 *     Faz 2'nin otomatik eşleştirmesi böyle bir kodun üstüne kurulamaz.
 */
const REF_ALFABE = '23456789ACDEFGHJKLMNPQRTUVWXY';

/** Referans kodundaki rastgele karakter sayısı. Uzay = 29^4 = 707.281. */
const REF_UZUNLUK = 4;

/**
 * Talihsiz kelime kara listesi (Faz 1 §3, [KAAN]).
 *
 * Dört karakterlik bir rastgele kod pekâlâ okunabilir bir küfür ya da hakaret
 * çıkarabilir. Kod kadına success ekranında gösteriliyor, maile giriyor ve
 * BANKA AÇIKLAMASINA elle yazılıyor — üç yüzeyin üçü de kamuya bakıyor.
 * Olasılık düşük ama sonucu onarılamaz: kadın kendi kaydında bir küfür görür.
 *
 * Liste alfabenin kısıtına göre seçildi — `B S Z I O 0 1` ve Türkçe harfler
 * alfabede olmadığı için ancak bunlarsız yazılabilen kelimeler üretilebilir
 * ("puşt", "pezevenk", "sik" gibi olasılıklar zaten imkânsız). Türkçe kısaltma
 * biçimleri (AMCK, YRRK) dahil, çünkü kod zaten kısaltma gibi okunuyor.
 *
 * Eşleşme ALT DİZE olarak aranır, eşitlik olarak değil: dört karakterlik kodda
 * ikisi aynı şeydir, ama beş karakterlik son çare kodunda (`OCAK-FUCK7`)
 * yalnız alt dize kontrolü yakalar.
 *
 * Uzaya etkisi ölçülü: dört karakterlik uzaydan 15 kod düşer,
 * 707.281 → 707.266. Doğum günü eşiği değişmez (~990).
 *
 * Dışa açık, çünkü tek kaynak testtir: liste alfabe dışı bir karakter içeren
 * bir kelime kazanırsa (ör. "PUŞT", "SIKT") o madde ÖLÜ olur — hiç
 * üretilemeyecek bir kodu eler ve listeyi güvenli sanmamıza yol açar.
 * `kayit.test.ts` bunu listenin kendisine karşı sınıyor.
 */
export const REF_KARA_LISTE = [
  'AMCK',
  'YRRK',
  'YRAK',
  'GTVR',
  'KAHP',
  'GAVT',
  'APTL',
  'FUCK',
  'CUNT',
  'TWAT',
  'WANK',
  'CRAP',
  'TURD',
  'RAPE',
  'KKKK',
] as const;

/**
 * Kod gövdesini üretir — rastgele çekiliş + kara liste elemesi tek yerde.
 *
 * Hem normal kod (4) hem son çare kodu (5) buradan geçer; kara listeyi iki
 * ayrı döngüye kopyalasaydık biri güncellenip öteki unutulurdu.
 *
 * `maxDeneme` teorik bir emniyet freni: 15 elemeli listeyle ilk çekilişin
 * elenme ihtimali ~%0,002, ikinci turda bitmemesi pratikte imkânsız. Fren,
 * liste ileride uzaya yakın büyüklükte büyürse sonsuz döngü olmasın diye
 * duruyor — dolduğunda son adayı döndürür, çünkü talihsiz bir kod, kodsuz
 * kalmaktan iyidir (ref'siz kayıt havaleyle eşleşemez).
 */
function refKodUret(uzunluk: number, maxDeneme = 20): string {
  let kod = '';
  for (let deneme = 0; deneme < maxDeneme; deneme++) {
    kod = '';
    for (let i = 0; i < uzunluk; i++) {
      kod += REF_ALFABE[Math.floor(Math.random() * REF_ALFABE.length)];
    }
    if (!REF_KARA_LISTE.some((kelime) => kod.includes(kelime))) return kod;
  }
  return kod;
}

/**
 * Brief 6 (KARAR 210) + Son tur (2026-06-14) + Faz 1 §3 (2026-08-19):
 * Kayıt için referans KODU üretir.
 *
 * Format: `OCAK-XXXX` — 4 karakter, `REF_ALFABE`'den, `REF_KARA_LISTE`'den
 * geçmiş. Uzay 29^4 = 707.281 (kara liste 15 kodu eler → 707.266).
 *
 * ── Uzay KÜÇÜLDÜ, bu bir kazanç değil ──
 * Önceki format 6 haneli rakamdı (900.000). Yeni uzay 707.281, yani çakışma
 * ihtimali ARTIYOR: doğum günü paradoksunda %50 eşiği ~1117 kayıttan
 * ~990 kayda iniyor. Pratikte önemsiz — lansman hacmi bunun çok altında ve
 * `uretBenzersizReferansNo` Notion sorgusuyla zaten koruyor.
 * Takas bilinçli: ~193.000 ihtimal karşılığında elle yazılabilir, telefonda
 * okunabilir, banka açıklamasında ayırt edilebilir bir kod.
 *
 * ── Eski kodlar ──
 * Notion'da 5 ve 6 haneli rakamsal kodlar var. MIGRATION YOK — eski kayıtlar
 * olduğu gibi kalır, yeni kayıtlar yeni format alır. Elle takipte ikisi de
 * aranabilir. Faz 2'nin eşleştirme regex'i İKİ FORMATI DA tanımak zorunda.
 *
 * Çakışma garantisi `uretBenzersizReferansNo(query, dbIds)` ile.
 */
export function uretReferansNo(): string {
  return `OCAK-${refKodUret(REF_UZUNLUK)}`;
}

/**
 * Son tur (2026-06-14) — çakışma garantili ref üretimi. Notion Kayıtlar +
 * Başvurular DB'lerinde "Referans No" rich_text alanını query'leyip aday
 * ref'i kontrol eder; varsa yeniden üretir (max `maxDeneme` deneme).
 * Başarısızsa son çare fallback — Faz 1 §3'e kadar timestamp tabanlıydı
 * (`OCAK-${Date.now().slice(-8)}`), yani RAKAMSAL. Yeni alfabeye çevrilmezse
 * iki format yan yana yaşardı ve tam da kaçınılan duruma düşülürdü: banka
 * açıklamasında ayırt edilemeyen bir kod. Fallback artık aynı alfabeden
 * üretiyor; benzersizliği zaten yukarıdaki Notion sorgusu sağlıyor, kodun
 * timestamp olması hiç şart değildi.
 *
 * KARAR 76 — Kayıtlar tek otorite; ama Başvurular'a da Kapı 2 akışında ref
 * yazılıyor. İki DB ortak `OCAK-XXXX` uzayını paylaşır.
 *
 * Race condition: iki eşzamanlı kayıt aynı anda aynı ref üretirse, ikisi de
 * query'de "yok" görür → ikisi de yazar (Notion atomic transaction yok).
 * Lansman hacmi düşük → pratik kabul. Worst-case Kaan elle düzeltir.
 *
 * `client` notion-types client; `dbIds` undefined/empty olanlar atlanır
 * (test/dev için, prod'da ikisi de set). `query` parametresi async test
 * için inject edilebilir.
 */
export type RefUniqueQuery = (dbId: string, ref: string) => Promise<boolean>;

export async function uretBenzersizReferansNo(
  query: RefUniqueQuery,
  dbIds: string[],
  maxDeneme = 3,
): Promise<string> {
  const aktifDbler = dbIds.filter(Boolean);
  for (let i = 0; i < maxDeneme; i++) {
    const aday = uretReferansNo();
    let cakisma = false;
    for (const dbId of aktifDbler) {
      if (await query(dbId, aday)) {
        cakisma = true;
        break;
      }
    }
    if (!cakisma) return aday;
  }
  // Son çare (Faz 1 §3): timestamp DEĞİL, aynı alfabeden daha uzun bir kod.
  // Rakamsal fallback iki formatı yan yana yaşatırdı. Uzunluk bir artırıldı
  // (29^5 = 20.5M) — sorgu üç kez çakışma gördüyse uzayı genişletmek doğru
  // refleks; benzersizliği zaten sorgu sağlıyordu, bu yalnız son çare.
  // Kara liste burada da geçerli: `refKodUret` tek kapı.
  return `OCAK-${refKodUret(REF_UZUNLUK + 1)}`;
}

/**
 * Havale açıklama metni — kadının bankada açıklama alanına yazacağı dize.
 *
 * Faz 1 §1 (2026-08-19): **isim çıkarıldı.** Önceki hâl `"{ad} — {referansNo}"`
 * idi ("Ayşe Gülşah — OCAK-7K3F", 23 karakter / 28 bayt, üç ASCII dışı
 * karakter: `ş` `ü` ve em dash `—` U+2014).
 *
 * İki gerekçe, ikisi de o satırı savunulamaz kılıyordu:
 * (a) **ASCII dışı karakter riski.** Em dash ve Türkçe harfler Türk bankacılık
 *     uygulamalarının açıklama alanında kırpılabiliyor, değiştirilebiliyor ya
 *     da reddedilebiliyor. Kadın kopyalayıp yapıştırdığında ne olacağını
 *     repodan ÖLÇEMİYORUZ — ölçemediğimiz bir şey eşleştirmenin ortasında
 *     duramaz.
 * (b) **İsim bilgi taşımıyor.** Faz 2'nin yedek eşleştirme kanalı gönderenin
 *     adını BANKA KAYDINDAN okuyacak, açıklama metninden değil. İsim o satırda
 *     yalnız risk taşıyordu.
 *
 * Yeni hâl saf ASCII, büyük harf, dokuz karakter — kırpılacak bir şey yok.
 *
 * ── Neden özdeşlik fonksiyonu? ──
 * Gövde bugün argümanı aynen döndürüyor. Fonksiyon yine de duruyor, çünkü
 * "banka açıklama alanına ne yazılır" sorusunun **adlandırılmış tek cevabı**
 * o: iki çağrı yeri (`api/kayit.ts` askı dalı + ana dal) buradan besleniyor,
 * test buraya çakılıyor ve Faz 2'nin ayrıştırıcısı bu sözleşmeye bakacak.
 * Biçim bir gün ön ek kazanırsa tek yerde kazanır.
 *
 * Route'ta değil lib'de yaşıyor çünkü `src/pages/` altındaki her dosya route,
 * oraya test konamıyor — Y1'de `mailerLiteFieldsPayload` aynı sebeple taşındı.
 */
export function havaleAciklamasi(referansNo: string): string {
  return referansNo;
}

/**
 * Brief 5 Yol C: Notion Etkinlikler DB "Mekân/Platform" select değerini
 * katılım tipine eşler. 'Online' → 'link' (Zoom URL); diğer (İzmir/İstanbul/
 * Ege/Anadolu) → 'adres'. Boş / bilinmeyen → 'link' default (lansman
 * etkinlikleri 6/6 Online, defansif fallback online tarafa düşsün).
 */
export function katilimTipiCoz(mekan: string | undefined | null): 'link' | 'adres' {
  if (!mekan || mekan === 'Online') return 'link';
  return 'adres';
}

/**
 * MailerLite custom field payload'u — **on iki alan**, HER kayıtta hepsi yazılır.
 * Sayı `MAILERLITE_ALANLAR` dizisinden doğrulanır; bu satır ondan türer.
 * (Sayı üç turda 10 → 11 → 12 oldu, bu başlık ikisini kaçırdı — 19 Ağustos
 * 2026'da diziye karşı ölçülüp düzeltildi.)
 *
 * ── Alan hijyeni (brief-mailerlite-odeme-kapisi, madde 2-i) ──
 * Eski davranış boş değeri payload'a HİÇ koymuyordu. MailerLite subscriber
 * alanları kalıcıdır: alan gönderilmezse önceki kayıttan kalan değer yerinde
 * durur. Online kayıttan sonra yüz yüze kayıt yapan kadının `zoom_link`'i
 * eskisiyle dolu kalıyordu — mail ona geçen ayın linkini gösterebiliyordu.
 * Artık geçersiz alan **boş string** ile yazılır, böylece silinir. MailerLite
 * koşulları (`{$x}` boş mu) ancak bu şekilde güvenilir olur.
 *
 * ── Ödeme kapısı (madde 1) ──
 * `odemeGerekli` true iken katılım alanları boş gider:
 * `katilim_linki` · `zoom_link` · `zoom_sifresi` · `etkinlik_adres`.
 * `etkinlik_mekan` GİDER — şehir gizli bilgi değil, kadın nereye geleceğini
 * bilmeli; gizlenen kapı numarası. Ayırıcı yalnız `odemeGerekli`; format
 * bazlı varsayım yapılmaz (Açık Kapı da ücretli olabilir). 0-TL ve tam burs
 * `odemeGerekli=false` ürettiği için normal akıştan geçer, ayrı dal yok.
 * Havale de kapalıdır: para kayıttan günler sonra gelir, hiç gelmeyebilir —
 * KARAR 220'nin success ekranına verdiği kural maile de uygulanır.
 *
 * Ödeme alınınca linkin gönderilmesi ayrı iştir (n8n → Notion Ödeme Durumu).
 */
export type MailerLiteFieldGirdi = {
  etkinlikAdi: string;
  etkinlikTarihi?: string | null;
  etkinlikSaati?: string | null;
  katilimTipi: 'link' | 'adres';
  /** Online ise Zoom join URL (Notion Katılım Linki). */
  katilimLinki?: string | null;
  /** Online ise Zoom meeting password (Notion Zoom Şifresi). */
  zoomSifresi?: string | null;
  /** Fiziksel ise Mekân/Platform select değeri (örn. "İstanbul"). */
  mekan?: string | null;
  /** Fiziksel ise adres detayı (Notion Konum Detay). */
  mekanAdres?: string | null;
  /** Ödeme kapısı anahtarı — true ise katılım alanları boş gönderilir. */
  odemeGerekli: boolean;
  /** `OCAK-XXXX` — havale açıklamasının eşleştirme anahtarı, daima yazılır. */
  referansNo: string;
  /**
   * Notion `Başlık` — buluşmanın KENDİ adı ("Elin Neyle Dolu?").
   * `etkinlikAdi` ile karıştırma: o format+tarih ("Çember — 10 Eylül 2026 ·
   * 20:00"), bu sayfanın adı. İkisi ayrı yaşar, şablonda ayrı iş yapar.
   */
  etkinlikBasligi?: string | null;
  /** Buluşmanın detay sayfası — `etkinlikUrlFormatla(Slug)`. Slug yoksa boş. */
  etkinlikUrl?: string | null;
};

/** MailerLite'a yazılan alanların tam listesi — envanter tek kaynak. */
export const MAILERLITE_ALANLAR = [
  'etkinlik_adi',
  'etkinlik_basligi',
  'etkinlik_url',
  'etkinlik_tarihi',
  'etkinlik_saati',
  'katilim_linki',
  'zoom_link',
  'zoom_sifresi',
  'etkinlik_mekan',
  'etkinlik_adres',
  'referans_no',
  'odeme_durumu',
] as const;

export function mailerLiteCustomFields(g: MailerLiteFieldGirdi): Record<string, string> {
  const t = (v: string | undefined | null) => (v ?? '').trim();
  const online = g.katilimTipi === 'link';
  // Kapı açık = ödeme beklenmiyor (ücretsiz, tam burs ya da 0-TL).
  const kapiAcik = !g.odemeGerekli;
  return {
    etkinlik_adi: t(g.etkinlikAdi),
    // Buluşmanın kendi adı — kapıya tabi değil, daima gider.
    etkinlik_basligi: t(g.etkinlikBasligi),
    // Detay sayfası — kapıya tabi değil, sayfa herkese açık.
    etkinlik_url: t(g.etkinlikUrl),
    etkinlik_tarihi: t(g.etkinlikTarihi),
    etkinlik_saati: t(g.etkinlikSaati),
    // C-1 geriye uyum: katilim_linki mevcut şablonu kırmasın diye korunur.
    katilim_linki: online && kapiAcik ? t(g.katilimLinki) : '',
    zoom_link: online && kapiAcik ? t(g.katilimLinki) : '',
    zoom_sifresi: online && kapiAcik ? t(g.zoomSifresi) : '',
    // Kapıya TABİ DEĞİL — şehir adı gizli bilgi değil.
    etkinlik_mekan: online ? '' : t(g.mekan),
    etkinlik_adres: !online && kapiAcik ? t(g.mekanAdres) : '',
    referans_no: t(g.referansNo),
    // `alindi` bu turda kod tarafından yazılmaz — n8n işi (ödeme onayı).
    odeme_durumu: g.odemeGerekli ? 'bekliyor' : 'muaf',
  };
}

/**
 * MailerLite `fields` payload'u — `name` + custom field'lar. Taşıma katmanının
 * saf ucu; `/api/kayit`'teki `mailerLiteEkle` bunu çağırıp `fetch` eder.
 *
 * ── Neden ayrı bir helper ──
 * `mailerLiteEkle` bir route dosyasında (`src/pages/api/kayit.ts`) yaşıyor ve
 * `src/pages/` altına test konamıyor (her dosya route sayılır — bkz.
 * `havale-vade.ts` başlığı). Payload kurulumu bu yüzden lib'e alındı: saf
 * mantık lib'de yaşar, test lib'de koşar. `fetch` route'ta kalır.
 *
 * ── Alan hijyeni: boş string GİDER ──
 * `mailerLiteCustomFields` geçersiz alanı boş string ile yazar ki MailerLite'ta
 * **silinsin**. Eski taşıma katmanı (`if (v && v.trim())`) o boş string'i görüp
 * alanı payload'dan düşürüyordu; MailerLite subscriber alanları kalıcı olduğu
 * için önceki kayıttan kalan değer yerinde kalıyordu. Canlı vaka (19 Ağustos
 * 2026): Slug'ı boş "Konuk Ateşi" kaydında `etkinlik_url` iki kayıt önceki
 * "Ekmeden Önce" adresinde kaldı — mail doğru buluşmayı yazıp yanlış sayfaya
 * götürdü. Ödeme kapısı da aynı mekanikle deliniyordu: ücretli kayıtta boşlanan
 * `zoom_link` gönderilmediği için eski link yerinde kalıyordu.
 *
 * Artık `ekFields`'in HER anahtarı payload'a girer — değeri boş olsa da.
 *
 * ── `name` bu kuraldan MUAF ──
 * İsim boşken boş gönderilirse mail "Merhaba ," diye açılır. `name` custom
 * field değil, subscriber'ın kendi adı; hijyen kuralı ona işlemez. Mevcut
 * davranış korunuyor: `name` daima yazılır ve `ekFields` onu **ezemez**.
 */
export function mailerLiteFieldsPayload(
  ad: string,
  ekFields?: Record<string, string>,
): Record<string, string> {
  const fields: Record<string, string> = { name: ad };
  if (!ekFields) return fields;
  for (const [k, v] of Object.entries(ekFields)) {
    // `name` muafiyeti: ekFields'ten gelen bir `name` anahtarı subscriber adını
    // ezmesin (bugün MAILERLITE_ALANLAR'da yok; defansif).
    if (k === 'name') continue;
    fields[k] = v ?? '';
  }
  return fields;
}

/**
 * Notion date ISO ("2026-06-21" veya "2026-06-21T18:00:00.000+03:00") →
 * Türkçe "21 Haziran 2026". Parse edilemezse input'u aynen döner (defansif).
 * MailerLite `etkinlik_tarihi` custom field'ı için welcome şablonunda
 * doğrudan basılır.
 */
export function tarihTrFormat(iso: string | undefined | null): string {
  if (!iso) return '';
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return iso;
  const aylar = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık',
  ];
  const gun = Number(m[3]);
  const ayIdx = Number(m[2]) - 1;
  if (ayIdx < 0 || ayIdx > 11) return iso;
  return `${gun} ${aylar[ayIdx]} ${m[1]}`;
}

/**
 * Brief 5 Yol C: MailerLite custom field `etkinlik_adi` için insan-okur
 * formatlanmış etkinlik adı. Format Tip (kısa) + seçilen tarih birleşimi
 * (örn. "Çember — 21 Haziran 2026"). seciliTarih boşsa sadece Tip.
 *
 * Plan örneği birebir: KayitFormat slug'ından FORMAT_TIP[format] alınır;
 * uzun varyant FORMAT_NOTION_FORMAT (Etkinlikler DB "Format") değil —
 * MailerLite şablonunda kısa daha doğal.
 */
/**
 * MailerLite `etkinlik_url` — buluşmanın kendi detay sayfası.
 * Kaynak Notion `Slug`; taban `astro.config.mjs` `site` ile aynı
 * (`https://www.ocak.biz`) — sayfanın kendi canonical'ı da oradan türer.
 * Kanonik adres **www'lu**: köksüz `ocak.biz` 307 ile www'ye dönüyor, yani
 * gerçekte servis eden host www. Mailde fazladan atlama olmasın diye doğrudan
 * kanonik yazılır.
 *
 * `publicOrigin(request)` BİLEREK kullanılmadı: preview deploy'dan gelen bir
 * kayıt maile preview URL'i yazardı ve o adres deploy düşünce ölürdü. Mail
 * kalıcı bir yüzey, daima production'a bakar.
 *
 * Slug boşsa **boş string** döner — `https://www.ocak.biz/etkinlik/` gibi kırık bir
 * taban URL üretmez. Slug'sız etkinliğin detay sayfası zaten yoktur
 * (`[slug].astro` getStaticPaths onu atlar).
 */
export function etkinlikUrlFormatla(slug: string | undefined | null): string {
  const s = (slug ?? '').trim();
  return s ? `https://www.ocak.biz/etkinlik/${s}` : '';
}

export function etkinlikAdiFormatla(
  format: KayitFormat,
  seciliTarih: string | undefined | null,
): string {
  const tip = FORMAT_TIP[format];
  const tarih = seciliTarih?.trim();
  return tarih ? `${tip} — ${tarih}` : tip;
}

/**
 * Aşama 3a — promo + iki katman tutar hesabı (tek otorite, backend+frontend
 * paylaşır). Brief: brief-odeme-asama3a-promo-aski-backend.md.
 *
 * Kurallar:
 *  - Kod yok / geçersiz → toplam = A + B, indirim = 0.
 *  - tip='yuzde' veya 'sabit' → indirim (A+B)'ye uygulanır;
 *    toplam = max(0, A+B − indirim). Helper `kodDogrula` zaten A+B üzerinden
 *    hesapladıysa indirimTutari doğrudan kullanılır.
 *  - tip='tam-burs' → sadece A sıfırlanır, B aynen kalır;
 *    indirim = A, toplam = B. (Helper bu durumda yeniTutar=0 döner çünkü
 *    A+B'yi sıfırlar — burada B'yi geri ekliyoruz; brief açık karar.)
 *
 * Dönüş `katmanA`/`katmanB`: indirimden SONRAKİ değerler (tam-burs'da A=0).
 * Frontend canlı tutar bloğunda satır-bazlı gösterim için ayrı tutuluyor;
 * `toplam` zaten katmanA + katmanB.
 */
import type { KodSonuc } from './kodlar';

export type IndirimSonuc = {
  /** İndirim sonrası katman A (tam-burs'da 0). */
  katmanA: number;
  /** Katman B — tam-burs'da değişmez, yuzde/sabit'te değişmez (indirim toplama uygulanır). */
  katmanB: number;
  /** Toplam indirim TL. Promo yoksa/geçersizse 0. */
  indirim: number;
  /** Ödenecek toplam TL = katmanA + katmanB (yuzde/sabit'te = max(0, A+B−indirim); tam-burs'ta = B). */
  toplam: number;
};

export function uygulaIndirim(
  katmanA: number,
  katmanB: number,
  kod: KodSonuc | null,
): IndirimSonuc {
  // Aşama 3b-fix tasarım KARARI (2026-06-09): indirim SADECE Katman A
  // (katılım payı) üzerine uygulanır. Kor (Katman B / askı) tam kalır —
  // kullanıcı kendi katkısını yapıyor, indirim onu da düşürmek mantıksız.
  // Önceden A+B'ye uygulanıyordu (Aşama 3a); değiştirildi.
  const aSafe = Math.max(0, katmanA);
  const bSafe = Math.max(0, katmanB);
  const yuvarlaKurus = (n: number) => Math.round(n * 100) / 100;
  if (!kod || !kod.gecerli) {
    return { katmanA: aSafe, katmanB: bSafe, indirim: 0, toplam: yuvarlaKurus(aSafe + bSafe) };
  }
  if (kod.tip === 'tam-burs') {
    return { katmanA: 0, katmanB: bSafe, indirim: aSafe, toplam: bSafe };
  }
  // yuzde / sabit — indirim SADECE A'ya. `kod.indirimTutari` kodDogrula
  // çağrısının `tutar` parametresine göre hesaplanır; çağıran A'yı
  // geçirmişse doğrudan kullanılır, A+B geçirmişse burada A ile sınırlanır.
  const indirim = Math.min(Math.max(0, kod.indirimTutari), aSafe);
  const yeniA = Math.max(0, aSafe - indirim);
  return {
    katmanA: yuvarlaKurus(yeniA),
    katmanB: bSafe,
    indirim: yuvarlaKurus(indirim),
    toplam: yuvarlaKurus(yeniA + bSafe),
  };
}

/**
 * mini-cta buton post-render çözümü (brief-kayit-buton-FINAL Faz 3).
 *
 * transformMiniCta section'ı prose + `__MINI_CTA_BUTON__` placeholder emit
 * eder; loader (config.ts) bu helper'ı çağırıp bağlama göre butonu basar.
 *
 * Üç dal:
 *   - slug KayitFormat + `kayitTipi` verilir (etkinlik detay pipeline) →
 *     Direkt→"Yerini ayır" / Başvuru→"Başvur" + `/[format]/kayit` +
 *     "Diğer tarihler → /takvim#[slug]"
 *   - slug KayitFormat + `kayitTipi` yok (format sayfası kapanışı) →
 *     nötr "Yerini ayır" + `/[format]/kayit`, tümü linki yok
 *   - slug KayitFormat değil (/site-rehber, /anadolu) → placeholder boş
 *     ile silinir; content prose olarak kalır (bypass)
 */
export function resolveMiniCtaBtn(
  html: string,
  rawSlug: string,
  opts: { kayitTipi?: 'Direkt' | 'Başvuru' } = {},
): string {
  if (!html.includes('__MINI_CTA_BUTON__')) return html;
  const slug = rawSlug.replace(/^\/+|\/+$/g, '');
  if (!isKayitFormat(slug)) {
    return html.replaceAll('__MINI_CTA_BUTON__', '');
  }
  const metin = opts.kayitTipi === 'Başvuru' ? 'Başvur' : 'Yerini ayır';
  const buton =
    `<a class="ocak-kayit-cta__buton" href="/${slug}/kayit" data-kayit-cta-button>` +
    `${metin} <span aria-hidden="true">→</span></a>`;
  const tumu = opts.kayitTipi
    ? `<p class="ocak-kayit-cta__tumu"><a href="/takvim#${slug}">Diğer tarihler <span aria-hidden="true">→</span></a></p>`
    : '';
  return html.replaceAll('__MINI_CTA_BUTON__', buton + tumu);
}
