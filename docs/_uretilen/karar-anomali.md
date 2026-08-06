# KARAR ANOMALİ RAPORU

Kaynak: `docs/` altındaki altı master dosya. Salt okuma. **Yorum yok, yargı yok.**

- Toplam benzersiz numara: **437**
- En düşük: **1** — en yüksek: **453**
- Toplam geçiş: **2935**

---

## 0. REZERVE — atlandı

`KARAR 454` hiçbir dosyada geçmiyor. Numara tavanı **453** kabul edildi.
**REZERVE, atlandı** — dizi boşluğu listesine dahil edilmedi.

## 0b. Bozuk birleşmeler (kelime sınırı ile elenen)

Öncesinde harf/rakam bulunduğu için envantere **alınmayan** yakalamalar.
Kaynak satıra dokunulmadı (append-only).

- `ocak-kronoloji.md:5564` — yakalanan: `0KARAR 2268` (no 2268)
  - bağlam: `4. **Bot referans sayfası** (`bot-ocak-ozeti.md`, 1980KARAR 2268 kr): 7 blok (OCAK nedir, AL·OL·VER, Dört Katman, Eşik Kadını, Anadolu, Advaita, Katılım Payı). `/katmanlar` route'u yok → Dört Katman `/bul`
- `ocak-referans.md:2835` — yakalanan: `0KARAR 100` (no 100)
  - bağlam: `kart` 3 sütun grid, smoke→ember separator hover grow `width 0KARAR 100%` (`:global` selektörü verbatim, plugin output'la zaten eşleşiyor).`
- `ocak-referans.md:3055` — yakalanan: `7KARAR 131` (no 131)
  - bağlam: `Çıkış sonu: 3 sistematik sapma çözüldü (prose CSS coverage 7KARAR 131 section, plugin Hero h1 italik global, Notion italik link artığı strip), 1 kalıcı yardımcı eklendi (`scripts/qa-envanter.mjs`), QA polish k`
- `ocak-pilot.md:316` — yakalanan: `0KARAR 146` (no 146)
  - bağlam: `VKK validasyon fix (`this.setCustomValidity('')`, +6 test 140KARAR 146) + iki onay satırı eş ember link. `mesafeli-satis.astro` +`h2#on-bilgilendirme` + 6502 kapsam paragrafı (anchor Seçenek 3). `atmosfer.css``

## 1. Dizi boşlukları

1–453 aralığında hiç geçmeyen numaralar (16 adet):

```
62, 64, 66, 67, 68, 159, 160, 164, 170, 171, 172, 179, 237, 238, 247, 248
```

## 2. 453 üstü numaralar

Yok. En yüksek numara 453.

## 3. Çok-tanımlı numaralar

Aynı numaranın iki veya daha fazla dosyada **tanım-benzeri konumda** geçtiği durumlar.

Kullanılan mekanik sezgisel (yargı değil):
- **sayılır:** `KARAR N` satırın ilk anlamlı belirteci (başlık `#`, madde imi, kalın/italik açılış ön ekleri tüketildikten sonra) **veya** satır bir başlık ve o satırda tek bir `KARAR N` var.
- **sayılmaz:** atıf listesi başı (`KARAR 1, 5, 6` gibi virgül+rakam takip edenler).

⚠ Bu sezgisel **eksik yakalar**: paragraf ortasında kalın cümleyle tanımlanan kararlar (ör. `**... kanonu (KARAR 450).**`) buraya düşmez. Liste tanım şüphesidir, tanım envanteri değildir.

88 adet.

Bunların **82** tanesi `ocak-kronoloji.md` + `ocak-referans.md` çiftidir (kronolojideki ledger satırı + referanstaki bölüm başlığı). 1 tanesi ikiden fazla dosyada geçer.

### KARAR 1 — 2 dosya
- `ocak-kronoloji.md:41` — `- **KARAR 1:** Beş Evre Çerçevesi — İNİŞ/UYANIŞ/DURUŞ/GEÇİŞ/DÖNÜŞ (Bölüm A.10)`
- `ocak-referans.md:675` — `### Beş Evre Çerçevesi (KARAR 1)`

### KARAR 2 — 2 dosya
- `ocak-kronoloji.md:42` — `- **KARAR 2:** Anadolu Merkez — Pazar Stratejisi (Bölüm A.10)`
- `ocak-referans.md:704` — `### Anadolu Merkez — Pazar Stratejisi (KARAR 2)`

### KARAR 6 — 2 dosya
- `ocak-kronoloji.md:46` — `- **KARAR 6:** Retreat Süreleri (Bölüm A.10)`
- `ocak-referans.md:722` — `### Retreat Süreleri (KARAR 6)`

### KARAR 7 — 2 dosya
- `ocak-kronoloji.md:47` — `- **KARAR 7:** Mekânla Çalışmak (Bölüm A.10)`
- `ocak-referans.md:735` — `### Mekânla Çalışmak (KARAR 7)`

### KARAR 8 — 2 dosya
- `ocak-kronoloji.md:48` — `- **KARAR 8:** Aralık Yapısı — Retreatler Arası Program (Bölüm A.10)`
- `ocak-referans.md:743` — `### Aralık Yapısı — Retreatler Arası Program (KARAR 8)`

### KARAR 9 — 2 dosya
- `ocak-kronoloji.md:49` — `- **KARAR 9:** Katılımcı Screening / Seçim Süreci (Bölüm A.10)`
- `ocak-referans.md:749` — `### Katılımcı Screening / Seçim Süreci (KARAR 9)`

### KARAR 10 — 2 dosya
- `ocak-kronoloji.md:50` — `- **KARAR 10:** İç Yolculuk Mimarisi — Kapalı Kohort (Bölüm A.10)`
- `ocak-referans.md:753` — `### Kapalı Kohort (KARAR 10)`

### KARAR 13 — 2 dosya
- `ocak-kronoloji.md:53` — `- **KARAR 13:** Türkiye Versiyonu — Anadolu Yolculuğu (Bölüm A.10)`
- `ocak-referans.md:757` — `### Türkiye Versiyonu — Anadolu Yolculuğu (KARAR 13)`

### KARAR 15 — 2 dosya
- `ocak-kronoloji.md:58` — `- **KARAR 15:** Hedef Kitle Profili v1 — "Eşik Kadını" (Bölüm A.4)`
- `ocak-referans.md:328` — `## A.4 — HEDEF KİTLE: EŞİK KADINI (KARAR 15)`

### KARAR 16 — 2 dosya
- `ocak-kronoloji.md:59` — `- **KARAR 16:** Ekosistem Mimarisi — 4 Katman (Bölüm A.3)`
- `ocak-referans.md:279` — `### Genel Yapı (KARAR 16)`

### KARAR 17 — 2 dosya
- `ocak-kronoloji.md:60` — `- **KARAR 17:** Araç Kutusu Yapısı — AL · OL · VER (Bölüm A.3, Bölüm A.6)`
- `ocak-referans.md:315` — `### Araç Kutusu — AL · OL · VER (KARAR 17)`

### KARAR 18 — 2 dosya
- `ocak-kronoloji.md:61` — `- **KARAR 18:** Marka Konumlandırma Çekirdeği (Bölüm A.1)`
- `ocak-referans.md:61` — `### Marka Konumlandırma Çekirdeği (KARAR 18)`

### KARAR 19 — 2 dosya
- `ocak-kronoloji.md:62` — `- **KARAR 19:** Katman 1 — ÇEMBER İçerik Detayı (Bölüm A.7)`
- `ocak-referans.md:489` — `## A.7 — KATMAN 1: ÇEMBER (KARAR 19)`

### KARAR 20 — 2 dosya
- `ocak-kronoloji.md:63` — `- **KARAR 20:** Katman 2 — DENEYİMLER İçerik Detayı (Bölüm A.8)`
- `ocak-referans.md:597` — `## A.8 — KATMAN 2: DENEYİMLER (KARAR 20)`

### KARAR 21 — 2 dosya
- `ocak-kronoloji.md:64` — `- **KARAR 21:** Dış Uzman Stratejisi — Hibrit Model (Bölüm A.11)`
- `ocak-referans.md:796` — `## A.11 — DIŞ UZMAN STRATEJİSİ (KARAR 21)`

### KARAR 22 — 2 dosya
- `ocak-kronoloji.md:65` — `- **KARAR 22:** Gelir Mimarisi Mantığı (Bölüm A.14)`
- `ocak-referans.md:998` — `### Gelir Mimarisi Mantığı (KARAR 22)`

### KARAR 25 — 2 dosya
- `ocak-kronoloji.md:71` — `- **KARAR 25:** Kadının Yolculuk Haritası — 9 Eşik + Spiral (Bölüm A.12)`
- `ocak-referans.md:872` — `## A.12 — KADIN YOLCULUK HARİTASI: 9 EŞİK + SPİRAL (KARAR 25)`

### KARAR 26 — 2 dosya
- `ocak-kronoloji.md:72` — `- **KARAR 26:** KÖZ Metaforu — 6 Katmanlı Derinlik (Bölüm A.1)`
- `ocak-referans.md:91` — `### KÖZ Metaforu — 6 Katmanlı Derinlik (KARAR 26)`

### KARAR 27 — 2 dosya
- `ocak-kronoloji.md:73` — `- **KARAR 27:** Yıl 1 Abonelik Modeli Yok (Bölüm A.14)`
- `ocak-referans.md:992` — `### Yıl 1 Abonelik Modeli Yok (KARAR 27)`

### KARAR 30 — 2 dosya
- `ocak-kronoloji.md:76` — `- **KARAR 30:** Şehir Stratejisi — Yıl 1 (Bölüm A.14)`
- `ocak-referans.md:986` — `### Şehir Stratejisi — Yıl 1 (KARAR 30)`

### KARAR 36 — 2 dosya
- `ocak-kronoloji.md:85` — `- **KARAR 36:** Fotoğraf Çekim Planı (Bölüm A.16)`
- `ocak-referans.md:1257` — `### Fotoğraf Çekim Planı (KARAR 36)`

### KARAR 38 — 2 dosya
- `ocak-kronoloji.md:87` — `- **KARAR 38:** Blog Stratejisi — "Ateş Başı" (Bölüm A.17)`
- `ocak-referans.md:1294` — `### Blog Stratejisi — "Ateş Başı" (KARAR 38)`

### KARAR 39 — 2 dosya
- `ocak-kronoloji.md:88` — `- **KARAR 39:** Site Dili — Sadece Türkçe (Bölüm A.15)`
- `ocak-referans.md:1116` — `### Site Dili — Sadece Türkçe (KARAR 39)`

### KARAR 40 — 2 dosya
- `ocak-kronoloji.md:92` — `- **KARAR 40:** OCAK Way — Üç Prensip + Katman Dozu (Bölüm A.5)`
- `ocak-referans.md:354` — `## A.5 — OCAK WAY: ÜÇ PRENSİP + KATMAN DOZU (KARAR 40)`

### KARAR 41 — 2 dosya
- `ocak-kronoloji.md:93` — `- **KARAR 41:** OCAK'ın İmzası — Ateş (Bölüm A.5)`
- `ocak-referans.md:386` — `### OCAK'ın İmzası — Ateş (KARAR 41)`

### KARAR 42 — 2 dosya
- `ocak-kronoloji.md:94` — `- **KARAR 42:** OCAK Araç Kutusu — Genişletilmiş 7 Kategori (Bölüm A.6)`
- `ocak-referans.md:397` — `## A.6 — ARAÇ KUTUSU: 7 KATEGORİ + 30+ ARAÇ (KARAR 42)`

### KARAR 43 — 2 dosya
- `ocak-kronoloji.md:95` — `- **KARAR 43:** Çember Akış Formatı (Bölüm A.7)`
- `ocak-referans.md:535` — `### Çember Akış Formatı (KARAR 43)`

### KARAR 44 — 2 dosya
- `ocak-kronoloji.md:96` — `- **KARAR 44:** Çember Açık/Kapalı Hibrit Model (Bölüm A.7)`
- `ocak-referans.md:559` — `### Çember Açık/Kapalı Hibrit Model (KARAR 44)`

### KARAR 45 — 2 dosya
- `ocak-kronoloji.md:97` — `- **KARAR 45:** Açık Kapı — Detaylı Format ve Mekanik (Bölüm A.9)`
- `ocak-referans.md:636` — `## A.9 — AÇIK KAPI: DETAYLI FORMAT VE MEKANİK (KARAR 45)`

### KARAR 46 — 2 dosya
- `ocak-kronoloji.md:98` — `- **KARAR 46:** Online Ağırlıklı Çember Modeli (Bölüm A.7)`
- `ocak-referans.md:572` — `### Online Ağırlıklı Çember Modeli (KARAR 46)`

### KARAR 47 — 2 dosya
- `ocak-kronoloji.md:99` — `- **KARAR 47:** İlk Yıl Advaita Merkezli + Ekip Geçiş Zaman Çizelgesi (Bölüm A.11)`
- `ocak-referans.md:831` — `### İlk Yıl Advaita Merkezli + Ekip Geçiş Zaman Çizelgesi (KARAR 47)`

### KARAR 49 — 2 dosya
- `ocak-kronoloji.md:104` — `- **KARAR 49:** Takvim Kayması ve Yeniden Kalibrasyon — 21 Haziran 2026 Lansman (Bölüm A.13)`
- `ocak-referans.md:897` — `### Lansman Hedefi: 21 Haziran 2026 Yaz Gündönümü (KARAR 49)`

### KARAR 50 — 2 dosya
- `ocak-kronoloji.md:108` — `- **KARAR 50:** Web Sitesi Mimarisi — 6 Oda + 19 Sayfa (Bölüm A.15)`
- `ocak-referans.md:1011` — `## A.15 — SİTE MİMARİSİ (KARAR 50-55, 83, 85, 86, 87)`

### KARAR 51 — 2 dosya
- `ocak-kronoloji.md:109` — `- **KARAR 51:** URL Yapısı — Türkçe Karaktersiz, Lowercase (Bölüm A.15)`
- `ocak-referans.md:1045` — `### URL Yapısı — Türkçe Karaktersiz, Lowercase (KARAR 51)`

### KARAR 54 — 2 dosya
- `ocak-kronoloji.md:112` — `- **KARAR 54:** Master Metin İki Yerde (Bölüm A.15)`
- `ocak-referans.md:1086` — `### Master Metin İki Yerde (KARAR 54)`

### KARAR 55 — 2 dosya
- `ocak-kronoloji.md:113` — `- **KARAR 55:** /advaita Sesi — OCAK Anlatımı (Bölüm A.2, Bölüm A.15)`
- `ocak-referans.md:245` — `### Site Sesi — OCAK'ın Sesi (KARAR 55)`

### KARAR 56 — 2 dosya
- `ocak-kronoloji.md:117` — `- **KARAR 56:** Otomasyon Mimarisi (Bölüm A.18)`
- `ocak-referans.md:1326` — `## A.18 — OTOMASYON MİMARİSİ (KARAR 56)`

### KARAR 57 — 3 dosya
- `ocak-kronoloji.md:118` — `- **KARAR 57:** Kayıt ve Veri Etik Çerçevesi (Bölüm A.19)`
- `ocak-marka.md:216` — `## ETİK ÇERÇEVE (KARAR 57)`
- `ocak-referans.md:1381` — `## A.19 — VERİ ETİK ÇERÇEVESİ (KARAR 57)`

### KARAR 58 — 2 dosya
- `ocak-kronoloji.md:119` — `- **KARAR 58:** Çalışma Sıralaması — İçerik → Site → Altyapı (Bölüm A.23)`
- `ocak-referans.md:1734` — `### Çalışma Sıralaması — İçerik → Site → Altyapı (KARAR 58)`

### KARAR 59 — 2 dosya
- `ocak-kronoloji.md:123` — `- **KARAR 59:** Reklam ve Analytics Altyapısı (Bölüm A.20)`
- `ocak-referans.md:1404` — `## A.20 — REKLAM VE ANALYTICS ALTYAPISI (KARAR 59)`

### KARAR 60 — 2 dosya
- `ocak-kronoloji.md:124` — `- **KARAR 60:** Seans Arşivi Mimarisi (Bölüm A.21)`
- `ocak-referans.md:1464` — `## A.21 — SEANS ARŞİVİ MİMARİSİ (KARAR 60)`

### KARAR 61 — 2 dosya
- `ocak-kronoloji.md:125` — `- **KARAR 61:** Master Prompt Patch Modu (Bölüm A.23)`
- `ocak-referans.md:1748` — `### Master Prompt Patch Modu (KARAR 61)`

### KARAR 70 — 2 dosya
- `ocak-kronoloji.md:135` — `- **KARAR 70:** Tasarım Notları Sade Tutulur (Bölüm A.15)`
- `ocak-referans.md:1108` — `### Tasarım Notları Sade Tutulur (KARAR 70)`

### KARAR 73 — 2 dosya
- `ocak-kronoloji.md:138` — `- **KARAR 73:** Çember Döngüsü Database (Bölüm A.22)`
- `ocak-referans.md:1531` — `## A.22 — NOTION DATABASE YAPISI (KARAR 73-77, 82)`

### KARAR 74 — 2 dosya
- `ocak-kronoloji.md:139` — `- **KARAR 74:** Workshop Şablonları Database (Bölüm A.22)`
- `ocak-referans.md:1573` — `### Workshop Şablonları Database (KARAR 74)`

### KARAR 75 — 2 dosya
- `ocak-kronoloji.md:140` — `- **KARAR 75:** Etkinlikler Database Genişletildi (Bölüm A.22)`
- `ocak-referans.md:1597` — `### Etkinlikler Database — 30+ Property (KARAR 75)`

### KARAR 76 — 2 dosya
- `ocak-kronoloji.md:141` — `- **KARAR 76:** Kayıtlar Database (Bölüm A.22)`
- `ocak-referans.md:1652` — `### Kayıtlar Database (KARAR 76)`

### KARAR 77 — 2 dosya
- `ocak-kronoloji.md:142` — `- **KARAR 77:** Etkinlikler 9 View Yapısı (Bölüm A.22)`
- `ocak-referans.md:1671` — `### Etkinlikler 9 View Yapısı (KARAR 77)`

### KARAR 78 — 2 dosya
- `ocak-kronoloji.md:143` — `- **KARAR 78:** Yaz Gündönümü — İki Ayrı Buluşma (Bölüm A.13)`
- `ocak-referans.md:903` — `### Yaz Gündönümü — İki Ayrı Buluşma (KARAR 78)`

### KARAR 79 — 2 dosya
- `ocak-kronoloji.md:144` — `- **KARAR 79:** Ritüel Tasarımı — İlk Workshop (Bölüm A.13)`
- `ocak-referans.md:933` — `### Ritüel Tasarımı — İlk Workshop (KARAR 79)`

### KARAR 82 — 2 dosya
- `ocak-kronoloji.md:147` — `- **KARAR 82:** Notion Operasyonu — Pratik Prensipler (Bölüm A.22)`
- `ocak-referans.md:1685` — `### Notion Pratik Prensipleri (KARAR 82)`

### KARAR 83 — 2 dosya
- `ocak-kronoloji.md:148` — `- **KARAR 83:** Buluşmalar Odası Tamamlandı (Bölüm A.15)`
- `ocak-referans.md:1120` — `### Buluşmalar Odası Durumu (KARAR 83)`

### KARAR 85 — 2 dosya
- `ocak-kronoloji.md:153` — `- **KARAR 85:** 5. Tur Metinler Onaylandı (/takvim v2 · /yolculuk v2 · /anadolu v3) (Bölüm A.15)`
- `ocak-referans.md:1133` — `### Yolculuk Odası Durumu (KARAR 85)`

### KARAR 86 — 2 dosya
- `ocak-kronoloji.md:154` — `- **KARAR 86:** Köz Kelimesi Site Dilinde Yok (Bölüm A.1, Bölüm A.15)`
- `ocak-referans.md:1104` — `### Köz Kelimesi Site Dilinde Yok (KARAR 86)`

### KARAR 87 — 2 dosya
- `ocak-kronoloji.md:155` — `- **KARAR 87:** "Bir Sonraki [X]" Callout Pattern'ı (Bölüm A.15)`
- `ocak-referans.md:1092` — `### Pattern Bekçileri (KARAR 87)`

### KARAR 88 — 2 dosya
- `ocak-kronoloji.md:161` — `- **KARAR 88:** Çekirdek + Arşiv İkili Yapısı + Sohbet Sonu Tam Dosya Değişim Modu (Bölüm A.23)`
- `ocak-referans.md:1771` — `### Çekirdek + Arşiv İkili Yapısı (KARAR 88)`

### KARAR 89 — 2 dosya
- `ocak-kronoloji.md:167` — `- **KARAR 89:** Kaan'ın Sahnedeki Görünmezliği — Site sayfalarında görünmüyor (Bölüm A.11)`
- `ocak-referans.md:800` — `### Kaan'ın Sahnedeki Görünmezliği (KARAR 89)`

### KARAR 91 — 2 dosya
- `ocak-kronoloji.md:169` — `- **KARAR 91:** /advaita Meta Cümlesi — "Ateşi ilk yakan. Tek taşıyıcı değil." (Bölüm A.2)`
- `ocak-referans.md:251` — `### /advaita Meta Cümlesi (KARAR 91)`

### KARAR 92 — 2 dosya
- `ocak-kronoloji.md:170` — `- **KARAR 92:** Section Etiketi Retrofit Turu — #20 öncesi tüm sayfalarda standartlaştırma (Bölüm A.15)`
- `ocak-referans.md:1153` — `### Section Etiketi Retrofit Turu (KARAR 92)`

### KARAR 97 — 2 dosya
- `ocak-kronoloji.md:185` — `- **KARAR 97:** Notion Internal Integration "Ocak Site" Kuruldu (Bölüm A.22)`
- `ocak-referans.md:1703` — `### Notion Internal Integration "Ocak Site" (KARAR 97)`

### KARAR 99 — 2 dosya
- `ocak-kronoloji.md:192` — `- **KARAR 99:** Astro İskelet Teslimi — 22 dosyalık başlangıç paketi (Bölüm A.24)`
- `ocak-referans.md:1990` — `### Astro İskelet Teslimi (KARAR 99)`

### KARAR 100 — 2 dosya
- `ocak-kronoloji.md:193` — `- **KARAR 100:** Repo Public + Astro Sohbet Dizisi İş Bölüşümü — Claude.ai / Claude Code / Cowork (Bölüm A.24)`
- `ocak-referans.md:2106` — `### Repo Public + Astro Sohbet Dizisi İş Bölüşümü (KARAR 100)`

### KARAR 101 — 2 dosya
- `ocak-kronoloji.md:201` — `- **KARAR 101:** Repo-içi operasyonel hafıza (`.claude/notes.md`) + token rotation ritmi (Bölüm A.24)`
- `ocak-referans.md:2063` — `### Repo-İçi Operasyonel Hafıza + Token Rotation (KARAR 101)`

### KARAR 102 — 2 dosya
- `ocak-kronoloji.md:207` — `- **KARAR 102:** #21 Section Components — Plugin İşi Tamamlandı (Bölüm A.24)`
- `ocak-referans.md:2128` — `### #21 Section Components — Plugin İşi Tamamlandı (KARAR 102)`

### KARAR 103 — 2 dosya
- `ocak-kronoloji.md:208` — `- **KARAR 103:** Brief Yapıştırma Disiplini — Uzun brief'ler parçalı veya dosya yöntemiyle (Bölüm A.23)`
- `ocak-referans.md:1844` — `### Brief Yapıştırma Disiplini (KARAR 103)`

### KARAR 104 — 2 dosya
- `ocak-kronoloji.md:209` — `- **KARAR 104:** İleri İş Bırakma Yasağı — 10-15 dk içinde çözülen konular sonraya bırakılmaz (Bölüm A.23)`
- `ocak-referans.md:1867` — `### İleri İş Bırakma Yasağı (KARAR 104)`

### KARAR 105 — 2 dosya
- `ocak-kronoloji.md:217` — `- **KARAR 105:** #21 Section Components TAM Tamam — 5 Brief, 5 component, atmosfer legacy verbatim, `:global()` hibrit (Bölüm A.24)`
- `ocak-referans.md:2347` — `### #21 Section Components — TAM Tamam (KARAR 105)`

### KARAR 106 — 2 dosya
- `ocak-kronoloji.md:236` — `- **KARAR 106:** #22 Brief 1 — Notion Keşif + Şema Sapma Raporu (Bölüm A.24)`
- `ocak-referans.md:2482` — `# #22 Content Collections + Notion Binding — Brief 1 Keşif (KARAR 106)`

### KARAR 107 — 2 dosya
- `ocak-kronoloji.md:237` — `- **KARAR 107:** #22 Brief 2-3 — Sayfalar + Etkinlikler Content Layer Loader'ları (Bölüm A.24)`
- `ocak-referans.md:2522` — `ief 2-3 — Sayfalar + Etkinlikler Content Layer Loader'ları (KARAR 107)`

### KARAR 108 — 2 dosya
- `ocak-kronoloji.md:238` — `- **KARAR 108:** #22 Brief 4 — Plugin Overline + Normalizer Borç Temizliği (Bölüm A.24)`
- `ocak-referans.md:2586` — `#22 Brief 4 — Plugin Overline + Normalizer Borç Temizliği (KARAR 108)`

### KARAR 109 — 2 dosya
- `ocak-kronoloji.md:239` — `- **KARAR 109:** #22 Brief 5 — SonrakiBulusma + SSS Canlı Binding (Bölüm A.24)`
- `ocak-referans.md:2612` — `### #22 Brief 5 — SonrakiBulusma + SSS Canlı Binding (KARAR 109)`

### KARAR 110 — 2 dosya
- `ocak-kronoloji.md:240` — `- **KARAR 110:** #22 Brief 6 — Notion Webhook (Yayınla Checkbox) + #22 Kapanış (Bölüm A.24)`
- `ocak-referans.md:2667` — `Brief 6 — Notion Webhook (Yayınla Checkbox) + #22 Kapanış (KARAR 110)`

### KARAR 111 — 2 dosya
- `ocak-kronoloji.md:241` — `- **KARAR 111:** Sayfa Yazım Rehberi — `docs/sayfa-yazim-rehberi.md` (Bölüm A.24)`
- `ocak-referans.md:2729` — `### Sayfa Yazım Rehberi — `docs/sayfa-yazim-rehberi.md` (KARAR 111)`

### KARAR 112 — 2 dosya
- `ocak-kronoloji.md:260` — `- **KARAR 112:** #23 Brief 1 — Pipeline Kurulumu (Dinamik Route + Plugin Render) (Bölüm A.24)`
- `ocak-referans.md:2748` — `rief 1 — Pipeline Kurulumu (Dinamik Route + Plugin Render) (KARAR 112)`

### KARAR 113 — 2 dosya
- `ocak-kronoloji.md:261` — `- **KARAR 113:** #23 Brief 2 — Atmosfer CSS Global Migration (Bölüm A.24)`
- `ocak-referans.md:2793` — `### #23 Brief 2 — Atmosfer CSS Global Migration (KARAR 113)`

### KARAR 114 — 2 dosya
- `ocak-kronoloji.md:262` — `- **KARAR 114:** #23 Brief 2b — Hero Glow Legacy Parity (Bölüm A.24)`
- `ocak-referans.md:2865` — `### #23 Brief 2b — Hero Glow Legacy Parity (KARAR 114)`

### KARAR 115 — 2 dosya
- `ocak-kronoloji.md:263` — `- **KARAR 115:** #23 Brief 3 — Ana Sayfa Override + Form + SonrakiBulusma + Apps Script Proxy (Bölüm A.24)`
- `ocak-referans.md:2895` — `Sayfa Override + Form + SonrakiBulusma + Apps Script Proxy (KARAR 115)`

### KARAR 116 — 2 dosya
- `ocak-kronoloji.md:282` — `- **KARAR 116:** #24 QA Pass + Prose Tipografi Sistematik Fix — 4 Brief, 8 commit, 10 sistematik fix, generic prose pattern baseline (Bölüm A.24)`
- `ocak-referans.md:3053` — `# #24 QA Pass + Prose Tipografi Sistematik Fix — TAM Tamam (KARAR 116)`

### KARAR 117 — 2 dosya
- `ocak-kronoloji.md:283` — `- **KARAR 117:** Lansman Sonrası Operasyonel + Gelir Genişlemesi — Notion CMS deneyim 3 katman + çok-format kayıt + ödeme + donate + askıda eğitim modeli`
- `ocak-referans.md:3274` — `### Lansman Sonrası Operasyonel + Gelir Genişlemesi (KARAR 117)`

### KARAR 118 — 2 dosya
- `ocak-kronoloji.md:306` — `Mayıs 2026 — Yirmi Dördüncü Oturum, #25 Brief A QA Polish + KARAR 118)`
- `ocak-referans.md:3315` — `### #25 Brief A QA Polish Kod Tarafı + KARAR 118 Notion Yazım Disiplini`

### KARAR 130 — 2 dosya
- `ocak-kronoloji.md:1729` — `- **KARAR 130:** Başvuru formu deseni unification lansman sonrası ilk hafta paketine — /acik-kapi → `/acik-kapi/kayit` + /cember → `/cember/basvuru` Anad`
- `ocak-pilot.md:386` — `- **KARAR 130 statü güncellemesi (#34B sonrası):** "Tepedeki navigator altındaki taşan renk" Brief G'de "algısal effect" diye kuyruğa atılmıştı. Brief L`

### KARAR 150 — 2 dosya
- `ocak-kronoloji.md:3020` — `- **KARAR 150:** Brief L tanı disiplinleri paketi + GTM tanı pattern'i (#34 birleşik pedagojik, 9 alt-madde)`
- `ocak-pilot.md:383` — `- **KARAR 150 tanı disiplinleri paketi (#34 birleşik pedagojisi):** 9 alt-madde — (1) DOM ölçümü ≠ render pixel, pixel sampling şart, (2) replaced elemen`

### KARAR 151 — 2 dosya
- `ocak-kronoloji.md:3021` — `- **KARAR 151:** Form-anchor success state persistence bug (lansman öncesi fix paketi)`
- `ocak-pilot.md:384` — `- **KARAR 151 form-anchor success state persistence — ÇÖZÜLDÜ (#35 dönemi, KARAR 168-172):** 8 sayfa Notion düzenleme (adanmış intro section + 5 sayfa mi`

### KARAR 152 — 2 dosya
- `ocak-kronoloji.md:3022` — `- **KARAR 152:** Bot koruma katmanı (lansman öncesi honeypot, sonrası Turnstile)`
- `ocak-pilot.md:385` — `- **KARAR 152 bot koruma — honeypot ÇÖZÜLDÜ (#35 dönemi, KARAR 194):** 5 form görünmez "website" field (offscreen + tabindex/-1 + aria-hidden + autocompl`

### KARAR 336 — 2 dosya
- `ocak-kronoloji.md:5448` — `# Dış supersede/revize: KARAR 336 → 414 (scope daraltma) · 334 → 424 · 307/332/335 → 423 · 210 hattı → 411 (altın yalnız vurgu bloklarında).`
- `ocak-referans.md:1179` — `**KARAR 336 satır-scope revizesi (KARAR 414):** KARAR 336 iptal değil **rafine** edilir. Ember-durum ayrımı yalnız `variant='satir'` (takvim listesi) i`

### KARAR 397 — 2 dosya
- `ocak-kronoloji.md:5274` — `# KARAR 397 — DÖRTLÜ DOSYA YAPISI (28 Temmuz 2026)`
- `ocak-pilot.md:166` — `**KARAR 397 — arşiv ikiye ayrıldı (28 Temmuz 2026).** Gerekçe: `ocak-arsiv.md` 850K'ya ulaştı ve içinde iki farklı erişim deseni vardı — Bölüm A konu b`

### KARAR 398 — 2 dosya
- `ocak-kronoloji.md:5300` — `# 12–20 TEMMUZ DÖNEMİ EKLEMELERİ — PARTİ 2/3 (KARAR 398-428)`
- `ocak-referans.md:862` — `### 12–20 Temmuz 2026 eklemesi — Çekirdek ekip yapısı (KARAR 398)`

### KARAR 429 — 2 dosya
- `ocak-kronoloji.md:5457` — `# 12–19 TEMMUZ DÖNEMİ EKLEMELERİ — PARTİ 3/3 (KARAR 429-453)`
- `ocak-referans.md:772` — `12–19 Temmuz 2026 eklemesi — Yolculuk: bir kavram, üç ürün (KARAR 429-432, 434-437, 440, 443; PARTİ 3/3)`


## 4. "KARAR ADAYI" işaretliler

23 benzersiz numara, 35 geçiş:

- **ADAYI 299** — `ocak-kronoloji.md:4857` — `**#40 DÖNEMİ TAM — 3 sohbet konsolide (5 Temmuz 2026, KARAR ADAYI 299-320 — MÜHÜRLENMEMİŞ).** Üçlü dosya yapısının (KARAR 145) yedinci büyük tatbiki. Mobil eyeball sınıflaması + kaynak kanonu derin çalışması +`
- **ADAYI 299** — `ocak-kronoloji.md:4859` — `a eklendi; canon ownership, master dosyalara kopyalanmaz). [KARAR ADAYI 299] **İki katmanlı dürüstlük dili + imza cümlesi:** "Kimini yıllarca yaşadı, kimini hâlâ öğreniyor. OCAK'ta ders anlatan yok — birlikte derinl`
- **ADAYI 299** — `ocak-pilot.md:6` — `*(Önceki: v46 · 5 Temmuz 2026, Sohbet #40 dönemi — KARAR ADAYI 299-320 [arşivde mühürlü]. v45 · 3 Temmuz 2026, Sohbet #39 dönemi — KARAR 277-298. v44 · 2 Temmuz 2026, #38 — KARAR 251-276. v43 · 14 Haziran 2`
- **ADAYI 299** — `ocak-pilot.md:231` — `**Kanon/referans dosyası kavramı (KARAR ADAYI 299, #40):** Bazı derin içerik çalışmaları (ör. kaynak kanonu) master üçlüsüne (marka/pilot/arşiv) sığmaz — karar metni + derin içerik + yayılm`
- **ADAYI 299** — `ocak-marka.md:5` — `Kaynak kanonu "Dört Yön, Bir Ocak" (KARAR ADAYI 299) marka çekirdeğine dokunmadı — "beş kadim kaynak"/"hepsini yaşadı" ifadeleri bu dosyada YOK, site içeriği katmanında yaşar.`
- **ADAYI 300** — `ocak-kronoloji.md:4859` — `aktarıyor", çalışılan hat "çalışıyor/çağırıyor/öğreniyor". [KARAR ADAYI 300] **Glyph kuralı:** 5 glyph yalnız 5 kanon kartının mührü; ekip/mini-retreat glyph bırakır. [KARAR ADAYI 301] **Evre-arketip DEĞİŞMEZ** (KAR`
- **ADAYI 300** — `ocak-pilot.md:233` — `**İddia yumuşatma > içerik budama (KARAR ADAYI 300, #40 pedagojisi):** Bir dürüstlük/tutarlılık sorunu çıktığında (ör. "hepsini yaşadı" mutlak cümlesi belgesiz kartla çelişiyor), çözüm içeri`
- **ADAYI 301** — `ocak-kronoloji.md:4859` — `z 5 kanon kartının mührü; ekip/mini-retreat glyph bırakır. [KARAR ADAYI 301] **Evre-arketip DEĞİŞMEZ** (KARAR 290 korunur; yön rezonansı evre metnine doku, resmî etiket yazılmaz; uluslararası yolculuk kanonla birebi`
- **ADAYI 302** — `ocak-kronoloji.md:4859` — `î etiket yazılmaz; uluslararası yolculuk kanonla birebir). [KARAR ADAYI 302] **Kanon = tema havuzu** (temaları besler, şeması sayfalara taşınmaz). [KARAR ADAYI 303]`
- **ADAYI 303** — `ocak-kronoloji.md:4859` — `ema havuzu** (temaları besler, şeması sayfalara taşınmaz). [KARAR ADAYI 303]`
- **ADAYI 304** — `ocak-kronoloji.md:4861` — `advaita Batı kartı dokunulmaz, format-bağımsız dile iner). [KARAR ADAYI 304] **H3 süre kanonu** 7 alt-karar (akış dakikasız süre iddiası tek yerde; çember sıklığı korunur; atölye/şehir akşamı/Açık Kapı düzeltmeleri;`
- **ADAYI 305** — `ocak-kronoloji.md:4861` — `msiye sayfalarda "bir yıla yayılan", Anadolu "on bir ay"). [KARAR ADAYI 305] **H8 fiziksel→yüz yüze** tam sweep (24 geçiş/10 sayfa, dalga dosyalarına gömülü). [KARAR ADAYI 306] **H4 kapanış standardı** (kırmızı buto`
- **ADAYI 306** — `ocak-kronoloji.md:4861` — `* tam sweep (24 geçiş/10 sayfa, dalga dosyalarına gömülü). [KARAR ADAYI 306] **H4 kapanış standardı** (kırmızı buton + "En Yakın X" tek kart + Direkt/Başvuru iki şablon; kod ayağı Faz 3). [KARAR ADAYI 307] **Eyeball`
- **ADAYI 307** — `ocak-kronoloji.md:4861` — `X" tek kart + Direkt/Başvuru iki şablon; kod ayağı Faz 3). [KARAR ADAYI 307] **Eyeball sınıflama mimarisi** (H1-H8/Faz/Dalga hub-bazlı desen). [KARAR ADAYI 308] **Faz 0 teknik paket kararları** (brief `brief-faz0-te`
- **ADAYI 308** — `ocak-kronoloji.md:4861` — `ll sınıflama mimarisi** (H1-H8/Faz/Dalga hub-bazlı desen). [KARAR ADAYI 308] **Faz 0 teknik paket kararları** (brief `brief-faz0-teknik.md`). [KARAR ADAYI 309] **Dalga A mikro kararları** (biz fotoğrafçı çıktı, ekip`
- **ADAYI 308** — `ocak-pilot.md:229` — `**Hub-bazlı eyeball sınıflaması (KARAR ADAYI 308, #40 pedagojisi):** Büyük bir eyeball/bulgu listesi (ör. ~59 madde) geldiğinde tekil bulguları tek tek işleme — önce ortak **karar hub'ları`
- **ADAYI 309** — `ocak-kronoloji.md:4861` — `0 teknik paket kararları** (brief `brief-faz0-teknik.md`). [KARAR ADAYI 309] **Dalga A mikro kararları** (biz fotoğrafçı çıktı, ekip 5 uzmanlık, araclar 7 raf + havuz sinyali, felsefe misafir yeni dil). [KARAR ADAYI`
- **ADAYI 310** — `ocak-kronoloji.md:4861` — `araclar 7 raf + havuz sinyali, felsefe misafir yeni dil). [KARAR ADAYI 310]`
- **ADAYI 311** — `ocak-kronoloji.md:4863` — `). Dokunulmayan: payment-provider.ts (Aşama 6 PayTR flip). [KARAR ADAYI 311] **GÖRSEL teyit açık:** logo nav + footer mobil iPhone eyeball (logo tek tık her sayfadan, ana sayfada 4-tık kalp, 360-414px footer) Kaan'd`
- **ADAYI 311** — `ocak-kronoloji.md:4971` — `- **#35 Logo easter egg (`KARAR 185-186` → #40 revize `KARAR ADAYI 311`):** OCAK wordmark 4 hızlı tık → 💜. **#40 Faz 0'da mekanizma REVİZE edildi (KARAR 185 mekanizma revizesi):** brand linki tüm sayfalarda doğ`
- **ADAYI 311** — `ocak-kronoloji.md:4971` — `n + ana sayfada 4-tık kalp) Kaan'da. (Arşiv: KARAR 185-186, KARAR ADAYI 311)`
- **ADAYI 312** — `ocak-kronoloji.md:4865` — `7 iki tur revizyon (ilk taksonomi+wellness Kaan reddetti). [KARAR ADAYI 312] **H5 kapı yapısı** (6 kapı, yolculuk kapı değil yol, sıra Açık Kapı→Çember→Seremoni→Atölye→Şehir Akşamı→Mini Retreat, 1↔2 swap; KATEGORI_S`
- **ADAYI 312** — `ocak-marka.md:3` — `kanal kimliği eklendi. **v1.3 (5 Temmuz 2026, #40 dönemi — KARAR ADAYI 312):** HEDEF KİTLE — EŞİK KADINI bölümüne çift-yol (kriz + çağrı) genişlemesi; eşik nötr kavram olarak konumlandı, imza cümlesi "Bir eşikte du`
- **ADAYI 312** — `ocak-marka.md:97` — `**Eşik — çift yol (kriz + çağrı) (KARAR ADAYI 312):** Eşik NÖTR kavramdır — kadını eşiğe kimi zaman **kriz** getirir (boşanma, iş değişikliği, kayıp, tükenme), kimi zaman **çağrı** ("dahası`
- **ADAYI 312** — `ocak-marka.md:102` — `Detay: Arşiv KARAR 15, KARAR ADAYI 312.`
- **ADAYI 313** — `ocak-kronoloji.md:4865` — `Şehir Akşamı→Mini Retreat, 1↔2 swap; KATEGORI_SIRA Faz 3). [KARAR ADAYI 313] **H6 İstanbul esnetme** ("şu anki durak İstanbul" + gerçekçi şehir mekanizması). [KARAR ADAYI 314] **Tema havuzu Anadolulaşması** (Kybele/`
- **ADAYI 313** — `ocak-pilot.md:93` — `NAL_SLUGS` hâlâ `/workshop` biliyor — Faz 3 ADIM 0 hizalar, KARAR ADAYI 313 keşfi) |`
- **ADAYI 314** — `ocak-kronoloji.md:4865` — `* ("şu anki durak İstanbul" + gerçekçi şehir mekanizması). [KARAR ADAYI 314] **Tema havuzu Anadolulaşması** (Kybele/Şahmeran/İnanna; Baba Yaga/Enheduanna kanonda kalır sitede örnek verilmez). [KARAR ADAYI 315] **Ulu`
- **ADAYI 315** — `ocak-kronoloji.md:4865` — `Baba Yaga/Enheduanna kanonda kalır sitede örnek verilmez). [KARAR ADAYI 315] **Uluslararası ilgi kancası** (tek cümle + iletişim linki; MailerLite grup post-launch). [KARAR ADAYI 316] **Çığlık→"sesin salınması"** (m`
- **ADAYI 316** — `ocak-kronoloji.md:4865` — `(tek cümle + iletişim linki; MailerLite grup post-launch). [KARAR ADAYI 316] **Çığlık→"sesin salınması"** (mini-retreat, dil yumuşar). [KARAR ADAYI 317] **Mini-retreat glyph kalkar** (glyph kuralı uygulaması). [KARA`
- **ADAYI 317** — `ocak-kronoloji.md:4865` — `**Çığlık→"sesin salınması"** (mini-retreat, dil yumuşar). [KARAR ADAYI 317] **Mini-retreat glyph kalkar** (glyph kuralı uygulaması). [KARAR ADAYI 318] **Atölye gruplama** (ÖNERİ, veto açık: tek-seferlik öne, "Kadın`
- **ADAYI 318** — `ocak-kronoloji.md:4865` — `] **Mini-retreat glyph kalkar** (glyph kuralı uygulaması). [KARAR ADAYI 318] **Atölye gruplama** (ÖNERİ, veto açık: tek-seferlik öne, "Kadın ve Para" çıkar). [KARAR ADAYI 319] **Açılış Seremonisi adı** (ÖNERİ, veto`
- **ADAYI 319** — `ocak-kronoloji.md:4865` — `NERİ, veto açık: tek-seferlik öne, "Kadın ve Para" çıkar). [KARAR ADAYI 319] **Açılış Seremonisi adı** (ÖNERİ, veto açık: alt. "Niyet Seremonisi"). [KARAR ADAYI 320] Keşif: kod `/workshop`+`/istanbul` slug'ları bili`
- **ADAYI 320** — `ocak-kronoloji.md:4865` — `emonisi adı** (ÖNERİ, veto açık: alt. "Niyet Seremonisi"). [KARAR ADAYI 320] Keşif: kod `/workshop`+`/istanbul` slug'ları bilir, sayfa URL'leri `/atolye`+`/sehir-aksami` → Faz 3 ADIM 0 tanısı. "bir yıldan uzun" Anad`
- **ADAYI 363** — `ocak-kronoloji.md:4685` — `**Numara notu:** Dump bu kararı kendi metninde 8 yerde "KARAR ADAYI 363" diye anıyordu. 363, `3f6050e`/`954417f`/`64813e5` commit mesajlarına gömülü olduğu için kaydırılamaz rezervdir → bu karar **372**'ye alınd`

## 5. Süperseleme sinyali taşıyanlar

Bağlamında `SUPERSEDE` / `süperse` / `emekli` / `geri alındı` / `revize` / `iptal` geçen numaralar. **Ham liste — hangi karar süperselendi yargısı YOK.**

61 numara:

- **47** (1 geçiş) — sinyal: IPTAL
  - `ocak-kronoloji.md:664` — `Önceki Claude.ai taslağı iptal — Notion içeriği daha güçlü, KARAR 47 (program > Advaita) + KARAR 89 (Kaan görünmüyor "bir kurucu ortak taşıyor") açıkça konuşuyor. Sayım yazıyla (KARAR 87 pattern bekçi) ✓.`
- **93** (2 geçiş) — sinyal: IPTAL
  - `ocak-kronoloji.md:632` — `a + /ekip + /iletisim üçünde de Notion'da hero etiketi yok, KARAR 93 listesi sorgulamaya açıldı. **Lansman çerçevesi netleşti:** "Brief I mimari karar" terimi iptal — nested kayit/basvuru link mimari kararı l`
- **96** (1 geçiş) — sinyal: IPTAL
  - `ocak-pilot.md:259` — `i lansman sonrası (Sheets → Notion, ~3-4 saatlik teknik iş, KARAR 96). **admin.html iptal — Notion workspace admin paneli görevini görüyor (KARAR 98).**`
- **97** (1 geçiş) — sinyal: IPTAL
  - `ocak-pilot.md:259` — `merkezi:** Notion. İçerik canlı binding aktif (Mayıs 2026, KARAR 97); form veritabanı geçişi lansman sonrası (Sheets → Notion, ~3-4 saatlik teknik iş, KARAR 96). **admin.html iptal — Notion workspace admin p`
- **98** (3 geçiş) — sinyal: IPTAL, İPTAL
  - `ocak-kronoloji.md:186` — `- **KARAR 98:** Mevcut Kod Snapshot + Repo Adı Düzeltmesi + admin.html İptal (Bölüm A.24)`
- **99** (1 geçiş) — sinyal: İPTAL
  - `ocak-referans.md:2508` — `tü` (select, 5 option: Taslak/Kayıt Açık/Dolu/Geçti/İptal — KARAR 99 farklı set tahmin etmişti)`
- **104** (1 geçiş) — sinyal: REVIZE
  - `ocak-kronoloji.md:1427` — `fix + Brief F temizlik Sohbet B 2. ayak'a (#30) ertelendi (KARAR 104 disiplinli erteleme + Sohbet B kararı sağlamlaştırma). Brief G + Brief H + Brief I bölüşümü revize edildi: #30 = Test 5 + 2 bug fix + Brief`
- **112** (1 geçiş) — sinyal: REVIZE
  - `ocak-kronoloji.md:4947` — `**#23 Sayfa Migration ilk dalga TAM (KARAR 112-115).** 4 Brief tek sohbette bitti. Sayfa-tipi kırılım onaylandı: 6+7+6 yerine pratik gerçeklik üzerine #23-#27 olarak revize edildi (5 soh`
- **114** (5 geçiş) — sinyal: GERI ALINDI, SUPERSE, SUPERSEDE, SÜPERSE
  - `ocak-kronoloji.md:5` — `anifesto dar-emit id, glow 1100×1150 + H-agnostic −172.5px (KARAR 114 stop verbatim, kısmi supersede), scroll indicator pulse→akış hero dibinde, dip çizgisi plugin emit + atmosfer tek kural 15 sayfa / 12 sayfa`
- **115** (1 geçiş) — sinyal: REVIZE
  - `ocak-kronoloji.md:4157` — `tam tur revize edildi. Ana sayfa hero'su OMIT olduğu için (KARAR 115) kod-render; diğer sayfalar Notion-render. İki katman iki uygulama yolu. **Katman 1 (ana sayfa hero, kod-render):** `src/pages/index.astro``
- **116** (1 geçiş) — sinyal: GERI ALINDI
  - `ocak-kronoloji.md:1070` — `, Archive ile geri alındı, doğru yöntem internalize edildi. KARAR 116 ilk tatbikten 1 sohbet sonra ikinci, pattern oluştu.`
- **123** (1 geçiş) — sinyal: IPTAL
  - `ocak-kronoloji.md:835` — `3 retrofit listesi sorgulamaya açıldı (3 sayfa hero eksik). KARAR 123 lansman çerçevesi netleşti — "Brief I" terimi iptal, #28 + #29 ayrımı net, 21 Haziran sabit. ~10 Notion içerik notu lansman turu için derle`
- **125** (1 geçiş) — sinyal: EMEKLI
  - `ocak-pilot.md:361` — `**Form-anchor / kayıt CTA mimarisi GÜNCELLENDİ:** aşağıdaki KARAR 125+126 kaydı tarihsel referanstır. `form-anchor` → `kayit-cta` (KARAR 406) → `kayit-cta` **emekli** (KARAR 423); CTA bugün `sonraki-bulusma` (`
- **146** (1 geçiş) — sinyal: EMEKLI
  - `ocak-kronoloji.md:3558` — `ılar:** 4 borç temizlendi: TS Window dataLayer global type (KARAR 146 kapandı, `f6fee7b`, 5 form `(window as any)` cast silindi); `astro check`'e geçiş (`8021df3`, `npx tsc --noEmit` emekliye); SVG sizing audi`
- **150** (5 geçiş) — sinyal: EMEKLI, REVIZE
  - `ocak-kronoloji.md:1962` — `özüldü. "Algısal" kategorisi disiplin olarak revize edildi (KARAR 150 ruhu — en az iki kanıt yöntemi olmadan "algısal" diyemeyiz).`
- **173** (1 geçiş) — sinyal: REVIZE
  - `ocak-kronoloji.md:4964` — `- **#35 Form validation + scroll zinciri (`KARAR 173-176`):** validation persistence (5 form × 16 yer koşulsuz reset, `0b142b4`), email Unicode reject ASCII sınırı (3 revize, `df8db5b`+`4b79c4`
- **174** (2 geçiş) — sinyal: EMEKLI, REVIZE
  - `ocak-kronoloji.md:3420` — `- **[KARAR 174] email Unicode reject:** ASCII kısıtı, 3 revize (regex syntax fail → v-flag escape → Punycode IDN edge kabul). Commits `df8db5b`+`4b79c40`(`
- **175** (1 geçiş) — sinyal: REVIZE
  - `ocak-kronoloji.md:3421` — `- **[KARAR 175] success state scroll (4 revize, Dump7'de başladı terminal çakıldı bu sohbette bitti):** scroll-margin → manuel scrollTo → rAF wrap → close`
- **185** (6 geçiş) — sinyal: REVIZE, REVİZE, SÜPERSE
  - `ocak-kronoloji.md:4337` — `+ egg yalnız ana sayfada + GECIKME_NAV mantığı kaldırıldı (KARAR 185 egg korundu, navigasyon bastırma süperselendi); `e1fdb0a` Footer mobil grid-template-areas flip (yasal üstte 2×2, OCAK sol·© sağ space-betw`
- **187** (1 geçiş) — sinyal: SUPERSE
  - `ocak-pilot.md:3` — `Sİ [`hidden` extent silmez / `clip` siler, kırpma en dışta, KARAR 187'nin yanına — KARAR 372, **İLKE mühürlendi, UYGULAMA YOK**], ETKİNLİK LİSTE TEK-KABUK [EtkinlikListe.astro ortak bileşen, KARAR 330 SUPERSED`
- **188** (2 geçiş) — sinyal: EMEKLI
  - `ocak-pilot.md:254` — `:** `astro check` tek doğrulama (`npx tsc --noEmit` emekli, KARAR 188), TS Window dataLayer global type (KARAR 188). Kanonik section 9 (hero, bir-sonraki, sonraki-bulusma, siradaki-kapi, sss, form-anchor, mini`
- **194** (1 geçiş) — sinyal: EMEKLI
  - `ocak-pilot.md:254` — `email pattern ASCII (KARAR 174), honeypot frontend 5 form (KARAR 194). **#35 dönemi tooling:** `astro check` tek doğrulama (`npx tsc --noEmit` emekli, KARAR 188), TS Window dataLayer global type (KARAR 188).`
- **202** (2 geçiş) — sinyal: EMEKLI, IPTAL
  - `ocak-kronoloji.md:4921` — ``<code>` → ember renk, monospace/gri kutu iptal, salt CSS (KARAR 202); site-rehber + test sayfaları hariç tutuldu (`data-page` override, KARAR 203). Inline altın vurgu (Cmd+Shift+S `<del>`/`<s>` → --altin tok`
- **218** (1 geçiş) — sinyal: REVIZE
  - `ocak-referans.md:1193` — `ağlam, kırmızı buton). `isKayitFormat` yaşamaya devam eder. KARAR 218 (slug-otomatik hedef) mantığı devralındı; KARAR 307/332/334/335 revize edildi.`
- **259** (8 geçiş) — sinyal: GERI ALINDI, REVIZE, SÜPERSE
  - `ocak-kronoloji.md:5` — `, `formdaDirektEtkinlikVar` gate ödemeli 4/ödemesiz 2 link, KARAR 259 + 309-footer kısmen geri alındı; **KARAR 364**: legal metin PayTR→nötr "bankamızın sanal POS altyapısı", KVKK Seçenek X, KARAR 297 zincirle`
- **260** (5 geçiş) — sinyal: GERI ALINDI
  - `ocak-kronoloji.md:4154` — `PayTR'a değiştiriyor. Ödeme ekranında iyzico güven şeridi (KARAR 260 ile eklenen tek `logo_band_white.svg` sola dayalı band) artık yanlış marka gösteriyordu. **KARAR 260 geri alındı.** `KayitFormu.astro`'dan`
- **277** (2 geçiş) — sinyal: İPTAL
  - `ocak-kronoloji.md:4877` — `ığı; getStaticPaths build-time, geçmiş dahil İptal hariç). [KARAR 277] **Slug disiplini + build guard:** ayrı Notion property, kalıp `{tip}-{yil}-{ay}`, oluşturma anında girilir yayından sonra dokunulmaz (URL/`
- **279** (1 geçiş) — sinyal: İPTAL
  - `ocak-pilot.md:300` — `& durum !== 'İptal'` — süzme liste bileşenlerine indirildi, KARAR 279). `SonrakiBulusma.astro`+`EtkinlikTakvimi.astro` durum+`bugundenSonra` filtresi + stretched-link kart bağlama. `dropdown-filter.test.ts` te`
- **280** (1 geçiş) — sinyal: İPTAL
  - `ocak-kronoloji.md:4139` — `Taslak/İptal/geçmiş listede sızar. **Gecelik cron rebuild (KARAR 280):** n8n (Railway) Schedule Trigger + HTTP Request → mevcut `notion-content-update` Vercel deploy hook (KARAR 110; yeni hook AÇILMADI, mevcu`
- **286** (1 geçiş) — sinyal: REVIZE
  - `ocak-kronoloji.md:4157` — `**Site Dili Fable Revizyonu + Ana Sayfa Hero Metin Refresh (KARAR 286):** Lansman öncesi tüm site dili Claude Fable ile tam tur revize edildi. Ana sayfa hero'su OMIT olduğu için (KARAR 115) kod-render; diğer s`
- **297** (3 geçiş) — sinyal: GERI ALINDI, REVIZE, SÜPERSE
  - `ocak-kronoloji.md:4296` — `en şeridi kaldırıldı (PayTR geçişi, KARAR 260 geri alındı) [KARAR 297]; DAL B merge — davet v1 konum çelişkisi çözümü + üç-dallı merge brief deseni [KARAR 298].`
- **299** (1 geçiş) — sinyal: SÜPERSE
  - `ocak-kronoloji.md:4316` — `" (A.1) süperselendi. **Kaynak kanonu "Dört Yön, Bir Ocak" (KARAR 299):** 4 yön + 1 merkez = beş kart mimarisi. 🜂 MERKEZ—Anadolu (ocak, Çatalhöyük/Kibele/Efes Artemis, Tengri/Umay/Nardugan, "ocaklı"=şifacı soy`
- **307** (1 geçiş) — sinyal: REVIZE
  - `ocak-referans.md:1193` — `m eder. KARAR 218 (slug-otomatik hedef) mantığı devralındı; KARAR 307/332/334/335 revize edildi.`
- **309** (2 geçiş) — sinyal: GERI ALINDI, REVIZE
  - `ocak-kronoloji.md:4367` — `**Kararlar:** KARAR 311 (Faz 0 teknik paket uygulaması — KARAR 309'un kod ayağı; KARAR 185 mekanizma revizesi + KARAR 259 korunması + KARAR 297 metin-ayağı kapanışı + KARAR 186 borç kapalı tespiti bu karara`
- **311** (1 geçiş) — sinyal: REVIZE
  - `ocak-kronoloji.md:4367` — `**Kararlar:** KARAR 311 (Faz 0 teknik paket uygulaması — KARAR 309'un kod ayağı; KARAR 185 mekanizma revizesi + KARAR 259 korunması + KARAR 297 metin-ayağı kapanış`
- **330** (8 geçiş) — sinyal: SUPERSE, SUPERSEDE, SÜPERSE
  - `ocak-kronoloji.md:5` — `inlikListe.astro ortak bileşen (benzetme değil paylaşım), **KARAR 330 SUPERSEDE** (dikey sapma = eksik render rasyonalizasyonu), `[class^="ocak-"]` prefix-match kırılganlığı, kart başlığı span, "En Yakın X" ba`
- **334** (2 geçiş) — sinyal: GERI ALINDI
  - `ocak-kronoloji.md:4595` — `enemesi (Gel otur / Ateşe otur / Niyetini yaz) geri alındı; KARAR 334 orijinali korundu, tasarım mock'lu ayrı tura ertelendi.`
- **336** (10 geçiş) — sinyal: GERI ALINDI, IPTAL, REVIZE, SUPERSE, SUPERSEDE
  - `ocak-kronoloji.md:4` — `iptali, statik/accordion ölçütü liste doğasına + ilk-açık, KARAR 336 satır-scope revizesi, `--ember-alpha-08`, `<summary>` içi h3→span geçersiz-DOM fix, ölü blok temizliği, explicit `-intro` çift ritim, Chrom`
- **361** (1 geçiş) — sinyal: IPTAL
  - `ocak-kronoloji.md:5366` — `class + tek parser) → `fc93f93` (atolyeler → accordion mod, KARAR 361 selector gezildi) → `1860880` (accordion kapalı öğe yoğunluk — gap iptali) → `f2d2d4a` (section baseline h3/p sızıntı) → `e4e9a4f` (başlık`
- **364** (5 geçiş) — sinyal: GERI ALINDI, SÜPERSE
  - `ocak-kronoloji.md:5` — `emesiz 2 link, KARAR 259 + 309-footer kısmen geri alındı; **KARAR 364**: legal metin PayTR→nötr "bankamızın sanal POS altyapısı", KVKK Seçenek X, KARAR 297 zincirlenir; KARAR 389: Vercel team slug kso2025→hlao`
- **365** (3 geçiş) — sinyal: SUPERSE, SUPERSEDE
  - `ocak-kronoloji.md:5` — `55-#60], KARAR 363-396 eklendi. HERO GEÇİŞİ + AKIŞ ÇİZGİSİ [KARAR 365-371: CTA hedefi funnel→manifesto dar-emit id, glow 1100×1150 + H-agnostic −172.5px (KARAR 114 stop verbatim, kısmi supersede), scroll indic`
- **366** (1 geçiş) — sinyal: GERI ALINDI
  - `ocak-pilot.md:31` — `stop sayısı artırma denendi → banding üretti, geri alındı [KARAR 366]. Scroll indicator pulse → **akış** animasyonu, hero dibine (`scrollAkis`, delay 0.8s, safe-area, reduced-motion) [KARAR 367]. Dip çizgisi`
- **372** (1 geçiş) — sinyal: SUPERSE, SUPERSEDE
  - `ocak-pilot.md:3` — `mez / `clip` siler, kırpma en dışta, KARAR 187'nin yanına — KARAR 372, **İLKE mühürlendi, UYGULAMA YOK**], ETKİNLİK LİSTE TEK-KABUK [EtkinlikListe.astro ortak bileşen, KARAR 330 SUPERSEDE, prefix-match kırılga`
- **373** (4 geçiş) — sinyal: GERI ALINDI, SUPERSE, SUPERSEDE
  - `ocak-kronoloji.md:5` — `0, gerçek iPhone eyeball temiz]. ETKİNLİK LİSTE TEK-KABUK [KARAR 373-382: EtkinlikListe.astro ortak bileşen (benzetme değil paylaşım), **KARAR 330 SUPERSEDE** (dikey sapma = eksik render rasyonalizasyonu), `[`
- **381** (1 geçiş) — sinyal: GERI ALINDI
  - `ocak-pilot.md:35` — `ap dahil, sabit değer reddedildi ("sabit olursa patlarız") [KARAR 381]. Buton dili OCAK'laştırma denendi → **geri alındı**, KARAR 334 orijinali korundu, mock'lu ayrı tura ertelendi [KARAR 382]. **KARAR 336 (so`
- **383** (4 geçiş) — sinyal: GERI ALINDI, İPTAL
  - `ocak-kronoloji.md:5` — `ndı — `3c2b865` main/production]. KAYIT PENCERESİ + TZ FIX [KARAR 383-388: çift-uçlu `pencereIcinde` (kapanış DAHİL/başlangıç HARİÇ), statü hiyerarşisi Dolu görünür-İptal gizli, build-time gün kararı Europe/Is`
- **384** (1 geçiş) — sinyal: İPTAL
  - `ocak-pilot.md:37` — `e İptal), **Dolu görünür kalır**, Kayıt Açık cutoff'a tabi [KARAR 384]. **TIMEZONE:** Vercel build server UTC; `new Date()+setHours` TR 00:00–03:00'te cutoff'u bir gün geriye kaydırıyordu → build-time gün kara`
- **398** (2 geçiş) — sinyal: GERI ALINDI, IPTAL
  - `ocak-pilot.md:3` — `ef kaydı, marker sözleşmesi, WhatsApp display name "OCAK" — KARAR 398-410], LİSTE AİLESİ TEK GRAMER [dört lehçe → tek `.liste__oge`, meta-slot iptali, statik/accordion ölçütü liste doğasına bağlı + ilk-açık, K`
- **404** (1 geçiş) — sinyal: REVIZE
  - `ocak-pilot.md:43` — `mlılık / götürme reddi), /hakkimizda'daki 4. kopya silindi [KARAR 404]. /atolye karar sayfasıdır — ölçüt liste uzunluğu değil **seçim mi merak mı** [KARAR 405 ⚠ ölçüt 413 ile revize edildi]. **SESSİZ FAKİRLEŞM`
- **405** (2 geçiş) — sinyal: EMEKLI, REVIZE, SUPERSE, SUPERSEDE
  - `ocak-kronoloji.md:5447` — `# Parti içi supersede: KARAR 405 → 413 (statik/accordion ölçütü), KARAR 406 → 423 (kayit-cta emekli). İkisi de fiilen uygulandığı için mühürlendi, silinmedi.`
- **406** (5 geçiş) — sinyal: EMEKLI, SUPERSE, SUPERSEDE
  - `ocak-kronoloji.md:5447` — `i içi supersede: KARAR 405 → 413 (statik/accordion ölçütü), KARAR 406 → 423 (kayit-cta emekli). İkisi de fiilen uygulandığı için mühürlendi, silinmedi.`
- **411** (2 geçiş) — sinyal: IPTAL
  - `ocak-kronoloji.md:4` — `si, WhatsApp display name "OCAK"]. LİSTE AİLESİ TEK GRAMER [KARAR 411-419: dört lehçe → tek `.liste__oge` collapsible, meta-slot iptali, statik/accordion ölçütü liste doğasına + ilk-açık, KARAR 336 satır-scope`
- **412** (2 geçiş) — sinyal: IPTAL
  - `ocak-referans.md:1175` — `**Meta-slot iptali (KARAR 412):** Statik açık listelerde sağ meta etiketi ("tek akşam" / "6 Hafta", suffix'ten parse) **tamamen kaldırıldı**; süre bilgisi gövdeye doğal`
- **414** (1 geçiş) — sinyal: IPTAL, REVIZE
  - `ocak-referans.md:1179` — `**KARAR 336 satır-scope revizesi (KARAR 414):** KARAR 336 iptal değil **rafine** edilir. Ember-durum ayrımı yalnız `variant='satir'` (takvim listesi) için geçerlidir: nötr satır ash r`
- **420** (1 geçiş) — sinyal: EMEKLI
  - `ocak-pilot.md:3` — `, placeholder fallback, dropdown label = etkinlik başlığı — KARAR 420-422, merge `7c3b332`], KAYIT BUTONU BİRLEŞTİRME [`kayit-cta` emekli → sonraki-bulusma + mini-cta iki-section, buton metni etkinlik `Kayıt T`
- **423** (10 geçiş) — sinyal: EMEKLI, SUPERSE, SUPERSEDE
  - `ocak-kronoloji.md:3` — `-yatırım yasağı, format sayfası kayıt marker zorunluluğu (⚠ KARAR 423 ile supersede); `af5a7a0` → merge `cf288c1` main/production]. YOLCULUK METİN TURU [KARAR 434-440: kavram katmanı Anadolu-spesifik gerçekler`
- **424** (4 geçiş) — sinyal: SUPERSE, SUPERSEDE
  - `ocak-kronoloji.md:3` — `önüş 4g5g, sıklık sözü yasağı, CTA tek-etkinlik-vs-havuz (⚠ KARAR 424 ile kısmen supersede), liste-vs-karşılaştırma deseni, WhatsApp push/pull çerçevesi, nesneleştirme + inkâr-eden-kelime disiplinleri; 0 kendi`
- **432** (1 geçiş) — sinyal: SUPERSE, SUPERSEDE
  - `ocak-pilot.md:59` — `]. Fiyat sayfada geçmez, "sembolik" de "yatırım" da denmez [KARAR 432]. Format sayfası kayıt CTA'sı için Notion marker zorunluluğu kuralı doğdu [KARAR 433 ⚠ KARAR 423 ile supersede]. 162/162 test, build 0 erro`
- **433** (4 geçiş) — sinyal: EMEKLI, SUPERSE, SUPERSEDE
  - `ocak-kronoloji.md:5639` — `# Parti içi supersede: [KARAR 433] ← KARAR 423 (form-anchor/kayit-cta mimarisi emekli);`
- **444** (1 geçiş) — sinyal: SUPERSE, SUPERSEDE
  - `ocak-pilot.md:63` — `ılmaz, takvim gösterir** — "ayda en az bir" 5 yerden düştü [KARAR 444]. CTA buton dili tek-etkinlik-vs-havuz kuralı [KARAR 445 ⚠ KARAR 424 ile kısmen supersede: nötr durum "Tarihlere bak" değil "Yerini ayır"].`
- **445** (3 geçiş) — sinyal: SUPERSE, SUPERSEDE
  - `ocak-referans.md:1221` — `**CTA buton dili — tek etkinlik vs havuz (KARAR 445) ⚠ KARAR 424 ile KISMEN SUPERSEDE.** Kural: buton bir TEK etkinliğe mi açılıyor, HAVUZA mı? (1) Tek belirli etkinlik kartı → tipini söyler`

## 6. Uygulanmama sinyali taşıyanlar

Bağlamında `UYGULANMADI` / `⚠` / `açık borç` / `commit yok` / `teyit alınmadı` geçen numaralar. **Ham liste — yorum yok.**

37 numara:

- **101** (1 geçiş) — sinyal: COMMIT YOK
  - `ocak-kronoloji.md:3352` — ``.claude/notes.md` gitignored (KARAR 101) → tracked değişiklik yok → commit yok. Brief sonu CC raporu "notes.md güncellendi" geçer. Kanonik kayıt Pilot'a Claude tarafından eklenir.`
- **102** (1 geçiş) — sinyal: COMMIT YOK
  - `ocak-kronoloji.md:2136` — `**KARAR 102 raporlar (commit yok)** — Brief G.1'in iki keşfi:`
- **147** (1 geçiş) — sinyal: AÇIK BORÇ
  - `ocak-kronoloji.md:4148` — `lt simetri 24/24. robots.txt `User-agent: * / Disallow: /` (KARAR 147 stealth korundu). main = astro-iskelet = `1158dd5` hizalı. **Değişmeyen açık borçlar:** ölü `/kayit/...` link temizliği, Etkinlikler DB `ka`
- **149** (1 geçiş) — sinyal: AÇIK BORÇ
  - `ocak-kronoloji.md:3556` — `ncesi 5 açık borç temizliği + Vercel CLI/UI çelişki keşfi + KARAR 149 docs teyidi.`
- **153** (1 geçiş) — sinyal: ⚠
  - `ocak-kronoloji.md:5236` — `⚠️ Patch uygulamadan ÖNCE: kod yorumlarındaki yanlış "KARAR 153" → doğru numara (`KARAR 177`) find-replace. CC: patch uygula + npm test + token'lı `npm run build` + iPhone Safari eyeball + commit/push +`
- **176** (1 geçiş) — sinyal: ⚠
  - `ocak-kronoloji.md:4964` — `andbox+dist+Node v-flag). ⚠️ **AtesMektuplari ember glyph (`KARAR 176`) PUSH BEKLEMEDE** — brief yazıldı, #36 ilk işi. Eyeball matrisi (5 form × Unicode×ASCII × Chrome×Safari) atlandı (yorgunluk), #36'ya. (Arş`
- **177** (1 geçiş) — sinyal: ⚠
  - `ocak-kronoloji.md:4968` — `- **#35 /takvim kompakt satır + tür filtresi (`KARAR 177`):** Kart→kompakt satır + client-side tür filtresi + `## section: etkinlik-takvimi` fragment marker. 7 dosya, sandbox 66/66. ⚠️ **AÇIK: CC`
- **178** (1 geçiş) — sinyal: ⚠
  - `ocak-kronoloji.md:4970` — `→72. ⚠️ Araçlar son commit'ler promote durumu açık. (Arşiv: KARAR 178-180)`
- **186** (1 geçiş) — sinyal: UYGULANMADI
  - `ocak-kronoloji.md:3530` — `brief hazır (`touch-action: manipulation` + `pointerdown`, [KARAR 186]), uygulanmadı. Commit + push (astro-iskelet) + deploy + gerçek iPhone teyit hepsi açık.`
- **187** (4 geçiş) — sinyal: AÇIK BORÇ, COMMIT YOK, UYGULANMADI, ⚠
  - `ocak-kronoloji.md:4669` — `şürüyorsa document layout genişliği viewport'tan büyüktür). KARAR 187 (Brief M, sabit-px `::after` glow taşması) nüksü hipotezi kuruldu; Pilot'ta zaten "sabit px pseudo audit yayılımı" açık borç olarak duruyor`
- **240** (1 geçiş) — sinyal: ⚠
  - `ocak-referans.md:788` — `ikincisi pahalılık meşrulaştırmasıdır. Kademeli dayanışma (KARAR 240) + askı/kor opt-in miras alınır; hedef bant Anadolu'nun %8-12'si, kesin rakamlar açık. ⚠ Bu karar `/acik-kapi`'nin "sembolik ücret" ifadesi`
- **256** (1 geçiş) — sinyal: UYGULANMADI
  - `ocak-kronoloji.md:4897` — `` guard'lı, GELaiL bit-bit korunur, `gelail_code.js` diff) [KARAR 256]. **OCAK→Sonnet** (`claude-sonnet-4-6`, disambiguation+ton, ~$30-40/ay, **henüz uygulanmadı** tek satır) [KARAR 257]. Prompt sayfası statik`
- **257** (3 geçiş) — sinyal: UYGULANMADI
  - `ocak-kronoloji.md:4019` — `on+ton+hatasızlık için. **Henüz uygulanmadı** (tek satır). [KARAR 257] **Prompt sayfası statik / Code node dinamik ayrımı:** prompt sayfası ("Bot | Ocak", H1 başlıklar) = kalıcı bilgi + kurallar + program tanı`
- **323** (2 geçiş) — sinyal: ⚠
  - `ocak-kronoloji.md:4517` — `on kalktı, nedir kapanışına indi, üç-kez tekrar temizlendi (KARAR 323). /hikaye `adimizin-hikayesi` → `adimiz` kısaldı + ocak-ne arkasına taşındı, yeni section sırası (KARAR 324) — ⚠ yapıştırmada marker-bold +`
- **324** (2 geçiş) — sinyal: ⚠
  - `ocak-kronoloji.md:4517` — `z` kısaldı + ocak-ne arkasına taşındı, yeni section sırası (KARAR 324) — ⚠ yapıştırmada marker-bold + link-düşme hataları yakalandı. Ok konum kanonu: tıklanır link ok-sonda `[X →]`, ok-önde yalnız Sıradaki Kap`
- **326** (1 geçiş) — sinyal: AÇIK BORÇ
  - `ocak-referans.md:780` — `Site geneli "Uluslararası Yolculuk" sweep'i **yapılmadı** (KARAR 326 bakım tetikleyicisi, açık borç). Marka dosyası K3 tanımı bu partide düzeltildi (v1.4).`
- **329** (1 geçiş) — sinyal: ⚠
  - `ocak-pilot.md:5` — `ber çizgi ⚠eyeball, detay Hero+buton, buluşmalar sekme H5 — KARAR 329-339, 7 commit astro-iskelet MERGE EDİLMEDİ], ANADOLU MOBİL ŞERİT [viewport-ayrık masaüstü-harita/mobil-şerit @768px, şerit sadece evre adı,`
- **334** (1 geçiş) — sinyal: ⚠
  - `ocak-kronoloji.md:4843` — `rılmaz [KARAR 333]. Buton "Yerini ayır"/Kayıt-Tipi şablonu [KARAR 334]. Kayıt bloğu: dar kart→bitişik buton→altında link, "yerin hazır" kaldırıldı + CSS yedek [KARAR 335]. Sol ember çizgi tüm kartlarda — ⚠ fii`
- **335** (2 geçiş) — sinyal: ⚠
  - `ocak-kronoloji.md:4527` — `→ altında link, "yerin hazır" metni kaldırıldı + CSS yedek (KARAR 335). Sol ember çizgi tüm kartlarda — ⚠ fiilen uygulandı mı Kaan eyeball TEYİT ETSİN (KARAR 336). Detay sayfası kart kaldırıldı Hero+buton (KAR`
- **336** (1 geçiş) — sinyal: ⚠
  - `ocak-kronoloji.md:4527` — `kartlarda — ⚠ fiilen uygulandı mı Kaan eyeball TEYİT ETSİN (KARAR 336). Detay sayfası kart kaldırıldı Hero+buton (KARAR 337). Link metni bağlama göre (KARAR 338). Buluşmalar sekme sırası kanonik H5/FORMAT_ORDE`
- **346** (1 geçiş) — sinyal: TEYIT ALINMADI
  - `ocak-kronoloji.md:4507` — `evsim kart-vitrin (filiz·güneş·başak·mum) Faz 5/vitrin işi (KARAR 346 vitrin deseniyle örtüşür). Teyit alınmadı.`
- **363** (1 geçiş) — sinyal: UYGULANMADI, ⚠
  - `ocak-pilot.md:3` — `POS (297 zincirlenir), Vercel team slug kso2025→hlaorpz — **KARAR 363, 364**, 389], TAKVİM HASH + AYRAÇ + WA NUMARA [`/takvim#slug` ön-seçili filtre, hashchange/pageshow eki ⚠UYGULANMADI, hash eyeball hard-rel`
- **372** (2 geçiş) — sinyal: UYGULANMADI, ⚠
  - `ocak-pilot.md:33` — `dth − clientWidth` ile okunur ve gerçek cihazda doğrulanır [KARAR 372]. ⚠ **ÖNERİLEN `overflow-x: clip` GEÇİŞİ UYGULANMADI** — gerçek cihaz eyeball'ı bug'ı doğrulamadı (Kaan, iPhone: ana sayfada zoom-out sayfa`
- **390** (3 geçiş) — sinyal: UYGULANMADI, ⚠
  - `ocak-kronoloji.md:5` — `e mesajı 363+364'ü gömdü]. TAKVİM HASH + AYRAÇ + WA NUMARA [KARAR 390-396: `/takvim#slug` ön-seçili filtre (slugToFormatHam reverse-türetme, programatik click), hashchange/pageshow eki ⚠UYGULANMADI, hash eyeba`
- **391** (3 geçiş) — sinyal: AÇIK BORÇ, COMMIT YOK, UYGULANMADI, ⚠
  - `ocak-pilot.md:41` — `pageshow(persisted)` eki; hash silinirse Tümü'ye zorlanmaz [KARAR 391 — ⚠ **UYGULANMADI**, gitlog'da commit yok, açık borç]. Hash'e bağlı davranışların eyeball'ı **hard-reload** ile [KARAR 392]. `/bulusmalar``
- **398** (1 geçiş) — sinyal: ⚠
  - `ocak-referans.md:53` — `⚠ Bu tablo yalnız Parti 1 ve öncesi içindir.** Parti 2'den (KARAR 398-428) itibaren dönem güncellemeleri **bu dosyaya yerinde işleniyor** (KARAR 397 protokolü) — ilgili A.X başlıklarının sonunda "### 12–20 Tem`
- **402** (1 geçiş) — sinyal: ⚠
  - `ocak-kronoloji.md:3` — `RİK/EDİTORYAL TURU [KARAR 441-448: portre dili site kanonu (KARAR 402'nin kaynağı), bilgi dili Reçete/kürsü doktrini, Anadolu süre standardı 3g4g/Dönüş 4g5g, sıklık sözü yasağı, CTA tek-etkinlik-vs-havuz (⚠ KA`
- **404** (1 geçiş) — sinyal: ⚠
  - `ocak-pilot.md:43` — `mlılık / götürme reddi), /hakkimizda'daki 4. kopya silindi [KARAR 404]. /atolye karar sayfasıdır — ölçüt liste uzunluğu değil **seçim mi merak mı** [KARAR 405 ⚠ ölçüt 413 ile revize edildi]. **SESSİZ FAKİRLEŞM`
- **405** (1 geçiş) — sinyal: ⚠
  - `ocak-pilot.md:43` — `fasıdır — ölçüt liste uzunluğu değil **seçim mi merak mı** [KARAR 405 ⚠ ölçüt 413 ile revize edildi]. **SESSİZ FAKİRLEŞME VAKASI:** `KayitCTA.astro` hiçbir sayfada render edilmiyordu — Notion marker'ı `form-an`
- **406** (1 geçiş) — sinyal: ⚠
  - `ocak-pilot.md:43` — `i. Çözüm B: marker component instance'a delege (`3b84e4f`) [KARAR 406 ⚠ 423 ile emekli edildi]. Inline altın bug'ı: gerçek ezici genel `em` kuralıydı → `del/s içi em/strong { color: inherit }` (`eabd22f`) [KAR`
- **423** (5 geçiş) — sinyal: AÇIK BORÇ, UYGULANMADI, ⚠
  - `ocak-kronoloji.md:3` — `-yatırım yasağı, format sayfası kayıt marker zorunluluğu (⚠ KARAR 423 ile supersede); `af5a7a0` → merge `cf288c1` main/production]. YOLCULUK METİN TURU [KARAR 434-440: kavram katmanı Anadolu-spesifik gerçekler`
- **424** (4 geçiş) — sinyal: UYGULANMADI, ⚠
  - `ocak-kronoloji.md:3` — `önüş 4g5g, sıklık sözü yasağı, CTA tek-etkinlik-vs-havuz (⚠ KARAR 424 ile kısmen supersede), liste-vs-karşılaştırma deseni, WhatsApp push/pull çerçevesi, nesneleştirme + inkâr-eden-kelime disiplinleri; 0 kendi`
- **429** (1 geçiş) — sinyal: ⚠
  - `ocak-pilot.md:80` — `⚠ **Buluşma kapısı sayısı: ALTI → YEDİ** (KARAR 429, 438). Yedinci kapı **Yolculuk (online)**. `/bulusmalar` sırası taahhüt ağırlığına göre: Açık Kapı (1) → Çember (2) → Seremoni (3) → Atölye`
- **432** (1 geçiş) — sinyal: ⚠
  - `ocak-pilot.md:59` — `]. Fiyat sayfada geçmez, "sembolik" de "yatırım" da denmez [KARAR 432]. Format sayfası kayıt CTA'sı için Notion marker zorunluluğu kuralı doğdu [KARAR 433 ⚠ KARAR 423 ile supersede]. 162/162 test, build 0 erro`
- **433** (2 geçiş) — sinyal: ⚠
  - `ocak-referans.md:1219` — `**Format sayfası kayıt CTA marker zorunluluğu (KARAR 433) ⚠ KARAR 423 ile SUPERSEDE.** Doğduğu andaki hâli: kutu-buton KayitCTA render'ı için Notion body'sinde `## section: form-anchor` marker'ı z`
- **444** (1 geçiş) — sinyal: ⚠
  - `ocak-pilot.md:63` — `ılmaz, takvim gösterir** — "ayda en az bir" 5 yerden düştü [KARAR 444]. CTA buton dili tek-etkinlik-vs-havuz kuralı [KARAR 445 ⚠ KARAR 424 ile kısmen supersede: nötr durum "Tarihlere bak" değil "Yerini ayır"].`
- **445** (2 geçiş) — sinyal: ⚠
  - `ocak-referans.md:1221` — `**CTA buton dili — tek etkinlik vs havuz (KARAR 445) ⚠ KARAR 424 ile KISMEN SUPERSEDE.** Kural: buton bir TEK etkinliğe mi açılıyor, HAVUZA mı? (1) Tek belirli etkinlik kartı → tipini söyler`

---

## EK — `tarih_ipucu` boş kalan satırlar

60 satırda `tarih_ipucu` boş. **Tahmin edilmedi** (brief yasağı).

- `ocak-kronoloji.md` — 41 satır
- `ocak-pilot.md` — 19 satır

Sebep (ham gözlem): `ocak-pilot.md` dosyasında tarih içeren **hiç başlık yok**; `ocak-kronoloji.md` boşlukları ilk tarihli başlıktan (`## Sohbet #1`) **önceki** giriş/indeks bölgesinde.

## EK — kapsam dışı tek sayım

`.claude/notes.md` — **67** benzersiz KARAR numarası, **189** toplam geçiş.
(ADIM 1 kapsamına girmez, envantere dahil edilmedi.)
