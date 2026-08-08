# CLAUDE.md — CC SABİT KURALLARI

Bu dosya her oturumda okunur. Kısalığı işlevidir.
Gerekçeler `docs/20-ref-protokoller.md`'de; burada yalnız kural durur.

## 1. ADIM 0 — salt-read önce (KARAR 355)

Her brief ADIM 0 ile açılır: oku, ölç, raporla, **DUR**, onay bekle.
Teşhis dosyadaki koda değil `npm run build` sonrası gerçek `dist/` çıktısına
dayanır. Layout/ritim işlerinde Chrome bağlanır, computed CSS'ten konuşulur —
statik CSS analizi tek başına yetmez (KARAR 419).

"Kod var" ≠ "output var". Sessiz fakirleşme en tehlikeli hata tipidir.

## 2. Gerçeklik spec'i ezer (KARAR 102)

Brief, doküman ve ledger yanılabilir. Ham kanıt üstündür.
Brief'in bir iddiası dosyanın gerçeğiyle çelişiyorsa: **DUR, ikisini de raporla,
düzeltmeyi bekle.** Kendi başına uzlaştırma.

## 3. Çapa disiplini (KARAR 465)

Patch çapası **tek satırdan** alınır ve dosyada **benzersiz** olmalıdır.
Blok-sonu dizeleri, girintili satırlar, birden çok yerde geçen ifadeler çapa olamaz.
Çapa tutmuyorsa durmak doğru reflekstir, hata değil.

Doğrulama kriteri ve sayı beyanı **dosyanın gerçek hâline karşı** yazılır,
beklentiden değil. `N → 0` biçimindeki grep kriterleri, aranan dizenin korunması
gereken tarihsel anlatımda da geçip geçmediği kontrol edilmeden yazılmaz.

## 4. Nicel iddia ölçülebilir olur (KARAR 470)

**(a) Ölçülemeyen rakam yazılmaz.** Dokümana giren her nicel iddia — satır sayısı,
kapsama oranı, "N vaka", "yaklaşık M" — üretilebilir bir komuta dayanmalıdır.
Dayanmıyorsa ya yazılmaz ya `TEYITSIZ` işaretlenir. Bellekten, önceki turdan ya da
brief'ten devralınan rakam ölçülmüş sayılmaz.

**(b) Rakam tek başına değil, yöntemiyle yazılır** — eşik, araç, kaynak kümesi.
"37 sığ satır" değil: "`kaynak` sütununda `^*.md:\d+$` eşleşen ve hedefi dönem
özeti bloğuna düşen 37 satır (`awk` + elle takip, 468 satırlık ledger)."

İki ölçüm çelişirse önce **tanımlar** karşılaştırılır, sonra rakamlar.
Çoğu çelişki tanım çelişkisidir.

*Vakalar: B32'de "~37 sığ satır" rakamının kaynağı bulunamadı; B39'da aynı ölçüm
iki kez yapıldı, 231/232 ve 226/237 verdi — fark karakter-vs-bayt sayımındandı;
B36'nın dört-biçim tablosu (418) ile bağımsız bir sayım (423) çelişti, kriter
yazılınca aynı çıktı.*

### Türkçe metinde bayt ≠ karakter

`mawk`'ta `length($0)` bayt sayar, `LC_ALL` değiştirmez. macOS `awk`'ı sürüme göre
karakter sayabilir. `çığır` = 5 karakter, 9 bayt. Eşik tabanlı sayımdan önce probe:

```bash
printf 'çığır\n' | awk '{print length($0)}'   # 5 → karakter · 9 → bayt
```

Sonucu ölçümün yanına yaz. Karakter sayımı gerekiyorsa `python3` ya da
`LC_ALL=C.UTF-8 wc -m` kullan, `awk` değil.

## 5. KIRPMA YASAĞI (KARAR 61)

İçerik silinmez, kırpılmaz, sadeleştirilmez. Yalnız **taşınır** ya da **dönüştürülür**.
Patch modu ekleme ve değiştirme yapar; çıkarma yapmaz.
Birleştirme yeniden yazımdır — ayrı karar ister.

Bir dosya dağıtıldığında üç şey aynı işin parçasıdır (KARAR 467):
(a) eşleme tablosu — kesim anında, sonradan üretilemez ·
(b) `01-kararlar.tsv`'nin o dosyaya bakan `kaynak` hücrelerinin dönüşümü ·
(c) kapsama + nokta örnekleme doğrulaması.

## 6. Commit disiplini

- Ayrı konu = ayrı commit. Mekanik dönüşüm ile semantik iş asla aynı commit'te olmaz.
- Commit ≠ deploy. "Push edildi" ayrı teyit ister; nihai teyit Vercel'de commit görünürlüğü.
- `--no-ff` merge kararı Kaan'ındır, sen vermezsin.
- Production'a giden merge (KARAR 388): kurtarma tag'i → `--no-commit --no-ff` dry-run →
  push'tan **önce** local `npm run build` + `vitest run` → yeşilse commit+push →
  gerçek iPhone Safari eyeball.
- Brief uygulandıktan sonra `.claude/notes.md`'ye brief adı + madde durumları +
  commit hash'leri yazılır. Yoksa sonraki oturum aynı brief'i ikinci kez koşar.

## 7. Tek klon (KARAR 463)

Bir repo, bir klon, bir aktif CC. Doküman brief'i koşarken eşzamanlı kod brief'i
verilmez — aynı repoda yaşıyorlar, birbirini beklerler.

## 8. Sır dokümanda yaşamaz (KARAR 469)

Token, API key, secret hiçbir doküman dosyasına yazılmaz — env'de ya da credential
store'da yaşar. Dokümanda yalnız yer tutucu durur:
`[TOKEN — n8n credential store, dokümanda tutulmaz]`.

Bir dosyada canlı sır görürsen: **DUR, yazma, Kaan'a bildir.** Rotate kararı onun.
Bu kural commit geçmişine de uygulanır — sır commit'lendiyse rotate etmek tek çözümdür,
dosyadan silmek yetmez.

## 9. Değişmeyen üç şey

- Her sayfa/konu ayrı sohbet (KARAR 52)
- ADIM 0 salt-read, agentlar dahil (KARAR 355)
- iPhone Safari eyeball — merge öncesi, otomatikleşmez

---

**Doküman haritası:** `docs/00-durum.md` (canlı, ≤200 satır) · `01-kararlar.tsv`
(ledger, indeks) · `02-borclar.md` · `03-sira.md` (kuyruk) · `10-marka.md` ·
`20-ref-*.md` (tema referansları, yedi dosya) · `90-kronoloji/YYYY-AA.md`
(append-only, asla yapıştırılmaz) · `_uretilen/` (script çıktısı) · `_arsiv/`.

Ledger **indekstir, referans değil** (KARAR 456). Bir kararın gerekçesi kronolojide
yaşar; tsv oraya işaret eder. tsv türetilmiş dosyadır — yanlışsa yeniden üretilir,
kaynak veriye dokunulmaz.
