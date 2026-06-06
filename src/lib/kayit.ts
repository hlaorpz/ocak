// kayit.ts — Ödemeli kayıt formları için yardımcı tipler + map'ler (Brief 2A).
//
// Frontend slug ↔ Notion Başvurular DB "Tip" enum + MailerLite grup ID
// köprüleri burada tek-kaynak. Brief 2B'de form component bu map'leri
// import edip slug→format çözümünde kullanır. Brief 2A'da sadece endpoint
// kullanır (form henüz yok).
//
// Notion enum sapmaları:
// - Etkinlikler DB "Format" select: "Mevsim Seremonisi", "İstanbul Akşamı" (uzun)
// - Başvurular DB "Tip" select: "Seremoni", "İstanbul" (kısa) — bu map kısa olan
//   Tip enum'unu hedefler.

export type KayitFormat =
  | 'cember'
  | 'acik-kapi'
  | 'mini-retreat'
  | 'istanbul'
  | 'seremoni'
  | 'workshop';

// Slug → Notion Başvurular DB "Tip" select option name (kısa varyant).
export const FORMAT_TIP: Record<KayitFormat, string> = {
  cember: 'Çember',
  'acik-kapi': 'Açık Kapı',
  'mini-retreat': 'Mini Retreat',
  istanbul: 'İstanbul',
  seremoni: 'Seremoni',
  workshop: 'Workshop',
};

// Slug → Notion Etkinlikler DB "Format" select option name (UZUN varyant).
// İstanbul + Seremoni'de Başvurular Tip'inden farklı: orada "İstanbul/Seremoni"
// kısaltma, burada "İstanbul Akşamı/Mevsim Seremonisi" uzun. Etkinlikler
// dropdown filtresi bu uzun ismi kullanır.
export const FORMAT_NOTION_FORMAT: Record<KayitFormat, string> = {
  cember: 'Çember',
  'acik-kapi': 'Açık Kapı',
  'mini-retreat': 'Mini Retreat',
  istanbul: 'İstanbul Akşamı',
  seremoni: 'Mevsim Seremonisi',
  workshop: 'Workshop',
};

/**
 * Aşama 2.5 — Kademeli dayanışma fiyatı (sliding scale). Etkinlikler DB tek
 * `Ücret` taşır (orta/tam fiyat); 3 kademe koddan türetilir:
 *  - Üst (Ateşi büyüten) = Ücret × 1.5
 *  - Orta (Ateşin başındaki) = Ücret × 1.0   ← default seçili
 *  - Alt (Ateşe yaklaşan) = Ücret × 0.75
 *
 * Oranlar tek yerde — ileride ayarlanabilir. Yuvarlama en yakın tam TL.
 * Brief: brief-odeme-asama2.5-kademe-akis.md.
 */
export type Kademe = 'ust' | 'orta' | 'alt';

export const KADEME_ORANLARI: Record<Kademe, number> = {
  ust: 1.5,
  orta: 1.0,
  alt: 0.75,
};

export function kademeTutari(ucret: number, kademe: Kademe): number {
  const oran = KADEME_ORANLARI[kademe];
  return Math.round(Math.max(0, ucret) * oran);
}

// Kapı 1 — direkt kayıt formatları (değerlendirme yok). /api/kayit bunların
// kaydını YALNIZ Kayıtlar DB'ye yazar (Aşama 1.5, brief-odeme-asama15).
// Kapı 2 — başvuru/onay (cember + ayrı pipeline'daki anadolu): mevcut akış,
// Başvurular'a yazılır, oradan Kaan onayı + automation ile Kayıtlar'a düşer
// (Aşama 1.6 köprüsü, bu pakette DEĞİL).
export const KAPI1_FORMATLAR: readonly KayitFormat[] = [
  'acik-kapi',
  'workshop',
  'mini-retreat',
  'istanbul',
  'seremoni',
] as const;

export function isKapi1(format: KayitFormat): boolean {
  return (KAPI1_FORMATLAR as readonly string[]).includes(format);
}

// Slug → MailerLite grup ID. Brief 3 (KARAR 206): 6 formatın hepsi map'lendi.
// null fallback artık yok — eksik grup compile-time kırar.
export const FORMAT_MAILERLITE_GROUP: Record<KayitFormat, string> = {
  cember: '187798293576681151',
  'acik-kapi': '187372390149261252',
  'mini-retreat': '189209166869431831',
  istanbul: '189209188425008761',
  seremoni: '189209224470857710',
  workshop: '189209178380699119',
};

export function isKayitFormat(s: unknown): s is KayitFormat {
  return typeof s === 'string' && s in FORMAT_TIP;
}

/**
 * Notion "Kayıt Soruları" rich_text plain_text'ini soru dizisine çevirir.
 * Sorular Notion'da Shift+Enter ile yazılır → tek rich_text içinde \n ayraçlı.
 * Boş satırları atar. Boş input → [].
 */
export function parseKayitSorulari(raw: string | undefined | null): string[] {
  if (!raw) return [];
  return raw
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Brief 6 (KARAR 210): Kayıt için benzersiz referans no üretir.
 * Format: `OCAK-XXXXX` (5 haneli rakam, 10000–99999, 90.000 ihtimal).
 * Çakışma kontrolü YOK — düşük hacim, pratik kabul (Kaan kararı).
 *
 * Üretim anında /api/kayit Notion Başvurular DB'ye yazar; success ekranı
 * havale açıklamasında "{referansNo} — {ad}" formatında gösterir.
 * Ödemesiz/Muaf kayıtlarda da Notion'a yazılır (zararsız, izleme için
 * faydalı) ama success ekranında gizlenir (ödeme bloğu yoksa gereksiz).
 */
export function uretReferansNo(): string {
  // 10000–99999 inclusive — Math.random() [0,1) * 90000 → [0, 89999] + 10000.
  const sayi = Math.floor(Math.random() * 90000) + 10000;
  return `OCAK-${sayi}`;
}

/**
 * Brief 5 Yol C: Notion Etkinlikler DB "Mekân/Platform" select değerini
 * katılım tipine eşler. 'Online' → 'link' (Zoom URL); diğer (İzmir/İstanbul/
 * Ege/Anadolu) → 'adres'. Boş / bilinmeyen → 'link' default (lansman
 * etkinlikleri 6/6 Online, defansif fallback online tarafa düşsün).
 */
export function katilimTipiCoz(mekan: string | undefined | null): 'link' | 'adres' {
  if (!mekan || mekan === 'Online') return 'link';
  return 'adres';
}

/**
 * Brief Katman 2: MailerLite custom field payload'u — online vs fiziksel
 * ayrımlı. Daima yazılan: `etkinlik_adi`, opsiyonel `etkinlik_tarihi` /
 * `etkinlik_saati`. Online (link) etkinlikte `zoom_link` + `katilim_linki`
 * (C-1 geriye uyum) + `zoom_sifresi`; fiziksel etkinlikte `etkinlik_mekan`
 * + `etkinlik_adres`. Boş/whitespace değerler payload'a hiç girmez
 * (otomasyon tarafında `{$x}` boş basmasın diye field'ı göndermeyiz).
 */
export type MailerLiteFieldGirdi = {
  etkinlikAdi: string;
  etkinlikTarihi?: string | null;
  etkinlikSaati?: string | null;
  katilimTipi: 'link' | 'adres';
  /** Online ise Zoom join URL (Notion Katılım Linki). */
  katilimLinki?: string | null;
  /** Online ise Zoom meeting password (Notion Zoom Şifresi). */
  zoomSifresi?: string | null;
  /** Fiziksel ise Mekân/Platform select değeri (örn. "İstanbul"). */
  mekan?: string | null;
  /** Fiziksel ise adres detayı (Notion Konum Detay). */
  mekanAdres?: string | null;
};

export function mailerLiteCustomFields(g: MailerLiteFieldGirdi): Record<string, string> {
  const fields: Record<string, string> = { etkinlik_adi: g.etkinlikAdi };
  const ekle = (k: string, v: string | undefined | null) => {
    if (v && v.trim()) fields[k] = v.trim();
  };
  ekle('etkinlik_tarihi', g.etkinlikTarihi);
  ekle('etkinlik_saati', g.etkinlikSaati);
  if (g.katilimTipi === 'link') {
    // C-1 geriye uyum: katilim_linki mevcut şablonu kırmasın diye korunur.
    ekle('katilim_linki', g.katilimLinki);
    ekle('zoom_link', g.katilimLinki);
    ekle('zoom_sifresi', g.zoomSifresi);
  } else {
    ekle('etkinlik_mekan', g.mekan);
    ekle('etkinlik_adres', g.mekanAdres);
  }
  return fields;
}

/**
 * Notion date ISO ("2026-06-21" veya "2026-06-21T18:00:00.000+03:00") →
 * Türkçe "21 Haziran 2026". Parse edilemezse input'u aynen döner (defansif).
 * MailerLite `etkinlik_tarihi` custom field'ı için welcome şablonunda
 * doğrudan basılır.
 */
export function tarihTrFormat(iso: string | undefined | null): string {
  if (!iso) return '';
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return iso;
  const aylar = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık',
  ];
  const gun = Number(m[3]);
  const ayIdx = Number(m[2]) - 1;
  if (ayIdx < 0 || ayIdx > 11) return iso;
  return `${gun} ${aylar[ayIdx]} ${m[1]}`;
}

/**
 * Brief 5 Yol C: MailerLite custom field `etkinlik_adi` için insan-okur
 * formatlanmış etkinlik adı. Format Tip (kısa) + seçilen tarih birleşimi
 * (örn. "Çember — 21 Haziran 2026"). seciliTarih boşsa sadece Tip.
 *
 * Plan örneği birebir: KayitFormat slug'ından FORMAT_TIP[format] alınır;
 * uzun varyant FORMAT_NOTION_FORMAT (Etkinlikler DB "Format") değil —
 * MailerLite şablonunda kısa daha doğal.
 */
export function etkinlikAdiFormatla(
  format: KayitFormat,
  seciliTarih: string | undefined | null,
): string {
  const tip = FORMAT_TIP[format];
  const tarih = seciliTarih?.trim();
  return tarih ? `${tip} — ${tarih}` : tip;
}

/**
 * Aşama 3a — promo + iki katman tutar hesabı (tek otorite, backend+frontend
 * paylaşır). Brief: brief-odeme-asama3a-promo-aski-backend.md.
 *
 * Kurallar:
 *  - Kod yok / geçersiz → toplam = A + B, indirim = 0.
 *  - tip='yuzde' veya 'sabit' → indirim (A+B)'ye uygulanır;
 *    toplam = max(0, A+B − indirim). Helper `kodDogrula` zaten A+B üzerinden
 *    hesapladıysa indirimTutari doğrudan kullanılır.
 *  - tip='tam-burs' → sadece A sıfırlanır, B aynen kalır;
 *    indirim = A, toplam = B. (Helper bu durumda yeniTutar=0 döner çünkü
 *    A+B'yi sıfırlar — burada B'yi geri ekliyoruz; brief açık karar.)
 *
 * Dönüş `katmanA`/`katmanB`: indirimden SONRAKİ değerler (tam-burs'da A=0).
 * Frontend canlı tutar bloğunda satır-bazlı gösterim için ayrı tutuluyor;
 * `toplam` zaten katmanA + katmanB.
 */
import type { KodSonuc } from './kodlar';

export type IndirimSonuc = {
  /** İndirim sonrası katman A (tam-burs'da 0). */
  katmanA: number;
  /** Katman B — tam-burs'da değişmez, yuzde/sabit'te değişmez (indirim toplama uygulanır). */
  katmanB: number;
  /** Toplam indirim TL. Promo yoksa/geçersizse 0. */
  indirim: number;
  /** Ödenecek toplam TL = katmanA + katmanB (yuzde/sabit'te = max(0, A+B−indirim); tam-burs'ta = B). */
  toplam: number;
};

export function uygulaIndirim(
  katmanA: number,
  katmanB: number,
  kod: KodSonuc | null,
): IndirimSonuc {
  const aBT = Math.max(0, katmanA) + Math.max(0, katmanB);
  if (!kod || !kod.gecerli) {
    return { katmanA, katmanB, indirim: 0, toplam: aBT };
  }
  if (kod.tip === 'tam-burs') {
    // Sadece A sıfırlanır, B kalır. (Brief açık: helper A+B'yi sıfırlasa da
    // bizim niyetimiz tam-burs SADECE etkinlik ücretini karşılar.)
    return { katmanA: 0, katmanB, indirim: katmanA, toplam: katmanB };
  }
  // yuzde / sabit — indirim A+B üzerinde uygulanır.
  const indirim = Math.min(Math.max(0, kod.indirimTutari), aBT);
  const toplam = Math.max(0, aBT - indirim);
  return { katmanA, katmanB, indirim, toplam };
}

/**
 * kayit-cta section'ı için post-render href çözümü (Brief 4 KARAR 207).
 *
 * Plugin (remark-ocak-sections.ts transformKayitCta) buton href'ini
 * `__KAYIT_CTA_HREF__` placeholder olarak emit eder; plugin global instance
 * sayfa slug'ını bilmediği için. Bu helper loader (notion-pages.ts) içinde
 * her sayfanın HTML'i render edildikten sonra çağrılır.
 *
 * Davranış (Adım 0 karar A — sessiz atla + warn):
 *  - Slug 6 KayitFormat'tan biri → placeholder `/${slug}/kayit` ile değiştirilir.
 *  - Slug 6 format dışı (örn. '/hikaye', '/biz', '/') →
 *    `<section data-section="kayit-cta">...</section>` tüm bloğu (üst metin
 *    dahil) regex ile kaldırılır + tek console.warn yazılır (build log'da
 *    görünür kalır, sayfa boş render edilir).
 *
 * Slug input formatları: '/cember', 'cember', '/cember/' hepsi tolere
 * edilir; defansif normalize.
 */
export function resolveKayitCtaHref(html: string, rawSlug: string): string {
  if (!html.includes('data-section="kayit-cta"')) return html;
  const slug = rawSlug.replace(/^\/+|\/+$/g, '');
  if (isKayitFormat(slug)) {
    return html.replaceAll('__KAYIT_CTA_HREF__', `/${slug}/kayit`);
  }
  // 6 format dışı → tüm kayit-cta bloğunu kaldır (üst metin dahil) + warn.
  // eslint-disable-next-line no-console
  console.warn(
    `[kayit-cta] /${slug || ''}: 6 format dışı sayfa — section render edilmedi (Brief 4 / KARAR 207).`,
  );
  return html.replace(
    /<section\s+data-section="kayit-cta"[\s\S]*?<\/section>/g,
    '',
  );
}
