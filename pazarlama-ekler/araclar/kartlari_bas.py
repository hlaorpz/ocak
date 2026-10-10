#!/usr/bin/env python3
"""9 Ekim paketindeki gündüz kartlarını ve story kartlarını topluca basar."""
import ocak_kart as k, os, sys
o = sys.argv[1] if len(sys.argv) > 1 else "hazir-kartlar"
os.makedirs(o, exist_ok=True)
def kay(im, ad): im.convert("RGB").save(os.path.join(o, ad + ".jpg"), quality=84)
# Kireç duvarlı kartlar gündüz kurucu karesinden basılır (zemin/gunduz-kurucu.png). Dosya yoksa çizim zemine düşer.
KURUCU = os.path.join(os.path.dirname(os.path.abspath(__file__)), "zemin", "gunduz-kurucu.png")
KADRAJ = {"genis": dict(metin_ust=0.46), "ayna": dict(metin_ust=0.46, ayna=True),
          "yakin": dict(metin_ust=0.30, yakin=1.5, yatay=0.22, dikey=0.50),
          "yakin-ayna": dict(metin_ust=0.30, yakin=1.5, yatay=0.22, dikey=0.50, ayna=True)}
def duvar(metin, kadraj="genis", **kw):
    """Kireç duvar kartı: kurucu varsa ondan, yoksa çizim zeminden."""
    if not os.path.exists(KURUCU): return k.bas("kirec", metin, **kw)
    a = dict(KADRAJ[kadraj]); kw.pop("tohum", None)
    if "metin_ust" in kw: kw.pop("metin_ust")
    a.update(kw)
    # Dokulu duvarda ince italik zayıf kalır: Medium Italic, büyük punto, vurgu köz.
    uz = max(len(x.replace("*", "")) for x in metin.split("|"))
    if kw.get("punto") is None: a["punto"] = 112 if uz <= 18 else (96 if uz <= 26 else 80)
    else: a["punto"] = round(kw["punto"] * 1.2)
    a.setdefault("vurgu", "koz"); a["agir"] = True
    return k.bas(KURUCU, metin, tema="gunduz", **a)
B19 = "Açık Kapı · 19 Ekim Pazartesi · 21:00 · online"
kay(duvar("Küllenen şey|*sönmüş değildir.*"), "1010-O-soz-kullenen-4x5")
kay(duvar("Küllenen şey|*sönmüş değildir.*", oran="9:16"), "1010-O-soz-kullenen-9x16")
kay(duvar("Kimseye bir şey|borçlu olmadığın|*bir saat.*", "ayna", bant=B19), "1011-A-bir-saat-4x5")
kay(duvar("Kimseye bir şey|borçlu olmadığın|*bir saat.*", "ayna", bant=B19, oran="9:16"), "1011-A-bir-saat-9x16")
kay(k.bas("zeytin", "Dayanmak bir beceri.|Tek beceri olmak zorunda değil.", tohum=9), "1015-O-soz-dayanmak-4x5")
kay(k.bas("zeytin-golgesi", "Derdini söylemeyen|derman bulamaz.", kucuk_not="BU DİLİN SÖZÜ"), "1014-O-kulun-altindan-derman-4x5")
kay(duvar("Yanına al:|bir mum, bir defter,|kulaklık, bir bardak su.", "yakin", bant="Yarın akşam 21:00 · online"), "1018-O-yanina-al-4x5")
fa = [("keten", "Bir kadın vardı:|ilk kitabına adını yazamadı.", 78),
      ("krem", "1889. Fransızcadan bir roman çevirdi.||Kapakta adı yoktu; imza yerinde iki kelime vardı: “Bir Hanım.”", 62),
      ("krem", "Yazmayı bırakmadı.||1892’de bir roman yayımladı. Bu kez kapakta kendi adı vardı:|*Fatma Aliye.*", 62),
      ("krem", "Ondan devraldığımız:|*kendi adı.*||Bir işi yapmak bazen yetmez; altına adını koymak gerekir.", 62),
      ("kirec", "Altına adını koymadığın|ne var?||*Ateş devralınır.*", 66)]
for i, (z, m, p) in enumerate(fa, 1):
    kay(duvar(m, "yakin-ayna", punto=p) if z == "kirec" else k.bas(z, m, punto=p, tohum=40 + i, isaret=(i in (1, 5)), metin_ust=0.24 if i in (1, 5) else 0.30), f"1012-O-fatma-aliye-k{i}")
fu = [("keten", "Bir kadın vardı:|bir hastane odasında başladı.", 78),
      ("krem", "1947. Verem tedavisi için İsviçre’de bir sanatoryumdaydı.||Günler uzundu.", 62),
      ("krem", "Teyzesi ona bir paket gönderdi: kil ve birkaç alet.||Vakit geçsin diye.", 62),
      ("krem", "Vakit geçirmedi; başladı.||Türkiye’nin ilk kadın seramik sanatçılarından biri oldu:|*Füreya Koral.*", 62),
      ("krem", "Ondan devraldığımız:|*yeniden başlamak.*||Başlamanın doğru yaşı, doğru odası yok.", 62),
      ("kirec", "Neye geç kaldığını|düşünüyorsun?||*Ateş devralınır.*", 66)]
for i, (z, m, p) in enumerate(fu, 1):
    kay(duvar(m, "yakin-ayna", punto=p) if z == "kirec" else k.bas(z, m, punto=p, tohum=60 + i, isaret=(i in (1, 6)), metin_ust=0.24 if i in (1, 6) else 0.30), f"1017-O-fureya-koral-k{i}")
oa = ["*O Akşam Ne Olur*",
      "Zoom’a girersin.||Advaita bir mum yakar, niyetini söyler. İstersen sen de kendi mumunu yak.",
      "Önce tema açılır.||Sonra pratik gelir: kimi akşam beden konuşur, kimi akşam ses, kimi akşam sessizlik.",
      "Sonra sen yazarsın.||Advaita okur ve konuşur.",
      "Hiçbir şey yazmadan sadece durmak da olur; kameran kapalı da kalabilir.",
      "Kapanışta bir nefes, sonra mum söner. Ateş içimize taşınır.||*Bir akşamlığına gel.*"]
for i, m in enumerate(oa, 1):
    kay(duvar(m, "yakin", punto=62, bant=B19) if i == 6 else k.bas("toprak" if i == 1 else "krem", m.replace("*", "") if i == 1 else m, punto=84 if i == 1 else 62, tohum=80 + i,
              isaret=(i == 1), metin_ust=0.24 if i == 1 else 0.30), f"1014-A-o-aksam-ne-olur-k{i}")
st = {"anket-1": "Seni buraya|ne getirdi?", "anket-2": "Akşamların kimin?", "anket-3": "Kameran açık mı gelirsin,|kapalı mı?",
      "anket-4": "Evde mum var mı?", "anket-5": "Şu an neredesin?",
      "cevap-1": "İkisi de|aynı yere çıkar.", "cevap-2": "Pazartesi akşamı bir saati|*sana ayırdık.*", "cevap-3": "İkisi de olur.",
      "cevap-4": "Pazartesi 21:00’de|yakıyoruz.", "cevap-5": "Aradaysan,|Pazartesi’nin teması|tam bu: *eşik.*",
      "kopru": "Bir akşamlığına gel.", "kutu-ertesi-sabah": "Ertesi sabah ne kaldı?|Tek kelime.", "kime-gonderirdin": "Aklına biri geldiyse|ona gönder."}
for i, (ad, m) in enumerate(st.items()):
    kay(k.bas("krem", m, oran="9:16", tohum=100 + i, metin_ust=0.26) if ("anket" in ad or "kutu" in ad) else
        duvar(m, "ayna" if i % 2 else "genis", oran="9:16", bant=B19 if ad == "kopru" else ""), f"story-{ad}-9x16")
print(len(os.listdir(o)), "dosya")
