---
name: ocak-gonderi
description: "OCAK sosyal medya gönderisini yayına hazırlar: gönderi dosyasını okur, tarihi ve metni denetler, görselin durumuna bakar, kopyalanır yayın paketi verir. Bir gönderi paylaşılmadan önce ya da \"yarının işleri\" sorulduğunda açılır."
---

# ocak-gonderi

Bir gönderi dosyasını yayın paketine çevirir. **Yayınlamaz, Notion'a ve korpusa yazmaz.** Paylaşan Kaan ya da Advaita'dır.

## Girdi

- Gönderi dosyasının adı (`1013-O-soz-dayanmak`) ya da "yarının işleri" / bir tarih.
- Dosyalar `docs/pazarlama/icerik/` altındadır (korpusa girmediyse Kaan'ın verdiği pazarlama paketinde). Gün gün sıra `TAKVIM.md` dosyasındadır.

Dosya adı kalıbı `AAGG-Hat-ad`: `1013-O-…` = 13 Ekim, Hat O (OCAK genel, sabah 09:30); `-A-` = Açık Kapı daveti (akşam 20:30).

## Adımlar

1. **Oku.** Gönderi dosyasını ve `TAKVIM.md`'de o günün satırını oku. Dosya bulunamıyorsa DUR.
2. **Tarih teyidi.** Gönderi bir etkinlik tarihi, saati ya da başlığı taşıyorsa güncel takvimle karşılaştır (`ocak-notion` dökümü ya da Kaan'ın verdiği takvim). Ölçmediysen "teyit etmedim" de; hatırladığını ölçüm gibi sunma. Yurt dışı saat kartlarında yaz/kış saati geçişini yeniden hesapla.
3. **Metin denetimi.** Ekran metni, caption, ilk yorum ve story metinlerini `ocak-lint` kurallarından geçir. Ayrıca şunlara bak:
   - Emoji yok. "Son yerler", "kaçırma", geri sayım yok. Sıklık sözü ("her hafta", "ayda bir") yok.
   - Okuyucuya yaşamadığı bir geçmiş atfedilmiyor (KARAR 441).
   - Sağlık vaadi yok ("iyi gelir", "azaltır").
   - @ocak.biz "biz" sesi; Advaita'nın ağzından cümle yazılmamış.
   - Açık Kapı için "kayıt izlenir" türü söz yok (kaydedilmez, KARAR 626).
   - Ekran metni en çok on dört on altı kelime.
4. **Görsel.** Dosyanın "Durum" ve "Görsel" bölümüne bak:
   - Kart basılıysa dosya yolunu ver.
   - Basılı değilse `ocak-kart` komutunu ya da dosyadaki Midjourney istemini ver.
   - Çekim bekliyorsa "Tercih ve alternatif" bölümünden hangisinin elde olduğunu sor; hiçbiri yoksa dosyadaki "Yapılmazsa" kuralını uygula.
   - Yapay zekâ ile üretilmiş insan, el, yüz görseli kullanılmaz.
5. **Yayın paketi.** Şu sırayla, kopyalanır hâlde ver:
   - Saat ve kanal.
   - Görsel dosyası ya da dosyaları (karuselde sıra).
   - Caption (düz metin, kod bloğunda).
   - İlk yorum.
   - Story sırası (saatleriyle; anket ve kutu metinleri).
   - Diğer kanallar (Facebook, TikTok, Pinterest, WhatsApp Durum) için tek satır.
   - O gönderide beklenen yorum türü ve iki üç hazır cevap (`ocak-yorum` kuralları).
6. **Aksama kuralı.** Gönderi bugün çıkamıyorsa dosyadaki "Yapılmazsa" satırını uygula: tarihe bağlı iş düşer, tarihsiz iş sıraya döner. Telafi için çift paylaşım önerme.

## Özel gün modu

Girdi bir özel günse (29 Ekim, 10 Kasım, 8 Mart…): tek kart, tek cümle; davet, link ve reklam yok; portre, bayrak, atfedilmiş söz yok. 10 Kasım'da o gün başka paylaşım ve reklam olmadığını hatırlat.

## DUR koşulları

1. Etkinlik tarihi, saati ya da başlığı takvimle uyuşmuyor.
2. Metinde yasak dize var ve düzeltmesi anlamı değiştiriyor (ESKİ→YENİ öner, kararı Kaan'a bırak).
3. Görsel yok ve dosyada alternatif tanımlı değil.
4. Dosyada "olgu teyidi" notu açık duruyor (Bir Kadın Vardı kartları): teyit edilmeden paket verilmez.
5. Advaita'nın ağzından yazılmış hazır cümle isteniyor: iskelet ve soru ver, cümle yazma.