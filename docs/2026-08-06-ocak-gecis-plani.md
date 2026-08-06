# OCAK — DOKÜMAN MİMARİSİ GEÇİŞ PLANI

**Tarih:** 6 Ağustos 2026
**Kaynak sohbet:** Doküman altyapısı tasarımı (Cabbar modeli tetikledi)
**Durum:** onaylandı, ADIM 1 başlıyor

---

## NEDEN

Ölçüm (6 Ağustos 2026, project files):

```
ocak-kronoloji.md    895 KB   5641 satır
ocak-referans.md     309 KB   3574 satır
ocak-site-icerik.md  146 KB   4821 satır   ← üretilmiş artefakt
ocak-pilot.md        139 KB    388 satır   ← "canlı durum"
ocak-marka.md         19 KB    236 satır
ocak-kaynak-kanonu.md 19 KB    172 satır
Ocak-Mufredat.md      35 KB    275 satır
─────────────────────────────────────────
toplam              1.56 MB           ≈ 450k token
```

Dört ayrı hastalık:

1. **Granülarite.** `project_knowledge_search` RAG'dır. Pilot'un DURUM bölümü dönem
   başına ~8.000 kelimelik tek blok — oradan gelen chunk yirmi alakasız kararın
   çorbasıdır. Doğru dosya bulunsa bile parça gürültüdür. Claude.ai Pilot'u hiçbir
   sohbette tam okumadı.
2. **Durum prose'a gömülü.** "KARAR 391 ⚠ UYGULANMADI" bir duvarın ortasında yaşıyor.
   Bir kararın geçerliliğini öğrenmek dönemin tamamını okumayı gerektiriyor. 454 karar var.
3. **Tam yeniden üretim.** Her dönem sonu Pilot baştan yazılıyor — her yazımda sessiz
   drift, her yazımda token yakımı.
4. **Sürüm yok.** Diff yok, geri alma yok, "bu ne zaman değişti" yok.

Cabbar modeli 3 ve 4'ü çözer. 1 ve 2 için OCAK'a özel iki ek gerekir: KARAR ledger'ı
ve DURUM tavanı.

---

## SIRA İLKESİ (KARAR 460)

**Doküman kalitesi tesisattan önce gelir.**

Claude.ai'nin sohbetler arası hafızası yoktur; dokümanlar hafızasıdır. Tavan,
dokümanların kalitesidir — taşıma mekanizması değil. Tesisat (repo, agent, script,
MCP) iyi dokümanı *ucuzlatır*, kötü dokümanı *iyileştirmez*.

Bu yüzden ADIM 1-2 tesisatsız, mevcut project files içinde yapılır. Tesisata ancak
kanıt oluştuktan sonra geçilir.

**Düzeltme kaydı:** ilk öneri tersini söylüyordu (repo → agent → içerik). Sıra
satış sırasıydı, doğru sıra değil.

---

## HEDEF YAPI

```
ocak-site/
  CLAUDE.md                    # CC sabit kuralları — kısa, damıtılmış
  docs/
    00-durum.md                # ≤200 SATIR TAVAN. bu dönem + HEAD + kritik uyarılar
    01-kararlar.tsv            # KARAR ledger — makine okunur
    02-borclar.md              # açık item'lar, checkbox + sahip + süre
    10-marka.md                # sabit çekirdek
    20-ref-site.md             # tema referansları — konuya gelince yapıştırılır
    20-ref-notion.md
    20-ref-bot.md
    20-ref-icerik-dili.md
    20-ref-protokoller.md
    90-kronoloji/
      2026-05.md               # aylık dilim, append-only, ASLA yapıştırılmaz
      2026-06.md
      2026-07.md
      2026-08.md
    skills/                    # KANONİK skill kaynağı — tek gerçek
      ocak-arsivci/SKILL.md
      ocak-teshis/SKILL.md
      ocak-lint/SKILL.md
      ocak-kararci/SKILL.md
      ocak-metin/SKILL.md
    _uretilen/
      site-icerik.md           # .gitignore — script üretir, elle taşınmaz
  scripts/
    baglam.sh                  # profil bazlı bağlam paketi → pbcopy
    skill-sync.sh              # docs/skills → .claude/skills + claude.ai zip
```

### `01-kararlar.tsv` formatı

```
no	tarih	baslik	durum	iliski	kaynak
427	2026-07-20	Tek genişlik gerçeği — atmosfer.css:1538 CTA/kart kolonu	KALICI		2026-07.md#k427
433	2026-07-12	Format sayfası kayıt marker zorunluluğu	SUPERSEDE	→423	2026-07.md#k433
391	2026-07-16	takvim hashchange/pageshow eki	ACIK-BORC	→B03	2026-07.md#k391
```

`durum` enum: `AKTIF · KALICI · SUPERSEDE · ONERI · IPTAL · ACIK-BORC · TEYITSIZ`

Kurallar:
- **`kaynak` sütunu zorunlu.** Doğrulanamayan satır yazılmaz.
- **`TEYITSIZ` meşrudur.** Emin olunmayan durum tahmin edilmez, işaretlenir.
  TEYITSIZ satırlar kendi kuyruğunu oluşturur, zamanla erir.
- **tsv indekstir, referansın yerine geçmez.** Gerekçe tek satıra sığmaz; gerekçe
  kronolojide yaşar, tsv oraya işaret eder.
- **Türetilmiş dosyadır.** KIRPMA YASAĞI kronolojiye aittir; tsv yanlışsa yeniden
  üretilir, kaynak veriye dokunulmaz.

454 karar bu formatta ~45 KB. Tamamı her sohbette bağlama sığar.

### `00-durum.md` tavanı (KARAR 457)

200 satır hard cap. Aşarsa en eski dönem bloğu kronolojiye iner. İçerik silinmez,
taşınır — KIRPMA YASAĞI ihlal edilmez.

Bu, "dosyalar büyüyor" sorununu kesen tek kuraldır.

### `baglam.sh` profilleri

```bash
./scripts/baglam.sh kod       # durum + kararlar + CLAUDE.md + ref-site
./scripts/baglam.sh icerik    # durum + marka + ref-icerik-dili + taze notion dump
./scripts/baglam.sh marka     # marka + kararlar(marka filtreli)
./scripts/baglam.sh bot       # durum + ref-bot
```

Çıktının ilk satırı **manifest**:

```
PAKET: kod · İÇERİR: durum, kararlar, CLAUDE.md, ref-site · İÇERMEZ: marka, ref-bot, kronoloji
```

Claude ne göremediğini bilir; eksik bağlamı ister, uydurmaz.

### Skill iki yüzeyde çalışır

| | CC tarafı | Claude.ai tarafı |
|---|---|---|
| Nerede durur | `.claude/skills/` (symlink) | claude.ai Skills, `/mnt/skills/user/` |
| Erişimi | dosya sistemi, git, build | project files + yapıştırılan bağlam |
| Sürümlenir | ✅ git | ❌ elle yüklenir |

Kanonik kaynak tek: `docs/skills/`. `skill-sync.sh` iki hedefe dağıtır,
`--check` ayrışmayı yakalar.

| Skill | Çalışır | Neden |
|---|---|---|
| `ocak-arsivci` | CC | dosya yazar, commit'ler |
| `ocak-teshis` | CC | `dist/`, `git log`, computed CSS |
| `ocak-notion` | CC | dump çeker, marker sözleşmesi doğrular |
| `ocak-lint` | **ikisi** | CC dosyada grep'ler; Claude.ai ürettiği metni yayınlamadan geçirir |
| `ocak-kararci` | **ikisi** | numarayı Claude.ai verir, tsv satırını CC yazar |
| `ocak-metin` | Claude.ai | marka sesi yargı işidir |

### İçerik otoritesi (KARAR 459)

`ocak-metin` **yalnız taslak** üretir. Notion'a giriş **elle**, Advaita/Kaan
tarafından yapılır. Agent Notion'a yazmaz.

Gerekçe: içerik otoritesi Advaita'da, ton otoritesi Kaan'da. Marka sesinin
sulanması, geri döndürmesi en pahalı hasardır. En az ilk üç ay böyle.

---

## FAZLAR

| # | İş | Kim | Nerede | Süre | Bağımlılık |
|---|---|---|---|---|---|
| **1** | KARAR ham envanteri (grep + tsv taslak) | CC | mevcut repo | ~20 dk | yok |
| **2** | `kararlar.tsv` durum sütunu | Claude.ai | ayrı sohbet | 1-2 sohbet | 1 |
| **3** | Pilot bölünmesi + DURUM tavanı | Claude.ai + CC | ayrı sohbet | 1 sohbet | 2 |
| **4** | Repoya taşıma + `CLAUDE.md` + `baglam.sh` | CC | repo | ~1.5 saat | 3 |
| **5** | `ocak-arsivci` + `ocak-teshis` + `ocak-lint` | CC | repo | ~1 saat | 4 |
| **6** | `ocak-kararci` + `ocak-metin` | CC + Claude.ai | repo | ~1 saat | 5 |
| **7** | docs MCP sunucusu (endgame) | CC | Railway | ? | 4-6 oturunca |

**ADIM 1-2 tesisatsızdır.** Mevcut project files ile yapılır. Bittiğinde Claude.ai'nin
hakimiyeti bugünkünden kat kat iyi olur, hiçbir altyapı değişmeden. ADIM 3'e geçmeye
değer mi kararı o zaman **kanıtla** verilir.

**ADIM 7 (MCP) hedeftir, yapıştırma geçicidir (KARAR 461).** Railway'de n8n zaten
çalışıyor; küçük bir MCP sunucusu `docs/`'u token'la servis edebilir:
`docs_ara(sorgu)` · `docs_oku(dosya)` · `docs_karar(no)`. Yapıştırma yok, ayna yok,
bayatlama yok, 895 KB kronoloji **aranabilir** olur. Bedeli: yazma + barındırma +
auth + bakım, ve tek noktaya bağımlılık. 1-3 oturmadan açılmaz.

---

## GEÇİŞ SIRASINDA PROJECT FILES

- ADIM 1-3: **değişmez**, bugünkü gibi çalışır.
- ADIM 4 sonrası: yalnız `10-marka.md` kalır (yılda 2-3 kez değişir, sıfır bakım,
  unutma sigortası). Gerisi repo + `baglam.sh`.
- ADIM 7 sonrası: sıfır.

---

## SOHBET SONU PROTOKOLÜ — YENİ (KARAR 462)

**Eski:** Claude.ai Pilot'u tam üretir → Kaan indir-sil-yükle → arşiv patch'ini elle
`cat >>` → md5 doğrula.

**Yeni:** Claude.ai tek `docs-patch-YYYY-AA-GG.md` üretir → Kaan repoya atar → CC'ye
"oku ve uygula" → `ocak-arsivci` uygular + commit'ler + özet döner.

Patch dört sabit bölüm:
1. `00-durum.md` — **hedefli blok değişimi**, tam yeniden yazım değil
2. `01-kararlar.tsv` — append satırları + durumu değişen satırların yeni hali
3. `02-borclar.md` — kapanan / açılan
4. `90-kronoloji/YYYY-AA.md` — append (KIRPMA YASAĞI burada yaşar)

`ocak-arsivci` de KARAR 355'e tabidir: `00-durum.md`'ye hedefli yazım yapar,
öncesinde ADIM 0 salt-read ile dosyanın beklenen halde olduğunu doğrular. Kronoloji
append-only olduğu için orada çakışma yoktur.

**ADIM 4'e kadar geçerli ara form:** Pilot tam yenileme yerine hedefli patch verilir.
Bu sohbet ilk tatbikidir.

---

## DEĞİŞMEYEN ÜÇ ŞEY

1. **Her sayfa/konu ayrı sohbet** (KARAR 52) — bağlam kirliliği hâlâ gerçek.
2. **ADIM 0 salt-read** (KARAR 355) — agentlara da uygulanır, `ocak-arsivci` dahil.
3. **iPhone Safari eyeball** — merge öncesi, otomatikleşmez.

---

## RİSKLER

| Risk | Karşılık |
|---|---|
| tsv'de yanlış durum otoriter görünür, kimse arkasına bakmaz | `TEYITSIZ` enum + `kaynak` sütunu zorunlu + bloklar halinde üretim (toplu değil) |
| Yapıştırma atlanır, Claude kör başlar ve fark etmez | manifest satırı + "yoksa uydurmam" kuralı + `10-marka.md` project files'ta kalır |
| İki yüzeyli skill drift eder | `skill-sync.sh --check`; kanonik kaynak tek |
| Geçiş maliyeti faydadan önce | ADIM 1-2 tesisatsız, ~2 sohbet, kanıt üretir |
| Agent Notion'a yazar, marka sesi sulanır | KARAR 459 — `ocak-metin` taslak-only, en az 3 ay |

---

## SONRAKİ SOMUT ADIM

`2026-08-06-brief-karar-envanteri.md` → CC'ye "oku ve uygula".
Çıktı: `karar-ham.tsv` + anomali raporu. Sonra ADIM 2 için temiz sohbet.
