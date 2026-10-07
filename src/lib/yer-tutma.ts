/**
 * yer-tutma.ts — etkinlik başlangıç anı ve ödenmemiş kaydın yer tutma süresi.
 *
 * ── Neden an, neden metin değil ──
 * Repoda tarih/saat yardımcıları vardı ama hepsi **gösterim** içindi:
 * `formatEtkinlikTarihi` insan okur dize üretiyor, `trGun` gün damgası
 * veriyor. Hiçbiri **an** (`Date`) üretmiyordu. (Üçüncüsü `havaleVadeMetni`
 * gün farkı sayıyordu; 7 Eki'de kaldırıldı — süre artık `Yer Tutma
 * Bitişi`'nden geliyor ve bu dosya onu üretiyor.)
 * B211 ilk kez karşılaştırma yapıyor ("bitiş geçti mi", "etkinlik başladı mı"),
 * ve karşılaştırma dizeyle değil anla yapılır.
 *
 * ── TÜRKİYE SABİT +03:00 ──
 * Ölçüldü (7 Eki 2026): 2026 Ocak ve Temmuz'da offset ikisinde de +3. Türkiye
 * 2016'dan beri yaz saati uygulamıyor. Bu yüzden duvar saatinden ana geçiş
 * sabit bir offsetle yapılabiliyor ve `Intl`/DST matematiği gerekmiyor.
 *
 * Yine de offset TEK yerde sabit: ileride değişirse (ya da başka bir ülke
 * eklenirse) burada değişir. `Europe/Istanbul` dizesi de yanında duruyor ki
 * grep'le bulunabilsin.
 */

/** Türkiye saat dilimi — sabit +03:00, yaz saati yok (2016'dan beri). */
export const TR_OFFSET = '+03:00';
export const TR_TZ = 'Europe/Istanbul';

/**
 * Etkinlikler sayfasından başlangıç anı kurmak için gereken ham alanlar.
 * Hepsi `odeme-kayit-oku.ts`'in taşıdığı ham değerler.
 */
export type EtkinlikAniGirdi = {
  /** `Tarih` date.start — `2026-10-12` ya da `2026-11-21T17:00:00.000+03:00`. */
  tarihISO: string;
  /** `Mekân/Platform` select — saat alanının hangisi olduğunu bu belirler. */
  mekan: string;
  /** `Zoom Başlangıç Saati` rich_text — online'da otorite. Temiz `HH:MM`. */
  zoomSaat: string;
  /** `Saat` rich_text — fiziksel etkinlikte otorite. SERBEST METİN. */
  klasikSaat: string;
};

/**
 * Serbest metinden ilk `HH:MM`. Boş dönerse saat okunamadı.
 *
 * ⚠ `Saat` alanı canlı veride **her zaman saat değil.** Ölçülen üç biçim
 * (7 Eki 2026, 12 satır):
 *   `20:00`                      → temiz
 *   `21:00-22:00`                → aralık, başlangıç ilk eşleşme
 *   `İki cumartesi · 17:00-20:00` → düz metin + aralık
 * `formatEtkinlikTarihi` ve `api/zoom-olustur.ts:82` de aynı refleksi
 * kullanıyor: ilk eşleşmeyi al, gerisini yok say.
 */
function ilkSaat(metin: string): { saat: number; dakika: number } | null {
  const m = metin.match(/(\d{1,2}):(\d{2})/);
  if (!m) return null;
  const saat = Number(m[1]);
  const dakika = Number(m[2]);
  if (saat > 23 || dakika > 59) return null;
  return { saat, dakika };
}

/**
 * Etkinliğin başlangıç anı. Okuma sırası (Kaan kararı, 7 Eki):
 *
 *  1. `Tarih` zaten saat taşıyorsa **o otoritedir.** Notion offset'i de
 *     veriyor (`…T17:00:00.000+03:00`), yani an tam. Ölçümde satırların biri
 *     böyleydi; çoğu değil.
 *  2. Değilse gün `Tarih`ten, saat **mekâna bağlı** alandan: online →
 *     `Zoom Başlangıç Saati`, fiziksel → `Saat`. Cross-fallback YOK —
 *     `api/kayit.ts:191-198` o eşlemeyi canlı veriyle çürüttü: iki alan da
 *     doluyken Zoom saati fiziksel buluşmanın saatini eziyordu.
 *  3. Hiçbiri saat vermiyorsa **o günün 23:59'u** (Kaan kararı).
 *     Gün başı seçilseydi, etkinlik günü kayıt olan birinin yer tutma bitişi
 *     anında geçmiş olur ve ilk tarama onu iptal ederdi. Risk asimetrisi:
 *     ödeyecek bir kadının yerini erken iptal etmek, yeri birkaç saat fazla
 *     tutmaktan kötü.
 *
 * `Tarih` hiç yoksa `null` — an kurulamaz, çağıran karar verir.
 */
export function etkinlikBaslangicAni(g: EtkinlikAniGirdi): Date | null {
  const gun = (g.tarihISO ?? '').slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(gun)) return null;

  // (1) `Tarih` saat taşıyor mu — "T" + saat deseni. Notion offset'i ekliyor;
  // eklemiyorsa `Date` onu UTC sayardı, o yüzden offset'i biz tamamlıyoruz.
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(g.tarihISO)) {
    const tamOffset = /(Z|[+-]\d{2}:\d{2})$/.test(g.tarihISO);
    const an = new Date(tamOffset ? g.tarihISO : `${g.tarihISO}${TR_OFFSET}`);
    if (!Number.isNaN(an.getTime())) return an;
  }

  // (2) Mekâna bağlı saat alanı.
  const online = g.mekan === 'Online' || g.mekan === 'Zoom';
  const kaynak = online ? g.zoomSaat : g.klasikSaat;
  const hhmm = ilkSaat(kaynak ?? '');

  // (3) Saat okunamadı → gün sonu.
  const s = hhmm ? String(hhmm.saat).padStart(2, '0') : '23';
  const d = hhmm ? String(hhmm.dakika).padStart(2, '0') : '59';
  return new Date(`${gun}T${s}:${d}:00${TR_OFFSET}`);
}

/**
 * Yer tutma süreleri (Kaan kararları, 7 Eki). Saat cinsinden.
 *
 * Kart yolu neden bu kadar kısa: kart ödemesi anında yapılır. Üç saat,
 * "ekranı kapattım, akşam dönerim" için yeterli; bir günlük tutma ise
 * kontenjanı ödemeyecek birine kapatırdı.
 *
 * Havale yolu neden uzun: banka saatleri ve hafta sonu var.
 *
 * `YAKIN` eşiği: etkinliğe 72 saat ya da daha az kalmışsa süreler yarılanır.
 * Yakın bir buluşmada üç günlük yer tutma, kontenjanı buluşma geçene kadar
 * kilitlemek demekti.
 */
export const SURE = {
  kartSaat: 3,
  havaleSaat: 24,
  havaleEkSaat: 12,
  /** Etkinliğe ≤72 saat kalmışsa geçerli olan kısa süreler. */
  havaleYakinSaat: 12,
  havaleYakinEkSaat: 6,
  yakinEsikSaat: 72,
} as const;

const SAAT_MS = 3_600_000;

export type Yontem = 'kart' | 'havale';

/**
 * Kayıt anında etkinliğe ≤72 saat kalmış mı. Ek süre hesabı taramada, kayıt
 * anından saatler sonra yapılıyor — o yüzden eşiği **kayıt anına** göre
 * sormak gerekiyor, "şimdi"ye göre değil. Aksi hâlde aynı kayıt kayıt anında
 * uzak, tarama anında yakın sayılıp iki farklı kurala tabi olurdu.
 */
export function yakinMi(kayitAni: Date, etkinlikBaslangici: Date | null): boolean {
  if (!etkinlikBaslangici) return false;
  const kalan = etkinlikBaslangici.getTime() - kayitAni.getTime();
  return kalan <= SURE.yakinEsikSaat * SAAT_MS;
}

/**
 * `Yer Tutma Bitişi`. Ücretsiz kayıtta `null` — tutulacak bir süre yok, kayıt
 * hemen tamam.
 *
 * **Sınır:** hiçbir bitiş etkinlik başlangıcını aşamaz. Aşarsa başlangıca
 * kırpılır. Etkinlik başlangıcı bilinmiyorsa (Tarih boş) kırpma yapılmaz —
 * bilinmeyen bir sınıra karşı kırpmak, sınırı sıfır saymak olurdu.
 *
 * Başlangıç kayıt anından ÖNCEYSE (etkinlik geçmiş) sonuç kayıt anından önce
 * düşer; yani bitiş doğduğu anda geçmiştir ve ilk tarama kaydı
 * `Etkinlik başladı` nedeniyle iptal eder. Bu doğru: geçmiş bir etkinliğe
 * kayıt için yer tutmanın anlamı yok.
 */
export function yerTutmaBitisi(args: {
  yontem: Yontem;
  ucretliMi: boolean;
  kayitAni: Date;
  etkinlikBaslangici: Date | null;
}): Date | null {
  const { yontem, ucretliMi, kayitAni, etkinlikBaslangici } = args;
  if (!ucretliMi) return null;
  const yakin = yakinMi(kayitAni, etkinlikBaslangici);
  const saat =
    yontem === 'kart'
      ? SURE.kartSaat
      : yakin
        ? SURE.havaleYakinSaat
        : SURE.havaleSaat;
  return sinirla(new Date(kayitAni.getTime() + saat * SAAT_MS), etkinlikBaslangici);
}

/**
 * Havale ek süresi — tarama, bitişi geçmiş ve hatırlatması gitmemiş havale
 * kaydında bir kez uzatır.
 *
 * Uzatma **mevcut bitişten** değil **şimdiden** sayılır. Mevcut bitişten
 * sayılsaydı, tarama gecikmesi (n8n saatte bir koşuyorsa 59 dakikaya kadar)
 * ek sürenin içinden yenirdi ve maildeki "yeni son an" kadının eline geçtiği
 * anda zaten kısalmış olurdu.
 *
 * `yakin` kayıt anındaki ≤72 saat kuralının sonucudur; çağıran taşır.
 */
export function yerTutmaUzat(args: {
  simdi: Date;
  yakin: boolean;
  etkinlikBaslangici: Date | null;
}): Date {
  const saat = args.yakin ? SURE.havaleYakinEkSaat : SURE.havaleEkSaat;
  return sinirla(new Date(args.simdi.getTime() + saat * SAAT_MS), args.etkinlikBaslangici);
}

function sinirla(an: Date, etkinlikBaslangici: Date | null): Date {
  if (!etkinlikBaslangici) return an;
  return an.getTime() > etkinlikBaslangici.getTime() ? etkinlikBaslangici : an;
}

const TR_GUNLER = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
const TR_AYLAR = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık',
];

/**
 * `ODEME_SON_AN` biçimi — `8 Ekim Perşembe, 14:30 (Türkiye saati)`.
 * Biçim brief'te birebir verildi; "(Türkiye saati)" parantezi kadının başka
 * bir dilimde olabileceği için duruyor.
 *
 * Parçalar `Europe/Istanbul`'da okunur: `Date` UTC taşır, yerel okumak Vercel
 * sunucusunun dilimine (UTC) düşerdi ve 00:00-03:00 penceresinde günü bir
 * geriye kaydırırdı. Ders KARAR 385'te `havale-vade.ts`'de öğrenilmişti; o
 * dosya 7 Eki'de kaldırıldı ve dersi BURAYA taşındı — kaybolmadı.
 */
export function sonAnMetni(an: Date): string {
  const p = new Intl.DateTimeFormat('en-CA', {
    timeZone: TR_TZ,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', weekday: 'short',
    hour12: false,
  }).formatToParts(an);
  const al = (t: string) => p.find((x) => x.type === t)?.value ?? '';
  const gun = Number(al('day'));
  const ayIdx = Number(al('month')) - 1;
  // Hafta günü adını `Intl`in İngilizcesinden değil kendi tablomuzdan alıyoruz:
  // `tr` locale'i ortamdan ortama değişebiliyor (Node ICU derlemesi), tablo
  // değişmez.
  const hafta = TR_GUNLER[trHaftaGunu(an)];
  const saat = `${al('hour')}:${al('minute')}`;
  return `${gun} ${TR_AYLAR[ayIdx] ?? ''} ${hafta}, ${saat} (Türkiye saati)`;
}

/** TR takvimindeki hafta günü indeksi (0=Pazar). */
function trHaftaGunu(an: Date): number {
  const p = new Intl.DateTimeFormat('en-CA', { timeZone: TR_TZ, weekday: 'short' })
    .formatToParts(an)
    .find((x) => x.type === 'weekday')?.value ?? '';
  const sira: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return sira[p] ?? 0;
}

/** Notion `date` property'sine yazılacak ISO — saat dahil, offset'li. */
export function notionAnISO(an: Date): string {
  return an.toISOString();
}
