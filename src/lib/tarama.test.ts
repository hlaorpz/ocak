import { describe, it, expect } from 'vitest';
import {
  satirIslemi,
  taramaPlani,
  gunEtiketi,
  gunHatirlatmaAni,
  mailGonderirMi,
  KART_HATIRLATMA_DK,
  type TaramaSatiri,
} from './tarama.ts';
import { FORMAT_KATEGORI } from './etkinlik-kategori.ts';
import { isKayitFormat } from './kayit.ts';

/**
 * `lib/tarama.ts` — tarama ucunun karar motoru.
 *
 * Brief §4 (b) tablosunun HER SATIRI için bir test, artı (a) ve Ek 2'nin (c)
 * adımı. Testler anla çalışıyor (`+03:00`), duvar saatiyle değil.
 *
 * Dosya `src/lib/` altında (KARAR 574).
 */

const SIMDI = new Date('2026-10-02T12:00:00+03:00');
const dk = (n: number) => n * 60_000;
const sa = (n: number) => n * 3_600_000;

/** Kart, Beklemede, kayıt bir saat önce, bitiş iki saat sonra, etkinlik uzakta. */
const KART: TaramaSatiri = {
  pageId: 'p1',
  kayitId: 'OCAK-7K2M',
  odemeDurumu: 'Beklemede',
  odemeYontemi: 'Kredi Kartı',
  kayitAni: new Date(SIMDI.getTime() - sa(1)),
  yerTutmaBitisi: new Date(SIMDI.getTime() + sa(2)),
  mailGitti: false,
  hatirlatmaGitti: false,
  gunHatirlatmasiGitti: false,
  etkinlikBaslangici: new Date('2026-10-20T21:00:00+03:00'),
  saatOkunabildi: true,
  mekan: 'Online',
  postalanabilir: true,
};

const HAVALE: TaramaSatiri = { ...KART, pageId: 'p2', kayitId: 'OCAK-9ZQ1', odemeYontemi: 'Havale' };

describe('(a) · Ödenmiş ama maili gitmemiş → bildirim', () => {
  it('Ödendi + `Mail Gitti` boş + etkinlik gelecekte → bildirim', () => {
    // Havaleyi Kaan elle Ödendi'ye çekiyor ve o yolda hiçbir kod "yerin hazır"
    // göndermiyor; kartta posta düşmüşse `Mail Gitti` yazılmamış olur.
    const i = satirIslemi({ ...HAVALE, odemeDurumu: 'Ödendi' }, SIMDI);
    expect(i).toEqual({ tip: 'bildirim', satir: expect.objectContaining({ kayitId: 'OCAK-9ZQ1' }) });
  });

  it('`Mail Gitti` işaretliyse dokunulmaz', () => {
    const i = satirIslemi({ ...HAVALE, odemeDurumu: 'Ödendi', mailGitti: true }, SIMDI);
    expect(i).toBeNull();
  });

  it('⚠ etkinlik BAŞLAMIŞSA dokunulmaz', () => {
    // Geçmiş bir buluşmanın Zoom linkini göndermek kafa karıştırır.
    const i = satirIslemi({
      ...HAVALE,
      odemeDurumu: 'Ödendi',
      etkinlikBaslangici: new Date(SIMDI.getTime() - sa(1)),
    }, SIMDI);
    expect(i).toBeNull();
  });

  it('Ödendi ama etkinlik anı bilinmiyorsa bildirim YİNE gider', () => {
    // Tarih boş olması "başladı" demek değil; bilinmeyen bir sınıra karşı
    // susmak kadını katılım bilgisinden mahrum bırakırdı.
    const i = satirIslemi({ ...HAVALE, odemeDurumu: 'Ödendi', etkinlikBaslangici: null }, SIMDI);
    expect(i?.tip).toBe('bildirim');
  });
});

describe('(b) · Bekleyen kayıtlar — tablonun her satırı', () => {
  it('⚠ `Yer Tutma Bitişi` BOŞ → DOKUNULMAZ (brief öncesi kayıtlar)', () => {
    expect(satirIslemi({ ...KART, yerTutmaBitisi: null }, SIMDI)).toBeNull();
    expect(satirIslemi({ ...HAVALE, yerTutmaBitisi: null }, SIMDI)).toBeNull();
    // Hatırlatma eşiği geçmiş olsa bile.
    expect(satirIslemi({
      ...KART, yerTutmaBitisi: null, kayitAni: new Date(SIMDI.getTime() - sa(5)),
    }, SIMDI)).toBeNull();
  });

  it('SATIR 1 · etkinlik başlamış → iptal "Etkinlik başladı" (yöntemden bağımsız)', () => {
    for (const s of [KART, HAVALE]) {
      const i = satirIslemi({ ...s, etkinlikBaslangici: new Date(SIMDI.getTime() - dk(1)) }, SIMDI);
      expect(i).toMatchObject({ tip: 'iptal', neden: 'Etkinlik başladı' });
    }
  });

  it('SATIR 2 · kart + hatırlatma yok + ≥30 dk + bitiş gelmemiş → hatırlat', () => {
    const i = satirIslemi(KART, SIMDI);
    expect(i?.tip).toBe('hatirlat-kart');
  });

  it('SATIR 2 · 30 dk DOLMADIYSA hatırlatılmaz — kadın hâlâ ödeme ekranında olabilir', () => {
    const i = satirIslemi({ ...KART, kayitAni: new Date(SIMDI.getTime() - dk(29)) }, SIMDI);
    expect(i).toBeNull();
    // Tam 30 dakika geçer.
    const tam = satirIslemi({ ...KART, kayitAni: new Date(SIMDI.getTime() - dk(KART_HATIRLATMA_DK)) }, SIMDI);
    expect(tam?.tip).toBe('hatirlat-kart');
  });

  it('SATIR 2 · hatırlatma GİTTİYSE ikinci kez gitmez', () => {
    expect(satirIslemi({ ...KART, hatirlatmaGitti: true }, SIMDI)).toBeNull();
  });

  it('SATIR 3 · kart + bitiş geçmiş → iptal "Kart — süre doldu"', () => {
    const i = satirIslemi({ ...KART, yerTutmaBitisi: new Date(SIMDI.getTime() - dk(1)) }, SIMDI);
    expect(i).toMatchObject({ tip: 'iptal', neden: 'Kart — süre doldu' });
  });

  it('SATIR 4 · havale + hatırlatma yok + bitiş geçmiş → UZAT + mail', () => {
    const i = satirIslemi({ ...HAVALE, yerTutmaBitisi: new Date(SIMDI.getTime() - dk(5)) }, SIMDI);
    expect(i?.tip).toBe('uzat-havale');
    // +12 saat, ŞİMDİDEN sayılır (tarama gecikmesi ek süreden yenmesin).
    expect((i as { yeniBitis: Date }).yeniBitis.toISOString())
      .toBe(new Date(SIMDI.getTime() + sa(12)).toISOString());
  });

  it('SATIR 4 · kayıt anında ≤72 saat kuralı geçerliyse ek süre 6 saat', () => {
    // Etkinlik kayıttan 48 saat sonra → yakın.
    const kayitAni = new Date(SIMDI.getTime() - sa(1));
    const i = satirIslemi({
      ...HAVALE,
      kayitAni,
      etkinlikBaslangici: new Date(kayitAni.getTime() + sa(48)),
      yerTutmaBitisi: new Date(SIMDI.getTime() - dk(5)),
    }, SIMDI);
    expect((i as { yeniBitis: Date }).yeniBitis.toISOString())
      .toBe(new Date(SIMDI.getTime() + sa(6)).toISOString());
  });

  it('SATIR 4 · uzatma etkinlik başlangıcıyla SINIRLI', () => {
    const i = satirIslemi({
      ...HAVALE,
      etkinlikBaslangici: new Date(SIMDI.getTime() + sa(3)),
      yerTutmaBitisi: new Date(SIMDI.getTime() - dk(5)),
    }, SIMDI);
    expect((i as { yeniBitis: Date }).yeniBitis.toISOString())
      .toBe(new Date(SIMDI.getTime() + sa(3)).toISOString());
  });

  it('SATIR 5 · havale + hatırlatma GİTTİ + bitiş geçmiş → iptal "Havale — süre doldu"', () => {
    const i = satirIslemi({
      ...HAVALE, hatirlatmaGitti: true, yerTutmaBitisi: new Date(SIMDI.getTime() - dk(1)),
    }, SIMDI);
    expect(i).toMatchObject({ tip: 'iptal', neden: 'Havale — süre doldu' });
  });

  it('havale + bitiş GELMEMİŞ → hiçbir şey (ilk mail kayıt anında gitti)', () => {
    expect(satirIslemi(HAVALE, SIMDI)).toBeNull();
    // Kayıttan beş saat geçmiş olsa bile — 30 dk eşiği KARTA ait.
    expect(satirIslemi({ ...HAVALE, kayitAni: new Date(SIMDI.getTime() - sa(5)) }, SIMDI)).toBeNull();
  });

  it('bitiş TAM ŞİMDİ → geçmiş sayılır', () => {
    const i = satirIslemi({ ...KART, yerTutmaBitisi: new Date(SIMDI) }, SIMDI);
    expect(i).toMatchObject({ tip: 'iptal', neden: 'Kart — süre doldu' });
  });

  it('Ödendi/İptal/Bedava satırlar (b) dalına girmez', () => {
    for (const d of ['İptal', 'Bedava', 'İade']) {
      expect(satirIslemi({ ...KART, odemeDurumu: d }, SIMDI)).toBeNull();
    }
  });
});

describe('(c) · Buluşma günü hatırlatması (Ek 2)', () => {
  /** Mail gitmiş, ödenmiş, buluşma bugün 21:00. */
  const BUGUN21: TaramaSatiri = {
    ...HAVALE,
    odemeDurumu: 'Ödendi',
    mailGitti: true,
    yerTutmaBitisi: null,
    etkinlikBaslangici: new Date('2026-10-02T21:00:00+03:00'),
    kayitAni: new Date('2026-09-28T10:00:00+03:00'),
  };

  it('21:00 buluşma → gönderim anı 15:00, etiket "Bu akşam"', () => {
    expect(gunHatirlatmaAni(BUGUN21.etkinlikBaslangici!).toISOString())
      .toBe(new Date('2026-10-02T15:00:00+03:00').toISOString());
    expect(gunEtiketi(BUGUN21.etkinlikBaslangici!)).toBe('Bu akşam');
  });

  it('15:00\'ten ÖNCE gönderilmez, sonra gönderilir', () => {
    const once = satirIslemi(BUGUN21, new Date('2026-10-02T14:59:00+03:00'));
    expect(once).toBeNull();
    const sonra = satirIslemi(BUGUN21, new Date('2026-10-02T15:00:00+03:00'));
    expect(sonra).toMatchObject({ tip: 'gun-hatirlatma', gun: 'Bu akşam' });
  });

  it('10:00 buluşma → gönderim anı 08:00 (04:00 DEĞİL), etiket "Bugün"', () => {
    // Başlangıç − 6 saat 04:00 ederdi; gece dörtte mail hatırlatma değil
    // rahatsızlıktır ve kadın onu uyandığında zaten okuyacak.
    const s = { ...BUGUN21, etkinlikBaslangici: new Date('2026-10-02T10:00:00+03:00') };
    expect(gunHatirlatmaAni(s.etkinlikBaslangici!).toISOString())
      .toBe(new Date('2026-10-02T08:00:00+03:00').toISOString());
    expect(gunEtiketi(s.etkinlikBaslangici!)).toBe('Bugün');
    expect(satirIslemi(s, new Date('2026-10-02T07:59:00+03:00'))).toBeNull();
    expect(satirIslemi(s, new Date('2026-10-02T08:00:00+03:00')))
      .toMatchObject({ tip: 'gun-hatirlatma', gun: 'Bugün' });
  });

  it('17:00 eşiği: 16:59 → "Bugün", 17:00 → "Bu akşam"', () => {
    expect(gunEtiketi(new Date('2026-10-02T16:59:00+03:00'))).toBe('Bugün');
    expect(gunEtiketi(new Date('2026-10-02T17:00:00+03:00'))).toBe('Bu akşam');
  });

  it('⚠ eşik TR saatinden okunur — UTC\'den okunsa üç saat kayardı', () => {
    // 21:00 TR = 18:00Z. UTC okunsa yine ≥17 olup geçerdi; ama 10:00 TR = 07:00Z
    // ve 19:00 TR = 16:00Z — ikincisi UTC'de eşiği GEÇMEZ, TR'de geçer.
    expect(gunEtiketi(new Date('2026-10-02T19:00:00+03:00'))).toBe('Bu akşam');
  });

  it('⚠ GEÇ KAYIT atlanır — gönderim anından sonra kayıt olan', () => {
    // Katılım bilgisini kayıt/ödeme mailinde zaten aldı; beş dakika önce
    // okuduğunu tekrarlamak olurdu.
    const s = { ...BUGUN21, kayitAni: new Date('2026-10-02T16:00:00+03:00') };
    expect(satirIslemi(s, new Date('2026-10-02T17:00:00+03:00'))).toBeNull();
    // Gönderim anından bir dakika ÖNCE kayıt olan atlanmaz.
    const s2 = { ...BUGUN21, kayitAni: new Date('2026-10-02T14:59:00+03:00') };
    expect(satirIslemi(s2, new Date('2026-10-02T15:00:00+03:00'))?.tip).toBe('gun-hatirlatma');
  });

  it('⚠ SAATSİZ etkinlik atlanır (23:59 kuralına düşen)', () => {
    // "Başlangıç − 6 saat" uydurma bir saatten sayılırdı.
    const s = {
      ...BUGUN21,
      saatOkunabildi: false,
      etkinlikBaslangici: new Date('2026-10-02T23:59:00+03:00'),
    };
    expect(satirIslemi(s, new Date('2026-10-02T20:00:00+03:00'))).toBeNull();
  });

  it('BAŞLANGIÇTAN SONRA gönderilmez', () => {
    expect(satirIslemi(BUGUN21, new Date('2026-10-02T21:00:00+03:00'))).toBeNull();
    expect(satirIslemi(BUGUN21, new Date('2026-10-03T09:00:00+03:00'))).toBeNull();
  });

  it('İPTAL satırına gitmez', () => {
    const s = { ...BUGUN21, odemeDurumu: 'İptal' };
    expect(satirIslemi(s, new Date('2026-10-02T16:00:00+03:00'))).toBeNull();
  });

  it('`Mail Gitti` boşsa gitmez — katılım bilgisi hiç gönderilmemiş', () => {
    const s = { ...BUGUN21, mailGitti: false, odemeDurumu: 'Beklemede', yerTutmaBitisi: null };
    expect(satirIslemi(s, new Date('2026-10-02T16:00:00+03:00'))).toBeNull();
  });

  it('`Gün Hatırlatması Gitti` işaretliyse ikinci kez gitmez', () => {
    const s = { ...BUGUN21, gunHatirlatmasiGitti: true };
    expect(satirIslemi(s, new Date('2026-10-02T16:00:00+03:00'))).toBeNull();
  });

  it('Bedava kayıt da gün hatırlatması alır (İptal değil, mail gitmiş)', () => {
    const s = { ...BUGUN21, odemeDurumu: 'Bedava' };
    expect(satirIslemi(s, new Date('2026-10-02T16:00:00+03:00'))?.tip).toBe('gun-hatirlatma');
  });
});

describe('postalanabilir — (a) ve (c) adaylığı KAPIYA bağlı (7 Eki, Kaan)', () => {
  it('(a) · postalanamaz satır ADAY DEĞİL — işlem üretilmez', () => {
    // Önceki hâlde işlem üretilir, sonra uygulama sırasında atlanırdı: satır
    // her taramada bir `atlandi` ve bir warn yazardı. (a) dalı kendi kendine
    // çözülmüyor (Ödendi + `Mail Gitti` boş sonsuza kadar kalır), yani gürültü
    // de sonsuz olurdu.
    const s = { ...HAVALE, odemeDurumu: 'Ödendi', postalanabilir: false };
    expect(satirIslemi(s, SIMDI)).toBeNull();
  });

  it('(c) · postalanamaz satır ADAY DEĞİL', () => {
    const s: TaramaSatiri = {
      ...HAVALE,
      odemeDurumu: 'Ödendi',
      mailGitti: true,
      yerTutmaBitisi: null,
      etkinlikBaslangici: new Date('2026-10-02T21:00:00+03:00'),
      kayitAni: new Date('2026-09-28T10:00:00+03:00'),
      postalanabilir: false,
    };
    expect(satirIslemi(s, new Date('2026-10-02T16:00:00+03:00'))).toBeNull();
  });

  it('⚠ (b) DEĞİŞMEDİ — postalanamaz satır da iptal EDİLİR', () => {
    // İptal mail istemiyor ve süresi dolan bir kaydın kapanması gerekiyor.
    // Kapıyı (b)'ye de uygulamak, düzeltilemeyen satırları sonsuza kadar
    // Beklemede bırakırdı.
    const s = { ...KART, postalanabilir: false, yerTutmaBitisi: new Date(SIMDI.getTime() - dk(1)) };
    expect(satirIslemi(s, SIMDI)).toMatchObject({ tip: 'iptal', neden: 'Kart — süre doldu' });
  });

  it('(b) mail dalları postalanamaz satırda da işlem üretir — uygulama atlar', () => {
    // Bilinçli: o satır bitişte iptal olup kuyruktan düşüyor, gürültü sınırlı.
    const s = { ...KART, postalanabilir: false };
    expect(satirIslemi(s, SIMDI)?.tip).toBe('hatirlat-kart');
  });

  it('`postalanamaz` listesi — (a)/(c) alacaktı ama gönderilemeyenler', () => {
    const a = { ...HAVALE, kayitId: 'OCAK-A', odemeDurumu: 'Ödendi', postalanabilir: false };
    const b = { ...KART, kayitId: 'OCAK-B', postalanabilir: false };
    const c = { ...HAVALE, kayitId: 'OCAK-C', odemeDurumu: 'Ödendi', postalanabilir: true };
    const { islemler, postalanamaz } = taramaPlani([a, b, c], SIMDI, 25);
    // Yalnız (a)/(c) adayı olan satır listede; (b) adayı DEĞİL.
    expect(postalanamaz).toEqual(['OCAK-A']);
    // `c` postalanabilir → işlem üretti; `b` (b) dalında işlem üretti.
    expect(islemler.map((i) => i.satir.kayitId).sort()).toEqual(['OCAK-B', 'OCAK-C']);
  });

  it('postalanabilir satırlar listeye GİRMEZ — liste yalnız sorunlu kayıtlar', () => {
    const { postalanamaz } = taramaPlani([KART, HAVALE], SIMDI, 25);
    expect(postalanamaz).toEqual([]);
  });

  it('hiçbir işlem almayacak postalanamaz satır listeye girmez', () => {
    // `Yer Tutma Bitişi` boş + Beklemede → hiçbir dal onu almıyor; postalanamaz
    // olması onu "sorunlu kayıt" yapmaz.
    const { postalanamaz } = taramaPlani(
      [{ ...KART, postalanabilir: false, yerTutmaBitisi: null }],
      SIMDI,
      25,
    );
    expect(postalanamaz).toEqual([]);
  });
});

describe('sıra ve tavan', () => {
  it('(a) (b)den ÖNCE — ödenmiş satır iptal edilmez', () => {
    // Ödendi satır (b) dalına hiç girmiyor ama sıranın kilitlenmesi önemli:
    // bir gün `Ödendi` koşulu gevşerse bildirim iptali ezmeli.
    const s = { ...HAVALE, odemeDurumu: 'Ödendi', yerTutmaBitisi: new Date(SIMDI.getTime() - sa(5)) };
    expect(satirIslemi(s, SIMDI)?.tip).toBe('bildirim');
  });

  it('bir satır için TEK işlem döner', () => {
    // Ödemesi onaylanmış ve buluşması bugün olan kayıt (a)'yı alır; gün
    // hatırlatması bir sonraki tura kalır.
    const s: TaramaSatiri = {
      ...HAVALE,
      odemeDurumu: 'Ödendi',
      mailGitti: false,
      yerTutmaBitisi: null,
      etkinlikBaslangici: new Date('2026-10-02T21:00:00+03:00'),
      kayitAni: new Date('2026-09-28T10:00:00+03:00'),
    };
    const i = satirIslemi(s, new Date('2026-10-02T16:00:00+03:00'));
    expect(i?.tip).toBe('bildirim');
  });

  it('tavan uygulanır ve ATLANAN SAYISI döner — sessiz kırpma yok', () => {
    const cok = Array.from({ length: 30 }, (_, n) => ({
      ...KART, pageId: `p${n}`, kayitId: `OCAK-${n}`,
    }));
    const { islemler, atlanan } = taramaPlani(cok, SIMDI, 25);
    expect(islemler).toHaveLength(25);
    expect(atlanan).toBe(5);
  });

  it('tavana takılmayan turda atlanan 0', () => {
    const { islemler, atlanan } = taramaPlani([KART, HAVALE], SIMDI, 25);
    expect(islemler).toHaveLength(1);
    expect(atlanan).toBe(0);
  });

  it('işlemsiz satırlar listeye girmez', () => {
    const { islemler } = taramaPlani([{ ...KART, yerTutmaBitisi: null }], SIMDI, 25);
    expect(islemler).toEqual([]);
  });

  it('`mailGonderirMi` — iptal SESSİZ, diğerleri mail gönderir', () => {
    expect(mailGonderirMi({ tip: 'iptal', satir: KART, neden: 'Kart — süre doldu' })).toBe(false);
    expect(mailGonderirMi({ tip: 'bildirim', satir: KART })).toBe(true);
    expect(mailGonderirMi({ tip: 'hatirlat-kart', satir: KART })).toBe(true);
    expect(mailGonderirMi({ tip: 'uzat-havale', satir: KART, yeniBitis: SIMDI })).toBe(true);
    expect(mailGonderirMi({ tip: 'gun-hatirlatma', satir: KART, gun: 'Bugün' })).toBe(true);
  });
});

/**
 * Format kapısı — ÖLÇÜLMÜŞ seçenek listesine karşı (7 Eki 2026, Kaan talimatı).
 *
 * Etkinlikler DB'sinin `Format` select'i `databases.retrieve` ile okundu ve
 * canlı 100 satırda kullanılan değerler sayıldı:
 *
 *   9 × "Açık Kapı" · 6 × "Yolculuk" · 4 × "Çember" · 3 × "Atölye" ·
 *   3 × "Seremoni" · 1 × "Şehir Akşamı"   (+ seçenek olarak "Mini Retreat")
 *
 * `Anadolu Yolculuğu` bu select'te **YOK** — kendi başvuru yolunda yaşıyor ve
 * bu akışa hiç girmiyor. Dolayısıyla kapı bugünkü veride hiç kapanmıyor.
 *
 * ⚠ Liste ÖLÇÜLMÜŞ BİR ANLIK GÖRÜNTÜ, canlı okuma değil (test ağa çıkmaz).
 * Notion'a sekizinci bir seçenek eklenirse bu dosya onu bilmez — ama o seçenek
 * `FORMAT_KATEGORI`'ye de eklenmediyse `odemeBildir` ve tarama o etkinliğin
 * mailini sessizce göndermez. Sayı kilidi aşağıda, ekleme anında kırmızı
 * yanması için.
 */
describe('format kapısı — yedi Notion seçeneğinin yedisi de GEÇER', () => {
  const NOTION_FORMAT_SECENEKLERI = [
    'Yolculuk', 'Mini Retreat', 'Açık Kapı', 'Çember', 'Atölye',
    'Şehir Akşamı', 'Seremoni',
  ] as const;

  it('`Yolculuk` kapıdan GEÇİYOR — düzeltme gerekmedi', () => {
    // Kaan'ın ölçüm isteği: online Yolculuk durakları (İNİŞ, UYANIŞ…) normal
    // program gibi bildirim almalı. `FORMAT_KATEGORI['Yolculuk'] = 'yolculuk'`
    // ve `FORMAT_TIP` o anahtarı taşıyor.
    expect(FORMAT_KATEGORI['Yolculuk']).toBe('yolculuk');
    expect(isKayitFormat('yolculuk')).toBe(true);
  });

  it('yedi seçeneğin YEDİSİ de bir KayitFormat\'a çözülüyor', () => {
    for (const ham of NOTION_FORMAT_SECENEKLERI) {
      const slug = FORMAT_KATEGORI[ham];
      expect(slug, `"${ham}" slug'a çözülmedi`).toBeTruthy();
      expect(isKayitFormat(slug), `"${ham}" → "${slug}" bir KayitFormat değil`).toBe(true);
    }
  });

  it('SAYI KİLİDİ — yedi seçenek; sekizincisi eklenirse burası kırmızı yanar', () => {
    // `FORMAT_KATEGORI` sekiz anahtar taşıyor: yedi Notion seçeneği +
    // `Anadolu Yolculuğu`. Sekizincisi Etkinlikler Format select'inde YOK.
    expect(NOTION_FORMAT_SECENEKLERI).toHaveLength(7);
    expect(Object.keys(FORMAT_KATEGORI)).toHaveLength(8);
  });

  it('`Anadolu Yolculuğu` Etkinlikler Format\'ında YOK — bu akışa girmez', () => {
    // Ölçüldü: select yedi seçenek taşıyor ve bu onlardan biri değil. Haritada
    // duruyor (başvuru yolu ve /takvim onu kullanıyor) ama bir `KayitFormat`
    // değil, dolayısıyla kapıdan geçmez. Kapsam dışı, dokunulmadı.
    expect(NOTION_FORMAT_SECENEKLERI).not.toContain('Anadolu Yolculuğu');
    expect(FORMAT_KATEGORI['Anadolu Yolculuğu']).toBe('anadolu');
    expect(isKayitFormat('anadolu')).toBe(false);
  });
});
