# 1019-O-bir-esikte-duruyorsun · Bir Eşikte Duruyorsun

- **Hat:** O · OCAK genel
- **Amaç:** Akşamın sabahı: imza cümlesi.
- **Tarih ve saat:** Pazartesi 19 Ekim, 09:00
- **Kanal:** @ocak.biz tek kart
- **Işık:** Gece (akşamı işaret eder)
- **Durum:** Metin hazır; kart yeniden basılmalı.
- **Yapılmazsa:** Düşer (tarihe bağlı).

## Görsel

G4: z08 zemini (`ocak-z08-kapi-camur-sivali-dar-2026-08-24.png`, `31-zemin.md`). Bindirme altın `#D4A855`; haftanın tek altın kartı. Uzun tire (—).

Profildeki mevcut kapı kartı aynı zeminden ama nokta ile basılmış ("Bir eşikte duruyorsun. Seni oraya ne getirdiyse."). Bu kart ondan ayrışsın diye alt bantla ve tireyle basılır.

Basımdan önce: zemin dosyasının z08 olduğu doğrulanır; kartla kaynak arasındaki piksel farkı ölçülür (doğru crop ~0–3, yanlış kaynak ~9–12).

## Ekran metni

> Bir eşikte duruyorsun —
> seni oraya ne getirdiyse.

Alt bant: `Bu akşam 21:00 · online`

## Caption

```
Kimini bir kırılma getirdi. Kimini içindeki "dahası var" sesi. İki yol da aynı eşiğe çıkıyor: bir dönem tamamlanıyor, yenisi henüz şekillenmedi.

Bu akşam bir saat o eşikte birlikte duruyoruz.

Gel. Yalnız durma o eşikte.

Açık Kapı: Bir Eşikte Duruyorsun · bu akşam 21:00 · online

#açıkkapı #eşikkadını
```

## İlk yorum

`ocak.biz/acik-kapi`

## Story

09:30: "Bu akşam 21:00. Kapı aralık." + link.

## Etkileşim

Yok. Bugün soru sorulmaz.

## Diğer kanallar

- **Reklam:** 19:00'da hepsi kapanır.

## Üretim ve skill

1. **Metin:** bu dosyada hazır; değişirse `ocak-metin` ile taslak, `ocak-lint` ile denetim.
2. **Kart:** `ocak-kart` (öneri) ya da `araclar/ocak_kart.py`. Gece kartı için mevcut kart derleyici.
3. **Yayın paketi:** `ocak-gonderi` (öneri): takvim teyidi, lint, caption ve story'nin kopyalanır hâli.
4. **Yorumlar:** `ocak-yorum` (öneri) ve `STRATEJI/yorum-ve-topluluk.md`.

## Notlar ve kaynak

- Caption C03'ten uyarlandı; "Gel. Yalnız durma o eşikte." Ana Metin'den.
