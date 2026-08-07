#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
B33 — `01-kararlar.tsv` `kaynak` sütunu dönüşümü (7 Ağustos 2026).

`ocak-kronoloji.md` 6 Ağustos'ta aylık dilimlere ayrıldı ve `_arsiv/` altına çekildi.
Ledger'ın `kaynak` sütunundaki `ocak-kronoloji.md:NNNN` referansları hiçbir yaşayan
dosyada hiçbir şeye denk gelmiyordu. Bu betik onları kesim anında üretilen eşleme
tablosu üzerinden dilim referansına çevirir.

KARAR 456: tsv TÜRETİLMİŞ dosyadır — yanlışsa yeniden üretilir, kaynak veriye
dokunulmaz. `_arsiv/` altındaki hiçbir dosya bu betikle değişmez.

KARAR 466: `kaynak` iki biçim taşır.
  `YYYY-AA.md#kNNN`  elle doğrulanmış çapa — GÜÇLÜ, mekanik dönüşüm ASLA ezmez
  `YYYY-AA.md:NNNN`  mekanik satır işaretçisi — meşru ama sığ, zamanla #k'ye terfi eder
Bu betik yalnız `^ocak-kronoloji\.md:[0-9]+$` desenine uyan hücreleri işler.

Dosya adı öneki: eşleme tablosu `90-kronoloji/2026-05.md` yazar; ledger kanonu
öneksizdir (`2026-07.md#k380` gibi — dizin yolu değil, dosya adı). Önek sıyrılır.

Kullanım:  python3 docs/_uretilen/b33-kaynak-donusumu.py [--dry-run]
"""
import csv, re, sys, os

KOK = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
LEDGER = os.path.join(KOK, 'docs', '01-kararlar.tsv')
ESLEME = os.path.join(KOK, 'docs', '_arsiv', 'kronoloji-satir-esleme.tsv')

RE_KIRIK = re.compile(r'^ocak-kronoloji\.md:(\d+)$')
ONEK = '90-kronoloji/'

# Kaan onayı 7 Ağu: tek kalan önekli satır normalize edilir. `#k455` meşru —
# KARAR 455'in tam metni 2026-08.md:126'da. KARAR 466'nın "terfi" kuralının
# ilk uygulaması.
ELLE = {'455': ('90-kronoloji/2026-08.md', '2026-08.md#k455')}


def esleme_yukle():
    m = {}
    with open(ESLEME, encoding='utf-8') as fh:
        r = csv.reader(fh, delimiter='\t', quoting=csv.QUOTE_NONE)
        baslik = next(r)
        assert baslik == ['eski_satir', 'yeni_dosya', 'yeni_satir'], baslik
        for eski, dosya, yeni in r:
            m[int(eski)] = (dosya, int(yeni))
    return m


def main(dry):
    esleme = esleme_yukle()
    with open(LEDGER, encoding='utf-8', newline='') as fh:
        satirlar = list(csv.reader(fh, delimiter='\t', quoting=csv.QUOTE_NONE))

    donusen = elle = 0
    eksik = []
    for s in satirlar[1:]:
        if len(s) != 6:
            continue
        no, kaynak = s[0], s[5]

        if no in ELLE and kaynak == ELLE[no][0]:
            s[5] = ELLE[no][1]; elle += 1; continue

        m = RE_KIRIK.match(kaynak)
        if not m:
            continue                      # #k biçimi ve diğerleri korunur
        e = int(m.group(1))
        if e not in esleme:
            eksik.append((no, e)); continue
        dosya, yeni = esleme[e]
        if dosya.startswith(ONEK):
            dosya = dosya[len(ONEK):]     # ledger kanonu öneksiz
        s[5] = f'{dosya}:{yeni}'
        donusen += 1

    if eksik:
        print(f'DUR: eşlemesi olmayan {len(eksik)} referans — {eksik[:10]}')
        return 1

    print(f'  dönüşen (mekanik): {donusen}')
    print(f'  normalize (elle) : {elle}')
    if dry:
        print('  --dry-run: yazılmadı')
        return 0

    with open(LEDGER, 'w', encoding='utf-8', newline='') as fh:
        w = csv.writer(fh, delimiter='\t', quoting=csv.QUOTE_NONE,
                       quotechar='', escapechar='\\', lineterminator='\n')
        w.writerows(satirlar)
    print(f'  yazıldı: {LEDGER}')
    return 0


if __name__ == '__main__':
    sys.exit(main('--dry-run' in sys.argv))
