#!/usr/bin/env python3
"""OCAK kart basıcı (gündüz ve gece).

Zemin: bir görsel dosyası (Midjourney çıktısı, fotoğraf) ya da kodla çizilen
yerleşik zeminlerden biri. Metin Cormorant Garamond Italic ile bindirilir.

Kullanım örneği:
  python3 ocak_kart.py --zemin kirec --metin "Küllenen şey|*sönmüş değildir.*" \
      --cikti kart.png
  python3 ocak_kart.py --zemin zemin.png --tema gece --metin "Bir ateş vardı." --cikti k1.png

Metin sözdizimi: satırlar | ile ayrılır; *yıldız içi* vurgu rengiyle basılır.
"""
import argparse, os, math
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

BURASI = os.path.dirname(os.path.abspath(__file__))
F = lambda ad: os.path.join(BURASI, "fonts", ad)

RENK = dict(
    komur=(0x1A, 0x12, 0x10), krem=(0xF2, 0xEA, 0xE2), keten=(0xD9, 0xCB, 0xB6),
    toprak=(0xB4, 0x65, 0x4A), zeytin=(0x6E, 0x74, 0x53), altin=(0xD4, 0xA8, 0x55),
    koz=(0xC4, 0x4B, 0x2F), duman=(0x5C, 0x53, 0x50),
)
BOYUT = {"4:5": (1080, 1350), "9:16": (1080, 1920), "1:1": (1080, 1080)}


def _gurultu(w, h, olcekler=(6, 14, 40, 110), agirlik=(0.30, 0.34, 0.24, 0.12), tohum=7):
    """Çok ölçekli yumuşak gürültü, 0..1."""
    rng = np.random.default_rng(tohum)
    top = np.zeros((h, w), np.float32)
    for o, a in zip(olcekler, agirlik):
        kucuk = rng.random((max(2, h // (1350 // o) + 2), max(2, w // (1080 // o) + 2))).astype(np.float32)
        im = Image.fromarray((kucuk * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC)
        top += a * (np.asarray(im, np.float32) / 255.0)
    top -= top.min(); top /= max(top.max(), 1e-6)
    return top


def _duvar(w, h, taban, doku=0.04, tohum=7):
    """Sıvalı duvar: taban renk + mala dokusu + soldan gelen hafif ışık."""
    g = _gurultu(w, h, tohum=tohum)
    ince = _gurultu(w, h, olcekler=(150, 300), agirlik=(0.6, 0.4), tohum=tohum + 1)
    y, x = np.mgrid[0:h, 0:w].astype(np.float32)
    isik = 1.0 + 0.045 * (1 - x / w) - 0.035 * (y / h)          # sol üst biraz aydınlık
    carp = isik * (1 + doku * (g - 0.5) * 2 + 0.018 * (ince - 0.5) * 2)
    a = np.empty((h, w, 3), np.float32)
    for i in range(3):
        a[..., i] = taban[i] * carp
    return a


def _maske_yumusat(maske, yaricap):
    return np.asarray(Image.fromarray((maske * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(yaricap)), np.float32) / 255.0


def zemin_kirec(w, h, tohum=7):
    """D1 · kireç duvar: gölgedeki duvara pencereden düşen ışık."""
    a = _duvar(w, h, RENK["krem"], tohum=tohum)
    # duvarın tamamı hafif gölgede; pencere ışığı alt-sağda bir yamuk
    maske = Image.new("L", (w, h), 0)
    d = ImageDraw.Draw(maske)
    x0, y0 = int(w * 0.20), int(h * 0.61)
    gen, yuk, kay = int(w * 0.60), int(h * 0.29), int(w * 0.15)
    kose = [(x0 + kay, y0), (x0 + kay + gen, y0 + int(h * 0.04)), (x0 + gen, y0 + yuk + int(h * 0.04)), (x0, y0 + yuk)]
    d.polygon(kose, fill=255)
    # pencere kayıtları (iki dikey, bir yatay çıta gölgesi)
    for t in (0.34, 0.67):
        xa = kose[0][0] + t * (kose[1][0] - kose[0][0]); ya = kose[0][1] + t * (kose[1][1] - kose[0][1])
        xb = kose[3][0] + t * (kose[2][0] - kose[3][0]); yb = kose[3][1] + t * (kose[2][1] - kose[3][1])
        d.line([(xa, ya), (xb, yb)], fill=0, width=int(w * 0.022))
    t = 0.5
    xa = kose[0][0] + t * (kose[3][0] - kose[0][0]); ya = kose[0][1] + t * (kose[3][1] - kose[0][1])
    xb = kose[1][0] + t * (kose[2][0] - kose[1][0]); yb = kose[1][1] + t * (kose[2][1] - kose[1][1])
    d.line([(xa, ya), (xb, yb)], fill=0, width=int(w * 0.018))
    m = _maske_yumusat(np.asarray(maske, np.float32) / 255.0, w * 0.012)
    golge = 0.895                                   # duvarın gölgedeki payı
    carp = golge + (1.035 - golge) * m
    sicak = np.array([1.0, 0.972, 0.925], np.float32)  # gölge biraz ketene çeker
    a = a * carp[..., None] * (sicak + (1 - sicak) * m[..., None])
    return a


def _yaprak(d, cx, cy, boy, en, aci, dolgu=255):
    n = 24; pts = []
    for i in range(n + 1):
        t = i / n * math.pi
        px = boy * (math.cos(t)) / 1.0
        py = en * math.sin(t) ** 1.2
        pts.append((px, py))
    alt = [(px, -py) for px, py in reversed(pts)]
    ca, sa = math.cos(aci), math.sin(aci)
    d.polygon([(cx + px * ca - py * sa, cy + px * sa + py * ca) for px, py in pts + alt], fill=dolgu)


def zemin_zeytin_golgesi(w, h, tohum=11):
    """D2 · kireç duvarda zeytin dalı gölgesi (alt üçte bir)."""
    a = _duvar(w, h, RENK["krem"], tohum=tohum)
    rng = np.random.default_rng(tohum)
    maske = Image.new("L", (w, h), 0)
    d = ImageDraw.Draw(maske)
    dallar = [((w * 1.05, h * 0.60), (w * 0.18, h * 0.86)), ((w * 1.05, h * 0.78), (w * 0.40, h * 0.99)), ((w * 0.80, h * 0.50), (w * 0.52, h * 0.70))]
    for (xa, ya), (xb, yb) in dallar:
        adim = 15; ana = math.atan2(yb - ya, xb - xa)
        onceki = (xa, ya)
        for i in range(1, adim + 1):
            t = i / adim
            x = xa + (xb - xa) * t; y = ya + (yb - ya) * t + math.sin(t * 4) * h * 0.010
            d.line([onceki, (x, y)], fill=255, width=max(2, int(w * 0.0045 * (1.3 - t))))
            onceki = (x, y)
            yon = -1 if i % 2 else 1
            for yy in ((yon,) if rng.random() < 0.75 else (yon, -yon)):
                aci = ana + yy * (0.42 + rng.random() * 0.30)
                boy = w * (0.036 + rng.random() * 0.016) * (1.2 - 0.45 * t)
                _yaprak(d, x + math.cos(aci) * boy, y + math.sin(aci) * boy, boy, boy * 0.24, aci)
        _yaprak(d, xb + math.cos(ana) * w * 0.035, yb + math.sin(ana) * w * 0.035, w * 0.035, w * 0.008, ana)
    m = _maske_yumusat(np.asarray(maske, np.float32) / 255.0, w * 0.007)
    m2 = _maske_yumusat(np.asarray(maske, np.float32) / 255.0, w * 0.03)
    m = np.clip(0.7 * m + 0.3 * m2, 0, 1)
    ton = np.array([0.80, 0.80, 0.76], np.float32)   # gölge hafif zeytine çeker
    a = a * (1 - m[..., None] * (1 - ton))
    return a


def zemin_duz(w, h, renk, tohum=5, doku=0.05):
    """Tek renk dokulu zemin (keten, toprak, zeytin)."""
    a = _duvar(w, h, RENK[renk], doku=doku, tohum=tohum)
    y, x = np.mgrid[0:h, 0:w].astype(np.float32)
    kose = 1 - 0.07 * (((x / w - 0.5) ** 2 + (y / h - 0.5) ** 2) * 2)   # çok hafif kenar
    return a * kose[..., None]


def zemin_gece(w, h, tohum=3):
    """Önizleme için gece zemini (gerçek kartta Midjourney zemini kullanılır)."""
    a = _duvar(w, h, (30, 21, 18), doku=0.20, tohum=tohum)
    y, x = np.mgrid[0:h, 0:w].astype(np.float32)
    kor = np.exp(-(((x - w * 0.5) / (w * 0.55)) ** 2 + ((y - h * 1.02) / (h * 0.22)) ** 2))
    a[..., 0] += 95 * kor; a[..., 1] += 34 * kor; a[..., 2] += 12 * kor
    return a


ZEMINLER = {
    "kirec": zemin_kirec, "zeytin-golgesi": zemin_zeytin_golgesi,
    "keten": lambda w, h, tohum=5: zemin_duz(w, h, "keten", tohum), "toprak": lambda w, h, tohum=5: zemin_duz(w, h, "toprak", tohum, doku=0.06),
    "zeytin": lambda w, h, tohum=5: zemin_duz(w, h, "zeytin", tohum, doku=0.06), "krem": lambda w, h, tohum=5: zemin_duz(w, h, "krem", tohum),
    "gece": zemin_gece,
}
KOYU_ZEMIN = {"toprak", "zeytin", "gece"}


def _gren(a, guc=5.0, tohum=1):
    rng = np.random.default_rng(tohum)
    return a + rng.normal(0, guc, a.shape[:2]).astype(np.float32)[..., None]


def _kapla(im, w, h, yatay=0.5, dikey=0.5):
    """Görseli tuvale 'cover' mantığıyla oturtur."""
    o = max(w / im.width, h / im.height)
    im = im.resize((round(im.width * o), round(im.height * o)), Image.LANCZOS)
    sol = round((im.width - w) * yatay); ust = round((im.height - h) * dikey)
    return im.crop((sol, ust, sol + w, ust + h))


def _satir_ciz(d, y, parcalar, font, renk, vurgu, w, harf_araligi=0):
    """Ortalanmış satır; parçalar (metin, vurgulu_mu)."""
    gen = sum(d.textlength(m, font=font) + harf_araligi * max(len(m) - 1, 0) for m, _ in parcalar)
    x = (w - gen) / 2
    for m, v in parcalar:
        if harf_araligi:
            for ch in m:
                d.text((x, y), ch, font=font, fill=vurgu if v else renk); x += d.textlength(ch, font=font) + harf_araligi
        else:
            d.text((x, y), m, font=font, fill=vurgu if v else renk); x += d.textlength(m, font=font)


def _ayristir(satir):
    cik, v = [], False
    for p in satir.split("*"):
        if p: cik.append((p, v))
        v = not v
    return cik


def bas(zemin="kirec", metin="", alt="", bant="", oran="4:5", tema=None, vurgu=None,
        isaret=True, metin_ust=0.24, punto=None, yatay=0.5, dikey=0.5, kucuk_not="", tohum=None, ayna=False, yakin=1.0, agir=False):
    w, h = BOYUT[oran]
    if zemin in ZEMINLER:
        a = ZEMINLER[zemin](w, h) if tohum is None else ZEMINLER[zemin](w, h, tohum=tohum)
        if tema is None: tema = "gece" if zemin in KOYU_ZEMIN else "gunduz"
        a = _gren(a, 5.0 if tema == "gunduz" else 4.0)
        im = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))
    else:
        kaynak = Image.open(zemin).convert("RGB")
        if ayna: kaynak = kaynak.transpose(Image.FLIP_LEFT_RIGHT)   # tek kurucudan ikinci kadraj
        if yakin > 1.0:                                            # yakın kadraj: aynı duvar, başka kesit
            kw, kh = kaynak.width / yakin, kaynak.height / yakin
            kx, ky = (kaynak.width - kw) * yatay, (kaynak.height - kh) * dikey
            kaynak = kaynak.crop((round(kx), round(ky), round(kx + kw), round(ky + kh)))
        im = _kapla(kaynak, w, h, yatay, dikey)
        if tema is None:
            ust = np.asarray(im.crop((0, 0, w, int(h * 0.6))).convert("L"), np.float32).mean()
            tema = "gunduz" if ust > 128 else "gece"
    d = ImageDraw.Draw(im)
    if tema == "gunduz":
        renk, vurgu_r, isaret_r, bant_r = RENK["komur"], RENK[vurgu or "toprak"], RENK["koz"], RENK["duman"]
    else:
        renk, vurgu_r, isaret_r, bant_r = RENK["krem"], RENK[vurgu or ("altin" if zemin == "gece" or zemin not in ZEMINLER else "krem")], RENK["krem"], RENK["krem"]
    y = h * metin_ust
    if isaret:
        # İşaret: Cormorant Garamond Light "O". Açık zeminde tek renk köz (künye kuralı).
        # Gerçek basımda marka/ocak-isaret-mono-*.svg kullanılmalı; bu yaklaşık çizimdir.
        fi = ImageFont.truetype(F("CG-Light.ttf"), int(w * 0.105))
        b = d.textbbox((0, 0), "O", font=fi)
        d.text(((w - (b[2] - b[0])) / 2 - b[0], y - (b[3] - b[1]) - h * 0.045 - b[1]), "O", font=fi, fill=isaret_r)
    satirlar = [s for s in metin.split("|")]
    p = punto or (78 if max(len(s.replace("*", "")) for s in satirlar) <= 26 else 66)
    fb = ImageFont.truetype(F("CG-MedItalic.ttf" if agir else "CG-Italic.ttf"), int(p * w / 1080))   # agir: dokulu fotoğraf zemininde Medium Italic
    sarili = []
    for s in satirlar:                      # yıldızsız uzun satır kendiliğinden sarılır
        if "*" in s or d.textlength(s, font=fb) <= w * 0.84:
            sarili.append(s); continue
        satir = ""
        for kelime in s.split(" "):
            aday = (satir + " " + kelime).strip()
            if d.textlength(aday, font=fb) <= w * 0.80: satir = aday
            else: sarili.append(satir); satir = kelime
        sarili.append(satir)
    for s in sarili:
        _satir_ciz(d, y, _ayristir(s), fb, renk, vurgu_r, w)
        y += p * w / 1080 * (1.22 if s else 0.6)
    if alt:
        y += h * 0.022
        fa = ImageFont.truetype(F("CG-MedItalic.ttf" if agir else "CG-Italic.ttf"), int((50 if agir else 42) * w / 1080))
        for s in alt.split("|"):
            _satir_ciz(d, y, _ayristir(s), fa, renk, vurgu_r, w)
            y += 42 * w / 1080 * 1.3
    if kucuk_not:
        y += h * 0.012
        fn = ImageFont.truetype(F("Jost-Regular.ttf"), int(25 * w / 1080))
        _satir_ciz(d, y, [(kucuk_not, False)], fn, RENK["zeytin"] if tema == "gunduz" else bant_r, None, w, harf_araligi=2)
        y += 40
    if bant:
        y += h * 0.03
        fj = ImageFont.truetype(F("Jost-Regular.ttf"), int((32 if agir else 27) * w / 1080))
        _satir_ciz(d, y, [(bant, False)], fj, renk if agir else bant_r, None, w, harf_araligi=1)
    return im


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--zemin", default="kirec", help="dosya yolu ya da: " + ", ".join(ZEMINLER))
    ap.add_argument("--metin", required=True); ap.add_argument("--alt", default=""); ap.add_argument("--bant", default="")
    ap.add_argument("--not", dest="kucuk_not", default=""); ap.add_argument("--oran", default="4:5", choices=list(BOYUT))
    ap.add_argument("--tema", choices=["gunduz", "gece"]); ap.add_argument("--vurgu", choices=list(RENK))
    ap.add_argument("--isaretsiz", action="store_true"); ap.add_argument("--metin-ust", type=float, default=0.24)
    ap.add_argument("--punto", type=int); ap.add_argument("--yatay", type=float, default=0.5); ap.add_argument("--dikey", type=float, default=0.5)
    ap.add_argument("--tohum", type=int); ap.add_argument("--cikti", required=True)
    ap.add_argument("--agir", action="store_true", help="Medium Italic; fotoğraf zemininde okunurluk için"); ap.add_argument("--ayna", action="store_true", help="dosya zeminini yatay çevir"); ap.add_argument("--yakin", type=float, default=1.0, help="dosya zemininde yakınlaştırma (1.0–2.0)")
    k = ap.parse_args()
    bas(k.zemin, k.metin, k.alt, k.bant, k.oran, k.tema, k.vurgu, not k.isaretsiz, k.metin_ust, k.punto, k.yatay, k.dikey, k.kucuk_not, k.tohum, k.ayna, k.yakin, k.agir).save(k.cikti)
    print(k.cikti)
