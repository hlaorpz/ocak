# ocak-mcp — doküman korpusu MCP sunucusu

OCAK'ın doküman korpusunu (`docs/**` · `CLAUDE.md` · `scripts/**`) uzak bir MCP
sunucusu olarak servis eder. Claude.ai tarafında **custom connector** olarak bağlanır.

ADIM 7 **birinci dalga**. `docs_karar(no)` bilinçli olarak yoktur — gerekçe aşağıda.

## Araçlar

| araç | ne yapar |
|---|---|
| `docs_envanter()` | korpusun tamamını listeler: `yol` · `satir` · `bayt` · `karakter` · `sinif` |
| `docs_oku(yol, satir_baslangic?, satir_bitis?)` | dosya içeriği + ölçümü |
| `docs_ara(sorgu, kapsam?, regex?)` | satır bazlı arama |

Üç cevabın hepsi iki ortak alan taşır:

- **`commit`** — sunucunun okuduğu ağacın commit'i. Damgasız cevap bayatlığını gizler
  (KARAR 471 · KARAR 474).
- **`korpus`** — tek satırlık özet: toplam dosya sayısı + `docs_envanter()` hatırlatması.
  Bir tool'un çağrılması *hatırlanmak zorunda* kalırsa, hatırlanmadığı tur kör geçer;
  bu satır körlüğü yapısal olarak imkânsız kılar.

## Kapsam

| dahil | sınıf |
|---|---|
| `docs/**` (`_uretilen/` dahil) | `canli` |
| `docs/_arsiv/**` | **`arsiv`** |
| `CLAUDE.md` | `canli` |
| `scripts/**` | `canli` |

**Hariç:** `src/` · `dist/` · `node_modules/` · `.git/` · `.env*` · `.claude/` ·
nokta ile başlayan her dosya.

`src/` ve `dist/` bilinçli dışarıda: orası `ocak-teshis`'in alanı. KARAR 102/355
teşhisi ham kanıttan ister; araya dolayım katmanı sokulmaz.

**Varsayılan arama yalnız `canli`.** Arşiv açıkça istenir (`kapsam='arsiv'|'hepsi'`).
`_arsiv` etiketi süs değil: B44 tam olarak bu hatadan doğdu — `ocak-lint`'in ilk
taraması dağıtılmış (bayat) dosyada koştu, bulguları taşınamadı, satır numaraları
tutmadı. Arşiv sonucu canlı sanılırsa o hata otomatikleşir.

**Yol güvenliği:** her istek gerçek yola çözülür ve izinli köklerin altında olduğu
doğrulanır. Mutlak yol, `..` içeren yol, nokta ile başlayan bileşen ve sembolik bağ
üzerinden dışarı çıkan istek reddedilir.

## Tasarım ilkeleri

**(a) Dosya kümesi diskten sayılır.** Kodda dosya listesi yoktur — yalnız izinli
*kök dizin* listesi (`korpus.mjs` → `IZINLI_KOKLER`). Bu projede yazılı her liste
bayatladı: geçiş planı beş `20-ref` sayıyordu, yedi vardı; dört `baglam.sh` profili
sayıyordu, beş vardı.

**(b) Her cevap okunduğu commit'i taşır.** Öncelik `RAILWAY_GIT_COMMIT_SHA`, sonra
`.git/HEAD` (kabuğa çıkmadan okunur). İkisi de yoksa cevap `BELİRLENEMEDİ` der —
sessiz kalmaz.

**(c) Ölçüm sunucuda yapılır.** `grep` · `awk` · `cut` çağrılmaz. Eşleştirme ve sayım
dilin kendi Unicode-doğru API'siyle yapılır. Gerekçe B46: `awk length` bayt sayar
(`çığır` → bu makinede 9, doğrusu 5) · `cut -c` kayıt gizler · `grep -o` desen
tutmazsa boş dize döner · `grep` `-F` olmadan `$`'ı desen sayar. **Ortak payda: araç
hata vermez, yanlış rakam verir.**

Karakter = Unicode kod noktası. Satır sayımı `docs/`'un kanonik formülüyle denk:
`"\n" sayısı + (metin boş değilse ve "\n" ile bitmiyorsa 1)`.

**(d) Eksik hiçbir zaman sessiz olmaz.** Kırpılan sonuç `kirpildi: true` der ve
kaç eşleşmenin dışarıda kaldığını yazar. `docs_ara` **iki sayıyı ayrı ayrı** taşır:
`toplam_eslesme` ve `donen_eslesme` — "0 döndü" ile "kırpıldı" bir daha karışmasın.
Bulunamayan dosya `bulunamadi` der ve **benzer ad önermez** (uydurma yol üretmez).
UTF-8 çözülemeyen dosyalar envanterde `atlanan_ikili` olarak sayılır ve listelenir.

## Eşikler

| eşik | değer | gerekçe |
|---|---|---|
| aralıksız okumada gövde | 500 satır | aşılırsa gövde yerine **başlık indeksi** (`^#{1,3} `) döner; `90-kronoloji/2026-05.md` 5316 satır, kazara tam okuma bağlamı yakar |
| aralıklı okumada azami açıklık | 2000 satır | aşılırsa `kirpildi: true` |
| `docs_ara` azami sonuç | 200 satır | aşılırsa `kirpildi: true` + kaçının dışarıda kaldığı |

## Çalıştırma

```bash
cd mcp
npm install
OCAK_MCP_TOKEN=... npm start      # PORT verilmezse 3000
```

Uçlar: `POST|GET /mcp` (MCP) · `GET /saglik` (healthcheck, tokensiz, korpus bilgisi
sızdırmaz).

Transport **Streamable HTTP** (MCP 2026-07-28). Eski SSE-only transport deprecated.
Sunucu stateless çalışır — sticky session gerekmez.

## Kimlik doğrulama

`Authorization: Bearer <token>` **her zaman zorunlu.** Authless mod koda hiç girmedi:
`OCAK_MCP_TOKEN` tanımlı değilse sunucu ayağa kalkmaz, korumasız açılmaz.

Token **Railway → Variables**'ta yaşar: `[TOKEN — Railway Variables, dokümanda tutulmaz]`
(KARAR 469). Bu depoda hiçbir dosyada canlı token yoktur.

Claude.ai tarafında token **Request headers** bölümüne girilir; değer şemasıyla
birlikte yazılır — `Bearer <token>`, çıplak token değil. ⚠ Request headers özelliği
Anthropic tarafında **beta** ve yavaş yayılıyor; hesapta görünmüyorsa bağlantı
ertelenir — sunucu korumasız açılmaz.

## Railway yapılandırması

Servis `ocak-mcp`, proje `ocak`, repo `hlaorpz/ocak-site`.

| ayar | değer | gerekçe |
|---|---|---|
| **Root Directory** | **BOŞ** (`/`) | ⚠ `mcp/` yazılırsa container'a yalnız `mcp/` iner ve **`docs/` hiç gelmez** — sunucunun okuyacağı şey tam olarak `docs/` |
| **Custom Build Command** | `npm --prefix mcp install` | kökteki Astro `package.json`'ı build etmesin |
| **Start Command** | `npm --prefix mcp start` | |
| **Watch Paths** | `/docs/**` · `/mcp/**` · `/CLAUDE.md` · `/scripts/**` | `src/` push'ları MCP'yi boşuna deploy etmesin. ⚠ Desenler **her zaman `/` kökünden** işler |
| **Auto deploys** | `mcp/` inince **yeniden aç** | şu an bilinçli kapalı |
| **Port** | `process.env.PORT`'a bağlanır | Railway portu otomatik algılar |
| **Healthcheck Path** | `/saglik` | |
| **Variables** | `OCAK_MCP_TOKEN` | dokümanda yalnız yer tutucu |

⚠ Root Directory `mcp/` olarak ayarlanırsa sunucu ayağa kalkar ama korpus **boş**
görünür. Sessiz fakirleşme: `docs_envanter()` sıfır dosya döner ve hata vermez.

## Yedek yol

MCP kapalıyken bağlam `./scripts/baglam.sh dokuman` ile üretilir. Bu yol
kaldırılmadı ve kaldırılmayacak — B51 onu **küçültüp** soğuk-başlangıç kanalına
dönüştürecek, kapatmayacak.

## `docs_karar(no)` neden yok

İkinci dalga. İki gerekçe:

**(a) İkiz sözleşme henüz sınanmadı.** `docs_karar` KARAR 472'nin çapa çözümleme
sözleşmesini uygular; aynı sözleşmeyi `ocak-kararci` de uyguluyor. ADIM 5 ve ADIM 6'nın
deseni şu: her skill kusurunu ilk gerçek kullanımda gösterdi (`ocak-arsivci` DUR-7 ·
`ocak-lint` B44-a). Kararcının kusuru çapa tarafındaysa `docs_karar` onu miras alır.

**(b) Çapa dört biçim, sığlık ölçülü.** B36-a ölçümü mekanik çapaların **%28,5'inin
sığ** olduğunu, sığ olanların **%60'ının kronolojide kaydının hiç yazılmadığını**
gösterdi. Bugün o sığlık kimseyi yanıltmıyor çünkü çapa takibi zahmetli. `docs_karar`
bunu tek çağrıya indirir ve dönen şey **cevap gibi görünür** — KARAR 456: *yanlış bir
satır otoriter görünür ve kimse arkasına bakmaz.*

İkinci dalga şunları zorunlu kılacak: `capa_cinsi` alanı
(`elle`|`mekanik`|`cozulemedi`) · mekanik isabette ölçülmüş sığlık uyarısı · çıplak
dosya adında **uydurmama** · sınıflandırma sırasının cevapta beyanı.

## Envanter neden tool, resource değil

Claude.ai custom connector'ları resource **sunar**, ama resource'lar sohbete
kullanıcı tarafından **elle iliştirilir** — Claude onları kendiliğinden okumaz.
Tool'u ise Claude kendi kararıyla çağırır.

Envanteri resource'a taşımak B48'i çözmez, **insana devreder** — KARAR 478'in
gerekçesindeki hatanın kendisi. Envanter tool'dur ve tek yüzeydir; ikinci yüzey
açılmadı.
