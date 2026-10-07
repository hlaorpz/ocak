import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * KayitFormu — KVKK + Mesafeli Satış onayı validasyon state disiplini
 * (KARAR 254 aday, Aşama 5 düzeltme).
 *
 * Tekrar eden tuzak (Pilot devri #41): KVKK checkbox işaretsiz submit →
 * `oninvalid` `setCustomValidity('KVKK onayı gerekiyor')` set ediyor;
 * kullanıcı checkbox'ı işaretliyor → `onchange` customValidity'yi
 * temizlemiyor → tekrar submit'te browser bubble TEKRAR çıkıyor, kayıt
 * geçemiyor.
 *
 * KÖK NEDEN: `Array.from(this.form.elements[this.name]).forEach(...)`
 * pattern'i radio GROUP için yazılmış (`form.elements[radioName]`
 * RadioNodeList döner — iterable). Tekli checkbox için
 * `form.elements.kvkk` doğrudan HTMLInputElement döner — iterable DEĞİL,
 * `length` property'si YOK → `Array.from(...)` boş `[]` döner → forEach
 * skip → `setCustomValidity('')` HİÇ çağrılmaz → customError stale.
 *
 * DOĞRU PATTERN (tekli checkbox): `onchange="this.setCustomValidity('')"`.
 * Source-level grep ile bug pattern'inin geri sızmasını koruyoruz.
 */

const SOURCE_PATH = join(__dirname, 'KayitFormu.astro');

describe('KayitFormu.astro — KVKK/Mesafeli onay validasyon state (KARAR 254 aday)', () => {
  const source = readFileSync(SOURCE_PATH, 'utf-8');

  it('KVKK checkbox onchange direkt setCustomValidity temizler (tekli checkbox doğru pattern)', () => {
    // <input ... name="kvkk" ... onchange="this.setCustomValidity('')">
    const kvkkInputMatch = source.match(
      /<input[^>]*\bname=["']kvkk["'][^>]*>/,
    );
    expect(kvkkInputMatch).toBeTruthy();
    const kvkkInput = kvkkInputMatch![0];
    expect(kvkkInput).toMatch(/onchange=["']this\.setCustomValidity\(''\)["']/);
  });

  it('KVKK checkbox `Array.from(this.form.elements[this.name])` bug pattern YOK', () => {
    // Tekli checkbox için boş array döner → forEach skip → customError stale.
    // Kademe radio'da (RadioNodeList iterable) çalışır; KVKK'da çalışmaz.
    const kvkkInputMatch = source.match(
      /<input[^>]*\bname=["']kvkk["'][^>]*>/,
    );
    expect(kvkkInputMatch).toBeTruthy();
    expect(kvkkInputMatch![0]).not.toContain('Array.from(this.form.elements');
  });

  it('KVKK checkbox oninvalid metni TR ("KVKK onayı gerekiyor")', () => {
    const kvkkInputMatch = source.match(
      /<input[^>]*\bname=["']kvkk["'][^>]*>/,
    );
    expect(kvkkInputMatch).toBeTruthy();
    expect(kvkkInputMatch![0]).toContain(
      "setCustomValidity('KVKK onayı gerekiyor')",
    );
  });

  it('Mesafeli checkbox onchange direkt setCustomValidity temizler', () => {
    const mesafeliInputMatch = source.match(
      /<input[^>]*\bname=["']mesafeli_onay["'][^>]*>/,
    );
    expect(mesafeliInputMatch).toBeTruthy();
    expect(mesafeliInputMatch![0]).toMatch(
      /onchange=["']this\.setCustomValidity\(''\)["']/,
    );
  });

  it('Mesafeli checkbox bug pattern YOK', () => {
    const mesafeliInputMatch = source.match(
      /<input[^>]*\bname=["']mesafeli_onay["'][^>]*>/,
    );
    expect(mesafeliInputMatch).toBeTruthy();
    expect(mesafeliInputMatch![0]).not.toContain(
      'Array.from(this.form.elements',
    );
  });

  it('Mesafeli checkbox oninvalid TR metni ("Devam etmek için onaylamanız gerekiyor")', () => {
    const mesafeliInputMatch = source.match(
      /<input[^>]*\bname=["']mesafeli_onay["'][^>]*>/,
    );
    expect(mesafeliInputMatch).toBeTruthy();
    expect(mesafeliInputMatch![0]).toContain(
      "setCustomValidity('Devam etmek için onaylamanız gerekiyor')",
    );
  });
});

/**
 * B211 İŞ 6 — success ekranındaki "Mail kutuna da düştü." cümlesi.
 *
 * Cümle iki aydır KOŞULSUZDU ve mail MailerLite otomasyonundan gidiyordu;
 * kod gidip gitmediğini bilmiyordu. Artık `/api/kayit` `postaGitti` döndürüyor
 * (o istekte Resend kabul etti mi) ve cümlenin ikinci yarısı yalnız o doğruysa
 * basılıyor. Kart seçende kayıt anında mail yok → yarım cümle.
 *
 * Aynı yanlış `/odeme/tamam`'da da vardı ve orada KALDIRILDI (`fc32dc7`);
 * burada kaldırmak yerine koşula bağlanıyor, çünkü ücretsiz kayıtta mail
 * gerçekten o anda gidiyor ve cümle doğru oluyor.
 */
describe('KayitFormu.astro — "Mail kutuna da düştü." koşula bağlı (B211 İŞ 6)', () => {
  const KAYNAK = readFileSync(SOURCE_PATH, 'utf-8');
  // Ölçütler yorumları ELEYEREK çalışır: yukarıdaki gerekçe bloğu yasaklanan
  // dizeyi alıntılıyor ve ham kaynakta ölçmek kendi anlatısına takılırdı.
  const KOD = KAYNAK
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1');

  it('cümle KOŞULSUZ basılmıyor — `postaGitti`ye bağlı', () => {
    // Regresyon kilidi: tek parça dize geri gelirse burası kırmızı yanar.
    expect(KOD).not.toMatch(/'Buluşma linkin burada\. Mail kutuna da düştü\.'/);
    expect(KOD).not.toMatch(/'Buluşacağımız yer burada\. Mail kutuna da düştü\.'/);
    expect(KOD).toMatch(/result\.postaGitti/);
  });

  it('iki yarı ayrı: yer cümlesi KOŞULSUZ, mail cümlesi KOŞULLU', () => {
    expect(KOD).toMatch(/'Buluşma linkin burada\.'/);
    expect(KOD).toMatch(/'Buluşacağımız yer burada\.'/);
    // Mail yarısı yalnız doğru dalda.
    const dogruDal = KOD.match(/result\.postaGitti\s*\n?\s*\?\s*`[^`]*`/)?.[0] ?? '';
    expect(dogruDal).toContain('Mail kutuna da düştü.');
  });

  it('METİN DEĞİŞMEDİ — yeni kamu metni yazılmadı', () => {
    // Brief §0: yalnız mevcut bir cümle koşula bağlanır ya da kaldırılır.
    const maili = KOD.match(/Mail kutuna da düştü\./g) ?? [];
    expect(maili).toHaveLength(1);
  });

  it('`mailerlite` alanına ARTIK bakılmıyor', () => {
    // Endpoint o alanı döndürmüyor; okumak sessizce `undefined` görmek olurdu.
    expect(KOD).not.toMatch(/result\.mailerlite/);
  });
});

/**
 * İŞ 2 — havale başarı ekranında "üç gün" KALKTI.
 *
 * Süre artık kaydın `Yer Tutma Bitişi`'nden geliyor (`/api/kayit` yanıtında
 * `odeme.sonAn`, `ODEME_SON_AN` biçiminde) ve mailin söylediği anla AYNI.
 * Eski hâl üç yerde sabit "üç gün" diyordu: `havale-vade.ts` (kaldırıldı),
 * bu dosyadaki yedek dize ve statik satır.
 */
describe('KayitFormu.astro — havale süresi kayıttan gelir, "üç gün" yok (İŞ 2)', () => {
  const KAYNAK = readFileSync(SOURCE_PATH, 'utf-8');
  const KOD = KAYNAK
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1');

  it('"üç gün" hiçbir biçimde KALMADI', () => {
    expect(KOD).not.toMatch(/üç gün/i);
    expect(KOD).not.toMatch(/Üç gün/);
  });

  it('`vadeMetni` okunmuyor — yerine `sonAn`', () => {
    expect(KOD).not.toMatch(/vadeMetni/);
    expect(KOD).toMatch(/result\.odeme\.sonAn/);
  });

  it('süre cümlesi brief metniyle birebir ve KOŞULLU', () => {
    expect(KOD).toMatch(/Yerini şu ana kadar tutuyoruz: \$\{result\.odeme\.sonAn\}\./);
    // `sonAn` boşsa cümle HİÇ basılmaz; gömülü yedek dize de yok.
    expect(KOD).toMatch(/const sureCumlesi = result\.odeme\.sonAn\s*\n?\s*\?/);
    expect(KOD).toMatch(/: '';/);
  });

  it('ikinci satır brief metniyle birebir', () => {
    expect(KOD).toMatch(/Payın ulaştığında sana yazarız\. Süre dar geliyorsa haber ver, birlikte bakarız\./);
    expect(KOD).not.toMatch(/yerini tutarız\./);
  });

  it('IBAN tablosu AYNEN duruyor', () => {
    for (const alan of ['data-kf-success-tutar', 'data-kf-success-iban', 'data-kf-success-ad', 'data-kf-success-aciklama']) {
      expect(KOD).toContain(alan);
    }
    expect(KOD).toMatch(/Açıklamaya referans kodunu yaz; ödemeni onunla buluyoruz\./);
  });
});

/**
 * İŞ 6 — "Bir kor daha bırak" (Katman B, KARAR 240) FORMDAN KALKTI.
 *
 * Opt-in kutusu, katkı tutarı input'u, Toplam'daki "Bir kor" satırı ve bunların
 * JS'i + CSS'i gitti. Toplam artık yalnız kademe tutarı (− indirim).
 *
 * ⚠ Notion alanları (`Askı Tutarı` · `Tip: Askı Katkısı`) ve `uygulaIndirim`'in
 * `katmanB` parametresi DURUYOR — yalnız formdan beslenmiyorlar.
 */
describe('KayitFormu.astro — Katman B formdan kalktı (İŞ 6)', () => {
  const KAYNAK = readFileSync(SOURCE_PATH, 'utf-8');
  const KOD = KAYNAK
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1');

  it('opt-in kutusu ve tutar input\'u YOK', () => {
    expect(KOD).not.toMatch(/data-kf-kor/);
    expect(KOD).not.toMatch(/data-kf-aski-tutar/);
    expect(KOD).not.toMatch(/name="aski_tutar"/);
    expect(KOD).not.toMatch(/Bir kor daha bırak/);
  });

  it('Toplam\'da "Bir kor" satırı YOK', () => {
    expect(KOD).not.toMatch(/data-kf-katmanB/);
    expect(KOD).not.toMatch(/<span>Bir kor<\/span>/);
  });

  it('`aski_tutar` FormData\'dan OKUNMUYOR, payload\'a girmiyor', () => {
    expect(KOD).not.toMatch(/data\.get\('aski_tutar'\)/);
    expect(KOD).not.toMatch(/askiTutar \}/);
  });

  it('toplam = kademe − indirim; katmanB sabit 0', () => {
    // `uygulaIndirim` imzası DARALTILMADI — başka bir yüzey onu besleyebilir.
    expect(KOD).toMatch(/uygulaIndirim\(katmanA, 0, promoSonuc\)/);
    expect(KOD).toMatch(/uygulaIndirim\(gecisKatmanA, 0, promoSonuc\)/);
  });

  it('ölü JS ve CSS kalmadı', () => {
    for (const ad of ['korToggleEl', 'syncKorToggle', 'korBolum', 'katmanBSlot', 'korAcik']) {
      expect(KOD, `${ad} hâlâ var`).not.toMatch(new RegExp(`\\b${ad}\\b`));
    }
    expect(KOD).not.toMatch(/kayit-formu__kor-/);
    expect(KOD).not.toMatch(/kayit-formu__tutar-satir--katmanB/);
  });

  it('kademe seçimi ve indirim satırı DOKUNULMADI', () => {
    expect(KOD).toMatch(/data-kf-kademe/);
    expect(KOD).toMatch(/data-kf-indirim-slot/);
    expect(KOD).toMatch(/data-kf-toplam/);
  });
});

/**
 * İŞ 9 — havale seçim notu (KARAR 274 metni) iki yüzeyi birlikte söyler.
 *
 * Eski hâli yalnız ekranı söylüyordu. Havale kaydı artık `yerini-tutuyoruz`
 * mailini de alıyor (B211 İŞ 2) ve IBAN o mailde de duruyor; kadın ekranı
 * kapatırsa bilgiyi nerede bulacağını bilmeliydi.
 */
describe('KayitFormu.astro — havale notu ekran + e-posta (İŞ 9)', () => {
  const KOD = readFileSync(SOURCE_PATH, 'utf-8')
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1');

  it('yeni metin birebir', () => {
    expect(KOD).toMatch(/Hesap bilgileri kaydını gönderince ekranda ve e-postanda olacak\./);
  });

  it('eski metin KALMADI', () => {
    expect(KOD).not.toMatch(/kaydını gönderdikten sonra ekranda görünecek/);
  });

  it('not yalnız HAVALE seçiliyken görünür — koşul bozulmadı', () => {
    expect(KOD).toMatch(/havaleNotEl\.hidden = yontem !== 'havale';/);
  });
});

/**
 * İŞ 10 — kart güven cümlesi formda, kart seçeneğinin altında.
 *
 * Cümle `/odeme/nkolay`'da yaşıyordu ve o sayfa sakin geçiş ekranına dönüşünce
 * düştü (İŞ 3). Söylediği şey hâlâ doğru ama okunacak yeri BURASI: o sayfa
 * milisaniyeler içinde kendini submit ediyor, orada basılan cümle okunamıyordu.
 */
describe('KayitFormu.astro — kart güven cümlesi (İŞ 10)', () => {
  const KOD = readFileSync(SOURCE_PATH, 'utf-8')
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1');

  it('cümle birebir ve sağlayıcı adını taşıyor', () => {
    // Kadın bankanın 3D ekranında o markayı görecek; adı önceden görmemek
    // tereddüt yaratır.
    expect(KOD).toMatch(
      /Kart bilgilerin N-Kolay'da alınır; OCAK bu bilgileri görmez ve\s*\n?\s*saklamaz\./,
    );
  });

  it('YALNIZ kart seçiliyken görünür', () => {
    expect(KOD).toMatch(/data-kf-yontem-kart-not hidden/);
    expect(KOD).toMatch(/kartNotEl\.hidden = yontem !== 'kart';/);
  });

  it('iki not AYNI sınıfı paylaşıyor — ayrışamazlar', () => {
    const notlar = KOD.match(/class="kayit-formu__yontem-not"/g) ?? [];
    expect(notlar).toHaveLength(2);
    expect(KOD).not.toMatch(/kayit-formu__yontem-havale-not/);
  });

  it('aynı anda yalnız biri görünür — iki koşul birbirinin tersi', () => {
    expect(KOD).toMatch(/havaleNotEl\.hidden = yontem !== 'havale';/);
    expect(KOD).toMatch(/kartNotEl\.hidden = yontem !== 'kart';/);
  });
});
