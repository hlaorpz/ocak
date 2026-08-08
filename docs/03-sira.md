# OCAK — SIRA

**Son güncelleme:** 8 Ağustos 2026 · ADIM 4 kapandı, B36 ölçüldü ve ikiye bölündü

> Bu dosya **ne yapıldığını** değil **sırada ne olduğunu** tutar. Durum `00-durum.md`'de,
> borçlar `02-borclar.md`'de, gerekçe kronolojide yaşar. Burada yalnız: **sıradaki iş,
> kim yapar, nerede yapılır, nasıl açılır.**
>
> **Her sohbet sonu patch'i bu dosyayı da günceller** (KARAR 468). Biten satır silinmez,
> `✅` damgası alır ve bir sonraki bakımda alt bölüme iner.

---

## SIRADAKİ İŞ

**ADIM 5** — `ocak-arsivci` · `ocak-teshis` · `ocak-lint`. CC, repo.
Kadro tanımı KARAR 458; kanonik kaynak `docs/skills/` (henüz yok, bu turda doğar).
Brief Claude.ai'da yazılacak.

⚠ **`ocak-kararci`'ye onarım modu gerekmiyor.** B36 açılış ölçümü (`_uretilen/olcum-2026-08.md`):
`HİÇ` sıfır — ledger kırık değil, sığ. Kuyruğun üçte ikisi tek mekanik desen; gereken
bir dönüştürme betiği (B33/B37 kardeşi), ajan değil. **B36-a ADIM 5 ile aynı turda gidebilir.**

---

## DOKÜMAN KUYRUĞU

| # | iş | kim | nerede | ön koşul | nasıl açılır |
|---|---|---|---|---|---|
| 1 | **ADIM 5** — `ocak-arsivci` · `ocak-teshis` · `ocak-lint` | CC | repo | yok — ADIM 4 ✅ | KARAR 458 kadro tanımı |
| 2 | **B39** — `ocak-kaynak-kanonu.md` + `Ocak-Mufredat.md` dağıtımı (447 satır, evsiz) | Claude.ai | ayrı sohbet | yok | `02-borclar.md` B39 — B32 deseni |
| 3 | **B35** — KARAR 87 üç ayrı şeye atfediliyor; `00-durum.md` ODA_MAP işaretçisi kırık | Claude.ai | ayrı sohbet | yok | kronoloji dilimleri + ledger |
| 4a | **B36-a** — karar-listesi deseni (`- **KARAR N:** Başlık (Bölüm A.X)`) → `#k` terfisi, mekanik | CC | repo | yok | `02-borclar.md` B36 + `_uretilen/olcum-2026-08.md`; B33/B37 betik deseni |
| 4b | **B36-b** — desen dışı kalanlar (162 · 231 · 381 + B32'nin bulduğu 4 vaka) | Claude.ai | ayrı sohbet | B36-a | ledger + ilgili dilimler; kalan kuyruk B36-a sonrası yeniden ölçülür |
| 5 | **251** — ledger'ın son `TEYITSIZ` satırı, kaynak metni bulunamadı | Claude.ai | B36 ile birlikte | yok | `2026-06.md` #38 bloğu |
| 6 | **ADIM 6** — `ocak-kararci` · `ocak-metin` | CC + Claude.ai | repo | ADIM 5 | KARAR 458; `ocak-kararci` çapa yazarken KARAR 472'ye tabidir |
| 7 | **ADIM 7** — docs MCP sunucusu (endgame, yapıştırma biter) | CC | Railway | 4-6 oturunca | KARAR 461 |
| 8 | **B38** — ledger çapa denetimi (terminal kontrol) | Claude.ai | ayrı sohbet | ADIM 7 **+ B36-a** | `02-borclar.md` B38. Ön ölçüm ADIM 4'te yapıldı (isabet %57); B38 onu tekrarlamaz, mekanik onarımın oranı ne kadar oynattığını ölçer |

**Hiçbiri ADIM 5'i kilitlemiyor.** B39 · B35 · B36-b · 251 sırası tercih meselesidir.
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
- **8 Ağustos — ADIM 4 ✅** (4 commit + 3 kapanış + bu patch, sıfır kod commit'i)
  `CLAUDE.md` kökte · `baglam.sh` beş profil · project files boşaldı (`10-marka.md` hariç) ·
  **B36 açılış ölçümü**: isabet %57, `HİÇ` sıfır, kuyruk ~179± ve üçte ikisi mekanik ·
  KARAR 469 · 470 · 471 · 472 mühürlendi · B40 · B41 · B42 açıldı.
  → `90-kronoloji/2026-08.md`
- **7 Ağustos — B32 ✅** `ocak-referans.md` dağıtımı (4 commit).
  3574 satır → 63 segment → 7 hedef. `20-ref-*` beşli → **yedili**.
  33 kaynak hücresi dönüştü · 1715 satır kronolojiye indi · `_arsiv/ocak-referans-v1.md`.
  → `90-kronoloji/2026-08.md`
