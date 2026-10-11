# DOCS PATCH · 11 Ekim 2026 (b) · Kart derleyici v4 turu

**Yazan:** Claude.ai (Midjourney / gündüz zeminleri sohbeti, ikinci yarı). **Uygulayan:** CC, `ocak-arsivci` ile.

## SIRA

`CC-BRIEF-kart-derleyici-v4.md` uygulanıp **commit'lendikten sonra** koşar. Çalışma ağacı temiz olmalı. Tek commit.

Korpus bu patch'ten önce şunları biliyor (ölçüm: Railway MCP, HEAD `49eb2ad`, 11 Eki): z12–z15 ve istemleri · derleyici v2–v3 kanonik (KARAR 652) · gündüz kuralları KARAR 653 (vurgu `#A04F36`, işaret %20 büyük, kalınlaştırılmaz) · `ocak_kart.py` depoya girmez (654–655) · B235 · B236. Şunları bilmiyor: derleyicinin Kaan'ın elinde ilk sınaması · işaretin gece boyuna dönüp kalınlaştığı · vurgunun `#B4401F` olduğu · 9:16'da bloğun yukarı çıktığı · v4 ile yeniden basılan altı kart · ön ayarların nerede yaşadığı · iki koşulmamış istem.

---

## ADIM 0

```bash
cd ~/Desktop/hlaorpz/ocak
git log --oneline -6
git status --short                                                    # kirliyse DUR
git log --oneline -1 -- tools/ocak-kart-derleyici.html                # derleyici v4 commit'i → <DC>
grep -c 'imzaKalin' tools/ocak-kart-derleyici.html                    # 12; 0 ise DUR (v4 commit'lenmemiş)
grep -c 'B4401F' tools/ocak-kart-derleyici.html                       # 1
wc -l docs/00-durum.md                                                # yazımda 189
awk -F'\t' 'NR>1{print $1}' docs/01-kararlar.tsv | sort -n | tail -1  # son KARAR (yazımda 655)
awk -F'\t' '$1==653{print $4" | "$5}' docs/01-kararlar.tsv            # AKTIF | ↔637 · ↔652
node scripts/baslik-denetim.mjs ; echo "denetim: $?"                  # 0 değilse DUR
grep -c '^\*\*Son güncelleme:\*\*' docs/00-durum.md docs/02-borclar.md docs/03-sira.md        # üçü de 1
grep -c '^| `main` dönem HEAD |' docs/00-durum.md                                              # 1
grep -c '^## BU DÖNEM NE OLDU$' docs/00-durum.md                                               # 1
grep -c '^- \*\*Bağ:\*\* B234 · KARAR 652 · 653$' docs/02-borclar.md                           # 1
grep -c '^\*\*Sıradaki iş (gündüz görselleri, 11 Eki):\*\*' docs/03-sira.md                    # 1
grep -c '^\*\*Sıradaki iş (kartlar ve gönderiler' docs/03-sira.md                              # 0
grep -c '^> \*\*11 Ekim 2026 — mühürlendi (KARAR 650)' docs/pazarlama/GORSEL-gunduz-paleti-ve-MJ.md docs/pazarlama/DEVIR-gunduz-zeminleri-midjourney.md   # ikisi de 1
grep -c '^## KOŞULMAMIŞ İSTEMLER' docs/31-zemin.md                                             # 0
grep -c '^## GÜNDÜZ ZEMİNLERİ (10–11 Ekim 2026)$' docs/31-zemin.md                             # 1
ls pazarlama-ekler/kartlar-2026-10-11-derleyici-v4 2>/dev/null | wc -l                         # 0 (klasör yok)
ls ~/Desktop/hazir-kartlar/*-kirec-*.jpg ~/Desktop/hazir-kartlar/*-kalem-*.jpg | wc -l         # 6
for f in ~/Desktop/hazir-kartlar/*-kirec-*.jpg ~/Desktop/hazir-kartlar/*-kalem-*.jpg; do
  cmp -s "$f" "pazarlama-ekler/kartlar-2026-10-11-derleyici/$(basename "$f")" && echo "AYNI: $f"
done                                                                                           # çıktı boş olmalı; "AYNI" varsa DUR (masaüstündeki kart hâlâ v3)
ls ~/Desktop/OCAK-v4-teslim/v4-karsilastirma.jpg ~/Desktop/OCAK-v4-teslim/v4-kirmizi-adaylari.jpg   # ikisi de var
```

⚠ Altı kartın md5'i bu patch'e **yazılmadı**: Claude.ai'nin masaüstü köprüsü JPG dosyasının kabını yeniden yazıyor, md5 değişiyor, pikseller aynı kalıyor (ölçüm: iki dosya geri okunup PIL `ImageChops.difference(...).getbbox()` → `None`, 11 Eki). Kapı yukarıdaki `cmp` döngüsüdür.

Yer tutucular — değerleri ADIM 0'dan gelir, patch'e sabit yazılmadı:

| Yer tutucu | Değer |
|---|---|
| `<DH>` | `git log -1 --format='%h'` (yazımdan önceki HEAD; derleyici v4 commit'i olmalı) |
| `<ESKI-DH>` | `00-durum.md`'de `| `main` dönem HEAD |` satırının başındaki kalın hash |
| `<DC>` | derleyici v4 commit'inin kısa hash'i |
| `<K1>` · `<K2>` | son KARAR + 1 · + 2 (ikisi de boş olmalı) |

Bu patch borç **açmaz ve kapatmaz**. Sayımlardan biri tutmuyorsa DUR.

---

## 1 · `docs/00-durum.md`

**1a · Başlık.** `**Son güncelleme:**` ile başlayan satırın tamamı:

```
**Son güncelleme:** 11 Ekim 2026 · **Kart derleyici v4 turu** · dönem HEAD `<DH>`
```

**1b · Dönem HEAD satırı.** `| `main` dönem HEAD |` ile başlayan satırın **tamamını birebir** kronoloji kaydındaki `### Tahliye` başlığının altına taşı (KARAR 61). Yerine:

```
| `main` dönem HEAD | **`<DH>`** (11 Eki, kart derleyici v4 turu — bir önceki dönem `<ESKI-DH>`) — canlı HEAD değil, dönemin son commit'i · kapanış commit'inden bir önceki (KARAR 474). **Canlı HEAD üretilendir** → `docs/04-olcum.md` (KARAR 580). ⚠ **Bu dönem KOD içerdi:** `<DC>` (`tools/ocak-kart-derleyici.html` — derleyici v4). `<ESKI-DH>..<DH>` aralığının tam listesi `90-kronoloji/2026-10.md` 11 Eki v4 kaydında. Önceki dönemin (`<ESKI-DH>`) satırı `90-kronoloji/2026-10.md`'ye indi (KARAR 61) |
```

**1c · `## BU DÖNEM NE OLDU`.** Başlığı izleyen boş satırdan sonra, mevcut ilk maddenin üstüne:

```
- **11 Ekim — Kart derleyici v4 turu:** kod `<DC>`. Kaan derleyiciyi ilk kez tarayıcıda denedi; üç şey düzeldi: gündüz işareti gece boyuna döndü ve açık zeminde yarım kademe kalın · gündüz vurgusu `#B4401F` · 9:16'da blok yukarıda, gece dahil (**KARAR <K1> · <K2>**; KARAR 653 → SUPERSEDE). Altı kart v4 ile yeniden basıldı. Kaan kartları artık derleyiciyle kendi basıyor. ⚠ `ocak-kart` skill'i hâlâ eski basıcıyı anlatıyor (**B235**). → `90-kronoloji/2026-10.md`
```

**Tavan.** Net etki +1 satır (yazımda 189 → 190). Yazımdan sonra 200'ü aşıyorsa `## BU DÖNEM NE OLDU` bölümünün son maddesini birebir kronoloji kaydındaki `### Tahliye` başlığının altına taşı.

---

## 2 · `docs/01-kararlar.tsv`

**2a · KARAR 653 SUPERSEDE.** Yalnız `durum` ve `iliski` sütunları değişir; öbür dört sütuna dokunma (`<K1>` yerine numarayı koy):

```bash
perl -pi -e 'if(/^653\t/){ s/\tAKTIF\t↔637 · ↔652\t/\tSUPERSEDE\t↔637 · ↔652 · →<K1>\t/ }' docs/01-kararlar.tsv
awk -F'\t' '$1==653{print $4" | "$5}' docs/01-kararlar.tsv            # SUPERSEDE | ↔637 · ↔652 · →<K1>
```

**2b · Sona iki satır** (TAB ayraçlı, altı sütun):

```
<K1>	2026-10-11	Gündüz kartında metin Kömür, vurgu `#B4401F`; işaret tek renk köz, gecedeki boyunda, açık zeminde yarım kademe kalın; açık zeminde yazı bir kademe kalın (500); fotoğrafta krem perde; toprak ve zeytin zeminde metin, işaret ve bant krem, vurgu yok, işaret kalınlaştırılmaz	AKTIF	←653 · ↔637 · ↔652	2026-10.md#k<K1>
<K2>	2026-10-11	9:16 kartta blok (işaret, metin, bant) kartın ortasında değil yukarısında durur — metin kaydırma −0,07; gece ve gündüzde aynı ön ayar	AKTIF	↔652 · ↔<K1>	2026-10.md#k<K2>
```

İki satır yargıdır; metni değiştirme. Gerekçeler kronoloji kaydında.

---

## 3 · `docs/02-borclar.md`

**3a · Başlık.** `**Son güncelleme:**` ile başlayan satırın tamamı:

```
**Son güncelleme:** 11 Ekim 2026 · **Kart derleyici v4 turu**
```

**3b · B235'e ek.** `- **Bağ:** B234 · KARAR 652 · 653` satırının hemen **altına** ekle (mevcut satırlar değişmez; borç açık kalır):

```
- **11 Eki, v4 turu:** derleyicinin gündüz değerleri değişti — vurgu `#B4401F`, işaret gece boyunda ve açık zeminde yarım kademe kalın (KARAR <K1>; 653 SUPERSEDE). (2)'deki satırlar düzeltilirken hedef bu değerlerdir. `pazarlama-ekler/kartlar-2026-10-11-derleyici/` içindeki altı kart v3 biçiminde kaldı; v4 baskıları `pazarlama-ekler/kartlar-2026-10-11-derleyici-v4/`. Kaan artık kartları derleyiciyle kendi basıyor; (1) kapanana kadar `ocak-kart` skill'inin komutlarıyla kart **basılmaz**. Kapanış şartı değişmedi.
```

---

## 4 · `docs/03-sira.md`

**4a · Başlık.** `**Son güncelleme:**` ile başlayan satırın tamamı:

```
**Son güncelleme:** 11 Ekim 2026 · **Kart derleyici v4 turu**
```

**4b · Yeni paragraf.** `**Sıradaki iş (gündüz görselleri, 11 Eki):**` ile başlayan paragrafın **üstüne**, ardında bir boş satırla:

```
**Sıradaki iş (kartlar ve gönderiler, 11 Eki — v4 turundan sonra):** Kaan kartları derleyiciyle kendi basıyor (`tools/ocak-kart-derleyici.html`, v4, KARAR <K1> · <K2>). Akış: Işık → Kart → Zemin → görseli sürükle → metin (`*vurgu*`) ve alt bant → kart adı → "4:5 + 9:16 birlikte indir" (`<ad>-4x5.png` · `<ad>-9x16.png`). Yeni Claude.ai sohbeti **gönderi ve görsellerle** açılır. Hazır kartlar, v4 biçiminde: Küllenen (z15) · Bir Saat (z14) · Fatma Aliye K1 (z13) — `pazarlama-ekler/kartlar-2026-10-11-derleyici-v4/`. ⚠ `ocak-kart` skill'i hâlâ Python basıcıyı anlatır (**B235**); kart o komutlarla basılmaz. ⚠ Kullanıcının kaydettiği ön ayarlar tarayıcının `localStorage`'ında yaşar (anahtar `ocak-kart-onayar`), dosyada değil: başka tarayıcıda ve başka makinede görünmez, taşımak için İnce ayar'daki JSON kutusu kullanılır. Herkes için kalıcı olması istenen ayar gömülü ön ayara eklenir (kod işi). ⚠ Derleyici yazı tiplerini Google Fonts'tan çeker; bağlantısız basılan kartta yazı tipi yanlış çıkar. Kalan zeminler aşağıdaki paragrafta; zeytin gölgesi ve çanak istemleri `31-zemin.md` → **KOŞULMAMIŞ İSTEMLER**.
```

**4c · Mevcut paragrafa ek.** `**Sıradaki iş (gündüz görselleri, 11 Eki):**` ile başlayan paragrafın **sonuna** (son noktadan sonra, aynı satırda) ekle; paragrafın mevcut metni değişmez:

```
 **11 Eki, v4:** o klasördeki altı kart v3 biçiminde kaldı; güncel baskılar `pazarlama-ekler/kartlar-2026-10-11-derleyici-v4/` (KARAR <K1>).
```

---

## 5 · `docs/31-zemin.md` — dosya sonuna append (öncesinde bir boş satır)

````
## KOŞULMAMIŞ İSTEMLER (11 Ekim 2026)

İkisi de **hiç koşulmadı**; ilk tur kanaryadır. G2 gövdesinin kalıbıyla ve KARAR 651'in iki kuralıyla yazıldı (`--sw 25` · gölgesi istenen istemin `--no` listesinde gölge kelimesi yok). Seçim kaynak dosyadan ölçülür (yukarıdaki gündüz ölçütleri). ⚠ Claude.ai bu iki istemin ilk hâlini 11 Ekim sohbetinde vermişti; o metin sohbetin bağlam sıkıştırmasında kayboldu, buradaki hâl aynı kurallarla yeniden yazıldı.

G4 — zeytin dalı gölgesi (`1014-O`, 14 Ekim):

```
soft shadow of an olive branch falling across a sunlit limewashed wall, late morning, bright warm cream plaster with fine trowel texture, soft-edged leaf shadows in the lower third only, upper two thirds evenly sunlit and empty, pale cream and warm sand tones, fine film grain --ar 4:5 --style raw --v 8.1 --stylize 70 --chaos 5 --sref https://cdn.midjourney.com/f683971a-a55b-41f1-94ce-3d73a9d7646a/0_2.png --sw 25 --no pure white, blown highlights, window frame, cross, yellow cast, mustard, blue tones, teal, grey light, pink, lilac, flowers, people, faces, text, watermark
```

G5 — tek nesne, çanak (`1017-O` kapağı, 17 Ekim):

```
a small rough unglazed clay bowl resting on a limewashed ledge, the wall behind in full even morning sun, bright warm cream plaster, upper two thirds of the frame evenly sunlit and empty, only a short soft shadow beside the bowl, pale cream and warm sand tones, coarse film grain --ar 4:5 --style raw --v 8.1 --stylize 80 --chaos 5 --sref https://cdn.midjourney.com/f683971a-a55b-41f1-94ce-3d73a9d7646a/0_2.png --sw 25 --no pure white, blown highlights, cross, crucifix, window frame, blue tones, teal, grey light, flowers, people, faces, text, watermark
```

Story için aynı istemler `--ar 9:16`. Sabah masası, eşik ve boş minder istemleri yazılmadı; `docs/pazarlama/GORSEL-gunduz-paleti-ve-MJ.md` içindeki D3 ve D4 gövdeleri `--sw 25` ile duruyor ama KARAR 651'in `--no` kuralından geçirilmedi.
````

---

## 6 · `docs/pazarlama/` — iki işaret

`docs/pazarlama/GORSEL-gunduz-paleti-ve-MJ.md` ve `docs/pazarlama/DEVIR-gunduz-zeminleri-midjourney.md` dosyalarının **ikisinde de**, `> **11 Ekim 2026 — mühürlendi (KARAR 650)` ile başlayan satırın hemen **altına** şu iki satırı ekle (mevcut satır değişmez):

```
>
> **11 Ekim 2026, v4 turu — vurgu `#B4401F` oldu (KARAR <K1>; 653 SUPERSEDE).** İşaret gecedeki boyunda, açık zeminde yarım kademe kalın; 9:16'da blok yukarıda (KARAR <K2>). Yukarıdaki satırın `#A04F36`'sı tarihçedir.
```

---

## 7 · Korpus dışı ekler — v4 kartları ve iki karşılaştırma görseli

```bash
mkdir -p pazarlama-ekler/kartlar-2026-10-11-derleyici-v4
cp ~/Desktop/hazir-kartlar/*-kirec-*.jpg ~/Desktop/hazir-kartlar/*-kalem-*.jpg pazarlama-ekler/kartlar-2026-10-11-derleyici-v4/
cp ~/Desktop/OCAK-v4-teslim/v4-karsilastirma.jpg ~/Desktop/OCAK-v4-teslim/v4-kirmizi-adaylari.jpg pazarlama-ekler/kartlar-2026-10-11-derleyici-v4/
ls pazarlama-ekler/kartlar-2026-10-11-derleyici-v4 | wc -l            # 8
```

`pazarlama-ekler/kartlar-2026-10-11-derleyici-v4/00-NOT.md` adıyla şu dosyayı yaz:

```
# Derleyici v4 ile basılan gündüz kartları (11 Ekim 2026)

Altı kart, `tools/ocak-kart-derleyici.html` v4 ile (KARAR <K1> · <K2>), Claude.ai'de başsız tarayıcıda basıldı. Kaan v4'ü tarayıcıda kendi denedi ve onayladı; bu altı dosyaya ayrıca bakmadı.

| Dosya | Zemin | Ayar |
|---|---|---|
| `1010-O-soz-kullenen-kirec-4x5.jpg` · `-9x16.jpg` | z15 | Gündüz · Söz kartı / Story · varsayılan |
| `1011-A-bir-saat-kirec-4x5.jpg` · `-9x16.jpg` | z14 | Gündüz · Söz kartı / Story · alt bant |
| `1012-O-fatma-aliye-k1-kalem-4x5.jpg` · `-9x16.jpg` | z13 | Gündüz · Söz kartı (metin kaydır 0.04) / Story (varsayılan −0.07, yatay kaydır −0.34) |

Aynı adların v3 baskıları `kartlar-2026-10-11-derleyici/` içindedir: işaret %20 büyük ve ince, vurgu `#A04F36`, story bloğu ortada.

İki karşılaştırma görseli:
- `v4-karsilastirma.jpg` — soldan sağa: 4:5 gece · 4:5 gündüz · 9:16 gece · 9:16 gündüz (dördü v4) · en sağda v3'ün 9:16'sı.
- `v4-kirmizi-adaylari.jpg` — kireç zeminde dört vurgu adayı (`#A04F36` · `#B4401F` · `#A8371C` · `#9E3319`), sol üstte gece kartı, sağ altta `#B4401F` z12'de.
```

`pazarlama-ekler/kartlar-2026-10-11-derleyici/00-NOT.md` dosyasının **sonuna** (öncesinde bir boş satır) şu satırı ekle; mevcut içerik değişmez:

```
**11 Eki, v4 turu:** bu klasördeki altı kart v3 biçimindedir ve yayınlanmaz; güncel baskılar `../kartlar-2026-10-11-derleyici-v4/` (KARAR <K1>).
```

---

## 8 · Üretilen dosya

```bash
node scripts/durum-uret.mjs      # 04-olcum.md; elle düzenlenmez
```

---

## 9 · `docs/90-kronoloji/2026-10.md` — sona append

`<…>` alanları ADIM 0 ölçümlerinden doldurulur. Ölçülemeyen alan boş bırakılır.

```
## 2026-10-11 — kart derleyici v4 turu · KARAR <K1>–<K2> · B açılan — / kapanan — · HEAD <DH>

⚠ **Saat notu:** tur Kaan'ın yerel saatiyle 11 Eki 09:45–10:40'ta koştu (UTC+8); UTC'de 11 Eki 01:45–02:40. Aynı sohbetin devamıdır (bir önceki kayıt: gündüz görselleri ve kart derleyici v2 turu). Başsız tarayıcı ölçümleri Claude.ai'nindir; Kaan'ın ekranı kapalı yüzeydir (dört kart dosyası ve sözle bildirdi) — CC doğrulamaya çalışmaz.

### Önceki turun kapanış teyidi

CC'nin dört commit'i (`4886492` · `d3162ef` · `e1ade66` · `ad00f1f`) ve mikro patch (`49eb2ad`) Railway MCP'den okundu: `docs_envanter` HEAD önce `ad00f1f`, sonra `49eb2ad`; iki bayat dize canlı korpusta 0 (`docs_ara`, Claude.ai, 11 Eki). Railway'de "Deploy latest commit" gerekmedi; auto-deploy çekti (CC raporu).

### Elle sınama ve üç şikâyet

Kaan v3'ü ilk kez tarayıcıda denedi (z15, "İçindeki ateş sönmedi. / Üstü küllendi sadece.", alt bantlı) ve dört kart gönderdi. Sözü: *"gece -gündüz yapınca tepe yazı kayıyor, logo çok büyük gördüğüm, hem o büyüyünce aşağı kayıyor olabilir. aynı zamanda ben logonun azıcık gözükmesini istedim hani yarım bold gibi? derleyici tam olmamış. 9x16 olan fazla aşağıda kalıyor yazı, içme sinmedi."* Ardından: *"kireç üzeri bizim kırmızı renk güçsüz geliyor, daha etkili hale, siyah üzerine kor rengine yakın etki yaratacka hale getirebilir miyz?"*

- **Kayma teşhisi (koddan):** işaret metnin üstünde durur ve yüksekliği metnin başlangıcına eklenir (`imzaYuk`); KARAR 653'ün %20 büyütmesi bunu 1080 × 0,014 × 688/708 ≈ 14,7 px artırıyordu. v4'te gece ve gündüzde ilk metin satırının üst kenarı: 4:5'te 331 ve 329 px, 9:16'da 803 ve 802 px (yöntem: basılan PNG'de satır satır eşikleme — gecede luma>185, gündüzde luma<80; z02 ve z15 zemin).
- **KARAR <K1> — GÜNDÜZ KARTININ RENK VE İŞARET KURALLARI, 653'ÜN HALEFİ (AKTIF):** 653'ten iki şey değişti. (a) İşaret %20 büyütülmez; gecedeki boyunda kalır ve açık zeminde yarım kademe kalın basılır. Uygulama: tek renk işaretin SVG'sine aynı renkte kenar çizgisi, `stroke-width` 10 (708'lik çizim ızgarasında); 8, 12 ve 16 da basıldı, 10 seçildi (Claude.ai; Kaan sonucu görüp *"bu hali ile ilerleyeyim"* dedi). Toprak ve zeytin zeminde ve gece işaretinde kalınlaştırma yok. Kaydırıcı: İnce ayar → "İşaret kalınlığı (gündüz)". (b) Vurgu `#A04F36` → `#B4401F`. 653'ün öbür hükümleri (metin Kömür · yazı 500 · krem perde · koyu düz zeminde krem ve vurgusuz) aynen sürer.
- **Düzeltilen yanılgı (işaret):** bir önceki turda Claude.ai künyenin "harf ağırlığı aynıdır — kalınlaştırma yok" cümlesini kart işaretine uyguladı ve bu yüzden kalınlaştırmak yerine büyüttü. O cümle künyede **favicon kesimi** için yazılmış (`20-ref-marka.md:436`: "Favicon kesiminde **harf ağırlığı aynıdır** — kalınlaştırma yok"; ölçüm: `docs_ara`, HEAD `49eb2ad`); künyenin *Yapılmaz* listesinde ağırlık yok. Kaan ilk günden kalınlaşmayı sormuştu. ⚠ Kalın işaret künyenin "Cormorant Garamond Light" tanımından bir sapmadır; yalnız kart derleyicinin açık zeminine özgüdür, logo dosyaları değişmedi.
- **Vurgu ölçümleri** (WCAG kontrast oranı; zemin rengi basılan zeminlerin metin bandı ortalaması; doygunluk HLS):

  | Renk | krem | keten | z14 | z15 | z13 | doygunluk | ton |
  |---|---|---|---|---|---|---|---|
  | `#A04F36` (653) | 4.8 | 3.6 | 3.7 | 4.0 | 2.8 | %50 | 14° |
  | `#B4401F` (<K1>) | 4.8 | 3.6 | 3.7 | 3.9 | 2.8 | %71 | 13° |
  | köz `#C44B2F` | 4.0 | 3.0 | 3.1 | 3.3 | 2.3 | %61 | 11° |

  Gecenin köz vurgusu kömürde 3.9. Yeni renk kontrastı **değiştirmedi**; değişen doygunluk. Teşhis: eski renk yeterince koyuydu ama soluk ve kahveye yakındı. `#A8371C` ve `#9E3319` de basıldı (daha koyu, şaraba dönüyor); Kaan *"önerin ne"* dedi, Claude.ai `#B4401F` önerdi, Kaan *"ok"* dedi. İşaret rengi (tek renk köz) değişmedi.
- **KARAR <K2> — 9:16'DA BLOK YUKARIDA (AKTIF):** `F4 story · 9:16` gömülü ön ayarında `metinKaydir` 0 → −0,07. Ölçüm (z15, alt bantlı, işaret üstü → bant altı): v3 770–1232 px, merkez %52,1 → v4 641–1091 px, merkez %45,1. Ön ayar gece ile ortaktır; **gece story de aynı kadar yukarı çıktı** — yalnız gündüz kaldırılsaydı gece ↔ gündüz kayması bu kez 9:16'da olurdu (KARAR 652). Kaan'a bildirildi, itiraz etmedi.
- **Gece çıktısı:** v3 (md5 `3e6cf041…`) ile v4 (md5 `0661af10…`) on altı durumda karşılaştırıldı (`Math.random` sabit; `canvas.toDataURL` → PNG → numpy `abs(A-B)`). Gece, story dışı dokuz durumda farklı piksel **0**; gece story iki durumda farklı (bilerek); gündüz beş durumda farklı (bilerek). ⚠ Bir koşuda "F1 fotoğraf" 1.450.147 farklı piksel verdi; aynı çift iki kez daha koşuldu, ikisinde de 0 — 7 MB'lık zemin 450 ms'de yüklenmeyince bir taraf glow zemine düşmüştü (test kusuru, derleyici değil). ⚠ Claude.ai sohbette bu sayıyı önce "10 karşılaştırma" diye söyledi; doğrusu dokuz.
- **Biçim hafızası:** Kaan elle sınadı (söz kartı ↔ story, kendi ayarlarıyla), *"hafıza da ok"*. Başsız koşuda da tuttu; ikili indirme 1080×1350 ve 1080×1920 iki dosya verdi.
- **Ön ayarlar nerede yaşar:** Kaan sordu. Tarayıcının `localStorage`'ında (anahtar `ocak-kart-onayar`, v4 dosyasında satır 1316–1334); HTML dosyası değişmez. Dosya yoluna bağlı davranışı ölçülmedi.
- **iPhone:** derleyici telefonda denenmedi ve denenmesi gerekmiyor — masaüstü aracı, sitede yayınlanmıyor (depoda `public/tools` yok; ölçüm: Kaan'ın diski, 11 Eki). Telefonda bakılacak olan basılan karttır; Kaan bunu bildirmedi.
- ⚠ **Teslim kazası:** Claude.ai vurguyu değiştirdikten sonra masaüstündeki `OCAK-kart-derleyici-v4.html` yaklaşık on iki dakika (yerel 10:16–10:28) bir önceki ara sürümde kaldı (md5 `5e82931d…`, vurgu `#A04F36`); köprü aynı teslim yolundaki eski kopyayı yazmıştı. Kaan'ın onayı ve hafıza sınaması bu dosyadaydı; yeni kırmızıyı derleyicide değil karşılaştırma görselinde gördü. Dosya düzeltildi ve cihazdan ölçüldü (md5 `0661af10…`, `B4401F` 1 kez). İki ara sürüm arasındaki fark yalnız vurgu rengi ve iki ipucu metnidir.

### Basılan kartlar

Altı kart v4 ile yeniden basıldı: `pazarlama-ekler/kartlar-2026-10-11-derleyici-v4/` (içindeki `00-NOT.md`; iki karşılaştırma görseli aynı klasörde). v3 baskıları `kartlar-2026-10-11-derleyici/` içinde duruyor, notuyla işaretlendi (KARAR 61).

### Koşulmamış iki istem

Zeytin dalı gölgesi (G4) ve çanak (G5) `31-zemin.md`'ye girdi. Sohbetteki ilk metinleri bağlam sıkıştırmasında kayboldu; aynı kurallarla yeniden yazıldı. Hiçbiri koşulmadı.

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
awk -F'\t' '$1==653{print $4}' docs/01-kararlar.tsv                  # SUPERSEDE
grep -c '^## KOŞULMAMIŞ İSTEMLER' docs/31-zemin.md                   # 1
grep -rc 'vurgu `#B4401F` oldu' docs/pazarlama | grep -v ':0$' | wc -l   # 2
```

**Commit:**

```bash
git add docs/00-durum.md docs/01-kararlar.tsv docs/02-borclar.md docs/03-sira.md docs/04-olcum.md docs/31-zemin.md docs/90-kronoloji/2026-10.md docs/pazarlama pazarlama-ekler/kartlar-2026-10-11-derleyici pazarlama-ekler/kartlar-2026-10-11-derleyici-v4
git commit -m "docs: kart derleyici v4 turu — KARAR <K1>–<K2> · 653 SUPERSEDE · v4 kartları · G4–G5 istemleri"
```

**Commit'ten sonra:**

```bash
git log -2 --format='%h' | tail -1       # 00-durum.md'deki dönem HEAD (<DH>) ile eşit olmalı
```

Tutmuyorsa raporla; geriye dönük düzeltme commit'i atma. Kaan push'u onayladıysa: `npx vitest run` ve `npm run build` temizse push; `docs_envanter` HEAD'ini yaz.

---

## DUR KOŞULLARI

1. Çalışma ağacı kirli, ya da derleyici v4 commit'lenmemiş (`imzaKalin` sayısı 0).
2. ADIM 0'daki çapa sayımlarından biri beklenenden farklı.
3. `baslik-denetim.mjs` sıfır dönmüyor.
4. `<K1>` ya da `<K2>` numarası dolu; ya da KARAR 653'ün durumu `AKTIF` değil.
5. `cmp` döngüsü "AYNI" yazdı (masaüstündeki kartlar v3), ya da altı kart / iki karşılaştırma görseli masaüstünde yok.
6. `kartlar-2026-10-11-derleyici-v4/` klasörü zaten var, ya da `31-zemin.md`'de `KOŞULMAMIŞ İSTEMLER` bölümü zaten var.
7. Elle rakam yazma isteği doğuyor (ölçülemeyen alan boş bırakılır).
8. Tahliyeden sonra `00-durum.md` hâlâ 200 satırı aşıyor.

Tahliye, kapsam daralması ve bir ölçümün bu patch'i çürütmesi DUR sebebi değildir: raporla, devam et.
