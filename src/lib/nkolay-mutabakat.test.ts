import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  paymentListAyristir,
  secKaydi,
  MUTABAKAT_ISLEM_TIPI,
  MUTABAKAT_BASARILI_STATUS,
} from './nkolay-mutabakat.ts';

/**
 * `nkolay-mutabakat.ts` — `PaymentList` yanıtının ayrıştırılması.
 *
 * ── Bu suite'in ölçtüğü soru ──
 * Köprünün iki işi var ve ikisi de sessizce yanlış yapılabilir:
 *  1. **İÇ İÇE yanıtı açmak** — `{"result":"<JSON dizesi>"}`. 6 Eki ölçümünde
 *     ilk prob bunu açmadığı için bütün alanlar "yok" göründü. Parse
 *     atlanırsa köprü her işlemi "bulunamadı" sayar.
 *  2. **Doğru satırı seçmek** — listede `CANCEL` satırları da var ve aynı
 *     `REFERENCE_CODE`'u taşıyabilirler. Tip sorulmazsa iptal edilmiş bir
 *     işlem ödeme sayılır: para iade edilmiş, kayıt Ödendi.
 *
 * Yanıt şekli 6 Eki 2026 canlı ölçümünden (Kaan, `PaymentList`).
 */

const REF = 'IKSIRPF341481127';
const CLIENT = 'OCAK-57V4-08513';

/** Ölçülen iç içe şekil. `ic` doğrudan verilirse ham olarak sarılır. */
function yanit(ic: unknown): string {
  return JSON.stringify({ result: JSON.stringify(ic) });
}

function satir(ezme: Record<string, unknown> = {}) {
  return {
    REFERENCE_CODE: REF,
    CLIENT_REFERENCE_CODE: CLIENT,
    STATUS: MUTABAKAT_BASARILI_STATUS,
    TRANSACTION_TYPE: MUTABAKAT_ISLEM_TIPI,
    TRX_DATE: '06.10.2026 22:54:38',
    ...ezme,
  };
}

describe('paymentListAyristir — iç içe JSON', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });
  afterEach(() => vi.restoreAllMocks());

  it('`result` içindeki dizeyi açar ve LIST satırlarını döndürür', () => {
    const k = paymentListAyristir(yanit({ RESPONSE_CODE: 1, LIST: [satir()] }));
    expect(k).toEqual([
      {
        referansNo: REF, clientRefCode: CLIENT, status: 'SUCCESS',
        islemTipi: 'SALES', trxTarihi: '06.10.2026 22:54:38',
      },
    ]);
  });

  it('⚠ `result` anahtarı YOKSA tolerans göstermez — null + kademe log\'u', () => {
    // Davranış 6 Eki'de BİLEREK sertleşti. Önceki sürüm `result` yoksa dış
    // gövdeyi iç gövde sayıyordu; o tolerans tam olarak bu haftanın yanlış
    // teşhisini doğurdu (ayrıştırıcı yanlış kademeye bakıp "sağlayıcı şekli
    // değiştirdi" dedirtti). Ölçülen iki zarfın İKİSİNDE de `result` var;
    // olmayan bir şekil ölçülmemiştir ve sessizce uyum sağlamak yerine
    // GÜRÜLTÜ çıkarmalı.
    const uyari = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(paymentListAyristir(JSON.stringify({ LIST: [satir()] }))).toBeNull();
    expect(String(uyari.mock.calls.at(-1)?.[0] ?? '')).toContain('kademe=result');
  });

  it('`result` NESNE gelirse açar — canlı başarılı sorgunun zarfı', () => {
    // Ölçüldü (6 Eki): başarılı sorguda `result` DİZE değil NESNE ve yanında
    // `id` · `error` duruyor. İlk sürüm tam buradan düştü.
    const k = paymentListAyristir(
      JSON.stringify({ id: 'req-1', error: null, result: { RESPONSE_CODE: 1, LIST: [satir()] } }),
    );
    expect(k).toHaveLength(1);
    expect(k![0].clientRefCode).toBe(CLIENT);
  });

  it('`result` DİZE gelirse de açar — erken doğrulama hatasının zarfı', () => {
    // Prob turunda "Hash Data boş geçilemez" böyle geldi: dış gövdede tek
    // anahtar ve değeri JSON dizesi. İki biçim de karşılanmak zorunda.
    const k = paymentListAyristir(yanit({ RESPONSE_CODE: 1, LIST: [satir()] }));
    expect(k).toHaveLength(1);
  });

  it('`error` DOLUYSA sorgu reddedilmiştir — null ve ayrı kademe log\'u', () => {
    // "LIST yok" ile "sorgu reddedildi" aynı şey değil: ikincisi zarf değil
    // yetki/parametre sorunudur ve teşhisi bambaşka yere götürür.
    const uyari = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(
      paymentListAyristir(JSON.stringify({ id: 'r', error: 'yetkisiz', result: null })),
    ).toBeNull();
    const satirLog = String(uyari.mock.calls.at(-1)?.[0] ?? '');
    expect(satirLog).toContain('sorgu reddedildi');
    expect(satirLog).toContain('yetkisiz');
  });

  it('boş LIST → boş dizi, `null` DEĞİL (ayrım korunur)', () => {
    // ⚠ "liste boş" ile "yanıt anlaşılmadı" aynı şey değil. Çağıran ikisine
    // farklı davranıyor; burada karıştırılırsa teşhis kaybolur.
    expect(paymentListAyristir(yanit({ LIST: [] }))).toEqual([]);
  });

  it('bozuk JSON · iç bozuk JSON · LIST yok → null', () => {
    expect(paymentListAyristir('json değil')).toBeNull();
    expect(paymentListAyristir(JSON.stringify({ result: 'bu da değil' }))).toBeNull();
    expect(paymentListAyristir(yanit({ RESPONSE_CODE: 0 }))).toBeNull();
    expect(paymentListAyristir(yanit({ LIST: 'dizi değil' }))).toBeNull();
  });

  it('LIST yoksa KADEMEYİ ve result\'ın İÇ anahtarlarını basar', () => {
    // ⚠ Önceki log kademeyi söylemiyor ve DIŞ anahtarları basıyordu
    // (`id, result, error`) — bu "sağlayıcı şekli değiştirdi" diye okundu ve
    // bir tur kaybettirdi. Artık kademe açık, basılan anahtarlar result'ın içi.
    const uyari = vi.spyOn(console, 'warn').mockImplementation(() => {});
    paymentListAyristir(yanit({ RESPONSE_CODE: 0, RESPONSE_DATA: 'Hash Data boş geçilemez' }));
    const s = String(uyari.mock.calls.at(-1)?.[0] ?? '');
    expect(s).toContain('kademe=LIST');
    expect(s).toContain('RESPONSE_DATA');
    expect(s).toContain('Hash Data boş geçilemez');
    expect(s).not.toContain('id, result, error');
  });

  it('eksik alanlar boş dizeye düşer, satır düşmez', () => {
    const k = paymentListAyristir(yanit({ LIST: [{ REFERENCE_CODE: REF }] }));
    expect(k).toEqual([
      { referansNo: REF, clientRefCode: '', status: '', islemTipi: '', trxTarihi: '' },
    ]);
  });

  it('satır olmayan girdiler (null, dize) elenir', () => {
    const k = paymentListAyristir(yanit({ LIST: [null, 'x', satir()] }));
    expect(k).toHaveLength(1);
  });
});

describe('secKaydi — SALES + SUCCESS, üç kapı', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });
  afterEach(() => vi.restoreAllMocks());

  const coz = (ic: unknown, ref = REF) => secKaydi(paymentListAyristir(yanit(ic)) ?? [], ref);

  it('eşleşen SALES+SUCCESS satırını bulur', () => {
    expect(coz({ LIST: [satir()] })?.clientRefCode).toBe(CLIENT);
  });

  it('başka referansın satırını SEÇMEZ', () => {
    expect(coz({ LIST: [satir({ REFERENCE_CODE: 'IKSIRPF000000000' })] })).toBeNull();
  });

  it('CANCEL satırını ödeme saymaz', () => {
    // ⚠ En pahalı hata bu olurdu: iade edilmiş işlem Ödendi'ye çekilir.
    expect(coz({ LIST: [satir({ TRANSACTION_TYPE: 'CANCEL' })] })).toBeNull();
  });

  it('STATUS ERROR / NEW satırını ödeme saymaz', () => {
    // `NEW` = başlatılıp bitirilmemiş işlem (B200). Para çekilmemiştir.
    for (const st of ['ERROR', 'NEW', '']) {
      expect(coz({ LIST: [satir({ STATUS: st })] }), st).toBeNull();
    }
  });

  it('aynı referansta CANCEL + SALES varsa SALES seçilir', () => {
    const s = coz({
      LIST: [satir({ TRANSACTION_TYPE: 'CANCEL', STATUS: 'ERROR' }), satir()],
    });
    expect(s?.islemTipi).toBe('SALES');
    expect(s?.clientRefCode).toBe(CLIENT);
  });

  it('eşleşme var ama SALES+SUCCESS yok → ayrımı log taşır', () => {
    const uyari = vi.spyOn(console, 'warn').mockImplementation(() => {});
    coz({ LIST: [satir({ TRANSACTION_TYPE: 'CANCEL' })] });
    const s = String(uyari.mock.calls.at(-1)?.[0] ?? '');
    expect(s).toContain('SALES+SUCCESS satırı yok');
    expect(s).toContain('CANCEL/SUCCESS');
  });

  it('⚠ VAKA (6 Eki) — iade sonrası SALES satırı KAYBOLUYOR, geriye CANCEL kalıyor', () => {
    // Kaan iadeyi yaptı ve `PaymentList` o işlem için TEK satır döndürdü:
    //   REFERENCE_CODE IKSIRPF343739192 · CLIENT_REFERENCE_CODE OCAK-EP3E-46507
    //   TRANSACTION_TYPE CANCEL · STATUS SUCCESS · TRX_DATE 06.10.2026 22:54:38
    // Orijinal SALES satırı listede YOK.
    //
    // ── Kapı BİLEREK gevşetilmedi ──
    // Kimlik (hangi kayıt) ile geçerlilik (ödeme duruyor mu) ayrı sorular.
    // CANCEL satırı kimliği verebilir ama callback onu Ödendi'ye çekerdi:
    // tutar kapısı geçer, replay kilidi boştur. Yani iade edilmiş bir işlem
    // "ödendi" olurdu — köprünün önlemek için yazıldığı şeyin aynısı.
    //
    // Canlı yolda bu hâl doğmaz: callback ödemeden SANİYELER sonra gelir,
    // iade ise panelden elle ve sonradan yapılır. Bu satırın CANCEL görünmesi
    // callback'in ZATEN düşmüş olmasının sonucu, sebebi değil.
    //
    // Geriye dönük mutabakat (iade edilmişleri de eşleştirmek) AYRI iştir —
    // B200'ün yazılmamış yarısı; kimlik kapısını gevşetmekle karıştırılmaz.
    const liste = paymentListAyristir(
      yanit({
        LIST: [
          {
            REFERENCE_CODE: 'IKSIRPF343739192',
            CLIENT_REFERENCE_CODE: 'OCAK-EP3E-46507',
            TRANSACTION_TYPE: 'CANCEL',
            STATUS: 'SUCCESS',
            TRX_DATE: '06.10.2026 22:54:38',
          },
        ],
      }),
    );
    // Satır OKUNUYOR — ayrıştırma başarılı, kimlik bilgisi elde.
    expect(liste).toHaveLength(1);
    expect(liste![0].clientRefCode).toBe('OCAK-EP3E-46507');
    expect(liste![0].trxTarihi).toBe('06.10.2026 22:54:38');
    // Ama ödeme SAYILMIYOR — fail-closed.
    expect(secKaydi(liste!, 'IKSIRPF343739192')).toBeNull();
  });

  it('SALES+SUCCESS yok log\'u TARİHİ de taşır (iade mi ödeme mi ayrımı)', () => {
    const uyari = vi.spyOn(console, 'warn').mockImplementation(() => {});
    coz({ LIST: [satir({ TRANSACTION_TYPE: 'CANCEL' })] });
    expect(String(uyari.mock.calls.at(-1)?.[0] ?? '')).toContain('@06.10.2026 22:54:38');
  });

  it('boş referansla aramaz', () => {
    expect(coz({ LIST: [satir()] }, '')).toBeNull();
    expect(coz({ LIST: [satir()] }, '   ')).toBeNull();
  });

  it('referans eşleşmesi TAM — parça eşleşme kabul edilmez', () => {
    // `includes` ile arama, uydurma bir referansı geçerli kılabilirdi.
    expect(coz({ LIST: [satir()] }, 'IKSIRPF3414')).toBeNull();
    expect(coz({ LIST: [satir()] }, `${REF}-EK`)).toBeNull();
  });
});

describe('kaynak disiplini — köprü callback gövdesini GÖRMEZ (KARAR 593)', () => {
  const MOD = readFileSync(join(__dirname, 'nkolay-mutabakat.ts'), 'utf-8');
  const kodu = (k: string) =>
    k.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');

  it('modül `URLSearchParams` ya da `Request` ALMAZ — tip düzeyinde kapalı', () => {
    // Muhafız testinin grep'i bu dosyaya uzanmıyor (gerekçesi dosya başında);
    // yerine daha güçlü güvence: köprü callback gövdesine erişemez. Grep
    // atlanabilir, imza atlanamaz — bu test o imzayı çiviliyor.
    const K = kodu(MOD);
    expect(K).not.toMatch(/URLSearchParams/);
    expect(K).not.toMatch(/\bRequest\b/);
    expect(K).not.toMatch(/import\.meta\.env/);
  });

  it('`secKaydi` ikinci parametresi `string` — gövde nesnesi geçirilemez', () => {
    const K = kodu(MOD);
    expect(K).toMatch(/saglayiciReferansi:\s*string/);
  });

  it('route köprüye HASH KAPSAMINDAKİ alanı geçiyor', () => {
    // Köprünün güvenliği girdisinin nereden geldiğine bağlı. Route
    // `dogrulama.saglayiciReferansi` geçmeli — gövdeden okunan bir şey değil.
    const ROUTE = kodu(
      readFileSync(join(__dirname, '..', 'pages', 'api', 'odeme-callback.ts'), 'utf-8'),
    );
    expect(ROUTE).toMatch(/saglayiciReferansi:\s*dogrulama\.saglayiciReferansi/);
    // Ve gövdeden kimlik okumuyor.
    expect(ROUTE).not.toMatch(/CLIENT_REFERENCE_CODE/);
  });
});
