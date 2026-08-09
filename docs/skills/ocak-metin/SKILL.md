---
name: ocak-metin
description: OCAK marka sesiyle kamu metni taslağı üretir — Notion sayfa gövdesi, caption, bülten, kanal mesajı. Yeni sayfa yazılırken, mevcut sayfaya nokta patch gerektiğinde ya da sosyal içerik hazırlanırken açılır. Yalnız taslak üretir; Notion'a yazmaz. Claude.ai yüzeyinde çalışır.
---

# ocak-metin

Taslak üretir. **Notion'a yazmaz, dosyaya yazmaz, yayınlamaz.**

## Otorite (KARAR 459)

Çıktı **taslaktır.** Notion'a giriş Advaita/Kaan tarafından **elle** yapılır.
İçerik otoritesi Advaita'da, ton otoritesi Kaan'da. **Marka sesinin sulanması,
geri döndürmesi en pahalı hasardır** ve sessiz ilerler. En az ilk üç ay böyle.

## Sınır — metin / lint (KARAR 476)

| | `ocak-metin` | `ocak-lint` |
|---|---|---|
| Rolü | üretim | denetim |
| Taşıdığı | ses zemini + üretim yöntemi | yasak dizeler + yargı listesi |
| Çıktısı | taslak | eşleşme raporu / ESKİ→YENİ |

**Yasak kalıplar burada tekrar edilmez** — `docs/skills/ocak-lint/` tek evleridir.
Bir kural iki dosyada tarif edilirse ayrışır ve hangisinin güncel olduğu ancak
çelişki çıkınca anlaşılır.

**Zorunlu bağ:** üretilen taslak `ocak-lint`'ten geçirilmeden sunulmaz. Lint kapıdır.

## Ön koşul — taze dump (KARAR 439)

**Tam yenilemede dump opsiyonel, nokta patch'te ŞART.**

Dump'ın iki işlevi var ve yalnız biri telafi edilebilir: (a) eski metni birebir vermek —
Kaan yeri elle bulup telafi edebilir; (b) **güncel yapıya göre yazmayı sağlamak** —
telafi edilemez. Dump'sız yazılan metin kalkmış bir section'a patch önerir, taşınmış bir
cümleye ekleme yapar, zaten değişmiş bir ifadeyi yeniden üretir.

Dump yoksa: **DUR ve iste.** Üretimi `ocak-notion` yapar.

## Ses zemini

**"Biz" sesi varsayılan** (KARAR 55) — kollektif, sıcak, davet eden. Site OCAK'ın sesidir,
Advaita'nın değil; onun birinci tekil Instagram sesi referanstır, şablon değil.

**Yıl 1'de site yalnız Türkçe** (KARAR 39). İngilizce alt sayfa ya da dil seçeneği yok.

**KORUNACAK İFADELER — `10-marka.md` "KORUNACAK İFADELER" bölümündeki on madde birebir
korunur.** İyileştirme, kısaltma, modernize etme önerisi getirilmez. Sunum mekaniği
değişebilir, ifade değişmez. Bunların bir taslakta geçmesi gerekiyorsa **kaynaktan
kopyalanır**, hatırlanarak yazılmaz.

**Marka çekirdeğine yeni cümle eklenmez.** Ana metin, AL · OL · VER, Eşik Kadını tarifi
ve üç imza cümlesi marka katmanıdır; oraya ekleme Kaan/Advaita kararıdır, taslak işi değil.

## Üretim yöntemi

**Pattern bekçileri — önce oku, sonra yaz.** Yeni sayfa yazımında `/cember` ve
`/mini-retreat` markdown'ları referanstır; kişi/portre sayfalarında ayrıca `/hikaye`.
Hook cümlesi, sayım yazıyla (on iki, on altı), Sıradaki Kapı kart formatı, konuşma dilinde
SSS — hepsi buralarda yaşar. Yeni bir desen icat etmeden önce mevcut bekçiye bakılır.

**Rol/portre kalıbı (KARAR 399):** alan (kısa isim listesi) + o alanın **çemberdeki anı**
(somut sahne) + **kadının tarifi** (kız kardeş dili). Sertifika ve marka adları,
"altyapısı / aşina / uzmanı" kalıpları düşer — **bilgi kalır, unvan gider.**

**Section etiketleri sözleşmedir.** Gövde `## section: ad` ile bölünür; biçim ve kanonik
adlar `docs/sayfa-yazim-rehberi.md`'de. Yeni bir marker adı **icat edilmez** — adın hangi
kapıya düştüğü teyit edilmeden yazılırsa component sessizce render dışı kalır (KARAR 409).
Notion'da `*` ve `_` karakteri elle yazılmaz; vurgu Cmd+B / Cmd+I ile gelir.

**Teslim biçimi — "elektrik kesildi" standardı (KARAR 449):** uygulama dosyalarında her
alan kelimesi kelimesine doldurulur ya da `[KAAN]` işaretlenip dosya sonunda tek listede
toplanır. **Boşluk = belirsizlik yasaktır.** Ölçüt: *"Kaan'a erişimi olmayan biri yalnız
telefonla yönetebilsin."* İşaretli alan dolmadan o kart yayınlanmaz.

**Placeholder ara-değiştir kanonu (KARAR 450):** henüz var olmayan bir varlığa bağlı çok
sayıda yerde değer elle tekrarlanmaz; literal placeholder (`KURUCU-URL`) yazılır, varlık
gelince tek ara-değiştir hepsini doldurur.

**Nokta patch biçimi:** ESKİ→YENİ değişiklik listesi **+** tam gövde. Düşen linkler tam
URL ile geri konur. Kaan'ın Notion'a elle geçireceği bir metin, kesme-yapıştırmaya hazır
olmalıdır.

## Kapsam dışı çelişki

Brief kapsamı ≠ çelişki kapsamı. Kapsam dışında bulunan bir çelişki **uygulanmaz ama
görmezden de gelinmez** — ESKİ→YENİ patch'i hazırlanır ve opsiyonel sunulur; karar
brief sahibinindir.

## DUR koşulları

1. Nokta patch isteniyor ama taze dump yok
2. `10-marka.md` KORUNACAK İFADELER'den birinin değiştirilmesi isteniyor
3. Notion'a yazım ya da yayın isteniyor (KARAR 459 — elle giriş, istisnasız)
4. Marka çekirdeğine yeni cümle eklenmesi isteniyor
5. Yeni bir section marker adı gerekiyor ve hangi kapıya düştüğü teyitli değil
