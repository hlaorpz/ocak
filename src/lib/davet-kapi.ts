/**
 * davet-kapi.ts — `/api/davet` sessiz ret kapısı (Origin + zaman damgası +
 * honeypot). Saf fonksiyonlar; `Request`/`Response` bilmez, test edilebilir.
 *
 * ── Neden üç katman, neden hiçbiri tek başına yetmez ──
 * `/api/davet` kimlik doğrulaması, oturum ya da imzalı token istemeyen açık
 * bir JSON endpoint'i; URL'i ve payload şekli yedi kayıt sayfasının statik
 * HTML'inde inline duruyor (ölçüm: `grep -rl "/api/davet" dist/client` → 7
 * dosya). Yani:
 *
 *   - Honeypot, HTML formunu parse edip BÜTÜN alanları dolduran botu yakalar.
 *     Doğrudan JSON POST atan bot `website` alanını hiç göndermez → boş kabul
 *     edilir → geçer. Bugünkü saldırgana karşı etkisi büyük olasılıkla sıfır;
 *     yine de taban, çünkü form-dolduran botlar da var.
 *   - Zaman damgası, ancak EKSİK `ts` de reddedilirse bir kapıdır. Yalnız
 *     "<3sn ise reddet" kuralı kâğıt üstünde koruma olurdu: alanı hiç
 *     göndermeyen bot geçerdi (KARAR 1, Kaan). Yine de `Date.now()` uydurmakla
 *     aşılabilir — bar yükselir, duvar örülmez.
 *   - Origin, doğrudan POST'u körelten tek ucuz önlemdir; ama bir header'dır,
 *     tarayıcı dışından serbestçe yazılabilir.
 *
 * Üçü birlikte "ucuz bot"u eler. Kanamayı durduran şey musluktur
 * (`davet-akisi.ts`); burası musluk yeniden açıldığında altta duracak taban.
 *
 * ── Ret her zaman SESSİZ ──
 * Çağıran taraf `200` + gerçek başarı gövdesinin AYNISINI döner. Bot başarılı
 * olduğunu sansın, varyasyon denemesin. Sebep yalnız sunucu log'una düşer.
 */

/** Sessiz reddin sebebi — yalnız log sayacı için; response'a ASLA girmez. */
export type SessizRetSebebi =
  | 'akis-kapali'
  | 'origin-yok'
  | 'origin-uyusmuyor'
  | 'honeypot'
  | 'ts-yok'
  | 'ts-gecersiz'
  | 'ts-hizli'
  | 'ts-gelecek'
  | 'ts-eski';

/**
 * Form görünür olduktan sonra gönderime kadar geçmesi gereken asgari süre.
 * Bot formu anında doldurur; insan dolduramaz.
 */
export const ASGARI_DOLDURMA_MS = 3_000;

/**
 * Damganın azami yaşı. Success ekranı açık unutulmuş bir sekmede damga
 * bayatlar; bayat damga replay'e açık kapıdır.
 *
 * ⚠ Bilinen bedel: kutuyu 6 saatten uzun süre açık bırakıp sonra davet
 * gönderen GERÇEK kullanıcı da sessizce reddedilir — teyit metnini görür ama
 * mail gitmez. Nadir; kabul edildi (KARAR 1). Sayfayı yenilemek çözer.
 */
export const AZAMI_FORM_YASI_MS = 6 * 60 * 60 * 1000;

/**
 * İleri saat toleransı. Damga client saatinden geliyor; kullanıcı saatinin
 * birkaç saniye ileri olması olağan, bunu bot muamelesi yapmak yanlış olur.
 */
export const SAAT_KAYMASI_TOLERANSI_MS = 60_000;

/**
 * Honeypot — gizli `website` alanı doluysa bot. `api/form.ts:58` ve
 * `api/kayit.ts:453-456` deseninin aynısı (KARAR 152 / 194).
 */
export function honeypotYakalandi(website: unknown): boolean {
  return typeof website === 'string' && website.trim() !== '';
}

/**
 * Zaman damgası kapısı. Geçerliyse `null`, değilse ret sebebi.
 *
 * `ham` hem sayı hem sayısal dize kabul eder — hidden input'tan dize gelir,
 * elle POST'ta sayı gelebilir. Eksik/boş ile bozuk ayrı sebeplere düşer;
 * ikisi de reddedilir, ayrım yalnız log okunurken işe yarar (alanı hiç
 * bilmeyen bot mu, alanı bilip çöp yollayan bot mu).
 */
export function zamanDamgasiSebebi(
  ham: unknown,
  simdi: number,
): SessizRetSebebi | null {
  if (ham === undefined || ham === null || ham === '') return 'ts-yok';

  const ts = typeof ham === 'number' ? ham : Number(String(ham).trim());
  if (!Number.isFinite(ts) || ts <= 0) return 'ts-gecersiz';

  const gecen = simdi - ts;
  if (gecen < -SAAT_KAYMASI_TOLERANSI_MS) return 'ts-gelecek';
  if (gecen < ASGARI_DOLDURMA_MS) return 'ts-hizli';
  if (gecen > AZAMI_FORM_YASI_MS) return 'ts-eski';
  return null;
}

/**
 * Origin kapısı — **kural bu dosyadan TAŞINDI** (11 Eyl 2026).
 *
 * Gövdesi ve gerekçesi artık `origin-kural.ts`'de, tek nüsha hâlinde. Sebep:
 * ikinci tüketici geldi (`origin-muhafiz.ts`, Astro `checkOrigin`'inin kendi
 * karşılığı — `ef09c47`) ve o modülün buraya import atması bağımlılığı ters
 * yöne kurmuştu (genel → özel). Kural şimdi ikisinin de üstünde.
 *
 * Bu satır re-export olarak DURUYOR, kaldırılmadı: `api/davet.ts` ve
 * `davet-kapi.test.ts` kuralı buradan alıyor, çağrı yüzeyi değişmesin
 * (CLAUDE.md §5 — taşıma, kırpma değil). `originSebebi`'nin dönüş tipi
 * `OriginRetSebebi`; `SessizRetSebebi` o iki değeri kapsadığı için
 * `sessizRet(originRet)` tip olarak aynen çalışır.
 */
export { originSebebi, type OriginRetSebebi } from './origin-kural.ts';
