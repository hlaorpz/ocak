ADIM 5 — ocak-arsivci · ocak-teshis · ocak-lint. Brief yazımı.

⚠ Project files BAYAT ve artık neredeyse boş. Otorite repoda (docs/).
KARAR 455 tamamlandı: project files'ta yalnız ocak-marka.md var.
Ekli dosyalar esastır.

Repo: ~/Desktop/hlaorpz/ocak-site-clone · main · dönem HEAD 76e8bee (8 Ağu).
HEAD'i doğrulamana gerek yok — bu tur satır numarasına dayanan patch
uygulamıyor, brief yazıyor.

⚠ SAYI BEYANI (KARAR 470): Bu promptta hiçbir satır sayısı yok, bilerek.
Ölçümü ekli dosyalardan SEN yap. Hatırladığın rakamı kullanma; ekli olmayan
dosya hakkında rakam yazma — gerekirse iste. Yazdığın her rakamın yanına
üretim yöntemini yaz: eşik, araç, kaynak kümesi.

⚠ İKİ ARAÇ TUZAĞI, ikisi de bu makinede ölçüldü:
  - awk length BAYT sayar (awk 20200816 BSD; LC_ALL değiştirmez).
    'çığır' = 5 karakter, 9 bayt. Uzunluk/eşik ölçümü python3 ile yapılır.
  - cut -c1-N sessizce kayıt gizler. Kronoloji tek satırda birden çok
    kararın kaydını taşıyor; bir kayıt N. karakterden sonra başlayabiliyor.
    Kesme aracı da ölçümün parçasıdır.

⚠ GEÇİŞ PLANI BAYAT. docs/2026-08-06-ocak-gecis-plani.md'nin gövdesi dokuz
yerinden eskidir. Dosyanın SONUNDAKİ "SAPMA KAYDI" + "SAPMA KAYDI — EK"
bloklarını önce oku; brief gövdeye göre değil o iki bloğa göre yazılır.
ADIM 5 için en kritik olanı: HEDEF YAPI docs/skills/ altında beş skill
sayıyor ama ikisi (ocak-kararci, ocak-metin) ADIM 6'ya ait; ayrıca
ocak-notion tabloda var, listede yok.

DÜN NE OLDU (8 Ağustos, dokuz commit, sıfır kod commit'i):
  ADIM 4 kapandı. CLAUDE.md repo kökünde (dokuz bölüm). scripts/baglam.sh
  beş profille çalışıyor (kod · icerik · marka · bot · dokuman), manifest
  satırı + eksik-dosya guard'ı var. Project files boşaltıldı.
  KARAR 469 (sır env'de) · 470 (nicel iddia ölçülebilir olur) ·
  471 (project files aynası, otorite repoda) · 472 (çapa çözümleme
  sözleşmesi) mühürlendi. B40 · B41 · B42 açıldı.

  B36 ÖLÇÜLDÜ ve ikiye bölündü — bu ADIM 5'i doğrudan ilgilendiriyor:
  mekanik çapaların %43'ü komşusunu gösteriyor (21 satırlık sistematik
  örneklem, isabet 12/21). HİÇ sıfır: ledger kırık değil, sığ.
  Kuyruğun üçte ikisi tek desenden — erken sohbetlerin
  "- **KARAR N:** Başlık (Bölüm A.X)" karar listeleri. Mekanik tespit
  edilebilir, mekanik onarılabilir.
  SONUÇ: ocak-kararci'ye ONARIM MODU GEREKMİYOR. Gereken bir dönüştürme
  betiği (B33/B37 kardeşi) = B36-a, CC'nin işi, ADIM 5 ile aynı turda
  gidebilir. Ölçüm dosyası: docs/_uretilen/olcum-2026-08.md.

İŞ — ADIM 5 için CC brief'i yaz. Kapsam:

1. docs/skills/ doğar. Kanonik kaynak tek (KARAR 458). Üç skill:
   - ocak-arsivci — patch uygular, commit'ler. KARAR 355'e TABİDİR:
     00-durum.md'ye hedefli yazım yapar, öncesinde ADIM 0 salt-read ile
     dosyanın beklenen halde olduğunu doğrular. Kronoloji append-only,
     orada çakışma yok. Sohbet sonu patch'i BEŞ bölümdür (KARAR 468) ve
     bölüm sırası bağlayıcıdır: rakam taşıyan satırlar (dönem HEAD, satır
     sayısı) EN SON ölçülür — dün bu kural yazıldı, gerekçesi 03-sira.md
     BAKIM KURALI bölümünde.
   - ocak-teshis — dist/, git log, computed CSS. "Kod var ≠ output var".
     Statik CSS analizi tek başına yetmez (KARAR 419); Chrome DevTools
     computed değerleri esastır.
   - ocak-lint — İKİ YÜZEYDE çalışır: CC dosyada grep'ler, Claude.ai
     ürettiği metni yayınlamadan geçirir. Bu ikilik skill'in yazımını
     etkiler.

2. scripts/skill-sync.sh. docs/skills → .claude/skills + claude.ai zip.
   --check ayrışmayı yakalar. ⚠ .claude/ klasörü .gitignore:39 ile
   bütünüyle ignore ediliyor — sync hedefi versiyonlanmıyor, bu tasarımı
   etkiler.

3. B42 — bu turun işi, planda ayrı madde değil ama borç maddesi ADIM 5'i
   tetikleyici gösteriyor. Üç ayrışma tek dosyanın etrafında:
   (a) scripts/site-icerik-dump.mjs çıktıyı repo KÖKÜNE yazıyor,
       HEDEF YAPI _uretilen/site-icerik.md diyor
   (b) dosya iki kopya hâlinde duruyor, md5 eşit, ikisi de gitignore'lu
   (c) .gitignore:4 deseni başında / olmadığı için her derinlikte tutuyor
   Eylem tek tur: OUT_PATH taşınır, gitignore deseni kök-bağlı yapılır,
   mükerrer kopya kaldırılır, tüketici grep'i koşulur.

4. B36-a — birleştirme kararı senin. Aynı tur mu, ayrı brief mi?
   İkisi de CC, ikisi de repo, ikisi de betik işi. Ölçüm dosyası hazır.

KAPSAM DIŞI — brief'e girmez:
   ocak-kararci ve ocak-metin ADIM 6'dır (KARAR 458). ocak-metin YALNIZ
   TASLAK üretir, Notion'a yazmaz, en az üç ay (KARAR 459).
   ocak-notion HEDEF YAPI tablosunda var ama skill listesinde yok —
   bu bir sapma, brief'te not düşülür, çözümü bu tur değil.

BİLİNEN AYRIŞMALAR (brief'te not, çözüm bu tur değil):
   - B40: "KIRPMA YASAĞI 61/88" konvansiyonu yanlış. Ledger'da 88 =
     "Çekirdek + arşiv ikili yapısı", durumu SUPERSEDE. Sadece 61 KALICI
     ve KIRPMA kararı. CLAUDE.md bugün 61 yazıyor, geri kalan doküman
     61/88 diyor. Sahip Claude.ai.
   - B41: ledger'da tema sütunu yok, baglam.sh marka profili filtreleyemiyor.
   - B01: klon yeniden adlandırma. Remote hlaorpz/ocak-site.git, klasör
     ocak-site-clone — en az iki ad dolaşımda.
   - _uretilen/ .gitignore'da DEĞİL, yedi dosyanın yedisi izleniyor.
     Bu düzeltmedir, sapma değil: dönüşüm betiklerinin versiyonlanması
     KARAR 467(a)'nın gereği. Yalnız site-icerik.md ignore'lu olmalıydı.

GEÇERLİ KARARLAR:
   458 — ADIM 5-6 kadro tanımı
   459 — ocak-metin taslak-only, içerik otoritesi Advaita'da
   355 — ADIM 0 salt-read, agentlara da uygulanır
   102 — gerçeklik spec'i ezer
   419 — computed CSS esastır, statik analiz yetmez
   465 — çapa tek benzersiz satırdan, sayı beyanı dosyanın gerçeğinden
   466 — kaynak biçimleri · 472 — çapa madde başlığına çözülür
   467 — dosya dağıtımı: eşleme tablosu + ledger dönüşümü + doğrulama, tek iş
   468 — sohbet sonu patch'i beş bölüm, bölüm sırası bağlayıcı
   463 — tek klon, paralel CC yok
   469 — sır dokümanda yaşamaz
   470 — nicel iddia ölçülebilir olur, rakam yöntemiyle yazılır
   471 — project files kopyası ayna, otorite repoda
   61 — KIRPMA YASAĞI
   52 — her konu ayrı sohbet

ÇALIŞMA BÖLÜMÜ: ben (Kaan) brief dosyasını CC'ye veririm; dosya işlemlerini,
commit'i, push'u CC yapar. Sen dosya yazmazsın, brief üretirsin. Brief'teki
her bash bloğu "cd ~/Desktop/hlaorpz/ocak-site-clone" ile açılır.
CC'nin hafızası yok — brief kendi kendine yeter olmalı.

ÖNCE OKU. Raporun sırası:
  (a) ölçüm — ekli dosyaların satır/bayt tablosu, yöntemiyle
  (b) sapma kaydı + ekinin brief'e etkisi
  (c) eksik gördüğün girdilerin listesi
Sonra onay bekle. Brief'i onaydan sonra yaz.

EKLENECEK DOSYALAR (bu promptla birlikte):
  ./scripts/baglam.sh kod       → CLAUDE.md · 00-durum · 01-kararlar ·
                                   02-borclar · 03-sira · 20-ref-site ·
                                   20-ref-protokoller · 20-ref-notion
  docs/20-ref-icerik-dili.md    → ocak-lint için, kod profilinde yok
  docs/2026-08-06-ocak-gecis-plani.md → HEDEF YAPI + iki sapma bloğu
  docs/_uretilen/olcum-2026-08.md     → B36-a kararı için

  Not: baglam.sh'ın ilk gerçek kullanımı budur. Manifest satırı çıktının
  başında olacak — Claude ne göremediğini oradan bilir. Manifest gelmezse
  ya da eksik dosya guard'ı tetiklenirse söyle.
