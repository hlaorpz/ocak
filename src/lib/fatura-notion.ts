/**
 * fatura-notion.ts — Notion Kayıtlar/Etkinlikler property'leri ↔ fatura akışı.
 *
 * Ağa çıkmaz: sayfanın `properties` nesnesini alır, `FaturaSatiri` döner;
 * yazılacak alanları Notion property biçiminde kurar. Alan ADLARI tek yerde,
 * burada (Notion'da 30 Eki 2026'da açıldı — Claude, Kaan'ın talimatıyla).
 */
import type { FaturaSatiri } from './fatura.ts';

export const ALAN = {
  faturaNo: 'Fatura No',
  faturaEttn: 'Fatura ETTN',
  faturaTarihi: 'Fatura Tarihi',
  faturaMailiGitti: 'Fatura Maili Gitti',
  faturaHatasi: 'Fatura Hatası',
  /** Havalenin kanıtı — VakıfBank hareketinin işlem numarası. Eşleştirici yazar (bugün Kaan elle). */
  bankaIslemNo: 'Banka İşlem No',
} as const;

// biome-ignore lint: Notion property ağacı tipsiz
type Ozellikler = Record<string, any>;

const metin = (p: Ozellikler, ad: string): string => {
  const alan = p[ad];
  const parcalar = alan?.rich_text ?? alan?.title ?? [];
  return (parcalar as { plain_text?: string }[]).map((t) => t.plain_text ?? '').join('').trim();
};
const sayi = (p: Ozellikler, ad: string): number | null => {
  const n = p[ad]?.number;
  return typeof n === 'number' && Number.isFinite(n) ? n : null;
};

export type EtkinlikOzeti = { tarih: string; bitis: string; formatHam: string };

/** Etkinlikler sayfasından faturanın ihtiyacı olan üç şey. */
export function etkinlikOzetiOku(p: Ozellikler): EtkinlikOzeti {
  return {
    tarih: p['Tarih']?.date?.start ?? '',
    bitis: p['Tarih']?.date?.end ?? '',
    formatHam: p['Format']?.select?.name ?? '',
  };
}

/** Kayıtlar relation'ındaki etkinlik id'leri. */
export function etkinlikIdleri(p: Ozellikler): string[] {
  return ((p['Etkinlikler']?.relation ?? []) as { id?: string }[]).map((r) => r.id ?? '').filter(Boolean);
}

export function faturaSatiriOku(pageId: string, p: Ozellikler, etkinlik: EtkinlikOzeti | null): FaturaSatiri {
  return {
    pageId,
    kayitId: metin(p, 'Kayıt ID'),
    tip: p['Tip']?.select?.name ?? '',
    odemeDurumu: p['Ödeme Durumu']?.select?.name ?? '',
    odemeYontemi: p['Ödeme Yöntemi']?.select?.name ?? '',
    islemNo: metin(p, 'İşlem No'),
    bankaIslemNo: metin(p, ALAN.bankaIslemNo),
    odemeTarihi: p['Ödeme Tarihi']?.date?.start ?? '',
    odenenTutar: sayi(p, 'Ödenen Tutar'),
    beklenenTutar: sayi(p, 'Beklenen Tutar'),
    faturaNo: metin(p, ALAN.faturaNo),
    faturaHatasi: metin(p, ALAN.faturaHatasi),
    faturaMailiGitti: p[ALAN.faturaMailiGitti]?.checkbox === true,
    etkinlikSayisi: etkinlikIdleri(p).length,
    etkinlikTarihi: etkinlik?.tarih ?? '',
    etkinlikBitis: etkinlik?.bitis ?? '',
    formatHam: etkinlik?.formatHam ?? '',
    kadin: metin(p, 'Kadın'),
    sehir: metin(p, 'Şehir'),
    email: (p['Email']?.email ?? '').trim(),
  };
}

/** Kesilmiş faturanın ETTN'si — yalnız mail tekrarında gerekir. */
export function faturaEttnOku(p: Ozellikler): string {
  return metin(p, ALAN.faturaEttn);
}

const rt = (s: string) => ({ rich_text: [{ type: 'text' as const, text: { content: s.slice(0, 2000) } }] });

/** Fatura kesildi — İLK yazım. Mail bundan SONRA denenir. */
export function faturaKesildiYazimi(numara: string, ettn: string, gun: string) {
  return {
    [ALAN.faturaNo]: rt(numara),
    [ALAN.faturaEttn]: rt(ettn),
    [ALAN.faturaTarihi]: { date: { start: gun } },
  };
}

export function faturaHatasiYazimi(hata: string, gun: string) {
  return { [ALAN.faturaHatasi]: rt(`${gun} · ${hata}`) };
}

export function faturaMailiGittiYazimi() {
  return { [ALAN.faturaMailiGitti]: { checkbox: true } };
}
