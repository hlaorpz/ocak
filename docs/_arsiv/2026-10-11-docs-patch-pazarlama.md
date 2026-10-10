# docs-patch-2026-10-11 · Pazarlama planı v2 kapanış turu

**Yazan:** Claude.ai (11 Ekim 2026) · **Uygulayan:** CC · **Tür:** doküman + korpus dışı ekler; **kod yok**
**Girdi:** `~/Desktop/ocak-kapanis-2026-10-11.zip` (bu dosya onun kökünde)
**Korpus ölçümü:** MCP `6ab64be` (Claude.ai, 11 Ekim). Çapalar o commit'ten alındı; yerelde yeniden ölçülür.

Bu patch bir yazım emridir. Belirsiz kalan yerde uydurma: dur ve raporla. Uygulanmamış üç eski brief'in (`CC-BRIEF-1…3`, 9–10 Ekim) **yerine geçer**; onları uygulama.

Standart: `OCAK-patch-yazim-standardi` (Project Files) — ADIM 0, çapa disiplini, tavan, halka sırası, kapanış denetimleri.

---

## İŞ HARİTASI

| # | İş | Dosyalar | Commit |
|---|---|---|---|
| 1 | Paket, belgeler, skill'ler, arşiv, ekler | `docs/pazarlama/` · `docs/skills/ocak-{gonderi,kart,yorum}/` · `docs/_arsiv/2026-10-pazarlama-briefleri/` · `pazarlama-ekler/` | **C1** |
| 2 | Halka 1: durum → kararlar → borçlar → sıra → kronoloji | `00-durum` · `01-kararlar.tsv` · `02-borclar` · `03-sira` · `90-kronoloji/2026-10` | **C2** |
| 3 | Halka 3 (konusu değişti) | `05-harita` · `30-sosyal` | **C2** |
| 4 | Patch'in kendisi arşive | `docs/_arsiv/2026-10-11-docs-patch-pazarlama.md` | **C2** |

İki commit: C1 dosya girişi, C2 kayıt. Dönem HEAD = **C1** (KARAR 474: C2'den sonra `git log -2 | tail -1` = C1).

---

## ADIM 0 — salt-read, raporla

```bash
cd ~/Desktop/hlaorpz/ocak
git log --oneline -5
git status --short                                                    # kirliyse DUR — tek istisna aşağıda
wc -l docs/00-durum.md                                                # beklenen 194
awk -F'\t' 'NR>1{print $1}' docs/01-kararlar.tsv | sort -n | tail -1  # beklenen 635
grep -oE '^## B[0-9]+' docs/02-borclar.md | sort -t B -k2 -n | tail -1  # beklenen ## B230
node scripts/baslik-denetim.mjs ; echo "denetim: $?"                  # 0 değilse DUR
git log --oneline 5cbbb1b..HEAD -- src/                               # kod commit'i var mı (rapor)
ls -d docs/pazarlama pazarlama-ekler docs/skills/ocak-gonderi docs/skills/ocak-kart docs/skills/ocak-yorum docs/_arsiv/2026-10-pazarlama-briefleri 2>&1   # hepsi "No such file" olmalı; biri varsa DUR
git check-ignore -v pazarlama-ekler/x.jpg pazarlama-ekler/x.png docs/pazarlama/x.md ; echo "ignore: $?"   # 1 beklenir (hiçbiri ignore değil); 0 ise DUR ve raporla
git ls-files | grep -iE '\.(png|jpe?g|svg|pdf)$' | sed 's#/[^/]*$##' | sort | uniq -c | sort -rn | head   # depoda görsel nerede yaşıyor (rapor)
```

**Kirli ağaç istisnası.** `03-sira.md` (ölçüm/reklam hattı yan işleri) `tools/ocak-kart-derleyici.html`'in 9 Ekim'den beri commit bekleyen yerel değişikliğini kaydediyor. `git status --short` **yalnız** ` M tools/ocak-kart-derleyici.html` gösteriyorsa DUR değil: raporla, dokunma, stage etme (B234). Başka herhangi bir satır varsa DUR. Kapanıştaki `git status` kontrolünde de yalnız bu satır kabul edilir.

**Numara kuralı.** Bu patch KARAR **636–649** ve borç **B231–B234** yazar. Son KARAR 635 ya da son borç B230 değilse: patch'teki ve `patch-ekler/` içindeki **bütün** KARAR 636–649 ve B231–B234 geçişlerini aynı farkla kaydır (ör. son KARAR 637 ise +2), kaydırmayı raporla. Bu numaralar dışındaki hiçbir sayıya dokunma.

**Zip'i repo dışında aç ve say:**

```bash
rm -rf /tmp/ocak-kapanis && mkdir -p /tmp/ocak-kapanis && unzip -q ~/Desktop/ocak-kapanis-2026-10-11.zip -d /tmp/ocak-kapanis
Z=/tmp/ocak-kapanis/ocak-kapanis-2026-10-11
find $Z/repo/docs/pazarlama -type f -name '*.md' | wc -l              # beklenen 60
find $Z/repo/docs/skills -name SKILL.md | wc -l                       # beklenen 3
find $Z/repo/docs/_arsiv -type f | wc -l                              # beklenen 4
find $Z/repo/pazarlama-ekler -type f | wc -l                          # beklenen 96
ls $Z/patch-ekler                                                     # 7 dosya: ek-01 … ek-07
(cd $Z && shasum -a 256 -c SHA256SUMS | grep -v ': OK$' | head)       # boş dönmeli; değilse DUR
```

Sayılardan biri tutmuyorsa DUR.

**Çapa sayımı** (her biri tam **1** dönmeli; değilse DUR):

```bash
grep -cF '**Son güncelleme:** 10 Ekim 2026 · **B118 ölçüm katmanı + piksel kimliği turu** · dönem HEAD `5cbbb1b`' docs/00-durum.md
grep -cF '| sosyal medya ilk 30 gün — kart kart uygulama | `30-sosyal.md` |' docs/00-durum.md
grep -cF '| `main` dönem HEAD | **`5cbbb1b`**' docs/00-durum.md
grep -cF '- **9–10 Ekim — B118 ölçüm katmanı + piksel kimliği turu:**' docs/00-durum.md
grep -cF '- **7–8 Ekim — B211 bildirim hattı turu:**' docs/00-durum.md
grep -cF '- **1 Ekim — hamburger Takvim turu:**' docs/00-durum.md
grep -cF '| Reklam ölçümü — ilk **gerçek** ödemede Purchase doğrulaması' docs/00-durum.md
grep -cF '**Son güncelleme:** 10 Ekim 2026 · **B118 ölçüm katmanı + piksel kimliği turu**' docs/02-borclar.md
grep -cF '## B221 — `30-sosyal.md` Eylül 2026 kohortunu duyuruyor' docs/02-borclar.md
grep -cF -- '- [ ] **Sahip:** Claude.ai + Kaan · **Tetikleyici:** sıradaki içerik sohbeti (sosyal planın yenilenmesi)' docs/02-borclar.md
grep -cF -- '- **Bağ:** KARAR 617 · 620 · 621 · KARAR 451' docs/02-borclar.md
grep -cF '**Son güncelleme:** 10 Ekim 2026 · **B118 ölçüm katmanı + piksel kimliği turu**' docs/03-sira.md
grep -cF '**Sıradaki iş (içerik hattı, 8 Eki):** **sosyal medya planının yenilenmesi**' docs/03-sira.md
grep -cF '| **A-5** | **Arşiv şifre modeli**' docs/03-sira.md
grep -cF '**Son güncelleme:** 11 Eylül 2026 · ölçüm / yargı ayrımı turu (KARAR 578–582) · önceki: 11 Ağustos 2026 · B47' docs/05-harita.md
grep -cF -- '- **Ayna:** `~/Desktop/Social_Media_v2.1.md` — 19 Ağustos'"'"'ta repoya alındı, otorite' docs/05-harita.md
grep -cF '**Metin kaynağı:** `ocak-site-dump-fable-2026-08-19.md`' docs/30-sosyal.md
```

**Raporla:** HEAD (`<ADIM0_HEAD>`), çalışma ağacı, sayılar, çapa sonuçları, `5cbbb1b..HEAD -- src/` çıktısı, depoda görsellerin yaşadığı klasörler.

---

## İŞ 1 — Dosya girişi (commit C1)

```bash
Z=/tmp/ocak-kapanis/ocak-kapanis-2026-10-11
cd ~/Desktop/hlaorpz/ocak
cp -R $Z/repo/docs/pazarlama docs/pazarlama
for s in ocak-gonderi ocak-kart ocak-yorum; do mkdir -p docs/skills/$s && cp $Z/repo/docs/skills/$s/SKILL.md docs/skills/$s/SKILL.md; done
cp -R $Z/repo/docs/_arsiv/2026-10-pazarlama-briefleri docs/_arsiv/2026-10-pazarlama-briefleri
cp -R $Z/repo/pazarlama-ekler pazarlama-ekler
diff -rq $Z/repo/docs/pazarlama docs/pazarlama && diff -rq $Z/repo/pazarlama-ekler pazarlama-ekler && echo "kopya birebir"
```

İçerik değiştirilmez; ad, klasör, satır sonu aynen.

**Skill senkronu** (KARAR 458): `docs/skills/` değişti.

```bash
scripts/skill-sync.sh sync
scripts/skill-sync.sh --check ; echo "check: $?"
git status --short docs/_uretilen .claude
```

`sync`'in ürettiği dosyalar git'te izleniyorsa C1'e girer; ignore'luysa girmez — hangisi olduğunu raporla. Üç skill Kaan'ın Claude hesabında zaten kayıtlı (9–10 Ekim); gövdeleri buradakiyle aynı. claude.ai'ye yeniden zip yüklemek **gerekmez**; `--check`'in AYRIŞMA demesi bu üç skill için beklenen bir şey değildir — derse raporla, düzeltmeye çalışma.

```bash
git add docs/pazarlama docs/skills/ocak-gonderi docs/skills/ocak-kart docs/skills/ocak-yorum docs/_arsiv/2026-10-pazarlama-briefleri pazarlama-ekler
git status --short docs/_uretilen          # skill-sync'in izlenen bir dosyayı değiştirdiyse burada görünür
# görünen satır varsa: git add docs/_uretilen/skill-zip   (zip'ler .gitignore'da; yalnız izlenen dosyalar girer)
git status --short | head -20
git commit -m "docs(pazarlama): pazarlama paketi v2 + belgeler + üç skill + korpus dışı ekler (11 Eki)"
git log -1 --format='%h'            # → <HEAD1>
```

`<HEAD1>`'i not et; İş 2'de dört yere yazılır.

---

## İŞ 2 — Halka 1 (sıra bağlayıcı)

### 2a · `docs/00-durum.md`

Önce ölç: `wc -l docs/00-durum.md` (ADIM 0'daki sayı). Beş değişiklik:

**(1) Başlık — replace.**
Eski: `**Son güncelleme:** 10 Ekim 2026 · **B118 ölçüm katmanı + piksel kimliği turu** · dönem HEAD `5cbbb1b``
Yeni: `**Son güncelleme:** 11 Ekim 2026 · **Pazarlama planı v2 kapanış turu** · dönem HEAD `<HEAD1>``

**(2) Yönlendirme tablosu — insert after.** Çapa satırı `| sosyal medya ilk 30 gün — kart kart uygulama | `30-sosyal.md` |`; hemen altına tek satır:

```
| pazarlama — Ekim 2026 planı, gün gün takvim, gönderi dosyaları, Açık Kapı kampanyası | `pazarlama/00-OKU.md` (görsel ve araç: depo kökü `pazarlama-ekler/`) |
```

**(3) Dönem HEAD satırı — replace; eski satır kronolojiye iner.** `| `main` dönem HEAD | **`5cbbb1b`**` ile başlayan satırın **tamamını** önce kopyala (2e'de `<INEN_SATIRLAR>`'a girer), sonra yerine:

```
| `main` dönem HEAD | **`<HEAD1>`** (11 Eki, pazarlama v2 kapanış turu — bir önceki dönem `5cbbb1b`) — canlı HEAD değil, dönemin son commit'i · kapanış commit'inden bir önceki (KARAR 474). **Canlı HEAD üretilendir** → `docs/04-olcum.md` (KARAR 580). Bu dönem **kod içermedi**: `5cbbb1b..<HEAD1>` yalnız doküman ve korpus dışı ekler (`pazarlama-ekler/`). Önceki dönemin (`5cbbb1b`) satırı `90-kronoloji/2026-10.md`'ye indi (KARAR 61) |
```

⚠ ADIM 0'daki `git log --oneline 5cbbb1b..HEAD -- src/` boş dönmediyse "kod içermedi" cümlesini yazma; yerine o komutun çıktısındaki hash'leri yaz ve raporla. Aynı durumda iki yer daha değişir: 2a(4a) satırındaki "kod commit'i yok" → "bu turda kod commit'i yok; dönemde kod: <hash listesi>" · ek-03'teki "`tools/`, `scripts/`, `src/`: **değişmedi.**" satırının sonuna "(bu turda; dönemdeki kod commit'leri: <hash listesi>)".

**(4) BU DÖNEM NE OLDU — insert + tahliye.**

(4a) `- **9–10 Ekim — B118 ölçüm katmanı + piksel kimliği turu:**` satırının **hemen üstüne** tek satır:

```
- **9–11 Ekim — Pazarlama planı v2 (Claude.ai sohbeti):** kod commit'i yok. 19 Ekim Açık Kapı ve genel pazarlama paketi korpusa girdi (`pazarlama/`, giriş `00-OKU.md`; sohbetin tam kaydı `pazarlama/belgeler/`), üç skill (`ocak-gonderi` · `ocak-kart` · `ocak-yorum`), görseller ve araçlar korpus dışı `pazarlama-ekler/`'de. **KARAR 636–649** · **B231–B234** açıldı · **B221 ✅**. → `90-kronoloji/2026-10.md`
```

(4b) **Tahliye** (KARAR 457 · 61; hedef tavanın on satır altı). `- **7–8 Ekim — B211 bildirim hattı turu:**` satırından başlayıp `- **1 Ekim — hamburger Takvim turu:**` satırıyla biten blok (o satır dahil; 6ab64be'de **10 satır**: B211 üç satır · Search Console bir · N-Kolay üç · LANSMAN iki · hamburger bir) **önce kopyalanır** (2e'de `<INEN_SATIRLAR>`'a, eski dönem HEAD satırının altına), sonra yerine tek satır:

```
- **1–8 Ekim** (B211 bildirim hattı · Search Console + DNS · N-Kolay kimlik köprüsü · LANSMAN robots Allow · hamburger Takvim) → `90-kronoloji/2026-10.md` (11 Eki tahliyesi, KARAR 457 · 61)
```

Bloğun satır sayısı 10 değilse ya da arada bu beş madde dışında bir satır varsa DUR.

**(5) AÇIK CEPHELER — insert after.** `| Reklam ölçümü — ilk **gerçek** ödemede Purchase doğrulaması` ile başlayan satırın altına:

```
| Pazarlama — 19 Ekim Açık Kapı kampanyası, iki hatlı takvim, 20 Ekim retrosu (`pazarlama/`) · gündüz zeminleri ve gündüz kart aracı (Midjourney sohbeti, **B234**) | Kaan + Advaita · Claude.ai |
```

**Ölç:** `wc -l docs/00-durum.md` → beklenen **ADIM 0 sayısı − 6** (194 ise 188). 200'ü aşıyorsa DUR. 190'ın üstündeyse raporla (DUR değil).

### 2b · `docs/01-kararlar.tsv`

```bash
cat $Z/patch-ekler/ek-01-kararlar.tsv >> docs/01-kararlar.tsv
tail -15 docs/01-kararlar.tsv | cut -c1-80
```

Dosyanın son satırı satır sonuyla bitmiyorsa önce `echo >> docs/01-kararlar.tsv` — ekleme öncesi `tail -c1 docs/01-kararlar.tsv | xxd` ile ölç. On dört satır, altı sütun, `durum` AKTIF, `kaynak` `2026-10.md#k636` … `#k649`.

### 2c · `docs/02-borclar.md`

**(1) Başlık — replace.** Eski: `**Son güncelleme:** 10 Ekim 2026 · **B118 ölçüm katmanı + piksel kimliği turu**` → Yeni: `**Son güncelleme:** 11 Ekim 2026 · **Pazarlama planı v2 kapanış turu**`

**(2) B221 kapanışı.**
- `## B221 — `30-sosyal.md` Eylül 2026 kohortunu duyuruyor` → `## B221 — `30-sosyal.md` Eylül 2026 kohortunu duyuruyor ✅ KAPANDI (11 Eki)`
- `- [ ] **Sahip:** Claude.ai + Kaan · **Tetikleyici:** sıradaki içerik sohbeti (sosyal planın yenilenmesi)` → aynı satır, `- [ ]` yerine `- [x]`
- `- **Bağ:** KARAR 617 · 620 · 621 · KARAR 451` satırının **hemen altına**:

```
- ✅ **Kapanış (11 Eki — pazarlama v2 turu):** kapanış şartının ikinci yolu. `30-sosyal.md`'nin başına tarihsel not kondu: dosya yerini `docs/pazarlama/`'ya bıraktı, "Eylül 2026" ve "Mart 2027" geçen satırlar KARAR 617 · 620 · 621 ile geçersiz, yerinde (KARAR 61). Plan yenilendi: `docs/pazarlama/` (KARAR 636–649). Ölçüm: `grep -nE '24–27 Eylül|Eylül kohort|Eylül 2026|Mart 2027' docs/30-sosyal.md` → <B221_OLCUM> (yalnız tarihsel notun altında kalan satırlar ve notun kendisi).
```

`<B221_OLCUM>` yerine komutun bulduğu satır numaralarını yaz (3b'den **sonra** koş; not eklendiği için numaralar kayar. 2c'de yer tutucu olarak bırak, KAPANIŞ'taki grep'ten önce doldur).

**(3) Yeni borçlar — append.** `cat $Z/patch-ekler/ek-02-borclar.md >> docs/02-borclar.md` · dört başlık: B231 · B232 · B233 · B234.

### 2d · `docs/03-sira.md`

**(1) Başlık — replace.** Eski: `**Son güncelleme:** 10 Ekim 2026 · **B118 ölçüm katmanı + piksel kimliği turu**` → Yeni: `**Son güncelleme:** 11 Ekim 2026 · **Pazarlama planı v2 kapanış turu**`

**(2) Biten iş damgası.** `**Sıradaki iş (içerik hattı, 8 Eki):** **sosyal medya planının yenilenmesi**` → `**Sıradaki iş (içerik hattı, 8 Eki):** ✅ **sosyal medya planının yenilenmesi** (11 Eki — `docs/pazarlama/`, B221 kapandı)`. Satırın geri kalanı aynen.

**(3) Yeni paragraf — insert after.** (2)'deki paragrafın (tek satır) **altına** `ek-06-sira-paragrafi.md`'nin içeriği (baştaki boş satır dahil).

**(4) KARAR ADAYLARI — insert after.** `| **A-5** | **Arşiv şifre modeli**` ile başlayan satırın **altına** `ek-07-karar-adaylari.md`'nin dört satırı (A-6 … A-9). Tablonun sütun düzeni (`aday | soru | zemin`) üç sütun değilse DUR.

### 2e · `docs/90-kronoloji/2026-10.md` — append

```bash
cat $Z/patch-ekler/ek-03-kronoloji.md >> docs/90-kronoloji/2026-10.md
```

Sonra eklenen bölümde beş yer tutucuyu doldur:
- `<HEAD1>` → C1 hash'i (başlıkta ve "Korpusa giren" satırında)
- `<SAYI_PAZARLAMA>` → `find docs/pazarlama -type f -name '*.md' | wc -l` (beklenen 60)
- `<SAYI_EKLER>` → `find pazarlama-ekler -type f | wc -l`
- `<INEN_SATIRLAR>` → 2a(3)'te kopyalanan eski dönem HEAD satırı ve 2a(4b)'de kopyalanan on satır, **birebir**, bu sırayla
- `<ADIM0_HEAD>` → ADIM 0'daki HEAD

Rakam elle yazılmaz; komut çıktısı yazılır.

---

## İŞ 3 — Halka 3

### 3a · `docs/05-harita.md`

**(1) Başlık — replace.** Eski: `**Son güncelleme:** 11 Eylül 2026 · ölçüm / yargı ayrımı turu (KARAR 578–582) · önceki: 11 Ağustos 2026 · B47` → Yeni: `**Son güncelleme:** 11 Ekim 2026 · pazarlama v2 turu (yeni dosya: `pazarlama/`) · önceki: 11 Eylül 2026 · ölçüm / yargı ayrımı turu (KARAR 578–582)`

**(2) Sözleşme — insert after.** `- **Ayna:** `~/Desktop/Social_Media_v2.1.md` — 19 Ağustos'ta repoya alındı, otorite` satırı **ve onu izleyen 1 satır** (`  artık repodadır (KARAR 471).`) — bu iki satırın **altına** `ek-05-harita-bolumu.md`'nin içeriği (baştaki boş satır dahil). İzleyen satır bu değilse DUR.

### 3b · `docs/30-sosyal.md` — insert after

`**Metin kaynağı:** `ocak-site-dump-fable-2026-08-19.md`` ile başlayan satırın **altına** `ek-04-30-sosyal-notu.md`'nin içeriği (baştaki boş satır dahil). Dosyanın geri kalanına dokunulmaz.

### 3c · Patch arşive

```bash
cp $Z/docs-patch-2026-10-11.md docs/_arsiv/2026-10-11-docs-patch-pazarlama.md
```

---

## KAPANIŞ — atlanamaz

**Commit'ten önce:**

```bash
node scripts/durum-uret.mjs
node scripts/baslik-denetim.mjs ; echo "denetim: $?"          # 0
wc -l docs/00-durum.md                                         # ≤200 (beklenen 188)
awk -F'\t' 'NF!=6' docs/01-kararlar.tsv | wc -l                # 0
awk -F'\t' 'NR>1{print $1}' docs/01-kararlar.tsv | sort | uniq -d    # boş
awk -F'\t' 'NR>1{print $4}' docs/01-kararlar.tsv | sort -u           # dokuz değerin alt kümesi
awk -F'\t' 'NR>1 && $6==""' docs/01-kararlar.tsv | wc -l             # 0
grep -c '<HEAD1>\|<SAYI_\|<INEN_SATIRLAR>\|<ADIM0_HEAD>\|<B221_OLCUM>' docs/00-durum.md docs/02-borclar.md docs/90-kronoloji/2026-10.md   # hepsi 0
grep -rnE '<HEAD1>|<SAYI_|<INEN_SATIRLAR>' docs/_arsiv/2026-10-11-docs-patch-pazarlama.md | wc -l   # patch kopyası yer tutucuları taşır; bu normal (rapor)
```

```bash
git add docs/00-durum.md docs/01-kararlar.tsv docs/02-borclar.md docs/03-sira.md docs/90-kronoloji/2026-10.md docs/05-harita.md docs/30-sosyal.md docs/04-olcum.md docs/_arsiv/2026-10-11-docs-patch-pazarlama.md
git commit -m "docs(patch): pazarlama v2 kapanış turu — KARAR 636–649 · B231–B234 · B221 ✅"
```

**Commit'ten sonra (KARAR 474):**

```bash
git log -2 --format='%h' | tail -1      # = <HEAD1> (00-durum.md'deki dönem HEAD)
git status --short                      # temiz (ya da yalnız ` M tools/ocak-kart-derleyici.html`)
```

Tutmuyorsa iki ihtimali de raporla; geriye dönük düzeltme commit'i atma.

**Push:** Kaan'ın onayıyla. Push'tan sonra MCP korpusu kendiliğinden tazelenmez (B97): Railway'de **Deploy latest commit** (Cmd+K) — Kaan. Tazelik ölçümü: Claude.ai'de `docs_envanter()` commit'i C2 hash'ini göstermeli ve `docs/pazarlama/00-OKU.md` listede olmalı.

---

## RAPOR (CC → Kaan)

ADIM 0 çıktıları · numara kaydırması yapıldıysa farkı · C1 ve C2 hash'leri · `00-durum.md` önce/sonra satır sayısı · skill-sync sonucu · DUR'a takılan ya da raporla dediğim her nokta.

---

## DOKUNULMAYACAKLAR

- `src/`, `scripts/`, `tools/` (gündüz derleyicisi dahil — B234), `CLAUDE.md`, `10-marka.md`, `20-ref-*`, `31-zemin.md`.
- `04-olcum.md` elle yazılmaz; kapanışta betik koşar.
- Zip'teki dosyaların içeriği düzeltilmez; yanlış görürsen raporla.

---

## DUR KOŞULLARI

1. Çalışma ağacı kirli.
2. Hedef klasörlerden biri zaten var (`docs/pazarlama`, `pazarlama-ekler`, üç skill klasörü, arşiv klasörü).
3. Zip sayıları ya da `SHA256SUMS` tutmuyor.
4. Çapa bulunamıyor ya da birden çok geçiyor; 2a(4b) bloğu 10 satır değil.
5. `baslik-denetim.mjs` sıfır dönmüyor.
6. `pazarlama-ekler/` ya da `docs/pazarlama/` `.gitignore`'a takılıyor.
7. Patch'in bilmediği bir satır ya da bölüm hedef bölgede duruyor.
8. `durum` dokuz değerin dışında ya da `kaynak` boş.
9. Elle rakam yazma isteği doğuyor (ölçülemeyen alan boş bırakılır, raporlanır).
10. Tahliyeden sonra `00-durum.md` 200 satırı aşıyor.

**Durmak doğru reflekstir.** Numara kaydırması, `skill-sync` çıktısının izlenip izlenmemesi ve 190 üstü satır sayısı DUR sebebi değildir — raporlanır, devam edilir.

## NOTLAR

- Korpus ölçümleri MCP `6ab64be`'den (11 Eki, Claude.ai). Yerel repo görülmedi; her çapa yerelde yeniden ölçülür.
- `pazarlama-ekler/` depoya ~27 MB görsel ekler (kart setleri, kurucu kare, PDF'ler). Kaan'ın isteği kayıpsızlık; görselin depoda yaşaması B141'in tarif ettiği riski (zemin yalnız CDN'de) bu set için kapatır. Boyutun ölçümü: `du -sh pazarlama-ekler` (rapor).
- Uygulanmayan üç brief'in ne olduğu: `docs/_arsiv/2026-10-pazarlama-briefleri/00-NOT.md`.
