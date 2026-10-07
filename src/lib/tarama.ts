/**
 * tarama.ts — `/api/bildirim-tara`'nın KARAR motoru. Saf; Notion'a ve Resend'e
 * dokunmaz.
 *
 * ── Neden ayrı ──
 * Uç bir route dosyası (`src/pages/api/`), oraya test konamaz (KARAR 574). Ama
 * taramanın her satırı bir para/iletişim kararı: yanlış dal ödemesini yapmak
 * isteyen bir kadının yerini iptal eder ya da iptal edilmiş bir kayda mail
 * gönderir. Karar burada ve satır satır ölçülüyor; route yalnız uygular.
 *
 * ── Üç adım, sırayla (brief §4 + Ek 2) ──
 *   (a) Ödenmiş ama maili gitmemiş → `yerin-hazir-*`
 *   (b) Bekleyen kayıtlar          → hatırlat / uzat / iptal
 *   (c) Buluşma günü hatırlatması  → `gun-hatirlatma-*`
 *
 * ── İki kural her adımda geçerli ──
 *   1. **Önce mail, başarılıysa Notion işareti.** Mail başarısızsa işaret
 *      YAZILMAZ ve sonraki tarama yeniden dener. Tersi sıra bir kez düşen
 *      maili sonsuza kadar kaybettirirdi.
 *   2. **İptal yalnız Notion yazımıdır; mail yok.** İptal sessizdir (brief §1).
 */
import { yerTutmaUzat, yakinMi } from './yer-tutma.ts';
import { mekanOnlineMi } from './posta.ts';

/** Taramanın gördüğü tek satır — route Notion'dan bunu doldurur. */
export type TaramaSatiri = {
  /** Notion page id — yazımlar buraya gider. */
  pageId: string;
  /** `OCAK-XXXX` — yanıtta ve log'da TEK kimlik. */
  kayitId: string;
  odemeDurumu: string;
  odemeYontemi: string;
  /** Kayıtlar `Kayıt Tarihi` = Notion `created_time`. Dakika hassasiyeti. */
  kayitAni: Date | null;
  yerTutmaBitisi: Date | null;
  mailGitti: boolean;
  hatirlatmaGitti: boolean;
  gunHatirlatmasiGitti: boolean;
  /** Etkinlik başlangıç anı (`etkinlikBaslangicAni`). `null` = Tarih yok. */
  etkinlikBaslangici: Date | null;
  /**
   * Saat herhangi bir alandan OKUNABİLDİ mi. `false` ise `etkinlikBaslangici`
   * 23:59 kuralına düşmüş demektir — gün hatırlatması o satıra GÖNDERİLMEZ
   * (Ek 2), çünkü "başlangıç − 6 saat" uydurma bir saatten sayılırdı.
   */
  saatOkunabildi: boolean;
  mekan: string;
};

/** Taramanın bir satır için verdiği karar. */
export type TaramaIslemi =
  | { tip: 'bildirim'; satir: TaramaSatiri }
  | { tip: 'hatirlat-kart'; satir: TaramaSatiri }
  | { tip: 'uzat-havale'; satir: TaramaSatiri; yeniBitis: Date }
  | { tip: 'iptal'; satir: TaramaSatiri; neden: IptalNedeni }
  | { tip: 'gun-hatirlatma'; satir: TaramaSatiri; gun: GunEtiketi };

export type IptalNedeni =
  | 'Kart — süre doldu'
  | 'Havale — süre doldu'
  | 'Etkinlik başladı';

export type GunEtiketi = 'Bugün' | 'Bu akşam';

/** Kart hatırlatmasının eşiği: kayıttan bu kadar sonra (brief §4). */
export const KART_HATIRLATMA_DK = 30;

/**
 * Gün hatırlatması: başlangıç − bu kadar saat (Ek 2). Aynı günün 08:00'inden
 * (TR) erken olamaz — sabahın altısında mail göndermek saygısızlık olurdu.
 */
export const GUN_HATIRLATMA_SAAT = 6;
export const GUN_HATIRLATMA_EN_ERKEN_SAAT = 8;

/** `GUN` etiketi eşiği: başlangıç saati bundan büyük/eşitse "Bu akşam". */
export const AKSAM_ESIGI_SAAT = 17;

const DK_MS = 60_000;
const SAAT_MS = 3_600_000;

/** TR duvar saatini (saat, dakika) veren tek yer. */
function trSaatDakika(an: Date): { saat: number; dakika: number } {
  const p = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Istanbul',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(an);
  const al = (t: string) => Number(p.find((x) => x.type === t)?.value ?? '0');
  return { saat: al('hour'), dakika: al('minute') };
}

/**
 * `GUN` etiketi — başlangıç saati **TR'de** ≥ 17:00 ise "Bu akşam".
 *
 * Saat UTC'den okunsaydı 21:00'lik bir çember 18:00Z olur ve eşiği geçerdi
 * ama 10:00'lik bir atölye 07:00Z olup geçmezdi — yani eşik üç saat kayardı.
 */
export function gunEtiketi(etkinlikBaslangici: Date): GunEtiketi {
  return trSaatDakika(etkinlikBaslangici).saat >= AKSAM_ESIGI_SAAT ? 'Bu akşam' : 'Bugün';
}

/**
 * Gün hatırlatmasının gönderim anı: başlangıç − 6 saat, ama **aynı günün
 * 08:00'inden (TR) erken değil.**
 *
 * 08:00 tabanı neden: 10:00'da başlayan bir atölyede başlangıç − 6 saat
 * 04:00 eder. Gece dörtte mail göndermek hatırlatma değil rahatsızlık, ve
 * kadın onu uyandığında zaten okuyacak.
 */
export function gunHatirlatmaAni(etkinlikBaslangici: Date): Date {
  const alti = new Date(etkinlikBaslangici.getTime() - GUN_HATIRLATMA_SAAT * SAAT_MS);
  // Başlangıcın TR gününün 08:00'i. Gün damgasını başlangıçtan alıyoruz:
  // `alti` bir önceki güne sarkmış olabilir (örn. 02:00'de başlayan bir şey).
  const { saat, dakika } = trSaatDakika(etkinlikBaslangici);
  const gunBasi = new Date(etkinlikBaslangici.getTime() - (saat * SAAT_MS + dakika * DK_MS));
  const sekiz = new Date(gunBasi.getTime() + GUN_HATIRLATMA_EN_ERKEN_SAAT * SAAT_MS);
  return alti.getTime() < sekiz.getTime() ? sekiz : alti;
}

/**
 * (a) Ödenmiş ama maili gitmemiş.
 *
 * Havaleyi Kaan elle `Ödendi`'ye çekiyor ve o yolda hiçbir kod `yerin hazır`
 * göndermiyor — bu dal onu yakalıyor. Kartta callback gönderiyor ama posta
 * düşmüşse `Mail Gitti` yazılmamış olur, yine bu dal yakalıyor.
 *
 * Etkinlik başlamışsa gönderilmez: geçmiş bir buluşmanın Zoom linkini
 * göndermek kadına bir şey vermez, yalnız kafa karıştırır.
 */
function bildirimGerekli(s: TaramaSatiri, simdi: Date): boolean {
  if (s.odemeDurumu !== 'Ödendi') return false;
  if (s.mailGitti) return false;
  if (s.etkinlikBaslangici && s.etkinlikBaslangici.getTime() <= simdi.getTime()) return false;
  return true;
}

/**
 * (b) Bekleyen kayıtlar. **`Yer Tutma Bitişi` dolu olmak ŞART** — boş satırlara
 * dokunulmaz (bu brief öncesi kayıtlar ve ücretsiz kayıtlar kapsam dışı).
 */
function bekleyenIslemi(s: TaramaSatiri, simdi: Date): TaramaIslemi | null {
  if (s.odemeDurumu !== 'Beklemede') return null;
  if (!s.yerTutmaBitisi) return null;

  // Etkinlik başladı → iptal, yöntemden bağımsız. En üstte: başlamış bir
  // buluşma için yer tutmanın ya da hatırlatmanın anlamı yok.
  if (s.etkinlikBaslangici && s.etkinlikBaslangici.getTime() <= simdi.getTime()) {
    return { tip: 'iptal', satir: s, neden: 'Etkinlik başladı' };
  }

  const bitisGecti = s.yerTutmaBitisi.getTime() <= simdi.getTime();
  const kart = s.odemeYontemi === 'Kredi Kartı';

  if (kart) {
    if (bitisGecti) return { tip: 'iptal', satir: s, neden: 'Kart — süre doldu' };
    // 30 dakika eşiği: kadın hâlâ ödeme ekranında olabilir. Hemen mail
    // göndermek "ödemedin" demek olurdu.
    if (!s.hatirlatmaGitti && s.kayitAni) {
      const gecen = simdi.getTime() - s.kayitAni.getTime();
      if (gecen >= KART_HATIRLATMA_DK * DK_MS) return { tip: 'hatirlat-kart', satir: s };
    }
    return null;
  }

  // Havale — bitiş geçmedikçe hiçbir şey yapılmaz; ilk mail kayıt anında gitti.
  if (!bitisGecti) return null;
  if (!s.hatirlatmaGitti) {
    // Ek süre: kayıt anındaki ≤72 saat kuralı geçerliyse 6, değilse 12 saat.
    const yakin = s.kayitAni ? yakinMi(s.kayitAni, s.etkinlikBaslangici) : false;
    const yeniBitis = yerTutmaUzat({ simdi, yakin, etkinlikBaslangici: s.etkinlikBaslangici });
    return { tip: 'uzat-havale', satir: s, yeniBitis };
  }
  return { tip: 'iptal', satir: s, neden: 'Havale — süre doldu' };
}

/**
 * (c) Buluşma günü hatırlatması (Ek 2).
 *
 * `Kayıt Tarihi < gönderim anı` koşulu neden var: gönderim anından SONRA kayıt
 * olan kadın zaten katılım bilgisini kayıt/ödeme mailinde aldı. Ona "bugün
 * buluşuyoruz" demek, beş dakika önce okuduğu şeyi tekrarlamak olurdu.
 */
function gunHatirlatmasi(s: TaramaSatiri, simdi: Date): TaramaIslemi | null {
  if (!s.mailGitti) return null;
  if (s.odemeDurumu === 'İptal') return null;
  if (s.gunHatirlatmasiGitti) return null;
  if (!s.etkinlikBaslangici) return null;
  // Saat uydurulmuş (23:59 kuralı) → gönderme. "Başlangıç − 6 saat" uydurma
  // bir saatten sayılırdı; sebep route'ta log'lanıyor.
  if (!s.saatOkunabildi) return null;

  const an = gunHatirlatmaAni(s.etkinlikBaslangici);
  if (simdi.getTime() < an.getTime()) return null;
  if (simdi.getTime() >= s.etkinlikBaslangici.getTime()) return null;
  if (!s.kayitAni || s.kayitAni.getTime() >= an.getTime()) return null;

  return { tip: 'gun-hatirlatma', satir: s, gun: gunEtiketi(s.etkinlikBaslangici) };
}

/**
 * Bir satır için TEK işlem döner (ya da `null`). Sıra brief'teki sıra:
 * (a) bildirim → (b) bekleyen → (c) gün hatırlatması.
 *
 * Neden tek işlem: aynı satıra aynı turda iki mail göndermek istemiyoruz.
 * Örneğin ödemesi yeni onaylanmış ve buluşması altı saat sonra olan bir kayıt
 * (a)'da "yerin hazır" alır; gün hatırlatması bir sonraki turda gider ve
 * `Mail Gitti` o zamana kadar yazılmış olur.
 */
export function satirIslemi(s: TaramaSatiri, simdi: Date): TaramaIslemi | null {
  if (bildirimGerekli(s, simdi)) return { tip: 'bildirim', satir: s };
  const bekleyen = bekleyenIslemi(s, simdi);
  if (bekleyen) return bekleyen;
  return gunHatirlatmasi(s, simdi);
}

/**
 * Tüm satırlar → işlem listesi, **en çok `tavan` işlem** (brief: çağrı başına
 * 25). Kalan sonraki taramaya kalır.
 *
 * ⚠ Tavana takılan satır sayısı çağırana DÖNER ve log'lanır. Sessiz kırpma
 * "her şey tarandı" diye okunurdu (CLAUDE.md §4 — kapsamı bounded eden karar
 * görünür olmalı).
 */
export function taramaPlani(
  satirlar: TaramaSatiri[],
  simdi: Date,
  tavan: number,
): { islemler: TaramaIslemi[]; atlanan: number } {
  const hepsi: TaramaIslemi[] = [];
  for (const s of satirlar) {
    const i = satirIslemi(s, simdi);
    if (i) hepsi.push(i);
  }
  return { islemler: hepsi.slice(0, tavan), atlanan: Math.max(0, hepsi.length - tavan) };
}

/** Hangi işlem mail gönderir — kuru koşu özeti ve sayımlar için. */
export function mailGonderirMi(i: TaramaIslemi): boolean {
  return i.tip !== 'iptal';
}

/** Online/fiziksel — route şablon seçerken kullanır. */
export { mekanOnlineMi };
