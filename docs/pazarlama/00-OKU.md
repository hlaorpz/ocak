# OCAK Pazarlama · 00-OKU · kural kapısı

**Son güncelleme:** 18 Ekim 2026 · sosyal medya düzeni turu (KARAR 673)

Sosyal medya işi üç dosyadan yürür. Kural burada kısa durur. Yanında karar numarası ve ayrıntının yolu var; ayrıntı kendi dosyasında yaşar.

| | Dosya | Ne taşır | Ne zaman yazılır |
|---|---|---|---|
| **Arşiv** | `YAYIN-KAYDI.md` | Gerçekten çıkan her gönderi: saat, tür, link, ilk satır, rakamlar, yerel görsel, içerik dosyası | Gönderi çıkınca. Yalnız hesapta görülen yazılır |
| **Plan** | `TAKVIM.md` | Ne zaman ne çıkacak. Her satır bir içerik dosyasına (`icerik/*.md`) bağlanır | Planlarken. Çıkan satıra "çıktı → YAYIN-KAYDI #n" eklenir |
| **Nasıl** | `00-OKU.md` (bu dosya) | Kurallar, karar numarası, ayrıntının yolu | Karar alınınca |

**Kim yazar:** Sosyal medya kayıtlarını ve kararlarını Claude doğrudan korpusa yazar, commit'ler ve push eder. Kod ve site işi CC'dedir (KARAR 673). Push'tan sonra Railway build'ini Kaan tetikler.

**Akış:** plan (`TAKVIM`) → içerik dosyası → `ocak-metin` → `ocak-lint` → `ocak-kart` → `ocak-gonderi` → **Kaan'la mutabakat** → yayın (düğmeye Kaan ya da Advaita basar) → `YAYIN-KAYDI`. Gönderi paketi hazırlanmadan önce bağlam Kaan'la konuşulur; Claude ondan önceki işleri bitirip döner (KARAR 674).

## Kurallar

### Ses ve dil

| Kural | Karar | Ayrıntı |
|---|---|---|
| @ocak.biz "biz" sesiyle konuşur. Advaita'nın cümlesi Advaita'nındır; @ocak.biz onun ağzından yazmaz | 645 | `10-marka.md` (Site sesi) · `STRATEJI/yorum-ve-topluluk.md` |
| Emoji yok: açıklama, story, yorum cevabı, kanal mesajı. Advaita'nın kendi hesabı açık soru (S-3) | — | `30-sosyal.md` §3 madde 2 · `03-sira.md` S-3 |
| Davet satış değildir: "son yerler", "kaçırma", geri sayım, aciliyet yok. Kontenjan yalnız bilgi cümlesidir | 643 (kontenjan) | `30-sosyal.md` §3 madde 1 · `10-marka.md` Korunacak İfade 7 |
| Sıklık sözü yok ("ayda bir", "her hafta") | — | `30-sosyal.md` §3 madde 11 · `skills/ocak-lint/yasak-dizeler.tsv` |
| Okuyucuya yaşamadığı geçmiş atfedilmez ("çembere geldin" yok) | 441 | `20-ref-icerik-dili.md` · `30-sosyal.md` §3 madde 12 |
| Kamu metninde "köz" yok, "sembolik" yok, "büyümek / genişlemek" yok | 86 | `skills/ocak-lint/yasak-dizeler.tsv` · `10-marka.md` |
| Kaan'ın adı kamu metninde geçmez | 89 | `skills/ocak-lint/yasak-dizeler.tsv` |
| Sağlık vaadi yok ("iyi gelir", "azaltır") | — | `skills/ocak-gonderi/SKILL.md` adım 3 |
| Testimonial yok; çember ve seremoni anı çekilmez, yayınlanmaz | 558 | `30-sosyal.md` §3 madde 4 ve 6 |
| Açık Kapı kaydedilmez; "kayıt izlenir" türü söz yok | 626 | `01-kararlar.tsv` |
| Hashtag: kartta yazan neyse o, fazlası eklenmez. Story'de hashtag yok | — | `30-sosyal.md` §3 madde 9 |
| Ayraç `·` (U+00B7); `•` ve `-` kullanılmaz | — | `30-sosyal.md` §2b |
| "Yanına bir kadın al" adı yalnız ikinci yer teklifine aittir. Herkese açık paylaşım çağrısı başka adla yapılır | 672 ←647 | `01-kararlar.tsv` · ⚠ 18 Ekim'de teklif "Bir kadını daha çağır" adıyla gitti (675) |
| Davet kodu yalnız o etkinliğin günü geçer. Çağrı fiziksel birliktelik ima etmez: çağrılan kadın kendi evinden, kendi ekranından katılır | 675 | `ACIK-KAPI-19-EKIM/00-kampanya.md` bölüm 15 |
| Ateşi büyütenin fazlası ve OCAK'ın eşiti bir yer açar. Kamuda "açılan yer" denir, "burs" denmez. DM'ler elle cevaplanır | 676 | `icerik/1019-O-uc-yer-acildi.md` |
| Advaita'nın yüzlü işinin yanında yüz görünmeyen alternatifi yazılır. Advaita hakkında olumsuz tercih dili kullanılmaz | 646 | `ACIK-KAPI-19-EKIM/advaita-10-ekim-brief.md` |

### Görsel

| Kural | Karar | Ayrıntı |
|---|---|---|
| Yapay zekâyla insan, el, yüz üretilmez. AI görsel yalnız doku, atmosfer, nesne, mekân | 642 | `30-sosyal.md` §3 madde 3 |
| Bir Kadın Vardı'da fotoğraf hakkı beş soruyla bakılır; biri hayırsa fotoğrafsız | 642 | `icerik/havuz/bir-kadin-vardi-seri.md` |
| Beyaz `#FFFFFF` hiçbir yerde yok | — | `10-marka.md` Görsel Kimlik |
| Gündüz paleti gecenin yanında; ızgara ritmi gece · gündüz · insan | 637 | `GORSEL-gunduz-paleti-ve-MJ.md` |
| Gündüz Midjourney: `--sref` z12, `--sw 25`; gölge istenen istemin `--no` listesine gölge girmez | 650 · 651 | `../31-zemin.md` |
| Kart derleyici tek araçtır (`tools/ocak-kart-derleyici.html`); gündüz gecenin dizgisini kullanır | 652 | `skills/ocak-kart/SKILL.md` (⚠ B235: skill eski basıcıyı anlatıyor) |
| Gündüz kartında metin Kömür, vurgu `#A8371C` yarı kalın; sığmayan satır dengeli bölünür; 9:16'da blok yukarıda | 658 · 659 · 657 | `01-kararlar.tsv` |
| Karusel düzeni iki ışıkta ayrışır: gündüzde işaret sabit (y≈209/1350), gecede OCAK Nedir düzeni | 671 | ⚠ B242: derleyicide "işaret sabit" seçeneği yok |
| Öne çıkan dört kapak gece ışığıdır, kapakta kelime yok | 640 · 663 | ⚠ 18 Ekim taramasında web profilinde görünmedi (`YAYIN-KAYDI.md` bulgu 2) |

### Link ve ilk yorum

| Kural | Karar | Ayrıntı |
|---|---|---|
| Profildeki ilk link o haftanın etkinlik sayfasıdır (`/etkinlik/<slug>`) ve haftalık döner | 670 ←664 | 18 Ekim: `ocak.biz/etkinlik/bir-esikte-duruyorsun` |
| Açıklamada ve yorumda link yok | 664 | — |
| İlk yorum sabit ve sabitlenir: "Bir mum, bir saat, sen. Yerin profildeki ilk linkte." Ortak gönderide "@ocak.biz profilindeki ilk link" | 669 | ⚠ Kapsam açık soru, aşağıda |
| Story link çıkartması etkinlik sayfasına gider; tarihsiz genel paylaşım `/acik-kapi`'ye | 664 · 670 | — |

### Story

| Kural | Karar | Ayrıntı |
|---|---|---|
| @ocak.biz kendi gönderisini story'ye 1–2 saat sonra alır. 20:30 ve sonrasındaki gönderide story 22:00'yi geçmez ya da ertesi sabah 09:00'a kalır. Advaita hemen paylaşabilir | 661 | ⚠ `TAKVIM.md` story satırları bu karardan eski |
| Anket, soru kutusu, link çıkartması serbest. Geri sayım, çekiliş, emoji kaydırıcı, bilgi yarışması yok | 639 | `TAKVIM.md` Story kalıpları |

### Reels ve video

| Kural | Karar | Ayrıntı |
|---|---|---|
| 1080×1920. Üst bant konuşma boyunca; altyazı Inter 500 54 px krem, bantsız, alttan 480 px, en çok iki satır; kapanış düz kömür kart, korlu işaret 150 px. Reklam kopyasında altyazı 190 px yukarı | 662 | `01-kararlar.tsv` |
| Müzik yok (karusel dahil, S-2 açık) | — | `03-sira.md` S-2 |
| Advaita videosunun aslı dosya olarak istenir; WhatsApp ya da Instagram kopyası 720p gelir | — | B243 |

### Takvim ve aksama

| Kural | Karar | Ayrıntı |
|---|---|---|
| Tek takvim, iki hat: Hat O sabah, Hat A akşam. 19 Ekim'e kadar günde iki gönderi, sonra bir | 638 | `TAKVIM.md` |
| Tarihe bağlı iş yapılamazsa düşer; tarihsiz iş sıraya döner. Telafi, çift paylaşım yok | 638 | `TAKVIM.md` Aksama kuralı · her içerik dosyasının "Yapılmazsa" satırı |
| Milli ve özel günlerde tek kart, tek cümle; davet, link, reklam yok. 10 Kasım'da başka paylaşım ve reklam yok | 644 | `STRATEJI/ozel-gunler.md` |
| Paket v2'de Kaan'ın yorumsuz bıraktığı madde onaydır (yalnız bu paketin kapsamında) | 636 | — |

### Yorum ve topluluk

| Kural | Karar | Ayrıntı |
|---|---|---|
| @ocak.biz kendi gönderisindeki her yorumu beğenir ve "biz" sesiyle cevaplar. Advaita kendi hesabından, kendi adıyla yazar | 645 | `STRATEJI/yorum-ve-topluluk.md` · `skills/ocak-yorum/SKILL.md` |

### Reklam ve ölçüm

| Kural | Karar | Ayrıntı |
|---|---|---|
| Reklam 150 TL'den önce yorumlanmaz. Ödenmiş kayıt başı 600 TL altında büyür, 600–1.000 TL sürer, 1.000 TL üstünde kesilir | 667 | `ACIK-KAPI-19-EKIM/reklam-detay.md` |
| Bütçe kararı Pixel'e değil ödenmiş kayda bağlanır | 668 | — |
| Ateş Mektupları listesi rızasız reklam kitlesine yüklenmez | — | eski kural listesi, aşağıda |

### Kayıt

| Kural | Karar | Ayrıntı |
|---|---|---|
| Arşive yalnız hesapta görülen yazılır. Dosya adındaki tarih plan tarihidir | 673 | `YAYIN-KAYDI.md` Ölçüm yöntemi |
| Gönderi paketinden önce Kaan'la bağlam mutabakatı; Claude hazırlığa kadarki işi bitirip bulgu ve soruyla döner | 674 | — |
| Tekrar eden kural silinmez, bu kapıya bağlanır | 61 | — |
| Haftada bir, Pazar akşamı, hesap arşivle karşılaştırılır | — | `YAYIN-KAYDI.md` |

## Açık sorular (karar Kaan'da)

1. **KARAR 669'un kapsamı.** Ledger "@ocak.biz gönderisinde" diyor; davet gönderisi mi, her gönderi mi belli değil. `STRATEJI/yorum-ve-topluluk.md` Hat O gönderisinin ilk yorumuna hafif bir soru koyuyor. 18 Ekim'in ilk turu da (`6b65cdb`) Adımız 1/3 ve 2/3'ün ilk yorumunu linkten soruya çevirdi. İkisi yan yana durursa Hat O'nun ilk yorumu soru mu taşır, sabit lafız mı?
2. **`TAKVIM.md` story saatleri KARAR 661'den eski.** Örnek: `1019-O` 09:00 gönderi, 09:30 story. Plan satırları düzeltilecek mi, yoksa kural uygulanırken mi okunacak?
3. **S-2 karusele müzik · S-3 Advaita hesabında emoji.** Korpus bugün ikisine de "yok" diyor (`03-sira.md`).
4. **"Kor yalnız siyah zeminde" kuralı** (11 Ekim). Teyit bekliyor (`03-sira.md`).

## Skill'ler

`skills/ocak-metin` (taslak) · `ocak-lint` (dil denetimi) · `ocak-kart` (kart) · `ocak-gonderi` (yayın paketi) · `ocak-yorum` (yorum). Hangi işte hangisi: `STRATEJI/skill-haritasi.md`. Tek kapı skill'i `ocak-sosyal` önerildi, onay bekliyor (18 Ekim).

---

## Paket v2 · 9 Ekim girişi (aynen korunur)

Bu bölüm paketin ilk giriş metnidir. Başlıkları bir kademe indirildi, içerik değişmedi. "Kurallar (değişmedi)" listesi yukarıdaki kapıya bağlandı. "Durum özeti" 9 Ekim tarihlidir; güncel durum `YAYIN-KAYDI.md` ve içerik dosyalarının Durum satırlarıdır.

### OCAK Pazarlama Paketi · v2 · 9 Ekim 2026

> **Korpustaki yerleşim (11 Ekim 2026, `docs-patch-2026-10-11`).** Bu paket korpusta `docs/pazarlama/` altındadır. Aşağıda adı geçen ama doküman olmayan klasörler depo kökündeki `pazarlama-ekler/` altına taşındı: `hazir-kartlar/` → `pazarlama-ekler/kartlar-2026-10-10/` · `araclar/` → `pazarlama-ekler/araclar/` · `ornekler/` → `pazarlama-ekler/ornekler/`. `CC-BRIEF-1…3` uygulanmadı; metinleri `docs/_arsiv/2026-10-pazarlama-briefleri/`. Claude Docs belgelerinin korpus kopyaları ve sohbetin tam kaydı `belgeler/` altında; giriş `belgeler/sohbet-kaydi-2026-10-09-11.md`. "Yarın sabah" bölümü 9 Ekim akşamı yazıldı; tarihsel.

Plan belgesi Claude Docs'ta: "OCAK Pazarlama Planı — Açık Kapı ve Genel". Bu paket o planın uygulama malzemesidir: her gönderi ayrı dosyada, görseliyle, istemiyle, metniyle, yedeğiyle.

#### Yarın sabah (10 Ekim Cumartesi)

1. 09:30: `hazir-kartlar/1010-O-soz-kullenen-4x5.jpg` paylaşılır. Caption: `icerik/1010-O-soz-kullenen.md`.
2. Advaita'nın günü: `ACIK-KAPI-19-EKIM/advaita-10-ekim-brief.md` (aynı metin Claude Docs'ta ayrı belge olarak da var).
3. Günün geri kalanı: `TAKVIM.md`, Cmt 10 satırı.

#### Nerede ne var

| Yol | Ne |
|---|---|
| `TAKVIM.md` | 10 Ekim – 10 Kasım, gün gün: çekirdek iş, ek iş, aksama kuralı |
| `icerik/` | 34 tarihli gönderi dosyası. Ad kalıbı `AAGG-Hat-ad`: `1015-O-soz-dayanmak` = 15 Ekim, Hat O |
| `icerik/havuz/` | Tarihsiz malzeme: yirmi dört söz, on dört atasözü, Bir Kadın Vardı kuralları, soru reels'leri, soru bankası, sabah pratikleri, mailler |
| `ACIK-KAPI-19-EKIM/00-kampanya.md` | Kampanyanın tamamı: hedef, itirazlar, on günün işleri, operasyon, akşamın akışı, retro |
| `ACIK-KAPI-19-EKIM/reklam-detay.md` | Set set, reklam reklam: görsel, istem, birincil metin, başlık, tam adres. Yurt dışı, 22 ve 26 Ekim, çember, Kasım, Google arama |
| `ACIK-KAPI-19-EKIM/advaita-10-ekim-brief.md` | Advaita'nın çekim günü ve sonraki on günü |
| `STRATEJI/yorum-ve-topluluk.md` | Kim cevap verir, nasıl, on beş hazır cevap, gizle-sil eşiği, dış yorum |
| `STRATEJI/tiktok.md` | Altı haftalık deney, riskler, karar eşiği |
| `STRATEJI/kitle-ve-genc-kadinlar.md` | 32+ ana kitle; genç kadınlar için iki kapı |
| `STRATEJI/ozel-gunler.md` | 29 Ekim, 10 Kasım ve yılın bütün özel günleri; kurallar ve kart metinleri |
| `STRATEJI/site-uyarlama.md` | Gündüz paletinin siteye yedi uyarlama fikri; kontrast hesabı |
| `STRATEJI/skill-haritasi.md` | Hangi işte hangi skill; dört yeni skill önerisi |
| `GORSEL-gunduz-paleti-ve-MJ.md` | Palet, Midjourney istemleri, kodla çizilen zeminler, kart basıcı |
| `FIKIR-HAVUZU.md` | 154 fikir; kaynağı ve planda olup olmadığıyla |
| `araclar/` | `ocak_kart.py` kart basıcı, fontlar, toplu basım betiği |
| `ornekler/` | Gündüz paleti örnek sayfası; bugünkü ızgara ile 19 Ekim sabahı ızgarası |
| `CC-BRIEF-1…3` | Paketin korpusa yazılması · kart basıcı ve derleyici · kararlar |

Ayrı zip: `hazir-kartlar/` (44 basılı kart, yayına hazır).

#### Bir gönderi dosyası nasıl okunur

Her dosyada aynı bölümler, aynı sırayla:

- **Başlık bilgisi:** hat, amaç, tarih ve saat, kanal, ışık, durum, **yapılmazsa** (düşer mi, sıraya mı döner, yedeği ne).
- **Görsel:** ne olduğu; Midjourney gerekiyorsa istem kopyalanır hâlde, aynı bölümde.
- **Tercih ve alternatif:** çekim gerektiren işlerde. Tercih Advaita'nın göründüğü çekim; alternatif aynı işin başka çekimi.
- **Ekran metni · Caption · İlk yorum · Story · Etkileşim · Diğer kanallar.**
- **Üretim ve skill:** adım adım; hangi adımda hangi skill ya da komut.
- **Notlar ve kaynak:** olguların kaynağı; ölçülmeyenler açıkça yazılı.

#### Durum özeti

| Durum | Sayı | Hangileri |
|---|---|---|
| Kartı basılı, yayına hazır | 15 gönderi ve 13 story kartı | `TAKVIM.md`'de **hazır** yazanlar |
| Çekim bekliyor (10 Ekim) | 8 | Advaita'nın brief'indeki V ve F numaraları |
| Gece zemini, mum videosu ya da kurgu Kaan'da | 6 | `1011-O`, `1012-A`, `1013-A`, `1015-A`, `1019-O`, `1022-A` |
| Olgu teyidi yarım | 2 | `1024-O-halet-cambel`, `1031-O-mualla-eyuboglu` |
| Etkinlik gövdesiyle karşılaştırılacak | 3 | `1022-A`, `1025-A`, `1027-A` |

#### Kurallar (değişmedi)

Emoji yok · "son yerler", "kaçırma", geri sayım yok · yapay zekâ ile üretilmiş insan, el, yüz yok · @ocak.biz "biz" sesi; Advaita'nın cümleleri Advaita'nın · okuyucuya yaşamadığı geçmiş atfedilmez (KARAR 441) · Açık Kapı kaydedilmez (KARAR 626) · mektup listesi rızasız reklam kitlesine yüklenmez · sağlık vaadi yok.

#### Ölçülmeyenler (tek yerde)

- Sitenin kaynak kodu; kart derleyicinin kaynağı.
- 22, 26 ve 28 Ekim etkinliklerinin gövdeleri; 2, 9, 16 Kasım başlıkları.
- Reklam ölçümünün Events Manager'da göründüğü; yurt dışı kartıyla ödeme; hesabın harcama sınırı.
- Kayıt sayıları bugün yeniden okunmadı (9 Ekim Uygulama Planı'ndaki 4 ödenmiş, 2 havale).
- Atasözlerinin sözlük anlamları; halk takvimi tarihleri; dinî gün tarihleri; 25 Kasım destek hattı bilgisi.
- Hiçbir fotoğrafın lisansı.
- Instagram sıralama sinyalleri ve paylaşım sıklığı konusunda resmî kaynak (ikincil kaynaktan; resmî açıklamayı açıp okumadım).
- TikTok Türkiye kullanıcı verisi (güvenilir kaynak bulunamadı).
- Midjourney istemlerinin hiçbiri bu oturumda çalıştırılmadı.
