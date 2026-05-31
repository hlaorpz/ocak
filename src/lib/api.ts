/**
 * api.ts — OCAK form gönderimleri için tek sabit endpoint kaynağı (#23 Brief 3).
 *
 * Tüm formlar (Ateş Mektupları, ileride basvuru/acik-kapi Astro'ya geçince) bu
 * unified Apps Script doPost endpoint'ine POST eder. formType ile ayrışırlar.
 *
 * Bu URL bir secret DEĞİL — public web-app URL'i. MailerLite/Sheets token'ları
 * Apps Script PropertiesService'te server-side yaşar, client'a hiç gitmez
 * (KARAR: token client'ta tutulmaz). Gövde: { formType, ...alanlar }.
 * Content-Type 'text/plain;charset=utf-8' — Apps Script CORS bypass pattern'i (legacy verbatim).
 */
export const APPS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycby0zKMg14Bwdc-0tHmgq6UGoY0Iczrep-WWxOj9HxobS2MNtk-aI920sXCWhsnW6-KKiw/exec';
