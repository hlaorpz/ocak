# DOCS-PATCH MİKRO — 2026-08-08 (HEAD satırı sırası)

**Sahip:** CC · **Repo:** `~/Desktop/hlaorpz/ocak-site-clone` · dal `main`
**Önceki:** `f42911f`

İki satır, tek commit. Bir yapısal kalıntının kapanışı.

**Sorun:** `00-durum.md`'nin HEAD satırı Bölüm 3'te yazıldı, Bölüm 4 iki commit daha
ekledi. Satır doğduğu anda bayattı. Hata değil, sıra sorunu — kendi HEAD'ini kaydeden
dosya patch'in ortasında güncellenirse asla güncel olamaz.

---

## 1 — `docs/00-durum.md`

**ÇAPA (tek satır, ölçerek doğrula):**
```bash
cd ~/Desktop/hlaorpz/ocak-site-clone
grep -c "d914ba1" docs/00-durum.md   # 1 olmalı
```

**ESKİ:**
```
| `main` HEAD | **`d914ba1`** (8 Ağu, ADIM 4 doküman turu) — sıfır kod commit'i, `dist/` değişmedi |
```
**YENİ:** SHA'yı **bu commit atılmadan hemen önce** `git rev-parse --short HEAD` ile ölç
(yani `f42911f` ya da sonrası) ve `XXXXXXX` yerine yaz:
```
| `main` dönem HEAD | **`XXXXXXX`** (8 Ağu, ADIM 4 doküman turu sonu) — canlı HEAD değil, dönemin son commit'i; sıfır kod commit'i, `dist/` değişmedi |
```

Etiket `main HEAD` → `main dönem HEAD` olarak değişti: satır bir **anlık görüntüdür**,
canlı değer değildir. Canlı değer `git rev-parse --short HEAD`'dedir.

---

## 2 — `docs/03-sira.md`

**ÇAPA:**
```
5. **`03-sira.md` — kuyruk sırası, biten `✅`, yeni iş eklenir**
```

**ALTINA EKLE:**
```

**Bölüm sırası bağlayıcıdır.** `00-durum.md`'nin *dönem HEAD* satırı patch'in **son**
bölümünde güncellenir — ortada yazılırsa sonraki bölümlerin commit'leri onu geçer ve
satır doğduğu anda bayatlar. Aynı kural rakam taşıyan her satır için geçerli: satır
sayısı, commit sayısı, dosya boyutu **en son ölçülür** (KARAR 470).
```

---

## DOĞRULAMA

```bash
cd ~/Desktop/hlaorpz/ocak-site-clone
grep -n "dönem HEAD" docs/00-durum.md
grep -n "Bölüm sırası bağlayıcıdır" docs/03-sira.md
wc -l docs/00-durum.md docs/03-sira.md
git log --oneline -1
```

`00-durum.md` 151 → ~152, `03-sira.md` 112 → ~118. Tavan (200) rahat.

**Commit:** `docs: dönem HEAD satırı — anlık görüntü etiketi + patch sırası kuralı`
