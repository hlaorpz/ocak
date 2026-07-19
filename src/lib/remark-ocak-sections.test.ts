import { describe, it, expect, vi, afterEach } from 'vitest';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkFrontmatter from 'remark-frontmatter';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import remarkOcakSections from './remark-ocak-sections';

const FIXTURES_DIR = join(__dirname, '__fixtures__');

/** Markdown string'ini plugin zincirinden geçirip HTML üretir. */
function process(md: string, options = {}) {
  const result = unified()
    .use(remarkParse)
    .use(remarkFrontmatter, ['yaml'])
    .use(remarkOcakSections, options)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .processSync(md);
  return String(result);
}

/** Bir fixture dosyasını okuyup render eder. */
function render(fixtureName: string, options = {}) {
  const md = readFileSync(join(FIXTURES_DIR, fixtureName), 'utf-8');
  return process(md, options);
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('remark-ocak-sections', () => {
  it('1. hero — <section data-section="hero"> ile sarar, h1 içerir', () => {
    const html = render('fixture-01-hero.md');
    expect(html.trimStart().startsWith('<section data-section="hero">')).toBe(true);
    expect(html).toContain('<h1>');
    expect(html).toContain('Her ay bir kez. On iki kadın. Bir ateş.');
    expect(html).toMatchSnapshot();
  });

  it('2. bir-sonraki — section içinde blockquote, ocak-bir-sonraki class', () => {
    const html = render('fixture-02-bir-sonraki.md');
    // #25 Brief A item 4: class="ocak-bir-sonraki" eklendi — baseline match için.
    expect(html).toContain('<section data-section="bir-sonraki" class="ocak-bir-sonraki">');
    expect(html).toContain('<blockquote>');
    expect(html).toMatchSnapshot();
  });

  it('4. siradaki-kapi — tam 3 ocak-kapi-kart', () => {
    const html = render('fixture-04-siradaki-kapi.md');
    expect(html).toContain('<section data-section="siradaki-kapi">');
    expect(html.match(/ocak-kapi-kart/g)?.length).toBe(3);
    expect(html).toMatchSnapshot();
  });

  it('5. sss — bullet sorular details/summary + sss-cevap, h2 korunur', () => {
    const html = render('fixture-05-sss.md');
    expect(html).toContain('<section data-section="sss">');
    expect(html).toContain('<h2>Sorulanlar</h2>');
    expect(html.match(/<details>/g)?.length).toBe(2);
    expect(html.match(/<summary>/g)?.length).toBe(2);
    // summary metni yıldızsız (bold-italik dekorasyon arındırıldı)
    expect(html).toContain('<summary>Daha önce hiç çembere katılmadım, olur mu?</summary>');
    // cevap <div class="sss-cevap"> içinde; ilk soru 2 paragraflı
    expect(html.match(/<div class="sss-cevap">/g)?.length).toBe(2);
    const ilkCevap = html.match(/<div class="sss-cevap">([\s\S]*?)<\/div>/)?.[1] ?? '';
    expect(ilkCevap.match(/<p>/g)?.length).toBe(2);
    expect(html).toMatchSnapshot();
  });

  it('5b. sss — B+I marker varyantları hepsi accordion (_**x**_ ve **_x_**)', () => {
    // Notion B+I toggle'ı deseni değişkendir; node-shape parser hepsini kabul eder.
    // Bu test parser'a ileride regex refactor'u gelirse pattern-desteği kaybını yakalar.
    const html = process(
      '## section: sss\n\n' +
        '- _**Alt-tire çift-yıldız — soru bir?**_\n\n' +
        'Cevap bir.\n\n' +
        '- **_Çift-yıldız alt-tire — soru iki?_**\n\n' +
        'Cevap iki.\n\n' +
        '- ***Üç yıldız — soru üç?***\n\n' +
        'Cevap üç.\n',
    );
    expect(html.match(/<details>/g)?.length).toBe(3);
    expect(html.match(/<summary>/g)?.length).toBe(3);
    // Summary metinleri düz metin — markdown dekorasyonu ağaç dışında kalır
    expect(html).toContain('<summary>Alt-tire çift-yıldız — soru bir?</summary>');
    expect(html).toContain('<summary>Çift-yıldız alt-tire — soru iki?</summary>');
    expect(html).toContain('<summary>Üç yıldız — soru üç?</summary>');
    // summary içinde ham <strong> veya <em> KALMAZ
    expect(html).not.toMatch(/<summary>[^<]*<(strong|em)/);
  });

  it('10. sss fallback — H3 içerik <details> üretmez, warn tetikler', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const html = process(
      '## section: sss\n\n### Bu bir H3 soru?\n\nCevap.',
      { filename: 'fallback-test.md' },
    );
    // fallback: içerik olduğu gibi sarılır, details YOK
    expect(html).toContain('<section data-section="sss">');
    expect(html).not.toContain('<details>');
    expect(html).toContain('<h3>Bu bir H3 soru?</h3>');
    expect(warn).toHaveBeenCalled();
    expect(warn.mock.calls[0][0]).toContain('fallback-test.md');
    expect(warn.mock.calls[0][0]).toContain('hasH3=true');
  });

  it('6. serbest prose — ocak-{name} class ile sarar', () => {
    const html = process('## section: kucuk-cember\n\nBir paragraf.');
    expect(html).toContain(
      '<section data-section="kucuk-cember" class="ocak-kucuk-cember">',
    );
    expect(html).toContain('<p>Bir paragraf.</p>');
  });

  it('8. hero — gövdedeki "overline: AD" data-overline attribute\'una taşınır', () => {
    const html = process(
      '## section: hero\n\noverline: ÇEMBER\n\n# *Başlık*\n\nAçıklama paragrafı.',
    );
    // overline değeri attribute'a taşındı (ALL CAPS verbatim)
    expect(html).toContain('<section data-section="hero" data-overline="ÇEMBER">');
    // "overline:" düz metin olarak body'de KALMAMALI
    expect(html).not.toContain('overline:');
    // geri kalan içerik korunur
    expect(html).toContain('<h1><em>Başlık</em></h1>');
    expect(html).toContain('<p>Açıklama paragrafı.</p>');
  });

  it('9. hero — overline yoksa data-overline yazılmaz, içerik değişmez', () => {
    const html = process('## section: hero\n\n# Başlık\n\nParagraf.');
    expect(html.trimStart().startsWith('<section data-section="hero">')).toBe(true);
    expect(html).not.toContain('data-overline');
    expect(html).toContain('<h1>Başlık</h1>');
  });

  it('11. OMIT — hero-anasayfa + ates-mektuplari hiç emit edilmez, komşu section korunur', () => {
    const html = process(
      '## section: hero-anasayfa\n\noverline: OCAK\n\n# Başlık\n\nAlt metin.\n\n' +
        '## section: manifesto\n\nManifesto metni.\n\n' +
        '## section: ates-mektuplari\n\n[FORM]\n\nPlaceholder: E-postan',
    );
    // omit edilen iki section hiç çıkmaz
    expect(html).not.toContain('hero-anasayfa');
    expect(html).not.toContain('data-overline="OCAK"');
    expect(html).not.toContain('ates-mektuplari');
    expect(html).not.toContain('[FORM]');
    // aradaki normal section korunur — id="manifesto" ADIM 3 hero CTA hedefi
    // (brief-hero-gecis.md), dar-emit KARAR 87 kapalı set.
    expect(html).toContain('<section id="manifesto" data-section="manifesto" class="ocak-manifesto">');
    expect(html).toContain('Manifesto metni.');
  });

  it('7. siradaki-kapi — 1 kart console.warn tetikler', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    process('## section: siradaki-kapi\n\n### Tek Kart\n\nParagraf.\n\n[Link](/a)');
    expect(warn).toHaveBeenCalled();
    expect(warn.mock.calls[0][0]).toContain('1 kart');
    expect(warn.mock.calls[0][0]).toContain('unknown');

    warn.mockClear();
    process('## section: siradaki-kapi\n\n### Tek Kart\n\nParagraf.\n\n[Link](/a)', {
      filename: 'cember.md',
    });
    expect(warn).toHaveBeenCalled();
    expect(warn.mock.calls[0][0]).toContain('cember.md');
  });

  it('12. overline — default section (bullet listesi sonrası) data-overline alır', () => {
    // al-ol-ver artık fragment-split marker pattern'inde (KARAR 127 genişletme);
    // empty-wrapper case'i tetiklendiği için pattern'i non-special section ile
    // test ederiz (kucuk-cember default case'ten geçer, overline + class alır).
    const html = process(
      '## section: kucuk-cember\n\noverline: ÇEMBER NEDIR\n\n- **Bir** — yargısız\n- **İki** — koşulsuz\n',
    );
    expect(html).toContain('data-section="kucuk-cember"');
    expect(html).toContain('class="ocak-kucuk-cember"');
    expect(html).toContain('data-overline="ÇEMBER NEDIR"');
    expect(html).not.toMatch(/<p>overline:/);
  });

  it('13. overline — esik-kadini default section data-overline alır, kapanış cümlesi korunur', () => {
    const html = render('fixture-07-overline-esik.md');
    expect(html).toContain('data-section="esik-kadini"');
    expect(html).toContain('data-overline="KİME SESLENİYORUZ"');
    expect(html).not.toMatch(/<p>overline:/);
    expect(html).toContain('Eşikte duran kadına.');
    expect(html).toContain('Yalnız durma o eşikte.');
  });

  it('14. sonraki-bulusma marker — empty wrapper emit, source attr taşır, komşular korunur', () => {
    // KARAR 127 genişletme: artık OMIT değil, plugin empty wrapper basıyor
    // (defansif fallback — loader splitBodyByMarkers marker'ı keserse plugin
    // buraya gelmez; gelirse boş section emit edilir, CSS prose section ailesi
    // görsel olarak suppress eder).
    const html = render('fixture-08-sonraki-bulusma-marker.md');
    expect(html).toContain('data-section="sonraki-bulusma"');
    expect(html).toContain('class="ocak-sonraki-bulusma"');
    expect(html).toContain('data-source="bulusmalar:next-3"');
    expect(html).toContain('data-section="hero"');
    expect(html).toContain('data-section="bir-sonraki"');
    expect(html).toContain('<blockquote>');
  });

  it('14b. al-ol-ver marker — empty wrapper emit, komşu section korunur', () => {
    // KARAR 127 genişletme: al-ol-ver fragment-split marker pattern'inde
    // (form-anchor paralel). Loader marker'ı keser ve fragments dizisine
    // { kind: 'al-ol-ver' } basar; plugin marker'ı görmez. Bu test plugin
    // savunma fallback'ini doğruluyor (marker bir şekilde loader'dan kaçarsa
    // empty wrapper emit edilir).
    const html = render('fixture-18-al-ol-ver-marker.md');
    expect(html).toContain('data-section="al-ol-ver"');
    expect(html).toContain('class="ocak-al-ol-ver"');
    expect(html).toContain('data-section="hero"');
  });

  it('15. link normalize — Notion italik link artığı `_url_` / `*url` baş+son strip', () => {
    const html = render('fixture-09-link-italik-artik.md');
    // İtalik artığı strip + internal Notion link normalize tek pipeline'da uygulanır
    // (#26 Brief F): baş/son `_`/`*` sıyrılır → ardından `notion.so/<slug>` whitelist
    // match → `/<slug>`. Bu fixture'daki üç URL de internal whitelist'te.
    expect(html).toContain('href="/takvim"');
    expect(html).toContain('href="/anadolu"');
    expect(html).toContain('href="/mini-retreat"');
    // External (whitelist dışı) — dokunulmaz, snake_case path korunur
    expect(html).toContain('href="https://example.com/foo_bar/baz"');
    // Hiçbir bozuk varyant kalmamalı: href başında veya sonunda _ ya da *
    expect(html).not.toMatch(/href="[_*]/);
    // Eski Notion URL formu sızmamalı — hepsi normalize edilmiş olmalı
    expect(html).not.toContain('href="https://www.notion.so/');
  });

  it('19. Notion internal link normalize — whitelist match `/<slug>`, dışı korunur (Brief F)', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const html = render('fixture-13-notion-link-normalize.md');
    // Internal direct slug → `/cember`
    expect(html).toContain('href="/cember"');
    // Workspace prefix + 32-hex hash → slug çıkarılır, whitelist'te atolye → `/atolye`
    expect(html).toContain('href="/atolye"');
    // Whitelist dışı slug → korunur (warn log'da)
    expect(html).toContain('href="https://www.notion.so/external-page-xyz"');
    // Normal external → dokunulmaz
    expect(html).toContain('href="https://example.com/sayfa"');
    // Hash fragment regex match etmez → korunur
    expect(html).toContain('href="https://www.notion.so/#mektuplar"');
    // Nested path: regex `kayit/yaz-acik-kapi-2026`'yi slug yakalar ama whitelist dışı → korunur
    expect(html).toContain('href="https://www.notion.so/kayit/yaz-acik-kapi-2026"');
    // ocak.biz canonical → /<slug> (Brief F.5)
    expect(html).toContain('href="/cember"'); // duplicate slug var; whitelist match'i doğrular
    expect(html).toContain('href="/anadolu"');
    // ocak.biz whitelist dışı → korunur
    expect(html).toContain('href="https://ocak.biz/eski-sayfa"');
    // Nested basvuru/<slug>-<yıl> — Notion ve ocak.biz formları, whitelist içi → `/<slug>/basvuru`
    expect(html).toContain('href="/anadolu/basvuru"');
    // Nested basvuru whitelist dışı → korunur + warn
    expect(html).toContain('href="https://ocak.biz/basvuru/unknown-2026"');
    // app.notion.com page-mention (MADDE 5) — tek-parça + çok-parça slug whitelist içi
    expect(html).toContain('href="/ekip"');
    expect(html).toContain('href="/sehir-aksami"');
    // app.notion.com whitelist dışı → korunur + warn
    expect(html).toContain(
      'href="https://app.notion.com/p/external-app-abc123def456abc123def456abc123de?pvs=21"',
    );
    // Warn çağrıları: 2 notion.so external + 1 ocak.biz external + 1 ocak.biz basvuru/ external
    // + 1 app.notion.com external
    const calls = warn.mock.calls.map((c) => c[0]).filter((m) => typeof m === 'string');
    expect(calls.some((m) => m.includes('external-page-xyz'))).toBe(true);
    expect(calls.some((m) => m.includes('yaz-acik-kapi-2026'))).toBe(true);
    expect(calls.some((m) => m.includes('eski-sayfa') && m.includes('ocak.biz'))).toBe(true);
    expect(calls.some((m) => m.includes('unknown-2026') && m.includes('basvuru'))).toBe(true);
    expect(calls.some((m) => m.includes('external-app') && m.includes('app.notion.com'))).toBe(true);
    warn.mockRestore();
  });

  it('20. form-anchor scalar — tek anchor, data-form-index="0" boş section', () => {
    const html = render('fixture-14-form-anchor-scalar.md');
    expect(html).toContain(
      '<section data-section="form-anchor" data-form-anchor data-form-index="0"></section>',
    );
    // Sadece 1 form-anchor olmalı
    expect(html.match(/data-form-anchor/g)?.length).toBe(1);
    // Komşu section'lar korunur
    expect(html).toContain('data-section="hero"');
    expect(html).toContain('data-section="sss"');
  });

  it('21. form-anchor array — iki anchor 0/1 index, sayfa içi sıra korunur', () => {
    const html = render('fixture-15-form-anchor-array.md');
    expect(html).toContain('data-form-index="0"');
    expect(html).toContain('data-form-index="1"');
    expect(html.match(/data-form-anchor/g)?.length).toBe(2);
    // Sıra: bize-yaz → 0 → alt-davet → 1 → sss (indexOf monoton artmalı).
    // Plugin look-backward'ı bilmez (loader işi) — etiketleri olduğu gibi emit eder.
    // Not: fixture'da `alt-davet` yerine `ates-mektuplari` kullanılırsa plugin OMIT_SECTIONS
    // onu yutar (ana sayfa AtesMektuplari component slot'u için ayrılmış); o yüzden
    // jenerik bir intro section adı seçildi. /iletisim runtime davranışı loader testinde
    // (notion-pages.test.ts "çoklu form-anchor — her biri kendi look-backward consume eder")
    // ates-mektuplari verbatim ile doğrulanır.
    const i0 = html.indexOf('data-section="bize-yaz"');
    const a0 = html.indexOf('data-form-index="0"');
    const i1 = html.indexOf('data-section="alt-davet"');
    const a1 = html.indexOf('data-form-index="1"');
    const iS = html.indexOf('data-section="sss"');
    expect(i0).toBeGreaterThan(-1);
    expect(a0).toBeGreaterThan(i0);
    expect(i1).toBeGreaterThan(a0);
    expect(a1).toBeGreaterThan(i1);
    expect(iS).toBeGreaterThan(a1);
  });

  it('22. mini-cta — paragraph + link son child sıyrılır (bare <a> block-level)', () => {
    const html = render('fixture-16-mini-cta.md');
    expect(html).toContain('<section data-section="mini-cta" class="ocak-mini-cta">');
    expect(html).toContain('<p>Hangi formatın');
    // Link son child sıyrılmış (link bare, paragraph wrapper YOK)
    expect(html).toContain('<a href="/acik-kapi">Açık Kapı\'ya gel</a>');
    expect(html).not.toMatch(/<p><a href="\/acik-kapi"/);
  });

  it('23. mini-cta — link yoksa warn + section yine sarılır', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const html = process('## section: mini-cta\n\nSadece metin, link yok.', {
      filename: 'no-link.md',
    });
    expect(html).toContain('<section data-section="mini-cta" class="ocak-mini-cta">');
    expect(html).toContain('Sadece metin');
    expect(warn).toHaveBeenCalled();
    expect(warn.mock.calls[0][0]).toContain('link bulunamadı');
    expect(warn.mock.calls[0][0]).toContain('no-link.md');
    warn.mockRestore();
  });

  it('24. buyuk-vurgu — italik paragraph data-section + ocak-buyuk-vurgu class', () => {
    const html = render('fixture-17-buyuk-vurgu.md');
    expect(html).toContain('<section data-section="buyuk-vurgu" class="ocak-buyuk-vurgu">');
    expect(html).toContain('<em>Bir daha kriz geldiğinde');
    // Tek paragraph beklenir — warn olmamalı
  });

  it('25. buyuk-vurgu — 2+ paragraph warn, ama hepsi render edilir', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const html = process(
      '## section: buyuk-vurgu\n\n*İlk paragraf.*\n\n*İkinci paragraf.*',
      { filename: 'multi-para.md' },
    );
    expect(html).toContain('<section data-section="buyuk-vurgu"');
    expect(html).toContain('İlk paragraf');
    expect(html).toContain('İkinci paragraf');
    expect(warn).toHaveBeenCalled();
    expect(warn.mock.calls[0][0]).toContain('2 paragraph');
    expect(warn.mock.calls[0][0]).toContain('multi-para.md');
    warn.mockRestore();
  });

  it('30. manifesto-vurgu — köz glyph span + krem prose paragraph (KARAR 153)', () => {
    const html = render('fixture-20-manifesto-vurgu.md');
    expect(html).toContain('<section data-section="manifesto-vurgu" class="ocak-manifesto-vurgu">');
    // Köz glyph dekoratif span — paragraph'tan ÖNCE, aria-hidden
    expect(html).toContain('<span class="manifesto-vurgu__ember" aria-hidden="true"></span>');
    const spanIdx = html.indexOf('manifesto-vurgu__ember');
    const pIdx = html.indexOf('<p>Seni bize bağımlı');
    expect(spanIdx).toBeGreaterThan(-1);
    expect(pIdx).toBeGreaterThan(spanIdx);
    // Manifesto cümlesi düz prose paragraph
    expect(html).toContain('Seni bize bağımlı yapmak için değil');
    expect(html).toContain('seni sana geri vermek için buradayız');
    // Tek paragraph beklenir — warn olmamalı (snapshot atılmaz, sıkı match yeterli)
  });

  it('31. manifesto-vurgu — 2+ paragraph warn, hepsi yine render edilir', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const html = process(
      '## section: manifesto-vurgu\n\nİlk paragraf.\n\nİkinci paragraf.',
      { filename: 'multi-para-mv.md' },
    );
    expect(html).toContain('<section data-section="manifesto-vurgu"');
    expect(html).toContain('<span class="manifesto-vurgu__ember" aria-hidden="true"></span>');
    expect(html).toContain('İlk paragraf');
    expect(html).toContain('İkinci paragraf');
    expect(warn).toHaveBeenCalled();
    expect(warn.mock.calls[0][0]).toContain('2 paragraph');
    expect(warn.mock.calls[0][0]).toContain('multi-para-mv.md');
    warn.mockRestore();
  });

  it('32. ic-ses — krem prose paragraph, GLYPH YOK (manifesto-vurgu ile imza ayrımı)', () => {
    const html = render('fixture-21-ic-ses.md');
    // Section + class doğru
    expect(html).toContain('<section data-section="ic-ses" class="ocak-ic-ses">');
    // Prose paragraph içeride, içerik korunmuş
    expect(html).toContain('İçinden gelen sesi bastırma');
    expect(html).toContain('o ses sana yolu söylüyor');
    // KRİTİK imza assert: ic-ses GLYPH EMIT ETMEZ
    // manifesto-vurgu'dan farkı budur — palette'in karışmaması için.
    expect(html).not.toContain('manifesto-vurgu__ember');
    expect(html).not.toContain('ic-ses__ember');
    expect(html).not.toMatch(/<span[^>]*aria-hidden="true"[^>]*><\/span>/);
    // Açılış tag'inden hemen sonra <p> gelmeli (araya dekoratif span girmemiş)
    const m = html.match(
      /<section data-section="ic-ses" class="ocak-ic-ses">\s*<p>/,
    );
    expect(m).not.toBeNull();
  });

  it('33. ic-ses — 2+ paragraph warn, hepsi yine render edilir, glyph hâlâ YOK', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const html = process(
      '## section: ic-ses\n\nİlk nefes.\n\nİkinci nefes.',
      { filename: 'multi-para-is.md' },
    );
    expect(html).toContain('<section data-section="ic-ses" class="ocak-ic-ses">');
    expect(html).toContain('İlk nefes');
    expect(html).toContain('İkinci nefes');
    // Çoklu paragraf bile glyph getirmemeli (ic-ses imzası)
    expect(html).not.toContain('__ember');
    expect(warn).toHaveBeenCalled();
    expect(warn.mock.calls[0][0]).toContain('2 paragraph');
    expect(warn.mock.calls[0][0]).toContain('multi-para-is.md');
    warn.mockRestore();
  });

  it('18. listItem text başında asimetrik `*` artığı strip — KARAR 108 7. kural', () => {
    const html = render('fixture-12-listitem-asymmetric-star.md');
    // Asimetrik 4/3 yıldız → text node başında kalan `*` strip edilmiş, içerik bold+italik
    expect(html).toContain('<li><em><strong>Bir geçişin içindesin</strong></em> — boşanma');
    expect(html).toContain('<li><em><strong>Eski araçların artık yetmiyor</strong></em> — terapi');
    expect(html).toContain('<li><em><strong>"Bir şey değişmeli"</strong></em> diyorsun.');
    // Hiçbir li hâlâ `*` ile başlamamalı
    expect(html).not.toMatch(/<li[^>]*>\*/);
    // Sağlam 3+3 markdown korunur — başında strip yok
    expect(html).toContain('<li><em><strong>Doğru italik+bold</strong></em> — hiç dokunma');
    // Düz paragraph (listItem değil) — strip kuralı KAPSAMAZ
    expect(html).toContain('<p>*Düz metin başında yıldız var ama bullet değil — bu farklı bir durum.</p>');
  });

  it('17. whitespace-only paragraph + blockquote — mdast tree post-order temizliği', () => {
    const html = render('fixture-11-whitespace-temizlik.md');
    // İçerikli paragraph'lar korunur
    expect(html).toContain('Önce dolu paragraph.');
    expect(html).toContain('Sonra dolu paragraph.');
    expect(html).toContain('Dolu blockquote.');
    expect(html).toContain('İçerikli iç paragraph korunur.');
    // Tamamen boş blockquote'lar (sadece > > > satırları) tree'den kaldırılır.
    // dolu blockquote 1 tane + nested test 1 outer + 1 inner-empty(silinmeli) = 2 blockquote kalır
    expect(html.match(/<blockquote>/g)?.length).toBe(2);
    // Empty paragraph yok
    expect(html).not.toMatch(/<p>\s*<\/p>/);
    // Empty blockquote yok
    expect(html).not.toMatch(/<blockquote>\s*<\/blockquote>/);
  });

  it('26. esik accordion — whitelist 10 isim details name="esikler", h2 strip → summary', () => {
    const html = render('fixture-19-esik-accordion.md');
    // İki esik section (uyku, merak) details olarak basılır — exclusive accordion namespace
    expect(html.match(/<details name="esikler"/g)?.length).toBe(2);
    expect(html).toContain('<details name="esikler" data-section="esik-uyku">');
    expect(html).toContain('<details name="esikler" data-section="esik-merak">');
    // H2 strip + summary'ye verbatim taşındı (numara + bullet karakteri korundu)
    expect(html).toContain('<summary>0 · UYKU</summary>');
    expect(html).toContain('<summary>1 · MERAK</summary>');
    // H2 ham olarak details body'sinde KALMAMALI (strip teyidi)
    expect(html).not.toContain('<h2>0 · UYKU</h2>');
    expect(html).not.toContain('<h2>1 · MERAK</h2>');
    // Section içeriği details'in içinde
    expect(html).toContain('Hayatın işliyor.');
    expect(html).toContain("OCAK'ı duydun.");
    expect(html).toMatchSnapshot();
  });

  it('27. son-soz — baseline prose, accordion DEĞİL, h2 korunur', () => {
    const html = render('fixture-19-esik-accordion.md');
    // son-soz baseline prose — `<section data-section="son-soz" class="ocak-son-soz">`
    expect(html).toContain('<section data-section="son-soz" class="ocak-son-soz">');
    // son-soz'da `<details name="esikler">` OLMAMALI
    const sonSozMatch = html.match(
      /<section data-section="son-soz"[^>]*>([\s\S]*?)<\/section>/,
    );
    expect(sonSozMatch).not.toBeNull();
    expect(sonSozMatch?.[1]).not.toContain('<details');
    expect(sonSozMatch?.[1]).not.toContain('<summary');
    // H2 baseline prose'da serbest kalır
    expect(html).toContain('<h2>Son Söz</h2>');
    expect(html).toContain('Bu harita bir test değil.');
  });

  it('28. esik whitelist — `esik-kadini` accordion DEĞİL, baseline prose kalır', () => {
    // esik-kadini /, /hikaye, /site-rehber'de prose section — whitelist dışında olmalı.
    // fixture-07 zaten esik-kadini render eder; burada açıkça accordion'a düşmediğini doğruluyoruz.
    const html = render('fixture-07-overline-esik.md');
    expect(html).toContain('data-section="esik-kadini"');
    expect(html).toContain('class="ocak-esik-kadini"');
    // KRİTİK: esik-kadini accordion wrap'ı ALMAMALI (silent bug regression check)
    expect(html).not.toContain('<details name="esikler"');
    expect(html).not.toMatch(/<details[^>]*data-section="esik-kadini"/);
  });

  it('34. evre — EVRE_SECTIONS whitelist Varyant C dolu kart, ısı token + arketip/soru çifti', () => {
    const html = render('fixture-22-evre-kartlari.md');
    // 3 evre kartı article olarak basılır
    expect(html.match(/<article class="ocak-evre ocak-evre-/g)?.length).toBe(3);
    // Her kartın id'si + data-evre + ısı token style (cross-evre rampası)
    expect(html).toContain('id="evre-acilis"');
    expect(html).toContain('data-evre="acilis"');
    expect(html).toContain('--isi-aktif: var(--isi-acilis)');
    expect(html).toContain('id="evre-inis"');
    expect(html).toContain('--isi-aktif: var(--isi-inis)');
    expect(html).toContain('id="evre-durus"');
    expect(html).toContain('--isi-aktif: var(--isi-durus)');
    // Başlık: ad + dash + lokasyon ayrımı (H3 parse)
    expect(html).toContain('<span class="ocak-evre__ad">AÇILIŞ</span>');
    expect(html).toContain('<span class="ocak-evre__lokasyon">Ege</span>');
    // Lokasyon ayraç normalize: " + " → " · " (Notion defansif)
    expect(html).toContain('<span class="ocak-evre__lokasyon">Göbeklitepe · Harran</span>');
    expect(html).not.toContain('Göbeklitepe + Harran');
    // Meta paragraph
    expect(html).toContain('<p class="ocak-evre__meta">Eylül 2026 · 3 gece 4 gün · Urla / Alaçatı</p>');
    // Açıklama prose içeride
    expect(html).toContain('Kohortun kuruluşu.');
    expect(html).toContain('İlk eşik: aşağıya');
    // AÇILIŞ: arketip YOK, sadece soru alt şeritte
    const acilisCard = html.match(/<article[^>]*id="evre-acilis"[\s\S]*?<\/article>/)?.[0] ?? '';
    expect(acilisCard).toContain('ocak-evre__alt--soru-only');
    expect(acilisCard).toContain('Bu yıl boyunca neyi taşıyacağım?');
    expect(acilisCard).not.toContain('ocak-evre__arketip');
    // İNİŞ: arketip + soru çifti, ayraç dahil
    const inisCard = html.match(/<article[^>]*id="evre-inis"[\s\S]*?<\/article>/)?.[0] ?? '';
    expect(inisCard).toContain('<span class="ocak-evre__arketip">Kök Kadın</span>');
    expect(inisCard).toContain('<span class="ocak-evre__ayrac" aria-hidden="true">·</span>');
    expect(inisCard).toContain('<span class="ocak-evre__soru">Nereden geliyorum? Hangi soydan?</span>');
    // Arketip/Soru bullet list açıklamaya sızmamalı
    expect(inisCard).not.toMatch(/<li>Arketip:/);
    expect(inisCard).not.toMatch(/<li>Soru:/);
    // evreler-intro "Altı Evre" başlığı korunur
    expect(html).toContain('<section data-section="evreler-intro" class="ocak-evreler-intro">');
    expect(html).toContain('<h2>Altı Evre</h2>');
    // Kanonik dışı son-soz baseline prose'da kalır (regression check)
    expect(html).toContain('<section data-section="son-soz" class="ocak-son-soz">');
    expect(html).toContain('<h2>Son Söz</h2>');
    expect(html).toMatchSnapshot();
  });

  it('35. evre — Soru yoksa warn + alt şerit boş', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const html = process(
      '## section: evre-acilis\n\n### AÇILIŞ — Ege\n\nMeta paragraf.\n\nAçıklama.',
      { filename: 'no-soru.md' },
    );
    expect(html).toContain('id="evre-acilis"');
    // Alt şerit hiç emit edilmez
    expect(html).not.toContain('ocak-evre__alt');
    expect(warn).toHaveBeenCalled();
    expect(warn.mock.calls.some((c) => String(c[0]).includes('Soru bulunamadı'))).toBe(true);
    expect(warn.mock.calls.some((c) => String(c[0]).includes('no-soru.md'))).toBe(true);
    warn.mockRestore();
  });

  it('36. evre — H3 yoksa fallback ad section-name türetilir + warn', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const html = process(
      '## section: evre-uyanis\n\nMeta paragraf.\n\nSoru: Test soru?',
      { filename: 'no-h3.md' },
    );
    expect(html).toContain('id="evre-uyanis"');
    // Fallback: ad = "UYANIS" (slug büyük harf)
    expect(html).toContain('<span class="ocak-evre__ad">UYANIS</span>');
    // Lokasyon span emit edilmez (h3 yok → lokasyon boş)
    expect(html).not.toContain('ocak-evre__lokasyon');
    expect(warn).toHaveBeenCalled();
    expect(warn.mock.calls.some((c) => String(c[0]).includes('H3 bulunamadı'))).toBe(true);
    warn.mockRestore();
  });

  it('37. harita-anadolu marker — empty wrapper savunma fallback (loader bypass durumu)', () => {
    // KARAR 127 paterni: marker normalde loader splitBodyByMarkers tarafından kesilir
    // ve PageContent <AnadoluHarita /> basar. Plugin marker'ı görmez. Bu test plugin
    // savunma fallback'ini doğruluyor (marker bir şekilde loader'dan kaçarsa
    // empty wrapper emit edilir, CSS suppress eder).
    const html = process('## section: harita-anadolu\n\n## section: hero\n\n# Başlık');
    expect(html).toContain('data-section="harita-anadolu"');
    expect(html).toContain('class="ocak-harita-anadolu"');
    expect(html).toContain('data-section="hero"');
  });

  it('29. esik h2 fallback — h2 yoksa warn + summary section-name', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const html = process('## section: esik-uyku\n\nDoğrudan paragraf, h2 yok.', {
      filename: 'no-h2.md',
    });
    // Fallback: summary section-name'i (esik-uyku) basar, içerik korunur
    expect(html).toContain('<details name="esikler" data-section="esik-uyku">');
    expect(html).toContain('<summary>esik-uyku</summary>');
    expect(html).toContain('Doğrudan paragraf');
    expect(warn).toHaveBeenCalled();
    expect(warn.mock.calls[0][0]).toContain('no-h2.md');
    expect(warn.mock.calls[0][0]).toContain('esik-uyku');
    warn.mockRestore();
  });

  it('16. paragraph italik artığı — intraword close + boşluklu çift `_`/`*` strip, snake_case + gerçek italik korunur', () => {
    const html = render('fixture-10-italik-artik-paragraf.md');
    // Rule 5 — intraword close
    expect(html).toContain('Arketip:Kök Kadın');
    expect(html).not.toContain('_Arketip:_');
    // Rule 6 — içerikte boşluk
    expect(html).toContain('Kim için:Tükendiğini hisseden kadın.');
    expect(html).not.toContain('_Kim için:_');
    // Tırnak + intraword close (`_`)
    expect(html).toContain('"Bunu mu yapacağım?"diyen kadın.');
    expect(html).not.toContain('_"Bunu mu yapacağım?"_');
    // Star variant
    expect(html).toContain('"Bir şey eksik"hisseden kadın.');
    expect(html).not.toContain('*"Bir şey eksik"*');
    // snake_case korunur — intraword open boundary lookbehind tutar
    expect(html).toContain('foo_bar_baz dosya adı.');
    // Gerçek italik (`_x_` whitespace-surrounded) zaten remark <em> üretir — strip etmez
    expect(html).toContain('<em>gerçek italik</em>');
  });

  it('38. kayit-cta — metinsiz: section + buton + href/label placeholder (KARAR 207 + faz3 İş 3)', () => {
    const html = process('## section: kayit-cta\n');
    expect(html).toContain('<section data-section="kayit-cta" class="ocak-kayit-cta">');
    expect(html).toContain(
      '<a class="ocak-kayit-cta__buton" href="__KAYIT_CTA_HREF__" data-kayit-cta-button>__KAYIT_CTA_LABEL__ →</a>',
    );
    expect(html).toContain('</section>');
    // Metinsiz varyantta üst metin yok — section içinde sadece buton + boşluk.
    expect(html).not.toMatch(/<section data-section="kayit-cta"[^>]*>\s*<p>/);
  });

  it('39. kayit-cta — metinli: üst paragraph + buton (placeholder href/label korunur)', () => {
    const html = process(
      '## section: kayit-cta\n\nYerini ayır, çembere katıl.\n',
    );
    expect(html).toContain('<section data-section="kayit-cta" class="ocak-kayit-cta">');
    expect(html).toContain('<p>Yerini ayır, çembere katıl.</p>');
    expect(html).toContain('href="__KAYIT_CTA_HREF__"');
    expect(html).toContain('__KAYIT_CTA_LABEL__ →');
  });

  // brief-desenler-01.md ADIM 1 — raf-accordion (/araclar 7 raf ailesi)
  // Madde 8 liste ailesi refaktörü (2026-07-19): meta slot yok, sadece isaret.
  it('40. raf accordion — whitelist details name="raflar", liste ailesi class seti', () => {
    const html = render('fixture-23-raf-accordion.md');
    // İki raf section (cekirdek, beden) details olarak basılır — namespace "raflar"
    expect(html.match(/<details name="raflar"/g)?.length).toBe(2);
    // Madde 8: familyClasses → .liste__oge class'ı details'e eklendi
    expect(html).toContain(
      '<details name="raflar" data-section="raf-cekirdek" class="liste__oge">',
    );
    expect(html).toContain(
      '<details name="raflar" data-section="raf-beden" class="liste__oge">',
    );
    // Summary yeni yapı: .liste__baslik-satir + h3.liste__baslik + isaret (meta yok)
    expect(html).toContain(
      '<summary class="liste__baslik-satir"><h3 class="liste__baslik">1 · Çekirdek Araçlar</h3><span class="liste__isaret" aria-hidden="true"></span></summary>',
    );
    expect(html).toContain(
      '<summary class="liste__baslik-satir"><h3 class="liste__baslik">2 · Beden Araçları</h3><span class="liste__isaret" aria-hidden="true"></span></summary>',
    );
    // Meta slot yok (Kaan kararı 2026-07-19) — .liste__meta hiçbir yerde
    expect(html).not.toContain('class="liste__meta"');
    // İsaret span her summary'de var (+/× CSS ile basılır)
    expect(html.match(/<span class="liste__isaret" aria-hidden="true"><\/span>/g)?.length).toBe(2);
    // H3 ham olarak details body'sinde KALMAMALI (strip teyidi)
    expect(html).not.toContain('<h3 id="1--çekirdek-araçlar">1 · Çekirdek Araçlar</h3>');
    // Section içeriği details'in içinde
    expect(html).toContain('OCAK\'ın temeline');
    expect(html).toContain('Bedeni dinleme');
    // "raflar" grubu esik namespace'inden bağımsız
    expect(html).not.toMatch(/<details name="esikler"[^>]*data-section="raf-/);
    expect(html).toMatchSnapshot();
  });

  it('41. raf whitelist — `raf-diger` (whitelist dışı) accordion DEĞİL, baseline prose kalır', () => {
    const html = render('fixture-23-raf-accordion.md');
    // raf-diger RAF_SECTIONS'ta yok → baseline `<section data-section="raf-diger" class="ocak-raf-diger">`
    expect(html).toContain('<section data-section="raf-diger" class="ocak-raf-diger">');
    // KRİTİK: raf-diger accordion wrap'ı ALMAMALI (silent bug regression check)
    expect(html).not.toMatch(/<details[^>]*data-section="raf-diger"/);
  });

  it('42. raf h3 fallback — h3 yoksa warn + summary section-name', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const html = process('## section: raf-cekirdek\n\nDoğrudan paragraf, h3 yok.', {
      filename: 'no-h3.md',
    });
    // Fallback: summary section-name'i (raf-cekirdek) basar, içerik korunur
    // Madde 8: familyClasses → summary yeni yapıda h3.liste__baslik + isaret
    expect(html).toContain(
      '<details name="raflar" data-section="raf-cekirdek" class="liste__oge">',
    );
    expect(html).toContain(
      '<summary class="liste__baslik-satir"><h3 class="liste__baslik">raf-cekirdek</h3><span class="liste__isaret" aria-hidden="true"></span></summary>',
    );
    expect(html).toContain('Doğrudan paragraf');
    expect(warn).toHaveBeenCalled();
    expect(warn.mock.calls[0][0]).toContain('no-h3.md');
    expect(warn.mock.calls[0][0]).toContain('raf-cekirdek');
    // Warn mesajı 'raflar' group + h3 depth söylüyor (esik'ten ayrılır)
    expect(warn.mock.calls[0][0]).toContain('raflar');
    expect(warn.mock.calls[0][0]).toContain('h3');
    warn.mockRestore();
  });

  // brief-advaita-accordion.md — /advaita 3 tasidigi-* yön kartı accordion
  // Madde 8 liste ailesi (2026-07-19): familyClasses=true, parseMeta=false
  // (em-dash alt-başlık ayracı, meta değil); meta slot tamamen yok.
  it('47. tasiyici accordion — whitelist details name="tasiyici", liste ailesi, meta yok', () => {
    const html = render('fixture-25-tasiyici-accordion.md');
    // İki tasidigi section (bati, dogu) details olarak basılır — namespace "tasiyici"
    expect(html.match(/<details name="tasiyici"/g)?.length).toBe(2);
    expect(html).toContain(
      '<details name="tasiyici" data-section="tasidigi-bati" class="liste__oge">',
    );
    expect(html).toContain(
      '<details name="tasiyici" data-section="tasidigi-dogu" class="liste__oge">',
    );
    // Summary yeni yapı: parseMeta=false → em-dash başlığın tamamında kalır
    expect(html).toContain(
      '<h3 class="liste__baslik">🜄 BATI — Şamanik Yol, Ritüel ve Kakao</h3>',
    );
    expect(html).toContain('<h3 class="liste__baslik">🜁 DOĞU — Nefes ve Beden</h3>');
    // Meta slot yok (Kaan kararı 2026-07-19)
    expect(html).not.toContain('class="liste__meta"');
    // İsaret span her summary'de var
    expect(html.match(/<span class="liste__isaret" aria-hidden="true"><\/span>/g)?.length).toBe(2);
    // H2 ham olarak details body'sinde KALMAMALI (strip teyidi)
    expect(html).not.toContain('<h2>🜄 BATI — Şamanik Yol, Ritüel ve Kakao</h2>');
    // Section içeriği details'in içinde
    expect(html).toContain('Sachamama geleneğinin');
    expect(html).toContain('Rishikesh');
    // "tasiyici" grubu esikler/raflar namespace'lerinden bağımsız
    expect(html).not.toMatch(/<details name="esikler"[^>]*data-section="tasidigi-/);
    expect(html).not.toMatch(/<details name="raflar"[^>]*data-section="tasidigi-/);
    // ne-tasiyor intro baseline prose olarak açık kalır (accordion DEĞİL)
    expect(html).toContain('<section data-section="ne-tasiyor" class="ocak-ne-tasiyor">');
    expect(html).toMatchSnapshot();
  });

  it('48. tasiyici whitelist — `tasidigi-kuzey` (whitelist dışı) accordion DEĞİL, baseline prose kalır', () => {
    const html = render('fixture-25-tasiyici-accordion.md');
    // tasidigi-kuzey TASIYICI_SECTIONS'ta yok → baseline prose
    expect(html).toContain('<section data-section="tasidigi-kuzey" class="ocak-tasidigi-kuzey">');
    // KRİTİK: tasidigi-kuzey accordion wrap'ı ALMAMALI (silent bug regression check)
    expect(html).not.toMatch(/<details[^>]*data-section="tasidigi-kuzey"/);
  });

  it('49. tasiyici h2 fallback — h2 yoksa warn + summary section-name', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const html = process('## section: tasidigi-bati\n\nDoğrudan paragraf, h2 yok.', {
      filename: 'no-h2.md',
    });
    // Fallback: summary section-name'i (tasidigi-bati) basar, içerik korunur
    // Madde 8: familyClasses → summary yeni yapıda h3.liste__baslik
    expect(html).toContain(
      '<details name="tasiyici" data-section="tasidigi-bati" class="liste__oge">',
    );
    expect(html).toContain(
      '<summary class="liste__baslik-satir"><h3 class="liste__baslik">tasidigi-bati</h3>',
    );
    expect(html).toContain('Doğrudan paragraf');
    expect(warn).toHaveBeenCalled();
    expect(warn.mock.calls[0][0]).toContain('no-h2.md');
    expect(warn.mock.calls[0][0]).toContain('tasidigi-bati');
    // Warn mesajı 'tasiyici' group + h2 depth söylüyor
    expect(warn.mock.calls[0][0]).toContain('tasiyici');
    expect(warn.mock.calls[0][0]).toContain('h2');
    warn.mockRestore();
  });

  // brief-desenler-01.md ADIM 2 — vitrin (temalar/turler/formatlar)
  // Madde 8 liste ailesi (2026-07-17): transformListeStatik → .liste__oge
  it('43. vitrin temalar — CARD_SECTIONS liste ailesi, 5 öğe, link opsiyonel', () => {
    const html = render('fixture-24-vitrin-temalar.md');
    // Section wrapper adı temalar (siradaki-kapi değil)
    expect(html).toContain('<section data-section="temalar">');
    expect(html).not.toContain('<section data-section="siradaki-kapi">');
    // 5 öğe: yeni class .liste__oge (eski .ocak-kapi-kart siradaki-kapi'ye özgü)
    expect(html.match(/<article class="liste__oge">/g)?.length).toBe(5);
    expect(html).not.toContain('<article class="ocak-kapi-kart">');
    // Başlık satırı yeni yapı: h3.liste__baslik (id/class yok, "Ateş" — meta yok)
    expect(html).toContain('<h3 class="liste__baslik">Ateş</h3>');
    expect(html).toContain('<h3 class="liste__baslik">Sessizlik</h3>');
    expect(html).toContain('<a href="/atolye">Beden atölyesine bak →</a>');
    // Link'siz öğe de article içinde açılır (fallback yok)
    const ateşCard =
      html.match(
        /<article class="liste__oge">\s*<div class="liste__baslik-satir"><h3 class="liste__baslik">Ateş<\/h3>[\s\S]*?<\/article>/,
      )?.[0] ?? '';
    expect(ateşCard).toContain('İçindeki közü tanı');
    expect(ateşCard).not.toContain('<a href');
    expect(html).toMatchSnapshot();
  });

  it('44. vitrin — 5 kart siradaki-kapi warn eşiğini TETİKLEMEZ (madde a: warn siradaki-kapi\'ye özgü)', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    // 5 kart: siradaki-kapi olsa warn ederdi (count >= 5), temalar warn ETMEZ
    const html = render('fixture-24-vitrin-temalar.md', { filename: 'temalar-5-kart.md' });
    expect(html).toContain('<section data-section="temalar">');
    // Warn spy: siradaki-kapi mesajı ÇAĞRILMAMALI
    const kapiWarnCalls = warn.mock.calls.filter((c) =>
      String(c[0]).includes('siradaki-kapi (temalar-5-kart.md)'),
    );
    expect(kapiWarnCalls.length).toBe(0);
    warn.mockRestore();
  });

  it('45. siradaki-kapi warn eşiği KORUNUR — 5 kart hâlâ warn ediyor (regresyon)', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    process(
      '## section: siradaki-kapi\n\n### K1\n\np\n\n### K2\n\np\n\n### K3\n\np\n\n### K4\n\np\n\n### K5\n\np',
      { filename: 'kapi-5.md' },
    );
    const kapiWarnCalls = warn.mock.calls.filter((c) =>
      String(c[0]).includes('siradaki-kapi (kapi-5.md): 5 kart'),
    );
    expect(kapiWarnCalls.length).toBe(1);
    warn.mockRestore();
  });

  it('46. vitrin turler + formatlar — CARD_SECTIONS Set üç grup adı da tanır', () => {
    const tHtml = process('## section: turler\n\n### Kakao\n\nKakao seremonisi.');
    expect(tHtml).toContain('<section data-section="turler">');
    expect(tHtml).toContain('<article class="liste__oge">');

    const fHtml = process('## section: formatlar\n\n### Bir Nefes\n\nAçık kapı bir nefes.');
    expect(fHtml).toContain('<section data-section="formatlar">');
    expect(fHtml).toContain('<article class="liste__oge">');
  });

  // Madde 8 (revize 2026-07-19): H3 sonundaki "— suffix" baslikten STRIP edilir
  // ama meta olarak render EDİLMEZ (Kaan kararı: meta slot yok).
  it('46b. vitrin suffix strip — "— 6 hafta" başlıktan silinir, meta render yok', () => {
    const html = process(
      '## section: seri-atolyeler\n\n### Beden Sabahları — 6 hafta\n\nÖzet.\n\nDetay paragrafı.',
    );
    expect(html).toContain('<article class="liste__oge">');
    // Baslik strip'li, em-dash suffix göze görünmez
    expect(html).toContain('<h3 class="liste__baslik">Beden Sabahları</h3>');
    // Meta slot yok — .liste__meta span'i hiç render edilmez
    expect(html).not.toContain('class="liste__meta"');
    // Ham başlıkta em-dash suffix'in bulunmadığı teyidi
    expect(html).not.toContain('<h3 class="liste__baslik">Beden Sabahları — 6 hafta</h3>');
  });

  // Madde 8 (revize 2026-07-19): atolyeler ul/li → art arda .liste__oge (meta yok)
  it('46c. atolyeler — ul/li her li bir .liste__oge (meta slot yok)', () => {
    const html = process(
      '## section: atolyeler\n\n- **Nefes Yolu** — Bir akşam nefes.\n- **Sessiz Otur** — İçe dönüş atölyesi.\n\nKapanış cümlesi.',
    );
    expect(html).toContain('<section data-section="atolyeler">');
    // Her li bir article.liste__oge
    expect(html.match(/<article class="liste__oge">/g)?.length).toBe(2);
    expect(html).toContain('<h3 class="liste__baslik">Nefes Yolu</h3>');
    expect(html).toContain('<h3 class="liste__baslik">Sessiz Otur</h3>');
    // Meta slot yok — 'tek akşam' sabiti KALDIRILDI (Kaan kararı)
    expect(html).not.toContain('class="liste__meta"');
    expect(html).not.toContain('tek akşam');
    // Kapanış cümlesi article dışında (baseline prose'a verbatim geçer)
    expect(html).toMatch(/Kapanış cümlesi/);
  });

  // brief-desenler-03 — bes-kadim-kaynak (Varyant C, 5 kadim yön)
  it('47. bes-kadim-kaynak — intro + pusula + 2 yön (MERKEZ vurgu) + kapanış', () => {
    const html = render('fixture-25-bes-kadim-kaynak.md');
    // Section kabı + baseline class
    expect(html).toContain(
      '<section data-section="bes-kadim-kaynak" class="ocak-bes-kadim-kaynak">',
    );
    // İntro üstte: H2 + 1 p — kartlardan önce (test pipeline rehype-slug'sız,
    // dist'te id var ama test'te yok — sadece H2 varlığı ve metin teyit).
    expect(html).toContain('<h2>Dört Yön. Bir Ocak.</h2>');
    expect(html).toMatch(/OCAK'ın bilgeliği/);
    // Pusula-başlık: 5 glyph, merkez altın büyük class
    expect(html).toContain('<div class="ocak-yon-pusula" aria-hidden="true">');
    expect(html.match(/<span class="ocak-yon-pusula__glyph/g)?.length).toBe(5);
    expect(html).toContain('ocak-yon-pusula__glyph--merkez');
    // Kanon sırası: 5 glyph pusulada YON_KANON sırasıyla
    expect(html).toMatch(/🜂[\s\S]*🜁[\s\S]*🜔[\s\S]*🜄[\s\S]*🜃/);
    // 2 kart — MERKEZ + DOĞU
    expect(html.match(/<article class="ocak-yon-kart/g)?.length).toBe(2);
    expect(html).toContain('<article class="ocak-yon-kart ocak-yon-kart--merkez" data-yon="merkez">');
    expect(html).toContain('<article class="ocak-yon-kart" data-yon="dogu">');
    // Glyph ayrı span'de + AD + COĞ ayrı
    expect(html).toContain('<span class="ocak-yon-kart__glyph" aria-hidden="true">🜂</span>');
    expect(html).toContain('<span class="ocak-yon-kart__ad">MERKEZ</span>');
    expect(html).toContain('<span class="ocak-yon-kart__cog">Anadolu</span>');
    expect(html).toContain('<span class="ocak-yon-kart__glyph" aria-hidden="true">🜁</span>');
    expect(html).toContain('<span class="ocak-yon-kart__ad">DOĞU</span>');
    expect(html).toContain("<span class=\"ocak-yon-kart__cog\">Hindistan'dan Çin'e</span>");
    // Gövde p kart-içi div'de
    const merkezCard = html.match(/<article[^>]*data-yon="merkez"[\s\S]*?<\/article>/)?.[0] ?? '';
    expect(merkezCard).toContain('Çatalhöyük');
    expect(merkezCard).toContain('<div class="ocak-yon-kart__govde">');
    // "Burada yaşar" em sıyrılmış → __yasar class'lı p (kanon metin tam)
    expect(merkezCard).toContain('<p class="ocak-yon-kart__yasar">');
    expect(merkezCard).toContain(
      "Burada yaşar: her çemberin mumu, mevsim seremonileri, Anadolu Yolculuğu'nun toprağı.",
    );
    // em tag kartın __yasar içinde kalmamalı (sıyrıldı)
    expect(merkezCard).not.toMatch(/<p class="ocak-yon-kart__yasar">\s*<em>/);
    // Kapanış: 2 paragraf + Advaita link, kartlardan SONRA section-içinde
    expect(html).toContain('Dört yön, başka başka dillerde');
    expect(html).toContain('<a href="/advaita">Advaita — ateşi ilk yakan →</a>');
    // Kapanış link paragrafı son article'ın DIŞINDA (sırayla: son article kapandı, sonra p)
    expect(html).toMatch(
      /<\/article>[\s\S]*Dört yön[\s\S]*Advaita — ateşi ilk yakan/,
    );
    expect(html).toMatchSnapshot();
  });

  it('48. bes-kadim-kaynak — em-sarılı <p> yoksa warn + kart ham prose (kanon güvenliği)', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const html = process(
      '## section: bes-kadim-kaynak\n\n### 🜂 MERKEZ — Anadolu\n\nGövde paragrafı — em yok.\n\nİkinci p yine em yok.',
      { filename: 'no-em.md' },
    );
    // Kart article olarak SARILMAMALI (fallback: ham prose)
    expect(html).toContain('data-section="bes-kadim-kaynak"');
    expect(html).not.toContain('<article class="ocak-yon-kart');
    // H3 + gövde node'ları verbatim korunur (kanon)
    expect(html).toContain('Gövde paragrafı');
    expect(html).toContain('İkinci p yine em yok');
    // Warn: filename + yön 1 (merkez)
    expect(warn).toHaveBeenCalled();
    expect(warn.mock.calls.some((c) => String(c[0]).includes('no-em.md'))).toBe(true);
    expect(warn.mock.calls.some((c) => String(c[0]).includes('merkez'))).toBe(true);
    expect(
      warn.mock.calls.some((c) => String(c[0]).includes('<em>-sarılı <p> bulunamadı')),
    ).toBe(true);
    warn.mockRestore();
  });

  it('49. bes-kadim-kaynak — pusula her zaman 5 glyph, YON_KANON sırası', () => {
    // Sadece 1 yön yazılsa bile pusula 5 glyph basar (dekoratif kabuk, kanon-dışı)
    const html = process(
      '## section: bes-kadim-kaynak\n\n## H2\n\nintro\n\n### 🜂 MERKEZ — Anadolu\n\ngövde\n\n*yaşar*',
    );
    // Span sayacı — regex substring "__glyph" merkez'de iki kez match (base + --merkez),
    // span başı ile say (5 pusula glyph span'i).
    expect(html.match(/<span class="ocak-yon-pusula__glyph/g)?.length).toBe(5);
    // İlk glyph merkez class'lı
    expect(html).toMatch(
      /<span class="ocak-yon-pusula__glyph ocak-yon-pusula__glyph--merkez"[^>]*>🜂/,
    );
  });
});
