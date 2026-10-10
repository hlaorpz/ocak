# Havuz · Söz Kartları (OCAK'ın kendi cümleleri)

- **Amaç:** İlham veren, saklanan, paylaşılan tek cümlelik kartlar. Başkasının alıntısı değil.
- **Tarih:** Haftalık döngüde Çarşamba ya da Cuma; ilki 10 Ekim (`1010-O-soz-kullenen`)
- **Kanal:** @ocak.biz tek kart (4:5) ve story (9:16)
- **Işık:** Gündüz (D1, D2)
- **Durum:** Onaylı (Kaan, 9 Ekim: yorum yapılmayan madde onaydır; Advaita onayları tamam). 2, 3 ve 5 numara basıldı (`hazir-kartlar/`). Cümleler marka çekirdeğine eklenmez.

## Kalıp

- **Görsel:** D1 ya da D2; söz kömür, bir kelime toprak. OCAK işareti kart dibinde.
- **Ekran metni:** en çok on dört kelime.
- **Caption:** iki üç cümle ve tek soru. Link yok; hediye içerik. Davet haftasında son satıra tarih bandı eklenebilir.
- **İlk yorum:** yok ya da yorum sorusu.
- **Story:** kart paylaşılır; "Bu akşam için sakla." ya da "Aklına biri geldiyse ona gönder."

## On iki söz

| # | Ekran metni | Caption'daki soru | Ucu |
|---|---|---|---|
| 1 | Kimseye bir şey borçlu olmadığın bir saat. | Bir saatin olsa... | Açık Kapı |
| 2 | Küllenen şey sönmüş değildir. | Bu aralar üstü küllenen ne? (soru kutusunda) | C22 Kül kartı, `/hikaye` |
| 3 | Dayanmak bir beceri. Tek beceri olmak zorunda değil. | Dayanmaktan başka neyi iyi yaparsın? Tek kelime. | AL · OL · VER |
| 4 | Yorgunluk tembellik değil. Bir bilgi. | Bedenin bugün ne diyor: dur, yavaşla, devam? (anket) | Pratik kartları |
| 5 | Bilmiyorum demek de bir yer. | En son ne zaman "bilmiyorum" dedin? (anket: bugün, bu hafta, hatırlamıyorum) | Eşik teması |
| 6 | Güçlü olmak zorunda olmadığın bir oda. | O oda sende neresi? Tek kelime. | Çember |
| 7 | Dinlenmek hak edilmez. Dinlenilir. | Bu akşam için sakla. | Pratik kartları |
| 8 | Bedenin senden önce biliyor. | Bunu en son nerede fark ettin: omuz, mide, nefes? (anket) | OL kapasiteleri |
| 9 | Bir şey bitti. Yenisi gelmedi. Arası da bir yer. | Aradaysan bir nokta bırak. | Eşik teması |
| 10 | Sessiz kalmak da bir katılım. | Kameran açık mı gelirsin, kapalı mı? (anket) | Açık Kapı |
| 11 | Herkese yetiştiğin günün sonunda sana kalan. | Gün sonunda sana kalan ne: on dakika, bir çay, hiç? (anket) | Bir Saat |
| 12 | İstemek ayıp değil. | En son kimden bir şey istedin? İlk harfi yeter. | "Komşu komşunun külüne muhtaçtır" |

## Advaita'nın sözleri

`10-marka.md`'de onun sesi olarak kayıtlı iki cümle var. Ortak paylaşımla, onun hesabından çıkar.

- "Hatırla; yeter bazen. Sen iyileş yeter bazen."
- "Kanla bağımız var; canla bağımız var."

## Notlar ve kaynak

- Kip denetimi: hiçbir cümle okuyucuya yaşamadığı geçmiş atfetmiyor; hepsi şimdiki hâl tarifi ya da genel yargı.
- 9 numara soru reels'i 3 ile aynı eksende ("Bitti. Yenisi gelmedi. Arada ne yapılır?").
- 2 numaradaki soru açıkta sorulmaz; yalnız soru kutusunda.
- Yasak kelime taraması yapıldı (`yasak-dizeler.tsv`): temiz.

## On iki söz daha

| # | Ekran metni | Caption'daki soru | Zemin |
|---|---|---|---|
| 13 | Hayır demek de bir bakım. | Bu hafta neye hayır dedin? Tek kelime. | Keten |
| 14 | Kimse görmeden yaptığın şeyler de sayılır. | Bugün kimsenin görmediği ne yaptın? | Kireç |
| 15 | Acele eden sen değilsin. Gün. | Bugün ne bekleyebilir? | Zeytin gölgesi |
| 16 | Ağlamak da bir nefes. | Soru yok. | Kireç |
| 17 | Bir kadının sessizliği boşluk değil. | Soru yok; story'de sakla çağrısı. | Zeytin |
| 18 | İyiyim demek zorunda olmadığın bir yer. | O yer sende neresi? | Toprak (metin krem) |
| 19 | Yavaşlamak geride kalmak değil. | Bugün neyi yavaş yaptın? | Kireç |
| 20 | Bazı sorular cevap için sorulmaz. | Yanında taşıdığın soru ne? (soru kutusunda) | Keten |
| 21 | Yorulduğunu söylemek şikâyet değil. | Anket: bugün söyledin mi? Evet / Henüz | Kireç |
| 22 | Bir mum, bir oda, bir saat. Yeter bazen. | Bu akşam için sakla. | Gece |
| 23 | Güçlü görünmek ile iyi olmak aynı şey değil. | Soru yok. | Zeytin gölgesi |
| 24 | Kendine verdiğin sözü de tut. | Kendine verdiğin en küçük söz ne? | Kireç |

Kip denetimi: hiçbiri okuyucuya yaşamadığı bir geçmiş atfetmiyor. 16 ve 23 hassas; yorum sorusu sorulmaz.

## Üretim ve skill

- Kart: `python3 araclar/ocak_kart.py --zemin kirec --metin "Küllenen şey|*sönmüş* değildir." --cikti soz.jpg` (4:5); story için `--oran 9:16`.
- Midjourney zemini istenirse: D1 ve D2 istemleri `GORSEL-gunduz-paleti-ve-MJ.md` içinde; üretilen görsel `--zemin dosya.png` ile verilir.
- Denetim: `ocak-lint`. Yayın paketi: `ocak-gonderi` (öneri).
