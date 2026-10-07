import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { devamGorunumu, type DevamGirdi } from './odeme-devam.ts';

/**
 * `lib/odeme-devam.ts` + `/odeme/devam` — kart devam sayfasının dört durumu.
 *
 * Metinler brief'te verildi (§4 İŞ 5 tablosu + 7 Eki düzeltmesi); ölçütler
 * onlara **birebir** bakıyor. Yeni kamu metni sızarsa burası kırmızı yanar.
 *
 * Dosya `src/lib/` altında (KARAR 574).
 */

const SIMDI = new Date('2026-10-02T12:00:00+03:00');

const TEMEL: DevamGirdi = {
  imzaGecerli: true,
  kayitDurumu: 'bulundu',
  kayitId: 'OCAK-7K2M',
  odemeDurumu: 'Beklemede',
  yerTutmaBitisi: new Date('2026-10-02T18:00:00+03:00'),
  tutar: 225,
  paraBirimi: 'TRY',
  baslik: 'Elin Neyle Dolu?',
  tarihISO: '2026-10-12',
  tarihBitis: '',
  saat: '21:00',
  etkinlikUrl: 'https://www.ocak.biz/etkinlik/elin-neyle-dolu',
  simdi: SIMDI,
};

describe('DURUM 1 · Beklemede + bitiş gelmemiş → "Yerin duruyor."', () => {
  it('başlık ve gövde brief metniyle birebir', () => {
    const g = devamGorunumu(TEMEL);
    expect(g.durum).toBe('yerin-duruyor');
    expect(g.baslik).toBe('Yerin duruyor.');
    expect(g.govde).toEqual([
      'Elin Neyle Dolu?',
      '12 Ekim 2026 · 21:00',
      'Katılım payı: 225 TL',
      // 7 Eki düzeltmesi — cümle EKSİZ: Türkçe ek saate göre değişiyor ('a/'e).
      'Yerini şu ana kadar tutuyoruz: 2 Ekim Cuma, 18:00 (Türkiye saati)',
    ]);
  });

  it('⚠ eski ekli biçim GERİ GELMEZ — regresyon kilidi', () => {
    const g = devamGorunumu(TEMEL);
    const hepsi = g.govde.join(' | ');
    expect(hepsi).not.toMatch(/'a kadar yerini tutuyoruz/);
    expect(hepsi).not.toMatch(/'e kadar yerini tutuyoruz/);
  });

  it('`Katılım payı` birimi TUTAR biçiminden gelir (TL değil sabit)', () => {
    const usd = devamGorunumu({ ...TEMEL, tutar: 30, paraBirimi: 'USD' });
    expect(usd.govde).toContain('Katılım payı: 30 USD');
  });

  it('`Kartla öde` MEVCUT N-Kolay yolunu kullanır — yeni ödeme yolu yok', () => {
    const g = devamGorunumu(TEMEL);
    expect(g.odemeUrl).toBe('/odeme/nkolay?ref=OCAK-7K2M');
    expect(g.etkinlikUrl).toBe('');
  });

  it('`Yer Tutma Bitişi` BOŞ (brief öncesi kayıt) → yine "Yerin duruyor."', () => {
    // Kapı boş değeri geçiriyor; son an satırı basılmaz, uydurulmaz.
    const g = devamGorunumu({ ...TEMEL, yerTutmaBitisi: null });
    expect(g.durum).toBe('yerin-duruyor');
    expect(g.odemeUrl).toBe('/odeme/nkolay?ref=OCAK-7K2M');
    expect(g.govde.some((s) => s.includes('Yerini şu ana kadar'))).toBe(false);
  });

  it('tutar/tarih/başlık boşsa o satırlar hiç basılmaz', () => {
    const g = devamGorunumu({ ...TEMEL, tutar: 0, tarihISO: '', baslik: '' });
    expect(g.govde).toEqual([
      'Yerini şu ana kadar tutuyoruz: 2 Ekim Cuma, 18:00 (Türkiye saati)',
    ]);
  });
});

describe('DURUM 2 · Ödendi → "Yerin hazır."', () => {
  it('başlık ve gövde birebir, eylem YOK', () => {
    const g = devamGorunumu({ ...TEMEL, odemeDurumu: 'Ödendi' });
    expect(g.durum).toBe('yerin-hazir');
    expect(g.baslik).toBe('Yerin hazır.');
    expect(g.govde).toEqual(['Katılım payın bize ulaştı. Detayları e-postayla yolladık.']);
    expect(g.odemeUrl).toBe('');
    expect(g.etkinlikUrl).toBe('');
  });

  it('⚠ Ödendi + bitiş GEÇMİŞ → yine "Yerin hazır." (süresi doldu DEĞİL)', () => {
    // Bir kayıt iptal/süre dolduktan sonra para gelirse callback onu Ödendi'ye
    // çekiyor (brief §1 "para kazanır"). O kadına "süresi doldu" göstermek
    // yanlış olurdu — bu yüzden Ödendi, süre kapısından ÖNCE sorulur.
    const g = devamGorunumu({
      ...TEMEL,
      odemeDurumu: 'Ödendi',
      yerTutmaBitisi: new Date('2026-10-01T12:00:00+03:00'),
    });
    expect(g.durum).toBe('yerin-hazir');
  });
});

describe('DURUM 3 · İptal ya da bitiş geçmiş → "Bu yerin süresi doldu."', () => {
  it('İptal', () => {
    const g = devamGorunumu({ ...TEMEL, odemeDurumu: 'İptal' });
    expect(g.durum).toBe('suresi-doldu');
    expect(g.baslik).toBe('Bu yerin süresi doldu.');
    expect(g.govde).toEqual(['Buluşmada yer varsa yeniden kayıt olabilirsin.']);
    expect(g.odemeUrl).toBe('');
    expect(g.etkinlikUrl).toBe('https://www.ocak.biz/etkinlik/elin-neyle-dolu');
  });

  it('bitiş geçmiş (Beklemede ama süre dolmuş)', () => {
    const g = devamGorunumu({
      ...TEMEL,
      yerTutmaBitisi: new Date('2026-10-02T06:00:00+03:00'),
    });
    expect(g.durum).toBe('suresi-doldu');
    expect(g.odemeUrl).toBe('');
  });

  it('⚠ süresi geçmiş satırda ÖDEME BAŞLATILMAZ', () => {
    const g = devamGorunumu({
      ...TEMEL,
      yerTutmaBitisi: new Date('2026-10-02T06:00:00+03:00'),
    });
    expect(g.odemeUrl).toBe('');
  });

  it('Bedava/İade/bilinmeyen durum da bu dala düşer (beşinci metin yazılmadı)', () => {
    for (const d of ['Bedava', 'İade', '', 'Yeni Bir Değer']) {
      const g = devamGorunumu({ ...TEMEL, odemeDurumu: d });
      expect(g.durum).toBe('suresi-doldu');
      expect(g.odemeUrl).toBe('');
    }
  });
});

describe('DURUM 4 · imza tutmuyor / kayıt yok → "Bu bağlantı açılmadı."', () => {
  it('imza geçersiz', () => {
    const g = devamGorunumu({ ...TEMEL, imzaGecerli: false });
    expect(g.durum).toBe('baglanti-acilmadi');
    expect(g.baslik).toBe('Bu bağlantı açılmadı.');
    expect(g.govde).toEqual(['Maildeki bağlantıya yeniden dokun ya da bize yaz:']);
    expect(g.yardimEposta).toBe('selam@ocak.biz');
    expect(g.odemeUrl).toBe('');
  });

  it('imza geçerli ama kayıt bulunamadı / Notion hatası — AYNI metin', () => {
    // Kadın açısından fark yok (bağlantı çalışmadı); ayrım teşhis içindir ve
    // log'da yaşar.
    for (const d of ['bulunamadi', 'hata'] as const) {
      const g = devamGorunumu({ ...TEMEL, kayitDurumu: d });
      expect(g.durum).toBe('baglanti-acilmadi');
      expect(g.odemeUrl).toBe('');
    }
  });

  it('⚠ imza geçersizken Ödendi bile olsa ödeme bilgisi SIZMAZ', () => {
    const g = devamGorunumu({ ...TEMEL, imzaGecerli: false, odemeDurumu: 'Ödendi' });
    expect(g.durum).toBe('baglanti-acilmadi');
    expect(g.govde.join(' ')).not.toContain('225');
    expect(g.govde.join(' ')).not.toContain('Elin Neyle Dolu?');
  });
});

/**
 * Sayfa kaynağı — frontmatter çağrılamıyor, ölçüm grep'le.
 */
describe('devam.astro — kaynak disiplini', () => {
  const KAYNAK = readFileSync(join(__dirname, '..', 'pages', 'odeme', 'devam.astro'), 'utf-8');
  const KOD = KAYNAK
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1');

  it('`prerender = false` ve KARAR 488 kapısı var', () => {
    expect(KOD).toMatch(/export const prerender = false;/);
    expect(KOD).toMatch(/if \(!KART_AKISI_ACIK\) return new Response\(null, \{ status: 404 \}\);/);
  });

  it('⚠ imza tutmazsa Notion\'a HİÇ DOKUNULMAZ', () => {
    // Doğrulanmamış bir isteğe bizim adımıza sorgu yaptırmamak; callback'in
    // mutabakat çağrısını hash kapısından sonraya koymasıyla aynı refleks.
    expect(KOD).toMatch(/const kayit = imzaGecerli\s*\n?\s*\?\s*await kayitOku/);
  });

  it('metinler sayfada DEĞİL — lib\'den geliyor', () => {
    // Dört metin tek yerde yaşasın; sayfa yalnız basar.
    expect(KOD).not.toMatch(/Yerin duruyor/);
    expect(KOD).not.toMatch(/Bu yerin süresi doldu/);
    expect(KOD).not.toMatch(/Bu bağlantı açılmadı/);
    expect(KOD).toMatch(/devamGorunumu\(\{/);
  });

  it('sekme başlığı gövdeyle AYNI kaynaktan (KARAR 395)', () => {
    expect(KOD).toMatch(/const sayfaBasligi = `\$\{gorunum\.baslik/);
    expect(KOD).toMatch(/title=\{sayfaBasligi\}/);
    expect(KOD).not.toMatch(/title="/);
  });

  it('`Kartla öde` PAYLAŞILAN düğme sınıfını kullanıyor — yerel kopya yok', () => {
    // Yerel kopya ayrışmıştı: hover hiç yoktu, metin rengi `--cream`'di
    // (kardeşlerin `--coal`'ü yerine), uppercase/harf aralığı yoktu, 2px köşe
    // yuvarlaması vardı — sitenin hiçbir düğmesinde olmayan bir detay.
    expect(KAYNAK).toMatch(/class="ocak-dugme" href=\{gorunum\.odemeUrl\}/);
    // Sayfanın `<style>`ında düğme kuralı KALMADI.
    expect(KOD).not.toMatch(/\.ocak-odeme-devam__dugme\s*\{/);
    expect(KOD).not.toMatch(/border-radius: 2px/);
  });

  it('sayfa `noindex`', () => {
    expect(KOD).toMatch(/noindex/);
  });

  it('log\'da kişi verisi yok — yalnız Kayıt ID', () => {
    const loglar = KOD.match(/console\.\w+\([^)]*\)/g) ?? [];
    expect(loglar.length).toBeGreaterThan(0);
    for (const l of loglar) {
      expect(l).not.toMatch(/email|Email|eposta|telefon|davetEdenAd/);
    }
  });
});

/**
 * `/odeme/nkolay` — kapının İKİNCİ çağrı yeri (Kaan kararı 2).
 */
describe('nkolay.astro — ödeme başlatma kapısı burada DA var', () => {
  const KAYNAK = readFileSync(join(__dirname, '..', 'pages', 'odeme', 'nkolay.astro'), 'utf-8');
  const KOD = KAYNAK
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1');

  it('kapı çağrılıyor — referans maillerde yazılı, bu sayfa `?ref=` ile girilebiliyor', () => {
    expect(KOD).toMatch(/odemeBaslatilabilir\(\{/);
    expect(KOD).toMatch(/odemeKapisi\(kayit\)\.baslatilabilir/);
  });

  it('kapının `simdi`si TEK değişkenden — koşul ve log aynı anı görür', () => {
    // İlk yazımda ölçüt "dosyada bir tane `new Date()` olsun" idi ve YANLIŞTI:
    // ikinci `new Date()` zaten vardı ve başka bir işe ait — N-Kolay imzasının
    // `rnd` alanı, istek anında üretilmesi şart (KARAR 385/464 vakası).
    // Kriter beklentiden yazılmıştı, dosyanın gerçeğinden değil (CLAUDE.md §3).
    //
    // Doğru ölçüt: kapı `simdi`yi paylaşılan bir değişkenden alsın. İki ayrı
    // okuma olsaydı bitişe saniyeler kalmış bir kayıt koşulla log arasında
    // taraf değiştirebilirdi.
    expect(KOD).toMatch(/const simdiAni = new Date\(\);/);
    expect(KOD).toMatch(/simdi: simdiAni,/);
    // Kapı çağrısı içinde doğrudan `new Date()` KULLANILMIYOR.
    const kapiGovdesi = KOD.match(/odemeBaslatilabilir\(\{[\s\S]*?\}\)/)?.[0] ?? '';
    expect(kapiGovdesi).not.toMatch(/new Date\(\)/);
  });

  it('kapı tutar kontrolünden ÖNCE — sırası korunuyor', () => {
    const iKapi = KOD.indexOf('odemeKapisi(kayit).baslatilabilir');
    const iTutar = KOD.indexOf('!(kayit.tutar > 0)');
    expect(iKapi).toBeGreaterThan(-1);
    expect(iTutar).toBeGreaterThan(iKapi);
  });
});

/**
 * `.ocak-dugme` — birincil düğmenin paylaşılan tek kuralı (global.css).
 *
 * Sitede üç birincil düğme vardı ve üçü de yeniden kullanılamıyordu: biri
 * `section[data-section=…]` ebeveynine bağlı (atmosfer.css), ikisi Astro'nun
 * bileşen-kapsamlı `<style>`ında. `global.css`'te hiç button kuralı yoktu.
 * Bu sınıf o üç kardeşten ÖLÇÜLMÜŞ ortak paydadır; yeni tasarım değil.
 */
describe('.ocak-dugme — paylaşılan birincil düğme', () => {
  const CSS = readFileSync(join(__dirname, '..', 'styles', 'global.css'), 'utf-8');
  const KURAL = CSS.match(/\.ocak-dugme \{[\s\S]*?\n\}/)?.[0] ?? '';
  const HOVER = CSS.match(/\.ocak-dugme:hover,[\s\S]*?\n\}/)?.[0] ?? '';

  it('kural global.css\'te — bileşen-kapsamlı DEĞİL, yeniden kullanılabilir', () => {
    expect(KURAL).toBeTruthy();
  });

  it('kardeşlerin ölçülmüş paydası: ember dolu · coal metin · uppercase · köşe YOK', () => {
    expect(KURAL).toMatch(/background: var\(--ember\);/);
    expect(KURAL).toMatch(/border: 1px solid var\(--ember\);/);
    // ⚠ `--coal`: üç kardeş de ember üstünde KOYU metin kullanıyor.
    expect(KURAL).toMatch(/color: var\(--coal\);/);
    expect(KURAL).toMatch(/text-transform: uppercase;/);
    expect(KURAL).toMatch(/letter-spacing: 0\.15em;/);
    // Hiçbir kardeşte köşe yuvarlaması yok.
    expect(KURAL).not.toMatch(/border-radius/);
  });

  it('HOVER VAR — eksik olan tam buydu', () => {
    expect(HOVER).toBeTruthy();
    expect(HOVER).toMatch(/background: var\(--ember-soft\);/);
    expect(HOVER).toMatch(/box-shadow: 0 0 25px rgba\(196, 75, 47, 0\.3\);/);
  });

  it('`:focus-visible` hover ile AYNI kuralda — klavye de görsün', () => {
    expect(CSS).toMatch(/\.ocak-dugme:hover,\s*\n\.ocak-dugme:focus-visible \{/);
    expect(HOVER).toMatch(/outline: none;/);
  });

  it('geçiş var — `--duration-base` reduced-motion\'da 0ms, ayrı blok gerekmez', () => {
    expect(KURAL).toMatch(/transition: background var\(--duration-base\)/);
  });
});

/**
 * İŞ 3 — ara geçiş: kartta sakin tek ekran, havalede ara durum yok.
 *
 * Asıl boşluk `/api/kayit` yanıtı DEĞİL, `window.location` sonrası
 * `/odeme/nkolay`'ın SSR'ı: o aralıkta tarayıcı hâlâ form sayfasını gösteriyor
 * ve kadın donmuş bir form + "Gönderiliyor…" düğmesi görüyordu.
 */
describe('ara geçiş — iki yüzey aynı görünümü basar (İŞ 3)', () => {
  const FORM = readFileSync(join(__dirname, '..', 'components', 'KayitFormu.astro'), 'utf-8');
  const NKOLAY = readFileSync(join(__dirname, '..', 'pages', 'odeme', 'nkolay.astro'), 'utf-8');
  const temiz = (k: string) => k
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1');

  it('formda geçiş bloğu VAR — köz + tek satır', () => {
    const K = temiz(FORM);
    expect(K).toMatch(/data-kf-gecis hidden/);
    expect(K).toMatch(/Ödeme ekranına geçiyoruz\./);
    expect(K).toMatch(/kayit-formu__success-ember/);
  });

  it('`/odeme/nkolay` AYNI satırı basıyor', () => {
    expect(temiz(NKOLAY)).toMatch(/Ödeme ekranına geçiyoruz\./);
  });

  it('⚠ geçiş YALNIZ kart yolunda — havalede ara ekran yok', () => {
    const K = temiz(FORM);
    expect(K).toMatch(/const kartYolu = direktAktif\(\) && yontem === 'kart' && gecisToplam > 0;/);
    expect(K).toMatch(/if \(kartYolu\) \{\s*\n\s*form\.hidden = true;\s*\n\s*gecisEl\.hidden = false;/);
  });

  it('hata olursa geçiş GERİ ALINIR — kadın formu kaybetmez', () => {
    expect(temiz(FORM)).toMatch(/gecisEl\.hidden = true;\s*\n\s*form\.hidden = false;/);
  });

  it('YAPAY BEKLEME YOK — iki yüzeyde de timer kurulmuyor', () => {
    for (const k of [temiz(FORM), temiz(NKOLAY)]) {
      expect(k).not.toMatch(/setTimeout\s*\([^)]*gecis/i);
    }
    expect(temiz(NKOLAY)).not.toMatch(/setTimeout/);
  });

  it('nkolay düğmesi script ÇALIŞMAZSA görünür — gizleme submit\'ten ÖNCE', () => {
    const K = temiz(NKOLAY);
    // HTML'de görünür basılıyor (hidden attribute YOK), betik gizliyor.
    expect(K).toMatch(/<button type="submit" class="ocak-dugme" data-nkolay-dugme>/);
    const betik = K.match(/var f = document\.getElementById[\s\S]*?\n    \}/)?.[0] ?? '';
    expect(betik.indexOf('d.hidden = true')).toBeGreaterThan(-1);
    expect(betik.indexOf('f.submit()')).toBeGreaterThan(betik.indexOf('d.hidden = true'));
  });

  it('nkolay düğmesi PAYLAŞILAN sınıfı kullanıyor — tanımsız `ocak-btn` kalktı', () => {
    const K = temiz(NKOLAY);
    expect(K).toMatch(/class="ocak-dugme"/);
    expect(K).not.toMatch(/class="ocak-btn"/);
  });
});
