# OCAK — DURUM

**Son güncelleme:** 8 Ekim 2026 · **Site dili + Anadolu takvimi turu** · dönem HEAD `886a5bf`

---

> **200 SATIR HARD CAP (KARAR 457).** Aşarsa en eski dönem bloğu `90-kronoloji/`'ye iner.
> İçerik **silinmez, taşınır** (KIRPMA YASAĞI, KARAR 61). Bu dosya karar durumlarını ve
> borçları **tekrar etmez, işaret eder** — ikisi de kendi dosyasında yaşar.
>
> **Rakam burada yaşamaz** (KARAR 578). Bir komutun yeniden üretebildiği her sayı
> `04-olcum.md`'dedir; burada yalnız o sayıya bakan **yargı** durur. Başlık bölgesi
> `scripts/baslik-denetim.mjs` ile denetlenir: tarih · tur adı · dönem HEAD, başka bir şey değil.

| Ne arıyorsan | Nereye bak |
|---|---|
| **hangi dosya neyi taşır, çelişkide kim kazanır** | **`05-harita.md`** |
| **şu anki ölçüm** — canlı HEAD, çalışma ağacı, test, build, satır sayıları, borç sayısı, ledger bütünlüğü, Vercel kimliği | **`04-olcum.md`** — üretilen dosya; `scripts/durum-uret.mjs` yazar, elle düzenlenmez |
| bir kararın durumu / halefi | `01-kararlar.tsv` |
| bir kararın **gerekçesi** | `90-kronoloji/YYYY-AA.md` — aylık dilim, tam tarihçe (tsv'nin `kaynak` sütunu işaret eder) |
| açık borç, sahip, tetikleyici | `02-borclar.md` |
| sıradaki iş, kim, nasıl açılır | `03-sira.md` |
| marka çekirdeği | `10-marka.md` |
| marka tam metni, kurucu, ekip, görsel kimlik, yayılım | `20-ref-marka.md` |
| ekosistem katmanları, format kanonları, araç kutusu, ürün takvimi | `20-ref-program.md` |
| sayfa mimarisi, stack, CTA, tracking | `20-ref-site.md` |
| kod/teşhis/merge/brief disiplinleri | `20-ref-protokoller.md` |
| metin, vurgu, dil, teslim standartları | `20-ref-icerik-dili.md` |
| Notion DB, schema, yazım sözleşmesi | `20-ref-notion.md` |
| bot, n8n, WhatsApp, Meta | `20-ref-bot.md` |
| sosyal medya ilk 30 gün — kart kart uygulama | `30-sosyal.md` |

---

## ŞU AN NEREDEYİZ

**Doküman mimarisi geçişi — ADIM 7 birinci dalgası bitti.** Tesisat kuruldu: `CLAUDE.md`
repo kökünde, `baglam.sh` beş profille çalışıyor, project files boşaltıldı, `mcp/` sunucusu
Railway'de canlı. **Faz kapanmadı** — `docs_karar(no)` ve bağlantının kalıcı ucu ikinci dalgada.
Yol haritası: `2026-08-06-ocak-gecis-plani.md` — **sonundaki SAPMA KAYDI'nı ve EK'ini okumadan brief yazma** (gövde dokuz yerinden bayat; ilk altısı 7 Ağu kaydında, üçü 8 Ağu ekinde).

- **ADIM 1–7 (6–8 Ağu)** — doküman mimarisi geçişi, MCP dört araçlı. Tam kayıt
  `90-kronoloji/2026-08.md`'de (10 Eylül tahliyesi, KARAR 457/61). **Açık kalan
  canlı ayaklar:** B36-b (Claude.ai) · B53 bağlantı ucu düşürüldü, B51 ona bağlı ·
  `baglam.sh` **emekli edilmedi.**
- **Marka işareti ✅ (18–19 Ağu)** — logo + başlık kanonu (**KARAR 522 · 523**). Blok 24 Ağustos'ta kronolojiye **indi**; canlı ayağı **B105**: Instagram ✅ (avatar yüklendi, 11 Eyl) · WhatsApp ayağı **B197**'ye devredildi (Kanal düştü, KARAR 589) · **e-posta anteti hâlâ eski**.

- **Sayfalar metin turu ✅ (24 Ağu)** — on dört yüzeyde yirmi bir yazım, C listesinin beşi
  kapandı, **deploy aynı gün alındı.** Doktrin **558** (Seremoni + Çember'de kayıt yoktur,
  istisnasız — söz ile mekanizma çeliştiğinde **söz kazanır**) · **561** · **562** · **563**
  (mühürle birlikte denetim satırı; KARAR 86 üç ay denetimsiz yaşadı, **B80**) ·
  ölçüm doktrini **565** · **566** · **567**. Gerekçeler kronolojide.

**Otorite:** master dosyaların gerçek kopyası **repodadır** (`docs/`). Project files
kopyaları 6 Ağustos'tan sonra bayattır ve güncellenmez — `10-marka.md` tek istisna
(KARAR 455). O kopya **otorite değil aynadır**; repo değişince elle tazelenir, çelişkide
repo kazanır (KARAR 471). Bağlam iki kanaldan gelir: soğuk başlangıçta `baglam.sh`
yapıştırması, tur içinde MCP çekmesi. MCP **git deposunu** okur, yerel diski değil
(KARAR 479) — `.gitignore`'lu dosyalar oradan görünmez.

**Sohbet sonu artık patch'tir (KARAR 462):** tam yenileme yok. Tek `docs-patch-YYYY-AA-GG.md`
üretilir → CC uygular. `00-durum.md`'ye **hedefli** yazım, kronolojiye append.

---

## KOD / DEPLOY GERÇEĞİ

| | |
|---|---|
| `main` dönem HEAD | **`a56488d`** (8 Eki, Zoom host turu — bir önceki dönem `9767fee`) — canlı HEAD değil, dönemin son commit'i · kapanış commit'inden bir önceki (KARAR 474). **Canlı HEAD üretilendir** → `docs/04-olcum.md` (KARAR 580). ⚠ **Bu dönem KOD içerdi:** `a56488d` (`src/lib/zoom.ts` — meeting host'u env'den; `src/lib/zoom.test.ts` yeni). Arada iki doküman commit'i: `5d6d83f` · `f2bd9df`. Önceki dönemin (`9767fee`) satırı `90-kronoloji/2026-10.md`'ye indi (KARAR 61) |
| Dal modeli | **`main` tek çalışma + production dalıdır** (push otomatik canlı). Yanında yaşayan tek uzak dal **`nkolay-test`** — ödeme Preview ortamı; `ODEME_CALLBACK_SIR`'ı production'dan **ayrıdır** (KARAR 575), bu yüzden AÇILIŞ'a kadar **bilerek duruyor** ve o şart `03-sira.md`'ye yazıldı. ⚠ `astro-iskelet` · `davet-mail-baglam` · `etkinlik-kayit-penceresi` · `liste-ailesi` **silindi** (11 Eyl): her biri için `git log main..origin/<dal>` **boş** döndü — main'de olmayan tek bir commit taşımıyorlardı. `kurtarma-2026-08-19` tag'i de kalktı (`688bee5`, `merge-base --is-ancestor` ile main'in atası olduğu doğrulandı). Yeni çivi: `kurtarma-2026-09-11-b64-dal-temizligi` (yerel). Dal sayısı **buraya yazılmaz** → `docs/04-olcum.md` |
| Çalışma dizini | **`~/Desktop/hlaorpz/ocak`** · remote `hlaorpz/ocak` (B01, 10 Ağu) — tek klon (KARAR 463) |
| Test | → `docs/04-olcum.md` (`--test` ayağı). ⚠ Test dosyası **`src/lib/` ya da `src/components/` altında yaşar** — `src/pages/` altına konursa Astro onu route olarak derler, **build düşer, vitest yeşil kalır** (KARAR 574) |
| Build | → `docs/04-olcum.md` (`--build` ayağı). ⚠ **Tek sayıya inmez** ve sayım **yöntemine bağlıdır**; Pilot'un "33"ü hiçbirine denk gelmiyordu (D7 kapandı). Yöntem artık betikte tanımlı — elle tutulan eski sayım (*32 prerender + 10 SSR*) yönlendirme takma adlarını dışarıda bırakıyordu, betiğinki bırakmıyor. API route sayısı iki yöntemde de aynı |
| robots.txt | ✅ **`Allow: /` (1 Eki, `520e5fe`, KARAR 599).** `Disallow: /odeme/` · `Disallow: /api/` · `Sitemap: https://www.ocak.biz/sitemap-index.xml`. Ödeme route'ları sitemap'ten de çıktı (`d203581`) — canlı `sitemap-0.xml` **49 → 45 `<loc>`**, `/odeme/` **0** (yöntem: `curl -s …/sitemap-0.xml \| grep -o '<loc>' \| wc -l`, CC 1 Eki). ✅ **Duyuru ayağı da aynı gün düştü** (Kaan bildirdi, 1 Eki; kanal kaydedilmedi — kapalı yüzey, CC doğrulamaya çalışmaz) → KARAR 149'un iki ayağı tamam, **lansman yapıldı.** *Önceki hâl:* `Disallow: /` — stealth, 27 May (KARAR 147) → 1 Eki |
| Kanonik adres | **`www.ocak.biz`** (`688bee5`) — köksüz `ocak.biz` 307 ile www'ye döner |
| Arama görünürlüğü | ✅ **Search Console Domain property doğrulandı (7 Eki).** `google-site-verification` TXT apex'e eklendi (`rec_186f0094562f933e63948d09`, takım `hlaorpz`); `dig +short TXT ocak.biz` dört satır döndü. Instagram `@ocak.biz` platform bağı kuruldu. ⚠ **Lansmandan (1 Eki) altı gün sonra indekslenen sayfa: 0.** Sitemap üç kez gönderildi (3 Eki · 7 Eki ×2), üçünde de `Couldn't fetch` · `Last read` boş · 0 keşif → **B212**. Sunucu tarafı ölçüldü ve temiz: `sitemap-index.xml` 200 · `application/xml` · tek `<loc>` → `www`'li `sitemap-0.xml`; o da **45 `<loc>`**, `site-rehber` **0**, `test` **0** (yöntem: `curl -sL …/sitemap-0.xml \| grep -o '<loc>[^<]*</loc>'`, Kaan 7 Eki). Googlebot UA ile `sitemap-0.xml` **200** — bot'a özel engel yok. ✅ **LIVE TEST (7 Eki 01:51): `URL is available to Google` · `Page can be indexed`** — Googlebot canlıda `www.ocak.biz`'i çekebiliyor, indekslemenin önünde engel yok. Panelin `Crawl allowed? No: blocked by robots.txt` satırı **bayattır**: `Last crawl 25 Eyl`, robots Allow'dan **altı gün önce** — live test onu çürüttü. Ana sayfa `REQUEST INDEXING` ile öncelikli tarama kuyruğunda. Bu satır **yazılandır** — kaynağı CC'ye kapalı yüzey (Google Search Console, Kaan), hiçbir komut üretemez; *doğrulamaya çalışma* |
| Deploy hook | ✅ **B64 KAPANDI (11 Eyl).** Gecelik tazeleme ve Notion içerik güncellemesi artık **production'a basıyor.** n8n *"OCAK Gecelik Rebuild"* ve Notion Sayfalar DB automation'ı aynı yeni hook'u çağırıyor: `notion-content-update-main` (`x2LnNpVvuG`, ref `main`). Elle tetiklemede deployment READY oldu — `githubCommitRef: main` · `target: production` · alias listesinde `www.ocak.biz`; `/hikaye` Yayınla uncheck→check testi de production build doğurdu (`deployHookName: notion-content-update-main`). Eski `tZR9LcwJq9` **revoke edildi.** ⚠ Mayıs'tan beri açık duran *"Notion automation bozuk"* teşhisi de burada kapandı: automation bozuk **değildi**, ölü hook'a basıyordu. Bu satır **yazılandır** — kaynağı CC'ye kapalı yüzey (Kaan + Claude.ai Vercel MCP, 11 Eyl), hiçbir komut üretemez. Kapanmadan önceki ölçüm ve teşhis **silinmedi, taşındı** (KARAR 61): `02-borclar.md` B64 bloğu + `90-kronoloji/2026-09.md` |
| Vercel | Kimlik (team · project ID · proje adı) → `docs/04-olcum.md`. Dört domain ayağının dördü de `ocak-*` (**B58 ✅**, 11 Ağu). ✅ **B179 KAPANDI (11 Eyl) — düzeltmeyle değil, "kabul edildi" ile.** `rm -rf .vercel && vercel link --yes` koşuldu; CLI yine yalnız `repo.json` yazdı, `project.json` yazmadı — üç deneme aynı sonucu verdi. Sebep arıza değil: proje GitHub'a bağlı olduğu için CLI **repo seviyesinde** bağlıyor. `project.json`'a bağımlı tek yol `vercel --prod` ve o yol kullanılmıyor — deploy git push'la gidiyor. **KARAR 584** sapmayı doktrine çevirdi: kimlik `repo.json`'dan okunur, `project.json` aranmaz; `scripts/durum-uret.mjs` zaten öyle yapıyor ve hangi dosyadan okuduğunu yazıyor. ⚠ Bu, **"kabul edildi" sınıfının ilk vakasıdır** — bir borcun düzeltilmeden, sapması doktrine alınarak kapanması; kapanış yolu ledger'da henüz tanımlı değil (`03-sira.md`) |
| Ödeme | **İki yöntem yan yana — Production'da AÇIK.** N-Kolay sanal POS ile anlaşıldı (10 Eyl): kart geri geldi, havale/EFT kaldı. **KARAR 575** — denetim `www.ocak.biz` üzerinden mock sağlayıcıyla koşar (`KART_AKISI=acik` · `PAYMENT_PROVIDER=mock`); Preview (`nkolay-test`) aynı yapılandırmada, **iki ortamın `ODEME_CALLBACK_SIR`'ı ayrıdır.** ✅ **Ölçüldü (11 Eyl, redeploy sonrası):** yöntem grubu iki seçenekle basılıyor (kart varsayılan `checked`) · `/odeme/{mock,tamam,iptal}` üçü de **200** · sitemap 48 → **51 `<loc>`**, üç ödeme route'u girdi · `robots` hâlâ `Disallow: /` · dört yasal+kayıt yüzeyinde sağlayıcı adı **sıfır**. ✅ **Sağlayıcı yazıldı (11 Eyl).** `payment-provider.ts`'te `nkolay` dalı — Ortak Ödeme Sayfası form POST'u (`/odeme/nkolay`, `prerender=false`, `KART_AKISI` kapalıyken 404), **iki ayrı hash** (istek: `sx|clientRefCode|amount|successUrl|failUrl|rnd|customerKey|secret` · dönüş: `MERCHANT_NO|REFERENCE_CODE|AUTH_CODE|RESPONSE_CODE|USE_3D|RND|INSTALLMENT|AUTHORIZATION_AMOUNT|CURRENCY_CODE|secret`), SHA-512 → base64, sabit zamanlı karşılaştırma. `iyzico` dalı kaldırıldı (**B186 ✅**). ✅ **HAT AÇILDI (6 Eki).** `PAYMENT_PROVIDER=nkolay` canlı; uçtan uca gerçek bir kart işlemi geçti — `/odeme/tamam` açıldı, Zoom linki + şifre basıldı, Notion `İşlem No` **ilk kez doldu** (`IKSIRPF343742231`). Kimlik zinciri: dönüşteki hash kapsamlı `REFERENCE_CODE` → `PaymentList` → `CLIENT_REFERENCE_CODE` → `soyEpochSoneki()` → `Kayıt ID` (**KARAR 601**). `CLIENT_REFERENCE_CODE` kimlik çözümünde **okunmaz** — hash dışıdır (593 korundu). ⚠ **İptal/iade servisi hâlâ yok** — panelden elle, **B200** kısmi. ✅ **B193 KAPANDI (7 Eki)** — `/odeme/mock` `PAYMENT_PROVIDER≠mock` iken **404** (`4f38887` · `53420c3`, **KARAR 605**). ⚠ Anahtar kapalıyken yöntem radio grubu SSR'da hiç basılmaz — KARAR 488'in tasarımıdır, arıza değil |
| Referans kodu | **`OCAK-` + 4 karakter**, 29'luk alfabe (`Z` yok — yanlış okunursa geçerli kod üretir; `L` var — `1` alfabede yok, hata gürültülü çıkar). Uzay 29⁴ = 707.281. Notion'da 5 ve 6 haneli eski rakamsal kodlar da yaşıyor, **migration yok** |
| Ödeme bildirimi | ✅ **B211 KAPANDI (7–8 Eki).** Kayıt ve ödeme mailleri **koddan, Resend şablonlarıyla** gider (`selam@mail.ocak.biz`, yanıt `selam@ocak.biz`) — **KARAR 606**. Altı şablon Resend panelinde yayında (`yerini-tutuyoruz` · `yerin-hala-bizde` · `yerin-hazir-online` · `yerin-hazir-yuzyuze` · `gun-hatirlatma-online` · `gun-hatirlatma-yuzyuze`); metin ve görünüm orada yaşar, kod yalnız şablon adı + değişken kümesini bilir. Kart: callback `odemeBildir`'i çağırır → anında "yerin hazır". Süre sayan her şey `POST /api/bildirim-tara`'da; n8n `OCAK — bildirim tarama` (panel.ocak.biz) 5 dakikada bir çağırır — başlık `x-ocak-tarama` = `TARAMA_SIR`, sır sorgu dizesinde reddedilir, `?kuru=1` hiçbir şey yazmaz. **401 dönerse ilk şüpheli `TARAMA_SIR` ↔ n8n credential `OCAK tarama` çiftidir** (7 Eki'de birlikte yazıldı). Yaşam döngüsü **607**, gün hatırlatması **608**, tek otorite **609**. Notion Kayıtlar: `Yer Tutma Bitişi` · `Hatırlatma Gitti` · `Gün Hatırlatması Gitti` · `İptal Nedeni` + `Ödeme Durumu: İptal` (Kaan, 7 Eki). `Yer Tutma Bitişi` boş eski kayıtlara tarama **dokunmaz**. Canlı uçtan uca test (7 Eki) dört senaryonun dördünü geçti → `90-kronoloji/2026-10.md` |
| MailerLite | **Yalnız Ateş Mektupları** (KARAR 606). Kayıt akışı MailerLite'a **yazmaz** (`796de47`). `OCAK — kayıt onayı (tüm formatlar)` otomasyonu **durduruldu, silinmedi** (Kaan, 7 Eki — kapalı yüzey). Bülten izni başarı ekranlarında tek dokunuş (**612**): `POST /api/mektup-katil` — istemci e-posta göndermez, sunucu Notion'dan okur; grup `api/form.ts:49`'daki Ateş Mektupları grubu. Eski on iki alanlık envanter `20-ref-bot.md`'de tarihçe (→ B220). ⚠ **Silinen abone yeniden eklenince eski kaydıyla döner** — aynı id, `sent` sayacı, grup üyelikleri (ölçüm: Claude.ai MailerLite connector, 7 Eki, `kaan@yap.com.tr`) |
| Callback güvenliği | `odeme-callback` 19 Ağu'dan 10 Eyl'e kadar **kimlik doğrulamasızdı**; adresi ve bir Notion sayfa UUID'sini bilen herkes bir kaydı Ödendi yapabilir, promo sayacını şişirebilirdi. `KART_AKISI` kapalı olduğu için sömürülemedi. Artık `dogrulaCallback()` **provider arayüzünde** (KARAR 395 uygulaması, `5a4c5bc`), **fail-closed** — sır tanımsızsa `401`, gövde Notion'a hiç taşınmadan. ✅ **11 Eyl'de kapı sayısı arttı:** kayıt kimliği **yalnız hash kapsamındaki alandan** çözülür (**KARAR 593**) · `İşlem No` dolu ise replay reddedilir · `Beklenen Tutar` boşsa ödeme **koşulsuz** reddedilir (**594**) · düşük tutar reddedilir, fazla tutar kabul edilir ve red **gerekçesiyle log'lanır** (**595**). Hiçbir red Notion'a dokunmadan döner. ✅ **6 Eki'de kimlik kapısı tamamlandı:** biçim kapısı artık `IKSIRPF` önekini **çivilemez** (`^[A-Za-z0-9._-]{6,64}$` — kapının işi "dolu ve taşınabilir mi", kimlik oradan türetilmiyor); kayıt `PaymentList` köprüsüyle çözülür ve köprü yalnız `SALES` + `STATUS=SUCCESS` satırını kabul eder (**KARAR 602**). `mutabakatSorgula()` arayüzde **opsiyonel**, çağrısı route'ta hash kapısından **sonra** — `dogrulaCallback()` senkron ve I/O'suz kalır, doğrulanmamış istek dış servis çağırtamaz |

---

## YAYINI KİLİTLEYENLER

Detay ve sahipler `02-borclar.md`'de. Burada yalnız kilit zinciri:

1. **B19 · B104 ✅ KAPANDI (11 Eyl)** — WhatsApp display name + `…0888` register. KARAR 518 SUPERSEDE → 585. Gövde `90-kronoloji/2026-10.md`'ye indi (7 Eki tahliyesi, KARAR 61).
2. **İade cümlesi ✅ ÇÖZÜLDÜ (10 Eyl, KARAR 576, `0b173ac`)** — `robots Allow` 1 Eki'de açıldı (KARAR 599). Hukukçuya kalan iki soru metne girmedi. Gövde `90-kronoloji/2026-10.md`'ye indi (7 Eki tahliyesi, KARAR 61).
3. **Sosyal v2 `[KAAN]` önkoşulları** — kurucu görsel **✅ mühürlendi** (23 Ağu, KARAR 542);
   `KURUCU-URL` ara-değiştir **✅ KAPANDI** (24 Ağu, **B139** · **B184**) — dokuz promptun dokuzunda gerçek `--sref`, `--v 8.1`, `--chaos 5`; `--sref KURUCU-URL` → **0**. ⚠ **Bu madde artık Gün 1'i kilitlemiyor**; kalan kilit V05–V09'un üretimde hiç sınanmamış olması (ilk parti kanarya).
4. **Yolculuk fiyat bandı → ilk Yolculuk etkinliği.** Eylül kohortu duyurusunun önkoşulu. ⚠ **8 Eki:** "Eylül kohortu" artık **Eylül 2027** (KARAR 617); online Yolculuk Anadolu takviminden ayrıldı (KARAR 620) — bant ikisinin de önkoşulu olmayı sürdürüyor.

**Kapanan halka — etkinlik tarihleri.** Tam kayıt `90-kronoloji/2026-09.md`'de (10 Eylül tahliyesi, KARAR 457/61): 15 yayında etkinlik, yedi format kayıt route'u canlı; on dördü gövdeli, `yolculuk-acilis` `Detay` **NULL** — **B81** açık.

---

## SESSİZ KIRILMA NOKTALARI

Hepsi "site bozulmaz, özellik sessizce düşer" sınıfı. Metinleri işaret edilen dosyada.

- **`atmosfer.css:1538-1552` genişlik kolonu** — yeni CTA/kart section buraya eklenmezse
  baseline prose alır, geniş çıkar. Dört selektör. → `20-ref-site.md`
- **`ODA_MAP` kapalı settir** — kod tarafı girdi yoksa yeni Notion sayfası 404. → **numara teyitsiz, B35** (KARAR 87 üç ayrı şeye atfediliyor)
- **Notion marker adı = kod sözleşmesi** — ad değişimi component'i haftalarca render
  dışı bırakabilir. → `20-ref-protokoller.md` (KARAR 409)
- **`[class^="ocak-"]` prefix-match** — `ocak-` ilk class değilse baseline sessizce düşer.
  → `20-ref-protokoller.md` (KARAR 375)
- **`.env` yükleme sırası** — `.env.local` `.env`'i ezer. Kalan ayak: `.env.preview`
  (27 Mayıs) hâlâ bir `NOTION_TOKEN` tanımlıyor. → `02-borclar.md` B28
- **Build-time tarih TZ'ye sabitlenmeli** — `new Date()+setHours` TR 00:00–03:00'te gün
  kaydırır. Test tarafı artık `TZ:'UTC'` ile korunuyor. → KARAR 385 + **464** (`vitest.config.ts:12` teyitli)
- **"Kod var" ≠ "output var"** — durum component dosyasından değil `dist/` grep'inden
  okunur. → `20-ref-protokoller.md` (KARAR 355 / 408)
- **Türetilmiş yüzey kaynağın yerine geçmez** — üç vaka, aynı sınıf: hoisted script `dist/`
  grep'ini yanıltır (`odeme_yontemi` çıktıda var ama markup değil, render ölçümü `data-*` ile) ·
  Türkçe metin bundle'da Unicode kaçışlı yaşar (`"\xD6demen alındı"`, kaçış çözülmeden grep
  **yokluk raporlar**) · `PUBLIC_HAVALE_IBAN` yerelde tanımsız, yerel `dist/`ten IBAN teşhisi
  kurulmaz. → KARAR 577 (10 Eyl)
- **`prerender = false` ≠ taze içerik** — yedi SSR sayfası (`/cember` · `/acik-kapi` ·
  `/seremoni` · `/atolye` · `/mini-retreat` · `/sehir-aksami` · `/yolculuk`) içeriği build-time
  collection'dan okur, ISR yok → her metin değişikliği deploy ister, **doğrulama canlıda.**
- **Statik çıktı `dist/client/`'ta** — `dist/` grep'i boş dizinde **her zaman 0** döner;
  "temiz" sahte olabilir. → KARAR 566 · 567

⚠ **`02-borclar.md` bir yapılacaklar listesi değildir** — fark edilmiş ama kapatılmamış
tutarsızlıkların defteridir. Ürün işi (ödeme, WhatsApp, Instagram, mail akışları) oraya
girmez; o kuyruk başka yerde yaşar.

---

## BU DÖNEM NE OLDU

- **8 Ekim — Site dili + Anadolu takvimi turu:** kod commit'i yok. `/acik-kapi` davet sayfası olarak yeniden yazıldı, `/cember` "aylık" kimliğini bıraktı, Anadolu Yolculuğu ilk kohortu **Eylül 2027**'ye kaydı (KARAR 492 → SUPERSEDE), online Yolculuk Anadolu takviminden ayrıldı, **Açık Kapı'da kayıt kalktı** — gelemeyene ücretsiz kod (KARAR 626), *Eşikte Üç Akşam* serisi `ONERI`. Notion Sayfalar DB'de on sekiz sayfa değişti — yazımların bir kısmını **Claude.ai** yaptı (KARAR 625). ⚠ **Canlı teyit alınmadı** (**B225**); korpusta üç satır eski kayıt sözünü taşıyor (**B226**). **KARAR 617–626** · **B221–B226**. → `90-kronoloji/2026-10.md`
- **8 Ekim — Zoom host turu:** `a56488d`. Online oda artık `ZOOM_HOST_EMAIL`'deki kullanıcı adına açılıyor (`users/me` kalktı); canlıda doğrulandı. **KARAR 616** · B78 ve B205'e ölçüm eklendi. → `90-kronoloji/2026-10.md`
- **7–8 Ekim — B211 bildirim hattı turu:** `4f38887` … `9767fee`. **B193 ✅ · B211 ✅** · B72 · B192 · B206 ✅.
  Kayıt/ödeme mailleri MailerLite'tan Resend'e geçti; süre sayan her şey `/api/bildirim-tara` + n8n saati;
  ödeme ekranları yeniden yazıldı. **605–615** · B215–B220 açıldı. → `90-kronoloji/2026-10.md`
- **7 Ekim — Search Console + DNS envanteri turu:** kod commit'i yok. Domain property doğrulandı, DNS envanteri ilk kez ölçüldü, sitemap `Couldn't fetch` teşhis edildi (**B212**), MCP damgası yalan söylüyor (**B213** — ❌ **aynı gün çürüdü**, damga doğruydu; bayat olan deploy'du → **B97**), `mail.ocak.biz` zinciri teyitsiz (**B214**). → `90-kronoloji/2026-10.md`
- **6 Ekim — N-Kolay kimlik köprüsü turu:** `2e7e5b5` + `f1a41b4`. Hat **açıldı** — gerçek
  kart işlemi uçtan uca geçti. **B201 çürüdü**, **B202 ✅**, **B203** kısmi, **601 · 602 · 603**.
  Aynı gün Notion API kesintisi (B209). → `90-kronoloji/2026-10.md`
- **1 Ekim — LANSMAN (robots Allow turu):** `d203581` + `520e5fe` — site aranabilir (**KARAR 599**) + duyuru (Kaan). Aynı tur
  **B193**'ü teşhis etti: production'da kart seçimi mock ekrana iniyor, öncülü düştü. → `90-kronoloji/2026-10.md`
- **1 Ekim — hamburger Takvim turu:** `2640f49` — Takvim menünün son öğesi, mobilde ayraçlı (**KARAR 600**). → `90-kronoloji/2026-10.md`
- **11 Eylül · 24 Ağustos · 19 Ağustos ve öncesi** (N-Kolay sağlayıcı turu · MJ görsel ·
  Sayfalar metin + DEPLOY · B turu · üç format) → `90-kronoloji/2026-08.md` · `2026-09.md`

---

## AÇIK CEPHELER

Sayı ve detay `02-borclar.md`'de; burada yalnız cephe adı + sahip.

| Cephe | Sahip |
|---|---|
| Advaita görüşmesi — beş C kalemi + Ritüel ön görev (B178) + K4 Wild Woman (B158) | Kaan + Advaita |
| ✅ **B193** kapandı (7 Eki) — bir sonraki bakımda iner | — |
| Başvuru → kayıt köprüsü (Kabul akışı, dört karar Kaan'da) · havale otomatik eşleştirme | Kaan + CC |
| WhatsApp/Meta onay hattı | Kaan |
| Yolculuk fiyatlandırma → ilk etkinlik | Kaan + Advaita |
| Sosyal medya **Gün 1** önkoşulları (Gün 0 ✅ 23 Ağu, KARAR 542) | Kaan |
| CC kod kuyruğu (hash listener, Turnstile, Safari banding, ilk hafta paketi) | CC |
| N-Kolay iptal/iade servisi (**B200** kısmi — okuma kuruldu) · ✅ bildirim halkası **B211** kapandı (8 Eki) | CC |
| Arama görünürlüğü — sitemap `Couldn't fetch` (**B212**), 0 indeks · MCP checkout tazeliği (**B97** — B213 çürüdü, devraldı) | Kaan + CC |
| İçerik tarama turları (Uluslararası sweep, "sembolik ücret") | Claude.ai → Notion |
| Sığ çapa onarımı **B36-a ✅** — iş B36-b'ye devretti | — |
| Sığ çapa onarımı **B36-b** (desen dışı) + KARAR 87 ayrıştırma (B35) | Claude.ai |
| `10-marka.md` aynasının tazelenmesi (KARAR 471, ilk tatbik) | Kaan |
| B53 bağlantı ucu (beta bekliyor) + B51 (B53'e bağlı) | Kaan + CC |

---

## DEĞİŞMEYEN ÜÇ ŞEY

1. **Her sayfa/konu ayrı sohbet** (KARAR 52) — bağlam kirliliği hâlâ gerçek.
2. **ADIM 0 salt-read** (KARAR 355) — agentlara da uygulanır, `ocak-arsivci` dahil.
   Teşhis `dist/`ten konuşur, dump'tan değil.
3. **iPhone Safari eyeball** — merge öncesi, otomatikleşmez. Test yeşili ≠ göz temiz.

---

**Lansman tanımı (KARAR 149):** lansman = robots Allow + duyuru. Sitenin canlı olması değil.
✅ **Lansman: 1 Ekim 2026** — robots Allow (`520e5fe`, KARAR 599) + duyuru (Kaan bildirdi; kanal kaydedilmedi).
*Lansmana kadar site stealth-canlıydı (27 May → 1 Eki; KARAR 147 → 599).* **İlk kohort hedefi: Eylül 2027 — Anadolu Yolculuğu AÇILIŞ** (iç hedef 23–26 Eylül 2027, KARAR 617). *Önceki hedef 24–27 Eylül 2026 (KARAR 492) tutmadı — SUPERSEDE.*
**Fiyatlandırma:** bu dokümanda rakam tahmini yapılmaz. **Kaan** site sayfalarında görünmez
(KARAR 89).
