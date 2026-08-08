# CC BRIEF — B44-a: `yasak-dizeler.tsv` KAPSAM ÇELİŞKİSİ

**Sahip:** CC
**Ön koşul:** `origin/main` = `4ecdfe3`, tree temiz
**Kapsam:** Tek commit. Kod yok, ledger'a yazılmaz, yeni KARAR açılmaz.

Repo: `~/Desktop/hlaorpz/ocak-site-clone`. Bu brief kendi kendine yeterlidir.

---

## 0. NEDEN

`ocak-lint` yüklendikten sonra ilk gerçek sınamada yanlış cevap verdi. Soru:
*"`@ocak.life` ne yapılmalı?"* Cevap: *"kapsam her yerde, istisna yok, her yüzeyde
değiştirilir — iç doküman, brief, ledger, kod yorumu dahil."*

Skill'i doğru okudu. **Veri yanlıştı.**

Aynı gün açılan B44 tam tersini söylüyor: sweep yasak, çünkü `10-marka.md:3` sürüm notu
`@ocak.life` → `@ocak.biz` değişikliğinin **kendisini anlatıyor**; oradaki dize
"düzeltilirse" kayıt yalan söyler. KARAR 465'in uyardığı vaka.

**Çelişki tek satır değil.** Ölçüm: `kapsam` sütununda `her yerde` yazan **altı satırın
altısı da kendi tanımını yakalıyor.**

| dize | kendi tanımının yaşadığı yer |
|---|---|
| `@ocak.life` | `10-marka.md:3` — sürüm notu, rename'i anlatıyor |
| `Uluslararası Yolculuk` | `10-marka.md:3` — aynı sürüm notu, K3 rename'i |
| `funnel` | `10-marka.md:223` — KARAR 57 etik çerçevesi, terimi yasaklayan cümle |
| `conversion` | `10-marka.md:223` — aynı cümle |
| `lead` | `10-marka.md:223` — aynı cümle |
| `#FFFFFF` | `10-marka.md:202` — "Beyaz `#FFFFFF` hiçbir yerde kullanılmaz" |

`her yerde` kapsamı, bir kuralı **ihlal eden metin** ile o kuralı **tanımlayan metin**
arasında ayrım yapmıyor. Yasağı yazan cümle yasağın ilk kurbanı oluyor.

Bu benim hatam: tsv'yi EK-1'den önce yazdım, EK-1'de B44'ün kapsamını genişletirken
veri dosyasına dönmedim.

---

## 1. ADIM 0 — SALT-READ (KARAR 355)

```bash
cd ~/Desktop/hlaorpz/ocak-site-clone || { echo "DİZİN YOK — dur"; exit 1; }

git status --porcelain                                   # boş
git log -1 --format='%h'                                 # 4ecdfe3
git log -1 --format='%h' origin/main                     # 4ecdfe3 — push atılmış

wc -l docs/skills/ocak-lint/yasak-dizeler.tsv            # 25
awk -F'\t' 'NF!=6' docs/skills/ocak-lint/yasak-dizeler.tsv | wc -l    # 0
awk -F'\t' 'NR>1 && $3=="her yerde"' docs/skills/ocak-lint/yasak-dizeler.tsv | wc -l   # 6
head -1 docs/skills/ocak-lint/yasak-dizeler.tsv          # başlıkta "istisna" olmalı

# çelişkinin gerçekliği — altı satırın altısı da 10-marka.md'de kendi tanımını yakalıyor
grep -n '@ocak\.life\|Uluslararası\|funnel\|conversion\|#FFFFFF' docs/10-marka.md

# SKILL.md çapaları — HER BİRİ TEK OLMALI
grep -c '^## KAPSAM — önce bu$' docs/skills/ocak-lint/SKILL.md
grep -c 'Eşleşme \*\*ihlal değil, incelenecek adaydır\.\*\*' docs/skills/ocak-lint/SKILL.md
```

Ölç, raporla, **DUR**, onay bekle.

---

## 2. `SKILL.md` — GENEL MUAFİYET EKLENİR

Çapa (tek geçer):

```
Eşleşme **ihlal değil, incelenecek adaydır.** `istisna` sütunu okunmadan rapor yazılmaz.
```

Bu satır şununla değişir:

```markdown
Eşleşme **ihlal değil, incelenecek adaydır.** Genel muafiyet ve `ek_istisna` sütunu
okunmadan rapor yazılmaz.

### TARİHSEL KAYIT MUAFİYETİ — her satır için geçerli (KARAR 465)

**Bir dize, kendi yasağını ya da kendi değişimini anlatan metinde geçtiğinde korunur.**
Bu muafiyet tablodaki her satıra uygulanır; `ek_istisna` sütunu **buna ek** olan,
satıra özgü muafiyetleri taşır. Sütunun `yok` demesi genel muafiyetin kalktığı anlamına
gelmez.

Tarihsel kayıt sayılan yüzeyler:

- sürüm notu ve değişiklik kaydı (`10-marka.md:3` gibi)
- karar başlığı ve gövdesi — `01-kararlar.tsv`, `90-kronoloji/*`
- sapma kaydı, borç maddesinin sorun tanımı, brief'in ölçüm bölümü
- commit mesajı
- yasağı tanımlayan cümlenin kendisi (`10-marka.md:223` "funnel terimleri OCAK iç
  sistemine girmez" — cümle terimi barındırmak zorundadır)

**Kapanış kriteri hiçbir satır için `grep -c` sıfır değildir.** Kriter, eşleşmelerin
**canlı referans** / **tarihsel kayıt** diye sınıflandırılmış olmasıdır. Rename ve
yeniden-ifade kararlarında tarihsel kayıtlar sayımda kalır ve kalmalıdır — silinirlerse
kayıt yalan söyler.

### `kapsam` sütunu sözlüğü

| değer | ne denetlenir |
|---|---|
| `kamu metni` | Notion gövdesi, caption, bülten, kanal, site kopyası |
| `canlı referans` | yukarısı **+** iç dokümanlardaki **işaret eden** ifadeler (adres, handle, ürün adı) — anlatan ifadeler değil |
| `kod` | `src/`, `scripts/`, CSS |
| `site sayfası` | yalnız yayınlanan sayfa gövdesi |

`her yerde` değeri **kullanılmaz.** Kaldırıldı: altı satırda kendi tanımını yakalıyordu.
```

---

## 3. `yasak-dizeler.tsv` — TAMAMEN YENİDEN YAZILIR

Satır satır düzenleme sekmelerde risklidir. Dosya bütünüyle yeniden üretilir; içerik
korunur, `kapsam` ve başlık değişir.

```bash
cd ~/Desktop/hlaorpz/ocak-site-clone
printf '%s\t%s\t%s\t%s\t%s\t%s\n' \
'dize' 'tip' 'kapsam' 'karar' 'ek_istisna' 'oneri' \
'köz' 'kelime' 'kamu metni' '86,453' 'renk adı olarak iç talimatta serbest (köz #C44B2F)' 'sönmeyen kor' \
'@ocak.life' 'handle' 'canlı referans' 'marka v1.4' 'yok' '@ocak.biz' \
'Uluslararası Yolculuk' 'ürün adı' 'canlı referans' '437' 'yok' 'Dünya Yolculuğu' \
'Bilgi vermeyiz' 'kalıp' 'kamu metni' '442' 'iç doküman (10-marka.md OCAK WAY)' 'Reçete vermeyiz, alan tutarız' \
'bilgi vermez' 'kalıp' 'kamu metni' '442' 'iç doküman' 'reçete vermez' \
'Uzmanlık ayrıcalığı' 'kalıp' 'kamu metni' '442' 'yok' 'Uzmanlık var; kürsü yok' \
'ders anlatan' 'kalıp' 'kamu metni' '442' 'yok' 'Kürsüye çıkan yok' \
'ayda bir' 'sıklık sözü' 'kamu metni' '444' 'yok' 'kaldır — takvim gösterir' \
'ayda iki' 'sıklık sözü' 'kamu metni' '444' 'yok' 'kaldır — takvim gösterir' \
'her ay' 'sıklık sözü' 'kamu metni' '444' 'iç planlama metni' 'kaldır — takvim gösterir' \
'sınav' 'inkâr-eden-kelime' 'kamu metni' '448' 'üçlü karşıtlık pozitife çözülüyorsa' 'cümleyi tamamen çıkar' \
'ulaşılabilir değil' 'reddeden dil' 'kamu metni' '448' 'yok' 'yol tarif eden dile çevir' \
'Kadim Amerika' 'terim' 'canlı referans' '448' 'yok' 'Amerikalar' \
'tek dile getiren' 'tekelci okuma' 'kamu metni' '448' 'yok' 'tek bir dilde buluşturan' \
'sembolik' 'fiyat dili' 'kamu metni' '431' 'yok' 'kaldır — fiyat sayfada geçmez' \
'funnel' 'pazarlama terimi' 'canlı referans' '57' 'yok' 'kaldır' \
'conversion' 'pazarlama terimi' 'canlı referans' '57' 'yok' 'kaldır' \
'lead' 'pazarlama terimi' 'canlı referans' '57' 'İngilizce kod tanımlayıcısı' 'kaldır' \
'gücü yetmeyenler' 'aşağılayıcı çerçeve' 'kamu metni' '435' 'yok' 'erişim adaleti dilinden kur' \
'aynı deneyim online' 'yanlış eşitleme' 'kamu metni' '435' 'yok' 'Aynı eşikler. Orada bedenle, burada sesle.' \
'büyümek' 'wellness kelimesi' 'kamu metni' '312' 'somut bağlamda (kohort büyüklüğü)' 'markanın kendi cümlesinden kur' \
'genişlemek' 'wellness kelimesi' 'kamu metni' '312' 'yok' 'markanın kendi cümlesinden kur' \
'#FFFFFF' 'renk' 'kod' 'marka görsel kimlik' 'yok' 'krem #F2EAE2' \
'Kaan' 'isim' 'site sayfası' '89' 'iç doküman, brief, ledger' 'kaldır — site sayfalarında görünmez' \
> docs/skills/ocak-lint/yasak-dizeler.tsv

# doğrula
wc -l docs/skills/ocak-lint/yasak-dizeler.tsv                              # 25
awk -F'\t' 'NF!=6' docs/skills/ocak-lint/yasak-dizeler.tsv | wc -l         # 0
awk -F'\t' 'NR>1 && $3=="her yerde"' docs/skills/ocak-lint/yasak-dizeler.tsv | wc -l   # 0
head -1 docs/skills/ocak-lint/yasak-dizeler.tsv                            # ek_istisna
awk -F'\t' 'NR>1{print $3}' docs/skills/ocak-lint/yasak-dizeler.tsv | sort | uniq -c
```

Son komut yalnız dört değer göstermeli: `kamu metni` · `canlı referans` · `kod` ·
`site sayfası`.

⚠ **Dize sayısı 24 kalır.** Hiçbir satır silinmedi, hiçbiri eklenmedi — yalnız `kapsam`
altı satırda ve başlık bir sütunda değişti. Sayı düşerse `printf` satırı kaybolmuştur,
**DUR**.

---

## 4. `SKILL.md` okuma döngüsü — sütun adı

Çapa (tek geçer):

```
while IFS=$'\t' read -r dize tip kapsam karar istisna oneri; do
```

Şununla değişir:

```
while IFS=$'\t' read -r dize tip kapsam karar ek_istisna oneri; do
```

---

## 5. ZIP TAZELE

```bash
cd ~/Desktop/hlaorpz/ocak-site-clone
./scripts/skill-sync.sh sync
./scripts/skill-sync.sh --check          # ayrışma yok
```

⚠ **Kaan'a hatırlat:** `ocak-lint.zip` değişti, claude.ai Skills'e **yeniden
yüklenmelidir.** `--check` bunu ölçemez.

---

## 6. KRONOLOJİ — APPEND

`docs/90-kronoloji/2026-08.md` sonuna:

```markdown

---

## B44-a — LINT KAPSAM ÇELİŞKİSİ (8 Ağustos 2026)

`ocak-lint` yüklendikten sonraki ilk gerçek sınamada yanlış cevap verdi: `@ocak.life`
için "kapsam her yerde, istisna yok, iç doküman ve ledger dahil her yüzeyde değiştir"
dedi. Skill'i doğru okudu — **veri yanlıştı.** Aynı gün açılan B44 tam tersini söylüyor.

**Çelişki tek satır değil.** `kapsam` sütununda `her yerde` yazan altı satırın altısı da
**kendi tanımını yakalıyor**: `@ocak.life` ve `Uluslararası Yolculuk` marka dosyasının
sürüm notunu (`10-marka.md:3`), `funnel`/`conversion`/`lead` KARAR 57'nin etik çerçeve
cümlesini (`:223`), `#FFFFFF` "beyaz kullanılmaz" kuralının kendisini (`:202`).
**Yasağı yazan cümle yasağın ilk kurbanı oluyordu.**

Kök sebep, `her yerde` kapsamının bir kuralı **ihlal eden** metin ile onu **tanımlayan**
metin arasında ayrım yapmaması. Bir yasak listesi, kendi gerekçesini barındıran metni
zorunlu olarak yakalar — bu kaçınılmazdır ve muafiyetle çözülür, kapsam daraltmasıyla
değil.

**Çözüm iki katmanlı.** (1) `SKILL.md`'ye **tarihsel kayıt muafiyeti** eklendi: bir dize
kendi yasağını ya da kendi değişimini anlatan metinde geçtiğinde korunur; muafiyet her
satıra uygulanır, `ek_istisna` sütunu ona **ek** olanı taşır. Sütunun `yok` demesi genel
muafiyetin kalktığı anlamına gelmez — sütun bu yüzden `istisna`'dan `ek_istisna`'ya
çevrildi. (2) `kapsam` sözlüğü tanımlandı (`kamu metni` · `canlı referans` · `kod` ·
`site sayfası`); `her yerde` değeri **kaldırıldı**.

Kapanış kriteri hiçbir satır için `grep -c` sıfır değildir; kriter sınıflandırmadır.
KARAR 465'in "korunması gereken tarihsel anlatım" uyarısının doğrudan uygulaması —
yeni karar değil, mevcut kararın lint yüzeyine indirilmesi.

**Doğuş anına dair:** hata skill'in kendisinde değil, onu besleyen veride ve verinin
yazıldığı sırada. Tsv EK-1'den önce yazıldı; EK-1 B44'ün kapsamını genişletirken veri
dosyasına dönülmedi. Aynı turda üretilen iki artefakt birbiriyle çelişti ve çelişkiyi
**skill'in ilk kullanımı** yakaladı — kadronun ilk gerçek getirisi.

Dize sayısı değişmedi: 24. Ledger'a yazılmadı, yeni KARAR açılmadı.
```

---

## 7. COMMIT

Tek commit:

```
fix(lint): yasak-dizeler kapsam çelişkisi — tarihsel kayıt muafiyeti (KARAR 465)

ocak-lint ilk sınamasında @ocak.life için "her yüzeyde değiştir" dedi; B44 tam
tersini söylüyor. Skill doğru okudu, veri yanlıştı.

Çelişki tek satır değil: kapsam="her yerde" yazan altı satırın altısı da kendi
tanımını yakalıyor — @ocak.life ve Uluslararası Yolculuk 10-marka.md:3 sürüm
notunu, funnel/conversion/lead :223 etik çerçevesini, #FFFFFF :202 kuralının
kendisini.

SKILL.md'ye tarihsel kayıt muafiyeti eklendi, her satıra uygulanır. istisna
sütunu ek_istisna oldu — "yok" değeri genel muafiyeti kaldırmıyor. kapsam
sözlüğü tanımlandı, "her yerde" kaldırıldı.

Dize sayısı değişmedi (24). Ledger'a yazılmadı, yeni KARAR açılmadı — 465'in
lint yüzeyine uygulanması.
```

Push:

```bash
cd ~/Desktop/hlaorpz/ocak-site-clone
npm run build >/dev/null && echo "build yeşil"
git push origin main
```

---

## 8. DUR NOKTALARI

1. `SKILL.md` çapalarından biri bulunamaz ya da birden çok geçer
2. Yeniden yazım sonrası tsv satır sayısı **25** değil
3. `NF!=6` sıfırdan büyük
4. `kapsam` değerlerinde dört sözlük değeri dışında bir şey çıkarsa
5. `her yerde` sayımı sıfırdan büyük
6. `skill-sync.sh --check` ayrışma raporlarsa
7. `npm run build` kırmızıysa

---

## 9. NOT — `00-durum.md`'ye DOKUNULMUYOR

Bu bir dönem kapanışı değil, nokta düzeltmesidir. Beş bölümlü patch (KARAR 468)
uygulanmaz; `00-durum.md`, `01-kararlar.tsv`, `02-borclar.md`, `03-sira.md`
**değişmez**.

Dönem HEAD satırı bu commit'le bir tur daha geride kalır. **Doğrudur ve düzeltilmez** —
KARAR 474: *"kapanıştan sonra fazladan commit atılması meşrudur; satır bir sonraki
dönemde düzelir, geriye dönük düzeltme commit'i atılmaz."*

Sıradaki iş değişmedi: **B36-a**, `2026-08-08-brief-b36a-donusum.md`.
