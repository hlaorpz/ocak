# CC BRIEF — EK-3: DÖNEM HEAD SÖZLEŞMESİ (KARAR 474)

**Durum:** ADIM 5 dört commit ile uygulandı (`091d1de`). Bu brief onun **üstüne** iki
commit ekler.
**⚠ EK-2'yi EZER.** EK-2 (`2026-08-08-brief-adim5-ek2.md`) sana ulaşmadı ve artık
uygulanmamalıdır — içeriği bu dosyaya taşındı ve güncellendi. EK-2'yi masaüstünden sil
ya da yok say. **EK-1 geçerli ve uygulandı**, ona dokunulmuyor.

Repo: `~/Desktop/hlaorpz/ocak-site-clone`. Bu brief kendi kendine yeterlidir.
Yanında: **`ek-karar-474.tsv`**.

---

## 0. NEDEN

Sen ölçtün ve bağımsız olarak doğru sonuca vardın:

```
git HEAD               : 091d1de
00-durum.md dönem HEAD : cb28afc   (Commit 3)
```

Sabit nokta problemi. Dosya kendi repo'sunun HEAD'ini yazıyor, o yazım da bir commit
üretiyor. Fark sıfıra inemez.

Aynı ölçüm bir şeyi daha çürüttü: **`f42911f` bayat değildi.** `76e8bee`'nin commit
mesajı — *"docs: dönem HEAD satırı — anlık görüntü etiketi + patch sırası kuralı"* —
onun ADIM 4'ün kapanış commit'i ve HEAD satırını yazan commit'in kendisi olduğunu
söylüyor. Kendi hash'ini içeremezdi. ADIM 5 brief'inin Bölüm 0'ı bunu "ihlal" diye
okudu; **brief yanıldı.**

Üç çıkış yolundan **(a) seçildi:**

- **(b)** satırı dosyadan çıkarıp `baglam.sh` manifestine taşımak — `00-durum.md`
  manifest dışında okunduğunda hangi commit'e denk geldiğini söyleyemez hale gelir.
  Project files aynası (KARAR 471) tam olarak öyle okunur. Reddedildi.
- **(c)** `--amend`'li kapanış — SHA'yı değiştirir, sabit noktayı çözmez, push
  sonrası tehlikeli. Reddedildi.
- **(a)** tanımı netleştir + doğrulamayı ona göre kur. Sıfır iş, doğru. **Seçildi.**

Bu bir karardır, mekanikleştirme değil: üç seçenek arasından biri seçiliyor, doğrulama
formülü ve DUR koşulu tanımlanıyor. **KARAR 474 açılıyor.**

---

## 1. ADIM 0 — SALT-READ

```bash
cd ~/Desktop/hlaorpz/ocak-site-clone || { echo "DİZİN YOK — dur"; exit 1; }

git status --porcelain                              # boş
git log --oneline -6                                # 091d1de en üstte
git log -1 --format='%h' origin/main                # 76e8bee — push atılmamış olmalı

wc -l docs/01-kararlar.tsv                          # 474
grep -c -P '^474\t' docs/01-kararlar.tsv            # 0
wc -l docs/00-durum.md                              # 153, tavan 200

# düzeltilecek çapalar — HER BİRİ TEK OLMALI
grep -c '^## Kapanış doğrulaması — atlanamaz$' docs/skills/ocak-arsivci/SKILL.md
grep -c 'git log -1' docs/skills/ocak-arsivci/SKILL.md
grep -n 'Kapanışta HEAD satırı' docs/skills/ocak-arsivci/SKILL.md

# KARAR 468 kaydında "anlık görüntü" ifadesi zaten var mı?
grep -n 'anlık görüntü\|bir önceki commit' docs/90-kronoloji/2026-08.md
grep -n 'KARAR 468' docs/01-kararlar.tsv
```

⚠ Son grep'in sonucunu **raporla.** KARAR 468'in kaydında "anlık görüntü" ifadesi zaten
varsa 474 onu tekrar etmez, **netleştirir** — ilişki sütunu `←468` olur ve bu zaten
`ek-karar-474.tsv`'de yazılı. Yoksa da aynı. Rapor bilgi içindir, akışı değiştirmez.

Ölç, raporla, **DUR**, onay bekle.

---

## 2. COMMIT 5 — `ocak-arsivci` düzeltmesi

⚠ **Bu commit kapanış commit'inden ÖNCE gider.** Sonraya kalırsa düzeltilmiş kural
kendi turunda uygulanamaz.

### 2.1 Kapanış doğrulaması bloğu

Çapa: `## Kapanış doğrulaması — atlanamaz` başlığından `## KIRPMA YASAĞI (KARAR 61)`
başlığına kadar olan blok, **tamamen** şununla değişir:

````markdown
## Kapanış doğrulaması — atlanamaz (KARAR 474)

**Dönem HEAD satırı = kapanış commit'inden bir önceki commit.** Sabit nokta problemidir:
dosya kendi repo'sunun HEAD'ini yazar, o yazım da bir commit üretir. Fark **tam olarak
bir commit'tir ve sıfıra inemez.** Satır canlı HEAD değil, **anlık görüntü** etiketidir.

Kapanış commit'inden **önce** — satıra yazılacak hash budur:

```bash
cd ~/Desktop/hlaorpz/ocak-site-clone
wc -l docs/00-durum.md                     # ≤200 (KARAR 457)
git log -1 --format='%h'                   # satıra BU yazılır
```

Kapanış commit'inden **sonra** — doğrulama:

```bash
cd ~/Desktop/hlaorpz/ocak-site-clone
git log -2 --format='%h' | tail -1         # satırdaki hash ile EŞİT olmalı
grep 'dönem HEAD' docs/00-durum.md
```

`git log -1` ile karşılaştırma **yanlıştır ve hiçbir zaman geçmez.**

Tutmuyorsa iki ihtimal vardır, ikisi de raporlanır:
1. Satır kapanıştan önce yazıldı ve araya commit girdi → düzeltilir.
2. Kapanıştan sonra fazladan commit atıldı → **meşrudur.** Satır bir sonraki dönemde
   düzelir; geriye dönük düzeltme commit'i atılmaz.
````

### 2.2 DUR-7

Çapa (tek satır):

```
7. Kapanışta HEAD satırı `git log -1` ile tutmuyor
```

Şununla değişir:

```
7. Kapanış sonrası `git log -2 --format='%h' | tail -1` HEAD satırıyla tutmuyor (KARAR 474)
```

### 2.3 Zip'i tazele ve doğrula

```bash
cd ~/Desktop/hlaorpz/ocak-site-clone
grep -c 'git log -2' docs/skills/ocak-arsivci/SKILL.md    # 2
grep -c 'git log -1' docs/skills/ocak-arsivci/SKILL.md    # 1
grep -c 'KARAR 474' docs/skills/ocak-arsivci/SKILL.md     # 2
./scripts/skill-sync.sh sync
./scripts/skill-sync.sh --check                           # ayrışma yok
```

### Commit 5

```
docs(skills): ocak-arsivci — dönem HEAD doğrulaması düzeltildi (KARAR 474)

Skill "HEAD satırı == git log -1" diyordu. Bu koşul tanım gereği imkânsız:
sabit nokta problemi, fark tam olarak bir commit ve sıfıra inemez.

ADIM 5 uygulamasında ölçüldü: git HEAD 091d1de, 00-durum.md cb28afc. Kural
harfiyen uygulandığı hâlde DUR-7 tetikleniyordu — koşulun kendisi yanlıştı.

Doğrulama artık git log -2 --format=%h | tail -1. Skill zip'i tazelendi.
```

---

## 3. COMMIT 6 — LEDGER + KRONOLOJİ DÜZELTMESİ + SIRA

### 3.1 Ledger

`ek-karar-474.tsv`'den satırı al, `docs/01-kararlar.tsv` sonuna ekle.
**Bu markdown'dan kopyalama** — sekmeler `ek`'te.

Sonuç: **474 → 475 satır** (`wc -l`).

### 3.2 Kronoloji — DÜZELTME EKLENİR, YENİDEN YAZILMAZ

⚠ **KIRPMA YASAĞI (KARAR 61).** `091d1de`'nin kronoloji kaydı `f42911f`'i sapma olarak
anlatıyor ve bu yanlış — ama **silinmez, yeniden yazılmaz.** Altına düzeltme eklenir.

Hatanın kaydı burada değerlidir: `03-sira.md` BAKIM KURALI 8 Ağustos'ta yazıldı, aynı
gün bir sonraki turda yanlış okundu. Skill'in var olma gerekçesi tam olarak budur.

`docs/90-kronoloji/2026-08.md` **sonuna** append:

```markdown

---

## DÜZELTME — DÖNEM HEAD SÖZLEŞMESİ (8 Ağustos 2026, ADIM 5 sonrası)

**Yukarıdaki ADIM 5 kaydı `f42911f`'i "bayat HEAD" diye anlatıyor. Bu tespit yanlıştır.**
Kayıt KIRPMA YASAĞI gereği olduğu gibi bırakıldı; düzeltme burada yaşar.

`git log` ölçümü gösterdi ki `76e8bee` ADIM 4'ün **kapanış commit'i ve HEAD satırını
yazan commit'in kendisidir** — commit mesajı da bunu söylüyor: *"dönem HEAD satırı —
anlık görüntü etiketi + patch sırası kuralı"*. Kendi hash'ini içeremezdi; bir öncekini,
`f42911f`'i yazdı. Bu ihlal değil, **yapısal zorunluluktu.**

ADIM 5 uygulaması aynı duvara çarptı: kural harfiyen uygulandı, satır kapanış
commit'inden hemen önce ölçüldü, yine de `git HEAD 091d1de` ≠ `00-durum.md cb28afc`.
CC bunu bağımsız olarak teşhis etti ve üç çıkış yolu önerdi; (a) seçildi.

**Neden kayda değer:** kuralı yazan tur ile onu yanlış okuyan tur **aynı gün** oldu.
Sözlü taşınan bir kural bir tur dayanmadı. `ocak-arsivci`'nin doğuş gerekçesi soyut
bir ihtiyaç değil, bu somut vakadır — ve skill'in ilk yazımı da aynı hatayı taşıdı
(`DUR-7 == git log -1`), yani skill kendi kapanışını her turda DUR'a düşürecekti.
Kendi kendini yakalayan bir hata olarak kapandı.

- **KARAR 474 — DÖNEM HEAD ANLIK GÖRÜNTÜDÜR (KALICI):** `00-durum.md`'deki dönem HEAD
  satırı **kapanış commit'inden bir önceki commit'i** taşır. Sabit nokta problemidir —
  dosya kendi repo'sunun HEAD'ini yazar, o yazım da bir commit üretir; fark tam olarak
  bir commit'tir ve **sıfıra inemez**. Satır canlı HEAD değil anlık görüntü etiketidir.
  Doğrulama: `git log -2 --format='%h' | tail -1`. `git log -1` ile karşılaştırma
  yanlıştır ve hiçbir zaman geçmez. Kapanıştan sonra fazladan commit atılması meşrudur;
  satır bir sonraki dönemde düzelir, **geriye dönük düzeltme commit'i atılmaz.**
  Reddedilen alternatifler: satırı `baglam.sh` manifestine taşımak (dosya manifest
  dışında okunduğunda — KARAR 471 aynası tam olarak öyle okunur — hangi commit'e denk
  geldiğini söyleyemez hale gelir) · `--amend`'li kapanış (SHA'yı değiştirir, sabit
  noktayı çözmez, push sonrası tehlikeli). İlişki: `←468`.
```

### 3.3 `docs/03-sira.md` — BAKIM KURALI'na ek

Çapa: BAKIM KURALI bölümünde dönem HEAD'den söz eden satırı bul ve **hemen ardına** ekle:

```markdown
⚠ **Sıfır sapma hedeflenmez (KARAR 474).** Satır kapanış commit'inden bir önceki
commit'i taşır; fark tam olarak bir commit'tir ve sabit nokta gereği sıfıra inemez.
Doğrulama `git log -2 --format='%h' | tail -1`.
```

Çapa tek değilse **DUR** ve satırı raporla.

**BİTENLER** bölümündeki `8 Ağustos — ADIM 5 ✅` maddesinin sonuna ekle:

```markdown
  Kapanış sonrası: KARAR 474 (dönem HEAD anlık görüntüdür) — `ocak-arsivci`'nin
  DUR-7'si düzeltildi, 6 commit.
```

### 3.4 `00-durum.md`

**(a)** Çapa: `**Son güncelleme:**` ile başlayan satırda `KARAR 473 mühürlendi`
→ `KARAR 473 · 474 mühürlendi`

**(b)** Dönem HEAD satırının **not kısmına** (satır içinde, hash'e dokunmadan)
`KARAR 474` atfı eklenir. Satır şu anda "canlı HEAD değil, dönemin son commit'i"
diyor; bu ifade **korunur**, sonuna eklenir:

```
· kapanış commit'inden bir önceki (KARAR 474)
```

**(c) Hash'i ŞİMDİ ölç ve yaz** — Commit 6'yı atmadan hemen önce:

```bash
cd ~/Desktop/hlaorpz/ocak-site-clone
git log -1 --format='%h'          # Commit 5'in hash'i — satıra BUNU yaz
wc -l docs/01-kararlar.tsv docs/00-durum.md
```

⚠ Bu hash Commit 6 atıldıktan sonra bir geride kalacaktır. **Doğrudur, düzeltilmez.**

### Commit 6

```
docs(adim5): KARAR 474 — dönem HEAD anlık görüntüdür

Sabit nokta problemi mühürlendi. Satır kapanış commit'inden bir önceki commit'i
taşır, fark sıfıra inemez, doğrulama git log -2 | tail -1.

Kronoloji: ADIM 5 kaydının "bayat HEAD" tespiti yanlıştı. Kayıt KIRPMA YASAĞI
gereği olduğu gibi bırakıldı, düzeltme altına eklendi. Kuralı yazan tur ile onu
yanlış okuyan tur aynı gün oldu — skill'in doğuş gerekçesi bu somut vakadır.

Reddedilen alternatifler kayda geçti: manifest'e taşıma (KARAR 471 aynası kırılır),
--amend (sabit noktayı çözmez).
```

---

## 4. DOĞRULAMA

```bash
cd ~/Desktop/hlaorpz/ocak-site-clone

# skill
grep -c 'git log -2' docs/skills/ocak-arsivci/SKILL.md    # 2
grep -c 'git log -1' docs/skills/ocak-arsivci/SKILL.md    # 1
./scripts/skill-sync.sh --check                            # ayrışma yok

# ledger
wc -l docs/01-kararlar.tsv                                 # 475
grep -c -P '^474\t' docs/01-kararlar.tsv                   # 1
awk -F'\t' 'NF!=6' docs/01-kararlar.tsv | wc -l            # 0
awk -F'\t' 'NR>1{print $1}' docs/01-kararlar.tsv | sort | uniq -d   # boş

# kronoloji: eski kayıt DURUYOR mu — KIRPMA testi
grep -c 'bayat' docs/90-kronoloji/2026-08.md               # ≥1 (eski kayıt yerinde)
grep -c 'KARAR 474' docs/90-kronoloji/2026-08.md           # ≥1

# tavan
wc -l docs/00-durum.md                                     # ≤200

# HEAD sözleşmesi — YENİ FORMÜL
git log -2 --format='%h' | tail -1                         # 00-durum.md ile EŞİT
grep 'dönem HEAD' docs/00-durum.md
git log --oneline -7

# build
npm run build >/dev/null && echo "build yeşil"
npm test 2>&1 | tail -3
git status --short
```

---

## 5. PUSH

Doğrulama temizse **altı commit birlikte gider.** `origin/main` şu an `76e8bee`'de.

```bash
cd ~/Desktop/hlaorpz/ocak-site-clone
git log --oneline origin/main..HEAD          # 6 satır
git push origin main
git log -1 --format='%h' origin/main         # Commit 6 ile eşit
```

---

## 6. DUR NOKTALARI

1. `docs/skills/ocak-arsivci/SKILL.md` çapalarından biri bulunamaz ya da birden çok geçer
2. Ledger `474` satırı zaten varsa, ya da satır sayısı `474` değilse
3. `03-sira.md` BAKIM KURALI çapası tek değilse
4. `00-durum.md` çapalarından biri bulunamaz ya da 200 satırı aşarsa
5. Kronolojideki eski ADIM 5 kaydı **değişmişse** — düzeltme ekler, kayıt silmez
6. `skill-sync.sh --check` ayrışma raporlarsa
7. Doğrulamada `git log -2 | tail -1` HEAD satırıyla tutmuyorsa
8. `npm run build` kırmızı ya da test 181/181 değilse
9. `origin/main..HEAD` altıdan farklı sayı dönerse

---

## 7. ONAYLANAN — GERİ ALINMIYOR

**Sahiplik tablosu düzeltmen kalıyor.** `02-borclar.md`'nin tablosuna B43/B44/B45'i
eklemen ve B42'yi ✅ işaretlemen brief'te yoktu ama **doğru yargıydı** — tablo o dosyada
indeks görevi görüyor ve önceki her patch onu güncellemişti. Brief'in eksiği, senin
fazlan değil. Geri alınmıyor.

**`--check` guard'ını sınaman** doğru refleksti. "Ayrışma yok" çıktısı her koşulda da
yazılabilirdi; geçici dosyayla exit=1 / exit=0 ayrımını göstermen guard'ı iddiadan
ölçüme çevirdi. KARAR 470'in ruhu.

---

## 8. BUNDAN SONRA

**Kaan tarafında:** CC'yi yeniden başlat, bir skill çağır — symlink'in gerçekten
yüklendiğini teyit et. Filesystem çözülmesi kanıtlandı, skill yükleme kanıtlanmadı.
Yüklenmiyorsa kopya moduna dönülür, ayrı brief.

**Zip'ler:** `docs/_uretilen/skill-zip/` altında üç `.zip`, claude.ai'ye elle yüklenir.

**Sıradaki iş:** B36-a — `2026-08-08-brief-b36a-donusum.md`.

**Not düşüldü, çözülmedi:** `ocak-notion` sahipsizliği (sapma kaydı 11. satır) ·
B40 · B41 · B01 · B43 · B44 · B45.
