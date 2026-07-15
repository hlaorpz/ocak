/**
 * format-etkinlik.ts — Etkinlik tarih/saat formatlama (Sohbet #22, Brief 5)
 *
 * SonrakiBulusma kartının meta satırı için. Deterministik çıktı: TR ay isimleri
 * sabit dizi (Intl.DateTimeFormat YOK — locale-bağımsız, ek import yok).
 *
 * #26 Brief H eki: /takvim için ay-ay grup helper'ları (bugundenSonra,
 * groupByMonth, formatAyEtiketi). Aynı AYLAR dizisi paylaşıldığı için
 * tek modülde — `etkinlikler-helpers.ts` ayrı bir dosya açmaktan kaçınıldı.
 */

const AYLAR = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık',
];

/** Bir helper'ın kabul ettiği minimum etkinlik shape'i — collection-agnostik.
 *  Çift-uçlu görünürlük penceresi (brief-kayit-penceresi-v2): kayitAcilis alt uç
 *  (>= dahil), kayitKapanis ?? tarihBaslangic üst uç (> strict, hariç). tarihBitis
 *  cutoff'ta REFERANS DEĞİL — sadece detay range gösterimi için (formatEtkinlikTarihi). */
interface TarihliEtkinlik {
  tarihBaslangic: string;
  tarihBitis?: string;
  kayitAcilis?: string;
  kayitKapanis?: string;
}

/**
 * Etkinlik `bugun` itibariyle görünürlük penceresinde mi?
 *
 * Alt uç (açılış): `kayitAcilis` boşsa koşul yok (hemen görünür). Doluysa
 *   `bugun >= kayitAcilis` (o gün DAHİL, `>=`).
 * Üst uç — kayitKapanis varlığına göre asimetri (brief-kapanis-asimetri-duzeltme):
 *   - VAR:  `kayitKapanis >= bugun` (kapanış günü DAHİL, son dakika kayıt için tam açık).
 *   - YOK:  `tarihBaslangic > bugun` (başlangıç günü HARİÇ, o gün 00:00 build'inde düşer).
 *   Ayrım kasıtlı: Kaan'ın kapanışa yazdığı tarih "son gün tam açık"; başlangıç
 *   fallback'inde ise etkinlik günü sabahı zaten yetişilemez → o gün düşer.
 *
 * Parse-fail → defansif göster (o uçtan eleme yapma; içerik hatası UI'da görünür).
 *
 * Ortak helper: bugundenSonra + filterDropdownEtkinlikleri + yaklasanUcretliler
 * üçü de bu fonksiyonu çağırır. Drift riskini kapatmak için tek kaynak.
 */
export function pencereIcinde(
  e: { tarihBaslangic: string; kayitAcilis?: string; kayitKapanis?: string },
  bugun: Date = new Date(),
): boolean {
  const sinir = new Date(bugun);
  sinir.setHours(0, 0, 0, 0);

  // Üst uç — kayitKapanis var/yok ayrımı (asimetrik).
  if (e.kayitKapanis) {
    const pk = parcala(e.kayitKapanis);
    if (pk) {
      const dk = new Date(pk.yil, pk.ayIdx, pk.gun);
      if (!(dk >= sinir)) return false;  // kapanış günü DAHİL (>=)
    }
    // parse fail → defansif, eleme yok.
  } else {
    const pb = parcala(e.tarihBaslangic);
    if (pb) {
      const db = new Date(pb.yil, pb.ayIdx, pb.gun);
      if (!(db > sinir)) return false;   // başlangıç günü HARİÇ (strict >)
    }
    // parse fail → defansif, eleme yok.
  }

  // Alt uç (açılış) — sadece doluysa; `>=`, açılış günü dahil.
  if (e.kayitAcilis) {
    const pa = parcala(e.kayitAcilis);
    if (pa) {
      const da = new Date(pa.yil, pa.ayIdx, pa.gun);
      if (!(sinir >= da)) return false;
    }
    // parse fail → defansif, alt uçtan eleme yapma.
  }

  return true;
}

/** ISO YYYY-MM-DD(...) → { gun, ayIdx, yil }; parse edilemezse null. */
function parcala(iso: string): { gun: number; ayIdx: number; yil: number } | null {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return null;
  return { yil: Number(m[1]), ayIdx: Number(m[2]) - 1, gun: Number(m[3]) };
}

/**
 * Etkinlik tarihini insan-okur stringe çevirir.
 *  - Tek gün, saatsiz:      "21 Haziran 2026"
 *  - Tek gün, saatli:       "21 Haziran 2026 · 19:00"
 *  - Range (aynı yıl):      "15 Eylül – 6 Ekim 2026"  (yıl yalnız ikinci tarihte)
 *  - Range (farklı yıl):    "15 Aralık 2026 – 6 Ocak 2027"
 *
 * saat: ilk HH:MM yakalanır ("Salı 20:00-21:30 (her hafta)" → "20:00"); yoksa
 * string olduğu gibi geçer. Range'lerde saat gösterilmez (çok-haftalık genelde tekrarlı).
 */
export function formatEtkinlikTarihi(baslangic: string, bitis?: string, saat?: string): string {
  const b = parcala(baslangic);
  if (!b) return baslangic ?? '';
  const ayB = AYLAR[b.ayIdx] ?? '';

  if (bitis && bitis !== baslangic) {
    const e = parcala(bitis);
    if (e) {
      const ayE = AYLAR[e.ayIdx] ?? '';
      return b.yil === e.yil
        ? `${b.gun} ${ayB} – ${e.gun} ${ayE} ${e.yil}`
        : `${b.gun} ${ayB} ${b.yil} – ${e.gun} ${ayE} ${e.yil}`;
    }
  }

  let s = `${b.gun} ${ayB} ${b.yil}`;
  if (saat) {
    const zaman = saat.match(/\d{1,2}:\d{2}/)?.[0] ?? saat.trim();
    if (zaman) s += ` · ${zaman}`;
  }
  return s;
}

/**
 * Bugün itibariyle görünürlük penceresinde olan etkinlikleri döndürür.
 * Çift-uçlu pencere: `kayitAcilis` (varsa, `>=`) alt uç, `kayitKapanis ?? tarihBaslangic`
 * (strict `>`) üst uç. Uzun range etkinlikte (Yolculuk) `tarihBitis` REFERANS DEĞİL;
 * başlangıç gününde düşer — "giremeyeceğin etkinlik takvimde durmasın" ilkesi (brief v2).
 * Parse edilemeyen tarih → defansif olarak göster (o uçtan eleme yapma).
 * @param bugun opsiyonel — test için sabit gün injekte edilir; default `new Date()`.
 */
export function bugundenSonra<T extends TarihliEtkinlik>(
  etkinlikler: T[],
  bugun: Date = new Date(),
): T[] {
  return etkinlikler.filter((e) => pencereIcinde(e, bugun));
}

/**
 * Etkinlikleri "YYYY-MM" key'iyle ay-ay gruplar (tarihBaslangic referans).
 * Map insertion order korunur — caller sıralı bir dizi geçirirse aylar da
 * kronolojik döner. Parse edilemeyen tarihler "bilinmeyen" key'ine düşer.
 */
export function groupByMonth<T extends TarihliEtkinlik>(etkinlikler: T[]): Map<string, T[]> {
  const gruplar = new Map<string, T[]>();
  for (const e of etkinlikler) {
    const p = parcala(e.tarihBaslangic);
    const key = p ? `${p.yil}-${String(p.ayIdx + 1).padStart(2, '0')}` : 'bilinmeyen';
    const mevcut = gruplar.get(key);
    if (mevcut) mevcut.push(e);
    else gruplar.set(key, [e]);
  }
  return gruplar;
}

/** "2026-06" → "Haziran 2026"; geçersiz key olduğu gibi döner. */
export function formatAyEtiketi(key: string): string {
  const m = key.match(/^(\d{4})-(\d{2})$/);
  if (!m) return key;
  const yil = Number(m[1]);
  const ayIdx = Number(m[2]) - 1;
  const ay = AYLAR[ayIdx];
  return ay ? `${ay} ${yil}` : key;
}

/**
 * /cember + /acik-kapi tarih dropdown'ları için filtre+sort (KARAR — Brief F.6).
 * tip eşleşen + durum∈{Kayıt Açık, Dolu} + görünürlük penceresinde (pencereIcinde)
 * entry'leri tarihBaslangic'e göre artan sıralı döner.
 *
 * Brief v2 (kayit-penceresi): cutoff mantığı `pencereIcinde` ortak helper'a taşındı;
 * bu helper artık çift-uçlu pencereyi (kayitAcilis ≤ bugün < (kayitKapanis ?? tarihBaslangic))
 * uygular. Notion'daki durum güncellemesi unutulursa kod güvenlik şeridi olur
 * (durum filtresi + tarih cutoff'u iki-hatlı).
 */
interface DropdownEntry {
  data: {
    tip: string;
    durum: string;
    tarihBaslangic: string;
    tarihBitis?: string;
    kayitAcilis?: string;
    kayitKapanis?: string;
  };
}

export function filterDropdownEtkinlikleri<T extends DropdownEntry>(
  entries: T[],
  tip: string,
  bugun: Date = new Date(),
): T[] {
  return entries
    .filter((e) => e.data.tip === tip)
    .filter((e) => e.data.durum === 'Kayıt Açık' || e.data.durum === 'Dolu')
    .filter((e) => pencereIcinde(e.data, bugun))
    .sort(
      (a, b) =>
        new Date(a.data.tarihBaslangic).getTime() -
        new Date(b.data.tarihBaslangic).getTime(),
    );
}

/**
 * KayitFormu "Bir kor daha taşı" bölümünde fikir verici referans listesi
 * için yaklaşan ücretli etkinlikler (Brief: brief-odeme-asama2-form-aski-ui.md).
 *
 * Filtre: `Statü == 'Kayıt Açık'` AND `Ücret > 0` AND görünürlük penceresinde
 * (`pencereIcinde` — brief v2 çift-uçlu). Sıralı (artan), ilk `limit` adet
 * (default 3). Etkinlik formatı/türü bağımsız — askı genel havuz, "şu programa
 * şu kadar" demez; sadece fiyat aralığı için bir his verir.
 */
interface YaklasanUcretliEntry {
  data: {
    durum: string;
    tarihBaslangic: string;
    tarihBitis?: string;
    kayitAcilis?: string;
    kayitKapanis?: string;
    ucret?: number;
  };
}

export function yaklasanUcretliler<T extends YaklasanUcretliEntry>(
  entries: T[],
  limit = 3,
  bugun: Date = new Date(),
): T[] {
  return entries
    .filter((e) => e.data.durum === 'Kayıt Açık' && (e.data.ucret ?? 0) > 0)
    .filter((e) => pencereIcinde(e.data, bugun))
    .sort(
      (a, b) =>
        new Date(a.data.tarihBaslangic).getTime() -
        new Date(b.data.tarihBaslangic).getTime(),
    )
    .slice(0, limit);
}
