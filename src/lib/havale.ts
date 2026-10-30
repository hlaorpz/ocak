/**
 * havale.ts — VakıfBank hareketi ↔ Kayıtlar eşleştirmesinin SAF çekirdeği
 * (Kaan, 31 Eki 2026: "API işini yapalım").
 *
 * Ağa çıkmaz, Notion'u bilmez. Uç (`api/havale-tara.ts`) bankadan hareketleri,
 * Notion'dan kayıtları okur; buradan karar alır, uygular.
 *
 * ── KURAL: yalnız KESİN eşleşme yazılır ──
 *   1. Gelen para (TransactionType "1", Amount > 0), N-Kolay POS aktarımı değil
 *   2. Açıklamada `OCAK-XXXX` biçiminde bir kod var (ayraç `-`, boşluk, `.`,
 *      `_` ya da hiç — 31 Eki dökümünde dördü de görüldü: "OCAK-57V4",
 *      "OCAK PULX", "OCAK3HX6", "OCAK-7M4Q.")
 *   3. O Kayıt ID var, Tip = Kayıt
 *   4. Tutar = `Beklenen Tutar` (kuruşu kuruşuna)
 *   5. Kayıt `Beklemede` ya da `Ödendi` (iptal kayda para = Kaan'a sorulur;
 *      yer başkasına verilmiş olabilir — 9TWG vakası)
 *   6. Bu banka işlem no başka kayda yazılmamış; kaydın kendi `Banka İşlem No`'su
 *      ve kart `İşlem No`'su boş (kartla ödenmiş kayda havale = çift ödeme)
 * Gerisi YAZILMAZ, sebebiyle rapora girer. Bir harf yanlış yazılmış kodda
 * (31 Eki: "VLE9" ↔ VL39) yalnız ÖNERİ verilir — tahminle para bağlanmaz.
 *
 * Bu modülün yazdığı `Banka İşlem No`, fatura akışının havale KANITIDIR
 * (`lib/fatura.ts`). Yanlış eşleşme = yanlış fatura; o yüzden kural dar.
 */

export type BankaHareketi = {
  islemNo: string;
  /** "2026-10-02T11:40:12" — bankanın yerel (TR) saati, ofsetsiz. */
  tarih: string;
  tutar: number;
  tip: string;
  aciklama: string;
};

export type HavaleKaydi = {
  pageId: string;
  kayitId: string;
  tip: string;
  odemeDurumu: string;
  beklenenTutar: number | null;
  bankaIslemNo: string;
  /** Kartın N-Kolay işlem no'su — doluysa kayıt kartla ödenmiş; havale ÇİFT ödemedir. */
  kartIslemNo: string;
};

export type HavaleSebebi =
  | 'giden'
  | 'pos-aktarimi'
  | 'kod-yok'
  | 'zaten-yazili'
  | 'kayit-yok'
  | 'tip-kayit-degil'
  | 'tutar-tutmuyor'
  | 'iptal-kayda-para'
  | 'durum-uygun-degil'
  | 'kayitta-baska-islem-no'
  | 'kartla-odenmis'
  | 'cift-odeme';

export type HavaleKarari =
  | {
      tip: 'yaz';
      kayit: HavaleKaydi;
      /** Kayıt `Beklemede` idi → `Ödendi`'ye çekilecek (bildirim taraması "yerin hazır" mailini atar). */
      odendiYap: boolean;
      odemeTarihi: string;
    }
  | { tip: 'atla'; sebep: HavaleSebebi; kod?: string; oneri?: string };

/** "POS Tutarı" — N-Kolay'ın kart tahsilatını hesaba aktarması; havale değil (31 Eki dökümü). */
const POS_IZI = /POS\s+TUTAR/i; // "Tutarı"nın ı'sı /i ile I'ya katlanmaz — kök yeter

/**
 * Açıklamadaki OCAK kodu. Türkçe `İ`/`ı` normalize edilir; kod 4 harf/rakam,
 * arkasında harf/rakam gelmez ("OCAK.BIZ" gibi bir şey kod sayılmaz).
 */
export function referansBul(aciklama: string): string | null {
  const duz = aciklama
    .replace(/İ/g, 'I')
    .replace(/ı/g, 'i')
    .toUpperCase();
  const m = duz.match(/OCAK[\s\-_.]*([A-Z0-9]{4})(?![A-Z0-9])/);
  return m ? `OCAK-${m[1]}` : null;
}

/** Tek harf farkı (yer değiştirme) — yalnız öneri için. */
function birHarfFark(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let fark = 0;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) fark++;
  return fark === 1;
}

const kurus = (n: number) => Math.round(n * 100);

export function havaleKarari(
  h: BankaHareketi,
  kayitlar: Map<string, HavaleKaydi>,
  kullanilmisIslemNolar: Set<string>,
): HavaleKarari {
  if (h.tip !== '1' || !(h.tutar > 0)) return { tip: 'atla', sebep: 'giden' };
  if (POS_IZI.test(h.aciklama)) return { tip: 'atla', sebep: 'pos-aktarimi' };
  if (kullanilmisIslemNolar.has(h.islemNo)) return { tip: 'atla', sebep: 'zaten-yazili' };

  const kod = referansBul(h.aciklama);
  if (!kod) return { tip: 'atla', sebep: 'kod-yok' };

  const k = kayitlar.get(kod);
  if (!k) {
    // Öneri: tek harf farklı, tutarı tutan, kanıtı henüz yazılmamış kayıt.
    const adaylar = [...kayitlar.values()].filter(
      (x) =>
        birHarfFark(x.kayitId, kod) &&
        x.beklenenTutar !== null &&
        kurus(x.beklenenTutar) === kurus(h.tutar) &&
        !x.bankaIslemNo,
    );
    return { tip: 'atla', sebep: 'kayit-yok', kod, ...(adaylar.length === 1 ? { oneri: adaylar[0].kayitId } : {}) };
  }
  if (k.tip !== 'Kayıt') return { tip: 'atla', sebep: 'tip-kayit-degil', kod };
  if (k.bankaIslemNo.trim()) return { tip: 'atla', sebep: 'kayitta-baska-islem-no', kod };
  if (k.kartIslemNo.trim()) return { tip: 'atla', sebep: 'kartla-odenmis', kod };
  if (k.beklenenTutar === null || kurus(k.beklenenTutar) !== kurus(h.tutar)) {
    return { tip: 'atla', sebep: 'tutar-tutmuyor', kod };
  }
  if (k.odemeDurumu === 'İptal') return { tip: 'atla', sebep: 'iptal-kayda-para', kod };
  if (k.odemeDurumu !== 'Beklemede' && k.odemeDurumu !== 'Ödendi') {
    return { tip: 'atla', sebep: 'durum-uygun-degil', kod };
  }
  return { tip: 'yaz', kayit: k, odendiYap: k.odemeDurumu === 'Beklemede', odemeTarihi: h.tarih.slice(0, 10) };
}

/**
 * Bir taramadaki kararların tamamı. Aynı kayda iki hareket kesin eşleşirse
 * (ör. kadın iki kez gönderdi) İKİSİ DE yazılmaz — ikincisi iade mi, ikinci
 * kişi mi, Kaan bilir.
 */
export function havalePlani(
  hareketler: BankaHareketi[],
  kayitlar: Map<string, HavaleKaydi>,
  kullanilmisIslemNolar: Set<string>,
): { hareket: BankaHareketi; karar: HavaleKarari }[] {
  const plan = hareketler.map((hareket) => ({ hareket, karar: havaleKarari(hareket, kayitlar, kullanilmisIslemNolar) }));
  const sayim = new Map<string, number>();
  for (const { karar } of plan) if (karar.tip === 'yaz') sayim.set(karar.kayit.kayitId, (sayim.get(karar.kayit.kayitId) ?? 0) + 1);
  return plan.map((p) =>
    p.karar.tip === 'yaz' && (sayim.get(p.karar.kayit.kayitId) ?? 0) > 1
      ? { hareket: p.hareket, karar: { tip: 'atla', sebep: 'cift-odeme', kod: p.karar.kayit.kayitId } }
      : p,
  );
}
