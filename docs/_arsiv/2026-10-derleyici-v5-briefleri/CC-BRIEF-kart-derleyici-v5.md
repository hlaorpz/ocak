# CC BRIEF · Kart derleyici v5 (dengeli satır, kalın ve koyu vurgu, yumuşak duvar)

**Tarih:** 11 Ekim 2026 · **Yazan:** Claude.ai · **Uygulayan:** CC · **Tür:** kod, tek dosya, tek commit

Bu brief'ten **sonra** `2-docs-patch-2026-10-11c-derleyici-v5.md` koşar (ayrı commit).

## Ne bu

Kaan v4 ile basılmış altı karta baktı (11 Eki, yerel 11:07): *"olmadığın aşağıya kaymış mesela beğenmedim. Doku güçlü mü, kırmızı soluk değil mi yine?"* Üçü de derleyicinin kusuruydu.

`~/Desktop/OCAK-kart-derleyici-v5.html` (md5 `91d5bd03fe28057cd5bc33c75b67b293`, 1818 satır) v4'ün (`f606c93`, md5 `0661af10…`) üstüne dört şey yapar:

1. **Dengeli satır.** `sar()` sığmayan satırı önce eskisi gibi böler; birden çok satır çıkıyorsa `dengele()` aynı satır sayısına, genişliklerin kareleri toplamı en küçük olacak biçimde yeniden böler. "Kimseye bir şey borçlu / olmadığın" → "Kimseye bir şey / borçlu olmadığın". Elle kırılan satıra ve sığan satıra dokunmaz. **Gecede de çalışır.**
2. **Vurgu yarı kalın.** Açık gündüz zemininde vurgu parçası Cormorant Garamond Italic **600** ile basılır (`GUNDUZ_VURGU_AGIRLIK`, `yaziFont()`); ölçüm ve çizim parça parça aynı fontla yapılır. Gecede ve toprak/zeytin zeminde vurgu metinle aynı ağırlıktadır. Google Fonts bağlantısına `1,600` eklendi.
3. **Vurgu rengi `#A8371C`** (önce `#B4401F`).
4. **Duvar daha yumuşak.** `GUNDUZ_YUMUSAT` 0.35 → 0.60 · `GUNDUZ_PERDE` 0.30 → 0.42.

## Claude.ai'de ölçülenler (başsız Chromium, Playwright, `Math.random` sabit)

v4 ile v5 on dokuz durumda karşılaştırıldı (yöntem: `canvas.toDataURL` → PNG → numpy `abs(A-B)`, farklı piksel sayısı):

- **Gece, satırı sarmayan on bir durum: fark 0** (açılış · altı gömülü ön ayar · hızlı seçiciyle söz/görsel, söz/glow, karusel, story).
- Gece, satırı saran iki durum: farklı, **bilerek** (28.016 ve 36.865 piksel; yalnız satır kırımı değişti).
- Gündüz altı durum: beşi farklı (bilerek); zeytin zeminde sarmayan kart **0**.
- Kenar durumları gözle bakıldı: sola hizalı metin · vurgu iki satıra yayılırken · satırdan uzun tek kelime · elle kırılmış satırlar. Sayfa hatası yok.
- İkili indirme ve biçim hafızası v5'te yeniden koşuldu: 1080×1350 ve 1080×1920 iki dosya, sayfa hatası yok. `node --check` temiz.
- Vurgu kontrastı (WCAG; zemin: metin bandı ortalaması): `#A8371C` krem 5.5 · keten 4.1 · z14 4.2 · z15 4.5 · z13 3.2; `#B4401F` aynı sırayla 4.8 · 3.6 · 3.7 · 3.9 · 2.8. Doygunluk ikisinde %71 (HLS).

⚠ **Gerçek tarayıcıda görülmedi.** Test ortamı Google Fonts'a erişemiyor; 600 italik `@fontsource/cormorant-garamond` paketinden yüklendi. Kaan'ın tarayıcısında 600 italik Google Fonts'tan gelmezse tarayıcı 500'ü yapay kalınlaştırır. Kaan ilk kartta bakacak.

## ADIM 0

```bash
cd ~/Desktop/hlaorpz/ocak
git status --short                                   # boş olmalı
git log -1 --format='%h'                             # yazımda ffff938; farklıysa raporla, DUR değil
md5 -q tools/ocak-kart-derleyici.html                # 0661af10cd331a0eff02219f76966957 olmalı (v4)
md5 -q ~/Desktop/OCAK-kart-derleyici-v5.html         # 91d5bd03fe28057cd5bc33c75b67b293 olmalı
```

## Yazım

```bash
cp ~/Desktop/OCAK-kart-derleyici-v5.html tools/ocak-kart-derleyici.html
git diff --stat tools/ocak-kart-derleyici.html
wc -l tools/ocak-kart-derleyici.html                                   # 1818
grep -c 'dengele' tools/ocak-kart-derleyici.html                       # 3
grep -c 'GUNDUZ_VURGU_AGIRLIK' tools/ocak-kart-derleyici.html          # 2
grep -c 'yaziFont' tools/ocak-kart-derleyici.html                      # 4
grep -c 'A8371C' tools/ocak-kart-derleyici.html                        # 1
grep -c 'B4401F' tools/ocak-kart-derleyici.html                        # 0
grep -c 'GUNDUZ_PERDE = 0.42, GUNDUZ_YUMUSAT = 0.60' tools/ocak-kart-derleyici.html   # 1
grep -c 'imzaKalin' tools/ocak-kart-derleyici.html                     # 12
```

Dosyanın içeriğine dokunma; biçimlendirici koşturma.

```bash
git add tools/ocak-kart-derleyici.html
git commit -m "feat(kart): derleyici v5 — dengeli satır, vurgu yarı kalın ve #A8371C, duvar daha yumuşak"
```

Kronolojiye **yazma**: bu commit'in kaydı docs patch'in işidir. Push, docs patch'ten sonra ikisi birlikte.

## DUR

1. Çalışma ağacı kirli.
2. İki md5'ten biri tutmuyor.
3. `grep` ya da `wc` sayımlarından biri tutmuyor.
