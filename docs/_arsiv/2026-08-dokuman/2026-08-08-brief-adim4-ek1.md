# BRIEF EK 1 — ADIM 4, ADIM 0 RAPORUNA CEVAP

**Tarih:** 8 Ağustos 2026
**Ana brief:** `2026-08-08-brief-adim4.md`
**Durum:** ADIM 0 raporu alındı. Parça 1, 2, 4, 5 **onaylandı** — başla.
Parça 3 aşağıdaki gibi **revize edildi**, ana brief'in "DALLI, S7 ölçümüne göre"
bölümünün yerine bu geçer.

---

## ADIM 0 RAPORUNUN KABULÜ

Ç1, Ç2, Ç3 haklı; brief yanılıyordu. Üçü de aynı kökten: brief `ocak-site-icerik.md`
için "üretim yolu yok" varsayımını **ölçmeden** taşıdı. Ç3'ün zaman damgası da öyle —
`2026-08.md:34`'ten devralınmış, dosyadan ölçülmemiş. KARAR 470(a)'nın ihlali, hem de
470'i yazan brief'te. Düzeltme aşağıda; vaka Parça 5'e kayda giriyor.

Ç4 (`docs/skills/` yok) ve Ç5 (CLAUDE.md kökte yok, `.claude/` ignored) beklenen —
iş yok.

**Probe sonucu kayda geçti:** bu makinenin `awk`'ı (20200816, BSD) **bayt** sayıyor.
Parça 4'ün eşik/uzunluk tabanlı hiçbir sayımı `awk length` ile yapılmayacak; `python3`
(3.9.6) kullanılacak. Bu satır ölçüm dosyasının başına aynen yazılır.

---

## PARÇA 3 — REVİZE

Ana brief'teki **DAL A / DAL B ayrımı iptal.** Yerine tek yol:

### Karar: kopyalama yok, artefakt kopyası yok, başlık bloğu yok

Gerekçe: `scripts/site-icerik-dump.mjs` git'te izleniyor ve çıktı yolu canlı.
Dosya **yeniden üretilebilir**, kaynağı Notion. KIRPMA YASAĞI türetilmiş dosyaya
uygulanmaz (KARAR 456: *"tsv türetilmiş dosyadır; yanlışsa yeniden üretilir, kaynak
veriye dokunulmaz"* — aynı ilke). Brief'in `_arsiv/ocak-site-icerik-2026-08-04.md`
önerisi, üretim yolunun yok sanılmasına dayanıyordu; yol var, öneri düşüyor.

Üç soruya cevap:

1. **Artefakt olarak alınmayacak.** Plandaki türetilmiş-dosya statüsü doğru ve zaten
   fiilen yürürlükte.
2. **Kaynak sorusu düşüyor** — kopyalama yok.
3. **Damga sorusu düşüyor** — başlık bloğu yazılmıyor.

### Bu turda yapılacak tek iş: teyit

```bash
cd ~/Desktop/hlaorpz/ocak-site-clone
echo "=== üretim yolu canlı mı ==="
git ls-files --error-unmatch scripts/site-icerik-dump.mjs && echo "izleniyor ✅"
sed -n '1,30p' scripts/site-icerik-dump.mjs | grep -n "OUT_PATH\|Çıktı"
echo "=== iki kopyanın durumu ==="
for p in ./ocak-site-icerik.md ./docs/ocak-site-icerik.md; do
  [ -f "$p" ] && printf "%-32s %s satır  md5=%s  git=%s\n" "$p" \
    "$(wc -l < "$p" | tr -d ' ')" \
    "$(md5 -q "$p" 2>/dev/null || md5sum "$p" | cut -d' ' -f1)" \
    "$(git check-ignore -q "$p" && echo IGNORED || echo tracked)"
done
```

**Script izlenmiyorsa DUR ve raporla** — o zaman üretim yolu yok demektir ve
karar geri döner.

### Silme izin raporu — site-icerik satırı

Ana brief'teki blokta `find docs -name "*site-icerik*"` satırı **kalıyor**, ama izin
kriteri değişiyor:

> `ocak-site-icerik.md` için silme izni **repoda kopya bulunmasına değil, üretim
> yolunun canlı olmasına** dayanır. `scripts/site-icerik-dump.mjs` izleniyorsa
> izin verilir. Dosyanın kendisi gitignore'lu olabilir — bu beklenen durumdur.

### YENİ — `10-marka.md` sapma kontrolü (bu tur eklendi)

Raporda `docs/10-marka.md` = **235** satır. Project files'taki `ocak-marka.md` =
**236** satır (8 Ağustos ölçümü, `wc -l`, son bayt `0a`). **Bir satır fark var** ve
bu, KARAR 455 gereği project files'ta *kalacak tek dosya*. İki kopyanın ayrışması
tam olarak 455'in önlemek istediği şey.

```bash
cd ~/Desktop/hlaorpz/ocak-site-clone
wc -l -c docs/10-marka.md
md5 -q docs/10-marka.md 2>/dev/null || md5sum docs/10-marka.md
grep -n "Versiyon\|v1\.\|Son güncelleme" docs/10-marka.md | head -5
tail -3 docs/10-marka.md
```

Çıktıyı raporla, **karşılaştırmayı ben yapacağım** — project files kopyası bende.
Bu dosyaya yazma. (Fark yalnız bir sondaki boş satır olabilir; olmayabilir.)

### Envanter tablosu — güncel hâli

| project file | satır | karar | izin kriteri |
|---|---|---|---|
| `ocak-kronoloji.md` | 5641 | SİL | `90-kronoloji/` yaşıyor (6 dosya, 8.250 satır) |
| `ocak-site-icerik.md` | 4821 | SİL | üretim yolu canlı — `site-icerik-dump.mjs` izleniyor |
| `ocak-referans.md` | 3574 | SİL | `20-ref-*` yedi dosya yaşıyor |
| `ocak-pilot.md` | 388 | SİL | `_arsiv/ocak-pilot-v52.md` yaşıyor |
| `Ocak-Mufredat.md` | 275 | SİL | `docs/Ocak-Mufredat.md` · md5 eşit ✅ |
| `ocak-kaynak-kanonu.md` | 172 | SİL | `docs/ocak-kaynak-kanonu.md` · md5 eşit ✅ |
| `ocak-marka.md` | 236 | **KALIR** | KARAR 455 — ama 235/236 farkı ölçülecek |

---

## PARÇA 5 — EKLENECEK MADDELER

### 5.1'in sapma ekine üç satır daha

```markdown
| 8 | HEDEF YAPI `_uretilen/` için ".gitignore — script üretir" diyor | **klasör ignore'da değil**, yedi dosyanın yedisi de izleniyor (`b33-*.py`, `b37-*.py`, `bolme-kod-cozumu.tsv`, ledger teyit dosyaları). Not yalnız `site-icerik.md`'ye uygulanmış; klasör versiyonlanmış bir üretim arşivi olmuş. Doğru olan gerçektir — dönüşüm betiklerinin versiyonlanması KARAR 467(a)'nın gereği |
| 9 | sapma kaydı `sayfa-yazim-rehberi.md`'yi "planda sayılmamış" diye anıyor | teyit edildi: `docs/sayfa-yazim-rehberi.md` 219 satır, yerinde. HEDEF YAPI düzeltilecek olan taraftır (sapma kaydının kendi tespiti) |
| 10 | 6-ek maddesindeki `2026-02.md` + `00-devir.md` endişesi | **teyit edildi, iş yok**: ikisi de `docs/90-kronoloji/` altında (73 ve 503 satır). Ledger sayımı birebir tuttu — 50 + 27 = 77 |
```

### 5.2'ye — KARAR 470'in ilk vakası kronoloji bloğuna

`90-kronoloji/2026-08.md`'ye yazılacak `#k470` bloğunun vaka listesine bu tur eklenir
(bloğu Claude.ai kapanış patch'inde verecek, sen yalnız ledger satırını yaz):

> *Dördüncü vaka, ADIM 4 brief'inin kendisi: brief `ocak-site-icerik.md` için
> "üretim script'i yok" ve "son tazeleme 17:06:37.718Z" yazdı. İkisi de ölçülmemişti —
> biri sözlü cevaptan, öteki `2026-08.md:34`'ten devralınmıştı. CC'nin ADIM 0'ı
> ikisini de çürüttü: script `scripts/site-icerik-dump.mjs` olarak git'te izleniyor,
> damga `17:20:06.647Z`. Kuralı yazan belge kuralı ihlal etti; ADIM 0 tuttu.*

### 5.3'e üçüncü borç

```markdown
## B42 — `site-icerik` üretim yolu HEDEF YAPI ile hizasız

- [ ] **Sahip:** CC · **Tetikleyici:** ADIM 5 (scripts/skills turu)
- **Sorun:** Üç ayrışma var, üçü de aynı dosyanın etrafında:
  (a) `scripts/site-icerik-dump.mjs` çıktıyı **repo köküne** yazıyor; HEDEF YAPI
      `_uretilen/site-icerik.md` diyor (KARAR 455).
  (b) Dosya **iki kopya** hâlinde duruyor — `./ocak-site-icerik.md` ve
      `./docs/ocak-site-icerik.md`, md5 eşit (`6859e845…`), 4.821 satır. İkincisi
      script çıktısı değil; artık kaynağı belirsiz bir kalıntı.
  (c) `.gitignore:4` deseni `ocak-site-icerik.md` — başında `/` yok, **her derinlikte**
      eşleşiyor. `_uretilen/` altına taşınsa da ignore kapsamında kalır.
- **Neden borç değil acil iş:** her iki kopya da aynı içerik, üretim yolu canlı,
  kimse yanlış dosyayı okumuyor. Ama iki kopya = ADIM 0'ın bayat-dump tuzağı
  (KARAR 355) için açık kapı.
- **Eylem (tek tur):** `OUT_PATH` → `docs/_uretilen/site-icerik.md` · `.gitignore`
  deseni kök-bağlı (`/ocak-site-icerik.md`) yapılıp yeni yol için satır eklenir ·
  `docs/ocak-site-icerik.md` kalıntısı kaldırılır · script'in çıktı yolunu okuyan
  tüketici var mı diye tek grep (`grep -rn "ocak-site-icerik" --exclude-dir=node_modules`).
- **Bu turda dokunulmadı:** ADIM 4 doküman turudur; çıktı yolu değişikliği tüketici
  taraması ister ve kod turuna aittir (KARAR 463 ruhu).
- **Kaynak:** ADIM 4 ADIM 0 raporu, Ç1 + Ç2 (8 Ağustos 2026).
```

---

## SIRA

1. **Parça 1** (CLAUDE.md) — commit
2. **Parça 2** (baglam.sh) — commit, beş profil de koşsun
3. **Parça 3 revize** (yukarıdaki teyitler + `10-marka.md` ölçümü + silme izin raporu) — commit
4. **Parça 4** (B36 açılış ölçümü) — ayrı commit, `awk length` kullanma
5. **Parça 5** (sapma eki + ledger 469/470 + B40/B41/**B42**) — commit

`10-marka.md` ölçümünü raporda ayrı başlıkla ver; karşılaştırma bende.

Ana brief'in DUR noktaları aynen geçerli.
