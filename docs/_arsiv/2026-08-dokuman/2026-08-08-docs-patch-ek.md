# DOCS-PATCH EK — 2026-08-08 (ADIM 4 kapanışı, kalan iki bölüm + KARAR 472)

**Sahip:** CC · **Repo:** `~/Desktop/hlaorpz/ocak-site-clone` · dal `main`
**Önceki:** `cd28110` · `a0a0020` · `538aafe`

Dört bölüm, dört commit. Bütün çapalar dosyaların gerçek hâlinden alındı ve
benzersizliği ölçüldü (KARAR 465) — `00-durum.md` 138 satır, `03-sira.md` 102 satır.

**`00-durum.md` 200 satır tavana tabidir (KARAR 457).** Bu patch net ~+18 satır ekler
(138 → ~156). Uygulama sonrası ölç; 200'ü aşıyorsa **DUR ve raporla** — en eski dönem
bloğu kronolojiye iner, ben taşıma patch'i veririm.

---

## BÖLÜM 1 — `docs/90-kronoloji/2026-08.md` (APPEND)

Dosyanın **sonuna** ekle. `#k472` çapası burada doğar.

````markdown
### Çapa çözümleme sözleşmesi yazısızdı (8 Ağustos 2026)

ADIM 4 kapanış patch'inin doğrulama komutu (`grep -n "k469\|k470\|k471"`) sıfır satır
döndürdü. Sebep hata değil **konvansiyon**: `#kNNN` çapası kronolojide literal dize
olarak yaşamıyor. `#k` dizesi `2026-05/06/07` dilimlerinde hiç geçmiyor; `2026-08`'deki
geçişler ledger değerlerini alıntılayan patch metinleri. CC çapaları madde başlığı
deseninden çözdü ve doğru çözdü — ama **desen hiçbir yerde yazılı değildi.**

KARAR 466 `#kNNN`'i "elle doğrulanmış çapa" diye tanımlıyor, **nasıl çözüleceğini
söylemiyor.** Ledger'daki 35 `#` çapasının tamamı bu yazısız kurala bağlı, ve KARAR 461'in
`docs_karar(no)` aracı tümüyle onun üzerine kurulacak. Sözleşme yazılmazsa MCP sunucusunu
yazan taraf kendi çözümleme kuralını icat eder ve sessizce ayrışır.

- **KARAR 472 — ÇAPA ÇÖZÜMLEME SÖZLEŞMESİ (KALICI):** `YYYY-AA.md#kNNN` çapası hedef
  dosyada **literal dize aramaz.** Çözümleme madde başlığı biçimiyle yapılır:

  ```
  - **KARAR NNN — BAŞLIK (DURUM):**
  ```

  Yani `#k469` → `2026-08.md` içinde `- **KARAR 469 —` ile başlayan satır. Biçim
  varyantları meşrudur (`#kNNN-blok` bir bloğun tamamına, `#adim1` adlandırılmış bir
  bölüme işaret eder) ama **hepsi başlık satırına çözülür, gövde metnine değil.**
  Bir kararın çapası ancak o madde başlığı kronolojide yazıldıktan sonra meşrudur —
  ledger satırı önce yazılırsa çapa ölü doğar (KARAR 465 sıra şartı).
  KARAR 466'nın eksik ayağıdır: 466 biçimi tanımlar, 472 çözümlemeyi.
  *ADIM 7'nin `docs_karar(no)` aracı bu sözleşmeyi uygular; başka bir çözümleme kuralı
  icat edemez.* İlişki: `←466 · ↔461`.

**KARAR 470'in yedinci vakası, mühürlendiği turdan bir tur sonra.** Kapanış patch'i
KARAR 471'in vaka metninde B32 marka commit'ini `95cd1e` diye yazdı; CC `git log` ile
ölçtü, doğrusu **`095cd1e`** — baştaki sıfır düşmüştü. Claude.ai rakamı ölçmeden
devraldı, CC ölçtü ve düzeltti. *Aynı patch'in kendi vaka listesindeki (6) numaralı
madde de bağımsız olarak doğrulandı: ADIM 4 kapanış raporu "beş commit" demişti,
`git log fbd6504~1..HEAD` dört veriyor.*

**ADIM 4 kapanış patch'i uygulandı:** `cd28110` (kronoloji, +124 satır) · `a0a0020`
(ledger, karar satırı 470 → 471) · `538aafe` (B36 ölçülmüş hâli, 516 → 599 satır).
Test 181/181. Sıra korundu: 469/470 satırları `45471a6`'da yazılmıştı, blokları
`cd28110` ile doğdu, 471 sonra eklendi.
````

**Commit:** `docs: 2026-08 kronoloji — KARAR 472 (çapa çözümleme sözleşmesi)`

---

## BÖLÜM 2 — `docs/01-kararlar.tsv` (APPEND)

⚠ Bölüm 1 uygulanmadan yazma — `#k472` çapası orada doğuyor.

```
472	2026-08-08	Çapa çözümleme sözleşmesi — `#kNNN` madde başlığına çözülür, literal dizeye değil	KALICI	←466 · ↔461	2026-08.md#k472
```

```bash
cd ~/Desktop/hlaorpz/ocak-site-clone
grep -n "^- \*\*KARAR 472" docs/90-kronoloji/2026-08.md
wc -l docs/01-kararlar.tsv
awk -F'\t' '{print NF}' docs/01-kararlar.tsv | sort -u
tail -n +2 docs/01-kararlar.tsv | cut -f1 | sort | uniq -d
```

**Commit:** `docs: ledger — KARAR 472`

---

## BÖLÜM 3 — `docs/00-durum.md` (HEDEFLİ)

Yedi hedefli değişim. Her çapa dosyada tek geçiyor (ölçüldü).

### 3.1 — başlık (satır 3)

**ESKİ:**
```
**Son güncelleme:** 7 Ağustos 2026 · B37 + B34 · **KARAR 467 mühürlendi** (TEYITSIZ 3→1)
```
**YENİ:**
```
**Son güncelleme:** 8 Ağustos 2026 · **ADIM 4 ✅** · KARAR 469 · 470 · 471 · 472 mühürlendi
```

### 3.2 — satır sayısı notu (satır 9)

**ESKİ:**
```
> *Şu an: ~138 satır. Kalan pay bir sonraki dönemin durumu içindir.*
```
**YENİ:** rakamı **uygulama sonrası ölç ve yaz** (KARAR 470) — aşağıdaki `NN` yerine
`wc -l` çıktısını koy:
```
> *Şu an: NN satır (`wc -l`, 8 Ağustos). Kalan pay bir sonraki dönemin durumu içindir.*
```

### 3.3 — ŞU AN NEREDEYİZ girişi (satır 30-31)

**ESKİ:**
```
**Doküman mimarisi geçişi — ADIM 3 bitti.** Pilot dağıtıldı; artık `ocak-pilot.md` yok.
Yol haritası: `2026-08-06-ocak-gecis-plani.md` — **sonundaki SAPMA KAYDI'nı okumadan brief yazma** (plan beş yerinden bayat, B32 sonrası).
```
**YENİ:**
```
**Doküman mimarisi geçişi — ADIM 4 bitti.** Tesisat kuruldu: `CLAUDE.md` repo kökünde,
`baglam.sh` beş profille çalışıyor, project files boşaltıldı.
Yol haritası: `2026-08-06-ocak-gecis-plani.md` — **sonundaki SAPMA KAYDI'nı ve EK'ini okumadan brief yazma** (gövde dokuz yerinden bayat; ilk altısı 7 Ağu kaydında, üçü 8 Ağu ekinde).
```

### 3.4 — ADIM 4/7 satırları (satır 38-40)

**ESKİ:**
```
- **ADIM 4 ⏭** — repoya tam taşıma + `CLAUDE.md` + `baglam.sh`. B01 (klon yeniden
  adlandırma) buna bağlı.
- **ADIM 7** — docs MCP sunucusu, endgame. 4–6 oturmadan açılmaz.
```
**YENİ:**
```
- **ADIM 4 ✅** — `CLAUDE.md` (kök, dokuz bölüm) + `scripts/baglam.sh` (beş profil:
  `kod · icerik · marka · bot · dokuman`, manifest satırı + eksik-dosya guard'ı) +
  project files silme izni (14/14 ledger hedefi yaşıyor, sıfır `ÖLÜ`).
  Yedi `20-ref-*` dosyasının hepsi en az bir profilde. B01 (klon yeniden adlandırma) açık.
- **ADIM 5 ⏭** — `ocak-arsivci` · `ocak-teshis` · `ocak-lint`. Kadro tanımı KARAR 458;
  **onarım modu gerekmiyor** (B36 ölçümü: `HİÇ` sıfır, kuyruk sığ ama kırık değil).
- **ADIM 7** — docs MCP sunucusu, endgame. 4–6 oturmadan açılmaz.
  Çapa çözümlemesi KARAR 472'ye tabidir — `docs_karar(no)` kendi kuralını icat edemez.
```

### 3.5 — otorite paragrafı (satır 43-44)

**ESKİ:**
```
kopyaları 6 Ağustos'tan sonra bayattır ve güncellenmez — `10-marka.md` tek istisna
(KARAR 455). Her sohbet açılışında bağlam yapıştırılır.
```
**YENİ:**
```
kopyaları 6 Ağustos'tan sonra bayattır ve güncellenmez — `10-marka.md` tek istisna
(KARAR 455). O kopya **otorite değil aynadır**; repo değişince elle tazelenir, çelişkide
repo kazanır (KARAR 471). Her sohbet açılışında bağlam yapıştırılır — `baglam.sh` ile.
```

### 3.6 — HEAD satırı (satır 55)

**ESKİ:**
```
| `main` HEAD | **`3c04504`** (6 Ağu, yol haritası) — ADIM 3 commit'i bunun üstüne biner |
```
**YENİ:** SHA'yı **`git rev-parse --short HEAD`** ile ölç, aşağıdaki `XXXXXXX` yerine yaz:
```
| `main` HEAD | **`XXXXXXX`** (8 Ağu, ADIM 4 doküman turu) — sıfır kod commit'i, `dist/` değişmedi |
```

### 3.7 — dönem kaydı (satır 105 sonrası, EKLE)

Şu satırı **çapa alıp**, onu kapsayan iki satırlık maddenin **altına** yeni madde ekle:

**ÇAPA:**
```
- **6 Ağustos:** doküman mimarisi geçişi (KARAR 455–463) + kod teyidi 3 tur (7 commit,
```
**Bu maddenin bittiği yere EKLE:**
```
- **7–8 Ağustos:** B32 (referans dağıtımı, beşli → yedili) · B33 · B37 · B34 ·
  **ADIM 4** (CLAUDE.md + baglam.sh + tam taşıma) · **B36 açılış ölçümü**
  (mekanik çapaların %43'ü komşusunu gösteriyor, kuyruk ~179±, üçte ikisi tek desen) ·
  KARAR 465–472. Sıfır kod commit'i. → `90-kronoloji/2026-08.md`
```

### 3.8 — AÇIK CEPHELER tablosu (satır 121-122)

**ESKİ:**
```
| Sığ kaynak çapaları (B36) + KARAR 87 ayrıştırma (B35) | Claude.ai |
| Doküman geçişi ADIM 4 | Kaan + CC |
```
**YENİ:**
```
| Sığ çapa onarımı **B36-a** (karar-listesi deseni, mekanik) | CC |
| Sığ çapa onarımı **B36-b** (desen dışı) + KARAR 87 ayrıştırma (B35) | Claude.ai |
| `10-marka.md` aynasının tazelenmesi (KARAR 471, ilk tatbik) | Kaan |
| Doküman geçişi ADIM 5-6 | CC |
```

---

## BÖLÜM 4 — `docs/03-sira.md` (HEDEFLİ)

### 4.1 — başlık (satır 3)

**ESKİ:**
```
**Son güncelleme:** 7 Ağustos 2026 · doküman turu kapandı
```
**YENİ:**
```
**Son güncelleme:** 8 Ağustos 2026 · ADIM 4 kapandı, B36 ölçüldü ve ikiye bölündü
```

### 4.2 — SIRADAKİ İŞ (satır 16-20)

**ESKİ:**
```
**ADIM 4** — repoya tam taşıma + `CLAUDE.md` + `baglam.sh`. CC, repo.
Brief Claude.ai'da yazılacak.

⚠ `baglam.sh` profilleri **yedi** `20-ref-*` dosyasına göre kurulur, beşe göre değil.
Yeni ikisi: `20-ref-program.md` (ürün/format) · `20-ref-marka.md` (marka tam metni).
```
**YENİ:**
```
**ADIM 5** — `ocak-arsivci` · `ocak-teshis` · `ocak-lint`. CC, repo.
Kadro tanımı KARAR 458; kanonik kaynak `docs/skills/` (henüz yok, bu turda doğar).
Brief Claude.ai'da yazılacak.

⚠ **`ocak-kararci`'ye onarım modu gerekmiyor.** B36 açılış ölçümü (`_uretilen/olcum-2026-08.md`):
`HİÇ` sıfır — ledger kırık değil, sığ. Kuyruğun üçte ikisi tek mekanik desen; gereken
bir dönüştürme betiği (B33/B37 kardeşi), ajan değil. **B36-a ADIM 5 ile aynı turda gidebilir.**
```

### 4.3 — kuyruk tablosu, satır 1 (satır 28)

**ESKİ:**
```
| 1 | **ADIM 4** — repoya tam taşıma + `CLAUDE.md` + `baglam.sh` | CC | repo | yok | brief yazılacak (Claude.ai) |
```
**YENİ:**
```
| 1 | **ADIM 5** — `ocak-arsivci` · `ocak-teshis` · `ocak-lint` | CC | repo | yok — ADIM 4 ✅ | KARAR 458 kadro tanımı |
```

### 4.4 — kuyruk tablosu, B36 satırı (satır 31)

**ESKİ:**
```
| 4 | **B36** — sığ kaynak satırları `#k` çapasına terfi (+B32'nin bulduğu 4 vaka) | Claude.ai | ayrı sohbet | yok — B32 kapandı | ledger + ilgili dilimler |
```
**YENİ:**
```
| 4a | **B36-a** — karar-listesi deseni (`- **KARAR N:** Başlık (Bölüm A.X)`) → `#k` terfisi, mekanik | CC | repo | yok | `02-borclar.md` B36 + `_uretilen/olcum-2026-08.md`; B33/B37 betik deseni |
| 4b | **B36-b** — desen dışı kalanlar (162 · 231 · 381 + B32'nin bulduğu 4 vaka) | Claude.ai | ayrı sohbet | B36-a | ledger + ilgili dilimler; kalan kuyruk B36-a sonrası yeniden ölçülür |
```

### 4.5 — kuyruk tablosu, ADIM 5-6 satırı (satır 33)

**ESKİ:**
```
| 6 | **ADIM 5-6** — `ocak-arsivci` · `ocak-teshis` · `ocak-lint` · `ocak-kararci` · `ocak-metin` | CC | repo | ADIM 4 | KARAR 458 kadro tanımı |
```
**YENİ:**
```
| 6 | **ADIM 6** — `ocak-kararci` · `ocak-metin` | CC + Claude.ai | repo | ADIM 5 | KARAR 458; `ocak-kararci` çapa yazarken KARAR 472'ye tabidir |
```

### 4.6 — B38 satırı (satır 35)

**ESKİ:**
```
| 8 | **B38** — ledger çapa denetimi, örneklem bazlı (terminal kontrol) | Claude.ai | ayrı sohbet | ADIM 7 | `02-borclar.md` B38 — örneklem numaralarını Kaan verir |
```
**YENİ:**
```
| 8 | **B38** — ledger çapa denetimi (terminal kontrol) | Claude.ai | ayrı sohbet | ADIM 7 **+ B36-a** | `02-borclar.md` B38. Ön ölçüm ADIM 4'te yapıldı (isabet %57); B38 onu tekrarlamaz, mekanik onarımın oranı ne kadar oynattığını ölçer |
```

### 4.7 — kilitleme cümlesi (satır 37)

**ESKİ:**
```
**Hiçbiri ADIM 4'ü kilitlemiyor.** ADIM 4 kuyruğun başındadır; B39 · B35 · B36 · 251 sırası tercih meselesidir. B38 tanımı gereği sonuncudur.
```
**YENİ:**
```
**Hiçbiri ADIM 5'i kilitlemiyor.** B39 · B35 · B36-b · 251 sırası tercih meselesidir.
**B36-a ADIM 5 ile birleştirilebilir** — ikisi de CC, ikisi de repo, ikisi de betik işi.
B38 tanımı gereği sonuncudur ve artık B36-a'ya da bağlıdır.
```

### 4.8 — BİTENLER (satır 99 öncesine EKLE)

**ÇAPA:**
```
- **7 Ağustos — B32 ✅** `ocak-referans.md` dağıtımı (4 commit).
```
**Bu satırın ÜSTÜNE ekle:**
```
- **8 Ağustos — ADIM 4 ✅** (4 commit + 3 kapanış + bu patch, sıfır kod commit'i)
  `CLAUDE.md` kökte · `baglam.sh` beş profil · project files boşaldı (`10-marka.md` hariç) ·
  **B36 açılış ölçümü**: isabet %57, `HİÇ` sıfır, kuyruk ~179± ve üçte ikisi mekanik ·
  KARAR 469 · 470 · 471 · 472 mühürlendi · B40 · B41 · B42 açıldı.
  → `90-kronoloji/2026-08.md`
```

---

## DOĞRULAMA

```bash
cd ~/Desktop/hlaorpz/ocak-site-clone
wc -l docs/00-durum.md docs/03-sira.md docs/01-kararlar.tsv docs/90-kronoloji/2026-08.md
echo "--- tavan kontrolü (KARAR 457) ---"
[ "$(wc -l < docs/00-durum.md)" -le 200 ] && echo "≤200 ✅" || echo "⚠ TAVAN AŞILDI — DUR"
grep -n "^- \*\*KARAR 472" docs/90-kronoloji/2026-08.md
grep -c "ADIM 4 ⏭\|ADIM 3 bitti" docs/00-durum.md   # 0 olmalı
git log --oneline -4
git status --short
```

Rapor: dört SHA + dört dosyanın yeni satır sayısı + tavan durumu.
**Rakamları dosyadan ölç, bu patch'ten devralma** (KARAR 470).

---

## DUR NOKTALARI

- `00-durum.md` 200 satırı aşıyor
- Herhangi bir çapa tutmuyor (dosya bu patch yazıldıktan sonra değişmiş olabilir)
- 3.2 ve 3.6'daki `NN` / `XXXXXXX` yer tutucuları ölçülmeden bırakılmış
