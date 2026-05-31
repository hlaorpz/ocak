# OCAK Site

Kadınların kadim ateşi. **Astro 5 SSG + content collections + Notion API canlı binding** (KARAR 96).

Build çıktısı saf HTML/CSS/JS — kullanıcıya statik dosya gider, Astro sadece kaynak yapısı.

---

## Hızlı Başlangıç

```bash
# 1) Bağımlılıklar
npm install

# 2) Env değişkenleri
cp .env.example .env
# .env dosyasını aç, NOTION_TOKEN ve DB ID'lerini gir
# (KARAR 97 — token asla repo'ya commit edilmez, .gitignore'da)

# 3) Lokal geliştirme
npm run dev
# → http://localhost:4321
```

## Komutlar

| Komut             | Açıklama                                              |
| ----------------- | ----------------------------------------------------- |
| `npm run dev`     | Lokal geliştirme sunucusu (HMR açık)                  |
| `npm run check`   | TS + Astro tip kontrolü (`astro check`, Vite-aware)   |
| `npm run build`   | Production build → `dist/` (TS check + Astro build)   |
| `npm run preview` | Build'in lokal preview'i                              |
| `npm run astro …` | Astro CLI (örn. `astro add`, `astro check`)           |

---

## Klasör Yapısı

```
ocak-site/
├── astro.config.mjs          Vercel adapter + site URL + static output
├── package.json
├── tsconfig.json             Strict + path alias (@components, @lib …)
├── .env.example              Notion env şablonu (gerçek token .env'de)
├── .gitignore                .env, node_modules, dist, .astro, .vercel
├── public/
│   ├── favicon.svg
│   └── fonts/                Self-host fontlar (lansman öncesi)
└── src/
    ├── styles/
    │   ├── tokens.css        Renk paleti, tipografi, spacing — TEK değişiklik noktası
    │   ├── reset.css         Minimal modern reset
    │   └── global.css        Base typography + utility class'ları
    ├── layouts/
    │   └── Layout.astro      HTML iskeleti, meta, font, atmosfer, reveal observer
    ├── components/
    │   ├── Nav.astro         6 oda navigasyon, sticky, mobile drawer
    │   ├── Footer.astro      Manifesto + üç sütun + temas
    │   ├── GrainOverlay.astro   Sayfa üstü grain (mix-blend-mode: overlay)
    │   ├── EmberGlow.astro      Köz radial glow (atmosfer)
    │   └── Reveal.astro         Scroll-trigger fade-in wrapper
    ├── lib/
    │   └── notion.ts         Notion API client + getProp helper
    ├── content/
    │   └── config.ts         Sayfalar + Etkinlikler collection şeması
    └── pages/
        └── index.astro       Iskelet placeholder (#23'te /hikaye, /felsefe… gelecek)
```

---

## Tasarım Tokens (KARAR 35)

| Token         | HEX       | Kullanım                          |
| ------------- | --------- | --------------------------------- |
| `--coal`      | `#1A1210` | ana zemin                         |
| `--ember`     | `#C44B2F` | vurgu, CTA, butonlar              |
| `--cream`     | `#F2EAE2` | ana yazı rengi                    |
| `--gold`      | `#D4A855` | ikincil vurgu, overline, etiketler|
| `--ash`       | `#3D3532` | kart arka planı                   |
| `--smoke`     | `#5C5350` | alt metin, tarihler               |
| `--warm-gray` | `#8A7E78` | gövde metin                       |

**Beyaz (#FFFFFF) yasak.** En açık renk `--cream`.

**Tipografi:**
- Başlık: `Cormorant Garamond` (serif)
- Gövde: `Jost` (sans-serif)
- Vurgu: `Cormorant Garamond Italic` (`<em>` / `.italic`)

---

## Section Etiketleri (KARAR 92, 93)

Notion markdown'unda her section şu formatla yazılır:

```markdown
## section: hero
overline: ANA SAYFA

# OCAK
*Kadınların Kadim Ateşi*

## section: bir-sonraki
> Bir sonraki çember: 21 Haziran, Yaz Gündönümü.
> [Katıl →](/cember)
```

#22 sohbetinde **custom remark plugin** bunları HTML'e dönüştürecek:
`## section: hero` → `<section class="ocak-hero">…</section>`.

**5 kanonik render section:**
1. `hero` — overline + italik H1
2. `bir-sonraki` — statik blockquote callout (page-level)
3. `sonraki-bulusma` — Etkinlikler DB'den dinamik liste (`source: etkinlikler`)
4. `siradaki-kapi` — üç sütun H3 kart grid
5. `sss` — accordion (her sayfa içinde inline)

Diğer section'lar serbest snake-case (`## section: araclar-listesi` vb.) — standart prose render alır.

---

## Form Backend Dokunulmuyor (KARAR 96)

Astro frontend yine **mevcut Apps Script URL'ine** fetch atıyor:

```
https://script.google.com/macros/s/AKfycby0…/exec
```

- Çember başvurusu → `mode: 'no-cors'` POST
- Açık Kapı → `text/plain` content-type (CORS bypass)
- MailerLite frontend fetch'i → `connect.mailerlite.com/api/subscribers`
- Zoom toplantı oluşturma → Apps Script tarafında, aynen

**Risk minimize:** Frontend mimari değişiyor, backend bütünüyle aynen kalıyor.

---

## Notion Integration (KARAR 97)

- **Internal Integration "Ocak Site"** kuruldu
- Connection eklenen DB'ler: **Sayfalar**, **Etkinlikler**
- Token `ntn_…` formatında, **sadece Vercel env'de + lokal `.env`'de** yaşar
- **Asla repo / Çekirdek / Arşiv'e yazılmaz**
- Token rotation: Notion settings → integrations → secret yenile → Vercel env güncelle

### Vercel Env Kurulum

Vercel dashboard → Project (`prj_CxW3Nm85TGzdrZdePCk74WLAv23f`) → Settings → Environment Variables:

| Key                   | Value            | Environments                 |
| --------------------- | ---------------- | ---------------------------- |
| `NOTION_TOKEN`        | `ntn_...`        | Production, Preview, Dev     |
| `NOTION_PAGES_DB_ID`  | `xxxxxxxx...`    | Production, Preview, Dev     |
| `NOTION_EVENTS_DB_ID` | `xxxxxxxx...`    | Production, Preview, Dev     |
| `PUBLIC_GTM_ID`       | `GTM-W6L2NSDS`   | Production, Preview          |

---

## İçerik Güncellemesi

Notion'da Sayfalar veya Etkinlikler database'inde içerik düzenlerken site sessiz kalır. Değişikliği canlıya almak için sayfanın **Yayınla** checkbox'ını işaretle — 1-2 dakika içinde site güncellenir.

Akış: Notion property edit → Yayınla check (false→true) → Notion Automation tetiklenir → Vercel Deploy Hook çağrılır → Vercel build başlar → Astro Notion API'dan o anki snapshot'ı çeker → ~40-90 saniyede READY.

Aynı sayfayı tekrar güncellemek: Yayınla'yı uncheck → tekrar check. Notion sadece false→true geçişini trigger olarak görür.

Yeni sayfa açmak için: `src/pages/` altında yeni route dosyası gerekir (kod tarafı, tek seferlik). Mevcut 19 sayfa kapalı set.

Akışı manuel test etmek için: `node --experimental-strip-types --env-file=.env scripts/yayinla-test.mjs --slug=/cember --action=toggle` — Yayınla'yı değiştirir, Vercel deployments listesinden build'in başladığı doğrulanır.

---

## Sıradaki Sohbetler

| #     | Konu                                                                                       |
| ----- | ------------------------------------------------------------------------------------------ |
| #21   | **Section components** — 5 kanonik render (Hero, BirSonraki, SonrakiBulusma, SiradakiKapi, SSS) |
| #22   | **Notion binding + remark plugin** — Sayfalar DB → markdown → Astro content                |
| #23-25 | **Sayfa migration** — 19 sayfa Astro'ya geçer                                             |
| #26   | **Lansman** — GTM, Meta Pixel, Google Tag, CAPI, OG image, sitemap, robots, smoke test    |

---

## Atmosfer Notu

Mevcut üç sayfanın (index.html, basvuru.html, acik-kapi.html) atmosferi — özellikle **grain dokusu, radial glow ve reveal animasyonu** — bu iskelete bire bir taşınmadı henüz; #21'de mevcut CSS'den parça parça migrate edilecek. Şu anki `GrainOverlay`, `EmberGlow`, `Reveal` component'leri başlangıç versiyonu — Çekirdek tokens'a sadık, ince ayar gelecek turda yapılacak.
