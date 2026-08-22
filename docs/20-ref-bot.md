# OCAK — BOT & OTOMASYON (20-ref)

**Ne taşır:** WhatsApp bot mimarisi, n8n workflow'ları, Postgres tabloları,
güvenlik zinciri, kill switch, devir sistemi, Meta/numara kuralları, cron.

*Bu dosya 22 Ağustos 2026'da **baştan yazıldı**. Önceki gövde (`ocak-pilot.md` v52 +
`ocak-referans.md` v46 taşımaları) 13–14 Temmuz rebuild'inden önceki mimariyi
anlatıyordu ve altı hafta boyunca gerçeği yansıtmadı. Eski gövde
`docs/_arsiv/20-ref-bot-2026-08-06.md` olarak saklandı.*

---

## 0 · İLKE — bu dosya neden baştan yazıldı

13–14 Temmuz'da bot sıfırdan yeniden kuruldu: üç workflow, beş Postgres tablosu,
router, kill switch, iki bloklu cache. **Bu rebuild korpusa hiç yazılmadı.**
21 Ağustos turunda `docs_ara` üç anahtar sözcük için sıfır sonuç döndü:
`ocak_konusma` · `kill switch` · `devir maili`.

Sonuç: 21 Ağustos'ta teşhise başlarken elimizdeki tek belge yanlıştı.

**Kural:** botun mimarisi değiştiğinde bu dosya aynı turda güncellenir.
Ürün kuyruğu (`03-sira.md`) ayrı; bu dosya *neyin nasıl çalıştığını* taşır.

---

## 1 · ÜÇ ÇARK — farklı hızlarda dönen üç mekanizma

Bot tek bir şey değil. Üç ayrı çark var ve karıştırılırsa teşhis yanlış çıkar.

### Çark 1 — Bilgi · 15 dakika
`OCAK · Bağlam` (id `HbvV4uXXPIAgOtXK`) Notion'dan dört kaynağı çekip
Postgres'e yazar. Aynı turda Instagram token'ını da tazeler.

| Notion kaynağı | Postgres hedefi | LLM görür mü |
|---|---|---|
| `Bot \| Prompt` sayfası | `ocak_baglam.prompt` | ✅ |
| `Bot \| OCAK Özeti` sayfası | `ocak_baglam.ozet` | ✅ |
| `Etkinlikler` DB (yayında + gelecek) | `ocak_baglam.etkinlikler` | ✅ sırsız liste |
| `SSS` DB (Aktif) | `ocak_baglam.sss` | ✅ |
| Katılım Linki · Zoom Şifresi · Konum Detay | `ocak_etkinlik_detay` | ❌ **asla** |

**Bot Notion'u hiç görmez.** Yalnız bu çarkın bıraktığı izi okur.
*Bot ne biliyorsa en fazla 15 dakika önceki Notion'dur.*

### Çark 2 — Konuşma · mesaj başına
Kadın yazar → Meta webhook → `WhatsApp BotZ` (router) → `OCAK · WhatsApp`
(id `go2MLHs8IAD3V8xE`). Sekiz durak, ~5–9 saniye.

```
Webhook → Secrets → Filtre → Bağlam Oku → Geçmiş Oku → Detay Oku
  → Kayıt Lookup → Admin Komut → Cevap Üret → Admin Yaz → WA Gönder
  → Geçmiş Yaz → Token Yaz → Devir Mail
```

### Çark 3 — Yayın · gecelik
`OCAK · Gecelik Rebuild` (id `BlS7CuDb7Mbktq0k`) her gece Vercel deploy
hook'unu tetikler. Bot kanalına dokunmaz, aynı Notion'u besler.

---

## 2 · DÖRT KAPI — tek ilkenin dört yüzü

Tasarımın çekirdeği: **derin olan hiçbir şey buradan geçmez.**

| kapı | ne yapar | mekanizma |
|---|---|---|
| **Sır** | Link/şifre/adres LLM'e hiç gitmez | Ayrı tablo → LLM etiket yazar → kod değeri koyar |
| **Ödeme** | Parası gelmemiş kadın detay alamaz | Notion filtresi: `Ödendi` ∨ `Bedava` |
| **Kanal** | Instagram'da kimlik doğrulanamaz | IG'de `<detay>` yok, WhatsApp'a davet |
| **İnsan** | Duygusal/kriz devredilir | `<devir tur="X">` → Resend + (kriz) WhatsApp |

**Dördü de 21 Ağustos 2026'da gerçek veriyle sınandı ve doğru davrandı.**
X1 borcu kapandı — Temmuz'dan beri açıktı, sınanamamıştı çünkü Notion
`Kayıtlar` DB'si boştu.

### Sır zinciri — kanıtlanmış akış
```
Kişinin kayıtları (Notion, canlı sorgu)
   ↓  sadece Ödendi/Bedava, sadece kendi kayıtları
sırsız etiket listesi → LLM'e:  "e1 = Bir Eşikte Duruyorsun · 2026-08-31"
   ↓
LLM cevabına yazar:  <detay etkinlik="e1">
   ↓
Cevap Üret kodu değiştirir: Postgres'ten birebir link + şifre
   ↓
Kullanıcıya:  gerçek değer
Postgres'e:   [katılım detayı paylaşıldı]  (verilemediyse "verilemedi")
```

**Üç katman:** yalnız kişinin **kendi entitled** kayıtları haritaya girer ·
genel etkinlik listesi şifresizdir · kayıtlı olunmayan etkinliğin anahtarı
haritada yoktur → kod boş bulur → "göremedim".

**Sonuç:** LLM sırrı hiç görmez. Halüsinasyon yapsa bile şifreyi uyduramaz.

### Yeterlilik kuralı (22 Ağu)
`Cevap Üret` artık "hiç bilgi yok mu" değil, **"işe yarar bilgi var mı"** diye
sorar. Online buluşmada `Katılım Linki` yoksa `Konum Detay = "Zoom"` tek başına
yeterli sayılmaz — yedek metne düşer ve **`operasyonel` devir tetiklenir.**
Kadın yarım cevapla bırakılmaz, kimse sessiz kalmaz.

---

## 3 · POSTGRES — beş tablo

Railway `Ocak Bot` projesi, servis `Postgres`, veritabanı `railway`.

| tablo | ne tutar | not |
|---|---|---|
| `ocak_konusma` | tüm konuşmalar, **sırsız** | zaman sütunu `zaman` (`olusturuldu` değil) |
| `ocak_baglam` | prompt · ozet · etkinlikler · sss | `guncelleme` damgalı |
| `ocak_etkinlik_detay` | link · şifre · konum | **LLM'e gitmez**, budanır |
| `ocak_token_log` | kanal · model · token sayaçları | maliyet ölçümü |
| `ocak_gizli` | bayraklar + secret'lar | `wa_aktif` · `ig_aktif` · `ig_token` · `bakim_mesaji` · `admin_numaralar` · `gecmis_saat` |

**Railway Data paneli kuralı:** çok cümleli sorguda yanlış sonucu gösterebilir.
21 Ağustos'ta 122 satırlık tabloda `GROUP BY` "0 rows" döndü.
**Tek seferde tek cümle.**

### Detay budaması (22 Ağu)
`ocak_etkinlik_detay` hiç silmiyordu: 40 satır ↔ 15 yayında etkinlik.
25 ölü satır, içlerinde geçmiş çemberlerin Zoom şifreleri.

`Detay Buda` node'u — **`Detay Yaz`'ın arkasına**, `Execute Once: ON`:
```sql
DELETE FROM ocak_etkinlik_detay WHERE guncelleme < now() - interval '1 hour';
```

**Neden `guncelleme` ölçütü:** `Bağlam Üret` her turda canlı etkinlikleri
yeniden yazar ve damgayı tazeler. Damgası eskimiş satır = Notion'da artık yok.
Geçmiş etkinlik de, Notion'dan silinmiş etkinlik de aynı testten geçer —
`tarih < current_date` ikincisini yakalamıyordu.

**Neden `Detay Yaz`'ın arkasına:** Notion bir gün yine 401 verirse
`Bağlam Üret` throw eder, yazım olmaz, hiçbir damga tazelenmez. Budama
`Schedule Trigger`'a bağlı olsaydı **tabloyu komple silerdi.**
Zincir kopar, tablo korunur.

Doğrulandı: 40 → 15.

---

## 4 · SECRET DÜZENİ — tek kaynak Railway env

**22 Ağustos'a kadar** dört secret üç workflow'da düz metin `Secrets` node'unda
duruyordu. Aynı Anthropic anahtarı **üç** yerde. Bu, 6 Ağustos'taki 15 günlük
arızanın kökeniydi: Notion token'ı rotate edildi, n8n güncellenmedi.

**Bugünkü düzen:** tüm secret'lar Railway env'de, kod `$env` okur.

| değişken | kim okur |
|---|---|
| `OCAK_NOTION_TOKEN` | `Bağlam Üret` · `Kayıt Lookup` |
| `NOTION_TOKEN` | router `Proje Çöz` (aynı BotZ token'ı) |
| `OCAK_ANTHROPIC_KEY` | `Cevap Üret` · `IG Bot` |
| `OCAK_WA_TOKEN` | `WA Gönder` · kriz WhatsApp |
| `RESEND_API_KEY` | `Devir Mail` · `OCAK · Hata` |
| `OCAK_IG_TOKEN` · `OCAK_IG_USER_ID` | `IG Bot` |
| `OCAK_HATA_MAIL` · `OCAK_DEVIR_MAIL` · `OCAK_KRIZ_MAIL` | alıcılar |
| `OCAK_KRIZ_WA` | kriz WhatsApp hedefleri (virgüllü) |
| `SISTEM_MAIL_FROM` | gönderen adres |

`Secrets` node'ları **boş bırakıldı ama silinmedi** — `Bağlam Üret` son çare
olarak `$('Secrets')` referansı taşıyor, node yoksa referans patlar.

**n8n Variables kullanılamaz:** Community Edition'da `$vars` kilitli.
Railway env tek yol.

**`OCAK_WA_PNID` ölü:** `Filtre` node'u pnid'i webhook'tan okuyor
(`metadata.phone_number_id`), sabit değere gerek yok.

### Notion entegrasyonları
İki ayrı internal integration:
- **BotZ** — bot ağacı: `Bot \| Prompt` · `Bot \| OCAK Özeti` · `SSS` ·
  `Etkinlikler` · `Kayıtlar` · `Başvurular` · `Yaz.Gel.sin.` · `BotZ Access`
- **Ocak Site** — site: `Sayfalar` · `Etkinlikler` · `Kayıtlar` ·
  `xÇember Döngüsü` · `xAtölye`

**Kural: her tüketiciye kendi token'ı.** Site token'ı bota verilmez; yarın
biri rotate edildiğinde diğeri düşmesin.

---

## 5 · SESSİZ KIRILMA — 15 günlük arıza ve dersi

**Olay.** 6 Ağustos 12:00:23'te Notion token'ı rotate edildi, n8n'deki düz
metin kopyalar güncellenmedi. `Bağlam Üret`'in dört `try/catch` bloğu 401
alıp hatayı yuttu, `cikti = []` döndü, `Tur Ayır`'a hiçbir item gitmedi,
`Bağlam Yaz` hiç çalışmadı — **ve n8n her 15 dakikada "Success" yazdı.**

Bot 15 gün boyunca 6 Ağustos'un dünyasında yaşadı: var olmayan etkinliklerin
tarihlerini kadınlara doğru bir tonla söyledi. 19 Ağustos'ta bir kadın
*"Neden güncel değilsin"* ve *"Tarihler bozuk"* yazdı. Haklıydı.

**Ders — patch'e giren cümle:**
> Bayat veri, eksik veriden daha tehlikelidir — çünkü sessizdir.

Yetenek Evreni bu riski öngörmüştü ama yanlış biçimde: *"Notion 404 →
`Bağlam Oku` boş döner → bot bağlamsız konuşur."* Gerçekleşen bu değildi.
`Bağlam Oku` boş dönmedi — Postgres doluydu, sadece bayattı.
**Bağlamsız bot cahildir ve belli olur. Yanlış bağlamlı bot emin görünür.**

### Bugünkü savunma — üç katman

**1 · Sağlık kontrolü.** `Bağlam Üret` sonunda dört anahtarın hepsi
üretilmediyse `throw`. Kısmi yazım yok: biri gelmezse hiçbiri yazılmaz,
eski veri yerinde kalır ve **n8n gerçekten "Failed" der.**

**2 · Hata mesajı sebebi taşır.** `BAĞLAM EKSİK → prompt, ozet, ... ::
prompt: 401 API token is invalid | ...` Log aramaya gerek yok.

**3 · `OCAK · Hata` workflow'u.** Error Trigger → Resend →
`OCAK_HATA_MAIL`. Dört workflow'a bağlı: `Bağlam` · `WhatsApp` · `Instagram` ·
`Gecelik Rebuild`.

### `Bağlam Üret` v2'nin diğer kazanımları
- **Sayfalama.** `page_size=100` sınırında prompt sessizce kırpılıyordu.
  Düzeltince `prompt` 10.577 → **11.003** karakter. Bot altı haftadır kendi
  kurallarının bir kısmını hiç görmemiş.
- **Data-source yedeği.** Önce eski `/v1/databases/{id}/query`, olmazsa yeni
  `/v1/data_sources/{ds}/query`. Notion'un 2025 geçişine dayanıklı.
- Etkinlikler DS: `365b61eb-fa87-808d-84e2-000be0bcbdd5`
- SSS DS: `39cb61eb-fa87-8015-95e4-000b94e3fde5`

---

## 6 · OTURUM SINIRI — kirlenme ve çözümü

**Olay.** 21 Ağustos gecesi bot, kayıtlı bir kadına linki vermeyi reddetti ve
*"sistem bana göstermiyor"* dedi. Veri Postgres'teydi, kural prompt'taydı
(`position('<detay etkinlik' in icerik) = 4988`), ama bot etiketi üretmiyordu.

**Teşhis.** Bot kendi geçmişini örnek alıyordu. Önceki yedi sekiz turda
ısrarla *"linki göremiyorum"* demişti; o cümleler `messages` dizisinde
few-shot örneğe dönüşmüştü. Talimat ne derse desin deseni sürdürüyordu.

`DELETE FROM ocak_konusma WHERE kimlik='...'` sonrası taze sorulduğunda
**doğru cevap verdi.** Teşhis mühürlendi.

**Kritik:** bunu ancak SQL ile çözebildik. Gerçek bir kadın için o düğme yok.

### Çözüm — zaman penceresi
`Geçmiş Oku` artık pencereli:
```sql
AND k.zaman > now() - (COALESCE(
  (SELECT deger FROM ocak_gizli WHERE anahtar = 'gecmis_saat'), '6'
) || ' hours')::interval
```

`gecmis_saat = 6` (`ocak_gizli`, deploy'suz değişir).

**Tek mekanizma üç sorunu kapattı:**
1. Kirlenme — altı saat sessizlik sonrası temiz sayfa
2. Tanıtım tekrarı — `Kayıt Lookup` `ilkTemas` hesaplar, `kisisel` bloğa
   *"Bu ilk temas — kendini tanıt"* ya da *"Devam eden konuşma — TANITMA"* yazar
3. Eski konuşmadan devam — üç ay önce yazan kadın artık sıfırdan başlar

**Yan kazanç:** kısa geçmiş = az token (`kisisel` cache'siz).

**Reddedilen alternatif:** kullanıcı komutu (`YENİDEN`). Kadın kilitlendiğini
fark etmez ki komutu yazsın; komutu duyurmak da prompt'ta kalıcı token yer.

---

## 7 · CACHE DİSİPLİNİ — iki blok, iki maliyet

System prompt iki bloktan oluşur ve **maliyetleri taban tabana zıttır.**

| blok | cache | maliyet | ne konur |
|---|---|---|---|
| `ortak` | ✅ ephemeral 1h TTL | ilk mesajdan sonra ~onda bir | kalıcı kural, üslup, format |
| `kisisel` | ❌ yok | **her mesajda tam ücret** | yalnız kişiye/kanala özel |

**Kural:** kalıcı kural `ortak`'a (yani Notion prompt sayfasına) yazılır.
`kisisel` blok kısa tutulur.

22 Ağustos'ta bu ilke bir kez ihlal edildi: `Kayıt Lookup`'ın `kisisel`
bloğuna ~700 karakter kural yazıldı (mesaj başına ~200 token, kalıcı).
Yarısı zaten kodun çözdüğü şeyi modele tekrar anlatıyordu. **~230 karaktere
indirildi**, kalan tek kural Notion prompt'una taşındı.

**`ortak` bloğu WhatsApp ve Instagram'da BİREBİR AYNI olmalı.** Tek karakter
fark cache paylaşımını kırar, maliyeti ikiye katlar.

### Bugünkü ölçüm
| blok | karakter |
|---|---|
| prompt | 11.003 |
| sss | 6.214 |
| ozet | 1.987 |
| etkinlikler | ~1.300 |
| **toplam `ortak`** | **~20.500** (kabaca 7–8 bin token) |

Yetenek Evreni'ndeki *"3.740 token · mesaj başı ~$0,009"* ölçümü SSS ve Özet
dolmadan yapılmış — **bayat, yaklaşık iki katına çıkmış.** Gerçek ölçüm
`ocak_token_log`'dan yapılacak (61+ tur mevcut).

`max_tokens` 1024 → **600** (22 Ağu). Çıktı tokeni girdiden pahalı, WhatsApp
mesajı zaten kısa olmalı. `IG Bot`'ta hâlâ 1024 — App Review turunda düzeltilecek.

---

## 8 · KANAL BEYANI — asimetri ve düzeltilmesi

**Olay.** Bot WhatsApp'ta kayıtlı bir kadına *"Kayıtlı numaranla WhatsApp
hattımıza yazarsan hemen iletirler"* dedi. Kadın zaten WhatsApp'taydı ve
zaten kayıtlı numaradan yazıyordu.

**Sebep.** Instagram'ın `kisisel` bloğunda açık bir beyan var
(`## BU KANAL INSTAGRAM` + gerekçe + "detay etiketi burada YOK").
WhatsApp'ta kanal hakkında **tek kelime yoktu.** Ortak prompt ikisinde de
aynı ve içinde IG kuralı duruyor → model WhatsApp'ta IG kuralını uyguladı.

**Düzeltme.** `Kayıt Lookup`'ın `kisisel` bloğuna:
> Kanal: WhatsApp. Kişi kayıtlı numarasından yazıyor, kimliği doğrulanmış.
> Onu WhatsApp hattına yönlendirme, zaten burada.

**Genel ders:** modele söylenmesi gereken şey söylenmezse, model çıkarır ve
yanlış çıkarır. Tanıtım tekrarı da aynı sınıftandı.

---

## 9 · TELEFON EŞLEŞMESİ — formattan bağımsız

**Eski:** Notion filtresi `phone_number ends_with: son10`. Ham metin
karşılaştırması — `+90 532 555 03 13` boşluklar yüzünden `5325550313` ile
**bitmiyor**, eşleşmiyordu.

**Risk:** site kayıt anında Notion'a hangi formatta yazıyor bilinmiyordu.
Boşluklu yazıyorsa her gerçek kayıt için lookup sessizce başarısız olurdu.

**Yeni:** telefon filtresi Notion'a **hiç gönderilmiyor.** Ödeme durumu
filtresiyle kayıtlar çekilip JS'te normalize ediliyor:
```js
function son10(t) { return String(t||'').replace(/\D/g,'').slice(-10); }
```
`+90 532 555 03 13` · `0532-555-0313` · `905325550313` — hepsi tutar.
Site formatı değişse de çalışır. Sayfalamalı (`start_cursor`, 20 tur tavanı).

Boşluklu numarayla canlı doğrulandı.

---

## 10 · DEVİR SİSTEMİ

Bot cevabının **sonuna** `<devir tur="X">` yazar; kullanıcı görmez,
`Cevap Üret` ayıklar, `Devir Mail` işler.

| tür | ne zaman | dönüş süresi | alıcı |
|---|---|---|---|
| `kriz` | kendine zarar, güvende hissetmeme | **ŞİMDİ** | `OCAK_KRIZ_MAIL` + `OCAK_KRIZ_WA` |
| `duygusal` | kişisel konu, insan hak eden | bugün içinde | `OCAK_DEVIR_MAIL` |
| `operasyonel` | link gelmedi, kayıt/iptal/iade, bilinmeyen | 48 saat | `OCAK_DEVIR_MAIL` |
| `isbirligi` | basın, mekân, işbirliği | 48 saat | `OCAK_DEVIR_MAIL` |
| `sikayet` | kızgın kişi | bugün içinde | `OCAK_DEVIR_MAIL` |

### Kriz hattı (22 Ağu)
Kriz devrinde **önce WhatsApp**, sonra mail. WhatsApp `OCAK_KRIZ_WA`
listesindeki numaralara gider (virgülle çoğaltılabilir). Bugünkü değer
`905325550313` (Kaan).

**Meta 24 saat penceresi:** hedef numara son 24 saat içinde bota yazmışsa
mesaj iletilir; yazmamışsa Meta reddeder (`131047`). **Mail her hâlükârda
gider** — iki `try/catch` ayrı, biri diğerini engellemez.
Kalıcı çözüm: Meta'da onaylı **utility** şablonu (açık borç).

### Mail tasarımı (22 Ağu)
Düz metinden HTML'e geçildi. Köz rengi `#C44B2F`, kriz `#8F1D14`.
Üstte **ne yapmalı** satırı + dönüş süresi. Tıklanabilir WhatsApp düğmesi,
numara okunabilir formatta (`+90 532 555 03 13`). Konuşma en yeni altta,
kadın/bot renkle ayrılmış, **saat damgalı** (bugünse `14:34`, değilse
`21.08 14:34`). Düz metin sürümü de gönderiliyor.

Saat damgası için `Geçmiş Oku` sorgusuna `zaman` eklendi, `Kayıt Lookup`
`gecmisTam` dizisi üretiyor (LLM'e giden `gecmis` sade kalır).

### Kutu
`admin.ocak.biz@gmail.com` → Gmail yönlendirme → `kaan@ocak.biz`.
Gmail kopyası okundu işaretlenir, arşiv olarak kalır.
**Devir kutusunu Kaan yönetir** — ayrı grup/rol kurulmayacak (22 Ağu kararı).

### Gönderen
`sistem@mail.ocak.biz` (`SISTEM_MAIL_FROM`). Önceki `onboarding@resend.dev`
Resend'in test adresiydi. Alan adı doğrulanmış (`mail.ocak.biz`, eu-west-1).

---

## 11 · KILL SWITCH

Admin WhatsApp'tan yazar, `ocak_gizli` bayrakları çevrilir. Deploy yok, anında.

| komut | etki |
|---|---|
| `BOTZ ON` / `BOTZ OFF` | `wa_aktif` |
| `BOTZ IG ON` / `BOTZ IG OFF` | `ig_aktif` |
| `BOTZ DURUM` | mevcut durumu bildirir |

Kapalıyken herkese `bakim_mesaji` gider, Claude'a hiç gitmez (fatura sıfır),
konuşma yine loglanır. Adminler bypass eder.

**Admin listesi** `ocak_gizli.admin_numaralar`: `905325550313` (Kaan) ·
`905325556284` (Advaita). Ölü kayıt (botun kendi numarası) temizlenmiş.

---

## 12 · ROUTER — GELaiL ilişkisi

Aynı Meta app'inde iki WABA var, callback tek. `WhatsApp BotZ` (GELaiL)
workflow'undaki `Proje Çöz` gelen numarayı Notion `BotZ Access` DB'sinden
(`373b61ebfa8780cabdedc0f4154c1fd3`) çözer, `Proje Switch` OCAK çıkışını
`Execute Sub-workflow` ile devreder. **Router kalıcı.**

**Bağımlılık:** `Proje Çöz` her mesajda 1–2 Notion çağrısı yapıyor,
OCAK'a devretmeden **önce**. Notion yavaşlarsa OCAK da yavaşlar.
`catch` bloğu `proje = 'OCAK'` diyerek düşüşü yumuşatıyor.

*Öneri (uygulanmadı): Notion sorgusu kod içi sabit haritayla değiştirilebilir —
gecikme düşer, bağımlılık kalkar. Kaan onayladı, sıraya alındı.*

Router'da Notion'a giden **tek** node `Proje Çöz`. Diğer altı node Claude,
Meta ve Resend kullanıyor. `GELaiL Notion Senkron` ayrı credential
(`GELaiL Notion`) kullanıyor — OCAK rotate'i onu etkilemez.

---

## 13 · META / NUMARA

**Display name:** `Ocak Kadın Çemberi` **onaylı** (`…5226` hattı, 19 Ağu,
KARAR 519-521). `…0888` hattında `Ocak Kadın Topluluğu` başvurusu beklemede (B104).

**Bot hattı** `905325555226`, pnid dinamik (webhook'tan).

**İki yüzey kuralı (KARAR 518)** korunur: bot hattı (`WHATSAPP_URL` sabiti) ve
yasal telefon (`+90 532 208 0888`, beş yasal sayfada düz metin) **eşitlenmez.**
Numara değişim talimatı hangi yüzeyi hedeflediğini adlandırmak zorundadır.

---

## 14 · INSTAGRAM

Kod tam, workflow **pasif**. İki kat kilit: `ig_aktif=hayir` + workflow pasif.
Dev mode'da webhook gelmiyor — App Review duvarı.

`OCAK · Bağlam` Active kalmalı: IG token'ını 15 günde bir tazeliyor
(60 günlük token → süresiz zincir).

IG'de `<detay>` etiketi yok; LLM üretse bile regex WhatsApp yönlendirmesine
çevirir. Kimlik doğrulanamadığı için bilinçli sınır.

**Şart:** içerik temizliği bitmeden App Review'a girme — screencast'te yarım
ürün ret riski.

**IG hattının eksikleri §16'da ayrı başlık altında.** Özetle: WhatsApp'ta
22 Ağustos'ta çözülen üç şey (oturum sınırı, ilk temas tespiti, `max_tokens`)
IG'ye uygulanmadı, ve **IG'de devir sistemi hiç yok** — duygusal/kriz mesajı
gelirse kimseye haber gitmiyor.

---

## 15 · N8N ORTAMI

Railway, `n8n-production-57a6.up.railway.app`, sürüm **2.34.6**, Community Edition.

| workflow | id | durum |
|---|---|---|
| `OCAK · Bağlam` | `HbvV4uXXPIAgOtXK` | Published |
| `OCAK · WhatsApp` | `go2MLHs8IAD3V8xE` | Published |
| `OCAK · Instagram` | `KUmAqNvN9cofOtTV` | Pasif |
| `OCAK · Gecelik Rebuild` | `BlS7CuDb7Mbktq0k` | Published |
| `OCAK · Hata` | — | Error Trigger |
| `WhatsApp BotZ` (router) | — | Published, GELaiL |
| `ENV Kontrol` (eski `My workflow`) | `9YKvQd0YUTf4EPRl` | manual, teşhis aracı |

**Timezone:** dördü de `Europe/Istanbul` (22 Ağu). Öncesinde varsayılan
`America/New_York` idi — kod içi tarih üretimleri elle korunduğu için
patlamıyordu, ama `$now`/`$today` kullanan ilk satırda sekiz saat kayardı.

**Execution budaması:** `EXECUTIONS_DATA_PRUNE` env'de açık. 61 gerçek tur
panelde 5 görünüyor. **Botun geçmişini n8n'den denetleyemezsin —
tek gerçek kayıt Postgres.** Sohbet paneli borcunun gerekçesi bu.

**Credentials:** `OCAK Postgres` (4 workflow) · `GELaiL Postgres` ·
`GELaiL Notion` · `Meta WhatsApp` (Header Auth, kullanılmıyor) ·
`Claude API Key` (Header Auth, kullanılmıyor).

---

## 15b · NODE ENVANTERİ — ne, neden, kaldırılırsa ne kırılır

### `OCAK · WhatsApp` (15 node)

| node | tip | ayar | ne yapar · neden var |
|---|---|---|---|
| `Webhook` | webhook | | Meta callback girişi. Router devrediyorsa kullanılmaz ama duruyor — doğrudan test için. |
| `When Executed by Another Workflow` | executeWorkflowTrigger | | **Asıl giriş.** Router `Execute Sub-workflow` ile buradan çağırır. |
| `Secrets` | set | | **Boş.** Silinmez: `Bağlam Üret` yedek referans taşıyor, node yoksa referans patlar. |
| `Filtre` | code | | Metin dışı mesajları (foto/ses/konum/reaction/echo) eler. `kimlik`, `nat10`, `pnid` üretir. **pnid webhook'tan gelir** — sabit değer yok. |
| `Bağlam Oku` | postgres | AlwaysOut | `ocak_baglam` + `ocak_gizli` tek haritada. ⚠️ İki tablo `UNION ALL` — `ocak_gizli`'ye `prompt`/`ozet`/`etkinlikler`/`sss` adlı anahtar girerse **secret prompt'a sızar.** Ad çakışması yasak. |
| `Geçmiş Oku` | postgres | ExecOnce · AlwaysOut | Son 20 mesaj, **6 saatlik pencere** (`ocak_gizli.gecmis_saat`). ExecOnce olmazsa item çarpımı. |
| `Detay Oku` | postgres | ExecOnce · AlwaysOut | `ocak_etkinlik_detay` tamamı. Sır burada, LLM'e gitmez. |
| `Kayıt Lookup` | code | ExecOnce | Notion `Kayıtlar` canlı sorgu → entitled etkinlikler → `sirMap` + sırsız etiket listesi. `ortak`/`kisisel` blokları burada kurulur. `ilkTemas` burada hesaplanır. |
| `Admin Komut` | code | | `BOTZ *` komutlarını yakalar, `ocak_gizli` bayraklarını çevirir. Admin değilse pas geçer. Bot kapalıysa bakım mesajı üretir. |
| `Cevap Üret` | code | | Claude çağrısı. `<detay>` ve `<devir>` etiketlerini çözer. `kullaniciyaGiden` (gerçek) ve `gecmiseYazilan` (placeholder) ayrımı **burada** yapılır. |
| `Admin Yaz` | postgres | AlwaysOut | Admin komutunun bayrak yazımı. |
| `WA Gönder` | httpRequest | AlwaysOut · continueRegularOutput | Meta Graph API. `continueRegularOutput`: gönderim patlasa da zincir devam eder, konuşma yine loglanır. |
| `Geçmiş Yaz` | postgres | AlwaysOut | `ocak_konusma` — gelen + giden. **Placeholder'lı sürüm yazılır.** |
| `Token Yaz` | postgres | AlwaysOut | `ocak_token_log` — maliyet ölçümü. |
| `Devir Mail` | code | AlwaysOut · continueRegularOutput | `devirTur` varsa mail + (kriz) WhatsApp. `continueRegularOutput`: mail patlasa da bot cevabı etkilenmez. |

### `OCAK · Bağlam` (9 node)

İki paralel kol, ikisi de `Schedule Trigger`'dan çıkar.

**Kol 1 — içerik:**
`Secrets` (boş) → `Bağlam Üret` (code, Notion'dan dört kaynak + sır) →
`Tur Ayır` (switch: `baglam` / `detay`) → `Bağlam Yaz` · `Detay Yaz` →
`Detay Buda`

**Kol 2 — IG token:**
`Token Oku` → `Token Yenile` (60 günlük token 15 günde bir tazelenir) → `Gizli Yaz`

⚠️ **Kol 2 bu yüzden `OCAK · Bağlam` Active kalmalı** — Instagram bot pasif
olsa bile token zinciri buradan yürüyor. Workflow durursa IG token 60 günde ölür.

`Detay Buda` **`Detay Yaz`'ın ardında**, `Execute Once: ON`. Gerekçe §3'te.

### `OCAK · Instagram` (10 node)

`Webhook` (GET, `hub.challenge` doğrulaması) → `Respond to Webhook`
`Webhook1` (POST) → `IG Geçmiş Oku` → `Secrets` → `Bağlam Oku` → `IG Bot`
→ `IG Gönder` → `IG Geçmiş Yaz` → `IG Token Yaz`

İki webhook aynı yolu (`ocak-ig`) paylaşır: GET doğrulama, POST mesaj.
`IG Bot`'ta `<detay>` etiketi **regex'le WhatsApp yönlendirmesine çevrilir** —
LLM üretse bile sır çıkamaz.

⚠️ `IG Bot`'ta `max_tokens` hâlâ **1024** (WhatsApp'ta 600). Açık borç.

### `OCAK · Hata` (2 node)
`Error Trigger` → `Code` (Resend maili). Aktif edilmesine gerek yok,
Error Trigger kendiliğinden dinler. Dört workflow'un Settings'inde seçili.

---

## 15c · RAILWAY HARİTASI

**Hesap:** Kaan's Projects · **Hobby** planı.

| proje | servis | ne |
|---|---|---|
| **`Ocak Bot`** | `Postgres` (+ `postgres-volume`) | Botun beş tablosu. DB adı `railway`. |
| | `n8n` (+ `n8n-volume`) | GitHub deploy, `n8n-production-57a6.up.railway.app` |
| `ocak` | 1 servis | `ocak-docs` MCP sunucusu (korpus, salt-okuma) |
| `GELaiL Bot` | Postgres | GELaiL verisi — OCAK'a temas etmez |
| `burali` · `cabbar` | — | OCAK dışı |

**Kritik env değişkenleri (n8n servisi, 28 adet):**

| değişken | not |
|---|---|
| `N8N_ENCRYPTION_KEY` | **Kaybolursa tüm credential ölür.** 1Password'da yedek olmalı. |
| `DB_POSTGRESDB_*` | n8n'in kendi verisi. ⚠️ Host public mi private mi teyit edilmedi — public ise gereksiz egress + gecikme. |
| `WEBHOOK_URL` → `RAILWAY_PUBLIC_DOMAIN` | **Doğru kurulum.** Meta callback dışarıdan gelir, public olmak zorunda. Railway'in "egress ücreti" uyarısı bu senaryoyu bilmiyor, dokunma. |
| `EXECUTIONS_DATA_PRUNE` + `_MAX_COUNT` | Execution budaması açık. Denetim Postgres'ten yapılır. |
| `N8N_BLOCK_ENV_ACCESS_IN_NODE` | **Kapalı** — `$env` Code node'larında okunabiliyor. Secret düzeninin ön koşulu. |
| `OCAK_*` ailesi | §4'te tam liste |

⚠️ **Postgres yedeği yok.** 122+ konuşma, `ocak_gizli` secret'ları, `ocak_baglam`
tek volume'de. Railway'de günlük yedek açılabiliyor. Açık borç.

**Ölü değişken:** `OCAK_WA_PNID` — `Filtre` pnid'i webhook'tan okuyor.

---

## 16 · AÇIK BORÇLAR

**Lansman engeli (31 Ağustos):**
- Zoom kaydı süreci — site *"Açık Kapı kaydedilir, kayıt katılımcılarla
  paylaşılır"* diye vaat ediyor, süreç kurulmadı (Vimeo yok)
- **🔴 DAVET AKIŞI KAPALI — lansmandan önce AÇILMALI.**
  `davet-bot-korumasi` merge edildi (`a5ade5a`, 22 Ağu). Musluk + Origin +
  honeypot + zaman damgası canlıda. Ama `DAVET_AKISI` **tanımlı değil →
  varsayılan kapalı → davet kutusu yedi kayıt sayfasında görünmüyor.**

  Bu geçici bir güvenlik önlemidir, kalıcı karar değil. **Davet, kayıt
  akışının bir parçası** — kadın kayıt olduktan sonra bir arkadaşını çağırır.
  Kapalı kaldığı sürece o halka eksik.

  **Akış yalnız mail değil, Notion'a da yazıyor.** `/api/davet` başarılı
  gönderimden sonra **Notion Davetler DB**'ye satır açar
  (`383b61ebfa87801db7b7d47493e41aca`, altı property: Davet Eden Ref / Davet
  Edilen / Kanal / Tarih / Sonuç / Hatırlatma Atıldı — KARAR 271). Env
  `NOTION_DAVETLER_DB_ID`. Yani musluk kapalıyken **iki uç birden** susuyor:
  Resend maili ve Davetler DB kaydı. Açılınca `Sonuç` eşleştirmesi ve A→B
  hatırlatması (n8n) bu satırlar üzerinden kurulacak — davet kapalıyken o
  zincirin girdisi de üretilmiyor. Davet edilenin e-postası URL/query'ye
  hiçbir koşulda girmez (KARAR 270); gövdede taşınır.

  **Açmadan önce şart olan üç şey:**
  1. Cloudflare Turnstile (ya da eşdeğeri)
  2. IP başına hız sınırı
  3. Davet edenin kendi adresini doğrulaması

  **Açma yordamı:** Vercel'de `DAVET_AKISI=acik` → **redeploy şart**
  (`kart-akisi.ts` deseni değeri build zamanında sabitliyor; env değiştirmek
  tek başına yetmez). Sonra Resend log'unda `resend-node` imzalı çağrıların
  yalnız gerçek davetlerden geldiğini doğrula.

  **Kötüye kullanım kaydı:** 20–21 Ağustos, saat başı, toplanmış spam
  listesine. Son gönderim 21 Ağu 19:44 UTC. Musluk sonrası `resend-node`
  imzası sustu — doğrulandı.
- Sohbet paneli — n8n'de webhook → Postgres → HTML, sıfır commit

**Lansman öncesi:**
- Postgres yedeği yok — 122+ konuşma, secret'lar, tek volume
- Kriz WhatsApp şablonu — Meta utility onayı, birkaç gün sürer
- Kriz WA hatası sessiz — gönderim patlarsa yalnız n8n log'una yazıyor
- Bot dili — iç mekanizma sızıntısı (*"sistem bana göstermiyor"*)
- Ses kalite testi — temiz bağlamla yeniden koşulmalı

**Instagram — ayrı hat, App Review'a kadar dondurulmuş:**
- **App Review başvurusu.** `messages` webhook izni. Dev mode'da webhook
  gelmiyor, bu duvar aşılmadan IG botu hiç çalışamaz. Şart: içerik temizliği
  bitmiş olmalı — screencast'te yarım ürün ret riski.
- **`IG Bot` `max_tokens` 1024** — WhatsApp'ta 600'e çekildi, IG'de kalmış.
- **`ortak` blok eşitliği sınanmadı.** WA ve IG'deki `ortak` bloğu birebir aynı
  olmalı (cache paylaşımı). WhatsApp tarafı 22 Ağustos'ta değişti; IG tarafı
  o değişikliği almadı mı, kontrol edilmedi. **Fark varsa cache ikiye katlanıyor.**
- **IG'de oturum sınırı yok.** `IG Geçmiş Oku` hâlâ penceresiz son 20 mesaj.
  WhatsApp'ta kirlenme sorununu çözen 6 saatlik pencere IG'ye uygulanmadı.
- **IG'de kanal beyanı var ama tanıtım mantığı yok.** `ilkTemas` hesabı
  WhatsApp'a özel; IG botu her mesajda kendini tanıtabilir.
- **IG'de devir yok.** `IG Bot` `<devir>` etiketi işlemiyor — duygusal veya
  kriz mesajı gelirse kimseye haber gitmiyor. WhatsApp'ta çalışan insan kapısı
  IG'de **tamamen eksik.**
- **IG'de kayıt lookup yok** (bilinçli — kimlik doğrulanamıyor), ama
  yönlendirme metni WhatsApp hattına gidiyor. O hattın numarası IG kodunda
  yazılı değil, model prompt'tan üretiyor — sabitlenmeli.
- **Otomatik cevaplar / hazır yanıtlar.** Instagram'da Meta'nın kendi
  "Instant Reply" ve "FAQ" özellikleri var; bot devreye girmeden önce onlar
  cevaplıyor olabilir. Çakışma kontrol edilmedi.
- **Story yanıtları ve mention'lar** ayrı webhook olayları — bot bunları
  işlemiyor, sessizce düşüyorlar. İstenen davranış mı, karar verilmedi.
- **IG token zinciri `OCAK · Bağlam`'a bağlı.** O workflow durursa 60 günde
  token ölür. IG bot pasifken bile Bağlam Active kalmalı.

**Sonra:**
- Token maliyeti ölçümü (`ocak_token_log`) → cache kırılma kontrolü,
  günlük tavan
- Konuşma kalite skoru — gerçek diyalogları ses testine göre puanlama
- İdempotans — `wamid` bazlı, çift cevap/çift ücret koruması
- n8n + Railway envanteri — sahipsiz değişkenler, `IG Bot` `max_tokens`,
  `DB_POSTGRESDB_HOST` public/private, Advaita'nın kill switch yetkisi
- GELaiL hijyeni — router Notion bağımlılığı, credential rotate
- ~~Site/Notion bağlantı teyidi~~ — **kapandı (22 Ağu, Kaan teyidi).**
  `Prompt`/`Özeti`/`SSS`'ten Ocak Site bağlantısı kaldırıldı; ayrıca
  **xÇember Döngüsü ve xAtölye bağlantısı da Ocak Site'tan bilinçli
  kaldırıldı — site bu iki DB'yi okumuyor, teyit edildi.** Tüketici başına
  ayrı Notion token ilkesinin (§4) fiilî karşılığı: site integration'ı
  yalnız kendi okuduğu DB'lere bağlı kalır.
  ⚠ `20-ref-notion.md:24` ve `:62` hâlâ Çember Döngüsü'nü workspace
  yapısında sayıyor — o dosya bu turda DOKUNMA kapsamındaydı, tazelenmesi
  ayrı iş (B131 değil, envanter turu)
- Operasyon el kitabı — BOTZ komutları, arıza akışları, rotate prosedürü

---

## 17 · TEŞHİS REFLEKSLERİ

Bu turda öğrenilenler. Bir dahakine buradan başla.

**Ölçüm çıkarımı yener.** "267 execution ayda 2880 olmalıydı" aritmetiği
`OCAK · Bağlam`'ı temize çıkarmıştı — sayı kayan pencereymiş. Executions
ekranı gerçeği gösterdi.

**Koşmak ≠ yazmak.** Cron doğru koşuyordu, hiçbir şey yazmıyordu.

**"Success" bir şey kanıtlamaz.** `try/catch` hatayı yutarsa n8n yeşil yazar.

**Belge gerçeğin fotoğrafıdır, gerçek değildir** (KARAR 102). Bu turda korpus
altı haftalık bir yalan taşıyordu.

**Railway Data paneli: tek cümle.** Çok cümlede yanlış sonucu gösterir.

**Kanıt zinciri sırayla:** kod ne yaptığını söyler · Postgres ne olduğunu
söyler · konuşma kaydı kadının ne gördüğünü söyler. Üçü ayrı kaynaktır.

**Modele bırakma, koda al.** Prompt'a "şunu yazma" demek modelin başka bir
şey uydurmasıyla sonuçlanır. Etiket önündeki giriş cümlesi regex'le silindi;
kovalamaca orada bitti.

---

## 18 · DEVRALINAN BÖLÜMLER — eski gövdeden taşındı

*Aşağıdaki dört bölüm 6 Ağustos tarihli gövdede yaşıyordu ve 22 Ağustos'un baştan
yazımında karşılığı yoktu. **Silinmediler, taşındılar** (KARAR 61). Rebuild bunları
geçersiz kılmadı: MailerLite envanteri site tarafının ölçümüdür, KARAR 57 etik
çerçevedir, KARAR 410 ve 447 Meta/WhatsApp kanon kararlarıdır — üçü de hâlâ canlı
korpustan atıf alıyor.*

*Metin **birebir** taşındı; tek satırı yeniden yazılmadı. Eski gövdedeki `##`/`###`
seviyeleri korundu — `01-kararlar.tsv`'nin `447` satırı `20-ref-bot.md#k447`
çapasına bakıyor ve o çapa madde başlığına çözülür (KARAR 466); başlık düzeyi
değişirse çapa kopar.*

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


---

## EK · KARAR EŞLEMESİ — bu dosya hangi kararı nerede taşıyor

*22 Ağustos baştan yazımı gövdeyi kavramlarla kurdu, numaralarla değil — okunurluk
kararı (Kaan, 22 Ağu). Numara aramak için gövdeyi taramak gerekmesin diye tek tablo
burada. **Gövdeye numara serpilmedi**; bu tablo tek giriş kapısıdır.*

*`durum` sütunu `01-kararlar.tsv`'den okundu (22 Ağu ölçümü) — ledger esastır, bu
tablo ondan türetilmiştir. Çelişkide ledger kazanır.*

| KARAR | başlık (ledger) | durum | bu dosyada nerede |
|---|---|---|---|
| 56 | Otomasyon mimarisi | AKTIF | §18 (devralınan — A.18 gövdesi arşivde, `_arsiv/20-ref-bot-2026-08-06.md:29-113`) |
| 57 | Kayıt ve veri etik çerçevesi | KALICI | §18 · `## A.19 — VERİ ETİK ÇERÇEVESİ` + Bot Davranış Kuralları |
| 102 | Gerçeklik spec'i ezer | KALICI | §0 · §17 (adıyla anılıyor) |
| 251 | *(ledger'da başlık boş)* | TEYITSIZ | kayıt lookup zincirinin kökü — §2 DÖRT KAPI. ⚠ Ledger satırı başlıksız, teyit ayrı iş |
| 252 | `<siparis>` deseninin OCAK'a taşınması — yeni makine yok | AKTIF | §2 · *Sır zinciri — kanıtlanmış akış* |
| 253 | Şifre LLM'in yanına gelmez — tag-replacement | KALICI | §2 · *Sır zinciri* (LLM etiket yazar, kod değeri koyar) |
| 254 | Geçmişe sır yazma yasağı — multi-turn sızıntı önleme | KALICI | §2 · §6 (oturum sınırı, geçmiş kirlenmesi) |
| 255 | Aynı telefon birçok kayıtta → disambiguation şart | KALICI | §9 · TELEFON EŞLEŞMESİ |
| 256 | GELaiL bit-bit korunur — guard'lı diff protokolü | KALICI | §12 · ROUTER — GELaiL ilişkisi |
| 257 | Bot model ayrımı — OCAK → Sonnet | ACIK-BORC | §15 · n8n ortamı (uygulanmadı, borç olarak duruyor) |
| 258 | Notion property yetmez — Code node o DB'yi çekmeli | KALICI | §4 (token/erişim) · §15b `Kayıt Lookup` node satırı |
| 270 | Davet edilen e-posta URL/query'ye asla girmez | KALICI | §16 · davet bloğu |
| 271 | Davetler DB + `?ref=` altyapısı | AKTIF | §16 · davet bloğu (musluk kapalıyken bu uç da susuyor) |
| 410 | WhatsApp display name adayları Meta tarafından reddedildi | SUPERSEDE | §18 · devralınan blok. ⚠ SUPERSEDE — güncel hâli KARAR 519-521, §13 |
| 447 | WhatsApp stratejik konumlama — push'u hizmete, pull'u pazarlamaya | AKTIF | §18 · devralınan blok. **`01-kararlar.tsv` `kaynak` hücresi bu başlığa bakar (`20-ref-bot.md#k447`) — başlık düzeyi değişirse çapa kopar** |
| 518 | Bot hattı ve yasal telefon iki ayrı yüzeydir, eşitlenmez | KALICI | §13 · META / NUMARA (adıyla anılıyor) |
| 519 | Onaylı display name bırakılmaz | KALICI | §13 (adıyla anılıyor) |
| 520 | WABA profil alan kanonu | KALICI | §13 · profil alanları |
| 521 | İkinci hat (…0888) başvurusu "Ocak Kadın Topluluğu" | AKTIF | §13 (B104'e bağlı) |
| 524 | Secret tek kaynağı Railway env | mühürlü | §4 · SECRET DÜZENİ |
| 525 | Sessiz kırılma yasağı — eksik bağlam `throw` eder | mühürlü | §5 · SESSİZ KIRILMA |
| 526 | Oturum sınırı — altı saatlik pencere | mühürlü | §6 · OTURUM SINIRI |
| 527 | Cache disiplini — kalıcı kural `ortak` bloğa | mühürlü | §7 · CACHE DİSİPLİNİ |
| 528 | `ocak_etkinlik_detay` budaması yazımın ardına bağlanır | mühürlü | §3 · POSTGRES |
| 529 | Telefon eşleşmesi formattan bağımsız | mühürlü | §9 · TELEFON EŞLEŞMESİ |
| 530 | Kanal beyanı zorunlu | mühürlü | §8 · KANAL BEYANI |
| 531 | Yeterlilik kuralı — yarım cevap yerine devir | mühürlü | §10 · DEVİR SİSTEMİ |
| 532 | Kriz hattı — WhatsApp + mail birlikte | mühürlü | §10 · DEVİR SİSTEMİ |
| 533 | Devir kutusu Kaan'da — `devir@ocak.biz` kurulmaz | mühürlü | §10 · DEVİR SİSTEMİ |
| 534 | Sistem maili gönderen adresi `sistem@mail.ocak.biz` | mühürlü | §4 · SECRET DÜZENİ |
| 535 | Davet akışı geçici olarak kapalı — lansmandan önce açılmalı | mühürlü | §16 · davet bloğu |
