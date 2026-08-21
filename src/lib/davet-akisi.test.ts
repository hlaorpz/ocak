import { describe, it, expect } from 'vitest';
import { davetAkisiAcikMi, DAVET_AKISI_ACIK } from './davet-akisi.ts';

// Davet musluğu — 22 Ağustos 2026, açık röle olayı. Kural `kartAkisiAcikMi`
// ile aynı ama anahtar ayrı: kart akışı bir gün açılırken davet akışının da
// açılması gerekmiyor. Test o ayrımı ve fail-closed'ı çiviler.
describe('davetAkisiAcikMi', () => {
  it('yalnız "acik" açar', () => {
    expect(davetAkisiAcikMi('acik')).toBe(true);
  });

  it('"kapali" değeri kapatır', () => {
    expect(davetAkisiAcikMi('kapali')).toBe(false);
  });

  it('FAIL-CLOSED — tanımsız/boş/whitespace kapalıdır', () => {
    // Bir ortamda anahtarı koymayı unutmak, aktif kötüye kullanılan bir mail
    // rölesini sessizce geri AÇMAMALI. Mail gönderen uç fail-open olamaz.
    expect(davetAkisiAcikMi(undefined)).toBe(false);
    expect(davetAkisiAcikMi(null)).toBe(false);
    expect(davetAkisiAcikMi('')).toBe(false);
    expect(davetAkisiAcikMi('   ')).toBe(false);
  });

  it('FAIL-CLOSED — tanınmayan değer ve yazım hatası kapalıdır', () => {
    expect(davetAkisiAcikMi('açık')).toBe(false); // Türkçe karakterli — tanınmaz
    expect(davetAkisiAcikMi('open')).toBe(false);
    expect(davetAkisiAcikMi('true')).toBe(false);
    expect(davetAkisiAcikMi('1')).toBe(false);
    expect(davetAkisiAcikMi('acikk')).toBe(false);
  });

  it('büyük/küçük harf ve kenar boşluğu toleranslı', () => {
    expect(davetAkisiAcikMi('ACIK')).toBe(true);
    expect(davetAkisiAcikMi('  Acik  ')).toBe(true);
    expect(davetAkisiAcikMi('\tacik\n')).toBe(true);
  });

  it('vitest ortamında anahtar tanımsız → akış kapalı', () => {
    // Anahtar bir gün test ortamına girerse bu satır önce kırılır ve
    // "kapalıyken mail gitmiyor" iddiası yanlış yeşil vermez.
    expect(DAVET_AKISI_ACIK).toBe(false);
  });
});
