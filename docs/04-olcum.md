<!-- ÜRETİLEN DOSYA — ELLE DÜZENLENMEZ. Kaynak: scripts/durum-uret.mjs -->

# OCAK — ÖLÇÜM

**Koşum:** 11.09.2026 10:55 (Europe/Istanbul) · bayraklar: `--test --build`

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
| canlı HEAD | `de74216` | `git log -1` |
| HEAD tarihi | 2026-09-11 | `git log -1 --date=short` |
| HEAD konusu | kapanis(578-582): ledger + harita + arsivci + CLAUDE.md + kronoloji kaydı | `git log -1 --format=%s` |
| çalışma ağacı | **kirli** — 6 kayıt | `git status --porcelain` |
| `main` ↔ `astro-iskelet` | main **168** commit önde · **0** commit geride | `git rev-list --count` |

## TEST

| alan | değer | kaynak |
|---|---|---|
| vitest sonucu | 325 passed (325) · dosya: 19 passed (19) | `npx vitest run` |

## BUILD

| alan | değer | kaynak |
|---|---|---|
| prerender edilen sayfa | 41 | `dist/client` altındaki `index.html` sayısı |
| SSR route (toplam) | 18 | `.vercel/output/config.json` · `dest:"_render"` (`_image`/`_server-islands` hariç) |
| — bunun API route'u | 6 | aynı küme · `^/api/` ile başlayan |
| — bunun sayfa route'u | 12 | toplam − API |

⚠ **Yöntem beyanı (KARAR 470-b):** prerender sayımı yönlendirme takma adlarını da
sayar (`/istanbul/*` · `/workshop/*`); SSR sayımı aynı takma adları route tablosunda
ayrı satır olarak görür. Elle tutulmuş eski sayımlar bunları dışarıda bırakıyordu —
rakamlar bu yüzden birebir denk gelmez. Tanım burada yazılıdır, rakam ondan doğar.

## DOKÜMAN SATIRLARI

| dosya | satır |
|---|---|
| `docs/00-durum.md` | 199 |
| `docs/02-borclar.md` | 3297 |
| `docs/03-sira.md` | 832 |
| `docs/05-harita.md` | 187 |
| `docs/01-kararlar.tsv` | 584 |

`00-durum.md` tavanı (**≤200**, KARAR 457): **199** — ✅ altında

## BORÇ SAYIMI

| alan | değer | kaynak |
|---|---|---|
| toplam madde | 195 | `grep -cE '^## B'` |
| damgalı (kapandı/çözüldü/geri çekildi) | 44 | `^## B` başlıklarında `[✅❌]` |
| iş değil (ertelendi/planlı) | 2 | `^## B` başlıklarında `[⏸🔵]` |
| **açık** | **149** | toplam − damgalı − iş değil |
| mükerrer başlık | 0 | `^## B[0-9]+` → `uniq -d` |

*Ölçüt başlıktaki **damga**dır, kelimenin kendisi değil (10 Ağu B01 kaydı).*

## LEDGER BÜTÜNLÜĞÜ

| alan | değer | beklenen |
|---|---|---|
| son KARAR numarası | **583** | — |
| satır sayısı (başlık dahil) | 584 | — |
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

⚠ `project.json` **yok** — değerler `repo.json`'un `projects[0]` kaydından okundu.
`vercel --prod` yolu bu dosyayla kurulmaz (**B179**).

---

⚠ **Vercel paneli bu betiğe kapalıdır** (`05-harita.md` §3). Yukarıdaki kimlik
yerel dosyadan okundu, panelden değil — panel gerçeğiyle ayrışmış olabilir.
Ayrışma teşhisi yargıdır, `00-durum.md`'de yaşar.
