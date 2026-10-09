/**
 * sehir.ts — Şehir yazımının tek kuralı (B118 İŞ C).
 *
 * ── Neden gerek oldu ──
 * `Şehir` serbest metin (`api/kayit.ts` ham değeri yazıyor) ve canlı Notion
 * verisinde yazım dağınık: `izmir` · `İzmir` aynı şehir, iki satır. Ölçüm
 * Kaan'ın 9 Ekim bulgusu (19 Ekim etkinliğine bağlı 6 kayıt).
 *
 * ── `tr` yereli ŞART ──
 * JavaScript'in varsayılan büyük/küçük harf dönüşümü Türkçe'de yanlış:
 * `'izmir'.toUpperCase()` → `IZMIR` (noktasız I), oysa doğrusu `İZMİR`.
 * `'İSTANBUL'.toLowerCase()` → `i̇stanbul` (birleşik nokta kalır). Bu yüzden
 * her iki yönde de `toLocaleUpperCase('tr')` / `toLocaleLowerCase('tr')`
 * kullanılıyor.
 *
 * ── Mevcut satırlara dokunulmuyor ──
 * Bu kural YAZIM anında işliyor. Notion'daki eski satırları Kaan elle
 * düzeltiyor (brief §6) — geriye dönük bir toplu güncelleme bu turda yok.
 */

/**
 * Kelime ayıracı sayılan karakterler — boşluk, tire ve eğik çizgi.
 * Yakalama grubu: `split` ayıraçları da döndürsün ki korunabilsinler.
 */
const AYIRAC = /([\s\-/]+)/;

/** Bir parça tamamen ayıraçtan mı oluşuyor? */
function ayiracMi(parca: string): boolean {
  return /^[\s\-/]+$/.test(parca);
}

/**
 * Şehir adını normalleştirir.
 *
 * Sıra: baş-son boşluk kırp → iç boşluk dizilerini tek boşluğa indir → her
 * kelimenin ilk harfi büyük, kalanı küçük (`tr` yereliyle).
 *
 * Tire ve eğik çizgi de kelime ayıracı ve KENDİLERİ KORUNUYOR —
 * `kahramanmaraş/elbistan` → `Kahramanmaraş/Elbistan`, tireli bir ad boşluğa
 * dönüşmüyor. Boşluk dizileri tek boşluğa iniyor; ayıraç karışık geldiğinde
 * (`" - "`) boşluklar atılıp işaret kalıyor.
 *
 * Boş/tanımsız/dize-olmayan → boş dize. Çağıran boşu yazmıyor (property
 * atlanıyor), yani bu dönüş "alan yazılmasın" demek.
 */
export function sehirYaz(ham: string | null | undefined): string {
  if (typeof ham !== 'string') return '';
  const t = ham.trim();
  if (!t) return '';
  return t
    .split(AYIRAC)
    .map((parca) => {
      if (!parca) return '';
      if (ayiracMi(parca)) {
        const isaretler = parca.replace(/\s+/g, '');
        return isaretler === '' ? ' ' : isaretler;
      }
      return parca.slice(0, 1).toLocaleUpperCase('tr') + parca.slice(1).toLocaleLowerCase('tr');
    })
    .join('');
}
