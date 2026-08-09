---
name: ocak-notion
description: Notion Sayfalar DB'sinden taze içerik dump'ı üretir ve section marker sözleşmesini koda karşı doğrular. Metne dokunulacak gün, nokta patch öncesi, ya da bir marker adı değişecekken açılır. Notion'a yazmaz — yalnız okur ve raporlar.
---

# ocak-notion

Taze dump üretir, marker sözleşmesini doğrular. **Notion'a yazmaz** (KARAR 459).

## Sınır

| | `ocak-notion` | `ocak-teshis` |
|---|---|---|
| Neye bakar | **girdi** — Notion içeriği | **çıktı** — `dist/`, computed CSS |
| Sorusu | metin ne diyor, marker sözleşmeye uyuyor mu | özellik gerçekten basılıyor mu |

Dump **teşhis kaynağı değildir** (KARAR 355). Bir şeyin render olup olmadığı `dist/`ten
okunur, dump'tan değil. Dump insan referansıdır ve Kaan Notion'da değişiklik yapınca
geride kalır — bu iki kez yanlış teşhise yol açtı.

## 1. Taze dump (KARAR 439)

**Tam yenilemede opsiyonel, nokta patch'te ŞART.** Metne dokunulacak gün o günkü dump
gerekir; dün üretilmiş dump bugünün gerçeği değildir.

```bash
cd ~/Desktop/hlaorpz/ocak-site-clone
node --env-file=.env scripts/site-icerik-dump.mjs
wc -l docs/_uretilen/site-icerik.md
```

Çıktı: `docs/_uretilen/site-icerik.md`. Kapsam: **Sayfalar DB'nin tamamı, `Durum` filtresi
YOK** — taslak sayfalar dahil. Gövde ham `notion-to-md` çıktısıdır; `remark-ocak-sections`
geçmez, yani `## section:` etiketleri ve ham `*` / `_` delim'ler Notion'daki hâliyle kalır.
Sıra URL alfabetiktir, yani deterministiktir ve iki dump `diff`'lenebilir.

⚠ **Token dokümana yazılmaz** (KARAR 469). Betik `NOTION_TOKEN` ve `NOTION_PAGES_DB_ID`
değerlerini `--env-file=.env` üzerinden alır. Bir dosyada canlı sır görürsen **DUR, yazma,
Kaan'a bildir** — rotate kararı onundur.

Betik yoksa ya da env eksikse **DUR.** Yarım dump'la denetim yapılmaz.

## 2. Marker sözleşmesi doğrulaması (KARAR 409)

Section marker adları serbest metin değil; `splitBodyByMarkers` listesi ya da plugin
switch case'iyle eşleşen **sözleşmedir.** Ad değişimi component'i haftalarca render dışı
bırakabilir ve buton görünmeye devam ettiği için fark edilmez — **sessiz fakirleşme.**

⚠ **Kanonik liste bu dosyaya yazılmaz, koddan okunur.** Gerekçe ölçülü: liste bugün dört
yüzeyde dört farklı sayı taşıyor — `10-marka.md` **8** · `docs/sayfa-yazim-rehberi.md`
**5 + 10** · kod **10** · `/site-rehber` Notion sayfası **11**. Beşinci bir kopya
üretilmez; **kod otoritedir.**

```bash
cd ~/Desktop/hlaorpz/ocak-site-clone

# (a) koddaki kanonik liste — yol aranır, varsayılmaz
grep -rn "CANONICAL_SECTIONS" src/ --include='*.ts' | head

# (b) dump'taki marker satırları — önce say, sonra çıkar
grep -c '^## .*section:' docs/_uretilen/site-icerik.md
grep -o '^## section: [a-z0-9-]*' docs/_uretilen/site-icerik.md \
  | sed 's/^## section: //' | sort -u
```

**(a) ve (b) aynı komutta birleştirilmez.** İki sayı ayrı ayrı raporlanır ve karşılaştırma
gözle yapılır — `grep -o` desen uyuşmazlığında **hata vermez, boş dize döner** ve
karşılaştırma sessizce "tuttu" der (B46).

`grep -c '^## .*section:'` ile ikinci komutun satır sayısı **eşit değilse bozuk marker
vardır.** Bilinen bozuk biçim: `## **section: intro**` — Notion'da kalın yazılmış marker.
Plugin bunu tanımaz; sayfa fallback'e düşer.

**Raporlanacak üç sınıf:**
1. dump'ta var, kodda yok → yeni ad icat edilmiş, o section render edilmiyor
2. kodda var, dump'ta yok → ölü kanal ya da henüz yazılmamış sayfa
3. biçimi bozuk marker (kalın, TR karakterli, boşluklu)

**Teşhis burada biter.** Ad değiştirme ya da kod dokunuşu ayrı karardır; içerik
katmanındaki adlandırma kararı kod katmanıyla **atomik** yürür.

## 3. Ne yapmaz

- Notion'a **yazmaz** — düzeltme Advaita/Kaan tarafından elle girilir (KARAR 459)
- Kanonik section listesini **taşımaz** — koddan okur
- Metin **üretmez** — o `ocak-metin`'in işi
- `dist/` **teşhisi yapmaz** — o `ocak-teshis`'in işi

## Bağlam notu

`docs/20-ref-notion.md` (DB property'leri, schema kuralları, yazım disiplini) bugün
hiçbir `baglam.sh` profilinde değil. Claude.ai yüzeyinde bu skill'e ihtiyaç duyulduğunda
o dosya **elle istenir.** Profil boşluğu kayıtlıdır; burada çözülmez.

## DUR koşulları

1. `.env` yok ya da `NOTION_TOKEN` / `NOTION_PAGES_DB_ID` eksik
2. Dump üretildi ama satır sayısı beklenenin çok altında (kısmi çekim)
3. `CANONICAL_SECTIONS` kodda bulunamıyor — doğrulamanın dayanağı yok
4. Marker sayımı ile çıkarılan ad sayısı tutmuyor (bozuk biçim var)
5. Bir dosyada canlı token görülüyor (KARAR 469)
