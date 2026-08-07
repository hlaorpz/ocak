# OCAK — PROTOKOLLER (20-ref)

**Ne taşır:** kod, teşhis, merge, brief ve süreç disiplinleri. Kalıcı ilkeler.
**Ne taşımaz:** karar durumları (`01-kararlar.tsv`) · açık borçlar (`02-borclar.md`) ·
metin/marka disiplinleri (`20-ref-icerik-dili.md`) · Notion sözleşmeleri (`20-ref-notion.md`).

*Bu dosyanın gövdesi `ocak-pilot.md` v52'den **birebir** taşındı (ADIM 3, 6 Ağustos 2026). Hiçbir cümle kısaltılmadı, yeniden yazılmadı. Satır-satır köken izi: `docs/_arsiv/_bolme-haritasi.tsv`.*

---

**Çalışma sıralaması:** İçerik → Site → Altyapı.

**CANLI-BUILD TEŞHİS PROTOKOLÜ (KARAR 355, KALICI):** CC ADIM 0 teşhisi `ocak-site-icerik.md` dump'ına DEĞİL, `npm run build` sonrası GERÇEK `dist/` çıktısına dayanır. Gerekçe: dump insan-referansı, Kaan Notion'da değişiklik yapınca geride kalıyor (stale). #54 döneminde İKİ KEZ yanlış teşhise yol açtı (toplama "yapılmadı" sandı → yapılmıştı; gündönümü `<p>` sandı → `<ul><li>` idi). Build canlı Notion'dan çeker = gerçek. `ocak-site-icerik.md` referans olarak kullanılabilir ama teşhis dist'ten doğrulanır.

**CARD_SECTIONS ÇOK-ZİNCİR CHECKLIST (KARAR 361):** Yeni bir vitrin grubunu CARD_SECTIONS Set'ine eklemek TEK BAŞINA yetmez — grubun 8+ ayrı vitrin selector zincirine (container flex, kart hiza+şerit+zemin, @media ortalama, intro-boşluk, ritim ilk-p, altın ayraç, detay p, opsiyonel gold em) ayrı ayrı `[data-section="X"]` eklenmeli. Biri atlanınca o özellik baseline'a düşer. Yeni CARD_SECTIONS üyesi = tüm vitrin zincirlerini tara checklist'i. Tek Set satırı = yarım iş.

**GÜVENLİ MERGE PROTOKOLÜ (KARAR 388):** Production'a giden her merge: (1) kurtarma tag'i `git tag pre-merge-X main` → (2) `git merge --no-commit --no-ff` **dry-run** (conflict kontrolü; temiz değilse `--abort`) → (3) **PUSH'tan ÖNCE** local `npm run build` + `vitest run` (birleşmiş hali doğrula) → (4) yeşilse commit + push → (5) canlı göz-temiz + gerçek iPhone. Her adımda geri dönüş noktası; production'a ancak local yeşil + conflict yokken dokunulur. Uncommitted değişiklik kırılgandır — commit kaybı azaltır, artırmaz.

**PREVIEW TESTİ DÖRT-DEĞİŞKEN DOĞRULAMASI (KARAR 387):** Bir preview'de davranış test edilirken dördü açıkça doğrulanır: (1) **DAL** — kod gerçekten o dalda mı (tam URL kontrolü; ölü dal tuzağı: working dal main'in gerisinde kalırsa "ölü" görünür ve testte yanıltır); (2) **BUILD hedefi** — build tetiklendi mi ve hangi dalı build etti. *Deploy hook production'a bağlı DEĞİL ve dala bağlıdır* → preview testi için hook KULLANILMAZ, Vercel Redeploy ya da dala push ile tetiklenir; (3) **CACHE** — Cmd+Shift+R hard refresh; (4) **SAAT DİLİMİ** — TZ-duyarlı davranış TR 00:00–03:00 penceresinde test edilir, gündüz test bug'ı gizler. Ek: URL-hash'e bağlı client davranışların eyeball'ı hard-reload ile yapılır (KARAR 392).

**OVERFLOW KIRPMA STRATEJİSİ (KARAR 372, KARAR 187'nin kardeşi):** `overflow: hidden` görsel kırpar ama **layout extent'i (`scrollWidth`) korur**; `clip` extent'i siler. `body { overflow-x: hidden }` yatay taşmaya karşı **zoom-out koruması DEĞİLDİR** — sahte güvenlik ağıdır. Sabit-px dekoratif katmanlarda (hero glow gibi) kırpma **en dış kapsayıcıda ve `clip` ile** yapılır; `hidden` diğer ekseni `auto`'ya zorlar → scroll container yaratır → sticky nav + KARAR 293 scroll-anchoring riski. KARAR 187 (`min()` nokta-fix) tersine çevrilmez, yanına konur — **seçim kriteri: fix görsel niyeti bozuyor mu.** Ölçüm: yatay taşma metriği `documentElement.scrollWidth − documentElement.clientWidth` (`− innerWidth` mobil emülasyonda scroll extent döndürür, yalancı 0 verir); **emüle mobil metrik gerçek cihazı temsil etmez, gerçek cihazda doğrulanır.**

> **[D1 DÜZELTME — 6 Ağustos 2026, kod teyitli]** Yukarıdaki blok Pilot'ta "önerilen `overflow-x: clip` geçişi UYGULANMADI" beyanıyla birlikte yaşıyordu. **Beyan bayattı.** Gerçek: `src/styles/global.css:21` ve `:142` → `html, body { overflow-x: clip }` **canlıdır**; `overflow-x: hidden` yalnız `@supports not` fallback'i olarak `:152-154`'te durur. İlkenin kendisi (hidden extent'i korur, clip siler) değişmedi — yalnız uygulama durumu düzeltildi. Ledger satırı 372 zaten doğruydu.

**ORDER-DUYARLI SELEKTÖR DİSİPLİNİ (KARAR 375, KARAR 355 uzantısı):** `[class^="ocak-"]` gibi prefix-match selektörler class attribute **VALUE**'sunun baştan eşleşmesini ister (word-match değil). `ocak-` prefix'i **HER ZAMAN ilk class** olmalı; aksi halde baseline sessizce düşer ve hata görünmez. "Class'ı ekledim" yetmez — hesaplanan stilin `dist`'te fiilen uygulandığı teyit edilir. Ayrıca baseline selektörler section içindeki geniş elemanları **sessizce sıkıştırır**: child'ın kendi `max-width` beyanı yetmez, breakout deseni gerekir (KARAR 395).

**"BENZETME DEĞİL PAYLAŞIM" İLKESİ (KARAR 373):** İki ayrı kod yolunu (kopyayı) elle eşit tutmaya çalışmak sonsuz döngüdür — her fark kapanınca başkası açılır. Tek paylaşılan kaynak (ortak bileşen) farkı **matematiksel imkansız** kılar. KARAR 329 tek-gerçek ruhunun kabuk katmanına uzantısı. Ayrıca: aynı-sınıf iki yüzeyde tek yüzeye iyileştirme drift yaratır — dokunma hedefi gibi zorunluluklar iki yüzeye **aynı commit'te** girer (KARAR 395).

**BUILD-TIME TARİH KARARI TZ-SABİTLENİR (KARAR 385):** SSG build server UTC'dir. `new Date()` + `setHours` TR 00:00–03:00 penceresinde bir gün kayar. Tüm build-time tarih mantığı `Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Istanbul' })` + **leksikografik string-gün (YYYY-MM-DD)** karşılaştırmasıyla yazılır. Ortam/env/cron yamaları kök sebebi gizler, kabul edilmez. `"+3 saat ekle"` hardcode yasak — `Intl` DST-güvenlidir.

**CLIENT-SAFE ↔ SERVER-ONLY MODÜL SINIRI (KARAR 394):** Client `<script>`'in import ettiği modüller bağımlılık-temiz kalır; `astro:content` veya başka server-only API çeken fonksiyonlar ayrı `*-server.ts` dosyasında yaşar (`src/lib/etkinlik-server.ts` ilk örnek). Aksi halde Vite modülü client bundle'a çeker ve static analiz kırılır.

**"SAĞLAYICI ADI" KARARLARI ZİNCİRLENİR, SÜPERSELENMEZ (KARAR 364):** iyzico → PayTR → nötr banka sanal POS. Her yeni sağlayıcı geçişi önceki KARAR'ın **üstüne eklenir, silmez.** Aynı ilkeyle: Vercel team adı/slug değişse de Team ID + Project ID sabit kalır — **kanona ID yazılır, slug bayatlar** (KARAR 389).

**TEK GENİŞLİK GERÇEĞİ (KARAR 427, KALICI/yardımcı):** CTA ve kart section'larının genişliği `atmosfer.css:1538-1552` özel kolonundan gelir — dört section (`etkinlik-takvimi` + `sonraki-bulusma` + `kayit-btn` + `mini-cta`) mobilde `max-width:none; padding-inline:0`, desktop'ta `viewport/3`. **Yeni bir CTA/kart section eklenirse bu listeye ZORUNLU eklenir**; eklenmezse sessizce baseline prose (38rem) alır ve geniş çıkar. Gizli global kural = sessiz kırılma riski; `notes.md`'ye de işlendi.

**NOTION MARKER'I BİR SÖZLEŞMEDİR (KARAR 409):** Section marker adları serbest metin değil — `splitBodyByMarkers` fragment listesi veya plugin switch case'iyle eşleşen sözleşmedir. Marker adı değiştirilmeden/yeni ad icat edilmeden önce CC'ye tek satır teyit sorulur ("X marker'ı hangi kapıya düşüyor?"). İçerik katmanındaki adlandırma kararları kod katmanıyla **atomik** yürür. Fallback yollarına iz bırakılır (`<!-- kayit-cta-fallback -->`) — sessiz düşüş grep'le görünür olsun. *Gerekçe: `form-anchor` → `kayit-cta` yeniden adlandırması `KayitCTA.astro`'yu haftalarca hiçbir sayfada render etmez hale getirdi; buton görünmeye devam ettiği için fark edilmedi.*

**"KOD VAR" ≠ "OUTPUT VAR" (KARAR 408/409 ailesi):** Bir özelliğin durumu component dosyasındaki koda bakılarak verilmez — `dist`/build output grep'i şarttır. **Sessiz fakirleşme** en tehlikeli hata tipidir: site "bozulmaz", özellik sessizce düşer. Ayrıca brief uygulandıktan sonra `notes.md`'ye **brief adı + madde durumları + commit hash'leri** yazılır; aksi halde sonraki oturum aynı brief'i ikinci kez çalıştırır (bu fiilen yaşandı).

**LAYOUT/RİTİM İŞLERİNDE CHROME-CC BAĞLANTISI ADIM 0 ŞARTI (KARAR 419, KARAR 355 uzantısı):** `.liste`/layout/dikey-ritim dokunuşlarında CC önce Chrome bağlar ve ADIM 0'da **computed CSS'ten** konuşur; statik CSS analizi tek başına yeterli sayılmaz. *Gerekçe: `liste-ailesi` oturumunda statik analiz 5+ turda gerçek px ile çelişti (merdiven px'i, başlık ortalama, kapalı öğe yüksekliği, section-arası boşluk); her seferinde Kaan DevTools computed değeri verince kaynak kesinleşti.* Ek ders: **bir CSS fix "tutmuyorsa" ve semptom tuhafsa, önce DOM geçerliliğini sorgula** — `<summary>` içindeki geçersiz `<h3>` üç tur CSS'e direndi çünkü sorun stil değildi.

**İş bölüşümü (KARAR 100):** Claude.ai (bu) → strateji, içerik, Marka/Pilot/Arşiv, karar metinleri, marka çalışması. **Claude Code** → site kodu (#21'den itibaren varsayılan), repo'yu lokal görür, gerçek build/test, commit/push. **Cowork** → Notion CMS operasyonu, içerik girişi, durum güncellemeleri (beta — kritik akışta tek başına bırakma).

**Web sitesi protokolü (KARAR 52):** Her sayfa ayrı sohbette. Sohbet sonunda master dosyalar güncellenir.

**SIRA İLKESİ — DOKÜMAN KALİTESİ TESİSATTAN ÖNCE (KARAR 460, KALICI):** Claude.ai'nin sohbetler arası hafızası yoktur; **dokümanlar hafızasıdır.** Bu yüzden tavan doküman kalitesidir, taşıma mekanizması değil. Tesisat (repo, agent, script, MCP) iyi dokümanı *ucuzlatır*, kötü dokümanı *iyileştirmez*. Doküman işi tesisatsız yapılabiliyorsa tesisat beklenmez. *Vaka: doküman mimarisi önerisinin ilk sıralaması repo→agent→içerik idi; doğru sıra tersiydi ve düzeltildi.*

**KARAR LEDGER'I İNDEKSTİR, REFERANS DEĞİL (KARAR 456 eki):** `kararlar.tsv` bir kararın *durumunu* taşır, *gerekçesini* taşımaz. Gerekçe kronolojide yaşar; tsv oraya işaret eder (`kaynak` sütunu zorunlu, doğrulanamayan satır yazılmaz). tsv türetilmiş dosyadır — yanlışsa yeniden üretilir, kaynak veriye dokunulmaz; KIRPMA YASAĞI kronolojiye aittir. **Emin olunmayan durum tahmin edilmez, `TEYITSIZ` işaretlenir** — yanlış bir tsv satırı prose'daki bulanıklıktan daha tehlikelidir, çünkü otoriter görünür ve kimse arkasına bakmaz.

**TEK KLON DİSİPLİNİ (KARAR 463):** Bir repo, bir klon, bir aktif CC. İkinci CC penceresi ancak **ayrı repoda** meşrudur; aynı reponun iki klonu sessizce ayrışır ve hangisinin doğru olduğu ancak diverge push'unda anlaşılır. Doküman katmanı (`docs/`) ile kod katmanı (`src/`) aynı repoda yaşadığı için geçiş boyunca **birbirini bekler** — doküman brief'i çalışırken eşzamanlı kod brief'i verilmez. KARAR 150'nin (paralel CC seansı) klon ölçeğindeki kardeşidir.

**Ara brief kalıbı (KARAR 119 sohbet kazanımı):** Sohbet ortasında küçük scope + sistemik etki + mevcut brief'i bloketmeyen bir bulgu çıkarsa, ara brief tasarlanabilir (5 satırlık mini şablon: bağlam → fix kod blok → doğrulama → commit mesajı → brief sırasına göre yeri). Örnekler: Brief 0 manifesto bold hierarchy (sohbet ortası önerildi, brief'in başına eklendi), Brief F Notion internal link normalize (#26 başına alındı, Brief A push sonrası bulgu). Ara brief değildir: yeni component/yeni schema/belirsiz scope/mevcut brief mantığını değiştiren karar. Görsel sapma baseline ölçeğindeyse → ara brief muhtemelen. Sayfa-özel ise → brief içi TODO veya eyeball kuyruğu. Veri/içerik sapması → Notion'da Kaan'da iş, brief'e bile girmez.

**Üç-dallı merge brief deseni (KARAR 298):** Merge/geri-alması pahalı bir iş öncesi kapsam belirsizse (özellikle Pilot ifadesi ile CC salt-read'i çelişiyorsa), brief'i ADIM 0 doğrulamasının olası sonuçlarına göre önceden dallandır (A/B/C), riskli dala "DUR, raporla" guard'ı koy. CC ham çıktıyı (ör. `git log main..astro-iskelet`) görür görmez doğru dalı uygular, ekstra tur beklemez. **"reality overrides spec" (KARAR 102) Pilot'un kendisine de uygulanır** — Pilot bir varsayım taşıyabilir; ham kanıt üstündür.

**"Doğru tarafı ölç" teşhis dersi (KARAR 292):** "test-yeşili ≠ göz-temiz" (KARAR mevcut) + bir görsel boşluk/kayma fix'inde ölçülen tarafın doğru taraf olduğunu teyit et. Dört-tur eşik boşluğunda üç tur ALT taraf ölçüldü (test geçti, eyeball kirli); kök neden ÜST taraftaydı. Screenshot yönü (Kaan'ın Chrome görüntüsü) teşhisi düzeltti — piksel ölçümü kadar "nereye bakıyorum" da önemli.

**Specificity savaşı disiplini (KARAR 137, 138, 140):** CSS fix tutmadığında `grep` ile dosya okuma yetmez. Üç katmanlı keşif şart: (1) dist HTML'den gerçek DOM markup'ı (element tipi p mi h2 mi, class neyi taşıyor), (2) hangi CSS kuralları match ediyor + specificity hesabı, (3) hangisi yutuyor / hangisi hiç match etmiyor. Browser-level Computed kanıt yoksa CC için "grep + tahmin" başarısızlık zinciri yaratır. Brief G.2 → G.3 → G.4 retry zinciri bu disiplini olgunlaştırdı: G.4'te 4 retry hep "DOM kanıt + maksimum specificity + !important kabul" ile tek seferde çözüldü.

**Tanı disiplini rafinasyonu (KARAR 150, Brief L #34B pedagojisi):** Specificity savaşı disiplini bir adım daha derinleşti. **DOM ölçümü ≠ render pixel.** Görsel/tonal sızıntı şikayetlerinde DOM rect tek başına yetmez — kullanıcının gördüğü efekt ölçülmedi olabilir. Çoklu yöntem kanıt: DOM rect + viewport pixel sampling (CDP `Page.captureScreenshot` + `pngjs` decode + ImageData oku) + deneysel karşılaştırma (with/without elementini disable etme). **Replaced element sizing tuzağı:** Inline `<svg>` element'e geçişlerde HTML attribute `width="100%"` yetmez — tarayıcı replaced element default'unu (300×150px) uygular. CSS `selector svg { width:100%; height:100% }` zorunlu. Yarım yapılmış niyet pattern'i (Brief 4a refactor 11 gün önce). **Niyet sorgusu = commit gateway:** CC ilk fix önerisini kabul edip commit etmeden önce `git log` + KARAR referansı sorgu (2 dk iş) — niyet tam mı yarım mı netleştir. Kanıtlı tanı + niyet sorgusu birlikte commit'e geçit. **"Algısal damga" kategorisi:** Algı şikayeti en az iki ayrı kanıt yöntemiyle doğrulanmadan "algısal" diye kuyruğa atılmamalı (KARAR 130 statü güncellemesi — Brief G'de "algısal effect" diye kuyruğa atılan tepedeki band gerçek bug'dı, 11 gün canlıda kaldı). **Brief revizyon disiplini:** Aynı sohbette Brief 5 kez revize edildi (L#1→L#5) — history kaybı. Doğru pratik: yeni Brief açmak (Brief M, Brief N). Revize sebebi (kullanıcı tarifini yanlış yorumlama vs CC yanlış element teşhisi) ayrıştırılarak loglanmalı. **"Bölge n" numarası yerine konum referansı:** Kullanıcı tarifi numara ile gelirse iki taraf farklı eşleştirebilir; konum tarifi referanslı olmalı veya ekran üzerinde işaretle birlikte. **CC öneri eleme — kanıtlı öneri ≠ doğru kapı:** CC önerilerinin niyet uygunluğu ayrı geçit ("fix çalışır mı" + "doğru kapıyı çalıyor mu" + "kategori karıştırma yok mu"). **Üçlü Console tanı zinciri (KARAR 150 #34A GTM teyit pedagojisi):** Snippet emit (View Source `googletagmanager` ara) + network request (Network filter `gtm`) + dataLayer state (Console `typeof window.dataLayer`). Üç sıralı gözlemle "GTM çalışmıyor" soyut probleminin hangi katmanda kırıldığı 30 sn'de bölünür. Tahmin yerine eleme. **dataLayer.push override dinleyici pattern:** Smoke test'in görünmez katmanını canlı yapar — submit'lerde `console.log` ile push'u izleme. Tracking validation için repertuara girdi.

**!important lansman öncesi kabul (KARAR 138):** Lansmana <30 gün kala specificity refactor edilemez. `!important` + maksimum specificity selektör + `[class*=""]` defansları kabul edilir. Lansman sonrası "ilk hafta paketi"nde CSS refactor turu — !important temizliği + paragraf gap baseline + atmosfer.css yeniden organize.

**Vercel paralel iş paterni (KARAR 100 genişlemesi):** Vercel rate-limit veya redeploy beklerken (ortalama 1-15 dk) Claude.ai tarafı brief tasarımı yapar + CC tarafı bağımsız iş üretir (KVKK TR P1, qa-envanter, Tasarım Notları dump gibi). CC sıralı çalışır, paralel verilen iki brief sıraya girer. Çakışma riski varsa (örn. aynı dosyaya yazacak iki brief) sıralı verilir; yoksa kuyruğa atılır. Sohbet #31 17 commit zincirini bu paterne borçlu.

**Paralel CC seansı çakışma riski (KARAR 150 #34A pedagojisi):** İki CC seansı aynı lokal repo'da paralel çalışırsa: aynı git working tree, aynı `.git/index.lock`, push yarış riski. Pratik: küçük commit ise risk teorik (CC #1 farklı dosyalara dokunuyorsa). Murphy disiplini: CC #1 bitince CC #2'ye geç (sıralı). Paralel zorunlu ise brief'e ek satır: `commit'ten önce git pull --rebase origin astro-iskelet; conflict çıkarsa dur, manuel müdahale gerek`.

**Retry brief paterni (KARAR 137 + 138 + 140 sohbet kazanımı):** Tutmayan fix bir tur sonra retry brief'i açılır, üçüncü retry'a kadar tutmayan fix için **agresif yaklaşım** kabul: (1) dist HTML DOM markup keşfi (element tipi, class) zorunlu, (2) maksimum specificity selektör + `!important`, (3) lansman sonrası refactor not'u. Brief G.2 → G.3 → G.4 manifesto zinciri bu paterni olgunlaştırdı — üçüncü retry'da gerçek sebep çıktı (`<h2>`, p değil).

**Hard refresh disiplini (#30 pedagojik not 3, #31 tatbik):** Vercel preview eyeball pass'lerinde Cmd+Shift+R zorunlu. Browser cache stale CSS gösterebilir, özellikle atmosfer.css değişikliklerinden sonra. Hard refresh teyit edilmeden "fix tutmadı" denilmemeli.

**Geceyarısı disiplini (KARAR 150 #34B pedagojisi):** Saat 03:00'te Kaan "kapatalım bugünü" dedi (Brief K travmasından sonra), 24 saat sonra taze gözle netlik geldi (Brief L tarifi). Saat geç + sıkı sohbet + yanlış yön = dur, sabaha kal. KARAR olmadan da pratiğe geçmiş bir disiplin, ama açıkça notlanması faydalı.

**Hub-bazlı eyeball sınıflaması (KARAR ADAYI 308, #40 pedagojisi):** Büyük bir eyeball/bulgu listesi (ör. ~59 madde) geldiğinde tekil bulguları tek tek işleme — önce ortak **karar hub'ları** çıkar (H1-H8 gibi), her bulguyu bir hub'a bağla, hub'ları bağımlılık sırasına koy, sonra **dalgalar** halinde uygula (Dalga A-D = sayfa grupları). Böylece aynı sayfaya iki kez girilmez; çoğu bulgunun tekil iş değil, ortak karara bağımlı olduğu ortaya çıkar. Ritim: bulgular → hub'lar → tarama raporu → karar → dalga yazımı. Tek grep taraması birden çok kararı besleyebilir.

**Kanon/referans dosyası kavramı (KARAR ADAYI 299, #40):** Bazı derin içerik çalışmaları (ör. kaynak kanonu) master üçlüsüne (marka/pilot/arşiv) sığmaz — karar metni + derin içerik + yayılma haritası tek ayrı dosyada yaşar (`ocak-kaynak-kanonu.md`). Bu bir master dosya DEĞİL; Project Knowledge'a eklenir, dalga yazımlarının ve müfredat üretiminin ana kaynağıdır. **Canon ownership:** içeriği master dosyalara kopyalanmaz — tek ev sahibi bu dosyadır, master dosyalar ona referans verir.

**ENUM RENAME BRİEFİ KALIBI (KARAR 430 dersi):** Mevcut bir enum değerinin **anlamını** değiştirirken o değere bağlı TÜM kod yolları (`SLUG_KATEGORI`, `KATEGORI_ADI`, `KATEGORI_EN_YAKIN`, `formAnchor`, `KATEGORI_HEADING`) tek commit'te taranır. Yeni bir enum/format önerilmeden önce CC'ye **"bu değer zaten kullanımda mı?"** teşhisi yaptırılır. *Vaka: `Format: Yolculuk` enum'u zaten Anadolu'ya bağlıydı; ADIM 0 olmasa Anadolu etkinlikleri online kayıt akışına düşecekti.*

- **Acil rollback protokolü (KARAR 149):** Bug çıkarsa zincir hız sırasıyla:
  - **Vercel deployment rollback** → Vercel UI → Deployments → son sağlam deployment → ⋮ menü → "Promote to Production", ~10-30 sn (en hızlı).
  - **Notion içerik bug'ı** → Notion düzelt + "Yayınla" checkbox işaretle → Vercel automation tetikler → ~2-3 dk canlı.
  - **Kod bug'ı (CC)** → CC fix + commit + push astro-iskelet → Vercel auto-rebuild → ~3-5 dk canlı.
  - **Apps Script bug'ı** → Google Workspace editor → Edit (pencil) → New version → Deploy (KARAR 116 disiplini), ~3-5 dk.
  - **Hızlı arka arkaya commit/Notion edit** sıralama bozar (yarış kuyrukta) — birincinin Vercel'de READY olmasını bekle, sonra ikinciyi tetikle.
- **Vercel CLI deploy disiplini (ÇÖZÜLDÜ #35, KARAR 192-193):** `--prod=false` syntax CLI'da yok (boolean flag `=false` kabul etmez); "tuzak" framing'i yanlıştı, `--skip-domain` flag eksikti. **Yeni standart:** `vercel --prod --skip-domain` (staged) → teyit → `vercel promote <url>` (rebuild yok). Komut tablosu + 3 state Arşiv'de (KARAR 192). **Git akışı:** main=production (push otomatik canlı), astro-iskelet=preview tamponu, manuel Promote döngüsü kaldırıldı (KARAR 193). Acil rollback yine Vercel UI → Deployments → Promote.
- **Vercel env değişkenleri disiplini:** `PUBLIC_` prefix'li env'ler (GTM ID, Pixel ID, GA4 ID) **sensitive işaretlenmez** — public, HTML'de zaten görünür. `NOTION_TOKEN`, `NOTION_*_DB_ID`, MailerLite API key, Apps Script secret'lar **sensitive işaretlenir** — server-side, sızdırılmamalı. CLI'dan tanı: `vercel env ls` (tablo + environments), `vercel env pull .env.X --environment=X` (lokal dosyaya çek), `vercel env add NAME envname` (terminalden ekle).

- **KARAR 150 tanı disiplinleri paketi (#34 birleşik pedagojisi):** 9 alt-madde — (1) DOM ölçümü ≠ render pixel, pixel sampling şart, (2) replaced element sizing tuzağı inline SVG'lerde CSS sizing zorunlu, (3) niyet sorgusu = commit gateway, (4) brief revizyon disiplini yeni Brief açmak, (5) "bölge n" yerine konum referansı, (6) CC öneri eleme — kanıtlı öneri ≠ doğru kapı, (7) "algısal damga" en az iki kanıt yöntemiyle doğrulanmadan kullanılmamalı, (8) üçlü Console tanı zinciri (snippet emit + network + dataLayer state) — GTM dışı tracking + iframe + 3rd party script bug'larında genel pattern, (9) dataLayer.push override dinleyici pattern — smoke test'in görünmez katmanı. Detay: ÇALIŞMA PROTOKOLLERİ > "Tanı disiplini rafinasyonu" + Arşiv KARAR 150.

- **KARAR 130 statü güncellemesi (#34B sonrası):** "Tepedeki navigator altındaki taşan renk" Brief G'de "algısal effect" diye kuyruğa atılmıştı. Brief L pixel kanıtı çürüttü — gerçek bug'dı (GrainOverlay SVG sizing), 11 gün canlıda kaldı, commit `1332a37` ile çözüldü. "Algısal" kategorisi disiplin olarak revize edildi (KARAR 150 ruhu).

---

*Aşağıdaki gövde `ocak-referans.md` v46'dan **birebir** taşındı (B32, 7 Ağustos 2026).
Hiçbir cümle kısaltılmadı, yeniden yazılmadı. Satır-satır köken izi:
`docs/_arsiv/_bolme-haritasi-referans.tsv`.*

---

## A.23 — ÇALIŞMA PROTOKOLLERİ

**Kritik kural — KIRPILMAZ:** Patch modu **sadeleştirme veya kırpma yapmaz.** Sadece ekleme veya değiştirme yapar. v11 → v12 → v13 geçişlerinde yapılan operasyonel detay sadeleştirme bir hataydı — master prompt **operasyonel hafıza**, kırpılırsa anlamını yitiriyor. 12 aylık çember tablosu, 20+ araç listesi, 9 eşik detayı, KÖZ 6 katman, çember akış 6 bölüm — bunlar ileride sayfa içeriği yazılırken temel referans. Bunlar kırpılmaz.

### Brief Yapıştırma Disiplini (KARAR 103)

**Tarih:** 22 Mayıs 2026 — Sohbet #19.

**Sorun:** Claude.ai sohbetinden Claude Code'a uzun brief'ler yapıştırıldığında, terminal/input alanı bazen uzun input'u kırpıyor. Sohbet #19'da Brief 2 (~5K karakter atmosfer diff tablosu) yapıştırıldığında bir bölümü Claude Code'a ulaşmadı — Claude Code envanter aşamasındaki sapma sorularını tekrar etmeye başladı, brief'in tablo bölümünü hiç görmedi. Erken yakalandı, Esc ile temizlendi, brief parçalı verildi.

**Üç güvenli yöntem:**

1. **Parçalı yapıştırma:** Brief "Parça N/M" formatında bölümlere ayrılır, her parça ayrı yapıştırılır. Aralarda Claude Code'un "anladım, devamını bekliyorum" gibi onayı alınır. Sohbet #19'da Brief 2 ve Brief 3 bu yöntemle gönderildi.

2. **Dosya yöntemi (önerilen büyük brief'ler için):** Brief metni `~/Desktop/brief-XXX.md` dosyasına kaydedilir (TextEdit → Format → Make Plain Text → Cmd+S, encoding UTF-8). Claude Code'a "~/Desktop/brief-XXX.md dosyasını oku ve içindeki talimatları uygula" denir. Kırpma sıfır.

3. **Terminal heredoc:** `cat > ~/Desktop/brief.md << 'EOF'` → yapıştır → `EOF`. Tek hamlede dosya yazımı.

**Claude Code input klavye kuralları:**
- **Enter** → mesajı gönderir
- **Shift+Enter** → yeni satır ekler (multi-line input)
- **Esc** → açık seçenekli prompt'u iptal eder
- **Cmd+A + Delete** → tüm input'u temizler
- **Ctrl+C** → session'ı kırar (yeniden `claude` ile başlatılır)

**Disiplin:** Astro sohbet dizisinin geri kalanında (#22-26 ve #21'in ikinci yarısı) Claude.ai default olarak parçalı veya dosya yöntemini önerir. Tek seferde yapıştırma sadece ~1K karakterin altındaki brief'ler için. Uzun brief = dosya. Bu disiplin sürpriz "input kırpıldı" hatasını ortadan kaldırır.

### İleri İş Bırakma Yasağı (KARAR 104)

**Tarih:** 22 Mayıs 2026 — Sohbet #19.

**Sorun:** Brief 3a'da iki gözlem ileriye bırakılma riski taşıyordu: (1) npm cache izin sorunu — her install'da `--cache /tmp/...` workaround'u, (2) npm audit 9 zafiyet — "ileride bakarız." Kaan yakaladı: "İleriye genelde iş bırakmayalım, çözümleri 10-15 dk sürecekse. İleride sürpriz çıksın istemiyorum."

**Karar:** 10-15 dk içinde çözülebilecek konular sonraya bırakılmaz. Eğer Claude bir çözümü "ileri için" not düşmek istiyorsa, önce şu soruyu sormalı: **kısa süreli mi (≤15 dk) yoksa gerçekten kapsamlı bir tur mu (≥1 saat)?**

**İki kategori:**

| Kategori | Tanım | Örnek (Sohbet #19) |
|---|---|---|
| **Bilinçli erteleme** | Takvimli, ayrı bir sohbete/aşamaya planlı | Brief 4 (5 Astro component) → bir sonraki sohbet. Notion canlı binding → #22. GTM/Pixel → #26. |
| **Sürprize bırakma** | "İleride bakarız" denilip unutma riski | npm audit, npm cache izin, `@astrojs/check` yanlış dependency kümesi |

İlk kategori takvimde yer alıyor — sürpriz değil. İkinci kategori şimdi bitirilir.

**Sohbet #19'da uygulandı (Brief 3c + 3c-3):**
- npm cache: `sudo chown -R kaan:staff ~/.npm` — kalıcı çözüm, workaround bitti
- npm audit: tam inceleme yapıldı (kaynaklar, runtime etkisi, `--force` breaking analizi), karar "lansman sonrasına ertelendi" olarak dokümante edildi (`.claude/notes.md` "Bilinen Sorunlar"), gerekçe netleştirildi (dev tooling + SSG runtime etkisi yok + Astro 5→6 framework upgrade 1 ay kala tehlikeli)
- `@astrojs/check` → devDependencies'e taşındı (tek satırlık hijyen iyileştirmesi)

**Disiplin:** Her brief sonunda Claude kendine sorar: "Yarıda kalan bir şey var mı? Varsa: takvimli erteleme mi, sürprize bırakma mı?" Eğer ikincisi ise hemen bitirilir.

**Patch protokolü:** Tam dosya yazılmaz. **KIRPMA YAPILMAZ** — sadece ekleme ve değiştirme.

---

### 12–20 Temmuz 2026 eklemesi — Metodoloji (KARAR 407-409, 419)

**Notion marker'ı bir sözleşmedir (KARAR 409).** Section marker adları serbest metin değil — `splitBodyByMarkers` fragment listesi veya plugin switch case'iyle eşleşen **sözleşmedir**. Marker adı değiştirilmeden ya da yeni ad icat edilmeden önce CC'ye tek satır teyit sorulur ("X marker'ı hangi kapıya düşüyor?"). İçerik katmanındaki adlandırma kararları kod katmanıyla **atomik** yürür (KARAR 102 ailesinin genişlemesi). Fallback yollarına iz bırakılır (`<!-- kayit-cta-fallback -->`) — sessiz düşüş grep'le görünür olsun. *Vaka: `form-anchor` → `kayit-cta` yeniden adlandırması `KayitCTA.astro`'yu hiçbir sayfada render etmez hale getirdi; buton görünmeye devam ettiği için haftalarca fark edilmedi. **Sessiz fakirleşme en tehlikeli hata tipidir** — site "bozulmaz", özellik sessizce düşer.*

**"Kod var" ≠ "output var" (KARAR 408).** Bir özelliğin durumu component dosyasındaki koda bakılarak verilmez; `dist`/build output grep'i şarttır. İlk ADIM 0 raporu Madde 2/4'ü "uygulanmış" saydı çünkü dosyada kod vardı — build output'unda hiç yoktu. Ayrıca **brief uygulandıktan sonra `notes.md`'ye brief adı + madde durumları + commit hash'leri yazılır**; aksi halde sonraki oturum aynı brief'i ikinci kez çalıştırır (fiilen yaşandı: ADIM 0 raporu Madde 1-6'nın zaten kodda olduğunu ortaya çıkardı, salt-read olmasa altı madde ikinci kez yamanacaktı).

**Layout/ritim işlerinde Chrome-CC bağlantısı ADIM 0 şartı (KARAR 419, KARAR 355 uzantısı).** `.liste`/layout/dikey-ritim dokunuşlarında CC önce Chrome bağlar ve ADIM 0'da **computed CSS'ten** konuşur; statik CSS analizi tek başına yeterli sayılmaz. *Gerekçe: `liste-ailesi` oturumunda statik analiz 5+ turda gerçek px ile çelişti (merdiven px'i, başlık ortalama, kapalı öğe yüksekliği, section-arası boşluk, tek-seferlik ritmi); her seferinde Kaan DevTools computed değeri verince kaynak kesinleşti.* Bağlı ders: **bir CSS fix "tutmuyorsa" ve semptom tuhafsa, önce DOM geçerliliğini sorgula** — geçersiz markup, CSS ile kovalanan bir bug'ın gerçek kökü olabilir (KARAR 416 vakası).

**CSS tanısında iç içe düğüm (KARAR 407).** `<p><del><em>…</em></del></p>` gibi yapılarda genel `em` kuralı dış rengi ezer; standalone-yükseltme seçicisi (`p:has(> em:only-child)`) fire etmez. Çözüm hardcode token değil **`color: inherit`** — kural "del içindeki vurgu del'in rengini bozamaz" evrenselliğini taşır ve spesifiklik hesabıyla (0,2,2 > 0,2,1) genel kuralı yener. Ayrıca: **CSS tanısında hipotezi erken sabitleme** — ilk hipotez standalone-yükseltme seçicisiydi, gerçek ezici genel `em` kuralı çıktı; brief "amaç"la yazıldığı için (harfle değil) CC doğru çözüme sapabildi.

**Grep'te çekim varyantı tuzağı.** Türkçe'de kök + çekim varyantlarıyla aramak zorunludur: "külledi" araması "küllemiş"i kaçırdı ve bir maddeyi yanlışlıkla "çözülmüş" raporlattı.

**Salt-read her maddede, listenin başında değil.** Liste bazlı çalışmada (ör. inceleme listesi) her madde kendi teyidini ister — liste eski dump'a göre yazılmış olabilir; maddelerin yarısı ya çözülmüş ya başka sayfaya taşınmış çıkabilir.

**Aynı-kaynak parse ile indeks hizası (KARAR 420 genellemesi).** Birbirine indeksle eşleşen iki dizi (soru ↔ açıklama) **aynı** fonksiyondan beslenmelidir; "aynı görünen" ikinci bir fonksiyon drift üretir. Jenerik + alias deseni.

**"Yeterince iyi" bir launch kararıdır.** Piksel-doğru ≠ göz-temiz, ve göz-temiz bile her zaman launch şartı değildir. /atolye ritim ince-ayarı 6-7 tur px kovaladıktan sonra "yeter" denip backlog'a alındı, merge bloklanmadı.

**Kök-neden fix yan etki yayar.** Baseline padding sızıntısı fix'i statik `article`'lara da dokundu (başlıklar center→left); "iyi" denen sayfalar yeniden bakılmak zorunda kaldı. Kök fix'te göz turu **dokunulan tüm yüzeyleri** kapsamalı.

**İçerik tutarsızlığı CSS ile bastırılmaz (KARAR 354 tatbiki).** Bullet sorununun kaynağı Notion'da 3 kart `ul/li`, 2 kart `p` tutarsızlığıydı; `content: none !important` yerine Notion içeriği düzeltildi — kök çözüm, `!important` borcu yok.

**CC push-unutma nüksü.** Commit ≠ deploy. "Push edildi" ayrı teyit gerektirir; brief içi hatırlatma yetmeyebilir (ikinci brief'e madde eklenmesine rağmen tekrar oldu). Nihai teyit: Vercel'de commit görünürlüğü.

**Brief evrimi: parça-parça delta → tek-kaynak temiz brief.** Paralel session'da birikmiş onay+delta parçaları karışıklık yaratır; tek konsolide brief daha güvenlidir. Ayrıca onaylı görsel kararını brief'e **kod olarak gömmek** (mock'un HTML/CSS'i) "onayladığım bu muydu" tartışmasını sıfırlar; belirsiz noktalar ADIM 0'da cevaplanacak **açık soru** olarak yazılır (CC sessizce seçim yapmasın).

