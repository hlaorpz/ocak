# Havuz · Külün Altından (bu dilin sözleri)

- **Amaç:** İlham sözlerini alıntıdan değil, dilin kendi belleğinden çıkarmak. C06'nın sesi: "Bu adı biz bulmadık. Dilin içinde bekliyordu."
- **Tarih:** Haftalık döngüde Cuma; ilki 14 Ekim (`1014-O-kulun-altindan-derman`), ikincisi 23 Ekim (`1023-O-kulun-altindan-komsu`)
- **Kanal:** @ocak.biz tek kart; story anketi
- **Işık:** Gündüz (D2)
- **Durum:** Onaylı (Kaan, 9 Ekim: yorum yapılmayan madde onaydır; Advaita onayları tamam). İlk iki kart basıldı.

## Kalıp

- **Ekran metni:** söz, iki satır; altında küçük "bu dilin sözü".
- **Caption:** ilk satır "Bu sözü biz bulmadık; dilin içinde bekliyordu." Sonra OCAK'ın iki üç cümlelik okuması. Sözün bilinen anlamı eğilmez; okuma ayrı cümlede durur.
- **Story:** tek anket ya da tek kelimelik soru; akşam cevap kartı ve köprü.

## Yedi söz

| # | Söz | Bilinen anlamı | OCAK'ın okuması | Soru | Ucu |
|---|---|---|---|---|---|
| 1 | Derdini söylemeyen derman bulamaz. | Sıkıntısını açmayan çaresini bulamaz. | Söylemek çözmek değil; ama söylenmemiş şey ağırlaşır. | Söylemesi en zor olan: Yoruldum / Bilmiyorum / Yardım et | Çember |
| 2 | Komşu komşunun külüne muhtaçtır. | İnsan en küçük şey için bile yakınındakine ihtiyaç duyar. | Kül bile lazım olur. İstemek ayıp değil. | Külüne muhtaç olduğun kadın kim? İlk harfi yeter. | Ateşi Kim Yaktı (`1030-O-atesi-kim-yakti`) |
| 3 | Ocağın tütsün. | Evin, soyun, hayatın sürsün (dua). | Bu dilin en sıcak duası bir ateşe edilir. | Bugün kime "ocağın tütsün" derdin? | C16 Adımız 3/3 |
| 4 | Ateş düştüğü yeri yakar. | Acıyı en çok yaşayan bilir. | Kimse senin yerine yanamaz. Ama yanında oturabilir. | Anket yok; kart tek başına durur. | Çember: tavsiye verilmez, tanıklık edilir |
| 5 | Bir elin nesi var, iki elin sesi var. | Birlikte yapılan iş ses getirir. | Kadın yalnız da ayakta durur. Ama ses iki elden çıkar. | Bu hafta kiminle ses çıkardın? Adını yaz. | Kız kardeşlik |
| 6 | Söz gümüşse sükût altındır. | Susmak bazen konuşmaktan değerlidir. | Hiçbir şey yazmadan sadece durmak da olur. | Kameran açık mı gelirsin, kapalı mı? | Açık Kapı |
| 7 | Üzüm üzüme baka baka kararır. | İnsan yanındakinden etkilenir. | Kadın kadına baka baka olgunlaşır. Çember bu yüzden var. | Kime baka baka olgunlaştın? Adını yaz. | Bir Kadın Vardı |

## Notlar ve kaynak

- 4 numara hassastır: acı ima eder. Yorum sorusu sorulmaz, anket açılmaz.
- 7 numaradaki atasözü gündelik dilde çoğu zaman olumsuz anlamda kullanılır (kötü örnekten etkilenmek). Okuma bunu tersine çeviriyor; Advaita rahatsız olursa kart çıkarılır.
- Atasözlerinin anlamlarını genel bilgimden yazdım; yayından önce bir atasözleri sözlüğünden (TDK) kontrol edilmeli.
- Dua ve deyimler kamu malıdır; kaynak ve telif sorunu yok. Şair ve yazar alıntısı bu seriye girmez.

## Yedi söz daha (ikinci sezon adayları)

| # | Söz | OCAK'ın okuması | Not |
|---|---|---|---|
| 8 | Damlaya damlaya göl olur. | Bir saat, bir akşam, bir mum. Büyük şeyler küçük tekrarlardan olur. | Sıklık sözü verilmez; okuma tarihsiz kalır |
| 9 | Ağaç yaşken eğilir. | Eğilmek kırılmak değil. Yaşı geçmiş ağaç da ışığa döner. | Bilinen anlamı çocuk eğitimiyle ilgili; okuma ayrı cümlede |
| 10 | Gönül ne kahve ister ne kahvehane; gönül sohbet ister, kahve bahane. | Mum bahane. | En kısa okuma; Açık Kapı sabahına |
| 11 | El elden üstündür. | Yarış için söylenir. Biz başka okuyoruz: el, elin üstüne konur. | Advaita rahatsız olursa çıkar |
| 12 | Akan su yosun tutmaz. | Durmak da akmanın bir parçası; göl de sudur. | Tersinden okuma |
| 13 | Tatlı dil yılanı deliğinden çıkarır. | Önce kendine. | Tek satır |
| 14 | Bir fincan kahvenin kırk yıl hatırı vardır. | Bir saatin de. | Açık Kapı sonrası Salı kartı |

Hepsinin anlamı yayından önce TDK Atasözleri ve Deyimler Sözlüğü'nden kontrol edilir; bu oturumda sözlüğü açmadım.

## Üretim ve skill

- Kart: `python3 araclar/ocak_kart.py --zemin zeytin-golgesi --metin "söz|*vurgu*" --not "bu dilin sözü"`
- Metin: `ocak-metin` ile okuma taslağı, `ocak-lint`.
