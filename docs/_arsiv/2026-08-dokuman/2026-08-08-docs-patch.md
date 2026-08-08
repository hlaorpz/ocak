# DOCS-PATCH — 2026-08-08 (ADIM 4 kapanışı)

**Sahip:** CC · **Repo:** `~/Desktop/hlaorpz/ocak-site-clone` · dal `main`
**Kapsam:** KARAR 468'in beş bölümünden **üçü**. `00-durum.md` ve `03-sira.md`
bölümleri ayrı patch'te gelecek — dosyalar Claude.ai'ye yapıştırılmadı, çapa
uydurulmaz (KARAR 465).

Üç ayrı commit. Bölüm 1 append-only, çakışma yok.

---

## BÖLÜM 1 — `docs/90-kronoloji/2026-08.md` (APPEND)

Dosyanın **sonuna** ekle. Bu blok `#k469` ve `#k470` çapalarını doğurur —
ledger'ın 469/470 satırları ancak bu blok yazıldıktan sonra meşrudur.

````markdown
---

## ADIM 4 — REPOYA TAM TAŞIMA + CLAUDE.md + baglam.sh (8 Ağustos 2026)

Dört commit, `main`: `fbd6504` (CLAUDE.md) · `470077e` (baglam.sh) ·
`3b91a59` (B36 açılış ölçümü) · `45471a6` (sapma eki + ledger + borçlar).
Parça 3 (repoya tam taşıma) yazma üretmedi — işi teyit ve izin raporuydu.
**Sıfır kod commit'i. Marka çekirdeği DEĞİŞMEDİ.**

**`CLAUDE.md` repo köküne kondu** (114 satır, dokuz bölüm). `20-ref-protokoller.md`'den
damıtıldı; gerekçeler orada kaldı, kural burada durur. Çekirdek: ADIM 0 salt-read (355) ·
gerçeklik spec'i ezer (102) · çapa disiplini (465) · nicel iddia ölçülebilir olur (470) ·
KIRPMA YASAĞI (61) · commit disiplini · tek klon (463) · sır env'de (469).

**`scripts/baglam.sh` beş profille kuruldu** — `kod · icerik · marka · bot · dokuman`.
Planın dört profili **beş** dosyaya göre yazılmıştı; yedi var. Sapma kaydı yalnız
`20-ref-program.md`'yi yetim ilan ediyordu; ölçüm **üç yetim** buldu (program, marka,
notion). Beşinci profil `dokuman` bu turda eklendi — son üç tur doküman mimarisi işiydi
ve profili yoktu. Çıktının ilk satırı manifesttir; profilde tanımlı bir dosya diskte
yoksa script **paket üretmez** (`exit 2`) — sessiz düşüş yasağı, guard izole kopyada
sınandı.

**`marka` profiline ledger girmedi.** Plan "kararlar(marka filtreli)" diyordu; ledger'da
tema sütunu yok, filtre `baslik` metnine dayanmak zorunda ve sessizce yanlış keser.
Yarım filtre filtresizden tehlikelidir — eksik olduğu görünmez. Kuyruk: B41.

**Project files silme izni verildi.** On dört ledger hedefinin on dördü yaşıyor, sıfır
`ÖLÜ`. Kanon ve müfredat md5 eşit. `ocak-site-icerik.md` için izin kriteri "repoda kopya
var mı"dan **"üretim yolu canlı mı"**ya geçti — `scripts/site-icerik-dump.mjs` git'te
izleniyor, dosya türetilmiştir, KIRPMA YASAĞI ona uygulanmaz (KARAR 456 ilkesi).
KARAR 455 tamamlandı: project files'ta yalnız `ocak-marka.md` kalır.

### B36 açılış ölçümü — kuyruk kayıtlı boyutunun en az dört katı

`docs/_uretilen/olcum-2026-08.md` (191 satır). Popülasyon `^[0-9A-Za-z-]+\.md:\d+$`
eşleşen **418** satır — `02-borclar.md`'deki B36 tablosuyla birebir. Örneklem sistematik
(adım 20, ofset 10), Claude ya da CC seçmedi.

| | 21 satır | brief'in 20'si |
|---|---|---|
| KENDİ | 12 (%57) | 11 (%55) |
| KOMŞU | 9 | 9 |
| HİÇ | 0 | 0 |

**`HİÇ` sıfır — ledger kırık değil, sığ.** Okuyan yanlış yere gitmiyor, derine inemiyor.
Nokta tahmin `418 × 9/21 ≈ 179` satır, ama 21'lik örneklemin güven aralığı geniş
(~90-270); tek rakam yazılmadı. B36'nın kayıtlı "~37 satır"ı en az dört kat düşüktü —
o rakamın kaynağının belirsiz olduğunu maddenin kendisi zaten yazıyordu.

**Kritik bulgu — kuyruğun üçte ikisi mekaniktir.** KOMŞU'ların **6'sı tek desenden**:
erken sohbetlerin `- **KARAR N:** Başlık (Bölüm A.X)` biçimli karar listeleri. Mekanik
tespit edilebilir, dolayısıyla mekanik onarılabilir. Kalan üçü tekil (162 görev listesi ·
231 komşu kararın metni · 381 dönem özeti). **Sonuç: `ocak-kararci`'ye onarım modu
gerekmiyor** — gereken bir dönüştürme betiği, B33/B37'nin kardeşi. ADIM 5-6 kadrosu
(KARAR 458) değişmiyor.

`iliski` sütunu (4.b): tek rakam yok, tanıma bağlı — T1 kararsız aralığı 10 satır,
`⊂` 10 satır, saf `BNN` 10 satır. `kaynak` biçimleri (4.c): `418 · 35 · 8 · 7`,
sınıflandırılamayan 0, `#k`/diğer `25/10`. B36 tablosu doğrulandı, güncelleme gerekmedi.

- **KARAR 469 — SIR DOKÜMANDA YAŞAMAZ (KALICI):** Token, API key, secret hiçbir doküman
  dosyasına yazılmaz — env'de ya da credential store'da yaşar. Dokümanda yalnız yer
  tutucu durur (`[TOKEN — n8n credential store, dokümanda tutulmaz]`). Canlı sır görülürse
  yazma durur, rotate kararı Kaan'ındır. Kural commit geçmişine de uygulanır: sır
  commit'lendiyse **rotate tek çözümdür**, dosyadan silmek yetmez. *Kural fiilen
  yürürlükteydi — KARAR 455 private repo token'ı yapıştırmayı reddetmişti, `20-ref-bot.md`
  BotZ token'ı yer tutucuyla duruyor — ama ledger'da satırı yoktu. Sözlü olarak "KARAR 464"
  diye anılıyordu; 464 test ortamı TZ kararıdır (`2026-08.md:25` + ledger birebir).
  Numara çakışması ADIM 4 hazırlığında ölçülerek yakalandı.* İlişki: `←464`.

- **KARAR 470 — NİCEL İDDİA ÖLÇÜLEBİLİR OLUR (KALICI):** İki ayaklı.
  **(a)** Dokümana giren her nicel iddia — satır sayısı, kapsama oranı, "N vaka",
  "yaklaşık M" — üretilebilir bir komuta dayanmalıdır. Dayanmıyorsa ya yazılmaz ya
  `TEYITSIZ` işaretlenir. Bellekten, önceki turdan ya da brief'ten devralınan rakam
  **ölçülmüş sayılmaz.**
  **(b)** Rakam tek başına değil, üretildiği yöntemle yazılır — **eşik, araç, kaynak
  kümesi.** İki ölçüm çelişirse önce *tanımlar* karşılaştırılır, sonra rakamlar; çoğu
  çelişki tanım çelişkisidir.
  KARAR 465'in kardeşi: 465 çapanın nereden alınacağını, 470 rakamın nereden alınacağını
  söyler. İlişki: `←465 · ↔456`.

  *Vakalar (altı, hepsi ölçülerek):* **(1)** B32'de "~37 sığ satır" rakamının kaynağı
  bulunamadı — maddenin kendisi bunu kaydetti. **(2)** B39'da aynı ölçüm iki kez yapıldı,
  `231/232` ve `226/237` verdi; fark karakter-vs-bayt sayımındandı. **(3)** B36'nın
  dört-biçim tablosu (`418`) bağımsız bir sayımla (`423`) çelişti; kriter yazılınca —
  sözdizimi mi gönderge mi — birebir uzlaştı. Rakamlar farklı değildi, tanım yoktu.
  **(4)** ADIM 4 brief'i `ocak-site-icerik.md` için "üretim script'i yok" yazdı; sözlü
  bir cevaptan devralınmıştı, ölçülmemişti. CC'nin ADIM 0'ı script'i
  `scripts/site-icerik-dump.mjs` olarak git'te izlenir buldu. **(5)** Aynı brief
  "son tazeleme `17:06:37.718Z`" yazdı; `2026-08.md:34`'ten devralınmıştı, dosyanın
  kendi damgası `17:20:06.647Z`. **(6)** ADIM 4 kapanış raporu "beş commit" dedi, dört
  SHA listeledi — Parça 3 doğru şekilde commit üretmemişti. *Kuralı yazan belgenin
  kendisi kuralı üç kez ihlal etti; üçünü de ADIM 0 ve karşı-ölçüm yakaladı. Disiplin
  belgede değil, ölçümde yaşıyor.*

### İki araç tuzağı — ölçüm aracının semantiği doğrulanır

**`awk length` bayt sayar.** Bu makinede `awk` 20200816 (BSD); `printf 'çığır\n' | awk
'{print length($0)}'` → **9**, oysa 5 karakter. `LC_ALL` bunu değiştirmez. Türkçe metinde
bayt/karakter farkı ~%6; eşik tabanlı her sayımı sistematik kaydırır. B39'un `231/232` vs
`226/237` sapmasının kök nedeni bu ailedendir. ADIM 4'ün bütün uzunluk ölçümleri `python3`
(3.9.6) ile yapıldı, sonuç ölçüm dosyasının başında kayıtlı.

**`cut -c1-140` aynı sınıf tuzak.** Kronoloji tek satırda birden çok kararın kaydını
taşıyabiliyor ve bir kayıt 140. karakterden sonra başlayabiliyor. CC ilk turda kesilmiş
satır okuyup 21'in üçünü (256 · 276 · 317) yanlış sınıflandırdı, kesmeyi kaldırınca
düzeltti. **Ders: kesme/örnekleme aracı da ölçümün parçasıdır** — `head`, `cut`, `grep -o`
ne gösterdiği kadar ne *gizlediğiyle* de sonucu belirler. KARAR 470(b)'nin "araç" ayağı
tam olarak budur.

- **KARAR 471 — PROJECT FILES'TA KALAN KOPYA TÜRETİLMİŞ AYNADIR (KALICI):**
  KARAR 455 project files'ta yalnız `ocak-marka.md`'yi bırakır (unutma sigortası).
  Bu kopya **otorite değil ayna**dır; otorite `docs/10-marka.md`'dir. Repo tarafı
  değiştiğinde ayna elle tazelenir ve tazeleme sohbet sonu patch'inin ayrı bir maddesidir
  — aksi halde ayrışma sessizdir. Çelişkide **repo kazanır.**
  *Vaka: ADIM 4 ölçümünde `docs/10-marka.md` 235 satır, project files kopyası 236 çıktı.
  Git ile çözüldü: B32'nin `95cd1e` commit'i iki işaretçiyi onarırken 3 satırı 2'ye
  indirmişti. Yani repo yeni, ayna B32 öncesi. Fark bir satırdı ve ancak kazara yakalandı;
  ayrışmanın kendisi değil, **sessizliği** tehlikeliydi.* İlişki: `←455 · ↔102`.

**Kapanış:** ADIM 1-4 kapandı. ADIM 5 (`ocak-arsivci` + `ocak-teshis` + `ocak-lint`)
sıradaki tesisat işidir; B36 artık ölçülü bir kuyruktur ve mekanik ayağı ADIM 5 ile
aynı turda gidebilir.
````

**Commit:** `docs: 2026-08 kronoloji — ADIM 4 kapanışı + KARAR 469/470/471`

---

## BÖLÜM 2 — `docs/01-kararlar.tsv`

469 ve 470 satırları `45471a6`'da zaten yazıldı. Bölüm 1 uygulandıktan sonra
çapaları meşrudur — doğrula, değiştirme:

```bash
cd ~/Desktop/hlaorpz/ocak-site-clone
grep -n "^469\|^470" docs/01-kararlar.tsv
grep -c "KARAR 469\|KARAR 470" docs/90-kronoloji/2026-08.md
```

**Tek yeni satır — append:**

```
471	2026-08-08	Project files'ta kalan kopya türetilmiş aynadır — otorite repodadır	KALICI	←455 · ↔102	2026-08.md#k471
```

⚠ `#k471` çapası Bölüm 1'deki blokla doğar. Bölüm 1 uygulanmadan bu satırı yazma.

Doğrulama: satır sayısı 470 → **471**, sütun sayısı her satırda 6, mükerrer `no` yok.

```bash
cd ~/Desktop/hlaorpz/ocak-site-clone
wc -l docs/01-kararlar.tsv
awk -F'\t' '{print NF}' docs/01-kararlar.tsv | sort -u
tail -n +2 docs/01-kararlar.tsv | cut -f1 | sort | uniq -d
```

**Commit:** `docs: ledger — KARAR 471 (project files aynası)`

---

## BÖLÜM 3 — `docs/02-borclar.md`

### 3.1 — B36 kuyruk boyutu ölçüldü

B36'daki **"⚠ Kuyruk boyutu ölçülmedi"** bloğunun tamamı aşağıdakiyle değiştirilir.
Eski metin kırpılmıyor — ölçülmüş hâliyle *dönüştürülüyor* (KARAR 61).

Çapa — dosyada tek geçen satır:

```
  **⚠ Kuyruk boyutu ölçülmedi.** Bu maddedeki eski "~37 sığ kaynak satırı" rakamının
```

Bu satırdan başlayıp `**418'i mekanik `:NNN`.**` ile biten paragrafı ve onu izleyen
"B36 açılırken önce örneklem ölçümü yapılır" cümlesini kapsayan bloğun yerine:

````markdown
  **Kuyruk boyutu ölçüldü (ADIM 4, 8 Ağustos 2026).** Bu maddedeki eski "~37 sığ kaynak
  satırı" rakamının kaynağı belirsizdi ve **kendisi doğrulanmamış bir sayıydı**
  (KARAR 465/470). Açılış ölçümü koşuldu: `docs/_uretilen/olcum-2026-08.md`.

  **Popülasyon:** `kaynak` sütununda `^[0-9A-Za-z-]+\.md:\d+(,\d+)*$` eşleşen **418**
  satır (kod dosyaları ve `dist` artefaktları hariç). Aşağıdaki dört-biçim tablosuyla
  birebir tutuyor. **Örneklem:** sistematik, `no`'ya göre sıralı, adım 20 ofset 10 —
  21 satır. Seçen taraf yok; yöntem yeniden üretilebilir.

  | sınıf | 21 satır |
  |---|---|
  | KENDİ — kararın kendi metni orada | **12 (%57)** |
  | KOMŞU — başka kararın metni / dönem özeti / indeks girdisi | **9 (%43)** |
  | HİÇ — satır yok ya da ilgisiz | **0** |

  `TEYITSIZ` yok. **`HİÇ` sıfır olması kuyruğun karakterini belirliyor: ledger kırık
  değil, sığ.** Okuyan yanlış yere gitmiyor, yalnız derine inemiyor — maddenin en baştaki
  teşhisi doğruydu, boyutu yanlıştı.

  **Kuyruk boyutu:** nokta tahmin `418 × 9/21 ≈ 179` satır. **Tek rakam yazılmıyor** —
  21'lik örneklemin güven aralığı geniş (~90-270). Kesin olan: eski "~37" en az **dört
  kat** düşüktü.

  **Kuyruğun üçte ikisi mekaniktir.** KOMŞU'ların **6'sı tek desenden** geliyor: erken
  sohbetlerin `- **KARAR N:** Başlık (Bölüm A.X)` biçimli karar listeleri — çapa listenin
  satırını gösteriyor, kararın metnini değil. Desen mekanik tespit edilebilir, dolayısıyla
  mekanik onarılabilir (B33/B37 sınıfı bir dönüştürme betiği). Kalan üçü tekil ve elle
  bakılır: **162** (görev listesi) · **231** (komşu kararın metni) · **381** (dönem özeti).

  **ADIM 5-6'ya etkisi: `ocak-kararci`'ye onarım modu gerekmiyor.** Kadro tanımı
  (KARAR 458) değişmiyor. B36 iki ayağa bölünüyor:
  - **B36-a (mekanik, CC):** karar-listesi deseni → `#kNNN` terfisi. ADIM 5 ile aynı
    turda gidebilir.
  - **B36-b (elle, Claude.ai):** desen dışı kalanlar + aşağıdaki bilinen sığ çapalar.
    B36-a bittikten sonra, kalan kuyruk yeniden ölçülür.
````

### 3.2 — B38'e tek satır ekle

B38'in **Yöntem** maddesinin altına:

```markdown
- **Ön ölçüm yapıldı (ADIM 4):** aynı yöntem 21 satırlık örneklemle koşuldu, isabet
  %57 çıktı. B38 bunu tekrarlamaz — B36-a bittikten **sonra** koşar ve mekanik onarımın
  oranı ne kadar oynattığını ölçer. Karşılaştırma tabanı: `_uretilen/olcum-2026-08.md`.
```

### 3.3 — Sahiplik tablosuna B36 bölünmesi

Dosya başındaki sahiplik tablosunda `B36` satırı ikiye ayrılır:
`B36-a → CC (mekanik)` · `B36-b → Claude.ai`.

**Commit:** `docs: B36 kuyruk boyutu ölçüldü — 179±, üçte ikisi mekanik; B36-a/B36-b`

---

## DOĞRULAMA

```bash
cd ~/Desktop/hlaorpz/ocak-site-clone
git log --oneline -3
git status --short
grep -c "^#" docs/90-kronoloji/2026-08.md
wc -l docs/01-kararlar.tsv docs/02-borclar.md docs/90-kronoloji/2026-08.md
grep -n "k469\|k470\|k471" docs/90-kronoloji/2026-08.md | head
```

Rapor: üç dosyanın yeni satır sayıları + üç commit SHA'sı.
**Rakamları dosyadan ölç, bu patch'ten devralma** (KARAR 470).

---

## EKSİK — AYRI PATCH'TE GELECEK

`00-durum.md` (138 satır) ve `03-sira.md` (102 satır) bölümleri bu patch'te **yok**.
İkisi de hedefli blok değişimi ister; çapa dosyanın gerçeğinden alınır ve dosyalar
Claude.ai'ye yapıştırılmadı (KARAR 465). Yapıştırıldıklarında iki bölümlük ek patch gelir.

**Kaan'a ayrı iş — KARAR 471'in ilk tatbiki:** project files'taki `ocak-marka.md`
(236 satır, B32 öncesi) silinip yerine `docs/10-marka.md` (235 satır) yüklenir.
Ayna tazelenmeden 455'in "unutma sigortası" işlevi yok.
