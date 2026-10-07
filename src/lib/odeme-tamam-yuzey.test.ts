import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { tamamGorunumu, type TamamGirdi } from './odeme-tamam.ts';

/**
 * `/odeme/tamam` — yüzeyin bugünün gerçeğini söylemesi.
 *
 * ── Bu dosya 7 Eki'de YENİDEN YAZILDI (İŞ 7) ──
 * Eski hâli sayfanın markup'ını grep'liyordu: h1'in `kayitBulundu` üçlüsüne
 * bağlı olması, `durum ===` karşılaştırmasının tam bir kez geçmesi, gövde
 * paragraflarının içeriği. İŞ 7 ile metinlerin TAMAMI `lib/odeme-tamam.ts`'e
 * taşındı ve sayfa yalnız basıyor — yani o ölçütlerin baktığı şeyler sayfada
 * artık yok.
 *
 * **Hiçbir ölçüt DÜŞÜRÜLMEDİ, niyetleri taşındı:** "h1 sabit değil", "iki
 * durumda iki farklı metin", "gövde h1'i tekrarlamaz", "tek koşul" — hepsi
 * aşağıda, artık davranış testi olarak (lib çağrılabiliyor, markup grep'inden
 * güçlü). Sayfa tarafında kalan ölçütler yapısal: metin sayfada YAŞAMIYOR,
 * katılım bilgisi BASILMIYOR, sıra doğru.
 *
 * Dosya `src/lib/` altında (KARAR 574).
 */

const ONLINE: TamamGirdi = {
  kayitDurumu: 'bulundu',
  baslik: 'Elin Neyle Dolu?',
  tarihISO: '2026-10-12',
  tarihBitis: '',
  saat: '21:00',
  mekan: 'Online',
};
const YUZYUZE: TamamGirdi = { ...ONLINE, mekan: 'İstanbul', saat: '19:30' };

describe('tamamGorunumu — bulundu dalı, brief metinleri birebir (İŞ 7)', () => {
  it('başlık ve giriş', () => {
    const g = tamamGorunumu(ONLINE);
    expect(g.baslik).toBe('Yerin hazır.');
    expect(g.giris).toBe('Ödemen bize ulaştı.');
  });

  it('durum kartı: etkinlik başlığı + tarih-saat', () => {
    expect(tamamGorunumu(ONLINE).kart).toEqual(['Elin Neyle Dolu?', '12 Ekim 2026 · 21:00']);
  });

  it('⚠ saat `saatHam`dan — cross-fallback saati SIZMAZ', () => {
    // `kayitOku.etkinlikTarihi` düz OR'lu saati taşıyor
    // (`api/kayit.ts:191-198`'in çürüttüğü eşleme). Sayfa ve mail AYNI
    // kurucuyu kullanıyor, yoksa iki yüzey farklı saat söyler.
    expect(tamamGorunumu(YUZYUZE).kart[1]).toBe('12 Ekim 2026 · 19:30');
  });

  it('çok günlü buluşmada kart ARALIK gösterir', () => {
    const g = tamamGorunumu({ ...ONLINE, tarihBitis: '2026-10-14' });
    expect(g.kart[1]).toBe('12 Ekim – 14 Ekim 2026');
  });

  it('başlık/tarih boşsa o satır basılmaz — uydurma yok', () => {
    expect(tamamGorunumu({ ...ONLINE, tarihISO: '' }).kart).toEqual(['Elin Neyle Dolu?']);
    expect(tamamGorunumu({ ...ONLINE, baslik: '', tarihISO: '' }).kart).toEqual([]);
  });

  it('ONLINE: katılım bilgisinin YERİ söyleniyor, kendisi değil', () => {
    const g = tamamGorunumu(ONLINE);
    expect(g.nerede).toBe('Bağlantı ve şifre e-postanda.');
    expect(g.kapanis).toBe('Ateşi biz yakıyoruz. Sen kendi mumunu yakarsın, yeter.');
  });

  it('YÜZ YÜZE: ayrı iki cümle', () => {
    const g = tamamGorunumu(YUZYUZE);
    expect(g.nerede).toBe('Mekân ve adres e-postanda.');
    expect(g.kapanis).toBe('Ateşi biz yakıyoruz. Sen kendini getir, yeter.');
  });

  it('`Zoom` mekânı da online sayılır', () => {
    expect(tamamGorunumu({ ...ONLINE, mekan: 'Zoom' }).nerede).toBe('Bağlantı ve şifre e-postanda.');
  });

  it('bilinmeyen/boş mekân YÜZ YÜZE sayılır — Zoom linki olmayan "online" demiyoruz', () => {
    expect(tamamGorunumu({ ...ONLINE, mekan: '' }).nerede).toBe('Mekân ve adres e-postanda.');
  });

  it('gecikme cümlesi birebir', () => {
    expect(tamamGorunumu(ONLINE).gecikme).toBe(
      'Birkaç dakika içinde görmezsen gereksiz klasörüne bak ya da WhatsApp\'tan yaz, hemen iletelim.',
    );
  });

  it('⚠ KALKAN metinler hiçbir alanda GEÇMİYOR', () => {
    const hepsi = Object.values(tamamGorunumu(ONLINE)).flat().join(' | ');
    for (const kalkan of [
      'Buluşma detaylarını yakında',
      'Buluşma linkin burada',
      'Buluşacağımız yer burada',
      'Zoom şifresi',
      'Mail kutuna da düştü',
      'Ödemen alındı, yerin ayrıldı',
    ]) {
      expect(hepsi, `"${kalkan}" hâlâ var`).not.toContain(kalkan);
    }
  });
});

describe('tamamGorunumu — bulunamadı dalı DEĞİŞMEDİ (eski ölçütlerin niyeti)', () => {
  it('başlık SABİT DEĞİL — iki durumda İKİ FARKLI metin', () => {
    // Eski ölçüt: "h1 SABİT DEĞİL, `kayitBulundu` koşuluna bağlı". Artık
    // davranış testi: aynı fonksiyon iki girdiye iki farklı başlık veriyor.
    const bulundu = tamamGorunumu(ONLINE);
    const yok = tamamGorunumu({ ...ONLINE, kayitDurumu: 'bulunamadi' });
    expect(bulundu.baslik).not.toBe(yok.baslik);
    expect(yok.baslik).toBe('Kaydını bulamadık.');
    expect(yok.bulundu).toBe(false);
  });

  it('`hata` da `bulunamadi` gibi davranır — kadın açısından fark yok', () => {
    expect(tamamGorunumu({ ...ONLINE, kayitDurumu: 'hata' }).baslik).toBe('Kaydını bulamadık.');
  });

  it('gövde başlığı TEKRARLAMAZ', () => {
    // Eski ölçüt aynen: cümle bir yerde söylenir.
    const yok = tamamGorunumu({ ...ONLINE, kayitDurumu: 'bulunamadi' });
    expect(yok.giris).not.toContain('Kaydını bulamadık');
    expect(yok.giris).toMatch(/^Ödemen alındıysa birkaç dakika/);
  });

  it('bulunamadı dalında ETKİNLİK BİLGİSİ SIZMAZ', () => {
    const yok = tamamGorunumu({ ...ONLINE, kayitDurumu: 'bulunamadi' });
    expect(yok.kart).toEqual([]);
    expect(yok.nerede).toBe('');
    expect(yok.kapanis).toBe('');
    expect(JSON.stringify(yok)).not.toContain('Elin Neyle Dolu?');
  });

  it('yardım adresi YALNIZ bulunamadı dalında', () => {
    expect(tamamGorunumu({ ...ONLINE, kayitDurumu: 'bulunamadi' }).yardimEposta).toBe('selam@ocak.biz');
    expect(tamamGorunumu(ONLINE).yardimEposta).toBe('');
  });
});

describe('tamam.astro — kaynak disiplini (İŞ 7)', () => {
  const KAYNAK = readFileSync(join(__dirname, '..', 'pages', 'odeme', 'tamam.astro'), 'utf-8');
  const KOD = KAYNAK
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1');

  it('⚠ KATILIM BİLGİSİ BASILMIYOR — `katilim` okunmuyor', () => {
    // Sayfa `?ref=OCAK-XXXX` ile açılıyor ve referans maillerde, banka
    // açıklamasında, WhatsApp'ta dolaşıyor. Zoom bağlantısını oraya basmak,
    // bağlantıyı referansı bilen herkese açmak demekti.
    expect(KOD).not.toMatch(/\bkatilim\b/);
    expect(KOD).not.toMatch(/zoomSifresi/);
    expect(KOD).not.toMatch(/Zoom şifresi/);
    expect(KOD).not.toMatch(/Buluşma linkin burada/);
    expect(KOD).not.toMatch(/Buluşacağımız yer burada/);
    expect(KOD).not.toMatch(/ocak-odeme-tamam__katilim/);
  });

  it('metinler sayfada DEĞİL — lib\'den geliyor (tek kaynak)', () => {
    expect(KOD).toMatch(/tamamGorunumu\(\{/);
    expect(KOD).not.toMatch(/Yerin hazır/);
    expect(KOD).not.toMatch(/Ödemen bize ulaştı/);
    expect(KOD).not.toMatch(/Kaydını bulamadık/);
    expect(KOD).not.toMatch(/Ateşi biz yakıyoruz/);
  });

  it('KARAR 395 — tek koşul: sayfa `durum`u KENDİ karşılaştırmıyor', () => {
    // Eski ölçüt "`durum ===` tam bir kez geçsin" idi; karşılaştırma artık
    // lib'de, sayfada HİÇ olmamalı. Dördüncü bir yüzey kendi koşulunu yazarsa
    // burası kırmızı yanar.
    expect(KOD).not.toMatch(/durum\s*===/);
    expect(KOD).toMatch(/const kayitBulundu = gorunum\.bulundu;/);
  });

  it('sekme başlığı ve açıklama gövdeyle AYNI kaynaktan', () => {
    expect(KOD).toMatch(/const sayfaBasligi = `\$\{gorunum\.baslik/);
    expect(KOD).toMatch(/const sayfaAciklamasi = gorunum\.baslik;/);
    const layout = KOD.match(/<Layout[^>]*>/)![0];
    expect(layout).toMatch(/title=\{sayfaBasligi\}/);
    expect(layout).toMatch(/description=\{sayfaAciklamasi\}/);
    expect(layout).not.toMatch(/title="/);
  });

  it('SIRA: başlık → durum kartı → açıklama → paylaş → referans (İŞ 8)', () => {
    const i = (p: string) => KOD.indexOf(p);
    expect(i('<h1>{gorunum.baslik}</h1>')).toBeGreaterThan(-1);
    expect(i('ocak-odeme-tamam__kart')).toBeGreaterThan(i('<h1>{gorunum.baslik}</h1>'));
    expect(i('{gorunum.nerede &&')).toBeGreaterThan(i('ocak-odeme-tamam__kart'));
    expect(i('<DavetKutusu')).toBeGreaterThan(i('{gorunum.kapanis &&'));
    // Referans kodu EN ALTTA ve küçük.
    expect(i('ocak-odeme-tamam__ref')).toBeGreaterThan(i('<DavetKutusu'));
  });

  it('durum kartı sitenin mevcut dilinden — yeni token yok', () => {
    const kart = KAYNAK.match(/\.ocak-odeme-tamam__kart \{[\s\S]*?\n  \}/)?.[0] ?? '';
    expect(kart).toBeTruthy();
    // Amber çerçeve + sönük zemin; token uydurulmadı.
    expect(kart).toMatch(/rgba\(196, 75, 47, 0\.28\)/);
    expect(kart).toMatch(/var\(--space-/);
  });

  it('tarih+saat TEK PARÇA — `nowrap` span, 360 px\'te taşmıyor (İŞ 8)', () => {
    // Değer kendi span'inde `nowrap`; çevresindeki cümle normal sarılıyor.
    // `8 Ekim Perşembe, 23:08 (Türkiye saati)` 0.9rem'de ~272 px, 360 px
    // ekranda sayfa payından sonra ~328 px kalıyor.
    const anlik = KAYNAK.match(/\.ocak-odeme-tamam__anlik \{[\s\S]*?\n  \}/)?.[0] ?? '';
    expect(anlik).toMatch(/white-space: nowrap;/);
    expect(anlik).toMatch(/overflow-wrap: break-word;/);
    expect(KOD).toMatch(/<span class="ocak-odeme-tamam__anlik">\{satir\}<\/span>/);
  });

  it('mock uyarısında iç yol haritası jargonu yok', () => {
    expect(KOD).not.toMatch(/Aşama \d/);
    expect(KOD).toMatch(/Bu ödeme simülasyondu/);
  });
});
