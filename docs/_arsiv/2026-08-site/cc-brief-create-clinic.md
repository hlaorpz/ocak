# CC Brief — `create-clinic.ts`

> Railway ve Vercel canlı: `api.cabbar.ocak.life/health` 200, `cabbar.ocak.life`
> 200. Ama **giriş yapılamıyor** — üretimde demo seed koşmuyor, veritabanında
> tek klinik ve tek kullanıcı yok.
>
> Bu script o boşluğu kapatıyor. Kararların tamamı `docs/status.md`,
> "`create-clinic.ts` — ilk klinik ve sahip kullanıcısı" başlığında; burada
> yalnızca uygulama notları var.

---

## Alanlar

| Alan | Zorunlu | Not |
|---|---|---|
| klinik adı | evet | |
| slug | evet | var olan slug'da **hata verir**, üzerine yazmaz |
| saat dilimi | evet | `clinics.timezone`; `isValidTimeZone` ile doğrulansın |
| `specialty` | hayır | varsayılan `pediatrics` |
| sahip: ad, e-posta | evet | |
| sahip: şifre | evet | **argüman DEĞİL** — aşağı bak |

## Şifre komut satırı argümanı OLMAZ

Gizli prompt ile sorulur. Argüman olsaydı iki yerde sızardı: kabuk geçmişi
(`~/.zsh_history`) ve süreç listesi (`ps aux` — makinedeki her kullanıcı
görür). İkisi de dosya izniyle korunmuyor, ikisi de kalıcı.

Hash uygulamanın kendi `Argon2Service`'iyle üretilir — ayrı implementasyon
yazılmaz, parametreler ortamla aynı kalır.

## Bağlantı

`MIGRATION_DATABASE_URL` (owner rolü `cabbar`) ile koşar. Uygulama rolü RLS'e
tabidir ve `app.clinic_id` bağlamı olmadan **sıfır satır yazar** — script
sessizce hiçbir şey yapmamış gibi görünürdü.

## `clinic_role_permissions` satırları KURULMAZ

Yeni klinik **sıfır satırla** başlar. `enabled` NULLABLE olduğundan "satır yok"
= "karar verilmedi" ve `resolvePermission` ürün varsayılanına düşüyor. Satır
kurulsaydı ayarlar ekranında her hücre "Klinik ayarı" görünür, klinik hiçbir
karar vermemişken ekran "bu klinik karar verdi" derdi.

Gerekçenin tamamı `status.md`'de — oradaki karar bir kez ters yönde verilip
düzeltilmişti, tekrar açılmasın.

---

## Nereden koşulacak — bu bir KARAR, doğaçlama değil

Railway'de kabuk yok. Script **geliştirici makinesinden**, Postgres'in TCP
proxy'si üzerinden koşulacak.

Bedeli açıkça yazılsın (`docs/deploy.md` §4'te zaten karar olarak duruyor):
Postgres dışarı açık kalıyor ve owner şifresi yerel makineye iniyor. **Klinik
kurulduktan sonra dış erişim kapatılır.**

Script'in `--help` çıktısı ya da başındaki yorum, bu çağrı biçimini örnekle
göstersin — `prod-bootstrap.sql`'in başındaki nota benzer şekilde. Kullanıcı
deploy günü nasıl çağıracağını aramasın.

---

## Doğrulama

Script yazıldıktan sonra **gerçekten koşulup** doğrulanmalı: klinik ve sahip
oluştu mu, sahip kullanıcı `cabbar.ocak.life` üzerinden **giriş yapabiliyor
mu.** Yerelde test yeterli değil — kabul kriteri üretimde giriş.

Aynı slug ile ikinci kez koşulduğunda hata verdiği de sınansın.
