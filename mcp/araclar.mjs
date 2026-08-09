// OCAK MCP araçları — docs_envanter · docs_oku · docs_ara
//
// docs_karar(no) BİLİNÇLİ OLARAK YOKTUR. Gerekçe: ADIM 7 brief §7 — çapa
// çözümleme sözleşmesi (KARAR 472) henüz gerçek kullanımda sınanmadı ve
// mekanik çapaların ölçülmüş sığlığı tek çağrıya indirilirse "cevap gibi
// görünen" yanlış üretir (KARAR 456). İkinci dalga.

import { readFileSync } from 'node:fs';
import { z } from 'zod';
import {
  DAMGA,
  AZAMI_GOVDE_SATIR,
  AZAMI_ARALIK_SATIR,
  AZAMI_SONUC,
  korpusuTara,
  korpusOzetSatiri,
  satirlariAyir,
  karakterSay,
  turkceKucult,
  yoluCoz,
  baslikIndeksi,
} from './korpus.mjs';

// Her cevabın ortak gövdesi: commit damgası (İLKE b) + korpus özeti (Kaan §3).
function zarf(ozet, govde) {
  return {
    commit: DAMGA.commit,
    commit_kaynak: DAMGA.commit_kaynak,
    korpus: korpusOzetSatiri(ozet),
    ...govde,
  };
}

function metinCevap(nesne) {
  return { content: [{ type: 'text', text: JSON.stringify(nesne) }] };
}

// ── docs_envanter() ──────────────────────────────────────────────────────────
function envanter() {
  const tarama = korpusuTara();
  const govde = {
    arac: 'docs_envanter',
    sutunlar: ['yol', 'satir', 'bayt', 'karakter', 'sinif'],
    toplam_dosya: tarama.ozet.toplam,
    dagilim: {
      canli: tarama.ozet.canli,
      arsiv: tarama.ozet.arsiv,
      canli_satir: tarama.ozet.canli_satir,
      arsiv_satir: tarama.ozet.arsiv_satir,
      canli_bayt: tarama.ozet.canli_bayt,
      arsiv_bayt: tarama.ozet.arsiv_bayt,
    },
    olcum_yontemi:
      'satır = "\\n" sayısı + (metin boş değilse ve "\\n" ile bitmiyorsa 1) · ' +
      'bayt = diskteki ham bayt · karakter = Unicode kod noktası (UTF-16 birimi değil)',
    dosyalar: tarama.dosyalar.map((d) => [d.yol, d.satir, d.bayt, d.karakter, d.sinif]),
  };

  // İLKE (d): atlanan hiçbir şey sessiz değil.
  if (tarama.atlananIkili.length > 0) {
    govde.atlanan_ikili = {
      sayi: tarama.atlananIkili.length,
      neden: 'UTF-8 olarak çözülemedi; satır/karakter ölçümü anlamsız olurdu. Sayıma dahil değil.',
      dosyalar: tarama.atlananIkili,
    };
  }
  if (tarama.atlananGizli.length > 0) {
    govde.atlanan_gizli = {
      sayi: tarama.atlananGizli.length,
      neden: 'Nokta ile başlıyor; korpusun dışında. Sayıma dahil değil.',
      dosyalar: tarama.atlananGizli,
    };
  }
  return zarf(tarama.ozet, govde);
}

// ── docs_oku(yol, satir_baslangic?, satir_bitis?) ────────────────────────────
function oku({ yol, satir_baslangic, satir_bitis }) {
  const tarama = korpusuTara();
  const coz = yoluCoz(yol);

  if (!coz.tamam) {
    // İLKE: benzer ad ÖNERİLMEZ. Uydurma yol üretmek, sığ çapadan beterdir.
    return zarf(tarama.ozet, {
      arac: 'docs_oku',
      istenen_yol: typeof yol === 'string' ? yol : String(yol),
      bulunamadi: Boolean(coz.bulunamadi),
      reddedildi: !coz.bulunamadi,
      sebep: coz.sebep,
      not: 'Benzer ad önerilmez. Var olan yollar için: docs_envanter()',
    });
  }

  const ham = readFileSync(coz.mutlak);
  let metin;
  try {
    metin = new TextDecoder('utf-8', { fatal: true }).decode(ham);
  } catch {
    return zarf(tarama.ozet, {
      arac: 'docs_oku',
      yol: coz.yol,
      okunamadi: true,
      sebep: 'Dosya UTF-8 değil; metin olarak servis edilmiyor.',
      bayt: ham.length,
    });
  }

  const satirlar = satirlariAyir(metin);
  const kayit = tarama.dosyalar.find((d) => d.yol === coz.yol);
  const olcum = {
    yol: coz.yol,
    sinif: kayit ? kayit.sinif : 'canli',
    satir: satirlar.length,
    bayt: ham.length,
    karakter: karakterSay(metin),
  };

  const aralikVar = satir_baslangic != null || satir_bitis != null;

  // Aralık verilmedi ve dosya eşiği aşıyor → gövde değil, başlık indeksi.
  if (!aralikVar && satirlar.length > AZAMI_GOVDE_SATIR) {
    const indeks = baslikIndeksi(satirlar);
    return zarf(tarama.ozet, {
      arac: 'docs_oku',
      ...olcum,
      govde_dondurulmedi: true,
      sebep:
        `Dosya ${satirlar.length} satır, aralıksız okuma eşiği ${AZAMI_GOVDE_SATIR}. ` +
        'Gövde yerine başlık indeksi döndü; satir_baslangic/satir_bitis ile aralık iste.',
      baslik_indeksi_kurali: '^#{1,3} ile başlayan satırlar (bir boşluk zorunlu)',
      baslik_sayisi: indeks.length,
      baslik_indeksi: indeks,
      ...(indeks.length === 0
        ? { baslik_uyarisi: 'Bu dosyada kurala uyan hiç başlık yok; aralık vermeden gövde alınamaz.' }
        : {}),
    });
  }

  // Aralık hesabı.
  let bas = aralikVar ? Number(satir_baslangic ?? 1) : 1;
  let son = aralikVar ? Number(satir_bitis ?? satirlar.length) : satirlar.length;
  if (!Number.isFinite(bas) || bas < 1) bas = 1;
  if (!Number.isFinite(son) || son > satirlar.length) son = satirlar.length;

  let kirpildi = false;
  const kirpmaNedenleri = [];
  if (aralikVar && (Number(satir_baslangic ?? 1) < 1 || Number(satir_bitis ?? son) > satirlar.length)) {
    kirpildi = true;
    kirpmaNedenleri.push(`istenen aralık dosya sınırlarının dışına taşıyordu (dosya 1–${satirlar.length})`);
  }
  if (son < bas) {
    return zarf(tarama.ozet, {
      arac: 'docs_oku',
      ...olcum,
      reddedildi: true,
      sebep: `Geçersiz aralık: satir_baslangic (${bas}) > satir_bitis (${son}).`,
    });
  }
  if (son - bas + 1 > AZAMI_ARALIK_SATIR) {
    son = bas + AZAMI_ARALIK_SATIR - 1;
    kirpildi = true;
    kirpmaNedenleri.push(`aralık azami açıklığı ${AZAMI_ARALIK_SATIR} satır`);
  }

  const dilim = satirlar.slice(bas - 1, son);
  return zarf(tarama.ozet, {
    arac: 'docs_oku',
    ...olcum,
    dondurulen_aralik: [bas, son],
    dondurulen_satir: dilim.length,
    kirpildi,
    ...(kirpildi ? { kirpma_nedeni: kirpmaNedenleri.join(' · ') } : {}),
    govde: dilim.join('\n'),
  });
}

// ── docs_ara(sorgu, kapsam?, regex?) ─────────────────────────────────────────
function ara({ sorgu, kapsam, regex }) {
  const tarama = korpusuTara();
  const kaps = kapsam ?? 'canli';
  const desenMi = regex === true;

  if (typeof sorgu !== 'string' || sorgu === '') {
    return zarf(tarama.ozet, {
      arac: 'docs_ara',
      reddedildi: true,
      sebep: 'sorgu boş olamaz.',
    });
  }

  let desen = null;
  if (desenMi) {
    try {
      desen = new RegExp(sorgu, 'u');
    } catch (e) {
      // İLKE (d): bozuk desen sessizce "0 sonuç" olmaz, açık hata olur.
      return zarf(tarama.ozet, {
        arac: 'docs_ara',
        sorgu,
        kapsam: kaps,
        regex: true,
        reddedildi: true,
        sebep: `Geçersiz düzenli ifade: ${e.message}`,
      });
    }
  }

  const kucukSorgu = turkceKucult(sorgu);
  const hedefler = tarama.dosyalar.filter((d) =>
    kaps === 'hepsi' ? true : d.sinif === kaps,
  );

  const eslesir = (satir) => {
    if (desenMi) {
      // Büyük/küçük harf duyarsızlığı: ham satır VE Türkçe küçültülmüş satır
      // ayrı ayrı denenir. Satır başına tek boolean — çift sayım olmaz.
      return desen.test(satir) || desen.test(turkceKucult(satir));
    }
    return turkceKucult(satir).includes(kucukSorgu);
  };

  let toplam = 0;
  const sonuclar = [];
  for (const d of hedefler) {
    let metin;
    try {
      metin = new TextDecoder('utf-8', { fatal: true }).decode(readFileSync(d.mutlak));
    } catch {
      continue; // envanterde zaten UTF-8 olanlar var; buraya düşmez
    }
    const satirlar = satirlariAyir(metin);
    for (let i = 0; i < satirlar.length; i++) {
      if (!eslesir(satirlar[i])) continue;
      toplam++;
      if (sonuclar.length < AZAMI_SONUC) {
        sonuclar.push([d.yol, i + 1, satirlar[i], d.sinif]);
      }
    }
  }

  const kirpildi = toplam !== sonuclar.length;
  return zarf(tarama.ozet, {
    arac: 'docs_ara',
    sorgu,
    kapsam: kaps,
    regex: desenMi,
    eslestirme:
      (desenMi ? 'düzenli ifade' : 'literal (grep -F semantiği)') +
      ' · büyük/küçük harf duyarsız · Türkçe locale (İ→i, I→ı)',
    aranan_dosya: hedefler.length,
    sayim_birimi: 'eşleşen SATIR sayısı (bir satırdaki birden çok geçiş tek sayılır)',
    // ⚠ İki sayı ayrı ayrı: "0 döndü" ile "kırpıldı" bir daha karışmasın (B46).
    toplam_eslesme: toplam,
    donen_eslesme: sonuclar.length,
    kirpildi,
    ...(kirpildi
      ? { kirpma_nedeni: `azami ${AZAMI_SONUC} sonuç döndürülür; ${toplam - sonuclar.length} eşleşme dışarıda kaldı` }
      : {}),
    ...(toplam === 0 && kaps === 'canli'
      ? { not: "Kapsam 'canli' (varsayılan). Arşivde aramak için kapsam='arsiv' ya da 'hepsi'." }
      : {}),
    sutunlar: ['yol', 'satir_no', 'satir', 'sinif'],
    sonuclar,
  });
}

// Doğrulama ve testler bu üç işlevi doğrudan çağırır — MCP katmanından bağımsız.
export const islevler = { envanter, oku, ara };

export function araclariKaydet(server) {
  server.registerTool(
    'docs_envanter',
    {
      title: 'OCAK korpus envanteri',
      description:
        'OCAK doküman korpusunun tamamını listeler: her dosyanın yolu, satır/bayt/karakter ölçümü ' +
        've sınıfı (canli|arsiv). Parametresizdir. Korpusun ne içerdiğini öğrenmek için ÖNCE bunu çağır — ' +
        'diğer araçlar yalnız sorulana cevap verir.',
      inputSchema: z.object({}),
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    async () => metinCevap(envanter()),
  );

  server.registerTool(
    'docs_oku',
    {
      title: 'OCAK dosyası oku',
      description:
        'Korpustaki bir dosyanın içeriğini ve ölçümünü döndürür. Aralık verilmezse ve dosya ' +
        `${AZAMI_GOVDE_SATIR} satırı aşıyorsa gövde yerine başlık indeksi döner — sonra aralık iste. ` +
        'Yol depo köküne göreli verilir (örn. docs/00-durum.md).',
      inputSchema: z.object({
        yol: z.string().describe('Depo köküne göreli dosya yolu, örn. docs/00-durum.md'),
        satir_baslangic: z.number().int().min(1).optional().describe('1-tabanlı başlangıç satırı'),
        satir_bitis: z.number().int().min(1).optional().describe('1-tabanlı bitiş satırı (dahil)'),
      }),
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    async (args) => metinCevap(oku(args)),
  );

  server.registerTool(
    'docs_ara',
    {
      title: 'OCAK korpusunda ara',
      description:
        'Korpusta satır bazlı arama. Varsayılan kapsam "canli" — arşiv açıkça istenir, çünkü ' +
        'arşiv sonucunu canlı sanmak taşınamayan bulgu üretir (B44). Varsayılan eşleştirme literal; ' +
        'regex=true verilirse desen olarak yorumlanır. Cevap toplam_eslesme ve donen_eslesme sayılarını ' +
        'ayrı ayrı taşır.',
      inputSchema: z.object({
        sorgu: z.string().min(1).describe('Aranacak dize'),
        kapsam: z.enum(['canli', 'arsiv', 'hepsi']).optional().describe('Varsayılan: canli'),
        regex: z.boolean().optional().describe('Varsayılan: false (literal eşleştirme)'),
      }),
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    async (args) => metinCevap(ara(args)),
  );
}
