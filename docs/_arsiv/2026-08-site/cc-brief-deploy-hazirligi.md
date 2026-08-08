# CC Brief — Deploy hazırlığı: doküman güncellemeleri ve merge kuralı

> Kapsam: yalnızca doküman ve kural değişiklikleri + iki küçük kod dokunuşu
> (env doğrulaması, seed hata yolu). Deploy'un kendisi bu brief'te değil.

---

## 0. `docs/status.md` durum tablosu düzeltmesi

Satır 35 hâlâ #10'u `feat/issue-10-sekreter-ekrani` (PR bekliyor) diye
gösteriyor. Gerçekte `main`'de: `2dfd1a9`, PR #20. Diğer satırlarla aynı biçime
getir:

```
| #10 sekreter ekranı ve yetki ayarları | ✅ tamam | `main` (PR #20) |
```

Kalın yazımı kaldır — o vurgu "üzerinde çalışılan iş" anlamındaydı, artık değil.

Üstteki "Şu an" bloğundaki şu cümle de değişecek:

> Deploy planı `docs/deploy.md`'de — **onay bekliyor**, uygulanmadı.

Plan **onaylandı**, uygulanmadı.

---

## 0b. Merge artık CC'nin işi — `CLAUDE.md`'ye kural olarak yaz

Bugüne kadar PR'ları kullanıcı elle merge ediyordu. Bundan sonra merge'ü CC
yapacak, şu sınırlarla:

- **`gh pr merge` yalnızca CI yeşilken.** Kırmızıysa merge yok, sebep raporlanır.
- **`--admin` KULLANILMAZ.** Branch koruma kuralları atlanmaz. Manuel merge
  fiilen bir insan kapısıydı; o kapı kalkıyorsa yerini CI alır — atlanabilir
  bir kural değil.
- **Reviewer ajanı geçmeden merge edilmez.** Mevcut kural; merge CC'ye geçtiği
  için tekrar yazılıyor.
- **Merge eden PR, `docs/status.md` durum tablosunu güncellemekle yükümlüdür.**
  Satır 35'teki kayma tam olarak buradan doğdu: issue PR'ı branch adını yazdı,
  doküman PR'ı tabloyu güncellemedi, ikisi de "benim işim değil" diyebildi.
  Branch'ten `main`'e geçişi yazma sorumluluğu **merge edene** aittir.

---

## 1. `docs/deploy.md` — baştaki uyarıyı değiştir

"ONAYLANMIŞ DEĞİL" uyarısı kalkıyor. Yerine:

> Plan onaylandı, uygulanmadı. Uygulanınca bu belge "nasıl kuruldu" belgesine
> dönüşür.

---

## 2. Yeni bölüm: "Proxy güveni — ara durum" (§2'den önce)

`status.md`'deki **"DEPLOY ÖNCESİ ZORUNLU — istemci IP'si proxy arkasında
yanlış"** maddesi deploy'u BLOKLAMIYOR, ama sırası bağlayıcı.

**Gerekçe:** doğru `TRUST_PROXY_HOPS` değeri Railway topolojisi kurulmadan
bilinemez; tahminle yazılan sayı hiç yazmamaktan tehlikelidir — yanlış sayı
spoof'a kapı açar.

**Sıra:**

1. İlk deploy'da `X-Forwarded-For` **log'lanır**, güven sınırı olarak
   kullanılmaz.
2. Log'dan atlama sayısı ölçülür.
3. `TRUST_PROXY_HOPS` o sayıyla ayarlanır, XFF **sağdan** sayılır.
4. IP kovası ile e-posta kovası ayrılır: e-posta aşımında **yavaşlatma**,
   IP aşımında **429**.

**Kabul edilen ara risk — açıkça yazılsın:** bu dönemde hız sınırı anahtarı
fiilen `email`'e çöküyor, yani hedefli hesap kilitleme mümkün. Yalnızca
geliştirici erişimi varken kabul edilebilir. **Doktora URL verilmeden önce
kapanmalı** — bu bir çizgi, "sonra bakarız" maddesi değil.

---

## 3. Replika sayısı = 1 — ayar olarak

`apps/api/src/auth/login-rate-limiter.service.ts` sayaçları süreç belleğinde
tutuyor; ikinci örnek açıldığı an sınır sessizce ikiye katlanır.

Railway servis ayarına yazılsın, **deploy sonrası kontrol listesine de** gir.

---

## 4. PWA (§7) sıralamada öne alınıyor — ilk Vercel çıkışında hazır

**Gerekçe:** geliştirme mobilde, gerçek cihazda PWA olarak yürüyecek. Sekmede
test etmek dokunma hedefini, klavye davranışını ve standalone çerez davranışını
ölçmez — yani ölçülmek istenen şeyin kendisi kaçar.

Kontrol listesine ekle: **iOS standalone'da oturum çerezi taşınıyor mu.**
Standalone'da çerez kapsayıcısı sekmedekinden ayrı davranabiliyor; masaüstünde
`Lax` + `.cabbar.ocak.life`'ın çalışması bu konuda hiçbir şey söylemez.

---

## 5. Yedekleme — tetikleyicisi tarih değil, veri

Bugün veritabanında gerçek hasta yok, yedeği ertelemek makul.

**Pilot doktor ilk hastayı girmeden önce** yedek kurulu ve **en az bir kez
gerçekten geri yüklenmiş** olmalı — denenmemiş yedek yedek sayılmaz.

Yedeklerin de **Avrupa'da** durduğu doğrulanmalı; bölge kararının gerekçesi
yedeği kapsamazsa gerekçe eksiktir.

---

## 6. Deploy günü kararları — §3 ve §4'e ekle

- **Referans seed her deploy'da koşuyor.** Upsert mi yapıyor, sil-yaz mı?
  Sil-yaz ise `vaccine_schedule` satırları her deploy'da yeniden yaratılır.
  Koda bak, bulguyu belgeye yaz.
- **`create-clinic.ts` nereden koşacak?** Railway'de kabuk yok. Seçenek:
  geliştirici makinesinden prod'a bağlanmak — Postgres dışarı açılır, owner
  şifresi yerele iner, klinik kurulduktan sonra erişim kapatılır. **Karar
  olarak yazılsın**, deploy günü doğaçlanmasın.

---

## 7. `prod-bootstrap.sql` öncesi migration kontrolü

Plan, bootstrap'ta `cabbar_app` yaratılınca migration'daki `CREATE ROLE`
bloğunun sessizce atlanacağını **varsayıyor**.

`packages/db/prisma/migrations/20260805200000_rls_and_constraints/migration.sql`
dosyasına bak: `IF NOT EXISTS` guard'ı yalnızca `CREATE ROLE`'ü mü kapsıyor,
yoksa `GRANT`'ler de aynı bloğun içinde mi? İkincisiyse bootstrap sonrası
`cabbar_app` **yetkisiz kalır**. Bulgu belgeye yazılsın.

---

## 8. Küçükler

- Kontrol listesindeki `www` → bu kurulumda yok. Doğrusu:
  `cabbar.ocak.life` ↔ `api.cabbar.ocak.life`.
- Railway **healthcheck yolu `/health`** olarak ayarlansın; belirtilmezse hazır
  olmayan container'a trafik gider.
- **`ENCRYPTION_KEY` yer tutucusu** (`CHANGE-ME-CHANGE-ME-CHANGE-ME-32`)
  uzunluk kontrolünden geçiyor. `NODE_ENV=production` iken açılışta
  reddedilsin — `apps/api/src/config/env.ts`. Kontrol listesine gir.

---

## 9. Seed hata yolu — artık acil

`release.sh` seed'i **owner bağlantısıyla** koşuyor ve log'lar Railway'de
duruyor. Prisma hataları değer içerebilir.

Hata yolu sadeleştirilsin: **mesaj + kod**, ham `error` nesnesi değil.

Madde `status.md`'de "Küçük, acil olmayan" listesinden alınıp deploy bölümüne
taşınsın — kategori değiştirdi.

---

## 10. `docs/deploy.md` §8 sıra listesini şununla değiştir

```
1.  Railway projesi + BÖLGE (durulabilir)
2.  Postgres (Avrupa)
3.  prod-bootstrap.sql — bir kez
4.  API servisi + env (replika = 1)
5.  Deploy → migrate + seed + boot guard
6.  XFF log'undan atlama sayısını ÖLÇ
7.  create-clinic.ts (erişim sonra kapanır)
8.  Vercel + PWA (manifest, ikon, SW)
9.  DNS
10. Cihazda standalone test
11. TRUST_PROXY_HOPS + hız sınırı — doktordan ÖNCE
```
