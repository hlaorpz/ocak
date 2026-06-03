// kayit-sayfa.ts — /[format]/kayit sayfalarının ortak veri yükleme helper'ı
// (Brief 3 KARAR 206). 6 route dosyası tek bir loadKayitData çağrısı + Hero
// + KayitFormu pattern'iyle kalır; veri/filter/env okuma bu modülde.
//
// Sunucu-only (getCollection astro:content + import.meta.env). Test edilebilir
// ama loader-bağımlı; smoke test build üzerinden yapılır.

import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import { filterDropdownEtkinlikleri } from './format-etkinlik';
import {
  FORMAT_NOTION_FORMAT,
  parseKayitSorulari,
  type KayitFormat,
} from './kayit';

export type KayitSayfaData = {
  etkinlikler: CollectionEntry<'etkinlikler'>[];
  /** Sıradaki etkinliğin Kayıt Soruları'ndan parse edilmiş soru dizisi (boş → []). */
  kayitSorulari: string[];
  havaleIban: string;
  havaleAd: string;
};

export async function loadKayitData(format: KayitFormat): Promise<KayitSayfaData> {
  const tum = await getCollection('etkinlikler');
  const notionFormat = FORMAT_NOTION_FORMAT[format];
  const etkinlikler = filterDropdownEtkinlikleri(tum, notionFormat);
  const ilk = etkinlikler[0];
  const kayitSorulari = parseKayitSorulari(ilk?.data.kayitSorulari);
  return {
    etkinlikler,
    kayitSorulari,
    havaleIban: import.meta.env.PUBLIC_HAVALE_IBAN ?? '',
    havaleAd: import.meta.env.PUBLIC_HAVALE_AD ?? '',
  };
}
