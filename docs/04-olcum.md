<!-- ÜRETİLEN DOSYA — ELLE DÜZENLENMEZ. Kaynak: scripts/durum-uret.mjs -->

# OCAK — ÖLÇÜM

**Koşum:** 07.10.2026 02:11 (Europe/Istanbul) · bayraklar: `(yok)`

> Bu dosyadaki her satır bir komutun çıktısıdır (**KARAR 578**). Yanlışsa dosya
> düzeltilmez — `scripts/durum-uret.mjs` düzeltilir ve yeniden koşulur
> (`05-harita.md` kural 1-b). Yargı, gerekçe ve teşhis burada **yaşamaz**;
> onlar `00-durum.md`'de ve kronolojide yaşar.
>
> Koşulmayan ayak **"bu koşumda ölçülmedi"** yazar ve son bilinen değeri **taşımaz**
> (**KARAR 470**). Devralınan rakam yasaktır.

---

## GIT

| alan | değer | kaynak |
|---|---|---|
| canlı HEAD | `53420c3` | `git log -1` |
| HEAD tarihi | 2026-10-07 | `git log -1 --date=short` |
| HEAD konusu | docs(astro.config): sitemap yorumu "üç route" diyordu, dört | `git log -1 --format=%s` |
| çalışma ağacı | **kirli** — 5 kayıt | `git status --porcelain` |
| uzak dal sayısı | **2** | `git branch -r` |

| uzak dal | main'e göre | kaynak |
|---|---|---|
| `origin/main` | main **0** commit önde · **0** commit geride | `git rev-list --count` |
| `origin/nkolay-test` | main **37** commit önde · **1** commit geride | `git rev-list --count` |

## TEST

| alan | değer | kaynak |
|---|---|---|
| vitest sonucu | *bu koşumda ölçülmedi* | `npx vitest run` |

*`--test` bayrağıyla koşulur.*

## BUILD

*bu koşumda ölçülmedi* — `--build` bayrağıyla koşulur.

## DOKÜMAN SATIRLARI

| dosya | satır |
|---|---|
| `docs/00-durum.md` | 187 |
| `docs/02-borclar.md` | 3776 |
| `docs/03-sira.md` | 938 |
| `docs/05-harita.md` | 187 |
| `docs/01-kararlar.tsv` | 605 |

`00-durum.md` tavanı (**≤200**, KARAR 457): **187** — ✅ altında

## BORÇ SAYIMI

| alan | değer | kaynak |
|---|---|---|
| toplam madde | 214 | `grep -cE '^## B'` |
| damgalı (kapandı/çözüldü/geri çekildi) | 53 | `^## B` başlıklarında `[✅❌]` |
| iş değil (ertelendi/planlı) | 2 | `^## B` başlıklarında `[⏸🔵]` |
| **açık** | **159** | toplam − damgalı − iş değil |
| mükerrer başlık | 0 | `^## B[0-9]+` → `uniq -d` |

*Ölçüt başlıktaki **damga**dır, kelimenin kendisi değil (10 Ağu B01 kaydı).*

## LEDGER BÜTÜNLÜĞÜ

| alan | değer | beklenen |
|---|---|---|
| son KARAR numarası | **604** | — |
| satır sayısı (başlık dahil) | 605 | — |
| altı sütun dışı satır | 0 | 0 ✅ |
| mükerrer numara | 0 | 0 ✅ |
| enum dışı `durum` | 0 | 0 ✅ |
| boş `kaynak` hücresi | 0 | 0 ✅ |

## VERCEL KİMLİĞİ

| alan | değer |
|---|---|
| kaynak dosya | `.vercel/repo.json` |
| proje adı | ocak |
| proje ID | `prj_CxW3Nm85TGzdrZdePCk74WLAv23f` |
| team / org ID | `team_EVx2zHhI9iYscmqsuHckk599` |

`project.json` **yok** — değerler `repo.json`'un `projects[0]` kaydından okundu.
**Beklenen hâldir, arıza değil** (KARAR 584): proje GitHub'a bağlı olduğu için
CLI repo seviyesinde bağlıyor. `vercel --prod` yolu bu dosyayla kurulmaz ve
kurulması beklenmiyor — deploy git push ve `notion-content-update-main` hook'uyla gidiyor.

---

⚠ **Vercel paneli bu betiğe kapalıdır** (`05-harita.md` §3). Yukarıdaki kimlik
yerel dosyadan okundu, panelden değil — panel gerçeğiyle ayrışmış olabilir.
Ayrışma teşhisi yargıdır, `00-durum.md`'de yaşar.
