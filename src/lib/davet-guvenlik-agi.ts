// Davet güvenlik ağı — geçmiş/dolu etkinlik davet linki nazikçe yönlendirilir.
// (Eyeball #4 Fix 2d, KARAR 219 deseni. Kayıt Tipi-agnostik: sadece
// "bu etkinlik geçmiş mi" sorusuna bakar — Direkt/Başvuru fark etmez.)
//
// Davet linki tüm 6 format sayfasına gelebilir; her override .astro sayfası
// bu helper'ı çağırıp banner conditional render eder.
import { notion } from './notion.ts';
import { bugunTR } from './format-etkinlik.ts';

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
    // TR-yerel gün karşılaştırması (KARAR 385, B23). Eski `new Date()` +
    // `setHours(0,0,0,0)` server-yerel (Vercel UTC) çalışıyordu → TR 00:00-03:00
    // penceresinde bir gün geride kalıyordu. Notion date.start zaten YYYY-MM-DD
    // prefix'li; leksikografik karşılaştırma = kronolojik, Date matematiği yok.
    const gun = tarihRaw.slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(gun)) return false;
    return gun < bugunTR();
  } catch (err) {
    console.error(
      '[davet-guvenlik-agi] etkinlik retrieve hatası:',
      String(err).slice(0, 200),
    );
    return false;
  }
}
