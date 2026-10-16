<!-- ÜRETİLEN DOSYA — ELLE DÜZENLENMEZ. Kaynak: scripts/durum-uret.mjs -->

# OCAK — ÖLÇÜM

**Koşum:** 16.10.2026 17:08 (Europe/Istanbul) · bayraklar: `--test --build`

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
| canlı HEAD | `fffed28` | `git log -1` |
| HEAD tarihi | 2026-10-14 | `git log -1 --date=short` |
| HEAD konusu | feat(etkinlik): hero'ya köz dolu "Yerini ayır" — tarih satırının hemen altı | `git log -1 --format=%s` |
| çalışma ağacı | **kirli** — 10 kayıt | `git status --porcelain` |
| uzak dal sayısı | **2** | `git branch -r` |

| uzak dal | main'e göre | kaynak |
|---|---|---|
| `origin/main` | main **0** commit önde · **0** commit geride | `git rev-list --count` |
| `origin/nkolay-test` | main **100** commit önde · **1** commit geride | `git rev-list --count` |

## TEST

| alan | değer | kaynak |
|---|---|---|
| vitest sonucu | 1091 passed (1091) · dosya: 44 passed (44) | `npx vitest run` |

## BUILD

| alan | değer | kaynak |
|---|---|---|
| prerender edilen sayfa | 38 | `dist/client` altındaki `index.html` sayısı |
| SSR route (toplam) | 22 | `.vercel/output/config.json` · `dest:"_render"` (`_image`/`_server-islands` hariç) |
| — bunun API route'u | 8 | aynı küme · `^/api/` ile başlayan |
| — bunun sayfa route'u | 14 | toplam − API |

⚠ **Yöntem beyanı (KARAR 470-b):** prerender sayımı yönlendirme takma adlarını da
sayar (`/istanbul/*` · `/workshop/*`); SSR sayımı aynı takma adları route tablosunda
ayrı satır olarak görür. Elle tutulmuş eski sayımlar bunları dışarıda bırakıyordu —
rakamlar bu yüzden birebir denk gelmez. Tanım burada yazılıdır, rakam ondan doğar.

## DOKÜMAN SATIRLARI

| dosya | satır |
|---|---|
| `docs/00-durum.md` | 199 |
| `docs/02-borclar.md` | 4087 |
| `docs/03-sira.md` | 986 |
| `docs/05-harita.md` | 203 |
| `docs/01-kararlar.tsv` | 665 |

`00-durum.md` tavanı (**≤200**, KARAR 457): **199** — ✅ altında

## BORÇ SAYIMI

| alan | değer | kaynak |
|---|---|---|
| toplam madde | 237 | `grep -cE '^## B'` |
| damgalı (kapandı/çözüldü/geri çekildi) | 63 | `^## B` başlıklarında `[✅❌]` |
| iş değil (ertelendi/planlı) | 2 | `^## B` başlıklarında `[⏸🔵]` |
| **açık** | **172** | toplam − damgalı − iş değil |
| mükerrer başlık | 0 | `^## B[0-9]+` → `uniq -d` |

*Ölçüt başlıktaki **damga**dır, kelimenin kendisi değil (10 Ağu B01 kaydı).*

## LEDGER BÜTÜNLÜĞÜ

| alan | değer | beklenen |
|---|---|---|
| son KARAR numarası | **664** | — |
| satır sayısı (başlık dahil) | 665 | — |
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
