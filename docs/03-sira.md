# OCAK — SIRA

**Son güncelleme:** 10 Ağustos 2026 · ADIM 7 birinci dalga ✅ — MCP canlı, ikinci dalga bağlantı ucuna kilitli

> Bu dosya **ne yapıldığını** değil **sırada ne olduğunu** tutar. Durum `00-durum.md`'de,
> borçlar `02-borclar.md`'de, gerekçe kronolojide yaşar. Burada yalnız: **sıradaki iş,
> kim yapar, nerede yapılır, nasıl açılır.**
>
> **Her sohbet sonu patch'i bu dosyayı da günceller** (KARAR 468). Biten satır silinmez,
> `✅` damgası alır ve bir sonraki bakımda alt bölüme iner.

---

## SIRADAKİ İŞ

**Sıra kararı verildi (8 Ağustos akşamı, 9 Ağustos'ta yazıldı):**
**ADIM 6 ✅ → ADIM 7 birinci dalga ✅ → ADIM 7 ikinci dalga → hold.**

⚠ **"Fırsat buldukça" bir kuyruk değildir.** İkinci dalga bittiğinde geriye yalnız
borçlar kalıyor — bugün **33 açık iş** (ölçüm: `02-borclar.md` başlık sayacı, 10 Ağustos,
B54/B55 sonrası). Sıra ölçütü: **kapı → yayını kilitleyen → tek turluk → kendi planını
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
| 7 | **ADIM 7 birinci dalga** ✅ — `mcp/` + üç araç, Railway'de canlı, claude.ai'ye bağlı | CC | Railway | — | kapandı 10 Ağu |
| 7b | **ADIM 7 ikinci dalga** — `docs_karar(no)` + B54 envanter satırı + B53 bağlantı ucu + B51 | CC | repo + Railway | 7 ✅ | `02-borclar.md` B51·B53·B54 |
| 8 | **B38** — ledger çapa denetimi (terminal kontrol) | Claude.ai | ayrı sohbet | ADIM 7 **+ B36-a** | `02-borclar.md` B38. Ön ölçüm ADIM 4'te yapıldı (isabet %57); B38 onu tekrarlamaz, mekanik onarımın oranı ne kadar oynattığını ölçer |

**Kapı işi: B01** — klon/remote/Vercel adı üçü de `ocak` olur. MCP bağlantısı bugün
`ocak-site` adıyla kuruldu; B01 sonrası tek tıkla yeniden bağlanır. Ucuz, tek turluk,
ve `cd` sözleşmesini bir kez düzeltir.

**Üç hat paralel yürür** — sahip dağılımı `02-borclar.md`'nin **gövdelerinde** yaşar,
`03-sira.md` tekrar etmez. ⚠ O dosyanın satır 14'teki sahip tablosu **bayattır** (B55);
sahip rakamı ondan okunmaz, gövdelerden sayılır.

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
| **B19** — WhatsApp display name | Kaan | Meta iki adayı da reddetti; itiraz açık. Site WhatsApp numarası yayını buna kilitli (KARAR 396) |
| **Sosyal v2 `[KAAN]` önkoşulları** — kurucu görsel + `KURUCU-URL` | Kaan | Gün 1 yayını bunsuz başlamaz (KARAR 450) |
| **Yolculuk fiyat bandı → ilk Yolculuk etkinliği** | Kaan + Advaita | Eylül kohortu duyurusunun önkoşulu |
| **Ödeme** — banka sanal POS | Kaan | entegratör belirsiz, `payment-provider.ts` stub |
| **B50** ✅ — claude.ai skill yüzeyi (altı zip yüklendi) | Kaan | kapandı 9 Ağu — bakım: skill dokunuşundan sonra `sync` + yeniden yükleme |
| **B53** — MCP yol-token ödünü: token URL yolunda taşınıyor, çünkü claude.ai connector diyaloğu başlık kabul etmiyor (Request headers beta, bu hesapta kapalı) | Kaan (beta erişimi) + CC (kaldırma) | ⚠ **açık ve kendiliğinden kapanmaz** — beta açıldığı gün başlığa geçilir, yol ucu koddan kaldırılır |
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

- **10 Ağustos — ADIM 7 birinci dalga ✅** (7 commit, sıfır site kodu commit'i)
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
