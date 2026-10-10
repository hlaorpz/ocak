# CC BRIEF 3 · 9 Ekim pazarlama kararlarının ledger'a yazılması

**Tarih:** 9 Ekim 2026 · **Yazan:** Claude.ai · **Uygulayan:** CC (`ocak-kararci`) · **Tür:** yalnız doküman

Kaan'ın 9 Ekim kuralı: "Yorum yapmadığım her madde onaydır; Advaita'nın onayı gereken maddeler onaylı sayılır." Aşağıdaki kararlar bu kuralla ve Kaan'ın aynı günkü açık cümleleriyle alındı. Karar numarası burada **yazılmaz**; ADIM 0'da ledger'ın son satırı okunur (bu oturumdaki ölçüm: son KARAR 626, commit `9c3576c`) ve numaralar sırayla verilir.

## ADIM 0

```bash
cd ~/Desktop/hlaorpz/ocak
git status --short                         # kirliyse DUR
tail -3 docs/01-kararlar.tsv               # son numara; sütun düzeni
grep -n "Highlight\|highlight" docs/30-sosyal.md | head
grep -n "sticker\|Sticker\|anket" docs/30-sosyal.md | head
grep -n "günde\|haftada" docs/30-sosyal.md | head -20
```

Raporla: son KARAR numarası; `30-sosyal.md`'de highlight, story çıkartması ve paylaşım sıklığı kurallarının bugünkü satırları (aşağıdaki kararların hangi satırı değiştirdiğini görmek için).

## Kararlar

Her biri `01-kararlar.tsv`'ye tek satır; sütunlar ledger'ın düzenine göre. Tarih 2026-10-09, durum AKTIF. "Kanıt" sütununa: `docs/pazarlama/<dosya>` ve "Kaan, 9 Ekim sohbeti".

| # | Karar (başlık) | Özü | Dokunduğu yer |
|---|---|---|---|
| a | Gündüz paleti | Gece paletinin yanına gündüz paleti: Krem zemin, Keten `#D9CBB6`, Toprak `#B4654A`, Zeytin `#6E7453`; metin Kömür. İmza koyu zemin değil, tek ışık kaynağı. Izgara ritmi gece · gündüz · insan. 10 Ekim'de başlar | `10-marka.md` Görsel Kimlik (ekleme), `30-sosyal.md` Bölüm 5, `31-zemin.md` |
| b | Tek takvim, iki hat | Hat O (OCAK genel, sabah) ve Hat A (Açık Kapı daveti, akşam). 19 Ekim'e kadar günde iki gönderi; sonrası günde bir. Çekirdek ve Ek katman; tarihe bağlı iş yapılamazsa düşer, tarihsiz iş sıraya döner | `30-sosyal.md` takvim bölümü |
| c | Story araçları | Anket, soru kutusu ve link çıkartması kalıcı olarak serbest. Geri sayım çıkartması, çekiliş, emoji kaydırıcı kullanılmaz | `30-sosyal.md` Bölüm 5 (F4) |
| d | Highlight | Dört highlight açılır: Açık Kapı, Çember, Advaita, Sorular | `30-sosyal.md` 2b |
| e | Yeni içerik sütunları | Bir Kadın Vardı (gerçek kadınlar, tek özellik), Külün Altından (bu dilin sözleri), OCAK söz kartları, Sabah Ocağı pratikleri | `30-sosyal.md` sütunlar |
| f | Fotoğraf hakkı | Bir Kadın Vardı'da fotoğraf hakkına bakılır; beş soru "evet" ise fotoğraflı, değilse fotoğrafsız yayınlanır. Yapay zekâ portresi yok | `docs/pazarlama/icerik/havuz/bir-kadin-vardi-seri.md` |
| g | Çember ve reklam | Çember reklamla da duyurulur; önce geri dönüş kitlesi, sonra soğuk kitle denemesi. Kontenjan yalnız bilgi cümlesidir | `docs/pazarlama/ACIK-KAPI-19-EKIM/reklam-detay.md` |
| h | Özel günler | Milli günlerde, kadınla ve Türkiye'yle ilgili günlerde tek kart, tek cümle; davet, link ve reklam yok. 10 Kasım'da başka paylaşım ve reklam yok | `docs/pazarlama/STRATEJI/ozel-gunler.md` |
| i | Yorum düzeni | @ocak.biz kendi gönderilerinde her yorumu beğenir ve "biz" sesiyle cevaplar; Advaita kendi hesabından kendi adıyla ayrıca yazar; @ocak.biz Advaita'nın ağzından yazmaz | `docs/pazarlama/STRATEJI/yorum-ve-topluluk.md` |
| j | Advaita'nın görünürlüğü | Yüzlü işler yapılır; her yüzlü işin yanında aynı işin alternatifi tanımlıdır. Tercih ve alternatif birlikte yazılır | `30-sosyal.md` Bölüm 14 |
| k | Yanına bir kadın al | 19 Ekim'e kayıtlı kadın bir kadını ücretsiz getirir; kod elle | Fiyat kararlarına not |
| l | 19 Ekim kapanış teklifi | Sıradaki kapı 28 Ekim çemberi | |
| m | TikTok | Altı haftalık deney; 22 Kasım'da üç ölçütle karar | `docs/pazarlama/STRATEJI/tiktok.md` |

**Karar adayı, mühürlenmez (yalnız kronolojiye not):** sitenin gündüz teması (`STRATEJI/site-uyarlama.md`); "İlk Eşik" ve "Kızınla Gel" kapıları; ayda bir ücretsiz ilk akşam.

## `30-sosyal.md`

Bu brief `30-sosyal.md`'nin gövdesini yeniden yazmaz (B221, 20 Ekim retrosundan sonra). Yalnız: c, d ve j kararlarının değiştirdiği satırların **yanına** "KARAR <no> ile değişti (9 Eki)" işareti konur. İçerik silinmez (KARAR 61, 88).

## `00-durum.md` ve `02-borclar.md`

- `00-durum.md`: pazarlama satırına tek güncelleme: paket yolu, plan belgesinin adı, 19 Ekim hedefi. 200 satır sınırı korunur.
- Yeni borç açılır: "Bir Kadın Vardı: Halet Çambel ve Mualla Eyüboğlu kartlarında ikinci kaynak teyidi yarım" (kanıt: `docs/pazarlama/icerik/1024-O-halet-cambel.md`, `1031-O-mualla-eyuboglu.md`). Numara ADIM 0'dan.
- Yeni borç: "Atasözü okumaları TDK sözlüğünden kontrol edilmedi" (kanıt: `icerik/havuz/kulun-altindan-seri.md`).

## Kapanış

```bash
node scripts/durum-uret.mjs
node scripts/baslik-denetim.mjs
git add docs && git commit -m "docs(karar): 9 Ekim pazarlama kararları"
```

Kronolojiye: karar numaraları, açılan borç numaraları, HEAD.

## DUR koşulları

1. Son KARAR numarası 626 değil ve aradaki kararlar bu listeyle çelişiyor.
2. Ledger sütun düzeni bu tabloyu taşımıyor.
3. Bir karar `10-marka.md` KORUNACAK İFADELER'e dokunuyor (dokunmamalı; a kararı Görsel Kimlik'e ekleme yapar, ifade değiştirmez).
4. `30-sosyal.md`'de değişen satır bulunamıyor.
