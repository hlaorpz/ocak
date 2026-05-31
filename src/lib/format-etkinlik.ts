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

/** Bir helper'ın kabul ettiği minimum etkinlik shape'i — collection-agnostik. */
interface TarihliEtkinlik {
  tarihBaslangic: string;
  tarihBitis?: string;
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
 * Bugün veya sonrasında gerçekleşecek etkinlikleri döndürür.
 * Range etkinliklerde `tarihBitis` öncelikli (15 Eylül - 6 Ekim aralığında bugün
 * 1 Ekim ise hâlâ aktif, gizlenmez). Tek günlüklerde `tarihBaslangic` referans.
 * Parse edilemeyen tarih → defansif olarak göster (içerik hatası UI'da görünür).
 * @param bugun opsiyonel — test için sabit gün injekte edilir; default `new Date()`.
 */
export function bugundenSonra<T extends TarihliEtkinlik>(
  etkinlikler: T[],
  bugun: Date = new Date(),
): T[] {
  const sinir = new Date(bugun);
  sinir.setHours(0, 0, 0, 0);
  return etkinlikler.filter((e) => {
    const referans = e.tarihBitis ?? e.tarihBaslangic;
    const p = parcala(referans);
    if (!p) return true; // parse fail → defansif göster
    const d = new Date(p.yil, p.ayIdx, p.gun);
    return d >= sinir;
  });
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
 * tip eşleşen + durum∈{Kayıt Açık, Dolu} entry'leri tarihBaslangic'e göre artan sıralı döner.
 * Durum filtresi defansif: loader zaten `AKTIF_DURUM` yapıyor ama component bağımsız
 * çalışsın diye burada da uygulanır (loader değişimine karşı koruma).
 */
interface DropdownEntry {
  data: { tip: string; durum: string; tarihBaslangic: string };
}

export function filterDropdownEtkinlikleri<T extends DropdownEntry>(
  entries: T[],
  tip: string,
): T[] {
  return entries
    .filter((e) => e.data.tip === tip)
    .filter((e) => e.data.durum === 'Kayıt Açık' || e.data.durum === 'Dolu')
    .sort(
      (a, b) =>
        new Date(a.data.tarihBaslangic).getTime() -
        new Date(b.data.tarihBaslangic).getTime(),
    );
}
