# DOCS PATCH · 11 Ekim 2026 (c) · Kart derleyici v5 turu

**Yazan:** Claude.ai (Midjourney / gündüz zeminleri sohbeti). **Uygulayan:** CC, `ocak-arsivci` ile.

## SIRA

`1-CC-BRIEF-kart-derleyici-v5.md` uygulanıp **commit'lendikten sonra** koşar. Çalışma ağacı temiz olmalı. Tek commit.

Korpus bu patch'ten önce şunu biliyor (ölçüm: Kaan'ın diski, HEAD `ffff938`, 11 Eki): derleyici v4, KARAR 656 (vurgu `#B4401F`, işaret gece boyunda ve yarım kademe kalın) · 657 (9:16'da blok yukarıda) · `ocak-kart` skill'i derleyiciye göre yazılı. Şunu bilmiyor: dengeli satır · vurgunun yarı kalın ve `#A8371C` olduğu · yumuşatma ve perdenin arttığı · v5 kartları.

⚠ Başka bir Claude.ai sohbeti (pazarlama) bu sırada patch üretiyor olabilir. Numaralar yer tutucudur; çapalardan biri o yüzden tutmuyorsa DUR ve raporla.

---

## ADIM 0

```bash
cd ~/Desktop/hlaorpz/ocak
git log --oneline -6
git status --short                                                    # kirliyse DUR
git log --oneline -1 -- tools/ocak-kart-derleyici.html                # derleyici v5 commit'i → <DC>
grep -c 'dengele' tools/ocak-kart-derleyici.html                      # 3; 0 ise DUR (v5 commit'lenmemiş)
wc -l docs/00-durum.md                                                # yazımda 190
awk -F'\t' 'NR>1{print $1}' docs/01-kararlar.tsv | sort -n | tail -1  # son KARAR (yazımda 657)
awk -F'\t' '$1==656{print $4" | "$5}' docs/01-kararlar.tsv            # AKTIF | ←653 · ↔637 · ↔652
node scripts/baslik-denetim.mjs ; echo "denetim: $?"                  # 0 değilse DUR
grep -c '^\*\*Son güncelleme:\*\*' docs/00-durum.md docs/02-borclar.md docs/03-sira.md        # üçü de 1
grep -c '^| `main` dönem HEAD |' docs/00-durum.md                                              # 1
grep -c '^## BU DÖNEM NE OLDU$' docs/00-durum.md                                               # 1
grep -c '^- \*\*11 Eki — (1) karşılandı:\*\*' docs/02-borclar.md                               # 1
grep -c '^- \*\*Bağ:\*\* B141 · B170 · KARAR 650$' docs/02-borclar.md                          # 1
grep -c '^\*\*Sıradaki iş (kartlar ve gönderiler, 11 Eki — v4 turundan sonra):\*\*' docs/03-sira.md   # 1
grep -c '^> \*\*11 Ekim 2026, v4 turu — vurgu `#B4401F` oldu' docs/pazarlama/GORSEL-gunduz-paleti-ve-MJ.md docs/pazarlama/DEVIR-gunduz-zeminleri-midjourney.md   # ikisi de 1
md5 -q docs/skills/ocak-kart/SKILL.md                                 # 1116982cab084c4611962d92fae24481
md5 -q ~/Desktop/OCAK-v5-teslim/SKILL.md                              # 31dc4fe252c214ea5df8e449c844a3a5
ls pazarlama-ekler/kartlar-2026-10-11-derleyici-v5 2>/dev/null | wc -l     # 0 (klasör yok)
ls ~/Desktop/OCAK-v5-teslim/kartlar/*.jpg | wc -l                          # 8
grep -c 'v5 turu' pazarlama-ekler/kartlar-2026-10-11-derleyici-v4/00-NOT.md   # 0
```

⚠ Sekiz JPG'nin md5'i yazılmadı: Claude.ai'nin masaüstü köprüsü JPG kabını yeniden yazıyor, pikseller aynı kalıyor (v4 patch'indeki ölçüm). Kapı dosya sayısıdır.

Yer tutucular — değerleri ADIM 0'dan gelir:

| Yer tutucu | Değer |
|---|---|
| `<DH>` | `git log -1 --format='%h'` (yazımdan önceki HEAD; derleyici v5 commit'i olmalı) |
| `<ESKI-DH>` | `00-durum.md`'de `| `main` dönem HEAD |` satırının başındaki kalın hash |
| `<DC>` | derleyici v5 commit'inin kısa hash'i |
| `<K1>` · `<K2>` | son KARAR + 1 · + 2 (ikisi de boş olmalı) |

Bu patch borç açmaz ve kapatmaz. Sayımlardan biri tutmuyorsa DUR.

---

## 1 · `docs/00-durum.md`

**1a · Başlık.** `**Son güncelleme:**` ile başlayan satırın tamamı:

```
**Son güncelleme:** 11 Ekim 2026 · **Kart derleyici v5 turu** · dönem HEAD `<DH>`
```

**1b · Dönem HEAD satırı.** `| `main` dönem HEAD |` ile başlayan satırın **tamamını birebir** kronoloji kaydındaki `### Tahliye` başlığının altına taşı (KARAR 61). Yerine:

```
| `main` dönem HEAD | **`<DH>`** (11 Eki, kart derleyici v5 turu — bir önceki dönem `<ESKI-DH>`) — canlı HEAD değil, dönemin son commit'i · kapanış commit'inden bir önceki (KARAR 474). **Canlı HEAD üretilendir** → `docs/04-olcum.md` (KARAR 580). ⚠ **Bu dönem KOD içerdi:** `<DC>` (`tools/ocak-kart-derleyici.html` — derleyici v5). `<ESKI-DH>..<DH>` aralığının tam listesi `90-kronoloji/2026-10.md` 11 Eki v5 kaydında. Önceki dönemin (`<ESKI-DH>`) satırı `90-kronoloji/2026-10.md`'ye indi (KARAR 61) |
```

**1c · `## BU DÖNEM NE OLDU`.** Başlığı izleyen boş satırdan sonra, mevcut ilk maddenin üstüne:

```
- **11 Ekim — Kart derleyici v5 turu:** kod `<DC>`. Kaan v4 kartlarına bakıp üç kusur söyledi (tek kelime alt satıra düşüyor · kırmızı zayıf · doku güçlü). Düzeldi: sığmayan satır dengeli bölünür (gece dahil) · gündüz vurgusu yarı kalın ve `#A8371C` · sert duvar daha çok yumuşatılır (**KARAR <K1> · <K2>**; KARAR 656 → SUPERSEDE). Altı kart v5 ile yeniden basıldı; `ocak-kart` skill'i güncellendi. ⚠ Yarı kalın vurgu gerçek tarayıcıda henüz görülmedi. → `90-kronoloji/2026-10.md`
```

**Tavan.** Net etki +1 satır (yazımda 190 → 191). Yazımdan sonra 200'ü aşıyorsa `## BU DÖNEM NE OLDU` bölümünün son maddesini birebir kronoloji kaydındaki `### Tahliye` başlığının altına taşı.

---

## 2 · `docs/01-kararlar.tsv`

**2a · KARAR 656 SUPERSEDE.** Yalnız `durum` ve `iliski` sütunları değişir (`<K1>` yerine numarayı koy):

```bash
perl -pi -e 'if(/^656\t/){ s/\tAKTIF\t←653 · ↔637 · ↔652\t/\tSUPERSEDE\t←653 · ↔637 · ↔652 · →<K1>\t/ }' docs/01-kararlar.tsv
awk -F'\t' '$1==656{print $4" | "$5}' docs/01-kararlar.tsv            # SUPERSEDE | ←653 · ↔637 · ↔652 · →<K1>
```

**2b · Sona iki satır** (TAB ayraçlı, altı sütun):

```
<K1>	2026-10-11	Gündüz kartında metin Kömür; vurgu `#A8371C` ve açık zeminde yarı kalın (600); işaret tek renk köz, gecedeki boyunda, açık zeminde yarım kademe kalın; açık zeminde yazı bir kademe kalın (500); fotoğrafta krem perde 0,42, sert dokulu görselde yumuşatma 0,60; toprak ve zeytin zeminde metin, işaret ve bant krem, vurgu yok, işaret kalınlaştırılmaz	AKTIF	←656 · ↔637 · ↔652	2026-10.md#k<K1>
<K2>	2026-10-11	Karta sığmayan satır dengeli bölünür — tek kelime alt satıra düşmez; elle kırılan satıra dokunulmaz; gece ve gündüzde aynı	AKTIF	↔652 · ↔<K1>	2026-10.md#k<K2>
```

İki satır yargıdır; metni değiştirme.

---

## 3 · `docs/02-borclar.md`

**3a · Başlık.** `**Son güncelleme:**` ile başlayan satırın tamamı:

```
**Son güncelleme:** 11 Ekim 2026 · **Kart derleyici v5 turu**
```

**3b · B235'e ek.** `- **11 Eki — (1) karşılandı:**` ile başlayan satırın hemen **altına** ekle (mevcut satırlar değişmez):

```
- **11 Eki, v5 turu:** gündüz değerleri bir kez daha değişti — vurgu `#A8371C` ve yarı kalın (KARAR <K1>; 656 SUPERSEDE); sığmayan satır dengeli bölünür (KARAR <K2>). (2)'deki satırlar düzeltilirken hedef bu değerlerdir. `kartlar-2026-10-11-derleyici-v4/` içindeki altı kart da eskidi; güncel baskılar `pazarlama-ekler/kartlar-2026-10-11-derleyici-v5/`. Skill v5'e göre güncellendi. Kapanış şartı değişmedi.
```

**3c · B236'ya ek.** `- **Bağ:** B141 · B170 · KARAR 650` satırının hemen **altına** ekle:

```
- **11 Eki, v5 turu:** Kaan z14 ve z15'in dokusunu basılı kartta güçlü buldu. Derleyicinin yumuşatması 0,35 → 0,60, metin arkası krem perde 0,30 → 0,42 oldu (KARAR <K1>). Bu bir ara çözümdür; kapanış şartındaki "sertliği 17'nin altında bir düz kireç zemini" hâlâ üretilmedi.
```

---

## 4 · `docs/03-sira.md`

**4a · Başlık.** `**Son güncelleme:**` ile başlayan satırın tamamı:

```
**Son güncelleme:** 11 Ekim 2026 · **Kart derleyici v5 turu**
```

**4b · Mevcut paragrafa ek.** `**Sıradaki iş (kartlar ve gönderiler, 11 Eki — v4 turundan sonra):**` ile başlayan paragrafın **sonuna** (son noktadan sonra, aynı satırda) ekle; paragrafın mevcut metni değişmez:

```
 **11 Eki, v5:** derleyici v5 oldu (KARAR <K1> · <K2>) — sığmayan satırı kendisi dengeler, vurgu yarı kalın ve `#A8371C`, sert duvar daha çok yumuşatılır. Hazır kartların güncel baskısı `pazarlama-ekler/kartlar-2026-10-11-derleyici-v5/`; v4 klasöründekiler eskidi. ⚠ Yarı kalın vurgu Kaan'ın tarayıcısında henüz görülmedi: ilk kartta vurgu satırı metinden belirgin kalın değilse ya da harfler bulanık kalınsa 600 italik yüklenmemiştir, sayfa yenilenir.
```

---

## 5 · `docs/pazarlama/` — iki işaret

`docs/pazarlama/GORSEL-gunduz-paleti-ve-MJ.md` ve `docs/pazarlama/DEVIR-gunduz-zeminleri-midjourney.md` dosyalarının **ikisinde de**, `> **11 Ekim 2026, v4 turu — vurgu `#B4401F` oldu` ile başlayan satırın hemen **altına** şu iki satırı ekle (mevcut satır değişmez):

```
>
> **11 Ekim 2026, v5 turu — vurgu `#A8371C` ve yarı kalın (KARAR <K1>; 656 SUPERSEDE).** Sığmayan satır dengeli bölünür (KARAR <K2>). Yukarıdaki satırın `#B4401F`'si tarihçedir.
```

---

## 6 · `docs/skills/ocak-kart/SKILL.md`

```bash
cp ~/Desktop/OCAK-v5-teslim/SKILL.md docs/skills/ocak-kart/SKILL.md
grep -c 'A8371C' docs/skills/ocak-kart/SKILL.md            # 1
grep -c 'B4401F' docs/skills/ocak-kart/SKILL.md            # 0
grep -c 'dengeli böler' docs/skills/ocak-kart/SKILL.md     # 1
head -4 docs/skills/ocak-kart/SKILL.md                     # frontmatter aynen
bash scripts/skill-sync.sh zip                             # zip .gitignore'da; commit'e girmez
```

Dört satır değişti: değerlerin okunduğu sürüm (v5) ve halef zincirinin başı (656) · reçetede dengeli satır cümlesi · vurgu hücresi · yumuşatma cümlesine z14/z15 notu. Kaan aynı metni claude.ai'ye karttan kaydedecek; zip yüklemesi gerekmez.

---

## 7 · Korpus dışı ekler — v5 kartları

```bash
mkdir -p pazarlama-ekler/kartlar-2026-10-11-derleyici-v5
cp ~/Desktop/OCAK-v5-teslim/kartlar/*.jpg pazarlama-ekler/kartlar-2026-10-11-derleyici-v5/
ls pazarlama-ekler/kartlar-2026-10-11-derleyici-v5 | wc -l            # 8
```

`pazarlama-ekler/kartlar-2026-10-11-derleyici-v5/00-NOT.md` adıyla şu dosyayı yaz:

```
# Derleyici v5 ile basılan gündüz kartları (11 Ekim 2026)

Altı kart, `tools/ocak-kart-derleyici.html` v5 ile (KARAR <K1> · <K2>), Claude.ai'de başsız tarayıcıda basıldı. ⚠ Yarı kalın vurgu test ortamında `@fontsource/cormorant-garamond` paketinden yüklenen 600 italikle basıldı; Kaan'ın tarayıcısındaki sonuç bu dosyalarla karşılaştırılarak doğrulanır.

| Dosya | Zemin | Ayar |
|---|---|---|
| `1010-O-soz-kullenen-kirec-4x5.jpg` · `-9x16.jpg` | z15 | Gündüz · Söz kartı / Story · varsayılan |
| `1011-A-bir-saat-kirec-4x5.jpg` · `-9x16.jpg` | z14 | Gündüz · Söz kartı / Story · alt bant · metin tek satır girildi, derleyici böldü |
| `1012-O-fatma-aliye-k1-kalem-4x5.jpg` · `-9x16.jpg` | z13 | Gündüz · Söz kartı (metin kaydır 0.04) / Story (varsayılan −0.07, yatay kaydır −0.34) |

Aynı adların v4 baskıları `kartlar-2026-10-11-derleyici-v4/`, v3 baskıları `kartlar-2026-10-11-derleyici/` içindedir.

İki karşılaştırma görseli:
- `v5-bes-adim-bir-saat.jpg` — Bir Saat kartı beş adımda: v4 · dengeli satır · + vurgu yarı kalın · + `#A8371C` · + yumuşak duvar (v5).
- `v5-alti-kart-ozet.jpg` — altı v5 kartı yan yana.
```

`pazarlama-ekler/kartlar-2026-10-11-derleyici-v4/00-NOT.md` dosyasının **sonuna** (öncesinde bir boş satır) şu satırı ekle; mevcut içerik değişmez:

```
**11 Eki, v5 turu:** bu klasördeki altı kart v4 biçimindedir ve yayınlanmaz; güncel baskılar `../kartlar-2026-10-11-derleyici-v5/` (KARAR <K1>).
```

---

## 8 · Üretilen dosya

```bash
node scripts/durum-uret.mjs      # 04-olcum.md; elle düzenlenmez
```

---

## 9 · `docs/90-kronoloji/2026-10.md` — sona append

```
## 2026-10-11 — kart derleyici v5 turu · KARAR <K1>–<K2> · B açılan — / kapanan — · HEAD <DH>

⚠ **Saat notu:** tur Kaan'ın yerel saatiyle 11 Eki 11:07–11:40'ta koştu (UTC+8). v4 turuyla aynı sohbetin devamıdır. Başsız tarayıcı ölçümleri Claude.ai'nindir.

### Tetikleyen

Kaan yeni pazarlama sohbetinde v4 ile basılmış altı karta baktı ve bu sohbete getirdi: *"bunları yeni sohbet çıkardı. değerlendisene: olmadığın aşağıya kaymış mesela beğenmedim. Doku güçlü mü, kırmızı soluk değil mi yine?"* Altı kart Claude.ai'nin v4 baskılarıdır (`pazarlama-ekler/kartlar-2026-10-11-derleyici-v4/`); üç kusur da derleyicinindi. Beş adımlı karşılaştırma basıldı (`v5-bes-adim-bir-saat.jpg`); Kaan: *"v5 yapalım cc breif yaz cc boş"*.

- **KARAR <K2> — SIĞMAYAN SATIR DENGELİ BÖLÜNÜR (AKTIF):** derleyici satırı sığdığı yere kadar doldurup artanı alta atıyordu; "Kimseye bir şey borçlu olmadığın" → "…borçlu / olmadığın", "ilk kitabına adını yazamadı." → "…adını / yazamadı." Yeni `dengele()` aynı satır sayısına, genişliklerin kareleri toplamı en küçük olacak biçimde böler: "Kimseye bir şey / borçlu olmadığın", "ilk kitabına / adını yazamadı." Elle kırılan satıra ve sığan satıra dokunmaz. **Gecede de çalışır** — satırı saran gece kartının görünümü değişir.
- **KARAR <K1> — GÜNDÜZ KARTININ KURALLARI, 656'NIN HALEFİ (AKTIF):** 656'dan üç şey değişti. (a) Vurgu açık zeminde yarı kalın: Cormorant Garamond Italic 600. Teşhis: v4'ün rengi artık soluk değildi (doygunluk %71), ama ince italikte mürekkep azdı. (b) Vurgu `#B4401F` → `#A8371C`. (c) Krem perde 0,30 → 0,42 ve sert görselde yumuşatma 0,35 → 0,60. 656'nın öbür hükümleri aynen sürer.
- **Vurgu ölçümleri** (WCAG kontrast oranı; zemin rengi basılan zeminlerin metin bandı ortalaması; doygunluk HLS):

  | Renk | krem | keten | z14 | z15 | z13 | kömürden ayrım | doygunluk |
  |---|---|---|---|---|---|---|---|
  | `#B4401F` (656) | 4.8 | 3.6 | 3.7 | 3.9 | 2.8 | 3.2 | %71 |
  | `#A8371C` (<K1>) | 5.5 | 4.1 | 4.2 | 4.5 | 3.2 | 2.8 | %71 |

  ⚠ Koyulaşınca vurgunun kömür metinden ayrımı 3,2'den 2,8'e indi; yarı kalınlık bunu telafi etsin diye birlikte uygulandı. Kaan beş adımı görüp onayladı.
- **Doku:** yumuşatma ve perde ara çözümdür; daha sakin kireç zemini üretilmedi (**B236**).
- **Gece çıktısı:** v4 (md5 `0661af10…`) ile v5 (md5 `91d5bd03…`) on dokuz durumda karşılaştırıldı (`Math.random` sabit; `canvas.toDataURL` → PNG → numpy `abs(A-B)`). Gece, satırı sarmayan on bir durumda farklı piksel **0**; gece, satırı saran iki durumda farklı (28.016 ve 36.865; bilerek); gündüz altı durumun beşi farklı (bilerek), zeytin zeminde sarmayan kart 0.
- ⚠ **Gerçek tarayıcıda görülmedi.** Test ortamı Google Fonts'a erişemiyor; 600 italik `@fontsource/cormorant-garamond` npm paketinden yüklendi. Derleyicinin Google Fonts bağlantısına `1,600` eklendi; Kaan'ın tarayıcısında yüklenmezse tarayıcı 500'ü yapay kalınlaştırır. Kaan ilk kartta bakacak.
- **Ölçüm düzeltmesi:** Claude.ai'nin sohbette "kireçte kontrast 4,2" dediği rakam perdeli tek bir bandın ölçümüydü; bu kayıttaki tablo zemin zemin ölçümdür ve onun yerine geçer.

### Basılan kartlar

Altı kart v5 ile yeniden basıldı: `pazarlama-ekler/kartlar-2026-10-11-derleyici-v5/` (içindeki `00-NOT.md`). v4 ve v3 baskıları kendi klasörlerinde duruyor, notlarıyla işaretli (KARAR 61).

### Skill

`docs/skills/ocak-kart/SKILL.md` dört satırda güncellendi (v5 değerleri, dengeli satır). md5 `1116982c…` → `31dc4fe2…`.

### Dönem aralığı

`git log --oneline <ESKI-DH>..<DH>`:

<LİSTE>

### Tahliye — `00-durum.md`'den inenler (KARAR 61)

<1b adımında taşınan eski `main` dönem HEAD satırı, birebir>

<tavan aşıldıysa `## BU DÖNEM NE OLDU`'dan taşınan madde, birebir; aşılmadıysa "tavan aşılmadı">
```

---

## KAPANIŞ

**Commit'ten önce:**

```bash
node scripts/durum-uret.mjs
node scripts/baslik-denetim.mjs          # 0 olmalı
wc -l docs/00-durum.md                   # ≤200
git log -1 --format='%h'                 # <DH> ile eşit olmalı
awk -F'\t' 'NF!=6' docs/01-kararlar.tsv | wc -l                      # 0
awk -F'\t' 'NR>1{print $1}' docs/01-kararlar.tsv | sort | uniq -d    # boş
awk -F'\t' 'NR>1{print $4}' docs/01-kararlar.tsv | sort -u           # dokuz değerin alt kümesi
awk -F'\t' 'NR>1 && $6==""' docs/01-kararlar.tsv | wc -l             # 0
awk -F'\t' '$1==656{print $4}' docs/01-kararlar.tsv                  # SUPERSEDE
md5 -q docs/skills/ocak-kart/SKILL.md                                # 31dc4fe252c214ea5df8e449c844a3a5
grep -rc 'vurgu `#A8371C` ve yarı kalın' docs/pazarlama | grep -v ':0$' | wc -l   # 2
```

**Commit:**

```bash
git add docs/00-durum.md docs/01-kararlar.tsv docs/02-borclar.md docs/03-sira.md docs/04-olcum.md docs/90-kronoloji/2026-10.md docs/pazarlama docs/skills/ocak-kart/SKILL.md pazarlama-ekler/kartlar-2026-10-11-derleyici-v4 pazarlama-ekler/kartlar-2026-10-11-derleyici-v5
git commit -m "docs: kart derleyici v5 turu — KARAR <K1>–<K2> · 656 SUPERSEDE · v5 kartları · skill"
```

**Commit'ten sonra:**

```bash
git log -2 --format='%h' | tail -1       # 00-durum.md'deki dönem HEAD (<DH>) ile eşit olmalı
```

Tutmuyorsa raporla; geriye dönük düzeltme commit'i atma. Sonra bu iki dosyayı (`1-CC-BRIEF-…`, `2-docs-patch-…`) v4 turunun brief'lerini arşivlediğin kalıpla (`ffff938`) arşive taşı; ayrı commit. Push Kaan'ın onayıyla: `npx vitest run` ve `npm run build` temizse push; `docs_envanter` HEAD'ini yaz.

---

## DUR KOŞULLARI

1. Çalışma ağacı kirli, ya da derleyici v5 commit'lenmemiş (`dengele` sayısı 0).
2. ADIM 0'daki çapa sayımlarından biri beklenenden farklı.
3. `baslik-denetim.mjs` sıfır dönmüyor.
4. `<K1>` ya da `<K2>` numarası dolu; ya da KARAR 656'nın durumu `AKTIF` değil.
5. İki skill md5'inden biri tutmuyor.
6. `kartlar-2026-10-11-derleyici-v5/` klasörü zaten var, ya da masaüstünde sekiz JPG yok.
7. Elle rakam yazma isteği doğuyor (ölçülemeyen alan boş bırakılır).
8. Tahliyeden sonra `00-durum.md` hâlâ 200 satırı aşıyor.

Tahliye, kapsam daralması ve bir ölçümün bu patch'i çürütmesi DUR sebebi değildir: raporla, devam et.
