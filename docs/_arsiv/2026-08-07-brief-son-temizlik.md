# CC BRIEF — SON TEMİZLİK · `_bolme-haritasi` KONUMU + `ek-a` SINIFLANDIRMASI

**Sahip:** CC
**Ön koşul:** `109539d` main'de — KARŞILANDI
**Kapsam:** Tek commit. Kod yok, ledger yok, borç yok.

Kapanış commit'inin bıraktığı iki artık. İkisi de senin raporunun sonucu.

---

## 0. ADIM 0

```bash
cd ~/Desktop/ocak-site-clone || { echo "DİZİN YOK — dur, raporla"; exit 1; }

git status --short          # boş olmalı
git log --oneline -1        # 109539d olmalı

ls -la docs/_bolme-haritasi.tsv
ls -la docs/_arsiv/ | head -20
```

Çalışma ağacı temiz değilse ya da HEAD `109539d` değilse **DUR ve raporla.**

---

## 1. `_bolme-haritasi.tsv` → `_arsiv/`

**Karar:** taşınır. Taşımaman doğru refleksti ama gerekçe tam oturmuyordu —
KARAR 467 *dağıtımı referans dönüşümü olmadan yapmayı* yasaklar, taşımayı değil.
Referansıyla **aynı commit'te** taşınırsa sessiz kırılma tanımı gereği oluşmaz.

Bırakılırsa iki ikiz dosya iki ayrı yerde durur: `kronoloji-satir-esleme.tsv` arşivde,
`_bolme-haritasi.tsv` `docs/` kökünde. `00-durum.md`'nin dosya indeksinde de yok.

### 1a — Önce tüm referansları bul

```bash
cd ~/Desktop/ocak-site-clone

grep -rn "_bolme-haritasi" \
  --include="*.py" --include="*.sh" --include="*.md" --include="*.ts" --include="*.mjs" \
  docs/ scripts/ src/ 2>/dev/null
```

Çıkan her satırı not et. **Beklenen: `docs/_uretilen/b37-pilot-referans-donusumu.py`.**
Başka dosya çıkarsa hepsi aynı commit'te güncellenir — biri atlanırsa taşıma
tam da önlemek istediğimiz kırılmayı üretir.

### 1b — Taşı ve referansları güncelle

```bash
cd ~/Desktop/ocak-site-clone

git mv docs/_bolme-haritasi.tsv docs/_arsiv/_bolme-haritasi.tsv
```

Sonra 1a'da bulunan her dosyada yolu `docs/_arsiv/_bolme-haritasi.tsv` olarak düzelt.
**Betiği elle düzenle, `sed -i` ile toplu değiştirme yapma** — yol dizesi göreli ya da
mutlak olabilir, kör değiştirme ikisini de bozabilir.

### 1c — Doğrula

```bash
cd ~/Desktop/ocak-site-clone

test -f docs/_arsiv/_bolme-haritasi.tsv && echo "yeni yol: VAR"
test -f docs/_bolme-haritasi.tsv && echo "ESKİ YOL HÂLÂ VAR — DUR"

# eski yola işaret eden kalıntı sıfır olmalı
grep -rn "docs/_bolme-haritasi\|\.\./_bolme-haritasi" \
  --include="*.py" --include="*.sh" --include="*.md" --include="*.ts" --include="*.mjs" \
  docs/ scripts/ src/ 2>/dev/null | grep -v "_arsiv/"

# satır ve sütun bütünlüğü korundu mu
wc -l docs/_arsiv/_bolme-haritasi.tsv                                    # 404
awk -F'\t' 'NF!=3{print "SAPMA satır "NR}' docs/_arsiv/_bolme-haritasi.tsv
```

Son grep **boş dönmeli.** Dönmüyorsa kalan referans var, commit'leme.

---

## 2. `ek-a` KALIR — §1 DÜZELTMESİ

**Karar:** silme. Talimatı dar okuyup bırakman doğruydu; hata bendeydi.

Kapanış brief'inin §1'i *"türetilebilir veri arşive girmez"* derken `ek-a`'yı yanlış
sınıfa koydu. `ek-a` türetilmiş bir çıktı değil, **ADIM 3b yazımının otoritesidir** —
`ek-b` ve `ek-c` ile aynı sınıf, ve onları tarihli adla tuttuk. Silinirse üçlünün tek
eksiği olur: tutarsızlık, sadeleşme değil.

`2026-08-07-ek-a-tsv-satirlari.tsv` **yerinde kalır.** Dosyaya dokunma.

Kontrol:
```bash
cd ~/Desktop/ocak-site-clone
ls docs/_arsiv/2026-08-07-ek-*
```
Üçü de görünmeli: `ek-a` · `ek-b` · `ek-c`. (`ek-d` iptal edilip silindi, `ek-e` ayrı.)

---

## 3. `docs/90-kronoloji/2026-08.md` — APPEND

Dosya sonuna:

```markdown

---

## SON TEMİZLİK (7 Ağustos 2026)

**`_bolme-haritasi.tsv` arşive alındı.** Kapanış turunda `docs/` kökünde kalmıştı;
`kronoloji-satir-esleme.tsv` ile aynı sınıf yapısal arşiv dosyası olduğu hâlde ikizinden
ayrı yerde duruyordu. Referansı (`_uretilen/b37-pilot-referans-donusumu.py`) **aynı
commit'te** güncellendi. KARAR 467 dağıtımı referans dönüşümü olmadan yapmayı yasaklar,
taşımayı değil — referansıyla birlikte taşınan dosya sessiz kırılma üretmez.

**`ek-a` sınıflandırma düzeltmesi.** Kapanış brief'inin §1'i *"türetilebilir veri arşive
girmez"* derken `ek-a`'yı yanlış sınıfa koyuyordu. `ek-*` dosyaları türetilmiş çıktı
değil, ilgili yazımın **otoritesidir** — tur artefaktı sınıfına girer, brief'lerle aynı.
Üçü de (`ek-a` · `ek-b` · `ek-c`) arşivde kalır. CC talimatı dar okuyup silmemişti;
doğru davranıştı.

**Arşiv konvansiyonunun nihai hâli:**

| sınıf | adlandırma | örnek |
|---|---|---|
| yapısal arşiv | tanımlayıcı ad, **yeniden adlandırılmaz** | `kronoloji-satir-esleme.tsv` · `_bolme-haritasi.tsv` · `ocak-kronoloji-v1.md` · `ocak-pilot-v52.md` |
| tur artefaktı | `YYYY-AA-GG-` önekli | brief'ler · `ek-*` · patch |

Yapısal dosyalar **tek dizinde** durur; ikisi ayrı yerde kalırsa altı ay sonra ikincisi
aranır ve bulunamaz.

**Doküman turu bu commit'le tamamen kapandı.** Altı commit: `6fb214c` · `34ff46c` ·
`4ddb6e1` · `f0b48da` · `109539d` + bu. **Sıfır kod commit'i.**
```

---

## 4. `docs/00-durum.md`

**Dokunma.** Tek kontrol:
```bash
cd ~/Desktop/ocak-site-clone
wc -l docs/00-durum.md      # ≤200
```

---

## 5. COMMIT

```
chore(arsiv): _bolme-haritasi arşive taşındı, ek-a sınıflandırması düzeltildi

- docs/_bolme-haritasi.tsv → docs/_arsiv/ ; b37 betiğinin yolu aynı commit'te güncellendi
- ek-a arşivde kalır: türetilmiş çıktı değil, ADIM 3b yazımının otoritesi
- Arşiv konvansiyonunun nihai hâli kronolojide

Doküman turu kapandı. Sıfır kod commit'i.
```

---

## 6. CEVAPSIZ SORU — RAPORLA

B37'de içerik eşleştirmesi **tüm `docs/` ağacında mı** yapıldı, yoksa kod çözüm
tablosunun öngördüğü dosyada mı?

Fark: yereldiyse "23/23 tek eşleşme" iddiası dar kapsamlıdır — kod tablosu hem girdi
hem doğrulama olur, döngü kapanır. Küreselse iki bağımsız yöntem aynı cevabı vermiş olur
ve Dal B'nin zayıflığı kapanır.

**Commit'i geri döndürme, yeniden çalıştırma.** Nokta örnekleme 5/5 geçti, sonuç
güvenilir. Yalnız kapsamı söyle — kayda geçsin.

İstersen ucuz bir teyit: üç satır seç, metnini `grep -rn` ile **tüm `docs/`**'ta ara,
tek eşleşme mi bak. Üçü de tekse küresel iddia ampirik destek almış olur.

---

## 7. DUR NOKTALARI

1. `git status` temiz değilse ya da HEAD `109539d` değilse
2. 1a'da beklenmeyen bir referans dosyası çıkarsa — hepsi güncellenmeden commit yok
3. 1c'deki kalıntı grep'i boş dönmezse
4. `_bolme-haritasi.tsv` taşıma sonrası 404 satır / 3 sütun değilse
5. Yapısal arşiv dosyalarından birini **yeniden adlandırmaya** kalkarsan
6. `ek-a`'yı silersen

---

## 8. BUNDAN SONRA

**CC tarafında doküman işi yok.** Sıradaki iş **B32** — Claude.ai, ayrı sohbet
(`ocak-referans.md` 3574 satır). Ön koşulu KARAR 467: eşleme tablosu kesim anında
üretilir, 28 `kaynak` hücresinin dönüşümü aynı işin parçasıdır.

Kuyrukta ayrıca B35 (KARAR 87 üç atıf) · B36 (~37 sığ kaynak satırı) · 251'in kaynak
metni. Hiçbiri **ADIM 4**'ü kilitlemiyor.
