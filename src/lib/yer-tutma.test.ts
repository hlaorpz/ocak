import { describe, it, expect } from 'vitest';
import {
  etkinlikBaslangicAni,
  yerTutmaBitisi,
  yerTutmaUzat,
  yakinMi,
  sonAnMetni,
  SURE,
  TR_OFFSET,
} from './yer-tutma.ts';

/**
 * `lib/yer-tutma.ts` — başlangıç anı + yer tutma süreleri.
 *
 * ⚠ Testler `Date`i ANLA kuruyor, duvar saatiyle değil: `new Date('…+03:00')`
 * her makinede aynı anı verir, `new Date('2026-10-12T20:00')` vermez (yerel
 * dilime göre kayar). CI UTC, geliştirme makinesi TR — ikisinde de aynı sonuç
 * çıkmalı.
 *
 * Dosya `src/lib/` altında (KARAR 574).
 */

const an = (s: string) => new Date(s);

describe('etkinlikBaslangicAni — üç ölçülmüş biçim (7 Eki 2026)', () => {
  it('BİÇİM 1 · `Tarih` saat+offset taşıyor → o otorite, saat alanları yok sayılır', () => {
    // Ölçülen satır: Online · `2026-11-21T17:00:00.000+03:00` ·
    // Saat `İki cumartesi · 17:00-20:00` · Zoom `17:00`.
    const r = etkinlikBaslangicAni({
      tarihISO: '2026-11-21T17:00:00.000+03:00',
      mekan: 'Online',
      zoomSaat: '09:00',          // kasten çelişkili
      klasikSaat: '08:00',        // kasten çelişkili
    });
    expect(r?.toISOString()).toBe('2026-11-21T14:00:00.000Z');
  });

  it('BİÇİM 2 · gün-yalnız + Online → `Zoom Başlangıç Saati`', () => {
    // Ölçülen satır: Online · `2026-10-12` · Saat `21:00-22:00` · Zoom `21:00`.
    const r = etkinlikBaslangicAni({
      tarihISO: '2026-10-12',
      mekan: 'Online',
      zoomSaat: '21:00',
      klasikSaat: '21:00-22:00',
    });
    expect(r?.toISOString()).toBe('2026-10-12T18:00:00.000Z');
  });

  it('BİÇİM 3 · gün-yalnız + fiziksel → `Saat`, aralığın BAŞI alınır', () => {
    // Ölçülen satır: İzmir · `2027-03-01` · Saat `20:00-23:00` · Zoom `20:00`.
    const r = etkinlikBaslangicAni({
      tarihISO: '2027-03-01',
      mekan: 'İzmir',
      zoomSaat: '20:00',
      klasikSaat: '20:00-23:00',
    });
    expect(r?.toISOString()).toBe('2027-03-01T17:00:00.000Z');
  });

  it('cross-fallback YOK — fiziksel etkinlikte Zoom saati SIZMAZ', () => {
    // `api/kayit.ts:191-198`'in canlı veriyle çürüttüğü kusur: iki alan da
    // doluyken Zoom saati fiziksel buluşmanın saatini eziyordu.
    const r = etkinlikBaslangicAni({
      tarihISO: '2026-10-12',
      mekan: 'İstanbul',
      zoomSaat: '09:00',
      klasikSaat: '20:00-23:00',
    });
    expect(r?.toISOString()).toBe('2026-10-12T17:00:00.000Z');
  });

  it('serbest metinden ilk HH:MM — "İki cumartesi · 17:00-20:00"', () => {
    const r = etkinlikBaslangicAni({
      tarihISO: '2026-11-21',
      mekan: 'İzmir',
      zoomSaat: '',
      klasikSaat: 'İki cumartesi · 17:00-20:00',
    });
    expect(r?.toISOString()).toBe('2026-11-21T14:00:00.000Z');
  });

  it('saat HİÇ okunamıyorsa → o günün 23:59\'u (Kaan kararı), gün başı DEĞİL', () => {
    // Gün başı seçilseydi etkinlik günü kayıt olan birinin yer tutma bitişi
    // doğduğu anda geçmiş olur ve ilk tarama onu iptal ederdi.
    const r = etkinlikBaslangicAni({
      tarihISO: '2026-10-12',
      mekan: 'İzmir',
      zoomSaat: '',
      klasikSaat: 'akşam',
    });
    expect(r?.toISOString()).toBe('2026-10-12T20:59:00.000Z'); // 23:59 +03:00
  });

  it('online ama Zoom saati boş → gün sonu (Saat\'e DÜŞMEZ)', () => {
    const r = etkinlikBaslangicAni({
      tarihISO: '2026-10-12',
      mekan: 'Online',
      zoomSaat: '',
      klasikSaat: '21:00-22:00',
    });
    expect(r?.toISOString()).toBe('2026-10-12T20:59:00.000Z');
  });

  it('`Zoom` mekânı da online sayılır (şemada iki değer var)', () => {
    const r = etkinlikBaslangicAni({
      tarihISO: '2026-10-12', mekan: 'Zoom', zoomSaat: '21:00', klasikSaat: '',
    });
    expect(r?.toISOString()).toBe('2026-10-12T18:00:00.000Z');
  });

  it('`Tarih` boş ya da bozuk → null, an UYDURULMAZ', () => {
    const g = { mekan: 'Online', zoomSaat: '21:00', klasikSaat: '' };
    expect(etkinlikBaslangicAni({ ...g, tarihISO: '' })).toBeNull();
    expect(etkinlikBaslangicAni({ ...g, tarihISO: 'yakında' })).toBeNull();
  });

  it('geçersiz saat değeri (25:00) yok sayılır → gün sonu', () => {
    const r = etkinlikBaslangicAni({
      tarihISO: '2026-10-12', mekan: 'Online', zoomSaat: '25:00', klasikSaat: '',
    });
    expect(r?.toISOString()).toBe('2026-10-12T20:59:00.000Z');
  });

  it('TR sabit +03:00 — kış ve yaz AYNI offset (DST yok)', () => {
    expect(TR_OFFSET).toBe('+03:00');
    const kis = etkinlikBaslangicAni({ tarihISO: '2026-01-15', mekan: 'Online', zoomSaat: '12:00', klasikSaat: '' });
    const yaz = etkinlikBaslangicAni({ tarihISO: '2026-07-15', mekan: 'Online', zoomSaat: '12:00', klasikSaat: '' });
    expect(kis?.toISOString()).toBe('2026-01-15T09:00:00.000Z');
    expect(yaz?.toISOString()).toBe('2026-07-15T09:00:00.000Z');
  });
});

describe('yerTutmaBitisi — kart 3 sa · havale 24/12 sa', () => {
  const kayit = an('2026-10-01T12:00:00+03:00');
  const uzakEtkinlik = an('2026-11-01T21:00:00+03:00');

  it('kart → kayıt + 3 saat', () => {
    const r = yerTutmaBitisi({ yontem: 'kart', ucretliMi: true, kayitAni: kayit, etkinlikBaslangici: uzakEtkinlik });
    expect(r?.toISOString()).toBe('2026-10-01T12:00:00.000Z'); // 15:00 +03:00
    expect(SURE.kartSaat).toBe(3);
  });

  it('havale → kayıt + 24 saat', () => {
    const r = yerTutmaBitisi({ yontem: 'havale', ucretliMi: true, kayitAni: kayit, etkinlikBaslangici: uzakEtkinlik });
    expect(r?.toISOString()).toBe('2026-10-02T09:00:00.000Z'); // ertesi gün 12:00 +03:00
  });

  it('ÜCRETSİZ → null, süre hesaplanmaz', () => {
    const r = yerTutmaBitisi({ yontem: 'havale', ucretliMi: false, kayitAni: kayit, etkinlikBaslangici: uzakEtkinlik });
    expect(r).toBeNull();
  });

  it('≤72 SAAT kuralı: havale 24 → 12 saate düşer', () => {
    // Etkinlik kayıttan 48 saat sonra → yakın.
    const yakinEtkinlik = an('2026-10-03T12:00:00+03:00');
    expect(yakinMi(kayit, yakinEtkinlik)).toBe(true);
    const r = yerTutmaBitisi({ yontem: 'havale', ucretliMi: true, kayitAni: kayit, etkinlikBaslangici: yakinEtkinlik });
    expect(r?.toISOString()).toBe('2026-10-01T21:00:00.000Z'); // +12 sa → 2 Eki 00:00 +03:00
  });

  it('72 saatin TAM üstü yakın DEĞİL, tam 72 saat yakın', () => {
    const tam72 = an('2026-10-04T12:00:00+03:00');
    const biraz = new Date(tam72.getTime() + 60_000);
    expect(yakinMi(kayit, tam72)).toBe(true);
    expect(yakinMi(kayit, biraz)).toBe(false);
  });

  it('kart süresi ≤72 saat kuralından ETKİLENMEZ — 3 saat sabit', () => {
    const yakinEtkinlik = an('2026-10-02T12:00:00+03:00');
    const r = yerTutmaBitisi({ yontem: 'kart', ucretliMi: true, kayitAni: kayit, etkinlikBaslangici: yakinEtkinlik });
    expect(r?.toISOString()).toBe('2026-10-01T12:00:00.000Z');
  });

  it('⚠ SINIR: bitiş etkinlik başlangıcını AŞAMAZ — başlangıca kırpılır', () => {
    // Etkinlik kayıttan 1 saat sonra; kart süresi 3 saat olurdu.
    const hemen = an('2026-10-01T13:00:00+03:00');
    const r = yerTutmaBitisi({ yontem: 'kart', ucretliMi: true, kayitAni: kayit, etkinlikBaslangici: hemen });
    expect(r?.toISOString()).toBe(hemen.toISOString());
  });

  it('sınır havalede de geçerli', () => {
    const hemen = an('2026-10-01T18:00:00+03:00');
    const r = yerTutmaBitisi({ yontem: 'havale', ucretliMi: true, kayitAni: kayit, etkinlikBaslangici: hemen });
    expect(r?.toISOString()).toBe(hemen.toISOString());
  });

  it('etkinlik başlangıcı BİLİNMİYORSA kırpma yapılmaz', () => {
    // Bilinmeyen bir sınıra karşı kırpmak, sınırı sıfır saymak olurdu.
    const r = yerTutmaBitisi({ yontem: 'havale', ucretliMi: true, kayitAni: kayit, etkinlikBaslangici: null });
    expect(r?.toISOString()).toBe('2026-10-02T09:00:00.000Z');
    expect(yakinMi(kayit, null)).toBe(false);
  });

  it('etkinlik GEÇMİŞSE bitiş doğduğu anda geçmiştir', () => {
    const gecmis = an('2026-09-01T21:00:00+03:00');
    const r = yerTutmaBitisi({ yontem: 'kart', ucretliMi: true, kayitAni: kayit, etkinlikBaslangici: gecmis });
    expect(r!.getTime()).toBeLessThan(kayit.getTime());
  });
});

describe('yerTutmaUzat — havale ek süresi', () => {
  const simdi = an('2026-10-02T12:00:00+03:00');
  const uzak = an('2026-11-01T21:00:00+03:00');

  it('normal → +12 saat, ŞİMDİDEN sayılır (mevcut bitişten değil)', () => {
    // Mevcut bitişten sayılsaydı tarama gecikmesi ek sürenin içinden yenirdi
    // ve maildeki "yeni son an" kadının eline geçtiğinde kısalmış olurdu.
    const r = yerTutmaUzat({ simdi, yakin: false, etkinlikBaslangici: uzak });
    expect(r.toISOString()).toBe('2026-10-02T21:00:00.000Z'); // 3 Eki 00:00 +03:00
    expect(SURE.havaleEkSaat).toBe(12);
  });

  it('yakın → +6 saat', () => {
    const r = yerTutmaUzat({ simdi, yakin: true, etkinlikBaslangici: uzak });
    expect(r.toISOString()).toBe('2026-10-02T15:00:00.000Z'); // 18:00 +03:00
    expect(SURE.havaleYakinEkSaat).toBe(6);
  });

  it('uzatma da etkinlik başlangıcıyla SINIRLI', () => {
    const hemen = an('2026-10-02T15:00:00+03:00');
    const r = yerTutmaUzat({ simdi, yakin: false, etkinlikBaslangici: hemen });
    expect(r.toISOString()).toBe(hemen.toISOString());
  });
});

describe('sonAnMetni — `8 Ekim Perşembe, 14:30 (Türkiye saati)`', () => {
  it('brief\'in biçimi birebir', () => {
    // 8 Ekim 2026 bir Perşembe.
    expect(sonAnMetni(an('2026-10-08T14:30:00+03:00'))).toBe(
      '8 Ekim Perşembe, 14:30 (Türkiye saati)',
    );
  });

  it('TR dilimine göre okunur — UTC gün sınırı günü KAYDIRMAZ', () => {
    // `2026-10-08T22:30:00Z` = TR'de 9 Ekim 01:30. Sunucu dilimiyle (UTC)
    // okunsaydı "8 Ekim … 22:30" derdi — `havale-vade.ts`'nin KARAR 385'te
    // öğrendiği hata. 9 Ekim 2026 Cuma.
    expect(sonAnMetni(an('2026-10-08T22:30:00Z'))).toBe(
      '9 Ekim Cuma, 01:30 (Türkiye saati)',
    );
  });

  it('tek haneli gün ve saat sıfır dolgulu saatle basılır', () => {
    expect(sonAnMetni(an('2026-10-01T09:05:00+03:00'))).toBe(
      '1 Ekim Perşembe, 09:05 (Türkiye saati)',
    );
  });

  it('yaz ve kış aynı offsetle okunur (DST yok)', () => {
    expect(sonAnMetni(an('2026-07-15T12:00:00+03:00'))).toContain('12:00');
    expect(sonAnMetni(an('2026-01-15T12:00:00+03:00'))).toContain('12:00');
  });
});
