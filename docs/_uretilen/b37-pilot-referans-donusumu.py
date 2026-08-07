#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
B37 — `01-kararlar.tsv` `kaynak` sütunundaki `ocak-pilot.md:NN` referanslarının
dönüşümü (7 Ağustos 2026). B33'ün ikinci ayağı.

Pilot ADIM 3'te dağıtıldı ve `_arsiv/ocak-pilot-v52.md`'ye çekildi; ledger'daki
satır numaraları hiçbir yaşayan dosyada karşılık bulmuyordu.

B33'TEN FARKI — neden bu betik ikizi değil kardeşi:
  Kronoloji BAYT ARALIĞIYLA dilimlendi; `kronoloji-satir-esleme.tsv`
  `eski_satir → yeni_dosya:yeni_satir` veriyordu, dönüşüm birebirdi.
  Pilot ANLAMSAL olarak bölündü; `_bolme-haritasi.tsv` üç sütun taşıyor
  (`pilot_satir · hedef · ilk_80_karakter`) ve hedef SATIR NUMARASI YOK —
  yalnız kısa kod (K7, RS…) + satır içeriğinin ilk 80 karakteri.
  Bu yüzden hedef satır numarası İÇERİK EŞLEŞTİRMESİYLE türetilir (Dal B).

KURAL — tek eşleşme yoksa yazma:
  ADIM 3 kaydı "referans dosyalarına giden her şey birebir taşındı" diyor.
  Prefix hedef dosyada TEK satırla eşleşmeliydi.
  Sıfır ya da çoklu eşleşme → satır ARTIĞA atılır, tahmin edilmez (KARAR 456).

KARAR 466: mevcut `#k` hücrelerine dokunulmaz — yalnız `^ocak-pilot\.md:[0-9]+$`.
KARAR 456: tsv türetilmiş dosyadır; `_arsiv/` ve `_bolme-haritasi.tsv` değişmez.
Önek yazılmaz — ledger kanonu dosya adıdır, dizin yolu değil (B33'te de böyleydi).

Kullanım:  python3 docs/_uretilen/b37-pilot-referans-donusumu.py [--dry-run]
"""
import csv, re, sys, os

KOK = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
D = lambda *p: os.path.join(KOK, 'docs', *p)
LEDGER = D('01-kararlar.tsv')
HARITA = D('_arsiv', '_bolme-haritasi.tsv')
KOD_TABLO = D('_uretilen', 'bolme-kod-cozumu.tsv')

RE_KIRIK = re.compile(r'^ocak-pilot\.md:(\d+)$')


def kod_cozumu():
    """kod → (dosya_adi, tam_yol). Tablo ayrı dosyada — B32'de aynı desen lazım."""
    m = {}
    with open(KOD_TABLO, encoding='utf-8') as fh:
        r = csv.reader(fh, delimiter='\t', quoting=csv.QUOTE_NONE)
        next(r)
        for kod, dosya, dizin, _ in r:
            m[kod] = (dosya, os.path.join(KOK, dizin, dosya))
    return m


def harita_yukle():
    m = {}
    with open(HARITA, encoding='utf-8') as fh:
        r = csv.reader(fh, delimiter='\t', quoting=csv.QUOTE_NONE)
        baslik = next(r)
        assert baslik == ['pilot_satir', 'hedef', 'ilk_80_karakter'], baslik
        for row in r:
            if len(row) >= 3:
                m[int(row[0])] = (row[1], row[2])
    return m


def main(dry):
    kod, harita = kod_cozumu(), harita_yukle()
    with open(LEDGER, encoding='utf-8', newline='') as fh:
        satirlar = list(csv.reader(fh, delimiter='\t', quoting=csv.QUOTE_NONE))

    cache = {}
    donusen, artik, eksik = 0, [], []
    for s in satirlar[1:]:
        if len(s) != 6:
            continue
        m = RE_KIRIK.match(s[5])
        if not m:
            continue                       # #k ve diğer biçimler korunur
        e = int(m.group(1))
        if e not in harita:
            eksik.append((s[0], e)); continue
        k, prefix = harita[e]
        dosya, yol = kod[k]
        if yol not in cache:
            cache[yol] = open(yol, encoding='utf-8').read().split('\n')
        pre = prefix.rstrip()
        hits = [i + 1 for i, l in enumerate(cache[yol]) if pre and l.startswith(pre)]
        if len(hits) == 1:
            s[5] = f'{dosya}:{hits[0]}'; donusen += 1
        else:
            artik.append((s[0], e, k, 'sıfır' if not hits else f'{len(hits)} çoklu'))

    if eksik:
        print(f'DUR: haritada olmayan {len(eksik)} referans — {eksik[:10]}')
        return 1

    print(f'  dönüşen: {donusen}')
    print(f'  ARTIK  : {len(artik)}' + (f' — {artik}' if artik else ' (tahmin edilmedi)'))
    if dry:
        print('  --dry-run: yazılmadı')
        return 0

    with open(LEDGER, 'w', encoding='utf-8', newline='') as fh:
        csv.writer(fh, delimiter='\t', quoting=csv.QUOTE_NONE,
                   quotechar='', escapechar='\\', lineterminator='\n').writerows(satirlar)
    print(f'  yazıldı: {LEDGER}')
    return 0


if __name__ == '__main__':
    sys.exit(main('--dry-run' in sys.argv))
