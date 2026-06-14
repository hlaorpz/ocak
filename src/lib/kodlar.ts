/**
 * kodlar.ts — Notion Kodlar DB indirim kodu doğrulama helper'ı
 * (Brief: brief-odeme-asama1-kodlar.md — Aşama 1).
 *
 * Katman-agnostik: `kodDogrula(client, kod, format, tutar)` — tutar dışarıdan
 * gelir, helper "neye uygulanıyor" sormaz. Bugün tutar = etkinlik ücreti;
 * yarın askı/grup/vb. katmanlarla toplam değişirse çağıran yeni toplamı verir,
 * helper imzası değişmez.
 *
 * DB schema (Notion "Kodlar", 9+1 property):
 *  - Kod (title) — büyük harf disiplini, doğrulama upper-case normalize eder
 *  - İndirim Tipi (select: Yüzde / Sabit Tutar / Tam Burs)
 *  - İndirim Değeri (number)
 *  - Aktif (checkbox)
 *  - Kullanım Limiti (number, boş=sınırsız)
 *  - Kullanım Sayısı (number, başlangıç 0)
 *  - Son Geçerlilik (date, boş=süresiz)
 *  - Geçerli Formatlar (multi-select, boş=tüm formatlar) — whitelist
 *  - Hariç Formatlar (multi-select, boş=hariç yok) — blacklist (Kaan sapma,
 *    brief'te yok — tek koddan istisna tanımı için, örn. "İstanbul hariç tüm
 *    formatlar"). İkisi aynı anda kullanılabilir; bir format whitelist'te
 *    var ve blacklist'te değilse geçerli.
 *  - Not (rich_text) — Kaan'a not, koda bağlanmaz
 *
 * DI pattern: Notion client dışarıdan alınır (notion-etkinlikler.ts paraleli).
 * Test (`scripts/kodlar-test.mjs`) ve gelecek `/api/odeme` handler'ı kendi
 * client'ını kurup geçirir; bu modül notion.ts (import.meta.env) IMPORT ETMEZ.
 */

import type { Client } from '@notionhq/client';
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

export type KodTip = 'yuzde' | 'sabit' | 'tam-burs';

export type KodGecersiz =
  | 'bulunamadi'
  | 'pasif'
  | 'suresi-gecmis'
  | 'limit-doldu'
  | 'format-disi';

export type KodSonuc =
  | {
      gecerli: true;
      tip: KodTip;
      /** İndirim TL cinsinden (pozitif). Tam burs → tutar'a eşit. */
      indirimTutari: number;
      /** Ödenecek yeni tutar (TL). Negatif olamaz; 0 alt sınır. */
      yeniTutar: number;
      /** Notion page id — `kodKullanimArtir` için. */
      kodId: string;
    }
  | { gecerli: false; sebep: KodGecersiz };

/** Notion select option name → KodTip enum (Türkçe label'lar Notion'da). */
const TIP_MAP: Record<string, KodTip> = {
  'Yüzde': 'yuzde',
  'Sabit Tutar': 'sabit',
  'Tam Burs': 'tam-burs',
};

// ── Property okuyucular (notion-etkinlikler.ts paraleli, Node-safe) ──
// Not: rich_text okuyucu yok — Kod title'ı sorgu filter'ı ile eşlendiği için
// değerini okumamıza gerek kalmıyor. `Not` property'sine de kod bağlanmaz.

function selectName(props: Record<string, unknown>, name: string): string {
  const p = props[name] as { type?: string; select?: { name: string } | null } | undefined;
  if (p?.type === 'select') return p.select?.name ?? '';
  return '';
}

function multiSelectNames(props: Record<string, unknown>, name: string): string[] {
  const p = props[name] as { type?: string; multi_select?: Array<{ name: string }> } | undefined;
  if (p?.type !== 'multi_select') return [];
  return (p.multi_select ?? []).map((o) => o.name);
}

function checkboxVal(props: Record<string, unknown>, name: string): boolean {
  const p = props[name] as { type?: string; checkbox?: boolean } | undefined;
  return p?.type === 'checkbox' ? !!p.checkbox : false;
}

function numberVal(props: Record<string, unknown>, name: string): number | null {
  const p = props[name] as { type?: string; number?: number | null } | undefined;
  if (p?.type !== 'number') return null;
  return p.number ?? null;
}

function dateStart(props: Record<string, unknown>, name: string): string | null {
  const p = props[name] as { type?: string; date?: { start: string } | null } | undefined;
  if (p?.type !== 'date') return null;
  return p.date?.start ?? null;
}

/** Bugünün tarihi YYYY-MM-DD (TR saat dilimi farkı önemsiz — date-only karşılaştırma). */
function bugunIso(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Notion Kodlar DB'de `Kod` (title) ile eşleşen satırı bulur. Kod normalize:
 * `trim().toUpperCase()`. Notion `title.equals` filter case-sensitive — bu
 * yüzden Kaan kodları büyük harfle girer (disiplin DB-side).
 */
async function bul(
  client: Client,
  databaseId: string,
  kodNormalize: string,
): Promise<PageObjectResponse | null> {
  const res = await client.databases.query({
    database_id: databaseId,
    filter: { property: 'Kod', title: { equals: kodNormalize } },
    page_size: 1,
  });
  const row = res.results.find((r) => 'properties' in r);
  return (row as PageObjectResponse) ?? null;
}

/**
 * Bir indirim kodunu doğrula + indirimi hesapla. Yan etkisi YOK — sayaç
 * artırımı için ayrı `kodKullanimArtir` çağrılır (ödeme onaylandıktan sonra).
 *
 * @param tutar TL cinsinden pozitif tutar. Negatif/sıfır geçilirse caller'a
 *              kalmış (helper validation yapmaz; ödeme akışı 0 TL kod
 *              uygulamayacak şekilde önceden kontrol etmeli).
 */
export async function kodDogrula(
  client: Client,
  databaseId: string,
  kod: string,
  format: string,
  tutar: number,
): Promise<KodSonuc> {
  const kodNorm = kod.trim().toUpperCase();
  if (!kodNorm) return { gecerli: false, sebep: 'bulunamadi' };

  const row = await bul(client, databaseId, kodNorm);
  if (!row) return { gecerli: false, sebep: 'bulunamadi' };

  const props = row.properties as unknown as Record<string, unknown>;

  if (!checkboxVal(props, 'Aktif')) return { gecerli: false, sebep: 'pasif' };

  const sonGecerlilik = dateStart(props, 'Son Geçerlilik');
  if (sonGecerlilik && sonGecerlilik < bugunIso()) {
    return { gecerli: false, sebep: 'suresi-gecmis' };
  }

  const limit = numberVal(props, 'Kullanım Limiti');
  const sayac = numberVal(props, 'Kullanım Sayısı') ?? 0;
  if (limit !== null && sayac >= limit) {
    return { gecerli: false, sebep: 'limit-doldu' };
  }

  // Whitelist + Blacklist. Whitelist boş = tüm formatlar; doluysa format
  // listede olmalı. Blacklist boş = hariç yok; doluysa format listede olmamalı.
  const gecerliFormatlar = multiSelectNames(props, 'Geçerli Formatlar');
  if (gecerliFormatlar.length > 0 && !gecerliFormatlar.includes(format)) {
    return { gecerli: false, sebep: 'format-disi' };
  }
  const haricFormatlar = multiSelectNames(props, 'Hariç Formatlar');
  if (haricFormatlar.includes(format)) {
    return { gecerli: false, sebep: 'format-disi' };
  }

  const tipLabel = selectName(props, 'İndirim Tipi');
  const tip = TIP_MAP[tipLabel];
  if (!tip) return { gecerli: false, sebep: 'pasif' }; // tip seçilmemiş → defansif pasif

  const deger = numberVal(props, 'İndirim Değeri') ?? 0;
  let indirimTutari: number;
  if (tip === 'tam-burs') {
    indirimTutari = tutar;
  } else if (tip === 'yuzde') {
    indirimTutari = Math.round((tutar * deger) / 100);
  } else {
    indirimTutari = Math.min(deger, tutar);
  }
  if (indirimTutari < 0) indirimTutari = 0;
  const yeniTutar = Math.max(0, tutar - indirimTutari);

  return { gecerli: true, tip, indirimTutari, yeniTutar, kodId: row.id };
}

/**
 * `Kullanım Sayısı += 1`. Ödeme onaylandıktan SONRA (Aşama 3'te) çağrılır.
 * Aşama 1'de yalnızca yazılır + round-trip test edilir; gerçek bağlanma
 * sonraki aşamada.
 *
 * Notion concurrency: iki paralel ödeme aynı kodu kullanırsa son okuyan
 * eskik değeri görür → race. Lansman hacminde pratik kabul (Kaan kararı,
 * brief). İleride yoğunluk olursa Notion `last_edited_time` lock veya
 * counter'ı ayrı bir sayaç servisine çıkarmak gerekir.
 */
export async function kodKullanimArtir(
  client: Client,
  kodId: string,
): Promise<number> {
  const page = await client.pages.retrieve({ page_id: kodId });
  const props = ('properties' in page ? page.properties : {}) as unknown as Record<string, unknown>;
  const mevcut = numberVal(props, 'Kullanım Sayısı') ?? 0;
  const yeni = mevcut + 1;
  await client.pages.update({
    page_id: kodId,
    properties: {
      'Kullanım Sayısı': { number: yeni },
    },
  });
  return yeni;
}
