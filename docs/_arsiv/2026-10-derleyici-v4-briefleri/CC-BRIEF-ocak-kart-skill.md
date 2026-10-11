# CC BRIEF · `ocak-kart` skill'i derleyiciye göre yeniden yazıldı

**Tarih:** 11 Ekim 2026 · **Yazan:** Claude.ai · **Uygulayan:** CC · **Tür:** doküman, tek commit

`docs-patch-2026-10-11b-derleyici-v4.md` uygulanıp commit'lendikten **sonra** koşar. B235'in kapanış şartlarından yalnız birincisini karşılar; borç açık kalır.

## ADIM 0

```bash
cd ~/Desktop/hlaorpz/ocak
git status --short                                                    # boş olmalı
grep -c 'ocak_kart.py' docs/skills/ocak-kart/SKILL.md                 # 0'dan büyük (eski hâl)
wc -l docs/skills/ocak-kart/SKILL.md                                  # yazımda 60
grep -c '^- \*\*11 Eki, v4 turu:\*\* derleyicinin gündüz değerleri değişti' docs/02-borclar.md   # 1; 0 ise DUR (v4 patch'i koşmamış)
md5 -q ~/Desktop/OCAK-v4-teslim/SKILL.md                              # 1116982cab084c4611962d92fae24481 olmalı
```

## Yazım

```bash
cp ~/Desktop/OCAK-v4-teslim/SKILL.md docs/skills/ocak-kart/SKILL.md
grep -c 'ocak-kart-derleyici.html' docs/skills/ocak-kart/SKILL.md     # 1
head -4 docs/skills/ocak-kart/SKILL.md                                # frontmatter: name ve description aynen duruyor
bash scripts/skill-sync.sh zip                                        # claude.ai zip'i tazelenir
```

Eski SKILL.md silinmiş sayılmaz: git geçmişinde durur ve içeriği (Python basıcı komutları) `pazarlama-ekler/araclar/` altındaki betikle birlikte tarihçedir (KARAR 654).

`docs/02-borclar.md` içinde `- **11 Eki, v4 turu:** derleyicinin gündüz değerleri değişti` ile başlayan satırın hemen **altına** ekle (mevcut satırlar değişmez):

```
- **11 Eki — (1) karşılandı:** `docs/skills/ocak-kart/SKILL.md` derleyiciye göre yeniden yazıldı; skill artık reçete hazırlar ve basılan kartı denetler, komut çalıştırmaz. Kalan şartlar: 44 kartın yeniden basımı · (2)'deki satırlar · (4)'teki üç dosyanın arşive inmesi.
```

`docs/90-kronoloji/2026-10.md` sonuna tek satır (öncesinde bir boş satır):

```
**`ocak-kart` skill'i (11 Eki, v4 turundan sonra):** derleyiciye göre yeniden yazıldı — B235'in birinci şartı karşılandı, borç açık. claude.ai yüzeyine zip Kaan tarafından elle yüklenir (`docs/_uretilen/skill-zip/ocak-kart.zip`).
```

```bash
node scripts/durum-uret.mjs
node scripts/baslik-denetim.mjs          # 0
git add docs/skills/ocak-kart/SKILL.md docs/02-borclar.md docs/90-kronoloji/2026-10.md docs/04-olcum.md
git commit -m "docs(skill): ocak-kart derleyiciye göre yeniden yazıldı — B235 (1)"
```

`docs/_uretilen/skill-zip/` `.gitignore`'dadır (satır 51, ölçüm: Kaan'ın diski 11 Eki); commit'e girmez. Zip'in yolunu raporla: Kaan onu claude.ai'ye elle yükler.

## DUR

1. Çalışma ağacı kirli.
2. v4 patch'i koşmamış (çapa 0).
3. md5 tutmuyor.
