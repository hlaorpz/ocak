// Davet güvenlik ağı — geçmiş/dolu etkinlik davet linki nazikçe yönlendirilir.
// (Eyeball #4 Fix 2d, KARAR 219 deseni. Kayıt Tipi-agnostik: sadece
// "bu etkinlik geçmiş mi" sorusuna bakar — Direkt/Başvuru fark etmez.)
//
// Davet linki tüm 6 format sayfasına gelebilir; her override .astro sayfası
// bu helper'ı çağırıp banner conditional render eder.
import { notion } from './notion.ts';

/**
 * Etkinlik tarihi bugünden geçmişse true. Hata/eksik durumlarda false
 * (fail-safe: banner gösterme, davet edilen normal akışla içeriği görür).
 * Sadece davet linkiyle gelmiş kullanıcı için sorgu açılır — normal
 * ziyaretçide ekstra Notion call yok. Tarih değeri Notion "Tarih" date
 * property'sinden (`start` öncelikli; multi-day için `end` fallback).
 * Aynı gün hâlâ aktif sayılır — gün sonuna kadar yer var.
 */
export async function etkinlikGecmisMi(id: string): Promise<boolean> {
  if (!id) return false;
  try {
    const etk = await notion.pages.retrieve({ page_id: id });
    if (!('properties' in etk)) return false;
    const props = etk.properties as Record<string, unknown>;
    const tarih = (props['Tarih'] as { date?: { start?: string; end?: string } } | undefined)?.date;
    const tarihRaw = tarih?.start ?? tarih?.end;
    if (!tarihRaw) return false;
    const t = new Date(tarihRaw);
    if (Number.isNaN(t.getTime())) return false;
    const bugun = new Date();
    bugun.setHours(0, 0, 0, 0);
    return t.getTime() < bugun.getTime();
  } catch (err) {
    console.error(
      '[davet-guvenlik-agi] etkinlik retrieve hatası:',
      String(err).slice(0, 200),
    );
    return false;
  }
}
