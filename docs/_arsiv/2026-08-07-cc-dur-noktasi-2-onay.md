# CC — DUR NOKTASI 2 · ONAY VE DEVAM

**Bağlam:** `2026-08-07-brief-son-temizlik.md` §1a'da DUR NOKTASI 2 tetiklendi.
**Karar:** Önerin aynen uygulanır. Üç ek var.

---

## 1. ONAY — ÖNERİN DOĞRU

Kronoloji append-only; `2026-08.md:14`'e **dokunulmaz**. Düzeltme aşağı yazılır.
Bu projenin kendi doktrini ve DUR NOKTASI 2'nin amacıyla çelişmiyor: nokta "hiçbir
**yaşayan yol** dangling kalmasın" diyor. Kronoloji satırı yaşayan yol değil,
**tarihsel beyandır** — 7 Ağustos'ta o dosyanın orada olduğu doğruydu ve doğru kalır.

Uygula:

- **6 referans güncellenir:** `b37-pilot-referans-donusumu.py:34` (işlevsel) +
  `02-borclar.md:328` · `20-ref-bot.md:6` · `20-ref-icerik-dili.md:7` ·
  `20-ref-notion.md:8` · `20-ref-protokoller.md:7` (metin işaretçileri)
- **`2026-08.md:14` dokunulmaz**
- **Yol içermeyen 4 anma ve 10 arşiv geçişi dokunulmaz** — doğru ayrım

Senin önerdiğin cümle §3 append'ine girsin, aynen:

> `2026-08.md:14`'teki `docs/_bolme-haritasi.tsv` yolu bu taşımayla bayatladı; dosya
> artık `docs/_arsiv/_bolme-haritasi.tsv`. Satır append-only olduğu için düzeltilmedi —
> kronolojide düzeltme aşağı yazılır.

---

## 2. EK — BEKLENTİ HATASI KAYDA GEÇSİN

Brief "beklenen: 1 dosya" diyordu. Gerçek: **7 canlı referans.** Yedi kat sapma.

Bu KARAR 465'in dördüncü vakası ve en öğreticisi — çünkü hata brief'in *sayısında*
değil, **kapsam varsayımındaydı**: yalnız betiğin dosyayı okuduğu varsayıldı, oysa
beş referans dosyası ve iki markdown da yolu metin olarak anıyordu.

§3 append'ine ekle:

```markdown
**KARAR 465 vakası (dördüncü).** Brief `_bolme-haritasi.tsv`'ye tek referans bekliyordu
(betik). Gerçek: **yedi canlı referans** — bir işlevsel, beşi metin işaretçisi, biri
kronolojide. Hata sayıda değil **kapsam varsayımındaydı**: "bir dosya bunu okuyor"
düşünülmüş, "kaç dosya bundan bahsediyor" sorulmamıştı. Taşıma öncesi referans taraması
`--include` ile tüm ağaçta yapılmalı; işlevsel ve metinsel referans ayrımı **taramadan
sonra** gelir, öncesinde değil. DUR NOKTASI işledi, dosyaya yazılmadı.
```

---

## 3. EK — §6 KAPANDI, VE BİR TUZAK ÇIKTI

Cevabın net: eşleştirme **yereldi**, iddia dar kapsamlıydı. Sonra sekiz benzersiz pilot
satırının tamamını `_arsiv/` hariç tüm canlı `docs/` ağacında (21 `.md`) arattın —
**8/8 küresel tek eşleşme**, ve bulunan dosya/satır kod tablosunun öngördüğüyle birebir.
İki bağımsız yöntem aynı cevabı verdi. Dal B'nin zayıflığı kapandı; B37 sonucu güvenilir.

Üç satır istemiştim, sekizini de yapman doğruydu — benzersiz kaynak satır zaten sekizdi,
örnekleme yerine tam sayım daha ucuzdu.

**Ama asıl bulgu teknik olan:** `grep -rl -F` Türkçe karakterli prefix'lerde **0 sonuç**
döndürdü. Saf Python'la okuyunca eşleşmeler çıktı.

Bu tehlikeli çünkü **0 sonuç, "eşleşme yok" gibi okunur.** Aynı `grep` B37 sırasında
kullanılsaydı sekiz satır "artık" sayılır, dönüşüm eksik yapılır ve hiçbir DUR noktası
tetiklenmezdi — tüm kontroller "artık meşrudur" diyordu. §3 append'ine ekle:

```markdown
**Araç tuzağı — sıfır sonuç ≠ eşleşme yok.** `grep -rl -F` Türkçe karakter içeren
arama dizelerinde 0 sonuç döndürdü; aynı arama saf Python okumasıyla 8/8 eşleşme verdi.
Locale/encoding kaynaklı sessiz başarısızlık, **"eşleşme yok" olarak okunabilir** —
B37'de kullanılsaydı sekiz satır haksız yere "artık" sayılır ve hiçbir DUR noktası
tetiklenmezdi, çünkü tüm kontroller artığı meşru kabul ediyordu. **Negatif sonuç, pozitif
bir kontrolle doğrulanmadan kanıt sayılmaz:** aracın çalıştığı bilinen bir dizeyle
sınanır, sonra aranan dizeye geçilir. KARAR 465'in araç katmanındaki karşılığı.
```

---

## 4. COMMIT

Brief §5'teki mesaja iki satır ekle:

```
chore(arsiv): _bolme-haritasi arşive taşındı, ek-a sınıflandırması düzeltildi

- docs/_bolme-haritasi.tsv → docs/_arsiv/ ; 6 canlı referans aynı commit'te güncellendi
- 2026-08.md:14 dokunulmadı (append-only); düzeltme aşağı yazıldı
- ek-a arşivde kalır: türetilmiş çıktı değil, ADIM 3b yazımının otoritesi
- Arşiv konvansiyonunun nihai hâli kronolojide

KARAR 465 dördüncü vakası: taşıma öncesi referans taraması kapsam varsayımıyla
değil tüm ağaçla yapılır (beklenen 1, gerçek 7).
Araç tuzağı: grep -rl -F Türkçe dizelerde sessiz 0 döndürüyor; negatif sonuç
pozitif kontrolle doğrulanmadan kanıt sayılmaz.
B37 §6 kapandı: eşleştirme yereldi, küresel teyit 8/8 tuttu.

Doküman turu kapandı. Sıfır kod commit'i.
```

---

## 5. DOĞRULAMA — DEĞİŞMEDİ

Brief §1c ve §7 aynen geçerli. Ek olarak:

```bash
cd ~/Desktop/ocak-site-clone

# eski yola işaret eden CANLI referans sıfır olmalı — kronoloji ve arşiv hariç
grep -rn "docs/_bolme-haritasi\|\.\./_bolme-haritasi" \
  --include="*.py" --include="*.sh" --include="*.md" --include="*.ts" --include="*.mjs" \
  docs/ scripts/ src/ 2>/dev/null | grep -v "_arsiv/" | grep -v "90-kronoloji/"

# beklenen: BOŞ

# kronolojideki tarihsel satır YERİNDE durmalı — silinmediğini teyit et
sed -n '14p' docs/90-kronoloji/2026-08.md
```

İkinci komut boş dönerse ya da yol değişmişse **DUR** — append-only ihlali olmuştur.

---

## 6. BUNDAN SONRA

Bu commit'le doküman turu kapanıyor. CC tarafında bekleyen doküman işi yok.
Sıra dosyası (`docs/03-sira.md`) ayrı geliyor — devamın nerede olduğu artık
her sohbette anlatılmayacak, dosyada duracak.
