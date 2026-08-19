# OCAK — İLK 30 GÜN SOSYAL MEDYA AJANS DOSYASI · v2
**Kapsam:** @ocak.biz Instagram + OCAK WhatsApp Kanalı · İlk 30 içerik günü (takvim Gün 0 tamamlanınca başlar)
**Hazırlayan:** Fable · 19 Ağustos 2026 · v2.1 (v2: 19 Temmuz · v1: 12 Temmuz)
**Metin kaynağı:** `ocak-site-dump-fable-2026-08-19.md` (canlı prod, sha=3683ca4, 49 route). Site metniyle çelişki görürsen site kazanır.

**v2.1 DEĞİŞİKLİK GÜNLÜĞÜ (19 Ağustos ölçümü: 27 aynen · 3 cümle düzeltmesi · 0 yeniden yazım · 5 yeni malzeme kalemi):**
1. İ5: "İLK KAMU DUYURUSU" çerçevesi düştü — katman kararı gereği İ5 motor değil, eko. Protokol bloğu revize; kart metni ve karusel aynen.
2. İ5 · İ11 · İ20 caption'larına Bölüm 15/4'ün beklettiği tek cümle eklendi — kayıt/başvuru route'ları canlıda doğrulandı (7 format kayıt sayfası + /anadolu/basvuru yayında). İtiraz hâlinde silinecek üç cümle: "Başvuru ve kayıt sayfaları açık." / "Başvuru sayfası açık." / "Kayıt sayfası açık."
3. Bölüm 6: takvim artık dolu — on beş yayında etkinlik. İlk etkinlik 31 Ağustos Açık Kapı "Bir Eşikte Duruyorsun"; Gün 1 penceresi bunu ıskalamamalı.
4. Bölüm 10: K-ETKİNLİK örnekleri Temmuz şablonundan gerçek takvime çevrildi (31 Ağustos Açık Kapı · 17 Eylül Kakao Seremonisi).
5. E7 eklendi: Atölye günü kartı — ilk kullanım Ritüel Tasarımı, 3 Ekim.
6. 30-60 gün tohumları dosya sonuna işlendi: Dünya Yolculuğu hattı, /adimiz Takvim katmanı, on beş etkinlik-tema havuzu.
7. Hatırlatma borcu duruyor: İ14 MJ-zoom → gerçek söz değneği makrosu (F2) gelince değişir. Gün 0 kilidi ve [KAAN] 1-2-5-6 açık.

**Bu dosya uygulama dosyasıdır.** Her günün kartında görsel, bindirme metni, caption, ilk yorum ve story kelimesi kelimesine hazır. Uygulayıcı hiçbir gün "burada ne demek istemiş" diye düşünmez. Boşluk kalan yerler `[KAAN]` ile işaretli — dosyanın sonunda tek liste hâlinde toplandı. `[KAAN]` alanı dolmadan o kart yayınlanmaz.

---

## GÜN 0 — KURUCU GÖRSEL ÜRETİMİ (yayın öncesi zorunlu adım)

**Kurucu görsel üretilmeden Gün 1 yayını BAŞLAMAZ.** Tüm görsel sistem tek bir kurucu görsele `--sref` ile bağlanıyor; kurucu yokken üretilen her kart seriden kopar ve çöpe gider. Sıra kesin: Gün 0 → Kaan onayı → Gün 1.

### 0a · Kurucu prompt (Midjourney'e birebir yapıştır)
```
glowing embers under a thin layer of grey ash, extreme close-up, single warm light source from within the coals, deep charcoal black background dissolving into darkness, colors: burnt orange #C44B2F and muted gold #D4A855 against near-black #1A1614, subtle film grain, quiet sparse composition, large area of pure dark negative space in upper half, photographic, moody chiaroscuro --ar 4:5 --style raw --stylize 120 --chaos 8 --no people, faces, hands, text, watermark
```
4-6 tur üret (her tur 4 varyant). Toplam 16-24 aday.

### 0b · Seçim kriterleri
**Style DNA (aranan):** Gece çekilmiş gibi durur. Zemin kömür değil, içinde sıcaklık barındıran is rengi (#1A1614 civarı). Işık tek kaynaklı, ateşten gelir: köz turuncusu (#C44B2F) gölgeleri yalar, altın (#D4A855) yalnız en parlak kenarlarda. Karenin en az yarısı — tercihen üst yarısı — karanlıkta erir (metin oraya oturacak). Doku elle tutulur: kül, kor, is. Duygu: sıcak ama sessiz.
**Anti-liste (biri varsa ELE):** stok parlaklığı / genel aydınlık kare · wellness-pastel tonlar · neon-mistik mor/mavi · lotus, mandala, kristal çağrışımı · herhangi bir insan izi (el, silüet dahil) · yazı/watermark artefaktı · aşırı HDR keskinlik · üst yarıda karanlık negatif alan YOKSA.

### 0c · Seçilen görselin `--sref` URL'i nasıl alınır ve dosyaya işlenir
1. Seçilen varyantı upscale et. Açılan görsele sağ tık → "Copy image address" (Discord'da: görsele tıkla → "Open in Browser" → adres çubuğundan URL kopyala). `.png`/`.webp` ile biten tam URL olmalı.
2. Bu dosyada **ara-değiştir** yap: `KURUCU-URL` yazan her yeri o URL ile değiştir. (Bölüm 8'deki P1-P9 promptlarının tamamında `--sref KURUCU-URL --sw 60` geçiyor; tek ara-değiştir hepsini doldurur.)
3. Kurucu görselin kendisi de Gün 1 söz kartının zemini olarak kullanılabilir — ayrıca P1 üretimi şart değil, uygunsa doğrudan crop'la.
4. Kurucu görsel + `--sref` işlenmiş dosya → Kaan onayı → yayın takvimi başlar.

---

## 1 · NE İÇİN VARIZ (30 günün üç işi)

1. **Ses kurulumu:** İlk 30 gün markanın sesini ve görsel dilini Instagram'da kurma dönemi — takipçi avı değil, doğru kadının "burası benim yerim olabilir" demesi.
2. **Eylül penceresi:** İki yolculuk Eylül 2026'da yola çıkıyor — Anadolu Yolculuğu (başvurulu, on iki on altı kadın) ve Yolculuk online (yirmi yirmi dört kadın; Açılış 24-27 Eylül, sitede yayında). **Katman kararı (19 Ağustos):** Kohort dönüşümü feed'den geçmez — motor Halka 1'dir: birebir davet ağı + Advaita'nın kendi hesabı. İ5 feed'de kalır ama omuzlamaz; eko olur, kaynak değil. Feed'in işi birikim: marka dili, görsel tutarlılık, "burası duruyor" hissi. Çözüm asla aciliyet değil: daha net ve daha sıcak davet. "Son yerler" tipi tek bir cümle bile yazılmaz.
3. **Alışkanlık:** Ateş Mektupları (bülten) + WhatsApp Kanalı sürekli akışın varış noktaları. Her içerik zinciri bu ikisinden birine veya siteye yumuşakça bağlanır — S5 hediye içerikler hariç.

**Hedef kitle — Eşik Kadını, çift yol:** Kimini kriz getirdi (tükenmişlik, kayıp, sıkışma), kimini çağrı ("dahası var" sesi). İki yol eşit ağırlıkta; yalnız kriz diline yaslanmak yasak. İmza: *"Bir eşikte duruyorsun — seni oraya ne getirdiyse."*

---

## 2 · HESAP MİMARİSİ VE ROLLER

| Kanal | Ses | Kim üretir | Not |
|---|---|---|---|
| **@ocak.biz** (Instagram) | "Biz" — kollektif, sıcak, davet eden | AJANS (bu dosya) | Markanın evi. Feed + story takvimi burası için. |
| **OCAK WhatsApp Kanalı** | "Biz" — kısa, bilgi + davet | AJANS (Bölüm 10 şablonları) | **Her etkinlik duyurusu ÖNCE Kanal'a düşer**, story aynı gün veya ertesi gün gelir. Haftada en fazla 1-2 mesaj. Emoji yok. |
| **@advaita_hayatladans** | Birinci tekil — Advaita'nın sesi | **AJANS DOKUNMAZ.** | Ghost-writing yok. Haftalık plan paylaşılır; Advaita kendi dilinde yazar. @ocak.biz onun postlarını ayda en fazla 2-3 kez story'de paylaşır. |
| WhatsApp asistanı (bot) | Bilgi botu — kendini bot olarak tanıtır | Mevcut sistem | Bio + story'lerde "soru için WhatsApp" yönlendirmesi serbest. |
| Ateş Mektupları | Mektup — dert dökmeyen, satış yapmayan | OCAK içi | Sosyalin yumuşak varış noktası: takip → mektup → kapı. |

**Bio (çift kapı — birebir):**
> Kadınların bir ateşin etrafında toplandığı bir alan. Kalbinde her zaman bir çember.
> ↓ Ateşin yanında yer var

Link 1: `ocak.biz` · Link 2: WhatsApp Kanalı daveti — `[KAAN: kanal davet linki]` (link başlığı: "WhatsApp Kanalı"). Linktree yok.

---

## 3 · SERT KURALLAR (pazarlığa kapalı — kısaltılmış, tam liste v1'de)

1. **Davet ≠ Satış.** Aciliyet manipülasyonu yok: "son 3 yer", "kaçırma", geri sayım, FOMO — hiçbiri. Kontenjan gerçeği yalnız bilgi cümlesi olarak: "Kohort yirmi dört kadınla kapanıyor" (nokta).
2. **Emoji yok** — caption, story, yorum yanıtı, Kanal mesajı: hiçbir yerde.
3. **AI insan figürü/yüzü yok.** İnsan görünecekse gerçek fotoğraf (Bölüm 11 çekim kılavuzu). AI görsel yalnız: doku, atmosfer, nesne, mekân.
4. **Testimonial yok.** Çemberde söylenen çemberde kalır.
5. **Funnel/pazarlama jargonu yok** — içerikte ve iç yazışmada.
6. **Seremoni/çember paylaşım anları çekilmez, yayınlanmaz.** Yayınlanabilir: hazırlık, boş alan, ateş, nesneler, yüzsüz eller/sırtlar, kapanış sonrası atmosfer.
7. **Katılımcı yüzü ancak yazılı açık izinle** — ve asla paylaşım anından.
8. **Spiritüel klişe yasağı:** "yüksek titreşim", "manifest", "kutsal dişil enerjini aç"; lotus-mandala-kristal görselleri; beyaz elbiseli gün batımı pozu.
9. **Hashtag:** her kartta yazan neyse o — fazlası eklenmez. Story'de hashtag yok.
10. **Yapay etkileşim yok:** çekiliş, etiketle-kazan, takip döngüsü, pod — asla.
11. **Taahhüt yasağı:** Caption'a sıklık/ritim sözü yazılmaz ("ayda en az bir" tipi). Takvim gerçeği gösterir. Süre bilgisi kartta yazıldıysa oradan; yeni süre iddiası eklenmez.
12. **Kip mimarisi:** Okuyucuya yaşamadığı geçmiş atfedilmez ("çembere geldin" YASAK). Güvenli kipler: şimdiki hâl tarifi, üçüncü tekil portre ("bir kadın var..."), davet geleceği ("ateşin yanında yer var").
13. **Nesneleştirme yasağı:** "kadın X yapsın diye" kalıbı kullanılmaz.
14. **"Bilgi vermeyiz" kalıbı kullanılmaz.** Bilgi OCAK'ta vardır ve elden ele geçer; verilmeyen şey reçete, kurulmayan şey kürsü. Güvenli kalıp: "Bilgi araç, asıl olan deneyim."
15. **Eylül dil kapısı:** Kayıt/başvuru "açık" dili ancak Kaan "sayfaları açtım" dediğinde kullanılır. O güne kadar düzey: "Eylül'de yola çıkıyor; detaylar sitede."
16. **"Çember Lideri Eğitimi"** adı kesinleşti — içeriklerde bu adla geçer, alternatif ad tartışması kapalı.

---

## 4 · SES REHBERİ (özet)

Kısa cümle. Nokta cesareti. Soru sorar, cevabı dayatmaz. Sayılar yazıyla ("sekiz on altı kadın"). Tire (—) ritim aracı. Edebi ama süssüz.
**Bizim kelimeler:** ateş, kor, kül, üflemek, çember, eşik, kapı, ev, alan, kız kardeş, davet, tanıklık, iskelet, harlamak, denk düşmek.
**Yasak kelimeler:** motivasyon, potansiyelini açığa çıkar, dönüşüm garantisi, en iyi versiyonun, kadın gücü (slogan olarak), fırsat, avantaj, kampanya. Kamu metninde "köz" kelimesi kullanılmaz ("sönmeyen kor" denir; köz yalnız renk adı olarak iç yazışmada geçer).

---

## 5 · SÜTUNLAR VE FORMATLAR (özet — uygulayıcıya yetecek kadar)

**Sütunlar:** S1 Mit & Ad · S2 Ayna (portre) · S3 Kapılar (davet) · S4 Yol (Eylül kohortları) · S5 Araç (hediye pratik — linksiz post haftada en az bir tane OLMALI) · S6 Atmosfer & Biz.

**Formatlar:**
- **F1 Söz kartı** (tek görsel 4:5): MJ zemin + Cormorant Garamond Italic metin. Kart üstünde logo/handle YOK; köşede küçük nokta (·) tek imza. Kart başına en fazla on dört-on altı kelime.
- **F2 Karusel** (4:5, 5-8 kart): Kapak söz kartı estetiği; iç kartlar AYNI zeminin crop varyantları (tek üretim → crop; kart kart farklı prompt üretme). Kart başına en fazla iki cümle. Son kart yumuşak köprü.
- **F3 Reels** (9:16, 20-45 sn): Gerçek çekim veya MJ atmosfer üzerine yavaş zoom + kademeli metin. Ses: ateş çıtırtısı loop, ambient veya Advaita'nın kendi kaydettiği ses. Dans/şaka trendi asla.
- **F4 Story:** günde en fazla 2-3; boş gün olabilir — sessizlik markanın parçası. Sticker'sız düz kart.
- **F5 İlk yorum:** her feed postunun altına ilk yorum olarak link (caption'ı link kirletmesin).

**Tipografi/renk standardı:** Cormorant Garamond Italic. Krem `#F2EAE2` varsayılan · Altın `#D4A855` yalnız zirve kartlarda (haftada en fazla bir altın kart) · Köz rengi `#C44B2F` yalnız tek kelimelik ateş vurgusu. Zemin daima kömür ailesi; metin görselin karanlık negatif alanına oturur.

---
## 6 · TAKVİM YAPISI (v2 — tarihsiz akış + esnek etkinlik kartları)

Site takvimi artık dolu: on beş yayında etkinlik (altı Açık Kapı, dört Çember, üç Seremoni, bir Yolculuk, bir Atölye), hepsi tarihli ve saatli. **İlk etkinlik 31 Ağustos — Açık Kapı "Bir Eşikte Duruyorsun"; Gün 1 penceresi bunu ıskalamamalı.** Sabit akış yine gerçek tarihe KİLİTLENMEZ:

- **Sabit akış (İ1–İ24):** Tarihten bağımsız numaralı içerik. Ritim: haftada dört feed postu (Salı–Perşembe–Cumartesi–Pazar çekirdek). Gün 0 onayı hangi gün biterse, ilk Salı İ1 ile başlanır ve sıra bozulmadan akar. Altı haftada biter.
- **Esnek etkinlik kartları (E1–E6):** `[ETKİNLİK GÜNÜ — takvime göre kaydır]` kartları. Bir etkinlik tarihi netleştiğinde ilgili E-kartı o güne oturur; o hafta sabit akış bir gün kayar (sıra bozulmaz, sadece ötelenir). Aynı güne iki feed postu binmez.
- **Tarih sorusu kapandı (v2.1):** E1–E5 ve E7 tarihlerini siteden okur (ocak.biz/takvim — canlı ve dolu); Kaan'a ay başında tek teyit yeter. E6 çekim gününe bağlı kalır. Başka hiçbir kart tarih beklemez.
- **İ5 özel protokolü:** Bölüm 7, İ5 kartında yazılı — Kanal + Ateş Mektupları önce, feed ertesi gün; kart eko, motor Halka 1.
- **Haftalık story ritüelleri** feed'den bağımsız akar: her Pazartesi PS-kartı, her Perşembe PP-kartı (Bölüm 9). Gün kartlarındaki "STORY: yok" bu ritüelleri iptal etmez.

**Sıra tablosu (sabit akış):**

| # | Sütun | Format | İçerik | Hafta |
|---|---|---|---|---|
| İ1 | S1 | F1 | LANSMAN — "İçindeki ateş sönmedi" | 1 |
| İ2 | S1 | F2 | Çember miti — "Bir ateş vardı" (6 kart) | 1 |
| İ3 | S2 | F1 ALTIN | İmza — "Bir eşikte duruyorsun" | 1 |
| İ4 | S5 | F3 | Reels — "Bir mum, bir nefes" | 1 |
| İ5 | S4 | F2 | EYLÜL'DE İKİ YOL (eko — motor Halka 1) | 2 |
| İ6 | S1 | F2 | Adımız 1/3 — od, Od Ana | 2 |
| İ7 | S2 | F1 | Portre — UYKU | 2 |
| İ8 | S5 | F1 | Pratik — telefon kapıda (linksiz) | 2 |
| İ9 | S3 | F2 | Yedi kapı, bir ateş | 3 |
| İ10 | S1 | F2 | Adımız 2/3 — kor devri, ritüeller | 3 |
| İ11 | S4 | F1 | Anadolu evre 1/6 — AÇILIŞ | 3 |
| İ12 | S2 | F1 | Portre — MERAK | 3 |
| İ13 | S6 | F1 ALTIN | Felsefe — "Bir kursa gidersin..." | 4 |
| İ14 | S5 | F3 | Reels — Söz değneği | 4 |
| İ15 | S4 | F1 | Anadolu evre 2/6 — İNİŞ | 4 |
| İ16 | S1 | F2 | Adımız 3/3 — dilin belleği, şifa | 4 |
| İ17 | S2 | F1 | Portre — İLK DOKUNUŞ | 5 |
| İ18 | S6 | F1 | Çember Kutsaldır — "kayıt yoktur" | 5 |
| İ19 | S3 | F1 | Açık Kapı daveti — "Çember değil, pencere" | 5 |
| İ20 | S4 | F2 | Yolculuk online — bir durağın anatomisi | 5 |
| İ21 | S5 | F1 | Pratik — "Aklımdaydın" (linksiz) | 6 |
| İ22 | S1 | F1 | Kül kartı — "Kül öldürmez" | 6 |
| İ23 | S4 | F1 | Anadolu evre 3/6 — UYANIŞ | 6 |
| İ24 | S2+S3 | F2 | Kapanış — "Sen neredesin?" | 6 |

Seri kuralı: evre serisi (4/6–6/6) ve portre serisi (Aidiyet→Spiral) 30-60 gün planında devam eder — seri yarıda kesilmez.

---

## 7 · GÜN KARTLARI — SABİT AKIŞ (İ1–İ24)

Her kartın yapısı: GÖRSEL (prompt no + format + bindirme metni + renk) · CAPTION (birebir) · İLK YORUM · STORY. Hashtag satırı caption'ın son satırıdır; yazmıyorsa hashtag yok.

---

### İ1 · S1 · F1 — LANSMAN
**GÖRSEL:** Kurucu görsel (Gün 0 çıktısı) veya P1 · 4:5 · Bindirme (krem, üst negatif alan):
> İçindeki ateş sönmedi.
> *Üstü küllendi sadece.*
**CAPTION:**
> İçindeki ateş sönmedi. Üstü küllendi sadece.
> Kadınlar binlerce yıl bir ateşin etrafında oturdu — birlikte nefes aldı, birlikte hatırladı. O çember bir gün dağıldı. Biz onu yeniden kuruyoruz.
> OCAK: kadınların bir ateşin etrafında toplandığı bir alan, kalbinde her zaman bir çember.
> Ateşin yanında yer var.
> #kadınçemberi #ocak #ritüel
**İLK YORUM:** Hikâyenin tamamı: https://www.ocak.biz
**STORY:** Feed postu story'ye paylaşılır, üstüne krem metin: "Ateşin yanında yer var." Başka story yok.

---

### İ2 · S1 · F2 — ÇEMBER MİTİ (6 kart)
**GÖRSEL:** P1 tek üretim → 6 crop · 4:5 · Kart metinleri (krem):
> K1: Bir ateş vardı.
> K2: Kadınlar binlerce yıl onun etrafında oturdu. Ne guru vardı, ne reçete, ne uzman.
> K3: Sadece ateş, birbirlerinin tanıklığı, bedenlerinin zaten bildiği bilgelik.
> K4: O çember bir gün dağıldı. Kadın çembersiz, ateşsiz, kız kardeşsiz kaldı.
> K5: Ama kül öldürmez. Örter, korur. Kor bekler.
> K6: OCAK o çemberi yeniden kuruyor.
**CAPTION:**
> Bu çember her toprakta vardı. Anadolu'da köy meydanında, And dağlarında bir ana evinde, Nil kıyısında bir tapınakta. Kadın çember kurardı — çünkü kadın yalnız iyileşmiyor, birlikte iyileşiyor.
> Hikâyenin tamamı sitede, köklerden bugüne.
> #kadınçemberi #ocak #anadolu
**İLK YORUM:** Hikâyeyi oku: https://www.ocak.biz/hikaye
**STORY:** yok

---

### İ3 · S2 · F1 — İMZA (ALTIN KART)
**GÖRSEL:** P3 (eşik/kapı) · 4:5 · Bindirme (ALTIN #D4A855):
> Bir eşikte duruyorsun —
> seni oraya ne getirdiyse.
**CAPTION:**
> Kimini bir kırılma getirdi — tükenmişlik, kayıp, sıkışma. Kimini içindeki "dahası var" sesi. İki yol da aynı eşiğe çıkıyor: bir dönem tamamlanıyor, yenisi henüz şekillenmedi.
> Gel. Yalnız durma o eşikte.
> #eşikkadını #kadınçemberi
**İLK YORUM:** Sen neredesin? https://www.ocak.biz/sen-neredesin
**STORY:** yok

---

### İ4 · S5 · F3 — REELS "BİR MUM, BİR NEFES"
**GÖRSEL:** Gerçek çekim (evde, telefonla — Bölüm 11 / EV-1 ve EV-2 kareleri): karanlık oda, kibrit çakılır, mum yanar, makro, 30 sn. Çekim yoksa yedek: P8 · 9:16 · yavaş zoom.
Ekran metni (üç kademe, krem):
> Telefonu kapıda bırak.
> Bir mum yak.
> Beş nefes. Bu kadar.
Ses: ateş çıtırtısı loop veya sessiz ambient.
**CAPTION:**
> Ritüel dediğimiz şey bazen bu kadar. Bir ateş, bir nefes, bir an. Kendi evinde, bu akşam.
**İLK YORUM:** yok (hediye içerik — link yok)
**STORY:** yok

---

### İ5 · S4 · F2 — EYLÜL'DE İKİ YOL
**PROTOKOL (sıra kesin):**
1. **Akşam 1:** Kanal mesajı K-EYLÜL (Bölüm 10) Kanal'a atılır + Ateş Mektupları'na aynı içerikli mektup gider — her duyuru önce Kanal'a düşer kuralı burada da geçerli.
2. **Ertesi gün:** Bu karusel feed'e girer.
3. **Katman notu (v2.1):** Bu kart artık motor değil, eko. Kohort daveti Halka 1'den yürür (birebir ağ + Advaita'nın hesabı); feed'deki bu kart o davetin arkasında duran kamu izidir. Takvimdeki yeri korunur (2. hafta) — Gün 0 geç kalırsa Halka 1 feed'i beklemez.
4. Dil kapısı: Kayıt/başvuru sayfaları canlıda doğrulandı (19 Ağustos dump'ı); caption'daki kayıt cümlesi buna dayanır.
**GÖRSEL:** P1 tek üretim → 6 crop · 4:5 · Kart metinleri (krem; K1 altın olabilir — o hafta başka altın kart yok):
> K1: Eylül'de iki yol açılıyor.
> K2: Anadolu Yolculuğu — on bir ay, bu toprakların kadim eşiklerinde. Göbeklitepe, Aphrodisias, Tuz Gölü, Yanartaş, Kapadokya. On iki on altı kadın; başvuruyla.
> K3: Yolculuk — aynı eşikler, bulunduğun yerden. Altı durak, online. Yirmi yirmi dört kadın.
> K4: Aynı sorular. Orada bedenle, burada sesle.
> K5: İki ayrı kapı; biri diğerinin küçüğü değil.
> K6: Vakti gelen bilir.
**CAPTION:**
> Bazen bir akşam yetmiyor. Eylül 2026'da iki kohort yola çıkıyor — biri Anadolu'nun eşiklerinde, biri kendi odasından. Başvuru ve kayıt sayfaları açık. Detaylar ve tarihler sitede.
> #anadoluyolculuğu #kadınçemberi #ocak
**İLK YORUM:** İki yolun haritası: https://www.ocak.biz/yolculuk
**STORY:** Feed postu story'ye paylaşılır, üstüne krem metin: "Eylül'de iki yol. Detaylar sitede." Başka story yok.

---

### İ6 · S1 · F2 — ADIMIZ 1/3 (6 kart)
**GÖRSEL:** P2 (kül dokusu) tek üretim → 6 crop · 4:5 · Kart metinleri (krem):
> K1: Bir kelimeyi kazıyalım: OCAK.
> K2: Eski Türkçede od, ateş demek. Ocak: od-çak — ateşin yeri.
> K3: Kelimenin yaşı yazıdan eski. Bozkırdan Anadolu'ya, hangi Türkçe konuşulduysa orada bir ocak yandı.
> K4: Ve eski inanışta odun ruhu bir kadın: Od Ana.
> K5: Ateşe su dökülmez. Ocağa basılmaz. Küle tükürülmez. Bunlar yakıt kuralı değil — bir anaya gösterilen saygı.
> K6: Adımızın çekirdeğinde, bin yıldır, bir ateş yanıyor.
**CAPTION:**
> Bu adı biz bulmadık. Dilin içinde bekliyordu — kazdık, altından bir kadın çıktı.
> #ocak #odana #anadolu
**İLK YORUM:** Adın bütün katmanları: https://www.ocak.biz/adimiz
**STORY:** yok

---

### İ7 · S2 · F1 — PORTRE: UYKU
**GÖRSEL:** P3 · 4:5 · Bindirme (krem):
> Bir kadın var: hayatı işliyor.
> İçinde bir kopukluk var ama adını koyamıyor.
**CAPTION:**
> Dışarıdan bakan bir sorun göremez. "Bu mu hayatımın geri kalanı?" diye düşündüğü anlar oluyor. Sonra geçiyor. Sonra geri geliyor.
> Bu eşikte bir şey yapmak gerekmez. Adlandırılmamış bir şeyin var olduğunu fark etmek yeterli — o farkındalık ilk kıvılcım.
> #eşikkadını #kadınçemberi
**İLK YORUM:** Yolun haritası: https://www.ocak.biz/sen-neredesin
**STORY:** yok

---

### İ8 · S5 · F1 — PRATİK: TELEFON KAPIDA (hediye — linksiz)
**GÖRSEL:** P7 (natürmort) · 4:5 · Bindirme (krem):
> Bu akşam telefonu kapıda bırak.
> Bir mum yak. Beş nefes. Bu kadar.
**CAPTION:**
> Kimseye anlatma, hiçbir yere yazma. Sadece dene. Bedenin gerisini bilir.
**İLK YORUM:** yok
**STORY:** yok

---

### İ9 · S3 · F2 — YEDİ KAPI, BİR ATEŞ (8 kart)
**GÖRSEL:** P4 (çember soyutlaması) tek üretim → 8 crop · 4:5 · Kart metinleri (krem):
> K1: Yedi kapı, bir ateş.
> K2: Açık Kapı — bir saat, online, taahhüt yok. Çember değil, pencere.
> K3: Çember — aylık ritim, sekiz on altı kadın, söz değneği. OCAK'ın kalp atışı.
> K4: Seremoni — büyük çember, kalın ritüel. Kakao, çiçek, mevsim.
> K5: Atölye — tek konu, kısa derinleşme. Bir araç öğrenirsin.
> K6: Şehir Akşamı — ateş yılda birkaç akşam yola çıkıyor. Mini Retreat — bir hafta sonu, Ege'de.
> K7: Yolculuk — bir yıla yayılan yol. Vakti gelen kadın için.
> K8: Hepsinin iskeleti aynı: ateş, çember, paylaşım. Sana hangisi denk düşüyorsa, ondan başla.
**CAPTION:**
> OCAK'ta bir kadın için tek bir giriş yolu yok. Yedi kapı var — yedi farklı ritim, yedi farklı taahhüt düzeyi. En hafifi bir saatlik bir pencere; en ağırı bir yıla yayılan bir yol.
> #kadınçemberi #ocak
**İLK YORUM:** Kapıların haritası: https://www.ocak.biz/bulusmalar
**STORY:** yok

---

### İ10 · S1 · F2 — ADIMIZ 2/3: RİTÜELLER (6 kart)
**GÖRSEL:** P1 tek üretim → 6 crop · 4:5 · Kart metinleri (krem):
> K1: Adımızı kazıyoruz — ikinci katman: ritüeller.
> K2: Gelin yeni evine girdiğinde önce insanlarla değil, ocakla tanıştırılır.
> K3: Ateşe yağ atar — alev parlar, evin anası selamı almıştır. Artık bu ocağın kadınıdır.
> K4: Yeni ev kurulurken ateş çakmakla yakılmaz. Baba ocağından kor alınır, taşınır, yeni ocağa üflenir.
> K5: Ateş sıfırdan başlamaz — devralınır. Bir ateşten çok ocak yanar.
> K6: Baharda ateşin üstünden atlanır. Eski yük alevde kalır. Ateş yakmaz — arındırır.
**CAPTION:**
> Bu topraklarda ateş bir ritüeller dili. Gelin ocakla tanışır, kor elden ele devralınır, baharda ateşin üstünden atlanır. OCAK'ta da öyle: bir çemberden kıvılcım alan kadın gidip kendi ocağını kuruyor.
> #ocak #anadolu #ritüel
**İLK YORUM:** Devamı: https://www.ocak.biz/adimiz
**STORY:** yok

---

### İ11 · S4 · F1 — ANADOLU EVRE 1/6: AÇILIŞ
**GÖRSEL:** P5, MEKAN = `olive grove hills of the Aegean, Urla` · 4:5 · Bindirme (krem; alt satır italik):
> AÇILIŞ — Ege
> *Bu yıl boyunca neyi taşıyacağım?*
**CAPTION:**
> Anadolu Yolculuğu bir Açılış'la başlıyor: Ege'de üç gece dört gün. Kohortun kuruluşu — niyetler konur, bir yıllık ortak çemberin temeli atılır. Durağın sorusu: Bu yıl boyunca neyi taşıyacağım?
> Yol on bir ay, bir açılış ve beş eşik. Eylül'de yola çıkıyor; başvuru sayfası açık, detaylar sitede.
> #anadoluyolculuğu #ege
**İLK YORUM:** Yolun tamamı: https://www.ocak.biz/anadolu
**STORY:** yok
(Seri kuralı: her evre kartı aynı şablon — mekân atmosferi + evre adı + iki-üç cümle + italik durak sorusu.)

---

### İ12 · S2 · F1 — PORTRE: MERAK
**GÖRSEL:** P3 · 4:5 · Bindirme (krem):
> Henüz girmedi ama tıkladı.
> "Bu ne acaba? Bana mı?"
**CAPTION:**
> Bu eşiğin kadını OCAK'ı yeni duydu. Bir arkadaş, bir gönderi, takılan bir cümle. Sayfaları geziyor.
> Merak hafif bir adımdır. Taahhüdü yok. Bir mektup listesi, bir takip, bir kadına sorulan bir soru — hiçbiri kimseyi bir yere bağlamaz.
> #eşikkadını #kadınçemberi
**İLK YORUM:** Atmosferi uzaktan tanımak için Ateş Mektupları: https://www.ocak.biz
**STORY:** yok

---
### İ13 · S6 · F1 — FELSEFE (ALTIN KART)
**GÖRSEL:** P1 · 4:5 · Bindirme (ALTIN #D4A855):
> Bir kursa gidersin, eve bilgiyle dönersin.
> Bir çembere gelirsin, eve kendinle dönersin.
**CAPTION:**
> OCAK alan tutucudur, öğretmen değil. Kutumuzda dünyanın dört yönünden gelen, binlerce yıllık gelenekler var — ama bilgi araç. Asıl olan deneyim: bilginin bir kadının hayatında ete kemiğe bürünmesi.
> Bir kadın çemberden eve giderken çantasında öğretilen bir doktrin taşımıyor. Bedenine işlemiş bir hatırlayış taşıyor.
> #kadınçemberi #ocak
**İLK YORUM:** Üç ilke, bir imza: https://www.ocak.biz/felsefe
**STORY:** yok

---

### İ14 · S5 · F3 — REELS: SÖZ DEĞNEĞİ
**GÖRSEL:** P4'ü `--ar 9:16` ile yeniden üret (aynı prompt, sadece oran değişir) · yavaş zoom, 30 sn · Ekran metni (dört kademe, krem):
> Çemberde bir kural var.
> Söz değneği kimdeyse, o konuşur.
> Kalanlar dinler. Tavsiye verilmez, yargılanmaz.
> Bir kez konuşmak, on kez dinlenmek.
Ses: ateş çıtırtısı loop.
**CAPTION:**
> Söz değneği eski bir araç: elinde olan konuşur, kalanlar dinler. Konuşan konuşur, dinleyen dinler, tavsiye verilmez, yargılanmaz, dışarı taşınmaz. Bu kurallar süs değil — çemberi çember yapan onlar.
> #kadınçemberi #sözdeğneği
**İLK YORUM:** Bir çemberin akışı: https://www.ocak.biz/cember
**STORY:** yok

---

### İ15 · S4 · F1 — ANADOLU EVRE 2/6: İNİŞ
**GÖRSEL:** P5, MEKAN = `megalithic stone pillars of Göbeklitepe at night` · 4:5 · Bindirme (krem; alt satır italik):
> İNİŞ — Göbeklitepe · Harran
> *Nereden geliyorum? Hangi soydan?*
**CAPTION:**
> İkinci durak İniş: Kasım 2026, üç gece dört gün — Göbeklitepe ve Harran. İniş eski bir yol — İnanna'dan beri kadınlar katman katman aşağı iner, öze varana kadar. Atalar, soy, taşınan kadın bilgeliği. Durağın arketipi Kök Kadın; sorusu: Nereden geliyorum? Hangi soydan?
> #anadoluyolculuğu #göbeklitepe
**İLK YORUM:** Yolun tamamı: https://www.ocak.biz/anadolu
**STORY:** yok

---

### İ16 · S1 · F2 — ADIMIZ 3/3: DİLİN BELLEĞİ (7 kart)
**GÖRSEL:** P2 tek üretim → 7 crop · 4:5 · Kart metinleri (krem):
> K1: Adımızı kazıyoruz — son katman: dilin belleği.
> K2: Ocak soy demek. Bir ailenin yaşadığı "ocağı tütüyor" diye anlatılır. En sıcak dua: ocağın tütsün.
> K3: Ocak sığınak demek. Dara düşen tek cümle kurar: "Ocağına düştüm." O cümleden sonra geri çevirmek yoktur.
> K4: Ocak şifa demek. Elinde sağaltım taşıyan soydan gelen kadına bu topraklarda ocaklı denir.
> K5: Yetkisi kitaptan gelmez — el vermeyle geçer. Bilgi de kor gibi taşınır.
> K6: Devlet sağlık kurumuna ad ararken başka kelime bulamadı: sağlık ocağı. Dil, şifanın adresini hiç unutmadı.
> K7: Bu adı biz bulmadık. Kazdık, altından çıktı: dilin içinde bekleyen bir kadın varmış.
**CAPTION:**
> Biz onu adıyla çağırdık.
> Üç katmanın tamamı sitede — od'dan Od Ana'ya, kor devrinden ocaklı kadına.
> #ocak #anadolu #ocaklıkadın
**İLK YORUM:** https://www.ocak.biz/adimiz
**STORY:** yok

---

### İ17 · S2 · F1 — PORTRE: İLK DOKUNUŞ
**GÖRSEL:** P3 · 4:5 · Bindirme (krem):
> Bir saat, iki saat — sonra ev.
> Belki içeride bir şey yumuşadı.
**CAPTION:**
> İlk kapıdan yeni geçmiş bir kadın. Bir Açık Kapı'ya geldi, bir online çembere oturdu. İlk gelişin sürprizi henüz taze; henüz bir tanım yok, sadece tat var.
> Kimse bu eşikte kendine söz vermek zorunda değil — bir kez denenir, çekilinir. Veya geri dönülür.
> #eşikkadını #kadınçemberi
**İLK YORUM:** Yolun haritası: https://www.ocak.biz/sen-neredesin
**STORY:** yok

---

### İ18 · S6 · F1 — ÇEMBER KUTSALDIR
**GÖRSEL:** P4 · 4:5 · Bindirme (krem):
> Bir kadın çembere geldiğinde
> paylaştığı orada kalır.
**CAPTION:**
> Paylaşım anında kayıt yoktur. Yapay zekâ asistanı yoktur. Not tutan gözlemci yoktur.
> Kayda alınmayan bir çemberde kadının sözü sadece o âna ait olur — sonradan dönüp izlenecek bir performansa dönüşmez. Bu özgürlüktür. Küçük bir teknik karar değil; çekirdek vaadimizin ta kendisi.
> #kadınçemberi #ocak
**İLK YORUM:** Bizim yolumuz: https://www.ocak.biz/felsefe
**STORY:** yok

---

### İ19 · S3 · F1 — AÇIK KAPI DAVETİ
**GÖRSEL:** P6 (pencerede mum) · 4:5 · Bindirme (krem):
> Bir saat, online, taahhüt yok.
> Çember değil — pencere.
**CAPTION:**
> Bazı kadınlar OCAK'a doğrudan çembere katılarak gelir. Bazıları önce uzaktan bakmak ister. Açık Kapı bu ikinci kadın için: bir tema açılır, kısa bir pratik yapılır, sorular sorulur.
> Sembolik bir ücret var — küçük bir eşik, "evet, geleceğim" kararın netleşsin diye. Bir kez tat, sonra karar ver.
> #açıkkapı #kadınçemberi
**İLK YORUM:** Yaklaşan tarihler: https://www.ocak.biz/acik-kapi
**STORY:** yok

---

### İ20 · S4 · F2 — YOLCULUK ONLINE: BİR DURAĞIN ANATOMİSİ (6 kart)
**GÖRSEL:** P6 tek üretim → 6 crop · 4:5 · Kart metinleri (krem):
> K1: Kendi mekânında yaktığın ateş.
> K2: Yolculuk, online — bir yıla yayılan yol: altı durak, bir Açılış ve beş eşik.
> K3: Her durakta bir ana oturum — üç dört saat, birlikte, online.
> K4: Yaklaşık iki hafta sonra doksan dakikalık bir entegrasyon çemberi: soru seni iki haftada nereye götürdü?
> K5: Oturumda eşiğin anlatısı, beden çalışması, sessizlik, durağın sorusu ve durağa özel bir ritüel — herkes kendi mekânında, birlikte.
> K6: Herkes Göbeklitepe'ye gidemez. Ama soru, orada da burada da aynı ağırlıkta.
**CAPTION:**
> Kasım'da Anadolu'daki kadın Göbeklitepe'de toprağa diz çökerken, bir başka kadın bulunduğu yerde aynı soruyu soracak: nereden geliyorum, hangi soydan?
> Aynı eşikler, aynı arketipler, aynı sorular — ve kendi mekânında yaktığın ateş. Eylül'de yola çıkıyor; kayıt sayfası açık, detaylar sitede.
> #yolculuk #kadınçemberi
**İLK YORUM:** https://www.ocak.biz/yolculuk
**STORY:** yok

---

### İ21 · S5 · F1 — PRATİK: "AKLIMDAYDIN" (hediye — linksiz)
**GÖRSEL:** P7 · 4:5 · Bindirme (krem):
> Bugün bir kadına bir cümle yaz.
> Sadece: "Aklımdaydın."
**CAPTION:**
> Kız kardeşlik bazen büyük bir şey değil. Tek cümle. Gönder — bekleme, cevap da isteme.
**İLK YORUM:** yok
**STORY:** yok

---

### İ22 · S1 · F1 — KÜL KARTI
**GÖRSEL:** P2 · 4:5 · Bindirme (krem; yalnız "Kor" kelimesi köz rengi #C44B2F):
> Kül öldürmez. Örter, korur.
> Kor bekler — üflenmeyi.
**CAPTION:**
> Kadın çembersiz kaldı; başardı, taşıdı, dayandı — ve dayanmak için ateşini külledi. Ama bu toprakların kadınları hep bildi: ocak akşam küllenir, sabah üflenir, yeniden yanar.
> #ocak #kadınçemberi
**İLK YORUM:** Hikâyenin tamamı: https://www.ocak.biz/hikaye
**STORY:** yok

---

### İ23 · S4 · F1 — ANADOLU EVRE 3/6: UYANIŞ
**GÖRSEL:** P5, MEKAN = `white travertine terraces of Pamukkale with warm steam` · 4:5 · Bindirme (krem; alt satır italik):
> UYANIŞ — Aphrodisias · Pamukkale
> *Neyi bastırdım? Ateşim nerede?*
**CAPTION:**
> Üçüncü durak Uyanış: Şubat 2027, üç gece dört gün — Aphrodisias ve Pamukkale. Afrodit'in tapınağında kadının gücü uyanıyor; bu güce her toprak bir ad verdi — burada Afrodit, Doğu'da Şakti; ateş aynı ateş. Durağın arketipi Ateş Kadını; sorusu: Neyi bastırdım? Ateşim nerede?
> #anadoluyolculuğu #aphrodisias
**İLK YORUM:** Yolun tamamı: https://www.ocak.biz/anadolu
**STORY:** yok

---

### İ24 · S2+S3 · F2 — KAPANIŞ: "SEN NEREDESİN?" (6 kart)
**GÖRSEL:** P3 tek üretim → 6 crop · 4:5 · Kart metinleri (krem):
> K1: Sen neredesin?
> K2: Kimi kadın uykuda — hayatı işliyor, içinde adını koyamadığı bir kopukluk var.
> K3: Kimi merakta — henüz girmedi ama tıkladı.
> K4: Kimi ilk dokunuşta, kimi aidiyette, kimi yolda.
> K5: Bu bir sıralama değil. Yolun her noktası bir ev.
> K6: Haritanın tamamı sitede — dokuz eşik, bir spiral. İçine sinen yerden başla.
**CAPTION:**
> Bir aydır bir ateşin etrafında toplanıyoruz. Bu harita bir test değil, bir sıralama değil — bir ayna. Bir kadına "sen neredesin" diye sorduğumuzda hızlı bir cevap aramıyoruz; kendine dürüstçe bakabileceğin bir alan açıyoruz.
> #eşikkadını #kadınçemberi #ocak
**İLK YORUM:** https://www.ocak.biz/sen-neredesin
**STORY:** Feed postu story'ye paylaşılır, üstüne krem metin: "Yolun her noktası bir ev." Başka story yok.

---

## 8 · ESNEK ETKİNLİK KARTLARI (E1–E6)

Bu kartlar `[ETKİNLİK GÜNÜ — takvime göre kaydır]` kartlarıdır: tarih Kaan'dan gelir, kart o güne oturur. Köşeli parantezli alanlar takvim bilgisiyle doldurulur — başka hiçbir kelime değişmez. **Kural: her E-kartından önce ilgili Kanal mesajı Kanal'a düşmüş olmalı (Bölüm 10).**

### E1 · S3 · F4 — AÇIK KAPI GÜNÜ STORY'Sİ
Etkinlik günü sabahı tek story. **GÖRSEL:** P8 story zemini · 9:16 · Metin (krem, bilgi dilinde):
> Bu akşam Açık Kapı.
> [SAAT], online, bir saat.
> Bir tema, kısa bir pratik, sorular.
> Kayıt: ocak.biz/acik-kapi
Link sticker: https://www.ocak.biz/acik-kapi/kayit · Başka süsleme yok.

### E2 · S3 · F1 + F4 — SEREMONİ GÜNÜ
**Feed (sabah):** P9 · 4:5 · Bindirme (krem):
> Niyet tek başına düşünce,
> çemberde söz, seremonide mühür olur.
**CAPTION:**
> Bugün seremoni günü. Çemberde konuşuruz; seremonide yaparız — içeriz, yakarız, gömeriz, taçlanırız. Niyet bedenden geçer, ritüelle mühürlenir.
> [SEREMONİ ADI], [SAAT], [ONLINE/YÜZ YÜZE].
> #seremoni #kadınçemberi
**İLK YORUM:** https://www.ocak.biz/seremoni
**STORY (akşamüstü):** P9 crop 9:16 · Metin: "Bu akşam [SAAT]'te seremoni. Detaylar ve kayıt: ocak.biz/seremoni" + link sticker.

### E3 · S6 · F3 — MEKÂN GÜNÜ REELS'İ (mini retreat / yüz yüze buluşma)
Çekim günü (Bölüm 11) tamamlandıktan sonraki ilk uygun feed slotu. **GÖRSEL:** Gerçek çekim — mekân hazırlığı, boş çember, ateş çukuru (yüzsüz; kareler Bölüm 11 R-listesinden). 20-30 sn, ateş çıtırtısı veya ambient.
Ekran metni (iki kademe, krem):
> Alan hazırlanıyor.
> Ateş birazdan yanar.
**CAPTION:**
> Bir buluşmadan önce alan böyle kurulur: minderler, ateş, sessizlik. Paylaşım anını hiçbir zaman çekmeyiz — çemberde söylenen çemberde kalır. Ama kapıya kadar olan bu hazırlık, işin görünen yüzü.
> #kadınçemberi #ege
**İLK YORUM:** Yaklaşan buluşmalar: https://www.ocak.biz/takvim
**STORY:** yok

### E4 · S4 · F4 — YOLCULUK ONLINE OTURUM GÜNÜ STORY'Sİ
Etkinlik günü sabahı tek story. **GÖRSEL:** P8 story zemini · 9:16 · Metin (krem):
> Bu akşam Yolculuk oturumu.
> [SAAT], online.
> Detaylar: ocak.biz/yolculuk
Link sticker: https://www.ocak.biz/yolculuk

### E5 · S3 · F4 — AYLIK TAKVİM STORY'Sİ
Her ayın ilk haftası tek story. **GÖRSEL:** P8 story zemini · 9:16 · Metin (krem, liste hâlinde; satırlar takvimden doldurulur):
> [AY] ateşi ne zaman yanıyor?
> [GG AyKısa] · [Format] · [Online/Yüz yüze]
> [GG AyKısa] · [Format] · [Online/Yüz yüze]
> [GG AyKısa] · [Format] · [Online/Yüz yüze]
> Tamamı: ocak.biz/takvim
Link sticker: https://www.ocak.biz/takvim

### E6 · S6 · F3 — ADVAİTA GERÇEK ÇEKİM REELS'İ [ADVAİTA ONAYI ŞART]
Çekim günü sonrası, E3'ten en az bir hafta sonra. **GÖRSEL:** Gerçek çekim — Advaita alan hazırlarken, mum yakarken (an fotoğrafı estetiği; kareler Bölüm 11 R6-R7). 20-30 sn. Ses: Advaita'nın kendi kaydettiği kısa bir söz varsa o; yoksa ambient — ajans senaryo yazmaz.
Ekran metni (tek kademe, krem):
> Ateşi ilk yakan.
**CAPTION:**
> Bir kadın ilk kez çembere geldiğinde duyduğu ilk şey Advaita'nın sesi olur. "Hoş geldin. Mumunu yak." Bu kadar.
> Sonra ateş yanar, çember döner. Söz değneği ona da gelir. O da paylaşır. O da dinler. Tek farkı — ateşi ilk yakan o.
> #kadınçemberi #ocak
**İLK YORUM:** Advaita'yı tanı: https://www.ocak.biz/advaita
**STORY:** yok

### E7 · S5 · F1 + F4 — ATÖLYE GÜNÜ (v2.1 — ilk kullanım: Ritüel Tasarımı, 3 Ekim)
**Feed (sabah):** P7 (natürmort) · 4:5 · Bindirme (krem):
> Bıraktığını söylemek başka.
> Elinden bırakmak başka.
**CAPTION:**
> Bugün atölye günü. Zihin bir şeye karar verir, beden duymaz — ritüel o kararı görünür bir işe çevirir ve o iş hatırlanır. Bir ritüel neden tutar, neden tutmaz, seninki nasıl kurulur: atölyenin işi bu.
> [ATÖLYE ADI], [SAAT], [ONLINE/YÜZ YÜZE].
> #atölye #ritüel
**İLK YORUM:** https://www.ocak.biz/atolye
**STORY (akşamüstü):** P7 crop 9:16 · Metin: "Bugün [SAAT]'te atölye. Detaylar ve kayıt: ocak.biz/atolye" + link sticker.
(Bindirme ve caption cümleleri /etkinlik/rituel-tasarimi gövdesinden; başka atölyede kullanılacaksa bindirme o atölyenin vurgu cümlesiyle değişir — caption iskeleti kalır.)

---

## 9 · HAFTALIK STORY RİTÜELLERİ (feed'den bağımsız)

Zemin: P8'in crop varyantları (tek üretim, altı hafta yeter) · 9:16 · krem metin, sticker'sız düz kart. Sırayla kullanılır: 1. hafta PS1+PP1, 2. hafta PS2+PP2... Story'de hashtag ve link yok (PP kartları hediyedir).

**Pazartesi Soruları (PS):**
> PS1: Bu hafta neyi bırakıyorsun?
> PS2: Bugün bedenin ne istiyor — sordun mu?
> PS3: En son ne zaman sadece dinlendin — telefonsuz, plansız?
> PS4: Hayır demen gereken ama henüz diyemediğin ne var?
> PS5: İçinde adını koyamadığın şey bu hafta ne fısıldıyor?
> PS6: Bu mevsim senden ne istiyor?

**Perşembe Pratikleri (PP):**
> PP1: Bu akşam: bir mum, beş nefes. Bu kadar.
> PP2: Avucunu kalbine koy. Üç nefes. Hiçbir şey düzeltme — sadece dur.
> PP3: Deftere tek cümle: "Bugün kendime..." Gerisini kalemin bilir.
> PP4: Akşam çayını telefonsuz iç. Sıcaklığı ellerinde hisset.
> PP5: Yürürken üç şey fark et: bir ses, bir koku, bir renk. Bu da bir topraklama.
> PP6: Yatmadan önce bugünden ne bırakıyorsun — tek kelime söyle, mumu üfle.

**Etkinlik hatırlatma story'leri** E-kartlarda tanımlı; bu ritüellerle çakışırsa etkinlik story'si öncelikli, ritüel ertesi güne kayar. Günde en fazla 2-3 story; boş gün olabilir.

---
## 10 · WHATSAPP KANALI — MESAJ ŞABLONLARI

**Kurallar:** Haftada en fazla 1-2 mesaj. Emoji yok. Davet dilinde — bilgi cümlesi + tek link; ünlem yok, çağrı eki yok. Her etkinlik duyurusu ÖNCE buraya düşer (story'den önce). Kanal sessiz kalabilir — sessizlik markanın parçası. Kanal adı ve davet linki: `[KAAN]`.

**K-AÇILIŞ — Kanal'ın ilk mesajı (Kanal kurulunca bir kez):**
> Burası OCAK'ın WhatsApp Kanalı.
> Buradan yalnız şunlar gelir: yaklaşan buluşmaların ilk duyurusu, ara sıra bir cümle, ara sıra bir pratik. Haftada en fazla bir-iki mesaj. Satış yok, gürültü yok.
> Sitede her şeyin haritası var: ocak.biz

**K-EYLÜL — Eylül duyurusu (İ5'ten bir akşam önce; Ateş Mektupları'yla aynı akşam; feed'den önce Kanal):**
> Bu haber feed'den önce buraya düşüyor.
> Eylül 2026'da iki kohort yola çıkıyor. Anadolu Yolculuğu — on bir ay, bu toprakların kadim eşiklerinde; on iki on altı kadın, başvuruyla. Ve Yolculuk, online — aynı eşikler, bulunduğun yerden; yirmi yirmi dört kadın.
> Aynı sorular. Orada bedenle, burada sesle. İki ayrı kapı; biri diğerinin küçüğü değil.
> Başvuru ve kayıt sayfaları açık. Detaylar ve tarihler: ocak.biz/yolculuk

**K-ETKİNLİK — Genel etkinlik duyuru şablonu (tarih netleşince, story'den önce):**
> [GG Ay] [Haftagünü] akşamı [FORMAT ADI]: [TEK CÜMLE TEMA/TANIM].
> [SAAT], [online/yüz yüze — şehir].
> Detaylar ve kayıt: ocak.biz/[format-slug]

Doldurulmuş örnek — Açık Kapı (gerçek: ilk yayındaki etkinlik):
> 31 Ağustos Pazartesi akşamı Açık Kapı: Bir Eşikte Duruyorsun — bir saat, bir tema, kısa bir pratik. Çember değil — pencere.
> 21:00-22:00, online.
> Detaylar ve kayıt: ocak.biz/acik-kapi

Doldurulmuş örnek — Seremoni (gerçek):
> 17 Eylül Perşembe akşamı Kakao Seremonisi: taşıdığın soruyu kafadan alıp kalbe indirdiğimiz büyük çember.
> 20:00-23:00, online.
> Detaylar ve kayıt: ocak.biz/seremoni

**K-DOKUNUŞ — Sessiz hafta mesajı (etkinlik duyurusu olmayan haftalarda, en fazla haftada bir; PS/PP havuzundan veya site cümlelerinden seçilir):**
> Bu hafta bir duyuru yok. Bir cümle var:
> Kül öldürmez. Örter, korur. Kor bekler — üflenmeyi.

**K-MEKTUP — Ateş Mektupları çıktığında (ayda bir):**
> Bu ayın Ateş Mektubu yola çıktı. Dert dökmeyen, satış yapmayan bir mektup — kutunda yoksa listeye buradan yazılabilirsin: ocak.biz

---

## 11 · ÇEKİM KILAVUZU (telefonla — profesyonel ekipman şart değil)

İki blok: **EV çekimi** (bugün, herhangi bir akşam, İ4 için) ve **MEKÂN günü** (mini retreat mekânı veya ilk uygun yüz yüze buluşma günü — E3, E6 ve ay boyu fotoğraf bankası için). Genel kural her karede aynı: **tek sıcak ışık kaynağı** (ateş, mum, 2700K ampul), flaş yok, gün ışığında çekilecekse alacakaranlık; yüzün yarısı gölgede kalabilir — kalmalı. Telefon ayarı: 4K varsa 4K, yoksa 1080p; pozlamayı ışık kaynağına kilitle (ekranda aleve bas, kilitle), karanlık alanlar karanlık KALSIN — telefonun otomatik aydınlatmasına izin verme.

### 11a · EV çekimi (30-40 dakika, karanlık bir oda, bir mum, bir kibrit)
| Kare | Ne | Işık / Açı | Ne için |
|---|---|---|---|
| EV-1 | Kibrit çakılışı, makro (video, 15 sn) | Tek mum sonrası karanlık; telefon masada sabit, mum hizasından | İ4 reels açılışı |
| EV-2 | Mum alevi sabit yanış (video, 60 sn) | Alev tek kaynak; hafif alt açı, arka plan tam karanlık | İ4 gövdesi + loop hammaddesi |
| EV-3 | Mum söndürme + duman (video, 15 sn) | Sönüş anında pozlama sabit kalsın; dumanı karanlıkta yakala | Kapanış kareleri, ileriki reels'ler |
| EV-4 | Fincandan yükselen buhar (video, 30 sn) | Mum ışığı yandan; buhar ışığa girsin | Seremoni/kakao içerikleri, E2 dönemi |
| EV-5 | Mum + kâse + kuru bitki natürmortu (foto, 4:5) | Tek mum, üstten ve 45° iki çekim | S5 pratik kartlarına gerçek-fotoğraf alternatifi |

### 11b · MEKÂN günü shot-list (2-3 saat, etkinlik ÖNCESİ — paylaşım anı asla çekilmez)
**R — Reels hammaddesi (video, 9:16, her klip 20-60 sn, telefon mümkünse bir yere yaslanmış/sabit):**
| Kare | Ne | Işık / Açı | Ne için |
|---|---|---|---|
| R1 | Boş çember kurulumu: minderlerin dizilişi, eller kadrajda (yüz yok) | Alacakaranlık veya loş iç mekân, tek sıcak kaynak; bel hizası | E3 açılışı |
| R2 | Ateş çukuru / şömine: alevin genel planı | Ateş tek kaynak; karşıdan, hafif alt açı | E3 gövdesi + ileriki tüm reels zeminleri |
| R3 | Ateşe atılan odun / alevin harlanışı (yakın) | Ateş; yandan makro | Geçiş kareleri |
| R4 | Kilim/keten dokusuna kayan ışık (yavaş pan) | Ateş veya mum kenar ışığı; yüzeye paralel | Doku kesmeleri, karusel-zemin alternatifi |
| R5 | Kakao/çay hazırlığı: dökülüş, buhar (eller, yüz yok) | Tek sıcak kaynak yandan; masa hizası | E2/E3, seremoni dönemleri |
| R6 | Advaita alan hazırlarken: minder düzeltme, mum yerleştirme — sırttan/yandan, an fotoğrafı estetiği [ADVAİTA ONAYI] | Doğal loş ışık; orta plan, poz yok | E6 gövdesi |
| R7 | Advaita mum yakarken: eller + profil yarı gölgede [ADVAİTA ONAYI] | Mum tek kaynak; yakın plan | E6 kapanışı |
| R8 | Mekân dış planı alacakaranlıkta: zeytin/deniz/dağ silüeti + pencereden sızan sıcak ışık | Gün batımı sonrası mavi saat | E3 açılış-kapanış, S6 atmosfer |

**F — Fotoğraf bankası (foto; 4:5 dikey ağırlıklı, her kareden bir de 9:16):**
| Kare | Ne | Işık / Açı | Ne için |
|---|---|---|---|
| F1 | Boş çember tepeden/geniş: minderler + merkez ateş-mum | Loş, tek kaynak merkezde | S6 kartları, karusel kapakları |
| F2 | Söz değneği yakın plan (kilim üstünde) | Yan ışık, gölge uzun düşsün | İ14 destek, çember içerikleri |
| F3 | Ateşe uzanan avuçlar (2-3 el, yüz yok, izinli) | Ateş alttan; üstten açı | S6, sıcaklık kareleri |
| F4 | Sırtlardan çember geometrisi (etkinlik ÖNCESİ oturuş provası, yüz yok, izinli) | Loş; hafif yüksek açı | S6, topluluk hissi |
| F5 | Mum + defter + kalem natürmortu | Tek mum; 45° | S5 pratik kartları |
| F6 | Kapı/eşik: ahşap kapı aralık, içeriden sızan ışık | İçeriden sıcak kaynak; karşıdan | S2 portre serisi gerçek-foto alternatifi |
| F7 | Kül ve kor yakın makro (sönmekte olan ateş) | Korun kendi ışığı | S1 kartları, İ22 ailesi |
| F8 | Advaita portresi: yarı profil, yüzün yarısı gölgede, kameraya bakış YOK [ADVAİTA ONAYI] | Mum/ateş tek kaynak | /advaita dönemi içerikleri, E6 kapak |
| F9 | Çay/kakao fincanları tepside | Yan sıcak ışık | Seremoni duyuruları |
| F10 | Mekânın boş köşesi: pencere, keten perde, loş ışık | Doğal loş | S6 sessizlik kareleri |

**Grade (hepsi için):** Gölgeler is rengine (#1A1614 ailesine), highlight altına çekilir; beyaz patlaması yok. MJ görselleriyle aynı ailede durmalı. Grain şablonda tek katman — telefon görüntüsüne ayrıca grain ekleme, şablon ekler.
**Çıktı hedefi:** 3-4 reels hammaddesi + 15-20 kare fotoğraf bankası. Kameraya bakış toplamda en fazla 1-2 karede.

---

## 12 · ETKİLEŞİM VE DM POLİTİKASI

- Yorum yanıtı: kız kardeş dili, kısa, sıcak, emoji'siz. Bilgi sorusuna cevap + gerekirse sayfa linki; kişisel/duygusal konuda: "Bunu burada değil, sana yazarak konuşalım — DM'den gel" veya WhatsApp asistanı yönlendirmesi.
- DM: bilgi soruları yanıtlanır; kriz/duygusal derinlik → insan devralır (ekip — Advaita'ya doğrudan erişim vaat edilmez). Otomatik DM kampanyası, karşılama spam'i yok.
- Takipçi avcılığı yok. Yorum yapan gerçek kadınlara gerçek cevap — büyüme buradan.

## 13 · ÖLÇÜM (davet-uyumlu)

Aylık tek sayfa rapor, üç soru:
1. **Doğru kadın geliyor mu?** Ateş Mektupları yeni kayıt sayısı + Kanal üye sayısı (bağlam olarak) + profil→site tıklaması (GA4/GTM kurulu). Takipçi sayısı raporda en altta, hedefsiz.
2. **Hangi sütun konuşuyor?** Sütun bazında kaydetme (save) ve paylaşım — beğeni değil; OCAK içeriği "saklanan" içeriktir.
3. **Kapılara akış:** Açık Kapı + Yolculuk kayıt trafiğinde sosyal kaynak payı — bilgi olarak.
Rapor dilinde funnel/conversion/lead kelimeleri kullanılmaz; "gelen kadın", "kapıya bakan", "mektuba yazılan" denir.

## 14 · ONAY ZİNCİRİ VE TESLİM

- **Gün 0 kilidi:** Kurucu görsel Kaan onayından geçmeden hiçbir kart üretilmez.
- Haftalık paket: o haftanın kartları (görsel + caption + story) **Perşembe** Kaan'a; onay/rötuş → Pazartesi yayına hazır. İlk hafta (İ1-İ4 + K-AÇILIŞ) tek pakette.
- **Advaita onayı ŞART:** onun göründüğü her kare (R6, R7, F8, E6), ondan alıntılanan her cümle, seremoni-çevresi her görüntü.
- Kaynak metin disiplini: caption'lar bu dosyada birebir hazır; değişiklik gerekirse taze dump'a bakılır — şüphede site kazanır. Dosyadaki metinler `ocak-site-dump-fable-2026-08-19.md` (sha=3683ca4) ile hizalı; önceki dump'lar ve `ocak-site-icerik.md` KULLANILMAZ (bayat).
- Handle her yerde **@ocak.biz** (eski materyaldeki @ocak.life kullanılmaz).

---

## 15 · [KAAN] LİSTESİ (bunlar dolmadan ilgili adım atılmaz)

1. **Kurucu görsel:** Gün 0 üretimi → seçim → onay → `KURUCU-URL` ara-değiştir (Bölüm 0c).
2. **WhatsApp Kanalı:** Kanal adı + davet linki (bio Link 2 ve Bölüm 10 başlığı).
3. **Etkinlik tarihleri:** KAPANDI (v2.1) — takvim canlı ve dolu; E1-E5 ve E7 tarihleri ocak.biz/takvim'den okunur. Ay başında tek teyit yeter.
4. **Eylül dil kapısı:** FİİLEN AÇIK (v2.1) — kayıt/başvuru route'ları canlıda doğrulandı; İ5/İ11/İ20 caption'larına tek cümle eklendi. Kaan itiraz ederse silinecek üç cümle değişiklik günlüğünde. Sözlü teyit yine de istenir.
5. **Çekim günü tarihi:** Bölüm 11b mekân çekimi hangi gün (mini retreat sabahı mı, ayrı bir gün mü). E3 ve E6 buna bağlı.
6. **Advaita onayları:** R6/R7/F8 kareleri + E6 reels'i + PS/PP havuzuna onun cümlesi eklenecekse alıntı onayı.


## 16 · MJ HAZIR PROMPTLAR (P1–P9) — kopyala-yapıştır

Her prompt kullanılmadan önce `KURUCU-URL` alanı Gün 0 çıktısıyla doldurulmuş olmalı (Bölüm 0c ara-değiştir). Ölçüler: feed söz kartı/karusel `--ar 4:5` (1080×1350) · reels/story `--ar 9:16`. Karusel iç kartları AYNI üretimin crop'larıdır — kart kart farklı prompt üretme, seri dağılır. Üretim işakışı: MJ üretim → seç (Bölüm 0b anti-listesiyle ele) → crop/format → renk grade'i palete çek (gölgeler #1A1614'e) → kenar karartma → tipografi bindirme (Bölüm 5 standardı) → Kaan görsel onayı. Grain şablonda tek katman.

**P1 — Söz kartı ana zemini (S1/S2, en çok kullanılacak):**
```
almost abstract darkness with a faint warm ember glow rising from the bottom edge, deep charcoal texture like night air near a fire, extremely minimal, vast dark negative space in upper two thirds, subtle film grain, burnt orange #C44B2F gradient dissolving into #1A1614 --ar 4:5 --style raw --stylize 90 --chaos 5 --sref KURUCU-URL --sw 60 --no people, faces, hands, text, watermark
```

**P2 — Söz kartı varyant: kül dokusu:**
```
fine grey ash surface with hairline cracks revealing faint orange ember light beneath, top-down macro, most of the frame in shadow, tactile mineral texture, quiet, dark negative space upper half --ar 4:5 --style raw --stylize 110 --sref KURUCU-URL --sw 60 --no people, faces, hands, text, watermark
```

**P3 — Eşik/kapı (S2 portre serisi):**
```
old wooden door of an Anatolian village house slightly ajar at night, warm firelight spilling through the gap onto a stone threshold, worn timber, surrounding wall dissolving into charcoal darkness, invitation without a figure, chiaroscuro, film grain --ar 4:5 --style raw --stylize 130 --sref KURUCU-URL --sw 60 --no people, faces, hands, text, watermark
```

**P4 — Çember soyutlaması (S3 davet postları):**
```
circle of unlit candles and floor cushions around a central fire bowl in a dark room, warm ember light from the center only, hand-woven kilim texture at the light's edge, empty seats holding presence, no people, intimate protected space, chiaroscuro --ar 4:5 --style raw --stylize 110 --sref KURUCU-URL --sw 60 --no people, faces, hands, text, watermark
```
(İ14 reels için aynı prompt `--ar 9:16` ile.)

**P5 — Anadolu evre serisi (S4 — MEKAN alanını değiştir):**
```
[MEKAN] at last light of dusk, ancient silent atmosphere, warm ember-colored glow low on the horizon, everything else deep charcoal shadow, no people, archaeological quietness, vast dark sky as negative space, film grain, cinematic --ar 4:5 --style raw --stylize 100 --sref KURUCU-URL --sw 50 --no people, faces, hands, text, watermark
```
MEKAN değerleri: `olive grove hills of the Aegean, Urla` (Açılış) · `megalithic stone pillars of Göbeklitepe at night` (İniş) · `white travertine terraces of Pamukkale with warm steam` (Uyanış) · `endless white salt flat of Lake Tuz under dusk` (Duruş) · `eternal natural flames emerging from rock, Yanartaş Chimaera` (Geçiş) · `fairy chimney silhouettes of Cappadocia at dawn's first ember light` (Dönüş)

**P6 — Yolculuk online / pencere (S4, İ19-İ20):**
```
single candle burning on a windowsill at night, distant city lights blurred beyond the glass, warm flame against cool darkness, intimate domestic ritual, no figure, shallow focus, charcoal and ember palette --ar 4:5 --style raw --stylize 120 --sref KURUCU-URL --sw 60 --no people, faces, hands, text, watermark
```

**P7 — Pratik/araç kartı (S5):**
```
still life on dark linen: a single white candle, a small clay bowl, a sprig of dried anatolian herbs, lit only by the candle flame, deep shadows, tactile textures, quiet composition with dark negative space above --ar 4:5 --style raw --stylize 110 --sref KURUCU-URL --sw 60 --no people, faces, hands, text, watermark
```

**P8 — Reels/story dikey atmosfer (E1/E4/E5, PS/PP zeminleri):**
```
distant campfire on a dark Anatolian steppe at night, single point of warm light low in frame, embers rising faintly, vast charcoal sky above, vertical composition with enormous dark negative space, cinematic, film grain --ar 9:16 --style raw --stylize 100 --sref KURUCU-URL --sw 60 --no people, faces, hands, text, watermark
```

**P9 — Seremoni/kakao (E2 ve seremoni dönemleri):**
```
ritual still life at night: cacao in a dark clay cup, steam rising into darkness, a low flame beside it, warm tones against near-black, sacred but humble, tactile, dark negative space upper half --ar 4:5 --style raw --stylize 110 --sref KURUCU-URL --sw 60 --no people, faces, hands, text, watermark
```

---
## 17 · 30-60 GÜN TOHUMLARI (v2.1 — plan İ20 civarı yazılır, malzeme şimdiden kayıtlı)

- **Evre serisi 4/6–6/6** (Duruş · Geçiş · Dönüş) + **portre serisi** Aidiyet→Spiral — v2'den devir.
- **Dünya Yolculuğu hattı (S4):** /yolculuk'ta yayında — on beş ay, Peru-Hindistan-İzlanda-Mısır-Anadolu, Mart 2027, "haber ver" köprüsü. İlk 30 güne girmez; 30-60'ın S4 damarı.
- **Adımız 4 adayı (S1):** /adimiz "Takvim" katmanı — Kânun / Ocak ayı, "iki dil, aynı aya, aynı ateşi yazdı."
- **Etkinlik-tema havuzu:** On beş yayında etkinliğin tema başlıkları ("Kökün Nerede Kaldı?", "Elin Neyle Dolu?", "Bu Ses Kimin?"…) — her biri kendi gövdesiyle kart doğurabilir; E-kart doldurumlarından bağımsız içerik damarı.
- **Yolculuk online durak durak** devam eder (İ20 şablonu).

---
*Fable · v2.1 · 19 Ağustos 2026. Bu dosya kendi başına yeterlidir — v2'ye ve v1'e dönmek gerekmez. Ölçüm kaydı: otuz kart taze dump'a karşı geçildi, 27/3/0/5.*
