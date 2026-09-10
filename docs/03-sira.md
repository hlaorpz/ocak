# OCAK — SIRA

**Son güncelleme:** 10 Eylül 2026 (**N-Kolay turu — kart yüzeyi mock'la geri açıldı**) ·
**KARAR 573–577** mühürlendi · on commit, **dokuzu kod** (19 Ağu'dan bu yana ilk kod turu) ·
test **325/325 · 19 dosya** · **B180 koruma ayağı ✅**, **B185–B193** açıldı · İŞ 4 uçtan uca
koşuldu (Kaan) ·
önceki: 24 Ağustos (**Sayfalar metin turu + C listesi + DEPLOY**) ·
**KARAR 558–567** mühürlendi · **DEPLOY ALINDI** — `1b4b998` → **`9acbabb`**, sekiz canlı
kontrolün sekizi tuttu · **B80 ✅ · B164 ✅**, **B174–B181** açıldı ·
önceki: 24 Ağustos (**sıfır dolgu turu**) · **KARAR 555–557** — jetonlar
sıfır dolgulu (`C01`–`C24` · `V01`–`V09` · `z01`–) · karusel zemini yüzey olur, nesne olmaz ·
sert kapı ölçütü yöntemiyle yazılır; **B171 ✅ kapandı**, **B172–B173** açıldı (C09 ve C20
karusel zemini) · önceki: 23 Ağustos (**adlandırma turu**) · **KARAR 552–554** — zemin dosya
adı zemine bağlanır · `İn`→`Cn`, `Pn`→`Vn` · atama öncesi sıra+borç okunur; **B169–B171**
açıldı, `docs/31-zemin.md` doğdu · önceki: **EK tur** · **KARAR 551** Çember Lideri →
**Çember Rehberi**, B160 ✅ kapandı, B165–B168 açıldı · `00-durum.md` **bilerek bekletiliyor**
(aşağıda) · önceki: **Advaita yorum turu** — 14 etkinlik gövdesi yeniden
yazıldı, KARAR 547–550 mühürlendi, KARAR 506 SUPERSEDE, B144–B164 açıldı · **DEPLOY YAPILMADI**
(bilinçli, `02-borclar.md` B163) · aynı gün: Gün 0 görsel turu (KARAR 542–546 · B139–B141) ve
arşivci turu (B142–B143) · önceki: 20 Ağustos 2026 · **fikir kuyruğu korpusa alındı** — B108–B120 açıldı ·
**FİKİR HAVUZU** ve **KARAR ADAYLARI** başlıkları doğdu (F-1…F-5 · A-1…A-5),
karar mühürlenmedi (ledger 523'te sabit) · önceki: **Marka işareti ✅ · başlık kanonu ✅** —
KARAR 522 · 523; borçlar B105 · B107 (B106 aynı gün kapandı) ·
WABA display name turu (KARAR 519–521 · B103–B104 · KARAR 410 SUPERSEDE) ·
önceki: WA yüzen buton turu (KARAR 517–518 · KARAR 396 SUPERSEDE) ·
B102 turu · gölge satır turu (KARAR 514–516 · B101) · üç-format turu
(KARAR 496–513 · B88–B100 · KARAR 79 SUPERSEDE)

**Sıradaki iş (içerik hattı, 23 Ağu):** **Sayfalar DB dokuz sayfa → sonra tek seferde deploy.**
Kuyruk aşağıda, `📄 İÇERİK HATTI` bölümünde.

**Sıradaki iş (kod/altyapı hattı, 20 Ağu — değişmedi):** **B64 → B69 → B68 → n8n ödeme onayı.**
⚠ İki hat **aynı repoda yaşıyor** (KARAR 463, tek klon) — eşzamanlı koşmazlar.

> Bu dosya **ne yapıldığını** değil **sırada ne olduğunu** tutar. Durum `00-durum.md`'de,
> borçlar `02-borclar.md`'de, gerekçe kronolojide yaşar. Burada yalnız: **sıradaki iş,
> kim yapar, nerede yapılır, nasıl açılır.**
>
> **Her sohbet sonu patch'i bu dosyayı da günceller** (KARAR 468). Biten satır silinmez,
> `✅` damgası alır ve bir sonraki bakımda alt bölüme iner.

---

## SIRADAKİ İŞ

> ✅ **`00-durum.md` YAZILDI (24 Ağustos) — bekleme koşulu doldu.**
> 23 Ağustos kararı *"Sayfalar DB turu bitene kadar bekliyor; o turda tahliye + yazım
> birlikte koşulur"* diyordu. Tur bitti, deploy alındı, ikisi birlikte koşuldu:
> **11 Ağustos bloğu** (B47 · B40/B55/B56) kronolojiye **indi**, yerine tek satırlık
> işaretçi kaldı (KARAR 61 — silinmedi, taşındı); 24 Ağustos gerçekleri yazıldı.
> ⚠ **B131 hâlâ açık** — tahliye tavanı bir kez daha açtı, kapağı kaldırmadı.

### ⛔ LANSMAN ÖN KOŞULU — ertelenemez

✅ **İade cümlesi ÇÖZÜLDÜ (10 Eyl, KARAR 576, `0b173ac`).** İki dosyanın canlı cümleleri
iki yöntemi de kapsıyor, beş yorum bloğu kapandı. İade metni iki dosyada birebir aynı
dize — ortak bileşene çıkarılmadı, **B185**.

*Kapanan hâli (KARAR 61 — silinmez):* `teslimat-iade.astro:57-58` +
`mesafeli-satis.astro:123-124` *"ödemenin yapıldığı kart üzerinden iade"* diyordu; kart
akışı KARAR 488 ile kapanınca cümle yanıltıcı olmuştu ve tüketicinin itirazda fiilen
dayanacağı maddeydi. Faz 1'de taslak yorumda bırakılmıştı.

⚠ **`robots` `Allow` hâlâ açılmadı** — engel kalktı, **karar verilmedi.** Lansman tanımı
(KARAR 149) = robots Allow + duyuru; kararı **Gün 1** ile birlikte verir.
⚠ Hukukçuya kalan iki soru metne **girmedi**: cayma hakkı istisnası (6502 md.15) ·
"internetten satış" e-ticaret fatura serisi.

⛔ **Bu bölümün dışında iki lansman engeli daha var** (22 Ağu bot turu, aşağıdaki
🤖 BOT HATTI bölümü): **B121** davet akışı kapalı 🔴 · **B122** Zoom kaydı süreci yok.
İkisi de "sitenin canlı olması" ile ölçülmez, **vaadin karşılanmasıyla** ölçülür.
→ **B121 ✅ kapandı** (22 Ağu, şartsız açıldı — KARAR 537; koruma katmanları **B132**'ye devretti).
**B122** açık; sahip Kaan → **Advaita**.

✅ **Marka işareti mühürlendi ve yerleşti (18–19 Ağu, KARAR 522 · 523).** Doküman
hattının dışından gelen ilk iş — ürün tarafına dönüşün başlangıcı.

Sırada iki hat (B106 aynı gün kapandı — `c45332e`):
1. **B105** — işaretin dış yüzeylere uygulanması (Kaan; Instagram, WhatsApp, e-posta,
   OG kartı).
2. **Görsel üretim** — Midjourney kurucu görseli, sosyal plan Gün 0 kilidi. KARAR 522
   renk kilidini kullanır; kurucu prompt'un renk satırı ona daraltılacak, `--chaos` 8→4
   düşürülecek. Midjourney V8.x — plan V6/V7 varsayımıyla yazılmış, `--sw` 60 düşük
   (90–110), otuz günlük seri için moodboard (`--p`) tek `--sref`'ten daha uygun.


### ✅ İÇERİK HATTI — BİTTİ (24 Ağustos: Sayfalar turu + tarama turu + C-1…C-5 + DEPLOY)

**Biten satırlar silinmez, `✅` alır** (KARAR 61). Aşağıdaki 23 Ağustos kuyruğu **kapandı**:

- ✅ **Advaita sayfa turu** — on sayfa · ✅ **tarama turu** — yorum almamış sekiz sayfa
- ✅ **C-1…C-5** kapandı; **beşi Advaita'ya kaldı** (aşağıdaki C LİSTESİ bölümünde ✅/⏳ ayrımı)
- ✅ **Advaita birleşik raporu** — `advaita-rapor-2026-08-24-birlesik.md` (23 Ağustos raporuyla
  tek dosyada birleşti). ⚠ Ara taslak `advaita-geri-donus-2026-08-24.md` **geçersizdir,
  gönderilmeyecek.** Birleştirmede **bir cevap geri alındı**: kayıt satırı *"farklı yapıldı"* →
  **"yapıldı"** (KARAR 558). *Advaita'ya söylenmiş bir cevabın değiştiği raporda açıkça yazıldı —
  sessizce düzeltilmedi.*
- ✅ **DEPLOY** — `9acbabb`, sekiz canlı kontrolün sekizi tuttu (**B163** kapanmadı, aşağıda)

⚠ **B163 (deploy borcu) bu turla kapanmadı ama şekil değiştirdi:** o borç *"Notion'da yeni,
sitede eski"* tutarsızlığıydı; şu an **fark yok.** Bir sonraki metin turu farkı yeniden
açacak — **KARAR 566 gereği her metin değişikliği deploy ister.**

---

### 🎯 N-KOLAY HATTI — 10 Eylül turundan

0. ✅ **Kod tarafı hazır.** On commit, İŞ 4 uçtan uca koşuldu (Kaan), Preview ayakta
   (`nkolay-test`, `f8409c4`).
1. ⏳ **Production anahtarı çevrilecek** (Kaan) — `KART_AKISI=acik` · `PAYMENT_PROVIDER=mock` ·
   `ODEME_CALLBACK_SIR` (Preview'dakinden **farklı**), sonra **redeploy** (değer build
   zamanında sabitlenir). ⚠ 11 Eyl ölçümünde **henüz çevrilmemişti.** Çevrilince **B193**
   canlı borç olur — AÇILIŞ'tan (24–27 Eylül) önce kapanmak zorunda.
2. ⏳ **N-Kolay'dan dört girdi bekleniyor** (Kaan → `nkolayPos@nkolay.com.tr`): logo seti
   (Visa/MC + kendi rozeti) · **callback imza şeması** · **site denetim kriter listesi** ·
   test kartları. ⚠ Kriter listesi gelmeden neyi karşıladığımızı **ölçemiyoruz** — hattın
   gerçek darboğazı bu.
3. ⏳ **Muhasebeci/hukuk iki soru:** cayma hakkı istisnası (6502 md.15, belirli tarihte
   yapılan hizmet) · "internetten satış" e-ticaret fatura serisi (kart geldiğine göre
   **büyük ihtimalle evet**).
4. **Güven şeridi** — KARAR 297 iyzico şeridini kaldırmıştı; `public/odeme/` yok, çizen
   komponent yok, ölü kod kalmamış. Logo seti gelmeden kurulamaz.
5. **N-Kolay provider** — `payment-provider.ts`'e implementasyon + gerçek
   `dogrulaCallback()`. İmza şemasına kilitli. Aynı turda **B186** temizlenir.
6. **`nkolay-test` dalı silinecek** — iş bitince `git push origin --delete nkolay-test`.
7. **Muhafız turu** — **B188** (KARAR 488'in dört ölçüsüz tüketicisi) **birinci**, sonra
   **B189**'un kalanı. Kendi brief'iyle gelir.

---

### 🎯 SIRADAKİ — 24 Ağustos turundan, öncelik sırasıyla

1. **Advaita görüşmesi.** Rapor hazır ve **tek dosya**. Gündem: beş açık C kalemi +
   **Ritüel Tasarımı ön görev onayı** (**B178**) + **marka K4'ün Wild Woman ibaresi**
   (**B158**, iki turdur açık). ⚠ **Site canlı** — artık gösterilebilir.
2. **Slug turu** (**B175**) — 26 kayıt, konvansiyon **KARAR 559**. Yayındaki ~10'a tarih eki
   (`neyi-bekliyorsun` dahil). İki yalan söyleyen slug + Yolculuk placeholder tarihleri.
   Taslak slug'ları **Kaan** yazacak. ⏳ **Pencere ilk gerçek kayıtla kapanır.**
3. **Şablon taraması** (**B165**) — MailerLite + Resend, KARAR 558 kapsamıyla.
   **İlk gerçek kayıt açılmadan önce.** Aynı turda **B174** (kakao grubu var mı).
4. **Deploy hook — B64.** `tZR9LcwJq9` hâlâ `astro-iskelet` **ölü dalına** bağlı.
   ⚠ Bu turda push yoluyla deploy alındığı için **sorun görünmedi**, ama Notion webhook ve
   gece cron'u hâlâ ölü dala basıyor — yani **otomatik içerik deploy'u çalışmıyor** ve
   çalışmadığı **fark edilmiyor.** Yanında **B179** (`.vercel/repo.json` bayat): elle
   deploy'un iki yolu da güvenilmez, bu tur üçüncü yolu (git push) kullandı.
5. **B159** — `bes-kadim-kaynak` → `dort-yon-bir-ocak`. `src/`'de **19 eşleşme / 6 dosya**;
   Notion + kod **atomik** (KARAR 409).
6. **Kod kuyruğu** — aşağı-kaydırma işareti (**B161**, ana sayfa + `/sen-neredesin`, ortak
   komponent) · dönüş yolu (**B162**) · `Kayıt Var` kabuğa (**B167**).
7. **`ocak-lint`** (**B166**) — KARAR **561** (başlık soru sormaz) · **562** (kadına ne
   yapacağını söylemez) · **563** (mühürle birlikte denetim satırı) kural satırları.
8. **Brief şablonu** — KARAR **566** ve **567**'nin ölçüm kuralları:
   *SSR sayfası canlıda doğrulanır* · *doğrulamanın başarısız olabildiği önce kanıtlanır.*
9. **B176** — `/yolculuk` `yolculuk-eksen` çıktıda yok; teşhis Notion'dan başlar.
10. **B180** — `tools/ocak-kart-derleyici.html`. ✅ **Kim yazdı belli:** 23–24 Ağu MJ görsel
    oturumu (claude.ai), üç düzeltme ölçümle doğrulandı. ✅ **Adsız kopya silindi** —
    HEAD ile birebir aynıydı, sıfır bilgi. ⏳ **Kalan: commit.** Değişiklik hâlâ
    korumasız (`47 ekleme, 5 silme`) ve **tarayıcıda test edilmedi.** Commit turu
    **B169** (`kartAdi()` şema hizası) ve **B143**'ü (font gömme) aynı anda kapatabilir —
    üçü aynı dosya, tek doğrulama.
11. **B181** — aynı gün çok oturum kuralı: `docs/`'a kim yazar, kim patch üretir.
    ⚠ **Yazan oturum push eder** — push edilmemiş commit claude.ai için yok hükmündedir
    (KARAR 479; bu tur boyunca MCP bayat snapshot servis etti).
12. **B177** — söz envanteri. Tek turda kapanmaz; ilk adım envanterin kendisi.
13. **Görsel hattı — 24 Ağustos MJ turundan.** İki prompt ailesi tamam (V01 · V03), on bir
    zemin mühürlü, **kesintisiz yayın C01–C03'e kadar.** Sırayla:
    - ⛔ **B184 / ADIM 3d — `KURUCU-URL` ara-değiştir.** Bölüm 16'da **12 yer tutucu**;
      `--v 8.1` + `--chaos` + genişletilmiş `--no` listesi de burada eşitlenir. **Gün 1
      bunsuz başlamaz** (KARAR 450) ve V03'ün dosyadaki kuyruğu şu an ölçülen kuyruk değil.
    - 🎯 **V02 HD — tek işte üç kart açılır** (C06 · C09 · C16). Dört aday elde, **yeni
      draft gerekmiyor**, eksik olan yalnız HD. Turun en yüksek kaldıraçlı işi.
    - **B182** — z04 üstüne tek kart bas ve bak. **C05 basılmadan önce**; kirliyse z04 ile
      z05 yer değiştirir.
    - **B183** — V03'te `invitation without a figure` → `empty threshold, no one present`,
      bir sonraki turda **tek değişken olarak.**
    - Üretim sırası (ilk iki hafta ihtiyacı): **V03 ✅ → V02 → V07 (C08, 8. gün) →
      V05 Urla (C11) → V08.** ⚠ Yorgunluk belgesinin sırası V07'yi atlıyordu, düzeltildi.
    - **B173** — C20 zemini, **V06 üretilmeden** karara bağlanmalı. KARAR 571 emsal,
      otomatik değil.
    - **B170** — on bir zemin hâlâ yalnız MJ CDN'inde + Kaan'ın diskinde.

---

### 📄 İÇERİK HATTI — 23 Ağustos Advaita turunun kuyruğu (tarihsel, ✅ kapandı)

*Etkinlikler DB bitti (14 gövde). Kalan: Sayfalar DB dokuz sayfa (~15 kalem) + sekiz soruluk
C listesi + deploy. Tam devir `_arsiv/2026-08-23-advaita-devir.md`, Advaita'ya dönen rapor
`_arsiv/2026-08-23-advaita-rapor.md`, tur anlatısı `90-kronoloji/2026-08.md`.*

⚠ **DEPLOY SONDA — bu bir kural, gecikme değil** (**B163**). 23 Ağustos'ta üç hata yakalandı,
hiçbiri siteye ulaşmadı çünkü deploy sondaydı. Sayfalar DB de bitince **tek seferde.**

📅 **TARİH BASKISI — `bir-esikte-duruyorsun`, 31 Ağustos 2026.** Yayındaki ilk etkinlik.
Gövdesi 23 Ağustos'ta yeniden yazıldı (**3.226 kr**); **Notion'daki hâli sitede görünmüyor.**
Bugünden **sekiz gün** var.
⚠ **Deploy bu tarihe sıkıştırılmamalı** — son güne kalırsa yakalanan hatayı düzeltecek
zaman kalmaz ve "deploy sonda" kuralı koruma olmaktan çıkıp riske döner.
Aynı tarihe bakan diğer işler: **B122** (Zoom kaydı süreci yok — Advaita) ·
**B165** (e-posta şablonları) · **B164** (`Kayıt Var` doğrulaması) · bot hattının üç işi.

**Sayfa sayfa kalan yorumlar** (Sayfalar DB, `update_content` cerrahiye izin verir —
property riski burada yok, KARAR 550):

| Sayfa | Kalan |
|---|---|
| `/sen-neredesin` | "yargı" → *yorum · tad · tanım* (2. İlk dokunuş) · Çember Lideri → **Çember Rehberi** (8. Taşıyıcı, **KARAR 551** — karar verildi, Notion uygulaması burada) · aşağı-kaydırma işareti (**B161**) |
| `/acik-kapi` | "kadın gelmeyi gerçekten istesin diye" nesneleştiriyor → *sen* ya da *gelmek isteyen kişi* · **dakikalar silinsin** — bir saatlik buluşma bu kadar detaylı anlatılmasın (KARAR 549) |
| `/seremoni` | "Kakao ayda en az bir kez" → **bu taahhüt verilmesin** · "Kayıt yapılıyor mu" → **kayıt yapılmaz** (KARAR 547) · *"Niyet tek başına düşünce…"* → C listesi #7 |
| `/mini-retreat` | yaban kadın / wild woman → C listesi #6 (**B158** aynı karara bakar) |
| `/anadolu` | "Tanışma görüşmesi — *sınav değil* demek bile sınava işaret ediyor" |
| `/biz` | "Advaita tek dile getiren kadın" — tek o dile getiriyor gibi olmuş |
| `/advaita` | SSS son soru: *"ulaşılabilir değil"* **ibaresi artık yok** (ölçüldü), ama kalan *"Bu bir mesafe değil, alanın korunması"* hâlâ savunmacı |
| `/ekip` | çıraklık → C listesi #8 · Çember Lideri → **Çember Rehberi** (**KARAR 551**) |
| `/hikaye` | mum→ateş ✅ · Amerikalar ✅ · marker `bes-kadim-kaynak` → `dort-yon-bir-ocak` → **B159, kod işi** |
| `/bulusmalar` | "en hafifi… **en ağırı**" → *en derini* ya da *en uzunu* |
| `/araclar` | ✅ bitti (yedi → altı raf) |

**Yorum almamış ama taranmalı:** `/adimiz` · `/atolye` · `/cember` · `/felsefe` · `/iletisim` ·
`/sehir-aksami` · `/takvim` · `/yolculuk`. İki tarama ekseni: **Çember Lideri → Çember
Rehberi** (**KARAR 551** — karar mühürlü, tarama mekanik) ve **batı sıfatı** (*yaban kadın* ·
*womb yoga* · *şamanik yoga*, **B158** — **karar yok**, tarama sonuç üretmez, önce duruş gerekir).

⚠ **İki eksen aynı sınıf değil.** Birinde karar var, uygulama kaldı; diğerinde karar yok.
Batı-sıfatı taraması karar öncesi koşulursa yalnız liste üretir, düzeltme üretmez.

**Çözülmemiş tek satır:** `bu-ses-kimin` — Advaita *"Kendine hala"* diye işaretlemiş, yorum
metni boş. Metindeki karşılığı *"Kendine 'neden hâlâ yapmadım' diye soran…"*; ne demek
istediği anlaşılmıyor, **Advaita'ya sorulacak.**

### 🔶 C LİSTESİ — BEŞİ KAPANDI (24 Ağu), BEŞİ ADVAITA'DA

**✅ Kapananlar (C-1…C-5, 24 Ağustos):** dördü **KARAR 560** ile ada/slug'a dönüştü,
biri gövde yeniden yazımıyla çözüldü. Yeni adlar: **Ellerin Dolu** · **Yer Açmak** ·
**Ateş Seninle Geldi** (bu bir **Açık Kapı**, Çember değil) · `hangi-tohumu-ekeceksin`
(başlık aynı, kıtlık mantığı **KARAR 562** ile çıktı) · `dusundugum-hissettigim-yaptigim`.
Ad kararlarının dayandığı ilke **KARAR 561** olarak mühürlendi.

**⏳ Advaita'da kalan beş kalem:** C-6 yaban kadın · C-7 `/seremoni` niyet cümlesi ·
C-8 `/ekip` çıraklık · `bu-ses-kimin`in çözülmemiş satırı · **19 Ağustos'un boş yorumu**
(Buluşmalar/Açık Kapı satırı var, yorum metni yok).

*Aşağıdaki sekizli liste **tarihsel kayıttır** — 1–5 kapandı, 6–8 açık.*

*Bunlar borç değildir — karar Advaita'nındır, ledger'a girmezler. Kaan bunları **önce Claude
ile tartışarak** hazırlamak istiyor, sonra Advaita'ya gidecek. Advaita'nın kelimeleri birebir
`_arsiv/2026-08-23-advaita-devir.md` §C'de; **parafraz edilmez.***

1. `elin-neyle-dolu` **adı** — *"sepetin olabilir mi"*. Sayfa artık **sofra** metaforuyla
   kapanıyor (*"Gel, sofraya koy"*); isim kararı buna bakarak verilir.
2. `ekmeden-once` **adı** — *"ekme kelimesi oturmamış"*. Adaylar: *ekimden önce · ekme
   mevsiminden / döneminden / vaktinden önce.*
3. `kokun-nerede-kaldi` — **ad + çerçeve, yeniden yazım.** Advaita yeni bir bakış veriyor:
   gurbet kelimesinin ağırlığı · *"kökler fiziksel yere bağlı değildir, sağlamsa seninle
   gelir"* · köprü / örmek / bağ. ⚠ **Mevcut metnin bilmediği bir arka plan var:** Advaita
   pandemide haftada iki gün İngiltere'deki Türklerle çalışmış — **Açık Kapı fikri oradan
   doğmuş.** Yeniden yazım bunu bilerek kurulur.
4. `hangi-tohumu-ekeceksin` — **"Kimin İçin" bölümünün tamamı** (*"çok eril"*, *"davetkâr
   değil, itici"*, *"buna karışamayız"*) **+ büyük başlık** (*"tamamen değişmeli"*).
   Advaita'nın yönü: *"Ruhun çağrısı ne? Hangi tohumu ekmeye bedenin, kalbin davet ediyor?"*
5. `dusundugum-hissettigim-yaptigim` — **ana başlık.** *"Bu üçü en son ne zaman aynı yöne
   baktı?"* → *"En son ne zaman baktığına bakmıyoruz."* Yön: hizalı mı / nasıl hizalanır /
   hizalı olmak neye yarar.
6. `/mini-retreat` **yaban kadın** → *hatırlayan kadın*? Advaita'nın uzun notu batı
   sıfatlarına **duruş** istiyor. → **B158**
7. `/seremoni` *"Niyet tek başına düşünce…"* — anlamadı.
8. `/ekip` **çıraklık** — *"konuşalım"*.

⚠ **Slug değişirse dört yüzey etkilenir:** URL · Notion · MailerLite `etkinlik_url` · sosyal
plan E-kartları. **Başlığı slug'a dokunmadan değiştirmek mümkündür** — hangisinin
değiştiği **ayrı karara bağlanır**, birlikte varsayılmaz.

### 🔶 PDF'İN SİTE DIŞI BÖLÜMÜ — AYRI SOHBET, KARIŞTIRILMAZ

*Advaita'nın listesinin son üçte biri site metni değil **program tasarımı.** Site turuyla
karıştırılırsa ikisi de yarım kalır (KARAR 52 — her konu ayrı sohbet).*

Açık Kapı içerik matrisi (üç sütun: kadın kapıdan ne ile ayrılsın / Açık Kapı konusu /
Çember konusu) · **Merhaba–Ayni çerçevesi** (*"Merhaba: Sana yer açıyorum"* · *"Ayni:
Aramızdaki dengeyi onurlandırıyorum"*) · Eşik kadını vurgusu · niyeti alt seslerden ayırt
etmek · **Çember takvimi** (*"Ağustos ortası başlar???"* · Ekim ekme dönemi, 21 Eylül) ·
hasat çemberi çerçevesi · **Advaita'nın yazdığı ritüel tanım metni** (İnanna · Kibele ·
Brigid · Baba Yaga) · Kaan'a soru: *"12 ay değil 13 ay ay döngüsü???"* · Açık Kapı
malzemeleri (mum · çakmak · defter · kalem · su).

### 🤖 BOT HATTI — 21–22 Ağustos turundan

*Sıra Kaan'ındır (22 Ağu). İlk üç madde lansmana bakar; kalanı bot borç kuyruğudur.
Tam gerekçe ve ölçümler `20-ref-bot.md`'de, tur anlatısı `90-kronoloji/2026-08.md`'de.*

⚠ **22 Ağustos akşamı bu kuyruğun dördü kapandı ya da daraldı** — biten satırlar `✅` alır,
**silinmez** (KARAR 61). Turun tam anlatısı `90-kronoloji/2026-08.md`, 22 Ağustos kaydında.

**Instagram kanalı açıldı (KARAR 538) — App Review gerekmedi, engel app'in yayınlanmamış
olmasıydı.** Privacy policy URL boştu; doldurulunca Publish açıldı ve `messages` olayları
akmaya başladı. Standard Access + tester rolü yeterli. Bot artık **iki kanalda canlı**:
WhatsApp `+90 532 555 52 26` · Instagram `@ocak.biz`.

1. ✅ 🔴 **Davet akışını aç — LANSMAN ENGELİ (B121, KARAR 535).** Önce üç şart: Cloudflare
   Turnstile + IP başına hız sınırı + davet edenin kendi adresini doğrulaması. Sonra
   `DAVET_AKISI=acik` **ve redeploy** (değer build zamanında sabitleniyor, env değiştirmek
   tek başına yetmez — KARAR 488 deseni).
   ⚠ **Kuyruğun unutulmaya en açık maddesi.** Kapalı bir yüzey hata vermez, log'a düşmez,
   kimse şikâyet etmez — yalnız sessizce yok olur. Davet kayıt akışının parçasıdır; kapalı
   kaldığı sürece **lansman tam değildir.** Musluk kapalıyken Resend maili **ve** Notion
   Davetler DB kaydı birden susuyor (KARAR 271).
   ✅ **KAPANDI (22 Ağu).** Üç şart **beklenmeden** açıldı — KARAR 537, bilinçli karar.
   `DAVET_AKISI=acik` üç ortamda, zincir uçtan uca sınandı (kutu render ✓ · Resend maili ✓ ·
   Notion Davetler DB satırı ✓). **Üç şart B132'ye devretti**, KARAR 535 iptal değil ertelendi.
   Geri dönüş: `DAVET_AKISI=kapali` + redeploy, iki dakika.
2. ✅ **Sohbet paneli (B123).** n8n workflow: webhook → Postgres → HTML. **Sıfır commit.**
   Bugün 61 turluk konuşma panelde 5 görünüyor; tek gerçek kayıt Postgres.
   ✅ **KAPANDI (22 Ağu, KARAR 536).** `panel.ocak.biz` canlı, üç sekme (sohbetler ·
   maliyet · kontrol). Eksikler **B133**'e (panel v2) devretti.
3. **Zoom kaydı süreci (B122) — LANSMAN ENGELİ.** Site vaat ediyor, süreç yok.
   **31 Ağustos'ta ilk Açık Kapı var.** Etik duvar KARAR 57 — kayıt bildirimi zorunlu.
   ⚠ **Sahip değişti (22 Ağu): Kaan → Advaita.** Bot işi değil; borç kapanmadı, taşındı.
4. **Postgres yedeği (B124).** 122+ konuşma + `ocak_gizli` secret'ları, tek volume.
   Railway'de günlük yedek açılabiliyor.
   ⚠ **Daraldı (22 Ağu): ilk yedek alındı, otomatik yedek yok.** `pg_dump`, 16 MB,
   doğrulandı, iCloud'da. **Tek seferlik fotoğraf — cron yok.** Yedek **repoya girmez**
   (kadınların konuşma metinleri; KARAR 57 md. 4). Hedef seçimi Kaan'da.
5. **Bot dili turu (B129).** Prompt sayfasının toplu elden geçirilmesi — iç mekanizma
   sızıntısı (*"Sistem bana göstermiyor"*). Ders: modele "şunu yazma" demek yetmiyor,
   kalıcı çözüm koda alınır.
6. **Kriz WA şablonu (B125).** Utility kategorisinde Meta onayı gerekiyor, **onay birkaç
   gün sürüyor — erken başlat.** KARAR 532 bu şablon olmadan yarım çalışıyor.
   ⚠ **Gönderildi ama Marketing'e düşürüldü (22 Ağu).** Meta *"utility yönergelerine
   uymuyor"* dedi. **Sonuç ciddi:** Marketing şablonları 24 saat penceresi dışında
   ulaşmayabilir — şablonun varlık sebebi tam olarak buydu. Request review gönderildi
   (metin alanı çıkmadı, gerekçesiz gitti). **İtiraz penceresi: 22 Ekim 2026.**
   Ayrıca **kriz WA hata yüzeyi kodu yazıldı (B126) ama gerçek başarısızlıkla sınanmadı** —
   test Kaan'da: `OCAK_KRIZ_WA`'ya bota hiç yazmamış bir numara ekle, kendine kriz mesajı at,
   mailde kırmızı satır ve konuda `· WA GİTMEDİ` görünmeli.
7. ✅ **Token maliyeti ölçümü (B127).** `ortak` blok ~20.500 karakter; Yetenek Evreni'ndeki
   3.740 token ölçümü bayat. Cache disiplininin (KARAR 527) işe yarayıp yaramadığı
   ölçülmeden bilinemez.
   ✅ **KAPANDI (22 Ağu).** Panelin maliyet sekmesi ölçtü: **79 çağrı · $1.58 · çağrı başına
   $0.0171 · cache okuma %71 · WhatsApp %93 / Instagram %7.** Cache disiplini işe yarıyor.
   ⚠ **Günlük tavan alarmı hâlâ yok** — ölçüm var, eşik yok; o ayak **B133**'e yazıldı.
8. **Operasyon el kitabı.** BOTZ komutları, arıza akışları, rotate prosedürü.
9. **GELaiL hijyeni + n8n/Railway envanteri.** Router Notion bağımlılığı, credential
   rotate, sahipsiz değişkenler, `IG Bot` `max_tokens` 1024 (WhatsApp'ta 600'e çekilmişti,
   IG'de kalmış), `DB_POSTGRESDB_HOST` public/private, Advaita'nın kill switch yetkisi.
   ⚠ `IG Bot` `max_tokens` **600'e çekildi (22 Ağu)** — duran o ayak kapandı, kalanı durur.
   Secret hijyeni ayrı borç oldu: **B138.**


### 🎯 LANSMANA KALAN ÜÇ İŞ (22 Ağustos turundan)

*Bot hattının kuyruğu yukarıda duruyor; bunlar **31 Ağustos'a** bakan üç iş.*

1. **Bot dili turu (B129).** Notion prompt sayfası **toplu** elden geçirilecek, parça parça
   değil. İç mekanizma sızıntıları (*"sistem bana göstermiyor"*). Kadının gördüğü yüzey;
   **31 Ağustos'ta ilk kez gerçek kadınlar yazacak.**
2. **Ses kalite testi.** Temiz bağlamla yeniden (Yetenek Evreni §10).
3. **Lansman sıfırlaması.** Site açılmadan **hemen önce** `ocak_konusma` + `ocak_token_log`
   boşaltılır; **öncesinde kapanış ölçümü alınır.**
   ⚠ Panelin maliyet sekmesi bu ölçümü artık **tek ekranda** veriyor (KARAR 536).

**Bekleyen dış süreçler** — Kaan'dan bugün eylem istemiyor:
`ocak_kriz_devri` itirazı (22 Ekim'e kadar, B125) · `panel.ocak.biz` sertifikası ·
davet maili canlı doğrulaması (deploy sonrası).

⚠ **Bot adı kararı (KARAR 541, ONERI) kayıt açılmadan önce verilmeli** — *Ocak Kadın
Topluluğu* tercih edildi ama **uygulanmadı**; değişiklik kadınların gördüğü sohbet
başlığını etkiler.



1. ✅ **Notion `Kayıtlar` alanları AÇILDI** (10 Eyl, Kaan) — `Beklenen Tutar` (number) +
   `Mail Gitti` (checkbox). 2. maddenin ön koşulu **doldu**. ⚠ Şema referansı
   `20-ref-notion.md` bu iki alanı da saymıyor — **B187**.
2. **n8n ödeme onayı akışı** (Kaan) — `Ödendi` + `Mail Gitti` boş → MailerLite
   `odeme_durumu=alindi` → detay maili → `Mail Gitti` ✓. **Sıranın en kritik
   maddesi:** bu kurulana kadar detay mailleri **elle** gidiyor. `odeme_durumu`'nun
   üçüncü değerini hiçbir kod yazmıyor — kapı doğru çalışıyor, açan mekanizma yok.
   **İdempotency işareti şart**, yoksa her gece aynı mail gider.
   *Borç kaydı yok — ürün işi (`02-borclar.md` ürün kuyruğu taşımaz).*
3. **Success ekranına kopyalama tuşları** (CC) — IBAN · tutar · kod, **üçü ayrı**.
4. **Kayıt sonrası WhatsApp** (Kaan + CC) — `wa.me` butonu → 24 saatlik pencere →
   ödeme bilgileri ücretsiz serbest metin olarak. B19 display name hattına bağlı.

### 🔶 KAAN'DA BEKLEYEN GİRDİ — borç değil, girdi

Üç gövde canlıda ama **künye alanları boş**. Bunlar tartışma değil, veri; gelmeden
sayfalar tamamlanamaz.

- **Kakao × 2:** başlık · tarih · saat · kapasite · ücret · kayıt kapanışı ·
  tedarikçi adı (KARAR 505 gereği **sayfada değil, kayıt sonrası mailde**) ·
  online kayıt kapanışının **kargo süresine** bağlanması · yüz yüze **akşam mı yarım
  gün mü** (akşam varsayıldı; gün olursa **üç dize değişir** — `ne-olur` H2, üçüncü
  kayıt sorusu, `giris`) · mat/minder mekândan çıkıyor mu.
- **Ritüel Tasarımı:** kapasite (12–16 önerildi) · kayıt penceresi (**borç değil** —
  B102 kapandı, alan opsiyonel; etkinlik başına tercih) · tema alanı ·
  **ödev sorusunun metni** ·
  MailerLite ödev kampanyası metni ve gönderim zamanı (KARAR 512 — ilk oturumdan
  3–4 gün önce, welcome mailine **girmez**).
- ⏸ **Kayıt sonrası e-posta bekçinin beşinci çıktısı olsun mu** — Kaan **askıya aldı**,
  karar değil. ⚠ Geriye dönük yük: Açık Kapı'nın **altı**, Çember'in **dört** sayfası
  için bu e-posta **hiç yazılmadı**.

### 🔶 ADVAITA'DA BEKLEYEN ONAY

- Yüz yüzede **ortadaki alana nesne bırakılıyor mu** — gövdede *"bırakırsın"* yazılı,
  Kaan teyidi var, **Advaita teyidi yok**.
- **Kartın anlamı** doğru anlatıldı mı (*"kişiye özel değil, hepimize birden"*).
- ⚠ **Ritüel Tasarımı gövdesinin hiçbir bölümü Advaita'ya gösterilmedi.**
- ⏳ **Ritüel Tasarımı ön görevi — cevap gelmedi (B178).** 23 Ağustos'ta *"bizim evde ne
  yapılırdı"* cümlesi silindi, **ön görev programda bırakıldı**, gerekçe Advaita'ya yazıldı.
  Onaylarsa kalır, onaylamazsa **görev de kalkar.** ⚠ Cevapsız kalırsa görev sessizce kalıyor —
  yani varsayılan hâl "onaylandı" gibi davranıyor, oysa açık bir karar yok.

### Notion veri hijyeni — küçük, ertelenmez (KARAR 104)

- **Planlama takvimi view'ı** (Kaan · ~1 dk) — Etkinlikler DB'ye ikinci takvim
  view'ı: filtre `Durum is not İptal`, Yayınla filtresi **yok**. Mevcut
  `Sitede Göster is checked` view'ı "site aynası" olarak kalır. KARAR 515.
- **Hafta başlangıcı** (Kaan + Advaita · ~1 dk) — Settings → Preferences →
  Language & Time → *Start week on Monday*. **Hesap ayarı, workspace ayarı
  değil**; ortak takvim konuşulacaksa ikisinde de açık olmalı.

### Faz 2 — dışarıdan bekleniyor, başlayamaz

5. **VakıfBank portal uygulaması onayı**; `accountList` + `accountTransactions`
   API Management'tan eklenecek.
6. **`Description` alanı testi** — servis çıktısı gönderenin açıklamasını kırpıyor
   mu. KARAR 489'un "elle yazılabilir kod" gerekçesi buna dayanıyor.
7. **Uyumsoft `SendInvoice`** + mükellef sorgusu (e-Fatura / e-Arşiv ayrımı).
8. **Muhasebeci cevabı** — fatura zamanı · e-ticaret serisi · KDV oranı · **adres
   zorunlu mu** · KVKK-saklama çakışması. Adres cevabı gelirse kayıt formundaki
   konum bloğu baştan tasarlanır (İl + İlçe + açık adres) ve `Şehir` alanının
   serbest-metin yapısı o turda değişir.

⚠ **Faz 2 hesabı: `TR63 0001 5001 5800 7391 5595 37`.** İlk API testinde kullanılan
`TR62 … 7312 3179 27` **farklı hesaptır** — karıştırılırsa eşleştirme boş döner.

⚠ **B79** — Faz 2'nin eşleştirme regex'i **üç** referans formatını tanımak zorunda
(`OCAK-XXXXX` · `OCAK-XXXXXX` · `OCAK-XXXX`), uzunluğa göre ayrıştırma yapılamaz.

---

**Sıra kararı — 19 Ağustos 2026 (docs-patch-2026-08-19).** Doküman hattı; yukarıdaki
ürün sırasıyla **paralel** yürür, biri ötekini beklemez. Öncelik sırasıyla:

1. **B64 — deploy hook URL geçişi** (Kaan). **Kuyruğun başı.** Bu kapanmadan Notion
   içerik güncellemeleri siteye düşmüyor; her yayın için elle boş commit gerekiyor.
   Bir işi değil, **bütün içerik hattını** bloke ediyor.
2. **B69 — MailerLite şablon değişkenleri** (Kaan). Sonrası: otomasyon durumu netleşir
   (aktif mi pause mu) ve gerekirse aktive edilir.
3. **B68 — `pratik-bilgi` altı satır** (Claude.ai → Notion). Havale gerçeğiyle hizalama;
   bekçi dosyalarına ücretli/ücretsiz varyant ayrımı girer.
4. **n8n ödeme onayı akışı** (Kaan). `odeme_durumu = alindi` yazımı. **Bu olmadan Mail
   2/3 hiç tetiklenmiyor** — ödeme gelince link elle yollanıyor. Brief hazır, verilmedi.
   Notion `Ödeme Durumu` değişimi → MailerLite alan güncellemesi; **idempotency işareti
   şart**, yoksa her gece aynı mail gider. *Borç kaydı yok — ürün işi (bkz. `00-durum.md`
   uyarısı: ürün kuyruğu `02-borclar.md`'ye girmez).*
5. **B65 — zip yüklemesi** · **B72 — test verisi temizliği** (ikisi de Kaan).
   B72 sırası önemli: erken temizlik Y1/kapı doğrulamalarının zeminini siler.
6. **B74 — iPhone Safari eyeball** (Kaan). **KISMİ:** kayıt sayfası ayağı 19 Ağu'da
   görüldü ✅; **`/etkinlik/[slug]` mobil ritim ayağı hâlâ açık** — borcun doğuş
   sebebi oydu. Kapanış şartı bilerek daraltılmadı.
7. Üçüncü seremoni sayfası → **B66 seremoni bekçisi** (Claude.ai).
8. **Atölye formatı** — başka sohbette başladı, bekçisi ayrı.

*Tek turluk temizlik, sıra dışı: **B67** (`ornekler-cember.md` tek dosya) · **B70** ·
**B71** (ikisi de Notion nokta patch'i). Kendi turlarını beklemezler, önlerine gelen
Notion turuna binerler.*

---

**Sıra kararı — 19 Ağustos 2026, B turu (`docs-patch-2026-08-19b`).** Sosyal medya /
lansman hattı. Yukarıdaki iki sırayla **paralel** yürür. **37 gün** (AÇILIŞ 24–27 Eylül,
KARAR 492) bu hattın tamamını süreye bağlıyor.

1. ✅ **Gün 0 kurucu görsel** *(Kaan)* — **tek gerçek üretim darboğazı.** Çıkmadan Gün 1
   yok (KARAR 450). `KURUCU-URL` ara-değiştir buna bağlı.
   ✅ **KAPANDI (23 Ağu, KARAR 542).** Görsel üretildi ve mühürlendi — `--sref` çapası +
   `--v 8.1` motor kilidi. Yedi tur sürdü, altısı elendi; kazanan formül **tepeden bakan
   kül + noktasal kor + düşük stylize.** **B114 kapandı.**
   ⚠ **`KURUCU-URL` ara-değiştir hâlâ açık** — URL mühürlendi ama `30-sosyal.md` Bölüm 16'nın
   V01–V09 seti dosyada eski hâliyle duruyor. Darboğaz kalktı, **ara-değiştir kaldı.**
2. **Fiyat bandı** *(Kaan + Advaita)* — mekân (**B84**), dar hat ve C05 metni buna bakıyor.
3. **`/etkinlik/yolculuk-acilis` gövdesi** *(Kaan · Notion)* — **B81.** Bugün karara
   bağlanan AÇILIŞ sayfası sitede içeriksiz duruyor.
4. **K2 — sosyal ana sahne kararı** *(Kaan)* — **B83.** Eylül duyurusu hangi hesaptan
   çıkacak; v2 kararı vermeden (a)'yı uyguladı.
5. **CC turu — extractor düzeltmesi** *(CC, tek commit)* — **B82.** Çalışan diff hazır;
   ikinci CC oturumu kapandıktan sonra, ROUTES hunk'ı hariç.
6. **robots Allow + Gün 1** — 1–4 kapanınca. ⚠ Yukarıdaki **iade cümlesi ön koşulu**
   bu maddenin de önünde durur; ilk sosyal post duyurudur, yani Gün 1 aynı zamanda
   robots kararıdır (KARAR 149).
7. ✅ **Kart derleyici sınaması** *(Kaan + Claude, gözle)* — **B86.** İlk gerçek görselle;
   fotoğrafsız zemin kararı.
   ✅ **KAPANDI (23 Ağu, KARAR 546).** C01 kartı gerçek zeminle basıldı. Fotoğrafsız zemin
   **yedek değil tasarım** oldu; iki zemin tipi ayrı ön ayar taşıyor, karışmıyorlar.
   Araç repoya alındı — `tools/ocak-kart-derleyici.html`, altı gömülü ön ayar.
   ⚠ **Aracın `kartAdi()`'si KARAR 552 şemasıyla hizalı değil — B169.** Koda dokunur,
   ayrı tur; bu turda bilerek bırakıldı.
8. **Zemin envanteri açıldı** *(23 Ağu, KARAR 552)* — `docs/31-zemin.md`, yedi zemin
   (z01–z07) MJ iş kimliği + ölçümleriyle. **z01 ve z02 mühürlü.** ⚠ Yedisi de yalnız
   MJ CDN'inde + yerel diskte — **B170** (B141'in genişlemesi).
9. **Karusel zemin kuralı** *(24 Ağu, KARAR 556)* — zemin **yüzey** olur, nesne olmaz.
   C24 düzeltildi (V03 kapı → **V01** kül). ⏱ **C09 karar bekliyor — B172, dokuzuncu gün,
   V04 üretilmeden bağlanmalı.** C20 aynı ihlal, dördüncü hafta — **B173**.

**Sıra madde 2'ye düştü — fiyat bandı** *(Kaan + Advaita)*. Madde 1 ve 7 kapandı (23 Ağu).
⚠ Gün 1'in önündeki engeller **değişmedi**: robots kararı (KARAR 149 — ilk sosyal post aynı
zamanda robots kararıdır) · iade cümlesi ön koşulu · **B83** (sosyal ana sahne) · **B85**
(üç kayıt cümlesi sözlü teyidi). C01 kartı **basıma hazır ama yayınlanabilir değil.**

*Sözlü kapı bekleyen tek kalem: **B85** (C05 · C11 · C20 kayıt cümleleri, ~1 dk).
Sıraya girmez, önüne gelen konuşmaya biner.*

✅ **`Social_Media_v2.1.md` repoya alındı** — `docs/30-sosyal.md`. Desktop kopyası
artık ayna; çelişkide repo kazanır (KARAR 471).

---

**Sıra kararı verildi (8 Ağustos akşamı, 9 Ağustos'ta yazıldı):**
**ADIM 7 ikinci dalga A+B ✅ → B01 ✅ → B47 ✅ → B40 · B55 · B56 ✅ → hold.**

⚠ **Kapı kapandı, kuyruk boşaldı.** Yazılı ölçüt: **kapı → yayını kilitleyen → tek
turluk → kendi planını isteyen**. Kapı bitti; yayını kilitleyen üç halkanın üçü de
doküman dışı cephelerde ve sahibi Kaan. Doküman hattında sırada **tek turluk** işler
var. **B47 ✅ → B40 · B55 · B56 ✅ (11 Ağu).** KARAR 482 üçünü tek turda kapattırdı;
bir kuralın işe yaradığının ölçüsü açık borçları ucuzlatmasıdır. Sırada **B44**
(bayat `@ocak.life` taraması, tek turluk) ve **B45** (tek satır, gövdesi öyle diyor).
Bekletmenin maliyeti olan tek borç **B36-b** — 71 kararın kronoloji kaydı hiç yazılmadı
ve hatırlanarak yazılacak; diğerleri bugün ne kadar pahalıysa altı ay sonra da o kadar.
Seçim Kaan'ın; bu satır sırayı önerir, dayatmaz.

✅ **`00-durum.md` cap'i tahliye edildi (11 Ağu, 184/200).** ADIM 1–6 blokları
`90-kronoloji/2026-08.md`'ye **taşındı**, silinmedi (KARAR 61 · 457). "Kendi turu
gerekir" denmişti; gerekmedi — kapanış patch'i cap'e dayandığı için tahliye zorunlu
oldu ve aynı turda yapıldı. **Bakım kendi turunu bekleyemez, işi bloke ederse öne geçer.**

⚠ **"Fırsat buldukça" bir kuyruk değildir.** İkinci dalga bittiğinde geriye yalnız
borçlar kalıyor — **açık iş sayısı `02-borclar.md` başlık sayacında yaşar, burada
tekrar edilmez** (KARAR 484). *(11 Ağustos'ta bu satır "31 açık iş" diyordu ve
yöntemini de taşıyordu: `^## B` başlıkları 60, damgalı 27, iş-değil 2. Rakam
19 Ağustos'ta bayatladı — 74 madde · 45 açık. Sayı iki yüzeyde yaşadığı için
bayatladı; tarihsel kayıt olarak duruyor, otorite artık tek yüzeyde.)* Sıra
ölçütü: **kapı → yayını kilitleyen → tek turluk → kendi planını
isteyen**, sahibe göre üç paralel hat. Aşağıdaki tablo o sırayı taşır.
B44 ve B47 borç kuyruğunda bekler; kapanmaları için ayrı tur açılır.

**ADIM 6** ✅ — `ocak-kararci` · `ocak-metin` · `ocak-notion` doğdu (9 Ağustos).
Kadro altıya tamamlandı. Sınırlar mühürlendi: KARAR 475 · 476 · 477.
`ocak-notion` sahipsizliği çözüldü — sapma kaydı EK 11. satırı kapandı.

**B44** — bayat `@ocak.life` taraması, **canlı `docs/` dosyalarında**. İlk deneme bayat
dosyada koşuldu, bulguları taşınamaz. Sınıflandırma tablosu + ESKİ→YENİ patch tek turda.

**B47** — "ne nerede yaşar" haritası. En küçük iş, en geniş etki: bağlamı olmayan her
sohbet bugün dosyaların birbirine göre rolünü bilmeden başlıyor.

**B36-b beklemede.** Cinsi değişti (kayıt yazma, çapa düzeltme değil) ve büyüdü
(71 kayıtsız karar). Tek turluk iş değil; kendi planı yapılmadan açılmaz.

**Fikir kuyruğu kayda alındı — 19–20 Ağustos (`docs-patch-2026-08-19c.md`).** **B108–B120**
açıldı (patch B103–B115 önermişti; iki tur araya girdi, +5 kaydırıldı). Hiçbiri mevcut üç
hattın (ürün · doküman · sosyal) önüne geçmez. İçlerinden yalnız ikisi tarih baskılı:
**B118 + B119** (banner ile atomik) ve **B114** (Gün 0 kurucu görselin önkoşulu).
Kalanlar sahibine göre kendi hattında erir. Açık iş sayacı `02-borclar.md` başlığında yaşar.

**Patch'in Bölüm 4–5'i 20 Ağustos'ta yerleşti** (Kaan kararı): beş fikir → bu dosyanın
sonundaki **FİKİR HAVUZU**, beş karar adayı → **KARAR ADAYLARI**. İkisi de sıra değildir,
kuyruğun önüne geçmezler. **Hiçbiri mühürlenmedi — ledger `523`'te sabit.**
*(19 Ağustos'ta bu satır "nereye yazılacakları karar bekliyor" diyordu; yer kararı verildi.)*

---

## DOKÜMAN KUYRUĞU

| # | iş | kim | nerede | ön koşul | nasıl açılır |
|---|---|---|---|---|---|
| 1 | **ADIM 5** ✅ — `ocak-arsivci` · `ocak-teshis` · `ocak-lint` + `skill-sync.sh` + B42 | CC | repo | — | kapandı 8 Ağu |
| 2 | **B39** — `ocak-kaynak-kanonu.md` + `Ocak-Mufredat.md` dağıtımı (447 satır, evsiz) | Claude.ai | ayrı sohbet | yok | `02-borclar.md` B39 — B32 deseni |
| 3 | **B35** — KARAR 87 üç ayrı şeye atfediliyor; `00-durum.md` ODA_MAP işaretçisi kırık | Claude.ai | ayrı sohbet | yok | kronoloji dilimleri + ledger |
| 4a | **B36-a** ✅ — mekanik desen ölçüldü; `#k` terfisi KARAR 466 gereği mümkün değil, yöntem yetersiz çıktı (2/5) | CC | repo | — | kapandı 8 Ağu |
| 4b | **B36-b** — 71 sığ kararın kronolojide kaydı hiç yazılmamış; iş çapa düzeltme değil **kayıt yazma**. Tek turluk değil, kendi planı gerekir | Claude.ai | ayrı sohbet | B36-a ✅ | beklemede — `02-borclar.md` B36 + `_uretilen/b36a-rapor.md` |
| 5 | **251** — ledger'ın son `TEYITSIZ` satırı, kaynak metni bulunamadı | Claude.ai | B36 ile birlikte | yok | `2026-06.md` #38 bloğu |
| 6 | **ADIM 6** ✅ — `ocak-kararci` · `ocak-metin` · `ocak-notion` | CC + Claude.ai | repo | ADIM 5 | kapandı 9 Ağu |
| 7 | **ADIM 7 birinci dalga** ✅ — `mcp/` + üç araç, Railway'de canlı, claude.ai'ye bağlı | CC | Railway | — | kapandı 9 Ağu |
| 7b | **ADIM 7 ikinci dalga A+B** ✅ — `docs_karar(no)` + B54; KARAR 480 · 481 | CC | repo + Railway | 7 ✅ | kapandı 9 Ağu |
| 7c | **ADIM 7 kalan iki parça** — B53 (bağlantı ucu, beta bekliyor) + B51 (B53'e bağlı) | Kaan + CC | Railway + repo | **B53 beta** | `02-borclar.md` B51 · B53 — kendi hatlarında |
| 9 | **`20-ref-bot.md` WABA profil bloğu** — KARAR 520 kanonu + iki hattın ad/numara/metin tablosu + hazır uzun açıklama (309 kr). Şu an bu bilgi yalnız kronolojide, referansta değil. Aynı turda **B103** çelişkisi de düzeltilir | Claude.ai | ayrı sohbet | B103 için Meta ret geçmişi | `90-kronoloji/2026-08.md` WABA bloğu + `02-borclar.md` B103 |
| 8 | **B38** — ledger çapa denetimi (terminal kontrol) | Claude.ai | ayrı sohbet | ADIM 7 **+ B36-a** | `02-borclar.md` B38. Ön ölçüm ADIM 4'te yapıldı (isabet %57); B38 onu tekrarlamaz, mekanik onarımın oranı ne kadar oynattığını ölçer |

**Kapı işi: B01 ✅ (10 Ağu)** — klon/remote/Vercel adı üçü de `ocak` oldu. Tek tur,
tek commit `50294e6`, canlı yol referansları 13 → 3.

⚠ **Bu satır "ucuz, tek turluk" diyordu; `02-borclar.md` "maliyet küçük değil" diyordu.**
İki dosya çelişiyordu ve borçlar dosyası haklıydı: iş tek tura sığdı ama içinde dört
sapma, iki yanlış brief iddiası ve üç ayrı dış sistem teyidi vardı. **Aynı işin iki
dosyada iki farklı maliyet tahmini taşıması B47'nin (harita) gerekçesidir** — hangi
dosyanın hangi konuda otorite olduğu yazılı değil.

**Üç hat paralel yürür** — sahip dağılımı `02-borclar.md`'nin **gövdelerinde** yaşar,
`03-sira.md` tekrar etmez. ⚠ O dosyanın sahip tablosu bir **indekstir**, otorite gövdelerdir
(KARAR 482 kural 1a). Tablo gövdelerden türetilir; çelişkide gövdedeki
`**Sahip:**` satırı geçerlidir.

⚠ **B48 ikinci dalgadan önce kapatılmaz** — `baglam.sh` küçülecek, manifestin şekli
değişecek; erken kapatılırsa iş iki kez yapılır. B51 ile birlikte kapanır.
⚠ **B51 MCP bağlanana kadar koşulmaz** — bağlantı ucu geçici olduğu sürece `baglam.sh`
tek güvenilir kanal.
**B36-b · B39 kendi planını ister.** **B38 tanımı gereği sonuncudur** (ön koşul: ADIM 7 + B36-a ✅).
**B30 🔒 dokunulmaz** — `EtkinlikKart.astro:80-82` silinmez.
**B36-a ADIM 5 ile birleştirilebilir** — ikisi de CC, ikisi de repo, ikisi de betik işi.
B38 tanımı gereği sonuncudur ve artık B36-a'ya da bağlıdır.

---

## KOD KUYRUĞU

Sahip: CC. Detay `02-borclar.md`'de.

- Takvim `hashchange`/`pageshow` eki (B03 · KARAR 391 — `ACIK-BORC`)
- Turnstile
- Safari banding
- İlk hafta paketi

---

## DOKÜMAN DIŞI CEPHELER

Bunlar doküman turuyla ilerlemez; kendi hatlarında yürür.

| cephe | sahip | durum |
|---|---|---|
| **B19** — WhatsApp display name | Kaan | **Kuyrukta kalır, kapsamı daraldı.** `…5226`'da "Ocak Kadın Çemberi" **onaylı** (19 Ağu); kalan iş yalnız `…0888` — ad başvurusu KARAR 521. (Numara yayını buna bağlı değil — KARAR 396 kapandı, hat canlı) |
| **B103** — "OCAK" adı iki beyanda çelişiyor | Kaan (~5 dk) | Meta Manager ret geçmişi + **gerekçe metni** okunacak; `_arsiv/20-ref-bot-2026-08-06.md:41` (eski `20-ref-bot.md:13`, 22 Ağu'da arşive taşındı) ile KARAR 410 uyuşmuyor |
| **B104** — `…0888` hattı WABA değil | Kaan | Hat açılır → ad onayı (KARAR 521) → bot bağlanır → **canlı round-trip** ile kapanır. Site kodu değişmez |
| **Sosyal v2 `[KAAN]` önkoşulları** — kurucu görsel + `KURUCU-URL` | Kaan | Gün 1 yayını bunsuz başlamaz (KARAR 450) |
| **Yolculuk fiyat bandı → ilk Yolculuk etkinliği** | Kaan + Advaita | Eylül kohortu duyurusunun önkoşulu |
| **Ödeme** — banka sanal POS | Kaan | entegratör belirsiz, `payment-provider.ts` stub |
| **B50** ✅ — claude.ai skill yüzeyi (altı zip yüklendi) | Kaan | kapandı 9 Ağu — bakım: skill dokunuşundan sonra `sync` + yeniden yükleme. ⚠ Bayatlığın bedeli dosyanın taşıdığına göre değişir: **yol** bayatlığı gürültülüdür (CC `cd` yapamaz, durur), **kural** bayatlığı sessizdir (`yasak-dizeler.tsv` yanlış listeyle geçer). Sessiz sınıf önce yüklenir. `--check` yüklemeyi **ölçemez**, yalnız zip'i denetler (10 Ağu) |
| **B53** — MCP yol-token ödünü: token URL yolunda taşınıyor, çünkü claude.ai connector diyaloğu başlık kabul etmiyor (Request headers beta, bu hesapta kapalı) | Kaan (beta erişimi) + CC (kaldırma) | ⚠ **açık ve kendiliğinden kapanmaz** — beta açıldığı gün başlığa geçilir, yol ucu koddan kaldırılır |
| **B57** — connector araç listesi bayatlıyor: sunucu ilerler, claude.ai şemayı tazelemez, hata vermez | Kaan | bakım kuralı: yeni araç eklenen turun son adımı connector'ı kapat-aç |
| İçerik tarama turları (Uluslararası sweep, "sembolik ücret") | Claude.ai → Notion | sırasız |

---

## LANSMAN

**Tanım (KARAR 149):** lansman = `robots` Allow + duyuru. Sitenin canlı olması değil —
site zaten stealth-canlı.

**Hedef:** Eylül 2026, Anadolu Yolculuğu açılış kohortu.

**Kilit zinciri:** `00-durum.md` "YAYINI KİLİTLEYENLER" · sahipler `02-borclar.md`'de.
Üç halkanın üçü de doküman dışı cephelerde.

---

## BAKIM KURALI (KARAR 468)

Sohbet sonu patch'i **beş** bölümlüdür — KARAR 462'nin dördüne bu dosya eklendi:

1. `00-durum.md` — hedefli blok değişimi
2. `01-kararlar.tsv` — append + durumu değişen satırlar
3. `02-borclar.md` — kapanan / açılan
4. `90-kronoloji/YYYY-AA.md` — append
5. **`03-sira.md` — kuyruk sırası, biten `✅`, yeni iş eklenir**

**Bölüm sırası bağlayıcıdır.** `00-durum.md`'nin *dönem HEAD* satırı patch'in **son**
bölümünde güncellenir — ortada yazılırsa sonraki bölümlerin commit'leri onu geçer ve
satır doğduğu anda bayatlar. Aynı kural rakam taşıyan her satır için geçerli: satır
sayısı, commit sayısı, dosya boyutu **en son ölçülür** (KARAR 470).

⚠ **Sıfır sapma hedeflenmez (KARAR 474).** Satır kapanış commit'inden bir önceki
commit'i taşır; fark tam olarak bir commit'tir ve sabit nokta gereği sıfıra inemez.
Doğrulama `git log -2 --format='%h' | tail -1`.

Bu dosya **kısa kalır.** Gerekçe yazılmaz, durum tekrar edilmez, tarih anlatılmaz —
üçü de kendi dosyasında yaşar. Şişerse yanlış kullanılıyordur.

---

## BİTENLER

- **19 Ağustos — WA yüzen buton turu ✅** (3 kod commit + bu patch)
  Buton mobilde `© 2026` satırını kapatıyordu; footer'a duyarlı fade geldi
  (**KARAR 517** — `IntersectionObserver`, `.gizli`, gecikmeli `visibility`).
  Süre ayrı commit'te `--duration-slow` → `--duration-base` çekildi; hover
  kalkışının da hızlanması bilinçle kabul edildi. Numara **Ocak hattına döndü**
  (`905325555226`) ve **KARAR 396 kapandı** — şart hat kimliği değil bağlama
  sırasıydı, sağlandı. Yasal beş sayfanın telefonu bilerek kalmasıyla
  **KARAR 518** doğdu: bot hattı ve yasal telefon iki ayrı yüzeydir.
  Brief'in üç sapması düzeltilerek uygulandı (token ezilmesi · özgüllük
  sırası · reduced-motion daraltması). `20-ref-bot.md`'nin iki bayat numara
  satırı düzeltildi — brief'i yanlış besleyen kaynak buydu.
  → `90-kronoloji/2026-08.md`
- **19 Ağustos — çok oturumlu etkinlik kalıbı ✅** (sıfır commit, claude.ai)
  Notion `date` aralığının operasyon takvimini bozduğu ölçüldü; **kayıt satırı +
  gölge satır** kalıbı kuruldu. `Yayınla`'nın görünürlük kaynağı sanılması
  düzeltildi (view sözleşmesi yazıldı). KARAR 514 · 515 · 516 mühürlendi.
  B101 açıldı. Brief'in ikinci borcu (Ritüel Tasarımı tarih aralığı) **yazılmadı** —
  öncülü KARAR 509'la çelişiyordu. **Ölçümle kapandı:** satır zaten 514 kalıbındaydı
  (3–10 Ekim, iki ardışık cumartesi). Yerine **B102** açıldı — ölçümün kendi bulduğu
  boşluk: 25 ücretli kaydın 25'inde `Kayıt Kapanış Tarihi` ∅. **B102 aynı turda
  kapandı** (Kaan: alan opsiyonel, fallback davranışı kabul). KARAR 514'ün gölge
  başlığı tarifi gerçeğe çekildi. → `90-kronoloji/2026-08.md`
- **17–19 Ağustos — ÜÇ FORMAT ✅** (tek doküman commit'i, sıfır kod)
  Açık Kapı bekçisi mühürlendi (altı gövde) · Seremoni iki gövde · Atölye bir gövde;
  **üçü de canlıda**. Bekçi mekaniği sekiz kararla yazıya geçti (**KARAR 496–503**) —
  "çember" kelimesi, çerçeve kuralı, H2, köz yasağı, kod bloğu teslimi, kayıt soruları,
  `pratik-bilgi` ölçü değil, ritim CSS kapsamı. Seremoni beş (**504–508**), Atölye dört
  (**509–512**). **KARAR 79 SUPERSEDE** — Ritüel Tasarımı seri program değil, iki
  oturumluk tek atölye. Üst karar **KARAR 513**: türev yüzey kaynaktan yeniden
  üretilmediğinde yalan söyler — beş yüzey aynı gün bayat çıktı, **beşincisi bu turun
  brief'iydi.** Brief'in beş iddiası ADIM 0 ölçümüyle yanlışlandı; üç borç maddesi
  yanlış öncülle düştü, bir "kapanan madde" borca döndü (**B100**).
  Yeni borç: **B88–B100** (on üç). → `90-kronoloji/2026-08.md`
- **19 Ağustos — FAZ 1 ✅** (8 commit: 6 kod, 2 doküman)
  Kart akışı `KART_AKISI` ile kapatıldı, kod silinmedi (**KARAR 488**). Referans kodu
  `OCAK-XXXX`'e indi — 29'luk alfabe + 15 maddelik kara liste (**489** · **490**).
  Havale açıklamasından isim çıktı, satır saf ASCII. Forma **Soyad**, sunucuya
  **Şehir** ve **Telefon** kapıları; `last_name` canlı aboneden teyitli (**B76 ✅**).
  `A.Ş.` kırılması CSS'ti, düzeldi. Geçersiz alan kaydırması bir kez kör uygulanıp
  canlıda kapanmadı → `nav-kaydir.ts` ortak yardımcısı (**KARAR 491** bu hatadan doğdu;
  mekanizma **KARAR 395**'in uygulaması, yeni karar değil).
  Test 193 → **246**. Yeni borç: **B77** · **B78** · **B79**. **B74 kısmi.**
  → `90-kronoloji/2026-08.md`
- **11 Ağustos (ikinci tur) — B40 · B55 · B56 ✅** (1 commit, sıfır site kodu)
  KARAR 482'nin ilk uygulaması: üç borç da "önce karar" şartını düşürdü ve tek turda
  kapandı. `61/88` → `61` (88 KIRPMA'nın halefi, kardeşi değil). Sahip tablosu
  gövdelerden türetildi, beş bayat kalem çıktı. Ledger düzeltildi, kronoloji şerh aldı.
  **KARAR 483** mühürlendi — düzyazı rakamı kendi gövdesiyle sınanır, dört ölçülmüş vaka.
  Dört satır bilerek bırakıldı (iddia satırdan görünmüyordu). `00-durum.md` cap'i
  aynı turda tahliye edildi. → `90-kronoloji/2026-08.md`
- **11 Ağustos — B47 ✅ harita + B58 ✅** (1 commit, sıfır site kodu)
  `05-harita.md` doğdu — liste değil **otorite sırası** (ham gerçeklik → kronoloji →
  gövde → indeks → ayna) + dosya sözleşmeleri. **KARAR 482** mühürlendi: indeks,
  indekslediği gövdeyi asla yenmez. B40 · B55 · B56 mekanik yazıma indi.
  B47'nin "harita hiçbir dosyada yok" başlığı ölçümle yanlışlandı — iki kısmi harita
  vardı; üçüncü vaka. B58 kapandı: `branchAlias` proje adından yeniden türedi, teşhis
  yanlıştı. → `90-kronoloji/2026-08.md`
- **10 Ağustos — B01 ✅ kapı** (1 commit, sıfır site kodu)
  Klon · remote · Vercel proje adı üçü de `ocak`. Canlı yol referansları 13 → 3
  (kalan üçü bilerek korundu, sıfır kriteri yazılamazdı — KARAR 465'in ikinci vakası).
  Vercel bağlantısı `githubRepoId` üzerinden kırılmadı, Railway/MCP sağlam, ikisi de
  ölçüldü. CC dört sapma bildirdi, dördü de haklı. Yeni borç: **B58** (`.vercel.app`
  domainleri proje adıyla yenilenmiyor — KARAR 389'un ikinci teyidi) · **B59**
  (`20-ref-site.md:78` tarihli blokta iki bayat) · **B60** (skill kaydı dizin adı
  değişince kırılıyor). Ledger'a satır eklenmedi.
  → `90-kronoloji/2026-08.md`
- **9 Ağustos (ikinci tur) — ADIM 7 ikinci dalga A+B ✅** (3 commit, sıfır site kodu)
  `docs_karar(no)` doğdu, dört araç oldu. **B54 kapandı** — envanter kapsamını ve dağıtım
  ödününü söylüyor. KARAR 480 (çapa sözleşmesi iki eksenli) · 481 (ölçüm aracı kusuru
  bayrakla döndürür) mühürlendi. B56 · B57 açıldı.
  Ledger sığlığı **126/418** ölçüldü (b36a'nın 119'u doğrulandı, +7 komşu-satır yeni).
  C parçası (B53) beta yokluğundan düştü; D (B51) ona bağlı olduğu için koşulmadı.
  → `90-kronoloji/2026-08.md`
- **9 Ağustos — ADIM 7 birinci dalga ✅** (7 commit, sıfır site kodu commit'i)
  `mcp/` doğdu: `docs_envanter` · `docs_oku` · `docs_ara`, Streamable HTTP, zorunlu Bearer.
  Railway'de canlı, claude.ai'ye bağlı, bu turda gerçekten kullanıldı.
  KARAR 478 (sohbet sonu ikinci teslim) · 479 (MCP git deposunu servis eder) mühürlendi.
  B51 · B52 · B53 · B54 · B55 açıldı. `scripts/dump-fable.mjs` izlemeye alındı.
  ⏸ İkinci dalga: `docs_karar` + B53 bağlantı ucu + B54. → `90-kronoloji/2026-08.md`
- **9 Ağustos — ADIM 6 ✅** (4 commit, sıfır site kodu commit'i)
  `ocak-kararci` · `ocak-metin` · `ocak-notion` doğdu; kadro altıya tamamlandı.
  KARAR 475 (kararci↔arsivci sınırı) · 476 (metin↔lint sınırı) · 477 (notion dar
  kapsam) mühürlendi. B48 · B49 açıldı. Sıra kararı yazıldı: ADIM 7 sonra, hold.
  → `90-kronoloji/2026-08.md`
- **8 Ağustos (öğleden sonra) — üç iş**
  **B44-a ✅** `062f03b` — lint kapsam çelişkisi, tarihsel kayıt muafiyeti (KARAR 465).
  **Arşiv ✅** `7fc2ac1` — 17 brief `_arsiv/2026-08-dokuman` + `2026-08-site`.
  **B36-a ✅** `c6a969b` — desen ölçüldü, yöntem yetersiz (2/5), B36-b'ye devretti ve
  büyüdü (71 kayıtsız karar). Ledger'a yazılmadı.
  Yeni borç: **B46** (ölçüm aracı tuzakları) · **B47** (harita yok).
  → `90-kronoloji/2026-08.md`
- **6-7 Ağustos — doküman mimarisi turu ✅** (6 commit, sıfır kod commit'i)
  ADIM 1 · ADIM 2 · ADIM 3 · ADIM 3b · B33 · B37 · B34 · arşiv kapanışı.
  TEYITSIZ 27 → 1 · kırık `kaynak` referansı 409 → 0 · 7 borç kapandı ·
  KARAR 465 · 466 · 467 mühürlendi. → `90-kronoloji/2026-08.md`
- **8 Ağustos — ADIM 5 ✅** (4 commit, sıfır site kodu commit'i)
  `docs/skills/` doğdu — üç skill, kanonik kaynak tek · `skill-sync.sh` symlink+zip,
  `--check` zip yüzeyini denetler · **B42 kapandı** · KARAR 473 mühürlendi ·
  B43 · B44 · B45 açıldı. → `90-kronoloji/2026-08.md`
  Kapanış sonrası: KARAR 474 (dönem HEAD anlık görüntüdür) — `ocak-arsivci`'nin
  DUR-7'si düzeltildi, 6 commit.
- **8 Ağustos — ADIM 4 ✅** (4 commit + 3 kapanış + bu patch, sıfır kod commit'i)
  `CLAUDE.md` kökte · `baglam.sh` beş profil · project files boşaldı (`10-marka.md` hariç) ·
  **B36 açılış ölçümü**: isabet %57, `HİÇ` sıfır, kuyruk ~179± ve üçte ikisi mekanik ·
  KARAR 469 · 470 · 471 · 472 mühürlendi · B40 · B41 · B42 açıldı.
  → `90-kronoloji/2026-08.md`
- **7 Ağustos — B32 ✅** `ocak-referans.md` dağıtımı (4 commit).
  3574 satır → 63 segment → 7 hedef. `20-ref-*` beşli → **yedili**.
  33 kaynak hücresi dönüştü · 1715 satır kronolojiye indi · `_arsiv/ocak-referans-v1.md`.
  → `90-kronoloji/2026-08.md`

---

## FİKİR HAVUZU

**Borç değil, karar adayı değil — henüz fikir.** `02-borclar.md` ürün/fikir kuyruğu taşımaz —
aynı ayrım yukarıda n8n maddesinde de yazılı (*"Borç kaydı yok — ürün işi"*). Borç dosyası
sahibi **ve** kapanış şartı olan işi tutar; buradakilerin ikisi de yok, kaydın
**kaybolmaması** için duruyorlar. Bir fikir borca dönüşecekse
`02-borclar.md`'ye **sahip + kapanış şartıyla** geçer, buradan silinmez — taşınır (KARAR 61).

**Kaynak:** claude.ai 19 Ağustos sohbeti · `docs-patch-2026-08-19c.md` Bölüm 4.
20 Ağustos'ta buraya yazıldı.

| # | fikir | cinsi | not |
|---|---|---|---|
| **F-1** | **İçerik Üstadı** — içerik + ton üreten ajan | araç fikri | iş tarifi yazılmadı |
| **F-2** | **Yazı Dili Üstadı** — var olan metnin sesini bozmadan parlatan editör-ajan | araç fikri | F-1'den ayrı: o **üretir**, bu **korur** |
| **F-3** | **Social Media Agent** — sosyal içerik üreten/planlayan ajan | araç fikri | gelen mesaja cevap veren bottan ayrı |
| **F-4** | **Yoga dersleri** — düzenli pratik formatı | program fikri | format ailesine girer mi, ayrı mı |
| **F-5** | **Ortak operasyonel takvim** (Advaita + Kaan) | operasyon | ilk adımı olabilecek iş **zaten sırada**: "Planlama takvimi view'ı" (yukarıda, KARAR 515) |

> **F-1 · F-2 · F-3 ve `02-borclar.md`'deki B117 aynı aileden:** OCAK sesini taşıyan yüzeyler.
> Tek çatı altında düşünülmeleri önerildi — **bu bir karar değil, gözlem.** Dördü de bugün
> ayrı ayrı duruyor; birleştirme kararı verilmedi.

⚠ **Mevcut skill kadrosuyla karıştırılmaz.** `ocak-metin` ve `ocak-lint` bugün canlı ve
sınırları mühürlü (KARAR 476: metin üretir ↔ lint denetler). F-1/F-2 bu ikilinin
yerine geçmez; kapsamları yazılmadan ilişkileri de tanımlanamaz.

---

## KARAR ADAYLARI

⚠ **Hiçbiri mühürlenmedi. Ledger `523`'te sabit.** Bunlar KARAR **değildir** — numara
taşımazlar, `01-kararlar.tsv`'ye girmediler, hiçbir yüzeyi bağlamazlar. Mühür Kaan'ın
onayıyla, `ocak-kararci` üzerinden, **ayrı turda** yapılır. Buradaki tablo yalnız
soruyu ve ölçülmüş zeminini tutar.

**Kaynak:** claude.ai 19 Ağustos sohbeti · `docs-patch-2026-08-19c.md` Bölüm 5.
20 Ağustos'ta buraya yazıldı; zemin ölçümleri aynı gün koşuldu.

| aday | soru | zemin (ölçüldü) |
|---|---|---|
| **A-1** | **"Retreat" → "İnziva"** olsun mu | ⚠ **Tek satırlık iş değil, ölçüldü:** `src/` altında **28 dosya · 84 geçiş**; `docs/` altında **19 dosya**. Rota adı `/mini-retreat`, kategori enum'u `etkinlik-kategori.ts:13,23,128` (Notion `Mini Retreat` ↔ slug eşlemesi), üç test dosyası. Değişirse URL + Notion + `10-marka.md` + bekçi dosyaları birlikte döner. **TEYITSIZ:** "bilinçli İngilizce istisnaydı" gerekçesi hiçbir dosyada yazılı bulunamadı — `20-ref-marka.md:49` yalnız **marka adı** için İngilizce alternatifleri eliyor, "Retreat" için mühür yok |
| **A-2** | Manifesto cümlesi (**KORUNACAK İFADE #1**) kalsın mı | ⚠ **Marka çekirdeğine dokunur.** Cümle `10-marka.md:158`'de *"(Metin değişmez)"* damgası taşıyor; #35 döneminde yalnız **konumu** değişti (footer → `manifesto-vurgu` kanonik section'ı), ifade aynı kaldı. Kaldırma önerisi çekirdek revizyonudur, kopya rötuşu değil |
| **A-3** | **Açık Kapı çekim mekaniği** — ücretsizliği ne görünür kılar (rozet vb.) | ⚠ **"Davet ≠ Satış" bağlayıcı** (KORUNACAK İFADE #7, `10-marka.md:164`); aciliyet/funnel dili üretilemez. Fiyatın sayfada geçmemesi ayrıca KARAR 432 (KALICI) — "sembolik" de "yatırım" da denmez |
| **A-4** | **Alt yönlendirme kutuları** doğru hedefe mi gidiyor | **Önce ölçüm, sonra karar.** İddia doğrulanmadı; bugün elde hiçbir sayı yok. Ölçülene kadar aday bile sayılmaz |
| **A-5** | **Arşiv şifre modeli** — tek şifre mi, dönem bazlı mı | **B120'nin içinde yaşıyor** (`02-borclar.md`), orada açık karar olarak işaretli. Ayrı mühür gerekir. Etik duvar değişmez: fiziksel çember ve paylaşım turu kaydedilmez (KARAR 57, KALICI) |

> **A-2 ile A-3 aynı sınıra bakıyor.** İkisi de KORUNACAK İFADELER listesine dokunuyor —
> biri metnin kendisine (#1), öbürü sınırına (#7). Liste on maddedir ve mühürlüdür;
> bir maddesine dokunan öneri, listenin bütününe dokunduğunu bilerek yazılır.
