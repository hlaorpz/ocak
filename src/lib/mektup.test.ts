import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ATES_MEKTUPLARI_GROUP_ID, MEKTUP_METIN, mektupMesaji } from './mektup.ts';

/**
 * Ateş Mektupları tek dokunuş (İŞ 5, 7 Eki).
 *
 * Uç `/api/mektup-katil`, bileşen `MektupKutusu.astro`. İkisi de route/`.astro`
 * olduğu için ölçüm kaynak-grep'iyle; metinler ve grup kimliği lib'den
 * davranış testiyle.
 *
 * Dosya `src/lib/` altında (KARAR 574).
 */

const UC = readFileSync(join(__dirname, '..', 'pages', 'api', 'mektup-katil.ts'), 'utf-8');
const BILESEN = readFileSync(join(__dirname, '..', 'components', 'MektupKutusu.astro'), 'utf-8');
const FORM_UC = readFileSync(join(__dirname, '..', 'pages', 'api', 'form.ts'), 'utf-8');
const temiz = (k: string) => k
  .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/(^|[^:])\/\/.*$/gm, '$1');

describe('metinler — Kaan verdi, birebir', () => {
  it('başlık · gövde · düğme · başarı · hata (İŞ 12)', () => {
    expect(MEKTUP_METIN.baslik).toBe('Ateş Mektupları');
    expect(MEKTUP_METIN.govde).toBe(
      "OCAK'ın ritmi, ara ara posta kutunda. Bu e-postayla katılmak için bir dokunuş yeter.",
    );
    expect(MEKTUP_METIN.dugme).toBe('KATIL');
    expect(MEKTUP_METIN.basari).toBe('Hoş geldin. Bir sonraki mektup sana da gelecek.');
    expect(MEKTUP_METIN.hata).toBe('Şu an olmadı; birazdan yeniden dene.');
  });

  it('İŞ 5 metinleri KALKTI — regresyon kilidi', () => {
    const hepsi = Object.values(MEKTUP_METIN).join(' | ');
    expect(hepsi).not.toContain('Ritmi dinle.');
    expect(hepsi).not.toContain('İlk mektubun yolda.');
    expect(hepsi).not.toContain("Ateş Mektupları'na katıl");
  });

  it('başarı cümlesi TUTULABİLİR bir söz veriyor', () => {
    // Eski hâl "İlk mektubun yolda." diyordu ve bülten ayda bir çıkıyor
    // (`AtesMektuplari`: "Ayda bir, doğrudan kutuna") — "yolda" haftalar sonra
    // demek olurdu.
    expect(MEKTUP_METIN.basari).toMatch(/Bir sonraki mektup/);
  });

  it('⚠ hata SESSİZ DEĞİL — her başarısızlık aynı cümleye düşer', () => {
    // Sebep gövdeye yazılmıyor: "kayit-yok" ile "imza" farkını dışarıya
    // söylemek, deneyen birine yön göstermek olurdu.
    for (const sebep of ['imza', 'kayit-yok', 'email-yok', 'mailerlite', 'yapilandirma'] as const) {
      expect(mektupMesaji({ ok: false, sebep })).toBe(MEKTUP_METIN.hata);
    }
    expect(mektupMesaji({ ok: true })).toBe(MEKTUP_METIN.basari);
  });
});

describe('grup kimliği — iki dosya TEK sayı söyler', () => {
  it('`/api/form`\'daki değerle AYNI', () => {
    // ⚠ İkinci kopya: `/api/form`'a dokunmam istenmedi (Kaan), o yüzden değer
    // iki yerde. Bu kilit sürüklenmeyi yakalar — ayrışırsa kırmızı yanar.
    const formDeger = FORM_UC.match(/const ATES_MEKTUPLARI_GROUP_ID = '(\d+)'/)?.[1];
    expect(formDeger).toBeTruthy();
    expect(ATES_MEKTUPLARI_GROUP_ID).toBe(formDeger);
  });

  it('`/api/form` DEĞİŞTİRİLMEDİ — kendi işleyicisi yerinde', () => {
    expect(FORM_UC).toMatch(/async function handleAtesMektuplari\(body: FormBody\)/);
    expect(FORM_UC).toMatch(/groupId: ATES_MEKTUPLARI_GROUP_ID,/);
  });
});

describe('/api/mektup-katil — istemci e-posta göndermez, imza şart', () => {
  const KOD = temiz(UC);

  it('⚠ gövdeden E-POSTA OKUNMUYOR — yalnız kayitId + imza', () => {
    expect(KOD).toMatch(/govde\.kayitId/);
    expect(KOD).toMatch(/govde\.imza/);
    expect(KOD).not.toMatch(/govde\.email/);
    // Adres Notion'dan okunuyor.
    expect(KOD).toMatch(/async function emailOku\(kayitId: string\)/);
    expect(KOD).toMatch(/p\['Email'\]\?\.email/);
  });

  it('⚠ İMZA EN BAŞTA — Notion\'a dokunmadan', () => {
    const iImza = KOD.indexOf('odemeLinkiGecerli(');
    const iNotion = KOD.indexOf('await emailOku(');
    expect(iImza).toBeGreaterThan(-1);
    expect(iNotion).toBeGreaterThan(iImza);
  });

  it('origin muhafızı en başta — gövde bile okunmadan', () => {
    const iOrigin = KOD.indexOf('originMuhafizi(request)');
    const iJson = KOD.indexOf('await request.json()');
    expect(iOrigin).toBeGreaterThan(-1);
    expect(iJson).toBeGreaterThan(iOrigin);
  });

  it('yalnız POST — GET yok', () => {
    expect(KOD).toMatch(/export const POST: APIRoute/);
    expect(KOD).not.toMatch(/export const GET/);
  });

  it('MailerLite\'a YALNIZ email + grup — custom field yazılmıyor', () => {
    // Abone tek, alanlar paylaşımlı (B211'in dersi): bülten katılımı bir
    // etkinlik kaydının alanlarını bozmamalı.
    expect(KOD).toMatch(/JSON\.stringify\(\{ email, groups: \[ATES_MEKTUPLARI_GROUP_ID\] \}\)/);
    expect(KOD).not.toMatch(/fields:/);
  });

  it('log\'da e-posta GEÇMEZ — yalnız Kayıt ID', () => {
    const loglar = KOD.match(/console\.\w+\([^;]*\);/g) ?? [];
    expect(loglar.length).toBeGreaterThan(0);
    for (const l of loglar) {
      expect(l).not.toMatch(/\bemail\b/);
    }
  });

  it('401 gövdesinde sebep var ama METİN yok — yön gösterilmiyor', () => {
    expect(KOD).toMatch(/sebep: 'imza' \} satisfies MektupSonuc, 401\)/);
    expect(KOD).not.toMatch(/message:/);
  });
});

describe('MektupKutusu — yalnız tıklamayla, kimliksizse no-op', () => {
  const KOD = temiz(BILESEN);

  it('kimlik yoksa blok BASILMAZ (yuva modu hariç)', () => {
    expect(KOD).toMatch(/const gosterilir = yuva \|\| \(kayitId\.trim\(\)\.length > 0 && imza\.trim\(\)\.length > 0\)/);
  });

  it('⚠ OTOMATİK EKLEME YOK — tek tetikleyici `click`', () => {
    expect(KOD).toMatch(/dugme\.addEventListener\('click'/);
    // Mount anında ya da başka bir olayda çağrı yok.
    const fetchler = KOD.match(/fetch\(/g) ?? [];
    expect(fetchler).toHaveLength(1);
    expect(KOD).not.toMatch(/DOMContentLoaded|addEventListener\('load'/);
  });

  it('kimlik boşsa tıklama no-op — uydurma değer yok', () => {
    expect(KOD).toMatch(/if \(!kayitId \|\| !imza\) return;/);
  });

  it('çift tıklama korumalı; HATADA düğme geri gelir', () => {
    expect(KOD).toMatch(/dugme\.disabled = true;/);
    expect(KOD).toMatch(/dugme\.hidden = true;/);
    expect(KOD).toMatch(/dugme\.disabled = false;/);
  });

  it('gövdede e-posta YOK', () => {
    expect(KOD).toMatch(/JSON\.stringify\(\{ kayitId, imza \}\)/);
    expect(KOD).not.toMatch(/email/);
  });

  it('teyit erişilebilir — role=status + aria-live', () => {
    expect(KOD).toMatch(/role="status" aria-live="polite"/);
  });

  it('düğme PAYLAŞILAN birincil sınıfı kullanıyor (KATIL biçimi)', () => {
    // `.ocak-dugme` İŞ 1'de `.ates-mektuplari__button` ailesinden türetildi;
    // padding birebir aynı.
    expect(KOD).toMatch(/class="ocak-dugme" data-mektup-dugme/);
  });

  it('⚠ E-POSTA ALANI YOK — tek dokunuş (İŞ 12)', () => {
    expect(KOD).not.toMatch(/<input/);
    expect(KOD).not.toMatch(/type="email"/);
  });

  it('görsel dil `AtesMektuplari`\'ndan ÖLÇÜLDÜ — yeni token yok', () => {
    const AM = readFileSync(join(__dirname, '..', 'components', 'AtesMektuplari.astro'), 'utf-8');
    const amBaslik = AM.match(/\.ates-mektuplari__heading \{[\s\S]*?\n  \}/)?.[0] ?? '';
    const amMetin = AM.match(/\.ates-mektuplari__desc \{[\s\S]*?\n  \}/)?.[0] ?? '';
    const amTeyit = AM.match(/\.ates-mektuplari__success-text \{[\s\S]*?\n  \}/)?.[0] ?? '';
    expect(amBaslik && amMetin && amTeyit).toBeTruthy();
    // Başlık: display font · italic · --text-h2 · --cream · 400
    for (const d of ['var(--font-display)', 'font-style: italic', 'var(--text-h2)', 'color: var(--cream)', 'font-weight: 400']) {
      expect(amBaslik, `AtesMektuplari başlığında ${d} yok`).toContain(d);
      expect(BILESEN, `MektupKutusu başlığında ${d} yok`).toContain(d);
    }
    // Metin: --text-base · --cream-soft · 40ch
    for (const d of ['var(--text-base)', 'var(--cream-soft)', 'max-width: 40ch']) {
      expect(amMetin).toContain(d);
      expect(BILESEN).toContain(d);
    }
    // Teyit: display font · italic · 1.15rem · --gold
    for (const d of ['1.15rem', 'color: var(--gold)']) {
      expect(amTeyit).toContain(d);
      expect(BILESEN).toContain(d);
    }
  });

  it('başlık `<h3>` — sayfada `<h1>` var, sıra bozulmuyor', () => {
    expect(KOD).toMatch(/<h3 class="mektup-kutusu__baslik">/);
    expect(KOD).not.toMatch(/<h2/);
  });
});

describe('iki ekranda da bağlı, paylaş bloğunun ALTINDA', () => {
  const TAMAM = temiz(readFileSync(join(__dirname, '..', 'pages', 'odeme', 'tamam.astro'), 'utf-8'));
  const FORM = temiz(readFileSync(join(__dirname, '..', 'components', 'KayitFormu.astro'), 'utf-8'));

  it('`/odeme/tamam` — imza SUNUCUDA üretiliyor', () => {
    expect(TAMAM).toMatch(/<MektupKutusu kayitId=\{ref\} imza=\{odemeLinkImzasi\(ref, odemeLinkSirri\(\)\)\} \/>/);
    expect(TAMAM.indexOf('<MektupKutusu')).toBeGreaterThan(TAMAM.indexOf('<DavetKutusu'));
  });

  it('havale başarı ekranı — yuva modu + dataset reveal\'da doluyor', () => {
    expect(FORM).toMatch(/<MektupKutusu yuva \/>/);
    expect(FORM.indexOf('<MektupKutusu')).toBeGreaterThan(FORM.indexOf('<DavetKutusu'));
    expect(FORM).toMatch(/mektupKutusu\.dataset\.mektupKayit = result\.referansNo;/);
    expect(FORM).toMatch(/mektupKutusu\.dataset\.mektupImza = result\.kayitImzasi;/);
  });

  it('⚠ sır İSTEMCİYE İNMİYOR — yalnız imza', () => {
    for (const k of [TAMAM, FORM]) {
      expect(k).not.toMatch(/ODEME_LINK_SIR/);
    }
    expect(FORM).not.toMatch(/odemeLinkSirri\(\)/);
  });
});
