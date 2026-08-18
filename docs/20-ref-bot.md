# OCAK — BOT & OTOMASYON (20-ref)

**Ne taşır:** WhatsApp bot, n8n, Meta display name kuralları, numara tek-kaynağı,
BotZ platformu, cron.

*Bu dosyanın gövdesi `ocak-pilot.md` v52'den **birebir** taşındı (ADIM 3, 6 Ağustos 2026). Hiçbir cümle kısaltılmadı, yeniden yazılmadı. Satır-satır köken izi: `docs/_arsiv/_bolme-haritasi.tsv`.*

---

**Otomasyon:** Google Apps Script (mevcut) → n8n (hedef, Railway'de mevcut).
**AI agent:** WhatsApp bot (Railway, Node.js, Claude'a bağlı). Site'da açık olarak konuşulur — bot olduğunu söyler, kişisel/duygusal konularda bir kız kardeşe pas atar (KARAR 90). **Kayıt lookup canlı (KARAR 251-258):** kayıtlı kişi WhatsApp'tan yazınca kendi Zoom link/şifre/adresini alır (salt-okuma, etiket-değiştirme LLM sırrı görmez). OCAK/GELaiL aynı n8n Code node.

**Meta/WhatsApp:** display name "Ocak Kadın Çemberi" ve "OCAK" denemeleri **reddedildi**; itiraz yolu `business.facebook.com/direct-support` → Appeal Display Name Rejection; itiraz metni hazır (İngilizce, site + Instagram + YAP Eğitim Danışmanlık kanıtlarıyla), **gönderildiği teyit edilmedi**. Kural: display name URL formatında olamaz; ekstra kelime yalnız ülke/bölge, departman/fonksiyon, Test/Demo; all-caps ancak dış marka all-caps ise. Sertifika kaydı tamamlanmadan ad denemesi sınırsız, kayıt sonrası 30 gün arayla.

**WhatsApp:** site geneli numara `905325555226` → `905322080888` (`0f77218`); bot tarafı (n8n `OCAK · WhatsApp` webhook `/ocak-wa` + Meta Cloud API) bu commit'le **değişmedi** — bağlama sırası Kaan'da.
**n8n:** "OCAK Gecelik Rebuild" (id `BlS7CuDb7Mbktq0k`) Schedule Trigger cron `0 3 * * *` → `0 0 0 * * *` (6-haneli), timezone `Europe/Istanbul`. Deploy hook `tZR9LcwJq9` (adı `notion-content-update`), URL `https://api.vercel.com/v1/integrations/deploy/prj_CxW3Nm85TGzdrZdePCk74WLAv23f/tZR9LcwJq9`, **hook branch = `astro-iskelet`** (değiştirilmedi; Notion webhook + gece cron aynı hook'u paylaşıyor → içerik önce preview'de görülür, elle main'e merge → canlı).

**Bot lookup (n8n):** OCAK Code node'a kayıt lookup katmanı — telefon `slice(-10)` → Kayıtlar `phone_number ends_with` (`Ödendi`/`Bedava`) → `Etkinlikler` relation → event hücresi (`Katılım Linki`/`Zoom Şifresi`/`Konum Detay`). Salt-okuma. Güvenlik: `etkinlikDetayMap` sırsız etiket → LLM `<detay etkinlik="KEY">` → kod verbatim değiştirir; `replyForUser` (gerçek) vs `replyForHistory` (placeholder, Postgres). Tüm OCAK eklemeleri `if(proje==='OCAK')` guard'lı (GELaiL bit-bit korunur). Model dalı `proje==='OCAK' ? 'claude-sonnet-4-6' : haiku` (KARAR 257, **henüz uygulanmadı**). Prompt sayfası ("Bot | Ocak") statik / Code node dinamik. BotZ integration Kayıtlar+Başvurular'a connect edildi. Bot Etkinlikler ID = ana Etkinlikler ID (tek DB). **AÇIK BORÇ:** n8n Code node'da 4 canlı secret açıkta (Notion/Anthropic/Meta/Resend) — rotate (Kaan). Çıktılar: `ocak-bot-code-node-v2.js`, `ocak-bot-prompt-yapisi.md`, ilgili discovery/build brief'leri.

- **WhatsApp tek-kaynak:** `src/lib/api.ts → WHATSAPP_URL = 'https://wa.me/15551911472'` (Meta TEST hattı — borç). Floating buton + Kanallar + Footer üçü import eder, gömme yasak. wa.me uluslararası format kuralı (ülke kodu + baştaki 0 düşer).
- **BotZ bot platformu (n8n + Notion, GitHub'dan ayrı):** n8n "Ocak ai Bot" workflow tek Code node — Notion'dan telefon→profil → prompt sayfası → Etkinlikler+SSS DB (OCAK) → Claude (prompt caching ephemeral + hata yakalama + Meta status filtresi). BotZ integration `[TOKEN — n8n credential store, dokümanda tutulmaz]`. BotZ DB `373b61ebfa8780cabdedc0f4154c1fd3`, OCAK Prompt Page `373b61ebfa87803da74cc2834246a0a3`, Bot Etkinlikler DB `365b61ebfa8780db9477c8966c23bf11`, Bot SSS DB `373b61ebfa87808b8736d188e00a3c51`. Yeni bot = Notion'da 1 satır + 1 sayfa, kod değişikliği yok. GELaiL ürünleri Postgres'te kalacak (sonraki seans).

---

*Aşağıdaki gövde `ocak-referans.md` v46'dan **birebir** taşındı (B32, 7 Ağustos 2026).
Hiçbir cümle kısaltılmadı, yeniden yazılmadı. Satır-satır köken izi:
`docs/_arsiv/_bolme-haritasi-referans.tsv`.*

---

## A.18 — OTOMASYON MİMARİSİ (KARAR 56)

OCAK'ın altyapısı **"human led, agent operated"** prensibi üzerine kuruluyor. Veri tek merkezde, otomasyon görsel ve sürdürülebilir, AI agent katmanı veriye bağlı.

### Mevcut Durum (Mayıs 2026)

- WhatsApp bot çalışıyor (Railway'de host edilen Node.js servis, Claude'a bağlı)
- n8n Railway'de self-host olarak dönüyor
- Tally → Apps Script → (Zoom + Google Sheets + MailerLite) akışı çalışıyor
- ocak.biz site Vercel'de canlı

### Hedef Altyapı

| Katman | Araç | Görev |
|---|---|---|
| **Veri** | **Notion** | Kadınlar, Etkinlikler, Kayıtlar, Geri Bildirimler, Knowledge, Konuşmalar, Kararlar database'leri. Tek doğruluk kaynağı. |
| **Otomasyon motoru** | **n8n** (Railway) | Tüm akışlar görsel, drag-drop. Apps Script emekliye ayrılacak. |
| **AI agent** | **WhatsApp bot** (mevcut) + Notion'dan canlı okuma | Bot Notion Knowledge database'inden ve kullanıcının kendi sayfasından okuyarak kişiselleştirilmiş cevap üretir. Yıl 2+ "uygun davet" agent'ı. |
| **Form** | **Tally** | Site kayıtları, başvurular, anketler. Notion'a otomatik yazıyor. |
| **Email** | **MailerLite** | Custom field'lı template'ler (zoom_link, event_title, event_date). İşçilik sıfır. |
| **Toplantı** | **Zoom API** | Etkinlik Notion'a eklendiğinde otomatik oda açma, link Notion'a geri yazma. |
| **AI toplantı eşliği** | **Fireflies / Otter** (Yıl 2) | Sadece operasyonel toplantılar (ekip, başvuru görüşmesi, geri bildirim). Çember ve ritüel asla. |
| **Hesap-kitap** | **Excel / Google Sheets** | Bütçe, fiyatlandırma, kâr-zarar. Notion bunu yapmaz. |

### Bot Eğitimi Modeli

Bot statik prompt değil, **Notion'dan canlı okur.** Bilgi değişikliği = Notion sayfası düzenleme. Kod açmaya gerek yok. Advaita da bot'u eğitebilir (Notion yazımı ile). Bu OCAK'ın "human led, agent operated" felsefesinin tam karşılığı.

### Veri Tek Merkezde

Çember tarihi Notion'da → site Notion'dan çekiyor → bot Notion'dan okuyor → mail Notion'dan tetikleniyor. Bir yeri değiştirdiğinde her yer aynı anda güncel. Senkron problemi yok.

### Site İçerik Altyapısı (Yıl 1 sonu / Yıl 2)

Etkinlik takvimi + blog yazıları + SSS Notion'dan API ile çekilip OCAK tasarımında render edilir. Notion gizli kalır, kadın sadece OCAK sitesini görür. Notion'un native render'ı kullanılmaz — sadece veri kaynağı olarak çalışır.

### Apps Script Geçişi

Mevcut mantık (Tally → Zoom + Sheets + MailerLite) n8n'e taşınır. 2-3 saatlik bir kerelik iş. Sonrasında her şey n8n görsel akışında. Apps Script kapatılmaz, paralel çalışır, test edildikten sonra emekliye ayrılır.

### Site Bittikten Sonra Yapılacak İş Sırası

1. Notion iskelet kurulumu (Etkinlikler, Kadınlar, Kayıtlar, Knowledge, Konuşmalar database'leri)
2. Apps Script mantığını n8n'e taşıma
3. WhatsApp bot'u Notion'dan canlı okumaya bağlama
4. Mevcut Sheets verilerini Notion'a import

Toplam tahmini: 5-7 saatlik iş, dağıtık.

### MailerLite Custom Field Detayı

Şu an mevcut akışta MailerLite mail template'inde Zoom linki sabit yazıyor — her etkinlik için elle güncelleniyor (yüksek işçilik). Çözüm: MailerLite'a "zoom_link", "event_title", "event_date" custom field'ları eklemek, template'te `{{zoom_link}}` placeholder kullanmak, Apps Script (sonra n8n) abone eklerken bu field'ları doldurmak. Bir kez kuruldu mu, MailerLite tarafındaki işçilik sıfıra düşer.

> ⚠ **Yukarısı PLANDI, gerçekleşen hâli aşağıdadır.** Plan üç alan öngörmüştü
> (`zoom_link`, `event_title`, `event_date`); `event_title` ve `event_date`
> **hiç var olmadı** — isimler Türkçeleşti ve alan sayısı on ikiye çıktı. Plan
> cümlesi tarihsel kayıt olarak duruyor, silinmedi (KARAR 61).

#### Alan envanteri — ON İKİ ALAN (ölçüm 18 Ağustos 2026)

Kaynak: `src/lib/kayit.ts:243-310` (`MailerLiteFieldGirdi` + `MAILERLITE_ALANLAR:271`
+ `mailerLiteCustomFields`), URL helper `src/lib/kayit.ts:354`, çağrı yeri
`src/pages/api/kayit.ts:652`, saat eşlemesi `src/pages/api/kayit.ts:172`. Ölçüm
helper'ın dört senaryoda çalıştırılmasıyla alındı, koddan çıkarımla değil. Satır
numaraları kayarsa `MAILERLITE_ALANLAR` dizisi tek kaynaktır — envanter ondan doğrulanır.

Dördü bu turda eklendi — `referans_no` · `odeme_durumu` · `etkinlik_basligi` ·
`etkinlik_url`.
MailerLite panelinde TEXT olarak **açık, 18 Ağu teyitli**. Panelde olmayan bir alan
sessizce yutulur (hata dönmez), o yüzden kod tarafı ile panel tarafı birlikte
denetlenir.

**Her kayıtta on ikisinin hepsi yazılır.** Geçersiz olan **boş string** ile gider,
atlanmaz — atlanırsa MailerLite subscriber'da önceki kayıttan kalan değer
yerinde kalıyor ve mail geçen ayın linkini gösterebiliyordu.

> **Bu cümle 19 Ağustos 2026'ya kadar DOĞRU DEĞİLDİ — ölçüm kapsamı eksikti.**
> Yukarıdaki matris `mailerLiteCustomFields` çıktısına karşı ölçülmüştü; helper
> gerçekten on iki alanı boş string ile üretiyordu. Ama taşıma katmanı
> (`mailerLiteEkle`, `api/kayit.ts:386`) `if (v && v.trim())` ile boş alanı
> payload'dan **düşürüyordu** — yani MailerLite'a hiç gitmiyordu ve tarif edilen
> hata aynen sürüyordu. Tele giden alan sayısı senaryoya göre **7–10**'du,
> 12 değil.
>
> Canlı vaka (19 Ağustos): Notion `Slug`'ı boş "Konuk Ateşi" kaydında
> `etkinlik_url` iki kayıt önceki `…/etkinlik/ekmeden-once` değerinde kaldı —
> mail doğru buluşmayı yazıp yanlış sayfaya götürdü. Ödeme kapısı da aynı
> mekanikle deliniyordu: ücretli kayıtta boşlanan `zoom_link` gönderilmediği
> için önceki kayıttan kalan link yerinde kalıyordu (kapı yalnız **ilk kez**
> kayıt olan kadında kapanıyordu).
>
> Filtre kaldırıldı; payload kurulumu `mailerLiteFieldsPayload`
> (`lib/kayit.ts`) ile lib'e alındı ve **taşıma katmanı test edildi** — daha
> önce hiç testi yoktu, filtre bu yüzden commit'ten commit'e sağ kalmıştı.
> Düzeltme sonrası ölçüm: dört senaryonun dördünde de **12/12 alan tele
> çıkıyor, düşen 0** (`dist/` çıktısına karşı, `.vercel/output/_functions`).
> `name` bu kuraldan muaftır — custom field değil, subscriber'ın kendi adı.
>
> Cümle silinmedi (KARAR 61); artık doğru olduğu için yerinde duruyor, bu not
> ne zamandan beri doğru olduğunu kayda geçiriyor.

**Aynı filtre `src/lib/forms-backend.ts:43`'te DURUYOR — bilinçli.** O yüzey
(`/api/form`: ates-mektuplari · anadolu-basvuru) etkinlik alanı taşımıyor,
bayatlama sorunu yok; ayrıca orada `name` filtrenin **içinden** geçiyor
(`fields: { name, phone }`), kaldırmak isim boşken `name: ""` göndermek olurdu.
Ayrı bir iş — bkz. borç kaydı.

| alan | online · ödeme yok | online · ödeme var | fiziksel · ödeme yok | fiziksel · ödeme var |
|---|---|---|---|---|
| `etkinlik_adi` | dolu | dolu | dolu | dolu |
| `etkinlik_basligi` | dolu | dolu | dolu | dolu |
| `etkinlik_url` | dolu | dolu | dolu | dolu |
| `etkinlik_tarihi` | dolu | dolu | dolu | dolu |
| `etkinlik_saati` | dolu | dolu | dolu | dolu |
| `katilim_linki` | **dolu** | boş | boş | boş |
| `zoom_link` | **dolu** | boş | boş | boş |
| `zoom_sifresi` | **dolu** | boş | boş | boş |
| `etkinlik_mekan` | boş | boş | **dolu** | **dolu** |
| `etkinlik_adres` | boş | boş | **dolu** | boş |
| `referans_no` | dolu | dolu | dolu | dolu |
| `odeme_durumu` | `muaf` | `bekliyor` | `muaf` | `bekliyor` |

**Ödeme kapısı.** `odemeGerekli === true` iken katılım alanları boş gider:
`katilim_linki` · `zoom_link` · `zoom_sifresi` · `etkinlik_adres`.
`etkinlik_mekan` kapıya tabi değildir — şehir adı gizli bilgi değil, gizlenen
kapı numarasıdır. Ayırıcı **yalnız** `odemeGerekli` (`hesap.toplam > 0`);
format bazlı varsayım yapılmaz, Açık Kapı da ücretli olabilir. Havale de
kapalıdır (para kayıttan günler sonra gelir, hiç gelmeyebilir) — KARAR 220'nin
success ekranına verdiği kural maile de uygulanır, iki yüzey tek kural.

**Değerlerin kaynağı** — on iki alan, **on bir satır**: `katilim_linki` ile `zoom_link`
aynı Notion alanından beslendiği için tek satırda birleşti. Satır sayısı alan
sayısıyla kasten eşit değil.

| alan | nereden |
|---|---|
| `etkinlik_adi` | **KODDAN ÜRETİLİR** — `FORMAT_TIP[format] + " — " + seciliTarih` (örn. `"Çember — 10 Eylül 2026 · 20:00"`). Notion `Başlık` DEĞİL. |
| `etkinlik_url` | `etkinlikUrlFormatla(Notion Slug)` → `https://www.ocak.biz/etkinlik/{slug}`. Taban `astro.config.mjs` `site` ile aynı; `publicOrigin(request)` **bilerek kullanılmadı** — preview deploy'dan gelen kayıt maile ölü bir preview URL'i yazardı. Slug boşsa **boş string** (kırık taban URL üretilmez). |
| `etkinlik_basligi` | Notion `Başlık` title property — buluşmanın kendi adı (örn. `"Elin Neyle Dolu?"`). `etkinlik_adi` ile **ayrı yaşar**, şablonda ayrı iş yapar. Kapıya tabi değil. |
| `etkinlik_tarihi` | form dropdown etiketi (`formatEtkinlikTarihi`, saati **içerir**); yedek yol `tarihTrFormat(Tarih)` — o saatsizdir |
| `etkinlik_saati` | online → Notion `Zoom Başlangıç Saati` · fiziksel → Notion `Saat`. Mekâna bağlı, cross-fallback yok. Normalize edilmez: fiziksel aralık (`20:00-23:00`) aralık olarak gider. |
| `katilim_linki` · `zoom_link` | ikisi de Notion `Katılım Linki` (aynı değer; `katilim_linki` C-1 geriye uyum) |
| `zoom_sifresi` | Notion `Zoom Şifresi` |
| `etkinlik_mekan` | Notion `Mekân/Platform` select |
| `etkinlik_adres` | Notion `Konum Detay` |
| `referans_no` | kayıt anında üretilen `OCAK-XXXXX` — havale açıklamasının eşleştirme anahtarı |
| `odeme_durumu` | türetilir: `odemeGerekli ? 'bekliyor' : 'muaf'`. Üçüncü değer `alindi` **kod tarafından hiç yazılmaz** — n8n işi (Notion `Ödeme Durumu` değişiminde). |

**Şablon tuzağı:** `etkinlik_tarihi` normal akışta saati zaten içerir
(`"21 Haziran 2026 · 20:00"`). `{$etkinlik_tarihi}` ile `{$etkinlik_saati}`
yan yana yazılırsa saat iki kez basılır. Kod sorunu değil, şablon sorunudur;
bilinçli olarak düzeltilmedi.

⚠ **`etkinlik_url` yayın gecikmesi taşır.** Detay sayfası ancak production build
Notion kaydını gördükten sonra doğar (n8n gecelik rebuild `0 0 0 * * *`, deploy hook
`astro-iskelet` dalına bakar). Yeni etkinlik açılan gün, rebuild'den önce kayıt
gelirse mail o an henüz var olmayan bir sayfaya bakar.

*Kanıt notu: 18 Ağu ilk ölçümde dört slug 404 dönüyordu; aynı gün ikinci ölçümde
altısı da **200**. Fark www değil **zaman** — arada production rebuild geçti.
Yani mekanizma gerçek, ama 404 penceresi rebuild aralığı kadar dar. Kalıcı bir
kırıklık değil, zamanlama riski.*

**Kanonik adres www'lu.** Köksüz `ocak.biz` **307** ile `www.ocak.biz`'e dönüyor;
`etkinlik_url` doğrudan kanoniği yazar ki mailde fazladan atlama olmasın.
`astro.config.mjs` `site` de www'ye hizalandı (18 Ağu) — canonical, `og:url`,
`og:image` ve sitemap hepsi oradan türüyor.

**Kapsam dışı:** `katilimTipiCoz` bilinmeyen/boş `Mekân/Platform` değerinde
`link`'e düşer — fiziksel bir etkinlikte mekân boşsa adres alanları hiç gitmez
(B62).

---

## A.19 — VERİ ETİK ÇERÇEVESİ (KARAR 57)

OCAK'ın çekirdek vaadi ("kadını kendine geri vermek") veri pratiğine de uygulanır. Teknoloji ne kadar güçlü olursa olsun, etik sınırlar baskındır.

**İlke 1 — Çember Kutsal.** Hiçbir çember, mevsim seremonisi veya retreat ritüel kısmı AI eşliği ile kaydedilmez. Talking stick'in döndüğü hiçbir alanda Fireflies, Otter, Zoom AI veya başka bir transkript aracı bulunmaz. Manuel not da Advaita'nın inisiyatifindedir, AI bot değil.

**İlke 2 — Operasyonel ≠ Ritüel.** İç ekip toplantıları, planlama görüşmeleri, fasilitatör brief'leri, yolculuk başvuru görüşmeleri, geri bildirim sohbetleri — bunlar **iş alanı**, AI eşliği uygundur. Kadına açık söylenir.

**İlke 3 — Şeffaflık Zorunlu.** Her AI-kayıtlı oturumun başında (veya kayıt formunda) açıkça yazılır: "Bu görüşme kayda alınır, AI ile özetlenir, sizin dosyanıza eklenir. Onaylamıyorsanız söyleyin, AI bot kullanılmaz." Sessiz kayıt yok.

**İlke 4 — Veri Kadının.** Kadın "benimle ilgili her şeyi sil" derse, Notion sayfası temizlenir. GDPR uyumlu. Ayrılan kadın gönül rahatlığıyla ayrılır. Bu KÖZ alumni anlayışına dahil.

**İlke 5 — "Akıllı Davet" ≠ "Satış Önerisi".** AI agent'tan çıkan içsel sinyal "lead score" değil, "bu kadın için bu etkinlik denk düşebilir mi" şeklinde kurulur. Davet metni Advaita'nın sesinden olur — pazarlama jargonundan değil. **Davet ≠ satış.** OCAK kadına teklif sunar, ürün satmaz. Backend mantığı bile bu dili kullanmaz — "conversion," "lead," "funnel" terimleri OCAK iç sistemine girmez.

### Bot Davranış Kuralları

- Bot kendini gizlemez (kadın bot olduğunu bilir)
- Bot fiyatlandırma + format + zaman bilgisi verir, derin duygusal kriz anında "Advaita'ya bağlıyorum" diyerek pas atar
- Bot ısrarcı satış yapmaz, davet eder ve çekilir
- Bot mesajları Notion'a yazılır, kadın silme talep ederse silinir

---

- **Email:** MailerLite (entegre, çalışıyor). Token JWT formatında, frontend'den çağrılıyor (proxy yok, KARAR 56'da kabul edilmiş risk). Token sub: 2363948, expiry 2126 yılı (rapor güncel değildi — eski hesap iddiası yanlıştı)
- **MailerLite grupları:** Ateş Mektupları `187372384318130052` (index.html), Çember başvurusu `187798293576681151` (basvuru.html), Açık Kapı `187372390149261252` (Apps Script içinde)
- **Toplantı:** Zoom Server-to-Server OAuth (kullanıcı login akışı yok, Apps Script'ten token alır). Açık Kapı için her form submit'inde yeni toplantı oluşturulur, link response'ta dönülür
- **AI agent:** WhatsApp bot (Railway'de Node.js, Claude'a bağlı). Mimari: WhatsApp → Meta Cloud API → n8n → Claude API → Meta → WhatsApp. System User permanent token (süresiz). Phone Number ID: 944237102114692. n8n webhook: `n8n-production-57a6.up.railway.app/webhook/whatsapp-meta`
### 12–20 Temmuz 2026 eklemesi — Meta / WhatsApp display name (KARAR 410)

**Durum:** "Ocak Kadın Çemberi" Meta tarafından **reddedildi**; "OCAK" denemesi de red aldı. İtiraz yolu belirlendi ve metin hazırlandı; **gönderildiği teyit edilmedi.**

**Meta Display Name Guidelines (dokümandan okunarak çıkarılan kurallar):**
- Display name **URL formatında olamaz** ("FreshProduce.com" reddedilir) → "Ocak.biz" adayı bu kuralla elendi.
- Dış markayla **tutarlı** olmalı.
- Ekstra kelime yalnız **ülke/bölge**, **departman/fonksiyon**, **Test/Demo** için eklenebilir → "Kadın Çemberi" bu istisnalara girmiyor, red sebebi budur.
- All-caps ancak işletme zaten all-caps markalaşıyorsa kabul edilir ("unless the business already brands using all caps").

**Aday sırası:** Ana aday **"OCAK"** (all-caps istisnası site + Instagram `@ocak.biz` kanıtıyla karşılanıyor). Plan B: **"OCAK Türkiye"** (bölge eki kural içi). Plan C: "OCAK by YAP Eğitim".

**İtiraz kanalı:** `business.facebook.com/direct-support` → *Appeal Display Name Rejection*. **Ön koşullar:** Business Portfolio'da website alanı `https://www.ocak.biz`, business verification tamam, **/hakkimizda'da YAP Eğitim Danışmanlık'ın açıkça anılması** (legal name ↔ marka köprüsü). İtiraz metni İngilizce hazırlandı (site + Instagram + YAP Eğitim Danışmanlık kanıtlarıyla).

**Zamanlama kuralı:** Sertifika kaydı tamamlanmadan ad denemeleri **sınırsız**; kayıt sonrası değişiklikler **30 gün arayla**.

### 12–19 Temmuz 2026 eklemesi — WhatsApp stratejik konumlama çerçevesi (KARAR 447; PARTİ 3/3)

**Çerçeve: "Push'u hizmete, pull'u pazarlamaya ver."**

| Amaç | Kanal | Gerekçe |
|---|---|---|
| **Duyuru** | WhatsApp **Kanalı** | Kadın kendi gelir (pull), onay gerekmez, numara mahremiyetiyle uyumlu, maliyet sıfır |
| **Hatırlatma** | API **utility template** | Kadın istedi → hizmettir (push meşru). TR ~$0,0053/mesaj, ~$1/ay ölçek |
| **Genel duyuru API push** | **YAPILMAZ** | Kanal ikame eder; pazarlama push'u ilkeye aykırı |
| **Grup** | **broadcast için asla** | Numara mahremiyeti |

**Email ölmez:** "mektup" ritüeli kalır; WA kiralık arazidir, asıl taban kayıtlardadır. **Site konumlama:** "Ateşin yanında kal" ikili bloğu — *Mektup* (e-posta) / *Kıvılcım* (Kanal); "Kıvılcım" **çalışma başlığıdır**, ad kararı açık. **Havuç:** ilk duyuru hakkı + eve götürülen hediye (v2, Advaita insan-sesli kayıt).

**Maliyet gerçekleri (web doğrulamalı, Meta rate card):** utility TR ~$0,0053/mesaj · marketing ~$0,0109/mesaj · **1 Ekim 2026'dan itibaren açık-pencere utility mesajları da ücretlenecek** — ücretsiz servis penceresi varsayımı o tarihten sonra geçersizdir.

**Teknik kimlikler:** Phone Number ID `1213774115148936` · WABA ID `1052764880644336` · App ID `861407993595884` · Business Portfolio ID `1093875949538755`. Subscribe webhooks **WABA-seviyesi** olay aboneliğidir; yeni numara migrasyonunda `phone_number_id` ayrımı gerekir (fiilen açıldığı teyit edilmedi).

⚠ **Display name düzeltmesi.** Bu turun dumpı "Ocak Kadın Çemberi Meta'da onaylandı, numara Registered" der. **Bu beyan geçersizdir:** KARAR 410 (16–18 Tem, daha yeni) "Ocak Kadın Çemberi" ve "Ocak.biz" adaylarının reddedildiğini, ana adayın **"OCAK"** olduğunu ve itirazın hazırlandığını kayda geçirmiştir (yukarıdaki A.24 eklemesi). Sonraki gerçeklik kazanır (KARAR 102).

**Açık:** 5 WA kararı ayrı sohbette bekliyor (Kanal aç / blok / checkbox / hediye / "Kıvılcım" adı); devir dosyası `wa-strateji-devir-2026-07-12.md` hazır.

