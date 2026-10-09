import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * B118 — rıza kapısının YÜZEY disiplini.
 *
 * `vitest.config.ts` `environment: 'node'`, yani DOM yok ve `.astro`
 * frontmatter'ı koşturulamıyor. Kuralın kendisi `src/lib/riza.test.ts`'te
 * ölçülüyor; burada ölçülen şey **markup ve kapının yeri**: GTM snippet'inin
 * `Layout.astro`'da KALMADIĞI, `<noscript>` iframe'inin SİLİNDİĞİ, bandın
 * `hidden` doğduğu, iki düğmenin eşit ağırlıkta olduğu.
 *
 * Kaynak-seviyesi test (Footer.test.ts'in deseni) — `dist/` build'ine bağımlı
 * değil, ama dist ölçümünün yerine de geçmez (KARAM 577: türetilmiş yüzey
 * kaynağın yerine geçmez; kapanış raporunda `dist/client` sayımı ayrıca var).
 */

const KOK = join(__dirname, '..');
const BANT = readFileSync(join(KOK, 'components/RizaBandi.astro'), 'utf-8');
const LAYOUT = readFileSync(join(KOK, 'layouts/Layout.astro'), 'utf-8');
const FOOTER = readFileSync(join(KOK, 'components/Footer.astro'), 'utf-8');
const GIZLILIK = readFileSync(join(KOK, 'pages/gizlilik.astro'), 'utf-8');

/**
 * ⚠ YOKLUK ölçütleri yorumlara DEĞİL, basılan yüzeye karşı yazılır
 * (CLAUDE.md §3). Bu dosyanın ilk hâlinde iki ölçüt kırmızı yandı ve ikisi de
 * doğru koda itiraz ediyordu: `Layout.astro`'nun yorumu "eskiden `ns.html`
 * iframe'i koyuyordu" diyor, `gizlilik.astro`'nun yorumu kaldırılan hukuki
 * sebep cümlesini birebir alıntılıyor. İkisi de KORUNMASI GEREKEN tarihsel
 * anlatım (KIRPMA YASAĞI, KARAR 61) — "dosyada bu dize geçmesin" ölçütü onları
 * siler, kayıt kaybolur. O yüzden yokluk ölçütleri `yuzey()`'e karşı koşuyor.
 *
 * `{/* ... *\/}` Astro yorumları ve frontmatter `//` satırları atılır; geriye
 * tarayıcıya giden markup ve metin kalır.
 */
function yuzey(kaynak: string): string {
  return kaynak
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, ' ')
    .split('\n')
    .filter((satir) => !/^\s*\/\//.test(satir))
    .join('\n');
}

const LAYOUT_YUZEY = yuzey(LAYOUT);
const GIZLILIK_YUZEY = yuzey(GIZLILIK);

describe('Layout.astro — rızasız yükleme yolları KAPANDI', () => {
  it('koşulsuz `gtm.js` snippet\'i Layout\'ta YOK', () => {
    expect(LAYOUT_YUZEY).not.toContain('googletagmanager.com/gtm.js');
  });

  it('GTM `<noscript>` iframe\'i (`ns.html`) Layout\'ta YOK', () => {
    expect(LAYOUT_YUZEY).not.toContain('googletagmanager.com/ns.html');
    expect(LAYOUT_YUZEY).not.toContain('<noscript');
    expect(LAYOUT_YUZEY).not.toContain('<iframe');
  });

  it('kimlik yalnız `<body data-gtm>` olarak iniyor ve PROD+tanımlı koşuluna bağlı', () => {
    expect(LAYOUT).toContain('const gtmAttr = isProd && gtmId ? gtmId : undefined;');
    expect(LAYOUT).toContain('<body data-gtm={gtmAttr}>');
  });

  it('`window.dataLayer` KOŞULSUZ ve `is:inline` tanımlanıyor (olaylar rızadan bağımsız)', () => {
    expect(LAYOUT).toContain('<script is:inline>window.dataLayer = window.dataLayer || [];</script>');
  });

  it('`dataLayer` satırı `</head>` ÖNCESİNDE — hoisted olay script\'lerinden önce koşmalı', () => {
    const dataLayerYeri = LAYOUT.indexOf('window.dataLayer = window.dataLayer || []');
    const headSonu = LAYOUT.indexOf('</head>');
    expect(dataLayerYeri).toBeGreaterThan(-1);
    expect(dataLayerYeri).toBeLessThan(headSonu);
  });

  it('bant her sayfada mount ediliyor', () => {
    expect(LAYOUT).toContain("import RizaBandi from '../components/RizaBandi.astro';");
    expect(LAYOUT).toContain('<RizaBandi />');
  });
});

describe('RizaBandi.astro — GTM enjeksiyonunun TEK yeri', () => {
  it('`gtm.js` dizesi artık yalnız bu bileşende', () => {
    expect(BANT).toContain('https://www.googletagmanager.com/gtm.js?id=');
  });

  it('enjeksiyon idempotent (iki kez yüklenmez)', () => {
    expect(BANT).toContain('if (gtmYuklendi) return;');
  });

  it('kimlik `<body data-gtm>`den okunuyor; attribute yoksa GTM\'e dokunulmuyor', () => {
    expect(BANT).toContain('document.body?.dataset.gtm');
    expect(BANT).toContain('if (!kimlik) return;');
  });

  it('kural lib\'den IMPORT ediliyor — ikinci bir kopya yazılmamış', () => {
    expect(BANT).toContain("from '../lib/riza'");
    expect(BANT).toContain('gtmYuklensinMi');
    expect(BANT).toContain('bantGosterilsinMi');
    // Eşik ve anahtar adı bileşende SABİT olarak geçmiyor (tek otorite lib'de).
    expect(BANT).not.toContain('180');
    expect(BANT).not.toContain("'ocak-riza'");
  });

  it('`localStorage` okuması fail-closed: throw ederse rıza YOK sayılır', () => {
    expect(BANT).toMatch(/catch \{[\s\S]*?return null;/);
  });
});

describe('RizaBandi.astro — markup ve erişilebilirlik', () => {
  it('`hidden` DOĞUYOR — SSR önbelleği bir kadının kararını başkasına taşımasın', () => {
    expect(BANT).toMatch(/<div class="riza-bant" data-riza-bant[^>]*hidden>/);
  });

  it('`role="region"` + `aria-label="Çerez tercihi"`', () => {
    expect(BANT).toContain('role="region"');
    expect(BANT).toContain('aria-label="Çerez tercihi"');
  });

  it('iki düğme de gerçek `<button type="button">` — klavyeyle erişilir', () => {
    expect(BANT).toContain('<button class="riza-bant__dugme riza-bant__dugme--kabul" type="button" data-riza-kabul>');
    expect(BANT).toContain('<button class="riza-bant__dugme riza-bant__dugme--ret" type="button" data-riza-ret>');
  });

  it('düğme metinleri brief ile birebir', () => {
    expect(BANT).toContain('Kabul et\n');
    expect(BANT).toContain('Kabul etme\n');
  });

  it('iki düğme EŞİT AĞIRLIKTA: ortak sınıf tek yerde boyut ve tipografi veriyor', () => {
    // `min-height` ve `min-width` yalnız ORTAK sınıfta; varyantlar sadece renk.
    const ortak = BANT.slice(BANT.indexOf('.riza-bant__dugme {'), BANT.indexOf('.riza-bant__dugme--kabul'));
    expect(ortak).toContain('min-height: 44px');
    expect(ortak).toContain('min-width: 8.5rem');
    const kabul = BANT.slice(BANT.indexOf('.riza-bant__dugme--kabul {'), BANT.indexOf('.riza-bant__dugme--ret'));
    expect(kabul).not.toContain('min-height');
    expect(kabul).not.toContain('font-size');
    expect(kabul).not.toContain('display: none');
  });

  it('ret düğmesi gizlenmiyor / küçültülmüyor', () => {
    const ret = BANT.slice(BANT.indexOf('.riza-bant__dugme--ret {'));
    expect(ret).not.toContain('display: none');
    expect(ret).not.toContain('visibility: hidden');
    expect(ret).not.toContain('opacity: 0');
  });

  it('modal DEĞİL: `position: fixed` + alt bant, overlay/backdrop yok', () => {
    expect(BANT).toContain('position: fixed');
    expect(BANT).toContain('bottom: 0');
    expect(BANT).not.toContain('role="dialog"');
    expect(BANT).not.toContain('backdrop');
    expect(BANT).not.toContain('inset: 0');
  });

  it('iPhone güvenli alanı hesaba katılıyor', () => {
    expect(BANT).toContain('env(safe-area-inset-bottom');
  });

  it('bant açıkken `body` alt dolgusu ÖLÇÜLEN yükseklik kadar artıyor (sabit tahmin değil)', () => {
    expect(BANT).toContain('--riza-bant-h');
    expect(BANT).toContain(':global(html[data-riza-acik] body) {');
    expect(BANT).toContain('padding-bottom: var(--riza-bant-h, 0px);');
    expect(BANT).toContain('getBoundingClientRect().height');
  });

  it('yüzen WhatsApp düğmesi de bandın üstüne çıkıyor (örtüşme yok)', () => {
    expect(BANT).toContain(':global(html[data-riza-acik] .wa-yuzen)');
  });

  it('z-index yüzen düğme (150) üstü, --z-overlay (200) altı', () => {
    expect(BANT).toContain('z-index: 160;');
  });

  it('beyaz (#FFFFFF) yok, sabit hex yok — renkler token\'dan (KARAR: beyaz yasak)', () => {
    expect(BANT).not.toMatch(/#fff/i);
    expect(BANT).not.toMatch(/#[0-9a-f]{6}\b/i);
    expect(BANT).toContain('var(--ash)');
    expect(BANT).toContain('var(--cream)');
  });

  it('ilk sınıf `ocak-` ile BAŞLAMIYOR (KARAR 375 — baseline prose kuralına yakalanmasın)', () => {
    const siniflar = [...BANT.matchAll(/class="([^"]+)"/g)].map((m) => m[1].split(/\s+/)[0]);
    expect(siniflar.length).toBeGreaterThan(0);
    for (const ilk of siniflar) {
      expect(ilk.startsWith('ocak-')).toBe(false);
    }
  });

  it('bant metni brief taslağıyla birebir (lint\'ten geçmiş hâli)', () => {
    const duz = BANT.replace(/\s+/g, ' ');
    expect(duz).toContain(
      "Siteyi nasıl kullandığını görmek ve OCAK'ı duyurmak için çerez kullanıyoruz. " +
        'Kabul edersen ölçüm ve reklam çerezleri çalışır; etmezsen site aynı şekilde açılır.',
    );
  });

  it('`Ayrıntı` bağlantısı gizlilik sayfasının çerez bölümüne gidiyor', () => {
    expect(BANT).toContain('href="/gizlilik#cerez"');
    expect(BANT).toContain('>Ayrıntı</a>');
    // Hedef gerçekten var mı — kırık çapa sessizce sayfa başına düşer.
    expect(GIZLILIK).toContain('<h2 id="cerez">Çerez Politikası</h2>');
  });
});

describe('Footer — geri alma yüzeyi HER sayfada', () => {
  it('`Çerez tercihleri` düğmesi var ve `data-riza-ac` taşıyor', () => {
    expect(FOOTER).toContain('<button class="footer__riza" type="button" data-riza-ac>Çerez tercihleri</button>');
  });

  it('bant script\'i bu kancayı dinliyor', () => {
    expect(BANT).toContain("document.querySelectorAll('[data-riza-ac]')");
  });
});

describe('B118 ATOMİKLİK — bant ile gizlilik metni aynı commit\'te', () => {
  it('cümle 1: onay şartı + geri alma yolu', () => {
    const duz = GIZLILIK.replace(/\s+/g, ' ');
    expect(duz).toContain('Analitik ve pazarlama çerezleri yalnızca onay vermeniz hâlinde çalışır.');
    expect(duz).toContain(
      'Onayınızı her sayfanın altındaki "Çerez tercihleri" bağlantısından dilediğiniz an geri alabilirsiniz.',
    );
  });

  it('cümle 2: onayla çalışan araçların adı', () => {
    const duz = GIZLILIK.replace(/\s+/g, ' ');
    expect(duz).toContain(
      'Onay vermeniz hâlinde kullanılan araçlar: Google Tag Manager, Google Analytics ve Meta Pixel.',
    );
  });

  it('cümle 3 (İŞ C): kaynak etiketi', () => {
    const duz = GIZLILIK.replace(/\s+/g, ' ');
    expect(duz).toContain(
      'Kayıt olurken, siteye hangi bağlantıdan ulaştığınızı gösteren kaynak etiketi kaydınızla birlikte saklanır.',
    );
  });

  it('cümle 4 (B119): bülten ölçümü', () => {
    const duz = GIZLILIK.replace(/\s+/g, ' ');
    expect(duz).toContain(
      "Ateş Mektupları'nda e-postanın açılıp açılmadığı ve içindeki bağlantılara tıklanıp tıklanmadığı, mektupları iyileştirmek amacıyla ölçülür.",
    );
  });

  it('ÇELİŞEN eski cümle BASILAN METİNDEN kaldırıldı (yorumdaki alıntı korunur)', () => {
    const duz = GIZLILIK_YUZEY.replace(/\s+/g, ' ');
    expect(duz).not.toContain(
      'Analitik ve pazarlama çerezleri ise meşru menfaatlerimiz ve — gerekli olduğu ölçüde — açık rızanız doğrultusunda kullanılır.',
    );
    // Kaldırılan cümlenin KAYDI dosyada duruyor — KIRPMA YASAĞI (KARAR 61):
    // içerik silinmez, dönüştürülür ve niçin dönüştüğü yazılır.
    expect(GIZLILIK).toContain('ESKİ CÜMLE DEĞİŞTİ, yanına eklenmedi');
    // Alıntı yorumda satır sarmalı duruyor — boşluk normalize edilerek aranır.
    expect(GIZLILIK.replace(/\s+/g, ' ')).toContain(
      'Analitik ve pazarlama çerezleri ise meşru menfaatlerimiz ve — gerekli olduğu ölçüde — açık rızanız doğrultusunda kullanılır.',
    );
  });

  it('metin hukuki dille ve "siz" hitabıyla — marka sesi (sen/senin) girmiyor', () => {
    // Yeni eklenen dört cümlenin hiçbiri 2. tekil kullanmıyor.
    for (const cumle of [
      'Analitik ve pazarlama çerezleri yalnızca onay vermeniz',
      'Onay vermeniz hâlinde kullanılan araçlar',
      'Kayıt olurken, siteye hangi bağlantıdan',
      "Ateş Mektupları'nda e-postanın açılıp",
    ]) {
      expect(GIZLILIK.replace(/\s+/g, ' ')).toContain(cumle);
    }
    expect(GIZLILIK).toContain('Son güncelleme: 9 Ekim 2026');
  });
});
