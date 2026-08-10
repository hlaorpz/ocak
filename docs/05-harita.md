# OCAK — DOKÜMAN HARİTASI

**Son güncelleme:** 11 Ağustos 2026 · B47

> Bu dosya **liste değildir.** Dosya listesi iki yerde zaten var ve ikisi de geçerli:
> `CLAUDE.md` sonundaki *Doküman haritası* paragrafı (CC'nin oturum başında gördüğü) ve
> `00-durum.md` başındaki *Ne arıyorsan / Nereye bak* tablosu (soru → dosya yönlendirmesi).
> Burada üçüncü bir liste **kurulmaz** — kurulsaydı üçü ayrışırdı, ki B55 tam olarak bu.
>
> Bu dosya iki şeyi taşır: **çelişkide hangi yüzeyin kazandığı**, ve **her dosyanın ne
> taşıyıp ne taşımadığı**. İkisi de başka hiçbir yerde yazılı değildi.

---

## 1 · OTORİTE SIRASI

İki yüzey aynı şey hakkında farklı şey söylüyorsa, **üstteki kazanır.**

| # | yüzey | dayanak |
|---|---|---|
| 1 | **Ham gerçeklik** — `git`, `dist/`, canlı sistem, API cevabı | KARAR 102: gerçeklik spec'i ezer |
| 2 | **Kronoloji** (`90-kronoloji/`) — bir olayın ne zaman, neden olduğu | KARAR 61: append-only, düzeltilmez |
| 3 | **Gövde metni** — `02-borclar.md` madde gövdeleri, `20-ref-*` bölümleri | ayrıntı gövdede yaşar |
| 4 | **İndeks / tablo / sayaç** — `01-kararlar.tsv`, sahip tabloları, `00-durum.md` yönlendirme tablosu, `CLAUDE.md` harita paragrafı | KARAR 456: ledger indekstir, referans değil |
| 5 | **Ayna** — project files kopyaları, `10-marka.md`'nin claude.ai kopyası | KARAR 471: repo kazanır |

### Bundan çıkan üç kural

**(a) İndeks, indekslediği gövdeyi asla yenmez.** Sayaç gövdeyle çelişiyorsa sayaç
yanlıştır; gövde sayılır, sayaç yeniden yazılır. Ters yön hiçbir zaman yapılmaz.

**(b) Türetilmiş dosya düzeltilir, append-only dosya not alır.** `01-kararlar.tsv`
türetilmiştir — yanlışsa yeniden üretilir (KARAR 456). `90-kronoloji/` append-only'dir —
yanlış bile olsa düzeltilmez, altına **not** düşülür (KARAR 61). Aynı hataya iki dosyada
aynı işlem uygulanmaz.

**(c) Konvansiyon, işaret ettiği kararla birlikte doğrulanır.** "KARAR X'e göre" diye
anılan bir kural, X'in ledger'daki durumu ve başlığıyla sınanır. Sınanmamış konvansiyon
kalıcı bir kuralı yürürlükten kalkmış bir karara bağlayabilir.

⚠ **Ölçüm her zaman beyanı yener** (KARAR 470) — ve bu sıranın dışındadır, üstündedir.
Bir dosyanın kendi hakkındaki beyanı da ölçülür.

---

## 2 · DOSYA SÖZLEŞMELERİ

Her dosya için: **ne taşır · ne taşımaz · kim yazar · nasıl bozulur.**

### `CLAUDE.md` — CC sabit kuralları
- **Taşır:** her oturumda geçerli kurallar, kısa.
- **Taşımaz:** gerekçe (→ `20-ref-protokoller.md`), durum, mutlak yol.
- **Yazar:** Claude.ai kararıyla, CC eliyle.
- **Bozulma biçimi:** şişer. Kısalığı işlevidir; uzarsa okunmaz ve kural sessizce düşer.

### `00-durum.md` — canlı durum
- **Taşır:** şu an neredeyiz, kod/deploy gerçeği, yayını kilitleyenler, açık cepheler.
  **≤200 satır hard cap** (KARAR 457).
- **Taşmaz:** karar durumu (→ ledger), borç detayı (→ `02-borclar.md`), tarihçe (→ kronoloji).
  İkisini de **tekrar etmez, işaret eder.**
- **Yazar:** her sohbet sonu patch'i, hedefli blok değişimiyle.
- **Bozulma biçimi:** cap'e dayanır ve en eski dönem bloğu kronolojiye inmelidir.
  İnmezse ya kırpılır (yasak) ya cap aşılır.

### `01-kararlar.tsv` — karar ledger'ı
- **Taşır:** karar numarası, başlık, durum, ilişki, kaynak çapası. **İndekstir.**
- **Taşımaz:** gerekçe. Bir kararın *neden* alındığı kronolojide yaşar; tsv oraya işaret eder.
- **Yazar:** `ocak-kararci` satırı üretir, `ocak-arsivci` yazar. Türetilmiş dosyadır.
- **Bozulma biçimi:** çapa sığlaşır — `kaynak` hücresi satır numarası gösterir, satır kayar,
  çapa komşuyu gösterir ve **yanlış olduğu görünmez** (B36 · B38).

### `02-borclar.md` — açık tutarsızlıklar defteri
- **Taşır:** fark edilmiş ama kapatılmamış tutarsızlıklar. Gövde otoritedir.
- **Taşımaz:** ürün işi (ödeme, WhatsApp, Instagram, mail akışları) — o kuyruk başka yerde.
  **Yapılacaklar listesi değildir.**
- **Yazar:** her sohbet sonu patch'i.
- **Bozulma biçimi:** başındaki sayaç ve sahip tablosu gövdelerden ayrışır (B55).
  Kural: **her eklemede yeniden ölçülür, devralınmaz** (KARAR 470).

### `03-sira.md` — kuyruk
- **Taşır:** sıradaki iş, kim yapar, nerede, nasıl açılır. **Kısa kalır.**
- **Taşımaz:** gerekçe, durum tekrarı, tarih anlatısı. Şişerse yanlış kullanılıyordur.
- **Yazar:** her sohbet sonu patch'i (KARAR 468, beşinci bölüm).
- **Bozulma biçimi:** aynı işin maliyetini `02-borclar.md`'den farklı tahmin eder.
  Çelişkide **borçlar dosyası kazanır** — gövde, indeksi yener. (B01'de ölçüldü:
  sıra "ucuz" dedi, borçlar "maliyet küçük değil" dedi, borçlar haklıydı.)

### `10-marka.md` — marka çekirdeği
- **Taşır:** marka özü, kısa.
- **Yazar:** Advaita içerik otoritesi; Claude.ai yazım.
- **Özel durum:** project files'daki kopyası **elle tazelenen tek aynadır** (KARAR 455/471).
  Çelişkide repo kazanır.

### `20-ref-*.md` — tema referansları (yedi dosya)
- **Taşır:** "şu an nasıl" bilgisi. `site` · `marka` · `program` · `protokoller` ·
  `icerik-dili` · `notion` · `bot`.
- **Taşımaz:** tarihli anlık görüntü. Bir blok "31 Mayıs 2026 itibarıyla" diyorsa
  kronolojiye aittir — çünkü KIRPMA YASAĞI onu düzeltmeyi yasaklar ve bayat kalır (B59).
- **Yazar:** Claude.ai, konu turlarında.
- **Bozulma biçimi:** tarihli blok içeride kalır ve dosya "şu an" iddiasını taşırken
  geçmişi anlatır.

### `90-kronoloji/YYYY-AA.md` — append-only tarihçe
- **Taşır:** ne oldu, neden oldu, hangi ölçüm neyi gösterdi. Gerekçenin tek otoritesi.
- **Taşımaz:** düzeltme. Yanlış bile olsa değişmez; altına not düşülür.
- **Yazar:** her sohbet sonu patch'i, **append**.
- **Bozulma biçimi:** yapıştırılırsa bağlamı boğar — asla yapıştırılmaz, MCP'den çekilir.

### `docs/skills/` — kanonik skill kaynağı
- **Taşır:** altı skill'in tek doğru kopyası (KARAR 458).
- **Yazar:** CC. Değiştiğinde `skill-sync.sh sync` + zip'lerin claude.ai'ye elle yüklenmesi (B50).
- **Bozulma biçimi:** claude.ai yüzeyi bayatlar ve **`--check` bunu göremez** — zip'in
  üretildiğini denetler, yüklendiğini değil. Bayatlığın bedeli dosyanın taşıdığına bağlı:
  **yol** bayatlığı gürültülüdür (CC durur), **kural** bayatlığı sessizdir (yanlış yargı).

### `docs/_uretilen/` · `docs/_arsiv/`
- **`_uretilen`:** betik çıktısı ve koşum kaydı. Elle düzeltilmez; betik yeniden koşulur.
- **`_arsiv`:** koşulmuş brief'ler ve emekli sürümler. **Asla düzeltilmez** —
  koşulduğu günün kaydıdır ve o gün doğruydu.

---

## 3 · KAPSAM DIŞI YÜZEYLER

Repoda görünmeyen, dolayısıyla MCP'den de görünmeyen (KARAR 479):

| yüzey | kim görür |
|---|---|
| `.claude/settings.local.json` · `.claude/notes.md` | yalnız CC, yerel diskte |
| GitHub ayarları · Vercel paneli · Railway paneli · claude.ai connector | yalnız Kaan |
| Vercel MCP (`get_project` · `list_deployments`) | yalnız Claude.ai |
| Notion içeriği | Claude.ai (dump üzerinden) · Advaita/Kaan (panelde) |

⚠ Brief, CC'nin göremediği bir yüzeyden **rapor istemez.** Yapılamayacak iş brief'e yazılmaz.

---

## 4 · BU DOSYANIN BAKIMI

**Ne zaman güncellenir:** yeni bir dosya doğduğunda, bir dosyanın sözleşmesi değiştiğinde,
ya da otorite sırasına yeni bir vaka eklendiğinde. Sohbet sonu patch'inin rutin parçası
**değildir** — rutin olsaydı şişer ve okunmazdı.

**Ne zaman güncellenmez:** rakam değiştiğinde. Burada sayaç yok, bilerek.

**Bu dosya kendi otoritesini iddia etmez.** Kural 1(a) buna da uygulanır: bir dosyanın
gövdesi burada yazılanla çelişiyorsa **gövde kazanır**, ve bu dosya düzeltilir.
