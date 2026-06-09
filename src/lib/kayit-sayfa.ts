// kayit-sayfa.ts — /[format]/kayit sayfalarının ortak veri yükleme helper'ı
// (Brief 3 KARAR 206). 6 route dosyası tek bir loadKayitData çağrısı + Hero
// + KayitFormu pattern'iyle kalır; veri/filter/env okuma bu modülde.
//
// Sunucu-only (getCollection astro:content + import.meta.env). Test edilebilir
// ama loader-bağımlı; smoke test build üzerinden yapılır.

import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import { filterDropdownEtkinlikleri, yaklasanUcretliler } from './format-etkinlik';
import { FORMAT_NOTION_FORMAT, type KayitFormat } from './kayit';

export type KayitSayfaData = {
  etkinlikler: CollectionEntry<'etkinlikler'>[];
  havaleIban: string;
  havaleAd: string;
  /**
   * "Bir kor daha taşı" askı bölümü için referans liste (Aşama 2 UI). Yaklaşan
   * ücretli etkinliklerin ilk 3'ü — fikir verici, fiyat listesi değil.
   * Format-bağımsız tüm Etkinlikler havuzundan (askı genel havuz, formattan
   * bağımsız). Boş olabilir → form bloğu hiç render olmaz.
   */
  askiReferanslari: CollectionEntry<'etkinlikler'>[];
};

// Aşama 3b-fix tasarım (ADIM 2) — kayitSorulari artık per-event runtime.
// Eskiden tek-set (ilk etkinliğin soruları) tüm tarih seçimlerine ortaktı;
// artık her `<option>` kendi `data-sorular` JSON'unu taşır, JS tarih
// değişince Niyet textarealarını yeniden render eder.
export async function loadKayitData(format: KayitFormat): Promise<KayitSayfaData> {
  const tum = await getCollection('etkinlikler');
  const notionFormat = FORMAT_NOTION_FORMAT[format];
  const etkinlikler = filterDropdownEtkinlikleri(tum, notionFormat);
  const askiReferanslari = yaklasanUcretliler(tum, 3);
  return {
    etkinlikler,
    havaleIban: import.meta.env.PUBLIC_HAVALE_IBAN ?? '',
    havaleAd: import.meta.env.PUBLIC_HAVALE_AD ?? '',
    askiReferanslari,
  };
}
