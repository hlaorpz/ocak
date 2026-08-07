# OCAK — NOTION SÖZLEŞMELERİ (20-ref)

**Ne taşır:** DB property referansları, schema kuralları, workspace yapısı, yazım
disiplini, kod↔Notion sıra dersleri.
**Kritik komşu:** marker sözleşmesi (KARAR 409) `20-ref-protokoller.md`'de yaşar —
kod tarafı bir disiplindir; buradan oraya bakılır.

*Bu dosyanın gövdesi `ocak-pilot.md` v52'den **birebir** taşındı (ADIM 3, 6 Ağustos 2026). Hiçbir cümle kısaltılmadı, yeniden yazılmadı. Satır-satır köken izi: `docs/_arsiv/_bolme-haritasi.tsv`.*

---

**Görünür-etiket vs veri-otoritesi ayrımı (KARAR 283 taşınabilir dersi):** Bir Notion select değerinin kullanıcıya farklı görünmesi gerektiğinde, Notion değerini rename etme (DB satırı taşıma + sessiz-eşleşme riski) — kod-tarafı label map kur. Notion değeri veri otoritesi kalır; label sadece display. **Kritik:** sort key, `data-*` attribute, filtre-eşleşme, set üyeliği DAİMA ham değerle çalışır; sadece görünen metin label'dan gelir. (Seremoni "Yol B", saat fallback aynı aile.)

**Schema tasarım kuralı (KARAR 288):** **Kapalı/tasarlanmış küme → `z.enum` (build-time typo koruması, ör. Format 7 değer sabit). Serbest/büyüyen alan → `z.string()` (sürekli yeni değer, ör. Mekân/Platform il/platform).** Notion select'i koddan bağımsız genişleyebiliyorsa enum'u orada tutmak build'i patlatır; ya her seferinde hizala ya string'e gevşet. Gevşetmenin bedeli: o alanda typo build'de yakalanmaz (etkisi düşükse kabul).

**Notion↔kod sıra dersi (KARAR 295):** Notion↔kod hizalaması gereken bir işte "önce Notion" değişikliği yaparsan kod push'u HEMEN ardından gelmeli — arada eyeball penceresi bırakma. Schema mismatch (`InvalidContentEntryDataError`) build'i sabit kırık tutar, o branch'te başka hiçbir iş push edilemez. Kırık build penceresi açıldıysa, o pencerede giden küçük işler zorunlu olarak birleşir (kurtarma operasyonu, karıştırma değil — commit dürüst belgeler).

**Veri merkezi:** Notion. İçerik canlı binding aktif (Mayıs 2026, KARAR 97); form veritabanı geçişi lansman sonrası (Sheets → Notion, ~3-4 saatlik teknik iş, KARAR 96). **admin.html iptal — Notion workspace admin paneli görevini görüyor (KARAR 98).**
**Notion Başvurular DB (#28 sonu, #29 İletişim eklendi):** 18 property — Ad/Email/Telefon/Tip/İlk dokunuş kanalı/Tarih/Durum/Kaynak/Niyet mektubu/Geçiş notu/Sağlık notu/Çember deneyimi/Yaş/Şehir/Ekonomik katılım/Atanan/Görüşme tarihi/Notlar. Tip enum: Anadolu/Çember/Açık Kapı/Ateş Mektupları/İletişim. 5 form'dan paralel yazma. DB ID `36bb61ebfa8780aa909efdb0348ac637`. Apps Script PropertiesService'te `NOTION_TOKEN` + `NOTION_BASVURULAR_DB_ID` (üçüncü yer — lokal `.env` + Vercel env'in yanına). Sheets paralel yazma korundu (Q6 cevap, lansman sonrası cutover kararı).
**Notion Sayfalar DB property'leri (yapısal):** `Sayfa Başlığı`, `URL`, `Meta Açıklama`, `Durum`, `Yayınla`, `OG Görsel`. **Kaan tarafından eklenmiş kolonlar (kod tarafı görmüyor, Cowork işi):** `Oda` (select, KARAR 150 #34A) — `notion-pages.ts` whitelist mantığı sayesinde build'i etkilemez, sadece Kaan'ın gözü için.

**Notion Etkinlikler DB tam property referansı (#39 sonu):** Yöneten[select], Mekân/Platform[select: Online/İzmir/İstanbul/Ankara/Ege/Anadolu/Zoom — kod z.string], Saat[rich_text insan-okur], Zoom Başlangıç Saati[rich_text makine], Konum Detay[rich_text adres], Detay[rich_text], Slug[rich_text], Ücret[number], Para Birimi[select TRY/USD/EUR], Format[select: Çember/Açık Kapı/Seremoni/Atölye/Şehir Akşamı/Mini Retreat/Yolculuk — kod z.enum]. DB ID `365b61ebfa8780db9477c8966c23bf11`.

**Notion workspace yapısı:** Site İçerik (Sayfalar, SSS) · Operasyon (Etkinlikler, Kayıtlar, Kadınlar, **Başvurular #28**) · Program (Çember Döngüsü, Workshop Şablonları, Araçlar, Ekip) · Strateji (Master Prompt) · Bot (Knowledge, Konuşmalar — lansman sonrası).

Tam mimari + database property listeleri + view yapıları: bu dosyanın alt bölümü
(A.22 gövdesi, B32 ile taşındı — KARAR 56-60, 73-77, 82, 96, 97, 125).

- **Notion içerik yazım disiplini (KARAR 118):** Kaan Notion'da içerik yazarken hiç markdown delim karakteri (`*` `_` `**` `__`) yazmaz. Tüm vurguyu Cmd+B / Cmd+I annotation ile yapar. Detay: `notion-yazim-rehberi.md` yan belge. Plugin KARAR 108 7 kural ile eski yapıştırılan literal artıkları temizler — rehber yeni içerik için disiplindir, defansif değildir.

- **Notion içerik yazım rehberi (KARAR 125 sonrası güncel):** `notion-icerik-yazim-rehberi.md` Project Knowledge'a yan dosya olarak yüklü, 13 bölümlü kapsamlı rehber — markdown delim disiplini + section etiketleri + 5 kanonik + hero/bir-sonraki/sıradaki-kapı/sss/form-anchor detayları + link disiplini + cleanup checklist + sık hatalar. Repo'daki `docs/sayfa-yazim-rehberi.md` (KARAR 111) kısa kod sözleşmesi tarafı; Notion rehberi onun detaylı operasyonel uzantısı.
- **Sayfa içi Notion linkler (KARAR 119 + 120):** Notion'da inline link / page mention kullanılırsa dist'e `https://www.notion.so/<slug>` olarak düşer. KARAR 119'da 4 sayfada 21+ link tespit edildi. KARAR 120 (Brief F) plugin defansif normalize ekledi — 18 sayfa slug whitelist'i ile internal `/<slug>`'a çevirir (11 direct slug normalize), whitelist dışı external link'ler + nested path'ler + hash fragment'ler korunur + warn. Yeni içerik girişlerinde internal sayfa referansları doğrudan slash URL yazılırsa (`/cember`) defansa gerek kalmaz. Kalan 12 link (hash fragment + nested kayit/basvuru + 7 diğer) içerik-bağımlı, lansman sonrası Notion-side cleanup.

- **Notion property whitelist mantığı (KARAR 150 #34A pedagojisi):** `src/lib/notion-pages.ts` loader sadece bildiği property'leri okur (`Sayfa Başlığı`, `URL`, `Meta Açıklama`, `Durum`, `Yayınla`, `OG Görsel`). Bilmediği property'yi görmezden gelir. Notion'a yeni kolon eklemek (örn. "Oda", "Notlar", "Status") build'i etkilemez. Mevcut property isimleri **değiştirilemez** (Zod schema patlar). Yeni sayfa eklenirse ODA_MAP'e ekleme disiplini (KARAR 87, kod tarafı slug→oda map'i `src/lib/oda-map.ts`).

---

*Aşağıdaki gövde `ocak-referans.md` v46'dan **birebir** taşındı (B32, 7 Ağustos 2026).
Hiçbir cümle kısaltılmadı, yeniden yazılmadı. Satır-satır köken izi:
`docs/_arsiv/_bolme-haritasi-referans.tsv`.*

---

### Tasarım Notları Sade Tutulur (KARAR 70)

Sayfa property'sinde "Tasarım Notları" alanı **istisna kararların kaydı** olarak kullanılır — uzun checklist değil. Genel görsel kimliği burada tekrar etmez. Her sayfa için 4-6 madde yeterli, sadece o sayfaya özgü kritik kararlar.

## A.22 — NOTION DATABASE YAPISI (KARAR 73-77, 82)

### Notion Workspace Yapısı

```
OCAK (workspace)
├── Site İçerik
│   ├── Sayfalar (database) — 18+ sayfa metni
│   └── SSS — ayrı DB değil, her sayfanın `section: sss` bloğunda inline yaşar (KARAR 93)
├── Operasyon
│   ├── Etkinlikler (database) — 30+ property, 9 view
│   ├── Kayıtlar (database) — 12 property
│   └── Kadınlar (database) — sonra (Yıl 1 ortası)
├── Program
│   ├── Çember Döngüsü (database) — 12 satır
│   ├── Workshop Şablonları (database) — 7 şablon
│   ├── Araçlar (database) — iskelet
│   └── Ekip (database) — Advaita kaydı
├── Strateji
│   └── Master Prompt (canlı belge)
└── Bot — lansman sonrası
    ├── Knowledge (database)
    └── Konuşmalar (database)
```

### Çember Döngüsü Database (KARAR 73)

**Konum:** Program sayfası → database
**Amaç:** Çember yıllık döngüsünün 12 temasının iç model + site veri kaynağı

**Property'ler (8 alan):**
- Ay (Title)
- Sıra (Number, 1-12)
- Tema (Text)
- Çekirdek Soru (Text)
- Açıklama (Text)
- Yöneten (Select: Advaita / Çekirdek Ekip / Dönen Konuk)
- Kullanılan Araçlar (Multi-select)
- Site'de Göster (Checkbox)

**Site bağı:** Site sadece 3 alan çeker (Ay, Tema, Çekirdek Soru). Diğer alanlar iç planlama içindir.

### Workshop Şablonları Database (KARAR 74)

**Konum:** Program sayfası → database
**Amaç:** Workshop'un tekrar eden iskeleti. Bir şablon defalarca açılır (Etkinlikler'de instance olarak)

**Property'ler (17 alan):**
- İsim (Title) · Slug (Text) · Tür (Select: Seri Program / Tek Seferlik Atölye)
- Süre · Hafta/Oturum Sayısı (Number) · Oturum Uzunluğu · Kapasite (Number)
- Yöneten Tipi (Select: Advaita / Çekirdek Ekip / Dışarıdan Uzman / Hibrit)
- Kategori (Multi-select) · Kısa Açıklama · Detaylı Açıklama
- Hafta Akışı (Text, "|" ayraç) · Çıktı · Kim İçin
- Aktif (Checkbox) · Site'de Göster (Checkbox) · Sıra (Number)

**İlk 7 şablon:**
1. Ritüel Tasarımı (Seri Program, 4 hafta, Advaita)
2. Nefes Yolu (Seri Program, 6 hafta, Hibrit)
3. Beden Dili (Seri Program, 6 hafta, Çekirdek Ekip)
4. Sınır Koyma Sanatı (Seri Program, 4 hafta, Çekirdek Ekip)
5. İç Çocuk Atölyesi (Seri Program, 4 hafta, Çekirdek Ekip)
6. Kadın ve Para (Seri Program, 4 hafta, Hibrit)
7. Kakao ve Sohbet (Tek Seferlik Atölye, 2.5 saat, Advaita)

**3 view:** Aktif Şablonlar (default) · Site Görünümü · Tüm Şablonlar

### Etkinlikler Database — 30+ Property (KARAR 75)

**Konum:** Operasyon sayfası → mevcut Etkinlikler database

Sohbet #10'da 9 property ile kurulmuştu. Sohbet #11'de 30+ property'ye genişletildi.

**Tam property listesi:**

Temel (9):
1. Başlık (Title)
2. Format (Select)
3. Tarih (Date — Include time KAPALI)
4. Mekân/Platform (Select)
5. Konum Detay (Text)
6. Kısa Açıklama (Text)
7. Kayıt Linki (URL)
8. ~~Durum~~ (silindi — Statü ile çakışıyordu)
9. Öne Çıkar (Checkbox)

Ek (21):
10. Saat (Text — "19:00-20:30")
11. Tema (Text)
12. Yöneten (Select: Advaita / Çekirdek Ekip / Dönen Konuk / Advaita + Konuk)
13. Kapasite (Number)
14. Statü (Select: Taslak / Kayıt Açık / Dolu / Geçti / İptal)
15. Kayıt Açılış Tarihi (Date)
16. Kayıt Kapanış Tarihi (Date)
17. Min. Katılımcı (Number)
18. Ücret (Number)
19. Erken Kayıt Ücreti (Number)
20. Lansman Postu Atıldı (Checkbox)
21. IG Postu Linki (URL)
22. Mailerlite Kampanyası (URL)
23. WhatsApp Davet Atıldı (Checkbox)
24. Reklam Bütçesi (Number)
25. Zoom Linki Oluşturuldu (Checkbox)
26. Hatırlatma Maili Atıldı (Checkbox)
27. Kayıt Yüklendi (Vimeo) (Checkbox)
28. Geri Bildirim Toplandı (Checkbox)
29. Workshop Şablonu (Relation → Workshop Şablonları, two-way)
30. Notlar (Sonrası) (Text)
31. Site'de Göster (Checkbox)

İlişki ve Rollup/Formula (8):
32. Kayıtlar (Relation → Kayıtlar, two-way)
33. Ödeme Durumları (Rollup → Kayıtlar.Ödeme Durumu, Show original)
34. Toplam Kayıt Sayısı (Rollup → Kayıtlar.Kayıt ID, Count all)
35. Ödenmiş Sayı (Formula — `length(filter(prop("Ödeme Durumları"), current == "Ödendi"))`)
36. Beklemede Sayı (Formula — `length(filter(prop("Ödeme Durumları"), current == "Beklemede"))`)
37. Beklenen Gelir (Formula — `prop("Toplam Kayıt Sayısı") * prop("Ücret")`)
38. Tahsil Edilen Gelir (Formula — `prop("Ödenmiş Sayı") * prop("Ücret")`)
39. Kalan Kontenjan (Formula — `prop("Kapasite") - prop("Toplam Kayıt Sayısı")`)

**Not — Rollup filtreleme:** Notion'un Rollup property'sinde direkt filtre ekleme bazı sürümlerde çalışmıyor. Çözüm: "Show original" Rollup ile listeyi al, Formula ile filtreli sayım yap.

### Kayıtlar Database (KARAR 76)

**Konum:** Operasyon sayfası → yeni database
**Amaç:** Etkinliklere kayıt olan her kadın için bir satır

**Property'ler (12 alan):**
1. Kayıt ID (Title)
2. Kadın (Text — Kadınlar database kurulduğunda Relation'a yükseltilecek)
3. Etkinlikler (Relation → Etkinlikler, two-way)
4. Kayıt Tarihi (Created time)
5. Ödeme Durumu (Select: Beklemede / Ödendi / İade / Bedava)
6. Ödeme Tarihi (Date)
7. Ödeme Yöntemi (Select: Havale / Kredi Kartı / Iyzico / Stripe / Diğer)
8. Ödenen Tutar (Number)
9. Kayıt Kaynağı (Select: Site / WhatsApp / Mail / Tally / Manuel)
10. Katıldı mı (Checkbox)
11. Geri Bildirim Verdi (Checkbox)
12. Notlar (Text)

### Etkinlikler 9 View Yapısı (KARAR 77)

**Notion view'ları admin paneli görevini yapar.** Sekiz view operasyonel, dokuzuncu veri girişi içindir.

1. **Yaklaşan** (default) — Tarih ≥ Today AND Statü ≠ İptal. Günlük göz.
2. **Takvim** — Calendar tipi. Filter: Site'de Göster: Checked. Color by Format.
3. **Format'a Göre** — Group by Format. Tür bazında planlama.
4. **Operasyonel Panel** — Önümüzdeki 1 ay. Pazarlama/teknik kurulum kontrolü.
5. **Gelir Takibi** — Group by Month. Aylık muhasebe. Footer: Sum.
6. **Pazarlama Durumu** — Lansman ve duyuru takibi.
7. **Geçmiş** — Tarih < Today. Arşiv ve geri bakma.
8. **Site Public** — Site API'sine bağlanacak (sohbet #20'de). Filter: Tarih ≥ Today AND Site'de Göster AND Statü ≠ Taslak/İptal.
9. **Tüm Alanlar** — Filter yok. Veri girişi için.

### Notion Pratik Prensipleri (KARAR 82)

**1. Date property'sinde Include time KAPALI.** Saat ayrı Text property olarak. Sebep: Text aralık ("19:00-20:30") tutabiliyor; Date sadece tek noktayı.

**2. Relation iki-yönlü (two-way) olarak kurulur.** Tek yönlü, ileride Rollup/Formula yapmayı engelliyor.

**3. Rollup filtreleme Formula ile yapılır.** Show original Rollup + Formula ile filtreli sayım.

**4. CSV import otomatik tipi kestiremez.** Number, Checkbox bazen Text olarak çekiliyor. Import sonrası kontrol et.

**5. Her property "kategori" gibi düşünülmüyor — düz liste.** Property gruplaması yok.

**6. View'larda her görünüm kendi property visibility'sine sahip.** Veri girişi için "tüm alanlar" view'ı şart.

**7. Filter dilini sürüm karıştırıyor.** "Does not equal" / "Is not" aynı iş. Advanced Filter daha güvenilir.

---

### Notion Internal Integration "Ocak Site" (KARAR 97)

**Bağlam:** Astro mimarisine geçişle birlikte (KARAR 96), site içeriği Notion'dan canlı çekilecek. Bunun için Notion API'a programatik erişim gerekti — Internal Integration kuruldu.

**Kurulum (Mayıs 2026):**

- **Adı:** "Ocak Site" (Notion'da Connection olarak görünüyor — eski adıyla "Integration")
- **Workspace:** Ocak (single workspace, marketplace-eligible değil)
- **Authentication method:** Access token (workspace-scoped static API token, internal kullanım için)
- **Capabilities:** Read content + Update content (Update ileride kapatılabilir — Astro sadece okuma yapacak)
- **Owner:** Kaan (admin@ocak.biz)

**Connection eklenen database'ler:**

- **Sayfalar** (19 site sayfasının içerikleri + metadata). SSS section'ları sayfa body'sinde inline yaşar — `section: sss` bloğu, ayrı DB değil (KARAR 93)
- **Etkinlikler** (sonraki-bulusma section'ı dinamik bu DB'den okuyacak — KARAR 93)

**Token Saklama Politikası:**

- Token `ntn_...` formatında, ~50+ karakter, Kaan'ın yerel kayıtlarında ve Vercel environment variables'da yaşar
- **Asla Çekirdek/Arşiv'e yazılmaz** — bu dosyalar Project Knowledge'a yüklenir, kötü niyetli erişim riskine açık
- **Asla GitHub repo'sunda commit edilmez** — `.env` dosyası `.gitignore`'da, sadece Vercel'e environment variable olarak girilir
- Yeni sohbet açıldığında Kaan token'ı ilk mesaja yapıştırır, Claude o sohbet süresince kullanır
- Token rotation gerekirse Notion settings → integrations → token'ı yenile → Vercel env'i güncelle

**Mimari Sonuç:** Astro build process Notion API'a vurur (`@notionhq/client` veya benzeri), Sayfalar database'inden her sayfayı (frontmatter + page body) çeker, `notion-to-md` ile markdown'a dönüştürür, section etiketleri (KARAR 92, 93) custom remark plugin ile component'lere eşlenir. Webhook ile Notion → Vercel rebuild bağlantısı kurulabilir (lansman sonrası optimizasyon).

---

