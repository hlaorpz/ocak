// /api/bildirim-tara — B211 İŞ 4 + İŞ 8. Bekleyen ve ödenmiş kayıtları tarar;
// hatırlatır, ek süre tanır, iptal eder, buluşma günü hatırlatması gönderir.
//
// n8n saatte bir çağırır. KARAR motoru `lib/tarama.ts`'te (saf, testli); bu
// dosya yalnız Notion'u okur, kararı uygular ve sayar.
//
// ── KİMLİK ──
// İstek başlığı `x-ocak-tarama` = `TARAMA_SIR`, sabit-zamanlı karşılaştırma.
// ⚠ Sır SORGU DİZESİNDE KABUL EDİLMEZ. Query sunucu log'una, proxy log'una ve
// tarayıcı geçmişine düşer; başlık düşmez. Bu yüzden `?sir=` okunmuyor ve
// okunmaması ayrıca test ediliyor.
//
// ── KURU KOŞU ──
// `?kuru=1` → hiçbir mail gitmez, hiçbir şey yazılmaz; yanıt yapılacak
// işlemlerin listesidir. Kaan ilk çalıştırmayı böyle yapacak.
//
// ── YANIT ──
// Yalnız sayılar ve `Kayıt ID` listeleri. Kişi verisi YOK (CLAUDE.md §8).
import type { APIRoute } from 'astro';
import { notion, NOTION_KAYITLAR_DB } from '../../lib/notion.ts';
import { sabitZamanliEsit } from '../../lib/sabit-zamanli.ts';
import { etkinlikBaslangicAni } from '../../lib/yer-tutma.ts';
import { sonAnMetni } from '../../lib/yer-tutma.ts';
import {
  taramaPlani,
  mekanOnlineMi,
  type TaramaSatiri,
  type TaramaIslemi,
} from '../../lib/tarama.ts';
import {
  postaGonder,
  resendTasima,
  yerinHazirSablonu,
  gunHatirlatmaSablonu,
  yolTarifiLinki,
  tutarMetni,
  SABLON,
  type SablonAdi,
} from '../../lib/posta.ts';
import { odemeLinki, odemeLinkSirri } from '../../lib/odeme-link.ts';
import { etkinlikUrlFormatla, isKayitFormat } from '../../lib/kayit.ts';
import { FORMAT_KATEGORI } from '../../lib/etkinlik-kategori.ts';
import { formatEtkinlikTarihi } from '../../lib/format-etkinlik.ts';
import { ilkAd } from '../../lib/davet-baglam.ts';

export const prerender = false;

/** Çağrı başına en çok bu kadar işlem; kalan sonraki taramaya kalır. */
const TAVAN = 25;

/** Notion sorgu sayfası — tavan 25 olduğu için 100 fazlasıyla yeter. */
const SAYFA = 100;

const BASLIK_ADI = 'x-ocak-tarama';

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

function taramaSirri(): string {
  return (import.meta.env.TARAMA_SIR ?? '').trim();
}

/**
 * Kimlik. Boşluklar AYRI AYRI denetleniyor — `sabitZamanliEsit` boş-boş için
 * `true` döner ve ona yaslanmak, env'i yazılmamış bir sunucuda ucu herkese
 * açmak olurdu (o fonksiyonun başlığındaki uyarı).
 */
function kimlikGecerli(request: Request): { ok: boolean; sebep?: string } {
  const beklenen = taramaSirri();
  if (!beklenen) return { ok: false, sebep: 'sir-env-tanimsiz' };
  const gelen = (request.headers.get(BASLIK_ADI) ?? '').trim();
  if (!gelen) return { ok: false, sebep: 'sir-baslikta-yok' };
  if (!sabitZamanliEsit(gelen, beklenen)) return { ok: false, sebep: 'sir-yanlis' };
  return { ok: true };
}

const rich = (p: Record<string, any>, ad: string): string =>
  (p[ad]?.rich_text ?? []).map((t: any) => t.plain_text ?? '').join('').trim();
const title = (p: Record<string, any>, ad: string): string =>
  (p[ad]?.title ?? []).map((t: any) => t.plain_text ?? '').join('').trim();

/** Bozuk/boş tarih → `null`. `Invalid Date` karşılaştırmada sessizce yanıltır. */
function an(iso: string | undefined | null): Date | null {
  if (!iso) return null;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Etkinlik sayfasından mail değişkenleri için gereken her şey. */
type EtkinlikBilgi = {
  baslik: string;
  slug: string;
  tarihISO: string;
  tarihBitis: string;
  saat: string;
  mekan: string;
  katilimLinki: string;
  zoomSifresi: string;
  konumDetay: string;
  paraBirimi: string;
  /** `Format` select ham değeri ("Yolculuk"). Kapı bunu çözüyor. */
  formatHam: string;
  /**
   * `Format` bir `KayitFormat`'a çözülüyor mu.
   *
   * ── Ölçüm (7 Eki 2026) ──
   * Etkinlikler DB'sinin `Format` select'i YEDİ seçenek taşıyor — `Yolculuk` ·
   * `Mini Retreat` · `Açık Kapı` · `Çember` · `Atölye` · `Şehir Akşamı` ·
   * `Seremoni` — ve yedisi de kapıdan GEÇİYOR. `Anadolu Yolculuğu` o listede
   * YOK (kendi başvuru yolunda yaşıyor, bu akışa hiç girmiyor).
   *
   * Yani kapı bugünkü veride hiç kapanmıyor. Yine de duruyor: Notion'a yeni
   * bir `Format` seçeneği eklenip `FORMAT_KATEGORI`/`KayitFormat` güncellenmezse
   * mail yanlış doldurulmak yerine hiç gitmez. `kart-akisi.test.ts` desenindeki
   * sayı kilidi o günü kırmızı yakar.
   */
  formatGecer: boolean;
  /** Saat herhangi bir alandan okunabildi mi — gün hatırlatması buna bakıyor. */
  saatOkunabildi: boolean;
  baslangic: Date | null;
};

async function etkinlikOku(pageId: string): Promise<EtkinlikBilgi | null> {
  try {
    const sayfa = await notion.pages.retrieve({ page_id: pageId });
    if (!('properties' in sayfa)) return null;
    const p = sayfa.properties as Record<string, any>;
    const mekan = p['Mekân/Platform']?.select?.name ?? '';
    const zoomSaat = rich(p, 'Zoom Başlangıç Saati');
    const klasikSaat = rich(p, 'Saat');
    // ⚠ MEKÂNA BAĞLI eşleme — cross-fallback YOK (`api/kayit.ts:191-198`'in
    // canlı veriyle çürüttüğü kusur).
    const saat = mekanOnlineMi(mekan) ? zoomSaat : klasikSaat;
    const formatHam = p['Format']?.select?.name ?? '';
    const slug = FORMAT_KATEGORI[formatHam];
    const tarihISO = p['Tarih']?.date?.start ?? '';
    const baslangic = etkinlikBaslangicAni({ tarihISO, mekan, zoomSaat, klasikSaat });
    // Saat "okunabildi" mi: `Tarih` zaten saat taşıyor ya da mekâna bağlı alan
    // bir `HH:MM` veriyor. İkisi de yoksa `etkinlikBaslangicAni` 23:59'a düştü.
    const saatOkunabildi =
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(tarihISO) || /\d{1,2}:\d{2}/.test(saat);
    return {
      baslik: title(p, 'Başlık'),
      slug: rich(p, 'Slug'),
      tarihISO,
      tarihBitis: p['Tarih']?.date?.end ?? '',
      saat,
      mekan,
      katilimLinki: rich(p, 'Katılım Linki'),
      zoomSifresi: rich(p, 'Zoom Şifresi'),
      konumDetay: rich(p, 'Konum Detay'),
      paraBirimi: p['Para Birimi']?.select?.name ?? '',
      formatHam,
      formatGecer: !!slug && isKayitFormat(slug),
      saatOkunabildi,
      baslangic,
    };
  } catch (err) {
    console.error(`[bildirim-tara] etkinlik okunamadı — ${String(err).slice(0, 200)}`);
    return null;
  }
}

/** Tek bir Kayıtlar satırının taramaya giden hâli + mail için yan bilgi. */
type Aday = {
  satir: TaramaSatiri;
  ad: string;
  email: string;
  tutar: number;
  /** `Etkinlikler` relation öğe sayısı — 1 değilse mail gönderilmez. */
  etkinlikSayisi: number;
  etkinlik: EtkinlikBilgi | null;
};

/**
 * `Tip = Kayıt` satırlarını okur. `Ödeme Durumu` filtresi YOK: üç adımın üçü
 * farklı durumlara bakıyor (Ödendi · Beklemede · Ödendi/Bedava) ve tek sorguda
 * almak hem daha az çağrı hem daha az kaçak.
 */
async function adaylariOku(): Promise<Aday[]> {
  const sorgu = await notion.databases.query({
    database_id: NOTION_KAYITLAR_DB,
    filter: { property: 'Tip', select: { equals: 'Kayıt' } },
    page_size: SAYFA,
  });
  const adaylar: Aday[] = [];
  for (const satir of sorgu.results) {
    if (!('properties' in satir)) continue;
    const p = satir.properties as Record<string, any>;
    const kayitId = title(p, 'Kayıt ID');
    if (!kayitId) continue;
    const rel: unknown[] = p['Etkinlikler']?.relation ?? [];
    const etkId = (rel[0] as { id?: string } | undefined)?.id ?? '';
    // ⚠ Relation tam bir etkinlik taşımıyorsa etkinlik HİÇ okunmaz: hangi
    // etkinliğin bilgisinin gideceğini kod tahmin etmez (`OCAK-3HX6` vakası).
    const etkinlik = rel.length === 1 && etkId ? await etkinlikOku(etkId) : null;
    adaylar.push({
      satir: {
        pageId: (satir as { id: string }).id,
        kayitId,
        odemeDurumu: p['Ödeme Durumu']?.select?.name ?? '',
        odemeYontemi: p['Ödeme Yöntemi']?.select?.name ?? '',
        // `Kayıt Tarihi` bir `created_time` property'si — otomatik, UTC.
        kayitAni: an(p['Kayıt Tarihi']?.created_time ?? (satir as { created_time?: string }).created_time),
        yerTutmaBitisi: an(p['Yer Tutma Bitişi']?.date?.start),
        mailGitti: p['Mail Gitti']?.checkbox === true,
        hatirlatmaGitti: p['Hatırlatma Gitti']?.checkbox === true,
        gunHatirlatmasiGitti: p['Gün Hatırlatması Gitti']?.checkbox === true,
        etkinlikBaslangici: etkinlik?.baslangic ?? null,
        saatOkunabildi: etkinlik?.saatOkunabildi ?? false,
        mekan: etkinlik?.mekan ?? '',
        // ⚠ ÜÇ KAPI, aday kurulum anında (7 Eki, Kaan). İşlem üretildikten
        // sonra bakılsaydı (a) ve (c) adayları her turda aynı log'u yazardı —
        // o iki dal kendi kendine çözülmüyor. Gerekçenin tamamı
        // `TaramaSatiri.postalanabilir` başlığında.
        postalanabilir:
          rel.length === 1 && !!etkinlik?.formatGecer && (p['Email']?.email ?? '').trim().length > 0,
      },
      ad: ilkAd(rich(p, 'Kadın')),
      email: p['Email']?.email ?? '',
      tutar: p['Beklenen Tutar']?.number ?? 0,
      etkinlikSayisi: rel.length,
      etkinlik,
    });
  }
  return adaylar;
}

/** Mail planı: şablon + değişkenler. `null` = gönderilemez (gerekçe log'da). */
function mailPlani(
  islem: TaramaIslemi,
  a: Aday,
): { sablon: SablonAdi; degiskenler: Record<string, string> } | null {
  const e = a.etkinlik;
  if (!e) return null;
  const ETKINLIK_URL = etkinlikUrlFormatla(e.slug);
  const ETKINLIK_TARIHI = e.tarihISO
    ? formatEtkinlikTarihi(e.tarihISO, e.tarihBitis, e.saat)
    : '';
  const AD = a.ad;
  const ETKINLIK_BASLIGI = e.baslik;

  // Katılım bilgisi taşıyan maillerin ortak gövdesi.
  //
  // Tip açıkça `Record<string, string>`: iki dalın birleşimini TS "MEKAN?:
  // undefined" taşıyan bir birleşim sayıyor ve o `Record<string, string>`e
  // oturmuyor. `postaGonder`'in değişken kümesi kontrolü anahtarların
  // doğruluğunu zaten ağ çağrısından önce ölçüyor.
  const katilimAlanlari: Record<string, string> = mekanOnlineMi(e.mekan)
    ? { KATILIM_LINKI: e.katilimLinki, ZOOM_SIFRESI: e.zoomSifresi }
    : {
        MEKAN: e.mekan,
        ADRES: e.konumDetay,
        YOL_TARIFI_LINKI: yolTarifiLinki(e.konumDetay, ETKINLIK_URL),
      };

  if (islem.tip === 'bildirim') {
    return {
      sablon: yerinHazirSablonu(e.mekan),
      degiskenler: { AD, ETKINLIK_BASLIGI, ETKINLIK_TARIHI, ETKINLIK_URL, ...katilimAlanlari },
    };
  }

  if (islem.tip === 'gun-hatirlatma') {
    return {
      sablon: gunHatirlatmaSablonu(e.mekan),
      degiskenler: {
        AD,
        GUN: islem.gun,
        ETKINLIK_BASLIGI,
        ETKINLIK_TARIHI,
        ETKINLIK_URL,
        ...katilimAlanlari,
      },
    };
  }

  // Hatırlatma / ek süre — ödeme bilgisi taşır, katılım bilgisi TAŞIMAZ.
  // Son an: kartta mevcut bitiş, havalede YENİ bitiş (ek süre tanındı).
  const sonAn =
    islem.tip === 'uzat-havale' ? islem.yeniBitis : islem.satir.yerTutmaBitisi;
  if (!sonAn) return null;
  return {
    // Kart 30 dk → `yerini-tutuyoruz` (ilk mailini henüz almadı).
    // Havale ek süre → `yerin-hala-bizde` (ikinci kez yazıyoruz; Ek 2).
    sablon: islem.tip === 'uzat-havale' ? SABLON.yerinHalaBizde : SABLON.yeriniTutuyoruz,
    degiskenler: {
      AD,
      ETKINLIK_BASLIGI,
      ETKINLIK_TARIHI,
      TUTAR: tutarMetni(a.tutar, e.paraBirimi),
      REFERANS_NO: a.satir.kayitId,
      ODEME_LINKI: odemeLinki(a.satir.kayitId, odemeLinkSirri()),
      ODEME_SON_AN: sonAnMetni(sonAn),
    },
  };
}

/** İşlem adı — yanıt ve kuru koşu listesi için. */
function islemAdi(i: TaramaIslemi): string {
  return i.tip === 'iptal' ? `iptal:${i.neden}` : i.tip;
}

async function handle(request: Request): Promise<Response> {
  const kimlik = kimlikGecerli(request);
  if (!kimlik.ok) {
    // Sebep YALNIZ log'a. Gövdeye yazmak deneyen birine yön göstermek olurdu.
    console.warn(`[bildirim-tara] kimlik geçersiz (401) — sebep=${kimlik.sebep}`);
    return new Response(null, { status: 401 });
  }

  const url = new URL(request.url);
  const kuru = url.searchParams.get('kuru') === '1';
  // ⚠ `?sir=` BİLEREK OKUNMUYOR. Query log'lara ve geçmişe düşer.

  if (!NOTION_KAYITLAR_DB) {
    console.error('[bildirim-tara] NOTION_KAYITLAR_DB tanımsız');
    return json({ hata: 'yapilandirma' }, 500);
  }

  const simdi = new Date();
  let adaylar: Aday[];
  try {
    adaylar = await adaylariOku();
  } catch (err) {
    console.error(`[bildirim-tara] Kayıtlar okunamadı — ${String(err).slice(0, 200)}`);
    return json({ hata: 'notion-okuma' }, 502);
  }

  const esleme = new Map(adaylar.map((a) => [a.satir.pageId, a]));
  const { islemler, atlanan, postalanamaz } = taramaPlani(
    adaylar.map((a) => a.satir),
    simdi,
    TAVAN,
  );

  // ⚠ TEK özet satırı, satır başına warn DEĞİL. Bu kayıtlar (a) ya da (c)
  // alacaktı ama maili gönderilemiyor (relation ≠ 1 · format çözülmüyor ·
  // e-posta yok) ve o iki dal kendi kendine çözülmediği için her turda yeniden
  // aday olurlar. Görünür kalmaları gerekiyor, gürültü yapmamaları da.
  if (postalanamaz.length > 0) {
    console.warn(
      `[bildirim-tara] postalanamaz ${postalanamaz.length} kayıt (a)/(c) listesinden çıkarıldı — ${postalanamaz.join(' ')}`,
    );
  }

  if (atlanan > 0) {
    // Sessiz kırpma "her şey tarandı" diye okunurdu (CLAUDE.md §4).
    console.warn(`[bildirim-tara] TAVAN — ${TAVAN} işlem uygulandı, ${atlanan} sonraki turda`);
  }

  const sonuclar: Array<{ kayitId: string; islem: string; durum: string }> = [];

  for (const islem of islemler) {
    const a = esleme.get(islem.satir.pageId)!;
    const kayitId = islem.satir.kayitId;

    // ── İPTAL: yalnız Notion yazımı, MAIL YOK (iptal sessizdir) ──
    if (islem.tip === 'iptal') {
      if (kuru) {
        sonuclar.push({ kayitId, islem: islemAdi(islem), durum: 'kuru' });
        continue;
      }
      try {
        await notion.pages.update({
          page_id: islem.satir.pageId,
          properties: {
            'Ödeme Durumu': { select: { name: 'İptal' } },
            'İptal Nedeni': { select: { name: islem.neden } },
          },
        });
        sonuclar.push({ kayitId, islem: islemAdi(islem), durum: 'yazildi' });
      } catch (err) {
        console.error(`[bildirim-tara] iptal yazılamadı — kayitId=${kayitId} ${String(err).slice(0, 200)}`);
        sonuclar.push({ kayitId, islem: islemAdi(islem), durum: 'hata' });
      }
      continue;
    }

    // ── MAILLİ İŞLEMLER ──
    //
    // (a) ve (c) buraya YALNIZ `postalanabilir` satırlarla gelir — kapı aday
    // kurulumunda kapandı. Aşağıdaki denetim (b)'nin mail dalları için
    // duruyor (`hatirlat-kart` · `uzat-havale`): o satırlar postalanamaz olsa
    // bile kuyrukta kalır, çünkü süresi dolduğunda İPTAL edilmeleri gerekiyor
    // ve iptal mail istemiyor. Gürültüsü sınırlı: satır bitişte çözülür.
    if (!a.satir.postalanabilir) {
      console.warn(
        `[bildirim-tara] atlandı — kayitId=${kayitId} islem=${islem.tip} ` +
          `sebep=postalanamaz (relation=${a.etkinlikSayisi} formatGecer=${a.etkinlik?.formatGecer ?? false} emailVar=${a.email.trim().length > 0})`,
      );
      sonuclar.push({ kayitId, islem: islemAdi(islem), durum: 'atlandi' });
      continue;
    }
    const plan = mailPlani(islem, a);
    if (!plan) {
      console.warn(`[bildirim-tara] atlandı — kayitId=${kayitId} sebep=mail-plani-kurulamadi islem=${islem.tip}`);
      sonuclar.push({ kayitId, islem: islemAdi(islem), durum: 'atlandi' });
      continue;
    }

    if (kuru) {
      sonuclar.push({ kayitId, islem: islemAdi(islem), durum: 'kuru' });
      continue;
    }

    // ⚠ SIRA: önce mail, başarılıysa Notion işareti. Tersi sıra bir kez düşen
    // maili sonsuza kadar kaybettirirdi.
    const gonderim = await postaGonder(
      { sablon: plan.sablon, alici: a.email, degiskenler: plan.degiskenler, kayitId },
      resendTasima(),
    );
    if (!gonderim.ok) {
      sonuclar.push({ kayitId, islem: islemAdi(islem), durum: 'mail-hata' });
      continue;
    }

    // İşaret(ler). Uzatmada `Yer Tutma Bitişi` de yazılır — mail yeni son anı
    // söyledi, satır onu doğrulamalı.
    const properties: Record<string, any> = {};
    if (islem.tip === 'bildirim') properties['Mail Gitti'] = { checkbox: true };
    if (islem.tip === 'hatirlat-kart') properties['Hatırlatma Gitti'] = { checkbox: true };
    if (islem.tip === 'uzat-havale') {
      properties['Hatırlatma Gitti'] = { checkbox: true };
      properties['Yer Tutma Bitişi'] = { date: { start: islem.yeniBitis.toISOString() } };
    }
    if (islem.tip === 'gun-hatirlatma') properties['Gün Hatırlatması Gitti'] = { checkbox: true };

    try {
      await notion.pages.update({ page_id: islem.satir.pageId, properties });
      sonuclar.push({ kayitId, islem: islemAdi(islem), durum: 'yazildi' });
    } catch (err) {
      // Mail gitti, iz yazılamadı. Sonraki tarama tekrar gönderebilir — bu
      // kabul edilmiş bir risk: işareti mailden ÖNCE yazmak, düşen maili
      // sonsuza kadar kaybettirmekten kötü.
      console.error(`[bildirim-tara] işaret yazılamadı (mail GİTTİ) — kayitId=${kayitId} ${String(err).slice(0, 200)}`);
      sonuclar.push({ kayitId, islem: islemAdi(islem), durum: 'mail-gitti-isaret-yok' });
    }
  }

  const sayim: Record<string, number> = {};
  for (const s of sonuclar) sayim[`${s.islem}/${s.durum}`] = (sayim[`${s.islem}/${s.durum}`] ?? 0) + 1;

  console.log(
    `[bildirim-tara] bitti — kuru=${kuru} aday=${adaylar.length} islem=${islemler.length} atlanan=${atlanan}`,
  );

  // Yanıt yalnız sayılar ve `Kayıt ID`. Kişi verisi YOK.
  return json({
    kuru,
    aday: adaylar.length,
    islem: islemler.length,
    tavanaTakilan: atlanan,
    // (a)/(c) alacaktı ama maili gönderilemeyen kayıtlar. Sessiz düşmüyorlar:
    // Kaan bu listeyi Notion'da elle düzeltebilir (relation · e-posta · Format).
    postalanamaz,
    sayim,
    kayitlar: sonuclar,
  });
}

export const POST: APIRoute = ({ request }) => handle(request);
