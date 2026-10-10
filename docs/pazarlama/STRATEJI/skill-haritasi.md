# Skill Haritası

Hangi işte hangi skill çağrılır. Amaç: her gönderi dosyasının "Üretim ve skill" bölümü bir komut zinciri gibi okunsun.

## Mevcut skill'ler

Korpusta ölçüldü (commit `9c3576c`, `docs/skills/` altındaki klasörler):

| Skill | Ne yapar | Pazarlamada nerede |
|---|---|---|
| `ocak-metin` | Marka sesiyle taslak: caption, bülten, sayfa gövdesi | Her yeni caption, mail, kart metni |
| `ocak-lint` | Yasak dize ve yargı denetimi | Yayından önce her metin; kapıdır |
| `ocak-etkinlik` | Etkinlik gövdesi ve örnekleri | Açık Kapı ve Çember davetlerinde tema ve gövde teyidi |
| `ocak-notion` | Taze döküm | Takvim, kayıt sayıları, etkinlik gövdesi |
| `ocak-kararci` | Karar satırı | Bu planın kararlarını ledger'a yazdırırken |
| `ocak-teshis` | Durum teşhisi | Site uyarlamasından önce |
| `ocak-arsivci` | Arşivleme | Dönem kapanışında bu paketi arşive taşırken |

## Önerilen dört yeni skill

Üçü bu sohbette öneri kartı olarak sunuldu (kaydetmek Kaan'ın elinde); dördüncüsü fikir.

### `ocak-gonderi`

**Ne zaman:** bir gönderi yayına hazırlanırken.

**Girdi:** gönderi dosyasının adı (`1015-O-soz-dayanmak`) ya da "yarının işleri".

**Yaptığı:**
1. Dosyayı okur; tarih ve temayı takvimle karşılaştırır (etkinlik tarihleri için `ocak-notion` dökümü ister).
2. Ekran metni, caption, ilk yorum ve story'yi `ocak-lint` kurallarından geçirir.
3. Görsel hazır mı bakar: hazır kart yolu, yoksa Midjourney istemi ya da `ocak-kart` komutu.
4. Kopyalanır yayın paketi verir: caption (düz metin), ilk yorum, story sırası, saat, "yapılmazsa" kuralı.
5. O günün yorum beklentisini ve hazır cevapları ekler.

**DUR:** etkinlik tarihi takvimle uyuşmuyorsa; metinde yasak dize varsa; görsel yoksa ve alternatif tanımlı değilse.

### `ocak-kart`

**Ne zaman:** kart basılacakken (gündüz ya da gece).

**Girdi:** metin, zemin adı ya da zemin dosyası, oran.

**Yaptığı:** `scripts/ocak_kart.py` komutunu kurar; kelime sayısını (en çok on dört), vurgu kelimesini, işaret rengini (açık zeminde köz, koyu zeminde krem) ve alt bandı denetler; 4:5 ve 9:16 sürümlerini birlikte ister; çıktıyı gözle kontrol ettirir.

**DUR:** metin on dört kelimeyi aşıyorsa; beyaz zemin isteniyorsa; yapay zekâ ile üretilmiş insan görseli zemin olarak verilmişse.

### `ocak-yorum`

**Ne zaman:** yorum ya da özel mesaj cevaplanırken.

**Girdi:** yapıştırılan yorum ya da mesaj; hangi gönderinin altında olduğu.

**Yaptığı:** `yorum-ve-topluluk.md` kurallarıyla üç kısa cevap seçeneği; gerekiyorsa "özelden devam", "gizle", "Advaita'ya ilet" önerisi. Advaita'nın ağzından cevap yazmaz.

**DUR:** mesajda kriz işareti varsa (cevap yazmaz; Advaita'ya ve uzman yönlendirmesine bırakır).

### `ocak-kadin` (fikir)

**Ne zaman:** Bir Kadın Vardı serisine yeni bir isim eklenirken.

**Yaptığı:** iki bağımsız kaynak arar; ayrışan ayrıntıları listeler; fotoğraf hakkı için beş soruyu cevaplar; altı kartlık taslak ve nesne için D5 istemini verir.

**DUR:** ikinci kaynak yoksa; kadın yaşıyorsa; güncel bir tartışmanın tarafıysa.

## İş → skill zinciri

| İş | Zincir |
|---|---|
| Söz kartı | `ocak-metin` → `ocak-lint` → `ocak-kart` → `ocak-gonderi` |
| Bir Kadın Vardı | `ocak-kadin` → `ocak-lint` → `ocak-kart` → `ocak-gonderi` |
| Açık Kapı daveti | `ocak-notion` (takvim) → `ocak-etkinlik` → `ocak-metin` → `ocak-lint` → `ocak-kart` → `ocak-gonderi` |
| Reels | Advaita'nın brief'i → CapCut → `ocak-lint` (caption) → `ocak-gonderi` |
| Mail | `ocak-metin` → `ocak-lint` → MailerLite ya da Resend taslağı |
| Yorum, mesaj | `ocak-yorum` |
| Haftalık okuma | `ocak-notion` (kayıtlar) + Ads Manager ekran görüntüsü → bu sohbet |
| Karar | `ocak-kararci` → CC |

## Skill dışında süreci taşıyan dört şey

1. **Dosya adı = kimlik.** `AAGG-Hat-ad` (`1015-O-soz-dayanmak`). Aynı ad kartta, reklamda (`utm_content`) ve ölçüm tablosunda kullanılır; bir gönderinin kaydı tek kelimeyle bulunur.
2. **Her dosyada aynı on iki bölüm.** Hat, amaç, tarih, kanal, ışık, durum, yapılmazsa, görsel (istemiyle), ekran metni, caption, story, üretim. Eksik bölüm "Yok." yazar; boş bırakılmaz.
3. **Hazır kart klasörü.** Her sabah için basılı bir yedek. Takvim hiçbir gün çekime ya da Midjourney'e rehin kalmaz.
4. **Haftalık tek tablo.** Gönderi adı, ışık, görüntülenme, kaydetme, gönderme, yorum, profil ziyareti, kayıt. Dört hafta sonra gece, gündüz ve insan kartları sayıyla karşılaştırılır.
