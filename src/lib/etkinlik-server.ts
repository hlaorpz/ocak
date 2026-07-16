// etkinlik-server.ts — astro:content bağımlı, server-only etkinlik yardımcıları.
// etkinlik-kategori.ts client bundle'a (EtkinlikTakvimi <script>) giriyor;
// server-only fonksiyonlar burada ayrı yaşar.

import { getCollection } from 'astro:content';
import { bugundenSonra } from './format-etkinlik';
import {
  filterEtkinliklerByKategori,
  type EtkinlikKategori,
} from './etkinlik-kategori';

/**
 * Verili kategori için yaklaşan (bugünden sonra) aktif etkinlik var mı?
 * KayitCTA form-agnostik boşa-davet gate'i — kategori boşsa CTA'yı gizle.
 * SonrakiBulusma'nın "bos" mantığıyla birebir aynı disiplin: AKTIF_DURUM ∈
 * {Kayıt Açık, Dolu} ∩ bugündenSonra ∩ filterEtkinliklerByKategori.
 */
export async function kategoriEtkinlikVarMi(kategori: EtkinlikKategori): Promise<boolean> {
  const AKTIF_DURUM = new Set(['Kayıt Açık', 'Dolu']);
  const tumu = (await getCollection('etkinlikler'))
    .map((e) => e.data)
    .filter((e) => AKTIF_DURUM.has(e.durum));
  const gelecekler = bugundenSonra(tumu);
  return filterEtkinliklerByKategori(gelecekler, kategori).length > 0;
}
