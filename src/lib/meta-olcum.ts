/**
 * meta-olcum.ts — B118 İŞ D: sunucudan Meta Purchase olayı.
 *
 * ── Neden `odemeBildir`'in içinden ──
 * KARAR 609 ödeme bildirimini tek otoriteye bağladı; kart callback'i de havale
 * taraması da oradan geçiyor. Olay oradan atılınca iki yöntem tek yerden, bir
 * kez gidiyor. n8n alternatifi Notion'u ayrıca tarayıp "Ödendi" satırlarını
 * bulmak zorundaydı — yani ödemeyi fark eden İKİNCİ bir yol; 609 tam o sınıfı
 * kapatmıştı.
 *
 * ── Bu modül bir şeyi BOZAMAZ ──
 * Çağrı `odemeBildir`'in sonunda, kendi `try/catch`inde ve dönüş değerine
 * dokunmuyor (Kaan koşulu 1). Mail gitti, `Mail Gitti` yazıldı; buradan sonrası
 * ölçüm. Meta'ya ulaşılamazsa ödeme bildirimi aynen sürer.
 *
 * ── Kapılar (Kaan koşulları 2 · 3 · 4) ──
 *  1. `META_PIXEL_ID` ve `META_CAPI_TOKEN` tanımlı olacak, yoksa hiç istek
 *     atılmaz. `META_TEST_EVENT_CODE` İSTEĞE BAĞLI — varsa test akışı, yoksa
 *     gerçek akış.
 *  2. `Ölçüm Rızası` işaretli olacak
 *  3. `Ölçüm Gitti` BOŞ olacak (tekillik)
 *  4. Kayıt ID ve pozitif tutar olacak
 *
 * ── Yükte ne var, ne yok (Kaan koşulu 5) ──
 * VAR: Kayıt ID (olay kimliği), tutar, para birimi, zaman.
 * YOK: e-posta ve telefon özeti — hukuk teyidi bekliyor (14 Eki). Ad, şehir,
 * IP, user-agent da yok; hiçbiri onaylı listede değil.
 *
 * ── Üç yargı kararı — Kaan onayladı (9 Eki 2026) ──
 *
 *  (a) `user_data.external_id` = Kayıt ID'nin SHA-256'sı. Meta CAPI boş
 *      `user_data` ile gelen olayı REDDEDER; en az bir tanımlayıcı ister.
 *      Kayıt ID onaylı yükte zaten var ve e-posta/telefon değil — tek
 *      geçerli aday o. Hash'leniyor çünkü Meta `external_id` için SHA-256
 *      bekliyor. Dedupe BUNDAN etkilenmiyor: `event_id` düz Kayıt ID kalıyor.
 *
 *  (b) `action_source: 'other'`. `'website'` Meta tarafında
 *      `client_user_agent` ya da `client_ip_address` ZORUNLU kılıyor; ikisi de
 *      onaylı yükte yok. Bedeli: web kampanyası ilişkilendirmesi zayıflar.
 *      ⏭ Hukuk teyidi (14 Eki) gelirse `'website'`a geçilecek — AYRI İŞ,
 *      bu turda yapılmadı.
 */
import { createHash } from 'node:crypto';
// ⚠ Para birimi normalleştirmesi İŞ B'nin modülünden geliyor, burada İKİNCİ
// BİR KOPYA yazılmıyor. Hatanın kökü tam da buydu (aşağıda, `purchaseOlayi`).
// `olcum.ts` tarayıcı tarafı bir modül ama üst seviyede `window`a dokunmuyor
// — sunucudan import etmek güvenli, ölçüldü (SSR build 0 hata).
import { paraBirimiNormalle } from './olcum.ts';

/**
 * Graph API sürümü — Kaan verdi (9 Eki 2026): v26.0, 29 Temmuz 2026 sürümü.
 * v21 Ocak 2027'de kalkıyor, o yüzden buraya yazılmadı.
 */
export const META_GRAPH_SURUMU = 'v26.0';

/** Meta olay adı. Tarayıcıdaki GTM Purchase etiketiyle AYNI olay. */
export const META_OLAY_ADI = 'Purchase';

/** Notion Kayıtlar tekillik işareti (Kaan koşulu 3). */
export const OLCUM_GITTI_ALANI = 'Ölçüm Gitti';

/** Notion Kayıtlar rıza kutusu — İŞ C bunu her kayıtta yazıyor. */
export const OLCUM_RIZASI_ALANI = 'Ölçüm Rızası';

export type MetaAyarlari = {
  pixelId: string;
  token: string;
  /**
   * `META_TEST_EVENT_CODE` — **isteğe bağlı** (Kaan, 9 Eki).
   *
   * Tanımlıysa olay Events Manager'ın **Test Events** akışına düşer ve gerçek
   * dönüşüm sayılmaz; doğrulama için budur. Tanımsızsa `test_event_code`
   * gövdeye HİÇ girmez ve olay gerçek akışa gider.
   *
   * `undefined` ile boş dize AYRIMI YOK: ikisi de "tanımsız" sayılır. Boş bir
   * `test_event_code` göndermek Meta tarafında geçersiz bir kod demekti.
   */
  testKodu?: string;
};

/**
 * Ortam değişkenlerini okur.
 *
 * **`META_PIXEL_ID` ya da `META_CAPI_TOKEN` tanımsızsa `null`** — çağıran
 * hiçbir istek atmaz, sessizce geçer (Kaan koşulu 4). İkisi de olmadan uca
 * çıkılamaz; bu yüzden zorunlular.
 *
 * `META_TEST_EVENT_CODE` yokluğu bir eksiklik DEĞİL, bir moddur: gerçek akış.
 *
 * ⚠ `process.env`, `import.meta.env` DEĞİL. `import.meta.env` Vite tarafından
 * BUILD ZAMANINDA sabitlenir (`kart-akisi.ts`'in uzun uyarısı aynı tuzağı
 * anlatıyor) ve Vercel'de anahtarı değiştirmek redeploy gerektirirdi. Buradan
 * okunan değer çalışma zamanında taze — test kodunu eklemek/kaldırmak, yani
 * test akışı ile gerçek akış arasında gidip gelmek, tek bir env değişikliği.
 */
export function metaAyarlariniOku(
  env: Record<string, string | undefined>,
): MetaAyarlari | null {
  const pixelId = (env.META_PIXEL_ID ?? '').trim();
  const token = (env.META_CAPI_TOKEN ?? '').trim();
  const testKodu = (env.META_TEST_EVENT_CODE ?? '').trim();
  if (!pixelId || !token) return null;
  return testKodu ? { pixelId, token, testKodu } : { pixelId, token };
}

/** Meta Conversions API uç adresi. Token gövdede gider, URL'de DEĞİL. */
export function metaUcAdresi(pixelId: string): string {
  return `https://graph.facebook.com/${META_GRAPH_SURUMU}/${encodeURIComponent(pixelId)}/events`;
}

/** `external_id` için SHA-256 — Meta'nın beklediği biçim (küçük harf hex). */
export function kayitIdOzeti(kayitId: string): string {
  return createHash('sha256').update(kayitId.trim()).digest('hex');
}

export type PurchaseGirdisi = {
  kayitId: string;
  tutar: number;
  paraBirimi: string;
  /** Olay anı — saniye cinsinden UNIX damgası. Çağıran veriyor (test sabitleyebilsin). */
  anSaniye: number;
};

/**
 * Meta olay nesnesini kurar — saf.
 *
 * Para birimi küçük harf gider: Meta `currency` için ISO-4217'yi küçük harf
 * bekliyor. Tutar `number` kalır, kuruş korunur (KARAR 240).
 *
 * ── ⚠ `currency` BOŞ GİDEMEZ — 11 Eki 2026 canlı hatası ──
 * İlk hâli `g.paraBirimi.trim().toLowerCase()` yazıyordu, yani Notion'daki
 * `Para Birimi` alanı boşsa `currency: ''` gönderiyordu. Meta boş dizeyi
 * "eksik" sayıyor: `OCAK-9CL9` test olayında `value: 300` ulaştı,
 * `currency` missing göründü ve Events Manager
 * `s2s_invalid_purchase_event_actions` tanısı düştü.
 *
 * Kök sebep, kodun geri kalanıyla TUTARSIZLIKTI: `api/kayit.ts:221` boş alanı
 * `'TRY'`ye düşürüyor, `posta.ts`in `tutarMetni`'si `TL`ye düşürüyor,
 * tarayıcıdaki `purchase` olayı `paraBirimiNormalle` ile `TRY`ye düşürüyor —
 * YALNIZ bu modül ham değeri olduğu gibi gönderiyordu. Ölçüm (10 Eki, canlı
 * Notion): 29 etkinliğin 6'sında alan boş, 23'ünde `TRY`, TRY dışı **0**.
 *
 * Artık `paraBirimiNormalle` kullanılıyor: dolu ve geçerli bir kod varsa O
 * gider (şema `USD` ve `EUR`a açık), yoksa `TRY`. Fallback sabit yazılmadı,
 * İŞ B'nin zaten test edilmiş kuralı çağrıldı — iki yerde iki kural, bu
 * hatanın kendisiydi.
 */
export function purchaseOlayi(g: PurchaseGirdisi): Record<string, unknown> {
  const kayitId = g.kayitId.trim();
  return {
    event_name: META_OLAY_ADI,
    event_time: g.anSaniye,
    // ⚠ DEDUPE ANAHTARI — tarayıcıdaki GTM Purchase etiketi de `eventID`
    // olarak DÜZ Kayıt ID'yi gönderiyor (brief §8b/3). İkisi aynı olmazsa
    // kart ödemesi Meta'da iki kez sayılır.
    event_id: kayitId,
    // Gerekçe (b) modül başlığında.
    action_source: 'other',
    user_data: {
      // Gerekçe (a) modül başlığında. E-posta/telefon özeti YOK.
      external_id: kayitIdOzeti(kayitId),
    },
    custom_data: {
      value: g.tutar,
      currency: paraBirimiNormalle(g.paraBirimi).toLowerCase(),
    },
  };
}

/**
 * Uca gidecek tam gövde. Token burada — URL'de değil, log'da değil.
 *
 * ⚠ `test_event_code` anahtarı yalnız kod TANIMLIYKEN basılır. `undefined`
 * bir değerle göndermek `JSON.stringify` sayesinde anahtarı düşürürdü ama
 * niyeti okunmaz kılardı; koşul açık yazılı.
 */
export function purchaseGovdesi(
  g: PurchaseGirdisi,
  ayarlar: MetaAyarlari,
): Record<string, unknown> {
  return {
    data: [purchaseOlayi(g)],
    ...(ayarlar.testKodu ? { test_event_code: ayarlar.testKodu } : {}),
    access_token: ayarlar.token,
  };
}

export type OlcumKapisiGirdisi = {
  kayitId: string;
  tutar: number;
  olcumRizasi: boolean;
  olcumGitti: boolean;
};

export type OlcumKapisiSonuc = { gonder: true } | { gonder: false; sebep: string };

/**
 * Dört kapı — saf, ölçülebilir.
 *
 * `Ölçüm Rızası` işaretli DEĞİLSE gönderilmez (Kaan koşulu 2): rıza vermemiş
 * bir kadının ödemesi Meta'ya hiç gitmez. `Ölçüm Gitti` doluysa gönderilmez
 * (koşul 3).
 *
 * Tutar `> 0` şartı: sıfır tutarlı bir Purchase Meta'da anlamsız ve tam burslu
 * kayıt zaten `Ödendi` olmuyor (`Bedava` yazılıyor). Kapı yine de duruyor,
 * çünkü `Beklenen Tutar` boş kalmış eski bir satır buraya düşebilir.
 */
export function olcumKapisi(g: OlcumKapisiGirdisi): OlcumKapisiSonuc {
  if (!g.kayitId.trim()) return { gonder: false, sebep: 'Kayıt ID boş' };
  if (!g.olcumRizasi) return { gonder: false, sebep: 'Ölçüm Rızası işaretli değil' };
  if (g.olcumGitti) return { gonder: false, sebep: 'Ölçüm Gitti zaten işaretli' };
  if (!(g.tutar > 0)) return { gonder: false, sebep: `tutar pozitif değil (${g.tutar})` };
  return { gonder: true };
}

/** Ağ taşıması — test sahte veriyor, üretim `fetch` kullanıyor. */
export type MetaTasima = (
  url: string,
  govde: Record<string, unknown>,
) => Promise<{ ok: boolean; hata?: string }>;

/** Üretim taşıması. Gövde JSON; token gövdede, log'a GİRMEZ (CLAUDE.md §8). */
export function metaTasima(): MetaTasima {
  return async (url, govde) => {
    const yanit = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(govde),
    });
    if (yanit.ok) return { ok: true };
    // Meta hata gövdesi gerekçeyi taşıyor (sürüm hatası, `user_data` eksikliği,
    // geçersiz token). Kırpılarak log'a geçiyor — token gövdede değil yanıtta
    // olmadığı için sızma yok.
    const metin = await yanit.text().catch(() => '(gövde okunamadı)');
    return { ok: false, hata: `HTTP ${yanit.status} ${metin.slice(0, 300)}` };
  };
}

export type PurchaseBildirBagimliliklari = {
  tasima: MetaTasima;
  /** Notion `Ölçüm Gitti` checkbox'ını işaretler. */
  olcumGittiIsaretle(pageId: string): Promise<void>;
  /** Ortam. Üretimde `process.env`. */
  env: Record<string, string | undefined>;
  /** Olay anı (saniye). Üretimde `Date.now()/1000`; test sabitliyor. */
  anSaniye: number;
};

export type PurchaseBildirSonuc = {
  durum: 'gonderildi' | 'atlandi' | 'hata';
  /** `Ölçüm Gitti` yazıldı mı. */
  isaretlendi: boolean;
  sebep?: string;
};

/**
 * Purchase olayını gönderir ve başarılıysa `Ölçüm Gitti`'yi işaretler.
 *
 * **Asla throw etmez.** Her başarısızlık `durum` + log olarak döner; çağıran
 * (`odemeBildir`) dönüşü zaten değerlendirmiyor — bu tip yalnız test ve log
 * için var.
 *
 * ⚠ `Ölçüm Gitti` YALNIZ Meta kabul ettiğinde yazılır. `Mail Gitti`'nin
 * anlamıyla aynı dar: "uç isteği kabul etti". Reddedilen bir olayı
 * işaretlemek, o kaydı sonsuza kadar ölçüm dışı bırakırdı.
 *
 * ⚠ İşaret YAZILAMAZSA (alan Notion'da yoksa) olay GİTMİŞ sayılır ve akış
 * sürer (Kaan koşulu 3). Bedeli: `odemeBildir` o kayıt için yeniden koşarsa
 * olay ikinci kez gider. Meta `event_id` ile tekilleştirdiği için zararsız;
 * yine de log'a gürültülü bir satır düşer.
 */
export async function purchaseBildir(
  g: OlcumKapisiGirdisi & { pageId: string; paraBirimi: string },
  deps: PurchaseBildirBagimliliklari,
): Promise<PurchaseBildirSonuc> {
  const atla = (sebep: string): PurchaseBildirSonuc => {
    console.log(`[meta-olcum] atlandı — kayitId=${g.kayitId} sebep=${sebep}`);
    return { durum: 'atlandi', isaretlendi: false, sebep };
  };

  const ayarlar = metaAyarlariniOku(deps.env);
  if (!ayarlar) {
    // Sessizce geçilir (Kaan koşulu 4). `console.log`, `error` değil: eksik
    // yapılandırma bir arıza değil, "bu ortamda kapalı" demek.
    return atla('META_PIXEL_ID ya da META_CAPI_TOKEN tanımlı değil');
  }

  const kapi = olcumKapisi(g);
  if (!kapi.gonder) return atla(kapi.sebep);

  let sonuc: { ok: boolean; hata?: string };
  try {
    sonuc = await deps.tasima(
      metaUcAdresi(ayarlar.pixelId),
      purchaseGovdesi(
        {
          kayitId: g.kayitId,
          tutar: g.tutar,
          paraBirimi: g.paraBirimi,
          anSaniye: deps.anSaniye,
        },
        ayarlar,
      ),
    );
  } catch (err) {
    const sebep = `Meta çağrısı düştü: ${String(err).slice(0, 200)}`;
    console.error(`[meta-olcum] HATA — kayitId=${g.kayitId} sebep=${sebep}`);
    return { durum: 'hata', isaretlendi: false, sebep };
  }

  if (!sonuc.ok) {
    const sebep = `Meta olayı reddetti: ${sonuc.hata ?? '(gerekçe yok)'}`;
    console.error(`[meta-olcum] HATA — kayitId=${g.kayitId} sebep=${sebep}`);
    return { durum: 'hata', isaretlendi: false, sebep };
  }

  try {
    await deps.olcumGittiIsaretle(g.pageId);
  } catch (err) {
    const sebep = `${OLCUM_GITTI_ALANI} yazılamadı: ${String(err).slice(0, 200)}`;
    console.error(
      `[meta-olcum] kısmi — kayitId=${g.kayitId} sebep=${sebep} — ` +
        `olay GİTTİ; Notion Kayıtlar DB'sinde "${OLCUM_GITTI_ALANI}" (Checkbox) alanı açık mı? ` +
        `Açık değilse bu kayıt için olay tekrar gidebilir (Meta event_id ile tekilleştirir).`,
    );
    return { durum: 'gonderildi', isaretlendi: false, sebep };
  }

  // Akış log'da görünüyor: Events Manager'da olayı ararken "test akışına mı
  // gerçek akışa mı düştü" sorusu ilk sorulan şey. Kodun KENDİSİ log'a
  // GİRMEZ (CLAUDE.md §8) — yalnız hangi modda olduğu.
  const akis = ayarlar.testKodu ? 'test' : 'gerçek';
  console.log(`[meta-olcum] OK — kayitId=${g.kayitId} akis=${akis} ${OLCUM_GITTI_ALANI}=✓`);
  return { durum: 'gonderildi', isaretlendi: true };
}

/* ─────────────────────── üretim bağlaması (tek yer) ─────────────────────── */

/**
 * Notion istemcisinin bu modülün kullandığı kadarı. SDK tipini import etmemek
 * bilinçli — `odeme-kayit-oku.ts`'in `NotionOkuyucu`'su ile aynı gerekçe:
 * test sahtesi tüm `Client` yüzeyini taklit etmek zorunda kalmasın.
 */
export type NotionIsaretleyici = {
  pages: { update(args: Record<string, unknown>): Promise<unknown> };
};

/** `Ölçüm Gitti` yazıcısı. `mailGittiIsaretle`'nin ikizi, aynı biçim. */
export function olcumGittiIsaretleyici(notion: NotionIsaretleyici) {
  return async (pageId: string): Promise<void> => {
    await notion.pages.update({
      page_id: pageId,
      properties: { [OLCUM_GITTI_ALANI]: { checkbox: true } },
    });
  };
}

/** `odemeBildir`'in `olcumGonder` bağımlılığına geçirilen girdinin okuduğu kadarı. */
export type OlcumAdimiGirdisi = {
  kayitId: string;
  pageId: string;
  tutar?: number;
  paraBirimiHam?: string;
  olcumRizasi?: boolean;
  olcumGitti?: boolean;
};

/**
 * `odemeBildir`'e verilecek `olcumGonder` — **iki çağrı yerinin TEK bağlaması.**
 *
 * `mailGittiIsaretle` iki API route'unda ayrı ayrı yazılıyor ("callback'teki
 * ikizle aynı yazım") ama o tek satırlık bir `pages.update`. Buradaki bağlama
 * dört parça taşıyor (taşıma · işaretleyici · env · zaman); ikizini yazmak
 * birinin değişip ötekinin unutulması demekti.
 *
 * Eksik alanlar güvenli yana düşüyor: `tutar` yoksa `0` → kapı tutar;
 * `olcumRizasi` yoksa `false` → olay gitmez.
 */
export function metaOlcumAdimi(notion: NotionIsaretleyici) {
  return (g: OlcumAdimiGirdisi): Promise<PurchaseBildirSonuc> =>
    purchaseBildir(
      {
        kayitId: g.kayitId,
        pageId: g.pageId,
        tutar: g.tutar ?? 0,
        paraBirimi: g.paraBirimiHam ?? '',
        olcumRizasi: g.olcumRizasi === true,
        olcumGitti: g.olcumGitti === true,
      },
      {
        tasima: metaTasima(),
        olcumGittiIsaretle: olcumGittiIsaretleyici(notion),
        // ⚠ `process.env` — `import.meta.env` DEĞİL (gerekçe
        // `metaAyarlariniOku` başlığında).
        env: process.env,
        anSaniye: Math.floor(Date.now() / 1000),
      },
    );
}
