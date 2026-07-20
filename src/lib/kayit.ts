// kayit.ts — Ödemeli kayıt formları için yardımcı tipler + map'ler (Brief 2A).
//
// Frontend slug ↔ Notion Başvurular DB "Tip" enum + MailerLite grup ID
// köprüleri burada tek-kaynak. Brief 2B'de form component bu map'leri
// import edip slug→format çözümünde kullanır. Brief 2A'da sadece endpoint
// kullanır (form henüz yok).
//
// Notion enum: Başvurular DB "Tip" + Etkinlikler DB "Format" AYNI değeri taşır
// (slug rename brief S2 kararı — 2026-07-03: kısa/uzun ayrımı silindi). İki
// harita ayrı call-site'lar için tutulur ama değerler eşitlenmiştir.

export type KayitFormat =
  | 'cember'
  | 'acik-kapi'
  | 'mini-retreat'
  | 'sehir-aksami'
  | 'seremoni'
  | 'atolye'
  | 'yolculuk';

// Slug → Notion Başvurular DB "Tip" select option name.
export const FORMAT_TIP: Record<KayitFormat, string> = {
  cember: 'Çember',
  'acik-kapi': 'Açık Kapı',
  'mini-retreat': 'Mini Retreat',
  'sehir-aksami': 'Şehir Akşamı',
  seremoni: 'Seremoni',
  atolye: 'Atölye',
  yolculuk: 'Yolculuk',
};

// Slug → Notion Etkinlikler DB "Format" select option name.
// S2 sonrası FORMAT_TIP ile aynı değeri döndürür; iki harita ayrı call-site'lar
// için tutulur (etkinlikler dropdown filtresi + başvurular Tip yazımı).
export const FORMAT_NOTION_FORMAT: Record<KayitFormat, string> = {
  cember: 'Çember',
  'acik-kapi': 'Açık Kapı',
  'mini-retreat': 'Mini Retreat',
  'sehir-aksami': 'Şehir Akşamı',
  seremoni: 'Seremoni',
  atolye: 'Atölye',
  yolculuk: 'Yolculuk',
};

/**
 * Slug → kayit-cta buton metni (brief-baslik-dil-cizgi-takvim İş 2 geri-alım
 * KARAR 307 orijinaline). Direkt formatlar (Kapı 1) → 'Yerini ayır'; Başvuru
 * formatı (mini retreat, Kapı 2) → 'Başvur' — başvuruda yer AYRILMIYOR, iki
 * fiil ayrı. Hem `KayitCTA.astro` (form-anchor wiring) hem remark plugin
 * `transformKayitCta` (## section: kayit-cta marker) bu haritayı okur.
 */
export const KAYIT_CTA_LABEL: Record<KayitFormat, string> = {
  cember: 'Yerini ayır',
  'acik-kapi': 'Yerini ayır',
  'mini-retreat': 'Başvur',
  'sehir-aksami': 'Yerini ayır',
  seremoni: 'Yerini ayır',
  atolye: 'Yerini ayır',
  yolculuk: 'Yerini ayır',
};

/**
 * Dayanışma ön-izleme satırı — 7 format sayfasının kayit-cta bloğunda
 * butonun üstünde. /anadolu KayitCTA çağırmaz (form-anchor-registry'de yok),
 * dolayısıyla oraya sızmaz — Anadolu'da rakam görüşmede konuşuluyor, kademe
 * dili girmez.
 */
export const DAYANISMA_METNI =
  'Katılım payı kademeli — hangi kademeyi seçeceğine sen karar verirsin.';

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
  // Aşama 3b-fix tasarım (KARAR 61/88 kırpma yasağı): kuruş korunur. Float
  // hatalarını engellemek için ×100/100. Önceki Math.round → 225×0.75=169
  // (kuruş kayboluyordu); yeni: 168.75. Gösterim `formatTutarTr` ile.
  return Math.round(Math.max(0, ucret) * oran * 100) / 100;
}

/**
 * Aşama 3b-fix tasarım — tutar gösterimi TR locale + iki ondalık:
 * 168.75 → "168,75". KARAR 61/88: kuruş ekranda görünür, gizli kırpma yok.
 * Tek otorite — frontend canlı tutar bloğu + backend response gösterimi
 * paylaşır.
 */
export function formatTutarTr(tutar: number): string {
  return tutar.toLocaleString('tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// Kapı 1 — direkt kayıt formatları (değerlendirme yok). /api/kayit bunların
// kaydını YALNIZ Kayıtlar DB'ye yazar (Aşama 1.5, brief-odeme-asama15).
// Kapı 2 — başvuru/onay (cember + ayrı pipeline'daki anadolu): mevcut akış,
// Başvurular'a yazılır, oradan Kaan onayı + automation ile Kayıtlar'a düşer
// (Aşama 1.6 köprüsü, bu pakette DEĞİL).
//
// DEPRECATED (Aşama 3b-fix): otorite artık etkinlik bazlı `Kayıt Tipi`
// (Notion Etkinlikler select). `isDirekt(kayitTipi)` kullan. `isKapi1` ve
// `KAPI1_FORMATLAR` legacy testler / fallback için tutuluyor; yeni kod
// `etk.kayitTipi === 'Direkt'` dallanmasına bakar.
export const KAPI1_FORMATLAR: readonly KayitFormat[] = [
  'acik-kapi',
  'atolye',
  'mini-retreat',
  'sehir-aksami',
  'seremoni',
] as const;

export function isKapi1(format: KayitFormat): boolean {
  return (KAPI1_FORMATLAR as readonly string[]).includes(format);
}

/**
 * Aşama 3b-fix — Kayıt Tipi dallanması. Notion Etkinlikler `Kayıt Tipi`
 * select [Başvuru | Direkt]. `Direkt` → mevcut Kapı 1 akışı (kademe +
 * askı + promo + kart/havale + checkout + Kayıtlar). `Başvuru` → sade
 * form + Başvurular DB (ödeme yok, Zoom + mail tetiklenmez).
 */
export type KayitTipi = 'Direkt' | 'Başvuru';

export function isDirekt(kayitTipi: KayitTipi | string | undefined): boolean {
  return kayitTipi === 'Direkt';
}

// Slug → MailerLite grup ID. Brief 3 (KARAR 206): 6 formatın hepsi map'lendi.
// null fallback artık yok — eksik grup compile-time kırar.
export const FORMAT_MAILERLITE_GROUP: Record<KayitFormat, string> = {
  cember: '187798293576681151',
  'acik-kapi': '187372390149261252',
  'mini-retreat': '189209166869431831',
  'sehir-aksami': '189209188425008761',
  seremoni: '189209224470857710',
  atolye: '189209178380699119',
  yolculuk: '192780641731871836',
};

export function isKayitFormat(s: unknown): s is KayitFormat {
  return typeof s === 'string' && s in FORMAT_TIP;
}

/**
 * Notion rich_text plain_text'ini satır dizisine çevirir.
 * Satırlar Notion'da Shift+Enter ile yazılır → tek rich_text içinde \n ayraçlı.
 * Boş satırları atar. Boş input → [].
 */
export function parseRichTextLines(raw: string | undefined | null): string[] {
  if (!raw) return [];
  return raw
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Kayıt niyet soruları. Geriye uyumlu isim — parseRichTextLines'a delege. */
export const parseKayitSorulari = parseRichTextLines;

/**
 * Brief 6 (KARAR 210) + Son tur (2026-06-14): Kayıt için benzersiz referans
 * no üretir.
 *
 * Format: `OCAK-XXXXXX` (6 haneli rakam, 100000–999999, 900K ihtimal). Önceki
 * 5 hane (90K uzay) doğum günü paradoksu ile ~300 kayıtta %50 çakışma — yetersiz.
 * 6 hane ~1000 kayıtta %50 — 10K seviyesinde rahat. Mevcut 5 haneli kayıtlar
 * Notion'da olduğu gibi kalır (rich_text alanı, uzunluk esnek).
 *
 * Çakışma garantisi `uretBenzersizReferansNo(client, dbIds)` ile (Notion query
 * + retry + timestamp fallback). Bu pure helper kullanan testler için.
 */
export function uretReferansNo(): string {
  // 100000–999999 inclusive — Math.random() [0,1) * 900000 → [0, 899999] + 100000.
  const sayi = Math.floor(Math.random() * 900000) + 100000;
  return `OCAK-${sayi}`;
}

/**
 * Son tur (2026-06-14) — çakışma garantili ref üretimi. Notion Kayıtlar +
 * Başvurular DB'lerinde "Referans No" rich_text alanını query'leyip aday
 * ref'i kontrol eder; varsa yeniden üretir (max `maxDeneme` deneme).
 * Başarısızsa timestamp tabanlı fallback (`OCAK-${Date.now().slice(-8)}` —
 * 100M uzay, çakışma neredeyse imkânsız).
 *
 * KARAR 76 — Kayıtlar tek otorite; ama Başvurular'a da Kapı 2 akışında ref
 * yazılıyor. İki DB ortak OCAK-XXXXXX uzayı paylaşır.
 *
 * Race condition: iki eşzamanlı kayıt aynı anda aynı ref üretirse, ikisi de
 * query'de "yok" görür → ikisi de yazar (Notion atomic transaction yok).
 * Lansman hacmi düşük → pratik kabul. Worst-case Kaan elle düzeltir.
 *
 * `client` notion-types client; `dbIds` undefined/empty olanlar atlanır
 * (test/dev için, prod'da ikisi de set). `query` parametresi async test
 * için inject edilebilir.
 */
export type RefUniqueQuery = (dbId: string, ref: string) => Promise<boolean>;

export async function uretBenzersizReferansNo(
  query: RefUniqueQuery,
  dbIds: string[],
  maxDeneme = 3,
): Promise<string> {
  const aktifDbler = dbIds.filter(Boolean);
  for (let i = 0; i < maxDeneme; i++) {
    const aday = uretReferansNo();
    let cakisma = false;
    for (const dbId of aktifDbler) {
      if (await query(dbId, aday)) {
        cakisma = true;
        break;
      }
    }
    if (!cakisma) return aday;
  }
  // Son çare: timestamp suffix (100M uzay) — çakışma neredeyse imkânsız.
  return `OCAK-${Date.now().toString().slice(-8)}`;
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
  // Aşama 3b-fix tasarım KARARI (2026-06-09): indirim SADECE Katman A
  // (katılım payı) üzerine uygulanır. Kor (Katman B / askı) tam kalır —
  // kullanıcı kendi katkısını yapıyor, indirim onu da düşürmek mantıksız.
  // Önceden A+B'ye uygulanıyordu (Aşama 3a); değiştirildi.
  const aSafe = Math.max(0, katmanA);
  const bSafe = Math.max(0, katmanB);
  const yuvarlaKurus = (n: number) => Math.round(n * 100) / 100;
  if (!kod || !kod.gecerli) {
    return { katmanA: aSafe, katmanB: bSafe, indirim: 0, toplam: yuvarlaKurus(aSafe + bSafe) };
  }
  if (kod.tip === 'tam-burs') {
    return { katmanA: 0, katmanB: bSafe, indirim: aSafe, toplam: bSafe };
  }
  // yuzde / sabit — indirim SADECE A'ya. `kod.indirimTutari` kodDogrula
  // çağrısının `tutar` parametresine göre hesaplanır; çağıran A'yı
  // geçirmişse doğrudan kullanılır, A+B geçirmişse burada A ile sınırlanır.
  const indirim = Math.min(Math.max(0, kod.indirimTutari), aSafe);
  const yeniA = Math.max(0, aSafe - indirim);
  return {
    katmanA: yuvarlaKurus(yeniA),
    katmanB: bSafe,
    indirim: yuvarlaKurus(indirim),
    toplam: yuvarlaKurus(yeniA + bSafe),
  };
}

/**
 * kayit-cta section'ı için post-render placeholder çözümü (Brief 4 KARAR 207
 * + brief-faz3-h4-h5 İş 3).
 *
 * Plugin (remark-ocak-sections.ts transformKayitCta) buton href + label'ını
 * `__KAYIT_CTA_HREF__` ve `__KAYIT_CTA_LABEL__` placeholder'larıyla emit eder;
 * plugin global instance sayfa slug'ını bilmediği için. Bu helper loader
 * (notion-pages.ts) içinde her sayfanın HTML'i render edildikten sonra çağrılır.
 *
 * Davranış (Adım 0 karar A — sessiz atla + warn):
 *  - Slug 6 KayitFormat'tan biri → href `/${slug}/kayit`, label KAYIT_CTA_LABEL[slug].
 *  - Slug 6 format dışı (örn. '/hikaye', '/biz', '/') →
 *    `<section data-section="kayit-cta">...</section>` tüm bloğu (üst metin
 *    dahil) regex ile kaldırılır + tek console.warn yazılır (build log'da
 *    görünür kalır, sayfa boş render edilir).
 *
 * Slug input formatları: '/cember', 'cember', '/cember/' hepsi tolere
 * edilir; defansif normalize.
 *
 * Fonksiyon adı history uğruna korunuyor (`Href`) — davranış artık href+label
 * çözümü kapsıyor.
 */
export function resolveKayitCtaHref(html: string, rawSlug: string): string {
  if (!html.includes('data-section="kayit-cta"')) return html;
  const slug = rawSlug.replace(/^\/+|\/+$/g, '');
  if (isKayitFormat(slug)) {
    const replaced = html
      .replaceAll('__KAYIT_CTA_HREF__', `/${slug}/kayit`)
      .replaceAll('__KAYIT_CTA_LABEL__', KAYIT_CTA_LABEL[slug]);
    // Her butondan SONRA "Tüm buluşmalar →" linki enjekte et — home + format
    // sayfa + detay yüzeyi aynı metin (brief-baslik-dil-cizgi-takvim İş 3;
    // "Sana uyan..." sahte kişiselleştirme atıldı). Sayfa formatı bilinir →
    // takvim linki `/takvim#<slug>` hash'li (client script tab'ı ön-seçer).
    return replaced.replace(
      /(<a class="ocak-kayit-cta__buton"[^>]*>[\s\S]*?<\/a>)/g,
      `$1<p class="ocak-kayit-cta__tumu"><a href="/takvim#${slug}">Tüm buluşmalar →</a></p>`,
    );
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
