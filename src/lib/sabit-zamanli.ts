/**
 * sabit-zamanli.ts — sır karşılaştırmasının tek yeri.
 *
 * ── Neden ayrı modül ──
 * Bu fonksiyon 11 Eylül 2026'da `payment-provider.ts` içinde **private** olarak
 * doğdu ve orada iki yerde kullanılıyordu (callback sırrı · N-Kolay hash'i).
 * B211'in tarama ucu (`/api/bildirim-tara`) ve kart devam linki
 * (`/odeme/devam`) aynı karşılaştırmaya ihtiyaç duyunca üç seçenek vardı:
 * sağlayıcı modülünden export etmek (ödeme bilgisi olmayan iki yüzeyi ödeme
 * modülüne bağlardı), ikinci bir kopya yazmak (iki kopyanın zamanla ayrışması
 * — ve burada "ayrışma" demek sızan bir sır demek), ya da paylaşılan bir yere
 * çıkarmak. Üçüncüsü seçildi.
 *
 * ── Taşıma MEKANİKTİR ──
 * Gövde birebir taşındı, davranış DEĞİŞMEDİ (Kaan kararı 6). Özellikle
 * aşağıdaki boş-dize tuzağı **kapatılmadı**: kapatmak semantik bir değişiklik
 * olurdu ve bu commit'in konusu değil (CLAUDE.md §6 — mekanik dönüşüm ile
 * semantik iş aynı commit'te olmaz).
 */
import { createHash, timingSafeEqual } from 'node:crypto';

/**
 * Sabit-zamanlı dize karşılaştırması. Uzunluk farkının bile sızmaması için
 * ham dizeler değil SHA-256 özetleri karşılaştırılır — özetler daima aynı
 * uzunlukta olduğundan `timingSafeEqual` atmadan çalışır.
 *
 * Mock için fazla titiz görünebilir; bilinçli. Bu metot N-Kolay sağlayıcısına
 * DEVRALINACAK ve orada gerçek para var. Doğru deseni mock'ta kurmak, gerçek
 * sağlayıcı yazılırken "sonra düzeltiriz" borcu bırakmaktan ucuz.
 *
 * ⚠ **BOŞ DİZE TUZAĞI — çağıranın sorumluluğu.** `('', '')` için `true` döner.
 * Yani env'i yazılmamış bir sunucuda, başlığı da olmayan bir istek
 * "doğrulandı" sayılırdı. Bu fonksiyon o kapıyı KAPATMAZ, çünkü boşluğun
 * sebebini ayırt edemez — oysa çağıranlar ayırt ediyor ve ayırt etmeleri
 * teşhis için gerekli:
 *
 *   `payment-provider.ts:325-328` → `sir-env-tanimsiz` vs `sir-istekte-yok`
 *   `payment-provider.ts:732`     → `hash-istekte-yok`
 *
 * Yeni bir çağıran eklerken **önce iki tarafın doluluğunu ayrı ayrı denetle,
 * sonra buraya gel.** Tek bir `if (!esit)` ile yetinmek fail-open demektir.
 */
export function sabitZamanliEsit(a: string, b: string): boolean {
  const ozetA = createHash('sha256').update(a, 'utf8').digest();
  const ozetB = createHash('sha256').update(b, 'utf8').digest();
  return timingSafeEqual(ozetA, ozetB);
}
