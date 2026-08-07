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

Tam mimari + database property listeleri + view yapıları: Arşiv KARAR 56-60, 73-77, 96, 97, 125.

- **Notion içerik yazım disiplini (KARAR 118):** Kaan Notion'da içerik yazarken hiç markdown delim karakteri (`*` `_` `**` `__`) yazmaz. Tüm vurguyu Cmd+B / Cmd+I annotation ile yapar. Detay: `notion-yazim-rehberi.md` yan belge. Plugin KARAR 108 7 kural ile eski yapıştırılan literal artıkları temizler — rehber yeni içerik için disiplindir, defansif değildir.

- **Notion içerik yazım rehberi (KARAR 125 sonrası güncel):** `notion-icerik-yazim-rehberi.md` Project Knowledge'a yan dosya olarak yüklü, 13 bölümlü kapsamlı rehber — markdown delim disiplini + section etiketleri + 5 kanonik + hero/bir-sonraki/sıradaki-kapı/sss/form-anchor detayları + link disiplini + cleanup checklist + sık hatalar. Repo'daki `docs/sayfa-yazim-rehberi.md` (KARAR 111) kısa kod sözleşmesi tarafı; Notion rehberi onun detaylı operasyonel uzantısı.
- **Sayfa içi Notion linkler (KARAR 119 + 120):** Notion'da inline link / page mention kullanılırsa dist'e `https://www.notion.so/<slug>` olarak düşer. KARAR 119'da 4 sayfada 21+ link tespit edildi. KARAR 120 (Brief F) plugin defansif normalize ekledi — 18 sayfa slug whitelist'i ile internal `/<slug>`'a çevirir (11 direct slug normalize), whitelist dışı external link'ler + nested path'ler + hash fragment'ler korunur + warn. Yeni içerik girişlerinde internal sayfa referansları doğrudan slash URL yazılırsa (`/cember`) defansa gerek kalmaz. Kalan 12 link (hash fragment + nested kayit/basvuru + 7 diğer) içerik-bağımlı, lansman sonrası Notion-side cleanup.

- **Notion property whitelist mantığı (KARAR 150 #34A pedagojisi):** `src/lib/notion-pages.ts` loader sadece bildiği property'leri okur (`Sayfa Başlığı`, `URL`, `Meta Açıklama`, `Durum`, `Yayınla`, `OG Görsel`). Bilmediği property'yi görmezden gelir. Notion'a yeni kolon eklemek (örn. "Oda", "Notlar", "Status") build'i etkilemez. Mevcut property isimleri **değiştirilemez** (Zod schema patlar). Yeni sayfa eklenirse ODA_MAP'e ekleme disiplini (KARAR 87, kod tarafı slug→oda map'i `src/lib/oda-map.ts`).
