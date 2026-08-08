# CC Brief — Deploy dosyaları (Dockerfile, release.sh, prod-bootstrap.sql)

> `docs/deploy.md` bu dosyaları **tarif ediyor ama hiçbiri yazılmadı.**
> Railway projesi ve Postgres kuruldu; bootstrap'ı koşacak dosya yok.
>
> Kapsam: yalnızca bu beş dosya. Uygulama kodu değişmiyor.
>
> Gerekçelerin tamamı `docs/deploy.md`'de — burada yalnızca ne yazılacağı ve
> nelere dikkat edileceği var.

---

## 1. `apps/api/Dockerfile`

Çok aşamalı. Node **22** (`.nvmrc` ile aynı, CI ile aynı).

**Build aşaması:**
- pnpm kurulumu, workspace'in tamamı kopyalanır (`packages/*` + `apps/api`)
- `pnpm install --frozen-lockfile`
- `@cabbar/db` `postinstall`'da `prisma generate` koşuyor — bu aşamada çalışmalı
- `packages/shared`, `packages/db`, `packages/specialties` **derlenir**
  (`dist/` üretir; ham `src/*.ts`'e işaret eden bir kurulum çalışma zamanında
  patlar — bkz. `status.md`, "Workspace paketleri derlenmiş çıktı yayınlar")
- `apps/api` derlenir

**Üretim aşaması:**
- Yalnızca üretim bağımlılıkları (`pnpm install --prod` ya da `deploy`)
- `dist/` çıktıları
- **Prisma şeması ve migration klasörü kopyalanmalı** — `release.sh`
  `migrate deploy` koşacak, dosyalar imajda olmalı
- **Seed'in üretimde koşabilmesi lazım.** Seed bugün TypeScript ve muhtemelen
  `tsx` ile koşuyor. Üretim imajında `tsx` yoksa `release.sh` patlar. İki yol
  var — hangisini seçtiğini PR açıklamasına yaz:
  (a) seed'i de derle ve derlenmiş hâlini koş, (b) `tsx`'i üretim
  bağımlılığı yap. (a) daha temiz.

`PORT` env'den okunmalı ve **`0.0.0.0`'a bind** edilmeli — `localhost`'a
bağlanırsa Railway healthcheck'i asla geçmez, ve bu hata log'da kendini
göstermez.

## 2. `.dockerignore` (kökte)

`node_modules`, `dist`, `.next`, `.git`, `.env*`, test çıktıları, `docs`.

**`.env` dosyalarının imaja girmemesi zorunlu.**

## 3. `railway.json`

Builder Dockerfile, `apps/api/Dockerfile` yolu, healthcheck `/health`,
restart politikası. Panelde girilebilen ayarların dosyada durması tercih —
panel ayarı bir yerde, gerekçesi başka yerde kalmasın.

---

## 4. `scripts/release.sh`

Pre-deploy komutu. **Owner bağlantısıyla** koşar.

```
set -euo pipefail
```

fail-fast şart: migration patlarken seed koşarsa hata iki katına çıkar.

1. `prisma migrate deploy`
2. Üretim seed'i — `NODE_ENV=production`, yalnızca referans veri

**Bağlantı dizesi:** ikisi de `MIGRATION_DATABASE_URL` (rol `cabbar`)
kullanmalı. Prisma `datasource` bloğu `DATABASE_URL` okuyorsa, script içinde
override edilmeli. `scripts/with-env.sh` zaten var — aynı deseni kullan,
ikinci bir yol açma.

**Hata yolu:** seed'in hata yakalaması bu PR'da zaten sadeleştirildi (mesaj +
kod). `release.sh` de aynı disiplini korusun — bağlantı dizesini log'lama.

---

## 5. `scripts/prod-bootstrap.sql`

`postgres` superuser'ı ile **bir kez** koşulur. `docs/deploy.md` §2'deki
sırayla:

1. `CREATE EXTENSION IF NOT EXISTS citext;`
2. `cabbar` rolü — login + şifre, **`SUPERUSER` DEĞİL, `CREATEROLE` DEĞİL**
3. `ALTER SCHEMA public OWNER TO cabbar;`
4. `cabbar_app` rolü — login + şifre
5. Gerekli `GRANT`'ler (migration'ın verdikleriyle çakışmasın; migration
   guard'ı yalnızca `CREATE ROLE`'ü kapsıyor, `GRANT`'ler koşulsuz — yani
   burada minimum yeter)

**Repoda hiçbir sır bulunmaz.** Şifreler `psql` değişkeni olarak dışarıdan
gelsin (`:'cabbar_password'` gibi), dosyaya gömülmesin. Dosyanın başına
kullanım örneği yorum olarak yazılsın — kullanıcı panelden koşacaksa
değiştireceği yer belli olmalı.

Sonuna **doğrulama sorguları** koy, çıktısı okunacak:

```sql
SELECT rolname, rolsuper, rolcreaterole, rolcanlogin
FROM pg_roles WHERE rolname IN ('cabbar','cabbar_app');

SELECT nspname, pg_get_userbyid(nspowner) AS owner
FROM pg_namespace WHERE nspname = 'public';
```

Beklenen: `rolsuper`/`rolcreaterole` ikisinde de `f`, `public` sahibi `cabbar`.

---

## Doğrulama

Dockerfile **yerelde build edilip çalıştırılmadan** PR açılmasın. İmaj ayağa
kalkıyor mu, `/health` 200 dönüyor mu — CI'ın yeşil olması bunu göstermiyor
(`status.md`, "yeşil test paketi 'uygulama çalışıyor' demek değildir").
