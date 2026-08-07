# B32 — `ocak-referans.md` DAĞITIMI · SOHBET AÇILIŞ PAKETİ

**Bu bir CC brief'i DEĞİL.** Claude.ai tarafında, **yeni ve temiz bir sohbette** yapılır.
Aşağıdaki dosyaları o sohbete **ekler**, en alttaki metni **kopyala-yapıştır** yaparsın.

> **Bu paketin kendisini yeni sohbete ekleme.** Bu senin talimatın; girdisi değil.

---

## 0. ÖNCE ÖLÇ — PAKETE SAYI YAZMIYORUM

Bu paket bilerek rakamsız. 6-7 Ağustos turunda üç kez brief'e yazılan sayı dosyanın
gerçeğiyle çeliştiği için KARAR 465 mühürlendi; paket hazırlığı da ona tabi.

Sohbeti açmadan önce şunu çalıştır, **çıktıyı paketle birlikte sakla** — yapıştıracağın
metne gireceğ:

```bash
cd ~/Desktop/ocak-site-clone

echo "=== dağıtılacak dosya ==="
wc -l docs/ocak-referans.md

echo "=== hedef beşli (mevcut hâl) ==="
wc -l docs/20-ref-site.md docs/20-ref-notion.md docs/20-ref-bot.md \
      docs/20-ref-icerik-dili.md docs/20-ref-protokoller.md

echo "=== ledger: ocak-referans.md gösteren kaynak hücreleri ==="
awk -F'\t' 'NR>1 && $6 ~ /^ocak-referans\.md/' docs/01-kararlar.tsv | wc -l

echo "=== ledger toplam ==="
wc -l docs/01-kararlar.tsv

echo "=== borçlar ve durum ==="
wc -l docs/02-borclar.md docs/00-durum.md docs/90-kronoloji/2026-08.md

echo "=== HEAD ==="
git log --oneline -1
```

---

## 1. HANGİ DOSYALARI VERECEKSİN — TAM YOL

Çalışma dizini: **`~/Desktop/ocak-site-clone/`**

### Zorunlu

```
docs/ocak-referans.md              ← dağıtılacak asıl dosya
docs/20-ref-site.md                ← hedef beşli
docs/20-ref-notion.md
docs/20-ref-bot.md
docs/20-ref-icerik-dili.md
docs/20-ref-protokoller.md
docs/01-kararlar.tsv               ← 467 ön koşulu: kaynak hücreleri burada
docs/02-borclar.md                 ← B32 maddesi + ön koşul notu
docs/00-durum.md                   ← dosya indeksi buradan güncellenecek
```

**Neden hedef beşli zorunlu:** ADIM 3'te Pilot'tan onlara içerik indi. Nereye ne
gideceğine karar vermeden önce **orada zaten ne olduğunu** görmek gerekir; yoksa
mükerrer bölüm ya da çelişen iki anlatım doğar. Bu, "patch günü dump günü" ilkesinin
doküman tarafındaki karşılığı.

### VERME

```
docs/90-kronoloji/*.md             — dönem tarihçesi, B32'nin işi değil
docs/_arsiv/*                      — yapısal arşiv, bağlam kirletir
docs/_uretilen/site-icerik.md      — site dump'ı, ilgisiz
```

Kronoloji dilimleri **gerekmez.** B32 bir dağıtım işi, arkeoloji değil — ADIM 3b'nin
tersi. Karar gerekçesi aranmayacak; içerik taşınacak.

---

## 2. YAPIŞTIRACAĞIN METİN

`[...]` yerlerine §0'daki ölçümü yaz.

```
B32 — ocak-referans.md dağıtımı.

⚠ Project files BAYAT. Otorite repoda (docs/). Ekli dosyalar esastır.
Ekli: ocak-referans.md (dağıtılacak) · 20-ref-* beşlisi (hedef) ·
01-kararlar.tsv · 02-borclar.md · 00-durum.md

ÖLÇÜM (7 Ağu, repodan):
- ocak-referans.md: [...] satır
- hedef beşli: site [...] · notion [...] · bot [...] · icerik-dili [...] · protokoller [...]
- ledger'da ocak-referans.md gösteren kaynak hücresi: [...]
- ledger toplam [...] · borclar [...] · durum [...] · 2026-08 [...]
- HEAD: [...]

İş — ocak-referans.md'yi 20-ref-* beşlisine dağıt.

1. ÖNCE ENVANTER. Dosyanın bölüm yapısını çıkar: hangi başlık hangi hedefe
   gidiyor, kaç satır. Beşliye sığmayan blok var mı — altıncı dosya gerekiyor
   mu, yoksa zorlama mı olur? Karar bende değil, ölçümde.

2. HEDEFTE NE VAR. Beşlinin mevcut içeriğini oku. Mükerrer anlatım, çelişen
   iki versiyon, ya da referans'ın daha güncel olduğu blok var mı? Çakışma
   varsa hangisi kalacak — gerekçesiyle söyle, tek tek.

3. BÖLME HARİTASI. ADIM 3'ün _bolme-haritasi.tsv deseni: her kaynak satır
   → hedef. Kesim anında üretilir, sonradan üretilemez (KARAR 467).

4. LEDGER DÖNÜŞÜMÜ — AYNI İŞİN PARÇASI. [...] kaynak hücresi ocak-referans.md
   gösteriyor. KARAR 467 gereği dönüşüm ayrı tura ertelenmez. Ayrı commit
   olabilir (KARAR 465 sıra şartı), ayrı tur olamaz.
   Biçim KARAR 466'ya tabi: #kNNN elle doğrulanmış çapa, :NNNN mekanik
   işaretçi; mekanik dönüşüm #k'yi ezmez.

5. 00-durum.md dosya indeksi. Tablo "ocak-referans.md" diye bir satır
   taşıyorsa güncellenir. Tavan 200 satır (KARAR 457).

6. ocak-referans.md'nin akıbeti: _arsiv/ocak-referans-v1.md. Yapısal arşiv —
   tarih öneki ALMAZ, tanımlayıcı adını korur.

Yöntem: KIRPMA YASAĞI (KARAR 61/88) — içerik silinmez, taşınır. Sığmayan blok
atılmaz, yeri tartışılır. KARAR 456: doğrulanamayan satır yazılmaz.
KARAR 465: sayı beyanı dosyanın gerçeğinden, beklentiden değil.

Önce oku, envanteri ve çakışma listesini raporla, onay bekle. Patch'i sonra yaz.
```

---

## 3. BEKLENEN ÇIKTI

Tek `docs-patch-2026-AA-GG.md` + yanında `ek-*` dosyaları, CC'ye "oku ve uygula":

1. Beş `20-ref-*.md` — dağıtılan bloklar (append ya da hedefli yerleştirme)
2. `_bolme-haritasi-referans.tsv` — kesim anında üretilen eşleme
3. `01-kararlar.tsv` — `kaynak` hücrelerinin dönüşümü (**aynı iş, ayrı commit olabilir**)
4. `02-borclar.md` — B32 kapanışı
5. `90-kronoloji/2026-08.md` — B32 kaydı
6. `00-durum.md` — yalnız dosya indeksi gerekiyorsa
7. `git mv docs/ocak-referans.md docs/_arsiv/ocak-referans-v1.md`

---

## 4. NEDEN AYRI SOHBET

`ocak-referans.md` tek başına 3574 satır; hedef beşliyle birlikte bağlam ağır.
Doküman turu sohbeti beş commit taşıdı, bağlamı doldu (KARAR 52).

---

## 5. GEÇERLİ KARARLAR — B32'Yİ BAĞLAYANLAR

| no | ne diyor |
|---|---|
| **467** | Dosya dağıtımı ledger dönüşümünü **içerir**. Eşleme + dönüşüm + doğrulama aynı işin parçası. Ayrı commit olabilir, ayrı tur olamaz. |
| **466** | `kaynak` iki biçim taşır: `#kNNN` elle doğrulanmış çapa, `:NNNN` mekanik işaretçi. Mekanik dönüşüm `#k`'yi ezmez. |
| **465** | Çapa tek benzersiz satırdan. Sayı beyanı dosyanın gerçeğinden. |
| **462** | Sohbet sonu = tek `docs-patch` dosyası, CC uygular. |
| **457** | `00-durum.md` 200 satır hard cap. |
| **456** | Doğrulanamayan satır yazılmaz. `TEYITSIZ` meşrudur, tahmin değil. |
| **61 · 88** | KIRPMA YASAĞI — içerik silinmez, taşınır. |
| **52** | Her konu ayrı sohbet. |

**Arşiv konvansiyonu:** yapısal arşiv (eşleme tabloları, dağıtılan master'ların son hâli)
tanımlayıcı adını korur, **yeniden adlandırılmaz**. Tur artefaktı (brief, `ek-*`, patch)
`YYYY-AA-GG-` önekli.

---

## 6. B32'DEN SONRA

- **B35** — KARAR 87 üç ayrı şeye atfediliyor; `00-durum.md`'nin ODA_MAP işaretçisi kırık (Claude.ai)
- **B36** — ~37 sığ kaynak satırı `#k` çapasına terfi (Claude.ai)
- **251** — kaynak metni hâlâ bulunamadı; ledger'daki son TEYITSIZ satır
- **ADIM 4** — repoya tam taşıma + `CLAUDE.md` + `baglam.sh` (CC). B01 buna bağlı.

**Hiçbiri ADIM 4'ü kilitlemiyor.** B32 dahil. Sıra tercih meselesidir, zorunluluk değil.

---

## 7. AÇIK BİR SORU — SOHBETİN KARARI DEĞİL, SENİN

Beşliye sığmayan blok çıkarsa iki yol var: altıncı dosya açmak, ya da bloğu en yakın
hedefe zorlamak. İkisi de bedelli — altıncı dosya `baglam.sh` profillerini ve
`00-durum.md` indeksini büyütür; zorlama ise yanlış yerde yaşayan içerik üretir.

Sohbet sana envanterle gelecek. Kararı ölçümü görünce ver, şimdi verme.
