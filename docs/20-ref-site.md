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

---

*Aşağıdaki gövde `ocak-referans.md` v46'dan **birebir** taşındı (B32, 7 Ağustos 2026).
Hiçbir cümle kısaltılmadı, yeniden yazılmadı. Satır-satır köken izi:
`docs/_arsiv/_bolme-haritasi-referans.tsv`.*

---

## A.15 — SİTE MİMARİSİ (KARAR 50-55, 83, 85, 86, 87)

### Master Metin İki Yerde (KARAR 54)

Kadınları ağlatan ana metin (Sohbet #6'da validasyon almış) iki yerde yaşayacak:
- **Ana Sayfa:** Kısaltılmış, scroll deneyimi halinde
- **/hikaye:** Tam metin + KÖZ metaforu (6 katmanlı detay) + beşli sentez detayı

### Advaita & Ekip Odası Durumu (KARAR 90, v2 KARAR 124)

| Sayfa | Durum |
|---|---|
| /advaita | Onay Bekliyor (v1) — Üçüncü tekil OCAK sesi (KARAR 55), KARAR 47 görünür, alkimi sembolleriyle 4 modalite kümesi, IG alıntıları blockquote, "Bir ateş, çok ocak" |
| /ekip | **v2 (KARAR 124 #27 Brief B)** — Notion'da güncel yapı: Şu An + Çekirdek 5 rol simya sembolleriyle (🜂 Nefes & Beden / 🜄 Psikolog · Terapist / 🜁 Ses & Sanat / 🜃 Hareket & Dans / 🜔 Kadın Sağlığı opsiyonel) + Dönen Konuklar + Çıraklık 4 satır tablo (Ay 1-6 / Ay 6-9 / Ay 9-12 / Yıl 2) + Çoğalma "Bir Ateş, Çok Ocak". KARAR 47 + KARAR 89 ("bir kurucu ortak taşıyor") açıkça konuşuyor, Kaan görünmüyor ✓, portre yok ✓, "Bir Sonraki [X]" yok ✓ orientasyon sayfası |

### İletişim Odası Durumu (KARAR 90, KARAR 124 page override)

| Sayfa | Durum |
|---|---|
| /iletisim | **v1 + page override (KARAR 124 #27 Brief C)** — Mail (selam@ocak.biz), WhatsApp asistanı (açık konuşulur, bot olduğunu söyler), Instagram (@ocak.life + @advaita_hayatladans), Konum (İzmir evi, açık adres yok), Ateş Mektupları AtesMektuplariCTA pattern (KARAR 121 beşinci kullanımı, ana sayfa form'a jump link), conversational SSS. `src/pages/iletisim.astro` page-level override (KARAR 119 paterni). Senaryo A doğrulandı: `## section: ates-mektuplari` plugin OMIT_SECTIONS yakaladı, page override ile CTA component instance |

### Section Etiketi Retrofit Turu (KARAR 92)

Bazı sayfalarda `## section: name` + (hero için) `overline: AD` etiketleri var, bazılarında yok. `/hikaye`, `/advaita`, `/ekip`, `/iletisim` standart taşıyor — diğer 15 sayfada eksik. Bu etiketler renderer/CSS class altyapısının ön şartı:

- `section: hero` → tam genişlik, radial glow, büyük serif başlık, alt overline (krem renk, harf aralığı geniş)
- `section: siradaki-kapi` → üç sütun H3 kart grid'i
- `section: bir-sonraki` → blockquote, Köz vurgulu, CTA buton
- `section: sss` → accordion, daraltılabilir
- Diğer section'lar → standart prose

`section: name` satırı CSS class'a dönüşür (`<section class="ocak-hero">`); `overline:` satırı hero üst etiketi için ayrı field. Bunlar olmadan parser kararsız — ya hepsi düz prose olur ya da regex tahminiyle çalışır, ikisi de kırılgan.

**Karar:** #20 (kod entegrasyonu) öncesinde ayrı bir retrofit turu açılır. Eksik sayfalar Notion'dan toplanır, bir oturumda section etiketleri standartlaştırılır. İçerik kararı değil mekanik iş — ayrı sohbette toplu yapmak hata riskini azaltır.

---

### 12–20 Temmuz 2026 eklemesi — Liste ailesi tek gramer (KARAR 405, 411-419)

**Sorun:** Sitede **dört liste lehçesi** yaşıyordu — format kartları (panel tint + ember border + kısa ALTIN divider), /araclar accordion (ray + kısa ALTIN divider), /advaita accordion (ray + açık başlığa TAM EMBER KUTU), takvim satırları (ray + hairline + featured tint).

**Tek gramer (KARAR 411):** Tek liste komponent stili `.liste__oge` + `collapsible` bayrağı. Her modda aynı iskelet: **sol ray** (2px, nötr `--ray-notr` / aktif `--ember`) · **başlık satırı** (Cormorant italik ~22-26px) · **italik tagline** (`--cream-soft`) · **30px 1px ember kısa çizgi** (tagline varsa) · **gövde**. **Ember dozu DURUM anlatır, dekor değil.** Format kartlarındaki panel tint tamamen kalktı (çıplak kömür üzerinde tipografi). Liste bağlamındaki **altın divider'lar ember'e döndü** — altın yalnız vurgu bloklarında (`buyuk-vurgu`/`manifesto-vurgu`/inline altın) kalır (KARAR 210 hattının devamı). /advaita açık-başlık ember-kutusu kaldırıldı. Doğrulama grep'leri: liste bağlamında altın divider = 0, panel tint yalnız takvim featured, /advaita ember-kutu = 0.

**Meta-slot iptali (KARAR 412):** Statik açık listelerde sağ meta etiketi ("tek akşam" / "6 Hafta", suffix'ten parse) **tamamen kaldırıldı**; süre bilgisi gövdeye doğal dille girdi. Accordion'da +/× kalır, yanında meta olmaz. Başlık suffix strip guard korundu ("—" artığı görünmesin).

**Statik/accordion kanonu (KARAR 405 → 413):** İlk ölçüt sayfa türüne bağlıydı (karar sayfaları = statik açık, envanter/derinlik = accordion) ve /atolye bu ölçütle **karar sayfası** ilan edildi — ölçüt liste uzunluğu değil *seçim mi merak mı* (KARAR 405). Uygulamada 10 öğelik statik liste sayfayı aşırı uzattı; ölçüt **liste doğasına** kaydırıldı (KARAR 413): karar-kütlesi küçük ve taahhüt-ağırlıklı liste → içeriğe göre; **dönen envanter** ("rafta dönenlerden bir avuç" = raf doğası) → accordion, karar sayfasında bile. Sonuç: tüm karar-sayfası listeleri accordion'a döndü (/seremoni `turler`, /mini-retreat `temalar`, /acik-kapi `formatlar`, /atolye `atolyeler` + `seri-atolyeler`) ve **her accordion section'ında ilk öğe `<details open>` başlar** — boş başlık listesi "ölü liste" hissini kırar; native `<details name>` grubu tekil-açık davranışını korur.

**KARAR 336 satır-scope revizesi (KARAR 414):** KARAR 336 iptal değil **rafine** edilir. Ember-durum ayrımı yalnız `variant='satir'` (takvim listesi) için geçerlidir: nötr satır ash ray 2px, featured satır ember 2px + `--ember-alpha-08` tint. `variant='kart'` (dar kutu, home, detay) ember çizgisi **KALIR** — tek başına duran kart doğası gereği vurgudur, "ember = durum" grameriyle çelişmez.

**Geçersiz DOM fix (KARAR 416):** `<summary>` içine `<h3>` konmaz — heading content, summary'nin phrasing-content bağlamında HTML5 spec ihlalidir. Tarayıcı tolere eder ama flex davranışı bozulur: `h3` summary width'ine stretch olup başlıkları görsel ortalar ve **ray merdiveni** yaratır. Üç tur CSS (text-align / margin-left / justify) tutmadı çünkü sorun CSS değil geçersiz DOM'du. Çözüm: `<span class="liste__baslik" role="heading" aria-level="3">` + işaret span; semantik ARIA ile korunur. Statik `<article>` içinde gerçek `<h3>` kalır (orada spec'e uygun). ⚠ **Yapısal borç:** `aria-level="3"` sabit — sayfadaki H2 section başlığı hiyerarşisiyle tutarlılık post-launch erişilebilirlik turunda teyit edilmeli.

**İki-section dikey ritim (KARAR 418):** Notion `X-intro` (H2 + intro P) + `X` (accordion) iki ayrı section üretir; baseline `padding: 48 32 64` her ikisine uygulanınca ~130-200px boşluk doğuyordu (H2 havada, liste kopuk). **Explicit 4-çift** selector kullanıldı (`temalar-intro` / `turler-intro` / `formatlar-intro` / `seri-programlar-intro` + sonraki accordion'lar): intro `padding-bottom: 0`, accordion `padding-top: 0`. Geniş `[data-section$="-intro"]` selector'ü **reddedildi** — /araclar (`arac-kutusu-intro`) + /anadolu (`evreler-intro`, `aramizda-intro`) regresyon riski. `--space-7` negatif margin yalnız `atolyeler + seri-atolyeler` çiftinde (iki accordion arası geçiş, intro değil).

**Token:** `--ember-alpha-08` featured tint olarak tokenize edildi (KARAR 415, mevcut ember-alpha migrasyon borcunun kısmi ödemesi); `--ray-notr` eklendi; tagline mevcut `--cream-soft`. Ölü blok temizliği (KARAR 417): `section[data-section^="raf-"][class^="ocak-raf-"]` CSS bloğu (plugin böyle wrap üretmiyor) + `araclar.astro` build-time HTML rewrite override (plugin çıkışıyla eşleşmiyor) silindi.

### 12–20 Temmuz 2026 eklemesi — Kayıt CTA mimarisi (KARAR 406, 423-428)

**Kırılma:** `kayit-cta` section'ı **üç kod yolundan** render ediliyordu — Yol A remark plugin `transformKayitCta` (etkinlik detay/site-rehber, parlak buton), Yol B `KayitCTA.astro` component (7 format landing, soluk link), Yol C `SonrakiBulusma.astro` (home, parlak buton) — iki farklı görsel gramer (`.ocak-kayit-cta__buton` vs `__link`). Ayrıca buton **metni** format-sabit `KAYIT_CTA_LABEL[slug]` tablosundan geliyordu ama gerçek akış etkinlik-bazlıydı (`Etkinlikler.Kayıt Tipi`): /mini-retreat "Başvur" derken Direkt'e, /yolculuk "Yerini ayır" derken Başvuru'ya düşüyordu — **metin yalan söylüyordu.**

**Ara durak (KARAR 406, emekli):** Marker `form-anchor` → `kayit-cta` yeniden adlandırılırken `splitBodyByMarkers` fragment listesine eklenmemişti; `KayitCTA.astro` **hiçbir sayfada basılmıyordu** ve buton görünmeye devam ettiği için sessiz kaldı. Çözüm B ile marker Astro component instance'ına delege edildi (`splitBodyByMarkers` case + `PageContent` branch + `kayitCtaProps` registry + plugin fallback izi). Üç gün sonra section tümden emekli edilince bu çözüm de düştü.

**İki-section mimarisi (KARAR 423):** `kayit-cta` section'ı emekli edildi (`KayitCTA.astro`, `transformKayitCta`, `KAYIT_CTA_LABEL`, `resolveKayitCtaHref`, `kayitCtaProps`, `PageContent` handler kaldırıldı; `data-section` attr `kayit-btn`'e rebrand). CTA iki section'da toplandı: **`sonraki-bulusma`** (kart + buton + "Diğer tarihler →" `/takvim#[format]`) ve **`mini-cta`** (serbest bağlam, kırmızı buton). `isKayitFormat` yaşamaya devam eder. KARAR 218 (slug-otomatik hedef) mantığı devralındı; KARAR 307/332/334/335 revize edildi.

**Buton metni etkinlik tipinden (KARAR 424):** `Kayıt Tipi = Direkt` → "Yerini ayır →"; `= Başvuru` → "Başvur →"; etkinliğe bağlı değilse (format sayfası kapanışı) nötr → "Yerini ayır →". Notion link metni butona **taşınmaz**, buton kendi sözlüğünü kullanır. **Otorite netleştirmesi:** sayfa CTA butonu *ikincil davet tabelasıdır*; asıl kayıt tipi otoritesi `/[format]/kayit` form submit runtime'ındadır (`KayitFormu.astro:1560 direktAktif()` seçili option'ın `data-kayit-tipi`'sini okur).

**`KayitBtn.astro` primitive (KARAR 425):** Üç mod — Mod A etkinliğe bağlı (`etkinlik` prop → tip metni + hedef `/[format]/kayit`), Mod B nötr (`format` prop). `sonraki-bulusma` `liste[0]`'dan besler (ek fetch yok), `mini-cta` bağlamdan, etkinlik detay URL slug'ından.

**`mini-cta` esnek link-tüketimi (KARAR 426):** `transformMiniCta` gövdedeki son child "paragraph > link" ise **tüketir** (ayrı link olarak kalmaz), yoksa doğrudan buton emit eder. **Boş `section: mini-cta` marker'ı meşru girdidir**, warn üretmez — Kaan Notion'da elle link silmek zorunda kalmaz. `site-rehber` + `anadolu` bypass korunur.

**TEK GENİŞLİK GERÇEĞİ (KARAR 427, KALICI):** `atmosfer.css:1538-1552` **dört section'a** özel genişlik kolonu tanımlar (`etkinlik-takvimi` + `sonraki-bulusma` + `kayit-btn` + `mini-cta`): mobil `max-width:none; padding-inline:0`, desktop `viewport/3`. **Yeni bir CTA/kart section eklenirse bu listeye ZORUNLU eklenir**; eklenmezse sessizce baseline prose (38rem) alır ve geniş çıkar. Gizli global kural = sessiz kırılma riski.

**Etkinlik detay kartı (KARAR 428):** `<EtkinlikListe etkinlikler={[etkinlik]} />` kullanır — home + format sayfası `SonrakiBulusma` ile **birebir** (satir varyantı). Hardcoded `EtkinlikKart variant="kart"` + orphan `.sonraki-bulusma__liste`/`__item` (CSS'te hiç tanımlı değildi) düştü; kart sola-hizalı + butonla aynı max-width.

### 12–20 Temmuz 2026 eklemesi — Kayıt formu UI (KARAR 420-422)

**Çok-satırlı rich_text parse tek kaynak (KARAR 420):** `parseKayitSorulari`'nın gövdesi `parseRichTextLines(raw)` jenerik fonksiyonuna çıkarıldı, eski ad geriye-uyumlu **alias** olarak bırakıldı. Gerekçe: soru ↔ açıklama **indeks hizasının garanti** kalması için ikisinin birebir aynı split/trim/filter mantığını kullanması şart; ayrı ama "aynı görünen" fonksiyon drift riski taşır.

**Placeholder binding (KARAR 421):** Notion `Kayıt Soruları Açıklama` (rich_text, `\n` ayraçlı) satırları ilgili niyet textarea'sının placeholder'ı olur: `ta.placeholder = aciklamalar[i]?.trim() || "Birkaç cümle yeter."`. Template default korunur, JS yalnız doluysa ezer. İçerik-sunum sınırı (KARAR 354): placeholder düz `plain_text`, CSS/bold/renk dayatması yok.

**Dropdown option label (KARAR 422):** Label'da **etkinlik başlığı** (`baslik`, Notion title `Başlık`) kullanılır, `FORMAT_TIP[format]` **değil** — format etiketi buluşmalar arasında ayırt etmez, hepsi aynı olur (KARAR 283 ayrımının pratik uygulaması). Biçim: `{baslik} · {tarih}` + `— Dolu` eki; ayraç ` · ` (U+00B7, meta satırı kanonu). Ad her zaman gösterilir — "tek buluşmada gizle" koşulu reddedildi (ekstra dallanma/test yükü, kazanç düşük, KARAR 104 ruhu). Ad boşsa güvenlik ağı düz tarihe düşer.

### 12–19 Temmuz 2026 eklemesi — Yedinci kapı, `/yolculuk` rolü, CTA buton dili (KARAR 429, 433, 438, 445; PARTİ 3/3)

**`/yolculuk` rol değişimi ve üç katmanlı yapı (KARAR 429).** Sayfa "şemsiye sayfa (iki yolculuğun kapısı)" olmaktan çıkıp **"kavram + online ürün sayfası + iki türevin kapısı"** oldu. Katman sırası: (1) **KAVRAM** — `hero` + `intro` + `yolculuk-eksen` (görsel bileşen, dokunulmadı) + `yolculuk-nedir` + `yolculuk-kime`; (2) **ONLINE ÜRÜN** — `online-yolculuk` + `buyuk-vurgu` + `online-nasil`; (3) **İKİ TÜREV** — `iki-yolculuk`; ardından mevcut `siradaki-kapi`. Route değişmedi ama **SSR override**'a geçti (`src/pages/yolculuk.astro`, `prerender=false`; eskiden `[...slug].astro` render ediyordu); yeni route `/yolculuk/kayit` (Direkt kayıt, `KayitFormu format="yolculuk"`). Yeni serbest-prose section adları: `online-yolculuk`, `online-nasil` (`/yolculuk`), `ayni-esikler` (`/anadolu`), `format-yolculuk` (`/bulusmalar`). Meta Açıklama `/yolculuk` + `/bulusmalar` için güncellendi; Sayfa Başlığı değişmedi.

**`/bulusmalar` altı → yedi kapı (KARAR 438).** Sıra: `format-acik-kapi` (1) → `format-cember` (2) → `format-seremoni` (3) → `format-atolye` (4) → `format-sehir-aksami` (5) → `format-mini-retreat` (6) → **`format-yolculuk` (7)** → `format-takvim` (**numarasız kapanış**, marker adına rağmen kapı değil). 1-6 numaralandırması değişmedi. **Yolculuk sona konur çünkü en ağır taahhüttür — sıra, taahhüt ağırlığı sırasıdır.** Blok mevcut altı formatın kalıbına birebir uyar: `## 7 · Yolculuk` → tek cümle vaat → ritim paragrafı → `Kim için:` → ok-sonda link. Hero "Altı kapı, bir ateş." → **"Yedi kapı, bir ateş."**; intro ikinci paragrafı altı→yedi. `ilk-davet`, `hangisinden-baslasam`, `siradaki-kapi` dokunulmadı.

**Format sayfası kayıt CTA marker zorunluluğu (KARAR 433) ⚠ KARAR 423 ile SUPERSEDE.** Doğduğu andaki hâli: kutu-buton KayitCTA render'ı için Notion body'sinde `## section: form-anchor` marker'ı zorunludur; kod registry'de hazır tutar ama marker olmadan tetiklenmez. **Vaka:** marker yazılmadığı için KayitCTA render olmadı, yanlış hedefli prose linki (`[Yolculuğa kayıt →](/takvim)`) tek aksiyon olarak canlıya çıktı. **Bugünkü okunuşu:** marker mimarisi 16–20 Temmuz'da değişti (`form-anchor` → `kayit-cta`, KARAR 406 → `kayit-cta` tümden emekli, CTA `sonraki-bulusma` + `mini-cta`'ya taşındı, KARAR 423). Kural yaşamaya devam eder: **format sayfası kayıt CTA'sı için ilgili marker Notion'da bulunmalıdır ve brief bunu açıkça söylemelidir.** Marker-sözleşme ilkesi KARAR 409'da kalıcılaştı.

**CTA buton dili — tek etkinlik vs havuz (KARAR 445) ⚠ KARAR 424 ile KISMEN SUPERSEDE.** Kural: buton bir TEK etkinliğe mi açılıyor, HAVUZA mı? (1) Tek belirli etkinlik kartı → tipini söyler (direkt "Yerini ayır →", başvurulu "Başvur →"). (2) Çok-tarihli/karışık-tipli havuza açılan format butonu → nötr "Tarihlere bak →". (3) Aynı etkinliğin diğer tarihleri için buton-altı ikincil satır "Diğer tarihler →". (4) Tek-ve-sabit akışlı format (Anadolu hep başvurulu) → doğrudan "Başvur →". **Korunan ilke — buton havuzu dürüstlüğü:** bir buton arkasındaki içerik havuzu karışık tipliyse hiçbir tip-vaadi dürüst olamaz. **Uygulama durumu:** maddeler (1) ve (3) KARAR 423-425'te doğrulandı ve canlıdır ("Diğer tarihler →" `sonraki-bulusma` içinde `/takvim#[format]`). **Madde (2) uygulanmadı** — KARAR 424'te etkinliğe bağlı olmayan nötr durum "Tarihlere bak →" değil **"Yerini ayır →"**dir.

## A.20 — REKLAM VE ANALYTICS ALTYAPISI (KARAR 59)

**Site #20 içine gömüldü** (ayrı dizi yok). Lansman öncesi kurulu olmalı — algoritma veri toplamaya başlasın.

### Mimari

```
Site (ocak.biz)
    ↓
Google Tag Manager (tek script tag, merkez yönetim)
    ↓
├── Meta Pixel (IG + FB)
├── Google Tag (Ads + GA4)
└── (gelecek: TikTok, LinkedIn)
```

**Gerekçe — Neden GTM:** Doğrudan her platform kodunu site HTML'ine gömmek yerine, GTM bir "kod yöneticisi" gibi davranıyor. Siteye tek bir GTM kodu konuluyor, sonra **Meta Pixel'i, Google Tag'i, TikTok Pixel'i GTM arayüzünden** yönetiliyor. Yeni bir platform eklemek istendiğinde siteye dokunmadan ekleniyor.

### Event'ler

- **Page View** — Otomatik. Kadın siteye girdi → pixel ateşliyor. Temel.
- **Lead** — Form gönderildi (Tally → success). Dönüşüm sinyali.
- **Sign Up** — Email kayıt (Ateş Mektupları).
- **Schedule** — Açık Kapı kaydı.
- **Purchase** — Ödeme tamamlandı (Yıl 2+).

### Reklam Yönetimi

| Yıl | Yaklaşım | Detay |
|---|---|---|
| **Yıl 1** | Platform içi AI | Meta Advantage+ Campaign + Google Performance Max. Bu platformların kendi optimizasyonu küçük-orta bütçede ($500-3000) yeterli — manuel hedefleme yapmamak bile daha iyi sonuç veriyor. Ekstra araç gereksiz. |
| **Yıl 2+** | n8n + Claude raporlama | Haftalık otomatik akış: Meta Ads API + Google Ads API'den veri → Claude'a context → "Bu hafta neye yatırım yapmalıyız, neyi kapatmalıyız" raporu → Notion'a yaz / mail at. Mevcut altyapıya sorunsuz oturur. |

### Kreatif Üretimi

- **Metin:** Claude (OCAK ses kılavuzuna uyumlu)
- **Görsel:** Midjourney (görsel kimlik renk paleti ve atmosferi ile)
- **Video:** Runway (kısa reels, story formatları)

### Conversion API (CAPI) — Server-side Tracking

- iOS 14+ ve ad-blocker'lar yüzünden pixel tek başına ~%30-40 veriyi kaçırıyor
- Modern kurulumda kadın form doldurduğunda hem tarayıcı pixel'i hem server (n8n) Meta'ya event yolluyor — veri kaybı azalıyor
- Yıl 1 ortasında devreye alınır. n8n zaten var, server-side event göndermek kolay.
- Kayıp %30-40 → %10 aralığına düşer

**Maliyet:** GTM + Pixel + Tag ücretsiz. Reklam bütçesi ayrı.

### Kurulum Sırası (Site #20'de)

1. GTM hesabı + container kurulumu
2. Meta Pixel + Google Tag GTM'den yüklenir
3. Standart event'ler (page view, lead, sign up)
4. Test (Meta Pixel Helper + Google Tag Assistant)
5. ocak.biz canlı, ilk reklamlar Açık Kapı'ya trafik (Haziran-Temmuz)

**Erken kurulumun önemi:** Algoritma öğrenme zamanı ihtiyacı. Lansman günü reklam başlatmak için Pixel'in en az 2-3 hafta öncesinden veri toplamış olması ideal.

---

