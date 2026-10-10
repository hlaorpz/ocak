# CC BRIEF 2 · Kart basıcı, derleyiciye gündüz ön ayarı, kayıt mailine paylaşım kartı

**Tarih:** 9 Ekim 2026 · **Yazan:** Claude.ai · **Uygulayan:** CC · **Tür:** kod; üç ayrı iş, üç ayrı commit

Kart derleyicinin kaynağını bu oturumda okumadım (korpusta servis edilmiyor). Bu yüzden brief ölçümle başlar ve her işin başında bir DUR kapısı vardır. Belirsiz yerde uydurma; dur ve raporla.

## Bağlam

Kart derleyici gündüz kartı basamıyor (Kaan, 9 Ekim). Aradaki boşluğu Claude.ai tarafında yazılan bağımsız bir Python betiği kapattı: `araclar/ocak_kart.py`. Kırk dört kart onunla basıldı. Hedef: (A) betik depoya girsin, (B) asıl derleyici gündüz ön ayarı kazansın, (C) kayıt onay maili paylaşım kartı taşısın.

## İş A · `ocak_kart.py` depoya girer

Kaynak dosyalar BRIEF 1'de açılan yerde: `/tmp/ocak-pazarlama-v2/ocak-pazarlama-v2/araclar/` ve `…/ornekler/`. Basılı kartlar ayrı zip'te: `~/Desktop/ocak-hazir-kartlar-2026-10-10.zip` (44 JPG).

**ADIM 0**

```bash
cd ~/Desktop/hlaorpz/ocak
git status --short                    # kirliyse DUR
ls scripts | head -40
python3 --version
python3 -c "import PIL, numpy; print(PIL.__version__, numpy.__version__)"   # yoksa raporla
ls marka 2>/dev/null; find . -iname '*isaret*' -not -path './node_modules/*' | head
```

**Yazım**

1. `araclar/ocak_kart.py` → `scripts/ocak_kart.py`; `araclar/kartlari_bas.py` → `scripts/kartlari_bas.py`; `araclar/fonts/` → `scripts/fonts/` (beş TTF: Cormorant Garamond Italic, Medium Italic, Light, Regular; Jost Regular. İkisi de SIL Open Font License; lisans metinlerini `scripts/fonts/` altına ekle).
2. Betikteki font yolu betiğin kendi klasörüne göreli mi, ölç; değilse göreli yap.
3. **İşaret:** betik bugün işareti Cormorant Garamond Light "O" harfiyle temsil ediyor. Depoda işaretin tek renk SVG ya da PNG sürümü varsa (ADIM 0) onu bağla: açık zeminde köz `#C44B2F`, koyu zeminde krem `#F2EAE2` (kural: `marka-isaret-kunyesi.md`). Dosya yoksa "O" kalır; raporla.
4. **Görseller.** `ornekler/` içindeki iki JPG ve kart zip'indeki 44 JPG depo kökünde yeni bir klasöre girer: `pazarlama-gorsel/ornekler/` ve `pazarlama-gorsel/hazir-kartlar/`. `docs/` altına konmaz (korpus envanteri metin sayar). Dosya sayısını komutla say ve raporla (`ls pazarlama-gorsel/hazir-kartlar | wc -l` → 44). Depoda büyük ikili dosya için ayrı bir kural (ör. LFS, `.gitignore`) varsa ona uy ve raporla.
5. Deneme: aşağıdaki üç komut hatasız koşmalı ve üç dosya üretmeli.

```bash
python3 scripts/ocak_kart.py --zemin kirec --metin "Küllenen şey|*sönmüş* değildir." --cikti /tmp/t1.jpg
python3 scripts/ocak_kart.py --zemin gece --metin "09:05|*Bir dakika duruyoruz.*" --bant "10 Kasım" --cikti /tmp/t2.jpg
python3 scripts/ocak_kart.py --zemin toprak --oran 9:16 --metin "Bir akşamlığına|*gel.*" --cikti /tmp/t3.jpg
```

**DUR:** Pillow ya da numpy yok ve kurulum Kaan'ın onayını gerektiriyor; `scripts/` altında aynı adlı dosya var.

**Commit:** `feat(scripts): gündüz kart basıcı (ocak_kart.py)`

## İş B · Kart derleyiciye gündüz ön ayarı

> **10 Ekim güncellemesi: iş Claude.ai tarafında yapıldı, CC yerleştirir.** Kaan derleyicinin HTML dosyasını sohbete verdi; gündüz ışığı eklendi ve pakete kondu: `araclar/OCAK-kart-derleyici.html`. Eklenenler: `S.tema` (gece/gündüz) ve "Işık" seçici; `RENKLER`'e toprak, zeytin, keten; metin rengine kömür, toprak, zeytin; gündüzde vurgu toprak, örtüler (karartma, kenar, perde) krem tonlu, görselsiz zemin krem; açık zeminde tek renk köz işaret (gömülü SVG'den türetildi, kor katmanı çıkarıldı); üç gömülü ön ayar ("Gündüz · söz kartı", "Gündüz · davet kartı", "Gündüz · story 9:16"); tema taşımayan eski ön ayarlar gece sayılır. İşaretin iki SVG'si: `araclar/isaret/`. Kurucu kare: `araclar/zemin/gunduz-kurucu.png`.
> **CC'nin işi:** depodaki derleyiciyi bul, bu dosyayla `diff` al; depodaki sürüm Kaan'ın verdiğinden yeniyse DUR ve farkı raporla, değilse dosyayı yerine koy. Gece yolunda kod değişmedi (yalnız örtü rengi değişkene alındı); grain rastgele olduğu için piksel karşılaştırması Claude.ai tarafında ÖLÇÜLMEDİ, CC grain 0 ile önce/sonra karşılaştırsın. Aşağıdaki adımlar bu dosya yerleştirilemezse geçerlidir.

**ADIM 0 (salt-read; raporla, sonra dur ve Kaan'a göster)**

```bash
grep -rIl "kart" tools scripts src 2>/dev/null | grep -iv node_modules | head -40
```

Derleyicinin dosyasını bul; şunları raporla: dil ve bağımlılık; mevcut ön ayarların adı ve alanları (metin rengi, vurgu, kenar karartma, grain, işaret, alt bant); zemin seçme ölçütleri (`31-zemin.md`: üstKaranlık, ton, luma); bekleyen commit'lenmemiş değişiklik var mı (devir notu: "kart derleyici değişikliğinin commit'i").

**Yazım (ADIM 0 raporundan ve Kaan'ın onayından sonra)**

Yeni ön ayar: `gunduz`.

| Alan | Değer |
|---|---|
| Metin | Kömür `#1A1210` |
| Vurgu kelimesi | Toprak `#B4654A` |
| Küçük satır, alt bant | Kömür, %70 opaklık; ya da Zeytin `#6E7453` (yalnız 24 pikselden büyük metinde) |
| İşaret | Tek renk köz `#C44B2F` |
| Kenar karartma | Kapalı |
| Grain | Açık, tek katman |
| Koyu düz zemin varyantı | `toprak` `#B4654A` ve `zeytin` `#6E7453`: metin ve işaret krem |
| Altın `#D4A855` | Gündüz ön ayarında metin rengi olarak yok (krem üstünde kontrast 1,9) |

Gündüz zemini kabul ölçütleri (öneri; ilk üretimde kalibre edilir, hepsi oran):

| Ölçüt | Tanım | Eşik |
|---|---|---|
| üstAçık | Üst %60'ta ortalama luma | 170–225 |
| patlama | Luma 245 üstü piksel oranı | %1'in altı |
| gölge | Luma 90 altı piksel oranı | %3–%20 |
| ton | Doygun piksellerin medyan hue'su | 25°–45° |

Ölçütler `31-zemin.md`'ye "gündüz" başlığıyla eklenir (içerik silinmez; ekleme). Gece ön ayarlarına dokunulmaz.

**DUR:** derleyici bulunamıyor; ön ayar yapısı bu tablonun alanlarını karşılamıyor; gece çıktısı değişiyor (aynı girdiyle önce/sonra piksel farkı sıfır olmalı).

**Commit:** `feat(kart): gündüz ön ayarı`

## İş C · Kayıt onay mailine paylaşım kartı

**ADIM 0**

Kayıt onay şablonunun dosyasını ve gönderen kodu bul (Resend; KARAR 606, 608). Şablonun bugünkü gövdesini raporla. Mailin ek ya da gömülü görsel taşıyıp taşıyamadığını ölç.

**Yazım**

Şablonun sonuna tek satır ve bağlantı:

```
İstersen bunu paylaş: "Pazartesi akşamı bir mum yakıyorum."
```

Bağlantı, sitede barınan 9:16 karta gider (kartı `ocak_kart.py` basar; gün adı etkinlikten gelir). Ek dosya gönderilmez (teslim edilebilirlik). Metin Kaan'ın onayından geçer; `ocak-lint` koşar.

**DUR:** şablon Notion'dan besleniyor ve kodda değil; görsel barındırma yolu belirsiz; mail "kayıt" sözünü yeniden taşımaya başlıyor (8 Ekim ölçümü: taşımıyor).

**Commit:** `feat(mail): kayıt onayına paylaşım kartı bağlantısı`

## Kapanış (her iş için ayrı)

```bash
npm test 2>/dev/null | tail -3
git log -3 --oneline
```

Kronolojiye her iş için tek satır (ne ölçüldü, ne değişti, commit). Push Kaan'ın onayıyla.

## Kapsam dışı

- Sitenin gündüz teması (`STRATEJI/site-uyarlama.md`): fikir aşamasında; karar ve ayrı brief ister. Bu brief siteye tema yazmaz.
- Kayıt formuna "nereden duydun" alanı ve doğum yılı: ayrı iş; önce formun bugünkü alanları ölçülür.
