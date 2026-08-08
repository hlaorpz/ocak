#!/usr/bin/env python3
"""
b36a-desen-tespiti.py — B36 kuyruğunun mekanik desenini tespit eder.

Ledger'a YAZMAZ. Aday tablosu üretir; #k terfisi elle doğrulanır (KARAR 466).
Uzunluk/eşik ölçümü python ile yapılır — awk bu makinede bayt sayar (KARAR 470).

Koşum:  cd ~/Desktop/hlaorpz/ocak-site-clone && python3 docs/_uretilen/b36a-desen-tespiti.py
"""
import csv, re, pathlib, collections, sys

REPO = pathlib.Path(__file__).resolve().parents[2]
LEDGER = REPO / "docs" / "01-kararlar.tsv"
KRON = REPO / "docs" / "90-kronoloji"
CIKTI = REPO / "docs" / "_uretilen" / "b36a-adaylar.tsv"
RAPOR = REPO / "docs" / "_uretilen" / "b36a-rapor.md"

MEKANIK = re.compile(r"^[0-9A-Za-z-]+\.md:\d+(,\d+)*$")
# sığ desen: çapa satırının kendisi bir karar-listesi indeks girdisi
INDEKS = re.compile(r"^\s*-\s+\*\*KARAR\s+(\d+)[:.]?\*\*")
# aday sinyalleri: kararın kendi kaydını taşıyan satır biçimleri
ETIKET = lambda n: re.compile(r"\[KARAR\s+%d\]" % n)
BASLIK = lambda n: re.compile(r"\*\*[^*]*KARAR\s+%d[^0-9][^*]*\*\*" % n)
PARANTEZ = lambda n: re.compile(r"\(KARAR\s+%d[,)]" % n)

# ─────────────────────────────────────────────────────────────────────────────
# NOKTA ÖRNEKLEMESİ — ELLE DOĞRULANDI, BETİK ÜRETMEDİ (KARAR 466, 467)
#
# Aşağıdaki yargı 8 Ağustos 2026'da beş aday satırı kronoloji dosyasında gözle
# açarak verildi. Betik puan verir, doğruluk beyan etmez — bu blok o beyanı
# taşır ve rapora buradan basılır. Yeniden koşum notu silmesin diye veri olarak
# gömülü; elle düzeltilecek tek yer burasıdır, rapor değil.
#
# (no, aday_kaynak, tuttu_mu, gerekçe)
ORNEKLEM = [
    (51,  "2026-05.md:3634", True,
     "`### URL Yapısı — Türkçe Karaktersiz, Lowercase (KARAR 51)` + altında gövde. Kararın kendi kaydı."),
    (141, "2026-05.md:2342", True,
     "`**KARAR 141 (#31):** …lansman öncesi kalan iş haritası…` — gövdeli paragraf."),
    (131, "2026-05.md:2009", False,
     "`12. **Safari Hero glow banding fix (KARAR 131)**` — komşuları 10·11·13·14·15. "
     "Sığ çapadan **başka bir sığ çapaya** taşıma; gövde yok."),
    (91,  "2026-05.md:623",  False,
     "`2. **/advaita KARAR 91 cümlesi 2 hit (3 planlanmıştı)**` — kararın denetim sonucu, "
     "kaydı değil. Atıf yönü ters: uygulayan satır ile kuran satır aynı sinyali veriyor."),
    (89,  "2026-05.md:3873", False,
     "`Footer.astro` bileşen envanteri; 214 karakterlik satırın sonunda `**Kaan görünmüyor (KARAR 89).**` "
     "Atıf, kayıt değil. Uzunluk bonusu tek parantez atıfına grubun en yüksek puanını (6) verdi."),
]
ESIK = 4   # §3: beşin en az dördü tutmalı


def satirlar(ad):
    p = KRON / ad
    if not p.exists():
        p = REPO / "docs" / ad
    if not p.exists():
        return None
    return p.read_text(encoding="utf-8").split("\n")

def main():
    rows = list(csv.reader(LEDGER.open(encoding="utf-8"), delimiter="\t"))
    basl, body = rows[0], rows[1:]
    assert basl == ["no","tarih","baslik","durum","iliski","kaynak"], "ledger başlığı beklenmedik — DUR"

    pop = [r for r in body if MEKANIK.match(r[5])]
    kayip, sig, derin, adaylar = [], [], [], []

    for r in body:
        no, kaynak = int(r[0]), r[5]
        if not MEKANIK.match(kaynak):
            continue
        dosya, _, numaralar = kaynak.partition(":")
        ilk = int(numaralar.split(",")[0])
        L = satirlar(dosya)
        if L is None:
            kayip.append((no, kaynak, "dosya yok"))
            continue
        if ilk < 1 or ilk > len(L):
            kayip.append((no, kaynak, f"satır aralık dışı (dosya {len(L)} satır)"))
            continue
        capa = L[ilk - 1]

        m = INDEKS.match(capa)
        if not (m and int(m.group(1)) == no):
            derin.append(no)
            continue
        sig.append(no)

        # aday ara: aynı dosyada kararın kendi kaydını taşıyabilecek satırlar
        ad_list = []
        for i, s in enumerate(L, start=1):
            if i == ilk:
                continue
            puan = 0
            if ETIKET(no).search(s):   puan += 3
            if BASLIK(no).search(s):   puan += 3
            if PARANTEZ(no).search(s): puan += 2
            if puan == 0:
                continue
            puan += min(len(s) // 200, 2)          # gövdesi olan satır daha muhtemel
            ad_list.append((puan, i, s.strip()[:160]))
        ad_list.sort(reverse=True)
        if not ad_list:
            adaylar.append((no, dosya, ilk, 0, "", "", "ADAY YOK"))
        else:
            for puan, i, met in ad_list[:3]:
                adaylar.append((no, dosya, ilk, puan, f"{dosya}:{i}", met,
                                "TEK ADAY" if len(ad_list) == 1 else f"{len(ad_list)} aday"))

    with CIKTI.open("w", encoding="utf-8", newline="") as f:
        w = csv.writer(f, delimiter="\t", lineterminator="\n")
        w.writerow(["no","dosya","mevcut_satir","puan","aday_kaynak","aday_metin","durum"])
        w.writerows(adaylar)

    tek = {n for n,_,_,_,_,_,d in adaylar if d == "TEK ADAY"}
    yok = {n for n,_,_,_,_,_,d in adaylar if d == "ADAY YOK"}
    cok = {n for n,_,_,_,_,_,d in adaylar} - tek - yok

    with RAPOR.open("w", encoding="utf-8") as f:
        f.write("# B36-a — DESEN TESPİTİ RAPORU\n\n")
        f.write("Üreten: `docs/_uretilen/b36a-desen-tespiti.py`. Türetilmiştir, elle düzeltilmez.\n")
        f.write("Ledger'a yazılmadı — `#k` terfisi elle doğrulanır (KARAR 466).\n\n")
        f.write("## Ölçüm\n\n")
        f.write(f"- ledger veri satırı: **{len(body)}**\n")
        f.write(f"- mekanik `:NNNN` popülasyonu: **{len(pop)}**\n")
        f.write(f"- çapası karar-listesi indeksi olan (SIĞ): **{len(sig)}**\n")
        f.write(f"- çapası indeks olmayan: **{len(derin)}**\n")
        f.write(f"- çözülemeyen çapa: **{len(kayip)}**\n\n")
        f.write("Yöntem: `kaynak` sütunu `^[0-9A-Za-z-]+\\.md:\\d+(,\\d+)*$` ile süzüldü; ")
        f.write("hedef dosyanın ilk numaralı satırı `^\\s*-\\s+\\*\\*KARAR N[:.]?\\*\\*` ile ")
        f.write("karşılaştırıldı ve yakalanan N satırın kendi `no`'suyla eşitlendi. ")
        f.write("Ölçüm python3 ile; awk bu makinede bayt sayar.\n\n")
        f.write("## Sığ satırların aday dağılımı\n\n")
        f.write(f"- tek adaylı (mekanik taşınabilir): **{len(tek)}**\n")
        f.write(f"- çok adaylı (elle seçim): **{len(cok)}**\n")
        f.write(f"- adaysız (B36-b): **{len(yok)}**\n\n")
        if kayip:
            f.write("## Çözülemeyen çapalar\n\n")
            for no, k, sebep in kayip:
                f.write(f"- `{no}` → `{k}` — {sebep}\n")
            f.write("\n")
        f.write("## Nokta örnekleme (sistematik, adım 5)\n\n")
        f.write("| no | mevcut | aday | metin |\n|---|---|---|---|\n")
        for row in adaylar[::5][:12]:
            f.write(f"| {row[0]} | `{row[1]}:{row[2]}` | `{row[4] or '—'}` | {row[5][:90]} |\n")

        tuttu = [o for o in ORNEKLEM if o[2]]
        f.write("\n## Nokta örneklemesi — ELLE doğrulandı (KARAR 466)\n\n")
        f.write("Bu bölümün yargısı betikten gelmez; `ORNEKLEM` bloğunda veri olarak gömülüdür. ")
        f.write("Betik puan verir, doğruluk beyan etmez.\n\n")
        f.write("| no | aday | tuttu mu | dosyada gerçekte ne var |\n|---|---|---|---|\n")
        for no, kaynak, ok, gerekce in ORNEKLEM:
            f.write(f"| {no} | `{kaynak}` | {'✅' if ok else '❌'} | {gerekce} |\n")
        f.write(f"\n**Sonuç: {len(tuttu)}/{len(ORNEKLEM)}** — eşik {ESIK}.\n\n")

        if len(tuttu) >= ESIK:
            f.write("Puanlama doğrulandı.\n")
        else:
            f.write("## YÖNTEM YETERSİZ — iş B36-b'ye devreder\n\n")
            f.write(f"§3 eşiği tutmadı ({len(tuttu)}/{len(ORNEKLEM)}, gereken {ESIK}) ve DUR-3 tetiklendi ")
            f.write("(beşten ikiden fazlası tutmuyor). **Bu rapordaki aday tablosu mekanik taşıma ")
            f.write("girdisi olarak kullanılamaz.**\n\n")
            f.write("Kök sebep: `ETIKET` · `BASLIK` · `PARANTEZ` sinyallerinin üçü de kararın ")
            f.write("**numarasının geçtiğini** ölçüyor, satırın kararın **kaydı olduğunu** değil. ")
            f.write("Uzunluk bonusu bunu ağırlaştırıyor — tek bir parantez içi atıf taşıyan uzun ")
            f.write("envanter satırı, gövdeli bir kayıt satırını geçebiliyor.\n\n")
            f.write(f"Tek-aday oranı bağımsız olarak aynı yere çıkıyor: {len(tek)}/{len(sig)} = ")
            f.write(f"**%{len(tek)/len(sig)*100:.0f}**, §6'nın \"üçte iki üstü\" eşiğinin çok altında.\n\n")
            f.write(f"**Asıl bulgu örneklemede değil:** {len(sig)} sığ satırın {len(yok)}'inin ")
            f.write(f"({len(yok)/len(sig)*100:.0f}%) adayı **yok**. O kararların kronolojide indeks ")
            f.write("girdisinden başka kaydı yazılmamış. B36-b'nin işi çapa düzeltme değil, ")
            f.write("**kayıt yazma** — ve düşünülenden büyük.\n")

    print(f"popülasyon {len(pop)} · sığ {len(sig)} · tek-aday {len(tek)} · "
          f"çok-aday {len(cok)} · adaysız {len(yok)} · çözülemeyen {len(kayip)}")
    print(f"→ {CIKTI}")
    print(f"→ {RAPOR}")

if __name__ == "__main__":
    main()
