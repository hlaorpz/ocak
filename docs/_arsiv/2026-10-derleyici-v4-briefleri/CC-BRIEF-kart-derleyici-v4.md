# CC BRIEF · Kart derleyici v4 (işaret, vurgu, story konumu)

**Tarih:** 11 Ekim 2026 · **Yazan:** Claude.ai · **Uygulayan:** CC · **Tür:** kod, tek dosya, tek commit

Bu brief'ten **sonra** `docs-patch-2026-10-11b-derleyici-v4.md` koşar (ayrı commit).

## Ne bu

Kaan derleyiciyi (v3, `d3162ef`) ilk kez tarayıcıda denedi ve üç şey söyledi (11 Eki): gece ↔ gündüz geçişinde üst yazı kayıyor ve gündüz işareti çok büyük · işaretin büyümesini değil "yarım bold" olmasını istemişti · 9:16'da yazı fazla aşağıda. Ardından kireç üstündeki kırmızıyı güçsüz buldu.

`~/Desktop/OCAK-kart-derleyici-v4.html` (md5 `0661af10cd331a0eff02219f76966957`, 1773 satır) v3'ün üstüne şunları yapar:

1. **Gündüz işareti gece boyunda.** `GUNDUZ_ISARET_ORAN = 1.2` kalktı. İşaret aşağı doğru büyüdüğü için metni itiyordu (koddan: `imzaYuk` farkı 1080 × 0,014 × 688/708 ≈ 14,7 px).
2. **Açık zeminde işaret yarım kademe kalın.** Tek renk işaretin SVG'sine aynı renkte kenar çizgisi eklenir (`stroke-width` 10, 708'lik çizim ızgarasında; `isaretKalinGorsel()`). Gece işaretine ve toprak/zeytin zemine uygulanmaz. İnce ayar → "İşaret kalınlığı (gündüz)" kaydırıcısı (0–24).
3. **Gündüz vurgusu `#B4401F`** (önce `#A04F36`).
4. **9:16'da blok yukarıda.** `F4 story · 9:16` gömülü ön ayarında `metinKaydir: 0 → -0.07`. Ön ayar gece ile ortak olduğu için **gece story de aynı kadar yukarı çıkar** (bilerek: iki ışık aynı dizgiyi kullanır, KARAR 652).
5. İki ipucu metninde "vurgu toprak" → "vurgu koyu köz".

## Claude.ai'de ölçülenler (başsız Chromium, Playwright, `Math.random` sabit)

v3 (md5 `3e6cf041…`) ile v4 (md5 `0661af10…`) on altı durumda karşılaştırıldı (yöntem: `canvas.toDataURL` → PNG → numpy `abs(A-B)`, farklı piksel sayısı):

- **Gece, story dışı dokuz durum: fark 0** (açılış · beş gömülü ön ayar: F1 fotoğraf, F1 zirve, F1 glow, F2 kapak, F2 iç kart · hızlı seçiciyle söz/görsel, söz/glow, karusel).
- Gece story iki durum (gömülü ön ayar ve hızlı seçici): farklı, **bilerek** (madde 4).
- Gündüz beş durum (z15 söz, z12 söz, z15 story, keten, zeytin): farklı, bilerek.
- ⚠ Bir koşuda "F1 fotoğraf" 1.450.147 farklı piksel verdi; aynı çift iki kez daha koşuldu, ikisinde de 0. Sebep derleyici değil test: 7 MB'lık zemin 450 ms'de yüklenmeyince bir taraf glow zemine düştü.
- Gece ve gündüzde ilk metin satırının üst kenarı: 4:5'te 331 ve 329 px, 9:16'da 803 ve 802 px (z02 ve z15 zeminde).
- 9:16'da işaret üstü → bant altı (z15, alt bantlı): v3 770–1232 px (merkez %52,1) → v4 641–1091 px (merkez %45,1).
- İkili indirme ve biçim hafızası v4'te yeniden koşuldu: 1080×1350 ve 1080×1920 iki dosya, sayfa hatası yok.
- `node --check` temiz.

Kaan v4'ü tarayıcıda denedi, biçim hafızasını elle sınadı ve onayladı (11 Eki). ⚠ O sırada masaüstündeki dosya bir önceki ara sürümdü (vurgu `#A04F36`); yeni kırmızıyı karşılaştırma görselinde gördü. Dosya sonradan düzeltildi; md5 kapısı aşağıda.

## ADIM 0

```bash
cd ~/Desktop/hlaorpz/ocak
git status --short                                   # boş olmalı
git log -1 --format='%h'                             # yazımda 49eb2ad; farklıysa raporla, DUR değil
md5 -q tools/ocak-kart-derleyici.html                # 3e6cf041668a4e16846931a5ef3c3da4 olmalı (v3)
md5 -q ~/Desktop/OCAK-kart-derleyici-v4.html         # 0661af10cd331a0eff02219f76966957 olmalı
```

## Yazım

```bash
cp ~/Desktop/OCAK-kart-derleyici-v4.html tools/ocak-kart-derleyici.html
git diff --stat tools/ocak-kart-derleyici.html
wc -l tools/ocak-kart-derleyici.html                                   # 1773
grep -c 'imzaKalin' tools/ocak-kart-derleyici.html                     # 12
grep -c 'GUNDUZ_ISARET_ORAN' tools/ocak-kart-derleyici.html            # 0
grep -c 'B4401F' tools/ocak-kart-derleyici.html                        # 1
grep -c 'A04F36' tools/ocak-kart-derleyici.html                        # 0
grep -c 'metinKaydir:-0.07' tools/ocak-kart-derleyici.html             # 1
grep -c 'indirIkisi' tools/ocak-kart-derleyici.html                    # 3
```

Dosyanın içeriğine dokunma; biçimlendirici koşturma.

```bash
git add tools/ocak-kart-derleyici.html
git commit -m "feat(kart): derleyici v4 — gündüz işareti gece boyunda ve yarım kademe kalın, vurgu #B4401F, 9:16'da blok yukarıda"
```

Kronolojiye **yazma**: bu commit'in kaydı docs patch'in işidir. Push, docs patch'ten sonra ikisi birlikte.

## DUR

1. Çalışma ağacı kirli.
2. İki md5'ten biri tutmuyor.
3. `grep` ya da `wc` sayımlarından biri tutmuyor.
