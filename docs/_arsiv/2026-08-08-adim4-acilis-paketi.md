# ADIM 4 — YENİ SOHBET AÇILIŞI

**Bu dosyayı sohbete EKLEME.** Senin talimatın; girdisi değil.
Üç şey var: **(1)** büyük resim kararı, **(2)** eklenecek dosyalar, **(3)** kopyalanacak prompt.

---

## 0. ÖNCE: `b32-duzeltme-04.md`'yi CC'ye uygulat

⚠ **Bu paketi kullanmadan önce yedinci commit atılmalı.** Paket hazırlanırken iki
project file'ın hiç dağıtılmadığı görüldü — `ocak-kaynak-kanonu.md` (172 satır) +
`Ocak-Mufredat.md` (275 satır), 232 anlamlı satırın 231'i başka hiçbir yerde yok.
`b32-duzeltme-04.md` bunun için **B39**'u açar ve kuyruğu yeniden sıralar.

O commit atılmadan ADIM 4 sohbeti açılırsa, karşı taraf kuyruğu eksik görür.

B32 kapandı: altı commit push edildi (`b50b580` → `73013df`), yedincisi B39 kaydı.
Sonraki sohbet doküman patch'i devralmıyor; sıfırdan ADIM 4'e başlıyor.

---

## 1. BÜYÜK RESİM — sıra ve gerekçesi

Kuyruk şu an: **ADIM 4 · B35 · B36 · 251 · ADIM 5-6 · ADIM 7 · B38**

B32'nin çıkardığı sorunlar bu kuyruğa düzgün oturmuyor — hepsi "B36" adı altında
yığıldı ve B36 artık **beş ayrı iş** taşıyor. Doğru ayrım:

| sorun | tür | kim çözer |
|---|---|---|
| 5 sığ çapa vakası | **emek** — tek tek metin bulma | Claude.ai |
| 418 mekanik çapanın komşu-gösterme oranı | **ölçüm** — grep işi | **CC** |
| `kaynak`ta iki tanımsız biçim (8+7) | **karar** — şema genişletme | Claude.ai |
| `iliski` sütunu not taşıyor, kaç satır bilinmiyor | **ölçüm + karar** | CC ölçer, Claude.ai karar verir |
| 9 durum etiketi prose'da, 427 iki dosyada ayrışmış | **temizlik** | Claude.ai |
| Enum rename iki kayıt | **temizlik** | Claude.ai |

**Kritik ayrım: ölçüm CC'nin işi, karar Claude.ai'nin.** Bugüne kadar ikisi
karışıyordu — "~37 sığ satır" rakamı tam bu yüzden doğrulanmamış bir tahmin olarak
dokümana girdi ve bir gün gerçek sanıldı.

### Karar: ADIM 4 önce, ve ölçümü içine al

**Neden ADIM 4 önce** (KARAR 460 "doküman kalitesi tesisattan önce" ile çelişmez):

1. **Doküman kalitesi işi zaten bitti.** ADIM 1-3b + B32-B34-B37 tamamlandı. Kalan
   (B35, B36, 251, şema) **rafinasyon**, temel değil. KARAR 460 temel içindi.
2. **Bugün ADIM 0 disiplini üç kez hata yakaladı** — hepsi Claude.ai tarafındaki
   hatalar. O disiplin şu an her sohbette elle yapıştırılıyor. `CLAUDE.md` onu
   otomatikleştirir. Sonraki her tur bundan kazanır — B35 ve B36 dahil.
3. **B35/B36/251 üçü de Claude.ai işi ve her biri elle bağlam yapıştırmayla açılıyor.**
   `baglam.sh` o paketi tek komuta indirir. ADIM 4'ü sonraya bırakmak üç sohbeti de
   pahalı yoldan açmak demek.
4. **`20-ref-*` yapısı şu an stabil** (yedi dosya, B32 ile oturdu). `baglam.sh`
   profilleri ancak stabil bir yapı üstüne kurulur. Zamanlama şimdi doğru.

**Neden ölçüm ADIM 4'ün içinde:**

B36'nın boyutu bilinmiyor ve boyutu bilinmeden **elle mi yoksa `ocak-kararci` ile mi**
yapılacağına karar verilemez. Ölçüm üç grep — CC'nin işi, yargı gerektirmiyor, ADIM 4
zaten o dosyalara dokunuyor. Ayrı sohbet açmaya değmez.

Ölçüm çıktısı ADIM 5-6'nın kapsamını da belirler: oran yüksekse `ocak-kararci`'nin
bir **onarım modu** olması gerekir, düşükse gerekmez.

### ⚠ B39 ADIM 4'ü kısmen kilitliyor

`ocak-kaynak-kanonu.md` + `Ocak-Mufredat.md` = **447 satır, hiçbir yere dağıtılmamış.**
KARAR 455 gereği ADIM 4 project files'ı `10-marka.md` dışında temizleyecek — dağıtım
önce gelmezse o 447 satır silinir (KIRPMA YASAĞI).

**Kilit kısmi:** `CLAUDE.md`, `baglam.sh` ve ölçüm dosyası B39'suz yazılabilir.
**Yalnız project-files temizliği** B39'a bağlı. Yani ADIM 4 brief'i şimdi yazılır,
temizlik adımı "B39 sonrası" diye işaretlenir.

### Sonraki dört tur

| # | tur | kim | ne |
|---|---|---|---|
| 1 | **ADIM 4** | Claude.ai brief → CC uygular | `CLAUDE.md` + `baglam.sh` + **ölçüm dosyası** · temizlik B39'a ertelenir |
| 1b | **B39** | Claude.ai | iki dosyanın dağıtımı — B32 deseni. ADIM 4 ile paralel yürüyebilir |
| 2 | **Doküman turu 2** | Claude.ai | şema KARAR'ı (kaynak biçimleri + `iliski`) · B35 (KARAR 87) · 251. **Ölçümlü gelir.** |
| 3 | **B36** | ölçüm belirler | elle mi, agent mı — 2. turun sonunda belli olur |
| 4 | **ADIM 4 temizlik** | CC | project files → yalnız `10-marka.md`. B39 bitince |

Sonra: ADIM 5-6 → ADIM 7 → **B38** (terminal denetim, kuyruğun sonu).

---

## 2. SOHBETE EKLENECEK DOSYALAR — 8 ADET

Çalışma dizini: `~/Desktop/hlaorpz/ocak-site-clone/`

```
docs/2026-08-06-ocak-gecis-plani.md
docs/00-durum.md
docs/03-sira.md
docs/02-borclar.md
docs/01-kararlar.tsv
docs/20-ref-protokoller.md
docs/10-marka.md
docs/_arsiv/_bolme-haritasi-referans.tsv
```

```bash
open ~/Desktop/hlaorpz/ocak-site-clone/docs
```

**Neden bu sekiz:**
- **geçiş planı** — ADIM 4'ün spec'i. Sonundaki **SAPMA KAYDI** kritik: plan gövdesi
  beş yerinden bayat, brief oradan yazılamaz.
- **protokoller** — `CLAUDE.md` bu dosyadan damıtılacak. Tam metin lazım.
- **marka** — `baglam.sh`'ın `marka` profili artık iki dosya görmeli; ilişkiyi
  kurmak için ikisi de bilinmeli.
- **bölme haritası** — `_uretilen/` ve `_arsiv/` klasör yapısının fiili hali.

**Diğer altı `20-ref-*` VERİLMEYECEK.** Gövdeleri toplam ~1900 satır ve `baglam.sh`
profilleri için gereken tek şey **ne taşıdıkları** — o da her dosyanın ilk on satırındaki
"Ne taşır / Ne taşımaz" başlığında. Prompt karşı taraftan bunları istemesini söylüyor.

---

## 3. PROMPT — AŞAĞIDAKİ BLOĞU KOPYALA

```
ADIM 4 — repoya tam taşıma + CLAUDE.md + baglam.sh. Brief yazımı.

⚠ Project files BAYAT. Otorite repoda (docs/). Ekli dosyalar esastır.
Repo: ~/Desktop/hlaorpz/ocak-site-clone · HEAD 73013df · main'e push edilmiş.

B32 dün kapandı: ocak-referans.md dağıtıldı, 20-ref-* beşli → YEDİLİ oldu
(program + marka eklendi). Doküman patch'i uygulanmış durumda, devralınacak
iş yok.

⚠ SAYI BEYANI: Bu promptta hiçbir satır sayısı yok, bilerek. KARAR 465 gereği
ölçümü ekli dosyalardan SEN yap. Hatırladığın rakamı kullanma; ekli olmayan
dosya hakkında rakam yazma — gerekirse iste.

⚠ GEÇİŞ PLANI BAYAT. docs/2026-08-06-ocak-gecis-plani.md'nin GÖVDESİ beş
yerinden eskidir. Dosyanın SONUNDAKİ "SAPMA KAYDI" bloğunu önce oku; brief
gövdeye göre değil sapma kaydına göre yazılır. En riskli ikisi: baglam.sh
profilleri (beş dosya sayıyor, yedi var) ve durum enum'u (yedi sayıyor,
dokuz kullanılıyor).

İş — ADIM 4 için CC brief'i yaz. Dört parça:

1. CLAUDE.md. 20-ref-protokoller.md'den damıtılacak CC sabit kuralları.
   Kısa olacak — her CC oturumunda okunuyor. Çekirdek: ADIM 0 salt-read
   (KARAR 355), reality-overrides-spec (KARAR 102), çapa disiplini (465),
   commit disiplini, KIRPMA YASAĞI (61/88).
   ⚠ Buna bir kural EKLE — iki parçalı:
   (a) Dokümana giren her nicel iddia ölçülebilir olmalı; ölçülemiyorsa
       yazılmaz ya da teyitsiz işaretlenir. Gerekçe: B32'de "~37 sığ satır"
       rakamının kaynağı bulunamadı, tahmin olarak girip gerçek sanılmıştı.
   (b) Rakam tek başına değil, ÜRETİLDİĞİ YÖNTEMLE yazılır — eşik, araç,
       kaynak kümesi. Gerekçe: B39'da aynı ölçüm iki kez yapıldı, 231/232 ve
       226/237 çıktı; fark kaynak kümesinden ve karakter-vs-bayt sayımından
       geliyordu (Türkçe harfler `awk length`'te iki bayt sayılır, "60+
       karakter" eşiği kayar). Yöntem yazılmazsa sapma teşhis edilemez.

2. baglam.sh. Profil bazlı bağlam paketi → pbcopy. Planın dört profili
   (kod · icerik · marka · bot) YEDİ dosyaya göre yeniden kurulacak.
   20-ref-program.md ve 20-ref-marka.md şu an hiçbir profile girmiyor.
   Çıktının ilk satırı manifest olacak (İÇERİR / İÇERMEZ).
   Yedi 20-ref-* dosyasının "Ne taşır/Ne taşımaz" başlıkları ekli değil —
   profil tasarımı için gerekiyorsa iste, uydurma.

3. Repoya tam taşıma. Plan "ADIM 4 sonrası yalnız 10-marka.md kalır"
   diyor (KARAR 455). Project files envanteri (8 Ağustos ölçümü):

     ocak-kronoloji.md    5641  → dağıtıldı (ADIM 3), kopya bayat, SİLİNİR
     ocak-site-icerik.md  4821  → _uretilen/, script üretir, SİLİNİR
     ocak-referans.md     3574  → dağıtıldı (B32), kopya bayat, SİLİNİR
     ocak-pilot.md         388  → dağıtıldı (ADIM 3), kopya bayat, SİLİNİR
     ocak-marka.md         236  → docs/10-marka.md, KALIR (KARAR 455)
     Ocak-Mufredat.md      275  → ⚠ HİÇ DAĞITILMADI — B39
     ocak-kaynak-kanonu.md 172  → ⚠ HİÇ DAĞITILMADI — B39

   ⚠ Temizlik adımı brief'te "B39 SONRASI" diye işaretlenecek. B39 bitmeden
   çalıştırılırsa 447 satır silinir (KIRPMA YASAĞI, KARAR 61/88).

4. ÖLÇÜM DOSYASI — ayrı commit, CC'nin mekanik işi. Üç sayım:
   (a) 418 mekanik ":NNN" çapasından rastgele 15-20 satır → çapası kendi
       metnine mi, komşusuna mı, hiçbir yere mi bakıyor. Oran çıkar.
   (b) iliski sütununda "→ ← ↔" dışı içerik taşıyan satır sayısı.
   (c) kaynak sütunundaki dört biçimin güncel dağılımı.
   Çıktı: docs/_uretilen/olcum-2026-08.md. Bu ölçüm B36'nın boyutunu ve
   ADIM 5-6'daki ocak-kararci'nin onarım modu gerekip gerekmediğini
   belirleyecek.
   ⚠ Örneklem numaralarını CC seçmez — brief'te sabit liste olacak ya da
   Kaan verecek. Seçen taraf kendi kör noktasına göre seçer.

Geçerli kararlar:
- 460 — doküman kalitesi tesisattan önce. ADIM 1-3b bitti; ADIM 4 artık meşru.
- 465 — çapa tek benzersiz satırdan; sayı beyanı dosyanın gerçeğinden
- 463 — tek klon, paralel CC yok
- 464 — secret dokümanda yaşamaz, env'de
- 458 — ADIM 5-6 kadro tanımı (ocak-arsivci · teshis · lint · kararci · metin)
- 455 — project files'ta yalnız 10-marka.md kalır
- B39 — iki project file dağıtılmamış; temizlik adımı buna kilitli
- 456 — doğrulanamayan satır yazılmaz; TEYITSIZ meşrudur
- 61/88 — KIRPMA YASAĞI
- 52 — her konu ayrı sohbet

Çalışma bölümü: ben (Kaan) brief dosyasını CC'ye veririm; dosya işlemlerini,
commit'i, push'u CC yapar. Sen dosya yazmazsın, brief üretirsin.

Önce oku. Raporun sırası: (a) ölçüm, (b) sapma kaydının brief'e etkisi,
(c) eksik gördüğün girdilerin listesi. Sonra onay bekle. Brief'i onaydan
sonra yaz.
```

---

## 4. SANA DÜŞEN KARARLAR

Sohbet sana ikisiyle gelecek:

**a · `baglam.sh` profil sayısı.** Dört profil yediyi kapsamıyor. İki yol: profil
sayısını artır (`program` eklenir) ya da mevcut profilleri genişlet (`icerik` profili
`program`'ı da alır). Birincisi daha net, ikincisi daha az komut. Ölçümü görünce ver.

**b · Ölçüm örneklemi.** 15-20 karar numarası lazım. B32'de beş verdin, beşi de sığ
çıktı. Bu sefer daha geniş bir aralıktan ver — ledger 1-468.

---

## 5. BU İŞ BİTİNCE

Sırada **B39** (iki dosyanın dağıtımı, B32 deseni) ve **Doküman turu 2**
(şema KARAR'ı + B35 + 251, ölçüm dosyasıyla açılır). İkisi paralel yürüyebilir.

Kuyruğun tamamı `docs/03-sira.md`'de. Sonuncusu **B38** — terminal ledger çapa
denetimi, ADIM 7 oturduktan sonra.
