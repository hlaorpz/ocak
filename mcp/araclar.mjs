// OCAK MCP araçları — docs_envanter · docs_oku · docs_ara
//
// docs_karar(no) BİLİNÇLİ OLARAK YOKTUR. Gerekçe: ADIM 7 brief §7 — çapa
// çözümleme sözleşmesi (KARAR 472) henüz gerçek kullanımda sınanmadı ve
// mekanik çapaların ölçülmüş sığlığı tek çağrıya indirilirse "cevap gibi
// görünen" yanlış üretir (KARAR 456). İkinci dalga.
//
// ── İKİNCİ DALGA NOTU (yukarıdaki blok tarihsel kayıttır, silinmedi) ─────────
// docs_karar ikinci dalgada yazıldı. İki gerekçeden biri düştü, biri durdu:
//
//   DÜŞEN — "ikiz sözleşme sınanmadı": `ocak-kararci` 9 Ağustos'ta KARAR 478 için
//   ilk kez gerçek kullanımda koştu (sıfırıncı soru, numara tahsisi, dört ön
//   sorgu) ve çapa tarafında kusur çıkmadı.
//
//   DURAN — ölçülmüş sığlık. Bu yüzden `siglik` bayrağı ZORUNLUDUR ve çözülmüş
//   her mekanik çapa için koşar. Araç sığlığı gizlemez, görünür kılar.
//
// Ayrıca ölçüldü ve kodda değil kapanış patch'inde yaşar: `#kNNN` çapalarının
// isabeti 18/28, `#kNNN-blok` çapalarının 0/8. Rakam koda gömülmez — ledger her
// turda oynar, gömülen rakam bir sonraki turda bayatlar (KARAR 470).

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

// Tekil kanonik yol — liste değil. İLKE (a) yazılı dosya LİSTESİNİ yasaklar;
// ledger'ın tek bir yolu vardır ve o yol kararın kendisidir (KARAR 456).
const LEDGER_YOLU = 'docs/01-kararlar.tsv';

// Korpusun sınırını söyleyen dize. `docs_karar`'ın kod_dist dalı bunu `sebep`
// olarak taşır — "neden okunmadı" sorusu cevapsız kalmasın.
const KAPSAM_KURALI =
  'Servis edilen küme: IZINLI_KOKLER (docs · scripts) + IZINLI_TEKIL (CLAUDE.md), ' +
  'sunucunun diskinden taze yürünerek. src/ · dist/ · mcp/ · node_modules korpusa dahil değildir.';

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

// ── docs_karar(no) ───────────────────────────────────────────────────────────

// ⚠ SIRA SABİTTİR VE CEVAPTA BEYAN EDİLİR. `kod_dist` testi `mekanik`'ten ÖNCE
// koşar; ters çevrilirse iki kova arasında satır kayar ve toplamlar değişir
// (KARAR 470). Okuyan bunu görmeli, tahmin etmemeli.
const SINIFLANDIRMA_SIRASI =
  '1. bos · 2. kod_dist · 3. mekanik · 4. capa · 5. ciplak_dosya_adi · 6. siniflandirilamadi';

const KOD_DIST = /\.(ts|css|astro|mjs|js|sh|json)\b/;
const MEKANIK = /^[0-9A-Za-z-]+\.md:\d+(,\d+)*$/;
const CIPLAK = /\.(md|tsv)$/;

function kaynakBicimi(v) {
  if (v === '') return 'bos';
  if (KOD_DIST.test(v) || v.startsWith('dist')) return 'kod_dist';
  if (MEKANIK.test(v)) return 'mekanik';
  if (v.includes('#')) return 'capa';
  if (CIPLAK.test(v)) return 'ciplak_dosya_adi';
  return 'siniflandirilamadi';
}

// Kısa dosya adı → korpustaki tam yol. Eşleme KODDA YAZILI DEĞİL, korpustan
// türetilir (İLKE a). Birden çok aday varsa SEÇİM YAPILMAZ.
function adiCoz(tarama, ad) {
  const adaylar = tarama.dosyalar.filter((d) => d.yol.split('/').pop() === ad);
  if (adaylar.length === 1) return { tamam: true, dosya: adaylar[0] };
  if (adaylar.length === 0) return { tamam: false, sebep: 'Dosya adı korpusta yok.' };
  return {
    tamam: false,
    sebep: 'Dosya adı korpusta birden çok yere denk geliyor; seçim yapılmaz.',
    adaylar: adaylar.map((d) => d.yol),
  };
}

// Hedef dosyanın sınıfı YOLDAN türetilir; kodda liste tutulmaz (İLKE a).
function hedefSinifi(yol) {
  if (yol.includes('90-kronoloji/')) return 'kronoloji';
  if (yol.startsWith('docs/20-ref-')) return 'referans';
  return 'diger';
}

const SIFIR_ESLESME_SEBEBI = {
  kronoloji:
    'Çapa hedefi bulunamadı: kronolojide bu kararın madde başlığı yazılmamış (KARAR 472). ' +
    'Kayıt eksikliği — B36-b.',
  referans:
    'Çapa hedefi bulunamadı: hedef bir 20-ref-* dosyası ve madde başlığı taşımıyor — ' +
    "referans dosyaları prose taşır. KARAR 472'nin çözümleme kuralı kronoloji için yazıldı; " +
    'bu sınıf için kural eksik — B38.',
  diger:
    'Çapa hedefi bulunamadı ve hedef dosya ne kronoloji ne referans sınıfında. ' +
    'Kural yazılı değil — B38.',
};

const BLOK_SEBEBI =
  'Blok çapası. Blok üyelerinin tekil madde başlığı yoktur — tanım blok içinde yaşar ' +
  '(iliski = ⊂N, B20). Blok başlığına çözümleme kuralı yazılı değil; sunucu icat etmez ' +
  '(KARAR 472). Ledger\'da bu sınıfta sekiz satır var (ölçüm: CC, ADIM 0, 2026-08-09, ' +
  'kapsam: ledgerın tamamı, 479 veri satırı) ve sekizinin de hedefi bulunamıyor — B38.';

const SIGLIK_NOTU =
  "Ledger'ın mekanik çapalarında ölçülmüş sığlık oranı: docs/_uretilen/b36a-rapor.md " +
  '(8 Ağustos 2026, ledger 474 veri satırı anı, kapsam: mekanik popülasyonun tamamı). ' +
  "Bu çapa 'çalışır' ama kararın kendi kaydına değil karar-listesi indeksine bakıyor — " +
  'derine inilemez (B36).';

const ILISKI_NOTU =
  'Sütunun üç tanım kararı verilmedi (saf/ok-dışı ayrımı 71–81 arasında değişiyor, B38). ' +
  'Sunucu bir tanım seçerse ölçüm sessizce kirlenir.';

// Madde başlığı deseni — KARAR 472: çapa BAŞLIĞA çözülür, literal dizeye değil.
const madeBasligi = (n) => new RegExp(`^\\s*-\\s+\\*\\*KARAR ${n}\\b`, 'gm');
// Sığlık deseni — çözülen satırın kendisi bir karar-listesi maddesi mi.
const SIG_DESEN = /^\s*-\s+\*\*KARAR (\d+)[:.]?\*\*/;

function karar({ no }) {
  const tarama = korpusuTara();
  const ortak = { arac: 'docs_karar', ledger_yolu: LEDGER_YOLU };

  const n = Number(no);
  if (!Number.isInteger(n) || n < 1) {
    return zarf(tarama.ozet, { ...ortak, reddedildi: true, sebep: 'no bir tamsayı ve ≥1 olmalı.' });
  }

  // Yol, mevcut güvenlik mekanizmasından geçirilir — yeni yetenek eklenmez.
  const lc = yoluCoz(LEDGER_YOLU);
  if (!lc.tamam) {
    return zarf(tarama.ozet, {
      ...ortak,
      reddedildi: true,
      sebep: `Ledger okunamadı: ${lc.sebep}`,
    });
  }
  const ham = readFileSync(lc.mutlak);
  const satirlar = satirlariAyir(new TextDecoder('utf-8', { fatal: true }).decode(ham));
  const eslesenler = satirlar.slice(1).filter((s) => s.split('\t')[0] === String(n));

  if (eslesenler.length === 0) {
    return zarf(tarama.ozet, {
      ...ortak,
      no: n,
      bulunamadi: true,
      sebep: 'Ledger\'da bu numara yok.',
      not: `Ledger'da bu numara yok. Var olan numaralar için: docs_oku('${LEDGER_YOLU}', ...)`,
    });
  }
  if (eslesenler.length > 1) {
    return zarf(tarama.ozet, {
      ...ortak,
      no: n,
      reddedildi: true,
      sebep: 'Mükerrer karar numarası; ledger bütünlüğü bozuk.',
      satir_sayisi: eslesenler.length,
    });
  }

  const alan = eslesenler[0].split('\t');
  if (alan.length !== 6) {
    return zarf(tarama.ozet, {
      ...ortak,
      no: n,
      reddedildi: true,
      sebep: 'Satırın alan sayısı 6 değil; ledger bütünlüğü bozuk.',
      alan_sayisi: alan.length,
    });
  }

  const [, tarih, baslik, durum, iliski, kaynak] = alan;
  const bicim = kaynakBicimi(kaynak);

  const govde = {
    ...ortak,
    no: n,
    tarih,
    baslik,
    durum,
    iliski, // ham — §1.7
    iliski_ayristirilmadi: true,
    iliski_notu: ILISKI_NOTU,
    kaynak,
    kaynak_bicimi: bicim,
    siniflandirma_sirasi: SINIFLANDIRMA_SIRASI,
  };

  // ── bos ────────────────────────────────────────────────────────────────────
  if (bicim === 'bos') {
    return zarf(tarama.ozet, {
      ...govde,
      capa_cinsi: 'cozulemedi',
      sebep: 'kaynak boş bırakılamaz (KARAR 456).',
    });
  }

  // ── kod_dist: korpus dışı, dosya OKUNMAZ ───────────────────────────────────
  if (bicim === 'kod_dist') {
    return zarf(tarama.ozet, {
      ...govde,
      capa_cinsi: 'mekanik',
      capa_kaynagi: 'mekanik',
      korpus_disi: true,
      sebep: KAPSAM_KURALI,
    });
  }

  // ── ciplak_dosya_adi: dosyanın İÇİNDE ARAMA YAPILMAZ ───────────────────────
  if (bicim === 'ciplak_dosya_adi') {
    return zarf(tarama.ozet, {
      ...govde,
      capa_cinsi: 'cozulemedi',
      sebep: 'Satır numarası ya da çapa yok; hedef satır tahmin edilmez.',
    });
  }

  if (bicim === 'siniflandirilamadi') {
    return zarf(tarama.ozet, {
      ...govde,
      capa_cinsi: 'cozulemedi',
      sebep: 'kaynak hiçbir tanımlı biçime uymuyor. Sunucu kural icat etmez (KARAR 472).',
    });
  }

  // ── mekanik: dosya.md:NNNN(,MMMM) ──────────────────────────────────────────
  if (bicim === 'mekanik') {
    const [ad, noListesi] = kaynak.split(':');
    const c = adiCoz(tarama, ad);
    if (!c.tamam) {
      return zarf(tarama.ozet, {
        ...govde,
        capa_cinsi: 'cozulemedi',
        capa_kaynagi: 'mekanik',
        sebep: c.sebep,
        ...(c.adaylar ? { adaylar: c.adaylar } : {}),
      });
    }
    const hedefSatirlar = satirlariAyir(
      new TextDecoder('utf-8', { fatal: true }).decode(readFileSync(c.dosya.mutlak)),
    );
    const cozum = [];
    let herhangiCozuldu = false;
    for (const sn of noListesi.split(',').map(Number)) {
      if (sn < 1 || sn > hedefSatirlar.length) {
        cozum.push({
          satir_no: sn,
          cozulemedi: true,
          sebep: `Satır numarası dosya sınırının dışında (dosya 1–${hedefSatirlar.length}).`,
        });
      } else {
        cozum.push({ satir_no: sn, satir: hedefSatirlar[sn - 1] });
        herhangiCozuldu = true;
      }
    }

    // §1.6 — sığlık bayrağı YALNIZ çözülmüş mekanik satırlar için
    let siglik = false;
    let siglikAlan = {};
    for (const g of cozum) {
      if (g.cozulemedi) continue;
      const m = SIG_DESEN.exec(g.satir);
      if (!m) continue;
      siglik = true;
      siglikAlan =
        Number(m[1]) === n
          ? { siglik: true, siglik_tipi: 'karar-listesi-indeksi', siglik_notu: SIGLIK_NOTU }
          : {
              siglik: true,
              siglik_tipi: 'komsu-karar-satiri',
              gosterdigi_no: Number(m[1]),
              siglik_notu: SIGLIK_NOTU,
            };
      break;
    }

    return zarf(tarama.ozet, {
      ...govde,
      capa_cinsi: herhangiCozuldu ? 'mekanik' : 'cozulemedi',
      capa_kaynagi: 'mekanik',
      hedef_yol: c.dosya.yol,
      hedef_sinifi: hedefSinifi(c.dosya.yol),
      cozum,
      ...(siglik ? siglikAlan : { siglik: false }),
    });
  }

  // ── capa: #kNNN · #kNNN-blok · diğer # ─────────────────────────────────────
  const ad = kaynak.split('#')[0];
  const blokM = /#k(\d+)-blok$/.exec(kaynak);
  const kM = /#k(\d+)$/.exec(kaynak);

  // #kNNN-blok — başarı yolu BU DALGADA YAZILMAZ (ek-1 KARAR 1).
  if (blokM) {
    return zarf(tarama.ozet, {
      ...govde,
      capa_cinsi: 'cozulemedi',
      capa_kaynagi: 'elle',
      blok_uyesi: true,
      sebep: BLOK_SEBEBI,
    });
  }

  if (!kM) {
    return zarf(tarama.ozet, {
      ...govde,
      capa_cinsi: 'cozulemedi',
      capa_kaynagi: 'elle',
      sebep:
        'Tanımsız çapa biçimi. Sunucu çözümleme kuralı icat etmez (KARAR 472); ' +
        'kural yazılıncaya kadar çözülmez — B38.',
    });
  }

  const c = adiCoz(tarama, ad);
  if (!c.tamam) {
    return zarf(tarama.ozet, {
      ...govde,
      capa_cinsi: 'cozulemedi',
      capa_kaynagi: 'elle',
      sebep: c.sebep,
      ...(c.adaylar ? { adaylar: c.adaylar } : {}),
    });
  }

  const metin = new TextDecoder('utf-8', { fatal: true }).decode(readFileSync(c.dosya.mutlak));
  const hedefSatirlar = satirlariAyir(metin);
  const vurular = [];
  for (let i = 0; i < hedefSatirlar.length; i++) {
    if (new RegExp(`^\\s*-\\s+\\*\\*KARAR ${kM[1]}\\b`).test(hedefSatirlar[i])) {
      vurular.push({ satir_no: i + 1, satir: hedefSatirlar[i] });
    }
  }
  const sinif = hedefSinifi(c.dosya.yol);

  if (vurular.length === 0) {
    return zarf(tarama.ozet, {
      ...govde,
      capa_cinsi: 'cozulemedi',
      capa_kaynagi: 'elle',
      hedef_yol: c.dosya.yol,
      hedef_sinifi: sinif,
      sebep: SIFIR_ESLESME_SEBEBI[sinif],
    });
  }
  if (vurular.length > 1) {
    return zarf(tarama.ozet, {
      ...govde,
      capa_cinsi: 'cozulemedi',
      capa_kaynagi: 'elle',
      hedef_yol: c.dosya.yol,
      hedef_sinifi: sinif,
      eslesme_sayisi: vurular.length,
      sebep: 'Çapa dosyada birden çok kez geçiyor; benzersiz değil (KARAR 465).',
    });
  }
  return zarf(tarama.ozet, {
    ...govde,
    capa_cinsi: 'elle',
    capa_kaynagi: 'elle',
    hedef_yol: c.dosya.yol,
    hedef_sinifi: sinif,
    cozum: vurular,
  });
}

// Doğrulama ve testler bu dört işlevi doğrudan çağırır — MCP katmanından bağımsız.
export const islevler = { envanter, oku, ara, karar };

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

  server.registerTool(
    'docs_karar',
    {
      title: 'OCAK karar kaydını çöz',
      description:
        'Ledger\'daki bir KARAR satırını döndürür ve `kaynak` çapasını korpusta çözer. ' +
        'Altı sütun ham gelir; `iliski` AYRIŞTIRILMAZ. ⚠ Çözülen mekanik çapa karar-listesi ' +
        'indeksine bakıyorsa cevap `siglik: true` bayrağı taşır — çapa "çalışır" ama kararın ' +
        'kendi kaydına inmez (B36). Çözülemeyen çapa sebebini söyler; sunucu çözümleme kuralı ' +
        'icat etmez (KARAR 472).',
      inputSchema: z.object({
        no: z.number().int().min(1).describe('KARAR numarası'),
      }),
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    async (args) => metinCevap(karar(args)),
  );
}
