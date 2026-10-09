import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * B118 İŞ B — dört olayın YÜZEY bağlantısı.
 *
 * Kural `src/lib/olcum.test.ts`'te ölçülüyor (40 test). Burada ölçülen şey
 * olayın DOĞRU YERDE çağrılıp çağrılmadığı: `form_submit`'in kart yolunda da
 * koşması, `begin_checkout`'un yönlendirmeden önce olması, `purchase`'ın
 * `/odeme/tamam`'a bağlanması, ve hiçbir bileşenin `dataLayer`'a doğrudan
 * push etmemesi (tek otorite `olcum.ts`).
 */

const KOK = join(__dirname, '..');
const FORM = readFileSync(join(KOK, 'components/KayitFormu.astro'), 'utf-8');
const SAYFA = readFileSync(join(KOK, 'components/OlcumSayfa.astro'), 'utf-8');
const SATIN = readFileSync(join(KOK, 'components/OlcumPurchase.astro'), 'utf-8');
const ACIK_KAPI = readFileSync(join(KOK, 'pages/acik-kapi.astro'), 'utf-8');
const ETKINLIK = readFileSync(join(KOK, 'pages/etkinlik/[slug].astro'), 'utf-8');
const TAMAM = readFileSync(join(KOK, 'pages/odeme/tamam.astro'), 'utf-8');
const KAYIT_OKU = readFileSync(join(KOK, 'lib/odeme-kayit-oku.ts'), 'utf-8');

/**
 * Yorumlar ve `//` satırları atılır.
 *
 * ⚠ YOKLUK ve SIRALAMA ölçütleri bu yüzeye karşı yazılır, ham dosyaya karşı
 * değil (CLAUDE.md §3). Vaka: `KayitFormu.astro`'nun yorumu
 * `if (result.checkoutUrl) { … }` ifadesini taşıyor ve o yorum gerçek daldan
 * ÖNCE geliyor — ham `indexOf` yorumu buluyor, sıralama ölçütü doğru koda
 * itiraz ediyordu. Yorum korunması gereken tarihsel anlatım (KARAR 61);
 * değişen ölçüt oldu.
 */
function yuzey(kaynak: string): string {
  return kaynak
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, ' ')
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .split('\n')
    .filter((satir) => !/^\s*\/\//.test(satir))
    .join('\n');
}

const FORM_YUZEY = yuzey(FORM);
const SATIN_YUZEY = yuzey(SATIN);

describe('view_content — iki sayfaya bağlı', () => {
  it('`/acik-kapi` mount ediyor, slug vermiyor', () => {
    expect(ACIK_KAPI).toContain("import OlcumSayfa from '../components/OlcumSayfa.astro';");
    expect(ACIK_KAPI).toContain('<OlcumSayfa icerikTipi="acik-kapi" />');
  });

  it('`/etkinlik/[slug]` mount ediyor, buluşmanın sluğunu veriyor', () => {
    expect(ETKINLIK).toContain("import OlcumSayfa from '../../components/OlcumSayfa.astro';");
    expect(ETKINLIK).toContain('<OlcumSayfa icerikTipi="etkinlik" etkinlikSlug={etkinlik.slug} />');
  });

  it('bileşen olayı lib üzerinden gönderiyor, elle push etmiyor', () => {
    expect(SAYFA).toContain("import { olayGonder, viewContentYuku");
    expect(SAYFA).toContain("olayGonder('view_content'");
    expect(yuzey(SAYFA)).not.toContain('dataLayer');
  });

  it('bilinmeyen içerik tipinde olay ATILMAZ (attribute elle kurcalanırsa)', () => {
    expect(SAYFA).toContain("if (tip === 'acik-kapi' || tip === 'etkinlik')");
  });

  it('tek mount — `querySelector` (ilki), `querySelectorAll` değil', () => {
    expect(SAYFA).toContain("document.querySelector<HTMLElement>('[data-olcum-sayfa]')");
    expect(SAYFA).not.toContain('querySelectorAll');
  });
});

describe('form_submit — kart yolunda da koşuyor (ADIM 0 bulgusu)', () => {
  it('push `result.status === \'success\'` bloğunun BAŞINDA', () => {
    const basari = FORM_YUZEY.indexOf("if (result.status === 'success') {");
    const formSubmit = FORM_YUZEY.indexOf("'form_submit',");
    const checkout = FORM_YUZEY.indexOf('if (result.checkoutUrl) {');
    expect(basari).toBeGreaterThan(-1);
    expect(checkout).toBeGreaterThan(-1);
    expect(formSubmit).toBeGreaterThan(basari);
    // KRİTİK: olay `checkoutUrl` erken dönüşünden ÖNCE.
    expect(formSubmit).toBeLessThan(checkout);
  });

  it('eski push (erken dönüşün ALTINDA kalan) yüzeyde kalmadı', () => {
    expect(yuzey(FORM)).not.toContain("window.dataLayer.push({ event: 'form_submit'");
  });

  it('eski hâlin KAYDI dosyada duruyor (KARAR 61 — silinmedi, taşındı)', () => {
    expect(FORM).toContain('BURADAN YUKARIYA TAŞINDI');
    expect(FORM).toContain("window.dataLayer.push({ event: 'form_submit', form_type: format });");
  });

  it('`form_type` değeri DEĞİŞMEDİ — hâlâ `format`', () => {
    expect(FORM).toContain('formType: format,');
  });

  it('tutar SUNUCUDAN (`result.odeme`), istemci hesabından değil', () => {
    expect(FORM).toContain('const olcumDeger = result.odeme?.tutar ?? 0;');
    expect(FORM).toContain('const olcumParaBirimi = result.odeme?.paraBirimi ?? null;');
    expect(FORM).toContain('const olcumYontem = result.odeme?.yontem ?? \'\';');
    expect(FORM).toContain('const olcumKayitId = result.referansNo ?? \'\';');
  });

  it('honeypot (`skip`) dalında olay ATILMAZ — bot Lead üretmesin', () => {
    const skip = FORM_YUZEY.indexOf("} else if (result.status === 'skip') {");
    const skipSonu = FORM_YUZEY.indexOf('} catch (err) {', skip);
    expect(skip).toBeGreaterThan(-1);
    expect(skipSonu).toBeGreaterThan(skip);
    expect(FORM_YUZEY.slice(skip, skipSonu)).not.toContain('olayGonder');
  });
});

describe('begin_checkout — yönlendirmeden ÖNCE', () => {
  it('`checkoutUrl` dalının başında, `window.location.href` atamasından önce', () => {
    const checkout = FORM_YUZEY.indexOf('if (result.checkoutUrl) {');
    const olay = FORM_YUZEY.indexOf("'begin_checkout',", checkout);
    const git = FORM_YUZEY.indexOf('window.location.href = result.checkoutUrl!;', checkout);
    expect(olay).toBeGreaterThan(checkout);
    expect(git).toBeGreaterThan(-1);
    expect(olay).toBeLessThan(git);
  });

  it('EK bekleme eklenmedi — İŞ 17 tabanı (1500 ms) zaten 300 ms güvencesini veriyor', () => {
    expect(FORM).toContain('EK BEKLEME KONULMADI');
    expect(FORM).toContain('GECIS_EN_AZ_MS');
    // begin_checkout için ikinci bir setTimeout kurulmadı: kart dalında
    // TEK `setTimeout` var ve o İŞ 17'nin tabanı.
    const checkout = FORM_YUZEY.indexOf('if (result.checkoutUrl) {');
    const dalSonu = FORM_YUZEY.indexOf('else git();', checkout);
    const dal = FORM_YUZEY.slice(checkout, dalSonu);
    expect(dal.match(/setTimeout/g) ?? []).toHaveLength(1);
  });

  it('`begin_checkout` ve `form_submit` AYNI Kayıt ID\'yi taşıyor (K-2)', () => {
    expect(FORM).toContain('kayitId: olcumKayitId,');
    expect((FORM.match(/kayitId: olcumKayitId,/g) ?? []).length).toBe(2);
  });
});

describe('purchase — `/odeme/tamam`', () => {
  it('sayfa bileşeni mount ediyor ve altı girdiyi veriyor', () => {
    expect(TAMAM).toContain("import OlcumPurchase from '../../components/OlcumPurchase.astro';");
    expect(TAMAM).toContain('<OlcumPurchase');
    for (const girdi of [
      'kayitDurumu={durum}',
      'odemeDurumu={kayit.odemeDurumu}',
      'odemeYontemi={kayit.odemeYontemi}',
      'kayitId={ref}',
      'tutar={kayit.tutar}',
      'paraBirimi={kayit.paraBirimiHam}',
    ]) {
      expect(TAMAM).toContain(girdi);
    }
  });

  it('`Ödeme Yöntemi` artık OKUNUYOR — ADIM 0\'da okunmuyordu (DUR koşulu 3 sınırı)', () => {
    expect(KAYIT_OKU).toContain("props['Ödeme Yöntemi']?.select?.name ?? ''");
    expect(KAYIT_OKU).toContain('odemeYontemi: string;');
    // Boş sonuçta da alan var — tip tutarlı, dallanma gerekmiyor.
    expect(KAYIT_OKU).toContain("odemeYontemi: '',");
  });

  it('kapı lib\'de koşuyor — bileşen kendi koşulunu yazmıyor', () => {
    expect(SATIN).toContain('purchaseAtilsinMi({');
    expect(SATIN).toContain('purchaseIsaretAnahtari');
  });

  it('uygun olmayan hâlde tutar YÜZEYE İNMEZ', () => {
    expect(SATIN).toContain("data-deger={sunucuUygun ? String(tutar) : undefined}");
    expect(SATIN).toContain("data-kayit-id={sunucuUygun ? kayitId : undefined}");
  });

  it('`localStorage` okunamazsa İŞARETLİ sayılır — fail-closed (çift Purchase olmasın)', () => {
    expect(SATIN).toContain('isaretliMi = true;');
    expect(SATIN).toContain('fail-closed');
  });

  it('işaret olay GİTTİKTEN SONRA konuyor', () => {
    const gonder = SATIN_YUZEY.indexOf('const gitti = olayGonder(');
    const isaret = SATIN_YUZEY.indexOf('localStorage.setItem(anahtar');
    expect(gonder).toBeGreaterThan(-1);
    expect(isaret).toBeGreaterThan(gonder);
    expect(SATIN).toContain('if (gitti) {');
  });

  it('Notion select dizeleri lib\'den geliyor, bileşende sabit yazılmıyor', () => {
    expect(SATIN).toContain('ODENDI');
    expect(SATIN).toContain('KART_YONTEMI');
    // Sabit dizeler YÜZEYDE geçmiyor — yorumlardaki anlatım serbest.
    expect(SATIN_YUZEY).not.toContain("'Ödendi'");
    expect(SATIN_YUZEY).not.toContain("'Kredi Kartı'");
  });
});

describe('tek otorite — hiçbir bileşen `dataLayer`\'a doğrudan push etmiyor', () => {
  it('üç ölçüm bileşeni ve KayitFormu lib üzerinden geçiyor', () => {
    for (const [ad, kaynak] of [
      ['OlcumSayfa', SAYFA],
      ['OlcumPurchase', SATIN],
      ['KayitFormu', FORM],
    ] as const) {
      expect(yuzey(kaynak), ad).not.toContain('dataLayer.push');
    }
  });

  it('`fbq` / `gtag` doğrudan çağrısı yok (KARAR 146 — kod yalnız GTM\'i bilir)', () => {
    for (const kaynak of [SAYFA, SATIN, FORM, TAMAM, ACIK_KAPI, ETKINLIK]) {
      expect(kaynak).not.toContain('fbq(');
      expect(kaynak).not.toContain('gtag(');
    }
  });
});
