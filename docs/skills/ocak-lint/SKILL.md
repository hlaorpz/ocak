---
name: ocak-lint
description: OCAK marka dili denetimi. Kamuya çıkacak metin üretildiğinde (Notion sayfa gövdesi, caption, story, bülten, kanal mesajı) yayınlanmadan önce, ya da mevcut site metninde dil kalıntısı aranırken açılır. İki yüzeyde çalışır: dosyada grep, üretilen metinde yargı.
---

# ocak-lint

## KAPSAM — önce bu

Lint **yalnız kamuya çıkan üretilmiş metni** denetler: Notion sayfa gövdesi, caption,
story, bülten, WhatsApp kanal mesajı, site kopyası.

**Kapsam dışı:** iç dokümanlar (`10-marka.md`, `20-ref-*`, ledger, borçlar, brief,
kronoloji), kod yorumları, commit mesajları.

Bu ayrım şart, çünkü iç dokümanlar yasak kalıpları **bilerek** taşır. Örnek:
`10-marka.md:107` OCAK WAY ilkesi olarak "OCAK bilgi vermez" yazar; KARAR 442 o kalıbı
site metninde yasaklar. Çelişki değil — marka dosyası v1.4 notu doktrinin marka
çekirdeğine girmediğini açıkça söyler. Kapsamsız bir lint bunu ihlal sanar.

## İKİ YÜZEY

| | CC yüzeyi | Claude.ai yüzeyi |
|---|---|---|
| Girdi | dosya (dump, markdown) | henüz yayınlanmamış üretilen metin |
| Yöntem | `yasak-dizeler.tsv` üzerinden grep | aşağıdaki yargı listesi |
| Çıktı | eşleşme raporu, satır numaralı | düzeltme önerisi, ESKİ→YENİ |

### CC yüzeyi

```bash
cd ~/Desktop/hlaorpz/ocak
while IFS=$'\t' read -r dize tip kapsam karar ek_istisna oneri; do
  [ "$dize" = "dize" ] && continue
  n=$(grep -c -i -- "$dize" "$HEDEF" 2>/dev/null || true)
  [ "$n" -gt 0 ] && printf '%s\t%s\t%s\t%s\n' "$n" "$dize" "$karar" "$oneri"
done < docs/skills/ocak-lint/yasak-dizeler.tsv
```

Eşleşme **ihlal değil, incelenecek adaydır.** Genel muafiyet ve `ek_istisna` sütunu
okunmadan rapor yazılmaz.

### TARİHSEL KAYIT MUAFİYETİ — her satır için geçerli (KARAR 465)

**Bir dize, kendi yasağını ya da kendi değişimini anlatan metinde geçtiğinde korunur.**
Bu muafiyet tablodaki her satıra uygulanır; `ek_istisna` sütunu **buna ek** olan,
satıra özgü muafiyetleri taşır. Sütunun `yok` demesi genel muafiyetin kalktığı anlamına
gelmez.

Tarihsel kayıt sayılan yüzeyler:

- sürüm notu ve değişiklik kaydı (`10-marka.md:3` gibi)
- karar başlığı ve gövdesi — `01-kararlar.tsv`, `90-kronoloji/*`
- sapma kaydı, borç maddesinin sorun tanımı, brief'in ölçüm bölümü
- commit mesajı
- yasağı tanımlayan cümlenin kendisi (`10-marka.md:223` "funnel terimleri OCAK iç
  sistemine girmez" — cümle terimi barındırmak zorundadır)

**Kapanış kriteri hiçbir satır için `grep -c` sıfır değildir.** Kriter, eşleşmelerin
**canlı referans** / **tarihsel kayıt** diye sınıflandırılmış olmasıdır. Rename ve
yeniden-ifade kararlarında tarihsel kayıtlar sayımda kalır ve kalmalıdır — silinirlerse
kayıt yalan söyler.

### `kapsam` sütunu sözlüğü

| değer | ne denetlenir |
|---|---|
| `kamu metni` | Notion gövdesi, caption, bülten, kanal, site kopyası |
| `canlı referans` | yukarısı **+** iç dokümanlardaki **işaret eden** ifadeler (adres, handle, ürün adı) — anlatan ifadeler değil |
| `kod` | `src/`, `scripts/`, CSS |
| `site sayfası` | yalnız yayınlanan sayfa gövdesi |

`her yerde` değeri **kullanılmaz.** Kaldırıldı: altı satırda kendi tanımını yakalıyordu.

⚠ Taze dump şartı (KARAR 439): nokta patch'te dump **zorunludur**. Dump'sız denetim
sayfanın eski hâline bakar — kalkmış bir section'a patch önerir, taşınmış cümleye
ekleme yapar.

### Claude.ai yüzeyi — yargı listesi

Grep'lenemeyen, okunarak denetlenen kurallar:

**Tekrar disiplini (KARAR 403).** Her fikir **tek evde** gövdeleşir; diğer yerlerde tek
cümle + köprü linki. Zamanlama taahhütleri özellikle tek eve çekilir — tarih kayarsa
dört yerde eskimesin.

**İmza eksenleri (KARAR 404).** Üç imza cümlesi farklı eksenlerde çalışır ve üçü de
yaşar: home manifestosu = *değişim reddi*, footer imzası = *bağımlılık reddi*,
`/felsefe` varyantı = *götürme reddi*. **Eksen başına tek ev.** "Geldi gibi" hissinin
kaynağı aynı eksenin ikinci kopyasıdır.

**Portre dili (KARAR 441/402).** Okuyucuya yaşamadığı geçmiş atfedilmez. Güvenli kipler:
şimdiki hâl tarifi, üçüncü tekil portre, davet geleceği. Okuyucuya dönüş yalnız koşullu
"Sonraki adım" satırında.

**Vurgu yerleştirme (KARAR 400).** Vurgu bloğu için yeni cümle **yazılmaz** — gövdedeki
zirve cümle bulunur, yükseltilir, kaynağından silinir (kopya bırakılmaz). Vurgu tanım
bölümünü mühürler, katalog/kararı açar; vurgudan sonra açıklama paragrafı gelmez.

**Vurgu tipi (KARAR 401).** ALTIN = yüksek enerji ilan. KREM `ic-ses` = akış ortası
nefes. Üçleme yapıları ve imza-varyantı cümleler `ic-ses` alır.

**Liste vs karşılaştırma (KARAR 446).** Bullet yalnız kısa tek-satır serilerde. Gövdesi
olan yapı → bold-açılışlı paragraf. **İki öğeli karşılaştırma asla bullet değil.**

**İnkâr-eden-kelime paradoksu (KARAR 448).** İnkâr eden kelime kavramı odaya sokar —
kelimeyi tamamen çıkar. "sınav havasında değil" → sil. Reddeden değil yol tarif eden dil.
*İstisna:* üçlü karşıtlık pozitife çözülüyorsa ("test değil… Bir ayna.") bu bir tanımdır.

**İddia yumuşatma > içerik budama (KARAR 300).** Dürüstlük sorununda çözüm içeriği
silmek değil mutlak iddiayı yumuşatmaktır.

**Nesneleştirme yasağı (KARAR 448).** "kadın X yapsın diye" → sen'li / işlev tarifli.

**Şemsiye sayfa denetimi.** Şemsiye sayfa ürün sayfasına dönüşürken kavram katmanındaki
her somut gerçek (sayı, süre, prosedür, mekân) "bu iki üründe de doğru mu?" testinden
geçer.

**İçerik-sunum sınırı (KARAR 354).** Notion rich text doğal geçer, CSS ezmez. Vurgu ve
renk facilitator'ün Notion kontrolündedir. İçerik tutarsızlığı CSS ile bastırılmaz.

**Elektrik-kesildi standardı (KARAR 449).** Uygulama dosyalarında her alan kelimesi
kelimesine doldurulur ya da `[KAAN]` işaretlenip dosya sonunda tek listede toplanır.
**Boşluk = belirsizlik yasaktır.**

## KORUNACAK İFADELER — değiştirilemez

`10-marka.md` "KORUNACAK İFADELER" bölümündeki on madde birebir korunur. Metni
iyileştirme, kısaltma, modernize etme önerisi getirilmez. Sunum mekaniği değişebilir,
ifade değişmez.

## Brief kapsamı ≠ çelişki kapsamı

Kapsam dışında bulunan bir çelişki **uygulanmaz ama görmezden de gelinmez** —
ESKİ→YENİ patch'i hazırlanıp opsiyonel sunulur, karar brief sahibinindir.
