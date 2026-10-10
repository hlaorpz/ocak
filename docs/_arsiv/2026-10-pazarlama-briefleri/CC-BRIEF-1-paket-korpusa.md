# CC BRIEF 1 · Pazarlama paketinin (v2) korpusa yazılması

**Tarih:** 9 Ekim 2026 · **Yazan:** Claude.ai · **Uygulayan:** CC · **Tür:** yalnız doküman; kod yok

Bu brief bir yazım emridir. Belirsiz kalan yerde uydurma, dur ve raporla. v1 brief'inin (`CC-BRIEF-pazarlama-korpusa.md`, 9 Ekim) yerine geçer; v1 uygulanmadıysa yalnız bu uygulanır.

## Ne yapılacak

`ocak-pazarlama-v2-2026-10-10c.zip` içindeki doküman dosyaları korpusa `docs/pazarlama/` olarak girer. Mevcut hiçbir dosyanın gövdesi değişmez; iki dosyaya birer işaret satırı eklenir. Kararlar ayrı brief'tedir (`CC-BRIEF-3-kararlar.md`); kart basıcı ve derleyici ayrı brief'tedir (`CC-BRIEF-2-kart-derleyici-ve-site.md`).

## Sıra şartı

Kaan'ın iniş sonrası işlerinden **sonra** koşar: sunucu olayı commit'inin push'u, kart derleyici değişikliğinin commit'i, B118/B119 docs patch'i. Çalışma ağacı o işlerden kirliyse DUR; bu brief onları commit etmez.

## ADIM 0 (salt-read; raporla)

```bash
cd ~/Desktop/hlaorpz/ocak
git log --oneline -5
git status --short                                   # kirliyse DUR
ls docs/pazarlama 2>/dev/null                        # varsa DUR (v1 uygulanmış demektir; raporla)
wc -l docs/00-durum.md docs/03-sira.md docs/05-harita.md
grep -n "30-sosyal" docs/05-harita.md                # çapa adayı; kaç kez geçtiğini raporla
grep -n "B221" docs/03-sira.md                       # çapa adayı; kaç kez geçtiğini raporla
node scripts/baslik-denetim.mjs ; echo "denetim: $?" # 0 değilse DUR
```

Zip'i repo dışında aç ve say:

```bash
mkdir -p /tmp/ocak-pazarlama-v2 && unzip -o ~/Desktop/ocak-pazarlama-v2-2026-10-10c.zip -d /tmp/ocak-pazarlama-v2
find /tmp/ocak-pazarlama-v2 -type f -name '*.md' | wc -l    # beklenen: 61
```

Sayı tutmuyorsa DUR. (61 = 55 `docs/pazarlama/` dosyası + 3 skill dosyası + 3 CC brief'i.)

## Yazım

**1 · Dosyalar.** Zip'in içinde tek bir üst klasör var (`ocak-pazarlama-v2/`). Aşağıdakiler olduğu gibi `docs/pazarlama/` altına kopyalanır; ad, sıra ve içerik değişmez:

```
docs/pazarlama/00-OKU.md
docs/pazarlama/TAKVIM.md
docs/pazarlama/GORSEL-gunduz-paleti-ve-MJ.md
docs/pazarlama/FIKIR-HAVUZU.md
docs/pazarlama/DEVIR-gunduz-zeminleri-midjourney.md
docs/pazarlama/ACIK-KAPI-19-EKIM/   (3 dosya)
docs/pazarlama/STRATEJI/            (6 dosya)
docs/pazarlama/icerik/              (34 dosya)
docs/pazarlama/icerik/havuz/        (7 dosya)
```

**Skill'ler.** Zip'teki `skills/ocak-gonderi/SKILL.md`, `skills/ocak-kart/SKILL.md`, `skills/ocak-yorum/SKILL.md` dosyaları `docs/skills/<ad>/SKILL.md` olarak kopyalanır. Önce `scripts/skill-sync.sh` dosyasını ve mevcut bir `docs/skills/*/SKILL.md` başlığını oku; frontmatter biçimi farklıysa (alan adı, sıra) yeni üç dosyanın yalnız frontmatter'ını o biçime uydur, gövdeye dokunma. Hedef klasörlerden biri zaten varsa DUR.

**Girmeyenler:** üç `CC-BRIEF-*.md`; `araclar/`, `ornekler/` ve `hazir-kartlar/` (BRIEF 2'nin işi; görseller `docs/` dışına girer).

**2 · `docs/05-harita.md`.** Sosyal medyayı gösteren satırın (ADIM 0'da `30-sosyal` araması) hemen altına, o tablonun sütun düzenine uyan tek satır:

- yol: `pazarlama/`
- ne taşır: 9 Ekim 2026 pazarlama paketi (v2): gün gün takvim, tarihli gönderi dosyaları, seriler, Açık Kapı 19 Ekim kampanyası ve reklam detayı, strateji notları, gündüz paleti, fikir havuzu
- ne taşımaz: karar. Kararlar `01-kararlar.tsv`'dedir; `30-sosyal.md` ile çelişirse, `30-sosyal.md` yenilenene kadar (B221) hangi satırın geçerli olduğunu ilgili KARAR söyler
- kim yazar: Claude.ai üretir, CC yazar

Tablonun sütunları bu dört bilgiyi karşılamıyorsa satırı tablonun biçimine uydur, bilgiyi eksiltme. `30-sosyal` haritada birden çok satırda geçiyorsa ya da hiç geçmiyorsa DUR.

**3 · `docs/03-sira.md`.** `B221` geçen "Sıradaki iş (içerik hattı, 8 Eki)" paragrafının **altına** yeni paragraf (mevcut paragraf değişmez):

```
**Pazarlama paketi v2 (9 Eki):** `docs/pazarlama/` — Açık Kapı ve genel pazarlama planının uygulama malzemesi; giriş `00-OKU.md`, gün gün iş `TAKVIM.md`. `30-sosyal.md` yenilemesi (**B221**) 20 Ekim retrosundan sonra bu paketle ve aynı gün alınan kararlarla yapılır.
```

Başlık bölgesine (ilk `---`'a kadar) dokunulmaz.

**4 · Kronoloji.** `docs/90-kronoloji/2026-10.md` sonuna append:

```
## 2026-10-09 — pazarlama paketi v2 · KARAR bu turda yok (BRIEF 3'te) · B açılan/kapanan yok · HEAD <ADIM 0'da okunan>

- `docs/skills/` altına üç skill girdi: `ocak-gonderi`, `ocak-kart`, `ocak-yorum` (Claude hesabında 9 Ekim'de kaydedildi; depo kopyası bu turda).
- `docs/pazarlama/` açıldı: <SAYI> dosya (yöntem: `find docs/pazarlama -type f -name '*.md' | wc -l`).
- Kaynak: Claude.ai oturumu, 9 Ekim 2026; plan belgesi Claude Docs'ta ("OCAK Pazarlama Planı — Açık Kapı ve Genel"), kapalı yüzey, doğrulamaya çalışma.
- v1 paketi (aynı gün, 31 dosya) korpusa girmedi; v2 onun yerine geçti.
- Pakette olgu teyidi yarım iki gönderi var (`1024-O-halet-cambel`, `1031-O-mualla-eyuboglu`); yayın kararı Kaan'da.
- Hesabın 9 Ekim durumu (Kaan'ın ekran görüntüsü): 4 gönderi; son 30 gün 5,5 bin görüntülenme.
```

`<SAYI>` elle yazılmaz; komut koşulur, çıkan sayı yazılır. 55 çıkmıyorsa DUR.

## Dokunulmayacaklar

- `00-durum.md`, `01-kararlar.tsv`, `02-borclar.md`: bu brief yazmaz (BRIEF 3'ün işi).
- `30-sosyal.md`, `31-zemin.md`, `10-marka.md`: bu tur girmez.
- `04-olcum.md`: elle yazılmaz; kapanışta betik koşar.
- `src/`, `tools/`, `scripts/`: kod yok.

## Kapanış

```bash
node scripts/durum-uret.mjs
node scripts/baslik-denetim.mjs          # 0 olmalı
find docs/pazarlama -type f -name '*.md' | wc -l
git add docs/pazarlama docs/skills/ocak-gonderi docs/skills/ocak-kart docs/skills/ocak-yorum docs/05-harita.md docs/03-sira.md docs/90-kronoloji/2026-10.md docs/04-olcum.md
git commit -m "docs(pazarlama): 9 Ekim pazarlama paketi v2 korpusa girdi"
git log -1 --format='%h'
```

Tek konu, tek commit. Push Kaan'ın onayıyla.

## DUR koşulları

1. Çalışma ağacı kirli.
2. `docs/pazarlama/` zaten var.
3. Zip'teki ya da kopyalanan dosya sayısı beklenenle tutmuyor.
4. `05-harita.md` ya da `03-sira.md` çapası bulunamıyor ya da birden çok yerde geçiyor.
5. `baslik-denetim.mjs` sıfır dönmüyor (yeni dosyaların başlık biçimi denetime takılıyorsa dosyayı düzeltme; raporla).
6. Hedef dosyada bu brief'in bilmediği bir yapı var.
7. Elle rakam yazma isteği doğuyor.

## Notlar

- ADIM 0 korpusun MCP kopyasından (`9c3576c`) yazıldı; yerel repoyu görmedim. Çapaları yerelde yeniden ölç.
- `05-harita.md`'nin gövdesini bu oturumda okumadım; "tablo" varsayımı ölçülmedi (DUR 6).
- Yasak dize taraması Claude.ai tarafında yapıldı. Yasak dizelerin kural olarak anıldığı satırlar (ör. "son yerler denmez") ihlal değildir.
