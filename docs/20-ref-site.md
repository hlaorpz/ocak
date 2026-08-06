# OCAK — SİTE & STACK (20-ref)

**Ne taşır:** sayfa mimarisi, güncel teknik gerçek, CTA/section mimarisi, tracking.
**Ne taşımaz:** dönem dönem "şu dosya eklendi" kayıtları — onlar `90-kronoloji/`'de.

---

## GÜNCEL GERÇEK (ADIM 3 damıtımı, 6 Ağustos 2026)

Aşağıdaki bölüm **yeni yazımdır** — Pilot'un dönem deltalarından damıtıldı. Deltaların
tam metni `90-kronoloji/2026-0{5,6,7}.md`'de birebir durur.

- **Dal modeli:** `main` = production (push otomatik canlı). `astro-iskelet` = preview
  tamponu. Çalışma dizini `~/Desktop/ocak-site-clone` (yeniden adlandırma borcu: B01).
- **Vercel kimlik (kanonik):** Team ID `team_EVx2zHhI9iYscmqsuHckk599` · Project ID
  `prj_CxW3Nm85TGzdrZdePCk74WLAv23f`. **Slug bayatlar, ID kalır** (KARAR 389) — mevcut
  slug `hlaorpz`.
- **GitHub kimlik (kanonik):** numeric ID `261375117`. Kullanıcı adı oynak (KARAR 389/454).
- **Form backend:** Vercel serverless (`/api/kayit`, `/api/form`). **Apps Script EMEKLİ**
  (KARAR 262 dönemi) — Pilot'un "Apps Script unified doPost" bloğu bayattı, kronolojiye
  indi (**D8**).
- **CTA mimarisi:** `kayit-cta` **emekli** (KARAR 423). CTA iki section'da yaşar —
  `sonraki-bulusma` (kart bağlamı) + `mini-cta` (serbest bağlam). Buton metni etkinlik
  `Kayıt Tipi`'nden türer (Direkt→"Yerini ayır →", Başvuru→"Başvur →", KARAR 424).
  Asıl kayıt tipi otoritesi sayfa CTA'sı değil, `/[format]/kayit` form submit runtime'ıdır.
- **Tek genişlik gerçeği (KARAR 427, KALICI):** CTA/kart genişliği `atmosfer.css:1538-1552`
  özel kolonundan gelir — **dört selektör**: `etkinlik-takvimi` · `sonraki-bulusma` ·
  `kayit-btn` · `mini-cta`. Yeni CTA/kart section eklenirse bu listeye ZORUNLU eklenir,
  yoksa sessizce baseline prose (38rem) alır. *(**D3**: kod yorumu iki ad sayıyordu,
  `696b462` ile dörde düzeltildi.)*
- **Renk token'ı:** altın token'ın adı **`--gold`**'dur ve öyle kalır (6 Ağustos kararı).
  `--ember`, `--ash`, `--cream-soft` de İngilizce. Sapan taraf KARAR 204'ün metnidir
  (**D5**); hardcode `rgba(212,168,85)` temizliği `75e5274` ile bitti.
- **ODA_MAP kapalı settir** (KARAR 87): her yeni Notion sayfası kod tarafında açık
  girdi ister, yoksa 404.
- **robots.txt:** `Disallow: /` — stealth. Lansman = robots Allow + duyuru (KARAR 149),
  sitenin canlı olması değil.

---

**6 oda · 21 sayfa.** OCAK landing page değil, bir dünyanın haritası.

⚠ **Buluşma kapısı sayısı: ALTI → YEDİ** (KARAR 429, 438). Yedinci kapı **Yolculuk (online)**. `/bulusmalar` sırası taahhüt ağırlığına göre: Açık Kapı (1) → Çember (2) → Seremoni (3) → Atölye (4) → Şehir Akşamı (5) → Mini Retreat (6) → **Yolculuk (7)** → `format-takvim` (numarasız kapanış). Hero "Altı kapı, bir ateş." → **"Yedi kapı, bir ateş."** **Anadolu Yolculuğu bir Format değeridir ama buluşma kapısı DEĞİL** — `FORMAT_ORDER`'a girmez, sekmesi olmaz, `KayitFormat` union'a girmez; kayıt route'u ayrıdır (`/anadolu/basvuru`).

| Oda | Sayfa | URL | Durum |
|---|---|---|---|
| **OCAK** | Ana Sayfa | / | Onay Bekliyor |
| | Hikâye | /hikaye | Onay Bekliyor |
| | Felsefe | /felsefe | Onay Bekliyor |
| | Araçlar | /araclar | Onay Bekliyor |
| **Yol** | Sen Neredesin? | /sen-neredesin | Onay Bekliyor |
| **Buluşmalar** | Buluşmalar | /bulusmalar | Onay Bekliyor |
| | Çember | /cember | Onay Bekliyor |
| | Açık Kapı | /acik-kapi | Onay Bekliyor |
| | Seremoni | /seremoni | Onay Bekliyor (görünür ad "Mevsim Seremonisi"→"Seremoni", KARAR 283) |
| | Atölye | /atolye | Onay Bekliyor (slug rename /workshop→/atolye, 301 redirect, KARAR 294; NOT: kod tarafı `SLUG_KATEGORI`/`INTERNAL_SLUGS` hâlâ `/workshop` biliyor — Faz 3 ADIM 0 hizalar, KARAR ADAYI 313 keşfi) |
| | Şehir Akşamı | /sehir-aksami | Onay Bekliyor (slug rename /istanbul→/sehir-aksami, 301 redirect, KARAR 294; NOT: kod tarafı hâlâ `/istanbul` biliyor — Faz 3 ADIM 0 hizalar) |
| | Mini Retreat | /mini-retreat | Onay Bekliyor |
| | Takvim | /takvim | Onay Bekliyor |
| | Etkinlik Detay | /etkinlik/[slug] | build-time getStaticPaths, slug'lı tüm etkinlikler (geçmiş dahil, İptal hariç), KARAR 277 |
| **Yolculuk** | Yolculuk | /yolculuk | **SSR override** (`src/pages/yolculuk.astro`, `prerender=false`) — rol değişti: şemsiye sayfa → **kavram + online ürün sayfası + iki türevin kapısı**; üç katmanlı yapı (KARAR 429) |
| | Yolculuk Kayıt | /yolculuk/kayit | **YENİ** — Direkt kayıt, `KayitFormu format="yolculuk"` (KARAR 430) |
| | Anadolu Yolculuğu | /anadolu | Onay Bekliyor (+`ayni-esikler` section, KARAR 440) |
| | Anadolu Başvuru | /anadolu/basvuru | Hard-coded layout (KARAR 125 ağır form sapması — sohbet #28) |
| **Biz** | Biz | /biz | Onay Bekliyor |
| | Advaita | /advaita | Onay Bekliyor |
| | Ekip | /ekip | Onay Bekliyor |
| **İletişim** | İletişim | /iletisim | Onay Bekliyor |

**URL kuralı:** Türkçe karaktersiz, lowercase (/hikaye değil /hikâye).

**Kalan adımlar:** Astro setup → component'lar → Notion canlı binding → sayfa migration → GTM/Pixel → lansman. Section retrofit turu tamamlandı (KARAR 93). Astro sohbet dizisinin detayı için bkz. SIRADAKİ ADIMLAR.

**Sıra mantığı:** Şemsiye sayfalar (/bulusmalar, /yolculuk) alt sayfalardan önce. /takvim sona — format türleri belli olduktan sonra. Kod en sona.

**Pattern bekçileri:** Yeni sayfa yazılırken **önce `/cember` ve `/mini-retreat`** markdown'larını oku. Hook cümlesi, sayım yazıyla (on iki, on altı), Sıradaki Kapı H3 kart formatı, "Bir Sonraki [X]" callout pattern'ı, conversational SSS — hepsi buralarda. Kişi/portre sayfaları için ayrıca `/hikaye` paterni (section etiketleri + italik şiirsel ton + alkimi sembolleri). /cember bekçisi #25 Brief B-E'de doğrulandı (KARAR 119), /mini-retreat bekçisi #26 Brief G'de doğrulandı (KARAR 121). (Arşiv: KARAR 87)

**Site:** Astro 5 SSG + content collections + Notion API canlı binding · ocak.biz · Vercel (`@astrojs/vercel` 8.x, static output, `inlineStylesheets:'auto'`) + GitHub (`kso2025/ocak-site`, public — KARAR 100). Notion client `@notionhq/client` + `notion-to-md`. İskelet KARAR 99'da üretildi, KARAR 101'de canlıya alındı, KARAR 105'te 5 component + atmosfer altyapısı eklendi, KARAR 106-111'de Notion canlı binding üretimde devreye alındı, KARAR 112-115'te sayfa migration ilk dalga (pipeline + atmosfer + ana sayfa override + form) çalışır hale geldi, KARAR 116'da QA pass + generic prose pattern baseline (124 section toplu kurtuluş) + Hero h1 italik global + link normalize defansif + AlOlVer component + plugin overline genişlemesi devreye alındı, KARAR 118'de QA polish kod tarafı (nav ember ambient, blockquote nested sıfırla + class + plugin whitespace cleanup, paragraph `_` artığı strip, qa-envanter mobil envanter, listItem asimetrik `*` strip, `:has(em:only-child)` manifesto-kapanışı hierarchy) eklendi, KARAR 119'da Buluşmalar şemsiyesi + ilk iki form sayfası migration tamamlandı (CemberBasvuru + AcikKapiKayit component + cember.astro + acik-kapi.astro override), KARAR 120-122'de #26 ara brief ikilisi + Buluşmalar derinleşmesi + /takvim devreye alındı, KARAR 123-124'te #27 Yolculuk + Biz + İletişim odaları migration tamamlandı (Brief A sıfır kod / Brief B atmosfer table styling + /cember+/ekip toplu iyileşme / Brief C /iletisim page override + AtesMektuplariCTA), **KARAR 125'te #28 başvuru altyapısı + form temizliği tamamlandı (AnadoluBasvuru.astro + /anadolu/basvuru ayrı route + Notion Başvurular DB + 4 form paralel yazma).** **KARAR 126'da Brief F.5 form-anchor registry pattern + 2 yeni kanonik section (mini-cta + buyuk-vurgu) + İletişimForm 5. tip devreye alındı.** **KARAR 128-141'de Brief F kapanış + Brief G zinciri + 5/5 form round-trip + specificity savaşı disiplini + !important lansman öncesi kabul oturdu.** **KARAR 142-144'te Brief H + /test ODA_MAP'e eklendi.** **KARAR 146-149'da Brief I.1+I.2+I.3 + Plan B sessiz canlı (GTM iskeleti + robots.txt + sitemap + Layout noindex prop + acil rollback protokolü).** **KARAR 150-152'de #34 birleşik (GTM teyit + 5/5 form round-trip cleanup + mobil nav fix + GrainOverlay SVG sizing bug fix + form-anchor success state persistence bug bulgusu + bot trafiği bulgusu).** `src/styles/{tokens,atmosfer}.css` (atmosfer artık 5 spesifik retarget + `section[data-section][class^="ocak-"]` generic prose baseline + `[data-section="hero"] h1` italik global + `:has(em:only-child)` standalone italik paragraph manifesto hierarchy + `:has(strong:only-child)` manifesto strong hierarchy + nav `::after` ember ambient + bir-sonraki nested sıfırla + `section[data-section][class^="ocak-"] table` ailesi italik serif header + ember border + ash row + cream body, KARAR 124 Brief B B4.1 + **`.grain-overlay svg { display:block; width:100%; height:100% }` KARAR 150 #34B Brief L#5 fix**), `src/layouts/Layout.astro` (`oda` prop, `<main data-oda>`, atmosfer.css import, ember line `main::before` → nav `::after`'a taşındı + `noindex?: boolean` prop KARAR 147 + GTM iskeleti head + body KARAR 146), `src/components/{Nav,Footer,GrainOverlay,Reveal,Hero,BirSonraki,SonrakiBulusma,SiradakiKapi,SSS,AtesMektuplari,AlOlVer,CemberBasvuru,AcikKapiKayit,AtesMektuplariCTA,EtkinlikTakvimi,IletisimForm,AnadoluBasvuru}.astro` (5 form + 2 yeni kanonik section component), `src/lib/{notion,notion-pages,notion-etkinlikler,oda-map,format-etkinlik,etkinlik-kategori,remark-ocak-sections,api,form-anchor-registry}.ts` (remark-ocak-sections `OMIT_SECTIONS = ['hero-anasayfa', 'ates-mektuplari', 'sonraki-bulusma', 'al-ol-ver']` skip mekanizması + 5 kanonik section + 2 yeni KARAR 126 (mini-cta + buyuk-vurgu) + serbest section + overline normalizer + link href italik artık strip + listItem asimetrik `*` strip + plugin whitespace cleanup + Notion internal link normalize 18 sayfa whitelist + form-anchor split fragment KARAR 126 + ocak.biz domain normalize KARAR 127), `src/content/config.ts` (Sayfalar + Etkinlikler Content Layer loader'ları), `src/pages/[...slug].astro` (dinamik route 19 sayfa, slug map URL→Astro, `oda={getOda(URL)}` + Layout `noindex` prop /test için), `src/pages/index.astro` (ana sayfa override: `<Hero>` + `<Content>` + `<AlOlVer>` + `<SonrakiBulusma>` + `<AtesMektuplari>`), `src/pages/cember.astro` (override: `<Content>` + `<CemberBasvuru>`), `src/pages/acik-kapi.astro` (override: `<Content>` + `<AcikKapiKayit>`), `src/pages/mini-retreat.astro` + `src/pages/seremoni.astro` + `src/pages/workshop.astro` + `src/pages/istanbul.astro` (override'lar: `<Content>` + `<SonrakiBulusma kategori>` + `<AtesMektuplariCTA>` KARAR 121), `src/pages/takvim.astro` (override: `<Content>` + `<EtkinlikTakvimi>` + `<AtesMektuplariCTA>` KARAR 122), `src/pages/iletisim.astro` (override: `<Content>` + `<AtesMektuplariCTA kategoriAdi="Ateş Mektupları">` KARAR 124 Brief C), **`src/pages/anadolu/basvuru.astro` (ayrı route, Hero + AnadoluBasvuru hard-coded layout, KARAR 125), `src/pages/test.astro` (KARAR 142, Notion-bound, ODA_MAP 'OCAK', noindex KARAR 147)**, `public/robots.txt` (KARAR 147 lansman öncesi Disallow + yorum bloğunda lansman versiyonu), `astro.config.mjs` sitemap integration (filter /test, site: 'https://ocak.biz'), `scripts/qa-envanter.mjs` + dump scripts (`cember-dump`, `etkinlikler-dump`, `notion-discover`, `yayinla-test`, `yolculuk-anadolu-dump`, `biz-odasi-dump`, `iletisim-dump`, `basvurular-dump`, `notion-section-envanter`, `tasarim-notlari-dump`, **pixel-sample (KARAR 150 #34B `/tmp` referans), pixel-detail (KARAR 150 #34B `/tmp` referans)** — KARAR 102 ruhu kalıcı yardımcı). **Mevcut durum (31 Mayıs 2026, #35 dönemi sonu):** **branch `main` artık production** (squash merge commit `5033727`, 148 commit/99 dosya/+21794−2, çakışmasız — KARAR 193). Vercel Production Branch = `main` (fiili-astro-iskelet'ten resmî-main'e taşındı, manuel Promote döngüsü kaldırıldı). `astro-iskelet` artık preview tamponu (lokal+remote `5033727`'de force-push hizalı). Döngü: astro-iskelet'te çalış → push (preview) → doğrula → main'e merge+push (otomatik canlı). `www.ocak.biz` + apex serving. Çalışma dizini `~/Desktop/ocak-site-clone`. Lokal `.env` + Vercel env (3 ortam) güncel. Build static (KARAR 96). **#35 dönemi yeni dosyalar:** `src/lib/etkinlik-kategori.ts` (slug→kategori map, KARAR 163-165), `src/lib/scroll-to-success.ts` (5 form success scroll, KARAR 175), `scripts/esik-dump.mjs` (KARAR 154). **#35 dönemi plugin genişlemeleri:** `ESIK_SECTIONS` whitelist + `transformEsik` (KARAR 154), `transformManifestoVurgu` 8. kanonik (KARAR 161), fragment-split `al-ol-ver`+`sonraki-bulusma`+`etkinlik-takvimi` kind'ları (KARAR 163,177), email pattern ASCII (KARAR 174), honeypot frontend 5 form (KARAR 194). **#35 dönemi tooling:** `astro check` tek doğrulama (`npx tsc --noEmit` emekli, KARAR 188), TS Window dataLayer global type (KARAR 188). Kanonik section 9 (hero, bir-sonraki, sonraki-bulusma, siradaki-kapi, sss, form-anchor, mini-cta, buyuk-vurgu, manifesto-vurgu) + esik-* whitelist 10. **Notion canlı:** 21 sayfa (19 üretim + /test + /site-rehber) + 3-4 etkinlik (Durum'lar Taslak/Kayıt Açık karma, Kaan lansman öncesi 2-3'ünü Kayıt Açık çekecek, /test artık ODA_MAP'te) + **Notion'da "Oda" select kolonu eklendi (Kaan, KARAR 150 #34A, Cowork işi)** fresh fetch ile her build'de çekiliyor. **İçerik güncelleme akışı:** Notion'da edit → `Yayınla` checkbox check → Notion automation → Vercel deploy hook → ~1-2 dk'da canlı (KARAR 110). **Test:** 72/72 yeşil (#34 sonu 32 → #35 dönemi 72: dropdown +7, Home Notion-driven +14, esik +4, manifesto-vurgu +2, page-mention +4, takvim +1, vb.). **ODA_MAP** kapalı set (KARAR 87, KARAR 135 ile /site-rehber → 'OCAK' eklendi, KARAR 143 ile /test → 'OCAK' eklendi, şimdi 22 entry — `src/lib/oda-map.ts`). **GTM tracking:** GTM-W6L2NSDS canlı container, Meta Pixel `861407993595884` + GA4 `G-7NQ73Q2WSL` GTM UI tarafında (kod tek tracking platformu bilir, KARAR 146). 5/5 form `dataLayer.push({event: 'form_submit', form_type: '...'})` doğrulandı (KARAR 150 #34A). GTM UI tag setup (Pixel Base + GA4 Google Tag + scroll depth + Pixel Lead + GA4 form_submit) Kaan'da bekliyor, lansman öncesi.

**Reklam/Analytics (lansman öncesi):** GTM + Meta Pixel + GA4 + (CAPI Yıl 1 ortası).
**Arşiv (ilk çember sonrası):** Zoom Cloud + Vimeo Pro + Fireflies + Notion.

**Yaklaşım:** Human led, agent operated. Kaan strateji + yön. Claude kodu + içeriği. Veri tek merkezde (Notion). Otomasyon görsel (n8n). Bot canlı okur.

**Vercel:** Team ID `team_EVx2zHhI9iYscmqsuHckk599` + Project ID `prj_CxW3Nm85TGzdrZdePCk74WLAv23f` **değişmedi**; team slug `kso2025` → **`hlaorpz`** (domain'ler `ocak-site-hlaorpz.vercel.app`, `ocak-site-git-main-hlaorpz.vercel.app`; branch alias `ocak-site-git-astro-iskelet-hlaorpz.vercel.app`). Production deployment `dpl_4YFMS3tPfZpzSiyj7oQgSRHEerA7` (commit `8188346`); rollback adayı `dpl_A8pXVK533dPYqAgt9br5CuRK8fCx` (commit `3c2b865`). Git tag `pre-merge-kayit-penceresi` = `3c2b865` (uzağa push edildi mi teyit edilmedi).

- ⚠ **Form-anchor / kayıt CTA mimarisi GÜNCELLENDİ:** aşağıdaki KARAR 125+126 kaydı tarihsel referanstır. `form-anchor` → `kayit-cta` (KARAR 406) → `kayit-cta` **emekli** (KARAR 423); CTA bugün `sonraki-bulusma` (kart bağlamı) + `mini-cta` (serbest bağlam) iki-section'ında yaşar, buton metni etkinlik `Kayıt Tipi`'nden türer (KARAR 424). Format sayfasında kayıt CTA'sı isteniyorsa **ilgili marker Notion body'sinde bulunmalıdır ve brief bunu açıkça söylemelidir** (KARAR 433 dersi: marker yazılmadığı için KayitCTA render olmadı, yanlış hedefli prose linki canlıya çıktı). Yeni bir CTA/kart section eklenirse `atmosfer.css:1538` genişlik listesine ZORUNLU eklenir (KARAR 427).

- **Yeni kanonik section'lar (KARAR 126):** `mini-cta` (sayfa-sonu yumuşak köprü, ash kart + ember CTA + cream başlık + krem-soft alt metin, /hikaye + /biz + /felsefe + /sen-neredesin + /araclar muhtemel kullanım — Notion-side esnek metin, override gerekmez) + `buyuk-vurgu` (Hero-benzeri büyük italik gold/amber vurgu, ortalı Cormorant Garamond, clamp 2-3rem, oda glow YOK — Hero'dan ayrım, sayfada 1-2 kez kullanım, KARAR 118 `:has()` hierarchy'sinden daha güçlü vurgu basamağı). Plugin transform + atmosfer.css render Brief F.5'te yazılır.
- **İletişimForm (KARAR 126):** /iletisim sayfasına yeni form component, 5. form tipi (Anadolu + Çember + Açık Kapı + Ateş Mektupları kardeşi). isim/email/mesaj field, Apps Script `handleIletisim` branch, Notion Başvurular DB `Tip: İletişim` paralel yazma. Lansmanda email auto-reply YOK (MailerLite şablonu lansman sonrası — KARAR 123 not), UI success state + DB satırı yeter. Lansmanda WhatsApp + IG bot çalışmadığı için tek güvenilir 1:1 kanal (`mailto:` güvenilmez — kullanıcı %50 yarıda bırakır).

- **GTM mimari ayrımı (KARAR 146):** Kod tek tracking platform bilir — GTM. Meta Pixel + GA4 ID'leri kodda YOK, GTM UI tarafında Custom HTML + Google Tag içinde. Yeni tracking partner gelirse (örn. LinkedIn Insight Tag) → kod dokunulmaz, sadece GTM UI tag eklenir. Form submit'leri `dataLayer.push({event: 'form_submit', form_type: '...'})` — GTM yakalar, dispatch eder. **KARAR 150 #34A: 5/5 form push doğrulandı** (Chrome'da `gtm.js?id=GTM-W6L2NSDS` 200 OK, dataLayer 3 entry array + form_submit push'ları). Window dataLayer TS sapması `(window as any)` — lansman sonrası `src/env.d.ts` global Window interface extension borç. **Tracker blocking realite:** Brave + uBlock + Firefox strict tracking protection açık olanlar GTM/Pixel/GA4'ü engelleyecek (KARAR 150 #34A keşfi). Client-side tracking %60-80 user yakalar, gerisi CAPI server-side'a kalır (Yıl 1 ortası roadmap).
- **Layout noindex prop standardı (KARAR 147):** `src/layouts/Layout.astro` `noindex?: boolean` prop alır, head'de koşullu meta robots emit eder. Şu an `/test` kullanıyor. Gelecek özel sayfalar (A/B test, partner page, internal docs) tek prop ile noindex kazanır. Pattern KARAR 102 ruhu — gerçek üstünden hizalama, [...slug].astro head'i Layout'a delegate, single source of truth.

---

*Yukarıdaki gövde `ocak-pilot.md` v52'den birebir taşındı. Bayat olduğu kanıtlanan
bloklar (Apps Script hattı, "CANLI DURUM astro-iskelet production" beyanı) buraya
alınmadı — `90-kronoloji/`'ye indi.*
