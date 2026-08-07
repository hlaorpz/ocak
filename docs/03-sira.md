# OCAK — SIRA

**Son güncelleme:** 7 Ağustos 2026 · doküman turu kapandı

> Bu dosya **ne yapıldığını** değil **sırada ne olduğunu** tutar. Durum `00-durum.md`'de,
> borçlar `02-borclar.md`'de, gerekçe kronolojide yaşar. Burada yalnız: **sıradaki iş,
> kim yapar, nerede yapılır, nasıl açılır.**
>
> **Her sohbet sonu patch'i bu dosyayı da günceller** (KARAR 468). Biten satır silinmez,
> `✅` damgası alır ve bir sonraki bakımda alt bölüme iner.

---

## SIRADAKİ İŞ

**B32** — `ocak-referans.md` dağıtımı. Claude.ai, ayrı sohbet.
Açılış paketi: `_arsiv/2026-08-07-b32-acilis-paketi.md`

---

## DOKÜMAN KUYRUĞU

| # | iş | kim | nerede | ön koşul | nasıl açılır |
|---|---|---|---|---|---|
| 1 | **B32** — `ocak-referans.md` → `20-ref-*` beşlisi (+28 `kaynak` hücresi) | Claude.ai | ayrı sohbet | KARAR 467 | `_arsiv/2026-08-07-b32-acilis-paketi.md` — paketi oku, ölçümü çalıştır, dosyaları ekle |
| 2 | **ADIM 4** — repoya tam taşıma + `CLAUDE.md` + `baglam.sh` | CC | repo | yok | brief yazılacak (Claude.ai) |
| 3 | **B35** — KARAR 87 üç ayrı şeye atfediliyor; `00-durum.md` ODA_MAP işaretçisi kırık | Claude.ai | ayrı sohbet | yok | kronoloji dilimleri + ledger |
| 4 | **B36** — ~37 sığ kaynak satırı `#k` çapasına terfi | Claude.ai | ayrı sohbet | tercihen B32 sonrası | ledger + ilgili dilimler |
| 5 | **251** — ledger'ın son `TEYITSIZ` satırı, kaynak metni bulunamadı | Claude.ai | B36 ile birlikte | yok | `2026-06.md` #38 bloğu |
| 6 | **ADIM 5-6** — `ocak-arsivci` · `ocak-teshis` · `ocak-lint` · `ocak-kararci` · `ocak-metin` | CC | repo | ADIM 4 | KARAR 458 kadro tanımı |
| 7 | **ADIM 7** — docs MCP sunucusu (endgame, yapıştırma biter) | CC | Railway | 4-6 oturunca | KARAR 461 |

**B32 dahil hiçbiri ADIM 4'ü kilitlemiyor.** 1 ve 2 arasındaki sıra tercih meselesidir.

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

Bu dosya **kısa kalır.** Gerekçe yazılmaz, durum tekrar edilmez, tarih anlatılmaz —
üçü de kendi dosyasında yaşar. Şişerse yanlış kullanılıyordur.

---

## BİTENLER

- **6-7 Ağustos — doküman mimarisi turu ✅** (6 commit, sıfır kod commit'i)
  ADIM 1 · ADIM 2 · ADIM 3 · ADIM 3b · B33 · B37 · B34 · arşiv kapanışı.
  TEYITSIZ 27 → 1 · kırık `kaynak` referansı 409 → 0 · 7 borç kapandı ·
  KARAR 465 · 466 · 467 mühürlendi. → `90-kronoloji/2026-08.md`
