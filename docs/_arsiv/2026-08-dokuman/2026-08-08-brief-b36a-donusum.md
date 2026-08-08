# CC BRIEF — B36-a: KARAR-LİSTESİ DESENİ, ÖLÇÜM + ADAY TABLOSU

**Sahip:** CC
**Ön koşul:** ADIM 5 commit'leri main'de
**Kapsam:** Tek commit. **Ledger'a yazılmaz** — bu tur ölçer ve aday üretir.

Repo: `~/Desktop/hlaorpz/ocak-site-clone`. Bu brief kendi kendine yeterlidir.

---

## 0. NEDEN — VE KAPSAMIN DÜZELTİLMESİ

`docs/_uretilen/olcum-2026-08.md` (8 Ağustos) ledger'ın mekanik çapalarını ölçtü:
21 satırlık sistematik örneklemde isabet 12/21, `HİÇ` sıfır. **Ledger kırık değil, sığ.**
KOMŞU'ların 6/9'u tek bir desenden geliyor: erken sohbetlerin karar listeleri —
`- **KARAR N:** Başlık (Bölüm A.X)`.

Ölçüm dosyası sonucu şöyle yazdı: *"bu desen mekanik olarak tespit edilebilir ve
`#kNNN` terfisi otomatikleştirilebilir."*

⚠ **Bu cümlenin ikinci yarısı KARAR 466 ile çelişir.** 466 iki `kaynak` biçimi tanımlar:
`#kNNN` **elle doğrulanmış** çapa, `dosya.md:NNNN` **mekanik** işaretçi. Bir betik tanımı
gereği elle doğrulama yapamaz — dolayısıyla **mekanik dönüşüm `#k` üretemez.**

Bu turun kapsamı buna göre daraltıldı:

| yapılır | yapılmaz |
|---|---|
| deseni mekanik tespit et | `#k` çapası üret |
| her vaka için aday derin satırları bul ve puanla | ledger'ı yaz |
| eşleme/aday tablosu üret (KARAR 467a) | tek adaylıları otomatik taşı |
| kapsama + nokta örnekleme raporla | — |

Tek-adaylı satırların `:NNNN` işaretçisinin derin satıra taşınması **mekanik olarak
meşrudur**, ama aday tablosu gözle geçilmeden yapılmaz. O ikinci turdur ve kararı
tablonun kendisi verir: tek-adaylı oran yüksekse mekanik taşıma, düşükse B36-b.

---

## 1. ADIM 0 — SALT-READ

```bash
cd ~/Desktop/hlaorpz/ocak-site-clone || { echo "DİZİN YOK — dur"; exit 1; }

git status --porcelain                       # boş
git log -1 --format='%h %cI %s'

wc -l docs/01-kararlar.tsv                   # ADIM 5 sonrası 474 bekleniyor
ls -1 docs/90-kronoloji/
ls -la docs/_uretilen/b33-kaynak-donusumu.py docs/_uretilen/b37-pilot-referans-donusumu.py

python3 -c "print('çığır', len('çığır'), len('çığır'.encode()))"   # 5 9
```

⚠ **Popülasyonu yeniden ölç, devralma.** `olcum-2026-08.md` 468 satırlık ledger üzerinde
çalıştı ve 418 mekanik satır saydı. Ledger o günden beri büyüdü. **418 rakamını brief'ten
ya da ölçüm dosyasından alma** — betik kendi popülasyonunu kendi ölçer (KARAR 470).

Ölç, raporla, **DUR**, onay bekle.

---

## 2. BETİK — `docs/_uretilen/b36a-desen-tespiti.py`

B33/B37 kardeşi. `_uretilen/` altında yaşar ve **izlenir** — dönüşüm betiklerinin
versiyonlanması KARAR 467(a) gereğidir.

Betik üç şey üretir, üçü de aynı işin parçasıdır (KARAR 467):
(a) popülasyon ölçümü · (b) aday tablosu · (c) kapsama + nokta örnekleme.

```bash
cd ~/Desktop/hlaorpz/ocak-site-clone
cat > docs/_uretilen/b36a-desen-tespiti.py << 'PYEOF'
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

    print(f"popülasyon {len(pop)} · sığ {len(sig)} · tek-aday {len(tek)} · "
          f"çok-aday {len(cok)} · adaysız {len(yok)} · çözülemeyen {len(kayip)}")
    print(f"→ {CIKTI}")
    print(f"→ {RAPOR}")

if __name__ == "__main__":
    main()
PYEOF
python3 docs/_uretilen/b36a-desen-tespiti.py
```

---

## 3. DOĞRULAMA

```bash
cd ~/Desktop/hlaorpz/ocak-site-clone

# ledger'a DOKUNULMAMIŞ olmalı — bu turun en önemli testi
git diff --stat docs/01-kararlar.tsv        # boş
wc -l docs/01-kararlar.tsv                  # ADIM 5 sonrası ile aynı

# çıktılar
awk -F'\t' 'NF!=7' docs/_uretilen/b36a-adaylar.tsv | wc -l   # 0
head -5 docs/_uretilen/b36a-adaylar.tsv
sed -n '1,30p' docs/_uretilen/b36a-rapor.md

# nokta örnekleme — beş satırı ELLE aç ve doğrula
# rapordan beş `no` seç, aday satırını dosyada gözle kontrol et:
#   sed -n 'ADAYSATIRp' docs/90-kronoloji/DOSYA.md
```

⚠ **Beş nokta örneklemesi atlanamaz.** Betik puan veriyor, doğruluk beyan etmiyor.
Beşinin en az dördü kararın kendi kaydını göstermiyorsa **puanlama yanlıştır**, rapor
"yöntem yetersiz" notuyla kapanır ve iş B36-b'ye devreder.

---

## 4. COMMIT

```
docs(b36a): karar-listesi deseni ölçüldü, aday tablosu üretildi — ledger'a yazılmadı

Kapsam düzeltildi: olcum-2026-08.md "mekanik #kNNN terfisi" diyordu, KARAR 466
buna izin vermiyor — #k tanımı gereği elle doğrulanmış çapadır, betik üretemez.

Bu tur ölçer ve aday üretir. b36a-desen-tespiti.py popülasyonu kendi ölçtü
(418 rakamı devralınmadı, ledger o ölçümden beri büyüdü).

Çıktı: b36a-adaylar.tsv (no · dosya · mevcut · puan · aday · metin · durum) +
b36a-rapor.md. Beş nokta örneklemesi elle doğrulandı.

Betik _uretilen/ altında izleniyor — KARAR 467(a).
```

---

## 5. DUR NOKTALARI

1. Ledger başlığı `no·tarih·baslik·durum·iliski·kaynak` değilse (`assert` durur)
2. Çözülemeyen çapa sayısı sıfırdan büyükse — raporla, betiği zorlama
3. Nokta örneklemesinin beşinden ikiden fazlası tutmuyorsa
4. `git diff docs/01-kararlar.tsv` boş değilse — **betik ledger'a yazmamalıydı**
5. Sığ satır sayısı ölçüm dosyasının 9/21 oranından ciddi saparsa (beklenen kabaca
   %25–45 aralığı): sapma yöntem hatasının işaretidir, raporla

---

## 6. BUNDAN SONRA

Rapordaki **tek-aday oranı** bir sonraki turu belirler:

- Yüksekse (kabaca üçte ikinin üstü) → tek-adaylıların `:NNNN` işaretçisi mekanik
  olarak derin satıra taşınır. Ayrı brief, CC, ledger dönüşümü + eşleme tablosu +
  doğrulama tek iş (KARAR 467).
- Düşükse → iş bütünüyle **B36-b**'ye geçer: Claude.ai, ayrı sohbet.

Çok-adaylı ve adaysızlar her hâlükârda B36-b'dir. `03-sira.md` satır 4b zaten
162 · 231 · 381'i oraya yazıyor.

**B38 bu turdan sonra da açılmaz** — tanımı gereği sonuncudur ve ADIM 7'ye bağlıdır.
