# CC BRIEF — ADIM 5: `docs/skills/` DOĞUŞU + `skill-sync.sh` + B42

**Sahip:** CC
**Ön koşul:** çalışma ağacı temiz, `main`, ADIM 4 kapalı
**Kapsam:** Dört commit. Site kodu yok — `scripts/site-icerik-dump.mjs` tek kod dokunuşu ve build'e girmez.

Yanında: **`ek-karar-473.tsv`** (ledger satırı — sekmeler orada, bu markdown'dan kopyalama)

Bu brief kendi kendine yeterlidir. Repo yolu: `~/Desktop/hlaorpz/ocak-site-clone`.

---

## 0. NEDEN

`00-durum.md:62` dönem HEAD'i **`f42911f`** yazıyor. Gerçek HEAD **`76e8bee`**. Yani
`00-durum.md` bayat bir HEAD taşıyor.

Bu sapma, kuralın yazıldığı gün doğdu. `03-sira.md:93-96` (BAKIM KURALI, KARAR 468):
*"dönem HEAD satırı patch'in son bölümünde güncellenir — ortada yazılırsa sonraki
bölümlerin commit'leri onu geçer ve satır doğduğu anda bayatlar."*

Kural doğru, ama kuralı uygulayacak bir mekanizma yoktu. `ocak-arsivci` o mekanizmadır.
Aynı şekilde `ocak-teshis` "kod var ≠ output var" refleksini, `ocak-lint` marka dili
denetimini dosyada yaşatır — üçü de bugüne kadar sohbetten sohbete sözlü taşınıyordu.

**Bu brief HEAD satırını düzeltmez.** Düzeltme, patch'in son bölümünde ölçülerek
yapılır (Bölüm 5) — kuralın kendisi bu turda ilk kez tatbik edilir.

---

## 1. ADIM 0 — SALT-READ (KARAR 355)

Hiçbir şey yazma. Ölç, raporla, **DUR**, onay bekle.

```bash
cd ~/Desktop/hlaorpz/ocak-site-clone || { echo "DİZİN YOK — dur, raporla"; exit 1; }

git status --porcelain                       # boş olmalı
git rev-parse --abbrev-ref HEAD              # main
git log -1 --format='%h %cI %s'              # tırnak şart, boru yok

# hedefler henüz yok olmalı
test -e docs/skills        && echo "docs/skills VAR — DUR"
test -e .claude/skills     && echo ".claude/skills VAR — DUR"
test -e scripts/skill-sync.sh && echo "skill-sync.sh VAR — DUR"

# ledger ve tavan
wc -l docs/01-kararlar.tsv                   # 473 olmalı (472 veri + başlık)
grep -c -P '^473\t' docs/01-kararlar.tsv     # 0 olmalı
wc -l docs/00-durum.md                       # 151 olmalı, tavan 200

# .gitignore çapaları — SATIR NUMARASINI SEN DOĞRULA
grep -n '^\.claude/$'            .gitignore  # 33 bekleniyor
grep -n '^ocak-site-icerik\.md$' .gitignore  # 42 bekleniyor

# B42 envanteri
ls -la ocak-site-icerik.md docs/ocak-site-icerik.md 2>&1
md5 -q ocak-site-icerik.md docs/ocak-site-icerik.md 2>/dev/null \
  || md5sum ocak-site-icerik.md docs/ocak-site-icerik.md
git ls-files ocak-site-icerik.md docs/ocak-site-icerik.md   # ikisi de BOŞ dönmeli
grep -n "OUT_PATH" scripts/site-icerik-dump.mjs             # 23 bekleniyor
```

**Raporun sırası:** ölçüm → envanter → çakışma listesi. Sonra dur.

Sapan varsa uzlaştırma — ikisini de raporla (KARAR 102). Özellikle `.gitignore`
satır numaraları: bu brief 33 ve 42 bekliyor, ölçüm başka söylerse **brief yanılıyordur.**

---

## 2. COMMIT 1 — `docs/skills/` DOĞAR (üç dizin)

Kanonik kaynak tektir: `docs/skills/` (KARAR 458).

⚠ **Üç dizin açılır, beş değil.** `ocak-kararci` ve `ocak-metin` ADIM 6'ya aittir.
`ocak-notion` geçiş planının tablosunda var ama skill listesinde yok — çözülmemiş
sapma, bu turda **açılmaz**. HEDEF YAPI ağacındaki beşli listeye bakıp fazladan dizin
açma.

```bash
cd ~/Desktop/hlaorpz/ocak-site-clone
mkdir -p docs/skills/ocak-arsivci docs/skills/ocak-teshis docs/skills/ocak-lint
```

### 2.1 `docs/skills/ocak-arsivci/SKILL.md`

```bash
cd ~/Desktop/hlaorpz/ocak-site-clone
cat > docs/skills/ocak-arsivci/SKILL.md << 'SKILLEOF'
---
name: ocak-arsivci
description: OCAK doküman patch'ini uygular ve commit'ler. docs-patch-YYYY-AA-GG.md geldiğinde, sohbet sonu patch'i uygulanacağında, ya da docs/ altındaki 00-durum · 01-kararlar · 02-borclar · 03-sira · 90-kronoloji dosyalarına yazım yapılacağında açılır. Kod dosyalarına dokunmaz.
---

# ocak-arsivci

Sohbet sonu patch'ini uygular. Yalnız `docs/` altında çalışır; `src/`, `scripts/`,
`public/` bu skill'in kapsamı dışındadır.

## Beş bölüm, bağlayıcı sıra (KARAR 468)

1. `00-durum.md` — hedefli blok değişimi, tam yeniden yazım değil
2. `01-kararlar.tsv` — append + durumu değişen satırların yeni hali
3. `02-borclar.md` — kapanan / açılan
4. `90-kronoloji/YYYY-AA.md` — append
5. `03-sira.md` — kuyruk, biten `✅`, yeni iş

**Sıra bağlayıcıdır ve gerekçesi rakamlardır.** Rakam taşıyan her satır — dönem HEAD,
satır sayısı, commit sayısı, dosya boyutu — **en son ölçülür** (KARAR 470). Ortada
yazılan rakamı sonraki bölümlerin commit'leri geçer; satır doğduğu anda bayatlar.

*Vaka: ADIM 4 patch'i `00-durum.md`'ye `f42911f` yazdı, tur `76e8bee` ile kapandı.
Kural o gün yazılmıştı, mekanizma yoktu.*

## ADIM 0 — önce oku (KARAR 355)

`00-durum.md`'ye yazmadan önce dosyanın beklenen hâlde olduğunu doğrula: çapa var mı,
tek mi, satır sayısı patch'in varsaydığı gibi mi. Kronoloji append-only olduğu için
orada çakışma yoktur — ADIM 0 oraya uygulanmaz.

## Çapa disiplini (KARAR 465, 472)

- Çapa **tek satırdan** alınır ve dosyada **benzersiz** olmalıdır.
- Blok-sonu dizeleri, girintili satırlar, birden çok yerde geçen ifadeler çapa olamaz.
- Çapa tutmuyorsa **durmak doğru reflekstir**, hata değil.
- `#kNNN` çapası madde başlığına çözülür (`- **KARAR NNN — BAŞLIK (DURUM):**`),
  literal dizeye değil. Kronolojiye eklenen her `#kNNN` için o başlık satırı da eklenir.

## Ledger bütünlüğü — her yazımdan sonra

```bash
cd ~/Desktop/hlaorpz/ocak-site-clone
awk -F'\t' 'NF!=6' docs/01-kararlar.tsv | wc -l                      # 0
awk -F'\t' 'NR>1{print $1}' docs/01-kararlar.tsv | sort | uniq -d    # boş
awk -F'\t' 'NR>1{print $4}' docs/01-kararlar.tsv | sort -u           # 9 değerin alt kümesi
awk -F'\t' 'NR>1 && $6==""' docs/01-kararlar.tsv | wc -l             # 0
```

`durum` enum **dokuz** değerdir (KARAR 456):
`AKTIF · KALICI · SUPERSEDE · ONERI · IPTAL · ACIK-BORC · TEYITSIZ · KULLANILMADI · REZERVE`.
Geçiş planının gövdesi yedi sayar — **plan bayattır, ledger esastır.**

`kaynak` sütunu zorunludur ve iki meşru biçimi vardır (KARAR 466):
`#kNNN` elle doğrulanmış çapa · `dosya.md:NNNN` mekanik işaretçi.
**Mekanik dönüşüm `#k` üretemez** — `#k` tanımı gereği elle doğrulanmıştır.

## Kapanış doğrulaması — atlanamaz

```bash
cd ~/Desktop/hlaorpz/ocak-site-clone
wc -l docs/00-durum.md                                    # ≤200 (KARAR 457)
git log -1 --format='%h'                                  # HEAD
grep -n 'dönem HEAD' docs/00-durum.md                     # satırdaki hash ile karşılaştır
```

**HEAD satırı tutmuyorsa commit'leme, raporla.** Bu skill'in var olma sebebi budur.

## KIRPMA YASAĞI (KARAR 61)

İçerik silinmez, kırpılmaz, sadeleştirilmez — yalnız **taşınır** ya da **dönüştürülür**.
Patch modu ekleme ve değiştirme yapar; çıkarma yapmaz. `00-durum.md` tavanı aşarsa en
eski dönem bloğu kronolojiye **iner**, silinmez. Birleştirme yeniden yazımdır, ayrı
karar ister.

## Commit

Ayrı konu = ayrı commit. Mekanik dönüşüm ile semantik iş asla aynı commit'te olmaz.
Patch tek konuysa tek commit meşrudur. `--no-ff` merge kararı Kaan'ındır.

Uygulama bitince `.claude/notes.md`'ye brief adı + madde durumları + commit hash'leri
yazılır.

## DUR koşulları

1. Çapa bulunamıyor ya da birden çok kez geçiyor
2. Patch'in beyan ettiği satır sayısı dosyanın gerçeğiyle tutmuyor
3. `00-durum.md` 200 satırı aşacak
4. Mükerrer karar numarası
5. `durum` dokuz değerin dışında
6. `kaynak` boş
7. Kapanışta HEAD satırı `git log -1` ile tutmuyor
SKILLEOF
wc -l docs/skills/ocak-arsivci/SKILL.md
```

### 2.2 `docs/skills/ocak-teshis/SKILL.md`

```bash
cd ~/Desktop/hlaorpz/ocak-site-clone
cat > docs/skills/ocak-teshis/SKILL.md << 'SKILLEOF'
---
name: ocak-teshis
description: OCAK sitesinde kod/layout/CSS teşhisi yapar. Bir şeyin "çalışmadığı", "görünmediği", "tutmadığı" söylendiğinde, bir fix uygulanmadan önce, ya da layout/dikey-ritim/genişlik şikayetlerinde açılır. Teşhisi dist/ çıktısından ve computed CSS'ten kurar, kaynak dosyadan değil.
---

# ocak-teshis

Teşhis eder, düzeltmez. Çıktısı bir rapordur; fix ayrı karardır.

## Birinci kural: "kod var" ≠ "output var"

Teşhis dosyadaki koda **dayanmaz**. `npm run build` sonrası gerçek `dist/` çıktısına
dayanır (KARAR 355). `ocak-site-icerik.md` dump'ı insan referansıdır; Kaan Notion'da
değişiklik yapınca geride kalır ve iki kez yanlış teşhise yol açtı.

**Sessiz fakirleşme en tehlikeli hata tipidir** — site "bozulmaz", özellik sessizce
düşer ve haftalarca fark edilmez.

```bash
cd ~/Desktop/hlaorpz/ocak-site-clone
npm run build
grep -rn "ARANAN" dist/ | head
```

## İkinci kural: statik CSS analizi yetmez (KARAR 419)

`.liste` / layout / dikey ritim / genişlik dokunuşlarında Chrome bağlanır ve
**computed CSS'ten** konuşulur. Statik analiz bu projede tekrar tekrar yanıldı:
merdiven px'i, başlık ortalama, kapalı öğe yüksekliği, section-arası boşluk — her
seferinde DevTools computed değeri kaynağı kesinleştirdi.

Bir CSS fix "tutmuyorsa" ve semptom tuhafsa: **önce DOM geçerliliğini sorgula.**
`<summary>` içindeki geçersiz `<h3>` üç tur CSS'e direndi çünkü sorun stil değildi.

## Üç katmanlı keşif (KARAR 137/138/140)

`grep` ile dosya okumak yetmez:

1. `dist` HTML'den gerçek DOM markup — element tipi (`p` mi `h2` mi), class ne taşıyor
2. Hangi CSS kuralları match ediyor + specificity hesabı
3. Hangisi yutuyor / hangisi hiç match etmiyor

DOM ölçümü ≠ render pixel. Görsel/tonal şikayette DOM rect tek başına yetmez.

## Bilinen sessiz kırılma yüzeyleri

- **`atmosfer.css:1538-1552` genişlik kolonu** (KARAR 427) — yeni CTA/kart section
  buraya eklenmezse baseline prose (38rem) alır, geniş çıkar. Dört selektör.
- **`[class^="ocak-"]` prefix-match** (KARAR 375) — `ocak-` ilk class değilse baseline
  sessizce düşer. Class attribute VALUE'sunun baştan eşleşmesi gerekir, word-match değil.
- **Notion marker sözleşmesi** (KARAR 409) — marker adı `splitBodyByMarkers` listesi
  veya plugin switch case'iyle eşleşir. Ad değişimi component'i render dışı bırakır.
  Yeni ad icat edilmeden önce hangi kapıya düştüğü teyit edilir.
- **`overflow: hidden` vs `clip`** (KARAR 372) — `hidden` görsel kırpar, layout
  extent'i korur; `clip` extent'i siler. `body { overflow-x: hidden }` zoom-out
  koruması **değildir**. Yatay taşma metriği:
  `documentElement.scrollWidth − documentElement.clientWidth`
  (`− innerWidth` mobil emülasyonda yalancı 0 verir).
- **Build-time tarih TZ'si** (KARAR 385) — SSG build UTC'dir. `new Date()` + `setHours`
  TR 00:00–03:00'te gün kaydırır. `Intl.DateTimeFormat('en-CA', {timeZone:'Europe/Istanbul'})`
  + leksikografik string-gün.
- **Client-safe ↔ server-only sınırı** (KARAR 394) — client `<script>`'in import ettiği
  modül `astro:content` çekerse Vite onu client bundle'a çeker.

## Rapor biçimi

**ölçüm → envanter → çakışma listesi → DUR.**

Ölçülemeyen rakam yazılmaz (KARAR 470). Her rakamın yanına üretim yöntemi: eşik, araç,
kaynak kümesi. Türkçe metinde `awk length` **bayt** sayar — uzunluk ölçümü `python3` ile.

Emüle mobil metrik gerçek cihazı temsil etmez. **Test-yeşili ≠ göz-temiz.**
Nihai teyit gerçek iPhone Safari'dedir ve otomatikleşmez.
SKILLEOF
wc -l docs/skills/ocak-teshis/SKILL.md
```

### 2.3 `docs/skills/ocak-lint/SKILL.md` + `yasak-dizeler.tsv`

Bu skill **iki artefakt** taşır. Gerekçe: yargı katmanı grep'lenemez, mekanik katman
prose içinde yaşayamaz — KARAR 466'nın ayrımının aynısı.

```bash
cd ~/Desktop/hlaorpz/ocak-site-clone
cat > docs/skills/ocak-lint/SKILL.md << 'SKILLEOF'
---
name: ocak-lint
description: OCAK marka dili denetimi. Kamuya çıkacak metin üretildiğinde (Notion sayfa gövdesi, caption, story, bülten, kanal mesajı) yayınlanmadan önce, ya da mevcut site metninde dil kalıntısı aranırken açılır. İki yüzeyde çalışır: dosyada grep, üretilen metinde yargı.
---

# ocak-lint

## KAPSAM — önce bu

Lint **yalnız kamuya çıkan üretilmiş metni** denetler: Notion sayfa gövdesi, caption,
story, bülten, WhatsApp kanal mesajı, site kopyası.

**Kapsam dışı:** iç dokümanlar (`10-marka.md`, `20-ref-*`, ledger, borçlar, brief,
kronoloji), kod yorumları, commit mesajları.

Bu ayrım şart, çünkü iç dokümanlar yasak kalıpları **bilerek** taşır. Örnek:
`10-marka.md:107` OCAK WAY ilkesi olarak "OCAK bilgi vermez" yazar; KARAR 442 o kalıbı
site metninde yasaklar. Çelişki değil — marka dosyası v1.4 notu doktrinin marka
çekirdeğine girmediğini açıkça söyler. Kapsamsız bir lint bunu ihlal sanır.

## İKİ YÜZEY

| | CC yüzeyi | Claude.ai yüzeyi |
|---|---|---|
| Girdi | dosya (dump, markdown) | henüz yayınlanmamış üretilen metin |
| Yöntem | `yasak-dizeler.tsv` üzerinden grep | aşağıdaki yargı listesi |
| Çıktı | eşleşme raporu, satır numaralı | düzeltme önerisi, ESKİ→YENİ |

### CC yüzeyi

```bash
cd ~/Desktop/hlaorpz/ocak-site-clone
while IFS=$'\t' read -r dize tip kapsam karar istisna oneri; do
  [ "$dize" = "dize" ] && continue
  n=$(grep -c -i -- "$dize" "$HEDEF" 2>/dev/null || true)
  [ "$n" -gt 0 ] && printf '%s\t%s\t%s\t%s\n' "$n" "$dize" "$karar" "$oneri"
done < docs/skills/ocak-lint/yasak-dizeler.tsv
```

Eşleşme **ihlal değil, incelenecek adaydır.** `istisna` sütunu okunmadan rapor yazılmaz.

⚠ Taze dump şartı (KARAR 439): nokta patch'te dump **zorunludur**. Dump'sız denetim
sayfanın eski hâline bakar — kalkmış bir section'a patch önerir, taşınmış cümleye
ekleme yapar.

### Claude.ai yüzeyi — yargı listesi

Grep'lenemeyen, okunarak denetlenen kurallar:

**Tekrar disiplini (KARAR 403).** Her fikir **tek evde** gövdeleşir; diğer yerlerde tek
cümle + köprü linki. Zamanlama taahhütleri özellikle tek eve çekilir — tarih kayarsa
dört yerde eskimesin.

**İmza eksenleri (KARAR 404).** Üç imza cümlesi farklı eksenlerde çalışır ve üçü de
yaşar: home manifestosu = *değişim reddi*, footer imzası = *bağımlılık reddi*,
`/felsefe` varyantı = *götürme reddi*. **Eksen başına tek ev.** "Geldi gibi" hissinin
kaynağı aynı eksenin ikinci kopyasıdır.

**Portre dili (KARAR 441/402).** Okuyucuya yaşamadığı geçmiş atfedilmez. Güvenli kipler:
şimdiki hâl tarifi, üçüncü tekil portre, davet geleceği. Okuyucuya dönüş yalnız koşullu
"Sonraki adım" satırında.

**Vurgu yerleştirme (KARAR 400).** Vurgu bloğu için yeni cümle **yazılmaz** — gövdedeki
zirve cümle bulunur, yükseltilir, kaynağından silinir (kopya bırakılmaz). Vurgu tanım
bölümünü mühürler, katalog/kararı açar; vurgudan sonra açıklama paragrafı gelmez.

**Vurgu tipi (KARAR 401).** ALTIN = yüksek enerji ilan. KREM `ic-ses` = akış ortası
nefes. Üçleme yapıları ve imza-varyantı cümleler `ic-ses` alır.

**Liste vs karşılaştırma (KARAR 446).** Bullet yalnız kısa tek-satır serilerde. Gövdesi
olan yapı → bold-açılışlı paragraf. **İki öğeli karşılaştırma asla bullet değil.**

**İnkâr-eden-kelime paradoksu (KARAR 448).** İnkâr eden kelime kavramı odaya sokar —
kelimeyi tamamen çıkar. "sınav havasında değil" → sil. Reddeden değil yol tarif eden dil.
*İstisna:* üçlü karşıtlık pozitife çözülüyorsa ("test değil… Bir ayna.") bu bir tanımdır.

**İddia yumuşatma > içerik budama (KARAR 300).** Dürüstlük sorununda çözüm içeriği
silmek değil mutlak iddiayı yumuşatmaktır.

**Nesneleştirme yasağı (KARAR 448).** "kadın X yapsın diye" → sen'li / işlev tarifli.

**Şemsiye sayfa denetimi.** Şemsiye sayfa ürün sayfasına dönüşürken kavram katmanındaki
her somut gerçek (sayı, süre, prosedür, mekân) "bu iki üründe de doğru mu?" testinden
geçer.

**İçerik-sunum sınırı (KARAR 354).** Notion rich text doğal geçer, CSS ezmez. Vurgu ve
renk facilitator'ün Notion kontrolündedir. İçerik tutarsızlığı CSS ile bastırılmaz.

**Elektrik-kesildi standardı (KARAR 449).** Uygulama dosyalarında her alan kelimesi
kelimesine doldurulur ya da `[KAAN]` işaretlenip dosya sonunda tek listede toplanır.
**Boşluk = belirsizlik yasaktır.**

## KORUNACAK İFADELER — değiştirilemez

`10-marka.md` "KORUNACAK İFADELER" bölümündeki on madde birebir korunur. Metni
iyileştirme, kısaltma, modernize etme önerisi getirilmez. Sunum mekaniği değişebilir,
ifade değişmez.

## Brief kapsamı ≠ çelişki kapsamı

Kapsam dışında bulunan bir çelişki **uygulanmaz ama görmezden de gelinmez** —
ESKİ→YENİ patch'i hazırlanıp opsiyonel sunulur, karar brief sahibinindir.
SKILLEOF
wc -l docs/skills/ocak-lint/SKILL.md
```

Şimdi mekanik katman. **Sekmeli dosya** — `printf` ile yazılıyor, boşluk kullanma:

```bash
cd ~/Desktop/hlaorpz/ocak-site-clone
printf '%s\t%s\t%s\t%s\t%s\t%s\n' \
'dize' 'tip' 'kapsam' 'karar' 'istisna' 'oneri' \
'köz' 'kelime' 'kamu metni' '86,453' 'renk adı olarak iç talimatta serbest (köz #C44B2F)' 'sönmeyen kor' \
'@ocak.life' 'handle' 'her yerde' 'marka v1.4' 'yok' '@ocak.biz' \
'Uluslararası Yolculuk' 'ürün adı' 'her yerde' '437' 'yok' 'Dünya Yolculuğu' \
'Bilgi vermeyiz' 'kalıp' 'kamu metni' '442' 'iç doküman (10-marka.md OCAK WAY)' 'Reçete vermeyiz, alan tutarız' \
'bilgi vermez' 'kalıp' 'kamu metni' '442' 'iç doküman' 'reçete vermez' \
'Uzmanlık ayrıcalığı' 'kalıp' 'kamu metni' '442' 'yok' 'Uzmanlık var; kürsü yok' \
'ders anlatan' 'kalıp' 'kamu metni' '442' 'yok' 'Kürsüye çıkan yok' \
'ayda bir' 'sıklık sözü' 'kamu metni' '444' 'yok' 'kaldır — takvim gösterir' \
'ayda iki' 'sıklık sözü' 'kamu metni' '444' 'yok' 'kaldır — takvim gösterir' \
'her ay' 'sıklık sözü' 'kamu metni' '444' 'iç planlama metni' 'kaldır — takvim gösterir' \
'sınav' 'inkâr-eden-kelime' 'kamu metni' '448' 'üçlü karşıtlık pozitife çözülüyorsa' 'cümleyi tamamen çıkar' \
'ulaşılabilir değil' 'reddeden dil' 'kamu metni' '448' 'yok' 'yol tarif eden dile çevir' \
'Kadim Amerika' 'terim' 'kamu metni' '448' 'yok' 'Amerikalar' \
'tek dile getiren' 'tekelci okuma' 'kamu metni' '448' 'yok' 'tek bir dilde buluşturan' \
'sembolik' 'fiyat dili' 'kamu metni' '431' 'yok' 'kaldır — fiyat sayfada geçmez' \
'funnel' 'pazarlama terimi' 'her yerde' '57' 'yok' 'kaldır' \
'conversion' 'pazarlama terimi' 'her yerde' '57' 'yok' 'kaldır' \
'lead' 'pazarlama terimi' 'her yerde' '57' 'İngilizce kod tanımlayıcısı' 'kaldır' \
'gücü yetmeyenler' 'aşağılayıcı çerçeve' 'kamu metni' '435' 'yok' 'erişim adaleti dilinden kur' \
'aynı deneyim online' 'yanlış eşitleme' 'kamu metni' '435' 'yok' 'Aynı eşikler. Orada bedenle, burada sesle.' \
'büyümek' 'wellness kelimesi' 'kamu metni' '312' 'somut bağlamda (kohort büyüklüğü)' 'markanın kendi cümlesinden kur' \
'genişlemek' 'wellness kelimesi' 'kamu metni' '312' 'yok' 'markanın kendi cümlesinden kur' \
'#FFFFFF' 'renk' 'her yerde' 'marka görsel kimlik' 'yok' 'krem #F2EAE2' \
'Kaan' 'isim' 'site sayfası' '89' 'iç doküman, brief, ledger' 'kaldır — site sayfalarında görünmez' \
> docs/skills/ocak-lint/yasak-dizeler.tsv

awk -F'\t' 'NF!=6' docs/skills/ocak-lint/yasak-dizeler.tsv | wc -l   # 0 olmalı
wc -l docs/skills/ocak-lint/yasak-dizeler.tsv                        # 25 (başlık + 24)
```

### 2.4 Commit 1

```
docs(skills): docs/skills kanonik kaynağı doğdu — arsivci · teshis · lint

Üç skill, kanonik kaynak tek (KARAR 458). ocak-kararci ve ocak-metin ADIM 6'ya
ait, açılmadı; ocak-notion HEDEF YAPI tablosunda var listede yok — çözülmemiş
sapma, bu turda açılmadı.

ocak-arsivci: beş bölümlü patch (KARAR 468), bölüm sırası bağlayıcı, rakam
taşıyan satırlar en son ölçülür (KARAR 470). Kapanışta HEAD doğrulaması zorunlu.
ocak-teshis: dist/ + computed CSS (KARAR 355, 419).
ocak-lint: iki artefakt — SKILL.md yargı katmanı, yasak-dizeler.tsv mekanik
katman. Kapsam kuralı: yalnız kamuya çıkan üretilmiş metin.
```

---

## 3. COMMIT 2 — `scripts/skill-sync.sh` + symlink

### Tasarım kararı

`.claude/skills` **symlink**tir, kopya değil. Gerekçe: kopya drift'i *yakalanabilir*
kılar, symlink *imkânsız* kılar. `.claude/` `.gitignore:33` ile ignore edildiği için
symlink versiyonlanmaz — sorun değil, kanonik kaynak zaten `docs/skills/`.

⚠ **Sonuç: `--check`'in kapsamı daralır.** CC yüzeyinde ayrışma mümkün olmadığı için
`--check` yalnız claude.ai zip yüzeyini denetler. Bu bir eksiklik değil, symlink
seçiminin doğal sonucudur.

```bash
cd ~/Desktop/hlaorpz/ocak-site-clone
cat > scripts/skill-sync.sh << 'SYNCEOF'
#!/usr/bin/env bash
# skill-sync.sh — docs/skills (kanonik) → CC yüzeyi (symlink) + claude.ai yüzeyi (zip)
# Kanonik kaynak tektir (KARAR 458). Bu betik dağıtır, üretmez.
set -euo pipefail

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC="$REPO/docs/skills"
LINK="$REPO/.claude/skills"
ZIPDIR="$REPO/docs/_uretilen/skill-zip"

[ -d "$SRC" ] || { echo "HATA: $SRC yok" >&2; exit 2; }

md5f() { md5 -q "$1" 2>/dev/null || md5sum "$1" | cut -d' ' -f1; }

# bir skill dizininin içerik parmak izi (dosya adı + md5, sıralı)
parmak() (
  cd "$1"
  find . -type f ! -name '.DS_Store' | sort | while read -r f; do
    printf '%s  %s\n' "$(md5f "$f")" "$f"
  done
)

skills() { find "$SRC" -mindepth 1 -maxdepth 1 -type d | sort; }

link_kur() {
  mkdir -p "$REPO/.claude"
  if [ -L "$LINK" ]; then
    mevcut="$(readlink "$LINK")"
    [ "$mevcut" = "../docs/skills" ] && { echo "symlink yerinde: .claude/skills → $mevcut"; return; }
    echo "HATA: .claude/skills başka yere bakıyor ($mevcut) — DUR" >&2; exit 3
  fi
  [ -e "$LINK" ] && { echo "HATA: .claude/skills var ve symlink değil — DUR" >&2; exit 3; }
  ln -s ../docs/skills "$LINK"
  echo "symlink kuruldu: .claude/skills → ../docs/skills"
}

zip_uret() {
  mkdir -p "$ZIPDIR"
  n=0
  while read -r d; do
    ad="$(basename "$d")"
    parmak "$d" > "$ZIPDIR/$ad.parmak"
    ( cd "$SRC" && rm -f "$ZIPDIR/$ad.zip" && zip -qr "$ZIPDIR/$ad.zip" "$ad" -x '*.DS_Store' )
    n=$((n+1))
    echo "zip: $ad.zip"
  done < <(skills)
  echo "→ $n skill zip'lendi: $ZIPDIR  (claude.ai'ye ELLE yüklenir)"
}

kontrol() {
  ayrisma=0
  while read -r d; do
    ad="$(basename "$d")"
    p="$ZIPDIR/$ad.parmak"
    if [ ! -f "$p" ]; then
      echo "AYRIŞMA: $ad — zip hiç üretilmemiş, claude.ai yüzeyi kurulmamış"; ayrisma=1; continue
    fi
    if ! diff -q <(parmak "$d") "$p" >/dev/null; then
      echo "AYRIŞMA: $ad — docs/skills değişti, zip bayat"; ayrisma=1
    fi
  done < <(skills)
  # symlink tarafı: ayrışma tanım gereği imkânsız, yalnız varlık denetlenir
  if [ -L "$LINK" ] && [ "$(readlink "$LINK")" = "../docs/skills" ]; then
    echo "CC yüzeyi: symlink yerinde (ayrışma yapısal olarak imkânsız)"
  else
    echo "AYRIŞMA: .claude/skills symlink'i yok ya da yanlış hedefte"; ayrisma=1
  fi
  [ "$ayrisma" -eq 0 ] && echo "ayrışma yok" || exit 1
}

case "${1:-sync}" in
  sync)    link_kur; zip_uret ;;
  link)    link_kur ;;
  zip)     zip_uret ;;
  --check) kontrol ;;
  *) echo "kullanım: skill-sync.sh {sync|link|zip|--check}" >&2; exit 1 ;;
esac
SYNCEOF
chmod +x scripts/skill-sync.sh
```

`.gitignore`'a zip klasörü — `_uretilen/` versiyonlanmış bir üretim arşividir
(KARAR 467a), toptan ignore edilmez; yalnız zip çıktısı düşer:

```bash
cd ~/Desktop/hlaorpz/ocak-site-clone
printf '\n# skill zip çıktısı (skill-sync.sh üretir, claude.ai'"'"'ye elle yüklenir)\n/docs/_uretilen/skill-zip/\n' >> .gitignore
tail -4 .gitignore
```

Koş ve doğrula:

```bash
cd ~/Desktop/hlaorpz/ocak-site-clone
./scripts/skill-sync.sh sync
ls -la .claude/skills                      # symlink → ../docs/skills
head -3 .claude/skills/ocak-arsivci/SKILL.md   # link üzerinden okunabilmeli
./scripts/skill-sync.sh --check            # "ayrışma yok"
git status --porcelain                     # skill-zip/ görünmemeli
```

⚠ **Symlink probe'unun sınırı:** yukarıdaki `head` filesystem düzeyinde çözülmeyi
kanıtlar; Claude Code'un symlink'li skill dizinini **yükleyip yüklemediğini**
kanıtlamaz. O teyit Kaan'ın CC'yi yeniden başlatıp skill'i çağırmasıyla alınır.
Yüklenmiyorsa `link_kur` yerine kopya moduna dönülür — ayrı brief, bu turda değil.

### Commit 2

```
scripts(skills): skill-sync.sh — symlink + zip, --check zip yüzeyini denetler

.claude/skills → ../docs/skills tek symlink. Kopya drift'i yakalanabilir kılar,
symlink imkânsız kılar; ikincisi seçildi. .claude/ gitignore:33 ile ignore, sync
hedefi versiyonlanmıyor — kanonik kaynak zaten docs/skills.

Sonuç: --check yalnız claude.ai zip yüzeyini denetler. CC yüzeyinde ayrışma
yapısal olarak imkânsız.

.gitignore: /docs/_uretilen/skill-zip/ — _uretilen toptan ignore EDİLMEDİ,
dönüşüm betiklerinin versiyonlanması KARAR 467(a) gereği.
```

---

## 4. COMMIT 3 — B42

⚠ **SIRA BAĞLAYICI.** `.gitignore` deseni kök-bağlı yapılırsa `docs/ocak-site-icerik.md`
**izlenir hale gelir** — kalıntı önce silinmezse 146 KB'lık türetilmiş artefakt sessizce
commit'e girer. Adımları karıştırma.

Tüketici taraması ADIM 4'te koşuldu: **kod tüketicisi yok.** Yirmi eşleşmenin hepsi
doküman, kronoloji ya da `.claude/` notu. Yine de aşağıdaki grep koşulur ve raporlanır.

```bash
cd ~/Desktop/hlaorpz/ocak-site-clone

# 1) kalıntıyı sil — ÖNCE
git ls-files docs/ocak-site-icerik.md        # boş olmalı (izlenmiyor)
rm docs/ocak-site-icerik.md
ls docs/ocak-site-icerik.md 2>&1             # No such file

# 2) deseni kök-bağlı yap — SONRA
python3 - << 'PY'
import pathlib
p = pathlib.Path('.gitignore'); t = p.read_text(encoding='utf-8')
eski = '\nocak-site-icerik.md\n'
assert t.count(eski) == 1, 'çapa tek değil — DUR'
t = t.replace(eski, '\n/ocak-site-icerik.md\n/docs/_uretilen/site-icerik.md\n')
p.write_text(t, encoding='utf-8')
print('gitignore güncellendi')
PY
grep -n 'site-icerik' .gitignore

# 3) OUT_PATH taşı + yorum satırını düzelt
python3 - << 'PY'
import pathlib
p = pathlib.Path('scripts/site-icerik-dump.mjs'); t = p.read_text(encoding='utf-8')
a = "const OUT_PATH = join(__dirname, '..', 'ocak-site-icerik.md');"
b = "const OUT_PATH = join(__dirname, '..', 'docs', '_uretilen', 'site-icerik.md');"
assert t.count(a) == 1, 'OUT_PATH çapası tek değil — DUR'
t = t.replace(a, b)
c = ' * Çıktı: repo kökünde ocak-site-icerik.md (Claude.ai tarafında içerik tartışması için).'
d = ' * Çıktı: docs/_uretilen/site-icerik.md (Claude.ai tarafında içerik tartışması için).'
assert t.count(c) == 1, 'yorum çapası tek değil — DUR'
t = t.replace(c, d)
p.write_text(t, encoding='utf-8')
print('OUT_PATH ve yorum güncellendi')
PY
grep -n "OUT_PATH\|Çıktı:" scripts/site-icerik-dump.mjs

# 4) tüketici taraması — rapora yaz, kod eşleşmesi çıkarsa DUR
grep -rn 'ocak-site-icerik' --include='*.mjs' --include='*.js' --include='*.ts' \
  --include='*.astro' --include='*.json' --exclude-dir=node_modules . \
  | grep -v '^./.claude/' || echo "kod tüketicisi yok"

# 5) kök kopya yerinde kalır ve ignore'lu olmalı
git status --porcelain
git check-ignore -v ocak-site-icerik.md
```

⚠ **Kök kopya (`./ocak-site-icerik.md`) silinmez.** Script yeniden koşana kadar tek
canlı dump odur; silmek KIRPMA YASAĞI'nı zorlar. Yeni yol ilk dump'ta doğar, kök kopya
o zaman ayrı bir turda emekliye ayrılır. Bu, B42'nin kapanışına not düşülür.

### Commit 3

```
fix(b42): site-icerik üretim yolu HEDEF YAPI'ya hizalandı

OUT_PATH → docs/_uretilen/site-icerik.md (KARAR 455). Dosya başındaki yorum da
güncellendi — script kendi belgesiyle çelişmez.

docs/ocak-site-icerik.md kalıntısı kaldırıldı (md5 kök kopyayla eşitti, kaynağı
belirsizdi). SIRA: kalıntı önce silindi, sonra desen kök-bağlı yapıldı — ters
sırada 146 KB türetilmiş artefakt izlenir hale gelirdi.

.gitignore: ocak-site-icerik.md → /ocak-site-icerik.md + /docs/_uretilen/site-icerik.md.
Desen artık her derinlikte tutmuyor.

Tüketici taraması: kod tüketicisi yok, eşleşmelerin tamamı doküman/not.
Kök kopya yerinde bırakıldı — script yeniden koşana kadar tek canlı dump.
```

---

## 5. COMMIT 4 — LEDGER · BORÇ · SIRA · KRONOLOJİ

**Bu bölüm en son yazılır ve rakamları burada ölçülür** (KARAR 468, 470).

### 5.1 Ledger — KARAR 473

`ek-karar-473.tsv`'den satırı al, `docs/01-kararlar.tsv` sonuna ekle (`472`'den sonra).
**Satırı bu markdown'dan kopyalama** — sekmeler `ek`'te.

Sonuç: **473 → 474 satır** (`wc -l`).

### 5.2 `docs/02-borclar.md` — B42 kapanışı

Çapa (mevcut tek satır):

```
## B42 — `site-icerik` üretim yolu HEDEF YAPI ile hizasız
```

Bu satırı şununla değiştir:

```
## B42 — `site-icerik` üretim yolu HEDEF YAPI ile hizasız ✅ KAPANDI (8 Ağu, ADIM 5)
```

Ve bölümün sonuna, `- **Kaynak:** ADIM 4 ADIM 0 raporu, Ç1 + Ç2 (8 Ağustos 2026).`
satırının **hemen ardına** ekle:

```markdown
- **Sonuç (8 Ağu, ADIM 5):** `OUT_PATH` → `docs/_uretilen/site-icerik.md` · yorum satırı
  da güncellendi · `docs/ocak-site-icerik.md` kalıntısı kaldırıldı · `.gitignore` deseni
  kök-bağlı (`/ocak-site-icerik.md`) + yeni yol için satır. Tüketici taraması: **kod
  tüketicisi yok**, yirmi eşleşmenin tamamı doküman/kronoloji/`.claude/` notu.
  ⚠ **Kök kopya `./ocak-site-icerik.md` yerinde bırakıldı** — script yeniden koşana kadar
  tek canlı dump; emekliye ayrılması ilk dump'tan sonra ayrı turdur.
  ⚠ **Eylem sırası bağlayıcı çıktı:** kalıntı önce silinir, desen sonra kök-bağlı yapılır.
  Ters sırada 146 KB türetilmiş artefakt izlenir hale gelir. Borç maddesi bu sırayı
  yazmıyordu.
```

Ayrıca `02-borclar.md` sonuna üç yeni borç:

```markdown
## B43 — `10-marka.md` iki ölü Pilot işaretçisi

- [ ] **Sahip:** Claude.ai
- **Sorun:** `10-marka.md:174` ve `:235` hâlâ "Pilot dosyasındaki … bölümüne bak" diyor.
  `ocak-pilot.md` ADIM 3'te dağıtıldı. Satır 9 dağıtımı kabul ediyor, iki gövde satırı
  güncellenmemiş. Hedefler bugün `20-ref-site.md` (site mimarisi tablosu) ve `03-sira.md`
  (sıradaki adımlar).
- **Neden borç:** marka dosyası project files'ta ayna olarak duruyor (KARAR 471); ölü
  işaretçi en çok orada zarar verir — bağlamı olmayan bir sohbet var olmayan dosyayı arar.
- **Kaynak:** ADIM 5 brief hazırlığı, 8 Ağustos 2026.

## B44 — `20-ref-site.md:128` bayat Instagram handle'ı

- [ ] **Sahip:** Claude.ai
- **Sorun:** `@ocak.life` yazıyor. Marka v1.4 (28 Temmuz) handle'ı `@ocak.biz` yaptı.
- **Neden borç:** düşük risk, iç referans. `ocak-lint` yasak-dize listesinin ilk gerçek
  vakası — CC yüzeyinin işe yaradığının kanıtı.
- **Kaynak:** ADIM 5 brief hazırlığı, 8 Ağustos 2026.

## B45 — `baglam.sh:65` bayt/karakter etiketi yanlış

- [ ] **Sahip:** CC
- **Sorun:** `BAYT=$((BAYT+${#l}+1))` ve çıktı `~$BAYT bayt` diyor. Bash `${#l}` UTF-8
  locale'de **karakter** sayar. Türkçe metinde iki rakam ayrışır.
- **Eylem:** ya etiket `karakter` yapılır ya `wc -c` ile gerçek bayt ölçülür. Tek satır.
- **Neden borç:** KARAR 470(b) vakası, ölçüm aracının kendi etiketi yanlış.
- **Kaynak:** ADIM 5 brief hazırlığı, 8 Ağustos 2026.
```

### 5.3 `docs/03-sira.md`

**SIRADAKİ İŞ** bloğunun tamamı (`## SIRADAKİ İŞ` başlığı ile bir sonraki `---` arası)
şununla değişir:

```markdown
## SIRADAKİ İŞ

**B36-a** — karar-listesi deseninin mekanik ölçümü ve aday tablosu. CC, repo.
Brief: `2026-08-08-brief-b36a-donusum.md`. ADIM 5 commit'lerinden sonra koşulur.

⚠ **Ölçüm sonrası kapsam düzeltmesi:** `olcum-2026-08.md` "mekanik `#kNNN` terfisi"
diyor; **KARAR 466 buna izin vermez** — `#k` tanımı gereği elle doğrulanmış çapadır.
Betik `:NNNN` işaretçisini derin satıra taşıyabilir ve aday tablosu üretebilir;
`#k` terfisi elle onaydan geçer.
```

**DOKÜMAN KUYRUĞU** tablosunda 1 numaralı satırı şununla değiştir:

```markdown
| 1 | **ADIM 5** ✅ — `ocak-arsivci` · `ocak-teshis` · `ocak-lint` + `skill-sync.sh` + B42 | CC | repo | — | kapandı 8 Ağu |
```

**BİTENLER** bölümünün başına ekle:

```markdown
- **8 Ağustos — ADIM 5 ✅** (4 commit, sıfır site kodu commit'i)
  `docs/skills/` doğdu — üç skill, kanonik kaynak tek · `skill-sync.sh` symlink+zip,
  `--check` zip yüzeyini denetler · **B42 kapandı** · KARAR 473 mühürlendi ·
  B43 · B44 · B45 açıldı. → `90-kronoloji/2026-08.md`
```

### 5.4 `docs/90-kronoloji/2026-08.md` — APPEND

Dosya sonuna:

```markdown

---

## ADIM 5 — SKILL KADROSU (8 Ağustos 2026)

`docs/skills/` doğdu. Üç skill: `ocak-arsivci` (patch uygular, commit'ler),
`ocak-teshis` (dist/ + computed CSS), `ocak-lint` (iki yüzey). `ocak-kararci` ve
`ocak-metin` ADIM 6'ya bırakıldı; `ocak-notion` HEDEF YAPI tablosunda var, skill
listesinde yok — çözülmemiş sapma, bu turda açılmadı.

**Skill'in doğuş gerekçesi ölçüldü.** `00-durum.md:62` dönem HEAD'i `f42911f`
yazıyordu, gerçek HEAD `76e8bee`. `03-sira.md` BAKIM KURALI bu sapmayı tam olarak
tarif ediyor ve kural dün yazılmıştı — eksik olan kuralı uygulayacak mekanizmaydı.
`ocak-arsivci`'nin kapanış doğrulamasında HEAD karşılaştırması zorunlu madde oldu.

**`ocak-lint` iki artefakt taşıyor.** `SKILL.md` yargı katmanı (tekrar disiplini, imza
eksenleri, portre dili, vurgu yerleştirme — grep'lenemez, okunur), `yasak-dizeler.tsv`
mekanik katman (24 dize, `dize · tip · kapsam · karar · istisna · oneri`). Ayrım
KARAR 466'nın elle/mekanik ayrımının aynısıdır. **Kapsam kuralı** skill'in ilk maddesi
oldu: lint yalnız kamuya çıkan üretilmiş metni denetler, iç dokümanı değil. Gerekçe
ölçüldü: `10-marka.md:107` OCAK WAY ilkesi olarak "OCAK bilgi vermez" yazar, KARAR 442
o kalıbı site metninde yasaklar — çelişki değil, kapsam farkı; kapsamsız lint bunu
ihlal sanardı.

**B42 kapandı.** Eylem sırası bağlayıcı çıktı: kalıntı önce silinir, `.gitignore` deseni
sonra kök-bağlı yapılır — ters sırada `docs/ocak-site-icerik.md` izlenir hale gelirdi.
Borç maddesi bu sırayı yazmıyordu. Tüketici taraması kod tüketicisi bulmadı.

**Yan bulgular:** B43 (`10-marka.md`'de iki ölü Pilot işaretçisi), B44
(`20-ref-site.md:128` bayat `@ocak.life`), B45 (`baglam.sh:65` bayt/karakter etiketi).
B44 lint'in yasak-dize listesinin ilk gerçek vakasıdır.

- **KARAR 473 — SKİLL SENKRON SÖZLEŞMESİ (KALICI):** Kanonik skill kaynağı
  `docs/skills/`tir (KARAR 458). CC yüzeyi **tek symlink**tir: `.claude/skills →
  ../docs/skills`. Gerekçe: kopya drift'i *yakalanabilir* kılar, symlink *imkânsız*
  kılar. `.claude/` `.gitignore`'da olduğu için sync hedefi versiyonlanmaz — kanonik
  kaynak zaten repodadır. **Sonuç: `skill-sync.sh --check` yalnız claude.ai zip
  yüzeyini denetler**; CC yüzeyinde ayrışma yapısal olarak imkânsızdır. Zip çıktısı
  `docs/_uretilen/skill-zip/` altında yaşar ve ignore'lanır; `_uretilen/` toptan ignore
  **edilmez** — dönüşüm betiklerinin versiyonlanması KARAR 467(a) gereğidir. İki
  yüzeyli skill (`ocak-lint`) yargı katmanını `SKILL.md`'de, mekanik katmanı ayrı veri
  dosyasında tutar. İlişki: `←458 · ↔463`.

**Sıfır site kodu commit'i.** Tek kod dokunuşu `scripts/site-icerik-dump.mjs`
(`OUT_PATH` + yorum satırı), build'e girmez.
```

### 5.5 Rakamları ŞİMDİ ölç ve `00-durum.md`'yi yaz

```bash
cd ~/Desktop/hlaorpz/ocak-site-clone
git log -1 --format='%h'          # bu turun HEAD'i — aşağıdaki satıra BUNU yaz
wc -l docs/01-kararlar.tsv docs/00-durum.md
```

`00-durum.md`'de üç hedefli değişim:

**(a)** Çapa: `**Son güncelleme:** 8 Ağustos 2026 · **ADIM 4 ✅** · KARAR 469 · 470 · 471 · 472 mühürlendi`
→ `**Son güncelleme:** 8 Ağustos 2026 · **ADIM 5 ✅** · KARAR 473 mühürlendi`

**(b)** Çapa (`ADIM 5 ⏭` ile başlayan iki satır) — şununla değiştir:

```markdown
- **ADIM 5 ✅** — `ocak-arsivci` · `ocak-teshis` · `ocak-lint` doğdu; `skill-sync.sh`
  symlink+zip (KARAR 473). B42 kapandı. `ocak-notion` sapması çözülmedi.
- **ADIM 6 ⏭** — `ocak-kararci` · `ocak-metin`. Kadro tanımı KARAR 458;
  `ocak-metin` taslak-only, en az üç ay (KARAR 459).
```

**(c)** Çapa: `| \`main\` dönem HEAD | **\`f42911f\`**` ile başlayan satır — `f42911f`
yerine yukarıda ölçtüğün hash. **Bu satır patch'in son yazımıdır.**

Sonra tavanı doğrula:

```bash
cd ~/Desktop/hlaorpz/ocak-site-clone
wc -l docs/00-durum.md            # ≤200
```

### Commit 4

```
docs(adim5): ledger 473 + B42 kapanışı + B43/B44/B45 + sıra + kronoloji

KARAR 473 — skill senkron sözleşmesi. Kanonik docs/skills, CC yüzeyi symlink,
--check zip yüzeyini denetler.

B42 ✅ kapandı. B43 (10-marka ölü Pilot işaretçileri), B44 (20-ref-site bayat
handle), B45 (baglam.sh bayt/karakter etiketi) açıldı.

00-durum.md dönem HEAD satırı bu commit'ten önce ölçüldü — KARAR 468'in bölüm
sırası ilk kez tatbik edildi. Önceki tur f42911f yazmış, tur 76e8bee ile
kapanmıştı.
```

---

## 6. DOĞRULAMA

```bash
cd ~/Desktop/hlaorpz/ocak-site-clone

# skills
ls -1 docs/skills                                   # tam 3 dizin
test -f docs/skills/ocak-lint/yasak-dizeler.tsv && echo ok
awk -F'\t' 'NF!=6' docs/skills/ocak-lint/yasak-dizeler.tsv | wc -l   # 0
head -2 docs/skills/ocak-arsivci/SKILL.md           # --- ve name:
for f in docs/skills/*/SKILL.md; do
  head -1 "$f" | grep -q '^---$' || echo "FRONTMATTER YOK: $f"
done

# sync
./scripts/skill-sync.sh --check                     # ayrışma yok
readlink .claude/skills                             # ../docs/skills
git status --porcelain                              # skill-zip görünmemeli

# B42
grep -c '^/ocak-site-icerik\.md$' .gitignore        # 1
grep -c '^/docs/_uretilen/site-icerik\.md$' .gitignore   # 1
test -e docs/ocak-site-icerik.md && echo "KALINTI DURUYOR — DUR"
grep -c "docs', '_uretilen', 'site-icerik.md'" scripts/site-icerik-dump.mjs   # 1

# ledger + tavan
wc -l docs/01-kararlar.tsv                          # 474
grep -c -P '^473\t' docs/01-kararlar.tsv            # 1
awk -F'\t' 'NF!=6' docs/01-kararlar.tsv | wc -l     # 0
awk -F'\t' 'NR>1{print $1}' docs/01-kararlar.tsv | sort | uniq -d   # boş
awk -F'\t' 'NR>1{print $4}' docs/01-kararlar.tsv | sort -u          # ≤9 değer
wc -l docs/00-durum.md                              # ≤200

# HEAD tutarlılığı — bu turun asıl testi
git log -1 --format='%h'
grep 'dönem HEAD' docs/00-durum.md

# build kirlenmedi mi
npm run build >/dev/null && echo "build yeşil"
git status --short
```

Sapan varsa **commit'leme, raporla.**

---

## 7. DUR NOKTALARI

1. `docs/skills`, `.claude/skills` ya da `scripts/skill-sync.sh` zaten varsa
2. Ledger `473` satırı zaten varsa, ya da satır sayısı `473` değilse
3. `.gitignore` ölçülen satır numaraları 33 / 42 değilse — **brief yanılıyordur**
4. `.gitignore` ya da `site-icerik-dump.mjs` çapası tek değilse (python `assert` durur)
5. `docs/ocak-site-icerik.md` **git tarafından izleniyorsa** (`git ls-files` boş dönmezse)
6. Tüketici taramasında **kod** eşleşmesi çıkarsa
7. `00-durum.md` çapalarından biri bulunamaz ya da birden çok kez geçerse
8. `00-durum.md` 200 satırı aşarsa
9. `skill-sync.sh --check` ayrışma raporlarsa
10. `npm run build` kırmızıysa

---

## 8. BUNDAN SONRA

**Kaan tarafında bir teyit var:** CC yeniden başlatılıp bir skill çağrılarak symlink'in
gerçekten yüklendiği doğrulanmalı. Filesystem çözülmesi bu brief'te kanıtlandı, skill
yükleme kanıtlanmadı.

**Zip'ler claude.ai'ye elle yüklenir** — `docs/_uretilen/skill-zip/*.zip`. Sürümlenmez
(KARAR 458 tablosu), ayrışma `--check` ile yakalanır.

Sıradaki iş `docs/03-sira.md`'nin en üstünde: **B36-a**, CC, repo.
Brief: `2026-08-08-brief-b36a-donusum.md`.

**Not düşüldü, çözülmedi:** `ocak-notion` sapması (HEDEF YAPI tablosunda var, skill
listesinde yok) · B40 (`00-durum.md:6` hâlâ "KARAR 61/88" diyor, `CLAUDE.md` 61 diyor) ·
B41 · B01 (klon adlandırma; `.claude/settings.local.json:135` hâlâ eski mutlak yolu
taşıyor, `.claude/` versiyonlanmadığı için bu turda dokunulmadı).
