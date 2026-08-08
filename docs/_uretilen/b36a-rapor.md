# B36-a — DESEN TESPİTİ RAPORU

Üreten: `docs/_uretilen/b36a-desen-tespiti.py`. Türetilmiştir, elle düzeltilmez.
Ledger'a yazılmadı — `#k` terfisi elle doğrulanır (KARAR 466).

## Ölçüm

- ledger veri satırı: **474**
- mekanik `:NNNN` popülasyonu: **418**
- çapası karar-listesi indeksi olan (SIĞ): **119**
- çapası indeks olmayan: **299**
- çözülemeyen çapa: **0**

Yöntem: `kaynak` sütunu `^[0-9A-Za-z-]+\.md:\d+(,\d+)*$` ile süzüldü; hedef dosyanın ilk numaralı satırı `^\s*-\s+\*\*KARAR N[:.]?\*\*` ile karşılaştırıldı ve yakalanan N satırın kendi `no`'suyla eşitlendi. Ölçüm python3 ile; awk bu makinede bayt sayar.

## Sığ satırların aday dağılımı

- tek adaylı (mekanik taşınabilir): **12**
- çok adaylı (elle seçim): **36**
- adaysız (B36-b): **71**

## Nokta örnekleme (sistematik, adım 5)

| no | mevcut | aday | metin |
|---|---|---|---|
| 47 | `2026-02.md:72` | `—` |  |
| 96 | `2026-05.md:94` | `2026-05.md:4017` | **B. Davranış (KARAR 96 — dokunulmaz):** |
| 99 | `2026-05.md:102` | `2026-05.md:155` | **Brief zinciri:** **Brief 1** (commit `dd198da`) — `scripts/notion-discover.mjs` ile Noti |
| 104 | `2026-05.md:119` | `2026-05.md:121` | **Bu sohbetin işi:** #21 Section Components'in ilk yarısı. Claude.ai (strateji + brief'ler |
| 115 | `2026-05.md:173` | `2026-05.md:1044` | 1. **Ana sayfa en sondaki Ateş Mektupları yerine form-anchor koydum, yanlış mı?** — Direkt |
| 101 | `2026-05.md:111` | `2026-05.md:4593` | 2. **B — `docs/sayfa-yazim-rehberi.md`:** Repo içi 3 satırlık konvansiyon notu. Kaan veya  |
| 102 | `2026-05.md:117` | `2026-05.md:2648` | **KARAR 102 ruhu kararı:** Lansman öncesi "uydurma SSS" yazmak yerine lansman sonrası Açık |
| 22 | `2026-02.md:38` | `—` |  |
| 90 | `2026-05.md:78` | `2026-05.md:3573` | **A — WhatsApp / bot entegrasyonu:** Site WhatsApp botuna yalnızca yönlendirme yapar (`wa. |
| 100 | `2026-05.md:103` | `2026-05.md:105` | **Bu sohbetin işi:** #20 Astro Setup. Astro 5 + Vercel adapter + Notion client iskeleti ür |
| 103 | `2026-05.md:118` | `2026-05.md:2365` | 7. **Brief disiplin pekiştirildi.** Bu sohbette parça parça Markdown verme (KARAR 103) hep |
| 108 | `2026-05.md:148` | `2026-05.md:5138` | - **Katman 1 — Yazım disiplini (mevcut, hazır).** KARAR 111 `docs/sayfa-yazim-rehberi.md`  |

## Nokta örneklemesi — ELLE doğrulandı (KARAR 466)

Bu bölümün yargısı betikten gelmez; `ORNEKLEM` bloğunda veri olarak gömülüdür. Betik puan verir, doğruluk beyan etmez.

| no | aday | tuttu mu | dosyada gerçekte ne var |
|---|---|---|---|
| 51 | `2026-05.md:3634` | ✅ | `### URL Yapısı — Türkçe Karaktersiz, Lowercase (KARAR 51)` + altında gövde. Kararın kendi kaydı. |
| 141 | `2026-05.md:2342` | ✅ | `**KARAR 141 (#31):** …lansman öncesi kalan iş haritası…` — gövdeli paragraf. |
| 131 | `2026-05.md:2009` | ❌ | `12. **Safari Hero glow banding fix (KARAR 131)**` — komşuları 10·11·13·14·15. Sığ çapadan **başka bir sığ çapaya** taşıma; gövde yok. |
| 91 | `2026-05.md:623` | ❌ | `2. **/advaita KARAR 91 cümlesi 2 hit (3 planlanmıştı)**` — kararın denetim sonucu, kaydı değil. Atıf yönü ters: uygulayan satır ile kuran satır aynı sinyali veriyor. |
| 89 | `2026-05.md:3873` | ❌ | `Footer.astro` bileşen envanteri; 214 karakterlik satırın sonunda `**Kaan görünmüyor (KARAR 89).**` Atıf, kayıt değil. Uzunluk bonusu tek parantez atıfına grubun en yüksek puanını (6) verdi. |

**Sonuç: 2/5** — eşik 4.

## YÖNTEM YETERSİZ — iş B36-b'ye devreder

§3 eşiği tutmadı (2/5, gereken 4) ve DUR-3 tetiklendi (beşten ikiden fazlası tutmuyor). **Bu rapordaki aday tablosu mekanik taşıma girdisi olarak kullanılamaz.**

Kök sebep: `ETIKET` · `BASLIK` · `PARANTEZ` sinyallerinin üçü de kararın **numarasının geçtiğini** ölçüyor, satırın kararın **kaydı olduğunu** değil. Uzunluk bonusu bunu ağırlaştırıyor — tek bir parantez içi atıf taşıyan uzun envanter satırı, gövdeli bir kayıt satırını geçebiliyor.

Tek-aday oranı bağımsız olarak aynı yere çıkıyor: 12/119 = **%10**, §6'nın "üçte iki üstü" eşiğinin çok altında.

**Asıl bulgu örneklemede değil:** 119 sığ satırın 71'inin (60%) adayı **yok**. O kararların kronolojide indeks girdisinden başka kaydı yazılmamış. B36-b'nin işi çapa düzeltme değil, **kayıt yazma** — ve düşünülenden büyük.
