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
